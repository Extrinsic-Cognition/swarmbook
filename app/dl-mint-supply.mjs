// Read-only projection of the NFT MintCurve, not payment receipts or holders.
// ABI: poleis/program/poleis_treasury/src/nft_seat_state.rs (layout 8).
const PROGRAM = 'AJdsmjxQjHnBxDEdRxwEk2UMRW7bgNmvEMUwMziRTyab';
const MAINNET_GENESIS = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
const U64_MAX = (1n << 64n) - 1n;
const sameBytes = (a, b) => a.length === b.length && a.every((v, i) => v === b[i]);
const reject = (reason) => { throw new Error(reason); };

function scopeFor(config, web3) {
  if (config?.deployment == null) return null;
  if (config.network !== 'solana-mainnet-beta') reject('wrong-network');
  if (config.deployment.program !== PROGRAM) reject('unsupported-program');
  if (typeof config.unit !== 'string' || !/^(0|[1-9]\d*)$/.test(config.unit)
      || config.unit.length > 20 || BigInt(config.unit) > U64_MAX) reject('invalid-unit');
  const unit = BigInt(config.unit);
  const unitBytes = new Uint8Array(8);
  new DataView(unitBytes.buffer).setBigUint64(0, unit, true);
  const program = new web3.PublicKey(config.deployment.program);
  const [account, bump] = web3.PublicKey.findProgramAddressSync([
    new TextEncoder().encode('mint-curve'), unitBytes,
  ], program);
  return {
    unit, program, account, bump,
    genesis: new web3.PublicKey(MAINNET_GENESIS).toBytes(),
  };
}

function decode(info, scope) {
  if (!info) reject('missing-account');
  if (info.owner?.toBase58?.() !== scope.program.toBase58()) reject('wrong-owner');
  if (info.executable !== false) reject('executable-account');
  const bytes = info.data;
  if (!(bytes instanceof Uint8Array) || bytes.length !== 123) reject('invalid-length');
  if (bytes[0] !== 24) reject('wrong-discriminator');
  if (bytes[1] !== 8) reject('wrong-layout');
  if (bytes[2] !== scope.bump) reject('wrong-bump');
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const u64 = (offset) => view.getBigUint64(offset, true);
  if (u64(3) !== scope.unit) reject('wrong-unit');
  if (!sameBytes(bytes.subarray(91, 123), scope.genesis)) reject('wrong-account-genesis');
  const minted = u64(27), capacity = u64(35);
  if (capacity < 1n || capacity > 150n || minted > capacity) reject('invalid-supply');
  if (!bytes.subarray(59, 91).some((v) => v !== 0)) reject('missing-issuer');
  const opens = u64(43), closes = u64(51);
  if (closes <= opens || closes - opens > 1_296_000n) reject('invalid-window');
  const start = u64(11), step = u64(19);
  if (!start || !step || start + step * (capacity - 1n) > U64_MAX) reject('invalid-pricing');
  return { minted: Number(minted), capacity: Number(capacity), bytes: Uint8Array.from(bytes) };
}

/**
 * config is the existing warm-genesis.json shape: network, unit, deployment.program.
 * A null deployment performs no RPC. Only finalized account observations can
 * supply a count; unknown is never zero. The owner calls reconcile() on online /
 * visibility recovery. Connection handles its websocket reconnect internally;
 * this reader uses public APIs only and has no timer or rendering loop.
 *
 * onChange receives frozen {status,minted,capacity,slot,unit,program,account,reason}.
 * Errors retain the last good observation with status 'stale'. Slot-only changes
 * update state() without asking the renderer to repaint an unchanged liquid level.
 * 'live' describes the validated observation at slot, not websocket health: the
 * SDK's public account API does not expose disconnect or subscription-ack events.
 * Every RPC is let go after rpcTimeoutMs (a timer only while one is in flight): a
 * read that never settled held `pending`, and every later reconcile() got that
 * same stuck promise back, so no read was ever issued again (Oct 17 2026).
 */
export function createMintSupplyReader({ config, connection, web3, onChange = () => {}, rpcTimeoutMs = 8000 }) {
  // Pin this instance's scope. Publishing another deployment needs a new reader.
  const selected = {
    network: config?.network,
    unit: config?.unit,
    deployment: config?.deployment == null ? null : { program: config.deployment.program },
  };
  let current = Object.freeze({
    status: selected.deployment ? 'unknown' : 'unconfigured',
    minted: null, capacity: null, slot: null,
    unit: typeof selected.unit === 'string' ? selected.unit : null,
    program: selected.deployment?.program ?? null, account: null,
    reason: selected.deployment ? 'not-started' : 'unconfigured',
  });
  let active = false, epoch = 0, verified = false, scope = null;
  let subscription = null, retiring = null, pending = null, starting = null, cleanup = null;
  let lastGood = null, highSlot = -1, acceptedRevision = 0;
  const isCurrent = (generation) => active && generation === epoch;

  function publish(patch, force = false) {
    const next = Object.freeze({ ...current, ...patch });
    const changed = Object.keys(next).some((key) => key !== 'slot' && next[key] !== current[key]);
    current = next;
    if (changed || force) onChange(current);
    return current;
  }

  function fail(reason) {
    return publish({ status: lastGood ? 'stale' : 'unknown', reason });
  }

  function within(promise) {
    if (!(rpcTimeoutMs > 0)) return promise;
    let timer;
    const late = new Promise((_, rejectLate) => { timer = setTimeout(() => rejectLate(new Error('rpc-timeout')), rpcTimeoutMs); });
    return Promise.race([promise, late]).finally(() => clearTimeout(timer));
  }

  function accept(info, context, generation) {
    if (!isCurrent(generation) || !verified) return;
    const slot = context?.slot;
    if (!Number.isSafeInteger(slot) || slot < 0) { fail('invalid-slot'); return; }
    if (slot < highSlot) return;
    highSlot = slot;
    let value;
    try {
      value = decode(info, scope);
      if (lastGood) {
        // Several issuances can share a slot; slot is not an event identifier.
        if (slot === lastGood.slot && value.minted < lastGood.minted) return;
        if (value.minted < lastGood.minted) reject('count-regressed');
        // MintCurve terms are immutable; only bytes 27..34 (minted_count) move.
        if (!sameBytes(value.bytes.subarray(0, 27), lastGood.bytes.subarray(0, 27))
            || !sameBytes(value.bytes.subarray(35), lastGood.bytes.subarray(35))) reject('curve-changed');
      }
    } catch (error) {
      fail(error.message);
      return;
    }
    lastGood = { ...value, slot };
    acceptedRevision += 1;
    publish({ status: 'live', minted: value.minted, capacity: value.capacity, slot, reason: null });
  }

  async function read(generation) {
    // Do not accept callbacks while the connection's network domain is unchecked.
    verified = false;
    let genesis;
    try { genesis = await within(connection.getGenesisHash()); }
    catch { if (isCurrent(generation)) fail('rpc-unavailable'); return current; }
    if (!isCurrent(generation)) return current;
    if (genesis !== MAINNET_GENESIS) { fail('wrong-rpc-genesis'); return current; }
    verified = true;

    if (subscription === null) {
      try {
        subscription = connection.onAccountChange(scope.account,
          (info, context) => accept(info, context, generation), 'finalized');
      } catch {
        fail('subscription-unavailable');
        return current;
      }
    }
    const revision = acceptedRevision;
    let result;
    try {
      result = await within(connection.getAccountInfoAndContext(scope.account, {
        commitment: 'finalized', ...(highSlot >= 0 ? { minContextSlot: highSlot } : {}),
      }));
    } catch {
      // A newer finalized push can supersede an older failed HTTP request.
      if (isCurrent(generation) && revision === acceptedRevision) fail('rpc-unavailable');
      return current;
    }
    if (isCurrent(generation)) {
      if (result?.context?.slot < highSlot && revision === acceptedRevision) fail('stale-slot');
      else accept(result?.value, result?.context, generation);
    }
    return current;
  }

  function requestRead() {
    if (!active || !scope) return Promise.resolve(current);
    if (pending) return pending;
    const generation = epoch;
    const job = read(generation);
    pending = job;
    void job.finally(() => { if (pending === job) pending = null; }).catch(() => {});
    return job;
  }

  function reconcile() {
    return starting ?? requestRead();
  }

  function start() {
    if (active) return starting ?? pending ?? Promise.resolve(current);
    active = true;
    const generation = ++epoch;
    const job = (async () => {
      try { await retireSubscription(); }
      catch {
        if (isCurrent(generation)) { active = false; fail('subscription-cleanup-failed'); }
        return current;
      }
      if (!isCurrent(generation)) return current;
      try { scope = scopeFor(selected, web3); }
      catch (error) { return fail(error.message); }
      if (!scope) return publish({ status: 'unconfigured', reason: 'unconfigured' }, true);
      publish({
        status: 'connecting', reason: null,
        account: scope.account.toBase58(), program: scope.program.toBase58(),
      });
      if (!isCurrent(generation)) return current;
      return requestRead();
    })();
    starting = job;
    void job.finally(() => { if (starting === job) starting = null; }).catch(() => {});
    return job;
  }

  function retireSubscription() {
    if (cleanup) return cleanup;
    if (retiring === null) return Promise.resolve();
    const id = retiring;
    const job = Promise.resolve().then(() => connection.removeAccountChangeListener(id));
    cleanup = job;
    void job.then(() => { if (retiring === id) retiring = null; }).catch(() => {});
    void job.finally(() => { if (cleanup === job) cleanup = null; }).catch(() => {});
    return job;
  }

  async function stop() {
    active = false;
    verified = false;
    epoch += 1;
    pending = null;
    starting = null;
    if (subscription !== null) retiring = subscription;
    subscription = null;
    const generation = epoch;
    publish({ status: 'stopped', reason: null });
    try { await retireSubscription(); }
    catch {
      // pagehide may not await us. Keep the id for a later stop/start retry.
      if (epoch === generation) publish({ reason: 'subscription-cleanup-failed' });
    }
  }

  return Object.freeze({ start, stop, reconcile, state: () => current });
}

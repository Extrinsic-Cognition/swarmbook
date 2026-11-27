import test from 'node:test';
import assert from 'node:assert/strict';
import { createMintSupplyReader } from './dl-mint-supply.mjs';

const PROGRAM = 'AJdsmjxQjHnBxDEdRxwEk2UMRW7bgNmvEMUwMziRTyab';
const GENESIS = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
const PDA = 'Gxq4HQEiSbkLKDYCm5KwsxSUCWCPZEPmCTr8vc7jFzjJ';
// Synthetic bytes: these tests exercise the observer, not SDK base58/Ed25519.
const genesisBytes = Uint8Array.from({ length: 32 }, (_, i) => i + 1);
const config = () => ({ network: 'solana-mainnet-beta', unit: '0', deployment: { program: PROGRAM } });
const deferred = () => {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};
const until = async (condition) => {
  for (let i = 0; i < 20 && !condition(); i++) await Promise.resolve();
  assert.ok(condition(), 'expected asynchronous operation started');
};

class PublicKey {
  constructor(value) { this.value = value; }
  toBase58() { return this.value; }
  toBytes() { assert.equal(this.value, GENESIS); return genesisBytes.slice(); }
}

function account({ minted = 3n, capacity = 150n, unit = 0n } = {}) {
  const data = new Uint8Array(123);
  data.set([24, 8, 255]);
  const view = new DataView(data.buffer);
  for (const [offset, value] of [
    [3, unit], [11, 7n], [19, 3n], [27, minted], [35, capacity], [43, 10n], [51, 100n],
  ]) view.setBigUint64(offset, value, true);
  data.fill(1, 59, 91);
  data.set(genesisBytes, 91);
  return { owner: new PublicKey(PROGRAM), executable: false, data };
}
const snapshot = (value = account(), slot = 10) => ({ context: { slot }, value });
const setU64 = (info, offset, value) => new DataView(info.data.buffer).setBigUint64(offset, value, true);

function fixture(options = {}) {
  const calls = [], events = [], listeners = new Map(), derivations = [];
  let nextId = 0;
  const reads = [...(options.reads ?? [snapshot()])];
  const geneses = [...(options.geneses ?? [GENESIS])];
  class SDKPublicKey extends PublicKey {
    static findProgramAddressSync(seeds, program) {
      derivations.push({ seeds, program });
      return [new SDKPublicKey(PDA), 255];
    }
  }
  const connection = {
    async getGenesisHash() {
      calls.push(['genesis']);
      const result = geneses.length ? geneses.shift() : GENESIS;
      if (result instanceof Error) throw result;
      return result;
    },
    onAccountChange(key, callback, commitment) {
      calls.push(['subscribe', key.toBase58(), commitment]);
      if (options.subscribeError) throw new Error('websocket unavailable');
      const id = nextId++;
      listeners.set(id, callback);
      return id;
    },
    async getAccountInfoAndContext(key, settings) {
      calls.push(['read', key.toBase58(), settings]);
      const result = reads.length ? reads.shift() : snapshot();
      if (result instanceof Error) throw result;
      return result;
    },
    async removeAccountChangeListener(id) {
      calls.push(['remove', id]);
      if (options.removeWait) await options.removeWait;
      if (options.removeFailures > 0) {
        options.removeFailures -= 1;
        throw new Error('unsubscribe failed');
      }
      listeners.delete(id);
    },
  };
  const reader = createMintSupplyReader({
    config: options.config ?? config(), connection,
    web3: { PublicKey: SDKPublicKey }, onChange: (state) => events.push(state),
    ...(options.rpcTimeoutMs ? { rpcTimeoutMs: options.rpcTimeoutMs } : {}),
  });
  return {
    reader, calls, events, listeners, derivations, reads, geneses,
    push: (info, slot, id = nextId - 1) => listeners.get(id)?.(info, { slot }),
  };
}

test('unpublished genesis performs no RPC or derivation and never becomes zero', async () => {
  const f = fixture({ config: { ...config(), deployment: null, minted: 40, supply: 150 } });
  assert.equal((await f.reader.start()).status, 'unconfigured');
  assert.equal(f.events.length, 1, 'initial status is delivered even when already unconfigured');
  assert.equal(f.events[0].status, 'unconfigured');
  await f.reader.reconcile();
  assert.equal(f.reader.state().minted, null);
  assert.equal(f.reader.state().capacity, null);
  assert.deepEqual(f.calls, []);
  assert.deepEqual(f.derivations, []);
  await f.reader.stop();
  assert.deepEqual(f.calls, []);
});

test('initial finalized snapshot derives the configured unit PDA with the injected SDK', async () => {
  const unit = '18446744073709551615';
  const f = fixture({ config: { ...config(), unit }, reads: [snapshot(account({ unit: BigInt(unit), minted: 0n }))] });
  const state = await f.reader.start();
  assert.deepEqual(state, {
    status: 'live', minted: 0, capacity: 150, slot: 10, unit,
    program: PROGRAM, account: PDA, reason: null,
  });
  assert.ok(Object.isFrozen(state));
  assert.equal(new TextDecoder().decode(f.derivations[0].seeds[0]), 'mint-curve');
  assert.equal(new DataView(f.derivations[0].seeds[1].buffer).getBigUint64(0, true), BigInt(unit));
  assert.equal(f.derivations[0].program.toBase58(), PROGRAM);
  assert.deepEqual(f.calls, [
    ['genesis'], ['subscribe', PDA, 'finalized'], ['read', PDA, { commitment: 'finalized' }],
  ]);
  await f.reader.start();
  assert.equal(f.calls.length, 3, 'start is idempotent');
  await f.reader.stop();
  assert.deepEqual(f.calls.at(-1), ['remove', 0], 'subscription id zero is removed');
});

test('configuration rejects other networks, programs and non-u64 units without reads', async (t) => {
  const cases = [
    [{ ...config(), network: 'solana-devnet' }, 'wrong-network'],
    [{ ...config(), deployment: { program: 'another-program' } }, 'unsupported-program'],
    ...[undefined, 0, '-1', '01', '1.0', '18446744073709551616'].map((unit) => [{ ...config(), unit }, 'invalid-unit']),
  ];
  for (const [value, reason] of cases) await t.test(`${reason}: ${String(value.unit)}`, async () => {
    const f = fixture({ config: value });
    assert.equal((await f.reader.start()).reason, reason);
    assert.equal(f.reader.state().minted, null);
    assert.deepEqual(f.calls, []);
    await f.reader.stop();
  });
});

test('wrong RPC genesis prevents both subscription and account read', async () => {
  const f = fixture({ geneses: ['devnet-genesis'] });
  assert.equal((await f.reader.start()).reason, 'wrong-rpc-genesis');
  assert.deepEqual(f.calls, [['genesis']]);
  assert.equal(f.reader.state().minted, null);
  await f.reader.stop();
});

test('account owner, exact ABI, unit, PDA bump and genesis must all verify', async (t) => {
  const mutations = [
    ['wrong-owner', (a) => { a.owner = new PublicKey('other'); }],
    ['executable-account', (a) => { a.executable = true; }],
    ['invalid-length', (a) => { a.data = a.data.slice(1); }],
    ['wrong-discriminator', (a) => { a.data[0] = 23; }],
    ['wrong-layout', (a) => { a.data[1] = 7; }],
    ['wrong-bump', (a) => { a.data[2] = 254; }],
    ['wrong-unit', (a) => { setU64(a, 3, 1n); }],
    ['wrong-account-genesis', (a) => { a.data[91] ^= 1; }],
    ['invalid-supply', (a) => { setU64(a, 35, 0n); }],
    ['invalid-supply', (a) => { setU64(a, 35, 151n); }],
    ['invalid-supply', (a) => { setU64(a, 27, 151n); }],
    ['missing-issuer', (a) => { a.data.fill(0, 59, 91); }],
    ['invalid-window', (a) => { setU64(a, 51, 10n); }],
    ['invalid-window', (a) => { setU64(a, 51, 1_296_011n); }],
    ['invalid-pricing', (a) => { setU64(a, 11, 0n); }],
    ['invalid-pricing', (a) => { setU64(a, 19, 0n); }],
    ['invalid-pricing', (a) => { setU64(a, 11, (1n << 64n) - 1n); }],
  ];
  for (const [reason, mutate] of mutations) await t.test(reason, async () => {
    const info = account();
    mutate(info);
    const f = fixture({ reads: [snapshot(info)] });
    const state = await f.reader.start();
    assert.equal(state.status, 'unknown');
    assert.equal(state.reason, reason);
    assert.equal(state.minted, null);
    await f.reader.stop();
  });
});

test('missing account is unknown; its disappearance retains the last count as stale', async () => {
  const f = fixture({ reads: [snapshot(null), snapshot(null, 12)] });
  const first = await f.reader.start();
  assert.equal(first.status, 'unknown');
  assert.equal(first.reason, 'missing-account');
  assert.equal(first.minted, null);
  f.push(account({ minted: 5n }), 11);
  const stale = await f.reader.reconcile();
  assert.equal(stale.status, 'stale');
  assert.equal(stale.reason, 'missing-account');
  assert.equal(stale.minted, 5);
  assert.equal(stale.slot, 11, 'slot describes retained good observation');
  f.push(account({ minted: 6n }), 13);
  assert.equal(f.reader.state().status, 'live');
  await f.reader.stop();
});

test('duplicates do not repaint and stale slots cannot change the observed count', async () => {
  const f = fixture();
  await f.reader.start();
  const count = f.events.length;
  f.push(account(), 10);
  f.push(account(), 11);
  assert.equal(f.events.length, count, 'same count and state do not repaint');
  assert.equal(f.reader.state().slot, 11, 'latest validated slot remains available');
  f.push(account({ minted: 1n }), 9);
  assert.equal(f.reader.state().minted, 3);
  assert.equal(f.reader.state().status, 'live');
  f.push(account({ minted: 4n }), 12);
  assert.equal(f.events.length, count + 1);
  f.push(account({ minted: 5n }), 12);
  assert.equal(f.reader.state().status, 'live', 'multiple NFT issuances can share a slot');
  assert.equal(f.reader.state().minted, 5);
  f.push(account({ minted: 4n }), 12);
  assert.equal(f.reader.state().status, 'live', 'a delayed earlier count in the same slot is ignored');
  assert.equal(f.reader.state().minted, 5);
  f.push(account({ minted: 3n }), 13);
  assert.equal(f.reader.state().reason, 'count-regressed');
  f.push(account({ minted: 5n, capacity: 149n }), 14);
  assert.equal(f.reader.state().reason, 'curve-changed');
  assert.equal(f.reader.state().capacity, 150);
  await f.reader.stop();
});

test('a newer subscription observation wins over an in-flight initial snapshot', async () => {
  const wait = deferred();
  const f = fixture({ reads: [wait.promise] });
  const started = f.reader.start();
  await until(() => f.calls.some(([kind]) => kind === 'read'));
  f.push(account({ minted: 7n }), 20);
  wait.resolve(snapshot(account({ minted: 6n }), 19));
  const state = await started;
  assert.equal(state.minted, 7);
  assert.equal(state.slot, 20);
  assert.equal(state.status, 'live');
  await f.reader.stop();
});

test('explicit recovery rechecks genesis and reconciles a finalized snapshot without another listener', async () => {
  const f = fixture({ reads: [snapshot(), new Error('offline'), snapshot(account({ minted: 9n }), 15)] });
  await f.reader.start();
  const stale = await f.reader.reconcile();
  assert.equal(stale.status, 'stale');
  assert.equal(stale.minted, 3);
  const recovered = await f.reader.reconcile();
  assert.equal(recovered.status, 'live');
  assert.equal(recovered.minted, 9);
  assert.deepEqual(f.calls.filter(([kind]) => kind === 'read').at(-1), [
    'read', PDA, { commitment: 'finalized', minContextSlot: 10 },
  ]);
  assert.equal(f.calls.filter(([kind]) => kind === 'genesis').length, 3);
  assert.equal(f.calls.filter(([kind]) => kind === 'subscribe').length, 1);
  await f.reader.stop();
});

test('domain failure retains stale data and rejects pushes until domain recovery', async () => {
  const f = fixture({ geneses: [GENESIS, 'another-network', GENESIS], reads: [snapshot(), snapshot(account({ minted: 5n }), 12)] });
  await f.reader.start();
  assert.equal((await f.reader.reconcile()).status, 'stale');
  f.push(account({ minted: 100n }), 100);
  assert.equal(f.reader.state().minted, 3);
  const recovered = await f.reader.reconcile();
  assert.equal(recovered.status, 'live');
  assert.equal(recovered.minted, 5);
  await f.reader.stop();
});

test('concurrent reconciliation is coalesced and an older HTTP failure cannot stale a new push', async () => {
  const wait = deferred();
  const f = fixture({ reads: [snapshot(), wait.promise] });
  await f.reader.start();
  const first = f.reader.reconcile(), second = f.reader.reconcile();
  assert.equal(first, second);
  await until(() => f.calls.filter(([kind]) => kind === 'read').length === 2);
  f.push(account({ minted: 5n }), 12);
  wait.reject(new Error('HTTP request lost'));
  assert.equal((await first).status, 'live');
  assert.equal(f.reader.state().minted, 5);
  await f.reader.stop();
});

test('stop ignores in-flight reads and late callbacks, then restart uses a fresh listener', async () => {
  const wait = deferred();
  const f = fixture({ reads: [wait.promise, snapshot(account({ minted: 5n }), 12)] });
  const starting = f.reader.start();
  await until(() => f.listeners.size === 1);
  const oldCallback = f.listeners.get(0);
  await f.reader.stop();
  const eventCount = f.events.length;
  oldCallback(account({ minted: 99n }), { slot: 99 });
  wait.resolve(snapshot(account({ minted: 99n }), 99));
  await starting;
  assert.equal(f.events.length, eventCount);
  assert.equal(f.reader.state().status, 'stopped');
  assert.equal(f.reader.state().minted, null);
  await f.reader.reconcile();
  assert.equal(f.calls.filter(([kind]) => kind === 'read').length, 1);
  assert.equal((await f.reader.start()).minted, 5);
  oldCallback(account({ minted: 100n }), { slot: 100 });
  assert.equal(f.reader.state().minted, 5);
  assert.equal(f.listeners.size, 1);
  await f.reader.stop();
  assert.equal(f.listeners.size, 0);
});

test('stopping during genesis lookup never creates a subscription', async () => {
  const wait = deferred();
  const f = fixture({ geneses: [wait.promise] });
  const starting = f.reader.start();
  await until(() => f.calls.length === 1);
  await f.reader.stop();
  wait.resolve(GENESIS);
  assert.equal((await starting).status, 'stopped');
  assert.deepEqual(f.calls, [['genesis']]);
});

test('restart waits for asynchronous subscription cleanup', async () => {
  const wait = deferred();
  const f = fixture({ removeWait: wait.promise });
  await f.reader.start();
  const stopping = f.reader.stop();
  const restarting = f.reader.start();
  await until(() => f.calls.some(([kind]) => kind === 'remove'));
  assert.equal(f.calls.filter(([kind]) => kind === 'subscribe').length, 1);
  wait.resolve();
  await stopping;
  await restarting;
  assert.equal(f.calls.filter(([kind]) => kind === 'subscribe').length, 2);
  assert.equal(f.listeners.size, 1);
  await f.reader.stop();
});

test('concurrent start and reconcile await the same initial observation', async () => {
  const wait = deferred();
  const f = fixture({ reads: [wait.promise] });
  const first = f.reader.start(), second = f.reader.start(), recovery = f.reader.reconcile();
  assert.equal(first, second);
  assert.equal(first, recovery);
  await until(() => f.calls.some(([kind]) => kind === 'read'));
  wait.resolve(snapshot());
  assert.equal((await second).status, 'live');
  assert.equal(f.calls.filter(([kind]) => kind === 'subscribe').length, 1);
  await f.reader.stop();
});

test('failed listener removal is retained for retry without rejecting pagehide cleanup', async () => {
  const f = fixture({ removeFailures: 1 });
  await f.reader.start();
  await assert.doesNotReject(f.reader.stop());
  assert.equal(f.reader.state().status, 'stopped');
  assert.equal(f.reader.state().reason, 'subscription-cleanup-failed');
  const state = await f.reader.start();
  assert.equal(state.status, 'live');
  assert.equal(f.calls.filter(([kind]) => kind === 'remove').length, 2);
  assert.equal(f.listeners.size, 1);
  await f.reader.stop();
});

test('a read that never settles is let go at the bound, and the next reconcile asks again (Oct 17 2026)', async () => {
  const f = fixture({ reads: [new Promise(() => {}), snapshot()], rpcTimeoutMs: 25 });
  const first = await f.reader.start();
  assert.equal(first.status, 'unknown'); assert.equal(first.reason, 'rpc-unavailable');
  const second = await f.reader.reconcile();
  assert.equal(second.status, 'live');
  assert.equal(f.calls.filter((c) => c[0] === 'read').length, 2, 'the hung read did not hold the reader');
});

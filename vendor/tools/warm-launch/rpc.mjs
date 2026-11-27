// rpc.mjs · THE $WARM LAUNCH, the wire to a cluster (Oct 30 2026). Reads anywhere; sends only where the cluster's own genesis hash is devnet's, asked
// before the first send and on every new endpoint: no flag, URL or name turns a send towards mainnet. Signing is node:crypto's Ed25519 over a key the
// caller hands in (a throwaway devnet key from the scratchpad); this file opens no key file of its own.
import { createPrivateKey, createPublicKey, sign } from 'node:crypto';
import { base58Of } from '../embertide-mesh/pool/pool-genesis.mjs';
import { compile } from './chain.mjs';

export const GENESIS = Object.freeze({
  devnet: 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG',
  mainnet: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
});
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** A Solana CLI keypair (64 bytes: seed then public key) as a signer. */
export function signerOf(bytes) {
  const kp = Uint8Array.from(bytes);
  if (kp.length !== 64) throw new Error('a keypair is 64 bytes');
  const priv = createPrivateKey({ key: Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), Buffer.from(kp.subarray(0, 32))]), format: 'der', type: 'pkcs8' });
  const address = base58Of(createPublicKey(priv).export({ format: 'der', type: 'spki' }).subarray(12));
  if (address !== base58Of(kp.subarray(32))) throw new Error('a keypair whose public half does not match its seed');
  return { address, sign: (message) => new Uint8Array(sign(null, Buffer.from(message), priv)) };
}

export function cluster(url, { log = () => {} } = {}) {
  let id = 0, genesis = null;
  async function call(method, params = []) {
    for (let attempt = 0; ; attempt++) {
      try {
        const r = await fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: ++id, method, params }) });
        if (r.status === 429 && attempt < 8) { await sleep(800 * (attempt + 1)); continue; }
        const j = await r.json();
        if (j.error) { const e = new Error(`${method}: ${j.error.message}`); e.data = j.error.data; throw e; }
        return j.result;
      } catch (e) {
        if (e.data || attempt >= 4) throw e;
        await sleep(600 * (attempt + 1));
      }
    }
  }
  const which = async () => (genesis ??= await call('getGenesisHash'));
  async function devnetOnly() {
    const g = await which();
    if (g !== GENESIS.devnet) throw new Error(`refused: ${url} is not devnet (genesis ${g}); this tool sends nothing anywhere else`);
  }
  const accounts = async (keys) => {
    const out = [];
    for (let i = 0; i < keys.length; i += 100) {
      const r = await call('getMultipleAccounts', [keys.slice(i, i + 100), { encoding: 'base64', commitment: 'confirmed' }]);
      out.push(...r.value.map((v) => (v ? { ...v, data: Buffer.from(v.data[0], 'base64') } : null)));
    }
    return out;
  };
  const account = async (k) => (await accounts([k]))[0];
  const balance = async (k) => BigInt((await call('getBalance', [k, { commitment: 'confirmed' }])).value);
  const tokenAmount = async (k) => { const a = await account(k); return a ? a.data.readBigUInt64LE(64) : 0n; };
  const rent = async (bytes) => BigInt(await call('getMinimumBalanceForRentExemption', [bytes]));

  /** Compile, sign with every signer the message names, simulate, send and wait. Devnet only. Returns the signature, the units it used and its size. */
  async function send(instructions, payer, signers, { label = '', simulateOnly = false } = {}) {
    await devnetOnly();
    const byAddress = new Map(signers.map((s) => [s.address, s]));
    const { value } = await call('getLatestBlockhash', [{ commitment: 'confirmed' }]);
    const c = compile(instructions, payer, value.blockhash);
    const sigs = c.signers.map((a) => { const s = byAddress.get(a); if (!s) throw new Error(`${label}: no key for signer ${a}`); return s.sign(c.message); });
    const wire = Buffer.concat([Buffer.from([sigs.length]), ...sigs.map((s) => Buffer.from(s)), c.message]);
    if (wire.length > 1232) throw new Error(`${label}: ${wire.length} bytes, over the 1232 a transaction may carry`);
    const sim = await call('simulateTransaction', [wire.toString('base64'), { encoding: 'base64', commitment: 'confirmed', sigVerify: true }]);
    if (sim.value.err) {
      const e = new Error(`${label}: the simulation refused it: ${JSON.stringify(sim.value.err)}\n  ${(sim.value.logs || []).slice(-14).join('\n  ')}`);
      e.logs = sim.value.logs; throw e;
    }
    if (simulateOnly) return { simulated: true, units: sim.value.unitsConsumed, size: wire.length };
    const signature = await call('sendTransaction', [wire.toString('base64'), { encoding: 'base64', skipPreflight: true, maxRetries: 5 }]);
    for (let i = 0; i < 60; i++) {
      await sleep(1000);
      const st = (await call('getSignatureStatuses', [[signature]])).value[0];
      if (st?.err) throw new Error(`${label}: devnet refused ${signature}: ${JSON.stringify(st.err)}`);
      if (st && (st.confirmationStatus === 'confirmed' || st.confirmationStatus === 'finalized')) {
        log(`  ${label.padEnd(34)} ${signature}  ${sim.value.unitsConsumed} CU, ${wire.length} B`);
        return { signature, units: sim.value.unitsConsumed, size: wire.length, slot: st.slot };
      }
      if (i === 30) await call('sendTransaction', [wire.toString('base64'), { encoding: 'base64', skipPreflight: true, maxRetries: 5 }]).catch(() => {});
    }
    throw new Error(`${label}: ${signature} not confirmed in 60 s`);
  }
  return { url, call, which, devnetOnly, accounts, account, balance, tokenAmount, rent, send };
}

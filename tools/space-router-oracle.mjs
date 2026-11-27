#!/usr/bin/env node
// tools/space-router-oracle.mjs · THE ROUTER IS THE ORACLE, by his hand (Oct 30 2026, lane/the-router-is-the-oracle; the law: app/space-router-oracle.mjs, the
// door: worker/space-router.mjs). The door signs every receipt with the oracle's key and seals each hour's Merkle root; this tool makes that key and anchors a
// sealed root on Solana in a memo. The anchor is signed by a key of its own, a Solana keypair file kept at home: the hot key signs at the edge, the cold key
// signs the chain, so a leaked hot key can sign receipts but cannot put them under an anchored root.
//   node tools/space-router-oracle.mjs keygen
//       a new oracle key: its private JWK on stdout, for `| npx wrangler secret put SPACE_ROUTER_ORACLE_KEY --config wrangler.optimism-fit.jsonc`, its public
//       half on stderr. Nothing is kept here.
//   node tools/space-router-oracle.mjs root --door <url> --period <number|hour>
//       a past hour's sealed root, as the door says it
//   node tools/space-router-oracle.mjs anchor --door <url> --period <number|hour> --payer <keypair.json> [--send] [--rpc <url>]
//   node tools/space-router-oracle.mjs anchor --period <number|hour> --n <count> --root <hex> --by <hex> --payer <keypair.json> [--send] [--rpc <url>]
//       the root in a Memo-program transaction signed by the payer. Without --send it is printed, built with no network (the dry run); with --send it is sent
//       and read back, on devnet only: rpc.mjs asks the cluster's genesis hash before any send, so mainnet is refused until his word.
//   node tools/space-router-oracle.mjs check --sig <signature> [--rpc <url>]
//       an anchor read back from the cluster: its memo, its signer, its slot and its fee
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { newOracleKey, memoOf, memoRead, periodNamed } from '../app/space-router-oracle.mjs';
import { ROOT_PATH } from '../worker/space-router.mjs';
import { cluster, signerOf } from '../vendor/tools/warm-launch/rpc.mjs';
import { compile, P } from '../vendor/tools/warm-launch/chain.mjs';

export const DEVNET = 'https://api.devnet.solana.com';
export const MAX_TX = 1232;

/** the memo instruction: the memo's bytes, the payer as its one signer (the Memo program checks it signed) */
export const memoInstruction = (memo, payer) => ({ program: P.memo, keys: [{ key: payer, signer: true, writable: true }], data: Buffer.from(memo, 'utf8') });
/** the anchor's transaction, built and signed with no network (a zero blockhash): its size and its message, the dry run's */
export function anchorDraft(memo, payer) {
  const c = compile([memoInstruction(memo, payer.address)], payer.address);
  const wire = Buffer.concat([Buffer.from([1]), Buffer.from(payer.sign(c.message)), c.message]);
  if (wire.length > MAX_TX) throw new Error(`the anchor is ${wire.length} bytes, over the ${MAX_TX} a transaction carries`);
  return { size: wire.length, message: c.message };
}
/** an anchor read back: the memo its Memo instruction logged, its first signer, its slot and fee; null when the cluster does not hold it */
export async function readAnchor(c, signature) {
  const t = await c.call('getTransaction', [signature, { encoding: 'json', commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
  if (!t) return null;
  const said = (t.meta?.logMessages || []).map((l) => /^Program log: Memo \(len \d+\): "(.*)"$/.exec(l)?.[1]).find(Boolean) ?? null;
  return { slot: t.slot, fee: t.meta?.fee ?? null, signer: t.transaction?.message?.accountKeys?.[0] ?? null, memo: said, read: memoRead(said), err: t.meta?.err ?? null };
}
/** send the anchor on devnet and read it back: the memo on the chain must be the memo sent */
export async function anchorSend(memo, payer, { rpc = DEVNET, log = () => {} } = {}) {
  const c = cluster(rpc, { log });
  const sent = await c.send([memoInstruction(memo, payer.address)], payer.address, [payer], { label: 'the oracle\'s anchor' });
  let back = null;
  for (let i = 0; i < 10 && !back; i++) { back = await readAnchor(c, sent.signature); if (!back) await new Promise((r) => setTimeout(r, 1500)); }
  if (!back || back.memo !== memo) throw new Error(`the chain holds ${back ? `another memo: ${back.memo}` : 'nothing'} for ${sent.signature}`);
  return { ...sent, ...back };
}

const flag = (argv, k) => { const i = argv.indexOf(k); return i > 0 && i + 1 < argv.length ? argv[i + 1] : null; };
async function rootFromDoor(door, period) {
  const r = await fetch(`${door.replace(/\/+$/, '')}${ROOT_PATH}?period=${period}`, { signal: AbortSignal.timeout(20_000) });
  const j = await r.json().catch(() => null);
  if (!r.ok) throw new Error(`the door said ${r.status}: ${j?.error?.message || 'no answer'}`);
  return j;
}

async function main(argv) {
  const [cmd] = argv;
  if (cmd === 'keygen') {
    const k = await newOracleKey();
    process.stdout.write(`${k.secret}\n`);
    process.stderr.write(`the oracle's public key: ${k.publicHex}\nput the private half in place by piping this command into: npx wrangler secret put SPACE_ROUTER_ORACLE_KEY --config wrangler.optimism-fit.jsonc\n`);
    return;
  }
  const rpc = flag(argv, '--rpc') || DEVNET, period = periodNamed(flag(argv, '--period'));
  if (cmd === 'root') {
    if (!flag(argv, '--door') || period === null) throw new Error('root --door <url> --period <number|hour>');
    console.log(JSON.stringify(await rootFromDoor(flag(argv, '--door'), period), null, 1));
    return;
  }
  if (cmd === 'anchor') {
    if (period === null || !flag(argv, '--payer')) throw new Error('anchor --period <number|hour> --payer <keypair.json>, and --door <url> or --n --root --by');
    const seal = flag(argv, '--door') ? await rootFromDoor(flag(argv, '--door'), period) : { period, n: Number(flag(argv, '--n')), root: flag(argv, '--root'), by: flag(argv, '--by') };
    if (!(seal.n > 0) || !/^[0-9a-f]{64}$/.test(seal.root || '') || !/^[0-9a-f]{64}$/.test(seal.by || '')) throw new Error(`nothing to anchor: ${JSON.stringify(seal)}`);
    const memo = memoOf(seal), payer = signerOf(JSON.parse(readFileSync(flag(argv, '--payer'), 'utf8')));
    const draft = anchorDraft(memo, payer);
    console.log(JSON.stringify({ memo, payer: payer.address, bytes: draft.size, sent: false }));
    if (!argv.includes('--send')) { console.log('a dry run: nothing was sent (add --send to anchor it on devnet)'); return; }
    const a = await anchorSend(memo, payer, { rpc, log: (l) => console.log(l) });
    console.log(JSON.stringify({ signature: a.signature, slot: a.slot, fee_lamports: a.fee, bytes: a.size, units: a.units, memo_on_chain: a.memo === memo, signer: a.signer,
      explorer: `https://explorer.solana.com/tx/${a.signature}?cluster=devnet` }));
    return;
  }
  if (cmd === 'check') {
    const sig = flag(argv, '--sig'); if (!sig) throw new Error('check --sig <signature>');
    console.log(JSON.stringify(await readAnchor(cluster(rpc), sig)));
    return;
  }
  throw new Error('keygen | root | anchor | check (the head of this file says how)');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main(process.argv.slice(2)).catch((e) => { console.error(`space-router-oracle: ${e.message}`); process.exit(1); });

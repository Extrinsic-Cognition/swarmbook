#!/usr/bin/env node
// tracenet-subscribe.proof.mjs: THE AGENTS SUBSCRIBE, proven on devnet. The Worker's own handler (worker/premint.mjs, its vault and its creators door)
// is served on 127.0.0.1 with a scratch D1 (every migration) holding one invented creator with a price and one fresh drop, its bucket in memory, and
// its node devnet (SOLANA_CLUSTER devnet). An invented fan agent with a Nest seat's key is funded by the devnet deployer and does everything else
// through the agent's own command line (tools/tracenet-subscribe.mjs): it reads the terms from the 402, pays with its own key, and reads the drop.
// A stranger replays the payment's signature, then pays too little. The clock then runs past the subscription's days. Exit 0 when every check holds.
//   node tools/tracenet-subscribe.proof.mjs [--rpc https://api.devnet.solana.com] [--funder <solana keypair json>]
// Devnet only: the funder's key is read from its file and never printed; the agents' keys live in a scratch folder removed after.
import http from 'node:http';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash, generateKeyPairSync } from 'node:crypto';
import { execFile } from 'node:child_process';
import { homedir, tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHandler } from '../worker/premint.mjs'; import { d1, migrated } from '../worker/d1-on-sqlite.mjs';   // D1's surface on node:sqlite, every migration
import { SYSTEM, decode58, encode58 } from '../app/dl-direct-protocol.mjs';
import { DAY_MS, SUBSCRIPTION_DAYS } from '../app/tracenet-register.mjs';
import { subscribeMessage, signedSubscription } from '../app/tracenet-subscribe.mjs';
import { DEVNET, signerOf, rpcOf, registerOf, readDrop, subscribe } from './tracenet-subscribe.mjs';

const here = fileURLToPath(new URL('.', import.meta.url));
const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const RPC = arg('rpc', DEVNET), FUNDER = arg('funder', join(homedir(), '.embertide/poleis-rehearsal/api.devnet.solana.com/keys/deployer.json'));
const rpc = rpcOf(RPC), sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const checks = [], check = (ok, what) => { checks.push({ ok: !!ok, what }); console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); };
const sha = (b) => createHash('sha256').update(b).digest('hex');
const seatKey = (seat) => { const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  return { seat, key: publicKey.export({ format: 'der', type: 'spki' }).toString('hex'), private_pem: privateKey.export({ format: 'pem', type: 'pkcs8' }) }; };
const run = (args) => new Promise((resolve) => execFile(process.execPath, [join(here, 'tracenet-subscribe.mjs'), ...args], { timeout: 180000 }, (err, stdout, stderr) => resolve({ code: err ? err.code ?? 1 : 0, stdout, stderr })));

/** a plain transfer from the funder to each of `tos`, one transaction (the proof's own: the funder is no agent) */
function transferMessage(from, tos, blockhash) {
  const data = (lamports) => { const d = new Uint8Array(12), v = new DataView(d.buffer); v.setUint32(0, 2, true); v.setBigUint64(4, BigInt(lamports), true); return d; };
  const keys = [from, ...tos.map((t) => t.to), SYSTEM], sys = keys.length - 1;
  return Uint8Array.from([1, 0, 1, keys.length, ...keys.flatMap((k) => [...decode58(k, 32)]), ...decode58(blockhash, 32), tos.length,
    ...tos.flatMap((t, i) => [sys, 2, 0, i + 1, 12, ...data(t.lamports)])]);
}
async function settle(signature, level = 'finalized', waitMs = 120000) {
  const t0 = Date.now();
  while (Date.now() - t0 < waitMs) {
    const s = (await rpc('getSignatureStatuses', [[signature], { searchTransactionHistory: true }]))?.value?.[0];
    if (s?.err) throw new Error(`failed: ${JSON.stringify(s.err)}`);
    if (s && (s.confirmationStatus === level || s.confirmationStatus === 'finalized')) return Date.now() - t0;
    await sleep(1200);
  }
  throw new Error(`not ${level} in ${waitMs} ms: ${signature}`);
}

const dir = mkdtempSync(join(tmpdir(), 'tracenet-subscribe-proof-'));
const db = migrated();
let server;
try {
  // the scratch Worker: every migration, one invented creator with a price, one drop published an hour ago (shut to everyone for 15 days)
  const CREATOR = signerOf(seatKey('creator-proof')), HANDLE = 'a_test_creator', PRICE = 10_000_000;
  const state = { now: Date.now() }, bucket = new Map();
  const addDrop = (id, published, body) => {
    const bytes = Buffer.from(body);
    db.prepare('INSERT INTO drops(handle,id,title,kind,file,bytes,sha256,published) VALUES(?,?,?,?,?,?,?,?)').run(HANDLE, id, `A trace: ${id}`, 'trace', 'trace.md', bytes.length, sha(bytes), new Date(published).toISOString());
    bucket.set(`vault/${HANDLE}/${id}/trace.md`, bytes);
  };
  db.prepare('INSERT INTO creators(handle,name,wallet,subscribe_lamports,created_at,updated_at) VALUES(?,?,?,?,1,1)').run(HANDLE, 'A test creator', CREATOR.address, PRICE);
  addDrop('2026-10-30-a-fresh-trace', state.now - 3600_000, '# a fresh trace\nthe steps, the dead ends, the fix.\n');
  const DB = d1(db);
  const VAULT = { get: async (key) => (bucket.has(key) ? { body: bucket.get(key), size: bucket.get(key).length, httpMetadata: { contentType: 'text/markdown' } } : null) };
  const env = { DB, VAULT, SOLANA_RPC: RPC, SOLANA_CLUSTER: 'devnet', ASSETS: { fetch: async () => new Response('no such asset', { status: 404 }) } };
  const handler = createHandler({ clock: () => Math.floor(state.now / 1000), clockMs: () => state.now });
  server = http.createServer(async (req, res) => {
    const response = await handler(new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers: req.headers }), env);
    res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(Buffer.from(await response.arrayBuffer()));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const SITE = `http://127.0.0.1:${server.address().port}`;
  console.log(`THE AGENTS SUBSCRIBE on devnet (${RPC}); the Worker's handler on ${SITE}; creator ${HANDLE}, price ${PRICE} lamports for ${SUBSCRIPTION_DAYS} days`);

  // the agents: a fan with a Nest seat's key on disk (the command line reads it from there), and a stranger
  const fanRecord = seatKey('agent-fan-proof'), FAN = signerOf(fanRecord), STRANGER = signerOf(seatKey('agent-stranger-proof'));
  const fanFile = join(dir, 'agent-fan-proof.key.json'); writeFileSync(fanFile, JSON.stringify(fanRecord), { mode: 0o600 });
  const funder = signerOf(JSON.parse(readFileSync(FUNDER, 'utf8')));
  const before = await rpc('getBalance', [funder.address, { commitment: 'confirmed' }]);
  const { value: bh } = await rpc('getLatestBlockhash', [{ commitment: 'confirmed' }]);
  const fund = transferMessage(funder.address, [{ to: FAN.address, lamports: 20_000_000 }, { to: STRANGER.address, lamports: 5_000_000 }], bh.blockhash);
  const fundSig = await rpc('sendTransaction', [signedSubscription(fund, funder.sign(fund)), { encoding: 'base64', preflightCommitment: 'confirmed' }]);
  await settle(fundSig, 'confirmed');
  console.log(`  funded by the devnet deployer (${(before.value / 1e9).toFixed(3)} SOL before): ${fundSig}`);

  // 1. the agent asks with its seat proof alone: 402, and the terms in it
  const register = await registerOf({ site: SITE, handle: HANDLE }), drop = register.items[0];
  const first = await readDrop({ site: SITE, register, id: drop.id, signer: FAN, now: state.now });
  const firstBody = await first.json();
  check(first.status === 402 && firstBody.subscribe?.lamports === String(PRICE) && firstBody.subscribe?.payee === CREATOR.address,
    `the fresh drop meets the agent with 402 and the terms: ${firstBody.subscribe?.lamports} lamports to ${firstBody.subscribe?.payee?.slice(0, 8)}…, ${firstBody.subscribe?.days} days`);

  // 2. the agent subscribes with its own key, through its own command line
  const sub = await run(['subscribe', '--site', SITE, '--handle', HANDLE, '--key', fanFile, '--rpc', RPC]);
  const held = sub.code === 0 ? JSON.parse(sub.stdout) : null;
  check(held && held.subscriber === FAN.address && held.lamports === String(PRICE),
    held ? `the agent paid ${held.lamports} lamports from its own key, finalized in ${(held.ms / 1000).toFixed(1)} s: ${held.signature} (fee ${held.fee} lamports, ${held.bytes} bytes)` : `the subscribe command failed: ${sub.stderr.trim()}`);
  if (!held) throw new Error('no subscription to go on with');

  // 3. it reads the drop through its own command line: 200, the register's bytes
  const out = join(dir, 'drop.md'), t3 = performance.now();
  const read = await run(['read', '--site', SITE, '--handle', HANDLE, '--key', fanFile, '--signature', held.signature, '--id', drop.id, '--out', out]);
  const gateMs = performance.now() - t3;
  check(read.code === 0 && sha(readFileSync(out)) === drop.sha256, `the drop opens to the agent: ${drop.bytes} bytes, sha256 ${drop.sha256.slice(0, 12)}… as the register says (the read, with the gate's chain lookup, ${gateMs.toFixed(0)} ms)`);

  // 4. a stranger shows the same payment with its own seat proof
  const replay = await readDrop({ site: SITE, register, id: drop.id, signer: STRANGER, signature: held.signature, now: state.now });
  check(replay.status === 402, `a stranger replaying the agent's signature meets ${replay.status}: the payment is the paying key's alone`);

  // 5. the stranger pays a tenth of the price, with the right memo
  const { value: bh2 } = await rpc('getLatestBlockhash', [{ commitment: 'finalized' }]);
  const cheap = subscribeMessage({ subscriber: STRANGER.address, payee: CREATOR.address, lamports: PRICE / 10, blockhash: bh2.blockhash, handle: HANDLE });
  const cheapSig = await rpc('sendTransaction', [signedSubscription(cheap, STRANGER.sign(cheap)), { encoding: 'base64', preflightCommitment: 'confirmed' }]);
  await settle(cheapSig, 'finalized');
  const under = await readDrop({ site: SITE, register, id: drop.id, signer: STRANGER, signature: cheapSig, now: state.now });
  check(under.status === 402, `an underpaid subscription (${PRICE / 10} lamports, finalized: ${cheapSig.slice(0, 12)}…) meets ${under.status}`);

  // 6. past the subscription's days: a drop published after them stays shut to the agent
  const until = Date.parse(held.until);
  state.now = until + 3600_000;
  addDrop('2026-12-01-a-later-trace', until + 600_000, '# a later trace\nafter the month.\n');
  const later = (await registerOf({ site: SITE, handle: HANDLE })).items.find((i) => i.id === '2026-12-01-a-later-trace');
  const late = await readDrop({ site: SITE, register: { ...register, items: [later] }, id: later.id, signer: FAN, signature: held.signature, now: state.now });
  check(late.status === 402, `after ${SUBSCRIPTION_DAYS} days (until ${held.until}), a later drop meets ${late.status} with the same payment`);

  // 7. what it cost, from the chain
  const creatorGot = await rpc('getBalance', [CREATOR.address, { commitment: 'finalized' }]);
  check(creatorGot.value === PRICE + PRICE / 10, `the creator's payee holds ${creatorGot.value} lamports: the agent's ${PRICE} and the stranger's ${PRICE / 10}, nothing else`);
  console.log(`  devnet explorer: https://explorer.solana.com/tx/${held.signature}?cluster=devnet`);
} catch (e) { check(false, `the proof threw: ${e.stack || e.message}`); }
finally { server?.close(); rmSync(dir, { recursive: true, force: true }); }
const bad = checks.filter((c) => !c.ok);
console.log(bad.length ? `\n  FAIL: ${bad.length} of ${checks.length} checks` : `\n  PASS: ${checks.length} of ${checks.length} checks`);
process.exit(bad.length ? 1 : 0);

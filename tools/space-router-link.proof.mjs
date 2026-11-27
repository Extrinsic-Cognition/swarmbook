#!/usr/bin/env node
// space-router-link.proof.mjs: A STAKE PAYS ITS TANK, proven on devnet.
// THE STAGE. The Worker's own handler (worker/premint.mjs, its Space Router doors and the link door) is served on 127.0.0.1, over a scratch D1 (every
// migration) whose node is devnet (SOLANA_CLUSTER devnet). The devnet deployer funds an invented staker, and the staker makes a stake account of its own
// (CreateAccount and the stake program's Initialize, the staker its withdraw authority) and links it with its own key.
// THE CHECKS:
//   - the link makes the staker's own tank and hands its key back once;
//   - the key opens that tank at Space Router's own /tank door, and is nowhere in D1;
//   - a second link hands back no key; a new key on its own statement shuts out the old one;
//   - a stranger's link of the same stake is refused, and so is a link of an account that is no stake;
//   - the crank's edge epoch reads the link on devnet's own rewards: a stake made this epoch has none, so no row;
//   - with a stand-in reward of one SOL, written as his hand writes it, the fuel rises at the door, and the same epoch is never poured twice.
// Exit 0 when every check holds.
//   node tools/space-router-link.proof.mjs [--rpc https://api.devnet.solana.com] [--funder <solana keypair json>]
// Devnet only. The funder's key is read from its file and never printed; the staker's and the stake's keys live only in this process; the tank's key is never
// printed.
import http from 'node:http';
import { readFileSync } from 'node:fs';
import { createHash, generateKeyPairSync } from 'node:crypto';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createHandler } from '../worker/premint.mjs'; import { d1, migrated } from '../worker/d1-on-sqlite.mjs';   // D1's surface on node:sqlite, every migration
import { LINK_PATH, STAKE_PROGRAM, linkSignIn, sealLinkProof, tankOfAuthority } from '../worker/space-router-link.mjs';
import { SYSTEM, decode58 } from '../app/dl-direct-protocol.mjs';
import { DEVNET, signerOf, rpcOf } from './tracenet-subscribe.mjs';
import { refillSql } from './space-router-tank.mjs';
import { runEdgeEpoch } from '../vendor/tools/embertide-mesh/pool/pool-crank.mjs';

const arg = (k, d) => { const i = process.argv.indexOf(`--${k}`); return i > 0 ? process.argv[i + 1] : d; };
const RPC = arg('rpc', DEVNET), FUNDER = arg('funder', join(homedir(), '.embertide/poleis-rehearsal/api.devnet.solana.com/keys/deployer.json'));
const rpc = rpcOf(RPC), sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const RENT = 'SysvarRent111111111111111111111111111111111';
const checks = [], check = (ok, what) => { checks.push({ ok: !!ok, what }); console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${what}`); };
const sha = (s) => createHash('sha256').update(s).digest('hex');
const newSigner = () => { const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  return signerOf({ seat: 'proof', key: publicKey.export({ format: 'der', type: 'spki' }).toString('hex'), private_pem: privateKey.export({ format: 'pem', type: 'pkcs8' }) }); };
const u32 = (n) => { const b = new Uint8Array(4); new DataView(b.buffer).setUint32(0, n, true); return [...b]; };
const u64 = (n) => { const b = new Uint8Array(8); new DataView(b.buffer).setBigUint64(0, BigInt(n), true); return [...b]; };
const key32 = (a) => [...decode58(a, 32)];

/** one transaction: the payer and every other signer sign the message; legacy wire */
const wire = (message, signatures) => Buffer.from(Uint8Array.from([signatures.length, ...signatures.flatMap((s) => [...s]), ...message])).toString('base64');
/** a plain transfer from the funder to one address */
function transferMessage(from, to, lamports, blockhash) {
  return Uint8Array.from([1, 0, 1, 3, ...key32(from), ...key32(to), ...key32(SYSTEM), ...key32(blockhash), 1, 2, 2, 0, 1, 12, ...u32(2), ...u64(lamports)]);
}
/** a stake account of the staker's own: CreateAccount (200 bytes, owned by the stake program) and Initialize (the staker its staker and withdraw authority) */
function stakeAccountMessage(payer, stake, lamports, blockhash) {
  const create = [...u32(0), ...u64(lamports), ...u64(200), ...key32(STAKE_PROGRAM)];
  const init = [...u32(0), ...key32(payer), ...key32(payer), ...u64(0), ...u64(0), ...new Array(32).fill(0)];
  return Uint8Array.from([2, 0, 3, 5, ...key32(payer), ...key32(stake), ...key32(SYSTEM), ...key32(STAKE_PROGRAM), ...key32(RENT), ...key32(blockhash),
    2, 2, 2, 0, 1, create.length, ...create, 3, 2, 1, 4, init.length, ...init]);
}
async function settle(signature, waitMs = 120000) {
  const t0 = Date.now();
  while (Date.now() - t0 < waitMs) {
    const s = (await rpc('getSignatureStatuses', [[signature], { searchTransactionHistory: true }]))?.value?.[0];
    if (s?.err) throw new Error(`failed: ${JSON.stringify(s.err)}`);
    if (s?.confirmationStatus === 'finalized') return Date.now() - t0;
    await sleep(1500);
  }
  throw new Error(`not finalized in ${waitMs} ms: ${signature}`);
}

const db = migrated();
let server, code = 1;
try {
  const DB = d1(db);
  const env = { DB, SOLANA_RPC: RPC, SOLANA_CLUSTER: 'devnet', ASSETS: { fetch: async () => new Response('no such asset', { status: 404 }) } };
  const handler = createHandler({});
  server = http.createServer(async (req, res) => {
    const chunks = []; for await (const c of req) chunks.push(c);
    const response = await handler(new Request(`http://${req.headers.host}${req.url}`, { method: req.method, headers: req.headers, body: chunks.length ? Buffer.concat(chunks) : undefined }), env);
    res.writeHead(response.status, Object.fromEntries(response.headers)); res.end(Buffer.from(await response.arrayBuffer()));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  const SITE = `http://127.0.0.1:${server.address().port}`, HOST = new URL(SITE).host;
  console.log(`A STAKE PAYS ITS TANK on devnet (${RPC}); the Worker's handler on ${SITE}`);
  const link = async (signer, stake, { rekey = false } = {}) => {
    const text = linkSignIn({ host: HOST, origin: SITE, authority: signer.address, stake, cluster: 'devnet', rekey });
    const r = await fetch(`${SITE}${LINK_PATH}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ proof: sealLinkProof(text, signer.sign(new TextEncoder().encode(text))) }) });
    return { status: r.status, body: await r.json() };
  };
  const tankAt = async (key) => { const r = await fetch(`${SITE}/space-router/v1/tank`, { headers: { authorization: `Bearer ${key}` } }); return { status: r.status, body: await r.json() }; };

  // the staker and its stake account, on devnet
  const funder = signerOf(JSON.parse(readFileSync(FUNDER, 'utf8'))), staker = newSigner(), stakeKey = newSigner(), stranger = newSigner();
  const rent = await rpc('getMinimumBalanceForRentExemption', [200]);
  const { value: bh } = await rpc('getLatestBlockhash', [{ commitment: 'finalized' }]);
  const fund = transferMessage(funder.address, staker.address, rent + 1_000_000, bh.blockhash);
  const fundSig = await rpc('sendTransaction', [wire(fund, [funder.sign(fund)]), { encoding: 'base64', preflightCommitment: 'confirmed' }]);
  await settle(fundSig);
  const { value: bh2 } = await rpc('getLatestBlockhash', [{ commitment: 'finalized' }]);
  const make = stakeAccountMessage(staker.address, stakeKey.address, rent, bh2.blockhash);
  const t0 = Date.now(), makeSig = await rpc('sendTransaction', [wire(make, [staker.sign(make), stakeKey.sign(make)]), { encoding: 'base64', preflightCommitment: 'confirmed' }]);
  await settle(makeSig);
  const info = await rpc('getAccountInfo', [stakeKey.address, { encoding: 'jsonParsed', commitment: 'finalized' }]);
  check(info?.value?.owner === STAKE_PROGRAM && info.value.data?.parsed?.info?.meta?.authorized?.withdrawer === staker.address,
    `the staker made its own stake account ${stakeKey.address.slice(0, 8)}…, ${rent} lamports, the staker its withdraw authority, finalized in ${((Date.now() - t0) / 1000).toFixed(1)} s: ${makeSig}`);

  // 1. the link: the staker's own tank, its key handed back once
  const t1 = performance.now(), first = await link(staker, stakeKey.address), linkMs = performance.now() - t1, tank = await tankOfAuthority(staker.address);
  check(first.status === 200 && first.body.tank === tank && /^sr_/.test(first.body.key || ''),
    `the staker links its stake with its own key: ${first.status}, its tank ${first.body.tank}, a key handed back once (the door's chain read included, ${linkMs.toFixed(0)} ms)`);
  const key = first.body.key, rows = JSON.stringify([db.prepare('SELECT * FROM sr_tanks').all(), db.prepare('SELECT * FROM sr_links').all()]);
  check(!rows.includes(key) && db.prepare('SELECT key_sha256 FROM sr_tanks WHERE name = ?').get(tank)?.key_sha256 === sha(key), 'the key is nowhere in D1: only its sha256');
  const open = await tankAt(key);
  check(open.status === 200 && open.body.tank === tank && open.body.fuel_usd === 0, `the key opens the staker's tank at Space Router's own door: ${open.status}, ${open.body.tank}, $${open.body.fuel_usd} of fuel`);

  // 2. a second link, a new key, a stranger, an account that is no stake
  const again = await link(staker, stakeKey.address);
  check(again.status === 200 && again.body.key === null && again.body.tank === tank, 'a second link answers the same tank and no key');
  const fresh = await link(staker, stakeKey.address, { rekey: true }), shut = await tankAt(key), opened = await tankAt(fresh.body.key || 'x');
  check(fresh.status === 200 && /^sr_/.test(fresh.body.key || '') && shut.status === 401 && opened.status === 200, `a new key on its own statement: the old key meets ${shut.status}, the new one ${opened.status}`);
  const theirs = await link(stranger, stakeKey.address);
  check(theirs.status === 403, `a stranger linking the staker's stake meets ${theirs.status}: ${theirs.body.error?.message}`);
  const wallet = await link(staker, staker.address);
  check(wallet.status === 422, `a link of the staker's wallet, which is no stake account, meets ${wallet.status}`);

  // 3. the crank's edge epoch on devnet's own rewards: a stake made this epoch earned none
  const d1 = {
    links: async (cluster) => db.prepare('SELECT stake, tank FROM sr_links WHERE cluster = ? ORDER BY linked_at').all(cluster),
    written: async () => db.prepare("SELECT why FROM sr_ledger WHERE kind = 'refill' AND why LIKE 'pool:%'").all().map((x) => x.why),
    tanks: async () => new Set(db.prepare('SELECT name FROM sr_tanks').all().map((x) => x.name)),
    refill: async (rows) => { db.exec('BEGIN'); try { for (const x of rows) db.exec(refillSql(x.tank, x.usd, x.why)); db.exec('COMMIT'); } catch (e) { db.exec('ROLLBACK'); throw e; } },
  };
  const chainRpc = async (body) => { const r = await fetch(RPC, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }); return r.json(); };
  const epochNow = (await rpc('getEpochInfo', [])).epoch, last = epochNow - 1;
  const real = await runEdgeEpoch({ epoch: last, solUsd: 150, toggles: null, rpc: chainRpc, d1, cluster: 'devnet' });
  check(real.stakes === 1 && real.rows.length === 0 && real.skipped[0]?.why === 'no reward this epoch',
    `the crank reads the edge's link on devnet's rewards for epoch ${last}: ${real.stakes} stake, ${real.rows.length} rows (${real.skipped[0]?.why})`);

  // 4. a stand-in reward of one SOL, written as his hand writes it: the fuel rises at the door; the same epoch is never poured twice
  const standIn = async (body) => ({ jsonrpc: '2.0', id: 1, result: body.params[0].map(() => ({ epoch: last, effectiveSlot: 1, amount: 1_000_000_000, postBalance: 0, commission: 0 })) });
  const wet = await runEdgeEpoch({ epoch: last, solUsd: 150, toggles: null, rpc: standIn, d1, cluster: 'devnet', write: true });
  const after = await tankAt(fresh.body.key);
  check(wet.wrote === 1 && after.body.fuel_usd === 150 && after.body.poured_usd === 150, `a stand-in reward of 1 SOL at $150, written as his hand writes it: the staker's tank holds $${after.body.fuel_usd} of fuel at the door`);
  const twice = await runEdgeEpoch({ epoch: last, solUsd: 150, toggles: null, rpc: standIn, d1, cluster: 'devnet', write: true });
  check(twice.wrote === 0 && (await tankAt(fresh.body.key)).body.fuel_usd === 150, 'the same epoch is never poured twice');

  code = checks.every((c) => c.ok) ? 0 : 1;
  console.log(JSON.stringify({ schema: 'embertide.space-router-link-proof/1', ok: code === 0, checks: checks.length, failed: checks.filter((c) => !c.ok).map((c) => c.what),
    stake: stakeKey.address, staker: staker.address, tank, transactions: [fundSig, makeSig] }));
} catch (e) { console.error(`space-router-link.proof: ${e.message}`); code = 2; }
finally { server?.close(); db.close(); }
process.exit(code);

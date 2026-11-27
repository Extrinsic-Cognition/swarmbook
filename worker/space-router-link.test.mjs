// space-router-link.test.mjs · A STAKE PAYS ITS TANK: the link proof read byte for byte, its times and signature; the stake's withdrawer read on chain; the
// authority's own tank made once with a key handed back once, kept only as its hash; a new key on its own statement; every refusal with its reason.
// node --test embertide-app/ui/intro/dyson-society/worker/space-router-link.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { createHandler } from './premint.mjs'; import { d1, migrated } from './d1-on-sqlite.mjs';
import { LINK_PATH, STAKE_PROGRAM, LINK_MS, linkMessage, linkSignIn, linkFields, sealLinkProof, verifyLinkProof, withdrawerOf, tankOfAuthority } from './space-router-link.mjs';
import { DEVNET_GENESIS } from './tracenet-vault.mjs';
import { wallet } from './stand-ins.mjs';
import { encode58, GENESIS } from '../app/dl-direct-protocol.mjs';

const SITE = 'https://site.example', HOST = 'site.example', T0 = Date.parse('2031-05-06T07:08:09.000Z');
const sha = (s) => createHash('sha256').update(s).digest('hex');
async function proofOf(w, stake, { cluster = 'devnet', now = T0, rekey = false, host = HOST, origin = SITE } = {}) {
  const text = linkSignIn({ host, origin, authority: w.address, stake, cluster, rekey, now });
  return sealLinkProof(text, await w.sign(new TextEncoder().encode(text)));
}
const stakeAccount = (withdrawer, type = 'delegated', owner = STAKE_PROGRAM) => ({ owner, lamports: 2282880, data: { program: 'stake', parsed: { type, info: { meta: { authorized: { staker: withdrawer, withdrawer } } } } } });

test('the link proof: its text read back byte for byte, its times and its signature checked', async () => {
  const w = await wallet(), stake = (await wallet()).address, proof = await proofOf(w, stake);
  const f = linkFields(proof);
  assert.equal(f.authority, w.address); assert.equal(f.stake, stake); assert.equal(f.cluster, 'devnet'); assert.equal(f.rekey, false);
  assert.equal(new TextDecoder().decode(f.bytes), linkMessage(f), 'the text is the message the law writes');
  assert.ok(new TextDecoder().decode(f.bytes).includes(`Link stake account ${stake} to your Swarmy's tank on Space Router. This sends no transaction and moves no funds.`));
  const ok = await verifyLinkProof(proof, { host: HOST, origin: SITE, now: T0 + 1000 });
  assert.deepEqual([ok.authority, ok.stake, ok.cluster, ok.rekey, ok.issued], [w.address, stake, 'devnet', false, T0]);
  assert.equal(await verifyLinkProof(proof, { host: 'other.example', origin: 'https://other.example', now: T0 }), null, 'another site');
  assert.equal(await verifyLinkProof(proof, { host: HOST, origin: SITE, now: T0 + LINK_MS }), null, 'expired');
  assert.equal(await verifyLinkProof(proof, { host: HOST, origin: SITE, now: T0 - 11 * 60000 }), null, 'issued past the clock\'s skew');
  const [text64] = proof.split('.'), other = await wallet();
  const forged = `${text64}.${encode58(await other.sign(linkFields(proof).bytes))}`;
  assert.equal(await verifyLinkProof(forged, { host: HOST, origin: SITE, now: T0 }), null, 'signed by a key that is not the authority');
  const long = linkMessage({ domain: HOST, authority: w.address, stake, uri: SITE, cluster: 'devnet', nonce: 'abcdefgh123', issuedAt: new Date(T0).toISOString(), expiresAt: new Date(T0 + LINK_MS + 1).toISOString() });
  assert.equal(await verifyLinkProof(sealLinkProof(long, await w.sign(new TextEncoder().encode(long))), { host: HOST, origin: SITE, now: T0 }), null, 'good for more than ten minutes');
  const rk = linkFields(await proofOf(w, stake, { rekey: true })); assert.equal(rk.rekey, true);
  assert.equal(linkFields('x.y'), null); assert.equal(linkFields(proof.replace('.', '.1')), null);
});

test('a stake account\'s withdrawer as a node answers it, and nothing else', async () => {
  const a = (await wallet()).address;
  assert.equal(withdrawerOf(stakeAccount(a)), a); assert.equal(withdrawerOf(stakeAccount(a, 'initialized')), a);
  assert.equal(withdrawerOf(stakeAccount(a, 'uninitialized')), null); assert.equal(withdrawerOf(stakeAccount(a, 'delegated', '11111111111111111111111111111111')), null);
  assert.equal(withdrawerOf({ owner: STAKE_PROGRAM, data: ['AAAA', 'base64'] }), null); assert.equal(withdrawerOf(null), null);
  assert.match(await tankOfAuthority(a), /^st-[0-9a-f]{12}$/); assert.equal(await tankOfAuthority(a), `st-${sha(a).slice(0, 12)}`);
});

/** the Worker's own handler over a scratch D1 (every migration) and a node that answers from a map */
function site({ cluster = 'devnet', genesis = DEVNET_GENESIS, accounts = new Map(), now = () => T0 + 2000 } = {}) {
  const db = migrated(), DB = d1(db);   // D1 on node:sqlite, every migration (d1-on-sqlite.mjs)
  const asked = [];
  const fetcher = async (url, init) => { const b = JSON.parse(init.body); asked.push(b.method);
    const result = b.method === 'getGenesisHash' ? genesis : b.method === 'getAccountInfo' ? { context: { slot: 1 }, value: accounts.get(b.params[0]) ?? null } : null;
    return new Response(JSON.stringify({ jsonrpc: '2.0', id: 1, result })); };
  const handler = createHandler({ fetcher, clockMs: now, clock: () => Math.floor(now() / 1000) });
  const env = { DB, SOLANA_RPC: 'https://node.example', SOLANA_CLUSTER: cluster === 'devnet' ? 'devnet' : undefined, ASSETS: { fetch: async () => new Response('', { status: 404 }) } };
  const post = async (proof, method = 'POST') => { const r = await handler(new Request(`${SITE}${LINK_PATH}`, { method, headers: { 'content-type': 'application/json' }, body: method === 'POST' ? JSON.stringify({ proof }) : undefined }), env); return { status: r.status, body: await r.json() }; };
  return { db, post, asked };
}

test('a staker links a stake: the authority\'s own tank is made once, its key handed back once and kept only as its hash; a new key on its own statement', async () => {
  const w = await wallet(), stake = (await wallet()).address, accounts = new Map([[stake, stakeAccount(w.address)]]), s = site({ accounts });
  const first = await s.post(await proofOf(w, stake));
  assert.equal(first.status, 200, JSON.stringify(first.body)); assert.equal(first.body.tank, await tankOfAuthority(w.address)); assert.match(first.body.key, /^sr_[A-Za-z0-9_-]{43}$/);
  const tank = s.db.prepare('SELECT * FROM sr_tanks WHERE name = ?').get(first.body.tank);
  assert.equal(tank.key_sha256, sha(first.body.key)); assert.equal(tank.poured_usd, 0); assert.equal(tank.markup_bps, 500);
  const link = s.db.prepare('SELECT * FROM sr_links WHERE stake = ?').get(stake);
  assert.deepEqual([link.authority, link.tank, link.cluster, link.signed_at], [w.address, first.body.tank, 'devnet', T0]); assert.match(link.signature, /^[1-9A-HJ-NP-Za-km-z]{80,90}$/);
  const everything = JSON.stringify([s.db.prepare('SELECT * FROM sr_tanks').all(), s.db.prepare('SELECT * FROM sr_links').all(), s.db.prepare('SELECT * FROM sr_ledger').all()]);
  assert.ok(!everything.includes(first.body.key), 'the key is nowhere in D1');
  assert.deepEqual(s.asked, ['getGenesisHash', 'getAccountInfo']);
  const again = await s.post(await proofOf(w, stake, { now: T0 + 1000 }));
  assert.equal(again.status, 200); assert.equal(again.body.key, null, 'a second link hands back no key'); assert.equal(again.body.tank, first.body.tank);
  assert.equal(s.asked.filter((m) => m === 'getGenesisHash').length, 1, 'the cluster is read once per isolate');
  const fresh = await s.post(await proofOf(w, stake, { now: T0 + 1500, rekey: true }));
  assert.equal(fresh.status, 200); assert.match(fresh.body.key, /^sr_/); assert.notEqual(fresh.body.key, first.body.key);
  assert.equal(s.db.prepare('SELECT key_sha256 FROM sr_tanks WHERE name = ?').get(first.body.tank).key_sha256, sha(fresh.body.key), 'the old key opens nothing now');
  // a second stake of the same authority feeds the same tank
  const stake2 = (await wallet()).address; accounts.set(stake2, stakeAccount(w.address, 'initialized'));
  const two = await s.post(await proofOf(w, stake2, { now: T0 + 1600 })); assert.equal(two.body.tank, first.body.tank); assert.equal(two.body.key, null);
});

test('every refusal with its reason: not the withdrawer, no stake account, an older proof, another cluster, a node of another cluster, a forged or stale proof, a GET', async () => {
  const w = await wallet(), stranger = await wallet(), stake = (await wallet()).address, notStake = (await wallet()).address;
  const accounts = new Map([[stake, stakeAccount(w.address)], [notStake, { owner: '11111111111111111111111111111111', lamports: 5, data: ['', 'base64'] }]]), s = site({ accounts });
  assert.equal((await s.post(await proofOf(stranger, stake))).status, 403, 'a stranger is not the withdraw authority');
  assert.equal((await s.post(await proofOf(w, notStake))).status, 422, 'not a stake account');
  assert.equal((await s.post(await proofOf(w, (await wallet()).address))).status, 422, 'no account at all');
  assert.equal((await s.post(await proofOf(w, stake, { now: T0 + 1000 }))).status, 200);
  assert.equal((await s.post(await proofOf(w, stake, { now: T0 }))).status, 409, 'an older proof cannot take the stake back');
  assert.equal((await s.post(await proofOf(w, stake, { cluster: 'mainnet', now: T0 + 1500 }))).status, 400, 'a mainnet proof at a devnet door');
  assert.equal((await s.post(await proofOf(w, stake, { now: T0 - 20 * 60000 }))).status, 401, 'a stale proof');
  assert.equal((await s.post('not.a-proof')).status, 401);
  assert.equal((await s.post(null, 'GET')).status, 405);
  const wrong = site({ accounts, genesis: GENESIS });   // the door says devnet, its node is mainnet's
  assert.equal((await wrong.post(await proofOf(w, stake))).status, 503, 'a node of another cluster links nothing');
  assert.equal(wrong.db.prepare('SELECT COUNT(*) AS n FROM sr_links').get().n, 0);
});

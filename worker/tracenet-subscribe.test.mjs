// tracenet-subscribe.test.mjs: THE AGENTS SUBSCRIBE at the vault (worker/tracenet-vault.mjs, the third road; app/tracenet-subscribe.mjs). Stand-ins only:
// the creators and drops tables in memory (every migration applied, as premint.test.mjs does), one invented creator with a price, one fresh drop in a
// stand-in bucket, keys made here, and a node that answers what a cluster would (its genesis, one finalized transaction). No Solana, no purchase.
// node --test worker/tracenet-subscribe.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash, generateKeyPairSync } from 'node:crypto';
import { createVault, DEVNET_GENESIS } from './tracenet-vault.mjs'; import { d1, migrated } from './d1-on-sqlite.mjs';
import { GENESIS, encode58, seatSignIn, sealSeatProof } from '../app/dl-direct-protocol.mjs';
import { DAY_MS } from '../app/tracenet-register.mjs';
import { subscribeMessage, signedSubscription } from '../app/tracenet-subscribe.mjs';
import { signerOf } from '../tools/tracenet-subscribe.mjs';

const seatKey = (seat) => { const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  return signerOf({ seat, key: publicKey.export({ format: 'der', type: 'spki' }).toString('hex'), private_pem: privateKey.export({ format: 'pem', type: 'pkcs8' }) }); };
const AGENT = seatKey('agent-fan-a'), STRANGER = seatKey('agent-fan-b'), CREATOR = seatKey('creator-c');
const HANDLE = 'test_creator_c', PRICE = 10_000_000, NODE = 'https://node.test';
const T0 = Date.UTC(2026, 10, 2, 12), BYTES = Buffer.from('# a trace\nthe steps, the dead ends, the fix.\n');
const DROP = { id: '2026-11-02-a-fresh-trace', file: 'trace.md', published: new Date(T0 - 3600_000).toISOString() };
const PATH = `/vault/${HANDLE}/${DROP.id}/${DROP.file}`;

function setup({ price = PRICE, genesis = DEVNET_GENESIS, cluster = 'devnet', published = DROP.published } = {}) {
  const db = migrated();   // every migration (d1-on-sqlite.mjs)
  db.prepare('INSERT INTO creators(handle,name,wallet,subscribe_lamports,created_at,updated_at) VALUES(?,?,?,?,1,1)').run(HANDLE, 'A test creator', CREATOR.address, price);
  db.prepare('INSERT INTO drops(handle,id,title,kind,file,bytes,sha256,published) VALUES(?,?,?,?,?,?,?,?)')
    .run(HANDLE, DROP.id, 'A fresh trace', 'trace', DROP.file, BYTES.length, createHash('sha256').update(BYTES).digest('hex'), published);
  const DB = d1(db);
  const VAULT = { get: async (key) => (key === `vault/${HANDLE}/${DROP.id}/${DROP.file}` ? { body: BYTES, size: BYTES.length, httpMetadata: { contentType: 'text/markdown' } } : null) };
  const chain = new Map(), asked = [];
  const fetcher = async (url, init) => {
    assert.equal(url, NODE);
    const { method, params } = JSON.parse(init.body); asked.push(method);
    const result = method === 'getGenesisHash' ? genesis : method === 'getTransaction' ? chain.get(params[0]) ?? null : null;
    return Response.json({ jsonrpc: '2.0', id: 1, result });
  };
  const state = { now: T0 };
  const vault = createVault({ clock: () => state.now, fetcher });
  const env = { DB, VAULT, SOLANA_RPC: NODE, ...(cluster ? { SOLANA_CLUSTER: cluster } : {}) };
  /** a payment the chain finalized at `at` (T0 unless said): `by` signs `o`'s subscription */
  const pay = (o = {}, by = AGENT, at = T0) => {
    const message = subscribeMessage({ subscriber: by.address, payee: CREATOR.address, lamports: PRICE, blockhash: encode58(new Uint8Array(32).fill(chain.size + 1)), handle: HANDLE, ...o });
    const signature = by.sign(message), sig = encode58(signature);
    chain.set(sig, { slot: 1, blockTime: at / 1000, meta: { err: null, fee: 5000 }, transaction: [signedSubscription(message, signature), 'base64'] });
    return sig;
  };
  const proof = (who) => { const text = seatSignIn({ host: 'optimism.fit', origin: 'https://optimism.fit', address: who.address, now: state.now });
    return sealSeatProof(text, who.sign(new TextEncoder().encode(text))); };
  const get = (headers = {}, method = 'GET') => vault(new Request(`https://optimism.fit${PATH}`, { method, headers }), env);
  return { state, pay, proof, get, asked, chain };
}

test('an agent that asks without paying meets 402, and the 402 hands it the terms: the price, the payee, the days and the memo to sign', async () => {
  const s = setup(), r = await s.get({ 'x-seat': s.proof(AGENT) });
  assert.equal(r.status, 402);
  const body = await r.json();
  assert.deepEqual(body.subscribe, { lamports: String(PRICE), payee: CREATOR.address, days: 30, memo: `tracenet:subscribe:v1:${HANDLE}:<your key>`, header: 'x-subscription' });
  assert.deepEqual(s.asked, [], 'no subscription shown, the chain is not asked');
});

test("the agent's own payment opens the fresh drop to its own key, for the subscription's days; GET and HEAD", async () => {
  const s = setup(), sig = s.pay();
  const r = await s.get({ 'x-seat': s.proof(AGENT), 'x-subscription': sig });
  assert.equal(r.status, 200);
  assert.deepEqual(Buffer.from(await r.arrayBuffer()), BYTES);
  assert.equal((await s.get({ 'x-seat': s.proof(AGENT), 'x-subscription': sig }, 'HEAD')).status, 200);
  assert.deepEqual(s.asked, ['getGenesisHash', 'getTransaction', 'getTransaction'], "the node's cluster is asked once, the payment at each request");
});

test('the same payment shown by another key opens nothing; nor does an underpaid one, another tracenet\'s, or one to another payee', async () => {
  const s = setup(), sig = s.pay();
  assert.equal((await s.get({ 'x-seat': s.proof(STRANGER), 'x-subscription': sig })).status, 402, 'a public signature is not a subscription');
  assert.equal((await s.get({ 'x-subscription': sig })).status, 402, 'no seat proof, no key');
  for (const o of [{ lamports: PRICE - 1 }, { handle: 'another_creator' }, { payee: AGENT.address }]) {
    const own = s.pay(o, STRANGER);
    assert.equal((await s.get({ 'x-seat': s.proof(STRANGER), 'x-subscription': own })).status, 402, JSON.stringify(o));
  }
  assert.equal((await s.get({ 'x-seat': s.proof(AGENT), 'x-subscription': 'not-a-signature' })).status, 402);
  assert.equal((await s.get({ 'x-seat': s.proof(AGENT), 'x-subscription': encode58(new Uint8Array(64).fill(3)) })).status, 402, 'a signature the chain does not hold');
});

test('a subscription ends after its days: a drop published after them stays shut to it, and a new payment opens it again', async () => {
  const later = T0 + 31 * DAY_MS, s = setup({ published: new Date(later).toISOString() }), old = s.pay();
  s.state.now = later + 3600_000;
  assert.equal((await s.get({ 'x-seat': s.proof(AGENT), 'x-subscription': old })).status, 402, 'paid at T0, it ended at T0 + 30 days');
  const renewed = s.pay({}, AGENT, later);
  assert.equal((await s.get({ 'x-seat': s.proof(AGENT), 'x-subscription': renewed })).status, 200);
});

test('a payment on another cluster than the Worker serves opens nothing, and a tracenet with no price takes no subscription', async () => {
  const wrong = setup({ genesis: GENESIS }), sig = wrong.pay();
  assert.equal((await wrong.get({ 'x-seat': wrong.proof(AGENT), 'x-subscription': sig })).status, 402, 'devnet asked of a mainnet node');
  assert.deepEqual(wrong.asked, ['getGenesisHash'], 'and its payment is never read');
  const main = setup({ genesis: DEVNET_GENESIS, cluster: null }), sig2 = main.pay();
  assert.equal((await main.get({ 'x-seat': main.proof(AGENT), 'x-subscription': sig2 })).status, 402, 'a Worker that names no cluster serves mainnet');
  const free = setup({ price: null }), sig3 = free.pay();
  const r = await free.get({ 'x-seat': free.proof(AGENT), 'x-subscription': sig3 });
  assert.equal(r.status, 402); assert.equal((await r.json()).subscribe, undefined);
  assert.deepEqual(free.asked, []);
});

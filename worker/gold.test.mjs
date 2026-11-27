// worker/gold.test.mjs: THE GOLD MONTH'S DOORS (worker/gold.mjs; the law app/dl-gold-bid.mjs). A bid appended once in an open month, refused
// unsigned, out of its month, or off the group; the pot anyone reads (commitments and count, no box, no bidder); his total posted once after the
// close, signed by the recipient's key, with the log's count; a winner's Gold order at its bid's lamports in the pay window, once.
// node --test gold.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { d1, migrated } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by the migrations named
import { createRequire } from 'node:module';
import { createHandler } from './premint.mjs';
import { PATHS } from './gold.mjs';
import { makeBid, makeTotal, openBid, bytesHex, checkTotal, verifyWith, windowOf, GOLD } from '../app/dl-gold-bid.mjs';
import { RECIPIENT, GENESIS, encode58, quoteLamports } from '../app/dl-direct-protocol.mjs';

const nacl = createRequire(import.meta.url)('../app/vendor/tweetnacl-1.0.3.fast.min.js');
const seeded = (n) => { let x = n >>> 0; return (k) => Uint8Array.from({ length: k }, () => { x = (x * 1664525 + 1013904223) >>> 0; return x >>> 24; }); };
const HIS = nacl.sign.keyPair.fromSeed(seeded(7)(32)), HIS_ADDRESS = encode58(HIS.publicKey);   // a stand-in recipient for the tests: the doors are told it
const MONTH = '2026-11', W = windowOf(MONTH), OPEN_S = Math.floor(W.opens / 1000) + 3600, PAY_S = Math.floor(W.closes / 1000) + 3600;
const blockhash = encode58(new Uint8Array(32).fill(7));
const buyerKeys = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']);
const buyer = encode58(new Uint8Array(await crypto.subtle.exportKey('raw', buyerKeys.publicKey)));

function setup() {
  const db = migrated();
  const state = { time: OPEN_S };
  const DB = d1(db);
  const env = { DB, PREMINT_ENABLED: 'true', ASSETS: { fetch: () => new Response('asset') } };
  const handle = createHandler({ clock: () => state.time, clockMs: () => state.time * 1000, fetcher: async (url, opts) => {
    if (url.includes('coinbase')) return Response.json({ data: { base: 'SOL', currency: 'USD', amount: '100' } });
    const { method } = JSON.parse(opts.body);
    const result = { getGenesisHash: GENESIS, getLatestBlockhash: { value: { blockhash, lastValidBlockHeight: 200 } }, getBlockHeight: 100, getSignatureStatuses: { value: [null] } }[method];
    return Response.json({ result: result ?? null });
  } });
  const once = async (r) => { const text = await r.text(); return { status: r.status, text: async () => text, json: async () => JSON.parse(text) }; };   // a response read once, however many times a test looks
  const call = async (path, init = {}) => once(await handle(new Request(`https://optimism.fit${path}`, { ...init, headers: { 'content-type': 'application/json', origin: 'https://optimism.fit', ...(init.headers ?? {}) } }), env, {}));
  const post = (path, data) => call(path, { method: 'POST', body: JSON.stringify(data) });
  return { db, env, state, call, post };
}
// the doors verify a total against RECIPIENT; the tests sign with a stand-in, so they patch the check through gold.mjs's own parameter: the handler's
// doors are called with the real RECIPIENT, which the stand-in cannot sign for. So the total tests call goldDoors directly with `recipient` below.
import { goldDoors } from './gold.mjs';
const json = (data, status = 200) => Response.json(data, { status });
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
async function door(t, path, method, data, recipient = HIS_ADDRESS) {
  const request = new Request(`https://optimism.fit${path}`, { method, body: data ? JSON.stringify(data) : undefined });
  const r = await goldDoors({ request, env: t.env, url: new URL(request.url), path: new URL(request.url).pathname, body: async () => data, clock: () => t.state.time, json, fail, payee: () => recipient }).catch((e) => json({ error: e.message }, e.status ?? 500));
  const text = await r.text(); return { status: r.status, text: async () => text, json: async () => JSON.parse(text) };
}

test('a bid is appended once in its open month; unsigned, resigned, off the group or out of its month it is refused; the pot shows the commitments and nothing else', async () => {
  const t = setup(), random = seeded(11);
  const { bid } = makeBid({ nacl, month: MONTH, lamports: 2000000000, random });
  let r = await t.post(PATHS.bids, { bid }); assert.equal(r.status, 201, await r.text()); assert.deepEqual(await r.json(), { ok: true, month: MONTH, creator: 'photons_enjoyor', commitment: bid.commitment, count: 1 });
  r = await t.post(PATHS.bids, { bid }); assert.equal(r.status, 409);
  r = await t.post(PATHS.bids, { bid: { ...bid, signature: bid.signature.replace(/^../, '00') } }); assert.equal(r.status, 403);
  r = await t.post(PATHS.bids, { bid: { ...bid, month: '2026-12' } }); assert.equal(r.status, 409, 'the month is not open, read before the signature');
  const torsion = makeBid({ nacl, month: MONTH, lamports: 1, random }); torsion.bid.commitment = '0000000000000000000000000000000000000000000000000000000000000080';
  torsion.bid.signature = bytesHex(nacl.sign.detached(new TextEncoder().encode(`gold.bid:photons_enjoyor:${MONTH}:${torsion.bid.commitment}:${torsion.bid.bidder}:${torsion.bid.box}`), nacl.sign.keyPair.fromSeed(Uint8Array.from(Buffer.from(torsion.receipt.seed, 'hex'))).secretKey));
  r = await t.post(PATHS.bids, { bid: torsion.bid }); assert.equal(r.status, 400); assert.match((await r.json()).error, /not a point of the group/);
  r = await t.post(PATHS.bids, { bid: { ...bid, type: 'x' } }); assert.equal(r.status, 400);
  const second = makeBid({ nacl, month: MONTH, lamports: 5, random }); r = await t.post(PATHS.bids, { bid: second.bid }); assert.equal(r.status, 201);
  r = await t.call(`${PATHS.pot}?month=${MONTH}`); assert.equal(r.status, 200);
  const pot = await r.json();
  assert.deepEqual(pot.commitments, [bid.commitment, second.bid.commitment]); assert.equal(pot.count, 2); assert.equal(pot.total, null); assert.equal(pot.phase, 'open');
  assert.equal(pot.slots, GOLD.slots); assert.equal(pot.reserveUsd, GOLD.reserveUsd); assert.equal(pot.recipient, RECIPIENT); assert.deepEqual(pot.window, W);
  assert.equal(JSON.stringify(pot).includes(bid.box), false, 'no box leaves'); assert.equal(JSON.stringify(pot).includes(bid.bidder), false, 'no bidder key leaves');
  r = await t.call(`${PATHS.pot}?month=nope`); assert.equal(r.status, 400);
  t.state.time = PAY_S; r = await t.post(PATHS.bids, { bid: makeBid({ nacl, month: MONTH, lamports: 9, random }).bid }); assert.equal(r.status, 409, 'closed: no more bids');
  assert.equal((await t.db.prepare('SELECT COUNT(*) AS n FROM gold_bids').get()).n, 2);
});

test('his total: refused before the close, unsigned by the recipient, with the wrong count or a stranger winner; posted once; then the pot carries it and anyone checks it', async () => {
  const t = setup(), random = seeded(12);
  const made = [3000000000, 1500000000, 4000000000].map((v) => makeBid({ nacl, month: MONTH, lamports: v, random, recipient: HIS_ADDRESS }));
  for (const m of made) assert.equal((await t.post(PATHS.bids, { bid: m.bid })).status, 201);
  const opened = made.map((m) => { const o = openBid(nacl, m.bid, HIS.secretKey, HIS_ADDRESS); return { commitment: m.bid.commitment, lamports: Number(o.lamports), blinder: bytesHex(o.blinder) }; });
  const total = makeTotal({ nacl, month: MONTH, opened, reserveLamports: 2000000000, slots: 2, secretKey: HIS.secretKey });
  let r = await door(t, PATHS.totals, 'POST', { total }); assert.equal(r.status, 409, 'not closed yet');
  t.state.time = PAY_S;
  r = await door(t, PATHS.totals, 'POST', { total: { ...total, signature: total.signature.replace(/^../, '00') } }); assert.equal(r.status, 403);
  r = await door(t, PATHS.totals, 'POST', { total }, RECIPIENT); assert.equal(r.status, 403, 'the real recipient did not sign this');
  const resign = (x) => ({ ...x, signature: bytesHex(nacl.sign.detached(new TextEncoder().encode(`gold.total:${x.creator ?? 'photons_enjoyor'}:${x.month}:${x.lamports}:${x.blinder}:${x.bids}:${x.winners.map((w) => `${w.commitment}=${w.lamports}=${w.blinder}`).join(',')}`), HIS.secretKey)) });
  r = await door(t, PATHS.totals, 'POST', { total: resign({ ...total, bids: 2 }) }); assert.equal(r.status, 409);
  const stranger = makeBid({ nacl, month: MONTH, lamports: 1, random, recipient: HIS_ADDRESS }).bid.commitment;
  r = await door(t, PATHS.totals, 'POST', { total: resign({ ...total, winners: [{ ...total.winners[0], commitment: stranger }] }) }); assert.equal(r.status, 400);
  r = await door(t, PATHS.totals, 'POST', { total }); assert.equal(r.status, 201, await r.text()); assert.deepEqual(await r.json(), { ok: true, month: MONTH, creator: 'photons_enjoyor', lamports: 8500000000, winners: 2 });
  r = await door(t, PATHS.totals, 'POST', { total }); assert.equal(r.status, 409, 'once');
  const pot = await (await t.call(`${PATHS.pot}?month=${MONTH}`)).json();
  assert.equal(pot.phase, 'pay'); assert.equal(pot.total.lamports, 8500000000); assert.equal(pot.total.bids, 3); assert.deepEqual(pot.total.winners.map((w) => w.lamports), [4000000000, 3000000000]);
  assert.deepEqual(await checkTotal(pot.total, pot.commitments, verifyWith(crypto.subtle), HIS_ADDRESS), { ok: true });
});

test('a winner pays its bid as a Gold order in the pay window, once; a loser, a stranger, Bronze with a bid, or after the window are refused', async () => {
  const t = setup(), random = seeded(13);
  const made = [3000000000, 1500000000].map((v) => makeBid({ nacl, month: MONTH, lamports: v, random, recipient: HIS_ADDRESS }));
  for (const m of made) assert.equal((await t.post(PATHS.bids, { bid: m.bid })).status, 201);
  const opened = made.map((m) => { const o = openBid(nacl, m.bid, HIS.secretKey, HIS_ADDRESS); return { commitment: m.bid.commitment, lamports: Number(o.lamports), blinder: bytesHex(o.blinder) }; });
  const total = makeTotal({ nacl, month: MONTH, opened, reserveLamports: 2000000000, secretKey: HIS.secretKey });
  const id = (n) => `deadcafe-0000-4000-8000-00000000000${n}`;
  let r = await t.post('/api/premint/orders', { id: id(1), tier: 'gold', buyer, gold_bid: made[0].bid.commitment }); assert.equal(r.status, 409, 'before the close: not in the pay window');
  t.state.time = PAY_S; assert.equal((await door(t, PATHS.totals, 'POST', { total })).status, 201);
  r = await t.post('/api/premint/orders', { id: id(1), tier: 'gold', buyer, gold_bid: made[0].bid.commitment }); assert.equal(r.status, 200, await r.text());
  const { order } = await r.json(); assert.equal(order.lamports, '3000000000'); assert.equal(order.tier, 'gold');
  assert.equal((await t.db.prepare('SELECT gold_bid FROM premint_orders WHERE id=?').get(id(1))).gold_bid, made[0].bid.commitment);
  r = await t.post('/api/premint/orders', { id: id(2), tier: 'gold', buyer, gold_bid: made[0].bid.commitment }); assert.equal(r.status, 409, 'already being paid');
  r = await t.post('/api/premint/orders', { id: id(3), tier: 'gold', buyer, gold_bid: made[1].bid.commitment }); assert.equal(r.status, 409, 'a loser');
  r = await t.post('/api/premint/orders', { id: id(4), tier: 'bronze', buyer, gold_bid: made[0].bid.commitment }); assert.equal(r.status, 400, 'a bid pays Gold');
  r = await t.post('/api/premint/orders', { id: id(5), tier: 'gold', buyer, gold_bid: 'ff'.repeat(32) }); assert.equal(r.status, 409, 'a stranger');
  r = await t.post('/api/premint/orders', { id: id(6), tier: 'gold', buyer }); assert.equal(r.status, 200); assert.equal((await r.json()).order.lamports, quoteLamports(1000, '100'), 'a Gold order without a bid is the tier\'s price, as before');
  t.state.time = Math.floor(W.pays / 1000) + 1; t.db.prepare("UPDATE premint_orders SET status='failed' WHERE id=?").run(id(1));
  r = await t.post('/api/premint/orders', { id: id(7), tier: 'gold', buyer, gold_bid: made[0].bid.commitment }); assert.equal(r.status, 409, 'after the pay window');
});

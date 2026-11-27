// worker/bronze.test.mjs: BRONZE IS A SUBSCRIPTION (worker/bronze.mjs; the page's half app/tracenet-bronze.mjs). His Oct 23 2026 WEST: "the bronze option
// should support stripe as well... think like tracenet is just like patreon". Stripe stood in by a fetcher that answers as its REST API does: the plan
// from the price, the checkout minting a token whose hash alone is kept, the webhook refused unsigned, stale or forged, and moving the row on
// Stripe's events; the vault opening a Bronze drop to an active card subscriber on Bronze's day and to nobody after a cancel; the portal; a Gold seat
// won by a sealed bid holding for its month alone. No network, no card.
// node --test bronze.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { migrated } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by the migrations named
import { readFileSync } from 'node:fs';
import { assetsOf } from './stand-ins.mjs';
import { createHandler } from './premint.mjs';
import { PATHS, form, verifyStripe, periodEndOf, sha256Hex, bronzeOf } from './bronze.mjs';
import { goldMonthHolds } from './tracenet-vault.mjs';
import { TOKEN, BRONZE_KEY, bronzeToken, keepToken, receiptHeaders, planText, bronzeOfToken } from '../app/tracenet-bronze.mjs';
import { readManifest, opensFor } from '../app/tracenet-register.mjs';
import { windowOf } from '../app/dl-gold-bid.mjs';
import { GENESIS } from '../app/dl-direct-protocol.mjs';

const site = new URL('./fixtures/tracenet-site/', import.meta.url), HIS = 'photons_enjoyor';
const drop = readManifest(JSON.parse(readFileSync(new URL(`app/tracenet/${HIS}.json`, site), 'utf8')), HIS).items[0];
const SECRET = 'whsec_test_secret', PRICE = 'price_test_bronze';
const enc = new TextEncoder();
const hmac = async (secret, text) => { const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']); return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC', key, enc.encode(text))), (b) => b.toString(16).padStart(2, '0')).join(''); };
const signed = async (event, t, secret = SECRET) => { const body = JSON.stringify(event); return { body, header: `t=${t},v1=${await hmac(secret, `${t}.${body}`)}` }; };

function setup({ keys = true } = {}) {
  const db = migrated();
  const state = { time: Math.floor(Date.parse(drop.published) / 1000), calls: [] };
  const DB = { prepare(sql) { return { bind(...params) { return { first: async () => db.prepare(sql).get(...params) ?? null, all: async () => ({ results: db.prepare(sql).all(...params) }), run: async () => ({ meta: { changes: db.prepare(sql).run(...params).changes } }) }; }, first: async () => db.prepare(sql).get() ?? null, all: async () => ({ results: db.prepare(sql).all() }) }; } };
  const assets = assetsOf(site);
  const env = { DB, PREMINT_ENABLED: 'true', ASSETS: assets, ...(keys ? { STRIPE_SECRET_KEY: 'sk_test_x', STRIPE_PRICE_BRONZE: PRICE, STRIPE_WEBHOOK_SECRET: SECRET } : {}) };
  const handle = createHandler({ clock: () => state.time, clockMs: () => state.time * 1000, fetcher: async (url, opts = {}) => {
    if (String(url).startsWith('https://api.stripe.com/')) {
      state.calls.push({ url: String(url), method: opts.method, body: opts.body ?? null, auth: opts.headers?.authorization });
      const route = new URL(url).pathname;
      if (route === `/v1/prices/${PRICE}`) return Response.json({ id: PRICE, active: true, unit_amount: 1000, currency: 'usd', recurring: { interval: 'month' } });
      if (route === '/v1/checkout/sessions') return Response.json({ id: 'cs_test_1', url: 'https://checkout.stripe.com/c/pay/cs_test_1' });
      if (route === '/v1/billing_portal/sessions') return Response.json({ url: 'https://billing.stripe.com/p/session/test_1' });
      return Response.json({ error: { message: 'No such route' } }, { status: 404 });
    }
    if (String(url).includes('coinbase')) return Response.json({ data: { base: 'SOL', currency: 'USD', amount: '100' } });
    return Response.json({ result: JSON.parse(opts.body).method === 'getGenesisHash' ? GENESIS : null });
  } });
  const once = async (r) => { const text = await r.text(); return { status: r.status, text, json: () => JSON.parse(text) }; };
  const call = async (path, init = {}) => once(await handle(new Request(`https://optimism.fit${path}`, init), env, {}));
  return { db, env, state, call };
}
const hook = async (t, event, { at = t.state.time, secret = SECRET, header } = {}) => { const s = await signed(event, at, secret); return t.call(PATHS.stripe, { method: 'POST', headers: { 'content-type': 'application/json', 'stripe-signature': header ?? s.header }, body: s.body }); };

test('the page\'s half: the token\'s shape, kept in the browser, shown to the vault as x-bronze; a seat proof wins; the plan\'s words', async () => {
  const store = new Map(), storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  assert.equal(bronzeToken(storage), null); assert.equal(keepToken(storage, 'short'), false);
  const token = 'A'.repeat(43); assert.ok(TOKEN.test(token)); assert.ok(keepToken(storage, token)); assert.equal(bronzeToken(storage), token); assert.equal(store.get(BRONZE_KEY), token);
  assert.deepEqual(receiptHeaders({ proof: 'p' }), { 'x-seat': 'p' }); assert.deepEqual(receiptHeaders({ bronze: token }), { 'x-bronze': token }); assert.deepEqual(receiptHeaders(null), {}); assert.deepEqual(receiptHeaders({ bronze: 'bad' }), {});
  assert.equal(planText({ card: true, usd: 10, interval: 'month' }), '$10 / month'); assert.equal(planText({ card: true, usd: 4.5, interval: 'month' }), '$4.50 / month'); assert.equal(planText({ card: false }), null);
  assert.deepEqual(await bronzeOfToken({ storage, fetcher: async () => ({ ok: true, json: async () => ({ active: true, periodEnd: 5 }) }) }), { tier: 'bronze', bronze: token, periodEnd: 5 });
  assert.equal(await bronzeOfToken({ storage, fetcher: async () => ({ ok: true, json: async () => ({ active: false }) }) }), null);
  assert.equal(await bronzeOfToken({ storage: { getItem: () => null } }), null);
});
test('Stripe\'s form encoding and signature scheme; the period end in either place', async () => {
  assert.equal(form({ a: 1, b: { c: 'x y', d: null }, 'line_items[0][price]': 'p' }), 'a=1&b%5Bc%5D=x%20y&line_items%5B0%5D%5Bprice%5D=p');
  const s = await signed({ id: 'evt' }, 1000);
  assert.ok(await verifyStripe(s.body, s.header, SECRET, 1000)); assert.ok(await verifyStripe(s.body, s.header, SECRET, 1299));
  assert.equal(await verifyStripe(s.body, s.header, SECRET, 1301), false, 'stale');
  assert.equal(await verifyStripe(s.body, s.header, 'whsec_other', 1000), false, 'another secret');
  assert.equal(await verifyStripe(`${s.body} `, s.header, SECRET, 1000), false, 'another body');
  assert.equal(await verifyStripe(s.body, null, SECRET, 1000), false); assert.equal(await verifyStripe(s.body, s.header, '', 1000), false);
  assert.ok(await verifyStripe(s.body, `t=1000,v1=${'0'.repeat(64)},${s.header.split(',')[1]}`, SECRET, 1000), 'any v1 of the header');
  assert.equal(periodEndOf({ current_period_end: 7 }), 7); assert.equal(periodEndOf({ items: { data: [{ current_period_end: 9 }] } }), 9); assert.equal(periodEndOf({}), null);
});
test('the plan: Stripe\'s price, or no card road without the keys', async () => {
  let r = await setup({ keys: false }).call(PATHS.plan); assert.deepEqual(r.json(), { card: false, sol: true, creator: 'photons_enjoyor', usd: null });
  const t = setup(); r = await t.call(PATHS.plan); assert.deepEqual(r.json(), { card: true, usd: 10, currency: 'usd', interval: 'month', sol: true, creator: 'photons_enjoyor', destination: false });
  assert.equal(t.state.calls[0].auth, 'Bearer sk_test_x');
});
test('the checkout mints a token and keeps its hash; the webhook moves the row; the vault opens a Bronze drop to the active subscriber on Bronze\'s day, and to nobody after the cancel; the portal', async () => {
  const t = setup(), page = 'https://optimism.fit/app/warm.html?gold=2026-11';
  let r = await t.call(PATHS.checkout, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ back: page }) }); assert.equal(r.status, 403, 'origin');
  r = await t.call(PATHS.checkout, { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://optimism.fit' }, body: JSON.stringify({ back: 'https://evil.example/' }) }); assert.equal(r.status, 400);
  r = await t.call(PATHS.checkout, { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://optimism.fit' }, body: JSON.stringify({ back: page }) });
  assert.equal(r.status, 201, r.text); const { url, token } = r.json();
  assert.equal(url, 'https://checkout.stripe.com/c/pay/cs_test_1'); assert.ok(TOKEN.test(token));
  const hash = await sha256Hex(token), row = t.db.prepare('SELECT * FROM bronze_subs').get();
  assert.equal(row.token_hash, hash); assert.equal(row.status, 'pending'); assert.equal(JSON.stringify(row).includes(token), false, 'the token itself is never kept');
  const sent = new URLSearchParams(t.state.calls.at(-1).body);
  assert.equal(sent.get('mode'), 'subscription'); assert.equal(sent.get('line_items[0][price]'), PRICE); assert.equal(sent.get('client_reference_id'), hash); assert.equal(sent.get('subscription_data[metadata][token_hash]'), hash);
  assert.equal(sent.get('success_url'), 'https://optimism.fit/app/warm.html?gold=2026-11&bronze=welcome'); assert.equal(sent.get('cancel_url'), page);
  r = await t.call(PATHS.me, { headers: { 'x-bronze': token } }); assert.deepEqual(r.json(), { active: false, status: 'pending', periodEnd: null, creator: 'photons_enjoyor' });
  // the webhook: unsigned, stale, forged refused; the events move the row
  const created = { type: 'customer.subscription.created', data: { object: { id: 'sub_1', customer: 'cus_1', status: 'active', metadata: { token_hash: hash }, items: { data: [{ current_period_end: t.state.time + 30 * 86400 }] } } } };
  r = await t.call(PATHS.stripe, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(created) }); assert.equal(r.status, 400);
  r = await hook(t, created, { at: t.state.time - 400 }); assert.equal(r.status, 400, 'stale');
  r = await hook(t, created, { secret: 'whsec_forged' }); assert.equal(r.status, 400, 'forged');
  r = await hook(t, { type: 'checkout.session.completed', data: { object: { mode: 'subscription', client_reference_id: hash, customer: 'cus_1', subscription: 'sub_1' } } }); assert.equal(r.status, 200);
  r = await hook(t, created); assert.equal(r.status, 200); assert.deepEqual(r.json(), { received: true });
  r = await t.call(PATHS.me, { headers: { 'x-bronze': token } }); const me = r.json(); assert.equal(me.active, true); assert.equal(me.status, 'active');
  // the vault: before Bronze's day the subscriber meets 402 with Bronze's instant; on it, the bytes; without the token, nothing
  const vault = `/vault/${HIS}/${drop.id}/${drop.file}`;
  r = await t.call(vault, { headers: { 'x-bronze': token } }); assert.equal(r.status, 402); assert.match(r.json().error, /Bronze Mint opens this drop/);
  t.state.time = Math.ceil(opensFor(drop, 'bronze') / 1000);   // the first whole second at or after Bronze's instant
  t.db.prepare('UPDATE bronze_subs SET period_end=? WHERE token_hash=?').run(t.state.time + 86400, hash);   // still in its paid period
  if (opensFor(drop, 'bronze') < opensFor(drop, null)) { r = await t.call(vault, { headers: { 'x-bronze': token } }); assert.equal(r.status, 200); r = await t.call(vault); assert.equal(r.status, 402); }
  else { r = await t.call(vault, { headers: { 'x-bronze': token } }); assert.equal(r.status, 200, 'Bronze\'s day is the free day under the law today: the drop is everyone\'s'); }
  // the portal, then the cancel
  r = await t.call(PATHS.portal, { method: 'POST', headers: { 'x-bronze': token, origin: 'https://optimism.fit', referer: 'https://optimism.fit/app/tracenet.html?photons_enjoyor' } }); assert.equal(r.status, 200, r.text);
  assert.equal(r.json().url, 'https://billing.stripe.com/p/session/test_1'); assert.equal(new URLSearchParams(t.state.calls.at(-1).body).get('customer'), 'cus_1');
  r = await hook(t, { type: 'customer.subscription.deleted', data: { object: { id: 'sub_1', customer: 'cus_1', status: 'canceled', metadata: { token_hash: hash } } } });
  r = await t.call(PATHS.me, { headers: { 'x-bronze': token } }); assert.equal(r.json().active, false); assert.equal(r.json().status, 'canceled');
  assert.equal(await bronzeOf(t.env, 'B'.repeat(43), t.state.time * 1000), null, 'a token never minted here'); r = await t.call(PATHS.me, { headers: { 'x-bronze': 'nope' } }); assert.equal(r.status, 404);
  r = await t.call(PATHS.portal, { method: 'POST', headers: { 'x-bronze': 'B'.repeat(43), origin: 'https://optimism.fit' } }); assert.equal(r.status, 404);
});
test('a period that ends lets the tier go without any event; no keys, no checkout', async () => {
  const t = setup();
  const { token } = (await t.call(PATHS.checkout, { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://optimism.fit' }, body: JSON.stringify({ back: 'https://optimism.fit/app/warm.html' }) })).json();
  await hook(t, { type: 'customer.subscription.updated', data: { object: { id: 'sub_2', customer: 'cus_2', status: 'active', current_period_end: t.state.time + 60, metadata: { token_hash: await sha256Hex(token) } } } });
  assert.equal((await t.call(PATHS.me, { headers: { 'x-bronze': token } })).json().active, true);
  t.state.time += 61; assert.equal((await t.call(PATHS.me, { headers: { 'x-bronze': token } })).json().active, false);
  const r = await setup({ keys: false }).call(PATHS.checkout, { method: 'POST', headers: { 'content-type': 'application/json', origin: 'https://optimism.fit' }, body: '{}' }); assert.equal(r.status, 503);
});
test('a Gold seat won by a sealed bid holds for its access month alone; any other row holds always', () => {
  const w = windowOf('2026-11'), next = windowOf(w.access);
  assert.equal(goldMonthHolds({ gold_month: '2026-11' }, w.ends - 1), false); assert.equal(goldMonthHolds({ gold_month: '2026-11' }, w.ends), true);
  assert.equal(goldMonthHolds({ gold_month: '2026-11' }, next.ends - 1), true); assert.equal(goldMonthHolds({ gold_month: '2026-11' }, next.ends), false);
  assert.equal(goldMonthHolds({ gold_month: null }, 0), true); assert.equal(goldMonthHolds({}, 0), true); assert.equal(goldMonthHolds({ gold_month: 'nope' }, 0), false);
});

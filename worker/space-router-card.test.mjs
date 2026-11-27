// space-router-card.test.mjs · THE EGG IS THE TICKET (worker/space-router-card.mjs): the card road stands only with Stripe's keys; a checkout of one egg is signed by its
// flask and comes back to the deposit door; Stripe's signed word pours the egg as a deposit is (the tank, the deposit's row, the refill, the drop), once, into the
// tank its X account holds when one does; its id reads as a deposit's on every door. A database built by every migration; Stripe a stand-in: no network, no money.
// node --test embertide-app/ui/intro/dyson-society/worker/space-router-card.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { d1, migrated } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by the migrations named
import { createHandler } from './premint.mjs';
import { CARD_PATH, cardSignature } from './space-router-card.mjs';
import { PATHS } from './bronze.mjs';
import { tankOfAuthority } from './space-router-link.mjs'; import { wallet } from './stand-ins.mjs';
import { DEPOSIT_PATH, DROPS_PATH } from './space-router-deposit.mjs';
import { seatSignIn, sealSeatProof } from '../app/dl-direct-protocol.mjs';

const SITE = 'https://optimism.fit', HOST = 'optimism.fit', T0 = Date.UTC(2026, 10, 19, 21), HOOK = 'whsec_test', SESSION = 'cs_test_a1B2c3D4e5F6g7H8';
const enc = new TextEncoder(), hex = (b) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, '0')).join('');
async function flask() {   // a flask as the page makes it, and its x-seat
  const { address, sign } = await wallet(), seat = async (now = T0) => { const m = seatSignIn({ host: HOST, origin: SITE, address, now }); return sealSeatProof(m, await sign(enc.encode(m))); };   // its key: stand-ins.mjs wallet
  return { address, seat, tank: await tankOfAuthority(address) };
}
function site({ keys = true } = {}) {
  const db = migrated();
  const clock = { ms: T0 }, stripe = [];
  const fetcher = async (url, init = {}) => { if (String(url).startsWith('https://api.stripe.com/v1/checkout/sessions')) { stripe.push(Object.fromEntries(new URLSearchParams(init.body))); return Response.json({ id: SESSION, url: `https://checkout.stripe.com/c/pay/${SESSION}` }); } return Response.json({}, { status: 404 }); };
  const handle = createHandler({ fetcher, clockMs: () => clock.ms, clock: () => Math.floor(clock.ms / 1000) });
  const env = { ASSETS: { fetch: () => new Response('asset') }, DB: d1(db), SPACE_ROUTER_TREASURY: '9xQeWvG816bUx9EPjHmaT23yvVM2ZWbrrpZb9PusVFin', ...(keys ? { STRIPE_SECRET_KEY: 'sk_test_x', STRIPE_WEBHOOK_SECRET: HOOK } : {}) };
  const ask = async (path, { method = 'GET', headers = {}, body } = {}) => { const r = await handle(new Request(`${SITE}${path}`, { method, headers: { 'content-type': 'application/json', 'cf-connecting-ip': '203.0.113.9', ...headers }, body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body) }), env, { waitUntil() {} }); return { status: r.status, body: await r.json().catch(() => null) }; };
  const hook = async (o, { secret = HOOK, t = Math.floor(clock.ms / 1000) } = {}) => { const payload = JSON.stringify({ type: 'checkout.session.completed', data: { object: o } }), key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    return ask(PATHS.stripe, { method: 'POST', headers: { 'stripe-signature': `t=${t},v1=${hex(await crypto.subtle.sign('HMAC', key, enc.encode(`${t}.${payload}`)))}` }, body: payload }); };
  const paid = (f, extra = {}) => ({ id: SESSION, object: 'checkout.session', mode: 'payment', payment_status: 'paid', amount_total: 1000, currency: 'usd', client_reference_id: f.address, metadata: { kind: 'egg', flask: f.address }, created: Math.floor(T0 / 1000), ...extra });
  const fuel = (tank) => db.prepare('SELECT poured_usd - drunk_usd AS fuel FROM sr_tanks WHERE name = ?').get(tank)?.fuel ?? null, held = (f, id = '42') => db.prepare('INSERT INTO sr_x(address, x_id, handle, tank, bound_at, signature) VALUES (?, ?, ?, ?, ?, ?)').run(f.address, id, 'someone', f.tank, T0, 'x');   // X comes before the money (ONE NAME FOR HER)
  return { db, clock, stripe, ask, hook, paid, fuel, env, held };
}

test('the card road stands only with Stripe\'s keys, and the price is the egg\'s', async () => {
  assert.deepEqual((await site({ keys: false }).ask(CARD_PATH)).body, { card: false, usd: 10 });
  assert.deepEqual((await site().ask(CARD_PATH)).body, { card: true, usd: 10 });
  const f = await flask(); assert.equal((await site({ keys: false }).ask(CARD_PATH, { method: 'POST', headers: { origin: SITE, 'x-seat': await f.seat() }, body: { back: `${SITE}/app/warm.html` } })).status, 503, 'no keys: no checkout');
});

test('a checkout of one egg, signed by its flask, comes back to the deposit door with its session', async () => {
  const s = site(), f = await flask(), press = async () => s.ask(CARD_PATH, { method: 'POST', headers: { origin: SITE, 'x-seat': await f.seat() }, body: { back: `${SITE}/app/warm.html?ref=friend#x=1` } }), first = await press(); s.held(f); const r = await press();
  assert.deepEqual([first.status, first.body.error.message], [428, 'First, your X.'], 'X comes before the money'); assert.equal(r.status, 201); assert.equal(r.body.url, `https://checkout.stripe.com/c/pay/${SESSION}`);
  const c = s.stripe[0]; assert.deepEqual([c.mode, c['line_items[0][price_data][unit_amount]'], c['line_items[0][price_data][currency]'], c['line_items[0][quantity]'], c.client_reference_id, c['metadata[kind]'], c['metadata[flask]'], c['line_items[0][price_data][product_data][tax_code]'], c['line_items[0][price_data][tax_behavior]']], ['payment', '1000', 'usd', '1', f.address, 'egg', f.address, 'txcd_10201000', 'inclusive']);
  assert.equal(c.success_url, `${SITE}/app/warm.html?ref=friend&door=deposit&card={CHECKOUT_SESSION_ID}`, 'back to the door, the visit\'s query kept, the session named by Stripe'); assert.equal(c.cancel_url, `${SITE}/app/warm.html?ref=friend&door=deposit`);
  assert.equal((await s.ask(CARD_PATH, { method: 'POST', headers: { origin: SITE }, body: { back: `${SITE}/app/warm.html` } })).status, 403, 'no flask, no checkout');
  assert.equal((await s.ask(CARD_PATH, { method: 'POST', headers: { origin: 'https://evil.test', 'x-seat': await f.seat() }, body: { back: `${SITE}/app/warm.html` } })).status, 403, 'another site\'s page');
  assert.equal((await s.ask(CARD_PATH, { method: 'POST', headers: { origin: SITE, 'x-seat': await f.seat() }, body: { back: 'https://evil.test/' } })).status, 400, 'back to another site');
  assert.equal(s.stripe.length, 1, 'only the good ask reached Stripe');
});

test('Stripe\'s signed word pours the egg as a deposit is: the tank, the row, the refill, the drop, once', async () => {
  const s = site(), f = await flask(), sig = await cardSignature(SESSION);
  assert.deepEqual((await s.ask(`${CARD_PATH}?session=${SESSION}`)).body, { paid: false });
  assert.equal((await s.hook(s.paid(f), { secret: 'whsec_not_it' })).status, 400, 'a word Stripe did not sign pours nothing'); assert.equal(s.fuel(f.tank), null);
  assert.equal((await s.hook(s.paid(f, { payment_status: 'unpaid' }))).status, 200); assert.equal((await s.hook(s.paid(f, { metadata: { kind: 'other', flask: f.address } }))).status, 200); assert.equal(s.fuel(f.tank), null, 'unpaid, or not an egg: nothing');
  assert.equal((await s.hook(s.paid(f))).status, 200); assert.equal(s.fuel(f.tank), 10);
  const dep = s.db.prepare('SELECT * FROM sr_deposits WHERE signature = ?').get(sig); assert.deepEqual([dep.payer, dep.tank, dep.usd, dep.mint, dep.cluster, dep.keyed], [f.address, f.tank, 10, 'card', 'mainnet', 'none']);
  assert.equal(s.db.prepare("SELECT why FROM sr_ledger WHERE kind = 'refill' AND tank = ?").get(f.tank).why, `card:${SESSION}`);
  assert.deepEqual({ ...s.db.prepare('SELECT tier, usd, at_ms FROM sr_drops WHERE signature = ?').get(sig) }, { tier: 'bronze', usd: 10, at_ms: T0 });
  assert.deepEqual((await s.ask(`${CARD_PATH}?session=${SESSION}`)).body, { paid: true, signature: sig, usd: 10, tank: f.tank, fuel_usd: 10 });
  assert.equal((await s.hook(s.paid(f))).status, 200); assert.equal(s.fuel(f.tank), 10, 'the same event again pours nothing');
  assert.equal((await s.ask(`${CARD_PATH}?session=nope`)).status, 400);
});

test('a card\'s id reads as a deposit\'s: on the drops, at the deposit door, in the shape of a signature; an X-held flask fills its X account\'s tank', async () => {
  const s = site(), f = await flask(), sig = await cardSignature(SESSION);
  s.db.prepare('INSERT INTO sr_x(address, x_id, handle, tank, bound_at, signature) VALUES (?, ?, ?, ?, ?, ?)').run(f.address, '42', 'someone', 'st-xxxxxxxxxxxx', T0, 'x');
  await s.hook(s.paid(f)); assert.equal(s.fuel('st-xxxxxxxxxxxx'), 10, 'the tank its X account holds'); assert.equal(s.fuel(f.tank), null);
  assert.match(sig, /^[1-9A-HJ-NP-Za-km-z]{64,88}$/, 'every door that reads a deposit\'s signature reads this one');
  s.env.SPACE_ROUTER_USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
  assert.ok((await s.ask(`${DROPS_PATH}?after=0`)).body.drops.some((d) => d.signature === sig && d.tier === 'bronze'), 'the flask pours it');
  const told = await s.ask(DEPOSIT_PATH, { method: 'POST', body: { signature: sig } }); assert.equal(told.status, 409); assert.equal(told.body.usd, 10);
});

// worker/bronze.mjs: BRONZE IS A SUBSCRIPTION, the Worker's half (the page's: app/tracenet-bronze.mjs), FOR EVERY CREATOR. His Oct 23 2026 WEST: "the
// bronze option should support stripe as well... think like tracenet is just like patreon... it's subscription access models to traces of content";
// then "it has to be for more creators to come and do the same as well". A subscription is to one creator (?creator=<handle>; the first tracenet
// when unnamed), monthly as the creator's Stripe price says, holding the Bronze tier of the law on that creator's drops while Stripe says it is paid.
// THE MONEY (Stripe Connect, destination charges, worker/connect.mjs): the first tracenet's price is the platform's own (STRIPE_PRICE_BRONZE); every
// other creator's price is made on the platform at onboarding, and its Checkout Session carries transfer_data[destination] = the creator's Connect
// account and application_fee_percent = the tank's share (dl-direct-protocol.mjs TANK.share, 30 %: his law of every seat). Stripe pays the creator
// out; the platform keeps the share. One webhook, the platform's, sees every event.
// Stripe is reached by its REST API with the secret key (no SDK: one fetch per call), its webhook checked by its own signature scheme
// (HMAC-SHA256 over "<t>.<body>" with the endpoint secret, within five minutes). Nothing runs at rest: a renewal is Stripe's event.
// The doors, under /api/premint/bronze/:
// - GET  plan?creator=  the card road's price for that creator ({card, usd, interval, creator}), card false when it has none yet
// - POST checkout       {back, creator}: a token minted here (only its sha256 kept, the row pending), a Checkout Session in subscription mode
//                       carrying the hash (client_reference_id and the subscription's metadata), its url and the token returned; back: the page to return to
// - GET  me             x-bronze: the subscription's state for the token ({active, status, periodEnd, creator})
// - POST portal         x-bronze: a Stripe billing portal session to cancel or change the card ({url})
// - POST stripe         Stripe's webhook: checkout.session.completed and customer.subscription.created/updated/deleted move the row
// The secrets are the Worker's (wrangler secret put): STRIPE_SECRET_KEY, STRIPE_PRICE_BRONZE, STRIPE_WEBHOOK_SECRET. None is in the tree.
import { TOKEN } from '../app/tracenet-bronze.mjs';
import { TANK } from '../app/dl-direct-protocol.mjs';
import { FIRST_TRACENET, HANDLE } from '../app/tracenet-register.mjs';
import { creatorOf } from './creators.mjs'; import { eggPaid } from './space-router-card.mjs';   // THE EGG IS THE TICKET: the platform's one webhook pours a card's egg

export const PATHS = Object.freeze({ plan: '/api/premint/bronze/plan', checkout: '/api/premint/bronze/checkout', me: '/api/premint/bronze/me', portal: '/api/premint/bronze/portal', stripe: '/api/premint/bronze/stripe' });
export const STRIPE = 'https://api.stripe.com/v1';
export const TOLERANCE_S = 300;
export const PLATFORM_FEE_PERCENT = Math.round(TANK.share * 100);   // 30: the tank's share of every seat, his law
const ACTIVE = new Set(['active', 'trialing']);
const enc = new TextEncoder();
const hex = (bytes) => Array.from(new Uint8Array(bytes), (b) => b.toString(16).padStart(2, '0')).join('');
export const sha256Hex = async (text) => hex(await crypto.subtle.digest('SHA-256', enc.encode(text)));
export function newToken() { const b = crypto.getRandomValues(new Uint8Array(32)); return btoa(String.fromCharCode(...b)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
/** form(obj): Stripe's form encoding, nested keys as a[b][c]. */
export function form(obj, prefix = '') {
  const out = [];
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}[${k}]` : k;
    if (v == null) continue;
    if (typeof v === 'object') out.push(form(v, key)); else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  }
  return out.filter(Boolean).join('&');
}
/** verifyStripe(payload, header, secret, nowS): Stripe's signature: t and every v1 of the header, HMAC-SHA256(secret, "t.payload"), within tolerance. */
export async function verifyStripe(payload, header, secret, nowS, tolerance = TOLERANCE_S) {
  if (typeof header !== 'string' || !secret) return false;
  const parts = header.split(','), t = Number((parts.find((p) => p.startsWith('t=')) ?? '').slice(2)), v1 = parts.filter((p) => p.startsWith('v1=')).map((p) => p.slice(3));
  if (!Number.isSafeInteger(t) || !v1.length || Math.abs(nowS - t) > tolerance) return false;
  const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const expected = hex(await crypto.subtle.sign('HMAC', key, enc.encode(`${t}.${payload}`)));
  return v1.some((s) => s.length === expected.length && [...s].reduce((d, c, i) => d | (c.charCodeAt(0) ^ expected.charCodeAt(i)), 0) === 0);
}
/** periodEndOf(subscription): its current period's end (s); Stripe moved it onto the items in 2025, so either place. */
export const periodEndOf = (s) => s?.current_period_end ?? s?.items?.data?.[0]?.current_period_end ?? null;
/** bronzeOf(env, token, nowMs): the subscription a token holds: {active, status, periodEnd (ms), creator}, or null for a token never minted here. */
export async function bronzeOf(env, token, nowMs) {
  if (!TOKEN.test(token ?? '')) return null;
  const row = await env.DB.prepare('SELECT status, period_end, creator FROM bronze_subs WHERE token_hash=?').bind(await sha256Hex(token)).first();
  if (!row) return null;
  const periodEnd = row.period_end ? row.period_end * 1000 : null;
  return { active: ACTIVE.has(row.status) && periodEnd !== null && nowMs < periodEnd, status: row.status, periodEnd, creator: row.creator ?? FIRST_TRACENET };
}
/** stripeCall(env, fetcher, fail): one call of Stripe's REST API with the secret key. */
export function stripeCall(env, fetcher, fail) {
  return async (method, route, data) => {
    const r = await fetcher(`${STRIPE}${route}`, { method, headers: { authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, ...(data ? { 'content-type': 'application/x-www-form-urlencoded' } : {}) }, body: data ? form(data) : undefined });
    const answer = await r.json().catch(() => ({}));
    if (!r.ok) fail(`Stripe: ${answer?.error?.message ?? r.status}`, 502);
    return answer;
  };
}
/**
 * priceOf(env, creator): what a creator's card subscription charges: {price, destination} where price is the Stripe price id and destination the
 * Connect account to pay out to (null for the first tracenet, the platform's own account), or null when the creator has no card road yet.
 */
export function priceOf(env, creator) {
  if (!creator) return null;
  if (creator.register.handle === FIRST_TRACENET) return env.STRIPE_PRICE_BRONZE ? { price: env.STRIPE_PRICE_BRONZE, destination: null } : null;
  const r = creator.row ?? {};
  return r.stripe_price && r.stripe_account && r.onboarded ? { price: r.stripe_price, destination: r.stripe_account } : null;
}

/** bronzeDoors({request, env, url, path, clock, clockMs, json, fail, fetcher}): a Response for a Bronze door, or null when the path is not one. */
export async function bronzeDoors({ request, env, url, path, clock, clockMs, json, fail, fetcher = fetch }) {
  if (!path.startsWith('/api/premint/bronze/')) return null;
  const keys = Boolean(env.STRIPE_SECRET_KEY);
  const stripe = stripeCall(env, fetcher, fail);
  const creatorNamed = async (name) => {
    const handle = name == null || name === '' ? FIRST_TRACENET : String(name);
    if (!HANDLE.test(handle)) fail('No such tracenet.', 404);
    const creator = await creatorOf(env, url.origin, handle); if (!creator) fail('No such tracenet.', 404);
    return creator;
  };
  if (request.method === 'POST' && path === PATHS.stripe) {
    const payload = await request.text();
    if (payload.length > 65536) fail('Request too large', 413);
    if (!(await verifyStripe(payload, request.headers.get('stripe-signature'), env.STRIPE_WEBHOOK_SECRET, clock()))) fail('Not signed by Stripe.', 400);
    const event = JSON.parse(payload), o = event?.data?.object ?? {};
    if (event.type === 'checkout.session.completed' && o.mode === 'subscription' && /^[0-9a-f]{64}$/.test(o.client_reference_id ?? '')) {
      await env.DB.prepare('UPDATE bronze_subs SET customer=?, subscription=COALESCE(subscription, ?), updated_at=? WHERE token_hash=?').bind(o.customer ?? null, o.subscription ?? null, clock(), o.client_reference_id).run();
    } else if (/^checkout\.session\.(completed|async_payment_succeeded)$/.test(event.type) && o.mode === 'payment') { await eggPaid(env, o, clockMs);   // an egg paid by card, at once or once the bank has settled it: into its flask's tank (space-router-card.mjs)
    } else if (/^customer\.subscription\.(created|updated|deleted)$/.test(event.type) && /^[0-9a-f]{64}$/.test(o.metadata?.token_hash ?? '')) {
      const status = event.type.endsWith('deleted') ? 'canceled' : String(o.status ?? 'incomplete');
      await env.DB.prepare('UPDATE bronze_subs SET status=?, customer=COALESCE(?, customer), subscription=?, period_end=?, updated_at=? WHERE token_hash=?')
        .bind(status, o.customer ?? null, o.id ?? null, periodEndOf(o), clock(), o.metadata.token_hash).run();
    }
    return json({ received: true });
  }
  if (request.method === 'GET' && path === PATHS.plan) {
    const creator = await creatorNamed(url.searchParams.get('creator')), road = keys ? priceOf(env, creator) : null;
    if (!road) return json({ card: false, sol: Boolean(creator.register.wallet), creator: creator.register.handle, usd: creator.register.bronzeUsd });
    const price = await stripe('GET', `/prices/${encodeURIComponent(road.price)}`);
    return json({ card: Boolean(price.active && price.recurring), usd: (price.unit_amount ?? 0) / 100, currency: price.currency, interval: price.recurring?.interval ?? null, sol: Boolean(creator.register.wallet), creator: creator.register.handle, destination: Boolean(road.destination) });
  }
  if (request.method === 'POST' && path === PATHS.checkout) {
    if (!keys) fail('The card road is not set up yet.', 503);
    if (request.headers.get('origin') !== url.origin) fail('Use checkout on this website.', 403);
    const input = await request.json().catch(() => ({}));
    const creator = await creatorNamed(input.creator), road = priceOf(env, creator);
    if (!road) fail('This creator has no card road yet.', 409);
    let back; try { back = new URL(input.back); } catch { fail('Name the page to come back to.'); }
    if (back.origin !== url.origin) fail('Come back to this website.');
    const token = newToken(), hash = await sha256Hex(token), handle = creator.register.handle;
    await env.DB.prepare("INSERT INTO bronze_subs(token_hash,status,created_at,updated_at,creator) VALUES(?,'pending',?,?,?)").bind(hash, clock(), clock(), handle).run();
    const done = new URL(back); done.searchParams.set('bronze', 'welcome');
    const session = await stripe('POST', '/checkout/sessions', {
      mode: 'subscription', 'line_items[0][price]': road.price, 'line_items[0][quantity]': 1, client_reference_id: hash,
      'subscription_data[metadata][token_hash]': hash, 'subscription_data[metadata][creator]': handle, success_url: done.href, cancel_url: back.href, allow_promotion_codes: 'true',
      ...(road.destination ? { 'subscription_data[transfer_data][destination]': road.destination, 'subscription_data[application_fee_percent]': PLATFORM_FEE_PERCENT } : {}),   // THE TANK'S SHARE: 30 % stays with the platform
    });
    return json({ url: session.url, token, creator: handle }, 201);
  }
  if (request.method === 'GET' && path === PATHS.me) {
    const me = await bronzeOf(env, request.headers.get('x-bronze'), clockMs());
    if (!me) fail('No subscription for this token.', 404);
    return json(me);
  }
  if (request.method === 'POST' && path === PATHS.portal) {
    if (!keys) fail('The card road is not set up yet.', 503);
    if (request.headers.get('origin') !== url.origin) fail('Use this website.', 403);
    const token = request.headers.get('x-bronze');
    if (!TOKEN.test(token ?? '')) fail('No subscription for this token.', 404);
    const row = await env.DB.prepare('SELECT customer FROM bronze_subs WHERE token_hash=?').bind(await sha256Hex(token)).first();
    if (!row?.customer) fail('No subscription for this token.', 404);
    const portal = await stripe('POST', '/billing_portal/sessions', { customer: row.customer, return_url: `${url.origin}${new URL(request.headers.get('referer') ?? url.origin).pathname}` });
    return json({ url: portal.url });
  }
  return null;
}

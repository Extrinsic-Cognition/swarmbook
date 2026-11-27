// space-router-card.mjs · THE EGG IS THE TICKET, the card road (Nov 19 2026 UTC; his words over the deposit door's address and code: "how come you dont realize
// this ux is among the worst fucking UXs ever? like... can we please make the minting of the swarmy egg be the entrance ticket to the MMO? and i am saying this
// to say let's also sell access on stripe...", then "Yes, build it" over the frames drawn on the live page). Her egg paid by card on Stripe's own checkout is
// poured as a deposit is: the same tank, the same drop on the flask, the same face, the same count of the pre-deposits.
// - GET  CARD_PATH[, x-seat]           { card, usd }: the card road stands only with Stripe's keys (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET: his to set); asked by a flask
//                                      (x-seat), also who it is: { x, name, her }, its X account's handle, her name, and her once she is paid (space-router-egg.mjs)
// - POST CARD_PATH, x-seat, { back }   { url }: a Checkout Session of one egg (MIN_USD dollars, once), the flask that signed x-seat as its client_reference_id and
//                                      metadata; Stripe sends the payer back to the deposit door with ?card={CHECKOUT_SESSION_ID}
//   ONE NAME FOR HER (Nov 22 2026): 428 a flask no X account holds (X comes before the money); { her } a person whose egg is paid, no checkout opened; a checkout that
//   stands is answered again, never a second one; one Stripe says is paid is poured here and now, its event come or not
// - GET  CARD_PATH?session=cs_…        { paid, signature, usd, tank, fuel_usd }: whether Stripe's word has filled the tank yet (the page asks on its return)
// - eggPaid(env, session): Stripe's checkout.session.completed, through the platform's one webhook (bronze.mjs), pours what Stripe charged into the flask's tank
//   (tankOfFlask: the one its X account holds, else its own): the deposit's row (mint 'card'), the fill, the refill (why card:<session>) and the drop, in one
//   batch, under one id: base58 of SHA-512("stripe:" + session), shaped as a signature so every door that reads a deposit reads this one (the drops, her
//   portrait's pass, the count, the state of $WARM). A session pours once; a batch that failed for another cause throws, so Stripe asks again.
// The card's fee is the house's: the tank takes what the egg costs. COST: a checkout is one Stripe call; a payment one D1 batch of four. Nothing at rest.
import { MIN_USD, seatOfUsd, CARD_PATH } from '../app/dl-kit-deposit.mjs'; import { encode58, verifySeatProof } from '../app/dl-direct-protocol.mjs';
import { MARKUP_BPS } from '../app/space-router-law.mjs'; import { unkeyedOf } from '../app/space-router-deposit.mjs'; import { personOf, eggOf, hexagon, stand, nameOf } from './space-router-egg.mjs';
import { stripeCall } from './bronze.mjs'; import { tankOfFlask } from './space-router-link.mjs'; import { clusterOf, perMinute, json, refusal } from './solana-node.mjs'; import { sayDrop } from './drops-live.mjs';

export { CARD_PATH }; export const SESSION = /^cs_(test|live)_[A-Za-z0-9]{10,200}$/, EGG_TAX_CODE = 'txcd_10201000';   /* THE EGG CARRIES ITS TAX CODE (Nov 20 2026, his "Keep it, add tax code"): Managed Payments, on by default on his Stripe account, refused the egg's first live checkout for a line with no tax code; the egg is the MMO's ticket, a video game's (Video Games, downloaded, non subscription, permanent rights), its tax inside the egg's price (inclusive), so the payer pays the $10 the stamp says and amount_total stays the egg's price */
const SQL = {
  counted: 'SELECT tank, usd FROM sr_deposits WHERE signature = ?1', tank: 'SELECT name FROM sr_tanks WHERE name = ?1', fuel: 'SELECT poured_usd - drunk_usd AS fuel FROM sr_tanks WHERE name = ?1',
  deposit: "INSERT INTO sr_deposits(signature, payer, tank, amount, usd, mint, cluster, slot, paid_at, credited_at, keyed) VALUES (?1, ?2, ?3, ?4, ?5, 'card', ?6, 0, ?7, ?7, ?8)",
  fill: 'INSERT INTO sr_tanks(name, key_sha256, markup_bps, poured_usd, made_at) VALUES (?1, ?2, ?3, ?4, ?5) ON CONFLICT(name) DO UPDATE SET poured_usd = poured_usd + excluded.poured_usd',
  refill: "INSERT INTO sr_ledger(at, kind, tank, usd, why) VALUES (?1, 'refill', ?2, ?3, ?4)",
};
/** cardSignature(session): a card payment's id where a deposit's signature stands: base58 of SHA-512("stripe:" + its Checkout Session id) */
export const cardSignature = async (session) => encode58(new Uint8Array(await crypto.subtle.digest('SHA-512', new TextEncoder().encode(`stripe:${session}`))));

/** eggPaid(env, o, clockMs): pours a paid egg's Checkout Session into its flask's tank (a person's second is fuel: no second hexagon); true when this call poured it, false when it is no egg's or poured already */
export async function eggPaid(env, o, clockMs = () => Date.now()) {
  const flask = o?.metadata?.flask, usd = (Number(o?.amount_total) || 0) / 100;
  if (o?.metadata?.kind !== 'egg' || !SESSION.test(o?.id ?? '') || o.payment_status !== 'paid' || typeof flask !== 'string' || flask !== o.client_reference_id || !seatOfUsd(usd)) return false;
  const signature = await cardSignature(o.id); if (await env.DB.prepare(SQL.counted).bind(signature).first()) return false;
  const tank = await tankOfFlask(env, flask), now = clockMs(), standing = Boolean(await env.DB.prepare(SQL.tank).bind(tank).first());
  try {
    await env.DB.batch([env.DB.prepare(SQL.deposit).bind(signature, flask, tank, String(o.amount_total), usd, clusterOf(env), now, standing ? 'kept' : 'none'),
      env.DB.prepare(SQL.fill).bind(tank, unkeyedOf(tank), MARKUP_BPS, usd, now), env.DB.prepare(SQL.refill).bind(now, tank, usd, `card:${o.id}`), ...await hexagon(env, { signature, tank, usd, at: now, slot: 0, now })]);
  } catch (e) { if (await env.DB.prepare(SQL.counted).bind(signature).first()) return false; throw e; }   // poured by a twin of this event; else D1 failed and Stripe asks again
  await sayDrop(env, signature); return true;   // THE HOUSE SAYS IT AT ONCE: her egg's hexagon to every open ball
}

/** cardDoor({fetcher, clockMs}) -> (request, env, url) => Response for CARD_PATH */
export function cardDoor({ fetcher = fetch, clockMs = () => Date.now() } = {}) {
  const limited = perMinute(40), stripe = (env) => stripeCall(env, fetcher, (m) => { throw new Error(m); }), flaskOf = async (request, url) => (await verifySeatProof(request.headers.get('x-seat'), { host: url.host, origin: url.origin, now: clockMs() }))?.buyer ?? null;
  async function egg(env, tank, keys) {   // the person's egg as it stands: her once paid, else the checkout still open (url) or between Stripe and the bank (settling)
    const e = await eggOf(env, tank); if (!keys || !e?.session || e.her) return e;
    const o = await stripe(env)('GET', `/checkout/sessions/${e.session}`).catch((x) => { if (/No such/.test(x?.message ?? '')) return null; throw x; });   // one Stripe no longer knows has lapsed; any other failure opens nothing
    if (o?.payment_status === 'paid') { await eggPaid(env, o, clockMs); return eggOf(env, tank); }
    return { ...e, url: o?.status === 'open' ? o.url : null, settling: o?.status === 'complete' };
  }
  async function answer(request, env, url) {
    const keys = Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET); if (request.headers.has('x-seat') && limited(request, clockMs())) return refusal(429, 'Too many asks. Wait a minute.');   // an ask of who she is may read Stripe once
    if (request.method === 'GET') {
      const session = url.searchParams.get('session'), flask = session === null && request.headers.has('x-seat') ? await flaskOf(request, url) : null; if (session === null && !flask) return json(200, { card: keys, usd: MIN_USD });
      if (flask) { const who = await personOf(env, flask), her = (await egg(env, who.tank, keys).catch(() => eggOf(env, who.tank)))?.her ?? null; return json(200, { card: keys, usd: MIN_USD, x: who.x, name: her?.name ?? nameOf(who.tank), her }); }
      if (!SESSION.test(session)) return refusal(400, 'Not a checkout session.');
      const signature = await cardSignature(session), row = await env.DB.prepare(SQL.counted).bind(signature).first(); if (!row) return json(200, { paid: false });
      const fuel = Number((await env.DB.prepare(SQL.fuel).bind(row.tank).first())?.fuel);
      return json(200, { paid: true, signature: (await eggOf(env, row.tank))?.her?.signature ?? signature, usd: row.usd, tank: row.tank, fuel_usd: Number.isFinite(fuel) ? +fuel.toFixed(9) : null });   /* signature: her hexagon's, whichever payment this one was */
    }
    if (request.method !== 'POST') return refusal(405, 'POST { "back": "<the page to come back to>" } with x-seat, or GET ?session=<its id>.');
    if (!keys) return refusal(503, 'The card road is not open yet.');
    if (request.headers.get('origin') !== url.origin) return refusal(403, 'Use this website.');
    const flask = await flaskOf(request, url); if (!flask) return refusal(403, 'Not signed by a flask.');
    let back; try { back = new URL((await request.json())?.back); } catch { return refusal(400, 'Name the page to come back to.'); } if (back.origin !== url.origin) return refusal(400, 'Come back to this website.');
    back.searchParams.set('door', 'deposit'); back.searchParams.delete('card'); back.hash = '';
    const who = await personOf(env, flask); if (!who.x) return refusal(428, 'First, your X.');
    let stood, session; try { stood = await egg(env, who.tank, true); if (stood?.her) return json(200, { her: stood.her }); if (stood?.url) return json(200, { url: stood.url }); if (stood?.settling) return refusal(409, 'Stripe is still settling your payment. Come back in a minute.');
      session = await stripe(env)('POST', '/checkout/sessions', { mode: 'payment', 'line_items[0][quantity]': 1, 'line_items[0][price_data][currency]': 'usd',
      'line_items[0][price_data][unit_amount]': MIN_USD * 100, 'line_items[0][price_data][product_data][name]': 'Swarmy egg', 'line_items[0][price_data][product_data][tax_code]': EGG_TAX_CODE, 'line_items[0][price_data][tax_behavior]': 'inclusive', client_reference_id: flask, 'metadata[kind]': 'egg', 'metadata[flask]': flask,
      success_url: `${back.href}&card={CHECKOUT_SESSION_ID}`, cancel_url: back.href }); } catch (e) { console.error(`card: ${String(e?.message ?? e).replace(/\b(sk|rk|pk)_\w+/g, '<key>').slice(0, 400)}`); return refusal(502, 'Stripe did not open a checkout; try again.'); }   /* Stripe's reason, said once in the Worker's log (the page never shows it) */
    if (typeof session?.url !== 'string') return refusal(502, 'Stripe did not open a checkout; try again.');
    if (!await stand(env, who.tank, session.id, stood?.session ?? null, clockMs())) { const now = await egg(env, who.tank, true); return now?.her ? json(200, { her: now.her }) : now?.url ? json(200, { url: now.url }) : refusal(409, 'Another press opened a checkout; try again.'); }   /* two presses at once: one checkout is shown, the other never is */
    return json(201, { url: session.url });
  }
  return async function door(request, env, url) { try { return await answer(request, env, url); } catch (e) { console.error(`card: ${String(e?.message ?? e).replace(/\b(sk|rk|pk)_\w+/g, '<key>').slice(0, 400)}`); return refusal(503, 'The house cannot answer now; ask again.'); } };   /* its reason, said once in the Worker's log (the page never shows it); a read that failed opens no checkout */
}

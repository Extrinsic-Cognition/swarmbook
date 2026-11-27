// worker/tracenet-tank.mjs · THE FAN PAYS FROM THE TANK (Oct 30 2026, lane/the-fan-pays-from-the-tank, claude-9a126af2). His words, UTC: 18:54 "what? dont
// we got private payments or shit like that?", then "wtf? that is a faulty design", on the subscription the vault reads on chain (THE AGENTS SUBSCRIBE: one
// public transfer from the fan's wallet to the creator's, so who follows whom and every creator's takings are anyone's to read) and priced by no door
// (subscribe_lamports, a column only a test ever wrote). The tank is the house's own money road (PAY A TANK): a fan, a person or an agent, fills it once in
// dollars, and the chain holds that deposit and nothing after it.
//   POST /api/premint/creators/<handle>/price      {usd}: the tracenet's key names its price for SUBSCRIPTION_DAYS, signed in as on every creator door
//                                                  (x-seat, this website). The creator's own word, kept in tracenet_prices (migration 0016): no repo, no deploy.
//   POST /api/premint/creators/<handle>/subscribe  the fan's tank key as the bearer (or x-api-key): one D1 batch writes the access row while the tank holds the
//                                                  price beyond its calls in flight, and takes the price out of the tank for that row alone. The days stack on
//                                                  days still held. A dry tank is a 402 that names the deposit door.
//   tankAccessOf(env, request, handle, now)        for the vault: the tank key in the request opens the tracenet while a paid row holds.
// Private from whom: the world sees one deposit; whom a fan follows, and for how much, lives in this database alone, as a platform's own ledger does. Private
// from the house too would be a zero-knowledge pool: not this.
// The money: a tank holds dollars the house owes as inference; a subscription moves its price off that debt and onto the creator's takings (the rows' usd).
// The first tracenet's creator holds the treasury itself, so his are his at the instant. Another creator's payout is not built.
// His to say, said in the receipt: whether a subscription mines $WARM as a burn does (it mines none) and whether it waits for the router's opening (it does not).
// COST: a price is one seat proof and one upsert; a subscription one batch of two statements; a vault read one indexed select. Nothing at rest.
import { sha256Hex } from '../app/dl-society-codes.mjs';
import { isTankKey } from '../app/space-router-law.mjs';
import { DAY_MS, SUBSCRIPTION_DAYS } from '../app/tracenet-register.mjs';
import { DEPOSIT_PATH } from './space-router-deposit.mjs';
import { HOLD_MS } from './space-router.mjs';
import { perMinute } from './solana-node.mjs';

export const PRICE_MIN_USD = 0.5, PRICE_MAX_USD = 10000;
const TOO_MANY = perMinute(30);
const SQL = {
  price: 'SELECT usd FROM tracenet_prices WHERE handle = ?1',
  setPrice: `INSERT INTO tracenet_prices(handle, usd, wallet, set_at) VALUES (?1, ?2, ?3, ?4)
    ON CONFLICT(handle) DO UPDATE SET usd = excluded.usd, wallet = excluded.wallet, set_at = excluded.set_at`,
  // the access row, written only while the tank holds the price beyond its live holds; its days stack on the days the tank still holds here
  open: `INSERT INTO tracenet_access(id, tank, handle, usd, paid_at, until)
    SELECT ?1, t.name, ?3, ?4, ?5, MAX(?5, COALESCE((SELECT MAX(a.until) FROM tracenet_access a WHERE a.tank = t.name AND a.handle = ?3), 0)) + ?6
    FROM sr_tanks t WHERE t.key_sha256 = ?2
      AND t.poured_usd - t.drunk_usd - COALESCE((SELECT SUM(h.usd) FROM sr_holds h WHERE h.tank = t.name AND h.at > ?7), 0) >= ?4`,
  // the price out of the tank, for the row this batch wrote and no other
  pay: 'UPDATE sr_tanks SET drunk_usd = drunk_usd + ?3 WHERE key_sha256 = ?2 AND EXISTS (SELECT 1 FROM tracenet_access a WHERE a.id = ?1 AND a.tank = sr_tanks.name)',
  paid: 'SELECT a.until, t.poured_usd - t.drunk_usd AS fuel FROM tracenet_access a JOIN sr_tanks t ON t.name = a.tank WHERE a.id = ?1',
  held: 'SELECT MAX(a.until) AS until FROM tracenet_access a JOIN sr_tanks t ON t.name = a.tank WHERE t.key_sha256 = ?1 AND a.handle = ?2',
};
const cents = (usd) => Math.round(usd * 100) / 100;

/** the tank key a request carries (the bearer, or x-api-key), or null */
export function tankKeyOf(request) {
  const bearer = /^Bearer\s+(\S+)$/i.exec(request.headers.get('authorization') ?? '')?.[1], key = bearer ?? request.headers.get('x-api-key');
  return isTankKey(key) ? key : null;
}
/** a tracenet's price for SUBSCRIPTION_DAYS, {usd, days}, or null (none named, or a database without 0016) */
export async function priceOf(env, handle) {
  try { const row = env.DB ? await env.DB.prepare(SQL.price).bind(handle).first() : null; return row ? { usd: row.usd, days: SUBSCRIPTION_DAYS } : null; } catch { return null; }
}
/** the vault's terms for a fan who holds a tank: what it costs, for how long, and where to pay; null without a price */
export const tankTerms = (price, handle) => (price ? { usd: price.usd, days: price.days, door: `/api/premint/creators/${handle}/subscribe`, header: 'authorization: Bearer <your tank key>', fill: DEPOSIT_PATH } : null);
/** until when (ms) the tank this request carries holds the tracenet, or null */
export async function tankAccessOf(env, request, handle, now) {
  const key = tankKeyOf(request); if (!key || !env.DB) return null;
  try { const row = await env.DB.prepare(SQL.held).bind(await sha256Hex(key), handle).first(); return row?.until > now ? row.until : null; } catch { return null; }
}

/** tankDoors({request, env, url, creator, handle, verb, clockMs, json, fail, walletOf, keyOf}): the price and subscribe doors of one tracenet, or null */
export async function tankDoors({ request, env, url, creator, handle, verb, clockMs, json, fail, walletOf, keyOf }) {
  if (request.method !== 'POST' || (verb !== 'price' && verb !== 'subscribe')) return null;
  if (!creator) fail('No such tracenet.', 404);
  const now = clockMs();
  if (verb === 'price') {
    if (request.headers.get('origin') !== url.origin) fail('Use this website.', 403);
    const wallet = await walletOf(request, now); if (!wallet || wallet !== keyOf(creator)) fail('Sign in with this tracenet\'s wallet.', 401);
    const input = await request.json().catch(() => ({})), usd = cents(Number(input.usd));
    if (!(usd >= PRICE_MIN_USD && usd <= PRICE_MAX_USD)) fail(`A price is $${PRICE_MIN_USD} to $${PRICE_MAX_USD} for ${SUBSCRIPTION_DAYS} days.`);
    try { await env.DB.prepare(SQL.setPrice).bind(handle, usd, wallet, now).run(); } catch { fail('Subscriptions are not set up yet.', 503); }
    return json({ ok: true, handle, usd, days: SUBSCRIPTION_DAYS });
  }
  if (TOO_MANY(request, now)) fail('Too many asks: wait a minute.', 429);
  const key = tankKeyOf(request); if (!key) fail('Pay from your tank: its key as the bearer (authorization: Bearer sr_...).', 401);
  const price = await priceOf(env, handle); if (!price) fail('This tracenet names no price yet.', 409);
  const id = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, '0')).join(''), hash = await sha256Hex(key);
  let row = null;
  try {
    await env.DB.batch([env.DB.prepare(SQL.open).bind(id, hash, handle, price.usd, now, SUBSCRIPTION_DAYS * DAY_MS, now - HOLD_MS), env.DB.prepare(SQL.pay).bind(id, hash, price.usd)]);
    row = await env.DB.prepare(SQL.paid).bind(id).first();
  } catch { fail('Subscriptions are not set up yet.', 503); }
  if (!row) {
    let known = null; try { known = await env.DB.prepare('SELECT name FROM sr_tanks WHERE key_sha256 = ?1').bind(hash).first(); } catch { known = null; }
    if (!known) fail('No tank holds this key.', 401);
    return json({ error: `Your tank holds less than $${price.usd}: fill it.`, usd: price.usd, days: price.days, fill: DEPOSIT_PATH }, 402);
  }
  return json({ ok: true, handle, usd: price.usd, days: price.days, until: new Date(row.until).toISOString(), fuel: cents(row.fuel) }, 201);
}

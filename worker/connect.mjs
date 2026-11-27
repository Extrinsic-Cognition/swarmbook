// worker/connect.mjs: STRIPE CONNECT, a creator's card road (his Oct 23 2026 WEST: "how do we build a patreon-like thing where people can do the
// same?"; his pick: "Stripe Connect destination charges with a 30 % platform cut"). A creator onboards once through Stripe's own Express flow, a
// link the Worker makes, so the platform never sees their identity papers or bank; the Worker makes their monthly Bronze price on the platform's
// account with their handle in the metadata; every card subscription to them (worker/bronze.mjs) is a destination charge to their account with the
// platform's application fee (the tank's share, 30 %). Three doors under /api/premint/connect/, each for the creator's own wallet (x-seat, the
// seat proof the register's wallet signs):
// - POST onboard  {handle, back}: the creator's Connect account (Express) made once and kept on the row; an Account Link for onboarding; {url}
// - POST price    {handle, usd}: the creator's monthly Bronze price, made on the platform (an older price stays for its subscribers; new ones take the new); {price, usd}
// - GET  status?handle=: the account asked whether charges are enabled (kept on the row as onboarded), the price, the amount; {onboarded, price, usd}
// Nothing runs at rest; nothing of a creator's is kept here but two public ids.
import { HANDLE, FIRST_TRACENET } from '../app/tracenet-register.mjs';
import { creatorOf, walletOf } from './creators.mjs';
import { stripeCall } from './bronze.mjs';

export const PATHS = Object.freeze({ onboard: '/api/premint/connect/onboard', price: '/api/premint/connect/price', status: '/api/premint/connect/status' });
export const MIN_USD = 1, MAX_USD = 1000;

/** connectDoors({request, env, url, path, clock, clockMs, json, fail, fetcher}): a Response for a Connect door, or null when the path is not one. */
export async function connectDoors({ request, env, url, path, clock, clockMs, json, fail, fetcher = fetch }) {
  if (!path.startsWith('/api/premint/connect/')) return null;
  if (!env.STRIPE_SECRET_KEY) fail('The card road is not set up yet.', 503);
  const stripe = stripeCall(env, fetcher, fail);
  const own = async (handle) => {   // the creator's row, and the proof the request holds its wallet
    if (!HANDLE.test(handle ?? '')) fail('No such tracenet.', 404);
    if (handle === FIRST_TRACENET) fail('The first tracenet is the platform\'s own account.', 409);
    const creator = await creatorOf(env, url.origin, handle); if (!creator || creator.source !== 'd1') fail('No such tracenet.', 404);
    if ((await walletOf(request, clockMs())) !== creator.register.wallet) fail('Sign in with this tracenet\'s wallet.', 401);
    return creator;
  };
  if (request.method === 'GET' && path === PATHS.status) {
    const creator = await own(url.searchParams.get('handle')), row = creator.row;
    let onboarded = Boolean(row.onboarded);
    if (row.stripe_account && !onboarded) {
      const account = await stripe('GET', `/accounts/${encodeURIComponent(row.stripe_account)}`);
      onboarded = Boolean(account.charges_enabled);
      if (onboarded) await env.DB.prepare('UPDATE creators SET onboarded=1, updated_at=? WHERE handle=?').bind(clock(), row.handle).run();
    }
    return json({ handle: row.handle, account: row.stripe_account, onboarded, price: row.stripe_price, usd: row.bronze_cents ? row.bronze_cents / 100 : null, card: Boolean(onboarded && row.stripe_price) });
  }
  if (request.method !== 'POST' || request.headers.get('origin') !== url.origin) fail('Use this website.', 403);
  const input = await request.json().catch(() => ({}));
  if (path === PATHS.onboard) {
    const creator = await own(input.handle), row = creator.row;
    let back; try { back = new URL(input.back); } catch { fail('Name the page to come back to.'); }
    if (back.origin !== url.origin) fail('Come back to this website.');
    let account = row.stripe_account;
    if (!account) {
      const made = await stripe('POST', '/accounts', { type: 'express', 'capabilities[card_payments][requested]': 'true', 'capabilities[transfers][requested]': 'true', 'metadata[handle]': row.handle, 'business_profile[url]': `${url.origin}/${row.handle}` });
      account = made.id;
      await env.DB.prepare('UPDATE creators SET stripe_account=?, updated_at=? WHERE handle=?').bind(account, clock(), row.handle).run();
    }
    const done = new URL(back); done.searchParams.set('connect', 'return');
    const refresh = new URL(back); refresh.searchParams.set('connect', 'refresh');
    const link = await stripe('POST', '/account_links', { account, type: 'account_onboarding', return_url: done.href, refresh_url: refresh.href });
    return json({ url: link.url, account }, 201);
  }
  if (path === PATHS.price) {
    const creator = await own(input.handle), row = creator.row;
    const usd = Number(input.usd);
    if (!(Number.isInteger(usd) && usd >= MIN_USD && usd <= MAX_USD)) fail(`A monthly price in whole dollars, ${MIN_USD} to ${MAX_USD}.`);   // whole dollars: the SOL quote's unit too
    const cents = usd * 100;
    const price = await stripe('POST', '/prices', { currency: 'usd', unit_amount: cents, 'recurring[interval]': 'month', 'product_data[name]': `Bronze · ${row.handle}`, 'metadata[handle]': row.handle });
    await env.DB.prepare('UPDATE creators SET stripe_price=?, bronze_cents=?, updated_at=? WHERE handle=?').bind(price.id, cents, clock(), row.handle).run();
    return json({ ok: true, handle: row.handle, price: price.id, usd }, 201);
  }
  return null;
}

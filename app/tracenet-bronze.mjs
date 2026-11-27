// tracenet-bronze.mjs: BRONZE IS A SUBSCRIPTION (his Oct 23 2026 WEST: "there is no bronze option... the bronze option should support stripe as well...
// think like tracenet is just like patreon... it's subscription access models to traces of content"). The page's half of the card road, shared by the
// tracenet page (tracenet.js) and its reader (tracenet-profile.mjs); the Worker's half is worker/bronze.mjs. (The mint page's scene opened it until Oct 29.)
// A card subscriber has no wallet: the page makes nothing secret itself; the Worker mints an access token at the checkout, keeps only its sha256, and
// the page keeps the token (BRONZE_KEY) and shows it to the vault in x-bronze, as a wallet's seat proof rides x-seat. While Stripe says the
// subscription is paid (active or trialing, its period not ended) the token holds the Bronze tier of the law (tracenet-register.mjs TIER_DAYS).
export const BRONZE_KEY = 'dl-bronze-token';
export const TOKEN = /^[A-Za-z0-9_-]{43}$/;   // 32 random bytes, base64url without padding
export const PLAN_PATH = '/api/premint/bronze/plan', CHECKOUT_PATH = '/api/premint/bronze/checkout', ME_PATH = '/api/premint/bronze/me', PORTAL_PATH = '/api/premint/bronze/portal';

/** bronzeToken(storage): this browser's card subscription token, or null. */
export function bronzeToken(storage) { try { const t = storage?.getItem(BRONZE_KEY); return TOKEN.test(t ?? '') ? t : null; } catch { return null; } }
export function keepToken(storage, token) { if (!TOKEN.test(token ?? '')) return false; try { storage?.setItem(BRONZE_KEY, token); return true; } catch { return false; } }
/** receiptHeaders(receipt): what the vault is shown for a reader's access: a wallet's seat proof, or a card subscription's token. Pure. */
export function receiptHeaders(receipt) {
  if (receipt?.proof) return { 'x-seat': receipt.proof };
  if (receipt?.bronze && TOKEN.test(receipt.bronze)) return { 'x-bronze': receipt.bronze };
  return {};
}
/** planText(plan): "$10 / month" from the Worker's plan (Stripe's price), or null when the card road is not set up. Pure. */
export function planText(plan) {
  if (!plan?.card || !(plan.usd > 0)) return null;
  const usd = Number.isInteger(plan.usd) ? `$${plan.usd}` : `$${plan.usd.toFixed(2)}`;
  return `${usd} / ${plan.interval ?? 'month'}`;
}
/** bronzeOfToken({fetcher, storage}): the card subscription this browser holds, {tier: 'bronze', bronze, periodEnd} while it is paid, else null. */
export async function bronzeOfToken({ fetcher = (...a) => fetch(...a), storage = null } = {}) {
  const token = bronzeToken(storage); if (!token) return null;
  try {
    const r = await fetcher(ME_PATH, { headers: { 'x-bronze': token }, cache: 'no-store' }); if (!r.ok) return null;
    const me = await r.json();
    return me.active ? { tier: 'bronze', bronze: token, periodEnd: me.periodEnd } : null;
  } catch { return null; }
}

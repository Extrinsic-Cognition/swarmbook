// tracenet.js: what the trail's end reads of a tracenet (app/tracenet-trail.mjs): a drop's state for a seat, the address's handle, the seat this
// browser carries, sizes, days, a sha256. THE VOW MAKES THE PAGE (Nov 4 2026): the page before the trail's end went with its backup (its mount, its
// access sheet, its two sheets); they live in history at 9b8bf720c^. One GET per seat proof this browser keeps, at most six, when the page asks; none at rest.
import { savedProofs, paidSeats } from './dl-paywall.js';
import { HANDLE, TIER_DAYS, opensAt, opensFor, readManifest, vaultUrl } from './tracenet-register.mjs';
import { bronzeOfToken } from './tracenet-bronze.mjs';   // BRONZE IS A SUBSCRIPTION: a card subscriber reads as Bronze

export { opensAt, opensFor, readManifest, vaultUrl };
/**
 * A drop for a reader holding a seat of this tier (null: none): 'open' when it is everyone's; 'yours' when the tier opens it now; 'waiting'
 * when the tier opens it later than now; 'locked' for a reader with no seat.
 */
export function stateOf(item, now, tier = null) {
  const all = opensAt(item);
  if (all !== null && now >= all) return 'open';
  if (!tier) return 'locked';
  const mine = opensFor(item, tier);
  return mine !== null && now >= mine ? 'yours' : 'waiting';
}
/** The handle the address names (?of=<handle>), or null. */
export function handleOf(search) {
  const of = new URLSearchParams(search).get('of') ?? '';
  return HANDLE.test(of) ? of : null;
}
export const sizeText = (b) => (b < 1024 ? `${b} B` : b < 1048576 ? `${(b / 1024).toFixed(1)} KB` : `${(b / 1048576).toFixed(1)} MB`);
export const dayText = (ms) => new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' }).format(ms);
const tierDays = (tier) => (Object.hasOwn(TIER_DAYS, tier) ? TIER_DAYS[tier] : Infinity);
/**
 * The seat this browser carries: among the wallets whose seat proof it keeps, the paid receipt whose tier opens a drop soonest, each wallet's
 * receipts asked of the Worker once with its proof (a Gold Mint receipt ends the asking); {buyer, tier, proof}, or null when none is paid.
 */
export async function subscription({ fetcher = (...a) => fetch(...a), storage = null, now = Date.now() } = {}) {
  if (!storage) return null;
  let best = null;
  for (const { buyer, proof } of savedProofs(storage, now)) {
    try {
      const r = await fetcher(`/api/premint/receipts?buyer=${encodeURIComponent(buyer)}`, { headers: { 'x-seat': proof }, cache: 'no-store' });
      if (!r.ok) continue;
      const { orders } = await r.json();
      for (const order of paidSeats(orders, buyer)) if (!best || tierDays(order.tier) < tierDays(best.tier)) best = { buyer, tier: order.tier, proof };
      if (best && tierDays(best.tier) <= Math.min(...Object.values(TIER_DAYS))) break;
    } catch { /* the Worker did not answer: no seat from this wallet */ }
  }
  if (!best || tierDays(best.tier) > tierDays('bronze')) best = (await bronzeOfToken({ fetcher, storage })) ?? best;   // a card subscription (Stripe), when no wallet seat reads sooner
  return best;
}
export async function sha256Hex(bytes) {
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('');
}

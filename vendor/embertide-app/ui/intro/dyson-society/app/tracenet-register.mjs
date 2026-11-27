// tracenet-register.mjs: THE REGISTER OF A TRACENET, one place for the page (tracenet.js), the mint's wall (dl-paywall.js, the first tracenet),
// the Worker's vault (worker/tracenet-vault.mjs), the build (tools/build-optimism-fit.mjs) and the publisher (tools/tracenet-publish.mjs). His
// words, dated, are in app/tracenet/LANDING.md and lab/PAYWALL.md (not served: this file is).
// A tracenet's register is app/tracenet/<handle>.json, public: who, and every drop's title, kind, size, sha256 and publish time (the
// transparency). A drop's bytes are vault/<handle>/<id>/<file>, reached only through the Worker's gate, by THE LAW below. Computed at the
// request from the publish time: nothing runs at rest.
export const SCHEMA = 'optimism.tracenet/1';
export const DAY_MS = 86400000;

// THE LAW OF THE CODE, by tier (his, Oct 15 2026 00:36 WEST, in lab/PAYWALL.md): a drop is the Gold Mint's from its publish time, the Bronze
// Mint's BRONZE_DAYS after it, and everyone's, free and with no fuel, OPEN_DAYS after it (free for everyone from day 15: this lane's reading
// of his words, written there). His to move, here and nowhere else (the tests read the sources for a second definition). The mint's own 7
// days, the window in which a seat is sold and the wall stands, are another constant: MINT_DAYS in dl-paywall.js.
export const GOLD_DAYS = 0;
export const BRONZE_DAYS = 15;
export const OPEN_DAYS = 15;
// THE AGENTS SUBSCRIBE (Oct 30 2026 UTC, his 01:53 "consider that it is meant to be a onlyfans for agents", then "Build it" at 01:58 on the seat's
// words "a fan agent subscribes to a creator's tracenet and pays the creator's tank from its own key on devnet, and the creator's drops open to it for
// the period"; the road: app/tracenet-subscribe.mjs). A subscription is one payment on chain, from the subscriber's own key to the creator's payee, at
// the price the creator's register names (subscribeLamports); it holds SUBSCRIPTION_DAYS from the payment's block time, and while it holds every drop
// opens to the key that paid from its publish time (SUBSCRIBED_DAYS). A register that names no price takes no subscription.
export const SUBSCRIBED_DAYS = 0;
export const SUBSCRIPTION_DAYS = 30;
// the checkout's tiers (dl-direct-protocol.mjs TIERS), each with its days: a tier the law does not name waits for everyone
export const TIER_DAYS = Object.freeze({ gold: GOLD_DAYS, bronze: BRONZE_DAYS });
// every road a reader may hold, with its days: the checkout's tiers, and the agents' subscription (the vault's third road)
const ROAD_DAYS = Object.freeze({ ...TIER_DAYS, subscribed: SUBSCRIBED_DAYS });
export const HANDLE = /^[A-Za-z0-9_]{1,32}$/;            // an X handle without the @ (identity/x on the Nest): optimism.fit/<handle>
export const ITEM_ID = /^[a-z0-9][a-z0-9-]{0,79}$/;        // <yyyy-mm-dd>-<slug>, the publisher's
export const FILE = /^[A-Za-z0-9][A-Za-z0-9._-]{0,119}$/;  // one file a drop; no slash, no dot-only name
export const KIND = /^[a-z][a-z0-9-]{0,23}$/;
// THE PAYEE PER CREATOR (Oct 23 2026, his "it has to be for more creators to come and do the same"): a register names whose tracenet it is paid to.
export const WALLET = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;   // a Solana address (base58, 32 bytes): every SOL seat pays it, every Gold bid is sealed to it
export const STRIPE_ACCOUNT = /^acct_[A-Za-z0-9]{8,40}$/;   // the creator's Stripe Connect account, paid out by destination charges (worker/connect.mjs)
export const STRIPE_PRICE = /^price_[A-Za-z0-9]{8,40}$/;
export const FIRST_TRACENET = 'photons_enjoyor';   // the first creator (his, Oct 15 00:34 "THAT THING OVER THERE IS THE FIRST TRACENET"): the platform's own account
// THE DROP IS SIGNED BY ITS CREATOR (Oct 25 2026, app/tracenet-drop-line.mjs): a creator's drop carries their wallet's signature over its line and the
// hash of their signed line before it; an item that carries either must carry it whole, or it is no drop
export const SIG = /^[1-9A-HJ-NP-Za-km-z]{64,88}$/;   // an Ed25519 signature, base58 (64 bytes)
export const NO_PREV = 'none';                        // the prev of a creator's first signed line
export const PREV = /^(none|[0-9a-f]{64})$/;
const HTTPS = /^https:\/\/[^\s"'<>]{1,500}$/;
const SHA = /^[0-9a-f]{64}$/;

// THE SANITIZATION RECEIPT (his Oct 14 2026 23:2x WEST: "everything shared outside must be thoroughly sanitized in the nest itself"): a drop is
// published only when the Nest holds tracenet/sanitized/<sha256 of the bytes>, written by the pass that read the bytes and signed them off (the
// pass itself is the next lane, his design). The publisher reads that ref and copies its rev, seat and ts into the drop; the build reads the Nest
// again and refuses a drop whose receipt is not there, or not the same; the page and the Worker treat a drop without one as no drop at all.
// THE REF FITS THE DOOR (Oct 26 2026 22:2x WET): the Nest's ref door takes a name of 80 characters at most (nest.mjs /nest/ref/<name>, the rule the
// house pins: trace-store.test.mjs, canvas-meter.test.mjs); `tracenet/sanitized/<64 hex>` was 83 and answered 404 for ever, so no drop could pass the
// gate. The ref names the first 48 hex of the bytes' sha256 (192 bits: a name, not the proof); the receipt's VALUE carries the whole sha256 and the
// publisher holds it against the bytes (tracenet-publish.mjs receiptFromNest). The pass that writes it: tools/embertide-mesh/tracenet-sanitize.mjs.
export const SANITIZED_HEX = 48;
export const SANITIZED_REF = (sha256) => `tracenet/sanitized/${String(sha256).slice(0, SANITIZED_HEX)}`;
export function validReceipt(item) {
  const r = item?.sanitized;
  return Boolean(r) && typeof r === 'object' && r.ref === SANITIZED_REF(item.sha256) && Number.isSafeInteger(r.rev) && r.rev >= 0 &&
    typeof r.seat === 'string' && r.seat.length > 0 && r.seat.length <= 120 && Number.isFinite(r.ts) && r.ts > 0;
}

/** When a drop becomes everyone's (ms): OPEN_DAYS after its publish time; null when the publish time is not a date (the build refuses such a register). */
export function opensAt(item, days = OPEN_DAYS) {
  const ms = Date.parse(item?.published);
  return Number.isFinite(ms) ? ms + days * DAY_MS : null;
}
/** Whether a drop is everyone's at this instant (ms). A drop with no publish time never is. */
export function openToAll(item, now, days = OPEN_DAYS) {
  const at = opensAt(item, days);
  return at !== null && now >= at;
}
/** When a drop opens for a holder of this tier (ms): the tier's days after its publish time, never later than everyone's; null for no date. */
export function opensFor(item, tier) {
  return opensAt(item, Object.hasOwn(ROAD_DAYS, tier ?? '') ? Math.min(ROAD_DAYS[tier], OPEN_DAYS) : OPEN_DAYS);
}
/** Whether a drop is open to a holder of this tier at this instant (ms); no tier (null) is everyone. */
export function openTo(item, tier, now) {
  const at = opensFor(item, tier);
  return at !== null && now >= at;
}
/** The law in the page's words: "now", or "on day N" (counted from a drop's landing). */
export const whenText = (days) => (days > 0 ? `on day ${days}` : 'now');
/** The words each [data-law] piece carries (the mint's choice, the tracenet's page): gold, bronze (its tier's days) and open (everyone's). */
export const LAW_WORDS = Object.freeze({ gold: whenText(GOLD_DAYS), bronze: whenText(BRONZE_DAYS), open: whenText(OPEN_DAYS) });
export function validItem(i, { receipt = true } = {}) {   // receipt: the Nest's sanitization receipt required (the house's own registers); a creator's D1 drops carry none, the Nest is not theirs (worker/creators.mjs)
  return Boolean(i) && typeof i === 'object' && ITEM_ID.test(i.id ?? '') && FILE.test(i.file ?? '') && !String(i.file).endsWith('.') &&
    typeof i.title === 'string' && i.title.trim().length > 0 && i.title.length <= 140 && (i.kind === undefined || KIND.test(i.kind)) &&
    Number.isSafeInteger(i.bytes) && i.bytes >= 0 && SHA.test(i.sha256 ?? '') && Number.isFinite(Date.parse(i.published)) && (!receipt || validReceipt(i)) &&
    (i.sig === undefined || SIG.test(i.sig)) && (i.prev === undefined || PREV.test(i.prev));
}
/** The register as the page and the Worker read it: null unless it is this handle's; the drops that are whole, newest first. */
export function readManifest(data, handle, { receipt = true } = {}) {
  if (!data || typeof data !== 'object' || data.schema !== SCHEMA || data.handle !== handle || !HANDLE.test(handle) || !Array.isArray(data.items)) return null;
  const items = data.items.filter((i) => validItem(i, { receipt })).sort((a, b) => Date.parse(b.published) - Date.parse(a.published));
  return {
    schema: SCHEMA, handle,
    name: typeof data.name === 'string' && data.name.trim() ? data.name.trim().slice(0, 80) : handle,
    line: typeof data.line === 'string' ? data.line.trim().slice(0, 200) : '',
    x: HTTPS.test(data.x ?? '') ? data.x : null,
    avatar: HTTPS.test(data.avatar ?? '') ? data.avatar : null,
    wallet: WALLET.test(data.wallet ?? '') ? data.wallet : null,   // the creator's key (its drops and Gold totals are signed by it) and its payee unless `payee` names another; the first tracenet's is RECIPIENT when the file names none
    ...(WALLET.test(data.payee ?? '') ? { payee: data.payee } : {}),   // THE PAYEE IS NOT THE KEY (Oct 28 2026): where seats pay when that is not the key, a multisig's vault
    stripe: STRIPE_ACCOUNT.test(data.stripe ?? '') ? data.stripe : null,
    price: STRIPE_PRICE.test(data.price ?? '') ? data.price : null,
    bronzeUsd: Number.isInteger(data.bronzeUsd) && data.bronzeUsd > 0 ? data.bronzeUsd : null,   // whole dollars a month: the quote's unit (dl-direct-protocol.mjs quoteLamports)
    ...(Number.isSafeInteger(data.subscribeLamports) && data.subscribeLamports > 0 ? { subscribeLamports: data.subscribeLamports } : {}),   // THE AGENTS SUBSCRIBE: lamports for SUBSCRIPTION_DAYS, paid to the payee; none, no subscription
    items,
  };
}
/** /vault/<handle>/<id>/<file>, or null for anything else (no decoding: the three parts must be exactly their own characters). */
export function vaultPath(pathname) {
  const m = /^\/vault\/([^/]+)\/([^/]+)\/([^/]+)$/.exec(pathname);
  if (!m) return null;
  const [, handle, id, file] = m;
  if (!HANDLE.test(handle) || !ITEM_ID.test(id) || !FILE.test(file) || file.endsWith('.')) return null;
  return { handle, id, file };
}
export const vaultUrl = (handle, item) => `/vault/${handle}/${item.id}/${item.file}`;
export const registerUrl = (handle) => `/app/tracenet/${handle}.json`;

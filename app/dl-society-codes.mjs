// dl-society-codes.mjs: THE CODES OF THE SOCIETY (Oct 16 2026 06:xx UTC, his words: "these things require referral codes and install links that
// are not implemented today... do you understand how critical referrals are to our launch"; Oct 15, in the box conversation: "we can link the
// 2 things with codes (the browser page and the app ide)... they can pay directly on the main page"). Two codes, one alphabet, read the same by
// the page (optimism.fit: warm-entry.mjs, dl-direct.js, dl-seat-card.mjs), the Worker (worker/premint.mjs), the house (tools/embertide-mesh/
// lib/society-ticket.mjs) and the box (room/box-ticket-claim.mjs):
//
//   THE REFERRAL CODE, 8 letters, a paid seat's own and public, shared as https://optimism.fit/?ref=<code> (the share URL of
//   room/society-referrals.mjs, one query parameter, the canonical origin). The page keeps the last code a visit arrived with for 30 days
//   (captureReferral below) and the checkout sends it with the order it makes; the Worker resolves it to the seat it belongs to and freezes
//   that seat on the order (premint_orders.referred_by) at the order's making, before any payment, and never moves it (birth-film/
//   box-mint-logic-20261015.md, 7: "Freeze attribution before issuance and credit once per permanent issuance receipt"). A code that is not one
//   the Worker issued, or the buyer's own, refuses the order with a sentence the buyer can act on; nothing is dropped in silence.
//
//   THE CLAIM CODE, 12 letters, a paid seat's one-time key to Harmony's box ("they can pay directly on the main page... link the 2 things with
//   codes"). The Worker keeps its sha256 alone; the buyer draws it after paying (and may draw a new one, which kills the old) and sees it
//   large with its QR (claimURL below: a link the phone's camera opens, the code in the fragment, which no server log holds). Harmony's box takes
//   it typed or pasted and redeems it once, for the seat's long token (kept on the Mac, never in a browser) and the seat is bound to her wallet:
//   the ticket of box-mint-logic 2, "Bind the ticket... atomically bind one ticket to one retained birth and her existing wallet".
//
// Crockford's base32 (0-9 and A-Z without I, L, O, U): what a hand types is read with its lookalikes (o, O -> 0; i, I, l, L -> 1), its
// spaces, dashes and dots dropped, its case ignored. A code's canonical form is upper case and ungrouped; groupCode() writes it in fours for
// the eye. randomCode() draws each letter from one byte (256 is 8 x 32: no bias). Nothing here is a secret of its own: the claim code is a
// secret while it lives, and the Worker keeps only its hash.
export const CODE_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
export const REFERRAL_LENGTH = 8;
export const CLAIM_LENGTH = 12;
// the canonical origin of the share and claim links (society-referrals.mjs admits www. and embertide.gg too; one is written)
export const SITE = 'https://optimism.fit';
// the browser's own memory of the code a visit arrived with: {code, at}, kept REFERRAL_DAYS
export const REFERRAL_KEY = 'dyson-referral-v1';
export const REFERRAL_DAYS = 30;
// the browser's own memory of the last claim code it was shown for an order (CLAIM_KEY + the order id): the buyer's browser, the buyer's code
export const CLAIM_KEY = 'dyson-claim-v1:';
export const TICKET_SCHEMA = 'society.ticket/1';
const LOOKALIKE = Object.freeze({ O: '0', I: '1', L: '1' });
const DAY_MS = 86400000;

/** What a hand typed or pasted, read as a code of `length`: upper case, lookalikes mapped, separators dropped; null when it is not one. */
export function normalizeCode(text, length) {
  if (typeof text !== 'string' || text.length > 4 * length + 16) return null;
  let out = '';
  for (const raw of text.toUpperCase()) {
    if (raw === ' ' || raw === '-' || raw === '.' || raw === '\t' || raw === '\n' || raw === '\r' || raw === '‑' || raw === '–') continue;
    const c = LOOKALIKE[raw] ?? raw;
    if (!CODE_ALPHABET.includes(c)) return null;
    out += c;
  }
  return out.length === length ? out : null;
}
export const isReferralCode = (code) => typeof code === 'string' && code.length === REFERRAL_LENGTH && normalizeCode(code, REFERRAL_LENGTH) === code;
export const isClaimCode = (code) => typeof code === 'string' && code.length === CLAIM_LENGTH && normalizeCode(code, CLAIM_LENGTH) === code;
/** A fresh code of `length` letters, each from one random byte (unbiased: 256 = 8 x 32). */
export function randomCode(length, random = (n) => crypto.getRandomValues(new Uint8Array(n))) {
  const bytes = random(length);
  if (!(bytes instanceof Uint8Array) || bytes.length !== length) throw new TypeError('random bytes of the code\'s length');
  let out = '';
  for (const b of bytes) out += CODE_ALPHABET[b & 31];
  return out;
}
/** The code in fours, for the eye: 7K3M-9PQ2, 7K3M-9PQ2-X4T6. */
export const groupCode = (code) => String(code).match(/.{1,4}/g)?.join('-') ?? '';
/** The share link of a referral code: one query parameter on the canonical origin (society-referrals.mjs shareLink admits exactly this). */
export const shareURL = (code, site = SITE) => `${site}/?ref=${code}`;
/** The claim link the QR carries: the code in the fragment (never sent to a server), opened by a phone's camera on the claim page. */
export const claimURL = (code, site = SITE) => `${site}/claim#${code}`;
/** A claim code from what the box was given: the code itself, grouped or not, or a claim link (its fragment); null when it is neither. */
export function claimOfText(text) {
  if (typeof text !== 'string' || text.length > 512) return null;
  const t = text.trim();
  const direct = normalizeCode(t, CLAIM_LENGTH);
  if (direct) return direct;
  const at = t.indexOf('#');
  if (at < 0) return null;
  try { if (new URL(t).pathname !== '/claim' && !/\/claim\.html$/.test(new URL(t).pathname)) return null; } catch { return null; }
  return normalizeCode(t.slice(at + 1), CLAIM_LENGTH);
}
/** sha256 of a text, hex: the Worker keeps a claim code and a ticket token by it alone. */
export async function sha256Hex(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(String(text)));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}
const read = (storage) => { try { const v = JSON.parse(storage?.getItem(REFERRAL_KEY) ?? 'null'); return v && isReferralCode(v.code) && Number.isFinite(v.at) ? v : null; } catch { return null; } };
/** The referral this browser keeps, {code, at}, while it is within its 30 days; an expired or malformed one is forgotten. */
export function keptReferral(storage, now = Date.now()) {
  const v = read(storage);
  if (!v) return null;
  if (now - v.at > REFERRAL_DAYS * DAY_MS || v.at > now + DAY_MS) { forgetReferral(storage); return null; }
  return v;
}
export function forgetReferral(storage) { try { storage?.removeItem(REFERRAL_KEY); } catch { /* storage refused: nothing kept */ } }
/**
 * A visit's ?ref=<code>, kept in this browser (the latest arrival wins: the friend whose link brought this visit is the one this visit may
 * credit), read with its lookalikes; a visit with none, or with a word that is no code, keeps what was kept. {code, at} or null.
 */
export function captureReferral(search, storage, now = Date.now()) {
  let code = null;
  try { for (const raw of new URLSearchParams(search ?? '').getAll('ref')) { code = normalizeCode(raw, REFERRAL_LENGTH); if (code) break; } } catch { code = null; }
  if (!code) return keptReferral(storage, now);
  const kept = { code, at: now };
  try { storage?.setItem(REFERRAL_KEY, JSON.stringify(kept)); } catch { /* storage refused (a private window): the code lives this page's life */ }
  return kept;
}

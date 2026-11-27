// dl-gold-bid.mjs: THE GOLD MONTH IS A SEALED BID (his Oct 23 2026 WEST: "let's keep bronze as access eventually, gold is priority access for 1 month...
// can we turn that into a sealed bid competition? like... it would be cool if everyone could see how much money has been put but not who put how much...
// is it possible with sealed bids that get encrypted with a pubkey i own so only i can decrypt the bids and post the amount?"; his pick: "Go with A: bids
// as commitments sealed to my key on the signed log, the total verifiable by all, winners pay in SOL at the month's close"). The first tracenet is his
// (app/tracenet/photons_enjoyor.json; Oct 15 00:34 "THAT THING OVER THERE IS THE FIRST TRACENET"): Bronze stays the ticket to its traces when the law of
// the code opens them (tracenet-register.mjs TIER_DAYS); Gold becomes a month's priority access, priced by the room in a sealed-bid auction.
//
// THE LAW, one page, one Worker, one close tool sharing it:
// 1. A BID is a Pedersen commitment C = v·B + r·H to v lamports with a random blinder r, on Ed25519's prime-order group (B the basepoint, H a second
//    generator nobody knows the log of: hashed from a fixed string, cofactor cleared, pinned below), beside the amount SEALED to his key: the Solana
//    recipient of every seat (dl-direct-protocol.mjs RECIPIENT, an Ed25519 key, turned into its X25519 twin for a NaCl box). Only he can read a bid.
// 2. The bid is SIGNED by a fresh Ed25519 key made for it (the bidder's key for this bid alone: it also derives the box's ephemeral key), appended to
//    the log (the Worker's gold_bids), and the bidder keeps a RECEIPT (the key's seed, the lamports, the blinder) in the browser and in their hands.
// 3. Everyone sees HOW MUCH, nobody sees WHO PUT HOW MUCH: commitments add, so the commitment to the month's total is public arithmetic; he opens the
//    TOTAL alone (the sum of the lamports and the sum of the blinders) and anyone checks ΣC == total·B + R·H. A wrong total does not verify.
// 4. At the CLOSE he opens every bid with his key, ranks them, and posts the total with the WINNERS' openings (each commitment with its lamports and
//    blinder, which anyone checks) signed by the same key. Losers stay sealed and never pay. Winners pay in SOL within the pay window, as a Gold seat
//    of the direct mint at the bid's lamports; a winner who does not pay by then is passed and the next bid up takes the slot.
// 5. THE MONTH: bids open on day 1 00:00Z, close on day CLOSE_DAY, winners pay by PAY_DAY; the priority access is the whole of the next month. The
//    slots are the twelve chairs; the reserve is Gold's old price, applied by him at the close at the day's SOL price. His to move, here and nowhere else.
// Pure: no page, no fetch, no timer. The curve is written here in BigInt (a bid is two scalar multiplications on the bidder's own device; the sum of a
// month's commitments is additions) so the Worker and the page share one module and the house adds no vendor bytes; its oracle in the tests is
// TweetNaCl's own public keys (nacl.sign.keyPair.fromSeed is clamp(sha512(seed))·B). Not constant time: the amount is computed where it is secret.
import { RECIPIENT, TIERS, decode58, encode58 } from './dl-direct-protocol.mjs';
import { FIRST_TRACENET, HANDLE } from './tracenet-register.mjs';   // FOR EVERY CREATOR: a bid and a total name whose month they are (the first tracenet's when unnamed)

export const GOLD = Object.freeze({
  slots: 12,                      // the twelve chairs (mint-chairs.mjs): the Gold seats of a month
  reserveUsd: TIERS.gold.usd,     // Gold's old price, the floor at the close (his, at the day's SOL price)
  closeDay: 25,                   // bids close on day 25 00:00Z
  payDay: 28,                     // winners pay by day 28 00:00Z; unpaid, the next bid up
  maxLamports: 2n ** 53n - 1n,    // a bid is a safe integer of lamports (about 9 million SOL): more is a typo
});
export const BID_TYPE = 'gold.bid', TOTAL_TYPE = 'gold.total', SCHEMA = 'optimism.gold/1';
export const RECEIPT_KEY = 'dl-gold-bid';   // the bidder's receipts in this browser, by month

// ---- the month -------------------------------------------------------------------------------------------------------------------------------
const MONTH = /^(\d{4})-(0[1-9]|1[0-2])$/;
export function monthOf(now = Date.now()) { const d = new Date(now); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`; }
export function isMonth(s) { return typeof s === 'string' && MONTH.test(s); }
/** windowOf(month): the auction's instants in ms (UTC) and the month its winners have. */
export function windowOf(month) {
  const m = MONTH.exec(month); if (!m) throw new Error('Invalid month');
  const y = Number(m[1]), mo = Number(m[2]) - 1;
  const at = (day) => Date.UTC(y, mo, day);
  const next = new Date(Date.UTC(y, mo + 1, 1));
  return { month, opens: at(1), closes: at(GOLD.closeDay), pays: at(GOLD.payDay), ends: Date.UTC(y, mo + 1, 1), access: monthOf(next.getTime()) };
}
/** phaseOf(month, now): 'before' | 'open' | 'closed' (bids in, his close awaited) | 'pay' (winners paying) | 'over'. */
export function phaseOf(month, now = Date.now()) {
  const w = windowOf(month);
  return now < w.opens ? 'before' : now < w.closes ? 'open' : now < w.pays ? 'pay' : 'over';
}

// ---- the field and the curve (Ed25519, a = -1), extended coordinates ----------------------------------------------------------------------------
const P = 2n ** 255n - 19n;
export const L = 2n ** 252n + 27742317777372353535851937790883648493n;   // the group's order
const D = 37095705934669439343138083508754565189542113879843219016388785533085940283555n;
const D2 = (2n * D) % P;
const SQRT_M1 = 19681161376707505956807079304988542015446066515923890162744021073123829784752n;   // 2^((p-1)/4)
const mod = (a, m = P) => { const r = a % m; return r < 0n ? r + m : r; };
function pow(b, e, m = P) { let r = 1n; b = mod(b, m); while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n; } return r; }
const inv = (a) => pow(a, P - 2n);
const IDENTITY = Object.freeze({ X: 0n, Y: 1n, Z: 1n, T: 0n });
function add(p, q) {   // add-2008-hwcd-3, complete on this curve: doubling is add(p, p)
  const A = mod((p.Y - p.X) * (q.Y - q.X)), B = mod((p.Y + p.X) * (q.Y + q.X)), C = mod(p.T * D2 * q.T), Dd = mod(p.Z * 2n * q.Z);
  const E = B - A, F = Dd - C, G = Dd + C, H = B + A;
  return { X: mod(E * F), Y: mod(G * H), T: mod(E * H), Z: mod(F * G) };
}
function mul(p, k) { let r = IDENTITY, q = p; if (k < 0n) throw new Error('Invalid scalar'); while (k > 0n) { if (k & 1n) r = add(r, q); q = add(q, q); k >>= 1n; } return r; }   // k as given: the subgroup check multiplies by L itself
function equal(p, q) { return mod(p.X * q.Z) === mod(q.X * p.Z) && mod(p.Y * q.Z) === mod(q.Y * p.Z); }
function encodePoint(p) {
  const zi = inv(p.Z), x = mod(p.X * zi), y = mod(p.Y * zi), out = new Uint8Array(32);
  let v = y; for (let i = 0; i < 32; i++) { out[i] = Number(v & 255n); v >>= 8n; }
  out[31] |= Number(x & 1n) << 7; return out;
}
function decodePoint(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length !== 32) throw new Error('Invalid point');
  let y = 0n; for (let i = 31; i >= 0; i--) y = (y << 8n) | BigInt(bytes[i] & (i === 31 ? 127 : 255));
  const sign = bytes[31] >> 7;
  if (y >= P) throw new Error('Invalid point');
  const y2 = mod(y * y), u = mod(y2 - 1n), v = mod(D * y2 + 1n);
  let x = mod(u * pow(v, 3n) * pow(mod(u * pow(v, 7n)), (P - 5n) / 8n));
  if (mod(v * x * x) !== u) { x = mod(x * SQRT_M1); if (mod(v * x * x) !== u) throw new Error('Invalid point'); }
  if (x === 0n && sign) throw new Error('Invalid point');
  if (Number(x & 1n) !== sign) x = P - x;
  const p = { X: x, Y: y, Z: 1n, T: mod(x * y) };
  if (!equal(mul(p, L), IDENTITY)) throw new Error('Point not in the group');   // the prime-order subgroup only: a commitment carries no torsion
  return p;
}
const B = decodePoint(Uint8Array.from([0x58, ...new Array(30).fill(0x66), 0x66]));   // the basepoint, y = 4/5
// H, the second generator: the first y (little-endian sha512 of "THE GOLD BID:<i>", top bit cleared) that is on the curve, times the cofactor 8, pinned.
// nobody knows log_B(H): it was not chosen, it was found. The test derives it again from the string and holds it to this pin.
export const H_HEX = '2d7ec2a88246c3c54ca254ff1d19bd72a1bc9d6485a1e7e4fa560cac3f65cd07';   // deriveH: i = 1
export const H_SEED = 'THE GOLD BID';
export const H = decodePoint(hexBytes(H_HEX));

export function hexBytes(hex) { if (typeof hex !== 'string' || hex.length % 2 || !/^[0-9a-f]*$/.test(hex)) throw new Error('Invalid hex'); return Uint8Array.from(hex.match(/../g) ?? [], (h) => parseInt(h, 16)); }
export function bytesHex(bytes) { return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(''); }
const scalarOf = (bytes) => { let k = 0n; for (let i = bytes.length - 1; i >= 0; i--) k = (k << 8n) | BigInt(bytes[i]); return mod(k, L); };   // little-endian, reduced
const scalarBytes = (k) => { const out = new Uint8Array(32); let v = mod(k, L); for (let i = 0; i < 32; i++) { out[i] = Number(v & 255n); v >>= 8n; } return out; };

/** edPublicOf(sha512, seed32): the Ed25519 public key of a seed, clamp(sha512(seed)[0..32])·B, as nacl.sign.keyPair.fromSeed makes it (the tests' oracle). */
export function edPublicOf(sha512, seed) { const h = sha512(seed).slice(0, 32); h[0] &= 248; h[31] &= 127; h[31] |= 64; return encodePoint(mul(B, scalarOf(h))); }
/** deriveH(sha512): the second generator from the fixed string, as the pin was made (sha512: bytes -> 64 bytes; nacl.hash). */
export function deriveH(sha512) {
  for (let i = 0; i < 256; i++) {
    const h = sha512(new TextEncoder().encode(`${H_SEED}:${i}`)).slice(0, 32); h[31] &= 127;
    let y = 0n; for (let j = 31; j >= 0; j--) y = (y << 8n) | BigInt(h[j]);
    if (y >= P) continue;
    const y2 = mod(y * y), u = mod(y2 - 1n), v = mod(D * y2 + 1n);
    let x = mod(u * pow(v, 3n) * pow(mod(u * pow(v, 7n)), (P - 5n) / 8n));
    if (mod(v * x * x) !== u) { x = mod(x * SQRT_M1); if (mod(v * x * x) !== u) continue; }
    const point = mul({ X: x, Y: y, Z: 1n, T: mod(x * y) }, 8n);   // the cofactor cleared: in the prime-order group
    if (equal(point, IDENTITY)) continue;
    return { i, hex: bytesHex(encodePoint(point)) };
  }
  throw new Error('no H');
}

// ---- the commitment --------------------------------------------------------------------------------------------------------------------------
export function isLamports(v) { return typeof v === 'bigint' ? v > 0n && v <= GOLD.maxLamports : Number.isSafeInteger(v) && v > 0; }
/** commit(lamports, blinder): C = v·B + r·H, 32 bytes. blinder: 32 random bytes (the bidder's secret, kept in the receipt). */
export function commit(lamports, blinder) {
  if (!isLamports(lamports)) throw new Error('Invalid bid');
  if (!(blinder instanceof Uint8Array) || blinder.length !== 32) throw new Error('Invalid blinder');
  return encodePoint(add(mul(B, BigInt(lamports)), mul(H, scalarOf(blinder))));
}
/** sumCommitments(list of 32-byte commitments): the commitment to their total (public arithmetic). */
export function sumCommitments(commitments) { let s = IDENTITY; for (const c of commitments) s = add(s, decodePoint(c)); return encodePoint(s); }
/** sumBlinders(list of 32-byte blinders): R = Σ r mod L, 32 bytes (his, at the close). */
export function sumBlinders(blinders) { let r = 0n; for (const b of blinders) { if (!(b instanceof Uint8Array) || b.length !== 32) throw new Error('Invalid blinder'); r = mod(r + scalarOf(b), L); } return scalarBytes(r); }
/** verifyTotal(commitments, lamports, R): ΣC == total·B + R·H. Anyone, from the public log and his posted total. */
export function verifyTotal(commitments, lamports, R) {
  if (!(lamports === 0n || lamports === 0 || isLamports(lamports)) || !(R instanceof Uint8Array) || R.length !== 32) return false;
  try { return equal(decodePoint(sumCommitments(commitments)), add(mul(B, BigInt(lamports)), mul(H, scalarOf(R)))); } catch { return false; }
}
/** verifyOpening(commitment, lamports, blinder): a winner's opening. */
export function verifyOpening(commitment, lamports, blinder) { try { return bytesHex(commit(lamports, blinder)) === bytesHex(commitment); } catch { return false; } }

// ---- the seal (NaCl box to his X25519 twin; the bidder's key is an Ed25519 key made for the bid) ------------------------------------------------
/** curveOf(ed25519 public key, 32 bytes): its X25519 twin, u = (1 + y) / (1 - y). */
export function curveOf(edPub) {
  const p = decodePoint(edPub), zi = inv(p.Z), y = mod(p.Y * zi), u = mod((1n + y) * inv(1n - y)), out = new Uint8Array(32);
  let v = u; for (let i = 0; i < 32; i++) { out[i] = Number(v & 255n); v >>= 8n; } return out;
}
/** boxKeys(nacl, seed32): the X25519 keypair an Ed25519 seed gives (the clamped first half of sha512(seed)), as libsodium converts it. */
export function boxKeys(nacl, seed) {
  if (!(seed instanceof Uint8Array) || seed.length !== 32) throw new Error('Invalid seed');
  const h = nacl.hash(seed).slice(0, 32); h[0] &= 248; h[31] &= 127; h[31] |= 64;
  return nacl.box.keyPair.fromSecretKey(h);
}
const nonceOf = (nacl, fromCurve, toCurve) => nacl.hash(Uint8Array.from([...fromCurve, ...toCurve])).slice(0, 24);   // bound to the two keys, as a sealed box's is
export const PLAIN_LENGTH = 72;   // 8 lamports (big-endian) + 32 blinder + 32 payer (the wallet that will pay, or zeros)
function plainOf(lamports, blinder, payer) {
  const out = new Uint8Array(PLAIN_LENGTH); const view = new DataView(out.buffer); view.setBigUint64(0, BigInt(lamports));
  out.set(blinder, 8); if (payer) out.set(decode58(payer, 32), 40); return out;
}
function unplain(bytes) {
  if (bytes.length !== PLAIN_LENGTH) throw new Error('Invalid bid');
  const view = new DataView(bytes.buffer, bytes.byteOffset), lamports = view.getBigUint64(0), blinder = bytes.slice(8, 40), payer = bytes.slice(40, 72);
  return { lamports, blinder, payer: payer.some((b) => b) ? encode58(payer) : null };
}
/** canonicalBid(bid): the bytes the bidder signs and the log keeps: type, creator (whose month; the first tracenet's when unnamed), month, commitment, bidder (Ed25519 public key), box. */
export function canonicalBid({ creator = FIRST_TRACENET, month, commitment, bidder, box }) {
  if (!HANDLE.test(creator) || !isMonth(month) || !/^[0-9a-f]{64}$/.test(commitment) || !/^[0-9a-f]{64}$/.test(bidder) || !/^[0-9a-f]{176}$/.test(box)) throw new Error('Invalid bid');
  return new TextEncoder().encode(`${BID_TYPE}:${creator}:${month}:${commitment}:${bidder}:${box}`);
}
/**
 * makeBid({nacl, month, lamports, payer, random, recipient, creator}): the bidder's half. A fresh Ed25519 key for the bid (random(32) its seed), the
 * blinder (random(32)), the commitment, the amount and the blinder sealed to the recipient's X25519 twin (the creator's wallet), the record signed
 * by the bid's key. Returns {bid: the record to append, receipt: what the bidder keeps}. Pure: random is injected (nacl.randomBytes on the page).
 */
export function makeBid({ nacl, month, lamports, payer = null, random = nacl.randomBytes, recipient = RECIPIENT, creator = FIRST_TRACENET }) {
  if (!isMonth(month)) throw new Error('Invalid month');
  if (!isLamports(lamports)) throw new Error('Invalid bid');
  if (!HANDLE.test(creator)) throw new Error('Invalid creator');
  const seed = random(32), blinder = random(32), signer = nacl.sign.keyPair.fromSeed(seed), from = boxKeys(nacl, seed);
  const to = curveOf(decode58(recipient, 32)), nonce = nonceOf(nacl, from.publicKey, to);
  const box = nacl.box(plainOf(lamports, blinder, payer), nonce, to, from.secretKey);
  const commitment = bytesHex(commit(lamports, blinder)), bidder = bytesHex(signer.publicKey);
  const record = { type: BID_TYPE, schema: SCHEMA, creator, month, commitment, bidder, box: bytesHex(box) };
  record.signature = bytesHex(nacl.sign.detached(canonicalBid(record), signer.secretKey));
  return { bid: record, receipt: { creator, month, lamports: Number(lamports), blinder: bytesHex(blinder), seed: bytesHex(seed), commitment, payer } };
}
/** verifyBid(nacl, bid): the signature by the bid's own key over its canonical bytes (the Worker's door; subtle in the Worker, see verifyBidWith). */
export function verifyBid(nacl, bid) {
  try { return nacl.sign.detached.verify(canonicalBid(bid), hexBytes(bid.signature), hexBytes(bid.bidder)); } catch { return false; }
}
/** verifyBidWith(subtle, bid): the same with Web Crypto's Ed25519 (Workers and browsers). */
export async function verifyBidWith(subtle, bid) {
  try {
    const key = await subtle.importKey('raw', hexBytes(bid.bidder), 'Ed25519', false, ['verify']);
    return await subtle.verify('Ed25519', key, hexBytes(bid.signature), canonicalBid(bid));
  } catch { return false; }
}
/** openBid(nacl, bid, hisSecretKey64): his half: the lamports, the blinder and the payer inside a bid. hisSecretKey64: the recipient wallet's secret key (seed || public). */
export function openBid(nacl, bid, secretKey, recipient = RECIPIENT) {
  if (!(secretKey instanceof Uint8Array) || secretKey.length !== 64) throw new Error('Invalid secret key');
  if (bytesHex(secretKey.slice(32)) !== bytesHex(decode58(recipient, 32))) throw new Error('Not the recipient\'s key');
  const mine = boxKeys(nacl, secretKey.slice(0, 32)), from = curveOf(hexBytes(bid.bidder)), nonce = nonceOf(nacl, from, mine.publicKey);
  const plain = nacl.box.open(hexBytes(bid.box), nonce, from, mine.secretKey);
  if (!plain) throw new Error('The bid does not open');
  const opened = unplain(plain);
  if (bytesHex(commit(opened.lamports, opened.blinder)) !== bid.commitment) throw new Error('The bid lies about its commitment');
  return opened;
}

// ---- the close: his total and the winners ------------------------------------------------------------------------------------------------------
/** rank(opened bids [{commitment, lamports}], reserveLamports, slots): the winners, highest first, ties by the log's order (earlier first). */
export function rank(opened, reserveLamports, slots = GOLD.slots) {
  return opened.map((b, i) => ({ ...b, i })).filter((b) => BigInt(b.lamports) >= BigInt(reserveLamports))
    .sort((a, b) => (BigInt(b.lamports) > BigInt(a.lamports) ? 1 : BigInt(b.lamports) < BigInt(a.lamports) ? -1 : a.i - b.i)).slice(0, slots).map(({ i, ...b }) => b);
}
/** canonicalTotal(total): the bytes the creator signs: type, creator, month, lamports, R, the count, the winners' openings in rank order. */
export function canonicalTotal({ creator = FIRST_TRACENET, month, lamports, blinder, bids, winners }) {
  if (!HANDLE.test(creator) || !isMonth(month) || !/^[0-9a-f]{64}$/.test(blinder) || !Number.isSafeInteger(bids) || bids < 0 || !Array.isArray(winners)) throw new Error('Invalid total');
  if (!(Number.isSafeInteger(lamports) && lamports >= 0)) throw new Error('Invalid total');
  const w = winners.map((x) => { if (!/^[0-9a-f]{64}$/.test(x.commitment) || !isLamports(x.lamports) || !/^[0-9a-f]{64}$/.test(x.blinder)) throw new Error('Invalid winner'); return `${x.commitment}=${x.lamports}=${x.blinder}`; });
  return new TextEncoder().encode(`${TOTAL_TYPE}:${creator}:${month}:${lamports}:${blinder}:${bids}:${w.join(',')}`);
}
/** makeTotal({nacl, month, opened: [{commitment, lamports, blinder}] in log order, reserveLamports, slots, secretKey, creator}): the creator's signed total with the winners. */
export function makeTotal({ nacl, month, opened, reserveLamports, slots = GOLD.slots, secretKey, creator = FIRST_TRACENET }) {
  const lamports = opened.reduce((s, b) => s + BigInt(b.lamports), 0n);
  if (lamports > GOLD.maxLamports * BigInt(Math.max(1, opened.length))) throw new Error('Invalid total');
  const winners = rank(opened, reserveLamports, slots).map((b) => ({ commitment: b.commitment, lamports: Number(b.lamports), blinder: b.blinder }));
  const total = { type: TOTAL_TYPE, schema: SCHEMA, creator, month, lamports: Number(lamports), blinder: bytesHex(sumBlinders(opened.map((b) => hexBytes(b.blinder)))), bids: opened.length, winners };
  total.signature = bytesHex(nacl.sign.detached(canonicalTotal(total), secretKey));
  return total;
}
/**
 * checkTotal(total, commitments (hex, the month's log), verify): what anyone checks: his signature (verify(bytes, signature, recipientKey) -> bool or
 * Promise<bool>), the count, ΣC == total·B + R·H, every winner's opening, the winners among the commitments and at most the slots.
 */
export async function checkTotal(total, commitments, verify, recipient = RECIPIENT) {
  try {
    const bytes = canonicalTotal(total);
    if (!(await verify(bytes, hexBytes(total.signature), decode58(recipient, 32)))) return { ok: false, why: 'not his signature' };
    if (total.bids !== commitments.length) return { ok: false, why: 'the count is not the log\'s' };
    if (!verifyTotal(commitments.map(hexBytes), total.lamports, hexBytes(total.blinder))) return { ok: false, why: 'the total does not add up' };
    if (total.winners.length > GOLD.slots) return { ok: false, why: 'more winners than slots' };
    const set = new Set(commitments);
    for (const w of total.winners) {
      if (!set.has(w.commitment)) return { ok: false, why: 'a winner is not in the log' };
      if (!verifyOpening(hexBytes(w.commitment), w.lamports, hexBytes(w.blinder))) return { ok: false, why: 'a winner\'s opening is false' };
    }
    return { ok: true };
  } catch (e) { return { ok: false, why: e.message }; }
}
/** verifyWith(subtle): a verify for checkTotal from Web Crypto. */
export const verifyWith = (subtle) => async (bytes, signature, key) => {
  try { return await subtle.verify('Ed25519', await subtle.importKey('raw', key, 'Ed25519', false, ['verify']), signature, bytes); } catch { return false; }
};
/** solText(lamports): "1.250000000" SOL, for the scene. */
export function solText(lamports) { const n = BigInt(lamports); return `${n / 1000000000n}.${String(n % 1000000000n).padStart(9, '0')}`; }
/** lamportsOf(solText): a typed SOL amount to lamports, or null. */
export function lamportsOf(text) {
  const m = /^\s*(\d{1,7})(?:\.(\d{1,9}))?\s*$/.exec(String(text ?? '')); if (!m) return null;
  const v = BigInt(m[1]) * 1000000000n + BigInt((m[2] ?? '').padEnd(9, '0')); return isLamports(v) ? Number(v) : null;
}

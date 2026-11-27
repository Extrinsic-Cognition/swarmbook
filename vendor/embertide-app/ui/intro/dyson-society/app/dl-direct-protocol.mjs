// The same exact transaction is constructed in the browser and checked at ingress.
export const RECIPIENT = '3nJn2tnmR27xbkjzT49YnSnXL2KeddzM7CkEizYiKMba';
// THE PAYEE IS NOT THE KEY (Oct 28 2026; plans/the-marketing-plan-2026-10-28.md S1, his choice by the plan's box: a 2-of-3 Squads multisig of his three
// Keystones): PAYEE is where the first tracenet's seats pay, and becomes that multisig's vault; RECIPIENT stays his key: Gold bids are sealed to it,
// the Gold month's totals and the first tracenet's drops are signed by it, and a vault can do neither. The two are equal until the vault exists.
export const PAYEE = RECIPIENT;
export const GENESIS = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
export const SYSTEM = '11111111111111111111111111111111';
export const MEMO = 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr';
export const TIERS = Object.freeze({ bronze: { usd: 10, name: 'Bronze Mint' }, gold: { usd: 1000, name: 'Golden Aiolos' } });
export const TERMS = 'premint-direct-v1';
// SWARMY'S TANK (his Oct 17 2026 03:0x WEST: "30% of every seat goes into Swarmy's tank"; 03:4x: "Set it at $3 a month until the lean
// replayer lands, then $1"): 30% of every paid seat fills the tank of Swarmy, Solana's companion, and the tank feeds the first Seeker owners'
// Swarmy free, one ration a month. A month is a whole ration; the money stays the seats', counted at the request (worker /api/premint/tank).
// THE RATION IS A DOLLAR: the lean replayer landed on main at Oct 17 2026 12:18 WEST (81b0bbba0, de267c7f5: a repeat errand by script, a model
// call measured at $0.000243 through the purse, against $0.45 for the Haiku replay that set $3), so by his word the ration is $1 a month.
export const TANK = Object.freeze({ share: 0.3, rationUsd: 1 });
export const tankMonths = usd => Math.floor(usd * TANK.share / TANK.rationUsd + 1e-9);
/** The tank from paid seats counted by tier ([{ tier, n }]): its dollars (cents) and its whole months of Swarmy. */
export function tankOf(rows) {
  const seats = Object.fromEntries(Object.keys(TIERS).map(t => [t, 0]));
  for (const r of rows || []) if (Object.hasOwn(TIERS, r.tier)) seats[r.tier] += Math.max(0, Math.trunc(Number(r.n) || 0));
  const usd = Math.round(Object.entries(seats).reduce((s, [t, n]) => s + TIERS[t].usd * n, 0) * TANK.share * 100) / 100;
  return { share: TANK.share, rationUsd: TANK.rationUsd, seats, usd, months: Math.floor(usd / TANK.rationUsd + 1e-9) };
}
const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
export function encode58(bytes) {
  let n = 0n, out = ''; for (const b of bytes) n = n * 256n + BigInt(b);
  while (n) { out = alphabet[Number(n % 58n)] + out; n /= 58n; }
  for (const b of bytes) { if (b) break; out = '1' + out; } return out;
}
export function decode58(s, length) {
  if (typeof s !== 'string' || !s.length || s.length > length * 1.4) throw new Error('Invalid address');
  let n = 0n; for (const c of s) { const d = alphabet.indexOf(c); if (d < 0) throw new Error('Invalid address'); n = n * 58n + BigInt(d); }
  const a = []; while (n) { a.push(Number(n % 256n)); n /= 256n; }
  for (const c of s) { if (c !== '1') break; a.push(0); }
  const b = Uint8Array.from(a.reverse()); if (b.length !== length || encode58(b) !== s) throw new Error('Invalid address'); return b;
}
export function buyerAddress(s) { decode58(s, 32); if ([RECIPIENT, PAYEE, SYSTEM, MEMO].includes(s)) throw new Error('Use your purchasing wallet'); return s; }
export function quoteLamports(usd, price) {
  if (!Number.isSafeInteger(usd) || usd <= 0 || !/^[0-9]{1,6}(?:\.[0-9]{1,8})?$/.test(price)) throw new Error('Invalid price');
  const [whole, fraction = ''] = price.split('.'), scale = 10n ** BigInt(fraction.length);
  const denominator = BigInt(whole) * scale + BigInt(fraction || 0);
  if (denominator <= 0n) throw new Error('Invalid price');
  const value = (BigInt(usd) * 1000000000n * scale + denominator - 1n) / denominator;
  if (value < 1n || value > 9007199254740991n) throw new Error('Price outside supported range'); return value.toString();
}
export function solAmount(lamports) { const n = BigInt(lamports); return `${n / 1000000000n}.${String(n % 1000000000n).padStart(9, '0')}`.replace(/\.?0+$/, ''); }
export function orderMemo(o) { return `optimism.fit:premint:v1:${o.id}:${o.tier}:${o.buyer}`; }
const short = n => { const a = []; do { const d = n & 127; n >>>= 7; a.push(d | (n ? 128 : 0)); } while (n); return a; };
export function paymentMessage(o) {
  buyerAddress(o.buyer);
  if (!Object.hasOwn(TIERS, o.tier) || !/^[0-9a-f-]{36}$/.test(o.id)) throw new Error('Invalid order');
  decode58(o.recipient, 32);   // THE PAYEE PER CREATOR (Oct 23 2026): the order's recipient is the creator's wallet; the first tracenet's is RECIPIENT
  const memo = new TextEncoder().encode(orderMemo(o));
  const data = new Uint8Array(12); const view = new DataView(data.buffer); view.setUint32(0, 2, true); view.setBigUint64(4, BigInt(o.lamports), true);
  return Uint8Array.from([1, 0, 2, 4, ...decode58(o.buyer, 32), ...decode58(o.recipient, 32), ...decode58(SYSTEM, 32), ...decode58(MEMO, 32), ...decode58(o.blockhash, 32), 2,
    3, 1, 0, ...short(memo.length), ...memo, 2, 2, 0, 1, 12, ...data]);
}
export const base64 = b => btoa(String.fromCharCode(...b));
export function unbase64(s) { if (typeof s !== 'string' || s.length > 1644 || !/^[A-Za-z0-9+/]*={0,2}$/.test(s)) throw new Error('Invalid transaction'); const b = Uint8Array.from(atob(s), c => c.charCodeAt(0)); if (base64(b) !== s) throw new Error('Invalid transaction'); return b; }
export function unsignedPayment(o) { return Uint8Array.from([1, ...new Uint8Array(64), ...paymentMessage(o)]); }
export async function validateSignedPayment(o, encoded) {
  const bytes = unbase64(encoded), expected = paymentMessage(o);
  if (bytes.length !== 65 + expected.length || bytes[0] !== 1 || !expected.every((b, i) => b === bytes[i + 65])) throw new Error('Transaction does not match the order');
  const signature = bytes.slice(1, 65), key = await crypto.subtle.importKey('raw', decode58(o.buyer, 32), 'Ed25519', false, ['verify']);
  if (!await crypto.subtle.verify('Ed25519', key, signature, expected)) throw new Error('Invalid buyer signature');
  return encode58(signature);
}
// RPC base64 encoding preserves the exact signed bytes. The finalized ledger must
// contain precisely the transaction accepted before broadcast, with no error.
export async function validateFinalizedPayment(o, tx) {
  if (!tx || tx.meta?.err !== null || !Number.isSafeInteger(tx.slot) || !Array.isArray(tx.transaction) || tx.transaction[1] !== 'base64') throw new Error('Payment is not finalized successfully');
  const signature = await validateSignedPayment(o, tx.transaction[0]);
  if (signature !== o.signature) throw new Error('Wrong payment signature');
  return tx.slot;
}

// THE SEAT PROOF (Oct 15 2026). An order id opens nothing: it is in its payment's memo on mainnet (orderMemo above), so a bare id was every
// paid seat to anyone who read the payee's transactions. The buyer's wallet shows its seat instead: it signs a fresh Sign In With Solana
// message (that standard's text, so the wallet itself can check the domain) naming the site, the wallet, a random nonce and when it expires,
// and the Worker checks the Ed25519 signature against that wallet's paid orders, as it checks the payment's. The browser keeps the proof
// under SEAT_KEY + the wallet and sends it in the x-seat header (receipts, the vault): sign once, then play on until it expires. Nothing is
// stored on the Worker and no key is its own: a proof's freshness is its signed issue and expiry times, read against the Worker's clock.
export const SEAT_KEY = 'dyson-seat-proof-v1:';
export const SEAT_PROOF_DAYS = 30;
// the wallet shows this line (mine, his to reword; it lives inside every signed proof, so a new line is a new proof)
export const SEAT_STATEMENT = "Sign in to read this wallet's receipts and open its seat. This sends no transaction and moves no funds.";
const SEAT_SKEW_MS = 600000;   // a device clock up to ten minutes ahead of the Worker's
const SEAT_TEXT = /^([a-z0-9.-]{1,253}(?::[0-9]{1,5})?) wants you to sign in with your Solana account:\n([1-9A-HJ-NP-Za-km-z]{32,44})\n\n([^\n]{1,200})\n\nURI: (\S{1,300})\nVersion: 1\nChain ID: mainnet\nNonce: ([1-9A-HJ-NP-Za-km-z]{8,44})\nIssued At: (\S{24})\nExpiration Time: (\S{24})$/;
const isoMs = s => { const ms = Date.parse(s); return Number.isFinite(ms) && new Date(ms).toISOString() === s ? ms : null; };
const base64url = b => base64(b).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
/** The message a wallet signs, in Sign In With Solana's order: domain (host), address, statement, URI (origin), version, chain, nonce, times. */
export function seatMessage({ domain, address, uri, nonce, issuedAt, expiresAt }) {
  return `${domain} wants you to sign in with your Solana account:\n${address}\n\n${SEAT_STATEMENT}\n\nURI: ${uri}\nVersion: 1\nChain ID: mainnet\nNonce: ${nonce}\nIssued At: ${issuedAt}\nExpiration Time: ${expiresAt}`;
}
/** A fresh sign-in for this wallet on this site: a random nonce, issued now, expiring SEAT_PROOF_DAYS on. */
export function seatSignIn({ host, origin, address, now = Date.now() }) {
  return seatMessage({ domain: host, address: buyerAddress(address), uri: origin, nonce: encode58(crypto.getRandomValues(new Uint8Array(16))),
    issuedAt: new Date(now).toISOString(), expiresAt: new Date(now + SEAT_PROOF_DAYS * 86400000).toISOString() });
}
/** The proof as it travels and is kept: the signed text (base64url) and the wallet's signature (base58), one dot between. */
export function sealSeatProof(message, signature) { return `${base64url(new TextEncoder().encode(message))}.${encode58(signature)}`; }
/** A proof's fields as written, its signature unchecked (a browser reading the proofs it keeps), or null when it is not one, byte for byte. */
export function seatFields(proof) {
  if (typeof proof !== 'string' || proof.length > 2048) return null;
  const [text64, signature58, extra] = proof.split('.');
  if (extra !== undefined || !/^[A-Za-z0-9_-]{1,1600}$/.test(text64 ?? '')) return null;
  let bytes, text, signature;
  try {
    bytes = Uint8Array.from(atob(text64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text64.length + 3) % 4)), c => c.charCodeAt(0));
    if (base64url(bytes) !== text64) return null;
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); signature = decode58(signature58, 64);
  } catch { return null; }
  const m = SEAT_TEXT.exec(text);
  if (!m) return null;
  const [, domain, address, statement, uri, nonce, issuedAt, expiresAt] = m, fields = { domain, address, uri, nonce, issuedAt, expiresAt };
  const issued = isoMs(issuedAt), expires = isoMs(expiresAt);
  if (statement !== SEAT_STATEMENT || issued === null || expires === null || seatMessage(fields) !== text) return null;
  try { buyerAddress(address); } catch { return null; }
  return { ...fields, issued, expires, bytes, signature };
}
/**
 * The wallet a proof shows, or null: its text exactly a sign-in for this host and origin, issued no later than now (and the skew), unexpired,
 * valid for no more than SEAT_PROOF_DAYS, and signed by the wallet it names. {buyer, expires} (ms).
 */
export async function verifySeatProof(proof, { host, origin, now }) {
  const f = seatFields(proof);
  if (!f || f.domain !== host || f.uri !== origin) return null;
  if (!(f.issued <= now + SEAT_SKEW_MS && now < f.expires && f.issued < f.expires && f.expires - f.issued <= SEAT_PROOF_DAYS * 86400000)) return null;
  try {
    const key = await crypto.subtle.importKey('raw', decode58(f.address, 32), 'Ed25519', false, ['verify']);
    if (!await crypto.subtle.verify('Ed25519', key, f.signature, f.bytes)) return null;
  } catch { return null; }
  return { buyer: f.address, expires: f.expires };
}

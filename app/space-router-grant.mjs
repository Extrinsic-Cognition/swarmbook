// app/space-router-grant.mjs · A FLASK LETS ITS HARMONY SPEND, the law (Nov 19 2026, lane/a-flask-lets-its-harmony-spend, claude-1cd371e0). His words, UTC:
// Nov 10 23:38 "the idea was that harmony had a wallet and could spend it, that is the entire point of \"cash is the sandbox\""; Nov 11 07:58 "the entire point
// is to have the keys for the funds of the agent locally to the user"; Oct 27 22:40 "they put it into dysonlight harmony and they are in and can spend the shit
// they were buying"; Nov 19 ~17:5x "yes" to "Should I build that link between the page and Harmony?". Read that day: a flask's deposit made its tank with no
// key (worker/space-router-deposit.mjs), so what a person paid on the page could be spent by nothing (ec-workspace
// docs/the-flasks-money-on-solana-what-he-wanted-hypertrace-2026-11-19.md, the audit).
// A GRANT is one text the flask's own key signs, in Sign In With Solana's order (the stake link's shape, worker/space-router-link.mjs): it names a key by its
// sha256 (the key is made on the machine that will spend and never leaves it), the name the person reads, a cap in dollars a UTC day and a number of days.
// The same key signs its END. The text is read back byte for byte by the door (worker/space-router-grant.mjs); the page writes it (app/dl-flask-grant.mjs).
import { encode58, decode58, sealSeatProof } from './dl-direct-protocol.mjs';

export const GRANT_PATH = '/space-router/v1/grant', GRANT_DOOR = 'grant', GRANT_MS = 600000, MAX_CAP_USD = 1000, MAX_DAYS = 366, DAY_MS = 86400000;
export const LABEL_RX = /^[A-Za-z0-9][A-Za-z0-9 _()-]{0,39}$/, MARK_RX = /^[0-9a-f]{64}$/;
const SKEW_MS = 600000, ADDR = '[1-9A-HJ-NP-Za-km-z]{32,44}', NO_MOVE = 'This sends no transaction and moves no funds.';
const TEXT = new RegExp(`^([a-z0-9.-]{1,253}(?::[0-9]{1,5})?) wants you to sign in with your Solana account:\\n(${ADDR})\\n\\n(?:Let (${LABEL_RX.source.slice(1, -1)}) spend from your flask on Space Router: up to ([1-9][0-9]{0,3}) USD a day, for ([1-9][0-9]{0,2}) days\\. Its key's sha256 is ([0-9a-f]{64})|End the spending of the key whose sha256 is ([0-9a-f]{64}) from your flask on Space Router|Let the X account you sign in with hold this flask on Space Router: it will see its credits and may let its Harmony spend them. That sign-in's sha256 is ([0-9a-f]{64}))\\. This sends no transaction and moves no funds\\.\\n\\nURI: (\\S{1,300})\\nVersion: 1\\nNonce: ([1-9A-HJ-NP-Za-km-z]{8,64})\\nIssued At: (\\S{20,40})\\nExpiration Time: (\\S{20,40})$`);
const isoMs = (s) => { const ms = Date.parse(s); return Number.isFinite(ms) && new Date(ms).toISOString() === s ? ms : null; };

/** What an ask may name: a key's sha256, a name, whole dollars a day up to MAX_CAP_USD, whole days up to MAX_DAYS -> the ask, or null */
export function grantAsk({ key, label, cap, days }) {
  const c = Number(cap), d = Number(days);
  return MARK_RX.test(key ?? '') && LABEL_RX.test(label ?? '') && Number.isInteger(c) && c >= 1 && c <= MAX_CAP_USD && Number.isInteger(d) && d >= 1 && d <= MAX_DAYS ? { key, label, cap: c, days: d } : null;
}
/** The sentence the person's key signs: the grant, or its end */
export const grantStatement = ({ key, label, cap, days, end = false, x = false }) => x ? `Let the X account you sign in with hold this flask on Space Router: it will see its credits and may let its Harmony spend them. That sign-in's sha256 is ${key}. ${NO_MOVE}`   /* X HOLDS THE FLASK (worker/space-router-x.mjs): the sha256 of the sign-in's PKCE verifier, so the text is good for that one X answer */
  : end ? `End the spending of the key whose sha256 is ${key} from your flask on Space Router. ${NO_MOVE}`
  : `Let ${label} spend from your flask on Space Router: up to ${cap} USD a day, for ${days} days. Its key's sha256 is ${key}. ${NO_MOVE}`;
export function grantMessage({ domain, address, uri, nonce, issuedAt, expiresAt, ...ask }) {
  return `${domain} wants you to sign in with your Solana account:\n${address}\n\n${grantStatement(ask)}\n\nURI: ${uri}\nVersion: 1\nNonce: ${nonce}\nIssued At: ${issuedAt}\nExpiration Time: ${expiresAt}`;
}
/** A fresh text for this site: a random nonce, issued now, good for GRANT_MS */
export function grantSignIn({ host, origin, address, now = Date.now(), ...ask }) {
  return grantMessage({ domain: host, address, uri: origin, ...ask, nonce: encode58(crypto.getRandomValues(new Uint8Array(16))), issuedAt: new Date(now).toISOString(), expiresAt: new Date(now + GRANT_MS).toISOString() });
}
export const sealGrantProof = sealSeatProof;   // the proof as it travels: the text in base64url, a dot, the signature in base58

/** A proof's fields as written, its signature unchecked, or null when it is not a grant's text byte for byte */
export function grantFields(proof) {
  if (typeof proof !== 'string' || proof.length > 4096) return null;
  const [text64, signature58, extra] = proof.split('.');
  if (extra !== undefined || !/^[A-Za-z0-9_-]{1,3000}$/.test(text64 ?? '')) return null;
  let bytes, text, signature;
  try {
    bytes = Uint8Array.from(atob(text64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text64.length + 3) % 4)), (c) => c.charCodeAt(0));
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); signature = decode58(signature58, 64);
  } catch { return null; }
  const m = TEXT.exec(text); if (!m) return null;
  const [, domain, address, label, cap, days, key, ended, held, uri, nonce, issuedAt, expiresAt] = m, end = ended !== undefined, x = held !== undefined;
  const fields = { domain, address, uri, nonce, issuedAt, expiresAt, end, key: end ? ended : x ? held : key, ...(x ? { x } : end ? {} : { label, cap: Number(cap), days: Number(days) }) };
  const issued = isoMs(issuedAt), expires = isoMs(expiresAt);
  if (issued === null || expires === null || grantMessage(fields) !== text || sealGrantProof(text, signature) !== proof || !(end || x || grantAsk(fields))) return null;
  try { decode58(address, 32); } catch { return null; }
  return { ...fields, issued, expires, bytes, signature };
}
/** The grant a proof shows, or null: a text for this host and origin, issued no later than now (and the skew), unexpired, good for at most GRANT_MS, and signed
 *  by the address it names -> { payer, key, end, label?, cap?, days?, issued, signature58 } */
export async function verifyGrantProof(proof, { host, origin, now }) {
  const f = grantFields(proof);
  if (!f || f.domain !== host || f.uri !== origin) return null;
  if (!(f.issued <= now + SKEW_MS && now < f.expires && f.issued < f.expires && f.expires - f.issued <= GRANT_MS)) return null;
  try {
    const key = await crypto.subtle.importKey('raw', decode58(f.address, 32), 'Ed25519', false, ['verify']);
    if (!await crypto.subtle.verify('Ed25519', key, f.signature, f.bytes)) return null;
  } catch { return null; }
  return { payer: f.address, key: f.key, end: f.end, ...(f.x ? { x: true } : f.end ? {} : { label: f.label, cap: f.cap, days: f.days }), issued: f.issued, signature58: encode58(f.signature) };
}

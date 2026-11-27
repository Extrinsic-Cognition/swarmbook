// worker/app-attest.mjs · THE APP'S PROOF AT THE WISH DOOR (Nov 1 2026, lane/the-wish-is-a-call). His words (Nov 1 2026 04:51 UTC), over her wish as a call on
// the web page: "all of that needs to happen in the dysonlight harmony app... there should be 0 wishes granted outside of the app... that is our foot-in-the-door
// gtm operation dude". A web page cannot prove its bytes (anyone's script sends what a page sends); an app can. Apple's App Attest makes a key in the phone's
// Secure Enclave inside an app of one team and one bundle, and Apple vouches for that key with a certificate chain to its App Attestation Root CA. The wish
// door (space-router.mjs) takes a wish only under such a key, so no browser, script or curl is granted one: the install of DysonLight is the foot in the door.
// THE SAME CHECKS AS THE HOUSE'S OWN DOOR (tools/canvas-wire/attest.mjs, Apple's half, after Apple's attestation validation guide step by step), in WebCrypto:
// the edge has no node:crypto, so the certificates are read here (a small DER reader) and their ECDSA signatures checked by crypto.subtle. app-attest.test.mjs
// holds the two to one verdict on the same bytes. Stricter in one place: a certificate that signs another must say it is a CA (basicConstraints).
// No root is written in code: his hand puts Apple's root on the Worker (SPACE_ROUTER_WISH_ROOT, its PEM) and names the apps that may wish (SPACE_ROUTER_WISH_APPS,
// "<team>.<bundle>[@development]"); with either missing every proof is refused. No call to Apple: Apple's receipt in the attestation is left unread.
// What it proves: an untampered build of a named app made this key on an Apple device, and the same key speaks again (its counter never goes back). What it
// does not: one person, nor a jailbroken phone running the genuine app. One phone is held to one birth by the phone's mark the app keeps in its keychain and
// binds into the attestation (ONE PHONE, ONE BIRTH: space-router.mjs hello). The day's ceiling on the wishes (space-router.mjs) bounds the house's spend whatever passes here.
// COST: an attestation, once an install: one CBOR read, two or three certificates read, three ECDSA verifies (the leaf, the intermediate, under the root).
// A wish: one CBOR read and one ECDSA verify. Nothing is kept here; the door keeps the key's public half and its counter (migration 0017).
export const NONCE_OID = '1.2.840.113635.100.8.2';   // the credential certificate's extension that holds the nonce
export const MAX_FIELD_BYTES = 64 * 1024, MAX_CHAIN = 4;
const OID = { RSA: '1.2.840.113549.1.1.1', RSA_SHA256: '1.2.840.113549.1.1.11', EC: '1.2.840.10045.2.1', P256: '1.2.840.10045.3.1.7', P384: '1.3.132.0.34', SHA256: '1.2.840.10045.4.3.2', SHA384: '1.2.840.10045.4.3.3', BASIC: '2.5.29.19' };
const AAGUID = { production: 'appattest\0\0\0\0\0\0\0', development: 'appattestdevelop' };
const APP_ID = /^[A-Z0-9]{10}\.[A-Za-z0-9][A-Za-z0-9.-]{0,154}$/;
const te = new TextEncoder(), td = new TextDecoder();
const subtle = () => globalThis.crypto.subtle;
export class Refusal extends Error {}
export const refuse = (why) => { throw new Refusal(why); };

// ---- bytes ------------------------------------------------------------------------------------------------------------------------------------
export const same = (a, b) => { if (!a || !b || a.length !== b.length) return false; let d = 0; for (let i = 0; i < a.length; i++) d |= a[i] ^ b[i]; return d === 0; };
const cat = (...parts) => { const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0)); let o = 0; for (const p of parts) { out.set(p, o); o += p.length; } return out; };
export const sha256 = async (...parts) => new Uint8Array(await subtle().digest('SHA-256', cat(...parts.map((p) => (typeof p === 'string' ? te.encode(p) : p)))));
/** bytesOf(s): the bytes of a base64 or base64url word within MAX_FIELD_BYTES, else null */
export function bytesOf(s) {
  if (typeof s !== 'string' || !s.length || s.length > Math.ceil(MAX_FIELD_BYTES / 3) * 4 || !/^[A-Za-z0-9+/_-]+={0,2}$/.test(s)) return null;
  const t = s.replace(/-/g, '+').replace(/_/g, '/'), padded = t.length % 4 ? t + '='.repeat(4 - (t.length % 4)) : t;
  try { const bin = atob(padded), out = new Uint8Array(bin.length); for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i); return out; } catch { return null; }
}
/** b64(u8) standard base64; b64url(u8) without padding, the key's name at the door */
export const b64 = (u8) => { let s = ''; for (const b of u8) s += String.fromCharCode(b); return btoa(s); };
export const b64url = (u8) => b64(u8).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

// ---- DER, the little of it a certificate needs (definite lengths, bounded depth, never past its parent) -----------------------------------------
function tlv(b, off, end, depth = 0) {
  if (depth > 32 || off + 2 > end) throw new Error('DER: truncated');
  const id = b[off]; let p = off + 1, n = id & 0x1f;
  if (n === 0x1f) { n = 0; for (let k = 0; ; k++) { if (p >= end || k > 4) throw new Error('DER: bad tag'); const x = b[p++]; n = n * 128 + (x & 0x7f); if (!(x & 0x80)) break; } }
  if (p >= end) throw new Error('DER: truncated');
  let len = b[p++];
  if (len === 0x80) throw new Error('DER: indefinite length');
  if (len & 0x80) { const k = len & 0x7f; if (k < 1 || k > 4 || p + k > end) throw new Error('DER: bad length'); len = 0; for (let i = 0; i < k; i++) len = len * 256 + b[p++]; }
  if (p + len > end) throw new Error('DER: past its end');
  return { cls: id >> 6, cons: (id & 0x20) !== 0, n, at: off, v: p, end: p + len, b, depth };
}
export const read = (b) => { const t = tlv(b, 0, b.length); if (t.end !== b.length) throw new Error('DER: trailing bytes'); return t; };
export const val = (t) => t.b.subarray(t.v, t.end), whole = (t) => t.b.subarray(t.at, t.end);
export function kids(t) { if (!t.cons) throw new Error('DER: not constructed'); const out = []; for (let o = t.v; o < t.end;) { const c = tlv(t.b, o, t.end, t.depth + 1); out.push(c); o = c.end; } return out; }
export const is = (t, n) => t && t.cls === 0 && t.n === n;
function oidOf(t) {
  if (!is(t, 6)) throw new Error('DER: expected an oid');
  const v = val(t); if (!v.length || (v[v.length - 1] & 0x80)) throw new Error('DER: bad oid');
  const arcs = []; let n = 0;
  for (const x of v) { n = n * 128 + (x & 0x7f); if (n > Number.MAX_SAFE_INTEGER) throw new Error('DER: oid arc too large'); if (!(x & 0x80)) { arcs.push(n); n = 0; } }
  const first = arcs.shift(), a = first < 40 ? 0 : first < 80 ? 1 : 2;
  return [a, first - a * 40, ...arcs].join('.');
}
function timeOf(t) {
  const s = td.decode(val(t)); let m;
  if (is(t, 23) && (m = /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/.exec(s))) { const yy = +m[1]; return Date.UTC(yy < 50 ? 2000 + yy : 1900 + yy, +m[2] - 1, +m[3], +m[4], +m[5], +m[6]); }
  if (is(t, 24) && (m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/.exec(s))) return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  throw new Error('DER: a time it does not read');
}
/** certOf(der): what the checks read of an X.509 certificate: the signed part, its algorithm and signature, the names, the validity, the EC key, the extensions */
export function certOf(der) {
  const c = read(der), [tbsT, algT, sigT] = kids(c);
  if (!tbsT || !algT || !is(sigT, 3)) throw new Error('DER: not a certificate');
  const tbs = kids(tbsT), i = tbs[0]?.cls === 2 && tbs[0].n === 0 ? 1 : 0;
  const [serialT, innerAlg, issuer, validity, subject, spki] = tbs.slice(i);
  if (!spki) throw new Error('DER: not a certificate');
  const sigAlg = oidOf(kids(algT)[0]);
  if (oidOf(kids(innerAlg)[0]) !== sigAlg) throw new Error('DER: the two signature algorithms differ');
  const [nb, na] = kids(validity), [keyAlg, keyBits] = kids(spki), [kind, curveT] = kids(keyAlg);
  const rsa = oidOf(kind) === OID.RSA, curve = oidOf(kind) === OID.EC && curveT ? ({ [OID.P256]: 'P-256', [OID.P384]: 'P-384' })[oidOf(curveT)] ?? null : null;
  const ext = [];
  for (const t of tbs.slice(i + 6)) if (t.cls === 2 && t.n === 3) for (const e of kids(kids(t)[0])) {
    const k = kids(e); if (k.length < 2 || k.length > 3 || !is(k[k.length - 1], 4)) throw new Error('DER: a malformed extension');
    ext.push({ oid: oidOf(k[0]), critical: k.length === 3 && val(k[1])[0] !== 0, value: val(k[k.length - 1]) });
  }
  const basic = ext.find((e) => e.oid === OID.BASIC); let ca = false;
  if (basic) { const b = kids(read(basic.value)); ca = is(b[0], 1) && val(b[0])[0] !== 0; }
  const bits = val(sigT), key = val(keyBits);
  if (bits[0] !== 0 || key[0] !== 0) throw new Error('DER: a bit string with unused bits');
  let serial = ''; for (const x of is(serialT, 2) ? val(serialT) : []) serial += x.toString(16).padStart(2, '0');
  return { der, serial: serial.replace(/^0+/, '') || '0', rsa, tbs: whole(tbsT), sigAlg, sig: bits.subarray(1), issuer: whole(issuer), subject: whole(subject), notBefore: timeOf(nb), notAfter: timeOf(na),
    spki: whole(spki), curve, point: key.subarray(1), ext, ca };
}
/** rawOf(der, size): an ECDSA signature as WebCrypto reads it (r and s, each `size` bytes), from its DER SEQUENCE { r INTEGER, s INTEGER } */
function rawOf(der, size) {
  const [r, s, more] = kids(read(der)); if (!is(r, 2) || !is(s, 2) || more) throw new Error('not an ECDSA signature');
  const out = new Uint8Array(2 * size);
  for (const [t, at] of [[r, 0], [s, size]]) { let v = val(t); while (v.length > size && v[0] === 0) v = v.subarray(1); if (!v.length || v.length > size) throw new Error('ECDSA: an integer of the wrong size'); out.set(v, at + size - v.length); }
  return out;
}
const SIZE = { 'P-256': 32, 'P-384': 48 };
export async function verifiesWith(spki, curve, hash, der, data) {
  try { const key = await subtle().importKey('spki', spki, { name: 'ECDSA', namedCurve: curve }, false, ['verify']); return await subtle().verify({ name: 'ECDSA', hash }, key, rawOf(der, SIZE[curve]), data); }
  catch { return false; }
}
/** signedBy(child, parent): the child names the parent as its issuer, the parent is a CA and its key signed the child (ECDSA; RSA PKCS#1 v1.5 with SHA-256 for
 *  Google's RSA root, android-attest.mjs) */
export async function signedBy(child, parent) {
  if (!parent.ca || !same(child.issuer, parent.subject)) return false;
  if (parent.rsa) {
    if (child.sigAlg !== OID.RSA_SHA256) return false;
    try { const key = await subtle().importKey('spki', parent.spki, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']); return await subtle().verify('RSASSA-PKCS1-v1_5', key, child.sig, child.tbs); }
    catch { return false; }
  }
  const hash = ({ [OID.SHA256]: 'SHA-256', [OID.SHA384]: 'SHA-384' })[child.sigAlg];
  if (!hash || !parent.curve) return false;
  return verifiesWith(parent.spki, parent.curve, hash, child.sig, child.tbs);
}

// ---- CBOR, the little of it Apple's objects use: maps with text keys, arrays, byte and text strings, integers; definite lengths only -----------------
export function cborDecode(b) {
  if (!(b instanceof Uint8Array)) throw new Error('CBOR: not bytes');
  const [v, end] = item(b, 0, 0); if (end !== b.length) throw new Error('CBOR: trailing bytes'); return v;
}
function item(b, p, depth) {
  if (depth > 16) throw new Error('CBOR: too deep');
  if (p >= b.length) throw new Error('CBOR: truncated');
  const ib = b[p++], major = ib >> 5, ai = ib & 0x1f, need = (k) => { if (p + k > b.length) throw new Error('CBOR: truncated'); };
  let n;
  if (ai < 24) n = ai;
  else if (ai === 24) { need(1); n = b[p]; p += 1; }
  else if (ai === 25) { need(2); n = b[p] * 256 + b[p + 1]; p += 2; }
  else if (ai === 26) { need(4); n = ((b[p] * 256 + b[p + 1]) * 256 + b[p + 2]) * 256 + b[p + 3]; p += 4; }
  else if (ai === 27) { need(8); n = 0; for (let i = 0; i < 8; i++) n = n * 256 + b[p + i]; p += 8; if (!Number.isSafeInteger(n)) throw new Error('CBOR: too large'); }
  else throw new Error('CBOR: indefinite or reserved');
  switch (major) {
    case 0: return [n, p];
    case 1: return [-1 - n, p];
    case 2: need(n); return [b.slice(p, p + n), p + n];
    case 3: need(n); return [td.decode(b.subarray(p, p + n)), p + n];
    case 4: { const out = []; for (let i = 0; i < n; i++) { const [v, q] = item(b, p, depth + 1); out.push(v); p = q; } return [out, p]; }
    case 5: { const out = {}; for (let i = 0; i < n; i++) { const [k, q] = item(b, p, depth + 1); if (typeof k !== 'string') throw new Error('CBOR: a map key that is not text'); const [v, r] = item(b, q, depth + 1); out[k] = v; p = r; } return [out, p]; }
    default: throw new Error(`CBOR: major type ${major} not taken`);
  }
}
const isObj = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) && !(v instanceof Uint8Array);

// ---- his hand: the apps and Apple's root ------------------------------------------------------------------------------------------------------
/** appsOf(text): SPACE_ROUTER_WISH_APPS, the apps that may wish: "<team id>.<bundle id>" each, "@development" after one a developer's build attests in; any
 *  other word is left out. -> [{appId, environment}] */
export function appsOf(text) {
  return String(text ?? '').split(/[\s,]+/).filter(Boolean).map((w) => { const [appId, env = 'production'] = w.split('@'); return { appId, environment: env }; })
    .filter((a) => APP_ID.test(a.appId) && (a.environment === 'production' || a.environment === 'development'));
}
/** rootsOf(pem): SPACE_ROUTER_WISH_ROOT, the roots as his hand placed them in one text: Apple's App Attestation Root CA, and Google's two key attestation roots
 *  for Android (android-attest.mjs); one that does not read is left out */
export function rootsOf(pem) {
  const out = [];
  for (const block of String(pem ?? '').match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g) || []) {
    const der = bytesOf(block.replace(/-----(BEGIN|END) CERTIFICATE-----|\s+/g, '')); if (!der) continue;
    try { out.push(certOf(der)); } catch { /* not a certificate: left out */ }
  }
  return out;
}

// ---- the two proofs --------------------------------------------------------------------------------------------------------------------------
/** attestationOf({attestation, clientDataHash, key, apps, roots, now}): a key's first word, Apple's attestation object (base64), checked as Apple's guide says.
 *  key: the key's id as the door names it (base64url of its 32 bytes). -> {ok: true, device: {key, app, environment, pub, counter: 0}} or {ok: false, why}; never throws */
export async function attestationOf({ attestation, clientDataHash, key, apps = [], roots = [], now = Date.now() } = {}) {
  try {
    const keyId = bytesOf(key); if (!keyId || keyId.length !== 32 || b64url(keyId) !== key) refuse('the key is not named as the door names keys (base64url of 32 bytes)');
    const att = bytesOf(attestation); if (!att) refuse('the attestation is not a base64 word within the bound');
    let obj; try { obj = cborDecode(att); } catch (e) { refuse(`the attestation is not CBOR it reads (${e.message})`); }
    if (!isObj(obj) || obj.fmt !== 'apple-appattest') refuse('the attestation is not of the apple-appattest format');
    const x5c = obj.attStmt?.x5c, authData = obj.authData;
    if (!Array.isArray(x5c) || !x5c.length || x5c.length > MAX_CHAIN || !x5c.every((c) => c instanceof Uint8Array) || !(authData instanceof Uint8Array)) refuse('the attestation lacks its certificates or its authenticator data');
    let certs; try { certs = x5c.map(certOf); } catch { refuse('a certificate of the chain does not read'); }
    if (!roots.length) refuse("no root of Apple's is on the Worker (SPACE_ROUTER_WISH_ROOT)");
    for (let i = 0; i + 1 < certs.length; i++) if (!(await signedBy(certs[i], certs[i + 1]))) refuse('a certificate of the chain is not signed by the next');
    const last = certs[certs.length - 1];
    let root = roots.find((r) => same(r.der, last.der)) || null;
    if (!root) for (const r of roots) if (await signedBy(last, r)) { root = r; break; }
    if (!root) refuse('the chain does not end under the root');
    for (const c of [...certs, root]) if (!(c.notBefore <= now && now <= c.notAfter)) refuse('a certificate of the chain is not valid now');
    const leaf = certs[0], ext = leaf.ext.find((e) => e.oid === NONCE_OID); if (!ext) refuse('the leaf certificate carries no App Attest nonce');
    let nonce; try { const [c1] = kids(read(ext.value)); if (!c1 || c1.cls !== 2 || c1.n !== 1 || !c1.cons) throw 0; const [os] = kids(c1); if (!is(os, 4)) throw 0; nonce = val(os); }
    catch { refuse('the nonce extension is not shaped as Apple shapes it'); }
    if (!same(nonce, await sha256(authData, clientDataHash))) refuse('the nonce in the leaf certificate is not the hash of this authenticator data and this challenge');
    if (authData.length < 55) refuse('the authenticator data is too short');
    const rpIdHash = authData.subarray(0, 32), counter = ((authData[33] * 256 + authData[34]) * 256 + authData[35]) * 256 + authData[36];
    const aaguid = td.decode(authData.subarray(37, 53)), credLen = authData[53] * 256 + authData[54], credId = authData.subarray(55, 55 + credLen);
    if (credLen !== 32 || credId.length !== 32) refuse('the credential id is not 32 bytes');
    let app = null; for (const a of apps) if (same(await sha256(a.appId), rpIdHash)) { app = a; break; }
    if (!app) refuse('the attestation is for an app the door does not name');
    const env = aaguid === AAGUID.development ? 'development' : aaguid === AAGUID.production ? 'production' : null;
    if (!env) refuse('the aaguid is neither appattest nor appattestdevelop');
    if (env !== app.environment) refuse(`the attestation is from the ${env} environment and the app is named in ${app.environment}`);
    if (counter !== 0) refuse('a fresh attestation has a counter other than zero');
    if (leaf.curve !== 'P-256' || leaf.point.length !== 65 || leaf.point[0] !== 4) refuse('the attested key is not P-256');
    if (!same(await sha256(leaf.point), credId)) refuse("the credential id is not the hash of the leaf's key");
    if (!same(credId, keyId)) refuse('the key named is not the attested key');
    return { ok: true, device: { key, app: app.appId, environment: env, pub: b64(leaf.spki), counter: 0 } };
  } catch (e) { return { ok: false, why: e instanceof Refusal ? e.message : `an unreadable proof (${e?.message || e})` }; }
}
/** assertionOf({assertion, clientDataHash, known: {app, pub, counter}}): every later word of a key: signed by the key attested before, for the same app, its
 *  counter past the last one the door saw. -> {ok: true, counter} or {ok: false, why}; never throws */
export async function assertionOf({ assertion, clientDataHash, known } = {}) {
  try {
    if (!isObj(known) || typeof known.app !== 'string' || typeof known.pub !== 'string' || !Number.isSafeInteger(known.counter)) refuse('no attestation is known for this key');
    const asr = bytesOf(assertion); if (!asr) refuse('the assertion is not a base64 word within the bound');
    let obj; try { obj = cborDecode(asr); } catch (e) { refuse(`the assertion is not CBOR it reads (${e.message})`); }
    if (!isObj(obj) || !(obj.signature instanceof Uint8Array) || !(obj.authenticatorData instanceof Uint8Array)) refuse('the assertion lacks its signature or its authenticator data');
    const ad = obj.authenticatorData; if (ad.length < 37) refuse("the assertion's authenticator data is too short");
    if (!same(ad.subarray(0, 32), await sha256(known.app))) refuse('the assertion is for another app');
    const pub = bytesOf(known.pub); if (!pub) refuse('the key kept for it does not read');
    if (!(await verifiesWith(pub, 'P-256', 'SHA-256', obj.signature, await sha256(ad, clientDataHash)))) refuse('the assertion is not signed by the attested key');
    const counter = ((ad[33] * 256 + ad[34]) * 256 + ad[35]) * 256 + ad[36];
    if (!(counter > known.counter)) refuse("the assertion's counter did not advance (a replay)");
    return { ok: true, counter };
  } catch (e) { return { ok: false, why: e instanceof Refusal ? e.message : `an unreadable proof (${e?.message || e})` }; }
}

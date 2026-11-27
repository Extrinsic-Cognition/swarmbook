// der.mjs - A SMALL DER CODEC FOR THE DOOR'S ATTESTATIONS (Nov 1 2026). The platform vendors' attestations are X.509 certificates with private
// extensions (Apple's nonce, Android's key description), and Node's X509Certificate shows no extension it does not know; so the door reads the
// bytes itself (attest.mjs). Decode: one TLV at a time, definite lengths only, bounded in depth and never past the buffer (a bad input throws a
// plain Error; attest.mjs turns it into a refusal). Encode: enough to build a v3 certificate signed with ECDSA P-256, so the test grows its own
// chains from invented roots and no real vendor material is ever read by a test. Nothing here touches a file or a network.
import {sign} from 'node:crypto';

export const MAX_DEPTH = 32;
export const UNIVERSAL = 0, CONTEXT = 2;
export const T = {BOOLEAN: 1, INTEGER: 2, BIT_STRING: 3, OCTET_STRING: 4, NULL: 5, OID: 6, ENUMERATED: 10, UTF8: 12, SEQUENCE: 16, SET: 17, PRINTABLE: 19, IA5: 22, UTC_TIME: 23, GENERALIZED_TIME: 24};

// ---- decode -----------------------------------------------------------------------------------------------------------------------------------
/** One TLV at `off`: {cls, constructed, number, value (a subarray of buf), end}. Throws on anything malformed, indefinite or past the buffer. */
export function readTLV(buf, off = 0, depth = 0) {
  if (!Buffer.isBuffer(buf)) throw new Error('DER: not a buffer');
  if (depth > MAX_DEPTH) throw new Error('DER: too deep');
  if (off + 2 > buf.length) throw new Error('DER: truncated');
  const id = buf[off]; let p = off + 1;
  const cls = id >> 6, constructed = (id & 0x20) !== 0; let number = id & 0x1f;
  if (number === 0x1f) {
    number = 0;
    for (let n = 0; ; n++) {
      if (p >= buf.length || n > 4) throw new Error('DER: bad tag');
      const b = buf[p++]; number = number * 128 + (b & 0x7f);
      if (!(b & 0x80)) break;
    }
  }
  if (p >= buf.length) throw new Error('DER: truncated');
  let len = buf[p++];
  if (len === 0x80) throw new Error('DER: indefinite length');
  if (len & 0x80) {
    const n = len & 0x7f;
    if (n < 1 || n > 4 || p + n > buf.length) throw new Error('DER: bad length');
    len = 0; for (let i = 0; i < n; i++) len = len * 256 + buf[p++];
  }
  if (p + len > buf.length) throw new Error('DER: length past the buffer');
  return {cls, constructed, number, value: buf.subarray(p, p + len), end: p + len};
}
/** The TLVs inside a constructed one, in order. */
export function children(tlv, depth = 0) {
  if (!tlv?.constructed) throw new Error('DER: not constructed');
  const out = []; let o = 0;
  while (o < tlv.value.length) { const c = readTLV(tlv.value, o, depth + 1); out.push(c); o = c.end; }
  return out;
}
const expect = (tlv, number, what) => { if (!tlv || tlv.cls !== UNIVERSAL || tlv.number !== number) throw new Error(`DER: expected ${what}`); return tlv.value; };
/** An OBJECT IDENTIFIER as its dotted string. */
export function oidOf(tlv) {
  const v = expect(tlv, T.OID, 'an object identifier');
  if (!v.length || (v[v.length - 1] & 0x80)) throw new Error('DER: bad oid');
  const arcs = []; let n = 0;
  for (let i = 0; i < v.length; i++) {
    n = n * 128 + (v[i] & 0x7f);
    if (n > Number.MAX_SAFE_INTEGER) throw new Error('DER: oid arc too large');
    if (!(v[i] & 0x80)) { arcs.push(n); n = 0; }
  }
  const first = arcs.shift(), a = first < 40 ? 0 : first < 80 ? 1 : 2;
  return [a, first - a * 40, ...arcs].join('.');
}
const intOf = tlv => {
  const v = tlv.value; if (!v.length || v.length > 64) throw new Error('DER: bad integer');
  let n = 0n; for (const b of v) n = (n << 8n) | BigInt(b);
  return (v[0] & 0x80) ? n - (1n << BigInt(8 * v.length)) : n;
};
/** An INTEGER as a BigInt. */
export const integerOf = tlv => { expect(tlv, T.INTEGER, 'an integer'); return intOf(tlv); };
/** An ENUMERATED as a number. */
export const enumeratedOf = tlv => { expect(tlv, T.ENUMERATED, 'an enumerated'); return Number(intOf(tlv)); };
export const booleanOf = tlv => { const v = expect(tlv, T.BOOLEAN, 'a boolean'); if (v.length !== 1) throw new Error('DER: bad boolean'); return v[0] !== 0; };
/** An OCTET STRING's bytes (a copy). */
export const octetsOf = tlv => Buffer.from(expect(tlv, T.OCTET_STRING, 'an octet string'));
/** A UTCTime or GeneralizedTime (Z only) as ms since the epoch. */
export function timeOf(tlv) {
  const s = tlv?.value?.toString('ascii') || ''; let m;
  if (tlv.cls === UNIVERSAL && tlv.number === T.UTC_TIME && (m = /^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/.exec(s))) { const yy = +m[1]; return Date.UTC(yy < 50 ? 2000 + yy : 1900 + yy, +m[2] - 1, +m[3], +m[4], +m[5], +m[6]); }
  if (tlv.cls === UNIVERSAL && tlv.number === T.GENERALIZED_TIME && (m = /^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})Z$/.exec(s))) return Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]);
  throw new Error('DER: a time it does not read');
}
/** A certificate's extensions, read from its DER: [{oid, critical, value (the OCTET STRING's bytes)}]. */
export function certificateExtensions(der) {
  const cert = readTLV(der), [tbs] = children(cert), parts = children(tbs);
  const wrap = parts.find(p => p.cls === CONTEXT && p.number === 3);
  if (!wrap) return [];
  const [list] = children(wrap);
  return children(list).map(e => {
    const c = children(e);
    if (c.length < 2 || c.length > 3) throw new Error('DER: a malformed extension');
    return {oid: oidOf(c[0]), critical: c.length === 3 ? booleanOf(c[1]) : false, value: octetsOf(c[c.length - 1])};
  });
}

// ---- encode -----------------------------------------------------------------------------------------------------------------------------------
const lengthBytes = n => { if (n < 0x80) return Buffer.from([n]); const b = []; for (let x = n; x > 0; x = Math.floor(x / 256)) b.unshift(x & 0xff); return Buffer.from([0x80 | b.length, ...b]); };
const tagBytes = ({cls = UNIVERSAL, constructed = false, number}) => {
  const lead = (cls << 6) | (constructed ? 0x20 : 0);
  if (number < 31) return Buffer.from([lead | number]);
  const b = []; for (let x = number; ; x = Math.floor(x / 128)) { b.unshift(x & 0x7f); if (x < 128) break; }
  for (let i = 0; i < b.length - 1; i++) b[i] |= 0x80;
  return Buffer.from([lead | 0x1f, ...b]);
};
/** One TLV: `tag` an identifier byte (0x30, 0x04, ...) or {cls, constructed, number}. */
export function enc(tag, content) {
  const t = typeof tag === 'number' ? {cls: tag >> 6, constructed: (tag & 0x20) !== 0, number: tag & 0x1f} : tag;
  return Buffer.concat([tagBytes(t), lengthBytes(content.length), content]);
}
const intBytes = v => {
  if (Buffer.isBuffer(v)) { let i = 0; while (i < v.length - 1 && v[i] === 0 && !(v[i + 1] & 0x80)) i++; const b = v.subarray(i); return (b[0] & 0x80) ? Buffer.concat([Buffer.from([0]), b]) : Buffer.from(b); }
  const n = BigInt(v); if (n < 0n) throw new Error('DER: only non-negative integers are encoded here');
  let hex = n.toString(16); if (hex.length % 2) hex = '0' + hex;
  const b = Buffer.from(hex, 'hex'); return (b[0] & 0x80) ? Buffer.concat([Buffer.from([0]), b]) : b;
};
export const seq = (...parts) => enc(0x30, Buffer.concat(parts));
export const set = (...parts) => enc(0x31, Buffer.concat(parts));
export const int = v => enc(T.INTEGER, intBytes(v));
export const enumerated = n => enc(T.ENUMERATED, intBytes(n));
export const bool = v => enc(T.BOOLEAN, Buffer.from([v ? 0xff : 0]));
export const octet = b => enc(T.OCTET_STRING, Buffer.from(b));
export const bitString = b => enc(T.BIT_STRING, Buffer.concat([Buffer.from([0]), b]));
export const nul = () => enc(T.NULL, Buffer.alloc(0));
export const utf8 = s => enc(T.UTF8, Buffer.from(s, 'utf8'));
export const printable = s => enc(T.PRINTABLE, Buffer.from(s, 'ascii'));
export function oid(dotted) {
  const arcs = String(dotted).split('.').map(Number);
  if (arcs.length < 2 || arcs.some(a => !Number.isSafeInteger(a) || a < 0)) throw new Error('DER: bad oid');
  const out = [40 * arcs[0] + arcs[1]];
  for (const a of arcs.slice(2)) { const b = []; for (let x = a; ; x = Math.floor(x / 128)) { b.unshift(x & 0x7f); if (x < 128) break; } for (let i = 0; i < b.length - 1; i++) b[i] |= 0x80; out.push(...b); }
  return enc(T.OID, Buffer.from(out));
}
const two = n => String(n).padStart(2, '0');
const stamp = (d, year) => `${year}${two(d.getUTCMonth() + 1)}${two(d.getUTCDate())}${two(d.getUTCHours())}${two(d.getUTCMinutes())}${two(d.getUTCSeconds())}Z`;
export const utcTime = ms => { const d = new Date(ms); return enc(T.UTC_TIME, Buffer.from(stamp(d, two(d.getUTCFullYear() % 100)))); };
export const generalizedTime = ms => { const d = new Date(ms); return enc(T.GENERALIZED_TIME, Buffer.from(stamp(d, String(d.getUTCFullYear()).padStart(4, '0')))); };
/** X.509's Time: UTCTime through 2049, GeneralizedTime after. */
export const time = ms => { const y = new Date(ms).getUTCFullYear(); return y >= 1950 && y < 2050 ? utcTime(ms) : generalizedTime(ms); };
/** A context-specific TLV [number]; constructed (EXPLICIT) unless said otherwise. Tag numbers past 30 take the long form. */
export const ctx = (number, content, constructed = true) => enc({cls: CONTEXT, constructed, number}, content);

// ---- a v3 certificate, for the test's own chains ---------------------------------------------------------------------------------------------
export const ECDSA_WITH_SHA256 = '1.2.840.10045.4.3.2';
export const OID_CN = '2.5.4.3', OID_BASIC_CONSTRAINTS = '2.5.29.19';
/** A Name with one common name. */
export const name = cn => seq(set(seq(oid(OID_CN), utf8(cn))));
/** An Extension: its OID, critical or not, its value wrapped as the OCTET STRING X.509 wants. */
export const extension = (id, value, critical = false) => seq(oid(id), ...(critical ? [bool(true)] : []), octet(value));
/** basicConstraints CA:TRUE, critical. */
export const caConstraint = () => extension(OID_BASIC_CONSTRAINTS, seq(bool(true)), true);
/** A v3 certificate signed with ECDSA P-256 over SHA-256: {serial (number, BigInt or bytes), issuer (its CN), subject (CN), notBefore/notAfter (ms),
 *  publicKey (a KeyObject), extensions ([extension(...)]), signer (the issuer's private KeyObject)}. Returns the DER. */
export function certificate({serial, issuer, subject, notBefore, notAfter, publicKey, extensions = [], signer}) {
  const alg = seq(oid(ECDSA_WITH_SHA256));
  const tbs = seq(ctx(0, int(2)), int(serial), alg, name(issuer), seq(time(notBefore), time(notAfter)), name(subject), publicKey.export({type: 'spki', format: 'der'}), ...(extensions.length ? [ctx(3, seq(...extensions))] : []));
  const sig = sign('sha256', tbs, {key: signer, dsaEncoding: 'der'});
  return seq(tbs, alg, bitString(sig));
}

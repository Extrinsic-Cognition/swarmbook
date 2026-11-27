// attest.mjs - VERIFIED BYTES AT THE DOOR: a client's proof of its own software (Nov 1 2026). His words (Nov 1 2026, 03:53 UTC): "for friends and
// for colleagues we trust only trusted clients that are running verified bytes... is there any way to check if people are running non-tampered
// software? or is it a trust-me-bro situation?" For a phone or a tablet the answer is: not trust-me-bro. The platform's vendor vouches, with a
// certificate chain to a root it publishes, that a key was made in hardware inside an app with this id, signed by this publisher, on a device whose
// boot was verified (Apple: App Attest; Android: hardware key attestation, which holds for an app installed by hand, where Play's own verdict would
// not). The door checks that vouching here, at home, against roots his hand placed under the wire's state (roots/apple-*.pem, roots/android-*.pem):
// no call to Apple or Google, ever. Apple's receipt for its fraud-metrics service rides in the attestation and is left unread; Google's revocation
// list is a call-out, so a trusted app's `revokedSerials` is taken in its place. No root is written in code: a wrong constant is worse than none, and
// with no root for a kind every proof of that kind is refused. The proof is bound to this dialer (the node id QUIC proved), this grant and a
// ten-minute window with no round trip: the challenge is derived, not sent (challengeFor), and the previous window is taken for a slow clock.
//
// What this proves: which bytes run (an untampered build of a named app, as its publisher signed it) on what kind of device, and that the same key
// speaks again (Apple's assertion counter never goes back). What it does not: nothing about the person at the screen (a friend can photograph
// it); nothing about a browser (a web page cannot attest its bytes); nothing about an agent's model (a cloud seat is trusted by his act, not by
// bytes); a jailbroken device running the genuine app may still pass Apple's attestation. The membrane's bound on what crosses (gate.mjs) holds
// either way: this raises the bar on the client, it does not replace the bound.
import fs from 'node:fs';
import {join} from 'node:path';
import {createHash, verify, X509Certificate} from 'node:crypto';
import {readTLV, children, integerOf, enumeratedOf, booleanOf, octetsOf, certificateExtensions, CONTEXT} from './der.mjs';

export const ATTEST_DOMAIN = 'canvas-wire/attest/v1\n';
export const WINDOW_MS = 600_000;
export const MAX_FIELD_BYTES = 64 * 1024;
export const MAX_CHAIN = 6;
export const KINDS = ['apple-appattest', 'android-key'];
/** Apple's credCert extension holding the nonce; Android's key description extension. */
export const APPLE_NONCE_OID = '1.2.840.113635.100.8.2';
export const ANDROID_KEY_DESCRIPTION_OID = '1.3.6.1.4.1.11129.2.1.17';
const AAGUID = {production: Buffer.concat([Buffer.from('appattest'), Buffer.alloc(7)]), development: Buffer.from('appattestdevelop')};
const BOOT = ['verified', 'self-signed', 'unverified', 'failed'];
const B64 = /^[A-Za-z0-9+/_-]+={0,2}$/;

const sha256 = (...parts) => createHash('sha256').update(Buffer.concat(parts.map(p => Buffer.from(p)))).digest();
const isObj = v => v !== null && typeof v === 'object' && !Array.isArray(v);
class Refusal extends Error {}
const refuse = why => { throw new Refusal(why); };

export const windowOf = now => Math.floor(now / WINDOW_MS);
/** The windows a proof may be bound to at `now`: the current one and the one before (a slow clock on the client). */
export const windowsAt = now => [windowOf(now), windowOf(now) - 1];
/** THE CLIENTS BRING THEIR PROOF (Nov 1 2026): a hello that CLAIMS its grant (the word `seat` answered by his admission, or an invite) cannot know the
 *  grant's id: the door mints it at that very hello. Such a hello binds its proof to this id instead; the node the wire proved and the window still bind
 *  it, and a claim is spent once. Every later hello carries the grant it was given and binds that grant's own id. */
export const CLAIM_GRANT_ID = '000000000000';
/** The challenge a client's proof is bound to: this dialer, this grant, this window. Derived on both sides, never sent. */
export function challengeFor({node, grantId, window}) {
  if (!/^[0-9a-f]{64}$/.test(node || '')) throw new Error('a challenge is bound to a node id (64 hex)');
  if (!/^[0-9a-f]{12}$/.test(grantId || '')) throw new Error('a challenge is bound to a grant id (12 hex)');
  if (!Number.isSafeInteger(window)) throw new Error('a challenge is bound to a window');
  return sha256(Buffer.from(`${ATTEST_DOMAIN}${node}\n${grantId}\n${window}`));
}

// ---- CBOR, the little of it Apple's objects use: maps with text keys, arrays, byte and text strings, integers; definite lengths only -----------
export function cborDecode(buf) {
  if (!Buffer.isBuffer(buf)) throw new Error('CBOR: not a buffer');
  const [v, end] = cborItem(buf, 0, 0);
  if (end !== buf.length) throw new Error('CBOR: trailing bytes');
  return v;
}
function cborItem(buf, p, depth) {
  if (depth > 16) throw new Error('CBOR: too deep');
  if (p >= buf.length) throw new Error('CBOR: truncated');
  const ib = buf[p++], major = ib >> 5, ai = ib & 0x1f;
  let n;
  const need = k => { if (p + k > buf.length) throw new Error('CBOR: truncated'); };
  if (ai < 24) n = ai;
  else if (ai === 24) { need(1); n = buf[p]; p += 1; }
  else if (ai === 25) { need(2); n = buf.readUInt16BE(p); p += 2; }
  else if (ai === 26) { need(4); n = buf.readUInt32BE(p); p += 4; }
  else if (ai === 27) { need(8); n = Number(buf.readBigUInt64BE(p)); p += 8; if (!Number.isSafeInteger(n)) throw new Error('CBOR: too large'); }
  else throw new Error('CBOR: indefinite or reserved');
  switch (major) {
    case 0: return [n, p];
    case 1: return [-1 - n, p];
    case 2: need(n); return [Buffer.from(buf.subarray(p, p + n)), p + n];
    case 3: need(n); return [buf.subarray(p, p + n).toString('utf8'), p + n];
    case 4: { const out = []; for (let i = 0; i < n; i++) { const [v, q] = cborItem(buf, p, depth + 1); out.push(v); p = q; } return [out, p]; }
    case 5: {
      const out = {};
      for (let i = 0; i < n; i++) { const [k, q] = cborItem(buf, p, depth + 1); if (typeof k !== 'string') throw new Error('CBOR: a map key that is not text'); const [v, r] = cborItem(buf, q, depth + 1); out[k] = v; p = r; }
      return [out, p];
    }
    default: throw new Error(`CBOR: major type ${major} not taken`);
  }
}
/** The encoder, for a client or a test building such an object; the same subset. */
export function cborEncode(v) {
  const head = (major, n) => {
    if (n < 24) return Buffer.from([(major << 5) | n]);
    if (n < 0x100) return Buffer.from([(major << 5) | 24, n]);
    if (n < 0x10000) { const b = Buffer.alloc(3); b[0] = (major << 5) | 25; b.writeUInt16BE(n, 1); return b; }
    const b = Buffer.alloc(5); b[0] = (major << 5) | 26; b.writeUInt32BE(n, 1); return b;
  };
  if (Number.isSafeInteger(v)) return v >= 0 ? head(0, v) : head(1, -1 - v);
  if (Buffer.isBuffer(v)) return Buffer.concat([head(2, v.length), v]);
  if (typeof v === 'string') { const b = Buffer.from(v, 'utf8'); return Buffer.concat([head(3, b.length), b]); }
  if (Array.isArray(v)) return Buffer.concat([head(4, v.length), ...v.map(cborEncode)]);
  if (isObj(v)) { const keys = Object.keys(v); return Buffer.concat([head(5, keys.length), ...keys.flatMap(k => [cborEncode(k), cborEncode(v[k])])]); }
  throw new Error('CBOR: a value it does not encode');
}

// ---- roots and chains ---------------------------------------------------------------------------------------------------------------------------
/** The roots his hand placed: <dir>/roots/apple-*.pem and android-*.pem (a file may bundle several certificates). Missing: empty lists. */
export function rootsFromDir(dir) {
  const out = {apple: [], android: []};
  for (const kind of Object.keys(out)) {
    let names = [];
    try { names = fs.readdirSync(join(dir, 'roots')).filter(n => n.startsWith(`${kind}-`) && n.endsWith('.pem')).sort(); } catch { continue; }
    for (const n of names) {
      const text = fs.readFileSync(join(dir, 'roots', n), 'utf8');
      for (const pem of text.match(/-----BEGIN CERTIFICATE-----[\s\S]*?-----END CERTIFICATE-----/g) || []) out[kind].push(new X509Certificate(pem));
    }
  }
  return out;
}
const bytesOf = (s, what) => {
  if (typeof s !== 'string' || !s.length || s.length > MAX_FIELD_BYTES || !B64.test(s)) refuse(`${what} is not a base64 word within the bound`);
  return Buffer.from(s, 'base64');
};
const toCert = der => { try { return new X509Certificate(der); } catch { return refuse('a certificate of the chain does not parse'); } };
const validAt = (c, now) => { const from = c.validFromDate ?? new Date(c.validFrom), to = c.validToDate ?? new Date(c.validTo); return from.getTime() <= now && now <= to.getTime(); };
const issued = (c, by) => { try { return c.checkIssued(by) && c.verify(by.publicKey); } catch { return false; } };
const sameKey = (a, b) => { try { return a.publicKey.export({type: 'spki', format: 'der'}).equals(b.publicKey.export({type: 'spki', format: 'der'})); } catch { return false; } };
/** The chain, leaf first: each signed by the next, the last under one of the roots (or a root itself), every one valid at `now`.
 *  THE DOOR ANCHORS ON THE ROOT (Nov 1 2026): a chain that ends in its own certificate of a placed root (the very certificate, or a self-signed one with the
 *  root's name and key: an older certificate of the same root, as a phone made in 2019 carries the 2016 certificate of a root certified again in 2022) is
 *  anchored on the placed root and judged by the placed root's dates, never by the copy's; every other certificate keeps its own. The trust is the root's key,
 *  which signs for no one else. Read live: mi's proof, refused for its root's ended 2016 certificate while saga's chain ends in the same key's of 2022. */
export function verifyChain(certs, roots, now, kind) {
  if (!Array.isArray(roots) || !roots.length) return {ok: false, why: `no root certificate for ${kind} under the wire's state (roots/${kind}-*.pem)`};
  if (!Array.isArray(certs) || certs.length < 1 || certs.length > MAX_CHAIN) return {ok: false, why: `the chain is 1 to ${MAX_CHAIN} certificates`};
  for (let i = 0; i + 1 < certs.length; i++) if (!issued(certs[i], certs[i + 1])) return {ok: false, why: 'a certificate of the chain is not signed by the next'};
  const last = certs[certs.length - 1], own = issued(last, last);
  const copies = roots.filter(r => r.raw.equals(last.raw) || (own && last.subject === r.subject && sameKey(last, r)));
  if (copies.length) {
    if (!copies.some(r => validAt(r, now))) return {ok: false, why: 'the trusted root is not valid now'};
    for (const c of certs.slice(0, -1)) if (!validAt(c, now)) return {ok: false, why: 'a certificate of the chain is not valid now'};
    return {ok: true};
  }
  const root = roots.find(r => issued(last, r));
  if (!root) return {ok: false, why: 'the chain does not end under a trusted root'};
  for (const c of [...certs, root]) if (!validAt(c, now)) return {ok: false, why: 'a certificate of the chain is not valid now'};
  return {ok: true};
}
const extensionValue = (cert, id) => { try { return certificateExtensions(cert.raw).find(e => e.oid === id)?.value ?? null; } catch { return null; } };

// ---- Apple App Attest -------------------------------------------------------------------------------------------------------------------------
/** The nonce in the leaf's credCert extension: SEQUENCE { [1] { OCTET STRING } }. */
function appleNonceOf(value) {
  try {
    const [c1] = children(readTLV(value));
    if (!c1 || c1.cls !== CONTEXT || c1.number !== 1 || !c1.constructed) throw 0;
    const [os] = children(c1); return octetsOf(os);
  } catch { return refuse('the nonce extension is not shaped as Apple shapes it'); }
}
/** The first hello of a key: Apple's attestation object, checked step by step as Apple documents it. */
function appleAttestation({att, clientDataHash, trusted, roots, now, keyId}) {
  let obj; try { obj = cborDecode(att); } catch (e) { refuse(`the attestation is not CBOR it reads (${e.message})`); }
  if (!isObj(obj) || obj.fmt !== 'apple-appattest') refuse('the attestation is not of the apple-appattest format');
  const x5c = obj.attStmt?.x5c, authData = obj.authData;
  if (!Array.isArray(x5c) || !x5c.length || x5c.length > MAX_CHAIN || !x5c.every(Buffer.isBuffer) || !Buffer.isBuffer(authData)) refuse('the attestation lacks its certificates or its authenticator data');
  const certs = x5c.map(toCert);
  const chain = verifyChain(certs, roots.apple, now, 'apple'); if (!chain.ok) refuse(chain.why);
  const leaf = certs[0];
  const ext = extensionValue(leaf, APPLE_NONCE_OID); if (!ext) refuse('the leaf certificate carries no App Attest nonce');
  if (!appleNonceOf(ext).equals(sha256(authData, clientDataHash))) refuse('the nonce in the leaf certificate is not the hash of this authenticator data and this challenge');
  if (authData.length < 55) refuse('the authenticator data is too short');
  const rpIdHash = authData.subarray(0, 32), counter = authData.readUInt32BE(33), aaguid = authData.subarray(37, 53), credLen = authData.readUInt16BE(53), credId = authData.subarray(55, 55 + credLen);
  if (credLen !== 32 || credId.length !== 32) refuse('the credential id is not 32 bytes');
  const app = (trusted.apple || []).find(a => typeof a?.appId === 'string' && sha256(Buffer.from(a.appId)).equals(rpIdHash));
  if (!app) refuse('the attestation is for an app this house does not trust');
  const env = aaguid.equals(AAGUID.development) ? 'development' : aaguid.equals(AAGUID.production) ? 'production' : null;
  if (!env) refuse('the aaguid is neither appattest nor appattestdevelop');
  const want = app.environment || 'production';
  if (env !== want) refuse(`the attestation is from the ${env} environment and the app is trusted in ${want}`);
  if (counter !== 0) refuse('a fresh attestation has a counter other than zero');
  const pub = leaf.publicKey;
  if (pub.asymmetricKeyType !== 'ec' || pub.asymmetricKeyDetails?.namedCurve !== 'prime256v1') refuse('the attested key is not P-256');
  const spki = pub.export({type: 'spki', format: 'der'}), point = spki.subarray(spki.length - 65);
  if (point[0] !== 4 || !sha256(point).equals(credId)) refuse("the credential id is not the hash of the leaf's key");
  if (!credId.equals(keyId)) refuse('the key id named is not the attested key');
  return {kind: 'apple-appattest', keyId: keyId.toString('base64url'), pub: pub.export({type: 'spki', format: 'pem'}), app: app.appId, environment: env, counter: 0};
}
/** Every later hello: the assertion, signed by the key attested before, its counter past the last one seen. */
function appleAssertion({asr, clientDataHash, known}) {
  let obj; try { obj = cborDecode(asr); } catch (e) { refuse(`the assertion is not CBOR it reads (${e.message})`); }
  if (!isObj(obj) || !Buffer.isBuffer(obj.signature) || !Buffer.isBuffer(obj.authenticatorData)) refuse('the assertion lacks its signature or its authenticator data');
  const ad = obj.authenticatorData;
  if (ad.length < 37) refuse("the assertion's authenticator data is too short");
  if (!ad.subarray(0, 32).equals(sha256(Buffer.from(known.app)))) refuse('the assertion is for another app');
  let good = false; try { good = verify('sha256', sha256(ad, clientDataHash), {key: known.pub, dsaEncoding: 'der'}, obj.signature); } catch { good = false; }
  if (!good) refuse('the assertion is not signed by the attested key');
  const counter = ad.readUInt32BE(33);
  if (!(counter > known.counter)) refuse("the assertion's counter did not advance (a replay)");
  return {...known, counter};
}

// ---- Android hardware key attestation ----------------------------------------------------------------------------------------------------------
/** The leaf's KeyDescription: its security level, its challenge, and of each AuthorizationList the root of trust [704] and the application id [709]. */
function keyDescriptionOf(value) {
  try {
    const c = children(readTLV(value));
    if (c.length < 8) throw 0;
    const list = tlv => {
      const out = {};
      for (const f of children(tlv)) {
        if (f.cls !== CONTEXT || !f.constructed) continue;
        if (f.number === 704) { const rc = children(children(f)[0]); out.rootOfTrust = {locked: booleanOf(rc[1]), state: enumeratedOf(rc[2])}; }
        if (f.number === 709) {
          const [pk, dg] = children(readTLV(octetsOf(children(f)[0])));
          out.applicationId = {packages: children(pk).map(p => { const [n, v] = children(p); return {name: octetsOf(n).toString('utf8'), version: Number(integerOf(v))}; }), digests: children(dg).map(d => octetsOf(d).toString('hex'))};
        }
      }
      return out;
    };
    return {securityLevel: enumeratedOf(c[1]), challenge: octetsOf(c[4]), software: list(c[6]), tee: list(c[7])};
  } catch { return refuse('the key description is not shaped as Android shapes it'); }
}
function androidKey({attest, challenge, trusted, roots, now}) {
  if (!Array.isArray(attest.chain) || !attest.chain.length || attest.chain.length > MAX_CHAIN) refuse(`the chain is 1 to ${MAX_CHAIN} certificates`);
  const certs = attest.chain.map((c, i) => toCert(bytesOf(c, `certificate ${i} of the chain`)));
  const apps = (trusted.android || []).filter(a => isObj(a) && typeof a.package === 'string');
  const revoked = new Set(apps.flatMap(a => a.revokedSerials || []).map(s => String(s).toLowerCase()));
  if (certs.some(c => revoked.has(String(c.serialNumber).toLowerCase()))) refuse('a certificate of the chain is revoked');
  const chain = verifyChain(certs, roots.android, now, 'android'); if (!chain.ok) refuse(chain.why);
  const leaf = certs[0];
  const ext = extensionValue(leaf, ANDROID_KEY_DESCRIPTION_OID); if (!ext) refuse('the leaf certificate carries no key description');
  const kd = keyDescriptionOf(ext);
  if (!kd.challenge.equals(challenge)) refuse("the key description's challenge is not this hello's");
  let good = false; try { good = verify('sha256', challenge, {key: leaf.publicKey, dsaEncoding: 'der'}, bytesOf(attest.sig, 'the signature')); } catch { good = false; }
  if (!good) refuse('the challenge is not signed by the attested key');
  // the application id sits in softwareEnforced on Android (the framework, not the TEE, writes it): taken from the TEE's list first, else there
  const appId = kd.tee.applicationId || kd.software.applicationId; if (!appId) refuse('the key description names no application');
  const packages = appId.packages.map(p => p.name);
  const named = apps.filter(a => packages.includes(a.package)); if (!named.length) refuse("the client's app is not a trusted package");
  const app = named.find(a => (a.signers || []).some(s => appId.digests.includes(String(s).toLowerCase()))); if (!app) refuse("the client's app is not signed by a trusted signer");
  const min = app.minSecurityLevel === 'strongbox' ? 2 : 1;
  if (kd.securityLevel < min) refuse(kd.securityLevel === 0 ? 'the key is only software-attested' : 'the key is not in a StrongBox');
  const rot = kd.tee.rootOfTrust; if (!rot) refuse('no hardware root of trust in the key description');
  const boot = BOOT[rot.state] || 'unknown';
  if (app.requireLockedVerifiedBoot !== false) { if (!rot.locked) refuse('the bootloader is unlocked'); if (rot.state !== 0) refuse(`the boot is ${boot}, not verified`); }
  return {kind: 'android-key', keyId: sha256(leaf.publicKey.export({type: 'spki', format: 'der'})).toString('hex'), pub: leaf.publicKey.export({type: 'spki', format: 'pem'}), app: app.package, securityLevel: kd.securityLevel === 2 ? 'strongbox' : 'tee', boot, counter: 0};
}

/**
 * A client's proof at the door. attest: {kind: 'apple-appattest', window, keyId, attestation?, assertion?} or {kind: 'android-key', window, chain, sig};
 * node: the dialer's node id the wire proved; grantId: the grant's id; trusted: {apple: [{appId, environment?}], android: [{package, signers, minSecurityLevel?,
 * requireLockedVerifiedBoot?, revokedSerials?}]}; roots: rootsFromDir(...); known: the devices attested before, by device.keyId (Apple's assertions need
 * theirs). Returns {ok: true, device, window} or {ok: false, why}; never throws.
 */
export function verifyClient({attest, node, grantId, now = Date.now(), trusted = {}, roots = {apple: [], android: []}, known = {}} = {}) {
  try {
    if (!isObj(attest)) refuse('no client proof');
    if (!KINDS.includes(attest.kind)) refuse('unknown client proof');
    if (!Number.isSafeInteger(attest.window) || !windowsAt(now).includes(attest.window)) refuse("the client's proof is from another ten-minute window (stale, or a clock ahead)");
    const challenge = challengeFor({node, grantId, window: attest.window});
    if (attest.kind === 'android-key') return {ok: true, device: androidKey({attest, challenge, trusted: isObj(trusted) ? trusted : {}, roots, now}), window: attest.window};
    const keyId = bytesOf(attest.keyId, 'the key id'); if (keyId.length !== 32) refuse('an App Attest key id is 32 bytes');
    const clientDataHash = sha256(challenge), id = keyId.toString('base64url');
    let device = null;
    if (attest.attestation !== undefined) device = appleAttestation({att: bytesOf(attest.attestation, 'the attestation'), clientDataHash, trusted: isObj(trusted) ? trusted : {}, roots, now, keyId});
    if (attest.assertion !== undefined) {
      const was = device || (isObj(known) ? known[id] : null);
      if (!isObj(was) || typeof was.pub !== 'string' || typeof was.app !== 'string' || !Number.isSafeInteger(was.counter)) refuse('no attestation is known for this key: the first hello of a key brings its attestation');
      device = appleAssertion({asr: bytesOf(attest.assertion, 'the assertion'), clientDataHash, known: {kind: 'apple-appattest', keyId: id, ...was}});
    }
    if (!device) refuse('an Apple client brings an attestation (the first hello of its key) or an assertion');
    return {ok: true, device, window: attest.window};
  } catch (e) {
    return {ok: false, why: e instanceof Refusal ? e.message : `unreadable client proof (${e?.message || e})`};
  }
}
/** One printable line for a receipt: the kind, the app, the key's first twelve characters, and what else the device said. Never a key. */
export function describeDevice(d) {
  if (!isObj(d)) return 'no device';
  return [d.kind, d.app, `key ${String(d.keyId || '').slice(0, 12)}`, d.environment, d.securityLevel, d.boot ? `boot ${d.boot}` : null].filter(Boolean).join(' ');
}

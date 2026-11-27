// worker/android-attest.mjs · ANDROID PROVES ITSELF AT THE WISH DOOR (Nov 1 2026, lane/one-phone-one-birth; his Nov 1 06:03 UTC "please do what is still open",
// over "Android has no app that proves itself yet"). The Android half of app-attest.mjs: DysonLight on Android makes its key in the phone's own keystore (the TEE
// or StrongBox) with the door's challenge, and the keystore vouches for it by Android key attestation: a certificate chain to one of Google's roots whose leaf
// carries the key's description (KeyDescription, OID 1.3.6.1.4.1.11129.2.1.17): the challenge, where the key lives, the app that made it (its package and the
// digest of its signing certificate) and the phone's boot (locked, verified). Checked here as Google's guide says, in WebCrypto on the same little DER reader;
// held to Google's own sample chains (android-attest.test.mjs: a real phone's TEE chain verifies under Google's RSA root, its StrongBox one under a root that
// is not Google's is refused). Google's roots are not written in code: his hand puts them in SPACE_ROUTER_WISH_ROOT beside Apple's (the two of
// https://android.googleapis.com/attestation/root: the RSA one and Key Attestation CA1, P-384, used by phones provisioned since Feb 2026), and names the app in
// SPACE_ROUTER_WISH_APPS as "android:<package>:<sha256 of the signing certificate, hex>[@development]". A key from a leaked keybox looks like any other, so the
// chain is read against Google's revocation list (statusOf, read by the door at most once an hour; 1,769 entries on Nov 1 2026, 1,743 of them KEY_COMPROMISE).
// A development name lets a phone with an unlocked bootloader wish (the house's own phones); a production one asks for a locked, verified boot.
// Every later word: the key's ECDSA signature over its counter (4 bytes, big-endian) and the word's hash; the counter only goes up, as Apple's does.
// COST: an attestation, once an install: four certificates read, four verifies (one RSA 4096 or a P-384), one walk of the key description, the list looked up.
// A wish: one ECDSA verify. Nothing is kept here.
import { MAX_FIELD_BYTES, certOf, bytesOf, b64, b64url, same, sha256, read, kids, val, is, signedBy, verifiesWith, Refusal, refuse } from './app-attest.mjs';
export const KEY_DESCRIPTION = '1.3.6.1.4.1.11129.2.1.17', MAX_ANDROID_CHAIN = 6;
export const STATUS_URL = 'https://android.googleapis.com/attestation/status';
const PACKAGE = /^[A-Za-z][A-Za-z0-9_]*(\.[A-Za-z][A-Za-z0-9_]*)+$/;

/** androidAppsOf(text): the Android words of SPACE_ROUTER_WISH_APPS, "android:<package>:<sha256 hex>[@development]" -> [{appId: 'android:<package>', package,
 *  digest (hex), environment}]; any other word is left out (Apple's are appsOf's) */
export function androidAppsOf(text) {
  return String(text ?? '').split(/[\s,]+/).filter((w) => w.startsWith('android:')).map((w) => {
    const [name, env = 'production'] = w.split('@'), [, pkg, digest] = name.split(':');
    return { appId: `android:${pkg}`, package: pkg, digest: String(digest ?? '').toLowerCase(), environment: env };
  }).filter((a) => PACKAGE.test(a.package) && /^[0-9a-f]{64}$/.test(a.digest) && (a.environment === 'production' || a.environment === 'development'));
}
/** statusOf(json): Google's revocation list as the door read it -> the Set of revoked serials (lowercase hex, no leading zeros), or null when it does not read */
export function statusOf(json) {
  const e = json?.entries; if (!e || typeof e !== 'object') return null;
  return new Set(Object.keys(e).filter((k) => e[k]?.status === 'REVOKED' || e[k]?.status === 'SUSPENDED').map((k) => k.toLowerCase().replace(/^0+/, '')));
}

const hex = (u8) => [...u8].map((x) => x.toString(16).padStart(2, '0')).join('');
const intOf = (t) => { let n = 0; for (const x of val(t)) n = n * 256 + x; return n; };
/** keyDescriptionOf(der): what the door reads of the leaf's key description */
export function keyDescriptionOf(value) {
  const f = kids(read(value)); if (f.length < 8 || !is(f[0], 2) || !is(f[1], 10) || !is(f[4], 4) || !is(f[6], 16) || !is(f[7], 16)) refuse('the key description is not shaped as Android shapes it');
  const tagged = (list, n) => kids(list).find((t) => t.cls === 2 && t.n === n) || null;
  const out = { version: intOf(f[0]), security: intOf(f[1]), challenge: val(f[4]), packages: [], digests: [], locked: false, verified: false };
  const appT = tagged(f[6], 709) || tagged(f[7], 709);
  if (appT) {
    const [os] = kids(appT); if (!is(os, 4)) refuse('the application id is not an octet string');
    const [infos, digests] = kids(read(val(os)));
    for (const p of is(infos, 17) ? kids(infos) : []) { const [name] = kids(p); if (is(name, 4)) out.packages.push(new TextDecoder().decode(val(name))); }
    for (const d of is(digests, 17) ? kids(digests) : []) if (is(d, 4)) out.digests.push(hex(val(d)));
  }
  const rootT = tagged(f[7], 704);
  if (rootT) {
    const [seq] = kids(rootT), [, locked, state] = is(seq, 16) ? kids(seq) : [];
    out.locked = is(locked, 1) && val(locked)[0] !== 0; out.verified = is(state, 10) && intOf(state) === 0;
  }
  return out;
}

/** androidAttestationOf({chain, clientDataHash, key, apps, roots, revoked, now}): a key's first word on Android: its certificate chain (base64 DER, leaf first, the
 *  certificates joined by '.'), checked as Google's guide says. -> {ok: true, device: {key, app, environment, pub, counter: 0}} or {ok: false, why}; never throws */
export async function androidAttestationOf({ chain, clientDataHash, key, apps = [], roots = [], revoked = null, now = Date.now() } = {}) {
  try {
    const keyId = bytesOf(key); if (!keyId || keyId.length !== 32 || b64url(keyId) !== key) refuse('the key is not named as the door names keys (base64url of 32 bytes)');
    if (typeof chain !== 'string' || chain.length > MAX_FIELD_BYTES * 2) refuse('the attestation is not a chain within the bound');
    const ders = chain.split('.').map(bytesOf); if (ders.length < 2 || ders.length > MAX_ANDROID_CHAIN || ders.some((d) => !d)) refuse('the attestation is not a chain of certificates');
    let certs; try { certs = ders.map(certOf); } catch { refuse('a certificate of the chain does not read'); }
    if (!roots.length) refuse("no root of Google's is on the Worker (SPACE_ROUTER_WISH_ROOT)");
    if (!(revoked instanceof Set)) refuse("Google's revocation list could not be read");
    for (let i = 0; i + 1 < certs.length; i++) if (!(await signedBy(certs[i], certs[i + 1]))) refuse('a certificate of the chain is not signed by the next');
    const top = certs[certs.length - 1];
    let root = roots.find((r) => same(r.spki, top.spki)) || null;   // the top is a root itself: Google re-issues its root with the same key, so the key is the anchor
    const below = root ? certs.slice(0, -1) : certs;
    if (!root) for (const r of roots) if (await signedBy(top, r)) { root = r; break; }
    if (!root) refuse('the chain does not end under a root of Google');
    for (const c of [...below.slice(1), root]) if (!(c.notBefore <= now && now <= c.notAfter)) refuse('a certificate of the chain is not valid now');
    if (!(certs[0].notAfter >= now)) refuse('the leaf certificate has expired');
    for (const c of certs) if (revoked.has(c.serial)) refuse('a certificate of the chain is revoked by Google');
    const leaf = certs[0], ext = leaf.ext.find((e) => e.oid === KEY_DESCRIPTION); if (!ext) refuse('the leaf certificate carries no key description');
    const d = keyDescriptionOf(ext.value);
    if (d.security !== 1 && d.security !== 2) refuse('the key is not kept in the trusted environment or StrongBox');
    if (!same(d.challenge, clientDataHash)) refuse('the challenge in the key description is not this word');
    const app = apps.find((a) => d.packages.includes(a.package) && d.digests.includes(a.digest)); if (!app) refuse('the attestation is for an app the door does not name');
    if (app.environment === 'production' && !(d.locked && d.verified)) refuse("the phone's boot is not locked and verified");
    if (leaf.curve !== 'P-256' || leaf.point.length !== 65 || leaf.point[0] !== 4) refuse('the attested key is not P-256');
    if (!same(await sha256(leaf.point), keyId)) refuse('the key named is not the attested key');
    return { ok: true, device: { key, app: app.appId, environment: app.environment, pub: b64(leaf.spki), counter: 0 } };
  } catch (e) { return { ok: false, why: e instanceof Refusal ? e.message : `an unreadable proof (${e?.message || e})` }; }
}
/** androidAssertionOf({assertion, clientDataHash, known: {pub, counter}}): every later word of an Android key: base64 of its counter (4 bytes, big-endian) and
 *  its DER ECDSA signature over that counter and the word's hash; the counter past the last the door saw. -> {ok: true, counter} or {ok: false, why}; never throws */
export async function androidAssertionOf({ assertion, clientDataHash, known } = {}) {
  try {
    if (!known || typeof known.pub !== 'string' || !Number.isSafeInteger(known.counter)) refuse('no attestation is known for this key');
    const a = bytesOf(assertion); if (!a || a.length < 12) refuse('the assertion is not a base64 word within the bound');
    const counter = ((a[0] * 256 + a[1]) * 256 + a[2]) * 256 + a[3], pub = bytesOf(known.pub); if (!pub) refuse('the key kept for it does not read');
    const signed = new Uint8Array(4 + clientDataHash.length); signed.set(a.subarray(0, 4)); signed.set(clientDataHash, 4);
    if (!(await verifiesWith(pub, 'P-256', 'SHA-256', a.subarray(4), signed))) refuse('the assertion is not signed by the attested key');
    if (!(counter > known.counter)) refuse("the assertion's counter did not advance (a replay)");
    return { ok: true, counter };
  } catch (e) { return { ok: false, why: e instanceof Refusal ? e.message : `an unreadable proof (${e?.message || e})` }; }
}

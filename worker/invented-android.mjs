// worker/invented-android.mjs · AN INVENTED GOOGLE, for the tests and the proof alone (the Worker never imports it): a root and an intermediate grown here, and
// Android phones whose keystore keys attest as Android key attestation does (a leaf carrying the key description: the challenge, the TEE, the app's package and
// signing digest, the phone's boot) and assert as DysonLight on Android does (worker/android-attest.mjs: the counter and an ECDSA signature over it and the word's
// hash), over the words the wish law names. As the invented Apple's phone: forget() a reinstall (a new key, the mark kept), wipe() a phone erased whole.
// Every package, digest, key and moment is invented; no real vendor material is read (Google's own sample chains are android-attest.test.mjs's, read off the network).
import { createHash, generateKeyPairSync, sign } from 'node:crypto';
import { certificate, caConstraint, extension, seq, set, ctx, octet, int, enumerated, bool, nul } from '../vendor/tools/canvas-wire/der.mjs';
import { bornData } from '../app/dl-her-wishes.mjs';
import { markOf } from './invented-apple.mjs';

export const PACKAGE = 'fit.example.dysonlight', DIGEST = 'ab'.repeat(32);   // an invented package and signing digest
const KEY_DESCRIPTION = '1.3.6.1.4.1.11129.2.1.17', DAY = 86_400_000;
const sha = (...p) => createHash('sha256').update(Buffer.concat(p.map((x) => Buffer.from(x)))).digest();
const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32BE(n); return b; };
const ec = () => generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
let serial = 9000;

/** keyDescription({challenge, security, pkg, digest, locked, verified}): the leaf's extension as a KeyMint 3 phone writes it (the fields the door reads) */
export function keyDescription({ challenge, security = 1, pkg = PACKAGE, digest = DIGEST, locked = true, verified = true }) {
  const appId = seq(set(seq(octet(Buffer.from(pkg)), int(88))), set(octet(Buffer.from(digest, 'hex'))));
  const software = seq(ctx(701, int(Date.UTC(2026, 10, 1))), ctx(709, octet(appId)));
  const hardware = seq(ctx(1, set(int(2))), ctx(2, int(3)), ctx(3, int(256)), ctx(10, int(1)), ctx(503, nul()), ctx(702, int(0)),
    ctx(704, seq(octet(Buffer.alloc(32, 7)), bool(locked), enumerated(verified ? 0 : 2), octet(Buffer.alloc(32, 9)))), ctx(706, int(202610)));
  return seq(int(300), enumerated(security), int(300), enumerated(security), octet(challenge), octet(Buffer.alloc(0)), software, hardware);
}

/** inventedGoogle({now, pkg, digest}) -> {pem, app(environment), phone({environment, locked, ...})} */
export function inventedGoogle({ now = Date.now(), pkg = PACKAGE, digest = DIGEST } = {}) {
  const grow = ({ issuer = null, cn, ca = false, extensions = [], key = ec(), notBefore = now - DAY }) => {
    const der = certificate({ serial: ++serial, issuer: issuer ? issuer.cn : cn, subject: cn, notBefore, notAfter: now + 365 * DAY, publicKey: key.publicKey,
      extensions: [...(ca ? [caConstraint()] : []), ...extensions], signer: issuer ? issuer.privateKey : key.privateKey });
    return { cn, der, privateKey: key.privateKey, serial };
  };
  const root = grow({ cn: 'an invented key attestation root', ca: true }), int1 = grow({ issuer: root, cn: 'an invented TEE', ca: true });
  const pem = `-----BEGIN CERTIFICATE-----\n${root.der.toString('base64').match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----\n`;
  const app = (environment = 'production') => `android:${pkg}:${digest}${environment === 'development' ? '@development' : ''}`;
  /** a phone with DysonLight on it: prove(data) -> {key, attestation, phone, platform} at its key's first word, {key, assertion} after */
  function phone({ locked = true, verified = true, security = 1, ofPkg = pkg, ofDigest = digest } = {}) {
    let key, keyId, counter, attested, mark = markOf();
    const fresh = () => { key = ec(); const spki = key.publicKey.export({ type: 'spki', format: 'der' }); keyId = sha(spki.subarray(spki.length - 65)); counter = 0; attested = false; };
    fresh();
    const attest = (data) => {
      const leaf = grow({ issuer: int1, cn: 'Android Keystore Key', key, notBefore: 0,
        extensions: [extension(KEY_DESCRIPTION, keyDescription({ challenge: sha(data), security, pkg: ofPkg, digest: ofDigest, locked, verified }))] });
      return [leaf.der, int1.der, root.der].map((d) => d.toString('base64')).join('.');
    };
    const assert = (data) => { const c = u32(++counter); return Buffer.concat([c, sign('sha256', Buffer.concat([c, sha(data)]), { key: key.privateKey, dsaEncoding: 'der' })]).toString('base64'); };
    return {
      get keyId() { return keyId.toString('base64url'); }, get mark() { return mark; },
      prove(data) {
        if (!attested) { attested = true; return { key: keyId.toString('base64url'), attestation: attest(bornData(data, mark)), phone: mark, platform: 'android' }; }
        return { key: keyId.toString('base64url'), assertion: assert(data) };
      },
      attest, assert, forget: fresh, wipe() { fresh(); mark = markOf(); }, int: int1,
    };
  }
  return { pem, app, phone, int: int1 };
}

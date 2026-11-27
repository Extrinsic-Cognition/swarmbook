// worker/invented-apple.mjs · AN INVENTED APPLE, for the tests and the proof alone (the Worker never imports it): a root and an intermediate grown here, and phones
// whose keys attest and assert as App Attest's do, over the words the wish law names (app/dl-her-wishes.mjs helloData, wishData). A phone proves as DysonLight's
// cover does (harmony-clip Host/WishFront.swift): its key's first word an attestation over the words and the phone's mark (bornData), every later one an assertion
// whose counter goes up; forget() makes a new key (a reinstall: the mark stays, as the keychain keeps it), wipe() a new mark too (a phone erased whole).
// Every team, bundle, key and moment is invented; no real vendor material is read. The chains are grown by the house's own codec (tools/canvas-wire/der.mjs).
import { createHash, generateKeyPairSync, sign } from 'node:crypto';
import { certificate, caConstraint, extension, seq, ctx, octet } from '../vendor/tools/canvas-wire/der.mjs';
import { cborEncode } from '../vendor/tools/canvas-wire/attest.mjs';
import { bornData } from '../app/dl-her-wishes.mjs';

export const APP_ID = 'ABCDE12345.fit.example.dysonlight';   // an invented team and bundle
const NONCE_OID = '1.2.840.113635.100.8.2', DAY = 86_400_000;
const sha = (...p) => createHash('sha256').update(Buffer.concat(p.map((x) => Buffer.from(x)))).digest();
const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32BE(n); return b; };
const ec = () => generateKeyPairSync('ec', { namedCurve: 'prime256v1' });
const AAGUID = { production: Buffer.concat([Buffer.from('appattest'), Buffer.alloc(7)]), development: Buffer.from('appattestdevelop') };
let serial = 7000;
export const markOf = () => generateKeyPairSync('ec', { namedCurve: 'prime256v1' }).publicKey.export({ type: 'spki', format: 'der' }).subarray(-32).toString('base64url');   // a phone's mark: 32 bytes drawn once

/** inventedApple({now, appId}) -> {pem, appId, phone({environment, app})}: Apple's root as his hand would place it, and the phones it vouches for */
export function inventedApple({ now = Date.now(), appId = APP_ID } = {}) {
  const grow = ({ issuer = null, cn, ca = false, extensions = [], key = ec() }) => {
    const der = certificate({ serial: ++serial, issuer: issuer ? issuer.cn : cn, subject: cn, notBefore: now - DAY, notAfter: now + 365 * DAY, publicKey: key.publicKey,
      extensions: [...(ca ? [caConstraint()] : []), ...extensions], signer: issuer ? issuer.privateKey : key.privateKey });
    return { cn, der, privateKey: key.privateKey };
  };
  const root = grow({ cn: 'an invented App Attestation root', ca: true }), int = grow({ issuer: root, cn: 'an invented App Attestation CA', ca: true });
  const pem = `-----BEGIN CERTIFICATE-----\n${root.der.toString('base64').match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----\n`;
  /** a phone with DysonLight on it: prove(data) -> {key, attestation} at its key's first word, {key, assertion} after; forget() makes a new key */
  function phone({ environment = 'production', app = appId } = {}) {
    let key, keyId, counter, attested, mark = markOf();
    const fresh = () => { key = ec(); const spki = key.publicKey.export({ type: 'spki', format: 'der' }); keyId = sha(spki.subarray(spki.length - 65)); counter = 0; attested = false; };
    fresh();
    const attest = (data) => {
      const authData = Buffer.concat([sha(app), Buffer.from([0x40]), u32(0), AAGUID[environment], Buffer.from([0, 32]), keyId, Buffer.from('an invented cose key')]);
      const leaf = grow({ issuer: int, cn: 'an invented attested key', key, extensions: [extension(NONCE_OID, seq(ctx(1, octet(sha(authData, sha(data))))))] });
      return cborEncode({ fmt: 'apple-appattest', attStmt: { x5c: [leaf.der, int.der], receipt: Buffer.from('an invented receipt') }, authData }).toString('base64');
    };
    const assert = (data) => {
      const ad = Buffer.concat([sha(app), Buffer.from([0]), u32(++counter)]);
      return cborEncode({ signature: sign('sha256', sha(ad, sha(data)), { key: key.privateKey, dsaEncoding: 'der' }), authenticatorData: ad }).toString('base64');
    };
    return {
      get keyId() { return keyId.toString('base64'); },   // as DCAppAttestService names it
      get mark() { return mark; },
      prove(data) { if (!attested) { attested = true; return { key: keyId.toString('base64'), attestation: attest(bornData(data, mark)), phone: mark }; } return { key: keyId.toString('base64'), assertion: assert(data) }; },
      attest, assert, forget: fresh, wipe() { fresh(); mark = markOf(); },
    };
  }
  return { pem, appId, phone };
}

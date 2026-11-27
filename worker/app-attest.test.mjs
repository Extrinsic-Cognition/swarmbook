// app-attest.test.mjs · THE APP'S PROOF AT THE WISH DOOR, off every network: chains grown here from invented roots (P-256 as the house's door test grows them,
// and Apple's own mix: P-384 root and intermediate signing with SHA-384, the attested P-256 key under them), Apple-shaped attestations and assertions; every
// team, bundle and moment invented. The Worker's WebCrypto checks (app-attest.mjs) are held to the house's own door (tools/canvas-wire/attest.mjs) on the same
// bytes: one verdict, case by case.
//   node --test worker/app-attest.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createHash, generateKeyPairSync, sign, X509Certificate } from 'node:crypto';
import { certificate, caConstraint, extension, seq, ctx, octet, int, oid, name, time, bitString } from '../vendor/tools/canvas-wire/der.mjs';
import { verifyClient, challengeFor, windowOf, cborEncode } from '../vendor/tools/canvas-wire/attest.mjs';
import { attestationOf, assertionOf, appsOf, rootsOf, certOf, cborDecode, bytesOf, b64url, NONCE_OID } from './app-attest.mjs';

const sha = (...p) => createHash('sha256').update(Buffer.concat(p.map((x) => Buffer.from(x)))).digest();
const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32BE(n); return b; };
const NOW = 1_793_000_000_000, DAY = 86_400_000;   // an invented moment
const APP = 'ABCDE12345.fit.example.wish', OTHER = 'ZZZZZ99999.fit.example.other';
const APPS = [{ appId: APP, environment: 'production' }];
const NODE = '7a'.repeat(32), GRANT = '0123456789ab';   // the house's door binds its challenge to these; the wish door to its own words (dl-her-wishes.mjs)
const ec = (curve = 'prime256v1') => generateKeyPairSync('ec', { namedCurve: curve });
let serial = 5000;
/** a P-256 certificate, grown as the house's door test grows them */
function grow({ issuer = null, cn, ca = false, extensions = [], notBefore = NOW - DAY, notAfter = NOW + 365 * DAY, key = ec() } = {}) {
  const der = certificate({ serial: ++serial, issuer: issuer ? issuer.cn : cn, subject: cn, notBefore, notAfter, publicKey: key.publicKey, extensions: [...(ca ? [caConstraint()] : []), ...extensions], signer: issuer ? issuer.privateKey : key.privateKey });
  return { cn, der, privateKey: key.privateKey, publicKey: key.publicKey, curve: 'P-256' };
}
/** a certificate signed by a P-384 key with SHA-384, as Apple's App Attestation root and intermediate sign */
function grow384({ issuer = null, cn, ca = false, extensions = [], key = ec('secp384r1') } = {}) {
  const alg = seq(oid('1.2.840.10045.4.3.3'));
  const tbs = seq(ctx(0, int(2)), int(++serial), alg, name(issuer ? issuer.cn : cn), seq(time(NOW - DAY), time(NOW + 365 * DAY)), name(cn), key.publicKey.export({ type: 'spki', format: 'der' }),
    ...(ca || extensions.length ? [ctx(3, seq(...(ca ? [caConstraint()] : []), ...extensions))] : []));
  const der = seq(tbs, alg, bitString(sign('sha384', tbs, { key: issuer ? issuer.privateKey : key.privateKey, dsaEncoding: 'der' })));
  return { cn, der, privateKey: key.privateKey, publicKey: key.publicKey, curve: 'P-384' };
}
const pem = (der) => `-----BEGIN CERTIFICATE-----\n${der.toString('base64').match(/.{1,64}/g).join('\n')}\n-----END CERTIFICATE-----\n`;
const ROOT = grow({ cn: 'invented apple root', ca: true }), INT = grow({ issuer: ROOT, cn: 'invented apple intermediate', ca: true });
const ROOT384 = grow384({ cn: 'invented apple root P-384', ca: true }), INT384 = grow384({ issuer: ROOT384, cn: 'invented apple intermediate P-384', ca: true });
const OTHER_ROOT = grow({ cn: 'another invented root', ca: true });
const ROOTS = rootsOf(pem(ROOT.der) + pem(ROOT384.der));
const AAGUID = { production: Buffer.concat([Buffer.from('appattest'), Buffer.alloc(7)]), development: Buffer.from('appattestdevelop') };

/** the leaf, signed by the intermediate with SHA-256 whatever the intermediate's curve (Apple's credential certificate) */
function leafUnder(intermediate, key, extensions, validity = {}) {
  if (intermediate.curve === 'P-256') return grow({ issuer: intermediate, cn: 'invented attested key', key, extensions, ...validity });
  const alg = seq(oid('1.2.840.10045.4.3.2'));
  const tbs = seq(ctx(0, int(2)), int(++serial), alg, name(intermediate.cn), seq(time(validity.notBefore ?? NOW - DAY), time(validity.notAfter ?? NOW + 365 * DAY)), name('invented attested key'),
    key.publicKey.export({ type: 'spki', format: 'der' }), ctx(3, seq(...extensions)));
  return { der: seq(tbs, alg, bitString(sign('sha256', tbs, { key: intermediate.privateKey, dsaEncoding: 'der' }))) };
}
/** an Apple-shaped attestation of a fresh key under the challenge `cdh`, right in every part unless told otherwise */
function apple({ cdh = sha(challengeFor({ node: NODE, grantId: GRANT, window: windowOf(NOW) })), environment = 'production', appId = APP, counter = 0, nonceFlip = false, credIdOf = null,
  fmt = 'apple-appattest', intermediate = INT, leafValidity = {} } = {}) {
  const key = ec(), spki = key.publicKey.export({ type: 'spki', format: 'der' }), point = spki.subarray(spki.length - 65);
  const credId = credIdOf ? credIdOf(point) : sha(point);
  const authData = Buffer.concat([sha(appId), Buffer.from([0x40]), u32(counter), AAGUID[environment], Buffer.from([0, 32]), credId, Buffer.from('an invented cose key')]);
  const nonce = sha(authData, cdh); if (nonceFlip) nonce[0] ^= 1;
  const leaf = leafUnder(intermediate, key, [extension(NONCE_OID, seq(ctx(1, octet(nonce))))], leafValidity);
  const attestation = cborEncode({ fmt, attStmt: { x5c: [leaf.der, intermediate.der], receipt: Buffer.from('an invented receipt') }, authData }).toString('base64');
  return { key, cdh, keyId: credId, attestation };
}
const assertion = ({ key, cdh, counter, appId = APP }) => {
  const ad = Buffer.concat([sha(appId), Buffer.from([0]), u32(counter)]);
  return cborEncode({ signature: sign('sha256', sha(ad, cdh), { key: key.privateKey, dsaEncoding: 'der' }), authenticatorData: ad }).toString('base64');
};
const ours = (c, more = {}) => attestationOf({ attestation: c.attestation, clientDataHash: new Uint8Array(c.cdh), key: b64url(c.keyId), apps: APPS, roots: ROOTS, now: NOW, ...more });
const house = (c, more = {}) => verifyClient({ attest: { kind: 'apple-appattest', window: windowOf(NOW), keyId: c.keyId.toString('base64'), attestation: c.attestation }, node: NODE, grantId: GRANT, now: NOW,
  trusted: { apple: [{ appId: APP, environment: 'production' }] }, roots: { apple: [new X509Certificate(ROOT.der)], android: [] }, ...more });

test('a right attestation is taken by the Worker as by the house: the key, the app, the environment, its public half, counter zero', async () => {
  const c = apple(), r = await ours(c), h = house(c);
  assert.equal(r.ok, true, r.why); assert.equal(h.ok, true, h.why);
  assert.equal(r.device.key, b64url(c.keyId)); assert.equal(r.device.key, h.device.keyId);   // the house names a key by base64url too
  assert.equal(r.device.app, APP); assert.equal(r.device.environment, 'production'); assert.equal(r.device.counter, 0);
  assert.equal(r.device.pub, c.key.publicKey.export({ type: 'spki', format: 'der' }).toString('base64'));   // the attested key's public half, as its SPKI
  assert.equal(cborDecode(bytesOf(c.attestation)).attStmt.x5c.length, 2);
  // Apple's own mix: the P-384 root and intermediate signing with SHA-384, the leaf signed by that intermediate with SHA-256
  const c384 = apple({ intermediate: INT384 }), r384 = await ours(c384);
  assert.equal(r384.ok, true, r384.why);
});

test('its assertions: the counter advances, a replay, another key, another app or no key kept are refused, by the Worker as by the house', async () => {
  const c = apple(), r = await ours(c); assert.equal(r.ok, true, r.why);
  const known = r.device, cdh = new Uint8Array(c.cdh);
  const a1 = await assertionOf({ assertion: assertion({ key: c.key, cdh: c.cdh, counter: 1 }), clientDataHash: cdh, known });
  assert.deepEqual(a1, { ok: true, counter: 1 });
  const h = house(c), hKnown = { [h.device.keyId]: h.device };
  const hA = verifyClient({ attest: { kind: 'apple-appattest', window: windowOf(NOW), keyId: c.keyId.toString('base64'), assertion: assertion({ key: c.key, cdh: c.cdh, counter: 1 }) }, node: NODE, grantId: GRANT, now: NOW, known: hKnown });
  assert.equal(hA.ok, true, hA.why);
  const later = { ...known, counter: 1 };
  const cases = [
    [assertion({ key: c.key, cdh: c.cdh, counter: 1 }), later, /did not advance/],
    [assertion({ key: ec(), cdh: c.cdh, counter: 2 }), later, /not signed by the attested key/],
    [assertion({ key: c.key, cdh: c.cdh, counter: 2, appId: OTHER }), later, /another app/],
    [assertion({ key: c.key, cdh: c.cdh, counter: 2 }), null, /no attestation is known/],
    [assertion({ key: c.key, cdh: sha('another challenge'), counter: 2 }), later, /not signed by the attested key/],
    [cborEncode({ signature: Buffer.from('x') }).toString('base64'), later, /lacks its signature/],
    ['%%%', later, /not a base64 word/],
  ];
  for (const [asr, k, why] of cases) { const x = await assertionOf({ assertion: asr, clientDataHash: cdh, known: k }); assert.equal(x.ok, false, `expected a refusal for ${why}`); assert.match(x.why, why); }
});

test('an attestation wrong in one part is refused for that part, by the Worker as by the house', async () => {
  const wrongs = [
    [{ nonceFlip: true }, /nonce in the leaf certificate/],
    [{ appId: OTHER }, /app the door does not name/],
    [{ environment: 'development' }, /development environment and the app is named in production/],
    [{ counter: 1 }, /counter other than zero/],
    [{ intermediate: grow({ issuer: OTHER_ROOT, cn: 'an intermediate under another root', ca: true }) }, /does not end under the root/],
    [{ leafValidity: { notBefore: NOW - 10 * DAY, notAfter: NOW - DAY } }, /not valid now/],
    [{ credIdOf: () => sha('another key') }, /credential id is not the hash of the leaf's key/],
    [{ fmt: 'packed' }, /not of the apple-appattest format/],
  ];
  for (const [o, why] of wrongs) {
    const c = apple(o), r = await ours(c), h = house(c);
    assert.equal(r.ok, false, `the Worker took what it must refuse: ${why}`); assert.match(r.why, why);
    assert.equal(h.ok, false, `the house took ${why}: the two disagree`);
  }
  const c = apple();
  for (const [more, why] of [[{ key: b64url(Buffer.alloc(32, 7)) }, /key named is not the attested key/], [{ key: b64url(Buffer.alloc(16, 7)) }, /base64url of 32 bytes/],
    [{ key: c.keyId.toString('base64') }, /base64url of 32 bytes/], [{ roots: [] }, /no root of Apple's is on the Worker/], [{ roots: rootsOf(pem(OTHER_ROOT.der)) }, /does not end under the root/],
    [{ apps: [] }, /app the door does not name/], [{ apps: [{ appId: APP, environment: 'development' }] }, /production environment and the app is named in development/],
    [{ attestation: cborEncode({ fmt: 'apple-appattest', attStmt: {}, authData: Buffer.alloc(3) }).toString('base64') }, /lacks its certificates/],
    [{ attestation: Buffer.from([0xa2, 0x61, 0x61]).toString('base64') }, /not CBOR/], [{ attestation: cborEncode('a text').toString('base64') }, /not of the apple-appattest format/]]) {
    const r = await ours(c, more); assert.equal(r.ok, false, `took ${why}`); assert.match(r.why, why);
  }
  // stricter than the house in one place: an intermediate that does not say it is a CA signs nothing here
  const notCa = apple({ intermediate: grow({ issuer: ROOT, cn: 'an intermediate that is no CA' }) });
  assert.match((await ours(notCa)).why, /not signed by the next|does not end under the root/);
});

test("his hand's two words: the apps (team and bundle, @development for a developer's build) and Apple's root as a PEM", () => {
  assert.deepEqual(appsOf(`${APP}, ${OTHER}@development  nonsense  ABCDE12345.x@staging`), [{ appId: APP, environment: 'production' }, { appId: OTHER, environment: 'development' }]);
  assert.deepEqual(appsOf(''), []); assert.deepEqual(appsOf(undefined), []);
  assert.equal(rootsOf(pem(ROOT.der)).length, 1); assert.equal(rootsOf(pem(ROOT.der) + pem(ROOT384.der)).length, 2);
  assert.equal(rootsOf('-----BEGIN CERTIFICATE-----\nAAAA\n-----END CERTIFICATE-----').length, 0); assert.equal(rootsOf('').length, 0);
  const r = certOf(ROOT384.der); assert.equal(r.curve, 'P-384'); assert.equal(r.ca, true); assert.equal(r.sigAlg, '1.2.840.10045.4.3.3');
  assert.deepEqual([...bytesOf('a-_b')], [...bytesOf('a+/b')]); assert.equal(bytesOf(''), null); assert.equal(bytesOf('a b'), null);   // base64url and base64 read alike
  assert.deepEqual([...bytesOf('AQID')], [1, 2, 3]); assert.equal(b64url(new Uint8Array([251, 255])), '-_8');
});

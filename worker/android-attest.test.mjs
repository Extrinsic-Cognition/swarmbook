// android-attest.test.mjs · ANDROID PROVES ITSELF AT THE WISH DOOR, off every network: the Worker's Android check (android-attest.mjs) held to a real phone's
// chain as Google publishes it (fixtures/google-key-attestation: verified under Google's own RSA root, its unlocked boot, its challenge, a revoked serial), and
// to chains grown here (worker/invented-android.mjs) for what Google's sample cannot show: a locked boot, another app, a key in software, the assertions.
//   node --test worker/android-attest.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { androidAttestationOf, androidAssertionOf, androidAppsOf, statusOf, keyDescriptionOf, KEY_DESCRIPTION } from './android-attest.mjs';
import { rootsOf, certOf, b64, b64url, sha256 } from './app-attest.mjs';
import { inventedGoogle, PACKAGE, DIGEST } from './invented-android.mjs';
import { bornData } from '../app/dl-her-wishes.mjs';

const F = (n) => new Uint8Array(readFileSync(new URL(`./fixtures/google-key-attestation/${n}`, import.meta.url)));
const GOOGLE_ROOTS = rootsOf(JSON.parse(new TextDecoder().decode(F('roots.json'))).join('\n'));
const chainOf = (kind) => [0, 1, 2, 3].map((i) => F(`${kind}-cert${i}.der`));
const SAMPLE_APP = 'android:com.android.keychain:301aa3cb081134501c45f1422abc66c24224fd5ded5fdc8f17e697176fd866aa';   // a package and the digest the sample names
const NOV1 = Date.UTC(2026, 10, 1, 16), ABC = new TextEncoder().encode('abc'), NONE = new Set();
const sha = (b) => createHash('sha256').update(b).digest();

test('Google\'s published roots read: the RSA 4096 one and Key Attestation CA1 (P-384)', () => {
  assert.equal(GOOGLE_ROOTS.length, 2);
  assert.deepEqual(GOOGLE_ROOTS.map((r) => [r.rsa, r.curve, r.ca]), [[true, null, true], [false, 'P-384', true]]);
});

test('a real phone\'s TEE chain (Google\'s sample) verifies under Google\'s RSA root; its unlocked boot, another challenge, a revoked serial are refused', async () => {
  const ders = chainOf('tee'), key = b64url(await sha256(certOf(ders[0]).point)), chain = ders.map(b64).join('.');
  const [dev, prod] = [androidAppsOf(`${SAMPLE_APP}@development`), androidAppsOf(SAMPLE_APP)];
  const t0 = performance.now(), ok = await androidAttestationOf({ chain, clientDataHash: ABC, key, apps: dev, roots: GOOGLE_ROOTS, revoked: NONE, now: NOV1 }), ms = performance.now() - t0;
  assert.equal(ok.ok, true, ok.why); assert.deepEqual([ok.device.app, ok.device.environment, ok.device.counter], ['android:com.android.keychain', 'development', 0]);
  assert.ok(ms < 200, `${ms.toFixed(1)} ms`);
  const d = keyDescriptionOf(certOf(ders[0]).ext.find((e) => e.oid === KEY_DESCRIPTION).value);
  assert.deepEqual([d.version, d.security, new TextDecoder().decode(d.challenge), d.locked, d.verified, d.packages.length], [3, 1, 'abc', false, false, 13], 'the sample as Google\'s own test reads it');
  const why = async (o) => (await androidAttestationOf({ chain, clientDataHash: ABC, key, apps: dev, roots: GOOGLE_ROOTS, revoked: NONE, now: NOV1, ...o })).why;
  assert.match(await why({ apps: prod }), /boot is not locked and verified/);
  assert.match(await why({ clientDataHash: new TextEncoder().encode('abd') }), /challenge/);
  assert.match(await why({ revoked: statusOf({ entries: { [certOf(ders[1]).serial]: { status: 'REVOKED', reason: 'KEY_COMPROMISE' } } }) }), /revoked by Google/);
  assert.match(await why({ revoked: null }), /revocation list could not be read/);
  assert.match(await why({ roots: [] }), /no root of Google/);
  assert.match(await why({ roots: rootsOf(inventedGoogle({ now: NOV1 }).pem) }), /does not end under a root of Google/);
  assert.match(await why({ key: b64url(sha(Buffer.from('another key'))) }), /not the attested key/);
  assert.match(await why({ now: Date.UTC(2028, 3, 1) }), /not valid now/, 'its intermediates end in March 2028');
  assert.match(await why({ chain: [ders[0], ders[2], ders[3]].map(b64).join('.') }), /not signed by the next/);
});

test('Google\'s StrongBox sample names a root that is not Google\'s: refused', async () => {
  const ders = chainOf('strongbox'), key = b64url(await sha256(certOf(ders[0]).point));
  const r = await androidAttestationOf({ chain: ders.map(b64).join('.'), clientDataHash: ABC, key, apps: androidAppsOf(`${SAMPLE_APP}@development`), roots: GOOGLE_ROOTS, revoked: NONE, now: NOV1 });
  assert.equal(r.ok, false);
});

test('the words his hand writes: the apps, and Google\'s revocation list as it is written', () => {
  assert.deepEqual(androidAppsOf(`ABCDE12345.fit.example.app android:fit.example.app:${'AB'.repeat(32)} android:fit.example.app:${'ab'.repeat(32)}@development android:bad:xyz android:x:${'ab'.repeat(32)} android:fit.example.app:${'ab'.repeat(32)}@else`),
    [{ appId: 'android:fit.example.app', package: 'fit.example.app', digest: 'ab'.repeat(32), environment: 'production' },
      { appId: 'android:fit.example.app', package: 'fit.example.app', digest: 'ab'.repeat(32), environment: 'development' }]);
  const st = statusOf({ entries: { '00abc': { status: 'REVOKED' }, '6681152659205225093': { status: 'REVOKED', reason: 'KEY_COMPROMISE' }, ff: { status: 'OK' } } });
  assert.deepEqual([...st].sort(), ['6681152659205225093', 'abc']);
  assert.equal(statusOf({}), null); assert.equal(statusOf(null), null);
});

test('an invented phone: a locked boot passes in production; another app, a key in software, the assertions and their counter', async () => {
  const g = inventedGoogle({ now: NOV1 }), roots = rootsOf(g.pem), apps = androidAppsOf(`${g.app('production')}`), data = 'optimism.fit/wish/v1\nhello\n1\n';
  const run = async (phone) => { const p = phone.prove(data); return androidAttestationOf({ chain: p.attestation, clientDataHash: await sha256(bornData(data, p.phone)), key: p.key, apps, roots, revoked: NONE, now: NOV1 }); };
  const phone = g.phone(), ok = await run(phone);
  assert.equal(ok.ok, true, ok.why); assert.equal(ok.device.app, `android:${PACKAGE}`);
  assert.match((await run(g.phone({ ofPkg: 'fit.example.other' }))).why, /app the door does not name/);
  assert.match((await run(g.phone({ ofDigest: 'cd'.repeat(32) }))).why, /app the door does not name/);
  assert.match((await run(g.phone({ security: 0 }))).why, /trusted environment/);
  assert.equal((await run(g.phone({ security: 2 }))).ok, true, 'StrongBox');
  const known = { pub: ok.device.pub, counter: 0 }, cdh = await sha256('a wish');
  const a1 = phone.assert('a wish'), v1 = await androidAssertionOf({ assertion: a1, clientDataHash: cdh, known });
  assert.deepEqual(v1, { ok: true, counter: 1 });
  assert.match((await androidAssertionOf({ assertion: a1, clientDataHash: cdh, known: { ...known, counter: 1 } })).why, /did not advance/);
  assert.match((await androidAssertionOf({ assertion: phone.assert('another wish'), clientDataHash: cdh, known })).why, /not signed/);
  assert.match((await androidAssertionOf({ assertion: g.phone().assert('a wish'), clientDataHash: cdh, known })).why, /not signed/);
  assert.equal(DIGEST.length, 64);
});

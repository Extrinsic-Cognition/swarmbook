// dl-her-friends.test.mjs · A FRIEND GRANTS A WISH (lane/a-friend-grants-a-wish; his Oct 29 2026 20:28 UTC "Yes, build it"): the law of her code, of a friend's
// birth from a link to her and of the wish it grants the sharer (dl-her-friends.mjs). node --test dl-her-friends.test.mjs (no browser, no network).
import test from 'node:test';
import assert from 'node:assert/strict';
import * as F from './dl-her-friends.mjs';
import { CODE_ALPHABET, REFERRAL_LENGTH, CLAIM_LENGTH, isReferralCode, isClaimCode, normalizeCode } from './dl-society-codes.mjs';

test('her code: ten letters of the Society\'s alphabet, a length no seat\'s or claim\'s code has, drawn a byte a letter; only its canonical form is hers', () => {
  assert.equal(F.CODE_LENGTH, 10); assert.ok(![REFERRAL_LENGTH, CLAIM_LENGTH].includes(F.CODE_LENGTH), 'never read as a paid seat\'s code or a claim code');
  const seen = new Set();
  for (let i = 0; i < 200; i++) { const c = F.draw(); assert.ok(F.isHerCode(c) && [...c].every((x) => CODE_ALPHABET.includes(x)), c); assert.ok(!isReferralCode(c) && !isClaimCode(c)); seen.add(c); }
  assert.equal(seen.size, 200, 'two hundred draws, two hundred codes');
  assert.equal(F.draw(() => new Uint8Array(10).fill(255)), 'ZZZZZZZZZZ', 'a byte a letter, its low five bits');
  for (const bad of ['abcdefghjk', 'ABCD-EFGH-JK', 'ABCDEFGHJ', 'ABCDEFGHJKM', 'ABCDEFGHJU', 'ABCDEFGHJO', null, 12, undefined]) assert.equal(F.isHerCode(bad), false, String(bad));
  assert.equal(normalizeCode('abcd-efgh-jk', F.CODE_LENGTH), 'ABCDEFGHJK', 'a hand\'s typing reads as the code; only the canonical form is kept and sent');
});

test('kept in this browser and read back; anything broken or foreign is none; a storage that refuses keeps nothing and says so', () => {
  const store = new Map(), storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) };
  assert.deepEqual(F.kept(storage), F.none()); assert.deepEqual(F.kept(null), F.none());
  const f = { code: 'ABCDEFGHJK', ref: 'MNPQRSTVWX', told: true, seen: 3 };
  assert.ok(F.keep(storage, f, () => 'now')); assert.deepEqual(JSON.parse(store.get(F.KEEP_KEY)), { ...f, at: 'now' }); assert.deepEqual(F.kept(storage), f);
  for (const v of ['nope', '{"code":"abc","ref":7,"told":"yes","seen":-2}', 'null', '[]', '7']) { store.set(F.KEEP_KEY, v); assert.deepEqual(F.kept(storage), F.none(), v); }
  assert.equal(F.keep({ setItem() { throw new Error('full'); } }, f), false);
});

test('a friend arrives: the sharer\'s code kept as the ref, the latest link winning; never their own code, never once their her was born or her birth told', () => {
  const A = 'AAAAAAAAAA', B = 'BBBBBBBBBB', ME = 'MMMMMMMMMM', f0 = F.none();
  const f1 = F.arrived(f0, A, false); assert.deepEqual(f1, { ...f0, ref: A });
  assert.equal(F.arrived(f1, B, false).ref, B, 'the latest link wins');
  assert.equal(F.arrived(f1, A, false), f1, 'the same code again: nothing changes, nothing to keep');
  assert.equal(F.arrived({ ...f0, code: ME }, ME, false).ref, null, 'their own link brings them no friend');
  assert.equal(F.arrived(f0, A, true), f0, 'their her was born before the link');
  assert.equal(F.arrived({ ...f1, told: true }, B, false).ref, A, 'her birth told: the ref it was told with stands');
  for (const bad of ['nope', null, 'aaaaaaaaaa']) assert.equal(F.arrived(f0, bad, false), f0, String(bad));
});

test('the wishes the friends born grant: those not granted before, never fewer than none, a count at most; no web door of births is left', () => {
  assert.deepEqual([F.granted(0, 0), F.granted(0, 2), F.granted(2, 2), F.granted(2, 5), F.granted(5, 2)], [0, 2, 0, 3, 0]);
  assert.deepEqual([F.granted(0, -1), F.granted(0, 1.5), F.granted(0, '3'), F.granted(0, null), F.granted(0, 1e9)], [0, 0, 0, 0, F.MOST]);
  assert.deepEqual([F.FRIENDS_PATH, F.BORN_PATH, F.BORN_BYTES, F.toTell], [undefined, undefined, undefined, undefined], 'THE WISH IS IN THE APP: a friend counts when born in DysonLight');
});

// dl-society-codes.test.mjs: the two codes read the same everywhere. node --test app/dl-society-codes.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {CODE_ALPHABET, REFERRAL_LENGTH, CLAIM_LENGTH, REFERRAL_KEY, REFERRAL_DAYS, normalizeCode, isReferralCode, isClaimCode, randomCode, groupCode, shareURL, claimURL, claimOfText, sha256Hex, captureReferral, keptReferral, forgetReferral} from './dl-society-codes.mjs';
import {referralModel, REFERRAL_SCHEMA} from '../vendor/embertide-app/ui/intro/room/society-referrals.mjs'; import { Storage } from '../worker/stand-ins.mjs';

const DAY = 86400000;

test('the alphabet is Crockford\'s: 32 letters, no I, L, O or U; a hand\'s lookalikes, case and separators are read', () => {
  assert.equal(CODE_ALPHABET.length, 32); assert.equal(new Set(CODE_ALPHABET).size, 32);
  for (const c of 'ILOU') assert.ok(!CODE_ALPHABET.includes(c), c);
  assert.equal(normalizeCode('7k3m-9pq2', REFERRAL_LENGTH), '7K3M9PQ2');
  assert.equal(normalizeCode(' 7K3M 9PQ2 ', REFERRAL_LENGTH), '7K3M9PQ2');
  assert.equal(normalizeCode('oil7-k3m9', REFERRAL_LENGTH), '0117K3M9', 'o -> 0, i -> 1, l -> 1');
  assert.equal(normalizeCode('7K3M.9PQ2', REFERRAL_LENGTH), '7K3M9PQ2');
  for (const bad of ['7K3M9PQ', '7K3M9PQ2X', '7K3M9PU2', '7K3M9P#2', '', null, undefined, 42, 'a'.repeat(200)]) assert.equal(normalizeCode(bad, REFERRAL_LENGTH), null, String(bad));
  assert.equal(isReferralCode('7K3M9PQ2'), true); assert.equal(isReferralCode('7k3m9pq2'), false, 'canonical is upper case'); assert.equal(isReferralCode('7K3M-9PQ2'), false, 'canonical is ungrouped');
  assert.equal(isClaimCode('7K3M9PQ2X4T6'), true); assert.equal(isClaimCode('7K3M9PQ2'), false);
  assert.equal(groupCode('7K3M9PQ2'), '7K3M-9PQ2'); assert.equal(groupCode('7K3M9PQ2X4T6'), '7K3M-9PQ2-X4T6');
});

test('a random code is of the alphabet, its length, unbiased by construction, and a referral code is one the box\'s card admits', () => {
  for (let i = 0; i < 200; i++) { const r = randomCode(REFERRAL_LENGTH), c = randomCode(CLAIM_LENGTH); assert.ok(isReferralCode(r), r); assert.ok(isClaimCode(c), c); }
  assert.equal(randomCode(4, () => Uint8Array.from([0, 31, 32, 255])), '0ZZZ'.replace('ZZZ', `${CODE_ALPHABET[31]}${CODE_ALPHABET[0]}${CODE_ALPHABET[31]}`), 'each byte & 31');
  assert.throws(() => randomCode(4, () => Uint8Array.from([1, 2])));
  assert.ok(new Set(Array.from({length: 50}, () => randomCode(CLAIM_LENGTH))).size === 50, 'fifty draws, fifty codes');
  // the referral card's own law: the code and its share link pass society.referrals/1 as the page writes them
  const code = randomCode(REFERRAL_LENGTH), holder = '1'.repeat(31) + '2';
  const model = referralModel({projection: {schema: REFERRAL_SCHEMA, state: 'ready', code, shareURL: shareURL(code), referrer: holder, receipts: []}, wallet: {holder}});
  assert.deepEqual(model, {state: 'ready', code, shareURL: `https://optimism.fit/?ref=${code}`, confirmedSeats: 0});
});

test('the share link is one query parameter on the canonical origin; the claim link carries the code in its fragment and is read back', async () => {
  assert.equal(shareURL('7K3M9PQ2'), 'https://optimism.fit/?ref=7K3M9PQ2');
  assert.equal(claimURL('7K3M9PQ2X4T6'), 'https://optimism.fit/claim#7K3M9PQ2X4T6');
  assert.equal(new URL(claimURL('7K3M9PQ2X4T6')).search, '', 'nothing in the query: no server log holds the code');
  for (const given of ['7K3M9PQ2X4T6', '7k3m-9pq2-x4t6', ' 7K3M 9PQ2 X4T6\n', 'https://optimism.fit/claim#7K3M9PQ2X4T6', 'https://optimism.fit/claim#7k3m-9pq2-x4t6', 'https://optimism.fit/app/claim.html#7K3M9PQ2X4T6']) {
    assert.equal(claimOfText(given), '7K3M9PQ2X4T6', given);
  }
  for (const bad of ['7K3M9PQ2', 'https://optimism.fit/?ref=7K3M9PQ2X4T6', 'https://optimism.fit/other#7K3M9PQ2X4T6', 'not a code', '', null, 'x'.repeat(600)]) assert.equal(claimOfText(bad), null, String(bad));
  assert.equal(await sha256Hex('abc'), 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');
});

test('a visit\'s ?ref= is kept 30 days, the latest arrival wins, a word that is no code keeps what was kept, and a refused storage keeps nothing', () => {
  const s = new Storage(), t0 = Date.parse('2026-10-16T07:00:00Z');
  assert.equal(captureReferral('', s, t0), null); assert.equal(keptReferral(s, t0), null);
  assert.deepEqual(captureReferral('?ref=7k3m-9pq2&from=harmony', s, t0), {code: '7K3M9PQ2', at: t0});
  assert.deepEqual(JSON.parse(s.getItem(REFERRAL_KEY)), {code: '7K3M9PQ2', at: t0});
  assert.deepEqual(captureReferral('?ref=nope', s, t0 + 1000), {code: '7K3M9PQ2', at: t0}, 'no code in the visit: the kept one');
  assert.deepEqual(captureReferral('?from=other', s, t0 + 1000), {code: '7K3M9PQ2', at: t0});
  assert.deepEqual(captureReferral('?ref=X4T6ABCD', s, t0 + 2000), {code: 'X4T6ABCD', at: t0 + 2000}, 'the latest arrival wins');
  assert.deepEqual(keptReferral(s, t0 + REFERRAL_DAYS * DAY + 2000), {code: 'X4T6ABCD', at: t0 + 2000}, 'its last instant');
  assert.equal(keptReferral(s, t0 + REFERRAL_DAYS * DAY + 2001), null, 'past its 30 days: forgotten');
  assert.equal(s.getItem(REFERRAL_KEY), null);
  s.setItem(REFERRAL_KEY, 'not json'); assert.equal(keptReferral(s, t0), null);
  s.setItem(REFERRAL_KEY, JSON.stringify({code: 'bad', at: t0})); assert.equal(keptReferral(s, t0), null);
  s.setItem(REFERRAL_KEY, JSON.stringify({code: '7K3M9PQ2', at: t0 + 3 * DAY})); assert.equal(keptReferral(s, t0), null, 'a clock ahead by days is no memory');
  captureReferral('?ref=7K3M9PQ2', s, t0); forgetReferral(s); assert.equal(keptReferral(s, t0), null);
  const refusing = {getItem() { throw new Error('refused'); }, setItem() { throw new Error('refused'); }, removeItem() { throw new Error('refused'); }};
  assert.deepEqual(captureReferral('?ref=7K3M9PQ2', refusing, t0), {code: '7K3M9PQ2', at: t0}, 'this page\'s life');
  assert.equal(keptReferral(refusing, t0), null); assert.equal(captureReferral('?ref=7K3M9PQ2', null, t0)?.code, '7K3M9PQ2');
});

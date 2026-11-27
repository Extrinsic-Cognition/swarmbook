// dl-gold-bid.test.mjs: THE GOLD MONTH IS A SEALED BID (his Oct 23 2026: "sealed bids that get encrypted with a pubkey i own so only i can decrypt the
// bids and post the amount", "Go with A"). The curve against TweetNaCl's own keys, the second generator against its pin, the commitments adding up,
// the seal only he opens, the bid's signature, the close's total anyone checks, the rank, the month.
// node --test dl-gold-bid.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { webcrypto } from 'node:crypto';
import { GOLD, H_HEX, H_SEED, L, PLAIN_LENGTH, RECEIPT_KEY, SCHEMA, BID_TYPE, TOTAL_TYPE, monthOf, isMonth, windowOf, phaseOf, hexBytes, bytesHex,
  edPublicOf, deriveH, commit, sumCommitments, sumBlinders, verifyTotal, verifyOpening, curveOf, boxKeys, canonicalBid, makeBid, verifyBid, verifyBidWith,
  openBid, rank, canonicalTotal, makeTotal, checkTotal, verifyWith, solText, lamportsOf, isLamports } from './dl-gold-bid.mjs';
import { RECIPIENT, TIERS, encode58 } from './dl-direct-protocol.mjs';

const nacl = createRequire(import.meta.url)('./vendor/tweetnacl-1.0.3.fast.min.js');
const seeded = (n) => { let x = n >>> 0; return (k) => Uint8Array.from({ length: k }, () => { x = (x * 1664525 + 1013904223) >>> 0; return x >>> 24; }); };   // a fixed stream for the tests
const HIS = nacl.sign.keyPair.fromSeed(seeded(7)(32));   // a stand-in for the recipient's wallet in the tests
const HIS_ADDRESS = encode58(HIS.publicKey);
const naclVerify = async (bytes, signature, key) => nacl.sign.detached.verify(bytes, signature, key);

test('the curve is Ed25519: a seed\'s public key is nacl\'s, 24 seeds', () => {
  const random = seeded(1);
  for (let i = 0; i < 24; i++) { const seed = random(32); assert.equal(bytesHex(edPublicOf(nacl.hash, seed)), bytesHex(nacl.sign.keyPair.fromSeed(seed).publicKey)); }
});
test('the X25519 twin of an Ed25519 key is the one nacl derives from the same seed (the birational map against nacl.scalarMult.base)', () => {
  const random = seeded(2);
  for (let i = 0; i < 12; i++) { const seed = random(32); assert.equal(bytesHex(curveOf(edPublicOf(nacl.hash, seed))), bytesHex(boxKeys(nacl, seed).publicKey)); }
});
test('H is found, not chosen: derived again from the fixed string it is the pin, in the group, and not B', () => {
  const { i, hex } = deriveH(nacl.hash);
  assert.equal(hex, H_HEX); assert.equal(i, 1); assert.equal(H_SEED, 'THE GOLD BID');
  assert.notEqual(hex, '5866666666666666666666666666666666666666666666666666666666666666');
});
test('commitments hide and add: ΣC opens to Σv with ΣR, and nothing else', () => {
  const random = seeded(3), bids = [1500000000, 250000000, 12000000000].map((v) => ({ v, r: random(32) }));
  const C = bids.map((b) => commit(b.v, b.r));
  assert.ok(C.every((c) => c.length === 32));
  assert.notEqual(bytesHex(commit(1500000000, random(32))), bytesHex(C[0]), 'the same amount with another blinder is another commitment');
  const total = bids.reduce((s, b) => s + b.v, 0), R = sumBlinders(bids.map((b) => b.r));
  assert.ok(verifyTotal(C, total, R));
  assert.ok(verifyTotal(C, BigInt(total), R));
  assert.equal(verifyTotal(C, total + 1, R), false);
  assert.equal(verifyTotal(C.slice(1), total, R), false);
  assert.equal(verifyTotal(C, total, random(32)), false);
  assert.equal(bytesHex(sumCommitments(C)), bytesHex(sumCommitments([C[2], C[0], C[1]])), 'order does not matter');
  assert.ok(verifyOpening(C[1], 250000000, bids[1].r)); assert.equal(verifyOpening(C[1], 250000001, bids[1].r), false);
  assert.throws(() => commit(0, random(32)), /Invalid bid/); assert.throws(() => commit(2 ** 53, random(32)), /Invalid bid/); assert.throws(() => commit(5, random(31)), /Invalid blinder/);
});
test('a torsion point is refused as a commitment (the log keeps the group clean, so the total always adds up)', () => {
  const torsion = hexBytes('0000000000000000000000000000000000000000000000000000000000000080');   // a low-order point
  assert.throws(() => sumCommitments([torsion]), /Invalid point|not in the group/);
  assert.equal(verifyTotal([torsion], 0, new Uint8Array(32)), false);
});
test('a bid: sealed to his key, signed by its own fresh key, verified by nacl and by Web Crypto, opened only by him', async () => {
  const random = seeded(4), month = '2026-11';
  const { bid, receipt } = makeBid({ nacl, month, lamports: 3000000000, payer: HIS_ADDRESS, random, recipient: HIS_ADDRESS });
  assert.equal(bid.type, BID_TYPE); assert.equal(bid.schema, SCHEMA); assert.equal(bid.month, month);
  assert.match(bid.commitment, /^[0-9a-f]{64}$/); assert.match(bid.bidder, /^[0-9a-f]{64}$/); assert.equal(bid.box.length, (PLAIN_LENGTH + 16) * 2); assert.match(bid.signature, /^[0-9a-f]{128}$/);
  assert.equal(receipt.lamports, 3000000000); assert.equal(receipt.commitment, bid.commitment); assert.equal(receipt.month, month); assert.equal(receipt.payer, HIS_ADDRESS);
  assert.ok(verifyBid(nacl, bid)); assert.ok(await verifyBidWith(webcrypto.subtle, bid));
  assert.equal(verifyBid(nacl, { ...bid, month: '2026-12' }), false, 'the month is signed');
  assert.equal(verifyBid(nacl, { ...bid, commitment: bid.commitment.replace(/^./, (c) => (c === '0' ? '1' : '0')) }), false, 'the commitment is signed');
  assert.equal(await verifyBidWith(webcrypto.subtle, { ...bid, box: bid.box.slice(0, -2) + (bid.box.endsWith('00') ? '01' : '00') }), false, 'the box is signed');
  const opened = openBid(nacl, bid, HIS.secretKey, HIS_ADDRESS);
  assert.equal(opened.lamports, 3000000000n); assert.equal(bytesHex(opened.blinder), receipt.blinder); assert.equal(opened.payer, HIS_ADDRESS);
  assert.ok(verifyOpening(hexBytes(bid.commitment), Number(opened.lamports), opened.blinder));
  const other = nacl.sign.keyPair.fromSeed(seeded(8)(32));
  assert.throws(() => openBid(nacl, bid, other.secretKey, HIS_ADDRESS), /Not the recipient/);
  assert.throws(() => openBid(nacl, bid, other.secretKey, encode58(other.publicKey)), /does not open/);
  assert.throws(() => openBid(nacl, { ...bid, commitment: bytesHex(commit(1, random(32))) }, HIS.secretKey, HIS_ADDRESS), /lies about its commitment/);
  assert.throws(() => makeBid({ nacl, month: '2026-13', lamports: 1, random }), /Invalid month/);
  assert.throws(() => makeBid({ nacl, month, lamports: 0, random }), /Invalid bid/);
  const bare = makeBid({ nacl, month, lamports: 7, random, recipient: HIS_ADDRESS });
  assert.equal(openBid(nacl, bare.bid, HIS.secretKey, HIS_ADDRESS).payer, null, 'no payer named: zeros, read as none');
  assert.equal(new TextDecoder().decode(canonicalBid(bid)).split(':').length, 6);   // type, creator, month, commitment, bidder, box
});
test('the default recipient is the seat\'s: a bid with no recipient named is sealed to RECIPIENT', () => {
  const { bid } = makeBid({ nacl, month: '2026-11', lamports: 1000000000, random: seeded(5) });
  assert.ok(verifyBid(nacl, bid));
  assert.throws(() => openBid(nacl, bid, HIS.secretKey), /Not the recipient/);
  assert.equal(RECIPIENT, '3nJn2tnmR27xbkjzT49YnSnXL2KeddzM7CkEizYiKMba');
});
test('the rank: the reserve, the slots, ties by the log\'s order', () => {
  const opened = [{ commitment: 'a', lamports: 5 }, { commitment: 'b', lamports: 9 }, { commitment: 'c', lamports: 9 }, { commitment: 'd', lamports: 2 }, { commitment: 'e', lamports: 7n }];
  assert.deepEqual(rank(opened, 3, 2).map((b) => b.commitment), ['b', 'c']);
  assert.deepEqual(rank(opened, 3).map((b) => b.commitment), ['b', 'c', 'e', 'a']);
  assert.deepEqual(rank(opened, 10), []);
  assert.equal(GOLD.slots, 12); assert.equal(GOLD.reserveUsd, TIERS.gold.usd);
});
test('the close: his total with the winners, checked by anyone from the log; a wrong total, count, winner or signature fails', async () => {
  const random = seeded(6), month = '2026-11', lamports = [4000000000, 1000000000, 2500000000, 900000000];
  const made = lamports.map((v) => makeBid({ nacl, month, lamports: v, random, recipient: HIS_ADDRESS }));
  const log = made.map((m) => m.bid.commitment);
  const opened = made.map((m) => { const o = openBid(nacl, m.bid, HIS.secretKey, HIS_ADDRESS); return { commitment: m.bid.commitment, lamports: Number(o.lamports), blinder: bytesHex(o.blinder) }; });
  const total = makeTotal({ nacl, month, opened, reserveLamports: 1000000000, slots: 2, secretKey: HIS.secretKey });
  assert.equal(total.type, TOTAL_TYPE); assert.equal(total.lamports, 8400000000); assert.equal(total.bids, 4);
  assert.deepEqual(total.winners.map((w) => w.lamports), [4000000000, 2500000000]);
  assert.deepEqual(await checkTotal(total, log, naclVerify, HIS_ADDRESS), { ok: true });
  assert.deepEqual(await checkTotal(total, log, verifyWith(webcrypto.subtle), HIS_ADDRESS), { ok: true });
  assert.equal((await checkTotal({ ...total, lamports: total.lamports + 1 }, log, naclVerify, HIS_ADDRESS)).why, 'not his signature');
  const resigned = (t) => ({ ...t, signature: bytesHex(nacl.sign.detached(canonicalTotal(t), HIS.secretKey)) });
  assert.equal((await checkTotal(resigned({ ...total, lamports: total.lamports + 1 }), log, naclVerify, HIS_ADDRESS)).why, 'the total does not add up');
  assert.equal((await checkTotal(resigned({ ...total, bids: 3 }), log, naclVerify, HIS_ADDRESS)).why, 'the count is not the log\'s');
  assert.equal((await checkTotal(total, log.slice(0, 3), naclVerify, HIS_ADDRESS)).why, 'the count is not the log\'s');
  const stranger = makeBid({ nacl, month, lamports: 5, random, recipient: HIS_ADDRESS });
  assert.equal((await checkTotal(resigned({ ...total, winners: [{ ...total.winners[0], commitment: stranger.bid.commitment }] }), log, naclVerify, HIS_ADDRESS)).why, 'a winner is not in the log');
  assert.equal((await checkTotal(resigned({ ...total, winners: [{ ...total.winners[0], lamports: 1 }] }), log, naclVerify, HIS_ADDRESS)).why, 'a winner\'s opening is false');
  assert.equal((await checkTotal(total, log, naclVerify)).why, 'not his signature', 'checked against RECIPIENT by default');
  const empty = makeTotal({ nacl, month, opened: [], reserveLamports: 1, secretKey: HIS.secretKey });
  assert.deepEqual(await checkTotal(empty, [], naclVerify, HIS_ADDRESS), { ok: true }, 'a month with no bid still posts a total of zero');
});
test('the month: UTC, its window, its phases, the access month', () => {
  assert.equal(monthOf(Date.UTC(2026, 10, 30, 23, 59)), '2026-11'); assert.ok(isMonth('2026-12')); assert.equal(isMonth('2026-13'), false); assert.equal(isMonth('2026-1'), false);
  const w = windowOf('2026-12');
  assert.equal(w.opens, Date.UTC(2026, 11, 1)); assert.equal(w.closes, Date.UTC(2026, 11, 25)); assert.equal(w.pays, Date.UTC(2026, 11, 28)); assert.equal(w.ends, Date.UTC(2027, 0, 1)); assert.equal(w.access, '2027-01');
  assert.equal(phaseOf('2026-12', Date.UTC(2026, 10, 30)), 'before'); assert.equal(phaseOf('2026-12', Date.UTC(2026, 11, 1)), 'open'); assert.equal(phaseOf('2026-12', Date.UTC(2026, 11, 24, 23)), 'open');
  assert.equal(phaseOf('2026-12', Date.UTC(2026, 11, 25)), 'pay'); assert.equal(phaseOf('2026-12', Date.UTC(2026, 11, 28)), 'over');
  assert.throws(() => windowOf('nope'), /Invalid month/);
});
test('SOL text both ways, and the bounds', () => {
  assert.equal(solText(1250000000), '1.250000000'); assert.equal(solText(7n), '0.000000007');
  assert.equal(lamportsOf('1.25'), 1250000000); assert.equal(lamportsOf(' 3 '), 3000000000); assert.equal(lamportsOf('0.000000001'), 1);
  assert.equal(lamportsOf('0'), null); assert.equal(lamportsOf('1.1234567891'), null); assert.equal(lamportsOf('abc'), null); assert.equal(lamportsOf(''), null);
  assert.ok(isLamports(1)); assert.ok(isLamports(2 ** 53 - 1)); assert.equal(isLamports(2 ** 53), false); assert.equal(isLamports(-1), false); assert.equal(isLamports(1.5), false);
  assert.equal(RECEIPT_KEY, 'dl-gold-bid'); assert.equal(L, 2n ** 252n + 27742317777372353535851937790883648493n);
});
test('the cost, read: a bid and a month of a hundred commitments (the page and the close; the Worker decodes one bid at its door)', () => {
  const random = seeded(9);
  let t = performance.now(); const { bid } = makeBid({ nacl, month: '2026-11', lamports: 1, random, recipient: HIS_ADDRESS }); const bidMs = performance.now() - t;
  const C = Array.from({ length: 100 }, (_, i) => commit(i + 1, random(32)));
  t = performance.now(); sumCommitments(C); const sumMs = performance.now() - t;
  t = performance.now(); verifyBid(nacl, bid); sumCommitments([hexBytes(bid.commitment)]); const doorMs = performance.now() - t;
  console.log(`  cost: a bid ${bidMs.toFixed(0)} ms, a hundred commitments summed ${sumMs.toFixed(0)} ms, the Worker's door per bid ${doorMs.toFixed(0)} ms`);
  assert.ok(bidMs < 2000 && sumMs < 20000);
});

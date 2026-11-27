// gold-close.test.mjs: HIS CLOSE OF A GOLD MONTH (tools/gold-close.mjs): the key read both ways, the bids opened in the log's order, the reserve at
// the day's price, the signed total the page checks, a month not yet closed refused, a bid that does not open stopping the close with its name.
// node --test gold-close.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { webcrypto } from 'node:crypto';
import { keyOf, closeMonth } from './gold-close.mjs';
import { makeBid, checkTotal, verifyWith, windowOf, GOLD } from '../app/dl-gold-bid.mjs';
import { encode58, quoteLamports } from '../app/dl-direct-protocol.mjs';

const nacl = createRequire(import.meta.url)('../app/vendor/tweetnacl-1.0.3.fast.min.js');
const seeded = (n) => { let x = n >>> 0; return (k) => Uint8Array.from({ length: k }, () => { x = (x * 1664525 + 1013904223) >>> 0; return x >>> 24; }); };
const HIS = nacl.sign.keyPair.fromSeed(seeded(7)(32)), HIS_ADDRESS = encode58(HIS.publicKey);
const MONTH = '2026-11', W = windowOf(MONTH);

test('the key: Phantom\'s base58 and solana-keygen\'s array, 64 bytes', () => {
  assert.deepEqual(keyOf(encode58(HIS.secretKey)), HIS.secretKey);
  assert.deepEqual(keyOf(` ${JSON.stringify(Array.from(HIS.secretKey))}\n`), HIS.secretKey);
  assert.throws(() => keyOf(JSON.stringify([1, 2, 3])), /64 bytes/);
});
test('the close: opened in the log\'s order, ranked under the reserve at the price, signed; checked as the page checks it', async () => {
  const random = seeded(21), lamports = [30000000000, 5000000000, 12000000000, 7000000000];
  const made = lamports.map((v, i) => makeBid({ nacl, month: MONTH, lamports: v, payer: i === 0 ? HIS_ADDRESS : null, random, recipient: HIS_ADDRESS }));
  const bids = made.map((m) => m.bid), pot = { month: MONTH, commitments: bids.map((b) => b.commitment) };
  assert.throws(() => closeMonth({ pot, bids, secretKey: HIS.secretKey, solUsd: 100, now: W.opens + 1, recipient: HIS_ADDRESS }), /not closed yet \(open\)/);
  const { opened, reserveLamports, total } = closeMonth({ pot, bids, secretKey: HIS.secretKey, solUsd: 100, now: W.closes + 1, slots: 2, recipient: HIS_ADDRESS });
  assert.deepEqual(opened.map((o) => o.lamports), lamports); assert.equal(opened[0].payer, HIS_ADDRESS); assert.equal(opened[1].payer, null);
  assert.equal(reserveLamports, Number(quoteLamports(GOLD.reserveUsd, '100')));   // $1000 at $100: 10 SOL
  assert.deepEqual(total.winners.map((w) => w.lamports), [30000000000, 12000000000], 'the two above the reserve, highest first; 7 and 5 SOL are under it');
  assert.equal(total.lamports, 54000000000); assert.equal(total.bids, 4);
  assert.deepEqual(await checkTotal(total, pot.commitments, verifyWith(webcrypto.subtle), HIS_ADDRESS), { ok: true });
  assert.throws(() => closeMonth({ pot: { ...pot, commitments: pot.commitments.slice(1) }, bids, secretKey: HIS.secretKey, solUsd: 100, now: W.closes + 1, recipient: HIS_ADDRESS }), /not the pot's log/);
});
test('a bid that does not open stops the close and is named; nothing is posted over it', () => {
  const random = seeded(22), good = makeBid({ nacl, month: MONTH, lamports: 1, random, recipient: HIS_ADDRESS }).bid;
  const stranger = makeBid({ nacl, month: MONTH, lamports: 1, random, recipient: encode58(nacl.sign.keyPair.fromSeed(seeded(9)(32)).publicKey) }).bid;   // sealed to someone else
  const pot = { month: MONTH, commitments: [good.commitment, stranger.commitment] };
  assert.throws(() => closeMonth({ pot, bids: [good, stranger], secretKey: HIS.secretKey, solUsd: 100, now: W.closes + 1, recipient: HIS_ADDRESS }), new RegExp(`1 bid\\(s\\) do not open: ${stranger.commitment.slice(0, 8)}`));
});

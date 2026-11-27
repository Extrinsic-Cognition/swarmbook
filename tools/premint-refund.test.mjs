// premint-refund.test.mjs: A REFUND HE SIGNS, the law alone (Oct 28 2026). No network, no D1, no key: invented orders and transactions.
import test from 'node:test';
import assert from 'node:assert/strict';
import { b58encode, solOf, referenceOf, refundRequest, paidOnChain, refundedOnChain, ordersFrom, qrSvg, MEMO_PREFIX } from './premint-refund.mjs';

const BUYER = 'BK6D1vEsc1awf7euRok8ufWkUKQbaDv9J9pCVirEiq2v', PAYEE = '3nJn2tnmR27xbkjzT49YnSnXL2KeddzM7CkEizYiKMba';
const order = { id: 'o-1', tier: 'bronze', buyer: BUYER, recipient: PAYEE, lamports: '59000000', signature: 'SIG1', status: 'paid' };
const transfer = (source, destination, lamports, err = null) => ({ meta: { err, innerInstructions: [] }, transaction: { message: { instructions: [
  { program: 'spl-memo', parsed: 'optimism.fit:premint:v1:o-1' }, { program: 'system', parsed: { type: 'transfer', info: { source, destination, lamports } } }] } } });

test('base58 and the SOL amount are written as Solana Pay reads them', () => {
  assert.equal(b58encode(new Uint8Array([0, 0, 1])), '112');
  assert.equal(solOf('59000000'), '0.059'); assert.equal(solOf(1000000000), '1'); assert.equal(solOf(1), '0.000000001'); assert.equal(solOf('12345678901'), '12.345678901');
  assert.throws(() => solOf(0), /positive/);
  assert.equal(referenceOf('o-1'), referenceOf('o-1'), 'the same order makes the same reference'); assert.notEqual(referenceOf('o-1'), referenceOf('o-2'));
});

test('a paid order makes one transfer request back to its buyer, for what it paid; anything else is refused', () => {
  const r = refundRequest(order);
  assert.ok(r.url.startsWith(`solana:${BUYER}?`));
  const q = new URL(r.url.replace('solana:', 'https://x/')).searchParams;
  assert.equal(q.get('amount'), '0.059'); assert.equal(q.get('reference'), referenceOf('o-1')); assert.equal(q.get('memo'), MEMO_PREFIX + 'o-1');
  assert.equal(q.get('label'), 'optimism.fit'); assert.equal(q.get('message'), 'Refund of order o-1'); assert.ok(!r.url.includes('+'), 'spaces as %20');
  assert.equal(r.from, PAYEE, 'signed by the wallet that was paid');
  assert.throws(() => refundRequest({ ...order, status: 'submitted' }), /not paid/);
  assert.throws(() => refundRequest({ ...order, signature: null }), /no payment signature/);
  assert.throws(() => refundRequest({ ...order, id: "x'; DROP TABLE premint_orders; --" }), /will not read/);
});

test('the payment is read off the chain: the order\'s lamports from its buyer to its payee, in a transaction that did not fail', () => {
  assert.equal(paidOnChain(order, transfer(BUYER, PAYEE, 59000000)), true);
  assert.equal(paidOnChain(order, transfer(BUYER, PAYEE, 58999999)), false, 'a lamport short');
  assert.equal(paidOnChain(order, transfer(PAYEE, BUYER, 59000000)), false, 'the other way');
  assert.equal(paidOnChain(order, transfer(BUYER, PAYEE, 59000000, { InstructionError: [1, 'x'] })), false, 'a failed transaction');
  assert.equal(paidOnChain(order, null), false);
});

test('a refund already made is found by its reference, so a second request is never made', async () => {
  const txs = { A: transfer(PAYEE, BUYER, 1), B: transfer(PAYEE, BUYER, 59000000), C: transfer(PAYEE, BUYER, 59000000, { e: 1 }) };
  const txOf = async (s) => txs[s];
  assert.equal(await refundedOnChain(order, [{ signature: 'A' }, { signature: 'B' }], txOf), 'B');
  assert.equal(await refundedOnChain(order, [{ signature: 'C' }, { signature: 'X', err: { e: 1 } }], txOf), null);
  assert.equal(await refundedOnChain(order, [], txOf), null);
});

test('orders come from a plain list or from wrangler d1 execute --json; the request is drawn as a QR', () => {
  assert.deepEqual(ordersFrom([order]), [order]);
  assert.deepEqual(ordersFrom([{ results: [order], success: true, meta: {} }]), [order]);
  assert.deepEqual(ordersFrom({}), []);
  const svg = qrSvg(refundRequest(order).url);
  assert.ok(svg.startsWith('<svg') && svg.includes('Refund'), 'an SVG QR');
});

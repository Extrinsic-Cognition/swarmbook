// space-router-deposit.test.mjs · PAY A TANK: the page's deposit is a legacy message the launch tool's compiler makes too; the door counts what moved
// (the treasury's USDC rose by what the fee payer paid), whatever the transaction's shape; the key's commitment is not its hash; every refusal.
// node --test embertide-app/ui/intro/dyson-society/app/space-router-deposit.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { DEPOSIT_TERMS, TOKEN_PROGRAM, USDC_MINT, USDC_DECIMALS, newTankKey, keyHashOf, keyCommitmentOf, unkeyedOf, isUnkeyed, depositMemo, depositMessage,
  signedDeposit, verifyDeposit, usdOf, PRICE_FLOOR, PRICE_CAP, COMPUTE_BUDGET, priceOf } from './space-router-deposit.mjs';
import { MEMO, encode58, decode58 } from './dl-direct-protocol.mjs';
import { compile } from '../vendor/tools/warm-launch/chain.mjs';

import { parsedTx } from './space-router-deposit.fixture.mjs';
const address = () => encode58(crypto.getRandomValues(new Uint8Array(32)));

test('the page\'s deposit is the legacy message the launch tool compiles from the same two instructions', async () => {
  const payer = address(), source = address(), treasury = address(), blockhash = address(), commitment = await keyCommitmentOf(newTankKey());
  const message = depositMessage({ payer, source, treasury, mint: USDC_MINT, amount: '30000000', blockhash, commitment });
  const data = Buffer.alloc(10); data[0] = 12; data.writeBigUInt64LE(30000000n, 1); data[9] = USDC_DECIMALS;
  const compiled = compile([
    { program: MEMO, keys: [{ key: payer, signer: true, writable: false }], data: Buffer.from(`${DEPOSIT_TERMS}:${commitment}`) },
    { program: TOKEN_PROGRAM, keys: [{ key: source, signer: false, writable: true }, { key: USDC_MINT, signer: false, writable: false }, { key: treasury, signer: false, writable: true }, { key: payer, signer: true, writable: false }], data },
  ], payer, blockhash);
  assert.deepEqual([...message], [...compiled.message]);
  const whole = Buffer.alloc(10), bare = depositMessage({ payer, source, treasury, mint: USDC_MINT, amount: '600412645', blockhash }), sig = crypto.getRandomValues(new Uint8Array(64)); whole[0] = 12; whole.writeBigUInt64LE(600412645n, 1); whole[9] = USDC_DECIMALS;   /* THE HOUSE'S USDC FILLS A FLASK (worker/space-router-deposit.mjs house): the form the door sends of the fee wallet's own USDC is this one, its one signer the fee's payer and the account's owner, its memo the plain terms; its wire one signature and the message */
  assert.deepEqual([...bare], [...compile([{ program: MEMO, keys: [{ key: payer, signer: true, writable: false }], data: Buffer.from(DEPOSIT_TERMS) }, { program: TOKEN_PROGRAM, keys: [{ key: source, signer: false, writable: true }, { key: USDC_MINT, signer: false, writable: false }, { key: treasury, signer: false, writable: true }, { key: payer, signer: true, writable: false }], data: whole }], payer, blockhash).message]); assert.deepEqual([...Buffer.from(signedDeposit(bare, sig), 'base64')], [1, ...sig, ...bare]);
  const base = { payer, source, treasury, mint: USDC_MINT, amount: '1', blockhash };
  assert.throws(() => depositMessage({ ...base, amount: '0' }), /amount/);
  assert.throws(() => depositMessage({ ...base, treasury: source }), /four different/);
  assert.throws(() => depositMemo('ABC'), /commitment/);
  const priced = (o) => depositMessage({ ...base, ...o });   // THE POUR PAYS TO LAND: two compute budget instructions first (the limit by the memo, the price), the old two after
  for (const [o, units] of [[{ price: PRICE_FLOOR }, 30_000], [{ price: PRICE_FLOOR, commitment }, 60_000]]) { const m = Buffer.from(priced(o)), k = m[3], ix = 4 + 32 * k + 32; assert.deepEqual([m[2], k, Buffer.from(m.subarray(4 + 32 * (k - 1), 4 + 32 * k)).equals(Buffer.from(decode58(COMPUTE_BUDGET, 32))), m[ix], m[ix + 1], m[ix + 2], m[ix + 3], m[ix + 4], m.readUInt32LE(ix + 5), m[ix + 9], m[ix + 12], m.readBigUInt64LE(ix + 13)], [4, 7, true, 4, k - 1, 0, 5, 2, units, k - 1, 3, BigInt(PRICE_FLOOR)]); }
  assert.throws(() => priced({ price: PRICE_CAP + 1 }), /price/); assert.throws(() => priced({ price: 1.5 }), /price/); assert.deepEqual([priceOf(null), priceOf([]), priceOf([0, 0].map((f) => ({ prioritizationFee: f }))), priceOf([1e6, 2e6, 3e6, 4e6].map((f) => ({ prioritizationFee: f }))), priceOf([1e9].map((f) => ({ prioritizationFee: f })))], [PRICE_FLOOR, PRICE_FLOOR, PRICE_FLOOR, 4_800_000, PRICE_CAP]);
});

test('THE HOUSE PAYS THE FEE: with a fee\'s payer the deposit is the two-signer message the launch tool compiles, and its depositor is the signer whose USDC fell', () => {
  const fee = address(), payer = address(), source = address(), treasury = address(), blockhash = address(), data = Buffer.alloc(10); data[0] = 12; data.writeBigUInt64LE(10000000n, 1); data[9] = USDC_DECIMALS;
  const compiled = compile([{ program: MEMO, keys: [{ key: payer, signer: true, writable: false }], data: Buffer.from(DEPOSIT_TERMS) }, { program: TOKEN_PROGRAM, keys: [{ key: source, signer: false, writable: true }, { key: USDC_MINT, signer: false, writable: false }, { key: treasury, signer: false, writable: true }, { key: payer, signer: true, writable: false }], data }], fee, blockhash);
  assert.deepEqual([...depositMessage({ payer, fee, source, treasury, mint: USDC_MINT, amount: '10000000', blockhash })], [...compiled.message]); assert.throws(() => depositMessage({ payer, fee: payer, source, treasury, mint: USDC_MINT, amount: '1', blockhash }), /different/);
  const tx = parsedTx({ payer, owner: address(), treasury }); tx.transaction.message.accountKeys.unshift({ pubkey: fee, signer: true, writable: true }); for (const b of [...tx.meta.preTokenBalances, ...tx.meta.postTokenBalances]) b.accountIndex++;
  assert.equal(verifyDeposit(tx, { treasury }).payer, payer, 'the flask, not the fee\'s payer'); tx.transaction.message.accountKeys[1].signer = false; assert.throws(() => verifyDeposit(tx, { treasury }), /signer/, 'a fee paid for money its owner did not sign for is no deposit');
});
test('the key: its commitment is not its hash, so what the chain shows neither opens nor claims a tank; the unkeyed mark is no hash', async () => {
  const k = newTankKey();
  assert.match(k, /^sr_[A-Za-z0-9_-]{43}$/);
  assert.equal(await keyHashOf(k), createHash('sha256').update(k).digest('hex'));
  assert.equal(await keyCommitmentOf(k), createHash('sha256').update(`space-router:key:${k}`).digest('hex'));
  assert.notEqual(await keyCommitmentOf(k), await keyHashOf(k));
  assert.ok(isUnkeyed(unkeyedOf('st-abc'))); assert.ok(!isUnkeyed(await keyHashOf(k)));
  assert.equal(usdOf('30000000'), 30); assert.equal(usdOf(1n), 0.000001);
});

test('the door counts what moved: the treasury\'s rise, paid by the fee payer, whatever else the transaction carries', () => {
  const payer = address(), owner = address(), treasury = address(), c = 'a'.repeat(64);
  const d = verifyDeposit(parsedTx({ payer, owner, treasury, memo: `${DEPOSIT_TERMS}:${c}` }), { treasury });
  assert.deepEqual([d.payer, d.amount, d.usd, d.commitment, d.slot, d.paidAt], [payer, '30000000', 30, c, 41, 1_900_000_000_000]);
  // a wallet's priority fee and guard, an agent's own compile, no memo at all: counted all the same
  const extra = [{ program: 'compute-budget', programId: 'ComputeBudget111111111111111111111111111111', parsed: { type: 'setComputeUnitPrice' } }, { programId: 'L2TExMFKdjpN9kozasaurPirfHy9P8sbXoAN1qA3S95', data: 'x' }];
  assert.equal(verifyDeposit(parsedTx({ payer, owner, treasury, extra, memo: null }), { treasury }).commitment, null);
  assert.equal(verifyDeposit(parsedTx({ payer, owner, treasury, memo: 'gm' }), { treasury }).usd, 30, 'a memo of its own is no deposit memo');
  // the treasury's account made in the same transaction (no balance before)
  const fresh = parsedTx({ payer, owner, treasury }); fresh.meta.preTokenBalances = fresh.meta.preTokenBalances.filter((b) => b.accountIndex !== 2);
  fresh.meta.postTokenBalances[1].uiTokenAmount.amount = '30000000';
  assert.equal(verifyDeposit(fresh, { treasury }).usd, 30);
});

test('every refusal: no rise, another treasury or mint, paid by someone else, a failed or unsigned transaction, two memos, a bent memo', () => {
  const payer = address(), owner = address(), treasury = address();
  assert.throws(() => verifyDeposit(parsedTx({ payer, owner, treasury }), { treasury: address() }), /treasury/);
  assert.throws(() => verifyDeposit(parsedTx({ payer, owner, treasury, mint: address() }), { treasury }), /treasury/);
  assert.throws(() => verifyDeposit(parsedTx({ payer, owner, treasury, decimals: 9 }), { treasury }), /USDC/);
  assert.throws(() => verifyDeposit(parsedTx({ payer, owner, treasury, raised: 0 }), { treasury }), /treasury/);
  assert.throws(() => verifyDeposit(parsedTx({ payer, owner, treasury, paid: 1_000_000, raised: 30_000_000 }), { treasury }), /signer/, 'the treasury rose by more than its payer paid');
  assert.throws(() => verifyDeposit(parsedTx({ payer, owner, treasury, err: { InstructionError: [1, 'Custom'] } }), { treasury }), /finalized/);
  assert.throws(() => verifyDeposit(parsedTx({ payer, owner, treasury, signer: false }), { treasury }), /fee payer/);
  assert.throws(() => verifyDeposit(parsedTx({ payer, owner, treasury, memo: [DEPOSIT_TERMS, DEPOSIT_TERMS] }), { treasury }), /Two/);
  assert.throws(() => verifyDeposit(parsedTx({ payer, owner, treasury, memo: `${DEPOSIT_TERMS}:XYZ` }), { treasury }), /memo/);
  assert.throws(() => verifyDeposit({ ...parsedTx({ payer, owner, treasury }), blockTime: null }, { treasury }), /block time/);
  assert.throws(() => verifyDeposit(null, { treasury }), /finalized/);
});

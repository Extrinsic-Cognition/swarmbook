import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { validateSaleConfig, mintTier, assertDistinctSales, assertSaleEvidence, bidStoreKey,
  savedBids, createTierLoader, solAmount, readReservationBid, reservationAction } from '../app/dl-sale-tiers.js';

const bronzeInput = JSON.parse(await readFile(new URL('../app/whitelist.json', import.meta.url)));
const bronze = validateSaleConfig('bronze', bronzeInput);
// Synthetic test configuration only. This is never an advertised or live Gold sale.
const gold = validateSaleConfig('gold', { ...bronzeInput, tier: 'gold', root: '777', sale: '9', usdPerSlot: 1000,
  reserveLamports: '3000000000', depositLamports: '3000000000' });
const genesisHash = 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG';
const evidence = (cfg = gold) => ({ cfg, program: cfg.program, saleAddress: cfg.saleAccount, owner: cfg.program,
  executable: false, genesisHash, slot: BigInt(cfg.commitEndSlot) - 1n,
  head: { unit: BigInt(cfg.root), saleId: BigInt(cfg.sale), seatCount: cfg.slots, reserve: BigInt(cfg.reserveLamports),
    deposit: BigInt(cfg.depositLamports), commitEnd: BigInt(cfg.commitEndSlot), revealEnd: BigInt(cfg.revealEndSlot), settled: false } });

test('published prices are the human prices; Gold stays explicitly unconfigured', async () => {
  assert.equal(mintTier('bronze').usd, 10);
  assert.equal(mintTier('gold').usd, 1000);
  assert.equal(validateSaleConfig('gold', JSON.parse(await readFile(new URL('../app/whitelist-gold.json', import.meta.url)))), null);
  assert.throws(() => mintTier('platinum'));
  assert.throws(() => mintTier('__proto__'));
});

test('Gold cannot use or relabel the Bronze sale', () => {
  assert.throws(() => validateSaleConfig('gold', bronzeInput));
  assert.throws(() => validateSaleConfig('gold', { ...bronzeInput, usdPerSlot: 1000, tier: 'gold' }));
  assert.throws(() => assertDistinctSales(gold, gold));
  assert.doesNotThrow(() => assertDistinctSales(bronze, gold));
});

test('invalid prices, deposits, identities and endpoints cannot reach a sale', () => {
  for (const patch of [
    { usdPerSlot: 10 }, { depositLamports: '4000000000' }, { reserveLamports: '0', depositLamports: '0' },
    { root: '-1' }, { sale: '18446744073709551616' }, { slots: 151 }, { slots: 0 },
    { commitEndSlot: gold.revealEndSlot }, { rpc: 'http://api.devnet.solana.com' },
    { rpc: 'https://name:secret@example.test' }, { rpc: 'file:///tmp/sale' },
    { cluster: 'testnet' }, { program: 'other' }, { layout: 7 }, { status: 'whatever' }, { tier: 'bronze' },
  ]) assert.throws(() => validateSaleConfig('gold', { ...gold, ...patch }), JSON.stringify(patch));
});

test('every monetary and sale identity field is checked against chain evidence', () => {
  assert.equal(assertSaleEvidence(evidence()), 'commit');
  for (const field of ['unit', 'saleId', 'reserve', 'deposit', 'commitEnd', 'revealEnd']) {
    const e = evidence(); e.head[field] += 1n;
    assert.throws(() => assertSaleEvidence(e), field);
  }
  for (const [field, value] of [['owner', 'other'], ['program', 'other'], ['saleAddress', 'other'],
    ['genesisHash', 'wrong-chain'], ['executable', true]]) {
    assert.throws(() => assertSaleEvidence({ ...evidence(), [field]: value }), field);
  }
  const e = evidence(); e.head.seatCount -= 1;
  assert.throws(() => assertSaleEvidence(e));
});

test('commit, reveal, settlement and recovery boundaries use observed slots, never browser time', () => {
  const e = evidence();
  e.slot = e.head.commitEnd;
  assert.equal(assertSaleEvidence(e), 'reveal');
  e.slot = e.head.revealEnd;
  assert.equal(assertSaleEvidence(e), 'settle');
  e.head.settled = true; e.head.clearing = e.head.reserve;
  assert.equal(assertSaleEvidence(e), 'settled', 'settled sales must remain accessible for claims and refunds');
  e.head.clearing = e.head.deposit + 1n;
  assert.throws(() => assertSaleEvidence(e));
  e.head.clearing = e.head.reserve; e.slot = e.head.commitEnd - 1n;
  assert.throws(() => assertSaleEvidence(e), 'a settled sale cannot precede its reveal boundary');
});

test('escrow salts are isolated by cluster, program, root, sale and wallet', () => {
  const key = bidStoreKey(gold, 'buyer', 0);
  for (const field of ['cluster', 'program', 'root', 'sale']) {
    assert.notEqual(bidStoreKey({ ...gold, [field]: String(gold[field])+'x' }, 'buyer', 0), key);
  }
  assert.notEqual(bidStoreKey(gold, 'other-buyer', 0), key);
  assert.notEqual(bidStoreKey(gold, 'buyer', 1), key);
  assert.notEqual(bidStoreKey(bronze, 'buyer', 0), key);
});

test('only the original Bronze sale can recover its legacy salts', () => {
  const legacy = `dl-harmony-bid:${bronze.root}:buyer:3`;
  const record = JSON.stringify({ price: '88730000', salt: 'ab'.repeat(32), nonce: '15', root: gold.root });
  const store = new Map([[legacy, record]]), storage = { getItem: key => store.get(key) ?? null };
  assert.deepEqual(savedBids(storage, bronze, 'buyer'), [{ nonce: 3n, price: 88730000n, salt: 'ab'.repeat(32) }]);
  assert.deepEqual(savedBids(storage, gold, 'buyer'), []);
  assert.deepEqual(savedBids(storage, { ...bronze, cluster: 'mainnet-beta' }, 'buyer'), []);
  assert.deepEqual(savedBids(storage, { ...bronze, sale: '1' }, 'buyer'), []);
  store.set(bidStoreKey(gold, 'buyer', 2), record);
  assert.equal(savedBids(storage, gold, 'buyer')[0].nonce, 2n);
  store.set(bidStoreKey(gold, 'buyer', 2), '{"price":"5","salt":"not-a-salt"}');
  assert.deepEqual(savedBids(storage, gold, 'buyer'), []);
});

test('unpublished Gold requests only Gold configuration, never a fallback sale', async () => {
  const calls = [];
  const load = createTierLoader(async file => {
    calls.push(file);
    return { ok: true, json: async () => ({ schema: 'dl-harmony.whitelist.v1', tier: 'gold', status: 'unpublished', usdPerSlot: 1000 }) };
  });
  assert.equal(await load('gold'), null);
  assert.equal(await load('gold'), null);
  assert.deepEqual(calls, ['./whitelist-gold.json']);
  await assert.rejects(load('unknown'));
  assert.equal(calls.length, 1);
});

test('failed configuration can be retried but cannot become an implicit reservation', async () => {
  let count = 0;
  const load = createTierLoader(async () => { count++; return { ok: false }; });
  await assert.rejects(load('gold'));
  await assert.rejects(load('gold'));
  assert.equal(count, 2);
});

test('SOL review amounts preserve every lamport without floating point rounding', () => {
  assert.equal(solAmount('88730000'), '0.08873');
  assert.equal(solAmount('3000000000'), '3');
  assert.equal(solAmount('1'), '0.000000001');
  assert.equal(solAmount('18446744073709551615'), '18446744073.709551615');
});


function bidAccount(cfg = bronze) {
  const data = new Uint8Array(109), view = new DataView(data.buffer);
  data[0] = 7; data[1] = 8; data.set(new Uint8Array(32).fill(42), 18);
  for (const [at, value] of [[2, cfg.root], [10, cfg.sale], [50, 3], [90, cfg.depositLamports]]) view.setBigUint64(at, BigInt(value), true);
  return { owner: cfg.program, executable: false, data };
}
const parseBid = (account, cfg = bronze) => readReservationBid({ account, cfg, nonce: 3, bidderBytes: new Uint8Array(32).fill(42) });

test('on-chain bid recovery works with no saved salt and rejects other wallets/sales/amounts', () => {
  assert.equal(parseBid(null), null);
  const bid = parseBid(bidAccount());
  assert.equal(bid.nonce, 3n); assert.equal(bid.deposit, BigInt(bronze.depositLamports));
  assert.equal(bid.revealed, false); assert.equal(bid.done, false);
  for (const offset of [0, 1, 2, 10, 18, 50, 90]) {
    const account = bidAccount(); account.data[offset] ^= 1;
    assert.throws(() => parseBid(account), `mismatch at ${offset}`);
  }
  for (const patch of [{ owner: 'other' }, { executable: true }, { data: new Uint8Array(108) }]) {
    assert.throws(() => parseBid({ ...bidAccount(), ...patch }));
  }
  const invalid = bidAccount(); invalid.data[106] = 2;
  assert.throws(() => parseBid(invalid));
  assert.throws(() => parseBid(bidAccount(bronze), gold), 'Bronze bid cannot be recovered under Gold');
});

test('only well-formed reveal prices and boolean settlement markers enter recovery', () => {
  const account = bidAccount(), view = new DataView(account.data.buffer);
  view.setBigUint64(98, 1n, true);
  assert.throws(() => parseBid(account), 'unrevealed bid cannot have a price');
  account.data[106] = 1;
  assert.throws(() => parseBid(account), 'revealed price cannot be below reserve');
  view.setBigUint64(98, BigInt(bronze.depositLamports), true);
  assert.equal(parseBid(account).revealed, true);
  view.setBigUint64(98, BigInt(bronze.depositLamports) + 1n, true);
  assert.throws(() => parseBid(account), 'revealed price cannot exceed escrow');
  account.data[107] = 2;
  assert.throws(() => parseBid(account));
});

test('reservation recovery respects reveal, settlement, winner and dissolution rules', () => {
  const base = { bid: { revealed: false, done: false }, winner: false, frozen: false, secretMatches: false };
  const action = (phase, patch = {}) => reservationAction({ ...base, phase, ...patch }).action;
  assert.equal(action('commit'), null);
  assert.equal(action('reveal'), null, 'a missing secret must not send a bogus reveal');
  assert.equal(action('reveal', { secretMatches: true }), 'reveal');
  assert.equal(action('reveal', { secretMatches: true, bid: { revealed: true, done: false } }), null, 'skip previously revealed deposits');
  assert.equal(action('settle'), 'refund', 'unrevealed deposit can refund before settlement');
  assert.equal(action('settle', { bid: { revealed: true, done: false } }), null, 'revealed deposit must wait for settlement');
  assert.equal(action('settled'), 'refund');
  assert.equal(action('settled', { bid: { revealed: true, done: false } }), 'refund', 'loser is refundable');
  assert.equal(action('settled', { bid: { revealed: true, done: false }, winner: true }), 'claim');
  assert.equal(action('settled', { bid: { revealed: true, done: false }, winner: true, frozen: true }), 'refund', 'dissolved winner recovers full escrow');
  assert.equal(action('settled', { bid: { revealed: false, done: true } }), 'close', 'completed escrow can only recover rent');
  assert.equal(action('settled', { bid: { revealed: true, done: true }, winner: true }), 'close', 'claimed winner cannot charge again');
  assert.equal(action('settled', { bid: null }), null, 'local secret alone is not a deposit');
});

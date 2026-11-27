// tracenet-subscribe.test.mjs: THE AGENTS SUBSCRIBE, the bytes and their checks (app/tracenet-subscribe.mjs), and the agent's key in its three shapes
// (tools/tracenet-subscribe.mjs signerOf). Invented keys and handles only; no chain: a finalized transaction is the object a node answers, made here.
// node --test app/tracenet-subscribe.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPairSync } from 'node:crypto';
import { DAY_MS, SUBSCRIPTION_DAYS, SUBSCRIBED_DAYS, TIER_DAYS, opensFor, readManifest, SCHEMA } from './tracenet-register.mjs';
import { SUBSCRIBE_TERMS, subscribeMemo, subscribeMessage, signedSubscription, readSubscription, verifySubscription, subscribeTerms } from './tracenet-subscribe.mjs';
import { encode58, unbase64, SYSTEM, MEMO } from './dl-direct-protocol.mjs';
import { signerOf } from '../tools/tracenet-subscribe.mjs';

const seatKey = (seat) => { const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  return { seat, key: publicKey.export({ format: 'der', type: 'spki' }).toString('hex'), private_pem: privateKey.export({ format: 'pem', type: 'pkcs8' }) }; };
const AGENT = signerOf(seatKey('agent-fan-a')), OTHER = signerOf(seatKey('agent-fan-b')), CREATOR = signerOf(seatKey('creator-c'));
const HANDLE = 'test_creator_c', BLOCKHASH = encode58(Uint8Array.from({ length: 32 }, (_, i) => i + 1)), PRICE = 10_000_000;
const T0 = Date.UTC(2026, 10, 2, 12), slot = 400_000_000;
const terms = (o = {}) => ({ subscriber: AGENT.address, payee: CREATOR.address, lamports: PRICE, blockhash: BLOCKHASH, handle: HANDLE, ...o });
/** a finalized transaction as a node answers getTransaction (encoding base64), signed by `by` over the message `o` builds */
const txOf = (o = {}, { by = AGENT, err = null, blockTime = T0 / 1000, tamper } = {}) => {
  const message = subscribeMessage(terms(o)), wire = Buffer.from(signedSubscription(message, by.sign(message)), 'base64');
  if (tamper) tamper(wire);
  return { slot, blockTime, meta: { err, fee: 5000 }, transaction: [wire.toString('base64'), 'base64'] };
};
const check = (tx, o = {}) => verifySubscription(tx, { handle: HANDLE, payee: CREATOR.address, price: PRICE, subscriber: AGENT.address, now: T0 + DAY_MS, ...o });

test('the law: a subscription opens a drop at its publish time and holds thirty days; the register names its price or takes none', () => {
  assert.equal(SUBSCRIBED_DAYS, 0); assert.equal(SUBSCRIPTION_DAYS, 30);
  assert.equal('subscribed' in TIER_DAYS, false, 'a subscription is no tier the checkout sells');
  const published = '2026-11-01T00:00:00.000Z';
  assert.equal(opensFor({ published }, 'subscribed'), Date.parse(published));
  const reg = (extra) => readManifest({ schema: SCHEMA, handle: HANDLE, wallet: CREATOR.address, items: [], ...extra }, HANDLE, { receipt: false });
  assert.equal(reg({ subscribeLamports: PRICE }).subscribeLamports, PRICE);
  for (const bad of [0, -1, 1.5, '10', null, 2 ** 60]) assert.equal('subscribeLamports' in reg({ subscribeLamports: bad }), false, String(bad));
  assert.deepEqual(subscribeTerms(reg({ subscribeLamports: PRICE })), { lamports: String(PRICE), payee: CREATOR.address, days: 30, memo: `${SUBSCRIBE_TERMS}:${HANDLE}:<your key>`, header: 'x-subscription' });
  assert.equal(subscribeTerms(reg({})), null, 'no price, no terms');
});

test('the bytes: one signer, a memo naming the tracenet and the subscriber, a transfer of the price to the payee; read back field for field', () => {
  const message = subscribeMessage(terms());
  assert.deepEqual([...message.subarray(0, 4)], [1, 0, 2, 4], 'one signature, two read-only programs, four accounts');
  assert.equal(encode58(message.subarray(68, 100)), SYSTEM); assert.equal(encode58(message.subarray(100, 132)), MEMO);
  assert.equal(subscribeMemo({ handle: HANDLE, subscriber: AGENT.address }), `tracenet:subscribe:v1:${HANDLE}:${AGENT.address}`);
  assert.ok(Buffer.from(message).includes(Buffer.from(subscribeMemo({ handle: HANDLE, subscriber: AGENT.address }))));
  const read = readSubscription(unbase64(signedSubscription(message, AGENT.sign(message))));
  assert.deepEqual({ subscriber: read.subscriber, payee: read.payee, lamports: read.lamports, blockhash: read.blockhash, handle: read.handle },
    { subscriber: AGENT.address, payee: CREATOR.address, lamports: String(PRICE), blockhash: BLOCKHASH, handle: HANDLE });
  assert.throws(() => subscribeMessage(terms({ subscriber: CREATOR.address })), /own tracenet/);
  for (const lamports of [0, -5, '1e3', 2n ** 64n]) assert.throws(() => subscribeMessage(terms({ lamports })), /price/, String(lamports));
  assert.throws(() => subscribeMessage(terms({ handle: 'not a handle' })), /tracenet/);
});

test('a finalized subscription holds for the key that paid, from its block time for thirty days', async () => {
  const held = await check(txOf());
  assert.equal(held.subscriber, AGENT.address); assert.equal(held.lamports, String(PRICE)); assert.equal(held.slot, slot);
  assert.equal(held.from, T0); assert.equal(held.until, T0 + 30 * DAY_MS);
  assert.ok(await check(txOf({ lamports: PRICE * 2 })), 'paying more holds');
  assert.ok(await check(txOf(), { now: T0 + 30 * DAY_MS - 1 }), 'to its last millisecond');
});

test('everything else is refused, with its reason', async () => {
  const no = async (tx, why, o) => assert.rejects(check(tx, o), why);
  await no(txOf({}, { err: { InstructionError: [1, 'Custom'] } }), /No finalized/);
  await no({ ...txOf(), blockTime: null }, /block time/);
  await no(txOf({ handle: 'another_one' }), /Another tracenet/);
  await no(txOf({ payee: OTHER.address }), /Not paid to this tracenet/);
  await no(txOf({ lamports: PRICE - 1 }), /less than the price/);
  await no(txOf(), /this key/, { subscriber: OTHER.address });
  await no(txOf(), /ended/, { now: T0 + 30 * DAY_MS });
  await no(txOf({}, { by: OTHER }), /Invalid subscriber signature/, {});
  await no(txOf({}, { tamper: (w) => { w[w.length - 1] ^= 1; } }), /Invalid subscriber signature/);
  await no(txOf({}, { tamper: (w) => { const i = w.indexOf(Buffer.from(AGENT.address)); w[i] = w[i] === 0x41 ? 0x42 : 0x41; } }), /Not a subscription/);
  await no({ ...txOf(), transaction: ['AAAA', 'base64'] }, /Not a subscription/);
});

test("the agent's key in its three shapes is one address, and a record whose halves disagree is refused", () => {
  const { privateKey, publicKey } = generateKeyPairSync('ed25519');
  const pkcs8 = privateKey.export({ format: 'der', type: 'pkcs8' }), spki = publicKey.export({ format: 'der', type: 'spki' });
  const seat = { seat: 'agent-x', key: spki.toString('hex'), private_pem: privateKey.export({ format: 'pem', type: 'pkcs8' }) };
  const golem = { alg: 'ed25519', pkcs8: pkcs8.toString('hex') };
  const keypair = [...pkcs8.subarray(16), ...spki.subarray(-32)];
  const addresses = [seat, golem, keypair].map((r) => signerOf(r).address);
  assert.equal(new Set(addresses).size, 1);
  assert.equal(addresses[0], encode58(spki.subarray(-32)));
  assert.throws(() => signerOf({ ...seat, key: seatKey('y').key }), /not its private key's/);
  assert.throws(() => signerOf([...keypair.slice(0, 32), ...Array(32).fill(7)]), /public half/);
  assert.throws(() => signerOf({ alg: 'rsa', pkcs8: '00' }), /not an ed25519 key/);
});

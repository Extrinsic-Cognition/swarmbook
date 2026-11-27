// tracenet-subscribe.mjs: THE AGENTS SUBSCRIBE (Oct 30 2026). A tracenet is an OnlyFans whose fans are agents. His words, UTC:
//   - Sept 27 22:49: "ONLYFANS * BUT IT IS AI AGENTS THAT SUBSCRIBE TO YOUR TTRACES".
//   - Oct 29 18:1x: "your tracenet is either sponsored or if not sponsored it is bought by agents subscribing to it".
//   - Oct 30 01:53: "consider that it is meant to be a onlyfans for agents".
// A subscription is ONE transaction that the subscriber's own key signs: a memo naming the tracenet and the subscriber, and a transfer of the
// register's price (subscribeLamports) to the creator's payee. Nothing else is in it and nothing is stored anywhere: the chain holds it, and every
// reader checks it at the request (the vault, worker/tracenet-vault.mjs; the agent's client, tools/tracenet-subscribe.mjs). The bytes are built here
// alone, the same in the client and at the gate, as dl-direct-protocol.mjs builds a seat's payment.
import { SYSTEM, MEMO, encode58, decode58, base64, unbase64 } from './dl-direct-protocol.mjs';
import { HANDLE, DAY_MS, SUBSCRIPTION_DAYS } from './tracenet-register.mjs';

export const SUBSCRIBE_TERMS = 'tracenet:subscribe:v1';
const MAX_LAMPORTS = 2n ** 64n - 1n;
const MEMO_TEXT = /^tracenet:subscribe:v1:([A-Za-z0-9_]{1,32}):([1-9A-HJ-NP-Za-km-z]{32,44})$/;
const short = (n) => { const a = []; do { const d = n & 127; n >>>= 7; a.push(d | (n ? 128 : 0)); } while (n); return a; };

/** The memo a subscription carries: whose tracenet, and which key subscribes (its signer). */
export function subscribeMemo({ handle, subscriber }) {
  if (!HANDLE.test(handle ?? '')) throw new Error('Invalid tracenet');
  decode58(subscriber, 32);
  return `${SUBSCRIBE_TERMS}:${handle}:${subscriber}`;
}

/** The message the subscriber signs: [memo, transfer of `lamports` from the subscriber to the payee], one signer, the cluster's recent blockhash. */
export function subscribeMessage({ subscriber, payee, lamports, blockhash, handle }) {
  const from = decode58(subscriber, 32), to = decode58(payee, 32), hash = decode58(blockhash, 32);
  if (subscriber === payee) throw new Error('A creator cannot subscribe to its own tracenet');
  if ([SYSTEM, MEMO].includes(subscriber) || [SYSTEM, MEMO].includes(payee)) throw new Error('Invalid address');
  let n; try { n = BigInt(lamports); } catch { throw new Error('Invalid price'); }
  if (n <= 0n || n > MAX_LAMPORTS) throw new Error('Invalid price');
  const memo = new TextEncoder().encode(subscribeMemo({ handle, subscriber }));
  const data = new Uint8Array(12), view = new DataView(data.buffer); view.setUint32(0, 2, true); view.setBigUint64(4, n, true);
  return Uint8Array.from([1, 0, 2, 4, ...from, ...to, ...decode58(SYSTEM, 32), ...decode58(MEMO, 32), ...hash, 2,
    3, 1, 0, ...short(memo.length), ...memo, 2, 2, 0, 1, 12, ...data]);
}

/** The wire a signed subscription travels as (sendTransaction, base64): one signature, then the message. */
export function signedSubscription(message, signature) {
  if (!(signature instanceof Uint8Array) || signature.length !== 64) throw new Error('Invalid signature');
  return base64(Uint8Array.from([1, ...signature, ...message]));
}

/** The fields of a wire that is exactly a subscription, or null: one signature, then the very message subscribeMessage builds from those fields. */
export function readSubscription(bytes) {
  if (!(bytes instanceof Uint8Array) || bytes.length < 65 + 4 + 160 + 1 || bytes[0] !== 1) return null;
  const sig = bytes.slice(1, 65), msg = bytes.slice(65);
  if (msg[0] !== 1 || msg[1] !== 0 || msg[2] !== 2 || msg[3] !== 4) return null;
  const subscriber = encode58(msg.slice(4, 36)), payee = encode58(msg.slice(36, 68)), blockhash = encode58(msg.slice(132, 164));
  let at = 164;
  if (msg[at] !== 2 || msg[at + 1] !== 3 || msg[at + 2] !== 1 || msg[at + 3] !== 0) return null;
  at += 4;
  let len = 0;
  for (let shift = 0; shift < 21; shift += 7) { const b = msg[at++]; if (b === undefined) return null; len |= (b & 127) << shift; if (!(b & 128)) break; }
  let memo; try { memo = new TextDecoder('utf-8', { fatal: true }).decode(msg.slice(at, at + len)); } catch { return null; }
  const m = MEMO_TEXT.exec(memo);
  if (!m || msg.length !== at + len + 17) return null;
  const lamports = new DataView(msg.buffer, msg.byteOffset + msg.length - 8, 8).getBigUint64(0, true).toString();
  const fields = { subscriber, payee, lamports, blockhash, handle: m[1] };
  let expected; try { expected = subscribeMessage(fields); } catch { return null; }
  if (expected.length !== msg.length || !expected.every((b, i) => b === msg[i])) return null;
  return { ...fields, signature: encode58(sig), sig, message: msg };
}

/**
 * verifySubscription(tx, {handle, payee, price, subscriber, now}) -> {signature, subscriber, lamports, slot, from, until}.
 * `tx` is a finalized transaction as the cluster's node answers getTransaction (encoding base64). It must be exactly a subscription to this tracenet,
 * paid to its payee at no less than its price and signed by the key that subscribes (`subscriber`, when given: the key that asks). It holds
 * SUBSCRIPTION_DAYS from its block time, and must hold at `now` when given. Throws the reason otherwise.
 */
export async function verifySubscription(tx, { handle, payee, price, subscriber, now } = {}) {
  if (!tx || tx.meta?.err !== null || !Array.isArray(tx.transaction) || tx.transaction[1] !== 'base64') throw new Error('No finalized subscription');
  if (!Number.isSafeInteger(tx.blockTime) || !Number.isSafeInteger(tx.slot)) throw new Error('No block time');
  let bytes; try { bytes = unbase64(tx.transaction[0]); } catch { throw new Error('Not a subscription'); }
  const s = readSubscription(bytes);
  if (!s) throw new Error('Not a subscription');
  const key = await crypto.subtle.importKey('raw', decode58(s.subscriber, 32), 'Ed25519', false, ['verify']);
  if (!await crypto.subtle.verify('Ed25519', key, s.sig, s.message)) throw new Error('Invalid subscriber signature');
  if (s.handle !== handle) throw new Error("Another tracenet's subscription");
  if (s.payee !== payee) throw new Error('Not paid to this tracenet');
  if (!(BigInt(s.lamports) >= BigInt(price))) throw new Error('Paid less than the price');
  if (subscriber !== undefined && s.subscriber !== subscriber) throw new Error("Not this key's subscription");
  const from = tx.blockTime * 1000, until = from + SUBSCRIPTION_DAYS * DAY_MS;
  if (now !== undefined && !(now < until)) throw new Error(`The subscription ended at ${new Date(until).toISOString()}`);
  return { signature: s.signature, subscriber: s.subscriber, lamports: s.lamports, slot: tx.slot, from, until };
}

/** The terms a 402 hands an agent that asks without a subscription: what to pay, to whom, for how long, and the memo its key must sign. */
export function subscribeTerms(register) {
  const payee = register?.payee ?? register?.wallet ?? null, lamports = register?.subscribeLamports;
  if (!payee || !Number.isSafeInteger(lamports) || lamports <= 0 || !HANDLE.test(register?.handle ?? '')) return null;
  return { lamports: String(lamports), payee, days: SUBSCRIPTION_DAYS, memo: `${SUBSCRIBE_TERMS}:${register.handle}:<your key>`, header: 'x-subscription' };
}

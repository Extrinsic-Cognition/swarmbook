// space-router-deposit.mjs: PAY A TANK (Oct 30 2026). A buyer's USDC fills their own Space Router tank. His words, UTC:
//   - 12:30:29, his press "Pay a tank" on the seat's button "a buyer's USDC fills their own Space Router tank (the paused $30 starter kit)".
//   - 12:54:22: "we should formulate the thing as "Pre-Deposits for the Space Router available" ... we need to take seriously the business of the router".
//   - 12:57:35: "1. the first one is an auction sale basically 10% to whoever throws money into it 2. the second one is as rebate so $WARM is given out
//     to reward space router users with rebate".
// A DEPOSIT IS WHAT THE CHAIN SAYS MOVED, never a shape of bytes: a finalized transaction, no error, that raised the treasury's USDC account by an amount
// its fee payer's own USDC accounts paid. A wallet may add its own instructions (a priority fee, a guard) and an agent may compile the transfer its own
// way: the money is counted all the same, so a payment that arrived is never refused for its shape (the review of Oct 30 13:4x).
// THE KEY is claimed by its preimage, never by a hash anyone can read: the deposit's memo may carry `space-router:deposit:v1:<commitment>`, the sha256 of
// `space-router:key:` and a key the page made; the door counts such a deposit only when it is brought the key itself, and keeps only the key's sha256.
// Nobody who reads the chain can claim the tank first: the commitment is not the key's hash, and the key is never on chain.
// Fuel paid in before the opening (SPACE_ROUTER_OPENED_AT) waits: a pre-deposit. From the opening it is spent, and every burn mines $WARM back.
import { MEMO, decode58 } from './dl-direct-protocol.mjs';
import { sha256Hex } from './dl-society-codes.mjs';

export const DEPOSIT_TERMS = 'space-router:deposit:v1';
export const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';   // mainnet's USDC; a devnet rehearsal must name its stand-in (SPACE_ROUTER_USDC_MINT)
export const USDC_DECIMALS = 6;
/* THE POUR PAYS TO LAND (Nov 20 2026, his "The priority fee" to "Which build first?"): a deposit the house sends asks for its compute and pays a price per unit
   of it, so it lands when Solana is busy. Measured on mainnet by simulation that day: the plain deposit 23,323 units (the memo 23,218 of them, the
   transfer 105), one whose memo names a key 46,218. The price is the door's (worker/space-router-deposit.mjs, its node's recent fees, kept between a floor
   and a cap, micro-lamports a unit); the house pays it: at the cap, 0.0006 SOL a deposit. Asked with no price, the message is the old one, byte for byte. */
export const COMPUTE_BUDGET = 'ComputeBudget111111111111111111111111111111', PRICE_FLOOR = 1_000_000, PRICE_CAP = 20_000_000;
export const depositUnits = (commitment = null) => (commitment === null ? 30_000 : 60_000);
/** The price a deposit pays a unit: the 75th of the recent fees a node says (getRecentPrioritizationFees), a fifth above it, between the floor and the cap */
export const priceOf = (fees) => { const v = (Array.isArray(fees) ? fees : []).map((f) => Number(f?.prioritizationFee)).filter(Number.isFinite).sort((a, b) => a - b); return Math.min(PRICE_CAP, Math.max(PRICE_FLOOR, Math.ceil((v[Math.floor(v.length * 0.75)] ?? 0) * 1.2))); };
const MEMO_PROGRAMS = new Set([MEMO, 'Memo1UhkJRfHyvLMcVucJwxXeuD728EqVDDwQDxFMNo']);
const MEMO_TEXT = /^space-router:deposit:v1(?::([0-9a-f]{64}))?$/;
const MAX_AMOUNT = 2n ** 64n - 1n;
const short = (n) => { const a = []; do { const d = n & 127; n >>>= 7; a.push(d | (n ? 128 : 0)); } while (n); return a; };
const b64u = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

/** A tank key, made where it is used (the page, or the link door) and never kept: `sr_` and 32 random bytes. */
export const newTankKey = () => `sr_${b64u(crypto.getRandomValues(new Uint8Array(32)))}`;
/** What a tank keeps of its key: the sha256 of the key's text, hex. */
export const keyHashOf = (key) => sha256Hex(key);
/** What a deposit's memo carries for a key: a commitment to it that is not its hash, so the chain shows nothing that opens or claims the tank. */
export const keyCommitmentOf = (key) => sha256Hex(`space-router:key:${key}`);
/** A tank no key opens yet keeps this in key_sha256 (NOT NULL UNIQUE): never a 64-hex digest, so no key's hash equals it. */
export const unkeyedOf = (tank) => `unkeyed:${tank}`;
export const isUnkeyed = (keySha256) => typeof keySha256 === 'string' && keySha256.startsWith('unkeyed:');
/** The memo a deposit carries: the terms, and the key's commitment when the deposit names a key. */
export function depositMemo(commitment = null) {
  if (commitment !== null && !/^[0-9a-f]{64}$/.test(commitment)) throw new Error('Invalid key commitment');
  return commitment === null ? DEPOSIT_TERMS : `${DEPOSIT_TERMS}:${commitment}`;
}
/** Dollars of a USDC amount in base units. */
export const usdOf = (amount) => Number(BigInt(amount)) / 10 ** USDC_DECIMALS;

/**
 * The message a page asks the payer to sign: [memo (the payer its signer), transferChecked of `amount` base units of `mint` from `source` to `treasury`,
 * the payer the owner], one signer, a recent blockhash; legacy, its accounts payer, source, treasury, memo, mint, token. Any other shape that moves the
 * money the same way counts the same at the door: this is the page's road, not the door's rule.
 */
export function depositMessage({ payer, source, treasury, mint, amount, blockhash, commitment = null, fee = null, price = null }) {   /* fee: THE HOUSE PAYS THE FEE (Nov 11 2026, THE FLASK BEGINS AS AN ADDRESS): with it the message has two signers, the fee's payer first and the payer of the USDC second, signing only as the owner of its account, so an address that holds USDC and no SOL can deposit */
  const keys = [payer, source, treasury, mint, ...(fee === null ? [] : [fee])];
  keys.forEach((k) => decode58(k, 32));
  if (new Set(keys).size !== keys.length) throw new Error('The payer, its account, the treasury and the mint are four different addresses');
  if (keys.some((k) => k === MEMO || k === TOKEN_PROGRAM || k === COMPUTE_BUDGET)) throw new Error('Invalid address');
  if (price !== null && !(Number.isSafeInteger(price) && price >= 0 && price <= PRICE_CAP)) throw new Error('Invalid price');
  let n; try { n = BigInt(amount); } catch { throw new Error('Invalid amount'); }
  if (n <= 0n || n > MAX_AMOUNT) throw new Error('Invalid amount');
  const memo = new TextEncoder().encode(depositMemo(commitment));
  const data = new Uint8Array(10), view = new DataView(data.buffer); data[0] = 12; view.setBigUint64(1, n, true); data[9] = USDC_DECIMALS;
  const o = fee === null ? 0 : 1, k = [...(o ? [fee] : []), payer, source, treasury, MEMO, mint, TOKEN_PROGRAM, ...(price === null ? [] : [COMPUTE_BUDGET])], c = 6 + o, n2 = new DataView(new ArrayBuffer(13));   // o: the fee's payer before the payer; c: the compute budget's index
  n2.setUint32(0, depositUnits(commitment), true); n2.setBigUint64(4, BigInt(price ?? 0), true); const units = new Uint8Array(n2.buffer, 0, 4), per = new Uint8Array(n2.buffer, 4, 8);
  return Uint8Array.from([1 + o, o, k.length - 3 - o, k.length, ...k.flatMap((x) => [...decode58(x, 32)]), ...decode58(blockhash, 32), price === null ? 2 : 4, ...(price === null ? [] : [c, 0, 5, 2, ...units, c, 0, 9, 3, ...per]), 3 + o, 1, o, ...short(memo.length), ...memo, 5 + o, 4, 1 + o, 4 + o, 2 + o, o, 10, ...data]);
}
/** The wire of a deposit its one signer signed (sendTransaction, base64). */
export const relayedDeposit = (message, feeSignature, signature) => btoa(String.fromCharCode(2, ...feeSignature, ...signature, ...message));   /* the wire of a deposit whose fee another paid: both signatures, the fee's first */
export function signedDeposit(message, signature) {
  if (!(signature instanceof Uint8Array) || signature.length !== 64) throw new Error('Invalid signature');
  return btoa(String.fromCharCode(1, ...signature, ...message));
}

const amountOf = (b) => { try { return b?.uiTokenAmount?.decimals === USDC_DECIMALS ? BigInt(b.uiTokenAmount.amount) : null; } catch { return null; } };
/**
 * verifyDeposit(tx, {mint, treasury}) -> {signature, payer, amount, usd, commitment, slot, paidAt}.
 * `tx` is a finalized transaction as a node answers getTransaction with encoding jsonParsed. It holds when it has no error, its fee payer signed it,
 * the treasury's account of `mint` rose, and the fee payer's own accounts of `mint` fell by at least that much. `commitment` is its memo's key commitment,
 * or null; two deposit memos, or one that is not the terms, are refused. Throws the reason otherwise.
 */
export function verifyDeposit(tx, { mint = USDC_MINT, treasury } = {}) {
  const message = tx?.transaction?.message, keys = message?.accountKeys;
  if (!tx || tx.meta?.err !== null || !Array.isArray(keys) || !keys.length) throw new Error('No finalized deposit');
  if (!Number.isSafeInteger(tx.blockTime) || !Number.isSafeInteger(tx.slot)) throw new Error('No block time');
  const signers = keys.filter((k) => k?.signer && typeof k.pubkey === 'string').map((k) => k.pubkey), signature = tx.transaction.signatures?.[0];
  if (!keys[0]?.signer || !signers.length || typeof signature !== 'string') throw new Error('No fee payer');
  const pre = tx.meta.preTokenBalances || [], post = tx.meta.postTokenBalances || [];
  const sum = (list, pick) => list.filter((b) => b.mint === mint && pick(b)).reduce((s, b) => { const a = amountOf(b); if (a === null) throw new Error('Not this door\'s USDC'); return s + a; }, 0n);
  const at = keys.findIndex((k) => k?.pubkey === treasury);
  if (at < 0) throw new Error('Not paid to Space Router\'s treasury');
  const raised = sum(post, (b) => b.accountIndex === at) - sum(pre, (b) => b.accountIndex === at);
  if (!(raised > 0n)) throw new Error('Not paid to Space Router\'s treasury');
  const paidBy = (p) => sum(pre, (b) => b.owner === p && b.accountIndex !== at) - sum(post, (b) => b.owner === p && b.accountIndex !== at), payer = signers.find((p) => paidBy(p) >= raised);   /* the depositor is the signer whose own USDC fell: the fee's payer, or the one that signed beside it (THE HOUSE PAYS THE FEE) */
  if (!payer) throw new Error('Not paid by its signer');
  const memos = (message.instructions || []).filter((i) => MEMO_PROGRAMS.has(i?.programId) && typeof i.parsed === 'string' && i.parsed.startsWith(DEPOSIT_TERMS));
  if (memos.length > 1) throw new Error('Two deposit memos');
  const m = memos.length ? MEMO_TEXT.exec(memos[0].parsed) : null;
  if (memos.length && !m) throw new Error('Not a deposit memo');
  return { signature, payer, amount: raised.toString(), usd: usdOf(raised), commitment: m?.[1] ?? null, slot: tx.slot, paidAt: tx.blockTime * 1000 };
}

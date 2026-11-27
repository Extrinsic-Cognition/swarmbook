// chain.mjs · THE $WARM LAUNCH, its words on Solana (Oct 30 2026). Every instruction the launch sends, built here byte for byte, with no
// dependency: the System, SPL Token, Associated Token, Metaplex Token Metadata and Compute Budget programs, and Meteora's DLMM (lb_clmm 0.12.0,
// its Anchor interface read from @meteora-ag/dlmm 1.9.14's bundled IDL: an 8-byte discriminator, then borsh). The addresses and the curve test are
// the stake pool seat's (tools/embertide-mesh/pool/pool-genesis.mjs), held there to @solana/web3.js's own derivations; the DLMM addresses and
// instruction bytes are held to the SDK's in warm-launch.test.mjs. Pure: no key, no network, no file.
import { base58Of, createWithSeed, findPda } from '../embertide-mesh/pool/pool-genesis.mjs';
import { base58Bytes } from '../embertide-mesh/pool/pool-crank.mjs';

export const P = Object.freeze({
  system: '11111111111111111111111111111111',
  token: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  ata: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
  metadata: 'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s',
  compute: 'ComputeBudget111111111111111111111111111111',
  memo: 'MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr',
  rent: 'SysvarRent111111111111111111111111111111111',
  dlmm: 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo',     // the same program on devnet and mainnet (the SDK's LBCLMM_PROGRAM_IDS)
  wsol: 'So11111111111111111111111111111111111111112',
  ilmBase: 'MFGQxwAmB91SwuYX36okv2Qmdc9aMuHTwWGUrp4AtB1',  // the base of a customizable permissionless pair (the SDK's ILM_BASE)
});
export const MAX_TX = 1232;
export const BINS_PER_ARRAY = 70;                             // MAX_BIN_PER_ARRAY, and DEFAULT_BIN_PER_POSITION: one position is one bin array
export const SIZES = Object.freeze({ mint: 82, tokenAccount: 165, binArray: 10136, position: 8120, lbPair: 904 });

// ---- bytes ----
export function key(a) {
  const b = typeof a === 'string' ? base58Bytes(a) : a;
  if (!b || b.length !== 32) throw new Error(`not an address: ${typeof a === 'string' ? a : '(bytes)'}`);
  return Buffer.from(b);
}
export const addr = (a) => (typeof a === 'string' ? (key(a), a) : base58Of(a));
const u8 = (n) => Buffer.of(n);
const u16 = (n) => { const b = Buffer.alloc(2); b.writeUInt16LE(n); return b; };
const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n); return b; };
const i32 = (n) => { const b = Buffer.alloc(4); b.writeInt32LE(n); return b; };
const u64 = (n) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(n)); return b; };
const i64 = (n) => { const b = Buffer.alloc(8); b.writeBigInt64LE(BigInt(n)); return b; };
const str = (s) => { const b = Buffer.from(s, 'utf8'); return Buffer.concat([u32(b.length), b]); };
const meta = (k, signer, writable) => ({ key: addr(k), signer, writable });
const ix = (program, keys, data) => ({ program, keys, data: Buffer.from(data) });

// ---- addresses ----
const cmp = (a, b) => Buffer.compare(key(a), key(b));
export const ata = (owner, mint, tokenProgram = P.token) => base58Of(findPda([key(owner), key(tokenProgram), key(mint)], P.ata)[0]);
export const withSeed = (base, seed, owner) => base58Of(createWithSeed(key(base), seed, owner));
export const metadataAddress = (mint) => base58Of(findPda([Buffer.from('metadata'), key(P.metadata), key(mint)], P.metadata)[0]);

/** A customizable permissionless DLMM pair is one per pair of mints: [ILM base, the smaller mint, the larger mint]. */
export function pairAddresses(mintX, mintY) {
  const [lo, hi] = cmp(mintX, mintY) < 0 ? [mintX, mintY] : [mintY, mintX];
  const lbPair = base58Of(findPda([key(P.ilmBase), key(lo), key(hi)], P.dlmm)[0]);
  const at = (...s) => base58Of(findPda(s, P.dlmm)[0]);
  return {
    lbPair, mintX, mintY,
    reserveX: at(key(lbPair), key(mintX)), reserveY: at(key(lbPair), key(mintY)),
    oracle: at(Buffer.from('oracle'), key(lbPair)), bitmap: at(Buffer.from('bitmap'), key(lbPair)),
    eventAuthority: at(Buffer.from('__event_authority')),
  };
}
export const binArrayIndex = (binId) => Math.floor(binId / BINS_PER_ARRAY);
export const binArrayAddress = (lbPair, index) => base58Of(findPda([Buffer.from('bin_array'), key(lbPair), i64(index)], P.dlmm)[0]);
/** A position made from a base that signs (here his own key), covering one bin array exactly: lower = 70 × index, width 70. */
export const positionAddress = (lbPair, base, lower, width = BINS_PER_ARRAY) =>
  base58Of(findPda([Buffer.from('position'), key(lbPair), key(base), i32(lower), i32(width)], P.dlmm)[0]);

// ---- System, Compute Budget ----
export const transfer = (from, to, lamports) => ix(P.system, [meta(from, true, true), meta(to, false, true)], Buffer.concat([u32(2), u64(lamports)]));
export const createAccountWithSeed = (from, to, seed, lamports, space, owner) => ix(P.system, [meta(from, true, true), meta(to, false, true)],
  Buffer.concat([u32(3), key(from), u64(Buffer.byteLength(seed)), Buffer.from(seed), u64(lamports), u64(space), key(owner)]));
export const computeLimit = (units) => ix(P.compute, [], Buffer.concat([u8(2), u32(units)]));
export const computePrice = (microLamports) => ix(P.compute, [], Buffer.concat([u8(3), u64(microLamports)]));

// ---- SPL Token, Associated Token ----
export const initializeMint2 = (mint, decimals, mintAuthority) => ix(P.token, [meta(mint, false, true)],
  Buffer.concat([u8(20), u8(decimals), key(mintAuthority), u8(0)]));      // no freeze authority, ever: there is none to revoke
export const mintTo = (mint, dest, authority, amount) => ix(P.token, [meta(mint, false, true), meta(dest, false, true), meta(authority, true, false)],
  Buffer.concat([u8(7), u64(amount)]));
export const transferChecked = (source, mint, dest, owner, amount, decimals) => ix(P.token, [meta(source, false, true), meta(mint, false, false), meta(dest, false, true), meta(owner, true, false)], Buffer.concat([u8(12), u64(amount), u8(decimals)]));   // THE GENESIS SHARES THE TENTH
export const revokeMintAuthority = (mint, authority) => ix(P.token, [meta(mint, false, true), meta(authority, true, false)],
  Buffer.concat([u8(6), u8(0), u8(0)]));                                   // SetAuthority(MintTokens, None)
export const syncNative = (account) => ix(P.token, [meta(account, false, true)], u8(17));
export const closeAccount = (account, dest, owner) => ix(P.token, [meta(account, false, true), meta(dest, false, true), meta(owner, true, false)], u8(9));
export const createAtaIdempotent = (payer, owner, mint, tokenProgram = P.token) => ix(P.ata, [meta(payer, true, true), meta(ata(owner, mint, tokenProgram), false, true),
  meta(owner, false, false), meta(mint, false, false), meta(P.system, false, false), meta(tokenProgram, false, false)], u8(1));

// ---- Metaplex Token Metadata: CreateMetadataAccountV3 (33), DataV2 with no creators, collection or uses ----
export function createMetadataV3({ mint, authority, name, symbol, uri, isMutable }) {
  if (Buffer.byteLength(name) > 32 || Buffer.byteLength(symbol) > 10 || Buffer.byteLength(uri) > 200) throw new Error('metadata: name ≤ 32, symbol ≤ 10, uri ≤ 200 bytes');
  return ix(P.metadata, [meta(metadataAddress(mint), false, true), meta(mint, false, false), meta(authority, true, false), meta(authority, true, true),
    meta(authority, true, false), meta(P.system, false, false)],
  Buffer.concat([u8(33), str(name), str(symbol), str(uri), u16(0), u8(0), u8(0), u8(0), u8(isMutable ? 1 : 0), u8(0)]));
}

// ---- Meteora DLMM ----
// The discriminators as the IDL states them (sha256("global:<name>")[0..8], held to that in the test).
export const DISC = Object.freeze({
  initialize_customizable_permissionless_lb_pair2: [243, 73, 129, 126, 51, 19, 241, 107],
  initialize_bin_array: [35, 86, 19, 185, 78, 212, 75, 211],
  initialize_position_pda: [46, 82, 125, 146, 85, 141, 228, 153],
  add_liquidity_one_side_precise2: [33, 51, 163, 201, 117, 98, 125, 231],
  remove_liquidity_by_range2: [204, 2, 195, 145, 53, 145, 145, 205],
  swap2: [65, 75, 63, 76, 235, 91, 91, 136],
  claim_fee2: [112, 191, 101, 171, 28, 144, 127, 187],
  go_to_a_bin: [146, 72, 174, 224, 40, 253, 84, 174],
});
const disc = (name) => Buffer.from(DISC[name]);
const NONE_ACCOUNT = P.dlmm;                                              // Anchor's absent optional account: the program's own id, read-only
// RemainingAccountsInfo: the transfer-hook slices, empty for a classic SPL mint (vec length, then [type, length] each)
const slices = (...types) => Buffer.concat([u32(types.length), ...types.map((t) => Buffer.of(t, 0))]);
const HOOK_X = 0, HOOK_Y = 1;

/** base fee = base_factor × bin_step × 10 × 10^power, over 1e9 (the SDK's getBaseFee and computeBaseFactorFromFeeBps). */
export function baseFactorFor(binStep, feeBps) {
  let f = (feeBps * 10_000) / binStep, power = 0;
  if (!Number.isInteger(f)) throw new Error(`no exact base factor for ${feeBps} bps at bin step ${binStep}`);
  while (f > 65_535) { if (f % 10) throw new Error('base factor overflows u16'); f /= 10; power++; }
  if (f < 1) throw new Error('base factor underflows');
  return { baseFactor: f, power };
}

export function initializePair({ pair, funder, userTokenX, userTokenY, activeId, binStep, feeBps, activationPoint = null }) {
  const { baseFactor, power } = baseFactorFor(binStep, feeBps);
  const data = Buffer.concat([disc('initialize_customizable_permissionless_lb_pair2'), i32(activeId), u16(binStep), u16(baseFactor),
    u8(activationPoint === null ? 0 : 1),                                  // activation by slot (0) when it opens now, by unix time (1) at a moment
    u8(0),                                                                 // no alpha vault
    activationPoint === null ? u8(0) : Buffer.concat([u8(1), u64(activationPoint)]),
    u8(0),                                                                 // the creator cannot switch the pool off
    u8(power), u8(0), u8(0),                                               // base fee power; function type and fee mode as Meteora's CLI sends them
    Buffer.alloc(60)]);
  return ix(P.dlmm, [meta(pair.lbPair, false, true), meta(NONE_ACCOUNT, false, false), meta(pair.mintX, false, false), meta(pair.mintY, false, false),
    meta(pair.reserveX, false, true), meta(pair.reserveY, false, true), meta(pair.oracle, false, true), meta(userTokenX, false, false),
    meta(funder, true, true), meta(NONE_ACCOUNT, false, false), meta(NONE_ACCOUNT, false, false), meta(P.token, false, false), meta(P.token, false, false),
    meta(P.system, false, false), meta(userTokenY, false, false), meta(pair.eventAuthority, false, false), meta(P.dlmm, false, false)], data);
}

export const initializeBinArray = ({ pair, funder, index }) => ix(P.dlmm,
  [meta(pair.lbPair, false, false), meta(binArrayAddress(pair.lbPair, index), false, true), meta(funder, true, true), meta(P.system, false, false)],
  Buffer.concat([disc('initialize_bin_array'), i64(index)]));

/** One position over bin array `index`, his key its payer, base and owner: the only signature it needs is his. */
export function initializePosition({ pair, owner, index }) {
  const lower = index * BINS_PER_ARRAY;
  return ix(P.dlmm, [meta(owner, true, true), meta(owner, true, false), meta(positionAddress(pair.lbPair, owner, lower), false, true),
    meta(pair.lbPair, false, false), meta(owner, true, false), meta(P.system, false, false), meta(P.rent, false, false),
    meta(pair.eventAuthority, false, false), meta(P.dlmm, false, false)],
  Buffer.concat([disc('initialize_position_pda'), i32(lower), i32(BINS_PER_ARRAY)]));
}

/** SWARM alone into named bins of one position, exact amounts: each bin's amount is `amount × multiplier` base units (the u32 compression). */
export function addSingleSided({ pair, owner, index, userToken, bins, multiplier, maxAmount }) {
  const lower = index * BINS_PER_ARRAY;
  for (const b of bins) if (binArrayIndex(b.binId) !== index) throw new Error(`bin ${b.binId} is not in position ${index}`);
  const data = Buffer.concat([disc('add_liquidity_one_side_precise2'), u32(bins.length), ...bins.map((b) => Buffer.concat([i32(b.binId), u32(b.amount)])),
    u64(multiplier), u64(maxAmount), slices(HOOK_X)]);
  return ix(P.dlmm, [meta(positionAddress(pair.lbPair, owner, lower), false, true), meta(pair.lbPair, false, true), meta(NONE_ACCOUNT, false, false),
    meta(userToken, false, true), meta(pair.reserveX, false, true), meta(pair.mintX, false, false), meta(owner, true, false), meta(P.token, false, false),
    meta(pair.eventAuthority, false, false), meta(P.dlmm, false, false), meta(binArrayAddress(pair.lbPair, index), false, true)], data);
}

/** Take `bps` of one position's shares out of bins [from, to]; what comes out lands in the two token accounts named. */
export function removeRange({ pair, owner, index, from, to, bps, userTokenX, userTokenY }) {
  const lower = index * BINS_PER_ARRAY;
  return ix(P.dlmm, [meta(positionAddress(pair.lbPair, owner, lower), false, true), meta(pair.lbPair, false, true), meta(NONE_ACCOUNT, false, false),
    meta(userTokenX, false, true), meta(userTokenY, false, true), meta(pair.reserveX, false, true), meta(pair.reserveY, false, true),
    meta(pair.mintX, false, false), meta(pair.mintY, false, false), meta(owner, true, false), meta(P.token, false, false), meta(P.token, false, false),
    meta(P.memo, false, false), meta(pair.eventAuthority, false, false), meta(P.dlmm, false, false), meta(binArrayAddress(pair.lbPair, index), false, true)],
  Buffer.concat([disc('remove_liquidity_by_range2'), i32(from), i32(to), u16(bps), slices(HOOK_X, HOOK_Y)]));
}

/** The position's earned swap fees, both sides, from bins [from, to] of one position, into the two token accounts named. */
export function claimFees({ pair, owner, index, from, to, userTokenX, userTokenY }) {
  const lower = index * BINS_PER_ARRAY;
  return ix(P.dlmm, [meta(pair.lbPair, false, true), meta(positionAddress(pair.lbPair, owner, lower), false, true), meta(owner, true, false),
    meta(pair.reserveX, false, true), meta(pair.reserveY, false, true), meta(userTokenX, false, true), meta(userTokenY, false, true),
    meta(pair.mintX, false, false), meta(pair.mintY, false, false), meta(P.token, false, false), meta(P.token, false, false), meta(P.memo, false, false),
    meta(pair.eventAuthority, false, false), meta(P.dlmm, false, false), meta(binArrayAddress(pair.lbPair, index), false, true)],
  Buffer.concat([disc('claim_fee2'), i32(from), i32(to), slices(HOOK_X, HOOK_Y)]));
}

/** A swap: amountIn of one side for at least minOut of the other, through the bin arrays named (in the price's direction). */
export function swap({ pair, user, userIn, userOut, amountIn, minOut, binArrays }) {
  return ix(P.dlmm, [meta(pair.lbPair, false, true), meta(NONE_ACCOUNT, false, false), meta(pair.reserveX, false, true), meta(pair.reserveY, false, true),
    meta(userIn, false, true), meta(userOut, false, true), meta(pair.mintX, false, false), meta(pair.mintY, false, false), meta(pair.oracle, false, true),
    meta(NONE_ACCOUNT, false, false), meta(user, true, false), meta(P.token, false, false), meta(P.token, false, false), meta(P.memo, false, false),
    meta(pair.eventAuthority, false, false), meta(P.dlmm, false, false), ...binArrays.map((b) => meta(b, false, true))],
  Buffer.concat([disc('swap2'), u64(amountIn), u64(minOut), slices(HOOK_X, HOOK_Y)]));
}

// ---- the legacy message: the payer first, then signers writable before read-only, then the rest the same way ----
const hash32 = (h) => (typeof h === 'string' ? key(h) : Buffer.from(h));
export function compile(instructions, payer, blockhash = Buffer.alloc(32)) {
  const accounts = new Map();
  const add = (k, signer, writable) => { const o = accounts.get(k) || { key: k, signer: false, writable: false }; o.signer ||= signer; o.writable ||= writable; accounts.set(k, o); };
  add(addr(payer), true, true);
  for (const x of instructions) { for (const k of x.keys) add(k.key, k.signer, k.writable); add(x.program, false, false); }
  for (const x of instructions) accounts.get(x.program).writable = false;   // an invoked program is never writable
  const rank = (o) => (o.signer ? 0 : 2) + (o.writable ? 0 : 1);
  const [first, ...rest] = [...accounts.values()];
  const ordered = [first, ...rest.map((o, i) => [o, i]).sort((a, b) => rank(a[0]) - rank(b[0]) || a[1] - b[1]).map(([o]) => o)];
  const at = new Map(ordered.map((o, i) => [o.key, i]));
  const sv = (n) => { const out = []; do { let b = n & 0x7f; n >>= 7; if (n) b |= 0x80; out.push(b); } while (n); return Buffer.from(out); };
  const parts = [Buffer.of(ordered.filter((o) => o.signer).length, ordered.filter((o) => o.signer && !o.writable).length,
    ordered.filter((o) => !o.signer && !o.writable).length), sv(ordered.length), ...ordered.map((o) => key(o.key)), hash32(blockhash),
  sv(instructions.length)];
  for (const x of instructions) {
    parts.push(Buffer.of(at.get(x.program)), sv(x.keys.length), Buffer.from(x.keys.map((k) => at.get(k.key))), sv(x.data.length), x.data);
  }
  const message = Buffer.concat(parts);
  return { message, signers: ordered.filter((o) => o.signer).map((o) => o.key), accounts: ordered, size: 1 + 64 * ordered.filter((o) => o.signer).length + message.length };
}

/** Where a legacy message keeps its blockhash: after the header and the account keys. A page stamps a fresh one there just before he signs. */
export function blockhashOffset(message) {
  let n = 0, shift = 0, at = 3;
  for (;;) { const b = message[at++]; n |= (b & 0x7f) << shift; if (!(b & 0x80)) break; shift += 7; }
  return at + 32 * n;
}
export function stampBlockhash(message, blockhash) {
  const out = Buffer.from(message), at = blockhashOffset(out);
  hash32(blockhash).copy(out, at);
  return out;
}

// ---- reading accounts back ----
const rdU128 = (b, o) => b.readBigUInt64LE(o) + (b.readBigUInt64LE(o + 8) << 64n);
export function readMint(data) {
  const b = Buffer.from(data);
  return { mintAuthority: b.readUInt32LE(0) ? base58Of(b.subarray(4, 36)) : null, supply: b.readBigUInt64LE(36), decimals: b[44],
    initialized: b[45] === 1, freezeAuthority: b.readUInt32LE(46) ? base58Of(b.subarray(50, 82)) : null };
}
export function readTokenAccount(data) {
  const b = Buffer.from(data);
  return { mint: base58Of(b.subarray(0, 32)), owner: base58Of(b.subarray(32, 64)), amount: b.readBigUInt64LE(64) };
}
export function readPair(data) {
  const b = Buffer.from(data);
  return { activeId: b.readInt32LE(76), binStep: b.readUInt16LE(80), status: b[82], baseFactor: b.readUInt16LE(8), power: b[34],
    activationType: b[86], mintX: base58Of(b.subarray(88, 120)), mintY: base58Of(b.subarray(120, 152)), reserveX: base58Of(b.subarray(152, 184)),
    reserveY: base58Of(b.subarray(184, 216)), oracle: base58Of(b.subarray(552, 584)), activationPoint: b.readBigUInt64LE(816), creator: base58Of(b.subarray(848, 880)) };
}
/** The 70 bins of a bin array: what each holds of X and Y, its price (Q64.64, Y base units per X base unit) and its total liquidity shares. */
export function readBinArray(data) {
  const b = Buffer.from(data), index = Number(b.readBigInt64LE(8)), bins = [];
  for (let i = 0; i < BINS_PER_ARRAY; i++) {
    const o = 56 + 144 * i;
    bins.push({ binId: index * BINS_PER_ARRAY + i, x: b.readBigUInt64LE(o), y: b.readBigUInt64LE(o + 8), price: rdU128(b, o + 16), supply: rdU128(b, o + 32),
      feeXStored: rdU128(b, o + 80), feeYStored: rdU128(b, o + 96) });
  }
  return { index, lbPair: base58Of(b.subarray(24, 56)), bins };
}
export function readPosition(data) {
  const b = Buffer.from(data), shares = [], fees = [];
  for (let i = 0; i < BINS_PER_ARRAY; i++) {
    shares.push(rdU128(b, 72 + 16 * i));
    const o = 4552 + 48 * i;                                             // FeeInfo: x and y per token complete (u128), x and y pending (u64)
    fees.push({ xComplete: rdU128(b, o), yComplete: rdU128(b, o + 16), xPending: b.readBigUInt64LE(o + 32), yPending: b.readBigUInt64LE(o + 40) });
  }
  return { lbPair: base58Of(b.subarray(8, 40)), owner: base58Of(b.subarray(40, 72)), shares, fees, lower: b.readInt32LE(7912), upper: b.readInt32LE(7916) };
}

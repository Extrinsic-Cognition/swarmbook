// pool-genesis.mjs · THE POOL WAITS ON HIS KEY (Oct 29 2026, lane/the-pool-waits-on-his-key). His words, UTC:
//   19:12 (to claude-ff987105) "$SOL is staked and SOL yields are sold for ai credits"
//   19:38 (to claude-61e371e5, asked who signs the devnet stake pool: a throwaway devnet key, or only his) "Only my key"
// THE POOL'S BIRTH is one transaction that only the manager's key signs. Every new account is made with create_account_with_seed from his own address, so
// no other key ever signs: the SPL stake pool's account, its validator list, its reserve stake (both authorities the pool's withdraw authority) and its
// mint (9 decimals, minted only by that authority). Then his token account for the mint, which receives the pool's fee. Then the pool's Initialize, with an
// epoch fee of 100%: the whole yield reaches his fee account and each staker's receipt keeps its SOL (the program's code, read Oct 29:
// SOL-INFLATION-PAYS-FOR-INFERENCE-LANDING.md). No dependency: the addresses, the instructions and the message are built here byte for byte, and the test
// holds them to @solana/web3.js 1.98.4's own derivations.
// DEVNET ONLY: a seat may plan and simulate (no key, no signature); signing is his hand (genesis.mjs sign); mainnet is his word, not this file's.
// COST (devnet's simulateTransaction, Oct 29 19:4x UTC): one transaction of 1,162 bytes and 34,590 compute units, the pool's Initialize 12,616 of them;
// 0.0124 SOL of rent for the five accounts at devnet's rate (0.017 at the classic 6,960 lamports a byte), all of it a deposit, and the network's fee.
import { createHash, createPrivateKey, createPublicKey } from 'node:crypto';
import { base58Bytes } from './pool-crank.mjs';

export const POOL_PROGRAM = Object.freeze({ devnet: 'DPoo15wWDqpPJJtS2MUZ49aRxqz5ZaaJCJP4z8bLuib', mainnet: 'SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy' });
export const SYSTEM = '11111111111111111111111111111111';
export const STAKE = 'Stake11111111111111111111111111111111111111';
export const TOKEN = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
export const ATA = 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
export const RENT = 'SysvarRent111111111111111111111111111111111';
export const DEVNET_RPC = 'https://api.devnet.solana.com';
export const MAX_TX = 1232;                                              // a packet's worth: Solana's largest transaction
export const MAX_VALIDATORS = 10;                                       // a rehearsal's list; mainnet's is his call
// StakePool's packed length (its 30 fields, state.rs), a StakeStateV2, a Mint, and ValidatorList: header 5 + vec length 4 + 73 bytes a validator.
export const SIZES = Object.freeze({ pool: 611, reserve: 200, mint: 82, list: (max) => 9 + 73 * max });

export const isDevnetRpc = (url) => typeof url === 'string' && !/mainnet/i.test(url) && /devnet|^https?:\/\/(127\.0\.0\.1|localhost)[:/]/i.test(url);

const B58 = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
export function base58Of(bytes) {
  let n = 0n;
  for (const b of bytes) n = (n << 8n) | BigInt(b);
  let s = '';
  while (n > 0n) { s = B58[Number(n % 58n)] + s; n /= 58n; }
  for (const b of bytes) { if (b !== 0) break; s = '1' + s; }
  return s;
}
const bytesOf = (a) => {
  const b = typeof a === 'string' ? base58Bytes(a) : a;
  if (!b || b.length !== 32) throw new Error(`not an address: ${typeof a === 'string' ? a : '(bytes)'}`);
  return Buffer.from(b);
};

// Is a 32-byte string a point of ed25519? curve25519-dalek's decompress().is_some(): y's x² = (y² - 1) / (d·y² + 1) must be a square. A program
// address is the first hash, from bump 255 down, that is not.
const P = 2n ** 255n - 19n;
const md = (a) => ((a % P) + P) % P;
const pw = (b, e) => { let r = 1n; b = md(b); while (e > 0n) { if (e & 1n) r = md(r * b); b = md(b * b); e >>= 1n; } return r; };
const D = md(-121665n * pw(121666n, P - 2n));
export function onCurve(bytes) {
  let y = 0n;
  for (let i = 31; i >= 0; i--) y = (y << 8n) | BigInt(i === 31 ? bytes[i] & 0x7f : bytes[i]);
  y = md(y);
  const y2 = md(y * y), u = md(y2 - 1n), v = md(D * y2 + 1n);
  const x = md(u * pw(v, 3n) * pw(md(u * pw(v, 7n)), (P - 5n) / 8n));
  const vx2 = md(v * x * x);
  return vx2 === u || vx2 === md(-u);
}

const sha = (...parts) => createHash('sha256').update(Buffer.concat(parts.map((p) => Buffer.from(p)))).digest();
export const createWithSeed = (base, seed, owner) => sha(bytesOf(base), Buffer.from(seed, 'utf8'), bytesOf(owner));
export function findPda(seeds, program) {
  for (let bump = 255; bump >= 0; bump--) {
    const h = sha(...seeds, Uint8Array.of(bump), bytesOf(program), Buffer.from('ProgramDerivedAddress'));
    if (!onCurve(h)) return [h, bump];
  }
  throw new Error('no program address');
}

// The pool's addresses, all from the manager's: <tag>p the pool, <tag>l its list, <tag>r its reserve, <tag>m its mint; a new tag is a new pool.
export function poolAddresses(manager, { cluster = 'devnet', tag = 'her1' } = {}) {
  const program = POOL_PROGRAM[cluster];
  if (!program) throw new Error(`no stake pool program on ${cluster}`);
  const m = bytesOf(manager);
  const seeds = { pool: `${tag}p`, list: `${tag}l`, reserve: `${tag}r`, mint: `${tag}m` };
  const pool = createWithSeed(m, seeds.pool, program), mint = createWithSeed(m, seeds.mint, TOKEN);
  const [withdraw, withdrawBump] = findPda([pool, Buffer.from('withdraw')], program);
  const [fee] = findPda([m, bytesOf(TOKEN), mint], ATA);
  return { cluster, program, seeds, manager: m, pool, mint, withdraw, withdrawBump, fee,
    list: createWithSeed(m, seeds.list, program), reserve: createWithSeed(m, seeds.reserve, STAKE) };
}

const u32 = (n) => { const b = Buffer.alloc(4); b.writeUInt32LE(n); return b; };
const u64 = (n) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(n)); return b; };
const meta = (key, signer, writable) => ({ key: bytesOf(key), signer, writable });
const fee = (numerator, denominator) => Buffer.concat([u64(denominator), u64(numerator)]);   // Fee { denominator, numerator }

// StakePoolInstruction::Initialize (index 0): epoch fee 1/1, no withdrawal or deposit fee, no referral, the list's length.
export const initializeData = (maxValidators) => Buffer.concat([Buffer.of(0), fee(1, 1), fee(0, 0), fee(0, 0), Buffer.of(0), u32(maxValidators)]);

const withSeed = (from, to, seed, lamports, space, owner) => ({   // SystemInstruction::CreateAccountWithSeed (3); the base is the payer
  program: SYSTEM, keys: [meta(from, true, true), meta(to, false, true)],
  data: Buffer.concat([u32(3), bytesOf(from), u64(Buffer.byteLength(seed)), Buffer.from(seed), u64(lamports), u64(space), bytesOf(owner)]),
});

// The birth's eight instructions, in order. rents: the rent-exempt lamports of the pool, the list, the reserve and the mint (the RPC's
// getMinimumBalanceForRentExemption); the reserve holds exactly its rent, since the program mints the manager pool tokens for anything above it.
export function genesisInstructions(a, rents, maxValidators = MAX_VALIDATORS) {
  const m = a.manager;
  return [
    withSeed(m, a.pool, a.seeds.pool, rents.pool, SIZES.pool, a.program),
    withSeed(m, a.list, a.seeds.list, rents.list, SIZES.list(maxValidators), a.program),
    withSeed(m, a.reserve, a.seeds.reserve, rents.reserve, SIZES.reserve, STAKE),
    { program: STAKE, keys: [meta(a.reserve, false, true), meta(RENT, false, false)],                     // StakeInstruction::Initialize, no lockup
      data: Buffer.concat([u32(0), a.withdraw, a.withdraw, Buffer.alloc(48)]) },
    withSeed(m, a.mint, a.seeds.mint, rents.mint, SIZES.mint, TOKEN),
    { program: TOKEN, keys: [meta(a.mint, false, true)], data: Buffer.concat([Buffer.of(20, 9), a.withdraw, Buffer.of(0)]) },   // InitializeMint2
    { program: ATA, data: Buffer.of(1), keys: [meta(m, true, true), meta(a.fee, false, true), meta(m, false, false), meta(a.mint, false, false),
      meta(SYSTEM, false, false), meta(TOKEN, false, false)] },                                             // CreateIdempotent: his fee account
    { program: a.program, data: initializeData(maxValidators), keys: [meta(a.pool, false, true), meta(m, true, false), meta(m, false, false),
      meta(a.withdraw, false, false), meta(a.list, false, true), meta(a.reserve, false, false), meta(a.mint, false, true), meta(a.fee, false, true),
      meta(TOKEN, false, false)] },                                                                         // the manager is also the staker
  ];
}

export function shortvec(n) {
  const out = [];
  do { let b = n & 0x7f; n >>= 7; if (n) b |= 0x80; out.push(b); } while (n);
  return Buffer.from(out);
}

// A legacy message: the payer first, then signers, writable before read-only, then the rest the same way.
export function compileMessage(instructions, payer, blockhash = Buffer.alloc(32)) {
  const accounts = new Map();
  const add = (key, signer, writable) => {
    const id = base58Of(key), o = accounts.get(id) || { key, signer: false, writable: false };
    o.signer ||= signer; o.writable ||= writable; accounts.set(id, o);
  };
  add(bytesOf(payer), true, true);
  for (const ix of instructions) { for (const k of ix.keys) add(k.key, k.signer, k.writable); add(bytesOf(ix.program), false, false); }
  const rank = (o) => (o.signer ? 0 : 2) + (o.writable ? 0 : 1);
  const [first, ...rest] = [...accounts.values()];
  const ordered = [first, ...rest.sort((x, y) => rank(x) - rank(y))];
  const at = new Map(ordered.map((o, i) => [base58Of(o.key), i]));
  const parts = [Buffer.of(ordered.filter((o) => o.signer).length, ordered.filter((o) => o.signer && !o.writable).length,
    ordered.filter((o) => !o.signer && !o.writable).length), shortvec(ordered.length), ...ordered.map((o) => o.key), Buffer.from(blockhash),
    shortvec(instructions.length)];
  for (const ix of instructions) {
    const idx = ix.keys.map((k) => at.get(base58Of(k.key)));
    parts.push(Buffer.of(at.get(base58Of(bytesOf(ix.program)))), shortvec(idx.length), Buffer.from(idx), shortvec(ix.data.length), ix.data);
  }
  return Buffer.concat(parts);
}

// The wire form: one signature (64 zero bytes until his key signs), then the message.
export const transactionOf = (message, signature = Buffer.alloc(64)) => Buffer.concat([shortvec(1), Buffer.from(signature), message]);

// His key, read from its file's text: a Solana keypair's JSON array, a PEM, or the Nest's key file ({ private_pem }). Only genesis.mjs sign reads one.
export function keyFromText(text) {
  const t = String(text).trim();
  const priv = t.startsWith('[') ? createPrivateKey({ key: Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'),
    Buffer.from(JSON.parse(t).slice(0, 32))]), format: 'der', type: 'pkcs8' })
    : t.startsWith('{') ? createPrivateKey(JSON.parse(t).private_pem) : createPrivateKey(t);
  if (priv.asymmetricKeyType !== 'ed25519') throw new Error('not an ed25519 key');
  return { priv, address: base58Of(createPublicKey(priv).export({ format: 'der', type: 'spki' }).subarray(-32)) };
}

export function genesis({ manager, rents, maxValidators = MAX_VALIDATORS, cluster = 'devnet', tag = 'her1', blockhash }) {
  const a = poolAddresses(manager, { cluster, tag });
  const message = compileMessage(genesisInstructions(a, rents, maxValidators), a.manager, blockhash);
  const named = Object.fromEntries(['manager', 'pool', 'list', 'reserve', 'mint', 'withdraw', 'fee'].map((k) => [k, base58Of(a[k])]));
  return { addresses: { program: a.program, ...named }, message, size: transactionOf(message).length,
    lamports: rents.pool + rents.list + rents.reserve + rents.mint };
}

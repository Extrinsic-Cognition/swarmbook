/* poleis-client.js: the program's wire, in the browser and in Node.
 *
 * Everything here mirrors client/src/lib.rs: the same PDAs, the same
 * offsets, the same instruction bytes, the same envelope. Where the two
 * disagree the Rust client is the reference and this file has a bug; the
 * conformance test in test/ pins the two together.
 *
 * Depends on @solana/web3.js (PublicKey, TransactionInstruction,
 * Connection, Keypair, Transaction) and tweetnacl (signing envelopes with
 * a raw Ed25519 secret key). Loaded as an ES module, or as a classic
 * script after web3.js and nacl, where it installs window.PoleisClient.
 */

const ROOT = typeof globalThis !== 'undefined' ? globalThis : window;

function loadWeb3() {
  if (ROOT.solanaWeb3) return ROOT.solanaWeb3;
  if (ROOT.solana && ROOT.solana.PublicKey) return ROOT.solana;
  throw new Error('poleis-client: @solana/web3.js must be loaded first (window.solanaWeb3)');
}
function loadNacl() {
  if (ROOT.nacl) return ROOT.nacl;
  throw new Error('poleis-client: tweetnacl must be loaded first (window.nacl)');
}

export function create(deps) {
  const web3 = (deps && deps.web3) || loadWeb3();
  const nacl = (deps && deps.nacl) || loadNacl();
  const { PublicKey, TransactionInstruction, SystemProgram, SYSVAR_INSTRUCTIONS_PUBKEY } = web3;

  // ---- constants, from the program ----
  const PROGRAM_ID = new PublicKey('AJNrRxyvysf7iokrDLBHeoJQUqitiBva3nRUnCj7VEkJ');
  const ED25519_PROGRAM_ID = new PublicKey('Ed25519SigVerify111111111111111111111111111');
  const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA');
  const TOKEN_2022_PROGRAM_ID = new PublicKey('TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb');
  const BPF_LOADER_UPGRADEABLE_ID = new PublicKey('BPFLoaderUpgradeab1e11111111111111111111111');
  const RENT_SYSVAR_ID = new PublicKey('SysvarRent111111111111111111111111111111111');
  const CLOCK_SYSVAR_ID = new PublicKey('SysvarC1ock11111111111111111111111111111111');
  const LAYOUT_VERSION = 7;
  const PENTAGONS = 12;
  const PENTAGON_QUORUM = 7;
  const MAX_HOLDERS = 150;
  const MAX_IMPACTED = 12;
  const MAX_PAYLOAD = 768;
  const MAX_NAME = 64;
  const MAX_DESC = 128;
  const MAX_ACT_ACCOUNTS = 8;
  const MAX_DEPTH = 5;
  const MIN_WINDOW_SLOTS = 100;
  const MAX_WINDOW_SLOTS = 1_296_000;
  const ACTIVE_WINDOW_SLOTS = 6_480_000;
  const MAX_TERM_SLOTS = 78_840_000;
  const CODEX_WINDOW_FACTOR = 3;
  const DISTRIBUTION_TTL_SLOTS = 12_960_000;
  const BPS = 10_000;
  const ROOT_UNIT = 0n;
  const LADDER = [[1, 0], [1, 1], [2, 0], [3, 0], [2, 2], [4, 0]];
  const ladderT = (m, n) => m * m + m * n + n * n;
  const ladderHexagons = (rung) => 10 * (ladderT(...LADDER[rung]) - 1);

  const IX = {
    INIT_CONFIG: 0, CREATE_TREASURY: 1, ENDOW: 2, SYNC_ENDOWMENT: 3,
    OPEN_AUCTION: 4, COMMIT_BID: 5, REVEAL_BID: 6, SETTLE: 7, RECLAIM: 8,
    COMMIT_SEAT_BID: 9, REVEAL_SEAT_BID: 10, SETTLE_SEATS: 11, CLAIM_SEAT: 12, RECLAIM_SEAT_BID: 13,
    TRANSFER_SEATS: 14, OPEN_GENESIS: 15, FOUND_CHILD: 16, RATIFY_GENESIS: 17,
    PROPOSE: 18, ATTEST: 19, MANDATE: 20, SEAL: 21, EXECUTE: 22, CLAIM_DIVIDEND: 23,
    CLOSE_PROPOSAL: 24, CLOSE_SEAT_BID: 25, CLOSE_BID: 26, CREATE_VAULT: 28,
    PULL: 29, CLOSE_ALLOWANCE: 30, EXPIRE_CONTRACT: 31, ACCRUE_DIVIDEND: 32, CLOSE_DISTRIBUTION: 33,
    LIST_SEATS: 34, BUY_SEATS: 35, CANCEL_LISTING: 36,
  };
  const MODE = { SOLO: 0, GENESIS: 1, COUNCIL: 2 };
  const CLASS = { CODEX: 0, SIGNAL: 1, TREASURY: 2, SEAT: 3, ACT: 4 };
  const KIND = {
    CODEX_PLAN: 0, CODEX_LADDER: 1, CODEX_FOUND: 2, CODEX_WINDOW: 3, CODEX_NAME: 4, CODEX_DIVIDEND_POLICY: 5,
    CODEX_UPGRADE: 6, CODEX_UPGRADE_AUTHORITY: 7, CODEX_CRANK_TIP: 8, CODEX_ALLOW_MINT: 9,
    SIGNAL_SALE_DEFAULTS: 0, SIGNAL_WEIGHT: 1, SIGNAL_OPEN_AUCTION: 2, SIGNAL_RULE: 3,
    TREASURY_TRANSFER: 0, TREASURY_BUDGET: 1, TREASURY_DIVIDEND: 2, TREASURY_DISSOLVE: 3, TREASURY_TOKEN_TRANSFER: 4, TREASURY_TOKEN_BUDGET: 5,
    TREASURY_TOKEN_DIVIDEND: 6, TREASURY_ALLOWANCE: 7, TREASURY_REVOKE: 8, TREASURY_CONTRACT: 9,
    SEAT_ATTACH: 0, SEAT_RECALL: 1, SEAT_JET: 2,
    ACT_RAW: 0,
  };
  /** Flags on a raw act's account: writable, and signer (only the unit's agent may carry it). */
  const ACT = { WRITABLE: 1, SIGNER: 2 };
  const RULE = { RELEASE: 1, REFUND: 2 };
  /** Receipt kinds, as the program logs them. */
  const RCPT = { SEAL: 1, PAY: 2, PULL: 3, ESCROW: 4, RELEASE: 5, REFUND: 6, DIVIDEND: 7, CLAIM: 8, SEATS: 9, TIP: 10 };
  const ZERO32 = new Uint8Array(32);
  const VOTE = { ABSTENTIO: 0, PRO: 1, CONTRA: 2 };
  const STATE = { VOTING: 0, PASSED: 1, REJECTED: 2, DEADLOCK: 3, EXPIRED: 4 };
  const HOLDER = { EMPTY: 0, KEY: 1, UNIT: 2 };
  const DISC = { CONFIG: 1, TREASURY: 2, AUCTION: 3, BID: 4, REGISTRY: 5, SEAT_SALE: 6, SEAT_BID: 7, PROPOSAL: 8, SESSION: 9, DISTRIBUTION: 10, ALLOWANCE: 12, CONTRACT: 13, LISTING: 14, TOKEN_PLAN: 15 };
  const ERRORS = [
    'Unauthorized', 'InvalidPda', 'InvalidAccount', 'InvalidAmount', 'InvalidWindow', 'CommitWindowClosed',
    'RevealWindowNotOpen', 'RevealWindowClosed', 'AlreadyRevealed', 'BadReveal', 'BidExceedsDeposit',
    'AlreadySettled', 'NotSettled', 'NothingToReclaim', 'WinnerCannotReclaim', 'TreasuryInsufficient',
    'UnitMismatch', 'MissingWinningBid', 'ShareIsZero', 'MathOverflow', 'WindowTooLong', 'LayoutVersion',
    'InvalidMode', 'RegistryFull', 'NotHolder', 'SeatLimit', 'SaleNotSettled', 'NotWinner', 'AlreadyClaimed',
    'InvalidHolder', 'ChairTaken', 'ChairEmpty', 'NotOnLadder', 'NotMember', 'NotImpacted', 'NotDescendant',
    'SessionClosed', 'SessionOpen', 'ChildMustSpeak', 'NotSealed', 'NotPassed', 'AlreadyExecuted',
    'ClassMismatch', 'BadPayload', 'ClosureBroken', 'PlanBreached', 'BadPrecompile', 'Frozen',
    'AlreadyMandated', 'TooMany', 'SeatsResting', 'NotClosable', 'ActForbidden', 'TokenPlanBreached',
    'AllowanceBreached', 'AllowanceDead', 'NotArbiter', 'ContractSettled', 'ContractOpen', 'ListingShort', 'NotYet',
    'MintNotAllowed',
  ];

  // ---- bytes ----
  const enc = new TextEncoder();
  const u64le = (v) => { const b = new Uint8Array(8); new DataView(b.buffer).setBigUint64(0, BigInt(v), true); return b; };
  const u16le = (v) => new Uint8Array([v & 0xff, (v >> 8) & 0xff]);
  const rdU16 = (d, o) => d[o] | (d[o + 1] << 8);
  const rdU32 = (d, o) => (d[o] | (d[o + 1] << 8) | (d[o + 2] << 16) | (d[o + 3] << 24)) >>> 0;
  const rdU64 = (d, o) => new DataView(d.buffer, d.byteOffset).getBigUint64(o, true);
  const rd32 = (d, o) => d.slice(o, o + 32);
  const cat = (...parts) => {
    const n = parts.reduce((a, p) => a + p.length, 0);
    const out = new Uint8Array(n);
    let i = 0;
    for (const p of parts) { out.set(p, i); i += p.length; }
    return out;
  };
  const keyBytes = (k) => (k instanceof Uint8Array ? k : new PublicKey(k).toBytes());
  const toData = (u8) => (typeof Buffer !== 'undefined' ? Buffer.from(u8) : u8);
  /** A length-prefixed text field: [len:1][bytes]; accepts a string, bytes, or nothing. */
  const text = (s) => { const b = typeof s === 'string' ? enc.encode(s) : (s || new Uint8Array(0)); return cat(new Uint8Array([b.length]), b); };
  const dec = new TextDecoder();
  const unitHolder = (unit) => cat(u64le(unit), new Uint8Array(24));
  const holderUnit = (h) => rdU64(h, 0);
  const sameBytes = (a, b) => a.length === b.length && a.every((x, i) => x === b[i]);

  // ---- hashing (sha256) ----
  async function sha256(...parts) {
    const buf = await crypto.subtle.digest('SHA-256', cat(...parts));
    return new Uint8Array(buf);
  }

  // ---- PDAs ----
  const pda = (seeds) => PublicKey.findProgramAddressSync(seeds.map((s) => (typeof s === 'string' ? enc.encode(s) : s)), PROGRAM_ID)[0];
  const configPda = () => pda(['config']);
  const councilPda = () => pda(['council']);
  const treasuryPda = (unit) => pda(['treasury', u64le(unit)]);
  const registryPda = (unit) => pda(['registry', u64le(unit)]);
  const auctionPda = (auction) => pda(['auction', u64le(auction)]);
  const bidPda = (auction, bidder) => pda(['bid', u64le(auction), keyBytes(bidder)]);
  const salePda = (unit, sale) => pda(['sale', u64le(unit), u64le(sale)]);
  const seatBidPda = (unit, sale, bidder, nonce) => pda(['sbid', u64le(unit), u64le(sale), keyBytes(bidder), u64le(nonce)]);
  const proposalPda = (hash) => pda(['proposal', hash]);
  const sessionPda = (hash, unit) => pda(['session', hash, u64le(unit)]);
  const distributionPda = (hash) => pda(['distribution', hash]);
  /** The unit's token account for a mint; its authority is the unit's treasury. */
  const vaultPda = (unit, mint) => pda(['vault', u64le(unit), keyBytes(mint)]);
  /** The unit's hands: the address that signs raw acts. Never holds the treasury. */
  const agentPda = (unit) => pda(['agent', u64le(unit)]);
  const allowancePda = (hash) => pda(['allowance', hash]);
  const contractPda = (hash) => pda(['contract', hash]);
  /** The escrow token account of a token contract or token distribution. */
  const escrowPda = (hash) => pda(['escrow', hash]);
  const listingPda = (unit, seller, nonce) => pda(['listing', u64le(unit), keyBytes(seller), u64le(nonce)]);
  /** A unit's plan for a mint beyond the default, made by CODEX AllowMint. */
  const tokenPlanPda = (unit, mint) => pda(['tokenplan', u64le(unit), keyBytes(mint)]);
  /** The program's upgrade authority after the ceremony: signed for only by a root CODEX act. */
  const upgradePda = () => pda(['upgrade']);
  /** The loader's program-data account of this program. */
  const programdataPda = () => PublicKey.findProgramAddressSync([PROGRAM_ID.toBytes()], BPF_LOADER_UPGRADEABLE_ID)[0];
  /** The hash a dividend-policy accrual is keyed by. */
  const accrualHash = (unit, seq) => sha256(enc.encode('polis:accrual'), u64le(unit), u64le(seq));

  // ---- hashes and the envelope ----
  const commitment = (amount, salt, bidder) => sha256(u64le(amount), salt, keyBytes(bidder));
  const seatCommitment = (price, nonce, salt, bidder) => sha256(u64le(price), u64le(nonce), salt, keyBytes(bidder));
  const proposalHash = (cls, origin, manifest, payloadHash, nonce) =>
    sha256(enc.encode('polis:proposal:v1'), new Uint8Array([cls]), u64le(origin), manifest, payloadHash, u64le(nonce));
  const VOTE_DOMAIN = enc.encode('polis:vote:v1');
  const ENVELOPE_LEN = 54;
  const voteEnvelope = (hash, unit, choice) => cat(VOTE_DOMAIN, hash, u64le(unit), new Uint8Array([choice]));
  /** Sign an envelope with a 64-byte Ed25519 secret key (web3 Keypair.secretKey). */
  const signVote = (secretKey, hash, unit, choice) => nacl.sign.detached(voteEnvelope(hash, unit, choice), secretKey);

  // ---- instructions ----
  const meta = (pubkey, isSigner, isWritable) => ({ pubkey: pubkey instanceof PublicKey ? pubkey : new PublicKey(pubkey), isSigner, isWritable });
  const w = (k) => meta(k, false, true);
  const r = (k) => meta(k, false, false);
  const sw = (k) => meta(k, true, true);
  const sr = (k) => meta(k, true, false);
  const sys = () => r(SystemProgram.programId);
  const ix = (tag, parts, keys) => new TransactionInstruction({ programId: PROGRAM_ID, keys, data: toData(cat(new Uint8Array([tag]), ...parts)) });

  /** defaultMint: the mint every unit spends under its own counter without a listing (USDC on a real cluster); null for none. */
  const initConfig = (payer, defaultMint) => ix(IX.INIT_CONFIG, [defaultMint ? keyBytes(defaultMint) : ZERO32], [sw(payer), w(configPda()), sys()]);
  const createTreasury = (authority, unit) => ix(IX.CREATE_TREASURY, [u64le(unit)], [sw(authority), r(configPda()), w(treasuryPda(unit)), sys()]);
  const endow = (donor, unit, amount) => ix(IX.ENDOW, [u64le(unit), u64le(amount)], [sw(donor), w(treasuryPda(unit)), sys()]);
  const syncEndowment = (unit) => ix(IX.SYNC_ENDOWMENT, [u64le(unit)], [w(treasuryPda(unit))]);
  /** Permissionless: open the unit's token account for a mint (treasury = authority). */
  const createVault = (payer, unit, mint, tokenProgram) => ix(IX.CREATE_VAULT, [u64le(unit)], [sw(payer), r(treasuryPda(unit)), r(mint), w(vaultPda(unit, mint)), r(tokenProgram || TOKEN_PROGRAM_ID), sys()]);

  const lotBytes = (l) => cat(u64le(l.auctionId), u64le(l.unit), l.poolRoot, l.manifest, u64le(l.commitEnd), u64le(l.revealEnd), u64le(l.reserve), u64le(l.deposit));
  const openAuction = (authority, l) => ix(IX.OPEN_AUCTION, [lotBytes(l)], [sw(authority), r(configPda()), r(treasuryPda(l.unit)), w(auctionPda(l.auctionId)), sys()]);
  const commitBid = (bidder, auction, c) => ix(IX.COMMIT_BID, [u64le(auction), c], [sw(bidder), r(auctionPda(auction)), w(bidPda(auction, bidder)), sys()]);
  const revealBid = (bidder, auction, amount, salt) => ix(IX.REVEAL_BID, [u64le(auction), u64le(amount), salt], [sr(bidder), w(auctionPda(auction)), w(bidPda(auction, bidder))]);
  const settle = (crank, auction, unit, winner) => {
    const keys = [sr(crank), w(auctionPda(auction)), w(treasuryPda(unit))];
    if (winner) keys.push(w(bidPda(auction, winner)), w(winner));
    return ix(IX.SETTLE, [u64le(auction)], keys);
  };
  const reclaim = (bidder, auction) => ix(IX.RECLAIM, [u64le(auction)], [sw(bidder), r(auctionPda(auction)), w(bidPda(auction, bidder))]);

  const commitSeatBid = (bidder, unit, sale, nonce, c) => ix(IX.COMMIT_SEAT_BID, [u64le(unit), u64le(sale), u64le(nonce), c], [sw(bidder), r(salePda(unit, sale)), w(seatBidPda(unit, sale, bidder, nonce)), sys()]);
  const revealSeatBid = (bidder, unit, sale, nonce, price, salt) => ix(IX.REVEAL_SEAT_BID, [u64le(unit), u64le(sale), u64le(nonce), u64le(price), salt], [sr(bidder), w(salePda(unit, sale)), w(seatBidPda(unit, sale, bidder, nonce))]);
  const settleSeats = (crank, unit, sale) => ix(IX.SETTLE_SEATS, [u64le(unit), u64le(sale)], [sr(crank), w(salePda(unit, sale)), w(registryPda(unit))]);
  const claimSeat = (bidder, unit, sale, nonce) => ix(IX.CLAIM_SEAT, [u64le(unit), u64le(sale), u64le(nonce)], [sw(bidder), r(salePda(unit, sale)), w(seatBidPda(unit, sale, bidder, nonce)), w(registryPda(unit)), w(treasuryPda(unit)), sys()]);
  const reclaimSeatBid = (bidder, unit, sale, nonce) => ix(IX.RECLAIM_SEAT_BID, [u64le(unit), u64le(sale), u64le(nonce)], [sw(bidder), r(salePda(unit, sale)), w(seatBidPda(unit, sale, bidder, nonce))]);
  const transferSeats = (holder, unit, to, toKind, count) => ix(IX.TRANSFER_SEATS, [u64le(unit), to, new Uint8Array([toKind]), u64le(count)], [sr(holder), w(registryPda(unit))]);

  /** GenesisSpec: { charter, planCap, planPeriod, window, rung, reserve, deposit, commitEnd, revealEnd, founders: [PublicKey], name?, desc? } (name ≤ 64 bytes, desc ≤ 128) */
  const genesisBytes = (g) => cat(g.charter, u64le(g.planCap), u64le(g.planPeriod), u64le(g.window), new Uint8Array([g.rung]), u64le(g.reserve), u64le(g.deposit), u64le(g.commitEnd), u64le(g.revealEnd), new Uint8Array([g.founders.length]), ...g.founders.map(keyBytes), text(g.name), text(g.desc));
  const openGenesis = (payer, g) => ix(IX.OPEN_GENESIS, [genesisBytes(g)], [sw(payer), w(configPda()), r(treasuryPda(ROOT_UNIT)), w(registryPda(ROOT_UNIT)), w(salePda(ROOT_UNIT, 0)), sys()]);
  /** FoundSpec: { child, chair, charter, window, planCap, planPeriod, founders: [PublicKey], name?, desc? } */
  const foundBytes = (f) => cat(u64le(f.child), new Uint8Array([f.chair]), f.charter, u64le(f.window), u64le(f.planCap), u64le(f.planPeriod), new Uint8Array([f.founders.length]), ...f.founders.map(keyBytes), text(f.name), text(f.desc));
  const foundChild = (payer, parent, f) => ix(IX.FOUND_CHILD, [foundBytes(f)], [sw(payer), r(configPda()), w(registryPda(parent)), w(registryPda(f.child)), w(treasuryPda(f.child)), sys()]);
  const ratifyGenesis = (crank) => ix(IX.RATIFY_GENESIS, [], [sr(crank), w(configPda()), r(registryPda(ROOT_UNIT)), r(salePda(ROOT_UNIT, 0))]);

  // ---- payloads ----
  /** Every payload: { class, kind, origin, ...fields }. bytes() and accounts() as in the Rust client. */
  const Payload = {
    transfer: (origin, dest, amount) => ({ cls: CLASS.TREASURY, kind: KIND.TREASURY_TRANSFER, origin, dest, amount }),
    budget: (origin, address, amount) => ({ cls: CLASS.TREASURY, kind: KIND.TREASURY_BUDGET, origin, address, amount }),
    dividend: (origin, amount) => ({ cls: CLASS.TREASURY, kind: KIND.TREASURY_DIVIDEND, origin, amount }),
    dissolve: (origin) => ({ cls: CLASS.TREASURY, kind: KIND.TREASURY_DISSOLVE, origin }),
    attach: (origin, chair, holder, holderKind, term, retainer) => ({ cls: CLASS.SEAT, kind: KIND.SEAT_ATTACH, origin, chair, holder, holderKind, term, retainer }),
    recall: (origin, chair) => ({ cls: CLASS.SEAT, kind: KIND.SEAT_RECALL, origin, chair }),
    jet: (origin, holder, holderKind) => ({ cls: CLASS.SEAT, kind: KIND.SEAT_JET, origin, holder, holderKind }),
    plan: (origin, cap, period, tokenCap) => ({ cls: CLASS.CODEX, kind: KIND.CODEX_PLAN, origin, cap, period, tokenCap: tokenCap || 0 }),
    /** The voting window and the CODEX window (defaults to three windows). */
    window: (origin, window, codexWindow) => ({ cls: CLASS.CODEX, kind: KIND.CODEX_WINDOW, origin, window, codexWindow: codexWindow === undefined ? BigInt(window) * 3n : codexWindow }),
    /** Income by rule: bps of every lamport of income escrowed for the floor each period; 0 turns it off. */
    dividendPolicy: (origin, bps, period) => ({ cls: CLASS.CODEX, kind: KIND.CODEX_DIVIDEND_POLICY, origin, bps, period }),
    /** The code itself: the root, over the whole tree, has the loader replace the program from `buffer`; excess rent to `spill`. */
    upgrade: (origin, buffer, spill) => ({ cls: CLASS.CODEX, kind: KIND.CODEX_UPGRADE, origin, buffer, spill }),
    /** Hand the upgrade authority to `newAuthority` (a PublicKey), or burn it (null). */
    upgradeAuthority: (origin, newAuthority) => ({ cls: CLASS.CODEX, kind: KIND.CODEX_UPGRADE_AUTHORITY, origin, newAuthority: newAuthority || null }),
    /** What a crank is paid per landed batch and per seal, under the plan. */
    crankTip: (origin, tip) => ({ cls: CLASS.CODEX, kind: KIND.CODEX_CRANK_TIP, origin, tip }),
    /** A mint beyond the default the society may spend, cap per period in its units; cap 0 withdraws it (payer = who executed it). */
    allowMint: (origin, mint, cap, payer) => ({ cls: CLASS.CODEX, kind: KIND.CODEX_ALLOW_MINT, origin, mint, cap, payer }),
    /** A ruling on a contract; `contract` = { unit, payee, payeeKind, mint, payer, tokenProgram?, payeeTokenAccount? } builds the accounts. */
    rule: (origin, hash, outcome, contract) => ({ cls: CLASS.SIGNAL, kind: KIND.SIGNAL_RULE, origin, hash, outcome, contract }),
    /** A dividend in a token; amount 0 in a dissolved unit sweeps the vault. */
    tokenDividend: (origin, mint, amount, tokenProgram) => ({ cls: CLASS.TREASURY, kind: KIND.TREASURY_TOKEN_DIVIDEND, origin, mint, amount, tokenProgram }),
    /** A standing authorization: payee (32 bytes) pulls up to cap per period of SOL (mint = ZERO32) or of mint. expires 0 = never. */
    allowance: (origin, payee, payeeKind, mint, cap, period, expires) => ({ cls: CLASS.TREASURY, kind: KIND.TREASURY_ALLOWANCE, origin, payee, payeeKind, mint: mint || ZERO32, cap, period, expires: expires || 0n }),
    /** Close an allowance; payer = whoever executed it into being. */
    revoke: (origin, allowance, payer) => ({ cls: CLASS.TREASURY, kind: KIND.TREASURY_REVOKE, origin, allowance, payer }),
    /** Escrow amount for payee until deadline, ruled by this unit or by arbiter. */
    contract: (origin, payee, payeeKind, mint, amount, deadline, arbiter, tokenProgram) => ({ cls: CLASS.TREASURY, kind: KIND.TREASURY_CONTRACT, origin, payee, payeeKind, mint: mint || ZERO32, amount, deadline, arbiter, tokenProgram }),
    ladder: (origin, reserve, deposit, commitLen, revealLen, saleId) => ({ cls: CLASS.CODEX, kind: KIND.CODEX_LADDER, origin, reserve, deposit, commitLen, revealLen, saleId }),
    found: (origin, spec) => ({ cls: CLASS.CODEX, kind: KIND.CODEX_FOUND, origin, spec }),
    /** Rename the unit; name ≤ 64 bytes, desc ≤ 128, either may be empty. */
    name: (origin, name, desc) => ({ cls: CLASS.CODEX, kind: KIND.CODEX_NAME, origin, name, desc }),
    saleDefaults: (origin, reserve, deposit) => ({ cls: CLASS.SIGNAL, kind: KIND.SIGNAL_SALE_DEFAULTS, origin, reserve, deposit }),
    weight: (origin, holder, holderKind, weight) => ({ cls: CLASS.SIGNAL, kind: KIND.SIGNAL_WEIGHT, origin, holder, holderKind, weight }),
    openAuction: (origin, lot) => ({ cls: CLASS.SIGNAL, kind: KIND.SIGNAL_OPEN_AUCTION, origin, lot }),
    /** Tokens from the origin's vault to unit `dest`'s vault of the same mint. tokenProgram is off-wire (defaults to SPL Token). */
    tokenTransfer: (origin, mint, dest, amount, tokenProgram) => ({ cls: CLASS.TREASURY, kind: KIND.TREASURY_TOKEN_TRANSFER, origin, mint, dest, amount, tokenProgram }),
    /** Tokens from the origin's vault to any token account. */
    tokenBudget: (origin, mint, address, amount, tokenProgram) => ({ cls: CLASS.TREASURY, kind: KIND.TREASURY_TOKEN_BUDGET, origin, mint, address, amount, tokenProgram }),
    /** The society's hands: any instruction to any other program, signed by the unit's agent PDA. accounts: [{ key, flags }] with ACT flags. */
    raw: (origin, program, accounts, data) => ({ cls: CLASS.ACT, kind: KIND.ACT_RAW, origin, program, accounts, data }),
  };
  function payloadBytes(p) {
    const head = new Uint8Array([p.cls, p.kind]);
    switch (`${p.cls}:${p.kind}`) {
      case `${CLASS.TREASURY}:${KIND.TREASURY_TRANSFER}`: return cat(head, u64le(p.dest), u64le(p.amount));
      case `${CLASS.TREASURY}:${KIND.TREASURY_BUDGET}`: return cat(head, keyBytes(p.address), u64le(p.amount));
      case `${CLASS.TREASURY}:${KIND.TREASURY_DIVIDEND}`: return cat(head, u64le(p.amount));
      case `${CLASS.TREASURY}:${KIND.TREASURY_DISSOLVE}`: return head;
      case `${CLASS.SEAT}:${KIND.SEAT_ATTACH}`: return cat(head, new Uint8Array([p.chair]), p.holder, new Uint8Array([p.holderKind]), u64le(p.term), u64le(p.retainer));
      case `${CLASS.SEAT}:${KIND.SEAT_RECALL}`: return cat(head, new Uint8Array([p.chair]));
      case `${CLASS.SEAT}:${KIND.SEAT_JET}`: return cat(head, p.holder, new Uint8Array([p.holderKind]));
      case `${CLASS.CODEX}:${KIND.CODEX_PLAN}`: return cat(head, u64le(p.cap), u64le(p.period), u64le(p.tokenCap || 0));
      case `${CLASS.CODEX}:${KIND.CODEX_WINDOW}`: return cat(head, u64le(p.window), u64le(p.codexWindow));
      case `${CLASS.CODEX}:${KIND.CODEX_DIVIDEND_POLICY}`: return cat(head, u16le(Number(p.bps)), u64le(p.period));
      case `${CLASS.CODEX}:${KIND.CODEX_UPGRADE}`: return cat(head, keyBytes(p.buffer), keyBytes(p.spill));
      case `${CLASS.CODEX}:${KIND.CODEX_UPGRADE_AUTHORITY}`: return cat(head, p.newAuthority ? keyBytes(p.newAuthority) : ZERO32);
      case `${CLASS.CODEX}:${KIND.CODEX_CRANK_TIP}`: return cat(head, u64le(p.tip));
      case `${CLASS.CODEX}:${KIND.CODEX_ALLOW_MINT}`: return cat(head, keyBytes(p.mint), u64le(p.cap));
      case `${CLASS.SIGNAL}:${KIND.SIGNAL_RULE}`: return cat(head, p.hash, new Uint8Array([p.outcome]));
      case `${CLASS.TREASURY}:${KIND.TREASURY_TOKEN_DIVIDEND}`: return cat(head, keyBytes(p.mint), u64le(p.amount));
      case `${CLASS.TREASURY}:${KIND.TREASURY_ALLOWANCE}`: return cat(head, p.payee, new Uint8Array([p.payeeKind]), keyBytes(p.mint), u64le(p.cap), u64le(p.period), u64le(p.expires));
      case `${CLASS.TREASURY}:${KIND.TREASURY_REVOKE}`: return cat(head, p.allowance);
      case `${CLASS.TREASURY}:${KIND.TREASURY_CONTRACT}`: return cat(head, p.payee, new Uint8Array([p.payeeKind]), keyBytes(p.mint), u64le(p.amount), u64le(p.deadline), u64le(p.arbiter));
      case `${CLASS.CODEX}:${KIND.CODEX_LADDER}`: return cat(head, u64le(p.reserve), u64le(p.deposit), u64le(p.commitLen), u64le(p.revealLen));
      case `${CLASS.CODEX}:${KIND.CODEX_FOUND}`: return cat(head, foundBytes(p.spec));
      case `${CLASS.CODEX}:${KIND.CODEX_NAME}`: return cat(head, text(p.name), text(p.desc));
      case `${CLASS.SIGNAL}:${KIND.SIGNAL_SALE_DEFAULTS}`: return cat(head, u64le(p.reserve), u64le(p.deposit));
      case `${CLASS.SIGNAL}:${KIND.SIGNAL_WEIGHT}`: return cat(head, p.holder, new Uint8Array([p.holderKind]), u64le(p.weight));
      case `${CLASS.SIGNAL}:${KIND.SIGNAL_OPEN_AUCTION}`: return cat(head, lotBytes(p.lot));
      case `${CLASS.TREASURY}:${KIND.TREASURY_TOKEN_TRANSFER}`: return cat(head, keyBytes(p.mint), u64le(p.dest), u64le(p.amount));
      case `${CLASS.TREASURY}:${KIND.TREASURY_TOKEN_BUDGET}`: return cat(head, keyBytes(p.mint), keyBytes(p.address), u64le(p.amount));
      case `${CLASS.ACT}:${KIND.ACT_RAW}`: return cat(head, keyBytes(p.program), new Uint8Array([p.accounts.length]), ...p.accounts.map((a) => cat(keyBytes(a.key), new Uint8Array([a.flags]))), u16le(p.data.length), p.data);
      default: throw new Error('unknown payload');
    }
  }
  const payloadHash = (p) => sha256(payloadBytes(p));
  const isToken = (mint) => !sameBytes(keyBytes(mint), ZERO32);
  /** Where a payment to a payee lands: its own account or token account, or a unit's treasury or vault. */
  function payeeDest(payee, payeeKind, mint, payeeTokenAccount) {
    if (payeeKind === HOLDER.KEY) return isToken(mint) ? payeeTokenAccount : new PublicKey(payee);
    return isToken(mint) ? vaultPda(holderUnit(payee), mint) : treasuryPda(holderUnit(payee));
  }
  /** The settle accounts of a contract: [contract (w), payer (w), treasury (w), dest (w), then escrow (w) and token program for tokens]. */
  function settleAccounts(hash, c, dest) {
    const keys = [w(contractPda(hash)), w(c.payer), w(treasuryPda(c.unit)), w(dest)];
    if (isToken(c.mint)) keys.push(w(escrowPda(hash)), r(c.tokenProgram || TOKEN_PROGRAM_ID));
    return keys;
  }
  const refundDest = (c) => (isToken(c.mint) ? vaultPda(c.unit, c.mint) : treasuryPda(c.unit));
  function payloadAccounts(p, hash) {
    const o = p.origin;
    switch (`${p.cls}:${p.kind}`) {
      case `${CLASS.CODEX}:${KIND.CODEX_DIVIDEND_POLICY}`: return [w(registryPda(o)), r(treasuryPda(o))];
      case `${CLASS.CODEX}:${KIND.CODEX_CRANK_TIP}`: return [w(registryPda(o))];
      case `${CLASS.CODEX}:${KIND.CODEX_ALLOW_MINT}`: return [r(registryPda(o)), w(tokenPlanPda(o, p.mint)), w(p.payer), sys()];
      case `${CLASS.CODEX}:${KIND.CODEX_UPGRADE}`: return [r(registryPda(o)), w(programdataPda()), w(PROGRAM_ID), w(p.buffer), w(p.spill), r(RENT_SYSVAR_ID), r(CLOCK_SYSVAR_ID), r(upgradePda()), r(BPF_LOADER_UPGRADEABLE_ID)];
      case `${CLASS.CODEX}:${KIND.CODEX_UPGRADE_AUTHORITY}`: {
        const keys = [r(registryPda(o)), w(programdataPda()), r(upgradePda()), r(BPF_LOADER_UPGRADEABLE_ID)];
        if (p.newAuthority) keys.push(r(p.newAuthority));
        return keys;
      }
      case `${CLASS.SIGNAL}:${KIND.SIGNAL_RULE}`: {
        const c = p.contract;
        const dest = p.outcome === RULE.RELEASE ? payeeDest(c.payee, c.payeeKind, c.mint, c.payeeTokenAccount) : refundDest(c);
        return [r(registryPda(o)), ...settleAccounts(p.hash, c, dest)];
      }
      case `${CLASS.TREASURY}:${KIND.TREASURY_TOKEN_DIVIDEND}`: return [w(registryPda(o)), w(treasuryPda(o)), w(vaultPda(o, p.mint)), w(distributionPda(hash)), r(p.mint), w(escrowPda(hash)), r(p.tokenProgram || TOKEN_PROGRAM_ID), sys(), w(tokenPlanPda(o, p.mint))];
      case `${CLASS.TREASURY}:${KIND.TREASURY_ALLOWANCE}`: return [r(registryPda(o)), w(allowancePda(hash)), sys()];
      case `${CLASS.TREASURY}:${KIND.TREASURY_REVOKE}`: return [r(registryPda(o)), w(allowancePda(p.allowance)), w(p.payer)];
      case `${CLASS.TREASURY}:${KIND.TREASURY_CONTRACT}`: {
        const keys = [w(registryPda(o)), w(treasuryPda(o)), w(contractPda(hash)), sys()];
        if (isToken(p.mint)) keys.push(r(p.mint), w(vaultPda(o, p.mint)), w(escrowPda(hash)), r(p.tokenProgram || TOKEN_PROGRAM_ID), w(tokenPlanPda(o, p.mint)));
        return keys;
      }
      case `${CLASS.TREASURY}:${KIND.TREASURY_TRANSFER}`: return [w(registryPda(o)), w(treasuryPda(o)), w(treasuryPda(p.dest))];
      case `${CLASS.TREASURY}:${KIND.TREASURY_BUDGET}`: return [w(registryPda(o)), w(treasuryPda(o)), w(p.address)];
      case `${CLASS.TREASURY}:${KIND.TREASURY_DIVIDEND}`:
      case `${CLASS.TREASURY}:${KIND.TREASURY_DISSOLVE}`: return [w(registryPda(o)), w(treasuryPda(o)), w(distributionPda(hash)), sys()];
      case `${CLASS.SEAT}:${KIND.SEAT_ATTACH}`: {
        const keys = [w(registryPda(o))];
        if (p.retainer > 0 && p.holderKind === HOLDER.UNIT) keys.push(w(treasuryPda(o)), w(treasuryPda(holderUnit(p.holder))));
        return keys;
      }
      case `${CLASS.SEAT}:${KIND.SEAT_RECALL}`:
      case `${CLASS.CODEX}:${KIND.CODEX_PLAN}`:
      case `${CLASS.CODEX}:${KIND.CODEX_WINDOW}`:
      case `${CLASS.CODEX}:${KIND.CODEX_NAME}`:
      case `${CLASS.SIGNAL}:${KIND.SIGNAL_SALE_DEFAULTS}`:
      case `${CLASS.SIGNAL}:${KIND.SIGNAL_WEIGHT}`: return [w(registryPda(o))];
      case `${CLASS.TREASURY}:${KIND.TREASURY_TOKEN_TRANSFER}`: return [w(registryPda(o)), r(treasuryPda(o)), w(vaultPda(o, p.mint)), w(vaultPda(p.dest, p.mint)), r(p.tokenProgram || TOKEN_PROGRAM_ID), w(tokenPlanPda(o, p.mint))];
      case `${CLASS.TREASURY}:${KIND.TREASURY_TOKEN_BUDGET}`: return [w(registryPda(o)), r(treasuryPda(o)), w(vaultPda(o, p.mint)), w(p.address), r(p.tokenProgram || TOKEN_PROGRAM_ID), w(tokenPlanPda(o, p.mint))];
      // the outer transaction never signs for the agent: the program does, by CPI
      case `${CLASS.ACT}:${KIND.ACT_RAW}`: return [w(registryPda(o)), r(p.program), ...p.accounts.map((a) => meta(a.key, false, (a.flags & ACT.WRITABLE) !== 0))];
      case `${CLASS.SEAT}:${KIND.SEAT_JET}`: {
        const payee = p.holderKind === HOLDER.KEY ? new PublicKey(p.holder) : treasuryPda(holderUnit(p.holder));
        return [w(registryPda(o)), w(treasuryPda(o)), w(payee)];
      }
      case `${CLASS.CODEX}:${KIND.CODEX_LADDER}`: return [w(registryPda(o)), w(salePda(o, p.saleId)), sys()];
      case `${CLASS.CODEX}:${KIND.CODEX_FOUND}`: return [w(registryPda(o)), w(registryPda(p.spec.child)), w(treasuryPda(p.spec.child)), sys()];
      case `${CLASS.SIGNAL}:${KIND.SIGNAL_OPEN_AUCTION}`: return [r(treasuryPda(o)), w(auctionPda(p.lot.auctionId)), sys()];
      default: throw new Error('unknown payload');
    }
  }

  // ---- the seal ----
  const propose = (proposer, hash, manifest, payload, impacted) => {
    const bytes = payloadBytes(payload);
    const parts = [hash, new Uint8Array([payload.cls]), u64le(payload.origin), manifest, new Uint8Array([impacted.length]), ...impacted.map(u64le), u16le(bytes.length), bytes];
    const keys = [sw(proposer), r(configPda()), w(proposalPda(hash)), sys(), ...impacted.map((u) => r(registryPda(u))), ...impacted.map((u) => w(sessionPda(hash, u)))];
    return ix(IX.PROPOSE, parts, keys);
  };
  const attest = (crank, hash, unit, votes) =>
    ix(IX.ATTEST, [hash, u64le(unit), new Uint8Array([votes.length]), ...votes.map(([voter, choice]) => cat(keyBytes(voter), new Uint8Array([choice])))],
      [sw(crank), w(registryPda(unit)), w(sessionPda(hash, unit)), r(SYSVAR_INSTRUCTIONS_PUBKEY), w(treasuryPda(unit))]);
  /** The Ed25519 precompile instruction for a batch; entries: [{pubkey, signature, message}], shared messages stored once. */
  function ed25519Instruction(entries) {
    const n = entries.length;
    const base = 2 + n * 14;
    const body = [];
    let bodyLen = 0;
    const push = (bytes) => { const off = base + bodyLen; body.push(bytes); bodyLen += bytes.length; return off; };
    const refs = entries.map((e) => { const pk = push(keyBytes(e.pubkey)); const sig = push(e.signature); return [sig, pk]; });
    const msgs = [];
    const msgOffs = entries.map((e) => {
      const found = msgs.find(([m]) => sameBytes(m, e.message));
      if (found) return found[1];
      const off = push(e.message);
      msgs.push([e.message, off]);
      return off;
    });
    const head = [n, 0];
    entries.forEach((e, i) => {
      for (const v of [refs[i][0], 0xffff, refs[i][1], 0xffff, msgOffs[i], e.message.length, 0xffff]) head.push(v & 0xff, (v >> 8) & 0xff);
    });
    return new TransactionInstruction({ programId: ED25519_PROGRAM_ID, keys: [], data: toData(cat(new Uint8Array(head), ...body)) });
  }
  /** signed: [{voter: PublicKey, choice, signature: Uint8Array(64)}] -> [precompile, attest]. Five fit a legacy transaction. */
  const attestBatch = (crank, hash, unit, signed) => [
    ed25519Instruction(signed.map((s) => ({ pubkey: s.voter, signature: s.signature, message: voteEnvelope(hash, unit, s.choice) }))),
    attest(crank, hash, unit, signed.map((s) => [s.voter, s.choice])),
  ];
  const BATCH_LEGACY = 5;
  const mandate = (crank, hash, parent, child) => ix(IX.MANDATE, [hash, u64le(parent), u64le(child)], [sr(crank), r(registryPda(parent)), w(sessionPda(hash, parent)), r(sessionPda(hash, child))]);
  const seal = (crank, hash, unit) => ix(IX.SEAL, [hash, u64le(unit)], [sw(crank), w(registryPda(unit)), w(sessionPda(hash, unit)), r(proposalPda(hash)), w(treasuryPda(unit))]);
  const execute = (crank, hash, impacted, payload) => {
    const keys = [sw(crank), r(configPda()), w(proposalPda(hash)), ...impacted.map((u) => r(sessionPda(hash, u)))];
    if (payload.cls === CLASS.CODEX) keys.push(...impacted.map((u) => r(registryPda(u))));
    keys.push(...payloadAccounts(payload, hash));
    return ix(IX.EXECUTE, [hash], keys);
  };
  const claimDividend = (claimer, hash, unit, holder, holderKind) => {
    const payee = holderKind === HOLDER.KEY ? new PublicKey(holder) : treasuryPda(holderUnit(holder));
    return ix(IX.CLAIM_DIVIDEND, [hash, holder, new Uint8Array([holderKind])], [sw(claimer), r(registryPda(unit)), w(distributionPda(hash)), w(payee)]);
  };
  /** A claim on a token distribution; payeeTokenAccount for a key holder, a unit is paid into its vault. */
  const claimTokenDividend = (claimer, hash, unit, holder, holderKind, mint, payeeTokenAccount, tokenProgram) => {
    const payee = holderKind === HOLDER.KEY ? payeeTokenAccount : vaultPda(holderUnit(holder), mint);
    return ix(IX.CLAIM_DIVIDEND, [hash, holder, new Uint8Array([holderKind])], [sr(claimer), r(registryPda(unit)), w(distributionPda(hash)), w(payee), w(escrowPda(hash)), r(treasuryPda(unit)), r(tokenProgram || TOKEN_PROGRAM_ID)]);
  };
  const closeProposal = (hash, payer, impacted) => ix(IX.CLOSE_PROPOSAL, [hash], [w(proposalPda(hash)), w(payer), ...impacted.map((u) => w(sessionPda(hash, u)))]);

  // ---- the economy ----
  /** A pull on an allowance: dest = the key payee's account or token account, or a unit payee's treasury or vault. mint: null for SOL. */
  const pull = (puller, hash, unit, amount, dest, mint, tokenProgram) => {
    const keys = [sr(puller), w(registryPda(unit)), w(treasuryPda(unit)), w(allowancePda(hash)), w(dest)];
    if (mint) keys.push(w(vaultPda(unit, mint)), r(tokenProgram || TOKEN_PROGRAM_ID), w(tokenPlanPda(unit, mint)));
    return ix(IX.PULL, [hash, u64le(amount)], keys);
  };
  const closeAllowance = (hash, payer) => ix(IX.CLOSE_ALLOWANCE, [hash], [w(allowancePda(hash)), w(payer)]);
  /** Refund a contract past its deadline (anyone), or resign it (the payee key). c as in Payload.rule. */
  const expireContract = (signer, hash, c) => ix(IX.EXPIRE_CONTRACT, [hash], [sr(signer), ...settleAccounts(hash, c, refundDest(c))]);
  /** The distribution is keyed by accrualHash(unit, seq) for the registry's current dividendSeq. */
  const accrueDividend = async (crank, unit, seq) => ix(IX.ACCRUE_DIVIDEND, [u64le(unit)], [sw(crank), w(registryPda(unit)), w(treasuryPda(unit)), w(distributionPda(await accrualHash(unit, seq))), sys()]);
  const closeDistribution = (hash, unit, payer, mint, tokenProgram) => {
    const keys = [w(distributionPda(hash)), w(treasuryPda(unit)), w(payer)];
    if (mint) keys.push(w(vaultPda(unit, mint)), w(escrowPda(hash)), r(tokenProgram || TOKEN_PROGRAM_ID));
    return ix(IX.CLOSE_DISTRIBUTION, [hash], keys);
  };
  // ---- the seat market ----
  const listSeats = (seller, unit, nonce, count, price) => ix(IX.LIST_SEATS, [u64le(unit), u64le(nonce), u64le(count), u64le(price)], [sw(seller), r(registryPda(unit)), w(listingPda(unit, seller, nonce)), sys()]);
  const buySeats = (buyer, seller, unit, nonce, count) => ix(IX.BUY_SEATS, [u64le(unit), u64le(nonce), u64le(count)], [sw(buyer), w(seller), w(registryPda(unit)), w(listingPda(unit, seller, nonce)), sys()]);
  const cancelListing = (seller, unit, nonce) => ix(IX.CANCEL_LISTING, [u64le(unit), u64le(nonce)], [sw(seller), w(listingPda(unit, seller, nonce))]);
  const closeSeatBid = (bidder, unit, sale, nonce) => ix(IX.CLOSE_SEAT_BID, [u64le(unit), u64le(sale), u64le(nonce)], [w(seatBidPda(unit, sale, bidder, nonce)), w(bidder)]);
  const closeBid = (bidder, auction) => ix(IX.CLOSE_BID, [u64le(auction)], [r(auctionPda(auction)), w(bidPda(auction, bidder)), w(bidder)]);

  // ---- views: the same offsets the program writes ----
  const headerOk = (d, disc, size) => d && d.length === size && d[0] === disc && d[1] === LAYOUT_VERSION;
  const Config = { SIZE: 68, parse: (d) => headerOk(d, DISC.CONFIG, 68) && { authority: new PublicKey(rd32(d, 2)), mode: d[35], defaultMint: new PublicKey(rd32(d, 36)) } };
  const TokenPlan = {
    SIZE: 99,
    parse(d) {
      if (!headerOk(d, DISC.TOKEN_PLAN, 99)) return null;
      return { unit: rdU64(d, 2), mint: new PublicKey(rd32(d, 10)), cap: rdU64(d, 42), spent: rdU64(d, 50), start: rdU64(d, 58), payer: new PublicKey(rd32(d, 66)) };
    },
  };
  const Treasury = { SIZE: 27, parse: (d) => headerOk(d, DISC.TREASURY, 27) && { unit: rdU64(d, 2), totalIn: rdU64(d, 10), totalOut: rdU64(d, 18) } };
  const REG = {
    OFF_TOKEN_PLAN_CAP: 168, OFF_TOKEN_PLAN_SPENT: 176,
    OFF_CODEX_WINDOW: 184, OFF_DIVIDEND_BPS: 192, OFF_DIVIDEND_PERIOD: 194, OFF_DIVIDEND_START: 202, OFF_ACCRUED_IN: 210, OFF_DIVIDEND_SEQ: 218,
    OFF_CRANK_TIP: 226, OFF_DEFAULT_MINT: 234, OFF_NAME_LEN: 266, OFF_NAME: 267, PENTAGON_LEN: 49, HOLDER_LEN: 57,
  };
  REG.OFF_DESC_LEN = REG.OFF_NAME + MAX_NAME;
  REG.OFF_DESC = REG.OFF_DESC_LEN + 1;
  REG.OFF_PENTAGONS = REG.OFF_DESC + MAX_DESC;
  REG.OFF_HOLDERS = REG.OFF_PENTAGONS + PENTAGONS * REG.PENTAGON_LEN;
  REG.SIZE = REG.OFF_HOLDERS + MAX_HOLDERS * REG.HOLDER_LEN;
  const Registry = {
    SIZE: REG.SIZE,
    parse(d) {
      if (!headerOk(d, DISC.REGISTRY, REG.SIZE)) return null;
      const pentagons = [];
      for (let k = 0; k < PENTAGONS; k++) {
        const o = REG.OFF_PENTAGONS + k * REG.PENTAGON_LEN;
        pentagons.push({ holder: rd32(d, o), kind: d[o + 32], seatedSlot: rdU64(d, o + 33), termEnd: rdU64(d, o + 41) });
      }
      const n = d[126];
      const holders = [];
      for (let i = 0; i < n; i++) {
        const o = REG.OFF_HOLDERS + i * REG.HOLDER_LEN;
        holders.push({ holder: rd32(d, o), kind: d[o + 32], seats: rdU64(d, o + 33), weight: rdU64(d, o + 41), lastActive: rdU64(d, o + 49) });
      }
      return {
        unit: rdU64(d, 2), parent: rdU64(d, 10), chairInParent: d[18], level: d[19],
        planCap: rdU64(d, 20), planPeriod: rdU64(d, 28), planSpent: rdU64(d, 36), planStart: rdU64(d, 44),
        rung: d[52], frozen: d[53] !== 0, totalSeats: rdU64(d, 54), charter: rd32(d, 62), chainSig: rd32(d, 94),
        window: rdU64(d, 128), nextSaleId: rdU64(d, 136), seatReserve: rdU64(d, 144), seatDeposit: rdU64(d, 152), lastClearing: rdU64(d, 160),
        tokenPlanCap: rdU64(d, REG.OFF_TOKEN_PLAN_CAP), tokenPlanSpent: rdU64(d, REG.OFF_TOKEN_PLAN_SPENT),
        codexWindow: rdU64(d, REG.OFF_CODEX_WINDOW), dividendBps: rdU16(d, REG.OFF_DIVIDEND_BPS), dividendPeriod: rdU64(d, REG.OFF_DIVIDEND_PERIOD),
        dividendStart: rdU64(d, REG.OFF_DIVIDEND_START), accruedIn: rdU64(d, REG.OFF_ACCRUED_IN), dividendSeq: rdU64(d, REG.OFF_DIVIDEND_SEQ), crankTip: rdU64(d, REG.OFF_CRANK_TIP), defaultMint: new PublicKey(rd32(d, REG.OFF_DEFAULT_MINT)),
        name: dec.decode(d.slice(REG.OFF_NAME, REG.OFF_NAME + Math.min(d[REG.OFF_NAME_LEN], MAX_NAME))),
        desc: dec.decode(d.slice(REG.OFF_DESC, REG.OFF_DESC + Math.min(d[REG.OFF_DESC_LEN], MAX_DESC))),
        pentagons, holders,
        chairOfUnit(unit) { const h = unitHolder(unit); const k = pentagons.findIndex((p) => p.kind === HOLDER.UNIT && sameBytes(p.holder, h)); return k < 0 ? null : k; },
        holderIndex(kind, holder) { const i = holders.findIndex((x) => x.kind === kind && sameBytes(x.holder, keyBytes(holder))); return i < 0 ? null : i; },
      };
    },
  };
  const SALE_HEAD = 84, SALE_ENTRY = 48;
  const Sale = {
    parse(d) {
      if (!d || d.length < SALE_HEAD || d[0] !== DISC.SEAT_SALE || d[1] !== LAYOUT_VERSION) return null;
      const seatCount = Number(rdU64(d, 18));
      if (d.length !== SALE_HEAD + SALE_ENTRY * seatCount) return null;
      const filled = Number(rdU64(d, 75));
      const board = [];
      for (let i = 0; i < filled; i++) { const o = SALE_HEAD + i * SALE_ENTRY; board.push({ price: rdU64(d, o), bidder: new PublicKey(rd32(d, o + 8)), nonce: rdU64(d, o + 40) }); }
      return { unit: rdU64(d, 2), saleId: rdU64(d, 10), seatCount, reserve: rdU64(d, 26), deposit: rdU64(d, 34), commitEnd: rdU64(d, 42), revealEnd: rdU64(d, 50), clearing: rdU64(d, 58), overflowPrice: rdU64(d, 66), settled: d[74] !== 0, board };
    },
  };
  const PROP = { OFF_IMPACTED: 126 };
  PROP.OFF_PAYER = PROP.OFF_IMPACTED + MAX_IMPACTED * 8;
  PROP.OFF_PAYLOAD_LEN = PROP.OFF_PAYER + 32;
  PROP.OFF_PAYLOAD = PROP.OFF_PAYLOAD_LEN + 2;
  PROP.SIZE = PROP.OFF_PAYLOAD + MAX_PAYLOAD;
  const Proposal = {
    SIZE: PROP.SIZE,
    parse(d) {
      if (!headerOk(d, DISC.PROPOSAL, PROP.SIZE)) return null;
      const n = d[124];
      const plen = rdU16(d, PROP.OFF_PAYLOAD_LEN);
      return {
        hash: rd32(d, 2), cls: d[34], origin: rdU64(d, 35), manifest: rd32(d, 43), payloadHash: rd32(d, 75),
        opened: rdU64(d, 107), expires: rdU64(d, 115), executed: d[123] !== 0,
        impacted: Array.from({ length: n }, (_, i) => rdU64(d, PROP.OFF_IMPACTED + i * 8)),
        payer: new PublicKey(rd32(d, PROP.OFF_PAYER)), payload: d.slice(PROP.OFF_PAYLOAD, PROP.OFF_PAYLOAD + Math.min(plen, MAX_PAYLOAD)),
      };
    },
  };
  const SESS = { OFF_CHAIR_VOICE: 117, CHAIR_VOICE_BYTES: 3, HOLDER_VOICE_BYTES: 38 };
  SESS.OFF_HOLDER_VOICE = SESS.OFF_CHAIR_VOICE + SESS.CHAIR_VOICE_BYTES;
  SESS.SIZE = SESS.OFF_HOLDER_VOICE + SESS.HOLDER_VOICE_BYTES;
  const voice = (bits, i) => { const v = (bits[i >> 2] >> ((i & 3) * 2)) & 3; return v === 0 ? null : v - 1; };
  const Session = {
    SIZE: SESS.SIZE,
    parse(d) {
      if (!headerOk(d, DISC.SESSION, SESS.SIZE)) return null;
      const chairVoice = d.slice(SESS.OFF_CHAIR_VOICE, SESS.OFF_CHAIR_VOICE + SESS.CHAIR_VOICE_BYTES);
      const holderVoice = d.slice(SESS.OFF_HOLDER_VOICE, SESS.OFF_HOLDER_VOICE + SESS.HOLDER_VOICE_BYTES);
      return {
        hash: rd32(d, 2), unit: rdU64(d, 34), deadline: rdU64(d, 42),
        hexPro: rdU64(d, 50), hexContra: rdU64(d, 58), hexAbst: rdU64(d, 66),
        pentPro: d[74], pentContra: d[75], pentAbst: d[76], chairMask: rdU16(d, 77), state: d[79],
        counted: d.slice(81, 105), votes: rdU32(d, 105), activeWeight: rdU64(d, 109),
        chairVoice(k) { return voice(chairVoice, k); },
        holderVoice(i) { return voice(holderVoice, i); },
        terminal() { return this.state !== STATE.VOTING; },
      };
    },
  };
  const DIST = { OFF_MINT: 71, OFF_PAYER: 103, OFF_CREATED: 135, OFF_CLAIMED: 143, CLAIM_BYTES: Math.ceil(MAX_HOLDERS / 8) };
  DIST.SIZE = DIST.OFF_CLAIMED + DIST.CLAIM_BYTES;
  const Distribution = {
    SIZE: DIST.SIZE,
    parse(d) {
      if (!headerOk(d, DISC.DISTRIBUTION, DIST.SIZE)) return null;
      const claimed = d.slice(DIST.OFF_CLAIMED, DIST.OFF_CLAIMED + DIST.CLAIM_BYTES);
      const mint = rd32(d, DIST.OFF_MINT);
      return {
        hash: rd32(d, 2), unit: rdU64(d, 34), amount: rdU64(d, 42), totalWeight: rdU64(d, 50), paid: rdU64(d, 58), claims: rdU32(d, 66),
        mint: new PublicKey(mint), isToken: isToken(mint), payer: new PublicKey(rd32(d, DIST.OFF_PAYER)), created: rdU64(d, DIST.OFF_CREATED),
        claimed(i) { return (claimed[i >> 3] >> (i & 7)) & 1; },
      };
    },
  };
  const Allowance = {
    SIZE: 180,
    parse(d) {
      if (!headerOk(d, DISC.ALLOWANCE, 180)) return null;
      const a = { hash: rd32(d, 2), unit: rdU64(d, 34), payee: rd32(d, 42), payeeKind: d[74], mint: new PublicKey(rd32(d, 75)), cap: rdU64(d, 107), period: rdU64(d, 115), start: rdU64(d, 123), spent: rdU64(d, 131), expires: rdU64(d, 139), payer: new PublicKey(rd32(d, 147)) };
      a.isToken = isToken(rd32(d, 75));
      a.available = (now) => { now = BigInt(now); if (a.expires !== 0n && now > a.expires) return 0n; return now >= a.start + a.period ? a.cap : (a.cap > a.spent ? a.cap - a.spent : 0n); };
      return a;
    },
  };
  const Contract = {
    SIZE: 164,
    parse(d) {
      if (!headerOk(d, DISC.CONTRACT, 164)) return null;
      const c = { hash: rd32(d, 2), unit: rdU64(d, 34), payee: rd32(d, 42), payeeKind: d[74], mint: new PublicKey(rd32(d, 75)), amount: rdU64(d, 107), deadline: rdU64(d, 115), arbiter: rdU64(d, 123), payer: new PublicKey(rd32(d, 131)) };
      c.isToken = isToken(rd32(d, 75));
      return c;
    },
  };
  const Listing = {
    SIZE: 67,
    parse(d) {
      if (!headerOk(d, DISC.LISTING, 67)) return null;
      return { unit: rdU64(d, 2), seller: new PublicKey(rd32(d, 10)), nonce: rdU64(d, 42), count: rdU64(d, 50), price: rdU64(d, 58) };
    },
  };
  /** A receipt from a "Program data: <base64>" log line (pass the decoded bytes), or null. */
  const RECEIPT_DOMAIN = enc.encode('polis:rcpt1');
  const RECEIPT_LEN = 125;
  const Receipt = {
    LEN: RECEIPT_LEN,
    parse(b) {
      if (!b || b.length !== RECEIPT_LEN || !sameBytes(b.slice(0, 11), RECEIPT_DOMAIN)) return null;
      return { kind: b[11], unit: rdU64(b, 12), hash: rd32(b, 20), counterparty: rd32(b, 52), mint: new PublicKey(rd32(b, 84)), amount: rdU64(b, 116), outcome: b[124] };
    },
    /** Every receipt in a transaction's log lines. */
    fromLogs(lines) {
      const out = [];
      for (const line of lines || []) {
        const m = /^Program data: (.+)$/.exec(line);
        if (!m) continue;
        const bytes = typeof Buffer !== 'undefined' ? new Uint8Array(Buffer.from(m[1], 'base64')) : Uint8Array.from(atob(m[1]), (ch) => ch.charCodeAt(0));
        const rc = Receipt.parse(bytes);
        if (rc) out.push(rc);
      }
      return out;
    },
  };

  // ---- observation: subscriptions turned into diffs ----
  /**
   * Watch a set of units and every proposal touching them. Handlers:
   *   onRegistry(unit, view, prev), onProposal(view), onSession(view, prev),
   *   onVoice({hash, unit, kind:'chair'|'holder', index, choice}) for each new voice,
   *   onSeal({hash, unit, state}) when a session turns terminal,
   *   onMandate({hash, parent, chair, choice}) when a chair bit arrives without a key vote.
   * Returns { stop() }.
   */
  function observe(connection, unitIds, handlers, opts) {
    const commitment = (opts && opts.commitment) || 'confirmed';
    const registries = new Map();
    const sessions = new Map();
    const subs = [];
    const keyOf = (pk) => pk.toBase58();

    const onSessionData = (data) => {
      const view = Session.parse(new Uint8Array(data));
      if (!view) return;
      const id = keyOf(sessionPda(view.hash, view.unit));
      const prev = sessions.get(id) || null;
      sessions.set(id, view);
      if (handlers.onVoice) {
        for (let k = 0; k < PENTAGONS; k++) {
          const now = view.chairVoice(k), was = prev ? prev.chairVoice(k) : null;
          if (now !== null && was === null) handlers.onVoice({ hash: view.hash, unit: view.unit, kind: 'chair', index: k, choice: now });
        }
        for (let i = 0; i < MAX_HOLDERS; i++) {
          const now = view.holderVoice(i), was = prev ? prev.holderVoice(i) : null;
          if (now !== null && was === null) handlers.onVoice({ hash: view.hash, unit: view.unit, kind: 'holder', index: i, choice: now });
        }
      }
      if (handlers.onSeal && view.terminal() && (!prev || !prev.terminal())) handlers.onSeal({ hash: view.hash, unit: view.unit, state: view.state });
      if (handlers.onSession) handlers.onSession(view, prev);
    };
    const onRegistryData = (data) => {
      const view = Registry.parse(new Uint8Array(data));
      if (!view) return;
      const id = view.unit.toString();
      const prev = registries.get(id) || null;
      registries.set(id, view);
      if (handlers.onRegistry) handlers.onRegistry(view.unit, view, prev);
    };
    // program-wide: every session and proposal account, filtered by discriminator and version
    const filt = (disc) => ({ memcmp: { offset: 0, bytes: bs58Encode([disc, LAYOUT_VERSION]) } });
    function bs58Encode(bytes) {
      const ALPHA = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
      let n = 0n; for (const b of bytes) n = (n << 8n) | BigInt(b);
      let s = ''; while (n > 0n) { s = ALPHA[Number(n % 58n)] + s; n /= 58n; }
      for (const b of bytes) { if (b === 0) s = '1' + s; else break; }
      return s;
    }
    subs.push(connection.onProgramAccountChange(PROGRAM_ID, (info) => onSessionData(info.accountInfo.data), commitment, [filt(DISC.SESSION)]));
    subs.push(connection.onProgramAccountChange(PROGRAM_ID, (info) => { const v = Proposal.parse(new Uint8Array(info.accountInfo.data)); if (v && handlers.onProposal) handlers.onProposal(v); }, commitment, [filt(DISC.PROPOSAL)]));
    for (const unit of unitIds) subs.push(connection.onAccountChange(registryPda(unit), (info) => onRegistryData(info.data), commitment));
    // the first read
    (async () => {
      for (const unit of unitIds) {
        const info = await connection.getAccountInfo(registryPda(unit), commitment);
        if (info) onRegistryData(info.data);
      }
      const props = await connection.getProgramAccounts(PROGRAM_ID, { commitment, filters: [filt(DISC.PROPOSAL)] });
      for (const { account } of props) { const v = Proposal.parse(new Uint8Array(account.data)); if (v && handlers.onProposal) handlers.onProposal(v); }
      const sess = await connection.getProgramAccounts(PROGRAM_ID, { commitment, filters: [filt(DISC.SESSION)] });
      for (const { account } of sess) onSessionData(account.data);
    })();
    return { stop() { for (const s of subs) connection.removeAccountChangeListener(s).catch(() => {}); }, registries, sessions };
  }

  return {
    PROGRAM_ID, ED25519_PROGRAM_ID, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID, BPF_LOADER_UPGRADEABLE_ID, RENT_SYSVAR_ID, CLOCK_SYSVAR_ID, LAYOUT_VERSION, PENTAGONS, PENTAGON_QUORUM, MAX_HOLDERS, MAX_IMPACTED, MAX_PAYLOAD, MAX_DEPTH,
    MAX_NAME, MAX_DESC, MAX_ACT_ACCOUNTS, MAX_TERM_SLOTS, CODEX_WINDOW_FACTOR, DISTRIBUTION_TTL_SLOTS, BPS,
    MIN_WINDOW_SLOTS, MAX_WINDOW_SLOTS, ACTIVE_WINDOW_SLOTS, ROOT_UNIT, LADDER, ladderT, ladderHexagons,
    IX, MODE, CLASS, KIND, ACT, RULE, RCPT, VOTE, STATE, HOLDER, DISC, ERRORS, BATCH_LEGACY, ENVELOPE_LEN, ZERO32,
    u64le, cat, text, unitHolder, holderUnit, sha256, isToken, payeeDest,
    configPda, councilPda, treasuryPda, registryPda, auctionPda, bidPda, salePda, seatBidPda, proposalPda, sessionPda, distributionPda, vaultPda, agentPda,
    allowancePda, contractPda, escrowPda, listingPda, accrualHash, upgradePda, programdataPda, tokenPlanPda,
    commitment, seatCommitment, proposalHash, voteEnvelope, signVote,
    initConfig, createTreasury, endow, syncEndowment, createVault, openAuction, commitBid, revealBid, settle, reclaim,
    commitSeatBid, revealSeatBid, settleSeats, claimSeat, reclaimSeatBid, transferSeats,
    openGenesis, foundChild, ratifyGenesis,
    Payload, payloadBytes, payloadHash, payloadAccounts,
    propose, attest, ed25519Instruction, attestBatch, mandate, seal, execute, claimDividend, claimTokenDividend, closeProposal, closeSeatBid, closeBid,
    pull, closeAllowance, expireContract, accrueDividend, closeDistribution, listSeats, buySeats, cancelListing,
    Config, Treasury, Registry, Sale, Proposal, Session, Distribution, Allowance, Contract, Listing, TokenPlan, Receipt,
    observe,
  };
}

if (typeof window !== 'undefined' && !window.PoleisClient) {
  try { window.PoleisClient = create(); } catch (e) { window.PoleisClient = { create, error: e.message }; }
}

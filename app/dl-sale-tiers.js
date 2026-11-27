// A tier names a particular sale. Missing Gold configuration never falls back to Bronze.
export const MINT_TIERS = Object.freeze({
  bronze: Object.freeze({ id: 'bronze', name: 'Bronze Mint', description: 'Whitelist pre-mint access.', usd: 10, file: './whitelist.json' }),
  gold: Object.freeze({ id: 'gold', name: 'Gold Mint', description: 'Golden Aiolos · pre-mint access.', usd: 1000, file: './whitelist-gold.json' }),
});
const GENESIS = Object.freeze({
  devnet: 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG',
  'mainnet-beta': '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d',
});
const LEGACY_ROOT = '3393240975121717647';
const PROGRAM = 'AJdsmjxQjHnBxDEdRxwEk2UMRW7bgNmvEMUwMziRTyab';
export const MAX_BID_NONCES = 16;
export class ReservationError extends Error {}
const fail = () => { throw new ReservationError('The reservation details could not be verified. Please try again later.'); };
const u64 = value => {
  if (!['string', 'bigint', 'number'].includes(typeof value) ||
      (typeof value === 'number' && !Number.isSafeInteger(value)) || !/^(0|[1-9][0-9]{0,19})$/.test(String(value))) return fail();
  const n = BigInt(value); if (n > 18446744073709551615n) return fail(); return n;
};
export function mintTier(id) {
  if (!Object.hasOwn(MINT_TIERS, id)) throw new ReservationError('Choose Bronze or Gold pre-mint access.');
  return MINT_TIERS[id];
}
export function validateSaleConfig(id, input) {
  const tier = mintTier(id);
  if (!input || input.schema !== 'dl-harmony.whitelist.v1' || input.usdPerSlot !== tier.usd ||
      (input.tier !== undefined && input.tier !== id)) return fail();
  if (input.status === 'unpublished') return null;
  if (input.status !== undefined && input.status !== 'published') return fail();
  if (!Object.hasOwn(GENESIS, input.cluster) || input.program !== PROGRAM || input.layout !== 8) return fail();
  let rpc;
  try { rpc = new URL(input.rpc); } catch { return fail(); }
  if (rpc.protocol !== 'https:' || rpc.username || rpc.password || rpc.hash) return fail();
  for (const name of ['root', 'sale', 'reserveLamports', 'depositLamports', 'commitEndSlot', 'revealEndSlot']) u64(input[name]);
  if (u64(input.reserveLamports) === 0n || u64(input.reserveLamports) !== u64(input.depositLamports) ||
      u64(input.commitEndSlot) >= u64(input.revealEndSlot) || !Number.isInteger(input.slots) || input.slots < 1 || input.slots > 150 ||
      typeof input.saleAccount !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(input.saleAccount)) return fail();
  // The old Bronze sale can never become Gold by relabelling its JSON.
  if (id === 'gold' && String(input.root) === LEGACY_ROOT && String(input.sale) === '0') return fail();
  return Object.freeze({ ...input, tier: id });
}
export function saleIdentity(cfg) { return [cfg.cluster, cfg.program, cfg.root, cfg.sale].join(':'); }
export function assertDistinctSales(bronze, gold) {
  if (bronze && gold && saleIdentity(bronze) === saleIdentity(gold)) return fail();
}
export function assertSaleEvidence({ cfg, program, saleAddress, owner, executable, head, genesisHash, slot }) {
  if (program !== cfg.program || owner !== cfg.program || executable !== false || saleAddress !== cfg.saleAccount ||
      genesisHash !== GENESIS[cfg.cluster] || !head || head.seatCount !== cfg.slots) return fail();
  for (const [field, expected] of [['unit', cfg.root], ['saleId', cfg.sale], ['reserve', cfg.reserveLamports],
    ['deposit', cfg.depositLamports], ['commitEnd', cfg.commitEndSlot], ['revealEnd', cfg.revealEndSlot]]) {
    if (u64(head[field]) !== u64(expected)) return fail();
  }
  const now = u64(slot);
  if (typeof head.settled !== 'boolean') return fail();
  if (head.settled) {
    if (now < u64(head.revealEnd) || u64(head.clearing) < u64(head.reserve) || u64(head.clearing) > u64(head.deposit)) return fail();
    return 'settled';
  }
  if (now >= u64(head.revealEnd)) return 'settle';
  return now < u64(head.commitEnd) ? 'commit' : 'reveal';
}

// The requested PDA is derived by the caller; the returned bytes must describe that exact bid.
export function readReservationBid({ account, cfg, bidderBytes, nonce }) {
  if (!account) return null;
  const d = account.data, owner = typeof account.owner === 'string' ? account.owner : account.owner?.toBase58();
  if (owner !== cfg.program || account.executable !== false || !(d instanceof Uint8Array) || d.length !== 109 ||
      d[0] !== 7 || d[1] !== cfg.layout || bidderBytes.length !== 32 ||
      !bidderBytes.every((byte, i) => d[18 + i] === byte) || ![0, 1].includes(d[106]) || ![0, 1].includes(d[107])) return fail();
  const view = new DataView(d.buffer, d.byteOffset, d.byteLength), at = n => view.getBigUint64(n, true);
  if (at(2) !== u64(cfg.root) || at(10) !== u64(cfg.sale) || at(50) !== u64(nonce) || at(90) !== u64(cfg.depositLamports)) return fail();
  const price = at(98), revealed = d[106] === 1;
  if ((revealed && (price < u64(cfg.reserveLamports) || price > at(90))) || (!revealed && price !== 0n)) return fail();
  return { nonce: at(50), deposit: at(90), price, commitment: d.slice(58, 90), revealed, done: d[107] === 1 };
}

// Only explicit actions valid under sale.rs are offered. Saved salts never prove a purchase.
export function reservationAction({ phase, bid, winner, frozen, secretMatches = false }) {
  if (!bid) return { action: null, label: 'No deposit found' };
  if (bid.done) return { action: 'close', label: 'Completed · recover account rent' };
  if (phase === 'commit') return { action: null, label: 'Deposit in escrow · waiting for reveal' };
  if (phase === 'reveal') {
    if (bid.revealed) return { action: null, label: 'Revealed · waiting for settlement' };
    return secretMatches ? { action: 'reveal', label: 'Ready to reveal' }
      : { action: null, label: 'Reveal secret is missing in this browser. Your deposit can be refunded after the reveal window.' };
  }
  if (phase === 'settle') return bid.revealed ? { action: null, label: 'Awaiting settlement' }
    : { action: 'refund', label: 'Not revealed · full deposit refundable' };
  if (phase === 'settled') {
    if (bid.revealed && winner && !frozen) return { action: 'claim', label: 'Allocated · ready to claim' };
    return { action: 'refund', label: frozen && winner ? 'Society closed · full deposit refundable' : 'Full deposit refundable' };
  }
  return fail();
}
export function bidStoreKey(cfg, wallet, nonce) {
  return `dl-harmony-bid:v2:${saleIdentity(cfg)}:${wallet}:${u64(nonce)}`;
}
export function savedBids(storage, cfg, wallet) {
  const legacy = cfg.tier === 'bronze' && cfg.cluster === 'devnet' && cfg.program === PROGRAM &&
    String(cfg.root) === LEGACY_ROOT && String(cfg.sale) === '0';
  const bids = [];
  for (let n = 0; n < MAX_BID_NONCES; n++) {
    const key = bidStoreKey(cfg, wallet, n);
    const raw = storage.getItem(key) ?? (legacy ? storage.getItem(`dl-harmony-bid:${LEGACY_ROOT}:${wallet}:${n}`) : null);
    if (!raw) continue;
    try {
      const value = JSON.parse(raw);
      if (!/^[a-f0-9]{64}$/.test(value.salt) || u64(value.price) === 0n) continue;
      // The key determines nonce; JSON cannot override it or inject another sale.
      bids.push({ nonce: BigInt(n), price: u64(value.price), salt: value.salt });
    } catch { /* An invalid record must not trigger a reveal. */ }
  }
  return bids;
}
export function solAmount(lamports) {
  const n = u64(lamports), fraction = (n % 1000000000n).toString().padStart(9, '0').replace(/0+$/, '');
  return `${n / 1000000000n}${fraction ? `.${fraction}` : ''}`;
}
export function createTierLoader(fetcher = globalThis.fetch.bind(globalThis)) {
  const requests = new Map();
  return async function load(id) {
    const tier = mintTier(id);
    if (!requests.has(id)) {
      const request = fetcher(tier.file, { cache: 'no-store', signal: AbortSignal.timeout(8000) }).then(async response => {
        if (!response.ok) throw new ReservationError('Reservation availability could not be checked. Please try again.');
        return validateSaleConfig(id, await response.json());
      }).catch(error => { requests.delete(id); throw error; });
      requests.set(id, request);
    }
    return requests.get(id);
  };
}

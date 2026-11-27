// dl-mint-ledger.js · THE MINT'S LEDGER IS SOLANA'S (his Oct 21 2026 WEST: "it's all sedimented on solana as source of truth"; before it: "is there
// persistence among hexs? remember the floating vs anchored hex thing or not?"): the paid seats read off mainnet in the order the chain sealed them,
// folded through his land law (lab/mint-gravity.mjs) into the one world every screen draws.
//
// A SEAT ON CHAIN is the checkout's one transaction (dl-direct-protocol.mjs paymentMessage): a System transfer from the buyer to PAYEE and a Memo
// `optimism.fit:premint:v1:<order>:<tier>:<buyer>`. Read: the recipient's signatures (getSignaturesForAddress: newest first, each with its memo), the
// memo of that form and the transaction a success; then each transaction itself (getTransaction, jsonParsed): a transfer from the memo's buyer to the
// recipient of at least FLOOR[tier] lamports and that memo (a dust transfer under a gold memo is no seat; the exact quote is the checkout's to keep).
// The order is the chain's: by slot, then by signature (a rule every screen shares). A seat's identity is its signature. Nothing else is read: no
// server, no wallet shown, no name.
//
// HIS LAND LAW (mint-gravity.mjs, his Oct 14 04:1x: "people can purchase hexs and they have gravity if they are golden one, they can be bronze ones
// and they just float and relocate"): the world at the hero's vessel on the stop (the law's rung 3, 150 places: the same faces, in the same order, as
// the sphere there), each seat in the chain's order bought on the land the law gives it, the same on every screen since no memo names a hexagon: a gold
// takes the frontier's cell (the law's open land farthest from every mass) nearest the front, a bronze the open cell nearest the front; the front is
// the film's (FRONT: the direction that faces the eye in the film's own pose on the stop, warm-sphere.js), and a cell behind his circle (within CLEAR
// of the front) or on the far side comes after every cell in sight. A gold is anchored: it stays, and becomes a mass the land nearer to it than to
// its own mass now rides. A bronze floats: it rides its home mass (one of the twelve chairs, or a gold).
import {createMint} from '../lab/mint-gravity.mjs';
import {PAYEE} from './dl-direct-protocol.mjs';

export const RPCS = Object.freeze(['https://solana-rpc.publicnode.com', 'https://api.mainnet-beta.solana.com']);
export const FLOOR = Object.freeze({bronze: 5000000, gold: 500000000});   // lamports: 0.005 SOL and 0.5 SOL, a seat's price at any SOL under $2,000
export const RUNG = 3;                                                    // the law's rung of the hero's vessel on the stop (150 places)
export const CLEAR = Math.asin(.62 * 1.06);                               // his circle's reach from the front, in radians of the sphere
/** FILM_FRONT: the film's own front on the stop (warm-sphere.js MINT_FRONT: the direction of the sphere that faces the eye in the film's pose there), held here so
 *  every ball folds the mints from the one front without loading the film's module; the test holds the two together. */
export const FILM_FRONT = Object.freeze([0.4964649992742744, -0.11971220728891936, -0.8597624624985726]);
export const MEMO_FORM = /^optimism\.fit:premint:v1:([0-9a-f-]{36}):(bronze|gold):([1-9A-HJ-NP-Za-km-z]{32,44})$/;

/** A memo as getSignaturesForAddress reports it ("[n] text", several joined by "; "): the seat's {order, tier, buyer}, or null. Pure. */
export function seatMemo(memo) {
  if (typeof memo !== 'string') return null;
  for (const part of memo.split('; ')) {
    const text = part.replace(/^\[\d+\] /, ''), m = MEMO_FORM.exec(text);
    if (m) return {order: m[1], tier: m[2], buyer: m[3], memo: text};
  }
  return null;
}
/** The seats a page of getSignaturesForAddress names (successes with a seat's memo): {signature, slot, tier, buyer, order, memo}. Pure. */
export function seatsOfSignatures(list) {
  const seats = [];
  for (const s of Array.isArray(list) ? list : []) {
    if (!s || s.err || typeof s.signature !== 'string' || !Number.isSafeInteger(s.slot)) continue;
    const m = seatMemo(s.memo);
    if (m) seats.push({signature: s.signature, slot: s.slot, ...m});
  }
  return seats;
}
/** Whether a transaction (getTransaction, jsonParsed) is that seat: a success, a transfer from its buyer to the recipient of FLOOR[tier] at least, and
 *  its memo. Pure. */
export function isSeat(tx, seat) {
  if (!tx || tx.meta?.err !== null || !seat) return false;
  const ins = tx.transaction?.message?.instructions ?? [];
  const paid = ins.some((i) => i?.program === 'system' && i.parsed?.type === 'transfer' && i.parsed.info?.source === seat.buyer &&
    i.parsed.info?.destination === PAYEE && Number(i.parsed.info?.lamports) >= FLOOR[seat.tier]);
  const said = ins.some((i) => i?.program === 'spl-memo' && i.parsed === seat.memo);
  return paid && said;
}
/** The chain's order: by slot, then by signature. Pure. */
export const chainOrder = (a, b) => a.slot - b.slot || (a.signature < b.signature ? -1 : a.signature > b.signature ? 1 : 0);

const call = async (fetcher, rpc, body) => {
  const response = await fetcher(rpc, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify(body), signal: AbortSignal.timeout(12000)});
  if (!response.ok) throw new Error(`${rpc} ${response.status}`);
  return response.json();
};
/** readSeats({fetcher, rpcs, known}): the seats on chain, verified, in the chain's order. known: seats already verified (their signatures are not read
 *  again; the newest of them bounds the read). Throws when no RPC answers (the caller keeps what it had). */
export async function readSeats({fetcher = (...a) => fetch(...a), rpcs = RPCS, known = []} = {}) {
  const have = new Map(known.map((s) => [s.signature, s])), newest = known.length ? [...known].sort(chainOrder).at(-1).signature : null;
  let lastError = null;
  for (const rpc of rpcs) {
    try {
      const found = [];
      let before = null;
      for (let page = 0; page < 3; page++) {
        const params = [PAYEE, {limit: 1000, commitment: 'confirmed', ...(before ? {before} : {}), ...(newest ? {until: newest} : {})}];
        const answer = await call(fetcher, rpc, {jsonrpc: '2.0', id: 1, method: 'getSignaturesForAddress', params});
        if (answer.error || !Array.isArray(answer.result)) throw new Error(answer.error?.message || 'no signatures');
        found.push(...answer.result);
        if (answer.result.length < 1000) break;
        before = answer.result.at(-1).signature;
      }
      const candidates = seatsOfSignatures(found).filter((s) => !have.has(s.signature));
      for (let i = 0; i < candidates.length; i += 50) {
        const chunk = candidates.slice(i, i + 50);
        const answers = await call(fetcher, rpc, chunk.map((s, k) => ({jsonrpc: '2.0', id: k, method: 'getTransaction',
          params: [s.signature, {encoding: 'jsonParsed', maxSupportedTransactionVersion: 0, commitment: 'confirmed'}]})));
        if (!Array.isArray(answers)) throw new Error('no transactions');
        for (const a of answers) { const s = chunk[a?.id]; if (s && isSeat(a.result, s)) have.set(s.signature, s); }
      }
      return [...have.values()].sort(chainOrder);
    } catch (error) { lastError = error; }
  }
  throw lastError ?? new Error('no RPC');
}
// the review's golds by holder, in turn: the second gold raises the first's hexagon, then a race (a, b, c and d, a climbing furthest)
const REVIEW_HOLDERS = Object.freeze(['a', 'a', 'b', 'a', 'c', 'b', 'a', 'd']);
/** n seats of the lab's own for his review (?pour=N on the house's doors: dl-mint-flask.js reviewPourOf): one in five gold, in order, the golds held by
 *  REVIEW_HOLDERS in turn (a gold bought again by its holder raises it). Pure. */
export function reviewSeats(n, from = 0) {
  return Array.from({length: Math.max(0, n)}, (_, k) => {
    const i = from + k;
    const gold = (i + 1) % 5 === 0, g = Math.floor((i + 1) / 5) - 1;   // g: this gold's place among the review's golds
    return {signature: `review-${String(i + 1).padStart(3, '0')}`, slot: i + 1, tier: gold ? 'gold' : 'bronze', buyer: gold ? `review-gold-${REVIEW_HOLDERS[g % REVIEW_HOLDERS.length]}` : null, order: null, memo: null};
  });
}

const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
/** The front's place among the cells: in sight and clear of his circle first (the nearest the front first), then behind his circle, then the far side. */
const nearFront = (front) => (cell) => {
  const a = Math.acos(Math.max(-1, Math.min(1, dot(cell.dir, front))));
  return (a < Math.PI / 2 ? (a >= CLEAR ? 0 : 1) : 2) * 10 + a;
};
// A GOLD RISES (his Oct 28 2026 03:2x WET, over the liquor scene: "bronze hexagons are floating and cannot be upgraded; golden hexagons are anchored
// and can be upgraded in height like extruding radially outwards"): a gold bought again by the wallet that holds a gold takes no new land; it raises
// its holder's hexagon one level (warm-sphere.js draws a level as a band of the prism standing out of the glass). A bronze is never raised: each one
// is its own floating hexagon, whoever bought it.
/** foldWorld(seats, front): the world the chain's seats make on the hero's vessel by his land law: for each seat (in the chain's order) that takes
 *  land, its cell {face (the vessel's hexagon), metal, home ('chair:N' or 'gold:ID'), anchored, level (a gold's: 1 and one more for each gold its
 *  holder bought again; a bronze's: 1)}; a gold bought again takes none. The same seats and front, the same world. Pure. */
export function foldWorld(seats, front) {
  const mint = createMint();
  for (let r = 0; r < RUNG; r++) mint.expand();
  const place = nearFront(front), out = new Map(), goldOf = new Map();   // goldOf: a holder's wallet -> the signature of the gold that took their land
  for (const seat of seats) {
    const metal = seat.tier === 'gold' ? 'gold' : 'bronze';
    if (metal === 'gold' && seat.buyer && goldOf.has(seat.buyer)) { out.get(goldOf.get(seat.buyer)).level++; continue; }   // raised, not placed
    const open = mint.cells().filter((c) => !c.holder);
    if (!open.length) break;
    const pool = metal === 'gold' && mint.frontier().length ? mint.frontier() : open;
    const cell = pool.reduce((best, c) => place(c) < place(best) ? c : best);
    const r = mint.buy(cell.face, metal);
    if (r.why) continue;
    out.set(seat.signature, {face: cell.face, metal, level: 1});
    if (metal === 'gold' && seat.buyer) goldOf.set(seat.buyer, seat.signature);
  }
  // the homes as they stand after every purchase (a gold bought later captures the land nearer to it)
  for (const cell of mint.cells()) {
    if (!cell.holder) continue;
    for (const [signature, held] of out) if (held.face === cell.face) out.set(signature, {...held, home: cell.home, anchored: held.metal === 'gold'});
  }
  return out;
}
// FOLLOW THE COUNT (his Nov 19 2026 "Follow the count", asked which floor all three balls share, starting with the mint page's freeze): this one fold, from the film's
// front, is the floor of Swarmbook's front, the welcome's ball and the mint page's sphere, so a mint stands on the same hexagon on every one of them.
// THE BALL IS SOLANA'S STATE (his Nov 19 2026 16:57 UTC, over Swarmbook's front: "you over there got a fucking static unit0... you forgot that the hexagon count
// and the hexagon IDs are supposed to live on solana dude"; before it, Oct 21: "i would like the dodecahedron there to start doing goldberg expansion as the mints
// are happening on solana"; Sept 9: "it is supposed to start small and gradually as people come here, they are supposed to be minting new hexagons").
/** foldFloor(seats, front): the floor the seats make when the rung follows the count: the dodecahedron with no seat; each seat, in the chain's order, buys by the
 *  land law; a full floor climbs a rung first, every held hexagon keeping its place by the law. The ball this floor is drawn on turns, so a seat takes the open
 *  land farthest from every held hexagon (a gold among the frontier's cells), the first of all in sight and clear of his circle, nearest the front (the film's
 *  stop shows it there): every side of the ball has its faces. -> {rung, capacity, held: [{face (the rung's hexagon), metal, signature, n, home, anchored}]}. The
 *  same seats and front, the same floor. Pure. */
export function foldFloor(seats, front) {
  const mint = createMint(), by = new Map(); let reach = new Map();   // reach: an open cell -> the cosine to its nearest held hexagon (-1 with none held)
  const mark = () => { const held = mint.cells().filter((c) => c.holder); reach = new Map(mint.cells().filter((c) => !c.holder).map((c) => [c, held.reduce((m, h) => Math.max(m, dot(c.dir, h.dir)), -1)])); };
  const place = nearFront(front), lone = (c) => reach.get(c) + 1e-4 * place(c);   // the least: the farthest from the held, then in sight and clear of his circle, nearest the front
  for (const seat of seats) {
    if (!reach.size) { if (!mint.expand()) break; mark(); }          // the floor is full (or the dodecahedron): a rung more; past the last rung no land is left
    const metal = seat.tier === 'gold' ? 'gold' : 'bronze', dots = metal === 'gold' ? mint.frontier() : [];
    const cell = (dots.length ? dots : [...reach.keys()]).reduce((best, c) => (lone(c) < lone(best) ? c : best)), r = mint.buy(cell.face, metal);
    if (r.why) continue;
    by.set(r.holder, seat); reach.delete(cell); for (const [c, m] of reach) { const d = dot(c.dir, cell.dir); if (d > m) reach.set(c, d); }
  }
  const {rung, capacity} = mint.state();
  return {rung, capacity, held: mint.cells().filter((c) => c.holder).map((c) => ({face: c.face, metal: c.holder.metal, signature: by.get(c.holder).signature, n: by.get(c.holder).slot ?? null, home: c.home, anchored: c.holder.metal === 'gold'}))};
}
/** worldOf(seats, front): the floor as the mint page's sphere reads it: signature -> {face, metal, home, anchored, level 1}, the floor's rung and capacity on it. Pure. */
export function worldOf(seats, front) {
  const f = foldFloor(seats, front), world = new Map(f.held.map((h) => [h.signature, {face: h.face, metal: h.metal, home: h.home, anchored: h.anchored, level: 1}]));
  return Object.assign(world, {rung: f.rung, capacity: f.capacity});
}

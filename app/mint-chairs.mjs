// mint-chairs.mjs: THE TWELVE CHAIRS' LAW, one place for the Worker (worker/premint.mjs, GET /api/premint/chairs), the page's reader
// (dl-mint-chairs.mjs) and the glass (lab/mint-liquor-scene.mjs setSeats, lab/unboxing.js). His words, Oct 17 2026 02:3x WEST, over the
// mint's glass: "when you enter the mint mode, you must still be fucking 12 dodecahedrons only... the 12 is gonna be top donors (remember we
// need to fucking stimulate, so remember this is time-limited... only for 7 days this can be purchased and after that the $WARM swarm is
// geenesissn)".
// THE SEVEN DAYS are the mint's own: dl-paywall.js LAUNCH_DAY and MINT_DAYS (his), mintState their one definition, read at each request. A
// seat counts for a chair when its order was quoted before the close (created_at, the Worker's clock at the quote: a quote lives 90 s, so the
// last minute's buyer keeps the chair it paid for). After the close the glass is the $WARM swarm's genesis (chairForm).
// HIS CALLS, asked on "Your hand" (seq 385368, Oct 17 2026 03:1x WEST): what ranks a donor (CHAIR_RANK) and what a held chair shows
// (CHAIR_SHOWS). null until he answers: then nothing is ranked and no chair shows held. One chair a wallet; a tie goes to whoever paid first
// (the lower finalized slot). Pure: no clock, no network, no DOM.
import {TIERS} from './dl-direct-protocol.mjs';

export const CHAIRS = 12;
export const RANKS = Object.freeze(['sum', 'single']);
export const SHOWS = Object.freeze(['gold', 'profile']);
// 'sum': the dollars a wallet paid for its seats (TIERS: Bronze Mint $10, Golden Aiolos $1,000); 'single': its largest single seat. His.
export const CHAIR_RANK = null;
// 'gold': a held chair shows only its gold; 'profile': also the holder's X name and avatar, when the buyer gave one at checkout. His.
export const CHAIR_SHOWS = null;

/** The glass's form in a phase of the mint (dl-paywall.js mintState(now).phase): the twelve chairs through the seven days, the swarm after. */
export function chairForm(phase) { return phase === 'closed' ? 'swarm' : 'chairs'; }

/**
 * The top donors from paid order rows {buyer, tier, created_at (s), paid_slot, handle, avatar_url}: at most CHAIRS, one a wallet, ranked by
 * `rule`; a row quoted at or after `end` (ms, the close; null while there is none) does not count. Each chair is {rank, usd}, and
 * {handle, avatarUrl} too when `shows` is 'profile' and the buyer gave one (its latest). No wallet address leaves here.
 */
export function rankDonors(rows, {rule = CHAIR_RANK, shows = CHAIR_SHOWS, end = null} = {}) {
  if (!RANKS.includes(rule) || !Array.isArray(rows)) return [];
  const wallets = new Map();
  for (const row of rows) {
    const usd = TIERS[row?.tier]?.usd, slot = row?.paid_slot;
    if (!Number.isSafeInteger(usd) || typeof row.buyer !== 'string' || !row.buyer || !Number.isSafeInteger(slot) || slot < 0) continue;
    if (end !== null && !(Number(row.created_at) * 1000 < end)) continue;
    let w = wallets.get(row.buyer);
    if (!w) wallets.set(row.buyer, w = {buyer: row.buyer, sum: 0, sumSlot: -1, best: 0, bestSlot: Infinity, face: null, faceSlot: -1});
    w.sum += usd; w.sumSlot = Math.max(w.sumSlot, slot);                                          // the sum, reached at its last payment
    if (usd > w.best || (usd === w.best && slot < w.bestSlot)) { w.best = usd; w.bestSlot = slot; }   // the first payment of its largest seat
    if (typeof row.handle === 'string' && row.handle && typeof row.avatar_url === 'string' && row.avatar_url && slot > w.faceSlot) {
      w.face = {handle: row.handle, avatarUrl: row.avatar_url}; w.faceSlot = slot;
    }
  }
  const score = rule === 'sum' ? w => [w.sum, w.sumSlot] : w => [w.best, w.bestSlot];
  return [...wallets.values()].sort((a, b) => {
    const [av, as] = score(a), [bv, bs] = score(b);
    return bv - av || as - bs || (a.buyer < b.buyer ? -1 : a.buyer > b.buyer ? 1 : 0);
  }).slice(0, CHAIRS).map((w, i) => ({rank: i + 1, usd: rule === 'sum' ? w.sum : w.best, ...(shows === 'profile' && w.face ? w.face : {})}));
}

/** An answer of GET /api/premint/chairs as the glass takes it: {status: 'live', phase, rule, shows, held: [{rank, usd, handle?, avatarUrl?}]}. */
export function chairsOf(answer) {
  const phases = ['unset', 'before', 'open', 'closed'];
  if (!answer || typeof answer !== 'object' || !phases.includes(answer.phase) || !Array.isArray(answer.held)) return {status: 'unknown', held: []};
  const held = [];
  for (const chair of answer.held) {
    if (!Number.isSafeInteger(chair?.rank) || chair.rank !== held.length + 1 || held.length >= CHAIRS || !Number.isSafeInteger(chair.usd) || chair.usd <= 0) break;
    held.push({rank: chair.rank, usd: chair.usd, ...(typeof chair.handle === 'string' && typeof chair.avatarUrl === 'string' ? {handle: chair.handle, avatarUrl: chair.avatarUrl} : {})});
  }
  return {status: 'live', phase: answer.phase, rule: RANKS.includes(answer.rule) ? answer.rule : null, shows: SHOWS.includes(answer.shows) ? answer.shows : null, held};
}

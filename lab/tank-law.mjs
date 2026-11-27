// tank-law.mjs · THE TANK (Oct 16 2026): the syrup glass (syrup-glass.html) as the MiniRouter tank, pure. His words: Sept 7 2026 "money in vault /
// money lands in tank (fuel) / agents are getting paid"; Sept 18 "i want you to turn the unit0 of every swarm as the 'tank fuel'"; Sept 21 09:59
// "every time we use tokens i wanna see like in league of legends the DPS or any number flashing to screen showing me how much i spent"; Sept 21
// 20:09 "why the fuck astra or anyone has demolished the fucking shit i had spent time building? the blobby at the center and the gasoline and the
// mmo shit dps"; Oct 11 11:12 "show the tankfuel there as well"; Oct 16, over the syrup glass: "you see that glass over there my man? can you please
// focus on what i had for minirouter... the fucking MMO-like when tank-fuel is consumed by calling agents".
//
// WHAT IT READS (the same two refs her purse reads, lyssajudron-purse.mjs; nothing is invented): house/purse (tools/embertide-mesh/lib/house-purse.mjs
// writes it on a cause: the router's posted credit, what calls in flight hold, the tank's level in [0, 1], the newest calls as burns with their own ids
// and times) and mint/drops (the mint's sales as drops: gold or bronze). No purse, nothing: no level, no balance, no number.
//
// THE LAW. The level is the purse's (the syrup's height in the pouch). A burn row is taken ONCE by its id; one on the Nest before this glass's first
// picture is history and never flies; a newer one is a cause: a number flies from the surface (its cost, its lane, its tokens in), sparks rise, the
// surface takes a sip. A number lives POP_MS. The burn rate under the balance is the cost of the calls of the last DPS_WINDOW_MS, a minute, as dollars
// a minute (his DPS). A sale is a cause once by its id too: a drop of its metal into the pouch. A reading no newer than the one held (its rev) moves
// nothing. Every instant is the one handed in: no clock and no timer of its own.
export const PURSE_REF = 'house/purse', PURSE_SCHEMA = 'embertide.purse/v1';
export const DROPS_REF = 'mint/drops', DROPS_SCHEMA = 'embertide.mint-drops/v1';
export const POP_MS = 1800, POPS_MAX = 12, DPS_WINDOW_MS = 60000, SEEN_MAX = 512, BURNS_KEPT = 256;
export const SPARKS = Object.freeze({ n: 10, life_ms: 700 });     // the sparks of one call: how many, how long they fly
export const SIP = Object.freeze({ amp: 0.22, radius: 0.35 });    // the surface's sip at a call: a small splat (amp as the drops', radius in cells)

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

/** readPurse(value): the tank as house/purse holds it, or null when the value is not that ref's. */
export function readPurse(v) {
  if (!v || typeof v !== 'object' || v.schema !== PURSE_SCHEMA) return null;
  const burns = [];
  if (Array.isArray(v.burns)) for (const b of v.burns) {
    if (!b || typeof b.id !== 'string' || !b.id || !num(b.at_ms) || !num(b.cost_usd) || b.cost_usd < 0) continue;
    burns.push({ id: b.id, at_ms: b.at_ms, cost_usd: b.cost_usd, in: num(b.in) && b.in >= 0 ? Math.round(b.in) : null, lane: typeof b.lane === 'string' && b.lane ? b.lane.slice(0, 24) : null });
  }
  return {
    level: num(v.level) ? clamp(v.level, 0, 1) : null,
    posted: num(v.posted_usd) ? v.posted_usd : null,
    reserved: num(v.reserved_usd) && v.reserved_usd > 0 ? v.reserved_usd : 0,
    full: num(v.full_usd) ? v.full_usd : null,
    at_ms: num(v.ledger?.at_ms) ? v.ledger.at_ms : null,
    burns,
  };
}

/** readDrops(value): the mint's sales as mint/drops lists them: [{id, at_ms, metal}]; [] when it is not that ref's. */
export function readDrops(v) {
  if (!v || typeof v !== 'object' || v.schema !== DROPS_SCHEMA || !Array.isArray(v.drops)) return [];
  const out = [];
  for (const d of v.drops) if (d && typeof d.id === 'string' && d.id && num(d.at_ms) && (d.metal === 'gold' || d.metal === 'bronze')) out.push({ id: d.id, at_ms: d.at_ms, metal: d.metal });
  return out;
}

/** costText(usd): "$315.67", "$0.009" and "$0.0094": the cents a person reads, the thousandths of a call. */
export const costText = (usd) => !num(usd) ? '' : usd >= 1 || usd === 0 ? '$' + usd.toFixed(2) : usd >= 0.01 ? '$' + usd.toFixed(3) : '$' + usd.toFixed(4);
/** tokensText(n): "1.8k", "24k", "312". */
export const tokensText = (n) => !num(n) ? '' : n >= 10000 ? Math.round(n / 1000) + 'k' : n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(Math.round(n));

/**
 * createTank({now}): the law. take(value, {rev, ref, at}) takes a reading of house/purse or mint/drops as the Nest handed it (at: the instant, by
 * default now()) and returns false when nothing moves (junk, a replay) or {causes: [{kind: 'burn', id, at_ms, cost_usd, in, lane} | {kind: 'drop', id,
 * at_ms, metal}], level, posted}. pops(at): the numbers in the air [{id, t0, k (0 at birth, 1 at death), cost_usd, lane, in}]. dps(at): {usd_per_min,
 * calls} over the last minute. state(): what is held.
 */
export function createTank({ now = () => Date.now() } = {}) {
  const S = { first_ms: now(), purse: null, rev: null, drev: null, seen: new Set(), seenDrops: new Set(), pops: [], burns: [], counts: { takes: 0, replays: 0, history: 0, burns: 0, drops: 0 } };
  const pops = (at = now()) => { S.pops = S.pops.filter((p) => at < p.t0 + POP_MS); return S.pops.map((p) => ({ ...p, k: clamp((at - p.t0) / POP_MS, 0, 1) })); };
  const dps = (at = now()) => {
    let usd = 0, calls = 0;
    for (const b of S.burns) if (b.at_ms > at - DPS_WINDOW_MS && b.at_ms <= at) { usd += b.cost_usd; calls++; }
    return { usd_per_min: Math.round(usd * (60000 / DPS_WINDOW_MS) * 1e4) / 1e4, calls };
  };
  function remember(b) {   // the burns the rate counts: bounded, newest last, once by id
    S.burns.push(b);
    if (S.burns.length > BURNS_KEPT) S.burns.splice(0, S.burns.length - BURNS_KEPT);
  }
  function takePurse(value, rev, at) {
    if (num(rev) && num(S.rev) && rev <= S.rev) { S.counts.replays++; return false; }
    const p = readPurse(value);
    if (num(rev)) S.rev = rev;
    S.counts.takes++;
    if (!p) { S.purse = null; S.pops = []; return { causes: [], level: null, posted: null }; }   // the Nest holds no purse: nothing is drawn
    const causes = [];
    for (const b of p.burns) {
      if (S.seen.has(b.id)) continue;
      S.seen.add(b.id); remember(b);
      if (b.at_ms < S.first_ms) { S.counts.history++; continue; }   // on the Nest before this glass's first picture: at rest
      if (at >= b.at_ms + POP_MS) { S.counts.history++; continue; } // its flight already over on the clock: at rest
      S.counts.burns++;
      S.pops.push({ id: b.id, t0: b.at_ms, cost_usd: b.cost_usd, lane: b.lane, in: b.in });   // from the row's own time: the same flight on every glass
      causes.push({ kind: 'burn', id: b.id, at_ms: b.at_ms, cost_usd: b.cost_usd, in: b.in, lane: b.lane });
    }
    if (S.pops.length > POPS_MAX) S.pops.splice(0, S.pops.length - POPS_MAX);
    if (S.seen.size > SEEN_MAX) S.seen = new Set(p.burns.map((b) => b.id));   // only the rows the ref still lists can come again
    S.purse = p;
    return { causes, level: p.level, posted: p.posted };
  }
  function takeDrops(value, rev, at) {
    if (num(rev) && num(S.drev) && rev <= S.drev) { S.counts.replays++; return false; }
    if (num(rev)) S.drev = rev;
    const causes = [];
    for (const d of readDrops(value)) {
      if (S.seenDrops.has(d.id)) continue;
      S.seenDrops.add(d.id);
      if (d.at_ms < S.first_ms) { S.counts.history++; continue; }
      S.counts.drops++;
      causes.push({ kind: 'drop', id: d.id, at_ms: d.at_ms, metal: d.metal });
    }
    if (S.seenDrops.size > SEEN_MAX) S.seenDrops = new Set(readDrops(value).map((d) => d.id));
    return { causes, level: S.purse ? S.purse.level : null, posted: S.purse ? S.purse.posted : null };
  }
  return {
    take(value, { rev = null, ref = PURSE_REF, at = now() } = {}) { return ref === DROPS_REF ? takeDrops(value, rev, at) : takePurse(value, rev, at); },
    pops, dps,
    state: () => ({ first_ms: S.first_ms, rev: S.rev, drev: S.drev, level: S.purse ? S.purse.level : null, posted: S.purse ? S.purse.posted : null, reserved: S.purse ? S.purse.reserved : 0,
      full: S.purse ? S.purse.full : null, pops: S.pops.length, seen: S.seen.size, burns: S.burns.length, counts: { ...S.counts } }),
  };
}

// mint-clock.mjs: FINANCIAL TIME over the land grab. His word, Oct 14 2026 07:20 WEST, in this lane: "the time is not going to be
// wall-clock time my dude... it is going to be financial time". The clock of this mint is its ledger: it ticks when money lands, a
// dollar a tick, so a gold is a hundred bronzes of time and a day with no sale is no time at all. The land (mint-gravity.mjs) is
// folded from a log of causes, and the causes are purchases; an expansion is no cause but the clock reaching a mark: a rung opens
// when the money in equals the worth of the sphere as it stands at the floor price, so a floor sold out in bronze opens the next
// rung at its last seat (every held cell paid at least the floor), and one gold at genesis opens two. The last rung opens like the
// others; the end is the land: nothing left to sell. No date anywhere: the wall clock survives only as a stamp on each cause, for
// the record, and is never read. His three calls stay open, as parameters, never decided here: the gate (`gate` 'mark', the above;
// or 'vote', the holders' unanimous vote of his Sep 9 rule, a cause of kind 'open'); the price rise a rung (`rise`, 0 is the live
// mint's $10 and $1,000 on every rung, and the marks follow it); real money or reservations (every dollar here is nobody's).
// Cost: a purchase is the mint's (a bronze O(1), a gold O(cells)); a replay to a point of the axis folds the log from genesis,
// each expansion O(cells x faces) (the test prints the CPU ms of a whole arc to 630 seats); nothing runs between causes.
import {createMint, mulberry, LADDER, PRICE} from './mint-gravity.mjs';

/** The floor price of a metal on a rung: the live mint's on rung 1, risen by `rise` a rung after it (his call; 0 in the lab). */
export function priceAt(metal, rung, rise = 0) { return Math.round(PRICE[metal] * (1 + rise) ** Math.max(0, rung - 1)); }

/** The money axis. `opens[k]` is the dollar at which rung k opens: rung 1 at genesis ($0), rung k+1 at the worth of rung k's
 *  sphere at the floor prices of the rungs its land was born in. `worth` is the whole sphere's: where the land runs out at the floor. */
export function marks(ladder = LADDER, rise = 0) {
  const opens = [null, 0];
  let worth = 0;
  for (let k = 1; k < ladder.length; k++) {
    worth += (ladder[k] - ladder[k - 1]) * priceAt('bronze', k, rise);
    if (k + 1 < ladder.length) opens.push(worth);
  }
  return {opens, worth};
}

/** The pace of a play: cause k of K lands at second s(k) of `seconds`, the crowd `growth`-fold bigger at the end than at the
 *  start (compounding: a doubling every seconds / log2(growth)); s(0) = 0, s(K) = seconds. Wall-clock pacing for the eye only. */
export function pace(K, {seconds = 60, growth = 16} = {}) {
  const g = Math.log(growth) / seconds;
  return k => Math.log(1 + k * (growth - 1) / Math.max(1, K)) / g;
}

export function createClock({ladder = LADDER, rise = 0, gate = 'mark', now = () => Date.now()} = {}) {
  if (gate !== 'mark' && gate !== 'vote') throw new RangeError("the gate is 'mark' (the clock) or 'vote' (the holders)");
  const price = (metal, rung) => priceAt(metal, rung, rise);
  const axis = marks(ladder, rise), top = ladder.length - 1;
  const mint = createMint({ladder, price});
  let log = [], openAtTop = null;

  /** the mint opens: the first floor is open land, the clock at $0; the one entry that is not a purchase */
  function genesis(at = now()) {
    mint.reset(); mint.expand(); openAtTop = top === 1 ? mint.state().open : null;
    log = [{n: 0, kind: 'genesis', t: 0, at}];
  }
  const t = () => mint.state().treasury;
  function climbed(step) { if (step.rung === top) openAtTop = mint.state().open; return step; }

  /** gate 'mark': every rung the clock has reached opens now; the rungs climbed */
  function settle() {
    const opened = [];
    if (gate !== 'mark') return opened;
    for (;;) {
      const st = mint.state(), mark = axis.opens[st.rung + 1];
      if (mark == null || st.treasury < mark) break;
      const step = mint.expand();
      if (!step) break;
      opened.push(climbed(step));
    }
    return opened;
  }

  /** the cause: a purchase of the land `ref` (a face index, or a land id for a log) in a metal; the clock advances by what was paid */
  function buy(ref, metal, at = now()) {
    const cells = mint.cells(), index = typeof ref === 'string' ? cells.findIndex(c => c.id === ref) : ref, cell = cells[index];
    if (!cell) return {why: 'no land there'};
    const r = mint.buy(index, metal);
    if (r.why) return r;
    const entry = {n: log.length, kind: 'buy', land: cell.id, metal, paid: r.paid, t: t(), at};
    log.push(entry);
    return {...r, entry, opened: settle()};
  }

  /** gate 'vote': the holders' unanimous vote opens the next rung, a cause of its own */
  function open(at = now()) {
    if (gate !== 'vote') return {why: 'the gate here is the mark: the clock opens the rungs'};
    const step = mint.expand();
    if (!step) return {why: 'the top rung: nothing more opens'};
    climbed(step);
    const entry = {n: log.length, kind: 'open', capacity: step.capacity, t: t(), at};
    log.push(entry);
    return {step, entry};
  }

  /** fold a log onto a fresh genesis, up to and including the last cause with t <= upTo dollars; the stamps are copied, never read */
  function load(entries, upTo = Infinity) {
    if (!entries.length || entries[0].kind !== 'genesis') throw new Error('a log begins at genesis');
    genesis(entries[0].at);
    for (const e of entries.slice(1)) {
      if (e.t > upTo) break;
      const r = e.kind === 'buy' ? buy(e.land, e.metal, e.at) : e.kind === 'open' ? open(e.at) : {why: `no cause of kind ${e.kind}`};
      if (r.why) throw new Error(`the log does not fold at #${e.n} (${e.kind} ${e.land ?? ''} ${e.metal ?? ''}): ${r.why}`);
      if (r.entry.t !== e.t || r.entry.paid !== e.paid) throw new Error(`the log does not fold at #${e.n}: $${r.entry.t} where the record says $${e.t}`);
    }
    return self;
  }
  /** a fresh clock of the same law folded from `entries` to `upTo` dollars: what a slider shows at that point of the axis */
  function replay(entries, upTo = Infinity) { return createClock({ladder, rise, gate, now}).load(entries, upTo); }

  /** what the clock has to reach next, moved by purchases only: the next rung's mark, the holders' vote, or the close */
  function countdown() {
    const st = mint.state(), mark = axis.opens[st.rung + 1], bronze = price('bronze', st.rung), gold = price('gold', st.rung);
    const base = {t: st.treasury, rung: st.rung, capacity: st.capacity, open: st.open, bronze, gold};
    if (st.next == null) return {...base, kind: 'close', atLeast: st.open * bronze};
    if (gate === 'vote') return {...base, kind: 'vote', seats: st.next, full: st.open === 0};
    const left = Math.max(0, mark - st.treasury);
    return {...base, kind: 'rung', seats: st.next, mark, left, bronzes: Math.ceil(left / bronze), golds: Math.ceil(left / gold)};
  }

  /** the close, visual only: on the top rung a refinement step at each halving of the land left; closed at the last seat */
  function finale() {
    const st = mint.state();
    if (st.next != null || openAtTop == null) return {on: false, level: 0, steps: 0, closed: false, open: st.open};
    const steps = Math.floor(Math.log2(Math.max(1, openAtTop))) + 1;
    const level = st.open === 0 ? steps : Math.min(steps - 1, Math.floor(Math.log2(openAtTop / st.open)));
    return {on: true, level, steps, closed: st.open === 0, open: st.open, openAtTop};
  }

  /** a crowd to the close, deterministic by seed: a gold on the frontier every `goldEvery` purchases, bronzes on open land at
   *  random; under the vote gate a full floor is voted open. Returns the causes it added. */
  function simulate({seed = 1, goldEvery = 25, at = now, limit = 20000} = {}) {
    const rng = mulberry(seed), from = log.length;
    for (let k = 0; k < limit; k++) {
      const st = mint.state();
      if (st.open === 0) { if (st.next == null || open(at()).why) break; continue; }
      let pick = null, metal = 'bronze';
      if (k % goldEvery === goldEvery - 1) { const dots = mint.frontier(); if (dots.length) { pick = dots[Math.floor(rng() * dots.length)]; metal = 'gold'; } }
      if (!pick) { const land = mint.cells().filter(c => !c.holder); pick = land[Math.floor(rng() * land.length)]; }
      const r = buy(pick.face, metal, at());
      if (r.why) throw new Error('the crowd could not buy: ' + r.why);
    }
    return log.slice(from);
  }

  /** every number of the state, for the test of the fold: the clock, the mint's state, each cell's id, face, home and holder, the masses */
  function snapshot() {
    return {t: t(), state: mint.state(), finale: finale(), log: log.length,
      cells: mint.cells().map(c => [c.id, c.face, c.home, c.holder ? c.holder.id + ':' + c.holder.metal : null, c.born]),
      masses: [...mint.masses().values()].map(m => [m.id, m.kind, m.hue, ...m.dir])};
  }

  const self = {mint, axis, gate, rise, ladder, price, genesis, buy, open, load, replay, simulate, countdown, finale, snapshot, t,
    log: () => log, state: () => mint.state(), layout: () => mint.layout(), ledger: () => mint.ledger()};
  genesis();
  return self;
}

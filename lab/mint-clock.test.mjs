// Financial time's laws, on the model alone (no DOM, the wall clock never read): the money axis, the fold, the countdown, the close.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createClock, marks, priceAt, pace} from './mint-clock.mjs';
import {createMint, LADDER, PRICE} from './mint-gravity.mjs';

const stamps = () => { let n = 1000; return () => n++; };   // a stamp source that is not the wall clock
const text = name => fs.readFileSync(new URL(name, import.meta.url), 'utf8');

test('the money axis: a rung opens at the worth of the sphere below it at the floor price; flat prices give ten dollars a seat', () => {
  const {opens, worth} = marks();
  assert.deepEqual(opens, [null, 0, 300, 800, 1500, 2400, 3500, 4800]);
  assert.equal(worth, 6300);
  const risen = marks(LADDER, .5);
  assert.deepEqual(risen.opens.slice(0, 4), [null, 0, 300, 300 + 50 * 15]);
  assert.equal(priceAt('gold', 3, .5), 2250);
  assert.ok(risen.worth > worth, 'the rise spreads the marks');
});

test('genesis: the first floor is open at $0, the countdown is the first mark, and nothing but a purchase moves it', () => {
  const c = createClock({now: stamps()});
  assert.deepEqual([c.t(), c.state().rung, c.state().capacity, c.state().open], [0, 1, 30, 30]);
  const cd = c.countdown();
  assert.deepEqual([cd.kind, cd.seats, cd.mark, cd.left, cd.bronzes, cd.golds], ['rung', 80, 300, 300, 30, 1]);
  assert.deepEqual(c.log().map(e => e.kind), ['genesis']);
  assert.deepEqual(c.countdown(), cd, 'a second read moves nothing');
});

test('a floor sold out in bronze opens the next rung at its last seat, and not before', () => {
  const c = createClock({now: stamps()});
  for (let i = 0; i < 29; i++) assert.deepEqual(c.buy(i, 'bronze').opened, []);
  assert.deepEqual([c.state().rung, c.countdown().left], [1, 10]);
  const last = c.buy(29, 'bronze');
  assert.deepEqual(last.opened.map(s => s.capacity), [80]);
  assert.deepEqual([c.t(), c.state().open, c.countdown().left], [300, 50, 500]);
});

test('a gold is a hundred bronzes of time: one at genesis opens two rungs in one cause', () => {
  const c = createClock({now: stamps()});
  const r = c.buy(0, 'gold');
  assert.equal(r.paid, PRICE.gold);
  assert.deepEqual(r.opened.map(s => s.capacity), [80, 150]);
  assert.deepEqual([c.t(), c.state().capacity, c.state().holders, c.countdown().left], [1000, 150, 1, 500]);
});

test('the fold: a replay of the log equals the live state at every rung and at the close; the slider never runs ahead of its dollar', () => {
  const script = createClock({now: stamps()}).simulate({seed: 7});   // one arc's causes, from a clock of its own
  assert.ok(script.length > 500 && script.every(e => e.kind === 'buy'), 'a crowd of purchases');
  const live = createClock({now: stamps()}), seen = [];
  for (const e of script) {
    const r = live.buy(e.land, e.metal, e.at);
    assert.ok(!r.why, r.why);
    if (r.opened.length) seen.push({t: live.t(), rung: live.state().rung, snap: live.snapshot()});
  }
  seen.push({t: live.t(), rung: live.state().rung, snap: live.snapshot()});
  assert.ok(live.finale().closed, 'the crowd reached the close');
  assert.equal(seen.at(-1).rung, LADDER.length - 1);
  for (let i = 1; i < seen.length; i++) assert.ok(seen[i].rung >= seen[i - 1].rung);
  assert.deepEqual(live.log().slice(1), script, 'the live log is the script, stamps included');
  const t0 = process.cpuUsage();
  for (const s of seen) assert.deepEqual(live.replay(live.log(), s.t).snapshot(), s.snap, `the fold to $${s.t} is the live state at rung ${s.rung}`);
  const u = process.cpuUsage(t0);
  console.log(`  ${seen.length} folds of up to ${script.length} causes: ${((u.user + u.system) / 1000).toFixed(1)} ms of CPU`);
  assert.deepEqual(live.replay(live.log()).log(), live.log(), 'the whole log folds back to itself');
  let last = -1;
  for (let x = 0; x <= live.axis.worth + 2000; x += 250) {
    const at = live.replay(live.log(), x).t();
    assert.ok(at <= x && at >= last, `at $${x} the slider shows $${at}`);
    assert.equal(at, Math.max(...live.log().filter(e => e.t <= x).map(e => e.t)), 'the last cause within the dollar');
    last = at;
  }
});

test('the fold reads no wall clock: the stamps are copied from the record', () => {
  let reads = 0;
  const c = createClock({now: () => { reads++; return 7; }});
  c.buy(0, 'bronze', 42); c.buy(1, 'gold', 43);
  const again = createClock({now: () => { reads++; return 9; }}).load(c.log());
  assert.deepEqual(again.log().map(e => e.at), [7, 42, 43]);
  assert.equal(reads, 2, 'once a genesis, nothing in the fold');
});

test('the close: on the top rung a refinement step at each halving of the land left; closed at the last seat; the state of the mint untouched', () => {
  const c = createClock({now: stamps()});
  assert.equal(c.finale().on, false);
  const script = createClock({now: stamps()}).simulate({seed: 3, goldEvery: 1e9});   // bronze alone: every floor fills in turn
  const levels = [];
  for (const e of script) { c.buy(e.land, e.metal, e.at); const f = c.finale(); if (f.on) levels.push([f.level, f.open]); }
  const f = c.finale();
  assert.deepEqual([f.on, f.closed, f.open, f.openAtTop, f.steps, f.level], [true, true, 0, 150, 8, 8]);
  for (let i = 1; i < levels.length; i++) assert.ok(levels[i][0] >= levels[i - 1][0], 'the level never falls');
  assert.deepEqual([...new Set(levels.map(l => l[0]))], [0, 1, 2, 3, 4, 5, 6, 7, 8], 'every halving is a step');
  assert.equal(levels.find(l => l[0] === 1)[1], 75, 'the first step at half the land');
  assert.equal(levels.find(l => l[0] === 7)[1], 1, 'the last ring at the last seat');
  assert.equal(c.state().treasury, 6300, 'bronze alone ends at the worth of the sphere');
});

test("the holders' gate: a full floor waits for the vote, the vote is a cause in the log, and the fold honours it", () => {
  const c = createClock({gate: 'vote', now: stamps()});
  for (let i = 0; i < 30; i++) c.buy(i, 'bronze');
  assert.deepEqual([c.state().rung, c.state().open, c.countdown().kind, c.countdown().full], [1, 0, 'vote', true]);
  const v = c.open();
  assert.deepEqual([v.step.capacity, c.log().at(-1).kind, c.state().open], [80, 'open', 50]);
  assert.deepEqual(c.replay(c.log()).snapshot(), c.snapshot());
  assert.match(createClock({now: stamps()}).open().why, /gate here is the mark/);
  const crowd = createClock({gate: 'vote', now: stamps()});
  const causes = crowd.simulate({seed: 5});
  assert.equal(causes.filter(e => e.kind === 'open').length, LADDER.length - 2, 'the crowd voted every rung open');
  assert.ok(crowd.finale().closed);
});

test("the mint pays the price of the rung it sells on (the rise is the caller's); the default is the live mint's", () => {
  const m = createMint({price: (metal, rung) => PRICE[metal] * rung}), open = () => m.cells().findIndex(c => !c.holder);
  m.expand(); assert.equal(m.buy(open(), 'bronze').paid, 10);
  m.expand(); const i = open(); assert.equal(m.buy(i, 'bronze').paid, 20); assert.equal(m.buy(i, 'gold').paid, 2000 - 20);
  const c = createClock({rise: 1, now: stamps()});   // the price doubles a rung
  assert.deepEqual(c.axis.opens.slice(0, 4), [null, 0, 300, 300 + 50 * 20]);
  c.buy(0, 'gold');
  assert.deepEqual([c.t(), c.state().rung], [1000, 2], 'the second mark, $1,300, is not reached by one gold');
});

test('the pace of a play: the last cause at the last second, the crowd sixteen-fold at the end, half the causes in the last quarter', () => {
  const s = pace(640);
  assert.equal(s(0), 0);
  assert.ok(Math.abs(s(640) - 60) < 1e-9);
  assert.ok(s(320) > 45 && s(320) < 50, `half the causes come after ${s(320).toFixed(1)} s`);
  for (let k = 1; k <= 640; k++) assert.ok(s(k) > s(k - 1));
});

test('the page draws on cause: no timer draws, the sphere rests by default, the clone alone asks for the idle spin, the three calls stand open', () => {
  const page = text('./mint-clock.html'), sphere = text('./mint-sphere.js'), clone = text('./mint-gravity.html');
  assert.ok(page.includes("from './mint-clock.mjs'"));
  assert.ok(!/setInterval/.test(page), 'no interval on the page');
  assert.ok(!/idle:\s*true/.test(page), 'the clock page never asks for the idle spin');
  assert.match(clone, /idle:\s*true/);
  assert.match(sphere, /idle = false/);
  assert.match(sphere, /function alive\(\)/);
  assert.ok(!/if \(!pointer\) yaw \+= dt/.test(sphere), 'the spin is behind the idle option');
  assert.equal((page.match(/<em>open<\/em>/gi) || []).length, 3, 'his three calls, each shown open');
  for (const words of ['What opens an expansion', 'price rises', 'Real money or reservations']) assert.ok(page.includes(words), words);
});

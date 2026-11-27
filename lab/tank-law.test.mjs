// tank-law.test.mjs · THE TANK's law (tank-law.mjs): what the syrup glass takes from house/purse and mint/drops, and what moves. No browser.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createTank, readPurse, readDrops, costText, tokensText, POP_MS, POPS_MAX, DPS_WINDOW_MS, PURSE_SCHEMA, DROPS_SCHEMA, PURSE_REF, DROPS_REF } from './tank-law.mjs';

const T0 = 1_800_000_000_000;
const purse = (over = {}) => ({ schema: PURSE_SCHEMA, posted_usd: 315.67, reserved_usd: 0, full_usd: 400, level: 0.79, ledger: { at_ms: T0, source: 'ledger', mac: 'mac' }, burns: [], ...over });
const burn = (id, at_ms, cost_usd = 0.0094, lane = 'fable', tin = 1757) => ({ id, at_ms, cost_usd, in: tin, lane });
const clock = (t) => ({ now: () => t.v });

test('readPurse: the ref\'s own shape and nothing else; the level clamped; a burn needs an id, a time and a cost', () => {
  assert.equal(readPurse(null), null); assert.equal(readPurse({}), null); assert.equal(readPurse({ schema: 'other' }), null);
  const p = readPurse(purse({ level: 1.4, burns: [burn('a', T0), { id: '', at_ms: T0, cost_usd: 1 }, { id: 'b', cost_usd: 1 }, { id: 'c', at_ms: T0, cost_usd: -1 }, burn('d', T0, 0, null, null)] }));
  assert.equal(p.level, 1); assert.equal(p.posted, 315.67); assert.equal(p.reserved, 0); assert.equal(p.full, 400); assert.equal(p.at_ms, T0);
  assert.deepEqual(p.burns.map((b) => b.id), ['a', 'd']); assert.equal(p.burns[1].lane, null); assert.equal(p.burns[1].in, null);
  assert.equal(readPurse(purse({ level: 'high', posted_usd: null })).level, null);
});
test('readDrops: gold or bronze with an id and a time, in the ref\'s order', () => {
  assert.deepEqual(readDrops(null), []); assert.deepEqual(readDrops({ schema: DROPS_SCHEMA }), []);
  assert.deepEqual(readDrops({ schema: DROPS_SCHEMA, drops: [{ id: 'x', at_ms: T0, metal: 'gold', usd: 1000 }, { id: 'y', at_ms: T0, metal: 'silver' }, { id: 'z', at_ms: T0 + 1, metal: 'bronze' }] }),
    [{ id: 'x', at_ms: T0, metal: 'gold' }, { id: 'z', at_ms: T0 + 1, metal: 'bronze' }]);
});
test('the texts: the cents a person reads, the thousandths of a call, the tokens in k', () => {
  assert.equal(costText(315.67), '$315.67'); assert.equal(costText(1), '$1.00'); assert.equal(costText(0.507365), '$0.507'); assert.equal(costText(0.009425), '$0.0094'); assert.equal(costText(0), '$0.00'); assert.equal(costText(NaN), '');
  assert.equal(tokensText(1757), '1.8k'); assert.equal(tokensText(38627), '39k'); assert.equal(tokensText(312), '312'); assert.equal(tokensText(null), '');
});
test('the first reading stands at rest: the level and the balance are taken, the burns already on the Nest are history and fly nothing', () => {
  const t = { v: T0 + 10_000 }, tank = createTank(clock(t));
  const r = tank.take(purse({ burns: [burn('old-1', T0), burn('old-2', T0 + 5000)] }), { rev: 7 });
  assert.deepEqual(r, { causes: [], level: 0.79, posted: 315.67 });
  assert.equal(tank.pops().length, 0); assert.equal(tank.state().counts.history, 2); assert.equal(tank.state().seen, 2);
  assert.deepEqual(tank.dps(), { usd_per_min: 0.0188, calls: 2 });   // the rate still counts them: they burned inside the last minute
});
test('a new burn row is a cause once: a number flies POP_MS from its own time, sparks and a sip with it; a replay of the ref moves nothing', () => {
  const t = { v: T0 + 10_000 }, tank = createTank(clock(t));
  tank.take(purse(), { rev: 1 });
  t.v = T0 + 20_000;
  const r = tank.take(purse({ posted_usd: 315.66, level: 0.78, burns: [burn('new-1', T0 + 19_900)] }), { rev: 2 });
  assert.equal(r.causes.length, 1); assert.deepEqual(r.causes[0], { kind: 'burn', id: 'new-1', at_ms: T0 + 19_900, cost_usd: 0.0094, in: 1757, lane: 'fable' });
  assert.equal(r.level, 0.78); assert.equal(r.posted, 315.66);
  const inAir = tank.pops(); assert.equal(inAir.length, 1); assert.equal(inAir[0].id, 'new-1'); assert.ok(inAir[0].k >= 0 && inAir[0].k < 0.1);
  // the same row again, on a newer rev: taken once by its id
  assert.deepEqual(tank.take(purse({ burns: [burn('new-1', T0 + 19_900)] }), { rev: 3 }).causes, []);
  // a replay (a rev no newer than the one held)
  assert.equal(tank.take(purse({ burns: [burn('new-2', T0 + 20_000)] }), { rev: 3 }), false);
  assert.equal(tank.take(purse({ burns: [burn('new-2', T0 + 20_000)] }), { rev: 2 }), false);
  assert.equal(tank.state().counts.replays, 2);
  // the number dies at POP_MS
  t.v = T0 + 19_900 + POP_MS - 1; assert.equal(tank.pops().length, 1);
  t.v = T0 + 19_900 + POP_MS; assert.equal(tank.pops().length, 0);
});
test('a burn whose flight is already over on the clock, or older than this glass\'s first picture, is history; at most POPS_MAX fly', () => {
  const t = { v: T0 + 10_000 }, tank = createTank(clock(t));
  tank.take(purse(), { rev: 1 });
  t.v = T0 + 30_000;
  const late = tank.take(purse({ burns: [burn('gone', T0 + 30_000 - POP_MS - 1), burn('before', T0 + 9_000)] }), { rev: 2 });
  assert.deepEqual(late.causes, []); assert.equal(tank.state().counts.history, 2);
  const many = Array.from({ length: POPS_MAX + 5 }, (_, i) => burn(`m${i}`, T0 + 29_000 + i));
  const r = tank.take(purse({ burns: many }), { rev: 3 });
  assert.equal(r.causes.length, POPS_MAX + 5); assert.equal(tank.pops().length, POPS_MAX);
});
test('the rate (his DPS): dollars a minute over the last minute of burns, the ones that left the minute dropped', () => {
  const t = { v: T0 + 10_000 }, tank = createTank(clock(t));
  tank.take(purse({ burns: [burn('a', T0 + 1000, 0.5), burn('b', T0 + 2000, 0.25)] }), { rev: 1 });
  assert.deepEqual(tank.dps(), { usd_per_min: 0.75, calls: 2 });
  t.v = T0 + 1000 + DPS_WINDOW_MS; assert.deepEqual(tank.dps(), { usd_per_min: 0.25, calls: 1 });
  t.v = T0 + 2000 + DPS_WINDOW_MS; assert.deepEqual(tank.dps(), { usd_per_min: 0, calls: 0 });
});
test('a sale is a drop once by its id, after the first picture; its own rev; no purse, no level', () => {
  const t = { v: T0 + 10_000 }, tank = createTank(clock(t));
  const drops = (list) => ({ schema: DROPS_SCHEMA, drops: list });
  const r0 = tank.take(drops([{ id: 'd-old', at_ms: T0, metal: 'gold' }]), { rev: 1, ref: DROPS_REF });
  assert.deepEqual(r0, { causes: [], level: null, posted: null });
  const r1 = tank.take(drops([{ id: 'd-old', at_ms: T0, metal: 'gold' }, { id: 'd-new', at_ms: T0 + 11_000, metal: 'bronze' }]), { rev: 2, ref: DROPS_REF });
  assert.deepEqual(r1.causes, [{ kind: 'drop', id: 'd-new', at_ms: T0 + 11_000, metal: 'bronze' }]);
  assert.equal(tank.take(drops([{ id: 'd-new', at_ms: T0 + 11_000, metal: 'bronze' }]), { rev: 2, ref: DROPS_REF }), false);
  assert.deepEqual(tank.take(drops([{ id: 'd-new', at_ms: T0 + 11_000, metal: 'bronze' }]), { rev: 3, ref: DROPS_REF }).causes, []);
  assert.equal(tank.state().counts.drops, 1);
});
test('junk on the purse ref empties the tank: nothing is drawn of a purse the Nest does not hold', () => {
  const t = { v: T0 + 10_000 }, tank = createTank(clock(t));
  tank.take(purse(), { rev: 1 }); assert.equal(tank.state().level, 0.79);
  assert.deepEqual(tank.take({ nope: true }, { rev: 2, ref: PURSE_REF }), { causes: [], level: null, posted: null });
  assert.equal(tank.state().level, null); assert.equal(tank.state().posted, null); assert.equal(tank.pops().length, 0);
});

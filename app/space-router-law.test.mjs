// space-router-law.test.mjs · THE SPACE ROUTER'S LAW (app/space-router-law.mjs): the charge, the fair hold and PROMPT-TO-MINE's halving by date, every
// six calendar months from the opening. node --test app/space-router-law.test.mjs (no network).
import test from 'node:test';
import assert from 'node:assert/strict';
import * as L from './space-router-law.mjs';

const OPEN = Date.UTC(2026, 9, 31, 12, 0, 0);   // an opening at noon UTC on Oct 31
const iso = (ms) => new Date(ms).toISOString();

test('a call drinks the router\'s cost plus the markup, to the nano; a call in flight holds the mean of the last twenty drinks, 5 cents before the first', () => {
  assert.equal(L.charge(0.0979, L.MARKUP_BPS), 0.102795);
  assert.equal(L.charge(0.009425, 500), 0.00989625);
  assert.equal(L.charge(1, 0), 1); assert.equal(L.charge(1, -5), 1, 'no markup below zero');
  assert.equal(L.fairHold([]), L.FIRST_HOLD_USD);
  assert.equal(L.fairHold([0.1, 0.3]), 0.2);
  assert.equal(L.fairHold([...Array(20).fill(1), ...Array(20).fill(3)]), 3, 'only the last twenty count');
  assert.equal(L.isTankKey('sr_abc'), true); assert.equal(L.isTankKey('sk-abc'), false); assert.equal(L.isTankKey(null), false);
});

test('the halvings fall every six calendar months from the opening, at its hour; a day past a month\'s end lands on its last day', () => {
  assert.equal(iso(L.halvingAt(OPEN, 0)), '2026-10-31T12:00:00.000Z');
  assert.equal(iso(L.halvingAt(OPEN, 1)), '2027-04-30T12:00:00.000Z', 'Oct 31 + 6 months: April has 30 days');
  assert.equal(iso(L.halvingAt(OPEN, 2)), '2027-10-31T12:00:00.000Z');
  assert.equal(iso(L.halvingAt(OPEN, 10)), '2031-10-31T12:00:00.000Z', 'the tenth halving is the fifth year, when $POOL unlocks');
  const aug31 = Date.UTC(2027, 7, 31);
  assert.equal(iso(L.halvingAt(aug31, 1)), '2028-02-29T00:00:00.000Z', 'a leap February'); assert.equal(iso(L.halvingAt(aug31, 3)), '2029-02-28T00:00:00.000Z');
});

test('PROMPT-TO-MINE: a dollar mines 1 before the opening and in its first six months, then half at each halving, 1/1024 from the fifth year', () => {
  assert.equal(L.warmPerUsdAt(OPEN - 86_400_000, OPEN), 1, 'before the opening: the opening\'s rate');
  assert.equal(L.warmPerUsdAt(Date.now(), null), 1, 'no opening named: the opening\'s rate');
  assert.equal(L.warmPerUsdAt(OPEN, OPEN), 1);
  assert.equal(L.warmPerUsdAt(L.halvingAt(OPEN, 1) - 1, OPEN), 1, 'one millisecond before the first halving');
  assert.equal(L.warmPerUsdAt(L.halvingAt(OPEN, 1), OPEN), 0.5, 'at the first halving');
  assert.equal(L.warmPerUsdAt(L.halvingAt(OPEN, 2) + 1, OPEN), 0.25);
  assert.equal(L.warmPerUsdAt(L.halvingAt(OPEN, 10), OPEN), 1 / 1024);
  assert.equal(L.warmPerUsdAt(L.halvingAt(OPEN, 11), OPEN), 1 / 2048, 'and on halving after it');
  for (let n = 0; n < 40; n++) {   // every era's bounds, exactly
    assert.equal(L.eraAt(L.halvingAt(OPEN, n), OPEN), n); assert.equal(L.eraAt(L.halvingAt(OPEN, n + 1) - 1, OPEN), n);
  }
  assert.equal(L.warmMined(0.102795, OPEN, OPEN), 0.102795); assert.equal(L.warmMined(1, L.halvingAt(OPEN, 1), OPEN), 0.5);
  assert.equal(L.warmMined(-3, OPEN, OPEN), 0, 'nothing mined below zero');
  assert.equal(iso(L.nextHalvingAt(OPEN - 1, OPEN)), '2027-04-30T12:00:00.000Z', 'before the opening, the first halving is next');
  assert.equal(iso(L.nextHalvingAt(L.halvingAt(OPEN, 1), OPEN)), '2027-10-31T12:00:00.000Z');
  assert.equal(L.nextHalvingAt(OPEN, null), null);
  assert.equal(L.instantMs('2026-10-31T12:00:00Z'), OPEN); assert.equal(L.instantMs(''), null); assert.equal(L.instantMs('soon'), null); assert.equal(L.instantMs(OPEN), OPEN);
});

test('at a steady spend the first six months mine half of all that is ever mined (the strategy\'s line)', () => {
  let first = 0, all = 0;
  for (let n = 0; n < 60; n++) { const w = 6 * L.warmPerUsdAt(L.halvingAt(OPEN, n), OPEN); all += w; if (n === 0) first = w; }
  assert.ok(Math.abs(first / all - 0.5) < 1e-12, `${first / all}`);
});

test('THE COUNTER-TANK DRINKS: the dollars first, then the $WARM at USD_PER_WARM; past both, the dollars go below zero', () => {
  assert.equal(L.USD_PER_WARM, 1); assert.deepEqual([L.split(0.1, 1, 5), L.split(0.1, 0.04, 5), L.split(0.1, 0, 0.03), L.split(0.1, -0.2, 1), L.split(0.1, 0.04, 5, 2)],
    [{ usd_fuel: 0.1, warm_spent: 0 }, { usd_fuel: 0.04, warm_spent: 0.06 }, { usd_fuel: 0.07, warm_spent: 0.03 }, { usd_fuel: 0, warm_spent: 0.1 }, { usd_fuel: 0.04, warm_spent: 0.03 }]);
});

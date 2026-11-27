// The land grab's laws, on the model alone (no DOM): cells fill every face, golds hold their angle, the rest fall toward their mass.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createMint, cellAngle, angle, LADDER, PRICE} from './mint-gravity.mjs';

const whole = mint => {
  const {capacity} = mint.state(), cells = mint.cells();
  assert.equal(cells.length, capacity, 'one cell a hexagon');
  assert.equal(new Set(cells.map(c => c.id)).size, capacity, 'no cell twice');
  cells.forEach((c, i) => assert.equal(c.face, i, 'a cell knows its face'));
};

test('the dodecahedron is the twelve chairs and sells nothing', () => {
  const mint = createMint();
  assert.deepEqual([mint.state().capacity, mint.state().masses, mint.cells().length], [0, 12, 0]);
  assert.match(mint.buy(0, 'bronze').why, /twelve chairs/);
});

test('the first expansion opens thirty hexagons, one on every edge between two chairs, each a coin flip', () => {
  const mint = createMint(), step = mint.expand();
  assert.equal(step.born, 30); assert.equal(step.flips, 30); whole(mint);
  for (const c of mint.cells()) assert.match(c.home, /^chair:/);
});

test('prices: bronze $10, gold $1,000, a bronze given gravity pays $990', () => {
  const mint = createMint(); mint.expand(); mint.expand();
  assert.equal(mint.buy(1, 'bronze').paid, PRICE.bronze);
  assert.equal(mint.buy(1, 'bronze').why, 'this bronze is held: a bronze needs open land');
  assert.equal(mint.buy(1, 'gold').paid, PRICE.gold - PRICE.bronze);
  assert.equal(mint.buy(1, 'gold').why, 'a gold holds this land');
  assert.equal(mint.buy(7, 'gold').paid, PRICE.gold);
  assert.equal(mint.state().treasury, 10 + 990 + 1000);
});

test('a gold holds its angle through every rung; bronze and open land fall toward their mass', () => {
  const mint = createMint(); mint.expand(); mint.expand();
  const g = mint.buy(5, 'gold').holder, pinned = mint.masses().get(g.mass).dir;
  mint.buy(9, 'bronze'); mint.buy(14, 'bronze');
  const before = new Map(mint.cells().filter(c => c.holder?.metal === 'bronze').map(c => [c.id, angle(c.dir, mint.masses().get(c.home).dir)]));
  while (mint.state().capacity < 150) {
    const was = mint.state().capacity, step = mint.expand(); whole(mint);
    const s = cellAngle(step.capacity), goldCell = mint.cells().find(c => c.holder === g);
    assert.ok(angle(goldCell.dir, pinned) < .75 * s, `the gold stays within its own cell at ${step.capacity}`);
    for (const c of mint.cells()) if (c.holder?.metal === 'bronze') {
      const now = angle(c.dir, mint.masses().get(c.home).dir), then = before.get(c.id);
      if (then != null) assert.ok(now <= then * cellAngle(step.capacity) / cellAngle(was) + .9 * s, `bronze #${c.holder.id} falls toward its mass`);
      before.set(c.id, now);
    }
  }
  assert.equal(mint.state().holders, 3, 'nobody lost their land');
});

test('a gold captures the land nearer to it than to its own mass, and new land is born on the seams', () => {
  const mint = createMint(); mint.expand(); mint.expand(); mint.expand();
  assert.equal(mint.state().capacity, 150);
  const {captured, holder} = mint.buy(mint.frontier()[0].face, 'gold');
  assert.ok(captured > 0, 'the frontier gold took land');
  const step = mint.expand(); whole(mint);
  assert.equal(step.born, LADDER[4] - LADDER[3]);
  const orbit = mint.cells().filter(c => c.home === holder.mass).length;
  assert.ok(orbit > captured, 'its orbit grows with the world');
});

test('a crowd buys and the whole ladder climbs to 630 with every law kept, every gold within a cell of its own angle', () => {
  const mint = createMint();
  for (let k = 0; mint.expand(); k++) {
    whole(mint);
    const s = cellAngle(mint.state().capacity);
    for (const c of mint.cells()) if (c.holder?.metal === 'gold') assert.ok(angle(c.dir, mint.masses().get(c.home).dir) < s, `gold #${c.holder.id} holds its angle`);
    mint.crowd(100 + k);
  }
  const st = mint.state();
  assert.equal(st.capacity, LADDER.at(-1));
  assert.equal(st.holders, st.gold + st.bronze);
  assert.equal(st.treasury, st.gold * PRICE.gold + st.bronze * PRICE.bronze);
});

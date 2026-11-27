// the-colony.test.mjs: THE COLONY's law (the-colony.mjs) without a browser: the film's frames, the spread, the burst and the fold home.
import test from 'node:test';
import assert from 'node:assert/strict';
import {COLONY, COLONY_LANDS, COLONY_START, COLONY_FULL, COLONY_HOME, COLONY_END, colonyAt, CHARGE, CHARGE_START, chargeAt, colonyPicture, FLOW, flowAt, flowPoint} from './the-colony.mjs';
import {STRIKE_FLOW, DRAWN} from './strike-flow.js?v=the-cut-1';
import {hierarchyAt} from './rite-unit1s.js';
import {scoreAt} from './satellites-score.js';

const F = 1001 / 30000;

test('the colony is the film\'s own measure: his call on Pegasus to the strike done, landing on a beat', () => {
  assert.deepEqual({...COLONY}, {burst: 3139, flash: 3147, meteors: 3245, hits: 3335, home: 3455});
  assert.equal(Math.round(COLONY_START * 1000), 104738);
  assert.equal(Math.round(COLONY_FULL * 1000), 105005);
  // his call on the strike's strongest onset
  for (let n = 3100; n <= 3200; n++) assert.ok(scoreAt(n * F).beat <= scoreAt(COLONY.burst * F).beat + 1e-12, `the strongest onset round his call (${n})`);
  assert.equal(Math.round(COLONY_HOME * 1000), 115282);
  assert.ok(COLONY_LANDS >= COLONY.home + 15 && COLONY_LANDS <= COLONY.home + 36);
  for (let n = COLONY.home + 15; n <= COLONY.home + 36; n++) assert.ok(scoreAt(n * F).beat <= scoreAt(COLONY_LANDS * F).beat + 1e-12, `the strongest onset (${n})`);
  assert.equal(COLONY_END, COLONY_LANDS * F);
  for (const t of [0, 104.7, COLONY_START - 1e-6, COLONY_END, 120, NaN]) assert.equal(colonyAt(t), null, `out at ${t}`);
});

test('the dodecahedron bursts ahead of the film\'s front, the film holds the stage, and both fold home smoothly', () => {
  assert.deepEqual(colonyAt(COLONY_START), {spread: 0, burst: 0, gather: 0, fling: 0, flash: 1});
  assert.ok(colonyAt(COLONY_START + 0.35).flash < 0.05, 'the call\'s white flash gone in a third of a second');
  const full = colonyAt(COLONY_FULL + 0.01);
  assert.equal(full.spread, 1); assert.equal(full.burst, 1); assert.equal(full.gather, 0);
  for (const t of [108.3, 111.3, 115.2]) { const c = colonyAt(t); assert.deepEqual([c.spread, c.burst, c.gather, c.fling], [1, 1, 0, 1], `holds at ${t}`); }
  // the panels lead the film's front all through the spread (an explosion's ease against the film's smootherstep)
  for (let t = COLONY_START + 0.01; t < COLONY_FULL; t += 0.01) { const c = colonyAt(t); assert.ok(c.burst >= c.spread, `at ${t}`); }
  // no jump anywhere a frame apart, nothing left at the end
  let last = colonyAt(COLONY_START);
  for (let t = COLONY_START + F / 4; t < COLONY_END; t += F / 4) {
    const c = colonyAt(t);
    for (const k of ['spread', 'burst', 'gather']) assert.ok(Math.abs(c[k] - last[k]) < 0.16, `${k} at ${t}`);
    last = c;
  }
  const end = colonyAt(COLONY_END - 1e-6);
  assert.ok(end.spread < 1e-6 && end.burst < 1e-6 && end.gather > 1 - 1e-6);
});

test('THE CHARGE: from Seiya lit gold to the explosion the heat rises act by act on the film\'s cuts, never jumping, flaring on the score', () => {
  assert.deepEqual({...CHARGE}, {start: 2795, eyes: 2885, dolbar: 2975, burn: 3020, pegasus: 3080});
  assert.equal(Math.round(CHARGE_START * 1000), 93260);
  for (const t of [93.2, COLONY_START, 120, NaN]) assert.equal(chargeAt(t), null, `out at ${t}`);
  const at = (frame) => chargeAt(frame * F + 1e-6).heat;
  assert.ok(at(CHARGE.start) < 0.001);
  assert.ok(Math.abs(at(CHARGE.eyes) - 0.38) < 0.001 && Math.abs(at(CHARGE.dolbar) - 0.56) < 0.001 && Math.abs(at(CHARGE.burn) - 0.68) < 0.001);
  assert.ok(Math.abs(at(CHARGE.pegasus) - 0.86) < 0.001 && chargeAt(COLONY_START - 1e-6).heat > 0.999);
  let last = 0;
  for (let t = CHARGE_START; t < COLONY_START; t += F / 4) {
    const c = chargeAt(t);
    assert.ok(c.heat >= last - 1e-12 && c.heat - last < 0.02, `the heat at ${t}`);
    assert.ok(c.pulse >= 0 && c.pulse <= 1);
    last = c.heat;
  }
});

test('the film fitted whole inside the stage, as the lead-in fits it, wide or tall', () => {
  for (const [W, H] of [[1512, 945], [1590, 1800]]) {
    const pic = colonyPicture(W, H);
    assert.ok(pic.scale * 796 <= W + 1e-9 && pic.scale * 534 <= H + 1e-9 && (Math.abs(pic.scale * 796 - W) < 1e-9 || Math.abs(pic.scale * 534 - H) < 1e-9), `${W} x ${H}`);
    assert.ok(Math.abs(pic.left + 82 * pic.scale - (W - 796 * pic.scale) / 2) < 1e-9, 'centred');
  }
});

test('THE FLOW: the shots the film measured, where each draws its lines, the arrows pulled in after the burst and home with the fold', () => {
  assert.deepEqual(Object.keys(STRIKE_FLOW), ['barrage', 'impact', 'meteors', 'hits']);
  assert.equal(STRIKE_FLOW.barrage.from, COLONY.burst + 1); assert.equal(STRIKE_FLOW.impact.from, 3200);
  assert.equal(STRIKE_FLOW.meteors.from, COLONY.meteors); assert.equal(STRIKE_FLOW.hits.from, COLONY.hits); assert.equal(STRIKE_FLOW.hits.to + 1, COLONY.home);
  assert.ok(STRIKE_FLOW.impact.radial > STRIKE_FLOW.impact.parallel, 'the speed lines into Dolbar meet at a point');
  assert.ok(STRIKE_FLOW.meteors.parallel > STRIKE_FLOW.meteors.radial, 'the meteors\' streaks run side by side');
  assert.ok(Math.abs(Math.sin(STRIKE_FLOW.meteors.along)) < 0.1, 'and across the frame');
  assert.ok(Math.abs(Math.cos(STRIKE_FLOW.hits.along)) < 0.2, 'the lines on his armour run down');
  for (const name of ['barrage', 'impact']) { const [x, y] = STRIKE_FLOW[name].focus; assert.ok(x > 82 && x < 878 && y > 4 && y < 536, `${name}'s point inside the picture`); }
  // where the lines are drawn: a window every DRAWN.window frames of the shot, DRAWN.bins digits each, the strongest a 9
  for (const [name, S] of Object.entries(STRIKE_FLOW)) {
    assert.equal(S.drawn.length, Math.ceil((S.to - S.from + 1) / DRAWN.window), name);
    for (const row of S.drawn) { assert.match(row, new RegExp(`^[0-9]{${DRAWN.bins}}$`)); assert.ok(row.includes('9'), `${name}: ${row}`); }
  }
  assert.ok(STRIKE_FLOW.meteors.lanes[1] < 270 - 0.15 * 534, 'no lane on the meteors\' ground');
  assert.equal(flowAt(COLONY_START - 1e-6), null);
  assert.equal(flowAt(COLONY_START).pull, 0);
  assert.ok(flowAt(COLONY_START + FLOW.pull.after + FLOW.pull.over + 0.01).pull > 0.999);
  assert.ok(flowAt(COLONY_END - 1e-6).pull < 1e-3, 'home with the fold');
  for (const [t, shot] of [[105.5, 'barrage'], [107.5, 'impact'], [109.5, 'meteors'], [113, 'hits']]) assert.equal(flowAt(t).shot, shot);
  // an arrow is not seen before its shot's first frame, and comes in after the cut
  const before = flowAt(COLONY_START + 0.001);
  assert.equal(flowPoint(5, COLONY_START + 0.001, before.shot, before.since).alpha, 0);
  assert.ok(flowPoint(5, 107.5, 'impact', 1e-3).alpha < 0.01, 'in after the cut');
});

const F_RATE = 30000 / 1001, PIC = [82, 3, 796, 534];
const at = (shot, i, since) => flowPoint(i, STRIKE_FLOW[shot].from / F_RATE + since, shot, since);
const dist = (p, [fx, fy]) => Math.hypot(p.x - fx, p.y - fy);

test('THE FLOW: out of Pegasus\'s point, into Dolbar\'s chest and spent there, along the streaks, down his armour, on the picture', () => {
  for (let i = 0; i < 1872; i += 37) {
    // out: farther from the barrage's point a moment later (unless its path begins again), heading away from it
    const a = at('barrage', i, 0.5), b = at('barrage', i, 0.52);
    assert.ok(dist(b, STRIKE_FLOW.barrage.focus) > dist(a, STRIKE_FLOW.barrage.focus) - 1e-9 || Math.min(a.alpha, b.alpha) < 0.1, `out ${i}`);
    assert.ok((a.x - STRIKE_FLOW.barrage.focus[0]) * a.dx + (a.y - STRIKE_FLOW.barrage.focus[1]) * a.dy > 0);
    // in: nearer Dolbar's point a moment later, heading at it, or spent on it in a flash
    const c = at('impact', i, 0.5), d = at('impact', i, 0.52);
    assert.ok(dist(d, STRIKE_FLOW.impact.focus) < dist(c, STRIKE_FLOW.impact.focus) + 1e-9 || c.hit > 0.3 || d.alpha < 0.2, `in ${i}`);
    assert.ok((c.x - STRIKE_FLOW.impact.focus[0]) * c.dx + (c.y - STRIKE_FLOW.impact.focus[1]) * c.dy < 0);
    // the meteors: left to right; his armour: down
    assert.ok(at('meteors', i, 1.0).dx > 0.99, `right ${i}`);
    assert.ok(at('hits', i, 1.0).dy > 0.98, `down ${i}`);
  }
  // spent on Dolbar's chest: where an arrow flashes it is within FLOW.core of his point (give or take the last frames of its way in)
  let flashes = 0;
  for (let i = 0; i < 1872; i++) for (const since of [0.3, 0.7, 1.1]) {
    const p = at('impact', i, since);
    if (p.hit > 0.5) { flashes++; assert.ok(dist(p, STRIKE_FLOW.impact.focus) <= FLOW.core[1] * 534 + 30, `spent at the chest ${i}`); }
  }
  assert.ok(flashes > 100, `the chest flashes (${flashes})`);
  // on the picture: never more than FLOW.over of its height past its edges
  const over = FLOW.over * 534 + 1e-6;
  for (const shot of Object.keys(STRIKE_FLOW)) for (let i = 0; i < 1872; i += 11) for (const since of [0.2, 0.9, 1.4]) {
    const p = at(shot, i, since);
    assert.ok(p.x >= PIC[0] - over && p.x <= PIC[0] + PIC[2] + over && p.y >= PIC[1] - over && p.y <= PIC[1] + PIC[3] + over, `${shot} ${i} at ${since}: ${p.x}, ${p.y}`);
    assert.ok(p.glow >= 0.2 && p.glow <= 1 && p.speed >= 0);
  }
  // a moment apart an arrow moves a little, never jumps, but where its path begins again (unseen there) or it is spent
  for (let i = 0; i < 200; i += 7) for (const shot of Object.keys(STRIKE_FLOW)) {
    let last = null;
    for (let s = 0.2; s < 1.4; s += 1 / 60) {
      const p = at(shot, i, s);
      if (last && Math.hypot(p.x - last.x, p.y - last.y) > 40) assert.ok(Math.min(p.alpha, last.alpha) < 0.15, `${shot} ${i} at ${s}`);
      last = p;
    }
  }
});

test('THE FLOW traces where the film draws: the arrows take the drawn lines over the undrawn, each shot, as its drawings change', () => {
  // the mean drawn weight (digit) where the arrows are, against the mean of all the window's bins: higher in every shot
  for (const [shot, S] of Object.entries(STRIKE_FLOW)) for (const since of [0.25, 0.9]) {
    if (since * F_RATE >= S.to - S.from + 1) continue;
    const row = S.drawn[Math.floor(since * F_RATE / DRAWN.window)], mean = [...row].reduce((a, c) => a + Number(c), 0) / row.length;
    let sum = 0, n = 0;
    for (let i = 0; i < 1872; i++) {
      const p = at(shot, i, since);
      if (p.alpha < 0.5) continue;
      let b;
      if (S.read === 'radial') {
        const ang = (Math.atan2(p.y - S.focus[1], p.x - S.focus[0]) + 2 * Math.PI) % (2 * Math.PI);
        b = Math.floor(ang / (2 * Math.PI) * DRAWN.bins) % DRAWN.bins;
      } else {
        const q = (p.x - 480) * -Math.sin(S.along) + (p.y - 270) * Math.cos(S.along);
        b = Math.min(DRAWN.bins - 1, Math.max(0, Math.floor((q - S.lanes[0]) / (S.lanes[1] - S.lanes[0]) * DRAWN.bins)));
      }
      sum += Number(S.drawn[Math.min(S.drawn.length - 1, Math.floor(since * F_RATE / DRAWN.window))][b]); n++;
    }
    assert.ok(n > 300 && sum / n > mean + 0.3, `${shot} at ${since}: ${(sum / n).toFixed(2)} against ${mean.toFixed(2)} (${n})`);
  }
  // no lattice: the golden draws laid the swarm in rings; the arrows' radii out of Pegasus spread evenly, none of 24 bands over twice its share
  const bands = new Array(24).fill(0);
  let n = 0;
  for (let i = 0; i < 1872; i++) { const p = at('barrage', i, 0.7), r = dist(p, STRIKE_FLOW.barrage.focus); if (p.alpha > 0.3 && r < 260) { bands[Math.floor(r / 260 * 24)]++; n++; } }
  assert.ok(Math.max(...bands.slice(2)) < 2.6 * n / 24, `bands ${bands.join(' ')}`);
});

// THE FLAMES ARE THE ANIME'S COLOUR, AND THE SWELL (his Oct 27 2026 15:2x WET: "a blue glow radially expand silently here just like warming up to
// the nuke right after when he goes ballistic... proper coloring synced with the color of the anime")
test('the charge takes each frame\'s colour off the film: gold on his eyes, Pegasus blue to the explosion; the swell rises silent from his Pegasus to the explosion', async () => {
  const {chargeAt, tintAt, swellAt, CHARGE, COLONY} = await import('./the-colony.mjs');
  const {CHARGE_COLORS} = await import('./charge-colors.js');
  const {cosmosOf, cutsOf, smoothWithin} = await import('../tools/charge-colors.mjs');
  const F = 1001 / 30000;
  assert.equal(CHARGE_COLORS.from, CHARGE.start); assert.equal(CHARGE_COLORS.frames, COLONY.burst - CHARGE.start + 1); assert.equal(CHARGE_COLORS.hex.length, CHARGE_COLORS.frames * 6);
  const gold = tintAt(CHARGE.eyes + 10), blue = tintAt(CHARGE.pegasus + 30), last = tintAt(COLONY.burst - 1);
  assert.ok(gold[0] === 1 && gold[2] < 0.6, `his golden eyes are gold: ${gold}`);
  assert.ok(blue[2] === 1 && blue[0] < 0.6, `his Pegasus is blue: ${blue}`); assert.ok(last[2] === 1 && last[0] < 0.4, `deepening to the explosion: ${last}`);
  for (const f of [CHARGE.start, CHARGE.dolbar + 5, CHARGE.burn + 5, COLONY.burst]) assert.equal(Math.max(...tintAt(f)), 1, `brightened to its strongest channel at ${f}`);
  assert.equal(swellAt(CHARGE.pegasus - 1), 0); assert.equal(swellAt(CHARGE.pegasus), 0); assert.ok(swellAt((CHARGE.pegasus + COLONY.burst) / 2) > 0.4); assert.equal(swellAt(COLONY.burst), 1);
  const before = chargeAt((CHARGE.burn + 10) * F), during = chargeAt((COLONY.burst - 3) * F);
  assert.deepEqual(Object.keys(before).sort(), ['heat', 'pulse', 'swell', 'tint']); assert.equal(before.swell, 0);
  assert.ok(during.swell > 0.95 && during.pulse <= 0.15 + 1e-9, 'silent: the flare fades as the swell rises');
  assert.equal(chargeAt(COLONY.burst * F), null, 'the colony takes over at the explosion');
  // the tool, pure: the saturated light leads, ink and paper weigh nothing; a cut splits the smoothing
  const px = Buffer.from([0, 0, 0, 255, 255, 255, 40, 90, 220, 40, 90, 220]);
  assert.deepEqual(cosmosOf(px).map(Math.round), [40, 90, 220]);
  const a = Buffer.alloc(12, 10), b = Buffer.alloc(12, 200);
  assert.deepEqual([...cutsOf([a, a, b, b])], [0, 2]);
  assert.deepEqual(smoothWithin([[0, 0, 0], [10, 10, 10], [100, 100, 100]], new Set([0, 2]), 1), [[5, 5, 5], [5, 5, 5], [100, 100, 100]]);
});

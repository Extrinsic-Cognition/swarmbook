// rite-unit1s.test.mjs: THE RITE'S UNIT1s' law (rite-unit1s.js) without a browser, and the sphere's rite door read in its source.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {RITE, HANDS, FPS, HEXES, handsAt, amountAt, flockAt, hierarchyAt, orbitTimeAt, validFlock, musicAt, thumpAt, danceAt, riteAt, mountRite, unitSteps, hexesAt, FIELD, fieldAt, fieldStrength, BIRTH, birthAt, UNFOLD, unfoldAt, PULL, pullAt, pullFall, pairs, pullPlan, FORM, formAt, formLift, VOLLEY, volleyLaunch, volleyAt, volleyPath, volleySeen, volleyCore} from './rite-unit1s.js';
import {scoreAt} from './satellites-score.js';
import {buildAssemblySkin} from '../app/assembly-geometry.js';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

test('the hand shot summons persistent swarms; later camera cuts do not dismiss them', () => {
  assert.equal(Math.round(RITE.from * 1000), 76977);
  assert.equal(Math.round(RITE.to * 1000), 80747);
  for (const t of [0, 76.9, RITE.from - 1e-6, NaN, Infinity]) assert.equal(riteAt(t), null, `t ${t}`);
  for (const t of [81, RITE.to, 80.8, 85, 100.25, 104.25, 107, 112, 125, 147.5, 154.3]) {
    const r = riteAt(t);
    assert.equal(r.amount, 1, `summoned body remains at ${t}`);
    assert.equal(r.children, 12, `its own swarm remains at ${t}`);
    assert.equal(r.hexes, HEXES, 'the units grow their own hexagons by THE HEXAGONS');
  }
});

test('the units grow once and do not shrink at the cut to Athena', () => {
  assert.ok(amountAt(RITE.from + 0.01) < 0.01);
  assert.equal(amountAt(RITE.from + RITE.in), 1);
  assert.equal(amountAt(78.5), 1, 'the bodies are fully visible during the hand gesture');
  assert.equal(amountAt(RITE.to - 0.01), 1);
  assert.equal(amountAt(RITE.to + 0.01), 1);
  let last = 0, worst = 0;
  for (let t = RITE.from; t < RITE.to; t += 1 / 240) { const a = amountAt(t); worst = Math.max(worst, Math.abs(a - last)); last = a; }
  assert.ok(worst < 0.03, `the largest step in a 240th of a second: ${worst}`);
});

test('the hand motif continues through later shots without a jump at the handoff', () => {
  for (let hand = 0; hand < 2; hand++) {
    const atCut = danceAt(hand, RITE.to), afterCut = danceAt(hand, RITE.to + 1e-6);
    assert.ok(Math.hypot(afterCut[0] - atCut[0], afterCut[1] - atCut[1]) < 1e-6);
    for (const start of [83, 94, 110, 125, 143]) {   // 143: the last 8 s inside the film since THE CUT (152.4 s)
      const samples = Array.from({length: 200}, (_, i) => danceAt(hand, start + i / 25));
      const xs = samples.map(p => p[0]), ys = samples.map(p => p[1]);
      // Hand B's captured horizontal range is narrower; even the quiet ending must retain a substantial sweep.
      assert.ok(Math.max(...xs) - Math.min(...xs) > .3, `wide repeated gesture at ${start}`);
      assert.ok(Math.max(...ys) - Math.min(...ys) > .4, `vertical repeated gesture at ${start}`);
      for (let i = 1; i < samples.length; i++) assert.ok(Math.hypot(xs[i] - xs[i - 1], ys[i] - ys[i - 1]) < .2);
    }
  }
  assert.equal(riteAt(RITE.to + RITE.handoff).amount, 1);
});

test('his two hands: sixteen keys from 2307 to 2417 in the picture, and a path that never jumps', () => {
  assert.equal(HANDS.length, 16);
  assert.equal(HANDS[0][0], 2307); assert.equal(HANDS.at(-1)[0], 2417);
  for (const k of HANDS) for (const v of k.slice(1)) assert.ok(v >= 0 && v <= 1, `key ${k[0]}`);
  for (let f = 2307; f < 2417; f += 0.25) {
    const a = handsAt(f), b = handsAt(f + 0.25);
    for (let h = 0; h < 2; h++) assert.ok(Math.hypot(b[h][0] - a[h][0], b[h][1] - a[h][1]) < 0.03, `frame ${f} hand ${h}`);
  }
  assert.deepEqual(handsAt(2366).map((h) => h.map((v) => +v.toFixed(2))), [[0.76, 0.02], [0.24, 0.02]]);
});

test('the dance follows the hands: up in the V, apart when spread wide, crossed over the helmet', () => {
  const v = 2366 / FPS, wide = 2381 / FPS;
  const [ax, ay] = danceAt(0, v), [bx, by] = danceAt(1, v);
  assert.ok(ay < -0.3 && by < -0.3, 'both sixes rise with the V');
  assert.ok(ax > 0.15 && bx < -0.15, 'and part to either side');
  assert.ok(danceAt(0, wide)[0] - danceAt(1, wide)[0] > 0.6, 'spread wide: the sixes far apart');
  assert.deepEqual(danceAt(0, 70), [0, 0]);
});

test('each trail point takes the dance of the second it was flown at; a point older than the rite has none', () => {
  const r = riteAt(79.45);
  assert.deepEqual(r.offset(0, 0), danceAt(0, 79.45));
  assert.deepEqual(r.offset(1, 0.05), danceAt(1, 79.45 - 0.05 * RITE.trail));
  assert.deepEqual(r.offset(0, 1), [0, 0]);
  assert.equal(r.hexes, HEXES);
  assert.equal(r.children, 12);
  assert.equal(r.childScale, 0.42);
});

test('the music thumps them: the score\'s onsets, each strike falling over a few frames', () => {
  let peak = 0;
  for (let t = RITE.from; t < RITE.to; t += 1 / FPS) peak = Math.max(peak, thumpAt(t));
  assert.ok(peak > 0.3, `the strongest strike in the rite: ${peak}`);
  assert.ok(riteAt(78.95).size >= 1 && riteAt(78.95).size <= 1 + RITE.thump);
});

test('mountRite gives the sphere its rite once, asks only the film, and takes it back', () => {
  const listeners = new Map(), film = {currentTime: 78.5, addEventListener: (k, f) => listeners.set(k, f), removeEventListener: (k) => listeners.delete(k)};
  let given = null; const view = {genesisSphere: {setRite: (fn) => { given = fn; }}};
  const rite = mountRite({film, view});
  assert.equal(typeof given, 'function');
  assert.equal(given().amount, 1);
  film.currentTime = 108; assert.equal(given().amount, 1);
  film.currentTime = 70; assert.equal(given(), null);
  film.currentTime = 125; assert.equal(given().amount, 1);
  film.currentTime = 0; assert.equal(given(), null);
  // the sphere's own second, when it has one (warm-sphere.js THE MINT WINDOW): the rite at it, from the film's
  film.currentTime = 119.4; assert.ok(Math.abs(given((t) => t - 0.2).t - 119.2) < 1e-9); assert.equal(given().t, 119.4); assert.equal(given(5).t, 119.4);
  rite.destroy(); assert.equal(given, null);
});

test('the sphere draws each rite unit on its own ladder, never the page\'s own skin, and the hero mounts it after the heart', () => {
  const sphere = readFileSync(here('../app/warm-sphere.js'), 'utf8');
  assert.match(sphere, /setRite\(fn\) \{ rite = typeof fn === 'function' \? fn : null; requestFrame\(\); \}/);
  const unit = sphere.slice(sphere.indexOf('function riteUnit('), sphere.indexOf('function orbitalSocieties('));
  assert.match(unit, /const skin = unitSkinAt\(node, chair\);\n\s*drawSkin\(skin, \[px, py\], body, [^\n]*, true, skin\.hexes\.length > 0\);/);
  assert.doesNotMatch(unit, /nestedSkin|layout\.skin/);
  assert.equal(sphere.match(/unitSkinAt\(/g).length, 3, 'made once and asked only by the rite\'s units: by the canvas\'s draw and by the pass handed to the kernel (THE RITE\'S UNITS ARE RUST\'S)');
  // THE FIELD: every unit placed through it (a child from its pushed parent, with its parent's fade), and each unit1's ribbon bent with it
  assert.match(unit, /fieldAt\(fieldOut, px, py, zz, body, cx, cy, fieldRadius, fieldOn \* \(1 - Math\.min\(1, pull\)\)\);\n\s*px = fieldOut\[0\]; py = fieldOut\[1\];/);
  assert.match(sphere, /fieldRadius = radius \* cosmosReach\(layout\.skin, bodyState\);/);
  // THE COLONY: the field off while the dodecahedron is out of the way; the swarm behind it lifted in front of the film, flung apart
  assert.match(sphere, /fieldOn = riteNow \? fieldStrength\(riteNow\.t\) \* \(1 - \(colony \? Math\.max\(colony\.spread, colony\.burst\) : 0\)\) : 0;/);
  assert.match(unit, /const k = arrow \? flowNow\.pull : 0, lift = !\(zz > 0\) && colonyLift > 0, pass = zz > 0 \|\| lift \|\| k > 0;/);
  // THE FLOW: the unit2s and unit3s are the arrows, tracing the film's drawn lines; the unit1s steady
  assert.match(unit, /if \(node\.depth >= 2 && flowNow && flowNow\.pull > 0 && colonyPic\) \{/);
  assert.match(unit, /const fade = fieldOut\[2\] \* \(parent === null \? 1 : familyFade\[node\.parent\]\);/);
  assert.match(unit, /function riteRibbon\(chair, color, front, center, radius\) \{[\s\S]*?fieldAt\(fieldOut, /);
  assert.match(sphere, /const seedSkin = buildAssemblySkin\(0\);/);
  assert.match(sphere, /const ladderSkins = HEXES\.ladder\.map\(\(n\) => n \? buildAssemblySkin\(n\) : seedSkin\);/);
  assert.match(sphere, /if \(!HEXES\.steps\[node\.depth\]\) return seedSkin;/);
  // the chairs' silver turns gold as a unit's first hexagons open; the page's own seed and grown skins keep their colours exactly
  assert.match(sphere, /const seed = skin\.seedness \?\? \(skin\.hexes\.length === 0 \? 1 : 0\);/);
  // one module: the sphere and the hero import the rite under the same tag
  const tag = sphere.match(/import \{orbitTimeAt, validFlock, hexesAt, HEXES, fieldAt, fieldStrength, BIRTH, birthAt, unfoldAt, PULL, pullAt, pullFall, pullPlan, FORM, formAt, formLift, VOLLEY, volleyLaunch, volleyAt, volleyPath, volleySeen, volleyCore\} from '\.\.\/lab\/rite-unit1s\.js\?v=([^']+)';/)?.[1];
  assert.ok(tag);
  const hero = readFileSync(here('./hero-mount.js'), 'utf8');
  assert.ok(hero.includes(`import {mountRite} from './rite-unit1s.js?v=${tag}';`));
  assert.match(hero, /mountHeartbeat\(\{film: found\.film[^\n]*\n\s*mountRite\(\{film: found\.film, view: found\.stage\.ownerDocument\.defaultView\}\);/);
});

test('THE HEXAGONS: the ladder is the seed, then exact Goldberg rungs; unit1s climb it, unit2s take a step, the leaves keep their seeds', () => {
  assert.equal(HEXES.ladder[0], 0);
  for (let k = 1; k < HEXES.ladder.length; k++) {
    assert.ok(HEXES.ladder[k] > HEXES.ladder[k - 1]);
    const skin = buildAssemblySkin(HEXES.ladder[k]);
    assert.equal(skin.pents.length, 12, 'twelve chairs on every rung');
    assert.equal(skin.hexes.length, HEXES.ladder[k], `rung ${k} is a skin the page's own sphere stands on`);
  }
  assert.equal(HEXES.steps[1].length, HEXES.ladder.length - 1, 'unit1s climb the whole ladder');
  assert.equal(HEXES.steps[2].length, 1);
  assert.equal(HEXES.steps[3], undefined);
  for (const node of hierarchyAt(154.3).filter((n) => n.depth === 3)) {
    assert.equal(unitSteps(node, 4).length, 0);
    assert.deepEqual(hexesAt(node, 154, 4), {level: 0, progress: 0});
  }
  for (const t of [NaN, Infinity]) assert.deepEqual(hexesAt(hierarchyAt(125)[0], t, 0), {level: 0, progress: 0});
});

test('THE HEXAGONS: each step falls due at the unit\'s own age, lands on an onset when one comes within the window, and rests before the next', () => {
  const family = hierarchyAt(154.3).filter((n) => n.depth < 3);
  let onBeat = 0, steps = 0;
  for (let chair = 0; chair < 12; chair++) for (const node of family) {
    const at = unitSteps(node, chair), due = HEXES.steps[node.depth];
    assert.equal(at.length, due.length);
    assert.equal(unitSteps(node, chair), at, 'made once');
    for (let k = 0; k < at.length; k++) {
      const owed = node.born + due[k];
      assert.ok(at[k] >= owed && at[k] <= owed + HEXES.ripple * 18 + HEXES.window, `unit ${node.id} chair ${chair} step ${k}`);
      if (scoreAt(at[k]).beat >= HEXES.beat - 1e-6) onBeat++;
      steps++;
      if (k) assert.ok(at[k] - at[k - 1] >= HEXES.morph + 6, 'slowly: each step done and rested before the next');
    }
    assert.ok(at.at(-1) + HEXES.morph < 154.3, 'grown before the film ends');
    assert.deepEqual(hexesAt(node, 154.3, chair), {level: at.length, progress: 0});
    assert.deepEqual(hexesAt(node, RITE.to, chair), {level: 0, progress: 0}, 'seeds through the hand shot');
  }
  assert.ok(onBeat / steps > 0.5, `most steps open on an onset (${onBeat} of ${steps})`);
  // a step runs round the ring: each family's unit1 steps no earlier than the family on the chair before it
  const root = family[0];
  for (let chair = 1; chair < 12; chair++) unitSteps(root, chair).forEach((s, k) => assert.ok(s >= unitSteps(root, chair - 1)[k]));
  // and not all at once: no half second holds more than an eighth of the ring's and swarms' steps (snapped to the strong hits alone, the
  // one at 100.6 s held 82 of the 192)
  const all = []; for (let chair = 0; chair < 12; chair++) for (const node of family) all.push(...unitSteps(node, chair));
  all.sort((a, b) => a - b);
  for (let i = 0, j = 0; i < all.length; i++) { while (j < all.length && all[j] - all[i] < 0.5) j++; assert.ok(j - i <= all.length / 8, `burst of ${j - i} at ${all[i]}`); }
});

test('THE HEXAGONS: a unit only grows, eased, never jumping, and a seek lands on the same place', () => {
  const family = hierarchyAt(154.3).filter((n) => n.depth < 3);
  for (const chair of [0, 5, 11]) for (const node of family) {
    let last = 0;
    for (let t = RITE.from; t < 154.3; t += 1 / 60) {
      const {level, progress} = hexesAt(node, t, chair), x = level + progress;
      assert.ok(progress >= 0 && progress < 1);
      assert.ok(x >= last && x - last < 1.6 / (60 * HEXES.morph), `unit ${node.id} chair ${chair} at ${t}`);
      last = x;
    }
  }
  const node = family[0], at = unitSteps(node, 3);
  const middle = hexesAt(node, at[1] + HEXES.morph / 2, 3);
  assert.equal(middle.level, 1); assert.ok(Math.abs(middle.progress - 0.5) < 1e-9);
  assert.deepEqual(hexesAt(node, at[1] - 1e-6, 3), {level: 1, progress: 0});
});

test('delegation grows through the buildup and release without deleting its parents', () => {
  let previous = flockAt(RITE.from);
  for (let age = 1; age <= 77; age++) {
    const now = flockAt(RITE.from + age);
    assert.ok(now.population >= previous.population && now.population <= 1884);
    assert.ok(now.orbitTime > previous.orbitTime);
    previous = now;
  }
  assert.ok(flockAt(85).population > flockAt(81).population, 'the original hand shot is not the only growth window');
  assert.ok(flockAt(96).population > flockAt(85).population * 2, 'delegation compounds during the buildup');
  assert.ok(flockAt(108).population > flockAt(100).population, 'the burn has not already exhausted the hierarchy');
  assert.equal(flockAt(125).population, 1884);
  assert.equal(flockAt(154).population, 1884);
});

test('every descendant has a persistent parent, its own chair and a smaller body', () => {
  const full = hierarchyAt(125), ids = new Set(full.map(node => node.id));
  assert.equal(full.length, 157);
  assert.equal(ids.size, full.length, 'identities are unique within a family');
  assert.deepEqual([1, 2, 3].map(depth => full.filter(node => node.depth === depth).length), [1, 12, 144]);
  const seen = new Map(), occupied = new Set();
  for (const node of full) {
    assert.ok(Number.isFinite(node.born) && node.amount === 1 && node.scale > 0);
    if (node.depth > 1) {
      const parent = seen.get(node.parent);
      assert.ok(parent, `parent of ${node.id} precedes it`);
      assert.equal(node.depth, parent.depth + 1);
      assert.ok(node.born > parent.born, 'a child is delegated after its parent exists');
      assert.ok(node.scale < parent.scale, 'the child is its own smaller unit');
      assert.ok(Number.isInteger(node.chair) && node.chair >= 0 && node.chair < 12);
      const seat = `${node.parent}:${node.chair}`;
      assert.ok(!occupied.has(seat), 'no two children occupy the same parent chair'); occupied.add(seat);
    }
    seen.set(node.id, node);
  }
  const stable = new Map(full.map(node => [node.id, {parent: node.parent, chair: node.chair, born: node.born, depth: node.depth}]));
  for (const t of [78, 81, 85, 96, 100.25, 106.5, 108, 125, 154]) {
    const family = hierarchyAt(t), present = new Map(family.map(node => [node.id, node]));
    assert.ok(family.length <= 157);
    for (const node of family) {
      assert.deepEqual({parent: node.parent, chair: node.chair, born: node.born, depth: node.depth}, stable.get(node.id));
      assert.ok(node.amount >= 0 && node.amount <= 1 && node.born <= t);
      if (node.depth > 1 && node.amount > 0) assert.ok(present.get(node.parent)?.amount > 0, 'no visible orphan');
    }
    for (const parent of family.filter(node => node.depth < 3)) {
      const later = hierarchyAt(154).find(node => node.id === parent.id);
      assert.ok(later && later.amount >= parent.amount, 'births never replace the parent');
    }
  }
  assert.deepEqual(hierarchyAt(70), []);
  assert.deepEqual(riteAt(125).family, full);
});

test('the quote gathers the family and the strike releases it without a reset', () => {
  assert.equal(flockAt(99).charge, 0);
  assert.ok(flockAt(104).charge > 0, 'the burn changes the state before the strike');
  assert.equal(flockAt(106.5).charge, 1);
  assert.equal(flockAt(106.5).release, 0);
  assert.ok(flockAt(108).release > 0 && flockAt(108).release < 1);
  assert.equal(flockAt(112).release, 1);
  assert.equal(flockAt(145).release, 1);
  const before = new Set(hierarchyAt(106.5).map(node => node.id));
  assert.ok([...before].every(id => hierarchyAt(112).some(node => node.id === id)), 'release keeps all gathered identities');
});

test('the opening is slow, seeks recover identical flock state and the loop returns to unformed bodies', () => {
  const opening = flockAt(RITE.from + .01).orbitTime - flockAt(RITE.from).orbitTime;
  assert.ok(opening > .003 && opening < .0031, 'starts near 30 percent of orbital speed');
  const later = riteAt(125);
  riteAt(70); riteAt(145);
  assert.deepEqual(riteAt(125).flock, later.flock);
  assert.deepEqual(riteAt(125).family, later.family);
  assert.equal(riteAt(0), null);
});


test('orbit phase is continuous at birth and does not depend on body visibility', () => {
  assert.equal(orbitTimeAt(70), 70);
  assert.equal(orbitTimeAt(RITE.from), RITE.from);
  assert.ok(Math.abs(orbitTimeAt(RITE.from + 1e-5) - orbitTimeAt(RITE.from - 1e-5)) < 2e-5);
  assert.equal(orbitTimeAt(125), riteAt(125).flock.orbitTime);
  const sphere = readFileSync(here('../app/warm-sphere.js'), 'utf8');
  // the film's second owns the orbits' phase; between the film's frames it is the frame on show run on by the screen's time, never past the frame
  // (on THE MINT WINDOW's way, through the sphere's own second)
  assert.match(sphere, /moment === null \? clock : orbitTimeAt\(ownNow\(\)\)/);
  assert.match(sphere, /const ownNow = \(\) => mintClockAt\(momentNow\(\), mintMode\);/);
  assert.match(sphere, /const momentNow = \(\) => moment \+ Math\.min\(FRAME_S, Math\.max\(0, \(performance\.now\(\) - momentAt\) \/ 1000\)\);/);
});

test('invalid callback populations cannot exceed the fixed pool or stop drawing', () => {
  const f = flockAt(125);
  assert.ok(validFlock(f));
  for (const value of [undefined, {}, {...f, perRoot: RITE.maxPerRoot + 1}, {...f, scale: NaN}, {...f, refinement: 2}, {...f, bank: NaN}, {...f, stretch: 3}]) assert.ok(!validFlock(value));
});

test('the full soundtrack keeps driving formation and wings after the opening shot', () => {
  for (const start of [84, 100, 120, 142]) {
    const samples = Array.from({length: 120}, (_, i) => flockAt(start + i / FPS));
    for (const field of ['bank', 'spread', 'stretch', 'flutter']) {
      const values = samples.map(f => f[field]);
      assert.ok(Math.max(...values) - Math.min(...values) > .02, `${field} responds at ${start}`);
    }
    for (const f of samples) assert.ok(validFlock(f));
  }
  let previous = musicAt(RITE.from).phase;
  for (let t = RITE.from; t < 154; t += .01) {
    const phase = musicAt(t).phase;
    assert.ok(phase >= previous && phase - previous < .04, 'musical phase never jumps or reverses');
    previous = phase;
  }
  assert.deepEqual(musicAt(125), musicAt(125));
});

test('THE FIELD: behind the sphere or clear of it nothing moves; in front a unit lands on the rim, never pulled in', () => {
  const out = new Float64Array(3), cx = 600, cy = 400, R = 200, body = 20;
  const rim = R * FIELD.rim + body * FIELD.body;
  for (const [x, y, zz] of [[600, 400, -0.5], [650, 420, -0.01], [620, 410, 0], [900, 400, 0.8], [600, 400 - rim - R * FIELD.soft - 1, 1]]) {
    assert.deepEqual([...fieldAt(out, x, y, zz, body, cx, cy, R)], [x, y, 1], `${x},${y} at depth ${zz} stays`);
  }
  // in front, deep inside and clear of the eye: on the rim (his "tiny overlap": the rest of its body may lie over the faces), fully seen
  for (const angle of [0, 1, 2.5, 4, 5.5]) for (const d of [0.3 * R, 0.5 * R, 0.7 * R]) {
    fieldAt(out, cx + Math.cos(angle) * d, cy + Math.sin(angle) * d, 1, body, cx, cy, R);
    assert.ok(Math.abs(Math.hypot(out[0] - cx, out[1] - cy) - rim) < 1e-9, `on the rim at ${angle}, ${d}`);
    assert.ok(Math.abs(Math.atan2(out[1] - cy, out[0] - cx) - Math.atan2(Math.sin(angle), Math.cos(angle))) < 1e-9, 'along its own line from the centre');
    assert.equal(out[2], 1);
  }
  // along any radius, in front: never pulled in, and the order of distances kept (a path never folds back)
  let last = 0;
  for (let d = 0.5; d < 2 * R; d += 0.5) {
    fieldAt(out, cx + d, cy, 1, body, cx, cy, R);
    const to = Math.hypot(out[0] - cx, out[1] - cy);
    assert.ok(to >= d - 1e-9 && to >= last - 1e-9, `at ${d}`);
    last = to;
  }
  assert.equal(fieldAt(out, cx, cy, 1, body, cx, cy, R)[2], 0, 'through the eye, unseen');
  assert.equal(fieldAt(out, cx, cy, -1, body, cx, cy, R)[2], 1, 'behind, the faces hide it: no fade');
  assert.ok(Object.isFrozen(FIELD) && FIELD.rim < 1, 'the rim a little inside the sphere: a tiny overlap allowed');
});

test('THE FIELD: a unit in sight never jumps; one crossing the middle fades out and in rather than being thrown across', () => {
  const out = new Float64Array(3), cx = 600, cy = 400, R = 200, body = 18;
  // straight passes across the front at every impact parameter, coming round from behind and going back
  for (let b = -1.4 * R; b <= 1.4 * R; b += R / 20) {
    let prev = null;
    for (let s = -2.2 * R; s <= 2.2 * R; s += 0.5) {
      const zz = Math.cos(s / (2.2 * R) * Math.PI / 2) * 1.1 - 0.1;
      const [x, y, fade] = fieldAt(out, cx + s, cy + b, zz, body, cx, cy, R);
      if (prev && fade >= 0.9 && prev[2] >= 0.9) {
        const step = Math.hypot(x - prev[0], y - prev[1]);
        assert.ok(step <= 8 * 0.5 + 1e-9, `a seen unit jumped ${step.toFixed(2)} px at impact ${b}, s ${s}`);
      }
      prev = [x, y, fade];
    }
  }
  // dead centre: the fade goes to nothing in the middle and comes back by twice the eye
  const fades = [];
  for (let s = -R; s <= R; s += R / 50) fades.push(fieldAt(out, cx + s, cy, 1, body, cx, cy, R)[2]);
  assert.ok(Math.min(...fades) < 0.01 && fades[0] === 1 && fades.at(-1) === 1);
});

test('THE FIELD comes on at the cut to Athena, his checkpoint: the summon before it is drawn exactly as it was', () => {
  assert.equal(Math.round(FIELD.from * 1000), 80747);
  for (const t of [RITE.from, 78, 80.7, FIELD.from, NaN]) assert.equal(fieldStrength(t), 0, `off at ${t}`);
  assert.ok(fieldStrength(FIELD.from + FIELD.in / 2) > 0.4 && fieldStrength(FIELD.from + FIELD.in / 2) < 0.6);
  for (const t of [FIELD.from + FIELD.in, 97.5, 99.8, 145]) assert.equal(fieldStrength(t), 1, `on at ${t}`);
  const out = new Float64Array(3);
  assert.deepEqual([...fieldAt(out, 610, 395, 1, 20, 600, 400, 200, 0)], [610, 395, 1], 'strength 0: untouched, unfaded');
  let last = null;
  for (let t = FIELD.from - 0.2; t < FIELD.from + 1.2; t += 1 / 60) {
    const s = fieldStrength(t), d = Math.hypot(...[...fieldAt(out, 650, 400, 1, 20, 600, 400, 200, s)].slice(0, 2).map((v, i) => v - [600, 400][i]));
    if (last !== null) assert.ok(d >= last - 1e-9 && d - last < 12, `eases out, never jumps, at ${t}`);
    last = d;
  }
  assert.ok(last > 190, 'and lands on the rim once the field is on');
});

test('THE BIRTH: sparks onto the faces, each face peeled off onto his hand in its stream, out to its orbit, folded shut before the cut to Athena', () => {
  for (const t of [NaN, 70, RITE.from - 1e-6]) assert.equal(birthAt(0, t), null);
  assert.ok(BIRTH.spark < BIRTH.peel && BIRTH.peel < BIRTH.spread && BIRTH.spread < BIRTH.close && BIRTH.closed < RITE.to);
  for (let chair = 0; chair < 12; chair++) {
    const k = chair >> 1, early = birthAt(chair, BIRTH.spark - 0.01);
    assert.ok(early && early.spark === 0 && early.peel === 0 && early.orbit === 0 && early.fold === 0, 'nothing before its spark');
    assert.ok(birthAt(chair, BIRTH.peel + k * BIRTH.stagger).spark > 1 - 1e-9, 'the spark has struck by the time its face lifts');
    const riding = birthAt(chair, 78.6);
    assert.equal(riding.peel, 1); assert.equal(riding.orbit, 0); assert.equal(riding.fold, 0);
    assert.equal(riding.hand, chair % 2); assert.equal(riding.rank, k);
    assert.deepEqual(riding.ride, handsAt((78.6 - (k + 1) * BIRTH.lag) * FPS)[chair % 2], 'its hand, its place in the stream behind');
    const out = birthAt(chair, BIRTH.close + k * 0.05 - 0.001);
    assert.ok(out.orbit === 1 && out.fold === 0, 'on its orbit, still a pentagon');
    assert.equal(birthAt(chair, BIRTH.closed), null, 'shut and handed back to the orbits by the last close');
    let last = null;
    for (let t = RITE.from; t < BIRTH.closed; t += 1 / 240) {
      const b = birthAt(chair, t);
      if (!b) break;
      if (last) for (const key of ['spark', 'peel', 'orbit', 'fold']) assert.ok(b[key] >= last[key] && b[key] - last[key] < 0.05, `${key} only grows, never jumps (${chair} at ${t})`);
      last = b;
    }
  }
  // the six of a hand leave in their order, the first first
  const t = BIRTH.peel + 0.1, peels = [0, 2, 4, 6, 8, 10].map((c) => birthAt(c, t).peel);
  for (let i = 1; i < 6; i++) assert.ok(peels[i] <= peels[i - 1]);
});

test('THE BIRTH: a unit1\'s first child waits until the twelve are whole, and keeps its own birth for its hexagons', () => {
  const held = hierarchyAt(BIRTH.closed - 0.01);
  assert.ok(held.every((node) => node.depth === 1 || node.amount === 0), 'no child before the twelve have closed');
  const first = hierarchyAt(BIRTH.closed + RITE.childIn).find((node) => node.id === 1);
  assert.equal(first.amount, 1);
  assert.ok(Math.abs(first.born - (RITE.from + 1.1)) < 1e-9, 'born on the rite\'s clock as before (THE HEXAGONS count from it)');
});

test('THE UNFOLDING: the leaves keep their seeds until Pegasus spreads his wings, then open as a wave; parents never do', () => {
  assert.equal(Math.round(UNFOLD.at * FPS), 3100);
  const family = hierarchyAt(125);
  for (const node of family) {
    if (node.depth < 3) { for (const t of [100, 104, 125]) assert.equal(unfoldAt(node, t, 0), 0, 'a parent stays a polyhedron'); continue; }
    assert.equal(unfoldAt(node, UNFOLD.at - 0.01, 0), 0, 'shut before the beat');
    if (node.born + RITE.childIn * 0.5 <= UNFOLD.at) assert.equal(unfoldAt(node, UNFOLD.at + UNFOLD.ripple + UNFOLD.over, 1), 1, 'open by the wave\'s end');
    else {
      assert.equal(unfoldAt(node, node.born + RITE.childIn * 0.5, 0), 0, 'a later leaf opens with its birth');
      assert.equal(unfoldAt(node, node.born + RITE.childIn * 0.5 + UNFOLD.over, 0), 1);
    }
    let last = 0;
    for (let t = UNFOLD.at - 0.5; t < UNFOLD.at + 3; t += 1 / 60) { const u = unfoldAt(node, t, 0.5); assert.ok(u >= last && u - last < 0.06); last = u; }
  }
  const leaf = family.find((node) => node.depth === 3 && node.born < 95);
  assert.ok(unfoldAt(leaf, UNFOLD.at + 0.3, 0) > unfoldAt(leaf, UNFOLD.at + 0.3, 1), 'the wave runs out from the dodecahedron');
  assert.equal(unfoldAt(null, 120), 0);
});

test('the sphere draws the birth and the leaves as THE ORIGAMI on the page\'s own seed, under the rite\'s tag', () => {
  const sphere = readFileSync(here('../app/warm-sphere.js'), 'utf8');
  const tag = sphere.match(/from '\.\.\/lab\/rite-unit1s\.js\?v=([^']+)';/)?.[1];
  assert.ok(tag);
  assert.ok(sphere.includes(`import {makeOrigami, poseInto} from '../lab/origami.mjs?v=${tag}';`));
  assert.match(sphere, /const origami = seedSkin\.pents\.map\(\(_, root\) => makeOrigami\(seedSkin\.pents, root\)\);/);
  const unit = sphere.slice(sphere.indexOf('function riteUnit('), sphere.indexOf('function orbitalSocieties('));
  assert.match(unit, /draw\.oS = birth\.fold - 1;/);
  assert.match(unit, /s = clamp\(s \+ unfoldAt\(node, t, /);
  assert.doesNotMatch(unit, /wingPhase|refinement\) \* f|lineTo\(0, -body \* \.65\)/, 'no flat chevrons left');
});

test('THE PULL: from the cut to the draw each unit falls as a stone falls, is caught past its place and rings back in, then rests', () => {
  assert.equal(Math.round(PULL.at * FPS), 3540);
  const node = hierarchyAt(125).find((n) => n.depth === 2 && n.id === 7);
  for (const t of [NaN, 100, PULL.at - 1e-6]) assert.equal(pullAt(node, 3, t), 0);
  const fall = pullFall(node, 3);
  assert.ok(fall >= PULL.fall[0] && fall <= PULL.fall[0] + PULL.fall[1]);
  assert.ok(Math.abs(pullAt(node, 3, PULL.at + fall / 2) - 0.25) < 1e-9, 'the square of the time: a quarter of the way at half the fall');
  let peak = 0;
  for (let t = PULL.at + fall; t < PULL.at + fall + 1; t += 1 / 240) peak = Math.max(peak, pullAt(node, 3, t));
  assert.ok(peak > 1.02 && peak <= 1 + PULL.snap, `caught a little past its place (${peak})`);
  assert.ok(Math.abs(pullAt(node, 3, PULL.at + fall + 2) - 1) < 1e-4, 'and at rest on it');
  let last = 0;
  for (let t = PULL.at; t < PULL.at + fall; t += 1 / 240) { const w = pullAt(node, 3, t); assert.ok(w >= last); last = w; }
  // the unit1s fall in their order round the hands, the swarms each at their own
  const falls = [...Array(12).keys()].map((c) => pullFall({depth: 1, id: 0}, c));
  assert.ok(Math.min(...falls) >= PULL.fall[0] && Math.max(...falls) < PULL.fall[0] + PULL.fall[1]);
  assert.equal(pullFall(node, 3), pullFall(node, 3), 'pure');
});

test('pairs: the least-cost assignment, checked against every permutation', () => {
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const perms = (a) => a.length <= 1 ? [a] : a.flatMap((x, i) => perms([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p]));
  for (let trial = 0; trial < 20; trial++) {
    const n = 2 + (trial % 4), m = n + (trial % 3), cost = Float64Array.from({length: n * m}, () => Math.round(rnd() * 100) / 10);
    const got = pairs(cost, n, m), total = (rows) => rows.reduce((s, c, i) => s + cost[i * m + c], 0);
    assert.equal(new Set(got).size, n, 'one column a row');
    let best = Infinity;
    for (const cols of perms([...Array(m).keys()])) best = Math.min(best, total(cols.slice(0, n)));
    assert.ok(Math.abs(total(Array.from(got)) - best) < 1e-9, `trial ${trial}: ${total(Array.from(got))} vs ${best}`);
  }
  assert.throws(() => pairs(new Float64Array(6), 3, 2));
});

test('THE PULL\'s plan: the twelve take the twelve pentagons one each; the 144 swarms take a hex each, round their unit1\'s pentagon', () => {
  const skin = buildAssemblySkin(150), homes = [...Array(12).keys()].map((i) => [Math.cos(i), Math.sin(i * 1.7), Math.cos(i * 2.3)]);
  const plan = pullPlan(homes, skin.pents, skin.hexes), again = pullPlan(homes, skin.pents, skin.hexes);
  assert.deepEqual([...plan.posts].sort((a, b) => a - b), [...Array(12).keys()], 'a pentagon each');
  assert.equal(new Set(plan.swarms).size, 144, 'a hex each: no hex crowded');
  assert.deepEqual(plan, again, 'the same sphere, the same plan');
  const unitOf = (a) => { const l = Math.hypot(...a); return a.map((v) => v / l); }, dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  for (let i = 0; i < 12; i++) {
    const n = unitOf(skin.pents[plan.posts[i]].normal);
    for (let c = 0; c < 12; c++) {
      const h = unitOf(skin.hexes[plan.swarms[i * 12 + c]].center);
      assert.ok(Math.acos(dot(n, h)) < 0.6, 'a swarm stays round its unit1\'s pentagon');
    }
  }
  // the nearest as a whole: no two unit1s would both be nearer by swapping their pentagons
  for (let i = 0; i < 12; i++) for (let j = i + 1; j < 12; j++) {
    const d = (a, k) => 1 - dot(unitOf(homes[a]), unitOf(skin.pents[k].normal));
    assert.ok(d(i, plan.posts[i]) + d(j, plan.posts[j]) <= d(i, plan.posts[j]) + d(j, plan.posts[i]) + 1e-9);
  }
  // fewer hexes than swarms: each hex takes as few as it can
  const small = buildAssemblySkin(80), crowded = pullPlan(homes, small.pents, small.hexes), load = new Map();
  for (const h of crowded.swarms) load.set(h, (load.get(h) || 0) + 1);
  assert.ok(Math.max(...load.values()) <= Math.ceil(144 / small.hexes.length));
});

test('the sphere lays THE PULL on its own skin: the unit1s on their posts, the swarms on their hexes, the field let go of what is caught', () => {
  const sphere = readFileSync(here('../app/warm-sphere.js'), 'utf8');
  assert.match(sphere, /plan = pullPlan\(Array\.from\(\{length: 12\}, \(_, i\) => loopPoint\(i, at\)\), skin\.pents, skin\.hexes\);/);
  assert.match(sphere, /pullPlace\(pullOut, plan\.posts\[chair\], PULL\.altitude, w1, head\[0\], head\[1\], depth, center, radius, \.35\);/);
  const unit = sphere.slice(sphere.indexOf('function riteUnit('), sphere.indexOf('function orbitalSocieties('));
  assert.match(unit, /const hex = plan\.swarms\[chair \* 12 \+ node\.chair\]/);
  assert.match(unit, /1 - PULL\.gather \* Math\.min\(1, familyPull\[node\.parent\]\)/);
});

test('THE FORMATION: a swarm takes its places on its hex as it is caught, whole before the arrow is fully drawn; through THE AIM it is drawn up as a bowstring and held to the loose', () => {
  assert.equal(Math.round(FORM.aim * FPS), 3740);
  assert.equal(Math.round(FORM.drawn * FPS), 3825);
  const node = {depth: 2, id: 5}, caught = PULL.at + pullFall(node, 3);
  for (const t of [NaN, 100, caught + FORM.after - 1e-9]) assert.equal(formAt(caught, t), 0);
  assert.ok(formAt(caught, caught) > 0, 'the leaves fly in as their unit2 falls');
  assert.equal(formAt(NaN, 125), 0);
  assert.equal(formAt(caught, caught + FORM.after + FORM.over), 1);
  let last = 0;
  for (let t = caught + FORM.after - 0.1; t < caught + 2; t += 1 / 120) { const f = formAt(caught, t); assert.ok(f >= last && f - last < 0.03); last = f; }
  // every swarm of every family whole before the arrow is fully drawn (frame 3616, THE CLIMAX: the page freezes there until the mint is over)
  const unit2s = hierarchyAt(125).filter((n) => n.depth === 2), drawn = 3616 / FPS;
  assert.equal(unit2s.length, 12);
  for (let chair = 0; chair < 12; chair++) for (const n of unit2s) assert.equal(formAt(PULL.at + pullFall(n, chair), drawn), 1);
  // THE DRAW: the pull's hover until THE AIM, drawn up through its close-up, held to the loose
  for (const t of [NaN, 118, FORM.aim]) assert.equal(formLift(t), PULL.hover);
  assert.ok(Math.abs(formLift(FORM.drawn) - (PULL.hover + FORM.draw)) < 1e-12);
  assert.equal(formLift(VOLLEY.at), formLift(FORM.drawn));
  last = 0;
  for (let t = FORM.aim - 1; t < VOLLEY.at; t += 1 / 60) { const l = formLift(t); assert.ok(l >= last); last = l; }
});

test('THE VOLLEY: shot at the loose from the hexes into the centre, a swarm an arrow; every unit delivered and the core dark again before THE ARROW COMES', () => {
  assert.equal(Math.round(VOLLEY.at * FPS), 3856);
  const comes = 3931 / FPS, unit2s = hierarchyAt(125).filter((n) => n.depth === 2), launches = [];
  for (let chair = 0; chair < 12; chair++) for (const n of unit2s) {
    const l = volleyLaunch(n, chair);
    assert.ok(l >= VOLLEY.at && l < VOLLEY.at + VOLLEY.stagger);
    assert.equal(l, volleyLaunch(n, chair), 'pure');
    launches.push(l);
  }
  assert.ok(new Set(launches).size > 100, 'each swarm its own moment');
  assert.ok(Math.max(...launches) + 12 * VOLLEY.lag + VOLLEY.flight < comes, 'the last leaf delivered before the arrow comes');
  // a flight: nothing before its launch, its whole flight in VOLLEY.flight seconds
  for (const t of [NaN, 100, VOLLEY.at]) assert.equal(volleyAt(VOLLEY.at, t), 0);
  assert.equal(volleyAt(NaN, 129), 0);
  assert.ok(Math.abs(volleyAt(VOLLEY.at, VOLLEY.at + VOLLEY.flight) - 1) < 1e-12);
  // the way in: from its place to the centre, springing off and then at one speed, never back
  assert.equal(volleyPath(0), 0); assert.equal(volleyPath(-1), 0); assert.equal(volleyPath(1), 1); assert.equal(volleyPath(2), 1);
  let last = 0, speed = 0;
  for (let k = 1; k <= 1000; k++) {
    const p = volleyPath(k / 1000), v = (p - last) * 1000;
    assert.ok(p >= last && v >= speed - 1e-6 && v < 1.2);
    last = p; speed = v;
  }
  // seen whole until it folds into the core, then delivered
  assert.equal(volleySeen(0), 1); assert.equal(volleySeen(1 - VOLLEY.absorb), 1); assert.equal(volleySeen(1), 0); assert.equal(volleySeen(3), 0);
  // the core: dark before the first folds into it, lit through the arrivals, dark again before the arrow comes
  assert.equal(volleyCore(NaN), 0); assert.equal(volleyCore(VOLLEY.at), 0);
  assert.equal(volleyCore(VOLLEY.at + VOLLEY.flight + 0.3), 1);
  assert.equal(volleyCore(comes), 0);
});

test('the sphere lays THE FORMATION on each swarm\'s own hex and shoots THE VOLLEY into its centre; the twelve keep their posts', () => {
  const sphere = readFileSync(here('../app/warm-sphere.js'), 'utf8');
  const unit = sphere.slice(sphere.indexOf('function riteUnit('), sphere.indexOf('function orbitalSocieties('));
  // the swarm's post over its panel where it is seen (the open vessel's), drawn up as the bow is, and in to the sphere's centre from the loose
  assert.match(unit, /pullPlace\(pullOut, 12 \+ hex, formPostLift\(hex, formLift\(t\), volleyPath\(flight\)\), pull, /);
  assert.match(sphere, /return \(Math\.hypot\(s\[w\], s\[w \+ 1\], s\[w \+ 2\]\) \* shellNow\.centre \+ lift\) \* \(1 - inward\) - 1;/);
  assert.match(sphere, /shellNow = bodyState\.heat > 0 \? cosmosScales\(bodyState\) : SHELL_REST;/);
  // each leaf on its own place on its swarm's hex, then after its unit2 into the centre; a delivered swarm stays delivered with no plan (the end card)
  assert.match(unit, /node\.depth === 3 \? volleyAt\(familyLaunch\[node\.parent\] \+ VOLLEY\.lag \* \(1 \+ node\.chair\), t\) : 0;/);
  assert.ok(unit.indexOf('familyLaunch[node.id] = volleyLaunch(node, chair)') < unit.indexOf('if (plan) {'), 'the launch is known before, and without, the plan');
  assert.match(unit, /formPlace\(formOut, familyHex\[node\.parent\], node\.chair, formLift\(t\), volleyPath\(flight\), \[cx, cy\], stageRadius\);/);
  // aimed at the centre, beating as one
  assert.match(unit, /heading \+= turnTo\(heading, Math\.atan2\(px - cx, py - cy\)\) \* form;/);
  assert.match(unit, /draw\.oPhase = f\.flutter \+ node\.id \* \.38 \* \(1 - form\);/);
  // the unit1s' posts are THE PULL's alone
  assert.match(sphere, /pullPlace\(pullOut, plan\.posts\[chair\], PULL\.altitude, w1, /);
  // the places made once a skin; the core's light in the near pass only
  assert.match(sphere, /formSlots\.set\(skin, slots\);/);
  assert.match(sphere, /if \(riteNow\) \{ paintRiteUnits\(\); if \(front && !unitsLate\) paintCore\(center, radius\); \}/); assert.match(sphere, /glass\.draw\(1\); ctx = glass\.top; if \(unitsLate\) \{ paintArrows\(\); paintCore\(center, radius\); \}/, 'over the glass when the kernel drew the units');
});

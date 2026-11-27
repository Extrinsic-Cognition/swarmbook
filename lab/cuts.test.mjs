// cuts.test.mjs: THE CUTS WIRED (cuts.js), the plan the hero's faces follow, held without a browser. nice -n 19 node --test cuts.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {cutsAt, planOf, shotsOf, blockOrder, blockShows, gridOf, nameOf, nearestFace, facing, restTurn, frameOf, startOf, conversionOf,
  FPS, PASS, BEAT, HOLES, SEED, KEEP, BURSTS, FACES, FILM_CUTS, FLURRIES, TAGS_AT_REV_1, CUTS_GLSL} from './cuts.js';

const bd = JSON.parse(fs.readFileSync(new URL('./braindance.json', import.meta.url), 'utf8'));
const shots = shotsOf(bd);   // the record's own `cuts` once it holds them, else FILM_CUTS: never its camera list
const opts = {tags: TAGS_AT_REV_1, shots};   // one object, as a page asks
const at = (t, o = opts) => cutsAt(t, o);
const seconds = FILM_CUTS.map(c => c[0]);

test('the beat is the film\'s own cuts, never the camera list: 24.0, 28.0 and 32.0 s are not cuts', () => {
  assert.equal(seconds.length, 28);
  if (!Array.isArray(bd.cuts)) assert.deepEqual(shots, seconds);
  assert.deepEqual(shotsOf({camera: [{t: [0, 2.6]}, {t: [2.6, 5]}, {t: [28, 32]}]}), seconds);   // a record with no cuts: FILM_CUTS, not its list
  assert.deepEqual(shotsOf({cuts: [29.563, [36.57, 0.43], {t: 38.071, score: 0.42}, {frame: 1269}]}), [29.563, 36.57, 38.071, {t: 1269 / FPS, frame: 1269}]);
  for (const t of [24.0, 28.0, 32.0]) { assert.equal(at(t).cut, null, `${t}`); assert.equal(at(t).blocks, null); assert.equal(at(t).pass, 'picture'); }
  // every cut lands on the frame its pts begins
  for (const s of seconds) assert.ok(Math.abs(Math.round(s * FPS) - s * FPS) < 0.02, `${s} is a frame's pts`);
});

test('the pass at the first burst: the picture, the normals, the gold matte, the picture back', () => {
  assert.equal(frameOf(11.044), 330);   // the second written short of the frame it begins
  const seen = [11.00, 11.10, 11.25, 11.45].map(t => [at(t).pass, at(t).passFrame]);
  assert.deepEqual(seen, [['picture', null], ['normals', 1], ['matte', 6], ['picture', null]]);
  // frame by frame from the cut: 6 normals, 4 matte, then the picture; the cut begins on frame 331 (11.0444 s), the first of the hit
  const from = 331, run = [];
  for (let f = from - 1; f <= from + PASS.normals + PASS.matte; f++) run.push(at(startOf(f) + 0.001).pass);
  assert.deepEqual(run, ['picture', ...Array(6).fill('normals'), ...Array(4).fill('matte'), 'picture']);
});

test('the same device at every burst and at his conversion tag', () => {
  const sequence = (t0) => { const f0 = Math.round(t0 * FPS), out = []; for (let k = -2; k < 14; k++) out.push(at(startOf(f0 + k) + 0.001).pass); return out; };
  const conversion = conversionOf(TAGS_AT_REV_1);
  assert.equal(conversion.t, 61.767);
  assert.deepEqual(sequence(BURSTS[0]), sequence(BURSTS[1]));
  assert.deepEqual(sequence(BURSTS[0]), sequence(startOf(frameOf(61.767))));
  assert.equal(at(61.80).cut.why, 'conversion');
  // with no conversion tag on the line of time there is no pass there
  const without = {tags: TAGS_AT_REV_1.slice(0, 2), shots};
  assert.equal(cutsAt(61.80, without).pass, 'picture');
  assert.equal(cutsAt(11.10, without).pass, 'normals');
});

test('the codec\'s cut at the film\'s cut to her shoulder: the two-shot stands, half filled, filled', () => {
  const cut = Math.round(29.563 * FPS);   // frame 886, the cut to over Athena's shoulder
  assert.equal(cut, 886);
  const a = at(startOf(cut + 0.5)), b = at(startOf(cut + 3.5)), c = at(startOf(cut + 7.5));
  assert.equal(a.cut.kind, 'blocks'); assert.equal(a.cut.frame, cut); assert.equal(a.cut.why, 'cut');
  assert.deepEqual([a.blocks.filled, b.blocks.filled, c.blocks], [0, 0.5, null]);
  assert.equal(a.blocks.seed, SEED); assert.equal(a.blocks.holes, HOLES); assert.equal(a.blocks.cut, 29.563);
  assert.ok(a.blocks.since >= 0 && a.blocks.since < 1 / FPS);
  assert.ok(Math.abs(b.blocks.since - (startOf(cut + 3.5) - cut / FPS)) < 1e-9);
  assert.equal(a.pass, 'picture');
  // the page keeps the frames just before it, the last of them stands
  const keeps = []; for (let f = cut - KEEP - 1; f < cut; f++) keeps.push(at(startOf(f) + 0.001).keep);
  assert.deepEqual(keeps, [null, 29.563, 29.563, 29.563]);
  // filled rises a sixth a frame and ends with the beat
  const fill = []; for (let f = cut; f < cut + BEAT + 1; f++) fill.push(at(startOf(f) + 0.001).blocks?.filled ?? 'done');
  assert.deepEqual(fill, [0, 1 / 6, 2 / 6, 3 / 6, 4 / 6, 5 / 6, 'done']);
});

test('a cut that carries its frame lands on that frame, whatever its second says', () => {
  const record = {camera: [{t: [19, 28]}, {t: [28, 32]}, {t: [32, 36.6]}], cuts: [{t: 28, frame: 835}, 32]};
  assert.deepEqual(shotsOf(record), [{t: 28, frame: 835}, 32]);
  const o = {tags: [], shots: record}, at835 = cutsAt(startOf(835) + 0.001, o), at839 = cutsAt(startOf(839) + 0.001, o);
  assert.equal(at835.cut.frame, 835); assert.equal(at835.blocks.filled, 0); assert.equal(at835.blocks.cut, 28);
  assert.equal(at839.blocks.filled, 4 / 6);
  assert.equal(cutsAt(startOf(834) + 0.001, o).keep, 28);
  assert.equal(cutsAt(startOf(831) + 0.001, o).keep, null);
  assert.equal(cutsAt(startOf(Math.round(32 * FPS)) + 0.001, o).cut.frame, Math.round(32 * FPS));   // a shot with no frame: its second
  // seconds and {t, frame} mix in one list
  assert.equal(cutsAt(startOf(835) + 0.001, {shots: [{t: 28, frame: 835}, 38]}).cut.frame, 835);
});

test('the rule of one: a pass wins over a shot change inside it, one device at a time, each on the film\'s own beat', () => {
  const plan = planOf(opts);
  const kinds = plan.cuts.map(c => `${c.kind} ${c.t}`);
  assert.ok(kinds.includes('pass 11.044') && !kinds.includes('blocks 11.044'));   // the burst and the cut at one frame: the pass
  assert.ok(kinds.includes('pass 37.1') && !kinds.includes('blocks 37.204'));     // the cut at 37.204 s is the fourth frame of the 37.10 s pass
  assert.ok(kinds.includes('blocks 36.57') && kinds.includes('blocks 38.071'));
  assert.equal(plan.cuts.filter(c => c.kind === 'blocks').length, seconds.length - 2);
  assert.equal(plan.cuts.filter(c => c.kind === 'pass').length, 3);
  for (let i = 1; i < plan.cuts.length; i++) assert.ok(plan.cuts[i].frame >= plan.cuts[i - 1].frame + plan.cuts[i - 1].span, `${kinds[i - 1]} and ${kinds[i]} overlap`);
  // every block cut begins on one of the film's cuts, every pass on a burst or his tag
  for (const c of plan.cuts) assert.ok(c.kind === 'blocks' ? seconds.includes(c.t) : [...BURSTS, 61.767].includes(c.t));
});

test('none of ours where the film runs its own cut device, nor where a caller keeps a moment for its own', () => {
  const plan = planOf(opts);
  for (const [a, b] of FLURRIES) for (const c of plan.cuts) assert.ok(c.frame + c.span <= frameOf(a) || c.frame > frameOf(b), `${c.kind} ${c.t} in the flurry ${a} to ${b}`);
  for (let t = 64.9; t < 69.6; t += 1 / FPS) assert.equal(at(t).cut, null);
  // a conversion tag inside a flurry gets no pass there
  const late = {tags: [{id: 'x', t: 66.0, text: 'the conversion'}], shots};
  assert.equal(cutsAt(66.05, late).pass, 'picture');
  // the hero keeps 42.342 s for its box: the cut there stands down, the ones around it stay
  assert.equal(at(startOf(1269) + 0.001).cut.kind, 'blocks');
  const box = {tags: TAGS_AT_REV_1, shots, quiet: [...FLURRIES, [42.342, 42.6]]};
  assert.equal(cutsAt(startOf(1269) + 0.001, box).cut, null);
  assert.equal(cutsAt(startOf(Math.round(39.339 * FPS)) + 0.001, box).cut.kind, 'blocks');
});

test('no dissolve anywhere: every frame of the record is one state, the fill moves in whole steps', () => {
  const passes = new Set(), fills = new Set();
  for (let f = 0; f < Math.ceil(81 * FPS); f++) {
    const p = at(startOf(f) + 0.001);
    passes.add(p.pass);
    assert.ok(!(p.pass !== 'picture' && p.blocks), `frame ${f}: two devices`);
    if (p.blocks) { fills.add(p.blocks.filled); assert.ok(p.blocks.filled >= 0 && p.blocks.filled < 1); }
  }
  assert.deepEqual([...passes].sort(), ['matte', 'normals', 'picture']);
  assert.deepEqual([...fills].sort((a, b) => a - b), [0, 1, 2, 3, 4, 5].map(k => k / BEAT));
});

test('his tags are chips from their second on, coloured and named in order, each on its own face', () => {
  assert.deepEqual(at(5).chips, []);
  const c = at(37.2);
  assert.equal(c.pass, 'normals');   // kept through the cut: the chips stand while the faces show the pass
  assert.deepEqual(c.chips.map(x => [x.t, x.name, x.colour]), [[10.835, 'SACRIFICE', '#29c5dc'], [37.132, 'AIOLOS', '#f2cb2c']]);
  assert.deepEqual(at(80).chips.map(x => x.name), ['SACRIFICE', 'AIOLOS', 'CONVERSION']);
  const faces = at(80).chips.map(x => x.face);
  assert.equal(new Set(faces).size, 3);
  // the first chip's face is the one that faced the eye at its second, under the page's resting turn
  assert.equal(faces[0], nearestFace(restTurn(10.835)));
  const z = FACES.map(n => facing(n, restTurn(10.835)));
  assert.equal(Math.max(...z), z[faces[0]]);
  // words carried for a title, the id for a reader
  assert.equal(c.chips[1].id, 'mv7zv4nd2u');
  assert.match(c.chips[1].words, /AIOLOS STARTS APPEARING/);
  // the Nest's value is taken as it stands, tags in any order
  const fromRef = cutsAt(70, {tags: {tags: [...TAGS_AT_REV_1].reverse()}, shots});
  assert.deepEqual(fromRef.chips.map(x => x.name), ['SACRIFICE', 'AIOLOS', 'CONVERSION']);
  assert.equal(nameOf('a new moment here'), 'A NEW');
});

test('the one seeded order: each block once, the same every time, the shares the shader shows', () => {
  const [cols, rows] = gridOf(960, 540);
  assert.deepEqual([cols, rows], [60, 34]);
  const a = blockOrder(cols, rows), b = blockOrder(cols, rows), c = blockOrder(cols, rows, SEED + 1), n = cols * rows;
  assert.deepEqual(a, b);
  assert.notDeepEqual(a, c);
  const ranks = [...a].map(r => Math.round(r * n - 0.5)).sort((x, y) => x - y);
  assert.deepEqual(ranks, Array.from({length: n}, (_, i) => i));
  const share = (filled) => { const k = {new: 0, hole: 0, old: 0}; for (const r of a) k[blockShows(r, filled)]++; return Object.fromEntries(Object.entries(k).map(([w, v]) => [w, Math.round(v / n * 100)])); };
  assert.deepEqual(share(0), {new: 0, hole: 30, old: 70});
  assert.deepEqual(share(0.5), {new: 50, hole: 15, old: 35});
  assert.deepEqual(share(5 / 6), {new: 83, hole: 5, old: 12});
  // the order is spread over the frame, not a sweep: the first sixth to fill touches every band of rows
  const first = new Set(); [...a].forEach((r, i) => { if (r < 1 / 6) first.add(Math.floor(Math.floor(i / cols) / 6)); });
  assert.equal(first.size, Math.ceil(rows / 6));
});

test('the shader half names its uniforms and keeps the JS rule', () => {
  for (const u of ['uPass', 'uFilled', 'uHoles', 'uHeld', 'uHeldOk', 'uOrder', 'uFilmPx', 'uGrid', 'cutsPass', 'cutsBlock']) assert.ok(CUTS_GLSL.includes(u), u);
  assert.match(CUTS_GLSL, /r < uFilled \+ uHoles \* \(1\.0 - uFilled\)/);
});

test('pure and cheap: the same second gives the same plan; a call costs about a microsecond', () => {
  assert.deepEqual(at(28.1), cutsAt(28.1, {tags: TAGS_AT_REV_1, shots}));
  const n = 200000, t0 = process.hrtime.bigint();
  let sink = 0;
  for (let i = 0; i < n; i++) sink += at((i % 2430) / FPS).chips.length;
  const us = Number(process.hrtime.bigint() - t0) / 1000 / n;
  console.log(`# cutsAt: ${us.toFixed(3)} us a call over ${n} calls (sink ${sink})`);
  assert.ok(us < 50, `${us} us a call`);
});

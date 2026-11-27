// seiya-flight.test.mjs: THE TWELVE ON SEIYA (seiya-flight.mjs), without a browser. His words, Oct 21 2026 WEST: "as soon as athena is the scene maker
// i want to see the dodecahedron faces do the thing that was done on the sagyttarius when it appeared, meaning i want the faces to asseble around saint
// seya there", then "why are you not using the same exact formula used before? why this gay formation? we go back to the dodecahedron in the next scene
// after athena". Pinned: it is THE TWELVE's own law (sagittarius-flight.mjs twelveLaw), no copy of it; no face before the cut to Athena's shot (2172)
// nor from the cut to Dolbar (2247); at the cut no face is in the picture, they come down the column from beyond the canvas's edge on erratic paths
// and arrive round him as its gold is gone; his glory about the place the measure holds on his figure, whole on the canvas; the twelve close into one
// glass on him a beat before the cut, never leaving him; no hole; never faster than THE TWELVE's law; the road hands it to the theater by its law
// from the one cut to the other; a sample costs microseconds.
// node --test embertide-app/ui/intro/dyson-society/lab/seiya-flight.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SEIYA_FLIGHT_START, SEIYA_FLIGHT_END, SOURCE, ENTRY, BOOM_START, BOOM_END, GATHERED, FINISH, FIN_HIT, seiyaFlight, gatheredAt, lightAt} from './seiya-flight.mjs';
import {canvasOf, qrot, FACES, GLORY, TIERS, RING_IN, SMALL, FACE_MIN, FINISH as SKY_FINISH, FIN_HIT as SKY_FIN_HIT} from './sagittarius-flight.mjs';
import {TWELVE_SEIYA_DCT} from './twelve-seiya-dct.js';
import {pictureViewport} from './mint-freeze-layout.mjs';

const W = 1194, H = 834;   // an iPad held across, as THE TWELVE's tests
const FPS = 30000 / 1001;
// the glass the theater had a frame before (the page's sphere: no burst comes before this flight)
const origin = {c: [.12, -.03], r: .27, q: [.18, -.32, .09, .925], sep: .34, persp: 0};
const at = (t, w = W, h = H) => seiyaFlight(t, w, h, origin);
const picture = pictureViewport(W, H), ph = picture.height * 534 / 540 / H, S = (t) => canvasOf(picture, W, H, lightAt(t).source);
const times = (from, to, hz) => Array.from({length: Math.floor((to - from) * hz) + 1}, (_, i) => from + i / hz);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);
const turn = (a, b, c) => { const u = [b[0] - a[0], b[1] - a[1]], v = [c[0] - b[0], c[1] - b[1]];
  return Math.acos(Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1]) / ((Math.hypot(...u) * Math.hypot(...v)) || 1)))); };
const outOfCanvas = (x, w = W, h = H) => Math.abs(x.c[0]) > w / h / 2 + 1.7 * x.s || Math.abs(x.c[1]) > .5 + 1.7 * x.s;
const END = SEIYA_FLIGHT_END - 1e-3;

test('the same exact formula: THE TWELVE\'s law over this span, no law of its own', () => {
  const src = readFileSync(new URL('./seiya-flight.mjs', import.meta.url), 'utf8');
  assert.match(src, /twelveLaw\(TWELVE_SEIYA_DCT, /);
  assert.doesNotMatch(src, /function (pose|glory|flightOf|ringOf)\b/, 'a copy of the law');
  assert.deepEqual([...new Set(times(SEIYA_FLIGHT_START, END, 60).map((t) => at(t).phase))], ['boomerang', 'gather', 'glory', 'finisher']);
});

test('the cuts: from the cut to Athena\'s shot (2172) to the cut to Dolbar (2247), where the page\'s dodecahedron is back; none before or after', () => {
  assert.equal(Math.round(SEIYA_FLIGHT_START * FPS), 2172); assert.equal(Math.round(SEIYA_FLIGHT_END * FPS), 2247);
  assert.equal(at(SEIYA_FLIGHT_START - 1e-3), null);
  for (const t of [SEIYA_FLIGHT_END, SEIYA_FLIGHT_END + .5, 76.977]) assert.equal(at(t), null, `a flight at ${t} s`);
  for (const t of times(SEIYA_FLIGHT_START, END, 60)) {
    const f = at(t);
    assert.ok(f && f.faces.length === 12 && f.faces.every(x => x.c.every(Number.isFinite) && x.s > 0 && Number.isFinite(x.glow)), `no twelve at ${t.toFixed(3)} s`);
    assert.equal(new Set(f.faces.map(x => x.seat)).size, 12, 'one seat a face');
    assert.deepEqual(at(t), f, 'a pure function of the film\'s second');
    assert.equal(f.sing, null, 'no hole on him');
  }
});

test('the measure: the column converges at his feet; once its gold has gone his place is held on his figure; the moments', () => {
  const rows = TWELVE_SEIYA_DCT.rows, from = TWELVE_SEIYA_DCT.from;
  assert.deepEqual(TWELVE_SEIYA_DCT.cuts, [2172, 2247]); assert.equal(from + rows.length, 2247);
  assert.ok(rows[0][2] >= 40 && rows[0][1] > 700, 'the column at the cut, its source at his feet');
  for (let n = 2175; n < 2247; n++) { const r = rows[n - from]; assert.deepEqual([r[0], r[1], r[9]], [248, 710, '000000000000'], `frame ${n}`); }
  const late = SOURCE[rows.length - 1];
  assert.ok(Math.abs(late[0] - .166) < .002 && Math.abs(late[1] - .71) < .002, `his place ${late}`);
  assert.ok(ENTRY < Math.PI / 6 || ENTRY > 11 * Math.PI / 6, `the column's direction ${(ENTRY / Math.PI * 6).toFixed(2)} o'clock: from above`);
  assert.ok(Math.abs(BOOM_START - SEIYA_FLIGHT_START) < 1e-12, 'as soon as Athena is the scene maker');
  assert.equal(Math.round(BOOM_END * FPS), 2185, 'home as the column\'s gold is gone');
  assert.ok(GATHERED > BOOM_END && GATHERED < FINISH - 1, `his glory from ${GATHERED.toFixed(3)} to ${FINISH.toFixed(3)} s`);
  assert.ok(Math.abs(FIN_HIT - (SEIYA_FLIGHT_END - .1)) < 1e-9, 'one glass a beat before the cut');
  assert.ok(FIN_HIT - FINISH >= SKY_FIN_HIT - SKY_FINISH - 1e-9, 'the finisher has at least THE TWELVE\'s time to close');
});

test('as soon as Athena is the scene maker: no face in the picture at the cut; down the column from beyond the edge, erratic, home round him', () => {
  for (const [w, h] of [[W, H], [839, 1053], [390, 844], [1920, 1080]]) {
    const f = at(SEIYA_FLIGHT_START, w, h);
    assert.equal(f.phase, 'boomerang');
    for (const x of f.faces) assert.ok(outOfCanvas(x, w, h), `a face on the canvas at the cut (${w} x ${h})`);
  }
  const f0 = at(SEIYA_FLIGHT_START);
  assert.deepEqual(f0.c, origin.c); assert.equal(f0.r, origin.r);
  const dir = [Math.sin(ENTRY), Math.cos(ENTRY)], s0 = S(BOOM_START);
  for (const x of at(SEIYA_FLIGHT_START + .02).faces) { const v = [x.c[0] - s0[0], x.c[1] - s0[1]]; assert.ok((v[0] * dir[0] + v[1] * dir[1]) / Math.hypot(...v) > .7, 'a face not on the column\'s side'); }
  const home = at(BOOM_END - 1e-4), s = S(BOOM_END - 1e-4);
  for (const x of home.faces) assert.ok(Math.abs(dist(x.c, s) / ph - RING_IN) < .03, `a face ${(dist(x.c, s) / ph).toFixed(3)} picture heights from him`);
  const paths = Array.from({length: 12}, (_, i) => times(BOOM_START, BOOM_END - 1e-4, 240).map((t) => at(t).faces[i].c));
  for (const path of paths) { let turning = 0; for (let k = 2; k < path.length; k++) turning += turn(path[k - 2], path[k - 1], path[k]); assert.ok(turning > Math.PI / 2, `a path turned only ${turning.toFixed(2)} radians`); }
  for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) assert.ok(paths[a].some((p, k) => dist(p, paths[b][k]) > .02 * ph), `faces ${a} and ${b} fly the same path`);
  assert.ok(BOOM_END - BOOM_START < .5, 'rapid: the column\'s fading');
});

test('his glory: about his place in GLORY\'s two tiers, all round him, whole on the canvas, never under FACE_MIN across', () => {
  for (const t of times(SEIYA_FLIGHT_START, END, 120)) for (const x of at(t).faces) {
    assert.ok(2 * x.s >= FACE_MIN * ph, `a face ${(2 * x.s / ph).toFixed(3)} picture heights across at ${t.toFixed(3)} s`);
    if (t >= BOOM_END) assert.ok(Math.abs(x.c[0]) <= W / H / 2 - x.s + 1e-9 && Math.abs(x.c[1]) <= .5 - x.s + 1e-9, `a face off the canvas at ${t.toFixed(3)} s`);
  }
  assert.equal(gatheredAt(BOOM_END), 0); assert.ok(Math.abs(gatheredAt(GATHERED) - 1) < 1e-9, 'gathered');
  for (const t of times(GATHERED + .02, FINISH - .02, 10)) {
    const g = at(t), s = S(t);
    assert.equal(g.phase, 'glory');
    for (const x of g.faces) { const d = dist(x.c, s) / ph; assert.ok(d > GLORY * TIERS[0] * .7 && d < GLORY * TIERS[1] * 1.2, `a face ${d.toFixed(3)} picture heights from him at ${t.toFixed(2)} s`); }
    // round him, a glory and not a heap: the twelve's directions about him span more than half a turn, and no two faces sit on each other
    const ang = g.faces.map((x) => Math.atan2(x.c[0] - s[0], x.c[1] - s[1])).sort((a, b) => a - b);
    const gapMax = Math.max(...ang.map((a, i) => (i ? a - ang[i - 1] : a + 2 * Math.PI - ang[11])));
    assert.ok(2 * Math.PI - gapMax > Math.PI, `the twelve span only ${((2 * Math.PI - gapMax) * 180 / Math.PI).toFixed(0)} degrees about him at ${t.toFixed(2)} s`);
    for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) assert.ok(dist(g.faces[a].c, g.faces[b].c) > g.faces[a].s * .9, `faces ${a} and ${b} on each other at ${t.toFixed(2)} s`);
  }
});

test('the finisher: the twelve close into one glass on him a beat before the cut, the dodecahedron again, never leaving him', () => {
  assert.equal(at(FINISH + .01).phase, 'finisher');
  for (const t of times(GATHERED, END, 120)) {
    const f = at(t), s = S(t), mean = f.faces.reduce((m, x) => [m[0] + x.c[0] / 12, m[1] + x.c[1] / 12], [0, 0]);
    assert.ok(dist(mean, s) < (t < FIN_HIT ? .4 : .05) * ph, `the twelve left him at ${t.toFixed(3)} s`);
  }
  const g = at(FIN_HIT + .01), sg = S(FIN_HIT + .01);
  assert.ok(g.q, 'one glass with its turn');
  g.faces.forEach((x, i) => {
    const n = qrot(g.q, FACES[i]);
    assert.ok(dist(x.c, [sg[0] + SMALL * ph * .7947 * n[0], sg[1] + SMALL * ph * .7947 * n[1]]) < 1e-9, `face ${i} not in its place in the glass on him`);
  });
  assert.ok(at(END).faces.every((x) => dist(x.c, S(END)) < SMALL * ph * 1.1), 'the glass on him at the cut');
});

test('never a jump: at 120 frames a second no face moves faster than 8 picture heights a second (THE TWELVE\'s law)', () => {
  let was = at(SEIYA_FLIGHT_START), fastest = 0, when = 0;
  for (const t of times(SEIYA_FLIGHT_START + 1 / 120, END, 120)) {
    const f = at(t);
    f.faces.forEach((x, i) => { const v = dist(x.c, was.faces[i].c) * 120 / ph; if (v > fastest) { fastest = v; when = t; } });
    was = f;
  }
  assert.ok(fastest < 8, `a face moved ${fastest.toFixed(2)} picture heights a second at ${when.toFixed(3)} s`);
  console.log(`# the fastest face ${fastest.toFixed(2)} picture heights a second, at ${when.toFixed(3)} s`);
});

test('the road hands it to the theater from the cut to Athena\'s shot to the cut to Dolbar, by its law; THE TWELVE\'s road is as it was', () => {
  const road = readFileSync(new URL('./hero-mount.js', import.meta.url), 'utf8'), theater = readFileSync(new URL('./theater.js', import.meta.url), 'utf8');
  assert.match(road, /const skyFlight = t => freezeSpace && hold === null && t >= SKY_FLIGHT_START && t < SKY_FLASH;/);
  assert.match(road, /const seiyaFlight = t => freezeSpace && hold === null && t >= SEIYA_FLIGHT_START && t < SEIYA_FLIGHT_END;/);
  assert.match(road, /const SEIYA_TWELVE = Object\.freeze\(\{anchor: 'light', law: 'seiya'\}\);/);
  assert.match(road, /flight: skyFlight\(t\) \? TWELVE : seiyaFlight\(t\) && SEIYA_TWELVE/);
  assert.match(road, /\|\| seiyaNear\(t\)\)\) \{ canvas\.hidden = false; theater\.setActive\(true\); \}/, 'the theater is awake for it');
  assert.match(theater, /const fly=way\?\.flight\?\.law==='seiya'\?seiyaFlight:skyFlight;/);
});

test('cost: a sample in microseconds (the theater asks one a frame while the twelve fly, none at rest)', () => {
  const n = 4000, cpu0 = process.threadCpuUsage();
  let sink = 0;
  for (let i = 0; i < n; i++) sink += at(SEIYA_FLIGHT_START + (i % 600) / 600 * (END - SEIYA_FLIGHT_START)).faces[i % 12].c[0];
  const cpu = process.threadCpuUsage(cpu0), us = (cpu.user + cpu.system) / n;
  assert.ok(Number.isFinite(sink));
  assert.ok(us < 200, `${us.toFixed(2)} us of CPU a sample`);
  console.log(`# a sample (the twelve and their velocities): ${us.toFixed(2)} us of CPU, one a frame`);
});

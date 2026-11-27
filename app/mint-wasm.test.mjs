// mint-wasm.test.mjs: THE FRAME IN ONE WASM, pinned to the page's own JS (Oct 15 2026; his "i want it invariant but way more optimized... do all
// rust c low wasm"). house/embertide-mint's doors (./wasm/embertide-mint.wasm through mint-wasm.mjs) answer the same numbers as warm-sphere.js's
// jsFrame twins and warm-assembly.js's laws, |delta| < 1e-9 on every double of every buffer (the stars' pixels 1e-7: STARS_TOL), over invented
// inputs; the layouts are the sizes the drawing reads; a skin past the kernel's 1024 faces is the twin's. Run: node --test app/mint-wasm.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {load, FRAME} from './mint-wasm.mjs';
import {jsFrame, packSkin, useWasm, frameOf, FRAME as SPHERE_FRAME, poseAt, handAt, momentPhase, momentCosmos} from './warm-sphere.js';
import {loopPoint, loopUnitAt} from './warm-assembly.js';
import {buildAssemblySkin} from './assembly-geometry.js';

let seed = 0x5eed2026;
const rnd = () => { seed = (seed + 0x6D2B79F5) >>> 0; let t = seed; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const R = (a, b) => a + (b - a) * rnd();
const near = (a, b, what, tol = 1e-9) => {
  assert.equal(a.length, b.length, `${what}: ${a.length} doubles, the JS has ${b.length}`);
  let worst = 0, exact = 0;
  for (let i = 0; i < a.length; i++) {
    if (Object.is(a[i], b[i]) || (Number.isNaN(a[i]) && Number.isNaN(b[i]))) { exact++; continue; }
    const d = Math.abs(a[i] - b[i]);
    assert.ok(d < tol, `${what} [${i}]: wasm ${a[i]} js ${b[i]} (delta ${d})`);
    if (d > worst) worst = d;
  }
  return {worst, exact, n: a.length};
};
// THE STARS ARE A SIN HASH (warm-sphere.js STARS: x = (sin(i * 127.1 + 38.2) * 43758.5453) % 1, y the same by 9631.131), so one ulp of sin between
// the page's V8 and the kernel's libm moves a star's table by about 4e-12, and its pixel by that times the width. On the serving Mac (arm64, Node
// 26.7, Oct 15 2026) star 54 differs: 3.64e-12 in the table, 5.8e-9 px at 1,600 px wide, every other double of every builder within 1e-9 there.
// The kernel's bytes are the same on every glass; the twin's sin is the platform's. The builder's stars are held to 1e-7 px.
const STARS_TOL = 1e-7;
const K = await load();

test('the layouts the drawing reads are the kernel\'s', () => {
  assert.deepEqual(FRAME, SPHERE_FRAME);
  assert.equal(K.trails(18000, 0, 0, 0, 0, 1).length, FRAME.TRAILS);
  assert.equal(K.rings(0, 0, 0, 1).length, FRAME.RINGS + FRAME.TICKS);
  assert.equal(K.stars(0, 1, 1, 0, 0, 1).length, FRAME.STARS);
  assert.equal(K.trace(new Float32Array(257), 18000, 0, 0, 0, 0, 1, 1).length, 12 * 257 * 4);
  assert.equal(K.trace(new Float32Array(681), 18000, 0, 0, 0, 0, 1, 1), null, 'a strip past TRACE_MAX is not the kernel\'s');
  assert.equal(K.trace(new Float32Array(1), 18000, 0, 0, 0, 0, 1, 1), null);
});

test('the laws: loopUnitAt, loopPoint, poseAt, handAt, momentPhase, momentCosmos, the stars\' table', () => {
  let worst = 0;
  for (let i = 0; i < 300; i++) {
    const chair = Math.floor(R(0, 12)), at = R(-2e5, 4e5), u = R(-10, 10), t = R(-5, 160);
    worst = Math.max(worst, near(K.loopUnitAt(chair, u, at), loopUnitAt(chair, u, at), 'loopUnitAt').worst);
    worst = Math.max(worst, near(K.loopPoint(chair, at), loopPoint(chair, at), 'loopPoint').worst);
    const p = K.poseAt(t), q = poseAt(t);
    near([p.yaw, p.pitch], [q.yaw, q.pitch], 'poseAt');
    near([K.handAt(t), K.momentPhase(t), K.momentCosmos(t)], [handAt(t), momentPhase(t), momentCosmos(t)], 'handAt, momentPhase, momentCosmos');
  }
  for (const t of [NaN, Infinity, -Infinity, 29.563, 38.071, 107, 112, 147.5, 100.25, 106.5, 114]) {
    const p = K.poseAt(t), q = poseAt(t);
    near([p.yaw, p.pitch, K.handAt(t), K.momentPhase(t), K.momentCosmos(t)], [q.yaw, q.pitch, handAt(t), momentPhase(t), momentCosmos(t)], `the laws at ${t}`);
  }
  const stars = jsFrame.stars(0, 1, 1, -10, -10, 0);
  for (let i = 0; i < 76; i++) { const s = K.star(i); near([(s[0] + 1) % 1, (s[1] + 1) % 1], [stars[i * 4], stars[i * 4 + 1]], `star ${i}`); }   // the frame folds the table's x and y into [0, 1)
  assert.ok(worst < 1e-9, `worst delta ${worst}`);
});

test('the frame builders: trails, rings, stars, the ECG strips, the faces of every skin the page draws, 1e-9 to the twins (the stars 1e-7 px)', () => {
  const report = {};
  const note = (what, r) => { const e = report[what] || (report[what] = {worst: 0, exact: 0, n: 0}); e.worst = Math.max(e.worst, r.worst); e.exact += r.exact; e.n += r.n; };
  const skins = [0, 20, 30, 80, 110, 150, 240, 480].map(n => buildAssemblySkin(n));
  for (let i = 0; i < 40; i++) {
    const at = R(0, 3e5), yaw = R(-7, 7), pitch = R(-1.35, 1.35), cx = R(100, 900), cy = R(100, 700), radius = R(20, 400), orbital = radius * R(1.5, 1.7) * R(1, 1.4), clock = R(0, 400);
    note('trails', near(K.trails(at, yaw, pitch, cx, cy, orbital), jsFrame.trails(at, yaw, pitch, cx, cy, orbital), 'trails'));
    note('rings', near(K.rings(yaw, cx, cy, radius), jsFrame.rings(yaw, cx, cy, radius), 'rings'));
    const beat = Float32Array.from({length: i % 3 === 0 ? 257 : 65 + 4 * i}, (_, k) => (k % 11 === 0 ? 1 : R(-.3, .3)) * (k % 5 === 0 ? 0 : 1));
    note('trace', near(K.trace(beat, at, yaw, pitch, cx, cy, orbital, radius), jsFrame.trace(beat, at, yaw, pitch, cx, cy, orbital, radius), 'trace'));
    const skin = skins[i % skins.length], p = packSkin(skin);
    note('faces', near(K.faces(p.packed, p.n, yaw, pitch, cx, cy, radius), jsFrame.faces(p.packed, p.n, yaw, pitch, cx, cy, radius), `faces of ${p.n}`));
  }
  for (let i = 0; i < 40; i++) { const a = [R(0, 400), R(300, 1600), R(300, 1000), R(100, 900), R(100, 700), R(20, 400)]; note('stars', near(K.stars(...a), jsFrame.stars(...a), 'stars', STARS_TOL)); }
  for (const [what, e] of Object.entries(report)) assert.ok(e.worst < (what === 'stars' ? STARS_TOL : 1e-9), `${what}: worst ${e.worst}`);
  console.log('  ' + Object.entries(report).map(([k, e]) => `${k}: ${e.n} doubles, ${e.exact} bit-identical, worst ${e.worst.toExponential(1)}`).join('; '));
});

test('the order of the faces is the JS sort\'s (stable, far first), and a skin past 1024 faces is drawn by the twin', () => {
  for (const n of [0, 20, 150, 800]) {
    const skin = buildAssemblySkin(n), p = packSkin(skin);
    const a = K.faces(p.packed, p.n, 0.7, -0.3, 330, 300, 180), b = jsFrame.faces(p.packed, p.n, 0.7, -0.3, 330, 300, 180);
    assert.deepEqual(Array.from(a.subarray(p.n * FRAME.FACE_OUT)), Array.from(b.subarray(p.n * FRAME.FACE_OUT)), `the order of ${p.n} faces`);
  }
  const big = packSkin(buildAssemblySkin(1200));
  assert.ok(big.n > FRAME.FACES_MAX, `${big.n} faces`);
  assert.equal(K.faces(big.packed, big.n, 0.7, -0.3, 330, 300, 180), null, 'not the kernel\'s');
  const twin = jsFrame.faces(big.packed, big.n, 0.7, -0.3, 330, 300, 180);
  assert.equal(twin.length, big.n * (FRAME.FACE_OUT + 1), 'the twin draws it');
});

test('useWasm swaps the kernel in and out; the twins stand until it lands', () => {
  assert.equal(frameOf(), jsFrame);
  assert.equal(useWasm(K), true); assert.equal(frameOf(), K);
  assert.equal(useWasm(null), false); assert.equal(frameOf(), jsFrame);
  assert.equal(useWasm({loaded: false}), false);
});

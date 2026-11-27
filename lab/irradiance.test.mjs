// irradiance.test.mjs: THE INVERSION OF THE MASK at the golden flash: its plan (irradiancePlan: the light's reach integrated from the morpho-field
// the mount gives, the liquor's level, a cut in and a cut out), its data (golden-field.js, measured again off the film when the film and ffmpeg
// are here), its glass (the page's own dodecahedron, or the box's turn and place), its picture (the theater's), its clock (mountIrradiance on a
// stand-in film and stage) and THE GUARD: the hero mounts it at the golden flash (45.445 s) only, never on the red burst (11.044 s), without
// a browser.
// node --test embertide-app/ui/intro/dyson-society/lab/irradiance.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {IRRADIANCE, FPS, EDGE, CORNERS, momentOf, framesOf, irradiancePlan, reachFor, levelAt, pictureOf, glassOutline, paintIrradiance, mountIrradiance} from './irradiance.js';
import {FIELD_GOLDEN} from './golden-field.js';
import {FIELD_AFTER} from './dolbar-field-after.js';
import {FIELD} from './dolbar-field.js';
import {FILM_CUTS} from './cuts.js';
import {measure as measureField, moduleText as fieldText} from '../tools/morpho-field.mjs';
import {buildAssemblySkin} from '../app/assembly-geometry.js'; import {filmStandIn} from '../worker/stand-ins.mjs';

const here = (f) => new URL(f, import.meta.url);
const src = fs.readFileSync(here('./irradiance.js'), 'utf8');
const page = fs.readFileSync(here('./hero-mount.js'), 'utf8');   // the hero's mount (app/warm.html mounts it itself since lane/one-page)
const theaterSrc = fs.readFileSync(here('./theater.js'), 'utf8');
const unboxingSrc = fs.readFileSync(here('./unboxing.js'), 'utf8');
const FILM = fileURLToPath(here('../app/saint-seiya.mp4'));
const ffmpeg = spawnSync('ffmpeg', ['-version'], {stdio: 'ignore'}).status === 0;
// THE MOMENT the hero gives: the cut to the white-gold burst of rays to the cut to the gold centaur in flames, the field between them
const GOLDEN = momentOf({at: 45.445, until: 50.05, field: FIELD_GOLDEN});
const {at, until, span} = GOLDEN, {fill} = IRRADIANCE;
const frameTime = (n) => (n * 1001) / 30000;
// the stages: the first proof's (1,205 x 900, the stand-in's below), a wide desktop's, and a phone's (the stage's own floor, 520 px tall); the
// sphere's canvas fills the stage, its centre 55 % across and halfway down, its radius a fifth of the shorter side (warm-sphere.js); the glass
// is the box standing open 0.42 radii below it (unboxing.js DROP), where the hero's light starts from
const STAGES = [[1205, 900], [1440, 900], [390, 520]].map(([w, h]) => { const r = Math.min(w, h) * 0.2; return Object.freeze({centre: [w * 0.55, h / 2 + 0.42 * r], radius: r, width: w, height: h}); });
const GEO = STAGES[0];
const farOf = (geo) => { const p = pictureOf(geo.width, geo.height); return Math.max(...[[0, 0], [1, 0], [0, 1], [1, 1]].map(([a, b]) => Math.hypot(p.x + a * p.w - geo.centre[0], p.y + b * p.h - geo.centre[1]))); };

test('off outside the window: before the golden flash (the red burst too), at the centaur\'s cut and after, all of it zero', () => {
  for (const t of [0, 4.471, 10.9, 11.044, 11.2, 16.2, 37.1, 42.342, 45.0, 45.4, at - 1e-6, frameTime(1361), until, frameTime(1500), until + 0.1, 53.053, 60]) {
    const p = irradiancePlan(t, GEO, GOLDEN);
    assert.equal(p.on, false, `${t} s`);
    assert.deepEqual([p.k, p.level, p.alpha], [0, 0, 0], `${t} s`);
    assert.ok(p.reach instanceof Float32Array && p.reach.length === 64 && p.reach.every((v) => v === 0), `${t} s`);
  }
  assert.equal(irradiancePlan(NaN, GEO, GOLDEN).on, false);
  assert.equal(irradiancePlan(46, {...GEO, radius: 0}, GOLDEN).on, false);
  assert.equal(irradiancePlan(46, null, GOLDEN).on, false);
});

test('THE MOMENT IS THE MOUNT\'S: no flash and no field built in; a moment is at < until with its field', () => {
  assert.throws(() => irradiancePlan(46, GEO), /a moment needs/);
  assert.throws(() => momentOf({at: 46, until: 45, field: FIELD_GOLDEN}), /at < until/);
  assert.throws(() => momentOf({at: 45.445, until: 50.05}), /morpho-field/);
  assert.throws(() => mountIrradiance({}), /a moment needs/);
  assert.equal(momentOf({at: 45.445, until: 50.05, field: FIELD_GOLDEN}), GOLDEN, 'one moment, memoized');
  assert.ok(Math.abs(span - 4.605) < 1e-9);
  // the source names no second of the film and imports no field: the red burst's (11.044 s, dolbar-field-after.js) is not in it
  assert.doesNotMatch(src, /^import /m, 'irradiance.js imports nothing');
  assert.doesNotMatch(src, /dolbar-field|FIELD_AFTER|FIELD_GOLDEN = /);
  assert.equal('at' in IRRADIANCE || 'burst' in IRRADIANCE, false);
});

test('on at the flash\'s own frame (1362): a cut in, the liquor at the glass\'s floor, the light at its edge', () => {
  const edge = GEO.radius * EDGE;
  const p0 = irradiancePlan(frameTime(1362), GEO, GOLDEN);
  assert.equal(p0.on, true);
  assert.equal(p0.alpha, 1, 'no dissolve: whole on its first frame');
  assert.ok(p0.level >= 0 && p0.level < 0.02, `${p0.level}`);   // 0.4 ms after the flash: a ball's section of 0.012 holds 0.0004 of it
  for (const r of p0.reach) assert.ok(Math.abs(r - edge) < 0.5, `${r}`);
  const p = irradiancePlan(45.6, GEO, GOLDEN);
  assert.ok(Math.abs(p.k - (45.6 - at) / span) < 1e-12);
  assert.equal(p.alpha, 1);
  assert.ok(p.level > 0 && p.level < 0.3, `${p.level}`);
  for (const r of p.reach) assert.ok(r > edge && r < edge + GEO.radius * 0.5, `${r}`);
  // the window's frames are the film's own from the cut to the burst to the frame before the cut to the centaur
  assert.deepEqual(framesOf(GOLDEN), [1362, 1499]);
});

test('the reach grows in every direction, between frames and across them, on every stage', () => {
  for (const geo of STAGES) {
    let before = irradiancePlan(at, geo, GOLDEN).reach;
    for (const r of before) assert.ok(Math.abs(r - geo.radius * EDGE) < 1e-3, 'every direction starts at the glass\'s edge');
    for (let t = at + 1 / 240; t < until; t += 1 / 240) {
      const now = irradiancePlan(t, geo, GOLDEN).reach;
      for (let d = 0; d < 64; d++) assert.ok(now[d] > before[d], `${geo.width} x ${geo.height}, ${t.toFixed(4)} s, direction ${d}: ${now[d]} after ${before[d]}`);
      before = now;
    }
  }
});

test('by the cut every direction has passed the picture\'s far corner, on every stage; on the base alone by 0.75 of the window', () => {
  for (const geo of STAGES) {
    const far = farOf(geo), plan = reachFor(geo, GOLDEN);
    assert.ok(Math.abs(plan.far - far) < 1e-9);
    for (const r of irradiancePlan(until - 1e-6, geo, GOLDEN).reach) assert.ok(r > far, `${geo.width} x ${geo.height}: ${r} of ${far}`);
    for (const r of irradiancePlan(at + IRRADIANCE.base * span + 1e-4, geo, GOLDEN).reach) assert.ok(r > far - 0.01, `${geo.width} x ${geo.height}: ${r} of ${far}`);
    // and not long before: the light does not get everywhere at once (the slowest direction is still short of the far corner at half the window)
    assert.ok(Math.min(...irradiancePlan(at + span / 2, geo, GOLDEN).reach) < far, `${geo.width} x ${geo.height}`);
  }
});

// THE FIELD read here on its own (the bytes, a bilinear read between the cells' centres, as anti-satellites.js flowAt), each direction's ray
// from the glass's edge to the picture's edge at 8 points, the stage mapped through the theater's picture onto the film's crop and the decode
const BYTES = (() => { const b = Buffer.from(FIELD_GOLDEN.flow, 'base64'); return new Int8Array(b.buffer, b.byteOffset, b.length); })();
function flowGolden(n, fx, fy) {
  const k = n - FIELD_GOLDEN.from, [W, H] = FIELD_GOLDEN.decode, [C, R] = FIELD_GOLDEN.grid, [ox, oy] = FIELD_GOLDEN.origin, cell = FIELD_GOLDEN.cell;
  if (k < 0 || k >= FIELD_GOLDEN.to - FIELD_GOLDEN.from) return [0, 0];
  const u = Math.min(C - 1, Math.max(0, (fx * W - ox) / cell - 0.5)), v = Math.min(R - 1, Math.max(0, (fy * H - oy) / cell - 0.5));
  const c0 = Math.min(Math.floor(u), C - 2), r0 = Math.min(Math.floor(v), R - 2), a = u - c0, b = v - r0;
  const cellAt = (c, r, j) => BYTES[k * C * R * 2 + (r * C + c) * 2 + j];
  const read = (j) => (cellAt(c0, r0, j) * (1 - a) + cellAt(c0 + 1, r0, j) * a) * (1 - b) + (cellAt(c0, r0 + 1, j) * (1 - a) + cellAt(c0 + 1, r0 + 1, j) * a) * b;
  return [read(0), read(1)];
}
function outwardAlong(geo, d, n) {   // px a frame on the stage, the mean of the outward part of the flow along direction d's ray
  const p = pictureOf(geo.width, geo.height), [x0, y0, cw, ch] = IRRADIANCE.crop, [fw, fh] = IRRADIANCE.size, [dw, dh] = FIELD_GOLDEN.decode;
  const a = (d / 64) * 2 * Math.PI, ux = Math.cos(a), uy = Math.sin(a), [cx, cy] = geo.centre, edge = geo.radius * EDGE;
  const exits = [ux > 0 ? (p.x + p.w - cx) / ux : ux < 0 ? (p.x - cx) / ux : Infinity, uy > 0 ? (p.y + p.h - cy) / uy : uy < 0 ? (p.y - cy) / uy : Infinity];
  const exit = Math.min(...exits);
  let sum = 0;
  for (let j = 0; j < 8; j++) {
    const t = edge + ((j + 0.5) / 8) * (exit - edge), px = cx + ux * t, py = cy + uy * t;
    const [vx, vy] = flowGolden(n, (x0 + ((px - p.x) / p.w) * cw) / fw, (y0 + ((py - p.y) / p.h) * ch) / fh);
    sum += vx * (p.w / cw) * (fw / dw) * ux + vy * (p.h / ch) * (fh / dh) * uy;
  }
  return sum / 8;
}

test('the morpho-field directs it: at 46.6 s the directions the burst\'s rays push outward reach further than the least pushed', () => {
  const first = Math.round(at * FPS) + 1, last = Math.floor(46.6 * FPS);   // frames 1363 to 1396: the burst's first 1.155 s
  for (const geo of STAGES) {
    // each direction's push over those frames, as the light takes it (outward only), and signed
    const out = Array.from({length: 64}, (_, d) => { let s = 0; for (let n = first; n <= last; n++) s += Math.max(0, outwardAlong(geo, d, n)); return s; });
    const signed = Array.from({length: 64}, (_, d) => { let s = 0; for (let n = first; n <= last; n++) s += outwardAlong(geo, d, n); return s; });
    assert.ok(signed.filter((s) => s < 0).length >= 8 && signed.filter((s) => s > 0).length >= 32, `${geo.width} x ${geo.height}: the field pushes both ways`);
    const order = [...out.keys()].sort((a, b) => out[b] - out[a]), most = order.slice(0, 16), least = order.slice(-16);
    const p = irradiancePlan(46.6, geo, GOLDEN), mean = (ds) => ds.reduce((s, d) => s + p.reach[d], 0) / ds.length;
    const slowestMost = Math.min(...most.map((d) => p.reach[d])), fastestLeast = Math.max(...least.map((d) => p.reach[d]));
    assert.ok(slowestMost > fastestLeast, `${geo.width} x ${geo.height}: the slowest of the 16 most pushed (${slowestMost.toFixed(1)}) against the fastest of the 16 least (${fastestLeast.toFixed(1)})`);
    assert.ok(mean(most) > mean(least) * 1.15, `${geo.width} x ${geo.height}: ${mean(most).toFixed(1)} against ${mean(least).toFixed(1)}`);
    // the reach's order is the field's (a rank correlation over the 64)
    const rank = (v) => { const r = new Array(64); [...v.keys()].sort((a, b) => v[a] - v[b]).forEach((d, i) => { r[d] = i; }); return r; };
    const ra = rank(out), rb = rank([...p.reach]), rho = 1 - (6 * ra.reduce((s, x, d) => s + (x - rb[d]) ** 2, 0)) / (64 * (64 * 64 - 1));
    assert.ok(rho > 0.9, `${geo.width} x ${geo.height}: rank correlation ${rho.toFixed(3)}`);
    // the least pushed have the base and little more
    const base = geo.radius * EDGE + reachFor(geo, GOLDEN).base * (46.6 - at);
    assert.ok(Math.abs(mean(least) - base) < geo.radius * 0.35, `${mean(least)} against the base's ${base}`);
  }
});

test('the liquor: none before the flash, rising from it, the glass full within its 2 s, the ball\'s section holding what is poured, held to the cut', () => {
  assert.equal(irradiancePlan(at - 0.001, GEO, GOLDEN).level, 0);
  assert.equal(levelAt(-0.001, span), 0);
  assert.equal(levelAt(0, span), 0);
  let before = 0;
  for (let age = 1 / 120; age <= fill; age += 1 / 120) {
    const level = irradiancePlan(at + age, GEO, GOLDEN).level;
    assert.ok(level > before, `${age.toFixed(3)} s: ${level} after ${before}`);
    before = level;
  }
  assert.equal(irradiancePlan(at + fill, GEO, GOLDEN).level, 1);
  // poured at once and slower and slower: three quarters in at half the time, and the level is the ball's section that holds it
  const h = irradiancePlan(at + fill / 2, GEO, GOLDEN).level;
  assert.ok(Math.abs(3 * h * h - 2 * h ** 3 - 0.75) < 1e-9, `${h}`);
  // it holds, full, to the last frame before the centaur's cut, and is gone on it
  for (const t of [48, 49.55, 49.9, frameTime(1499), until - 1e-6]) assert.equal(irradiancePlan(t, GEO, GOLDEN).level, 1, `${t} s`);
  assert.equal(irradiancePlan(until, GEO, GOLDEN).level, 0);
});

test('a cut in and a cut out: alpha 1 from the flash\'s frame to the last before the centaur\'s, 0 outside; ease and fade for a page that wants them', () => {
  for (const t of [at, frameTime(1362), 45.5, 47, 49.55, frameTime(1499), until - 1e-6]) assert.equal(irradiancePlan(t, GEO, GOLDEN).alpha, 1, `${t} s`);
  for (const t of [at - 1e-6, until]) assert.equal(irradiancePlan(t, GEO, GOLDEN).alpha, 0, `${t} s`);
  // with an ease and a fade (the first build's 0.3 and 0.8 s): in from 0, whole between, out to 0, the liquor draining in the fade
  const soft = Object.freeze({...IRRADIANCE, ease: 0.3, fade: 0.8}), a = (age) => irradiancePlan(at + age, GEO, GOLDEN, soft).alpha;
  assert.equal(a(0), 0);
  assert.equal(a(0.3), 1);
  for (const age of [0.5, 1, 2, 3, span - 0.8]) assert.equal(a(age), 1, `${age} s`);
  let was = 1;
  for (let age = span - 0.8; age < span; age += 1 / 240) { const now = a(age); assert.ok(now <= was, `${age}`); was = now; }
  assert.ok(a(span - 1e-6) < 1e-6);
  assert.ok(levelAt(span - 0.4, span, soft) < 1 && levelAt(span - 1e-4, span, soft) < 0.01);
});

test('reduced motion: on and still through the window, the glass full, the film whole round it, a cut in and a cut out', () => {
  for (const t of [at, 46, 49.9, until - 1e-6]) {
    const p = irradiancePlan(t, GEO, GOLDEN, IRRADIANCE, {reduced: true});
    assert.deepEqual([p.on, p.level, p.alpha], [true, 1, 1], `${t}`);
    for (const r of p.reach) assert.ok(r > farOf(GEO));
  }
  assert.equal(irradiancePlan(at - 1e-6, GEO, GOLDEN, IRRADIANCE, {reduced: true}).on, false);
  assert.equal(irradiancePlan(until, GEO, GOLDEN, IRRADIANCE, {reduced: true}).on, false);
});

test('the golden field: frames 1362 (the cut to the burst) to 1500 (the cut to the centaur), on the film\'s own cuts, the charge\'s shape', () => {
  assert.deepEqual([FIELD_GOLDEN.from, FIELD_GOLDEN.to], [1362, 1500]);
  assert.deepEqual(framesOf(GOLDEN), [FIELD_GOLDEN.from, FIELD_GOLDEN.to - 1], 'the field is the window\'s frames, every one');
  // both ends are cuts of the film's (cuts.js FILM_CUTS, read off it): to the white-gold burst and to the gold centaur in flames
  for (const [n, t] of [[1362, 45.445], [1500, 50.05]]) {
    assert.ok(FILM_CUTS.some(([s]) => Math.abs(s - t) < 1e-9), `${t} s is a cut of the film's`);
    assert.equal(Math.ceil(t * FPS - 1e-9), n);
  }
  assert.deepEqual(Object.keys(FIELD_GOLDEN), Object.keys(FIELD));
  for (const k of ['decode', 'cell', 'grid', 'origin']) assert.deepEqual(FIELD_GOLDEN[k], FIELD[k], k);
  const n = FIELD_GOLDEN.to - FIELD_GOLDEN.from;
  assert.equal(BYTES.length, n * FIELD.grid[0] * FIELD.grid[1] * 2);
  assert.equal(FIELD_GOLDEN.red.length, n);
  assert.equal(FIELD_GOLDEN.cuts[0], 1362, 'the flash is a cut: its own frame has no flow');
  assert.ok(FIELD_GOLDEN.cuts.includes(1485), 'the cut to the white rays, 49.550 s');
  assert.ok(FIELD_GOLDEN.cuts.every((c) => c >= FIELD_GOLDEN.from && c < FIELD_GOLDEN.to));
  for (const c of FIELD_GOLDEN.cuts) for (let i = 0; i < 440; i++) assert.equal(BYTES[(c - FIELD_GOLDEN.from) * 440 + i], 0);
  // the burst's rays move: through its first second at least a tenth of the cells move on most frames that are not held
  const moving = (k) => { let m = 0; for (let i = 0; i < 440; i += 2) if (BYTES[k * 440 + i] || BYTES[k * 440 + i + 1]) m++; return m; };
  const burst = Array.from({length: 30}, (_, i) => moving(1 + i)).filter((m) => m > 0);
  assert.ok(burst.length >= 15 && burst.filter((m) => m >= 22).length >= burst.length * 0.8, JSON.stringify(burst));
});

test('the golden field is the film\'s: measured again off app/saint-seiya.mp4, the same bytes', {skip: (!fs.existsSync(FILM) && 'the film is not in this clone (GitHub strips it)') || (!ffmpeg && 'no ffmpeg here')}, async () => {
  const text = fs.readFileSync(here('./golden-field.js'), 'utf8');
  assert.equal(fieldText(await measureField(FILM, {from: 1362, to: 1500}), FILM, {file: 'golden-field.js'}), text);
  assert.match(text, /^export const FIELD_GOLDEN = Object\.freeze\(\{from: 1362, to: 1500,/m);
});

test('the picture is the theater\'s: theater-light.json\'s crop and size, hero-mount.js\'s fit, laid as theater.js lays it', () => {
  const track = JSON.parse(fs.readFileSync(here('./theater-light.json'), 'utf8'));
  assert.deepEqual([...IRRADIANCE.crop], track.crop);
  assert.deepEqual([...IRRADIANCE.size], track.size);
  assert.match(page, /createTheater\(\{canvas, film: found\.film, [^\n]*clear: true[^\n]*fit: 0\.92/);
  assert.equal(IRRADIANCE.fit, 0.92);
  assert.match(theaterSrc, /hd = Math\.min\(1, aspect \/ FA\) \* fit/);
  for (const [w, h] of [[1205, 900], [1440, 900], [390, 520], [1600, 700]]) {
    const p = pictureOf(w, h), fa = track.crop[2] / track.crop[3], hd = Math.min(1, w / h / fa) * 0.92;
    assert.ok(Math.abs(p.h - hd * h) < 1e-9 && Math.abs(p.w - hd * fa * h) < 1e-9, `${w} x ${h}`);
    assert.ok(Math.abs(p.x + p.w / 2 - w / 2) < 1e-9 && Math.abs(p.y + p.h / 2 - h / 2) < 1e-9, 'centred');
  }
});

test('the glass is the page\'s own dodecahedron, turned and seen from its eye as warm-sphere.js draws it', () => {
  const skin = buildAssemblySkin(0), seen = new Map();
  for (const face of skin.pents) for (const v of face.verts) seen.set(v.join(','), v);
  assert.equal(seen.size, 20);
  for (const v of seen.values()) assert.ok(CORNERS.some((c) => Math.hypot(c[0] - v[0], c[1] - v[1], c[2] - v[2]) < 1e-12));
  // warm-sphere.js rotate() and project()
  const rotate = (p, yaw, pitch) => { const c = Math.cos(yaw), s = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch), x = p[0] * c - p[2] * s, z = p[0] * s + p[2] * c; return [x, p[1] * cp - z * sp, p[1] * sp + z * cp]; };
  const project = (p, [cx, cy], r) => { const k = (r * 4) / (4 - p[2]); return [cx + p[0] * k, cy - p[1] * k]; };
  for (const pose of [{yaw: -0.32, pitch: -0.12}, {yaw: 1.1, pitch: 0.4}, {yaw: -2.5, pitch: -1.2}]) {
    const centre = [662.75, 450], r = 180, glass = glassOutline(pose, centre, r);
    assert.deepEqual(glass.centre, centre);
    const page2 = [...seen.values()].map((v) => project(rotate(v, pose.yaw, pose.pitch), centre, r));
    for (const [x, y] of page2) assert.ok(glass.corners.some(([gx, gy]) => Math.hypot(gx - x, gy - y) < 1e-9));
    // the silhouette: every corner on or inside it, inside the glass's edge circle, round the inradius's
    for (const [x, y] of glass.hull) assert.ok(Math.hypot(x - centre[0], y - centre[1]) <= r * EDGE + 1e-9);
    const inside = ([x, y]) => glass.hull.every(([ax, ay], i) => { const [bx, by] = glass.hull[(i + 1) % glass.hull.length]; return (bx - ax) * (y - ay) - (by - ay) * (x - ax) >= -1e-6; });
    for (const p of glass.corners) assert.ok(inside(p));
    for (let k = 0; k < 16; k++) { const a = (k / 16) * 2 * Math.PI; assert.ok(inside([centre[0] + Math.cos(a) * r * 0.78, centre[1] + Math.sin(a) * r * 0.78])); }
    // the edges of the faces turned to the eye (the page's rule): between 15 and 30 of the thirty
    assert.ok(glass.edges.length >= 15 && glass.edges.length <= 30, `${glass.edges.length}`);
  }
  // the page's rest pose when it gives none
  assert.deepEqual(glassOutline(null, [0, 0], 1).corners, glassOutline({yaw: -0.32, pitch: -0.12}, [0, 0], 1).corners);
});

test('the box\'s glass: its group\'s world matrix (turn and place) seen from the eye as unboxing.js projects it (onStage)', () => {
  // a turn (yaw then a lean toward the eye, as the box's presentation pose) and the box's DROP below the sphere's centre, column-major
  const yaw = 0.7, tilt = 0.3, cy = Math.cos(yaw), sy = Math.sin(yaw), ct = Math.cos(tilt), st = Math.sin(tilt);
  const Ry = [[cy, 0, sy], [0, 1, 0], [-sy, 0, cy]], Rx = [[1, 0, 0], [0, ct, -st], [0, st, ct]];
  const Rm = Rx.map((row) => [0, 1, 2].map((j) => row.reduce((s, v, k) => s + v * Ry[k][j], 0))), T = [0, -0.42, 0];
  const matrix = [Rm[0][0], Rm[1][0], Rm[2][0], 0, Rm[0][1], Rm[1][1], Rm[2][1], 0, Rm[0][2], Rm[1][2], Rm[2][2], 0, T[0], T[1], T[2], 1];
  const eye = [662.75, 450], R = 180, glass = glassOutline({matrix}, eye, R);
  const onStage = (p) => { const k = (R * 4) / (4 - p[2]); return [eye[0] + p[0] * k, eye[1] - p[1] * k]; };   // unboxing.js onStage
  CORNERS.forEach((c, i) => {
    const w = [0, 1, 2].map((j) => Rm[j][0] * c[0] + Rm[j][1] * c[1] + Rm[j][2] * c[2] + T[j]), [x, y] = onStage(w);
    assert.ok(Math.hypot(glass.corners[i][0] - x, glass.corners[i][1] - y) < 1e-9, `corner ${i}`);
  });
  assert.deepEqual(glass.centre, [eye[0], eye[1] + 0.42 * R]);
  // the box's constants are the page's: the eye four radii away, the open box 0.42 radii down; and the hero finds the box's group as the
  // parent of its twelve faces, the meshes whose material has a uMode (hero-mount.js glassOfBox)
  assert.match(unboxingSrc, /^const EYE = 4;/m);
  assert.match(unboxingSrc, /^const DROP = 0\.42;/m);
  assert.match(unboxingSrc, /uMode: \{value: 0\}, uHeld: \{value: null\}\}\}\);/);
  assert.match(unboxingSrc, /const mesh = new THREE\.Mesh\(g, material\);\n {4}mesh\.matrixAutoUpdate = false; mesh\.frustumCulled = false;\n {4}box\.add\(mesh\);/);
  assert.equal(unboxingSrc.match(/uMode: \{value/g).length, 1, 'only the faces carry a uMode');
  assert.match(page, /o\.isMesh && o\.material\?\.uniforms\?\.uMode\) boxGroup = o\.parent;/);
});

test('the plan costs under 0.3 ms a call after the first (memoized per stage)', (t) => {
  for (const geo of STAGES) {
    const fresh = {...geo, width: geo.width + 7};   // a stage not seen yet: its first call integrates the reach
    const t0 = performance.now();
    irradiancePlan(46, fresh, GOLDEN);
    const first = performance.now() - t0, N = 800;
    // the best of five batches: a loaded Mac only adds time (heartbeat.test.mjs, anti-satellites.test.mjs do the same)
    let sum = 0, each = Infinity;
    for (let b = 0; b < 5; b++) {
      const b0 = performance.now();
      for (let i = 0; i < N; i++) sum += irradiancePlan(at + (i / N) * span, fresh, GOLDEN).reach[i % 64];
      each = Math.min(each, (performance.now() - b0) / N);
    }
    assert.ok(sum > 0);
    assert.ok(each < 0.3, `${fresh.width} x ${fresh.height}: ${each.toFixed(4)} ms a call (the first, integrating: ${first.toFixed(2)} ms)`);
    t.diagnostic(`${fresh.width} x ${fresh.height}: first call ${first.toFixed(2)} ms (integrating the reach), then ${(each * 1000).toFixed(2)} µs a call`);
  }
});

// the page's own lines, read off its source: a constant's number, and the mount's call
const constOf = (name) => { const m = new RegExp(`^const ${name} = ([\\d.]+);`, 'm').exec(page); return m ? Number(m[1]) : NaN; };
const mounts = [...page.matchAll(/mountIrradiance\(\{([^\n]*?)\}\)/g)].map((m) => m[1]);

test('THE GOLDEN FLASH ONLY (his Oct 14 2026 22:06, 23:05 and 23:38 WEST): the hero mounts the inversion at 45.445 s and nowhere else; its window never touches the red burst\'s frames (331 to 487) nor anything before 45.4 s; the red burst at 11.044 s is unchanged', () => {
  // one mount, of the golden moment: at BURST_CUT (45.445 s, frame 1362), until CENTAUR (50.050 s, frame 1500), with the golden field
  assert.equal(mounts.length, 1, 'one mount in the page');
  assert.equal(page.split('mountIrradiance(').length - 1, 1, 'and no other call');
  const line = mounts[0], inversion = /^const INVERSION = \{at: (\w+), until: (\w+)\.t, rest: \[([-\d., ]+)\]/m.exec(page);
  assert.ok(inversion, 'INVERSION names its moment');
  assert.match(line, /\bat: INVERSION\.at\b/);
  assert.match(line, /\buntil: INVERSION\.until\b/);
  assert.match(line, /\bfield: FIELD_GOLDEN\b/);
  assert.match(page, /^import \{FIELD_GOLDEN\} from '\.\/golden-field\.js';$/m);
  assert.equal(inversion[1], 'BURST_CUT');
  assert.equal(inversion[2], 'CENTAUR');
  const atS = constOf('BURST_CUT'), untilS = Number(/^const CENTAUR = \{t: ([\d.]+),/m.exec(page)[1]);
  assert.deepEqual([atS, untilS], [45.445, 50.05]);
  const [f0, f1] = framesOf({at: atS, until: untilS});
  assert.deepEqual([f0, f1], [1362, 1499]);
  // never the red burst's frames, nothing before 45.4 s
  assert.ok(f0 > 487 || f1 < 331, `frames ${f0} to ${f1} against the red burst's 331 to 487`);
  assert.ok(atS >= 45.4 && f0 / FPS >= 45.4, `${atS} s`);
  assert.equal(irradiancePlan(45.4, GEO, {at: atS, until: untilS, field: FIELD_GOLDEN}).on, false);
  for (let n = 331; n <= 487; n += 4) assert.equal(irradiancePlan(frameTime(n) + 1e-4, GEO, {at: atS, until: untilS, field: FIELD_GOLDEN}).on, false, `frame ${n}`);
  // the red burst's field is not the hero's, nor the module's
  assert.doesNotMatch(page, /dolbar-field-after|FIELD_AFTER/);
  assert.deepEqual([FIELD_AFTER.from, FIELD_AFTER.to], [331, 487], 'the red burst\'s own measure, untouched');
  // THE RED BURST UNCHANGED: the hero's bursts are the two it had (11.044 s, Dolbar's impact, and 37.10 s), the theater's 5.2 s, the kick reads them
  assert.match(page, /^const BURSTS = \[\{t: 11\.044, power: 1\}, \{t: 37\.10, power: 1\}\];$/m);
  assert.match(theaterSrc, /^const BURST = 5\.2;/m);
  assert.match(page, /createOrbitKick\(\{canvas: found\.sphere, film: found\.film, bursts: BURSTS,/);
  assert.match(page, /const burstAt = \(t\) => \{ const b = BURSTS\.find\(/);
  // the glass: the box's, standing open DROP radii down (unboxing.js), the layer under the box (after the theater's canvas), no edges of its own
  assert.deepEqual(inversion[3].split(',').map(Number), [0, -Number(/^const DROP = ([\d.]+);/m.exec(unboxingSrc)[1])]);
  assert.match(line, /\brest: INVERSION\.rest\b/);
  assert.match(line, /\bafter: canvas\b/);
  assert.match(line, /\bedges: false\b/);
  assert.match(page, /canvas\.id = 'hero-theater'/);
  // the faces stop showing the film from the flash: the empty frames' window begins at the inversion's and runs at least to its end
  assert.match(page, /return his \? \[Math\.min\(his\[0\], INVERSION\.at\), Math\.max\(his\[1\], INVERSION\.until\)\] : \[INVERSION\.at, INVERSION\.until\];/);
});

test('nothing at rest in the source: no frame loop, no interval; the waiting frame callback is let go at the pause and when hidden', () => {
  assert.doesNotMatch(src, /requestAnimationFrame\s*\(/);
  assert.doesNotMatch(src, /setInterval\s*\(/);
  assert.match(src, /const onPause = \(\) => \{ stop\(\); apply\(film\.currentTime\); \};/);
  assert.match(src, /film\.cancelVideoFrameCallback\?\.\(waiting\)/);
  assert.match(src, /if \(doc\.hidden\) stop\(\);/);
});

// a stand-in for the page: a stage with the sphere's canvas in a document, a 2D context that records what it is asked, and a film whose
// frames the test presents
function standIn({hidden = false} = {}) {
  const idle = [], calls = {clear: 0, drawImage: [], fill: 0, stroke: 0, clip: 0, contexts: []};
  const ctx2d = (owner) => {
    const mine = () => owner.id === 'hero-irradiance';
    const g = {owner, canvas: owner, globalCompositeOperation: 'source-over', globalAlpha: 1};
    for (const k of ['setTransform', 'beginPath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'closePath', 'arc', 'rect', 'fillRect', 'save', 'restore']) g[k] = () => {};
    g.clearRect = () => { if (mine()) calls.clear++; };
    g.stroke = () => { if (mine()) calls.stroke++; };
    g.fill = () => { if (mine()) calls.fill++; };
    g.clip = () => { if (mine()) calls.clip++; };
    g.drawImage = (...args) => { if (mine()) calls.drawImage.push(args.slice(1)); };
    g.createRadialGradient = () => ({addColorStop() {}});
    g.createLinearGradient = () => ({addColorStop() {}});
    return g;
  };
  const node = (tag) => ({
    tagName: tag.toUpperCase(), style: {}, attrs: {}, children: [], parent: null, width: 300, height: 150, id: '',
    setAttribute(k, v) { this.attrs[k] = v; },
    append(...xs) { for (const x of xs) { x.parent = this; this.children.push(x); } },
    after(x) { const sib = this.parent.children; x.parent = this.parent; sib.splice(sib.indexOf(this) + 1, 0, x); },
    remove() { const sib = this.parent.children; sib.splice(sib.indexOf(this), 1); this.parent = null; },
    getContext() { calls.contexts.push(this.id || this.tagName); this.ctx ??= ctx2d(this); return this.ctx; },
    getBoundingClientRect: () => ({left: 118, top: 75, width: 1205, height: 900, right: 1323, bottom: 975}),
    querySelector(sel) { return sel === '#genesis-sphere' ? this.children.find((c) => c.id === 'genesis-sphere') ?? null : null; },
  });
  const sphereView = {radius: 0.2, yaw: -0.32, pitch: -0.12};
  const docListeners = {};
  const view = {
    devicePixelRatio: 2, getComputedStyle: () => ({position: 'relative'}), matchMedia: () => ({matches: false}), performance: {now: () => performance.now()},
    requestIdleCallback: (f) => idle.push(f), setTimeout: (f) => idle.push(f), genesisSphere: {getViewState: () => sphereView},
  };
  const doc = {
    defaultView: view, createElement: node, hidden,
    addEventListener(type, f) { (docListeners[type] ??= []).push(f); },
    removeEventListener(type, f) { docListeners[type] = (docListeners[type] ?? []).filter((g) => g !== f); },
    fire(type) { for (const f of docListeners[type] ?? []) f({type}); },
    docListeners,
  };
  const stage = node('div');
  stage.ownerDocument = doc;
  const sphere = node('canvas'); sphere.id = 'genesis-sphere';
  const theater = node('canvas'); theater.id = 'hero-theater';
  const box = node('canvas'); box.id = 'hero-box';
  const front = node('canvas'); front.id = 'hero-front';
  stage.append(sphere, theater, box, front, node('button'));
  const film = filmStandIn({readyState: 4, videoWidth: 960, videoHeight: 540});
  return {stage, film, idle, calls, sphere, theater, doc};
}

test('the clock: a frame callback only while the film plays near the window, one draw a presented frame inside it, none at rest, nothing held outside', () => {
  const {stage, film, idle, calls, sphere, theater, doc} = standIn();
  const irr = mountIrradiance({stage, film, at, until, field: FIELD_GOLDEN, after: theater, edges: false});
  // in right after the theater's canvas, under the box and the page's front, with no z-index of its own, holding no pixels
  assert.deepEqual(stage.children.map((c) => c.id || c.tagName), ['genesis-sphere', 'hero-theater', 'hero-irradiance', 'hero-box', 'hero-front', 'BUTTON']);
  assert.equal(irr.element.style.zIndex, undefined);
  assert.equal(irr.element.style.pointerEvents, 'none');
  assert.equal(irr.element.style.visibility, 'hidden');
  assert.deepEqual(irr.stats.pixels, [0, 0]);
  assert.equal(irr.element.irradiance, irr);
  assert.deepEqual([irr.stats.moment, irr.stats.field], [[45.445, 50.05], [1362, 1500]]);
  // paused at 0 s: nothing waits; the reach is integrated once in idle time, and its pixels let go again
  assert.equal(film.waiting, 0);
  assert.equal(idle.length, 1);
  idle.shift()();
  assert.ok(irr.stats.readyMs >= 0);
  assert.deepEqual(irr.stats.pixels, [0, 0]);
  // playing far from the window, the red burst too: timeupdate answers with a comparison, no frame callback, no draw
  film.paused = false; film.currentTime = 1; film.fire('play');
  for (const t of [4.5, 11.044, 11.2, 16, 37.1, 44]) { film.currentTime = t; film.fire('timeupdate'); }
  assert.equal(film.waiting, 0);
  assert.equal(irr.stats.draws, 0);
  // a second before the flash a timeupdate arms the frames; one draw a presented frame inside the window (frames 1362 to 1499: 138)
  film.currentTime = 44.6; film.fire('timeupdate');
  assert.equal(film.waiting, 1);
  let opacity = null;
  for (let n = Math.round(44.6 * FPS); n < Math.round(47.5 * FPS); n++) { film.currentTime = frameTime(n); film.present(); if (n === 1380) opacity = irr.element.style.opacity; }
  assert.equal(film.waiting, 1);
  assert.equal(irr.stats.draws, Math.round(47.5 * FPS) - 1362);
  assert.equal(irr.element.style.visibility, 'visible');
  assert.equal(opacity, '1.000');
  assert.deepEqual(irr.stats.pixels, [2410, 1800]);   // the stage at the page's 2x
  assert.equal(calls.clear, irr.stats.draws);
  // the film drawn once a frame, from the theater's crop of the film to the theater's picture
  assert.equal(calls.drawImage.length, irr.stats.draws);
  const pic = pictureOf(1205, 900);
  for (const [sx, sy, sw, sh, dx, dy, dw, dh] of calls.drawImage) assert.deepEqual([sx, sy, sw, sh, dx, dy, dw, dh], [82, 4, 796, 532, pic.x, pic.y, pic.w, pic.h]);
  assert.ok(irr.stats.last.level === 1 && irr.stats.last.alpha === 1, JSON.stringify(irr.stats.last));
  assert.equal(irr.stats.last.glass, 'page', 'no glass given: the page\'s own sphere');
  // a timeupdate on a frame already drawn draws nothing
  const drawn = irr.stats.draws;
  film.fire('timeupdate');
  assert.equal(irr.stats.draws, drawn);
  // the panel's C and B fade the page's sphere: it fades with it
  sphere.style.opacity = '0.250';
  film.currentTime = frameTime(Math.round(47.5 * FPS)); film.present();
  assert.equal(irr.element.style.opacity, '0.250');
  sphere.style.opacity = '';
  // the pause lets the waiting callback go; at rest nothing waits and nothing draws
  film.paused = true; film.fire('pause');
  assert.equal(film.waiting, 0);
  const rest = irr.stats.draws;
  film.fire('timeupdate');
  assert.equal(irr.stats.draws, rest);
  // a seek while paused draws that second once and asks nothing; redraw (the box drew on its cause) draws it again
  film.currentTime = 48.5; film.fire('seeked');
  assert.equal(irr.stats.draws, rest + 1);
  assert.equal(film.waiting, 0);
  irr.redraw();
  assert.equal(irr.stats.draws, rest + 2);
  // a hidden page draws nothing and lets the frames go; shown again its next presented frame draws, whatever was said before
  film.paused = false; film.fire('play');
  assert.equal(film.waiting, 1);
  doc.hidden = true; doc.fire('visibilitychange');
  assert.equal(film.waiting, 0);
  film.currentTime = 48.6; film.fire('timeupdate');
  assert.equal(irr.stats.draws, rest + 2);
  doc.hidden = false; doc.fire('visibilitychange');
  assert.equal(film.waiting, 1);
  assert.equal(irr.stats.draws, rest + 2, 'while it plays a timeupdate draws nothing: the presented frames draw');
  film.present();
  assert.equal(irr.stats.draws, rest + 3);
  // a timeupdate past a frame's half (it would round to the next frame) draws nothing while it plays: that frame's own callback draws it
  film.currentTime = frameTime(1460) + 0.7 / FPS; film.fire('timeupdate');
  assert.equal(irr.stats.draws, rest + 3);
  film.currentTime = frameTime(1461); film.present();
  assert.equal(irr.stats.draws, rest + 4);
  assert.ok(Math.abs(irr.stats.last.t - frameTime(1461)) < 1e-9, 'drawn at the frame\'s own mediaTime');
  irr.redraw();
  assert.equal(irr.stats.draws, rest + 4, 'redraw while it plays: the next frame draws it');
  film.currentTime = frameTime(1462); film.present();
  assert.equal(irr.stats.draws, rest + 5);
  // played through the centaur's cut: gone on its frame, its pixels let go, and the frames stop asking
  for (let n = 1463; n < 1500; n++) { film.currentTime = frameTime(n); film.present(); }
  assert.equal(irr.element.style.visibility, 'visible', 'whole to the last frame before the cut');
  assert.equal(irr.stats.last.level, 1);
  film.currentTime = frameTime(1500); film.present();
  assert.equal(irr.element.style.visibility, 'hidden', 'gone on the cut\'s own frame');
  assert.deepEqual(irr.stats.pixels, [0, 0]);
  for (let n = 1501; n < Math.round(50.6 * FPS); n++) { film.currentTime = frameTime(n); film.present(); }
  assert.equal(film.waiting, 0);
  // redraw outside the window draws nothing
  const after = irr.stats.draws;
  irr.redraw();
  assert.equal(irr.stats.draws, after);
  // the page untouched: the only context asked for is its own canvas's
  assert.ok(calls.contexts.every((c) => c === 'hero-irradiance'), JSON.stringify(calls.contexts));
  // destroy takes everything away
  irr.destroy();
  assert.deepEqual(stage.children.map((c) => c.id || c.tagName), ['genesis-sphere', 'hero-theater', 'hero-box', 'hero-front', 'BUTTON']);
  assert.equal(Object.values(film.listeners).flat().length, 0);
  assert.equal(Object.values(doc.docListeners).flat().length, 0);
});

test('the given glass (the box\'s): read at each draw, the light starting where it rests, the page\'s sphere again when it gives none', () => {
  const {stage, film, idle, theater} = standIn();
  let given = null, reads = 0;
  const glass = () => { reads++; return given; };
  const irr = mountIrradiance({stage, film, at, until, field: FIELD_GOLDEN, after: theater, edges: false, glass, rest: [0, -0.42]});
  idle.shift()();   // the reach in idle time, for the glass at its rest
  // the stand-in's stage: 1,205 x 900 at the page's place; the eye's axis 55 % across and halfway down; the radius a fifth of 900
  const eye = [1205 * 0.55, 450], R = 180;
  // the box open: turned, and DROP radii down
  const c = Math.cos(0.5), s = Math.sin(0.5);
  given = {matrix: [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, -0.42, 0, 1]};
  film.currentTime = 46; film.fire('seeked');
  assert.equal(irr.stats.draws, 1);
  assert.equal(irr.stats.last.glass, 'given');
  assert.deepEqual(irr.stats.last.centre, [Math.round(eye[0] * 10) / 10, Math.round((eye[1] + 0.42 * R) * 10) / 10]);
  // the reach starts from where the box stands: the plan as the page asks it is the one at the box's place
  const p = irradiancePlan(46, {centre: [eye[0], eye[1] + 0.42 * R], radius: R, width: 1205, height: 900}, GOLDEN);
  assert.deepEqual([...irr.at(46).reach].map((v) => v.toFixed(3)), [...p.reach].map((v) => v.toFixed(3)));
  assert.ok(reads >= 2);
  // the box away (a held view): the page's sphere at the eye's axis
  given = null;
  irr.redraw();
  assert.equal(irr.stats.last.glass, 'page');
  assert.deepEqual(irr.stats.last.centre, eye.map((v) => Math.round(v * 10) / 10));
  // a provider that throws is no glass
  irr.destroy();
  const thrown = mountIrradiance({stage, film, at, until, field: FIELD_GOLDEN, glass: () => { throw new Error('no box'); }});
  film.currentTime = 46.5; film.fire('seeked');
  assert.equal(thrown.stats.last.glass, 'page');
  thrown.destroy();
});

test('reduced motion: the inversion stands still, whole at the flash\'s first frame, gone on the centaur\'s cut', () => {
  const {stage, film} = standIn();
  const irr = mountIrradiance({stage, film, at, until, field: FIELD_GOLDEN, reduced: true});
  const s = irr.at(46);
  assert.equal(irr.stats.reduced, true);
  assert.deepEqual([s.on, s.level, s.alpha], [true, 1, 1]);
  for (const r of s.reach) assert.ok(r > farOf({...GEO, centre: [1205 * 0.55, 450]}));
  assert.deepEqual(irr.stats.pixels, [0, 0], 'asking the plan sizes nothing');
  film.paused = false; film.currentTime = 44.9; film.fire('play');
  for (let n = Math.round(44.9 * FPS); n < 1370; n++) { film.currentTime = frameTime(n); film.present(); }
  assert.deepEqual([irr.stats.last.level, irr.stats.last.alpha], [1, 1]);
  assert.equal(irr.element.style.opacity, '1.000');
  film.currentTime = 50.3; film.fire('timeupdate');
  assert.equal(irr.element.style.visibility, 'hidden');
  irr.destroy();
});

test('the paint: the film only when it has a frame, the liquor only once it is poured, the gold edges only when asked', () => {
  const record = () => {
    const out = {drawImage: 0, fill: 0, stroke: 0};
    const g = {globalCompositeOperation: 'source-over'};
    for (const k of ['beginPath', 'moveTo', 'lineTo', 'quadraticCurveTo', 'closePath', 'rect', 'fillRect', 'save', 'restore', 'clip']) g[k] = () => {};
    g.drawImage = () => { out.drawImage++; }; g.fill = () => { out.fill++; }; g.stroke = () => { out.stroke++; };
    g.createRadialGradient = g.createLinearGradient = () => ({addColorStop() {}});
    return [g, out];
  };
  const film = {readyState: 4, videoWidth: 960, videoHeight: 540};
  let [g, out] = record();
  paintIrradiance(g, {plan: irradiancePlan(46, GEO, GOLDEN), geometry: GEO, film});
  assert.equal(out.drawImage, 1);
  assert.equal(out.fill, 2, 'the liquor and its depth');
  const withEdges = out.stroke;
  [g, out] = record();
  paintIrradiance(g, {plan: irradiancePlan(46, GEO, GOLDEN), geometry: GEO, film, edges: false});
  assert.equal(out.stroke, withEdges - 1, 'the edges are one stroke, left to the box');
  [g, out] = record();
  paintIrradiance(g, {plan: irradiancePlan(at, GEO, GOLDEN), geometry: GEO, film: {readyState: 1, videoWidth: 0, videoHeight: 0}});
  assert.equal(out.drawImage, 0, 'no frame yet: no film');
  assert.equal(out.fill, 0, 'nothing poured at the flash\'s own instant');
});

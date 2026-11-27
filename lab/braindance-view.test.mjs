// braindance-view.test.mjs: the braindance ready to draw (braindance-view.mjs over braindance.json): what stands at a second, Athena's glb where
// she stands and turned to the fight, a camera on the film's shots, the two spaces, the engine's layer when one lands.
// node --test lab/braindance-view.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {sceneAt, placeAthena, cameraFor, athenaAt, lookQuaternion, rotate, engineAt, pageFrame, qmul, SPACES} from './braindance-view.mjs';
import {at, shotAt} from './braindance.mjs';
import {Object3D, PerspectiveCamera, Vector3} from '../vendor/embertide-app/ui/intro/room/procedural/three.core.js';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const bd = JSON.parse(fs.readFileSync(path.join(HERE, 'braindance.json'), 'utf8'));
const near = (a, b, eps = 1e-9, what = '') => a.forEach((v, i) => assert.ok(Math.abs(v - b[i]) < eps, `${what} [${i}] ${v} vs ${b[i]}`));
const unit = (v) => { const n = Math.hypot(...v); return v.map((x) => x / n); };

test('sceneAt 30.0 s: Athena, Seiya and Dolbar as Gaussians, the over-the-shoulder shot with its camera, nothing of its own', () => {
  const s = sceneAt(bd, 30.0);
  assert.deepEqual(s.items.map((i) => i.name).sort(), ['athena', 'dolbar', 'seiya']);
  for (const i of s.items) { assert.equal(i.mu.length, 3); assert.equal(i.sigma.length, 3); }
  const by = Object.fromEntries(s.items.map((i) => [i.name, i]));
  assert.equal(by.athena.kind, 'athena'); assert.deepEqual(by.athena.mu, at(bd, 'athena', 30).mu); assert.deepEqual(by.athena.look, [0, 0, 0]);
  assert.equal(by.seiya.kind, 'figure'); assert.equal(by.seiya.height, 1.65); assert.equal(by.dolbar.height, 1.9);
  assert.equal(s.shot.name, 'over Athena\'s shoulder, down at the fight');
  assert.deepEqual(s.shot.position, shotAt(bd, 30).mu); assert.equal(s.shot.fov, 40);
  assert.equal(s.space, 'cinematographic');
});

test('sceneAt 37.132 s, his tag: the column stands from the ground to the sky at the width the record lists; the saints as a group; the sky lights', () => {
  const col = sceneAt(bd, 37.132).items.find((i) => i.name === 'light.column');
  assert.equal(col.kind, 'column'); assert.equal(col.width, 6); assert.deepEqual(col.base, [0, 0, 0]); assert.deepEqual(col.top, [0, 60, 0]);
  assert.equal(sceneAt(bd, 55).items.find((i) => i.name === 'saints').kind, 'group');
  assert.deepEqual(sceneAt(bd, 43).items.filter((i) => i.name.startsWith('light.')).map((i) => i.kind), ['star']);
  assert.deepEqual(sceneAt(bd, 59.5).items.filter((i) => i.name.startsWith('light.')).map((i) => i.kind), ['cloth']);
  assert.equal(sceneAt(bd, 81.0).shot, null);
});

test('sceneAt in a page\'s units: every place moved and scaled as toPage, the column too, the shot\'s camera with them', () => {
  const centre = [0.1, -0.2, 0], u = 0.25, a = sceneAt(bd, 37.132, {centre, unit: u}), m = sceneAt(bd, 37.132);
  for (const [i, it] of a.items.entries()) {
    near(it.mu, m.items[i].mu.map((v, k) => centre[k] + v * u), 1e-12, `${it.name} mu`); near(it.sigma, m.items[i].sigma.map((v) => v * u), 1e-12, `${it.name} sigma`);
  }
  const col = a.items.find((i) => i.kind === 'column');
  near(col.base, centre, 1e-12, 'base'); near(col.top, [0.1, -0.2 + 60 * u, 0], 1e-12, 'top'); assert.equal(col.width, 6 * u);
  assert.equal(a.items.find((i) => i.name === 'seiya').height, 1.65 * u);
  near(a.shot.position, m.shot.position.map((v, k) => centre[k] + v * u), 1e-12, 'shot'); near(a.shot.quaternion, m.shot.quaternion, 1e-12, 'turn');
});

test('the two spaces: her track over the shoulder, the pinnacle beside it; the fight and the shots are the same in both', () => {
  assert.deepEqual(SPACES, ['cinematographic', 'establishing']);
  assert.deepEqual(athenaAt(bd, 43, 'cinematographic').mu, [3, 11, 14]);
  assert.deepEqual(athenaAt(bd, 43, 'establishing').mu, [40, 90, 150]);
  assert.deepEqual(athenaAt(bd, 43, 'establishing').sigma, [30, 40, 80]);
  assert.deepEqual(athenaAt(bd, 43, 'establishing').look, [0, 0, 0], 'the establishing place has no look of its own: the track\'s, the fight');
  assert.equal(athenaAt(bd, 20, 'establishing'), null, 'held over her track\'s seconds only');
  const a = sceneAt(bd, 43, {space: 'establishing'}), b = sceneAt(bd, 43);
  assert.deepEqual(a.shot, b.shot);
  assert.deepEqual(a.items.filter((i) => i.name !== 'athena'), b.items.filter((i) => i.name !== 'athena'));
  assert.throws(() => sceneAt(bd, 30, {space: 'dream'}), /no space "dream"/);
});

test('placeAthena: her glb with the top of her head at mu, upright, its front (+z) turned to the fight; the gaze below her horizon is the stance\'s to meet', () => {
  const p = placeAthena(bd, 30.0);
  assert.deepEqual(p.position, [3, 11 - 1.6, 14]); assert.equal(p.scale, 1); assert.equal(p.anchor, 'head');
  assert.ok(shotAt(bd, 30).mu[1] > p.position[1] + 1.6, 'the over-the-shoulder camera above her head, as the record says');
  const front = rotate(p.quaternion, [0, 0, 1]);
  near(front, unit([0 - 3, 0, 0 - 14]), 1e-12, 'front');
  near(rotate(p.quaternion, [0, 1, 0]), [0, 1, 0], 1e-12, 'up');
  assert.ok(Math.abs(p.gaze.pitch - Math.atan2(11, Math.hypot(3, 14)) * 180 / Math.PI) < 1e-9);
  assert.ok(p.gaze.pitch > 24, `the fight ${p.gaze.pitch.toFixed(1)} degrees below her horizon, her head down 24 by the stance`);
  assert.equal(placeAthena(bd, 20.0), null, 'before her track (24 s) she is nowhere');
  assert.deepEqual(placeAthena(bd, 30.0, {anchor: 'centre'}).position, [3, 11 - 0.8, 14]);
  assert.deepEqual(placeAthena(bd, 30.0, {anchor: 'feet'}).position, [3, 11, 14]);
  assert.throws(() => placeAthena(bd, 30.0, {anchor: 'knee'}), /no anchor/);
});

test('placeAthena in a page\'s units: the fight at the page\'s centre, a metre as the page says, her scale from the glb\'s own height', () => {
  const r = 0.3, u = 2 * r / 1.65, centre = [0.1, -0.2, 0];
  const p = placeAthena(bd, 30.0, {centre, unit: u});
  near(p.position, [0.1 + 3 * u, -0.2 + (11 - 1.6) * u, 14 * u], 1e-12, 'position');
  near(p.look, centre, 1e-12, 'look'); near(p.sigma, [3 * u, 4 * u, 5 * u], 1e-12, 'sigma');
  assert.ok(Math.abs(p.scale - u) < 1e-12);
  assert.ok(Math.abs(placeAthena(bd, 30.0, {assetHeight: 3.2}).scale - 0.5) < 1e-12, 'a glb twice her height drawn at half');
  near(placeAthena(bd, 30.0, {centre, unit: u}).quaternion, placeAthena(bd, 30.0).quaternion, 1e-12, 'a uniform scale turns nothing');
  const e = placeAthena(bd, 43.0, {space: 'establishing'});
  assert.deepEqual(e.position, [40, 90 - 1.6, 150]); near(rotate(e.quaternion, [0, 0, 1]), unit([-40, 0, -150]), 1e-12, 'front');
});

test('cameraFor: the camera at the shot\'s mu looks at its look with no roll, the same turn as three.js\'s own lookAt, for every shot', () => {
  for (const shot of bd.camera) {
    const c = cameraFor(shot);
    assert.deepEqual(c.position, shot.mu); assert.equal(c.fov, shot.fov);
    near(rotate(c.quaternion, [0, 0, -1]), unit(shot.look.map((v, i) => v - shot.mu[i])), 1e-12, shot.name);
    assert.ok(Math.abs(rotate(c.quaternion, [1, 0, 0])[1]) < 1e-12, `${shot.name}: level`);
    const cam = new PerspectiveCamera(shot.fov, 16 / 9, 0.1, 1000);
    cam.position.fromArray(shot.mu); cam.lookAt(new Vector3().fromArray(shot.look));
    near(c.quaternion.map(Math.abs), cam.quaternion.toArray().map(Math.abs), 1e-9, `${shot.name} vs three`);
    const sign = Math.sign(c.quaternion[3]) === Math.sign(cam.quaternion.w) ? 1 : -1;
    near(c.quaternion, cam.quaternion.toArray().map((v) => v * sign), 1e-9, `${shot.name} vs three, signed`);
  }
  const u = 0.5, p = cameraFor(shotAt(bd, 30), {centre: [1, 2, 3], unit: u});
  near(p.position, [1 + 4.2 * u, 2 + 12.2 * u, 3 + 15.6 * u], 1e-12, 'page units');
  near(p.quaternion, cameraFor(shotAt(bd, 30)).quaternion, 1e-12, 'a uniform scale turns nothing');
});

test('lookQuaternion straight down keeps a turn (three.js\'s nudge), and an object\'s lookAt agrees where three turns objects the other way', () => {
  const q = lookQuaternion([0, 10, 0], [0, 0, 0]);
  near(rotate(q, [0, 0, -1]), [0, -1, 0], 1e-3, 'down');
  assert.throws(() => lookQuaternion([1, 1, 1], [1, 1, 1]), /own place/);
  const o = new Object3D(); o.position.set(3, 11, 14); o.lookAt(0, 0, 0);   // an object (not a camera) turns its +z to the target
  const front = new Vector3(0, 0, 1).applyQuaternion(o.quaternion).toArray();
  near(front, unit([-3, -11, -14]), 1e-9, 'three object front');
});

test('the hero\'s frame (view): the shot\'s camera at the page\'s eye [0, 0, 4] looking down -z, its look at the origin, a metre eye / |camera - look|', () => {
  const s30 = shotAt(bd, 30), D = Math.hypot(...s30.mu.map((v, i) => v - s30.look[i])), f = pageFrame(bd, 30, {view: {eye: 4}});
  near(f.point(s30.mu), [0, 0, 4], 1e-12, 'camera'); near(f.point(s30.look), [0, 0, 0], 1e-12, 'look');
  assert.ok(Math.abs(f.unit - 4 / D) < 1e-15); assert.ok(Math.abs(f.unit - 0.2) < 1e-3, 'about 0.2 page units a metre at the record\'s 20 m');
  // the frame athena-shot.mjs builds (frameOf, toView): right = forward x up, up = right x forward, back toward the camera
  const cr = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], dt = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  const back = unit(s30.mu.map((v, i) => v - s30.look[i])), fwd = back.map((v) => -v), right = unit(cr(fwd, [0, 1, 0])), up = cr(right, fwd);
  for (const p of [[3, 11, 14], [0, 0, 0], [-2.5, 0, 0.5], [40, 90, 150]]) {
    const d = p.map((v, i) => v - s30.look[i]);
    near(f.point(p), [dt(d, right), dt(d, up), dt(d, back)].map((v) => v * 4 / D), 1e-12, `point ${p}`);
  }
  near(f.up, [right[1], up[1], back[1]], 1e-12, 'the arena\'s up in the page');
  assert.deepEqual(f.view, {shot: s30.name, eye: 4}); assert.deepEqual(pageFrame(bd, 30, {view: true}).view, {shot: s30.name, eye: 4});
  assert.equal(pageFrame(bd, 81.5, {view: true}), null, 'no shot holds 81.5 s');
  near(pageFrame(bd, 30, {centre: [1, 2, 3], unit: 2}).point([1, 1, 1]), [3, 4, 5], 1e-12, 'toPage\'s way kept');
  near(qmul([0, Math.SQRT1_2, 0, Math.SQRT1_2], [Math.SQRT1_2, 0, 0, Math.SQRT1_2]), [0.5, 0.5, -0.5, 0.5], 1e-12, 'qmul: b first, then a');
});

test('placeAthena, cameraFor and sceneAt in the hero\'s frame: her glb, the shot\'s own camera at the eye, every place turned with it', () => {
  const v = {view: {eye: 4}}, f = pageFrame(bd, 30, v), arena = placeAthena(bd, 30), p = placeAthena(bd, 30, v);
  near(p.position, f.point(arena.position), 1e-12, 'feet'); near(p.mu, f.point(arena.mu), 1e-12, 'mu'); near(p.look, f.point([0, 0, 0]), 1e-12, 'look');
  near(rotate(p.quaternion, [0, 0, 1]), rotate(f.turn, rotate(arena.quaternion, [0, 0, 1])), 1e-12, 'her front');
  near(rotate(p.quaternion, [0, 1, 0]), f.up, 1e-12, 'her up is the arena\'s up');
  assert.ok(Math.abs(p.scale - f.unit) < 1e-15); near(p.sigma, [3, 4, 5].map((x) => x * f.unit), 1e-12, 'sigma'); assert.deepEqual(p.axes, f.turn);
  assert.ok(p.mu[2] > 3 && p.mu[2] < 4, 'her mean between the page\'s centre and its eye: the hero seat\'s finding, right in front of the dodecahedron');
  assert.deepEqual(p.view, {shot: shotAt(bd, 30).name, eye: 4});
  const own = cameraFor(shotAt(bd, 30), v);
  near(own.position, [0, 0, 4], 1e-12, 'eye'); near(rotate(own.quaternion, [0, 0, -1]), [0, 0, -1], 1e-12, 'down -z'); near(rotate(own.quaternion, [1, 0, 0]), [1, 0, 0], 1e-12, 'no roll');
  const s30 = shotAt(bd, 30), s34 = shotAt(bd, 34), face = cameraFor(s34, {view: {eye: 4, shot: s30}}), f30 = pageFrame(null, null, {view: {eye: 4, shot: s30}});
  near(face.position, f30.point(s34.mu), 1e-12, 'another shot in this frame');
  near(rotate(face.quaternion, [0, 0, -1]), unit(f30.point(s34.look).map((x, i) => x - face.position[i])), 1e-12, 'it still looks at its look');
  const s = sceneAt(bd, 37.132, {view: true}), m = sceneAt(bd, 37.132), fc = pageFrame(bd, 37.132, {view: true});
  for (const [i, it] of s.items.entries()) near(it.mu, fc.point(m.items[i].mu), 1e-12, it.name);
  const col = s.items.find((i) => i.kind === 'column');
  near(col.base, fc.point([0, 0, 0]), 1e-12, 'base'); near(col.top, fc.point([0, 60, 0]), 1e-12, 'top'); assert.ok(Math.abs(col.width - 6 * fc.unit) < 1e-12);
  near(s.shot.position, [0, 0, 4], 1e-12, 'the shot at t is the frame\'s'); near(s.up, fc.up, 1e-15, 'up'); assert.equal(s.unit, fc.unit);
  assert.equal(sceneAt(bd, 81.5, {view: true}), null); assert.equal(placeAthena(bd, 20, v), null);
});

test('engineAt reads the engine\'s layer when one lands: joints as 4 x 4 by figure, the eye, the sample nearest the second', () => {
  const m = (x, y, z) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
  const engine = {samples: [
    {t: 10.835, figures: {seiya: {joints: {h_jnt_head: m(0, 1.6, 0), h_jnt_waist: m(0, 1, 0)}}}, camera: {eye: [3, 1.2, -8], fovy: 40}},
    {t: 37.132, seiya: {h_jnt_head: m(0, 1.8, 0)}},
  ]};
  const a = engineAt(engine, 11);
  assert.equal(a.t, 10.835); assert.deepEqual(a.eyes, [[3, 1.2, -8]]);
  assert.deepEqual(a.points, [{figure: 'seiya', joint: 'h_jnt_head', p: [0, 1.6, 0]}, {figure: 'seiya', joint: 'h_jnt_waist', p: [0, 1, 0]}]);
  assert.deepEqual(engineAt(engine, 36).points, [{figure: 'seiya', joint: 'h_jnt_head', p: [0, 1.8, 0]}]);
  assert.deepEqual(engineAt({samples: {'61.767': {seiya: {head: m(1, 2, 3)}}}}, 60).points, [{figure: 'seiya', joint: 'head', p: [1, 2, 3]}]);
  assert.equal(engineAt({}, 10), null); assert.equal(engineAt(null, 10), null);
});

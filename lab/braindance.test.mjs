// braindance.test.mjs: the record of the event holds together, and the readers answer by the film's second (braindance.json, braindance.mjs).
// node --test lab/braindance.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {at, shotAt, placesAt, columnWidthAt, toPage, span, check, placeOf, eyeOf} from './braindance.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const bd = JSON.parse(fs.readFileSync(path.join(HERE, 'braindance.json'), 'utf8'));

test('the record is whole: shots back to back from the first second to his thanks, every track with a mean, a sigma and its frames', () => {
  assert.deepEqual(check(bd), []);
  assert.deepEqual(span(bd), {from: 0, to: 81});
  assert.equal(bd.film, 'app/saint-seiya.mp4');
  assert.equal(bd.filmVersion, '53561d47');
});

test('his three tags fall where the record says: the sacrifice in the blast, the column opening into a plane, the conversion in the dressing', () => {
  assert.equal(at(bd, 'seiya', 10.835).pose, 'standing in Dolbar\'s red blast, arms spread');
  assert.ok(at(bd, 'light.column', 37.132), 'the column stands at his second tag');
  assert.equal(columnWidthAt(bd, 37.132), 6);
  assert.ok(columnWidthAt(bd, 36.8) > 0.4 && columnWidthAt(bd, 36.8) < 1.5, 'the beam thin before it opens');
  assert.equal(columnWidthAt(bd, 37.9), 40, 'the flood holds the last width');
  // the column from the beam's cut (36.570 s) to the cut to the Cloth on him (38.071 s), the film's measured cuts
  assert.equal(columnWidthAt(bd, 36.0), 0); assert.equal(columnWidthAt(bd, 38.0), 40); assert.equal(columnWidthAt(bd, 38.1), 0);
  assert.equal(at(bd, 'light.column', 36.56), null); assert.ok(at(bd, 'light.column', 36.58));
  assert.match(at(bd, 'seiya', 61.767).pose, /dressing/);
});

test('Athena is above the fight and looks at it, in both spaces; the page\'s own picture at 30.0 s is the over-the-shoulder shot', () => {
  const a = at(bd, 'athena', 30.0);
  assert.ok(a.mu[1] > 8, 'she stands metres above the fight');
  assert.deepEqual(a.look, [0, 0, 0]);
  assert.ok(bd.entities.athena.establishing.mu[1] > a.mu[1], 'the establishing shot puts her higher still');
  assert.equal(shotAt(bd, 30.0).name, 'over Athena\'s shoulder, down at the fight');
  const cam = shotAt(bd, 30.0);
  assert.ok(cam.mu[1] > a.mu[1] && cam.mu[2] > a.mu[2], 'the camera is behind and above her head');
  assert.equal(shotAt(bd, 34.0).name, 'her face, the prow');
  assert.equal(shotAt(bd, 43.0).name, 'the pinnacle');
  assert.equal(shotAt(bd, 81.0), null);
});

test('what stands at a second: the fighters at 30 s, the column too at 37 s, and Dolbar is gone by 77 s', () => {
  assert.deepEqual(Object.keys(placesAt(bd, 30.0)).sort(), ['athena', 'dolbar', 'seiya']);
  assert.deepEqual(Object.keys(placesAt(bd, 37.0)).sort(), ['athena', 'dolbar', 'light.column', 'seiya']);
  assert.deepEqual(Object.keys(placesAt(bd, 77.0)).sort(), ['athena', 'seiya']);
  assert.equal(at(bd, 'ikki', 14.0).pose.startsWith('takes the blast'), true);
  assert.equal(at(bd, 'ikki', 20.0), null);
  assert.equal(at(bd, 'nobody', 20.0), null);
});

test('toPage moves the arena into a page\'s units: the fight at the sphere, a metre as the sphere says', () => {
  const r = 0.3, unit = 2 * r / 1.65;   // a sphere of radius 0.3 standing for a fighter of 1.65 m
  const p = toPage(at(bd, 'athena', 30.0), {centre: [0.1, -0.2, 0], unit});
  assert.ok(Math.abs(p.mu[1] - (-0.2 + 11 * unit)) < 1e-12);
  assert.ok(Math.abs(p.sigma[1] - 4 * unit) < 1e-12);
  assert.deepEqual(p.look, [0.1, -0.2, 0]);
  assert.equal(toPage({mu: [1, 2, 3], sigma: [1, 1, 1]}).look, undefined);
});

test('check names what is wrong: a gap between shots, a track without a sigma', () => {
  const bad = JSON.parse(JSON.stringify(bd));
  bad.camera[1].t[0] += 0.5;
  delete bad.entities.seiya.tracks[0].sigma;
  const problems = check(bad);
  assert.ok(problems.some((p) => /gap or an overlap/.test(p)), problems.join('; '));
  assert.ok(problems.some((p) => /seiya track 0: mu and sigma/.test(p)), problems.join('; '));
});

test('the record says what it is: a reading of the frames, not a measurement; the engine half is not staged and the block names what is missing (Oct 14 2026, 15:2x WEST)', () => {
  assert.match(bd.frame.law, /a drawn film has no one lens/);
  assert.equal(bd.engine.status, 'not staged');
  assert.equal(bd.engine.missing.length, 4);
  assert.match(bd.engine.missing[0], /pcsx2-qt\.exe has no process/);
  assert.match(bd.engine.missing[1], /character 15/);
  assert.match(bd.engine.missing[2], /ME00\.MPL/);
  assert.match(bd.engine.missing[3], /Dolbar/);
  assert.match(bd.engine.road.pine, /28011/);
  assert.match(bd.engine.hero, /braindance\.engine\.json/);
  assert.deepEqual(check(bd), [], 'the block changes nothing the readers see');
  assert.equal(shotAt(bd, 30.0).name, 'over Athena\'s shoulder, down at the fight');
});

test('the measured record (Oct 14 2026, 15:4x to 17:xx WEST): Athena\'s track and the over-the-shoulder shot carry a measurement off the film\'s own rays, the read mu and sigma beside it', () => {
  const a = at(bd, 'athena', 30.0), m = a.measured;
  assert.deepEqual(a.mu, [3, 11, 14], 'the read mu stays');
  assert.deepEqual(a.sigma, [3, 4, 5], 'the read sigma stays');
  assert.ok(m && m.mu.length === 3 && m.sigma.length === 3 && m.cov.length === 3 && m.cov.every((row) => row.length === 3), 'mu, sigma and a 3 x 3 cov');
  assert.ok(m.frames >= 100, `measured over ${m.frames} frames (the tracker carried the marks)`);
  assert.ok(m.residual_px > 0 && m.residual_px < 0.02 * 540, `residual ${m.residual_px} px under 2 % of the frame`);
  assert.ok(m.mu[1] > 3 && m.mu[1] < 9, `she stands metres above the fight, measured: ${m.mu}`);
  assert.ok(m.mu[2] > 4 && m.mu[2] < 10, `and metres towards the statue: ${m.mu}`);
  assert.ok(m.shots.length >= 2 && m.shots.some((s) => s.shot === 'A') && m.shots.some((s) => s.shot === 'D'), 'two over-the-shoulder shots, each kept');
  for (let i = 0; i < 3; i++) assert.ok(Math.abs(m.sigma[i] - Math.sqrt(m.cov[i][i])) < 1e-3, 'sigma is the root of the cov\'s diagonal');
  const p = placeOf(a);
  assert.equal(p.measured, true); assert.deepEqual(p.mu, m.mu); assert.deepEqual(p.cov, m.cov);
  const shot = shotAt(bd, 30.0), e = eyeOf(shot);
  assert.deepEqual(shot.mu, [4.2, 12.2, 15.6], 'the read eye stays');
  assert.equal(e.measured, true);
  assert.ok(e.mu[1] > 3 && e.mu[1] < 10 && e.fov > 30 && e.fov < 50 && e.sigmaFov > 0, `the camera measured: eye ${e.mu}, fov ${e.fov} +- ${e.sigmaFov}`);
  assert.ok(Array.isArray(e.up) && Math.abs(Math.hypot(...e.up) - 1) < 1e-2, 'the camera\'s up, a unit vector');
  assert.ok(shot.measured.t[0] > 29.5 && shot.measured.t[0] < 29.6, `the film\'s own cut, ${shot.measured.t}, beside the read 28 s`);
  assert.equal(shotAt(bd, 78.0).measured.residual_px > 0.02 * 540, true, 'his thanks: the residual over the limit is said, not hidden');
  assert.deepEqual(check(bd), []);
});

test('a track without a measurement still answers, in the same shape, and check names a broken measured block', () => {
  const s = at(bd, 'seiya', 10.835);
  assert.equal(s.measured, undefined);
  const p = placeOf(s);
  assert.equal(p.measured, false); assert.deepEqual(p.mu, s.mu); assert.deepEqual(p.sigma, s.sigma);
  assert.deepEqual(p.cov, [[1, 0, 0], [0, 0.010000000000000002, 0], [0, 0, 1]]);
  assert.equal(placeOf(null), null);
  const early = shotAt(bd, 5.0), e = eyeOf(early);
  assert.equal(early.measured, undefined, 'the blast is not measured');
  assert.equal(e.measured, false); assert.equal(e.fov, early.fov); assert.deepEqual(e.mu, early.mu); assert.equal(e.up, null);
  const bad = JSON.parse(JSON.stringify(bd));
  bad.entities.athena.tracks[0].measured.cov[0][1] = 99;
  delete bad.camera.find((x) => x.measured).measured.residual_px;
  const problems = check(bad);
  assert.ok(problems.some((x) => /athena track 0: measured cov is not symmetric/.test(x)), problems.join('; '));
  assert.ok(problems.some((x) => /measured without its residual/.test(x)), problems.join('; '));
});

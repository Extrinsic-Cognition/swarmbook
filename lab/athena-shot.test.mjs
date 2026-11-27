// athena-shot.test.mjs: Athena stands on the hero where the record puts her, through the film's own camera (athena-shot.mjs over
// braindance.json). node --test athena-shot.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {frameOf, toView, overShoulder, placeAthena, presenceAt, passAt, columnOnPage} from './athena-shot.mjs';

const bd = JSON.parse(fs.readFileSync(new URL('./braindance.json', import.meta.url), 'utf8'));
// a 1205 x 900 stage with the sphere 55 % across and halfway down, 180 css px a box radius (the proof's 1440 x 900)
const PAGE = {eye: 4, R: 180, stage: {left: -0.55 * 1205, right: 0.45 * 1205, top: -450, bottom: 450}};
const near = (a, b, e = 1e-9) => a.every((v, i) => Math.abs(v - b[i]) < e);

test('the page\'s eye stands where the film\'s camera stands, and the dodecahedron where the camera looks', () => {
  const frame = frameOf(overShoulder(bd, 30).shot);
  assert.ok(near(toView(frame.C, frame), [0, 0, 4], 1e-9));
  assert.ok(near(toView(frame.L, frame), [0, 0, 0], 1e-9));
  assert.ok(Math.abs(frame.D - 20) < 0.05, `the camera is ${frame.D} m from the fight`);
});

test('she is on the page in the film\'s shots over her shoulder only, coming and going on their cuts', () => {
  // the record's shots stand on the film's measured cuts since its own mend (braindance.json, house d0f9215e): over her shoulder 29.563 to
  // 33.567 s, the column and the flood 36.570 to 38.071 s, and 71.138 to 74.975 s
  for (const t of [29.6, 30, 33.5, 36.6, 37.2, 38.0, 71.2, 74.9]) assert.ok(overShoulder(bd, t), `${t} s is over her shoulder`);
  for (const t of [29.5, 33.6, 34, 36.5, 38.1, 50, 71.1, 75.0]) assert.equal(overShoulder(bd, t), null, `${t} s is not`);
  assert.deepEqual(presenceAt(bd, 37.6), {start: 36.57, end: 38.071}, 'the column and the flood are one presence');
  assert.deepEqual(presenceAt(bd, 30), {start: 29.563, end: 33.567});
  assert.deepEqual(presenceAt(bd, 72), {start: 71.138, end: 74.975});
});

test('she stands where the film has her, inside her sigma, and the page says how far she was moved', () => {
  for (const t of [30, 37.0, 72]) {
    const p = placeAthena(bd, t, PAGE);
    assert.ok(p.fits, `a place is found at ${t} s`);
    assert.ok(p.sigmas <= 2, `within two sigmas (${p.sigmas})`);
    assert.ok(p.box.left >= PAGE.R * 1.05, 'right of the dodecahedron');
    assert.ok(p.box.right <= PAGE.stage.right && p.box.top >= PAGE.stage.top && p.box.bottom <= PAGE.stage.bottom, 'inside the stage');
    assert.ok(p.box.head < 0, 'her head above its centre: she looks down at it');
    assert.ok(p.feet[2] < 4, 'in front of the eye');
    const track = bd.entities.athena.tracks[0], look = track.look, base = track.mu.map((v, i) => v + p.swing[i]);
    assert.ok(Math.abs(p.yaw - Math.atan2(look[0] - base[0], look[2] - base[2])) < 1e-12, 'she faces her look, the fight');
  }
  assert.equal(placeAthena(bd, 50, PAGE), null);
});

test('the least swing: no smaller move inside her sigma gives the film\'s place', () => {
  const p = placeAthena(bd, 30, PAGE);
  assert.ok(p.sigmas > 0, 'the record\'s mean alone stands in front of the dodecahedron, so she is moved');
  const at = (k) => placeAthena(bd, 30, {...PAGE, stage: {...PAGE.stage, right: PAGE.stage.right * k}});
  assert.ok(at(1).sigmas <= at(0.95).sigmas + 1e-9, 'a narrower stage never asks less of her sigma');
});

test('the record\'s column of light widens as the record says, through the same camera', () => {
  const c0 = columnOnPage(bd, 36.7), c1 = columnOnPage(bd, 37.1), c2 = columnOnPage(bd, 37.6);
  assert.ok(c0.metres < c1.metres && c1.metres < c2.metres);
  assert.ok(Math.abs(c2.metres - 40) < 1e-9, 'the flood: 40 m from the cut to it, 37.204 s');
  assert.ok(Math.abs(c0.width - c0.metres * 4 / 20) < 0.01, 'page width = metres x the page\'s eye over the camera\'s distance');
  assert.equal(columnOnPage(bd, 38.1), null);
});

test('the cut shows its passes for a tenth of a second each, then the picture', () => {
  assert.deepEqual([0, 0.05, 0.1, 0.15, 0.2, 1].map(passAt), [1, 1, 2, 2, 0, 0]);
  assert.equal(passAt(-0.01), 0);
});

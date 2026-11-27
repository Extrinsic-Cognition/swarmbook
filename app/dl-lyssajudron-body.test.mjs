// dl-lyssajudron-body.test.mjs: her body alive (dl-lyssajudron-body.mjs; his Oct 22 2026 16:5x WEST, "are you able to animate it properly as a
// sprite alive glowin oscillating and such"). node --test dl-lyssajudron-body.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {PIX, CORE_R, INK, MOODS, SATELLITES, SPARKS, soccer, createPixels, drawBody, blinkAt} from './dl-lyssajudron-body.mjs';

const rgbAt = (px, x, y) => { const i = (y * px.side + x) * 4, b = px.bytes; return b[i + 3] ? (b[i] << 16) | (b[i + 1] << 8) | b[i + 2] : null; };

test('unit0 is the truncated icosahedron, Goldberg GP(1,1): 60 vertices on the sphere, 12 pentagons and 20 hexagons, three faces at every vertex, 90 seams', () => {
  const {V, faces} = soccer();
  assert.equal(V.length, 60); assert.ok(V.every((v) => Math.abs(Math.hypot(...v) - 1) < 1e-9));
  assert.equal(faces.filter((f) => f.loop.length === 5).length, 12); assert.equal(faces.filter((f) => f.loop.length === 6).length, 20);
  const at = new Array(60).fill(0), seams = new Set();
  for (const f of faces) f.loop.forEach((i, k) => { at[i]++; const j = f.loop[(k + 1) % f.loop.length]; seams.add(i < j ? `${i}-${j}` : `${j}-${i}`); });
  assert.ok(at.every((n) => n === 3), 'three faces at every vertex'); assert.equal(seams.size, 90);
  for (const f of faces) {   // each loop turns one way round its centre, seen from outside (V - E + F = 2 holds above)
    const [a, b, c] = f.loop.slice(0, 3).map((i) => V[i]), u = a.map((x, k) => b[k] - x), w = b.map((x, k) => c[k] - x);
    const n = [u[1] * w[2] - u[2] * w[1], u[2] * w[0] - u[0] * w[2], u[0] * w[1] - u[1] * w[0]];
    assert.ok(n[0] * f.c[0] + n[1] * f.c[1] + n[2] * f.c[2] > 0, 'counter-clockwise from outside');
  }
});

test('her frame: her eye red at its middle with its black pupil, her silver seams and navy satellites, crimson fins, sparks; the lid when unimpressed', () => {
  const px = createPixels(), cx = PIX / 2, ey = Math.round(PIX * 0.46 + CORE_R * 0.08);
  drawBody(px, 0, MOODS.awake);
  const seen = new Set(); for (let y = 0; y < PIX; y++) for (let x = 0; x < PIX; x++) { const c = rgbAt(px, x, y); if (c != null) seen.add(c); }
  for (const k of ['seam', 'navy', 'fin', 'iris', 'pupil', 'outline', 'glint']) assert.ok(seen.has(INK[k]), `${k} drawn`);
  assert.ok(INK.sparks.some((c) => seen.has(c)), 'sparks');
  assert.equal(rgbAt(px, Math.round(cx), ey), INK.pupil, 'the pupil at her middle');
  assert.ok([INK.iris, INK.irisDeep].includes(rgbAt(px, Math.round(cx + CORE_R * 0.36 * 0.55), ey)), 'the red ring round it');
  drawBody(px, 0, MOODS.unimpressed);
  assert.equal(rgbAt(px, Math.round(cx), Math.round(ey - CORE_R * 0.36 * 0.5)), INK.lid, 'half-lidded: the lid over the top of her eye');
  assert.equal(rgbAt(px, Math.round(cx), ey + 2), INK.pupil, 'her pupil still seen under it');
  // out of her box: at rise 0 nothing of her is above the drawing's floor but the sparks
  drawBody(px, 0, MOODS.awake, {rise: 0});
  let body = 0; for (let i = 0; i < px.body.length; i++) if (px.body[i] === 1) body++;
  assert.ok(body < 200, `inside her box: ${body} body pixels in the frame`);
});

test('she lives: her frames differ moment to moment (the turn, the orbits, the glow), she blinks, the charge swells her and flings her satellites; cheap', () => {
  const px = createPixels(), frames = [0, 0.4, 0.8].map((t) => { drawBody(px, t, MOODS.awake); return px.bytes.slice(); });
  const diff = (a, b) => { let n = 0; for (let i = 0; i < a.length; i += 4) if (a[i] !== b[i] || a[i + 3] !== b[i + 3]) n++; return n; };
  assert.ok(diff(frames[0], frames[1]) > 300 && diff(frames[1], frames[2]) > 300, 'alive');
  assert.equal(blinkAt(0.5), 0); assert.equal(blinkAt(3.2), 1); assert.ok(blinkAt(3.25) > 0 && blinkAt(3.25) < 1);
  const span = (mood) => { drawBody(px, 1.3, mood); let lo = PIX, hi = 0; for (let y = 0; y < PIX; y++) for (let x = 0; x < PIX; x++) if (px.body[y * PIX + x] === 1) { lo = Math.min(lo, x); hi = Math.max(hi, x); } return hi - lo; };
  assert.ok(span(MOODS.charge) > span(MOODS.awake), 'the charge spreads her');
  assert.ok(MOODS.charge.swell > 1 && MOODS.charge.glow > MOODS.awake.glow && MOODS.unimpressed.lid > 0.3);
  assert.equal(SATELLITES.length, 6); assert.ok(SATELLITES.every((s) => Math.abs(Math.sin(s.tilt)) * s.r * CORE_R > CORE_R * 0.36 + s.size * CORE_R), 'a satellite passing in front goes clear of her eye');
  assert.ok(SPARKS.length >= 30);
  const t0 = performance.now(); for (let i = 0; i < 90; i++) drawBody(px, i / 30, MOODS.charge); const ms = (performance.now() - t0) / 90;
  assert.ok(ms < 6, `${ms.toFixed(2)} ms a frame`);
});

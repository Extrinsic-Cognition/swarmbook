import test from 'node:test';
import assert from 'node:assert/strict';
import {cosmosBodyAt, cosmosPanels, cosmosReach, cosmosScales} from './warm-cosmos.mjs';
import {packSkin, FRAME} from './warm-sphere.js';
import {buildAssemblySkin} from './assembly-geometry.js';

test('the body compresses at the quote, opens by the flash and retains its transformed state', () => {
  for (const t of [null, undefined, NaN, Infinity, 0, 78, 100.25, 148.098, 152.41]) {
    assert.deepEqual(cosmosBodyAt(t), {compression: 0, opening: 0, heat: 0, release: 0, burst: 0});
  }
  assert.ok(cosmosBodyAt(101.3).compression > .8);
  // his Oct 21 "you have the old slow growing ... not now. make it explode": clenched and burning to his call, no slow opening before it
  assert.equal(cosmosBodyAt(103).opening, 0); assert.ok(cosmosBodyAt(104.6).compression > .8);
  assert.equal(cosmosBodyAt(106.5).opening, 1);
  assert.ok(cosmosBodyAt(106).release > .9);
  assert.equal(cosmosBodyAt(105.5).burst, 1, 'the panels flung out on the call (lab/the-colony.mjs)');
  assert.ok(cosmosBodyAt(125).opening > .7, 'the new shell state survives the strike');
  assert.ok(cosmosBodyAt(125).heat > .2);
});

test('every cue is continuous and bounded, with no history after a seek', () => {
  const cues = [100.25, 101.3, 101.6, 102, 102.1, 106.5, 107.8, 108.2, 109, 110, 112, 114, 116, 145.598, 148.098];
  for (const t of cues) {
    const before = cosmosBodyAt(t - .001), after = cosmosBodyAt(t + .001);
    for (const key of Object.keys(before)) {
      assert.ok(Math.abs(before[key] - after[key]) < .004, `${key} at ${t}`);
    }
  }
  for (let t = 0; t < 155; t += .07) for (const n of Object.values(cosmosBodyAt(t))) assert.ok(n >= 0 && n <= 1);
  const opened = cosmosBodyAt(108);
  cosmosBodyAt(70); cosmosBodyAt(150);
  assert.deepEqual(cosmosBodyAt(108), opened);
});

test('separating panels preserves face identity, planarity and the immutable original skin', () => {
  const {packed, n} = packSkin(buildAssemblySkin(0)), original = packed.slice();
  const stride = FRAME.FACE_IN, rest = cosmosPanels(packed, n, stride, cosmosBodyAt(78));
  assert.deepEqual(rest, original);
  const opened = cosmosPanels(packed, n, stride, cosmosBodyAt(108), rest);
  assert.equal(opened, rest, 'reuse the draw buffer');
  assert.deepEqual(packed, original, 'never change another renderer or miniature skin');
  for (let f = 0; f < n; f++) {
    const o = f * stride;
    assert.equal(opened[o], 5);
    assert.deepEqual(opened.slice(o + 1, o + 4), original.slice(o + 1, o + 4));
    assert.ok(Math.hypot(...opened.slice(o + 4, o + 7)) > Math.hypot(...original.slice(o + 4, o + 7)) * 1.4);
    const normal = opened.slice(o + 1, o + 4), centre = opened.slice(o + 4, o + 7);
    for (let v = 0; v < 5; v++) {
      const q = opened.slice(o + 7 + v * 3, o + 10 + v * 3);
      assert.ok(Math.abs(q.reduce((a, x, i) => a + (x - centre[i]) * normal[i], 0)) < 1e-10);
    }
  }
  assert.deepEqual(cosmosPanels(packed, n, stride, cosmosBodyAt(70), opened), original);
});

test('THE FIELD\'s reach: how far the moved panels stand, for the seed and a grown skin, read off cosmosPanels itself', () => {
  const pack = (skin) => {   // the packed layout cosmosPanels takes: [vertex count, normal, centre, vertices...] a face, 25 a face
    const faces = [...skin.pents, ...skin.hexes], out = new Float64Array(faces.length * 25);
    faces.forEach((f, i) => { const o = i * 25; out[o] = f.verts.length; out.set(f.normal, o + 1); out.set(f.center, o + 4); f.verts.forEach((v, k) => out.set(v, o + 7 + k * 3)); });
    return {out, count: faces.length};
  };
  for (const skin of [buildAssemblySkin(0), buildAssemblySkin(110)]) {
    const {out, count} = pack(skin);
    for (const t of [99, 100.9, 104, 106.5, 107.6, 125, 160]) {
      const state = cosmosBodyAt(t), moved = state.heat > 0 ? cosmosPanels(out, count, 25, state) : out;
      let far = 0;
      for (let f = 0; f < count; f++) for (let v = 0; v < moved[f * 25]; v++) far = Math.max(far, Math.hypot(moved[f * 25 + 7 + v * 3], moved[f * 25 + 8 + v * 3], moved[f * 25 + 9 + v * 3]));
      assert.ok(Math.abs(cosmosReach(skin, state) - far) < 1e-3, `${skin.hexes.length} hexagons at ${t}: reach ${cosmosReach(skin, state)} against ${far}`);
    }
  }
  assert.ok(Math.abs(cosmosReach(buildAssemblySkin(0), cosmosBodyAt(70)) - 1) < 1e-9, 'at rest the sphere itself');
  assert.ok(cosmosReach(buildAssemblySkin(0), cosmosBodyAt(107.6)) > 1.2, 'the open shell at the strike reaches well past it');
  assert.deepEqual(cosmosScales({compression: 0, opening: 0, heat: 1, release: 0}), {centre: 1, panel: 1});
});

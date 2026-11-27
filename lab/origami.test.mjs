// origami.test.mjs: THE ORIGAMI (origami.mjs) without a browser: the net, its hinges, the solid it shuts into and the bird it opens into.
import test from 'node:test';
import assert from 'node:assert/strict';
import {SOLID, TREE, WINGS, TUCKED, ORIGAMI, makeOrigami, poseInto, turnAt} from './origami.mjs';
import {buildAssemblySkin} from '../app/assembly-geometry.js';

const seed = buildAssemblySkin(0);
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const corner = (out, f, v) => [out[(f * 5 + v) * 3], out[(f * 5 + v) * 3 + 1], out[(f * 5 + v) * 3 + 2]];
const centreOf = (out, f) => [0, 1, 2].map((k) => [0, 1, 2, 3, 4].reduce((s, v) => s + out[(f * 5 + v) * 3 + k] / 5, 0));
const inFrame = (model, p) => { const F = model.frame, d = p.map((v, k) => v - F.o[k]); return [F.x, F.y, F.z].map((a) => a[0] * d[0] + a[1] * d[1] + a[2] * d[2]); };
const EDGE = dist(seed.pents[0].verts[0], seed.pents[0].verts[1]);

test('the canonical solid: twenty corners, twelve regular pentagons on the unit sphere, the root facing +z with its head up between the wings', () => {
  assert.equal(SOLID.verts.length, 20);
  assert.equal(SOLID.faces.length, 12);
  for (const p of SOLID.verts) assert.ok(Math.abs(Math.hypot(...p) - 1) < 1e-12);
  for (const f of SOLID.faces) {
    assert.equal(f.v.length, 5);
    for (let i = 0; i < 5; i++) assert.ok(Math.abs(dist(SOLID.verts[f.v[i]], SOLID.verts[f.v[(i + 1) % 5]]) - EDGE) < 1e-9, 'regular, the seed\'s own size');
  }
  assert.ok(Math.hypot(SOLID.faces[0].n[0], SOLID.faces[0].n[1], SOLID.faces[0].n[2] - 1) < 1e-12, 'the root faces +z');
  const head = SOLID.verts[SOLID.faces[0].v[0]];
  assert.ok(Math.abs(head[0]) < 1e-12 && head[1] > 0.6, 'the root\'s first corner points straight up');
  assert.ok(SOLID.faces[WINGS[0][0]].v.includes(SOLID.faces[0].v[0]) && SOLID.faces[WINGS[1][0]].v.includes(SOLID.faces[0].v[0]), 'between the wings\' roots');
});

test('THE NET is one tree of hinges over the solid: every face reached once from the root, each across an edge it shares with its parent', () => {
  assert.equal(TREE.length, 12);
  assert.equal(TREE[0], -1);
  const shares = (a, b) => SOLID.faces[a].v.filter((v) => SOLID.faces[b].v.includes(v)).length === 2;
  for (let f = 1; f < 12; f++) assert.ok(shares(f, TREE[f]), `face ${f} hinges on ${TREE[f]}`);
  for (let f = 1; f < 12; f++) { let p = f, steps = 0; while (p !== 0 && steps < 12) { p = TREE[p]; steps++; } assert.equal(p, 0, `face ${f} reaches the root`); }
  const all = [0, ...WINGS.flat(), ...TUCKED, 1, 5, 2];
  assert.deepEqual([...new Set(all)].sort((a, b) => a - b), [...Array(12).keys()], 'each face has one part in the bird');
  for (const wing of WINGS) { assert.equal(TREE[wing[0]], 0); assert.equal(TREE[wing[1]], wing[0]); assert.equal(TREE[wing[2]], wing[1]); }
});

test('laid on the page\'s seed: shut is the seed corner for corner, every face rigid and on its hinge at every pose, the root never moves', () => {
  const out = new Float64Array(180);
  for (let root = 0; root < 12; root++) {
    const m = makeOrigami(seed.pents, root);
    poseInto(out, m, 0, 0.7);
    for (let f = 0; f < 12; f++) for (let v = 0; v < 5; v++) assert.ok(dist(corner(out, f, v), seed.pents[f].verts[v]) < 1e-12, `root ${root}: shut is the seed`);
    for (const s of [-1, -0.7, -0.3, 0.2, 0.5, 0.8, 1]) for (const phase of [null, 0, 2.1, 4.4]) {
      poseInto(out, m, s, phase);
      for (let v = 0; v < 5; v++) assert.ok(dist(corner(out, root, v), seed.pents[root].verts[v]) < 1e-12, 'the root stays');
      for (let f = 0; f < 12; f++) {
        for (let v = 0; v < 5; v++) assert.ok(Math.abs(dist(corner(out, f, v), corner(out, f, (v + 1) % 5)) - EDGE) < 1e-9, `rigid at ${s}`);
        if (f === root) continue;
        // the hinge: the two corners it shares with its parent shut stay on two of its parent's corners
        const p = m.parent[f], shared = [0, 1, 2, 3, 4].filter((v) => seed.pents[p].verts.some((w) => dist(w, seed.pents[f].verts[v]) < 1e-9));
        assert.equal(shared.length, 2);
        for (const v of shared) assert.ok([0, 1, 2, 3, 4].some((w) => dist(corner(out, f, v), corner(out, p, w)) < 1e-9), `face ${f} on its hinge at ${s}`);
      }
    }
  }
});

test('born as one pentagon: at s -1 every face lies flat on the root, and the faces swing out from it without a jump', () => {
  const m = makeOrigami(seed.pents, 4), out = new Float64Array(180), before = new Float64Array(180);
  poseInto(out, m, -1, null);
  for (let i = 0; i < 60; i++) {
    const p = [out[i * 3], out[i * 3 + 1], out[i * 3 + 2]];
    assert.ok(seed.pents[4].verts.some((w) => dist(p, w) < 1e-9), 'every corner on the root\'s');
  }
  let worst = 0;
  for (let s = -1; s < 1; s += 0.005) {
    poseInto(before, m, s, 1.3); poseInto(out, m, s + 0.005, 1.3);
    for (let i = 0; i < 180; i += 3) worst = Math.max(worst, Math.hypot(out[i] - before[i], out[i + 1] - before[i + 1], out[i + 2] - before[i + 2]));
  }
  assert.ok(worst < 0.1, `the largest step of a corner in a 200th of the way: ${worst}`);
  assert.equal(turnAt(m, m.root, 0.4, 1), 0, 'the root has no hinge');
});

test('the bird: two mirrored wings of three pentagons out level from the back, the belly half shut, two faces tucked flat under the right wing', () => {
  const out = new Float64Array(180);
  for (const root of [0, 7, 11]) {
    const m = makeOrigami(seed.pents, root);
    poseInto(out, m, 1, null);
    const [left, right] = m.wings;
    for (let j = 0; j < 3; j++) {
      const a = inFrame(m, centreOf(out, left[j])), b = inFrame(m, centreOf(out, right[j]));
      assert.ok(Math.abs(a[0] + b[0]) < 1e-9 && Math.abs(a[1] - b[1]) < 1e-9 && Math.abs(a[2] - b[2]) < 1e-9, `root ${root}: wing joint ${j} mirrored`);
      assert.ok(a[0] < -0.5 * (j + 1) && Math.abs(a[2]) < 0.4, 'out to the left and near level');
    }
    assert.ok(m.span > 2.5, `half span ${m.span}`);
    for (let f = 0; f < 12; f++) if (m.role[f] === 'tucked') {
      const c = inFrame(m, centreOf(out, f)), p = inFrame(m, centreOf(out, m.parent[f]));
      assert.ok(Math.hypot(c[0] - p[0], c[1] - p[1], c[2] - p[2]) < 1e-9, 'a tucked face lies on its parent');
    }
    for (let f = 0; f < 12; f++) if (m.role[f] === 'belly') assert.ok(inFrame(m, centreOf(out, f))[2] < -0.1, 'the belly hangs under the back');
  }
});

test('the wingbeat: both wingtips rise and fall together, the beat growing in from half way through the opening', () => {
  const m = makeOrigami(seed.pents, 2), out = new Float64Array(180);
  const tips = (s, phase) => { poseInto(out, m, s, phase); return m.wings.map((w) => inFrame(m, centreOf(out, w[2]))); };
  const rest = tips(1, null), up = tips(1, Math.PI / 2 + ORIGAMI.flap.lag), down = tips(1, 3 * Math.PI / 2 + ORIGAMI.flap.lag);
  for (let k = 0; k < 2; k++) { assert.ok(up[k][2] > rest[k][2] + 0.3, 'up'); assert.ok(down[k][2] < rest[k][2] - 0.3, 'down'); }
  assert.ok(Math.abs(up[0][2] - up[1][2]) < 1e-9 && Math.abs(up[0][0] + up[1][0]) < 1e-9, 'together, mirrored');
  const early = tips(ORIGAMI.flapFrom * 0.9, Math.PI / 2 + ORIGAMI.flap.lag), early0 = tips(ORIGAMI.flapFrom * 0.9, null);
  assert.ok(Math.abs(early[0][2] - early0[0][2]) < 1e-9, 'no beat before flapFrom');
});

test('makeOrigami refuses what is not a dodecahedron', () => {
  assert.throws(() => makeOrigami(seed.pents.slice(0, 11), 0));
  assert.throws(() => makeOrigami(seed.pents, 12));
  assert.throws(() => makeOrigami(buildAssemblySkin(20).pents.map((p) => ({...p, normal: [1, 0, 0]})), 0));
});

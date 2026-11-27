// harleyquintiti-mod.test.mjs: Harleyquintiti modded from Saori's own body (harleyquintiti-mod.mjs): the base is the house's athena.hades.glb byte for
// byte, the mod is the same bytes every bake and the same as lab/harleyquintiti.hades.glb, every added part rides one joint, and she stands as set.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import crypto from 'node:crypto';
import * as M from './harleyquintiti-mod.mjs';
import { parseGlb, read, pose, texture } from './hades-picture.mjs';

const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const d = M.disc(), made = M.harleyquintiti(d);

test('the base is lab/athena.hades.glb byte for byte: the mod starts from what the mint shows', () => {
  assert.equal(sha(M.athena(d)), sha(fs.readFileSync(new URL('../lab/athena.hades.glb', import.meta.url))));
});

test('the bake is the same bytes twice and the same as lab/harleyquintiti.hades.glb', () => {
  assert.equal(sha(M.harleyquintiti(d).bytes), made.sha256);
  assert.equal(sha(fs.readFileSync(M.OUT)), made.sha256, 'lab/harleyquintiti.hades.glb is the bake: run node tools/harleyquintiti-mod.mjs');
});

test('her rig is the disc\'s: 85 joints, the stance the sprite\'s, every added vertex on one joint with all its weight', () => {
  const g = parseGlb(made.bytes), J = g.json, P = J.meshes[0].primitives[0];
  assert.equal(J.skins[0].joints.length, 85);
  const jo = read(g, P.attributes.JOINTS_0), we = read(g, P.attributes.WEIGHTS_0), base = 7020 + made.report.hairCopies;
  for (let i = base; i < we.length / 4; i++) { assert.equal(we[4 * i], 1); assert.equal(we[4 * i + 1] + we[4 * i + 2] + we[4 * i + 3], 0); }
  const names = new Set(made.report.parts.map((p) => p.joint));
  assert.deepEqual([...names].sort(), ['h_jnt_head', 'h_jnt_lbody', 'h_jnt_rhand', 'h_jnt_ubody']);   // the brooch rides her upper body
  assert.deepEqual(J.extras.stance, M.HQ_STANCE);
});

test('her map is 1024 x 512 for every face, every UV inside it', () => {
  const g = parseGlb(made.bytes), t = texture(g), uv = read(g, g.json.meshes[0].primitives[0].attributes.TEXCOORD_0);
  assert.deepEqual([t.w, t.h], [M.MAP_W, M.MAP_H]);
  assert.deepEqual(g.json.images.map((im) => im.name), ['harleyquintiti', ...M.FACES.map((k) => `face${k}`)]);
  for (const v of uv) assert.ok(v >= 0 && v <= 1);
});

test('she stands as set: her feet on the floor, the chiton\'s hem at HEM_Y, her head where Saori\'s was', () => {
  const g = parseGlb(made.bytes), p = pose(g, 'rest'), P = g.json.meshes[0].primitives[0], uv = read(g, P.attributes.TEXCOORD_0);
  let low = Infinity, top = -Infinity, hem = Infinity;
  for (let i = 0; i < p.count; i++) {
    const y = p.pos[3 * i + 1]; low = Math.min(low, y); top = Math.max(top, y);
    if (uv[2 * i] * M.MAP_W >= 246 && uv[2 * i] * M.MAP_W < 512 && uv[2 * i + 1] * M.MAP_H >= 256) hem = Math.min(hem, y);   // the disc's gown
  }
  assert.ok(Math.abs(low) < 0.01, `feet at ${low.toFixed(3)} m`);
  assert.ok(Math.abs(hem - M.HEM_Y) < 0.03, `hem at ${hem.toFixed(3)} m`);
  assert.ok(top > 1.55 && top < 1.72, `top at ${top.toFixed(3)} m`);
});

test('her triangles turn the way their normals point: at most 1% against (a doubleSided renderer flips a back face before lighting)', () => {
  const g = parseGlb(made.bytes), p = pose(g, 'rest'), idx = read(g, g.json.meshes[0].primitives[0].indices);
  let against = 0;
  for (let t = 0; t < idx.length; t += 3) {
    const [a, b, c] = [idx[t], idx[t + 1], idx[t + 2]], P = (i) => [p.pos[3 * i], p.pos[3 * i + 1], p.pos[3 * i + 2]], N = (i) => [p.nrm[3 * i], p.nrm[3 * i + 1], p.nrm[3 * i + 2]];
    const e1 = P(b).map((v, k) => v - P(a)[k]), e2 = P(c).map((v, k) => v - P(a)[k]), x = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const n = [0, 1, 2].map((k) => N(a)[k] + N(b)[k] + N(c)[k]);
    if (x[0] * n[0] + x[1] * n[1] + x[2] * n[2] < 0) against++;
  }
  assert.ok(against <= 0.01 * idx.length / 3, `${against} of ${idx.length / 3} triangles against their normals`);
});

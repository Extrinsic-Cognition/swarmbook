// hades-picture.test.mjs: the rasteriser's glTF sampling and skinning, and the chunk check, on a .glb made here from bytes made here.
// node --test tools/hades-picture.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readGmi, build, glb, png, channels} from './hades-glb.mjs';
import {parseGlb, read, slerp, sample, pose, texture, draw, sheet} from './hades-picture.mjs';
import {check} from './hades-chunk-check.mjs';

const near = (a, b, eps = 1e-6) => a.length === b.length && a.every((v, i) => Math.abs(v - b[i]) < eps);

// a two-joint figure (as hades-glb.test.mjs makes it): joint 1 at x = -2, a quad on it spanning the game's x 0..1, y 0..1
function gmiBytes() {
  const nj = 2, A = 4, joff = 0x20, goff = joff + 0x70 * nj, posAt = goff + 0x30, nrmAt = posAt + 16 * A, uvAt = nrmAt + 8 * A, slotAt = uvAt + 8 * A, end = slotAt + 4 * A;
  const d = Buffer.alloc(end);
  d.writeUInt32LE(0x20040319, 0); d.writeUInt16LE(nj, 0x10); d.writeUInt16LE(1, 0x12); d.writeUInt32LE(joff, 0x14); d.writeUInt32LE(goff, 0x18); d.writeUInt16LE(1, 0x1e);
  const joint = (k, name, parent, rows) => { const o = joff + 0x70 * k; rows.forEach((v, i) => d.writeFloatLE(v, o + 4 * i)); d.writeInt16LE(parent, o + 0x40); d.write(name, o + 0x46, 'latin1'); };
  joint(0, 'h_all_root', -1, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  joint(1, 'h_jnt_head', 0, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -2, 0, 0, 1]);
  d.writeUInt16LE(A, goff + 2); [posAt, nrmAt, 0, uvAt, slotAt, 0].forEach((v, i) => d.writeUInt32LE(v, goff + 0x0c + 4 * i));
  d.fill(0xff, goff + 0x24, goff + 0x30); d[goff + 0x24] = 1;
  [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]].forEach((p, v) => {
    p.forEach((x, i) => d.writeFloatLE(x, posAt + 16 * v + 4 * i)); d.writeFloatLE(v >= 2 ? 1 : 0, posAt + 16 * v + 12);
    d.writeInt16LE(4096, nrmAt + 8 * v + 4); d.writeFloatLE(p[0], uvAt + 8 * v); d.writeFloatLE(p[1], uvAt + 8 * v + 4);
    d[slotAt + 4 * v] = 0; d[slotAt + 4 * v + 1] = 0xff;
  });
  return d;
}
const quarter = [0, 0, Math.SQRT1_2, Math.SQRT1_2];   // a quarter turn about z
function figure() {
  const fig = build({body: readGmi(gmiBytes()), hair: null, motion: null, height: 2, measure: 'rest', floor: 'root'});
  const c = {length: 30, nodes: [{name: 'h_all_root', rot: null, pos: null, scl: null}, {name: 'h_jnt_head', rot: {t: [0, 30], v: [[0, 0, 0, 1], quarter]}, pos: null, scl: null}]};   // clip()'s shape
  const bytes = glb(fig, png(2, 2, new Uint8Array(16).fill(200)), {name: 't', animations: [{name: '00.0', channels: channels(fig, c)}], info: {clips: ['00.0']}});
  return {fig, c, g: parseGlb(bytes)};
}

test('slerp and sample: half way along a quarter turn is an eighth; before the first key the first, after the last the last', () => {
  assert.ok(near(slerp([0, 0, 0, 1], quarter, 0.5), [0, 0, Math.sin(Math.PI / 8), Math.cos(Math.PI / 8)]));
  assert.ok(near(slerp([0, 0, 0, 1], quarter.map((x) => -x), 0.5), [0, 0, Math.sin(Math.PI / 8), Math.cos(Math.PI / 8)]), 'the short way round');
  const times = [0, 1], values = [0, 0, 0, 1, ...quarter];
  assert.ok(near(sample(times, values, 4, -1, 'rotation'), [0, 0, 0, 1])); assert.ok(near(sample(times, values, 4, 9, 'rotation'), quarter));
  assert.ok(near(sample([0, 2], [0, 0, 0, 4, 8, 12], 3, 0.5, 'translation'), [1, 2, 3]));
});

test('pose: the rest is the stored nodes, the bind undoes nothing, an animation turns the quad about its joint', () => {
  const {fig, g} = figure();
  const rest = pose(g, 'rest'), bind = pose(g, 'bind');
  assert.equal(rest.count, 4);
  assert.ok(near([...rest.pos], fig.posed.flat(), 1e-5), 'the stored nodes skin the vertices where build() put them');
  assert.ok(near([...bind.pos], fig.positions, 1e-6), 'the bind pose is the POSITION accessor');
  // a quarter turn of joint 1 about the game's z: the game's (1, 0) -> (0, 1); in glTF x and y are mirrored and scaled by 2
  const end = pose(g, {anim: '00.0', at: 1}), start = pose(g, {anim: 0, at: 0});
  assert.ok(near([...start.pos], [...rest.pos], 1e-5));
  const v1 = [...end.pos.subarray(3, 6)];   // the vertex at the game's (1, 0, 0) on joint 1 (at x -2): turned to (-2, 1, 0), in glTF (4, -2, 0)
  assert.ok(near(v1, [4, -2, 0], 1e-5), `${v1}`);
});

test('draw and sheet: the figure paints its texture over the background inside the cell, the floor below', () => {
  const {g} = figure();
  const tex = texture(g);
  assert.deepEqual([tex.w, tex.h, ...tex.rgba.subarray(0, 4)], [2, 2, 200, 200, 200, 200]);
  const cell = draw(g, pose(g, 'rest'), {w: 32, h: 48, yaw: 0, tex});
  let painted = 0;
  for (let p = 0; p < 32 * 48; p++) if (cell[4 * p] !== 236 && cell[4 * p] !== 214) painted++;   // neither the background nor the floor
  assert.ok(painted > 100, `the quad covers the cell's middle (${painted} pixels)`);
  const sh = sheet(g, ['rest', '0@0.5', '00.0@1'], {w: 32, h: 48, yaw: 0});
  assert.deepEqual([sh.w, sh.h], [96, 48]);
});

test('check: the glb\'s keys against a chunk of the same clip, and one changed key is found', () => {
  const {c, g} = figure();
  const chunk = {figures: [{joints: [{name: 'h_all_root'}, {name: 'h_jnt_head'}], anims: {0: {code: 0,
    rot: [null, {t: [0, 30], q: [[0, 0, 0, 1], quarter]}], pos: [null, null]}}}]};
  assert.equal(c.nodes[1].rot.t.length, 2);
  const r = check(g, chunk);
  assert.deepEqual([r.clips, r.keys, r.differ, r.maxQ], [1, 2, 0, 0]);
  chunk.figures[0].anims[0].rot[1].q[1] = [0, 0, 0.7, 0.71];
  assert.equal(check(g, chunk).differ, 1);
  chunk.figures[0].anims[0].code = 10;
  assert.match(check(g, chunk).first[0], /the chunk's code is 10/);
  assert.equal(read(g, g.json.animations[0].samplers[0].input).length, 2);
});

test('check: the face clip on its joints alone, and a face track on another joint is found', () => {
  const fig = build({body: readGmi(gmiBytes()), hair: null, motion: null, height: 2, measure: 'rest', floor: 'root'});
  const turn = {length: 8, nodes: [{name: 'h_all_root', rot: null, pos: null, scl: null}, {name: 'h_jnt_head', rot: {t: [0, 8], v: [[0, 0, 0, 1], quarter]}, pos: null, scl: {t: [0, 8], v: [[1, 1, 1], [0.75, 1, 1]]}}]};
  const made = (only) => parseGlb(glb(fig, png(2, 2, new Uint8Array(16).fill(200)), {name: 't', info: {clips: []},
    animations: [{name: 'face', channels: channels(fig, {...turn, nodes: [{...turn.nodes[0], rot: {t: [0, 8], v: [[0, 0, 0, 1], [0, 0, 0, 1]]}}, turn.nodes[1]]}, {only})}]}));
  const chunk = {figures: [{joints: [{name: 'h_all_root'}, {name: 'h_jnt_head'}], anims: {}, face: {names: ['h_jnt_head'], joints: [1],
    rot: [{t: [0, 8], q: [[0, 0, 0, 1], quarter]}], pos: [null], scl: [{t: [0, 8], v: [[1, 1, 1], [0.75, 1, 1]]}]}}]};
  const r = check(made(['h_jnt_head']), chunk);
  assert.deepEqual([r.faceKeys, r.differ], [4, 0], JSON.stringify(r.first));
  const wide = check(made(null), chunk);
  assert.equal(wide.differ, 1); assert.match(wide.first[0], /a track on h_all_root, not one of the six/);
});

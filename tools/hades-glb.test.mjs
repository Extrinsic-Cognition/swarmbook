// hades-glb.test.mjs: the readers and the maths of hades-glb.mjs, on synthetic bytes; bundled source regeneration has its own command.
// node --test tools/hades-glb.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {lzss, fjf, tim, palette, paint, png, mul, invert, compose, quatOf, qmul, quatOfDegrees, readGmi, firstKeys, worlds, triangles, build, glb} from './hades-glb.mjs';

const near = (a, b, eps = 1e-6) => a.every((v, i) => Math.abs(v - b[i]) < eps);
const HERE = path.dirname(new URL(import.meta.url).pathname);

test('the tool records provenance and the explicitly authorized private handoff without changing the general mirror policy', () => {
  const src = fs.readFileSync(path.join(HERE, 'hades-glb.mjs'), 'utf8');
  for (const line of ['CHARACTER\\E00.GMI', 'index 783  CHARACTER\\TEX\\E00.TPL', '155,023,360', 'SLES-54162', 'tools/house-mirror/strip-families.txt', 'figurehead', 'third-party art', 'private GitHub handoff', 'assets/native-source', 'does not change']) {
    assert.ok(src.includes(line), `the header names ${line}`);
  }
});

test('CMPS: a literal run and a back-reference unpack to the announced size', () => {
  // header: 'CMPS', 1, size 8, 0; then flags 0b00000111 = three literals, then a (lo, hi) pair; the pair copies 5 bytes from ring 0xFEE
  const head = Buffer.alloc(16); head.write('CMPS', 0, 'latin1'); head.writeUInt32LE(1, 4); head.writeUInt32LE(8, 8);
  const body = Buffer.from([0x07, 0x41, 0x42, 0x43, 0xee, 0xf2]);   // position 0xFEE | ((0xf2 & 0xf0) << 4) = 0xFEE, length (0xf2 & 0x0f) + 3 = 5
  assert.equal(lzss(Buffer.concat([head, body])).toString('latin1'), 'ABCABCAB');
  assert.throws(() => lzss(Buffer.concat([head, Buffer.from([0x01, 0x41])])), /CMPS: 1 of 8 bytes/);
});

test('FJF: the entries are the gaps between offsets', () => {
  const d = Buffer.alloc(8 + 8 + 2 + 3 + 5); d.write('FJF\0', 0, 'latin1'); d.writeUInt16LE(2, 4); d.writeUInt16LE(0x4000, 6);
  d.writeUInt32LE(18, 8); d.writeUInt32LE(21, 12); d.write('abc', 18, 'latin1'); d.write('defgh', 21, 'latin1');
  const e = fjf(d);
  assert.deepEqual(e.map((b) => b.toString('latin1')), ['abc', 'defgh']);
  assert.throws(() => fjf(Buffer.from('CMPS0000')), /not an FJF/);
});

test('TIM3: an 8-bit picture with its CSM1 palette paints, and a face goes over the top-left quarter', () => {
  const w = 4, h = 4, head = Buffer.alloc(16); head.write('TIM3', 0, 'latin1'); head[4] = 4; head[5] = 0; head.writeUInt16LE(1, 6);
  const pic = Buffer.alloc(48 + w * h + 1024);
  pic.writeUInt32LE(48 + w * h + 1024, 0); pic.writeUInt32LE(1024, 4); pic.writeUInt32LE(w * h, 8); pic.writeUInt16LE(48, 12); pic.writeUInt16LE(256, 14);
  pic[18] = 3; pic[19] = 5; pic.writeUInt16LE(w, 20); pic.writeUInt16LE(h, 22);
  for (let i = 0; i < w * h; i++) pic[48 + i] = i;   // index i at pixel i
  // the CLUT in CSM1 order: entry j holds colour (j, j, j, 0x80); index 8 reads entry 16, index 16 reads entry 8
  for (let j = 0; j < 256; j++) pic.set([j, j, j, 0x80], 48 + w * h + 4 * j);
  const [t] = tim(Buffer.concat([head, pic]));
  assert.equal(t.w, 4); assert.equal(t.h, 4);
  const pal = palette(t.clut);
  assert.deepEqual([...pal.subarray(0, 4)], [0, 0, 0, 255]);
  assert.deepEqual([...pal.subarray(8 * 4, 8 * 4 + 4)], [16, 16, 16, 255]);
  assert.deepEqual([...pal.subarray(16 * 4, 16 * 4 + 4)], [8, 8, 8, 255]);
  assert.deepEqual([...pal.subarray(9 * 4, 9 * 4 + 4)], [17, 17, 17, 255]);
  const rgba = paint(t, pal);
  assert.deepEqual([...rgba.subarray(4 * 5, 4 * 5 + 4)], [5, 5, 5, 255]);   // pixel 5 = index 5 (not swapped)
  const face = {w: 2, h: 2, indices: Uint8Array.from([100, 101, 102, 103])};
  const over = paint(t, pal, face);
  assert.deepEqual([...over.subarray(4 * 1, 4 * 1 + 4)], [101, 101, 101, 255]);   // (1, 0) from the face
  assert.deepEqual([...over.subarray(4 * 4, 4 * 4 + 4)], [102, 102, 102, 255]);   // (0, 1) from the face
  assert.deepEqual([...over.subarray(4 * 6, 4 * 6 + 4)], [6, 6, 6, 255]);         // (2, 1) untouched
  const bytes = png(w, h, rgba);
  assert.equal(bytes.toString('latin1', 1, 4), 'PNG'); assert.equal(bytes.readUInt32BE(16), w); assert.equal(bytes.readUInt32BE(20), h);
  assert.equal(bytes.toString('latin1', bytes.length - 8, bytes.length - 4), 'IEND');
});

test('quaternions and matrices go round: compose -> quatOf, invert of a scaled rigid motion', () => {
  const q = [0.1, -0.3, 0.2, Math.sqrt(1 - 0.14)];
  const m = compose(q, [1, 2, 3]);
  assert.ok(near(quatOf(m), q, 1e-9));
  const s = [2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1];
  const sm = mul(s, m), back = mul(invert(sm), sm);
  assert.ok(near(back, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], 1e-9));
  assert.ok(near(quatOf([-1, 0, 0, 0, 0, -1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]), [0, 0, 1, 0], 1e-9), 'a half turn about z');
});

// a .gmi made here: two joints (a root and a child 2 along -x in the child's frame), one group of four vertices, one strip of two triangles
function gmiBytes({weighted = false, upright = false} = {}) {
  const nj = 2, ng = 1, joff = 0x20, goff = joff + 0x70 * nj, A = 4;
  const posAt = goff + 0x30, nrmAt = posAt + 16 * A, uvAt = nrmAt + 8 * A, slotAt = uvAt + 8 * A, wgtAt = slotAt + 4 * A, end = wgtAt + (weighted ? 8 * A : 0);
  const d = Buffer.alloc(end);
  d.writeUInt32LE(0x20040319, 0); d.writeUInt32LE(end, 4); d.writeUInt32LE(0x10, 8);
  d.writeUInt16LE(nj, 0x10); d.writeUInt16LE(ng, 0x12); d.writeUInt32LE(joff, 0x14); d.writeUInt32LE(goff, 0x18); d.writeUInt16LE(3, 0x1c); d.writeUInt16LE(1, 0x1e);
  const joint = (k, name, parent, rows) => { const o = joff + 0x70 * k; rows.forEach((v, i) => d.writeFloatLE(v, o + 4 * i)); d.writeInt16LE(parent, o + 0x40); d.write(name, o + 0x46, 'latin1'); };
  joint(0, 'h_all_root', -1, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  joint(1, 'h_jnt_head', 0, [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -2, 0, 0, 1]);   // row vectors: translation in row 3
  const g = goff; d.writeUInt16LE(2, g); d.writeUInt16LE(A, g + 2); d.writeUInt16LE(0, g + 4); d.writeUInt16LE(2, g + 6);
  d.writeUInt32LE(posAt, g + 0x0c); d.writeUInt32LE(nrmAt, g + 0x10); d.writeUInt32LE(uvAt, g + 0x18); d.writeUInt32LE(slotAt, g + 0x1c); d.writeUInt32LE(weighted ? wgtAt : 0, g + 0x20);
  d.fill(0xff, g + 0x24, g + 0x30); d[g + 0x24] = 1; d[g + 0x25] = 0;   // palette: slot 0 -> joint 1, slot 1 -> joint 0
  // a quad in the x-z plane at y = 0 (joint 1's space when rigid), normals +y, flags 0 0 1 1; upright: in the x-y plane, normals +z
  const P = upright ? [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0]] : [[0, 0, 0], [1, 0, 0], [0, 0, 1], [1, 0, 1]];
  P.forEach((p, v) => { p.forEach((x, i) => d.writeFloatLE(x, posAt + 16 * v + 4 * i)); d.writeFloatLE(v >= 2 ? 1 : 0, posAt + 16 * v + 12);
    d.writeInt16LE(0, nrmAt + 8 * v); d.writeInt16LE(upright ? 0 : 4096, nrmAt + 8 * v + 2); d.writeInt16LE(upright ? 4096 : 0, nrmAt + 8 * v + 4);
    d.writeFloatLE(p[0], uvAt + 8 * v); d.writeFloatLE(p[2], uvAt + 8 * v + 4);
    d[slotAt + 4 * v] = 0; d[slotAt + 4 * v + 1] = weighted ? 1 : 0xff; d[slotAt + 4 * v + 2] = 0xdd; d[slotAt + 4 * v + 3] = 0xdd;
    if (weighted) { d.writeFloatLE(0.75, wgtAt + 8 * v); d.writeFloatLE(0.25, wgtAt + 8 * v + 4); } });
  return d;
}

test('readGmi: joints with their parents and rest, groups with their vertices, slots into the palette', () => {
  const m = readGmi(gmiBytes());
  assert.deepEqual(m.joints.map((j) => [j.name, j.parent]), [['h_all_root', -1], ['h_jnt_head', 0]]);
  assert.deepEqual([m.joints[1].local[3], m.joints[1].local[7], m.joints[1].local[11]], [-2, 0, 0], 'the translation is in the last column once turned');
  const [g] = m.groups;
  assert.equal(g.verts.length, 4);
  assert.deepEqual(g.verts[1].joints, [1]); assert.deepEqual(g.verts[1].weights, [1]);
  assert.deepEqual(g.verts.map((v) => v.strip), [false, false, true, true]);
  const w = readGmi(gmiBytes({weighted: true})).groups[0].verts[0];
  assert.deepEqual(w.joints, [1, 0]); assert.deepEqual(w.weights, [0.75, 0.25]);
  assert.throws(() => readGmi(Buffer.alloc(32)), /not a .gmi/);
});

test('firstKeys reads the first rotation and position of every node of a .gai', () => {
  const g = Buffer.alloc(0x14 + 0x30 + 0x20 + 4 + 4 + 32);
  g.writeUInt32LE(0x20030818, 0); g.writeUInt16LE(1, 8); g.writeUInt32LE(0x14, 0x0c);
  const node = 0x14; g.writeUInt32LE(8, node); g.write('h_jnt_head', node + 4, 'latin1');
  const rot = node + 0x30, pos = rot + 0x10, times = pos + 0x10, keys = times + 8;
  g.writeUInt32LE(rot, node + 0x24); g.writeUInt32LE(pos, node + 0x28);
  g.writeUInt32LE(8, rot); g.writeUInt16LE(2, rot + 4); g.writeUInt32LE(times, rot + 8); g.writeUInt32LE(keys, rot + 12);
  g.writeUInt32LE(8, pos); g.writeUInt16LE(1, pos + 4); g.writeUInt32LE(times + 4, pos + 8); g.writeUInt32LE(keys + 16, pos + 12);
  [0, 0, 0, 1].forEach((v, i) => g.writeFloatLE(v, keys + 4 * i)); [5, 6, 7, 1].forEach((v, i) => g.writeFloatLE(v, keys + 16 + 4 * i));
  const k = firstKeys(g);
  assert.deepEqual(k.get('h_jnt_head'), {q: [0, 0, 0, 1], t: [5, 6, 7]});
  assert.throws(() => firstKeys(Buffer.alloc(0x14)), /not a .gai/);
});

test('worlds chains parents; triangles follow the strip flags and face the vertices\' normals', () => {
  const m = readGmi(gmiBytes());
  const w = worlds(m.joints, m.joints.map((j) => j.local));
  assert.deepEqual([w[1][3], w[1][7], w[1][11]], [-2, 0, 0]);
  const verts = m.groups[0].verts.map((v) => ({...v, bind: v.p, normal: v.n}));
  const idx = triangles(verts);
  assert.equal(idx.length, 6);
  // each triangle's face normal agrees with +y
  for (let t = 0; t < 6; t += 3) {
    const [a, b, c] = [verts[idx[t]].bind, verts[idx[t + 1]].bind, verts[idx[t + 2]].bind];
    const e1 = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], e2 = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
    assert.ok(e1[2] * e2[0] - e1[0] * e2[2] > 0, 'counter-clockwise seen from +y');
  }
});

test('build: the figure stands on y = 0 at the asked height, mirrored into glTF, the hair must share the joints, a stance names a joint', () => {
  const body = readGmi(gmiBytes({upright: true}));
  const fig = build({body, hair: null, motion: null, height: 2});
  assert.equal(fig.joints, 2); assert.equal(fig.count, 4); assert.equal(fig.indices.length, 6);
  // the quad is rigid on joint 1: in model space it spans x -2..-1 (joint 1 is at x = -2), y 0..1 (the game's y is down: y = 1 is the hem)
  // the turn: x -> -x, y -> -y, scaled 2 (a span of 1 to the asked 2 m), the hem lifted to y = 0
  const ys = fig.positions.filter((_, i) => i % 3 === 1), xs = fig.positions.filter((_, i) => i % 3 === 0);
  assert.ok(ys.every((y) => Math.abs(y) < 1e-9 || Math.abs(y - 2) < 1e-9), `y is 0 at the hem and 2 at the top, not ${ys}`);
  assert.ok(xs.every((x) => x >= 2 - 1e-9 && x <= 4 + 1e-9), `x is mirrored and scaled, not ${xs}`);
  assert.equal(Math.abs(fig.height - 2) < 1e-9, true); assert.equal(Math.abs(fig.scale - 2) < 1e-9, true);
  assert.equal(fig.nodes[0].name, 'h_all_root'); assert.ok(fig.nodes[0].scale, 'the root carries the scale');
  assert.equal(fig.nodes[1].scale, null);
  const hair = readGmi(gmiBytes({upright: true})); hair.joints[1].name = 'h_jnt_other';
  assert.throws(() => build({body, hair, motion: null}), /not on the body's joints/);
  assert.throws(() => build({body, hair: null, motion: null, stance: {h_jnt_nose: [0, 0, 10]}}), /names h_jnt_nose, not a joint/);
  // a stance turns the joint's children in its own frame: a quarter turn about z of joint 1 moves the quad's x extent into y; "_" is a note
  const turned = build({body, hair: null, motion: null, stance: {_: 'a note, not a joint', h_jnt_head: [0, 0, 90]}, height: 2});
  assert.ok(turned.nodes[1].rotation.every((v, i) => Math.abs(v - [0, 0, Math.SQRT1_2, Math.SQRT1_2][i]) < 1e-9), `the node's rotation is the stance, not ${turned.nodes[1].rotation}`);
});

test('quatOfDegrees and qmul: a turn about x then y, and the product is b then a', () => {
  const qx = quatOfDegrees([90, 0, 0]), qy = quatOfDegrees([0, 90, 0]);
  assert.ok(near(qx, [Math.SQRT1_2, 0, 0, Math.SQRT1_2], 1e-9)); assert.ok(near(qy, [0, Math.SQRT1_2, 0, Math.SQRT1_2], 1e-9));
  const m = compose(qmul(qx, qy), [0, 0, 0]);   // y's turn first, then x's: the point (0, 0, 1) -> (1, 0, 0) by y -> stays (1, 0, 0) by x
  const p = [m[2], m[6], m[10]];
  assert.ok(near(p, [1, 0, 0], 1e-9), `${p}`);
  assert.ok(near(quatOfDegrees([90, 90, 0]), qmul(qx, qy), 1e-9), 'quatOfDegrees is x after y');
});

test('glb: a well-formed binary with the skin, one material, the texture and the extra faces', () => {
  const fig = build({body: readGmi(gmiBytes()), hair: null, motion: null, height: 1.6});
  const pic = png(2, 2, new Uint8Array(16).fill(200)), face = png(2, 2, new Uint8Array(16).fill(100));
  const bytes = glb(fig, pic, {name: 'x', extras: {face2: face}});
  assert.equal(bytes.toString('latin1', 0, 4), 'glTF'); assert.equal(bytes.readUInt32LE(8), bytes.length);
  const jsonLen = bytes.readUInt32LE(12); assert.equal(bytes.toString('latin1', 16, 20), 'JSON');
  const json = JSON.parse(bytes.toString('utf8', 20, 20 + jsonLen));
  assert.equal(json.asset.version, '2.0'); assert.equal(json.skins[0].joints.length, 2); assert.equal(json.images.length, 2);
  assert.equal(json.images[1].name, 'face2'); assert.deepEqual(json.extras.faces, ['face2']);
  assert.equal(json.meshes[0].primitives[0].attributes.JOINTS_0, 3);
  const binLen = bytes.readUInt32LE(20 + jsonLen); assert.equal(bytes.toString('latin1', 24 + jsonLen, 28 + jsonLen), 'BIN\0');
  assert.equal(28 + jsonLen + binLen, bytes.length); assert.equal(json.buffers[0].byteLength <= binLen, true);
  assert.equal(bytes.length % 4, 0);
});

/* ---- the fighters: the clips, the in-place rule, the game's floor, the animations in the .glb ---- */
import {fjfIds, clip, keysAt0, channels} from './hades-glb.mjs';

// a .gai made here: nodes [{name, rot: {t, v}, pos: {t, v}}], laid out as GAI.md draws it (nodes, descriptors, key times padded to 4, keys from 16)
function gaiBytes(nodes) {
  let at = 0x14 + 0x30 * nodes.length;
  const descs = [];
  nodes.forEach((nd, k) => { for (const [slot, key] of [[0, 'rot'], [1, 'pos']]) if (nd[key]) { descs.push({k, slot, track: nd[key], at}); at += 0x10; } });
  for (const d of descs) { d.times = at; at = (at + 2 * d.track.t.length + 3) & ~3; }
  at = (at + 15) & ~15;
  for (const d of descs) { d.keys = at; at += 16 * d.track.t.length; }
  const g = Buffer.alloc(at);
  g.writeUInt32LE(0x20030818, 0); g.writeUInt32LE(at, 4); g.writeUInt16LE(nodes.length, 8); g.writeUInt32LE(0x14, 0x0c);
  nodes.forEach((nd, k) => { const o = 0x14 + 0x30 * k, ts = [nd.rot, nd.pos].filter(Boolean); g.writeUInt32LE(ts.length ? Math.max(...ts.map((t) => t.t.at(-1))) : 0, o); g.write(nd.name, o + 4, 'latin1'); });
  for (const d of descs) {
    g.writeUInt32LE(d.at, 0x14 + 0x30 * d.k + 0x24 + 4 * d.slot);
    g.writeUInt32LE(d.track.t.at(-1), d.at); g.writeUInt16LE(d.track.t.length, d.at + 4); g.writeUInt16LE(0xaaaa, d.at + 6); g.writeUInt32LE(d.times, d.at + 8); g.writeUInt32LE(d.keys, d.at + 12);
    d.track.t.forEach((t, i) => g.writeUInt16LE(t, d.times + 2 * i));
    d.track.v.forEach((v, i) => [...v, ...(v.length === 3 ? [1] : [])].forEach((x, c) => g.writeFloatLE(x, d.keys + 16 * i + 4 * c)));
  }
  return g;
}

test('the tool names the fighters\' road: the reader, the in-place rule and the floor', () => {
  const src = fs.readFileSync(path.join(HERE, 'hades-glb.mjs'), 'utf8');
  for (const line of ['hades-disc-read.mjs', '00 Seiya in the Pegasus Cloth, 15 Seiya in the Sagittarius Cloth, 04 Ikki', 'ELF 0x158B80..0x158C10', 'GAI.md "The rate"']) {
    assert.ok(src.includes(line), `the header names ${line}`);
  }
});

test('fjfIds: the ids follow the offsets, 4 bytes later with flag 0x4000, none with 0x8000', () => {
  const make = (flags) => { const d = Buffer.alloc(32); d.write('FJF\0', 0, 'latin1'); d.writeUInt16LE(2, 4); d.writeUInt16LE(flags, 6); d.writeUInt32LE(24, 8); d.writeUInt32LE(28, 12); return d; };
  const a = make(0x4000); a.writeUInt32LE(32, 16); a.writeUInt16LE(10, 20); a.writeUInt16LE(1270, 22);
  assert.deepEqual(fjfIds(a), [10, 1270]);
  const b = make(0); b.writeUInt16LE(7, 16); b.writeUInt16LE(8, 18);
  assert.deepEqual(fjfIds(b), [7, 8]);
  assert.equal(fjfIds(make(0x8000)), null);
});

test('clip reads every key of every track; keysAt0 zeroes the waist\'s x and z', () => {
  const g = gaiBytes([{name: 'h_all_root'}, {name: 'h_jnt_head', rot: {t: [0, 4, 9], v: [[0, 0, 0, 1], [0, 0, 0.5, Math.sqrt(0.75)], [0, 0, 1, 0]]}, pos: {t: [0, 9], v: [[5, 6, 7], [8, 9, 10]]}}]);
  const c = clip(g);
  assert.equal(c.length, 9); assert.equal(c.nodes.length, 2);
  assert.equal(c.nodes[0].rot, null); assert.equal(c.nodes[0].pos, null); assert.equal(c.nodes[0].length, 0);
  assert.deepEqual(c.nodes[1].rot.t, [0, 4, 9]);
  assert.ok(near(c.nodes[1].rot.v[1], [0, 0, 0.5, Math.sqrt(0.75)], 1e-7));
  assert.deepEqual(c.nodes[1].pos.v, [[5, 6, 7], [8, 9, 10]]);
  assert.deepEqual(keysAt0(c).get('h_jnt_head').t, [5, 6, 7]);
  assert.deepEqual(keysAt0(c, 'h_jnt_head').get('h_jnt_head').t, [0, 6, 0]);
  assert.deepEqual(firstKeys(g).get('h_jnt_head').t, [5, 6, 7], 'firstKeys reads the same first key');
  assert.throws(() => clip(Buffer.alloc(0x14)), /not a .gai/);
});

test('build: a fighter is measured standing straight and stands on the game root\'s floor', () => {
  const body = readGmi(gmiBytes({upright: true}));   // the quad spans the game's y 0..1 on joint 1 (y down: 1 is the hem)
  const motion = new Map([['h_jnt_head', {q: null, t: [-2, -1, 0]}]]);   // the pose lifts joint 1 one unit: the quad spans y -1..0
  const fig = build({body, hair: null, motion, height: 2, measure: 'rest', floor: 'root'});
  assert.ok(Math.abs(fig.scale - 2) < 1e-9 && Math.abs(fig.height - 2) < 1e-9, 'the rest pose is the 2 m');
  assert.ok(Math.abs(fig.floorGap) < 1e-9, `the posed hem is on the floor, not ${fig.floorGap}`);
  assert.ok(Math.abs(fig.posedHeight - 2) < 1e-9);
  assert.deepEqual(fig.nodes[0].translation.map((x) => Math.abs(x)), [0, 0, 0], 'no lift: y = 0 is the root');
  const ys = fig.positions.filter((_, i) => i % 3 === 1);
  assert.ok(ys.every((y) => Math.abs(y) < 1e-9 || Math.abs(y + 2) < 1e-9), `the bind pose hangs below the floor, ${ys}`);
  const hers = build({body, hair: null, motion, height: 2});
  assert.ok(Math.abs(hers.nodes[0].translation[1] - 0) < 1e-9 && Math.abs(hers.floorGap) < 1e-9, 'her road: the posed hem lifted to y = 0');
});

test('channels: keys by index and name, seconds at 30 a second, rotations sign-continuous, the waist in place, a root turned by C', () => {
  const body = readGmi(gmiBytes({upright: true})), fig = build({body, hair: null, motion: null, height: 2, measure: 'rest', floor: 'root'});
  const c = clip(gaiBytes([{name: 'h_all_root', rot: {t: [0, 30], v: [[0, 0, 0, 1], [0, 0, 0, 1]]}, pos: {t: [0, 30], v: [[1, 0, 0], [1, 0, 0]]}},
    {name: 'h_jnt_head', rot: {t: [0, 15, 30], v: [[0, 0, 0, 1], [0, 0, 0, -1], [0, 0, Math.SQRT1_2, -Math.SQRT1_2]]}, pos: {t: [0, 30], v: [[5, 6, 7], [8, 9, 10]]}}]));
  const ch = channels(fig, c, {inPlace: 'h_jnt_head'});
  assert.deepEqual(ch.map((x) => [x.node, x.path]), [[0, 'rotation'], [0, 'translation'], [1, 'rotation'], [1, 'translation']]);
  assert.deepEqual([...ch[2].input], [0, 0.5, 1]);
  assert.ok(near([...ch[2].output], [0, 0, 0, 1, 0, 0, 0, 1, 0, 0, -Math.SQRT1_2, Math.SQRT1_2], 1e-7), 'each key flipped to agree with the one before (a flip makes -0: compared by value)');
  assert.deepEqual([...ch[3].output], [0, 6, 0, 0, 9, 0], 'x and z are the placement\'s, not the joint\'s');
  assert.ok(near([...ch[0].output.subarray(0, 4)], [0, 0, 1, 0], 1e-7), 'the root\'s key carries the half turn of C');
  assert.ok(near([...ch[1].output.subarray(0, 3)], [-2, 0, 0], 1e-7), 'and its position is scaled and mirrored');
  const wrong = clip(gaiBytes([{name: 'h_all_root'}, {name: 'h_jnt_other', rot: {t: [0, 1], v: [[0, 0, 0, 1], [0, 0, 0, 1]]}}]));
  assert.throws(() => channels(fig, wrong), /clip node 1 is h_jnt_other, joint 1 is h_jnt_head/);
  assert.throws(() => channels(fig, clip(gaiBytes([{name: 'h_all_root'}]))), /1 nodes, the skeleton 2 joints/);
});

test('glb with animations: one view a clip, identical key times shared, inputs with min and max, the info in extras', () => {
  const body = readGmi(gmiBytes({upright: true})), fig = build({body, hair: null, motion: null, height: 2, measure: 'rest', floor: 'root'});
  const c = clip(gaiBytes([{name: 'h_all_root'}, {name: 'h_jnt_head', rot: {t: [0, 30], v: [[0, 0, 0, 1], [0, 0, Math.SQRT1_2, Math.SQRT1_2]]}, pos: {t: [0, 30], v: [[-2, 0, 0], [-2, -1, 0]]}}]));
  const bytes = glb(fig, png(2, 2, new Uint8Array(16).fill(200)), {name: 'x', animations: [{name: '00.0', channels: channels(fig, c)}, {name: 'empty', channels: []}], info: {clips: ['00.0'], rate: 30}});
  const json = JSON.parse(bytes.toString('utf8', 20, 20 + bytes.readUInt32LE(12)));
  assert.equal(json.animations.length, 1, 'a clip with no channel is left out');
  const [a] = json.animations;
  assert.equal(a.name, '00.0'); assert.equal(a.channels.length, 2);
  assert.equal(a.samplers[0].input, a.samplers[1].input, 'the two tracks share their key times');
  const input = json.accessors[a.samplers[0].input];
  assert.deepEqual([input.min, input.max, input.type, input.count], [[0], [1], 'SCALAR', 2]);
  assert.equal(json.accessors[a.samplers[0].output].type, 'VEC4'); assert.equal(json.accessors[a.samplers[1].output].type, 'VEC3');
  assert.equal(json.accessors[a.samplers[0].output].bufferView, input.bufferView, 'one view holds the clip');
  assert.deepEqual(json.extras, {height: 2, faces: [], clips: ['00.0'], rate: 30});
  assert.equal(bytes.length % 4, 0);
});

test('channels with only: the face clip keeps the engine\'s six face joints and nothing else', async () => {
  const {FACE_JOINTS} = await import('./hades-glb.mjs');
  assert.deepEqual(FACE_JOINTS, ['h_jnt_mouth_l', 'h_jnt_mouth_low', 'h_jnt_mouth_r', 'h_jnt_mouth_up', 'h_jnt_tooth_low', 'h_jnt_tooth_up']);
  const body = readGmi(gmiBytes({upright: true})), fig = build({body, hair: null, motion: null, height: 2, measure: 'rest', floor: 'root'});
  const c = clip(gaiBytes([{name: 'h_all_root', rot: {t: [0, 8], v: [[0, 0, 0, 1], [0, 0, 0, 1]]}}, {name: 'h_jnt_head', rot: {t: [0, 8], v: [[0, 0, 0, 1], [0, 0, 0, 1]]}}]));
  assert.equal(channels(fig, c).length, 2);
  assert.deepEqual(channels(fig, c, {only: ['h_jnt_head']}).map((x) => x.node), [1]);
  assert.deepEqual(channels(fig, c, {only: FACE_JOINTS}), [], 'neither joint is a face joint');
});

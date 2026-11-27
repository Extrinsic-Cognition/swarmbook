#!/usr/bin/env node
// hades-glb.mjs: ATHENA FROM THE HADES DISC, one glTF binary for the hero (his words, Oct 14 2026 14:2x WEST, over the film at 30.0 s: "you see this
// exact moment where athen is looking down? can you please go find all the time and assets we excavated from the saint seya hades please dude it is
// vital i need you to find the athena asset from there and bring it here.. what i want to see happen here is i want to have athena outside of the
// dodecahedron using the hades game asset dude please").
//
// The excavation it stands on (Oct 4 2026, ~/code/the-disc-rigs-2026-10-04: COMMON.md, lanes/who/WHO.md, lanes/gmi/GMI.md, lanes/gai/GAI.md,
// lanes/container/CONTAINER.md): Saint Seiya: The Hades (PS2, PAL, SLES-54162) keeps its data in one CRI AFS archive, DATA/AFSDATA.AFS, which
// starts at byte 155,023,360 of the disc image. Saori, the game's Athena, is character 50 ("Saori" at ELF 0x3A84D0), and her files are:
//   index 495  CHARACTER\E00.GMI         body and dress, CMPS-wrapped (Okumura LZSS)   archive byte 334,485,504, 62,596 B
//   index 496  CHARACTER\E00H.GMI        her hair, on the same 85 joints               334,548,992, 121,856 B
//   index 574  CHARACTER\ME00.MPL        her one motion, 8 frames: her lips only (every joint's first key is the rest pose; by the last
//                                        her mouth is open 4.7 degrees)                  336,916,480, 17,728 B
//   index 783  CHARACTER\TEX\E00.TPL     one 512 x 512 TIM3 picture, 8-bit, 256 colours 401,276,928, 263,248 B
//   index 784  CHARACTER\TEX\E00_FACE.TPL six 256 x 256 faces on the same palette: the top-left quarter of the body picture, swapped to change
//                                        her expression                              401,541,120, 393,648 B
// Read from the disc image on pelino (C:\Embers\pcsx2\SLES_541.62.SaintSeiyaTheHades.iso, 2,101,510,144 B; the copies on this Mac's Downloads
// and on lysa are gone) by byte range, read-only; each file's size and first 16 bytes equal the scout's table (scout/afs-table.json).
//
// What it writes: one .glb, a skinned mesh (body and hair in one primitive, one texture, 85 joints as the game has them) in the rest pose turned
// by a stance (--stance: a JSON of joint name -> [x, y, z] degrees about the joint's own axes, so she can stand as the film has her: bound at the
// prow of the ship on the statue of Odin as its figurehead, arms at her sides, her head down at the fight far below, the film's 28 to 37 s;
// lab/braindance.json holds where; the lips as ME00's first key, closed), the game's model space (Y down, toes to +Z, row vectors) turned into glTF's
// (Y up, facing +Z) on the root joint, scaled to --height metres with her hem on y = 0; and a second picture beside it per extra face asked for
// (--faces), so a page can change her expression by swapping the map. These are third-party art. On Oct 15 2026 the user explicitly asked
// for the decompiled assets and their sources in this private GitHub handoff: assets/native-source holds the 23 required disc chunks;
// tools/rebuild-native-assets.mjs regenerates the four bundled GLBs without the disc or LAN. This scoped handoff does not change the
// general house mirror policy (tools/house-mirror/strip-families.txt), nor authorize publishing room data or secrets.
//
//   node hades-glb.mjs --disc <dir holding e00.gmi e00h.gmi me00.mpl tex-e00.tpl tex-e00_face.tpl> --out <athena.glb> [--face 3] [--faces 4,5]
//        [--height 1.6] [--stance athena.stance.json]
//
// THE FIGHTERS (his words, the same turn: "then ofc i want to see saint seya as 3D model going up there"; "there is a reason why i got hades
// installed on pelino dude come on"): any character number by --who, its files read off the disc by hades-disc-read.mjs, with the game's own
// clips as glTF animations on the skin:
//   node hades-glb.mjs --who 00 --disc <dir: 00.gmi 00h.gmi m00.mpl 00.mpl tex-00.tpl tex-00_face.tpl> --out seiya.hades.glb --name seiya
//        [--height 1.65] [--pose 0] [--face none|0..6] [--faces 2,6] [--clips all|none|0,1,2]
//   00 Seiya in the Pegasus Cloth, 15 Seiya in the Sagittarius Cloth, 04 Ikki (lanes/who/WHO.md). NN.mpl is an FJF of 72 or 73 GAI clips; the
//   FJF's ids are the motion numbers (0, 10, 20 ... 5040), what each one is (stand, walk, which hit) is not on the disc: they are named by index
//   and id. A fighter's clips play in place (the waist's x and z are the travel, which the engine moves the placement by and zeroes in the
//   waist, ELF 0x158B80..0x158C10, disc-chunks RECEIPT), the floor is the game root's (y = 0 of h_all_root: the clips lift the waist 8.1 units
//   above it), the height is measured in the rest pose (standing straight), and the nodes stand at the first key of clip --pose. The bind pose
//   is the game's rest, the waist ON the floor: a box of the POSITION accessor alone sees the feet below it; three's skinned box sees the pose.
//
// The formats, in short (every detail and its evidence is in the lane sheets named above):
//   GMI   header 0x20 (joints u16 @0x10, groups u16 @0x12, joint table @0x14, group table @0x18); joint 0x70: rest LOCAL 4x4 (row vectors,
//         translation in row 3), parent s16 @0x40, name @0x46; group 0x30: vertices @2, texture slot @4, B @6, then offsets of positions
//         (f32 x y z + a strip flag 0/1), normals (s16 x y z, 4096 = 1), colours, UV (f32), joint slots (u8 slot0, slot1 or 0xFF), weights (f32 w0 w1
//         or none), and a palette of up to 12 joints @0x24. A vertex on one joint is stored in that joint's space, on two in model space.
//         Flag 1 = "a triangle with the two vertices before me".
//   GAI   nodes (0x30 each from 0x14) in the model's joint order, each with a rotation track (u16 key times, unit quaternions x y z w as the
//         standard column-vector quaternion of the joint's local rotation) and a position track (x y z 1).
//   TIM3  as TIM2: a 48-byte picture header, the indices, then 256 colours RGBA with the PS2's alpha (0x80 = opaque) in CSM1 order.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {pathToFileURL} from 'node:url';

/* ---- the disc's wrappers ---- */

/** CMPS: Okumura LZSS behind a 16-byte header (u32 'CMPS', 1, the unpacked size, 0); a 4096-byte ring of zeros written from 0xFEE. */
export function lzss(b) {
  const size = b.readUInt32LE(8), N = 4096, ring = new Uint8Array(N), out = Buffer.alloc(size);
  let r = N - 18, o = 0, i = 16, flags = 0;
  while (o < size) {
    flags >>= 1;
    if (!(flags & 0x100)) { if (i >= b.length) break; flags = b[i++] | 0xff00; }
    if (flags & 1) { if (i >= b.length) break; const c = b[i++]; out[o++] = c; ring[r] = c; r = (r + 1) & (N - 1); continue; }
    if (i + 1 >= b.length) break;
    const lo = b[i], hi = b[i + 1], at = lo | ((hi & 0xf0) << 4);
    i += 2;
    for (let k = 0; k < (hi & 0x0f) + 3 && o < size; k++) { const c = ring[(at + k) & (N - 1)]; out[o++] = c; ring[r] = c; r = (r + 1) & (N - 1); }
  }
  if (o !== size) throw new Error(`CMPS: ${o} of ${size} bytes`);
  return out;
}
const unwrap = (b) => b.toString('latin1', 0, 4) === 'CMPS' ? lzss(b) : b;

/** FJF: 'FJF\0', u16 count, u16 flags, u32 offsets; the entries' sizes are the gaps. */
export function fjf(d) {
  if (d.toString('latin1', 0, 3) !== 'FJF') throw new Error('not an FJF container');
  const n = d.readUInt16LE(4), at = [];
  for (let k = 0; k < n; k++) at.push(d.readUInt32LE(8 + 4 * k));
  return at.map((o, k) => d.subarray(o, k + 1 < n ? at[k + 1] : d.length));
}

/** The u16 id of each FJF entry (the motion number in a .mpl): after the offsets, 4 bytes later with flag 0x4000 (its end word), none with
 *  flag 0x8000 (CONTAINER.md 1.1, ELF 0x00156884 and 0x001568A8). */
export function fjfIds(d) {
  const n = d.readUInt16LE(4), flags = d.readUInt16LE(6);
  if (flags & 0x8000) return null;
  const at = 8 + 4 * n + (flags & 0x4000 ? 4 : 0);
  return Array.from({length: n}, (_, k) => d.readUInt16LE(at + 2 * k));
}

/** The pictures of a TIM2/TIM3 entry: {w, h, indices, clut (or null)}; only 8-bit indexed pictures are read (all of hers are). */
export function tim(e) {
  const magic = e.toString('latin1', 0, 4);
  if (magic !== 'TIM2' && magic !== 'TIM3') throw new Error(`not a TIM picture (${magic})`);
  const pics = [];
  for (let k = 0, p = 16; k < e.readUInt16LE(6); k++) {
    const total = e.readUInt32LE(p), clut = e.readUInt32LE(p + 4), image = e.readUInt32LE(p + 8), header = e.readUInt16LE(p + 12);
    const type = e[p + 19], w = e.readUInt16LE(p + 20), h = e.readUInt16LE(p + 22);
    if (type !== 5) throw new Error(`picture type ${type}: only 8-bit indices are read`);
    pics.push({w, h, indices: e.subarray(p + header, p + header + image), clut: clut ? e.subarray(p + header + image, p + header + image + clut) : null});
    p += total;
  }
  return pics;
}

/** 256 colours of 32 bits in CSM1 order (entries 8..15 and 16..23 of every 32 swapped) -> RGBA in index order, alpha 0x80 -> 255. */
export function palette(clut) {
  const pal = new Uint8Array(1024);
  for (let i = 0; i < 256; i++) {
    const j = (i & 0xe7) | ((i & 0x08) << 1) | ((i & 0x10) >> 1);
    pal[4 * i] = clut[4 * j]; pal[4 * i + 1] = clut[4 * j + 1]; pal[4 * i + 2] = clut[4 * j + 2]; pal[4 * i + 3] = Math.min(255, clut[4 * j + 3] * 2);
  }
  return pal;
}

/** RGBA of a picture through a palette; `face` (a 256 x 256 picture on the same palette) over its top-left quarter when given. */
export function paint(pic, pal, face = null) {
  const out = new Uint8Array(pic.w * pic.h * 4);
  for (let i = 0; i < pic.w * pic.h; i++) out.set(pal.subarray(4 * pic.indices[i], 4 * pic.indices[i] + 4), 4 * i);
  if (face) for (let y = 0; y < face.h; y++) for (let x = 0; x < face.w; x++) {
    const c = face.indices[y * face.w + x];
    out.set(pal.subarray(4 * c, 4 * c + 4), 4 * (y * pic.w + x));
  }
  return out;
}

/** A PNG of RGBA rows (no filter, deflate 9). */
export function png(w, h, rgba) {
  const table = new Int32Array(256).map((_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c; });
  const crc = (b) => { let c = -1; for (const x of b) c = table[(c ^ x) & 255] ^ (c >>> 8); return (c ^ -1) >>> 0; };
  const chunk = (type, data) => {
    const b = Buffer.alloc(12 + data.length);
    b.writeUInt32BE(data.length, 0); b.write(type, 4, 'latin1'); data.copy(b, 8); b.writeUInt32BE(crc(b.subarray(4, 8 + data.length)), 8 + data.length);
    return b;
  };
  const rows = Buffer.alloc((4 * w + 1) * h);
  for (let y = 0; y < h; y++) Buffer.from(rgba.buffer, rgba.byteOffset + 4 * w * y, 4 * w).copy(rows, (4 * w + 1) * y + 1);
  const head = Buffer.alloc(13);
  head.writeUInt32BE(w, 0); head.writeUInt32BE(h, 4); head[8] = 8; head[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', head), chunk('IDAT', zlib.deflateSync(rows, {level: 9})), chunk('IEND', Buffer.alloc(0))]);
}

/* ---- 4 x 4 maths, column vectors (M v), stored as rows of an Array(16): m[4 * row + col] ---- */
const I4 = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
export function mul(a, b) {
  const o = new Array(16).fill(0);
  for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) o[4 * r + c] += a[4 * r + k] * b[4 * k + c];
  return o;
}
export function invert(m) {   // a rigid motion with a uniform scale: [sR t; 0 1] -> [R^T / s, -R^T t / s]
  const s2 = m[0] * m[0] + m[4] * m[4] + m[8] * m[8], o = I4();
  for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) o[4 * r + c] = m[4 * c + r] / s2;
  for (let r = 0; r < 3; r++) o[4 * r + 3] = -(o[4 * r] * m[3] + o[4 * r + 1] * m[7] + o[4 * r + 2] * m[11]);
  return o;
}
const apply = (m, [x, y, z], w = 1) => [0, 1, 2].map((r) => m[4 * r] * x + m[4 * r + 1] * y + m[4 * r + 2] * z + m[4 * r + 3] * w);
/** The game's row-vector matrix (16 floats, translation in row 3) as a column-vector one. */
const fromRows = (f) => [0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3].map((c) => f[4 * c + r]));
/** A unit quaternion (x, y, z, w) and a translation as a column-vector matrix. */
export function compose([x, y, z, w], [tx, ty, tz]) {
  return [1 - 2 * (y * y + z * z), 2 * (x * y - z * w), 2 * (x * z + y * w), tx,
    2 * (x * y + z * w), 1 - 2 * (x * x + z * z), 2 * (y * z - x * w), ty,
    2 * (x * z - y * w), 2 * (y * z + x * w), 1 - 2 * (x * x + y * y), tz,
    0, 0, 0, 1];
}
/** a x b of unit quaternions (x, y, z, w): the rotation b, then a. */
export const qmul = (a, b) => [
  a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
  a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
  a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
  a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
/** The quaternion of turns in degrees about a frame's own x, then y, then z. */
export function quatOfDegrees([x, y, z]) {
  const h = (d) => (d * Math.PI / 360);
  return qmul(qmul([Math.sin(h(x)), 0, 0, Math.cos(h(x))], [0, Math.sin(h(y)), 0, Math.cos(h(y))]), [0, 0, Math.sin(h(z)), Math.cos(h(z))]);
}
/** The unit quaternion of a rotation (the upper 3 x 3 of a column-vector matrix), w >= 0. */
export function quatOf(m) {
  const t = m[0] + m[5] + m[10];
  let q;
  if (t > 0) { const s = 2 * Math.sqrt(t + 1); q = [(m[9] - m[6]) / s, (m[2] - m[8]) / s, (m[4] - m[1]) / s, s / 4]; }
  else if (m[0] > m[5] && m[0] > m[10]) { const s = 2 * Math.sqrt(1 + m[0] - m[5] - m[10]); q = [s / 4, (m[1] + m[4]) / s, (m[2] + m[8]) / s, (m[9] - m[6]) / s]; }
  else if (m[5] > m[10]) { const s = 2 * Math.sqrt(1 + m[5] - m[0] - m[10]); q = [(m[1] + m[4]) / s, s / 4, (m[6] + m[9]) / s, (m[2] - m[8]) / s]; }
  else { const s = 2 * Math.sqrt(1 + m[10] - m[0] - m[5]); q = [(m[2] + m[8]) / s, (m[6] + m[9]) / s, s / 4, (m[4] - m[1]) / s]; }
  const n = Math.hypot(...q) * (q[3] < 0 ? -1 : 1);
  return q.map((v) => v / n);
}

/* ---- the model and the motion ---- */

/** A .gmi (unwrapped): its joints {name, parent, local} (column vectors) and its groups with their vertex arrays read out. */
export function readGmi(d) {
  if (d.readUInt32LE(0) !== 0x20040319) throw new Error('not a .gmi');
  const nj = d.readUInt16LE(0x10), ng = d.readUInt16LE(0x12), joff = d.readUInt32LE(0x14), goff = d.readUInt32LE(0x18);
  const joints = [];
  for (let k = 0; k < nj; k++) {
    const o = joff + 0x70 * k, f = [];
    for (let i = 0; i < 16; i++) f.push(d.readFloatLE(o + 4 * i));
    joints.push({name: d.toString('latin1', o + 0x46, o + 0x68).replace(/\0[\s\S]*$/, ''), parent: d.readInt16LE(o + 0x40), local: fromRows(f)});
  }
  const groups = [];
  for (let g = 0; g < ng; g++) {
    const o = goff + 0x30 * g, A = d.readUInt16LE(o + 2);
    const [pos, nrm, , uv, slot, wgt] = [0x0c, 0x10, 0x14, 0x18, 0x1c, 0x20].map((k) => d.readUInt32LE(o + k));
    const pal = [...d.subarray(o + 0x24, o + 0x30)];
    const verts = [];
    for (let v = 0; v < A; v++) {
      const s0 = d[slot + 4 * v], s1 = d[slot + 4 * v + 1];
      verts.push({
        p: [0, 1, 2].map((i) => d.readFloatLE(pos + 16 * v + 4 * i)), strip: d.readFloatLE(pos + 16 * v + 12) > 0.5,
        n: nrm ? [0, 1, 2].map((i) => d.readInt16LE(nrm + 8 * v + 2 * i) / 4096) : [0, 0, 0],
        uv: [d.readFloatLE(uv + 8 * v), d.readFloatLE(uv + 8 * v + 4)],
        joints: s1 === 0xff ? [pal[s0]] : [pal[s0], pal[s1]],
        weights: s1 === 0xff ? [1] : [d.readFloatLE(wgt + 8 * v), d.readFloatLE(wgt + 8 * v + 4)],
      });
    }
    groups.push({texture: d.readUInt16LE(o + 4), verts});
  }
  return {joints, groups};
}

/** A .gai's first key per node: {name -> {q, t}} (q a unit quaternion x y z w, t a translation; either may be missing). */
export function firstKeys(g) {
  if (g.readUInt32LE(0) !== 0x20030818) throw new Error('not a .gai');
  const keys = new Map();
  for (let k = 0; k < g.readUInt16LE(8); k++) {
    const o = 0x14 + 0x30 * k, name = g.toString('latin1', o + 4, o + 0x24).replace(/\0[\s\S]*$/, ''), rot = g.readUInt32LE(o + 0x24), pos = g.readUInt32LE(o + 0x28);
    const key = (track) => { const at = g.readUInt32LE(track + 12); return [0, 1, 2, 3].map((i) => g.readFloatLE(at + 4 * i)); };
    keys.set(name, {q: rot ? key(rot) : null, t: pos ? key(pos).slice(0, 3) : null});
  }
  return keys;
}

/** A .gai's every track (GAI.md "The layout"): {length, nodes: [{name, length, rot: {t, v: [x y z w]}, pos: {t, v: [x y z]}, scl: {t, v}}]},
 *  t the u16 key times in clip frames, a missing track null. */
export function clip(g) {
  if (g.readUInt32LE(0) !== 0x20030818) throw new Error('not a .gai');
  const track = (d, n) => {
    if (!d) return null;
    const count = g.readUInt16LE(d + 4), times = g.readUInt32LE(d + 8), keys = g.readUInt32LE(d + 12);
    return {t: Array.from({length: count}, (_, i) => g.readUInt16LE(times + 2 * i)),
      v: Array.from({length: count}, (_, i) => Array.from({length: n}, (_, c) => g.readFloatLE(keys + 16 * i + 4 * c)))};
  };
  const nodes = [];
  for (let k = 0; k < g.readUInt16LE(8); k++) {
    const o = 0x14 + 0x30 * k;
    nodes.push({name: g.toString('latin1', o + 4, o + 0x24).replace(/\0[\s\S]*$/, ''), length: g.readUInt32LE(o),
      rot: track(g.readUInt32LE(o + 0x24), 4), pos: track(g.readUInt32LE(o + 0x28), 3), scl: track(g.readUInt32LE(o + 0x2c), 3)});
  }
  return {length: Math.max(0, ...nodes.map((n) => n.length)), nodes};
}

/** The first key of every track of a clip as firstKeys gives it ({name -> {q, t}}), the waist's x and z zeroed when `inPlace` names it. */
export function keysAt0(c, inPlace = null) {
  return new Map(c.nodes.map((n) => [n.name, {q: n.rot ? n.rot.v[0] : null,
    t: n.pos ? (n.name === inPlace ? [0, n.pos.v[0][1], 0] : n.pos.v[0]) : null}]));
}

/* ---- the figure ---- */

/** World matrices of a joint table from local ones (parents come first). */
export const worlds = (joints, local) => {
  const w = [];
  joints.forEach((j, k) => { w[k] = j.parent < 0 ? local[k] : mul(w[j.parent], local[k]); });
  return w;
};

/** Triangles of a group's strip: flag 1 = (v-2, v-1, v), each turned so its face agrees with its vertices' normals (outward, counter-clockwise). */
export function triangles(verts, base = 0) {
  const out = [];
  for (let v = 2; v < verts.length; v++) {
    if (!verts[v].strip) continue;
    let [a, b, c] = [v - 2, v - 1, v];
    const [pa, pb, pc] = [verts[a].bind, verts[b].bind, verts[c].bind];
    const e1 = [0, 1, 2].map((i) => pb[i] - pa[i]), e2 = [0, 1, 2].map((i) => pc[i] - pa[i]);
    const face = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
    const n = [0, 1, 2].map((i) => verts[a].normal[i] + verts[b].normal[i] + verts[c].normal[i]);
    if (face[0] * n[0] + face[1] * n[1] + face[2] * n[2] < 0) [b, c] = [c, b];
    out.push(base + a, base + b, base + c);
  }
  return out;
}

/**
 * build({body, hair, motion, stance, height}) -> {joints, nodes (T, R, S per joint), positions, normals, uvs, joints4, weights4, indices,
 * inverseBinds, posed, height, scale}. The turn into glTF (Y up, facing +Z, metres, hem at 0) is C = scale x Rz(180 deg) with a lift, put on the
 * root joint; the mesh is stored as C x the bind pose, so the skinning gives C x the game's pose. stance: {joint name: [x, y, z] degrees} turned
 * in the joint's own frame after its rest (and after the motion's key); a name not on the skeleton is an error.
 */
export function build({body, hair, motion, stance, height = 1.6, measure = 'posed', floor = 'posed'}) {
  const J = body.joints;
  if (hair && hair.joints.map((j) => j.name).join() !== J.map((j) => j.name).join()) throw new Error('the hair is not on the body\'s joints');
  for (const name of Object.keys(stance || {})) if (!name.startsWith('_') && !J.some((j) => j.name === name)) throw new Error(`the stance names ${name}, not a joint of hers`);   // "_": a note
  const rest = worlds(J, J.map((j) => j.local));
  // the pose: the motion's first key where it has one, the rest pose elsewhere, then the stance's turn in the joint's own frame
  const local = J.map((j) => {
    const k = motion?.get(j.name), s = stance?.[j.name];
    const t = k?.t ?? [j.local[3], j.local[7], j.local[11]], q = k?.q ?? quatOf(j.local);
    return compose(s ? qmul(q, quatOfDegrees(s)) : q, t);
  });
  const posed = worlds(J, local);
  const vertices = [], indices = [];
  for (const model of [body, hair].filter(Boolean)) for (const g of model.groups) {
    const base = vertices.length;
    for (const v of g.verts) {
      // one joint: stored in that joint's space; two: in model space (the rest pose)
      const bind = v.joints.length === 1 ? apply(rest[v.joints[0]], v.p) : v.p;
      const normal = v.joints.length === 1 ? apply(rest[v.joints[0]], v.n, 0) : v.n;
      const sum = v.weights.reduce((a, b) => a + b, 0) || 1;
      vertices.push({...v, bind, normal, weights: v.weights.map((w) => w / sum)});
    }
    indices.push(...triangles(vertices.slice(base), base));
  }
  // where the posed figure stands: the lowest point of the skinned mesh (in the game, the greatest y) and its height
  const skin = (v) => {
    const out = [0, 0, 0];
    v.joints.forEach((j, k) => { const p = apply(mul(posed[j], invert(rest[j])), v.bind); for (let i = 0; i < 3; i++) out[i] += v.weights[k] * p[i]; });
    return out;
  };
  // measure 'posed' (hers): the posed figure's extent; 'rest' (a fighter's): the rest pose's, standing straight. floor 'posed' (hers): the
  // lowest posed point on y = 0; 'root' (a fighter's): the game's floor, y = 0 of the root joint, where its clips stand
  let top = Infinity, bottom = -Infinity, low = -Infinity, high = Infinity;
  for (const v of vertices) {
    const y = skin(v)[1], m = measure === 'rest' ? v.bind[1] : y;
    low = Math.max(low, y); high = Math.min(high, y); top = Math.min(top, m); bottom = Math.max(bottom, m);
  }
  const scale = height / (bottom - top), lift = floor === 'root' ? 0 : low;
  // C: game model space -> glTF: x -> -x, y -> -y (a half turn about z), scaled, the hem lifted to y = 0
  const C = [-scale, 0, 0, 0, 0, -scale, 0, lift * scale, 0, 0, scale, 0, 0, 0, 0, 1];
  const nodes = J.map((j, k) => {
    const m = j.parent < 0 ? mul(C, local[k]) : local[k];
    const s = Math.hypot(m[0], m[4], m[8]);
    const r = [m[0] / s, m[1] / s, m[2] / s, 0, m[4] / s, m[5] / s, m[6] / s, 0, m[8] / s, m[9] / s, m[10] / s, 0, 0, 0, 0, 1];
    return {name: j.name, parent: j.parent, translation: [m[3], m[7], m[11]], rotation: quatOf(r), scale: Math.abs(s - 1) < 1e-6 ? null : [s, s, s]};
  });
  const inverseBinds = rest.map((w) => invert(mul(C, w)));
  const turned = vertices.map((v) => ({p: apply(C, v.bind), n: apply(C, v.normal, 0).map((x) => x / scale)}));
  return {
    joints: J.length, nodes, inverseBinds, indices, count: vertices.length, height: (bottom - top) * scale, scale, C,
    posedHeight: (low - high) * scale, floorGap: (lift - low) * scale,   // the posed figure's height, and its lowest point above the floor
    positions: turned.flatMap((v) => v.p), normals: turned.flatMap((v) => { const l = Math.hypot(...v.n) || 1; return v.n.map((x) => x / l); }),
    uvs: vertices.flatMap((v) => v.uv),
    joints4: vertices.flatMap((v) => [v.joints[0], v.joints[1] ?? 0, 0, 0]), weights4: vertices.flatMap((v) => [v.weights[0], v.weights[1] ?? 0, 0, 0]),
    posed: vertices.map((v) => apply(C, skin(v))),   // the stance, for a picture of it without a renderer
  };
}

/** The six joints the engine plays a face clip (MNN.MPL) on, by the ELF's own table at 0x3E6F20 (disc-chunks make_chunks.py FACE_NAMES_VA): the
 *  face clip has rotation, position and scale tracks on every joint but the root (177 channels for 00), and is sampled on these alone. */
export const FACE_JOINTS = ['h_jnt_mouth_l', 'h_jnt_mouth_low', 'h_jnt_mouth_r', 'h_jnt_mouth_up', 'h_jnt_tooth_low', 'h_jnt_tooth_up'];

/**
 * channels(fig, clip, {rate, inPlace, only}) -> [{node, path, input (seconds), output}] of one clip on build()'s nodes, `only` the joint names
 * kept (null: all). The clip's node k drives joint k (bound by index, GAI.md; the names are checked here). Rotations are the keys as they
 * are, made sign-continuous (the engine flips a key whose dot with the one before is negative, ELF func_002AC3A0, so the slerp is the same);
 * positions are the keys, the waist's x and z zeroed (in place); a root joint's keys are turned by C. rate: clip frames a second (30:
 * GAI.md "The rate", likely, not measured).
 */
export function channels(fig, c, {rate = 30, inPlace = 'h_jnt_waist', only = null} = {}) {
  if (c.nodes.length !== fig.nodes.length) throw new Error(`the clip has ${c.nodes.length} nodes, the skeleton ${fig.nodes.length} joints`);
  const qC = quatOf(fig.C.map((x, i) => (i < 12 && i % 4 < 3 ? x / fig.scale : x))), out = [];
  const input = (t) => Float32Array.from(t, (f) => f / rate);
  c.nodes.forEach((n, k) => {
    if (n.name !== fig.nodes[k].name) throw new Error(`clip node ${k} is ${n.name}, joint ${k} is ${fig.nodes[k].name}`);
    if (only && !only.includes(n.name)) return;
    const root = fig.nodes[k].parent < 0;
    if (n.rot) {
      const q = n.rot.v.map((v) => (root ? qmul(qC, v) : v.slice()));
      for (let i = 1; i < q.length; i++) if (q[i].reduce((s, x, j) => s + x * q[i - 1][j], 0) < 0) q[i] = q[i].map((x) => -x);
      out.push({node: k, path: 'rotation', input: input(n.rot.t), output: Float32Array.from(q.flat())});
    }
    if (n.pos) {
      const v = n.pos.v.map((p) => (n.name === inPlace ? [0, p[1], 0] : p)).map((p) => (root ? apply(fig.C, p) : p));
      out.push({node: k, path: 'translation', input: input(n.pos.t), output: Float32Array.from(v.flat())});
    }
    if (n.scl) out.push({node: k, path: 'scale', input: input(n.scl.t), output: Float32Array.from(n.scl.v.flat(), (x) => (root ? x * fig.scale : x))});
  });
  return out;
}

/* ---- glTF binary ---- */

/** One .glb: the figure's skinned primitive, its texture (PNG bytes), and extra pictures named in `extras` (for a page to swap); `animations`
 *  [{name, channels}] (channels() of each clip: one buffer view a clip, identical key times shared), `info` merged into json.extras. */
export function glb(fig, pngBytes, {name = 'athena', extras = {}, animations = [], info = {}} = {}) {
  const chunks = [], views = [], accessors = [];
  let length = 0;
  const view = (buf, target) => {
    const pad = (4 - (length % 4)) % 4;
    if (pad) { chunks.push(Buffer.alloc(pad)); length += pad; }
    views.push({buffer: 0, byteOffset: length, byteLength: buf.length, ...(target ? {target} : {})});
    chunks.push(buf); length += buf.length;
    return views.length - 1;
  };
  const accessor = (array, Type, componentType, type, target, minmax) => {
    const buf = Buffer.from(new Type(array).buffer);
    const a = {bufferView: view(buf, target), componentType, count: array.length / {SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16}[type], type};
    if (minmax) {
      const k = {VEC3: 3}[type];
      a.min = [0, 1, 2].map((i) => Math.min(...array.filter((_, j) => j % k === i)));
      a.max = [0, 1, 2].map((i) => Math.max(...array.filter((_, j) => j % k === i)));
    }
    accessors.push(a);
    return accessors.length - 1;
  };
  const POSITION = accessor(fig.positions, Float32Array, 5126, 'VEC3', 34962, true);
  const NORMAL = accessor(fig.normals, Float32Array, 5126, 'VEC3', 34962);
  const TEXCOORD_0 = accessor(fig.uvs, Float32Array, 5126, 'VEC2', 34962);
  const JOINTS_0 = accessor(fig.joints4, Uint8Array, 5121, 'VEC4', 34962);
  const WEIGHTS_0 = accessor(fig.weights4, Float32Array, 5126, 'VEC4', 34962);
  const indices = accessor(fig.indices, Uint16Array, 5123, 'SCALAR', 34963);
  // inverse bind matrices, column-major
  const ibm = accessor(fig.inverseBinds.flatMap((m) => [0, 1, 2, 3].flatMap((c) => [0, 1, 2, 3].map((r) => m[4 * r + c]))), Float32Array, 5126, 'MAT4');
  const images = [{bufferView: view(pngBytes), mimeType: 'image/png', name}];
  for (const [key, bytes] of Object.entries(extras)) images.push({bufferView: view(bytes), mimeType: 'image/png', name: key});
  const jointNodes = fig.nodes.map((n, k) => ({
    name: n.name, translation: n.translation, rotation: n.rotation, ...(n.scale ? {scale: n.scale} : {}),
    ...(fig.nodes.some((c) => c.parent === k) ? {children: fig.nodes.flatMap((c, i) => c.parent === k ? [i] : [])} : {}),
  }));
  const meshNode = jointNodes.length;
  const anims = animations.filter((a) => a.channels.length).map((a) => {
    const parts = [], seen = new Map();
    let at = 0;
    const put = (arr) => { const o = at; parts.push(Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength)); at += arr.byteLength; return o; };
    const placed = a.channels.map((ch) => {
      const key = ch.input.join(',');
      if (!seen.has(key)) seen.set(key, put(ch.input));
      return {...ch, inAt: seen.get(key), outAt: put(ch.output)};
    });
    const bv = view(Buffer.concat(parts)), inputs = new Map(), samplers = [], chans = [];
    for (const ch of placed) {
      if (!inputs.has(ch.inAt)) {
        accessors.push({bufferView: bv, byteOffset: ch.inAt, componentType: 5126, count: ch.input.length, type: 'SCALAR', min: [ch.input[0]], max: [ch.input[ch.input.length - 1]]});
        inputs.set(ch.inAt, accessors.length - 1);
      }
      accessors.push({bufferView: bv, byteOffset: ch.outAt, componentType: 5126, count: ch.input.length, type: ch.path === 'rotation' ? 'VEC4' : 'VEC3'});
      samplers.push({input: inputs.get(ch.inAt), output: accessors.length - 1});
      chans.push({sampler: samplers.length - 1, target: {node: ch.node, path: ch.path}});
    }
    return {name: a.name, samplers, channels: chans};
  });
  const json = {
    asset: {version: '2.0', generator: 'hades-glb.mjs (house, dyson-society/tools)', copyright: 'Saint Seiya: The Hades (PS2, SLES-54162): third-party art'},
    scene: 0,
    scenes: [{name, nodes: [...fig.nodes.flatMap((n, k) => n.parent < 0 ? [k] : []), meshNode]}],
    nodes: [...jointNodes, {name, mesh: 0, skin: 0}],
    meshes: [{name, primitives: [{attributes: {POSITION, NORMAL, TEXCOORD_0, JOINTS_0, WEIGHTS_0}, indices, material: 0}]}],
    skins: [{name, joints: fig.nodes.map((_, k) => k), inverseBindMatrices: ibm, skeleton: fig.nodes.findIndex((n) => n.parent < 0)}],
    materials: [{name, doubleSided: true, pbrMetallicRoughness: {baseColorTexture: {index: 0}, metallicFactor: 0, roughnessFactor: 1}}],
    textures: [{source: 0, sampler: 0}],
    samplers: [{magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071}],
    images,
    ...(anims.length ? {animations: anims} : {}),
    accessors,
    bufferViews: views,
    buffers: [{byteLength: length}],
    extras: {height: fig.height, faces: Object.keys(extras), ...info},
  };
  let text = Buffer.from(JSON.stringify(json));
  text = Buffer.concat([text, Buffer.alloc((4 - (text.length % 4)) % 4, 0x20)]);
  let bin = Buffer.concat(chunks);
  bin = Buffer.concat([bin, Buffer.alloc((4 - (bin.length % 4)) % 4)]);
  const head = Buffer.alloc(12), th = Buffer.alloc(8), bh = Buffer.alloc(8);
  head.write('glTF', 0, 'latin1'); head.writeUInt32LE(2, 4); head.writeUInt32LE(12 + 8 + text.length + 8 + bin.length, 8);
  th.writeUInt32LE(text.length, 0); th.write('JSON', 4, 'latin1');
  bh.writeUInt32LE(bin.length, 0); bh.write('BIN\0', 4, 'latin1');
  return Buffer.concat([head, th, text, bh, bin]);
}

/* ---- the command ---- */

if (process.argv[1] && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
  const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
  const disc = arg('--disc'), out = arg('--out'), who = String(arg('--who', 'e00')).toLowerCase(), hers = who === 'e00';
  if (!disc || !out) {
    console.error('node hades-glb.mjs [--who e00|00|04|15] --disc <dir> --out <x.glb> [--name athena] [--face 3|none] [--faces 4,5] [--height 1.6] [--stance s.json] [--pose 0] [--clips all|none|0,1,2] [--loops loops-by-code.json]');
    process.exit(2);
  }
  const file = (name) => path.join(disc, name), read = (name) => unwrap(fs.readFileSync(file(name)));
  const t0 = performance.now();
  const body = readGmi(read(`${who}.gmi`)), hair = fs.existsSync(file(`${who}h.gmi`)) ? readGmi(read(`${who}h.gmi`)) : null;
  for (const g of [body, hair].filter(Boolean).flatMap((m) => m.groups)) if (g.texture !== 0) throw new Error(`a group on texture slot ${g.texture}: only slot 0 (the TPL's first picture) is read`);
  // hers: the lips of ME00 closed; a fighter's: every clip of NN.mpl (plain GAI entries, the FJF ids the motion numbers) and the face clip of MNN.MPL
  const mpl = hers ? null : fs.readFileSync(file(`${who}.mpl`)), clips = mpl ? fjf(mpl).map((e) => clip(unwrap(e))) : [], ids = mpl ? fjfIds(mpl) : [];
  const faceGai = unwrap(fjf(read(`m${who}.mpl`))[0]), pose = Number(arg('--pose', 0));
  const motion = hers ? firstKeys(faceGai) : keysAt0(clips[pose], 'h_jnt_waist');
  const stance = arg('--stance') ? JSON.parse(fs.readFileSync(arg('--stance'), 'utf8')) : null;
  const fig = build({body, hair, motion, stance, height: Number(arg('--height', hers ? 1.6 : 1.65)), measure: hers ? 'posed' : 'rest', floor: hers ? 'posed' : 'root'});
  const [picture] = tim(fjf(read(`tex-${who}.tpl`))[0]), faces = fjf(read(`tex-${who}_face.tpl`)).map((e) => tim(e)[0]);
  const pal = palette(picture.clut), faceArg = String(arg('--face', hers ? '3' : 'none')), face = faceArg === 'none' ? null : Number(faceArg);
  const extras = Object.fromEntries(String(arg('--faces', '')).split(',').filter(Boolean).map((k) => [`face${k}`, png(picture.w, picture.h, paint(picture, pal, faces[Number(k)]))]));
  const pick = String(arg('--clips', hers ? 'none' : 'all'));
  const chosen = pick === 'none' ? [] : pick === 'all' ? clips.map((_, k) => k) : pick.split(',').map(Number);
  const named = (k) => `${String(k).padStart(2, '0')}.${ids[k]}`;   // index . motion number: what each one is, the disc does not say
  const animations = chosen.map((k) => ({name: named(k), channels: channels(fig, clips[k])}));
  if (!hers) animations.push({name: 'face', channels: channels(fig, clip(faceGai), {only: FACE_JOINTS})});
  const waist = fig.nodes.findIndex((n) => n.name === 'h_jnt_waist');
  const travel = (c) => { const p = c.nodes[waist]?.pos; if (!p) return [0, 0]; const a = p.v[0], b = p.v[p.v.length - 1]; return [-(b[0] - a[0]) * fig.scale, (b[2] - a[2]) * fig.scale].map((x) => +x.toFixed(3)); };
  const loops = arg('--loops') ? JSON.parse(fs.readFileSync(arg('--loops'), 'utf8')).table : null;
  const info = hers ? {} : {who, clips: chosen.map(named), face_clip: 'face', face_joints: FACE_JOINTS, rate: 30, frames: chosen.map((k) => clips[k].length), pose: named(pose),
    travel: chosen.map((k) => travel(clips[k])),   // metres in glTF x and z over the clip: the placement's move, which the clip itself does not make
    ...(loops ? {loops: chosen.map((k) => loops[ids[k]] ?? null), loops_note: 'the loop word by motion number as the RAM of four recorded fighters held it (disc-chunks out/loops-by-code.json); not on the disc; null where unknown'} : {}),
    floor: 'y = 0 is the game root (h_all_root), where the clips stand', bind: 'the game rest pose, the waist on the floor; the nodes stand at the first key of clip ' + named(pose)};
  const bytes = glb(fig, png(picture.w, picture.h, paint(picture, pal, face === null ? null : faces[face])), {name: arg('--name', hers ? 'athena' : who), extras, animations, info});
  fs.writeFileSync(out, bytes);
  console.log(JSON.stringify({out, bytes: bytes.length, vertices: fig.count, triangles: fig.indices.length / 3, joints: fig.joints, height: +fig.height.toFixed(3),
    posedHeight: +fig.posedHeight.toFixed(3), floorGap: +fig.floorGap.toFixed(4), scale: +fig.scale.toFixed(5), face, faces: Object.keys(extras), stance: stance ? Object.keys(stance) : [],
    clips: animations.length, channels: animations.reduce((a, b) => a + b.channels.length, 0), ms: Math.round(performance.now() - t0)}));
}

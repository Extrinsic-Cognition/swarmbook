#!/usr/bin/env node
// hades-picture.mjs: PICTURES OF A SKINNED .glb OFF EVERY SCREEN, read from the file itself (the house's law: no window of a seat's on any screen).
// A small software rasteriser in node: it parses the .glb, samples an animation by glTF's own rules (LINEAR: slerp for rotations, lerp for the
// rest; before the first key the first, after the last the last), chains the nodes, skins every vertex (joint matrix = world x inverse bind),
// and draws the textured triangles orthographically with a depth buffer and one light from the camera. So a picture proves what a page would
// see from the same bytes, not what the tool that wrote them meant.
//
//   node hades-picture.mjs <x.glb> --out sheet.png [--cells "bind;rest;00@0;00@0.5;01@0.25"] [--w 256] [--h 384] [--yaw -25]
//   a cell: "bind" (the bind pose: the skin's inverse binds undone), "rest" (the nodes as stored), "<clip name or index>@<fraction of its length>"
// COST: about 4,000 triangles a cell; tens of milliseconds a cell on one core.
import fs from 'node:fs';
import zlib from 'node:zlib';
import {png} from './hades-glb.mjs';

/** {json, bin} of a .glb */
export function parseGlb(b) {
  if (b.toString('latin1', 0, 4) !== 'glTF') throw new Error('not a .glb');
  const n = b.readUInt32LE(12), json = JSON.parse(b.toString('utf8', 20, 20 + n)), bin = b.subarray(28 + n, 28 + n + b.readUInt32LE(20 + n));
  return {json, bin};
}
const SIZE = {SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16};
/** An accessor's numbers as a plain array (tightly packed views only, as hades-glb.mjs writes them). */
export function read({json, bin}, k) {
  const a = json.accessors[k], v = json.bufferViews[a.bufferView], at = (v.byteOffset || 0) + (a.byteOffset || 0), n = a.count * SIZE[a.type];
  const T = {5126: Float32Array, 5123: Uint16Array, 5121: Uint8Array, 5125: Uint32Array}[a.componentType];
  return Array.from(new T(bin.buffer.slice(bin.byteOffset + at, bin.byteOffset + at + n * T.BYTES_PER_ELEMENT)));
}

/* column-vector 4 x 4 as rows of an Array(16) */
const mul = (a, b) => { const o = new Array(16).fill(0); for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) for (let k = 0; k < 4; k++) o[4 * r + c] += a[4 * r + k] * b[4 * k + c]; return o; };
const trs = ([tx, ty, tz] = [0, 0, 0], [x, y, z, w] = [0, 0, 0, 1], [sx, sy, sz] = [1, 1, 1]) => [
  (1 - 2 * (y * y + z * z)) * sx, 2 * (x * y - z * w) * sy, 2 * (x * z + y * w) * sz, tx,
  2 * (x * y + z * w) * sx, (1 - 2 * (x * x + z * z)) * sy, 2 * (y * z - x * w) * sz, ty,
  2 * (x * z - y * w) * sx, 2 * (y * z + x * w) * sy, (1 - 2 * (x * x + y * y)) * sz, tz, 0, 0, 0, 1];
export function slerp(a, b, u) {
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3], s = 1;
  if (d < 0) { d = -d; s = -1; }
  let ka = 1 - u, kb = u * s;
  if (d < 0.9999995) { const th = Math.acos(Math.min(1, d)), sn = Math.sin(th); ka = Math.sin((1 - u) * th) / sn; kb = s * Math.sin(u * th) / sn; }
  const q = [0, 1, 2, 3].map((i) => ka * a[i] + kb * b[i]), l = Math.hypot(...q);
  return q.map((x) => x / l);
}
/** The value of one sampler at time t (seconds), by glTF's LINEAR rule. */
export function sample(times, values, width, t, path) {
  const n = times.length, at = (i) => values.slice(width * i, width * i + width);
  if (t <= times[0] || n === 1) return at(0);
  if (t >= times[n - 1]) return at(n - 1);
  let lo = 0, hi = n - 1;
  while (hi - lo > 1) { const m = (lo + hi) >> 1; if (times[m] <= t) lo = m; else hi = m; }
  const u = (t - times[lo]) / (times[hi] - times[lo]), a = at(lo), b = at(hi);
  return path === 'rotation' ? slerp(a, b, u) : a.map((x, i) => x + (b[i] - x) * u);
}

/** World positions and normals of the skinned primitive in a pose: 'bind', 'rest', or {anim (index or name), at (fraction of its length)}. */
export function pose(g, which) {
  const {json} = g, prim = json.meshes[0].primitives[0], skin = json.skins[0];
  const P = read(g, prim.attributes.POSITION), N = read(g, prim.attributes.NORMAL), J = read(g, prim.attributes.JOINTS_0), W = read(g, prim.attributes.WEIGHTS_0);
  const local = json.nodes.map((n) => ({t: n.translation, r: n.rotation, s: n.scale}));
  if (which && typeof which === 'object') {
    const a = typeof which.anim === 'number' ? json.animations[which.anim] : json.animations.find((x) => x.name === which.anim);
    if (!a) throw new Error(`no animation ${which.anim}`);
    const end = Math.max(...a.samplers.map((s) => json.accessors[s.input].max[0])), t = which.at * end;
    for (const ch of a.channels) {
      const s = a.samplers[ch.sampler], key = {translation: 't', rotation: 'r', scale: 's'}[ch.target.path];
      local[ch.target.node] = {...local[ch.target.node], [key]: sample(read(g, s.input), read(g, s.output), ch.target.path === 'rotation' ? 4 : 3, t, ch.target.path)};
    }
  }
  const parent = [];
  json.nodes.forEach((n, k) => (n.children || []).forEach((c) => { parent[c] = k; }));
  const world = [], of = (k) => world[k] ??= parent[k] === undefined ? trs(local[k].t, local[k].r, local[k].s) : mul(of(parent[k]), trs(local[k].t, local[k].r, local[k].s));
  const ibm = read(g, skin.inverseBindMatrices), joint = skin.joints.map((node, j) => {
    if (which === 'bind') return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    const m = ibm.slice(16 * j, 16 * j + 16), inv = [0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3].map((c) => m[4 * c + r]));   // column-major -> rows
    return mul(of(node), inv);
  });
  const count = P.length / 3, pos = new Float64Array(3 * count), nrm = new Float64Array(3 * count);
  for (let v = 0; v < count; v++) for (let k = 0; k < 4; k++) {
    const w = W[4 * v + k];
    if (!w) continue;
    const m = joint[J[4 * v + k]], [x, y, z] = [P[3 * v], P[3 * v + 1], P[3 * v + 2]], [a, b, c] = [N[3 * v], N[3 * v + 1], N[3 * v + 2]];
    for (let i = 0; i < 3; i++) {
      pos[3 * v + i] += w * (m[4 * i] * x + m[4 * i + 1] * y + m[4 * i + 2] * z + m[4 * i + 3]);
      nrm[3 * v + i] += w * (m[4 * i] * a + m[4 * i + 1] * b + m[4 * i + 2] * c);
    }
  }
  return {pos, nrm, count};
}

/** The texture's RGBA: the first image, a PNG of 8-bit RGBA rows with filter 0 (as hades-glb.mjs writes it). */
export function texture(g) {
  const img = g.json.images[0], v = g.json.bufferViews[img.bufferView], b = g.bin.subarray(v.byteOffset, v.byteOffset + v.byteLength);
  const w = b.readUInt32BE(16), h = b.readUInt32BE(20), idat = [];
  for (let p = 8; p < b.length;) { const n = b.readUInt32BE(p), type = b.toString('latin1', p + 4, p + 8); if (type === 'IDAT') idat.push(b.subarray(p + 8, p + 8 + n)); p += 12 + n; }
  const rows = zlib.inflateSync(Buffer.concat(idat)), rgba = new Uint8Array(w * h * 4);
  for (let y = 0; y < h; y++) { if (rows[(4 * w + 1) * y] !== 0) throw new Error('a PNG row with a filter: not read here'); rgba.set(rows.subarray((4 * w + 1) * y + 1, (4 * w + 1) * (y + 1)), 4 * w * y); }
  return {w, h, rgba};
}

/** One cell: RGBA of w x h, the figure seen from +z turned by yaw degrees about y, fitted to `box` [x0, y0, x1, y1] metres (or its own). */
export function draw(g, posed, {w = 256, h = 384, yaw = -25, box = null, tex = texture(g)} = {}) {
  const {json} = g, idx = read(g, json.meshes[0].primitives[0].indices), uv = read(g, json.meshes[0].primitives[0].attributes.TEXCOORD_0);
  const c = Math.cos(yaw * Math.PI / 180), s = Math.sin(yaw * Math.PI / 180);
  const X = (i) => c * posed.pos[3 * i] + s * posed.pos[3 * i + 2], Z = (i) => -s * posed.pos[3 * i] + c * posed.pos[3 * i + 2], Y = (i) => posed.pos[3 * i + 1];
  let [x0, y0, x1, y1] = box || [Infinity, Infinity, -Infinity, -Infinity];
  if (!box) for (let i = 0; i < posed.count; i++) { x0 = Math.min(x0, X(i)); x1 = Math.max(x1, X(i)); y0 = Math.min(y0, Y(i)); y1 = Math.max(y1, Y(i)); }
  const k = 0.92 * Math.min(w / (x1 - x0), h / (y1 - y0)), ox = w / 2 - k * (x0 + x1) / 2, oy = h / 2 + k * (y0 + y1) / 2;
  const sx = (i) => ox + k * X(i), sy = (i) => oy - k * Y(i);
  const out = new Uint8Array(w * h * 4), depth = new Float64Array(w * h).fill(-Infinity);
  for (let p = 0; p < w * h; p++) out.set([236, 236, 232, 255], 4 * p);
  for (let y = Math.round(oy); y < h; y++) for (let x = 0; x < w; x++) out.set([214, 214, 208, 255], 4 * (y * w + x));   // the floor's line, y = 0
  for (let t = 0; t < idx.length; t += 3) {
    const [a, b, d] = [idx[t], idx[t + 1], idx[t + 2]], A = [sx(a), sy(a)], B = [sx(b), sy(b)], D = [sx(d), sy(d)];
    const area = (B[0] - A[0]) * (D[1] - A[1]) - (B[1] - A[1]) * (D[0] - A[0]);
    if (Math.abs(area) < 1e-12) continue;
    for (let y = Math.max(0, Math.floor(Math.min(A[1], B[1], D[1]))); y <= Math.min(h - 1, Math.ceil(Math.max(A[1], B[1], D[1]))); y++) {
      for (let x = Math.max(0, Math.floor(Math.min(A[0], B[0], D[0]))); x <= Math.min(w - 1, Math.ceil(Math.max(A[0], B[0], D[0]))); x++) {
        const px = x + 0.5, py = y + 0.5;
        const l1 = ((B[0] - px) * (D[1] - py) - (B[1] - py) * (D[0] - px)) / area, l2 = ((D[0] - px) * (A[1] - py) - (D[1] - py) * (A[0] - px)) / area, l3 = 1 - l1 - l2;
        if (l1 < 0 || l2 < 0 || l3 < 0) continue;
        const z = l1 * Z(a) + l2 * Z(b) + l3 * Z(d), p = y * w + x;
        if (z <= depth[p]) continue;
        depth[p] = z;
        const u = l1 * uv[2 * a] + l2 * uv[2 * b] + l3 * uv[2 * d], v = l1 * uv[2 * a + 1] + l2 * uv[2 * b + 1] + l3 * uv[2 * d + 1];
        const tx = Math.min(tex.w - 1, Math.max(0, Math.floor(u * tex.w))), ty = Math.min(tex.h - 1, Math.max(0, Math.floor(v * tex.h))), q = 4 * (ty * tex.w + tx);
        const n = [0, 1, 2].map((i) => l1 * posed.nrm[3 * a + i] + l2 * posed.nrm[3 * b + i] + l3 * posed.nrm[3 * d + i]);
        const lit = 0.45 + 0.55 * Math.abs(-s * n[0] + c * n[2]) / (Math.hypot(...n) || 1);
        out.set([tex.rgba[q] * lit, tex.rgba[q + 1] * lit, tex.rgba[q + 2] * lit, 255], 4 * p);
      }
    }
  }
  return out;
}

/** A sheet of cells side by side, each cell's own frame fitted to one box shared by all (so the sizes compare). */
export function sheet(g, cells, {w = 256, h = 384, yaw = -25} = {}) {
  const poses = cells.map((cell) => {
    if (cell === 'bind' || cell === 'rest') return pose(g, cell);
    const [anim, at] = cell.split('@');
    return pose(g, {anim: /^\d+$/.test(anim) ? Number(anim) : anim, at: Number(at || 0)});
  });
  const c = Math.cos(yaw * Math.PI / 180), s = Math.sin(yaw * Math.PI / 180);
  let box = [Infinity, 0, -Infinity, -Infinity];
  for (const p of poses) for (let i = 0; i < p.count; i++) {
    const x = c * p.pos[3 * i] + s * p.pos[3 * i + 2], y = p.pos[3 * i + 1];
    box = [Math.min(box[0], x), Math.min(box[1], y), Math.max(box[2], x), Math.max(box[3], y)];
  }
  const tex = texture(g), W = w * cells.length, out = new Uint8Array(W * h * 4);
  poses.forEach((p, k) => {
    const cell = draw(g, p, {w, h, yaw, box, tex});
    for (let y = 0; y < h; y++) out.set(cell.subarray(4 * w * y, 4 * w * (y + 1)), 4 * (W * y + w * k));
  });
  return {w: W, h, rgba: out, box};
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
  const file = process.argv[2], out = arg('--out');
  if (!file || !out) { console.error('node hades-picture.mjs <x.glb> --out <sheet.png> [--cells "bind;rest;00@0;00@0.5"] [--w 256] [--h 384] [--yaw -25]'); process.exit(2); }
  const t0 = performance.now(), g = parseGlb(fs.readFileSync(file));
  const cells = String(arg('--cells', 'rest;0@0;0@0.33;0@0.66')).split(';');
  const sh = sheet(g, cells, {w: Number(arg('--w', 256)), h: Number(arg('--h', 384)), yaw: Number(arg('--yaw', -25))});
  fs.writeFileSync(out, png(sh.w, sh.h, sh.rgba));
  console.log(JSON.stringify({out, cells, w: sh.w, h: sh.h, box: sh.box.map((x) => +x.toFixed(3)), ms: Math.round(performance.now() - t0)}));
}

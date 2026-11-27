#!/usr/bin/env node
// cubism.storyboard.mjs: THE TWO OVERLAPS AND THE WAVE, as storyboard frames for his canvas page (tools/storyboard-canvas.mjs). His words,
// Oct 14 2026 16:58 WEST, over the hero at film 32.6 s (relayed verbatim): "this is fucking indecent dude omg... how many fucking times i said
// what needs to happen with 2 overlaps? imagine that seeing athena from that perspective ripples a wave through the fabric of spacetime... you
// get what i mean? you appear once that pov then". With his 16:2x word: "the fucking dodecahedron must be sized down to align with the
// battlefied".
//
// THE READING (frames for him to settle, nothing wired): in her shot (frames 886 to 1005) the stage is her frame (the film's 4:3 picture,
// columns 120 to 840, has the stage's own shape: 1205 x 900 at a 1440 x 900 window) and ONE camera draws everything: the box stands where it
// overlaps the battlefield (the fight measured at 0.31 of the frame's height, centred at (0.28, 0.47); CUBISM.md), and her 3D figure stands
// where its hair overlaps the hair the film draws (an evolution on the silhouettes' IoU, the shot's majority mask). She is not on the page
// before that point of view; at the cut a wave leaves its origin (the point of contact, or her), bends what it passes, sizes the box down to
// the battlefield as it passes the box and lets her appear behind its front. The wave's origin and how far the box sizes down (A, C, B) are
// his to say; the frames show each.
//   nice -n 19 node cubism.storyboard.mjs --out <dir> [--only <regex of frame names>]
//   nice -n 19 node cubism.storyboard.mjs --portal <cubism.proof.mjs --passes lines output> --out <dir>     her portal over the hero's pictures
//   nice -n 19 node cubism.storyboard.mjs --fold 29.8 --out <dir>     THE FOLD flat at the opening pose (his 18:47 WEST), with her joined
//   nice -n 19 node cubism.storyboard.mjs --plane 29.7,30.2,34.2 --out <dir> [--page-light] [--cover above|stage]     THE ONE PLANE (19:1x WEST)
// Writes <dir>/overlap.json (the camera, the box, her pose, its IoU), <dir>/full-*.jpg (1205 x 900), <dir>/f-*.jpg (640 px) and <dir>/plan.json
// (rows from y 5760, for: node tools/storyboard-canvas.mjs <dir>/plan.json --page page-<uuid>). The frames hold the film's frames: not in git.
// COST: once, offline: the fit about 8 s of one core; a frame about 1.8 s of one core (a 2410 x 1800 software render: the film on the box's faces,
// her 3,234 triangles textured and z-buffered, the wave), 18 frames; ffmpeg decodes the shot once. Nothing of it runs on a page.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {registerHooks} from 'node:module';
import zlib from 'node:zlib';
import {fileURLToPath} from 'node:url';
import * as C from './cubism.mjs';
import {hairOf, filmMasks} from './cubism.fit.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MP4 = path.resolve(HERE, '../app/saint-seiya.mp4'), GLB = path.join(HERE, 'athena.hades.glb'), PROCEDURAL = path.resolve(HERE, '../../room/procedural');
export const STAGE = {w: 1205, h: 900};
const K = STAGE.h / 540, X0 = (STAGE.w - 720 * K) / 2;   // the 4:3 picture (film columns 120..840) on the stage
export const CAMERA = {fovDeg: 40, F: (STAGE.h / 2) / Math.tan(20 * Math.PI / 180), cx: STAGE.w / 2, cy: STAGE.h / 2};
export const BATTLEFIELD = {centre: [0.28 * STAGE.w, 0.47 * STAGE.h], height: 0.31};   // CUBISM.md, THE BATTLEFIELD IN HER SHOT
export const BEFORE = {c: [662.6, 450], R: 180};   // the hero's box at a 1440 x 900 window (the proof's geometry)
export const CUT = C.SHOT.from, WAVE_V = 2600;   // the wave's front, stage px a second
const PAGE = [241, 238, 229], LIGHT = [-0.32, 0.7, 0.64].map((v) => v / 1.0017);
const frameOfTime = (t) => Math.floor(t * 30000 / 1001 + 1e-6);

/** Her model (metres) to the camera's space (box radii; the camera at the origin looking down -z), row-major 3x4: her head joint at (x, y, z),
 *  s box radii a metre, cubism.mjs's turn (seen from behind, her up tilted toward the camera by theta, turned psi, rolled phi). */
export function herMatrix(p) {
  const T = C.turnOf(p), H = C.HEAD, M = T.map((r) => r.map((v) => v * p.s));
  const t = [0, 1, 2].map((i) => [p.x, p.y, p.z][i] - (M[i][0] * H[0] + M[i][1] * H[1] + M[i][2] * H[2]));
  return [M[0][0], M[0][1], M[0][2], t[0], M[1][0], M[1][1], M[1][2], t[1], M[2][0], M[2][1], M[2][2], t[2]];
}
const toStage = (q) => [CAMERA.cx + CAMERA.F * q[0] / -q[2], CAMERA.cy - CAMERA.F * q[1] / -q[2]];
const apply3 = (M, a, b, c) => [M[0] * a + M[1] * b + M[2] * c + M[3], M[4] * a + M[5] * b + M[6] * c + M[7], M[8] * a + M[9] * b + M[10] * c + M[11]];

/** The film's hair mask as cells of G px on the stage-as-her-frame. */
function cellsOf(mask, G) {
  const gw = Math.ceil(STAGE.w / G), gh = Math.ceil(STAGE.h / G), out = new Uint8Array(gw * gh);
  for (let j = 0; j < gh; j++) for (let i = 0; i < gw; i++) {
    const fx = Math.round(120 + ((i + .5) * G - X0) / K), fy = Math.round((j + .5) * G / K);
    if (fx >= 120 && fx < 840 && fy >= 0 && fy < 540) out[j * gw + i] = mask[fy * 960 + fx];
  }
  return {out, gw, gh};
}
function iouOf(hair, M, cells, G) {
  const n = hair.pos.length / 3, xy = new Float64Array(n * 2);
  for (let i = 0; i < n; i++) {
    const q = apply3(M, hair.pos[i * 3], hair.pos[i * 3 + 1], hair.pos[i * 3 + 2]);
    if (q[2] > -0.05) return 0;
    const s = toStage(q); xy[i * 2] = s[0] / G; xy[i * 2 + 1] = s[1] / G;
  }
  const m = C.rasterize(xy, hair.tris, {x0: 0, y0: 0, w: cells.gw, h: cells.gh});
  let inter = 0, a = 0, b = 0;
  for (let i = 0; i < m.length; i++) { a += m[i]; b += cells.out[i]; if (m[i] && cells.out[i]) inter++; }
  return inter / (a + b - inter);
}
/** Her pose whose hair overlaps the film's drawn hair best: a (mu/mu, lambda) evolution, each candidate its own step, the elite kept. */
export function overlapFit(hair, mask, {seed = 5, lambda = 32, mu = 8, generations = 90, G = 4} = {}) {
  const B = {x: [0, 2.5], y: [-0.5, 2.0], z: [-6, -0.3], s: [0.3, 2.5], theta: [0.2, 1.3], psi: [-1.2, 1.2], phi: [-0.6, 0.6]}, keys = Object.keys(B);
  const pose = (u) => Object.fromEntries(keys.map((k, i) => [k, B[k][0] + u[i] * (B[k][1] - B[k][0])]));
  const cells = cellsOf(mask, G), r = C.rng(seed), gauss = () => Math.sqrt(-2 * Math.log(r() || 1e-12)) * Math.cos(2 * Math.PI * r());
  const evaluate = (u, sig) => ({u, sig, iou: iouOf(hair, herMatrix(pose(u)), cells, G)});
  let pop = Array.from({length: lambda}, () => evaluate(keys.map(() => r()), 0.2)), best = pop.reduce((a, b) => (b.iou > a.iou ? b : a));
  for (let g = 0; g < generations; g++) {
    pop.sort((a, b) => b.iou - a.iou);
    const par = pop.slice(0, mu), mean = keys.map((_, i) => par.reduce((a, p) => a + p.u[i], 0) / mu), s0 = par.reduce((a, p) => a + Math.log(p.sig), 0) / mu, next = [best];
    while (next.length < lambda) {
      const sig = Math.min(0.5, Math.max(0.003, Math.exp(s0 + 0.3 * gauss()))), from = next.length % 3 ? mean : par[Math.floor(r() * mu)].u;
      next.push(evaluate(from.map((v) => Math.min(1, Math.max(0, v + sig * gauss()))), sig));
    }
    pop = next;
    for (const p of pop) if (p.iou > best.iou) best = p;
  }
  return {pose: pose(best.u), iou: best.iou, iouOn: (m) => iouOf(hair, herMatrix(pose(best.u)), cellsOf(m, G), G)};
}

/** Her whole figure posed as the glb stands, through the hero's own three.js: {pos, uv, tris, tex (512 x 512 RGBA)}. */
export async function figureOf(file) {
  registerHooks({resolve: (s, c, n) => (s === 'three' ? {url: `file://${PROCEDURAL}/three.module.js`, shortCircuit: true} : n(s, c))});
  globalThis.self ??= globalThis;
  globalThis.createImageBitmap ??= async () => ({width: 512, height: 512, close() {}});
  const THREE = await import('three'), {GLTFLoader} = await import(`${PROCEDURAL}/GLTFLoader.js`);
  const bytes = fs.readFileSync(file);
  const gltf = await new Promise((ok, no) => new GLTFLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length), '', ok, no));
  let sk = null; gltf.scene.traverse((o) => { if (o.isSkinnedMesh) sk = o; });
  gltf.scene.updateMatrixWorld(true);
  const n = sk.geometry.attributes.position.count, pos = new Float32Array(n * 3), uv = new Float32Array(n * 2), v = new THREE.Vector3(), U = sk.geometry.attributes.uv;
  for (let i = 0; i < n; i++) { sk.getVertexPosition(i, v); v.applyMatrix4(sk.matrixWorld); pos.set([v.x, v.y, v.z], i * 3); uv.set([U.getX(i), U.getY(i)], i * 2); }
  // the texture: the glb's first picture (PNG), decoded by ffmpeg
  const len = bytes.readUInt32LE(12), json = JSON.parse(bytes.subarray(20, 20 + len).toString()), bin = 20 + len + 8, bv = json.bufferViews[json.images[0].bufferView];
  const png = bytes.subarray(bin + (bv.byteOffset || 0), bin + (bv.byteOffset || 0) + bv.byteLength);
  const tex = execFileSync('ffmpeg', ['-v', 'error', '-i', 'pipe:0', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-'], {input: png, maxBuffer: 1 << 21});
  return {pos, uv, tris: Uint32Array.from(sk.geometry.index.array), tex};
}

/** The film's frames n (a list) decoded once: {n: rgb bytes}. */
function filmFrames(list) {
  const ns = [...new Set(list)].sort((a, b) => a - b), size = 960 * 540 * 3;
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', MP4, '-vf', `select=${ns.map((n) => `eq(n\\,${n})`).join('+')}`, '-fps_mode', 'passthrough', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {maxBuffer: (ns.length + 1) * size});
  return Object.fromEntries(ns.map((n, i) => [n, raw.subarray(i * size, (i + 1) * size)]));
}

/** One frame (see the header): the page's colour, three orbit rings round the box, the box with the film on its faces, her in the one
 *  camera, the film's ghost (optional), the wave's front. o: {t, frame (rgb bytes), wave?: {o, t0}, after?: true | false, R?, her?, ghost?}. */
export function renderFrame(o, {pents, fit, fig, SS = 2}) {
  const W = STAGE.w * SS, H = STAGE.h * SS, img = new Float32Array(W * H * 3), raw = o.frame;
  for (let i = 0; i < W * H; i++) img.set(PAGE, i * 3);
  const film = (fx, fy) => { const x = Math.min(959, Math.max(0, Math.floor(fx))), y = Math.min(539, Math.max(0, Math.floor(fy))), q = (y * 960 + x) * 3; return [raw[q], raw[q + 1], raw[q + 2]]; };
  const put = (x, y, c, a = 1) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const q = (y * W + x) * 3; for (let k = 0; k < 3; k++) img[q + k] = img[q + k] * (1 - a) + c[k] * a; };
  const wave = o.wave, front = wave ? WAVE_V * Math.max(0, o.t - wave.t0) : 0;
  const passed = (x, y) => (!wave ? 1 : Math.min(1, Math.max(0, (front - Math.hypot(x - wave.o[0], y - wave.o[1])) / 60 + 0.5)));
  const bend = (x, y) => {
    if (!wave || front <= 0) return [0, 0];
    const dx = x - wave.o[0], dy = y - wave.o[1], d = Math.hypot(dx, dy) || 1, u = d - front, a = 18 * Math.exp(-((u / 60) ** 2)) * Math.sin(u / 13);
    return [dx / d * a, dy / d * a];
  };
  const after = {c: BATTLEFIELD.centre, R: o.R ?? fit.box.R}, k = o.after === true ? 1 : o.after === false ? 0 : passed(...BEFORE.c), e = k * k * (3 - 2 * k);
  const bc = [BEFORE.c[0] + (after.c[0] - BEFORE.c[0]) * e, BEFORE.c[1] + (after.c[1] - BEFORE.c[1]) * e], bR = BEFORE.R + (after.R - BEFORE.R) * e;
  const spin = {yaw: 21.8 * Math.PI / 180 + 0.12 * Math.max(0, o.t - CUT), pitch: -0.12};
  for (const [rr, tilt, roll, col] of [[1.3, .98, -.2, [132, 111, 63]], [1.58, .36, .26, [103, 120, 102]], [1.44, 1.13, .82, [71, 128, 125]]]) {
    for (let i = 0; i < 2400; i++) {
      const a = i / 2400 * 2 * Math.PI, q = C.project(C.rotate([Math.cos(a) * rr, Math.sin(a) * rr, 0], roll + spin.yaw * .13, tilt), bc, bR), b = bend(...q);
      for (let t = 0; t < SS; t++) put(Math.round((q[0] + b[0]) * SS) + t, Math.round((q[1] + b[1]) * SS), col, 0.35);
    }
  }
  const bb = bend(...bc), boxC = [bc[0] + bb[0], bc[1] + bb[1]];
  const inside = (pt, poly) => { let r = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [x, y] = poly[i], [xx, yy] = poly[j]; if ((y > pt[1]) !== (yy > pt[1]) && pt[0] < (xx - x) * (pt[1] - y) / (yy - y) + x) r = !r; } return r; };
  for (const {f} of pents.map((f) => ({f, z: C.rotate(f.normal, spin.yaw, spin.pitch)[2]})).sort((a, b) => a.z - b.z)) {
    const front = C.facing(f, spin) > -0.02, poly = C.outlineOf(f, spin, boxC, bR).map(([x, y]) => [x * SS, y * SS]), D = C.decalOf(f, spin, boxC, bR);
    const n = C.rotate(f.normal, spin.yaw, spin.pitch), lit = Math.min(1, 0.31 + 0.69 * Math.max(0, n[0] * LIGHT[0] + n[1] * LIGHT[1] + n[2] * LIGHT[2])), sh = (1 - lit) * 0.5;
    const xs = poly.map((p) => p[0]), ys = poly.map((p) => p[1]);
    for (let y = Math.max(0, Math.floor(Math.min(...ys))); y <= Math.min(H - 1, Math.ceil(Math.max(...ys))); y++) for (let x = Math.max(0, Math.floor(Math.min(...xs))); x <= Math.min(W - 1, Math.ceil(Math.max(...xs))); x++) {
      if (!inside([x + .5, y + .5], poly)) continue;
      if (!front) { put(x, y, [91, 109, 88], 0.08); continue; }
      const [u, v] = C.squareAt((x + .5) / SS, (y + .5) / SS, D), c = film(...C.filmOf(Math.max(-1, Math.min(1, u)), Math.max(-1, Math.min(1, v))));
      put(x, y, [c[0] * (1 - sh) + 47 * sh, c[1] * (1 - sh) + 51 * sh, c[2] * (1 - sh) + 40 * sh]);
    }
    if (front) for (let i = 0; i < 5; i++) { const a = poly[i], b = poly[(i + 1) % 5], L = Math.hypot(b[0] - a[0], b[1] - a[1]); for (let s = 0; s < L; s++) put(Math.round(a[0] + (b[0] - a[0]) * s / L), Math.round(a[1] + (b[1] - a[1]) * s / L), [151, 113, 42], 0.74); }
  }
  if (o.her !== false) {
    const M = herMatrix(fit.pose), F = CAMERA.F * SS, CX = CAMERA.cx * SS, CY = CAMERA.cy * SS, n = fig.pos.length / 3, P = new Float64Array(n * 3), zb = new Float32Array(W * H).fill(-1e9);
    for (let i = 0; i < n; i++) P.set(apply3(M, fig.pos[i * 3], fig.pos[i * 3 + 1], fig.pos[i * 3 + 2]), i * 3);
    for (let t = 0; t < fig.tris.length; t += 3) {
      const ids = [fig.tris[t], fig.tris[t + 1], fig.tris[t + 2]], p = ids.map((i) => [P[i * 3], P[i * 3 + 1], P[i * 3 + 2]]);
      if (p.some((q) => q[2] > -0.02)) continue;
      const e1 = [0, 1, 2].map((i) => p[1][i] - p[0][i]), e2 = [0, 1, 2].map((i) => p[2][i] - p[0][i]);
      const nn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]], nl = Math.hypot(...nn) || 1;
      const lit = 0.42 + 0.58 * Math.abs((nn[0] * LIGHT[0] + nn[1] * LIGHT[1] + nn[2] * LIGHT[2]) / nl);
      const s = p.map((q) => [CX + F * q[0] / -q[2], CY - F * q[1] / -q[2], 1 / -q[2]]), uv = ids.map((i) => [fig.uv[i * 2], fig.uv[i * 2 + 1]]);
      const x0 = Math.max(0, Math.floor(Math.min(...s.map((q) => q[0])))), x1 = Math.min(W - 1, Math.ceil(Math.max(...s.map((q) => q[0]))));
      const y0 = Math.max(0, Math.floor(Math.min(...s.map((q) => q[1])))), y1 = Math.min(H - 1, Math.ceil(Math.max(...s.map((q) => q[1]))));
      const area = (s[1][0] - s[0][0]) * (s[2][1] - s[0][1]) - (s[1][1] - s[0][1]) * (s[2][0] - s[0][0]);
      if (Math.abs(area) < 1e-9 || x0 > x1 || y0 > y1) continue;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const px = x + .5, py = y + .5;
        const w0 = ((s[1][0] - px) * (s[2][1] - py) - (s[1][1] - py) * (s[2][0] - px)) / area, w1 = ((s[2][0] - px) * (s[0][1] - py) - (s[2][1] - py) * (s[0][0] - px)) / area, w2 = 1 - w0 - w1;
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;
        const iz = w0 * s[0][2] + w1 * s[1][2] + w2 * s[2][2], q = y * W + x;
        if (-1 / iz < zb[q]) continue;
        zb[q] = -1 / iz;
        const u = (w0 * uv[0][0] * s[0][2] + w1 * uv[1][0] * s[1][2] + w2 * uv[2][0] * s[2][2]) / iz, v = (w0 * uv[0][1] * s[0][2] + w1 * uv[1][1] * s[1][2] + w2 * uv[2][1] * s[2][2]) / iz;
        const c = (Math.min(511, Math.max(0, Math.floor(v * 512))) * 512 + Math.min(511, Math.max(0, Math.floor(u * 512)))) * 4, a = passed(px / SS, py / SS);
        if (a > 0) put(x, y, [fig.tex[c] * lit, fig.tex[c + 1] * lit, fig.tex[c + 2] * lit], a);
      }
    }
  }
  if (o.ghost) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) put(x, y, film(120 + ((x + .5) / SS - X0) / K, (y + .5) / SS / K), o.ghost);
  if (wave && front > 0) for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const d = Math.hypot(x / SS - wave.o[0], y / SS - wave.o[1]) - front, fade = Math.max(0, 1 - front / 1900);
    const a = 0.85 * Math.exp(-((d / 7) ** 2)) * fade + 0.25 * Math.exp(-(((d + 40) / 18) ** 2)) * fade;
    if (a > 0.01) put(x, y, [255, 226, 160], a);
  }
  const buf = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H * 3; i++) buf[i] = Math.max(0, Math.min(255, Math.round(img[i])));
  return {buf, W, H, box: {c: bc, R: bR}, front};
}

/**
 * HIS BIBLE (Oct 14 2026 17:0x WEST, three panels drawn over the hero; panels 1 and 2 are these): "at first the 12hedron starts showing this as
 * normal", "then athena appears perfectly overlapped". The wave at her appearance (his 16:58 "seeing athena from that perspective ripples a
 * wave through the fabric of spacetime... you appear once that pov then"), drawn over the hero's own pictures (cubism.proof.mjs --passes
 * lines): outside the front the page with the box alone, inside it the page with her; the front bends what it passes and draws a warm line.
 * sphere, all: decoded RGBA pictures of one instant ({w, h, rgba}); origin: window px; front: px. Returns RGB bytes.
 */
export function waveOverHero(sphere, all, origin, front) {
  const {w, h} = all, out = Buffer.alloc(w * h * 3);
  const sample = (img, x, y) => { const i = Math.min(w - 1, Math.max(0, Math.round(x))), j = Math.min(h - 1, Math.max(0, Math.round(y))), q = (j * w + i) * 4; return [img.rgba[q], img.rgba[q + 1], img.rgba[q + 2]]; };
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    const dx = x - origin[0], dy = y - origin[1], d = Math.hypot(dx, dy) || 1, u = d - front, a = front > 0 ? 18 * Math.exp(-((u / 60) ** 2)) * Math.sin(u / 13) : 0;
    const sx = x + dx / d * a, sy = y + dy / d * a, k = Math.min(1, Math.max(0, (front - Math.hypot(sx - origin[0], sy - origin[1])) / 60 + 0.5));
    const c0 = sample(sphere, sx, sy), c1 = sample(all, sx, sy), fade = Math.max(0, 1 - front / 1900);
    const glow = front > 0 ? (0.85 * Math.exp(-((u / 7) ** 2)) + 0.25 * Math.exp(-(((u + 40) / 18) ** 2))) * fade : 0;
    for (let c = 0; c < 3; c++) { const v = c0[c] * (1 - k) + c1[c] * k; out[(y * w + x) * 3 + c] = Math.round(v * (1 - glow) + [255, 226, 160][c] * glow); }
  }
  return out;
}
/** Her head joint on the window, from cubism.mjs's FIT on the face it picks, for the wave's origin. stage: {left, top, centre, R}; spin: the sphere's. */
export function headOnWindow(pents, spin, stage) {
  const face = pents[C.chooseFace(pents, spin)], M = C.place(C.FIT, face, spin).matrix;
  const v = [0, 1, 2].map((i) => M[i * 4] * C.HEAD[0] + M[i * 4 + 1] * C.HEAD[1] + M[i * 4 + 2] * C.HEAD[2] + M[i * 4 + 3]), [x, y] = C.project(v, stage.centre, stage.R);
  return [stage.left + x, stage.top + y];
}

/**
 * HER PORTAL (his 17:19 WEST: "the "FRAME" AKA "WINDOW INTO THE SCENE" should expand outwards from the alignment of athena hair... athena is
 * basically opening up this portal into spacetiem and then SHE IS ALSO CLOSING IT BY WALL OF LIGHT AIOLOS"), over the hero's own pictures of
 * one instant (cubism.proof.mjs --passes lines): outside the window the page as drawn; inside it the film's picture (columns 82 to 877), seen
 * through the joined face's own picture plane at the opening (decal D0, so the film's hair runs on under hers) zoomed by z about the join; the
 * box (its front faces' outlines) and her (the page with her against the page without) stay in front. The window's front glows while it
 * opens; from Aiolos a wall of light runs out from her and leaves white behind it. Returns RGB bytes.
 */
const {PORTAL, portalWindow} = C;   // her portal's timing lives in cubism.mjs (a page imports it)
export {PORTAL, portalWindow};
export function portalOverHero({all, sphere, film, t, origin, D0, boxOutlines, reach, zFull}) {
  const W = all.w, H = all.h, out = Buffer.alloc(W * H * 3), box = new Uint8Array(W * H), U0 = (82 - 480) / 270, U1 = (878 - 480) / 270;
  const inside = (pt, poly) => { let r = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [x, y] = poly[i], [xx, yy] = poly[j]; if ((y > pt[1]) !== (yy > pt[1]) && pt[0] < (xx - x) * (pt[1] - y) / (yy - y) + x) r = !r; } return r; };
  for (const p of boxOutlines) {
    const xs = p.map((v) => v[0]), ys = p.map((v) => v[1]);
    for (let y = Math.max(0, Math.floor(Math.min(...ys)) - 2); y <= Math.min(H - 1, Math.ceil(Math.max(...ys)) + 2); y++) for (let x = Math.max(0, Math.floor(Math.min(...xs)) - 2); x <= Math.min(W - 1, Math.ceil(Math.max(...xs)) + 2); x++) if (inside([x + .5, y + .5], p)) box[y * W + x] = 1;
  }
  const w = portalWindow(t, reach, zFull);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const q = (y * W + x) * 4, o = (y * W + x) * 3, d = Math.hypot(x - origin[0], y - origin[1]);
    let col = [all.rgba[q], all.rgba[q + 1], all.rgba[q + 2]];
    const her = Math.abs(all.rgba[q] - sphere.rgba[q]) + Math.abs(all.rgba[q + 1] - sphere.rgba[q + 1]) + Math.abs(all.rgba[q + 2] - sphere.rgba[q + 2]) > 36;
    if (w.r > 0 && d < w.r && d > w.wall && !her && !box[y * W + x]) {
      const [u, v] = C.squareAt(origin[0] + (x - origin[0]) / w.z, origin[1] + (y - origin[1]) / w.z, D0);
      if (u >= U0 && u <= U1 && Math.abs(v) <= 1) {
        const p = (Math.min(539, Math.max(0, Math.floor(270 + v * 270))) * 960 + Math.min(877, Math.max(82, Math.floor(480 + u * 270)))) * 3, edge = Math.min(1, Math.max(0, (w.r - d) / 24));
        col = col.map((c, k) => c * (1 - edge) + film[p + k] * edge);
      }
    }
    if (t < PORTAL.grown && w.r > 0) { const a = 0.8 * Math.exp(-(((d - w.r) / 6) ** 2)) * (t < PORTAL.waveEnd + 0.3 ? 1 : 0.35); col = col.map((c, k) => c * (1 - a) + [255, 226, 160][k] * a); }
    if (w.wall >= 0) { const a = Math.min(1, 1.1 * Math.exp(-(((d - w.wall) / 40) ** 2))); col = col.map((c, k) => c * (1 - a) + [255, 247, 225][k] * a); }
    for (let k = 0; k < 3; k++) out[o + k] = Math.round(col[k]);
  }
  return {buf: out, ...w};
}
// THE PROOFS OF RETIRED LAWS (Nov 2 2026): cubism.proof.mjs, which made the capture folders this road reads and held this PNG reader, is retired (her 3D
// figure in the lead-in off for everyone since 61409e169); the reader lives here now, the captures it made stay readable
// a PNG as RGBA (Chrome's screenshots: 8 bits, RGB or RGBA, not interlaced)
export function decodePng(buf) {
  let o = 8, w = 0, h = 0, type = 0;
  const idat = [];
  while (o < buf.length) {
    const len = buf.readUInt32BE(o), kind = buf.toString('latin1', o + 4, o + 8), data = buf.subarray(o + 8, o + 8 + len);
    if (kind === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); type = data[9]; if (data[8] !== 8 || data[12] !== 0) throw new Error('a PNG this reader does not read'); }
    if (kind === 'IDAT') idat.push(data);
    o += 12 + len;
  }
  const ch = type === 6 ? 4 : type === 2 ? 3 : 0;
  if (!ch) throw new Error(`PNG colour type ${type}`);
  const raw = zlib.inflateSync(Buffer.concat(idat)), stride = w * ch, out = new Uint8Array(w * h * 4), prev = new Uint8Array(stride), cur = new Uint8Array(stride);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], row = raw.subarray(y * (stride + 1) + 1, (y + 1) * (stride + 1));
    for (let x = 0; x < stride; x++) {
      const a = x >= ch ? cur[x - ch] : 0, b = prev[x], c = x >= ch ? prev[x - ch] : 0;
      const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c);
      cur[x] = (row[x] + (f === 0 ? 0 : f === 1 ? a : f === 2 ? b : f === 3 ? (a + b) >> 1 : pa <= pb && pa <= pc ? a : pb <= pc ? b : c)) & 255;
    }
    for (let x = 0; x < w; x++) for (let k = 0; k < 4; k++) out[(y * w + x) * 4 + k] = k < ch ? cur[x * ch + k] : 255;
    prev.set(cur);
  }
  return {w, h, rgba: out};
}
/** The portal's frames from a capture folder (the retired cubism.proof.mjs --passes lines --seconds 29.763,...): p-<second>.jpg (640 px) into out. */
export async function portalFrames(cap, out) {
  const {buildAssemblySkin} = await import('../app/assembly-geometry.js'), pents = buildAssemblySkin(0).pents;
  const inst = JSON.parse(fs.readFileSync(path.join(cap, 'cubism.proof.json'), 'utf8')).passes[0].instants;
  const first = inst.find((i) => Math.abs(i.second - PORTAL.open) < 1e-6) ?? inst[0], g = first.canvas, spin0 = {yaw: first.yawDeg * Math.PI / 180, pitch: first.pitch};
  const origin = headOnWindow(pents, spin0, {left: g[0], top: g[1], centre: first.centre, R: first.R});
  const D0 = C.decalOf(pents[C.chooseFace(pents, spin0)], spin0, [g[0] + first.centre[0], g[1] + first.centre[1]], first.R);
  const U0 = (82 - 480) / 270, U1 = (878 - 480) / 270, inF = (x, y, z) => { const [u, v] = C.squareAt(origin[0] + (x - origin[0]) / z, origin[1] + (y - origin[1]) / z, D0); return u >= U0 && u <= U1 && Math.abs(v) <= 1; };
  // the picture ends just right of her head (the film cuts her there too): the zoom fills the window's left and its whole height at the join
  let zFull = 1; while (![[0, 0], [0, 899], [Math.round(origin[0]), 0], [Math.round(origin[0]), 899]].every(([x, y]) => inF(x, y, zFull)) && zFull < 20) zFull += 0.05;
  const reach = Math.max(...[[0, 0], [1440, 0], [0, 900], [1440, 900]].map(([x, y]) => Math.hypot(x - origin[0], y - origin[1]))), film = filmFrames(inst.map((i) => frameOfTime(i.second)));
  const rows = [];
  for (const i of inst) {
    const all = decodePng(fs.readFileSync(path.join(cap, i.pictures.all))), sphere = decodePng(fs.readFileSync(path.join(cap, i.pictures.sphere)));
    const spin = {yaw: i.yawDeg * Math.PI / 180, pitch: i.pitch}, c = [i.canvas[0] + i.centre[0], i.canvas[1] + i.centre[1]];
    const boxOutlines = i.second >= 37.1 ? [] : pents.filter((f) => C.facing(f, spin) > -0.02).map((f) => C.outlineOf(f, spin, c, i.R));   // from 37.10 s the theater's burst has the sphere's place
    const r = portalOverHero({all, sphere, film: film[frameOfTime(i.second)], t: i.second, origin, D0, boxOutlines, reach, zFull});
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${all.w}x${all.h}`, '-i', 'pipe:0', '-vf', 'scale=640:-2:flags=area', '-q:v', '4', path.join(out, `p-${i.second.toFixed(3)}.jpg`)], {input: r.buf});
    rows.push([i.second, Math.round(r.r), +r.z.toFixed(2), Math.round(r.wall)]);
  }
  return {origin, zFull, reach, rows};
}

/**
 * THE FOLD, FLAT (his 18:47 WEST): the page's stage at the opening pose with the box unfolded onto the plane of the face she joins (cubism.mjs
 * foldTree, foldPose at 1), every face showing its part of the one picture (each pixel's eye ray met with her face's plane, the point read by
 * pictureOf: exact, not the decal's affine), the gold hairlines, and her 3D figure where herAt puts her, cut out of her face as the page cuts
 * her. ghost: the whole picture plane at that opacity under the net (the net drawn over the film's frame). Returns {buf, W, H, root, tree}.
 */
export function renderFold({t, frame, pents, fig, spin = {yaw: 21.8 * Math.PI / 180, pitch: -0.12}, centre = [662.6, 450], R = 180, ghost = 0, SS = 2, zoom = null}) {
  const W = STAGE.w * SS, H = STAGE.h * SS, img = new Float32Array(W * H * 3), raw = frame, EYE = C.EYE;
  for (let i = 0; i < W * H; i++) img.set(PAGE, i * 3);
  const put = (x, y, c, a = 1) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const q = (y * W + x) * 3; for (let k = 0; k < 3; k++) img[q + k] = img[q + k] * (1 - a) + c[k] * a; };
  const film = (fx, fy) => { const x = Math.min(877, Math.max(82, Math.floor(fx))), y = Math.min(539, Math.max(0, Math.floor(fy))), q = (y * 960 + x) * 3; return [raw[q], raw[q + 1], raw[q + 2]]; };
  const root = C.chooseFace(pents, spin), tree = C.foldTree(pents, root), poses = C.foldPose(pents, tree, pents.map(() => 1), 'out'), rf = C.frameOf(pents[root]);
  const apply = (M, q) => [M[0] * q[0] + M[1] * q[1] + M[2] * q[2] + M[3], M[4] * q[0] + M[5] * q[1] + M[6] * q[2] + M[7], M[8] * q[0] + M[9] * q[1] + M[10] * q[2] + M[11]];
  const unrotate = (q, yaw, pitch) => {   // rotate()'s inverse: undo the pitch, then the yaw
    const cp = Math.cos(pitch), sp = Math.sin(pitch), y1 = q[1] * cp + q[2] * sp, z1 = -q[1] * sp + q[2] * cp, c = Math.cos(yaw), s = Math.sin(yaw);
    return [q[0] * c + z1 * s, y1, -q[0] * s + z1 * c];
  };
  const n = C.rotate(rf.n, spin.yaw, spin.pitch), Cv = C.rotate(rf.C, spin.yaw, spin.pitch), E = [0, 0, EYE];
  const join = C.joinOnFace(pents, spin, t, root), z = zoom ?? C.coverZoom(pents, tree, join);
  const uvAt = (xs, ys) => {   // the stage pixel's eye ray met with her face's plane, read as the one picture
    const P0 = [(xs - centre[0]) / R, -(ys - centre[1]) / R, 0], d = [P0[0] - E[0], P0[1] - E[1], P0[2] - E[2]], den = n[0] * d[0] + n[1] * d[1] + n[2] * d[2];
    if (Math.abs(den) < 1e-9) return null;
    const k = (n[0] * (Cv[0] - E[0]) + n[1] * (Cv[1] - E[1]) + n[2] * (Cv[2] - E[2])) / den;
    if (k <= 0) return null;
    return C.pictureOf(pents[root], unrotate([E[0] + k * d[0], E[1] + k * d[1], E[2] + k * d[2]], spin.yaw, spin.pitch), {join, z});
  };
  const U0 = (82 - 480) / 270, U1 = (878 - 480) / 270;
  const polys = pents.map((f, i) => f.verts.map((q) => C.project(C.rotate(apply(poses[i], q), spin.yaw, spin.pitch), centre, R).map((v) => v * SS)));
  const inside = (pt, poly) => { let r = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [x, y] = poly[i], [xx, yy] = poly[j]; if ((y > pt[1]) !== (yy > pt[1]) && pt[0] < (xx - x) * (pt[1] - y) / (yy - y) + x) r = !r; } return r; };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const onNet = polys.some((poly) => inside([x + .5, y + .5], poly));
    if (!onNet && !ghost) continue;
    const pic = uvAt((x + .5) / SS, (y + .5) / SS);
    if (!pic || pic.u < U0 || pic.u > U1 || Math.abs(pic.v) > 1) continue;
    put(x, y, film(pic.fx, pic.fy), onNet ? 1 : ghost);
  }
  for (const poly of polys) for (let i = 0; i < poly.length; i++) { const a = poly[i], b = poly[(i + 1) % poly.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); for (let k = 0; k < L; k++) put(Math.round(a[0] + (b[0] - a[0]) * k / L), Math.round(a[1] + (b[1] - a[1]) * k / L), [151, 113, 42], 0.8); }
  // her, through the page's projection, cut out of her face (the page's herClip)
  const keep = {}, on = C.herAt(t, pents, spin, keep), M = on.matrix, rootPoly = polys[root];
  const P = new Float64Array(fig.pos.length), zb = new Float32Array(W * H).fill(-1e9), Lg = [-0.32, 0.7, 0.64].map((v) => v / 1.0017);
  for (let i = 0; i < fig.pos.length / 3; i++) P.set(apply(M, [fig.pos[i * 3], fig.pos[i * 3 + 1], fig.pos[i * 3 + 2]]), i * 3);
  for (let tr = 0; tr < fig.tris.length; tr += 3) {
    const ids = [fig.tris[tr], fig.tris[tr + 1], fig.tris[tr + 2]], pp = ids.map((i) => [P[i * 3], P[i * 3 + 1], P[i * 3 + 2]]);
    if (pp.some((q) => q[2] > EYE - 0.05)) continue;
    const e1 = [0, 1, 2].map((i) => pp[1][i] - pp[0][i]), e2 = [0, 1, 2].map((i) => pp[2][i] - pp[0][i]);
    const nn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]], nl = Math.hypot(...nn) || 1;
    const lit = 0.42 + 0.58 * Math.abs((nn[0] * Lg[0] + nn[1] * Lg[1] + nn[2] * Lg[2]) / nl);
    const sc = pp.map((q) => { const k = R * EYE / (EYE - q[2]); return [(centre[0] + q[0] * k) * SS, (centre[1] - q[1] * k) * SS, 1 / (EYE - q[2])]; }), uv = ids.map((i) => [fig.uv[i * 2], fig.uv[i * 2 + 1]]);
    const x0 = Math.max(0, Math.floor(Math.min(...sc.map((q) => q[0])))), x1 = Math.min(W - 1, Math.ceil(Math.max(...sc.map((q) => q[0]))));
    const y0 = Math.max(0, Math.floor(Math.min(...sc.map((q) => q[1])))), y1 = Math.min(H - 1, Math.ceil(Math.max(...sc.map((q) => q[1]))));
    const area = (sc[1][0] - sc[0][0]) * (sc[2][1] - sc[0][1]) - (sc[1][1] - sc[0][1]) * (sc[2][0] - sc[0][0]);
    if (Math.abs(area) < 1e-9 || x0 > x1 || y0 > y1) continue;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const px = x + .5, py = y + .5;
      const w0 = ((sc[1][0] - px) * (sc[2][1] - py) - (sc[1][1] - py) * (sc[2][0] - px)) / area, w1 = ((sc[2][0] - px) * (sc[0][1] - py) - (sc[2][1] - py) * (sc[0][0] - px)) / area, w2 = 1 - w0 - w1;
      if (w0 < 0 || w1 < 0 || w2 < 0) continue;
      const iz = w0 * sc[0][2] + w1 * sc[1][2] + w2 * sc[2][2], q = y * W + x;
      if (iz < zb[q]) continue;   // nearer the eye: a larger 1/(EYE - z)
      if (inside([px, py], rootPoly)) continue;   // her face cuts her
      zb[q] = iz;
      const u = (w0 * uv[0][0] * sc[0][2] + w1 * uv[1][0] * sc[1][2] + w2 * uv[2][0] * sc[2][2]) / iz, v = (w0 * uv[0][1] * sc[0][2] + w1 * uv[1][1] * sc[1][2] + w2 * uv[2][1] * sc[2][2]) / iz;
      const c = (Math.min(511, Math.max(0, Math.floor(v * 512))) * 512 + Math.min(511, Math.max(0, Math.floor(u * 512)))) * 4;
      put(x, y, [fig.tex[c] * lit, fig.tex[c + 1] * lit, fig.tex[c + 2] * lit]);
    }
  }
  const buf = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H * 3; i++) buf[i] = Math.max(0, Math.min(255, Math.round(img[i])));
  return {buf, W, H, root: pents[root].id, tree, join, z};
}

/**
 * THE ONE PLANE (his 19:0x WEST, and 19:1x: "you have the chance to turn the entire background black there... make it fucking immersive... we
 * saw her fold the dodechadron lik a fukin origami") at second t, as the page draws it once the box seat wires cubism.mjs: the page black from
 * the fold (29.563 s) to the wall of light; the box folding IN onto her face, far side first, flat at 30.2 s, each face a window onto her
 * plane's picture (the eye's ray met with her plane, pictureAtRay) with gold edges while it folds; from 29.763 s the window in her plane, open
 * from her hair's join and growing to the stage's reach (planeWindowAt); her figure on ONE PLANE (herAt onePlane: the face and the pose of her
 * cut, the sphere's pose held), cut by her face and in front of her plane's picture everywhere else (the picture is the page's background:
 * depth-tested against it, what of her is behind her tilted plane fell into black holes, the frames of 19:3x WEST), lit by the film's light
 * (filmLightAt, filmLit: smooth normals, the gold at her edge); from Aiolos the wall of light, white behind it. her: 'kept' | 'hidden' (in her
 * face shot only). light: false draws her in the page's light instead (the storyboard renderer's flat light) for comparison.
 */
export function renderPlane({t, frame, pents, fig, spin = {yaw: 21.8 * Math.PI / 180, pitch: -0.12}, centre = [662.6, 450], R = 180, her = 'kept', light = true, cover = 'above', SS = 2}) {
  const W = STAGE.w * SS, H = STAGE.h * SS, img = new Float32Array(W * H * 3), raw = frame, EYE = C.EYE, E = [0, 0, EYE];
  const dark = t >= C.FOLD.start && t < C.PORTAL.closed;
  for (let i = 0; i < W * H; i++) img.set(dark ? [0, 0, 0] : PAGE, i * 3);
  const put = (x, y, c, a = 1) => { if (x < 0 || y < 0 || x >= W || y >= H) return; const q = (y * W + x) * 3; for (let k = 0; k < 3; k++) img[q + k] = img[q + k] * (1 - a) + c[k] * a; };
  const film = (fx, fy) => { const x = Math.min(877, Math.max(82, Math.floor(fx))), y = Math.min(539, Math.max(0, Math.floor(fy))), q = (y * 960 + x) * 3; return [raw[q], raw[q + 1], raw[q + 2]]; };
  const at4 = (M, q) => [M[0] * q[0] + M[1] * q[1] + M[2] * q[2] + M[3], M[4] * q[0] + M[5] * q[1] + M[6] * q[2] + M[7], M[8] * q[0] + M[9] * q[1] + M[10] * q[2] + M[11]];
  // her face, her plane, her hair's join (read once at her cut, in her first shot) and the window at t
  const root = C.chooseFace(pents, spin), tree = C.foldTree(pents, root), {ks, poses} = C.fold(pents, root, t, 'in', tree);
  const plane = C.herPlane(pents[root], spin), join = C.joinOnFace(pents, spin, C.FOLD.start + 0.05, root);
  const geom = C.planeWindowGeometry(plane, join, centre, R, STAGE.w, STAGE.h, {cover}), win = C.planeWindowAt(t, geom);
  const polys = pents.map((f, i) => f.verts.map((q) => C.project(C.rotate(at4(poses[i], q), spin.yaw, spin.pitch), centre, R).map((v) => v * SS)));
  const inside = (pt, poly) => { let r = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [x, y] = poly[i], [xx, yy] = poly[j]; if ((y > pt[1]) !== (yy > pt[1]) && pt[0] < (xx - x) * (pt[1] - y) / (yy - y) + x) r = !r; } return r; };
  const boxes = polys.map((poly) => [Math.min(...poly.map((q) => q[0])), Math.max(...poly.map((q) => q[0])), Math.min(...poly.map((q) => q[1])), Math.max(...poly.map((q) => q[1]))]);
  const WALL = [255, 247, 225];
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const xs = (x + .5) / SS, ys = (y + .5) / SS, pic = C.pictureAtRay([(xs - centre[0]) / R, -(ys - centre[1]) / R, 0], plane, {join, z: win.z});
    if (!pic) continue;
    const d = Math.hypot(pic.u0 - join[0], pic.v0 - join[1]), walled = win.wall >= 0 && d < win.wall;
    const onFace = !walled && polys.some((poly, i) => x + .5 >= boxes[i][0] && x + .5 <= boxes[i][1] && y + .5 >= boxes[i][2] && y + .5 <= boxes[i][3] && inside([x + .5, y + .5], poly));
    const inWindow = !walled && win.r > 0 && d <= win.r;
    if (walled) put(x, y, PAGE);
    else if ((onFace || inWindow) && pic.fx >= 82 && pic.fx < 878 && pic.fy >= 0 && pic.fy < 540) put(x, y, film(pic.fx, pic.fy));
    if (win.wall >= 0) { const a = Math.exp(-(((d - win.wall) / 0.18) ** 2)); if (a > 0.01) put(x, y, WALL, a); }
  }
  // the origami: while the faces fold (her own face never turns: its amount stays 0), each catches the page's light by its own tilt, back
  // to front, and its edges are gold; flat, the dodecahedron is gone and her plane's picture is bare
  const folding = ks.some((k, i) => i !== root && k < 1);
  if (folding) {
    const order = pents.map((f, i) => ({i, z: C.rotate(at4(poses[i], f.center), spin.yaw, spin.pitch)[2]})).sort((a, b) => a.z - b.z);
    for (const {i} of order) {
      const f = pents[i], n0 = C.rotate([0, 1, 2].map((k) => poses[i][k * 4] * f.normal[0] + poses[i][k * 4 + 1] * f.normal[1] + poses[i][k * 4 + 2] * f.normal[2]), spin.yaw, spin.pitch);
      const lit = 0.55 + 0.45 * Math.max(0, n0[0] * LIGHT[0] + n0[1] * LIGHT[1] + n0[2] * LIGHT[2]), shade = i === root ? 1 : 1 - (1 - lit) * (1 - ks[i]);
      const [bx0, bx1, by0, by1] = boxes[i], poly = polys[i];
      for (let y = Math.max(0, Math.floor(by0)); y <= Math.min(H - 1, Math.ceil(by1)); y++) for (let x = Math.max(0, Math.floor(bx0)); x <= Math.min(W - 1, Math.ceil(bx1)); x++) {
        if (!inside([x + .5, y + .5], poly)) continue;
        const pic = C.pictureAtRay([((x + .5) / SS - centre[0]) / R, -((y + .5) / SS - centre[1]) / R, 0], plane, {join, z: win.z});
        if (!pic || !(pic.fx >= 82 && pic.fx < 878 && pic.fy >= 0 && pic.fy < 540)) { put(x, y, [0, 0, 0]); continue; }
        put(x, y, film(pic.fx, pic.fy).map((v) => v * shade));
      }
    }
    for (const [i, poly] of polys.entries()) { if (i === root && !folding) continue; for (let e = 0; e < poly.length; e++) { const a = poly[e], b = poly[(e + 1) % poly.length], L = Math.hypot(b[0] - a[0], b[1] - a[1]); for (let k = 0; k < L; k++) put(Math.round(a[0] + (b[0] - a[0]) * k / L), Math.round(a[1] + (b[1] - a[1]) * k / L), [214, 170, 82], 0.85); } }
  }
  // her, on one plane
  const shot = C.shotOf(t), on = C.herAt(t, pents, spin, {}, C.FITS, {onePlane: true, faceShot: her}), L = C.filmLightAt(t);
  if (on) {
    const M = on.matrix, rootPoly = polys[root], n = fig.pos.length / 3, P = new Float64Array(n * 3), N = new Float64Array(n * 3), zb = new Float32Array(W * H).fill(-1e9);
    for (let i = 0; i < n; i++) P.set(at4(M, [fig.pos[i * 3], fig.pos[i * 3 + 1], fig.pos[i * 3 + 2]]), i * 3);
    for (let t3 = 0; t3 < fig.tris.length; t3 += 3) {   // smooth normals, view space: the triangles' area-weighted normals at each corner
      const [a, b, c] = [fig.tris[t3], fig.tris[t3 + 1], fig.tris[t3 + 2]], e1 = [0, 1, 2].map((k) => P[b * 3 + k] - P[a * 3 + k]), e2 = [0, 1, 2].map((k) => P[c * 3 + k] - P[a * 3 + k]);
      const nn = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      for (const v of [a, b, c]) for (let k = 0; k < 3; k++) N[v * 3 + k] += nn[k];
    }
    for (let i = 0; i < n; i++) { const l = Math.hypot(N[i * 3], N[i * 3 + 1], N[i * 3 + 2]) || 1; for (let k = 0; k < 3; k++) N[i * 3 + k] /= l; }
    const lin = (c) => { const x = c / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }, enc = (x) => 255 * (x <= 0.0031308 ? 12.92 * x : 1.055 * Math.max(0, x) ** (1 / 2.4) - 0.055);
    for (let tr = 0; tr < fig.tris.length; tr += 3) {
      const ids = [fig.tris[tr], fig.tris[tr + 1], fig.tris[tr + 2]], pp = ids.map((i) => [P[i * 3], P[i * 3 + 1], P[i * 3 + 2]]);
      if (pp.some((q) => q[2] > EYE - 0.05)) continue;
      const sc = pp.map((q) => { const k = R * EYE / (EYE - q[2]); return [(centre[0] + q[0] * k) * SS, (centre[1] - q[1] * k) * SS, 1 / (EYE - q[2])]; }), uv = ids.map((i) => [fig.uv[i * 2], fig.uv[i * 2 + 1]]);
      const x0 = Math.max(0, Math.floor(Math.min(...sc.map((q) => q[0])))), x1 = Math.min(W - 1, Math.ceil(Math.max(...sc.map((q) => q[0]))));
      const y0 = Math.max(0, Math.floor(Math.min(...sc.map((q) => q[1])))), y1 = Math.min(H - 1, Math.ceil(Math.max(...sc.map((q) => q[1]))));
      const area = (sc[1][0] - sc[0][0]) * (sc[2][1] - sc[0][1]) - (sc[1][1] - sc[0][1]) * (sc[2][0] - sc[0][0]);
      if (Math.abs(area) < 1e-9 || x0 > x1 || y0 > y1) continue;
      for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
        const px = x + .5, py = y + .5;
        const w0 = ((sc[1][0] - px) * (sc[2][1] - py) - (sc[1][1] - py) * (sc[2][0] - px)) / area, w1 = ((sc[2][0] - px) * (sc[0][1] - py) - (sc[2][1] - py) * (sc[0][0] - px)) / area, w2 = 1 - w0 - w1;
        if (w0 < 0 || w1 < 0 || w2 < 0) continue;
        const iz = w0 * sc[0][2] + w1 * sc[1][2] + w2 * sc[2][2], q = y * W + x;
        if (iz < zb[q]) continue;   // nearer the eye: a larger 1/(EYE - z)
        if (inside([px, py], rootPoly)) continue;   // her face cuts her (herClip)
        const bw = [w0 * sc[0][2] / iz, w1 * sc[1][2] / iz, w2 * sc[2][2] / iz], pf = [0, 1, 2].map((k) => bw[0] * pp[0][k] + bw[1] * pp[1][k] + bw[2] * pp[2][k]);
        zb[q] = iz;
        const u = bw[0] * uv[0][0] + bw[1] * uv[1][0] + bw[2] * uv[2][0], v = bw[0] * uv[0][1] + bw[1] * uv[1][1] + bw[2] * uv[2][1];
        const c = (Math.min(511, Math.max(0, Math.floor(v * 512))) * 512 + Math.min(511, Math.max(0, Math.floor(u * 512)))) * 4;
        let nrm = [0, 1, 2].map((k) => bw[0] * N[ids[0] * 3 + k] + bw[1] * N[ids[1] * 3 + k] + bw[2] * N[ids[2] * 3 + k]);
        const nl = Math.hypot(...nrm) || 1, view = [E[0] - pf[0], E[1] - pf[1], E[2] - pf[2]], vl = Math.hypot(...view);
        nrm = nrm.map((x) => x / nl); const vv = view.map((x) => x / vl);
        if (nrm[0] * vv[0] + nrm[1] * vv[1] + nrm[2] * vv[2] < 0) nrm = nrm.map((x) => -x);   // double-sided
        const albedo = [lin(fig.tex[c]), lin(fig.tex[c + 1]), lin(fig.tex[c + 2])];
        const out = light && L ? C.filmLit(albedo, nrm, vv, L) : albedo.map((a) => a * (0.42 + 0.58 * Math.abs(nrm[0] * LIGHT[0] + nrm[1] * LIGHT[1] + nrm[2] * LIGHT[2])));
        put(x, y, out.map(enc));
      }
    }
  }
  const buf = Buffer.alloc(W * H * 3);
  for (let i = 0; i < W * H * 3; i++) buf[i] = Math.max(0, Math.min(255, Math.round(img[i])));
  return {buf, W, H, root: pents[root].id, join, geom, win, shot, her: on ? on.face : null, light: L && {gain: +L.gain.toFixed(3), lift: +L.lift.toFixed(3), tone: L.tone.map((v) => +v.toFixed(3)), rim: L.rim.map((v) => +v.toFixed(3)), rimWidth: +L.rimWidth.toFixed(3)}};
}

// the storyboard: [name, options, the canvas's time and caption]
const CONTACT = {o: BEFORE.c, t0: CUT}, HER = {o: [983, 300], t0: CUT};
export const FRAMES = [
  ['a1-29.400', {t: 29.4, after: false, her: false}], ['a2-29.563', {t: CUT, wave: CONTACT}], ['a3-29.650', {t: 29.65, wave: CONTACT}],
  ['a4-29.750', {t: 29.75, wave: CONTACT}], ['a5-29.900', {t: 29.9, wave: CONTACT}], ['a6-30.200', {t: 30.2, wave: CONTACT}],
  ['b2-29.563', {t: CUT, wave: HER}], ['b3-29.650', {t: 29.65, wave: HER}], ['b4-29.750', {t: 29.75, wave: HER}], ['b5-29.900', {t: 29.9, wave: HER}],
  ['c1-31.000', {t: 31.0, after: true}], ['c2-32.000', {t: 32.0, after: true}], ['c3-33.000', {t: 33.0, after: true}], ['c4-33.500', {t: 33.5, after: true}],
  ['c5-31.000-ghost', {t: 31.0, after: true, ghost: 0.35}],
  ['d1-A-140', {t: 31.0, after: true, R: 140}], ['d2-C-54', {t: 31.0, after: true, R: 54}], ['d3-B-20', {t: 31.0, after: true, R: 20}],
];

/** The canvas plan (tools/storyboard-canvas.mjs): four rows from y 5760 and the two questions, as posted Oct 14 2026 17:14 WEST (seq 280258). */
export const PLAN = {"rows": [{"id": "cubism-wave-contact", "y": 5760, "title": "Her point of view at the cut (29.563 s): the wave from the point of contact. The box sizes down to the battlefield as the wave passes it; she appears behind its front", "frames": [{"file": "f-a1-29.400.jpg", "time": "29.400 s", "caption": "before the cut: the box is the sphere of attention, the two-shot on its faces; she is not on the page"}, {"file": "f-a2-29.563.jpg", "time": "29.563 s, the cut", "caption": "her shot on the faces; the wave leaves the point of contact"}, {"file": "f-a3-29.650.jpg", "time": "29.650 s", "caption": "the front has passed the box: it is the battlefield now"}, {"file": "f-a4-29.750.jpg", "time": "29.750 s", "caption": "the front reaches her: she appears behind it"}, {"file": "f-a5-29.900.jpg", "time": "29.900 s", "caption": "her point of view: the two overlaps"}, {"file": "f-a6-30.200.jpg", "time": "30.200 s", "caption": "still: nothing moves but the film on the faces"}]}, {"id": "cubism-wave-her", "y": 6200, "title": "The same cut, the wave from her: she appears first, the box sizes down when the front reaches it", "frames": [{"file": "f-a1-29.400.jpg", "time": "29.400 s", "caption": "before the cut"}, {"file": "f-b2-29.563.jpg", "time": "29.563 s, the cut", "caption": "the wave leaves her head"}, {"file": "f-b3-29.650.jpg", "time": "29.650 s", "caption": "she appears inside the front"}, {"file": "f-b4-29.750.jpg", "time": "29.750 s", "caption": "the front passes the box: it sizes down"}, {"file": "f-b5-29.900.jpg", "time": "29.900 s", "caption": "her point of view"}]}, {"id": "cubism-her-shot", "y": 6640, "title": "Through her shot (to the cut at 33.567 s): one camera for the box and for her; the last frame shows the film under it", "frames": [{"file": "f-c1-31.000.jpg", "time": "31.000 s"}, {"file": "f-c2-32.000.jpg", "time": "32.000 s"}, {"file": "f-c3-33.000.jpg", "time": "33.000 s"}, {"file": "f-c4-33.500.jpg", "time": "33.500 s", "caption": "the last frames before her face"}, {"file": "f-c5-31.000-ghost.jpg", "time": "31.000 s, the film at 35 % under it", "caption": "her 3D hair over the drawn hair (IoU 0.81); the box over the battlefield"}]}, {"id": "cubism-box-size", "y": 7080, "title": "How far the box sizes down (31.000 s, the same camera)", "frames": [{"file": "f-d1-A-140.jpg", "time": "A: radius 140 px (0.78)", "caption": "the box as tall as the battlefield in the frame (0.31 of it)"}, {"file": "f-d2-C-54.jpg", "time": "C: radius 54 px (0.30)", "caption": "the fight's share of the frame, 0.31 against the two-shot's 1.0"}, {"file": "f-d3-B-20.jpg", "time": "B: radius 20 px (0.11)", "caption": "the fight's own metres, 0.06 to 0.15 of the two-shot's"}]}], "notes": [{"id": "cubism-questions", "xywh": [0, 7470, 1100, 230], "text": "Two questions these frames cannot settle:\n1. Where does the wave start: at the point of contact (the sphere of attention, first row) or at her (second row)?\n2. How far does the box size down: A, C or B (last row)?\nMeasured: the battlefield is 0.31 of her frame's height, centred at (0.28, 0.47); her hair's head from x 0.71, crown at y 0.095. One camera (40 deg over the 4:3 stage) puts the box over the battlefield and her 3D hair over the drawn hair (IoU 0.81, 0.71 to 0.74 frame by frame: the film's hair streams in the wind, the game's hangs). The wave is a candidate: 2,600 px a second, it runs only while the film plays. Nothing is wired on the hero."}]};

async function main() {
  const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const OUT = opt('--out'), only = opt('--only') ? new RegExp(opt('--only')) : null;
  if (!OUT) throw new Error('usage: cubism.storyboard.mjs --out <dir> [--only <regex>] | --portal <captures> --out <dir>');
  fs.mkdirSync(OUT, {recursive: true});
  if (opt('--portal')) { const r = await portalFrames(opt('--portal'), OUT); return console.log(JSON.stringify({origin: r.origin.map(Math.round), zFull: +r.zFull.toFixed(2), reach: Math.round(r.reach), rows: r.rows})); }
  if (opt('--plane')) {   // THE ONE PLANE at the seconds given (comma-separated), her kept and hidden in her face shot, in the film's light
    const ts = opt('--plane').split(',').map(Number), {buildAssemblySkin} = await import('../app/assembly-geometry.js'), pents = buildAssemblySkin(0).pents, fig = await figureOf(GLB);
    const film = filmFrames(ts.map(frameOfTime)), out = [];
    const cover = opt('--cover', 'above');
    for (const t of ts) for (const her of C.shotOf(t) === 1 ? ['kept', 'hidden'] : ['kept']) for (const light of args.includes('--page-light') ? [true, false] : [true]) {
      const t0 = performance.now(), r = renderPlane({t, frame: film[frameOfTime(t)], pents, fig, her, light, cover}), name = `plane-${t.toFixed(3)}-${her}${light ? '' : '-pagelight'}${cover === 'above' ? '' : `-${cover}`}`;
      const full = path.join(OUT, `full-${name}.jpg`);
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${r.W}x${r.H}`, '-i', 'pipe:0', '-vf', `scale=${STAGE.w}:${STAGE.h}:flags=area`, '-q:v', '3', full], {input: r.buf});
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', full, '-vf', 'scale=640:-2:flags=area', '-q:v', '4', path.join(OUT, `f-${name}.jpg`)]);
      out.push({name, ms: Math.round(performance.now() - t0), root: r.root, her: r.her, shot: r.shot, join: r.join.map((v) => +v.toFixed(3)), at: r.geom.at.map(Math.round), zFull: +r.geom.zFull.toFixed(2), reach: +r.geom.reach.toFixed(2), win: {r: +r.win.r.toFixed(2), z: +r.win.z.toFixed(2), wall: +r.win.wall.toFixed(2)}, light: r.light});
    }
    return console.log(JSON.stringify(out));
  }
  if (opt('--fold')) {   // THE FOLD, flat, at the opening pose: the net on white and the net over the whole picture plane
    const t = Number(opt('--fold')), {buildAssemblySkin} = await import('../app/assembly-geometry.js'), pents = buildAssemblySkin(0).pents, fig = await figureOf(GLB);
    const frame = filmFrames([frameOfTime(t)])[frameOfTime(t)], out = {};
    for (const [name, ghost, zoom] of [['net', 0, null], ['net-over-film', 0.35, null], ['net-face-scale', 0.35, 1]]) {
      const t0 = performance.now(), r = renderFold({t, frame, pents, fig, ghost, zoom}), file = path.join(OUT, `fold-${name}-${t.toFixed(3)}.jpg`);
      execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${r.W}x${r.H}`, '-i', 'pipe:0', '-vf', `scale=${STAGE.w}:${STAGE.h}:flags=area`, '-q:v', '3', file], {input: r.buf});
      out[name] = {file: path.basename(file), ms: Math.round(performance.now() - t0), root: r.root, reach: +r.tree.reach.toFixed(3), join: r.join.map((v) => +v.toFixed(3)), z: +r.z.toFixed(2), parents: r.tree.faces.map((f) => f.parent)};
    }
    return console.log(JSON.stringify(out));
  }
  const t0 = performance.now(), {buildAssemblySkin} = await import('../app/assembly-geometry.js'), pents = buildAssemblySkin(0).pents;
  const hair = await hairOf(GLB), masks = filmMasks(MP4, C.SHOT.frames[0], C.SHOT.frames[1]), mask = C.majority(Object.values(masks));
  const D = CAMERA.F / 140, box = [(BATTLEFIELD.centre[0] - CAMERA.cx) / CAMERA.F * D, (CAMERA.cy - BATTLEFIELD.centre[1]) / CAMERA.F * D, -D];
  const of = overlapFit(hair, mask), perFrame = Object.entries(masks).filter(([n]) => n % 10 === 0).map(([, m]) => +of.iouOn(m).toFixed(3));
  const fit = {camera: CAMERA, stage: STAGE, box: {centre: BATTLEFIELD.centre, R: 140, at: box}, pose: Object.fromEntries(Object.entries(of.pose).map(([k, v]) => [k, +v.toFixed(4)])),
    iou: +of.iou.toFixed(3), perFrameIoU: perFrame, fitMs: Math.round(performance.now() - t0)};
  fs.writeFileSync(path.join(OUT, 'overlap.json'), JSON.stringify(fit, null, 1));
  fs.writeFileSync(path.join(OUT, 'plan.json'), JSON.stringify(PLAN, null, 1));
  console.log(`the overlap: IoU ${fit.iou} (frame by frame ${Math.min(...perFrame)} to ${Math.max(...perFrame)}), ${fit.fitMs} ms`);
  const fig = await figureOf(GLB), todo = FRAMES.filter(([name]) => !only || only.test(name)), film = filmFrames(todo.map(([, o]) => frameOfTime(o.t)));
  for (const [name, o] of todo) {
    const t1 = performance.now(), r = renderFrame({...o, frame: film[frameOfTime(o.t)]}, {pents, fit, fig}), full = path.join(OUT, `full-${name}.jpg`);
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${r.W}x${r.H}`, '-i', 'pipe:0', '-vf', `scale=${STAGE.w}:${STAGE.h}:flags=area`, '-q:v', '3', full], {input: r.buf});
    execFileSync('ffmpeg', ['-v', 'error', '-y', '-i', full, '-vf', 'scale=640:-2:flags=area', '-q:v', '4', path.join(OUT, `f-${name}.jpg`)]);
    console.log(`${name}: ${Math.round(performance.now() - t1)} ms, box R ${r.box.R.toFixed(0)} at (${r.box.c.map((v) => v.toFixed(0)).join(', ')}), the front ${r.front.toFixed(0)} px`);
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

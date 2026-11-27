#!/usr/bin/env node
// cloth-segment.mjs: THE CLOTH'S PIECES CUT OUT OF THE FILM, each drawn piece of each drawing as a mask, the reference the twelve 3D pieces are
// fitted against (tools/cloth-fit.mjs). His words, Oct 18 2026 WEST, over the first match sheet (3D pieces placed from four numbers read by eye):
// "dude you havent matched shit"; "these are approximate vomit shits; these are not precised segmented properly segmented".
// HOW A PIECE IS CUT: the frame (the picture alone, 796 x 532) is cut into cells that follow the drawing's own edges: a marker watershed on the
// colour gradient (the largest RGB channel's Sobel of the frame smoothed by a 3 x 3 box) from markers every CELL px, each put on the lowest
// gradient of its neighbourhood, so a cell never crosses an ink line or a fill's edge where the drawing has one. Each drawn piece has a polygon
// (lab/cloth-reading.js, read by eye round the piece on a grid of fortieths); the polygon is only a guide to within BAND px. The cells well inside
// it (all of them more than BAND px in) seed the piece; the cells well outside every polygon seed the rest of the picture; the cells in the band
// between go, one by one, to the side across the weakest boundary (a seeded watershed on the cells' graph, each boundary as strong as the mean
// gradient along it), so the piece's outline lands on the strongest drawn edge in the band: its ink line, or its gold against the space. A piece
// takes a cell in the band only when the cell's mean colour is the cloth's (gold or its shading: hue 28 to 72 degrees, saturation 0.45 or more,
// value 0.12 or more; or the leg shots' dark navy and green), never the glare, the space, the lightning, his skin or clothes or the backdrop's
// khaki; a piece drawn inside the glare (`all`) takes any. Where the drawing has no edge in the band (a tube's dark inside against the dark
// space, a pale blade inside the glare: every boundary of the cell under WEAK), the polygon decides. Then its holes are filled (a tube's dark
// inside, the lightning across it) and its crumbs dropped.
// COST: a frame's cells in about 0.3 s (one core); a piece's mask in milliseconds. Run on the new Mac, niced. The masks are not in git (the film's
// frames are not the house's to publish); the fit's poses and numbers are.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

export const W = 796, H = 532, CELL = 6, BAND = 12, WEAK = 14;
const decode = async (args) => {
  const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], {stdio: ['ignore', 'pipe', 'inherit']});
  const c = []; for await (const x of ff.stdout) c.push(x);
  const code = await new Promise((r) => ff.on('close', r)); if (code !== 0) throw new Error(`ffmpeg ended ${code}`);
  return Buffer.concat(c);
};
/** A frame of the film, the picture alone, RGB 796 x 532. */
export const frameOf = (film, n) => decode(['-i', film, '-an', '-fps_mode', 'passthrough', '-vf', `select='eq(n\\,${n})',crop=796:532:82:4,format=rgb24`, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']);
export const save = (buf, w, h, file) => new Promise((res, rej) => {
  const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', `${w}x${h}`, '-i', '-', '-frames:v', '1', file], {stdio: ['pipe', 'inherit', 'inherit']});
  ff.on('close', (c) => (c ? rej(new Error(`ffmpeg ${c}`)) : res())); ff.stdin.end(buf);
});

/** The colour gradient, 0 to 255 a pixel. */
export function gradient(rgb) {
  const sm = new Float32Array(W * H * 3);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) for (let c = 0; c < 3; c++) {
    let s = 0, n = 0; for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { const xx = x + dx, yy = y + dy; if (xx < 0 || yy < 0 || xx >= W || yy >= H) continue; s += rgb[3 * (yy * W + xx) + c]; n++; }
    sm[3 * (y * W + x) + c] = s / n;
  }
  const g = new Uint8Array(W * H);
  for (let y = 1; y < H - 1; y++) for (let x = 1; x < W - 1; x++) {
    let best = 0;
    for (let c = 0; c < 3; c++) {
      const p = (dx, dy) => sm[3 * ((y + dy) * W + x + dx) + c];
      const gx = p(1, -1) + 2 * p(1, 0) + p(1, 1) - p(-1, -1) - 2 * p(-1, 0) - p(-1, 1), gy = p(-1, 1) + 2 * p(0, 1) + p(1, 1) - p(-1, -1) - 2 * p(0, -1) - p(1, -1);
      best = Math.max(best, Math.hypot(gx, gy) / 4);
    }
    g[y * W + x] = Math.min(255, Math.round(best));
  }
  return g;
}
/** Meyer's flooding from markers (a label a pixel, 0 none), a bucket queue on the gradient. */
export function watershed(g, markers) {
  const lab = Int32Array.from(markers), buckets = Array.from({length: 256}, () => []);
  const push = (o, l, level) => buckets[Math.max(level, g[o])].push(o, l);
  for (let o = 0; o < W * H; o++) if (lab[o] > 0) { const x = o % W; for (const p of [x > 0 ? o - 1 : -1, x < W - 1 ? o + 1 : -1, o - W, o + W]) if (p >= 0 && p < W * H && !lab[p]) push(p, lab[o], 0); }
  for (let level = 0; level < 256; level++) {
    const b = buckets[level];
    for (let i = 0; i < b.length; i += 2) {
      const o = b[i], l = b[i + 1]; if (lab[o]) continue; lab[o] = l;
      const x = o % W; for (const p of [x > 0 ? o - 1 : -1, x < W - 1 ? o + 1 : -1, o - W, o + W]) if (p >= 0 && p < W * H && !lab[p]) push(p, l, level);
    }
    b.length = 0;
  }
  return lab;
}
/** The frame's cells: {label (a cell id a pixel, from 1), cells: [{n, rgb: mean, hsv}]}. */
export function cellsOf(rgb) {
  const g = gradient(rgb), markers = new Int32Array(W * H); let k = 0;
  for (let cy = CELL >> 1; cy < H; cy += CELL) for (let cx = CELL >> 1; cx < W; cx += CELL) {
    let best = cy * W + cx;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) { const x = cx + dx, y = cy + dy; if (x < 0 || y < 0 || x >= W || y >= H) continue; if (g[y * W + x] < g[best]) best = y * W + x; }
    markers[best] = ++k;
  }
  const label = watershed(g, markers), sum = Array.from({length: k + 1}, () => [0, 0, 0, 0]);
  for (let o = 0; o < W * H; o++) { const s = sum[label[o]]; s[0] += rgb[3 * o]; s[1] += rgb[3 * o + 1]; s[2] += rgb[3 * o + 2]; s[3]++; }
  const cells = sum.map(([r, gg, b, n]) => { if (!n) return {n: 0, rgb: [0, 0, 0], hsv: [0, 0, 0]}; const m = [r / n, gg / n, b / n]; return {n, rgb: m, hsv: hsv(...m)}; });
  return {label, cells, gradient: g};
}
export function hsv(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), v = max / 255, s = max ? (max - min) / max : 0;
  let h = 0; if (max !== min) h = max === r ? 60 * (((g - b) / (max - min)) % 6) : max === g ? 60 * ((b - r) / (max - min) + 2) : 60 * ((r - g) / (max - min) + 4);
  return [(h + 360) % 360, s, v];
}
/** Whether a cell's mean colour is the cloth's (see the header). */
export function isCloth({rgb: [r, g, b], hsv: [h, s, v]}, {legs = false} = {}) {
  if (v > .86 && s < .4) return false;                        // the glare, the lightning
  if (h >= 28 && h <= 72 && s >= .45 && v >= .12) return true;  // the gold and its shading
  if (legs && v <= .5 && v >= .06 && (b > r + 6 || (g > r + 4 && g > b))) return true;   // the leg shots' dark navy and green (in the burst: the space)
  return false;
}
/** A polygon's inside (a byte a pixel) by the even-odd rule; the polygon in picture fractions. */
export function polygonMask(poly) {
  const P = poly.map(([u, v]) => [u * W, v * H]), m = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) {
    const xs = []; for (let i = 0; i < P.length; i++) { const [ax, ay] = P[i], [bx, by] = P[(i + 1) % P.length]; if ((ay <= y + .5) !== (by <= y + .5)) xs.push(ax + (y + .5 - ay) / (by - ay) * (bx - ax)); }
    xs.sort((a, b) => a - b);
    for (let k = 0; k + 1 < xs.length; k += 2) for (let x = Math.max(0, Math.ceil(xs[k] - .5)); x <= Math.min(W - 1, Math.floor(xs[k + 1] - .5)); x++) m[y * W + x] = 1;
  }
  return m;
}
/** Chamfer distance (3-4, in px x 3) from every pixel to the nearest pixel where `m` is not `inside`; Int32 a pixel. */
function distanceTo(m, inside) {
  const INF = 1 << 28, d = new Int32Array(W * H);
  for (let o = 0; o < W * H; o++) d[o] = m[o] === inside ? INF : 0;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = y * W + x; if (!d[o]) continue; let v = d[o];
    if (x > 0) v = Math.min(v, d[o - 1] + 3); if (y > 0) { v = Math.min(v, d[o - W] + 3); if (x > 0) v = Math.min(v, d[o - W - 1] + 4); if (x < W - 1) v = Math.min(v, d[o - W + 1] + 4); } d[o] = v; }
  for (let y = H - 1; y >= 0; y--) for (let x = W - 1; x >= 0; x--) { const o = y * W + x; if (!d[o]) continue; let v = d[o];
    if (x < W - 1) v = Math.min(v, d[o + 1] + 3); if (y < H - 1) { v = Math.min(v, d[o + W] + 3); if (x < W - 1) v = Math.min(v, d[o + W + 1] + 4); if (x > 0) v = Math.min(v, d[o + W - 1] + 4); } d[o] = v; }
  return d;
}
/** The cells' graph: per cell its neighbours and the strength of each shared boundary (the mean of the gradient's larger side along it). */
function graphOf({label, cells, gradient: g}) {
  const sum = new Map(), key = (a, b) => (a < b ? a * 65536 + b : b * 65536 + a);
  const add = (o, p) => { const a = label[o], b = label[p]; if (a === b) return; const k = key(a, b), v = Math.max(g[o], g[p]), e = sum.get(k); if (e) { e[0] += v; e[1]++; } else sum.set(k, [v, 1]); };
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = y * W + x; if (x < W - 1) add(o, o + 1); if (y < H - 1) add(o, o + W); }
  const nb = cells.map(() => []);
  for (const [k, [v, n]] of sum) { const a = Math.floor(k / 65536), b = k % 65536; nb[a].push([b, v / n]); nb[b].push([a, v / n]); }
  return nb;
}
/** Every piece's mask in one frame: entries [{poly, all} | null] (in PIECES' order); returns a mask (or null) a piece. */
export function segmentPieces(frameCells, entries, {band = BAND, legs = false} = {}) {
  const {label, cells} = frameCells, C = cells.length, B3 = band * 3, nb = graphOf(frameCells);
  const polys = entries.map((e) => (e ? polygonMask(e.poly ?? e) : null));
  // per cell and piece: how many pixels are deep inside (core) and inside the band's outer edge (zone); and how many are outside every zone
  const core = entries.map(() => new Int32Array(C)), zone = entries.map(() => new Int32Array(C)), outside = new Int32Array(C);
  const zoneAny = new Uint8Array(W * H);
  polys.forEach((m, k) => {
    // a thin piece's band is at most half its own half-width, so its middle still seeds it
    if (!m) return; const din = distanceTo(m, 1), dout = distanceTo(m, 0); let deepest = 0; for (let o = 0; o < W * H; o++) if (din[o] > deepest && din[o] < 1 << 27) deepest = din[o];
    const b3 = Math.min(B3, deepest >> 1);
    for (let o = 0; o < W * H; o++) { if (m[o] && din[o] > b3) core[k][label[o]]++; if (m[o] || dout[o] <= b3) { zone[k][label[o]]++; zoneAny[o] = 1; } }
  });
  for (let o = 0; o < W * H; o++) if (!zoneAny[o]) outside[label[o]]++;
  const BG = 1, lab = new Int32Array(C), cloth = cells.map((c) => c.n > 0 && isCloth(c, {legs}));
  for (let i = 1; i < C; i++) {
    if (!cells[i].n) continue;
    if (outside[i] * 2 > cells[i].n) { lab[i] = BG; continue; }
    for (let k = 0; k < entries.length; k++) if (entries[k] && core[k][i] * 2 > cells[i].n && (cloth[i] || entries[k].all)) { lab[i] = k + 2; break; }
  }
  // the flood over the band, weakest boundary first (a binary heap of [strength, cell, label])
  const heap = [], push = (v, c, l) => { heap.push([v, c, l]); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
  const pop = () => { const top = heap[0], last = heap.pop(); if (heap.length) { heap[0] = last; let i = 0; for (;;) { const l = 2 * i + 1, r = l + 1; let m = i; if (l < heap.length && heap[l][0] < heap[m][0]) m = l; if (r < heap.length && heap[r][0] < heap[m][0]) m = r; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return top; };
  const may = (c, l) => l === BG || (zone[l - 2][c] * 2 > cells[c].n && (cloth[c] || entries[l - 2].all || core[l - 2][c] * 2 > cells[c].n));
  for (let i = 1; i < C; i++) if (lab[i]) for (const [j, v] of nb[i]) if (!lab[j]) push(v, j, lab[i]);
  while (heap.length) { const [v, c, l] = pop(); if (lab[c] || !may(c, l)) continue; lab[c] = l; for (const [j, w] of nb[c]) if (!lab[j]) push(Math.max(v, w), j, l); }
  // where the drawing has no edge: a band cell whose every boundary with a cell of another label is weak takes the polygon's side (twice)
  const inPoly = entries.map((e, k) => { if (!e) return null; const n = new Int32Array(C); for (let o = 0; o < W * H; o++) if (polys[k][o]) n[label[o]]++; return n; });
  for (let pass = 0; pass < 2; pass++) for (let i = 1; i < C; i++) {
    if (!cells[i].n || outside[i] * 2 > cells[i].n) continue;
    let strong = false, other = false; for (const [j, w] of nb[i]) if (lab[j] !== lab[i]) { other = true; if (w >= WEAK) strong = true; }
    if (!other || strong) continue;
    let want = BG; for (let k = 0; k < entries.length; k++) if (entries[k] && inPoly[k][i] * 2 > cells[i].n && (cloth[i] || entries[k].all || core[k][i] * 2 > cells[i].n)) { want = k + 2; break; }
    lab[i] = want;
  }
  return entries.map((e, k) => {
    if (!e) return null;
    const m = new Uint8Array(W * H); for (let o = 0; o < W * H; o++) m[o] = lab[label[o]] === k + 2 ? 1 : 0;
    return tidy(smooth(smooth(m)));
  });
}
/** A mask smoothed by the majority of each pixel's 5 x 5 (13 of 25): the cells' few-pixel steps go, a drawn edge moves a pixel at most. */
export function smooth(m) {
  const row = new Int32Array(W * H), out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) { let s = 0; for (let x = -2; x < W + 2; x++) { if (x + 2 < W && x + 2 >= 0) s += m[y * W + x + 2]; if (x - 3 >= 0) s -= m[y * W + x - 3]; if (x >= 0 && x < W) row[y * W + x] = s; } }
  for (let x = 0; x < W; x++) { let s = 0; for (let y = -2; y < H + 2; y++) { if (y + 2 < H && y + 2 >= 0) s += row[(y + 2) * W + x]; if (y - 3 >= 0) s -= row[(y - 3) * W + x]; if (y >= 0 && y < H) out[y * W + x] = s >= 13 ? 1 : 0; } }
  return out;
}
/** A mask's holes filled (parts of the rest enclosed by it, touching no border) and its crumbs (parts under a fiftieth of it) dropped. */
export function tidy(m) {
  const seen = new Uint8Array(W * H);
  for (let o0 = 0; o0 < W * H; o0++) {
    if (m[o0] || seen[o0]) continue;
    const st = [o0], part = []; seen[o0] = 1; let open = false;
    while (st.length) { const o = st.pop(); part.push(o); const x = o % W, y = (o - x) / W; if (x === 0 || y === 0 || x === W - 1 || y === H - 1) open = true;
      for (const p of [x > 0 ? o - 1 : -1, x < W - 1 ? o + 1 : -1, o - W, o + W]) if (p >= 0 && p < W * H && !m[p] && !seen[p]) { seen[p] = 1; st.push(p); } }
    if (!open && part.length < W * H / 8) for (const o of part) m[o] = 1;
  }
  const lab = new Int32Array(W * H), sizes = [0]; let k = 0;
  for (let o0 = 0; o0 < W * H; o0++) { if (!m[o0] || lab[o0]) continue; k++; let n = 0; const st = [o0]; lab[o0] = k;
    while (st.length) { const o = st.pop(); n++; const x = o % W; for (const p of [x > 0 ? o - 1 : -1, x < W - 1 ? o + 1 : -1, o - W, o + W]) if (p >= 0 && p < W * H && m[p] && !lab[p]) { lab[p] = k; st.push(p); } }
    sizes.push(n); }
  const total = sizes.reduce((a, b) => a + b, 0);
  for (let o = 0; o < W * H; o++) if (m[o] && sizes[lab[o]] < total / 50) m[o] = 0;
  return m;
}

const COLOURS = [[255, 60, 60], [255, 150, 0], [255, 240, 40], [70, 230, 70], [40, 210, 230], [70, 100, 255], [190, 70, 255], [255, 70, 210], [255, 255, 255], [150, 255, 200], [0, 160, 120], [200, 120, 60]];
/** The picture of a frame's masks: the frame | each mask tinted in its piece's colour with its outline, the polygons as thin lines. */
export function overlay(rgb, masks, polys) {
  const pic = Buffer.from(rgb);
  masks.forEach((m, k) => {
    if (!m) return; const c = COLOURS[k];
    for (let o = 0; o < W * H; o++) {
      if (!m[o]) continue; const x = o % W;
      const edge = (x > 0 && !m[o - 1]) || (x < W - 1 && !m[o + 1]) || (o >= W && !m[o - W]) || (o < W * (H - 1) && !m[o + W]);
      pic.set(edge ? c : c.map((v, i) => Math.round(v * .4 + rgb[3 * o + i] * .6)), 3 * o);
    }
  });
  polys.forEach((poly, k) => {
    if (!poly) return; const c = COLOURS[k].map((v) => v >> 1);
    for (let i = 0; i < poly.length; i++) { const [au, av] = poly[i], [bu, bv] = poly[(i + 1) % poly.length], steps = Math.ceil(Math.hypot((bu - au) * W, (bv - av) * H));
      for (let s = 0; s <= steps; s++) { const x = Math.round((au + (bu - au) * s / steps) * W), y = Math.round((av + (bv - av) * s / steps) * H); if (x >= 0 && y >= 0 && x < W && y < H && s % 3 === 0) pic.set(c, 3 * (y * W + x)); } }
  });
  const both = Buffer.alloc(W * H * 6);
  for (let y = 0; y < H; y++) { rgb.copy(both, y * W * 6, y * W * 3, (y + 1) * W * 3); pic.copy(both, y * W * 6 + W * 3, y * W * 3, (y + 1) * W * 3); }
  return both;
}

/** The frame at twice its size with a grid to read polygons on: a line every fortieth, a stronger one every twentieth, a yellow one every tenth
 *  with its digit at the four borders (u across, v down); the polygons and the masks' outlines, thin, in their pieces' colours. */
const FONT = {0: '111101101101111', 1: '010110010010111', 2: '111001111100111', 3: '111001111001111', 4: '101101111001001', 5: '111100111001111', 6: '111100111101111', 7: '111001001001001', 8: '111101111101111', 9: '111101111001111'};
export function gridPicture(rgb, polys = [], masks = []) {
  const Z = 2, GW = W * Z, GH = H * Z, pic = Buffer.alloc(GW * GH * 3);
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) { const o = (y >> 1) * W + (x >> 1); pic.set([rgb[3 * o], rgb[3 * o + 1], rgb[3 * o + 2]], 3 * (y * GW + x)); }
  const dot = (x, y, c, a = 1) => { if (x < 0 || y < 0 || x >= GW || y >= GH) return; const o = 3 * (y * GW + x); for (let i = 0; i < 3; i++) pic[o + i] = Math.round(pic[o + i] * (1 - a) + c[i] * a); };
  for (let k = 1; k < 40; k++) {
    const tenth = k % 4 === 0, twentieth = k % 2 === 0, c = tenth ? [255, 230, 0] : [0, 230, 255], a = tenth ? .8 : twentieth ? .45 : .22;
    const gx = Math.round(k / 40 * GW), gy = Math.round(k / 40 * GH);
    for (let y = 0; y < GH; y++) if (tenth || y % 2 === 0) dot(gx, y, c, a);
    for (let x = 0; x < GW; x++) if (tenth || x % 2 === 0) dot(x, gy, c, a);
  }
  const glyph = (d, x0, y0) => { const f = FONT[d]; for (let r = 0; r < 5; r++) for (let q = 0; q < 3; q++) if (f[r * 3 + q] === '1') for (let dy = 0; dy < 3; dy++) for (let dx = 0; dx < 3; dx++) dot(x0 + q * 3 + dx, y0 + r * 3 + dy, [255, 255, 255]); };
  for (let k = 1; k < 10; k++) { const gx = Math.round(k / 10 * GW), gy = Math.round(k / 10 * GH); glyph(k, gx + 3, 3); glyph(k, gx + 3, GH - 18); glyph(k, 3, gy + 3); glyph(k, GW - 12, gy + 3); }
  polys.forEach((poly, k) => { if (!poly) return; const c = COLOURS[k];
    for (let i = 0; i < poly.length; i++) { const [au, av] = poly[i], [bu, bv] = poly[(i + 1) % poly.length], steps = Math.ceil(Math.hypot((bu - au) * GW, (bv - av) * GH));
      for (let s = 0; s <= steps; s += 2) dot(Math.round((au + (bu - au) * s / steps) * GW), Math.round((av + (bv - av) * s / steps) * GH), c); } });
  masks.forEach((m, k) => { if (!m) return; const c = COLOURS[k];
    for (let o = 0; o < W * H; o++) { if (!m[o]) continue; const x = o % W, edge = (x > 0 && !m[o - 1]) || (x < W - 1 && !m[o + 1]) || (o >= W && !m[o - W]) || (o < W * (H - 1) && !m[o + W]);
      if (edge) { const y = (o - x) / W; dot(2 * x, 2 * y, c, .9); dot(2 * x + 1, 2 * y + 1, c, .9); } } });
  return {pic, w: GW, h: GH};
}

/** One sheet of a drawing's pieces, each in its own cell: the film cropped round the piece's mask (its box and a margin), the mask's outside
 *  dimmed to a third, its outline drawn; cells CELL_PX square, tiled four across. */
export function pieceSheet(rgb, masks, names, {cellPx = 300, across = 4} = {}) {
  const rows = Math.ceil(masks.length / across), SW = across * cellPx, SH = rows * (cellPx + 14), pic = Buffer.alloc(SW * SH * 3, 24);
  masks.forEach((m, k) => {
    let x0 = W, x1 = 0, y0 = H, y1 = 0; for (let o = 0; o < W * H; o++) if (m[o]) { const x = o % W, y = (o - x) / W; x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
    if (x1 < x0) return;
    const side = Math.max(x1 - x0, y1 - y0) + 24, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2, sc = side / cellPx, ox = (k % across) * cellPx, oy = Math.floor(k / across) * (cellPx + 14) + 14;
    for (let y = 0; y < cellPx; y++) for (let x = 0; x < cellPx; x++) {
      const fx = Math.floor(cx - side / 2 + x * sc), fy = Math.floor(cy - side / 2 + y * sc), q = 3 * ((oy + y) * SW + ox + x);
      if (fx < 0 || fy < 0 || fx >= W || fy >= H) { pic.set([60, 0, 60], q); continue; }
      const o = fy * W + fx, inside = m[o], edge = inside && ((fx > 0 && !m[o - 1]) || (fx < W - 1 && !m[o + 1]) || (fy > 0 && !m[o - W]) || (fy < H - 1 && !m[o + W]));
      if (edge) pic.set([255, 0, 255], q); else for (let c = 0; c < 3; c++) pic[q + c] = inside ? rgb[3 * o + c] : Math.round(rgb[3 * o + c] / 3);
    }
    // its name in small blocks: not text, a bar as long as the name, coloured; the order is the reading's (the caller prints the names)
    for (let i = 0; i < Math.min(cellPx - 4, names[k].length * 6); i++) for (let y = 4; y < 10; y++) pic.set([255, 255, 255], 3 * ((oy - 14 + y) * SW + ox + 2 + i));
  });
  return {pic, w: SW, h: SH};
}

// node tools/cloth-segment.mjs --film <mp4> [--frames 1934,1951] --out <dir> [--grid]: each drawing's masks (mask-<frame>-<name>.bin) and its
// picture at twice its size on the reading grid with the masks' outlines (--grid: the guide polygons too)
async function main() {
  const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const HERE = path.dirname(fileURLToPath(import.meta.url)), {CLOTH_READING: R} = await import('../lab/cloth-reading.js'), {PIECES} = await import('../lab/cloth-cut.mjs');
  const film = path.resolve(opt('--film', path.join(HERE, '../app/saint-seiya.mp4'))), out = opt('--out', 'cloth-masks'), only = opt('--frames', null)?.split(',').map(Number);
  fs.mkdirSync(out, {recursive: true});
  void PIECES;
  const frames = only ?? Object.keys(R.drawn).map(Number);
  for (const n of frames) {
    const byName = R.drawn[n] ?? {}, names = Object.keys(byName), entries = names.map((k) => byName[k]), polys = entries.map((e) => e.poly ?? e);
    const t0 = performance.now(), rgb = await frameOf(film, n), cells = cellsOf(rgb), t1 = performance.now();
    const masks = names.length ? segmentPieces(cells, entries, {legs: n >= 1945}) : [], t2 = performance.now();
    masks.forEach((m, k) => fs.writeFileSync(path.join(out, `mask-${n}-${names[k].replace(/ /g, '_')}.bin`), Buffer.from(m)));
    const {pic, w, h} = gridPicture(rgb, args.includes('--grid') ? polys : [], masks); await save(pic, w, h, path.join(out, `grid-${n}.png`));
    if (masks.length) { const sh = pieceSheet(rgb, masks, names); await save(sh.pic, sh.w, sh.h, path.join(out, `pieces-${n}.png`)); }
    console.log(`frame ${n}: ${cells.cells.length - 1} cells in ${(t1 - t0).toFixed(0)} ms, the pieces in ${(t2 - t1).toFixed(0)} ms; ${masks.map((m, k) => `${names[k]} ${m.reduce((a, b) => a + b, 0)}`).join(', ')}`);
  }
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

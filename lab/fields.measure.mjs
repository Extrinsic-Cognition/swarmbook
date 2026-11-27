#!/usr/bin/env node
// fields.measure.mjs: what fields.js follows, read once off the film (app/saint-seiya.mp4, 960 x 540 at 30000/1001), never by a page. His words,
// Oct 14 2026 16:3x-16:4x WEST, are in fields.js's header. Three readings, each printed as the constants fields-plan.mjs carries:
//   1. THE DRAWN HAIR'S FLOW, over the shot over her shoulder (frames 886 to 1005, 29.563 to 33.567 s, cut to cut): in each cell of the picture
//      the direction her drawn strands run, from the structure tensor of the picture's light inside her violet (cubism.mjs hairMask), summed over
//      the shot's 120 frames; pointed from the root to the tip (away from her head); with its coherence (1 a single direction, 0 none). Cells with
//      no hair take their neighbours' direction (filled outward), so the field is defined over the whole picture. And the sway: each frame's
//      mean angle in the streaming part of her hair against the shot's mean.
//   2. THE RAYS, at the film's two bursts of light: the star's rays (frames 1304 to 1361, 43.5 to 45.4 s, the gold star over Athena's mountain)
//      and the burst (frames 1362 to 1429, 45.445 to 47.7 s, the cut to the white-gold burst): the light's centre each frame (the centroid of the
//      white-hot core) and the light round it by angle (theater-light.mjs's score of each pixel: white-hot gold, or white), averaged over the
//      frames; its peaks are the rays (angle, strength, width).
//   3. THE LIGHT'S AMOUNT, every tenth of a second from 41.0 to 53.5 s and 59.5 to 73.0 s: the mean over the picture (the subtitles' band out)
//      of how far each pixel is past white-hot gold or white, as theater-light.mjs scores it, but the whole frame's sum rather than its peak
//      (the peak saturates through every burst).
//   nice -n 19 node fields.measure.mjs [--film <mp4>] [--json <out.json>] [--module fields-film.mjs]
// COST: ffmpeg decodes 120 frames at 960 x 540 (186 MB in memory) and 765 at 480 x 270 (297 MB, in two windows); about 10 s of one core.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {hairMask, SHOT} from './cubism.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const MP4 = opt('--film', path.resolve(HERE, '../app/saint-seiya.mp4'));
const FPS = 30000 / 1001;
const W = 960, H = 540, PICTURE = [82, 4, 877, 536];   // the 1986 picture inside the file (theater-light.mjs CROP: 796 x 532 from 82, 4)
const SQUARE = {x0: 210, side: 540};                       // warm-sphere.js drawPortrait: the file's centre square, what each face carries
export const toSquare = (x, y) => [(x - SQUARE.x0) / SQUARE.side * 2 - 1, y / SQUARE.side * 2 - 1];
export const fromSquare = (u, v) => [(u + 1) / 2 * SQUARE.side + SQUARE.x0, (v + 1) / 2 * SQUARE.side];

/** Frames a to b - 1 of the film as raw rgb24 at w x h, decoded into memory: an array of Uint8Array views. */
export function decode(file, a, b, w = W, h = H) {
  const vf = `select=between(n\\,${a}\\,${b - 1})${w === W ? '' : `,scale=${w}:${h}:flags=area`}`;
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-threads', '2', '-i', file, '-vf', vf, '-vsync', '0', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {maxBuffer: (b - a + 2) * w * h * 3});
  const size = w * h * 3, out = [];
  for (let k = 0; (k + 1) * size <= raw.length; k++) out.push(raw.subarray(k * size, (k + 1) * size));
  return out;
}
const luma = (rgb, w, h) => { const y = new Float32Array(w * h); for (let i = 0; i < w * h; i++) y[i] = (0.299 * rgb[i * 3] + 0.587 * rgb[i * 3 + 1] + 0.114 * rgb[i * 3 + 2]) / 255; return y; };

// ---- 1. the drawn hair's flow ----
/** The grid the flow is read on, in the face's picture square (u right, v down, -1..1 the square; the picture reaches u +-1.47). */
export const GRID = {u0: -1.5, v0: -1, du: 0.125, dv: 0.125, nu: 24, nv: 16};
/**
 * The structure tensor of one frame's light inside her hair, summed into the grid's cells: {xx, xy, yy, n} per cell. The gradient is a
 * Sobel on the luma; a pixel counts when it and its 3 x 3 neighbours are in the hair's mask grown by 2 px (the dark lines between strands are
 * the strands' edges, and they lie at the mask's inner borders).
 */
export function tensorOf(rgb, mask, w = W, h = H, grid = GRID) {
  const y = luma(rgb, w, h), cells = grid.nu * grid.nv, xx = new Float64Array(cells), xy = new Float64Array(cells), yy = new Float64Array(cells), n = new Float64Array(cells);
  const grown = new Uint8Array(w * h);
  for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) {
    if (!mask[j * w + i]) continue;
    for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) { const jj = j + dj, ii = i + di; if (jj >= 0 && jj < h && ii >= 0 && ii < w) grown[jj * w + ii] = 1; }
  }
  for (let j = Math.max(1, PICTURE[1]); j < Math.min(h - 1, PICTURE[3]); j++) for (let i = Math.max(1, PICTURE[0]); i < Math.min(w - 1, PICTURE[2]); i++) {
    if (!grown[j * w + i]) continue;
    const at = (di, dj) => y[(j + dj) * w + i + di];
    const gx = (at(1, -1) + 2 * at(1, 0) + at(1, 1)) - (at(-1, -1) + 2 * at(-1, 0) + at(-1, 1));
    const gy = (at(-1, 1) + 2 * at(0, 1) + at(1, 1)) - (at(-1, -1) + 2 * at(0, -1) + at(1, -1));
    const [u, v] = toSquare(i + 0.5, j + 0.5), cu = Math.floor((u - grid.u0) / grid.du), cv = Math.floor((v - grid.v0) / grid.dv);
    if (cu < 0 || cv < 0 || cu >= grid.nu || cv >= grid.nv) continue;
    const c = cv * grid.nu + cu;
    xx[c] += gx * gx; xy[c] += gx * gy; yy[c] += gy * gy; n[c]++;
  }
  return {xx, xy, yy, n};
}
/** A cell's strand direction from its tensor: the angle across the gradient (radians, picture frame: x right, y down), and the coherence. */
export function directionOf(xx, xy, yy) {
  const tr = xx + yy;
  if (!(tr > 0)) return {a: NaN, c: 0};
  const theta = 0.5 * Math.atan2(2 * xy, xx - yy);   // the gradient's orientation
  return {a: theta + Math.PI / 2, c: Math.sqrt((xx - yy) ** 2 + 4 * xy * xy) / tr};
}
/** Points a strand's orientation (mod pi) from the root to the tip: away from her head (the square's u, v). */
export const awayFrom = (a, at, head) => { const d = [Math.cos(a), Math.sin(a)], o = [at[0] - head[0], at[1] - head[1]]; return d[0] * o[0] + d[1] * o[1] >= 0 ? a : a + Math.PI; };
/** Cells with no hair (coherence weight 0) take the mean direction of their neighbours that have one, outward until every cell has one. */
export function fillOut(dirs, grid = GRID) {
  const out = dirs.map((d) => ({...d}));
  for (let pass = 0; pass < grid.nu + grid.nv && out.some((d) => !Number.isFinite(d.a)); pass++) {
    const next = out.map((d) => ({...d}));
    for (let cv = 0; cv < grid.nv; cv++) for (let cu = 0; cu < grid.nu; cu++) {
      const i = cv * grid.nu + cu;
      if (Number.isFinite(out[i].a)) continue;
      let sx = 0, sy = 0, k = 0;
      for (const [du, dv] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [-1, -1], [1, -1], [-1, 1]]) {
        const u = cu + du, v = cv + dv;
        if (u < 0 || v < 0 || u >= grid.nu || v >= grid.nv) continue;
        const d = out[v * grid.nu + u];
        if (Number.isFinite(d.a)) { sx += Math.cos(d.a); sy += Math.sin(d.a); k++; }
      }
      if (k) next[i] = {a: Math.atan2(sy, sx), c: 0, filled: true};
    }
    out.splice(0, out.length, ...next);
  }
  return out;
}

// ---- the light's score of a pixel (theater-light.mjs: white-hot gold whole, white at 0.8) ----
const ss = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
const band = (h, a, b, c, d) => ss(a, b, h) * (1 - ss(c, d, h));
/** One pixel's light: {score, gold}, its colour read as theater-light.mjs reads it. */
export function scoreOf(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), sat = mx > 0 ? (mx - mn) / mx : 0;
  let hue = 0;
  if (mx > mn) hue = mx === r ? 60 * (((g - b) / (mx - mn) + 6) % 6) : mx === g ? 60 * ((b - r) / (mx - mn) + 2) : 60 * ((r - g) / (mx - mn) + 4);
  const hot = ss(0.72, 0.98, mx), gold = hot * ss(0.1, 0.4, sat) * band(hue, 20, 32, 66, 82), white = hot * 0.8 * (1 - ss(0.1, 0.35, sat));
  return {score: Math.max(gold, white), gold};
}
const scoreImage = (rgb, w, h) => { const y = new Float32Array(w * h); for (let i = 0; i < w * h; i++) y[i] = scoreOf(rgb[i * 3] / 255, rgb[i * 3 + 1] / 255, rgb[i * 3 + 2] / 255).score; return y; };

// ---- 2. the rays ----
/** The white-hot core's centroid (file px) in a frame of w x h, and its share of the picture. */
export function coreOf(y, w, h, {from = 0.92, top = 0, bottom = 1} = {}) {
  let sx = 0, sy = 0, sw = 0, n = 0;
  const x0 = Math.round(PICTURE[0] * w / W), x1 = Math.round(PICTURE[2] * w / W), y0 = Math.round(Math.max(PICTURE[1] * h / H, top * h)), y1 = Math.round(Math.min(PICTURE[3] * h / H, bottom * h));
  for (let j = y0; j < y1; j++) for (let i = x0; i < x1; i++) { const v = y[j * w + i] - from; if (v > 0) { sx += v * (i + 0.5); sy += v * (j + 0.5); sw += v; n++; } }
  return sw > 0 ? {x: sx / sw * W / w, y: sy / sw * H / h, share: n / ((x1 - x0) * (y1 - y0))} : null;
}
/** The light round a centre by angle (1 degree bins, 0 = right, + toward the bottom of the picture), radii r0 to r1 file px: the mean of an
 *  image of w x h (the light's score). */
export function ringOf(y, w, h, centre, r0, r1) {
  const out = new Float64Array(360), s = w / W;
  for (let a = 0; a < 360; a++) {
    const c = Math.cos(a * Math.PI / 180), sn = Math.sin(a * Math.PI / 180);
    let sum = 0, k = 0, all = 0;
    for (let r = r0; r <= r1; r += 3) {
      all++;
      const x = (centre.x + c * r) * s, yy = (centre.y + sn * r) * s;
      if (x < PICTURE[0] * s + 1 || x > PICTURE[2] * s - 2 || yy < PICTURE[1] * s + 1 || yy > PICTURE[3] * s - 2) continue;
      const i = Math.floor(x), j = Math.floor(yy), fx = x - i, fy = yy - j;
      sum += (y[j * w + i] * (1 - fx) + y[j * w + i + 1] * fx) * (1 - fy) + (y[(j + 1) * w + i] * (1 - fx) + y[(j + 1) * w + i + 1] * fx) * fy; k++;
    }
    out[a] = k >= all / 2 ? sum / k : NaN;   // an angle that leaves the picture within half the ring is not read
  }
  return out;
}
/** The rays in a ring: its peaks above the ring's median by `lift` of its spread, at least `apart` degrees apart; each {deg, k (0..1), w (deg)}. */
export function raysOf(ring, {lift = 0.35, apart = 7} = {}) {
  const vals = [...ring].filter(Number.isFinite).sort((a, b) => a - b);
  if (!vals.length) return [];
  const median = vals[vals.length >> 1], top = vals[vals.length - 1], floor = median + lift * (top - median);
  const at = (a) => ring[((a % 360) + 360) % 360];
  const peaks = [];
  for (let a = 0; a < 360; a++) {
    const v = at(a);
    if (!(v > floor)) continue;
    let best = true;
    for (let d = 1; d <= apart && best; d++) if (at(a + d) > v || at(a - d) >= v) best = false;
    if (!best) continue;
    let l = 0, r = 0; const half = (v + median) / 2;
    while (l < 45 && at(a - l - 1) > half) l++;
    while (r < 45 && at(a + r + 1) > half) r++;
    peaks.push({deg: a, k: (v - median) / (top - median), w: l + r + 1});
  }
  return peaks;
}

/** theater-light.mjs's score of a pixel (white-hot gold whole, white at 0.8), summed over the picture above the subtitles' band, as a mean. */
export function lightOf(rgb, w, h) {
  const x0 = Math.round(PICTURE[0] * w / W), x1 = Math.round(PICTURE[2] * w / W), y0 = Math.round(PICTURE[1] * h / H), y1 = Math.round((PICTURE[1] + 0.76 * (PICTURE[3] - PICTURE[1])) * h / H);
  let sum = 0, gold = 0;
  for (let j = y0; j < y1; j++) for (let i = x0; i < x1; i++) {
    const o = (j * w + i) * 3, p = scoreOf(rgb[o] / 255, rgb[o + 1] / 255, rgb[o + 2] / 255);
    sum += p.score; gold += p.gold;
  }
  const n = (x1 - x0) * (y1 - y0);
  return {light: sum / n, gold: sum > 0 ? gold / sum : 0};
}

/** The readings as fields-film.mjs: the constants fields-plan.mjs and fields.js follow (written by this tool, never by hand). */
export function moduleOf(out) {
  const j = (x) => JSON.stringify(x);
  const rays = (r) => ({frames: r.frames, centre: r.centre, square: r.square, rays: r.rays.map((x) => [x.deg, +x.k.toFixed(3), x.w])});
  return `// fields-film.mjs: WRITTEN BY fields.measure.mjs (${out.at}, ${out.ms} ms), never by hand: what fields.js follows, read once off ${out.film}.
// HAIR: the drawn hair's flow over the shot over her shoulder (frames ${out.hair.shot.join(' to ')}), on a grid of the face's picture square (u right, v
// down; -1..1 the square, the picture reaching u +-1.47): per cell the angle (radians, picture frame, root to tip) her strands run, and its
// coherence (0 where the cell had no hair and took its neighbours' direction); sway: each frame's angle in the streaming part of her hair
// against the shot's mean (radians). BURST and STAR: the light's centre (file px and the square's u, v) and its rays [degrees (0 right, + down
// the picture), strength 0..1, width in degrees]; the star's are read through the mountain's gold and are not to be trusted (fields-plan.mjs
// uses the burst's). LIGHT: the film's light every tenth of a second from \`from\` (the mean of theater-light.mjs's score over the picture).
export const HAIR = ${j({grid: out.hair.grid, head: out.hair.head, read: out.hair.read, a: out.hair.a, c: out.hair.c})};
export const SWAY = ${j(out.hair.sway)};
export const BURST = ${j(rays(out.burst))};
export const STAR = ${j(rays(out.star))};
export const LIGHT = ${j(out.light.map((w) => ({from: w.from, dt: w.dt, light: w.light, gold: w.gold})))};
`;
}

function main() {
  const t0 = performance.now(), out = {at: new Date().toISOString(), film: path.basename(MP4)};
  // 1. the hair over the shot
  const frames = decode(MP4, SHOT.frames[0], SHOT.frames[1]);
  const head = toSquare(700, 120);   // the back of her head in the shot's frames (read by eye at 29.6, 31.5 and 33.5 s: the crown at 700, 50)
  const sum = {xx: new Float64Array(GRID.nu * GRID.nv), xy: new Float64Array(GRID.nu * GRID.nv), yy: new Float64Array(GRID.nu * GRID.nv), n: new Float64Array(GRID.nu * GRID.nv)};
  const sway = [], streaming = (cu, cv) => { const u = GRID.u0 + (cu + 0.5) * GRID.du, v = GRID.v0 + (cv + 0.5) * GRID.dv; return u < 0.3 && v > 0; };
  for (const rgb of frames) {
    const m = hairMask(rgb, W, H), t = tensorOf(rgb, m);
    let sx = 0, sy = 0;
    for (let i = 0; i < t.n.length; i++) {
      sum.xx[i] += t.xx[i]; sum.xy[i] += t.xy[i]; sum.yy[i] += t.yy[i]; sum.n[i] += t.n[i];
      if (t.n[i] > 40 && streaming(i % GRID.nu, Math.floor(i / GRID.nu))) { const d = directionOf(t.xx[i], t.xy[i], t.yy[i]); sx += d.c * Math.cos(2 * d.a); sy += d.c * Math.sin(2 * d.a); }
    }
    sway.push(Math.atan2(sy, sx) / 2);
  }
  const dirs = [];
  for (let i = 0; i < sum.n.length; i++) {
    const cu = i % GRID.nu, cv = Math.floor(i / GRID.nu), at = [GRID.u0 + (cu + 0.5) * GRID.du, GRID.v0 + (cv + 0.5) * GRID.dv];
    if (sum.n[i] < 120 * 60) { dirs.push({a: NaN, c: 0}); continue; }   // under 60 px of hair a frame: no reading
    const d = directionOf(sum.xx[i], sum.xy[i], sum.yy[i]);
    dirs.push({a: awayFrom(d.a, at, head), c: d.c});
  }
  const filled = fillOut(dirs);
  const mean = Math.atan2(sway.reduce((s, a) => s + Math.sin(2 * a), 0), sway.reduce((s, a) => s + Math.cos(2 * a), 0)) / 2;
  const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));
  out.hair = {shot: SHOT.frames, grid: GRID, head: head.map((x) => +x.toFixed(3)),
    a: filled.map((d) => +d.a.toFixed(3)), c: filled.map((d) => +d.c.toFixed(2)), read: dirs.filter((d) => Number.isFinite(d.a)).length,
    sway: sway.map((a) => +wrap(2 * (a - mean)) / 2).map((a) => +a.toFixed(4))};
  // 2. the rays, at 480 x 270
  const w2 = 480, h2 = 270;
  const rays = (a, b, opts) => {
    const fr = decode(MP4, a, b, w2, h2), ring = new Float64Array(360), centres = [];
    for (const rgb of fr) {
      const c = coreOf(luma(rgb, w2, h2), w2, h2, opts.core);
      if (!c) continue;
      centres.push(c);
      const r = ringOf(scoreImage(rgb, w2, h2), w2, h2, c, opts.r0, opts.r1);
      for (let k = 0; k < 360; k++) if (Number.isFinite(r[k])) ring[k] += r[k] / fr.length;
    }
    const cx = centres.reduce((s, c) => s + c.x, 0) / centres.length, cy = centres.reduce((s, c) => s + c.y, 0) / centres.length;
    return {frames: [a, b], centre: [+cx.toFixed(1), +cy.toFixed(1)], square: toSquare(cx, cy).map((x) => +x.toFixed(3)), rays: raysOf(ring, opts),
      ring: [...ring].map((v) => +v.toFixed(3))};
  };
  out.star = rays(1304, 1362, {r0: 30, r1: 200, core: {from: 0.9, bottom: 0.6}, lift: 0.2, apart: 5});
  out.burst = rays(1362, 1430, {r0: 110, r1: 250, core: {from: 0.92}, lift: 0.25, apart: 6});
  // 3. the light's amount, a tenth of a second at a time (the brightest frame of each tenth)
  const amount = (from, to) => {
    const a = Math.floor(from * FPS), b = Math.ceil(to * FPS), fr = decode(MP4, a, b, w2, h2), steps = Math.round((to - from) * 10), light = new Array(steps).fill(0), gold = new Array(steps).fill(0);
    fr.forEach((rgb, k) => {
      const t = (a + k) / FPS, s = Math.floor((t - from) * 10);
      if (s < 0 || s >= steps) return;
      const l = lightOf(rgb, w2, h2);
      if (l.light >= light[s]) { light[s] = l.light; gold[s] = l.gold; }
    });
    return {from, dt: 0.1, light: light.map((v) => +v.toFixed(3)), gold: gold.map((v) => +v.toFixed(2))};
  };
  out.light = [amount(41.0, 53.5), amount(59.5, 73.0)];
  out.ms = Math.round(performance.now() - t0);
  if (opt('--json')) fs.writeFileSync(opt('--json'), JSON.stringify(out, null, 1));
  if (opt('--module')) fs.writeFileSync(opt('--module'), moduleOf(out));
  const brief = {...out, hair: {...out.hair}, star: {...out.star, ring: undefined}, burst: {...out.burst, ring: undefined}};
  console.log(JSON.stringify(brief));
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main();

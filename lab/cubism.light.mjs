#!/usr/bin/env node
// cubism.light.mjs: THE FILM'S LIGHT ON HER, measured. His words, Oct 14 2026 19:1x WEST (relayed verbatim): "also the fucking lightining dude
// come on... you have the chance to turn the entire background black there... make it fucking immersive... she has fucking tore through space
// and time dude... we saw her fold the dodechadron lik a fukin origami". The coordinator's ask 2: from the fold to the wall of light the page goes
// black (the box seat draws the black) and her looks take the film's light, dark with the gold light on her edge and rim, not the page's flat
// white light.
//
// What it reads, frame by frame over her span (frames 886 to 1140 of app/saint-seiya.mp4, decoded into memory by ffmpeg, never written): her
// drawn hair (the violet mask; pale lilac in her face shot; navy from the column on, where the beam lights it), its shadow, middle and lit tones (the mean colour of the
// hair's pixels about its 20th, 50th and 90th percentile of luminance), the gold light on her hair and at its edge (gold pixels within 6 px of
// the hair: their share of the hair, their colour, and the side they stand on), and the scene behind her (the picture outside that band). Against
// her glb hair's own colour (its texture at the hair's triangles, the same percentiles), the light on her in linear RGB: shade = film / albedo at
// the 20th percentile, lit = film / albedo at the 90th, rim = the gold's colour and its share. Bins of 6 frames (0.2 s) inside each shot, cut at
// the shots. Prints the table cubism.mjs carries (FILM_LIGHT) and, with --json, every bin's raw numbers.
//   nice -n 19 node cubism.light.mjs [--film <mp4>] [--json <out.json>]
// COST: ffmpeg decodes 255 frames once (about 400 MB in chunks of 64 frames, a few seconds); the statistics are one pass of each frame.
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {FILM, VIOLET, HAIR, hairMask} from './cubism.mjs';
import {figureOf} from './cubism.storyboard.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const MP4 = opt('--film', path.resolve(HERE, '../app/saint-seiya.mp4'));
export const SPAN = [886, 1141];   // her first frame to the film's cut after the flood (38.071 s)
export const COLUMN = 1096;        // from the column on, the beam lights her hair navy
export const NAVY = {hue: [215, 300], sat: 0.15, val: 0.12};
export const LILAC = {hue: [250, 345], sat: 0.05, val: 0.45};   // her face shot: the light leaves her hair pale lilac, under the violet's saturation
export const GOLD = {hue: [38, 66], sat: 0.25, val: 0.5};        // from 38 deg: her skin (about 24 deg) is not light
export const BIN = 6;
const CUTS = [886, 1006, 1096, 1115, 1141];
const toneOf = (n) => (n >= COLUMN ? NAVY : n >= CUTS[1] ? LILAC : VIOLET);   // the shots (cubism.mjs SHOTS) and the flood's frames after the column

const lin = (c) => { const x = c / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
const lum = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;
function hsv(r, g, b) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d > 0) h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(h * 60 + 360) % 360, mx > 0 ? d / mx : 0, mx / 255];
}
const inTone = ([h, s, v], t) => h >= t.hue[0] && h <= t.hue[1] && s >= t.sat && v >= t.val;

/** A luminance histogram with each bin's colour sums: the mean colour of the pixels about a percentile (a band of 10 %). */
function tones() {
  const n = new Float64Array(256), sum = new Float64Array(256 * 3);
  return {
    add(r, g, b) { const k = Math.min(255, Math.round(lum(r, g, b))); n[k]++; sum[k * 3] += r; sum[k * 3 + 1] += g; sum[k * 3 + 2] += b; },
    count() { return n.reduce((a, b) => a + b, 0); },
    at(p, band = 0.1) {
      const total = this.count();
      if (!total) return null;
      const lo = Math.max(0, p - band / 2) * total, hi = Math.min(1, p + band / 2) * total, c = [0, 0, 0];
      let seen = 0, took = 0;
      for (let k = 0; k < 256; k++) {
        const a = Math.max(seen, lo), b = Math.min(seen + n[k], hi);
        if (b > a) { const w = (b - a) / n[k]; for (let j = 0; j < 3; j++) c[j] += sum[k * 3 + j] * w; took += b - a; }
        seen += n[k];
      }
      return c.map((x) => x / Math.max(took, 1));
    },
  };
}
function dilate(m, w, h, r) {
  const a = new Uint8Array(w * h), out = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) { let run = -1e9; for (let x = 0; x < w; x++) { if (m[y * w + x]) run = x; a[y * w + x] = x - run <= r ? 1 : 0; } run = 1e9; for (let x = w - 1; x >= 0; x--) { if (m[y * w + x]) run = x; if (run - x <= r) a[y * w + x] = 1; } }
  for (let x = 0; x < w; x++) { let run = -1e9; for (let y = 0; y < h; y++) { if (a[y * w + x]) run = y; out[y * w + x] = y - run <= r ? 1 : 0; } run = 1e9; for (let y = h - 1; y >= 0; y--) { if (a[y * w + x]) run = y; if (run - y <= r) out[y * w + x] = 1; } }
  return out;
}

/** One frame's light: her hair's tones, the gold on and at it, the scene behind; in the film's sRGB (0..255). */
export function frameLight(rgb, n) {
  const {w, h} = FILM, [c0, c1] = FILM.picture, tone = toneOf(n);
  const hair = hairMask(rgb, w, h, {t: tone}), near = dilate(hair, w, h, 6);
  const H = tones(), S = tones(), gold = [0, 0, 0], gc = [0, 0], hc = [0, 0];
  let golds = 0, hairs = 0;
  for (let y = 0; y < h; y++) for (let x = c0; x <= c1; x++) {
    const i = y * w + x, r = rgb[i * 3], g = rgb[i * 3 + 1], b = rgb[i * 3 + 2];
    if (hair[i]) { H.add(r, g, b); hairs++; hc[0] += x; hc[1] += y; }
    if (near[i] && inTone(hsv(r, g, b), GOLD)) { golds++; gold[0] += r; gold[1] += g; gold[2] += b; gc[0] += x; gc[1] += y; }
    else if (!near[i]) S.add(r, g, b);
  }
  const side = golds && hairs ? [gc[0] / golds - hc[0] / hairs, gc[1] / golds - hc[1] / hairs] : [0, 0];
  return {n, hairShare: hairs / ((c1 - c0 + 1) * h), shade: H.at(0.2), mid: H.at(0.5), lit: H.at(0.9), gold: golds ? gold.map((v) => v / golds) : null,
    goldShare: hairs ? golds / hairs : 0, goldSide: side, scene: S.at(0.5), sceneLit: S.at(0.9)};
}

/** Her glb hair's own colour: the texture's texels inside the hair's triangles (UV space), the same percentiles; sRGB 0..255. */
export function albedoOf(fig, size = 512) {
  const T = tones(), seen = new Uint8Array(size * size);
  for (let t = 0; t < fig.tris.length; t += 3) {
    const ids = [fig.tris[t], fig.tris[t + 1], fig.tris[t + 2]];
    if (ids.some((i) => i < HAIR.from || i >= HAIR.to)) continue;
    const p = ids.map((i) => [fig.uv[i * 2] * size, fig.uv[i * 2 + 1] * size]);
    const x0 = Math.max(0, Math.floor(Math.min(...p.map((q) => q[0])))), x1 = Math.min(size - 1, Math.ceil(Math.max(...p.map((q) => q[0]))));
    const y0 = Math.max(0, Math.floor(Math.min(...p.map((q) => q[1])))), y1 = Math.min(size - 1, Math.ceil(Math.max(...p.map((q) => q[1]))));
    const area = (p[1][0] - p[0][0]) * (p[2][1] - p[0][1]) - (p[1][1] - p[0][1]) * (p[2][0] - p[0][0]);
    if (Math.abs(area) < 1e-9) continue;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const px = x + 0.5, py = y + 0.5;
      const w0 = ((p[1][0] - px) * (p[2][1] - py) - (p[1][1] - py) * (p[2][0] - px)) / area, w1 = ((p[2][0] - px) * (p[0][1] - py) - (p[2][1] - py) * (p[0][0] - px)) / area;
      if (w0 < 0 || w1 < 0 || w0 + w1 > 1 || seen[y * size + x]) continue;
      seen[y * size + x] = 1;
      const q = (y * size + x) * 4;
      if (fig.tex[q + 3] < 128) continue;
      T.add(fig.tex[q], fig.tex[q + 1], fig.tex[q + 2]);
    }
  }
  return {texels: T.count(), shade: T.at(0.2), mid: T.at(0.5), lit: T.at(0.9)};
}

const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : 0; };
const medianColour = (cs) => [0, 1, 2].map((k) => median(cs.filter(Boolean).map((c) => c[k])));
const r3 = (c) => c && c.map((v) => +v.toFixed(3));

/** The bins' light in linear RGB against the albedo: {f: [from, to), shade, lit, rim, rimWidth, side (the gold's side in the picture, unit:
 *  read, too noisy to steer a light), floor (the spread of the hair's shadow and lit luminance over the bin's frames, 0..255)}. */
export function lightOf(bins, albedo) {
  const over = (film, alb) => film && film.map((c, k) => Math.min(4, lin(c) / Math.max(lin(alb[k]), 1e-3)));
  return bins.map((b) => {
    const share = median(b.frames.map((f) => f.goldShare)), side = (() => { const s = medianColour(b.frames.filter((f) => f.gold).map((f) => [...f.goldSide, 0])); const l = Math.hypot(s[0], s[1]); return l > 1 ? [s[0] / l, s[1] / l] : [0, 0]; })();
    const shadeL = b.frames.map((f) => f.shade && lum(...f.shade)).filter((x) => x != null), litL = b.frames.map((f) => f.lit && lum(...f.lit)).filter((x) => x != null);
    return {f: b.f, shade: r3(over(medianColour(b.frames.map((f) => f.shade)), albedo.shade)), lit: r3(over(medianColour(b.frames.map((f) => f.lit)), albedo.lit)),
      rim: share > 0.002 ? r3(medianColour(b.frames.map((f) => f.gold)).map(lin)) : [0, 0, 0], rimWidth: +Math.min(0.6, Math.sqrt(share)).toFixed(3), side: side.map((v) => +v.toFixed(2)),
      hairShare: +median(b.frames.map((f) => f.hairShare)).toFixed(3),
      floor: {shade: +(Math.max(...shadeL) - Math.min(...shadeL)).toFixed(1), lit: +(Math.max(...litL) - Math.min(...litL)).toFixed(1)}};
  });
}

async function main() {
  const t0 = performance.now(), frames = [];
  for (let a = SPAN[0]; a < SPAN[1]; a += 64) {
    const b = Math.min(SPAN[1], a + 64), size = FILM.w * FILM.h * 3;
    const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', MP4, '-vf', `select=between(n\\,${a}\\,${b - 1})`, '-fps_mode', 'passthrough', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {maxBuffer: (b - a + 2) * size});
    for (let k = 0; (k + 1) * size <= raw.length; k++) frames.push(frameLight(raw.subarray(k * size, (k + 1) * size), a + k));
  }
  const fig = await figureOf(path.join(HERE, 'athena.hades.glb')), albedo = albedoOf(fig);
  const bins = [];
  for (let s = 0; s + 1 < CUTS.length; s++) for (let a = CUTS[s]; a < CUTS[s + 1]; a += BIN) {
    const b = Math.min(CUTS[s + 1], a + BIN), fs_ = frames.filter((f) => f.n >= a && f.n < b);
    if (b - a < BIN / 2 && bins.length && bins[bins.length - 1].f[1] === a && bins[bins.length - 1].shot === s) { bins[bins.length - 1].f[1] = b; bins[bins.length - 1].frames.push(...fs_); continue; }
    bins.push({f: [a, b], shot: s, frames: fs_});
  }
  const light = lightOf(bins, albedo), ms = Math.round(performance.now() - t0);
  const table = {at: new Date().toISOString(), frames: SPAN, bin: BIN, albedo: {shade: r3(albedo.shade), mid: r3(albedo.mid), lit: r3(albedo.lit), texels: albedo.texels},
    bins: light.map(({f, shade, lit, rim, rimWidth}) => [f[0], f[1], shade, lit, rim, rimWidth])};
  if (opt('--json')) fs.writeFileSync(opt('--json'), JSON.stringify({...table, ms, light, perFrame: frames.map((f) => ({...f, shade: r3(f.shade), mid: r3(f.mid), lit: r3(f.lit), gold: r3(f.gold), scene: r3(f.scene), sceneLit: r3(f.sceneLit), goldSide: r3(f.goldSide)}))}, null, 1));
  console.error(`${frames.length} frames, ${light.length} bins, ${ms} ms; albedo shade ${r3(albedo.shade)} lit ${r3(albedo.lit)} (${albedo.texels} texels)`);
  for (const b of light) console.error(`${b.f[0]}-${b.f[1]}: shade ${b.shade} lit ${b.lit} rim ${b.rim} w ${b.rimWidth} side ${b.side} hair ${b.hairShare} floor ${b.floor.shade}/${b.floor.lit}`);
  console.log(JSON.stringify(table));
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

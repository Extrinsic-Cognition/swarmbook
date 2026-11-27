#!/usr/bin/env node
// strike-flow.mjs: THE STRIKE'S DRAWN LINES, measured once off app/saint-seiya.mp4 for the hero's colony (lab/the-colony.mjs THE FLOW); the
// page only reads them (lab/strike-flow.js). His words, Oct 21 2026 WEST, over the swarm in a ring over the barrage and the impact: "why are you
// not tracing over the frames of the anime the directions that are already drawns... look how pegasus is emanating/irradiating out disks and
// you have swarm satellites idle... and look at dolbar with lines going inside of him and shitshow of swarm satellites in a totally irrelevant
// formation"; then, over the arrows as one funnel into Dolbar and a curtain down his armour, "the swarmies are too opaque...".
//
// THE MEASURE, with tools/twelve-dct.mjs's own: each frame of each shot decoded to the picture alone (796 x 532 from 82, 4) at 400 x 264; every
// 8 x 8 block's lines (structure: the doubled-angle orientation of its gradients, a quarter turn on, and how oriented it is); the oriented,
// edged blocks as lines through their centres, weighed by coherence times edge, but none in the picture's lowest fifth in the barrage and the
// meteors (`BAND`: the barrage's burned-in subtitles, whose letters' edges are the strongest lines of a frame and drew its point onto them, and
// the meteors' rocky ground, whose edges are no streaks). Over the whole shot, (converge) the point its lines meet and how they run: RADIAL
// (the share of their weight that points at that point) against PARALLEL (the length of their doubled-angle mean, and its direction).
//
// THE DRAWN: every WINDOW frames, where the shot's lines are drawn, read the way the story reads the shot (`READ`, as the law's ways): about
// its point (the barrage out of Pegasus, the impact into Dolbar's chest), the weight of the lines that point at it (wholly within a quarter
// of a radian, not at all past a third), by their angle round it, in BINS sectors clockwise from the right (y down); along its parallels (the meteors' streaks, the
// lines on his armour), the weight of the lines that run with them, by their lane across the picture, in BINS lanes from `lanes[0]` to
// `lanes[1]` (the file's pixels across the parallels, from the picture's centre); each window's weights smoothed over a bin each side and
// written as BINS digits, 0 to 9 of its strongest. The way along the lines (out of the point, into it, which way along the parallels) is the
// story's, the law's (lab/the-colony.mjs), not this tool's.
//   nice -n 19 node tools/strike-flow.mjs [--overlay <dir>]      writes lab/strike-flow.js; with --overlay, a picture a window of what it read
// COST: one ffmpeg decode of 315 frames at 400 x 264, about a second of arithmetic. Run it once, niced.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {W, H, BX, BY, ASPECT, structure, converge} from './twelve-dct.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url)), FILM = path.join(HERE, '..', 'app', 'saint-seiya.mp4');
// the strike's shots, frames from to (inclusive), read off the film by ffmpeg's scene score over 0.25 (lab/the-colony.mjs COLONY)
export const SHOTS = Object.freeze({barrage: [3140, 3199], impact: [3200, 3244], meteors: [3245, 3334], hits: [3335, 3454]});
export const READ = Object.freeze({barrage: 'radial', impact: 'radial', meteors: 'parallel', hits: 'parallel'});
export const BAND = Object.freeze({barrage: 0.8, meteors: 0.8});   // the lines below this share of the picture's height are not read
export const WINDOW = 6, BINS = 48;
const toFile = ([x, y]) => [82 + x * 532, 4 + y * 532];   // picture heights to the file's pixels
const CENTRE = [ASPECT / 2, 0.5];

function decode(from, to) {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', FILM, '-an', '-fps_mode', 'passthrough', '-vf',
      `select='between(n\\,${from}\\,${to})',crop=796:532:82:4,scale=${W}:${H}:flags=area,format=rgb24`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
      {stdio: ['ignore', 'pipe', 'inherit']});
    const chunks = []; ff.stdout.on('data', (c) => chunks.push(c));
    ff.on('error', reject);
    ff.on('close', (code) => {
      if (code !== 0) return reject(new Error(`ffmpeg ended ${code}`));
      const all = Buffer.concat(chunks), size = W * H * 3, frames = [];
      for (let o = 0; o + size <= all.length; o += size) frames.push(all.subarray(o, o + size));
      resolve(frames);
    });
  });
}

/** The lines of one frame: oriented, edged blocks, [{p, d, w}] in picture heights, none below `band` of the height. */
export function linesOf(rgb, band = 1) {
  const lum = new Float64Array(W * H);
  for (let i = 0; i < W * H; i++) lum[i] = 0.299 * rgb[i * 3] + 0.587 * rgb[i * 3 + 1] + 0.114 * rgb[i * 3 + 2];
  const lines = [];
  for (let by = 0; by < BY; by++) for (let bx = 0; bx < BX; bx++) {
    if ((by + 0.5) / BY > band) continue;
    const s = structure(lum, W, bx * 8, by * 8), edge = Math.sqrt(s.jxx + s.jyy) / 8;
    if (s.coherence > 0.45 && edge > 6) lines.push({p: [((bx + 0.5) / BX) * ASPECT, (by + 0.5) / BY], d: [Math.cos(s.along), Math.sin(s.along)], w: s.coherence * edge});
  }
  return lines;
}

/** How the lines run: {focus, radial, parallel, along}: the point they meet (picture heights), the share of their weight pointing at it (the
 *  cosine between each line and its ray from the point, weighed), the length of their doubled-angle mean and its direction (radians, y down). */
export function flowOf(lines) {
  const focus = converge(lines, CENTRE);
  let total = 0, toward = 0, c2 = 0, s2 = 0;
  for (const l of lines) {
    const rx = l.p[0] - focus[0], ry = l.p[1] - focus[1], r = Math.hypot(rx, ry);
    if (r > 0.04) toward += l.w * Math.abs((rx * l.d[0] + ry * l.d[1]) / r);
    const a = Math.atan2(l.d[1], l.d[0]); c2 += l.w * Math.cos(2 * a); s2 += l.w * Math.sin(2 * a); total += l.w;
  }
  return {focus, radial: total ? toward / total : 0, parallel: total ? Math.hypot(c2, s2) / total : 0, along: 0.5 * Math.atan2(s2, c2)};
}

const aligned = (cos) => Math.max(0, Math.min(1, (cos - 0.94) / 0.03));   // a line's share by its cosine: whole within 0.25 rad, none past 0.35
/** The lanes across a shot's parallels: the picture's (above `band`) extent across them, from its centre, picture heights. */
export function lanesOf(along, band = 1) {
  const nx = -Math.sin(along), ny = Math.cos(along);
  const q = [[0, 0], [ASPECT, 0], [0, band], [ASPECT, band]].map(([x, y]) => (x - CENTRE[0]) * nx + (y - CENTRE[1]) * ny);
  return [Math.min(...q), Math.max(...q)];
}
/** Where one window's lines are drawn: BINS weights, about the focus by angle (radial) or by lane across `along` (parallel). */
export function drawnOf(lines, read, {focus, along, lanes}) {
  const w = new Float64Array(BINS);
  for (const l of lines) {
    if (read === 'radial') {
      const rx = l.p[0] - focus[0], ry = l.p[1] - focus[1], r = Math.hypot(rx, ry);
      if (r < 0.04) continue;
      const a = (Math.atan2(ry, rx) + 2 * Math.PI) % (2 * Math.PI);
      w[Math.floor(a / (2 * Math.PI) * BINS) % BINS] += l.w * aligned(Math.abs((rx * l.d[0] + ry * l.d[1]) / r));
    } else {
      const q = (l.p[0] - CENTRE[0]) * -Math.sin(along) + (l.p[1] - CENTRE[1]) * Math.cos(along), b = Math.floor((q - lanes[0]) / (lanes[1] - lanes[0]) * BINS);
      if (b >= 0 && b < BINS) w[b] += l.w * aligned(Math.abs(l.d[0] * Math.cos(along) + l.d[1] * Math.sin(along)));
    }
  }
  const out = new Float64Array(BINS);   // a bin each side, round the circle about a point, held at the ends across parallels
  for (let b = 0; b < BINS; b++) {
    const at = (k) => (read === 'radial' ? w[(k + BINS) % BINS] : w[Math.max(0, Math.min(BINS - 1, k))]);
    out[b] = (at(b - 1) + 2 * w[b] + at(b + 1)) / 4;
  }
  return out;
}
export const digits = (w) => { const m = Math.max(...w); return [...w].map((v) => (m > 0 ? Math.min(9, Math.round(9 * v / m)) : 0)).join(''); };

async function main() {
  const overlay = process.argv.includes('--overlay') ? process.argv[process.argv.indexOf('--overlay') + 1] : null;
  const out = {};
  for (const [name, [from, to]] of Object.entries(SHOTS)) {
    const band = BAND[name] ?? 1, frames = await decode(from, to), each = frames.map((f) => linesOf(f, band)), f = flowOf(each.flat());
    const lanes = READ[name] === 'parallel' ? lanesOf(f.along, band) : null, read = {focus: f.focus, along: f.along, lanes};
    const drawn = [];
    for (let w0 = 0; w0 < frames.length; w0 += WINDOW) drawn.push(drawnOf(each.slice(w0, w0 + WINDOW).flat(), READ[name], read));
    out[name] = {from, to, read: READ[name], focus: toFile(f.focus).map((v) => +v.toFixed(1)), along: +f.along.toFixed(4), radial: +f.radial.toFixed(3),
      parallel: +f.parallel.toFixed(3), lanes: lanes && lanes.map((v) => +(v * 532).toFixed(1)), drawn: drawn.map(digits)};
    console.log(name, JSON.stringify({...out[name], drawn: out[name].drawn.length + ' windows'}));
    if (overlay) {   // each window's middle frame, where its lines are drawn in gold (rays about the point, lanes across), the point in red
      fs.mkdirSync(overlay, {recursive: true});
      drawn.forEach((weights, k) => {
        const img = Buffer.from(frames[Math.min(frames.length - 1, k * WINDOW + WINDOW / 2)]), m = Math.max(...weights) || 1;
        const put = (x, y) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < W && y < H) { const o = (y * W + x) * 3; img[o] = 255; img[o + 1] = 190; img[o + 2] = 0; } };
        const line = (x0, y0, x1, y1) => { const n = Math.ceil(Math.hypot(x1 - x0, y1 - y0)) || 1; for (let i = 0; i <= n; i++) put(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n); };
        const px = (p) => [p[0] / ASPECT * W, p[1] * H];
        for (let b = 0; b < BINS; b++) {
          const v = weights[b] / m; if (v < 0.2) continue;
          if (READ[name] === 'radial') { const a = (b + 0.5) / BINS * 2 * Math.PI, [fx, fy] = px(f.focus); line(fx + Math.cos(a) * 10, fy + Math.sin(a) * 10, fx + Math.cos(a) * (10 + 190 * v), fy + Math.sin(a) * (10 + 190 * v)); }
          else { const q = lanes[0] + (b + 0.5) / BINS * (lanes[1] - lanes[0]), c = [CENTRE[0] - Math.sin(f.along) * q, CENTRE[1] + Math.cos(f.along) * q], [cx, cy] = px(c), d = 220 * v; line(cx - Math.cos(f.along) * d, cy - Math.sin(f.along) * d, cx + Math.cos(f.along) * d, cy + Math.sin(f.along) * d); }
        }
        const [fx, fy] = px(f.focus);
        if (READ[name] === 'radial') for (let k2 = -6; k2 <= 6; k2++) { const o1 = (Math.round(fy) * W + Math.round(fx + k2)) * 3, o2 = (Math.round(fy + k2) * W + Math.round(fx)) * 3; for (const o of [o1, o2]) if (o >= 0 && o < img.length) { img[o] = 255; img[o + 1] = 0; img[o + 2] = 0; } }
        fs.writeFileSync(path.join(overlay, `${name}-${String(k).padStart(2, '0')}.ppm`), Buffer.concat([Buffer.from(`P6\n${W} ${H}\n255\n`), img]));
      });
    }
  }
  const text = `// strike-flow.js: THE STRIKE'S DRAWN LINES, written by tools/strike-flow.mjs off app/saint-seiya.mp4 (do not edit by hand; run it again).
// Each shot of the strike: how the story reads it (about its point, or along its parallels), the point its lines meet in the file's pixels
// (960 x 540), the parallels' direction in radians (y down), the two scores, the lanes across the parallels (the file's pixels from the
// picture's centre) and, every DRAWN.window frames, where its lines are drawn: DRAWN.bins digits, by angle round the point clockwise from the
// right or by lane across the parallels, 0 to 9 of that window's strongest (lab/the-colony.mjs THE FLOW reads them).
export const DRAWN = Object.freeze({window: ${WINDOW}, bins: ${BINS}});
export const STRIKE_FLOW = Object.freeze({
${Object.entries(out).map(([k, v]) => `  ${k}: Object.freeze({from: ${v.from}, to: ${v.to}, read: '${v.read}', focus: Object.freeze([${v.focus.join(', ')}]), along: ${v.along}, radial: ${v.radial}, parallel: ${v.parallel},${v.lanes ? ` lanes: Object.freeze([${v.lanes.join(', ')}]),` : ''}
    drawn: Object.freeze([
${v.drawn.map((d) => `      '${d}',`).join('\n')}
    ])}),`).join('\n')}
});
`;
  fs.writeFileSync(path.join(HERE, '..', 'lab', 'strike-flow.js'), text);
  console.log('wrote lab/strike-flow.js');
}
if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main().catch((e) => { console.error(e); process.exit(2); });

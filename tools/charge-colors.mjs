#!/usr/bin/env node
// charge-colors.mjs: THE CHARGE'S COLOURS, measured once off app/saint-seiya.mp4 for the hero's corona (lab/the-colony.mjs chargeAt, lab/unboxing.js
// drawCorona); the page only reads them (lab/charge-colors.js). His words, Oct 27 2026 15:2x WET, over the Pegasus faces of the dodecahedron
// burning in gold flames: "i would like to start seeing a blue glow radially expand silently here just like warming up to the nuke right after
// when he goes ballistic... i would like to see proper coloring synced with the color of the anime".
//
// THE MEASURE: each frame of THE CHARGE (2795 to the explosion, 3139) decoded to the picture alone (796 x 532 from 82, 4) at 80 x 53; its cosmos
// colour, the mean of its pixels weighed by saturation squared times value (the lit, saturated light leads; the black ink and the white paper
// weigh nothing), then a centred mean over 5 frames that never crosses a cut (a cut: the frames' mean absolute difference past CUT). Written as
// six hex digits a frame, from the charge's first frame.
//   nice -n 19 node tools/charge-colors.mjs        writes lab/charge-colors.js
// COST: one ffmpeg decode of 345 frames at 80 x 53, a few milliseconds of arithmetic. Run it once, niced.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url)), FILM = path.join(HERE, '..', 'app', 'saint-seiya.mp4'), OUT = path.join(HERE, '..', 'lab', 'charge-colors.js');
const FRAME = 1001 / 30000, FROM = 2795, TO = 3139, W = 80, H = 53, CUT = 38, SMOOTH = 2;

export function cosmosOf(px) {   // px: RGB bytes of one frame -> [r, g, b] 0..255, the saturated light's mean
  let r = 0, g = 0, b = 0, w = 0;
  for (let i = 0; i < px.length; i += 3) {
    const R = px[i], G = px[i + 1], B = px[i + 2], max = Math.max(R, G, B), min = Math.min(R, G, B);
    if (max < 24) continue;
    const s = (max - min) / max, v = max / 255, k = s * s * v;
    r += R * k; g += G * k; b += B * k; w += k;
  }
  return w > 1e-6 ? [r / w, g / w, b / w] : [128, 128, 128];
}
export function cutsOf(frames) {   // the index of each frame that begins a new shot
  const cuts = new Set([0]);
  for (let i = 1; i < frames.length; i++) { let d = 0; const a = frames[i - 1], b = frames[i]; for (let j = 0; j < a.length; j++) d += Math.abs(a[j] - b[j]); if (d / a.length > CUT) cuts.add(i); }
  return cuts;
}
export function smoothWithin(colors, cuts, k = SMOOTH) {
  const shot = []; let s = -1; for (let i = 0; i < colors.length; i++) { if (cuts.has(i)) s++; shot.push(s); }
  return colors.map((_, i) => { const acc = [0, 0, 0]; let n = 0;
    for (let j = i - k; j <= i + k; j++) if (j >= 0 && j < colors.length && shot[j] === shot[i]) { acc[0] += colors[j][0]; acc[1] += colors[j][1]; acc[2] += colors[j][2]; n++; }
    return acc.map((v) => v / n); });
}
const hex = (c) => c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, '0')).join('');

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const n = TO - FROM + 1, bytes = W * H * 3;
  const args = ['-v', 'error', '-ss', (FROM * FRAME - 0.5).toFixed(4), '-i', FILM, '-ss', '0.5', '-frames:v', String(n),
    '-vf', `crop=796:532:82:4,scale=${W}:${H}:flags=area`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'];
  const ff = spawn('/opt/homebrew/bin/ffmpeg', args); const chunks = [];
  ff.stdout.on('data', (d) => chunks.push(d)); ff.stderr.on('data', (d) => process.stderr.write(d));
  ff.on('close', (code) => {
    const all = Buffer.concat(chunks), got = Math.floor(all.length / bytes);
    if (code !== 0 || got < n - 2) { console.error(`ffmpeg ${code}: ${got} of ${n} frames`); process.exit(1); }
    const frames = []; for (let i = 0; i < got; i++) frames.push(all.subarray(i * bytes, (i + 1) * bytes));
    const cuts = cutsOf(frames), colors = smoothWithin(frames.map(cosmosOf), cuts);
    const body = colors.map(hex).join('');
    fs.writeFileSync(OUT, `// lab/charge-colors.js: THE CHARGE'S COLOURS, written by tools/charge-colors.mjs off app/saint-seiya.mp4 (do not edit by hand). Each frame's cosmos
// colour (its saturated light's mean, smoothed within its shot), six hex digits a frame, from frame ${FROM}; ${got} frames, ${cuts.size} shots (cuts at frames
// ${[...cuts].map((i) => FROM + i).join(', ')}).
export const CHARGE_COLORS = Object.freeze({from: ${FROM}, frames: ${got}, hex: '${body}'});
`);
    console.log(`wrote ${path.relative(process.cwd(), OUT)}: ${got} frames, ${cuts.size} shots; ` + [0, 90, 180, 225, 285, got - 1].map((i) => `${FROM + i} #${hex(colors[Math.min(i, got - 1)])}`).join(', '));
  });
}

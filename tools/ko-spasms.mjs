#!/usr/bin/env node
// ko-spasms.mjs: SEIYA'S SPASMS, measured off the film for the KO edge (lab/ko-edge.js). His words, Oct 14 2026 16:0x WEST: "make sure to DCT
// align the red halo with the spasms of saint seya eh"; what he means by DCT aligned, in his words of Oct 12 2026: "the oscillations here are not
// DCT aligned to the music tbh... like you know in advance how it is going to oscillate" and "is there really no DCT study on frequencies of songs
// and climaxes". The film is known in advance, so its spasms are measured once, here, and the page only reads them.
//
// THE MEASURE: the film decoded to grey at 240 x 136 (ffmpeg, area scaling, every frame as it is); for each frame n of the hold (from the hit,
// frame 540, to the cut to Athena, frame 886) the AC energy of the 8 x 8 DCT of its change from frame n - 1, per pixel, over the 216 blocks of
// the picture's middle (x 24 to 216, y 24 to 96: inside the 4:3 picture's black side bars, above the burned-in subtitles from row 104). An
// orthonormal 8 x 8 DCT keeps a block's energy (Parseval), and its DC coefficient is the block's sum over 8, so a block's AC energy is
// sum(d^2) - sum(d)^2 / 64: what the codec has to spend on that block's change beyond a flat shift of its brightness.
// What it reads (Oct 14 2026, by eye against the frames): the film is drawn on twos to fours, so a held drawing gives about 0 and each new drawing
// a spike. Seiya's drawings (the yank 18.15 to 18.92 s on fours, his jerks after the cut 19.15 to 19.42 s, the scream 21.82 to 22.49 s, his
// body dropping 22.56 to 23.19 s, the sway 27.39 to 28.90 s) measure 300 to 940; Dolbar's lips (23.56 to 23.92 s) 160 to 190; the sky's drift
// under 30. A two-dimensional search of each drawing's best global shift (plus or minus 20 px) leaves them all where they were: none of them is
// a camera move.
//
//   node ko-spasms.mjs [--film <mp4>] [--out <lab/ko-spasms.js>]     prints the energies; --out writes the data module ko-edge.js imports
// COST: one ffmpeg decode of the film's first 29.6 s at 240 x 136 (about 2 s of CPU) and 346 frames x 216 blocks; run it once, niced.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const W = 240, H = 136, REGION = Object.freeze({x0: 24, x1: 216, y0: 24, y1: 96});
export const FRAMES = Object.freeze({from: 540, to: 886});   // the hit; the cut to her (not included)
// The hold's one cut, 19.052 s (frame 571, ffmpeg's scene score 0.39: from behind Seiya to the two of them): a change of shot, not of his body;
// it measures 952 and is written as 0. The cut is the theater's and THE CUTS' moment, never the halo's (the rule of one).
export const CUTS = Object.freeze([571]);

/** The AC energy of an 8 x 8 block's change, as the orthonormal DCT counts it: sum(d^2) - sum(d)^2 / 64. */
export function blockAc(prev, next, stride, x, y) {
  let s = 0, s2 = 0;
  for (let j = 0; j < 8; j++) {
    const o = (y + j) * stride + x;
    for (let i = 0; i < 8; i++) { const d = next[o + i] - prev[o + i]; s += d; s2 += d * d; }
  }
  return s2 - (s * s) / 64;
}

/** A frame's change from the last: the region's AC energy per pixel. */
export function changeEnergy(prev, next, {w = W, region = REGION} = {}) {
  let tot = 0, blocks = 0;
  for (let y = region.y0; y + 8 <= region.y1; y += 8) for (let x = region.x0; x + 8 <= region.x1; x += 8) { tot += blockAc(prev, next, w, x, y); blocks++; }
  return tot / (blocks * 64);
}

/** Decode the film's first frames to grey at W x H: a Buffer of frames, back to back. */
export async function decode(film, frames) {
  const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', film, '-frames:v', String(frames), '-vf', `scale=${W}:${H}:flags=area,format=gray`,
    '-fps_mode', 'passthrough', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'], {stdio: ['ignore', 'pipe', 'inherit']});
  const chunks = [];
  for await (const c of ff.stdout) chunks.push(c);
  const code = await new Promise((r) => ff.on('close', r));
  if (code !== 0) throw new Error(`ffmpeg ended ${code}`);
  return Buffer.concat(chunks);
}

/** The hold's energies, one a frame from FRAMES.from to FRAMES.to - 1, rounded to whole numbers. */
export async function measure(film) {
  const buf = await decode(film, FRAMES.to + 1), N = W * H, out = [];
  if (buf.length < (FRAMES.to + 1) * N) throw new Error(`the film gave ${Math.floor(buf.length / N)} frames, ${FRAMES.to + 1} wanted`);
  for (let n = FRAMES.from; n < FRAMES.to; n++) out.push(CUTS.includes(n) ? 0 : Math.round(changeEnergy(buf.subarray((n - 1) * N, n * N), buf.subarray(n * N, (n + 1) * N))));
  return out;
}

export function moduleText(energy, film) {
  return `// ko-spasms.js: SEIYA'S SPASMS, the film's own measure, written by tools/ko-spasms.mjs (do not edit by hand; run it again).
// For each frame of the hold (from the hit, frame ${FRAMES.from}, 18.018 s, to the cut to Athena, frame ${FRAMES.to}, not included) the AC energy per pixel of the 8 x 8 DCT
// of the frame's change from the last, over the picture's middle at 240 x 136 (tools/ko-spasms.mjs says how and why); the hold's cut (frame ${CUTS.join(', ')}) as 0.
// Read off ${path.basename(film)}.
export const SPASMS = Object.freeze({from: ${FRAMES.from}, to: ${FRAMES.to}, floor: 250, full: 700, energy: Object.freeze([
${energy.map((v, i) => (i % 24 === 0 ? '  ' : '') + v + (i % 24 === 23 || i === energy.length - 1 ? ',\n' : ', ')).join('')}])});
`;
}

async function main() {
  const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const film = path.resolve(opt('--film', path.join(HERE, '../app/saint-seiya.mp4'))), out = opt('--out', null);
  const t0 = performance.now(), energy = await measure(film), ms = performance.now() - t0;
  const fps = 30000 / 1001;
  for (let i = 0; i < energy.length; i++) if (energy[i] >= 100) console.log(`frame ${FRAMES.from + i}  ${((FRAMES.from + i) / fps).toFixed(3)} s  ${energy[i]}`);
  console.log(`${energy.length} frames measured in ${ms.toFixed(0)} ms`);
  if (out) { fs.writeFileSync(out, moduleText(energy, film)); console.log(`wrote ${out}`); }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

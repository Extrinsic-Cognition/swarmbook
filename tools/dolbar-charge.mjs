#!/usr/bin/env node
// dolbar-charge.mjs: DOLBAR'S CHARGE, measured off the film for the anti-unit1 satellites (lab/anti-satellites.js). His words, Oct 14 2026
// 19:37:56 WEST, over the hero: "you. see when it becomes red halo when dolbar is charging the attack before the dodecahedron explodes in umpact?
// can you show some anti-unit1satellites like... imagine that dolbar is sending signal to attack to others and we visually see the shit aligned
// there... you know what i mean?". The film is known in advance, so the red of his halo is measured once, here, and the page only reads it
// (as the KO edge reads Seiya's spasms: tools/ko-spasms.mjs).
//
// THE MEASURE: the film decoded to RGB at 240 x 136 (ffmpeg, area scaling, every frame as it is) up to frame 346 (11.545 s); for each frame from
// frame 60 (2.002 s) the RED SHARE of the square the hero's faces show (warm-sphere.js drawPortrait: the centre square of the 960 x 540 frame, x 210
// to 750, so x 52 to 188 of 240, every row): the share of its pixels whose colour is the halo's, hue within 25 degrees under red and 20 over it,
// saturation at least 0.45, value at least 0.30 (Dolbar's red light, the pink it throws over Seiya, the red blast; not his purple armour, not the
// blue sky, not the cave's black). Written in thousandths.
// What it reads (Oct 14 2026 20:2x WEST, by eye against the frames at four a second): the coup de grace said over Dolbar in purple from the cut at
// 2.903 s; a red orb lit in his hand (about 3.7 s); the frame floods red over him (about 4.5 s), sparks; the cut to Seiya in its pink light
// (5.405 s); back to Dolbar in red (6.406 s); the blast let go, red speed lines (about 7.5 s); its blue and red streaks (8.542 s); the giant hand
// of light (8.909 s); the one who stands in it with his arms spread (his tag, the sacrifice, 10.835 s); the cut to the hit landing (11.044 s,
// frame 331, the hero's first burst: the dodecahedron explodes there).
//
//   node dolbar-charge.mjs [--film <mp4>] [--out <lab/dolbar-charge.js>]     prints the shares; --out writes the data module the overlay imports
// COST: one ffmpeg decode of the film's first 11.5 s at 240 x 136 (under a second of CPU) and 287 frames x 18,496 pixels; run it once, niced.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const W = 240, H = 136;
/** The square the hero's faces show (the 960 x 540 frame's centre square, x 210 to 750), in the 240 x 136 decode. */
export const SQUARE = Object.freeze({x0: 52, x1: 188, y0: 0, y1: H});
/** The frames measured: from 2.002 s (a second before the coup de grace is said) to the first frame after 11.5 s (not included). */
export const FRAMES = Object.freeze({from: 60, to: 346});
/** The halo's colour: hue in degrees (red at 0), saturation and value 0..1. */
export const HALO = Object.freeze({under: 25, over: 20, sat: 0.45, val: 0.30});

/** Whether one RGB pixel (0..255) is the halo's red. */
export function isHalo(r, g, b, halo = HALO) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  if (max < halo.val * 255 || max === 0) return false;
  const d = max - min;
  if (d / max < halo.sat || d === 0) return false;
  if (max !== r) return false;   // red leads: a hue within 60 degrees of red has R the largest
  const hue = 60 * (g - b) / d;  // -60 (magenta side) to +60 (yellow side)
  return hue >= -halo.under && hue <= halo.over;
}

/** One RGB frame's red share over the square, in thousandths. */
export function redShare(rgb, {w = W, square = SQUARE, halo = HALO} = {}) {
  let red = 0, all = 0;
  for (let y = square.y0; y < square.y1; y++) {
    for (let x = square.x0; x < square.x1; x++) {
      const i = (y * w + x) * 3;
      if (isHalo(rgb[i], rgb[i + 1], rgb[i + 2], halo)) red++;
      all++;
    }
  }
  return Math.round((1000 * red) / all);
}

/** Decode the film's first frames to RGB at W x H: a Buffer of frames, back to back. */
export async function decode(film, frames) {
  const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', film, '-frames:v', String(frames), '-vf', `scale=${W}:${H}:flags=area,format=rgb24`,
    '-fps_mode', 'passthrough', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {stdio: ['ignore', 'pipe', 'inherit']});
  const chunks = [];
  for await (const c of ff.stdout) chunks.push(c);
  const code = await new Promise((r) => ff.on('close', r));
  if (code !== 0) throw new Error(`ffmpeg ended ${code}`);
  return Buffer.concat(chunks);
}

/** The red share of each frame from FRAMES.from to FRAMES.to - 1, in thousandths. */
export async function measure(film) {
  const buf = await decode(film, FRAMES.to), N = W * H * 3, out = [];
  if (buf.length < FRAMES.to * N) throw new Error(`the film gave ${Math.floor(buf.length / N)} frames, ${FRAMES.to} wanted`);
  for (let n = FRAMES.from; n < FRAMES.to; n++) out.push(redShare(buf.subarray(n * N, (n + 1) * N)));
  return out;
}

export function moduleText(share, film) {
  return `// dolbar-charge.js: DOLBAR'S CHARGE, the film's own measure, written by tools/dolbar-charge.mjs (do not edit by hand; run it again).
// For each frame from frame ${FRAMES.from} (${(FRAMES.from * 1001 / 30000).toFixed(3)} s) to frame ${FRAMES.to} (not included) the share, in thousandths, of the
// square the hero's faces show (the frame's centre square) whose colour is the halo's red (tools/dolbar-charge.mjs says how and why). Read off ${path.basename(film)}.
export const CHARGE = Object.freeze({from: ${FRAMES.from}, to: ${FRAMES.to}, share: Object.freeze([
${share.map((v, i) => (i % 24 === 0 ? '  ' : '') + v + (i % 24 === 23 || i === share.length - 1 ? ',\n' : ', ')).join('')}])});
`;
}

async function main() {
  const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const film = path.resolve(opt('--film', path.join(HERE, '../app/saint-seiya.mp4'))), out = opt('--out', null);
  const t0 = performance.now(), share = await measure(film), ms = performance.now() - t0;
  const fps = 30000 / 1001;
  for (let i = 0; i < share.length; i++) console.log(`frame ${FRAMES.from + i}  ${((FRAMES.from + i) / fps).toFixed(3)} s  ${share[i]}`);
  console.log(`${share.length} frames measured in ${ms.toFixed(0)} ms`);
  if (out) { fs.writeFileSync(out, moduleText(share, film)); console.log(`wrote ${out}`); }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

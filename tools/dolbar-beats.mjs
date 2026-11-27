#!/usr/bin/env node
// dolbar-beats.mjs: THE BEATS OF DOLBAR'S ATTACK, measured off the film, for his swarm (lab/anti-satellites.js). His words, Oct 15 2026 02:2x WEST,
// over his page during the raid: "honestly super fucking poor performance on the attack... completely uncorrelated to the animation of dolbar
// dude... like he charges a lot and then does hyper quicck attac from a distancr and then the other gguy blocks it". The film is known in
// advance, so its beats are measured once, here, and the swarm only reads them (as tools/dolbar-charge.mjs measures the halo's red and the page
// reads lab/dolbar-charge.js).
//
// THE MEASURE: the film decoded to RGB at 240 x 136 (dolbar-charge.mjs's decode: area scaling, every frame as it is) up to frame 346; for each
// frame from 60 (2.002 s) three numbers, in thousandths:
// - RED: the halo's red over the square the hero's faces show (dolbar-charge.mjs's redShare: the same numbers as lab/dolbar-charge.js);
// - LIGHT: the share of the whole frame that is pale light (value over 0.85, saturation under 0.35): the blast's light, the hand of light;
// - CHANGE: the mean absolute difference of its grey from the frame before's (Rec. 601), a share of the full scale: a cut over 118 (30 of
//   255, morpho-field.mjs's cut).
// THE BEATS, each by one rule over those numbers (what the frames show, read by eye on Oct 15 2026 at every frame from 96 to 351):
// - ORB: the first frame from the coup de grace's cut (frame 87) whose red is half again over the frame before's: the orb lit in his hand
//   (13 to 25, frame 115, 3.837 s; frame 114 holds its first red dot).
// - FLOOD: the first frame from the orb whose red reaches 500: the frame floods red over him, his halo (frame 134, 4.471 s; lab/anti-satellites.js RISE).
// - RELEASE: the first frame after the flood whose light reaches 80: THE BLAST LET GO, his hand thrust out of the frame in light (frame 251,
//   8.375 s; the light was 0 to 44 through the whole charge, Seiya's pink light the most).
// - PEAK: the first frame of the charge's highest red, the flood to the release: the charge at its height, the focus lines closing on his palm
//   (frame 245, 8.175 s, 980).
// - STREAKS: the first cut after the release (the blue and red streaks, frame 256, 8.542 s) and, until the next cut (the hand of light), each
//   frame whose red rises over the frame before's by 100 or more: the streaks' flicker, on 256, 259, 261, 264 and 266.
// - HAND: that next cut: the giant hand of light (frame 267, 8.909 s, its light 170).
// - FLASH: the first frame after the hand whose light goes out (under 20): the hand reaches Seiya in a red flash (frame 286, 9.543 s, 888).
// - SWEEP: the first frame after the flash whose red falls from the frame before's by 100 or more: the blast sweeps over Seiya (frame 290, 9.676 s).
// - HIT: the first cut after his tag (10.835 s, frame 325): the cut to the hit landing on the one who takes it, the hero's first burst (frame
//   331, 11.044 s; hero-ab.html BURSTS[0]).
// The one who takes it stands in it from frame 319 (10.644 s) and his tag is frame 325 (10.844 s): those are THE SACRIFICE's (lab/sacrifice.js
// SACRIFICE.first and .tag, the matte's frames), read from there and not measured here.
//
//   node dolbar-beats.mjs [--film <mp4>] [--out <lab/dolbar-beats.js>]    prints the frames' numbers and the beats; --out writes the module
// COST: one ffmpeg decode of the film's first 11.55 s at 240 x 136 (under a second of CPU), then 286 frames x 32,640 pixels; run it once, niced.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {W, H, decode, redShare} from './dolbar-charge.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const FPS = 30000 / 1001;
/** The frames measured: as dolbar-charge.mjs's, from 2.002 s to the first frame after 11.5 s (not included). */
export const FRAMES = Object.freeze({from: 60, to: 346});
/** The rules' numbers (thousandths): the coup de grace's cut, a red rise of half again, the flood, the light of the release, a flicker, the light gone, a cut. */
export const RULES = Object.freeze({coup: 87, orb: 1.5, flood: 500, light: 80, flicker: 100, dark: 20, cut: 118});

/** One RGB frame's light: the share of its pixels with value over 0.85 and saturation under 0.35, in thousandths. */
export function lightShare(rgb) {
  let light = 0;
  for (let i = 0; i < W * H * 3; i += 3) {
    const r = rgb[i], g = rgb[i + 1], b = rgb[i + 2], max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max > 0.85 * 255 && max - min < 0.35 * max) light++;
  }
  return Math.round((1000 * light) / (W * H));
}

/** The mean absolute difference of two frames' grey (Rec. 601), a share of the full scale in thousandths. */
export function change(a, b) {
  let sum = 0;
  for (let i = 0; i < W * H * 3; i += 3) sum += Math.abs((a[i] - b[i]) * 0.299 + (a[i + 1] - b[i + 1]) * 0.587 + (a[i + 2] - b[i + 2]) * 0.114);
  return Math.round((1000 * sum) / (W * H * 255));
}

/** The film's numbers, frame by frame from FRAMES.from: {red, light, change} (arrays of thousandths). */
export async function measure(film) {
  const buf = await decode(film, FRAMES.to), N = W * H * 3, red = [], light = [], moved = [];
  if (buf.length < FRAMES.to * N) throw new Error(`the film gave ${Math.floor(buf.length / N)} frames, ${FRAMES.to} wanted`);
  for (let n = FRAMES.from; n < FRAMES.to; n++) {
    const rgb = buf.subarray(n * N, (n + 1) * N);
    red.push(redShare(rgb)); light.push(lightShare(rgb)); moved.push(change(rgb, buf.subarray((n - 1) * N, n * N)));
  }
  return {red, light, change: moved};
}

/** The beats, by the rules, from the film's numbers ({red, light, change} from FRAMES.from) and the sacrifice's tag frame. Pure. */
export function beats({red, light, change: moved}, {tag = 325, rules = RULES} = {}) {
  const at = (list, n) => list[n - FRAMES.from], first = (from, ok) => { for (let n = from; n < FRAMES.to; n++) if (ok(n)) return n; return null; };
  const cut = (n) => at(moved, n) > rules.cut;
  const orb = first(rules.coup + 1, (n) => at(red, n) >= rules.orb * at(red, n - 1) && at(red, n) > at(red, n - 1));
  const flood = first(orb, (n) => at(red, n) >= rules.flood);
  const release = first(flood, (n) => at(light, n) >= rules.light);
  let peak = flood;
  for (let n = flood; n < release; n++) if (at(red, n) > at(red, peak)) peak = n;
  const streak = first(release + 1, cut), hand = first(streak + 1, cut), streaks = [streak];
  for (let n = streak + 1; n < hand; n++) if (at(red, n) - at(red, n - 1) >= rules.flicker) streaks.push(n);
  const flash = first(hand + 1, (n) => at(light, n) < rules.dark);
  const sweep = first(flash + 1, (n) => at(red, n - 1) - at(red, n) >= rules.flicker);
  const hit = first(tag + 1, cut);
  return {orb, flood, peak, release, streaks, hand, flash, sweep, hit};
}

const WHAT = {
  orb: 'the orb lit in his hand', flood: 'the frame floods red over him: his halo, the charge begins', peak: 'the charge at its height: the focus lines close on his palm',
  release: 'THE BLAST LET GO: his hand thrust out of the frame in light', streaks: 'the blue and red streaks, each flicker of their red',
  hand: 'the giant hand of light', flash: 'the hand reaches Seiya in a red flash', sweep: 'the blast sweeps over Seiya',
  hit: 'the cut to the hit landing on the one who takes it: the hero\'s first burst',
};

export function moduleText(m, b, film) {
  const s = (n) => (n / FPS).toFixed(3), num = (n) => `red ${m.red[n - FRAMES.from]}, light ${m.light[n - FRAMES.from]}, change ${m.change[n - FRAMES.from]}`;
  const row = (k, n) => `  ${k}: ${n},${' '.repeat(Math.max(1, 12 - k.length - String(n).length))}// ${s(n)} s, ${WHAT[k]} (${num(n)})`;
  return `// dolbar-beats.js: THE BEATS OF DOLBAR'S ATTACK, the film's own measure, written by tools/dolbar-beats.mjs (do not edit by hand; run it again).
// The film's frames (30000/1001 fps) of each beat, found by the tool's rules over each frame's red (the faces' square), light and change
// (thousandths); the numbers of the frame are on its line. Read off ${path.basename(film)}.
export const BEATS = Object.freeze({
${['orb', 'flood', 'peak', 'release'].map((k) => row(k, b[k])).join('\n')}
  streaks: Object.freeze([${b.streaks.join(', ')}]),   // ${b.streaks.map(s).join(', ')} s: ${WHAT.streaks}
${['hand', 'flash', 'sweep', 'hit'].map((k) => row(k, b[k])).join('\n')}
});
`;
}

async function main() {
  const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const film = path.resolve(opt('--film', path.join(HERE, '../app/saint-seiya.mp4'))), out = opt('--out', null);
  const t0 = performance.now(), m = await measure(film), b = beats(m), ms = performance.now() - t0;
  for (let i = 0; i < m.red.length; i++) console.log(`frame ${FRAMES.from + i}  ${((FRAMES.from + i) / FPS).toFixed(3)} s  red ${m.red[i]}  light ${m.light[i]}  change ${m.change[i]}`);
  console.log(JSON.stringify(b));
  console.log(`${m.red.length} frames measured in ${ms.toFixed(0)} ms`);
  if (out) { fs.writeFileSync(out, moduleText(m, b, film)); console.log(`wrote ${out}`); }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

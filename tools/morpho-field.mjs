#!/usr/bin/env node
// morpho-field.mjs: THE MORPHO-FIELD OF DOLBAR'S CHARGE, measured off the film, for his swarmies (lab/anti-satellites.js). His words, Oct 14 2026
// 21:21 WEST, over the hero's red attackers: "you gotta be morphofield aware my dude... just because you dont see the current moment in theater
// mode doesnt mean there is no background... i would appreciate if the red attackers were just like rimworld raiders coming from the borders where
// dolbar is... assume these aredolbar's swarmies"; 21:2x: "LITERALLY THE FUCKING CORE OF OUR BUSINESS MODEL IS TO FIGURE OUT THE FUCKING MORPHO
// FIELD OF THE SCENE"; "IS THERE NO FUCKING CV ALGO YOU CAN RUN THAT CAN DRIVE SOME SWARM EFFECTS?". The field in his words (Sept 22 2026): "an
// attractive gradient for pixels in displays to be swarmalated into place". The film is known in advance, so the field is measured once, here,
// and the page only reads it (as tools/dolbar-charge.mjs measures the halo's red, and the page reads lab/dolbar-charge.js).
//
// THE MEASURE: the film decoded to RGB at 240 x 136 (dolbar-charge.mjs's decode: area scaling, every frame as it is) up to the impact (frame 331,
// 11.044 s, not included); each frame to grey. For every frame of the charge (134, the first of his red halo, to 330) the OPTICAL FLOW from the
// frame before it, by block matching: the frame cut into 12 x 12 px cells (20 across, 11 down, the grid 2 px down from the top so it sits in the
// middle); for each cell the offset within 8 px either way at which the frame before holds the same block (the least sum of absolute differences);
// the pixels moved the other way, so the cell's flow is minus that offset, in px a frame. A cell is still (flow 0) when its block has no texture
// to match (the grey's spread under 6 of 255), or when the best match is not better than no move by 15 % (flicker, not motion). A frame is a CUT
// (every cell 0, the frame listed) when its mean absolute difference from the frame before is over 30 of 255: the film cuts to Seiya in Dolbar's
// pink light at 5.405 s (frame 162) and back to Dolbar at 6.406 s (192), and the streaks at 8.542 s (256) and the hand of light at 8.909 s (267). Also, for every frame, THE RED
// MASS: where the halo's red (dolbar-charge.mjs's isHalo, the same colour rule) sits in the whole frame, its centroid in thousandths of the width
// and the height, and its share of the frame in thousandths: where Dolbar is in the picture.
//
//   node morpho-field.mjs [--film <mp4>] [--out <lab/dolbar-field.js>]     prints the field's summary; --out writes the data module the swarm imports
//   node morpho-field.mjs --from 331 --to 487 --name FIELD_AFTER --out lab/dolbar-field-after.js
//                                           AFTER THE FLASH (his words, Oct 14 2026 22:0x WEST, over the hero at 10.9 s: "use this fucking flash to
//                                           cause an inversion of the mask"): the same measure over the hero's first burst, frame 331 (11.044 s, the
//                                           flash, its flow from the frame before: a cut) to 487 (16.250 s, the burst's 5.2 s), the module the
//                                           irradiance read (lab/irradiance.js) until it was taken off that flash (18678802); --from and --to are any
//                                           frames (the flow of the first is from the frame before it), --name the module's export; with none of them,
//                                           the charge's field as before
//   node morpho-field.mjs --from 1362 --to 1500 --name FIELD_GOLDEN --out lab/golden-field.js
//                                           THE GOLDEN BURST, the flash he showed (his words, Oct 14 2026 23:38 WEST, over the hero at the gold
//                                           starburst: "i already said what should happen here. you lost that?"): between the film's own cuts,
//                                           frame 1362 (45.445 s, the cut to the white-gold burst of rays, its flow from the frame before: a cut) and
//                                           1500 (50.050 s, the cut to the gold centaur in flames, not included); the module the hero's inversion reads
// COST: one ffmpeg decode of the film's first 11.05 s at 240 x 136 (under a second of CPU), then 197 frames x 220 cells x 289 offsets x 144 px of
// integer arithmetic (about 1.8 G adds, some seconds of one core); run it once, niced. After the flash: 16.25 s decoded and 156 frames. The golden
// burst: 50.05 s decoded (1,500 frames of 97,920 bytes held) and 138 frames, 3.4 s and 354 MB at most on the new Mac (Oct 15 2026).
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {W, H, decode, isHalo} from './dolbar-charge.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
/** The frames of the field: the first of his red halo to the impact (not included); the flow of frame n is from n - 1 to n. */
export const FRAMES = Object.freeze({from: 134, to: 331});
/** The windows measured so far, by their frames: the title and the export each module carries. */
export const WINDOWS = Object.freeze({
  '134-331': Object.freeze({title: "THE MORPHO-FIELD OF DOLBAR'S CHARGE", name: 'FIELD'}),
  '331-487': Object.freeze({title: 'THE MORPHO-FIELD AFTER THE FLASH (the hero\'s first burst, theater.js, its 5.2 s)', name: 'FIELD_AFTER'}),
  '1362-1500': Object.freeze({title: 'THE MORPHO-FIELD OF THE GOLDEN BURST (the cut to the white-gold rays, 45.445 s, to the cut to the gold centaur, 50.050 s)',
    name: 'FIELD_GOLDEN'}),
});
export const CELL = 12, SEARCH = 8, COLS = Math.floor(W / CELL), ROWS = Math.floor(H / CELL);
export const ORIGIN = Object.freeze([Math.floor((W - COLS * CELL) / 2), Math.floor((H - ROWS * CELL) / 2)]);
export const STILL = Object.freeze({spread: 6, better: 0.15, cut: 30});

/** One RGB frame to grey (Uint8Array, W x H): Rec. 601 weights. */
export function grey(rgb) {
  const out = new Uint8Array(W * H);
  for (let i = 0, j = 0; i < out.length; i++, j += 3) out[i] = (rgb[j] * 77 + rgb[j + 1] * 150 + rgb[j + 2] * 29) >> 8;
  return out;
}

/** The mean absolute difference of two grey frames, 0..255. */
export function meanDiff(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += Math.abs(a[i] - b[i]);
  return sum / a.length;
}

/** The flow of one grey frame `now` from the frame `before`: Int8Array of COLS x ROWS pairs [vx, vy] in px a frame, row-major. */
export function flowOf(now, before, {cell = CELL, search = SEARCH, still = STILL} = {}) {
  const out = new Int8Array(COLS * ROWS * 2);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const x0 = ORIGIN[0] + c * cell, y0 = ORIGIN[1] + r * cell;
      // the block's spread: no texture, nothing to match
      let sum = 0, sq = 0;
      for (let y = y0; y < y0 + cell; y++) for (let x = x0; x < x0 + cell; x++) { const v = now[y * W + x]; sum += v; sq += v * v; }
      const n = cell * cell, mean = sum / n, spread = Math.sqrt(Math.max(0, sq / n - mean * mean));
      if (spread < still.spread) continue;
      const sad = (dx, dy, limit) => {
        let s = 0;
        for (let y = 0; y < cell; y++) {
          const a = (y0 + y) * W + x0, b = (y0 + y + dy) * W + x0 + dx;
          for (let x = 0; x < cell; x++) s += Math.abs(now[a + x] - before[b + x]);
          if (s >= limit) return s;
        }
        return s;
      };
      const zero = sad(0, 0, Infinity);
      let best = zero, bx = 0, by = 0;
      const lo = Math.max(-search, -x0), hi = Math.min(search, W - cell - x0), up = Math.max(-search, -y0), down = Math.min(search, H - cell - y0);
      for (let dy = up; dy <= down; dy++) {
        for (let dx = lo; dx <= hi; dx++) {
          if (!dx && !dy) continue;
          const s = sad(dx, dy, best);
          if (s < best || (s === best && dx * dx + dy * dy < bx * bx + by * by)) { best = s; bx = dx; by = dy; }
        }
      }
      if (best > zero * (1 - still.better)) continue;   // not better than no move: flicker
      const i = (r * COLS + c) * 2;
      out[i] = -bx; out[i + 1] = -by;   // the block came from (bx, by): the pixels moved the other way
    }
  }
  return out;
}

/** Where the halo's red sits in one RGB frame: [cx, cy, share] in thousandths of the width, the height and the frame's pixels. */
export function redMass(rgb) {
  let n = 0, sx = 0, sy = 0;
  for (let y = 0, i = 0; y < H; y++) for (let x = 0; x < W; x++, i += 3) if (isHalo(rgb[i], rgb[i + 1], rgb[i + 2])) { n++; sx += x; sy += y; }
  return n ? [Math.round((1000 * sx) / n / W), Math.round((1000 * sy) / n / H), Math.round((1000 * n) / (W * H))] : [500, 500, 0];
}

/**
 * The field of every frame from frames.from to frames.to - 1 (FRAMES unless asked): {frames, flow: Int8Array[], red: [[cx, cy, share]],
 * cuts: [frame], diff: [mad]}.
 */
export async function measure(film, frames = FRAMES) {
  const {from, to} = frames;
  if (!(Number.isInteger(from) && Number.isInteger(to) && from >= 1 && to > from)) throw new Error(`frames ${from} to ${to}: whole frames, the first at least 1`);
  const buf = await decode(film, to), N = W * H * 3;
  if (buf.length < to * N) throw new Error(`the film gave ${Math.floor(buf.length / N)} frames, ${to} wanted`);
  const frame = (n) => buf.subarray(n * N, (n + 1) * N);
  const out = {frames: Object.freeze({from, to}), flow: [], red: [], cuts: [], diff: []};
  let before = grey(frame(from - 1));
  for (let n = from; n < to; n++) {
    const rgb = frame(n), now = grey(rgb), mad = meanDiff(now, before);
    out.diff.push(Math.round(mad * 10) / 10);
    if (mad > STILL.cut) { out.cuts.push(n); out.flow.push(new Int8Array(COLS * ROWS * 2)); } else out.flow.push(flowOf(now, before));
    out.red.push(redMass(rgb));
    before = now;
  }
  return out;
}

/** The mean flow of frames [a, b) over the cells that move: [vx, vy] px a frame, and the share of cells moving. */
export function meanFlow(field, a, b) {
  const from = field.frames?.from ?? FRAMES.from;
  let sx = 0, sy = 0, k = 0, all = 0;
  for (let n = a; n < b; n++) {
    const f = field.flow[n - from];
    for (let i = 0; i < f.length; i += 2) { all++; if (f[i] || f[i + 1]) { k++; sx += f[i]; sy += f[i + 1]; } }
  }
  return k ? [sx / k, sy / k, k / all] : [0, 0, 0];
}

/**
 * The data module's text. The charge's window (FRAMES) writes dolbar-field.js as it always has; another window names its file, its title
 * and its export from WINDOWS (or `name` and `file`), and says the flags that made it.
 */
export function moduleText(field, film, {name, file} = {}) {
  const {from, to} = field.frames ?? FRAMES, charge = from === FRAMES.from && to === FRAMES.to, known = WINDOWS[`${from}-${to}`];
  name ??= known?.name ?? 'FIELD';
  file ??= charge ? 'dolbar-field.js' : `dolbar-field-${from}-${to}.js`;
  const title = known?.title ?? `THE MORPHO-FIELD OF FRAMES ${from} TO ${to}`;
  const how = charge && name === 'FIELD' ? 'tools/morpho-field.mjs (do not edit by hand; run it again).'
    : `tools/morpho-field.mjs\n// --from ${from} --to ${to} --name ${name} (do not edit by hand; run it again).`;
  const bytes = Buffer.concat(field.flow.map((f) => Buffer.from(f.buffer, f.byteOffset, f.byteLength)));
  const b64 = bytes.toString('base64').match(/.{1,120}/g).join("' +\n  '");
  return `// ${file}: ${title}, the film's own measure, written by ${how}
// For each frame from ${from} (${(from * 1001 / 30000).toFixed(3)} s) to ${to} (not included): the optical flow from the frame before, ${COLS} x ${ROWS} cells of
// ${CELL} px over the ${W} x ${H} decode (the grid's corner at ${ORIGIN.join(', ')}), each cell [vx, vy] in px a frame as a signed byte, frame-major then row-major,
// base64; the red mass [cx, cy, share] in thousandths (where the halo's red sits in the frame); the cuts (frames with no flow). Read off ${path.basename(film)}.
export const ${name} = Object.freeze({from: ${from}, to: ${to}, decode: [${W}, ${H}], cell: ${CELL}, grid: [${COLS}, ${ROWS}], origin: [${ORIGIN.join(', ')}],
  cuts: [${field.cuts.join(', ')}],
  red: [${field.red.map((r, i) => (i % 12 === 0 ? '\n    ' : '') + '[' + r.join(',') + ']').join(', ')}],
  flow: '${b64}',
});
`;
}

async function main() {
  const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const film = path.resolve(opt('--film', path.join(HERE, '../app/saint-seiya.mp4'))), out = opt('--out', null);
  const frames = {from: Number(opt('--from', FRAMES.from)), to: Number(opt('--to', FRAMES.to))}, name = opt('--name', undefined);
  const t0 = performance.now(), field = await measure(film, frames), ms = performance.now() - t0, fps = 30000 / 1001;
  console.log(`cuts (mean abs diff over ${STILL.cut}): ${field.cuts.map((n) => `${n} (${(n / fps).toFixed(3)} s)`).join(', ') || 'none'}`);
  const top = field.diff.map((d, i) => [d, frames.from + i]).sort((a, b) => b[0] - a[0]).slice(0, 8);
  console.log(`largest frame differences: ${top.map(([d, n]) => `${n}:${d}`).join('  ')}`);
  // the charge's spans, read by eye; any other window is told between its cuts
  const charge = frames.from === FRAMES.from && frames.to === FRAMES.to;
  const spans = charge ? [[134, 162, 'the flood over Dolbar'], [162, 192, 'Seiya in the pink light'], [192, 250, 'back to Dolbar, the blast let go'], [250, 331, 'the streaks, the hand, the sacrifice']]
    : [frames.from, ...field.cuts.filter((n) => n > frames.from), frames.to].map((a, i, all) => [a, all[i + 1], `${(a / fps).toFixed(3)} to ${((all[i + 1] ?? a) / fps).toFixed(3)} s`]).filter(([a, b]) => b > a);
  for (const [a, b, what] of spans) {
    const [vx, vy, moving] = meanFlow(field, a, b);
    const reds = field.red.slice(a - frames.from, b - frames.from), cx = reds.reduce((s, r) => s + r[0], 0) / reds.length, cy = reds.reduce((s, r) => s + r[1], 0) / reds.length;
    console.log(`${a}-${b} ${what}: mean flow ${vx.toFixed(2)}, ${vy.toFixed(2)} px/frame over ${(100 * moving).toFixed(0)} % of cells; red mass at ${cx.toFixed(0)}, ${cy.toFixed(0)} thousandths`);
  }
  console.log(`${field.flow.length} frames measured in ${ms.toFixed(0)} ms`);
  if (out) { fs.writeFileSync(out, moduleText(field, film, {name, file: charge ? undefined : path.basename(out)})); console.log(`wrote ${out} (${fs.statSync(out).size} bytes)`); }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

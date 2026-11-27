#!/usr/bin/env node
// film-layers.mjs: THE FILM IN DEPTH, its layers cut once offline: every frame of the cloth's sequence on the mint (58.8 to 71 s) told into four
// layers, each a plane at its own depth for his moving head (app/dl-depth.js). His words, Oct 18 2026 WEST: 01:55, over four frames of the clad
// (the greaves, the belt with the lightning, the arm and hip, the shoulder with the lightning): "what i am trying to do here is trying to provoke
// some depth effect with the camera where based on head moving aroudn we can cause nintendo 3Ds typa shit you get what i mean or not dude?";
// 03:04: "there are tthose things including cloth but also flashes and such... all i am saying: why the hell dont we make it likd nintendo 3Ds my
// dude?"; Oct 4 07:32: "do you know how the 3DS work the nintendo 3Ds with depth map estimators and screen that evolves at runtime", 07:34 "yeah but
// it's parallax effect, not?". The warden's road of 01:56: the cels as planes.
// THE LAYERS (a label a pixel of the picture alone, 796 x 532 from 82, 4): 0 the back (the speed lines, the backdrop, the pillar of light, the space,
// the glare), 1 his body (skin, his red clothes, his hair), 2 the cloth (its gold and orange and its shading; in the shots of him being clad also its
// dark navy and green and its cream plates), 3 the flashes (the lightning, the sparks: thin, bright, pale). The cut follows the drawing's own edges:
// the frame is cut into cells along its colour gradient (tools/cloth-segment.mjs cellsOf: a cell never crosses an ink line or a fill's edge), each
// cell takes a layer by its mean colour and the shot it is in (SHOTS: which colours are which there), a cream cell is the cloth's when most of its
// boundary is the cloth's (the belt's white plates) and the light's otherwise; the flashes are cut pixel by pixel (a luma over FLASH.luma, a saturation
// under FLASH.sat and over its 9 x 9 mean by FLASH.lift, then a pixel round), never cell by cell: a bolt is thinner than a cell.
// THE FILE (app/saint-seiya.layers.bin, beside the film; stripped before GitHub like it): 'LYR1', u16 width, u16 height, u32 first frame, u32 frames,
// then per frame u32 offset and u32 length of its chunk (a frame whose labels equal the one before points at the same chunk: the anime holds its
// drawings), then the chunks: the labels four to a byte (two bits each, the first pixel in the low bits), raw deflate (the browser's DecompressionStream
// 'deflate-raw' reads it).
// COST: a frame's cells in about 0.3 s, its labels in tens of ms: the span's 367 frames in about two minutes on the new Mac, once. The page decodes a
// frame's 106 KB in about a millisecond, ahead of the playhead.
//   nice -n 19 node tools/film-layers.mjs [--film app/saint-seiya.mp4] [--out app/saint-seiya.layers.bin] [--sheet <dir>]
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {W, H, cellsOf, hsv, save} from './cloth-segment.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const FPS = 30000 / 1001;
export const LAYERS = Object.freeze(['back', 'body', 'cloth', 'flash']);
export const SPAN = Object.freeze({from: 1762, to: 2128});   // 58.79 to 71.00 s: Athena on the ground, the flames, the pillar, Seiya, the burst, the clad
// THE SHOTS (frames of the film, read off the film frame by frame): what is drawn there decides which colours are which layer
export const SHOTS = Object.freeze([
  {from: 1762, to: 1769, kind: 'athena'},   // Athena on the ground, before the cut to the flames
  {from: 1770, to: 1805, kind: 'flames'},   // the cloth in flames: the flames before it, the nearest layer
  {from: 1806, to: 1843, kind: 'cloth'},    // the cloth whole in the pillar of light
  {from: 1844, to: 1879, kind: 'seiya'},    // Seiya in the light: his face, his torso, his legs
  {from: 1880, to: 1909, kind: 'cloth'},    // the cloth in the pillar again, about to burst
  {from: 1910, to: 1944, kind: 'burst'},    // the burst: its pieces in the glare and the space
  {from: 1945, to: 2128, kind: 'clad'},     // the cloth clads him: legs, waist, arms, chest, shoulders, the helm, the whole figure
].map(Object.freeze));
export const FLASH = Object.freeze({luma: 200, sat: .3, lift: 24});
export const PALE_SHARE = .4;
export const kindAt = (n) => SHOTS.find((s) => n >= s.from && n <= s.to)?.kind ?? 'clad';

/** A cell's layer by its mean colour in a shot of `kind`; a pale cell ('pale': a highlight, a cream plate, a white of his jeans) is decided by its
 *  neighbours (labelsOf). The colours, read off the frames: the cloth's gold and orange are saturated (0.6 and over; the backdrop's khaki and its
 *  speed lines, of the same hues, are at 0.3 to 0.5), the light (the pillar, the burst's glow) is bright and washed, his skin is light. */
export function layerOf({rgb: [r, g, b], hsv: [h, s, v]}, kind) {
  const gold = h >= 22 && h <= 72 && s >= .6 && v >= .12;
  const light = v > .88 && s < .7;
  const skin = h >= 8 && h <= 32 && s >= .2 && s <= .6 && v >= .68;
  const red = (h <= 14 || h >= 340) && s >= .45 && v >= .25;
  const hair = v < .17;
  const blue = h >= 190 && h <= 250 && s >= .25 && v >= .2;
  const lilac = h >= 250 && h <= 320 && s >= .2 && v >= .3;
  const navy = v <= .55 && v >= .17 && (b > r + 6 || (g > r + 4 && g > b));
  const pale = v > .75 && s < .45;
  if (kind === 'athena') return skin || red || lilac ? 1 : pale ? 'pale' : 0;
  // Seiya in the light: the light (bright, yellow, washed) and its dark edge are the back, and everything else is him (lit, his skin turns yellow)
  if (kind === 'seiya') return (v > .85 && h >= 40 && h <= 70 && s > .2) || (v < .5 && s > .35 && h >= 25 && h <= 65) ? 0 : 1;
  if (kind === 'flames') return gold && !light ? (h < 36 ? 3 : 2) : 0;
  if (kind === 'burst' || kind === 'cloth') return gold && !light ? 2 : pale && !light ? 'pale' : 0;
  // the clad: the cloth's gold, orange and navy; his skin, clothes and hair; its cream plates and highlights by their neighbours
  if (gold && !light) return 2;
  if (navy) return 2;
  if (skin || red || hair) return 1;
  return pale ? 'pale' : 0;
}

/** The labels of one frame (RGB 796 x 532): a byte a pixel, 0 to 3. */
export function labelsOf(rgb, n) {
  const kind = kindAt(n), {label, cells} = cellsOf(rgb), C = cells.length;
  const of = cells.map((c) => (c.n ? layerOf(c, kind) : 0));
  // pale regions (a cream plate, a white of his jeans, a highlight: adjacent pale cells together): the layer, the cloth's or his body's, that holds
  // PALE_SHARE or more of the region's outer boundary, else the back's (the light)
  if (of.includes('pale')) {
    const parent = Array.from({length: C}, (_, i) => i), find = (i) => { while (parent[i] !== i) { parent[i] = parent[parent[i]]; i = parent[i]; } return i; };
    const join = (o, p) => { const a = label[o], c = label[p]; if (a !== c && of[a] === 'pale' && of[c] === 'pale') { const ra = find(a), rc = find(c); if (ra !== rc) parent[ra] = rc; } };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = y * W + x; if (x < W - 1) join(o, o + 1); if (y < H - 1) join(o, o + W); }
    const by = new Map(), add = (cell, other) => { const r = find(cell); let t = by.get(r); if (!t) by.set(r, t = [0, 0, 0, 0]); t[other === 'pale' ? 0 : other]++; };
    const tally = (o, p) => { const a = label[o], c = label[p]; if (a === c) return; if (of[a] === 'pale' && of[c] !== 'pale') add(a, of[c]); if (of[c] === 'pale' && of[a] !== 'pale') add(c, of[a]); };
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) { const o = y * W + x; if (x < W - 1) tally(o, o + 1); if (y < H - 1) tally(o, o + W); }
    const pick = new Map(); for (const [r, t] of by) { const sum = t.reduce((x, y) => x + y, 0) || 1, k = t[2] >= t[1] ? 2 : 1; pick.set(r, t[k] >= PALE_SHARE * sum ? k : 0); }
    for (let i = 0; i < C; i++) if (of[i] === 'pale') of[i] = pick.get(find(i)) ?? 0;
  }
  const cut = new Uint8Array(W * H);
  for (let o = 0; o < W * H; o++) cut[o] = of[label[o]] === 'pale' ? 0 : of[label[o]];
  // a 5 x 5 majority over the layers (a lone cell of the backdrop read as cloth goes; an edge moves a pixel at most)
  const out = new Uint8Array(W * H);
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const n = [0, 0, 0, 0];
    for (let dy = -2; dy <= 2; dy++) { const yy = Math.min(H - 1, Math.max(0, y + dy)); for (let dx = -2; dx <= 2; dx++) n[cut[yy * W + Math.min(W - 1, Math.max(0, x + dx))]]++; }
    let best = cut[y * W + x]; for (let k = 0; k < 4; k++) if (n[k] > n[best]) best = k; out[y * W + x] = best;
  }
  // the flashes, pixel by pixel: bright, pale, and brighter than their neighbourhood (a bolt, a spark; never the pillar's wide light)
  const lum = new Float32Array(W * H), sat = new Float32Array(W * H);
  for (let o = 0; o < W * H; o++) { const R = rgb[3 * o], G = rgb[3 * o + 1], B = rgb[3 * o + 2], mx = Math.max(R, G, B), mn = Math.min(R, G, B); lum[o] = .299 * R + .587 * G + .114 * B; sat[o] = mx ? (mx - mn) / mx : 0; }
  const row = new Float32Array(W * H), mean = new Float32Array(W * H), R4 = 4;
  for (let y = 0; y < H; y++) { let s = 0, c = 0; for (let x = -R4; x < W + R4; x++) { if (x + R4 < W) { s += lum[y * W + x + R4]; c++; } if (x - R4 - 1 >= 0) { s -= lum[y * W + x - R4 - 1]; c--; } if (x >= 0 && x < W) row[y * W + x] = s / c; } }
  for (let x = 0; x < W; x++) { let s = 0, c = 0; for (let y = -R4; y < H + R4; y++) { if (y + R4 < H) { s += row[(y + R4) * W + x]; c++; } if (y - R4 - 1 >= 0) { s -= row[(y - R4 - 1) * W + x]; c--; } if (y >= 0 && y < H) mean[y * W + x] = s / c; } }
  const flash = new Uint8Array(W * H);
  for (let o = 0; o < W * H; o++) if (lum[o] > FLASH.luma && sat[o] < FLASH.sat && lum[o] - mean[o] > FLASH.lift) flash[o] = 1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    const o = y * W + x; if (out[o] === 3) continue;
    if (flash[o] || (x > 0 && flash[o - 1]) || (x < W - 1 && flash[o + 1]) || (y > 0 && flash[o - W]) || (y < H - 1 && flash[o + W])) out[o] = 3;
  }
  return out;
}
/** Four labels to a byte, the first pixel in the low bits. */
export function pack(labels) { const out = new Uint8Array(Math.ceil(labels.length / 4)); for (let i = 0; i < labels.length; i++) out[i >> 2] |= (labels[i] & 3) << ((i & 3) * 2); return out; }
export function unpack(bytes, count) { const out = new Uint8Array(count); for (let i = 0; i < count; i++) out[i] = (bytes[i >> 2] >> ((i & 3) * 2)) & 3; return out; }
/** The file's bytes from the frames' packed labels (equal neighbours share a chunk). */
export function fileOf(packed, from) {
  const count = packed.length, head = 16 + 8 * count, chunks = [], index = [];
  let off = head, prev = null, prevAt = null;
  for (const p of packed) {
    if (prev && p.length === prev.length && p.every((v, i) => v === prev[i])) { index.push(prevAt); continue; }
    const z = zlib.deflateRawSync(Buffer.from(p), {level: 9}); chunks.push(z); prevAt = [off, z.length]; index.push(prevAt); off += z.length; prev = p;
  }
  const h = Buffer.alloc(head); h.write('LYR1', 0, 'latin1'); h.writeUInt16LE(W, 4); h.writeUInt16LE(H, 6); h.writeUInt32LE(from, 8); h.writeUInt32LE(count, 12);
  index.forEach(([o, l], i) => { h.writeUInt32LE(o, 16 + 8 * i); h.writeUInt32LE(l, 20 + 8 * i); });
  return Buffer.concat([h, ...chunks]);
}
/** The file read back: {w, h, from, count, frame(i) -> labels}. */
export function readFile(buf) {
  if (buf.toString('latin1', 0, 4) !== 'LYR1') throw new Error('not a layers file');
  const w = buf.readUInt16LE(4), h = buf.readUInt16LE(6), from = buf.readUInt32LE(8), count = buf.readUInt32LE(12);
  return {w, h, from, count, frame: (i) => { const o = buf.readUInt32LE(16 + 8 * i), l = buf.readUInt32LE(20 + 8 * i); return unpack(zlib.inflateRawSync(buf.subarray(o, o + l)), w * h); }};
}

const decodeFrames = (film, from, to) => new Promise((res, rej) => {
  const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-i', film, '-an', '-fps_mode', 'passthrough', '-vf', `select='between(n\\,${from}\\,${to})',crop=796:532:82:4,format=rgb24`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], {stdio: ['ignore', 'pipe', 'inherit']});
  const chunks = []; ff.stdout.on('data', (c) => chunks.push(c)); ff.on('close', (c) => (c ? rej(new Error(`ffmpeg ${c}`)) : res(Buffer.concat(chunks))));
});
const TINT = [[20, 20, 28], [235, 150, 140], [255, 205, 40], [80, 230, 255]];

async function main() {
  const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const film = path.resolve(opt('--film', path.join(HERE, '../app/saint-seiya.mp4'))), out = opt('--out', path.join(HERE, '../app/saint-seiya.layers.bin')), sheetDir = opt('--sheet', null);
  const t0 = performance.now(), raw = await decodeFrames(film, SPAN.from, SPAN.to), N = W * H * 3, count = raw.length / N;
  if (count !== SPAN.to - SPAN.from + 1) throw new Error(`the film gave ${count} frames, ${SPAN.to - SPAN.from + 1} wanted`);
  const packed = [], share = [0, 0, 0, 0], t1 = performance.now(), keep = sheetDir ? new Map() : null;
  const picks = new Set([1772, 1800, 1830, 1860, 1905, 1919, 1934, 1941, 1951, 1965, 1988, 2030, 2042, 2054, 2090, 2120]);
  for (let i = 0; i < count; i++) {
    const n = SPAN.from + i, rgb = raw.subarray(i * N, (i + 1) * N), labels = labelsOf(rgb, n);
    for (let o = 0; o < W * H; o++) share[labels[o]]++;
    packed.push(pack(labels));
    if (keep && picks.has(n)) keep.set(n, {rgb: Buffer.from(rgb), labels});
    if (i % 60 === 0) console.log(`frame ${n} (${kindAt(n)}): ${((performance.now() - t1) / (i + 1)).toFixed(0)} ms a frame`);
  }
  const file = fileOf(packed, SPAN.from); fs.writeFileSync(out, file);
  const total = share.reduce((a, b) => a + b, 0);
  console.log(`${count} frames in ${((performance.now() - t0) / 1000).toFixed(1)} s; ${out}: ${file.length} bytes; the layers' shares: ${LAYERS.map((k, i) => `${k} ${(share[i] / total * 100).toFixed(1)} %`).join(', ')}`);
  const back = readFile(file); for (let i = 0; i < count; i += 37) { const a = back.frame(i), b = unpack(packed[i], W * H); if (!a.every((v, k) => v === b[k])) throw new Error(`frame ${SPAN.from + i} reads back wrong`); }
  if (keep) {
    fs.mkdirSync(sheetDir, {recursive: true});
    for (const [n, {rgb, labels}] of keep) {
      const pic = Buffer.alloc(W * H * 6);
      for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
        const o = y * W + x, L = labels[o], edge = (x > 0 && labels[o - 1] !== L) || (y > 0 && labels[o - W] !== L);
        for (let c = 0; c < 3; c++) { pic[6 * y * W + 3 * x + c] = rgb[3 * o + c]; pic[6 * y * W + 3 * W + 3 * x + c] = edge ? 255 : Math.round(TINT[L][c] * .55 + rgb[3 * o + c] * .45); }
      }
      await save(pic, W * 2, H, path.join(sheetDir, `layers-${n}.png`));
    }
    console.log(`sheets: ${[...keep.keys()].join(', ')}`);
  }
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

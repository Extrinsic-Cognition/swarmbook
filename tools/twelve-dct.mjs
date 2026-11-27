#!/usr/bin/env node
// twelve-dct.mjs: THE TWELVE, DCT-ALIGNED TO THE ANIME AND TO THE SPIRIT OF THE MUSIC: the film and the song over THE TWELVE's span, measured once,
// here, off app/saint-seiya.mp4 and app/saint-seiya.m4a; the page only reads them (lab/twelve-dct.js, read by lab/sagittarius-flight.mjs by the
// film's second). His word, Oct 17 2026 20:3x WEST, over the hero after the second burst (THE TWELVE in a ring about a black hole at the picture's
// middle while the film shows the beam of gold light and the god's statue): "what the fuck is this schizophrenic scene dude? dont you realize that
// moment is a manifestation of holy divine power? only the pure of heart can weikld such powwr... the dodecaheron faces must begin to be aligned
// with the DCTs of the anime dude the spirit of the music". What he means by DCT aligned, in his words: Oct 12 21:4x "the oscillations here are not
// DCT aligned to the music tbh... like you know in advance how it is going to oscillate"; Oct 12 11:3x "is there really no DCT study on frequencies
// of songs and climaxes"; Oct 14 16:0x "make sure to DCT align the red halo with the spasms of saint seya eh" (tools/ko-spasms.mjs, the house's
// first: the AC energy of the 8 x 8 DCT of each frame's change, measured once). This one records where, and which way, as well as how much.
//
// THE FILM over THE TWELVE, read frame by frame (Oct 17 2026; its cuts by ffmpeg's scene score, 0.51 at 1269 and 0.40 at 1362):
//   1269 (42.342 s) the cut to the cliff: the stormy sky, the god's statue on the cliff's top at the right, the golden Sagittarius a green-gold
//        cross of light up and left of the middle (0.34, 0.21 of the picture), twinkling;
//   1291 to 1301 a beam of the same light crosses the sky from the lower left to the star;
//   1302 to 1311 the star bursts into a fan of rays down over the cliff; 1312 to 1319 the fan draws back into the star;
//   1320 to 1361 the rays open all round from the star (0.43, 0.14), a new drawing every two or three frames, the light throbbing about four times
//        a second;
//   1362 (45.445 s) the cut to the white-gold burst at the middle of the picture, its rays drawn anew every three frames; 1380 the wall.
// THE MEASURE, the film: decoded once (ffmpeg, area scaling, every frame as it is) to the picture alone (796 x 532 from 82, 4) at 400 x 264, RGB.
//   For each 8 x 8 block: the DC terms of its red, green and blue DCTs (the block's colour) give its GOLD, the light of the beam, the star and the rays
//   (yellow over blue, times its brightness: the white-blue clouds count nothing); its luminance's AC structure gives its ORIENTATION (its horizontal
//   against its vertical AC energy and the diagonal's sign: the 2 x 2 tensor of its gradients, whose diagonal is the AC energy of its DCT weighted by
//   frequency across and down); the DCT of its change from the frame before gives its MOTION (ko-spasms.mjs's AC energy, sum(d^2) - sum(d)^2 / 64).
//   Then, for each frame:
//   source   the point the gold light's oriented structure converges on: each gold block a line through its middle along its orientation; from the
//            best supported crossing of the strongest lines two by two, the point nearest all of them (least squares, each line weighted by its gold
//            and how oriented it is, five Cauchy reweightings so the cliff's lit edges do not pull it; the frame before's source breaks a tie):
//            the star the rays come out of, the head of the beam, the burst's middle
//   light    how much gold the frame holds (its blocks' mean gold)
//   change   how much the drawing moved (the change's AC energy per pixel; a cut is 0: a change of shot, not of a drawing)
//   and about two points, the source and the picture's middle: the twelve sectors of 30 degrees clockwise from twelve o'clock (digits, 0 to 9 of the
//   frame's fullest), the gold light's share in each (WHERE THE LIGHT IS) and the change's AC energy in each (WHERE THE DRAWING MOVED), and the gold's
//   reach (its gold-weighted mean distance from the point, picture heights).
// THE MEASURE, the song: decoded once to mono 48 kHz; a 2048-point Hann window every 1/120 s; for each frame of the film, at its second:
//   db       its loudness (the window's RMS, dB)
//   onset    its attack: the largest spectral flux (the rise of the log magnitude, 40 Hz to 8 kHz, summed over the bins) of the hops inside the frame
//   swell    the brass and the choir: the energy of 320 to 2560 Hz (dB), where the score's climax into the golden flash builds
//   node twelve-dct.mjs [--film <mp4>] [--song <m4a>] [--span sky|seiya] [--out <lab/twelve-dct.js | lab/twelve-seiya-dct.js>]     prints the
//     measure of the span (SPANS; sky by default); --out writes the data module the page imports
// COST: one ffmpeg decode of 114 frames at 400 x 264 and of 6.5 s of the song, and well under a second of arithmetic: run it once, niced, on the
// new Mac (`time` in lab/MINT-FREEZE.md). The page computes nothing of it.
import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const FPS = 30000 / 1001;
export const W = 400, H = 264, BX = W / 8, BY = H / 8, ASPECT = 796 / 532;   // the picture alone, in blocks; its width over its height
export const FRAMES = Object.freeze({from: 1269, to: 1381});   // THE TWELVE: the cut to the cliff, to the frame after the wall (1380)
export const CUTS = Object.freeze([1269, 1362]);               // the cut to the cliff and the cut to the golden burst: changes of shot
export const SONG = Object.freeze({rate: 48000, from: 41, seconds: 6.5, n: 2048, hop: 1 / 120});
export const SECTORS = 12;
// THE SPANS this tool measures (--span). sky: THE TWELVE above. seiya: THE TWELVE ON SEIYA (lab/seiya-flight.mjs, his Oct 21 2026 WEST words there),
// read off the film Oct 21 2026 (the cuts by ffmpeg's scene score over 0.3): 2172 (72.472 s) the cut to Athena's shot over her hair, Seiya small on the
// ground at its lower left and the column of gold still rising off him (its rays converge at his feet), gone in about thirteen frames; to the frame
// before the cut to Dolbar on the rocks (2247, 74.975 s), where the page's dodecahedron is back. `hold`: below that much gold (the frame's mean) the
// source is held at `at` (else where the frame before had it) and the frame has no light to count in its sectors; its motion is counted about that
// place. seiya's `at` is his figure's middle (picture heights, x across, y down), read off frames 2190 to 2246, where he stands still: his gold cloth's
// pixels from 0.654 to 0.684 down at 0.166 across, his feet at the column's source (0.785), his head just above the cloth. The sky's measure has no
// hold: it is as it was.
export const SPANS = Object.freeze({
  sky: Object.freeze({frames: FRAMES, cuts: CUTS, song: SONG, hold: 0, file: 'twelve-dct.js', name: 'TWELVE_DCT', what: 'THE TWELVE\'s'}),
  seiya: Object.freeze({frames: Object.freeze({from: 2172, to: 2247}), cuts: Object.freeze([2172, 2247]), song: Object.freeze({...SONG, from: 71, seconds: 5}),
    hold: 1, at: Object.freeze([.166 * ASPECT, .71]), file: 'twelve-seiya-dct.js', name: 'TWELVE_SEIYA_DCT', what: 'THE TWELVE ON SEIYA\'s'}),
});

/** The orthonormal 8-point DCT-II matrix, row k the k-th basis. */
export const DCT8 = (() => { const c = new Float64Array(64); for (let k = 0; k < 8; k++) for (let n = 0; n < 8; n++) c[k * 8 + n] = (k ? Math.sqrt(2 / 8) : Math.sqrt(1 / 8)) * Math.cos(Math.PI * (2 * n + 1) * k / 16); return c; })();
/** The 8 x 8 DCT of a block of `src` (stride w) at x, y: out[v * 8 + u], u across, v down. */
export function dct8(src, w, x, y, out = new Float64Array(64), tmp = new Float64Array(64)) {
  for (let j = 0; j < 8; j++) for (let u = 0; u < 8; u++) { let s = 0; for (let i = 0; i < 8; i++) s += DCT8[u * 8 + i] * src[(y + j) * w + x + i]; tmp[j * 8 + u] = s; }
  for (let v = 0; v < 8; v++) for (let u = 0; u < 8; u++) { let s = 0; for (let j = 0; j < 8; j++) s += DCT8[v * 8 + j] * tmp[j * 8 + u]; out[v * 8 + u] = s; }
  return out;
}
/** A block's gold from its DC terms (its mean red, green, blue, 0 to 255): yellow over blue times brightness. */
export const goldOf = (r, g, b) => Math.max(0, (r + g) / 2 - b - 8) * Math.max(0, 0.299 * r + 0.587 * g + 0.114 * b - 60) / 195;
/** A block's AC structure from its luminance (stride w): {jxx, jyy, jxy} the sums of its gradients' products, the orientation of its lines `along`
 *  (radians, the doubled-angle mean, y down) and how oriented it is, `coherence` 0 (no direction) to 1 (one line). */
export function structure(lum, w, x, y) {
  let jxx = 0, jyy = 0, jxy = 0;
  for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) {
    const o = (y + j) * w + x + i, gx = i < 7 ? lum[o + 1] - lum[o] : lum[o] - lum[o - 1], gy = j < 7 ? lum[o + w] - lum[o] : lum[o] - lum[o - w];
    jxx += gx * gx; jyy += gy * gy; jxy += gx * gy;
  }
  const tr = jxx + jyy, diff = Math.hypot(jxx - jyy, 2 * jxy);
  // the gradients' main direction is across the lines: the lines run a quarter turn from it
  return {jxx, jyy, jxy, along: 0.5 * Math.atan2(2 * jxy, jxx - jyy) + Math.PI / 2, coherence: tr > 0 ? diff / tr : 0};
}
/** The change's AC energy in a block (ko-spasms.mjs blockAc), from two luminance frames. */
export function blockAc(prev, next, w, x, y) {
  let s = 0, s2 = 0;
  for (let j = 0; j < 8; j++) { const o = (y + j) * w + x; for (let i = 0; i < 8; i++) { const d = next[o + i] - prev[o + i]; s += d; s2 += d * d; } }
  return s2 - (s * s) / 64;
}

/** How well a point explains the lines: the sum of their weights, each cut by its distance from the point (Cauchy, sigma). */
const support = (lines, at, sigma) => lines.reduce((s, l) => { const r = -l.d[1] * (at[0] - l.p[0]) + l.d[0] * (at[1] - l.p[1]); return s + l.w / (1 + (r / sigma) ** 2); }, 0);
/** The point the lines converge on: lines [{p: [x, y], d: [dx, dy] unit, w}] (picture heights). It starts from the best supported of the prior and
 *  the crossings of the strongest lines two by two (so a third of the lines going elsewhere cannot drag it), then five Cauchy reweightings; the
 *  prior only breaks the tie along what the lines leave open (one line alone: the point on it nearest the prior), at `pull` of their weight. */
export function converge(lines, prior, {sigma = 0.035, pull = 0.002, rounds = 5, strongest = 24} = {}) {
  const top = [...lines].sort((p, q) => q.w - p.w).slice(0, strongest);
  let at = [...prior], best = support(lines, prior, sigma);
  for (let i = 0; i < top.length; i++) for (let j = i + 1; j < top.length; j++) {
    const a = top[i], b = top[j], det = a.d[0] * b.d[1] - a.d[1] * b.d[0];
    if (Math.abs(det) < .2) continue;   // nearly parallel: their crossing says little
    const u = ((b.p[0] - a.p[0]) * b.d[1] - (b.p[1] - a.p[1]) * b.d[0]) / det, x = [a.p[0] + u * a.d[0], a.p[1] + u * a.d[1]];
    if (x[0] < -.5 || x[0] > 2 || x[1] < -.5 || x[1] > 1.5) continue;
    const s = support(lines, x, sigma);
    if (s > best) { best = s; at = x; }
  }
  for (let k = 0; k < rounds; k++) {
    const total = support(lines, at, sigma) || 1;
    let a = pull * total, b = 0, c = pull * total, bx = pull * total * prior[0], by = pull * total * prior[1];
    for (const l of lines) {
      const n = [-l.d[1], l.d[0]], r = n[0] * (at[0] - l.p[0]) + n[1] * (at[1] - l.p[1]), w = l.w / (1 + (r / sigma) ** 2);
      const q = n[0] * l.p[0] + n[1] * l.p[1];
      a += w * n[0] * n[0]; b += w * n[0] * n[1]; c += w * n[1] * n[1]; bx += w * n[0] * q; by += w * n[1] * q;
    }
    const det = a * c - b * b;
    if (!(Math.abs(det) > 1e-12)) break;
    at = [(c * bx - b * by) / det, (a * by - b * bx) / det];
  }
  return at;
}

/** Twelve sectors about a point, clockwise from twelve o'clock (y down), of values at the blocks: [{p, v}] -> twelve sums, and the v-weighted reach. */
export function sectorsOf(blocks, at, {near = 0.04} = {}) {
  const out = new Float64Array(SECTORS);
  let reach = 0, total = 0;
  for (const {p, v} of blocks) {
    if (!(v > 0)) continue;
    const dx = p[0] - at[0], dy = p[1] - at[1], d = Math.hypot(dx, dy);
    if (d < near) continue;
    const clock = ((Math.atan2(dx, -dy) / (2 * Math.PI)) % 1 + 1) % 1;   // 0 at twelve o'clock, a quarter at three
    out[Math.min(SECTORS - 1, Math.floor(clock * SECTORS))] += v; reach += v * d; total += v;
  }
  return {sectors: out, reach: total ? reach / total : 0, total};
}
/** Twelve sums as digits 0 to 9 of their largest (a string of twelve). */
export const digits = (s) => { const m = Math.max(...s); return [...s].map((v) => (m > 0 ? Math.min(9, Math.round(9 * v / m)) : 0)).join(''); };

/** One frame of the film measured: rgb (W x H x 3) and the frame before's luminance; prior the frame before's source; hold and at: below `hold` of
 *  gold (the frame's mean) the source is `at` (else the prior's, when there is one) and the frame's light sectors are empty (a span's, SPANS). */
export function measureFrame(rgb, prevLum, prior, {cut = false, hold = 0, at = null} = {}) {
  const lum = new Float64Array(W * H);
  for (let i = 0; i < W * H; i++) lum[i] = 0.299 * rgb[i * 3] + 0.587 * rgb[i * 3 + 1] + 0.114 * rgb[i * 3 + 2];
  const blocks = [], lines = [];
  let light = 0, change = 0, cx = 0, cy = 0, gsum = 0;
  const out = new Float64Array(3);
  for (let by = 0; by < BY; by++) for (let bx = 0; bx < BX; bx++) {
    const x = bx * 8, y = by * 8;
    // the block's colour: the DC term of each channel's DCT, over 8 (its mean: an orthonormal 8 x 8 DCT's DC is the block's sum over 8)
    out[0] = out[1] = out[2] = 0;
    for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) { const o = ((y + j) * W + x + i) * 3; out[0] += rgb[o]; out[1] += rgb[o + 1]; out[2] += rgb[o + 2]; }
    out[0] /= 64; out[1] /= 64; out[2] /= 64;
    const gold = goldOf(out[0], out[1], out[2]), s = structure(lum, W, x, y), moved = prevLum ? blockAc(prevLum, lum, W, x, y) : 0;
    const p = [((bx + 0.5) / BX) * ASPECT, (by + 0.5) / BY];   // picture heights, y down
    blocks.push({p, gold, moved});
    light += gold; change += moved; cx += gold * p[0]; cy += gold * p[1]; gsum += gold;
    if (gold > 2 && s.coherence > 0.3) lines.push({p, d: [Math.cos(s.along), Math.sin(s.along)], w: gold * s.coherence});
  }
  const centroid = gsum > 0 ? [cx / gsum, cy / gsum] : [ASPECT / 2, 0.5];
  const held = Boolean(at ?? prior) && light / blocks.length < hold;
  const source = held ? (at ?? prior) : lines.length >= 3 ? converge(lines, prior ?? centroid) : (prior ?? centroid);
  const inside = [Math.min(ASPECT, Math.max(0, source[0])), Math.min(1, Math.max(0, source[1]))];
  const about = (point, dark = false) => {
    const l = sectorsOf(blocks.map((b) => ({p: b.p, v: b.gold})), point), m = sectorsOf(blocks.map((b) => ({p: b.p, v: b.moved})), point);
    return {sectors: dark ? '000000000000' : digits(l.sectors), moves: cut ? '000000000000' : digits(m.sectors), reach: l.reach};
  };
  return {lum, source: inside, light: light / blocks.length, change: cut ? 0 : change / (W * H), lines: lines.length,
    light_about: about(inside, held), centre_about: about([ASPECT / 2, 0.5])};
}

/** In-place radix-2 FFT. */
export function fft(re, im) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) { let b = n >> 1; for (; j & b; b >>= 1) j ^= b; j ^= b; if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; } }
  for (let len = 2; len <= n; len <<= 1) {
    const a = -2 * Math.PI / len, wr = Math.cos(a), wi = Math.sin(a);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const ur = re[i + k], ui = im[i + k], vr = re[i + k + len / 2] * cr - im[i + k + len / 2] * ci, vi = re[i + k + len / 2] * ci + im[i + k + len / 2] * cr;
        re[i + k] = ur + vr; im[i + k] = ui + vi; re[i + k + len / 2] = ur - vr; im[i + k + len / 2] = ui - vi;
        const nr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = nr;
      }
    }
  }
}

/** The song at each frame of THE TWELVE: pcm (mono, SONG.rate, from SONG.from s) -> [{db, onset, swell}]. */
export function measureSong(pcm, frames = FRAMES, song = SONG) {
  const {rate, n} = song, hop = Math.round(rate * song.hop), win = new Float64Array(n).map((_, i) => 0.5 - 0.5 * Math.cos(2 * Math.PI * i / n));
  const lo = Math.ceil(40 * n / rate), hi = Math.floor(8000 * n / rate), s0 = Math.ceil(320 * n / rate), s1 = Math.floor(2560 * n / rate);
  const spectrum = (centre) => {
    const re = new Float64Array(n), im = new Float64Array(n);
    for (let i = 0; i < n; i++) { const k = centre - n / 2 + i; re[i] = (k >= 0 && k < pcm.length ? pcm[k] : 0) * win[i]; }
    fft(re, im);
    const mag = new Float64Array(n / 2); for (let i = 0; i < n / 2; i++) mag[i] = Math.hypot(re[i], im[i]);
    return mag;
  };
  const out = [];
  for (let f = frames.from; f < frames.to; f++) {
    const t = f / FPS, centre = Math.round((t - song.from) * rate);
    // the frame's hops: from half a frame before its second to half a frame after
    let onset = 0;
    for (let c = centre - Math.round(rate / FPS / 2); c < centre + Math.round(rate / FPS / 2); c += hop) {
      const a = spectrum(c - hop), b = spectrum(c);
      let flux = 0; for (let i = lo; i <= hi; i++) flux += Math.max(0, Math.log1p(b[i]) - Math.log1p(a[i]));
      onset = Math.max(onset, flux);
    }
    const mag = spectrum(centre);
    let e = 0, sw = 0; for (let i = 1; i < n / 2; i++) { e += mag[i] * mag[i]; if (i >= s0 && i <= s1) sw += mag[i] * mag[i]; }
    let rms = 0; for (let i = centre - n / 2; i < centre + n / 2; i++) rms += (pcm[i] ?? 0) ** 2;
    out.push({db: 20 * Math.log10(Math.sqrt(rms / n) + 1e-9), onset, swell: 10 * Math.log10(sw + 1e-9)});
  }
  return out;
}

const decode = async (args) => {
  const ff = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', ...args], {stdio: ['ignore', 'pipe', 'inherit']});
  const chunks = []; for await (const c of ff.stdout) chunks.push(c);
  const code = await new Promise((r) => ff.on('close', r));
  if (code !== 0) throw new Error(`ffmpeg ended ${code}`);
  return Buffer.concat(chunks);
};

/** The whole measure of a span (SPANS, the sky's by default): {film: [per frame], song: [per frame]}. */
export async function measure(film, songFile, span = SPANS.sky) {
  const {frames, cuts, song} = span, first = frames.from - 1, N = W * H * 3;
  const buf = await decode(['-i', film, '-an', '-fps_mode', 'passthrough', '-vf',
    `select='between(n\\,${first}\\,${frames.to - 1})',crop=796:532:82:4,scale=${W}:${H}:flags=area,format=rgb24`, '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-']);
  const count = buf.length / N;
  if (count < frames.to - first) throw new Error(`the film gave ${count} frames, ${frames.to - first} wanted`);
  const rows = [];
  let prev = measureFrame(buf.subarray(0, N), null, null), prior = prev.source;
  for (let f = frames.from; f < frames.to; f++) {
    const i = f - first, cut = cuts.includes(f), m = measureFrame(buf.subarray(i * N, (i + 1) * N), prev.lum, cut ? null : prior, {cut, hold: span.hold, at: span.at});
    rows.push({n: f, ...m}); prev = m; prior = m.source;
  }
  const pcmBuf = await decode(['-ss', String(song.from), '-t', String(song.seconds), '-i', songFile, '-ac', '1', '-ar', String(song.rate), '-f', 'f32le', '-']);
  const pcm = new Float32Array(pcmBuf.buffer, pcmBuf.byteOffset, pcmBuf.length / 4);
  return {film: rows, song: measureSong(pcm, frames, song)};
}

const q = (v, k = 1000) => Math.round(v * k);
/** The data module the page imports for a span (SPANS, the sky's by default): one row a frame, integers, the twelve-digit strings as they are. */
export function moduleText({film, song}, names, span = SPANS.sky) {
  const {frames, cuts} = span;
  const rows = film.map((r, i) => `  [${[q(r.source[0]), q(r.source[1]), Math.round(r.light * 10), Math.round(r.change), q(r.light_about.reach), q(r.centre_about.reach),
    Math.round(song[i].db * 10), Math.round(song[i].onset), Math.round(song[i].swell * 10)].join(', ')}, '${r.light_about.sectors}', '${r.light_about.moves}', '${r.centre_about.sectors}', '${r.centre_about.moves}'],`);
  return `// ${span.file}: ${span.what} measure, the film's 8 x 8 DCT and the song's spectrum over frames ${frames.from} to ${frames.to - 1}, written by tools/twelve-dct.mjs
// (do not edit by hand; run it again). Read off ${names.film} and ${names.song}. One row a frame of the film (30000/1001 a second), from ${frames.from}:
//   [source x, source y   the gold light's source (where its oriented structure converges), thousandths of a picture height, x across from the left, y down
//    light                 the frame's gold, tenths (its blocks' mean)
//    change                the drawing's motion: the AC energy of its change per pixel (a cut is 0)
//    reach, centre reach   the gold's mean distance from the source and from the picture's middle, thousandths of a picture height
//    db, onset, swell      the song at the frame's second: loudness (tenths of a dB), attack (spectral flux), 320 to 2560 Hz (tenths of a dB)
//    'light sectors', 'light moves', 'centre sectors', 'centre moves'   twelve digits each, clockwise from twelve o'clock: the gold's share and the
//                          change's AC energy in each 30-degree sector about the source, then about the picture's middle (0 to 9 of the fullest)]
export const ${span.name} = Object.freeze({from: ${frames.from}, cuts: Object.freeze([${cuts.join(', ')}]), aspect: ${ASPECT.toFixed(6)}, rows: Object.freeze([
${rows.join('\n')}
].map(Object.freeze))});
`;
}

async function main() {
  const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const film = path.resolve(opt('--film', path.join(HERE, '../app/saint-seiya.mp4'))), songFile = path.resolve(opt('--song', path.join(HERE, '../app/saint-seiya.m4a')));
  const out = opt('--out', null), t0 = performance.now(), cpu0 = process.cpuUsage(), span = SPANS[opt('--span', 'sky')];
  if (!span) throw new Error(`--span is one of ${Object.keys(SPANS).join(', ')}`);
  const m = await measure(film, songFile, span), ms = performance.now() - t0, cpu = process.cpuUsage(cpu0);
  for (const [i, r] of m.film.entries()) {
    const s = m.song[i];
    console.log(`${r.n} ${(r.n / FPS).toFixed(3)} src ${r.source.map((v) => v.toFixed(3)).join(',')} light ${r.light.toFixed(1).padStart(5)} change ${r.change.toFixed(0).padStart(4)} lines ${String(r.lines).padStart(4)} `
      + `${r.light_about.sectors} ${r.light_about.moves} | ${r.centre_about.sectors} ${r.centre_about.moves} | db ${s.db.toFixed(1)} onset ${s.onset.toFixed(0).padStart(4)} swell ${s.swell.toFixed(1)}`);
  }
  console.log(`${m.film.length} frames measured in ${ms.toFixed(0)} ms (this process: ${((cpu.user + cpu.system) / 1000).toFixed(0)} ms of CPU; ffmpeg's own not counted)`);
  if (out) { const text = moduleText(m, {film: path.basename(film), song: path.basename(songFile)}, span); fs.writeFileSync(out, text); console.log(`wrote ${out} (${Buffer.byteLength(text)} bytes)`); }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

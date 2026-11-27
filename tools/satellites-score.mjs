#!/usr/bin/env node
// satellites-score.mjs: THE SOUNDTRACK'S SCORE for the twelve satellites (lab/satellites-score.js), measured once off the hero's own sound.
// His words, Oct 14 2026 18:32 and 18:34 WEST: "one thing i really dont like is that the orbiting satellites are not reacting to the music my
// dude... to what is being said... to the growing amounts of energy... you get what i mean or not??", then "eh waht are you waiting to turn them
// into lyssajusianz trajectories that react to the thing dude you get what i mean or not?". And how, in his words of Oct 12 2026 (quoted in
// tools/ko-spasms.mjs): "like you know in advance how it is going to oscillate", "is there really no DCT study on frequencies of songs and
// climaxes". The soundtrack is known in advance, so it is measured here once and the page only reads it at the film's second.
//
// THE MEASURE: saint-seiya.m4a (the mp4's own AAC track: music, voices and effects mixed), decoded by afconvert (every Mac has it) to 16-bit mono
// at 22,050 Hz; for each film frame n (30000/1001 a second) a 2,048-sample Hann window centred on n / fps, its power spectrum, and:
//   level   the frame's loudness: RMS over the frame's own 1/fps of samples, -60 to -6 dBFS mapped to 0 to 1
//   bass    the 20 to 150 Hz band's power, in dB, mapped from its 5th to its 99th percentile over the film to 0 to 1
//   voice   the 300 to 3,400 Hz band's power over its own 3 s running median, in dB, kept above 0 and mapped by its 99th percentile: the voices and
//           shouts that rise over the bed. It is a measure of the sound, not of the words: the burned-in subtitles are the words' own clock
//   beat    onset strength: the spectral flux (the rise of each bin's log power from the frame before, 30 Hz to 8 kHz, summed) less its 0.5 s
//           running mean, kept above 0 and mapped by its 99th percentile: a drum, a hit, a cut in the sound
//   energy  the slow curve: the level smoothed forwards and backwards over 4 s (no lag), mapped from its 5th to its 99th percentile to 0 to 1
//   said    the spoken lines (below) as a value a frame: the line's weight while it lasts, 0 between lines
// and the lines: [[t0, t1, weight]], runs of voice over 0.18 for 0.35 s or more, joined across gaps under 0.25 s, each weighted by its mean
// level (a shout weighs more than a whisper).
// Each value is kept as a byte (0 to 255) in a base64 string per value: about 6 KB a value for the film's 4,625 frames.
//
//   afconvert -f WAVE -d LEI16@22050 -c 1 saint-seiya.m4a /tmp/seiya.wav     (on any Mac; the new Mac for the house's law)
// With --subtitles (tools/film-lines.swift's reads of the burned-in subtitles, four a second), the lines and `said` are the subtitles' own:
// each run of the same text, weighted by its loudness (0.7 x its mean level) and its emphasis (an exclamation mark +0.25, capitals +0.15).
// The words themselves are the film's and are never written out.
//   node satellites-score.mjs --wav /tmp/seiya.wav [--subtitles lines.tsv] [--out lab/satellites-score.js]   --out writes the data module
// COST: the decode about 1 s; the analysis 4,625 FFTs of 2,048 points, about 1 s of CPU in node. Run it once, on the new Mac.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const FPS = 30000 / 1001, N_FFT = 2048;

/** A 16-bit PCM WAV file -> {rate, channels, samples (Float32Array, the first channel)}. */
export function readWav(bytes) {
  if (bytes.toString('ascii', 0, 4) !== 'RIFF' || bytes.toString('ascii', 8, 12) !== 'WAVE') throw new Error('not a WAV file');
  let at = 12, fmt = null, data = null;
  while (at + 8 <= bytes.length) {
    const id = bytes.toString('ascii', at, at + 4), size = bytes.readUInt32LE(at + 4);
    if (id === 'fmt ') fmt = {format: bytes.readUInt16LE(at + 8), channels: bytes.readUInt16LE(at + 10), rate: bytes.readUInt32LE(at + 12), bits: bytes.readUInt16LE(at + 22)};
    if (id === 'data') { data = {at: at + 8, size: Math.min(size, bytes.length - at - 8)}; break; }
    at += 8 + size + (size & 1);
  }
  if (!fmt || !data) throw new Error('WAV without fmt or data');
  if (fmt.format !== 1 || fmt.bits !== 16) throw new Error(`WAV must be 16-bit PCM (format ${fmt.format}, ${fmt.bits} bits)`);
  const frames = Math.floor(data.size / (2 * fmt.channels)), samples = new Float32Array(frames);
  for (let i = 0; i < frames; i++) samples[i] = bytes.readInt16LE(data.at + 2 * i * fmt.channels) / 32768;
  return {rate: fmt.rate, channels: fmt.channels, samples};
}

/** In-place radix-2 FFT of (re, im), length a power of two. */
function fft(re, im, cos, sin) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { let t = re[i]; re[i] = re[j]; re[j] = t; t = im[i]; im[i] = im[j]; im[j] = t; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const half = len >> 1, step = n / len;
    for (let i = 0; i < n; i += len) {
      for (let k = 0; k < half; k++) {
        const c = cos[k * step], s = sin[k * step], a = i + k, b = a + half;
        const tr = re[b] * c + im[b] * s, ti = im[b] * c - re[b] * s;
        re[b] = re[a] - tr; im[b] = im[a] - ti; re[a] += tr; im[a] += ti;
      }
    }
  }
}

const percentile = (values, p) => { const s = Float64Array.from(values).sort(); return s[Math.min(s.length - 1, Math.max(0, Math.round(p * (s.length - 1))))]; };
const clamp01 = (x) => Math.min(1, Math.max(0, x));
/** A running median of `values` over `width` samples (centred), by a sorted window. */
function runningMedian(values, width) {
  const out = new Float64Array(values.length), half = Math.floor(width / 2);
  for (let i = 0; i < values.length; i++) {
    const a = Math.max(0, i - half), b = Math.min(values.length, i + half + 1), w = Array.from(values.subarray(a, b)).sort((x, y) => x - y);
    out[i] = w[w.length >> 1];
  }
  return out;
}
/** A running mean over `width` samples (centred). */
function runningMean(values, width) {
  const out = new Float64Array(values.length), half = Math.floor(width / 2), sum = new Float64Array(values.length + 1);
  for (let i = 0; i < values.length; i++) sum[i + 1] = sum[i] + values[i];
  for (let i = 0; i < values.length; i++) { const a = Math.max(0, i - half), b = Math.min(values.length, i + half + 1); out[i] = (sum[b] - sum[a]) / (b - a); }
  return out;
}
/** A one-pole smoothing run forwards then backwards: no lag, `seconds` the time constant. */
function smooth2(values, seconds) {
  const k = 1 - Math.exp(-1 / (seconds * FPS)), out = Float64Array.from(values);
  for (let i = 1; i < out.length; i++) out[i] = out[i - 1] + k * (out[i] - out[i - 1]);
  for (let i = out.length - 2; i >= 0; i--) out[i] = out[i + 1] + k * (out[i] - out[i + 1]);
  return out;
}

/** The spoken lines from film-lines.swift's reads ("seconds<TAB>text", one a read): runs of the same text, each weighted by its loudness
 *  (the score's level over the line) and its emphasis (an exclamation mark +0.25, a line mostly in capitals +0.15). The words are not kept. */
export function linesOfReads(tsv, level, step = 0.25) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9!?]+/g, ' ').trim();
  const same = (a, b) => a === b || (a.length > 6 && b.length > 6 && (a.includes(b) || b.includes(a)));
  const reads = tsv.split('\n').filter(Boolean).map((l) => { const i = l.indexOf('\t'); return {t: Number(i < 0 ? l : l.slice(0, i)), raw: i < 0 ? '' : l.slice(i + 1).trim()}; })
    .filter((r) => Number.isFinite(r.t));
  const runs = []; let cur = null;
  for (const r of reads) {
    const n = norm(r.raw);
    if (n.replace(/[!? ]/g, '').length < 2) { if (cur) runs.push(cur); cur = null; continue; }
    if (cur && same(cur.n, n) && r.t - cur.t1 <= step * 1.5) { cur.t1 = r.t; if (n.length > cur.n.length) cur.n = n; cur.raws.push(r.raw); continue; }
    if (cur) runs.push(cur);
    cur = {t0: r.t, t1: r.t, n, raws: [r.raw]};
  }
  if (cur) runs.push(cur);
  const lines = [];
  for (const l of runs) {
    const a = Math.round(l.t0 * FPS), b = Math.min(level.length, Math.max(a + 1, Math.round((l.t1 + step) * FPS)));
    let s = 0; for (let k = a; k < b; k++) s += level[k];
    const loud = s / Math.max(1, b - a);
    if (loud < 0.1) continue;   // text over silence is not said (the editor's end card at 147.5 s)
    const raw = l.raws.join(' '), letters = raw.replace(/[^A-Za-z]/g, ''), caps = letters.length ? raw.replace(/[^A-Z]/g, '').length / letters.length : 0;
    const weight = clamp01(0.7 * loud + (raw.includes('!') ? 0.25 : 0) + (caps > 0.6 ? 0.15 : 0));
    lines.push([Math.round(l.t0 * 1000) / 1000, Math.round((l.t1 + step) * 1000) / 1000, Math.round(weight * 1000) / 1000]);
  }
  return lines;
}

/** The score of a sound: {frames, seconds, level, bass, voice, beat, energy, said (Float64Arrays 0..1), lines, source}. With `reads` (the
 *  subtitles' reads), the lines and `said` are the subtitles'; without, the voice runs'. */
export function scoreOf({rate, samples}, {reads = null} = {}) {
  const seconds = samples.length / rate, frames = Math.ceil(seconds * FPS), bin = rate / N_FFT;
  const cos = new Float64Array(N_FFT / 2), sin = new Float64Array(N_FFT / 2), hann = new Float64Array(N_FFT);
  for (let k = 0; k < N_FFT / 2; k++) { cos[k] = Math.cos(2 * Math.PI * k / N_FFT); sin[k] = Math.sin(2 * Math.PI * k / N_FFT); }
  for (let i = 0; i < N_FFT; i++) hann[i] = 0.5 - 0.5 * Math.cos(2 * Math.PI * i / (N_FFT - 1));
  const band = (lo, hi) => [Math.max(1, Math.round(lo / bin)), Math.min(N_FFT / 2 - 1, Math.round(hi / bin))];
  const [b0, b1] = band(20, 150), [v0, v1] = band(300, 3400), [f0, f1] = band(30, 8000);
  const levelDb = new Float64Array(frames), bassDb = new Float64Array(frames), voiceDb = new Float64Array(frames), flux = new Float64Array(frames);
  const re = new Float64Array(N_FFT), im = new Float64Array(N_FFT);
  let last = null;
  for (let n = 0; n < frames; n++) {
    const centre = Math.round(n / FPS * rate), start = centre - N_FFT / 2;
    for (let i = 0; i < N_FFT; i++) { const j = start + i; re[i] = (j >= 0 && j < samples.length ? samples[j] : 0) * hann[i]; im[i] = 0; }
    fft(re, im, cos, sin);
    const logp = new Float64Array(f1 + 1);
    let bass = 0, voice = 0;
    for (let k = 1; k <= f1; k++) {
      const p = re[k] * re[k] + im[k] * im[k];
      if (k >= b0 && k <= b1) bass += p;
      if (k >= v0 && k <= v1) voice += p;
      logp[k] = Math.log10(p + 1e-10);
    }
    if (last) { let f = 0; for (let k = f0; k <= f1; k++) f += Math.max(0, logp[k] - last[k]); flux[n] = f; }
    last = logp;
    bassDb[n] = 10 * Math.log10(bass + 1e-10); voiceDb[n] = 10 * Math.log10(voice + 1e-10);
    const a = Math.round(n / FPS * rate), b = Math.min(samples.length, Math.round((n + 1) / FPS * rate));
    let e = 0; for (let i = a; i < b; i++) e += samples[i] * samples[i];
    levelDb[n] = 10 * Math.log10(e / Math.max(1, b - a) + 1e-10);
  }
  const level = levelDb.map((d) => clamp01((d + 60) / 54));
  const bLo = percentile(bassDb, 0.05), bHi = percentile(bassDb, 0.99), bass = bassDb.map((d) => clamp01((d - bLo) / Math.max(1e-6, bHi - bLo)));
  const vBed = runningMedian(voiceDb, Math.round(3 * FPS)), vRise = voiceDb.map((d, i) => Math.max(0, d - vBed[i]));
  const vHi = percentile(vRise, 0.99), voice = vRise.map((d) => clamp01(d / Math.max(1e-6, vHi)));
  const fMean = runningMean(flux, Math.round(0.5 * FPS)), onset = flux.map((f, i) => Math.max(0, f - fMean[i]));
  const oHi = percentile(onset, 0.99), beat = onset.map((o) => clamp01(o / Math.max(1e-6, oHi)));
  const slow = smooth2(level, 4), eLo = percentile(slow, 0.05), eHi = percentile(slow, 0.99), energy = slow.map((e) => clamp01((e - eLo) / Math.max(1e-6, eHi - eLo)));
  // the spoken lines: runs of voice over 0.18 for 0.35 s or more, joined across gaps under 0.25 s, each weighted by its mean level
  const on = Array.from(voice, (v) => v > 0.18), runs = [];
  for (let n = 0; n < frames;) { if (!on[n]) { n++; continue; } let m = n; while (m < frames && on[m]) m++; runs.push([n, m]); n = m; }
  const joined = [];
  for (const r of runs) { const prev = joined.at(-1); if (prev && r[0] - prev[1] < 0.25 * FPS) prev[1] = r[1]; else joined.push([...r]); }
  let lines = [];
  for (const [a, b] of joined) {
    if (b - a < 0.35 * FPS) continue;
    let s = 0; for (let n = a; n < b; n++) s += level[n];
    lines.push([Math.round(a / FPS * 1000) / 1000, Math.round(b / FPS * 1000) / 1000, Math.round(clamp01(s / (b - a)) * 1000) / 1000]);
  }
  if (reads) lines = linesOfReads(reads, level);
  const said = new Float64Array(frames);
  for (const [t0, t1, weight] of lines) for (let n = Math.round(t0 * FPS); n < Math.min(frames, Math.round(t1 * FPS)); n++) said[n] = Math.max(said[n], weight);
  return {frames, seconds, level, bass, voice, beat, energy, said, lines, source: reads ? 'subtitles' : 'voice'};
}

const NAMES = ['level', 'bass', 'voice', 'beat', 'energy', 'said'];
const bytesOf = (values) => Buffer.from(Uint8Array.from(values, (v) => Math.round(clamp01(v) * 255))).toString('base64');

/** The data module the page imports: the score as bytes in base64, and scoreAt(seconds) reading it. */
export function moduleOf(score, from) {
  const head = `// satellites-score.js: THE SOUNDTRACK'S SCORE for the twelve satellites, written by tools/satellites-score.mjs (do not edit by hand; run it again).
// Measured off ${from}: one byte a film frame (30000/1001 a second) for each value, 0 to 255 standing for 0 to 1 (the tool's header says how):
// level (loudness), bass (20 to 150 Hz), voice (the speech band over its bed), beat (onset strength), energy (the slow rising curve),
// said (the spoken line's weight while it lasts); and lines, [[t0, t1, weight]] in the film's seconds, from ${score.source === 'subtitles'
  ? 'the burned-in subtitles (tools/film-lines.swift; the words are not kept)' : 'the voice runs'}. ${score.frames} frames, ${score.seconds.toFixed(3)} s.
// scoreAt(seconds) -> {level, bass, voice, beat, energy, said} each 0 to 1, interpolated between frames; 0 outside the film. Pure, no state.
`;
  const fields = NAMES.map((k) => `  ${k}: '${bytesOf(score[k])}',`).join('\n');
  return `${head}
const B64 = {
${fields}
};
const decode = (s) => { const t = atob(s), out = new Uint8Array(t.length); for (let i = 0; i < t.length; i++) out[i] = t.charCodeAt(i); return out; };
export const SCORE = Object.freeze({fps: 30000 / 1001, frames: ${score.frames}, seconds: ${score.seconds.toFixed(3)}, lineSource: '${score.source}', names: Object.freeze(${JSON.stringify(NAMES)}),
  values: Object.freeze(Object.fromEntries(Object.entries(B64).map(([k, s]) => [k, decode(s)]))),
  lines: Object.freeze(${JSON.stringify(score.lines)}.map((l) => Object.freeze(l)))});
/** The score at the film's second: each value 0 to 1, read between the two frames around it. */
export function scoreAt(seconds) {
  const out = {level: 0, bass: 0, voice: 0, beat: 0, energy: 0, said: 0};
  if (!Number.isFinite(seconds) || seconds < 0) return out;
  const f = seconds * SCORE.fps, i = Math.floor(f), k = f - i;
  if (i >= SCORE.frames) return out;
  for (const name of SCORE.names) { const v = SCORE.values[name], a = v[i], b = i + 1 < SCORE.frames ? v[i + 1] : a; out[name] = (a + (b - a) * k) / 255; }
  return out;
}
`;
}

/** cutOf(score, from, to): THE CUT, the score of a film with its frames [from, to) taken out (his Oct 21 2026 WEST "please remove the 2nd
 *  repetition when he is about to shoot the arrow": the second aim, frames 3825 to 3881). The values are spliced byte for byte, so every
 *  frame kept reads exactly as the uncut film's measure did; a line inside the cut goes, one across an edge is trimmed to it, one across the
 *  whole cut closes over it, and those after it come (to - from) frames earlier. score: as scoreOf gives it, or as the data module holds it. */
export function cutOf(score, from, to) {
  if (!(Number.isInteger(from) && Number.isInteger(to) && 0 <= from && from < to && to <= score.frames)) throw new Error(`cutOf: no cut [${from}, ${to}) in ${score.frames} frames`);
  const gone = to - from, c0 = from / FPS, c1 = to / FPS, d = gone / FPS, out = {...score, frames: score.frames - gone, seconds: score.seconds - d};
  for (const k of NAMES) out[k] = [...Array.from(score[k]).slice(0, from), ...Array.from(score[k]).slice(to)];
  // energy is the slow curve (4 s each way): a measure of the cut song would run smooth through the join, so the uncut curve going on and
  // the curve after the cut are eased one into the other over `SEAM` frames each side of it; the other values are the sound's own, a step at a
  // cut being the cut's
  const SEAM = 60, e = Array.from(score.energy);
  for (let n = Math.max(0, from - SEAM); n < Math.min(out.frames, from + SEAM); n++) {
    const x = (n - (from - SEAM)) / (2 * SEAM), w = x * x * (3 - 2 * x);
    out.energy[n] = (1 - w) * e[Math.min(e.length - 1, n)] + w * e[Math.min(e.length - 1, n + gone)];
  }
  const r3 = (x) => Math.round(x * 1000) / 1000;
  out.lines = score.lines.flatMap(([t0, t1, w]) => {
    const before = t0 < c0, after = t1 > c1;
    if (!before && !after) return [];
    return [[r3(before ? t0 : Math.max(t0, c1) - d), r3(after ? t1 - d : Math.min(t1, c0)), w]];
  });
  return out;
}

async function main() {
  // THE CUT on the module the page reads: node satellites-score.mjs --splice lab/satellites-score.js --cut 3825,3882 --out lab/satellites-score.js
  if (opt('--splice')) {
    const {SCORE} = await import(new URL(opt('--splice'), `file://${process.cwd()}/`).href);
    const held = {frames: SCORE.frames, seconds: SCORE.seconds, source: SCORE.lineSource, lines: SCORE.lines.map((l) => [...l])};
    for (const k of NAMES) held[k] = Array.from(SCORE.values[k], (b) => b / 255);
    const [from, to] = (opt('--cut') || '').split(',').map(Number), score = cutOf(held, from, to);
    const out = opt('--out'), whence = opt('--from', `saint-seiya.m4a, frames ${from} to ${to - 1} cut out of the uncut film's measure`);
    if (out) { fs.writeFileSync(out, moduleOf(score, whence)); console.log(`wrote ${out}: ${held.frames} frames to ${score.frames}, ${held.lines.length} lines to ${score.lines.length}`); }
    return;
  }
  const wav = opt('--wav'); if (!wav) throw new Error('--wav <16-bit PCM WAV of saint-seiya.m4a> (afconvert -f WAVE -d LEI16@22050 -c 1)');
  const reads = opt('--subtitles') ? fs.readFileSync(opt('--subtitles'), 'utf8') : null;
  const t0 = process.hrtime.bigint(), sound = readWav(fs.readFileSync(wav)), score = scoreOf(sound, {reads}), ms = Number(process.hrtime.bigint() - t0) / 1e6;
  const at = (name, s) => score[name][Math.min(score.frames - 1, Math.round(s * FPS))].toFixed(2);
  console.log(`${path.basename(wav)}: ${sound.rate} Hz, ${score.seconds.toFixed(3)} s, ${score.frames} frames, ${score.lines.length} lines (${score.source}), ${ms.toFixed(0)} ms`);
  for (const s of [5, 11.044, 18.2, 22, 32.6, 37.2, 42.342, 50.05, 61.767, 69.67, 100.767, 102.3, 104.771, 106.773, 111.5, 124.791, 137.204, 147.5])
    console.log(`  ${String(s).padStart(8)} s  level ${at('level', s)}  bass ${at('bass', s)}  voice ${at('voice', s)}  beat ${at('beat', s)}  energy ${at('energy', s)}  said ${at('said', s)}`);
  const out = opt('--out');
  if (out) { const from = opt('--from', 'saint-seiya.m4a'); fs.writeFileSync(out, moduleOf(score, from)); console.log(`wrote ${out}, ${(fs.statSync(out).size / 1024).toFixed(1)} KB`); }
  if (args.includes('--lines')) for (const l of score.lines) console.log(`  line ${l[0].toFixed(2)} to ${l[1].toFixed(2)} s, weight ${l[2]}`);
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e.message || e); process.exit(1); });

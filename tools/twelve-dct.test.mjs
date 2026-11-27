// twelve-dct.test.mjs: THE TWELVE's measure (tools/twelve-dct.mjs -> lab/twelve-dct.js), his Oct 17 2026 20:3x WEST word "the dodecaheron faces must
// begin to be aligned with the DCTs of the anime dude the spirit of the music". Pinned: the DCT is the orthonormal one (a block's DC over 8 is its mean,
// Parseval holds, so a change's AC energy is ko-spasms's sum(d^2) - sum(d)^2 / 64); a block's orientation runs along its lines; the lines of rays from
// a point converge on it, cliff edges and all; the sectors go clockwise from twelve o'clock; the song's attack lands on the frame of a struck note and
// its swell is the 320 to 2560 Hz band; and lab/twelve-dct.js is this tool's own output on the film and the song, byte for byte (ffmpeg, the new Mac).
// node --test embertide-app/ui/intro/dyson-society/tools/twelve-dct.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {DCT8, dct8, blockAc, structure, converge, sectorsOf, digits, measureSong, measure, moduleText, FRAMES, SONG, FPS, SPANS} from './twelve-dct.mjs';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const seeded = (seed) => () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };

test('the DCT: orthonormal, a block\'s DC over 8 is its mean, and the change\'s AC energy is the sum of its AC coefficients squared (Parseval)', () => {
  for (let k = 0; k < 8; k++) for (let j = 0; j < 8; j++) {
    let s = 0; for (let n = 0; n < 8; n++) s += DCT8[k * 8 + n] * DCT8[j * 8 + n];
    assert.ok(Math.abs(s - (k === j ? 1 : 0)) < 1e-12, 'rows orthonormal');
  }
  const r = seeded(7), a = Float64Array.from({length: 256}, () => r() * 255), b = Float64Array.from({length: 256}, () => r() * 255);
  const c = dct8(a, 16, 4, 4), mean = (() => { let s = 0; for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) s += a[(4 + j) * 16 + 4 + i]; return s / 64; })();
  assert.ok(Math.abs(c[0] / 8 - mean) < 1e-9, 'DC / 8 is the mean');
  let e = 0, x2 = 0; for (let q = 0; q < 64; q++) e += c[q] ** 2; for (let j = 0; j < 8; j++) for (let i = 0; i < 8; i++) x2 += a[(4 + j) * 16 + 4 + i] ** 2;
  assert.ok(Math.abs(e - x2) / x2 < 1e-12, 'Parseval');
  const d = Float64Array.from(a, (v, i) => b[i] - v), cd = dct8(d, 16, 4, 4);
  let ac = 0; for (let q = 1; q < 64; q++) ac += cd[q] ** 2;
  assert.ok(Math.abs(blockAc(a, b, 16, 4, 4) - ac) / ac < 1e-12, 'the change\'s AC energy');
});

test('a block\'s orientation runs along its lines (y down), sure for one line, unsure for none', () => {
  for (const deg of [0, 30, 60, 90, 120, 150]) {
    const a = deg * Math.PI / 180, lum = new Float64Array(64);
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const d = (x - 3.5) * -Math.sin(a) + (y - 3.5) * Math.cos(a); lum[y * 8 + x] = 40 + 200 * Math.exp(-d * d / 1.2); }
    const s = structure(lum, 8, 0, 0), off = Math.abs(Math.atan2(Math.sin(2 * (s.along - a)), Math.cos(2 * (s.along - a)))) / 2;
    assert.ok(off < .12 && s.coherence > .6, `a line at ${deg} degrees read at ${(s.along * 180 / Math.PI).toFixed(1)} (coherence ${s.coherence.toFixed(2)})`);
    assert.ok(Math.abs(s.jxx + s.jyy) > 0);
  }
  assert.equal(structure(new Float64Array(64).fill(90), 8, 0, 0).coherence, 0);
});

test('the source: lines of rays out of a point converge on it, through noise and a third of them wrong (the cliff\'s lit edges)', () => {
  const r = seeded(3), star = [.68, .12], lines = [];
  for (let k = 0; k < 120; k++) {
    const a = Math.PI * (.05 + .9 * r()), d = .05 + .5 * r(), p = [star[0] + d * Math.cos(a), star[1] + d * Math.sin(a)], j = (r() - .5) * .04;
    lines.push({p, d: [Math.cos(a + j), Math.sin(a + j)], w: 1 + r()});
  }
  for (let k = 0; k < 60; k++) { const a = r() * Math.PI, p = [r() * 1.5, .4 + .6 * r()]; lines.push({p, d: [Math.cos(a), Math.sin(a)], w: 1 + r()}); }
  const s = converge(lines, [.75, .5]);
  assert.ok(Math.hypot(s[0] - star[0], s[1] - star[1]) < .015, `converged on ${s.map((v) => v.toFixed(3))}, the star at ${star}`);
  // one line alone (the beam): the point on it nearest the prior
  const one = converge([{p: [.2, .4], d: [Math.SQRT1_2, -Math.SQRT1_2], w: 1}], [.5, .3]);
  // the prior (0.5, 0.3) moved onto the line: (0.4, 0.2)
  assert.ok(Math.abs((one[0] - .2) * Math.SQRT1_2 + (one[1] - .4) * Math.SQRT1_2) < .002 && Math.hypot(one[0] - .4, one[1] - .2) < .005, `the beam's point ${one}`);
});

test('the sectors: twelve of 30 degrees clockwise from twelve o\'clock about the point (y down), the near ones left out; digits of the fullest', () => {
  const at = [.7, .5], put = (deg, d = .2, v = 1) => ({p: [at[0] + d * Math.sin(deg * Math.PI / 180), at[1] - d * Math.cos(deg * Math.PI / 180)], v});
  const {sectors, reach} = sectorsOf([put(10), put(100, .2, 3), put(190), put(355, .3), put(45, .01, 50)], at);
  assert.deepEqual([...sectors], [1, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 1]);
  assert.ok(Math.abs(reach - (.2 + .6 + .2 + .3) / 6) < 1e-12);
  assert.equal(digits(sectors), '300900300003');
});

test('the song: a struck note\'s attack lands on its frame; its swell is the 320 to 2560 Hz band; its loudness in dB', () => {
  const rate = SONG.rate, pcm = new Float32Array(Math.round(SONG.seconds * rate)), strike = 1330, t0 = strike / FPS - SONG.from;
  for (let i = Math.round(t0 * rate); i < pcm.length; i++) { const t = i / rate - t0; pcm[i] = .3 * Math.sin(2 * Math.PI * 880 * t) * Math.exp(-t / 1.5); }
  const frames = {from: 1320, to: 1340}, m = measureSong(pcm, frames);
  const top = m.reduce((b, x, i) => (x.onset > m[b].onset ? i : b), 0);
  assert.equal(frames.from + top, strike, `the attack read at frame ${frames.from + top}`);
  assert.ok(m[strike + 2 - frames.from].swell - m[0].swell > 60, 'the 880 Hz note is in the swell band');
  assert.ok(m[0].db < -150 && m[strike + 2 - frames.from].db > -20, 'silence, then the note');
  // the same note at 5 kHz is out of the swell band
  const hi = Float32Array.from(pcm, (_, i) => { const t = i / rate - t0; return t < 0 ? 0 : .3 * Math.sin(2 * Math.PI * 5000 * t) * Math.exp(-t / 1.5); });
  const mh = measureSong(hi, frames);
  assert.ok(m[strike + 2 - frames.from].swell - mh[strike + 2 - frames.from].swell > 30, 'a 5 kHz note is not the brass and the choir');
});

test('lab/twelve-dct.js is this tool\'s own output on the film and the song, byte for byte', async () => {
  const film = here('../app/saint-seiya.mp4'), song = here('../app/saint-seiya.m4a'), cpu0 = process.cpuUsage(), t0 = performance.now();
  const m = await measure(film, song), ms = performance.now() - t0, cpu = process.cpuUsage(cpu0);
  assert.equal(m.film.length, FRAMES.to - FRAMES.from);
  const text = moduleText(m, {film: 'saint-seiya.mp4', song: 'saint-seiya.m4a'}), file = fs.readFileSync(here('../lab/twelve-dct.js'), 'utf8');
  assert.equal(text, file, 'run tools/twelve-dct.mjs --out lab/twelve-dct.js again');
  console.log(`# the measure: ${m.film.length} frames in ${ms.toFixed(0)} ms, ${((cpu.user + cpu.system) / 1000).toFixed(0)} ms of this process's CPU (ffmpeg's own not counted), ${Buffer.byteLength(file)} bytes`);
});

test('THE TWELVE ON SEIYA (his Oct 21 2026 WEST words, lab/seiya-flight.mjs): lab/twelve-seiya-dct.js is this tool\'s own output on Athena\'s shot, byte for byte; once the column\'s gold has gone his place is held on his figure, with no light to count', async () => {
  const span = SPANS.seiya, film = here('../app/saint-seiya.mp4'), song = here('../app/saint-seiya.m4a');
  assert.deepEqual([span.frames.from, span.frames.to, ...span.cuts], [2172, 2247, 2172, 2247]);
  assert.equal(SPANS.sky.hold, 0, 'the sky\'s measure holds nothing: it is as it was');
  const m = await measure(film, song, span);
  assert.equal(m.film.length, span.frames.to - span.frames.from);
  const text = moduleText(m, {film: 'saint-seiya.mp4', song: 'saint-seiya.m4a'}, span), file = fs.readFileSync(here('../lab/twelve-seiya-dct.js'), 'utf8');
  assert.equal(text, file, 'run tools/twelve-dct.mjs --span seiya --out lab/twelve-seiya-dct.js again');
  // the column on him at the cut (its rays converge at his feet, the picture's lower left); from the frame its gold falls under the hold, his figure
  const at0 = m.film[0];
  assert.ok(at0.light > 4 && at0.source[0] / (796 / 532) < .2 && at0.source[1] > .7, `the column at the cut: ${at0.source} gold ${at0.light}`);
  const fall = m.film.findIndex((r) => r.light < span.hold);
  assert.ok(fall > 0 && fall < 6, `the column under the hold from ${span.frames.from + fall}`);
  for (const r of m.film.slice(fall)) {
    assert.deepEqual(r.source, [...span.at], `frame ${r.n}: his place left him`);
    assert.equal(r.light_about.sectors, '000000000000', `frame ${r.n}: light counted where there is none`);
  }
});

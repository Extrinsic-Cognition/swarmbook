// score-wasm.mjs · THE SCORE IN ONE WASM (Oct 11 2026; his 04:0x "write rust or c, i need hyperoptimized code"; house/AGENTS.md: the hot path is Rust).
// house/embertide-score (Rust, no_std, f64 and libm only) is built once by its build.sh into ./wasm/embertide-score.wasm, so every glass that runs the
// program runs the same bytes. This file is the whole glue, no bindgen: load() instantiates the module once (a fetch of the same origin; a file read
// under node) and exposes the laws under their own names over two flat f64 buffers (IN, OUT): score.* (lyssajudron-score.mjs) and beat.* (beat-clock.mjs).
// The shapes a glass meets (normalClock, pulseOf, musicOf) stay those files' own readers, once per cause; every number after them is Rust's. The JS files
// stay the reference and the fallback: their useWasm() swaps these in. A door the JS has no twin of writes numbers into a Float64Array and allocates
// nothing: score.satellitesAt(clock, out) (the twelve satellites, seat s at 3s). The card's flight (flight-law.mjs) flies by embertide-scene's card doors
// since THE CARD FLIES BY THE MODULE (Nov 3 2026): this module's flight doors are read by no glue.
import * as S from './lyssajudron-score.mjs';
import { pulseOf, musicOf, GENESIS_MS as GENESIS_BEAT_EPOCH, GENESIS_BEAT_MS, BEATS_PER_BAR } from './beat-clock.mjs';

const { normalClock, mix: jsMix, yawStep, chainAt: jsChainAt, traceAt: jsTraceAt, seedOf: jsSeedOf, GENESIS_GRID, HOVER_M } = S;   // the JS originals, read before any swap
let W = null, I = null, O = null, O36 = null;                                       // the module's exports, its IN and OUT (and a fixed view of OUT)
const nn = (v) => (typeof v === 'number' ? v : NaN);                                // lyssajudron-score's num(): NaN is "not a number" to Rust
const nul = (x) => (x === x ? x : null);
const v3 = (i = 0) => [O[i], O[i + 1], O[i + 2]];

export const score = {
  lissajousUnit: (u) => (W.score_lissajous_unit(u), v3()),
  phaseAtDistance: (turns) => W.score_phase_at_distance(turns),
  scorePoint: (lane, u, azimuth) => (W.score_point(lane, u, azimuth), v3()),
  seedOf(name) { const a = Array.from(name); if (a.length > I.length) return jsSeedOf(name); for (let i = 0; i < a.length; i++) I[i] = a[i].charCodeAt(0); return W.score_seed_of(a.length); },
  satelliteAt(seat, clock) { const c = normalClock(clock); W.score_satellite_at(seat, c.bar, c.bar_phase); return v3(); },
  satellitesAt(clock, out = new Float64Array(36)) { const c = normalClock(clock); W.score_satellites_at(c.bar, c.bar_phase); out.set(O36); return out; },
  clockOf(grid, now_ms) {
    W.score_clock_of(nn(grid?.beat_ms), nn(grid?.beats_per_bar), nn(grid?.epoch_ms), nn(now_ms), nn(grid?.bpm));
    return { now_ms: O[0], beat_ms: O[1], bar_ms: O[2], beats_per_bar: O[3], beat_phase: O[4], bar_phase: O[5], beat: O[6], bar: O[7], epoch_ms: O[8], downbeat_ms: O[9], bpm: O[10],
      source: typeof grid?.source === 'string' ? grid.source : 'genesis', music_seq: grid?.music_seq ?? null };
  },
  genesisClock: (now_ms) => score.clockOf(GENESIS_GRID, now_ms),
  beatOf: (ts, c) => W.score_beat_of(ts, c.epoch_ms, c.beat_ms),
  downbeatOf: (ts, c) => W.score_downbeat_of(ts, c.epoch_ms, c.bar_ms, c.beat_ms),
  homeBeatOf: (lastNote, bpb = S.BEATS_PER_BAR) => W.score_home_beat_of(lastNote, bpb),
  dipAt(clock) { const c = normalClock(clock); return W.score_dip_at(c.bar_phase, c.beats_per_bar); },
  flashAt(clock) { const c = normalClock(clock); return W.score_flash_at(c.bar_phase, c.beats_per_bar); },
  snapOf: (p) => W.score_snap_of(p),
  hoverY(clock, base = HOVER_M) { const c = normalClock(clock), d = normalClock(c); return W.score_hover_y(c.beat_phase, d.bar_phase, d.beats_per_bar, base); },   // dipAt normalises again (the same clock unless its grid is degenerate)
  mix: (a, b, k) => (W.score_mix(a[0], a[1], a[2], b[0], b[1], b[2], k), v3()),
  traceAt(walls, clock, orbit) {   // the walls into IN, 8 doubles each (a, b, h, beat)
    if (walls.length * 8 > I.length) return jsTraceAt(walls, clock, orbit);
    const c = normalClock(clock);
    for (let i = 0, j = 0; i < walls.length; i++, j += 8) { const w = walls[i]; I[j] = w.a[0]; I[j + 1] = w.a[1]; I[j + 2] = w.a[2]; I[j + 3] = w.b[0]; I[j + 4] = w.b[1]; I[j + 5] = w.b[2]; I[j + 6] = w.h; I[j + 7] = w.beat; }
    const i = W.score_trace_at(walls.length, c.beat, c.beat_phase, c.beats_per_bar, c.beat_ms, c.epoch_ms, orbit[0], orbit[1], orbit[2]);
    return i < 0 ? null : { position: v3(), phase: O[3] ? 'return' : 'trace', k: O[4], wall: walls[i] };
  },
  chainAt(notes, start, clock, length_beats, step) {   // mix and yawStep chains run in Rust; any other step is the JS's
    const vec = step === jsMix || step === score.mix;
    if (!(vec || step === yawStep) || notes.length * 4 > I.length) return jsChainAt(notes, start, clock, length_beats, step);
    const c = normalClock(clock);
    if (vec) { for (let i = 0, j = 0; i < notes.length; i++, j += 4) { const n = notes[i]; I[j] = n.beat; I[j + 1] = n.to[0]; I[j + 2] = n.to[1]; I[j + 3] = n.to[2]; } W.score_chain_vec3(notes.length, c.beat, c.beat_phase, length_beats, start[0], start[1], start[2]); return v3(); }
    for (let i = 0, j = 0; i < notes.length; i++, j += 2) { I[j] = notes[i].beat; I[j + 1] = notes[i].to; }
    return W.score_chain_yaw(notes.length, c.beat, c.beat_phase, length_beats, start);
  },
};

export const beat = {
  gridOf({ pulse = null, music = null, now_ms = null, beatsPerBar = BEATS_PER_BAR, genesis_ms = GENESIS_BEAT_EPOCH, genesis_beat_ms = GENESIS_BEAT_MS } = {}) {
    const p = pulseOf(pulse), m = musicOf(music);
    const ear = W.beat_grid_of(p ? 1 : 0, p ? p.period_s : 0, p ? p.bpm : 0, p ? p.beat_at_ms : 0, p ? p.confidence : 0, p && p.stable ? 1 : 0, p ? p.at_ms : 0, m ? 1 : 0, m ? m.song_start_ms : 0, m && m.state === 'playing' ? 1 : 0, now_ms == null ? -Infinity : now_ms, nn(beatsPerBar), genesis_ms, genesis_beat_ms);
    return { source: ear ? 'ear' : 'genesis', epoch_ms: O[0], beat_ms: O[1], bar_ms: O[2], beats_per_bar: O[3], bpm: O[4], music_seq: m ? m.music_seq : null, beat_at_ms: nul(O[5]), song_start_ms: nul(O[6]) };
  },
  sampleGrid(g, now_ms) {
    W.beat_sample_grid(g.epoch_ms, g.beat_ms, g.bar_ms, g.beats_per_bar, now_ms);
    return { now_ms, beat_ms: g.beat_ms, bar_ms: g.bar_ms, beats_per_bar: g.beats_per_bar, beat_phase: O[2], bar_phase: O[3], downbeat_ms: O[4], bpm: g.bpm, source: g.source, beat: O[0], bar: O[1], epoch_ms: g.epoch_ms, music_seq: g.music_seq, beat_at_ms: g.beat_at_ms };
  },
  beatOf: (g, ts) => W.beat_beat_of(g.epoch_ms, g.beat_ms, ts),
  downbeatOf: (g, ts) => W.beat_downbeat_of(g.epoch_ms, g.bar_ms, g.beats_per_bar, ts),
  timeOf: (g, b) => W.beat_time_of(g.epoch_ms, g.beat_ms, b),
  smooth: (u) => W.beat_smooth(nn(u)),
};

let ready = null;
/** load({bytes, url}): the module, instantiated once -> {score, beat}. bytes (an ArrayBuffer or a view) skips the read; url defaults to
 *  ./wasm/embertide-score.wasm beside this file. Rejects when the module is not there (a later call tries again). */
export function load({ bytes = null, url = './wasm/embertide-score.wasm' } = {}) {
  ready ||= (async () => {
    const u = new URL(url, import.meta.url);
    const src = bytes || (u.protocol === 'file:' ? await (await import('node:fs/promises')).readFile(u) : await fetch(u).then((r) => { if (!r.ok) throw new Error(`${u.pathname}: ${r.status}`); return r.arrayBuffer(); }));
    const { instance } = await WebAssembly.instantiate(src, {});
    W = instance.exports; I = new Float64Array(W.memory.buffer, W.io_in(), W.io_in_len()); O = new Float64Array(W.memory.buffer, W.io_out(), W.io_out_len()); O36 = O.subarray(0, 36);
    return { score, beat };
  })().catch((e) => { ready = null; throw e; });
  return ready;
}

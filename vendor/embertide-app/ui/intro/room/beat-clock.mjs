// beat-clock.mjs - THE CLOCK OF CAUSALITY (Oct 10 2026, LYSSAJUDRON-HOME-2026-10-10.md section 0 and amendment A3; his 22:40 "focus on the fucking
// music aligning causality harmonically", his 22:50 "every single polarized interface is being computed independently... they are agreeing on the
// rhythm"). The station playing in the house is the clock: every glass samples the same grid (the song's tempo, its downbeat epoch, four beats a
// bar) and places every cause on a beat of it. No sample is a unit here and nothing here compares one glass with another: a glass asks clock() with
// the house's time and gets integers (beat, bar) that every other glass gets for the same second, because they are pure functions of what the rite
// PUBLISHES (the ear's pulse: period_s and the time of a heard beat; the song's cause: music_seq, stamp_ms, position_ms) and of the house time.
//
// THE GRID. Source 'ear' needs a pulse that is non-null, stable, confidence >= 0.3, and a song playing: beat_ms = period_s * 1000; the bar grid's
// epoch is the heard beat nearest the song's start (song_start_ms = stamp_ms - position_ms, latched ONCE per music_seq: the grid never jitters with the
// ear). Else 'genesis': epoch GENESIS (the Sept 28 landing's 1772673332), 600 ms a beat, four a bar, so a house with no song still keeps one time on
// every glass. A new song (music_seq moved) is a cause: the clock switches to the new grid at the new grid's first downbeat after it was heard; until
// then the old grid runs. No carried offset, no relatch state: beat = floor((now - epoch) / beat_ms), bar = floor(beat / 4).
//
// COST. clock() is a dozen arithmetic operations; hear() is the same plus one object. No timer, no read: the readers (the pulse poll, the rite's
// stream) are the twin's and feed hear(). Nothing of this file reads a clock of its own: `house()` is handed in (twin.mjs: the Nest's beat and the
// rite's server_ms through room-clock.mjs; a proof hands a fixed number).
//
// THE EAR UNASKED (Oct 14 2026, THE SKIN RESTS's network; his "nothing at rest costs anything"): a glass whose engine rests stops reading the pulse, so
// it cannot hear the ear fall silent. hold(true) stops the pulse's age there (the age counts only the time the ear is asked) and the grid in force
// stands; hold(false) lets the age run on from where it stood, and the read the wake makes says what the ear says now. So the first sample after a
// wake stands on the grid the rest stood on (his 04:4x: "everything must be the same ... between when the engine sleeps and when the engine local is
// running"), never on genesis because the glass stopped asking. Cost: two numbers and a subtraction a judgement.
export const GENESIS_MS = 1772673332000;   // the landing's `const GENESIS = 1772673332` (seconds), in ms
export const GENESIS_BEAT_MS = 600;        // 100 bpm when no station plays
export const BEATS_PER_BAR = 4;
export const PULSE_STALE_MS = 10000;       // the rite nulls a pulse older than this; the clock does too
export const MIN_CONFIDENCE = 0.3;

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const clamp01 = (u) => (u < 0 ? 0 : u > 1 ? 1 : u);
/** smooth(u): the one easing of the house (u^2 (3 - 2u), u clamped to [0, 1]): a wall rising, a turn, a go-to, a return. */
export const smooth = (u) => { u = clamp01(num(u) ? u : 0); return u * u * (3 - 2 * u); };
const frac = (x) => x - Math.floor(x);

/** pulseOf(x): a GET /rite/pulse answer ({ok, pulse|null, server_ms}) or a pulse record -> { bpm, period_s, beat_at_ms, confidence, stable, source, at_ms }
 *  or null. The rite's `beat_ms` field is the TIME of a heard beat (rite.mjs POST /rite/pulse), named beat_at_ms here; the beat's length is period_s. */
export function pulseOf(x) {
  const p = x && typeof x === 'object' && 'pulse' in x && !('period_s' in x) ? x.pulse : x;
  if (!p || typeof p !== 'object') return null;
  const period_s = num(p.period_s) ? p.period_s : num(p.bpm) && p.bpm > 0 ? 60 / p.bpm : null;
  const beat_at_ms = num(p.beat_at_ms) ? p.beat_at_ms : num(p.beat_ms) ? p.beat_ms : null;
  if (!period_s || period_s <= 0.15 || period_s > 3 || beat_at_ms == null) return null;
  return { bpm: 60 / period_s, period_s, beat_at_ms, confidence: num(p.confidence) ? Math.max(0, Math.min(1, p.confidence)) : 0, stable: p.stable === true,
    source: typeof p.source === 'string' ? p.source.slice(0, 32) : '', at_ms: num(p.at_ms) ? p.at_ms : beat_at_ms };
}

/** musicOf(x): the song's cause as the rite publishes it (a /rite/stream tick frame's music_cause, /rite/state's music, or the record itself) ->
 *  { music_seq, stamp_ms, position_ms, state, song_start_ms } or null (no song). */
export function musicOf(x) {
  const m = x && typeof x === 'object' ? (x.music_cause && typeof x.music_cause === 'object' ? x.music_cause : x.music && typeof x.music === 'object' ? x.music : x) : null;
  if (!m || !num(m.music_seq) || !num(m.stamp_ms)) return null;
  const position_ms = num(m.position_ms) ? m.position_ms : 0, state = typeof m.state === 'string' ? m.state : 'none';
  return { music_seq: m.music_seq, stamp_ms: m.stamp_ms, position_ms, state, song_start_ms: m.stamp_ms - position_ms };
}

/** gridOf({pulse, music, now_ms, beatsPerBar, genesis_ms, genesis_beat_ms}): the grid every glass agrees on. 'ear' when the pulse is live (non-null,
 *  stable, confident, not older than PULSE_STALE_MS at now_ms when now_ms is given) and a song plays; else 'genesis'. Pure: the same inputs give
 *  the same grid on every glass. */
export function gridOf({ pulse = null, music = null, now_ms = null, beatsPerBar = BEATS_PER_BAR, genesis_ms = GENESIS_MS, genesis_beat_ms = GENESIS_BEAT_MS } = {}) {
  const p = pulseOf(pulse), m = musicOf(music), bpb = num(beatsPerBar) && beatsPerBar >= 1 ? Math.trunc(beatsPerBar) : BEATS_PER_BAR;
  const fresh = p && (now_ms == null || now_ms - p.at_ms <= PULSE_STALE_MS);
  if (p && fresh && p.stable && p.confidence >= MIN_CONFIDENCE && m && m.state === 'playing') {
    const beat_ms = p.period_s * 1000, epoch_ms = p.beat_at_ms + beat_ms * Math.round((m.song_start_ms - p.beat_at_ms) / beat_ms);
    return { source: 'ear', epoch_ms, beat_ms, bar_ms: beat_ms * bpb, beats_per_bar: bpb, bpm: p.bpm, music_seq: m.music_seq, beat_at_ms: p.beat_at_ms, song_start_ms: m.song_start_ms };
  }
  return { source: 'genesis', epoch_ms: genesis_ms, beat_ms: genesis_beat_ms, bar_ms: genesis_beat_ms * bpb, beats_per_bar: bpb, bpm: 60000 / genesis_beat_ms, music_seq: m ? m.music_seq : null, beat_at_ms: null, song_start_ms: null };
}

/** sampleGrid(grid, now_ms): the clock's reading at a house time. beat and bar are integers since the epoch (negative before it), the phases in [0, 1). */
export function sampleGrid(grid, now_ms) {
  const x = (now_ms - grid.epoch_ms) / grid.beat_ms, beat = Math.floor(x), bar = Math.floor(beat / grid.beats_per_bar);
  return { now_ms, beat_ms: grid.beat_ms, bar_ms: grid.bar_ms, beats_per_bar: grid.beats_per_bar, beat_phase: frac(x), bar_phase: frac((now_ms - grid.epoch_ms) / grid.bar_ms),
    downbeat_ms: grid.epoch_ms + bar * grid.bar_ms, bpm: grid.bpm, source: grid.source, beat, bar, epoch_ms: grid.epoch_ms, music_seq: grid.music_seq, beat_at_ms: grid.beat_at_ms };
}
/** beatOf(grid, ts): the first beat at or after a cause's time (its note). downbeatOf(grid, ts): the first downbeat at or after it, as a beat index.
 *  timeOf(grid, beat): the house time that beat sounds. */
export const beatOf = (grid, ts) => Math.ceil((ts - grid.epoch_ms) / grid.beat_ms - 1e-9);
export const downbeatOf = (grid, ts) => Math.ceil((ts - grid.epoch_ms) / grid.bar_ms - 1e-9) * grid.beats_per_bar;
export const timeOf = (grid, beat) => grid.epoch_ms + beat * grid.beat_ms;

/** makeClock({house, beatsPerBar}): the twin's one clock. house() -> the house's now in ms (null before the first observation). hear({pulse, music,
 *  at_ms}) takes what the rite published (either may be absent: the other is kept); a song's grid is latched once per music_seq. clock() -> the
 *  reading, or null while the house time is unknown; grid() -> the grid now in force; beatOf/downbeatOf/timeOf on it; hold(on): THE EAR UNASKED. */
export function makeClock({ house, beatsPerBar = BEATS_PER_BAR, genesis_ms = GENESIS_MS, genesis_beat_ms = GENESIS_BEAT_MS } = {}) {
  if (typeof house !== 'function') throw new TypeError('house() is required: the house time, never a clock of this file');
  const S = { pulse: null, music: null, grid: null, next: null, heard: 0, switches: 0, heldAt: null, unasked: 0, holds: 0 };   // heldAt, unasked: THE EAR UNASKED (the hold's start; the ms the ear went unasked since its pulse was heard)
  const earNow = (now) => (num(now) ? now - S.unasked - (S.heldAt !== null ? Math.max(0, now - S.heldAt) : 0) : now);   // the house time less the time the ear was not asked: a pulse's age is judged on it
  const make = (pulse, music, now_ms) => gridOf({ pulse, music, now_ms: earNow(now_ms), beatsPerBar, genesis_ms, genesis_beat_ms });
  function hear({ pulse, music, at_ms } = {}) {
    S.heard++;
    const now = num(at_ms) ? at_ms : house();
    if (pulse !== undefined) { S.pulse = pulse ? pulseOf(pulse) : null; S.unasked = 0; if (S.heldAt !== null && num(now)) S.heldAt = now; }   // a pulse heard: its age runs from its own stamp again (held, it stands from now)
    if (music !== undefined) { const m = musicOf(music); if (!m || !S.music || m.music_seq !== S.music.music_seq) S.music = m; else S.music = { ...S.music, state: m.state }; }   // the start latched once per song; play/pause follows
    const g = make(S.pulse, S.music, now);
    if (!S.grid) { S.grid = g; return g; }
    const same = g.source === S.grid.source && g.epoch_ms === S.grid.epoch_ms && g.beat_ms === S.grid.beat_ms && g.music_seq === S.grid.music_seq;
    if (same) { S.next = null; return S.grid; }
    if (g.music_seq !== S.grid.music_seq && num(now)) S.next = { grid: g, from_ms: timeOf(g, downbeatOf(g, now)) };   // a new song: at its first downbeat after it was heard
    else { S.grid = g; S.next = null; S.switches++; }                                                                     // the same song, a surer ear (or a lost one): the grid moves now
    return S.grid;
  }
  function grid(now_ms = house()) {
    if (!S.grid) S.grid = make(S.pulse, S.music, now_ms);
    if (S.next && num(now_ms) && now_ms >= S.next.from_ms) { S.grid = S.next.grid; S.next = null; S.switches++; }
    if (S.grid.source === 'ear' && num(now_ms) && S.pulse && earNow(now_ms) - S.pulse.at_ms > PULSE_STALE_MS) { S.grid = make(null, S.music, now_ms); S.next = null; S.switches++; }   // the ear fell silent (judged only on the time it was asked)
    return S.grid;
  }
  function clock() { const now = house(); if (!num(now)) return null; return sampleGrid(grid(now), now); }
  /** hold(on): THE EAR UNASKED. true: the ear is not asked from now (a glass whose engine rests pauses its pulse read), so its silence is not judged: the
   *  pulse's age and the grid in force stand. false: it is asked again; the age runs on from where it stood. Idempotent; it needs the house time.
   *  -> whether the clock holds. */
  function hold(on) {
    const now = house();
    if (on) { if (S.heldAt === null && num(now)) { S.heldAt = now; S.holds++; } }
    else if (S.heldAt !== null) { if (num(now)) S.unasked += Math.max(0, now - S.heldAt); S.heldAt = null; }
    return S.heldAt !== null;
  }
  return { hear, clock, grid, hold, beatOf: (ts) => beatOf(grid(), ts), downbeatOf: (ts) => downbeatOf(grid(), ts), timeOf: (beat) => timeOf(grid(), beat), smooth,
    state: () => ({ source: S.grid?.source ?? null, music_seq: S.music?.music_seq ?? null, pulse: !!S.pulse, pending: !!S.next, heard: S.heard, switches: S.switches, held: S.heldAt !== null, holds: S.holds }) };
}

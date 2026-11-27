// lyssajudron-score.mjs - THE SCORE OF THE LYSSAJUDRON (Oct 11 2026, lane LYSSA of intro/room/LYSSAJUDRON-HOME-2026-10-10.md, sections 0 and 1,
// amendments A3, A7, A8; the second round's downbeat, homecoming and carry). Pure: no DOM, no three.js, no clock of its own. His law (Oct 10 22:50):
// every polarized interface computes its own view independently; the glasses agree on the rhythm only. So everything here is a function of (GENESIS,
// the clock the twin hands over, the causes placed on the grid as notes), never of a frame and never of a wall-clock read of its own
// (lyssajudron.test.mjs greps this file for the two time globals: zero hits).
//
// THE ORBITS are the engine's (lysa-engine.js RQ.discussionPoint, lissajousUnit, phaseAtDistance, seedOf), ported line by line and pinned to it by
// lyssajudron-score.test.mjs (|delta| < 1e-9): the 3:2 spherical Lissajous (polar sin 2u, azimuth 3u: the fifth), four tilted lanes, one arc-length
// table so a satellite moves at one speed along the wire. The engine's time -> azimuth map (time*.004) becomes the bar count: the figure closes in
// PERIOD_BARS = 12 bars (three satellites per lane at 1/3 phase, so a lane recurs every 4 bars and the whole returns on the downbeat of every bar 12k),
// and the lanes precess a full turn in 640 bars. Engine units become metres by K = 0.206 (body radius 0.206 m, satellites 0.087 m, lanes 0.40-0.42 m,
// about a metre across), the engine's z (depth away) is flipped to the Station's (y up, z toward the eye on the Mac's window).
//
// THE DOWNBEAT (the verifier: "beats 1 and 3 differ only by orbital drift"): a gesture on the one, composed, every part a function of bar_phase.
// The thruster's push: the hover dips DIP_M into the downbeat over the bar's last beat and lifts over the first half of the bar (dipAt), the cone
// flares for one beat (flashAt); the three eyes (EYE_SEATS) hold their lane phase on the downbeat and drift behind the other nine between, catching
// up over the bar's last eighth (snapOf: the step lands on the one); the wires brighten from 0.5 to 0.9 on the downbeat and fade over one beat
// (wireBrightness). So beat 1 and beat 3 of one bar at the same beat_phase differ in height by DIP_M*(1 - smooth(beat_phase/2)) and in wire
// opacity by WIRE_FLASH*(1 - smooth(beat_phase)): lyssajudron.test.mjs measures both on the mounted figure.
//
// THE GRID. A clock is {now_ms, beat_ms, bar_ms, beat_phase, bar_phase, downbeat_ms, bpm, source, beat, bar, epoch_ms} (beat-clock.mjs, lane TWIN,
// A3: beat and bar are integers since epoch_ms, pure functions of the published grid and now_ms, so two glasses that opened at different times hold
// the same integers). genesisClock(now_ms) is the fallback grid every glass agrees on without a station: epoch GENESIS, 600 ms a beat, 4 beats a bar.
// A cause heard at ts sounds on beatOf(ts) = ceil((ts - epoch)/beat_ms), a wall or a flight on downbeatOf(ts) (the next downbeat, as a beat index);
// the note keeps its beat (never recomputed on a grid move, A3). A phrase ends a bar after its last note: homeBeatOf(lastNote) is the downbeat the
// figure goes home on and the caption returns to the phase's rest line (restLineOf).
//
// THE CARRY (A7, FLIGHT's contract): the plan is answered with the card's point on the hand (cardOnHand(handOf(body, viewer)): HAND_M toward the
// viewer, the card one satellite radius and half its height above the hand); the carrier leaves its orbit on the beat the cause was heard and reaches
// the hand by the downbeat, holds there through any phase FLIGHT draws before the carry (a 'window' or 'overlay' that fills the window, a 'room' that
// shrinks to the hand), rides one radius under the card along the arc (underCard), stands under it on the glass, and returns to its orbit over the bar
// after the landing (carryAt). Without a flight sample the score's own arc flies the same bar.
//
// COST: satelliteAt is one table search (10 steps) and 6 trig calls; a sample of 12 satellites, 4 wires, the yaw and the thruster is ~15 us of JS.
export const GENESIS_S = 1772673332;                 // the Sept 28 landing's hardcoded unix second: every glass running the program shows the same figure
export const GENESIS_MS = GENESIS_S * 1000;
export const BEAT_MS = 600, BEATS_PER_BAR = 4;       // the no-station fallback: 100 bpm, 4/4
export const PERIOD_BARS = 12, PRECESSION_BARS = 640, SEATS = 12, LANES = 4;
export const K = 0.206;                               // metres per engine unit
export const CHILD_SCALE = 0.42;                      // the fractal child (site/clone.html:1104 childScale: .42)
export const R_SAT = K * CHILD_SCALE;                 // a satellite's radius, 0.087 m
export const HOVER_M = 1.30, BOB_M = 0.05, DIP_M = 0.03;   // unit0's centre hovers at eye height; the bob is one beat, lowest on the beat (A8: 0.05 m); the dip is the downbeat's
export const EYE_SEATS = Object.freeze([0, 1, 2]);    // the eye-stalks: him, the work, around (A8)
export const SNAP = 0.35, SNAP_W = 0.125;             // the eyes leave SNAP of a bar's phase for its last SNAP_W: they catch up into the downbeat
export const WIRE_OPACITY = 0.5, WIRE_FLASH = 0.4;    // the wires at rest, and how much they brighten on the one
export const REACH = 0.62, SPREAD = 0.12, GAZE_MAX = 0.7, GLANCE = 0.35;   // an eye-stalk reaches out of its orbit toward its target (0.62 m: past the wires, so the stalk reads); GLANCE: the idle look at the viewer
export const HAND_M = 0.46, CARRY_M = 0.09;           // the hand point, toward the viewer; the card's height in the hand (flight-law CARRY_M)
export const RETURN_BEATS = 1;                        // the work eye's way back from a wall's edge
export const NAME = 'ROMA·0';                          // the landing's own name (site/clone.html:1103): the seed of the phase
export const TILT = Object.freeze([-0.34, 0.68, -0.82, 0.28]);
export const WIRE_SEGMENTS = 256, WIRE_SEGMENTS_LOW = 96;
const TAU = Math.PI * 2;

export const num = (v) => typeof v === 'number' && Number.isFinite(v);
export const vec3 = (v) => (Array.isArray(v) && v.length === 3 && v.every(num) ? [v[0], v[1], v[2]] : v && num(v.x) && num(v.y) && num(v.z) ? [v.x, v.y, v.z] : null);
export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const smooth = (u) => { const t = clamp(u, 0, 1); return t * t * (3 - 2 * t); };
export const wrap = (a) => { const t = (a + Math.PI) % TAU; return (t < 0 ? t + TAU : t) - Math.PI; };
export const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const len = (v) => Math.hypot(v[0], v[1], v[2]);
export const unit = (v) => { const l = len(v); return l > 1e-9 ? [v[0] / l, v[1] / l, v[2] / l] : [0, 0, 1]; };
export let mix = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];
export const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/** The yaw (three.js rotation.y; forward = [sin yaw, 0, cos yaw]) that faces `to` from `from`; null when they stand on one spot. */
export const yawToward = (from, to) => { const dx = to[0] - from[0], dz = to[2] - from[2]; return Math.hypot(dx, dz) < 1e-6 ? null : Math.atan2(dx, dz); };

// ---- the engine's curve, ported ----
export function lissajousUnit(u) { const polar = Math.sin(2 * u); return [polar * Math.cos(3 * u), Math.cos(2 * u), polar * Math.sin(3 * u)]; }
/** scorePoint(lane, u, azimuth): RQ.discussionPoint(lane, u, time, 0) with the azimuth given outright (the engine's is lane*pi*.43 + time*.004): the
 *  unit curve tilted about x by the lane's tilt, turned about y by the azimuth, times the lane's radius. Engine units, engine handedness. */
export function scorePoint(lane, u, azimuth) {
  const radius = 1.94 + (lane % 4) * 0.035, tilt = TILT[lane % 4];
  const p = lissajousUnit(u), c = Math.cos(tilt), s = Math.sin(tilt);
  const y = p[1] * c - p[2] * s, z = p[1] * s + p[2] * c, ca = Math.cos(azimuth), sa = Math.sin(azimuth);
  return [(p[0] * ca + z * sa) * radius, y * radius, (-p[0] * sa + z * ca) * radius];
}
const ARC_STEPS = 1024, ARC = [0];
const curveSpeed = (u) => Math.sqrt(4 + 9 * Math.sin(2 * u) ** 2);
for (let i = 1; i <= ARC_STEPS; i++) { const a = (i - 1) * TAU / ARC_STEPS, b = i * TAU / ARC_STEPS; ARC.push(ARC[i - 1] + (b - a) * (curveSpeed(a) + 4 * curveSpeed((a + b) / 2) + curveSpeed(b)) / 6); }
/** phaseAtDistance(turns): the curve parameter u at a fraction of the arc length (one table serves every lane: uniform speed, no rush at the equator). */
export function phaseAtDistance(turns) {
  const fraction = ((turns % 1) + 1) % 1, distance = fraction * ARC[ARC_STEPS];
  let lo = 0, hi = ARC_STEPS;
  while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (ARC[mid] <= distance) lo = mid; else hi = mid; }
  return (lo + (distance - ARC[lo]) / (ARC[hi] - ARC[lo])) * TAU / ARC_STEPS;
}
const SEEDS = new Map();
/** seedOf(name): the engine's seed, a pure function of the name (never re-hashed per call). */
export let seedOf = (name) => { let v = SEEDS.get(name); if (v === undefined) { v = Array.from(name).reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 65521, 0) / 65521; SEEDS.set(name, v); } return v; };
export const laneOf = (seat) => ((seat % LANES) + LANES) % LANES;
/** The engine's time (its ms) for a bar position: the engine turns the azimuth by time*.004 per lane; here a full precession is PRECESSION_BARS bars. */
export const azimuthOf = (lane, bars) => laneOf(lane) * Math.PI * 0.43 + TAU * bars / PRECESSION_BARS;
export const turnsOf = (seat, bars) => bars / PERIOD_BARS + seat / SEATS + seedOf(NAME) * 0.18;
/** The engine's point as a Station offset from the body's centre (metres, y up, z flipped). */
export const toStation = (p) => [p[0] * K, p[1] * K, -p[2] * K];

// ---- the grid ----
/** clockOf(grid, now_ms): a clock object from a grid {epoch_ms, beat_ms, beats_per_bar, bpm, source, ...} at now_ms. The twin's beat-clock.mjs makes
 *  the real one; this is the same shape for the fallback and the tests. beat and bar are integers since the epoch (negative before it). */
export function clockOf(grid, now_ms) {
  const beat_ms = num(grid?.beat_ms) && grid.beat_ms > 0 ? grid.beat_ms : BEAT_MS, bpb = num(grid?.beats_per_bar) && grid.beats_per_bar > 0 ? Math.round(grid.beats_per_bar) : BEATS_PER_BAR;
  const epoch_ms = num(grid?.epoch_ms) ? grid.epoch_ms : GENESIS_MS, bar_ms = beat_ms * bpb, now = num(now_ms) ? now_ms : epoch_ms;
  const x = (now - epoch_ms) / beat_ms, beat = Math.floor(x), beat_phase = x - beat, bar = Math.floor(beat / bpb), bar_phase = (now - epoch_ms - bar * bar_ms) / bar_ms;
  return { now_ms: now, beat_ms, bar_ms, beats_per_bar: bpb, beat_phase, bar_phase, beat, bar, epoch_ms, downbeat_ms: epoch_ms + bar * bar_ms,
    bpm: num(grid?.bpm) ? grid.bpm : 60000 / beat_ms, source: typeof grid?.source === 'string' ? grid.source : 'genesis', music_seq: grid?.music_seq ?? null };
}
export const GENESIS_GRID = Object.freeze({ epoch_ms: GENESIS_MS, beat_ms: BEAT_MS, beats_per_bar: BEATS_PER_BAR, bpm: 100, source: 'genesis' });
/** genesisClock(now_ms): the no-station clock every glass agrees on: GENESIS, 600 ms, 4 beats a bar. */
export let genesisClock = (now_ms) => clockOf(GENESIS_GRID, now_ms);
/** A clock the twin hands over, made whole (a partial one gets its integers and phases from its grid; nothing: the genesis clock at epoch, frozen). */
export function normalClock(c) {
  if (!c || typeof c !== 'object') return genesisClock(GENESIS_MS);
  if (num(c.beat) && num(c.bar) && num(c.beat_phase) && num(c.bar_phase) && num(c.now_ms) && num(c.beat_ms) && num(c.bar_ms) && num(c.epoch_ms) && num(c.beats_per_bar)) return c;
  return clockOf({ epoch_ms: c.epoch_ms, beat_ms: c.beat_ms, beats_per_bar: num(c.beats_per_bar) ? c.beats_per_bar : num(c.bar_ms) && num(c.beat_ms) ? Math.round(c.bar_ms / c.beat_ms) : BEATS_PER_BAR, bpm: c.bpm, source: c.source, music_seq: c.music_seq }, c.now_ms);
}
/** beatOf(ts, clock): the beat a cause heard at ts sounds on (the next beat at or after it). downbeatOf(ts, clock): the next downbeat, as a beat index.
 *  beatTime(beat, clock): that beat's house time. barsAt(clock): bars since the epoch with the phase (the score's own time). */
export let beatOf = (ts, c) => Math.ceil((ts - c.epoch_ms) / c.beat_ms);
export let downbeatOf = (ts, c) => Math.ceil((ts - c.epoch_ms) / c.bar_ms) * Math.round(c.bar_ms / c.beat_ms);
export const beatTime = (beat, c) => c.epoch_ms + beat * c.beat_ms;
export const barsAt = (c) => c.bar + c.bar_phase;
export const beatsAt = (c) => c.beat + c.beat_phase;
/** at(beat, c, length_beats): the smooth progress 0..1 of a motion that starts on `beat` and lasts `length_beats`; 0 before, 1 after. */
export const at = (beat, c, length_beats = 1) => smooth((beatsAt(c) - beat) / length_beats);
/** homeBeatOf(lastNote, bpb): the downbeat the figure goes home on after a phrase: the first downbeat a full bar after the phrase's last note. */
export let homeBeatOf = (lastNote, bpb = BEATS_PER_BAR) => Math.ceil((lastNote + bpb) / bpb) * bpb;

// ---- the downbeat gesture ----
/** flashAt(clock): 1 on the downbeat, fading smoothly to 0 over the bar's first beat (the wires' flash, the thruster's flare). */
export let flashAt = (clock) => { const c = normalClock(clock); return 1 - smooth(c.bar_phase * c.beats_per_bar); };
/** dipAt(clock): the thruster's push: 1 on the downbeat, lifting to 0 over the bar's first half, dipping back in over the bar's last beat. */
export function dipAt(clock) {
  const c = normalClock(clock), p = c.bar_phase, last = 1 - 1 / c.beats_per_bar;
  return p < 0.5 ? 1 - smooth(p / 0.5) : p >= last ? smooth((p - last) / (1 - last)) : 0;
}
/** snapOf(bar_phase): the eyes' share of a bar: they drift through (1 - SNAP) of it over the bar and take the rest in its last SNAP_W, so they stand
 *  on their lane phase exactly on the downbeat (snapOf(0) = 0, snapOf(1) = 1) and lag the other nine between. */
export let snapOf = (p) => (1 - SNAP) * p + SNAP * smooth((p - (1 - SNAP_W)) / SNAP_W);
export const eyeBarsAt = (c) => c.bar + snapOf(c.bar_phase);
/** wireBrightness(clock): the wires' opacity: WIRE_OPACITY at rest, WIRE_OPACITY + WIRE_FLASH on the downbeat, back in one beat. */
export const wireBrightness = (clock) => WIRE_OPACITY + WIRE_FLASH * flashAt(clock);
/** hoverY(clock): the body's height: one bob a beat, lowest on the beat (the thruster's push), and the downbeat's dip on the one. */
export let hoverY = (clock, base = HOVER_M) => { const c = normalClock(clock); return base - BOB_M * Math.cos(TAU * c.beat_phase) - DIP_M * dipAt(c); };
/** thrusterLength(clock): the cone under unit0 in metres, longest right after the beat, flaring on the downbeat. */
export const thrusterLength = (clock) => { const c = normalClock(clock); return 0.10 + 0.06 * (1 - c.beat_phase) ** 2 + 0.05 * flashAt(c); };

// ---- the figure ----
/** satelliteAt(seat, clock): the satellite's offset from the body's centre in the body's frame (Station metres, y up), on its lane's wire. A pure
 *  function of the bar count: at bar 12k and phase 0 every seat stands on the downbeat figure. An eye's parameter along the wire is snapped
 *  (eyeBarsAt); the wire's azimuth is the lane's, continuous, so the eye stays on its wire. */
export function satelliteAt(seat, clock) {
  const c = normalClock(clock), bars = barsAt(c), lane = laneOf(seat), own = EYE_SEATS.includes(seat) ? eyeBarsAt(c) : bars;
  return toStation(scorePoint(lane, phaseAtDistance(turnsOf(seat, own)), azimuthOf(lane, bars)));
}
/** wirePoints(lane, n): the lane's wire as n+1 points of the tilted unit curve times its radius in the body's frame at azimuth 0 (static; a group turned
 *  by rotation.y = -azimuthOf(lane, bars) puts it under its satellites: the engine turns about y in the flipped frame, so the sign flips with z). */
export function wirePoints(lane, n = WIRE_SEGMENTS) { const out = []; for (let i = 0; i <= n; i++) out.push(toStation(scorePoint(lane, TAU * i / n, 0))); return out; }
export const wireYaw = (lane, clock) => -azimuthOf(lane, barsAt(normalClock(clock)));
/** worldOf(offset, body, yaw): body + R_y(yaw) . offset (A7: a satellite's world position). */
export const worldOf = (o, body, yaw) => { const c = Math.cos(yaw), s = Math.sin(yaw); return [body[0] + o[0] * c + o[2] * s, body[1] + o[1], body[2] - o[0] * s + o[2] * c]; };
/** stalkAt(s, orbit, body, target, g): an eye-stalk's offset from the body: the eye swings round the body from its orbit toward the target's direction
 *  (the engine's spherical approach: the direction mixed and renormalised, the radius mixed from the orbit's to REACH) and sits SPREAD off the line at
 *  angle 2 pi s / 3, so three eyes on one target do not meet; g 0..GAZE_MAX. At g 0 the orbit itself. */
export function stalkAt(s, orbit, body, target, g) {
  if (!(g > 0) || !target) return orbit;
  const d = unit(sub(target, body)), r0 = len(orbit) || K;
  let a = cross(d, [0, 1, 0]); if (len(a) < 1e-6) a = cross(d, [1, 0, 0]); a = unit(a); const b = cross(d, a);
  const th = TAU * s / 3, o = add(add([0, 0, 0], a, Math.cos(th)), b, Math.sin(th));
  const dir = unit(mix(unit(orbit), add(d, o, SPREAD / REACH), g)), radius = r0 + (REACH - r0) * g;
  return add([0, 0, 0], dir, radius);
}
/** handOf(body, viewer): the hand point, HAND_M from the body's centre toward the viewer's eye (toward +z when nobody looks). */
export const handOf = (body, viewer) => add(body, viewer ? unit(sub(viewer, body)) : [0, 0, 1], HAND_M);
/** cardOnHand(hand, height): where a card of that height (FLIGHT's CARRY_M, else the score's) sits on the hand: half its height and one satellite radius above it (the plan's origin, A7). */
export const cardOnHand = (hand, height = CARRY_M) => [hand[0], hand[1] + height / 2 + R_SAT, hand[2]];
/** underCard(position, height): where the hand is under a card of that height at that centre (the carrier along the arc, FLIGHT's ask). */
export const underCard = (p, height = CARRY_M) => [p[0], p[1] - height / 2 - R_SAT, p[2]];

// ---- the motions, each a function of the clock and its note ----
/** gazeAt(g, clock): a turn {from, to, beat} (one beat from its beat); the yaw now. */
export const gazeAt = (g, c) => (!g ? 0 : g.from + wrap(g.to - g.from) * at(g.beat, c, 1));
/** retarget(g, to, cause_ms, clock): a new target turns from the next beat after the cause, re-aiming from the yaw the figure will hold on that beat. */
export function retarget(g, to, cause_ms, clock) {
  const c = normalClock(clock), beat = Math.max(beatOf(cause_ms, c), c.beat + 1);
  const from = g ? gazeAt(g, clockOf({ ...c, epoch_ms: c.epoch_ms, beat_ms: c.beat_ms, beats_per_bar: c.beats_per_bar }, beatTime(beat, c))) : to;
  return { from: wrap(from), to: wrap(to), beat };
}
/** goAt(m, clock): a go-to {p0, p1, beat} (one bar from its downbeat); the position now. */
export const goAt = (m, c, fallback = null) => (!m ? fallback : mix(m.p0, m.p1, at(m.beat, c, normalClock(c).beats_per_bar)));
/** chainAt(notes, start, clock, length_beats, step): a chain of notes {to, beat} sorted by beat, each a motion of length_beats from its beat that re-aims
 *  from wherever the previous one stands on that beat (a wall per beat moves the body along the room; a target per beat turns the gaze): the value now.
 *  step(from, to, k) mixes; `start` is the value before the first note. Pure in the clock: the same chain on every glass. */
export function chainAt(notes, start, clock, length_beats, step) {
  const c = normalClock(clock), t = beatsAt(c); let from = start, to = start, beat = -Infinity;
  for (const n of notes) { if (t < n.beat) break; from = step(from, to, smooth((n.beat - beat) / length_beats)); to = n.to; beat = n.beat; }
  return step(from, to, smooth((t - beat) / length_beats));
}
export const yawStep = (a, b, k) => a + wrap(b - a) * k;
/** pruneChain(notes, clock, length_beats): the notes still needed: every one from the last that finished before now on (its end is the chain's start). */
export function pruneChain(notes, clock, length_beats) {
  const t = beatsAt(normalClock(clock)); let keep = 0;
  for (let i = 0; i < notes.length; i++) if (t >= notes[i].beat + length_beats) keep = i;
  return notes.slice(keep);
}
/** envelope(e, clock): a stalk's reach {since (beat), until (beat|null)}: rises 0 -> GAZE_MAX over one beat from `since`, holds, falls over one bar from `until`. */
export function envelope(e, clock) {
  if (!e) return 0;
  const c = normalClock(clock), up = at(e.since, c, 1) * GAZE_MAX;
  return num(e.until) ? up * (1 - at(e.until, c, c.beats_per_bar)) : up;
}
/** tracePoint(wall, clock): the point the work eye traces on a wall {a, b, h, beat}: along its top edge from a to b as the wall rises over its bar. */
export function tracePoint(w, clock) { const c = normalClock(clock), k = at(w.beat, c, c.beats_per_bar), p = mix(w.a, w.b, k); return [p[0], w.a[1] + w.h * k + 0.06, p[2]]; }
/** traceAt(walls, clock, orbit): the work eye on the newest wall in its bar: it swings from where it was (its orbit, or the previous wall's edge) to the
 *  edge over the bar's first beat, traces it, and after the bar returns to its orbit over RETURN_BEATS. {position, phase: 'trace'|'return', k, wall},
 *  null when no wall is in play (walls sorted by beat; `orbit` is the eye's world position on its wire now). */
export function traceAt(walls, clock, orbit) {
  const c = normalClock(clock), bpb = c.beats_per_bar, t = beatsAt(c);
  let i = -1; for (let j = 0; j < walls.length; j++) if (t >= walls[j].beat && t < walls[j].beat + bpb + RETURN_BEATS) i = j;
  if (i < 0) return null;
  const w = walls[i], end = w.beat + bpb;
  if (t >= end) { const k = smooth((t - end) / RETURN_BEATS); return { position: mix(tracePoint(w, clockOf(c, beatTime(end, c))), orbit, k), phase: 'return', k, wall: w }; }
  const prev = i > 0 && t < w.beat + 1 ? traceAt(walls.slice(0, i), c, orbit)?.position || null : null;   // continuous: from the previous wall's edge or its way back
  const k = smooth(t - w.beat);
  return { position: mix(prev || orbit, tracePoint(w, c), k), phase: 'trace', k, wall: w };
}
/** carryAt(carry, clock, orbit, hand, flight): where the carrying satellite is. carry = {beat (the downbeat it leaves on), heard (the beat the cause
 *  was heard on), to (the glass), landed, landed_beat, landedAt?}; `orbit` its world position on its wire now, `hand` the hand point now, `flight`
 *  FLIGHT's sample flightAt(flight, now) when the flight carries an origin and a grid (its phase and the card's position and size), else null: then the
 *  score's own arc (the card on the hand to the glass, one bar from the downbeat, lifted). {position, phase: 'before'|'reach'|'hold'|'carry'|'landed'|
 *  'return'|'done', k}. */
export function carryAt(carry, clock, orbit, hand = null, flight = null) {
  if (!carry) return null;
  const c = normalClock(clock), bpb = c.beats_per_bar, t = beatsAt(c), beat = carry.beat, to = vec3(carry.to) || orbit, heard = num(carry.heard) ? carry.heard : beat;
  const H = vec3(hand) || vec3(carry.hand) || orbit;
  if (t < heard) return { position: orbit, phase: 'before', k: 0 };
  if (t < beat) { const k = beat > heard ? smooth((t - heard) / (beat - heard)) : 1; return { position: mix(orbit, H, k), phase: 'reach', k }; }
  const f = flight && typeof flight === 'object' ? flight : null, fp = f ? vec3(f.position) : null, fh = f && Array.isArray(f.size) && num(f.size[1]) ? f.size[1] : CARRY_M;
  const land = num(carry.landed_beat) ? carry.landed_beat : beat + bpb;
  if (f && fp) {
    if (f.phase === 'carry') return { position: underCard(fp, fh), phase: 'carry', k: num(f.t) ? clamp(f.t, 0, 1) : 0 };
    if (f.phase !== 'landed') return { position: H, phase: 'hold', k: 0 };
  } else if (t < beat + bpb) {
    const k = smooth((t - beat) / bpb), lift = Math.min(0.6, 0.18 * len(sub(to, H))) * 4 * k * (1 - k);
    return { position: add(mix(H, to, k), [0, 1, 0], lift), phase: 'carry', k };
  }
  const landedAt = f && fp ? underCard(fp, fh) : vec3(carry.landedAt) || to;
  if (!carry.landed) return { position: landedAt, phase: 'landed', k: 1 };
  const k = smooth((t - land) / bpb);
  return k >= 1 ? { position: orbit, phase: 'done', k: 1 } : { position: mix(landedAt, orbit, k), phase: 'return', k };
}

// ---- the notes: every cause and the beat it sounds on (section 0's table) ----
/** noteOf(cause, clock): {kind, beat, ...} with its beat computed once on the grid the cause was heard on. */
export function noteOf(cause, clock) {
  const c = normalClock(clock), ts = num(cause?.at_ms) ? cause.at_ms : num(cause?.ts) ? cause.ts : c.now_ms, kind = cause?.kind;
  if (num(cause?.beat)) return { ...cause, beat: cause.beat };   // the bus already placed it (TWIN's wall/thing notes)
  switch (kind) {
    case 'wall': return { ...cause, beat: downbeatOf(ts, c) + (num(cause.index) ? cause.index : 0) };
    case 'flight': case 'glass-placed': case 'go-to': case 'line': return { ...cause, beat: downbeatOf(ts, c) };
    default: return { ...cause, beat: beatOf(ts, c) };   // cursor, online/offline, thing (the bus names its beat), anything else: the next beat
  }
}

// ---- the lines: first person, never an id or a machine kind ----
export const LINES = Object.freeze({
  nothing: "I can't see your home yet. Walk it, glass in hand.",
  old: "I remember your home from {day}. Say the word and I'll draw it, or walk it again.",
  live: "I'm watching you walk.",
  wall: "There's a wall. I'm drawing it.",
  scanned: "I see your walls. I'm drawing them.",
  join: 'A new glass is here. I see it.',
  hold: "A new glass is here. I'll hold it till I know your walls.",
  show: "I'll carry that to the big glass.",
  remembering: 'Drawing what I remember.',
});
export const MAX_CHARS = 90;
/** One line, at most MAX_CHARS: whitespace folded, the end cut with an ellipsis (hologram.mjs's clipLine, ported). */
export function clipLine(text) { const s = String(text ?? '').replace(/\s+/g, ' ').trim(); return s.length <= MAX_CHARS ? s : `${s.slice(0, MAX_CHARS - 1).trimEnd()}…`; }
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
/** oldLine(finished_ms): the old scan's line with its day ("Oct 8"), read off the dial's own stamp. */
export function oldLine(finished_ms) {
  if (!num(finished_ms) || finished_ms <= 0) return LINES.old.replace(' from {day}', '');   // no stamp on the dial: no day named
  const d = new Date(finished_ms); return LINES.old.replace('{day}', `${MONTHS[d.getMonth()]} ${d.getDate()}`);
}
/** lineOf(phase, dial): the line for a scan phase (scan-gate.mjs's nothing|old|live|scanned) before any wall stands. */
export function lineOf(phase, dial = null) { return phase === 'old' ? oldLine(dial?.finished_ms) : phase === 'live' ? LINES.live : phase === 'scanned' ? LINES.scanned : LINES.nothing; }
/** homeLine(walls, things, remembered): the rest line once walls stand: "I'm home. 4 walls, 3 things."; an old scan he asked for: "Home, as I remember it. 3 walls." */
export function homeLine(walls, things = 0, remembered = false) {
  if (remembered) return `Home, as I remember it. ${plural(walls, 'wall')}.`;
  return `I'm home. ${plural(walls, 'wall')}, ${things > 0 ? plural(things, 'thing') : 'no things yet'}.`;
}
/** showLine(name): "I'll carry that to <the glass's own name>." (the Nest's name for the seat, A10); none: the spec's line. */
export const showLine = (name) => (typeof name === 'string' && name.trim() ? `I'll carry that to ${name.trim()}.` : LINES.show);
/** showingLine(name): the rest line while a glass shows his canvas: "<name> is showing your canvas." */
export const showingLine = (name) => { const n = typeof name === 'string' && name.trim() ? name.trim() : 'a glass'; return `${n[0].toUpperCase()}${n.slice(1)} is showing your canvas.`; };
/** guessLine(n): the twin's guesses, said once when the count changes: "5 guesses waiting for your scan."; '' for none. */
export const guessLine = (n) => (num(n) && n > 0 ? `${plural(Math.round(n), 'guess', 'guesses')} waiting for your scan.` : '');
/** restLineOf({phase, walls, things, showing, dial}): the line the caption returns to after a phrase: a glass showing his canvas, else the home once
 *  walls stand (as remembered, in 'old'), else the phase's line. */
export function restLineOf({ phase = 'nothing', walls = 0, things = 0, showing = null, dial = null } = {}) {
  if (showing) return showingLine(typeof showing === 'string' ? showing : showing.name);
  if (walls > 0) return homeLine(walls, things, phase === 'old');
  return lineOf(phase, dial);
}

// ---- the one Rust build ----
/** useWasm(o): swap the laws above for house/embertide-score (Rust compiled once to one .wasm, the same bytes on every glass; its loader is
 *  score-wasm.mjs, o = {bytes, url}) when it loads: lissajousUnit, phaseAtDistance, scorePoint, seedOf, satelliteAt, clockOf, genesisClock, beatOf,
 *  downbeatOf, dipAt, flashAt, snapOf, traceAt, homeBeatOf, chainAt, hoverY, mix. This file stays the reference and the fallback; the two are pinned
 *  together by embertide-score/tests/vectors.json. true when swapped; false when the module is not there, and the JS keeps running. */
export async function useWasm(o) {
  let w;
  try { w = (await (await import('./score-wasm.mjs')).load(o)).score; } catch { return false; }
  ({ lissajousUnit, phaseAtDistance, scorePoint, seedOf, satelliteAt, clockOf, genesisClock, beatOf, downbeatOf, dipAt, flashAt, snapOf, traceAt, homeBeatOf, chainAt, hoverY, mix } = w);
  return true;
}

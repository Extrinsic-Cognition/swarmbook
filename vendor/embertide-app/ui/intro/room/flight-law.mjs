// flight-law.mjs · THE FLIGHT: one law for a Canvas image shown on a glass (lane FLIGHT of intro/room/LYSSAJUDRON-HOME-2026-10-10.md, Oct 11 2026 WEST;
// born in TWIN-2026-10-10.md point 5). His law, Oct 4 01:04: "a 2D overlay on my macbook and that macbook is in the nestOS... anamorphic animations
// where the 2D thing looks like is coming towards me because it starts occupying the entire screen and then becomes small like wile e coyote and
// cartoons and he appears into the other screens"; Oct 10 22:15: the Lyssajudron carries it ("agents are flying from the lyssajudron"); Oct 10 22:50:
// the glasses agree on the rhythm only. The thing is an image shown from the Canvas (tools/embertide-mesh/SCREEN-SHARE.md): the Nest ref
// scene/entities/glass-<seat>-share lands with source {blobId (its sha256), mime image/png, width, height, op} and the Nest's own ts and seq on its entry.
//
// ONE LAW, sampled by every glass on its own, whenever it samples (C-2), as walk-law.mjs is: the flight is a pure function of that entry (ts: the cause;
// seq: the seed of its arcs), the bar grid the cause lands on, the target glass's pose, the viewer's eye (the window the 2D thing fills: the eye in front
// of the placed desk glass, derived from the Nest alike by every glass) and, when the Lyssajudron answers, the satellite it leaves from. No second entity,
// no clock of its own, no picture on the wire (foundation 2). The Mac's window (flight-layer.mjs) samples it in the twin's paint; tv1's portal
// (rite.html, through tools/embertide-mesh/lib/portal-cut.mjs) and a phone over its passthrough sample the same world pose with their own cameras and
// draw their own pictures: nobody compares a picture with anybody. Pure: no I/O, no clock, no DOM. Total: bad input gives null, never a throw.
//
// THE RHYTHM (section 0 of the spec). A cause at the Nest's ts sounds on the grid: `gridOf(clock, ts)` places it on the next downbeat at or after ts
// (`start_ms`), with the station's `bar_ms` and `beat_ms` and, when the clock names its epoch, the integer `beat` and `bar` of that downbeat. Two glasses
// fed the same clock and the same entry hold the same integers whatever they draw. The grid is computed ONCE when the cause is heard and frozen on the
// flight (A3: a note keeps its beat, never recomputed on a grid move): the window phase starts on downbeatOf(ts), the into phase on the next beat, the
// carry on the beat after, and it lands on the following downbeat. Without a grid (no clock lent) the fixed WINDOW_MS / INTO_MS / ROOM_MS from ts hold.
//
// THE SHAPE, in ms after `start_ms` (the downbeat; ts itself without a grid). The window phase runs ALWAYS (the verifier's walk of Oct 11: a flight
// that skipped it was a 20 px card); what follows it depends on whether the Lyssajudron answered the plan with an origin.
//   < 0                 'before'  nothing is drawn (alpha 0); the pose is the window phase's first.
//   0 .. beat           'window'  the 2D thing grows from where it sat on the window (`from`, window fractions; null = the centre) to FILL the window
//                                (ease-out) over one beat (WINDOW_MS without a grid). Its world pose is the anamorphic one: on the eye's ray through the
//                                rect, from the window's own plane (viewer.distance) to the near plane (NEAR_M), sized so that the eye sees exactly the rect.
//   WITH AN ORIGIN (the Lyssajudron answered 'flight-plan' with the satellite it detaches: its world position, the hand):
//   beat .. 2 beats     'into'    from the near plane, where it fills the eye's window, it shrinks into the room along a cubic with a small hop (seeded by
//                                seq) to the hand, growing to CARRY_M (0.32 m: a card that reads in the diorama), and lands in the hand on the beat
//                                (INTO_MS without a grid). The hand waits at the origin through this.
//   2 beats .. bar      'carry'   the hand carries it along the cubic arc from the origin to the glass's quad (the rest of the bar: two beats at 4/4, never
//                                under one; ROOM_MS without a grid), the card growing from CARRY_M to the glass's fit and turning to hang as the glass
//                                does; it lands on the following downbeat. `hand` is the card's position: the satellite rides it.
//   WITHOUT (a Show from the Canvas tab, or nobody to answer):
//   beat .. beat + bar  'room'    from the near plane along a cubic arc into the room to the glass's quad (ease-in-out) over one bar (ROOM_MS without a
//                                grid): it leaves along the chord, rises a little and bends a little (both seeded by seq), and settles onto the glass face
//                                on. Seen from the eye it becomes small, like the coyote.
//   after               'landed'  on the quad (the share's surface, the image fitted without stretching), alpha 1, until the share ref is cleared.
// The phases join: position, size and facing are continuous at every join, and the speed is zero at the joins (the cartoon's hang).
// A sample: { phase, t (0..1 within the phase; 0 before, 1 landed), position [x, y, z], scale (the image's height, m), size [w, h] (m), yaw, pitch (the
// image plane's facing), alpha, screen ({x, y, w, h} window fractions in the window phase and before it; null after it: each glass projects the world
// pose), hand (where the carrying satellite is: the origin until the carry, the card's position through it, the quad once landed; null without an
// origin: the Lyssajudron places its instance there, A7) }.
//
// FRAME: the Station frame (the scene's), metres, y up. A yaw is a heading: forward = [sin yaw, 0, cos yaw] (the rite's convention, portal-cut's actors).
// A glass pose { position: the quad's centre, yaw: the way its face looks (its normal, into the room), size: [w, h] } (portal-cut's plane { c | centre,
// n | normal, w | width, h | height } reads too). A viewer { position: the eye, yaw: where it looks (at its own window), pitch (radians, up positive,
// default 0), fov: the window's vertical angle from the eye (degrees; a number under 1 is read as radians, as the house's cameras keep them: layout-layer
// VIEWS 0.55 and 0.04), aspect: the window's w / h, distance: the eye to its window (m; the eye to the target glass when not said) }. THE EYE IS ONE ON EVERY
// GLASS (Nov 2 2026, his "we dont support line-of-sight across multiple screens"): the viewer is the one eye the glass is handed (his head, head-eye.mjs; the
// Board's own camera); a flight with no viewer is no flight. The eye 0.55 m before the desk glass (eyeOf) and the axis eye 2.5 m before the target went. An origin { position
// (Station frame), satellite (the instance index the Lyssajudron detaches, or null) }. The image plane's yaw and pitch are the way its picture faces (the
// eye at the start, the room once landed: pitch 0, as a glass hangs), continuous through the flight (not wrapped); its right, seen from the side it
// faces, is [cos yaw, 0, -sin yaw].
// COST: a sample is one door of the module (THE CARD FLIES BY THE MODULE, below; flight-law.test.mjs 'cost' measures it on this Mac and states it per beat
// at the Mac's sampling); a frozen flight from flightSeed is built once into a slot of the module, so a sample pays only the sample; at rest nothing is computed.
// THE WINDOW IS THE EYE DOOR'S (Nov 2 2026, lane/the-copies-take-the-door; embertide-radio/nexus/THE-COPIES-TAKE-THE-DOOR-LANDING.md; his words that night,
// "who cares about js if we go rust + wasm?", "it is 1 rust system, not 1 rust program"): viewerCam and projectView were the flight's own SQUARE pinhole, a
// copy of the projection beside the one every glass takes (EYE-LANDING.md's census). Their frustum, from the eye and the plane of its window, is now the
// nexus's (eye-door.mjs: eye.rs in WASM, by its sha256), asked once at the first window by a dynamic import (as useWasm asks the score's). Until the module
// is in hand, and wherever it is refused (the Board's sealed one body, whose ONE_BODY.dyn refuses; a page that cannot fetch it), one-law.mjs's frustum is
// the FALLBACK, the same bits; a point crosses the frustum by one-law.mjs project. No law of the window is written in this file (the test holds the door,
// the fallback and the square pinhole they replace to one another: tests/the-copies-take-the-door.test.mjs).
// THE CARD FLIES BY THE MODULE (Nov 3 2026, lane/the-card-flies-by-the-module; his Nov 2 words over the holy water, "who cares about js if we go rust + wasm?",
// "it is 1 rust system, not 1 rust program"): the flight's numbers (when its phases sound, the near plane's pose, the two seeded arcs, the sample) are
// embertide-score's flight.rs, their one copy, through embertide-scene's card doors: the module every glass loads (scene-wasm.mjs) and the Board's sealed
// body compiles (its SCENE-LAW block). This file carried them as JavaScript beside the module, and the Board, whose one body imports no .wasm, flew by that
// text; it left, held to the bit by the module's tests (embertide-scene/tests/card.rs, on embertide-score's vectors cut from it before it left). What stays
// here is the shapes' readers, the grid's, the window's camera and the card's quad; a flight needs the module (useWasm) and is null until it stands.

import { frustum as lawFrustum, project as lawProject, planeOf as lawPlane } from './one-law.mjs';   // the plane's reader, the point through a frustum, and the frustum's FALLBACK only

export const SCHEMA = 'embertide.flight/v1';
export const BEATS_PER_BAR = 4;
export const GENESIS_MS = 1772673332000;       // the no-station epoch (his Sept 28 landing's GENESIS): a glass with no ear still has a grid
export const GENESIS_BEAT_MS = 600;            // 100 bpm
export const NEAR_M = 0.15;                    // the eye's near plane: a glass reaching inside it is no window (head-eye.mjs); the card hangs there when it fills the window (the module's near_m)
export const SHARE_REF = /^scene\/entities\/glass-([\w.-]+)-share$/;
export const FULL = Object.freeze({ x: 0, y: 0, w: 1, h: 1 });
export const CENTRE = Object.freeze({ x: 0.375, y: 0.375, w: 0.25, h: 0.25 });
export const PHASES = Object.freeze(['before', 'window', 'into', 'carry', 'room', 'landed']);   // before → window → into → carry → landed with an origin; before → window → room → landed without
const DEG = Math.PI / 180;
const HEX = /^[0-9a-f]{64}$/;

const fin = (v) => typeof v === 'number' && Number.isFinite(v);
const num = (v) => (typeof v === 'number' ? v : typeof v === 'string' && v.trim() !== '' ? Number(v) : NaN);
const pos = (v) => { const n = num(v); return fin(n) && n > 0 ? n : 0; };
const fin3 = (p) => Array.isArray(p) && p.length === 3 && p.every(fin);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const nul = (x) => (x === x ? x : null);   // a null of the JS comes back from the module as NaN
// the eye's frame: forward f (yaw and pitch), right r (level), up u = r x f (square to both)
function eyeFrame(V) {
  const cp = Math.cos(V.pitch || 0), f = [Math.sin(V.yaw) * cp, Math.sin(V.pitch || 0), Math.cos(V.yaw) * cp], r = [-Math.cos(V.yaw), 0, Math.sin(V.yaw)];
  return { f, r, u: cross(r, f) };
}
function deepFreeze(o) { if (o && typeof o === 'object' && !Object.isFrozen(o)) { Object.freeze(o); for (const v of Object.values(o)) deepFreeze(v); } return o; }

/** shareSeat(name): the seat a share ref names ('scene/entities/glass-tv1-share' -> 'tv1'), else null. */
export function shareSeat(name) { const m = typeof name === 'string' ? SHARE_REF.exec(name) : null; return m ? m[1] : null; }

/** refOf(x): a ref entry's parts in any shape a glass meets it: the stream's {type: 'ref', seq, ts, payload: {name, rev, value}}, a flat
 *  {name, value, rev, seq, ts}, GET /nest/ref's answer {name, ref: {value, rev, seq, ts}}, or an Event whose detail is one of them
 *  -> { name, rev, value (null = cleared), ts, seq } (ts and seq NaN when absent), or null without a name. */
export function refOf(x) {
  try {
    if (!x || typeof x !== 'object') return null;
    const e = x.detail && typeof x.detail === 'object' && !x.payload && typeof x.name !== 'string' ? x.detail : x;
    const inner = !e.payload && e.ref && typeof e.ref === 'object' ? e.ref : null, p = e.payload && typeof e.payload === 'object' ? e.payload : inner || e;
    const name = typeof p.name === 'string' ? p.name : e.name; if (typeof name !== 'string') return null;
    const at = inner || e, rev = num(p.rev);
    return { name, rev: fin(rev) ? rev : null, value: p.value === undefined ? null : p.value, ts: num(at.ts), seq: num(at.seq) };
  } catch { return null; }
}
/** shareEntry(x): a share ref's entry (any shape refOf reads) -> { name, seat, rev, value, ts, seq }, or null when it is not a share ref with a
 *  time and a place in the log. */
export function shareEntry(x) {
  const r = refOf(x), seat = r && shareSeat(r.name);
  return seat && fin(r.ts) && fin(r.seq) ? { ...r, seat } : null;
}

/** poseOf(p): a glass pose { position, yaw, size: [w, h] } from either shape (see FRAME), or null without a centre and a facing. */
export function poseOf(p) {
  if (!p || typeof p !== 'object') return null;
  const position = [p.position, p.centre, p.center, p.c].find(fin3); if (!position) return null;
  let yaw = num(p.yaw);
  if (!fin(yaw)) { const n = [p.normal, p.n].find(fin3); if (n && Math.hypot(n[0], n[2]) > 1e-9) yaw = Math.atan2(n[0], n[2]); }
  if (!fin(yaw)) return null;
  let w = Array.isArray(p.size) ? pos(p.size[0]) : 0, h = Array.isArray(p.size) ? pos(p.size[1]) : 0;
  w = w || pos(p.width_m) || pos(p.width) || pos(p.w); h = h || pos(p.height_m) || pos(p.height) || pos(p.h);
  if (!w || !h) return null;   // THE EYE IS ONE ON EVERY GLASS: a glass whose size nobody said is no glass (GLASS_H_M and GLASS_ASPECT went)
  return { position: position.slice(), yaw, size: [w, h] };
}

/** viewerOf(viewer, to): the eye { position, yaw, pitch, fov (degrees), aspect, distance }, or null: no eye handed, or one that names no window (no fov,
 *  no aspect). THE EYE IS ONE ON EVERY GLASS (Nov 2 2026): the axis eye before the target and the laptop window's defaults went. A viewer with no yaw
 *  looks at the target; one with no distance stands its window at the target (with no target, a picture's own camera, on the pinhole's unit plane). A viewer that carries the glass it looks through (`glass`: its window's own
 *  rectangle, any pose one-law.mjs planeOf reads) keeps it as that plane, and viewerCam projects through it (THE WINDOW IS THE ONE LAW'S); a glass that
 *  does not read is no glass. */
export function viewerOf(v, to = null) {
  if (!v || typeof v !== 'object' || !fin3(v.position)) return null;
  const target = poseOf(to), far = target ? Math.hypot(target.position[0] - v.position[0], target.position[1] - v.position[1], target.position[2] - v.position[2]) : 0;
  let yaw = num(v.yaw);
  if (!fin(yaw)) yaw = target ? Math.atan2(target.position[0] - v.position[0], target.position[2] - v.position[2]) : 0;
  let fov = num(v.fov);
  fov = fin(fov) && fov > 0 && fov < 1 ? fov / DEG : fin(fov) && fov >= 1 && fov < 179 ? fov : NaN;
  const aspect = pos(v.aspect), distance = pos(v.distance) || far || 1;   // no glass looked at (a picture's own camera): the pinhole's unit plane, as handCam's
  if (!fin(fov) || !aspect) return null;
  const pitch = num(v.pitch), lim = 89 * DEG, glass = v.glass != null ? lawPlane(v.glass) : null;
  return { position: v.position.slice(), yaw, pitch: fin(pitch) ? Math.max(-lim, Math.min(lim, pitch)) : 0, fov, aspect, distance, ...(glass ? { glass } : {}) };
}


/** originOf(o): where a carry starts: { position (Station frame), satellite (an instance index, or null) }, or null when there is no origin. */
export function originOf(o) {
  try { return o && typeof o === 'object' && fin3(o.position) ? { position: o.position.slice(), satellite: Number.isInteger(o.satellite) && o.satellite >= 0 ? o.satellite : null } : null; } catch { return null; }
}

/** rectOf(r): a window rect {x, y, w, h} (fractions; x right, y down), or null. surfaceOf(s): a glass surface {u, v, w, h} (fractions, u right,
 *  v down, SCREEN-SHARE.md), the whole glass when it does not read. */
export function rectOf(r) {
  if (!r || typeof r !== 'object') return null;
  const x = num(r.x), y = num(r.y), w = num(r.w), h = num(r.h);
  return fin(x) && fin(y) && fin(w) && fin(h) && w > 0 && h > 0 ? { x, y, w, h } : null;
}
export function surfaceOf(s) {
  const ok = (v) => fin(v) && v >= 0 && v <= 1;
  return s && typeof s === 'object' && ok(s.u) && ok(s.v) && ok(s.w) && ok(s.h) && s.w > 0 && s.h > 0 ? { u: s.u, v: s.v, w: s.w, h: s.h } : { u: 0, v: 0, w: 1, h: 1 };
}

// ---- the rhythm: a clock sample is a grid, a cause lands on its next downbeat ----
/** clockOf(c): the grid in a clock sample (twin.clock(): {epoch_ms, beat_ms, bar_ms, ...}; beat-clock.mjs's shape, or a hand-built one): { epoch_ms,
 *  beat_ms, bar_ms, beats (per bar), source }, or null without an epoch and a length. One of beat_ms / bar_ms suffices (4 beats a bar). */
export function clockOf(c) {
  try {
    if (!c || typeof c !== 'object') return null;
    const epoch = num(c.epoch_ms); if (!fin(epoch)) return null;
    let beat = pos(c.beat_ms), bar = pos(c.bar_ms);
    if (!beat && !bar) return null;
    if (!bar) bar = beat * BEATS_PER_BAR; if (!beat) beat = bar / BEATS_PER_BAR;
    const beats = Math.max(1, Math.round(bar / beat));
    return { epoch_ms: epoch, beat_ms: beat, bar_ms: bar, beats, source: typeof c.source === 'string' ? c.source : null };
  } catch { return null; }
}
/** genesisClock(): the no-station grid every glass can derive alone (GENESIS, 600 ms a beat, 4 a bar). */
export function genesisClock() { return { epoch_ms: GENESIS_MS, beat_ms: GENESIS_BEAT_MS, bar_ms: GENESIS_BEAT_MS * BEATS_PER_BAR, source: 'genesis' }; }
const EPS = 1e-6;   // a cause a microsecond past a downbeat still sounds on it (ts and epochs are whole ms; a bar from a period in seconds is not)
/** beatOf(ts, clock): the beat index (since the epoch) a cause at ts sounds on: the next beat at or after it. NaN when nothing reads. */
export function beatOf(ts, clock) { const c = clockOf(clock), t = num(ts); return c && fin(t) ? Math.ceil((t - c.epoch_ms) / c.beat_ms - EPS) + 0 : NaN; }   // + 0: never a -0
/** downbeatOf(ts, clock): the beat index of the next downbeat at or after ts (a multiple of the beats per bar). NaN when nothing reads. */
export function downbeatOf(ts, clock) { const c = clockOf(clock), t = num(ts); return c && fin(t) ? Math.ceil((t - c.epoch_ms) / c.bar_ms - EPS) * c.beats + 0 : NaN; }
/** beatMs(beat, clock): the house time of a beat index. */
export function beatMs(beat, clock) { const c = clockOf(clock), b = num(beat); return c && fin(b) ? c.epoch_ms + b * c.beat_ms : NaN; }
/** gridOf(clock, ts): the grid a cause at ts lands on: { start_ms: the downbeat's time, bar_ms, beat_ms, epoch_ms, beat, bar (its integers), source },
 *  frozen; null when the clock or ts does not read. This is what flightSeed takes as `grid` and keeps on the flight. */
export function gridOf(clock, ts) {
  const c = clockOf(clock), t = num(ts); if (!c || !fin(t)) return null;
  const beat = downbeatOf(t, c), bar = beat / c.beats;
  return deepFreeze({ start_ms: c.epoch_ms + beat * c.beat_ms, bar_ms: c.bar_ms, beat_ms: c.beat_ms, epoch_ms: c.epoch_ms, beat, bar, source: c.source });
}
/** gridIn(g, ts): a grid as a flight carries it, from gridOf's shape, from the contract's {start_ms, bar_ms, beat_ms} or from a bare clock sample (then
 *  gridOf(clock, ts)); null means the fixed timing. */
export function gridIn(g, ts) {
  try {
    if (!g || typeof g !== 'object') return null;
    const start = num(g.start_ms);
    if (!fin(start)) return gridOf(g, ts);
    let beat = pos(g.beat_ms), bar = pos(g.bar_ms); if (!beat && !bar) return null;
    if (!bar) bar = beat * BEATS_PER_BAR; if (!beat) beat = bar / BEATS_PER_BAR;
    const epoch = num(g.epoch_ms), hasEpoch = fin(epoch), beats = Math.max(1, Math.round(bar / beat));
    const bi = Number.isInteger(g.beat) ? g.beat : hasEpoch ? Math.round((start - epoch) / beat) : null;
    return deepFreeze({ start_ms: start, bar_ms: bar, beat_ms: beat, epoch_ms: hasEpoch ? epoch : null, beat: bi, bar: Number.isInteger(g.bar) ? g.bar : bi != null ? Math.round(bi / beats) : null, source: typeof g.source === 'string' ? g.source : null });
  } catch { return null; }
}

/** flightSeed(ref, { to, viewer, from, origin, grid }): the flight a share ref's entry starts: the entry's ts and seq, the image's size and surface from
 *  its value, `to` the target glass's pose (twin.place(seat), or the door ghost of an unplaced glass), `viewer` the eye whose window the 2D thing
 *  fills (null: the target's axis eye), `from` where the 2D thing sat on that window (window fractions; null: the centre), `origin` the satellite the
 *  Lyssajudron detaches ({position, satellite}; with it the flight is window → into → carry, without it window → room), `grid` the bar grid the cause
 *  lands on (gridOf(clock, ts), the contract's {start_ms, bar_ms, beat_ms}, or a clock sample; none: the fixed ms from ts). Frozen. null when the
 *  entry is not a live share (a cleared ref, no ts or seq) or the target has no pose. */
export function flightSeed(ref, o = {}) {
  try {
    const e = shareEntry(ref); if (!e || !e.value || typeof e.value !== 'object') return null;
    const to = poseOf(o && o.to), viewer = viewerOf(o && o.viewer, to); if (!to || !viewer) return null;   // THE EYE IS ONE ON EVERY GLASS: no eye, no flight
    const src = e.value.source && typeof e.value.source === 'object' ? e.value.source : {};
    const blobId = typeof src.blobId === 'string' && HEX.test(src.blobId.toLowerCase()) ? src.blobId.toLowerCase() : null;
    return deepFreeze({ schema: SCHEMA, name: e.name, seat: e.seat, rev: e.rev, ts: e.ts, seq: e.seq, blobId,
      image: { width: pos(src.width) || null, height: pos(src.height) || null }, surface: surfaceOf(e.value.surface),
      to, viewer, from: rectOf(o && o.from), origin: originOf(o && o.origin), grid: gridIn(o && o.grid, e.ts) });
  } catch { return null; }
}

/** flightWindow(flight) -> { startMs, endMs, beat, bar, lands_beat, carry, carryMs, carry_beat } on the house clock: a glass animates only between
 *  startMs and endMs (and draws nothing before startMs); beat / bar / lands_beat / carry_beat are the grid's integers (null without a grid with an
 *  epoch), the same on every glass fed the same clock; carryMs is the house time the card leaves the hand (null without an origin). With a grid: the window
 *  one beat, the into one beat, the carry the rest of the bar (never under a beat), the room arc one bar; without: the module's fixed ms (cardLaw). The
 *  module's answer; null until it stands. */
export function flightWindow(flight) {
  try {
    const M = card(); if (!M || !flight || typeof flight !== 'object' || !packTiming(flight, PACK) || !M.cardWindow(PACK)) return null;
    const O = M.cardOut; return { startMs: O[0], endMs: O[1], beat: nul(O[2]), bar: nul(O[3]), lands_beat: nul(O[4]), carry: O[5] === 1, carryMs: nul(O[6]), carry_beat: nul(O[7]) };
  } catch { return null; }
}

/** flightAt(flight, nowMs): where the flight is at nowMs on the house clock (see THE SHAPE), the module's sample. null when the flight or the time does
 *  not read, or until the module stands. */
export function flightAt(flight, nowMs) {
  try {
    const M = card(), now = num(nowMs); if (!M || !fin(now)) return null;
    const s = slotOf(M, flight); if (s < 0) return null;
    const ph = M.cardAt(s, now); if (ph < 0) return null;
    const O = M.cardOut;
    return { phase: PHASES[ph], t: O[1], position: [O[2], O[3], O[4]], scale: O[5], size: [O[6], O[7]], yaw: O[8], pitch: O[9], alpha: O[10],
      screen: O[11] === O[11] ? { x: O[11], y: O[12], w: O[13], h: O[14] } : null, hand: O[15] === O[15] ? [O[15], O[16], O[17]] : null };
  } catch { return null; }
}

/** cornersOf(sample): the image's quad in the room, [top-left, top-right, bottom-right, bottom-left] as seen from the side its picture faces:
 *  what any glass projects (the Mac's window through its camera, tv1 through portal-cut's window, a phone through its own). null when it does not read. */
export function cornersOf(s) {
  try {
    if (!s || !fin3(s.position) || !fin(s.scale) || !fin(s.yaw)) return null;
    const h = s.scale / 2, w = (Array.isArray(s.size) && fin(s.size[0]) ? s.size[0] : s.scale) / 2;
    const pt = fin(s.pitch) ? s.pitch : 0, cp = Math.cos(pt), R = [Math.cos(s.yaw), 0, -Math.sin(s.yaw)], p = s.position;
    const U = cross([Math.sin(s.yaw) * cp, Math.sin(pt), Math.cos(s.yaw) * cp], R);   // the plane's up: square to its facing and its right
    const at = (x, y) => [p[0] + R[0] * x + U[0] * y, p[1] + U[1] * y, p[2] + R[2] * x + U[2] * y];
    return [at(-w, h), at(w, h), at(w, -h), at(-w, -h)];
  } catch { return null; }
}

/** viewerCam(viewer, { aspect, glass }): the eye through the plane of its window, the EYE DOOR's frustum (THE WINDOW IS THE EYE DOOR'S, Nov 2 2026): the
 *  glass it looks through when one is handed (opts.glass, else the viewer's own `glass`: any pose one-law.mjs planeOf reads; the eye then sees that
 *  rectangle as it leans, its keystone carried), else its window square to its line of sight at its distance, as tall as its fov and as wide as its aspect
 *  (aspect: the window's actual w / h, else the viewer's): for his head's viewer (head-eye.mjs) that plane IS the glass. -> { eye, f, r, u, tanY, tanX, aspect (the eye's
 *  frame and its window's shares, as the square pinhole kept them), plane, window ('glass' | 'sight'), frustum (its near NEAR_EYE_M; null when the eye
 *  stands within MIN_EYE_M of the plane or behind it), by ('door': the nexus's; 'one-law': the fallback while the module is not in hand or refused) },
 *  or null without a viewer.
 *  projectView(cam, p) -> { x, y, depth }: window fractions (x right, y down; 0..1 is on the window: one-law.mjs project through the cam's frustum), null
 *  behind the eye; depth along the window's normal (the line of sight for the sight window). The window phase's world pose projects to its own rect through
 *  this: that is the anamorphic law, and the window's drawing when the twin lends no camera. A cam built by hand ({ eye, f, r, u, tanX, tanY }) has its
 *  window one metre down its sight. */
export const NEAR_EYE_M = 1e-6;   // projectView's floor: a point this far before the eye or nearer is not projected (the pinhole's own z > 1e-6); the window phase's card hangs NEAR_M before it
const EYE_DOOR = { D: null, asked: false };   // the door's module once in hand (asked once, at the first window)
/** windowFrustum(plane, eye): the window's frustum, the nexus's through eye-door.mjs when the module is in hand; else one-law.mjs frustum, the FALLBACK
 *  (the same bits: the test), never a law of this file. -> { fr, by } */
function windowFrustum(plane, eye) {
  if (!EYE_DOOR.asked) { EYE_DOOR.asked = true; import('./eye-door.mjs').then((D) => { EYE_DOOR.D = D; }, () => { EYE_DOOR.D = null; }); }   // refused (the Board's one body, no module where this page runs): the fallback stands
  if (EYE_DOOR.D && EYE_DOOR.D.ready()) return { fr: EYE_DOOR.D.frustum(plane, eye, { near: NEAR_EYE_M }), by: 'door' };
  return { fr: lawFrustum(plane, eye, { near: NEAR_EYE_M }), by: 'one-law' };
}
export function viewerCam(viewer, o = {}) {
  const v = viewerOf(viewer); if (!v) return null;
  const tanY = Math.tan(v.fov * DEG / 2), aspect = pos(o && o.aspect) || v.aspect, F = eyeFrame(v), D = v.distance;
  const handed = o && o.glass != null ? lawPlane(o.glass) : v.glass || null;
  const plane = handed || { c: add(v.position, scale(F.f, D)), n: scale(F.f, -1), r: F.r, u: F.u, w: 2 * D * tanY * aspect, h: 2 * D * tanY };
  const W = windowFrustum(plane, v.position);
  return { eye: v.position.slice(), ...F, tanY, tanX: tanY * aspect, aspect, plane, window: handed ? 'glass' : 'sight', frustum: W.fr, by: W.by };
}
export function projectView(cam, p) {
  try {
    const fr = cam && typeof cam === 'object' && 'frustum' in cam ? cam.frustum : handCam(cam); if (!fr || !fin3(p)) return null;
    const q = lawProject(fr, p);
    return q ? { x: q[0], y: q[1], depth: q[2] } : null;
  } catch { return null; }
}
function handCam(cam) {   // a cam built by hand: its window one metre down its line of sight, as tall and wide as its shares say
  if (!cam || typeof cam !== 'object' || !fin3(cam.eye) || !fin3(cam.f) || !fin3(cam.r) || !fin3(cam.u) || !(cam.tanX > 0) || !(cam.tanY > 0)) return null;
  return windowFrustum({ c: add(cam.eye, cam.f), n: scale(cam.f, -1), r: cam.r, u: cam.u, w: 2 * cam.tanX, h: 2 * cam.tanY }, cam.eye).fr;
}

// ---- THE CARD FLIES BY THE MODULE: the module, its slots, the packing ----
const CARD = { S: null, asked: null };   // the module once in hand (one scene a module), and the one ask for it
const PACK = new Float64Array(38);       // a flight's numbers on their way in (embertide-score flight.rs unpack's order)
/** card(): the module the card flies by: the one scene-wasm.mjs loaded, or on the Board its own (its SCENE-LAW block compiles it; its sealed body imports
 *  nothing); null until it stands (asked at the first sample) and wherever WebAssembly is refused, and then there is no flight. */
function card() {
  if (CARD.S) return CARD.S;
  const board = typeof SCENE_LAW !== 'undefined' && SCENE_LAW ? SCENE_LAW.scene : null;
  if (board && board.cardSlots > 0) return (CARD.S = board);
  if (!CARD.asked) useWasm();
  return null;
}
/** useWasm(): the module the card flies by, asked once (scene-wasm.mjs load(); refused in the Board's one body, whose own card() reads) -> true once it
 *  stands. A reader that flies from its first cause (flight-layer.mjs, lyssajudron.mjs's mount) awaits it; a sample before it is null. */
export function useWasm() {
  const board = () => (typeof SCENE_LAW !== 'undefined' && SCENE_LAW && SCENE_LAW.ready ? SCENE_LAW.ready.then(() => !!card(), () => false) : !!card());   // the Board's own, once its block's compile ends
  return (CARD.asked ||= import('./scene-wasm.mjs').then((m) => m.load()).then((s) => { if (s && s.cardSlots > 0) CARD.S = s; return !!card(); }, board));
}
const kept = new WeakMap(), owner = []; let ring = 0, lastF = null, lastS = -1;
/** slotOf(M, F): the module's slot holding F's constants: a frozen flight (flightSeed's) is built once into the ring (1 .. slots - 1), any other in slot 0
 *  at every sample; -1 when it does not read */
function slotOf(M, F) {
  if (F === lastF && owner[lastS] === F) return lastS;   // the flight a glass is sampling: no lookup
  if (!F || typeof F !== 'object') return -1;
  const s = kept.get(F); if (s !== undefined && owner[s] === F) { lastF = F; lastS = s; return s; }
  const frozen = Object.isFrozen(F), slot = frozen ? 1 + (ring++ % (M.cardSlots - 1)) : 0;
  if (!packFlight(F, PACK) || !M.cardBuild(PACK, slot)) return -1;
  if (frozen) { owner[slot] = F; kept.set(F, slot); lastF = F; lastS = slot; }
  return slot;
}
const gridRaw = (g, b) => { try { if (!g || typeof g !== 'object') return 0; b[2] = num(g.start_ms); b[3] = num(g.beat_ms); b[4] = num(g.bar_ms); b[5] = num(g.epoch_ms); b[6] = Number.isInteger(g.beat) ? g.beat : NaN; b[7] = Number.isInteger(g.bar) ? g.bar : NaN; return 1; } catch { return 0; } };
/** packTiming(F, b): flightWindow's numbers (ts, the grid object's fields, whether an origin reads, its position) into b[0..12]. packFlight(F, b): all 38
 *  (this file's readers, then the numbers: embertide-score flight.rs unpack's order); false when the target's pose or the viewer does not read. b is the
 *  module's IN on its way, or any array (embertide-score/tests/gen-vectors.mjs packed the pins with these). */
export function packTiming(F, b) { b[0] = num(F.ts); b[1] = gridRaw(F.grid, b); const o = originOf(F.origin); b[8] = o ? 1 : 0; [b[9], b[10], b[11]] = o ? o.position : [0, 0, 0]; return true; }
export function packFlight(F, b) {
  const to = poseOf(F.to); if (!to) return false;
  const V = viewerOf(F.viewer, to); if (!V) return false;
  const img = F.image && typeof F.image === 'object' ? F.image : null, r = rectOf(F.from) || CENTRE, s = surfaceOf(F.surface);
  packTiming(F, b); b[12] = num(F.seq); [b[13], b[14], b[15]] = to.position; b[16] = to.yaw; [b[17], b[18]] = to.size;
  [b[19], b[20], b[21]] = V.position; b[22] = V.yaw; b[23] = V.pitch; b[24] = V.fov; b[25] = V.aspect; b[26] = V.distance;
  b[27] = img ? num(img.width) : NaN; b[28] = img ? num(img.height) : NaN; b[29] = num(F.aspect); b[30] = r.x; b[31] = r.y; b[32] = r.w; b[33] = r.h; b[34] = s.u; b[35] = s.v; b[36] = s.w; b[37] = s.h;
  return true;
}
/** cardLaw(): the card's law as the module holds it (embertide-score flight.rs): { window_ms, into_ms, room_ms (the phases without a grid), carry_m (the
 *  card's height in the hand), near_m, max_rise_m, rise, hop (an arc's shares of its chord, [least, most]), bend }, or null until the module stands. */
export function cardLaw() {
  const M = card(); if (!M || !(M.cardLaw() >= 11)) return null;
  const O = M.cardOut; return { window_ms: O[0], into_ms: O[1], room_ms: O[2], carry_m: O[3], near_m: O[4], max_rise_m: O[5], rise: [O[6], O[7]], hop: [O[8], O[9]], bend: O[10] };
}

if (typeof window !== 'undefined' && !window.FlightLaw) window.FlightLaw = { SCHEMA, BEATS_PER_BAR, GENESIS_MS, GENESIS_BEAT_MS, NEAR_M, SHARE_REF, FULL, CENTRE, PHASES, NEAR_EYE_M,
  shareSeat, refOf, shareEntry, poseOf, viewerOf, originOf, rectOf, surfaceOf, clockOf, genesisClock, beatOf, downbeatOf, beatMs, gridOf, gridIn, flightSeed, flightWindow, flightAt, cornersOf, viewerCam, projectView, useWasm, cardLaw, packTiming, packFlight };

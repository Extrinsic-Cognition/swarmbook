// her-breath.mjs - THE BREATH (Oct 14 2026 02:4x WEST). His words over her, the twelve opening on their hits while her own body stood sealed: "do you
// understand that every unit in the tree of lyssajudron can be 'breathing state' or closed? or open... like you get the simplest way we could encode
// vibration related to music in the hex's surface there dude?". And Oct 12 21:02: "have we not here effects like hex-surface breathing? like...
// outward-explosion of hexs to show aliveness??? jamiroquai typa shit?".
// THE SIMPLEST ENCODING IS NONE. The vibration is already on the wire: the pulse ear (embertide-radio/pulse) sends twelve bands of six bits 23.4 times a
// second (14 bytes a frame) and the beat grid (the Nest's radio/beat), and every glass already reads them for her twelve (lyssajudron-band.mjs THE EAR).
// So nothing is encoded per hex or per frame. A unit of her tree holds a STATE of two bits, moved only by a cause:
//   closed     its tiles seated;
//   open       its tiles lifted and held;
//   breathing  its tiles follow its band.
// and a tile's lift is one number in the vertex shader, along the tile's own normal. Her tree: unit0 (her body: orb.js's Goldberg skin, 12 pentagons =
// chairs, 20 hexagons = seats), her twelve unit1s on their four wires, the twelve unit2 dots round each (157 units).
// THE STATE IS DERIVED, NOT WRITTEN (stateOf): from causes the Nest already holds, on every glass alike, so every glass opens the same tile at the same
// instant and no ref is added:
//   the song's air (radio/program as the rite's music cause says it): playing -> breathing; paused or none -> closed;
//   THE HOLD (cua/agents/<seat> standing: one of her twelve off its wire, holding a glass) -> that unit1 open;
//   his hand on her (lyssajudron.mjs LOCK: the pointer's ray meets her body) -> unit0 open while it is held. The hand is that glass's own, as the eye's
//   lock and the smoke are: never on the Nest.
// A unit2 has no cause of its own: it is its unit1's. THE WORD (wordOf): the 157 states packed two bits a unit, 40 bytes, for the day a cause of its own
// is written to the Nest (a hand that closes one unit): the layout is below, and no ref is written today.
// THE LIFT (liftOf): closed 0, open 1, breathing the band's level with the hit's attack and fall: max(the hit, the standing level), where the hit is
// the band's onset `ms` after it (envOf: one frame of the ear up, 170 ms down: THE TWELVE PLAY's own envelope, lyssajudron-band.mjs onsetsAt, held equal
// to it by the test) and the standing level is BREATH.sustain of the level raised to BREATH.curve (quiet stays shut). A unit1 spends its band's level on
// its REACH (THE COIL: it stands out from her as far as its band sounds), so its tiles take the hit alone, as they did: the twelve look as they do today
// (the band's file is not changed by this lane). unit0 cannot reach out of herself: her tiles take both.
// A CAUSE MOVES THE STATE AND THE LIFT FOLLOWS OVER THE CAUSE'S OWN EASE, never a step: the song's wakefulness (lyssajudron-ferro.mjs songOn: 900 ms from
// the cause's stamp, a pure function of it), a unit1's way off its wire (lyssajudron.mjs place `k`, one-agents.mjs `out`: pure too), his hand's spring.
// UNIT0'S TILES (liftsOf): pentagon i (chair i, orb.js's order) breathes with band i, the band of the child that plays it (seatOfBand); a hexagon with
// the mean of its three pentagons' lifts (tilesOf: the adjacency built once from the skin's corners, no search a frame). THE EYES' TILES STAY SHUT
// (shutOf; his Oct 12 "the hex seam passes through", the passthrough the eyes draw is of her shell as born): a tile her lens or her floating eyes stand
// over never lifts, nor one a glass within 1 rad of her front sees behind her eyes (measured: no ray of 59,842); a tile they come near lifts by the share
// of the gap; the marks turn with her face when her eye locks on. (From her side, 1.4 rad round, a ray in thirty enters a tile that breathes: the landing.)
// COST: nothing on the wire (0 bytes a frame, no ref). A frame: 12 bands (a power and a max each), 20 means, 32 products, 32 floats to one uniform;
// the shut tiles 32 x 19 angles, only while her face turns. Nothing at rest (lyssajudron.mjs breathe returns before any of it while every lift is 0).
// Pure: no DOM, no clock of its own (her-breath.test.mjs greps this file for the two time globals).
import * as SC from './lyssajudron-score.mjs';
import './her-face.js';   // HER FACE, ONE SOURCE: her floating eyes' line and height (EYE_LINE, EYE_H), read off globalThis.HER_FACE as the body reads them
const HF = globalThis.HER_FACE;

export const CLOSED = 0, OPEN = 1, BREATHING = 2;
export const STATES = Object.freeze(['closed', 'open', 'breathing']);   // the two bits; 3 is not a state and reads as closed
export const CHAIRS = 12;                                 // the unit2s round a unit1 (lyssajudron-council.mjs COUNCIL.chairs; the test holds them equal)
export const UNITS = 1 + SC.SEATS + SC.SEATS * CHAIRS;    // 157: unit0, her twelve, their twelve each
export const WORD_BYTES = Math.ceil((UNITS * 2) / 8);     // 40
export const BREATH = Object.freeze({
  // a tile's lift at 1, in its unit's own radius: unit0's, a unit1's (lyssajudron.mjs SAT_OPEN). unit0's 0.13 (2.7 cm of her 20.6) is what her body can
  // take and still read as breathing: at 1 a pentagon's corner stands at 1.1225 of her radius and a hexagon's at 1.1204, inside the skin of a child
  // gathered in to her as near as the band ever brings one (1.132: a centre at 1.94 of her radius, DANCE.reach.range's floor, its own 0.42); the bound
  // is 0.140. A child's own share of her radius would be 0.168: a corner through that skin. In the proof's pictures 0.74 of it (the invented song's
  // eight-bar one) reads as plates lifting off a body, and 1 (his hand) as her shell open, never as a burst.
  lift: Object.freeze([0.13, 0.4]),
  attack_ms: 40,      // a hit rises in over one frame of the ear (the study's 25 a second: "the newest frame rising in over its 40 ms")
  fall_ms: 170,       // and falls over this (lyssajudron-band.mjs DANCE.ear.onset_ms: the twelve's own fall, held equal by the test)
  sustain: 0.7,       // between hits a tile of unit0 stands at this share of its band's level raised to curve
  curve: 2,           // quiet stays shut, the peaks stand out (measured on a song's study: a band's median level 0.35 to 0.6 -> 0.09 to 0.25 of the lift)
  face: Object.freeze({
    lens: Object.freeze([0, 0.08, 0.98]),   // her lens's direction from her centre (lyssajudron.mjs LENS_AT; lyssajudron-ferro.mjs FERRO.lens)
    lens_r: 0.386,    // its disc and bezel, radians from her centre (0.4 of her radius at 0.983: 22 degrees)
    marks: 9,         // points taken along each eye's line
    view: 0.105,      // radians (6 degrees): a glass sees, behind a point of her floating eyes (0.14 of her radius off her shell), her shell further round than what lies under it: an eye's mark is this much wider, and with it the tile any glass within 1 rad of her front sees behind her eye is shut too
    soft: 0.14,       // radians: a tile the face does not reach lifts by the share of this gap between them (8 degrees)
  }),
  hand: Object.freeze({ reach: 1.2, hz: 2.6, zeta: 0.85 }),   // his hand is on her within this of her centre, in her radius (her shell and its lift); her tiles open under it on this spring
});
const num = (v) => typeof v === 'number' && Number.isFinite(v);
export const clamp01 = (v) => (num(v) ? Math.max(0, Math.min(1, v)) : 0);

// ---- the tree and the word ----
/** unitOf(depth, seat, chair) -> a unit's number in her tree: 0 unit0; 1 + seat her unit1 on that seat; 13 + seat * 12 + chair the unit2 on that chair of it. */
export const unitOf = (depth, seat = 0, chair = 0) => (depth <= 0 ? 0 : depth === 1 ? 1 + seat : 1 + SC.SEATS + seat * CHAIRS + chair);
/** whoOf(unit) -> {depth, seat, chair}: unitOf's inverse. */
export function whoOf(unit) {
  const u = Math.max(0, Math.min(UNITS - 1, Math.round(num(unit) ? unit : 0)));
  if (u === 0) return { depth: 0, seat: 0, chair: 0 };
  if (u <= SC.SEATS) return { depth: 1, seat: u - 1, chair: 0 };
  const k = u - 1 - SC.SEATS; return { depth: 2, seat: Math.floor(k / CHAIRS), chair: k % CHAIRS };
}
const songOf = (cause) => { const s = cause ? cause.song : null; return typeof s === 'string' ? s : s && typeof s === 'object' && typeof s.state === 'string' ? s.state : 'none'; };
const holds = (cause, seat) => { const h = cause ? cause.held : null; return !h ? false : typeof h.has === 'function' ? h.has(seat) : Array.isArray(h) ? h.includes(seat) : false; };
/** stateOf(unit, cause) -> 'closed' | 'open' | 'breathing': a unit's state by the causes the Nest holds. unit: its number (unitOf) or {depth, seat}.
 *  cause: { song: the air's word ({state} or the state: 'playing', 'paused', 'none'), held: the seats of her twelve that hold a glass (an array or a
 *  Set), hand: his hand is on her }. unit0 opens to his hand; a unit1 that holds a glass stands open; a unit2 is its unit1's; else the song's air. */
export function stateOf(unit, cause = null) {
  const u = num(unit) ? whoOf(unit) : unit || {}, depth = u.depth | 0;
  if (depth === 0 ? !!cause?.hand : holds(cause, u.seat | 0)) return STATES[OPEN];
  return songOf(cause) === 'playing' ? STATES[BREATHING] : STATES[CLOSED];
}
/** THE WORD, for the day it is a ref (none is written today: every glass derives it). 157 units, two bits each, low bits first: unit u at byte u >> 2,
 *  bits 2 * (u & 3) and the next. Byte 0: unit0, then her unit1s on seats 0, 1, 2; bytes 1 and 2: seats 3 to 10; byte 3: seat 11, then the unit2s on
 *  chairs 0, 1, 2 of seat 0; and so on to byte 39 (its last six bits 0). 00 closed, 01 open, 10 breathing, 11 unused (read as closed).
 *  wordOf(cause) -> Uint8Array(40); stateIn(word, unit) -> the state's name. */
export function wordOf(cause = null, out = new Uint8Array(WORD_BYTES)) {
  out.fill(0);
  for (let u = 0; u < UNITS; u++) { const s = STATES.indexOf(stateOf(u, cause)); out[u >> 2] |= s << (2 * (u & 3)); }
  return out;
}
export const stateIn = (word, unit) => STATES[(word[unit >> 2] >> (2 * (unit & 3))) & 3] ?? STATES[CLOSED];

// ---- the lift ----
/** envOf(ms, attack_ms): a hit's envelope `ms` after it: rising in over the attack before it (the ear's newest frame), 1 on it, falling over
 *  BREATH.fall_ms after. THE TWELVE PLAY's own (lyssajudron-band.mjs onsetsAt is the highest of its frames' rises under this envelope). */
export const envOf = (ms, attack_ms = BREATH.attack_ms) => (!num(ms) ? 0 : ms < 0 ? Math.max(0, 1 + ms / attack_ms) : Math.exp(-ms / BREATH.fall_ms));
/** holdOf(level): where a tile of unit0 stands between hits: BREATH.sustain of its band's level (0..1) raised to BREATH.curve. */
export const holdOf = (level) => BREATH.sustain * Math.pow(clamp01(level), BREATH.curve);
/** liftOf(state, level, onset, ms) -> a tile's lift, 0..1. closed: 0. open: 1, held. breathing: the band's level with the hit's attack and fall: the
 *  higher of its standing level (holdOf) and its hit (`onset`, 0..1, `ms` after it; ms 0 with the ear's onsets as they stand now, which carry the
 *  envelope already: onsetsAt). A unit1 says level 0 (its band's level is its reach): its lift is the hit alone, as THE TWELVE PLAY opens it. */
export function liftOf(state, level = 0, onset = 0, ms = 0) {
  const s = typeof state === 'string' ? STATES.indexOf(state) : state;
  if (s === OPEN) return 1;
  if (s !== BREATHING) return 0;
  return Math.min(1, Math.max(clamp01(onset) * envOf(ms), holdOf(level)));
}
/** openOver(lift, k): the open state laid over a lift by its cause's own ease k (0: the lift as it is; 1: open, held). */
export const openOver = (lift, k) => { const o = clamp01(k); return o + (1 - o) * clamp01(lift); };

/** seatOfBand(band): the child that plays a band of the song's spectrum (lyssajudron-band.mjs bandOf's inverse; the test holds them one). */
export const seatOfBand = (band) => { const b = (((Math.round(num(band) ? band : 0) % SC.SEATS) + SC.SEATS) % SC.SEATS); return Math.floor(b / 3) + SC.LANES * (b % 3); };
/** bandsOf(out, {on, levels, open, hand}) -> unit0's twelve pentagons, each its band's lift. on: the song's wakefulness (0..1). levels: the ear's
 *  twelve levels now (lyssajudron-band.mjs levelsAt), or null where no spectrum is heard. open: how open each of her twelve stands by THE TWELVE PLAY
 *  (per SEAT, the song's wakefulness already in it: mountBand's open; openAt's plan where there is no band), or null: pentagon i takes the hit its
 *  child takes, the same number at the same instant. hand: his hand's ease on her (0..1): open over all of it. */
export function bandsOf(out, { on = 0, levels = null, open = null, hand = 0 } = {}) {
  const w = clamp01(on);
  for (let b = 0; b < SC.SEATS; b++) {
    const hit = open ? Math.max(0, open[seatOfBand(b)]) : 0, hold = levels && w > 0 ? w * holdOf(levels[b]) : 0;
    out[b] = openOver(Math.max(hit, hold), hand);
  }
  return out;
}

// ---- unit0's tiles ----
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };
const keyOf = (p) => p.map((x) => Math.round(x * 1e5)).join(',');   // orb.js's own: two corners this close are one
/** tilesOf(skin) -> { n: 32, pents: 12, hex, normals, outer }: unit0's tiles as orb.js orders them (the twelve pentagons first, chair i at i). hex: the
 *  three pentagons each hexagon shares an edge with (two tiles that share an edge share two corners), three a hexagon in the skin's order; normals:
 *  each tile's direction from her centre; outer: the angle from it to its corners (the circle round the tile). Built once a body; it throws on a skin
 *  whose hexagons do not each touch three pentagons (only GP(1,1), hers). */
export function tilesOf(skin) {
  const F = skin.faces, n = F.length, pents = F.filter((f) => f.chair >= 0).length, keys = F.map((f) => new Set(f.verts.map(keyOf)));
  const hex = new Uint8Array((n - pents) * 3), normals = new Float64Array(n * 3), outer = new Float64Array(n);
  for (let h = pents; h < n; h++) {
    let k = 0;
    for (let p = 0; p < pents; p++) { let shared = 0; for (const q of keys[p]) if (keys[h].has(q)) shared++; if (shared === 2) { if (k < 3) hex[(h - pents) * 3 + k] = p; k++; } }
    if (k !== 3) throw new Error(`hexagon ${h} touches ${k} pentagons, not three: not her skin`);
  }
  F.forEach((f, i) => { const d = unit(f.normal); let far = 0; normals.set(d, i * 3); for (const v of f.verts) far = Math.max(far, Math.acos(Math.min(1, dot(d, unit(v))))); outer[i] = far; });   // the circle through its corners: nothing of the tile lies outside it
  return Object.freeze({ n, pents, hex, normals, outer });
}
/** marksOf(line, face) -> her face as born, in her body's axes: [x, y, z, r] a mark (a direction from her centre and how far round it the thing
 *  reaches, radians): her lens, then BREATH.face.marks points along each of her floating eyes' lines (her-face.js EYE_LINE: the circle of latitude y at
 *  radius r, from azimuth `from` to `to` either side of +z), each as wide as an open eye is high (EYE_H) and BREATH.face.view more (the passthrough: what a
 *  glass sees behind a floating eye is not what lies under it). */
export function marksOf(line = HF.EYE_LINE, face = BREATH.face) {
  const out = [], L = unit(face.lens), rr = Math.sqrt(line.r * line.r - line.y * line.y), er = HF.EYE_H / line.r + face.view;
  out.push(L[0], L[1], L[2], face.lens_r);
  for (const side of [-1, 1]) for (let i = 0; i < face.marks; i++) { const a = side * (line.from + ((line.to - line.from) * i) / (face.marks - 1)), d = unit([Math.sin(a) * rr, line.y, Math.cos(a) * rr]); out.push(d[0], d[1], d[2], er); }
  return Float64Array.from(out);
}
const smooth01 = (v) => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v));
/** shutOf(tiles, marks, turn, out) -> how shut each tile stays, 0 (free) .. 1 (never lifts): THE EYES' TILES. A tile whose own circle (through its
 *  corners) a mark's edge reaches is shut: no point of the tile lies under her face; from there the tile is freed over BREATH.face.soft of gap. turn: her face's turn in her body's axes, a quaternion [x, y, z, w]
 *  (THE EYE LOCKS ON: her lens and her eyes turn about her centre and their tiles with them), or null: as born. */
export function shutOf(tiles, marks, turn = null, out = new Float32Array(tiles.n)) {
  const N = tiles.normals, soft = BREATH.face.soft, q = turn && (turn[0] || turn[1] || turn[2]) ? turn : null;
  for (let i = 0; i < tiles.n; i++) {
    let gap = Infinity;
    for (let j = 0; j < marks.length; j += 4) {
      let x = marks[j], y = marks[j + 1], z = marks[j + 2];
      if (q) { const cx = q[1] * z - q[2] * y + q[3] * x, cy = q[2] * x - q[0] * z + q[3] * y, cz = q[0] * y - q[1] * x + q[3] * z;   // v + 2 q x (q x v + w v)
        x += 2 * (q[1] * cz - q[2] * cy); y += 2 * (q[2] * cx - q[0] * cz); z += 2 * (q[0] * cy - q[1] * cx); }
      const g = Math.acos(Math.max(-1, Math.min(1, N[i * 3] * x + N[i * 3 + 1] * y + N[i * 3 + 2] * z))) - marks[j + 3]; if (g < gap) gap = g;
    }
    out[i] = 1 - smooth01((gap - tiles.outer[i]) / soft);
  }
  return out;
}
/** liftsOf(tiles, bands, shut, out) -> every tile's lift, in the skin's order: pentagon i its band's (bands[i]) where its face leaves it free; a
 *  hexagon the mean of its three pentagons' lifts, where its face leaves it free. One pass, no search. */
export function liftsOf(tiles, bands, shut, out = new Float32Array(tiles.n)) {
  const P = tiles.pents, H = tiles.hex;
  for (let i = 0; i < P; i++) out[i] = clamp01(bands[i]) * (1 - shut[i]);
  for (let h = P, o = 0; h < tiles.n; h++, o += 3) out[h] = ((out[H[o]] + out[H[o + 1]] + out[H[o + 2]]) / 3) * (1 - shut[h]);
  return out;
}
/** handOn(to, body, eye): his hand is on her: the ray from the eye through the hand's point (all in one frame, metres) passes within BREATH.hand.reach
 *  of her centre, in her radius; with no eye, the point itself is that near. */
export function handOn(to, body, eye = null, radius = SC.K) {
  if (!to || !body) return false;
  const r = BREATH.hand.reach * radius, v = eye ? [body[0] - eye[0], body[1] - eye[1], body[2] - eye[2]] : null;
  if (!v) return Math.hypot(to[0] - body[0], to[1] - body[1], to[2] - body[2]) <= r;
  const d = unit([to[0] - eye[0], to[1] - eye[1], to[2] - eye[2]]), along = dot(v, d);
  return along > 0 && Math.hypot(v[0] - d[0] * along, v[1] - d[1] * along, v[2] - d[2] * along) <= r;
}

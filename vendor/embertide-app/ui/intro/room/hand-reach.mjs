// lib/hand-reach.mjs · HIS HAND REACHES HER (lane hand-reach, Oct 14 2026 WEST). The reader half of his hand's road.
// His word, Oct 13 2026 03:4x: "the hand motioncapped by iOS is PERFECT BEST IN THE WORLD DONT TRY TO TOUCH IT. but the point is, i need to be able to
// sync that to the nest state"; and tonight (Oct 14 03:1x): whether the AR hand and the Nest will ever interact in real time. The phone's half is built
// (embertide-ios HandWind.swift posts wind.hand at capture; nest.mjs holds and pushes it); this file is what a GLASS does with the packet. Pure: numbers
// in, numbers out, no clock inside, no I/O; a glass hands it `now_ms` (the house clock as it keeps it).
//
// THE PACKET (embertide-ios HandWindMath.swift, nest.mjs checkWindHand): j = 21 x 3 integer millimetres in the phone's own cv camera frame (x right, y down,
// z forward; Vision's order, HAND_JOINTS; three nulls for a joint not seen), tick = the capture on the house clock (ms), side, pose = [r11..r33 x 1e6 row-major,
// tx, ty, tz mm]: the phone's camera -> the Station, present once the phone's world is joined to the Station by a screen's code, absent until then.
// THE PLACEMENT is the one a reader already uses for a phone eye's body (nest.mjs HIS HAND: "a reader places the hand in the room as it places a phone eye's
// body: R * j + t", hand-watch.mjs place): with a pose the joints stand in the Station in metres; without one they stand in the phone's own frame and are
// drawn in NO scene (a glass has no place for them) and pull nothing.
// THE CAUSE: his hand is a magnet held near her, as the song's magnet is (lyssajudron-ferro.mjs poleAt, fieldAt, pullAt): a direction from her centre to his
// palm in her own axes (the pole), a field 0..1 that fades with the palm's distance from her surface (full within REACH.near_m, none past REACH.far_m) and
// with the packet's age (full within REACH.fresh_ms, none past REACH.window_ms: nothing at rest, no packet in the window is no cause), and a pull 0..1 (the
// flux's swoosh, pullAt's units) from the palm's speed between two packets (full at REACH.speed_mps). The liquid takes it as a second magnet (mountFerro
// frame(c, on, hand); the Board's FERRO-CORE feFrame the same), the twelve as a second flux (fluxOfHand). The same text in ES5 is NestBoard.html HAND-CORE,
// held to this file by tests/hand-reach.test.mjs.
// COST: a packet: 21 x (9 multiplies) to place it and a few dozen operations for the cause; a frame with no hand in the window: one subtraction a held hand.
export const HAND_JOINTS = ['wrist', 'thumbCMC', 'thumbMP', 'thumbIP', 'thumbTip', 'indexMCP', 'indexPIP', 'indexDIP', 'indexTip', 'middleMCP', 'middlePIP', 'middleDIP', 'middleTip', 'ringMCP', 'ringPIP', 'ringDIP', 'ringTip', 'littleMCP', 'littlePIP', 'littleDIP', 'littleTip'];   // nest.mjs HAND_JOINTS (the test holds them equal)
export const HAND_TIPS = Object.freeze([4, 8, 12, 16, 20]);        // the five fingertips
export const HAND_PALM = Object.freeze([0, 5, 9, 13, 17]);         // the wrist and the four finger roots: the palm's centre is their mean
export const HAND_BONES = Object.freeze([[0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8], [0, 9], [9, 10], [10, 11], [11, 12], [0, 13], [13, 14], [14, 15], [15, 16], [0, 17], [17, 18], [18, 19], [19, 20], [5, 9], [9, 13], [13, 17]]);   // 23 bones: each finger from the wrist, and the palm's span across the roots
export const REACH = Object.freeze({
  near_m: 0.2,       // the palm this close to her surface: the full field
  far_m: 1.2,        // this far: none (a hand across the room is no cause)
  fresh_ms: 120,     // a packet this young: the full field (the phone posts 30 a second; a fresh hand is tens of ms old at a glass)
  window_ms: 1000,   // this old: no cause at all (nest.mjs holds a hand two seconds; a glass lets it go sooner: nothing at rest)
  speed_mps: 0.8,    // the palm moving this fast between two packets: the full pull (the flux's swoosh at its strongest)
  gap_ms: 250,       // two packets further apart than this carry no speed (a hand that left and came back is not a motion)
});
const num = (v) => typeof v === 'number' && Number.isFinite(v);
const smooth01 = (v) => (v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v));
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const len = (a) => Math.hypot(a[0], a[1], a[2]);
const unit = (a) => { const l = len(a); return l > 1e-9 ? [a[0] / l, a[1] / l, a[2] / l] : null; };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];

/** qrot(q, v): v turned by the unit quaternion q = [x, y, z, w] (NestBoard.html FE_VS qrot, word for word). */
export function qrot(q, v) { const c1 = cross([q[0], q[1], q[2]], v), a = [c1[0] + q[3] * v[0], c1[1] + q[3] * v[1], c1[2] + q[3] * v[2]], c2 = cross([q[0], q[1], q[2]], a); return [v[0] + 2 * c2[0], v[1] + 2 * c2[1], v[2] + 2 * c2[2]]; }
/** inHerAxes(v, frame): a vector of the scene's axes in her own: frame is her turn as a unit quaternion [x, y, z, w] (the Board's unit0 instance), a yaw in radians
 *  about y (her holder's), or null (her axes are the scene's). */
export function inHerAxes(v, frame = null) {
  if (Array.isArray(frame) && frame.length === 4) return qrot([-frame[0], -frame[1], -frame[2], frame[3]], v);
  if (num(frame)) { const c = Math.cos(frame), s = Math.sin(frame); return [v[0] * c - v[2] * s, v[1], v[0] * s + v[2] * c]; }   // the inverse of a yaw about y: forward = [sin yaw, 0, cos yaw]
  return [v[0], v[1], v[2]];
}
/** poseOf(payload): the packet's camera -> Station pose as numbers ({ R: 9 row-major, t: metres }), or null when the phone is not joined yet. */
export function poseOf(p) {
  const q = p && p.pose; if (!Array.isArray(q) || q.length !== 12 || !q.every(num)) return null;
  return { R: q.slice(0, 9).map((v) => v / 1e6), t: [q[9] / 1000, q[10] / 1000, q[11] / 1000] };
}
/** placeHand(payload): the packet's 21 joints in metres: in the Station (frame 'station': R * j + t, as hand-watch.mjs places the wrist and a reader a phone
 *  eye's body) when the packet carries a pose, else in the phone's own cv camera frame (frame 'eye': no place in any scene). -> { frame, space, seat, side,
 *  tick, joints: 21 x ([x, y, z] | null), seen, wrist, palm (the mean of the wrist and the four roots seen, else the wrist), tips (5 x ([x, y, z] | null)) }
 *  or null for a packet no reader could place (no j, no tick, under six joints). */
export function placeHand(p) {
  if (!p || typeof p !== 'object' || !Array.isArray(p.j) || p.j.length !== HAND_JOINTS.length * 3 || !num(p.tick)) return null;
  const pose = poseOf(p), joints = new Array(HAND_JOINTS.length); let seen = 0;
  for (let i = 0; i < HAND_JOINTS.length; i++) {
    const x = p.j[3 * i], y = p.j[3 * i + 1], z = p.j[3 * i + 2];
    if (!num(x) || !num(y) || !num(z)) { joints[i] = null; continue; }
    const mx = x / 1000, my = y / 1000, mz = z / 1000; seen++;
    joints[i] = pose ? [pose.R[0] * mx + pose.R[1] * my + pose.R[2] * mz + pose.t[0], pose.R[3] * mx + pose.R[4] * my + pose.R[5] * mz + pose.t[1], pose.R[6] * mx + pose.R[7] * my + pose.R[8] * mz + pose.t[2]] : [mx, my, mz];
  }
  if (seen < 6) return null;
  const palm = [0, 0, 0]; let n = 0; for (const i of HAND_PALM) { const j = joints[i]; if (!j) continue; palm[0] += j[0]; palm[1] += j[1]; palm[2] += j[2]; n++; }
  const wrist = joints[0];
  return { frame: pose ? 'station' : 'eye', space: typeof p.space === 'string' ? p.space : null, seat: typeof p.frame === 'string' && p.frame.startsWith('eye:') ? p.frame.slice(4) : null, side: p.side === 'left' ? 'left' : 'right', tick: p.tick,
    joints, seen, wrist, palm: n ? [palm[0] / n, palm[1] / n, palm[2] / n] : wrist, tips: HAND_TIPS.map((i) => joints[i]) };
}
/** speedOf(hand, prev): the palm's speed between two placed hands of one seat and side, metres a second; 0 without a usable pair (none, another frame,
 *  the same or an older tick, or two packets further apart than REACH.gap_ms). */
export function speedOf(hand, prev) {
  if (!hand || !prev || !hand.palm || !prev.palm || hand.frame !== prev.frame || !(hand.tick > prev.tick) || hand.tick - prev.tick > REACH.gap_ms) return 0;
  return len(sub(hand.palm, prev.palm)) / ((hand.tick - prev.tick) / 1000);
}
/** handCause({ hand, prev, her: { c, r, frame }, now_ms }): his hand as one cause for her liquid, or null when it is none (no hand placed in the Station, no
 *  palm, her centre unknown, past REACH.window_ms, past REACH.far_m, or a palm at her centre). hand, prev: placeHand's (prev: the packet before, for the
 *  speed); her: her centre c (metres, the scene's axes), her radius r (metres) and her frame (inHerAxes: a quaternion, a yaw, or null). -> { pole: a unit
 *  direction from her centre to his palm in HER axes (poleAt's units), field: 0..1 (fieldAt's: the magnet's pull), pull: 0..1 (pullAt's: the flux's
 *  swoosh), on: the field (songOn's units: how awake the hand keeps the liquid), d_m: the palm from her surface, age_ms, speed_mps, side, seat }. */
export function handCause({ hand, prev = null, her, now_ms } = {}) {
  if (!hand || hand.frame !== 'station' || !hand.palm || !her || !Array.isArray(her.c) || her.c.length !== 3 || !her.c.every(num) || !num(now_ms)) return null;
  const age = Math.max(0, now_ms - hand.tick); if (age >= REACH.window_ms) return null;
  const v = sub(hand.palm, her.c), dist = len(v), r = num(her.r) && her.r > 0 ? her.r : 0, d = Math.max(0, dist - r); if (d >= REACH.far_m) return null;
  const pole = unit(inHerAxes(v, her.frame ?? null)); if (!pole) return null;
  const reach = 1 - smooth01((d - REACH.near_m) / (REACH.far_m - REACH.near_m)), fresh = 1 - smooth01((age - REACH.fresh_ms) / (REACH.window_ms - REACH.fresh_ms)), field = reach * fresh;
  if (!(field > 0.002)) return null;
  const speed = speedOf(hand, prev), pull = field * Math.min(1, speed / REACH.speed_mps);
  return { pole, field, pull, on: field, d_m: d, age_ms: age, speed_mps: speed, side: hand.side, seat: hand.seat };
}
/** strongest(causes): of several hands' causes (two phones, two sides) the one with the greatest field; null when there is none. One magnet at a time: the
 *  liquid takes one pole (two hands would want two; the nearer, fresher one leads). */
export function strongest(causes) { let best = null; for (const c of causes || []) if (c && (!best || c.field > best.field)) best = c; return best; }
/** toGlass(plane, p): a Station point in a placed glass's own axes (well-law.mjs local: right, up, normal from the glass's centre), the frame the well draws
 *  in; plane: one-law.mjs planeOf's { c, r, u, n }. */
export function toGlass(pl, p) { const e = sub(p, pl.c); return [pl.r[0] * e[0] + pl.r[1] * e[1] + pl.r[2] * e[2], pl.u[0] * e[0] + pl.u[1] * e[1] + pl.u[2] * e[2], pl.n[0] * e[0] + pl.n[1] * e[1] + pl.n[2] * e[2]]; }
/** heldHands(held, now_ms, window_ms): the hands a glass still holds (a Map or object seat\nside -> { hand, prev, at }), the ones older than the window
 *  dropped in place; -> how many stand. The glass calls it once a frame while it holds any: nothing at rest costs anything beyond one subtraction a hand. */
export function heldHands(held, now_ms, window_ms = REACH.window_ms) {
  let n = 0; const isMap = held instanceof Map;
  for (const [k, v] of isMap ? held : Object.entries(held)) { if (!v || !v.hand || now_ms - v.hand.tick >= window_ms) { if (isMap) held.delete(k); else delete held[k]; continue; } n++; }
  return n;
}

// one-law.mjs · THE ONE THING ON EVERY GLASS (Oct 11 2026 21:4x WEST).
// His words that night: "the floating overlays on both macs are old versions of the exact model that is the lyssajudron on lysa... stick to that. there is only
// 1 anamorphic moving thing and it needs to get out of lysa into all the glasses synced"; Oct 4 02:04: "a 2D overlay on my macbook and that macbook is in the
// nestOS... anamorphic animations where the 2D thing looks like is coming towards me because it starts occupying the entire screen and then becomes small like
// wile e coyote and cartoons and he appears into the other screens"; Sept 20: "IN THE ENTIRE NEST THE LYSSAJUDRON OBJECT IS 1"; Oct 10 22:50: every polarized
// interface computes its own view on its own, the glasses agree on the rhythm only.
//
// ONE OBJECT, ONE PATH, ONE EYE; EVERY GLASS ITS OWN VIEW. The Lyssajudron is one body at one point p(t) of the room (the Station frame, metres, y up). A
// placed glass is a plane. What stands BEHIND its plane the glass shows as a window; what stands IN FRONT of it, in the room, the glass shows as a mirror: the
// point folded across the plane (`fold`). Both are seen from the one eye through the glass's own rectangle (`frustum`, the off-axis projection of
// lib/portal-cut.mjs's windowCam and the filter law's window or mirror frustum). The fold is continuous at the plane, so nothing is switched: a body that
// comes out of a glass grows until it fills it (at the plane its picture is life size), then shrinks in that glass as it goes into the room, and at the same
// instant it stands in every other glass as a reflection. That is his sentence of Oct 4, made by geometry alone. No glass asks another what it draws.
//
// THE EYE is his head: the path is laid from where it was at his word (the program's `eye`), and a glass that can hear the Nest's live body (the wind's fused
// body, frame station) draws from where his head is NOW (`follow`, the default): he moves and every glass's picture turns with him, each by its own plane.
// THE PATH is a program on the Nest (PROGRAM_REF): the eye, the glasses' poses it was laid on, a beat grid frozen in it, a first downbeat and a list of
// points, one leg per bar (a `bars` on a point holds it or stretches its leg). p(t) is a pure function of the program and the house time: every glass, whenever
// it samples, holds the same point (foundation 2: only the program crosses, never a picture or a pose).
// WHO TRAVELS (Oct 13 2026 04:2x WEST). His words that night, over a tour that took her whole body out of lysa's well and drew another creature on the
// other glasses: 04:07 "you are anamorphizing the wrong shit around the screens. IT MUST BE THE ONE THAT IS IN LYSA"; 04:10 "the anamorphic shits are not
// the lysa one... it needs to be a fucking singleton"; 04:20 "in the anamorphic trajectories i want to see lyssajudron held inside of lysa, i want the
// unit1s to be able to become spatial trycua agents"; before them Oct 12 12:0x "the unit0 will stay locked at home where lysa is... the unit1s are gonna be
// the floating trycua agents". So a program says WHO travels its path: `who: { unit1: <chair> }` is one of her twelve (travellerOf): she stays at rest
// inside her home glass for the whole program and that chair leaves its wire, fills the mouth of her glass, crosses the room and stands in the other
// glasses, a ball UNIT1_M across. A program with no `who` is her whole body, as every path was laid until that night. The path, the fold, the eye and the
// clock are one law for both: only the size of what travels differs (viewOf, tourOf's depth inside a glass).
// Pure: no I/O, no clock, no DOM. Total: bad input gives null, never a throw.

import { cameraFrameOf } from './camera-geometry.mjs';

export const SCHEMA = 'embertide.golem-path/1';
export const PROGRAM_REF = 'scene/entities/golem-lyssajudron-path';   // the one thing's path; the golem itself (its home, its anchor) stays scene/entities/golem-lyssajudron
export const GENESIS_MS = 1772673332000, GENESIS_BEAT_MS = 600, BEATS_PER_BAR = 4;   // the no-station grid every glass agrees on (beat-clock.mjs). THE FIRE (Nov 16 2026): the module's law.genesis_ms, beat_ms and beats_per_bar (law_text.rs); this pure file loads no module for 130 importers, so the text stands as the door's witness and fallback, held equal by one-law-genesis.test.mjs
export const BODY_M = 0.84;          // the figure across its lanes (lyssajudron-score.mjs: lane radii 0.40 to 0.42 m)
export const UNIT1_M = Math.round(2 * 0.206 * 0.42 * 1e3) / 1e3;        // one of her twelve across: twice lyssajudron-score.mjs R_SAT (K 0.206 x CHILD_SCALE 0.42; one-law.test.mjs holds the two equal). The height of lysa's own panel: at the mouth of her glass a unit1 fills it
export const ROOM_EYE_STANDOFF_M = 2.5;   // ANY ROOM (Oct 26 2026): with no head and no word, the eye stands this far before the glasses, on their axes (portal-cut.mjs STANDOFF_M, filter-law's DEFAULT_STANDOFF_M)
/** roomEye(glasses, order): ANY ROOM: the eye a tour is laid from when no head stands and no eye is said: the mean of the points ROOM_EYE_STANDOFF_M before each glass
 *  on its axis (c + n * standoff), over the glasses named in `order` that have a pose, else over every glass that has one. glasses: { seat: { c, n, ... } } as
 *  the-one.mjs glassesOf hands them; -> [x, y, z] or null when no glass stands (then there is nothing to lay a tour through). Never a constant of one room. */
export function roomEye(glasses, order = null) {
  const G = glasses && typeof glasses === 'object' ? glasses : {}, ok = (g) => g && Array.isArray(g.c) && g.c.length === 3 && Array.isArray(g.n) && g.n.length === 3 && g.c.every(Number.isFinite) && g.n.every(Number.isFinite);
  const named = Array.isArray(order) ? order.map((s) => G[s]).filter(ok) : [], use = named.length ? named : Object.values(G).filter(ok);
  if (!use.length) return null;
  const e = [0, 0, 0]; for (const g of use) for (let i = 0; i < 3; i++) e[i] += g.c[i] + g.n[i] * ROOM_EYE_STANDOFF_M;
  return e.map((v) => Math.round(v / use.length * 1000) / 1000);
}
export const CARRIER = 3, CHAIRS = 12;   // the chair that travels when none is said (lyssajudron.mjs CARRIER: the satellite that flies a picture out, never an eye's seat); her twelve
export const FIT = 0.8;              // inside a glass it stands as deep as it takes to fit this share of the glass's smaller side, seen from the eye
export const OUT_M = 0.9;            // out of a glass: this far from its plane, toward the eye
export const MIN_IN_M = 0.6, MAX_IN_M = 1.5;  // the depth inside a glass, kept between these. The most is small on purpose: seen through a small glass a far body slides out of the picture with a hand's width of his head (0.2 m of head moves a body 11 m deep by 0.16 m on the glass, half a laptop's screen); 1.5 m deep it moves 7 cm. A small glass therefore holds it close and larger than itself: a porthole on its body
export const MIN_EYE_M = 0.05;       // an eye this close to a glass's plane (or behind it) sees nothing through it (portal-cut MIN_EYE_M)
export const NEAR_M = 0.05, FAR_M = 60;

const fin = (v) => typeof v === 'number' && Number.isFinite(v);
const fin3 = (p) => Array.isArray(p) && p.length === 3 && p.every(fin);
export const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
export const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];
export const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
export const len = (a) => Math.hypot(a[0], a[1], a[2]);
export const unit = (a) => { const n = len(a); return n > 1e-12 ? [a[0] / n, a[1] / n, a[2] / n] : null; };
export const mix = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
export const smooth = (u) => { u = u < 0 ? 0 : u > 1 ? 1 : u; return u * u * (3 - 2 * u); };
/** travellerOf(program): WHO TRAVELS the path: { unit1: the chair of her twelve that left its wire, body: its size across (UNIT1_M) }, or null: her
 *  whole body travels (a program with no `who`, or a `who` that names no chair of hers). */
export const travellerOf = (pr) => { const n = pr && typeof pr === 'object' && pr.who && typeof pr.who === 'object' ? pr.who.unit1 : null; return Number.isInteger(n) && n >= 0 && n < CHAIRS ? { unit1: n, body: UNIT1_M } : null; };
const round = (v, k = 1e4) => Math.round(v * k) / k;
const r3 = (p) => p.map((v) => round(v));

/** planeOf(glass): a placed glass as a plane, or null. Takes the Nest's screen entity ({transform: {position, yaw}, representation: {size_m: [w, h]}}), the
 *  compact pose a program keeps ({c, yaw, size: [w, h]}) or a pose with its own vectors ({c|centre, n|normal, r|right, u|up, w|width, h|height}: the rite's
 *  measured mirrors). A yaw is the way the glass's face looks, into the room: n = [sin yaw, 0, cos yaw] (the rite's convention, flight-law's glass pose); its
 *  right, seen from the side it faces, is up x n = [cos yaw, 0, -sin yaw]. A glass whose size nobody said has none: it is not drawn through. */
export function planeOf(g, size = null) {
  if (!g || typeof g !== 'object') return null;
  const c = fin3(g.c) ? g.c : fin3(g.centre) ? g.centre : fin3(g.transform?.position) ? g.transform.position : fin3(g.position) ? g.position : null; if (!c) return null;
  const s = Array.isArray(g.size_m) ? g.size_m : Array.isArray(g.size) ? g.size : Array.isArray(g.representation?.size_m) ? g.representation.size_m : fin(g.w ?? g.width) && fin(g.h ?? g.height) ? [g.w ?? g.width, g.h ?? g.height] : size;
  if (!Array.isArray(s) || !fin(s[0]) || !fin(s[1]) || !(s[0] > 0) || !(s[1] > 0)) return null;
  const rawN = g.n ?? g.normal, rawU = g.u ?? g.up, rawR = g.r ?? g.right;
  let n = fin3(rawN) ? unit(rawN) : null, u = fin3(rawU) ? unit(rawU) : null, r = fin3(rawR) ? unit(rawR) : null;
  if ((rawN != null && !n) || (rawU != null && !u) || (rawR != null && !r)) return null;
  if (!n) {   // THE FRAME AS ONE QUATERNION (Oct 13 2026, tools/embertide-mesh/lib/glass-frame.mjs): the entity's transform.rotation, a unit [x, y, z, w] whose turn's columns are its right, up and normal, before the yaw it keeps for old readers
    const q = g.transform?.rotation ?? g.rotation, k = Array.isArray(q) && q.length === 4 && q.every(fin) ? Math.hypot(q[0], q[1], q[2], q[3]) : 0;
    if (q != null && !(k > 0.99 && k < 1.01)) return null;
    if (k > 0.99 && k < 1.01) { const [x, y, z, w] = q.map((v) => v / k); r = [1 - 2 * (y * y + z * z), 2 * (x * y + z * w), 2 * (x * z - y * w)]; u = [2 * (x * y - z * w), 1 - 2 * (x * x + z * z), 2 * (y * z + x * w)]; n = [2 * (x * z + y * w), 2 * (y * z - x * w), 1 - 2 * (x * x + y * y)]; }
  }
  if (!n) { const yaw = fin(g.yaw) ? g.yaw : fin(g.transform?.yaw) ? g.transform.yaw : null; if (!fin(yaw)) return null; n = [Math.sin(yaw), 0, Math.cos(yaw)]; }
  const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  if (!r) r = unit(cross(u || [0, 1, 0], n));
  if (!r) return null;
  if (!u) u = unit(cross(n, r));
  // A rectangular physical display needs one proper basis. Do not turn
  // contradictory measured axes into a plausible yaw-only drawing.
  if (!u || Math.abs(dot(n, r)) > 1e-4 || Math.abs(dot(n, u)) > 1e-4 || Math.abs(dot(r, u)) > 1e-4 || dot(cross(r, u), n) < 1 - 1e-4) return null;
  return { c: [...c], n, r, u, w: s[0], h: s[1] };
}
/** poseOf(plane): the compact pose a program keeps ({c, n, r, u, size}); planeOf reads it back whole. */
export const poseOf = (pl) => (pl ? { c: r3(pl.c), n: pl.n.map((v) => round(v, 1e6)), r: pl.r.map((v) => round(v, 1e6)), u: pl.u.map((v) => round(v, 1e6)), size: [round(pl.w), round(pl.h)] } : null);

// ---- THE GLASS LAW (Oct 12 2026 00:0x WEST, his "do you understand the overlay on my mac should be aligned to the lyssajudron?"; Oct 11: "why the fuck this
// mac is not slave to her majesty lysa"). A picture is aligned to her only when the glass it is drawn through stands in the Station where the screen stands
// in his room. That night the Nest held this Mac's glass on lysa's wall, where his hand had dragged it in the twin, 3.7 m and 87 degrees from the Mac.
// A MAC'S GLASS STANDS WHERE ITS CAMERA STANDS: the lens is built into the lid at the top centre of the picture and looks out of it, so one rigid offset
// takes a placed lens to the screen's plane: the glass faces the way the lens looks, its up is the lens's own (the lid's tilt rides in it), and its centre
// hangs half its height under the lens. A MEASURED POSE BEATS ONE PLACED BY HAND OR MARKED PROVISIONAL: a screen dragged onto a wall of the twin is a mark
// ("dashed on every glass until a scan scores it", the entity's own note); a measured lens is a measurement of that same lid. A screen whose own placement
// is measured keeps it. This ranks each placement by its own word; it is not the joint solve of foundation 1, so the lens's sigma rides with the glass
// for the solver that comes. The lens says where a screen is, never how large: the size is the screen's own.
export const LENS_AT = Object.freeze([0, 0.5, 0]);   // where a built-in lens sits in its glass, from the glass's centre: right and up in shares of its width and height, then metres out of its plane. The top centre, in the plane (a notch's lens sits a few mm under the picture's top edge, an older lid's a few mm over it: far inside any marker's sigma)
export const MEASURED = /^\s*(measured|scored)\b/i;   // a placement that was measured says so first: the eye marker's 'measured: the picture road, ...', a screen a scan 'scored'
const wordOf = (e) => (typeof e?.registration === 'string' ? e.registration : typeof e?.source?.registration === 'string' ? e.source.registration : typeof e?.placement === 'string' ? e.placement : null);
/** lensOf(eye): the lens of an eye's marker (the Nest's scene/entities/eye-<seat>, kind 'eye'; tools/embertide-mesh/lib/eye-marker.mjs), or null. The
 *  marker's `transform` is NOT the lens: it is the frame the eye's bodies are composed through, and on the picture road its origin lies on the floor under
 *  the lens. The lens is `measurement.camera`: its centre (C, Station metres), the way it looks (yaw as a glass's yaw, pitch up positive; or its `forward`)
 *  and its full world-to-camera R when supplied (including roll). -> { c, n (the way it looks), u (its up), r (the right of someone facing it: u x n, a glass's own right), yaw, pitch, measured, word (its
 *  registration), sigma: { position_m, yaw_rad, pitch_rad } as the marker says them, or null }. */
export function lensOf(eye) {
  const cam = eye && typeof eye === 'object' && eye.measurement && typeof eye.measurement === 'object' ? eye.measurement.camera : null; if (!cam || typeof cam !== 'object') return null;
  const frame = cameraFrameOf(cam); if (!frame) return null;
  const n = frame.forward, yaw = Math.atan2(n[0], n[2]), pitch = Math.asin(Math.max(-1, Math.min(1, n[1])));
  const word = wordOf(eye), s = eye.sigma && typeof eye.sigma === 'object' ? eye.sigma : null, rad = (r, d) => (fin(r) ? r : fin(d) ? d * Math.PI / 180 : null);
  // OpenCV camera-right points opposite the right of a viewer facing the lid.
  // Preserve all three measured axes; yaw/pitch are descriptive compatibility fields only.
  return { c: frame.c, n, u: frame.up, r: frame.right.map((v) => -v), yaw, pitch, measured: !!word && MEASURED.test(word), word,
    sigma: s ? { position_m: fin3(s.position_m) ? [...s.position_m] : null, yaw_rad: rad(s.yaw_rad, s.yaw_deg), pitch_rad: rad(s.pitch_rad, s.pitch_deg) } : null };
}
/** glassOfLens(lens, size, at): the plane of the screen a lens is built into (as planeOf gives one): it faces the way the lens looks and the lens sits
 *  `at` in it (LENS_AT: its top centre). null without a size. */
export function glassOfLens(lens, size, at = LENS_AT) {
  if (!lens || !fin3(lens.c) || !fin3(lens.n) || !fin3(lens.u) || !fin3(lens.r) || !Array.isArray(size) || !fin(size[0]) || !fin(size[1]) || !(size[0] > 0) || !(size[1] > 0)) return null;
  const k = (i) => (Array.isArray(at) && fin(at[i]) ? at[i] : 0);
  return { c: add(add(add(lens.c, lens.r, -k(0) * size[0]), lens.u, -k(1) * size[1]), lens.n, -k(2)), n: [...lens.n], r: [...lens.r], u: [...lens.u], w: size[0], h: size[1] };
}
/** glassOf(screen, eye, {size, at}): THE GLASS LAW. screen: the glass as its own placement gives it (the Nest's screen entity, a compact pose, or null);
 *  eye: the marker of the lens built into that screen (or null); size: the glass's size when the screen says none. -> { plane, from: 'lens' | 'placed',
 *  word (the winning placement's own registration), placed (the plane the screen's placement gives, or null) and placed_word (its registration), lens
 *  (lensOf, or null), built (the plane the lens gives, or null), gap_m and gap_rad (how far apart the two stand and face, when both stand), sigma (the
 *  lens's, when the lens won) }, or null when neither gives a plane. The lens wins when it is measured and the screen's own placement is not, and when
 *  it is the only one. */
export function glassOf(screen, eye = null, { size = null, at = LENS_AT } = {}) {
  const placed = planeOf(screen, size), lens = lensOf(eye), built = glassOfLens(lens, placed ? [placed.w, placed.h] : size, at), word = wordOf(screen); if (!placed && !built) return null;
  const byLens = !!built && (!placed || (lens.measured && !(word && MEASURED.test(word))));
  return { plane: byLens ? built : placed, from: byLens ? 'lens' : 'placed', word: byLens ? lens.word : word, placed, placed_word: word, lens, built,
    gap_m: placed && built ? len(sub(placed.c, built.c)) : null, gap_rad: placed && built ? Math.acos(Math.max(-1, Math.min(1, dot(placed.n, built.n)))) : null, sigma: byLens ? lens.sigma : null };
}

// ---- A MOVING GLASS (Oct 12 2026 01:2x WEST, his "i need to see the lyssajudron in AR synced like as if it was a 4d song: 8D SPATIAL AUDIO"; behind it his
// Oct 3 "the phones must be seeing polarized AR... they are just a VR window"). A phone over its passthrough is a glass whose plane is its own screen,
// carried by the phone: its eye is the lens, its plane stands LOOK_D_M before the lens and faces it, as wide and tall as the lens sees at that depth (the
// camera's vertical field and the picture's shape). frustum and project through that plane ARE the camera's own, and fold never folds (nothing stands
// between a lens and 10 cm), so wherever she stands in front of the lens she is a window: the room itself, seen through the phone. The look is what the app
// pushes as window.__domeLook (embertide-ios StationJoin.swift, the Android app's Look.kt): yaw, pitch and roll in degrees, `at` the lens in Station
// metres, and fov_deg when the app says its camera's vertical field; the basis is portal-cut.mjs phoneCam's, so she and his body on one glass stand in one
// camera. The sound's source is this same point (the module's path; the radio carries its own ES5 copy for the sound, radio/spatial.mjs, held to the module): what he sees is where he hears her.
export const LOOK_FOV_DEG = 70, LOOK_D_M = 0.1;   // the vertical field a phone's camera is given with no word (portal-cut FOV_DEG); where the moving glass's plane stands before the lens (over MIN_EYE_M)
/** glassOfLook(look, aspect, {fov_deg, d}): the moving glass of a phone's look -> { plane (as planeOf gives one), eye (the lens), forward, fov_deg, aspect },
 *  or null without a place. aspect: the picture's width over its height. The look's own fov_deg (the app's word) beats the option, which beats LOOK_FOV_DEG. */
export function glassOfLook(look, aspect = 9 / 16, { fov_deg = null, d = LOOK_D_M } = {}) {
  if (!look || typeof look !== 'object' || !fin3(look.at)) return null;
  const D = Math.PI / 180, yaw = (fin(look.yaw_deg) ? look.yaw_deg : 0) * D, pitch = Math.max(-89.9, Math.min(89.9, fin(look.pitch_deg) ? look.pitch_deg : 0)) * D, roll = (fin(look.roll_deg) ? look.roll_deg : 0) * D;
  const f = [Math.sin(yaw) * Math.cos(pitch), Math.sin(pitch), -Math.cos(yaw) * Math.cos(pitch)], r0 = [Math.cos(yaw), 0, Math.sin(yaw)];
  const u0 = [r0[1] * f[2] - r0[2] * f[1], r0[2] * f[0] - r0[0] * f[2], r0[0] * f[1] - r0[1] * f[0]], cr = Math.cos(roll), sr = Math.sin(roll);   // right0 x forward; roll > 0 = the screen's top goes right (Look.kt)
  const u = [u0[0] * cr + r0[0] * sr, u0[1] * cr + r0[1] * sr, u0[2] * cr + r0[2] * sr], r = [r0[0] * cr - u0[0] * sr, r0[1] * cr - u0[1] * sr, r0[2] * cr - u0[2] * sr];
  const field = (v) => fin(v) && v > 1 && v < 179, fov = field(look.fov_deg) ? look.fov_deg : field(fov_deg) ? fov_deg : LOOK_FOV_DEG, a = fin(aspect) && aspect > 0 ? aspect : 9 / 16, dd = fin(d) && d > MIN_EYE_M ? d : LOOK_D_M;
  const h = 2 * dd * Math.tan(fov * D / 2);
  return { plane: { c: add(look.at, f, dd), n: [-f[0], -f[1], -f[2]], r, u, w: h * a, h }, eye: [...look.at], forward: f, fov_deg: fov, aspect: a };
}
/** glassHolding(program, p, {margin}): the seat of the placed glass of the program that holds p: behind its plane or on it (that glass shows her: a window,
 *  or at its plane the fold) AND her centre within its rectangle (plus a margin, 0 by default). A plane runs along the whole wall and across the room; the
 *  glass is only where the glass is: leaving lysa she passes 1.0 m beside tv1's centre, 7 to 18 cm behind tv1's turned plane, and tv1 (1.46 m wide)
 *  does not hold her there. null when p is in the room. A moving glass draws her only then; her centre decides, as `seen` is judged by it. */
export function glassHolding(pr, p, { margin = 0 } = {}) {
  if (!fin3(p) || !pr?.glasses || typeof pr.glasses !== 'object') return null;
  for (const s of Object.keys(pr.glasses)) { const pl = planeOf(pr.glasses[s]); if (!pl || side(pl, p) > 0) continue;
    const e = sub(p, pl.c); if (Math.abs(dot(pl.r, e)) <= pl.w / 2 + margin && Math.abs(dot(pl.u, e)) <= pl.h / 2 + margin) return s; }
  return null;
}
/** TWO ROOMS, ONE PATH (Oct 12 2026 03:4x WEST, his "can you give me what i was promised then"). Her program is authored in the Nest's scene (its glasses as
 *  scene/entities hold them); a phone stands in the Station (the rite's frame: StationJoin.swift lays the phone's world on /rite/state scene.dense.mirrors).
 *  The two rooms are not one solve yet: they hold lysa 1.99 m and 88 degrees apart (read Oct 12 02:03: a hand drag in the twin against a camera's measure),
 *  so a phone that took her point as its own room's drew her two metres from the glass she was leaving. Until the room is one, the path crosses THROUGH THE
 *  GLASSES IT IS AUTHORED THROUGH (the rule a placed glass already lives by: she is drawn through its own plane, so its placement's error cancels): a glass
 *  both rooms hold gives a bridge (both rooms are level: a turn about y that lays the normal's heading on the normal's, then the centre on the centre; the
 *  rite's join law), and every point rides the bridge of the glass its label names.
 *  bridgeOf(a, b): the bridge from the room of plane a to the room of plane b (one glass, two records), or null when a normal has no heading. */
export function bridgeOf(a, b) {
  const head = (v) => (fin3(v) && Math.hypot(v[0], v[2]) > 0.2 ? Math.atan2(v[0], v[2]) : null), ha = head(a?.n), hb = head(b?.n);
  if (ha == null || hb == null || !fin3(a.c) || !fin3(b.c)) return null;
  const yaw = Math.atan2(Math.sin(hb - ha), Math.cos(hb - ha));
  return { yaw, cos: Math.cos(yaw), sin: Math.sin(yaw), from: [...a.c], to: [...b.c] };
}
/** turn(bridge, v): a direction across (heading = atan2(x, z), so a turn adds to it); across(bridge, p): a point across. */
export const turn = (br, v) => [v[0] * br.cos + v[2] * br.sin, v[1], v[2] * br.cos - v[0] * br.sin];
export const across = (br, p) => add(br.to, turn(br, sub(p, br.from)));
const bridgeSeat = (pr, label) => {
  if (typeof label !== 'string') return null;
  for (const s of Object.keys(pr?.glasses || {})) if (label === `inside ${s}` || label === `on ${s}'s glass` || label === `out of ${s}` || label === `before ${s}`) return s;
  return null;
};
const bridgeList = (pr, list) => {
  const glasses = pr?.glasses;
  if (!glasses || typeof glasses !== 'object' || !Array.isArray(list) || !list.length || list.length > Object.keys(glasses).length + 1) return null;
  const seen = new Set(); let total = 0;
  for (const q of list) {
    if (!q || !(q.seat === null || (typeof q.seat === 'string' && Object.prototype.hasOwnProperty.call(glasses, q.seat))) || seen.has(q.seat) || !fin(q.weight) || !(q.weight > 0) || !fin3(q.p)) return null;
    seen.add(q.seat); total += q.weight;
  }
  if (!fin(total) || Math.abs(total - 1) > 1e-9) return null;
  return list.map(q => ({ seat: q.seat, weight: q.weight / total, p: [...q.p] }));
};
const bridgePoint = list => list.reduce((p, q) => add(p, q.p, q.weight), [0, 0, 0]);
const explicitBridges = (pr, q) => {
  const list = bridgeList(pr, q?.bridge);
  return list && fin3(q?.p) && len(sub(bridgePoint(list), q.p)) <= 1e-8 * Math.max(1, len(q.p)) ? list : null;
};
/** pointBridges(program, index): freeze a point's current projection sources before its neighbours change.
 * A source names one existing glass (null: the unchanged room), a weight, and a point in this program's frame.
 * Explicit hints are flat and bounded to one source per glass plus the room; an invalid hint uses the ordinary label law. */
export function pointBridges(pr, index) {
  const q = pr?.points?.[index]; if (!fin3(q?.p)) return null;
  const explicit = explicitBridges(pr, q); if (explicit) return explicit;
  const named = bridgeSeat(pr, q.at); if (named !== null) return [{ seat: named, weight: 1, p: [...q.p] }];
  const near = step => { for (let i = index + step; i >= 0 && i < pr.points.length; i += step) { const seat = bridgeSeat(pr, pr.points[i]?.at); if (seat !== null) return seat; } return null; };
  const a = near(-1), b = near(1);
  return a === b ? [{ seat: a, weight: 1, p: [...q.p] }] : [{ seat: a, weight: 0.5, p: [...q.p] }, { seat: b, weight: 0.5, p: [...q.p] }];
}
/** mixBridges(program, left, right, k): source hints for an interpolated point. Equal-seat affine sources
 * merge by weighted centroid, so repeated redirections stay bounded by glasses + one, never nested old programs. */
export function mixBridges(pr, left, right, k) {
  const a = bridgeList(pr, left), b = bridgeList(pr, right); if (!a || !b || !fin(k) || k < 0 || k > 1) return null;
  const bySeat = new Map();
  for (const [list, scale] of [[a, 1 - k], [b, k]]) for (const q of list) {
    const weight = q.weight * scale; if (!(weight > 0)) continue;
    let held = bySeat.get(q.seat); if (!held) { held = { seat: q.seat, weight: 0, p: [0, 0, 0] }; bySeat.set(q.seat, held); }
    held.weight += weight; held.p = add(held.p, q.p, weight);
  }
  return bridgeList(pr, [...bySeat.values()].map(q => ({ ...q, p: q.p.map(v => v / q.weight) })));
}
/** programIn(program, records): her program as the room that holds `records` sees it (seat -> that room's own record of the glass: a plane, an entity or a
 *  mirror of /rite/state, anything planeOf reads). The same points in the same order with the same labels, bars, grid and t0_beat (so pathAt says the same
 *  leg, k and bar at every house time: one clock), each point moved by the bridge of the glass its label names ('inside tv2', "on tv2's glass", 'out of
 *  tv2', 'before tv2'); 'the room' (the stage's middle) is halfway between where its two neighbours' bridges put it. A glass the other room does not hold
 *  STAYS where the program has it (said in crossing.stays): the two rooms count as one wherever no record says otherwise (tv1's two records are the same
 *  numbers; a Mac's glass stands at its measured lens), and riding lysa's bridge instead would carry a measured thing 88 degrees round a hand drag.
 *  The glasses come back as the other room holds them (its centre and axes; the program's size, the one her depth inside was fitted to).
 *  -> the program there, with `crossing` { via, stays, yaw_deg }, or null when the two rooms share no glass (never a guess). */
export function programIn(pr, records) {
  const pts = pr?.points; if (!Array.isArray(pts) || !pts.length || !pr.glasses || typeof pr.glasses !== 'object' || !records || typeof records !== 'object') return null;
  for (const q of pts) if (!fin3(q?.p)) return null;
  const seats = Object.keys(pr.glasses), here = {}, there = {}, br = {};
  for (const s of seats) { const a = planeOf(pr.glasses[s]); if (!a) continue; here[s] = a; const b = planeOf(records[s], [a.w, a.h]), x = b ? bridgeOf(a, b) : null; if (x) { br[s] = x; there[s] = { ...b, w: a.w, h: a.h }; } }
  const via = seats.filter((s) => br[s]); if (!via.length) return null;
  const SAME = { yaw: 0, cos: 1, sin: 0, from: [0, 0, 0], to: [0, 0, 0] };
  const marks = pts.map((q) => bridgeSeat(pr, q.at)), ride = (i) => br[marks[i]] || SAME;
  const near = (i, step) => { for (let j = i + step; j >= 0 && j < pts.length; j += step) if (marks[j]) return ride(j); return SAME; };
  const points = pts.map((q, i) => {
    const sources = explicitBridges(pr, q);
    if (sources) {
      const bridge = sources.map(s => ({ ...s, p: across(s.seat === null ? SAME : br[s.seat] || SAME, s.p) }));
      return { ...q, p: bridgePoint(bridge), bridge };
    }
    // View coordinates keep their precision: rounding here would make affine source mixing discontinuous.
    const { bridge: ignored, ...point } = q;
    return { ...point, p: marks[i] ? across(ride(i), q.p) : mix(across(near(i, -1), q.p), across(near(i, 1), q.p), 0.5) };
  });
  const glasses = {}; for (const s of seats) if (here[s]) glasses[s] = poseOf(there[s] || here[s]);
  return { ...pr, points, glasses, crossing: { via, stays: seats.filter((s) => here[s] && !br[s]), yaw_deg: Object.fromEntries(via.map((s) => [s, round(br[s].yaw * 180 / Math.PI, 100)])) } };
}

/** side(plane, p): metres in front of the glass (positive: in the room, where its face looks; negative: behind it). */
export const side = (pl, p) => dot(pl.n, sub(p, pl.c));
/** fold(plane, p): where this glass shows a body standing at p: p itself behind the plane (a window), its mirror image in front of it (a mirror). */
export function fold(pl, p) { const d = side(pl, p); return d > 0 ? { p: add(p, pl.n, -2 * d), d, as: 'mirror' } : { p: [...p], d, as: 'window' }; }

/** frustum(plane, eye, {near, rect}): the eye's view through the glass rectangle (rect: a part of it in fractions {x, y, w, h} from its top left, as a page
 *  that fills only a part of its screen says; default the whole glass). -> { l, r, b, t, near, far, d (the eye to the plane), eye, x, y, z (the camera's
 *  axes: right, up, toward the eye) }, or null when the eye is on the plane or behind it. */
export function frustum(pl, eye, { near = NEAR_M, far = FAR_M, rect = null } = {}) {
  if (!pl || !fin3(eye)) return null;
  const d = side(pl, eye); if (!(d > MIN_EYE_M)) return null;
  const x0 = rect && fin(rect.x) ? rect.x : 0, y0 = rect && fin(rect.y) ? rect.y : 0, w = rect && fin(rect.w) ? rect.w : 1, h = rect && fin(rect.h) ? rect.h : 1;
  const L = (x0 - 0.5) * pl.w, R = (x0 + w - 0.5) * pl.w, T = (0.5 - y0) * pl.h, B = (0.5 - y0 - h) * pl.h;
  const e = sub(eye, pl.c), ex = dot(pl.r, e), ey = dot(pl.u, e), k = near / d;
  return { l: (L - ex) * k, r: (R - ex) * k, b: (B - ey) * k, t: (T - ey) * k, near, far, d, eye: [...eye], x: pl.r, y: pl.u, z: pl.n };
}
/** project(fr, p): where a point lands in the glass's picture: [x, y] in 0..1 from its top left and the depth along the view, or null behind the eye. */
export function project(fr, p) {
  if (!fr || !fin3(p)) return null;
  const v = sub(p, fr.eye), z = -dot(fr.z, v); if (!(z > fr.near)) return null;
  const x = dot(fr.x, v) * fr.near / z, y = dot(fr.y, v) * fr.near / z;
  return [(x - fr.l) / (fr.r - fr.l), (fr.t - y) / (fr.t - fr.b), z];
}
/** matrices(fr): the projection (column major, OpenGL clip space) and the camera's world basis, for a renderer that takes them as they are. */
export function matrices(fr) {
  if (!fr) return null;
  const { l, r, b, t, near: n, far: f } = fr;
  const P = [2 * n / (r - l), 0, 0, 0, 0, 2 * n / (t - b), 0, 0, (r + l) / (r - l), (t + b) / (t - b), -(f + n) / (f - n), -1, 0, 0, -2 * f * n / (f - n), 0];
  const W = [fr.x[0], fr.x[1], fr.x[2], 0, fr.y[0], fr.y[1], fr.y[2], 0, fr.z[0], fr.z[1], fr.z[2], 0, fr.eye[0], fr.eye[1], fr.eye[2], 1];
  return { projection: P, world: W };
}

/** mirror(plane, p): p seen in the glass's mirror (its image across the plane). */
export const mirror = (pl, p) => add(p, pl.n, -2 * side(pl, p));
/** insideOf(plane, eye): where the body stands INSIDE this glass: behind its plane, on the eye's line through the glass's centre (so it stands in the middle of
 *  the picture), as far along it as it takes for the whole figure to fit FIT of the glass's smaller side, and never deeper than MAX_IN_M (a small glass
 *  cannot hold the whole figure: it holds it close, as a porthole). On that line the figure's size on the glass is body x D0 / D (D0: the eye to the glass's centre, D: the eye to the body): life size at the plane. */
export function insideOf(pl, eye, { body = BODY_M, fit = FIT } = {}) {
  const v = sub(pl.c, eye), D0 = len(v), dir = unit(v); if (!dir) return { p: add(pl.c, pl.n, -MIN_IN_M), depth: MIN_IN_M };
  const m = Math.min(pl.w, pl.h) * fit, D = Math.min(D0 + MAX_IN_M, Math.max(D0 + MIN_IN_M, D0 * body / m));
  return { p: add(eye, dir, D), depth: D - D0 };
}
/** outOf(plane, eye): where it stands just OUT of this glass, in the room: the point whose mirror image lies OUT_M past the plane on that same line of the
 *  eye (it left along the glass's own reflection of that line, so in this glass it stays in the middle of the picture and only shrinks). */
export function outOf(pl, eye, out = OUT_M) { const v = sub(pl.c, eye), dir = unit(v); return dir ? mirror(pl, add(pl.c, dir, out)) : add(pl.c, pl.n, out); }

/** gridOf(grid): a program's grid, whole: the genesis grid where the given one says nothing. */
export const gridOf = (grid) => ({ epoch_ms: fin(grid?.epoch_ms) ? grid.epoch_ms : GENESIS_MS, beat_ms: fin(grid?.beat_ms) && grid.beat_ms > 0 ? grid.beat_ms : GENESIS_BEAT_MS,
  beats_per_bar: fin(grid?.beats_per_bar) && grid.beats_per_bar > 0 ? Math.round(grid.beats_per_bar) : BEATS_PER_BAR, source: typeof grid?.source === 'string' ? grid.source : 'genesis' });

/** tourOf({glasses, eye, home, order, grid, t0_beat, by, at}): THE TOUR. It lives inside `home` (the first glass of the order when unsaid). From there it
 *  comes to the plane (it fills the glass), out into the room to the stage's middle (halfway from the eye to the glasses: every glass holds its reflection),
 *  then to each other glass in turn: out in front of it, onto its plane, inside it for a bar, back out; then home the way it left. One bar a leg.
 *  who: { unit1: <chair> } when one of her twelve travels it and she stays held inside `home` (WHO TRAVELS); unsaid: her whole body. start: with who, the chair's
 *  place on its wire at the first downbeat, the tour's first and last point; unsaid: her rest.
 *  -> the program (SCHEMA), or null when no glass of the order is placed or the eye is not a point. */
export function tourOf({ glasses = {}, eye, home = null, order = null, grid = null, t0_beat = 0, loop = false, follow = true, by = null, at = null, why = null, who = null, frame = null, start = null } = {}) {
  if (!fin3(eye)) return null;
  const tr = travellerOf({ who }), fits = { body: tr ? tr.body : BODY_M };   // WHO TRAVELS: inside a glass the traveller stands as deep as ITS size takes (one of her twelve fits a laptop's glass whole)
  const planes = {}; for (const [seat, g] of Object.entries(glasses || {})) { const pl = planeOf(g); if (pl && side(pl, eye) > MIN_EYE_M) planes[seat] = pl; }
  const seats = (Array.isArray(order) && order.length ? order : Object.keys(planes)).filter((s) => planes[s]); if (!seats.length) return null;
  const h = home && planes[home] ? home : seats[0], rest = seats.filter((s) => s !== h);
  const centre = seats.reduce((a, s) => add(a, planes[s].c, 1 / seats.length), [0, 0, 0]), mid = mix(eye, centre, 0.5);
  const pts = [], put = (p, label, bars = 1) => pts.push({ p: r3(p), at: label, ...(bars !== 1 ? { bars } : {}) }), g = gridOf(grid);
  const inH = tr ? { p: fin3(start) ? [...start] : insideOf(planes[h], eye).p } : insideOf(planes[h], eye, fits);   // with who: the chair's place when handed (start), else her rest
  put(inH.p, `inside ${h}`);
  put(planes[h].c, `on ${h}'s glass`); put(outOf(planes[h], eye), `out of ${h}`); put(mid, 'the room');
  for (const s of rest) {
    const pl = planes[s], inn = insideOf(pl, eye, fits);
    put(outOf(pl, eye), `before ${s}`); put(pl.c, `on ${s}'s glass`); put(inn.p, `inside ${s}`); put(inn.p, `inside ${s}`);   // the same point twice: a bar's hold inside
    put(pl.c, `on ${s}'s glass`); put(outOf(pl, eye), `out of ${s}`); put(mid, 'the room');
  }
  put(outOf(planes[h], eye), `before ${h}`); put(planes[h].c, `on ${h}'s glass`); put(inH.p, `inside ${h}`);
  return { schema: SCHEMA, ...(typeof frame === 'string' && frame.length > 0 && frame.length <= 512 && !['station', 'room', 'live', 'world'].includes(frame) ? { frame } : {}),
    golem: 'lyssajudron', name: 'tour', home: h, order: seats, eye: r3(eye), follow: follow !== false, grid: g, t0_beat: Math.round(t0_beat), loop: !!loop, points: pts,
    glasses: Object.fromEntries(seats.map((s) => [s, poseOf(planes[s])])), ...(tr ? { who: { unit1: tr.unit1 } } : {}), ...(by ? { by: String(by).slice(0, 200) } : {}), ...(why ? { why: String(why).slice(0, 300) } : {}), ...(at ? { at } : {}) };
}
/** restOf({glasses, eye, home}): the program of a body at rest inside its home glass (no tour: one point). */
export function restOf(o = {}) { const t = tourOf(o); return t ? { ...t, name: 'rest', points: [t.points[0]], loop: false } : null; }

/* THE ASK FLIES (Oct 23 2026 22:xx WEST, lane/the-ask-flies). His words at 21:26: "i wanna be able to have her come close to me and then fly into other
 * screens... the fucking widget in oldmac where you could slide around the oberserv and then orange ball would follow a trajectory in spaceimte"; that widget
 * was Claude's answer to his Oct 4 01:04 sentence at the head of this file (anamorphic_handoff_across_three_screens, the old Mac's session bfcbc6ff). A seat
 * that stops on his word (room-board-state.mjs askOf: the ask on its own entry) is one of her twelve, and its unit1 COMES AT HIM: out of her home glass
 * through its mouth, across the room, to the point before his face, where it waits while the ask stands. His word takes it on from there (one-agents.mjs
 * travellersAt: the agent's next place, or home). The flight is a program of this file's shape, one leg a bar on her grid, its first downbeat the beat after
 * the moment it may leave: every glass derives it from the ask, her path and the eye, so nothing is written and every glass holds the same point.
 * WHERE "BEFORE HIM" IS (himOf): the glasses her path holds are the only glasses every glass knows alike (a page's own plane is its own), so only they are
 * asked. The nearest one before his eye within his reach (NEAR_GLASS_M: the Mac on his desk) takes it: A UNIT1 WAITS BEFORE ITS GLASS (Nov 10 2026; it waited 1 cm
 * behind, on the edge of the Nov 8 cut that draws nothing behind a glass) BEFORE_M before that plane on the eye's line to its centre, its whole body inside the
 * cut every overlay draws by (embertide-scene way.rs him_at, the same law). With none in his reach it waits NEAR_HIM_M before his eye on the line to her home: the glass in his hands (the iPad, a phone:
 * a moving glass, no fold) shows what stands beyond it, and there it fills its screen. COST: a few vector sums a picture, nothing at rest (a held program is
 * done: no glass draws a frame for it until a cause moves it). */
export const NEAR_HIM_M = 0.43;      // before his eye, with no glass in his reach: a hand's iPad stands about 0.40 m from the eye, so it fills its screen
export const NEAR_GLASS_M = 1.2;     // a glass this close before his eye is in his reach: the one the unit1 comes to
export const BEFORE_M = 0.206 * 0.42 + 0.006;   // how far before that glass's plane it waits: a unit1's radius (K x CHILD) and its body off a glass on an act (TW.onGlass): way.rs BEFORE_M
/** himOf(eye, home, glasses): where a unit1 that asks him waits: { p, glass (the seat of the glass in his reach it waits in, or null), d (the eye to p) },
 *  or null without an eye. home: her home glass (a plane or a pose); glasses: { seat: plane or pose } (her path's own). */
export function himOf(eye, home, glasses = {}, chair = null) {   // chair: ASKERS NEVER STACK (way.rs him_at): its twelfth of the gather's ring (gather.rs RADIUS 0.3 of the lesser side) in the glass's own right and up
  if (!fin3(eye)) return null;
  let near = null;
  for (const [seat, g] of Object.entries(glasses || {})) { const pl = planeOf(g); if (!pl) continue; const d = side(pl, eye); if (d > MIN_EYE_M && d <= NEAR_GLASS_M && (!near || d < near.d || (d === near.d && seat < near.seat))) near = { seat, pl, d }; }
  if (near) { const dir = unit(sub(near.pl.c, eye)); if (dir) { const p0 = add(near.pl.c, dir, -Math.min(BEFORE_M, near.d / 2) * len(sub(near.pl.c, eye)) / near.d), th = Math.PI / 2 - 2 * Math.PI * chair / CHAIRS, rad = 0.3 * Math.min(near.pl.w, near.pl.h), p = fin(chair) ? add(add(p0, near.pl.r, rad * Math.cos(th)), near.pl.u, rad * Math.sin(th)) : p0; return { p, glass: near.seat, d: len(sub(p, eye)) }; } }
  const hp = planeOf(home), dir = hp ? unit(sub(hp.c, eye)) : null; if (!dir) return null;
  return { p: add(eye, dir, NEAR_HIM_M), glass: null, d: NEAR_HIM_M };
}
/** beatAfter(ms, grid): the first beat of the grid after `ms` (its index, as a program's t0_beat counts). */
export const beatAfter = (ms, grid = null) => { const g = gridOf(grid); return Math.floor((ms - g.epoch_ms) / g.beat_ms) + 1; };
/** beatMs(beat, grid): the house time of a beat of the grid. */
export const beatMs = (beat, grid = null) => { const g = gridOf(grid); return g.epoch_ms + beat * g.beat_ms; };
export const PATH_DONE_MS = 10e3;   // the Board carries a finished path until the owner settles the entity
/** arrivesAt(program): the house time its last leg ends (a held program stands there from then on). */
export const arrivesAt = (pr) => (pr && Array.isArray(pr.points) && fin(pr.t0_beat) ? beatMs(pr.t0_beat + barsOf(pr) * gridOf(pr.grid).beats_per_bar, pr.grid) : null);

/** barsOf(program): the tour's length in bars (a point's `bars` is the length of the leg that LEAVES it). */
export function barsOf(pr) { const pts = pr?.points; if (!Array.isArray(pts) || pts.length < 2) return 0; let n = 0; for (let i = 0; i < pts.length - 1; i++) n += fin(pts[i].bars) && pts[i].bars > 0 ? pts[i].bars : 1; return n; }
/** THE PATH IS MOVED TO THE MODULE (SPACE FIRST, Nov 7 2026): pathAt(program, house_ms) is the one module's door (embertide-scene scene_path_on through
 *  scene-wasm.mjs pathOn), which registers itself here when it is instantiated (pathDoor); a page that carries the module inline (the Board's SCENE-LAW block)
 *  is found on SCENE_LAW.scene. While no module stands, the text below answers (pathAtText: outgrown, left behind as the witness and the fallback, ONE TEXT
 *  with the radio's copy for the sound, radio/spatial.mjs and radio/glass.js; radio/spatial.test.mjs holds the three to one text and to the module).
 *  pathAt.by says which answered last ('module' or 'text'); embertide-scene/tests/path_parity.rs holds the module to the text's own answers (a fixture, its bytes pinned) for every caller's kind of program. */
// space: outgrown: the text the module's door outgrew, left behind as its fallback and its witness (embertide-scene/tests/path_parity.rs holds the module to its answers for every caller)
const pathAtText = (() => {
/* PATH-MATH-BEGIN (one text in embertide-app/ui/intro/room/one-law.mjs, tools/embertide-mesh/radio/spatial.mjs and radio/glass.js; radio/spatial.test.mjs checks they are the same bytes) */
function pathAt(pr, house_ms) {
  /* where the one body is at a house time: { p, leg (the leg's first point), k (0..1 along it, eased), at (the label it is at or leaving), to, bar (bars
     since the first downbeat; negative before it), moving, done }, or null without a program or with a point that is not [x, y, z]. Before the first
     downbeat it stands at the first point; after the last leg at the last (a looping tour starts again). Each leg starts and ends at rest (the cartoon's
     hang). A point's `bars` is the length of the leg that LEAVES it (1 when unsaid). ES5 and whole in itself (no helper outside it), never a throw: the
     radio's glass block carries this text and the sound's source is this point, so every picture and every speaker hold the same p(t). */
  function fin(v) { return typeof v === 'number' && isFinite(v); }
  var pts = pr && pr.points, n = Array.isArray(pts) ? pts.length : 0, i, q;
  if (!n) return null;
  for (i = 0; i < n; i++) { q = pts[i] && pts[i].p; if (!Array.isArray(q) || q.length !== 3 || !fin(q[0]) || !fin(q[1]) || !fin(q[2])) return null; }
  var g = pr.grid || {}, beat_ms = fin(g.beat_ms) && g.beat_ms > 0 ? g.beat_ms : 600, bpb = fin(g.beats_per_bar) && g.beats_per_bar > 0 ? g.beats_per_bar : 4, epoch = fin(g.epoch_ms) ? g.epoch_ms : 1772673332000;   /* a program without a grid counts on the genesis grid */
  function legOf(j) { var w = pts[j].bars; return fin(w) && w > 0 ? w : 1; }
  var total = 0; for (i = 0; i < n - 1; i++) total += legOf(i);
  var bar = fin(house_ms) ? ((house_ms - epoch) / beat_ms - (fin(pr.t0_beat) ? pr.t0_beat : 0)) / bpb : -1;
  function still(j, done) { return { p: pts[j].p.slice(), leg: j, k: 0, at: pts[j].at != null ? pts[j].at : null, to: null, bar: bar, moving: false, done: done }; }
  if (n < 2 || !(total > 0) || !(bar >= 0)) return still(0, false);
  if (bar >= total) { if (!pr.loop) return still(n - 1, true); bar -= Math.floor(bar / total) * total; }
  var b = bar, L, k, a, c, dx, dy, dz;
  for (i = 0; i < n - 1; i++) {
    L = legOf(i);
    if (b < L) {
      k = b / L; k = k < 0 ? 0 : k > 1 ? 1 : k; k = k * k * (3 - 2 * k); a = pts[i].p; c = pts[i + 1].p; dx = a[0] - c[0]; dy = a[1] - c[1]; dz = a[2] - c[2];
      return { p: [a[0] + (c[0] - a[0]) * k, a[1] + (c[1] - a[1]) * k, a[2] + (c[2] - a[2]) * k], leg: i, k: k, at: pts[i].at != null ? pts[i].at : null, to: pts[i + 1].at != null ? pts[i + 1].at : null, bar: bar, moving: Math.sqrt(dx * dx + dy * dy + dz * dz) > 1e-6, done: false };
    }
    b -= L;
  }
  return still(n - 1, true);
}
/* PATH-MATH-END */
return pathAt; })();
let DOOR = null;
export function pathDoor(fn) { DOOR = typeof fn === 'function' ? fn : null; }
export function pathAt(pr, house_ms) { const s = typeof globalThis !== 'undefined' && globalThis.SCENE_LAW && globalThis.SCENE_LAW.scene, d = DOOR || (s && typeof s.pathOn === 'function' ? (p, t) => s.pathOn(p, t) : null), at = d ? d(pr, house_ms) : undefined; pathAt.by = at === undefined ? 'text' : 'module'; return at === undefined ? pathAtText(pr, house_ms) : at; }
export { pathAtText };

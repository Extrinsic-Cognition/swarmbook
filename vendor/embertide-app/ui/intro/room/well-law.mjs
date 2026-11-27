// well-law.mjs - THE WELL'S LAW, pure (no DOM, no three, no clock of its own; node --test well-law.test.mjs).
// His words, Oct 12 2026 04:1x WEST, over lysa showing the Council's table: "ok but it is wrong. you need to make it different... can you make it so that
// it looks like a magic box inside of the lysa pc? like i want infinite depth effect there like as if it was a well... and the lyssajudron is irradiating
// light inside of the well (the well is not vertical, it simply is whatever hinge % the laptop lysa has idk if you can read it or who cares just display
// the qr code and the iOS will scan you and position you".
// THE WELL is the inside of a glass: a shaft whose mouth is the glass's own rectangle and whose axis is the glass's own normal, so it goes straight back
// through the screen whatever the hinge. It is drawn in THE GLASS'S OWN AXES (x right, y up, z out toward him, metres from the glass's centre). The picture
// is the off-axis frustum of that rectangle from an eye (windowOf): the near plane IS the glass, so nothing stands in front of it and its edges are the
// screen's edges.
// THE WELL IS A TRUE MIRROR OF THE ONE ROOM, never a closed 2D painting (the canon's foundations, his: 1 "One room, never frozen" — the room is one model,
// the Omega state space; 2 "Causes, not pictures" — only causes cross the wire, every screen a replicator drawing its own component; 9 "On a glass the
// program is the 2D compressed causal model, the field over its own pixels morphed by causes"; C-2 one state, each screen passes its component; C-15 mirrors
// render). So the glass's own axes are not a world apart and lysa's information is never only of the 2D model: they are one end of a measured bridge into
// the one room (the rite's scene.dense.mirrors record of this glass, one-law.mjs planeOf; the path's own glasses), and a unit1 that exists has coordinates
// through the WHOLE flight — inside the well (behind the plane, z < 0 in the glass's axes), through the mouth, across the room, into another glass, one
// continuous space (chairIn: a caused pose, never null while the unit1 exists). What stands before the plane the well shows as a mirror, folded across it
// (one-law.mjs fold), and the fold is continuous at the plane: no vector ever jumps at the mouth. A place a record does not measure is a DECLARED GUESS
// (his standing law: a guessed place is drawn dashed, never nothing — roomGuess), never silently stood as truth.
// THE EYE, in the glass's axes: the phone that placed this glass, while its eye is fresh (the hackathon take is filmed by that phone: the well is true
// from its lens); then MOTIONCAP ANCHORS THE DEPTH (his law, Oct 15 2026: the house eye's body stream is what anchors the mirror's depth, REALTIME — causes
// at capture, the latency target zero, stale poses must say so): the wind's fused body, fresh within its TTL (EYE_FRESH_MS, by the receiver's own clock),
// gives the frustum eye from HIS MEASURED BODY (his shoulders lifted to his eyes, mac-eye.mjs headOf), put in this glass's axes through its record — a
// measure through a phone's own sighting, a declared guess through any other record; stale, the well degrades honestly and eyeFor's `from` says so. Last,
// a head before a laptop (EYE_FRONT). A glass no phone placed still takes no room's eye of a phone: its record may be a hand drag or a camera's guess of a
// plane, and a wrong plane turns the well sideways (lysa stood in two records, 1.99 m and 88 degrees apart, both 49 inches for a 14-inch lid).
// SHE in the well: THE AXIOM OF THE ANCHOR below (LOCKED_IN_DEPTH) — unit0 stays always anchored in the depth of her home's well, whatever her path says;
// THE UNIT1S ARE THE SPATIAL TRYCUA AGENTS THAT DO STUFF IN SPATIAL COMPUTING (his words, made axiom Oct 15 2026), caused poses through the whole flight.
import * as LAW from './one-law.mjs';
import { load as loadFold } from './scene-wasm.mjs';
import { frustum as eyeDoor } from './eye-door.mjs';   // THE EYE DOOR (lane/the-eye-door): the window below is the nexus's frustum, the glass the near plane

export const EYE_FRONT = Object.freeze([0, 0.02, 0.55]);   // nobody measured the eye: a head before a laptop, metres in the glass's axes
export const EYE_MIN_M = 0.08;         // an eye this close to the plane (or behind it) sees no well
export const EYE_FRESH_MS = 2000;      // the well's one freshness TTL (his law: realtime, stale poses must say so): the phone's eye, his measured body and a pose's cause are taken while this fresh (by the receiver's own clock)
// every length of the well is a share of the glass's height (u): the look is the same on a 14-inch lid and a 65-inch wall
export const REST_U = 2.4;             // her centre at rest, this deep
export const BODY_U = 0.62;            // her figure across its lanes at rest
export const FILL_U = 0.92;            // on the glass she fills it
export const ROW_U = 0.5;              // a course of blocks along the depth
export const BLOCK_U = 0.62;           // a block around the shaft
export const BAND_ROWS = 4;            // a gold band every so many courses
export const BAND_U = 0.035;           // a band's thickness
export const DEPTH_U = 40;             // the shaft that is built (the dark takes it long before)
export const DARK_U = 12;              // at this depth three tenths of the light is left (the fog's law)
export const BOX_LIGHT = 0.3;          // the box's own light: the lamps that light the walls never fall below this share of hers (lampsOf)
const PHONE = /^\s*(triangulated|placed by the phone)/i;   // a record a phone's own sighting made (the rite's `method`, or the first words of `measured`)

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const ok3 = (p) => Array.isArray(p) && p.length === 3 && p.every(num);

/** local(plane, p): a point of the plane's room in the glass's own axes: [right, up, out] metres from its centre. */
export const local = (pl, p) => { const e = LAW.sub(p, pl.c); return [LAW.dot(pl.r, e), LAW.dot(pl.u, e), LAW.dot(pl.n, e)]; };

/** windowOf(eye, w, h): the off-axis frustum of a w x h glass from an eye in its own axes. The near plane is the glass: {l, r, b, t, near}, the four
 *  edges of the glass from the eye. null when the eye is not before it (EYE_MIN_M, the well's own), or when the eye door is not in hand. THE LAW IS THE
 *  NEXUS'S (eye-door.mjs, embertide-radio/nexus/src/doors/eye.rs): the glass at its own axes' origin, the near plane unsaid (the glass), so the door's
 *  edges are -w / 2 - eye[0] .. and its near eye[2], to the bit (eye-door.test.mjs holds this file's old arithmetic to it). */
const OWN = { c: Object.freeze([0, 0, 0]), r: Object.freeze([1, 0, 0]), u: Object.freeze([0, 1, 0]), n: Object.freeze([0, 0, 1]), w: 1, h: 1 }, GLASS_NEAR = Object.freeze({ near: null, far: null });   // the glass at its own origin, its size set per call (the door reads it at once)
export function windowOf(eye, w, h) {
  if (!ok3(eye) || !(eye[2] >= EYE_MIN_M) || !(w > 0) || !(h > 0)) return null;
  OWN.w = w; OWN.h = h;
  const f = eyeDoor(OWN, eye, GLASS_NEAR);
  return f ? { l: f.l, r: f.r, b: f.b, t: f.t, near: f.near } : null;
}
/** picture(eye, w, h, p): where a point of the well lands in the glass's picture, [0..1 from the left, 0..1 from the top], or null in front of the glass
 *  or behind the eye. (What the frustum of windowOf draws: the test holds the two to each other.) */
export function picture(eye, w, h, p) {
  if (!windowOf(eye, w, h) || !ok3(p)) return null; const d = eye[2] - p[2]; if (!(d >= eye[2])) return null;
  const k = eye[2] / d; return [0.5 + (eye[0] + (p[0] - eye[0]) * k) / w, 0.5 - (eye[1] + (p[1] - eye[1]) * k) / h];
}
/** vanish(eye, w, h): where the well's axis ends in the picture: the foot of the eye on the glass. In the middle from the front; it follows the eye. */
export const vanish = (eye, w, h) => [0.5 + eye[0] / w, 0.5 - eye[1] / h];

/** inWell(at, seat): where she is in this glass's well, by her path's own word (the object pathAt returns): {there, rise}. rise 0: at rest inside;
 *  rise 1: on the glass, where she fills it. Away from this glass (in the room, in another glass): there false. SHE LEAVES THROUGH THE GLASS ON HIS
 *  COMMAND (Oct 14 2026 06:4x WEST; his "POINT THE LASER TO THE PLACE ONLY WHEN MY COMMAND IS REGISTERED"): a leg that leaves `inside <seat>` for a place
 *  that is not this glass's own stage (his tap's point, 'the room', another glass: NestBoard.html eyeTap writes the `go` from where she rests straight to
 *  the place) is her rise to the mouth over that leg, as the tour's own leg to the glass is; until this day she vanished from the well the instant such a
 *  leg began, and no beam of hers could point at the place. At the leg's end she is at the place: gone from here. */
export function inWell(a, seat) {
  if (!a || typeof seat !== 'string' || !seat) return { there: false, rise: 0 };
  const inside = `inside ${seat}`, on = `on ${seat}'s glass`, k = num(a.k) ? Math.max(0, Math.min(1, a.k)) : 0;
  if (a.at === inside && a.to === on) return { there: true, rise: k };
  if (a.at === on && a.to === inside) return { there: true, rise: 1 - k };
  if (a.at === inside && (a.to == null || a.to === inside)) return { there: true, rise: 0 };
  if (a.at === inside && typeof a.to === 'string' && a.to !== on) return { there: true, rise: k };   // straight out to a place: her rise over the leg (his command)
  return { there: false, rise: 0 };
}
/** THE AXIOM OF THE ANCHOR (his words, Oct 12 2026 12:0x — "do you understand that the unit0 will stay locked at home where lysa is?
 *  while the unit1s are gonna be the floating trycua agents" — made axiom Oct 15 2026: "UNIT0 STAYS ALWAYS ANCHORED THERE. BUT
 *  UNIT1s ARE THE SPATIAL TRYCUA AGENTS THAT DO STUFF IN SPATIAL COMPUTING"). UNIT0 NEVER LEAVES THE DEPTH: her home's well holds
 *  her inside its shaft whatever her path says — never up to the mouth (the mouth is the depth's boundary: filling it is leaving
 *  it), never the empty dark box of a path whose rest names another glass (her path rested 'inside tv1' and lysa stood empty).
 *  She stands at rest — REST_U deep, BODY_U across: deep enough that the courses and the gold bands stand around and behind her,
 *  small enough that the shaft's walls clear her lanes — and the well is never empty. THE UNIT1S ARE THE ONES WHO GO OUT: the
 *  spatial trycua agents, doing stuff in spatial computing — their chairs still fly off her wires (chairIn, one-agents.mjs). */
export const LOCKED_IN_DEPTH = Object.freeze({ there: true, rise: 0 });
/** chairIn(a, seat, {plane, rx_ms, now_ms}): HER UNIT1'S POSE, ALWAYS — the axiom's going-out half ("UNIT1s ARE THE SPATIAL TRYCUA AGENTS THAT DO STUFF
 *  IN SPATIAL COMPUTING"). `a` is the sample of the path it flies (one-law.mjs pathAt's word, or one-agents.mjs travellersAt's, the same shape: {p, at,
 *  to, k, moving}); seat this glass. An agent that exists has coordinates through the WHOLE flight: inside this glass's well (behind its plane, z < 0 in
 *  its own axes), through the mouth, across the room, into another glass — one continuous space. Until this day this law answered null the moment a
 *  unit1 crossed the mouth into the room, and lysa lost the agent's vector exactly where spatial computing begins.
 *  -> null ONLY WHEN THE UNIT1 DOES NOT EXIST (no sample, no seat); else { rise, through, here, pose }:
 *    rise, through: its place in THIS glass's well by the path's own word, as they always were (rise 0 on its wire round her .. 1 at the mouth, where it
 *      fills the glass, FILL_U; through 0 at the mouth .. 1 free of it). here: it is in this glass's well (the old non-null cases, and a leg from
 *      `inside <seat>` straight to his place: its rise over the leg, as inWell reads hers — it leaves through the glass on his command too).
 *    pose: THE CAUSED POSE — { room, glass, shown, as, measured, guess, cause, fresh }:
 *      room: its centre in the path's own room (the sample's p: the cause's own coordinates, foundation 2 — only causes cross the wire), always set when
 *        the sample carries them;
 *      glass: its centre in THIS glass's own axes (local(plane, room)), only when a plane of this glass in the path's room is handed (the rite's record,
 *        or the path's own pose of the glass, through one-law.mjs planeOf): MEASURED coordinates, continuous at the mouth;
 *      shown: where THIS glass shows it (one-law.mjs fold: itself behind the plane — a window, inside the well; its mirror image before it — a mirror,
 *        C-15: the room reflected in the well). The fold is continuous at the plane, so this vector never jumps at the mouth;
 *      measured: the place came through a handed plane; else a DECLARED GUESS and `guess` says why (his law: a guessed place is drawn dashed, never
 *        nothing);
 *      cause: { at, to, k } — the leg (or the command's `go`) that causes this pose;
 *      fresh: the cause's age against the TTL when rx_ms and now_ms are handed (null when they are not): a stale pose says so, never stands silently. */
export function chairIn(a, seat, { plane = null, rx_ms = null, now_ms = null } = {}) {
  if (!a || typeof a !== 'object' || typeof seat !== 'string' || !seat) return null;
  const inside = `inside ${seat}`, on = `on ${seat}'s glass`, k = num(a.k) ? Math.max(0, Math.min(1, a.k)) : 0;
  let rise = 1, through = 1, here = false;
  if (a.at === inside && a.to === on) { rise = k; through = 0; here = true; }
  else if (a.at === on && a.to === inside) { rise = 1 - k; through = 0; here = true; }
  else if (a.at === inside && (a.to == null || a.to === inside)) { rise = 0; through = 0; here = true; }
  else if (a.at === inside && typeof a.to === 'string') { rise = k; through = 0; here = true; }   // straight out to a place: its rise over the leg (his command), as hers
  else if (a.at === on && a.to === `out of ${seat}`) { rise = 1; through = k; here = true; }
  else if (a.at === `before ${seat}` && a.to === on) { rise = 1; through = 1 - k; here = true; }
  const room = ok3(a.p) ? [...a.p] : null, pl = plane ? LAW.planeOf(plane) : null, f = pl && room ? foldOf(pl, room) : null;
  return { rise, through, here,
    pose: { room, glass: pl && room ? local(pl, room) : null, shown: f ? local(pl, f.p) : null, as: f ? f.as : null,
      measured: !!(pl && room), guess: pl || !room ? null : 'no plane of this glass in the path\'s room: the path\'s own word alone, a declared guess, drawn dashed',
      cause: { at: a.at ?? null, to: a.to ?? null, k },
      fresh: num(rx_ms) && num(now_ms) ? now_ms - rx_ms >= 0 && now_ms - rx_ms <= EYE_FRESH_MS : null } };
}
/** shownOf(plane, p): where this glass shows a point of the room, in its own axes (metres): the point itself behind the plane (a window, inside the well), its
 *  mirror image before it (C-15: the room reflected in the well), continuous at the plane: chairIn's pose.shown, the road a traveller takes through the mouth
 *  and the road a link's shot takes when it dives into her inside this glass and leaps out (THE LINKS ON HER GLASS, Oct 23 2026). null without a plane or a point. */
const SCX = await loadFold().catch(() => null), FX = SCX ? SCX.raw().W : null, foldOf = (pl, p) => { if (!FX || typeof FX.scene_fold !== 'function') return null; const k = FX.scene_fold(pl.c[0], pl.c[1], pl.c[2], pl.n[0], pl.n[1], pl.n[2], p[0], p[1], p[2]), o = new Float64Array(FX.memory.buffer, FX.scene_fold_out(), 4); return k === 2 ? null : { p: [o[0], o[1], o[2]], d: o[3], as: k ? 'mirror' : 'window' }; };   // THE FIRE (Nov 16 2026): the fold with no eye is the module's (fold_door.rs scene_fold)
/** lookGlass(look, aspect, {fov_deg, d}): A MOVING GLASS, the module's (look_glass.rs scene_look_glass: glassOfLook's own answers on 301 looks): a phone's look -> { plane, eye, forward, fov_deg, aspect }, or null */
export const lookGlass = (look, aspect = 9 / 16, { fov_deg = NaN, d = NaN } = {}) => { const a = look && Array.isArray(look.at) ? look.at : null, f = (v) => (typeof v === 'number' ? v : NaN); if (!a || !FX || typeof FX.scene_look_glass !== 'function' || FX.scene_look_glass(f(a[0]), f(a[1]), f(a[2]), f(look.yaw_deg), f(look.pitch_deg), f(look.roll_deg), f(look.fov_deg), f(fov_deg), f(aspect), f(d)) !== 1) return null;   // holy: input marshaling of the phone's lens to the module's look_glass.rs; no projection here (cast-wasm.mjs glassInFrame's own mark)
  const o = new Float64Array(FX.memory.buffer, FX.scene_look_glass_out(), 22), v = (i) => [o[i], o[i + 1], o[i + 2]]; return { plane: { c: v(0), n: v(3), r: v(6), u: v(9), w: o[12], h: o[13] }, eye: v(14), forward: v(17), fov_deg: o[20], aspect: o[21] }; };   // holy: output marshaling of the module's lens; the module owns the projection
export const shownOf = (pl, p) => { const f = pl && ok3(p) ? foldOf(pl, p) : null; return f ? local(pl, f.p) : null; };
/** standOf(rise, h): her centre's depth and her figure's size in the well for a rise (metres): {depth, across}. */
export function standOf(rise, h) {
  const r = num(rise) ? Math.max(0, Math.min(1, rise)) : 0, e = r * r * (3 - 2 * r);
  return { depth: REST_U * h * (1 - e), across: (BODY_U + (FILL_U - BODY_U) * e) * h };
}

/** placedByPhone(mirror): the Station's record of a glass is a phone's own sighting of its code (its axes carry the lid's lean), not a camera's guess of
 *  a plane and not a hand drag. */
export const placedByPhone = (mirror) => !!mirror && typeof mirror === 'object' && (PHONE.test(String(mirror.method || '')) || PHONE.test(String(mirror.measured || '')));
/** eyeFor({mirror, eye, eye_cm, lock, rx_ms, head, head_rx_ms, now_ms, w, h}): the eye in the glass's own axes and who said it. `mirror` is the Station's
 *  record of this glass (/rite/state scene.dense.mirrors[seat]); `eye` the phone's camera in the Station (the rite's eye record p) received at rx_ms;
 *  `head` HIS MEASURED BODY — the wind's fused body's head (mac-eye.mjs headOf: his shoulders lifted to his eyes) in the Station, received at head_rx_ms.
 *  The phone's eye is taken only through a record a phone's sighting made (its axes carry the hinge) and only while fresh. Then MOTIONCAP ANCHORS THE
 *  DEPTH (his law, Oct 15 2026: the house eye's body stream anchors the mirror's depth, realtime, stale poses must say so): his measured body, fresh
 *  within the same TTL (EYE_FRESH_MS, by the receiver's own clock), through this glass's record — a MEASURE through a phone's own sighting, a DECLARED
 *  GUESS through any other record (a camera's guess of a plane, a hand drag: the head is measured, the bridge is not). Else a head before a laptop, and
 *  `from` says why, his body's word included: never a guess dressed as a measure, never a stale pose standing silently as truth. */
export function eyeFor({ mirror = null, eye = null, eye_cm = null, lock = null, rx_ms = null, head = null, head_rx_ms = null, head_now_ms = null, now_ms = null, w, h } = {}) {   // head_now_ms: his body's word is stamped on the house clock, read against the house instant (the phone's rx against now_ms)
  const byPhone = placedByPhone(mirror), fresh = (t, n = now_ms) => num(t) && num(n) && n - t >= 0 && n - t <= EYE_FRESH_MS;
  // THE MIRROR EYE RECORD (Oct 12 2026 23:1x WEST): lysa's page keeps the record the hull's answer carries (lib/mirror-eyes.mjs mirror.eye/1): the eye
  // already in THIS glass's own axes, cm from its centre, computed through the Station's record of it; lock 'phone' says it is the phone's own camera
  // (the hull's or nobody's guess of a head is not). Through a record no phone made the centimetres count from a wrong centre: the same gate.
  if (byPhone && fresh(rx_ms) && lock === 'phone' && ok3(eye_cm)) {
    const e = [eye_cm[0] / 100, eye_cm[1] / 100, eye_cm[2] / 100]; if (e[2] >= EYE_MIN_M) return { eye: e, from: 'the phone that placed this glass', measured: true };
  }
  const pl = mirror ? LAW.planeOf(mirror, [w, h]) : null;
  if (byPhone && pl && ok3(eye) && fresh(rx_ms)) {
    const e = local(pl, eye); if (e[2] >= EYE_MIN_M) return { eye: e, from: 'the phone that placed this glass', measured: true };
  }
  if (pl && ok3(head) && fresh(head_rx_ms, head_now_ms ?? now_ms)) {   // MOTIONCAP: his body, measured at capture and fresh; stale it would not be taken, and the degrade says so
    const e = local(pl, head);
    if (e[2] >= EYE_MIN_M) return byPhone
      ? { eye: e, from: 'his measured body (the house eye), through the phone that placed this glass', measured: true, head: true }
      : { eye: e, from: 'his measured body (the house eye) through a record no phone made: a declared guess, drawn as one', measured: false, head: true };
    return { eye: [...EYE_FRONT], from: 'his measured body is not before this glass: a head before a laptop', measured: false };
  }
  const why = !mirror ? 'no record of this glass' : !byPhone ? 'this glass was not placed by a phone' : 'no fresh eye from the phone';
  const body = ok3(head) ? (num(head_rx_ms) ? 'his body\'s word is stale past the TTL' : 'his body\'s word carries no moment') : 'nobody measured before this glass';
  return { eye: [...EYE_FRONT], from: `${why}; ${body}: a head before a laptop`, measured: false };
}
/** roomGuess(held, seat, mirror, carried): on a phone (well.mjs `room`) her place is a MEASURE only when her program was carried into the Station by
 *  a shared glass and the glass she comes out of is a record a phone's own sighting made; any other place is a GUESS, drawn dashed (his law, Oct 11,
 *  the twin: a guessed place is drawn dashed and draggable, never nothing; his Oct 12 23:08 "it loads way too slow now" over her absent from his
 *  phone). His 22:44 "this is wrong" was the council drawn as if measured out of Gorgia's guess of a 49-inch plane for a 14-inch lid. -> what the
 *  guess is, or null when the place is measured. */
/** HER WHERE THE PHONE STANDS HER (Oct 27 2026 17:1x WET; his "replace this red thing with the lyssajudron that is right now inside of lysa", over
 *  DysonLight's AR standing a red name card where Nefertiti landed by the new Mac). standView(look, stand, aspect, {near, body_m}): the picture of her body
 *  at a place the phone's OWN AR names, in the look's own axes: the look and the stand come from the one app at the one instant (its ARKit world, no join,
 *  no record of the Station), so the picture is consistent whatever the room knows of the phone, and the body is the one lysa draws (well.mjs, the one mount
 *  of her body). look: the app's look (lookGlass: yaw, pitch, roll, `at` the lens, fov_deg). stand: { p: [x, y, z] her centre, yaw: she faces
 *  [sin yaw, 0, cos yaw] (the phone's own rule: toward him), across_m: her figure across its lanes (BODY_M when unsaid) }. -> the room view's shape: the eye
 *  in her frame (her centre the origin, r right, u up, n her facing), the lens's basis in it, the near plane's half extents, her {across, depth} (depth
 *  -across / 2: the holder lands her centre on the origin), or { why }. Pure. */
/** THE CANVAS IS HER FOOTPRINT (Oct 27 2026 18:0x WET; his "it is lagging so fucking much, i dont want to compromise on details on the lyssajudron so it's
 *  gotta be figuring out how to shave off clock cycles"): a phone over its camera composited a whole screen of WebGL pixels a frame, three million at pixel
 *  ratio 2, though she covers a few percent of it. Her footprint: the square round her centre of FOOT_R of her figure's width in radius (her twelve on their
 *  wires and her glow inside it), on the picture; the page paints only that square while it is smaller than the page (near, she is the page anyway), through the off-axis frustum of that square alone (the same pixels at the
 *  same ratio: nothing of her is coarser), and moves the canvas there. Behind the lens: no footprint, nothing drawn. */
export const FOOT_R = 1.0;   // the square is twice her width: her twelve on their wires whole; her glow (3.2 of her width at rest, well.mjs glow.scale) is drawn to the square's edge when the canvas is her footprint (its halo ends where its texture does: no edge)
export function standView(look, stand, aspect, { near = 0.01, body_m = LAW.BODY_M, foot_r = FOOT_R } = {}) {
  const g = lookGlass(look, aspect); if (!g) return { why: 'this phone has no place in the room yet' };
  if (!stand || typeof stand !== 'object' || !ok3(stand.p)) return { why: 'the phone stands her nowhere' };
  const yaw = num(stand.yaw) ? stand.yaw : 0, across = num(stand.across_m) && stand.across_m > 0 ? stand.across_m : body_m;
  const n = [Math.sin(yaw), 0, Math.cos(yaw)], u = [0, 1, 0], r = [Math.cos(yaw), 0, -Math.sin(yaw)];   // r x u = n: a right-handed frame she faces out of
  const V = (v) => [LAW.dot(r, v), LAW.dot(u, v), LAW.dot(n, v)];
  const eye = V(LAW.sub(g.eye, stand.p)), y = near * Math.tan(g.fov_deg * Math.PI / 360), x = y * g.aspect;
  const basis = { r: V(g.plane.r), u: V(g.plane.u), n: V(g.plane.n) };
  // her footprint: her centre seen from the lens (camera space: right, up, depth along -n), as a square of the picture in clip units, and the frustum of that square
  const d = [-eye[0], -eye[1], -eye[2]], cz = -LAW.dot(basis.n, d), cx = LAW.dot(basis.r, d), cy = LAW.dot(basis.u, d), rm = across * foot_r;
  let foot = null;
  if (cz > near + rm * 0.5) {
    const ncx = cx / cz * near / x, ncy = cy / cz * near / y, rx = rm / cz * near / x, ry = rm / cz * near / y;   // small-angle: the square's half-width in clip units, each axis
    foot = { cx: ncx, cy: ncy, rx, ry, side_m: 2 * rm, f: { l: (ncx - rx) * x, r: (ncx + rx) * x, b: (ncy - ry) * y, t: (ncy + ry) * y, near } };
  }
  return { ok: true, eye, basis, x, y, across, depth: -across / 2, eye_m: Math.hypot(eye[0], eye[1], eye[2]), fov_deg: g.fov_deg, foot };
}
export function roomGuess(held, seat, mirror, carried) {
  if (!carried) return `no glass shared by her program and the Station's records: her program's own room, a hand placement of ${seat}, dashed`;
  if (held && held === seat && !placedByPhone(mirror)) return `${seat}'s record is not a phone's own sighting (a camera's guess or a hand drag): dashed`;
  return null;
}
/** follow(prev, next, dt_ms, tau_ms): the eye's ease onto its newest word (a first-order lag: the phone speaks ten times a second, the picture thirty). */
export function follow(prev, next, dt_ms, tau_ms = 90) {
  if (!ok3(next)) return ok3(prev) ? [...prev] : null; if (!ok3(prev) || !(dt_ms > 0)) return [...next];
  const a = 1 - Math.exp(-dt_ms / Math.max(1, tau_ms)); return [prev[0] + (next[0] - prev[0]) * a, prev[1] + (next[1] - prev[1]) * a, prev[2] + (next[2] - prev[2]) * a];
}
/** fogOf(h): the dark's density for a glass of height h (three's FogExp2: light left = exp(-(depth * density)^2)): three tenths left at DARK_U. */
/** lit(prev, there, dt_ms): her light in this glass's well, two ramps (his word, Oct 12 2026 04:4x: "show lyssajudron in the very first moments of
 *  the animation while the light is being added to the scene"). `face` is the pale light from the mouth that she herself takes: she is SHOWN from the
 *  first moments (FACE_TAU_MS). `light` is her radiance, the lamps on the walls and the glow: it is ADDED to the scene over seconds (LIGHT_TAU_MS).
 *  A first picture or a handed instant (dt 0) jumps both to where she is: there 1, away 0. */
export const FACE_TAU_MS = 120, LIGHT_TAU_MS = 700;
export function lit(prev, there, dt_ms) {
  const want = there ? 1 : 0, p = prev && typeof prev === 'object' ? prev : {}, l0 = num(p.light) ? p.light : 0, f0 = num(p.face) ? p.face : 0;
  if (!(dt_ms > 0)) return { light: want, face: want };
  const step = (v, tau) => v + (want - v) * (1 - Math.exp(-dt_ms / tau));
  return { light: step(l0, LIGHT_TAU_MS), face: step(f0, FACE_TAU_MS) };
}
export const fogOf = (h) => Math.sqrt(-Math.log(0.3)) / (DARK_U * h);
/** lampsOf(L): the level of the lamps that light the walls: hers while she is in the well, and never below BOX_LIGHT, so the box stands when she is
 *  away. His words, Oct 13 2026 01:4x WEST, over lysa gone black while her tour took her through the Mac and pelino: "why the fuck lysa screen and
 *  pelino screens are black dude? what fucking logic is this and who said it?" Nobody of his said it: the well's first seat (Oct 12 04:1x, on his "the
 *  lyssajudron is irradiating light inside of the well") made her the only light, so the walls went black with her gone. His law is the other way: a
 *  glass never shows nothing (Oct 11; Oct 12 12:3x and 13:3x; 23:08). Her glow, her smoke and her lasers stay hers alone: only the walls keep a light.
 *  A constant: an empty box does not breathe, so it costs nothing at rest. */
export const lampsOf = (L) => Math.max(num(L) ? L : 0, BOX_LIGHT);
/** bandsOf(h): the depths of the gold bands, from the mouth to where the dark has taken all but a hundredth. */
export function bandsOf(h) {
  const step = ROW_U * BAND_ROWS * h, end = Math.sqrt(-Math.log(0.01)) / fogOf(h), out = [];
  for (let d = 0; d <= end && out.length < 64; d += step) out.push(d);
  return out;
}
/** THE WELL RESTS (Oct 14 2026). His law for every screen, "nothing at rest costs anything" (a glass draws only when a cause changes what it shows; no idle
 *  animation), and his ruling of Oct 14 03:0x WEST on a glass's engine: "the best way to save energy is to turn off the game engine when nothing interesting
 *  is happening: NOBODY IS RECORDING, THE SCREEN HAS NOT MOVED DIRECTLY ON THE DEVICE ON WHERE THE ENGINE IS RUNNING FOR A WHILE ... for AMBIANCE we can avoid
 *  having the engine". Until this the well drew PICTURES_PER_S whatever moved: measured at rest on an invented room (no song, nobody out, no hand), 800
 *  pictures in 40 s and every one another picture, its main thread 45 to 47 ms a second on the serving Mac's M4 Max. What moved was ambiance: her
 *  identity on the house clock (her twelve turning on their axes, the thruster's and the eyes' beat, the wires' turn and flash, her face's acting), her
 *  light's attractor idling, the smoke's own wisp and the lasers' grain. restWhy(c) is the well's verdict at the end of a picture: why it draws on, or null
 *  (it rests: no next picture, no timer that draws, the last picture stands until a cause wakes it). The Board's own assumptions (NestBoard.html
 *  ENGINE-REST-CORE): his hand on THIS glass within hand_ms ("for a while", his to change), the anchor (tv1 until the Nest names one) never rests. What is
 *  the well's own: a song on the air (her dance is this glass's show: she dances 30 pictures a second), a cause that moves the picture while it moves (her
 *  path, a unit1's flight, his hand reaching her, her walk and the sand, her light's ramp, the phone's eye, his command's beams, his traces' sparks), and
 *  each settling (the song's fade, her band coming home, her light's flash). A cause that only changes what stands (her light's colour, her paint, a
 *  record, a resize) is one picture and the tail. c (each value, or a function of none read only when nothing before it holds the engine): pictures (drawn
 *  so far), seat, anchor, hand_ago_ms (since his hand last moved on this glass), song ({playing, on}: the word in force, its wakefulness 0..1), light
 *  ({light, face, want}: her two ramps and where they go), house (false until the page keeps the house time), eye (metres between the eye drawn and its word), path, command, travellers, links (a link's shot moves: lane/the-links-on-every-glass), walk, sand, box (her box opening), field,
 *  words (true while each moves), hands (his hands held), band (her council's turn still to come home, radians), weather ({flash, strike}). */
export const REST = Object.freeze({ hand_ms: 20000, tail_ms: 1000, anchor: null, settle: 1e-3, eye_m: 1e-4 });   // anchor: none until the Nest names one (ANY ROOM: no glass of one room never rests in every room)
export function restWhy(c) {
  if (!c || typeof c !== 'object') return 'no verdict asked';
  const v = (x) => (typeof x === 'function' ? x() : x), seat = typeof c.seat === 'string' && c.seat ? c.seat : null, anchor = typeof c.anchor === 'string' && c.anchor ? c.anchor : REST.anchor;
  if (!(num(c.pictures) && c.pictures >= 2)) return 'her first pictures';
  if (!seat) return 'a glass that cannot name its own seat never rests';   // the Board's rule of 04:3x: a misread fails towards the picture
  if (seat === anchor) return 'the anchor never rests';
  if (c.house === false) return 'no house time yet';   // her path is placed on the house clock: until the probe's first answer she is nowhere, and its answer is no line to wake a rest
  if (num(c.hand_ago_ms) && c.hand_ago_ms >= 0 && c.hand_ago_ms < REST.hand_ms) return 'his hand on this glass';
  const song = v(c.song); if (song && (song.playing || (num(song.on) && song.on > 0))) return 'the song';
  const light = v(c.light); if (light && num(light.want) && (Math.abs(light.light - light.want) > REST.settle || Math.abs(light.face - light.want) > REST.settle)) return 'her light comes';
  const eye = v(c.eye); if (num(eye) && eye > REST.eye_m) return 'the eye glides';   // metres between the eye drawn and its word (the phone's, or a head before the glass): a phone held still, or none, holds nothing
  if (v(c.path)) return 'her path moves';
  if (v(c.command)) return 'his command';
  if (v(c.travellers)) return 'a unit1 flies';
  if (v(c.links)) return 'a link flies';   // THE LINKS ON HER GLASS (Oct 23 2026): a shot between two agents moves (one-links-glass.mjs linkMoving: from its leave to its landing)
  const hands = v(c.hands); if (num(hands) && hands > 0) return 'his hand reaches her';
  if (v(c.walk)) return 'her walk';
  if (v(c.sand)) return 'the sand';   // his "keep the old shadow but not... frozen" (Oct 12 19:1x): the held shadow is never a still
  if (v(c.box)) return 'her box opens';   // HER BOX (lane unboxing-in-3d): from his press until it has gone into the dark (her-box.mjs OPEN.gone_ms)
  const band = v(c.band); if (num(band) && Math.abs(band) > REST.settle) return 'her band comes home';
  const wx = v(c.weather); if (wx && ((num(wx.flash) && wx.flash > REST.settle) || (num(wx.strike) && wx.strike > REST.settle))) return 'her light flashes';
  if (v(c.field)) return 'his traces';
  if (v(c.words)) return 'the words';
  return null;
}

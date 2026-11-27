// eye-law.mjs · THE EYE DOOR'S WITNESS (Oct 19 2026): the plain JavaScript of embertide-radio/nexus/src/doors/eye.rs, in the door's own layout (24
// doubles in, 40 out), as music-field/kernel/mirror.mjs is its kernel's and lib/projector-light.mjs is the light door's. No glass runs it: a glass runs
// the module (eye-door.mjs). THE ARITHMETIC IS ONE-LAW.MJS'S OWN, CALLED, NOT COPIED: side, frustum and matrices (the text embertide-scene's cast.rs is
// held to bit for bit, and the Board's bundle carries); this file adds only what the door adds around them: the layout, the plane's check, the view (the
// glass's axes and the eye, one-law's dot) and the gate. So one-law.mjs, cast.rs and the door give the same bits (tests/eye.rs over vectors/eye/vectors.json,
// made from this file; eye-door.test.mjs over the module in V8). Only + - * /: no Math.hypot, no sqrt (V8's and a libm's last bits differ).
// His words: Oct 18 2026 16:02 WEST "the anamorphic ovelray must be coordinated by the WASM NEXUS"; Oct 19 23:1x "is there anything we can make native
// to the WASM Nexus?". The layout, the gate and the verdicts are the door's header's.
import { side, frustum, matrices, dot, NEAR_M, FAR_M, MIN_EYE_M } from './one-law.mjs';

export { NEAR_M, FAR_M, MIN_EYE_M };
export const BASIS_TOL = 1e-4;   // one-law.mjs planeOf's tolerance on a basis
export const IN_N = 24, OUT_N = 40;
export const C = 0, R = 3, U = 6, N = 9, W = 12, H = 13, EYE = 14, NEAR = 17, FAR = 18, RECT = 19, GATE = 23;
export const PROJECTION = 0, VIEW = 16, L = 32, RIGHT = 33, B = 34, T = 35, NEAR_OUT = 36, FAR_OUT = 37, D = 38, VERDICT = 39;
export const ASK = 1, SHELL = 2, PLACED = 4, EYES = 8;
export const OPEN_BODY = 2, OPEN_GLASS = 1, FREE = 0, NO_PLANE = -1, NO_EYE = -2, BEHIND = -3, NO_SCAN = -4, UNPLACED = -5, NO_RECT = -6;
/** the verdict's words (the gate's own, anamorphic-gate.mjs gateOf's why, where it is the gate's) */
export const WHY = Object.freeze({
  [OPEN_BODY]: null, [OPEN_GLASS]: 'His body waits for the cameras.', [FREE]: null,
  [NO_PLANE]: 'the glass has no placed rectangle (a number not finite, no size, or a basis that is not one proper rectangle)',
  [NO_EYE]: 'no eye', [BEHIND]: 'the eye is not before this glass',
  [NO_SCAN]: 'Walk the room with the iPad first: the twin is not anchored in this session.',
  [UNPLACED]: 'Place this glass with the iPad: it is not placed by a measurement.',
  [NO_RECT]: 'the part of the glass does not read',
});

const v3 = (a, i) => [a[i], a[i + 1], a[i + 2]];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const fin = Number.isFinite;
const fin3 = (a) => fin(a[0]) && fin(a[1]) && fin(a[2]);
const abs = (x) => (x < 0 ? -x : x);

function planeReads(i) {
  const c = v3(i, C), r = v3(i, R), u = v3(i, U), n = v3(i, N);
  if (!(fin3(c) && fin3(r) && fin3(u) && fin3(n)) || !(fin(i[W]) && fin(i[H]) && i[W] > 0 && i[H] > 0)) return false;
  const unit = (a) => abs(dot(a, a) - 1) <= 2 * BASIS_TOL;
  return unit(r) && unit(u) && unit(n) && abs(dot(n, r)) <= BASIS_TOL && abs(dot(n, u)) <= BASIS_TOL && abs(dot(r, u)) <= BASIS_TOL && dot(cross(r, u), n) >= 1 - BASIS_TOL;
}
function refuse(out, why) { out.fill(NaN, 0, VERDICT); out[VERDICT] = why; return why; }

/** eyeLaw(i, out): the door. i: 24 numbers (an array or a Float64Array); out: a Float64Array of 40 (made when not given). -> the verdict; out holds the rest. */
export function eyeLaw(i, out = new Float64Array(OUT_N)) {
  if (!planeReads(i)) return refuse(out, NO_PLANE);
  const e = v3(i, EYE);
  if (!fin3(e)) return refuse(out, NO_EYE);
  const rect = { x: i[RECT], y: i[RECT + 1], w: fin(i[RECT + 2]) ? i[RECT + 2] : 1, h: fin(i[RECT + 3]) ? i[RECT + 3] : 1 };   // one-law's frustum reads an unsaid x or y as 0
  if (!(rect.w > 0 && rect.h > 0)) return refuse(out, NO_RECT);
  const g = fin(i[GATE]) && i[GATE] >= 0 && i[GATE] < 16 ? Math.trunc(i[GATE]) : 0;
  if (g & ASK) {
    if (!(g & SHELL)) return refuse(out, NO_SCAN);
    if (!(g & PLACED)) return refuse(out, UNPLACED);
  }
  const pl = { c: v3(i, C), r: v3(i, R), u: v3(i, U), n: v3(i, N), w: i[W], h: i[H] };
  const d = side(pl, e);
  if (!(d > MIN_EYE_M)) return refuse(out, BEHIND);
  const near = fin(i[NEAR]) && i[NEAR] > 0 ? i[NEAR] : d;   // the glass is the near plane when none is said
  const far = fin(i[FAR]) && i[FAR] > near ? i[FAR] : near + FAR_M;
  const fr = frustum(pl, e, { near, far, rect }), M = matrices(fr);   // ONE-LAW.MJS: the edges on the near plane, the projection
  out.set(M.projection, PROJECTION);
  out.set([pl.r[0], pl.u[0], pl.n[0], 0, pl.r[1], pl.u[1], pl.n[1], 0, pl.r[2], pl.u[2], pl.n[2], 0, -dot(pl.r, e), -dot(pl.u, e), -dot(pl.n, e), 1], VIEW);
  out[L] = fr.l; out[RIGHT] = fr.r; out[B] = fr.b; out[T] = fr.t; out[NEAR_OUT] = fr.near; out[FAR_OUT] = fr.far; out[D] = fr.d;
  const verdict = !(g & ASK) ? FREE : g & EYES ? OPEN_BODY : OPEN_GLASS;
  out[VERDICT] = verdict;
  return verdict;
}

/** inOf(plane, eye, {near, far, rect, gate}): a plane as one-law.mjs planeOf gives it ({c, r, u, n, w, h}) and the rest into the door's 24 numbers
 *  (into `into` when given). near and far undefined or null: NaN (the glass is the near plane; near + FAR_M). */
export function inOf(pl, eye, { near = null, far = null, rect = null, gate = 0 } = {}, into = new Float64Array(IN_N)) {
  into.fill(NaN);
  if (pl) { into.set(pl.c, C); into.set(pl.r, R); into.set(pl.u, U); into.set(pl.n, N); into[W] = pl.w; into[H] = pl.h; }
  if (eye) { into[EYE] = eye[0]; into[EYE + 1] = eye[1]; into[EYE + 2] = eye[2]; }
  into[NEAR] = near == null ? NaN : near; into[FAR] = far == null ? NaN : far;
  if (rect) { into[RECT] = fin(rect.x) ? rect.x : NaN; into[RECT + 1] = fin(rect.y) ? rect.y : NaN; into[RECT + 2] = fin(rect.w) ? rect.w : NaN; into[RECT + 3] = fin(rect.h) ? rect.h : NaN; }
  into[GATE] = fin(gate) ? gate : 0;
  return into;
}

// =====================================================================================================================================================
// THE EYE IS CHOSEN BY THE MODULE (Oct 20 2026): the witness of eye.rs's choice door and phone doors, line for line (the header of eye.rs has the layout
// and the priorities; his words there). What stood as a page's rule in three copies (projector-any-eye.mjs eyeNow and seatEyeOf, one.mjs eyeNow with
// phone-eye.mjs createPhoneEye, the-one.mjs headNow) is here once as plain JavaScript, and in the module as the door every glass runs. The transcendentals
// are the module's own (bubble.rs fmath: fixed series over range reductions, the same bits in every engine), a length is sqrt(x*x + y*y + z*z), a round is
// floor(x + 0.5): so the witness and the door give the same bits (tests/eye.rs over vectors/eye/choose.json and phone.json, made from this file).

/** fmath: bubble.rs's deterministic sin, cos, acos, round (the same operations in the same order; no Math.sin, Math.cos, Math.acos, Math.hypot anywhere in the law) */
const PI = Math.PI, PIO2_HI = 1.5707963267948966, PIO2_LO = 6.123233995736766e-17;
const ffloor = Math.floor, fround = (x) => ffloor(x + 0.5), fsqrt = Math.sqrt, fmax = (a, b) => (a > b ? a : b), fmin = (a, b) => (a < b ? a : b);
function sincos(x) {
  if (!Number.isFinite(x)) return [NaN, NaN];
  const n = fround(x * (2 / PI)), r = (x - n * PIO2_HI) - n * PIO2_LO, r2 = r * r;
  let s = 1; for (const d of [342, 272, 210, 156, 110, 72, 42, 20, 6]) s = 1 - r2 / d * s; s = r * s;
  let c = 1; for (const d of [380, 306, 240, 182, 132, 90, 56, 30, 12, 2]) c = 1 - r2 / d * c;
  switch (((n % 4) + 4) % 4) { case 0: return [s, c]; case 1: return [c, -s]; case 2: return [-s, -c]; default: return [-c, s]; }
}
function atanPos(z) {
  if (z > 1) return PIO2_HI - atanPos(1 / z);
  let k = 1; for (let i = 0; i < 2; i++) { z = z / (1 + fsqrt(1 + z * z)); k *= 2; }
  const z2 = z * z, terms = []; let p = z; for (let i = 0; i < 12; i++) { terms.push(p / (2 * i + 1)); p *= z2; }
  let s = 0; for (let i = terms.length - 1; i >= 0; i--) s += i % 2 === 0 ? terms[i] : -terms[i];
  return k * s;
}
function facos(c) { c = c > 1 ? 1 : c < -1 ? -1 : c; if (c === 1) return 0; if (c === -1) return PI; return 2 * atanPos(fsqrt((1 - c) / (1 + c))); }
export const fmath = Object.freeze({ sincos, acos: facos, round: fround, floor: ffloor, sqrt: fsqrt });

export const FACE_TTL_MS = Infinity, HEAD_TTL_MS = 3000, PHONE_FRESH_MS = 1000, CARRY_MAX_MS = 250, PAIR_MS = Object.freeze([20, 1000]), GAP_MS = 250;   // FACE_TTL_MS: THE LAST KNOWN PLACE STANDS (his Oct 20 2026 11:20 WEST: "any device when it goes offline has only last known wasm stated nexus location"; 19:53 "the projection needs to evolve based on ipad position in the room"): a seat's place on the scene is the eye until a newer cause moves it, at any age; no timer rests the wall (eye.rs FACE_TTL_MS; 120 s until Oct 20 21:3x)
export const GRAVITY_DEG = 20, BETTER_DEG = 10, NEAR_POSE_MS = 120, SPEED_MAX = 3, STALE_MS = 10_000, G = 9.80665, SLOTS = 6, ROWS = 1024, SAMPLES_MAX = 1024;
export const EYE_STANDS_MS = STALE_MS;   // THE EYE NEVER TELEPORTS (Oct 26 2026, lane/the-eye-never-teleports; his 18:1x WET "no notion that i am not fucking teleporting... the AR was coming and going"): the window a glass hands the choice door for a phone's eye, in place of PHONE_FRESH_MS: his eye stands until the module forgets a silent phone (STALE_MS), carried CARRY_MAX_MS then held; a still phone is a standing eye, not a lapse, and a glass never jumps to another source while he looks. The rite pushes every eye it takes as a live posed slice (tools/embertide-mesh/lib/eye-live.mjs). PHONE_FRESH_MS stays the IMU road's own second (its tests, the vectors).
export const CH_NOW = 0, CH_PHONE_FRESH = 1, CH_SEAT = 2, CH_SEAT_AT = 3, CH_SEAT_YAW = 6, CH_SEAT_PITCH = 7, CH_SEAT_SIGMA_N = 8, CH_SEAT_SIGMA = 9, CH_SEAT_AT_MS = 12, CH_SEAT_TTL = 13,
  CH_ANCHOR = 14, CH_ANCHOR_AT = 15, CH_HEAD = 18, CH_HEAD_TICK = 19, CH_HEAD_TTL = 20, CH_HEAD_AT = 21, CH_HEAD_CENTER = 24, CH_HEAD_TOP = 27, CH_JOIN = 30, CH_REST = 43, CH_REST_AT = 44,
  CH_ELL_C0 = 47, CH_ELL_E1 = 50, CH_ELL_E2 = 53, CH_ELL_A = 56, CH_ELL_B = 57, CH_ELL_PERIOD = 58, CH_ELL_T0 = 59, CH_PHONE_MASK = 60, CH_IN_N = 61;
export const CO_E = 0, CO_LOOK = 3, CO_FROM = 6, CO_SEAT_AGE = 7, CO_SIGMA = 8, CO_SEAT_WHY = 9, CO_HEAD_WHY = 10, CO_HEAD_AGE = 11, CO_HEAD_UNTIL = 12, CO_HEAD_JOINT = 13,
  CO_PHONE_SLOT = 14, CO_PHONE_AGE = 15, CO_PHONE_IMU = 16, CO_PHONE_AHEAD = 17, CO_PHONE_FIT = 18, CO_PHONE_VEL = 19, CO_PHONE_TURN = 20, CO_PHONE_DEG = 21, CO_OUT_N = 24;
export const FROM_NONE = 0, FROM_PHONE = 1, FROM_SEAT = 2, FROM_ANCHOR = 3, FROM_HEAD = 4, FROM_AT = 5, FROM_ELLIPSE = 6;
export const SEAT_OK = 0, SEAT_NO_PLACE = 1, SEAT_NO_POSITION = 2, SEAT_NO_AT_MS = 3, SEAT_STALE = 4, SEAT_NO_NOW = 5;
export const HEAD_OK = 0, HEAD_NO_BODY = 1, HEAD_NO_NOW = 2, HEAD_AHEAD = 3, HEAD_STALE = 4, HEAD_NO_JOINT = 5;
export const FIT_OK = 0, FIT_REMOVED = 1, FIT_NO_ACCEL = 2, FIT_NOT_GRAVITY = 3, FIT_NO_TURN = 4;
export const VEL_REST = 0, VEL_POSES = 1, VEL_FORCES = 2, VEL_JUMP = 3;
export const PH_SLOT = 0, PH_REMOVED = 1, PH_POSE = 2, PH_POSE_T = 14, PH_N = 15, PH_SAMPLES = 16, PH_ROW = 7, PH_IN_N = PH_SAMPLES + PH_ROW * SAMPLES_MAX;
export const PO_E = 0, PO_SLOT = 3, PO_AGE = 4, PO_IMU = 5, PO_AHEAD = 6, PO_FIT = 7, PO_VEL = 8, PO_TURN = 9, PO_DEG = 10, PO_POSE_T = 11, PO_ROWS = 12, PO_BROKEN = 13, PO_OUT_N = 16;
/** the words of the codes (the hosts say them; the numbers the door hands ride in the text) */
export const FROM_WORD = Object.freeze({ [FROM_NONE]: null, [FROM_PHONE]: 'phone', [FROM_SEAT]: 'seat', [FROM_ANCHOR]: 'anchor', [FROM_HEAD]: 'head', [FROM_AT]: 'at', [FROM_ELLIPSE]: 'ellipse' });
export const TURNS = Object.freeze(['landscape-right', 'identity', 'half-turn', 'landscape-left']);
export const VEL_WORD = Object.freeze({ [VEL_REST]: 'rest', [VEL_POSES]: 'poses', [VEL_FORCES]: 'poses+forces', [VEL_JUMP]: 'rest (a jump)' });
export const seatWhy = (code, age_ms, ttl_ms = FACE_TTL_MS, seat = '') => code === SEAT_OK ? null : code === SEAT_NO_PLACE ? 'no place of this seat on the scene' : code === SEAT_NO_POSITION ? 'the seat\'s place has no position'
  : code === SEAT_NO_AT_MS ? 'the seat\'s place has no at_ms' : code === SEAT_STALE ? `the seat's place is ${Math.round(age_ms / 1000)} s old (live within ${Math.round(ttl_ms / 1000)} s)` : code === SEAT_NO_NOW ? 'no house time to age the seat\'s place by' : `no reader of the scene for ${seat}`;
export const headWhy = (code, age_ms, ttl_ms = HEAD_TTL_MS) => code === HEAD_OK ? null : code === HEAD_NO_BODY ? 'no body of his' : code === HEAD_NO_NOW ? 'no house time to age his head by'
  : code === HEAD_AHEAD ? `his last head is stamped ${Math.round(-age_ms)} ms ahead of the house time` : code === HEAD_STALE ? `his last head is ${Math.round(age_ms)} ms old (the TTL is ${ttl_ms} ms): no anchor` : 'the fold\'s body holds no head';
export const fitWhy = (code, num) => code === FIT_OK ? 'gyro+accel' : code === FIT_REMOVED ? 'the phone took gravity out (units.a): its sign cannot be checked' : code === FIT_NO_ACCEL ? 'no accelerometer in the slice'
  : code === FIT_NOT_GRAVITY ? `the reading at the pose is ${num.toFixed(2)} m/s^2, not gravity` : `no quarter turn of the device's axes holds gravity within ${GRAVITY_DEG} degrees (best ${num.toFixed(1)})`;

const ID3 = () => [[1, 0, 0], [0, 1, 0], [0, 0, 1]], UPV = [0, 1, 0], GRAVITY = [0, -G, 0];
const DEV_TO_CV = Object.freeze([[[0, -1, 0], [-1, 0, 0], [0, 0, -1]], [[1, 0, 0], [0, -1, 0], [0, 0, -1]], [[-1, 0, 0], [0, 1, 0], [0, 0, -1]], [[0, 1, 0], [1, 0, 0], [0, 0, -1]]]);
const add = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]], sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]], scale = (a, s) => [a[0] * s, a[1] * s, a[2] * s];
const norm = (a) => fsqrt(a[0] * a[0] + a[1] * a[1] + a[2] * a[2]);
const app = (M, v) => [M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2], M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2], M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2]];
const mul = (A, B) => A.map((r) => [0, 1, 2].map((j) => r[0] * B[0][j] + r[1] * B[1][j] + r[2] * B[2][j]));
const det = (M) => M[0][0] * (M[1][1] * M[2][2] - M[1][2] * M[2][1]) - M[0][1] * (M[1][0] * M[2][2] - M[1][2] * M[2][0]) + M[0][2] * (M[1][0] * M[2][1] - M[1][1] * M[2][0]);
const deg = (a, b) => { const n = norm(a) * norm(b); return n > 0 ? facos(fmax(-1, fmin(1, (a[0] * b[0] + a[1] * b[1] + a[2] * b[2]) / n))) * 180 / PI : 180; };
/** expR(w): Rodrigues, the module's sincos */
export function expR(w) {
  const th = norm(w); if (th < 1e-12) return ID3();
  const k = scale(w, 1 / th), [s, c] = sincos(th), v = 1 - c, [x, y, z] = k;
  return [[c + x * x * v, x * y * v - z * s, x * z * v + y * s], [y * x * v + z * s, c + y * y * v, y * z * v - x * s], [z * x * v - y * s, z * y * v + x * s, c + z * z * v]];
}
/** devToCv(map): the matrix with cv = M d, by the turn's name or index */
export const devToCv = (map) => { const k = typeof map === 'number' ? map : TURNS.indexOf(map); return k >= 0 ? DEV_TO_CV[k].map((r) => r.slice()) : null; };

function gravityFit(R, samples, t, removed) {
  if (removed) return { fit: false, map: 0, sign: 1, deg: NaN, why: FIT_REMOVED, num: NaN };
  let near = samples.filter((s) => s.a && Math.abs(s.t - t) <= NEAR_POSE_MS);
  if (!near.length) { let best = null; for (const s of samples) if (s.a && (!best || Math.abs(s.t - t) < Math.abs(best.t - t))) best = s; if (best) near = [best]; }
  if (!near.length) return { fit: false, map: 0, sign: 1, deg: NaN, why: FIT_NO_ACCEL, num: NaN };
  let sum = [0, 0, 0]; for (const s of near) sum = add(sum, s.a); const m = scale(sum, 1 / near.length), g = norm(m);
  if (!(g > 0.75 * G && g < 1.25 * G)) return { fit: false, map: 0, sign: 1, deg: NaN, why: FIT_NOT_GRAVITY, num: g };
  const fits = [];
  for (let k = 0; k < 4; k++) { const up = app(R, app(DEV_TO_CV[k], m)); fits.push({ map: k, sign: 1, deg: deg(up, UPV) }, { map: k, sign: -1, deg: deg(scale(up, -1), UPV) }); }
  const prior = fits[1].deg < fits[0].deg ? fits[1] : fits[0]; let best = fits[0]; for (let k = 1; k < 8; k++) if (fits[k].deg < best.deg) best = fits[k];
  const pick = prior.deg <= GRAVITY_DEG && !(best.map !== prior.map && best.deg + BETTER_DEG < prior.deg) ? prior : best.deg <= GRAVITY_DEG ? best : null;
  return pick ? { fit: true, map: pick.map, sign: pick.sign, deg: fround(pick.deg * 10) / 10, why: FIT_OK, num: NaN } : { fit: false, map: 0, sign: 1, deg: NaN, why: FIT_NO_TURN, num: best.deg };
}
const noRun = () => ({ used: false, anchor_t: 0, anchor_p: [0, 0, 0], anchor_v: [0, 0, 0], fit: false, map: 0, sign: 1, fit_deg: NaN, fit_why: FIT_OK, fit_num: NaN, vel: VEL_REST, broken: false, last_t: 0, last_p: [0, 0, 0], last_v: [0, 0, 0], last_r: ID3(), last_a: null, rows: [] });

/** createPhoneLaw(): the phone doors' witness, its runs in its own slots: take(i) over PH_IN's layout -> the door's code; at(T, fresh_ms, o) -> 1 (o filled) or 0;
 *  run(slot, o) -> 1 or 0. */
export function createPhoneLaw() {
  const runs = Array.from({ length: SLOTS }, noRun);
  function carry(run, samples, until) {
    if (!run.fit) return;
    for (const s of samples) {
      if (s.t <= run.last_t) continue; if (s.t > until) break;
      if (!s.a) { run.broken = true; break; }
      if (s.t - run.last_t > GAP_MS) { run.broken = true; break; }
      const dt = (s.t - run.last_t) / 1000;
      run.last_r = mul(run.last_r, expR(scale(s.w, dt)));
      const a = add(app(run.last_r, scale(s.a, run.sign)), GRAVITY), a0 = run.last_a || a;
      const v1 = add(run.last_v, scale(add(a0, a), dt / 2));
      run.last_p = add(run.last_p, scale(add(run.last_v, v1), dt / 2)); run.last_v = v1; run.last_a = a; run.last_t = s.t;
      if (run.rows.length < ROWS) run.rows.push({ t: s.t, p: run.last_p, a });
    }
  }
  return {
    take(i) {
      const slot = i[PH_SLOT]; if (!(slot >= 0 && slot < SLOTS)) return -2;
      const q = Array.from(i.slice(PH_POSE, PH_POSE + 12)), pose_t = i[PH_POSE_T];
      if (q.some((x) => !Number.isFinite(x)) || !Number.isFinite(pose_t)) return 0;
      const R = [[q[0], q[1], q[2]], [q[3], q[4], q[5]], [q[6], q[7], q[8]]].map((r) => r.map((v) => v / 1e6));
      if (!(Math.abs(det(R) - 1) < 0.05) || R.some((r) => Math.abs(norm(r) - 1) > 0.05)) return -1;
      const p = [q[9] / 1000, q[10] / 1000, q[11] / 1000];
      const n = i[PH_N]; if (!(n >= 0 && n <= SAMPLES_MAX)) return -3;
      const samples = [];
      for (let k = 0; k < n; k++) {
        const o = PH_SAMPLES + k * PH_ROW, t = i[o], gx = i[o + 1], gy = i[o + 2], gz = i[o + 3], ax = i[o + 4], ay = i[o + 5], az = i[o + 6];
        if (!(Number.isFinite(t) && Number.isFinite(gx) && Number.isFinite(gy) && Number.isFinite(gz))) continue;
        samples.push({ t, w: [gx / 1e6, gy / 1e6, gz / 1e6], a: Number.isFinite(ax) && Number.isFinite(ay) && Number.isFinite(az) ? [ax / 1000, ay / 1000, az / 1000] : null });
      }
      const prev = runs[slot].used ? runs[slot] : null;
      if (prev && pose_t <= prev.anchor_t) return 0;
      let v = [0, 0, 0], vel = VEL_REST;
      if (prev && !prev.broken) carry(prev, samples, pose_t);
      if (prev) {
        const T = pose_t - prev.anchor_t;
        if (T >= PAIR_MS[0] && T <= PAIR_MS[1]) {
          v = scale(sub(p, prev.anchor_p), 1000 / T); vel = VEL_POSES;
          if (prev.fit && !prev.broken && prev.rows.length > 0) {
            let I = [0, 0, 0], t0 = prev.anchor_t, any = false;
            for (const b of prev.rows) { if (!(b.t > prev.anchor_t && b.t <= pose_t)) continue; any = true; const ds = (b.t - t0) / 1000; I = add(I, scale(b.a, ((b.t - prev.anchor_t) / 1000) * ds)); t0 = b.t; }
            if (any) { v = add(v, scale(I, 1000 / T)); vel = VEL_FORCES; }
          }
          if (norm(v) > SPEED_MAX) { v = [0, 0, 0]; vel = VEL_JUMP; }
        }
      }
      const f = gravityFit(R, samples, pose_t, i[PH_REMOVED] === 1);
      const run = { ...noRun(), used: true, anchor_t: pose_t, anchor_p: p, anchor_v: v, fit: f.fit, map: f.map, sign: f.sign, fit_deg: f.deg, fit_why: f.why, fit_num: f.num, vel,
        last_t: pose_t, last_p: p, last_v: v, last_r: f.fit ? mul(R, DEV_TO_CV[f.map]) : ID3(), last_a: null, rows: [] };
      runs[slot] = run;
      carry(run, samples, Infinity);
      for (const r of runs) if (r.used && pose_t - r.anchor_t > STALE_MS) r.used = false;
      return 1;
    },
    at(T, fresh_ms, o = new Float64Array(PO_OUT_N), mask = 0xFFFFFFFF) {
      if (!Number.isFinite(T)) return 0;
      let pick = -1;
      for (let k = 0; k < SLOTS; k++) { const r = runs[k]; if (!r.used || ((mask >>> 0) & (1 << k)) === 0) continue; const age = T - r.anchor_t; if (age >= -50 && age <= fresh_ms && (pick < 0 || r.anchor_t > runs[pick].anchor_t)) pick = k; }
      if (pick < 0) return 0;
      o.fill(NaN, 0, PO_OUT_N);
      const run = runs[pick]; let p;
      if (T >= run.last_t) p = add(run.last_p, scale(run.last_v, fmin(T - run.last_t, CARRY_MAX_MS) / 1000));
      else if (T <= run.anchor_t) p = add(run.anchor_p, scale(run.anchor_v, (T - run.anchor_t) / 1000));
      else {
        let i = 0; while (i < run.rows.length && run.rows[i].t < T) i++;
        const b = run.rows[i], a = i ? run.rows[i - 1] : { t: run.anchor_t, p: run.anchor_p }, k = b.t > a.t ? (T - a.t) / (b.t - a.t) : 1;
        p = [a.p[0] + (b.p[0] - a.p[0]) * k, a.p[1] + (b.p[1] - a.p[1]) * k, a.p[2] + (b.p[2] - a.p[2]) * k];
      }
      o[PO_E] = p[0]; o[PO_E + 1] = p[1]; o[PO_E + 2] = p[2]; o[PO_SLOT] = pick;
      o[PO_AGE] = fround(T - run.anchor_t); o[PO_IMU] = fround(fmax(0, fmin(T, run.last_t) - run.anchor_t)); o[PO_AHEAD] = fround(fmax(0, fmin(T - run.last_t, CARRY_MAX_MS)));
      o[PO_FIT] = run.fit_why; o[PO_VEL] = run.vel; o[PO_TURN] = run.fit ? run.map : NaN; o[PO_DEG] = run.fit ? run.fit_deg : run.fit_num;
      o[PO_POSE_T] = run.anchor_t; o[PO_ROWS] = run.rows.length; o[PO_BROKEN] = run.broken ? 1 : 0;
      return 1;
    },
    forget(slot) { if (!(slot >= 0 && slot < SLOTS)) return 0; runs[slot] = noRun(); return 1; },
    run(slot, o = new Float64Array(PO_OUT_N)) {
      if (!(slot >= 0 && slot < SLOTS) || !runs[slot].used) return 0; const run = runs[slot];
      o.fill(NaN, 0, PO_OUT_N); o[PO_SLOT] = slot; o[PO_FIT] = run.fit_why; o[PO_VEL] = run.vel; o[PO_TURN] = run.fit ? run.map : NaN; o[PO_DEG] = run.fit ? run.fit_deg : run.fit_num;
      o[PO_POSE_T] = run.anchor_t; o[PO_ROWS] = run.rows.length; o[PO_BROKEN] = run.broken ? 1 : 0;
      return 1;
    },
  };
}

/** chooseLaw(i, out, phones): THE CHOICE, the door's witness (eye.rs's header: his order since Oct 28 2026, the phone in his hand, his head, a device's last
 *  known place, the anchor, the rest; until then phone, seat, anchor, head, rest). i: CH_IN_N numbers; out: a Float64Array
 *  of CO_OUT_N; phones: createPhoneLaw()'s (or null: no phone). -> FROM. */
export function chooseLaw(i, out = new Float64Array(CO_OUT_N), phones = null) {
  out.fill(NaN);
  const now = i[CH_NOW]; let from = FROM_NONE;
  const done = (f, e) => { out[CO_E] = e[0]; out[CO_E + 1] = e[1]; out[CO_E + 2] = e[2]; out[CO_FROM] = f; return f; };
  if (fin(i[CH_PHONE_FRESH]) && fin(now) && phones) {
    const po = new Float64Array(PO_OUT_N), mask = fin(i[CH_PHONE_MASK]) && i[CH_PHONE_MASK] >= 0 && i[CH_PHONE_MASK] < 4294967296 ? Math.trunc(i[CH_PHONE_MASK]) >>> 0 : 0xFFFFFFFF;
    if (phones.at(now, i[CH_PHONE_FRESH], po, mask) === 1) {
      out[CO_PHONE_SLOT] = po[PO_SLOT]; out[CO_PHONE_AGE] = po[PO_AGE]; out[CO_PHONE_IMU] = po[PO_IMU]; out[CO_PHONE_AHEAD] = po[PO_AHEAD];
      out[CO_PHONE_FIT] = po[PO_FIT]; out[CO_PHONE_VEL] = po[PO_VEL]; out[CO_PHONE_TURN] = po[PO_TURN]; out[CO_PHONE_DEG] = po[PO_DEG];
      return done(FROM_PHONE, [po[PO_E], po[PO_E + 1], po[PO_E + 2]]);
    }
  }
  // HIS HEAD (his order, Oct 28 2026: second, after the phone in his hand; eye.rs)
  if (fin(i[CH_HEAD])) {
    if (i[CH_HEAD] !== 1) out[CO_HEAD_WHY] = HEAD_NO_BODY;
    else if (!fin(now)) out[CO_HEAD_WHY] = HEAD_NO_NOW;
    else {
      const ttl = fin(i[CH_HEAD_TTL]) && i[CH_HEAD_TTL] > 0 ? i[CH_HEAD_TTL] : HEAD_TTL_MS, tick = i[CH_HEAD_TICK], age = now - tick; out[CO_HEAD_AGE] = age;
      if (!(Math.abs(age) < ttl)) out[CO_HEAD_WHY] = age < 0 ? HEAD_AHEAD : HEAD_STALE;
      else {
        let p, joint;
        if (fin3(v3(i, CH_HEAD_AT))) { p = v3(i, CH_HEAD_AT); joint = NaN; }
        else if (fin3(v3(i, CH_HEAD_CENTER))) { const c = v3(i, CH_HEAD_CENTER); p = [c[0] / 1000, c[1] / 1000, c[2] / 1000]; joint = 0; }
        else if (fin3(v3(i, CH_HEAD_TOP))) { const c = v3(i, CH_HEAD_TOP); p = [c[0] / 1000, c[1] / 1000, c[2] / 1000]; joint = 1; }
        else { p = [NaN, NaN, NaN]; joint = NaN; }
        if (!fin3(p)) out[CO_HEAD_WHY] = HEAD_NO_JOINT;
        else {
          out[CO_HEAD_WHY] = HEAD_OK; out[CO_HEAD_UNTIL] = tick + ttl; out[CO_HEAD_JOINT] = joint;
          const j = Array.from(i.slice(CH_JOIN, CH_JOIN + 13));
          const e = j.every(fin) ? (() => { const s = j[12]; return [j[0] * s * p[0] + j[1] * s * p[1] + j[2] * s * p[2] + j[9], j[3] * s * p[0] + j[4] * s * p[1] + j[5] * s * p[2] + j[10], j[6] * s * p[0] + j[7] * s * p[1] + j[8] * s * p[2] + j[11]]; })() : p;
          return done(FROM_HEAD, e);
        }
      }
    }
  }
  // a device's last known place (the seat), then the anchor
  if (fin(i[CH_SEAT])) {
    const at = v3(i, CH_SEAT_AT);
    if (i[CH_SEAT] !== 1) out[CO_SEAT_WHY] = SEAT_NO_PLACE;
    else if (!fin3(at)) out[CO_SEAT_WHY] = SEAT_NO_POSITION;
    else if (!fin(i[CH_SEAT_AT_MS])) out[CO_SEAT_WHY] = SEAT_NO_AT_MS;
    else if (!fin(now)) out[CO_SEAT_WHY] = SEAT_NO_NOW;
    else {
      const ttl = fin(i[CH_SEAT_TTL]) ? i[CH_SEAT_TTL] : FACE_TTL_MS, age = now - i[CH_SEAT_AT_MS]; out[CO_SEAT_AGE] = age;
      if (age > ttl) out[CO_SEAT_WHY] = SEAT_STALE;
      else {
        out[CO_SEAT_WHY] = SEAT_OK;
        if (fin(i[CH_SEAT_YAW])) { const yaw = i[CH_SEAT_YAW], pitch = fin(i[CH_SEAT_PITCH]) ? i[CH_SEAT_PITCH] : 0, [sy, cy] = sincos(yaw), [sp, cp] = sincos(pitch); out[CO_LOOK] = sy * cp; out[CO_LOOK + 1] = sp; out[CO_LOOK + 2] = cy * cp; }
        if (fin(i[CH_SEAT_SIGMA_N])) { const n = Math.trunc(fmin(fmax(i[CH_SEAT_SIGMA_N], 0), 3)); let s = 0; for (let k = 0; k < n; k++) { const x = i[CH_SEAT_SIGMA + k]; if (fin(x) && x > s) s = x; } out[CO_SIGMA] = s; }
        from = FROM_SEAT;
      }
    }
    if (from === FROM_SEAT) return done(from, at);
  }
  if (i[CH_ANCHOR] === 1 && fin3(v3(i, CH_ANCHOR_AT))) return done(FROM_ANCHOR, v3(i, CH_ANCHOR_AT));
  if (i[CH_REST] === 0 && fin3(v3(i, CH_REST_AT))) return done(FROM_AT, v3(i, CH_REST_AT));
  if (i[CH_REST] === 1) {
    const c0 = v3(i, CH_ELL_C0), e1 = v3(i, CH_ELL_E1), e2 = v3(i, CH_ELL_E2), a = i[CH_ELL_A], b = i[CH_ELL_B], period = i[CH_ELL_PERIOD], t0 = i[CH_ELL_T0];
    if (fin3(c0) && fin3(e1) && fin3(e2) && fin(a) && fin(b) && fin(period) && fin(t0) && fin(now)) {
      const phase = ((((now - t0) % period) + period) % period) / period, th = 2 * PI * phase, [s, c] = sincos(th);
      return done(FROM_ELLIPSE, [c0[0] + a * c * e2[0] + b * s * e1[0], c0[1] + a * c * e2[1] + b * s * e1[1], c0[2] + a * c * e2[2] + b * s * e1[2]]);
    }
  }
  out[CO_FROM] = FROM_NONE; return FROM_NONE;
}

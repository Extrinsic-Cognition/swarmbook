// ragdoll.mjs — THE RAGDOLL STEPPER (Oct 15 2026): a Sim's body under gravity, against the lot's own floors and
// walls, emitting the same pose stream the retargeter consumes (retarget.mjs): mocap and ragdoll are two sources of
// one stream. TS4 has no ragdoll engine — Sims are clip-driven skinned meshes — so the pose is computed here, outside
// the game, and prog-drive/1 carries it to the add-on that writes the palette the GPU skins with.
//
// The method is position-based (verlet, then constraints), the cheap half of a rigid-body chain:
//   integrate    v kept implicitly as pos - prev; gravity; a small damping; the root optionally pinned or driven
//   lengths      each bone keeps its rest length (the rig's, sub-millimetre by the arch lane's own standard)
//   limits       a cone a joint: the bone's direction against its rest direction in the parent's frame, clamped.
//                Twist is NOT limited (a cone cannot say "the elbow bends one way"): per-axis limits wait on the
//                per-bone table, punted like the layout. DEFAULT_LIMITS are starting numbers by bone-name pattern,
//                overridable per joint by name.
//   collision    the lot's own architecture: floors as levelled polygons, walls as vertical segments, decoded from
//                the save by ../program/arch (FINDINGS.md: walls and floors verified to 0.67 mm). collisionFromArch
//                reads its arch.json; a proof hands the same shape by hand, so no proof needs the Nest.
//   orientation  each step the world orientation of every joint is recovered top-down (the twist-free swing from the
//                bone's rest direction to its direction, on the parent's orientation), and poseFrame says it back as
//                the node-local quaternions of the stream.
//
// Nothing here reads a clock: step(dt) is told its dt, poseFrame is told its t_ms and seq. Fixed dt, parents first,
// doubles inside; determinism is the wire's business (a cause stamped once, applied at apply_at).
import { qAt, qSet, qMul, qInv, qRotate, swingFromTo, coneClamp } from './rig.mjs';

/** Default cone limits by bone-name pattern (radians), the first match wins; else the fallthrough. Starting numbers. */
export const DEFAULT_LIMITS = [
  [/finger|thumb|pinkie|index|middle|ring/i, 0.5],
  [/toe/i, 0.6],
  [/neck/i, 0.7],
  [/head/i, 0.8],
  [/wrist|hand/i, 0.9],
  [/ankle|foot/i, 1.1],
  [/forearm|elbow|calf|knee/i, 1.9],
  [/root|pelvis/i, Infinity],
  [/.*/, 2.6],
];

/** The collision shape of a decoded lot: arch.json (../program/arch/out/arch.json, world MILLIMETRES) -> metres.
 *  floors[]: {y_mm, quads: [[x, z], ...]}; walls[]: {a: [x, z], b: [x, z], y_mm, height_mm}. Fences count as walls of
 *  their own height when passed with the same fields. */
export function collisionFromArch(arch) {
  const mm = (v) => v / 1000;
  const floors = (arch.floors || []).flatMap((f) => (f.quads || []).map((q) => ({ y: mm(f.y_mm), poly: q.map((p) => [mm(p[0]), mm(p[1])]) })));
  const walls = (arch.walls || []).map((w) => ({ ax: mm(w.a[0]), az: mm(w.a[1]), bx: mm(w.b[0]), bz: mm(w.b[1]), y0: mm(w.y_mm || 0), y1: mm((w.y_mm || 0) + (w.height_mm || 3000)) }));
  return { floors, walls };
}
export function pointInPoly(x, z, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, zi] = poly[i], [xj, zj] = poly[j];
    if (zi > z !== zj > z && x < ((xj - xi) * (z - zi)) / (zj - zi) + xi) inside = !inside;
  }
  return inside;
}

/**
 * A ragdoll of `rig`. opts:
 *   at [x,y,z], yaw      where it starts (its rest pose, stood there)
 *   gravity              m/s², down (default 9.81)
 *   damping              velocity kept per step (default 0.02)
 *   iterations           length/collision passes a step (default 8)
 *   radius               joint radius, m (default 0.07); radii: {name: r} overrides (a head is wider)
 *   limits               {name: radians} overrides; defaultLimit for unmatched names (default: DEFAULT_LIMITS)
 *   collision            {floors, walls} as collisionFromArch returns (default: nothing to hit)
 *   pinRoot              the root joint never moves (a grabbed pelvis)
 *   rootFrame            'frame' (the root's orientation from its first two children, default when they exist) or 'hold'
 */
export function createRagdoll(rig, opts = {}) {
  const JN = rig.joints.length, at = opts.at || [0, 0, 0], yaw = opts.yaw || 0;
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const pos = new Float64Array(JN * 3), prev = new Float64Array(JN * 3);
  for (let j = 0; j < JN; j++) {
    const n = rig.joints[j], x = rig.restPos[n * 3], y = rig.restPos[n * 3 + 1], z = rig.restPos[n * 3 + 2];
    pos.set([at[0] + cy * x + sy * z, at[1] + y, at[2] - sy * x + cy * z], j * 3);
  }
  prev.set(pos);
  const limits = new Float64Array(JN), radius = new Float64Array(JN).fill(opts.radius ?? 0.07);
  for (let j = 0; j < JN; j++) {
    const name = rig.names[j];
    limits[j] = opts.limits && name in opts.limits ? opts.limits[name] : (DEFAULT_LIMITS.find(([re]) => re.test(name)) || [0, 2.6])[1];
    if (opts.defaultLimit != null && !(opts.limits && name in opts.limits) && !DEFAULT_LIMITS.slice(0, -1).some(([re]) => re.test(name))) limits[j] = opts.defaultLimit;
    if (opts.radii && name in opts.radii) radius[j] = opts.radii[name];
  }
  const children = rig.joints.map((_, j) => rig.jparent.map((p, c) => (p === j ? c : -1)).filter((c) => c >= 0));
  const rootFrame = opts.rootFrame || (children[0].length >= 2 ? 'frame' : 'hold');
  const S = {
    rig, JN, pos, prev, limits, radius, children, rootFrame,
    gravity: opts.gravity ?? 9.81, damping: opts.damping ?? 0.02, iterations: opts.iterations ?? 8,
    collision: opts.collision || { floors: [], walls: [] },
    pinRoot: !!opts.pinRoot,
    yaw, at: at.slice(),
    Q: new Float64Array(JN * 4),   // world orientations, kept by orient()
    t: 0,
  };
  for (let j = 0; j < JN; j++) { const n = rig.joints[j], q = qMul(qYaw(yaw), qAt(rig.restQ, n * 4)); qSet(S.Q, j * 4, q); }
  return S;
}
const qYaw = (yaw) => [0, Math.sin(yaw / 2), 0, Math.cos(yaw / 2)];

/** One fixed step. dt is told, never read. */
export function step(S, dt) {
  const { JN, pos, prev } = S, g = -S.gravity * dt * dt, keep = 1 - S.damping;
  for (let j = 0; j < JN; j++) {
    if (j === 0 && S.pinRoot) { prev.set(pos.subarray(0, 3), 0); continue; }
    const o = j * 3, x = pos[o], y = pos[o + 1], z = pos[o + 2];
    pos[o] = x + (x - prev[o]) * keep; pos[o + 1] = y + (y - prev[o + 1]) * keep + g; pos[o + 2] = z + (z - prev[o + 2]) * keep;
    prev[o] = x; prev[o + 1] = y; prev[o + 2] = z;
  }
  for (let k = 0; k < S.iterations; k++) { lengths(S); collide(S); }
  orient(S);       // the limits live here: a clamped bone's joint is put back on the cone
  collide(S);
  S.t += dt;
  return S;
}

function lengths(S) {
  const { JN, pos, rig } = S;
  for (let j = 1; j < JN; j++) {
    const p = rig.jparent[j]; if (p < 0) continue;
    const a = p * 3, b = j * 3, dx = pos[b] - pos[a], dy = pos[b + 1] - pos[a + 1], dz = pos[b + 2] - pos[a + 2];
    const d = Math.hypot(dx, dy, dz); if (d < 1e-12) continue;
    const err = (d - rig.restLen[j]) / d, wp = p === 0 && S.pinRoot ? 0 : 0.5, wj = 1 - wp;
    pos[a] += dx * err * wp; pos[a + 1] += dy * err * wp; pos[a + 2] += dz * err * wp;
    pos[b] -= dx * err * wj; pos[b + 1] -= dy * err * wj; pos[b + 2] -= dz * err * wj;
  }
}

function collide(S) {
  const { JN, pos, prev, radius, collision } = S;
  for (let j = 0; j < JN; j++) {
    const o = j * 3, r = radius[j], x = pos[o], z = pos[o + 2];
    for (const f of collision.floors) {   // the floor wins from above only: a joint below it is the floor below's business
      if (!pointInPoly(x, z, f.poly)) continue;
      if (pos[o + 1] < f.y + r && pos[o + 1] > f.y - 0.5) {
        pos[o + 1] = f.y + r;
        prev[o] = pos[o] - (pos[o] - prev[o]) * 0.5;          // friction: half the tangential step
        prev[o + 2] = pos[o + 2] - (pos[o + 2] - prev[o + 2]) * 0.5;
        prev[o + 1] = pos[o + 1];                              // no bounce
      }
    }
    for (const w of collision.walls) {
      if (pos[o + 1] < w.y0 - r || pos[o + 1] > w.y1 + r) continue;
      const wx = w.bx - w.ax, wz = w.bz - w.az, ll = wx * wx + wz * wz; if (ll < 1e-12) continue;
      const u = Math.max(0, Math.min(1, ((x - w.ax) * wx + (z - w.az) * wz) / ll));
      const cxp = w.ax + u * wx, czp = w.az + u * wz;
      let nx = x - cxp, nz = z - czp; const d = Math.hypot(nx, nz);
      if (d >= r || d < 1e-9) continue;
      nx /= d; nz /= d;
      pos[o] = cxp + nx * r; pos[o + 2] = czp + nz * r;
      const vx = pos[o] - prev[o], vz = pos[o + 2] - prev[o + 2], vn = vx * nx + vz * nz;
      if (vn < 0) { prev[o] += nx * vn; prev[o + 2] += nz * vn; }   // the into-wall part of the velocity is gone
    }
  }
}

/** The bake: world orientations top-down, then every joint re-placed on the FK manifold — a joint's place is its
 *  parent's orientation applied to its rest attachment offset, because the stream carries rotations and rest
 *  translations only: nothing else can cross. The wished positions (the verlet half's, gravity and the walls in them)
 *  steer each joint's swing: a joint is turned, within its cone limit, towards where its children wished to be; with
 *  two or more children a twist about the first child's bone closes on the second. The bake moves prev with pos, so
 *  it lends no velocity. After it, a palette retargeted from poseFrame reproduces every joint's place exactly. */
export function orient(S) {
  const { rig, pos, prev, Q } = S;
  const P0 = Float64Array.from(pos);   // what the verlet half wished
  const stood = qMul(qYaw(S.yaw), qAt(rig.restQ, rig.joints[0] * 4));   // the root's orientation as it was stood
  qSet(Q, 0, S.rootFrame === 'frame' && S.children[0].length >= 2 ? fit(S, 0, S.children[0], P0, stood) : stood);
  for (const j of rig.jorder) {
    if (j === 0) continue;
    const p = rig.jparent[j]; if (p < 0) continue;
    const a = qRotate(qAt(Q, p * 4), qAt(rig.offLocal, j * 3));   // the attachment rides the parent's orientation
    const o = j * 3, pa = p * 3, dx = pos[pa] + a[0] * rig.restLen[j] - pos[o], dy = pos[pa + 1] + a[1] * rig.restLen[j] - pos[o + 1], dz = pos[pa + 2] + a[2] * rig.restLen[j] - pos[o + 2];
    pos[o] += dx; pos[o + 1] += dy; pos[o + 2] += dz; prev[o] += dx; prev[o + 1] += dy; prev[o + 2] += dz;
    const carried = qMul(qAt(Q, p * 4), qAt(rig.rJointLocal, j * 4));
    qSet(Q, j * 4, S.children[j].length ? fit(S, j, S.children[j], P0, carried) : carried);
  }
  return S;
}
/** A joint's orientation: `carried` (its rest as its parent now carries it) swung towards where its first child
 *  wished to stand, the swing cone-clamped to the joint's limit, then twisted about that bone towards the second
 *  child's wish (twist is not limited: a cone cannot say "the elbow bends one way"). */
function fit(S, j, chj, P0, carried) {
  const { rig, pos } = S;
  const wish = (c) => { const d = [P0[c * 3] - pos[j * 3], P0[c * 3 + 1] - pos[j * 3 + 1], P0[c * 3 + 2] - pos[j * 3 + 2]], l = Math.hypot(...d); return l < 1e-12 ? null : [d[0] / l, d[1] / l, d[2] / l]; };
  const ride = (q, c) => qRotate(q, qAt(rig.offLocal, c * 3));
  const w1 = wish(chj[0]);
  if (!w1) return carried;
  const center = ride(carried, chj[0]), clamped = coneClamp(center, w1, S.limits[j]);
  let q = qMul(swingFromTo(center, clamped), carried);
  if (chj.length >= 2) {
    const w2 = wish(chj[1]);
    if (w2) {
      const a1 = ride(q, chj[0]);
      const perp = (v) => { const d = v[0] * a1[0] + v[1] * a1[1] + v[2] * a1[2]; return [v[0] - a1[0] * d, v[1] - a1[1] * d, v[2] - a1[2] * d]; };
      const u = perp(ride(q, chj[1])), v = perp(w2), lu = Math.hypot(...u), lv = Math.hypot(...v);
      if (lu > 1e-9 && lv > 1e-9) {
        const cr = (u[1] * v[2] - u[2] * v[1]) * a1[0] + (u[2] * v[0] - u[0] * v[2]) * a1[1] + (u[0] * v[1] - u[1] * v[0]) * a1[2];
        const ang = Math.atan2(cr / (lu * lv), Math.max(-1, Math.min(1, (u[0] * v[0] + u[1] * v[1] + u[2] * v[2]) / (lu * lv))));
        q = qMul([a1[0] * Math.sin(ang / 2), a1[1] * Math.sin(ang / 2), a1[2] * Math.sin(ang / 2), Math.cos(ang / 2)], q);
      }
    }
  }
  return q;
}

/** The stepper's state as one line of the pose stream: the retargeter consumes it unchanged. `t_ms` and `seq` are
 *  told (the driver's cause); `sim` says who this body is. The stream carries rotations and the root, never a bone's
 *  translation, so the root is placed where the rig's root joint lands exactly: root = pos[root] - R_yaw . rest of the
 *  root joint. The quaternions are node-local, the stream's own convention: a joint's orientation in the Sim's own
 *  space folded back through its node-parent's (rest for the non-joint nodes: rig.betweenQ), so the retargeter's
 *  forward kinematics with rest translations reproduces every joint's place exactly while bone lengths hold. */
export function poseFrame(S, { t_ms, seq, sim }) {
  const { rig, JN, pos, Q } = S;
  const fwd = qRotate(qAt(Q, 0), [0, 0, 1]), yaw = Math.atan2(fwd[0], fwd[2]);
  const qy = qInv([0, Math.sin(yaw / 2), 0, Math.cos(yaw / 2)]);
  const M = [];   // each joint's orientation in the Sim's own space
  const joints = {};
  for (const j of rig.jorder) {
    M[j] = qMul(qy, qAt(Q, j * 4));
    const p = rig.jparent[j];
    const local = p >= 0 ? qMul(qInv(qMul(M[p], qAt(rig.betweenQ, j * 4))), M[j]) : qMul(qInv(qAt(rig.betweenQ, j * 4)), M[j]);
    const l = Math.hypot(...local) || 1;
    joints[rig.names[j]] = [local[0] / l, local[1] / l, local[2] / l, local[3] / l];
  }
  const rn = rig.joints[0] * 3, rest0 = [rig.restPos[rn], rig.restPos[rn + 1], rig.restPos[rn + 2]], off = qRotate(qInv(qy), rest0);
  return { t_ms, seq, sim: String(sim), root: [pos[0] - off[0], pos[1] - off[1], pos[2] - off[2]], yaw, joints };
}

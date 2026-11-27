// fight-fall.mjs: SEIYA FELLED, HIS OWN RIG GIVEN TO THE HOUSE'S RAGDOLL (lane fight-lyssa-seiya, Oct 18 2026). His word, Sept 15 2026: "THIS IS
// WHY I WANT RAGDOLL". The brief's law: his fall at the end goes to games/sims4-nest/program-drive/ragdoll.mjs (a position-based stepper: verlet,
// then the bones' rest lengths, cone limits a joint, the floor) taken over Seiya's 60-joint rig, rest lengths from the glb (rig.mjs rigFromGlb reads
// the skin and the nodes' rest, which this glb stores at the stance, clip 00's first key). lab/ragdoll.mjs and lab/rig.mjs are those two
// files, and games/sims4-nest/program-drive keeps links to them (THE FALL IS INSIDE THE DOOR, Oct 24 2026): the rite's intro door serves a file only
// when its real path is inside the intro folder (a link out is a 404), so until then the page ran on aiolos and never through the rite; a link
// still keeps one copy of the code (fight-served.test.mjs walks the page's imports).
// THE FALL: it starts from his pose at the instant her arrow lands (every joint's place and turn, read off three's bones by the page, or by the
// test), each joint pushed away from her, the higher the harder (he topples about his feet), and steps at a fixed dt from there. Nothing here reads a
// clock: the page asks for the frame of an instant, the steps are counted from the fall. Every glass that hands the same pose gets the same fall.
// COST: 60 joints, 8 passes a step, 120 steps a second of fall: about 3 ms of JS for a 2.4 s fall on the new Mac, once; then a lookup a frame.
import { createRagdoll, step } from './ragdoll.mjs';
import { rigFromGlb } from './rig.mjs';

export const FALL = Object.freeze({
  dt: 1 / 120,              // code constant: the stepper's fixed step
  seconds: 4.8,             // code constant: the fall is stepped for two bars of the fight (the plan's end is two bars after it)
  push: 3.0, up: 1.4,       // code constants: m/s at the top of his head, away from her and up (a joint at height h gets (h/H)^2 of the push, h/H of the lift)
  gravity: 9.81, damping: 0.02, iterations: 8,   // ragdoll.mjs's own defaults
});
// cone limits by his joint names (radians): starting numbers in the manner of ragdoll.mjs DEFAULT_LIMITS (by eye, not measured); the waist is the
// ragdoll's root here and turns freely, as DEFAULT_LIMITS's root and pelvis do
export const LIMITS = Object.freeze([
  [/_waist$/, Infinity], [/_(l|r)lleg$/, 1.9], [/_(l|r)larm$/, 1.9], [/_(u|l)body$/, 0.7], [/_head$/, 0.8], [/_(l|r)(foot)$/, 1.1], [/_(l|r)toe$/, 0.6],
  [/_(l|r)hand$/, 0.9], [/tip\d$/, 0.5], [/hair\d+$/, 0.5], [/mouth|tooth/, 0.15], [/^h_ik_/, 0.3], [/_opt\d$/, 0.6],
]);
// THE BODY the ragdoll steps: his 18 structural joints, the waist its root. The others (15 hair joints with no keys in any clip, the six of the face,
// the 14 finger tips, the two shoulder plates opt1 and opt2, the four ik nodes) ride their parents as the fall began: a leaf of no weight that the
// stepper turned its parent towards (the head's first child is hair1) walked the lying body 3.3 m in 4 s on the first try.
// The legs come before the lower body: the stepper turns a joint towards its FIRST child, and lbody sits on the waist itself (0 m from it, its
// rest translation is zero), so with lbody first the waist's turn was undefined and held at its rest, upright, while the body lay on the floor.
export const BODY = Object.freeze(['h_jnt_waist', 'h_jnt_luleg', 'h_jnt_ruleg', 'h_jnt_lbody', 'h_jnt_ubody', 'h_jnt_head', 'h_jnt_llleg', 'h_jnt_rlleg',
  'h_jnt_lfoot', 'h_jnt_rfoot', 'h_jnt_ltoe', 'h_jnt_rtoe', 'h_jnt_luarm', 'h_jnt_ruarm', 'h_jnt_llarm', 'h_jnt_rlarm', 'h_jnt_lhand', 'h_jnt_rhand']);
// joint radii (metres, by eye from the model at 1.65 m): what touches the floor first
export const RADII = Object.freeze([[/_head$/, 0.11], [/_ubody$/, 0.14], [/_(lbody|waist)$/, 0.12], [/_(l|r)uleg$/, 0.09], [/_(l|r)lleg$/, 0.07],
  [/_(l|r)uarm$/, 0.07], [/_(l|r)larm$/, 0.05], [/_(l|r)hand$/, 0.05], [/_(l|r)(foot|toe)$/, 0.05], [/tip\d$|hair\d+$|mouth|tooth|^h_ik_|_opt\d$/, 0.02]]);

/** glbBuffer(bytes): the glb's bytes with the three calls of Node's Buffer that rig.mjs makes (readUInt32LE, subarray, toString('utf8')). */
export class GlbBytes extends Uint8Array {
  readUInt32LE(o) { return new DataView(this.buffer, this.byteOffset, this.byteLength).getUint32(o, true); }
  toString(enc) { return enc === 'utf8' ? new TextDecoder().decode(this) : super.toString(); }
}
export const glbBuffer = (bytes) => new GlbBytes(bytes.buffer, bytes.byteOffset, bytes.byteLength);

/** metreGlb(bytes): the same glb with the root's scale (0.0958 m a game unit) folded into every translation and every node's scale set to 1:
 *  rig.mjs takes a node's world rotation from its matrix as if it were unscaled (matQuat), so its rest rotations and lengths are exact only
 *  then. The waist's own scale (0.99998) is dropped with them: 2e-5 of a length. Returns {bytes, scale, root} (the root's rest rotation). */
export function metreGlb(bytes) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), dv = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
  const jl = dv.getUint32(12, true), J = JSON.parse(new TextDecoder().decode(u8.subarray(20, 20 + jl))), bin = u8.subarray(20 + jl);
  const roots = J.scenes[J.scene || 0].nodes.filter((k) => J.nodes[k].children), root = roots[0], s = J.nodes[root].scale ? J.nodes[root].scale[0] : 1;
  J.nodes.forEach((n, k) => { if (k !== root && n.translation) n.translation = n.translation.map((v) => v * s); if (n.scale) n.scale = [1, 1, 1]; });
  let text = new TextEncoder().encode(JSON.stringify(J)); const pad = (4 - (text.length % 4)) % 4;
  const json = new Uint8Array(text.length + pad).fill(0x20); json.set(text);
  const out = new Uint8Array(12 + 8 + json.length + bin.length), o = new DataView(out.buffer);
  o.setUint32(0, 0x46546c67, true); o.setUint32(4, 2, true); o.setUint32(8, out.length, true); o.setUint32(12, json.length, true); o.setUint32(16, 0x4e4f534a, true);
  out.set(json, 20); out.set(bin, 20 + json.length);
  return { bytes: new GlbBytes(out.buffer), scale: s, rootName: J.nodes[root].name, rootQ: J.nodes[root].rotation || [0, 0, 0, 1] };
}
/** fallRig(bytes): his BODY's rig from the glb (rig.mjs over metreGlb), rooted at his waist (the glb's root joint is the placement on the floor with the
 *  waist its one child: ragdoll.mjs holds a root of one child upright, and a body held upright at the floor cannot fall), with the limits and radii above. */
export function fallRig(bytes) {
  const m = metreGlb(bytes), R = rigFromGlb(m.bytes), w = R.names.indexOf('h_jnt_waist');
  if (w !== 1 || R.jparent[w] !== 0) throw new Error('fallRig: the waist is not the root joint\'s first child');
  const pickJ = BODY.map((n) => R.names.indexOf(n));
  if (pickJ.some((j) => j < 0)) throw new Error('fallRig: a joint of BODY is not in the glb');
  const at = new Map(pickJ.map((j, i) => [j, i])), take = (a, n) => { const out = new a.constructor(pickJ.length * n); pickJ.forEach((j, i) => out.set(a.subarray(j * n, j * n + n), i * n)); return out; };
  const jparent = pickJ.map((j) => (j === w ? -1 : at.get(R.jparent[j])));
  if (jparent.some((p, i) => i > 0 && p === undefined)) throw new Error('fallRig: a joint of BODY hangs from one that is not in BODY');
  const names = BODY.slice(), joints = pickJ.map((j) => R.joints[j]);
  const rig = { N: R.N, parent: R.parent, rest: R.rest, order: R.order, restPos: R.restPos, restQ: R.restQ, joints, names, jparent,
    jointByName: new Map(names.map((n, j) => [n, j])), ibm: take(R.ibm, 16), restLen: take(R.restLen, 1), offLocal: take(R.offLocal, 3),
    rJointLocal: take(R.rJointLocal, 4), betweenQ: take(R.betweenQ, 4) };
  const wn = joints[0];
  rig.restLen[0] = 0; rig.offLocal.set([0, 0, 0], 0); rig.rJointLocal.set(Array.from(R.restQ.subarray(wn * 4, wn * 4 + 4)), 0);
  const depth = (j) => { let d = 0, p = jparent[j]; while (p >= 0) { d++; p = jparent[p]; } return d; };
  rig.jorder = joints.map((_, j) => j).sort((a, b) => depth(a) - depth(b));
  const pick = (table, name, d) => (table.find(([re]) => re.test(name)) || [0, d])[1];
  rig.fallLimits = Object.fromEntries(names.map((n) => [n, pick(LIMITS, n, 2.6)]));
  rig.fallRadii = Object.fromEntries(names.map((n) => [n, pick(RADII, n, 0.06)]));
  rig.metre = { scale: m.scale, rootName: m.rootName, rootQ: m.rootQ, waistT: Array.from(R.rest.subarray(wn * 10, wn * 10 + 3)) };
  return rig;
}

/** fallOf(rig, pose, {dir, seconds}): the whole fall, stepped once. pose: {pos: [[x,y,z] per joint of fallRig's order (the waist first)], q: [[x,y,z,w]
 *  per joint, world]}; dir: the direction away from her (radians, as the plan's yaw: x = sin, z = cos). Returns {dt, n, pos: Float64Array(n*J*3),
 *  q: Float64Array(n*J*4)}: frame i is i*dt after her arrow landed. */
export function fallOf(rig, pose, { dir = 0, seconds = FALL.seconds } = {}) {
  const J = rig.joints.length, n = Math.round(seconds / FALL.dt) + 1;
  const S = createRagdoll(rig, { gravity: FALL.gravity, damping: FALL.damping, iterations: FALL.iterations, limits: rig.fallLimits, radii: rig.fallRadii,
    collision: { floors: [{ y: 0, poly: [[-50, -50], [50, -50], [50, 50], [-50, 50]] }], walls: [] } });
  let top = 0; for (let j = 0; j < J; j++) top = Math.max(top, pose.pos[j][1]);
  const H = Math.max(top, 1e-3), dx = Math.sin(dir), dz = Math.cos(dir);
  for (let j = 0; j < J; j++) {
    const p = pose.pos[j], h = Math.max(0, p[1]) / H, v = [dx * FALL.push * h * h, FALL.up * h, dz * FALL.push * h * h];
    S.pos.set(p, j * 3); S.prev.set([p[0] - v[0] * FALL.dt, p[1] - v[1] * FALL.dt, p[2] - v[2] * FALL.dt], j * 3);
    S.Q.set(pose.q[j], j * 4);
  }
  const pos = new Float64Array(n * J * 3), q = new Float64Array(n * J * 4);
  pos.set(S.pos, 0); q.set(S.Q, 0);
  for (let i = 1; i < n; i++) { step(S, FALL.dt); pos.set(S.pos, i * J * 3); q.set(S.Q, i * J * 4); }
  return { dt: FALL.dt, n, J, pos, q, names: rig.names.slice(), jparent: Array.from(rig.jparent) };
}
/** fallFrame(fall, t_ms): the frame index of an instant after the fall began (held at the last). */
export const fallFrame = (fall, t_ms) => Math.max(0, Math.min(fall.n - 1, Math.floor(t_ms / 1000 / fall.dt + 1e-9)));

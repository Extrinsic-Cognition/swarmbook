// rig.mjs — THE HOUSE RIG IN MEMORY, for the program drive (Oct 15 2026). The same rig the seam's stand-in poses
// (../program-seam/prog-synth.mjs rigOf, distilled to what a drive needs): the rig on the Nest (world/sims4/bodies
// defs.rig, the program glb: 165 joints), its rest pose, its tree, its inverse bind matrices. Joints are numbered by
// the rig, as prog/1 numbers them; the hash's first 8 bytes ride every word of prog-drive/1 as they do on prog/1.
//
// What a drive needs of it:
//   N, parent, rest (t x y z, q x y z w, s x y z per node), order (parents first)   the forward kinematics
//   joints (node indices), names, jointByName, jparent (the nearest ancestor that is a joint, -1: none)
//   ibm (column-major 4 x 4 a joint, as the glb holds them)                          the skinning matrices
//   restPos (world, per node), restQ (world orientation, per node)                   the ragdoll's rest lengths and frames
//   rJointLocal[j]  the root joint's rest rotation in its joint-parent's frame; offLocal[j] and restLen[j] the rest bone
//                   direction and length in that frame                                                                the ragdoll's cones
//   betweenQ[j]     the rest rotations of the non-joint nodes between a joint's joint-parent and its node parent,
//                   so a world orientation can be said as the node-local quaternion the retargeter consumes
//
// The glb reader is the Board's own convention (NestBoard.html rigParse): a node's local is translation + rotation + scale,
// a quaternion x y z w, matrices column-major. makeChainRig() builds a five-joint rig of known numbers for the proofs,
// so no proof needs the Nest.
export function rigFromGlb(buf) {
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error('not a glb');
  const jl = buf.readUInt32LE(12), J = JSON.parse(buf.subarray(20, 20 + jl).toString('utf8')), bin = buf.subarray(20 + jl + 8);
  const acc = (i) => {
    const a = J.accessors[i], v = J.bufferViews[a.bufferView], n = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4, MAT4: 16 }[a.type];
    const T = { 5126: Float32Array, 5123: Uint16Array, 5125: Uint32Array, 5121: Uint8Array }[a.componentType];
    const at = (v.byteOffset || 0) + (a.byteOffset || 0), stride = v.byteStride || n * T.BYTES_PER_ELEMENT, out = new T(a.count * n);
    const dv = new DataView(bin.buffer, bin.byteOffset + at);
    for (let k = 0; k < a.count; k++) for (let c = 0; c < n; c++) {
      const o = k * stride + c * T.BYTES_PER_ELEMENT;
      out[k * n + c] = T === Float32Array ? dv.getFloat32(o, true) : T === Uint16Array ? dv.getUint16(o, true) : T === Uint32Array ? dv.getUint32(o, true) : dv.getUint8(o);
    }
    return out;
  };
  const nodes = J.nodes, N = nodes.length, skin = J.skins[0];
  const parent = new Int32Array(N).fill(-1), rest = new Float64Array(N * 10), order = [], seen = new Uint8Array(N);
  nodes.forEach((n, k) => {
    (n.children || []).forEach((c) => { parent[c] = k; });
    const t = n.translation || [0, 0, 0], r = n.rotation || [0, 0, 0, 1], s = n.scale || [1, 1, 1];
    rest.set([t[0], t[1], t[2], r[0], r[1], r[2], r[3], s[0], s[1], s[2]], k * 10);
  });
  (function visit(list) { list.forEach((k) => { if (seen[k]) return; seen[k] = 1; order.push(k); visit(nodes[k].children || []); }); })(nodes.map((n, k) => k).filter((k) => parent[k] < 0));
  const joints = skin.joints.slice(), ibm = new Float32Array(acc(skin.inverseBindMatrices)), jointOf = new Map(joints.map((n, j) => [n, j]));
  const jparent = joints.map((n) => { let p = parent[n]; while (p >= 0 && !jointOf.has(p)) p = parent[p]; return p >= 0 ? jointOf.get(p) : -1; });
  const names = joints.map((n) => nodes[n].name || `node${n}`), jointByName = new Map(names.map((nm, j) => [nm, j]));
  return finishRig({ N, parent, rest, order, joints, ibm, jparent, names, jointByName });
}

// the rest of what a drive needs, from any rig description with the fields above (a glb, or the proofs' chain)
function finishRig(R) {
  const { N, parent, rest, order, joints, jparent } = R;
  const G = new Float64Array(N * 16), M = new Float64Array(16);
  for (const i of order) {
    const b = i * 10;
    quatMat(rest[b + 3], rest[b + 4], rest[b + 5], rest[b + 6], M);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) M[c * 4 + r] *= rest[b + 7 + c];
    M[12] = rest[b]; M[13] = rest[b + 1]; M[14] = rest[b + 2];
    const p = parent[i];
    if (p < 0) G.set(M, i * 16); else matMul(G, p * 16, M, 0, G, i * 16);
  }
  R.restPos = new Float64Array(N * 3); R.restQ = new Float64Array(N * 4);
  for (let i = 0; i < N; i++) {
    R.restPos.set([G[i * 16 + 12], G[i * 16 + 13], G[i * 16 + 14]], i * 3);
    matQuat(G, i * 16, R.restQ, i * 4);
  }
  const JN = joints.length;
  R.restLen = new Float64Array(JN); R.offLocal = new Float64Array(JN * 3); R.rJointLocal = new Float64Array(JN * 4); R.betweenQ = new Float64Array(JN * 4);
  for (let j = 0; j < JN; j++) {
    const n = joints[j], jp = jparent[j];
    if (jp < 0) {
      R.restLen[j] = 0; R.offLocal.set([0, 0, 0], j * 3);
      // the root joint: the chain up to the scene root keeps its rest, so its carried rest is its rest world rotation
      const chain = chainQuat(R, parent[n], -1);   // the rest world orientation of the node parent (nothing above it moves)
      qSet(R.rJointLocal, j * 4, qMul(chain, qAt(R.rest, n * 10 + 3)));   // = restQ[n]
      qSet(R.betweenQ, j * 4, chain);
      continue;
    }
    const pn = joints[jp];
    const dx = R.restPos[n * 3] - R.restPos[pn * 3], dy = R.restPos[n * 3 + 1] - R.restPos[pn * 3 + 1], dz = R.restPos[n * 3 + 2] - R.restPos[pn * 3 + 2];
    R.restLen[j] = Math.hypot(dx, dy, dz);
    const qp = qAt(R.restQ, pn * 4), d = qRotate(qInv(qp), [dx / (R.restLen[j] || 1), dy / (R.restLen[j] || 1), dz / (R.restLen[j] || 1)]);
    R.offLocal.set(d, j * 3);
    // this joint's rest rotation as its joint-parent's chain carries it (the between-nodes' rest and its own local:
    // Q[j] = swing . (Q[jp] . rJointLocal[j]) reproduces restQ[n] at rest), and the between-nodes' rest alone, so a
    // world orientation can be said back as the node-local quaternion the retargeter consumes
    const chain = chainQuat(R, parent[n], pn);
    qSet(R.rJointLocal, j * 4, qMul(chain, qAt(R.rest, n * 10 + 3)));
    qSet(R.betweenQ, j * 4, chain);
  }
  // jorder: the joints parents-first (the skin's own order does not promise it); the ragdoll walks joints in this order
  const depth = (j) => { let d = 0, p = jparent[j]; while (p >= 0) { d++; p = jparent[p]; } return d; };
  R.jorder = joints.map((_, j) => j).sort((a, b) => depth(a) - depth(b));
  return R;
}

// the product of the rest rotations of the non-joint nodes from (and including) node `from`'s own local up to but not
// including the joint node `stop` (-1: no joint above: the product is the node's rest world orientation)
function chainQuat(R, from, stop) {
  const qs = [];
  for (let k = from; k >= 0 && k !== stop; k = R.parent[k]) qs.unshift(qAt(R.rest, k * 10 + 3));
  let q = [0, 0, 0, 1];
  for (const r of qs) q = qMul(q, r);
  return q;
}

/** The proofs' rig: a scene root, then pelvis -> spine -> head and pelvis -> thigh -> calf -> foot, all rest rotations
 *  identity. Numbers chosen so a hand can check them: pelvis (0,1,0), spine (0,1.15,0), head (0,1.55,0),
 *  thigh (0.1,1,0), calf (0.1,0.55,0), foot (0.1,0.15,0). */
export function makeChainRig() {
  const t = { pelvis: [0, 1, 0], spine: [0, 0.15, 0], head: [0, 0.4, 0], thigh: [0.1, 0, 0], calf: [0, -0.45, 0], foot: [0, -0.4, 0] };
  const names = ['root', 'b__Pelvis', 'b__Spine0', 'b__Head', 'b__L_Thigh', 'b__L_Calf', 'b__L_Foot'];
  const parent = new Int32Array([-1, 0, 1, 2, 1, 4, 5]), N = names.length;
  const rest = new Float64Array(N * 10);
  [null, t.pelvis, t.spine, t.head, t.thigh, t.calf, t.foot].forEach((p, k) => rest.set([...(p || [0, 0, 0]), 0, 0, 0, 1, 1, 1, 1], k * 10));
  const order = [0, 1, 2, 3, 4, 5, 6], joints = [1, 2, 3, 4, 5, 6], jparent = [-1, 0, 1, 0, 3, 4];
  const R = finishRig({ N, parent, rest, order, joints, ibm: new Float32Array(joints.length * 16), jparent, names: joints.map((n) => names[n]), jointByName: new Map(joints.map((n, j) => [names[n], j])) });
  for (let j = 0; j < joints.length; j++) {   // rest rotations are identity: the inverse bind is the translation back
    const n = joints[j], b = j * 16;
    R.ibm.set([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, -R.restPos[n * 3], -R.restPos[n * 3 + 1], -R.restPos[n * 3 + 2], 1], b);
  }
  return R;
}

// ---- the arithmetic, doubles, column-major 4 x 4 (the Board's own convention, as prog-synth.mjs poses) ----
export function quatMat(x, y, z, w, M, at = 0) {
  M[at] = 1 - 2 * (y * y + z * z); M[at + 1] = 2 * (x * y + z * w); M[at + 2] = 2 * (x * z - y * w); M[at + 3] = 0;
  M[at + 4] = 2 * (x * y - z * w); M[at + 5] = 1 - 2 * (x * x + z * z); M[at + 6] = 2 * (y * z + x * w); M[at + 7] = 0;
  M[at + 8] = 2 * (x * z + y * w); M[at + 9] = 2 * (y * z - x * w); M[at + 10] = 1 - 2 * (x * x + y * y); M[at + 11] = 0;
  M[at + 12] = 0; M[at + 13] = 0; M[at + 14] = 0; M[at + 15] = 1;
}
export function matMul(A, a, B, b, C, c) {   // C = A . B
  const T = new Float64Array(16);
  for (let col = 0; col < 4; col++) for (let row = 0; row < 4; row++)
    T[col * 4 + row] = A[a + row] * B[b + col * 4] + A[a + 4 + row] * B[b + col * 4 + 1] + A[a + 8 + row] * B[b + col * 4 + 2] + A[a + 12 + row] * B[b + col * 4 + 3];
  for (let k = 0; k < 16; k++) C[c + k] = T[k];
}
export function matQuat(G, at, out, o) {   // the rotation of a column-major 4 x 4 (no shear) as x y z w
  const m = (c, r) => G[at + c * 4 + r], t = m(0, 0) + m(1, 1) + m(2, 2);
  let x, y, z, w;
  if (t > 0) { const s = Math.sqrt(t + 1) * 2; w = s / 4; x = (m(2, 1) - m(1, 2)) / s; y = (m(0, 2) - m(2, 0)) / s; z = (m(1, 0) - m(0, 1)) / s; }
  else if (m(0, 0) > m(1, 1) && m(0, 0) > m(2, 2)) { const s = Math.sqrt(1 + m(0, 0) - m(1, 1) - m(2, 2)) * 2; w = (m(2, 1) - m(1, 2)) / s; x = s / 4; y = (m(0, 1) + m(1, 0)) / s; z = (m(0, 2) + m(2, 0)) / s; }
  else if (m(1, 1) > m(2, 2)) { const s = Math.sqrt(1 + m(1, 1) - m(0, 0) - m(2, 2)) * 2; w = (m(0, 2) - m(2, 0)) / s; x = (m(0, 1) + m(1, 0)) / s; y = s / 4; z = (m(1, 2) + m(2, 1)) / s; }
  else { const s = Math.sqrt(1 + m(2, 2) - m(0, 0) - m(1, 1)) * 2; w = (m(1, 0) - m(0, 1)) / s; x = (m(0, 2) + m(2, 0)) / s; y = (m(1, 2) + m(2, 1)) / s; z = s / 4; }
  const l = Math.hypot(x, y, z, w) || 1;
  out[o] = x / l; out[o + 1] = y / l; out[o + 2] = z / l; out[o + 3] = w / l;
}
export const qAt = (a, o) => [a[o], a[o + 1], a[o + 2], a[o + 3]];
export function qSet(a, o, q) { const l = Math.hypot(q[0], q[1], q[2], q[3]) || 1; a[o] = q[0] / l; a[o + 1] = q[1] / l; a[o + 2] = q[2] / l; a[o + 3] = q[3] / l; }
export function qMul(a, b) {
  return [a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
          a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
          a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
          a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]];
}
export const qInv = (q) => [-q[0], -q[1], -q[2], q[3]];
export function qRotate(q, v) {
  const [x, y, z, w] = q, ux = 2 * (y * v[2] - z * v[1]), uy = 2 * (z * v[0] - x * v[2]), uz = 2 * (x * v[1] - y * v[0]);
  return [v[0] + w * ux + y * uz - z * uy, v[1] + w * uy + z * ux - x * uz, v[2] + w * uz + x * uy - y * ux];
}
/** The twist-free rotation taking unit vector a to unit vector b. */
export function swingFromTo(a, b) {
  const d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  if (d > 0.999999) return [0, 0, 0, 1];
  if (d < -0.999999) {   // opposite: any axis at a right angle
    let ax = Math.abs(a[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const c = [a[1] * ax[2] - a[2] * ax[1], a[2] * ax[0] - a[0] * ax[2], a[0] * ax[1] - a[1] * ax[0]], l = Math.hypot(...c) || 1;
    return [c[0] / l, c[1] / l, c[2] / l, 0];
  }
  const c = [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]], q = [c[0], c[1], c[2], 1 + d], l = Math.hypot(...q) || 1;
  return [q[0] / l, q[1] / l, q[2] / l, q[3] / l];
}
/** Unit vector on the cone: a rotated towards b so the angle is `ang` radians (ang <= the angle between them). */
export function coneClamp(center, dir, ang) {
  const cos = Math.max(-1, Math.min(1, center[0] * dir[0] + center[1] * dir[1] + center[2] * dir[2])), cur = Math.acos(cos);
  if (cur <= ang || cur < 1e-12) return dir;
  const q = swingFromTo(center, dir), axis = [q[0], q[1], q[2]], s = Math.sin(ang / 2), c = Math.cos(ang / 2), l = Math.hypot(...axis) || 1;
  return qRotate([(axis[0] / l) * s, (axis[1] / l) * s, (axis[2] / l) * s, c], center);
}

// origami.mjs: THE ORIGAMI, a unit's dodecahedron as twelve pentagons on hinges, for the hero (app/warm.html) and its rite (rite-unit1s.js).
// His words, Oct 21 2026 WEST, over the swarm of white Goldberg balls and dark flat birds through the cosmos' build-up: "let's think of how it
// begins because we never thoroughly walked through the path of when saint seya starts oscillating hands... i think we should work on what
// the polyhedrons look like because i think there is a dissonance that could also be a feature later which is birds and polyehdrons... you
// get what i mean? please... ponder", then, over the drawing of it (the twelve born from his hands as the dodecahedron's own pentagons, each
// closing into its own dodecahedron; later a dodecahedron opening on its hinges into a bird of the same gold pentagons): "honestly i am
// impressed. thank you. implement and show me".
//
// A dodecahedron is twelve pentagons folded shut. Here it is one net of them, a tree of hinges (TREE: each face's parent, across the edge they
// share). Turned one way every face stacks flat under the root (one pentagon: what a unit is born as, a face peeled off its parent); turned
// back they close into the solid; turned on they open into the bird (BIRD: each hinge's turn as a share of laying it flat): three pentagons a
// wing out of the root's two upper edges, the belly's two folded half shut for a keel, the tail nearly flat, and the two left over tucked
// flat under the right wing, so the bird is the solid's own twelve faces and nothing else. The wings beat on their hinges (FLAP), the root's
// own first, each joint further out a little later, as a wing does. The net is the canonical solid's (SOLID, built below); makeOrigami lays
// it on any regular dodecahedron, the page's own seed, so the solid it closes into is the unit the page draws, corner for corner.
//
// PURE: the geometry is made once per root; a pose is the twelve faces' corners written into one array (poseInto), no allocation, the same
// pose for the same (s, phase) on every glass.
//   import {makeOrigami, poseInto, ORIGAMI} from './origami.mjs';
//   const model = makeOrigami(seedSkin.pents, chair);      // the twelve pentagons, the root the face the unit was peeled off
//   poseInto(out, model, s, phase)   // s: -1 one pentagon, 0 the solid, 1 the bird; phase the wingbeat's radians; out: 12 x 5 x 3 numbers

const PHI = (1 + Math.sqrt(5)) / 2;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; };

// THE CANONICAL SOLID: the dodecahedron's twenty corners (the cube's eight and three golden rectangles), its twelve faces about the
// icosahedron's corners, each listed anticlockwise from outside, turned so face 0 faces +z with its first corner straight up (+y) and scaled
// to a unit circumradius. TREE and its faces' parts (WINGS, BELLY, TAIL, TUCKED) are numbered on it.
export const SOLID = (() => {
  let V = [];
  for (const x of [-1, 1]) for (const y of [-1, 1]) for (const z of [-1, 1]) V.push([x, y, z]);
  for (const a of [-1, 1]) for (const b of [-1, 1]) { V.push([0, a / PHI, b * PHI]); V.push([a / PHI, b * PHI, 0]); V.push([a * PHI, 0, b / PHI]); }
  const N = [];
  for (const a of [-1, 1]) for (const b of [-1, 1]) { N.push(unit([a, 0, b * PHI])); N.push(unit([0, a * PHI, b])); N.push(unit([a * PHI, b, 0])); }
  let faces = N.map((n) => {
    const idx = V.map((v, i) => [dot(v, n), i]).sort((p, q) => q[0] - p[0]).slice(0, 5).map((p) => p[1]);
    const c = idx.reduce((s, i) => [s[0] + V[i][0] / 5, s[1] + V[i][1] / 5, s[2] + V[i][2] / 5], [0, 0, 0]);
    const u = unit(sub(V[idx[0]], c)), w = cross(n, u), angle = (i) => Math.atan2(dot(sub(V[i], c), w), dot(sub(V[i], c), u));
    idx.sort((i, j) => angle(i) - angle(j));
    return {v: idx, n};
  });
  // the root's head: its corner between the wings' roots (faces 6 and 7, by TREE), listed first
  const head = faces[0].v.find((i) => faces[6].v.includes(i) && faces[7].v.includes(i)), at = faces[0].v.indexOf(head);
  faces[0].v = [...faces[0].v.slice(at), ...faces[0].v.slice(0, at)];
  const z = faces[0].n, c0 = faces[0].v.reduce((s, i) => [s[0] + V[i][0] / 5, s[1] + V[i][1] / 5, s[2] + V[i][2] / 5], [0, 0, 0]);
  const y = unit(sub(V[head], c0)), x = cross(y, z), r = Math.hypot(...V[0]);
  V = V.map((p) => [dot(p, x) / r, dot(p, y) / r, dot(p, z) / r]);
  faces = faces.map((f) => Object.freeze({v: Object.freeze(f.v), n: Object.freeze([dot(f.n, x), dot(f.n, y), dot(f.n, z)])}));
  return Object.freeze({verts: Object.freeze(V.map((p) => Object.freeze(p))), faces: Object.freeze(faces)});
})();

// THE NET, on SOLID's faces: face 0 the root (the bird's back, its head the root's top corner); the wings run out of its two upper edges, 6-8-4
// to the left and 7-10-3 to the right, mirror images of each other; the belly's 1 and 5 hang from its lower edges, the tail's 2 from its
// bottom one; 11 and 9, the two the bird has no place for, ride the right wing and fold flat under it.
export const TREE = Object.freeze([-1, 0, 0, 10, 8, 0, 0, 0, 6, 3, 7, 7]);
export const WINGS = Object.freeze([Object.freeze([6, 8, 4]), Object.freeze([7, 10, 3])]);   // left and right, root to tip
export const TUCKED = Object.freeze([9, 11]);
// the bird: each hinge's turn from shut as a share of laying its face flat (1 flat, 0 shut, STACK flat under its parent); the wings' roots lifted
// `dihedral` radians over flat; FLAP: each joint's beat in radians, root to tip, and how far each joint lags the one before (radians of phase)
export const ORIGAMI = Object.freeze({
  bird: Object.freeze({wing: 1, belly: 0.35, tail: 0.75, dihedral: 0.2}),
  flap: Object.freeze({beat: Object.freeze([0.62, 0.34, 0.26]), lag: 0.7}),
  // the birth (s -1 to 0): the root's own hinges first, each ring of the tree `birthStep` later, each turning over `birthOver` of it;
  // the unfolding (s 0 to 1) likewise, the wings beginning to beat from `flapFrom`
  birthStep: 0.12, birthOver: 0.6, unfoldStep: 0.1, unfoldOver: 0.55, flapFrom: 0.5,
});
const BELLY = [1, 5], TAIL = [2];

/** makeOrigami(pents, root): THE NET laid on a regular dodecahedron given as its twelve pentagons ({verts: five [x, y, z] anticlockwise from
 *  outside, normal}), the face `root` its root (the face the unit is peeled off as), unit circumradius. Returns the hinged model poseInto
 *  turns: its corners, each face's parent and hinge (a corner on the shared edge, the edge's direction, the turn that lays the face flat,
 *  which way is up for a wing), the order the tree is walked in, the bird's frame (its back's centre, right, head and up), each face's
 *  centre shut and a face's circumradius (rho). */
export function makeOrigami(pents, root = 0) {
  if (!Array.isArray(pents) || pents.length !== 12 || !(root >= 0 && root < 12)) throw new Error('makeOrigami: twelve pentagons and a root among them');
  const P = pents.map((p) => ({verts: p.verts.map((v) => [v[0], v[1], v[2]]), n: unit(p.normal)}));
  const centre = (f) => P[f].verts.reduce((s, v) => [s[0] + v[0] / 5, s[1] + v[1] / 5, s[2] + v[2] / 5], [0, 0, 0]);
  // the root's frame: up its normal, the head its first corner; SOLID's faces found in it by their normals
  const c0 = centre(root), z = P[root].n, y = unit(sub(P[root].verts[0], c0)), x = cross(y, z);
  const inFrame = (v) => [dot(v, x), dot(v, y), dot(v, z)];
  const map = SOLID.faces.map((f) => P.findIndex((p) => dot(inFrame(p.n), f.n) > 0.999));
  if (new Set(map).size !== 12 || map.includes(-1)) throw new Error('makeOrigami: not a regular dodecahedron');
  const same = (a, b) => Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) < 1e-6;
  const parent = new Array(12).fill(-1), hinge = new Array(12).fill(null), depth = new Array(12).fill(0);
  for (let k = 1; k < 12; k++) parent[map[k]] = map[TREE[k]];
  const order = [root];
  for (let i = 0; i < order.length; i++) for (let f = 0; f < 12; f++) if (parent[f] === order[i]) { order.push(f); depth[f] = depth[order[i]] + 1; }
  if (order.length !== 12) throw new Error('makeOrigami: the net does not reach every face');
  const role = new Array(12).fill('body'), beat = new Array(12).fill(-1);
  WINGS.forEach((wing) => wing.forEach((k, j) => { role[map[k]] = 'wing'; beat[map[k]] = j; }));
  for (const k of BELLY) role[map[k]] = 'belly';
  for (const k of TAIL) role[map[k]] = 'tail';
  for (const k of TUCKED) role[map[k]] = 'tucked';
  for (const f of order.slice(1)) {
    const p = parent[f], shared = P[f].verts.filter((v) => P[p].verts.some((w) => same(v, w)));
    if (shared.length !== 2) throw new Error(`makeOrigami: faces ${f} and ${p} share no edge`);
    const a = shared[0], u = unit(sub(shared[1], a)), flat = Math.PI - Math.acos(-dot(P[f].n, P[p].n));
    // the turn that lays the face on its parent's plane, by the side its normal swings to
    const t = dot(rotate(P[f].n, u, flat), P[p].n) > 0.999 ? flat : -flat;
    // a wing's up: the way its face's centre rises off its parent's outer side when turned on past flat
    const lift = dot(sub(rotateAbout(centre(f), a, u, t + 0.2 * Math.sign(t)), rotateAbout(centre(f), a, u, t)), P[p].n);
    hinge[f] = Object.freeze({a: Object.freeze(a), u: Object.freeze(u), t, stack: -Math.sign(t) * (Math.PI - Math.abs(t)), up: Math.sign(lift) * Math.sign(t) || 1});
  }
  const model = {root, wings: Object.freeze(WINGS.map((wing) => Object.freeze(wing.map((k) => map[k])))), parent: Object.freeze(parent), depth: Object.freeze(depth), order: Object.freeze(order), role: Object.freeze(role), beat: Object.freeze(beat),
    hinge: Object.freeze(hinge), faces: Object.freeze(P.map((p) => Object.freeze(p.verts.map((v) => Object.freeze(v))))), normals: Object.freeze(P.map((p) => Object.freeze(p.n))),
    frame: Object.freeze({o: Object.freeze(c0), x: Object.freeze(x), y: Object.freeze(y), z: Object.freeze(z)}), span: 0, matrices: new Float64Array(12 * 12),
    centres: Object.freeze(P.map((_, f) => Object.freeze(centre(f)))), rho: Math.hypot(...sub(P[root].verts[0], c0))};
  // the bird's half span in its own frame (wings level, no beat): how far its wingtips reach from its back's centre
  const out = new Float64Array(12 * 15);
  poseInto(out, model, 1, null);
  let span = 0;
  for (let i = 0; i < 60; i++) span = Math.max(span, Math.abs(dot(sub([out[i * 3], out[i * 3 + 1], out[i * 3 + 2]], c0), x)));
  model.span = span;
  return model;
}

// Rodrigues: v turned `t` radians about the unit axis u (through the origin), and a point turned about the line through `a`
function rotate(v, u, t) {
  const c = Math.cos(t), s = Math.sin(t), k = dot(u, v) * (1 - c), w = cross(u, v);
  return [v[0] * c + w[0] * s + u[0] * k, v[1] * c + w[1] * s + u[1] * k, v[2] * c + w[2] * s + u[2] * k];
}
function rotateAbout(p, a, u, t) { const r = rotate(sub(p, a), u, t); return [r[0] + a[0], r[1] + a[1], r[2] + a[2]]; }

/** turnAt(model, face, s, phase): the hinge of `face` turned from shut, in radians, at pose s (-1 stacked under its parent, 0 shut, 1 the
 *  bird) and wingbeat phase (radians; null for the wings held level). The root has none. */
export function turnAt(model, face, s, phase = null) {
  const h = model.hinge[face];
  if (!h) return 0;
  const O = ORIGAMI, d = model.depth[face] - 1;
  if (s <= 0) return h.stack * (1 - ease((s + 1 - d * O.birthStep) / O.birthOver));
  const open = ease((s - d * O.unfoldStep) / O.unfoldOver), role = model.role[face];
  if (role === 'tucked') return h.stack * open;
  const share = role === 'wing' ? O.bird.wing : role === 'belly' ? O.bird.belly : O.bird.tail;
  let turn = h.t * share * open;
  if (role === 'wing') {
    const j = model.beat[face], lift = (j === 0 ? O.bird.dihedral : 0) * open;
    const beat = phase === null ? 0 : O.flap.beat[j] * Math.sin(phase - j * O.flap.lag) * ease((s - O.flapFrom) / (1 - O.flapFrom));
    turn += h.up * (lift + beat);
  }
  return turn;
}

/** poseInto(out, model, s, phase): the twelve faces' five corners at pose s and wingbeat phase, face by face and corner by corner as the
 *  model lists them (its faces, anticlockwise from outside), in the solid's own frame, written into out (12 x 5 x 3); returns out. */
export function poseInto(out, model, s, phase = null) {
  const M = model.matrices;   // per face a rigid motion, rows of [r00 r01 r02 tx]
  const r = model.root * 12;
  M[r] = 1; M[r + 1] = 0; M[r + 2] = 0; M[r + 3] = 0; M[r + 4] = 0; M[r + 5] = 1; M[r + 6] = 0; M[r + 7] = 0; M[r + 8] = 0; M[r + 9] = 0; M[r + 10] = 1; M[r + 11] = 0;
  for (let i = 1; i < 12; i++) {
    const f = model.order[i], h = model.hinge[f], t = turnAt(model, f, s, phase), p = model.parent[f] * 12, o = f * 12;
    // the hinge's own motion: turn about the line through a along u
    const [ux, uy, uz] = h.u, c = Math.cos(t), sn = Math.sin(t), k = 1 - c;
    const r00 = c + ux * ux * k, r01 = ux * uy * k - uz * sn, r02 = ux * uz * k + uy * sn;
    const r10 = uy * ux * k + uz * sn, r11 = c + uy * uy * k, r12 = uy * uz * k - ux * sn;
    const r20 = uz * ux * k - uy * sn, r21 = uz * uy * k + ux * sn, r22 = c + uz * uz * k;
    const [ax, ay, az] = h.a, tx = ax - (r00 * ax + r01 * ay + r02 * az), ty = ay - (r10 * ax + r11 * ay + r12 * az), tz = az - (r20 * ax + r21 * ay + r22 * az);
    // composed under its parent's: M_f = M_parent . hinge
    for (let row = 0; row < 3; row++) {
      const q0 = M[p + row * 4], q1 = M[p + row * 4 + 1], q2 = M[p + row * 4 + 2], q3 = M[p + row * 4 + 3];
      M[o + row * 4] = q0 * r00 + q1 * r10 + q2 * r20;
      M[o + row * 4 + 1] = q0 * r01 + q1 * r11 + q2 * r21;
      M[o + row * 4 + 2] = q0 * r02 + q1 * r12 + q2 * r22;
      M[o + row * 4 + 3] = q0 * tx + q1 * ty + q2 * tz + q3;
    }
  }
  for (let f = 0; f < 12; f++) {
    const o = f * 12, face = model.faces[f];
    for (let v = 0; v < 5; v++) {
      const [x, y, z] = face[v], w = (f * 5 + v) * 3;
      out[w] = M[o] * x + M[o + 1] * y + M[o + 2] * z + M[o + 3];
      out[w + 1] = M[o + 4] * x + M[o + 5] * y + M[o + 6] * z + M[o + 7];
      out[w + 2] = M[o + 8] * x + M[o + 9] * y + M[o + 10] * z + M[o + 11];
    }
  }
  return out;
}

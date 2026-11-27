// orb.js: a Goldberg skin, GP(m,n), built fresh from the icosahedron.
// Twelve pentagons at the twelve vertices, 10(T - 1) hexagons between them,
// T = m^2 + mn + n^2. The ladder on chain names the rungs a floor may climb.
// The skin is the portrait of a unit: pentagons are chairs, hexagons are seats.
// Pure geometry and drawing on parchment; no state of the founding lives here.

const PHI = (1 + Math.sqrt(5)) / 2;
const ICO_V = [
  [-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0],
  [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI],
  [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1],
].map(norm);
const ICO_F = [
  [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
  [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
  [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
  [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
];

function norm(v) { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; }
function add(a, b) { return [a[0] + b[0], a[1] + b[1], a[2] + b[2]]; }
function scale(a, s) { return [a[0] * s, a[1] * s, a[2] * s]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
// two points this close are one vertex: a corner reached from two neighbouring triangles
const keyOf = (p) => p.map((x) => Math.round(x * 1e5)).join(',');

// ---- the ladder on chain (program/poleis_treasury/src/lib.rs) ----
export const LADDER = [[1, 0], [1, 1], [2, 0], [3, 0], [2, 2], [4, 0]];
export const ladderT = (m, n) => m * m + m * n + n * n;
export const hexagonsOf = (m, n) => 10 * (ladderT(m, n) - 1);

// a mesh on the unit sphere with shared vertices
function mesh() {
  const verts = [], tris = [], index = new Map();
  const vid = (p) => {
    const k = keyOf(p);
    if (index.has(k)) return index.get(k);
    verts.push(p);
    index.set(k, verts.length - 1);
    return verts.length - 1;
  };
  return { verts, tris, vid };
}
// the class I cut: the triangle (A, B, C) split N ways along each edge, every triangle turning the way (A, B, C) turns
function subdivide(M, A, B, C, N) {
  const grid = [];
  for (let i = 0; i <= N; i++) {
    grid.push([]);
    for (let j = 0; j <= N - i; j++) {
      const w = [(N - i - j) / N, i / N, j / N];
      grid[i].push(M.vid(norm(add(add(scale(A, w[0]), scale(B, w[1])), scale(C, w[2])))));
    }
  }
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < N - i; j++) {
      M.tris.push([grid[i][j], grid[i + 1][j], grid[i][j + 1]]);
      if (j < N - i - 1) M.tris.push([grid[i + 1][j], grid[i + 1][j + 1], grid[i][j + 1]]);
    }
  }
}
// the pentakis dodecahedron: the icosahedron's vertices and its face centres,
// two triangles astride every edge, each turning outward like the faces do
function pentakis(M) {
  const V = ICO_V.map(M.vid);
  const C = ICO_F.map(([a, b, c]) => M.vid(norm(add(add(ICO_V[a], ICO_V[b]), ICO_V[c]))));
  const edges = new Map();
  ICO_F.forEach((f, fi) => {
    for (let k = 0; k < 3; k++) {
      const a = f[k], b = f[(k + 1) % 3];
      const e = a < b ? `${a},${b}` : `${b},${a}`;
      if (!edges.has(e)) edges.set(e, {});
      edges.get(e)[a < b ? 'fwd' : 'bwd'] = fi;
    }
  });
  for (const [e, { fwd, bwd }] of edges) {
    const [a, b] = e.split(',').map(Number);
    M.tris.push([V[a], C[bwd], C[fwd]], [V[b], C[fwd], C[bwd]]);
  }
}

/**
 * The triangulation whose dual is GP(m,n): (N,0) is the class I grid on the
 * icosahedron, (1,1) the pentakis dodecahedron, (n,n) the class I cut of it.
 * Returns { verts: [[x,y,z]] on the unit sphere, tris: [[a,b,c]] } with shared vertices.
 */
export function triangulate(m, n) {
  const M = mesh();
  if (n === 0 && m >= 1) {
    for (const [a, b, c] of ICO_F) subdivide(M, ICO_V[a], ICO_V[b], ICO_V[c], m);
  } else if (m === n && n === 1) {
    pentakis(M);
  } else if (m === n && n > 1) {
    const P = mesh();
    pentakis(P);
    for (const [a, b, c] of P.tris) subdivide(M, P.verts[a], P.verts[b], P.verts[c], n);
  } else {
    throw new RangeError(`GP(${m},${n}) is off the ladder: only (N,0) and (n,n) are built`);
  }
  return { verts: M.verts, tris: M.tris };
}

/**
 * The dual: one face per vertex, its corners the centres of the triangles
 * around it in the order they turn, the twelve at the icosahedron's vertices
 * first as chairs 0..11. Returns [{ verts, center, normal, chair }].
 */
export function dualize({ verts, tris }) {
  const around = verts.map(() => []);
  tris.forEach((t, ti) => t.forEach((v) => around[v].push(ti)));
  const centroid = (t) => norm(scale(add(add(verts[t[0]], verts[t[1]]), verts[t[2]]), 1 / 3));
  const pentagonOf = new Map(ICO_V.map((v, i) => [keyOf(v), i]));
  const faces = verts.map((n, vi) => {
    let u = cross(n, [0, 0, 1]); if (Math.hypot(...u) < 1e-6) u = cross(n, [0, 1, 0]); u = norm(u);
    const w = cross(n, u);
    const pts = around[vi].map((ti) => centroid(tris[ti]));
    pts.sort((p, q) => Math.atan2(dot(p, w), dot(p, u)) - Math.atan2(dot(q, w), dot(q, u)));
    const chair = pentagonOf.has(keyOf(n)) ? pentagonOf.get(keyOf(n)) : -1;
    return { verts: pts, center: n, normal: n, chair };
  });
  faces.sort((a, b) => (a.chair < 0) - (b.chair < 0) || a.chair - b.chair);
  return faces;
}

/** Build GP(m,n): { m, n, T, faces, hexagons }, and N when it is class I. */
export function buildGoldberg(m, n) {
  const faces = dualize(triangulate(m, n));
  const skin = { m, n, T: ladderT(m, n), faces, hexagons: faces.length - 12 };
  if (n === 0) skin.N = m;
  return skin;
}
/** Build GP(N,0): the dual of the frequency-N geodesic subdivision of the icosahedron. */
export function buildSkin(N) {
  return buildGoldberg(Math.max(1, N | 0), 0);
}

/** The smallest class I skin that seats `count` hexagons. */
export function skinFor(count) {
  let N = 1;
  while (10 * (N * N - 1) < count) N++;
  return N;
}
/** The lowest rung whose floor holds `seats`; the top rung for anything past it. */
export function rungFor(seats) {
  let r = 0;
  while (r < LADDER.length - 1 && hexagonsOf(...LADDER[r]) < seats) r++;
  return r;
}
const rungs = new Map();
/** The skin of a rung of the ladder, built once. */
export function skinForRung(rung) {
  if (!Number.isInteger(rung) || rung < 0 || rung >= LADDER.length) throw new RangeError(`rung ${rung} is off the ladder`);
  if (!rungs.has(rung)) rungs.set(rung, buildGoldberg(...LADDER[rung]));
  return rungs.get(rung);
}
/** The smallest (m,n) of either class whose floor holds `seats`: for floors that outgrow the ladder. */
export function goldbergFor(seats) {
  let N = 1; while (hexagonsOf(N, 0) < seats) N++;
  let n = 1; while (hexagonsOf(n, n) < seats) n++;
  return ladderT(N, 0) <= ladderT(n, n) ? [N, 0] : [n, n];
}

// ---- the palette of a face, as the observatory painted it ----
export const INK = {
  yes: '#29E35A', no: '#EF334F', abstain: '#C9B895', awaiting: '#F4B400',
  // Match the live engine's HEX_COLOR: assent is gold; floor dissent keeps paper.
  unsworn: '#F2EDE4', vacant: '#DCC080', hexYes: '#F0B90B', hexNo: '#F3EEE4', absent: '#DFD8C7',
  paperA: '#F3EEE4', paperB: '#FBF8F1', line: 'rgba(23,20,17,.5)', tether: '#C4B9A2',
  verdict: { 1: '#29E35A', 2: '#EF334F', 3: '#78EFFF', 4: '#C4B9A2', 0: '#C4B9A2' },
  gold: '#C99B3F', bronze: '#8A6B3F', verdigris: '#3E7C74', ink: '#2B2620', ink2: '#6F6353',
};
// the lamp: above, to the right, and in front of the viewer (front faces have a positive z normal here)
const LIGHT = [0.35, 0.55, 0.75];
export function shade(hex, f) {
  const n = parseInt(hex.slice(1), 16);
  const c = (x) => Math.max(0, Math.min(255, x * f)) | 0;
  return `rgb(${c((n >> 16) & 255)},${c((n >> 8) & 255)},${c(n & 255)})`;
}
export function hexA(hex, a) { const n = parseInt(hex.slice(1), 16); return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`; }

// ---- rotation and projection ----
export function rotate(p, yaw, pitch) {
  const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x = p[0] * cy - p[2] * sy, z = p[0] * sy + p[2] * cy;
  const y = p[1] * cp - z * sp, z2 = p[1] * sp + z * cp;
  return [x, y, z2];
}

/**
 * Draw one unit's skin at `center` (screen) with `radius`, rotated by `spin`.
 * `paint(face, i)` returns a base color (hex) for the face or null for parchment.
 * Faces are lit by one lamp and sorted back to front. Returns every front face's
 * screen center and normal (for packets) and the chair polygons (for hit testing).
 */
export function drawSkin(ctx, skin, center, radius, spin, paint, opts = {}) {
  const projected = skin.faces.map((f, i) => {
    const n = rotate(f.normal, spin.yaw, spin.pitch);
    const pts = f.verts.map((v) => rotate(v, spin.yaw, spin.pitch));
    return { i, f, n, depth: n[2], pts };
  });
  projected.sort((a, b) => a.depth - b.depth);
  const chairs = [], faces = [];
  const d = 3.2;
  const persp = (p) => { const s = radius * d / (d - p[2]); return [center[0] + p[0] * s, center[1] - p[1] * s]; };
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const bead = radius < (opts.beadAt || 7);
  if (bead) {
    ctx.beginPath(); ctx.arc(center[0], center[1], Math.max(1.2, radius), 0, Math.PI * 2);
    ctx.fillStyle = opts.flat || '#E6DFCE'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = INK.line; ctx.stroke();
    return { chairs, faces };
  }
  for (const q of projected) {
    const front = q.n[2] > 0;
    const poly = q.pts.map(persp);
    const lam = 0.72 + 0.4 * Math.max(0, q.n[0] * LIGHT[0] + q.n[1] * LIGHT[1] + q.n[2] * LIGHT[2]);
    const voted = front ? paint(q.f, q.i) : null;
    const base = opts.flat || voted || (q.f.chair >= 0 ? (q.f.chair % 2 ? INK.unsworn : INK.vacant) : (q.i % 3 === 0 ? INK.paperA : INK.paperB));
    ctx.beginPath();
    poly.forEach((p, k) => (k ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
    ctx.closePath();
    ctx.globalAlpha = front ? 1 : 0.34;
    ctx.fillStyle = shade(base, lam);
    ctx.fill();
    ctx.lineWidth = (q.f.chair >= 0 ? 1.6 : 1.1) * (opts.ink || 1);
    ctx.strokeStyle = INK.line;
    ctx.stroke();
    if (front && opts.hollow && opts.hollow(q.f, q.i)) { ctx.globalAlpha = 0.6; ctx.setLineDash([2, 3]); ctx.strokeStyle = '#B0A48C'; ctx.stroke(); ctx.setLineDash([]); }
    ctx.globalAlpha = 1;
    if (front) {
      const c = persp(q.n);
      faces.push({ i: q.i, chair: q.f.chair, center: c, n: q.n });
      if (q.f.chair >= 0) chairs.push({ chair: q.f.chair, poly, normal: q.n, depth: q.depth, center: c });
    }
  }
  return { chairs, faces };
}

export function pointInPoly(x, y, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i], [xj, yj] = poly[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

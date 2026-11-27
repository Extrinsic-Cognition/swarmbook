// cubism.mjs: ATHENA'S CUBIST FIT. His words, Oct 14 2026 (relayed as 16:1x WEST), over hero-ab.html at film 29.8 s: "bro this is soo fucking
// poorly spatial aware as fuck... do you understand what cubism is? why the fuck dont you align the frame seen there and the hair of the 3d
// model? you get what i mean or not?"
//
// THE READING. Cubism is one subject seen from two viewpoints at once and joined. In the film's shot over her shoulder (frames 886 to 1005,
// 29.563 to 33.567 s, cut to cut by the frames' own difference) every face of the page's dodecahedron carries the film's centre square, laid
// on the face by warm-sphere.js decal(): her head from behind at the picture's upper right, her violet hair streaming down to the left. The
// game's Athena (athena.hades.glb) is the same woman. So she is not stood at a sampled point of a Gaussian: she is put where her 3D hair
// continues the hair the face draws, across the face's edge, at the same scale, seen the same way (the film's camera behind and above her
// head, looking down at the fight), and she is cut by that face's edges so neither view covers the other: inside the face the film's
// picture of her, outside it her body in 3D, joined along the boundary.
//
// THE MEASURE (a pure module; nothing here draws, reads the network or runs on its own):
//   - the drawn hair: a mask of the film's pixels by her hair's violet (hue 262 to 336, saturation >= 0.15, value >= 0.30; read off frames
//     886 to 1005 by eye and by sample: her hair 289 to 306 deg, the rocks and the ground 160 to 190, the fighters 11), majority over the shot;
//   - the 3D hair: athena.hades.glb's E00H vertices (4328 to 7019 of its one primitive, all on the violet of its texture), posed as the asset
//     stands, put on the face by a transform in the face's own frame (across, up, out: the decal's axes), through the page's own projection;
//   - the join, along the face's five edges in the page's pixels: where the face's picture has hair just inside an edge and where her 3D hair
//     is just outside it. Its gap (px) is the mean distance, along the boundary, from each place the drawn hair's edge meets the boundary to the
//     nearest place the 3D hair's edge does, both ways; its mismatch (px) the boundary's length where one has hair and the other not; its angle
//     (deg) the mean turn between the two hair edges' directions where they meet; its overlap (px^2) the 3D hair in front of the face (zero
//     when the face's edges cut her, CLIP);
//   - the search: an evolution of a population, never a hill-climb: lambda candidates a generation from the mu best, each step size carried
//     by its candidate, the best ever kept on the record with its numbers (foundation 6).
// COST: the fit runs once, offline (cubism.fit.mjs, ~1 s of one core a face class); the page pays per draw one 4x4 and five planes from the
// face's pose (about 200 multiplications), and the clip costs the GPU five dot products a fragment of hers. Nothing at rest.
//
//   import {SHOT, chooseFace, place, FIT} from './cubism.mjs';
//   chooseFace(pents, spin, view)  -> the face to anchor her to while the shot lasts (picked once, at her cut)
//   place(FIT, face, spin)         -> {matrix (row-major 16: her model metres to the page's view space), planes (five [nx, ny, nz, d], positive
//                                     outside the face, through the eye), face}

export const FILM = {w: 960, h: 540, fps: 30000 / 1001, picture: [82, 877]};   // the file; the picture between its pillarbox bars (columns)
const frameTime = (n) => n * 1001 / 30000;
/** The film's shot over her shoulder, cut to cut: frames 886 to 1005 (the frames' mean difference 49.1 and 43.2 at the cuts, 0.1 to 8.5 inside). */
export const SHOT = {name: "over Athena's shoulder, down at the fight", frames: [886, 1006], from: frameTime(886), to: frameTime(1006)};
export const EYE = 4;                       // warm-sphere.js project(): the eye four circumradii from the sphere's centre
export const HEAD = [0, 1.392, 0.007];      // athena.hades.glb's h_jnt_head in her posed model (metres, +Y up, facing +Z)
export const HAIR = {from: 4328, to: 7020}; // E00H's vertices in the glb's one primitive
export const VIOLET = {hue: [262, 336], sat: 0.15, val: 0.3};

// ---- the page's sphere (warm-sphere.js: rotate, project, decal, path), copied so the fit sees what the page draws ----
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const unit = (p) => { const l = Math.hypot(...p) || 1; return p.map((x) => x / l); };
const add = (a, b, k = 1) => [a[0] + b[0] * k, a[1] + b[1] * k, a[2] + b[2] * k];

export function rotate(p, yaw, pitch) {
  const c = Math.cos(yaw), s = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x = p[0] * c - p[2] * s, z = p[0] * s + p[2] * c;
  return [x, p[1] * cp - z * sp, p[1] * sp + z * cp];
}
/** A point of the page's view space (box radii, the eye at z = EYE) on the stage, css px (y down). */
export function project(p, centre, R) {
  const k = R * EYE / (EYE - p[2]);
  return [centre[0] + p[0] * k, centre[1] - p[1] * k];
}
/** A face's own frame in the sphere's model space: its centre C, its outward normal n, the decal's across (the picture's right) and up. */
export function frameOf(face) {
  const n = face.normal, across = unit(cross(Math.abs(n[1]) > .95 ? [1, 0, 0] : [0, 1, 0], n)), up = cross(n, across);
  return {C: face.center, n, across, up, rho: Math.hypot(...face.verts[0].map((v, i) => v - face.center[i]))};
}
/** warm-sphere.js decal(): the picture square's (u, v) in -1..1 (right, down) to the stage, as ctx.transform's six numbers. */
export function decalOf(face, spin, centre, R) {
  const {C, across, up, rho} = frameOf(face), at = (p) => project(rotate(p, spin.yaw, spin.pitch), centre, R);
  const m = at(C), x = at(add(C, across, rho)), y = at(add(C, up, -rho));
  return [x[0] - m[0], x[1] - m[1], y[0] - m[0], y[1] - m[1], m[0], m[1]];
}
/** The face's outline on the stage, as the page clips its picture (its corners projected). */
export function outlineOf(face, spin, centre, R) { return face.verts.map((p) => project(rotate(p, spin.yaw, spin.pitch), centre, R)); }
/** Film px to the picture square's (u, v) (warm-sphere.js drawPortrait: the file's centre square), and back. */
export const squareOf = (fx, fy) => { const s = Math.min(FILM.w, FILM.h); return [(fx - (FILM.w - s) / 2) / s * 2 - 1, (fy - (FILM.h - s) / 2) / s * 2 - 1]; };
export const filmOf = (u, v) => { const s = Math.min(FILM.w, FILM.h); return [(u + 1) / 2 * s + (FILM.w - s) / 2, (v + 1) / 2 * s + (FILM.h - s) / 2]; };
/** The stage point of the picture square's (u, v) under a decal D, and the square's (u, v) of a stage point. */
export const stageOf = (u, v, D) => [D[0] * u + D[2] * v + D[4], D[1] * u + D[3] * v + D[5]];
export function squareAt(x, y, D) {
  const det = D[0] * D[3] - D[2] * D[1], dx = x - D[4], dy = y - D[5];
  return [(D[3] * dx - D[2] * dy) / det, (-D[1] * dx + D[0] * dy) / det];
}
/** How squarely a face looks at the eye: the cosine between its normal and the way from its centre to the eye (> 0 drawn with the film). */
export function facing(face, spin) {
  const c = rotate(face.center, spin.yaw, spin.pitch), n = rotate(face.normal, spin.yaw, spin.pitch);
  return dot(n, unit([-c[0], -c[1], EYE - c[2]]));
}

// ---- the hair in the film ----
export function isHair(r, g, b, t = VIOLET) {
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  if (!mx || d / mx < t.sat || mx / 255 < t.val) return false;
  let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  h = (h * 60 + 360) % 360;
  return h >= t.hue[0] && h <= t.hue[1];
}
/** Her hair in one frame (rgb or rgba bytes, w x h): 1 where the colour is her violet, closed by `close` px (thin pale strands bridged). */
export function hairMask(bytes, w = FILM.w, h = FILM.h, {channels = 3, close = 2, t = VIOLET} = {}) {
  let m = new Uint8Array(w * h);
  for (let i = 0, o = 0; i < w * h; i++, o += channels) m[i] = isHair(bytes[o], bytes[o + 1], bytes[o + 2], t) ? 1 : 0;
  if (close > 0) m = erode(dilate(m, w, h, close), w, h, close);
  return m;
}
function dilate(m, w, h, r) { return morph(m, w, h, r, 1); }
function erode(m, w, h, r) { return morph(m, w, h, r, 0); }
function morph(m, w, h, r, want) {   // a square structuring element, separable: rows then columns
  const a = new Uint8Array(w * h), b = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let v = want ? 0 : 1;
    for (let k = Math.max(0, x - r); k <= Math.min(w - 1, x + r); k++) if (m[y * w + k] === want) { v = want; break; }
    a[y * w + x] = v;
  }
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let v = want ? 0 : 1;
    for (let k = Math.max(0, y - r); k <= Math.min(h - 1, y + r); k++) if (a[k * w + x] === want) { v = want; break; }
    b[y * w + x] = v;
  }
  return b;
}
/** The pixels that are hair in more than half of the masks. */
export function majority(masks) {
  const out = new Uint8Array(masks[0].length), half = masks.length / 2;
  for (let i = 0; i < out.length; i++) { let s = 0; for (const m of masks) s += m[i]; out[i] = s > half ? 1 : 0; }
  return out;
}

// ---- her, on a face ----
/** Her turn in the face's frame (model to face-local): seen from behind (her +Z into the face), her up tilted toward the eye by theta (the
 *  film's camera looking down at her by theta), turned psi about her own up first and rolled phi about the face's normal last. 3x3 row-major. */
export function turnOf({theta, psi, phi}) {
  const m3 = (a, b) => a.map((r) => [0, 1, 2].map((j) => r[0] * b[0][j] + r[1] * b[1][j] + r[2] * b[2][j]));
  const c = Math.cos, s = Math.sin;
  const Rz = [[c(phi), -s(phi), 0], [s(phi), c(phi), 0], [0, 0, 1]], Rx = [[1, 0, 0], [0, c(theta), -s(theta)], [0, s(theta), c(theta)]];
  const behind = [[-1, 0, 0], [0, 1, 0], [0, 0, -1]], Ry = [[c(psi), 0, s(psi)], [0, 1, 0], [-s(psi), 0, c(psi)]];
  return m3(m3(m3(Rz, Rx), behind), Ry);
}
/**
 * Her model (metres) to the page's view space (box radii, the eye at z = EYE), as a row-major 4x4 (three's Matrix4.set order): her head
 * joint at (u, v, w) box radii from the face's centre along its across, up and out, s box radii a metre, turned by turnOf.
 */
export function matrixOf(local, face, spin) {
  const f = frameOf(face), T = turnOf(local), s = local.s;
  // the face's frame turned with the sphere: columns across, up, n; and its centre
  const A = rotate(f.across, spin.yaw, spin.pitch), U = rotate(f.up, spin.yaw, spin.pitch), N = rotate(f.n, spin.yaw, spin.pitch), C = rotate(f.C, spin.yaw, spin.pitch);
  const F = [0, 1, 2].map((i) => [A[i], U[i], N[i]]);   // face-local to view, 3x3 row-major
  const M = F.map((r) => [0, 1, 2].map((j) => s * (r[0] * T[0][j] + r[1] * T[1][j] + r[2] * T[2][j])));
  const head = [local.u, local.v, local.w], at = [0, 1, 2].map((i) => C[i] + F[i][0] * head[0] + F[i][1] * head[1] + F[i][2] * head[2]);
  const t = [0, 1, 2].map((i) => at[i] - (M[i][0] * HEAD[0] + M[i][1] * HEAD[1] + M[i][2] * HEAD[2]));
  return [M[0][0], M[0][1], M[0][2], t[0], M[1][0], M[1][1], M[1][2], t[1], M[2][0], M[2][1], M[2][2], t[2], 0, 0, 0, 1];
}
/** The face's five edges as planes through the eye, in the page's view space: [nx, ny, nz, d] with n.p + d > 0 outside the face. Clipping
 *  with all five and clipIntersection (three: a fragment goes only when it is on the negative side of every plane) cuts out the face. */
export function planesOf(face, spin) {
  const E = [0, 0, EYE], P = face.verts.map((p) => rotate(p, spin.yaw, spin.pitch)), C = rotate(face.center, spin.yaw, spin.pitch);
  return P.map((p, k) => {
    const q = P[(k + 1) % 5], n = unit(cross([p[0] - E[0], p[1] - E[1], p[2] - E[2]], [q[0] - E[0], q[1] - E[1], q[2] - E[2]]));
    const sgn = dot(n, C) - dot(n, E) > 0 ? -1 : 1, m = n.map((x) => x * sgn);
    return [m[0], m[1], m[2], -dot(m, E)];
  });
}
const apply = (M, p) => [M[0] * p[0] + M[1] * p[1] + M[2] * p[2] + M[3], M[4] * p[0] + M[5] * p[1] + M[6] * p[2] + M[7], M[8] * p[0] + M[9] * p[1] + M[10] * p[2] + M[11]];

// ---- the join ----
/** Her hair's triangles on the stage: projected points (Float64Array x, y pairs) and their depth for the eye's side (z < EYE). */
export function hairOnStage(hair, M, centre, R) {
  const n = hair.pos.length / 3, xy = new Float64Array(n * 2);
  let ok = true;
  for (let i = 0; i < n; i++) {
    const p = apply(M, [hair.pos[i * 3], hair.pos[i * 3 + 1], hair.pos[i * 3 + 2]]);
    if (p[2] > EYE - 0.05) ok = false;
    const q = project(p, centre, R); xy[i * 2] = q[0]; xy[i * 2 + 1] = q[1];
  }
  return {xy, ok};
}
/** Her hair as a mask on a grid of the stage (box: {x0, y0, w, h}, 1 px cells): every triangle filled. */
export function rasterize(xy, tris, box) {
  const m = new Uint8Array(box.w * box.h);
  for (let t = 0; t < tris.length; t += 3) {
    const ax = xy[tris[t] * 2] - box.x0, ay = xy[tris[t] * 2 + 1] - box.y0, bx = xy[tris[t + 1] * 2] - box.x0, by = xy[tris[t + 1] * 2 + 1] - box.y0;
    const cx = xy[tris[t + 2] * 2] - box.x0, cy = xy[tris[t + 2] * 2 + 1] - box.y0;
    const x0 = Math.max(0, Math.floor(Math.min(ax, bx, cx))), x1 = Math.min(box.w - 1, Math.ceil(Math.max(ax, bx, cx)));
    const y0 = Math.max(0, Math.floor(Math.min(ay, by, cy))), y1 = Math.min(box.h - 1, Math.ceil(Math.max(ay, by, cy)));
    if (x0 > x1 || y0 > y1) continue;
    const area = (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
    if (Math.abs(area) < 1e-9) continue;
    for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) {
      const px = x + 0.5, py = y + 0.5;
      const w0 = (bx - px) * (cy - py) - (by - py) * (cx - px), w1 = (cx - px) * (ay - py) - (cy - py) * (ax - px), w2 = (ax - px) * (by - py) - (ay - py) * (bx - px);
      if ((w0 >= 0 && w1 >= 0 && w2 >= 0) || (w0 <= 0 && w1 <= 0 && w2 <= 0)) m[y * box.w + x] = 1;
    }
  }
  return m;
}
const inside = (pt, poly) => {
  let r = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [x, y] = poly[i], [xx, yy] = poly[j];
    if ((y > pt[1]) !== (yy > pt[1]) && pt[0] < (xx - x) * (pt[1] - y) / (yy - y) + x) r = !r;
  }
  return r;
};
/**
 * The face's boundary as samples a pixel apart: {at (stage px), s (px along the boundary), out (the edge's outward normal), edge}. Each
 * carries `drawn`: whether the face's picture shows her hair `step` px inside it (the film's mask through the decal, the square's own edge
 * and the pillarbox as no hair), and the drawn hair's edge direction there.
 */
export function boundaryOf(face, spin, centre, R, film, {step = 3} = {}) {
  const P = outlineOf(face, spin, centre, R), D = decalOf(face, spin, centre, R), mid = P.reduce((a, p) => [a[0] + p[0] / 5, a[1] + p[1] / 5], [0, 0]);
  const samples = [];
  let s = 0;
  for (let k = 0; k < 5; k++) {
    const a = P[k], b = P[(k + 1) % 5], len = Math.hypot(b[0] - a[0], b[1] - a[1]), d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
    let out = [d[1], -d[0]];
    if ((mid[0] - a[0]) * out[0] + (mid[1] - a[1]) * out[1] > 0) out = [-out[0], -out[1]];
    for (let x = 0.5; x < len; x += 1) {
      const at = [a[0] + d[0] * x, a[1] + d[1] * x], inPt = [at[0] - out[0] * step, at[1] - out[1] * step];
      const drawn = filmAt(film, squareAt(inPt[0], inPt[1], D));
      samples.push({at, s: s + x, out, edge: k, drawn, tangent: drawn ? filmTangent(film, squareAt(inPt[0], inPt[1], D), D) : null});
    }
    s += len;
  }
  return {samples, length: s, outline: P, decal: D};
}
function filmAt(film, [u, v]) {
  if (Math.abs(u) > 1 || Math.abs(v) > 1) return 0;
  const [fx, fy] = filmOf(u, v), x = Math.floor(fx), y = Math.floor(fy);
  if (x < FILM.picture[0] || x > FILM.picture[1] || y < 0 || y >= FILM.h) return 0;
  return film.mask[y * film.w + x];
}
// the direction (stage px, unit, mod 180 deg) of the drawn hair's edge near a point: the mask's gradient over 9 film px, turned a quarter
function filmTangent(film, [u, v], D) {
  const [fx, fy] = filmOf(u, v), r = 4;
  let gx = 0, gy = 0;
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    const x = Math.round(fx + dx), y = Math.round(fy + dy);
    if (x < 0 || y < 0 || x >= film.w || y >= film.h) continue;
    const m = film.mask[y * film.w + x];
    gx += m * dx; gy += m * dy;
  }
  if (!gx && !gy) return null;
  // film px to the square's (u, v): times 2 / side, then the decal's linear part
  const g = [D[0] * gx + D[2] * gy, D[1] * gx + D[3] * gy], l = Math.hypot(...g);
  return [-g[1] / l, g[0] / l];
}
/** A boolean profile round the loop with every run shorter than `min` samples flipped to its neighbours' (her strands, a pixel's noise):
 *  the join compares hair masses, which is all a solid 3D sheet of hair can continue. */
export function steady(profile, min) {
  const n = profile.length, out = profile.slice();
  if (min <= 1 || n < 2) return out;
  // the shortest run first, then the runs again (a flip merges its neighbours into one longer run)
  for (let guard = 0; guard < n; guard++) {
    const runs = runsOf(out);
    if (runs.length < 2) break;
    const short = runs.reduce((b, r) => (r.len < min && (!b || r.len < b.len) ? r : b), null);
    if (!short) break;
    for (let j = 0; j < short.len; j++) out[(short.start + j) % n] = short.v ? 0 : 1;
  }
  return out;
}
function runsOf(p) {
  const n = p.length, start = p.findIndex((v, i) => v !== p[(i + n - 1) % n]);
  if (start < 0) return [{start: 0, len: n, v: p[0]}];
  const runs = [];
  for (let k = 0, i = start; k < n;) {
    let len = 1;
    while (len < n - k && p[(i + len) % n] === p[i]) len++;
    runs.push({start: i, len, v: p[i]}); i = (i + len) % n; k += len;
  }
  return runs;
}
/** Runs of a boolean profile along the boundary as the places it changes: [{s, rise}] (the boundary is a loop). */
function transitions(samples, key) {
  const out = [];
  for (let i = 0; i < samples.length; i++) {
    const a = samples[(i + samples.length - 1) % samples.length][key], b = samples[i][key];
    if (Boolean(a) !== Boolean(b)) out.push({s: samples[i].s, i, rise: Boolean(b)});
  }
  return out;
}
const loopGap = (a, b, L) => { const d = Math.abs(a - b) % L; return Math.min(d, L - d); };
/**
 * The join of her 3D hair (under matrix M) with the face's picture: {gap, mismatch, angle, overlap, meets, drawnLength, ok}.
 * hair: {pos (Float32Array metres, posed), tris (indices into pos)}; border: boundaryOf(...); clip: the face's edges cut her (no overlap).
 */
export function joinOf(border, hair, M, centre, R, {step = 3, clip = true, minRun = 8} = {}) {
  const {xy, ok} = hairOnStage(hair, M, centre, R);
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of border.outline) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
  const pad = step + 12, box = {x0: Math.floor(x0 - pad), y0: Math.floor(y0 - pad), w: Math.ceil(x1 - x0 + 2 * pad), h: Math.ceil(y1 - y0 + 2 * pad)};
  const mask = rasterize(xy, hair.tris, box);
  const at = (x, y) => { const i = Math.floor(x - box.x0), j = Math.floor(y - box.y0); return i >= 0 && j >= 0 && i < box.w && j < box.h ? mask[j * box.w + i] : 0; };
  const ours = steady(border.samples.map((p) => at(p.at[0] + p.out[0] * step, p.at[1] + p.out[1] * step)), minRun);
  const drawn = steady(border.samples.map((p) => p.drawn), minRun);
  const samples = border.samples.map((p, i) => ({...p, drawn: drawn[i], ours: ours[i]}));
  let mismatch = 0, drawnLength = 0;
  for (const p of samples) { if (p.drawn !== p.ours) mismatch++; if (p.drawn) drawnLength++; }
  const td = transitions(samples, 'drawn'), to = transitions(samples, 'ours'), L = border.length;
  const nearest = (s, list) => list.reduce((b, q) => Math.min(b, loopGap(s, q.s, L)), Infinity);
  const gapOf = (from, to2) => from.length ? from.reduce((a, q) => a + (to2.length ? nearest(q.s, to2) : L / 4), 0) / from.length : 0;
  const gap = td.length || to.length ? (gapOf(td, to) + gapOf(to, td)) / 2 : 0;
  // the directions where they meet: each drawn edge against our mask's edge at its nearest transition
  let angle = 0, meets = 0;
  for (const q of td) {
    const tan = samples[q.i].tangent ?? samples[(q.i + samples.length - 1) % samples.length].tangent;
    if (!tan || !to.length) continue;
    const near = to.reduce((b, r) => (loopGap(q.s, r.s, L) < loopGap(q.s, b.s, L) ? r : b));
    const p = samples[near.i], ourTan = maskTangent(at, p.at[0] + p.out[0] * step, p.at[1] + p.out[1] * step);
    if (!ourTan) continue;
    angle += Math.acos(Math.min(1, Math.abs(tan[0] * ourTan[0] + tan[1] * ourTan[1]))) * 180 / Math.PI; meets++;
  }
  angle = meets ? angle / meets : 90;
  // what of her hair lies in front of the face's picture (none when the face's edges cut her)
  let overlap = 0;
  if (!clip) for (let j = 0; j < box.h; j++) for (let i = 0; i < box.w; i++) if (mask[j * box.w + i] && inside([box.x0 + i + 0.5, box.y0 + j + 0.5], border.outline)) overlap++;
  return {gap, mismatch, angle, overlap, meets, drawnLength, drawnEdges: td.length, ourEdges: to.length, ok, samples};
}
/**
 * The same join read off pictures (cubism.proof.mjs): along a face's outline (stage or picture px), drawnAt(x, y) says whether the face's
 * picture shows her hair there and oursAt(x, y) whether her 3D hair is there (each 0 or 1, from its own picture). {gap, mismatch, angle, ...}.
 */
export function joinOfPicture(outline, drawnAt, oursAt, {step = 3, minRun = 8} = {}) {
  const mid = outline.reduce((a, p) => [a[0] + p[0] / outline.length, a[1] + p[1] / outline.length], [0, 0]), raw = [];
  let L = 0;
  outline.forEach((a, k) => {
    const b = outline[(k + 1) % outline.length], len = Math.hypot(b[0] - a[0], b[1] - a[1]), d = [(b[0] - a[0]) / len, (b[1] - a[1]) / len];
    let out = [d[1], -d[0]];
    if ((mid[0] - a[0]) * out[0] + (mid[1] - a[1]) * out[1] > 0) out = [-out[0], -out[1]];
    for (let x = 0.5; x < len; x += 1) {
      const at = [a[0] + d[0] * x, a[1] + d[1] * x];
      raw.push({at, out, s: L + x, drawn: drawnAt(at[0] - out[0] * step, at[1] - out[1] * step), ours: oursAt(at[0] + out[0] * step, at[1] + out[1] * step)});
    }
    L += len;
  });
  const drawn = steady(raw.map((p) => p.drawn), minRun), ours = steady(raw.map((p) => p.ours), minRun);
  const samples = raw.map((p, i) => ({...p, drawn: drawn[i], ours: ours[i]}));
  let mismatch = 0, drawnLength = 0;
  for (const p of samples) { if (p.drawn !== p.ours) mismatch++; if (p.drawn) drawnLength++; }
  const td = transitions(samples, 'drawn'), to = transitions(samples, 'ours');
  const nearest = (s, list) => list.reduce((b, q) => Math.min(b, loopGap(s, q.s, L)), Infinity);
  const gapOf = (from, to2) => from.length ? from.reduce((a, q) => a + (to2.length ? nearest(q.s, to2) : L / 4), 0) / from.length : 0;
  const gap = td.length || to.length ? (gapOf(td, to) + gapOf(to, td)) / 2 : 0;
  let angle = 0, meets = 0;
  for (const q of td) {
    if (!to.length) break;
    const p = samples[q.i], near = samples[to.reduce((b, r) => (loopGap(q.s, r.s, L) < loopGap(q.s, b.s, L) ? r : b)).i];
    const a = maskTangent(drawnAt, p.at[0] - p.out[0] * step, p.at[1] - p.out[1] * step), b = maskTangent(oursAt, near.at[0] + near.out[0] * step, near.at[1] + near.out[1] * step);
    if (!a || !b) continue;
    angle += Math.acos(Math.min(1, Math.abs(a[0] * b[0] + a[1] * b[1]))) * 180 / Math.PI; meets++;
  }
  return {gap: +gap.toFixed(2), mismatch, angle: meets ? +(angle / meets).toFixed(1) : null, meets, drawnEdges: td.length, ourEdges: to.length, drawnLength, length: Math.round(L)};
}
function maskTangent(at, x, y) {
  let gx = 0, gy = 0;
  for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) { const m = at(x + dx, y + dy); gx += m * dx; gy += m * dy; }
  const l = Math.hypot(gx, gy);
  return l ? [-gy / l, gx / l] : null;
}
/** The one number the search lowers: px of gap and half the mismatch, a quarter px a degree of turn, the overlap per boundary px. */
export const scoreOf = (j, border) => (j.ok ? 0 : 1e6) + j.gap + 0.5 * j.mismatch + 0.25 * j.angle + j.overlap / border.length;

// ---- the search ----
export const BOUNDS = {u: [-0.2, 2.4], v: [-1.0, 1.4], w: [-0.6, 1.6], s: [0.6, 5.0], theta: [0.26, 1.13], psi: [-1.05, 1.05], phi: [-0.52, 0.52]};
const KEYS = Object.keys(BOUNDS);
export function rng(seed = 1) {   // mulberry32
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
const gauss = (r) => Math.sqrt(-2 * Math.log(r() || 1e-12)) * Math.cos(2 * Math.PI * r());
const toLocal = (x) => Object.fromEntries(KEYS.map((k, i) => [k, BOUNDS[k][0] + x[i] * (BOUNDS[k][1] - BOUNDS[k][0])]));
export const toUnit = (local) => KEYS.map((k) => (local[k] - BOUNDS[k][0]) / (BOUNDS[k][1] - BOUNDS[k][0]));
/**
 * Her place on `face` that joins her hair to the face's picture best over `views` ([{spin, film}]: the poses the sphere turns through while
 * the shot lasts, and frames of the shot, since her hair moves in the wind): the mean score over them all. A (mu/mu, lambda) evolution with
 * each candidate's own step size (log-normal), the elite kept. Returns {best: {local, score, join (the first view's), gaps (each view's)},
 * generations: [{best, median}], evaluations}.
 */
export function fit({face, views, centre, R, hair, start = null, clip = true, bounds = BOUNDS}, {seed = 1, lambda = 24, mu = 6, generations = 40, sigma = 0.18} = {}) {
  const keys = Object.keys(bounds), toLocal = (x) => Object.fromEntries(keys.map((k, i) => [k, bounds[k][0] + x[i] * (bounds[k][1] - bounds[k][0])]));
  const toUnit = (local) => keys.map((k) => (local[k] - bounds[k][0]) / (bounds[k][1] - bounds[k][0]));
  const r = rng(seed), borders = views.map((v) => ({spin: v.spin, border: boundaryOf(face, v.spin, centre, R, v.film)})), border = borders[0].border;
  const evaluate = (x) => {
    const local = toLocal(x);
    let score = 0, join = null;
    const gaps = [];
    for (const b of borders) {
      const j = joinOf(b.border, hair, matrixOf(local, face, b.spin), centre, R, {clip});
      score += scoreOf(j, b.border) / borders.length; gaps.push(j.gap); join ??= j;
    }
    return {x, local, score, join, gaps, sigma: 0};
  };
  const clamp01 = (v) => Math.min(1, Math.max(0, v));
  let pop = Array.from({length: lambda}, (_, i) => ({...evaluate(i === 0 && start ? toUnit(start).map(clamp01) : keys.map(() => r())), sigma}));
  let best = pop.reduce((a, b) => (b.score < a.score ? b : a)), evaluations = lambda;
  const history = [];
  for (let g = 0; g < generations; g++) {
    pop.sort((a, b) => a.score - b.score);
    const parents = pop.slice(0, mu), mean = keys.map((_, i) => parents.reduce((a, p) => a + p.x[i], 0) / mu);
    const s0 = parents.reduce((a, p) => a + Math.log(p.sigma), 0) / mu;
    const next = [best];
    while (next.length < lambda) {
      const sig = Math.exp(s0 + 0.3 * gauss(r)), from = next.length % 3 === 0 ? parents[Math.floor(r() * mu)].x : mean;
      next.push({...evaluate(from.map((v) => clamp01(v + sig * gauss(r)))), sigma: Math.min(0.5, Math.max(0.002, sig))});
      evaluations++;
    }
    pop = next;
    for (const p of pop) if (p.score < best.score) best = p;
    const scores = pop.map((p) => p.score).sort((a, b) => a - b);
    history.push({best: +best.score.toFixed(2), median: +scores[scores.length >> 1].toFixed(2)});
  }
  return {best: {local: best.local, score: best.score, join: summary(best.join), gaps: best.gaps.map((g) => +g.toFixed(2))}, generations: history, evaluations,
    border: {length: border.length, drawnLength: best.join.drawnLength}};
}
export const summary = (j) => ({gap: +j.gap.toFixed(2), mismatch: j.mismatch, angle: +j.angle.toFixed(1), overlap: j.overlap, meets: j.meets, drawnEdges: j.drawnEdges, ourEdges: j.ourEdges, drawnLength: j.drawnLength});

// ---- the page's side: which face, and her place on it ----
/** The face to anchor her to while the shot lasts: of the faces turned to the eye (facing > 0.3), the one whose picture's right side
 *  (where the film has her head) stands farthest right on the stage, so her 3D body goes out past the sphere's right silhouette. side -1:
 *  the mirror (her face shot has her hair at the picture's left: the face whose picture's left side stands farthest left). */
export function chooseFace(pents, spin, centre = [0, 0], R = 1, side = 1) {
  let best = -1, bx = -Infinity;
  pents.forEach((face, i) => {
    if (facing(face, spin) <= 0.3) return;
    const x = side * stageOf(side * 0.809, -0.3, decalOf(face, spin, centre, R))[0];
    if (x > bx) { bx = x; best = i; }
  });
  return best;
}
/** Which of the fit's classes a face belongs to: the pentagon's corners' angles in its decal frame (rounded degrees, sorted), as a key. */
export function classOf(face) {
  const {C, across, up} = frameOf(face);
  return face.verts.map((p) => { const r = [p[0] - C[0], p[1] - C[1], p[2] - C[2]]; return Math.round(Math.atan2(dot(r, up), dot(r, across)) * 180 / Math.PI); })
    .sort((a, b) => a - b).join(',');
}
/** Her place for the page: the fitted transform of the face's class, on that face at the sphere's pose (see the header). */
export function place(fitted, face, spin) {
  const entry = fitted.classes[classOf(face)];
  if (!entry) return null;
  return {matrix: matrixOf(entry.local, face, spin), planes: planesOf(face, spin), face: face.id, residual: entry.join};
}

// ---- HER SHOTS ON THE PAGE (his 17:35 WEST: "for the time between the 2 keyframes with athena alignment and the waall of ligt.... this
// perspective of athena is not even there let alone RLVR'd into place") ----
/** Her shots between the alignment (the cut to over her shoulder) and the wall of light, cut to cut by the film's frames. */
export const SHOTS = [
  {name: "over Athena's shoulder, down at the fight", frames: [886, 1006]},
  {name: 'her face, the prow', frames: [1006, 1096], side: -1},
  // the column, then the flood (the same camera over her shoulder, "all light but her hair") to its cut: she closes her window by the wall of
  // light (37.132 to 37.6 s) and goes on the film's cut at 38.071 s, as she comes; one shot for the page, so no device at the light's change
  {name: 'over her shoulder, the column and the flood', frames: [1096, 1141]},
];
/** The shot of hers holding the film's second t (its index in SHOTS), or -1. */
export const shotOf = (t) => { const n = Math.floor(t * 30000 / 1001 + 1e-6); return SHOTS.findIndex((s) => n >= s.frames[0] && n < s.frames[1]); };
/** Her shot's seconds holding t, {start, end, shot}, or null (the page's presence: she comes and goes on the film's cuts). */
export const presenceOf = (t) => { const i = shotOf(t); return i < 0 ? null : {start: SHOTS[i].frames[0] * 1001 / 30000, end: SHOTS[i].frames[1] * 1001 / 30000, shot: i}; };
/** Her place on the page at second t: the face she joins is picked at the shot's cut (kept in `keep`), the shot's fitted pose on it at the
 *  sphere's pose. {matrix, planes, face, shot} or null outside her shots. */
export function herAt(t, pents, spin, keep = {}, fits = FITS, {onePlane = false, faceShot = 'hidden'} = {}) {
  const i = shotOf(t);
  if (i < 0) return null;
  if (onePlane) {
    // ONE PLANE (his 19:0x and 19:1x WEST): her plane is picked at her first cut and kept, with its pose, through all her shots; one pose on it
    // (the shoulder shot's fit), so nothing refits her or jumps her across the stage. on.spin is the sphere's pose held from her cut: the fold,
    // her plane and her window use it too, whatever the page's sphere does. Her face shot (33.567 to 36.570 s): the window shows her own face
    // there, and a second her from behind, joined to nothing, read as a stray (the frames of 19:3x WEST); she is hidden (null) unless
    // faceShot 'kept', and comes back at the column on the same plane and pose.
    if (i === 1 && faceShot !== 'kept') return null;
    if (keep.face === undefined) { keep.face = chooseFace(pents, spin); keep.spin = {yaw: spin.yaw, pitch: spin.pitch}; }
    keep.shot = i;
    const p = place(fits[0], pents[keep.face], keep.spin ?? spin);
    return p && {...p, shot: i, spin: keep.spin};
  }
  if (keep.shot !== i || keep.face === undefined) { keep.shot = i; keep.face = chooseFace(pents, spin, [0, 0], 1, SHOTS[i].side ?? 1); }
  const p = place(fits[i], pents[keep.face], spin);
  return p && {...p, shot: i};
}

// ---- HER PORTAL (his 17:19 WEST: "the "FRAME" AKA "WINDOW INTO THE SCENE" should expand outwards from the alignment of athena hair... SHE IS
// ALSO CLOSING IT BY WALL OF LIGHT AIOLOS"): the window's timing, its reach and zoom from where it opens ----
export const PORTAL = {open: 29.763, waveEnd: 29.863, grown: 37.1, aiolos: 37.132, closed: 37.6, v: 2600};
const ZOOM_MAX = 8;   // the film zoomed no further than 8 times about her hair (beyond, the window keeps white margins where the picture ends)
/** The window at second t: its radius r (px from her hair's join), the film's zoom z about the join, the wall of light's radius (-1 before Aiolos). */
export function portalWindow(t, reach, zFull) {
  const ease = (k) => k * k * (3 - 2 * k), k01 = (k) => Math.min(1, Math.max(0, k));
  const w = t < PORTAL.open || t >= PORTAL.closed ? {r: 0, z: 1} : t < PORTAL.waveEnd ? {r: PORTAL.v * (t - PORTAL.open), z: 1}
    : (() => { const k = ease(k01((t - PORTAL.waveEnd) / (PORTAL.grown - PORTAL.waveEnd))); return {r: 260 + (reach - 260) * k, z: 1 + (zFull - 1) * k}; })();
  return {...w, wall: t < PORTAL.aiolos ? -1 : reach * k01((t - PORTAL.aiolos) / (PORTAL.closed - PORTAL.aiolos))};
}
/** Where the window opens and how far it must reach, on a stage of w x h css px with the sphere at centre/R and pose spin: her head (FIT on the
 *  face chooseFace picks), that face's decal, the reach to the farthest corner and the zoom at which the picture (columns 82..877) covers the
 *  stage's left and its whole height at the join (the picture ends just right of her head: the film cuts her there too). */
export function portalGeometry(pents, spin, centre, R, w, h) {
  const face = pents[chooseFace(pents, spin)], M = place(FIT, face, spin).matrix;
  const v = [0, 1, 2].map((i) => M[i * 4] * HEAD[0] + M[i * 4 + 1] * HEAD[1] + M[i * 4 + 2] * HEAD[2] + M[i * 4 + 3]), origin = project(v, centre, R);
  const D0 = decalOf(face, spin, centre, R), U0 = (82 - 480) / 270, U1 = (878 - 480) / 270;
  const covers = (x, y, z) => { const [u, q] = squareAt(origin[0] + (x - origin[0]) / z, origin[1] + (y - origin[1]) / z, D0); return u >= U0 && u <= U1 && Math.abs(q) <= 1; };
  let zFull = 1;
  while (![[0, 0], [0, h - 1], [Math.round(origin[0]), 0], [Math.round(origin[0]), h - 1]].every(([x, y]) => covers(x, y, zFull)) && zFull < ZOOM_MAX) zFull += 0.05;
  const reach = Math.max(...[[0, 0], [w, 0], [0, h], [w, h]].map(([x, y]) => Math.hypot(x - origin[0], y - origin[1])));
  return {origin, D0, zFull, reach, face: face.id, U0, U1};
}

// ---- STRUCK by his 19:19 WEST words (the hero's hypertrace): the hinged fold below stays for its tests and its record only; THE FOLD is
// hexFold further down. ----
// ---- THE FOLD (his 18:47 WEST: "AS SOON AS ATHENA FUCKING APPEARS SHE BREACHES THE FABRIC OF SPACETIME (it simply means, the dodecahedron
// faces dissolve into 1 single window into reality"; 18:4x: "of coruse, the fucking face that we start from means all the other faces are
// folded onto the main plane... you get what i mean?"). The face she joins stays put; the other eleven unfold onto its plane, her neighbours
// first, along a tree of hinges whose flat net does not overlap itself, and every face then shows one picture: the film laid in her face's
// picture plane (decal() extended), so the film's hair runs on under hers across them all. Pure: the box's page draws it (unboxing.js). ----
/** When the box unfolds: from her cut, a ring after the ring before it, flat by 30.2 s; each ring turns over `dur` seconds, eased. */
// The first Athena frame is 886. Keep the exact presentation time: a rounded
// millisecond boundary would leave that first frame on the dodecahedron.
export const FOLD = {start: 886 * 1001 / 30000, flat: 30.2, dur: 0.3};
const v3 = {
  sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  add: (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  scale: (a, k) => [a[0] * k, a[1] * k, a[2] * k],
};
const vkey = (p) => p.map((x) => x.toFixed(6)).join(',');
/** Rotation about the unit axis e by angle a (Rodrigues), as a 3x3 row-major. */
function axisAngle(e, a) {
  const c = Math.cos(a), s = Math.sin(a), t = 1 - c, [x, y, z] = e;
  return [[t * x * x + c, t * x * y - s * z, t * x * z + s * y], [t * x * y + s * z, t * y * y + c, t * y * z - s * x], [t * x * z - s * y, t * y * z + s * x, t * z * z + c]];
}
// 4x4 row-major helpers (a pose: model space to model space)
const I4 = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const mul4 = (A, B) => { const o = new Array(16).fill(0); for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) o[i * 4 + j] += A[i * 4 + k] * B[k * 4 + j]; return o; };
const at4 = (M, p) => [M[0] * p[0] + M[1] * p[1] + M[2] * p[2] + M[3], M[4] * p[0] + M[5] * p[1] + M[6] * p[2] + M[7], M[8] * p[0] + M[9] * p[1] + M[10] * p[2] + M[11]];
/** The turn about the hinge line through point a along unit axis e by angle ang, as a 4x4 row-major. */
function hingeTurn(a, e, ang) {
  const R = axisAngle(e, ang), t = v3.sub(a, [0, 1, 2].map((i) => R[i][0] * a[0] + R[i][1] * a[1] + R[i][2] * a[2]));
  return [R[0][0], R[0][1], R[0][2], t[0], R[1][0], R[1][1], R[1][2], t[1], R[2][0], R[2][1], R[2][2], t[2], 0, 0, 0, 1];
}
/** Every face's neighbours across its edges: [{face, a, b}] (a, b the shared edge's ends). */
export function adjacencyOf(pents) {
  const edges = new Map(), nb = pents.map(() => []);
  pents.forEach((f, i) => f.verts.forEach((a, k) => {
    const b = f.verts[(k + 1) % f.verts.length], ka = vkey(a), kb = vkey(b), e = ka < kb ? `${ka}|${kb}` : `${kb}|${ka}`;
    if (!edges.has(e)) edges.set(e, []);
    edges.get(e).push({face: i, a, b});
  }));
  for (const list of edges.values()) if (list.length === 2) { const [x, y] = list; nb[x.face].push({face: y.face, a: x.a, b: x.b}); nb[y.face].push({face: x.face, a: x.a, b: x.b}); }
  return nb;
}
/** The faces' places when the net is flat, in the root's picture plane: [[x, y] per corner] in rho units (x across, y up). */
function flatOf(pents, tree) {
  const root = frameOf(pents[tree.root]), poses = foldPose(pents, tree, pents.map(() => 1), 'out');
  return pents.map((f, i) => f.verts.map((p) => { const q = v3.sub(at4(poses[i], p), root.C); return [dot(q, root.across) / root.rho, dot(q, root.up) / root.rho]; }));
}
const convexOverlap = (A, B) => {   // the separating axis theorem on two convex polygons, shrunk a hair so shared edges only touch
  const shrink = (P) => { const c = P.reduce((s, q) => [s[0] + q[0] / P.length, s[1] + q[1] / P.length], [0, 0]); return P.map((q) => [c[0] + (q[0] - c[0]) * 0.999, c[1] + (q[1] - c[1]) * 0.999]); };
  const [P, Q] = [shrink(A), shrink(B)];
  for (const poly of [P, Q]) for (let i = 0; i < poly.length; i++) {
    const a = poly[i], b = poly[(i + 1) % poly.length], n = [b[1] - a[1], a[0] - b[0]];
    const span = (R) => R.reduce(([lo, hi], q) => { const d = q[0] * n[0] + q[1] * n[1]; return [Math.min(lo, d), Math.max(hi, d)]; }, [Infinity, -Infinity]);
    const [p0, p1] = span(P), [q0, q1] = span(Q);
    if (p1 <= q0 || q1 <= p0) return false;
  }
  return true;
};
/** Whether the flat net of `tree` lays any two faces over each other (it must not). */
export function netOverlaps(pents, tree) {
  const flat = flatOf(pents, tree);
  for (let i = 0; i < flat.length; i++) for (let j = i + 1; j < flat.length; j++) if (convexOverlap(flat[i], flat[j])) return true;
  return false;
}
/**
 * The fold tree rooted at the face she joins: {root, faces: [{parent, ring, hinge: {a, b, axis}, angle}]} (angle: the signed turn about the
 * hinge, a to b, that lays the face in its parent's plane; 63.435 deg in size on every hinge of this dodecahedron), its net checked not to
 * overlap itself. Of the nets a ring's choice of parents allows (the second ring's five faces each touch two of the first, the last face five
 * of the second), the first that does not overlap and is the most compact (the least reach of its corners from her face's centre).
 */
export function foldTree(pents, root) {
  const nb = adjacencyOf(pents), ring = pents.map(() => -1), order = [root];
  ring[root] = 0;
  for (let i = 0; i < order.length; i++) for (const n of nb[order[i]]) if (ring[n.face] < 0) { ring[n.face] = ring[order[i]] + 1; order.push(n.face); }
  const options = pents.map((_, i) => (i === root ? [] : nb[i].filter((n) => ring[n.face] === ring[i] - 1)));
  const make = (pick) => ({root, faces: pents.map((f, i) => {
    if (i === root) return {parent: -1, ring: 0, hinge: null, angle: 0};
    const n = options[i][pick[i] ?? 0], axis = unit(v3.sub(n.b, n.a)), nf = f.normal, np = pents[n.face].normal;
    return {parent: n.face, ring: ring[i], hinge: {a: n.a, b: n.b, axis}, angle: Math.atan2(dot(cross(nf, np), axis), dot(nf, np))};
  })});
  // every combination of parents (2^5 x 5 here), the compact ones first
  const choosers = pents.map((_, i) => i).filter((i) => options[i].length > 1);
  let best = null;
  const total = choosers.reduce((n, i) => n * options[i].length, 1);
  for (let c = 0; c < total; c++) {
    const pick = {};
    let r = c;
    for (const i of choosers) { pick[i] = r % options[i].length; r = Math.floor(r / options[i].length); }
    const tree = make(pick);
    if (netOverlaps(pents, tree)) continue;
    const reach = Math.max(...flatOf(pents, tree).flat().map(([x, y]) => Math.hypot(x, y)));
    if (!best || reach < best.reach - 1e-9) best = {tree, reach};
  }
  if (!best) throw new Error('no net of this tree lies flat without overlap');
  return {...best.tree, reach: best.reach};
}
/** A face's turn about its hinge, fully folded: 'out' lays it in its parent's plane outside it (the net, 63.435 deg); 'in' lays it ON its parent
 *  (the dihedral closed, 116.565 deg the other way), so folded in every face lies on the face she joins: his 19:0x WEST "THE DODECAHEDRON
 *  DISAPPEARS, IT IS FOLDED UNTO 1 SINGLE PLANE WHICH IS THE FUCKING PLANE FROM WHICH ATHENA IS ALIGNED TO". */
export const foldAngle = (f, dir = 'in') => (dir === 'in' ? f.angle - Math.sign(f.angle) * Math.PI : f.angle);
/** Each face's pose at fold amounts ks (0 on the dodecahedron, 1 folded): 4x4 row-major, model space to model space. dir 'in' (default):
 *  onto her face; 'out': the outward net (the second candidate). */
export function foldPose(pents, tree, ks, dir = 'in') {
  const poses = new Array(pents.length).fill(null);
  const poseOf = (i) => {
    if (poses[i]) return poses[i];
    const f = tree.faces[i];
    poses[i] = f.parent < 0 ? I4() : mul4(poseOf(f.parent), hingeTurn(f.hinge.a, f.hinge.axis, (ks[i] ?? 0) * foldAngle(f, dir)));
    return poses[i];
  };
  pents.forEach((_, i) => poseOf(i));
  return poses;
}
/** The fold amount of every face at second t (FOLD): her face 0 throughout; a ring turns over FOLD.dur, eased, the last one done at FOLD.flat.
 *  'in': the far side first (the face opposite hers, then the second ring, then her neighbours), so the solid shrinks into her face; 'out':
 *  her neighbours first. */
export function foldAt(tree, t, dir = 'in') {
  const rings = Math.max(...tree.faces.map((f) => f.ring)), step = rings > 1 ? (FOLD.flat - FOLD.start - FOLD.dur) / (rings - 1) : 0;
  const ease = (k) => k * k * (3 - 2 * k), slot = (r) => (dir === 'in' ? rings - r : r - 1);
  return tree.faces.map((f) => (f.ring === 0 ? 0 : ease(Math.min(1, Math.max(0, (t - (FOLD.start + slot(f.ring) * step)) / FOLD.dur)))));
}
/** THE FOLD at second t: {tree, ks, poses} for the face she joins (root) and a direction ('in' his, 'out' the second candidate). */
export function fold(pents, root, t, dir = 'in', tree = foldTree(pents, root)) {
  const ks = foldAt(tree, t, dir);
  return {tree, ks, poses: foldPose(pents, tree, ks, dir)};
}

// ---- STRUCK by his Oct 15 2026 00:44 WEST words (over his page at Athena's shot, 31 to 33 s: the lattice below laid out flat, twelve gold
// pentagons apart, black inside wherever the picture did not reach, the film's frame and her window's gold arc across them): "this grid dude is
// all absolutely fucked up. you gotta do differently. when does it stop being a dodecahedron mask??". hexCells' lattice is off the page; it
// stays for its tests and its record only. hexAt (the come and the go, nearest first) and hexFold (the poses) are the fold's timing and flight
// whatever the cells: THE FOLD AS ONE WINDOW (oneCells, further down) gives every face her own cell. ----
// ---- THE FOLD AS HE GAVE IT, 19:19 WEST (the hero's hypertrace, ec-workspace docs/optimism-fit-hero-hypertrace-2026-10-14.md, strikes the
// hinged fold above: no seat goes back to it): "why the fuck are you trying to brusteforce into place a 3D model when you can interpolate the
// dodecahedron chosen destination plane for all faces to be folded in that plain hexagomnally... you get me? its come and go from plane to back
// again into sphere when wall of lights hits again". Her face is the chosen plane. Every other face flies from its place on the sphere to its own
// cell of a hexagonal lattice in that plane (her face the centre cell, the two rings round it), turned like her face, and lies there flat by
// 30.2 s, a window onto the one picture; when the wall of light hits (37.132 s) they fly back, the sphere whole again by 38.071 s. ----
/** The come and the go: from FOLD.start, the nearest face first, each over `dur`, all flat by FOLD.flat; from PORTAL.aiolos the same order,
 *  each over `back`, the sphere whole by `whole` (her presence's end). gap: the lattice's spacing over two face radii (no two pentagons meet). */
export const HEX = {dur: 0.35, back: 0.4, whole: 38.071, gap: 1.02};
/** The least-cost assignment of n rows to m >= n columns (Kuhn-Munkres with potentials, exact): row -> column. */
function hungarian(cost) {
  const n = cost.length, m = cost[0].length, u = new Array(n + 1).fill(0), v = new Array(m + 1).fill(0), p = new Array(m + 1).fill(0), way = new Array(m + 1).fill(0);
  for (let i = 1; i <= n; i++) {
    p[0] = i;
    let j0 = 0;
    const minv = new Array(m + 1).fill(Infinity), used = new Array(m + 1).fill(false);
    do {
      used[j0] = true;
      const i0 = p[j0];
      let delta = Infinity, j1 = 0;
      for (let j = 1; j <= m; j++) if (!used[j]) {
        const cur = cost[i0 - 1][j - 1] - u[i0] - v[j];
        if (cur < minv[j]) { minv[j] = cur; way[j] = j0; }
        if (minv[j] < delta) { delta = minv[j]; j1 = j; }
      }
      for (let j = 0; j <= m; j++) if (used[j]) { u[p[j]] += delta; v[j] -= delta; } else minv[j] -= delta;
      j0 = j1;
    } while (p[j0] !== 0);
    do { const j1 = way[j0]; p[j0] = p[j1]; j0 = j1; } while (j0);
  }
  const out = new Array(n).fill(-1);
  for (let j = 1; j <= m; j++) if (p[j]) out[p[j] - 1] = j - 1;
  return out;
}
/** A rotation's unit quaternion [w, x, y, z], w >= 0 (Shepperd: stable at a half turn, the far face's). */
function quatOf(m) {
  const tr = m[0][0] + m[1][1] + m[2][2];
  let q;
  if (tr > 0) { const S = Math.sqrt(tr + 1) * 2; q = [S / 4, (m[2][1] - m[1][2]) / S, (m[0][2] - m[2][0]) / S, (m[1][0] - m[0][1]) / S]; }
  else if (m[0][0] > m[1][1] && m[0][0] > m[2][2]) { const S = Math.sqrt(1 + m[0][0] - m[1][1] - m[2][2]) * 2; q = [(m[2][1] - m[1][2]) / S, S / 4, (m[0][1] + m[1][0]) / S, (m[0][2] + m[2][0]) / S]; }
  else if (m[1][1] > m[2][2]) { const S = Math.sqrt(1 + m[1][1] - m[0][0] - m[2][2]) * 2; q = [(m[0][2] - m[2][0]) / S, (m[0][1] + m[1][0]) / S, S / 4, (m[1][2] + m[2][1]) / S]; }
  else { const S = Math.sqrt(1 + m[2][2] - m[0][0] - m[1][1]) * 2; q = [(m[1][0] - m[0][1]) / S, (m[0][2] + m[2][0]) / S, (m[1][2] + m[2][1]) / S, S / 4]; }
  return q[0] < 0 ? q.map((x) => -x) : q;
}
/** The lattice in her face's plane: her face the centre cell; the other eleven take cells of the two rings round it (6 + 12), by the assignment
 *  of least total travel (squared, the box's model space; exact). Each lies flat in her plane, turned like her face (its corners where hers are,
 *  mod 72 deg). {root, faces: [{cell: [x, y] (her face's radii along across and up), at (its centre's place, model space), turn (3x3), angle,
 *  axis, travel, rank (0 the nearest)}], cost (the total squared travel)} */
export function hexCells(pents, root, {gap = HEX.gap} = {}) {
  const R0 = frameOf(pents[root]), d = 2 * gap, axial = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]], cells = axial.map((c) => c);
  for (let k = 0; k < 6; k++) { const [q, r] = axial[k], [q2, r2] = axial[(k + 1) % 6]; cells.push([2 * q, 2 * r], [q + q2, r + r2]); }
  const xy = ([q, r]) => [d * (q + r / 2), d * r * Math.sqrt(3) / 2], pointOf = ([x, y]) => add(add(R0.C, R0.across, x * R0.rho), R0.up, y * R0.rho);
  const others = pents.map((_, i) => i).filter((i) => i !== root);
  const cost = others.map((i) => cells.map((c) => { const q = v3.sub(pents[i].center, pointOf(xy(c))); return dot(q, q); }));
  const pick = hungarian(cost), th0 = cornerAngle(pents[root], R0);
  const faces = pents.map((f, i) => {
    if (i === root) return {cell: [0, 0], at: R0.C, turn: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], angle: 0, axis: [0, 0, 1], travel: 0, rank: -1};
    const cell = xy(cells[pick[others.indexOf(i)]]), at = pointOf(cell);
    return {cell, at, ...layFlat(f, R0, th0), travel: Math.hypot(...v3.sub(at, f.center))};
  });
  others.slice().sort((a, b) => faces[a].travel - faces[b].travel).forEach((i, r) => { faces[i].rank = r; });
  return {root, faces, cost: others.reduce((sum, i, k) => sum + cost[k][pick[k]], 0)};
}
/** The angle of a face's first corner in a frame F (its across and up), radians. */
const cornerAngle = (f, F) => { const q = v3.sub(f.verts[0], F.C); return Math.atan2(dot(q, F.up), dot(q, F.across)); };
/** The turn that lays face f flat in her plane (her frame R0, her first corner at th0): its outside toward the eye, its corners where hers are
 *  (mod 72 deg, the least turn in her plane that does it); {turn (3x3, f's frame onto hers), angle, axis} (one axis, the shortest). */
function layFlat(f, R0, th0) {
  const F = frameOf(f), step = 2 * Math.PI / 5;
  let dl = ((th0 - cornerAngle(f, F)) % step + step) % step;
  if (dl > step / 2) dl -= step;
  const c = Math.cos(dl), s = Math.sin(dl), ac = add(R0.across.map((x) => x * c), R0.up, s), up = add(R0.up.map((x) => x * c), R0.across, -s);
  const turn = [0, 1, 2].map((r) => [0, 1, 2].map((k) => ac[r] * F.across[k] + up[r] * F.up[k] + R0.n[r] * F.n[k]));
  const q = quatOf(turn), l = Math.hypot(q[1], q[2], q[3]);
  return {turn, angle: 2 * Math.atan2(l, q[0]), axis: l > 1e-12 ? [q[1] / l, q[2] / l, q[3] / l] : [0, 0, 1]};
}
/** How far each face is on its way to her plane at second t (0 on the sphere, 1 in its cell), the nearest first both ways. */
export function hexAt(cells, t) {
  const n = cells.faces.length - 1, ease = (k) => { const x = Math.min(1, Math.max(0, k)); return x * x * (3 - 2 * x); };
  const come = (FOLD.flat - FOLD.start - HEX.dur) / Math.max(1, n - 1), go = (HEX.whole - PORTAL.aiolos - HEX.back) / Math.max(1, n - 1);
  return cells.faces.map((f) => {
    if (f.rank < 0 || t <= FOLD.start || t >= HEX.whole) return 0;
    if (t < PORTAL.aiolos) return ease((t - FOLD.start - f.rank * come) / HEX.dur);
    return 1 - ease((t - PORTAL.aiolos - f.rank * go) / HEX.back);
  });
}
/** THE FOLD at second t: {cells, ks, poses} for her face (root). Each pose (4x4 row-major, the box's model space) turns the face about its own
 *  centre by its share of its turn (the shortest, about one axis) while the centre runs straight to its cell. */
export function hexFold(pents, root, t, cells = hexCells(pents, root)) {
  const ks = hexAt(cells, t);
  const poses = pents.map((f, i) => {
    const c = cells.faces[i], k = ks[i];
    if (k <= 0) return I4();
    const R = k >= 1 ? c.turn : axisAngle(c.axis, k * c.angle), at = add(f.center, v3.sub(c.at, f.center), k);
    const Rc = [0, 1, 2].map((r) => R[r][0] * f.center[0] + R[r][1] * f.center[1] + R[r][2] * f.center[2]);
    return [R[0][0], R[0][1], R[0][2], at[0] - Rc[0], R[1][0], R[1][1], R[1][2], at[1] - Rc[1], R[2][0], R[2][1], R[2][2], at[2] - Rc[2], 0, 0, 0, 1];
  });
  return {cells, ks, poses};
}

// ---- THE FOLD AS ONE WINDOW (his Oct 15 2026 00:44 WEST, over his page at Athena's shot with the lattice above on it: "this grid dude is all
// absolutely fucked up. you gotta do differently. when does it stop being a dodecahedron mask??"). His spec of Oct 14 2026 WEST stands, read
// whole: 18:4x "of coruse, the fucking face that we start from means all the other faces are folded onto the main plane... you get what i
// mean?"; 19:03 "UNTIL THE FUCKING WALL OF LIGHT, THE DODECAHEDRON DISAPPEARS, IT IS FOLDED UNTO 1 SINGLE PLANE WHICH IS THE FUCKING PLANE FROM
// WHICH ATHENA IS ALIGNED TO"; 19:11 "we saw her fold the dodechadron lik a fukin origami"; 18:47 "the dodecahedron faces dissolve into 1 single
// window into reality"; 17:19 "the "FRAME" AKA "WINDOW INTO THE SCENE" should expand outwards from the alignment of athena hair"; 19:19 "its come
// and go from plane to back again into sphere when wall of lights hits again". So every face's cell is her own face:
//   - her cut to 30.2 s (FOLD.start to FOLD.flat, hexAt's come): each face turns and slides until it lies on her face's pentagon, in her plane,
//     its corners on hers, the nearest first; the origami closes onto one pentagon (oneCells, hexFold);
//   - 30.2 to 30.5 s (ONE.melt to ONE.gone): that one pentagon dissolves into her window: the window, opening from her hair's join, sweeps past
//     the pentagon's farthest corner (planeWindowAt, geom.swallow) and the pentagon's gold leading melts where it has reached, outward from the
//     join; the faces show the one picture in her plane where they lie, as the window does, so nothing under them moves;
//   - 30.5 s to the wall of light (ONE.gone to PORTAL.aiolos): no face is drawn at all; her window alone, the film's drawing in it, on black;
//   - the wall (PORTAL.aiolos, 37.132 s, a holder's view): the faces come back out of her plane into the sphere from the stacked pentagon, the
//     nearest first, whole at HEX.whole (38.071 s; hexAt's go, its timing unchanged). ----
/** band: her face's radii over which the leading melts inside her window's edge; rim: css px past her face's farthest corner (and the band)
 *  where the window's edge, its gold rim, stands at ONE.gone, so no rim and no leading lie on the pentagon when its faces go. */
export const ONE = {melt: FOLD.flat, gone: 30.5, band: 0.15, rim: 10};
/** The faces are drawn at second t: not from ONE.gone to the wall of light (her window alone), else yes. */
export const facesDrawn = (t) => !(t >= ONE.gone && t < PORTAL.aiolos);
/** Every face onto her face (root), the shape of hexCells with every cell [0, 0]: its centre onto hers, turned flat into her plane with its
 *  outside toward the eye and its corners on hers (layFlat: the least turn, about one axis); rank: the nearest first (her five neighbours, the
 *  five beyond them, the face opposite hers last), a ring's equals in turn round her face. {root, faces: [{cell, at, turn, angle, axis, travel,
 *  rank}], cost (the total squared travel)} */
export function oneCells(pents, root) {
  const R0 = frameOf(pents[root]), th0 = cornerAngle(pents[root], R0);
  const faces = pents.map((f, i) => (i === root ? {cell: [0, 0], at: R0.C, turn: [[1, 0, 0], [0, 1, 0], [0, 0, 1]], angle: 0, axis: [0, 0, 1], travel: 0, rank: -1}
    : {cell: [0, 0], at: R0.C, ...layFlat(f, R0, th0), travel: Math.hypot(...v3.sub(R0.C, f.center))}));
  const round = (i) => { const q = v3.sub(pents[i].center, R0.C), a = Math.atan2(dot(q, R0.up), dot(q, R0.across)); return a < 0 ? a + 2 * Math.PI : a; };
  const key = (i) => Math.round(faces[i].travel * 1e6);
  pents.map((_, i) => i).filter((i) => i !== root).sort((a, b) => key(a) - key(b) || round(a) - round(b)).forEach((i, r) => { faces[i].rank = r; });
  return {root, faces, cost: faces.reduce((sum, f) => sum + f.travel * f.travel, 0)};
}
/** THE FOLD AS ONE WINDOW at second t: {cells, ks, poses, drawn} (hexFold's flight onto her face; drawn: facesDrawn(t)). */
export function oneFold(pents, root, t, cells = oneCells(pents, root)) {
  return {...hexFold(pents, root, t, cells), drawn: facesDrawn(t)};
}

// ---- THE ONE PLANE (his 19:0x WEST): what remains is her face's plane, the window into the scene opening outward IN it from her hair's join
// (in perspective, in front), carrying the film laid in her face's picture plane, until the wall of light closes it to white ----
/** Her face's plane in the page's view space (the box canvas's world: the eye at (0, 0, EYE)): n.p + d = 0, and its picture frame; corners:
 *  her pentagon's five corners in the plane's (u0, v0), her face's radii (the faces stacked on her in THE FOLD AS ONE WINDOW lie there). */
export function herPlane(face, spin) {
  const f = frameOf(face), n = rotate(f.n, spin.yaw, spin.pitch), C = rotate(f.C, spin.yaw, spin.pitch);
  const corners = face.verts.map((p) => { const q = v3.sub(p, f.C); return [dot(q, f.across) / f.rho, -dot(q, f.up) / f.rho]; });
  return {n, d: -dot(n, C), C, across: rotate(f.across, spin.yaw, spin.pitch), up: rotate(f.up, spin.yaw, spin.pitch), rho: f.rho, corners};
}
/** The eye's ray through a point of the view space met with her plane, read as the one picture (zoomed z about join): the faces as windows
 *  onto the picture in her plane (THE MASK's look: the picture holds, the faces move over it). The JS twin of CUBIST_PLANE_GLSL. */
export function pictureAtRay(point, plane, {join = [0, 0], z = 1} = {}, eye = [0, 0, EYE]) {
  const r = v3.sub(point, eye), den = dot(plane.n, r);
  if (Math.abs(den) < 1e-12) return null;
  const k = -(dot(plane.n, eye) + plane.d) / den, hit = v3.add(eye, v3.scale(r, k)), q = v3.sub(hit, plane.C);
  const u0 = dot(q, plane.across) / plane.rho, v0 = -dot(q, plane.up) / plane.rho, u = join[0] + (u0 - join[0]) / z, v = join[1] + (v0 - join[1]) / z;
  return {u, v, u0, v0, fx: 480 + 270 * u, fy: 270 * (v + 1)};
}
/** The window's reach in her plane: the stage's corners' eye rays met with her plane, the farthest from the join (in her face's radii), and the
 *  zoom about the join the window grows to (at most 8). cover 'above' (default): the least zoom at which the film's picture (columns 82..877)
 *  covers the stage above her join and to its left; her hair's join sits near the picture's lower right (u 1.34, v 0.66), so that is about 2.3,
 *  the fight stays readable and her body stands below the picture in the page's black. cover 'stage': the picture covers the stage's left and
 *  its whole height at the box's column (the first rule, Oct 14 19:0x): the zoom then runs to the cap and the window shows a blur of her hair
 *  and the sky through her face shot (the frames of 19:3x WEST). at: the join on the stage (css px). swallow (THE FOLD AS ONE WINDOW): the
 *  radius at which the window holds her whole face with its leading melted and its rim clear of it (her farthest corner from the join, ONE.band
 *  more, and ONE.rim css px at her face's scale on the stage); 0 for a plane with no corners. */
export function planeWindowGeometry(plane, join, centre, R, w, h, {cover = 'above'} = {}) {
  const cornerRay = (x, y) => [(x - centre[0]) / R, -(y - centre[1]) / R, 0], U0 = (82 - 480) / 270, U1 = (878 - 480) / 270;
  const at = (x, y) => pictureAtRay(cornerRay(x, y), plane);
  const corners = [[0, 0], [w, 0], [0, h], [w, h]].map(([x, y]) => at(x, y)).filter(Boolean);
  const reach = Math.max(...corners.map((c) => Math.hypot(c.u0 - join[0], c.v0 - join[1])));
  const P = add(add(plane.C, plane.across, join[0] * plane.rho), plane.up, -join[1] * plane.rho), [jx, jy] = project(P, centre, R);
  let zFull = 1;
  const need = (cover === 'stage' ? [[0, 0], [0, h], [w * 0.55, 0], [w * 0.55, h]] : [[0, 0], [0, jy], [jx, 0]]).map(([x, y]) => at(x, y)).filter(Boolean);
  for (const c of need) {
    const du = c.u0 - join[0], dv = c.v0 - join[1];
    if (du < 0) zFull = Math.max(zFull, du / (U0 - join[0])); else if (du > 0) zFull = Math.max(zFull, du / (U1 - join[0]));
    if (dv < 0) zFull = Math.max(zFull, dv / (-1 - join[1])); else if (dv > 0) zFull = Math.max(zFull, dv / (1 - join[1]));
  }
  const [c0x, c0y] = project(plane.C, centre, R), [c1x, c1y] = project(add(plane.C, plane.across, plane.rho), centre, R), px = Math.hypot(c1x - c0x, c1y - c0y);
  const swallow = plane.corners ? Math.max(...plane.corners.map(([u, v]) => Math.hypot(u - join[0], v - join[1]))) + ONE.band + ONE.rim / Math.max(px, 1e-6) : 0;
  return {reach, zFull: Math.min(zFull, ZOOM_MAX), join, at: [jx, jy], swallow};
}
/** The window in her plane at second t (her face's radii from the join): it opens at PORTAL.open, a face's radius in its first 0.1 s (the
 *  wave), then grows to the reach by PORTAL.grown as the picture's zoom goes 1 to zFull; from PORTAL.aiolos the wall of light runs out from
 *  her and leaves white behind it, closed at PORTAL.closed. {r, z, wall} (wall -1 before Aiolos).
 *  THE FOLD AS ONE WINDOW (his Oct 15 2026 00:44 WEST, "when does it stop being a dodecahedron mask??"): with geom.swallow, from ONE.melt to
 *  ONE.gone (30.2 to 30.5 s) the window sweeps out from her hair's join past the one folded pentagon (to geom.swallow, eased), so the pentagon
 *  dissolves into it and its faces can go at 30.5 s with nothing under them changing; from there it grows to the reach by PORTAL.grown as
 *  before (eased from rest, so it never jumps nor shrinks). Before ONE.melt, and the zoom throughout, as they were. */
export function planeWindowAt(t, geom) {
  const ease = (k) => k * k * (3 - 2 * k), k01 = (k) => Math.min(1, Math.max(0, k));
  const grow = (x) => ease(k01((x - PORTAL.waveEnd) / (PORTAL.grown - PORTAL.waveEnd)));
  const radius = (k) => {
    if (!(geom.swallow > 0) || t < ONE.melt) return 1 + (geom.reach - 1) * k;
    const r0 = 1 + (geom.reach - 1) * grow(ONE.melt), s = Math.max(geom.swallow, r0);
    if (t < ONE.gone) return r0 + (s - r0) * ease(k01((t - ONE.melt) / (ONE.gone - ONE.melt)));
    return s + Math.max(0, geom.reach - s) * ease(k01((t - ONE.gone) / (PORTAL.grown - ONE.gone)));
  };
  const w = t < PORTAL.open || t >= PORTAL.closed ? {r: 0, z: 1} : t < PORTAL.waveEnd ? {r: (t - PORTAL.open) / (PORTAL.waveEnd - PORTAL.open), z: 1}
    : (() => { const k = grow(t); return {r: radius(k), z: 1 + (geom.zFull - 1) * k}; })();
  return {...w, wall: t < PORTAL.aiolos ? -1 : geom.reach * k01((t - PORTAL.aiolos) / (PORTAL.closed - PORTAL.aiolos))};
}
/** For a shader that draws her plane's window (or a face as a window onto it): the uniforms at second t. plane: herPlane; geom:
 *  planeWindowGeometry; all in the box canvas's world (the page's view space). */
export function planeUniforms(plane, geom, t) {
  const w = planeWindowAt(t, geom);
  return {uHerN: plane.n, uHerD: plane.d, uHerC: plane.C, uHerAcross: plane.across, uHerUp: plane.up, uHerRho: plane.rho, uHerJoin: geom.join,
    uHerZoom: w.z, uHerR: w.r, uHerWall: w.wall};
}
/** The same in GLSL: herPictureUV(worldPos) gives the film's texture coordinates of the whole frame (x right, y down: (480 + 270u)/960,
 *  270(v + 1)/540) where the eye's ray through worldPos meets her plane, and herWindow(worldPos) 1 inside the window and outside the wall, 0
 *  else; herInPicture(uv) 1 on the picture (no pillarbox). cameraPosition is three's. */
export const CUBIST_PLANE_GLSL = `
uniform vec3 uHerN; uniform float uHerD; uniform vec3 uHerC; uniform vec3 uHerAcross; uniform vec3 uHerUp; uniform float uHerRho;
uniform vec2 uHerJoin; uniform float uHerZoom; uniform float uHerR; uniform float uHerWall;
vec2 herPlaneUV0(vec3 worldPos) {
  vec3 r = worldPos - cameraPosition;
  float k = -(dot(uHerN, cameraPosition) + uHerD) / dot(uHerN, r);
  vec3 q = cameraPosition + r * k - uHerC;
  return vec2(dot(q, uHerAcross), -dot(q, uHerUp)) / uHerRho;
}
vec2 herPictureUV(vec3 worldPos) {
  vec2 uv = uHerJoin + (herPlaneUV0(worldPos) - uHerJoin) / uHerZoom;
  return vec2((480.0 + 270.0 * uv.x) / 960.0, 270.0 * (uv.y + 1.0) / 540.0);
}
float herInPicture(vec2 tex) { return step(82.0 / 960.0, tex.x) * step(tex.x, 878.0 / 960.0) * step(0.0, tex.y) * step(tex.y, 1.0); }
float herWindow(vec3 worldPos) { float d = length(herPlaneUV0(worldPos) - uHerJoin); return step(d, uHerR) * step(uHerWall, d); }
`;

/** The one picture: a point of her face's plane (model space) to the film's square (u, v) and the film's pixel (fx, fy): decal() extended,
 *  and zoomed z times about her hair's join (join: its (u, v)) so the picture covers the whole flat net while the film's hair still meets hers
 *  there (z 1: the face's own scale, where the film's picture covers about a face and a half of the net). */
export function pictureOf(rootFace, p, {join = [0, 0], z = 1} = {}) {
  const {C, across, up, rho} = frameOf(rootFace), q = v3.sub(p, C), u0 = dot(q, across) / rho, v0 = -dot(q, up) / rho;
  const u = join[0] + (u0 - join[0]) / z, v = join[1] + (v0 - join[1]) / z;
  return {u, v, fx: 480 + 270 * u, fy: 270 * (v + 1)};
}
/** Her hair's join in her face's picture: her head joint (her shot's fitted pose, herAt at second t) carried onto her face's plane along the
 *  eye's ray, read as (u, v). The point the one picture is zoomed about. */
export function joinOnFace(pents, spin, t, root) {
  const on = herAt(t, pents, spin, {shot: shotOf(t), face: root}), M = on.matrix;
  const head = [0, 1, 2].map((i) => M[i * 4] * HEAD[0] + M[i * 4 + 1] * HEAD[1] + M[i * 4 + 2] * HEAD[2] + M[i * 4 + 3]);
  const f = frameOf(pents[root]), n = rotate(f.n, spin.yaw, spin.pitch), c = rotate(f.C, spin.yaw, spin.pitch), E = [0, 0, EYE];
  const d = v3.sub(head, E), k = dot(n, v3.sub(c, E)) / dot(n, d), hit = v3.add(E, v3.scale(d, k));
  const cp = Math.cos(spin.pitch), sp = Math.sin(spin.pitch), y1 = hit[1] * cp + hit[2] * sp, z1 = -hit[1] * sp + hit[2] * cp, cy = Math.cos(spin.yaw), sy = Math.sin(spin.yaw);
  const pm = [hit[0] * cy + z1 * sy, y1, -hit[0] * sy + z1 * cy], r = pictureOf(pents[root], pm);
  return [r.u, r.v];
}
/** The least zoom about the join at which the film's picture (columns 82..877, no pillarbox) covers every corner of the flat net. */
export function coverZoom(pents, tree, join) {
  const poses = foldPose(pents, tree, pents.map(() => 1), 'out'), root = pents[tree.root], U0 = (82 - 480) / 270, U1 = (878 - 480) / 270;
  let z = 1;
  for (let i = 0; i < pents.length; i++) for (const c of pents[i].verts) {
    const {u, v} = pictureOf(root, at4(poses[i], c)), du = u - join[0], dv = v - join[1];
    if (du > 0) z = Math.max(z, du / (U1 - join[0])); else if (du < 0) z = Math.max(z, du / (U0 - join[0]));
    if (dv > 0) z = Math.max(z, dv / (1 - join[1])); else if (dv < 0) z = Math.max(z, dv / (-1 - join[1]));
  }
  return z;
}
/** For the box's shader: each face's corners (and its centre) as the film's square (u, v) where the flat net lays them, so a face shows its
 *  own part of the one picture. [[[u, v] per corner], [u, v] of its centre] per face. */
export function netDecal(pents, tree, zoom = {}) {
  const poses = foldPose(pents, tree, pents.map(() => 1), 'out'), root = pents[tree.root];
  return pents.map((f, i) => ({corners: f.verts.map((p) => { const d = pictureOf(root, at4(poses[i], p), zoom); return [d.u, d.v]; }),
    centre: (() => { const d = pictureOf(root, at4(poses[i], f.center), zoom); return [d.u, d.v]; })()}));
}

// ---- THE FILM'S LIGHT ON HER (his 19:1x WEST: "also the fucking lightining dude come on... you have the chance to turn the entire background
// black there... make it fucking immersive... she has fucking tore through space and time dude"; the coordinator's ask 2: from the fold to the
// wall of light the page goes black, the box seat draws the black, and her looks take the film's light, not the page's flat white light) ----
// Measured by cubism.light.mjs (the new Mac, 2026-10-14T18:22Z, 255 frames, 6 s): in bins of 6 frames, her drawn hair's shadow and lit tones
// (its 20th and 90th percentile of luminance) over her glb hair's own (sRGB albedo: shade 153, 94, 160; lit 188, 137, 186), as linear
// multipliers, and the gold light on her hair and at its edge (its linear colour; its share of her hair as a rim band in |n.v|, the square root
// of the share). What the film does, read: over her shoulder (to 33.567 s) her hair at 0.6 to 0.95 of her own colour with a teal shadow and no
// gold; in her face shot she is lit bright (to 2.4x in green: her hair goes pale lilac), gold glints in its last second; from the column
// (36.570 s) dark navy, 0.07 to 0.3, with a pale gold edge (linear 0.41, 0.37, 0.19), and the flood lifts the shadow to 0.2 to 0.58. Bins'
// spread over their frames (the floor): 0.3 to 3 of 255 in the shoulder shot, up to 21 where the face shot's light turns (1048 to 1066), and
// 3 to 45 in the column and the flood (the beam moves on her hair).
export const FILM_LIGHT = {"at":"2026-10-14T18:22:06.749Z","frames":[886,1141],"bin":6,"albedo":{"shade":[153,94,160],"lit":[187.8,137.3,185.8]},"bins":[[886,892,[0.643,0.9,0.651],[0.604,0.532,0.68],[0,0,0],0.007],[892,898,[0.646,0.9,0.651],[0.616,0.549,0.697],[0,0,0],0.015],[898,904,[0.664,0.919,0.664],[0.629,0.579,0.712],[0,0,0],0.009],[904,910,[0.669,0.944,0.675],[0.632,0.571,0.726],[0,0,0],0.008],[910,916,[0.663,0.919,0.665],[0.647,0.584,0.736],[0,0,0],0],[916,922,[0.661,0.923,0.671],[0.624,0.576,0.71],[0,0,0],0],[922,928,[0.665,0.922,0.671],[0.641,0.583,0.725],[0,0,0],0],[928,934,[0.67,0.92,0.67],[0.639,0.589,0.725],[0,0,0],0],[934,940,[0.674,0.945,0.677],[0.636,0.584,0.728],[0,0,0],0.014],[940,946,[0.684,0.953,0.685],[0.658,0.604,0.751],[0,0,0],0],[946,952,[0.682,0.924,0.683],[0.648,0.589,0.732],[0,0,0],0.014],[952,958,[0.669,0.906,0.674],[0.645,0.575,0.737],[0,0,0],0.023],[958,964,[0.683,0.92,0.681],[0.644,0.593,0.731],[0,0,0],0],[964,970,[0.671,0.91,0.672],[0.643,0.579,0.735],[0,0,0],0],[970,976,[0.673,0.916,0.667],[0.649,0.583,0.739],[0,0,0],0.006],[976,982,[0.689,0.934,0.682],[0.636,0.575,0.723],[0,0,0],0],[982,988,[0.67,0.925,0.67],[0.639,0.576,0.727],[0,0,0],0],[988,994,[0.691,0.934,0.687],[0.637,0.583,0.725],[0,0,0],0.008],[994,1000,[0.685,0.942,0.681],[0.637,0.581,0.725],[0,0,0],0],[1000,1006,[0.675,0.937,0.668],[0.65,0.592,0.737],[0,0,0],0],[1006,1012,[0.374,0.581,0.561],[0.937,1.476,0.934],[0,0,0],0.022],[1012,1018,[0.381,0.589,0.571],[0.964,1.511,0.956],[0,0,0],0.018],[1018,1024,[0.375,0.585,0.566],[0.929,1.484,0.956],[0,0,0],0.036],[1024,1030,[0.373,0.58,0.563],[0.918,1.442,0.918],[0,0,0],0.013],[1030,1036,[0.379,0.589,0.574],[0.958,1.489,0.942],[0,0,0],0.008],[1036,1042,[0.374,0.581,0.563],[0.924,1.455,0.951],[0,0,0],0.011],[1042,1048,[0.371,0.573,0.558],[0.891,1.391,0.905],[0,0,0],0.016],[1048,1054,[0.485,0.777,0.569],[0.972,1.504,0.93],[0,0,0],0.011],[1054,1060,[0.876,1.782,0.719],[1.106,1.664,0.953],[0,0,0],0.016],[1060,1066,[1.081,2.259,0.906],[1.308,1.946,1.111],[0,0,0],0.037],[1066,1072,[0.969,2.135,0.781],[1.43,2.086,1.205],[0,0,0],0.04],[1072,1078,[1.091,2.374,0.86],[1.472,2.184,1.246],[0.49,0.439,0.238],0.099],[1078,1084,[1.103,2.439,0.906],[1.435,2.174,1.23],[0.49,0.426,0.237],0.096],[1084,1090,[0.903,1.977,0.729],[1.445,2.173,1.222],[0.472,0.39,0.232],0.074],[1090,1096,[1.057,2.26,0.804],[1.429,2.158,1.219],[0.479,0.419,0.23],0.066],[1096,1102,[0.073,0.21,0.127],[0.076,0.144,0.157],[0.412,0.372,0.189],0.081],[1102,1108,[0.09,0.26,0.167],[0.129,0.33,0.347],[0.402,0.364,0.191],0.095],[1108,1115,[0.11,0.304,0.209],[0.242,0.702,0.653],[0.426,0.377,0.201],0.047],[1115,1121,[0.16,0.466,0.298],[0.322,0.888,0.735],[0.417,0.371,0.206],0.06],[1121,1127,[0.175,0.519,0.328],[0.257,0.705,0.619],[0,0,0],0.04],[1127,1133,[0.187,0.541,0.304],[0.208,0.542,0.498],[0.45,0.426,0.209],0.051],[1133,1141,[0.197,0.583,0.357],[0.221,0.567,0.5],[0.412,0.412,0.178],0.066]]};
const linOf = (c) => { const x = c / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; };
const LUM = [0.2126, 0.7152, 0.0722], lumOf = (c) => dot(LUM, c);
const ALBEDO = {shade: FILM_LIGHT.albedo.shade.map(linOf), lit: FILM_LIGHT.albedo.lit.map(linOf)};
/** Her glb hair's own hue, as a direction of chroma (linear RGB less its luminance), unit: what of her takes the film hair's hue. */
export const HER_HAIR_CHROMA = (() => { const m = ALBEDO.shade.map((a, c) => (a + ALBEDO.lit[c]) / 2), y = lumOf(m), d = m.map((x) => x - y); return unit(d); })();
/** The film's light on her at second t, or null outside her span. The bins' measured tones, linear between the bins' middles inside a shot
 *  and cut at the film's cuts (SHOTS), as a light that carries to all of her, not her hair alone (a per-channel ratio of the drawn hair over
 *  hers turned her skin green and her dress cyan in the column's light: the two palettes differ in hue, not only in light):
 *  - gain, lift: her luminance mapped so her hair's own 20th and 90th percentile land on the drawn hair's (scalars, linear);
 *  - tone: the drawn hair's colour at unit luminance (the mean of its two tones), which her hair-coloured parts take (HER_HAIR_CHROMA);
 *    her skin and the white of her dress keep their own colour at the mapped luminance;
 *  - rim: the gold's linear colour; rimWidth: its band in |n.v| (0: none). */
export function filmLightAt(t) {
  const n = t * 30000 / 1001, bins = FILM_LIGHT.bins, i = bins.findIndex(([a, z]) => n >= a && n < z);
  if (i < 0) return null;
  const shot = shotOf(t), mid = (b) => (b[0] + b[1]) / 2, here = bins[i];
  const j = n < mid(here) ? i - 1 : i + 1, there = bins[j], sameShot = there && shotOf(mid(there) * 1001 / 30000) === shot;
  const k = sameShot ? Math.min(1, Math.abs(n - mid(here)) / Math.abs(mid(there) - mid(here))) : 0, lerp = (a, b) => a.map((x, c) => x + (b[c] - x) * k);
  const shade = sameShot ? lerp(here[2], there[2]) : here[2], lit = sameShot ? lerp(here[3], there[3]) : here[3];
  const rim = sameShot ? lerp(here[4], there[4]) : here[4], rimWidth = sameShot ? here[5] + (there[5] - here[5]) * k : here[5];
  const lo = ALBEDO.shade.map((a, c) => a * shade[c]), hi = ALBEDO.lit.map((a, c) => a * lit[c]), Ylo = lumOf(lo), Yhi = lumOf(hi);
  const gain = (Yhi - Ylo) / (lumOf(ALBEDO.lit) - lumOf(ALBEDO.shade)), lift = Ylo - gain * lumOf(ALBEDO.shade);
  const tone = lo.map((x, c) => (x + hi[c]) / (Ylo + Yhi));
  return {gain, lift, tone, rim, rimWidth: rim.some((x) => x > 0) ? rimWidth : 0, shade, lit};
}
/** The page's own light (warm-sphere.js: up and to the left, toward the eye), in the box canvas's view space: the form term's key. */
export const HER_KEY = [-0.32, 0.7, 0.64].map((v) => v / Math.hypot(-0.32, 0.7, 0.64));
const smooth = (a, b, x) => { const k = Math.min(1, Math.max(0, (x - a) / (b - a))); return k * k * (3 - 2 * k); };
/** How much of an albedo takes the film hair's tone: 1 for her hair's own hue (and the lilac of her dress), 0 for her skin and for white. */
export function toneShareOf(albedo) {
  const y = lumOf(albedo), d = albedo.map((x) => x - y), l = Math.hypot(...d);
  return l < 1e-6 ? 0 : smooth(0.6, 0.9, dot(d, HER_HAIR_CHROMA) / l) * smooth(0.015, 0.05, l);
}
/** Her look in the film's light, the JS twin of HER_LIGHT_GLSL: her luminance mapped (gain, lift); her hair-coloured parts in the drawn hair's
 *  tone, the rest in its own colour at that luminance; times her form (1 - form/2 + form n.key, a mean of about 1: the film is flat, her 3D
 *  shape still reads); plus the gold at her edge. albedo linear; n, v: unit, view space (v toward the eye). */
export function filmLit(albedo, n, v, L, {form = 0.3, key = HER_KEY} = {}) {
  const shape = 1 - form / 2 + form * Math.max(0, dot(n, key)), nv = Math.abs(dot(n, v));
  const edge = L.rimWidth > 0 ? 1 - smooth(0, 1, nv / L.rimWidth) : 0;
  const y0 = lumOf(albedo), y = Math.max(0, y0 * L.gain + L.lift), h = toneShareOf(albedo);
  return albedo.map((a, c) => ((1 - h) * a * y / Math.max(y0, 1e-4) + h * L.tone[c] * y) * shape + L.rim[c] * edge);
}
/** The uniforms for HER_LIGHT_GLSL at second t: uHerFilm 1 inside her span (her looks in the film's light), 0 outside (the page's light). */
export function herLightUniforms(t, {form = 0.3, key = HER_KEY} = {}) {
  const L = filmLightAt(t);
  return L ? {uHerGain: L.gain, uHerLift: L.lift, uHerTone: L.tone, uHerRim: L.rim, uHerRimWidth: L.rimWidth, uHerForm: form, uHerKey: key, uHerFilm: 1}
    : {uHerGain: 1, uHerLift: 0, uHerTone: [1, 1, 1], uHerRim: [0, 0, 0], uHerRimWidth: 0, uHerForm: form, uHerKey: key, uHerFilm: 0};
}
/** Her looks' light in GLSL, for a lit material (her own, MeshStandardMaterial): declared before main(), and her colour taken in the film's
 *  light just before <opaque_fragment> (normal and vViewPosition: three's view space). herLight(shader, uniforms) does both (uniforms: the
 *  page's own holders, {uHerGain: {value}, ...}, set each draw from herLightUniforms(t)) and says whether it patched; a material with no
 *  lights (her normals, her gold matte) is left as it is. Chain it after herClip in the same onBeforeCompile, compiled at load with uHerFilm 0. */
export const HER_LIGHT_GLSL = `
uniform float uHerGain; uniform float uHerLift; uniform vec3 uHerTone; uniform vec3 uHerRim; uniform float uHerRimWidth; uniform float uHerForm;
uniform vec3 uHerKey; uniform float uHerFilm;
vec3 herFilmLit(vec3 albedo, vec3 n, vec3 v) {
  const vec3 LUM = vec3(0.2126, 0.7152, 0.0722);
  const vec3 HAIR = vec3(${HER_HAIR_CHROMA.map((x) => x.toFixed(6)).join(', ')});
  float shape = 1.0 - 0.5 * uHerForm + uHerForm * max(dot(n, uHerKey), 0.0);
  float edge = uHerRimWidth > 0.0 ? 1.0 - smoothstep(0.0, 1.0, abs(dot(n, v)) / uHerRimWidth) : 0.0;
  float y0 = dot(albedo, LUM), y = max(y0 * uHerGain + uHerLift, 0.0);
  vec3 d = albedo - y0; float l = length(d);
  float h = l < 1e-6 ? 0.0 : smoothstep(0.6, 0.9, dot(d, HAIR) / l) * smoothstep(0.015, 0.05, l);
  return (mix(albedo * (y / max(y0, 1e-4)), uHerTone * y, h)) * shape + uHerRim * edge;
}
`;
export function herLight(shader, uniforms) {
  if (!shader.fragmentShader.includes('#include <lights_fragment_begin>') || !shader.fragmentShader.includes('#include <opaque_fragment>')) return false;
  Object.assign(shader.uniforms, uniforms);
  shader.fragmentShader = shader.fragmentShader.replace('void main() {', `${HER_LIGHT_GLSL}\nvoid main() {`)
    .replace('#include <opaque_fragment>', 'outgoingLight = mix(outgoingLight, herFilmLit(diffuseColor.rgb, normalize(normal), normalize(vViewPosition)), uHerFilm);\n\t#include <opaque_fragment>');
  return true;
}

// ---- THE FIT (cubism.fit.mjs, 2026-10-14T15:28Z, R 180 px, the sphere's pitch -0.12; 2 seeds x 60 generations x 24, 2808 evaluations a class) ----
// Per class of face (the pentagon's corners in its decal frame): the face and yaw it was fitted at, the yaws where chooseFace picks it, her place
// (u, v, w box radii; s box radii a metre; theta, psi, phi radians), the join at that view (gap and mismatch px, angle deg), over the twelve
// views a shot spans (gapMean, gapMax px), and the noise floor (the gap's spread over the shot's 120 frames at the fitted view, px).
export const FIT = { "R": 180, "pitch": -0.12, "classes": { "-108,-36,36,108,180": { "face": "pent:9", "yawDeg": 22, "window": [ 357, 47 ], "local": { "u": 0.7037, "v": -0.4026, "w": 0.0831, "s": 4.0058, "theta": 0.7085, "psi": 0.3565, "phi": 0.094 }, "join": { "gap": 14.6, "mismatch": 32, "angle": 57.4 }, "views": { "gapMean": 25.88, "gapMax": 47.62 }, "floor": 11.38 }, "-126,-54,18,90,162": { "face": "pent:2", "yawDeg": 234, "window": [ 228, 240 ], "local": { "u": 0.801, "v": -0.6644, "w": 0.4858, "s": 4.6467, "theta": 0.2754, "psi": -0.0416, "phi": 0.4627 }, "join": { "gap": 5.56, "mismatch": 11, "angle": 46.8 }, "views": { "gapMean": 11.78, "gapMax": 30.8 }, "floor": 9.77 }, "-144,-72,0,72,144": { "face": "pent:8", "yawDeg": 90, "window": [ 61, 119 ], "local": { "u": 1.0961, "v": 0.6481, "w": 0.0842, "s": 1.8029, "theta": 0.7684, "psi": -0.4056, "phi": -0.3938 }, "join": { "gap": 14.63, "mismatch": 41, "angle": 41.1 }, "views": { "gapMean": 21.09, "gapMax": 39.63 }, "floor": 11.99 }, "-162,-90,-18,54,126": { "face": "pent:4", "yawDeg": 328, "window": [ 300, 356 ], "local": { "u": 1.2586, "v": 0.8232, "w": 0.2313, "s": 1.9909, "theta": 0.7656, "psi": -0.645, "phi": -0.2259 }, "join": { "gap": 14.07, "mismatch": 37, "angle": 16.7 }, "views": { "gapMean": 16.63, "gapMax": 32.31 }, "floor": 8.5 } } };

// ---- THE SHOTS' FITS: her face (FIT2) and over her shoulder at the column (FIT3), as FIT above; FITS by SHOTS' order ----
// her face, the prow (cubism.fit.mjs 2026-10-14T16:55Z: frames 1006 to 1086, seen from the front, her hair hue 262 to 336)
export const FIT2 = {"R":180,"pitch":-0.12,"frames":[1006,1086],"classes":{"-144,-72,0,72,144":{"face":"pent:8","yawDeg":159,"window":[135,183],"local":{"u":-0.1651,"v":-0.9062,"w":0.9002,"s":3.0856,"theta":-0.6968,"psi":3.1113,"phi":0.0159},"join":{"gap":10.75,"mismatch":51,"angle":30.8},"views":{"gapMean":30.59,"gapMax":82.32},"floor":38.92},"-162,-90,-18,54,126":{"face":"pent:4","yawDeg":32,"window":[4,60],"local":{"u":-0.4069,"v":-0.2767,"w":0.7751,"s":2.5102,"theta":-0.5116,"psi":3.1193,"phi":-0.3035},"join":{"gap":6.63,"mismatch":35,"angle":42.9},"views":{"gapMean":35.68,"gapMax":81.39},"floor":38.48},"-108,-36,36,108,180":{"face":"pent:9","yawDeg":90,"window":[61,119],"local":{"u":-0.3788,"v":-0.6858,"w":0.2831,"s":2.6079,"theta":0.3308,"psi":3.7413,"phi":0.3238},"join":{"gap":19.9,"mismatch":82,"angle":33},"views":{"gapMean":29.51,"gapMax":71.29},"floor":22.84},"-126,-54,18,90,162":{"face":"pent:2","yawDeg":307,"window":[300,314],"local":{"u":-0.6634,"v":1.123,"w":1.6,"s":3.6291,"theta":0.5908,"psi":2.9178,"phi":0.3353},"join":{"gap":14.3,"mismatch":41,"angle":44.7},"views":{"gapMean":10.45,"gapMax":22.68},"floor":22.88}}};
// over her shoulder, the column (cubism.fit.mjs 2026-10-14T16:48Z: frames 1096 to 1115, her hair hue 215 to 300)
export const FIT3 = {"R":180,"pitch":-0.12,"frames":[1096,1115],"classes":{"-108,-36,36,108,180":{"face":"pent:9","yawDeg":22,"window":[357,47],"local":{"u":0.945,"v":0.5251,"w":0.1111,"s":1.7244,"theta":0.9125,"psi":0.3633,"phi":-0.431},"join":{"gap":63.85,"mismatch":51,"angle":90},"views":{"gapMean":15.61,"gapMax":63.85},"floor":2.69},"-126,-54,18,90,162":{"face":"pent:2","yawDeg":234,"window":[228,240],"local":{"u":1.6605,"v":-0.061,"w":0.2258,"s":3.7301,"theta":0.9629,"psi":-0.1509,"phi":0.1967},"join":{"gap":2.5,"mismatch":5,"angle":58.3},"views":{"gapMean":16.32,"gapMax":39.4},"floor":10.38},"-144,-72,0,72,144":{"face":"pent:8","yawDeg":90,"window":[61,119],"local":{"u":1.0271,"v":0.7385,"w":0.586,"s":2.7449,"theta":0.8957,"psi":0.4287,"phi":-0.2936},"join":{"gap":16.26,"mismatch":34,"angle":54},"views":{"gapMean":20.2,"gapMax":61.32},"floor":2.26},"-162,-90,-18,54,126":{"face":"pent:4","yawDeg":328,"window":[300,356],"local":{"u":0.8126,"v":0.5566,"w":0.5056,"s":2.3551,"theta":0.8038,"psi":0.1058,"phi":-0.0134},"join":{"gap":14,"mismatch":28,"angle":50.5},"views":{"gapMean":16.66,"gapMax":37.63},"floor":9.31}}};
export const FITS = [FIT, FIT2, FIT3];

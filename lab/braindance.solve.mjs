// braindance.solve.mjs: THE FILM'S OWN RAYS. His words, Oct 14 2026 15:4x WEST: object permanence and non-deformation plus the trajectories of
// keypoints are the rays that collapse the uncertainty; 14:5x: "IT IS VECTORIAL SPACES AND NORMAL DISTRIBUTIONS ALL THE WAY DOWN".
//
// What this is: the arithmetic that turns 2D marks of a rigid body's keypoints in a frame of the film (pixels) into the body's pose in the
// camera's frame (a rotation and a translation, metres), the shot's focal length, the reprojection residual (pixels) and a covariance (metres
// squared) read off the solve's own normal matrix; and the tracker that carries the marks frame to frame (a pyramidal Lucas-Kanade of this
// lane's own: no cv2 on this Mac) so that the same keypoints are measured in every frame of a shot (object permanence) with the distances
// between them fixed by the body's known shape (non-deformation). Nothing here draws; nothing here knows the film: braindance.measure.mjs
// feeds it the marks (braindance.marks.json), the shapes and the frames, and writes the record.
//
// Conventions: the camera is the computer-vision one (x right, y DOWN, z forward); a point X of the body (metres, the body's own frame, y up)
// lands at u = cx + f * Xc.x / Xc.z, v = cy + f * Xc.y / Xc.z with Xc = R X + t. A pose is {rv, t}: rv a rotation vector (Rodrigues), t metres.
// A focal f is in pixels of the 960 x 540 frame (f = (H / 2) / tan(fov / 2), fov the vertical field of view). The world is braindance.json's
// (the fight's ground at the origin, y up, z towards Athena); a camera's world pose follows from a body whose world pose is known.
//
// COST: a pose solve is a Levenberg-Marquardt on 6 (or 7 with the focal) parameters with a numeric Jacobian, 8 to 24 rows: tens of
// microseconds a frame in V8 (braindance.solve.test.mjs times it). A shot solve shares one focal across its frames by an arrow-shaped normal
// matrix (one dense row and column for f, a 6 x 6 block a frame): linear in the frames. The tracker: 3 levels, 15 x 15 windows, 12 iterations
// at most a level, bilinear reads: about 0.1 ms a point a frame.

/* ---------------- small dense linear algebra (flat row-major arrays) ---------------- */

/** Solve A x = b for x (A n x n flat, b length n), Gaussian elimination with partial pivoting; A and b are copied. */
export function solveLinear(A, b, n) {
  const M = Float64Array.from(A), y = Float64Array.from(b);
  for (let c = 0; c < n; c++) {
    let p = c, best = Math.abs(M[c * n + c]);
    for (let r = c + 1; r < n; r++) { const v = Math.abs(M[r * n + c]); if (v > best) { best = v; p = r; } }
    if (best < 1e-300) throw new Error(`solveLinear: singular at column ${c}`);
    if (p !== c) { for (let k = 0; k < n; k++) { const s = M[c * n + k]; M[c * n + k] = M[p * n + k]; M[p * n + k] = s; } const s = y[c]; y[c] = y[p]; y[p] = s; }
    for (let r = c + 1; r < n; r++) {
      const g = M[r * n + c] / M[c * n + c];
      if (!g) continue;
      for (let k = c; k < n; k++) M[r * n + k] -= g * M[c * n + k];
      y[r] -= g * y[c];
    }
  }
  const x = new Float64Array(n);
  for (let r = n - 1; r >= 0; r--) { let s = y[r]; for (let k = r + 1; k < n; k++) s -= M[r * n + k] * x[k]; x[r] = s / M[r * n + r]; }
  return x;
}

/** The inverse of A (n x n flat), column by column. */
export function invert(A, n) {
  const out = new Float64Array(n * n);
  for (let c = 0; c < n; c++) {
    const e = new Float64Array(n); e[c] = 1;
    const x = solveLinear(A, e, n);
    for (let r = 0; r < n; r++) out[r * n + c] = x[r];
  }
  return out;
}

export const mul3 = (A, B) => { const o = new Array(9).fill(0); for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) for (let k = 0; k < 3; k++) o[i * 3 + j] += A[i * 3 + k] * B[k * 3 + j]; return o; };
export const tr3 = (A) => [A[0], A[3], A[6], A[1], A[4], A[7], A[2], A[5], A[8]];
export const ap3 = (A, v) => [A[0] * v[0] + A[1] * v[1] + A[2] * v[2], A[3] * v[0] + A[4] * v[1] + A[5] * v[2], A[6] * v[0] + A[7] * v[1] + A[8] * v[2]];
const add3 = (a, b) => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub3 = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const norm3 = (a) => Math.hypot(a[0], a[1], a[2]);

/** Rodrigues: a rotation vector (radians, its length the angle) to a 3 x 3 rotation, row-major. */
export function rodrigues(rv) {
  const th = norm3(rv);
  if (th < 1e-12) return [1, 0, 0, 0, 1, 0, 0, 0, 1];
  const [x, y, z] = rv.map((v) => v / th), c = Math.cos(th), s = Math.sin(th), C = 1 - c;
  return [c + x * x * C, x * y * C - z * s, x * z * C + y * s, y * x * C + z * s, c + y * y * C, y * z * C - x * s, z * x * C - y * s, z * y * C + x * s, c + z * z * C];
}

/** The rotation vector of a 3 x 3 rotation (the log map); near a half turn the axis is read off the symmetric part. */
export function toRotvec(R) {
  const c = Math.max(-1, Math.min(1, (R[0] + R[4] + R[8] - 1) / 2)), th = Math.acos(c);
  const a = [R[7] - R[5], R[2] - R[6], R[3] - R[1]];
  if (th < 1e-9) return a.map((v) => v / 2);
  if (Math.PI - th < 1e-3) {   // near a half turn: R = 2 a a^T - I; the largest axis component positive, the others' signs from the off-diagonals
    const d = [(R[0] + 1) / 2, (R[4] + 1) / 2, (R[8] + 1) / 2].map((v) => Math.sqrt(Math.max(0, v)));
    const k = d[0] >= d[1] && d[0] >= d[2] ? 0 : d[1] >= d[2] ? 1 : 2;
    const ax = [0, 0, 0]; ax[k] = d[k];
    for (let i = 0; i < 3; i++) if (i !== k) ax[i] = (R[i * 3 + k] + R[k * 3 + i]) / (4 * d[k]);
    const n = Math.hypot(...ax) || 1;
    return ax.map((v) => v / n * th);
  }
  return a.map((v) => v * th / (2 * Math.sin(th)));
}

/** A rotation about an axis ('x' | 'y' | 'z') by degrees, as a rotation vector. */
export const turn = (axis, deg) => { const r = deg * Math.PI / 180; return axis === 'x' ? [r, 0, 0] : axis === 'y' ? [0, r, 0] : [0, 0, r]; };

/* ---------------- projection ---------------- */

export const W = 960, H = 540;
/** The focal in pixels of a vertical field of view in degrees (for a frame of H rows), and back. */
export const focalOf = (fovDeg, h = H) => (h / 2) / Math.tan(fovDeg * Math.PI / 360);
export const fovOf = (f, h = H) => 2 * Math.atan((h / 2) / f) * 180 / Math.PI;

/** Where X (the body's frame) lands in the picture under pose {rv, t} and camera {f, cx, cy}: [u, v], or null behind the camera. */
export function project(X, pose, cam) {
  const R = pose.R ?? rodrigues(pose.rv);
  const c = add3(ap3(R, X), pose.t);
  if (c[2] <= 1e-9) return null;
  return [cam.cx + cam.f * c[0] / c[2], cam.cy + cam.f * c[1] / c[2]];
}

/* ---------------- the pose of one rigid body in one frame ---------------- */

/**
 * Levenberg-Marquardt on p = [rx, ry, rz, tx, ty, tz, (f)]. Rows: (projection - mark) / sigmaPx for every mark, and (f - prior) / sigma when the
 * focal is free with a prior. Numeric Jacobian (central differences). Returns the cost and the normal matrix at the end.
 */
function lm(points3, points2, p0, cam, opt) {
  const n = points3.length;
  const active = opt.active ?? [0, 1, 2, 3, 4, 5, ...(opt.freeF ? [6] : [])], free = active.length;
  const sig = points2.map((m) => m[2] ?? opt.sigmaPx ?? 2);
  const rows = 2 * n + (opt.freeF && opt.fPrior ? 1 : 0) + (opt.rvPrior ? 3 : 0);
  const residuals = (p) => {
    const pose = { rv: [p[0], p[1], p[2]], t: [p[3], p[4], p[5]] }, c = { f: opt.freeF ? p[6] : cam.f, cx: cam.cx, cy: cam.cy };
    const r = new Float64Array(rows);
    for (let i = 0; i < n; i++) {
      const q = project(points3[i], pose, c);
      if (!q) { r[2 * i] = r[2 * i + 1] = 1e3; continue; }
      r[2 * i] = (q[0] - points2[i][0]) / sig[i]; r[2 * i + 1] = (q[1] - points2[i][1]) / sig[i];
    }
    if (opt.freeF && opt.fPrior) r[2 * n] = (p[6] - opt.fPrior.mu) / opt.fPrior.sigma;
    if (opt.rvPrior) for (let k = 0; k < 3; k++) r[rows - 3 + k] = (p[k] - opt.rvPrior.rv[k]) / opt.rvPrior.sigma;
    return r;
  };
  const steps = [1e-6, 1e-6, 1e-6, 1e-4, 1e-4, 1e-4, 1e-2];
  const jacobian = (p) => {
    const J = new Float64Array(rows * free);
    for (let k = 0; k < free; k++) {
      const i = active[k], a = Float64Array.from(p), b = Float64Array.from(p); a[i] += steps[i]; b[i] -= steps[i];
      const ra = residuals(a), rb = residuals(b);
      for (let r = 0; r < rows; r++) J[r * free + k] = (ra[r] - rb[r]) / (2 * steps[i]);
    }
    return J;
  };
  const cost = (r) => { let s = 0; for (let i = 0; i < r.length; i++) s += r[i] * r[i]; return s; };
  let p = Float64Array.from(p0), r = residuals(p), c = cost(r), lambda = 1e-3, iterations = 0, JTJ = null, J = null;
  for (let it = 0; it < (opt.iters ?? 60); it++) {
    iterations = it + 1;
    J = jacobian(p);
    JTJ = new Float64Array(free * free); const g = new Float64Array(free);
    for (let row = 0; row < rows; row++) for (let a = 0; a < free; a++) { const ja = J[row * free + a]; if (!ja) continue; g[a] += ja * r[row]; for (let b = 0; b < free; b++) JTJ[a * free + b] += ja * J[row * free + b]; }
    let moved = false;
    for (let tries = 0; tries < 12 && !moved; tries++) {
      const A = Float64Array.from(JTJ); for (let a = 0; a < free; a++) A[a * free + a] *= 1 + lambda;
      let d; try { d = solveLinear(A, g, free); } catch { lambda *= 10; continue; }
      const q = Float64Array.from(p); for (let a = 0; a < free; a++) q[active[a]] -= d[a];
      const rq = residuals(q), cq = cost(rq);
      if (cq < c) { p = q; r = rq; const gain = c - cq; c = cq; lambda = Math.max(1e-9, lambda / 3); moved = true; if (gain < 1e-12 * Math.max(1, c)) { it = 1e9; } }
      else lambda *= 10;
    }
    if (!moved) break;
  }
  return { p, cost: c, rows, JTJ, free, active, iterations, residuals: r };
}

/**
 * The pose of a rigid body from its keypoints: points3 [[x, y, z] metres in the body's frame], points2 [[u, v, (sigmaPx)]] the marks.
 * cam {f, cx, cy}; opt {freeF, fPrior: {mu, sigma}, sigmaPx, inits: [rv...], iters, fixRot: rv (the turn held; only t and f solved), rvPrior: {rv, sigma
 * (radians)} (a prior on the turn, three more rows: for a drawn frame whose points cannot fix the pitch)}. Tries several starting turns (foundation 6: several
 * candidates at once) and keeps the best. Returns {rv, R, t, f, rms (px), chi2 (per weighted row), cov (6x6 or 7x7 of the parameters, scaled
 * by the reduced chi2 when it is over 1), residuals (px, per mark), iterations, candidates}.
 */
export function solvePose(points3, points2, cam, opt = {}) {
  const n = points3.length;
  if (n < (opt.fixRot || opt.rvPrior ? 2 : 3) || points2.length !== n) throw new Error(`solvePose: ${n} points of the body, ${points2.length} marks`);
  const f0 = opt.freeF ? (opt.fPrior?.mu ?? cam.f) : cam.f;
  // the depth from the sizes: the body's extent over the marks' extent
  const ext = (pts) => { let lo = [Infinity, Infinity, Infinity], hi = [-Infinity, -Infinity, -Infinity]; for (const q of pts) for (let k = 0; k < q.length && k < 3; k++) { lo[k] = Math.min(lo[k], q[k]); hi[k] = Math.max(hi[k], q[k]); } return hi.map((v, k) => v - lo[k]); };
  const e3 = ext(points3), e2 = ext(points2.map((m) => [m[0], m[1]]));
  const size3 = Math.max(e3[0], e3[1], e3[2]), size2 = Math.max(e2[0], e2[1], 1);
  const depth = Math.max(0.05, f0 * size3 / size2);
  const centre3 = points3.reduce((a, q) => add3(a, q), [0, 0, 0]).map((v) => v / n);
  const centre2 = points2.reduce((a, m) => [a[0] + m[0], a[1] + m[1]], [0, 0]).map((v) => v / n);
  const inits = opt.fixRot ? [opt.fixRot] : opt.inits ?? [...(opt.rvPrior ? [opt.rvPrior.rv] : []), [0, 0, 0], turn('y', 90), turn('y', 180), turn('y', -90), turn('x', 90), turn('x', -90), turn('z', 180)];
  const active = opt.fixRot ? [3, 4, 5, ...(opt.freeF ? [6] : [])] : undefined;
  let best = null; const candidates = [];
  for (const rv of inits) {
    // t so that the body's centre lands at the marks' centre at that depth, under that turn
    const Rc = ap3(rodrigues(rv), centre3);
    const t = [(centre2[0] - cam.cx) / f0 * depth - Rc[0], (centre2[1] - cam.cy) / f0 * depth - Rc[1], depth - Rc[2]];
    const p0 = [...rv, ...t, ...(opt.freeF ? [f0] : [])];
    const out = lm(points3, points2, p0, cam, active ? { ...opt, active } : opt);
    candidates.push({ rv, cost: out.cost });
    if (!best || out.cost < best.cost) best = out;
  }
  const { p, cost, rows, JTJ, free, iterations, residuals, active: act } = best;
  const dof = Math.max(1, rows - free), chi2 = cost / dof;
  let cov = null;
  try { cov = invert(JTJ, free); if (chi2 > 1) for (let i = 0; i < cov.length; i++) cov[i] *= chi2; } catch { cov = null; }
  const perMark = []; let ss = 0;
  for (let i = 0; i < n; i++) { const sg = points2[i][2] ?? opt.sigmaPx ?? 2; const du = residuals[2 * i] * sg, dv = residuals[2 * i + 1] * sg; perMark.push(Math.hypot(du, dv)); ss += du * du + dv * dv; }
  const rv = [p[0], p[1], p[2]];
  return { rv, R: rodrigues(rv), t: [p[3], p[4], p[5]], f: opt.freeF ? p[6] : cam.f, rms: Math.sqrt(ss / n), chi2, cov, active: act, residuals: perMark, iterations, candidates, cost, rows, free };
}

/* ---------------- one focal for a whole shot ---------------- */

/**
 * frames: [{points3, points2, sigmaPx}] of one shot (the same lens); each may be a different body. fPrior {mu, sigma} in pixels. Solves every
 * frame's pose and ONE focal together: the normal matrix is an arrow (f's row and column dense, a 6 x 6 block a frame), solved by its Schur
 * complement. Returns {f, sigmaF, frames: [{rv, R, t, cov (6x6 of the pose, the focal's uncertainty folded in), rms, residuals}], rms, chi2}.
 */
export function solveShot(frames, cam, opt = {}) {
  const fPrior = opt.fPrior ?? { mu: cam.f, sigma: cam.f * 0.25 };
  let f = fPrior.mu;
  const camAt = (ff) => ({ f: ff, cx: cam.cx, cy: cam.cy });
  // starts: each frame alone at the prior's focal
  let poses = frames.map((fr) => { const s = solvePose(fr.points3, fr.points2, camAt(f), { sigmaPx: fr.sigmaPx ?? opt.sigmaPx, iters: 40 }); return { rv: s.rv, t: s.t }; });
  const sig = (fr, i) => fr.points2[i][2] ?? fr.sigmaPx ?? opt.sigmaPx ?? 2;
  const total = (ff, ps) => {
    let c = 0;
    frames.forEach((fr, k) => { const pose = { rv: ps[k].rv, t: ps[k].t }, cc = camAt(ff); fr.points3.forEach((X, i) => { const q = project(X, pose, cc); if (!q) { c += 1e6; return; } const s = sig(fr, i); c += ((q[0] - fr.points2[i][0]) / s) ** 2 + ((q[1] - fr.points2[i][1]) / s) ** 2; }); });
    return c + ((ff - fPrior.mu) / fPrior.sigma) ** 2;
  };
  // the profile over f: for a focal, re-solve every pose (warm) and read the cost; a golden search on f, then poses settle
  const profile = (ff) => { const ps = frames.map((fr, k) => { const s = solvePose(fr.points3, fr.points2, camAt(ff), { sigmaPx: fr.sigmaPx ?? opt.sigmaPx, inits: [poses[k].rv], iters: 40 }); return { rv: s.rv, t: s.t }; }); return { cost: total(ff, ps), ps }; };
  let lo = Math.max(50, fPrior.mu - 3 * fPrior.sigma), hi = fPrior.mu + 3 * fPrior.sigma;
  const phi = (Math.sqrt(5) - 1) / 2;
  let a = hi - phi * (hi - lo), b = lo + phi * (hi - lo), fa = profile(a), fb = profile(b);
  for (let it = 0; it < (opt.searchIters ?? 24); it++) {
    if (fa.cost < fb.cost) { hi = b; b = a; fb = fa; a = hi - phi * (hi - lo); fa = profile(a); }
    else { lo = a; a = b; fa = fb; b = lo + phi * (hi - lo); fb = profile(b); }
    if (hi - lo < 0.5) break;
  }
  const pick = fa.cost < fb.cost ? { f: a, ...fa } : { f: b, ...fb };
  f = pick.f; poses = pick.ps;
  // the curvature of the profile at f: sigma_f from the second difference (the Schur complement of the arrow, read numerically)
  const h = Math.max(2, 0.02 * f);
  const c0 = pick.cost, cp = profile(f + h).cost, cm = profile(f - h).cost;
  const curv = (cp + cm - 2 * c0) / (h * h);   // d2 cost / df2; cost = chi2 sum, so the variance of f is 2 / curv
  let rows = 1, params = 1 + 6 * frames.length;
  frames.forEach((fr) => { rows += 2 * fr.points3.length; });
  const chi2 = c0 / Math.max(1, rows - params);
  const scale = chi2 > 1 ? chi2 : 1;
  const sigmaF = curv > 0 ? Math.sqrt(2 / curv * scale) : fPrior.sigma;
  // each frame's pose and covariance at the settled focal, the focal's uncertainty folded in by the pose's drift with f
  const outFrames = frames.map((fr, k) => {
    const o = { sigmaPx: fr.sigmaPx ?? opt.sigmaPx, inits: [poses[k].rv], iters: 40 };
    const s = solvePose(fr.points3, fr.points2, camAt(f), o);
    const sp = solvePose(fr.points3, fr.points2, camAt(f + sigmaF), o), sm = solvePose(fr.points3, fr.points2, camAt(f - sigmaF), o);
    const d = [...s.rv.map((_, i) => (sp.rv[i] - sm.rv[i]) / 2), ...s.t.map((_, i) => (sp.t[i] - sm.t[i]) / 2)];   // the drift for one sigma of f
    const cov = s.cov ? Float64Array.from(s.cov) : new Float64Array(36);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) cov[i * 6 + j] += d[i] * d[j];
    return { rv: s.rv, R: s.R, t: s.t, cov, rms: s.rms, residuals: s.residuals, chi2: s.chi2, driftPerSigmaF: d };
  });
  let ss = 0, n = 0; outFrames.forEach((o, k) => { o.residuals.forEach((e) => { ss += e * e; n++; }); });
  return { f, sigmaF, fov: fovOf(f, 2 * cam.cy), sigmaFov: Math.abs(fovOf(f - sigmaF, 2 * cam.cy) - fovOf(f + sigmaF, 2 * cam.cy)) / 2, frames: outFrames, rms: Math.sqrt(ss / Math.max(1, n)), chi2, profile: { lo, hi, curvature: curv } };
}

/* ---------------- from the camera's frame into the world ---------------- */

/**
 * A body seen in the camera (pose {rv, t}: Xc = R X + t) whose place in the world is known ({rv, t}: Xw = Rw X + tw) fixes the camera:
 * returns {R, t} with Xc = R Xw + t, the eye (the camera's place in the world), the direction it looks (world, unit) and its up (world, unit).
 */
export function cameraInWorld(bodyInCam, bodyInWorld) {
  const Rbc = bodyInCam.R ?? rodrigues(bodyInCam.rv), Rbw = bodyInWorld.R ?? rodrigues(bodyInWorld.rv ?? [0, 0, 0]);
  const R = mul3(Rbc, tr3(Rbw));
  const t = sub3(bodyInCam.t, ap3(R, bodyInWorld.t ?? [0, 0, 0]));
  const Rt = tr3(R);
  return { R, t, rv: toRotvec(R), eye: ap3(Rt, t).map((v) => -v), dir: ap3(Rt, [0, 0, 1]), up: ap3(Rt, [0, -1, 0]) };
}

/** A camera at `eye` looking at `target` with the world's `up` (default y): {R, t, rv} with Xc = R Xw + t (x right, y down, z forward). */
export function lookAt(eye, target, up = [0, 1, 0]) {
  const f = sub3(target, eye), fl = norm3(f) || 1, fw = f.map((v) => v / fl);
  const cr = [fw[1] * up[2] - fw[2] * up[1], fw[2] * up[0] - fw[0] * up[2], fw[0] * up[1] - fw[1] * up[0]], rl = norm3(cr) || 1, right = cr.map((v) => v / rl);
  const down = [fw[1] * right[2] - fw[2] * right[1], fw[2] * right[0] - fw[0] * right[2], fw[0] * right[1] - fw[1] * right[0]];
  const R = [...right, ...down, ...fw];
  return { R, t: ap3(R, eye).map((v) => -v), rv: toRotvec(R) };
}

/** A body seen in the camera ({rv, t}), the camera placed in the world ({R, t}): the body's world pose {R, rv, t}. */
export function bodyInWorld(bodyInCam, camInWorld) {
  const Rbc = bodyInCam.R ?? rodrigues(bodyInCam.rv), Rcw = camInWorld.R ?? rodrigues(camInWorld.rv), Rwc = tr3(Rcw);
  const R = mul3(Rwc, Rbc);
  const t = ap3(Rwc, sub3(bodyInCam.t, camInWorld.t));
  return { R, rv: toRotvec(R), t };
}

/** First-order propagation of a covariance through fn: mu (array), cov (flat n x n) -> {mu: fn(mu), cov (flat m x m)}. Central differences. */
export function propagate(fn, mu, cov, steps) {
  const n = mu.length, y0 = fn(mu), m = y0.length, J = new Float64Array(m * n);
  for (let k = 0; k < n; k++) {
    const h = steps?.[k] ?? Math.max(1e-6, 1e-4 * Math.abs(mu[k]));
    const a = mu.slice(), b = mu.slice(); a[k] += h; b[k] -= h;
    const ya = fn(a), yb = fn(b);
    for (let r = 0; r < m; r++) J[r * n + k] = (ya[r] - yb[r]) / (2 * h);
  }
  const out = new Float64Array(m * m);
  for (let r = 0; r < m; r++) for (let c = 0; c < m; c++) { let s = 0; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) s += J[r * n + i] * cov[i * n + j] * J[c * n + j]; out[r * m + c] = s; }
  return { mu: y0, cov: out };
}

/** The 3 x 3 block (rows and columns i0..i0+2) of a flat n x n matrix, as a nested array. */
export const block3 = (M, n, i0) => [0, 1, 2].map((r) => [0, 1, 2].map((c) => M[(i0 + r) * n + i0 + c]));
/** The square roots of a 3 x 3 nested covariance's diagonal: the sigma of each axis. */
export const sigmaOf = (C) => [0, 1, 2].map((i) => Math.sqrt(Math.max(0, C[i][i])));
/** A diagonal 3 x 3 from sigmas, nested. */
export const diag3 = (s) => [[s[0] * s[0], 0, 0], [0, s[1] * s[1], 0], [0, 0, s[2] * s[2]]];

/* ---------------- the tracker ---------------- */

/** Bilinear read of an 8-bit gray image at (x, y); 0 outside. */
export function sample(img, w, h, x, y) {
  if (x < 0 || y < 0 || x > w - 1 || y > h - 1) return 0;
  const x0 = Math.floor(x), y0 = Math.floor(y), x1 = Math.min(w - 1, x0 + 1), y1 = Math.min(h - 1, y0 + 1), ax = x - x0, ay = y - y0;
  const i00 = img[y0 * w + x0], i10 = img[y0 * w + x1], i01 = img[y1 * w + x0], i11 = img[y1 * w + x1];
  return (i00 * (1 - ax) + i10 * ax) * (1 - ay) + (i01 * (1 - ax) + i11 * ax) * ay;
}

/** A pyramid of gray images: level 0 the image, each next the 2 x 2 box mean of the last. */
export function pyramid(img, w, h, levels = 3) {
  const out = [{ img, w, h }];
  for (let l = 1; l < levels; l++) {
    const p = out[l - 1], nw = p.w >> 1, nh = p.h >> 1, q = new Float32Array(nw * nh);
    for (let y = 0; y < nh; y++) for (let x = 0; x < nw; x++) { const i = 2 * y * p.w + 2 * x; q[y * nw + x] = (p.img[i] + p.img[i + 1] + p.img[i + p.w] + p.img[i + p.w + 1]) / 4; }
    out.push({ img: q, w: nw, h: nh });
  }
  return out;
}

/**
 * Pyramidal Lucas-Kanade: where each of `points` ([x, y] in level 0 of `prev`) went in `next`. opt {win: 7 (a 15 x 15 window), iters: 12,
 * eps: 0.02, minDet}. Returns [{x, y, ok, err (mean absolute difference over the window after the move, 0..255)}].
 */
export function trackLK(prev, next, points, opt = {}) {
  const win = opt.win ?? 7, iters = opt.iters ?? 12, eps = opt.eps ?? 0.02, levels = prev.length;
  return points.map(([px, py]) => {
    let gx = 0, gy = 0, ok = true;   // the guess, in the coarsest level's pixels
    for (let l = levels - 1; l >= 0; l--) {
      const P = prev[l], N = next[l], s = 2 ** l, x0 = px / s, y0 = py / s;
      // gradient of prev over the window, the normal matrix
      let Gxx = 0, Gxy = 0, Gyy = 0; const Ix = [], Iy = [], I0 = [];
      for (let dy = -win; dy <= win; dy++) for (let dx = -win; dx <= win; dx++) {
        const x = x0 + dx, y = y0 + dy;
        const ix = (sample(P.img, P.w, P.h, x + 1, y) - sample(P.img, P.w, P.h, x - 1, y)) / 2, iy = (sample(P.img, P.w, P.h, x, y + 1) - sample(P.img, P.w, P.h, x, y - 1)) / 2;
        Ix.push(ix); Iy.push(iy); I0.push(sample(P.img, P.w, P.h, x, y)); Gxx += ix * ix; Gxy += ix * iy; Gyy += iy * iy;
      }
      const det = Gxx * Gyy - Gxy * Gxy;
      if (det < (opt.minDet ?? 1e-3)) { ok = false; break; }
      for (let it = 0; it < iters; it++) {
        let bx = 0, by = 0, k = 0;
        for (let dy = -win; dy <= win; dy++) for (let dx = -win; dx <= win; dx++, k++) {
          const dI = I0[k] - sample(N.img, N.w, N.h, x0 + gx + dx, y0 + gy + dy);
          bx += dI * Ix[k]; by += dI * Iy[k];
        }
        const vx = (Gyy * bx - Gxy * by) / det, vy = (Gxx * by - Gxy * bx) / det;
        gx += vx; gy += vy;
        if (Math.hypot(vx, vy) < eps) break;
      }
      if (l) { gx *= 2; gy *= 2; }
    }
    const x = px + gx, y = py + gy;
    let err = 0, cnt = 0;
    if (ok) { const P = prev[0], N = next[0]; for (let dy = -win; dy <= win; dy++) for (let dx = -win; dx <= win; dx++, cnt++) err += Math.abs(sample(P.img, P.w, P.h, px + dx, py + dy) - sample(N.img, N.w, N.h, x + dx, y + dy)); }
    if (!ok || x < 0 || y < 0 || x > prev[0].w - 1 || y > prev[0].h - 1) ok = false;
    return { x, y, ok, err: cnt ? err / cnt : 255 };
  });
}

/** Move a mark to the strongest gradient within r pixels (a cel's outline): [x, y, gradient]. */
export function snapToEdge(img, w, h, [mx, my], r = 3) {
  let best = [mx, my, -1];
  for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
    const x = Math.round(mx + dx), y = Math.round(my + dy);
    if (x < 1 || y < 1 || x >= w - 1 || y >= h - 1) continue;
    const g = Math.hypot(img[y * w + x + 1] - img[y * w + x - 1], img[(y + 1) * w + x] - img[(y - 1) * w + x]);
    if (g > best[2]) best = [x, y, g];
  }
  return best;
}

/* ---------------- the film's frames as gray ---------------- */

/**
 * Read frames of a film as 8-bit gray through ffmpeg's pipe (nothing written): from second `from` for `seconds`, at the film's own rate.
 * onFrame(Uint8Array of w*h, index) for each. Resolves to the count. opt {ffmpeg, w, h, nice}.
 */
export async function readGray(film, from, seconds, onFrame, opt = {}) {
  const { spawn } = await import('node:child_process');
  const w = opt.w ?? W, h = opt.h ?? H, size = w * h;
  const args = ['-v', 'error', '-nostdin', '-ss', String(from), '-t', String(seconds), '-i', film, '-f', 'rawvideo', '-pix_fmt', 'gray', '-s', `${w}x${h}`, '-'];
  const child = spawn(opt.ffmpeg ?? 'ffmpeg', args, { stdio: ['ignore', 'pipe', 'pipe'] });
  let held = Buffer.alloc(0), count = 0, err = '';
  child.stderr.on('data', (d) => { err += d; });
  await new Promise((resolve, reject) => {
    child.stdout.on('data', (d) => {
      held = held.length ? Buffer.concat([held, d]) : d;
      while (held.length >= size) { onFrame(new Uint8Array(held.subarray(0, size)), count++); held = held.subarray(size); }
    });
    child.on('error', reject);
    child.on('close', (code) => (code === 0 ? resolve() : reject(new Error(`ffmpeg ${code}: ${err.trim()}`))));
  });
  return count;
}

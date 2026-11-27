#!/usr/bin/env node
// braindance.measure.mjs: THE RECORD MEASURED. Reads the hand marks (braindance.marks.json: pixel places of a rigid body's keypoints in a few
// frames of each shot, the bodies' shapes in metres, which body anchors the world in that shot), solves every marked frame with
// braindance.solve.mjs (the shot's one focal, each body's pose, the camera placed in the world through the anchor), carries the marks across
// every frame of the shot with the tracker when the hand frames' residual allows it (--track; under 2 % of the frame's height, his brief),
// and writes what it measured beside what was read: a `measured` block on each track and each shot of braindance.json (--write), the read
// mu and sigma untouched. Prints the receipt (per track: sigma as read, as measured, frames, residual) for LANDING.md.
//
//   node braindance.measure.mjs [--marks braindance.marks.json] [--film ../app/saint-seiya.mp4] [--record braindance.json] [--track] [--write]
//
// COST: the solves are microseconds to milliseconds a frame (braindance.solve.test.mjs); the frames come from ffmpeg's gray pipe, one at a
// time, nothing written; a shot of 120 frames is a few seconds of one core at nice 19. No frame of the film is kept or enters git: the
// marks are numbers.
import fs from 'node:fs';
import path from 'node:path';
import {rodrigues, toRotvec, turn, mul3, tr3, ap3, project, solvePose, solveShot, cameraInWorld, bodyInWorld, propagate, pyramid, trackLK, readGray, focalOf, fovOf, block3, sigmaOf, lookAt, W, H} from './braindance.solve.mjs';

const HERE = path.dirname(new URL(import.meta.url).pathname);
const arg = (name, dflt) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : dflt; };
const flag = (name) => process.argv.includes(name);
const FPS = 30000 / 1001;
const tOf = (frame) => frame / FPS;
const r3 = (v) => v.map((x) => +x.toFixed(3));
const r4 = (v) => v.map((x) => +x.toFixed(4));
const nested = (flat, n) => Array.from({length: n}, (_, r) => Array.from({length: n}, (_, c) => flat[r * n + c]));
const flat = (M) => Float64Array.from(M.flat());
const addM = (A, B) => A.map((row, r) => row.map((v, c) => v + B[r][c]));
const scaleM = (A, s) => A.map((row) => row.map((v) => v * s));
const inv3 = (A) => { const [a, b, c, d, e, f, g, h, i] = A.flat(); const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g); if (Math.abs(det) < 1e-18) return null; const o = [[e * i - f * h, c * h - b * i, b * f - c * e], [f * g - d * i, a * i - c * g, c * d - a * f], [d * h - e * g, b * g - a * h, a * e - b * d]]; return o.map((row) => row.map((v) => v / det)); };
const mulMv = (A, v) => A.map((row) => row.reduce((s, x, i) => s + x * v[i], 0));
const mean = (vs) => vs[0].map((_, i) => vs.reduce((s, v) => s + v[i], 0) / vs.length);
const scatter = (vs) => { const m = mean(vs); const C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]]; for (const v of vs) for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) C[r][c] += (v[r] - m[r]) * (v[c] - m[c]); return {mean: m, cov: vs.length > 1 ? scaleM(C, 1 / (vs.length - 1)) : C}; };
/** Inverse-variance fusion of independent measurements {mu, cov}: the one that explains them all with the least total conflict. */
export function fuse(ms) {
  let P = [[0, 0, 0], [0, 0, 0], [0, 0, 0]], q = [0, 0, 0];
  for (const m of ms) { const Pi = inv3(m.cov); if (!Pi) continue; P = addM(P, Pi); const v = mulMv(Pi, m.mu); q = q.map((x, i) => x + v[i]); }
  const cov = inv3(P);
  if (!cov) { const vs = ms.map((m) => m.mu); const st = scatter(vs); return {mu: st.mean, cov: addM(st.cov, ms[0].cov)}; }
  return {mu: mulMv(cov, q), cov};
}

const marks = JSON.parse(fs.readFileSync(path.resolve(HERE, arg('--marks', 'braindance.marks.json')), 'utf8'));
const recordPath = path.resolve(HERE, arg('--record', 'braindance.json'));
const record = JSON.parse(fs.readFileSync(recordPath, 'utf8'));
const film = path.resolve(HERE, arg('--film', '../app/saint-seiya.mp4'));
const cx = marks.picture?.cx ?? W / 2, cy = marks.picture?.cy ?? H / 2;
const TRACK = flag('--track'), WRITE = flag('--write');
const LIMIT_PX = 0.02 * H;   // his brief: a residual under 2 % of the frame's height before a tracker widens the measurement
const say = (...a) => console.log(...a);

/** The record's shot holding second t. */
const shotOfRecord = (t) => (record.camera ?? []).find((s) => t >= s.t[0] && t < s.t[1]);
const trackOfRecord = (name, t) => (record.entities?.[name]?.tracks ?? []).find((k) => t >= k.t[0] && t < k.t[1]);

/** A body's shape: {kind, names, points3 (for rigid and standing), radius (sphere)}. */
function shapeOf(name) {
  const s = marks.shapes[name];
  if (!s) throw new Error(`no shape ${name}`);
  return {name, kind: s.kind ?? 'rigid', names: Object.keys(s.points ?? {}), points: s.points ?? {}, radius: s.radius, sigmaPx: s.sigmaPx, shapeSigma: s.sigma ?? 0, ...s};
}
/** The marks of a body in a hand frame, as [points3, points2] in the shape's order (only the named points present). */
function pairUp(shape, hand, sigmaPx) {
  const names = shape.names.filter((n) => hand[n]);
  return {names, points3: names.map((n) => shape.points[n]), points2: names.map((n) => [hand[n][0], hand[n][1], hand[n][2] ?? shape.sigmaPx ?? sigmaPx])};
}

/** A sphere's centre in the camera from its silhouette's extremes (top, bottom, left, right in the picture): {t, cov, rms, rPx}. */
function sphereInCam(radius, hand, f, sigmaPx = 3) {
  const eq = [];   // rows: [coef on uc, vc, rPx, value]
  if (hand.top) { eq.push([1, 0, 0, hand.top[0]]); eq.push([0, 1, -1, hand.top[1]]); }
  if (hand.bottom) { eq.push([1, 0, 0, hand.bottom[0]]); eq.push([0, 1, 1, hand.bottom[1]]); }
  if (hand.left) { eq.push([1, 0, -1, hand.left[0]]); eq.push([0, 1, 0, hand.left[1]]); }
  if (hand.right) { eq.push([1, 0, 1, hand.right[0]]); eq.push([0, 1, 0, hand.right[1]]); }
  if (eq.length < 3) throw new Error('a sphere needs two of top, bottom, left, right');
  const n = 3, A = new Float64Array(9), b = new Float64Array(3);
  for (const [a0, a1, a2, y] of eq) { const row = [a0, a1, a2]; for (let r = 0; r < n; r++) { b[r] += row[r] * y; for (let c = 0; c < n; c++) A[r * n + c] += row[r] * row[c]; } }
  const {solveLinear, invert} = solveImports;
  const x = solveLinear(A, b, n), res = eq.map(([a0, a1, a2, y]) => a0 * x[0] + a1 * x[1] + a2 * x[2] - y);
  const rms = Math.sqrt(res.reduce((s, v) => s + v * v, 0) / res.length), dof = Math.max(1, eq.length - n);
  const s2 = Math.max(sigmaPx * sigmaPx, res.reduce((s, v) => s + v * v, 0) / dof);
  const covPx = Array.from(invert(A, n)).map((v) => v * s2);
  const [uc, vc, rPx] = x, d = f * radius / rPx;
  // t = [(uc - cx) / f * d, (vc - cy) / f * d, d] with d = f r / rPx: propagate (uc, vc, rPx) -> t
  const fn = ([u, v, r]) => { const dd = f * radius / r; return [(u - cx) / f * dd, (v - cy) / f * dd, dd]; };
  const out = propagate(fn, [uc, vc, rPx], covPx, [0.01, 0.01, 0.01]);
  return {t: out.mu, cov: nested(out.cov, 3), rms, rPx, d};
}
const solveImports = await import('./braindance.solve.mjs');

/** The focal's pull on a sphere's or a standing body's depth: t scales with f for a fixed picture: dt/df = t / f. */
const foldFocal = (t, cov, f, sigmaF) => { const k = sigmaF / f; return addM(cov, [0, 1, 2].map((r) => [0, 1, 2].map((c) => t[r] * k * t[c] * k))); };

/**
 * A standing figure placed by its feet on the world's ground (y = 0) through the camera c ({R, t, eye, cov}): the feet's ray meets the ground;
 * the top's mark then says how big the figure is drawn against its height (a drawn film's cheat, reported, not fitted). Covariance from the
 * feet mark's sigma and the camera's own covariance (eye) through the intersection. Null when the ray does not reach the ground.
 */
function onGround(sh, hand, c, f, sigmaPx) {
  if (!hand.feet || !hand.top) return null;
  const Rwc = tr3(c.R);
  const hit = (u, v, eye) => { const d = ap3(Rwc, [(u - cx) / f, (v - cy) / f, 1]); if (d[1] >= -1e-6) return null; const s = -eye[1] / d[1]; return [eye[0] + s * d[0], 0, eye[2] + s * d[2]]; };
  const t = hit(hand.feet[0], hand.feet[1], c.eye); if (!t) return null;
  const fn = (p) => hit(p[0], p[1], [p[2], p[3], p[4]]) ?? [1e9, 1e9, 1e9];
  const C = new Float64Array(25); C[0] = C[6] = sigmaPx * sigmaPx; for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) C[(2 + r) * 5 + 2 + k] = c.cov[r][k];
  const cov = nested(propagate(fn, [hand.feet[0], hand.feet[1], ...c.eye], C, [0.5, 0.5, 0.01, 0.01, 0.01]).cov, 3);
  cov[1][1] += 0.05 * 0.05;   // the fight's ground is flat to 5 cm, not to nothing
  const Cs = new Float64Array(25); for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) Cs[(2 + r) * 5 + 2 + k] = c.sys[r][k];
  const sys = nested(propagate(fn, [hand.feet[0], hand.feet[1], ...c.eye], Cs, [0.5, 0.5, 0.01, 0.01, 0.01]).cov, 3);
  const height = sh.points.top[1] - sh.points.feet[1];
  const camT = ap3(c.R, t).map((v, i) => v + c.t[i]), depth = camT[2];
  const expect = f * height / depth, px = Math.hypot(hand.top[0] - hand.feet[0], hand.top[1] - hand.feet[1]);
  return {t, cov, sys, rms: 0, drawn: px / expect, px, expect, depth};
}

/**
 * A standing figure placed on the ground BESIDE the standing anchor: the camera's eye is where the anchor's feet ray puts it (the anchor at the
 * world's origin at its solved distance), so the two figures' offset is read with the camera's own errors moving both of them together: the
 * turn's prior and the drawn size move the pair, not the gap. Propagated over the turn (the anchor solve's covariance), the anchor's distance
 * (the lens and its drawn size, k) and both feet marks.
 */
function besideOnGround(sh, hand, a, c, f, sigmaPx) {
  if (!hand.feet || !hand.top) return null;
  const ray = (R, u, v) => { const d = ap3(tr3(R), [(u - cx) / f, (v - cy) / f, 1]); const n = Math.hypot(...d); return d.map((x) => x / n); };
  const placeOf = (p) => {
    const R = rodrigues([p[0], p[1], p[2]]), dS = ray(R, p[4], p[5]), eye = dS.map((x) => -x * a.dist * p[3]);
    const dD = ray(R, p[6], p[7]); if (dD[1] >= -1e-6) return [1e9, 1e9, 1e9];
    const sD = -eye[1] / dD[1]; return [eye[0] + sD * dD[0], 0, eye[2] + sD * dD[2]];
  };
  const mu = [...a.rv, 1, a.feet[0], a.feet[1], hand.feet[0], hand.feet[1]], t = placeOf(mu);
  if (t[0] > 1e8) return null;
  const C = new Float64Array(64);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 3; k++) C[r * 8 + k] = a.cov ? a.cov[r * 6 + k] : 0;
  C[3 * 8 + 3] = a.k * a.k; for (let i = 4; i < 8; i++) C[i * 8 + i] = sigmaPx * sigmaPx;
  const cov = nested(propagate(placeOf, mu, C, [1e-4, 1e-4, 1e-4, 1e-4, 0.5, 0.5, 0.5, 0.5]).cov, 3);
  cov[1][1] += 0.05 * 0.05;
  const height = sh.points.top[1] - sh.points.feet[1];
  const camT = ap3(c.R, t).map((v, i) => v + c.t[i]), depth = camT[2];
  const expect = f * height / depth, px = Math.hypot(hand.top[0] - hand.feet[0], hand.top[1] - hand.feet[1]);
  return {t, cov, sys: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], rms: 0, drawn: px / expect, px, expect, depth};
}

const results = {shots: [], entities: {}};
const worldPoses = {};   // body -> {rv, t} measured so far (a later shot may anchor on an earlier measurement)

for (const shot of marks.shots) {
  const [fa, fb] = shot.frames, ta = tOf(fa), tb = tOf(fb + 1), tmid = (ta + tb) / 2;
  const rec = shotOfRecord(tmid);
  const fovPrior = shot.fov ?? {mu: rec?.fov ?? 40, sigma: 10};
  const fPrior = {mu: focalOf(fovPrior.mu), sigma: Math.abs(focalOf(fovPrior.mu - fovPrior.sigma) - focalOf(fovPrior.mu + fovPrior.sigma)) / 2};
  const handFrames = Object.keys(shot.hand ?? {}).map(Number).sort((a, b) => a - b);
  say(`\n== shot ${shot.id} "${shot.name}": frames ${fa} to ${fb} (${ta.toFixed(3)} to ${tb.toFixed(3)} s), the record's "${rec?.name}" fov ${rec?.fov}; prior fov ${fovPrior.mu} +- ${fovPrior.sigma} deg (f ${fPrior.mu.toFixed(0)} +- ${fPrior.sigma.toFixed(0)} px); hand frames ${handFrames.join(', ')}`);
  const bodies = {};   // name -> shape
  for (const fr of handFrames) for (const b of Object.keys(shot.hand[fr])) bodies[b] = shapeOf(b);
  // 1. the rigid bodies of the hand frames fix the focal together
  const rigidEntries = [];
  for (const fr of handFrames) for (const [b, hand] of Object.entries(shot.hand[fr])) if (bodies[b].kind === 'rigid') { const pu = pairUp(bodies[b], hand, shot.sigmaPx ?? 3); if (pu.names.length >= 3) rigidEntries.push({frame: fr, body: b, ...pu}); }
  let f = fPrior.mu, sigmaF = fPrior.sigma, shotSolve = null;
  if (rigidEntries.length) {
    shotSolve = solveShot(rigidEntries.map((e) => ({points3: e.points3, points2: e.points2})), {f: fPrior.mu, cx, cy}, {fPrior, sigmaPx: shot.sigmaPx ?? 3});
    f = shotSolve.f; sigmaF = shotSolve.sigmaF;
    say(`  focal from ${rigidEntries.length} rigid solves: f ${f.toFixed(1)} +- ${sigmaF.toFixed(1)} px, fov ${shotSolve.fov.toFixed(1)} +- ${shotSolve.sigmaFov.toFixed(1)} deg; rms ${shotSolve.rms.toFixed(2)} px`);
    rigidEntries.forEach((e, i) => { e.pose = shotSolve.frames[i]; say(`    f${e.frame} ${e.body}: rms ${e.pose.rms.toFixed(2)} px, t_cam ${r3(e.pose.t)}, per mark ${e.pose.residuals.map((v) => v.toFixed(1)).join(' ')}`); });
  } else say('  no rigid body with three marks: the focal stays its prior');
  const cam = {f, cx, cy};
  // 2. the world: the anchor body's known pose places the camera; without one, the read camera's turn and the anchor's measured place
  const anchor = shot.anchor;
  const anchorWorld = (() => {
    if (!anchor) return null;
    if (anchor.world?.from && worldPoses[anchor.world.from]) return worldPoses[anchor.world.from];
    return {rv: anchor.world?.rv ?? [0, 0, 0], t: anchor.world?.t ?? [0, 0, 0]};
  })();
  const camsByFrame = {};   // frame -> {R, t, eye, dir, up, cov}
  const anchorStanding = {};   // frame -> the standing anchor's solve, for figures placed on the ground beside it
  const placeCamera = (frame, bodyPose, covRand6, covSys6) => {
    const c = cameraInWorld(bodyPose, anchorWorld);
    // the eye's covariance through cameraInWorld, in two parts: random (the marks of this frame) and systematic (the lens, the drawn size,
    // the anchor's own yaw and place: the same error in every frame of the shot, so it is never averaged away over frames)
    const sig = anchor.sigma ?? {};
    const mu = [...bodyPose.rv, ...bodyPose.t, anchorWorld.rv[1] ?? 0, ...anchorWorld.t];
    const Cr = new Float64Array(100), Cs = new Float64Array(100);
    if (covRand6) for (let r = 0; r < 6; r++) for (let c2 = 0; c2 < 6; c2++) Cr[r * 10 + c2] = covRand6[r * 6 + c2];
    if (covSys6) for (let r = 0; r < 6; r++) for (let c2 = 0; c2 < 6; c2++) Cs[r * 10 + c2] = covSys6[r * 6 + c2];
    Cs[66] = (sig.yaw ?? 0) ** 2; for (let i = 0; i < 3; i++) Cs[(7 + i) * 10 + 7 + i] = (sig.t?.[i] ?? 0) ** 2;
    const fn = (p) => cameraInWorld({rv: [p[0], p[1], p[2]], t: [p[3], p[4], p[5]]}, {rv: [anchorWorld.rv[0], p[6], anchorWorld.rv[2]], t: [p[7], p[8], p[9]]}).eye;
    camsByFrame[frame] = {...c, cov: nested(propagate(fn, mu, Cr).cov, 3), sys: nested(propagate(fn, mu, Cs).cov, 3)};
    return camsByFrame[frame];
  };
  const total = (x) => addM(x.cov, x.sys ?? [[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
  if (anchor && anchorWorld) {
    const ab = bodies[anchor.body];
    if (!ab) throw new Error(`shot ${shot.id}: the anchor ${anchor.body} has no marks`);
    if (ab.kind === 'rigid') {
      // the read camera's turn as a prior on the anchor's pose: a drawn frame's few points cannot fix the pitch (shot A: both fighters' feet on one
      // picture line while one is drawn bigger put the camera on the ground); the residual then says how much the drawing cheats
      const readR = shot.turn ? rodrigues(shot.turn) : rec ? lookAt(rec.mu, rec.look).R : null;
      const turnSigma = (shot.turnSigma ?? 15) * Math.PI / 180;
      for (const e of rigidEntries) if (e.body === anchor.body) {
        if (readR) {
          const rvPrior = toRotvec(mul3(readR, rodrigues(anchorWorld.rv)));
          const s = solvePose(e.points3, e.points2, cam, {sigmaPx: shot.sigmaPx ?? 3, rvPrior: {rv: rvPrior, sigma: turnSigma}});
          const cov6 = s.cov ? Float64Array.from(s.cov) : new Float64Array(36), sys6 = new Float64Array(36);
          const d = e.pose.driftPerSigmaF ?? [0, 0, 0, 0, 0, 0]; for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) sys6[i * 6 + j] = d[i] * d[j];
          const free = e.pose;
          e.pose = {rv: s.rv, R: s.R, t: s.t, cov: cov6, sys: sys6, rms: s.rms, residuals: s.residuals, chi2: s.chi2, free: {rv: free.rv, t: free.t, rms: free.rms}};
          const turnOff = Math.hypot(...toRotvec(mul3(s.R, tr3(rodrigues(rvPrior))))) * 180 / Math.PI;
          say(`    ${anchor.body} at f${e.frame} with the read turn as a prior (+- ${shot.turnSigma ?? 15} deg): rms ${s.rms.toFixed(2)} px (free: ${free.rms.toFixed(2)} px), ${turnOff.toFixed(1)} deg off the read turn, per mark ${s.residuals.map((v) => v.toFixed(1)).join(' ')}`);
        }
        if (!e.pose.sys) { const sys6 = new Float64Array(36); const d = e.pose.driftPerSigmaF ?? [0, 0, 0, 0, 0, 0]; for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) sys6[i * 6 + j] = d[i] * d[j]; e.pose.sys = sys6; }
        const c = placeCamera(e.frame, e.pose, e.pose.cov, e.pose.sys); say(`    camera from ${anchor.body} at f${e.frame}: eye ${r3(c.eye)} +- ${r3(sigmaOf(c.cov))} (marks) +- ${r3(sigmaOf(c.sys))} (lens), looks ${r3(c.dir)}, up ${r3(c.up)}`);
      }
      if (readR) { const re = rigidEntries.filter((e) => e.body === anchor.body); shotSolve.rms = Math.sqrt(re.reduce((a, e) => a + e.pose.rms * e.pose.rms, 0) / Math.max(1, re.length)); }
    } else if (ab.kind === 'standing') {
      // the camera's turn from the read shot (eye, look, up y) or the shot's own `turn`; the anchor's feet at its world place fix the eye
      const readR = shot.turn ? rodrigues(shot.turn) : lookAt(rec.mu, rec.look).R;
      for (const fr of handFrames) {
        const hand = shot.hand[fr][anchor.body]; if (!hand) continue;
        const pu = pairUp(ab, hand, shot.sigmaPx ?? 3);
        const rvPrior = toRotvec(mul3(readR, rodrigues(anchorWorld.rv)));   // body -> camera = world -> camera after body -> world
        const turnSigma = (shot.turnSigma ?? 15) * Math.PI / 180;
        const s = solvePose(pu.points3, pu.points2, cam, {rvPrior: {rv: rvPrior, sigma: turnSigma}, sigmaPx: shot.sigmaPx ?? 3});
        // two marks cannot fix the pitch or the yaw: the solve's covariance is the prior's, the same in every frame of the shot, so all of it
        // is systematic (never averaged away over the frames); the lens and the drawn size both scale the depth
        const sys6 = s.cov ? Float64Array.from(s.cov) : new Float64Array(36), cov6 = new Float64Array(36);
        const k = Math.hypot(sigmaF / f, ab.sizeSigma ?? 0);
        for (let r = 0; r < 3; r++) for (let c2 = 0; c2 < 3; c2++) sys6[(3 + r) * 6 + 3 + c2] += s.t[r] * k * s.t[c2] * k;
        const turnOff = Math.hypot(...toRotvec(mul3(s.R, tr3(rodrigues(rvPrior))))) * 180 / Math.PI;
        anchorStanding[fr] = {rv: s.rv, cov: s.cov, feet: pu.points2[pu.names.indexOf('feet')], dist: Math.hypot(...s.t), k};
        const c = placeCamera(fr, {rv: s.rv, t: s.t}, cov6, sys6);
        say(`    camera from ${anchor.body} (standing; the read turn a prior +- ${shot.turnSigma ?? 15} deg, ${turnOff.toFixed(1)} deg off it; its drawn size +- ${(ab.sizeSigma ?? 0) * 100} %) at f${fr}: eye ${r3(c.eye)} +- ${r3(sigmaOf(c.cov))} (marks) +- ${r3(sigmaOf(c.sys))} (lens, size), looks ${r3(c.dir)}, up ${r3(c.up)}, rms ${s.rms.toFixed(2)} px, depth ${s.t[2].toFixed(2)} m`);
      }
    }
  }
  // 3. every other body of the hand frames, placed through that frame's camera
  const perBody = {};   // body -> [{frame, t (world), cov, rms, rv}]
  const place = (body, frame, tCam, covCam3, sysCam3, rms, rvCam) => {
    const c = camsByFrame[frame]; if (!c) return null;
    const bw = bodyInWorld({rv: rvCam ?? [0, 0, 0], t: tCam}, c);
    const Rwc = tr3(c.R), through = (C3) => nested(propagate((v) => ap3(Rwc, v), tCam, flat(C3)).cov, 3);
    const cov = addM(through(covCam3), c.cov), sys = addM(through(sysCam3), c.sys);
    (perBody[body] ??= []).push({frame, t: bw.t, rv: bw.rv, cov, sys, rms});
    return {t: bw.t, cov, sys, rv: bw.rv};
  };
  const sysOfDepth = (t, k) => [0, 1, 2].map((r) => [0, 1, 2].map((c2) => t[r] * k * t[c2] * k));
  for (const fr of handFrames) for (const [b, hand] of Object.entries(shot.hand[fr])) {
    const sh = bodies[b];
    if (anchor && b === anchor.body && sh.kind !== 'sphere') { const c = camsByFrame[fr]; if (c) (perBody[b] ??= []).push({frame: fr, t: anchorWorld.t, cov: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], rms: 0, anchor: true}); continue; }
    if (sh.kind === 'rigid') {
      const e = rigidEntries.find((x) => x.frame === fr && x.body === b); if (!e) continue;
      const d = e.pose.driftPerSigmaF ?? [0, 0, 0, 0, 0, 0], sys3 = [3, 4, 5].map((i) => [3, 4, 5].map((j) => d[i] * d[j]));
      const out = place(b, fr, e.pose.t, nested(e.pose.cov, 6).slice(3, 6).map((row) => row.slice(3, 6)), sys3, e.pose.rms, e.pose.rv);
      if (out) say(`    ${b} at f${fr}: world ${r3(out.t)} +- ${r3(sigmaOf(out.cov))} +- ${r3(sigmaOf(out.sys))}, rms ${e.pose.rms.toFixed(2)} px`);
    } else if (sh.kind === 'standing') {
      const c = camsByFrame[fr]; if (!c) continue;
      const g = anchorStanding[fr] ? besideOnGround(sh, hand, anchorStanding[fr], c, f, shot.sigmaPx ?? 3) : onGround(sh, hand, c, f, shot.sigmaPx ?? 3);
      if (g) { (perBody[b] ??= []).push({frame: fr, t: g.t, rv: toRotvec(c.R), cov: g.cov, sys: g.sys, rms: g.rms, drawn: g.drawn}); say(`    ${b} (standing on the ground${anchorStanding[fr] ? ', beside the anchor' : ''}) at f${fr}: world ${r3(g.t)} +- ${r3(sigmaOf(g.cov))} +- ${r3(sigmaOf(g.sys))}, drawn ${g.drawn.toFixed(2)} of its height (${g.px.toFixed(0)} px for ${g.expect.toFixed(0)}), ${g.depth.toFixed(2)} m from the camera`); continue; }
      const pu = pairUp(sh, hand, shot.sigmaPx ?? 3);
      const s = solvePose(pu.points3, pu.points2, cam, {fixRot: toRotvec(c.R), sigmaPx: shot.sigmaPx ?? 3});
      const out = place(b, fr, s.t, nested(s.cov, 3), sysOfDepth(s.t, Math.hypot(sigmaF / f, sh.sizeSigma ?? 0)), s.rms, toRotvec(c.R));
      if (out) say(`    ${b} (standing) at f${fr}: world ${r3(out.t)} +- ${r3(sigmaOf(out.cov))} +- ${r3(sigmaOf(out.sys))}, rms ${s.rms.toFixed(2)} px, depth ${s.t[2].toFixed(2)} m`);
    } else if (sh.kind === 'sphere') {
      const c = camsByFrame[fr]; if (!c) continue;
      const s = sphereInCam(sh.radius, hand, f, shot.sigmaPx ?? 3);
      const out = place(b, fr, s.t, s.cov, sysOfDepth(s.t, Math.hypot(sigmaF / f, sh.sizeSigma ?? 0)), s.rms, null);
      if (out) say(`    ${b} (sphere r ${sh.radius}) at f${fr}: world ${r3(out.t)} +- ${r3(sigmaOf(out.cov))} +- ${r3(sigmaOf(out.sys))}, outline rms ${s.rms.toFixed(2)} px, ${s.rPx.toFixed(1)} px of radius, ${s.d.toFixed(2)} m from the camera`);
    }
  }
  // 4. the tracker across the shot, when the hand frames allow it
  const handRms = rigidEntries.length ? shotSolve.rms : Math.max(0, ...Object.values(perBody).flat().map((x) => x.rms));
  let tracked = null;
  if (TRACK && shot.track?.length && handRms <= LIMIT_PX) {
    const t0 = process.hrtime.bigint();
    const frames = [];   // index -> pyramid
    const n = await readGray(film, ta, (fb - fa + 1) / FPS + 0.5 / FPS, (g, i) => { if (fa + i <= fb) frames.push(pyramid(g, W, H, 3)); });
    const got = frames.length;
    say(`  tracking ${shot.track.join(', ')} over ${got} frames (asked ${fb - fa + 1}) read in ${(Number(process.hrtime.bigint() - t0) / 1e9).toFixed(1)} s`);
    tracked = {frames: got, bodies: {}};
    for (const b of shot.track) {
      const sh = bodies[b], hf = handFrames.filter((x) => shot.hand[x][b]);
      if (!hf.length) continue;
      const names = sh.kind === 'sphere' ? Object.keys(shot.hand[hf[0]][b]) : sh.names.filter((nm) => shot.hand[hf[0]][b][nm]);
      // forward and backward carries from each hand frame; a frame between two takes the nearer carry; the gap between the two carries at the
      // far hand frame is the tracker's own error, said
      const carries = {}; const drift = [];
      for (const [i, from] of hf.entries()) {
        for (const dir of [1, -1]) {
          const stop = dir > 0 ? (hf[i + 1] ?? fb) : (hf[i - 1] ?? fa);
          let pts = names.map((nm) => shot.hand[from][b][nm].slice(0, 2)); let cur = from;
          carries[from] ??= {}; carries[from][from] = pts;
          while (cur !== stop) {
            const nxt = cur + dir, pa = frames[cur - fa], pb = frames[nxt - fa]; if (!pa || !pb) break;
            const out = trackLK(pa, pb, pts, {win: sh.win ?? 7, iters: 15});
            pts = out.map((o, k) => (o.ok ? [o.x, o.y] : pts[k]));
            cur = nxt; carries[from][cur] = pts;
          }
          if (cur !== from && shot.hand[cur]?.[b]) { const h = shot.hand[cur][b]; drift.push(...names.map((nm, k) => Math.hypot(pts[k][0] - h[nm][0], pts[k][1] - h[nm][1]))); }
        }
      }
      const driftRms = drift.length ? Math.sqrt(drift.reduce((s, v) => s + v * v, 0) / drift.length) : null;
      if (driftRms != null && driftRms > LIMIT_PX) {   // the tracker lost it: the hand frames stand alone for this body, the drift said
        tracked.bodies[b] = {frames: 0, drift: driftRms, rms: null, scatter: null, eyes: null, places: null, lost: true};
        say(`    ${b}: the tracker's carry lands ${driftRms.toFixed(1)} px off the far hand frames (over ${LIMIT_PX.toFixed(1)}): not tracked, the hand frames stand alone`);
        continue;
      }
      const placesT = [], rmsList = [], eyes = [];
      for (let fr = fa; fr <= fb; fr++) {
        const near = hf.reduce((a, x) => (Math.abs(x - fr) < Math.abs(a - fr) ? x : a));
        const pts = carries[near]?.[fr]; if (!pts) continue;
        const hand = Object.fromEntries(names.map((nm, k) => [nm, pts[k]]));
        const sigma = Math.max(shot.sigmaPx ?? 3, driftRms ?? 0);
        if (sh.kind === 'sphere') {
          const c = camsByFrame[near]; if (!c) continue;
          const s = sphereInCam(sh.radius, hand, f, sigma); const bw = bodyInWorld({rv: [0, 0, 0], t: s.t}, c); placesT.push(bw.t); rmsList.push(s.rms);
        } else if (sh.kind === 'standing') {
          const c = camsByFrame[near]; if (!c) continue;
          const g = anchorStanding[near] ? besideOnGround(sh, hand, anchorStanding[near], c, f, sigma) : onGround(sh, hand, c, f, sigma); if (g) { placesT.push(g.t); rmsList.push(0); continue; }
          const pu = pairUp(sh, hand, sigma); const s = solvePose(pu.points3, pu.points2, cam, {fixRot: toRotvec(c.R), sigmaPx: sigma});
          if (anchor && b === anchor.body) { const cw = cameraInWorld({rv: toRotvec(c.R), t: s.t}, anchorWorld); eyes.push(cw.eye); rmsList.push(s.rms); continue; }
          const bw = bodyInWorld({rv: toRotvec(c.R), t: s.t}, c); placesT.push(bw.t); rmsList.push(s.rms);
        } else {
          const e = rigidEntries.find((x) => x.frame === near && x.body === b); if (!e) continue;
          const pu = pairUp(sh, hand, sigma); const s = solvePose(pu.points3, pu.points2, cam, {inits: [e.pose.rv], sigmaPx: sigma});
          if (anchor && b === anchor.body) { const cw = cameraInWorld(s, anchorWorld); eyes.push(cw.eye); rmsList.push(s.rms); continue; }
          const c = camsByFrame[near]; if (!c) continue;
          const bw = bodyInWorld(s, c); placesT.push(bw.t); rmsList.push(s.rms);
        }
      }
      const rmsT = rmsList.length ? Math.sqrt(rmsList.reduce((s, v) => s + v * v, 0) / rmsList.length) : null;
      const st = placesT.length ? scatter(placesT) : eyes.length ? scatter(eyes) : null;
      tracked.bodies[b] = {frames: placesT.length || eyes.length, drift: driftRms, rms: rmsT, scatter: st, eyes: eyes.length ? eyes : null, places: placesT.length ? placesT : null};
      say(`    ${b}: ${tracked.bodies[b].frames} frames solved, the tracker's drift at the far hand frames ${driftRms == null ? 'none to check' : driftRms.toFixed(2) + ' px'}, rms ${rmsT?.toFixed(2)} px; the trajectory's scatter sigma ${st ? r3(sigmaOf(st.cov)) : '-'} m about ${st ? r3(st.mean) : '-'}`);
    }
  } else if (TRACK && shot.track?.length) say(`  no tracking: the hand frames' residual ${handRms.toFixed(2)} px is over the ${LIMIT_PX.toFixed(1)} px limit (his 2 % of the frame)`);
  // 5. what the shot measured: the camera (from the anchor's frames, fused with the tracked eyes' scatter), each body (fused over its frames)
  const camFrames = Object.entries(camsByFrame);
  let camera = null;
  if (camFrames.length) {
    const fusedEye = fuse(camFrames.map(([, c]) => ({mu: c.eye, cov: c.cov})));
    const trackedEyes = tracked?.bodies?.[anchor?.body]?.eyes;
    const sysEye = scaleM(camFrames.reduce((a, [, c]) => addM(a, c.sys), [[0, 0, 0], [0, 0, 0], [0, 0, 0]]), 1 / camFrames.length);
    const covEye = addM(trackedEyes ? addM(fusedEye.cov, scatter(trackedEyes).cov) : fusedEye.cov, sysEye);
    const c0 = camFrames[0][1];
    const depth = rigidEntries.find((e) => e.body === anchor?.body)?.pose?.t?.[2] ?? perBody[anchor?.body]?.[0]?.depth ?? Math.hypot(...fusedEye.mu);
    camera = {eye: fusedEye.mu, cov: covEye, dir: c0.dir, up: c0.up, look: fusedEye.mu.map((v, i) => v + c0.dir[i] * depth), fov: fovOf(f), sigmaFov: Math.abs(fovOf(f - sigmaF) - fovOf(f + sigmaF)) / 2, f, sigmaF, frames: camFrames.length + (trackedEyes?.length ?? 0)};
    say(`  the shot's camera: eye ${r3(camera.eye)} +- ${r3(sigmaOf(camera.cov))}, look ${r3(camera.look)}, up ${r3(camera.up)}, fov ${camera.fov.toFixed(1)} +- ${camera.sigmaFov.toFixed(1)} deg`);
  }
  const measuredBodies = {};
  for (const [b, list] of Object.entries(perBody)) {
    const real = list.filter((x) => !x.anchor);
    if (!real.length) { measuredBodies[b] = {anchor: true, mu: anchorWorld.t, cov: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], frames: list.length, rms: 0}; continue; }
    const fused = fuse(real.map((x) => ({mu: x.t, cov: x.cov})));
    const tr = tracked?.bodies?.[b];
    const sys = scaleM(real.reduce((a, x) => addM(a, x.sys ?? [[0, 0, 0], [0, 0, 0], [0, 0, 0]]), [[0, 0, 0], [0, 0, 0], [0, 0, 0]]), 1 / real.length);
    const cov = addM(tr?.scatter ? addM(fused.cov, tr.scatter.cov) : fused.cov, sys);
    const rms = Math.sqrt(real.reduce((s, x) => s + x.rms * x.rms, 0) / real.length);
    measuredBodies[b] = {mu: fused.mu, cov, frames: tr?.frames || real.length, rms: tr?.rms ?? rms, handRms: rms, drift: tr?.drift ?? null, lost: tr?.lost ?? false, heading: real[0].rv ? real[0].rv : null};
    const drawn = real.filter((x) => x.drawn != null).map((x) => x.drawn); if (drawn.length) measuredBodies[b].drawn = +(drawn.reduce((a, v) => a + v, 0) / drawn.length).toFixed(3);
    say(`  ${b}: ${r3(fused.mu)} +- ${r3(sigmaOf(cov))} m over ${measuredBodies[b].frames} frames, rms ${measuredBodies[b].rms.toFixed(2)} px${drawn.length ? `, drawn ${measuredBodies[b].drawn} of its height` : ''}`);
    if (shot.worldOf?.[b]) worldPoses[b] = {rv: shot.worldOf[b].rv ?? real[0].rv ?? [0, 0, 0], t: fused.mu.map((v, i) => v + (shot.worldOf[b].offset?.[i] ?? 0))};
  }
  results.shots.push({shot, f, sigmaF, camera, bodies: measuredBodies, handRms, tracked: tracked ? Object.fromEntries(Object.entries(tracked.bodies).map(([b, v]) => [b, {frames: v.frames, drift: v.drift, rms: v.rms}])) : null, record: rec});
  for (const [b, entity] of Object.entries(shot.entities ?? {})) {
    const m = measuredBodies[b]; if (!m) continue;
    const offset = shot.offsets?.[b] ?? [0, 0, 0];   // the body's point to the entity's place (a head's centre to the feet)
    (results.entities[entity] ??= []).push({shot: shot.id, frames: [fa, fb], t: [ta, tb], mu: m.mu.map((v, i) => v + offset[i]), cov: m.cov, frames_n: m.frames, rms: m.rms, drift: m.drift, lost: m.lost, body: b, drawn: m.drawn});
  }
}

// 6. the record: a measured block beside what was read
const method = 'hand marks of rigid keypoints on a few frames a shot, a Levenberg-Marquardt pose solve a frame with one focal a shot (its prior the fov as read), the world through the shot\'s anchor body, a pyramidal Lucas-Kanade carry across the shot\'s frames where the hand residual allowed, covariance off the normal matrix plus the trajectory\'s scatter (braindance.measure.mjs, braindance.marks.json)';
const table = [];
for (const [entity, ms] of Object.entries(results.entities)) {
  const byTrack = new Map();
  for (const m of ms) { const tr = trackOfRecord(entity, (m.t[0] + m.t[1]) / 2); if (!tr) { say(`  ! ${entity}: no track of the record holds ${m.t}`); continue; } (byTrack.get(tr) ?? byTrack.set(tr, []).get(tr)).push(m); }
  for (const [tr, list] of byTrack) {
    const fused = fuse(list.map((m) => ({mu: m.mu, cov: m.cov})));
    const frames = list.reduce((s, m) => s + m.frames_n, 0), rms = Math.sqrt(list.reduce((s, m) => s + m.rms * m.rms * m.frames_n, 0) / Math.max(1, frames));
    tr.measured = {method, frames, residual_px: +rms.toFixed(2), mu: r3(fused.mu), sigma: r3(sigmaOf(fused.cov)), cov: fused.cov.map(r4), shots: list.map((m) => ({shot: m.shot, body: m.body, frames: m.frames, t: r3(m.t), n: m.frames_n, residual_px: +m.rms.toFixed(2), drift_px: m.drift == null ? null : +m.drift.toFixed(2), ...(m.lost ? {tracker: 'lost: the hand frames alone'} : {}), mu: r3(m.mu), sigma: r3(sigmaOf(m.cov)), ...(m.drawn != null ? {drawn: m.drawn} : {})}))};
    table.push({entity, t: tr.t, read: tr.sigma, measured: tr.measured.sigma, mu_read: tr.mu, mu: tr.measured.mu, frames, rms: tr.measured.residual_px});
  }
}
for (const r of results.shots) {
  if (!r.camera || !r.record) continue;
  r.record.measured = {method, frames: r.shot.frames, t: r3([tOf(r.shot.frames[0]), tOf(r.shot.frames[1] + 1)]), hand: Object.keys(r.shot.hand).map(Number), n: r.camera.frames, residual_px: +r.handRms.toFixed(2), eye: r3(r.camera.eye), sigma: r3(sigmaOf(r.camera.cov)), cov: r.camera.cov.map(r4), look: r3(r.camera.look), up: r3(r.camera.up), fov: +r.camera.fov.toFixed(1), sigmaFov: +r.camera.sigmaFov.toFixed(1), anchor: r.shot.anchor?.body ?? null, tracked: r.tracked};
}
say('\n== the receipt (per track: sigma as read, as measured, frames, residual) ==');
for (const r of table) say(`  ${r.entity} ${r.t[0]}-${r.t[1]} s: mu read ${r.mu_read} measured ${r.mu}; sigma read ${r.read} measured ${r.measured}; ${r.frames} frames; rms ${r.rms} px`);
for (const r of results.shots) if (r.record?.measured) { const m = r.record.measured; say(`  shot "${r.record.name}" ${r.record.t}: eye read ${r.record.mu} +- ${r.record.sigma}, measured ${m.eye} +- ${m.sigma}; fov read ${r.record.fov}, measured ${m.fov} +- ${m.sigmaFov}; ${m.n} frames; rms ${m.residual_px} px`); }
/** One line of JSON: arrays and objects inline with a space after each comma and colon (strings kept whole). */
export function inline(v) {
  if (Array.isArray(v)) return `[${v.map(inline).join(', ')}]`;
  if (v && typeof v === 'object') return `{${Object.entries(v).map(([k, x]) => `${JSON.stringify(k)}: ${inline(x)}`).join(', ')}}`;
  return JSON.stringify(v);
}
/**
 * The record's file keeps its layout (one track, one shot a line): a `measured` block is appended inside that line's object, replacing the
 * one a former run left. `which(obj)` says whether a parsed line's object is the one; returns the new text and how many lines changed.
 */
export function insertMeasured(text, which, measured) {
  let changed = 0;
  const lines = text.split('\n').map((line) => {
    const m = /^(\s*)(\{.*\})(,?)\s*$/.exec(line);
    if (!m) return line;
    let obj; try { obj = JSON.parse(m[2]); } catch { return line; }
    if (!which(obj)) return line;
    let body = m[2].slice(0, -1).replace(/,\s*"measured":\s*\{.*$/s, '').replace(/\s+$/, '');
    changed++;
    return `${m[1]}${body}, "measured": ${inline(measured)}}${m[3]}`;
  });
  return {text: lines.join('\n'), changed};
}
/**
 * The other layout (main d0f9215e wrote the record one key a line, JSON.stringify(record, null, 1) by way of Python, floats as 24.0): an object
 * that `which` accepts has its `measured` block put in before its closing brace (a former block of the same name taken out first), the other
 * lines untouched, so a diff shows only the measured lines. The block is laid out with the file's one-space indent.
 */
export function insertMeasuredLines(text, which, measured) {
  const lines = text.split('\n');
  const indentOf = (l) => l.length - l.trimStart().length;
  const closes = (l, n) => indentOf(l) === n && /^\s*\},?\s*$/.test(l);
  let changed = 0;
  for (let i = 0; i < lines.length; i++) {
    const l = lines[i];
    if (!/\{\s*$/.test(l)) continue;
    const n = indentOf(l);
    let j = i + 1; while (j < lines.length && !closes(lines[j], n)) j++;
    if (j >= lines.length) continue;
    const span = lines.slice(i, j + 1).join('\n'), body = span.slice(span.indexOf('{')).replace(/,\s*$/, '');
    let obj; try { obj = JSON.parse(body); } catch { continue; }
    if (!which(obj)) continue;
    // a former block: from its "measured": { line to the close at its indent
    let k = i + 1;
    while (k < j) {
      if (new RegExp(`^\\s{${n + 1}}"measured": \\{`).test(lines[k])) {
        let e = k + 1; while (e < j && !closes(lines[e], n + 1)) e++;
        lines.splice(k, e - k + 1); j -= e - k + 1;
        if (k - 1 > i) lines[k - 1] = lines[k - 1].replace(/,\s*$/, '');
        break;
      }
      k++;
    }
    const pad = ' '.repeat(n + 1);
    const block = JSON.stringify(measured, null, 1).split('\n').map((x, idx) => (idx ? pad + x : x));
    block[0] = `${pad}"measured": ${block[0]}`;
    if (j - 1 > i && !/,\s*$/.test(lines[j - 1])) lines[j - 1] += ',';
    lines.splice(j, 0, ...block);
    changed++;
    i = j + block.length;
  }
  return {text: lines.join('\n'), changed};
}
if (WRITE) {
  let text = fs.readFileSync(recordPath, 'utf8'), total = 0;
  const oneALine = /^\s*\{.*"t": \[.*\]\s*,?\s*$/m.test(text);
  const put = (which, measured) => (oneALine ? insertMeasured : insertMeasuredLines)(text, which, measured);
  for (const [entity, ms] of Object.entries(results.entities)) for (const tr of (record.entities[entity]?.tracks ?? [])) if (tr.measured) {
    const out = put((o) => Array.isArray(o.t) && o.t[0] === tr.t[0] && o.t[1] === tr.t[1] && o.pose === tr.pose && o.evidence === tr.evidence, tr.measured);
    text = out.text; total += out.changed; if (out.changed !== 1) say(`  ! ${entity} ${tr.t}: ${out.changed} objects matched`);
  }
  for (const r of results.shots) if (r.record?.measured) {
    const out = put((o) => o.name === r.record.name && Array.isArray(o.t) && o.t[0] === r.record.t[0], r.record.measured);
    text = out.text; total += out.changed; if (out.changed !== 1) say(`  ! shot ${r.record.name}: ${out.changed} objects matched`);
  }
  JSON.parse(text);   // still a record
  fs.writeFileSync(recordPath, text);
  say(`\nwritten: ${recordPath} (${total} measured blocks, the layout ${oneALine ? 'one object a line' : 'one key a line'} kept)`);
}

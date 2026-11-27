// braindance.solve.test.mjs: the solver recovers a pose it is shown, says its residual, times itself; the shot solve finds one focal; the tracker
// follows a moved picture. All on made-up bodies and pictures: no frame of the film is needed here.
// node --test lab/braindance.solve.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {rodrigues, toRotvec, turn, lookAt, mul3, tr3, ap3, project, solvePose, solveShot, cameraInWorld, bodyInWorld, propagate, pyramid, trackLK, snapToEdge, sample, focalOf, fovOf, invert, solveLinear, block3, sigmaOf, W, H} from './braindance.solve.mjs';

const cam = {f: focalOf(40), cx: W / 2, cy: H / 2};
// a body: a figure 1.65 m tall with shoulders, hands, a head: ten points, not coplanar
const FIGURE = [[0, 0, 0], [0, 1.65, 0], [0, 1.45, 0.1], [-0.2, 1.35, 0], [0.2, 1.35, 0], [-0.25, 0.8, 0.05], [0.25, 0.8, -0.05], [-0.1, 0, 0.1], [0.1, 0, -0.1], [0, 1.0, 0.12]];
const seeded = (s) => () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
const gauss = (rnd) => { const u = 1 - rnd(), v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
const marks = (points3, pose, c, noise = 0, rnd = seeded(7)) => points3.map((X) => { const q = project(X, pose, c); return [q[0] + noise * gauss(rnd), q[1] + noise * gauss(rnd), Math.max(noise, 0.5)]; });

test('Rodrigues and its log map round-trip, and the linear algebra solves what it is given', () => {
  for (const rv of [[0.1, -0.2, 0.3], [0, 0, 0], turn('y', 90), [1.2, 0.4, -2.0]]) {
    const back = toRotvec(rodrigues(rv));
    for (let i = 0; i < 3; i++) assert.ok(Math.abs(back[i] - rv[i]) < 1e-9, `${rv} -> ${back}`);
  }
  const R = rodrigues([0.3, 0.2, 0.1]), I = mul3(R, tr3(R));
  assert.ok(Math.abs(I[0] - 1) < 1e-12 && Math.abs(I[1]) < 1e-12 && Math.abs(I[4] - 1) < 1e-12);
  const A = [4, 1, 0, 1, 3, 1, 0, 1, 2], x = solveLinear(A, [1, 2, 3], 3), Ai = invert(A, 3);
  assert.ok(Math.abs(4 * x[0] + x[1] - 1) < 1e-12 && Math.abs(x[0] + 3 * x[1] + x[2] - 2) < 1e-12);
  const AAi = mul3(A, Array.from(Ai));
  assert.ok(Math.abs(AAi[0] - 1) < 1e-12 && Math.abs(AAi[1]) < 1e-12);
  assert.ok(Math.abs(fovOf(focalOf(40)) - 40) < 1e-12);
});

test('solvePose recovers a pose exactly from exact marks (residual 0) and from any starting turn; tens of microseconds a solve', () => {
  const truth = {rv: [0.3, -1.9, 0.1], t: [0.4, -0.8, 6.0]};
  const m = marks(FIGURE, truth, cam);
  const s = solvePose(FIGURE, m, cam, {sigmaPx: 1});
  assert.ok(s.rms < 1e-6, `rms ${s.rms}`);
  const Rt = rodrigues(truth.rv);
  for (let i = 0; i < 3; i++) assert.ok(Math.abs(s.t[i] - truth.t[i]) < 1e-6, `t ${s.t}`);
  for (let i = 0; i < 9; i++) assert.ok(Math.abs(s.R[i] - Rt[i]) < 1e-6, `R ${s.R} vs ${Rt} (a rotation vector is not unique: compare the turn)`);
  assert.ok(s.candidates.length >= 4, 'several starts were tried');
  const t0 = process.hrtime.bigint(); const N = 200;
  for (let k = 0; k < N; k++) solvePose(FIGURE, m, cam, {sigmaPx: 1, inits: [[0, 0, 0]]});
  const us = Number(process.hrtime.bigint() - t0) / 1e3 / N;
  console.log(`  one-start solve of 10 points: ${us.toFixed(0)} us (CPU of this seat at nice 19 on the serving Mac)`);
  assert.ok(us < 20000, 'a solve is well under 20 ms even on a loaded Mac');
});

test('with noisy marks the residual is the noise, the covariance covers the truth, and the depth is the weak axis', () => {
  const truth = {rv: [0.2, 2.5, -0.1], t: [-0.5, 0.3, 9.0]};
  const m = marks(FIGURE, truth, cam, 1.5, seeded(11));
  const s = solvePose(FIGURE, m, cam, {sigmaPx: 1.5});
  assert.ok(s.rms > 0.4 && s.rms < 3, `rms ${s.rms} px for 1.5 px of noise`);
  const C = block3(s.cov, 6, 3), sg = sigmaOf(C);
  assert.ok(sg[2] > sg[0] && sg[2] > sg[1], `depth is the weak axis: ${sg}`);
  for (let i = 0; i < 3; i++) assert.ok(Math.abs(s.t[i] - truth.t[i]) < 4 * sg[i] + 1e-3, `t[${i}] ${s.t[i]} vs ${truth.t[i]} within 4 sigma ${sg[i]}`);
});

test('a free focal with a prior: the solve reports the focal\'s pull on the depth in its covariance', () => {
  const truth = {rv: [0.1, 0.4, 0.0], t: [0.2, 0.1, 7.0]};
  const m = marks(FIGURE, truth, cam, 1.0, seeded(3));
  const fixed = solvePose(FIGURE, m, cam, {sigmaPx: 1});
  const free = solvePose(FIGURE, m, cam, {sigmaPx: 1, freeF: true, fPrior: {mu: cam.f, sigma: cam.f * 0.2}});
  const sFixed = sigmaOf(block3(fixed.cov, 6, 3)), sFree = sigmaOf(block3(free.cov, 7, 3));
  assert.ok(sFree[2] > sFixed[2] * 1.5, `the depth's sigma grows with the focal free: ${sFixed[2]} -> ${sFree[2]}`);
  assert.ok(Math.abs(free.f - cam.f) < cam.f * 0.5, `the focal stays near its prior: ${free.f} vs ${cam.f}`);
});

test('solveShot: one focal for a shot of several frames, found from the frames when they fix it, with a sigma', () => {
  const fTrue = focalOf(33), c = {f: fTrue, cx: W / 2, cy: H / 2}, rnd = seeded(5);
  // a body seen at three depths and turns in one shot: the frames together fix the lens
  const poses = [{rv: [0.1, 0.3, 0], t: [-1.0, 0.2, 4]}, {rv: [0.0, -0.8, 0.05], t: [1.2, 0.1, 9]}, {rv: [0.2, 2.0, 0], t: [0.3, -0.2, 14]}, {rv: [-0.1, 1.0, 0.1], t: [0, 0, 6]}];
  const frames = poses.map((p) => ({points3: FIGURE, points2: marks(FIGURE, p, c, 0.7, rnd), sigmaPx: 0.7}));
  const shot = solveShot(frames, {f: focalOf(40), cx: W / 2, cy: H / 2}, {fPrior: {mu: focalOf(40), sigma: focalOf(40) * 0.3}});
  assert.ok(Math.abs(shot.f - fTrue) < 3 * shot.sigmaF + 2, `f ${shot.f.toFixed(1)} +- ${shot.sigmaF.toFixed(1)} vs ${fTrue.toFixed(1)}`);
  assert.ok(shot.sigmaF < focalOf(40) * 0.3, 'the frames narrow the prior');
  assert.ok(shot.rms < 2, `rms ${shot.rms}`);
  assert.equal(shot.frames.length, 4);
  for (let k = 0; k < 4; k++) for (let i = 0; i < 3; i++) assert.ok(Math.abs(shot.frames[k].t[i] - poses[k].t[i]) < 0.5, `frame ${k} t ${shot.frames[k].t}`);
  console.log(`  shot focal ${shot.f.toFixed(1)} +- ${shot.sigmaF.toFixed(1)} px (fov ${shot.fov.toFixed(1)} +- ${shot.sigmaFov.toFixed(1)}), truth ${fTrue.toFixed(1)}; rms ${shot.rms.toFixed(2)} px`);
});

test('the camera placed in the world from a body whose place is known, and a second body placed through it', () => {
  // the world: the fighter at the origin facing +z; the camera 12 m up and 15 m along +z, looking down at him
  const bodyW = {rv: [0, 0, 0], t: [0, 0, 0]};
  const camW = lookAt([0, 12, 15], [0, 0, 0]);
  // the body as the camera sees it: Xc = Rc (Xw) + tc with Xw = X (the body is at the origin, unturned)
  const bodyC = {rv: toRotvec(camW.R), t: camW.t};
  const placed = cameraInWorld(bodyC, bodyW);
  for (let i = 0; i < 3; i++) assert.ok(Math.abs(placed.eye[i] - [0, 12, 15][i]) < 1e-9, `eye ${placed.eye}`);
  assert.ok(placed.dir[1] < 0 && placed.dir[2] < 0, `looks down and back at the fight: ${placed.dir}`);
  assert.ok(placed.up[1] > 0.5, `up is up: ${placed.up}`);
  // Athena 0.5 m to the camera's right and 0.3 m below its axis, 0.6 m ahead: in the camera's frame
  const athenaC = {rv: [0, 0, 0], t: [0.5, 0.3, 0.6]};
  const athenaW = bodyInWorld(athenaC, placed);
  const back = {t: [...ap3(placed.R, athenaW.t)].map((v, i) => v + placed.t[i])};
  for (let i = 0; i < 3; i++) assert.ok(Math.abs(back.t[i] - athenaC.t[i]) < 1e-9, 'round trip');
  assert.ok(athenaW.t[1] > 11 && athenaW.t[1] < 12.2 && athenaW.t[2] > 14 && athenaW.t[2] < 15.5, `near the camera: ${athenaW.t}`);
});

test('fixRot: a standing figure of two points (its top and its feet) is placed with its turn held to the camera\'s, 3 x 3 covariance', () => {
  const rv = [0.4, 0.1, 0.0], truth = {rv, t: [1.5, 2.0, 16.0]}, seg = [[0, 1.65, 0], [0, 0, 0]];
  const m = marks(seg, truth, cam, 1.0, seeded(9));
  const s = solvePose(seg, m, cam, {sigmaPx: 1, fixRot: rv});
  assert.deepEqual(s.active, [3, 4, 5]);
  assert.equal(s.cov.length, 9);
  for (let i = 0; i < 3; i++) assert.ok(Math.abs(s.t[i] - truth.t[i]) < 0.6, `t ${s.t} vs ${truth.t}`);
  const sg = sigmaOf(block3(s.cov, 3, 0));
  assert.ok(sg[2] > sg[0] && sg[2] > sg[1], `depth is the weak axis: ${sg}`);
  assert.ok(s.rms < 3, `rms ${s.rms}`);
});

test('propagate carries a covariance through a map (a turn leaves sigmas on the turned axes)', () => {
  const R = rodrigues(turn('y', 90));
  const out = propagate((v) => ap3(R, v), [1, 2, 3], [1, 0, 0, 0, 4, 0, 0, 0, 9]);
  assert.ok(Math.abs(out.cov[0] - 9) < 1e-6 && Math.abs(out.cov[4] - 4) < 1e-6 && Math.abs(out.cov[8] - 1) < 1e-6, `${Array.from(out.cov)}`);
});

test('the tracker follows a drawn shape moved by a known amount, over three pyramid levels, and the snap finds the outline', () => {
  const w = 160, h = 120, a = new Uint8Array(w * h), b = new Uint8Array(w * h);
  const draw = (img, ox, oy) => { for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) { const dx = x - ox, dy = y - oy; img[y * w + x] = dx * dx + dy * dy < 400 ? 200 + ((x * 7 + y * 13) % 11) : 40; } };   // a disc with a faint texture on a flat ground
  draw(a, 60, 60); draw(b, 66.0, 57.0);
  const pa = pyramid(a, w, h, 3), pb = pyramid(b, w, h, 3);
  const pts = [[60 + 20, 60], [60 - 14, 60 - 14], [60, 60 + 20]];   // on the disc's edge
  const out = trackLK(pa, pb, pts, {win: 7, iters: 15});
  for (let i = 0; i < pts.length; i++) {
    assert.ok(out[i].ok, 'tracked');
    assert.ok(Math.abs(out[i].x - (pts[i][0] + 6)) < 0.6 && Math.abs(out[i].y - (pts[i][1] - 3)) < 0.6, `point ${i}: ${out[i].x.toFixed(2)}, ${out[i].y.toFixed(2)} for +6, -3`);
    assert.ok(out[i].err < 20, `err ${out[i].err}`);
  }
  const flat = trackLK(pa, pb, [[10, 10]], {win: 5});
  assert.equal(flat[0].ok, false, 'a flat window cannot be tracked');
  const s = snapToEdge(a, w, h, [60 + 18, 60], 4);
  const rad = Math.hypot(s[0] - 60, s[1] - 60);
  assert.ok(rad > 18.5 && rad < 21.5 && s[2] > 100, `snapped onto the disc's outline at ${s} (radius ${rad.toFixed(1)})`);
  assert.ok(Math.abs(sample(a, w, h, 60.5, 60.5) - a[60 * w + 60]) < 12);
});

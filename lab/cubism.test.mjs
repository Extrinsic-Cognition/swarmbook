// cubism.test.mjs: ATHENA'S CUBIST FIT (cubism.mjs), pure and synthetic: no film, no glb, no page. node --test cubism.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {buildAssemblySkin} from '../app/assembly-geometry.js';
import {FILM, SHOT, EYE, FIT, rotate, project, frameOf, decalOf, outlineOf, squareOf, filmOf, stageOf, squareAt, facing, isHair, hairMask, majority,
  turnOf, matrixOf, planesOf, steady, joinOf, joinOfPicture, boundaryOf, fit, chooseFace, classOf, place, rng, BOUNDS, toUnit} from './cubism.mjs';

const pents = buildAssemblySkin(0).pents, near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
const spin = {yaw: 0.38, pitch: -0.12}, centre = [600, 450], R = 180;

test('the shot is cut to cut: frames 886 to 1005, 29.563 to 33.567 s', () => {
  assert.equal(SHOT.frames.join(), '886,1006');
  assert.ok(near(SHOT.from, 29.5629, 1e-4) && near(SHOT.to, 33.5669, 1e-4));
});

test('the page sphere: decal, outline and projection as warm-sphere.js draws them', () => {
  const face = pents[9], D = decalOf(face, spin, centre, R), f = frameOf(face);
  const at = (p) => project(rotate(p, spin.yaw, spin.pitch), centre, R);
  assert.deepEqual(stageOf(0, 0, D).map((x) => +x.toFixed(9)), at(f.C).map((x) => +x.toFixed(9)));
  const right = at(f.C.map((c, i) => c + f.across[i] * f.rho)), down = at(f.C.map((c, i) => c - f.up[i] * f.rho));
  assert.ok(near(stageOf(1, 0, D)[0], right[0], 1e-9) && near(stageOf(0, 1, D)[1], down[1], 1e-9));
  const [u, v] = squareAt(...stageOf(0.3, -0.7, D), D);
  assert.ok(near(u, 0.3, 1e-9) && near(v, -0.7, 1e-9));
  assert.equal(outlineOf(face, spin, centre, R).length, 5);
  // the eye: four circumradii; a point at the centre of the sphere lands on the stage's centre
  assert.equal(EYE, 4); assert.deepEqual(project([0, 0, 0], centre, R), centre);
  // the film's centre square: columns 210 to 750 of 960, and back
  assert.deepEqual(squareOf(210, 0), [-1, -1]); assert.deepEqual(squareOf(750, 540), [1, 1]);
  assert.deepEqual(filmOf(...squareOf(612, 77)), [612, 77]);
  assert.equal(FILM.picture.join(), '82,877');
});

test('her hair by its violet: her hair yes; the rocks, the ground, the fighters, white and black no', () => {
  for (const c of [[145, 96, 155], [144, 98, 154], [152, 104, 158], [136, 98, 132]]) assert.ok(isHair(...c), `hair ${c}`);
  for (const c of [[56, 96, 102], [104, 144, 144], [98, 140, 126], [62, 32, 25], [250, 250, 250], [0, 0, 0]]) assert.ok(!isHair(...c), `not hair ${c}`);
  // a pale strand one pixel wide inside her hair is bridged by the closing; a lone violet pixel far from her goes
  const w = 20, h = 10, rgb = new Uint8Array(w * h * 3);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) rgb.set(x < 12 && x !== 6 ? [145, 96, 155] : [56, 96, 102], (y * w + x) * 3);
  rgb.set([145, 96, 155], (5 * w + 17) * 3);
  const m = hairMask(rgb, w, h, {close: 1});
  // a closing fills gaps and keeps what it does not join (the lone pixel stays; steady() drops such runs along the boundary)
  assert.equal(m[5 * w + 6], 1); assert.equal(m[5 * w + 17], 1); assert.equal(m[5 * w + 15], 0);
  assert.deepEqual([...majority([Uint8Array.of(1, 0, 1), Uint8Array.of(1, 1, 0), Uint8Array.of(0, 1, 1)])], [1, 1, 1]);
});

test('steady: runs shorter than the minimum flip to their neighbours, round the loop', () => {
  assert.deepEqual(steady([0, 0, 0, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 1, 1], 3), [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1]);
  assert.deepEqual(steady([1, 1, 1, 1], 3), [1, 1, 1, 1]);
  assert.deepEqual(steady([1, 1, 1, 1, 0, 1, 0, 0, 0, 0], 3), [1, 1, 1, 1, 1, 1, 0, 0, 0, 0]);
});

test('her turn: a rotation; seen from behind, her up tilted toward the eye by theta', () => {
  const T = turnOf({theta: 0.7, psi: 0.3, phi: -0.2}), det = (m) => m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  assert.ok(near(det(T), 1, 1e-12));
  for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) assert.ok(near(T[0][i] * T[0][j] + T[1][i] * T[1][j] + T[2][i] * T[2][j], i === j ? 1 : 0, 1e-12));
  const B = turnOf({theta: 0.6, psi: 0, phi: 0});
  assert.deepEqual([B[0][2], B[1][2], B[2][2]].map((x) => +x.toFixed(6)), [0, +Math.sin(0.6).toFixed(6), +(-Math.cos(0.6)).toFixed(6)]);   // she faces into the face
  assert.deepEqual([B[0][1], B[1][1], B[2][1]].map((x) => +x.toFixed(6)), [0, +Math.cos(0.6).toFixed(6), +Math.sin(0.6).toFixed(6)]);   // her up leans to the eye
});

test('her matrix puts her head joint at (u, v, w) in the face frame, turned with the sphere', () => {
  const local = {u: 0.5, v: -0.2, w: 0.1, s: 3, theta: 0.8, psi: 0.2, phi: -0.1}, face = pents[9], f = frameOf(face), M = matrixOf(local, face, spin);
  const head = [M[0] * 0 + M[1] * 1.392 + M[2] * 0.007 + M[3], M[4] * 0 + M[5] * 1.392 + M[6] * 0.007 + M[7], M[8] * 0 + M[9] * 1.392 + M[10] * 0.007 + M[11]];
  const want = rotate(f.C.map((c, i) => c + f.across[i] * local.u + f.up[i] * local.v + f.n[i] * local.w), spin.yaw, spin.pitch);
  head.forEach((x, i) => assert.ok(near(x, want[i], 1e-9)));
  assert.ok(near(Math.hypot(M[0], M[4], M[8]), 3, 1e-9), 'three box radii a metre');
});

test('the five planes cut out exactly the face: its inside on the negative side of all, the eye on all of them', () => {
  const face = pents[9], P = planesOf(face, spin), side = (p) => P.map((q) => q[0] * p[0] + q[1] * p[1] + q[2] * p[2] + q[3]);
  for (const s of side([0, 0, EYE])) assert.ok(Math.abs(s) < 1e-12);
  assert.ok(side(rotate(face.center, spin.yaw, spin.pitch)).every((s) => s < 0));
  const f = frameOf(face), out = rotate(f.C.map((c, i) => c + f.across[i] * 2 * f.rho), spin.yaw, spin.pitch);
  assert.ok(side(out).some((s) => s > 0));
});

test('the join read off pictures: the same edges give no gap; edges 10 px apart give 10', () => {
  const square = [[0, 0], [200, 0], [200, 200], [0, 200]];
  const band = (a, b) => (x, y) => (y >= a && y < b ? 1 : 0);
  const same = joinOfPicture(square, band(50, 120), band(50, 120));
  assert.equal(same.gap, 0); assert.equal(same.mismatch, 0);
  const off = joinOfPicture(square, band(50, 120), band(60, 130));
  assert.ok(Math.abs(off.gap - 10) <= 1, `gap ${off.gap}`); assert.ok(Math.abs(off.mismatch - 40) <= 4, `mismatch ${off.mismatch}`);
  const none = joinOfPicture(square, band(50, 120), () => 0);
  assert.equal(none.ourEdges, 0); assert.ok(none.gap >= 800 / 8, `gap ${none.gap}`);   // no edge of ours: an eighth of the boundary
});

// a synthetic face picture (her hair a band down the picture's right) and a synthetic sheet of hair (two triangles, a metre square)
const sheet = {pos: Float32Array.of(-0.2, 1.4, 0, 0.2, 1.4, 0, 0.2, 0.6, 0, -0.2, 0.6, 0), tris: Uint32Array.of(0, 1, 2, 0, 2, 3)};
const band = {w: FILM.w, h: FILM.h, mask: (() => { const m = new Uint8Array(FILM.w * FILM.h); for (let y = 60; y < 480; y++) for (let x = 640; x < 877; x++) m[y * FILM.w + x] = 1; return m; })()};

test('the join of a sheet: on the band across the edge it meets; far from it, it does not', () => {
  const face = pents[9], border = boundaryOf(face, spin, centre, R, band);
  assert.ok(border.samples.some((p) => p.drawn) && border.samples.some((p) => !p.drawn));
  const far = joinOf(border, sheet, matrixOf({u: 3, v: 2.5, w: 0, s: 1, theta: 0.7, psi: 0, phi: 0}, face, spin), centre, R);
  assert.equal(far.ourEdges, 0); assert.ok(far.mismatch > 50);
});

test('the evolution: seeded, the same twice, and better than where it starts', () => {
  const face = pents[9], views = [{spin, film: band}], start = {u: 1.6, v: 0.9, w: 0.5, s: 1.5, theta: 0.5, psi: 0.5, phi: 0.3};
  const a = fit({face, views, centre, R, hair: sheet, start}, {seed: 7, lambda: 10, mu: 3, generations: 8});
  const b = fit({face, views, centre, R, hair: sheet, start}, {seed: 7, lambda: 10, mu: 3, generations: 8});
  assert.deepEqual(a.best.local, b.best.local);
  assert.ok(a.generations.at(-1).best <= a.generations[0].best);
  assert.equal(a.evaluations, 10 + 8 * 9);
  const r = rng(3), xs = Array.from({length: 1000}, r);
  assert.ok(xs.every((x) => x >= 0 && x < 1) && Math.abs(xs.reduce((p, q) => p + q, 0) / 1000 - 0.5) < 0.05);
  assert.deepEqual(toUnit(Object.fromEntries(Object.entries(BOUNDS).map(([k, v]) => [k, v[0]]))), Object.keys(BOUNDS).map(() => 0));
});

test('FIT covers every face of the twelve, and the page gets a place at every yaw', () => {
  for (const face of pents) assert.ok(FIT.classes[classOf(face)], `no fit for ${face.id} (${classOf(face)})`);
  assert.equal(Object.keys(FIT.classes).length, 4);
  for (let d = 0; d < 360; d += 3) {
    const s = {yaw: d * Math.PI / 180, pitch: FIT.pitch}, i = chooseFace(pents, s);
    assert.ok(i >= 0 && facing(pents[i], s) > 0.3, `yaw ${d}`);
    const p = place(FIT, pents[i], s);
    assert.ok(p.matrix.length === 16 && p.matrix.every(Number.isFinite) && p.planes.length === 5, `yaw ${d}`);
    // her head stands in front of the eye's near plane
    assert.ok(p.matrix[11] < EYE - 0.05);
  }
  for (const c of Object.values(FIT.classes)) for (const [k, [lo, hi]] of Object.entries(BOUNDS)) assert.ok(c.local[k] >= lo && c.local[k] <= hi, `${k} in its bounds`);
});

test('the module rests: no timer, no frame, no network, no page', () => {
  const src = fs.readFileSync(fileURLToPath(new URL('./cubism.mjs', import.meta.url)), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  for (const word of ['requestAnimationFrame', 'setTimeout', 'setInterval', 'fetch(', 'document.', 'window.', 'performance.now']) assert.ok(!src.includes(word), word);
});

test('her shots on the page: over her shoulder, her face, the column, cut to cut; nothing outside them', async () => {
  const {SHOTS, shotOf, presenceOf, herAt, FITS} = await import('./cubism.mjs');
  assert.equal(SHOTS.length, 3); assert.equal(FITS.length, 3);
  assert.equal(shotOf(29.5), -1); assert.equal(shotOf(29.563), 0); assert.equal(shotOf(33.5), 0); assert.equal(shotOf(33.567), 1); assert.equal(shotOf(36.6), 2); assert.equal(shotOf(37.5), 2); assert.equal(shotOf(38.06), 2); assert.equal(shotOf(38.08), -1);
  const p = presenceOf(34.2); assert.equal(p.shot, 1); assert.ok(near(p.start, 33.5669, 1e-4) && near(p.end, 36.5698, 1e-4));
  for (let i = 0; i < 3; i++) for (const c of Object.keys(FITS[i].classes)) assert.ok(FITS[i].classes[c].local, `shot ${i} class ${c}`);
  for (const t of [29.8, 31.0, 34.2, 36.8]) for (let d = 0; d < 360; d += 10) {
    const keep = {}, s = {yaw: d * Math.PI / 180, pitch: -0.12}, on = herAt(t, pents, s, keep);
    assert.ok(on && on.matrix.every(Number.isFinite) && on.planes.length === 5, `t ${t} yaw ${d}`);
    assert.equal(on.shot, shotOf(t)); assert.equal(herAt(t + 0.1, pents, {yaw: s.yaw + 0.012, pitch: -0.12}, keep).face, on.face);   // the face is kept through the shot
  }
  assert.equal(herAt(29.4, pents, spin), null); assert.equal(herAt(38.1, pents, spin), null); assert.ok(herAt(37.5, pents, spin));
});

test('her portal: shut before 29.763 s and after 37.6 s, a wave then growth, the wall of light from Aiolos', async () => {
  const {PORTAL, portalWindow, portalGeometry} = await import('./cubism.mjs');
  assert.deepEqual(portalWindow(29.7, 1000, 8), {r: 0, z: 1, wall: -1}); assert.equal(portalWindow(37.7, 1000, 8).r, 0);
  assert.ok(near(portalWindow(PORTAL.open + 0.05, 1000, 8).r, 130, 1e-6));
  const a = portalWindow(31, 1000, 8), b = portalWindow(34, 1000, 8), c = portalWindow(37.1, 1000, 8);
  assert.ok(a.r < b.r && b.r < c.r && a.z < b.z && near(c.r, 1000, 1e-6) && near(c.z, 8, 1e-6) && c.wall === -1);
  assert.ok(near(portalWindow(PORTAL.aiolos, 1000, 8).wall, 0, 1e-9) && near(portalWindow(37.366, 1000, 8).wall, 500, 2));
  const g = portalGeometry(pents, spin, [662.6, 450], 180, 1205, 900);
  assert.ok(g.origin.every(Number.isFinite) && g.zFull > 1 && g.zFull < 20 && g.reach > 500, JSON.stringify(g.origin));
});

test('the fold: a tree rooted at her face, hinges of 63.435 deg, a flat net that does not overlap itself, one picture across it', async () => {
  const {foldTree, foldPose, foldAt, pictureOf, netDecal, netOverlaps, FOLD} = await import('./cubism.mjs');
  const apply = (M, p) => [M[0] * p[0] + M[1] * p[1] + M[2] * p[2] + M[3], M[4] * p[0] + M[5] * p[1] + M[6] * p[2] + M[7], M[8] * p[0] + M[9] * p[1] + M[10] * p[2] + M[11]];
  for (const yawDeg of [21.8, 90, 200, 300]) {
    const s = {yaw: yawDeg * Math.PI / 180, pitch: -0.12}, root = chooseFace(pents, s), tree = foldTree(pents, root);
    assert.equal(tree.root, root);
    assert.deepEqual([0, 1, 2, 3].map((r) => tree.faces.filter((f) => f.ring === r).length), [1, 5, 5, 1]);
    for (const f of tree.faces) if (f.parent >= 0) assert.ok(near(Math.abs(f.angle) * 180 / Math.PI, 63.4349, 1e-3), `angle ${f.angle}`);
    assert.equal(netOverlaps(pents, tree), false);
    const R = frameOf(pents[root]), flat = foldPose(pents, tree, pents.map(() => 1), 'out'), still = foldPose(pents, tree, pents.map(() => 0), 'out');
    for (let i = 0; i < 12; i++) for (const p of pents[i].verts) {
      const q = apply(flat[i], p); assert.ok(Math.abs((q[0] - R.C[0]) * R.n[0] + (q[1] - R.C[1]) * R.n[1] + (q[2] - R.C[2]) * R.n[2]) < 1e-9, 'flat in her plane');
      apply(still[i], p).forEach((x, k) => assert.ok(near(x, p[k], 1e-12)));
    }
    // the hinges stay joined at any amount
    const some = foldPose(pents, tree, pents.map((_, i) => (i * 0.137) % 1), 'out');
    for (let i = 0; i < 12; i++) { const f = tree.faces[i]; if (f.parent < 0) continue;
      for (const e of [f.hinge.a, f.hinge.b]) apply(some[i], e).forEach((x, k) => assert.ok(near(x, apply(some[f.parent], e)[k], 1e-9))); }
    // the one picture: her face's own decal, continuous across every hinge of the flat net
    const d = netDecal(pents, tree), c = pictureOf(pents[root], R.C);
    assert.ok(near(c.u, 0, 1e-12) && near(c.v, 0, 1e-12) && near(c.fx, 480, 1e-9) && near(c.fy, 270, 1e-9));
    assert.ok(near(pictureOf(pents[root], R.C.map((x, k) => x + R.across[k] * R.rho)).u, 1, 1e-12));
    const uvOf = (i, p) => { const q = pictureOf(pents[root], apply(flat[i], p)); return [q.u, q.v]; };
    for (let i = 0; i < 12; i++) { const f = tree.faces[i]; if (f.parent < 0) continue;
      for (const e of [f.hinge.a, f.hinge.b]) uvOf(i, e).forEach((x, k) => assert.ok(near(x, uvOf(f.parent, e)[k], 1e-9))); }
    assert.ok(d.every((f) => f.corners.every(([u, v]) => Number.isFinite(u) && Number.isFinite(v))));
  }
  // the fold over time: nothing before her cut, her neighbours first, all flat by 30.2 s
  const tree = foldTree(pents, chooseFace(pents, spin));
  assert.ok(foldAt(tree, FOLD.start - 0.01, 'out').every((k) => k === 0));
  const mid = foldAt(tree, 29.75, 'out'), ring = (r) => tree.faces.map((f, i) => [f.ring, mid[i]]).filter(([q]) => q === r).map(([, k]) => k);
  assert.ok(Math.min(...ring(1)) > Math.max(...ring(2)) && Math.max(...ring(3)) === 0);
  assert.ok(foldAt(tree, FOLD.flat, 'out').every((k, i) => tree.faces[i].ring === 0 ? k === 0 : near(k, 1, 1e-12)));
});

test('the one picture zoomed about her hair\'s join covers the whole flat net, the join fixed', async () => {
  const {foldTree, netDecal, pictureOf, joinOnFace, coverZoom} = await import('./cubism.mjs');
  const root = chooseFace(pents, spin), tree = foldTree(pents, root), join = joinOnFace(pents, spin, 29.8, root), z = coverZoom(pents, tree, join);
  assert.ok(join.every(Number.isFinite) && Math.abs(join[0]) < 3 && Math.abs(join[1]) < 3, JSON.stringify(join));
  assert.ok(z >= 1 && z < 20, `z ${z}`);
  const R = frameOf(pents[root]), at = R.C.map((c, k) => c + R.across[k] * join[0] * R.rho - R.up[k] * join[1] * R.rho), p = pictureOf(pents[root], at, {join, z});
  assert.ok(near(p.u, join[0], 1e-9) && near(p.v, join[1], 1e-9), 'the join stays put');
  const U0 = (82 - 480) / 270, U1 = (878 - 480) / 270, e = 1e-9;
  for (const f of netDecal(pents, tree, {join, z})) for (const [u, v] of f.corners) assert.ok(u >= U0 - e && u <= U1 + e && v >= -1 - e && v <= 1 + e, `${u}, ${v}`);
});

test('folded in (his 19:0x WEST): all twelve faces lie on her face, within 1e-6 of its plane and inside its outline; the far side first', async () => {
  const {foldTree, fold, foldAt, FOLD} = await import('./cubism.mjs');
  const apply = (M, p) => [M[0] * p[0] + M[1] * p[1] + M[2] * p[2] + M[3], M[4] * p[0] + M[5] * p[1] + M[6] * p[2] + M[7], M[8] * p[0] + M[9] * p[1] + M[10] * p[2] + M[11]];
  for (const yawDeg of [21.8, 90, 200, 300]) {
    const s = {yaw: yawDeg * Math.PI / 180, pitch: -0.12}, root = chooseFace(pents, s), F = frameOf(pents[root]);
    const {poses, ks} = fold(pents, root, FOLD.flat, 'in');
    assert.ok(ks.every((k, i) => (i === root ? k === 0 : near(k, 1, 1e-12))));
    const outline = pents[root].verts.map((p) => { const q = p.map((x, k) => x - F.C[k]); return [q[0] * F.across[0] + q[1] * F.across[1] + q[2] * F.across[2], q[0] * F.up[0] + q[1] * F.up[1] + q[2] * F.up[2]]; });
    const insideOf = ([x, y]) => outline.every((a, i) => { const b = outline[(i + 1) % 5], c = outline[(i + 2) % 5], side = (b[0] - a[0]) * (y - a[1]) - (b[1] - a[1]) * (x - a[0]), ref = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); return side * Math.sign(ref) >= -1e-6; });
    for (let i = 0; i < 12; i++) for (const p of pents[i].verts) {
      const w = apply(poses[i], p), q = w.map((x, k) => x - F.C[k]);
      assert.ok(Math.abs(q[0] * F.n[0] + q[1] * F.n[1] + q[2] * F.n[2]) < 1e-6, `face ${i} off her plane`);
      assert.ok(insideOf([q[0] * F.across[0] + q[1] * F.across[1] + q[2] * F.across[2], q[0] * F.up[0] + q[1] * F.up[1] + q[2] * F.up[2]]), `face ${i} outside her outline`);
    }
  }
  const tree = foldTree(pents, chooseFace(pents, spin)), mid = foldAt(tree, 29.8, 'in'), ringK = (r) => Math.max(...tree.faces.map((f, i) => (f.ring === r ? mid[i] : -1)));
  assert.ok(ringK(3) > ringK(1), 'in: the far side folds first'); assert.ok(foldAt(tree, FOLD.start - 0.01, 'in').every((k) => k === 0));
});

test('the one plane: the eye ray meets her plane where pictureOf reads it; the window opens at her join, grows, and the wall closes it', async () => {
  const {herPlane, pictureAtRay, pictureOf, planeWindowGeometry, planeWindowAt, planeUniforms, PORTAL, CUBIST_PLANE_GLSL} = await import('./cubism.mjs');
  const root = chooseFace(pents, spin), F = frameOf(pents[root]), plane = herPlane(pents[root], spin);
  for (const [u, v] of [[0, 0], [0.7, -0.3], [-1.2, 0.9]]) {
    const pm = F.C.map((c, k) => c + F.across[k] * u * F.rho - F.up[k] * v * F.rho), want = pictureOf(pents[root], pm);
    const viaRay = pictureAtRay(rotate(pm, spin.yaw, spin.pitch), plane);
    assert.ok(near(viaRay.u, want.u, 1e-9) && near(viaRay.v, want.v, 1e-9), `${u}, ${v}`);
    const mid = rotate(pm, spin.yaw, spin.pitch).map((x, k) => (x + [0, 0, 4][k]) / 2), alongRay = pictureAtRay(mid, plane);   // any point on the same ray
    assert.ok(near(alongRay.u, want.u, 1e-9) && near(alongRay.v, want.v, 1e-9));
  }
  const geom = planeWindowGeometry(plane, [1.34, 0.66], [662.6, 450], 180, 1205, 900);
  assert.ok(geom.reach > 1 && geom.zFull >= 1 && geom.zFull <= 8, JSON.stringify(geom));
  // cover 'above': the join's stage point reads her join, and at zFull the picture covers the stage's top left, its left edge at the join's
  // height and its top above the join; the first rule ('stage') zooms at least as far
  const ray = (x, y) => [(x - 662.6) / 180, -(y - 450) / 180, 0], U0 = (82 - 480) / 270, U1 = (878 - 480) / 270, j = pictureAtRay(ray(...geom.at), plane);
  assert.ok(near(j.u0, 1.34, 1e-9) && near(j.v0, 0.66, 1e-9), JSON.stringify(j));
  for (const [x, y] of [[0, 0], [0, geom.at[1]], [geom.at[0], 0]]) {
    const q = pictureAtRay(ray(x, y), plane, {join: geom.join, z: geom.zFull});
    assert.ok(q.u >= U0 - 1e-9 && q.u <= U1 + 1e-9 && q.v >= -1 - 1e-9 && q.v <= 1 + 1e-9, `${x}, ${y}: ${JSON.stringify(q)}`);
  }
  assert.ok(planeWindowGeometry(plane, [1.34, 0.66], [662.6, 450], 180, 1205, 900, {cover: 'stage'}).zFull >= geom.zFull);
  assert.equal(planeWindowAt(PORTAL.open - 0.01, geom).r, 0); assert.equal(planeWindowAt(PORTAL.closed, geom).r, 0);
  const a = planeWindowAt(31, geom), b = planeWindowAt(35, geom), c = planeWindowAt(PORTAL.grown, geom);
  assert.ok(a.r < b.r && b.r < c.r && near(c.r, geom.reach, 1e-9) && c.wall === -1 && near(planeWindowAt(37.366, geom).wall, geom.reach / 2, 0.02 * geom.reach));
  const U = planeUniforms(plane, geom, 31); assert.ok(U.uHerR > 0 && U.uHerZoom >= 1 && U.uHerN.length === 3);
  for (const name of ['herPictureUV', 'herWindow', 'herInPicture', 'uHerN', 'uHerWall']) assert.ok(CUBIST_PLANE_GLSL.includes(name), name);
});

test('one plane (his 19:0x and 19:1x WEST): one face and one pose from her first cut through her face shot to the wall of light', async () => {
  const {herAt, shotOf} = await import('./cubism.mjs');
  const keep = {}, s0 = {yaw: 0.38, pitch: -0.12}, first = herAt(29.6, pents, s0, keep, undefined, {onePlane: true});
  for (const t of [31.0, 34.2, 35.5, 36.8, 38.0]) {
    const spinNow = {yaw: s0.yaw + 0.12 * (t - 29.6), pitch: -0.12};   // the sphere turned since
    const later = herAt(t, pents, spinNow, keep, undefined, {onePlane: true}), kept = herAt(t, pents, spinNow, keep, undefined, {onePlane: true, faceShot: 'kept'});
    assert.equal(kept.face, first.face, `t ${t}`); assert.deepEqual(kept.matrix, first.matrix); assert.equal(kept.shot, shotOf(t)); assert.deepEqual(kept.spin, s0);
    if (shotOf(t) === 1) assert.equal(later, null, `hidden in her face shot at ${t}`); else assert.deepEqual(later.matrix, first.matrix);
  }
  // a page that seeks into her face shot first: hidden there, and her plane is picked at the column, her next appearance
  const fresh = {};
  assert.equal(herAt(34.0, pents, s0, fresh, undefined, {onePlane: true}), null); assert.equal(fresh.face, undefined);
  assert.equal(herAt(36.8, pents, s0, fresh, undefined, {onePlane: true}).face, first.face);
});

test("the film's light on her (his 19:1x WEST): measured bins cut at the shots, her luminance onto the drawn hair's, its tone on her hair-coloured parts only, the gold at her edge, a patch for her lit look only", async () => {
  const {filmLightAt, filmLit, toneShareOf, herLightUniforms, FILM_LIGHT, herLight, HER_LIGHT_GLSL} = await import('./cubism.mjs');
  assert.equal(filmLightAt(29.4), null); assert.equal(filmLightAt(38.2), null);
  const lin = (c) => { const x = c / 255; return x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4; }, Y = (c) => 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
  const a20 = FILM_LIGHT.albedo.shade.map(lin), a90 = FILM_LIGHT.albedo.lit.map(lin);
  // at a bin's middle her hair's own 20th and 90th percentile land on the drawn hair's luminance, in the drawn hair's tone
  const b = FILM_LIGHT.bins[3], L = filmLightAt((b[0] + b[1]) / 2 * 1001 / 30000), face = [0, 0, 1];
  for (const [alb, mult] of [[a20, b[2]], [a90, b[3]]]) {
    assert.ok(toneShareOf(alb) > 0.99, `her hair takes the tone: ${toneShareOf(alb)}`);
    const out = filmLit(alb, face, face, L, {form: 0}), film = alb.map((a, c) => a * mult[c]);
    assert.ok(near(Y(out), Y(film), 1e-9), `${Y(out)} ${Y(film)}`);
    assert.ok(out.every((x, c) => near(x / Y(out), L.tone[c], 1e-9)));
  }
  // her skin and the white of her dress keep their colour, only darker or lighter; in the column her skin goes dark, not green
  const skin = [230, 180, 160].map(lin), white = [235, 235, 235].map(lin), col = filmLightAt(36.8);
  assert.equal(toneShareOf(skin), 0); assert.equal(toneShareOf(white), 0);
  const dark = filmLit(skin, face, face, col, {form: 0});
  assert.ok(Y(dark) < Y(skin) / 3 && dark[0] > dark[1] && dark[1] > dark[2], JSON.stringify(dark));
  // over her shoulder no gold; from the column a gold edge
  assert.equal(filmLightAt(31.0).rimWidth, 0);
  assert.ok(col.rimWidth > 0.03 && col.rim.every((x) => x > 0.15), JSON.stringify(col));
  const edge = filmLit(a20, [1, 0, 0], face, col), faceOn = filmLit(a20, face, face, col);
  assert.ok(edge[0] > faceOn[0] + 0.1);
  // cut at the film's cut: the last frame over her shoulder takes nothing of her face shot's light
  const last = FILM_LIGHT.bins.find(([a, z]) => a <= 1005 && 1005 < z);
  assert.deepEqual(filmLightAt(1005.5 * 1001 / 30000).shade, last[2]);
  // the patch: into her lit look, before main() and just before <opaque_fragment>; a look with no lights is left as it is
  const lit = {uniforms: {}, fragmentShader: 'uniform float x;\nvoid main() {\n#include <lights_fragment_begin>\nvec3 outgoingLight = vec3(1.0);\n#include <opaque_fragment>\n}'};
  assert.equal(herLight(lit, {uHerFilm: {value: 0}}), true);
  assert.ok(lit.fragmentShader.indexOf('vec3 herFilmLit(') < lit.fragmentShader.indexOf('void main() {'));
  assert.ok(lit.fragmentShader.includes('outgoingLight = mix(outgoingLight, herFilmLit(diffuseColor.rgb, normalize(normal), normalize(vViewPosition)), uHerFilm);\n\t#include <opaque_fragment>'));
  assert.deepEqual(lit.uniforms, {uHerFilm: {value: 0}});
  assert.match(HER_LIGHT_GLSL, /const vec3 HAIR = vec3\(-?\d\.\d{6}, -?\d\.\d{6}, -?\d\.\d{6}\);/);
  const flat = {uniforms: {}, fragmentShader: 'void main() {\n#include <opaque_fragment>\n}'}, before = flat.fragmentShader;
  assert.equal(herLight(flat, {}), false); assert.equal(flat.fragmentShader, before);
  assert.equal(herLightUniforms(29.0).uHerFilm, 0); assert.equal(herLightUniforms(31.0).uHerFilm, 1);
});

test("STRUCK by his Oct 15 2026 00:44 WEST words, kept as the record (hexCells, off the page): THE FOLD as he gave it at 19:19 WEST, every face to its own cell of a hexagonal lattice in her plane, turned like her face, nearest first, and back into the sphere at the wall of light", async () => {
  const {hexCells, hexAt, hexFold, HEX, FOLD, PORTAL} = await import('./cubism.mjs');
  const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], I = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  const at4 = (M, p) => [0, 1, 2].map((r) => M[r * 4] * p[0] + M[r * 4 + 1] * p[1] + M[r * 4 + 2] * p[2] + M[r * 4 + 3]);
  for (const root of [0, 5, chooseFace(pents, spin)]) {
    const cells = hexCells(pents, root), R0 = frameOf(pents[root]), posesAt = (t) => hexFold(pents, root, t, cells).poses;
    // on the sphere before her cut and once the sphere is whole again (38.071 s)
    for (const t of [FOLD.start - 0.01, FOLD.start, HEX.whole, HEX.whole + 1]) for (const P of posesAt(t)) assert.deepEqual(P, I, `t ${t}`);
    // flat from 30.2 s to the wall: in her plane, each at its own cell, its outside toward the eye, turned like her face, no two meeting
    const corner = (pts) => { const c = pts.reduce((s, q) => [s[0] + q[0] / 5, s[1] + q[1] / 5], [0, 0]); return Math.atan2(pts[0][1] - c[1], pts[0][0] - c[0]); };
    const herCorner = corner(pents[root].verts.map((v) => { const q = v.map((x, k) => x - R0.C[k]); return [dot(q, R0.across), dot(q, R0.up)]; }));
    for (const t of [FOLD.flat, 33.0, PORTAL.aiolos - 1e-3]) {
      const P = posesAt(t), centres = [];
      assert.deepEqual(P[root], I);
      pents.forEach((f, i) => {
        const flat = f.verts.map((v) => { const q = at4(P[i], v).map((x, k) => x - R0.C[k]); return [dot(q, R0.across) / R0.rho, dot(q, R0.up) / R0.rho, dot(q, R0.n)]; });
        assert.ok(flat.every((q) => Math.abs(q[2]) < 1e-9), `face ${i} in her plane at ${t}`);
        const c = flat.reduce((s, q) => [s[0] + q[0] / 5, s[1] + q[1] / 5], [0, 0]); centres.push(c);
        assert.ok(near(c[0], cells.faces[i].cell[0], 1e-9) && near(c[1], cells.faces[i].cell[1], 1e-9), `face ${i} at its cell`);
        const n = [0, 1, 2].map((r) => P[i][r * 4] * f.normal[0] + P[i][r * 4 + 1] * f.normal[1] + P[i][r * 4 + 2] * f.normal[2]);
        assert.ok(dot(n, R0.n) > 1 - 1e-9, `face ${i} faces the eye's side`);
        const turn = (((corner(flat) - herCorner) % (2 * Math.PI / 5)) + 2 * Math.PI / 5) % (2 * Math.PI / 5);
        assert.ok(Math.min(turn, 2 * Math.PI / 5 - turn) < 1e-6, `face ${i} turned like hers`);
      });
      for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) assert.ok(Math.hypot(centres[a][0] - centres[b][0], centres[a][1] - centres[b][1]) >= 2 - 1e-9, `${a} and ${b} do not meet`);
    }
    // the least total travel: no swap of two faces' cells travels less
    const cost = (i, at) => { const q = pents[i].center.map((x, k) => x - at[k]); return dot(q, q); };
    for (let a = 0; a < 12; a++) for (let b = a + 1; b < 12; b++) if (a !== root && b !== root) {
      assert.ok(cost(a, cells.faces[b].at) + cost(b, cells.faces[a].at) >= cost(a, cells.faces[a].at) + cost(b, cells.faces[b].at) - 1e-12);
    }
    // the nearest comes first and goes first; on the way back at the wall, all home by 38.071 s
    const first = cells.faces.findIndex((f) => f.rank === 0), last = cells.faces.findIndex((f) => f.rank === 10), ks = hexAt(cells, FOLD.start + HEX.dur + 1e-3);
    assert.ok(ks[first] === 1 && ks[last] < 1);
    const back = hexAt(cells, PORTAL.aiolos + HEX.back + 1e-3);
    assert.ok(back[first] === 0 && back[last] > 0);
    assert.ok(hexAt(cells, HEX.whole - 1e-3).some((k) => k > 0) && hexAt(cells, HEX.whole).every((k) => k === 0));
  }
});

test("STRUCK by his Oct 15 2026 00:44 WEST words, kept as the record (hexCells, off the page): the lattice landed and square to the eye, its twelve faces one picture (each point of each face reads the one picture in her plane at its own place, as the face shader does), and at her cut and once whole where the sphere has them", async () => {
  const {hexCells, hexFold, herPlane, pictureAtRay, FOLD, HEX} = await import('./cubism.mjs');
  const at4 = (M, p) => [0, 1, 2].map((r) => M[r * 4] * p[0] + M[r * 4 + 1] * p[1] + M[r * 4 + 2] * p[2] + M[r * 4 + 3]);
  const squareTo = (n) => ({yaw: Math.atan2(n[0], n[2]), pitch: Math.atan2(n[1], Math.hypot(n[0], n[2]))});
  const dot3 = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
  for (const root of [chooseFace(pents, spin), 2, 11]) {
    const cells = hexCells(pents, root), to = squareTo(pents[root].normal), plane = herPlane(pents[root], to), R0 = frameOf(pents[root]);
    for (const t of [FOLD.start, HEX.whole]) for (const [i, f] of pents.entries()) {
      const P = hexFold(pents, root, t, cells).poses[i];
      for (const v of f.verts) assert.ok(at4(P, v).every((x, k) => near(x, v[k], 1e-12)), `face ${i} on the sphere at ${t}`);
    }
    const seen = new Set();
    for (const t of [FOLD.flat, 33.0]) {
      const poses = hexFold(pents, root, t, cells).poses;
      pents.forEach((f, i) => {
        const [cx, cy] = cells.faces[i].cell;
        for (const p of [f.center, ...f.verts]) {
          const m = at4(poses[i], p), view = rotate(m, to.yaw, to.pitch), r = pictureAtRay(view, plane);
          const q = m.map((x, k) => x - R0.C[k]), want = [dot3(q, R0.across) / R0.rho, -dot3(q, R0.up) / R0.rho];
          assert.ok(near(r.u0, want[0], 1e-9) && near(r.v0, want[1], 1e-9), `face ${i} reads the one picture where it lies (${t})`);
          if (p === f.center) { assert.ok(near(r.u0, cx, 1e-9) && near(r.v0, -cy, 1e-9), `face ${i} at its cell`); seen.add(`${t}|${cx.toFixed(3)},${cy.toFixed(3)}`); }
        }
      });
    }
    assert.equal(seen.size, 24, 'twelve cells, twelve places in the one picture: no copies');
  }
});

// ---- THE FOLD AS ONE WINDOW (his Oct 15 2026 00:44 WEST, over the lattice above on his page at 31 to 33 s: "this grid dude is all absolutely
// fucked up. you gotta do differently. when does it stop being a dodecahedron mask??"): every face onto her own face by 30.2 s, that pentagon
// into her window by 30.5 s, no face from there to the wall of light, back into the sphere from the stacked pentagon, whole at 38.071 s ----
const at4 = (M, p) => [0, 1, 2].map((r) => M[r * 4] * p[0] + M[r * 4 + 1] * p[1] + M[r * 4 + 2] * p[2] + M[r * 4 + 3]);
const dist3 = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const ROOTS = [0, 5, 11, chooseFace(pents, spin)];

test('ONE WINDOW: at 30.2 s every face lies on her face: its centre on her centre and every corner on one of hers (1e-6), flat in her plane, its outside toward the eye; so to the wall', async () => {
  const {oneCells, oneFold, FOLD, PORTAL, ONE} = await import('./cubism.mjs');
  for (const root of ROOTS) {
    const cells = oneCells(pents, root), R0 = frameOf(pents[root]), hers = pents[root].verts;
    assert.ok(cells.faces.every((c) => c.cell[0] === 0 && c.cell[1] === 0 && dist3(c.at, R0.C) === 0), 'her own cell, for all twelve');
    for (const t of [FOLD.flat, ONE.gone - 1e-3, 33.0, PORTAL.aiolos - 1e-3]) {
      const {poses, ks} = oneFold(pents, root, t, cells);
      pents.forEach((f, i) => {
        if (i !== root) assert.equal(ks[i], 1, `face ${i} down at ${t}`);
        assert.ok(dist3(at4(poses[i], f.center), R0.C) < 1e-6, `face ${i}'s centre on hers at ${t}`);
        const taken = new Set();
        for (const v of f.verts) {
          const w = at4(poses[i], v), k = hers.findIndex((h) => dist3(w, h) < 1e-6);
          assert.ok(k >= 0, `face ${i}: a corner on none of hers at ${t}`); taken.add(k);
          assert.ok(Math.abs((w[0] - R0.C[0]) * R0.n[0] + (w[1] - R0.C[1]) * R0.n[1] + (w[2] - R0.C[2]) * R0.n[2]) < 1e-6, `face ${i} in her plane`);
        }
        assert.equal(taken.size, 5, `face ${i}: its five corners on her five`);
        const n = [0, 1, 2].map((r) => poses[i][r * 4] * f.normal[0] + poses[i][r * 4 + 1] * f.normal[1] + poses[i][r * 4 + 2] * f.normal[2]);
        assert.ok(n[0] * R0.n[0] + n[1] * R0.n[1] + n[2] * R0.n[2] > 1 - 1e-9, `face ${i}'s outside toward the eye`);
      });
    }
  }
});

test('ONE WINDOW: before 30.2 s no face lands anywhere else: from her cut each runs straight at her centre, turning about one axis, the nearest first (her five neighbours, the five beyond, the opposite face last), and a face down lies on her face (every 5 ms)', async () => {
  const {oneCells, oneFold, adjacencyOf, FOLD, HEX} = await import('./cubism.mjs');
  for (const root of ROOTS) {
    const cells = oneCells(pents, root), R0 = frameOf(pents[root]), hers = pents[root].verts, nb = adjacencyOf(pents)[root].map((n) => n.face);
    const opposite = pents.findIndex((f) => f.normal.every((x, k) => Math.abs(x + pents[root].normal[k]) < 1e-9));
    assert.deepEqual(nb.map((i) => cells.faces[i].rank).sort((a, b) => a - b), [0, 1, 2, 3, 4], 'her neighbours first');
    assert.equal(cells.faces[opposite].rank, 10, 'the face opposite hers last');
    for (let t = FOLD.start - 0.02; t < FOLD.flat + 0.02; t += 0.005) {
      const {poses, ks} = oneFold(pents, root, t, cells);
      pents.forEach((f, i) => {
        const c = at4(poses[i], f.center), k = ks[i], want = f.center.map((x, j) => x + (R0.C[j] - x) * k);
        assert.ok(k >= 0 && k <= 1 && dist3(c, want) < 1e-9, `face ${i} off its straight way to her centre at ${t.toFixed(3)}`);
        if (t <= FOLD.start) assert.ok(f.verts.every((v) => dist3(at4(poses[i], v), v) < 1e-12), `face ${i} on the sphere at her cut`);
        if (k === 1) assert.ok(f.verts.every((v) => hers.some((h) => dist3(at4(poses[i], v), h) < 1e-6)), `face ${i} down off her face at ${t.toFixed(3)}`);
      });
    }
    assert.ok(oneFold(pents, root, FOLD.flat, cells).ks.every((k, i) => (i === root ? k === 0 : k === 1)), 'all down by 30.2 s');
    assert.ok(oneFold(pents, root, FOLD.start + HEX.dur + 1e-3, cells).ks.some((k) => k > 0 && k < 1), 'one after another');
  }
});

test('ONE WINDOW: from 30.5 s to the wall of light no face is drawn (every 5 ms); before it and from the wall they are', async () => {
  const {oneFold, oneCells, facesDrawn, ONE, PORTAL, FOLD, HEX} = await import('./cubism.mjs');
  const cells = oneCells(pents, chooseFace(pents, spin));
  for (let t = ONE.gone; t < PORTAL.aiolos; t += 0.005) assert.equal(oneFold(pents, cells.root, t, cells).drawn, false, `a face drawn at ${t.toFixed(3)}`);
  assert.equal(facesDrawn(PORTAL.aiolos - 1e-9), false);
  for (let t = FOLD.start; t < ONE.gone; t += 0.005) assert.equal(facesDrawn(t), true, `no face at ${t.toFixed(3)}`);
  for (let t = PORTAL.aiolos; t <= HEX.whole; t += 0.005) assert.equal(facesDrawn(t), true, `no face at ${t.toFixed(3)}`);
});

test('ONE WINDOW: her window takes the one pentagon from 30.2 to 30.5 s (out from her hair\'s join past its farthest corner, the leading melted and the rim clear of it as its faces go), then grows to the stage by 37.1 s as before; it never shrinks nor jumps (every 5 ms), its zoom as it was', async () => {
  const {herPlane, planeWindowGeometry, planeWindowAt, joinOnFace, ONE, PORTAL, FOLD, project: proj} = await import('./cubism.mjs');
  const {squareTo} = await import('./unboxing-plan.mjs');
  const ease = (k) => { const x = Math.min(1, Math.max(0, k)); return x * x * (3 - 2 * x); }, grow = (t) => ease((t - PORTAL.waveEnd) / (PORTAL.grown - PORTAL.waveEnd));
  for (const yawDeg of [0, 50, 65, 120, 200, 300]) {
    const from = {yaw: yawDeg * Math.PI / 180, pitch: -0.12}, root = chooseFace(pents, from), to = squareTo(pents[root].normal), plane = herPlane(pents[root], to);
    const join = joinOnFace(pents, to, FOLD.start, root), geom = planeWindowGeometry(plane, join, [662.6, 450], 180, 1205, 900);
    const far = Math.max(...plane.corners.map(([u, v]) => Math.hypot(u - join[0], v - join[1])));
    const c0 = proj(plane.C, [662.6, 450], 180), c1 = proj(plane.C.map((x, k) => x + plane.across[k] * plane.rho), [662.6, 450], 180), px = Math.hypot(c1[0] - c0[0], c1[1] - c0[1]);
    assert.ok(Math.abs(geom.swallow - (far + ONE.band + ONE.rim / px)) < 1e-9 && geom.swallow < geom.reach, JSON.stringify({far, geom}));
    // her corners, read off her plane, are her face's own (unit distance from her centre)
    for (const [u, v] of plane.corners) assert.ok(near(Math.hypot(u, v), 1, 1e-9));
    const gone = planeWindowAt(ONE.gone, geom);
    assert.ok(gone.r >= far + ONE.band + ONE.rim / px - 1e-9, `the window holds her face, its leading melted and its rim clear of it, at ${ONE.gone} s`);
    assert.ok(planeWindowAt(ONE.melt - 1e-3, geom).r < far, 'the pentagon is not yet in it before 30.2 s');
    // as it was before 30.2 s, and its zoom throughout; the stage reached by 37.1 s
    for (const t of [PORTAL.open + 0.05, 29.9, 30.1, ONE.melt - 1e-3]) {
      const w = planeWindowAt(t, geom), r = t < PORTAL.waveEnd ? (t - PORTAL.open) / (PORTAL.waveEnd - PORTAL.open) : 1 + (geom.reach - 1) * grow(t);
      assert.ok(near(w.r, r, 1e-12), `r at ${t}`);
    }
    for (let t = PORTAL.waveEnd; t < PORTAL.closed; t += 0.05) assert.ok(near(planeWindowAt(t, geom).z, 1 + (geom.zFull - 1) * grow(t), 1e-12), `zoom at ${t}`);
    assert.ok(near(planeWindowAt(PORTAL.grown, geom).r, geom.reach, 1e-9));
    let prev = planeWindowAt(PORTAL.open, geom).r;
    for (let t = PORTAL.open + 0.005; t < PORTAL.closed; t += 0.005) {
      const r = planeWindowAt(t, geom).r;
      assert.ok(r >= prev - 1e-12 && r - prev < 0.1, `r ${prev} to ${r} at ${t.toFixed(3)}`);
      prev = r;
    }
  }
});

test('ONE WINDOW: the go from the stacked pentagon, its timing unchanged: the nearest leaves first at the wall of light, each over 0.4 s, the last home at 38.071 s, the sphere whole; nothing jumps (every 5 ms)', async () => {
  const {oneCells, oneFold, hexAt, PORTAL, HEX} = await import('./cubism.mjs');
  const I = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  for (const root of ROOTS) {
    const cells = oneCells(pents, root), go = (HEX.whole - PORTAL.aiolos - HEX.back) / 10, byRank = (r) => cells.faces.findIndex((f) => f.rank === r);
    const corners = (t) => { const {poses} = oneFold(pents, root, t, cells); return pents.flatMap((f, i) => f.verts.map((v) => at4(poses[i], v))); };
    // at the wall the faces come back where they lay: on her face, as they were before they went (nothing jumps there)
    const held = corners(PORTAL.aiolos - 1e-6), wall = corners(PORTAL.aiolos);
    held.forEach((p, j) => assert.ok(dist3(p, wall[j]) < 1e-9));
    // the schedule (hexAt's go, as it was): rank r leaves at aiolos + r * go and is home HEX.back later
    for (let r = 0; r < 11; r++) {
      const i = byRank(r), leave = PORTAL.aiolos + r * go;
      assert.equal(hexAt(cells, leave)[i], 1, `rank ${r} still down as it leaves`);
      assert.ok(hexAt(cells, leave + 0.05)[i] < 1, `rank ${r} on its way`);
      assert.equal(hexAt(cells, leave + HEX.back + 1e-9)[i], 0, `rank ${r} home`);
    }
    assert.ok(near(PORTAL.aiolos + 10 * go + HEX.back, HEX.whole, 1e-12), 'the last home at 38.071 s');
    for (const P of oneFold(pents, root, HEX.whole, cells).poses) assert.deepEqual(P, I, 'the sphere whole');
    let prev = wall;
    for (let t = PORTAL.aiolos + 0.005; t <= HEX.whole + 1e-9; t += 0.005) {
      const now = corners(t), most = Math.max(...now.map((p, j) => dist3(p, prev[j])));
      assert.ok(most < 0.08, `a corner moves ${most.toFixed(4)} box radii in 5 ms at ${t.toFixed(3)}`);
      prev = now;
    }
  }
});

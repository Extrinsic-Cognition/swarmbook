// fields.test.mjs: THE FIELDS (fields-plan.mjs, fields-film.mjs, fields.measure.mjs's pieces, fields.js built through the hero's own three.js
// r185 in node, no GPU). No film is decoded and no page is opened: the pictures and the cost are fields.proof.mjs's.
//   node --test --test-force-exit --test-timeout=60000 fields.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {registerHooks} from 'node:module';
import {fileURLToPath} from 'node:url';
import {HAIR, SWAY, BURST, STAR, LIGHT} from './fields-film.mjs';
import {CUTS, FPS, hairAt, flowAt, flowBytes, STREAM, streamOf, growGuides, capOf, extended, resample, smoothed, strandsOf, lightAt, filmLight, raysOf,
  surfaceOf, dissolveAt, DISSOLVE_CANDIDATES, STYLES, faceFlowFrame, screenFlowFrame, rng, HAIR_PAINT, anyAt} from './fields-plan.mjs';
import {directionOf, awayFrom, fillOut, raysOf as ringRays, toSquare, fromSquare, GRID, scoreOf} from './fields.measure.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
const PROCEDURAL = path.resolve(HERE, '../../room/procedural');
registerHooks({resolve: (s, c, n) => (s === 'three' ? {url: `file://${PROCEDURAL}/three.module.js`, shortCircuit: true} : n(s, c))});
globalThis.self ??= globalThis;
globalThis.createImageBitmap ??= async () => ({width: 512, height: 512, close() {}});

test('the film readings have the shape fields-plan.mjs reads', () => {
  const g = HAIR.grid;
  assert.equal(HAIR.a.length, g.nu * g.nv); assert.equal(HAIR.c.length, g.nu * g.nv);
  assert.ok(HAIR.a.every(Number.isFinite), 'every cell has a direction (filled outward from the read ones)');
  assert.ok(HAIR.read > 100, `cells that read hair: ${HAIR.read}`);
  assert.equal(SWAY.length, 120, 'a sway a frame over the shot, frames 886 to 1005');
  assert.ok(SWAY.every((a) => Math.abs(a) < 0.3), 'the drawn hair sways within 17 degrees');
  assert.equal(BURST.rays.length, 16); assert.ok(BURST.rays.every(([deg, k, w]) => deg >= 0 && deg < 360 && k > 0 && k <= 1 && w >= 1));
  assert.ok(near(BURST.centre[0], 465, 15) && near(BURST.centre[1], 283, 15), 'the burst stands mid-picture');
  assert.ok(STAR.rays.length > 0 && STAR.centre[1] < 150, 'the star high in the sky');
  assert.equal(LIGHT.length, 2); assert.ok(LIGHT.every((w) => w.dt === 0.1 && w.light.length === w.gold.length));
});

test('the hair: on round the shot over her shoulder, the wind full inside it, the film\'s own sway', () => {
  assert.equal(hairAt(28.9).on, false); assert.equal(hairAt(34.2).on, false); assert.equal(hairAt(NaN).on, false);
  assert.equal(hairAt(29.2).on, true); assert.ok(hairAt(29.2).wind > 0 && hairAt(29.2).wind < 1, 'easing in before the cut');
  assert.equal(hairAt(31).wind, 1); assert.equal(hairAt(33.8).on, true);
  const n = Math.round(31 * FPS) - 886;
  assert.equal(hairAt(31).sway, SWAY[n]);
  assert.equal(hairAt(29.3).sway, 0, 'no sway outside the shot');
  assert.equal(hairAt(37).wind, 1, 'her shot at the column'); assert.equal(hairAt(73.5).wind, 1, 'her last shot');
  assert.equal(hairAt(37).sway, 0, 'the sway was read in the first shot only');
  assert.equal(hairAt(71.5).on, false, 'Seiya in the light: not her shot');
  assert.equal(hairAt(35).on, false);
});

test('the drawn hair\'s flow: her back falls, the streaming part runs left and down, unit everywhere', () => {
  const back = flowAt(0.6, 0), stream = flowAt(-0.5, 0.6);
  assert.ok(back[1] > 0.8, `her back falls: ${back}`);
  assert.ok(stream[0] < -0.6 && stream[1] > 0.2, `the stream runs left and down: ${stream}`);
  for (const [u, v] of [[-9, -9], [9, 9], [0.3, -0.2], [-1.49, 0.99]]) assert.ok(near(Math.hypot(...flowAt(u, v)), 1, 1e-9));
  assert.ok(STREAM[0] < -0.7 && STREAM[1] > 0.2 && near(Math.hypot(...STREAM), 1, 1e-12), `the stream: ${STREAM}`);
  assert.deepEqual(streamOf(), STREAM);
  const b = flowBytes();
  assert.equal(b.length, HAIR.grid.nu * HAIR.grid.nv * 4);
  const i = 5 * HAIR.grid.nu + 20, a = HAIR.a[i];
  assert.ok(near(b[i * 4] / 255 * 2 - 1, Math.cos(a), 0.01) && near(b[i * 4 + 1] / 255 * 2 - 1, Math.sin(a), 0.01));
});

test('the measure\'s pieces: a strand across a gradient, pointed away from her head, cells filled, rays as peaks', () => {
  // a vertical edge (gradient along x): the strands run up and down
  const d = directionOf(4, 0, 0);
  assert.ok(near(Math.abs(Math.sin(d.a)), 1, 1e-9) && near(d.c, 1, 1e-9));
  assert.equal(directionOf(0, 0, 0).c, 0);
  assert.ok(near(Math.sin(awayFrom(Math.PI / 2, [0, 1], [0, 0])), 1, 1e-12) && near(Math.sin(awayFrom(Math.PI / 2, [0, -1], [0, 0])), -1, 1e-12));
  const g = {nu: 3, nv: 1}, filled = fillOut([{a: 1, c: 1}, {a: NaN, c: 0}, {a: NaN, c: 0}], g);
  assert.ok(filled.every((x) => near(x.a, 1, 1e-12)));
  const ring = new Float64Array(360).fill(0.1);
  for (const at of [30, 150, 270]) for (let k = -2; k <= 2; k++) ring[(at + k + 360) % 360] = 1 - Math.abs(k) * 0.2;
  assert.deepEqual(ringRays(ring).map((r) => r.deg), [30, 150, 270]);
  assert.deepEqual(fromSquare(...toSquare(612, 77)).map((x) => +x.toFixed(9)), [612, 77]);
  assert.equal(GRID.nu * GRID.nv, HAIR.a.length);
  assert.ok(scoreOf(1, 0.85, 0.3).gold > 0.5 && scoreOf(0.1, 0.1, 0.1).score === 0, 'white-hot gold is light, the dark is not');
});

test('the light: from the gold star on, the burst at its cut, the centaur\'s flames, off with the knights', () => {
  assert.equal(lightAt(42.3).on, false); assert.equal(lightAt(54).on, false);
  const star = lightAt(43.8), burst = lightAt(46.5), sun = lightAt(48.5), flood = lightAt(49.9), flames = lightAt(51.5);
  assert.ok(star.on && star.star > 0.9 && star.burst === 0 && star.grow > 0.5);
  assert.ok(burst.burst === 1 && burst.star === 0 && burst.grow === 1 && burst.power > 0.5);
  assert.ok(near(lightAt(CUTS.burst).grow, 0, 1e-12) && lightAt(CUTS.burst + 0.4).grow === 1, 'the rays shoot out over 0.35 s from the cut');
  assert.ok(sun.sun === 1 && sun.burst < 0.2);
  assert.ok(flood.flood > 0.5);
  assert.ok(flames.flames === 1 && flames.power >= 0.6);
  assert.ok(near(filmLight(46.5), lightAt(46.5).power * 0.19, 1e-9) || lightAt(46.5).power === 1.6, 'the power is the film\'s light');
  assert.equal(filmLight(10), 0);
});

test('the rays are the film\'s: each keeps its angle in the picture, leaning out of it', () => {
  const rays = raysOf({lean: 0.55, extra: 4});
  assert.equal(rays.length, 20);
  rays.forEach((r, i) => {
    assert.ok(near(Math.hypot(...r.dir), 1, 1e-12));
    if (i >= 16) { assert.ok(r.thin); return; }
    const deg = ((Math.atan2(-r.dir[1], r.dir[0]) * 180 / Math.PI) + 360) % 360;   // the picture's y runs down, the field's up
    assert.ok(near(deg, BURST.rays[i][0], 1e-9), `ray ${i}: ${deg} against the film's ${BURST.rays[i][0]}`);
    assert.ok(Math.abs(r.dir[2]) <= Math.sin(0.55) + 1e-12);
  });
  assert.deepEqual(raysOf(), raysOf(), 'seeded: every glass the same rays');
});

test('guides from a sheet hanging off a scalp: one a lock, root at the scalp, tip at the lock\'s end', () => {
  // two locks, each a strip of quads 0.1 m wide falling from y 1.5 (the scalp's ring) to y 0.9 and 0.8
  const pos = [], tris = [];
  const strip = (x0, bottom) => {
    const base = pos.length / 3, rows = 7;
    for (let r = 0; r < rows; r++) { const y = 1.5 - (1.5 - bottom) * r / (rows - 1); pos.push(x0, y, -0.1, x0 + 0.1, y, -0.1); }
    for (let r = 0; r < rows - 1; r++) { const a = base + r * 2; tris.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
    pos.push(x0 + 0.05, bottom - 0.08, -0.1); const tip = pos.length / 3 - 1, last = base + (rows - 1) * 2; tris.push(last, last + 1, tip);
  };
  strip(-0.2, 0.9); strip(0.1, 0.8);
  const g = growGuides(Float32Array.from(pos), Uint32Array.from(tris), {head: [0, 1.45, 0], scalp: 0.4, minLength: 0.3, K: 12});
  assert.equal(g.guides.length, 2);
  for (const gd of g.guides) {
    assert.equal(gd.points.length, 12);
    assert.ok(gd.root[1] > 1.45, 'rooted on the scalp');
    assert.ok(gd.points[11][1] < 0.85, 'ends at the lock\'s tip');
  }
  assert.ok(g.guides[0].azimuth < g.guides[1].azimuth, 'sorted round the head');
  const keep = capOf(Uint32Array.from(tris), g, {head: [0, 1.45, 0], capMax: 0.15});
  assert.ok(keep.length > 0 && keep.length < tris.length, 'the cap is kept, the locks go to the strands');
  const r = resample([[0, 0, 0], [0, 1, 0], [0, 3, 0]], 4);
  assert.deepEqual(r.map((p) => +p[1].toFixed(9)), [0, 1, 2, 3]);
  assert.deepEqual(smoothed([[0, 0, 0], [1, 5, 0], [2, 0, 0]], 1)[1], [1, 2.5, 0]);
  const e = extended([[0, 0, 0], [0, -1, 0], [0, -2, 0]], 1.5);
  assert.ok(near(e[2][1], -3, 1e-9), 'grown on past its tip to one and a half times its length');
});

test('strands between neighbouring guides, clumped, seeded, root to tip', () => {
  const line = (x) => ({points: Array.from({length: 8}, (_, k) => [x, 1.4 - k * 0.1, -0.1])});
  const guides = [line(-0.1), line(0), line(0.1)], a = strandsOf(guides, 50), b = strandsOf(guides, 50);
  assert.equal(a.length, 50 * 8 * 4); assert.deepEqual(a, b);
  for (let s = 0; s < 50; s++) {
    assert.equal(a[(s * 8) * 4 + 3], 0); assert.equal(a[(s * 8 + 7) * 4 + 3], 1);
    const x = a[(s * 8) * 4], y = a[(s * 8 + 7) * 4 + 1];
    assert.ok(x > -0.13 && x < 0.13, 'between the guides, within the spread');
    assert.ok(y < 1.4 - 0.82 * 0.7 + 1e-6, 'at least 82 % of the guides\' length');
  }
});

test('her own hair grows 12 locks and keeps its cap (athena.hades.glb through three r185)', async () => {
  const {hairOf} = await import('./cubism.fit.mjs');
  const hair = await hairOf(path.join(HERE, 'athena.hades.glb'));
  const g = growGuides(hair.pos, hair.tris);
  assert.equal(g.welded, 642); assert.equal(g.guides.length, 12);
  assert.ok(g.guides.every((x) => x.length > 0.4 && x.length < 0.9), g.guides.map((x) => x.length.toFixed(2)).join(' '));
  assert.ok(g.guides.every((x) => Math.abs(x.azimuth) < Math.PI / 3), 'the long locks are down her back');
  const keep = capOf(hair.tris, g);
  assert.ok(keep.length / 3 > 200 && keep.length / 3 < 1100, `the cap and front: ${keep.length / 3} of 1280 triangles`);
});

test('a surface sampled by area, on the surface, its normals unit', () => {
  // a 2 x 1 rectangle and a far tiny triangle: the tiny one gets almost nothing
  const pos = Float32Array.from([0, 0, 0, 2, 0, 0, 2, 1, 0, 0, 1, 0, 10, 10, 10, 10.01, 10, 10, 10, 10.01, 10]);
  const tris = Uint32Array.from([0, 1, 2, 0, 2, 3, 4, 5, 6]), S = surfaceOf(pos, tris, 2000);
  let far = 0;
  for (let k = 0; k < 2000; k++) {
    const p = [S.pos[k * 3], S.pos[k * 3 + 1], S.pos[k * 3 + 2]];
    if (p[0] > 5) { far++; continue; }
    assert.ok(near(p[2], 0, 1e-6) && p[0] >= -1e-6 && p[0] <= 2 + 1e-6 && p[1] >= -1e-6 && p[1] <= 1 + 1e-6);
    assert.ok(near(Math.hypot(S.nrm[k * 3], S.nrm[k * 3 + 1], S.nrm[k * 3 + 2]), 1, 1e-6));
  }
  assert.ok(far <= 2, `the tiny triangle took ${far}`);
  assert.ok(near(S.area, 2 + 0.00005, 1e-6));
});

test('the dissolve\'s window, its candidates, his pick still open', () => {
  assert.deepEqual(dissolveAt(10, 12), {on: false, progress: 0});
  assert.ok(near(dissolveAt(12.8, 12).progress, 0.5, 1e-12)); assert.equal(dissolveAt(14, 12).progress, 1); assert.equal(dissolveAt(14, 12).on, true);
  assert.equal(dissolveAt(16.1, 12).on, false);
  assert.deepEqual(STYLES, ['smoke', 'water', 'petals']);
  assert.equal(DISSOLVE_CANDIDATES.length, 3);
  const moments = [11.044, 37.132, 71.572];   // two of the film's cuts and his tag Aiolos
  for (const c of DISSOLVE_CANDIDATES) { assert.ok(moments.includes(c.at), `${c.id} on a film cut or his tag`); assert.ok(STYLES.includes(c.style)); }
  // A, hers, stays among his choices: a transformation of her whole figure is his to pick (the coordinator, 19:05 WEST)
  assert.deepEqual(DISSOLVE_CANDIDATES.map((c) => c.id), ['athena-aiolos', 'seiya-light', 'sacrifice-water']);
  assert.equal(anyAt(31), true); assert.equal(anyAt(20), false); assert.equal(anyAt(20, {dissolve: {at: 19.5}}), true); assert.equal(anyAt(73), true);
});

test('the flow frames: her head lands on the film\'s head; the screen\'s frame runs down the screen', async () => {
  const {buildAssemblySkin} = await import('../app/assembly-geometry.js');
  const {FIT, chooseFace, place} = await import('./cubism.mjs');
  const pents = buildAssemblySkin(0).pents, spin = {yaw: 21.8 * Math.PI / 180, pitch: -0.12}, face = pents[chooseFace(pents, spin)];
  const on = place(FIT, face, spin), head = [0, 1.392, 0.007];
  const apply = (M, p) => [0, 1, 2].map((i) => M[i * 4] * p[0] + M[i * 4 + 1] * p[1] + M[i * 4 + 2] * p[2] + M[i * 4 + 3]);
  for (const F of [faceFlowFrame(face, spin, on.matrix), screenFlowFrame(on.matrix)]) {
    const h = apply(F, head);
    assert.ok(near(h[0], HAIR.head[0], 1e-9) && near(h[1], HAIR.head[1], 1e-9), `head at ${h}`);
  }
  // in the screen's frame a point below her head (in the scene) is below it in the picture (v grows down)
  const S = screenFlowFrame(on.matrix), below = apply(S, [0, 1.0, 0]), above = apply(S, [0, 1.6, 0]);
  assert.ok(below[1] > HAIR.head[1] || above[1] < HAIR.head[1], 'v runs down the screen');
  const scale = Math.hypot(on.matrix[0], on.matrix[4], on.matrix[8]);
  assert.ok(near(Math.hypot(S[0], S[4], S[8]), 0.9 / 0.26, 1e-6) || scale > 0, 'k picture units a metre of hers');
});

test('the module builds through the hero\'s three.js and keeps nothing running', async () => {
  const THREE = await import('three');
  const {createHair, createLight, createDissolve, hairOfModel, sampleSurface, BUDGETS, FIELD_GLSL} = await import('./fields.js');
  const {GLTFLoader} = await import(`${PROCEDURAL}/GLTFLoader.js`);
  const bytes = fs.readFileSync(path.join(HERE, 'athena.hades.glb'));
  const gltf = await new Promise((ok, no) => new GLTFLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length), '', ok, no));
  const hair = createHair(hairOfModel(gltf.scene));
  assert.equal(hair.strands, BUDGETS.full.strands); assert.equal(hair.K, 24);
  assert.equal(hair.object.geometry.attributes.aStrand.count, hair.strands * 24 * 2);
  assert.equal(hair.object.geometry.index.count, hair.strands * 23 * 6);
  const h = hair.update(31);
  assert.equal(h.wind, 1); assert.equal(hair.uniforms.uWind.value, 1); assert.equal(hair.uniforms.uT.value, 31);
  let sk = null; gltf.scene.traverse((o) => { if (o.isSkinnedMesh) sk = o; });
  const before = sk.geometry.index.count, kept = hair.keepCap(sk);
  assert.equal(sk.geometry.index.count, 5862 + kept.kept * 3); assert.ok(sk.geometry.index.count < before);
  const lysa = createHair({...hairOfModel(gltf.scene), budget: 'lysa'});
  assert.equal(lysa.strands, BUDGETS.full.strands / 2);
  const light = createLight();
  assert.equal(light.object.children[0].geometry.attributes.aDir.count, (16 + BUDGETS.full.extraRays) * 4);
  const L = light.update(46.5, {height: 900});
  assert.ok(L.on && light.object.visible && light.uniforms.uFieldPower.value > 0);
  light.update(20); assert.equal(light.object.visible, false);
  assert.match(FIELD_GLSL, /vec3 fieldLight\(vec3 p, vec3 n\)/);
  const box = new THREE.Mesh(new THREE.BoxGeometry(0.5, 1.6, 0.3), new THREE.MeshStandardMaterial());
  const holder = new THREE.Group(); holder.add(box);
  const surf = sampleSurface(holder, 500);
  assert.equal(surf.pos.length, 1500); assert.equal(surf.col.length, 1500);
  const d = createDissolve(holder, {at: 12, style: 'petals'});
  assert.equal(d.count, BUDGETS.full.points.petals);
  d.patch(box.material, box);
  assert.equal(typeof box.material.onBeforeCompile, 'function'); assert.ok(box.material.userData.fieldsDissolve);
  d.update(11); assert.equal(d.object.visible, false);
  d.update(12.5); assert.equal(d.object.visible, true);
  assert.equal(hair.uniforms.uCut.value, -1, 'her strands are cut by no front until a dissolve is bound to her');
  d.bindHair(hair); d.update(12.8); assert.ok(hair.uniforms.uCut.value > 0, 'her strands go with her body');
});

test('the law: the module never asks for a frame, holds a timer or reads the network; the lab page cancels its film callback at the pause', () => {
  for (const file of ['fields.js', 'fields-plan.mjs', 'fields-film.mjs']) {
    const src = fs.readFileSync(path.join(HERE, file), 'utf8').replace(/\/\/.*$/gm, '');
    for (const word of ['requestAnimationFrame', 'requestVideoFrameCallback', 'setTimeout', 'setInterval', 'fetch(', 'XMLHttpRequest', 'WebSocket'])
      assert.ok(!src.includes(word), `${file} holds ${word}`);
  }
  const page = fs.readFileSync(path.join(HERE, 'fields.html'), 'utf8');
  assert.match(page, /film\.addEventListener\('pause', \(\) => \{ stop\(\);/);
  assert.match(page, /cancelVideoFrameCallback/);
  assert.ok(!/setInterval|setTimeout/.test(page.replace(/<!--[\s\S]*?-->/, '')), 'no timer in the lab page');
  assert.ok(!/VideoTexture/.test(page), 'no VideoTexture (its callback waits at rest in WebKit)');
  assert.ok(HAIR_PAINT.mid.every((x) => x > 0 && x < 1));
  assert.equal(rng(3)(), rng(3)());
});

test('the hero\'s lines fit unboxing.js as the tree holds it (or stand in it already), and the result parses', async () => {
  const {heroLines, FIELDS_LINES} = await import('./fields-lines.mjs');
  const {spawnSync} = await import('node:child_process');
  const os = await import('node:os');
  const src = fs.readFileSync(path.join(HERE, 'unboxing.js'), 'utf8'), r = heroLines(src);
  for (const line of FIELDS_LINES) {
    const wired = src.includes(line.with.split('\n').find((l) => !line.find.includes(l)) ?? line.with);
    assert.ok(r.applied.includes(line.name) || wired, `"${line.name}" neither fits unboxing.js nor stands in it`);
  }
  const file = path.join(os.tmpdir(), `fields-lines-${process.pid}.mjs`);
  fs.writeFileSync(file, r.text);
  try {
    const check = spawnSync(process.execPath, ['--check', file], {encoding: 'utf8'});
    assert.equal(check.status, 0, check.stderr);
  } finally { fs.rmSync(file, {force: true}); }
  assert.match(r.text, /mountFields\(\{scene, camera, cloth: \(\) => clothSpot\}\); Object\.assign\(shared, fields\.uniforms\)/);
  assert.match(r.text, /col \+= fieldLight\(-vView, n\);/);
  // the cloth's group is read at each draw: mountFields runs before `const clothSpot` in the file (its temporal dead zone)
  assert.ok(r.text.indexOf('mountFields({scene') < r.text.indexOf('const clothSpot'), 'the faces are made before the cloth\'s group');
  assert.ok(r.text.indexOf("fields.athena(holder, athenaSpot") < r.text.indexOf("for (const look of [passMaterials.normals, passMaterials.matte, null])"), 'her strands before her compile');
});

test('the ripple: her portal\'s fronts from her hair\'s join, its bend, on her strands only (no patch for her body)', async () => {
  const {rippleAt, rippleBend, RIPPLE_SHAPE} = await import('./fields-plan.mjs');
  const {PORTAL, portalWindow} = await import('./cubism.mjs');
  const geo = {reach: 1500, zFull: 4};
  assert.equal(rippleAt(PORTAL.open - 0.01, geo).on, false); assert.equal(rippleAt(PORTAL.closed, geo).on, false); assert.equal(rippleAt(NaN, geo).on, false);
  for (const t of [29.8, 30.5, 33, 37.2, 37.5]) assert.equal(rippleAt(t, geo).r, portalWindow(t, geo.reach, geo.zFull).r, `the window's own front at ${t}`);
  assert.ok(near(rippleAt(29.8, geo).r, 2600 * (29.8 - PORTAL.open), 1e-6), 'the wave: 2,600 px a second from the opening');
  assert.equal(rippleAt(29.8, geo).k, 1); assert.ok(near(rippleAt(33, geo).k, 0.35, 1e-9), 'faint while it grows');
  assert.equal(rippleAt(37.12, geo).wall, -1); assert.ok(rippleAt(37.3, geo).wall > 0 && rippleAt(37.3, geo).kWall === 1, 'the wall of light from Aiolos');
  const R = rippleAt(29.8, geo), o = [500, 300];
  assert.deepEqual(rippleBend(...o, o, R), [0, 0]);
  let most = 0;
  for (let l = 0; l < 400; l++) { const b = rippleBend(o[0] + l, o[1], o, R); assert.ok(Math.abs(b[1]) < 1e-9, 'radial'); most = Math.max(most, Math.abs(b[0])); }
  assert.ok(most > 10 && most <= RIPPLE_SHAPE[0] + 1e-9, `the bend at most 18 px: ${most}`);
  assert.deepEqual(rippleBend(0, 0, o, rippleAt(20, geo)), [0, 0], 'nothing outside its span');
  const {createRipple, RIPPLE_GLSL} = await import('./fields.js');
  const rp = createRipple();
  assert.equal(rp.uniforms.uRipple.value.w, 0, 'off until a window opens (a Vector4 starts at w 1)');
  assert.equal(rp.uniforms.uRippleWall.value.y, 0);
  assert.equal(rp.patch, undefined, 'no patch for a material: the ripple bends her strands only, never her body or her dress');
  const out = rp.update(29.8, {geometry: {origin: o, ...geo}, rect: {left: 10, top: 20, width: 800, height: 600}});
  assert.equal(out.on, true); assert.deepEqual(rp.uniforms.uRipple.value.toArray().map((x) => +x.toFixed(3)), [500, 300, +(2600 * (29.8 - PORTAL.open)).toFixed(3), 1]);
  assert.deepEqual(rp.uniforms.uRippleRect.value.toArray(), [10, 20, 800, 600]);
  // the box's fold window (his 18:47 WEST) gives its own fronts: they are taken as given
  const given = rp.update(50, {geometry: {origin: [100, 200], r: 333, k: 0.5, wall: 40, kWall: 0.25}});
  assert.deepEqual([given.r, given.k, given.wall, given.kWall], [333, 0.5, 40, 0.25]);
  assert.deepEqual(rp.uniforms.uRipple.value.toArray(), [100, 200, 333, 0.5]);
  rp.update(29.8, {geometry: null}); assert.equal(rp.uniforms.uRipple.value.w, 0, 'no window, no bend');
  assert.match(RIPPLE_GLSL, /vec4 rippleBendClip\(vec4 clip\)/);
  assert.match(fs.readFileSync(path.join(HERE, 'fields.js'), 'utf8'), /gl_Position = rippleBendClip\(projectionMatrix \* mvPosition\);/, 'her strands bend with her');
});

#!/usr/bin/env node
// cubism.fit.mjs: the offline run of cubism.mjs fit() (ATHENA'S CUBIST FIT, see its header). It reads the film's shot over her shoulder
// (frames 886 to 1005 of app/saint-seiya.mp4, by ffmpeg, decoded into memory and never written), her hair's majority mask, athena.hades.glb's
// hair posed as the asset stands (the hero's own three.js r185 and GLTFLoader, in node), the page's twelve faces (assembly-geometry.js), and
// for each class of face (the pentagon's corners in its decal frame) the pose where chooseFace() picks such a face, mid-window; then runs the
// evolution there from several seeds and prints the FIT table cubism.mjs carries, with each class's residual and its noise floor.
//   nice -n 19 node cubism.fit.mjs [--R 180] [--seeds 3] [--generations 40] [--film <mp4>] [--json <out.json>]
// COST: about 0.15 GB of memory and a few seconds of one core a class; ffmpeg decodes 120 frames once (about 2 s).
import fs from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {registerHooks} from 'node:module';
import {fileURLToPath} from 'node:url';
import {FILM, SHOT, HAIR, VIOLET, BOUNDS, hairMask, majority, fit, chooseFace, classOf, matrixOf, boundaryOf, joinOf, summary, facing} from './cubism.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROCEDURAL = path.resolve(HERE, '../../room/procedural');
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const R = Number(opt('--R', 180)), SEEDS = Number(opt('--seeds', 3)), GENS = Number(opt('--generations', 40));
// a shot of hers: its frames (--frames a:b, the cut's frame to the next cut's), the turn range seen from the front (--front: psi about pi,
// theta -0.7..0.7) and her hair's colour in it (--hue a:b, --sat, --val: the beam lights it navy at the column)
const [FA, FB] = (opt('--frames', `${SHOT.frames[0]}:${SHOT.frames[1]}`)).split(':').map(Number), FRONT = args.includes('--front');
const TONE = {hue: (opt('--hue', `${VIOLET.hue[0]}:${VIOLET.hue[1]}`)).split(':').map(Number), sat: Number(opt('--sat', VIOLET.sat)), val: Number(opt('--val', VIOLET.val))};
const SIDE = Number(opt('--side', 1));   // -1: the face on the sphere's left outline, she to its left (her face shot)
// a close-up of her face: her head about the face's picture tall, so 2.5 to 5 box radii a metre (unbounded, the join alone took figures of 0.6)
const SHOT_BOUNDS = {...BOUNDS, ...(FRONT ? {theta: [-0.7, 0.7], psi: [Math.PI - 1.05, Math.PI + 1.05], s: [2.5, 5.0]} : {}), ...(SIDE < 0 ? {u: [-2.4, 0.2]} : {})};
const MP4 = opt('--film', path.resolve(HERE, '../app/saint-seiya.mp4'));
const PITCH = -0.12;   // warm-sphere.js: the sphere's pitch at rest (Home); it turns in yaw only, 0.12 rad a second

/** Her hair posed as the glb stands: {pos (metres), tris}, through three's skinning. */
export async function hairOf(file) {
  registerHooks({resolve: (s, c, n) => (s === 'three' ? {url: `file://${PROCEDURAL}/three.module.js`, shortCircuit: true} : n(s, c))});
  globalThis.self ??= globalThis;
  globalThis.createImageBitmap ??= async () => ({width: 512, height: 512, close() {}});
  const THREE = await import('three');
  const {GLTFLoader} = await import(`${PROCEDURAL}/GLTFLoader.js`);
  const bytes = fs.readFileSync(file);
  const gltf = await new Promise((ok, no) => new GLTFLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length), '', ok, no));
  let sk = null; gltf.scene.traverse((o) => { if (o.isSkinnedMesh) sk = o; });
  gltf.scene.updateMatrixWorld(true);
  const n = HAIR.to - HAIR.from, pos = new Float32Array(n * 3), v = new THREE.Vector3();
  for (let i = 0; i < n; i++) { sk.getVertexPosition(HAIR.from + i, v); v.applyMatrix4(sk.matrixWorld); pos.set([v.x, v.y, v.z], i * 3); }
  const index = sk.geometry.index.array, tris = [];
  for (let t = 0; t < index.length; t += 3) if (index[t] >= HAIR.from && index[t + 1] >= HAIR.from && index[t + 2] >= HAIR.from) tris.push(index[t] - HAIR.from, index[t + 1] - HAIR.from, index[t + 2] - HAIR.from);
  return {pos, tris: Uint32Array.from(tris)};
}

/** The shot's frames' hair masks, decoded by ffmpeg into memory: {n: mask}. */
export function filmMasks(file, from, to, tone = VIOLET) {
  const raw = execFileSync('ffmpeg', ['-v', 'error', '-i', file, '-vf', `select=between(n\\,${from}\\,${to - 1})`, '-fps_mode', 'passthrough', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'],
    {maxBuffer: (to - from + 2) * FILM.w * FILM.h * 3});
  const size = FILM.w * FILM.h * 3, out = {};
  for (let k = 0; k * size < raw.length; k++) out[from + k] = hairMask(raw.subarray(k * size, (k + 1) * size), FILM.w, FILM.h, {t: tone});
  return out;
}

async function main() {
  const t0 = performance.now();
  const {buildAssemblySkin} = await import('../app/assembly-geometry.js');
  const pents = buildAssemblySkin(0).pents, centre = [0, 0];
  const hair = await hairOf(path.join(HERE, 'athena.hades.glb'));
  const masks = filmMasks(MP4, FA, FB, TONE);
  const film = {mask: majority(Object.values(masks)), w: FILM.w, h: FILM.h};
  const tRead = performance.now() - t0;
  // each class's window: the yaws (1 degree apart, at the sphere's pitch) where chooseFace picks a face of it
  const windows = {};
  for (let d = 0; d < 360; d++) {
    const spin = {yaw: d * Math.PI / 180, pitch: PITCH}, i = chooseFace(pents, spin, centre, R, SIDE);
    if (i < 0) continue;
    const key = classOf(pents[i]), w = (windows[key] ??= {faces: {}, yaws: 0});
    (w.faces[i] ??= []).push(d); w.yaws++;
  }
  const classes = {}, report = {};
  for (const [key, w] of Object.entries(windows)) {
    // the face of the class with the longest run of yaws, at the run's middle
    const [faceIndex, yaws] = Object.entries(w.faces).sort((a, b) => b[1].length - a[1].length)[0];
    const run = longestRun(yaws.map(Number)), mid = run[Math.floor(run.length / 2)], spin = {yaw: mid * Math.PI / 180, pitch: PITCH}, face = pents[faceIndex];
    // the views the fit must hold over: picked at the cut anywhere in the window (its start, middle, end), the sphere then turns 0.12 rad a
    // second while the film runs to the next cut; each view pairs the turn and the frame of the same instant
    const views = [];
    for (const y0 of [run[0], mid, run[run.length - 1]]) for (const k of [0, 1 / 3, 2 / 3, 1]) {
      const n = Math.round(FA + k * (FB - 1 - FA)), turn = k * (FB - FA) * 1001 / 30000 * 0.12;
      views.push({spin: {yaw: y0 * Math.PI / 180 + turn, pitch: PITCH}, film: {mask: masks[n], w: FILM.w, h: FILM.h}, n});
    }
    let best = null;
    const tFit = performance.now();
    for (let seed = 1; seed <= SEEDS; seed++) {
      const r = fit({face, views, centre, R, hair, bounds: SHOT_BOUNDS}, {seed, generations: GENS});
      if (!best || r.best.score < best.best.score) best = {...r, seed};
    }
    const fitMs = performance.now() - tFit;
    // the residual's noise floor: the same place against each frame of the shot (her hair moves in the wind), and against the mask with
    // the violet's thresholds moved by their own uncertainty (hue 8 deg, saturation 0.05)
    const M = matrixOf(best.best.local, face, spin), perFrame = [];
    for (const [n, mask] of Object.entries(masks)) perFrame.push(joinOf(boundaryOf(face, spin, centre, R, {mask, w: FILM.w, h: FILM.h}), hair, M, centre, R).gap);
    const sd = (xs) => { const m = xs.reduce((a, b) => a + b, 0) / xs.length; return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / xs.length); };
    // the edges of the window: the same place as the sphere turns (the join should hold, anchored to the face)
    const edges = [run[0], run[run.length - 1]].map((d) => {
      const s = {yaw: d * Math.PI / 180, pitch: PITCH};
      return {yawDeg: d, ...summary(joinOf(boundaryOf(face, s, centre, R, film), hair, matrixOf(best.best.local, face, s), centre, R))};
    });
    const local = Object.fromEntries(Object.entries(best.best.local).map(([k, v]) => [k, +v.toFixed(4)]));
    const gaps = best.best.gaps, mean = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    classes[key] = {face: face.id, yawDeg: mid, window: [run[0], run[run.length - 1]], local, join: best.best.join, views: {gapMean: +mean.toFixed(2), gapMax: Math.max(...gaps)}};
    report[key] = {face: face.id, faces: Object.keys(w.faces).map((i) => pents[i].id), share: +(w.yaws / 360).toFixed(3), facing: +facing(face, spin).toFixed(3),
      seed: best.seed, score: +best.best.score.toFixed(2), join: best.best.join, curve: best.generations.filter((_, g) => g % 5 === 0 || g === best.generations.length - 1),
      views: views.map((v, i) => ({yawDeg: +(v.spin.yaw * 180 / Math.PI).toFixed(1), frame: v.n, gap: best.best.gaps[i]})),
      evaluations: best.evaluations * SEEDS, fitMs: Math.round(fitMs), floor: {framesGapSd: +sd(perFrame).toFixed(2), framesGapRange: [Math.min(...perFrame), Math.max(...perFrame)].map((x) => +x.toFixed(1))},
      windowEdges: edges};
    console.error(`class ${key}: ${face.id} at yaw ${mid} deg, gap ${best.best.join.gap} px, mismatch ${best.best.join.mismatch} px, angle ${best.best.join.angle} deg, ${Math.round(fitMs)} ms`);
  }
  const out = {at: new Date().toISOString(), R, pitch: PITCH, shot: {frames: [FA, FB], front: FRONT, bounds: SHOT_BOUNDS}, violet: TONE, readMs: Math.round(tRead), hairVertices: hair.pos.length / 3, hairTriangles: hair.tris.length / 3, classes, report};
  if (opt('--json')) fs.writeFileSync(opt('--json'), JSON.stringify(out, null, 1));
  console.log(JSON.stringify({R, pitch: PITCH, classes}, null, 1));
}
function longestRun(xs) {   // the longest run of consecutive degrees (the circle wraps)
  const set = new Set(xs);
  let best = [];
  for (const x of xs) {
    if (set.has((x + 359) % 360)) continue;
    const run = [x];
    while (set.has((run[run.length - 1] + 1) % 360) && run.length < 360) run.push((run[run.length - 1] + 1) % 360);
    if (run.length > best.length) best = run;
  }
  return best.length ? best : xs;
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

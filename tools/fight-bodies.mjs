#!/usr/bin/env node
// fight-bodies.mjs: SEIYA'S BODY IN THE FIGHT, READ FROM THE GLB THROUGH THE HERO'S OWN three.js (lane fight-lyssa-seiya, Oct 18 2026). The brief's
// law: "three ... skins Seiya and gives his box from his bones". For each clip the fight plays and each of its whole frames, three r185
// (room/procedural/three.module.js, its GLTFLoader) poses lab/seiya.hades.glb in node, off every screen, and skins the mesh with its bones
// (SkinnedMesh.computeBoundingBox): the box of his body, and where his hands, head, chest and waist are, all in his placement's frame (metres,
// glTF axes: y up, he faces +z; the clips play in place, their travel is the placement's: lab/FIGHTERS.md). The fight's law reads these numbers;
// a page reads the same file, so every glass decides the same hits.
//   node fight-bodies.mjs [--out <file>] [--check]
// WHAT IT WRITES: lab/seiya-bodies.hades.json (numbers about the game's own model: stripped before GitHub by the *.hades.json line).
// COST: 12 clips, about 370 poses, 8,192 vertices skinned each: about a second on one core. Run it on the new Mac.
import fs from 'node:fs';
import path from 'node:path';
import {registerHooks} from 'node:module';

const HERE = path.dirname(new URL(import.meta.url).pathname), LAB = path.resolve(HERE, '../lab'), PROCEDURAL = path.resolve(HERE, '../../room/procedural');
registerHooks({resolve: (specifier, context, next) => (specifier === 'three' ? {url: `file://${PROCEDURAL}/three.module.js`, shortCircuit: true} : next(specifier, context))});
globalThis.self ??= globalThis;
globalThis.createImageBitmap ??= async () => ({width: 512, height: 512, close() {}});
const THREE = await import('three');
const {GLTFLoader} = await import(`${PROCEDURAL}/GLTFLoader.js`);

export const CLIPS = Object.freeze([0, 1, 2, 3, 4, 33, 50, 52, 53, 57, 59, 64]);   // the clips the fight plays (lab/fight-lyssa-seiya.mjs SEIYA.clips)
export const MARKS = Object.freeze({lhand: 'h_jnt_lhand', rhand: 'h_jnt_rhand', head: 'h_jnt_head', chest: 'h_jnt_ubody', waist: 'h_jnt_waist'});
const r4 = (v) => Math.round(v * 1e4) / 1e4;

export async function bodies(bytes) {
  const gltf = await new Promise((ok, no) => new GLTFLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length), '', ok, no));
  let skinned = null;
  gltf.scene.traverse((o) => { if (o.isSkinnedMesh) skinned = o; });
  const X = gltf.parser.json.extras, mixer = new THREE.AnimationMixer(gltf.scene), bones = {};
  for (const [k, name] of Object.entries(MARKS)) bones[k] = skinned.skeleton.bones.find((b) => b.name === name);
  const out = {}, v = new THREE.Vector3();
  for (const k of CLIPS) {
    const clip = THREE.AnimationClip.findByName(gltf.animations, X.clips[k]);
    mixer.stopAllAction();
    const action = mixer.clipAction(clip); action.play();
    const len = X.frames[k], rows = {box: [], ...Object.fromEntries(Object.keys(MARKS).map((m) => [m, []]))};
    for (let f = 0; f <= len; f++) {
      action.time = Math.min(f / X.rate, clip.duration); mixer.update(0); gltf.scene.updateMatrixWorld(true);
      skinned.computeBoundingBox();
      const b = skinned.boundingBox.clone().applyMatrix4(skinned.matrixWorld);
      rows.box.push([b.min.x, b.min.y, b.min.z, b.max.x, b.max.y, b.max.z].map(r4));
      for (const m of Object.keys(MARKS)) { bones[m].getWorldPosition(v); rows[m].push([r4(v.x), r4(v.y), r4(v.z)]); }
    }
    out[k] = {name: X.clips[k], len, loops: X.loops[k], travel_m: X.travel[k], ...rows};
    action.stop();
  }
  return {v: 'seiya-bodies/1', made: {by: 'embertide-app/ui/intro/dyson-society/tools/fight-bodies.mjs', three: THREE.REVISION, rate: X.rate, height: X.height},
    marks: MARKS, clips: out};
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const i = process.argv.indexOf('--out'), file = i < 0 ? path.join(LAB, 'seiya-bodies.hades.json') : path.resolve(process.argv[i + 1]);
  const t0 = performance.now(), doc = await bodies(fs.readFileSync(path.join(LAB, 'seiya.hades.glb'))), ms = Math.round(performance.now() - t0);
  if (process.argv.includes('--check')) {
    const same = JSON.stringify(doc) === JSON.stringify(JSON.parse(fs.readFileSync(file, 'utf8')));
    console.log(same ? `EQUAL: ${file} is what the glb says (${ms} ms)` : `DIFFER: ${file}`); process.exit(same ? 0 : 1);
  }
  fs.writeFileSync(file, JSON.stringify(doc) + '\n');
  console.log(`wrote ${file}: ${Object.keys(doc.clips).length} clips, ${Object.values(doc.clips).reduce((n, c) => n + c.box.length, 0)} poses, ${ms} ms`);
}

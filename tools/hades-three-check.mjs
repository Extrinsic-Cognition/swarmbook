#!/usr/bin/env node
// hades-three-check.mjs: A FIGHTER'S .glb THROUGH THE HERO'S OWN three.js (r185, room/procedural/three.module.js and its GLTFLoader.js), in
// node, off every screen. It parses each file as a page would, plays clip 00 and half of clip 01 in three's AnimationMixer, and reads the box
// three's Box3.setFromObject gives (a SkinnedMesh's box is skinned with its bones). No picture is decoded: createImageBitmap is a stand-in,
// so the texture's pixels are not what this checks (hades-picture.mjs draws them).
//   node hades-three-check.mjs <x.glb> [<y.glb> ...]
import fs from 'node:fs';
import path from 'node:path';
import {registerHooks} from 'node:module';

const PROCEDURAL = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../../room/procedural');
registerHooks({resolve: (specifier, context, next) => (specifier === 'three' ? {url: `file://${PROCEDURAL}/three.module.js`, shortCircuit: true} : next(specifier, context))});
globalThis.self ??= globalThis;
globalThis.createImageBitmap = async () => ({width: 512, height: 512, close() {}});
const THREE = await import('three');
const {GLTFLoader} = await import(`${PROCEDURAL}/GLTFLoader.js`);

export async function look(bytes) {
  const t0 = performance.now();
  const gltf = await new Promise((ok, no) => new GLTFLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length), '', ok, no));
  const ms = performance.now() - t0;
  let skinned = null;
  gltf.scene.traverse((o) => { if (o.isSkinnedMesh) skinned = o; });
  const span = () => { skinned.boundingBox = null; const b = new THREE.Box3().setFromObject(gltf.scene); return [b.min.y, b.max.y].map((x) => +x.toFixed(3)); };
  const loaded = span();
  const [idle, run] = ['00.0', '01.10'].map((n) => THREE.AnimationClip.findByName(gltf.animations, n));
  const mixer = new THREE.AnimationMixer(gltf.scene);
  mixer.clipAction(idle).play(); mixer.update(0); gltf.scene.updateMatrixWorld(true);
  const atIdle = span();
  mixer.stopAllAction(); mixer.clipAction(run).play(); mixer.update(run.duration / 2); gltf.scene.updateMatrixWorld(true);
  return {ms: Math.round(ms), clips: gltf.animations.length, bones: skinned.skeleton.bones.length, map: !!skinned.material.map, tracks00: idle.tracks.length,
    seconds00: +idle.duration.toFixed(3), seconds01: +run.duration.toFixed(3), extras: gltf.parser.json.extras.height, loadedY: loaded, idleY: atIdle, runHalfY: span()};
}

if (import.meta.url === `file://${process.argv[1]}`) {
  if (process.argv.length < 3) { console.error('node hades-three-check.mjs <x.glb> [...]'); process.exit(2); }
  for (const file of process.argv.slice(2)) console.log(JSON.stringify({file: path.basename(file), ...(await look(fs.readFileSync(file)))}));
}

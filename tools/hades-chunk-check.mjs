#!/usr/bin/env node
// hades-chunk-check.mjs: A FIGHTER'S .glb CLIPS AGAINST THE OCT 5 DECODE OF THE SAME DISC (~/code/disc-chunks-2026-10-04/chunks/NN.chunk.json,
// thin-engine-chunk/1: two decoders agreeing on 2,156,657 keys, RECEIPT.md). Every key of every clip: the key time (glb seconds x 30 = the
// chunk's frame), the rotation (float32 equal, up to the sign hades-glb.mjs makes continuous), the position (float32 equal; the waist's x and z
// are 0 in the glb by the engine's in-place rule, its y equal), and the face clip on the engine's six face joints (rotation, position,
// scale; no track on any other joint). Reads two files, writes nothing.
//   node hades-chunk-check.mjs <x.glb> <NN.chunk.json>
import fs from 'node:fs';
import {parseGlb, read} from './hades-picture.mjs';

export function check(g, chunk, rate = 30) {
  const f = chunk.figures[0], names = g.json.nodes.map((n) => n.name), clips = g.json.extras.clips;
  let keys = 0, faceKeys = 0, flips = 0, maxQ = 0, maxP = 0, maxT = 0;
  const diffs = [];
  // one track of the glb against the chunk's: key times, then float32 values (a rotation up to its sign; the waist's x and z are 0 in place)
  const compare = (label, jointName, path, track, sampler, onKey) => {
    if (!track || !sampler) { if (!!track !== !!sampler) diffs.push(`${label} ${jointName} ${path}: ${track ? 'missing in the glb' : 'not in the chunk'}`); return; }
    const t = read(g, sampler.input), v = read(g, sampler.output), want = track.q || track.v, width = path === 'rotation' ? 4 : 3;
    if (t.length !== track.t.length) { diffs.push(`${label} ${jointName} ${path}: ${t.length} keys, the chunk ${track.t.length}`); return; }
    track.t.forEach((frame, e) => {
      onKey();
      maxT = Math.max(maxT, Math.abs(t[e] * rate - frame));
      const w = want[e].map(Math.fround), got = v.slice(width * e, width * e + width);
      if (path === 'rotation') {
        const same = got.every((x, c) => x === w[c]), neg = got.every((x, c) => x === -w[c]);
        if (neg && !same) flips++;
        maxQ = Math.max(maxQ, ...got.map((x, c) => Math.abs(Math.abs(x) - Math.abs(w[c]))));
        if (!same && !neg) diffs.push(`${label} ${jointName} key ${e}: ${got} vs ${w}`);
      } else {
        const exp = path === 'translation' && jointName === 'h_jnt_waist' ? [0, w[1], 0] : w;
        maxP = Math.max(maxP, ...got.map((x, c) => Math.abs(x - exp[c])));
        if (!got.every((x, c) => x === exp[c])) diffs.push(`${label} ${jointName} ${path} key ${e}: ${got} vs ${exp}`);
      }
    });
  };
  const tracksOf = (anim) => new Map(anim.channels.map((ch) => [`${ch.target.node} ${ch.target.path}`, anim.samplers[ch.sampler]]));
  clips.forEach((name) => {
    const k = Number(name.split('.')[0]), a = f.anims[String(k)], anim = g.json.animations.find((x) => x.name === name);
    if (Number(name.split('.')[1]) !== a.code) diffs.push(`${name}: the chunk's code is ${a.code}`);
    const got = tracksOf(anim);
    f.joints.forEach((j, n) => {
      if (names[n] !== j.name) diffs.push(`joint ${n}: ${names[n]} in the glb, ${j.name} in the chunk`);
      compare(name, j.name, 'rotation', a.rot[n], got.get(`${n} rotation`), () => keys++);
      compare(name, j.name, 'translation', a.pos[n], got.get(`${n} translation`), () => keys++);
    });
  });
  // the face clip: on the engine's six face joints alone (the chunk's face block, MNN.MPL), rotation, position and scale
  const face = g.json.animations.find((x) => x.name === 'face'), cf = f.face;
  if (face && cf) {
    const six = new Set(cf.joints.filter((j) => j >= 0)), got = tracksOf(face);
    for (const ch of face.channels) if (!six.has(ch.target.node)) diffs.push(`face: a track on ${names[ch.target.node]}, not one of the six`);
    cf.joints.forEach((n, i) => {
      if (n < 0) return;
      for (const [path, track] of [['rotation', cf.rot[i]], ['translation', cf.pos[i]], ['scale', cf.scl[i]]]) compare('face', cf.names[i], path, track, got.get(`${n} ${path}`), () => faceKeys++);
    });
  } else if (face || cf) diffs.push(`face: ${face ? 'the chunk has none' : 'the glb has none'}`);
  return {clips: clips.length, keys, faceKeys, flips, maxQ, maxP, maxT, differ: diffs.length, first: diffs.slice(0, 5)};
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const [file, chunkFile] = process.argv.slice(2);
  if (!file || !chunkFile) { console.error('node hades-chunk-check.mjs <x.glb> <NN.chunk.json>'); process.exit(2); }
  const t0 = performance.now(), r = check(parseGlb(fs.readFileSync(file)), JSON.parse(fs.readFileSync(chunkFile, 'utf8')));
  console.log(JSON.stringify({file, ...r, ms: Math.round(performance.now() - t0)}));
  process.exit(r.differ ? 1 : 0);
}

#!/usr/bin/env node
// fight-measure.mjs: SEIYA'S FIGHTING LAW, MEASURED FROM HIS OWN FIGHT (lane fight-lyssa-seiya, Oct 18 2026). His words, WEST, in the warden's chat:
// 06:2x "bronze is the standard saint seya stuff"; 06:3x "do you think you got enough material to simulate a fight between the lyssajudron and
// saint-seya bronze?"; then "brother... be resourceful?".
//
// WHAT IT READS, read only and in place (his fossils: nothing is written there, nothing of the disc is copied anywhere):
//   ~/code/thin-engine-2026-10-04/lanes/chunk/out/rec-run1.json and rec-rig1.json: the per-frame export of the engine's own state in two recorded
//     sessions (thin-engine lane, Oct 4 2026), both begun from HIS savestate of the fight he paused at 07:36:55 WEST on Oct 4 (PEGASUS Seiya against
//     CANCER Deathmask, his health 50.06 and Cancer's 67.68 as he left them), then continued under the rig lane's button scripts with Cancer played by
//     the game: run1 under the-rig-2026-10-04/script-1.json (898 frames), rig1 under trace/rig1/script.jsonl (1,177 frames). Per frame and fighter:
//     i the clip index, m the motion code, c the play counter, pl the placement [x, y, z, yaw], h the health, dt, sp, b the blend [length, time].
//   rec-<run>-p1.world.f32: the WORLD 4 x 4 of each of Seiya's 60 nodes at every frame (float32, row vectors, translation in row 3, y down).
//   ~/code/the-rig-2026-10-04/trace/<run>/script.jsonl and the first record of trace/run1/A.rtrc (its last load) and trace/rig1/A.rtrc.rig: the presses
//     and the emulator frame each run's rel 0 was.
//   ~/code/disc-chunks-2026-10-04/chunks/00.chunk.json: Seiya's keys as the disc holds them (the Oct 5 decode; equal to seiya.hades.glb's keys on all
//     43,868, lab/FIGHTERS.md), read for the waist's x and z keys alone: the root motion the glb moved into extras.travel.
//   lab/seiya.hades.glb: its extras (clip names, frames, travel, loops), to check the root motion against.
// WHAT IT WRITES: lab/seiya-fight.hades.json (numbers about the game's own motion: stripped before GitHub by the *.hades.json line).
//   node fight-measure.mjs [--out <file>] [--check]       --check: measure again and compare with the file; exit 1 when anything differs
// COST: about 12 MB read, one core, well under a second; nothing at rest.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

const HERE = path.dirname(new URL(import.meta.url).pathname), LAB = path.resolve(HERE, '../lab');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i < 0 ? d : process.argv[i + 1]; };
const home = (p) => p.replace(/^~/, os.homedir());
export const SRC = Object.freeze({
  rec: home(arg('--rec', '~/code/thin-engine-2026-10-04/lanes/chunk/out')),
  rig: home(arg('--rig', '~/code/the-rig-2026-10-04')),
  chunk: home(arg('--chunk', '~/code/disc-chunks-2026-10-04/chunks/00.chunk.json')),
  glb: path.join(LAB, 'seiya.hades.glb'),
});
export const M_PER_U = 0.09584;   // lab/FIGHTERS.md: Seiya's rest pose is 1.65 m from feet to hair, 0.09584 m a game unit (arithmetic, from the glb)
const r4 = (v) => Math.round(v * 1e4) / 1e4, r3 = (v) => Math.round(v * 1e3) / 1e3, r2 = (v) => Math.round(v * 100) / 100;
const sha = (b) => crypto.createHash('sha256').update(b).digest('hex');
const RUNS = ['run1', 'rig1'];
const SEIYA = 0, CANCER = 1;

function glbExtras(file) {
  const b = fs.readFileSync(file), n = b.readUInt32LE(12);
  return JSON.parse(b.toString('utf8', 20, 20 + n)).extras;
}
/** the emulator frame of rel 0 in a trace (its last load), from the 24-byte record heads alone (rtrc.py's format) */
function frame0(file) {
  const fd = fs.openSync(file, 'r'), size = fs.fstatSync(fd).size, h = Buffer.alloc(24);
  let pos = 0, last = null;
  while (pos + 24 <= size) {
    fs.readSync(fd, h, 0, 24, pos);
    if (h.readUInt32LE(0) !== 0x43525452) throw new Error(`bad record at ${pos} in ${file}`);
    const frame = h.readUInt32LE(4), rel = h.readUInt32LE(8), loads = h.readUInt32LE(12), n = h.readUInt32LE(20);
    if (!last || loads !== last.loads) last = { loads, frame0: frame - rel };
    pos += 24 + n;
  }
  fs.closeSync(fd);
  return last;
}
const dist = (a, b) => Math.hypot(a.pl[0] - b.pl[0], a.pl[2] - b.pl[2]);

/** the plays of one fighter: a play is a run of frames with the same clip; a non-looping clip whose counter falls back to 0 starts again */
function playsOf(F) {
  const out = [];
  for (let k = 0; k < F.length; k++) {
    const r = F[k], p = out[out.length - 1];
    const again = p && p.i === r.i && !r.loops && r.c === 0 && F[k - 1].c > 0;
    if (!p || p.i !== r.i || again) out.push({ i: r.i, code: r.m, from: k, to: k, len: r.len, loops: r.loops });
    else p.to = k;
  }
  return out;
}

export function measure() {
  const inputs = [], read = (file) => { const b = fs.readFileSync(file); inputs.push({ path: file.replace(os.homedir(), '~'), bytes: b.length, sha256: sha(b) }); return b; };
  const X = glbExtras(SRC.glb);
  inputs.push({ path: 'embertide-app/ui/intro/dyson-society/lab/seiya.hades.glb', bytes: fs.statSync(SRC.glb).size, sha256: sha(fs.readFileSync(SRC.glb)) });
  const runs = {}, plays = [], hits = [], buttons = [], fists = [];
  let contact = Infinity, farthest = 0;
  const ticks = { frames: new Map(), counter: new Map() };
  const blends = new Map();
  for (const run of RUNS) {
    const doc = JSON.parse(read(path.join(SRC.rec, `rec-${run}.json`)));
    const [S, C] = doc.figures, fs_ = S.frames, fc = C.frames, n = fs_.length;
    if (S.name !== 'PEGASUS' || C.name !== 'CANCER') throw new Error(`${run}: the figures are ${S.name} and ${C.name}`);
    const world = new Float32Array(read(path.join(SRC.rec, S.world)).buffer.slice(0));   // frames x J x 16
    const J = S.J, node = (k, name) => { const j = S.names.indexOf(name), o = (k * J + j) * 16; return [world[o + 12], world[o + 13], world[o + 14]]; };
    // the tick: the engine moves every second frame; the counter's step at speed 1 and at the walks' 1.2 (semaphore-root.json: + dt * speed / 2)
    let last = -1;
    for (let k = 1; k < n; k++) {
      const a = fs_[k - 1], b = fs_[k];
      if (b.c !== a.c && b.i === a.i && b.c > a.c && b.dt === a.dt && Math.abs(b.dt - 2.4) < 1e-3) {
        const key = String(r2(b.sp)); ticks.counter.set(key + ':' + r4(b.c - a.c), (ticks.counter.get(key + ':' + r4(b.c - a.c)) || 0) + 1);
        if (last >= 0) ticks.frames.set(k - last, (ticks.frames.get(k - last) || 0) + 1);
        last = k;
      }
    }
    // the bodies' push-apart: the least distance while neither fighter is in a throw (Seiya's 36.1100 and Cancer's 69.5010 hold the bodies together)
    const THROWS = new Set([1100, 5010]);
    for (let k = 0; k < n; k++) { const d = dist(fs_[k], fc[k]); if (!THROWS.has(fs_[k].m) && !THROWS.has(fc[k].m)) { contact = Math.min(contact, d); farthest = Math.max(farthest, d); } }
    // the place of rel 0 among the emulator's frames, and the presses as the run's own rel
    const traceFile = run === 'run1' ? path.join(SRC.rig, 'trace/run1/A.rtrc') : path.join(SRC.rig, 'trace/rig1/A.rtrc.rig');
    const f0 = frame0(traceFile);
    const script = read(path.join(SRC.rig, `trace/${run}/script.jsonl`)).toString('utf8').trim().split('\n').map((l) => JSON.parse(l));
    const SP = playsOf(fs_), CP = playsOf(fc);
    runs[run] = { frames: n, frame0: f0.frame0, loads: f0.loads, start: { seiya: { clip: fs_[0].i, code: fs_[0].m, hp: r2(fs_[0].h) }, cancer: { clip: fc[0].i, code: fc[0].m, hp: r2(fc[0].h) }, dist_u: r2(dist(fs_[0], fc[0])) } };
    for (const s of script) {
      if (!s.press?.length) continue;
      const rel = s.at_frame - f0.frame0, before = fs_[Math.max(0, rel)]?.i;
      let to = null;
      for (let k = Math.max(0, rel); k < Math.min(n, rel + 41); k++) if (fs_[k].i !== before) { to = { rel: k, clip: fs_[k].i, code: fs_[k].m, after: k - rel }; break; }
      buttons.push({ run, press: s.press.join('+'), rel, held: s.frames, clip_before: before, first_change: to });
    }
    SP.forEach((p, q) => {
      const a = fs_[p.from], prev = SP[q - 1], next = SP[q + 1];
      const b0 = a.b[0];
      if (q > 0) { const key = `${p.i}.${p.code}`; const v = blends.get(key) || new Set(); v.add(b0); blends.set(key, v); }
      plays.push({ run, rel: p.from, frames: p.to - p.from + 1, clip: p.i, code: p.code, len: p.len, loops: p.loops,
        counter_end: r4(fs_[p.to].c), sp: r2(a.sp), dist0_u: r2(dist(a, fc[p.from])), dist1_u: r2(dist(fs_[p.to], fc[p.to])),
        travel_u: r2(Math.hypot(fs_[p.to].pl[0] - a.pl[0], fs_[p.to].pl[2] - a.pl[2])), yaw0: r4(a.pl[3]),
        prev: prev ? { clip: prev.i, code: prev.code, frames: prev.to - prev.from + 1 } : null, next: next ? { clip: next.i, code: next.code } : null,
        blend_in: b0, cancer: { clip: fc[p.from].i, code: fc[p.from].m } });
    });
    // the hits: a health drop; the attacker's clip and counter at that frame; the distance then and one frame before; the victim's reaction
    for (const [victim, V, A, VP] of [['CANCER', fc, fs_, CP], ['PEGASUS', fs_, fc, SP]]) {
      for (let k = 1; k < n; k++) {
        if (!(V[k].h < V[k - 1].h - 1e-6)) continue;
        const react = VP.find((p) => p.from === k) || VP.find((p) => p.from <= k && p.to >= k);
        const rEnd = react ? react.to : k;
        hits.push({ run, rel: k, victim, damage: r2(V[k - 1].h - V[k].h), hp: [r2(V[k - 1].h), r2(V[k].h)],
          attacker: { clip: A[k].i, code: A[k].m, counter: r4(A[k].c), len: A[k].len }, dist_u: r2(dist(fs_[k], fc[k])), dist_before_u: r2(dist(fs_[k - 1], fc[k - 1])),
          reaction: { clip: V[k].i, code: V[k].m, frames: rEnd - k + 1, travel_u: r2(Math.hypot(V[rEnd].pl[0] - V[k].pl[0], V[rEnd].pl[2] - V[k].pl[2])) },
          jump_u: r2(Math.hypot(V[k].pl[0] - V[k - 1].pl[0], V[k].pl[2] - V[k - 1].pl[2])), dt: [r2(A[k].dt), r2(V[k].dt)],
          victim_before: { clip: V[k - 1].i, code: V[k - 1].m } });   // what the victim was playing the frame before: a jump while it stepped is partly its own step
        // Seiya's fist when HE landed it: his hands relative to his placement (forward along his facing, side, up), metres
        if (victim === 'CANCER' && [3040, 4000].includes(A[k].m)) {
          const pl = A[k].pl, fx = Math.sin(pl[3]), fz = Math.cos(pl[3]);
          const rel3 = (p) => { const dx = p[0] - pl[0], dz = p[2] - pl[2]; return [r3((dx * fx + dz * fz) * M_PER_U), r3((dx * fz - dz * fx) * M_PER_U), r3(-p[1] * M_PER_U)]; };
          fists.push({ run, rel: k, clip: A[k].i, code: A[k].m, counter: r4(A[k].c), rhand_m: rel3(node(k, 'h_jnt_rhand')), lhand_m: rel3(node(k, 'h_jnt_lhand')), head_m: rel3(node(k, 'h_jnt_head')) });
        }
      }
    }
  }
  // THE ROOT MOTION from the disc's keys: the waist's x and z (engine axes: y down, z backward) as glTF metres relative to the clip's first key
  const chunk = JSON.parse(read(SRC.chunk)), fig = chunk.figures[0], waist = fig.root_motion_joint;
  if (fig.joints[waist].name !== 'h_jnt_waist') throw new Error(`the root motion joint is ${fig.joints[waist].name}`);
  const used = [...new Set(plays.map((p) => p.clip).concat([0, 1, 2, 3, 4, 28, 29, 33, 50, 52, 53, 57, 59, 64]))].sort((a, b) => a - b);
  const root = {};
  for (const k of used) {
    const a = fig.anims[String(k)], tr = a.pos[waist];
    const t = tr.t, v = tr.v, x0 = v[0][0], z0 = v[0][2];
    const xz = v.map((p) => [r4(-(p[0] - x0) * M_PER_U), r4((p[2] - z0) * M_PER_U)]);   // glTF x = -engine x, z = engine z (y up = -y): checked against extras.travel
    root[k] = { name: X.clips[k], code: a.code, len: a.length, loops: X.loops[k], frames: X.frames[k], t, xz_m: xz, glb_travel_m: X.travel[k] };
  }
  // THE PLAYS HE CHOSE FROM: the plays that began from his stance (the idle) or from a step, not the reactions the game put on him
  // a choice: a step (10 to 40) or a strike (3000 to 4999) that began from his stance; the idle before it and how long it lasted, as recorded
  const chose = plays.filter((p) => p.prev && (p.code >= 10 && p.code <= 40 || p.code >= 3000 && p.code < 5000))
    .map((p) => ({ run: p.run, rel: p.rel, clip: p.clip, code: p.code, dist0_u: p.dist0_u, frames: p.frames, travel_u: p.travel_u,
      after: p.prev.code, idle_frames: p.prev.code === 0 ? p.prev.frames : 0 }));
  const tickFrames = [...ticks.frames.entries()].sort((a, b) => b[1] - a[1]);
  return {
    v: 'seiya-fight/1',
    made: { by: 'embertide-app/ui/intro/dyson-society/tools/fight-measure.mjs', inputs },
    units: { m_per_u: M_PER_U, src: 'lab/FIGHTERS.md: Seiya\'s rest pose 1.65 m feet to hair, 0.09584 m a game unit (arithmetic from the glb)' },
    clock: { frames_per_tick: tickFrames[0][0], ticks_seen: tickFrames[0][1], counter_per_tick: Object.fromEntries([...ticks.counter.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4)),
      clip_rate: X.rate, src: 'measured: the counter steps on every second recorded frame; clip_rate 30 a second is GAI.md\'s likely rate (hades-glb extras.rate), not measured' },
    runs, contact_u: r2(contact), farthest_u: r2(farthest), plays, chose, hits, buttons, fists, root,
    blends: Object.fromEntries([...blends.entries()].map(([k, s]) => [k, [...s].sort((a, b) => a - b)])),
  };
}

const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
if (import.meta.url === `file://${process.argv[1]}`) {
  const out = path.resolve(arg('--out', path.join(LAB, 'seiya-fight.hades.json')));
  const doc = measure();
  if (process.argv.includes('--check')) {
    const was = JSON.parse(fs.readFileSync(out, 'utf8'));
    const keys = Object.keys(doc).filter((k) => !same(doc[k], was[k]));
    console.log(keys.length ? `DIFFER: ${keys.join(', ')}` : `EQUAL: ${out} is what the recordings say (${doc.plays.length} plays, ${doc.hits.length} hits)`);
    process.exit(keys.length ? 1 : 0);
  }
  fs.writeFileSync(out, JSON.stringify(doc, null, 1) + '\n');
  console.log(`wrote ${out}: ${doc.plays.length} plays, ${doc.hits.length} hits, ${doc.fists.length} fists, ${Object.keys(doc.root).length} root curves, contact ${doc.contact_u} u`);
}

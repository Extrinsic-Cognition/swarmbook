// fight-lyssa-seiya.test.mjs: the fight's law, its measured numbers and his fall (lane fight-lyssa-seiya, Oct 18 2026).
//   node --test --test-force-exit --test-timeout=120000 embertide-app/ui/intro/dyson-society/lab/fight-lyssa-seiya.test.mjs
// Run on the new Mac (the house's law: no test on the serving Mac). The recording's numbers are pinned here as the recordings say them
// (tools/fight-measure.mjs wrote lab/seiya-fight.hades.json from the exports of his Oct 4 07:36:55 savestate's two sessions); the glb's through
// three (tools/fight-bodies.mjs, lab/seiya-bodies.hades.json); the law (lab/fight-lyssa-seiya.mjs); the ragdoll over his rig (lab/fight-fall.mjs).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { registerHooks } from 'node:module';

const LAB = path.dirname(new URL(import.meta.url).pathname), PROC = path.resolve(LAB, '../../room/procedural');
registerHooks({ resolve: (s, c, n) => (s === 'three' ? { url: `file://${PROC}/three.module.js`, shortCircuit: true } : n(s, c)) });
globalThis.self ??= globalThis; globalThis.createImageBitmap ??= async () => ({ width: 1, height: 1, close() {} });
const F = await import('./fight-lyssa-seiya.mjs');
const FF = await import('./fight-fall.mjs');
const measured = JSON.parse(fs.readFileSync(path.join(LAB, 'seiya-fight.hades.json'), 'utf8'));
const bodies = JSON.parse(fs.readFileSync(path.join(LAB, 'seiya-bodies.hades.json'), 'utf8'));
const near = (a, b, tol, msg) => assert.ok(Math.abs(a - b) <= tol, `${msg}: ${a} vs ${b} (tolerance ${tol})`);
const hit = (run, rel) => measured.hits.find((h) => h.run === run && h.rel === rel);
const plan = F.planFight({ measured, bodies });

// ---- the recordings' numbers, as tools/fight-measure.mjs read them ----
test('both sessions begin at his savestate of Oct 4 07:36:55: his health, Cancer\'s, the distance between them', () => {
  for (const run of ['run1', 'rig1']) {
    const s = measured.runs[run].start;
    assert.deepEqual([s.seiya.code, s.seiya.hp, s.cancer.code, s.cancer.hp, s.dist_u], [1020, 50.06, 4010, 67.68, 19.39], run);
  }
  assert.equal(measured.runs.run1.frames, 898); assert.equal(measured.runs.rig1.frames, 1177);
});
test('the engine ticks every second recorded frame and moves the counter 1.2 a tick (1.44 at the steps\' speed 1.2)', () => {
  assert.equal(measured.clock.frames_per_tick, 2);
  const top = Object.entries(measured.clock.counter_per_tick)[0]; assert.equal(top[0], '1:1.2');
  assert.ok(measured.clock.counter_per_tick['1.2:1.44'] > 0);
  near(F.TICK_MS, 40, 1e-9, 'a tick at 30 clip frames a second');
});
test('the meteor (64.4000) landed at counter 11.26 at the contact twice and at 20.86 at 66.06 units: the projectile line', () => {
  for (const [run, rel, c, d, dmg] of [['rig1', 297, 11.2558, 8, 4.55], ['rig1', 1107, 11.2558, 8, 3.69], ['run1', 333, 20.8557, 66.06, 4.55]]) {
    const h = hit(run, rel); assert.equal(h.attacker.code, 4000); assert.equal(h.attacker.counter, c); assert.equal(h.dist_before_u, d); assert.equal(h.damage, dmg); assert.equal(h.reaction.code, 1010);
  }
  const L = plan.L; near(L.meteor.v_u, (66.06 - 8) / (20.8557 - 11.2558), 1e-9, 'units a clip frame'); near(L.meteor.v_u * L.M * 30, 17.39, 0.01, 'm/s at 30 frames a second');
});
test('the punch (59.3040) landed at counter 15.6 at the contact and took 11.58 of Cancer\'s health; his left fist was 0.27 m from Cancer\'s axis', () => {
  const h = hit('run1', 413); assert.deepEqual([h.attacker.code, h.attacker.counter, h.dist_before_u, h.damage], [3040, 15.5998, 8, 11.58]);
  near(plan.L.punch.reach_m, 0.266, 0.001, 'the measured reach');
});
test('the contact: the two never came closer than 8.0 units while no throw held them (0.767 m); the farthest 109.44', () => {
  assert.equal(measured.contact_u, 8); assert.equal(measured.farthest_u, 109.44); near(plan.L.contact_m, 0.7667, 1e-4, 'metres');
});
test('his hit reactions to Cancer\'s hits: 33.1060 each time, frames and travel by weight; a knock only where he stood', () => {
  const rows = measured.hits.filter((h) => h.victim === 'PEGASUS' && h.reaction.code === 1060).map((h) => [h.rel, h.damage, h.reaction.frames, h.reaction.travel_u, h.victim_before.code, h.jump_u]);
  assert.deepEqual(rows, [[651, 1.88, 22, 0.39, 20, 3.42], [773, 6.11, 42, 8.03, 0, 2.26], [861, 5.66, 37, 8.01, 0, 2.25]]);
  assert.deepEqual(plan.L.reactions.map((r) => [r.rel, +r.jump_m.toFixed(4)]), [[651, 0], [773, +(2.26 * plan.L.M).toFixed(4)], [861, +(2.25 * plan.L.M).toFixed(4)]]);
});
test('the presses and the clip each started: TRIANGLE the meteor, CIRCLE the punch, RIGHT the run, LEFT the back step, UP and DOWN the side steps', () => {
  const first = (run, press, rel) => measured.buttons.find((b) => b.run === run && b.press === press && b.rel === rel)?.first_change;
  assert.deepEqual([first('run1', 'TRIANGLE', 297).code, first('run1', 'TRIANGLE', 297).after], [4000, 2]);
  assert.deepEqual([first('rig1', 'TRIANGLE', 1086).code, first('rig1', 'TRIANGLE', 1086).after], [4000, 3]);
  assert.deepEqual([first('run1', 'CIRCLE', 383).code, first('rig1', 'CIRCLE', 353).code], [3040, 3040]);
  assert.deepEqual([first('run1', 'RIGHT', 556).code, first('run1', 'LEFT', 641).code, first('run1', 'UP', 726).code, first('run1', 'DOWN', 804).code], [10, 20, 30, 40]);
  assert.equal(first('run1', 'CROSS', 469).code, 3020);
  assert.equal(first('run1', 'CROSS', 115).code, 1270, 'the press that left his pause menu: the knock-down he was in when he paused, resumed');
});
test('the knock-down as the game played it after Cancer\'s special: 53.1270 82 frames, 50.1240 26 on the floor, 52.1260 28 rising', () => {
  const chain = [141, 223, 249].map((rel) => measured.plays.find((p) => p.run === 'rig1' && p.rel === rel)).map((p) => [p.code, p.frames]);
  assert.deepEqual(chain, [[1270, 82], [1240, 26], [1260, 28]]);
  assert.deepEqual(plan.L.down.map((d) => [d.clip, d.ticks]), [[53, 41], [50, 13], [52, 14]]);
});
test('his 13 choices and the distances each began at; the stance he held before a calm one (median of 10, 39 frames)', () => {
  assert.equal(measured.chose.length, 13);
  assert.deepEqual(measured.chose.map((c) => `${c.code}@${c.dist0_u}`).sort(),
    ['10@71.19', '10@92.8', '20@15.99', '20@16.95', '20@26.66', '30@30.38', '3020@108.07', '3040@8', '3040@8', '40@25.74', '4000@13.02', '4000@16.16', '4000@87.66'].sort());
  assert.equal(plan.L.stance_n, 10); near(plan.L.stance_ticks, 19.5, 1e-9, 'ticks');
});
test('the root motion read off the disc\'s waist keys ends where the glb\'s extras.travel says, every clip within 1 mm', () => {
  for (const [k, r] of Object.entries(measured.root)) {
    const end = r.xz_m[r.xz_m.length - 1]; near(end[0], r.glb_travel_m[0], 1e-3, `clip ${k} x`); near(end[1], r.glb_travel_m[1], 1e-3, `clip ${k} z`);
  }
});
test('two sources agree on his fist at every hit frame: the game\'s RAM (world matrices) and the glb through three, within 1 cm', () => {
  // the glb's side is a table of whole frames lerped between (tools/fight-bodies.mjs): at the punch's 15.6 the fist moves about 4 cm a frame, so the lerp
  // alone is worth a few mm; the meteor's frames agree within 3 mm
  for (const f of measured.fists) {
    for (const hand of ['rhand', 'lhand', 'head']) {
      const g = F.bodyAt(plan.L, f.clip, f.counter, hand), r = f[`${hand}_m`];   // the recording: forward, side, up; the glb: x = -side, y = up, z = forward
      near(g[2], r[0], 0.01, `${f.run} ${f.rel} ${hand} forward`); near(-g[0], r[1], 0.01, `${f.run} ${f.rel} ${hand} side`); near(g[1], r[2], 0.01, `${f.run} ${f.rel} ${hand} up`);
    }
  }
});

// ---- the law ----
test('the law reads no clock, draws no random number and fetches nothing', () => {
  const text = fs.readFileSync(path.join(LAB, 'fight-lyssa-seiya.mjs'), 'utf8').replace(/\/\/.*$/gm, '');
  for (const bad of ['Date.', 'performance.', 'Math.random', 'fetch(', 'requestAnimationFrame', 'setTimeout', 'setInterval']) assert.ok(!text.includes(bad), bad);
});
test('the same causes give the same fight', () => {
  const again = F.planFight({ measured, bodies });
  assert.equal(JSON.stringify(again.ticks), JSON.stringify(plan.ticks)); assert.equal(JSON.stringify(again.events), JSON.stringify(plan.events));
});
test('a cause added at a beat changes nothing before that beat', () => {
  const beat = 30, more = F.planFight({ measured, bodies, causes: [...F.DEFAULT_CAUSES, { beat, lever: 1, cast: 'drag' }] });
  const k = beat * F.BEAT_MS / F.TICK_MS;
  assert.equal(JSON.stringify(more.ticks.slice(0, k + 1)), JSON.stringify(plan.ticks.slice(0, k + 1)));
  assert.equal(JSON.stringify(more.events.filter((e) => e.g < beat * F.BEAT_MS)), JSON.stringify(plan.events.filter((e) => e.g < beat * F.BEAT_MS)));
  assert.notEqual(JSON.stringify(more.events), JSON.stringify(plan.events));
});
test('the default fight: she wins, her arrow fells him, every spell of the script was cast', () => {
  assert.equal(plan.end.winner, 'Lyssajudron'); assert.ok(plan.end.fall);
  const cast = new Set(plan.events.filter((e) => e.kind === 'cast').map((e) => e.spell));
  for (const s of ['summon', 'wind', 'postit', 'storm', 'blink', 'dice', 'bolt', 'armor']) assert.ok(cast.has(s), s);
  const fall = plan.events.find((e) => e.kind === 'fall'), fin = plan.events.find((e) => e.kind === 'hit' && e.what === 'finisher');
  assert.equal(fall.g, fin.g); assert.equal(fin.his_hp, 0);
  assert.ok(plan.events.some((e) => e.kind === 'hit' && e.who === 'seiya' && e.what === 'meteor'), 'his meteor lands on her');
  assert.ok(plan.events.some((e) => e.kind === 'block'), 'her wind holds one of his strikes');
});
test('every freeze holds a whole number of sixteenths, and the two clocks map both ways', () => {
  for (const f of plan.freezes) assert.ok(Number.isInteger(Math.round(f.hold / F.SIXTEENTH_MS * 1e9) / 1e9), `${f.hold}`);
  for (const g of [0, 1234, 15600, 30000, plan.end.g - 40]) { const w = F.wallOf(plan, g); near(F.inGame(plan, w).g, g, 1e-6, `g ${g}`); }
  const f = plan.freezes[3], a = F.stateAt(plan, f.w + 10), b = F.stateAt(plan, f.w + f.hold - 10);
  assert.ok(a.freeze && b.freeze); assert.deepEqual([a.seiya.x, a.seiya.z, a.her.p], [b.seiya.x, b.seiya.z, b.her.p], 'the pose held');
});
test('at a distance he does what he did: each move is the recorded choice nearest the distance then', () => {
  for (const e of plan.events.filter((x) => x.kind === 'move')) {
    const c = plan.L.choices.find((x) => `${x.run}:${x.rel}` === e.chose), pool = plan.L.choices.filter((x) => x.after === c.after);
    const best = Math.min(...pool.map((x) => Math.abs(x.d_m - e.d_m))); near(Math.abs(c.d_m - e.d_m), best, 1e-12, `${e.g}`);
  }
});
test('he never comes closer to her than the contact, but while she is the bolt', () => {
  for (const t of plan.ticks) {
    const g = t.k * F.TICK_MS, h = F.herAt(plan, g), bolting = plan.spells.some((s) => s.kind === 'bolt' && g >= s.g0 && g < s.g2 && (s.broken == null || g <= s.broken));   // a bolt is the bolt until it breaks (the tick it breaks on was planned before)
    if (t.k === 0 || t.mode === 'fallen' || bolting) continue;
    assert.ok(Math.hypot(h.p[0] - t.x, h.p[2] - t.z) >= plan.L.contact_m - 1e-9, `tick ${t.k}: ${Math.hypot(h.p[0] - t.x, h.p[2] - t.z)}`);
  }
});
test('the spell book: the lever and the cast name the spell; the dice are a function of the count', () => {
  assert.deepEqual([F.spellOf({ beat: 0, cast: 'word' }), F.spellOf({ beat: 1, lever: 0, cast: 'tap' }), F.spellOf({ beat: 1, lever: 0, cast: 'drag' }), F.spellOf({ beat: 1, lever: 1, cast: 'tap' }),
    F.spellOf({ beat: 1, lever: 1, cast: 'drag' }), F.spellOf({ beat: 1, lever: 2, cast: 'drag' }), F.spellOf({ beat: 1, lever: 2, cast: 'tap' }), F.spellOf({ beat: 1, cast: 'lift' })],
    ['summon', 'wind', 'blink', 'postit', 'storm', 'bolt', 'armor', 'dice']);
  const rolls = Array.from({ length: 400 }, (_, i) => F.dice(i, 7)); assert.ok(rolls.every((r) => r >= 1 && r <= 20)); assert.equal(new Set(rolls).size, 20);
  assert.equal(F.dice(5, 22), F.dice(5, 22));
});

// ---- his fall: the house's ragdoll over his rig ----
async function poseAt(P, g) {
  const THREE = await import('three'), { GLTFLoader } = await import(`${PROC}/GLTFLoader.js`);
  const bytes = fs.readFileSync(path.join(LAB, 'seiya.hades.glb'));
  const gltf = await new Promise((ok, no) => new GLTFLoader().parse(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.length), '', ok, no));
  let skinned = null; gltf.scene.traverse((o) => { if (o.isSkinnedMesh) skinned = o; });
  const group = new THREE.Group(); group.add(gltf.scene); const s = F.seiyaAt(P, g); group.position.set(s.x, 0, s.z); group.rotation.y = s.yaw;
  const X = gltf.parser.json.extras, mixer = new THREE.AnimationMixer(gltf.scene), clip = THREE.AnimationClip.findByName(gltf.animations, X.clips[s.clip]);
  const a = mixer.clipAction(clip); a.play(); a.time = Math.min(s.c / X.rate, clip.duration); mixer.update(0); group.updateMatrixWorld(true);
  const rig = FF.fallRig(new Uint8Array(bytes)), by = Object.fromEntries(skinned.skeleton.bones.map((b) => [b.name, b])), v = new THREE.Vector3(), q = new THREE.Quaternion();
  const pose = { pos: [], q: [] }; for (const n of rig.names) { by[n].getWorldPosition(v); by[n].getWorldQuaternion(q); pose.pos.push([v.x, v.y, v.z]); pose.q.push([q.x, q.y, q.z, q.w]); }
  return { rig, pose };
}
test('his rig for the fall: 18 joints from the glb in metres, the waist the root with the legs first', () => {
  const rig = FF.fallRig(new Uint8Array(fs.readFileSync(path.join(LAB, 'seiya.hades.glb'))));
  assert.equal(rig.names.length, 18); assert.equal(rig.names[0], 'h_jnt_waist'); assert.equal(rig.jparent[0], -1);
  assert.deepEqual(rig.jparent.map((p, c) => (p === 0 ? rig.names[c] : null)).filter(Boolean), ['h_jnt_luleg', 'h_jnt_ruleg', 'h_jnt_lbody']);
  near(rig.metre.scale, 0.0958425521203981, 1e-12, 'the root\'s scale');
  near(rig.restLen[rig.names.indexOf('h_jnt_llleg')], 4.303 * 0.0958425521203981, 1e-3, 'the thigh, metres');
});
test('felled by her arrow, he falls and lies where he fell: lengths kept, nothing walks, the same fall twice', async () => {
  const fall = plan.end.fall, { rig, pose } = await poseAt(plan, fall.g);
  const A = FF.fallOf(rig, pose, { dir: fall.dir }), B = FF.fallOf(rig, pose, { dir: fall.dir });
  assert.deepEqual(Array.from(A.pos.slice(-60)), Array.from(B.pos.slice(-60)));
  const J = A.J, last = (A.n - 1) * J * 3, oneSec = Math.round(1.5 / A.dt) * J * 3;
  let top = 0; for (let j = 0; j < J; j++) top = Math.max(top, A.pos[last + j * 3 + 1]); assert.ok(top < 0.3, `the highest joint at the end: ${top}`);
  let low = 0; for (let i = 0; i < A.n; i++) for (let j = 0; j < J; j++) low = Math.min(low, A.pos[i * J * 3 + j * 3 + 1]); assert.ok(low > -0.01, `below the floor: ${low}`);
  for (let j = 1; j < J; j++) { const p = rig.jparent[j], d = Math.hypot(...[0, 1, 2].map((k) => A.pos[last + j * 3 + k] - A.pos[last + p * 3 + k])); near(d, rig.restLen[j], 0.01, rig.names[j]); }
  const walk = Math.hypot(A.pos[last] - A.pos[oneSec], A.pos[last + 2] - A.pos[oneSec + 2]); assert.ok(walk < 0.15, `the lying body moved ${walk} m after 1.5 s`);
});

// ---- THE FIGHT FOR HARLEYQUINTITI (protect: true, Oct 24 2026): his hands are Seiya's, her spells fly at Harleyquintiti behind him ----
const guard = (his = []) => F.planFight({ measured, bodies, protect: true, his });
const count = (P, f) => P.events.filter(f).length;
test('the protect fight: the default fight is untouched by it (the same events, the same end, the same wall clock)', () => {
  const again = F.planFight({ measured, bodies });
  assert.equal(JSON.stringify(again.events), JSON.stringify(plan.events)); assert.deepEqual(again.end, plan.end); assert.equal(again.wall_ms, plan.wall_ms);
  near(plan.end.g, 42040, 1e-6, 'the default fight still ends at 42.04 s in-game'); near(plan.wall_ms, 56290, 1, 'and at 56.29 s on the wall');
});
test('the protect fight: her script loops the default causes after the summoning, every 16 bars', () => {
  const s = F.herScript(200), first = s.filter((c) => c.loop === 0), second = s.filter((c) => c.loop === 1);
  assert.equal(s[0].cast, 'word'); assert.equal(s.filter((c) => c.cast === 'word').length, 1, 'one summoning');
  assert.equal(second.length, first.length); second.forEach((c, i) => assert.equal(c.beat - first[i].beat, F.HER_LOOP.every_beats));
});
test('the protect fight: the same presses give the same fight, and a press at a beat changes nothing before that beat', () => {
  const a = guard(F.HIS_SCRIPT), b = guard(F.HIS_SCRIPT);
  assert.equal(JSON.stringify(a.events), JSON.stringify(b.events));
  const extra = guard([...F.HIS_SCRIPT, { beat: 30, move: 'step', dir: -1, by: 'test' }]), cut = 30 * F.BEAT_MS;
  const before = (P) => JSON.stringify(P.events.filter((e) => e.g < cut - 1e-9));
  assert.equal(before(extra), before(a), 'nothing before beat 30 moved');
});
test('the protect fight: with no hand, his body stands between them at first and stops her first storm, and she is taken in the end', () => {
  const P = guard([]);
  assert.ok(count(P, (e) => e.kind === 'dive' && e.on === 'seiya') >= 10, 'the first storm meets him');
  assert.ok(count(P, (e) => e.kind === 'hit' && e.on === 'harley') > 0, 'later strikes reach her');
  assert.equal(P.end.winner, 'Lyssajudron'); assert.equal(P.end.taken, true); assert.equal(P.ticks[P.ticks.length - 1].harley_hp, 0);
});
test('the protect fight: the scripted hand protects her: strikes stopped by his body, bolts broken by his meteor, the Lyssajudron down', () => {
  const P = guard(F.HIS_SCRIPT), last = P.ticks[P.ticks.length - 1];
  assert.equal(P.end.winner, 'Seiya'); assert.equal(P.end.protected, true); assert.equal(last.her_hp, 0);
  near(P.end.g, 53000, 1e-6, 'he wins at 53.00 s in-game'); near(P.wall_ms, 86000, 1e-6, 'and at 86.00 s on the wall'); near(last.harley_hp, 71.8, 1e-6, 'her health at the end');
  assert.equal(count(P, (e) => e.kind === 'broken'), 2, 'two bolts broken by his meteor'); assert.equal(count(P, (e) => e.kind === 'dive' && e.on === 'seiya'), 21, 'twenty-one dives met his body');
  assert.equal(count(P, (e) => e.kind === 'hit' && e.on === 'harley'), 15, 'fifteen reached her'); assert.equal(count(P, (e) => e.kind === 'act' && e.move === 'back'), 9, 'nine back steps');
});
test('the protect fight: the back step takes him from her toward Harleyquintiti, along the line between them', () => {
  const still = guard([]), P = guard([{ beat: 5, move: 'back' }]), act = P.events.find((e) => e.kind === 'act' && e.move === 'back'), g1 = act.g + F.STEP_TICKS * F.TICK_MS;
  const a = F.seiyaAt(still, g1), b = F.seiyaAt(P, g1), hq = P.harley.at, ly = F.herAt(still, act.g).p;
  assert.ok(Math.hypot(b.x - hq[0], b.z - hq[2]) < Math.hypot(a.x - hq[0], a.z - hq[2]) - 0.5, 'nearer her by half a metre at least');
  assert.ok(Math.hypot(b.x - ly[0], b.z - ly[2]) > Math.hypot(a.x - ly[0], a.z - ly[2]) + 0.5, 'farther from the Lyssajudron');
});
test('the protect fight: the taps of one beat burn one meteor hotter, at most twice; a press he cannot take in time is lost', () => {
  const taps = (n) => Array.from({ length: n }, () => ({ beat: 5, move: 'meteor' }));
  for (const n of [1, 2, 3, 5, 9]) {
    const a = guard(taps(n)).events.find((e) => e.kind === 'act' && e.move === 'meteor');
    assert.equal(a.n, n); near(a.cosmos, Math.min(F.COSMOS.max, 1 + F.COSMOS.per_tap * (n - 1)), 1e-12, `${n} taps`);
  }
  // a punch at beat 0 waits through the summoning (one bar) and is taken at his stance; one made 6 beats before a long knockdown is lost
  const P = guard([{ beat: 1, move: 'punch' }]); assert.equal(count(P, (e) => e.kind === 'act' && e.move === 'punch'), 1);
  const late = guard([{ beat: 5, move: 'meteor' }, { beat: 5, move: 'punch' }, { beat: 5, move: 'step', dir: 1 }, { beat: 5, move: 'meteor' }]);
  assert.ok(count(late, (e) => e.kind === 'act') >= 1);
});
test('the protect fight: a side step carries him round her (his bearing turns, his distance holds), each way the other way', () => {
  const still = guard([]), turned = [];
  for (const dir of [1, -1]) {
    const P = guard([{ beat: 5, move: 'step', dir }]), act = P.events.find((e) => e.kind === 'act' && e.move === 'step'), g1 = act.g + F.STEP_TICKS * F.TICK_MS;
    const a = F.seiyaAt(still, g1), b = F.seiyaAt(P, g1), ha = F.herAt(still, g1).p, hb = F.herAt(P, g1).p, brg = (s, h) => Math.atan2(s.x - h[0], s.z - h[2]);
    let d = brg(b, hb) - brg(a, ha); d = Math.atan2(Math.sin(d), Math.cos(d)); turned.push(d);
    assert.ok(Math.abs(d) > 0.6, `dir ${dir}: his bearing round her turns ${d.toFixed(3)} rad`);
    near(Math.hypot(b.x - hb[0], b.z - hb[2]), Math.hypot(a.x - ha[0], a.z - ha[2]), 0.3, `dir ${dir}: his distance to her holds`);
  }
  assert.ok(Math.sign(turned[0]) === -Math.sign(turned[1]), 'the two side steps turn opposite ways');
});
test('the protect fight: Harleyquintiti stands behind him on the summoning line, and stateAt says her health and her strikes', () => {
  const P = guard(F.HIS_SCRIPT), st0 = F.stateAt(P, 0);
  near(st0.harley.at[0], P.ticks[0].x - F.HARLEY.behind_m, 1e-12, 'behind him'); assert.equal(st0.hp.harley, F.HARLEY.hp); assert.equal(st0.harley.taken, false);
  const struck = P.events.find((e) => e.kind === 'hit' && e.on === 'harley'), st = F.stateAt(P, F.wallOf(P, struck.g) + 1);
  assert.ok(st.harley.struck && st.harley.struck.what === struck.what); assert.ok(st.hp.harley < F.HARLEY.hp);
});

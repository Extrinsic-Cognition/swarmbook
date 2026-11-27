// unboxing-plan.test.mjs: the unboxing opens the first time the golden Sagittarius appears in the sky, Seiya rises at his conversion tag,
// the box shuts on the armor and is the page's sphere again before it is handed back (unboxing-plan.mjs). node --test unboxing-plan.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {beat, spring, ssInt, ss, END, PIECES, RAYS, CLOSE, SHUT, DISSOLVE, lotus, floorOf, rotate, turnAbout, squareTo, foldSpin} from './unboxing-plan.mjs';
import {buildAssemblySkin} from '../app/assembly-geometry.js';

const AT = {open: 42.342, centaur: 50.05, knights: 53.053, rise: 61.767, back: 145.598};   // the gold star, the centaur, the knights, his tag, the end card
const closed = (s) => s.pres === 0 && s.k3d === 0 && s.lid === 0 && s.lower.every(v => v === 0) && s.upper.every(v => v === 0);

test('a spring starts still, swings an eighth past one and settles there', () => {
  assert.equal(spring(0), 0);
  assert.ok(spring(0.01) < 2e-3, "it starts with no speed");
  let top = 0;
  for (let x = 0; x < 4; x += 0.001) top = Math.max(top, spring(x));
  assert.ok(top > 1.08 && top < 1.2, `the swing reaches ${top}`);
  assert.ok(Math.abs(spring(4) - 1) < 1e-3);
});

test('an angle turned at a smoothstep rate has no jump', () => {
  for (const x of [-1, 0.2, 0.9, 1.7, 3]) {
    const d = (ssInt(0, 1.75, x + 1e-6) - ssInt(0, 1.75, x - 1e-6)) / 2e-6;
    assert.ok(Math.abs(d - ss(0, 1.75, x)) < 1e-5, `rate at ${x}`);
  }
});

test('the box is out from the first time the golden Sagittarius appears in the sky until the sphere is handed back after the armor, and only then', () => {
  assert.equal(beat(AT.open - 0.001, AT).out, false);
  assert.equal(beat(AT.open, AT).out, true);
  assert.equal(beat(66, AT).out, true);
  const back = AT.rise + CLOSE + END;   // 72.267 s
  assert.ok(Math.abs(back - 72.267) < 1e-9);
  assert.equal(beat(back - 0.001, AT).out, true);
  assert.equal(beat(back + 1e-9, AT).out, false);
  assert.equal(beat(100, AT).out, false, 'the page\'s own sphere from then on');
  assert.equal(beat(148, AT).out, false, 'nothing under the end card any more');
  assert.equal(beat(NaN, AT).out, false);
});

test('at the gold star the box is the closed sphere and its seams light up first; it flashes with the film\'s rays and only then opens', () => {
  const first = beat(AT.open, AT);
  assert.ok(closed(first) && first.mode === 2 && first.fade === 1 && first.seam === 0);
  const seams = beat(AT.open + 0.6, AT);
  assert.ok(seams.seam > 0.9, 'the seams are lit');
  assert.ok(seams.lid === 0 && seams.lower.every(v => v === 0) && seams.upper.every(v => v === 0), 'and it has not opened yet');
  assert.equal(beat(AT.open + RAYS, AT).bloom, 1, 'the flash at the film\'s rays, 43.5 s');
  const s = beat(AT.centaur + 0.3, AT);
  assert.ok(s.pres === 1 && s.k3d === 1 && s.lid === 1 && s.lead === 1);
  assert.ok(s.lower.every(v => v === 1) && s.upper.every(v => v === 1), 'open by the time the centaur is on screen');
  const early = beat(AT.open + 1.5, AT);
  assert.ok(early.lower[0] > early.lower[4], 'the bloom goes round');
});

test('it opens slowly, from the gold star to the gold centaur: half open with the sun, fully open only as the centaur appears', () => {
  const sun = beat(47.2, AT), before = beat(AT.centaur - 1, AT), at = beat(AT.centaur, AT);
  assert.ok(sun.lower.every(v => v > 0.05 && v < 0.95), `still opening at 47.2 s (${sun.lower.map(v => v.toFixed(2))})`);
  assert.ok(before.lower[4] < 1 && before.upper[4] < 1);
  assert.ok(at.lower.every(v => v > 0.98) && at.lid > 0.99);
  assert.ok(beat(AT.centaur, AT).cloth.glint > 0.9, 'the cloth catches the light as the centaur appears');
});

test('from the cut to the other knights each face becomes a world, one after the other, and they come back as it closes on the armor', () => {
  assert.ok(beat(AT.knights - 0.01, AT).worlds.every(v => v === 0));
  const leaving = beat(AT.knights + 0.6, AT).worlds;
  assert.ok(leaving[0] > leaving[11], 'one after the other');
  assert.ok(beat(AT.knights + 2.5, AT).worlds.every(v => v === 1), 'all twelve are worlds');
  assert.ok(beat(AT.rise + 2, AT).worlds.every(v => v === 1), 'through Seiya\'s rise');
  const back = beat(AT.rise + CLOSE + 1, AT).worlds;
  assert.ok(back.every(v => v > 0 && v < 1), 'coming back as the box closes');
  assert.ok(beat(AT.rise + CLOSE + SHUT, AT).worlds.every(v => v === 0), 'all home when it shuts');
  assert.ok(beat(AT.knights + 4, {...AT, knights: NaN}).worlds.every(v => v === 0), 'no knights moment, no worlds');
});

test('Seiya rises at his conversion tag, the cloth bursts onto him, he rises out as the box shuts on the armor, the wings spread over it', () => {
  assert.equal(beat(AT.rise - 0.01, AT).seiya.show, false);
  assert.equal(beat(AT.rise, AT).seiya.show, true);
  assert.ok(beat(AT.rise, AT).seiya.y < -2, 'below the floor at first');
  assert.ok(Math.abs(beat(AT.rise + 4, AT).seiya.y) < 1e-9, 'standing on it once risen');
  assert.equal(beat(AT.rise + PIECES - 0.01, AT).cloth.show, true);
  assert.equal(beat(AT.rise + PIECES + 1e-9, AT).cloth.show, false);
  assert.ok(Math.abs(beat(AT.rise + PIECES + 0.5, AT).cloth.pieces - 0.5) < 1e-9);
  const shut = beat(AT.rise + CLOSE + SHUT, AT);   // 69.67 s
  assert.ok(shut.lid === 0 && shut.lower.every(v => v === 0) && shut.upper.every(v => v === 0), 'shut when the armor is on');
  assert.ok(Math.abs(shut.seiya.y - 1.9) < 0.03 && shut.seiya.glow === 0, 'and he stands above it (a breath of a hover), dressed');
  assert.ok(beat(70.5, AT).seiya.wings > 0.5, 'the wings spread with the film\'s at 70 s');
  assert.ok(beat(AT.rise + 9.9, AT).seiya.scale < 0.05 && beat(AT.rise + 9.9, AT).seiya.glow === 1, 'up into the light and gone to a star');
  assert.equal(beat(AT.rise + 10 + 1e-9, AT).seiya.show, false);
  const before = beat(AT.rise + CLOSE + 4.7, AT);
  assert.ok(closed(before) && before.fade === 1, 'the page\'s sphere again, before it fades over the page\'s own');
  const fading = beat(AT.rise + CLOSE + 5.0, AT);
  assert.ok(fading.fade > 0 && fading.fade < 1 && fading.mode === 1, 'the page draws its skin under the fading box');
});

test('the empty frames: from the cut to the gold centaur the faces are empty until the box is shut on the armor, THE CUTS\' device on both cuts', () => {
  const at = {...AT, empty: [AT.centaur, Infinity]}, shut = AT.rise + CLOSE + SHUT;
  assert.equal(beat(AT.centaur - 0.01, at).empty, 0);
  assert.equal(beat(AT.centaur - 0.01, at).pass, 0);
  assert.deepEqual([0.02, 0.12, 0.25].map(x => beat(AT.centaur + x, at).pass), [1, 2, 0], 'the normals, the matte, then the empty frame');
  for (const t of [AT.centaur, 51.2, 56, 63.5, shut - 0.01]) assert.equal(beat(t, at).empty, 1, `empty at ${t}`);
  assert.equal(beat(shut, at).empty, 0, 'the picture again as it is shut on the armor');
  assert.deepEqual([0.02, 0.12, 0.25].map(x => beat(shut + x, at).pass), [1, 2, 0]);
  assert.equal(beat(AT.rise + 0.05, at).pass, 1, 'his conversion tag keeps its own device');
  // to the knights' cut instead, and none at all without the window
  const knights = {...AT, empty: [AT.centaur, AT.knights]};
  assert.equal(beat(AT.knights - 0.01, knights).empty, 1);
  assert.equal(beat(AT.knights + 0.01, knights).empty, 0);
  assert.equal(beat(AT.knights + 0.05, knights).pass, 1);
  for (const t of [44, 51.2, 60, 68]) assert.equal(beat(t, AT).empty, 0, `no window, a picture at ${t}`);
});

test('the knights light one frame each as they appear, live while their segment plays, kept after; the mask through the transformation', () => {
  const segments = [{t0: 53.053, t1: 55.055}, {t0: 55.055, t1: 57.057}, {t0: 57.057, t1: 59.059}], shut = AT.rise + CLOSE + SHUT;
  const at = {...AT, empty: [AT.centaur, Infinity], segments, mask: true};
  const lit = (t) => beat(t, at).knights.map(k => (k.lit ? 1 : 0) + (k.live ? 1 : 0)).join('');   // 0 dark, 1 kept, 2 live
  assert.equal(lit(52.9), '000');
  assert.equal(lit(53.1), '200', 'Ikki and Shun, live');
  assert.equal(lit(56), '120', 'Shiryu live, Ikki and Shun kept');
  assert.equal(lit(58), '112', 'Hyoga');
  assert.equal(lit(60), '111', 'all three kept');
  assert.equal(lit(70), '000', 'the faces carry the film again once it is shut');
  assert.deepEqual([61.7, 61.8, 65, shut - 0.01, shut + 0.01].map(t => beat(t, at).mask), [0, 1, 1, 1, 0], 'the mask from his conversion tag to the shut');
  assert.equal(beat(65, {...at, mask: false}).mask, 0, 'no mask unless asked');
});

test('the end of it, reading A: the box burns away at the cut to the knights, their cosmos makes a new one, whole as Seiya stands alone in gold; it burns from inside, its faces fly as darts, the sphere back at the gold debris', () => {
  const end = {dissolve: 86.753, whole: 93.260, burn: 100.767, darts: 104.771, back: 108.275, streams: [86.753, 87.153, 88.755, 90.757]}, at = {...AT, end};
  assert.equal(beat(86.7, at).out, false, 'the page\'s own sphere before the cut');
  const cut = beat(86.76, at);
  assert.deepEqual([cut.out, cut.end, cut.mode, cut.pass, cut.k3d, cut.pres], [true, true, 2, 1, 0, 0], 'it takes the sphere\'s place as the page draws it, THE CUTS\' device first');
  for (let i = 0; i < 12; i++) assert.ok(beat(end.dissolve + 0.06 * i + DISSOLVE + 0.01, at).gone[i] > 0.999, `face ${i} burns away whole before it is made again`);
  const forming = beat(90, at).gone;
  assert.ok(forming.slice(0, 3).every(g => g < 0.95) && forming.slice(9).every(g => g > 0.99), 'Ikki\'s faces are being made, Shiryu\'s not yet');
  assert.ok(beat(93.3, at).gone.every(g => g === 0), 'whole as he stands alone in gold');
  assert.equal(beat(96, at).flow, false, 'nothing moves fast between the whole box and the burn');
  assert.ok(beat(100.6, at).burn === 0 && beat(101.4, at).burn > 0.9, 'it burns from inside at the first keyframe');
  const darts = beat(105.0, at);
  assert.ok(darts.dart[0] > 0 && darts.dart[11] < 0, 'the faces fly one after another from the second');
  assert.ok(darts.flow, 'on the screen\'s frames');
  assert.equal(beat(108.3, at).out, false, 'the sphere back at the gold debris');
  assert.equal(beat(90, AT).out, false, 'nothing without his moments');
});

test('the end of it, reading B: the box lives through the knights, burns away as Seiya stands alone in gold, and the new one forms as he burns his cosmos', () => {
  const end = {dissolve: 93.260, whole: 101.335, burn: 101.335, darts: 106.773, back: 108.275, streams: [93.86, 94.46, 95.06, 95.66]}, at = {...AT, end};
  assert.equal(beat(90, at).out, false, 'the page\'s sphere through the knights');
  for (let i = 0; i < 12; i++) assert.ok(beat(end.dissolve + 0.06 * i + DISSOLVE + 0.01, at).gone[i] > 0.999, `face ${i} gone first`);
  assert.ok(beat(99, at).gone.some(g => g > 0 && g < 1), 'forming');
  assert.ok(beat(101.4, at).gone.every(g => g === 0), 'whole as he burns');
  assert.ok(beat(106.5, at).dart.every(a => a < 0) && beat(107, at).dart[0] > 0, 'the darts at 106.773 s');
});

test('if his conversion tag does not fall while the box is open, it closes under the end card', () => {
  const at = {...AT, rise: 30};
  assert.equal(beat(100, at).out, true);
  assert.equal(beat(100, at).seiya.show, false);
  assert.equal(beat(AT.back + END + 1e-9, at).out, false);
  assert.ok(closed(beat(AT.back + 4.7, at)));
});

test('the screen\'s frames only while something moves fast: the opening, the rise and the close', () => {
  assert.equal(beat(AT.open + 1, AT).flow, true);
  assert.equal(beat(48, AT).flow, false);
  assert.equal(beat(AT.centaur, AT).flow, true);
  assert.equal(beat(56, AT).flow, true, 'the faces ride the worlds on the screen\'s frames');
  assert.equal(beat(AT.rise + 5, AT).flow, true);
  assert.equal(beat(71.5, AT).flow, true);
  assert.equal(beat(30, AT).flow, false);
});

test('a second lands on one picture whatever came before it', () => {
  assert.deepEqual(beat(66.3, AT), beat(66.3, AT));
});

test('the box is a lotus on its floor: five petals hinged on the floor, five on the lid, atan(2) lays each flat', () => {
  const {pents: faces} = buildAssemblySkin(0);
  for (const floor of [2, 7, 9]) {
    const box = lotus(faces, floor);
    assert.equal(box.lower.length, 5);
    assert.equal(box.upper.length, 5);
    assert.ok(Math.abs(faces[box.top].normal[0] + faces[floor].normal[0]) < 1e-9);
    for (const {i, axis} of box.lower) {
      const n = turnAbout(faces[i].normal, axis, Math.atan(2));
      assert.ok(n.every((v, k) => Math.abs(v - faces[floor].normal[k]) < 1e-9), 'a lower petal laid flat faces as the floor');
    }
    for (const {i, axis} of box.upper) {
      const n = turnAbout(faces[i].normal, axis, Math.atan(2));
      assert.ok(n.every((v, k) => Math.abs(v - faces[box.top].normal[k]) < 1e-9), 'a lid petal laid flat faces as the top');
    }
    const angles = box.lower.map(p => p.angle);
    assert.deepEqual(angles, [...angles].sort((m, n) => m - n));
  }
});

test('the floor is the face that looks most downward as the page has the sphere turned', () => {
  const {pents: faces} = buildAssemblySkin(0);
  for (const [yaw, pitch] of [[-0.32, -0.12], [1.7, -0.12], [4.2, 0.4]]) {
    const f = floorOf(faces, yaw, pitch), ys = faces.map(g => rotate(g.normal, yaw, pitch)[1]);
    assert.equal(ys[f], Math.min(...ys));
  }
});

// THE FOLD as he gave it at 19:19 WEST, AS ONE WINDOW since his Oct 15 2026 00:44 WEST words ("this grid dude is all absolutely fucked up. you
// gotta do differently. when does it stop being a dodecahedron mask??"): her cut 29.563 s, the faces down on her face by 30.2, that pentagon
// into her window by 30.5 (no face from there), the wall of light 37.132 to 37.6, the sphere whole at 38.071, her last cut (the hand-back) 38.0714
const FOLDED = {...AT, fold: {start: 29.563, flat: 30.2, gone: 30.5, aiolos: 37.132, closed: 37.6, whole: 38.071, back: 38.0714}};
const sameAngle = (a, b, e = 1e-9) => Math.abs(Math.atan2(Math.sin(a - b), Math.cos(a - b))) < e;

test('THE FOLD: the box is out from her cut to her last cut, the page\'s skin hushed, and not before nor after', () => {
  assert.equal(beat(29.5, FOLDED).out, false);
  for (const t of [29.563, 30, 33, 36, 37.3, 38.07]) { const s = beat(t, FOLDED); assert.equal(s.out, true, `out at ${t}`); assert.equal(s.fold, true); assert.equal(s.mode, 2); assert.equal(s.fade, 1); }
  assert.equal(beat(38.072, FOLDED).out, false, 'the page\'s sphere back at her last cut');
  assert.equal(beat(42.342, FOLDED).fold, undefined, 'the box\'s own window as before');
  assert.equal(beat(30, AT).out, false, 'no fold in the moments: her span as it was');
});

test('THE FOLD: the faces come as the page\'s sphere, turn into windows onto her plane with the origami\'s gold edges, and go back into the page\'s own look as the sphere is whole', () => {
  const s0 = beat(29.563, FOLDED);
  for (const k of ['k3d', 'look', 'lead', 'dark', 'turn', 'back']) assert.equal(s0[k], 0, `${k} at her cut: the page's own sphere`);
  const s1 = beat(29.9, FOLDED);
  assert.equal(s1.k3d, 1); assert.equal(s1.look, 1); assert.equal(s1.lead, 1, 'gold leading while they fly');
  for (const t of [30.2, 33, 36.9]) {
    const s = beat(t, FOLDED);
    assert.equal(s.look, 1); assert.equal(s.k3d, 1); assert.equal(s.turn, 1, `square to the eye at ${t}`); assert.equal(s.back, 0);
    assert.equal(s.lead, 1, `the leading at ${t} (her window dissolves it where it has reached: the face shader)`);
  }
  assert.equal(beat(37.132, FOLDED).lead, 0, 'at the wall her window has reached every face: no leading, and it comes back as they lift off');
  assert.equal(beat(37.3, FOLDED).lead, 1);
  const end = beat(38.071, FOLDED);
  for (const k of ['k3d', 'look', 'lead', 'dark']) assert.equal(end[k], 0, `${k} once the sphere is whole: the page's own look`);
  assert.equal(end.back, 1, 'turned back to the page\'s own pose');
});

test('THE FOLD: nothing jumps from her cut to her last, the hand-over and the hand-back included', () => {
  const keys = ['k3d', 'look', 'lead', 'dark', 'turn', 'back'];
  let prev = beat(29.563, FOLDED);
  for (let t = 29.568; t < 38.0714; t += 0.005) {
    const s = beat(t, FOLDED);
    for (const k of keys) assert.ok(Math.abs(s[k] - prev[k]) < 0.07, `${k} at ${t.toFixed(3)}: ${prev[k]} to ${s[k]}`);
    prev = s;
  }
  const last = beat(38.071, FOLDED);
  for (const k of ['k3d', 'look', 'lead', 'dark']) assert.equal(last[k], 0, `${k} at the hand-back`);
});

test('THE FOLD: the page goes black edge to edge as the faces land and white again under the wall of light', () => {
  assert.equal(beat(29.6, FOLDED).dark, 0);
  assert.ok(beat(29.9, FOLDED).dark > 0.3 && beat(29.9, FOLDED).dark < 0.8);
  for (const t of [30.2, 33, 36.9, 37.132]) assert.equal(beat(t, FOLDED).dark, 1, `black at ${t}`);
  assert.ok(beat(37.36, FOLDED).dark > 0 && beat(37.36, FOLDED).dark < 1);
  for (const t of [37.6, 38.0]) assert.equal(beat(t, FOLDED).dark, 0, `white at ${t}`);
});

test('THE FOLD: the screen\'s frames while the faces come, while the one pentagon dissolves into her window, and while they go; the film\'s between', () => {
  for (const t of [29.6, 30.0, 30.25, 30.35, 30.5]) assert.equal(beat(t, FOLDED).flow, true, `the screen's frames at ${t}`);
  for (const t of [30.6, 33, 37.0]) assert.equal(beat(t, FOLDED).flow, false, `the film's frames at ${t}`);
  for (const t of [37.1, 37.5, 38.0]) assert.equal(beat(t, FOLDED).flow, true, `the screen's frames at ${t}`);
  const {gone, ...asBefore} = FOLDED.fold;
  assert.equal(beat(30.35, {...AT, fold: asBefore}).flow, false, 'with no dissolve, the film\'s frames from 30.3 s as before');
});

test('THE FOLD AS ONE WINDOW (his Oct 15 2026 00:44 WEST): from 30.5 s to the wall of light the box draws no face (every 5 ms); from her cut to 30.5 s and from the wall to the hand-back it does', () => {
  for (let t = 30.5; t < 37.132; t += 0.005) assert.equal(beat(t, FOLDED).faces, false, `a face drawn at ${t.toFixed(3)}`);
  for (let t = 29.563; t < 30.5; t += 0.005) assert.equal(beat(t, FOLDED).faces, true, `no face at ${t.toFixed(3)}`);
  for (let t = 37.132; t < 38.0714; t += 0.005) assert.equal(beat(t, FOLDED).faces, true, `no face at ${t.toFixed(3)}`);
  const {gone, ...asBefore} = FOLDED.fold;
  assert.equal(beat(33, {...AT, fold: asBefore}).faces, true, 'a fold with no dissolve draws its faces throughout, as before');
});

test('THE FOLD AS ONE WINDOW on the page: the box lays the faces out with oneCells (her own face, for all twelve), never the struck lattice, and draws them only on the plan\'s word; hero-mount.js (the page\'s own mount) gives the plan its 30.5 s', async () => {
  const fs = await import('node:fs'), {fileURLToPath} = await import('node:url');
  const read = (f) => fs.readFileSync(fileURLToPath(new URL(f, import.meta.url)), 'utf8');
  const box = read('./unboxing.js').replace(/\/\/.*$/gm, ''), page = read('./hero-mount.js');
  assert.ok(/oneCells\(faces, root\)/.test(box) && !/hexCells\(/.test(box), 'oneCells, not hexCells');
  // the lab's one-layer view (his Oct 15 2026 "isolate in separate layers", 4bf23542: unboxing.js layers(), 'all' on the page) may hide the group
  // too; it never draws a face the plan does not, and nothing else stands beside s.faces
  assert.ok(/const drawn = s\.faces !== false;\s*box\.visible = drawn(?: && layerView === 'all')?;/.test(box), 'the faces\' group drawn only on s.faces');
  assert.ok(/gone: ONE\.gone/.test(page), 'the plan\'s 30.5 s from cubism.mjs ONE');
});

test('THE FOLD\'s turn: from the page\'s pose at her cut to her face square to the eye as they land, held, then to the page\'s own pose of the frame as they go home', () => {
  const pents = buildAssemblySkin(0).pents;
  for (const f of pents) {
    const to = squareTo(f.normal), n = rotate(f.normal, to.yaw, to.pitch);
    assert.ok(Math.abs(n[0]) < 1e-12 && Math.abs(n[1]) < 1e-12 && Math.abs(n[2] - 1) < 1e-12, `face ${f.id} square to the eye`);
  }
  const from = {yaw: 0.38, pitch: -0.12}, to = {yaw: -2.9, pitch: 0.4}, live = {yaw: 3.1, pitch: -0.12};
  const spin = (t) => foldSpin(beat(t, FOLDED), from, to, live);
  assert.ok(sameAngle(spin(29.563).yaw, from.yaw) && spin(29.563).pitch === from.pitch, 'the page\'s pose at her cut');
  for (const t of [30.2, 33, 37.132]) { const s = spin(t); assert.ok(sameAngle(s.yaw, to.yaw) && Math.abs(s.pitch - to.pitch) < 1e-12, `square at ${t}`); }
  assert.ok(sameAngle(spin(38.071).yaw, live.yaw) && Math.abs(spin(38.071).pitch - live.pitch) < 1e-12, 'the page\'s own pose when the sphere is whole');
  let prev = spin(29.563);
  for (let t = 29.568; t < 38.0714; t += 0.005) {
    const s = spin(t);
    assert.ok(Math.abs(Math.atan2(Math.sin(s.yaw - prev.yaw), Math.cos(s.yaw - prev.yaw))) < 0.05 && Math.abs(s.pitch - prev.pitch) < 0.05, `the short way round, no jump at ${t.toFixed(3)}`);
    prev = s;
  }
  assert.deepEqual(foldSpin(beat(33, FOLDED), from, to), foldSpin(beat(33, FOLDED), from, to, live), 'the page\'s live pose is read only on the way back');
});

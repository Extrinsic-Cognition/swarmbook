// warm-sphere-moment.test.mjs: the hero sphere's growth is one moment of the Saint Seiya film, the Ryu Sei Ken (his Oct 14 2026 11:2x to 11:3x
// WEST: "this must not start expanding from the get go... THIS IS ONE MOMENT IN A TIMELINE", "QUANTE VOLTE HO DETTO DI CONCENTRARCI SUL
// MOMENTO IN CUI LUI FA RYUSEIKEN"). node --test warm-sphere-moment.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {SEIYA_MOMENTS as M, momentPhase, momentCosmos, POSE, poseAt, handAt, MINT_WINDOW, mintCrossAt, mintClockAt, mintSpeedAt} from './warm-sphere.js';
import {DRAWN_FRAME} from './dl-paywall.js';
import {PULL, FORM, formAt} from '../lab/rite-unit1s.js';
import {FOLD, HEX, FIT} from '../lab/cubism.mjs';

// THE POSE IS THE FILM'S (his Oct 14 2026 22:1x WEST: "every single fucking time i log in there is a new different position")
test('her cut finds the sphere at the fit\'s own pose at every load: three turns a loop, the seam no jump, the tightest join\'s face', () => {
  assert.equal(POSE.at, FOLD.start, 'her cut');
  assert.equal(POSE.back, HEX.whole, 'the sphere whole again');
  assert.equal(POSE.pitch, FIT.pitch);
  assert.deepEqual(poseAt(POSE.at), {yaw: POSE.yaw, pitch: POSE.pitch});
  const tightest = Object.values(FIT.classes).sort((a, b) => a.join.gap - b.join.gap)[0];
  assert.ok(Math.abs(POSE.yaw - tightest.yawDeg * Math.PI / 180) < 1e-12, `the class of the tightest join (${tightest.face} at yaw ${tightest.yawDeg} deg, gap ${tightest.join.gap} px)`);
  const turn = poseAt(POSE.loop).yaw - poseAt(0).yaw;
  assert.ok(Math.abs(turn - 3 * 2 * Math.PI) < 1e-9, 'three whole turns a loop: the loop lands on the same pose');
  assert.ok(poseAt(10).yaw < poseAt(10.1).yaw, 'turning the way the page turned');
  assert.ok(Math.abs((POSE.turns * 2 * Math.PI / POSE.loop) - 0.12) < 0.005, 'at about the page\'s own rate (0.12 rad a second)');
  assert.deepEqual(poseAt(NaN), {yaw: POSE.yaw, pitch: POSE.pitch});
});

test('what the hand added is kept until 2.5 s before her cut, eased to nothing at it, nothing through the fold, all once the sphere is whole', () => {
  assert.equal(handAt(0), 1); assert.equal(handAt(POSE.at - POSE.settle), 1);
  const mid = handAt(POSE.at - POSE.settle / 2);
  assert.ok(mid > 0.4 && mid < 0.6, `half way ${mid.toFixed(3)}`);
  assert.ok(handAt(POSE.at - 0.01) < 0.001);
  assert.equal(handAt(POSE.at), 0); assert.equal(handAt(33), 0); assert.equal(handAt(POSE.back - 0.01), 0);
  assert.equal(handAt(POSE.back), 1); assert.equal(handAt(100), 1); assert.equal(handAt(NaN), 1);
});

test('the twelve chairs hold through everything before the meteors: the opening, the gold cloth, the cry, the shout, the flash', () => {
  for (const t of [0, 0.25, 4, 33, 78.5, 87, 100.25, 103, 104.25, 106.5, 106.99]) assert.equal(momentPhase(t), 0, `phase at ${t} s`);
});

test('the society arrives with the meteors, from the burst at 107 s to the hit at 112 s, and only grows', () => {
  assert.equal(momentPhase(M.meteors), 4);   // the illustration's first arrival
  let last = 0;
  for (let t = M.meteors; t < M.impact; t += 0.05) { const p = momentPhase(t); assert.ok(p >= last && p < 28, `phase ${p} at ${t.toFixed(2)} s`); last = p; }
  assert.equal(momentPhase(M.impact), 28);   // the whole network
});

test('the network holds through the arrow of justice, and folds to the twelve under the end card, so the loop opens on them', () => {
  for (const t of [112, 124.25, 129, 145.59]) assert.equal(momentPhase(t), 28, `phase at ${t} s`);
  for (const t of [145.598, 148, 152.4]) assert.equal(momentPhase(t), 0, `phase at ${t} s`);
});

// THE CUT (dl-twelve.js, his Oct 21 2026 "please remove the 2nd repetition when he is about to shoot the arrow")
test('THE GRACE: from the strike\'s fold home the vessel is the twelve again, then grows three rungs on his rite with the bow, the last as he draws', () => {
  const F = 1001 / 30000;
  assert.deepEqual([M.fold, M.bow, M.star, M.draw].map((t) => Math.round(t / F)), [3455, 3488, 3517, 3540], 'the film\'s own frames');
  for (const t of [112, 114, M.fold - 1e-3]) assert.equal(momentPhase(t), 28, `the network at ${t} s`);
  for (const t of [M.fold, 116, M.bow - 1e-3]) assert.equal(momentPhase(t), 0, `the twelve at ${t} s`);
  // the illustration's own bands: 11 an arrival (20 places), 21 the society (80), 28 the network (150)
  assert.equal(momentPhase(M.bow), 11); assert.equal(momentPhase(M.star - 1e-3), 11);
  assert.equal(momentPhase(M.star), 21); assert.equal(momentPhase(M.draw - 1e-3), 21);
  assert.equal(momentPhase(M.draw), 28);
  let last = 0;
  for (let t = M.fold; t < M.draw + 2; t += 0.01) { const p = momentPhase(t); assert.ok(p >= last, `only grows (${t.toFixed(2)} s)`); last = p; }
  assert.ok(M.draw < 3616 * F, 'every rung begun before the arrow is fully drawn');
});

test('THE CUT: before his second aim the sphere turns as it did in the uncut film; through the cut it never jumps; three turns still close the loop', () => {
  const uncut = (t) => POSE.yaw + (POSE.turns * 2 * Math.PI / POSE.uncut) * (t - POSE.at);
  for (const t of [0, 29.563, 46, 80.75, 104.74, 118.12, POSE.cut]) assert.ok(Math.abs(poseAt(t).yaw - uncut(t)) < 1e-12, `the uncut pose at ${t} s`);
  assert.ok(Math.abs(poseAt(POSE.cut + 1e-6).yaw - poseAt(POSE.cut).yaw) < 1e-6, 'no jump at the cut');
  const after = (poseAt(140).yaw - poseAt(130).yaw) / 10, before = (poseAt(120).yaw - poseAt(110).yaw) / 10;
  assert.ok(after > before && after / before < 1.1, `a little faster after the cut (${(after / before).toFixed(3)})`);
  assert.ok(Math.abs(poseAt(POSE.loop).yaw - poseAt(0).yaw - POSE.turns * 2 * Math.PI) < 1e-9);
  assert.ok(Math.abs(POSE.cut - 3825 * 1001 / 30000) < 1e-12 && POSE.loop < POSE.uncut);
  assert.ok(Math.abs(M.credits - (147.5 - 57 * 1001 / 30000)) < 1e-3, 'the end card 57 frames earlier');
});

test('the cosmos burns from "Burn, my cosmos!" to the flash, holds through the meteors, and is out two seconds after the hit', () => {
  assert.equal(momentCosmos(100.24), 0);
  assert.equal(momentCosmos(M.cosmos), 0);
  assert.ok(momentCosmos(103) > 0 && momentCosmos(103) < 1);
  assert.equal(momentCosmos(M.flash), 1);
  assert.equal(momentCosmos(109), 1);
  assert.ok(momentCosmos(113) > 0 && momentCosmos(113) < 1);
  assert.equal(momentCosmos(M.impact + 2), 0);
  assert.equal(momentCosmos(0), 0);
});

test('a second that is not a number moves nothing', () => {
  for (const t of [NaN, undefined, null, Infinity]) { assert.equal(momentPhase(t), 0); assert.equal(momentCosmos(t), 0); }
});

// THE MINT WINDOW (his Oct 21 2026 WEST, over a crossing run once the film had stopped: "you stop all and when all is stopped you make the
// image bigger? ... no smooth interpolation")
test('THE MINT WINDOW: one move on the film\'s seconds: the crossing and the sphere\'s rest land together on the drawn arrow, nothing after it', () => {
  const S = 1001 / 30000, from = MINT_WINDOW.from * S, arrow = MINT_WINDOW.frame * S;
  assert.equal(MINT_WINDOW.frame, DRAWN_FRAME, 'on the wall\'s own frame');
  assert.ok(Math.abs(from - M.draw) < S && Math.abs(from - PULL.at) < 1e-9, 'it opens as he draws (THE PULL\'s cue)');
  // the crossing: nothing before the draw, all of it on the arrow, eased in and out, never back, no jump
  assert.equal(mintCrossAt(from - 1, 'ahead'), 0); assert.equal(mintCrossAt(from, 'ahead'), 0);
  assert.equal(mintCrossAt(arrow, 'ahead'), 1); assert.equal(mintCrossAt(arrow + 9, 'ahead'), 1);
  let last = 0, steepest = 0;
  for (let t = from; t <= arrow; t += 1e-3) { const k = mintCrossAt(t, 'ahead'); assert.ok(k >= last - 1e-12, 'never back'); steepest = Math.max(steepest, k - last); last = k; }
  assert.ok(steepest < 2e-3, `no jump: ${(steepest * 100).toFixed(3)} % a millisecond at most`);
  assert.ok(mintCrossAt(from + .05, 'ahead') < 1e-3 && mintCrossAt(arrow - .05, 'ahead') > .999, 'eased in, and landing at rest on the arrow');
  // the sphere's own second: the film's until `settle` before the arrow, then slower, at rest on it; the formation whole there
  assert.equal(mintClockAt(100, 'ahead'), 100); assert.equal(mintClockAt(arrow - MINT_WINDOW.settle, 'ahead'), arrow - MINT_WINDOW.settle);
  const rest = mintClockAt(arrow, 'ahead');
  assert.ok(Math.abs(rest - (arrow - MINT_WINDOW.settle * 11 / 35)) < 1e-12);
  assert.equal(mintClockAt(arrow + 5, 'ahead'), rest, 'held: at rest');
  const lastCaught = PULL.at + PULL.fall[0] + PULL.fall[1];   // the latest a swarm can be caught on its hex
  assert.ok(formAt(lastCaught, rest) > .99, `the formation whole at rest (${formAt(lastCaught, rest).toFixed(4)}; its own end ${(lastCaught + FORM.after + FORM.over).toFixed(3)} s)`);
  // its speed: the film's, falling to nothing on the arrow, as its second runs; the page's own clock runs with it
  for (let t = arrow - MINT_WINDOW.settle - .1; t < arrow; t += .01) {
    const v = (mintClockAt(t + 1e-6, 'ahead') - mintClockAt(t - 1e-6, 'ahead')) / 2e-6;
    assert.ok(Math.abs(v - mintSpeedAt(t, 'ahead')) < 1e-4, `${t.toFixed(3)} s: ${v} against ${mintSpeedAt(t, 'ahead')}`);
  }
  assert.equal(mintSpeedAt(arrow - MINT_WINDOW.settle, 'ahead'), 1); assert.equal(mintSpeedAt(arrow, 'ahead'), 0);
  const frameBefore = mintSpeedAt(arrow - S, 'ahead');
  assert.ok(frameBefore > 0 && frameBefore < .03, `a frame before the arrow it still moves, barely (${frameBefore.toFixed(4)})`);
  // the way back once the window is over: from where it rested into the film's second over `back`, the crossing undone over the same
  const held = (DRAWN_FRAME + .5) * S, end = arrow + MINT_WINDOW.back;
  assert.ok(Math.abs(mintClockAt(held, 'leaving') - rest) < S, 'from its rest: no jump');
  assert.ok(Math.abs(mintClockAt(end, 'leaving') - end) < 1e-12); assert.equal(mintClockAt(arrow - 1, 'leaving'), arrow - 1);
  assert.ok(mintCrossAt(held, 'leaving') > .999); assert.ok(mintCrossAt(end, 'leaving') < 1e-12);
  let prev = mintClockAt(held, 'leaving');
  for (let t = held; t <= end; t += 1e-3) { const c = mintClockAt(t, 'leaving'); assert.ok(c >= prev - 1e-12, 'never back'); prev = c; }
  // none (a holder, the mint closed): the film's own second, no crossing
  assert.equal(mintClockAt(119.3, null), 119.3); assert.equal(mintCrossAt(119.3, null), 0); assert.equal(mintSpeedAt(119.3, null), 1);
  assert.equal(mintCrossAt(NaN, 'ahead'), 0); assert.ok(Number.isNaN(mintClockAt(NaN, 'ahead'))); assert.equal(mintSpeedAt(NaN, 'ahead'), 1);
});

// THE CAMERA (his Oct 30 2026 "start becoming kogima dude fucking use camera cuts and 3d real-time engines... the code we had built for the place there"): a camera over
// the sphere's own projection, identity at rest, a cut or an eased dolly, a drift that keeps it floating; its turn added to the pose for a draw alone
test('the camera: identity at rest, a cut or a dolly over the sphere\'s own projection, its turn never written into the pose', async () => {
  const src = (await import('node:fs')).readFileSync(new URL('./warm-sphere.js', import.meta.url), 'utf8');
  assert.match(src, /const CAM_REST = Object\.freeze\(\{zoom: 1, x: 0, y: 0, yaw: 0, pitch: 0, drift: 0\}\);/, 'identity at rest');
  assert.match(src, /const center = \[width \* \(SPHERE_X \+ cam\.x\), height \* \(\.5 \+ cam\.y\)\];/); assert.match(src, /\* drawnSize \* cam\.zoom;/);
  assert.match(src, /if \(cam\.yaw === 0 && cam\.pitch === 0\) \{ drawScene\(\); return; \}/, 'no turn: the draw as it was');
  assert.match(src, /try \{ drawScene\(\); \} finally \{ yaw = yawRest; pitch = pitchRest; \}/, 'its turn for the draw alone, the film\'s and the hand\'s pose kept');
  assert.match(src, /if \(camTo \|\| cam\.drift\) camRaf = requestAnimationFrame\(camStep\); else camLast = 0;/, 'a frame a frame only while it eases or drifts');
  assert.match(src, /if \(camRaf\) cancelAnimationFrame\(camRaf\);/, 'let go with the sphere');
});

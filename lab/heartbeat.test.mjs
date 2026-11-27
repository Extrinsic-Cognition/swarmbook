// heartbeat.test.mjs: THE HEARTBEAT and THE TRACE (lab/heartbeat.js, his words in its header: "a synced heart beat rythim natural like
// accelerated there like fucking resident evil games"; "to the lyssajudrean orbits eh... not else... the dodecahedron getting bigger";
// "make each of them a fucking line like ecg dude"). Run: node --test lab/heartbeat.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {HEART, BEATS, TRACE, frameTime, bpmAt, phaseAt, heartAt, ecgAt, ecgTrail, mountHeartbeat} from './heartbeat.js';
import {KO} from './ko-edge.js';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const T0 = frameTime(HEART.from), T1 = frameTime(HEART.to);

test('the window is the KO edge\'s, the hit to the beam, and the first beat lands on the hit\'s frame', () => {
  assert.equal(HEART.from, KO.frames.hit); assert.equal(HEART.to, KO.frames.healed);
  assert.deepEqual([HEART.from, HEART.to], [540, 1096]);
  assert.equal(heartAt(T0 - 0.05).on, false, 'a frame before the hit: nothing');
  const first = heartAt(T0 + HEART.thump);
  assert.equal(first.on, true); assert.equal(first.beat, 0);
  assert.ok(first.pulse > 0.5, `the first beat sounds on the hit (pulse ${first.pulse.toFixed(2)})`);
  assert.equal(BEATS[0].t, T0);
  assert.equal(heartAt(T1 + HEART.exhale + 0.01).on, false, 'after the breath out: nothing');
  assert.equal(heartAt(NaN).on, false);
});

test('the heart races: 72 a minute at the hit to 156 at the beam, the gaps shortening', () => {
  assert.equal(bpmAt(T0), 72); assert.equal(Math.round(bpmAt(T1)), 156);
  assert.ok(bpmAt((T0 + T1) / 2) < (72 + 156) / 2, 'climbing slowly first, then racing');
  const gaps = BEATS.slice(1).map((b, i) => b.t - BEATS[i].t);
  assert.ok(Math.abs(gaps[0] - 60 / 72) < 0.02, `the first gap is a 72 bpm one (${gaps[0].toFixed(3)} s)`);
  assert.ok(gaps.at(-1) > 0.36 && gaps.at(-1) < 0.42, `the last gap is a 150 bpm one (${gaps.at(-1).toFixed(3)} s)`);
  for (let i = 1; i < gaps.length; i++) assert.ok(gaps[i] <= gaps[i - 1] + 1e-9, `gap ${i} is shorter than the one before`);
  assert.equal(BEATS.length, Math.ceil(phaseAt(T1)));
  assert.ok(BEATS.length >= 30 && BEATS.length <= 36, `${BEATS.length} beats over 18.5 s`);
});

test('each beat is a lub-dub: two sounds, the second weaker, a systole apart; stronger as the danger grows', () => {
  const {t, period} = BEATS[3], dub = HEART.systole * Math.sqrt(period);
  const lub = heartAt(t + HEART.thump).pulse, second = heartAt(t + dub + HEART.thump).pulse, between = heartAt(t + dub / 2).pulse;
  assert.ok(lub > second && second > between, `lub ${lub.toFixed(2)} > dub ${second.toFixed(2)} > between ${between.toFixed(2)}`);
  assert.ok(Math.abs(second / lub - HEART.dub) < 0.08, 'the dub is 0.55 of the lub');
  assert.ok(heartAt(BEATS.at(-2).t + HEART.thump).pulse > lub, 'a late lub is stronger than an early one');
});

test('what it moves: the orbits\' reach and the sphere\'s size, bounded; a third larger by the beam and let go after it', () => {
  let maxLoop = 0, maxSize = 0, minSize = 9;
  for (let t = T0; t < T1 + HEART.exhale; t += 0.01) { const h = heartAt(t); maxLoop = Math.max(maxLoop, h.loop); maxSize = Math.max(maxSize, h.size); minSize = Math.min(minSize, h.size); }
  assert.ok(maxLoop <= 1 + HEART.loop + 1e-9 && maxLoop > 1.05, `the orbits reach up to ${maxLoop.toFixed(3)}`);
  assert.ok(maxSize <= (1 + HEART.swell) * (1 + HEART.size) + 1e-9, `the sphere up to ${maxSize.toFixed(3)}`);
  assert.ok(minSize >= 1, 'never smaller than itself');
  const beam = heartAt(T1 - 0.2).size;
  assert.ok(beam > 1.3 && beam <= 1.374, `a third larger at the beam (${beam.toFixed(3)})`);
  const out = heartAt(T1 + 0.01);
  assert.ok(out.size > 1.3 && out.pulse === 0 && out.trace === null, 'the beam: the breath out starts, no beat, no trace');
  assert.ok(heartAt(T1 + HEART.exhale - 0.01).size < 1.01, 'back at its own size');
});

test('THE TRACE: PQRST on each beat, the R spike 1, travelling down the strip, the waves closer as the heart races', () => {
  const {t} = BEATS[5];
  assert.ok(Math.abs(ecgAt(t) - 1) < 0.02, 'the R spike on the beat');
  const p = ecgAt(t - 0.16);
  assert.ok(p > 0.1 && p < 0.2, `the P bump before (${p.toFixed(3)})`);
  assert.ok(ecgAt(t + 0.04) < -0.1, 'the S dip after');
  assert.ok(ecgAt(t + 0.24) > 0.25, 'the T bump');
  assert.equal(ecgAt(T0 - 1), 0); assert.equal(ecgAt(T1 + 0.1), 0);
  const strip = ecgTrail(t);
  assert.equal(strip.length, TRACE.steps);
  assert.ok(Math.abs(strip[0] - 1) < 0.02, 'the head of the strip is now: the spike');
  const dt = TRACE.seconds / (TRACE.steps - 1), k = Math.round(0.5 / dt), later = ecgTrail(t + 0.5);
  assert.ok(Math.abs(later[k] - strip[0]) < 0.05, `half a second later the spike is ${k} samples down the strip`);
  const late = BEATS.at(-3).t;
  let best = 0.1, top = -9;
  for (let x = 0.1; x <= 0.3; x += 0.005) { const v = ecgAt(late + x); if (v > top) { top = v; best = x; } }
  assert.ok(best < 0.2, `the T bump ${best.toFixed(3)} s after a late R, nearer than the 0.24 s of a slow heart`);
  assert.equal(heartAt(T0 - 1).trace, null); assert.ok(heartAt(t).trace instanceof Float32Array);
  assert.equal(heartAt(t).trace.length, TRACE.steps);
});

test('the strip is drawn, not stepped over: four samples a step, the R spike wider than two samples, and one walk as cheap as asked', () => {
  assert.equal(TRACE.steps, 257);
  const dt = TRACE.seconds / (TRACE.steps - 1), rWidth = TRACE.waves[2][1];
  assert.ok(4 * rWidth > 2 * dt, `the R spike spans ${(4 * rWidth / dt).toFixed(1)} samples`);
  for (const b of [BEATS[4], BEATS.at(-4)]) {
    let best = 0; const strip = ecgTrail(b.t + 0.4);
    for (const v of strip) best = Math.max(best, v);
    assert.ok(best > 0.9, `a beat 0.4 s back still shows its spike in the strip (${best.toFixed(2)})`);
  }
  for (let t = T0 + 0.3; t < T1; t += 0.77) {
    const strip = ecgTrail(t), n = strip.length - 1;
    for (let i = 0; i <= n; i += 16) assert.ok(Math.abs(strip[i] - ecgAt(t - (i / n) * TRACE.seconds)) < 1e-3, `the walk agrees with ecgAt (its tails past four widths cut) at ${t.toFixed(2)} s, sample ${i}`);
  }
  // the cost: 44 us a strip warmed up and alone (Oct 14 2026 22:5x WEST, load 9); a bound loose enough for a loaded Mac running the suite in parallel
  const out = new Float32Array(TRACE.steps);
  for (let i = 0; i < 300; i++) ecgTrail(T0 + (i % 180) / 10, HEART, out);
  // the best of eight batches: a loaded Mac only ever adds time, so the fastest batch is the strip's own cost
  let each = Infinity;
  for (let batch = 0; batch < 8; batch++) {
    const t0 = performance.now();
    for (let i = 0; i < 250; i++) ecgTrail(T0 + (i % 180) / 10, HEART, out);
    each = Math.min(each, (performance.now() - t0) / 250);
  }
  assert.ok(each < 1, `${each.toFixed(3)} ms a strip, the best batch`);
});

test('reduced motion: the sphere at its size, no beat, no trace', () => {
  const h = heartAt(BEATS[2].t, HEART, {reduced: true});
  assert.deepEqual([h.on, h.pulse, h.loop, h.size, h.trace], [true, 0, 1, 1, null]);
});

test('the mount gives the sphere the heart once it exists, asked at the film\'s second, and destroy takes it back', () => {
  const listeners = {};
  const film = {currentTime: BEATS[1].t + 0.02,
    addEventListener: (type, fn) => { (listeners[type] ||= new Set()).add(fn); }, removeEventListener: (type, fn) => { listeners[type]?.delete(fn); }};
  const view = {matchMedia: () => ({matches: false})};
  const heart = mountHeartbeat({film, view});
  assert.equal(heart.stats.given, false, 'no sphere yet');
  let given = null; view.genesisSphere = {setPulse: (fn) => { given = fn; }};
  for (const fn of listeners.play) fn();
  assert.equal(heart.stats.given, true);
  assert.equal(listeners.play.size + listeners.timeupdate.size + listeners.seeked.size, 0, 'nothing is listened to any more');
  const beat = given();
  assert.equal(beat.on, true); assert.equal(beat.beat, 1); assert.equal(heart.stats.asked, 1);
  assert.equal(heart.at(BEATS[1].t + 0.02).beat, 1);
  heart.destroy();
  assert.equal(given, null, 'the sphere is given nothing');
});

test('the sphere takes the heart through setPulse and draws the trace, the hero mounts it after the raid, a new cut is a new URL', () => {
  const sphere = readFileSync(here('../app/warm-sphere.js'), 'utf8');
  assert.match(sphere, /setPulse\(fn\) \{ pulse = typeof fn === 'function' \? fn : null; requestFrame\(\); \}/);
  assert.match(sphere, /beat = pulse\(\);/);
  assert.match(sphere, /beatTrace = beat\?\.trace/);
  // the strips' places are the frame's (jsFrame.trace, the twin of house/embertide-mint's trace; Oct 15 2026), read off one buffer at the draw
  assert.match(sphere, /const len = Math\.hypot\(dx, dy\) \|\| 1, v = \(beat\[j\] \|\| 0\) \* radius \* TRACE_REACH;/, 'each sample moved across the line by the strip');
  assert.match(sphere, /if \(beatTrace && traceBuf\) for \(let chair = 0; chair < 12; chair\+\+\) traceOrbit\(chair, colors\[chair % 4\], front\);/, 'the orbits are strips while the heart beats');
  assert.match(sphere, /\* loopReach;/, 'the orbits swell with the sphere');
  const hero = readFileSync(here('./hero-mount.js'), 'utf8');   // the hero's mount, the page's own since lane/one-page
  assert.match(hero, /import \{mountHeartbeat\} from '\.\/heartbeat\.js';/);
  assert.match(hero, /mountAntiSatellites\(\{[^\n]*\n\s*mountHeartbeat\(\{film: found\.film, view: found\.stage\.ownerDocument\.defaultView\}\);/);
  assert.match(readFileSync(here('../app/warm.js'), 'utf8'), /warm-sphere\.js\?v=mint-3/);
  assert.match(readFileSync(here('../app/warm-entry.mjs'), 'utf8'), /warm\.js\?v=mint-3/);
});

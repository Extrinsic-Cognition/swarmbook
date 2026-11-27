import test from 'node:test';
import assert from 'node:assert/strict';
import {CINEMATIC, SAGITTARIUS_END, TAIL_FRAMES, ANIME_TAIL, tailEase, cinematicScore} from './mint-cinematic-score.mjs';
import {scoreAt} from './satellites-score.js';

test('the source camera starts on Athena and rejoins the anime after 2.8 seconds', () => {
  assert.equal(CINEMATIC.start, 37.08705);
  assert.equal(CINEMATIC.duration, 2.8);
  assert.ok(Math.abs(CINEMATIC.start + CINEMATIC.duration - 39.88705) < 1e-8);
  const start = cinematicScore(0);
  assert.equal(start.spatial, 0);
  assert.equal(start.exit, 0);
  assert.deepEqual(start.pan, [0, 0]);
  assert.equal(start.zoom, 1);
  assert.deepEqual(cinematicScore(-1), start);
});

test('the held source drawing has a bounded moving camera without a native armor phase', () => {
  const middle = cinematicScore(1.4);
  assert.ok(middle.spatial > 0);
  assert.ok(Math.hypot(...middle.pan) > 0);
  for (let t = 0; t <= CINEMATIC.duration; t += 1 / 60) {
    const score = cinematicScore(t);
    assert.deepEqual(Object.keys(score).sort(), ['exit', 'pan', 'spatial', 'zoom']);
    assert.ok(Object.values(score).flat().every(Number.isFinite));
    assert.ok(score.spatial >= 0 && score.spatial <= 1);
    assert.ok(score.exit >= 0 && score.exit <= 1);
    assert.equal(score.pan.length, 2);
    assert.ok(Math.abs(score.pan[0]) <= .02 && Math.abs(score.pan[1]) <= .02);
    assert.ok(score.zoom >= 1 && score.zoom <= 1.25);
  }
});

test('the finite source replacement exits before the original Sagittarius transformation', () => {
  assert.ok(CINEMATIC.start + CINEMATIC.duration < 42.342);
  assert.equal(cinematicScore(CINEMATIC.duration).exit, 1);
  assert.deepEqual(cinematicScore(1000), cinematicScore(CINEMATIC.duration));
});

test('fullscreen anime includes the complete source descent and Dolbar\'s shot after it before returning the mask (his Oct 21 2026 "i dont want to see dolbar in the dodecahedron")', () => {
  assert.equal(SAGITTARIUS_END, 2307 * 1001 / 30000);
  assert.ok(SAGITTARIUS_END > 76.9 && SAGITTARIUS_END < 77, 'the cut to the rite, 76.977 s');
});

test('the tail (his Oct 21 2026 "time the transition to the frame perfectly and add some ease-in/out"): from the cut\'s frame to the soundtrack\'s beat after it, whole frames, eased in and out', () => {
  assert.equal(TAIL_FRAMES, 19, 'from frame 2307 to the bass\'s hit at frame 2326');
  assert.equal(ANIME_TAIL, 19 * 1001 / 30000);
  const beatOf = (n) => scoreAt(n * 1001 / 30000).beat;
  for (let n = 2308; n <= 2337; n++) if (n !== 2326) assert.ok(beatOf(n) <= beatOf(2326), `frame ${n} beats harder than the tail's landing`);
  assert.ok(beatOf(2326) > .5, 'a strong beat');
  assert.equal(tailEase(SAGITTARIUS_END - .01), 0); assert.equal(tailEase(SAGITTARIUS_END), 0);
  assert.equal(tailEase(SAGITTARIUS_END + ANIME_TAIL), 1); assert.equal(tailEase(SAGITTARIUS_END + ANIME_TAIL + 1), 1);
  let was = 0;
  for (let i = 1; i <= 100; i++) { const k = tailEase(SAGITTARIUS_END + ANIME_TAIL * i / 100); assert.ok(k >= was, 'never back'); was = k; }
  // ease in and out: no speed at either end (a frame in moves it under 2 %), the fastest in the middle
  const frame = 1001 / 30000;
  assert.ok(tailEase(SAGITTARIUS_END + frame) < .02 && 1 - tailEase(SAGITTARIUS_END + ANIME_TAIL - frame) < .02);
  assert.ok(Math.abs(tailEase(SAGITTARIUS_END + ANIME_TAIL / 2) - .5) < 1e-12);
});

test('pause and re-sampling never accumulate camera drift', () => {
  const before = cinematicScore(1.2);
  for (const t of [2.7, 0, 1.8, .3, 2.8, 1.2]) cinematicScore(t);
  assert.deepEqual(cinematicScore(1.2), before);
});

// line-of-time.test.mjs: his tags on the mint's film keep their words through the Nest (line-of-time.mjs). node --test line-of-time.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {shape, at, clock, merge, frameStep, ticks, guessesIn} from './line-of-time.mjs';

const tag = (id, t, text, edited = 1) => ({id, t, text, made: 1, edited});

test('a tag lands inside the film, to the millisecond', () => {
  assert.equal(at(107.04049, 154.311), 107.04);
  assert.equal(at(-3, 154.311), 0);
  assert.equal(at(200, 154.311), 154.311);
  assert.equal(at(undefined, 154.311), 0);
});

test('the clock reads minutes, seconds and hundredths, and never says 60 seconds', () => {
  assert.equal(clock(0), '0:00.00');
  assert.equal(clock(107.04), '1:47.04');
  assert.equal(clock(59.999), '1:00.00');
  assert.equal(clock(154.311), '2:34.31');
});

test('the value on the Nest holds the cut, the length and five fields a tag', () => {
  const v = shape([{...tag('a', 1.5, 'x'), extra: true}], {v: '53561d47', duration: 154.3110004});
  assert.deepEqual(v, {film: 'app/saint-seiya.mp4', v: '53561d47', duration: 154.311, tags: [{id: 'a', t: 1.5, text: 'x', made: 1, edited: 1}]});
});

test('two copies merge: each tag once, the later edit wins either way, by time', () => {
  const mine = [tag('a', 10, 'mine newer', 5), tag('b', 3, 'mine older', 1), tag('c', 7, 'only mine')];
  const theirs = [tag('a', 10, 'theirs older', 4), tag('b', 3, 'theirs newer', 2), tag('d', 1, 'only theirs')];
  assert.deepEqual(merge(mine, theirs).map(x => [x.id, x.text]), [['d', 'only theirs'], ['b', 'theirs newer'], ['c', 'only mine'], ['a', 'mine newer']]);
});

test('a tag deleted on this page stays deleted, whatever the Nest still holds', () => {
  assert.deepEqual(merge([tag('a', 1, 'x')], [tag('a', 1, 'x'), tag('b', 2, 'y')], new Set(['a'])).map(x => x.id), ['b']);
});

test('a malformed tag from either side is left out, never thrown on', () => {
  assert.deepEqual(merge([null, {id: 3, t: 1}], [{id: 'x'}, tag('ok', 1, 'fine')]).map(x => x.id), ['ok']);
});

test('a frame step moves one frame of 29.97 and stays inside the film', () => {
  const fps = 30000 / 1001;
  const k = Math.round(107.04 * fps);
  assert.equal(Math.round(frameStep(107.04, 1, fps, 154.311) * fps), k + 1);
  assert.equal(Math.round(frameStep(107.04, -1, fps, 154.311) * fps), k - 1);
  assert.equal(frameStep(0, -1, fps, 154.311), 0);
  assert.equal(frameStep(154.311, 1, fps, 154.311), 154.311);
});

test('the detail lane keeps its labels 70 px apart and its ticks 8 px apart', () => {
  for (const [span, width] of [[12, 1200], [2, 600], [60, 360], [40, 1800]]) {
    const {minor, label} = ticks(span, width), pps = width / span;
    assert.ok(minor * pps >= 8 || minor === 60, `minor ${minor} at ${span} s over ${width} px`);
    assert.ok(label * pps >= 70 || label === 60, `label ${label} at ${span} s over ${width} px`);
  }
});

test('the seat\'s guess is read from the hero\'s own text, and is none once it is gone', () => {
  const src = 'export const SEIYA_MOMENTS = Object.freeze({cosmos: 100.25, flash: 106.5, meteors: 107, impact: 112, credits: 147.5});';
  assert.deepEqual(guessesIn(src).map(g => [g.t, g.what]), [[100.25, 'gold burn begins'], [106.5, 'burn full'], [107, 'growth begins'], [112, 'whole network'], [147.5, 'back to the twelve']]);
  assert.deepEqual(guessesIn('export const nothing = 1;'), []);
  assert.deepEqual(guessesIn(undefined), []);
});

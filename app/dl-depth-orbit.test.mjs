import test from 'node:test';
import assert from 'node:assert/strict';
import {orbitAt, steeringOf, musicAt, ORBIT, NEUTRAL} from './dl-depth-orbit.js';

const quiet = () => ({energy: 0, pulse: 0, turn: 0, lean: 0});
const strong = () => ({energy: 1, pulse: 1, turn: 1, lean: .02});

test('the orbit is deterministic from the film second and soundtrack score', () => {
  assert.deepEqual(orbitAt(63.4), orbitAt(63.4));
  assert.deepEqual(orbitAt(65, steeringOf(.7, -.4)), orbitAt(65, steeringOf(.7, -.4)));
  assert.notDeepEqual(orbitAt(63.4).eye, orbitAt(64.1).eye, 'film time alone advances the path');
  assert.notDeepEqual(orbitAt(63.4, NEUTRAL, quiet).eye, orbitAt(63.4, NEUTRAL, strong).eye, 'score shapes the same film phase');
  assert.deepEqual(orbitAt(63.4).score, musicAt(63.4));
});

test('every tilted and steered path remains within shallow depth excursions', () => {
  for (const controls of [NEUTRAL, steeringOf(-1, -1), steeringOf(1, 1), steeringOf(1, -1)]) {
    for (let t = ORBIT.start; t <= ORBIT.end; t += .04) {
      for (const score of [musicAt, strong]) {
        const {eye} = orbitAt(t, controls, score);
        assert.ok(Math.abs(eye[0]) <= ORBIT.maxX + 1e-12, `x at ${t}`);
        assert.ok(Math.abs(eye[1]) <= ORBIT.maxY + 1e-12, `y at ${t}`);
        assert.ok(Math.abs(eye[2] - ORBIT.restZ) <= ORBIT.maxZ + 1e-12, `z at ${t}`);
      }
    }
  }
});

test('mouse steering changes path parameters without moving its centre toward the cursor', () => {
  const left = orbitAt(64.3, steeringOf(-1, .7)), right = orbitAt(64.3, steeringOf(1, -.7));
  assert.deepEqual(left.centre, [0, 0, .55]);
  assert.deepEqual(right.centre, left.centre);
  assert.notEqual(left.phase, right.phase);
  assert.notEqual(left.tilt, right.tilt);
  assert.notDeepEqual(left.eye, right.eye);
  assert.deepEqual(steeringOf(8, -5), steeringOf(1, -1), 'input is bounded');
});

test('the orbital window enters and leaves continuously at rest', () => {
  for (const t of [NaN, ORBIT.start - .1, ORBIT.start, ORBIT.end, ORBIT.end + .1]) {
    assert.deepEqual(orbitAt(t).eye, [0, 0, .55]);
    assert.equal(orbitAt(t).envelope, 0);
  }
  const before = orbitAt(ORBIT.start + .001), after = orbitAt(ORBIT.end - .001);
  assert.ok(Math.hypot(before.eye[0], before.eye[1], before.eye[2] - .55) < 1e-6);
  assert.ok(Math.hypot(after.eye[0], after.eye[1], after.eye[2] - .55) < 1e-6);
  assert.equal(orbitAt(64).envelope, 1);
});

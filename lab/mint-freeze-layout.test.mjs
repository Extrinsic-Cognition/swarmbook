import test from 'node:test';
import assert from 'node:assert/strict';
import {FREEZE, HOLD, freezeLayout, holdWeights, easeInOut, pictureViewport} from './mint-freeze-layout.mjs';

test('freeze uses the last complete frame before the payment stop', () => {
  assert.equal(FREEZE.frame, 1111);
  assert.ok(FREEZE.second >= 1111 * 1001 / 30000 && FREEZE.second < 1112 * 1001 / 30000);
});

test('the complete active picture fits the viewport without counting encoded black borders', () => {
  const {width: sourceWidth, height: sourceHeight, content: [x, y, w, h]} = FREEZE.picture;
  for (const [width, height] of [[1616, 1116], [1280, 720], [2560, 1080], [390, 844], [796, 534]]) {
    const rect = pictureViewport(width, height), scale = rect.width / sourceWidth;
    const left = rect.left + x * scale, top = rect.top + y * scale;
    const right = left + w * scale, bottom = top + h * scale;
    const epsilon = 1e-8;
    assert.ok(Math.abs(rect.height / sourceHeight - scale) < epsilon, 'No aspect distortion');
    assert.ok(left >= -epsilon && top >= -epsilon && right <= width + epsilon && bottom <= height + epsilon, 'No cropped artwork');
    assert.ok(Math.abs(left + right - width) < epsilon && Math.abs(top + bottom - height) < epsilon, 'Active picture is centered');
    assert.ok(Math.abs(right - left - width) < epsilon || Math.abs(bottom - top - height) < epsilon, 'Picture uses all available width or height');
  }
  assert.deepEqual(pictureViewport(796, 534), {left: -82, top: -3, width: 960, height: 540});
});
test('native scale establishes fighter depth while image observations remain registered', () => {
  const fit = freezeLayout();
  for (const [point, pixel] of [[FREEZE.athena.head, FREEZE.athena.pixel], [fit.seiya, FREEZE.seiya.feet], [fit.column, FREEZE.column.foot]]) {
    fit.project(point).forEach((v, i) => assert.ok(Math.abs(v - pixel[i]) < 1e-8));
  }
  const top = fit.project(fit.seiya.map((v, i) => v + (i === 1 ? FREEZE.seiya.height : 0)));
  assert.ok(Math.abs(top[1] - FREEZE.seiya.top[1]) < 1e-8);
  // Horizontal mismatch is retained, not hidden by distorting the native mesh.
  assert.ok(Math.abs(top[0] - FREEZE.seiya.top[0]) < 30);
  assert.equal(fit.column[1], fit.floor);
});

test('the source drawing and native Athena replace each other for push, pan and turn', () => {
  const fit = freezeLayout(), ref = fit.reference;
  const at = holdWeights(ref, ref);
  assert.equal(at.reveal, 0); assert.equal(at.hair, 1); assert.equal(at.travel, 0);
  // A pure push used to leave both the drawn hair and the native shoulder fully opaque.
  const pushed = {...ref, eye: ref.eye.map((v, i) => v + (ref.target[i] - v) * 0.2)};
  assert.equal(holdWeights(pushed, ref).reveal, 1);
  assert.equal(holdWeights(pushed, ref).hair, 0);
  const head = FREEZE.athena.head, side = Math.PI / 4;
  const d = ref.eye.map((v, i) => v - head[i]);
  const turned = {...ref, eye: [head[0] + d[0] * Math.cos(side) + d[2] * Math.sin(side), ref.eye[1], head[2] - d[0] * Math.sin(side) + d[2] * Math.cos(side)]};
  assert.equal(holdWeights(turned, ref).hair, 0);
  const panned = {...ref, eye: ref.eye.map((v, i) => v + (i === 0 ? 0.1 : 0)), target: ref.target.map((v, i) => v + (i === 0 ? 0.1 : 0))};
  for (const destination of [pushed, turned, panned]) {
    for (let step = 0; step <= 100; step++) {
      const pose = Object.fromEntries(['eye', 'target', 'up'].map(key => [key, ref[key].map((v, i) => v + (destination[key][i] - v) * step / 100)]));
      const weights = holdWeights(pose, ref);
      assert.equal(weights.reveal + weights.hair, 1);
      assert.ok(weights.reveal >= 0 && weights.reveal <= 1);
    }
  }
  assert.ok(HOLD.hair[0] < HOLD.hair[1] && HOLD.reveal[0] < HOLD.reveal[1]);
});

test('the finite entrance stays inside navigation bounds', () => {
  // The entrance ends at rest inside the limits.
  assert.equal(easeInOut(0), 0); assert.equal(easeInOut(1), 1);
  const {yaw, pitch} = HOLD.entrance;
  assert.ok(yaw >= HOLD.limits.yaw[0] && yaw <= HOLD.limits.yaw[1] && pitch >= HOLD.limits.pitch[0] && pitch <= HOLD.limits.pitch[1]);
});

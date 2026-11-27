import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

// The deployed .js is browser ESM; this keeps the fixture independent of the
// enclosing repository's Node module mode and needs no browser dependencies.
const source = await readFile(new URL('./dl-holder-orbits.js', import.meta.url), 'utf8');
const {MAX_HOLDER_PROFILES, holderOrbitSeed, holderOrbitGeometry, createHolderOrbits} =
  await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const members = n => Array.from({length: n}, (_, i) => ({id: `buyer:${i}`, bidder: `wallet:${i}`}));
const frame = {center: [660, 400], width: 1200, height: 800, radius: 160, clock: 45, yaw: .5, pitch: .2};

test('empty membership draws no holders and the sale capacity bounds the renderer', () => {
  assert.deepEqual(holderOrbitGeometry([], frame), []);
  assert.equal(holderOrbitGeometry(members(1000), frame).length, MAX_HOLDER_PROFILES);
  const renderer = createHolderOrbits();
  renderer.setProfiles([...members(170), {id: 'buyer:0'}, null]);
  assert.equal(renderer.count, 150);
  renderer.setProfiles([{id: 'one'}, {id: 'one'}, {id: ''}, null]);
  assert.equal(renderer.count, 1);
  renderer.destroy(); renderer.setProfiles(members(2));
  assert.equal(renderer.count, 0);
});

test('adding, removing or reordering buyers leaves every surviving orbit unchanged', () => {
  const original = members(12);
  const before = new Map(holderOrbitGeometry(original, frame).map(p => [p.profile.id, p]));
  const after = holderOrbitGeometry([...members(60).reverse()], frame);
  for (const point of after) {
    const prior = before.get(point.profile.id);
    if (!prior) continue;
    for (const key of ['x', 'y', 'z', 'lane', 'phase']) assert.equal(point[key], prior[key], key);
  }
  assert.deepEqual(holderOrbitGeometry(original.slice(2), frame).map(p => [p.profile.id, p.x, p.y, p.z]),
    holderOrbitGeometry(original, frame).filter(p => !['buyer:0', 'buyer:1'].includes(p.profile.id)).map(p => [p.profile.id, p.x, p.y, p.z]));
});

test('all three lanes are represented and phases are deterministic', () => {
  const seeds = members(150).map(p => holderOrbitSeed(p.id));
  assert.deepEqual([...new Set(seeds.map(s => s.lane))].sort(), [0, 1, 2]);
  assert.ok(new Set(seeds.map(s => s.phase)).size > 145);
  assert.deepEqual(holderOrbitSeed('stable buyer'), holderOrbitSeed('stable buyer'));
});

test('portraits remain inside narrow and wide viewports at every camera rotation', () => {
  for (const [width, height] of [[320, 720], [390, 844], [1368, 1718], [1440, 900]]) {
    for (const yaw of [-3, 0, 1, 3]) for (const pitch of [-1.4, .2, 1.4]) {
      const points = holderOrbitGeometry(members(150), {width, height, center: [width * .55, height * .5],
        radius: Math.min(width, height) * .2, clock: 190, yaw, pitch});
      for (const p of points) {
        assert.ok(p.x - p.diameter / 2 >= 4 && p.x + p.diameter / 2 <= width - 4);
        assert.ok(p.y - p.diameter / 2 >= 4 && p.y + p.diameter / 2 <= height - 4);
      }
    }
  }
});

test('depth halves follow the body and points are sorted from back to front', () => {
  const points = holderOrbitGeometry(members(150), frame);
  assert.ok(points.some(p => p.front) && points.some(p => !p.front));
  for (let i = 0; i < points.length; i++) {
    assert.equal(points[i].front, points[i].z >= 0);
    if (i) assert.ok(points[i].z >= points[i - 1].z);
  }
  const later = holderOrbitGeometry(members(150), {...frame, clock: frame.clock + 4});
  assert.notDeepEqual(later.map(p => [p.x, p.y]), points.map(p => [p.x, p.y]));
});

test('hit testing never opens a back buyer hidden by the body and clears removed buyers', () => {
  const ctx = new Proxy({globalAlpha: 1}, {get: (o, k) => k in o ? o[k] : () => {}});
  const renderer = createHolderOrbits(); renderer.setProfiles(members(150));
  renderer.draw(ctx, {...frame, front: false, reduced: true});
  const points = holderOrbitGeometry(members(150), frame);
  const hidden = points.find(p => !p.front && Math.hypot(p.x - frame.center[0], p.y - frame.center[1]) < frame.radius);
  assert.ok(hidden); assert.equal(renderer.hitTest(hidden.x, hidden.y), null);
  renderer.draw(ctx, {...frame, front: true, reduced: true});
  const visible = points.at(-1);
  assert.equal(renderer.hitTest(visible.x, visible.y)?.id, visible.profile.id);
  renderer.setProfiles([]);
  assert.equal(renderer.hitTest(visible.x, visible.y), null);
  renderer.destroy();
});

test('images load once per active URL, caches stay bounded and stale loads cannot repaint', () => {
  const previousImage = globalThis.Image, previousDocument = globalThis.document;
  const images = [];
  class FakeImage {
    constructor() { this.naturalWidth = 200; this.naturalHeight = 300; images.push(this); }
    removeAttribute() {}
  }
  globalThis.Image = FakeImage;
  globalThis.document = {createElement: () => ({getContext: () => ({drawImage() {}})})};
  let paints = 0;
  const renderer = createHolderOrbits({requestFrame: () => paints++});
  try {
    const original = members(150).map(p => ({...p, avatarUrl: `https://pbs.twimg.com/${p.id}.jpg`}));
    renderer.setProfiles(original); assert.equal(images.length, 150);
    renderer.setProfiles(original); assert.equal(images.length, 150);
    const stale = images[0].onload;
    images[1].onload();
    assert.equal(images[1].onload, null, 'decoded source image is released after its small tile is painted');
    renderer.setProfiles([{id: 'next', avatarUrl: 'https://pbs.twimg.com/next.jpg'}]);
    assert.equal(images.filter(image => image.onload).length, 1);
    const before = paints; stale(); assert.equal(paints, before);
    images.at(-1).onerror(); assert.equal(images.at(-1).onload, null);
    renderer.setProfiles([{id: 'next', avatarUrl: 'https://pbs.twimg.com/next.jpg'}]);
    assert.equal(images.length, 151, 'failed active images are not reloaded each snapshot');
    renderer.destroy(); assert.equal(images.filter(image => image.onload).length, 0);
  } finally {
    renderer.destroy();
    if (previousImage === undefined) delete globalThis.Image; else globalThis.Image = previousImage;
    if (previousDocument === undefined) delete globalThis.document; else globalThis.document = previousDocument;
  }
});

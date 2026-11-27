// The recovered smooth window: projection, camera baseline, mouse fallback, finite easing and media ownership.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {orbitAt, ORBIT} from './dl-depth-orbit.js';
import {slideOf, pxPerCm, shiftsOf, anySlide, projectPoint, anyProjection, frameAt, contentRect, DEPTH_MM, FPS, mountDepth} from './dl-depth.js';

const here = (p) => new URL(p, import.meta.url);

test('the window: straight ahead nothing slides; a plane on the glass never; a near one against the head, a far one with it', () => {
  for (const d of DEPTH_MM) assert.deepEqual(slideOf([0, 0, .55], d / 1000).map((v) => Math.abs(v)), [0, 0]);
  assert.deepEqual(slideOf([.1, .05, .55], 0).map((v) => Math.abs(v)), [0, 0]);
  assert.ok(slideOf([.1, 0, .55], .03)[0] < 0, 'the flashes slide against his head');
  assert.ok(slideOf([.1, 0, .55], -.01)[0] > 0, 'the back slides with it');
  assert.ok(Math.abs(slideOf([.1, 0, .55], .03)[0]) > Math.abs(slideOf([.1, 0, .55], .004)[0]), 'the flashes more than the cloth');
});

test('what he will feel on his 14-inch (0.2 mm a CSS px): about 3.8 px of the flashes against the back a centimetre of his head at 55 cm', () => {
  const k = pxPerCm(.55);
  assert.ok(k > 3.7 && k < 3.9, `px per cm ${k.toFixed(3)}`);
  assert.ok(pxPerCm(.4) > k, 'nearer, more');
});

test('nothing slides that the eye could not see: no draw', () => {
  const content = {widthM: .16, heightM: .107};
  assert.equal(anySlide(shiftsOf([0, 0, .55], content), 800, 535), false);
  assert.equal(anySlide(shiftsOf([.0004, 0, .55], content), 800, 535), false, 'a head 0.4 mm off: under a third of a pixel');
  assert.equal(anySlide(shiftsOf([.05, 0, .55], content), 800, 535), true);
});

test('z motion changes perspective even at the centre; the rest viewpoint is unchanged', () => {
  assert.deepEqual(DEPTH_MM, [-10, 4, 30]);
  const box = {widthM: .16, heightM: .107};
  assert.equal(anyProjection([0, 0, .55], box, 800, 535), false);
  assert.equal(anyProjection([0, 0, .4], box, 800, 535), true);
  const p = [.08, .05], rest = projectPoint(p, [0, 0, .55], .03), near = projectPoint(p, [0, 0, .4], .03);
  assert.ok(Math.hypot(rest[0] - p[0], rest[1] - p[1]) < 1e-12);
  assert.ok(near[0] > rest[0] && near[1] > rest[1]);
  assert.equal(frameAt(1951 / FPS), 1951); assert.equal(frameAt(1951.6 / FPS), 1951);
});

test('the picture\'s content where the page draws it (pictureViewport): the film\'s 796 x 532 inside its 960 x 540', () => {
  const r = contentRect(839, 563);
  assert.ok(Math.abs(r.width / r.height - 796 / 532) < 1e-9);
  assert.ok(Math.abs(r.left) < 1e-6 || Math.abs(r.top) < 1e-6, 'fitted to the box');
});

test('the film is never sought, paused nor played here (the house\'s rule 8); nothing draws at rest', () => {
  const src = readFileSync(here('./dl-depth.js'), 'utf8');
  assert.doesNotMatch(src, /film\.currentTime\s*=(?!=)/, 'never seeks');
  assert.doesNotMatch(src, /film\.(play|pause)\(/, 'never plays nor pauses');
  assert.match(src, /requestVideoFrameCallback/, 'draws on the frames the film presents');
  assert.doesNotMatch(src, /fetch\(|saint-seiya\.layers/, 'no offline rigid-layer file controls the recovered view');
});

test('depth=off mounts nothing', () => {
  const home = {location: {hostname: '127.0.0.1', search: ''}, document: {}};
  assert.equal(mountDepth({stage: {}, film: {}, win: home, doc: home.document, q: new URLSearchParams('depth=off')}), null);
});

test('the hero mounts the recovered window above its opaque anime pass', () => {
  const hero = readFileSync(here('../lab/hero-mount.js'), 'utf8');
  assert.match(hero, /import \{mountDepth\} from '\.\.\/app\/dl-depth\.js\?v=depth-orbit-1';/);
  assert.match(hero, /if \(freezeSpace\) mountDepth\(\{stage: found\.stage, film: found\.film, after: box3d,/);
});

function inputFixture(t, hostname = '127.0.0.1', mode = '', reduced = false, initialTime = 63) {
  const events = new Map(), filmEvents = new Map(), docEvents = new Map(), canvas = {hidden: true, style: {}, setAttribute() {}};
  const box = {left: 20, top: 30, width: 796, height: 532};
  const stage = {append() {}, getBoundingClientRect: () => box,
    addEventListener: (name, fn) => events.set(name, fn), removeEventListener: (name) => events.delete(name)};
  let now = 0, nextRaf = 0, nextFrame = 0, seen = null; const frames = new Map(), videoFrames = new Map();
  const step = () => { const batch = [...frames.values()]; frames.clear(); for (const fn of batch) fn(); };
  const flush = () => { for (let i = 0; frames.size && i < 100; i++) step(); assert.equal(frames.size, 0); };
  const doc = {createElement: () => canvas, hidden: false,
    addEventListener: (name, fn) => docEvents.set(name, fn), removeEventListener: (name) => docEvents.delete(name)};
  const win = {location: {hostname, protocol: 'http:'}, document: doc,
    innerWidth: 1000, innerHeight: 800, performance: {now: () => now}, addEventListener() {},
    requestAnimationFrame: (fn) => { frames.set(++nextRaf, fn); return nextRaf; }, cancelAnimationFrame: (id) => frames.delete(id),
    matchMedia: () => ({matches: reduced, addEventListener() {}, removeEventListener() {}}),
    IntersectionObserver: class { constructor(fn) { seen = fn; } observe() {} disconnect() { seen = null; } }};
  const film = {currentTime: initialTime, paused: true, readyState: 0,
    addEventListener: (name, fn) => filmEvents.set(name, fn), removeEventListener: (name) => filmEvents.delete(name),
    requestVideoFrameCallback: (fn) => { videoFrames.set(++nextFrame, fn); return nextFrame; }, cancelVideoFrameCallback: (id) => videoFrames.delete(id)};
  let onHead = null, card = null, follows = 0;
  const handle = mountDepth({stage, film, win, q: new URLSearchParams(mode), followHead: (opts) => {
    follows++; onHead = opts.onHead; card = opts.card; return {stop() {}};
  }});
  const move = (x, pointerType = 'mouse', y = .5) => events.get('pointermove')?.({clientX: box.left + box.width * x, clientY: box.top + box.height * y, pointerType});
  return {handle, canvas, film, move, flush, step, pending: () => frames.size, callbacks: () => videoFrames.size,
    advance: (ms) => { now += ms; }, follows: () => follows, leave: () => events.get('pointerleave')?.(),
    head: (eye) => onHead?.(eye ? {u: eye.map((v) => v / card().h_m)} : null),
    play: () => { film.paused = false; filmEvents.get('play')?.(); },
    pause: () => { film.paused = true; filmEvents.get('pause')?.(); },
    seek: (time) => { film.currentTime = time; filmEvents.get('seeked')?.(); },
    timeupdate: (time) => { film.currentTime = time; filmEvents.get('timeupdate')?.(); },
    present: (time) => { film.currentTime = time; const batch = [...videoFrames.values()]; videoFrames.clear(); for (const fn of batch) fn(0, {mediaTime: time}); },
    visible: (value) => seen?.([{target: stage, isIntersecting: value}]),
    pageVisible: (value) => { doc.hidden = !value; docEvents.get('visibilitychange')?.(); },
  };
}
const rounded = (v) => v.map((x) => Math.round(x * 1000) / 1000 || 0);

test('default orbit starts without a pointer, tracked body leads and expiry restores the music-shaped path', (t) => {
  const f = inputFixture(t); f.flush();
  assert.equal(f.handle.state().mode, 'auto');
  assert.equal(f.handle.state().from, 'orbit');
  assert.deepEqual(f.handle.state().eye, rounded(orbitAt(63).eye));
  f.head([.03, .02, .55]); f.flush();
  assert.deepEqual(f.handle.state().eye, [0, 0, .55], 'first body centres the window');
  f.head([.06, .04, .55]); f.flush();
  f.move(.4);
  assert.equal(f.handle.state().from, 'camera');
  assert.deepEqual(f.handle.state().eye, [.03, .02, .55]);
  f.head(null); f.flush();
  assert.equal(f.handle.state().from, 'orbit');
  assert.deepEqual(f.handle.state().eye, rounded(orbitAt(63, f.handle.state().controls).eye));
  assert.deepEqual(f.handle.state().trajectory.centre, [0, 0, .55]);
  const controls = f.handle.state().controls;
  f.move(.9, 'touch');
  assert.deepEqual(f.handle.state().controls, controls, 'touch scroll does not steer');
  f.handle.stop(); f.move(.9);
  assert.equal(f.handle.state().eye, null);
  assert.equal(f.pending(), 0);
});

test('public orbit needs no house connection and mouse steers around the fixed centre', (t) => {
  const f = inputFixture(t, 'optimism.fit'); f.flush();
  assert.equal(f.follows(), 0);
  assert.equal(f.handle.state().mode, 'orbit');
  const before = f.handle.state().eye;
  f.move(.9); f.flush();
  assert.equal(f.handle.state().from, 'orbit');
  assert.notDeepEqual(f.handle.state().eye, before);
  assert.deepEqual(f.handle.state().trajectory.centre, [0, 0, .55]);
  f.leave(); f.flush();
  assert.deepEqual(f.handle.state().eye, before);
  f.handle.stop();
});

test('ordinary playback enters the depth scene without a seek or pointer', (t) => {
  const f = inputFixture(t, 'optimism.fit', '', false, ORBIT.start - .5);
  f.play(); f.flush();
  assert.equal(f.handle.state().eye, null);
  assert.equal(f.callbacks(), 0);
  f.timeupdate(ORBIT.start + .25); f.flush();
  assert.equal(f.handle.state().from, 'orbit');
  assert.equal(f.handle.state().trajectory.seconds, ORBIT.start + .25);
  assert.equal(f.callbacks(), 1, 'film presentation callbacks start on natural scene entry');
  assert.equal(f.pending(), 0, 'no independent automatic animation loop');
  f.handle.stop();
});

test('explicit eye, mouse and test modes retain direct input', (t) => {
  const eye = inputFixture(t, '127.0.0.1', 'depth=eye'); eye.flush();
  eye.move(.9); assert.equal(eye.handle.state().from, null);
  const mouse = inputFixture(t, '127.0.0.1', 'depth=mouse'); mouse.flush();
  assert.equal(mouse.follows(), 0); mouse.move(.9); mouse.flush();
  assert.deepEqual(rounded(mouse.handle.state().eye), [.096, 0, .55]);
  const proof = inputFixture(t, '127.0.0.1', 'depth=test');
  proof.handle.eye([.01, .02, .5]); proof.flush();
  assert.deepEqual(proof.handle.state().eye, [.01, .02, .5]);
  for (const f of [eye, mouse, proof]) f.handle.stop();
});

test('presented frames advance the orbit once; pausing settles and then schedules nothing', (t) => {
  const f = inputFixture(t, 'optimism.fit'); f.flush(); f.play(); f.flush();
  assert.equal(f.callbacks(), 1);
  f.present(63.8); f.step();
  assert.equal(f.handle.state().trajectory.seconds, 63.8);
  assert.equal(f.pending(), 0, 'no independent RAF orbit while playing');
  assert.equal(f.callbacks(), 1, 'one next film frame requested');
  f.pause(); f.flush();
  assert.equal(f.handle.state().moving, false);
  assert.equal(f.callbacks(), 0);
  assert.deepEqual(f.handle.state().eye, rounded(orbitAt(63.8).eye));
  const state = f.handle.state(); f.advance(10000);
  assert.deepEqual(f.handle.state().eye, state.eye, 'wall time does not move the orbit');
  assert.equal(f.pending(), 0);
  f.handle.stop();
});

test('outside the scene or invisible, all drawing callbacks stop; returning follows film time', (t) => {
  const f = inputFixture(t, 'optimism.fit'); f.flush(); f.play(); f.flush();
  f.present(ORBIT.end + .1); f.flush();
  assert.equal(f.callbacks(), 0); assert.equal(f.pending(), 0); assert.equal(f.handle.state().eye, null);
  f.seek(65); f.flush(); assert.equal(f.callbacks(), 1);
  f.visible(false); assert.equal(f.callbacks(), 0); assert.equal(f.pending(), 0);
  f.visible(true); f.flush(); assert.equal(f.callbacks(), 1);
  f.pageVisible(false); assert.equal(f.callbacks(), 0); assert.equal(f.pending(), 0);
  f.pageVisible(true); f.flush(); assert.equal(f.callbacks(), 1);
  f.handle.stop(); assert.equal(f.callbacks(), 0); assert.equal(f.pending(), 0);
});

test('reduced motion stays at rest automatically; manual steering chooses a static viewpoint', (t) => {
  const f = inputFixture(t, 'optimism.fit', '', true); f.flush(); f.play(); f.flush();
  assert.deepEqual(f.handle.state().eye, [0, 0, .55]); assert.equal(f.callbacks(), 0);
  f.move(.9); f.flush(); f.pause(); f.flush();
  assert.equal(f.handle.state().from, 'orbit-steered');
  assert.equal(f.handle.state().trajectory.kind, 'manual-orbit');
  const at = f.handle.state().eye; f.seek(66); f.flush();
  assert.deepEqual(f.handle.state().eye, at, 'film time does not rotate the manual reduced-motion view');
  f.leave(); f.flush(); assert.deepEqual(f.handle.state().eye, [0, 0, .55]);
  f.handle.stop();
});

test('camera reference persists over a short absence and resets after three seconds', (t) => {
  const f = inputFixture(t);
  f.head([.04, .02, .6]); f.flush(); f.head([.07, .03, .5]); f.flush();
  assert.deepEqual(f.handle.state().eye, [.03, .01, .45]);
  f.head(null); f.advance(2500); f.head([.07, .03, .5]); f.flush();
  assert.deepEqual(f.handle.state().eye, [.03, .01, .45]);
  f.head(null); f.advance(3001); f.head([.07, .03, .5]); f.flush();
  assert.deepEqual(f.handle.state().eye, [0, 0, .55]); f.handle.stop();
});

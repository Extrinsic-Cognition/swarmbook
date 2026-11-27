import test from 'node:test';
import assert from 'node:assert/strict';
import { mountLayer } from './dl-athena-layer.mjs';

test('destroy removes listeners and prevents a pending engine load from mounting after the overlay leaves', async () => {
  const listeners = new Set(); let disconnected = 0, release;
  const pending = new Promise(resolve => { release = resolve; });
  const events = { addEventListener: (_type, fn) => listeners.add(fn), removeEventListener: (_type, fn) => listeners.delete(fn) };
  const element = () => {
    const attrs = new Set();
    return { ...events, style: {}, dataset: {}, classList: { add() {}, remove() {} }, append() {}, replaceChildren() {}, remove() {},
      setAttribute: k => attrs.add(k), removeAttribute: k => attrs.delete(k), hasAttribute: k => attrs.has(k) };
  };
  const doc = { ...events, hidden: false, createElement: element, head: element(), body: element(), documentElement: { clientWidth: 1200 },
    querySelector: () => null, elementFromPoint: () => null };
  const win = { ...events, document: doc, innerWidth: 1200, innerHeight: 800, devicePixelRatio: 1,
    matchMedia: q => ({ matches: q.includes('hover') }), requestAnimationFrame: () => 1, cancelAnimationFrame() {}, clearTimeout() {}, clearInterval() {},
    MutationObserver: class { observe() {} disconnect() { disconnected++; } } };
  const fetcher = async url => {
    await pending;
    return { ok: true, text: async () => url.pathname.endsWith('roma-engine.js') ? 'window.RomaQuantica={CANON:{}};' : 'window.PoleisEngine={mount(){return{};}};' };
  };
  const layer = mountLayer({ win, doc, fetcher, engine: 'come' });
  assert.equal(listeners.size, 5);
  const loading = layer.figure(); layer.destroy(); layer.destroy(); release(); await loading;
  assert.equal(layer.state().engine, false, 'late engine bytes cannot mount an orphaned painter');
  assert.equal(layer.waiting(), true); assert.equal(listeners.size, 0); assert.equal(disconnected, 1);
  layer.come(); assert.equal(layer.state().came, 0, 'a destroyed layer cannot be summoned');
});

test('THE DEPTH: look() takes his pointer; the engine\'s own picture steps the spring, writes the camera\'s turn and the perch\'s slide while it moves, and nothing once settled', async () => {
  const listeners = new Set();
  const events = { addEventListener: (_type, fn) => listeners.add(fn), removeEventListener: (_type, fn) => listeners.delete(fn) };
  const element = () => { const attrs = new Set(); return { ...events, style: {}, dataset: {}, classList: { add() {}, remove() {} }, append() {}, replaceChildren() {}, remove() {}, insertBefore() {},
    setAttribute: k => attrs.add(k), removeAttribute: k => attrs.delete(k), hasAttribute: k => attrs.has(k), toggleAttribute() {} }; };
  const doc = { ...events, hidden: false, createElement: element, head: element(), body: element(), documentElement: { clientWidth: 1200 }, querySelector: () => null, elementFromPoint: () => null };
  let t = 1000;
  const win = { ...events, document: doc, innerWidth: 1200, innerHeight: 800, devicePixelRatio: 1, performance: { now: () => t }, matchMedia: q => ({ matches: q.includes('hover') }),
    requestAnimationFrame: () => 1, cancelAnimationFrame() {}, setTimeout: () => 1, clearTimeout() {}, clearInterval() {}, MutationObserver: class { observe() {} disconnect() {} } };
  const PE = 'window.PoleisEngine={mount(c,o){c.__o=o;return c.__i={...window.__i};},setDiscussion(){},setActive(i,on){i.paused=!on;},drawOnce(){},projectPoint(){return [75, 30];}};';
  const fetcher = async url => ({ ok: true, text: async () => url.pathname.endsWith('roma-engine.js') ? 'window.RomaQuantica={CANON:{ORGS:[],CHILDREN:{}}};window.__i={paused:false,name:"ROMA·0",scale:1};' : PE });
  const layer = mountLayer({ win, doc, fetcher, engine: 'come' });
  layer.come(); await layer.figure();
  const s0 = layer.state(); assert.equal(s0.engine, true); assert.equal(s0.depth.writes, 0); assert.equal(layer.els.canvas.__o.fpsCap, 0, 'no cap asked: every frame the display gives (the mint)'); { const l2 = mountLayer({ win, doc, fetcher, engine: 'come', cap: 1000 / 60 }); l2.come(); await l2.figure(); assert.equal(l2.els.canvas.__o.fpsCap, 1000 / 60, 'HER SIXTY IN HARMONY: a page that asks a cap hands it to her engine'); l2.destroy(); }
  const perch = layer.els.perch, pic = () => { t += 1000 / 120; layer.depthStep(t); };   // the engine's picture, 120 a second
  for (let k = 0; k < 10; k++) pic();
  assert.equal(layer.state().depth.writes, 0, 'no pointer: nothing written'); assert.equal(perch.style.translate, undefined);
  const at = layer.state().at, box = layer.box();
  layer.look([at[0] + box.w / 2 + 300, at[1] + box.h / 2 + 150]);   // his pointer to her right and below
  assert.equal(layer.state().depth.writes, 0, 'look() itself writes nothing: the next picture does');
  pic(); const s1 = layer.state();
  assert.equal(s1.depth.writes, 1); assert.ok(s1.depth.yaw < 0 && s1.depth.pitch < 0, 'the camera turns toward a pointer right and below: ' + JSON.stringify(s1.depth)); assert.match(perch.style.translate, /^\d+\.\dpx \d+\.\dpx$/);
  for (let k = 0; k < 240; k++) pic();
  const s2 = layer.state(), want = [Math.tanh(300 / 420), Math.tanh(150 / 420)];
  assert.ok(Math.abs(s2.depth.look[0] - want[0]) < 0.004 && Math.abs(s2.depth.look[1] - want[1]) < 0.004, 'settled on tanh of the pull: ' + JSON.stringify(s2.depth.look));
  assert.ok(s2.depth.writes > 20 && s2.depth.writes < 200, 'written while it moved, never on every one of the 241 pictures: ' + s2.depth.writes);
  for (let k = 0; k < 120; k++) pic();
  assert.equal(layer.state().depth.writes, s2.depth.writes, 'at rest nothing is written'); assert.equal(layer.state().depth.steps, s2.depth.steps + 120, 'though every picture stepped');
  layer.look(null); for (let k = 0; k < 400; k++) pic();   // the pointer gone: straight ahead again
  const s3 = layer.state(); assert.deepEqual(s3.depth.look, [0, 0]); assert.equal(perch.style.translate, '0.0px 0.0px'); assert.equal(Math.abs(s3.depth.yaw), 0); assert.ok(s3.depth.writes > s2.depth.writes); { const her = layer.els.her, paint = layer.els.canvas.__i.onSceneFrame, seen = new Set(); assert.equal(her.style.animation, 'none', 'HER FLOAT RIDES HER PICTURE: once her engine paints, the sheet\'s endless float is off'); let writes = 0, last; for (let k = 0; k < 816; k++) { t += 1000 / 120; paint(); if (her.style.translate !== last) { writes++; last = her.style.translate; seen.add(last); } } assert.ok(seen.has('0 0px') && seen.has('0 -5px') && seen.size === 11, 'the same 5 px in half px steps: ' + [...seen].join(' | ')); assert.ok(writes >= 20 && writes <= 24, 'two swings of 3.4 s in 816 pictures: written on a new half px alone, never at every picture: ' + writes); const held = her.style.translate; t += 60000; assert.equal(her.style.translate, held, 'no picture, no float: nothing moves while her engine sleeps'); }
});

// ko-edge.test.mjs: the KO edge's plan (koAt, styleAt), its red (edgeTexture) and its clock (mountKoEdge on a stand-in film and stage), without
// a browser. node --test embertide-app/ui/intro/dyson-society/lab/ko-edge.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {KO, FPS, frameTime, koAt, styleAt, edgeTexture, LOOKS, mountKoEdge, STRENGTH} from './ko-edge.js';
import {SPASMS} from './ko-spasms.js';
import {blockAc, measure} from '../tools/ko-spasms.mjs'; import {filmStandIn} from '../worker/stand-ins.mjs';

const here = (f) => new URL(f, import.meta.url);
const src = fs.readFileSync(here('./ko-edge.js'), 'utf8');
const FILM = fileURLToPath(here('../app/saint-seiya.mp4'));
const {hit, held, healed} = KO.frames;

test('the moments are the film\'s own frames, his 18.1 s inside', () => {
  assert.equal(FPS, 30000 / 1001);
  assert.equal(frameTime(hit).toFixed(3), '18.018');
  assert.equal(frameTime(held).toFixed(3), '29.563');
  assert.equal(frameTime(healed).toFixed(3), '36.570');
  assert.equal(koAt(18.1).on, true);
  assert.equal(koAt(18.1).level, 1);
});

test('the edge comes in at once at the hit and is gone at the beam\'s first frame', () => {
  assert.equal(koAt(frameTime(hit - 1)).on, false);
  const s = koAt(frameTime(hit));
  assert.equal(s.on, true);
  assert.equal(s.level, 1);
  assert.equal(s.flash, 1);
  assert.deepEqual(styleAt(frameTime(hit)), {shown: true, steady: 1, pulse: 1, scale: 1});
  assert.equal(koAt(frameTime(healed - 1)).on, true);
  assert.deepEqual(styleAt(frameTime(healed)), {shown: false, steady: 0, pulse: 0, scale: 1});
  // a frame's time a hair either side of its own (a decoder's rounding of the pts) stays on the same side of every line
  for (const n of [hit, held, healed]) for (const e of [-2e-6, 2e-6]) assert.deepEqual(koAt(frameTime(n) + e).level, koAt(frameTime(n)).level);
});

test('the level changes only at the hit, at the cut to Athena and at the beam', () => {
  const changes = [];
  let last = 0;
  for (let n = 0; n < 2400; n++) {
    const level = koAt(frameTime(n)).level;
    if (level !== last) changes.push([n, level]);
    last = level;
  }
  assert.deepEqual(changes, [[hit, 1], [held, KO.view], [healed, 0]]);
});

test('the pulses are his body\'s: a surge lands only on the frame of a spasm, every strong spasm surges, nothing else moves the red', () => {
  const at = (n) => koAt(frameTime(n));
  const rises = [];
  for (let n = hit + 1; n < healed; n++) if (at(n).beat > at(n - 1).beat * Math.exp(-1 / (FPS * KO.fall)) + 1e-9) rises.push(n);
  for (const n of rises) assert.ok(n < held && STRENGTH[n - SPASMS.from] > 0, `a surge at frame ${n} (${frameTime(n).toFixed(3)} s) with no spasm there`);
  for (let i = 0; i < STRENGTH.length; i++) if (STRENGTH[i] >= 0.5 && i > 0) assert.ok(rises.includes(SPASMS.from + i), `the spasm at frame ${SPASMS.from + i} did not surge`);
  // the yank on fours, his jerks after the cut, the scream: every drawing surges (574, a jerk of 0.25 a quarter second after the yank's last
  // drawing of 1.0, stays inside that one's fall: 0.27 there)
  for (const n of [544, 549, 552, 556, 560, 564, 567, 579, 582, 654, 659, 662, 669, 674]) assert.ok(rises.includes(n), `frame ${n}`);
  // Dolbar's lips over him and the hold's cut move nothing; in her view the red holds still
  for (const n of [571, 706, 710, 714, 717]) assert.equal(STRENGTH[n - SPASMS.from], 0, `frame ${n}`);
  for (let n = held; n < healed; n++) assert.equal(at(n).beat, 0);
  // between drawings a surge only falls
  for (let t = 19.5; t < 21.8; t += 0.001) assert.ok(koAt(t + 0.001).beat <= koAt(t).beat + 1e-12, `${t}`);
});

test('the DCT\'s count: a block\'s AC energy as the tool takes it equals the orthonormal 8 x 8 DCT\'s AC coefficients squared', () => {
  const a = (u) => Math.sqrt((u === 0 ? 1 : 2) / 8);
  let seed = 7;
  const rand = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
  for (let k = 0; k < 20; k++) {
    const prev = Uint8Array.from({length: 64}, () => Math.floor(rand() * 256)), next = Uint8Array.from({length: 64}, () => Math.floor(rand() * 256));
    let ac = 0;
    for (let u = 0; u < 8; u++) for (let v = 0; v < 8; v++) {
      let c = 0;
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) c += (next[y * 8 + x] - prev[y * 8 + x]) * Math.cos((2 * x + 1) * u * Math.PI / 16) * Math.cos((2 * y + 1) * v * Math.PI / 16);
      c *= a(u) * a(v);
      if (u || v) ac += c * c;
    }
    const tool = blockAc(prev, next, 8, 0, 0);
    assert.ok(Math.abs(tool - ac) <= 1e-6 * Math.max(1, ac), `${tool} against ${ac}`);
  }
});

test('the data is the film\'s: measured again off app/saint-seiya.mp4, the same numbers', {skip: !fs.existsSync(FILM) && 'the film is not in this clone (GitHub strips it)'}, async () => {
  assert.equal(SPASMS.from, hit);
  assert.equal(SPASMS.to, held);
  assert.equal(SPASMS.energy.length, held - hit);
  assert.deepEqual([...await measure(FILM)], [...SPASMS.energy]);
});

test('between the cuts the red only jumps on a spasm\'s frame; elsewhere it moves less than 0.05 a millisecond', () => {
  let last = styleAt(frameTime(hit) + 0.3);
  for (let t = frameTime(hit) + 0.3; t < frameTime(healed) - 0.03; t += 0.001) {   // the beam's line is half a frame before its frame
    const s = styleAt(t), step = Math.max(Math.abs(s.pulse - last.pulse), Math.abs(s.scale - last.scale) / 0.07);
    last = s;
    if (step <= 0.05) continue;
    const n = Math.floor(t * FPS + 0.5);
    assert.ok(n === held || (n < held && STRENGTH[n - SPASMS.from] > 0), `a jump of ${step.toFixed(3)} at ${t.toFixed(3)} s, frame ${n}, no spasm there`);
  }
});

test('bounded everywhere, and off outside the window', () => {
  for (let n = 0; n < 4630; n++) {
    const t = frameTime(n), s = styleAt(t);
    for (const v of [s.steady, s.pulse]) assert.ok(v >= 0 && v <= 1 && Number.isFinite(v), `${t}: ${JSON.stringify(s)}`);
    assert.ok(s.scale >= 1 && s.scale <= 1.07 + 1e-9, `${t}: ${JSON.stringify(s)}`);
    assert.equal(s.shown, n >= hit && n < healed);
  }
});

test('the rule of one: no burst of the theater inside the window', () => {
  const page = fs.readFileSync(here('./hero-mount.js'), 'utf8'), theater = fs.readFileSync(here('./theater.js'), 'utf8');
  const bursts = [...page.match(/const BURSTS = \[(.*?)\];/)[1].matchAll(/t: ([\d.]+)/g)].map((m) => Number(m[1]));
  const long = Number(theater.match(/const BURST = ([\d.]+);/)[1]);
  assert.deepEqual(bursts, [11.044, 37.10]);
  assert.equal(long, 5.2);
  for (const b of bursts) for (let t = b; t < b + long; t += 1 / FPS) assert.equal(koAt(t).on, false, `${t} s, in the burst at ${b}`);
});

test('reduced motion keeps the red and drops the beat and the flash', () => {
  assert.deepEqual(styleAt(frameTime(hit), KO, {reduced: true}), {shown: true, steady: 0.8, pulse: 0, scale: 1});
  assert.deepEqual(styleAt(22, KO, {reduced: true}), {shown: true, steady: 0.8, pulse: 0, scale: 1});
  assert.deepEqual(styleAt(33, KO, {reduced: true}), {shown: true, steady: 0.44, pulse: 0, scale: 1});
});

test('the red: clear in the middle, full at the borders, deepest in the corners, seeded', () => {
  const w = 96, h = 72, alpha = (px, x, y) => px[(y * w + x) * 4 + 3];
  for (const look of Object.values(LOOKS)) {
    const px = edgeTexture(w, h, look);
    assert.equal(px.length, w * h * 4);
    assert.equal(alpha(px, w / 2, h / 2), 0, 'the middle is clear');
    assert.ok(alpha(px, 0, 0) > 150 && alpha(px, w - 1, h - 1) > 150, `the corners: ${alpha(px, 0, 0)}, ${alpha(px, w - 1, h - 1)}`);
    assert.ok(alpha(px, 0, h / 2) > 90 && alpha(px, w / 2, 0) > 90, `the borders' middles: ${alpha(px, 0, h / 2)}, ${alpha(px, w / 2, 0)}`);
    assert.deepEqual(edgeTexture(w, h, look), px, 'the same bytes every time');
    assert.notDeepEqual(edgeTexture(w, h, {...look, seed: look.seed + 1}), px, 'another seed seeps elsewhere');
    for (let i = 0; i < px.length; i += 4) if (px[i + 3]) assert.ok(px[i] > px[i + 1] + 60 && px[i] > px[i + 2] + 60, 'red');
  }
  const reach = (look) => edgeTexture(w, h, look).filter((v, i) => i % 4 === 3 && v > 20).length;
  assert.ok(reach(LOOKS.pulse) > reach(LOOKS.steady) * 1.2, 'the surge reaches further in than the rim');
});

test('nothing at rest: no frame loop and no timer in the source; the waiting frame callback is let go at the pause', () => {
  assert.doesNotMatch(src, /requestAnimationFrame\s*\(/);
  assert.doesNotMatch(src, /setInterval\s*\(/);
  assert.match(src, /const onPause = \(\) => \{ stop\(\); apply\(film\.currentTime\); \};/);
  assert.match(src, /film\.cancelVideoFrameCallback\?\.\(waiting\)/);
});

// a stand-in for the page: a stage in a document, and a film whose frames the test presents by hand
function standIn({width = 1315, height = 1189} = {}) {
  const idle = [];
  const node = (tag) => ({
    tagName: tag.toUpperCase(), style: {}, attrs: {}, children: [], parent: null, width: 0, height: 0, id: '',
    setAttribute(k, v) { this.attrs[k] = v; },
    append(...xs) { for (const x of xs) { x.parent = this; this.children.push(x); } },
    after(x) { const sib = this.parent.children; x.parent = this.parent; sib.splice(sib.indexOf(this) + 1, 0, x); },
    remove() { const sib = this.parent.children; sib.splice(sib.indexOf(this), 1); this.parent = null; },
    getContext() { return {createImageData: (w, h) => ({data: new Uint8ClampedArray(w * h * 4)}), putImageData() { node.puts++; }}; },
  });
  node.puts = 0;
  // the window is 1440 x 900; the hero's section spans its width and runs 1020 px from the top, scrolled by `scroll`; the stage inside it
  // stands from x 118 to 1323 (the proof's own numbers), its top 75 px into the section
  const viewListeners = {};
  const view = {
    innerWidth: 1440, innerHeight: 900, scroll: 0,
    getComputedStyle: () => ({position: 'relative'}), matchMedia: () => ({matches: false}), performance: {now: () => 0},
    requestIdleCallback: (f) => idle.push(f), setTimeout: (f) => idle.push(f),
    addEventListener(type, f) { (viewListeners[type] ??= []).push(f); },
    removeEventListener(type, f) { viewListeners[type] = (viewListeners[type] ?? []).filter((g) => g !== f); },
    fire(type) { for (const f of viewListeners[type] ?? []) f({type}); },
    listeners: viewListeners,
  };
  const doc = {defaultView: view, createElement: node};
  const rect = (l, t, w, h) => ({left: l, top: t, right: l + w, bottom: t + h, width: w, height: h});
  const section = node('section');
  section.getBoundingClientRect = () => rect(0, -view.scroll, 1440, 1020);
  const stage = node('div');
  stage.ownerDocument = doc;
  stage.offsetParent = section;
  stage.clientLeft = 0; stage.clientTop = 0;
  stage.getBoundingClientRect = () => rect(118, 75 - view.scroll, width - 110, height - 289);
  stage.append(node('canvas'), node('canvas'), node('button'));
  const film = filmStandIn();
  return {stage, film, idle, node, view};
}

test('the red stands at the window\'s edges, not the stage\'s: a fixed layer the window\'s width over the rows the hero section holds, refitted on a scroll while it is in', () => {
  const {stage, film, view} = standIn();
  const ko = mountKoEdge({stage, film});
  film.currentTime = 22; film.fire('seeked');
  const box = () => ['position', 'left', 'right', 'top', 'height'].map((k) => ko.element.style[k]);
  // a fixed layer the window's width, over the window's rows 0 to 900 that the section (0 to 1020) holds
  assert.deepEqual(box(), ['fixed', '0', '0', '0px', '900px']);
  assert.deepEqual(ko.stats.size, [1440, 900]);
  // scrolled down 300 px: the section holds the window's rows 0 to 720
  view.scroll = 300; view.fire('scroll');
  assert.deepEqual(box(), ['fixed', '0', '0', '0px', '720px']);
  // past the window: hidden, and a scroll then does nothing
  film.currentTime = 40; film.fire('seeked');
  assert.equal(ko.element.style.visibility, 'hidden');
  view.scroll = 0; view.fire('scroll');
  assert.deepEqual(box(), ['fixed', '0', '0', '0px', '720px'], 'no refit while the red is out');
  // scrolled so the section's top is 200 px down the window (the page above it): rows 200 to 900
  film.currentTime = 22; film.fire('seeked');
  view.scroll = -200; view.fire('scroll');
  assert.deepEqual(box(), ['fixed', '0', '0', '200px', '700px']);
  ko.destroy();
  assert.equal(Object.values(view.listeners).flat().length, 0);
});

test('the clock: a frame callback only while the film plays near the window, none at rest, style written only on a change', () => {
  const {stage, film, idle, node} = standIn();
  const ko = mountKoEdge({stage, film});
  // it goes in right after the stage's last canvas, before the page's controls, with no z-index of its own
  assert.deepEqual(stage.children.map((c) => c.tagName), ['CANVAS', 'CANVAS', 'DIV', 'BUTTON']);
  assert.equal(ko.element.style.zIndex, undefined);
  assert.equal(ko.element.style.pointerEvents, 'none');
  assert.equal(ko.element.style.visibility, 'hidden');
  // paused at 0 s: nothing waits; the red is painted once in idle time
  assert.equal(film.waiting, 0);
  assert.equal(idle.length, 1);
  idle.shift()();
  assert.equal(node.puts, 2);
  assert.equal(ko.stats.painted, true);
  // playing far from the window: timeupdate answers with a comparison, no frame callback, no write
  film.paused = false; film.currentTime = 5; film.fire('play');
  assert.equal(film.waiting, 0);
  const writes0 = ko.stats.writes;
  for (const t of [5.25, 5.5, 10, 16.4]) { film.currentTime = t; film.fire('timeupdate'); }
  assert.equal(film.waiting, 0);
  assert.equal(ko.stats.writes, writes0);
  // a second and a half before the hit, a timeupdate arms the frames; they keep asking while the film plays
  film.currentTime = 16.6; film.fire('timeupdate');
  assert.equal(film.waiting, 1);
  for (let n = Math.round(16.6 * FPS); n < hit + 30; n++) { film.currentTime = frameTime(n); film.present(); }
  assert.equal(film.waiting, 1);
  assert.equal(ko.element.style.visibility, 'visible');
  const s = ko.at(film.currentTime);
  assert.equal(stage.children[2].children[1].style.opacity, String(s.pulse));
  // the pause lets the waiting callback go and draws the paused frame once
  film.paused = true; film.fire('pause');
  assert.equal(film.waiting, 0);
  const writes1 = ko.stats.writes;
  film.fire('timeupdate');
  assert.equal(ko.stats.writes, writes1, 'the same second writes nothing');
  assert.equal(film.waiting, 0);
  // a seek while paused draws that second once and asks nothing
  film.currentTime = 33; film.fire('seeked');
  assert.equal(film.waiting, 0);
  assert.equal(stage.children[2].children[0].style.opacity, String(styleAt(33).steady));
  // past the beam: off, and the frames stop asking
  film.paused = false; film.currentTime = 36.5; film.fire('play');
  assert.equal(film.waiting, 1);
  for (let n = Math.round(36.5 * FPS); n < healed + 20; n++) { film.currentTime = frameTime(n); film.present(); }
  assert.equal(ko.element.style.visibility, 'hidden');
  assert.equal(film.waiting, 0);
  // destroy takes everything away
  ko.destroy();
  assert.deepEqual(stage.children.map((c) => c.tagName), ['CANVAS', 'CANVAS', 'BUTTON']);
  assert.equal(Object.values(film.listeners).flat().length, 0);
});

test('reduced motion: the stand-in page asks for it and gets the still red', () => {
  const {stage, film} = standIn();
  stage.ownerDocument.defaultView.matchMedia = () => ({matches: true});
  const ko = mountKoEdge({stage, film});
  film.currentTime = 22; film.fire('seeked');
  assert.equal(ko.stats.reduced, true);
  assert.equal(stage.children[2].children[1].style.opacity, '0');
  assert.equal(stage.children[2].children[0].style.opacity, '0.8');
  ko.destroy();
});

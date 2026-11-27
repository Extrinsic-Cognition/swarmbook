// sacrifice.test.mjs: THE SACRIFICE's plan (sacrificeAt: the figure locked to the film's frame, cel 330 held over the hit, the fades by
// frame, where he stands), its matte file (sacrifice-masks.png), its clock and its drawing (mountSacrifice on a stand-in film, stage and
// helper film), and the hero's two lines, without a browser. His words in sacrifice.js's header ("segment out and enhance the sacrifice here
// again of aiolos one second time"; Oct 15 2026 02:1x WEST "are you sure it is well timed? cant you upscale it? it is super blurry dude").
// node --test embertide-app/ui/intro/dyson-society/lab/sacrifice.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {fileURLToPath} from 'node:url';
import {SACRIFICE, COUNT, FROM, TO, END, CUT, CELL, FPS, frameTime, frameAt, rectOf, sacrificeAt, near, mountSacrifice} from './sacrifice.js';
import {SPHERE_X} from '../app/sphere-centre.mjs';

const here = (f) => new URL(f, import.meta.url);
const page = fs.readFileSync(here('./hero-mount.js'), 'utf8');   // the hero's mount (app/warm.html mounts it itself since lane/one-page)
const GEO = {centre: [1205 * SPHERE_X, 450], radius: 180, width: 1205, height: 900};   // the stand-in's stage: the sphere at its centre (app/sphere-centre.mjs), halfway down, 0.2 of the shorter side
const ease = (x) => x * x * (3 - 2 * x);
const short = (n) => Math.floor(frameTime(n) * 1e6) / 1e6;   // a frame's time as Chrome may write it: whole microseconds, a hair short

test('the second is 30 film frames from 319: frame 319 (10.644 s) to the end of 348 (11.645 s), the cut to the hit at 331 (11.044 s)', () => {
  assert.equal(FPS, 30000 / 1001);
  assert.deepEqual([SACRIFICE.first, SACRIFICE.last, SACRIFICE.tag], [319, 330, 325]);
  assert.equal(COUNT, 12);
  assert.deepEqual([END, CUT], [349, 331]);
  assert.equal(FROM.toFixed(3), '10.644'); assert.equal(TO.toFixed(3), '11.645'); assert.equal(frameTime(CUT).toFixed(3), '11.044');
  // his tag (10.835 s) is on a cel's frame; the hero's first burst is the cut, inside the second
  assert.equal(frameAt(10.835), 324);
  const bursts = [...page.match(/const BURSTS = \[(.*?)\];/)[1].matchAll(/t: ([\d.]+)/g)].map((m) => Number(m[1]));
  assert.equal(Math.round(bursts[0] * FPS), CUT, 'the burst is the cut to the hit');
  for (const [t, on] of [[frameTime(318), false], [short(319), true], [frameTime(319) - 0.0005, false], [frameTime(348) + 0.9 / FPS, true], [frameTime(349), false], [short(349), false], [NaN, false], [-1, false], [10.5, false], [11.7, false]])
    assert.equal(sacrificeAt(t).on, on, `at ${t} s`);
});

test('LOCKED TO THE FILM: on each film frame 319 to 330 the cel is that very frame, wherever in the frame and however its time is written', () => {
  for (let n = 319; n <= 330; n++) {
    for (const t of [frameTime(n), short(n), frameTime(n) + 1e-6, frameTime(n) + 0.25 / FPS, frameTime(n) + 0.5 / FPS, frameTime(n) + 0.99 / FPS]) {
      const s = sacrificeAt(t);
      assert.equal(s.film, n, `the film's frame at ${t} s`);
      assert.equal(s.frame, n, `the cel at ${t} s is the film's frame ${n}`);
      assert.equal(s.hold, false);
    }
  }
  // never behind and never ahead of the film: at every millisecond of 319 to 330 the cel is the film's frame
  for (let t = FROM; t < frameTime(CUT); t += 0.001) { const s = sacrificeAt(t); assert.equal(s.frame, frameAt(t), `at ${t.toFixed(3)} s`); }
  // no crossfade: the plan names one cel
  assert.equal('next' in sacrificeAt(10.9), false); assert.equal('blend' in sacrificeAt(10.9), false);
});

test('THE HOLD: from the cut to the hit (331, 11.044 s) cel 330 holds over the burst to frame 348; gone on 349', () => {
  for (let n = CUT; n < END; n++) {
    const s = sacrificeAt(frameTime(n) + 0.5 / FPS);
    assert.deepEqual([s.on, s.film, s.frame, s.hold], [true, n, 330, true], `frame ${n}`);
  }
  assert.equal(sacrificeAt(frameTime(END)).on, false);
  assert.equal(sacrificeAt(frameTime(END) + 0.5 / FPS).on, false);
});

test('the fades are the film\'s frames: in over the first 0.1 s (319 a quarter, 320 three quarters), out over the last (347, 348), whole between', () => {
  const at = (n) => sacrificeAt(frameTime(n) + 0.5 / FPS).alpha;
  assert.ok(Math.abs(at(319) - ease(1 / 3)) < 1e-12 && at(319) > 0.25, `319 is seen: ${at(319).toFixed(3)}`);
  assert.ok(Math.abs(at(320) - ease(2 / 3)) < 1e-12);
  for (let n = 321; n <= 346; n++) assert.equal(at(n), 1, `frame ${n}`);
  assert.ok(Math.abs(at(347) - ease(2 / 3)) < 1e-12);
  assert.ok(Math.abs(at(348) - ease(1 / 3)) < 1e-12);
  // one alpha a frame: the same at its start and at its end
  for (let n = 319; n < END; n++) assert.equal(sacrificeAt(frameTime(n)).alpha, sacrificeAt(frameTime(n) + 0.99 / FPS).alpha, `frame ${n}`);
});

test('reduced motion: his tag\'s frame alone, whole, still, over the same 30 frames', () => {
  for (let n = 319; n < END; n++) {
    const s = sacrificeAt(frameTime(n) + 0.5 / FPS, null, SACRIFICE, {reduced: true});
    assert.deepEqual([s.on, s.frame, s.alpha, s.still], [true, 325, 1, true], `frame ${n}`);
  }
  assert.equal(sacrificeAt(frameTime(END), null, SACRIFICE, {reduced: true}).on, false);
});

test('where he stands: large at the sphere\'s centre-right, his height in radii, the matte\'s shape kept, the glow\'s margin round the cell', () => {
  const {figure, rect} = rectOf(GEO);
  const [x, y, w, h] = figure;
  assert.ok(Math.abs(h - SACRIFICE.height * GEO.radius) < 1e-9, 'his height is 2.4 radii');
  assert.ok(Math.abs(w / h - SACRIFICE.box[2] / SACRIFICE.box[3]) < 1e-9, 'the matte\'s shape');
  assert.ok(Math.abs(x + w / 2 - (GEO.centre[0] + SACRIFICE.at[0] * GEO.radius)) < 1e-9, 'his centre right of the sphere\'s');
  assert.ok(Math.abs(y + h / 2 - (GEO.centre[1] + SACRIFICE.at[1] * GEO.radius)) < 1e-9, 'and a little below it');
  assert.ok(h > 2 * GEO.radius, 'taller than the sphere');
  assert.ok(x > GEO.centre[0] - GEO.radius && x + w <= GEO.width && y + h <= GEO.height, 'on the stage, over the sphere\'s right side');
  const m = (SACRIFICE.margin / SACRIFICE.zoom) * (h / SACRIFICE.box[3]);
  assert.deepEqual(rect.map((v) => v.toFixed(6)), [x - m, y - m, w + 2 * m, h + 2 * m].map((v) => v.toFixed(6)));
  assert.deepEqual(CELL, [800, 722]);
  assert.ok(Math.abs(rect[2] / rect[3] - CELL[0] / CELL[1]) < 1e-9, 'the cell\'s shape is the canvas\'s');
  const s = sacrificeAt(FROM + 0.5, GEO);
  assert.deepEqual(s.figure, figure); assert.deepEqual(s.rect, rect);
  assert.equal(sacrificeAt(FROM + 0.5).rect, null);
});

test('the matte file: one gray+alpha PNG of the matte\'s box, a few kB, no film pixel in it', () => {
  const buf = fs.readFileSync(here(`./${SACRIFICE.masks}`));
  assert.deepEqual([...buf.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10], 'a PNG');
  assert.equal(buf.toString('latin1', 12, 16), 'IHDR');
  const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20), depth = buf[24], colour = buf[25];
  assert.deepEqual([w, h], [SACRIFICE.box[2], SACRIFICE.box[3]], 'the box\'s size');
  assert.equal(depth, 8);
  assert.equal(colour, 4, 'gray with alpha: a silhouette, no colour of the film');
  assert.ok(buf.length < 32 * 1024, `${buf.length} bytes`);
  assert.ok(SACRIFICE.box[0] + SACRIFICE.box[2] <= SACRIFICE.film[0] && SACRIFICE.box[1] + SACRIFICE.box[3] <= SACRIFICE.film[1], 'inside the film');
});

test('near: the frame callback runs from a second before frame 319 to a quarter second after frame 349', () => {
  assert.equal(near(FROM - 1.01), false); assert.equal(near(FROM - 0.99), true);
  assert.equal(near(TO + 0.24), true); assert.equal(near(TO + 0.26), false);
});

// a stand-in for the page: a stage with the sphere's canvas in a document, 2D contexts that count (and take a filter string, or not), an
// Image the test loads, a film whose frames the test presents, and a helper film whose seeks land at once
function standIn({filters = 'url', reduced = false} = {}) {
  const idle = [], calls = {clear: 0, drawImage: 0, byOwner: {}, log: []}, images = [], videos = [];
  const ctx2d = (owner) => {
    const g = {owner, canvas: owner, globalAlpha: 1, globalCompositeOperation: 'source-over', fillStyle: '', imageSmoothingQuality: 'low', _filter: 'none'};
    if (filters !== 'none') Object.defineProperty(g, 'filter', {
      get() { return this._filter; },
      set(v) { this._filter = v === 'none' || (filters === 'url' ? true : !v.startsWith('url(')) ? v : this._filter; },   // a context that refuses url() keeps its last
    });
    const count = (name) => { const k = owner.id || owner.tagName; (calls.byOwner[k] ??= {clear: 0, drawImage: 0, fillRect: 0})[name]++; };
    g.setTransform = () => {};
    g.fillRect = () => count('fillRect');
    g.clearRect = () => { count('clear'); if (owner.id === 'hero-sacrifice') calls.clear++; };
    g.drawImage = (src, ...a) => { count('drawImage'); if (owner.id === 'hero-sacrifice') calls.drawImage++; calls.log.push({owner: owner.id || owner.tagName, src: src?.id || src?.tagName || 'image', op: g.globalCompositeOperation, alpha: g.globalAlpha, filter: g._filter, args: a}); };
    return g;
  };
  let ids = 0;
  const node = (tag) => ({
    tagName: tag.toUpperCase(), style: {}, attrs: {}, children: [], parent: null, width: 300, height: 150, id: '', innerHTML: '', n: ++ids,
    setAttribute(k, v) { this.attrs[k] = v; },
    append(...xs) { for (const x of xs) { x.parent = this; this.children.push(x); } },
    after(x) { const sib = this.parent.children; x.parent = this.parent; sib.splice(sib.indexOf(this) + 1, 0, x); },
    remove() { if (!this.parent) return; const sib = this.parent.children; sib.splice(sib.indexOf(this), 1); this.parent = null; },
    get parentNode() { return this.parent; },
    getContext() { this.ctx ??= ctx2d(this); return this.ctx; },
    getBoundingClientRect: () => ({left: 118, top: 75, width: 1205, height: 900, right: 1323, bottom: 975}),
    querySelector(sel) { return sel === '#genesis-sphere' ? this.children.find((c) => c.id === 'genesis-sphere') ?? null : null; },
  });
  const video = () => {
    const v = node('video'); const listeners = {};
    Object.assign(v, {
      muted: false, preload: '', playsInline: false, src: '', readyState: 0, _t: 0, seeks: [],
      addEventListener(type, fn) { (listeners[type] ??= []).push(fn); },
      removeEventListener(type, fn) { listeners[type] = (listeners[type] ?? []).filter((g) => g !== fn); },
      fire(type) { const fs = listeners[type] ?? []; listeners[type] = []; for (const f of fs) f({type}); },
      removeAttribute(k) { if (k === 'src') { this.src = ''; this.readyState = 0; } }, load() { this.loads = (this.loads ?? 0) + 1; },
    });
    Object.defineProperty(v, 'src', {get() { return this._src ?? ''; }, set(s) { this._src = s; this.readyState = s ? 2 : 0; }});
    Object.defineProperty(v, 'currentTime', {get() { return this._t; }, set(t) { this._t = t; this.seeks.push(t); queueMicrotask(() => this.fire('seeked')); }});
    videos.push(v);
    return v;
  };
  class Image { constructor() { images.push(this); } set src(v) { this._src = v; } get src() { return this._src; } }
  const sphereView = {radius: 0.2, yaw: 0, pitch: 0};
  const view = {
    devicePixelRatio: 2, getComputedStyle: () => ({position: 'relative'}), matchMedia: () => ({matches: reduced}), performance: {now: () => performance.now()},
    requestIdleCallback: (f) => idle.push(f), setTimeout: (f) => idle.push(f), genesisSphere: {getViewState: () => sphereView}, Image, console: {warn() {}},
  };
  const doc = {defaultView: view, hidden: false, createElement: (tag) => (tag === 'video' ? video() : node(tag)), createElementNS: (ns, tag) => node(tag),
    getElementById(id) { const find = (el) => el.id === id ? el : el.children?.map(find).find(Boolean); return find(stage) ?? null; }};
  const stage = node('div');
  stage.ownerDocument = doc;
  const sphere = node('canvas'); sphere.id = 'genesis-sphere';
  const front = node('canvas'); front.id = 'hero-front';
  const anti = node('canvas'); anti.id = 'hero-anti-satellites';
  stage.append(sphere, front, anti, node('button'));
  const listeners = {}, waiting = new Map();
  let next = 1;
  const film = {
    paused: true, currentTime: 0, asked: 0, src: 'http://x/app/saint-seiya.mp4?v=53561d47', currentSrc: 'http://x/app/saint-seiya.mp4?v=53561d47', id: 'dl-twelve-film', tagName: 'VIDEO',
    addEventListener(type, f) { (listeners[type] ??= []).push(f); },
    removeEventListener(type, f) { listeners[type] = (listeners[type] ?? []).filter((g) => g !== f); },
    fire(type) { for (const f of listeners[type] ?? []) f({type}); },
    requestVideoFrameCallback(f) { this.asked++; const id = next++; waiting.set(id, f); return id; },
    cancelVideoFrameCallback(id) { waiting.delete(id); },
    present(n, mediaTime = frameTime(n)) { this.currentTime = mediaTime; const fs = [...waiting.values()]; waiting.clear(); for (const f of fs) f(0, {mediaTime}); },
    readyState: 4,
    get waiting() { return waiting.size; },
    listeners,
  };
  const loadMask = () => { for (const f of idle.splice(0)) f(); const img = images.at(-1); assert.ok(img?.src?.endsWith('/sacrifice-masks.png'), 'the matte is asked for'); img.onload(); return img; };
  return {stage, film, idle, calls, images, videos, view, doc, loadMask};
}
const tick = () => new Promise((r) => setTimeout(r, 0));

test('the mount: the canvas after the stage\'s last canvas, no pixels at rest, nothing listened to but the film, the matte asked for in idle time', () => {
  const {stage, film, images, idle} = standIn();
  const sac = mountSacrifice({stage, film});
  assert.deepEqual(stage.children.map((c) => c.id || c.tagName), ['genesis-sphere', 'hero-front', 'hero-anti-satellites', 'hero-sacrifice', 'BUTTON']);
  assert.equal(sac.element.id, 'hero-sacrifice');
  assert.equal(sac.element.sacrifice, sac);
  assert.deepEqual(sac.stats.pixels, [0, 0]);
  assert.equal(sac.element.style.visibility, 'hidden');
  assert.equal(sac.element.style.zIndex, undefined);
  assert.deepEqual(Object.keys(film.listeners).sort(), ['emptied', 'ended', 'pause', 'play', 'playing', 'seeked', 'timeupdate']);
  assert.equal(images.length, 0, 'not in the load');
  assert.equal(idle.length, 1);
  for (const f of idle.splice(0)) f();
  assert.equal(images.length, 1);
  assert.equal(sac.stats.mask, 'loading');
  images[0].onload();
  assert.equal(sac.stats.mask, 'ready');
  // at rest, far from the second: a timeupdate is a comparison, no callback waits, no pixels
  film.paused = false; film.currentTime = 3; film.fire('timeupdate');
  assert.equal(film.waiting, 0); assert.deepEqual(sac.stats.pixels, [0, 0]); assert.equal(sac.stats.draws, 0); assert.equal(sac.stats.once.ready, false);
  sac.destroy();
  assert.equal(stage.children.some((c) => c.id === 'hero-sacrifice'), false);
  assert.equal(Object.values(film.listeners).flat().length, 0);
});

test('THE FIGURE IS NEVER BEHIND THE FILM: for every presented frame 319 to 330 the cel drawn is that frame, cut from it on it; 330 holds to 348', () => {
  const {stage, film, calls, loadMask} = standIn();
  const sac = mountSacrifice({stage, film});
  loadMask();
  film.paused = false;
  film.currentTime = 9; film.fire('timeupdate');
  assert.equal(film.waiting, 0, 'more than a second before: no callback');
  film.currentTime = 9.7; film.fire('timeupdate');
  assert.equal(film.waiting, 1, 'a second before: the callback waits');
  assert.equal(sac.stats.once.ready, true, 'the rim and the glow made as it comes near, not on a frame');
  for (let n = 291; n < 319; n++) { film.present(n); assert.equal(film.waiting, 1); }
  assert.equal(sac.stats.draws, 0); assert.equal(sac.stats.prepared, 0); assert.deepEqual(sac.stats.pixels, [0, 0]);
  for (let n = 319; n <= 330; n++) {
    const before = calls.log.length;
    film.present(n, n % 2 ? short(n) : frameTime(n));   // half of them with a mediaTime a microsecond short
    const d = sac.stats.drawn;
    assert.equal(d.film, n); assert.equal(d.frame, n, `frame ${n} shows cel ${d.frame}`);
    assert.equal(sac.stats.prepared, n - 318, 'its cel cut on its own frame');
    const cut = calls.log.slice(before).filter((c) => c.src === 'dl-twelve-film');
    assert.equal(cut.length, 1, 'from the film itself');
    assert.deepEqual(cut[0].args, [490, 215, 360, 321, 40, 40, 720, 642], 'the matte\'s box of the frame at 2x inside the margin');
    assert.equal(d.alpha, sacrificeAt(frameTime(n)).alpha);
  }
  assert.equal(sac.stats.have, '111111111111');
  assert.equal(sac.stats.draws, 12, 'one draw a frame');
  assert.equal(sac.stats.drawn.alpha, 1);
  assert.equal(sac.element.style.visibility, 'visible');
  assert.deepEqual(sac.stats.pixels, CELL);
  const {rect} = rectOf(GEO);
  assert.deepEqual([sac.element.style.left, sac.element.style.top, sac.element.style.width, sac.element.style.height], rect.map((v) => `${v.toFixed(1)}px`));
  // the cut to the hit: cel 330 holds, drawn again only as it fades
  const draws = sac.stats.draws, cuts = sac.stats.prepared;
  for (let n = CUT; n < END; n++) {
    film.present(n);
    assert.deepEqual([sac.stats.film, sac.stats.drawn.frame], [n, 330], `frame ${n}`);
  }
  assert.equal(sac.stats.prepared, cuts, 'nothing cut from the hit');
  assert.equal(sac.stats.draws, draws + 2, 'the hold redrawn only for 347 and 348');
  // a timeupdate on the frame drawn draws nothing again
  film.fire('timeupdate');
  assert.equal(sac.stats.draws, draws + 2);
  // the second is over: hidden, no pixels, the cut-outs and the rim and the glow let go, the callback released a quarter second on
  film.present(END);
  assert.equal(sac.stats.shown, false); assert.deepEqual(sac.stats.pixels, [0, 0]); assert.equal(sac.stats.have, '000000000000'); assert.equal(sac.stats.once.ready, false);
  assert.equal(film.waiting, 1, 'still near');
  film.present(END + 8);
  assert.equal(film.waiting, 0, 'released');
  sac.destroy();
});

test('while the film plays a timeupdate never draws: the frame callback is the clock, so the figure cannot run ahead of the picture or behind it', () => {
  const {stage, film, loadMask} = standIn();
  const sac = mountSacrifice({stage, film});
  loadMask();
  film.paused = false; film.currentTime = 10.2; film.fire('timeupdate');
  film.present(319); film.present(320);
  const draws = sac.stats.draws;
  film.currentTime = frameTime(322) + 0.01; film.fire('timeupdate');   // the film's clock already in 322, its frame not presented yet
  assert.equal(sac.stats.draws, draws); assert.equal(sac.stats.drawn.frame, 320);
  film.present(321);
  assert.equal(sac.stats.drawn.frame, 321);
  // a jump away while playing hides it at once
  film.currentTime = 40; film.fire('timeupdate');
  assert.equal(sac.stats.shown, false); assert.equal(film.waiting, 0);
  sac.destroy();
});

test('a dropped frame: the next presented frame brings its own cel (never an older one in 319 to 330); in the hold the last cel presented holds', () => {
  const {stage, film, loadMask} = standIn();
  const sac = mountSacrifice({stage, film});
  loadMask();
  film.paused = false; film.currentTime = 10.2; film.fire('timeupdate');
  film.present(319); film.present(320);
  film.present(323);   // 321 and 322 dropped
  assert.equal(sac.stats.drawn.frame, 323); assert.equal(sac.stats.have, '110010000000');
  for (let n = 324; n <= 329; n++) film.present(n);
  film.present(332);   // 330 and 331 dropped: the hold shows the last cel the film presented of him
  assert.deepEqual([sac.stats.film, sac.stats.drawn.frame], [332, 329]);
  assert.equal(sac.stats.helper.runs, 0, 'no helper while the film plays');
  sac.destroy();
});

test('paused or sought onto a frame of 319 to 330: the cel cut from the film itself; sought into the hold: the helper brings cel 330 once, let go', async () => {
  const {stage, film, videos, calls, loadMask, doc} = standIn();
  const sac = mountSacrifice({stage, film});
  loadMask();
  film.paused = true; film.currentTime = 10.9; film.fire('seeked');   // the film shows frame 326
  assert.equal(sac.stats.shown, true);
  assert.deepEqual([sac.stats.drawn.film, sac.stats.drawn.frame], [326, 326]);
  assert.equal(sac.stats.have, '000000010000');
  assert.equal(calls.log.filter((c) => c.src === 'dl-twelve-film').length, 1, 'cut from the film');
  assert.equal(videos.length, 0, 'no helper: the film shows the cel\'s own frame');
  // into the hold, cel 330 never presented: one helper seek to frame 330, then it is let go
  film.currentTime = 11.3; film.fire('seeked');   // frame 338
  assert.equal(sac.stats.drawn.frame, 326, 'meanwhile the last cel cut before 330');
  for (let i = 0; i < 40 && sac.stats.helper.on; i++) await tick();
  assert.equal(videos.length, 1);
  const v = videos[0];
  assert.deepEqual(v.seeks.map((t) => frameAt(t)), [330], 'one seek, to frame 330');
  assert.equal(v.muted, true); assert.equal(v.src, '', 'let go'); assert.equal(v.loads, 1);
  assert.deepEqual([sac.stats.film, sac.stats.drawn.frame], [338, 330]);
  assert.deepEqual(sac.stats.helper, {runs: 1, seeks: 1, ms: sac.stats.helper.ms, on: false});
  // a seek inside with its cel there: nothing to fetch
  film.currentTime = 11.2; film.fire('seeked');
  await tick(); await tick();
  assert.equal(sac.stats.helper.runs, 1);
  // a pause after playing: the film's frame at its second
  film.paused = false; film.fire('play');
  film.present(328); film.paused = true; film.currentTime = frameTime(328) + 0.4 / FPS; film.fire('pause');
  assert.equal(sac.stats.drawn.frame, 328);
  // hidden: nothing drawn
  const drawn = sac.stats.draws;
  doc.hidden = true; film.currentTime = 10.75; film.fire('seeked');
  assert.equal(sac.stats.draws, drawn);
  doc.hidden = false;
  sac.destroy();
  assert.equal(sac.stats.helper.on, false);
});

test('reduced motion: his tag\'s frame alone, whole, drawn once when it is there, held to the end of the second', () => {
  const {stage, film, calls, loadMask} = standIn({reduced: true});
  const sac = mountSacrifice({stage, film});
  loadMask();
  assert.equal(sac.stats.reduced, true);
  film.paused = false; film.currentTime = 10.5; film.fire('timeupdate');
  for (let n = 315; n <= 324; n++) film.present(n);
  assert.equal(sac.stats.prepared, 0, 'only his tag\'s frame is taken');
  assert.equal(sac.stats.shown, true);
  film.present(325);
  assert.equal(sac.stats.prepared, 1); assert.equal(sac.stats.have, '000000100000');
  assert.equal(sac.stats.draws, 1); assert.equal(sac.stats.drawn.alpha, 1);
  for (let n = 326; n < END; n++) film.present(n);
  assert.equal(sac.stats.prepared, 1); assert.equal(sac.stats.draws, 1, 'drawn once');
  assert.equal(calls.drawImage, 1);
  assert.equal(sac.stats.drawn.frame, 325);
  film.present(END);
  assert.equal(sac.stats.shown, false);
  sac.destroy();
});

test('the enhancement: a context that refuses url() gets the contrast and the saturation, one with no filter the zoom alone', () => {
  for (const [filters, want] of [['functions', 'contrast(1.15) saturate(1.1)'], ['none', '']]) {
    const {stage, film, calls, loadMask} = standIn({filters});
    const sac = mountSacrifice({stage, film});
    loadMask();
    film.paused = false; film.currentTime = 10.5; film.fire('timeupdate');
    film.present(319);
    assert.equal(sac.stats.prepared, 1);
    assert.equal(sac.stats.enhance, want, filters);
    const prep = calls.log.find((c) => c.src === 'dl-twelve-film');
    assert.equal(prep.filter, want || 'none');
    assert.equal(sac.stats.once.filters, filters !== 'none');
    sac.destroy();
  }
});

test('a resize while he is shown places him again', () => {
  const {stage, film, view, loadMask} = standIn();
  let observed = null;
  view.ResizeObserver = class { constructor(fn) { this.fn = fn; } observe(el) { observed = this; this.el = el; } disconnect() { observed = null; } };
  const sac = mountSacrifice({stage, film});
  loadMask();
  assert.equal(observed.el, stage);
  film.paused = false; film.currentTime = 10.5; film.fire('timeupdate');
  for (let n = 319; n <= 324; n++) film.present(n);
  const draws = sac.stats.draws;
  observed.fn();
  assert.equal(sac.stats.draws, draws + 1);
  assert.equal(sac.stats.drawn.frame, 324);
  sac.destroy();
  assert.equal(observed, null);
});

test('sacrificeAt costs nothing to ask: microseconds a call at most, the best batch (1.3 us bare, 3.2 us with a geometry, on this Mac at load 249)', () => {
  for (let i = 0; i < 2000; i++) sacrificeAt(FROM + (i % 1000) / 1000, GEO);
  // the best of eight batches: a loaded Mac only ever adds time, so the fastest batch is the call's own cost; the bound is loose for a Mac
  // running the suite in parallel at a load in the hundreds
  let each = Infinity;
  for (let batch = 0; batch < 8; batch++) {
    const t0 = performance.now();
    for (let i = 0; i < 20000; i++) sacrificeAt(FROM + (i % 1000) / 1000, GEO);
    each = Math.min(each, (performance.now() - t0) / 20000);
  }
  assert.ok(each < 0.05, `${(each * 1000).toFixed(3)} us a call`);
});

test('the hero mounts it with two lines: the import after the raid\'s, the mount after the heartbeat\'s, driven by the hero\'s film', () => {
  const lines = page.split('\n');
  const imp = lines.findIndex((l) => l === "import {mountSacrifice} from './sacrifice.js';");
  assert.ok(imp > 0, 'the import');
  assert.equal(lines[imp - 1], "import {mountHeartbeat} from './heartbeat.js';");
  const mount = lines.findIndex((l) => l.includes('mountSacrifice({stage: found.stage, film: found.film});'));
  assert.ok(mount > 0, 'the mount');
  assert.ok(lines[mount - 1].includes('mountHeartbeat({film: found.film, view: found.stage.ownerDocument.defaultView});'), 'right after the heartbeat\'s line (which the heartbeat\'s test keeps after the raid\'s)');
  assert.equal(page.split('mountSacrifice').length, 3, 'twice: the import and the mount');
});

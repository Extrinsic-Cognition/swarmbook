// breakdown.test.mjs: THE BREAKDOWN (scenes.mjs, breakdown.capture.mjs, breakdown.html; his words in their headers). Pure: no browser, no page.
//   node --test lab/breakdown.test.mjs
// - scenes.mjs well formed and in film order, every scene inside the film, its moments the film's own and the files' own;
// - the capture's rules: requests only to the page's origin, GET or HEAD, never the submission's videos; the wall's videos hidden before every
//   picture; the views (a visitor up to the wall's hold, a minter after); the film's place behind the page; a PNG's ink;
// - the manifest's z-order (when lab/breakdown-pictures/manifest.json is there: it is made on this Mac and never committed): every scene's
//   passes in the page's own stacking, their pictures on disk, no video of the wall in any of them;
// - the page: three.js by the lab's import map, nothing at rest (no interval, one requestAnimationFrame, behind its want()).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {fileURLToPath} from 'node:url';
import {SCENES, FILM_S, FPS, STOP_S, HOLD_S, STATUSES, problems, scenesAt} from './scenes.mjs';
import {PASSES, STACK, LAYER_IDS, PRIVATE_CSS, CROP, THEATER_FIT, allowed, viewsOf, viewFor, filmBox, stackProblems, pngInk} from './breakdown.capture.mjs';
import {FILM_CUTS} from './cuts.js';
import {SHOTS, FOLD, ONE} from './cubism.mjs';
import {CLOSE, END} from './unboxing-plan.mjs';
import {KO} from './ko-edge.js';
import {FROM as SACRIFICE_FROM, TO as SACRIFICE_TO} from './sacrifice.js';
import {CHOICE_FRAMES, HOLD_S as PAYWALL_HOLD_S, STOP_S as PAYWALL_STOP_S} from '../app/dl-paywall.js';
import {SEIYA_MOMENTS} from '../app/warm-sphere.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const read = (f) => fs.readFileSync(path.join(HERE, f), 'utf8');
const near = (a, b, eps = 0.002) => Math.abs(a - b) <= eps;

test('scenes.mjs is well formed: every field, ids safe as a folder, a status of the four, his words with their WEST time', () => {
  assert.deepEqual(problems(SCENES), []);
  assert.equal(SCENES.length, 27, 'the house\'s read of his page: 27 scenes');
  for (const s of SCENES) {
    assert.ok(STATUSES.includes(s.status), s.id);
    assert.ok(s.words.length >= 1 && s.words.every((w) => /WEST/.test(w.when) && w.text.length > 8), s.id);
    assert.ok(s.layers.every((l) => /\.(m?js|html)\b/.test(l.file)), `${s.id}: each layer names the file that draws it`);
  }
  assert.deepEqual(problems([...SCENES.slice(0, 2), {...SCENES[2], id: SCENES[0].id}]).length > 0, true, 'a repeated id is caught');
  assert.ok(problems([{...SCENES[0], status: 'done'}]).some((p) => /status/.test(p)), 'an unknown status is caught');
});

test('the scenes are in film order and every one is inside the film', () => {
  for (let i = 0; i < SCENES.length; i++) {
    const s = SCENES[i], prev = SCENES[i - 1];
    assert.ok(s.from >= 0 && s.to <= FILM_S && s.from < s.to, `${s.id}: ${s.from} to ${s.to}`);
    assert.ok(s.t >= s.from && s.t < s.to, `${s.id}: t ${s.t} inside its span`);
    if (prev) { assert.ok(s.t > prev.t, `${s.id} after ${prev.id}`); assert.ok(s.from >= prev.from, `${s.id} begins after ${prev.id} begins`); }
  }
  assert.equal(SCENES[0].from, 0);
  assert.equal(SCENES.at(-1).to, FILM_S);
  // the film's length: theater-light.json read every frame of it
  const light = JSON.parse(read('theater-light.json'));
  assert.ok(light.frames / light.fps <= FILM_S && FILM_S - light.frames / light.fps < 0.05, 'FILM_S is the film\'s length');
  // the spans cover the film with no hole: every second of it is some scene's
  for (let t = 0; t < FILM_S; t += 0.01) assert.ok(scenesAt(t).length >= 1, `no scene at ${t.toFixed(2)} s`);
  // only THE SACRIFICE's second runs over the next span (the first burst's beginning)
  const over = SCENES.filter((s, i) => SCENES[i + 1] && s.to > SCENES[i + 1].from + 1e-9).map((s) => s.id);
  assert.deepEqual(over, ['sacrifice']);
});

test('the scenes\' moments are the film\'s cuts and the files\' own moments', () => {
  const f = (n) => n / FPS;
  const moments = [0, ...FILM_CUTS.map((c) => c[0]), 4.471 /* dolbar-charge.js: frame 134 floods red */, SACRIFICE_FROM, SACRIFICE_TO, ONE.gone,
    PAYWALL_HOLD_S, PAYWALL_STOP_S, 61.767 + CLOSE, 61.767 + CLOSE + END, 86.753 /* hero-mount.js KNIGHTS_CUTS.ikkiShun */, SEIYA_MOMENTS.cosmos,
    SEIYA_MOMENTS.impact, FILM_S];
  for (const s of SCENES) for (const k of ['from', 'to']) assert.ok(moments.some((m) => near(s[k], m)), `${s.id}.${k} ${s[k]} is no moment of the film's or the files'`);
  // the wall and the choice, as app/dl-paywall.js holds them
  assert.ok(near(STOP_S, PAYWALL_STOP_S, 1e-9) && near(HOLD_S, PAYWALL_HOLD_S, 1e-3));
  const by = Object.fromEntries(SCENES.map((s) => [s.id, s]));
  assert.ok(near(by['the-fold'].from, f(CHOICE_FRAMES[0])) && near(by['her-face'].from, f(CHOICE_FRAMES[1])) && near(by['the-column'].from, f(CHOICE_FRAMES[2])));
  assert.ok(near(by['the-fold'].from, FOLD.start) && near(by['her-window'].from, ONE.gone));
  assert.ok(near(by['the-wall'].t, PAYWALL_HOLD_S, 1e-3) && near(by['the-flood'].from, PAYWALL_STOP_S) && near(by['the-flood'].to, SHOTS.at(-1).frames[1] / FPS));
  assert.ok(near(by.sacrifice.from, SACRIFICE_FROM) && near(by.sacrifice.to, SACRIFICE_TO));
  // the bursts (hero-mount.js BURSTS, the page's own mount since lane/one-page) and the KO edge's hit (ko-edge.js) fall inside their scenes
  const bursts = [...read('hero-mount.js').matchAll(/\{t: ([\d.]+), power: 1\}/g)].map((m) => Number(m[1]));
  assert.deepEqual(bursts, [11.044, 37.10]);
  assert.ok(near(by['burst-one'].from, bursts[0]));
  assert.ok(by.grabbed.from <= f(KO.frames.hit) && f(KO.frames.hit) < by.grabbed.to && by.grabbed.t > f(KO.frames.hit));
  // a visitor's scenes are up to the wall's hold, a minter's after it
  for (const s of SCENES) {
    if (s.status === 'on his page') assert.ok(s.t <= PAYWALL_HOLD_S + 1e-3, s.id);
    if (s.status === 'behind the wall') assert.ok(s.t > PAYWALL_HOLD_S + 1e-3, s.id);
  }
  assert.deepEqual(SCENES.filter((s) => s.status === 'held').map((s) => s.id), ['four-knights']);
});

test('the capture asks only the page\'s origin, GET or HEAD, and never the submission\'s videos', () => {
  const o = 'http://127.0.0.1:8921';
  assert.equal(allowed(`${o}/intro/dyson-society/app/saint-seiya.mp4?v=53561d47`, o), true);
  assert.equal(allowed(`${o}/intro/dyson-society/lab/hero-ab.html?v=film`, o, 'HEAD'), true);
  assert.equal(allowed(`${o}/intro/dyson-society/submission/demo.mp4`, o), false);
  assert.equal(allowed(`${o}/intro/dyson-society/submission/pitch.mp4`, o), false);
  assert.equal(allowed(`${o}/intro/dyson-society/%73ubmission/demo.mp4`, o), false, 'an encoded path is read decoded');
  assert.equal(allowed(`${o}~/Movies/room/x.mov`, o), false);
  assert.equal(allowed('http://127.0.0.1:8904/nest/ref/mint/seiya-tags', o), false, 'another port is another origin');
  assert.equal(allowed('https://fonts.googleapis.com/css2?family=DM+Sans', o), false);
  assert.equal(allowed(`${o}/lock/touchid`, o, 'POST'), false, 'no POST ever leaves: the house\'s lock is never asked');
  assert.equal(allowed('data:image/png;base64,AAAA', o), true);
  assert.equal(allowed('not a url', o), false);
});

test('the wall\'s videos are hidden before every picture: the rule, and the capture asserting it before each shot', () => {
  const rule = PRIVATE_CSS.replace(/\s+/g, '');
  assert.match(rule, /#dl-paywallvideo/);
  assert.match(rule, /#dl-paywall-choicevideo/);
  assert.match(rule, /display:none!important/);
  const src = read('breakdown.capture.mjs'), main = src.slice(src.indexOf('async function main'));
  const shots = [...main.matchAll(/await shot\(\)/g)].length;
  assert.equal(shots, 2, 'two places take a picture: the composite and each pass');
  for (const m of main.matchAll(/await shot\(\)/g)) {
    const before = main.slice(Math.max(0, m.index - 260), m.index);
    assert.match(before, /guard\(await page\.ev\(`window\.__bd\.apply\(/, 'every picture comes right after apply(), which asserts the rule and is guarded');
  }
  assert.match(src, /privateCheck = \(\) => \{[\s\S]{0,400}#dl-paywall video, #dl-paywall-choice video/);
  assert.match(main, /if \(leaked\) \{ fs\.rmSync\(dir/, 'a scene where a video showed is not written');
});

test('the views: a visitor up to the wall\'s hold, a minter after; the two addresses of one page', () => {
  const v = viewsOf('http://127.0.0.1:8921/intro/dyson-society/lab/hero-ab.html?v=film&paywall=off');
  assert.equal(v.visitor, 'http://127.0.0.1:8921/intro/dyson-society/lab/hero-ab.html?v=film');
  assert.equal(v.holder, 'http://127.0.0.1:8921/intro/dyson-society/lab/hero-ab.html?v=film&paywall=off');
  assert.equal(v.given, 'holder');
  assert.equal(viewsOf('http://127.0.0.1:8921/intro/dyson-society/app/warm.html').given, 'visitor');
  const by = Object.fromEntries(SCENES.map((s) => [s.id, s]));
  assert.equal(viewFor(by['the-column']), 'visitor');
  assert.equal(viewFor(by['the-wall']), 'visitor');
  assert.equal(viewFor(by['the-flood']), 'holder');
  assert.equal(viewFor(by['the-wall'], 'holder', 'holder'), 'holder');
  for (const s of SCENES) assert.equal(viewFor(s), s.status === 'on his page' ? 'visitor' : 'holder', s.id);
});

test('the film\'s frame stands where the theater has the film behind the page', () => {
  const [x, y, w, h] = filmBox({x: 117.6, y: 0, w: 1204.8, h: 900});
  assert.ok(near(w / h, CROP[2] / CROP[3], 0.01));
  assert.ok(near(x + w / 2, 117.6 + 602.4, 0.1) && near(y + h / 2, 450, 0.1), 'centred on the stage');
  assert.ok(near(h, Math.min(1, (1204.8 / 900) / (CROP[2] / CROP[3])) * THEATER_FIT * 900, 0.1));
});

// a PNG of w x h RGBA with the given opaque pixels
const png = (w, h, dots = []) => {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (const [x, y] of dots) raw.writeUInt32BE(0xff0000ff, y * (w * 4 + 1) + 1 + x * 4);
  const chunk = (type, data) => { const len = Buffer.alloc(4); len.writeUInt32BE(data.length); return Buffer.concat([len, Buffer.from(type, 'latin1'), data, Buffer.alloc(4)]); };
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), chunk('IHDR', ihdr), chunk('IDAT', zlib.deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
};
test('a pass\'s ink is where its PNG holds a pixel; an empty pass has none', () => {
  assert.deepEqual(pngInk(png(8, 6)), {w: 8, h: 6, ink: null});
  assert.deepEqual(pngInk(png(8, 6, [[2, 1], [5, 4]])), {w: 8, h: 6, ink: [2, 1, 4, 4]});
  assert.deepEqual(pngInk(png(3, 3, [[0, 0]])).ink, [0, 0, 1, 1]);
});

test('the stacking: the page\'s own order is taken, any other is not', () => {
  assert.deepEqual(stackProblems(STACK), []);
  assert.deepEqual(stackProblems(STACK.filter((id) => id !== 'irradiance')), [], 'a layer the page did not mount is left out, the rest keep their order');
  assert.ok(stackProblems(['film', 'paper', 'theater', 'sphere']).length > 0, 'the theater under the sphere is not the page');
  assert.ok(stackProblems(['film', 'film']).length > 0);
  assert.deepEqual([...LAYER_IDS].sort(), [...STACK].sort(), 'every layer has its place in the stack');
  assert.equal(PASSES.at(-1).id, 'composite');
  for (const p of PASSES) assert.ok(p.name && p.file && p.how, p.id);
});

const MANIFEST = path.join(HERE, 'breakdown-pictures', 'manifest.json');
test('the manifest\'s z-order is the page\'s, its pictures are on disk, no video of the wall in any', {skip: !fs.existsSync(MANIFEST) && 'no lab/breakdown-pictures/manifest.json here (made on this Mac by breakdown.capture.mjs)'}, () => {
  const m = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  assert.equal(m.schema, 'breakdown/1');
  assert.equal(m.private.shown, 0, 'no video of the wall\'s offer ever showed');
  if (m.private.probe) assert.ok(m.private.videos >= 1, 'the probe stood in the wall and was hidden');
  assert.ok(m.refused.every((r) => !/\/submission\//.test(r) || /^GET /.test(r)), 'the submission\'s files, if asked, were refused');
  const ids = Object.keys(m.scenes);
  assert.ok(ids.length >= 1);
  for (const id of ids) {
    const e = m.scenes[id], s = SCENES.find((x) => x.id === id);
    assert.ok(s, `${id} is a scene of scenes.mjs`);
    assert.ok(near(e.at, s.t, 0.1), `${id} taken at ${e.at} s, its t ${s.t}`);
    assert.equal(e.view, viewFor(s), `${id} in the view its status says`);
    assert.deepEqual(stackProblems(e.order), [], `${id}: ${e.order.join(' > ')}`);
    assert.equal(e.order[0], 'film'); assert.equal(e.order[1], 'paper'); assert.equal(e.order.at(-1), 'dom');
    for (const p of e.passes) {
      if (p.id === 'composite') { assert.equal(p.z, null); continue; }
      assert.equal(p.z, e.order.indexOf(p.id), `${id}/${p.id}: its z is its place in the order`);
      assert.ok(fs.existsSync(path.join(HERE, 'breakdown-pictures', p.png)), `${p.png} on disk`);
    }
    assert.deepEqual(e.passes.filter((p) => p.z !== null).map((p) => p.id), e.order, `${id}: one picture a layer, back to front`);
    assert.ok(e.passes.some((p) => p.id === 'composite'));
  }
});

test('the page: titled Breakdown, three.js by the lab\'s import map, scenes.mjs and the manifest, nothing at rest', () => {
  const html = read('breakdown.html');
  assert.match(html, /<title>Breakdown<\/title>/);
  assert.match(html, /"three": "\.\.\/\.\.\/room\/procedural\/three\.module\.js"/);
  assert.match(html, /from '\.\/scenes\.mjs'/);
  assert.match(html, /breakdown-pictures\//);
  assert.doesNotMatch(html, /setInterval/);
  assert.equal([...html.matchAll(/requestAnimationFrame\(/g)].length, 1, 'one requestAnimationFrame, in want()');
  assert.match(html, /const want = \(\) => \{ if \(!raf && !document\.hidden\) raf = requestAnimationFrame\(frame\); \}/);
  assert.equal([...html.matchAll(/setTimeout\(/g)].length, 3, 'the play\'s timer only: started, chained, resumed');
  assert.match(html, /if \(swing\) want\(\);/, 'the frames go on only while the view swings');
  const ignore = fs.readFileSync(path.join(HERE, '..', '.gitignore'), 'utf8');
  assert.match(ignore, /^lab\/breakdown-pictures\/$/m, 'the pictures (frames of the film) are never committed');
});

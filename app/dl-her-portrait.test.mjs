// dl-her-portrait.test.mjs · HER PORTRAIT IS HER DEPOSIT'S HEXAGON: the standard's numbers, and the page's road on stand-ins (no browser, no painter, no
// network): her face on the hexagon her deposit took, by its signature, through the sphere's own hook; everyone's faces on theirs. The served page's
// walk is in the lane's receipt.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { REVEAL, groundOf, HEX, PX, WALL_PX, PASS_PATH, PORTRAIT, POURING, SEEN_EVENT, MADE, frameOf, mountHerPortrait } from './dl-her-portrait.js';

test('the ground is the owner\'s light turned 150 degrees, at one saturation and lightness for everyone', () => {
  assert.equal(groundOf('#ff0000'), 'hsl(150 55% 60%)'); assert.equal(groundOf('#00ff00'), 'hsl(270 55% 60%)'); assert.equal(groundOf('#900BF0'), 'hsl(65 55% 60%)');
  assert.equal(groundOf('#808080'), 'hsl(150 55% 60%)'); assert.equal(groundOf(undefined), 'hsl(150 55% 60%)');
});
test('the hexagon stands point up inside the round crop of a profile picture', () => {
  assert.equal(HEX.length, 6); for (const [x, y] of HEX) assert.ok(Math.abs(Math.hypot(x - 480, y - 480) - 460) < 0.5, `${x},${y}`);
  assert.deepEqual(HEX[0], [480, 20]); assert.equal(PX, 960);
});
const hexAt = (x, y, r, turn = 0) => ({ x, y, points: [0, 1, 2, 3, 4, 5].map((k) => [x + r * Math.sin(k * Math.PI / 3 + turn), y - r * Math.cos(k * Math.PI / 3 + turn)]) });
test('the picture is laid on a hexagon\'s own corners: its top corner on the highest, its right side on the side next to it, leaning as the hexagon leans', () => {
  const near = (p, q) => assert.ok(Math.hypot(p[0] - q[0], p[1] - q[1]) < 0.01, `${p} ${q}`), on = ([a, b, c, d, e, f], u, v) => [a * u + c * v + e, b * u + d * v + f];
  const up = frameOf(hexAt(200, 300, 46)); near(on(up, 0, -460), [200, 254]); near(on(up, 398.4, 0), [200 + 46 * Math.cos(Math.PI / 6), 300]); near(on(up, 0, 0), [200, 300]);
  const lean = hexAt(200, 300, 46, 0.3), f = frameOf(lean); near(on(f, 0, -460), lean.points[0]); near(on(f, 398.4, 0), [(lean.points[1][0] + lean.points[2][0]) / 2, (lean.points[1][1] + lean.points[2][1]) / 2]);
});

const SIG = '5'.repeat(88), OTHER = (k) => String(k).repeat(88);
/** a page's stand-ins: a document that hears and says events, canvases that give a blob, a sphere that keeps the face hook, her making's state */
function page({ st = { light: '#900BF0', parts: { base: '#DBF2D2' } }, open, answer = null, list = null, paint = async () => ({ painted: true }) } = {}) {
  const doc = new EventTarget(), made = [], asks = [], heard = [], reads = [], drew = [], puts = [], loads = [], hooks = [], cams = [], held = { staged: 0, draws: 0, stops: 0 };
  const el = (tag) => ({ tag, style: {}, dataset: {}, children: [], getContext: () => new Proxy({}, { get: () => () => {} }), toBlob(cb) { cb(new Blob([tag])); }, setAttribute() {}, append(c) { this.children.push(c); this.firstChild ??= c; } });
  doc.createElement = (tag) => { const e = el(tag); made.push(e); return e; }; doc.getElementById = (id) => (id === 'genesis-sphere' ? { clientWidth: 1000, clientHeight: 800, getBoundingClientRect: () => ({ left: 0, top: 0, width: 1000, height: 800 }) } : null); doc.head = el('head'); doc.body = el('body'); doc.documentElement = { dataset: {}, style: { p: {}, setProperty(k, v) { this.p[k] = v; }, removeProperty(k) { delete this.p[k]; } } };
  doc.addEventListener(PORTRAIT, (e) => { heard.push(e.detail.painted); doc.hexagon = e.detail.hexagon; });
  const went = [], win = { location: { assign: (u) => went.push(u) }, DL_HER: { state: () => ({ st, open }) }, CustomEvent, performance, genesisSphere: { setSeatFace(fn) { hooks.push(fn); }, camera(shot) { cams.push(shot); }, cameraState: () => ({ zoom: 1, x: 0, y: 0, yaw: 0, pitch: 0, moving: false }) }, setTimeout: (fn, ms) => { if (ms > 3000) setTimeout(fn, 12); }, URL: { createObjectURL: () => `blob:${made.length}`, revokeObjectURL() {} } };
  const fetcher = async (url, init) => {
    if (!init) { reads.push(url); return list ? { ok: true, status: 200, json: async () => list } : { ok: false, status: 503, json: async () => null }; }
    if (init.method === 'PUT') { puts.push([url, init.headers['content-type'], init.body instanceof Blob]); return { ok: true, status: 200, json: async () => ({ picture: `${PASS_PATH}/abc.jpg` }) }; }
    asks.push([url, JSON.parse(init.body)]); return answer; };
  const her = mountHerPortrait({ win, doc, fetcher, hold: async () => { held.staged++; return { draw: () => { held.draws++; return { live: true }; }, rest() {}, stop() { held.stops++; } }; }, draw: async () => ({ drawn: true }), drawMany: async (sts, o) => { drew.push({ sts, px: o.px }); sts.forEach((x, i) => o.each({ face: i }, i)); }, paint, load: async (url) => { loads.push(url); if (/broken/.test(url)) throw new Error('no picture'); return { picture: url }; } });
  const say = async (type, detail) => { doc.dispatchEvent(new CustomEvent(type, { detail })); await new Promise((ok) => setTimeout(ok, 5)); };
  /** the sphere draws a seat's hexagon: how many pictures the hook lays on it */
  const drawSeat = (id) => { let n = 0; const ctx = new Proxy({}, { get: (_, k) => (k === 'drawImage' ? () => { n++; } : () => {}) }); hooks.at(-1)?.(ctx, { id, ...hexAt(300, 300, 40), mid: [300, 300], show: 1, center: [500, 400], radius: 250 }); return n; };
  const press = (x, y, target = {}, from = [x, y]) => { const d = new Event('pointerdown'); Object.assign(d, { clientX: from[0], clientY: from[1] }); doc.dispatchEvent(d); const e = new Event('click'); Object.assign(e, { clientX: x, clientY: y }); Object.defineProperty(e, 'target', { value: target }); doc.dispatchEvent(e); };
  return { held, st, cams, went, press, doc, her, asks, reads, drew, puts, loads, heard, hooks, say, drawSeat, door: () => doc.body.children.find((c) => c.className === 'dl-her-pfp') };
}
const pass = (status, body) => ({ ok: status === 200, status, json: async () => body });

test('with no deposit in the visit: her portrait is made and can be saved, no door is asked for a pass, and no hexagon takes it', async () => {
  const p = page(); await p.say(SEEN_EVENT, { type: MADE });
  assert.deepEqual(p.heard, [false]); assert.equal(p.asks.length, 0); assert.equal(p.door().download, 'swarmy.png'); assert.equal(p.door().href, p.her.state().url);
  assert.equal(p.door().hidden, true); assert.equal(p.hooks.length, 0, 'the sphere is given no face'); assert.match(p.her.state().why, /no deposit/);
});
test('her deposit\'s hexagon takes her face: her drawing first, then her painting, by the deposit\'s signature; her colours ride the ask; her drawing is kept, then her painting', async () => {
  const p = page({ answer: pass(200, { jwt: 'a-pass', hexagon: 37 }) }); await p.say(POURING, { signature: SIG, usd: 12, tier: 'bronze' }); await p.say(SEEN_EVENT, { type: MADE });
  assert.deepEqual(p.asks, [[PASS_PATH, { signature: SIG, colours: { light: '#900BF0', base: '#DBF2D2' } }]]); assert.deepEqual(p.heard, [false, true]); assert.equal(p.her.state().painted, true);
  assert.equal(p.drawSeat(SIG), 1, 'the sphere\'s hook lays her face on her own seat'); assert.equal(p.drawSeat(OTHER(7)), 0, 'and on no other'); assert.equal(p.her.state().shown, true);
  const near = (v, to) => Math.abs(v - to) < 1e-3, c0 = p.cams[0]; assert.equal(p.cams.length, 1, 'the camera comes to her face once a making'); assert.equal(c0.zoom, REVEAL.zoom);
  assert.ok(near(c0.yaw, -.23) && near(c0.pitch, .115), `the sphere is turned until her hexagon, up and left of its middle at the rim, leans ${REVEAL.tilt} rad from the visitor (${c0.yaw}, ${c0.pitch})`); assert.ok(near(c0.x, .3696) && near(c0.y, .151), `and brought to the middle of the page, above its call (${c0.x}, ${c0.y})`);
  p.drawSeat(SIG); assert.ok(near(p.cams[1].x, .2) && near(p.cams[1].y, .045) && p.cams[1].zoom === undefined, 'once it stands, the last of the way is measured and taken'); for (let i = 0; i < 12; i++) p.drawSeat(SIG); assert.equal(p.cams.length, 1 + REVEAL.tries, 'and again while her seat has not come to the middle, a bounded number of times');
  await new Promise((ok) => setTimeout(ok, 40)); assert.deepEqual(p.cams.at(-1), { zoom: 1, x: 0, y: 0, yaw: 0, pitch: 0, ms: REVEAL.back }, 'and it goes back where it stood when her painting has stood');
  assert.equal(p.door().download, 'swarmy-37.png'); assert.equal(p.doc.hexagon, 37); assert.equal(p.doc.body.children.filter((c) => c.className === 'dl-her-pfp').length, 1);
  assert.deepEqual(p.puts, [[`${PASS_PATH}/${SIG}`, 'image/jpeg', true], [`${PASS_PATH}/${SIG}`, 'image/jpeg', true]], 'her drawing is sent to the house at once, then her painting over it'); assert.equal(p.her.state().kept, `${PASS_PATH}/abc.jpg`);
});
test('her colours are given inside her own hexagon: when her making opens her face stands on her seat, the camera comes and stays, each colour is drawn there, and her made starts from there', async () => {
  const p = page({ open: true, answer: pass(200, { jwt: 'a-pass', hexagon: 37 }) }), root = p.doc.documentElement; await p.say('dl-tank-filled', { usd: 12 }); assert.equal(p.held.staged, 0, 'with no deposit in the visit, no seat to stand on');
  await p.say(POURING, { signature: SIG }); await p.say('dl-tank-filled', { usd: 12 }); await p.say('dl-tank-filled', { usd: 12 }); assert.deepEqual(p.held, { staged: 1, draws: 1, stops: 0 }, 'her painter is staged once and kept; her face as she is now');
  assert.equal(p.drawSeat(SIG), 1); assert.equal(p.cams.length, 1, 'the camera comes to her seat'); assert.equal(p.her.state().live, true); assert.equal(root.dataset.herSeat, '', 'and her seat is said to the page'); assert.deepEqual(root.style.p, { '--her-seat-x': '30.0%', '--her-seat-y': '37.5%' });
  await p.say('pointerup'); await new Promise((ok) => setTimeout(ok, 30)); assert.equal(p.held.draws, 1, 'a press that changes no colour draws nothing'); p.st.parts.base = '#112233'; await p.say('pointerup'); await new Promise((ok) => setTimeout(ok, 30)); assert.equal(p.held.draws, 2, 'a colour given is drawn on her seat');
  await new Promise((ok) => setTimeout(ok, 30)); assert.ok(!p.cams.some((c) => c.ms === REVEAL.back), 'the camera stays through her colouring');
  await p.say(SEEN_EVENT, { type: MADE }); assert.equal(p.held.stops, 1, 'at her made the kept painter is let go'); assert.equal(p.her.state().live, false); const before = p.cams.length; p.drawSeat(SIG); assert.equal(p.cams.length, before + 1, 'and her reveal starts from where the camera stands');
  await new Promise((ok) => setTimeout(ok, 40)); assert.equal(p.cams.at(-1).ms, REVEAL.back); assert.equal('herSeat' in root.dataset, false, 'her seat is no longer said once the camera has gone back'); assert.deepEqual(root.style.p, {});
});
test('a refused pass, or a painter that fails, leaves her drawing on her hexagon and says why', async () => {
  const no = page({ answer: pass(429, { error: { message: 'This deposit\'s portraits are painted.' }, hexagon: 4 }) }); await no.say(POURING, { signature: SIG }); await no.say(SEEN_EVENT, { type: MADE });
  assert.deepEqual(no.heard, [false]); assert.match(no.her.state().why, /painted/); assert.equal(no.her.state().n, 4); assert.equal(no.drawSeat(SIG), 1); assert.equal(no.puts.length, 1, 'her drawing is kept all the same: a profile\'s picture never waits on the painter');
  const broke = page({ answer: pass(200, { jwt: 'a-pass' }), paint: async () => { throw new Error('429 no available capacity'); } }); await broke.say(POURING, { signature: SIG }); await broke.say(SEEN_EVENT, { type: MADE });
  assert.deepEqual(broke.heard, [false]); assert.match(broke.her.state().why, /capacity/); assert.equal(broke.her.state().painted, false); assert.equal(broke.drawSeat(SIG), 1);
});
test('everyone\'s faces: at her landing the door\'s list is read; each deposit\'s hexagon takes its painting, or her drawing from its colours when none is kept or it did not come', async () => {
  const c = (light) => ({ light, base: '#111111', coat: '#222222', gold: '#333333', eyes: '#444444', thruster: '#555555' });
  const p = page({ list: { count: 5, hexagons: [{ n: 1, signature: OTHER(1), colours: c('#ff0000'), picture: '/p/one.jpg' }, { n: 2, signature: OTHER(2), colours: c('#00ff00') }, { n: 3, signature: OTHER(3), colours: c('#0000ff'), picture: '/p/broken.jpg' }, { n: 4, colours: c('#ffff00') }, { n: 5, signature: OTHER(4) }] } });
  await p.say(SEEN_EVENT, { type: 'landed' }); assert.deepEqual(p.reads, [PASS_PATH]); assert.deepEqual(p.loads, ['/p/one.jpg', '/p/broken.jpg']); assert.equal(p.her.state().wall, 3); assert.equal(p.her.state().count, 5);
  assert.equal(p.drew.length, 1); assert.equal(p.drew[0].px, WALL_PX); assert.deepEqual(p.drew[0].sts.map((st) => [st.light, st.parts.eyes, st.painted.length]).sort(), [['#0000ff', '#444444', 5], ['#00ff00', '#444444', 5]]);
  for (const k of [1, 2, 3]) assert.equal(p.drawSeat(OTHER(k)), 1, `hexagon ${k}`); assert.equal(p.drawSeat(OTHER(4)), 0, 'a hexagon with no colours has no face'); assert.equal(p.drawSeat('review-001'), 0);
  await p.say(SEEN_EVENT, { type: 'landed' }); assert.equal(p.drew.length, 1, 'a face made once is not made again');
  const none = page({ list: { count: 0, hexagons: [] } }); await none.say(SEEN_EVENT, { type: 'landed' }); assert.equal(none.drew.length, 0); assert.equal(none.hooks.length, 0, 'with no face yet, nothing is staged and the sphere is given nothing');
});

test('a press on someone\'s face opens their page, when the list names one; a press elsewhere, on a link, or at the end of a drag opens nothing', async () => {
  const c = (light) => ({ light, base: '#111111', coat: '#222222', gold: '#333333', eyes: '#444444', thruster: '#555555' });
  const p = page({ list: { count: 3, hexagons: [{ n: 1, signature: OTHER(1), colours: c('#ff0000'), handle: 'seiya' }, { n: 2, signature: OTHER(2), colours: c('#00ff00') }, { n: 3, signature: OTHER(3), colours: c('#0000ff'), handle: '../evil' }] } });
  await p.say(SEEN_EVENT, { type: 'landed' }); p.press(300, 300); assert.deepEqual(p.went, [], 'before the sphere has drawn it, nowhere to press');
  for (const k of [1, 2, 3]) p.drawSeat(OTHER(k));   // each stands at (300, 300), 40 px to a corner, in this stand-in
  p.press(600, 600); p.press(300, 300, { closest: () => ({}) }); p.press(300, 300, {}, [240, 300]); assert.deepEqual(p.went, [], 'elsewhere, on a link, or at the end of a drag that turned the sphere: nothing'); assert.deepEqual(p.her.state().pages.map((q) => q.handle), ['seiya']); p.press(300, 300); assert.deepEqual(p.went, ['/seiya'], 'the one whose depositor has a page, and only a handle that is a handle');
});

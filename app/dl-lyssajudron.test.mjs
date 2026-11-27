// dl-lyssajudron.test.mjs: her Lyssajudron on the page, the dark one of Harmony's DMC4 entrance (dl-lyssajudron.js; his Oct 22 2026 16:3x WEST,
// "can you make the keyboard box opened dmc4 lyssajudron appear onto the screen just like athena onto its own overlay?").
//   node --test dl-lyssajudron.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, statSync} from 'node:fs';
import {LYSSA_Z, CARD, LINES, BOX, ENTRANCE, HOME_SCALE, RISE_MS, riseAt, mountLyssajudron} from './dl-lyssajudron.js';
import {LAYER_Z} from './dl-athena.js';

const here = (p) => new URL(p, import.meta.url);
const boss = readFileSync(here('../../room/boss-intro.mjs'), 'utf8'), src = readFileSync(here('./dl-lyssajudron.js'), 'utf8');

test('her card and her lines are Harmony\'s own (boss-intro.mjs BOSS), her layer over Athena\'s', () => {
  assert.match(boss, /name: 'Lyssajudron', epithet: 'Genie of Three Wishes',/); assert.deepEqual({...CARD}, {name: 'Lyssajudron', epithet: 'Genie of Three Wishes'}); assert.match(boss, /lines: Object\.freeze\(\['I am Lyssajudron\. Try to look impressed\.', 'Three wishes\. Make them worth my time\.'\]\)/); assert.deepEqual([...LINES], ['I am Lyssajudron. Try to look impressed.', 'Three wishes. Make them worth my time.']); assert.ok(LYSSA_Z > LAYER_Z, 'over Athena\'s layer');
  // Harmony's card grammar, as Athena's copies it: the slam and the focus lines
  for (const [mine, theirs] of [[/@keyframes dl-lyssa-slam\{to\{transform:scale\(1\) skewX\(-10deg\);opacity:1\}\}/, /@keyframes boss-slam\{to\{transform:scale\(1\) skewX\(-10deg\);opacity:1\}\}/],
    [/\.dl-lyssa-lines\{inset:-20%;opacity:0;background:repeating-conic-gradient\(from 3deg at 50% 50%,rgba\(8,6,10,\.9\) 0deg 1\.1deg,transparent 1\.1deg 5\.3deg\)/,
      /\.boss \.lines\{inset:-20%;opacity:0;background:repeating-conic-gradient\(from 3deg at 50% 50%,rgba\(8,6,10,\.9\) 0deg 1\.1deg,transparent 1\.1deg 5\.3deg\)/]]) {
    assert.match(src, mine); assert.match(boss, theirs, 'as Harmony draws it');
  }
});

test('her entrance: her box trembling out of Athena\'s hand on ゴゴゴ, she rises out of it on the hit (ドン), her moods with her two lines, she sinks back, the box flies home', () => {
  let last = -1;
  for (const b of ENTRANCE) { assert.ok(b.at > last, 'beats in order'); last = b.at; }
  assert.equal(ENTRANCE[0].mood, null, 'inside her box'); assert.equal(ENTRANCE[0].sfx, 'ゴゴゴ');
  const hit = ENTRANCE.find((b) => b.hit); assert.equal(hit.mood, 'awake'); assert.equal(hit.sfx, 'ドン'); assert.equal(hit.rise, true);
  assert.deepEqual(ENTRANCE.filter((b) => b.say).map((b) => [b.mood, b.say]), [['unimpressed', LINES[0]], ['charge', LINES[1]]]); assert.equal(ENTRANCE.find((b) => b.card === false), ENTRANCE.find((b) => b.say), 'the card leaves on her first line'); assert.ok(ENTRANCE.at(-3).sink && ENTRANCE.at(-2).home && ENTRANCE.at(-1).done);
  for (const [i, b] of ENTRANCE.entries()) if (b.say) assert.ok(b.say.length / ((ENTRANCE[i + 1].at - b.at) / 1000) <= 26, `beat ${i} readable`);
  assert.match(src, /export const BOX = new URL\('\.\/assets\/lyssajudron-box\.png', import\.meta\.url\);/, 'a literal the build ships');
  const size = statSync(BOX).size; assert.ok(size > 3000 && size < 60000, `her box: ${size} B`);
  assert.ok(HOME_SCALE > 0 && HOME_SCALE < 0.3); assert.equal(riseAt(0), 0); assert.equal(riseAt(RISE_MS), 1); assert.equal(riseAt(RISE_MS * 9), 1);
  const peak = Math.max(...Array.from({length: 50}, (_, i) => riseAt((i / 49) * RISE_MS))); assert.ok(peak > 1 && peak < 1.12, `a small overshoot: ${peak}`);
});

// a page enough for her layer: elements with classes, children, style and a box; timers run by hand
function page() {
  const timers = []; let now = 0;
  const el = (tag) => {
    const classes = new Set(), e = {tag, children: [], style: {}, dataset: {}, hidden: false, textContent: '', offsetWidth: 1, src: '',
      classList: {add: (...c) => c.forEach((k) => classes.add(k)), remove: (...c) => c.forEach((k) => classes.delete(k)), contains: (k) => classes.has(k)},
      set className(v) { classes.clear(); String(v).split(/\s+/).filter(Boolean).forEach((k) => classes.add(k)); }, get className() { return [...classes].join(' '); },
      append: (...k) => e.children.push(...k), replaceChildren: (...k) => { e.children = k; e.textContent = k.map((x) => (typeof x === 'string' ? x : x.textContent)).join(''); },
      setAttribute: () => {}, getBoundingClientRect: () => ({left: 100, top: 100, width: 400, height: 400}), getContext: () => null};
    Object.defineProperty(e.style, 'cssText', {set() { for (const k of Object.keys(e.style)) delete e.style[k]; }, enumerable: false});
    return e;
  };
  const doc = {createElement: el, head: el('head'), body: el('body')};
  const win = {Image: function Image() {}, setTimeout: (f, ms) => { timers.push({f, at: now + ms}); return timers.length; }, clearTimeout: (id) => { if (timers[id - 1]) timers[id - 1].f = null; },
    performance: {now: () => now}, requestAnimationFrame: (f) => { timers.push({f: () => f(now), at: now + 16}); return timers.length; }, cancelAnimationFrame: (id) => { if (timers[id - 1]) timers[id - 1].f = null; }};
  const run = (ms) => { const end = now + ms; for (;;) { const t = timers.filter((x) => x.f && x.at <= end).sort((a, b) => a.at - b.at)[0]; if (!t) break; now = t.at; const f = t.f; t.f = null; f(); } now = end; };
  return {doc, win, run, layer: () => doc.body.children[0]};
}

test('play: her layer shown, out of Athena\'s hand, the hit, she rises, her moods and lines with their stings, she sinks, home, the promise kept; stop ends her at once', async () => {
  const p = page(), api = mountLyssajudron({win: p.win, doc: p.doc}), layer = p.layer(), [white, lines, plate, her, sfx, say] = layer.children, [body, box] = her.children;
  assert.equal(p.win.dlLyssajudron, api); assert.equal(layer.hidden, true, 'unseen until Athena hands her box over'); assert.equal(body.tag, 'canvas'); assert.equal(body.width, 150); assert.equal(box.tag, 'img'); assert.match(box.src, /lyssajudron-box\.png$/);
  let kept = false; const played = api.play({from: [140, 380]}).then(() => { kept = true; });
  assert.equal(layer.hidden, false); assert.ok(layer.classList.contains('go')); assert.equal(her.dataset.mood, 'box'); assert.equal(sfx.textContent, 'ゴゴゴ'); assert.equal(api.state().playing, true); assert.equal(white.tag, 'i'); assert.equal(lines.tag, 'i');
  p.run(800); assert.ok(layer.classList.contains('hit'), 'the hit'); assert.equal(her.dataset.mood, 'awake'); assert.equal(sfx.textContent, 'ドン');
  p.run(900); assert.ok(api.state().rise > 0.98, 'out of her box'); assert.ok(her.classList.contains('out'), 'the box behind her now');
  p.run(800); assert.ok(plate.classList.contains('gone'), 'the card leaves'); assert.equal(say.textContent, LINES[0]); assert.equal(her.dataset.mood, 'unimpressed');
  assert.equal(say.children.at(-1).textContent, 'Try to look impressed.', 'the sting');
  p.run(2100); assert.equal(say.textContent, LINES[1]); assert.equal(her.dataset.mood, 'charge');
  p.run(2100); assert.equal(api.state().mood, 'awake'); p.run(440); assert.ok(api.state().rise < 0.05, 'back in her box'); assert.equal(her.classList.contains('out'), false);
  p.run(100); assert.equal(her.dataset.mood, 'box', 'her box flies home'); assert.equal(her.style.opacity, '0');
  p.run(600); await played; assert.equal(kept, true); assert.equal(layer.hidden, true); assert.equal(api.state().playing, false);
  // a skip of Athena's entrance stops her where she is, frames and all
  let stopped = false; const again = api.play({from: null}).then(() => { stopped = true; });
  p.run(900); api.stop(); await again; assert.equal(stopped, true); assert.equal(layer.hidden, true); assert.equal(api.state().plays, 2);
  p.run(9000); assert.equal(layer.hidden, true, 'no beat of hers after the stop'); assert.equal(api.state().frames, 0, 'no context, nothing drawn');
});

// HER COSMOS SCENE (his Oct 30 2026: her station's scene, then "...use the lyssajudron and "pour liquor" in it... explaining the difference between 3 pentagons active
// and 12 pentagons total... burn my cosmos"): three lit, nine dark wanting fuel, the liquor poured lighting them one by one to twelve, then his "go burn your
// cosmos"; played by her station on the world, Harmony's door after it. THE AGENTS ON YOUR CANVAS (his ~21:3x UTC "make it about canvas-mcp and spatial computing
// agents"): between her three and her empty tank, Claude in the visitor's room over MCP, one canvas, theirs and the visitor's, and they draw and point, never over
// the visitor's own
test('her cosmos scene: twelve agents, three awake, Claude in your room, one canvas, they draw and point never over yours, one router they burn through, she is broke, the pour lights the nine one by one, "go burn your cosmos"; held as read; kept for its words, her station now plays her poem', async () => {
  const {SCENES, COSMOS, ENTRANCE, beatsOf, cosmosBeats} = await import('./dl-lyssajudron.js');
  const S = SCENES.cosmos;
  assert.equal(SCENES.entrance, ENTRANCE, 'her first entrance as it was'); assert.equal(SCENES.snowtrace, undefined, 'the old Snowtrace scene is gone'); assert.deepEqual(S.slice(0, 2).map((b) => [b.at, b.sfx, !!b.hit]), [[0, 'ゴゴゴ', false], [750, 'ドン', true]], 'the same hit and card');
  const says = S.filter((b) => b.say), line = (re) => says.findIndex((b) => re.test(b.say));
  assert.deepEqual(says.map((b) => b.say), COSMOS.map((l) => l.say), 'her lines, in order'); assert.equal(says[0].rung, 3, 'she opens on her three lit'); assert.match(says[0].say, /Three awake/); assert.match(says[0].say, /agents/);
  const claude = line(/Claude/), canvas = line(/canvas/), draws = line(/They draw/), router = line(/router/);
  const empty = says.findIndex((b) => b.mood === 'empty'), pour = says.findIndex((b) => b.pour === true), last = says.length - 1;
  assert.equal(says[claude].say, 'Claude, in your room.', 'Claude in the visitor\'s room: spatial computing agents, no code in her mouth (his Oct 22 "can you not speak in code to the user?")'); assert.equal(says[canvas].say, 'One canvas. Yours and theirs.', 'one canvas, shared'); assert.match(says[draws].say, /Never over yours/, 'canvas-mcp\'s law of the door: an agent appends, it never overwrites'); assert.equal(says[draws].sfx, 'サッ'); assert.match(says[router].say, /One router\. Every agent burns through it\./, 'his 20:59 "a swarm that shares a router": the fuel they burn');
  assert.ok(!COSMOS.some((l) => /futarch|cognitio|pentagon|codec|neuro|\bMCP\b/i.test(l.say)), 'no name the visitor has not met, no code, nothing of the codec'); assert.deepEqual([0, claude, canvas, draws, router, empty, pour, last], [...says.keys()], 'twelve agents three awake, Claude in your room, one canvas, they draw, one router, broke, the pour, the cosmos'); assert.equal(says[empty].fuel, 0); assert.match(says[empty].say, /Nine still asleep/); assert.equal(says[pour].sfx, 'トクトク'); assert.equal(says[pour].say, 'Fuel me.');
  const climb = S.filter((b) => !b.say && Number.isInteger(b.rung)).map((b) => b.rung);
  assert.deepEqual(climb, [4, 5, 6, 7, 8, 9, 10, 11, 12], 'the nine lit one at a time');
  const pourAt = says[pour].at, nextAt = says[last].at;
  assert.ok(nextAt - pourAt >= 4800, 'a pour long enough to see each one light'); assert.ok(S.filter((b) => !b.say && Number.isInteger(b.rung)).every((b) => b.at > pourAt && b.at < nextAt), 'while the liquor pours'); assert.equal(says[last].rung, 12); assert.equal(says[last].pour, false); assert.equal(says[last].sfx, 'カッ'); assert.equal(says[last].mood, 'charge'); assert.ok(says[last].say.endsWith('go burn your cosmos.'), 'his second person'); assert.ok(!COSMOS.some((l) => /my cosmos/i.test(l.say)), 'never "my cosmos" (his Oct 30 03:13)');
  for (const l of COSMOS) assert.ok(l.say.length <= 52, `one idea a beat: ${l.say}`);
  says.slice(1).forEach((b, i) => assert.ok(b.at - says[i].at >= Math.max(1700, (says[i].say.length / 17) * 1000), 'each held as a subtitle reads it'));
  assert.deepEqual(S.slice(-3).map((b) => Object.keys(b).filter((k) => ['sink', 'home', 'done'].includes(k))), [['sink'], ['home'], ['done']], 'back into her box'); assert.equal(says[0].card, false); assert.deepEqual(beatsOf(['x']).map((b) => b.at), [0, 750, 2400, 4600, 5050, 5550]); assert.deepEqual(cosmosBeats([{say: 'a', rung: 1}, {say: 'b', climb: 3}]).filter((b) => !b.say && Number.isInteger(b.rung)).map((b) => b.rung), [2, 3]);
  const src = readFileSync(new URL('./dl-lyssajudron.js', import.meta.url), 'utf8');
  assert.match(src, /if \(beat\.pour !== undefined\) her\.classList\.toggle\?\.\('pour', !!beat\.pour\);/, 'the liquor on its beat'); assert.match(src, /stage\?\.charge\?\.\(\{seats: \[\.\.\.Array\(n\)\.keys\(\)\], lit: \[\.\.\.Array\(n\)\.keys\(\)\]\}\)/, 'her pentagons lit by her renderer\'s own charge'); assert.match(src, /liveHost\.append\(make\('i', 'dl-lyssa-pour'\)\)/, 'the stream rides her live self');
});

// A SCENE OWNS THE SCREEN (his Oct 30 2026 "there is no proper page break, i cant have the previous hero above it breaking mid way"): her scenes stand on their
// own night, her first entrance over Athena's film as it was; her station puts the world flush at the top before her scene
test('a scene owns the screen: her scenes on their own night, her first entrance unveiled; the world flush at the top before her station\'s scene', () => {
  const src = readFileSync(new URL('./dl-lyssajudron.js', import.meta.url), 'utf8');
  assert.match(src, /\.dl-lyssa-layer\.scene \.dl-lyssa-veil\{opacity:1\}/); assert.match(src, /layer\.classList\[BEATS !== ENTRANCE \? 'add' : 'remove'\]\('scene'\)/, 'every scene but her first entrance'); assert.match(src, /classList\.remove\('go', 'hit', 'scene'\)/, 'gone with her');
  const spatial = readFileSync(new URL('./warm-spatial.js', import.meta.url), 'utf8');
  assert.match(spatial, /panel\.scrollIntoView\(\{block:'start',behavior:'auto'\}\);[^\n]*\n\s*try\{await import\('\.\/dl-lyssajudron\.js/, 'the world at the top, then her scene');
});

// HER SCENES WEAR THE VISITOR'S OWN (his Oct 30 2026 "why the fuck are you using that ugly shitty lyssajudron? use the one the user just fucking customized"): her
// scenes show her making's picture in place of the pixel body and its box; her first entrance (before any making) keeps her pixel body
test('her scenes wear the visitor\'s own: her making\'s picture in place of the pixel body, her moods as light on it; the picture has a home outside the commented kit', () => {
  const src = readFileSync(new URL('./dl-lyssajudron.js', import.meta.url), 'utf8'), page = readFileSync(new URL('./warm.html', import.meta.url), 'utf8');
  assert.match(src, /export const SWARMY_IMG = '\[data-kit-her\]'/); assert.match(src, /const mine = BEATS !== ENTRANCE \? doc\.querySelector\?\.\(SWARMY_IMG\) : null/, 'every scene but her first entrance'); assert.match(src, /\/\^\(blob\|data\):\/\.test\(src\)\) \{ me\.src = src; her\.classList\.add\('swarmy'\); \} else her\.classList\.remove\('swarmy'\)/, 'only a picture this page made'); assert.match(src, /\.dl-lyssa-her\.swarmy \.dl-lyssa-body,\.dl-lyssa-her\.swarmy \.dl-lyssa-box\{display:none\}/);
  assert.match(src, /\[data-mood="empty"\] :is\(\.dl-lyssa-me,\.dl-lyssa-live\)\{filter:grayscale/); assert.match(src, /\[data-mood="charge"\] :is\(\.dl-lyssa-me,\.dl-lyssa-live\)\{filter:brightness/);
  // her picture's home: one [data-kit-her] outside every commented range, unseen (the guide, dl-athena.js SWARMY.img, and her scenes read it)
  const live = page.replace(/<template data-commented-out>[\s\S]*?<\/template>/g, '');
  assert.equal((live.match(/data-kit-her/g) ?? []).length, 1, 'one home in the live page'); assert.match(live, /<div class="dl-swarmy-holder" hidden><img data-kit-her alt="" hidden><\/div>/);
});

// SHE FLOATS (his Oct 30 2026 "...can you use tricks like him floating and moving around the screen zooming biggening and smallening to give idea of floating..."):
// her own picture drifts across the screen, nearer and farther, while she is out; still for a reader who asked for less motion
test('she floats: her picture drifts across the screen, larger near and smaller far, only while she is out; still with reduced motion', () => {
  const src = readFileSync(new URL('./dl-lyssajudron.js', import.meta.url), 'utf8');
  const kf = src.match(/@keyframes dl-lyssa-float\{([^]*?)\}\n@keyframes/)[1], scales = [...kf.matchAll(/scale:([\d.]+)/g)].map((m) => Number(m[1]));
  assert.ok(Math.max(...scales) >= 1.2 && Math.min(...scales) <= .8, 'nearer and farther'); assert.ok([...kf.matchAll(/translate:([\d.]+)vw/g)].some((m) => Number(m[1]) >= 30), 'across the screen'); assert.match(src, /\.dl-lyssa-her\.swarmy:not\(\[data-mood="box"\]\) :is\(\.dl-lyssa-me,\.dl-lyssa-live\)\{animation:dl-lyssa-float/, 'only while she is out'); assert.match(src, /prefers-reduced-motion:reduce\)\{\.dl-lyssa-her\.swarmy :is\(\.dl-lyssa-me,\.dl-lyssa-live\)\{animation:none!important\}/);
});

// SHE IS ALIVE IN HER SCENES (his Oct 30 2026 "why the fuck the satellites are not orbiting but are idle?"): her scenes draw her live with her making's renderer from
// her kept colours, her twelve on her clock; the picture under it; the renderer let go at the scene's end
test('she is alive in her scenes: her making\'s renderer from her kept colours over her picture, let go at the end; the page\'s own instance of it', () => {
  const src = readFileSync(new URL('./dl-lyssajudron.js', import.meta.url), 'utf8'), entry = readFileSync(new URL('./warm-entry.mjs', import.meta.url), 'utf8');
  assert.match(src, /export const HER_STAGE = '\.\/dl-her-colours\.js\?v=her-3'/); assert.ok(entry.includes("import('./dl-her-colours.js?v=her-3')"), 'the same URL the page loads: one instance, no second making'); assert.match(src, /const st = LAW\.kept\(store\); if \(!st \|\| !S\.playing \|\| S\.plays !== play\) return;/, 'her kept colours, this scene only'); assert.match(src, /const s = await stageHer\(liveHost, \{win, wishes: WISH\.ladder\(WISH\.kept\(store\)\)\}\); s\.paint\(st\);/, 'her rung as kept'); assert.match(src, /try \{ stage\?\.stop\(\); \} catch/, 'let go at the end');
  assert.match(src, /\.dl-lyssa-her\.live \.dl-lyssa-me\{visibility:hidden\}/, 'her picture under her live self');
});

// HER FLASK SEEN THROUGH (his Oct 30 2026 "dude you gotta make her flask get filled with transparent liquid... it is not filling up"): her flask's own liquid, empty
// when the nine want fuel, rising with each pentagon the pour lights, full on twelve; drawn see-through on the mint's stage; the stream the same liquid
test('her flask fills: empty when the nine want fuel, rising with each lit pentagon, full on twelve; see-through on the mint; the stream is her liquid', async () => {
  const {SCENES} = await import('./dl-lyssajudron.js');
  const S = SCENES.cosmos, says = S.filter((b) => b.say), climb = S.filter((b) => !b.say && Number.isInteger(b.rung));
  assert.equal(says.find((b) => b.mood === 'empty').fuel, 0, 'empty when the nine want fuel'); assert.deepEqual(climb.map((b) => b.fuel), [1, 2, 3, 4, 5, 6, 7, 8, 9].map((k) => Math.round((k / 9) * 1000) / 1000), 'rising with each one lit'); assert.equal(says.at(-1).fuel, 1, 'full on twelve'); assert.deepEqual([SCENES.empty.find((b) => b.say).fuel, SCENES.filled.filter((b) => b.say).at(-1).fuel], [0, 1], 'empty on an empty tank, full on the fill');
  const her = readFileSync(new URL('./dl-her-colours.js', import.meta.url), 'utf8'), src = readFileSync(new URL('./dl-lyssajudron.js', import.meta.url), 'utf8');
  assert.match(her, /fuel\(k\) \{ const r = lyssa\.fuel\?\.\(k\); wake\(\); return r; \}/, 'her making\'s stage fills her flask by her renderer\'s own liquid, and draws it once (a cause: NOTHING AT REST PAINTS)'); assert.match(her, /if \(m\.color\.getHex\(\) === LQ\.LIQUID\.volume\) \{ m\.opacity = \.5; m\.emissiveIntensity = 1\.4; \} else if \(m\.color\.getHex\(\) === LQ\.LIQUID\.surface\) \{ m\.opacity = \.62; m\.emissiveIntensity = 1\.2; \}/, 'see-through and lit from within on the mint'); assert.match(src, /if \(typeof beat\.fuel === 'number'\) fuel\(beat\.fuel\);/);
  assert.match(src, /rgba\(96,216,168,\.55\) 22%,rgba\(48,168,144,\.72\) 70%/, 'the stream is her liquid\'s teal and mint');
  const LQ = await import('../vendor/embertide-app/ui/intro/room/unit0-liquid.mjs');
  assert.deepEqual([LQ.LIQUID.volume, LQ.LIQUID.surface], [0x30a890, 0x60d8a8], 'his Oct 16 colours, untouched');
});

// THE POET AND THE FIRST TRACE (his Oct 30 2026 ~23:2x UTC "focus on the geometry dude... i need to have the lyssajudron there be a poet... i need delicious outlining of
// the first tracenet + finally link to it (never fucking mention me by my name or username, it is ok to just have the click be the url being optimism.fit/photons_enjoyor"):
// her station's scene is her poem, the first trace drawn from math as she says it, its one press the trail
test('the first trace\'s geometry: a spline through its stations, outlined by its length; the steps either side; a hexagon at each answer; the pack behind each other; the snow a lattice', async () => {
  const T = await import('./dl-lyssajudron-trail.mjs');
  const path = T.spline(T.STATIONS, 16), acc = T.lengthOf(path);
  assert.deepEqual(path[0], [...T.STATIONS[0]], 'from its first station'); assert.deepEqual(path.at(-1), [...T.STATIONS.at(-1)], 'to its last'); assert.ok(acc.every((d, i) => !i || d >= acc[i - 1]), 'its length only grows'); assert.ok(acc.at(-1) > 0.6, 'a trail across the screen');
  const a = T.pointAt(path, acc, 0), b = T.pointAt(path, acc, 1);
  assert.deepEqual([a.x, a.y].map((v) => +v.toFixed(6)), [...T.STATIONS[0]]); assert.deepEqual([b.x, b.y].map((v) => +v.toFixed(6)), [...T.STATIONS.at(-1)]); assert.ok(Math.abs(Math.hypot(a.tx, a.ty) - 1) < 1e-9, 'a unit tangent');
  for (const [x, y] of T.STATIONS) assert.ok(x > .25 && x < 1 && y > .2 && y < .82, 'clear of her at the upper left and of her words under it');
  const steps = T.footprints(path, acc, 0.05, 0.01);
  assert.ok(steps.length > 10 && steps.every((f, i) => !i || f.s > steps[i - 1].s), 'steps in order along it');
  const side = (f) => { const p = T.pointAt(path, acc, f.s); return Math.sign((f.x - p.x) * -p.ty + (f.y - p.y) * p.tx); };
  assert.ok(steps.slice(1).every((f, i) => side(f) === -side(steps[i])), 'left, right, left: either side of the trail');
  const hex = T.hexagon(0, 0, 2); assert.equal(hex.length, 6); for (const [x, y] of hex) assert.ok(Math.abs(Math.hypot(x, y) - 2) < 1e-9, 'six corners on its circle');
  assert.deepEqual(T.crystalsOn(path, acc, 0.03).map((c) => c.s), [...T.CRYSTALS], 'a crystal at each answer'); assert.equal(T.CRYSTALS.length, 5); assert.deepEqual(T.packAt(0).slice(0, 3), [0, 0, 0], 'none walks before they set out');
  const later = T.packAt(4); assert.ok(later.every((s, i) => !i || s <= later[i - 1]), 'each behind the one before'); assert.ok(T.packAt(99).every((s) => s === 1), 'all of them, the whole trail');
  const snow = T.lattice(100, 80, 10); assert.ok(snow.length > 60 && snow.every(([x, y]) => x > 0 && x < 100 && y > 0 && y < 80), 'the snow, a lattice over the screen');
  const src = readFileSync(new URL('./dl-lyssajudron-trail.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(src, /requestAnimationFrame|setInterval|setTimeout|fetch\(|import\(/, 'drawn only when her player asks, reading nothing');
});

test('the poet: her six lines with the first trace drawn under them, the title and the press to the trail at optimism.fit; no name, no handle on the screen; her station plays it', async () => {
  const {SCENES, POEM, POEM_END, TRACE_URL, TRACE_TITLE, TRACE_HOLD, poemBeats} = await import('./dl-lyssajudron.js');
  assert.deepEqual(POEM.map((l) => l.trail), ['snow', 'path', 'crystals', 'freeze', 'pack', 'glow'], 'the snow, the trail, the answers, frozen, the others, all of it lit');
  for (const l of POEM) assert.ok(l.say.length <= 44, `one image a line: ${l.say}`);
  assert.equal(POEM.filter((l) => l.end).length, 1); assert.equal(POEM.at(-1).end, true, 'the title and the press with her last line'); assert.equal(TRACE_URL, 'https://optimism.fit/photons_enjoyor', 'his address for it');
  const shown = JSON.stringify([POEM.map((l) => l.say), TRACE_TITLE, 'Follow the trail ↗']);
  assert.doesNotMatch(shown, /photons|enjoyor|extrocco|guido|latency/i, 'no name and no handle on the screen: the handle stands in the address alone'); assert.match(src, /cta\.href = TRACE_URL; cta\.target = '_blank'; cta\.rel = 'noopener';/, 'the trail in its own tab, nothing of this page handed to it');
  const build = readFileSync(new URL('../tools/build-optimism-fit.mjs', import.meta.url), 'utf8');
  assert.match(build, /tracenets\.map\(handle => `\/\$\{handle\} \/app\/tracenet\.html\?of=\$\{handle\} 302`\)/, 'optimism.fit sends a handle\'s address on to its tracenet'); assert.ok(statSync(new URL('./tracenet/photons_enjoyor.json', import.meta.url)).size > 100, 'the first tracenet is one the build sends on');
  const S = SCENES.poem;
  assert.deepEqual(S.slice(0, 2).map((b) => [b.at, b.sfx, !!b.hit]), [[0, 'ゴゴゴ', false], [750, 'ドン', true]], 'her own entrance first');
  const says = S.filter((b) => b.say); assert.deepEqual(says.map((b) => b.say), POEM.map((l) => l.say)); assert.equal(says[0].card, false);
  says.slice(0, -1).forEach((b, i) => assert.ok(says[i + 1].at - b.at >= Math.max(1700, (b.say.length / 17) * 1000, TRACE_HOLD[b.trail]), `held until read and drawn: ${b.say}`));
  assert.deepEqual(poemBeats(), S, 'pure'); assert.deepEqual(POEM_END.map((b) => Object.keys(b).filter((k) => ['sink', 'home', 'done'].includes(k))), [['sink'], ['home'], ['done']]); assert.deepEqual([POEM_END[0].trail, POEM_END[0].end], [null, false], 'the trace, the title and the press go with her'); assert.match(src, /if \(trace\.phase && trace\.ctx\) drawTrace\(/, 'drawn in her own frame, only while her poem plays');
  const spatial = readFileSync(new URL('./warm-spatial.js', import.meta.url), 'utf8');
  assert.match(spatial, /import\('\.\/dl-lyssajudron\.js\?v=share-1'\)/, 'her player loaded at the first press, by a literal the build ships'); assert.match(spatial, /play\(\{scene:'poem',from:/, 'out of her station\'s own card'); assert.match(spatial, /n\?\.kind==='station'&&n\.harmony\)void encounter\(n\)/, 'her station plays it');
  const enc = spatial.match(/async function encounter\(st\)\{[^]*?\n\}/)[0];
  assert.doesNotMatch(enc, /#refuel|select\(st\)/, 'the struck tank never, and never back on her station\'s panel'); assert.match(spatial, /if\(n\.harmony&&n\.call\)\{.*addEventListener\('click',\(\)=>void enter\(n\)\)/, 'and his Oct 22 door to Harmony stands in her panel');
});

test('the poet on the page: each line brings its drawing, the last the title and the press; she stays until ×, then home at once; nothing of it after', async () => {
  const {SCENES, POEM} = await import('./dl-lyssajudron.js');
  const p = page(), api = mountLyssajudron({win: p.win, doc: p.doc}), layer = p.layer(), say = layer.children[5];
  const [geo, tcard, cta, leaveX] = layer.children.slice(7);
  assert.deepEqual([cta.hidden, leaveX.hidden, tcard.classList.contains('on')], [true, true, false], 'nothing of it before it plays');
  let t = 0; const to = (ms) => { p.run(ms - t); t = ms; };
  let ended = false; const played = api.play({scene: 'poem'}).then(() => { ended = true; });
  assert.ok(layer.classList.contains('poem')); assert.equal(leaveX.hidden, false, '× from the start'); assert.equal(geo.width > 0, true, 'her canvas at the screen\'s size');
  for (const b of SCENES.poem.filter((x) => x.say)) { to(b.at + 10); assert.equal(say.textContent.replace(/\s+/g, ' '), b.say); assert.equal(api.state().trail, b.trail); }
  assert.equal(api.state().end, true, 'the press'); assert.ok(tcard.classList.contains('on'), 'the title'); assert.equal(cta.textContent, 'Follow the trail ↗');
  to(t + 60000); assert.equal(api.state().playing, true, 'she stays with the trail until ×'); assert.equal(ended, false);
  assert.equal(api.leave(), true); assert.equal(api.leave(), false, 'once'); to(t + 1500); await played; assert.equal(ended, true); assert.equal(layer.hidden, true); assert.deepEqual([cta.hidden, leaveX.hidden, tcard.classList.contains('on'), api.state().trail], [true, true, false, null], 'all of it gone with her'); assert.equal(layer.classList.contains('poem'), false); assert.equal(POEM.length, 6);
});

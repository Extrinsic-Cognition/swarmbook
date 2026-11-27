// dl-her-colours.test.mjs · HER COLOURS ON THE MINT: the law (dl-her-colours.mjs) held to Harmony's own pick, read out of its page, and to her-face.js's
// reading of the two refs. node --test dl-her-colours.test.mjs (from embertide-app/ui/intro/dyson-society/app; no browser, no network).
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as L from './dl-her-colours.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MAC = fs.readFileSync(path.join(HERE, '../../../../../tools/embertide-mesh/mac-onboarding.html'), 'utf8');   // Harmony's page, its pick inline
const HF = globalThis.HER_FACE;
const one = (re, what) => { const m = re.exec(MAC); assert.ok(m, `Harmony's page still holds ${what}`); return m; };
const objOf = (text) => Function(`return (${text});`)();
/** Harmony's own two colour functions, read out of its page and run as they stand */
const harmony = (() => {
  const a = one(/function hexToHsl\(hex\) \{[\s\S]*?return \[h \* 360, s, l\]; \}/, 'hexToHsl')[0];
  const b = one(/function hslToHex\(h, s, l\) \{[\s\S]*?\.toUpperCase\(\); \}/, 'hslToHex')[0];
  return Function(`${a}\n${b}\nreturn { hexToHsl, hslToHex };`)();
})();

test('the same law as Harmony\'s pick, number for number: bare, ice, the field, the gold, the names, the drum\'s order', () => {
  assert.deepEqual(objOf(one(/var BARE = (\{[^}]+\}), ICE = '(#[0-9A-F]{6})'/, 'BARE and ICE')[1]), { ...L.BARE }); assert.equal(one(/ICE = '(#[0-9A-F]{6})'/, 'ICE')[1], L.ICE);
  const f = one(/var FIELD_S = ([.\d]+), L_TOP = ([.\d]+), L_BOT = ([.\d]+);/, 'the field');
  assert.deepEqual([+f[1], +f[2], +f[3]], [L.FIELD.s, L.FIELD.top, L.FIELD.bottom]); assert.equal(one(/var GOLD = '(#[0-9A-F]{6})', gold = hexToHsl\(GOLD\)/, 'the gold')[1], L.GOLD); assert.deepEqual(objOf(one(/var NAMES = (\[\[[\s\S]*?\]\]);/, 'the names')[1]), L.NAMES.map((n) => [...n])); assert.deepEqual(objOf(one(/HOUSE_BORN = (\{[^}]+\})/, 'her born paint')[1]), { ...L.BORN }, 'her born paint is her-face.js\'s, on both pages');
  const drum = [...one(/<div class="parts cyl" id="cyl"[\s\S]*?<\/div>/, 'the drum')[0].matchAll(/data-part="([a-z]+)"/g)].map((m) => m[1]);
  assert.deepEqual(drum, [...L.CHAMBERS]); assert.deepEqual([...L.PARTS], ['base', 'coat', 'gold', 'eyes', 'thruster']);
});

test('the colour functions are Harmony\'s: every hex there and back, every hue at every lightness the field holds', () => {
  for (let i = 0; i < 4096; i++) {
    const hex = '#' + (i * 4099 % 0xffffff).toString(16).padStart(6, '0').toUpperCase();
    assert.deepEqual(L.hexToHsl(hex), harmony.hexToHsl(hex));
  }
  for (let h = 0; h <= 360; h += 7.5) for (let l = 0; l <= 1; l += 1 / 16) for (const s of [0, .3, L.FIELD.s, 1]) assert.equal(L.hslToHex(h, s, l), harmony.hslToHex(h, s, l));
  const gold = harmony.hexToHsl(L.GOLD);
  for (let h = 0; h < 360; h += 15) assert.equal(L.goldAt(h), harmony.hslToHex(h, gold[1], gold[2]), 'her light at a hue is the gold at that hue');
});

test('the field: a part\'s colour by the hue across and the lightness down; her light by the hue alone; the thumb finds it again', () => {
  assert.equal(L.fieldColour('base', 0, 0), harmony.hslToHex(0, L.FIELD.s, L.FIELD.top)); assert.equal(L.fieldColour('coat', .5, 1), harmony.hslToHex(180, L.FIELD.s, L.FIELD.bottom)); assert.equal(L.fieldColour('light', .5, 0), L.fieldColour('light', .5, 1), 'her light ignores the lightness');
  for (const c of ['base', 'gold', 'eyes']) for (const [u, v] of [[.1, .2], [.37, .5], [.8, .9]]) {
    const s = L.fieldSpot(c, L.fieldColour(c, u, v)); assert.ok(Math.abs(s.u - u) < .01 && Math.abs(s.v - v) < .01, `${c} at ${u},${v}: ${JSON.stringify(s)}`);
  }
});

test('the die is Harmony\'s die: the same five formulas, run on the same draws', () => {
  const lines = [...MAC.matchAll(/^\s*paint\.(base|coat|gold|eyes|thruster) = (hslToHex\(.*\));$/gm)];
  assert.equal(lines.length, 5, 'Harmony\'s roll paints five parts');
  const theirs = Function('h', 'r', 'k', 'hslToHex', `var paint = {};\n${lines.map((m) => `paint.${m[1]} = ${m[2]};`).join('\n')}\nreturn paint;`);
  const draws = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return s / 2147483647; }; };   // one seeded sequence of draws
  const k = (x) => ((x % 360) + 360) % 360;
  for (let seed = 1; seed <= 25; seed++) {
    const mine = L.roll(L.blank(), draws(seed));
    const r = draws(seed), h = r() * 360;   // Harmony's roll: the hue first, then each r() in the formulas' own order
    assert.deepEqual(mine.parts, theirs(h, r, k, harmony.hslToHex), `seed ${seed}`); assert.deepEqual(mine.painted, [...L.PARTS]); assert.equal(mine.light, L.goldAt(L.hexToHsl(mine.parts.thruster)[0]), 'her light on the flame\'s hue'); assert.ok(L.whole(mine));
  }
});

test('out of the box she is bare, her light the ice; she is whole only when all six have fired; ↺ takes one back', () => {
  let st = L.blank();
  assert.deepEqual(st.parts, { ...L.BARE }); assert.equal(L.colourOf(st, 'light'), L.ICE); assert.ok(!L.whole(st));
  for (const c of L.CHAMBERS) assert.ok(L.isBare(st, c));
  for (const [i, c] of L.CHAMBERS.entries()) { st = L.put(st, c, L.fieldColour(c, i / 6, .4)); assert.equal(L.whole(st), i === 5, `after ${c}`); }
  st = L.bare(st, 'gold'); assert.ok(L.isBare(st, 'gold') && !L.whole(st)); assert.equal(st.parts.gold, L.BARE.gold);
  st = L.bare(st, 'light'); assert.equal(st.light, null);
  assert.equal(L.put(st, 'wings', '#FFFFFF'), st, 'no such chamber'); assert.equal(L.put(st, 'base', 'red'), st, 'no such colour'); assert.equal(L.gazeTo(st, 'cat').gaze, 'cat'); assert.equal(L.gazeTo(st, 'nonsense').gaze, null); assert.deepEqual([...L.FORMS].sort(), Object.keys(HF.EYE_FORMS).filter((f) => f !== 'bare').sort());
});

test('her two refs are the Nest\'s own, and every glass reads back what the mint painted, part by part', () => {
  let st = L.blank();
  st = L.put(st, 'base', '#112233'); st = L.put(st, 'eyes', '#ABCDEF'); st = L.put(st, 'light', L.goldAt(200)); st = L.gazeTo(st, 'star');
  const { paint, light } = L.refs(st, { at: '2026-10-28T14:40:00.000Z' });
  assert.equal(paint.schema, HF.PAINT_SCHEMA); assert.equal(light.schema, HF.LIGHT_SCHEMA); assert.equal(paint.golem, 'lyssajudron'); assert.equal(light.golem, 'lyssajudron'); assert.deepEqual(paint.painted, ['base', 'eyes']); assert.equal(paint.gaze, 'star'); assert.equal(paint.from, 'optimism.fit'); assert.deepEqual(HF.paintOf(paint), { base: '#112233', coat: L.BARE.coat, gold: L.BARE.gold, eyes: '#ABCDEF', thruster: L.BARE.thruster }, 'her-face.js reads the parts as painted'); assert.equal(HF.lightOf(light), L.goldAt(200)); assert.equal(light.name, L.nameOf(L.hexToHsl(L.goldAt(200))[0])); assert.equal(light.hue, Math.round(L.hexToHsl(L.goldAt(200))[0] * 10) / 10);
  assert.equal(L.refs(L.blank()).light.color, L.ICE); assert.equal(L.refs(L.blank()).light.bare, true); assert.equal(L.refs(L.blank()).light.name, 'ice');
  // Harmony's writers name the same fields (its paintW and lightW, read out of its page)
  const pw = one(/var paintW = writer\(PAINT_REF, function \(v\) \{ return \{([^}]*)/, 'its paint writer')[1], lw = one(/var lightW = writer\(REF, function \(v\) \{[^{]*\{([^}]*)/, 'its light writer')[1];
  for (const k of ['schema', 'golem', 'parts', 'painted', 'gaze', 'by', 'at', 'from']) assert.match(pw, new RegExp(`\\b${k}:`), `Harmony's paint ref has ${k}`);
  for (const k of ['schema', 'golem', 'color', 'hue', 'name', 'bare', 'by', 'at']) assert.match(lw, new RegExp(`\\b${k}:`), `Harmony's light ref has ${k}`);
  assert.match(pw, /'embertide\.golem-paint\/1'/); assert.match(lw, /'embertide\.golem-light\/1'/); assert.match(pw, /golem: 'lyssajudron'/);
});

test('kept in the browser and read back whole; a foreign or broken keep is nothing; the minted one is she, a draft gone, the very same keeping her eyes', () => {
  const store = new Map(), storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k) };
  let st = L.roll(L.blank(), (() => { let s = 7; return () => { s = (s * 48271) % 2147483647; return s / 2147483647; }; })()); st = L.gazeTo(st, 'gentle');
  assert.ok(L.keep(storage, st, () => '2026-10-28T14:41:00.000Z'));
  const back = L.kept(storage);
  assert.deepEqual(back.parts, st.parts); assert.deepEqual(back.painted, st.painted); assert.equal(back.light, st.light); assert.equal(back.gaze, 'gentle'); const six = (s) => Object.fromEntries(L.CHAMBERS.map((c) => [c, L.colourOf(s, c)])), raw = store.get(L.KEEP_KEY); store.set(L.BORN_KEY, 'mhc1abc'); L.minted(storage, six(st)); assert.deepEqual([store.get(L.KEEP_KEY), store.has(L.BORN_KEY)], [raw, false]);
  assert.equal(JSON.parse(store.get(L.KEEP_KEY)).paint.at, '2026-10-28T14:41:00.000Z'); for (const c of L.CHAMBERS) { const other = { ...six(st), [c]: '#123456' }; store.set(L.KEEP_KEY, raw); L.minted(storage, other); assert.deepEqual([six(L.kept(storage)), L.whole(L.kept(storage))], [other, true], c); } store.clear(); L.minted(storage, six(st)); assert.deepEqual(six(L.kept(storage)), six(st)); L.minted({ getItem() { throw new Error('blocked'); } }, six(st));
  store.set(L.KEEP_KEY, '{"paint":{"schema":"other/1","parts":{}}}'); assert.equal(L.kept(storage), null);
  store.set(L.KEEP_KEY, 'not json'); assert.equal(L.kept(storage), null);
  assert.equal(L.kept({ getItem() { throw new Error('blocked'); } }), null, 'a browser that keeps nothing keeps nothing'); assert.equal(L.keep({ setItem() { throw new Error('full'); } }, st), false);
});

// BRINGING HER WITH YOU (lane/the-path-to-the-kit; his Oct 29 2026 16:2x UTC: "i need you to fucking optimize for MMO vibes and bringing this fucking lyssajudron
// with you"): at her Continue, one picture of her from her renderer's own canvas stands in the starter kit as Your Swarmy, kept for the visit only.
// A bare document: enough of the DOM for her making (elements with children, classes, datasets, styles, listeners), and the kit's slot as warm.html holds it.
function bareDocument() {
  const docListeners = new Map(), byId = new Map();
  const node = (tag) => {
    const cls = new Set(), el = { tagName: tag.toUpperCase(), children: [], dataset: {}, style: { setProperty(k, v) { el.style[k] = v; } }, attrs: {}, listeners: new Map(), hidden: false, textContent: '',
      offsetWidth: 0, offsetParent: {}, get className() { return [...cls].join(' '); }, set className(v) { cls.clear(); for (const c of String(v).split(' ').filter(Boolean)) cls.add(c); },
      classList: { add: (...c) => c.forEach((x) => cls.add(x)), remove: (...c) => c.forEach((x) => cls.delete(x)), contains: (c) => cls.has(c), toggle: (c, on = !cls.has(c)) => (on ? cls.add(c) : cls.delete(c), on),
        replace: (a, b) => { if (!cls.has(a)) return false; cls.delete(a); cls.add(b); return true; } },
      append(...kids) { for (const k of kids) if (typeof k === 'string') el.textContent += k; else { k.parent = el; el.children.push(k); } },
      remove() { if (el.parent) el.parent.children = el.parent.children.filter((c) => c !== el); el.parent = null; },
      setAttribute(k, v) { el.attrs[k] = String(v); if (k === 'id') byId.set(String(v), el); }, getAttribute: (k) => el.attrs[k] ?? null,
      addEventListener(t, f) { el.listeners.set(t, f); }, click() { el.listeners.get('click')?.({ target: el }); },
      querySelector: (q) => el.children.find((c) => c.tagName === q.toUpperCase()) ?? null,
      getBoundingClientRect: () => ({ left: 0, top: 0, width: 0, height: 0 }) };
    return el;
  };
  const html = node('html'), head = node('head'), body = node('body');
  const door = node('button'), img = node('img'); door.setAttribute('id', 'her-door'); door.setAttribute('aria-label', 'Paint your Lyssajudron'); img.hidden = true; door.append(img);   // the kit's slot
  const all = (root) => [root, ...root.children.flatMap(all)];
  const doc = { documentElement: html, head, body, createElement: node, getElementById: (id) => byId.get(id) ?? null,
    querySelector: (q) => (q === L2.KIT_HER ? img : null), addEventListener: (t, f) => docListeners.set(t, [...(docListeners.get(t) || []), f]),
    dispatchEvent: (e) => { for (const f of docListeners.get(e.type) || []) f(e); return true; } };
  const find = (cls) => all(body).find((e) => e.classList.contains(cls));
  return { doc, door, img, find };
}
const L2 = await import('./dl-her-colours.js');
const WISH = await import('./dl-her-wishes.mjs');
const FRIEND = await import('./dl-her-friends.mjs');

test('her picture at her Continue, from her own renderer, stands in the kit as Your Swarmy; kept for the visit only; a second Continue replaces it', async () => {
  const { doc, door, img, find } = bareDocument(), timers = [], made = [], urls = [], revoked = [], store = new Map();
  const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) };
  const win = { location: { search: '' }, requestAnimationFrame: (f) => f(), setTimeout: (f) => timers.push(f), CustomEvent: globalThis.CustomEvent,
    URL: { createObjectURL: (b) => { urls.push(b); return `blob:${urls.length}`; }, revokeObjectURL: (u) => revoked.push(u) } };
  const drawn = { pictures: 0, stops: 0, blobs: [{ size: 1 }, null, { size: 2 }], takenWhileDrawn: [] };
  const stage = async () => ({ paint: (st) => st.parts, grid() {}, clock: () => null, state: () => ({}), stop() { drawn.stops++; },
    picture() { drawn.pictures++; drawn.takenWhileDrawn.push(drawn.stops === 0); const blob = drawn.blobs.shift(); return { toBlob: (cb, type) => { drawn.type = type; queueMicrotask(() => cb(blob)); } }; } });
  doc.addEventListener(L2.SEEN_EVENT, (e) => made.push(e.detail.type));
  const her = L2.mountHerColours({ win, doc, storage, stage });
  doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'seated' } })); await new Promise((r) => setTimeout(r, 0));
  assert.equal(her.state().reason, 'stop'); assert.equal(img.hidden, true, 'before she is made, the slot is the door to her making');
  find('dl-her-tool').click(); assert.ok(her.state().whole, 'the die fires all six');
  find('dl-her-go').click(); await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual([drawn.pictures, drawn.takenWhileDrawn, drawn.type], [1, [true], 'image/png'], 'one picture at Continue, taken before her renderer is let go, as one PNG'); assert.deepEqual(made, ['landed', 'made'], 'she is made: the rebate slams in'); assert.deepEqual([img.src, img.hidden, img.alt, door.getAttribute('aria-label')], ['blob:1', false, 'Your Swarmy, as you coloured her', 'Your Swarmy: paint her again'], 'her picture in the kit, the slot still her door'); assert.deepEqual([her.state().picture, her.state().pictures], ['blob:1', 1]);
  assert.deepEqual([...store.keys()], [L2.KEEP_KEY], 'the browser keeps her two refs, nothing else (no count of wishes: THE WISH IS IN THE APP)'); assert.doesNotMatch(store.get(L2.KEEP_KEY), /blob:|data:|image/, 'never her picture');
  for (const f of timers.splice(0)) f(); assert.equal(drawn.stops, 1, 'her renderer let go once the layer has faded');
  // the door in the kit opens her making again; a Continue with no picture keeps the last one; the next replaces it, and the rebate does not slam in again
  door.click(); await new Promise((r) => setTimeout(r, 0)); assert.equal(her.state().reason, 'door');
  find('dl-her-go').click(); await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual([her.state().pictureWhy, img.src, revoked], ['no picture', 'blob:1', []], 'no picture this time: the last one stands');
  for (const f of timers.splice(0)) f();
  door.click(); await new Promise((r) => setTimeout(r, 0)); find('dl-her-go').click(); await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual([img.src, revoked, her.state().pictures], ['blob:2', ['blob:1'], 2], 'a second picture replaces the first, the first let go'); assert.deepEqual(made, ['landed', 'made'], 'her door\'s Continue slams nothing in');
});

// HER THREE WISHES (lane/her-three-wishes; his Oct 29 2026 17:29 UTC: "you should make that it starts with 3, the ones you can see that have a "wish charge" in
// them... gamify this shit dude please") and HER WISHES SPENT (lane/her-wishes-unlock; his 17:31: "starting with 3 pentagons, using all 3 wishes and then
// unlocking a 4th pentagon and getting 4 wishes now and so on"): her making mounts her on the rung she stands on, and a chamber fired spends a wish.
test('her making mounts her with her three charged, and her wish bar shows three of twelve, her charges in her eyes\' paint', async () => {
  const { doc, find } = bareDocument(), asked = [];
  const win = { location: { search: '' }, requestAnimationFrame: (f) => f(), setTimeout() {}, CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} } };
  const stage = async (host, opt) => { asked.push(opt.wishes); return { paint: (st) => st.parts, grid() {}, clock: () => null, state: () => ({}), stop() {}, charge() {}, wishes: () => 'drawn' }; };
  const her = L2.mountHerColours({ win, doc, storage: null, stage });
  doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'seated' } })); await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual(asked, [WISH.ladder(0)], 'her renderer is asked for the first rung: the three that carry a wish, the score\'s eye-stalks, all three lit');
  const slots = find('dl-her-slots').children;
  assert.equal(slots.length, 12); assert.deepEqual(slots.filter((e) => e.classList.contains('charged')).map((e) => e.dataset.seat), ['0', '1', '2'], 'the gold thirds: her three'); assert.deepEqual(slots.filter((e) => e.classList.contains('next')).map((e) => e.dataset.seat), ['3'], 'the pentagon that comes when her three wishes are spent'); assert.equal(slots.filter((e) => e.classList.contains('empty')).length, 8, 'eight chairs not hers yet'); assert.equal(find('dl-her-count').textContent, '3/12'); assert.equal(find('dl-her-wishes').style['--eye'], L2.BARE.eyes, 'out of the box her charges are the grey of her bare eyes, as the pentagons on her are');
  find('dl-her-tool').click();
  assert.equal(find('dl-her-wishes').style['--eye'], her.state().st.parts.eyes, 'painted, her charges take her eyes\' paint');
});

test('0 WISHES ON THE WEB: a chamber fired and the die spend no wish; her three stay lit at 3/12, no slam; a count the colours\' law kept is not read', async () => {
  const { doc, find } = bareDocument(), store = new Map(), storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) }, charged = [];
  store.set('dl.her.wishes', JSON.stringify({ spent: 6, at: '2026-10-31T20:00:00.000Z' }));   // a browser that made her under the colours' law
  const win = { location: { search: '' }, requestAnimationFrame: (f) => f(), setTimeout() {}, CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} } };
  const asked = [], stage = async (host, opt) => { asked.push(opt.wishes); return { paint: (st) => st.parts, grid() {}, clock: () => null, state: () => ({}), stop() {}, charge: (rung) => charged.push(rung), wishes: () => 'drawn' }; };
  const her = L2.mountHerColours({ win, doc, storage, stage });
  doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'seated' } })); await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual(asked, [WISH.ladder(0)], 'her three, whatever the colours\' law kept');
  const states = () => find('dl-her-slots').children.map((e) => ['charged', 'spent', 'next', 'empty'].find((c) => e.classList.contains(c))[0]).join('');
  const press = (x) => find('dl-her-field').listeners.get('pointerdown')({ clientX: x, clientY: 0, pointerId: 1, preventDefault() {} });
  press(0); press(0); find('dl-her-tool').click();   // a chamber fired, then the die's other five
  assert.ok(her.state().whole, 'she is made'); assert.equal(states(), 'cccneeeeeeee', 'her three still lit, the fourth still to come'); assert.equal(find('dl-her-count').textContent, '3/12'); assert.deepEqual([her.state().wishes.spent, her.state().wishes.slams, charged, find('dl-her-slam').classList.contains('on')], [0, 0, [], false], 'no wish spent, no pentagon, no slam'); assert.equal(store.get('dl.her.wishes'), JSON.stringify({ spent: 6, at: '2026-10-31T20:00:00.000Z' }), 'and nothing of a count written');
});

test('her renderer could not draw here: the drum still makes her, and the kit keeps its door', async () => {
  const { doc, img, find } = bareDocument(), win = { location: { search: '' }, requestAnimationFrame: (f) => f(), setTimeout() {}, CustomEvent: globalThis.CustomEvent,
    URL: { createObjectURL: () => assert.fail('no picture to keep'), revokeObjectURL() {} } };
  const her = L2.mountHerColours({ win, doc, storage: null, stage: async () => { throw new Error('no WebGL here'); } });
  doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'seated' } })); await new Promise((r) => setTimeout(r, 0));
  find('dl-her-tool').click(); find('dl-her-go').click(); await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual([her.state().making, her.state().herWhy, her.state().picture, img.hidden], ['made', 'no WebGL here', null, true]);
});

// HER REEL (lane/her-reel-share; his Oct 29 2026 18:33 UTC "how do we go from this to something that can go viral my dude?", then "Yes, build it"): the share
// stands at the end of her bar once a pentagon of his ladder has come, its press films her reel (dl-her-reel.js, stood in for here); a friend's link (#her=)
// opens her making on the sharer's her at the sharer's rung, and the friend's first stroke makes her their own, nothing of the sharer's kept.
const REEL = await import('./dl-her-reel.mjs');
const tick = () => new Promise((r) => setTimeout(r, 0));
const keeper = () => { const store = new Map(); return { store, storage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, String(v)) } }; };
// THE WISH IS IN THE APP: DysonLight's hand stood in (prove: an attestation at its key's first word, an assertion after; forget: a new key), and the doors' answers
// (the router's word on the web; her hello: her code and the wishes owed; a wish: an answer while one is owed, Fuel me after), every word the page sent each kept
const KEY = 'zgSY9YSD+7TaDXssY6WlOPVS1K3Lmk+pFhlcSWE+ZV0=', MARK = 'm'.repeat(43), CODE = 'C0DE0FHER5', STORE = 'https://apps.apple.com/app/dysonlight/id0000000000';
const ticks = async (n = 6) => { for (let i = 0; i < n; i++) await tick(); };
function hand() {
  const said = []; let key = KEY, n = 0;
  return { said, get key() { return key; }, handler: { postMessage: async (m) => { said.push(m); if (m.op === 'forget') { key = `y${key.slice(1)}`; n = 0; return null; }
    return n++ === 0 ? { key, attestation: `att-${key.slice(0, 4)}`, phone: MARK } : { key, assertion: `asr-${n}` }; } } };
}
/** ANDROID PROVES ITSELF: DysonLight on Android's hand, a web message port: a string in, its answer on onmessage with the ask's id */
function portHand() {
  const said = [], h = hand(), port = { onmessage: null, postMessage(text) { const m = JSON.parse(text); said.push(m);
    h.handler.postMessage(m).then((reply) => setTimeout(() => port.onmessage?.({ data: JSON.stringify({ id: m.id, reply: reply && reply.attestation ? { ...reply, platform: 'android' } : reply }) }), 0)); } };
  return { said, port };
}
function doors({ owed = 3, open = true, store = STORE, play = null, unborn = false } = {}) {
  const d = { owed, used: 0, open, store, play, unborn, sent: [], other: [] };
  d.fetch = async (url, init = {}) => {
    const u = String(url), body = init.body ? JSON.parse(init.body) : null, method = init.method || 'GET';
    const reply = (status, b) => ({ ok: status >= 200 && status < 300, status, json: async () => b });
    if (!u.startsWith(WISH.WISH_PATH)) { d.other.push({ url: u, method, body }); return reply(200, {}); }
    d.sent.push({ url: u, method, body });
    if (method === 'GET') return reply(200, d.open ? { open: true, store: d.store, play: d.play } : { open: false });
    const wishes = () => ({ granted: d.owed, used: d.used, left: Math.max(0, d.owed - d.used) });
    if (u === WISH.HELLO_PATH) { if (d.unborn && body.assertion) { d.unborn = false; return reply(409, { error: { message: 'This key was never born: her hello attests it.' } }); } return reply(200, { code: CODE, wishes: wishes() }); }
    if (d.used >= d.owed) return reply(402, { error: { message: 'Fuel me.' }, wishes: wishes() });
    d.used++; return reply(200, { answer: `granted ${d.used}`, wishes: wishes() });
  };
  return d;
}
const wishFor = async (find, words) => { find('dl-her-wish-in').value = words; find('dl-her-wish').listeners.get('submit')({ preventDefault() {} }); await ticks(); };

test('HER REEL: the share stands at the end of her bar once a pentagon has come, in the app; its press films her reel at her rung, with the link to her and her code; on the web it never stands', async () => {
  const { doc, find } = bareDocument(), { storage } = keeper(), made = {}, app = hand(), door = doors();
  const win = { location: { search: '', hash: '' }, requestAnimationFrame: (f) => f(), setTimeout() {}, CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} },
    webkit: { messageHandlers: { dysonlight: app.handler } }, fetch: door.fetch };
  const clock = { epoch_ms: 0, beat_ms: 600, beats_per_bar: 4, source: 'genesis' };
  const her0 = { paint: (st) => st.parts, grid() {}, clock: () => clock, state: () => ({}), stop() {}, charge() {}, wishes: () => 'drawn', canvas: { width: 2 }, on: () => () => {}, places: () => [1, null] };
  const reel = async () => ({ mountHerReel: (o) => { made.mount = o; return { make: async (opts) => { made.opts = opts; }, stop() { made.stopped = true; }, state: () => ({ filming: true }) }; } });
  const her = L2.mountHerColours({ win, doc, storage, stage: async () => her0, reel });
  doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'seated' } })); await ticks();
  const share = find('dl-her-share');
  assert.deepEqual([share.hidden, her.state().share, share.getAttribute('aria-label')], [true, false, 'Invite to Project Snowtrace'], 'her three wishes, none spent: no share yet'); assert.match(share.innerHTML, /<span class="t">Invite<\/span>/, 'THE SHARE INVITES TO SNOWTRACE: on the glass it says what it does, one word'); assert.match(share.innerHTML, /<svg class="ring"[^>]*><rect [^>]*pathLength="100"/, 'its ring is the pill\'s own outline'); assert.equal(find('dl-her-slots').getAttribute('role'), 'img', 'the slots and the count, one picture with its label'); assert.match(find('dl-her-slots').getAttribute('aria-label'), /Her unit1s: 3\/12/);
  find('dl-her-tool').click(); assert.equal(share.hidden, true, 'the die spends nothing: still no share');
  for (const w of ['one', 'two', 'three']) await wishFor(find, w);   // her three calls: the fourth pentagon comes
  assert.deepEqual([share.hidden, her.state().share, find('dl-her-count').textContent], [false, true, '4/12'], 'the share stands');
  share.click(); await ticks();
  assert.deepEqual([made.mount.button, made.mount.host], [share, find('dl-her')], 'its press and her making\'s layer'); assert.deepEqual([made.opts.her, made.opts.pentagons, made.opts.eyes, made.opts.lyrics, made.opts.song], [her0, 4, true, null, null], 'her, her four pentagons, her eyes open; no song'); assert.deepEqual(made.opts.grid(), { ...clock, zero_ms: 0 }, 'no song: cut on her own clock');
  const link = REEL.herLink(her.state().st, 3, null, CODE);
  assert.equal(REEL.fromHerLink(link).code, CODE, 'the link carries her code, her hello\'s'); assert.equal(made.opts.key, `${link}|her`); assert.deepEqual([made.opts.spent, made.opts.link], [3, link], 'its words: her bar at three spent, and the link to her'); assert.deepEqual(her.state().reel, { filming: true });
  find('dl-her-go').click(); assert.equal(made.stopped, true, 'her making closed: her reel let go');
  const web = bareDocument(), webWin = { ...win, webkit: undefined, fetch: doors().fetch }; L2.mountHerColours({ win: webWin, doc: web.doc, storage, stage: async () => her0, reel });
  web.doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'seated' } })); await ticks(); web.find('dl-her-tool').click();
  assert.equal(web.find('dl-her-share').hidden, true, 'on the web the share never stands: nothing spends there');
});

test('HER REEL, a friend\'s link: her making opens on the sharer\'s her at the sharer\'s rung, the sharer\'s song unasked (THE SONG LEFT HER MAKING), nothing of it kept; the first stroke makes her the friend\'s own', async () => {
  const sharer = L2.gazeTo(L2.roll(L2.blank(), (() => { let s = 11; return () => (s = (s * 9301 + 49297) % 233280) / 233280; })()), 'star'), TRACK = '4uLU6hMCjMI75M1A2tKUQC', link = REEL.herLink(sharer, 6, TRACK);
  const run = async (storage) => {
    const { doc, find } = bareDocument(), seen = { asked: [], painted: [], charged: [], replaced: [], pictured: [] };
    const win = { location: { search: '', hash: link.slice(link.indexOf('#')), pathname: '/app/warm.html' }, history: { replaceState: (a, b, u) => seen.replaced.push(u) },
      requestAnimationFrame: (f) => f(), setTimeout() {}, CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} } };
    let last = null;
    const stage = async (host, opt) => { seen.asked.push(opt.wishes); return { paint: (st) => { last = st; seen.painted.push(st); return st.parts; }, grid() {}, clock: () => null, state: () => ({}), stop() {},
      charge: (r) => seen.charged.push(r), wishes: () => 'drawn', picture() { seen.pictured.push(last); return null; } }; };
    const her = L2.mountHerColours({ win, doc, storage, stage, reel: () => assert.fail('no reel in a visit') });
    await tick(); await tick();
    return { her, find, seen };
  };
  const fresh = keeper(), { her, find, seen } = await run(fresh.storage);
  assert.deepEqual([her.state().open, her.state().reason], [true, 'visit'], 'her making opens at once'); assert.deepEqual(seen.asked, [WISH.ladder(6)], 'her stand on the sharer\'s rung'); assert.deepEqual(seen.painted.at(-1).parts, sharer.parts, 'in the sharer\'s paint'); assert.deepEqual([seen.painted.at(-1).light, seen.painted.at(-1).gaze], [sharer.light, 'star']); assert.deepEqual([find('dl-her-count').textContent, find('dl-her').style['--eye'] ?? find('dl-her-wishes').style['--eye']], ['4/12', sharer.parts.eyes], 'her bar the sharer\'s, in the sharer\'s eyes');
  assert.equal(find('dl-her-share').hidden, true, 'no share over a friend\'s her'); assert.equal(her.state().visit.track, TRACK, 'the link names its song'); assert.equal(find('dl-her-songslot'), undefined, 'and nothing asks it: no song box'); assert.deepEqual([her.state().st.painted, her.state().st.light, her.state().visit.spent, fresh.store.size], [[], null, 6, 0], 'the friend\'s own her untouched, nothing kept'); assert.equal(find('dl-her-go').disabled, false, 'the sharer\'s her stands whole: Enter the world is open in the visit (THE LINK GIVES HER)');
  find('dl-her-field').listeners.get('pointerdown')({ clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} }); find('dl-her-field').listeners.get('pointerup')();   // the friend's first stroke
  assert.equal(her.state().visit, null, 'the visit is over'); assert.deepEqual(seen.replaced, ['/app/warm.html'], 'the address loses the link'); assert.deepEqual(seen.charged, [WISH.ladder(0)], 'her stand on the friend\'s own rung; their first stroke spends no wish (THE WISH IS IN THE APP)'); assert.equal(find('dl-her-count').textContent, '3/12'); assert.equal(seen.painted.at(-1).light, her.state().st.light, 'her in the friend\'s own paint');
  const after = her.state().st, sel = after.sel, kept = L2.CHAMBERS.filter((c) => c !== sel);   /* THE LINK GIVES HER (his Nov 26 2026 "the share link is broken": the friend's first stroke wiped the her they were sent to grey, and Enter the world stayed shut until all six were painted again): a friend with no her of their own starts from the sharer's, and their stroke changes it */
  assert.deepEqual(kept.filter((c) => c !== 'light').map((c) => after.parts[c]), kept.filter((c) => c !== 'light').map((c) => sharer.parts[c]), 'every chamber the stroke did not touch is the sharer\'s paint'); assert.equal(L2.whole(after), true, 'whole from the first stroke'); assert.equal(find('dl-her-go').disabled, false, 'so she can enter the world at once'); assert.deepEqual([...fresh.store.keys()], [L2.KEEP_KEY], 'kept as the friend\'s own her, one her');
  // a friend who has made theirs before, a Continue inside the visit: their own her goes to the kit, never the sharer's
  const back = keeper(), own = L2.roll(L2.blank(), () => 0.5); L2.keep(back.storage, own);
  const two = await run(back.storage); assert.equal(two.her.state().visit.spent, 6);
  two.find('dl-her-go').click(); await tick();
  assert.deepEqual(two.seen.pictured.map((st) => st.parts), [own.parts], 'the picture for the kit is the friend\'s own her'); assert.equal(two.her.state().visit, null);
});

// A FRIEND GRANTS A WISH (lane/a-friend-grants-a-wish; his Oct 29 2026 20:28 UTC "Yes, build it", to "a wish to the sharer for each friend whose Swarmy is born"),
// IN THE APP since Nov 1 (his "there should be 0 wishes granted outside of the app"): a friend's link keeps the sharer's code at their first stroke and the door
// into the app carries it; the friends who count are born in DysonLight, and her hello names what they bring (the doors stood in for by the page's own fetch).
const stroke = (find) => { const f = find('dl-her-field'); f.listeners.get('pointerdown')({ clientX: 0, clientY: 0, pointerId: 1, preventDefault() {} }); f.listeners.get('pointerup')(); };

test('A FRIEND\'S LINK ON THE WEB: the sharer\'s code kept at their first stroke and carried by the door into the app; nothing told on the web, her eyes open or not; none kept from a her born before, or from their own link', async () => {
  const SHARER = 'SHAR3RC0DE', link = REEL.herLink(L2.roll(L2.blank(), () => 0.3), 6, null, SHARER);
  const run = async (storage) => {
    const { doc, find } = bareDocument(), net = doors();
    const win = { location: { search: '', hash: link.slice(link.indexOf('#')), pathname: '/app/warm.html' }, history: { replaceState() {} }, requestAnimationFrame: (f) => f(), setTimeout() {},
      CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} }, fetch: net.fetch };
    const stage = async () => ({ paint: (st) => st.parts, grid() {}, clock: () => null, state: () => ({}), stop() {}, charge() {}, wishes: () => 'drawn', picture: () => null });
    const her = L2.mountHerColours({ win, doc, storage, stage, reel: () => assert.fail('no reel here') });
    await ticks();
    return { her, find, net };
  };
  const k = keeper(), { her, find, net } = await run(k.storage);
  assert.equal(her.state().visit.code, SHARER, 'the link carries the sharer\'s code'); assert.deepEqual([her.state().wish.door, her.state().wish.link], [true, `${WISH.APP_PATH}?friend=${SHARER}`], 'in the visit the door into the app stands, carrying the sharer\'s code');
  stroke(find);   // the friend's first stroke
  assert.deepEqual([her.state().visit, her.state().friends.ref, FRIEND.kept(k.storage).ref], [null, SHARER, SHARER], 'the sharer\'s code kept as their ref, in their browser');
  find('dl-her-tool').click(); await ticks();   // the die fires the other five: her eyes open
  assert.ok(her.state().whole, 'her eyes open'); assert.deepEqual([net.other, net.sent.filter((c) => c.method === 'POST')], [[], []], 'nothing told: no birth on the web, no wish'); assert.deepEqual([her.state().wish.link, her.state().friends.code], [`${WISH.APP_PATH}?friend=${SHARER}`, null], 'the door still carries the sharer\'s code; no code of their own on the web');
  // a friend whose her was born before the link keeps no ref; the sharer's own link brings them no friend
  const back = keeper(); L2.keep(back.storage, L2.roll(L2.blank(), () => 0.5));
  const b = await run(back.storage); stroke(b.find); await ticks();
  assert.deepEqual([b.her.state().friends.ref, b.her.state().wish.link], [null, WISH.APP_PATH], 'her born before the link: no friend of the sharer\'s');
  const own = keeper(); FRIEND.keep(own.storage, { ...FRIEND.none(), code: SHARER });
  const o = await run(own.storage); stroke(o.find); await ticks();
  assert.equal(o.her.state().friends.ref, null, 'their own link: no ref');
});

test('THE K-FACTOR IN THE APP: a friend born in DysonLight from her code is one more wish her hello names at the next open; the share carries the count; the web\'s friends door is asked never', async () => {
  const k = keeper(), app = hand(), door = doors();
  const her0 = { paint: (st) => st.parts, grid() {}, clock: () => ({ epoch_ms: 0, beat_ms: 600, beats_per_bar: 4, source: 'genesis' }), state: () => ({}), stop() {}, charge() {}, wishes: () => 'drawn',
    canvas: { width: 2 }, on: () => () => {}, places: () => [1, null] };
  const mount = async () => {
    const { doc, find } = bareDocument();
    const win = { location: { search: '', hash: '' }, requestAnimationFrame: (f) => f(), setTimeout() {}, CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} },
      webkit: { messageHandlers: { dysonlight: app.handler } }, fetch: door.fetch };
    const her = L2.mountHerColours({ win, doc, storage: k.storage, stage: async () => her0, reel: async () => ({ mountHerReel: () => ({ make: async () => {}, stop() {}, state: () => ({}) }) }) });
    doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'seated' } })); await ticks();
    const share = find('dl-her-share');
    return { her, find, share, n: share.children.find((c) => c.classList.contains('n')) };
  };
  const one = await mount();
  for (const w of ['one', 'two', 'three']) await wishFor(one.find, w);
  assert.deepEqual([one.her.state().wish.left, one.her.state().wish.fuel, one.share.hidden, one.n.hidden], [0, true, false, true], 'her three spent: Fuel me, the share, no friend yet');
  door.owed = 5;   // two friends born in the app from her code (the door counts them: worker/space-router.mjs)
  const two = await mount();
  assert.deepEqual([two.her.state().wish.granted, two.her.state().wish.left, two.her.state().wish.field, two.her.state().wish.fuel], [5, 2, true, false], 'two more wishes owed: the field again'); assert.deepEqual([two.n.textContent, two.n.hidden, two.share.getAttribute('aria-label')], ['2', false, 'Invite to Project Snowtrace. Friends: 2'], 'the share carries the count, a number'); assert.deepEqual([two.her.state().wishes.spent, two.find('dl-her-count').textContent], [3, '4/12'], 'her rung, the door\'s count'); assert.deepEqual(door.other, [], 'nothing asked of the web\'s friends door');
});

test('THE SHOT, Harmony\'s: a release on the field fires, ドン, and the drum turns on to the next bare chamber in the order they fire, on the sixth to the next one; the turn spends no wish', async () => {
  one(/field\.addEventListener\('pointerup', function \(e\) \{[^\n]*setAt\(p\[0\], p\[1\], true\); fire\(p\[0\], p\[1\]\); \}\);/, 'the release that fires');
  one(/function advance\(\) \{[\s\S]{0,240}?if \(isBare\(p\)\) \{ select\(p, true\); return; \} \}\n\s*select\(FIRE\[\(i \+ 1\) % FIRE\.length\], true\);/, 'advance: the next bare chamber, else the next one, forward');
  one(/if \(!forward && step > 3\) step -= 6;/, 'turnTo: forward after a shot, else the short way round');
  const play = async ({ win: more = {} } = {}) => {
    const { doc, find } = bareDocument(), k = keeper();
    const win = { location: { search: '' }, requestAnimationFrame: (f) => f(), setTimeout() {}, CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} }, ...more };
    const stage = async () => ({ paint: (st) => st.parts, grid() {}, clock: () => null, state: () => ({}), stop() {}, charge() {}, wishes: () => 'drawn' });
    const her = L2.mountHerColours({ win, doc, storage: k.storage, stage });
    doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'seated' } })); await tick(); await tick();
    const f = find('dl-her-field'), ev = (x) => ({ clientX: x, clientY: .4, pointerId: 1, preventDefault() {} }), s = () => her.state();
    const release = (x = .2) => { f.listeners.get('pointerdown')(ev(x)); f.listeners.get('pointermove')(ev(x + .1)); f.listeners.get('pointerup')(); };   // a press, a drag and a release
    const dons = () => find('dl-her-pick').children.filter((e) => e.classList.contains('dl-her-bang'));
    return { her, find, f, ev, s, release, dons };
  };
  const a = await play(), seen = [];
  for (let k = 0; k < 6; k++) { a.release(.1 * k); seen.push([a.s().sel, a.s().turn, a.s().bangs, a.s().wishes.spent]); }
  assert.deepEqual(seen, [['base', 1, 1, 0], ['coat', 2, 2, 0], ['gold', 3, 3, 0], ['thruster', 4, 4, 0], ['eyes', 5, 5, 0], ['light', 6, 6, 0]],
    'each release a ドン and the drum one chamber forward to the next bare one; her six fired, on to the next; no wish spent (THE WISH IS IN THE APP)');
  assert.ok(a.s().whole, 'her six fired: she is whole'); assert.equal(a.find('dl-her-cyl').style['--turn'], '-360deg', 'six turns forward, never back'); assert.deepEqual(a.dons().map((e) => [e.textContent, e.style['--big']]), Array(6).fill(['ドン', undefined]), 'a ドン a release, the full one (no song, no beat to be off)');
  a.release(); assert.deepEqual([a.s().sel, a.s().turn, a.s().wishes.spent], ['base', 7, 0], 'a seventh on her painted light: the drum turns on, no wish spent');
  a.f.listeners.get('pointerdown')(a.ev(.3)); a.f.listeners.get('pointercancel')();
  assert.deepEqual([a.s().sel, a.s().bangs], ['base', 7], 'a cancel keeps the paint and never fires');
  a.find('dl-her-cyl').children.find((c) => c.dataset.part === 'eyes').click();
  assert.deepEqual([a.s().sel, a.s().turn], ['eyes', 5], 'a chamber his hand picks comes the short way round');
  a.f.listeners.get('keydown')({ key: 'Enter', preventDefault() {} });
  assert.deepEqual([a.s().sel, a.s().turn, a.s().bangs], ['light', 6, 8], 'Enter fires as a release does');
  // with reduced motion the turn and no ドン
  const b = await play({ win: { matchMedia: () => ({ matches: true }) } }); b.release();
  assert.deepEqual([b.s().sel, b.s().turn, b.s().bangs, b.dons().length], ['base', 1, 0, 0], 'reduced motion: the drum turns, no ドン');
});

test('THE SONG LEFT HER MAKING (his Oct 30 2026 06:24:04 UTC, over "LET YOUR SONG BEGIN." answering "No song by that name.": "also remove the song thing it doesnt work..."): no song box under the drum, no song module, her making whole without it: the revolver, the wishes, Continue', async () => {
  const src = fs.readFileSync(path.join(HERE, 'dl-her-colours.js'), 'utf8');
  assert.doesNotMatch(src.replace(/^\/\/.*$/gm, ''), /dl-her-song|songSlot|dl-her-songslot|mountHerSong|dl-her-line\b|beatHit|Let your song begin/, 'nothing of the song box in her making\'s code'); assert.ok(!fs.existsSync(path.join(HERE, 'dl-her-song.js')) && !fs.existsSync(path.join(HERE, 'dl-her-song.mjs')), 'its two modules gone with it'); assert.match(MAC, /Let your song begin\./, 'Harmony\'s own making keeps its song (not this page)');
  const { doc, find } = bareDocument(), k = keeper(), made = [];
  const win = { location: { search: '' }, requestAnimationFrame: (f) => f(), setTimeout() {}, CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} } };
  const stage = async () => ({ paint: (st) => st.parts, grid() {}, clock: () => null, state: () => ({}), stop() {}, charge() {}, wishes: () => 'drawn', picture: () => null });
  doc.addEventListener(L2.SEEN_EVENT, (e) => made.push(e.detail.type));
  const her = L2.mountHerColours({ win, doc, storage: k.storage, stage });
  doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'seated' } })); await tick(); await tick();
  assert.deepEqual(find('dl-her-pick').children.map((c) => c.className), ['dl-her-drum'], 'the pick holds the drum alone'); assert.equal(find('dl-her').children.some((c) => /song|line/.test(c.className)), false, 'no song slot and no sung line over her'); assert.ok(!['song', 'songWhy', 'grid', 'cues', 'downs'].some((key) => key in her.state()), 'her state names no song');
  find('dl-her-tool').click(); assert.ok(her.state().whole, 'the die fires her six chambers');
  assert.equal(her.state().wishes.spent, 0, 'no wish spent: her wishes are the app\'s'); assert.equal(find('dl-her-go').disabled, false, 'Continue stands');
  find('dl-her-go').click(); assert.deepEqual([her.state().open, made.at(-1)], [false, L2.MADE], 'Continue: she is made, the rebate may come');
});

test('THE CREATOR (his Oct 30 2026 06:28:18 UTC: "perhaps we could treat better the lyssajudron character creation page... like as if it was a true mmo"): his Lyssajudron turned by his drag, her six parts as sockets round her, each a press to its chamber, her name kept, Enter the world the one door', async () => {
  // the law: three sockets each side of her, a unit of the ring from her centre; the door's word; a name kept clean
  assert.deepEqual(Object.keys(L2.RING).sort(), [...L.CHAMBERS].sort());
  for (const [c, [x, y]] of Object.entries(L2.RING)) assert.ok(Math.abs(Math.hypot(x, y) - 1) < 0.01, `${c} on the ring`);
  assert.deepEqual([Object.values(L2.RING).filter(([x]) => x < 0).length, Object.values(L2.RING).filter(([x]) => x > 0).length], [3, 3], 'they flank her'); assert.equal(L2.GO, 'Enter the world'); assert.deepEqual([L.herName('  Mr\u0007  Swarmy  the   Great and Powerful '), L.herName('ab\ncd'), L.herName(null), L.herName('x'.repeat(40)).length], ['Mr Swarmy the Grea', 'ab cd', '', L.NAME_MAX]);
  const mount = async (k) => {
    const { doc, find } = bareDocument(), turned = [];
    const win = { location: { search: '' }, requestAnimationFrame: (f) => f(), setTimeout() {}, CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} } };
    const stage = async () => ({ paint: (st) => st.parts, grid() {}, clock: () => null, state: () => ({}), stop() {}, charge() {}, wishes: () => 'drawn', picture: () => null, turn: (y) => turned.push(y) });
    const her = L2.mountHerColours({ win, doc, storage: k.storage, stage });
    doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'seated' } })); await tick(); await tick();
    return { her, find, turned };
  };
  const k = keeper(), { her, find, turned } = await mount(k);
  // the sockets round her stage, in the drum's order, each where the ring puts it
  const sockets = find('dl-her-ring').children;
  assert.deepEqual(sockets.map((b) => b.dataset.part), [...L.CHAMBERS]); assert.equal(find('dl-her-ring').parent, find('dl-her-stage'), 'round her, on her stage');
  for (const b of sockets) assert.deepEqual([b.style['--x'], b.style['--y']], L2.RING[b.dataset.part].map(String));
  assert.deepEqual(sockets.filter((b) => b.classList.contains('on')).map((b) => b.dataset.part), [her.state().sel], 'the chosen chamber ringed');
  // a press on a socket is a press on its chamber: the drum turns to it the short way, and the socket is ringed
  sockets.find((b) => b.dataset.part === 'eyes').click();
  assert.deepEqual([her.state().sel, her.state().turn, find('dl-her-cyl').style['--turn']], ['eyes', -1, '60deg'], 'the drum turns to its chamber'); assert.deepEqual(sockets.filter((b) => b.classList.contains('on')).map((b) => [b.dataset.part, b.getAttribute('aria-pressed')]), [['eyes', 'true']]);
  // his drag turns her once round across her stage; a drag begun on a socket is the socket's; an arrow a twelfth of a half
  assert.deepEqual(turned, [0], 'her turn set as her stage stands');
  const st = find('dl-her-stage'); st.clientWidth = 400; const on = (t, e) => st.listeners.get(t)(e), bare = { closest: () => null };
  on('pointerdown', { clientX: 100, pointerId: 1, target: bare }); on('pointermove', { clientX: 200, target: bare }); on('pointerup', {});
  assert.ok(Math.abs(her.state().yaw - Math.PI / 2) < 1e-9 && turned.at(-1) === her.state().yaw, 'a quarter of her stage, a quarter turn');
  on('pointerdown', { clientX: 100, pointerId: 2, target: { closest: () => ({}) } }); on('pointermove', { clientX: 300, target: bare }); on('pointerup', {});
  assert.ok(Math.abs(her.state().yaw - Math.PI / 2) < 1e-9, 'not from a socket');
  on('keydown', { key: 'ArrowRight', preventDefault() {} }); assert.ok(Math.abs(her.state().yaw - (Math.PI / 2 + L2.TURN.key)) < 1e-9);
  // her name: typed under her, kept in this browser beside her refs (never in them), there again at the next making
  const name = find('dl-her-name'); assert.deepEqual([name.placeholder, name.maxLength], ['Name', L.NAME_MAX]);
  name.value = '  Lumen  '; name.listeners.get('input')();
  assert.deepEqual([her.state().name, k.store.get(L.NAME_KEY)], ['Lumen', 'Lumen']); assert.ok(!(k.store.get(L.KEEP_KEY) ?? '').includes('Lumen'), 'not in her refs'); assert.equal((await mount(k)).find('dl-her-name').value, 'Lumen', 'kept for the next making');
  // the one door: Enter the world, Continue's road (her picture, 'made')
  const go = find('dl-her-go'); assert.equal(go.children[0].textContent, L2.GO);
  assert.equal(find('dl-her').children.filter((c) => c.tagName === 'BUTTON').length, 1, 'one button on her making\'s face: the door');
});

test('THE ROAD IS ONE TAKE (his Oct 30 2026 08:09:46 UTC "i think it could be smoother", over the creator in the preview): opened under her egg\'s flash it stands at once; its night is the whole screen at every scroll; on a phone or a tall screen it is one screen with Enter the world its floor', async () => {
  const src = fs.readFileSync(new URL('./dl-her-colours.js', import.meta.url), 'utf8');
  const open = async (detail) => {
    const { doc, find } = bareDocument(), frames = [];
    const win = { location: { search: '' }, requestAnimationFrame: (f) => frames.push(f), setTimeout() {}, CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} } };
    const stage = async () => ({ paint() {}, grid() {}, clock: () => null, state: () => ({}), stop() {}, charge() {}, wishes: () => 'drawn', picture: () => null, turn() {} });
    L2.mountHerColours({ win, doc, storage: keeper().storage, stage });
    doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', ...detail } })); await tick();
    const el = find('dl-her'), cls = () => ['cut', 'on'].filter((c) => el.classList.contains(c)).join(' ');
    const seen = [cls()]; while (frames.length) { frames.shift()(); seen.push(cls()); }
    return seen;
  };
  assert.deepEqual(await open({ egg: 'given' }), ['cut', 'cut on', 'on'], 'under her egg\'s white: no fade for its first frame, its own fade back for its close'); assert.deepEqual(await open({ egg: 'seated' }), ['', 'on'], 'opened any other way, it fades in as before'); await assert.rejects(open({}), 'THE EGG WAITS FOR THE MINT: a landing with no egg given opens no making'); assert.match(src, /\.dl-her\.cut\{transition:none\}/); assert.match(src, /void open\('stop', e\.detail\.egg === 'given'\)/);
  // the night is the screen's, wherever its own scroll stands: nothing of the page under it
  assert.match(src, /\.dl-her-veil\{position:fixed;inset:0;z-index:-1;/);
  // a phone or a tall screen: one column, one screen, her stage taking what the rest leaves, the drum and its field side by side, Enter the world its floor
  assert.match(src, /@media \(max-width:760px\),\(max-aspect-ratio:4\/5\)\{/); assert.match(src, /grid-template-rows:auto auto minmax\(200px,1fr\) auto auto auto;grid-template-areas:"say" "name" "stage" "bar" "pick" "go";/); assert.match(src, /transition:opacity \.45s ease;pointer-events:none;\n\s+overflow:auto;overscroll-behavior:contain\}/, 'a wheel or a finger over it moves nothing under it, at every size'); assert.match(src, /\.dl-her \.dl-her-drum\{flex-wrap:nowrap\}/); assert.match(src, /\.dl-her \.dl-her-go\{justify-self:stretch;justify-content:center;position:sticky;bottom:max\(10px,env\(safe-area-inset-bottom\)\);/, 'held at the floor if a short screen scrolls');
  // wide: three columns that leave her stage its room, the wish bar inside its own, the door inside its own; symmetric (his Oct 30 2026 "keep it
  // symmetric"): the revolver under her on her own axis, her name at its left and the door at its right, nothing standing at one side of her
  assert.match(src, /grid-template-columns:minmax\(200px,1fr\) minmax\(0,660px\) minmax\(200px,1fr\);/); assert.match(src, /grid-template-areas:"say say say" "\. name \." "\. stage \." "\. bar \." "\. pick \." "\. go \.";/); assert.match(src, /\.dl-her-slot\{[^}]*width:clamp\(24px,2\.4vw,36px\);height:clamp\(24px,2\.4vw,36px\);/);
});

// THE WISH IS A CALL, IN THE APP (lane/the-wish-is-a-call; his Nov 1 2026 02:11 UTC "* 3 wishes as CAC * social proof as K-factor", 04:51 UTC "there should be 0
// wishes granted outside of the app... that is our foot-in-the-door gtm operation dude"): inside DysonLight her page has the app's hand; every word it sends the
// door is proved by the app's key. On the web it has none: no field, no wish, and the door into the app in its place.
test('THE LYSSAJUDRON ENTERS (his Nov 11 2026 "i would like a more cinematic intro to lyssajudron", "the unit1s cant be static... make them go wild dude"): on his landing her making opens on her entrance and her renderer is told her hit; a press skips it; with no sheet or less motion asked there is none, and her twelve still fly unless less motion is asked', async () => {
  const land = async ({ sheet = true, less = false } = {}) => { const { doc, find } = bareDocument(), told = []; doc.removeEventListener = () => {}; const win = { location: { search: '' }, requestAnimationFrame() {}, setTimeout: () => 7, clearTimeout() {}, performance: { now: () => 1000 }, matchMedia: () => ({ matches: less }), getComputedStyle: () => ({ getPropertyValue: () => (sheet ? ' 1' : '') }), CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} } }; const stage = async () => ({ paint() {}, grid() {}, clock: () => null, state: () => ({}), stop() {}, charge() {}, wishes: () => 'drawn', picture: () => null, turn() {}, enter: (ms) => told.push(['enter', ms]), play: (on) => told.push(['play', on]) }); L2.mountHerColours({ win, doc, storage: keeper().storage, stage }); doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'given' } })); await tick(); await tick(); const el = find('dl-her'), kit = el.children.find((c) => c.classList.contains('dl-her-e')) ?? null; return { el, kit, told }; }; const a = await land(), b = await land({ sheet: false }), c = await land({ less: true }), css = fs.readFileSync(new URL('./dl-her-entrance.css', import.meta.url), 'utf8'); assert.ok(a.el.classList.contains('enter') && a.kit && a.kit.attrs['aria-hidden'] === 'true' && a.kit.innerHTML.includes(`>${L2.ENTER.name}<`) && a.kit.innerHTML.includes(`>${L2.ENTER.epithet}<`) && /assets\/athena-egg\.png"/.test(a.kit.innerHTML), 'her entrance: its one wrapper, her name card, the egg that fell'); assert.deepEqual(a.told, [['enter', L2.ENTER.hit]], 'her renderer is told her hit, on the entrance\'s own clock'); a.el.listeners.get('pointerdown')(); assert.ok(!a.el.classList.contains('enter') && !a.el.children.includes(a.kit), 'his press is the skip: the creator stands'); assert.ok(!b.el.classList.contains('enter') && !b.kit && !c.el.classList.contains('enter') && !c.kit, 'no sheet, or less motion asked: no entrance'); assert.deepEqual([b.told, c.told], [[['play', true]], []], 'her twelve fly while her making is open, unless less motion is asked'); assert.ok(Object.isFrozen(L2.ENTER) && L2.ENTER.hit < L2.ENTER.ms && css.includes('.dl-her{--dl-her-enter:1}') && css.includes(`${L2.ENTER.hit / 1000}s`) && css.replace(/\/\*[\s\S]*?\*\//, '').split('\n').filter(Boolean).every((l) => /^(\.dl-her|@keyframes dl-her-e-|  \S)/.test(l)), 'the sheet carries the flag, the hit\'s second, and no rule outside her making'); assert.match(fs.readFileSync(new URL('./warm.html', import.meta.url), 'utf8'), /<link rel="stylesheet" href="\.\/dl-her-entrance\.css\?v=[\w-]+">/);
});

test('THE WISH IS IN THE APP: her hello proved by the app\'s key names her code; the field under her bar; a wish proved by the key is one call, her answer shows; three bring the fourth pentagon in her slam; colours spend none; Fuel me', async () => {
  const k = keeper(), app = hand(), door = doors();
  const her0 = { paint: (st) => st.parts, grid() {}, clock: () => ({ epoch_ms: 0, beat_ms: 600, beats_per_bar: 4, source: 'genesis' }), state: () => ({}), stop() {}, charge() {}, wishes: () => 'drawn',
    canvas: { width: 2 }, on: () => () => {}, places: () => [1, null] };
  const { doc, find } = bareDocument();
  const win = { location: { search: '?her&friend=FR1END0C0D', hash: '' }, requestAnimationFrame: (f) => f(), setTimeout() {}, CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} },
    webkit: { messageHandlers: { dysonlight: app.handler } }, fetch: door.fetch };
  const her = L2.mountHerColours({ win, doc, storage: k.storage, stage: async () => her0 }); await ticks();
  assert.equal(her.state().open, true, '?her opens her making at once, as the cover asks');
  const w0 = app.said[0], hello = door.sent[0];
  assert.deepEqual([w0.op, w0.data.split('\n').slice(0, 2), w0.data.split('\n')[3]], ['prove', ['optimism.fit/wish/v1', 'hello'], 'FR1END0C0D'], 'the app\'s key asked to prove her hello, the friend from the link that opened the app');
  assert.deepEqual([hello.url, hello.method, hello.body.key, hello.body.attestation, hello.body.friend, hello.body.window === Number(w0.data.split('\n')[2])],
    [WISH.HELLO_PATH, 'POST', WISH.keyOf(KEY), `att-${KEY.slice(0, 4)}`, 'FR1END0C0D', true], 'her hello: the key as the door names it, its attestation, the window it proved');
  assert.deepEqual([hello.body.phone, 'platform' in hello.body], [MARK, false], 'ONE PHONE, ONE BIRTH: the phone\'s mark the key attested rides its first word'); assert.deepEqual([her.state().wish.code, her.state().wish.left, her.state().wish.field, her.state().wish.fuel, her.state().wish.door], [CODE, 3, true, false, false], 'her code; the field stands; no door into the app inside it');
  const input = find('dl-her-wish-in');
  assert.deepEqual([input.placeholder, input.maxLength, find('dl-her-wish-go').textContent], [L2.WISH_SAY, WISH.WISH_CHARS, L2.WISH_GO]);
  stroke(find); find('dl-her-tool').click(); await ticks();
  assert.equal(her.state().wishes.spent, 0, 'her colours and the die spend no wish');
  input.value = '   '; find('dl-her-wish').listeners.get('submit')({ preventDefault() {} }); await ticks();
  assert.equal(door.sent.length, 1, 'an empty wish asks nothing');
  await wishFor(find, '  a plan\n for my week ');
  const proof = app.said[1], sent = door.sent[1];
  assert.deepEqual([proof.op, proof.data.split('\n')[1], proof.data.split('\n')[3]], ['prove', 'wish', 'a plan for my week'], 'the key proves the wish as she takes it'); assert.deepEqual([sent.url, sent.method, sent.body], [WISH.WISH_PATH, 'POST', { key: WISH.keyOf(KEY), window: Number(proof.data.split('\n')[2]), wish: 'a plan for my week', assertion: 'asr-2' }], 'the wish, its window and its assertion'); assert.deepEqual([her.state().wish.answer, find('dl-her-answer').textContent, find('dl-her-answer').hidden, input.value], ['granted 1', 'granted 1', false, ''], 'her answer under her bar');
  assert.deepEqual([her.state().wishes.spent, her.state().wishes.slams, find('dl-her-count').textContent], [1, 0, '3/12'], 'the call spent a wish');
  await wishFor(find, 'a name for my cat'); await wishFor(find, 'a haiku about snow');
  assert.deepEqual([her.state().wishes.spent, her.state().wishes.slams, find('dl-her-count').textContent], [3, 1, '4/12'], 'her three calls: the fourth pentagon in her slam'); assert.deepEqual([her.state().wish.left, her.state().wish.field, her.state().wish.fuel, find('dl-her-fuel').textContent], [0, false, true, L2.FUEL], 'past the house\'s wishes: Fuel me'); assert.equal([...k.store.keys()].some((key) => /wish/.test(key)), false, 'nothing of her wishes kept in the browser: the door\'s count is the truth');
  // a key the door never saw born (an app reinstalled, a door wiped): forgotten and a new one attested, once
  const fresh = hand(), wiped = doors({ unborn: true }), again = bareDocument();
  await fresh.handler.postMessage({ op: 'prove', data: 'a word before' }); fresh.said.length = 0;   // this app's key attested long ago
  const her2 = L2.mountHerColours({ win: { ...win, location: { search: '', hash: '' }, webkit: { messageHandlers: { dysonlight: fresh.handler } }, fetch: wiped.fetch }, doc: again.doc, storage: keeper().storage, stage: async () => her0 });
  her2.open('door'); await ticks();
  assert.deepEqual(fresh.said.map((m) => m.op), ['prove', 'forget', 'prove'], 'the assertion refused (409): the key forgotten, a new one proved'); assert.deepEqual([wiped.sent.at(-1).body.attestation, her2.state().wish.code], [`att-y${KEY.slice(1, 4)}`, CODE], 'its attestation took: her code');
});

test('ON THE WEB, 0 wishes: no field, no answer, no Fuel me; the door into the app stands while the router\'s wish door is open and the app is in the store; its press puts its friend on the clipboard and goes', async () => {
  const her0 = { paint: (st) => st.parts, grid() {}, clock: () => ({ epoch_ms: 0, beat_ms: 600, beats_per_bar: 4, source: 'genesis' }), state: () => ({}), stop() {}, charge() {}, wishes: () => 'drawn',
    canvas: { width: 2 }, on: () => () => {}, places: () => [1, null] };
  const run = async (door, more = {}) => {
    const { doc, find } = bareDocument(), k = keeper(), went = [], clip = [];
    const win = { location: { search: '', hash: '', href: 'https://optimism.fit/app/warm.html', assign: (u) => went.push(u) }, navigator: { clipboard: { writeText: async (t) => { clip.push(t); } } },
      requestAnimationFrame: (f) => f(), setTimeout: (f) => f(), CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} }, fetch: door.fetch, ...more };
    const her = L2.mountHerColours({ win, doc, storage: k.storage, stage: async () => her0 });
    doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'seated' } })); await ticks();
    return { her, find, went, clip, k };
  };
  const shut = await run(doors({ open: false }));
  assert.deepEqual([shut.her.state().calls, shut.her.state().wish.field, shut.her.state().wish.fuel, shut.her.state().wish.door, shut.find('dl-her-answer').hidden], [{ open: false }, false, false, false, true], 'shut: nothing of it');
  const noStore = await run(doors({ store: null }));
  assert.deepEqual([noStore.her.state().calls, noStore.her.state().wish.door], [{ open: true, store: null, play: null }, false], 'open, the app not in the store yet: no door');
  const ANDROID = { userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 Chrome/141.0 Mobile Safari/537.36', clipboard: { writeText: async () => {} } };
  assert.equal((await run(doors(), { navigator: ANDROID })).her.state().wish.door, false, 'an Android phone, the app in the App Store alone: no door (never the App Store on Android)'); assert.equal((await run(doors({ play: 'https://play.google.com/store/apps/details?id=x' }), { navigator: ANDROID })).her.state().wish.door, true, 'in Google Play too: the door');
  const door = doors(), w = await run(door), a = w.find('dl-her-app');
  assert.deepEqual([w.her.state().wish.inApp, w.her.state().wish.field, w.her.state().wish.door, a.textContent, a.getAttribute('href')], [false, false, true, L2.WISH_SAY, WISH.APP_PATH], 'the door into the app, Make a wish');
  w.find('dl-her-tool').click(); await ticks();
  assert.deepEqual([w.her.state().wishes.spent, door.sent.filter((c) => c.method === 'POST')], [0, []], 'her colours spend nothing; nothing asks a wish');
  await a.listeners.get('click')({ preventDefault() {} }); await ticks();
  assert.deepEqual([w.went, w.clip], [['https://optimism.fit/wish'], []], 'its press goes to the app\'s door; no friend: nothing on the clipboard');
  FRIEND.keep(w.k.storage, { ...FRIEND.none(), ref: 'SHAR3RC0DE' });
  const f = await run(door, {}); FRIEND.keep(f.k.storage, { ...FRIEND.none(), ref: 'SHAR3RC0DE' });
  const g = bareDocument(), went = [], clip = [];
  const gw = { location: { search: '', hash: '', href: 'https://optimism.fit/app/warm.html', assign: (u) => went.push(u) }, navigator: { clipboard: { writeText: async (t) => { clip.push(t); } } },
    requestAnimationFrame: (fn) => fn(), setTimeout: (fn) => fn(), CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} }, fetch: door.fetch };
  L2.mountHerColours({ win: gw, doc: g.doc, storage: f.k.storage, stage: async () => her0 });
  g.doc.dispatchEvent(new CustomEvent(L2.SEEN_EVENT, { detail: { type: 'landed', egg: 'seated' } })); await ticks();
  assert.equal(g.find('dl-her-app').getAttribute('href'), `${WISH.APP_PATH}?friend=SHAR3RC0DE`, 'the friend kept at the first stroke rides the door');
  await g.find('dl-her-app').listeners.get('click')({ preventDefault() {} }); await ticks();
  assert.deepEqual([clip, went], [['https://optimism.fit/wish?friend=SHAR3RC0DE'], ['https://optimism.fit/wish?friend=SHAR3RC0DE']], 'its link on the clipboard, then on to it');
});

test('ANDROID PROVES ITSELF: inside DysonLight on Android her page speaks to the app through its web message port; her hello carries the platform and the mark, a wish its assertion', async () => {
  const k = keeper(), app = portHand(), door = doors();
  const her0 = { paint: (st) => st.parts, grid() {}, clock: () => ({ epoch_ms: 0, beat_ms: 600, beats_per_bar: 4, source: 'genesis' }), state: () => ({}), stop() {}, charge() {}, wishes: () => 'drawn',
    canvas: { width: 2 }, on: () => () => {}, places: () => [1, null] };
  const { doc, find } = bareDocument();
  const win = { location: { search: '?her', hash: '' }, requestAnimationFrame: (f) => f(), setTimeout: (f, ms) => setTimeout(f, ms), CustomEvent: globalThis.CustomEvent, URL: { createObjectURL: () => 'blob:1', revokeObjectURL() {} },
    dysonlight: app.port, fetch: door.fetch };
  const her = L2.mountHerColours({ win, doc, storage: k.storage, stage: async () => her0 }); await ticks(12);
  const hello = door.sent.find((c) => c.url === WISH.HELLO_PATH);
  assert.deepEqual([her.state().wish.inApp, app.said[0].op, app.said[0].id, hello.body.platform, hello.body.phone, her.state().wish.code], [true, 'prove', 1, 'android', MARK, CODE], 'the port\'s ask and its answer by id');
  await wishFor(find, 'a plan for my week'); await ticks(12);
  assert.deepEqual([door.sent.at(-1).body.assertion, her.state().wish.answer], ['asr-2', 'granted 1'], 'a wish proved through the port');
});

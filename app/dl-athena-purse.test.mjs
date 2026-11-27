// dl-athena-purse.test.mjs · THE FUEL IN HER TANK (his Oct 22 2026 20:39 WEST: "yeah ok... but you need to put the fucking minirouter fuel in her tank dude
// please... hypertrace all we had done historically also with MMO animations for when calls were expended"): the MiniRouter purse in Nefertiti's unit0 on
// the layer, by the one page's own painter and law. No browser, no Nest, no port. node --test dl-athena-purse.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {discIn, FIGURE} from './dl-athena.mjs';
import {levelled, mountPurseIn, REFS, PURSE_PAINTER, NEST_HUB} from './dl-athena-purse.mjs';
import * as P from '../vendor/embertide-app/ui/intro/room/lyssajudron-purse.mjs';
import {purseLevel} from '../vendor/embertide-app/ui/intro/room/unit0-liquid.mjs';
import {NEST} from '../vendor/embertide-app/ui/intro/room/nest-hub.mjs';

const here = (p) => new URL(p, import.meta.url);
// the ref as this Mac's Nest held it on Oct 22 2026 20:4x WEST (rev 1076; its rows cut to two, its money as it stood): a reading, never a write
const LIVE = Object.freeze({schema: 'embertide.purse/v1', posted_usd: 318.32, reserved_usd: 0, full_usd: 413.28, level: 0.7702, ledger: {at_ms: 1792327015154, source: 'ledger', mac: 'mac'},
  burns: [{id: 'mac-mvjq0cjq-5a065f65', at_ms: 1792684406150, cost_usd: 0.804416, in: 99363, lane: 'seat-opus'}, {id: 'mac-mvjq3lfu-77c8888a', at_ms: 1792684557642, cost_usd: 0.048044, in: 120213, lane: 'seat-opus'}],
  his: {level: 0.5, by: 'Guido', at: '2026-10-16T16:17:32.012Z', why: 'his word, Oct 16 2026 17:17:32 WEST: "make it 50% full"'}});

test('her unit0 as a disc in her box: the engine\'s centre, the crown its pole, her feet its ceiling (never under 0.3 of the radius nor over it), moved down with her square', () => {
  const side = FIGURE.side, h = Math.round(side * FIGURE.athena), crown = [75, 30], top = crown[1] - h * FIGURE.perch, over = Math.max(0, Math.ceil(-top));
  assert.deepEqual([h, top, over], [75, -37.5, 38], 'the layer\'s seat(): her perch over the crown, the square pushed down by what she overhangs');
  assert.deepEqual(discIn([75, 80], crown, {top, height: h}, over), {x: 75, y: 118, r: 50, top: 42.5});
  assert.equal(discIn([75, 80], crown, {top: 60, height: 75}).top, 15, 'her feet under the centre: the ceiling is never under 0.3 of the radius');
  assert.equal(discIn([75, 80], crown, {top: -300, height: 75}).top, 50, 'her feet far over it: never over the radius');
  assert.equal(discIn([75, 80], [75, 80], {top: 0, height: 1}), null, 'no radius, no disc'); assert.equal(discIn(null, crown, {top: 0, height: 1}), null); assert.equal(discIn([NaN, 1], crown, {top: 0, height: 1}), null);
});

test('the level is the one law\'s: his word on the tank while it stands, else the purse\'s own to a thousandth; money and rows untouched; another ref untouched', () => {
  const v = levelled(LIVE);
  assert.equal(v.level, 0.5, 'his Oct 16 "make it 50% full" stands on the purse'); assert.equal(v.posted_usd, 318.32); assert.equal(v.burns, LIVE.burns); assert.equal(v.his, LIVE.his);
  const {his, ...own} = LIVE; void his;
  assert.equal(levelled(own).level, 0.77); assert.equal(levelled(own).level, purseLevel(own));
  const drops = {schema: 'embertide.mint-drops/v1', drops: []}; assert.equal(levelled(drops), drops); assert.equal(levelled(null), null); assert.equal(levelled('x'), 'x');
  assert.deepEqual([...REFS], [...P.PURSE_REFS], 'the one page\'s three refs, in its order'); assert.equal(NEST, 'http://127.0.0.1:8904');
  assert.equal(new URL(PURSE_PAINTER, import.meta.url).pathname.endsWith('/intro/room/lyssajudron-purse.mjs'), true); assert.equal(new URL(NEST_HUB, import.meta.url).pathname.endsWith('/intro/room/nest-hub.mjs'), true);
});

test('the fuel in her tank: the three refs read once when her engine stands and followed on one stream; the one page\'s painter in her square under her perch, the money over everything; a call landing while she is out rises as the MMO number and is gone after its three beats; history never rises; a replay moves nothing; close() ends the stream', async () => {
  const page = fakePage(), T0 = Date.now(); let now = T0;
  const gets = [], sources = [];
  const fetcher = async (url, o) => { gets.push([url, o?.cache]); const name = url.split('/nest/ref/')[1];
    if (name === 'house/purse') return {ok: true, json: async () => ({name, ref: {value: LIVE, rev: 1076}})};
    if (name === 'mint/drops') return {ok: true, json: async () => ({name, ref: {value: {schema: 'embertide.mint-drops/v1', drops: []}, rev: 3}})};
    return {ok: false, status: 404}; };
  class Source { constructor(url) { this.url = url; this.closed = false; this.on = new Map(); sources.push(this); } addEventListener(t, fn) { this.on.set(t, fn); } close() { this.closed = true; } }
  const disc = {x: 75, y: 118, r: 50, top: 42.5};
  const F = await mountPurseIn({doc: page.document, box: page.box, before: page.perch, disc: () => disc, fetcher, nest: 'http://127.0.0.1:8904', Source, now: () => now, dpr: 2});
  await F.first;
  assert.deepEqual(gets, REFS.map((n) => [`http://127.0.0.1:8904/nest/ref/${n}`, 'no-store']), 'the four refs (the purse\'s three and the Nest\'s settings), once, in the one page\'s order, never cached');
  assert.equal(sources.length, 1); assert.equal(sources[0].url, 'http://127.0.0.1:8904/nest/stream?types=ref&refs=house/purse,house/blobby,mint/drops,house/settings', 'one stream for the four');
  let s = F.state();
  assert.equal(s.reads, 1); assert.equal(s.refs, 2, 'the purse and the drops taken, blobby not on the Nest'); assert.equal(s.stream, true); assert.equal(s.on, true); assert.equal(s.posted, 318.32); assert.equal(s.level, 0.5, 'his word on the tank');
  assert.equal(s.built, true); assert.equal(s.shown, true); assert.equal(s.numbers, 0, 'the rows on the Nest before this glass\'s first picture are history: nothing rises');
  const ids = page.box.children.map((c) => c.id), at = (id) => ids.indexOf(id);
  assert.ok(at('purse-ale') >= 0 && at('purse-sheen') >= 0 && at('purse-balance') >= 0 && at('purse-held') >= 0 && at('purse-numbers') >= 0, ids.join(','));
  assert.ok(at('lysa') < at('purse-ale') && at('purse-sheen') < at('perch') && at('perch') < at('purse-balance'), 'over her engine, under her perch; the money over everything: ' + ids.join(','));
  const bal = page.box.children.find((c) => c.id === 'purse-balance'), air = page.box.children.find((c) => c.id === 'purse-numbers');
  assert.equal(bal.textContent, '$318.32'); assert.equal(bal.style.visibility, 'inherit');
  // THE DAMAGE NUMBER: a call lands while she is out (the stream hands the ref again, one row newer), and rises from the beat after its own time for three beats
  now = T0 + 1000;
  const row = {id: 'newmac-' + T0.toString(36) + '-feedf00d', at_ms: T0 + 900, cost_usd: 0.804416, in: 99363, lane: 'seat-opus'};
  const next = {value: {...LIVE, posted_usd: 317.52, burns: [...LIVE.burns, row]}, rev: 1077};
  sources[0].onmessage({data: JSON.stringify({type: 'ref', payload: {name: 'house/purse', ...next}})});
  s = F.state(); assert.equal(s.refs, 3, 'the purse and the mint\'s drops at the keyframe (each ref\'s rev taken once), then the purse again'); assert.equal(s.posted, 317.52);
  now = T0 + 1700; F.sample(); s = F.state();
  assert.equal(s.numbers, 1, 'the number is in the air'); assert.equal(air.children[0].textContent, '-$0.80 · 99k', 'the old painter\'s damage number: the cost, the tokens in');
  assert.equal(F.take({value: next.value, rev: 1077}, 'house/purse'), false, 'a replay of the stream moves nothing');
  assert.equal(F.take({value: next.value, rev: 1077}, 'no/such'), false, 'a ref the layer does not read is nothing');
  sources[0].onmessage({data: 'not an entry'});
  now = T0 + 6000; F.sample(); assert.equal(F.state().numbers, 0, 'gone after its flight');
  sources[0].on.get('gap')(); await new Promise((r) => setImmediate(r)); assert.equal(F.state().reads, 2, 'a gap on the stream reads the keyframe again');
  F.close(); assert.equal(sources[0].closed, true); assert.equal(F.state().built, false, 'its layers leave the page'); assert.equal(F.take(next, 'house/purse'), false);
});

test('no purse on the Nest: nothing is drawn, nothing is built; the painter is the one page\'s and the law its law (the test holds the files together)', async () => {
  const page = fakePage(); let now = Date.now();
  const fetcher = async () => ({ok: false, status: 404});
  class Source { constructor(url) { this.url = url; } addEventListener() {} close() {} }
  const F = await mountPurseIn({doc: page.document, box: page.box, before: page.perch, disc: () => ({x: 75, y: 118, r: 50, top: 42.5}), fetcher, nest: 'http://127.0.0.1:8904', Source, now: () => now});
  await F.first; F.sample();
  assert.equal(F.state().on, false); assert.equal(F.state().built, false); assert.deepEqual(page.box.children.map((c) => c.id), ['lysa', 'perch']);
  const src = readFileSync(here('./dl-athena-purse.mjs'), 'utf8');
  assert.deepEqual([...src.matchAll(/^import .* from '(.+)';$/gm)].map((m) => m[1]), ['../../room/unit0-liquid.mjs'], 'the one law of the level alone loads with it; the painter and the hub come when a purse is mounted');
  assert.match(src, /mountPurse2D\(\{document: doc, box, before, disc, dpr, zoom, law\}\)/); assert.match(src, /painter\.mark\(now\(\)\)/);
  assert.equal((src.match(/Date\.now|setInterval|setTimeout|requestAnimationFrame/g) || []).length, 1, 'the Mac\'s clock as the default now(), and no timer of its own');
  F.close();
});

test('THE TANK HEARS THE ASK (Nov 4 2026): a seat stalled on his word stands in her tank with no purse on the Nest, the totem and its question; read through the hand the page gives at the mount and at every sample, nothing read of its own; his word given, the centre is free', async () => {
  const page = fakePage(); let now = Date.now();
  const gets = []; const fetcher = async (url) => { gets.push(url); return {ok: false, status: 404}; };
  class Source { constructor(url) { this.url = url; } addEventListener() {} close() {} }
  let list = [], asked = 0;
  const F = await mountPurseIn({doc: page.document, box: page.box, before: page.perch, disc: () => ({x: 75, y: 118, r: 50, top: 42.5}), fetcher, nest: 'http://127.0.0.1:8904', Source, now: () => now, stalled: () => { asked++; return list; }});
  await F.first; F.sample();
  assert.ok(asked >= 2, 'read at the mount and at the sample: ' + asked); assert.equal(F.state().built, false, 'nobody waits and no purse: nothing is built');
  list = [{seat: 'claude-tank', name: 'The tank hears the ask', ask: {text: 'Hand it to the lander?', at: now - 500, blocked: true, choices: ['Hand it', 'Not now']}}];
  now += 100; F.sample();
  const s = F.state();
  assert.equal(s.stall && s.stall.seat, 'claude-tank', 'the seat stalled on his word is at the centre'); assert.deepEqual(s.stall.choices, ['Hand it', 'Not now']);
  assert.equal(s.on, false, 'no purse'); assert.equal(s.built, true, 'built on the stall alone');
  const ids = page.box.children.map((c) => c.id);
  assert.ok(ids.includes('purse-totem') && ids.includes('purse-ask'), 'the totem and the question in her square: ' + ids.join(','));
  assert.equal(page.box.children.find((c) => c.id === 'purse-ask').textContent, 'Hand it to the lander?');
  assert.deepEqual(gets, REFS.map((n) => `http://127.0.0.1:8904/nest/ref/${n}`), 'its own reads are the purse\'s refs alone: the agents come by the hand');
  list = []; now += 100; F.sample();
  assert.equal(F.state().stall, null, 'his word given: the centre is free again');
  F.close();
});

// ---- the stubs (the one page's purse test's, lyssajudron-purse.test.mjs) ----
function fakeCtx() {
  const calls = [], grad = {addColorStop() {}};
  return new Proxy({calls}, {get: (o, k) => (k in o ? o[k] : k === 'measureText' ? () => ({width: 300}) : /^create.*Gradient$/.test(String(k)) ? () => grad : (...a) => { calls.push(String(k)); void a; }), set: (o, k, v) => { o[k] = v; return true; }});
}
/** her square on the layer: the engine's canvas and her perch; elements with a style, an id, children */
function fakePage() {
  const el = (tag) => { const ctx = tag === 'canvas' ? fakeCtx() : null; const e = {tag, id: '', style: {cssText: ''}, children: [], parentNode: null, textContent: '', width: 0, height: 0, ctx,
    setAttribute() {}, getAttribute: () => null, hasAttribute: () => false, removeAttribute() {}, getContext: () => ctx,
    append(...xs) { for (const x of xs) { x.parentNode = e; e.children.push(x); } },
    insertBefore(x, ref) { const was = e.children.indexOf(x); if (was >= 0) e.children.splice(was, 1); x.parentNode = e; const i = ref ? e.children.indexOf(ref) : -1; if (i < 0) e.children.push(x); else e.children.splice(i, 0, x); },
    remove() { const p = e.parentNode; if (p) { p.children.splice(p.children.indexOf(e), 1); e.parentNode = null; } }}; return e; };
  globalThis.Path2D = globalThis.Path2D || class { constructor(d) { this.d = d; } };
  const box = el('div'), canvas = el('canvas'), perch = el('span'); canvas.id = 'lysa'; perch.id = 'perch'; box.append(canvas, perch);
  return {document: {createElement: el}, box, perch};
}

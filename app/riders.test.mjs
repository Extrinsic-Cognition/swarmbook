// riders.test.mjs: A SWARM WEARS ITS RIDERS (riders.mjs; the house's half is worker/space-router-portrait.test.mjs, the ball's polis-knock.test.mjs): made-up seats, made-up faces.
import { test } from 'node:test'; import assert from 'node:assert/strict'; import fs from 'node:fs';
import { mountRiders, seatedOf, FACES, ASK, HANDLE } from './riders.mjs'; import { RIDERS, PORTRAIT_PATH } from '../worker/space-router-portrait.mjs'; import * as floor from './swarmbook-floor.mjs';

const read = (f) => fs.readFileSync(new URL(f, import.meta.url), 'utf8'), turn = () => new Promise((ok) => setTimeout(ok, 5)), pic = (c) => `/space-router/v1/portrait/${c.repeat(32)}.jpg`, A = pic('a'), B = pic('b'), img = `drawn ${A}`;
function stand({ riders = {}, down = false } = {}) {
  const s = { asks: [], came: 0, down, riders, broken: new Set() };
  s.r = mountRiders({ onFaces: () => { s.came += 1; }, picture: async (src) => { if (s.broken.has(src)) throw new Error('404'); return `drawn ${src}`; },
    fetcher: async (url) => { const here = new URL(url, 'https://x').searchParams.get('riders').split(','); s.asks.push(here); return { json: async () => (s.down ? { error: { message: 'closed' } } : { riders: Object.fromEntries(Object.entries(s.riders).filter(([k]) => here.includes(k))) }) }; } });
  return s;
}

test('the hexagons of a chamber are its holders\' keys in their order, one each seat; a chamber holding seats wears no face', () => {
  const r = { holders: [{ kind: 1, seats: 2n, k: 'a' }, { kind: 2, seats: 1n, k: 'b' }, { kind: 1, seats: 1n, k: 'c' }] };
  assert.deepEqual(seatedOf(r, (h) => (h.kind === 1 ? h.k : null)), ['a', 'a', null, 'c']); assert.deepEqual(seatedOf({ holders: [] }, () => 'x'), []);
});
test('every key of one turn goes in one ask, each key once; a face is worn once it is drawn, and a press on it opens its person\'s page where one was claimed', async () => {
  const s = stand({ riders: { a: { picture: A, handle: 'anna_x' }, c: { picture: B } } }); s.r.ask(['a', 'b', 'a', null]); s.r.ask(['b', 'c']); assert.equal(s.r.wears('a'), null, 'not drawn yet');
  await turn(); assert.deepEqual(s.asks, [['a', 'b', 'c']]); assert.equal(s.came, 1, 'the balls are told once'); assert.deepEqual([s.r.wears('a', null, false), s.r.wears('c', null, false)], [{ img, press: '/anna_x' }, { img: `drawn ${B}`, press: null }]);
  assert.deepEqual([s.r.of('a').src, s.r.of('a').page, s.r.of('c').page, s.r.of('b'), s.r.of('z')], [A, '/anna_x', null, null, null]); assert.deepEqual([s.r.wears('b', 'gold', true), s.r.wears(null), s.r.wears('z')], [null, null, null]); s.r.ask(['a', 'b', 'c']); await turn(); assert.equal(s.asks.length, 1, 'known, or known to wear none');
});
test('in a vote a face is dim until its yes, then whole and rimmed in the floor\'s gold; nothing new is made at a frame', async () => {
  const s = stand({ riders: { a: { picture: A } } }); s.r.ask(['a']); await turn(); const wait = { img, press: null, dim: 0.42 };
  assert.deepEqual([s.r.wears('a', null, true), s.r.wears('a', 'red', true), s.r.wears('a', 'gold', true)], [wait, wait, { img, press: null, rim: '#FFC62E', width: 5 }]); assert.equal(s.r.wears('a', 'gold', true), s.r.wears('a', 'gold', true)); assert.equal(s.r.wears('a', null, false), s.r.wears('a', 'gold', false));
});
test('only the house\'s own pictures and pages: any other address, or a handle that is none, is worn by nobody', async () => {
  const s = stand({ riders: { a: { picture: 'https://elsewhere/x.jpg' }, b: { picture: `${A}?x=1` }, c: 'x', d: { picture: B, handle: 'a/../b' } } }); s.r.ask(['a', 'b', 'c', 'd']); await turn();
  assert.deepEqual(['a', 'b', 'c'].map((k) => s.r.of(k)), [null, null, null]); assert.equal(s.r.of('d').page, null); assert.equal(String(HANDLE), String(floor.HANDLE), 'a handle as the front\'s ball reads it');
});
test('a door that does not answer, or a picture that does not load, costs no face for ever and no poll: asked again when a chamber is read again', async () => {
  const s = stand({ riders: { a: { picture: A }, b: { picture: B } }, down: true }); s.r.ask(['a', 'b']); await turn(); await turn(); assert.equal(s.asks.length, 1, 'nothing asks again by itself'); assert.equal(s.came, 0);
  s.down = false; s.broken.add(B); s.r.ask(['a', 'b']); await turn(); assert.deepEqual([s.r.of('a')?.src, s.r.of('b'), s.came], [A, null, 1]); s.broken.clear(); s.r.ask(['a', 'b']); await turn(); assert.deepEqual(s.asks.at(-1), ['b']); assert.equal(s.r.of('b').src, B);
});
test('THE RIDER\'S COLOURS CROSS: a key with no minted face wears her in its person\'s own colours, all of one ask drawn in one staging; colours that are none, or a painter that cannot stand, leave the default', async () => {
  const RED = { light: '#FF3B30', base: '#F2E8DC', coat: '#2E4057', gold: '#C9A227', eyes: '#E4572E', thruster: '#76B041' }, stagings = [], s = stand({ riders: { a: { colours: RED, handle: 'anna_x' }, b: { colours: { ...RED, eyes: 'red' } }, c: { picture: A, colours: RED }, d: { colours: { ...RED, light: '#ffffff' } } } });
  const r = mountRiders({ fetcher: async (url) => ({ json: async () => ({ riders: s.riders }) }), picture: async (src) => `drawn ${src}`, draw: async (list) => { stagings.push(list); if (s.down) throw new Error('no WebGL'); return list.map((c) => `her in ${c.light}`); }, onFaces: () => { s.came += 1; } });
  r.ask(['a', 'b', 'c', 'd']); await turn(); assert.deepEqual(stagings, [[RED, { ...RED, light: '#ffffff' }]], 'one staging for the ask; the minted face is its painting'); assert.deepEqual([r.wears('a'), r.of('a').page, r.wears('c').img, r.of('b'), s.came], [{ img: 'her in #FF3B30', press: '/anna_x' }, '/anna_x', img, null, 1]);
  s.down = true; s.riders = { e: { colours: RED } }; r.ask(['e']); await turn(); assert.equal(r.of('e'), null, 'no painter: the default'); s.down = false; r.ask(['e']); await turn(); assert.equal(r.wears('e').img, 'her in #FF3B30', 'asked again with the registry, never on a timer');
});
test('a wall of many seats asks as many keys at a time as the house answers', async () => {
  assert.equal(ASK, RIDERS); assert.equal(FACES, PORTRAIT_PATH); const s = stand(); s.r.ask(Array.from({ length: 2 * ASK + 3 }, (_, i) => `k${i}`)); await turn(); assert.deepEqual(s.asks.map((a) => a.length), [ASK, ASK, 3]);
});
test('every society\'s ball wears its riders, on the wall and on its page; the page\'s own hexagons first; a press on a face opens a page, never a knock', () => {
  const tree = read('./tree.js'), polis = read('./polis.js'), wall = read('./wall.js');
  assert.match(tree, /if \(type === 'pent'\) return registries\.get\(node\.slice\(1\)\)\?\.pentagons\[i\]\?\.kind === g\.P\.HOLDER\.KEY \? personOf\(NECROMANCER\)\?\.rest \?\? null : null;/, 'THE PENTAGONS ARE THE NECROMANCERS: a pentagon one key holds wears its person, Nefertiti (THE RIDER IS A HEXAGON: no rider\'s word reaches a pentagon); a unit or an open one wears nobody'); assert.doesNotMatch(tree, /pents\.set|riders\.person/, 'its key is not asked of the house'); assert.match(tree, /hers = riders\.wears\(k, vote, t\.inst\.agentVoting\) \?\? \(k \? personOf\(LYSSAJUDRON\) : null\); return !hers \|\| hers\.img \? hers : !t\.inst\.agentVoting \? hers\.rest : vote === 'gold' \? hers\.yes : hers\.wait;/, 'A HELD HEXAGON WEARS HER: its rider\'s own Lyssajudron first, else her default, dim until its yes in a vote; a hexagon no key holds wears nothing'); assert.match(tree, /facesIn = \(t\) => seatedIn\(t\.g, t\.g\.registries\.get\(t\.rootId\)\)\.flatMap\(\(k, i\) => \(k \? \[i\] : \[\]\)\);/, 'a ball turns to every hexagon a key holds'); assert.match(tree, /persons\.set\(who, \{ rest: \{ img \}, wait: \{ img, dim: 0\.42 \}, yes: \{ img, rim: '#FFC62E', width: 5 \} \}\)/, 'made once when the picture comes, nothing new at a frame'); assert.match(tree, /NECROMANCER = 'her-sprite\.png', LYSSAJUDRON = 'her-default\.jpg'/); assert.ok(fs.existsSync(new URL('./assets/her-default.jpg', import.meta.url)), 'her default portrait ships with the page'); assert.ok(fs.existsSync(new URL('./assets/her-sprite.png', import.meta.url)), 'the default person, Nefertiti, ships with the page'); const engine = read('./engine.js'); assert.match(engine, /s\.faceWear\[slot\]=t\.wear&&!flat&&nw2<-\.06\?t\.wear\(name,idx,st\.hv\[idx\],type\):null;/, 'the engine asks what a pentagon wears too'); assert.match(engine, /function wear\(t,ctx,p,w\)\{ if\(p\.length===10\)\{[^\n]*ctx\.clip\(\);[^\n]*ctx\.drawImage\(w\.img,28,0,200,200,[^\n]*return; \}/, 'five corners: the picture upright inside the pentagon, then nothing of the hexagon\'s map'); assert.match(tree, /trees\.delete\(t\)/); assert.match(wall, /onFaces: \(t\) => \{[^\n]*turnTo\(t, facesIn\(t\)\)/);
  assert.match(polis, /const ridden=tree\.inst\.wear;tree\.inst\.wear=\(node,i,vote,type\)=>type==='pent'\?ridden\(node,i,vote,type\):hexOf\([^;]*\)\?\?ridden\(node,i,vote\);/); assert.match(polis, /if\(id\?\.\[0\]==='\/'\)location\.href=id;else if\(id\)openKnock\(id\);/);
});
test('THE WORKER BUILDS WITHOUT HER PAINTER (Nov 24 2026, his deploy failed at "Could not resolve three"): riders.mjs imports nothing at run time; her painter is the caller\'s (tree.js)', () => assert.doesNotMatch(fs.readFileSync(new URL('./riders.mjs', import.meta.url), 'utf8'), /\bimport\s*\(/));

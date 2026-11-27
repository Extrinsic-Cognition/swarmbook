// swarmbook-floor.test.mjs: THE BALL IS SOLANA'S STATE. The front's ball is the meta swarm's floor: the mints the house's door lists, folded by the land law with the rung following the count; the faces are the mint sphere's own, loaded only once someone minted; his review stands on the house's own doors alone. THE HEX IS A PAGE: a held hexagon's face leads to its holder's page; this browser's own person is read off the mint page's own store, and the hero is theirs. node --test app/swarmbook-floor.test.mjs
import test from 'node:test'; import assert from 'node:assert/strict'; import { readFileSync } from 'node:fs';
import { mountFloor, reviewOf, reviewOwn, reviewColours, ownOf, heroOf, DROPS, FACES, FRONT, PAGE, MINT, FLASK, MAKING } from './swarmbook-floor.mjs';
import { foldFloor, reviewSeats, CLEAR, FILM_FRONT } from './dl-mint-ledger.js';
import { buildAssemblySkin } from './assembly-geometry.js';
const read = (f) => readFileSync(new URL(f, import.meta.url), 'utf8'), dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

test('the rung follows the count: the dodecahedron with no mint, 30 places at the first, a rung more when the places are full, never past the last', () => {
  for (const [n, rung, capacity] of [[0, 0, 0], [1, 1, 30], [30, 1, 30], [31, 2, 80], [80, 2, 80], [81, 3, 150], [150, 3, 150], [151, 4, 240], [630, 7, 630], [700, 7, 630]]) {
    const f = foldFloor(reviewSeats(n), FRONT); assert.equal(f.rung, rung, `${n} mints: rung`); assert.equal(f.capacity, capacity, `${n} mints: places`);
    assert.equal(f.held.length, Math.min(n, 630), `${n} mints: every mint a hexagon, while land is left`);
    assert.equal(new Set(f.held.map((h) => h.face)).size, f.held.length, 'a hexagon a mint'); assert.ok(f.held.every((h) => h.face >= 0 && h.face < capacity && typeof h.signature === 'string'));
    assert.equal(buildAssemblySkin(capacity).hexes.length, capacity, 'the rung\'s own skin holds exactly its places');
  }
});
test('the same list, the same floor; a mint keeps its hexagon\'s holder through every rung; its number is the list\'s', () => {
  assert.deepEqual(foldFloor(reviewSeats(57), FRONT), foldFloor(reviewSeats(57), FRONT));
  let before = new Set();
  for (const n of [1, 12, 30, 31, 80, 81, 150, 151]) { const now = new Set(foldFloor(reviewSeats(n), FRONT).held.map((h) => h.signature)); for (const s of before) assert.ok(now.has(s), `${s} is still held at ${n}`); before = now; }
  const f = foldFloor(reviewSeats(12), FRONT); assert.deepEqual(f.held.map((h) => h.n).sort((a, b) => a - b), Array.from({ length: 12 }, (_, i) => i + 1));
  assert.deepEqual(f.held.filter((h) => h.metal === 'gold').map((h) => h.n).sort((a, b) => a - b), [5, 10], 'the list\'s golds are gold');
});
test('the ball turns, so the mints stand all round it: the first where the film\'s stop shows it, the next far from every one held', () => {
  const skin = buildAssemblySkin(30), dir = (h) => skin.hexes[h.face].normal, one = foldFloor(reviewSeats(1), FRONT).held[0], angle = (d) => Math.acos(Math.max(-1, Math.min(1, dot(d, FRONT))));
  assert.ok(angle(dir(one)) < Math.PI / 2 && angle(dir(one)) >= CLEAR, 'the first mint stands in the front\'s half, clear of his circle');
  assert.ok(skin.hexes.filter((f) => angle(f.normal) < Math.PI / 2 && angle(f.normal) >= CLEAR).every((f) => angle(f.normal) >= angle(dir(one)) - 1e-12), 'the nearest the front of those');
  const six = foldFloor(reviewSeats(4), FRONT).held;                   // four bronzes (the fifth of the lab's is a gold)
  for (const a of six) for (const b of six) if (a !== b) assert.ok(dot(dir(a), dir(b)) < .5, 'no two of the first four stand within sixty degrees');
  const twelve = foldFloor(reviewSeats(12), FRONT).held, mean = [0, 1, 2].map((k) => twelve.reduce((s, h) => s + dir(h)[k], 0) / 12);
  assert.ok(Math.hypot(...mean) < .5, `twelve mints stand round the ball, on no one side (${Math.hypot(...mean).toFixed(2)}; a cluster would read over .9)`);
});
test('his review stands on the house\'s own doors alone', () => {
  assert.equal(reviewOf({ hostname: 'localhost', search: '?pour=12' }), 12); assert.equal(reviewOf({ hostname: '127.0.0.1', search: '?pour=0' }), 0); assert.equal(reviewOf({ hostname: 'x.localhost', search: '?pour=7.9' }), 7);
  assert.equal(reviewOf({ hostname: 'localhost', search: '?pour=99999' }), 630, 'the last rung at most');
  for (const [hostname, search] of [['swarmbook.com', '?pour=12'], ['optimism.fit', '?pour=1'], ['localhost.evil.com', '?pour=3'], ['localhost', ''], ['localhost', '?pour=-1'], ['localhost', '?pour=x']]) assert.equal(reviewOf({ hostname, search }), null, `${hostname}${search}`);
  const c = reviewColours(7); assert.deepEqual(Object.keys(c), ['light', 'base', 'coat', 'gold', 'eyes', 'thruster']); for (const v of Object.values(c)) assert.match(v, /^#[0-9A-F]{6}$/);
  assert.notDeepEqual(reviewColours(1), reviewColours(2));
});

/** an invented browser's flask store (dl-kit-deposit.js's 'dl-flask'): `kept` null where this browser never made one */
function flaskStore(kept) {
  const S = { undone: 0, closed: 0 };
  S.open = (name) => { assert.equal(name, 'dl-flask'); const o = {}; queueMicrotask(() => {
    if (!kept) { o.transaction = { abort() { S.undone++; } }; o.onupgradeneeded(); return void o.onerror(); }   // no such store: the open would make one
    const t = { objectStore: (n) => { assert.equal(n, 'keys'); return { get: (k) => ({ result: kept[k] }) }; } }; o.result = { transaction: () => t, close() { S.closed++; } }; o.onsuccess(); queueMicrotask(() => t.oncomplete());
  }); return o; };
  return S;
}
function house({ hostname = 'swarmbook.com', search = '', answers = [], faces = { count: 0, hexagons: [] }, kept = undefined, hooked = true } = {}) {
  const asked = [], floors = [], hooks = [], events = [], timers = [], listeners = {}, lives = []; let loads = 0, fills = 0, mounted = null, facesAsked = 0;
  const win = { location: { hostname, search }, setInterval: (fn, ms) => { timers.push([fn, ms]); }, dispatchEvent: (e) => { events.push(e); }, CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } },
    DL_HER_PORTRAIT: { fill: async () => { fills++; } } };
  const line = { textContent: 'It’s time to fuel your Swarmy.' }, hero = { href: MINT, setAttribute(k, v) { this[k] = v; }, querySelector: (q) => (q === '.mint-big-kicker' ? line : null) };
  const doc = { hidden: false, addEventListener: (t, fn) => { listeners[t] = fn; }, querySelector: (q) => (q === '.hero .mint-big' ? hero : null) };
  const fetcher = async (url) => { if (url === FACES) { facesAsked++; return { ok: true, status: 200, json: async () => faces }; } asked.push(url); const a = answers.shift(); if (a === undefined || a === 'down') throw new Error('the door is down'); return { ok: a.status === undefined, status: a.status ?? 200, json: async () => a }; };
  const load = async () => { loads++; return { mountHerPortrait: (o) => { mounted = o; return { fill: async () => { fills++; } }; } }; };
  const store = kept === undefined ? undefined : flaskStore(kept), floor = mountFloor({ win, doc, fetcher, load, idb: store, live: (o) => (lives.push(o), { close() {} }), onFloor: (f) => floors.push(f), onFaces: hooked ? (fn) => hooks.push(fn) : undefined });
  return { floor, asked, floors, hooks, events, timers, listeners, lives, doc, hero, line, store, loads: () => loads, fills: () => fills, mounted: () => mounted, facesAsked: () => facesAsked };
}
const settle = () => new Promise((ok) => setTimeout(ok, 5));

test('an empty list is the dodecahedron and loads nothing of the faces; a mint read is a floor said again, its faces asked of the mint sphere\'s own module', async () => {
  const H = house({ answers: [{ drops: [], now_ms: 1 }, { drops: [{ n: 1, signature: 'sigA', tier: 'bronze' }, { n: 2, signature: 'sigB', tier: 'gold' }] }, { drops: [] }, 'down', { status: 503 }, { drops: [{ n: 3, signature: 'sigC', tier: 'bronze' }] }] });
  await settle();
  assert.equal(H.floors.length, 1); assert.deepEqual({ count: H.floors[0].count, capacity: H.floors[0].capacity, held: H.floors[0].held, review: H.floors[0].review }, { count: 0, capacity: 0, held: [], review: false });
  assert.deepEqual(H.asked, [`${DROPS}?after=0`]); assert.equal(H.loads(), 0, 'no face is loaded for an empty floor'); assert.equal(H.events.length, 0);
  await H.floor.read(); await settle();
  assert.equal(H.floors.length, 2); assert.equal(H.floors[1].count, 2); assert.equal(H.floors[1].capacity, 30); assert.deepEqual(H.floors[1].held.map((h) => [h.signature, h.metal, h.n]).sort(), [['sigA', 'bronze', 1], ['sigB', 'gold', 2]]);
  assert.equal(H.loads(), 1); assert.equal(H.fills(), 1, 'the faces\' own module reads them off the door'); assert.equal(H.mounted(), null, 'on a public name the module\'s own instance, its own door');
  assert.equal(H.events.length, 1); assert.equal(H.events[0].type, 'genesis-sphere'); const hook = () => {}; H.events[0].detail.setSeatFace(hook); assert.deepEqual(H.hooks, [hook], 'its hook is handed on');
  await H.floor.read(); await H.floor.read(); await H.floor.read(); await settle();   // nothing new; the door down; the door refusing
  assert.deepEqual(H.asked, [`${DROPS}?after=0`, `${DROPS}?after=0`, ...Array(3).fill(`${DROPS}?after=2`)], 'read on from where it left off'); assert.equal(H.floors.length, 2, 'a door that does not answer leaves the floor as it was read'); assert.match(H.floor.state().why, /503/);
  await H.floor.read(); await settle();
  assert.equal(H.floors.length, 3); assert.equal(H.floors[2].count, 3); assert.equal(H.loads(), 1, 'the module is loaded once'); assert.equal(H.fills(), 2, 'and asked again for the new face');
  assert.equal(H.facesAsked(), 2, 'the pages: the door\'s faces read once with each floor that holds a mint, never for an empty one');
  assert.equal(H.timers.length, 0, 'no poll'); assert.equal(H.lives.length, 1, 'one socket to the door'); assert.equal(typeof H.listeners.visibilitychange, 'function');
  H.doc.hidden = true; await H.floor.read(); assert.equal(H.asked.length, 6, 'a hidden page asks nothing');
  assert.equal(PAGE, 500, 'the door\'s own page (worker/space-router-deposit.mjs: LIMIT 500)'); assert.deepEqual([...FRONT], [...FILM_FRONT], 'the mint page\'s front: one floor on every ball');
});
test('THE RIDER STANDS ON THE META SWARM: every claw rider the list names stands as a hexagon after the minted ones, numbered on from them, with no seat and no mint; their faces asked as a mint\'s', async () => {
  const H = house({ answers: [{ drops: [], riders: ['rider-1', 'rider-2', 'nobody'] }, { drops: [{ n: 1, signature: 'sigA', tier: 'bronze' }], riders: ['rider-1', 'rider-2'] }] }); await settle();
  assert.deepEqual([H.floors.at(-1).count, H.floors.at(-1).held.map((h) => [h.signature, h.metal, h.n]).sort(), H.loads()], [0, [['rider-1', 'bronze', 1], ['rider-2', 'bronze', 2]], 1], 'no mint yet: two riders, the ball no longer the dodecahedron, their faces asked; the count is the mints\' (the sphere says "0 Lyssajudrons minted": a rider minted nothing)');
  await H.floor.read(); await settle(); assert.deepEqual(H.floors.at(-1).held.map((h) => [h.signature, h.n]).sort(), [['rider-1', 2], ['rider-2', 3], ['sigA', 1]], 'a mint read: the riders stand after it');
  assert.deepEqual(H.floors.at(-1).list.map((s) => [s.signature, s.slot, s.tier]), [['sigA', 1, 'bronze'], ['rider-1', 2, 'bronze'], ['rider-2', 3, 'bronze']], 'HER AT THE CENTRE: the one list it folded, the mints then the riders, is her sphere\'s pour');
  const B = house({ hooked: false, answers: [{ drops: [], riders: ['rider-1'] }] }); await settle(); assert.deepEqual([B.loads(), B.events.length], [1, 0], 'no hook of its own: the faces go to her sphere, no stand-in sphere is said');
});
test('THE HOUSE SAYS IT AT ONCE: a mint the door pushes falls in at once with no read; across a gap, or at the socket\'s opening, the list is read', async () => {
  const H = house({ answers: [{ drops: [{ n: 1, signature: 'sigA', tier: 'bronze' }] }, { drops: [{ n: 3, signature: 'sigC', tier: 'bronze' }, { n: 4, signature: 'sigD', tier: 'gold' }] }, { drops: [] }] }); await settle();
  const L = H.lives[0]; assert.equal(H.floors.at(-1).count, 1); L.onDrops([{ n: 2, signature: 'sigB', tier: 'gold' }]); assert.deepEqual([H.floors.at(-1).count, H.asked.length], [2, 1], 'the pushed mint on the ball, with no read');
  L.onDrops([{ n: 2, signature: 'sigB', tier: 'gold' }, { n: 1, signature: 'sigA' }]); assert.equal(H.floors.length, 3, 'a row it holds is not taken again');
  L.onDrops([{ n: 4, signature: 'sigD', tier: 'gold' }]); await settle(); assert.deepEqual([H.asked.at(-1), H.floors.at(-1).count], [`${DROPS}?after=2`, 4], 'a gap: the list read from where it stands');
  L.onOpen(); await settle(); assert.equal(H.asked.at(-1), `${DROPS}?after=4`, 'an opening reads what was missed');
});
test('his review: N seats of the lab\'s own, no door asked, their faces her painter\'s from colours made up here', async () => {
  const H = house({ hostname: 'localhost', search: '?pour=5' }); await settle();
  assert.equal(H.asked.length, 0); assert.equal(H.timers.length, 0); assert.equal(H.lives.length, 0, 'no socket for the lab\'s own seats'); assert.equal(H.floors.length, 1); assert.equal(H.floors[0].count, 5); assert.equal(H.floors[0].review, true); assert.equal(H.floors[0].capacity, 30);
  assert.equal(H.loads(), 1); assert.equal(typeof H.mounted().fetcher, 'function', 'an instance of its own, fed here');
  const r = await H.mounted().fetcher(), b = await r.json(); assert.ok(r.ok); assert.equal(b.count, 5); assert.deepEqual(b.hexagons.map((h) => h.n).sort((a, c) => a - c), [1, 2, 3, 4, 5]);
  for (const h of b.hexagons) { assert.match(h.signature, /^review-00[1-5]$/); assert.deepEqual(h.colours, reviewColours(h.n)); assert.equal(h.picture, undefined); }
  const P = house({ hostname: 'swarmbook.com', search: '?pour=5', answers: [{ drops: [] }] }); await settle();
  assert.equal(P.floors[0].count, 0, 'a public name never'); assert.equal(P.asked.length, 1);
});
test('this browser\'s own person is read off the mint page\'s store, and a browser with none is given none', async () => {
  const none = flaskStore(null); assert.equal(await ownOf(none), null); assert.equal(none.undone, 1, 'the open that would make the store is undone');
  const flask = flaskStore({ flask: {} }); assert.deepEqual(await ownOf(flask), { flask: true, paid: null, handle: null }); assert.equal(flask.closed, 1);
  assert.deepEqual(await ownOf(flaskStore({ flask: {}, paid: 'sigB', handle: 'photons_enjoyor' })), { flask: true, paid: 'sigB', handle: 'photons_enjoyor' });
  assert.deepEqual(await ownOf(flaskStore({ flask: {}, paid: 'sigB', handle: '../x' })), { flask: true, paid: 'sigB', handle: null }, 'a kept handle that is no handle is no page');
  assert.equal(await ownOf(flaskStore({ paid: 'sigB' })), null, 'no key made here: no one'); assert.equal(await ownOf(undefined), null, 'a browser with no store at all'); assert.equal(await ownOf({ open() { throw new Error('private'); } }), null);
});
test('the hero is the person\'s: the mint page for a newcomer, the flask\'s door, then their hexagon\'s number and their page', () => {
  assert.deepEqual(heroOf(null, null, null), { href: MINT, line: null }); assert.equal(MINT, './warm.html#mint');
  assert.deepEqual(heroOf({ flask: true, paid: null, handle: null }, null, null), { href: FLASK, line: null }, 'a flask made here and not yet filled: its door');
  assert.deepEqual(heroOf({ flask: true, paid: 's', handle: null }, null, null), { href: MAKING, line: null }, 'filled, the list not holding it yet: her making, the page\'s own line');
  assert.deepEqual(heroOf({ flask: true, paid: 's', handle: null }, { n: 7 }, MAKING), { href: MAKING, line: 'Your hexagon, number 7.' }, 'held, no page claimed: her making, where it is claimed');
  assert.deepEqual(heroOf({ flask: true, paid: 's', handle: 'bob' }, { n: 7 }, '/bob'), { href: '/bob', line: 'Your hexagon, number 7.' });
  assert.match(read('./dl-her-portrait.js'), /`Your hexagon, number \$\{S\.n\}`/, 'the mint sphere\'s own words'); assert.match(read('./dl-kit-deposit.js'), /get\('door'\) === 'deposit', MAKING = new URLSearchParams\(location\.search\)\.get\('then'\) === 'making'/, 'the mint page\'s own one step on to her making');
});
test('THE HEX IS A PAGE: a face leads to its holder\'s page once the door names a handle; the visitor\'s own is marked, and the hero is theirs', async () => {
  const drops = [{ drops: [{ n: 1, signature: 'sigA', tier: 'bronze' }, { n: 2, signature: 'sigB', tier: 'gold' }, { n: 3, signature: 'sigC', tier: 'bronze' }, { n: 4, signature: 'sigD', tier: 'bronze' }] }];
  const faces = { count: 4, hexagons: [{ n: 1, signature: 'sigA', handle: 'alice' }, { n: 2, signature: 'sigB' }, { n: 3, signature: 'sigC', handle: '../evil' }, { n: 4, signature: 'sigD', handle: 'a'.repeat(33) }] };
  const A = house({ answers: [...drops], faces, kept: null }); await settle(); let f = A.floors.at(-1), by = (sig) => f.held.find((h) => h.signature === sig);
  assert.equal(f.mine, null); assert.equal(A.store.undone, 1); assert.equal(f.pageOf(by('sigA')), '/alice', 'the address the Worker turns to the person\'s tracenet'); assert.equal(f.pageOf(by('sigB')), null, 'no page claimed: the face leads nowhere');
  assert.equal(f.pageOf(by('sigC')), null, 'a handle that is no handle is no address'); assert.equal(f.pageOf(by('sigD')), null); assert.equal(A.hero.href, MINT); assert.equal(A.line.textContent, 'It’s time to fuel your Swarmy.', 'a newcomer: the page\'s own words');
  assert.deepEqual(A.floor.state().own, null); assert.equal(A.floor.state().pages, 1);
  const B = house({ answers: [...drops], faces, kept: { flask: {}, paid: 'sigB' } }); await settle(); f = B.floors.at(-1);
  assert.equal(f.mine, by('sigB'), 'their hexagon is one of the floor\'s held'); assert.equal(f.mine.n, 2); assert.equal(f.pageOf(f.mine), MAKING, 'their own, no page yet: her making'); assert.equal(B.hero.href, MAKING); assert.equal(B.line.textContent, 'Your hexagon, number 2.');
  const C = house({ answers: [...drops], faces, kept: { flask: {}, paid: 'sigB', handle: 'bob' } }); await settle(); f = C.floors.at(-1); assert.equal(f.pageOf(f.mine), '/bob', 'the page this browser claimed'); assert.equal(C.hero.href, '/bob');
  const D = house({ answers: [...drops], faces: { count: 4, hexagons: [{ n: 2, signature: 'sigB', handle: 'bobby' }] }, kept: { flask: {}, paid: 'sigB', handle: 'bob' } }); await settle(); f = D.floors.at(-1); assert.equal(f.pageOf(f.mine), '/bobby', 'the door\'s word first'); assert.equal(D.hero.href, '/bobby');
  const E = house({ answers: [{ drops: [] }], kept: { flask: {} } }); await settle(); assert.equal(E.floors.at(-1).mine, null); assert.equal(E.hero.href, FLASK, 'a flask made, not filled'); assert.equal(E.line.textContent, 'It’s time to fuel your Swarmy.'); assert.equal(E.facesAsked(), 0);
  const F = house({ answers: [{ drops: [] }], kept: { flask: {}, paid: 'sigZ', handle: 'zed' } }); await settle(); assert.equal(F.floors.at(-1).mine, null, 'filled, but the list does not hold it'); assert.equal(F.hero.href, '/zed'); assert.equal(F.line.textContent, 'It’s time to fuel your Swarmy.');
  B.doc.hidden = false; const before = B.facesAsked(); B.listeners.visibilitychange(); await settle(); assert.equal(B.facesAsked(), before + 1, 'shown again: the pages claimed since are read');
});
test('his review of it: ?me=K is this browser\'s own, every fourth seat with no page yet, the pages opened where the house\'s own doors keep them', async () => {
  assert.equal(reviewOwn({ hostname: 'localhost', search: '?pour=12' }), null); assert.deepEqual(reviewOwn({ hostname: 'localhost', search: '?pour=12&me=0' }), { flask: true, paid: null, handle: null });
  assert.deepEqual(reviewOwn({ hostname: 'localhost', search: '?pour=12&me=5' }), { flask: true, paid: reviewSeats(5)[4].signature, handle: null });
  for (const [hostname, search] of [['swarmbook.com', '?pour=12&me=5'], ['localhost', '?me=5'], ['localhost', '?pour=12&me=13'], ['localhost', '?pour=12&me=-1'], ['localhost', '?pour=12&me=2.5'], ['localhost', '?pour=12&me=x']]) assert.equal(reviewOwn({ hostname, search }), null, `${hostname}${search}`);
  const H = house({ hostname: 'localhost', search: '?pour=12&me=5' }); await settle(); const f = H.floors.at(-1), by = (n) => f.held.find((h) => h.n === n);
  assert.equal(f.mine, by(5)); assert.equal(f.pageOf(by(5)), './tracenet.html?of=rider-5', 'no Worker on the house\'s own doors: the page itself'); assert.equal(f.pageOf(by(7)), './tracenet.html?of=rider-7'); assert.equal(f.pageOf(by(8)), null, 'every fourth has claimed no page');
  assert.equal(H.hero.href, './tracenet.html?of=rider-5'); assert.equal(H.line.textContent, 'Your hexagon, number 5.'); assert.equal(H.asked.length, 0); assert.equal(H.facesAsked(), 0, 'no door asked in his review');
  const N = house({ hostname: 'localhost', search: '?pour=12&me=8' }); await settle(); assert.equal(N.floors.at(-1).pageOf(N.floors.at(-1).mine), MAKING); assert.equal(N.hero.href, MAKING); assert.equal(N.line.textContent, 'Your hexagon, number 8.');
  const Z = house({ hostname: 'localhost', search: '?pour=12&me=0' }); await settle(); assert.equal(Z.floors.at(-1).mine, null); assert.equal(Z.hero.href, FLASK);
  const P = house({ hostname: 'swarmbook.com', search: '?pour=12&me=5', answers: [{ drops: [] }] }); await settle(); assert.equal(P.floors.at(-1).mine, null, 'a public name never'); assert.equal(P.hero.href, MINT);
});
test('the page: the floor read off the door is the chamber\'s, and the faces\' painter is mapped as the mint page maps it', () => {
  const w = read('./wall.js'), html = read('./index.html'), l = read('./dl-mint-ledger.js');
  assert.match(w, /mountFloor\(\{ onFloor: assembly\.setFloor, onFaces: assembly\.setFaces \}\);/); assert.match(w, /const assembly = createAssembly\(\$\('assembly'\), undefined, mountDive\(\$\('assembly'\)\)\);/, 'THE DIVING ONE COMES BACK (his Nov 26 2026 "The diving one", after "make the fucking anime go"): her ball the welcome\'s diving Lyssajudron'); assert.doesNotMatch(w + html, /after-the-mint-tree|saint-seiya|am-arrow|genesis-sphere/, 'no anime, no mint ball on the Societies page');
  { const a = read('./assembly.js'), css = read('./front.css'); assert.match(html, /<html lang="en" data-pour-own>/, 'her pour is the front\'s floor, never the mint page\'s own read'); assert.doesNotMatch(html, /poleis-mesh|#EAE3D3|<style>/, 'no parchment, no mesh, no sheet in the page');
    assert.match(a, /const skinAlive = \(\) => !motion\.matches && records\.length > 0 && progress > \.5;/, 'the worlds orbit her while the chamber shows her'); assert.doesNotMatch(css, /#EAE3D3|#F5F0E3/i); assert.match(css, /body \{ --stone: #0e1c2d;/, 'the page after the mint\'s night'); }
  assert.match(html, /<script type="importmap">\{"imports": \{"three": "\.\.\/\.\.\/room\/procedural\/three\.module\.js"\}\}<\/script>/); assert.ok(html.indexOf('importmap') < html.indexOf('type="module"'), 'before the first module');
  assert.match(l, /if \(!reach\.size\) \{ if \(!mint\.expand\(\)\) break; mark\(\); \}/, 'a full floor climbs a rung');
  // THE PLATES ON THE FRONT (his Nov 19 2026 "bring these vibes here please the blue and red thing..."): the title is Swarmbook's plate on its blue slash, Prompt-2-mine's on its red one at the hero's top right
  assert.match(html, /<a class="mint-big" href="\.\/warm\.html#mint"><h2 class="mint-big-title am-plate am-router" id="mint-title"><span class="am-slash" aria-hidden="true"><\/span><b class="am-name">Swarmbook<\/b><span class="am-stamp">Collective self improvement<\/span><\/h2><span class="mint-big-kicker">/, 'the hero\'s door and line stay heroOf\'s');
  assert.match(html, /<a class="hero-mine am-plate am-warm" href="\.\/after-the-mint\.html\?side=flask"><span class="am-slash" aria-hidden="true"><\/span><b class="am-name">Prompt-2-mine<\/b><span class="am-stamp">\$WARM<\/span><\/a>/);
  { const css = read('./swarmbook-front.css'); assert.match(html, /<link rel="stylesheet" href="\.\/swarmbook-front\.css\?v=plates-1">/); assert.match(css, /--am-router:linear-gradient\(90deg,transparent,rgba\(8,16,58,\.92\) 12%,rgba\(64,128,236,\.95\) 50%/, 'swarmbook.html\'s own blue'); assert.match(css, /--am-warm:linear-gradient\(90deg,transparent,rgba\(140,14,30,\.92\) 12%,rgba\(201,161,74,\.95\) 50%/, 'and its red into gold'); assert.match(css, /@media \(max-width:760px\)\{section\.hero\{/, 'stacked on a phone'); }
  const mint = read('./warm.html'), bar = read('./site-bar.css'); assert.match(mint, /<nav class="site-bar mint-site-bar" aria-label="Swarmbook"><a data-to="societies" href="\.\/index\.html">Societies<\/a><a data-to="stake"[^>]*>Stake<\/a><a data-to="ride"[^>]*>Ride<\/a><a data-to="tracenet"[^>]*>Tracenet<\/a><\/nav>/, 'THE FRONT DOOR WEARS THE BAR, its Pantheon in Stake (his Nov 26 2026 "pantheon should go into the stake tab")'); assert.match(bar, /\.mint-site-bar\{position:fixed;[^}]*opacity:0;visibility:hidden;pointer-events:none/, 'fixed, so the held page never scrolls; unseen through the film and her entrance'); assert.match(bar, /html\[data-egg-offered\]:not\(\[data-chose\]\):not\(\[data-hexagon\]\) \.mint-site-bar,html\[data-hexmint\] \.mint-site-bar,html:has\(\.dl-hexagon-plates\.on\) \.mint-site-bar\{opacity:1/, 'seen at her offer, on the deposit door, and on the plates');
});

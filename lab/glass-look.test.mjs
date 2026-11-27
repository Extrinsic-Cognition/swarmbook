// glass-look.test.mjs: THE GLASS IS TRANSPARENT, ALWAYS, AND ITS LOOK IS HIS (glass-look.mjs, theater.js, hero-mount.js, tools/mint-glass.mjs), without
// a browser. His words, Oct 17 2026 WEST: 20:4x "why the fuck is it like this at the beginning and is not like glass?" and "it must be a glass i. dont
// want to seethis it must be transparent"; 20:5x "what do i gotta do to be able to edit this manually?"; 21:1x "it is a massive failure if i cant edit
// in my canvas-mcp my dude". Pinned: with no word the glass is never drawn as a pass (normals or matte), not held and not playing; his word 'cuts' brings
// the flash back only while the film moves; the look is read once at the load on his doors only, never under automation, and his press writes it.
// node --test embertide-app/ui/intro/dyson-society/lab/glass-look.test.mjs
import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import http from 'node:http';
import {fileURLToPath} from 'node:url';
import {GLASS_REF, CLEAR, lookOf, lookOfAddress, passAt, readLook} from './glass-look.mjs';
import {press, valueOf} from '../tools/mint-glass.mjs';

const src = (p) => fs.readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8');
const ages = Array.from({length: 61}, (_, i) => -0.1 + i * 0.01);   // a burst's first half second, by hundredths

test('no word: the glass is the glass at every age, held or playing (what he saw at the debug start was age 0.005, held)', () => {
  for (const look of [CLEAR, lookOf(null), lookOf({}), lookOf({pass: 'normals'}), lookOf({pass: 1}), lookOfAddress('?glass=maybe')])
    for (const age of ages) for (const moving of [false, true]) assert.equal(passAt(age, {look, moving}), 0, `${JSON.stringify(look)} ${age} ${moving}`);
  assert.equal(passAt(0.005, {moving: false}), 0, 'the debug start\'s still');
  assert.equal(passAt(0.005), 0);
});

test('his word cuts: the normals for a tenth, the matte for the next, only while the film moves; a held film shows the glass', () => {
  const cuts = lookOf({pass: 'cuts', by: 'him'});
  assert.deepEqual(cuts, {pass: 'cuts', from: 'nest'});
  assert.equal(passAt(0.005, {look: cuts, moving: true}), 1);
  assert.equal(passAt(0.099, {look: cuts, moving: true}), 1);
  assert.equal(passAt(0.1, {look: cuts, moving: true}), 2);
  assert.equal(passAt(0.199, {look: cuts, moving: true}), 2);
  assert.equal(passAt(0.2, {look: cuts, moving: true}), 0);
  assert.equal(passAt(-1, {look: cuts, moving: true}), 0, 'no burst');
  assert.equal(passAt(NaN, {look: cuts, moving: true}), 0);
  for (const age of ages) assert.equal(passAt(age, {look: cuts, moving: false}), 0, `held at ${age}`);
  assert.deepEqual(lookOf({pass: ' CUTS '}), {pass: 'cuts', from: 'nest'});
  assert.deepEqual(lookOf({pass: 'none'}), {pass: 'none', from: 'nest'});
});

test('the address: ?glass=none|cuts is a proof\'s word; no ?glass leaves it to the Nest', () => {
  assert.equal(lookOfAddress(''), undefined);
  assert.equal(lookOfAddress('?debug'), undefined);
  assert.deepEqual(lookOfAddress('?glass=cuts&debug'), {pass: 'cuts', from: 'address'});
  assert.deepEqual(lookOfAddress('glass=none'), {pass: 'none', from: 'address'});
  assert.equal(lookOfAddress('?glass=').pass, 'none');
});

test('the read: once, on his house\'s doors only, never under automation, never thrown; a public host and a dead Nest are the clear glass', async () => {
  const asked = [];
  const nest = (value, status = 200) => async (url, init) => { asked.push(url); assert.equal(init.cache, 'no-store'); return {ok: status === 200, status, json: async () => ({name: GLASS_REF, ref: value === undefined ? null : {value, rev: 3}})}; };
  assert.deepEqual(await readLook({hostname: '127.0.0.1', fetch: nest({pass: 'cuts'})}), {pass: 'cuts', from: 'nest'});
  assert.deepEqual(asked, ['http://127.0.0.1:8904/nest/ref/mint/glass']);
  assert.deepEqual(await readLook({hostname: '192.168.8.164', protocol: 'http:', fetch: nest({pass: 'none'})}), {pass: 'none', from: 'nest'});
  assert.equal(await readLook({hostname: 'guidos-mac.local', fetch: nest(undefined)}), CLEAR, 'no word');
  assert.equal(await readLook({hostname: '127.0.0.1', fetch: nest({pass: 'cuts'}, 503)}), CLEAR, 'the Nest refused');
  assert.equal(await readLook({hostname: '127.0.0.1', fetch: async () => { throw new Error('down'); }}), CLEAR, 'the Nest is down');
  asked.length = 0;
  assert.equal(await readLook({hostname: 'optimism.fit', fetch: nest({pass: 'cuts'})}), CLEAR, 'a public host asks nothing');
  assert.equal(await readLook({hostname: '127.0.0.1', webdriver: true, fetch: nest({pass: 'cuts'})}), CLEAR, 'a proof never takes his word');
  assert.deepEqual(asked, []);
  assert.deepEqual(await readLook({search: '?glass=cuts', hostname: 'optimism.fit', fetch: nest({pass: 'none'})}), {pass: 'cuts', from: 'address'});
  assert.deepEqual(await readLook({hostname: '127.0.0.1', nest: 'http://127.0.0.1:31904/', fetch: nest({pass: 'cuts'})}), {pass: 'cuts', from: 'nest'});
  assert.equal(asked.at(-1), 'http://127.0.0.1:31904/nest/ref/mint/glass');
});

test('his press (tools/mint-glass.mjs, the hands "Mint glass: ..."): status reads, a word is written once by compare-and-set, the same word writes nothing', async (t) => {
  let ref = null, writes = 0;
  const server = http.createServer(async (req, res) => {
    const body = await new Promise((r) => { let s = ''; req.on('data', (c) => { s += c; }); req.on('end', () => r(s)); });
    res.setHeader('content-type', 'application/json');
    if (req.url !== '/nest/ref/mint/glass') { res.statusCode = 404; return res.end('{}'); }
    if (req.method === 'GET') return res.end(JSON.stringify({name: 'mint/glass', ref}));
    const b = JSON.parse(body);
    if ((ref ? ref.rev : 0) !== b.expect) { res.statusCode = 409; return res.end('{}'); }
    writes++; ref = {value: b.value, rev: (ref ? ref.rev : 0) + 1, seat: b.seat};
    return res.end(JSON.stringify({ok: true, ref}));
  });
  await new Promise((r) => server.listen(0, '127.0.0.1', r));
  t.after(() => server.close());
  const nest = `http://127.0.0.1:${server.address().port}`, at = () => 1792230000000;
  assert.equal(await press('status', {nest}), 'no word on the Nest: the glass is transparent always');
  assert.match(await press('cuts', {nest, now: at}), /CUTS flash at each burst while the film plays from its next load \(mint\/glass rev 1\)/);
  assert.deepEqual(ref.value, {pass: 'cuts', by: 'his press on the Canvas (house-hands, mint-glass.mjs)', at: 1792230000000});
  assert.equal(ref.seat, 'house-hands-oldmac');
  assert.match(await press('cuts', {nest}), /^already cuts .* nothing written$/);
  assert.match(await press('none', {nest, now: at}), /transparent always from its next load \(mint\/glass rev 2\)/);
  assert.match(await press('status', {nest}), /^mint\/glass says none \(transparent always\), rev 2$/);
  assert.equal(writes, 2);
  assert.equal(lookOf(ref.value).pass, 'none', 'what the page reads');
  assert.throws(() => valueOf('normals'), /a word of none, cuts or status/);
});

test('the theater: the pass is passAt\'s alone, fed the look and whether the film moves; a flash on the glass is light over the film', () => {
  const th = src('./theater.js');
  assert.match(th, /import \{CLEAR, passAt\} from '\.\/glass-look\.mjs';/);
  assert.equal([...th.matchAll(/gl\.uniform1f\(U\.uPass,/g)].length, 1, 'one write of the pass');
  assert.match(th, /const pass = live && way\?\.glass !== false \? passAt\(age, \{look, moving: !film\.paused\}\) : 0;\s*gl\.uniform1f\(U\.uPass, pass\);/);
  assert.doesNotMatch(th, /age < 0\.1 \? 1 : age < 0\.2 \? 2/, 'no pass judged by the film\'s second alone');
  assert.match(th, /createTheater\(\{[^)]*look = CLEAR\}/, 'with no look the glass is clear');
  assert.match(th, /setLook\(next\) \{ look = next && typeof next === 'object' \? next : CLEAR; ask\(\); \}/);
  // the glass's faces, the light between its plates and THE TWELVE's panes flash as light over the film, never mixed toward a colour of their own
  assert.match(th, /vec3 shine\(vec3 seen, float k\) \{ return seen \* \(1\.0 \+ 1\.3 \* k\) \+ vec3\(1\.0, 0\.95, 0\.84\) \* 0\.28 \* k; \}/);
  assert.match(th, /vec3 face = shine\(mix\(asSphere, asGlass, uLook\), clamp\(uFlash \* 0\.7 \+ uBloom \* 0\.65, 0\.0, 1\.0\)\);/);
  assert.match(th, /pane = shine\(pane, clamp\(F2\.w \* 0\.7, 0\.0, 1\.0\)\);/);
  assert.match(th, /vec3 inner = shine\(film\(pf\) \* 1\.35 \+ 0\.08,/);
  assert.doesNotMatch(th, /mix\([^;]*vec3\(1\.0, 0\.9[56], 0\.8[06]\), clamp\(/, 'no face mixed toward cream');
  // the opaque pass lines stand only behind uPass, which passAt alone sets
  assert.equal([...th.matchAll(/n \* 0\.5 \+ 0\.5/g)].length, 1);
  assert.match(th, /if \(uPass > 0\.5\) face = uPass > 1\.5 \? vec3\(0\.83, 0\.64, 0\.29\) : n \* 0\.5 \+ 0\.5;/);
});

test('the page reads the look once at its load and hands it to the theater, also when the read lands while the theater is being made', () => {
  const hm = src('./hero-mount.js');
  assert.equal([...hm.matchAll(/readLook\(\{/g)].length, 1, 'one read');
  assert.match(hm, /q\.has\('glass'\) \? `glass=\$\{q\.get\('glass'\)\}` : win\.location\.search/);
  assert.match(hm, /webdriver: Boolean\(win\.navigator\?\.webdriver\)/);
  assert.match(hm, /\.then\(\(look\) => \{ glassLook = look; theater\?\.setLook\(look\); \}\);/);
  assert.match(hm, /createTheater\(\{[^}]*look: glassLook,/);
  assert.match(hm, /if \(theater\.look !== glassLook\) theater\.setLook\(glassLook\);/);
  // no timer and no follow: the read is a promise once, nothing else names the ref
  assert.doesNotMatch(src('./glass-look.mjs'), /setInterval|setTimeout|EventSource|\/nest\/stream/);
});

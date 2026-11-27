// dl-harmony-doors.test.mjs: THE DOORS TO HARMONY (his Oct 22 2026 14:0x to 14:3x WEST: two large doors under the hero, the download "with a live link
// that has a cookie in the installer", and "track state on whether athena appeared or not before they clicked the download button").
// node --test dl-harmony-doors.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {LOCAL_MANIFEST, ATHENA_STATES, GATE_EVENT, POLL_MS, POLL_FOR_MS, desktopOf, localRoad, localLinks, downloadURL, mountDoors, rideTo} from './dl-harmony-doors.mjs';
import {gated} from './dl-athena.js';
import {installLinks} from './dl-seat-card.mjs';
import {blank, put, keep} from './dl-her-colours.mjs';

const here = (p) => new URL(p, import.meta.url);

test('the door under the hero: two large doors, the download and the code, the download not open until a release names it', () => {
  const page = readFileSync(here('./warm.html'), 'utf8'), entry = readFileSync(here('./warm-entry.mjs'), 'utf8');
  const hero = page.indexOf('id="oath-sphere"'), doors = page.indexOf('id="harmony-doors"'), rite = page.indexOf('id="rite"');
  assert.ok(hero > 0 && hero < doors && doors < rite, 'right under the hero, before the swarm');
  assert.match(page, /<a class="dl-harmony-door dl-harmony-door-main" data-harmony-download href="#harmony-doors" aria-disabled="true">/);
  assert.match(page, /data-harmony-github href="https:\/\/github\.com\/Extrinsic-Cognition\/monorepo" target="_blank" rel="noopener"/);
  assert.match(page, /<link rel="stylesheet" href="\.\/dl-harmony-doors\.css\?v=doors-1">/);
  for (const m of ['dl-visit.mjs?v=visit-1', 'dl-harmony-doors.mjs?v=doors-2']) assert.ok(entry.includes(`import('./${m}')`), m);
  assert.match(readFileSync(here('./dl-harmony-doors.mjs'), 'utf8'), /\nimport '\.\/dl-visit\.mjs\?v=visit-1';/, 'the door and the entry load one visit (mounted once)');
  const release = JSON.parse(readFileSync(here('./nestos-release.json'), 'utf8')); assert.deepEqual([installLinks({...release, status: 'unpublished'}), installLinks({...release, status: 'published'})], [[], [{platform: 'macos', label: 'macOS', href: 'https://swarmbook.com/app/DysonLight-Harmony.dmg'}]], 'closed until a release is published; his "Publish it" (Nov 24 2026) opens it on the notarized image');
});

test('the press stamps the installer\'s address with the visit and what Athena had done; this desktop\'s installer only', () => {
  const href = downloadURL('https://example.org/Harmony-1.0.zip', 'SADBQ09E4999WPC9RKZ38PS40M', 'skipped');
  assert.equal(href, 'https://example.org/Harmony-1.0.zip?s=SADBQ09E4999WPC9RKZ38PS40M&a=skipped');
  assert.equal(downloadURL('https://example.org/H.zip?x=1', null, 'bogus', null), 'https://example.org/H.zip?x=1', 'nothing stamped that is not ours');
  assert.deepEqual([...new URL(downloadURL('https://example.org/H.zip', 'SADBQ09E4999WPC9RKZ38PS40M', 'whole', put(blank(), 'coat', '#123456'))).searchParams], [['s', 'SADBQ09E4999WPC9RKZ38PS40M'], ['a', 'whole'], ['h', '1.-.F3F3F0.123456.B9B9B4.9E9E99.D3D3CE.2.-']], 'her colours alone');
  assert.deepEqual([null, 'st0f', 'ST0F', 'swarmy-3', 'a'.repeat(33), ''].map((n) => new URL(downloadURL('https://example.org/H.zip', null, 'bogus', put(blank(), 'coat', '#123456'), n)).searchParams.get('n')), [null, 'st0f', null, null, null, null], 'her name, by its one pattern'); assert.equal(downloadURL('https://example.org/H.zip', null, 'bogus', null, 'st0f'), 'https://example.org/H.zip', 'never a name without her');
  assert.deepEqual(ATHENA_STATES, ['none', 'coming', 'entered', 'skipped', 'whole', 'still']);
  assert.equal(desktopOf({platform: 'MacIntel', userAgent: 'Macintosh', maxTouchPoints: 0}), 'macos');
  assert.equal(desktopOf({platform: 'MacIntel', userAgent: 'Macintosh', maxTouchPoints: 5}), null, 'an iPad says Mac');
  assert.equal(desktopOf({userAgentData: {platform: 'Windows', mobile: false}}), 'windows');
  assert.equal(desktopOf({platform: 'Linux armv8l', userAgent: 'Android 15'}), null, 'Android says Linux');
  assert.equal(desktopOf({platform: 'iPhone', userAgent: 'iPhone'}), null);
});

test('the local road: only on this machine\'s loopback, only with ?harmony=local, and plain http only from the loopback', () => {
  assert.equal(localRoad({hostname: 'mint-lane.localhost', search: '?debug=off&harmony=local'}), true);
  assert.equal(localRoad({hostname: '127.0.0.1', search: '?harmony=local'}), true);
  assert.equal(localRoad({hostname: 'optimism.fit', search: '?harmony=local'}), false, 'never on the site');
  assert.equal(localRoad({hostname: '192.168.1.20', search: '?harmony=local'}), false, 'not even the LAN');
  assert.equal(localRoad({hostname: 'localhost', search: ''}), false);
  const local = JSON.parse(readFileSync(here(LOCAL_MANIFEST), 'utf8'));
  assert.deepEqual(localLinks(local).map((l) => [l.platform, new URL(l.href).hostname]), [['macos', '127.0.0.1']]);
  assert.deepEqual(installLinks(local), [], 'the release reader keeps refusing plain http');
  assert.deepEqual(localLinks({...local, platforms: {macos: 'http://evil.example/x.zip'}}), [], 'plain http from anywhere else is refused');
  assert.deepEqual(localLinks({...local, status: 'unpublished'}), []);
  for (const file of ['../tools/page-files.mjs', '../tools/build-optimism-fit.mjs']) assert.doesNotMatch(readFileSync(here(file), 'utf8'), /nestos-release\.local/, 'never shipped');
});

test('the gate: armed by a published installer it holds a seat until this visit\'s Harmony says she is saved; asked after a press; the checkout and Athena follow it', async () => {
  const told = [], listeners = {}, note = {textContent: ''}, called = [];
  const door = {href: '#harmony-doors', attrs: {'aria-disabled': 'true'}, removeAttribute(k) { delete this.attrs[k]; }, querySelector: () => note, addEventListener: (t, f) => { listeners[t] = f; },
    classList: {add: (c) => called.push(c), remove: () => {}}, offsetWidth: 0};
  const doors = {scrollIntoView: (o) => told.push(`into view ${o.block}`)};
  const doc = {hidden: false, querySelector: (sel) => (sel === '[data-harmony-download]' ? door : sel === '#harmony-doors' ? doors : null), addEventListener: () => {}, dispatchEvent: (e) => told.push(`${e.type} ${JSON.stringify(e.detail)}`)};
  let saved = false; const asked = [], intervals = [];
  const local = readFileSync(here(LOCAL_MANIFEST), 'utf8');
  const fetcher = async (url) => {
    const u = String(url); asked.push(u.includes('/api/premint/install') ? 'install' : u.split('/').pop());
    if (u.endsWith('nestos-release.local.json')) return new Response(local);
    if (u.startsWith('/api/premint/install?visit=SADBQ09E4999WPC9RKZ38PS40M')) return Response.json({install: {installed: true, saved}});
    return new Response('{}', {status: 404});
  };
  const win = {location: {hostname: 'mint-dev.localhost', search: '?debug=off&harmony=local'}, navigator: {platform: 'MacIntel', userAgent: 'Macintosh', maxTouchPoints: 0},
    dlVisit: {state: () => ({id: 'SADBQ09E4999WPC9RKZ38PS40M'}), download: () => ({id: 'SADBQ09E4999WPC9RKZ38PS40M', athena: 'whole'})},
    setInterval: (f, ms) => { intervals.push([f, ms]); return intervals.length; }, clearInterval: () => {}, matchMedia: () => ({matches: false}),
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } }};
  const kept = new Map(), storage = {getItem: (k) => kept.get(k) ?? null, setItem: (k, v) => kept.set(k, v)}; keep(storage, put(blank(), 'coat', '#123456'));   // her making, kept at her last stroke
  const api = await mountDoors({win, doc, fetcher, storage});
  await new Promise((r) => setTimeout(r, 0));
  assert.deepEqual({...api.state().gate, asked: 1}, {armed: true, installed: true, saved: false, asked: 1}, 'armed by the local release; asked once at the load');
  assert.deepEqual(asked, ['nestos-release.local.json', 'install']);
  assert.equal(door.href, 'http://127.0.0.1:9060/dev/DysonLight-Harmony.zip'); assert.equal(door.attrs['aria-disabled'], undefined); const ride = {attrs: {'aria-disabled': 'true'}, removeAttribute(k) { delete this.attrs[k]; }, addEventListener: (t, f) => { ride.on = f; }}, gateBefore = JSON.stringify(api.state().gate); assert.equal(await rideTo(ride, {win, fetcher, storage}), door.href, 'THE RIDE: the installer this desktop is given'); ride.on(); assert.match(ride.href, /\?s=SADBQ09E4999WPC9RKZ38PS40M&a=whole&h=1\./, 'its press stamped as a door\'s'); assert.deepEqual([ride.attrs['aria-disabled'], JSON.stringify(api.state().gate), await rideTo(ride, {win: {...win, navigator: {platform: 'Linux x86_64', userAgent: 'X11'}}, fetcher})], [undefined, gateBefore, null], 'no gate armed by it; no installer for this desktop, no address');
  listeners.click();
  assert.equal(door.href, 'http://127.0.0.1:9060/dev/DysonLight-Harmony.zip?s=SADBQ09E4999WPC9RKZ38PS40M&a=whole&h=1.-.F3F3F0.123456.B9B9B4.9E9E99.D3D3CE.2.-');
  assert.equal(intervals.length, 1); assert.equal(intervals[0][1], POLL_MS); assert.equal(POLL_FOR_MS, 30 * 60e3);
  saved = true; intervals[0][0](); await new Promise((r) => setTimeout(r, 0));
  assert.equal(api.state().gate.saved, true); assert.ok(told.some((t) => t.startsWith(`${GATE_EVENT} `) && t.includes('"saved":true')), 'the page told');
  const went = [], bare = door.href, tap = async (name, e = {}) => { let held = 0; win.DL_HER_NAME = name; await listeners.click({preventDefault: () => { held++; }, ...e}); return [held, went.splice(0).map((u) => u.slice(bare.length)), door.href.slice(bare.length)]; }; win.location.assign = (u) => went.push(u);
  assert.deepEqual(await tap(async () => 'st0123456789ab'), [1, ['&n=st0123456789ab'], '&n=st0123456789ab'], 'held for her name, then the press goes on with it'); assert.equal(api.state().last.href, `${bare}&n=st0123456789ab`);
  for (const name of [() => { throw new Error('no flask'); }, async () => { throw new Error('no flask'); }, async () => 'SWARMY-3', () => new Promise(() => {})]) assert.deepEqual(await tap(name), [1, [''], ''], 'thrown, refused, odd or slow: the press goes on without it');
  assert.deepEqual(await tap(undefined), [0, [], ''], 'no lane to ask: the browser takes the address itself'); assert.deepEqual(await tap(async () => 'st0f', {metaKey: true}), [0, [], ''], 'a new tab is the browser\'s'); kept.clear(); assert.equal((await tap(async () => 'st0f'))[0], 0, 'no making kept: nothing asked');
  api.lead();
  assert.deepEqual([told.at(-1), note.textContent, called.at(-1)], ['into view center', 'Meet the Lyssajudron in DysonLight Harmony first', 'dl-harmony-door-called']);
  // the checkout and Athena follow it
  const direct = readFileSync(here('./dl-direct.js'), 'utf8'), her = readFileSync(here('./dl-athena.js'), 'utf8') + readFileSync(here('./dl-athena.mjs'), 'utf8');   // the page half and the law (her story moved to dl-athena.mjs on Oct 22 2026: one layer, shared with the Harmony window)
  assert.match(direct, /const gate = window\.dlDoors\?\.state\?\.\(\)\.gate;\n  if \(gate\?\.armed && !gate\.saved\) \{ window\.dlDoors\.lead\(\); return; \}/, 'a seat pressed while the gate holds leads to Harmony');
  assert.match(direct, /referral: keptReferral\(localStorage\)\?\.code \?\? '', visit: window\.dlVisit\?\.state\?\.\(\)\.id \}\);/, 'the order carries the visit for the Worker\'s gate');
  assert.match(her, /doors: \[\{\.\.\.\(gated\(doc\) \? HARMONY : SEATS\), main: true\}\]/);   // her doors follow the gate; her line at the stop is one since Oct 22 2026 (Nefertiti's last line, his approved copy: "Take your seat." until Oct 27 2026, "Take it home." since, handing the egg), gated no more;
  // since Oct 30 2026 her story's last line is the egg she lets fall into her making (lane/the-egg-falls-into-the-creator, his 06:28:18 UTC); before it
  // "I’ll explain later." (lane/theres-no-time), "Hora." (lane/her-few-words) and "Listen. It's asking for its colours." (lane/her-egg-first-and-the-skip-asks)
  assert.match(her, /say: 'Take this egg\.', turn: \{at: 'egg', drop: true\}/);
  const view = (gate) => ({defaultView: {dlDoors: {state: () => ({gate})}}});
  assert.equal(gated(view({armed: true, saved: false})), true); assert.equal(gated(view({armed: true, saved: true})), false); assert.equal(gated(view({armed: false, saved: false})), false); assert.equal(gated({}), false);
  for (const m of ['warm-entry.mjs']) assert.match(readFileSync(here(`./${m}`), 'utf8'), /import\('\.\/dl-direct\.js\?v=society-2'\)/, `${m}: the checkout's new cut`);
});

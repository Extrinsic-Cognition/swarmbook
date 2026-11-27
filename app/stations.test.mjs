// stations.test.mjs: THE ENCOUNTER on the world (his Oct 22 2026 13:5x WEST, over STATION 0 · the room: "can you replace station0 there with
// "Encountering the Lyssajudron" or whatever the fuck the dmc4 tagline we used on harmony app is... people gotta click that and they will be
// directed to the harmony app"). node --test stations.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';

const here = (p) => new URL(p, import.meta.url);
const {stations} = JSON.parse(readFileSync(here('./stations.json'), 'utf8'));

test('station 0 is the Lyssajudron\'s first encounter, in her boss card\'s words, and its door is Harmony\'s own page for her', () => {
  const card = readFileSync(here('../../room/boss-intro.mjs'), 'utf8').match(/name: '([^']+)', epithet: '([^']+)'/);
  assert.ok(card, 'boss-intro.mjs names her card');
  const [, name, epithet] = card, st = stations.find((s) => s.id === 'embertide-0');
  assert.equal(st.title, name); assert.equal(st.kicker, epithet.toUpperCase(), 'the epithet over the name, as the card slams them');
  assert.equal(st.name, `${name}, ${epithet}`, 'the HUD\'s line');
  assert.equal(st.harmony, '/intro/?beginning=1&step=her', 'harmony-first-door.mjs DOORS.her (tools/embertide-mesh/lib, outside this checkout)');
  assert.match(st.call, /^Encounter the Lyssajudron/);
});

test('the page is public: no station sends a visitor to a loopback or private address, and the label and its point both open Harmony', () => {
  for (const st of stations) for (const {url} of st.enter || []) {
    const u = new URL(url);
    assert.equal(u.protocol, 'https:', url); assert.doesNotMatch(u.hostname, /^(localhost|127\.|10\.|192\.168\.|\[::1\])|\.local(host)?$/, url);
  }
  const src = readFileSync(here('./warm-spatial.js'), 'utf8');
  assert.match(src, /el\.addEventListener\('click',\(\)=>pick\(st\)\)/, 'the label');
  assert.match(src, /else if\(n\)pick\(n\);\}\);/, 'its point on the world');
  assert.match(src, /import\('\.\/dl-seat-card\.mjs\?v=society-1'\)/, 'the installer\'s doors as the seat card reads them, one module with the checkout\'s');
});

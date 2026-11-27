// tracenet-trail.test.mjs: Swarmbook Tracenet — global feed of Claw Riders & Snowtracers.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { firstTrace, wordsOf, metaOf, stampOf, hexagonOf, hexagonFor, categorize, filterFeed, PORTRAIT_LIST, FACES } from './tracenet-trail.mjs';
import { DAY_MS, OPEN_DAYS, BRONZE_DAYS } from './tracenet-register.mjs';

const here = (f) => join(dirname(fileURLToPath(import.meta.url)), f);
const read = (f) => readFileSync(here(f), 'utf8');
const T = Date.parse('2026-03-02T10:00:00Z');
const drop = (over = {}) => ({ id: '2026-03-02-an-invented-trace', title: 'An invented trace', kind: 'trace', file: 'an-invented-trace.md', bytes: 2560, sha256: 'ab'.repeat(32), published: new Date(T).toISOString(), proof: 'nest', ...over });

test('Tracenet wears the global hero (flask left, crystal guardian right, punchy copy), one nav bar, zero Pandora box, and its WebP assets exist', () => {
  const page = read('tracenet.html'), src = read('tracenet-trail.mjs');
  for (const sheet of ['../../harmony-accent.css', '../../fonts/fonts.css', '../../brand/dl-wordmark.css']) assert.equal(page.split(`href="${sheet}"`).length - 1, 1, `${sheet} once`);
  assert.match(page, /Expose your craft\.<br>Let AGIs buy your mind\./);
  assert.match(page, /assets\/tracenet-flask\.webp/);
  assert.match(page, /assets\/tracenet-crystal\.webp/);
  assert.doesNotMatch(page + src, /laptop-glass|mountLaptopGlass|Open the box|tt-scene/, 'Pandora box stays gone');
  assert.equal((page.match(/data-mint-holder/g) || []).length, 1);
  for (const img of ['assets/tracenet-flask.webp', 'assets/tracenet-crystal.webp', 'assets/tracenet-flask-mini.webp']) assert.ok(existsSync(here(img)), img);
});

test('global feed categorizes and filters by tab, search query, handle, and $WARM rank', () => {
  const a = { handle: 'alice', warm: 120, category: categorize(drop({ title: '$WARM flask protocol' })), item: drop({ id: 'a', title: '$WARM flask protocol', bytes: 1000 }) };
  const b = { handle: 'bob', warm: 500, category: categorize(drop({ title: 'WebGL chamber architecture' })), item: drop({ id: 'b', title: 'WebGL chamber architecture', bytes: 3000 }) };
  assert.deepEqual([a.category, b.category], ['protocol', 'build']);
  assert.deepEqual(filterFeed([a, b], { tab: 'protocol' }).map((e) => e.handle), ['alice']);
  assert.deepEqual(filterFeed([a, b], { tab: 'build' }).map((e) => e.handle), ['bob']);
  assert.deepEqual(filterFeed([a, b], { tab: 'warm' }).map((e) => e.handle), ['bob', 'alice']);
  assert.deepEqual(filterFeed([a, b], { q: 'webgl' }).map((e) => e.handle), ['bob']);
  assert.deepEqual(filterFeed([a, b], { handle: 'alice' }).map((e) => e.handle), ['alice']);
});

test('first trace, tiered drop law, meta and stamp keep the register law intact', () => {
  const a = drop({ id: 'a', published: new Date(T + DAY_MS).toISOString() }), b = drop({ id: 'b' });
  assert.equal(firstTrace([a, b]).id, 'b');
  assert.equal(firstTrace([]), null);
  assert.equal(wordsOf(b, T + DAY_MS, null).act, null);
  assert.equal(wordsOf(b, T + DAY_MS, 'gold').act, 'take');
  assert.equal(wordsOf(b, T + DAY_MS, 'bronze').state, 'waiting');
  assert.equal(wordsOf(b, T + (BRONZE_DAYS + 1) * DAY_MS, 'bronze').state, 'open');
  assert.equal(wordsOf(b, T + (OPEN_DAYS + 1) * DAY_MS, null).act, 'read');
  assert.match(metaOf(b), /^trace · 2\.5 KB · March [12]$/);
  assert.equal(stampOf(b), `Proven by the Nest’s receipt · sha256 ${'ab'.repeat(6)}…`);
  assert.match(stampOf(drop({ proof: 'signed', linked: true })), /^Signed by creator, chained · sha256 /);
});

test('hexagon portrait lookup and build assets stay wired', async () => {
  const sig = '5'.repeat(88), row = { n: 2, signature: sig, colours: { light: '#7FE0FF', base: '#2E6BE6', coat: '#1B3F8F', gold: '#E2B341', eyes: '#F05A28', thruster: '#F05A28' }, handle: 'someone' };
  const list = { count: 2, hexagons: [{ n: 1, signature: '4'.repeat(88), colours: {} }, row] };
  assert.deepEqual(hexagonOf(list, 'someone'), row);
  assert.equal(hexagonOf(list, 'nobody'), null);
  assert.deepEqual(await hexagonFor(async (u) => ({ ok: u === PORTRAIT_LIST, json: async () => list }), 'someone'), row);
  assert.equal(await hexagonFor(async () => ({ ok: false }), 'someone'), null);
  assert.deepEqual([...FACES], ['dark', 'light']);
});

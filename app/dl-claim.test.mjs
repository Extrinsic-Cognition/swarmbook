// dl-claim.test.mjs: the claim page on stand-ins. node --test app/dl-claim.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {claimOfHash, mountClaimPage} from './dl-claim.mjs';

const html = readFileSync(new URL('./claim.html', import.meta.url), 'utf8');
function page(hash) {
  const byId = Object.fromEntries(['claim-code', 'claim-copy', 'claim-status', 'claim-install', 'claim-none'].map((id) => [id, Object.assign(new EventTarget(), {id, hidden: false, textContent: '', children: [], replaceChildren(...n) { this.children = n; }})]));
  const doc = {getElementById: (id) => byId[id] ?? null, createElement: (tag) => ({tag, textContent: '', href: '', rel: ''})};
  return {byId, doc, win: {location: {hash}}};
}
const manifest = (body, ok = true) => async () => ({ok, json: async () => body});

test('the fragment\'s code is read as a hand types it; none is said', async () => {
  assert.equal(claimOfHash('#7K3M9PQ2X4T6'), '7K3M9PQ2X4T6'); assert.equal(claimOfHash('#7k3m-9pq2-x4t6'), '7K3M9PQ2X4T6');
  for (const bad of ['', '#', '#7K3M9PQ2', '#nope', null, '#?ref=7K3M9PQ2X4T6']) assert.equal(claimOfHash(bad), null, String(bad));
  const p = page('#7k3m-9pq2-x4t6'), copied = [];
  const r = await mountClaimPage({...p, fetcher: manifest({schema: 'nestos.release.v1', status: 'unpublished', platforms: {}}), clipboard: {async writeText(v) { copied.push(v); }}});
  assert.equal(r.code, '7K3M9PQ2X4T6'); assert.deepEqual(r.links, []);
  assert.equal(p.byId['claim-code'].textContent, '7K3M-9PQ2-X4T6'); assert.equal(p.byId['claim-copy'].hidden, false); assert.equal(p.byId['claim-none'].hidden, true);
  assert.equal(p.byId['claim-install'].children[0].textContent, 'Harmony’s installer isn’t published yet. Keep your code: it stays yours.');
  p.byId['claim-copy'].dispatchEvent(new Event('click')); await new Promise((f) => setImmediate(f));
  assert.deepEqual(copied, ['7K3M9PQ2X4T6']); assert.equal(p.byId['claim-status'].textContent, 'Code copied.');
  const none = page('');
  const n = await mountClaimPage({...none, fetcher: async () => { throw new Error('offline'); }});
  assert.equal(n.code, null); assert.equal(none.byId['claim-code'].textContent, '—'); assert.equal(none.byId['claim-copy'].hidden, true); assert.equal(none.byId['claim-none'].hidden, false);
  const pub = page('#7K3M9PQ2X4T6');
  const l = await mountClaimPage({...pub, fetcher: manifest({schema: 'nestos.release.v1', status: 'published', platforms: {macos: 'https://dl.example/h.dmg'}})});
  assert.deepEqual(pub.byId['claim-install'].children.map((a) => [a.textContent, a.href]), [['macOS', 'https://dl.example/h.dmg']]); assert.equal(l.links.length, 1);
});

test('the page carries one module, no analytics, no media, and asks robots to pass', () => {
  assert.deepEqual([...html.matchAll(/<script\b([^>]*)>/g)].map((m) => m[1]), [' type="module" src="./dl-claim.mjs?v=society-1"']);
  assert.match(html, /<meta name="robots" content="noindex">/);
  assert.doesNotMatch(html, /<(?:img|video|audio|iframe)\b/);
  for (const id of ['claim-code', 'claim-copy', 'claim-status', 'claim-install', 'claim-none']) assert.match(html, new RegExp(`id="${id}"`), id);
});

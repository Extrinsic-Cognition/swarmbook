import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {entryMode, introductionURL, startEntry} from './warm-entry.mjs';
import {walletBrowseLinks, herAddressOf, mintHash} from './dl-direct-wallets.js';
import {REFERRAL_KEY, keptReferral} from './dl-society-codes.mjs'; import { Storage } from '../worker/stand-ins.mjs';

const html = readFileSync(new URL('./warm.html', import.meta.url), 'utf8');
const head = /<script>([\s\S]*?)<\/script>/.exec(html)[1];
const wallet = '7YhHMNcb7aZyHhBPYhtc87nY89SYnCfJHSYr6FWnQGaE';

test('only one explicit Harmony marker selects mint entry; head and module agree, including reloads', () => {
  for (const [search, mode] of [['', 'story'], ['?ref=friend', 'story'], ['?from=other', 'story'], ['?from=Harmony', 'story'],
    ['?from=harmony', 'harmony'], ['?from=harmony&ref=friend', 'harmony'], ['?from=harmony&from=other', 'story']]) {
    const document = {documentElement: {dataset: {}}}, changed = [];
    vm.runInNewContext(head, {document, URLSearchParams, location: {search, hash: '', pathname: '/app/warm.html'},
      performance: {getEntriesByType: () => [{type: 'reload'}]}, history: {replaceState: (...args) => changed.push(args)},
      window: {addEventListener() {}}});
    assert.equal(entryMode(search), mode);
    assert.equal(document.documentElement.dataset.entry, mode);
    assert.equal(changed.length, mode === 'harmony' ? 0 : 1, 'the app entry never reloads into the film');
  }
});

function page(search, hash = '#mint') {
  const calls = [], title = {id: 'harmony-mint-title', focus: () => calls.push('focus')}, mint = {setAttribute: (key, value) => calls.push([key, value])}, link = {};
  const sphere = {scrollIntoView: () => calls.push('show introduction')};
  const doc = {documentElement: {dataset: {}}, getElementById: id => id === 'mint' ? mint : id === 'oath-sphere' ? sphere : title, querySelector: () => link};
  const win = {location: {search, href: `https://optimism.fit/app/warm.html${search}${hash}`}, scrollTo: () => calls.push('top')};
  return {calls, doc, win, link, checkout: async () => calls.push('checkout'), story: async () => calls.push('story')};
}

test('Harmony entry starts checkout only, focuses the visible choice and leaves the full named-wallet URL intact', async () => {
  const p = page('?from=harmony&ref=friend', `#mint:for=${wallet}`), before = p.win.location.href;
  assert.equal(await startEntry(p), 'harmony');
  assert.deepEqual(p.calls, [['aria-labelledby', 'harmony-mint-title'], 'checkout', 'focus', 'top']);
  assert.equal(p.win.location.href, before);
  assert.equal(new URL(p.link.href).search, '?ref=friend&from=introduction');
  assert.equal(new URL(p.link.href).hash, `#mint:for=${wallet}`);
});

test('watching the introduction preserves her checkout binding and shows the film after checkout initializes', async () => {
  const href = introductionURL(`https://optimism.fit/app/warm.html?from=harmony&ref=friend#mint:for=${wallet}`);
  const url = new URL(href), p = page(url.search, url.hash);
  assert.equal(herAddressOf(url.hash), wallet);
  assert.equal(await startEntry(p), 'story');
  assert.deepEqual(p.calls, ['checkout', 'story', 'show introduction']);
  assert.equal(p.win.location.href, href, 'showing the film does not clear the binding');
  for (const hash of ['#mint', '#mint:for=invalid', '']) {
    assert.equal(introductionURL(`https://optimism.fit/app/warm.html?from=harmony&ref=friend${hash}`),
      'https://optimism.fit/app/warm.html?ref=friend#oath-sphere');
  }
});

test('ordinary and referral visits start the existing checkout and story without a mint-only focus change', async () => {
  for (const query of ['', '?ref=friend', '?from=other']) {
    const p = page(query);
    assert.equal(await startEntry(p), 'story');
    assert.deepEqual(p.calls, ['checkout', 'story']);
  }
});

test('the page has no eager hero media or unconditional renderer scripts', () => {
  const scripts = [...html.matchAll(/<script\b([^>]*)>/g)].map(m => m[1]);
  // the entry, and the glass's one line (dl-glass.js: no renderer; with no seat it fetches nothing and mounts nothing: dl-glass.test.mjs holds it)
  assert.deepEqual(scripts.filter(s => /\bsrc=/.test(s)), [' type="module" src="./warm-entry.mjs?v=no-below-1"', ' type="module" src="./dl-glass.js?mount&v=glass-1"']);
  for (const tag of html.matchAll(/<(?:video|audio|source|img)\b([^>]*)>/g)) {
    assert.doesNotMatch(tag[1], /(?:^|\s)(?:src|poster)=/, 'media is hydrated only by the normal story or a user action');
  }
  assert.match(html, /data-story-poster="\.\/warm-media\//);
  // CLEAR THE MINT (lane/clear-the-mint; his Oct 30 2026 03:18:17 UTC "i am left at a page where people mint shit dude", 03:21:04 "Yes, clear it"): the
  // page's own words, its text and every word it gives a reader (aria-label, title, alt, placeholder), say $WARM, never the old mint: no mint, NFT,
  // Augur or Bronze. Comments, scripts, styles, ids, classes and data attributes are code and keep their names; dl-warm-words.proof.mjs reads the page live.
  const page = html.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, ' ');
  const words = [...page.replace(/<[^>]*>/g, '\n').split('\n'), ...[...page.matchAll(/\s(?:aria-label|title|alt|placeholder)="([^"]*)"/g)].map((m) => m[1])]
    .map((w) => w.trim()).filter(Boolean);
  assert.ok(words.includes('Skip to the trail ›') && words.includes('Stake SOL'), 'the words read are the page\'s');
  assert.deepEqual(words.filter((w) => !/^Mint your hexagon\.?$/.test(w) && (/\bmint|\bnft|\bbronze/i.test(w) || /\bAugur/.test(w))), [], 'no word of the old mint on the page; the one call of the new one stands (his Nov 11 2026 05:40 UTC "we need to get the hexagon minted there dude")');
  assert.doesNotMatch(html, /pre-mint access|NFT minting/, 'the app\'s entry offers no pre-mint access');
  assert.match(html, /switch back to Harmony/);
});

test('the existing wallet browse hop keeps the app route, named wallet and referral query', () => {
  const page = new URL(`https://optimism.fit/app/warm.html?from=harmony&ref=friend#mint:for=${wallet}`);
  const her = herAddressOf(page.hash);
  assert.equal(her, wallet);
  page.hash = mintHash(her);
  for (const link of walletBrowseLinks(page)) {
    const encoded = link.href.slice(link.href.indexOf('/browse/') + '/browse/'.length).split('?ref=')[0];
    assert.equal(decodeURIComponent(encoded), page.href);
  }
  assert.equal(introductionURL(page.href), `https://optimism.fit/app/warm.html?ref=friend&from=introduction#mint:for=${wallet}`);
});

// THE REFERRAL (Oct 16 2026, dl-society-codes.mjs): a friend's code is kept on either way in; the checkout sends it with the order
test('a friend\'s ?ref=<code> is kept in this browser on either way in, as a hand types it; a word that is no code keeps nothing; the page\'s own entry is unchanged by it', async () => {
  const t0 = Date.parse('2026-10-16T07:00:00Z');
  for (const [search, mode] of [['?ref=7k3m-9pq2', 'story'], ['?from=harmony&ref=7K3M9PQ2', 'harmony']]) {
    const storage = new Storage(), p = page(search, `#mint:for=${wallet}`);
    assert.equal(await startEntry({...p, storage, now: () => t0}), mode);
    assert.deepEqual(keptReferral(storage, t0), {code: '7K3M9PQ2', at: t0}, search);
    assert.deepEqual(JSON.parse(storage.getItem(REFERRAL_KEY)), {code: '7K3M9PQ2', at: t0});
  }
  const storage = new Storage();
  for (const search of ['', '?ref=friend', '?from=harmony&ref=friend', '?ref=']) { await startEntry({...page(search), storage, now: () => t0}); assert.equal(storage.getItem(REFERRAL_KEY), null, search); }
  storage.setItem(REFERRAL_KEY, JSON.stringify({code: 'X4T6ABCD', at: t0}));
  await startEntry({...page('?from=other'), storage, now: () => t0 + 1000});
  assert.equal(keptReferral(storage, t0 + 1000).code, 'X4T6ABCD', 'a visit without a code keeps what was kept');
  await startEntry({...page(''), storage: null});   // a browser whose storage is refused: the entry runs all the same
});

test('warm.html has no below-the-fold #purpose / #warm-world in the live DOM, never rewrites reload to #purpose, gates galaxy/world modules, and mounts no offscreen .dl-film-skip', async () => {
  const live = html.replace(/<template data-commented-out>[\s\S]*?<\/template>/g, '');
  assert.doesNotMatch(live, /id="purpose"|id="warm-world"|id="warm-state"|data-warm-galaxy|data-galaxy-video|data-ww-root-label|THE DYSON SOCIETY \/ UNIT 0/);
  const changed = [];
  vm.runInNewContext(head, {document: {documentElement: {dataset: {}}, cookie: ''}, URLSearchParams, location: {search: '', hash: '#purpose', pathname: '/app/warm.html'},
    performance: {getEntriesByType: () => [{type: 'reload'}]}, history: {replaceState: (...a) => changed.push(a)}, window: {addEventListener() {}}});
  assert.deepEqual(changed, [[undefined, '', '/app/warm.html']], 'reload clears any stale hash instead of appending #purpose');
  const entry = readFileSync(new URL('./warm-entry.mjs', import.meta.url), 'utf8');
  for (const mod of ['warm-film-center.js', 'warm-galaxy-player.js', 'warm-state.js', 'warm-spatial.js']) assert.match(entry, new RegExp(`galaxy \\? import\\('\\./${mod.replace('.', '\\.')}`));
  const {mountRouter} = await import('./dl-space-router.js'), kids = [];
  const el = (tag) => ({tagName: tag, className: '', dataset: {}, style: {setProperty() {}}, children: [], append(...k) { this.children.push(...k); kids.push(...k); }, setAttribute() {}, addEventListener() {}, classList: {add() {}, remove() {}, toggle() {}}});
  const doc = {head: el('head'), body: el('body'), documentElement: {dataset: {}}, createElement: el, querySelector: () => null, addEventListener() {}};
  mountRouter({win: {location: {search: ''}, scrollTo() {}, addEventListener() {}, removeEventListener() {}, requestAnimationFrame() {}}, doc});
  assert.equal(kids.filter((k) => k?.className === 'dl-film-skip').length, 0, 'no offscreen .dl-film-skip button appended without #purpose');
});

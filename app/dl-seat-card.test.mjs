// dl-seat-card.test.mjs: the card under a paid receipt, on stand-ins (a document of plain objects, the checkout's api and seat as the Worker
// answers them, a storage, a clipboard, an installer's manifest), and the real encoder once. node --test app/dl-seat-card.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mountSeatCard, installLinks, qrSVG, countLine} from './dl-seat-card.mjs';
import {CLAIM_KEY, claimURL, shareURL, groupCode, isClaimCode} from './dl-society-codes.mjs'; import { Storage } from '../worker/stand-ins.mjs';

class Element extends EventTarget {
  constructor(tag, ownerDocument) { super(); this.tagName = tag; this.ownerDocument = ownerDocument; this.children = []; this.dataset = {}; this.attrs = {}; this.textContent = ''; this.className = ''; this.disabled = false; this.innerHTML = ''; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  setAttribute(name, value) { this.attrs[name] = value; }
  click() { this.dispatchEvent(new Event('click')); }
}
const document = {createElement(tag) { return new Element(tag, this); }};
const host = () => document.createElement('div');
const nodes = (root) => root.children.flatMap((c) => [c, ...nodes(c)]);
const find = (root, cls) => nodes(root).find((n) => n.className.split(' ').includes(cls));
const flush = async (n = 4) => { for (let i = 0; i < n; i++) await new Promise((r) => setImmediate(r)); };
const BUYER = '7YhHMNcb7aZyHhBPYhtc87nY89SYnCfJHSYr6FWnQGaE', HER = 'So11111111111111111111111111111111111111112';
const order = {id: 'deadcafe-0000-4000-8000-000000000001', tier: 'bronze', status: 'paid', buyer: BUYER};
const ticket = (over = {}) => ({schema: 'society.ticket/1', orderId: order.id, tier: 'bronze', buyer: BUYER, holder: null, claimed: false, claimedAt: null, code: '7K3M9PQ2', shareURL: shareURL('7K3M9PQ2'),
  referrals: {schema: 'society.referrals/1', state: 'ready', code: '7K3M9PQ2', shareURL: shareURL('7K3M9PQ2'), referrer: BUYER, receipts: []}, ...over});
const published = {schema: 'nestos.release.v1', status: 'published', platforms: {macos: 'https://dl.example/harmony.dmg', windows: {url: 'https://dl.example/harmony.exe'}, linux: null}};
const unpublished = {schema: 'nestos.release.v1', status: 'unpublished', platforms: {macos: null, windows: null, linux: null}, launch: null};
// the Worker as the checkout's api() reaches it: the seat, the claim; every call recorded with its proof
function worker({tickets = [ticket()], claims = ['X4T6ABCDEFGH', 'Y5V7BCDEFGHJ'], refuse = null} = {}) {
  const calls = [];
  let drawn = 0;
  const api = async (path, data, headers = {}) => {
    calls.push(`${data === undefined ? 'GET' : 'POST'} ${path}${headers['x-seat'] ? ' [x-seat]' : ''}`);
    if (refuse) throw Object.assign(new Error(refuse), {status: 401});
    if (path.startsWith('seat?buyer=')) return {tickets};
    if (/^tickets\/.+\/claim$/.test(path)) { const claim = claims[drawn++ % claims.length]; return {claim, url: claimURL(claim), orderId: order.id, tier: 'bronze'}; }
    throw Object.assign(new Error('Not found'), {status: 404});
  };
  return {calls, api, seat: async () => 'proof', drawn: () => drawn};
}
const manifest = (body, ok = true) => async () => ({ok, json: async () => body});
const qr = async (text) => `<svg data-text="${text}"></svg>`;

test('the installer\'s doors: a published release names them over https; anything else names none', () => {
  assert.deepEqual(installLinks(published), [{platform: 'macos', label: 'macOS', href: 'https://dl.example/harmony.dmg'}, {platform: 'windows', label: 'Windows', href: 'https://dl.example/harmony.exe'}]);
  for (const bad of [unpublished, null, {}, {schema: 'other', status: 'published', platforms: {macos: 'https://x.example/a'}}, {...published, platforms: {macos: 'http://dl.example/harmony.dmg'}}, {...published, platforms: {macos: 'https://user:pw@dl.example/a'}}]) assert.deepEqual(installLinks(bad), [], JSON.stringify(bad));
  assert.equal(countLine(0), 'Share it: a referral counts when your friend mints a Society seat.');
  assert.equal(countLine(1), '1 friend has paid with your code. Each counts when their Society seat is issued.');
  assert.equal(countLine(3), '3 friends have paid with your code. Each counts when their Society seat is issued.');
});

test('ready: the referral code grouped and copied with its link; the claim drawn in a press, shown large with the QR of its link, kept in this browser; a new code replaces it; the unpublished installer says so', async () => {
  const w = worker(), root = host(), storage = new Storage(), copied = [];
  const card = mountSeatCard({root, order, buyer: BUYER, api: w.api, seat: w.seat, storage, fetcher: manifest(unpublished), qr, clipboard: {async writeText(v) { copied.push(v); }}, now: () => 1000});
  assert.equal(find(root, 'seat-card').dataset.state, 'loading');
  const s = await card.ready;
  assert.deepEqual([s.state, s.code, s.claimed, s.claim, s.installs], ['ready', '7K3M9PQ2', false, null, 0]);
  assert.deepEqual(w.calls, [`GET seat?buyer=${BUYER} [x-seat]`], 'one read, with the proof');
  assert.equal(find(root, 'seat-code').textContent, '7K3M-9PQ2');
  assert.equal(find(root, 'seat-count').textContent, countLine(0));
  assert.equal(find(root, 'seat-install').textContent, 'Harmony’s installer isn’t published yet. Keep your code: it stays yours.');
  assert.equal(find(root, 'seat-claim-code'), undefined, 'no claim until the press');
  find(root, 'seat-code').click(); await flush(); find(root, 'seat-link').click(); await flush();
  assert.deepEqual(copied, ['7K3M9PQ2', shareURL('7K3M9PQ2')]);
  assert.equal(find(root, 'seat-status').textContent, 'Link copied.');
  // the press: the claim drawn with the proof, shown in fours, its QR the claim link, kept for this order
  find(root, 'seat-claim-make').click(); await flush();
  assert.equal(w.calls.at(-1), `POST tickets/${order.id}/claim [x-seat]`);
  assert.equal(find(root, 'seat-claim-code').textContent, groupCode('X4T6ABCDEFGH'));
  assert.equal(find(root, 'seat-qr').innerHTML, `<svg data-text="${claimURL('X4T6ABCDEFGH')}"></svg>`);
  assert.deepEqual(JSON.parse(storage.getItem(`${CLAIM_KEY}${order.id}`)), {claim: 'X4T6ABCDEFGH', at: 1000});
  find(root, 'seat-claim-code').click(); await flush();
  assert.equal(copied.at(-1), 'X4T6ABCDEFGH'); assert.equal(find(root, 'seat-status').textContent, 'Harmony code copied.');
  // a new code replaces it, in the browser and in the picture
  find(root, 'seat-claim-new').click(); await flush();
  assert.equal(find(root, 'seat-claim-code').textContent, groupCode('Y5V7BCDEFGHJ'));
  assert.equal(find(root, 'seat-qr').innerHTML, `<svg data-text="${claimURL('Y5V7BCDEFGHJ')}"></svg>`);
  assert.equal(JSON.parse(storage.getItem(`${CLAIM_KEY}${order.id}`)).claim, 'Y5V7BCDEFGHJ');
  // the next card on this order (a reopened dialog) shows the kept code without a press
  const again = mountSeatCard({root: host(), order, buyer: BUYER, api: w.api, seat: w.seat, storage, fetcher: manifest(unpublished), qr});
  assert.equal((await again.ready).claim, 'Y5V7BCDEFGHJ'); assert.equal(w.drawn(), 2, 'no new draw');
  // the count line follows the friends who paid
  const r2 = host(), two = mountSeatCard({root: r2, order, buyer: BUYER, api: worker({tickets: [ticket({referrals: {...ticket().referrals, receipts: [{state: 'paid', originalBuyer: HER}, {state: 'paid', originalBuyer: HER}, {state: 'pending'}]}})]}).api, seat: w.seat, fetcher: manifest(unpublished), qr});
  await two.ready; assert.equal(find(r2, 'seat-count').textContent, countLine(2));
  card.dispose(); assert.equal(root.children.length, 0);
});

test('a bound seat says so and offers no code, forgetting the kept one; a published installer names its doors', async () => {
  const storage = new Storage(); storage.setItem(`${CLAIM_KEY}${order.id}`, JSON.stringify({claim: 'X4T6ABCDEFGH', at: 1}));
  const w = worker({tickets: [ticket({holder: HER, claimed: true, claimedAt: Date.parse('2026-10-16T12:00:00Z') / 1000})]}), root = host();
  const card = mountSeatCard({root, order, buyer: BUYER, api: w.api, seat: w.seat, storage, fetcher: manifest(published), qr});
  const s = await card.ready;
  assert.deepEqual([s.claimed, s.claim, s.installs], [true, null, 2]);
  assert.match(find(root, 'seat-bound').textContent, /^Bound to your Harmony on October 16\. Your Lyssajudron carries this seat\.$/);
  for (const cls of ['seat-claim-make', 'seat-claim-code', 'seat-claim-new']) assert.equal(find(root, cls), undefined, cls);
  assert.equal(storage.getItem(`${CLAIM_KEY}${order.id}`), null, 'the kept code is forgotten: the seat is bound');
  assert.deepEqual(nodes(root).filter((n) => n.className === 'seat-install-link').map((a) => [a.textContent, a.href]), [['macOS', 'https://dl.example/harmony.dmg'], ['Windows', 'https://dl.example/harmony.exe']]);
  assert.equal(find(root, 'seat-code').textContent, '7K3M-9PQ2', 'the referral code is the seat\'s, bound or not');
});

test('the Worker refusing, the order missing from the seat, or the manifest failing: an honest state with a way back; late work after dispose paints nothing', async () => {
  const refused = worker({refuse: 'Sign in with this wallet to see its seat.'}), root = host();
  const card = mountSeatCard({root, order, buyer: BUYER, api: refused.api, seat: refused.seat, fetcher: manifest(unpublished), qr});
  assert.equal((await card.ready).state, 'error');
  assert.equal(find(root, 'seat-status').textContent, 'Your seat’s codes could not be read.'); assert.ok(find(root, 'seat-retry'));
  const missing = worker({tickets: []}), r2 = host();
  const c2 = mountSeatCard({root: r2, order, buyer: BUYER, api: missing.api, seat: missing.seat, fetcher: manifest(unpublished), qr});
  assert.equal((await c2.ready).state, 'error'); assert.equal(find(r2, 'seat-status').textContent, 'Your seat is paid; its codes are being prepared. Try again in a moment.');
  const w = worker(), r3 = host();
  const c3 = mountSeatCard({root: r3, order, buyer: BUYER, api: w.api, seat: w.seat, fetcher: async () => { throw new Error('offline'); }, qr});
  assert.equal((await c3.ready).state, 'ready'); assert.equal(find(r3, 'seat-install').textContent, 'The installer’s doors could not be read.');
  const c4 = mountSeatCard({root: r3, order, buyer: BUYER, api: w.api, seat: w.seat, fetcher: manifest(null, false), qr});
  assert.equal((await c4.ready).state, 'ready'); assert.equal(find(r3, 'seat-install').textContent, 'The installer’s doors could not be read.');
  // a draw that lands after dispose, or after a newer refresh, paints nothing
  let release; const slow = {calls: [], api: (path, data) => { slow.calls.push(path); return path.startsWith('seat') ? Promise.resolve({tickets: [ticket()]}) : new Promise((r) => { release = r; }); }, seat: async () => 'proof'};
  const r5 = host(), c5 = mountSeatCard({root: r5, order, buyer: BUYER, api: slow.api, seat: slow.seat, fetcher: manifest(unpublished), qr});
  await c5.ready; find(r5, 'seat-claim-make').click(); await flush();
  c5.dispose(); release({claim: 'X4T6ABCDEFGH', url: claimURL('X4T6ABCDEFGH')}); await flush();
  assert.equal(r5.children.length, 0); assert.equal((await c5.refresh()).state, 'disposed');
  assert.throws(() => mountSeatCard({root: host(), order: null, buyer: BUYER, api: w.api, seat: w.seat}), TypeError);
});

test('the real encoder draws the claim link as an SVG, scalable, titled; no encoder draws nothing', () => {
  const encoder = createRequire(import.meta.url)('../../qrcode-generator.js');
  const svg = qrSVG(encoder, claimURL('X4T6ABCDEFGH'));
  assert.ok(svg.startsWith('<svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 '), svg.slice(0, 80));
  assert.match(svg, /<title id="qrcode-title">Harmony claim<\/title>/); assert.doesNotMatch(svg, / width="\d+px"/, 'scalable: no fixed size');
  assert.ok(isClaimCode('X4T6ABCDEFGH'));
  assert.equal(qrSVG(null, 'x'), null); assert.equal(qrSVG(() => { throw new Error('no'); }, 'x'), null);
});

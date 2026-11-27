// warm-ceremony.test.mjs: THE VOW'S HASH ON A GLASS (Oct 17 2026). A TV reads the mint over the rite's plain http (http://192.168.8.164:8903), which is
// not a secure context: crypto.subtle is undefined there, so the ceremony's top-level digest threw "Cannot read properties of undefined (reading
// 'digest')" and nothing after it ran on a glass (tools/embertide-mesh/journey-pages/LANDING.md). Pinned here: the house's JavaScript SHA-256 the page
// falls back to (room/isa/isa.mjs sha256Hex) gives the FIPS 180-4 vectors and crypto.subtle's lowercase hex; warm-ceremony.js itself, on a stand-in page
// with no crypto.subtle, evaluates to its last line and sends the vow's hash as crypto.subtle gives it; with crypto.subtle it still asks the browser.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {webcrypto} from 'node:crypto';
import {sha256Hex} from '../vendor/embertide-app/ui/intro/room/isa/isa.mjs';

const html = readFileSync(new URL('./warm.html', import.meta.url), 'utf8');
const vow = 'A vow of two lines, a stand-in:\nthe served page holds none since his Nov 7 2026 "Take both off".';   // the oath stays off public pages and out of code (CLAUDE.md)
const LAST = /\bstatus\('([^']+)'\);?\s*$/.exec(readFileSync(new URL('./warm-ceremony.js', import.meta.url), 'utf8'))[1];   // the words of its last line
const bytes = s => new TextEncoder().encode(s);
const subtleHex = async s => Buffer.from(await webcrypto.subtle.digest('SHA-256', bytes(s))).toString('hex');

test('the JavaScript SHA-256 the mint falls back to gives the FIPS 180-4 vectors, in lowercase hex', () => {
  for (const [message, hex] of [
    ['', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'],
    ['abc', 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
    ['abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq', '248d6a61d20638b8e5c026930c3e6039a33ce45964ff2167f6ecedd419db06c1'],
    ['abcdefghbcdefghicdefghijdefghijkefghijklfghijklmghijklmnhijklmnoijklmnopjklmnopqklmnopqrlmnopqrsmnopqrstnopqrstu',
      'cf5b16a778af8380036ce59e7b0492370b249b11e8f07a51afac45037afee9d1'],
    ['a'.repeat(1e6), 'cdc76e5c9914fb9281a1c7e284d73e67f1809a48a497200e046d39ccc7112cd0'],
  ]) assert.equal(sha256Hex(bytes(message)), hex, `${message.length} bytes`);
});

test('it gives crypto.subtle\'s hex for the vow\'s own words, for words beyond ASCII, and for every length across four blocks', async () => {
  assert.ok(!/id="oath-text"/.test(html), 'the served page carries no oath of its own');
  for (const s of [vow, 'A vow — beyond ASCII ✦ 誓い 🜂', 'é'.repeat(33), ...Array.from({length: 200}, (_, n) => 'x'.repeat(n))]) {
    assert.equal(sha256Hex(bytes(s)), await subtleHex(s), `${bytes(s).length} bytes`);
  }
});

// A stand-in page for warm-ceremony.js: every element it asks for by id, the vow in #oath-text, an empty sessionStorage, and fetch answered as the
// ceremony service answers (the invitation carries the hash the service computed: crypto.subtle's). The GET that follows the accept answers 404, so
// the page's listen ends as expired and leaves no timer behind.
function standIn({at, crypto, hash}) {
  const els = new Map(), sent = [];
  const element = () => ({textContent: '', value: '', href: '', hidden: true, disabled: false, open: false, dataset: {}, listeners: {},
    classList: {add() {}, remove() {}}, addEventListener(type, f) { (this.listeners[type] ??= []).push(f); },
    insertAdjacentHTML() {}, setAttribute() {}, focus() {}, select() {}, append() {}, replaceChildren() {}});
  const el = id => els.get(id) ?? els.set(id, element()).get(id);
  const document = {hidden: false, getElementById: el, addEventListener() {}, createElement: element,
    querySelector: s => s === '#oath-text' ? {textContent: `\n${vow}\n`} : s.startsWith('#') ? el(s.slice(1)) : null,
    querySelectorAll: s => s === '#ceremony-accept' ? [el('ceremony-accept')] : []};
  const answer = (status, body) => ({ok: status < 300, status, json: async () => body});
  const fetch = async (url, init = {}) => {
    const path = new URL(url).pathname;
    sent.push({method: init.method ?? 'GET', path, body: init.body ? JSON.parse(init.body) : null});
    if (path === '/v1/ceremonies') return answer(200, {id: 'c1', humanToken: 't', invitationUrl: 'http://x/i', agentPageUrl: 'http://x/a', oathHash: hash});
    return path === '/v1/ceremonies/c1/human' ? answer(200, {}) : answer(404, {message: 'gone'});
  };
  const globals = {document, window: {addEventListener() {}}, location: new URL(at), fetch, crypto,
    sessionStorage: {getItem: () => null, setItem() {}, removeItem() {}}};
  const saved = Object.fromEntries(Object.keys(globals).map(k => [k, Object.getOwnPropertyDescriptor(globalThis, k)]));
  for (const [k, value] of Object.entries(globals)) Object.defineProperty(globalThis, k, {value, configurable: true, writable: true});
  const restore = () => { for (const [k, d] of Object.entries(saved)) d ? Object.defineProperty(globalThis, k, d) : delete globalThis[k]; };
  return {el, sent, restore, accept: () => el('ceremony-form').listeners.submit[0]({preventDefault() {}})};
}

test('on a glass (no crypto.subtle) the ceremony evaluates to its last line and sends the vow\'s hash as crypto.subtle gives it', async () => {
  const hash = await subtleHex(vow);
  const page = standIn({at: 'http://192.168.8.164:8903/rite/dome/intro/dyson-society/app/warm.html', crypto: {getRandomValues: a => webcrypto.getRandomValues(a)}, hash});
  try {
    await import('./warm-ceremony.js?glass');   // before Oct 17 2026 this threw: "Cannot read properties of undefined (reading 'digest')"
    assert.equal(page.el('ceremony-status').textContent, LAST, 'its last line ran');
    assert.equal(page.el('ceremony-accept').textContent, 'Ceremony preview');
    await page.accept();
    assert.deepEqual(page.sent.map(r => `${r.method} ${r.path}`), ['POST /v1/ceremonies', 'POST /v1/ceremonies/c1/human', 'GET /v1/ceremonies/c1']);
    assert.equal(page.sent[0].body.oath, vow);
    assert.deepEqual(page.sent[1].body, {decision: 'accept', oathHash: hash}, 'the hash it made without crypto.subtle is crypto.subtle\'s');
  } finally { page.restore(); }
});

test('where the page has crypto.subtle (the Mac\'s window, optimism.fit) the ceremony asks the browser\'s digest, once, for the same hash', async () => {
  const hash = await subtleHex(vow), asked = [];
  const subtle = {digest: (algorithm, data) => { asked.push(algorithm); return webcrypto.subtle.digest(algorithm, data); }};
  const page = standIn({at: 'http://127.0.0.1:8921/intro/dyson-society/app/warm.html', crypto: {subtle, getRandomValues: a => webcrypto.getRandomValues(a)}, hash});
  try {
    await import('./warm-ceremony.js?secure');
    assert.deepEqual(asked, ['SHA-256']);
    assert.equal(page.el('ceremony-status').textContent, LAST, 'its last line ran');
    await page.accept();
    assert.deepEqual(page.sent[1]?.body, {decision: 'accept', oathHash: hash});
  } finally { page.restore(); }
});

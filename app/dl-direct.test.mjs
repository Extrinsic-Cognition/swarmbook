// dl-direct.test.mjs: THE HOLDER'S ROAD (dl-direct.js holder(), Oct 15 2026). A holder whose kept seat proof is gone (a new browser, or a proof past
// its 30 days) reaches the wall opening in one press and one signature, without choosing a tier or meeting a price; a wallet holding no seat, a
// refused approval, no wallet, or another wallet than hers opens nothing. And the checkout's own connect, split around it (reach()), still connects,
// signs once and saves its tier's receipt. The real dl-direct.js and the real wall (dl-paywall.js createPaywall) run together on stand-ins only: a
// document of plain objects, a storage, a Worker that checks the seat proof as the Worker does (verifySeatProof) and answers from a table, a wallet
// whose key is made here. No page, no Solana, no purchase. node --test app/dl-direct.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {RECIPIENT, TERMS, TIERS, SEAT_KEY, SEAT_PROOF_DAYS, encode58, quoteLamports, solAmount, seatSignIn, sealSeatProof, seatFields, verifySeatProof} from './dl-direct-protocol.mjs';
import {FRAME_S, HOLD_FRAME, createPaywall} from './dl-paywall.js'; import { Storage } from '../worker/stand-ins.mjs';

const here = (p) => new URL(p, import.meta.url), DAY = 86400000;
const HOST = 'optimism.fit', ORIGIN = `https://${HOST}`;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const until = async (ok, ms = 3000) => { for (const t0 = Date.now(); !ok(); await sleep(5)) if (Date.now() - t0 > ms) return false; return true; };

// a node of the page: what dl-direct.js and the wall touch, no layout
class El extends EventTarget {
  constructor(tag = 'div', id = '') { super(); Object.assign(this, {tag, id, hidden: false, disabled: false, open: false, dataset: {}, attrs: {}, kids: [], text: '', className: '', value: ''}); }
  get textContent() { return this.text + this.kids.map((k) => k.textContent).join(''); }
  set textContent(v) { this.text = String(v); this.kids = []; }
  append(...kids) { for (const k of kids) this.kids.push(typeof k === 'string' ? Object.assign(new El('#text'), {text: k}) : k); }
  replaceChildren(...kids) { this.text = ''; this.kids = []; this.append(...kids); }
  setAttribute(n, v) { this.attrs[n] = String(v); }
  removeAttribute(n) { delete this.attrs[n]; }
  scrollIntoView() {}
  showModal() { this.open = true; }
  close() { this.open = false; }
  click() { this.onclick?.(); return this.dispatchEvent(new Event('click', {cancelable: true})); }
}
// the ids dl-direct.js asks for (the test below holds this list to its source), the two seats and the holder's road
const IDS = ['slot-dialog', 'slot-go', 'slot-fields', 'slot-quote', 'slot-status', 'slot-twitter', 'slot-portrait', 'slot-profile-note', 'slot-title', 'slot-price',
  'slot-form', 'slot-manage', 'slot-reservations', 'slot-reservation-rows', 'slot-new', 'slot-github', 'slot-email', 'slot-referral', 'slot-referral-code', 'slot-referral-clear', 'slot-seat'];
function page() {
  const byId = new Map(IDS.map((id) => [id, new El(id === 'slot-dialog' ? 'dialog' : 'div', id)]));
  const close = new El('button'), dialog = byId.get('slot-dialog');
  dialog.querySelector = (s) => (s === '.dialog-close' ? close : null);
  dialog.dataset.tier = 'bronze';
  const seats = {bronze: new El('button'), gold: new El('button')}, holder = new El('button');
  for (const [tier, seat] of Object.entries(seats)) seat.dataset.mintTier = tier;
  holder.dataset.mintHolder = '';
  const doc = {head: new El('head'), getElementById: (id) => byId.get(id) ?? null, createElement: (tag) => new El(tag),
    querySelectorAll: (s) => (s === '[data-mint-tier]' ? Object.values(seats) : s === '[data-mint-holder]' ? [holder] : [])};
  const text = (id) => byId.get(id).textContent;
  return {doc, byId, dialog, seats, holder, text, rows: () => byId.get('slot-reservation-rows').kids.map((li) => li.textContent)};
}
// a wallet as the checkout reads it (Phantom's shape), its key made here: it signs the sign-in in the page and never a transaction
async function standInWallet({refuse = false} = {}) {
  const pair = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']);
  const address = encode58(new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey)));
  return {address, pair, publicKey: null, connects: 0, signs: 0, transactions: 0, refuse,
    async connect() { this.connects++; this.publicKey = {toBase58: () => address}; return {publicKey: this.publicKey}; },
    async signTransaction() { this.transactions++; throw new Error('the test signs no transaction'); },
    async signMessage(bytes) {
      this.signs++;
      if (this.refuse) throw Object.assign(new Error('User rejected the request.'), {code: 4001});
      return {signature: new Uint8Array(await crypto.subtle.sign('Ed25519', pair.privateKey, bytes))};
    }};
}
// the wallet's proof as the checkout keeps it, signed at `now`
const proofOf = async (w, now) => {
  const text = seatSignIn({host: HOST, origin: ORIGIN, address: w.address, now});
  return sealSeatProof(text, new Uint8Array(await crypto.subtle.sign('Ed25519', w.pair.privateKey, new TextEncoder().encode(text))));
};
// the Worker's answers in its own shapes (worker/premint.mjs publicOrder), its receipts to the wallet's own seat proof only
const receipt = (buyer, tier, over = {}) => ({id: crypto.randomUUID(), tier, buyer, recipient: RECIPIENT, lamports: quoteLamports(TIERS[tier].usd, '103.88'), solUsd: '103.88',
  createdAt: 1, expiresAt: 91, blockhash: '11111111111111111111111111111111', lastValidBlockHeight: 1, termsVersion: TERMS, signature: 'stand-in-never-a-transaction', status: 'paid', paidSlot: 1, ...over});
function standInWorker(orders = []) {
  const calls = [];
  const json = (data, status = 200) => new Response(JSON.stringify(data), {status, headers: {'content-type': 'application/json'}});
  async function fetch(url, init = {}) {
    const u = new URL(url, ORIGIN), method = init.method ?? 'GET', seat = init.headers?.['x-seat'];
    calls.push(`${method} ${u.pathname}${u.search}${seat ? ' [x-seat]' : ''}`);
    if (u.pathname === '/api/premint/receipts') {
      const shown = await verifySeatProof(seat, {host: HOST, origin: ORIGIN, now: Date.now()});
      if (!shown || shown.buyer !== u.searchParams.get('buyer')) return json({error: 'Sign in with this wallet to see its purchases.'}, 401);
      return json({orders: orders.filter((o) => o.buyer === shown.buyer)});
    }
    if (u.pathname === '/api/premint/availability') return json({enabled: true, recipient: RECIPIENT, cluster: 'mainnet-beta', tiers: TIERS, termsVersion: TERMS});
    const m = /^\/api\/premint\/orders\/([0-9a-f-]{36})$/.exec(u.pathname), o = m && method === 'GET' && orders.find((x) => x.id === m[1]);
    return o ? json({order: o}) : json({error: 'Order not found'}, 404);
  }
  return {calls, orders, fetch};
}
class Media extends EventTarget {
  constructor(t = 0) { super(); this.t = t; this.paused = false; this.readyState = 4; }
  get currentTime() { return this.t; }
  set currentTime(v) { this.t = v; queueMicrotask(() => this.dispatchEvent(new Event('seeked'))); }
  pause() { this.paused = true; }
  play() { this.paused = false; }
}
const set = (name, value) => Object.defineProperty(globalThis, name, {value, configurable: true, writable: true});
let instance = 0;
// the film's page as optimism.fit serves it: the wall holding the film on frame 1111 with the choice standing, and the checkout's own script,
// both on one window, one storage and one Worker. Each call is a fresh page (a fresh dl-direct.js); they run one at a time.
async function mint({wallet = null, storage = new Storage(), orders = [], hash = ''} = {}) {
  const p = page(), worker = standInWorker(orders), win = Object.assign(new EventTarget(), wallet ? {phantom: {solana: wallet}} : {}), paid = [];
  win.addEventListener('dl-premint-paid', () => paid.push(Date.now()));
  set('document', p.doc); set('window', win); set('localStorage', storage); set('fetch', worker.fetch);
  set('location', {hash, host: HOST, origin: ORIGIN, href: `${ORIGIN}/app/warm.html${hash}`});
  const film = new Media(HOLD_FRAME * FRAME_S + 0.01), song = new Media(film.t);
  const choice = Object.assign(new EventTarget(), {hidden: false, dataset: {layout: 'editorial', stage: '0'}, querySelector: () => null, querySelectorAll: () => []});
  const wall = createPaywall({film, song, choice, storage, events: win, fetcher: worker.fetch, doc: Object.assign(new EventTarget(), {hidden: false}), review: null});
  await import(`./dl-direct.js?page=${++instance}`);
  wall.at(HOLD_FRAME * FRAME_S);   // the film presents frame 1111: the wall holds, and asks with whatever proof this browser keeps
  await sleep(20);
  return {...p, worker, win, paid, wall, choice, film, storage, wallet};
}

test('a holder on a new browser: one press of the holder\'s road and one signature open the wall, with no tier chosen and no price met', async () => {
  const wallet = await standInWallet(), gold = receipt(wallet.address, 'gold');
  const m = await mint({wallet, orders: [gold]});
  assert.equal(m.wall.holds(), true, 'held on frame 1111');
  assert.deepEqual(m.worker.calls, [], 'a visitor with no proof kept asks nothing, and the checkout asks nothing at load');
  const t0 = Date.now();
  m.holder.click();   // the one press
  assert.equal(await until(() => m.wall.state().state === 'open'), true, 'the wall opens');
  assert.equal(m.wall.state().opened, 'receipt'); assert.equal(m.wall.holds(), false); assert.equal(m.choice.hidden, true, 'the choice goes with the wall');
  assert.deepEqual([m.wallet.connects, m.wallet.signs, m.wallet.transactions], [1, 1, 0], 'one connect, one signature, no transaction');
  const ask = `GET /api/premint/receipts?buyer=${wallet.address} [x-seat]`;
  assert.deepEqual(m.worker.calls, [ask, ask], 'the checkout reads the receipts with the fresh proof, the wall asks with it once: no availability, no quote, no order');
  assert.equal(m.paid.length, 1, 'said once (dl-premint-paid)');
  const kept = seatFields(m.storage.getItem(`${SEAT_KEY}${wallet.address}`));
  assert.equal(kept.address, wallet.address); assert.equal(kept.domain, HOST);
  assert.ok(Math.abs(kept.expires - (t0 + SEAT_PROOF_DAYS * DAY)) < 60000, 'kept for its 30 days: the next visit plays on with no press');
  // the dialog: the holder's own, no tier and no price; the wallet's purchase listed; the seats never pressed
  assert.equal(m.dialog.open, true); assert.equal(m.dialog.dataset.tier, undefined, 'no tier chosen');
  assert.equal(m.text('slot-title'), 'Your seat.');
  assert.equal(m.text('slot-price'), 'Connect the wallet that holds it and sign in once. No fee, no transaction.');
  assert.doesNotMatch(m.text('slot-title') + m.text('slot-price') + m.text('slot-status'), /\$|SOL/, 'no price on the road');
  assert.deepEqual([m.byId.get('slot-form').hidden, m.byId.get('slot-reservations').hidden, m.byId.get('slot-new').hidden], [true, false, true]);
  assert.deepEqual(m.rows(), [`Golden Aiolos · paid · ${solAmount(gold.lamports)} SOL`]);
  assert.equal(m.text('slot-status'), 'Your seat is open in this browser.');
  // the next visit: the kept proof alone opens the wall at load, one ask, no press, no signature
  const again = await mint({wallet, storage: m.storage, orders: [gold]});
  assert.equal(await until(() => again.wall.state().state === 'open'), true);
  assert.deepEqual(again.worker.calls, [ask]); assert.equal(wallet.signs, 1);
});

test('a holder whose kept proof is past its 30 days: the wall stands and asks nothing; one press signs a fresh proof in its place, and the wall opens', async () => {
  const wallet = await standInWallet(), storage = new Storage();
  storage.setItem(`${SEAT_KEY}${wallet.address}`, await proofOf(wallet, Date.now() - (SEAT_PROOF_DAYS + 1) * DAY));
  const m = await mint({wallet, storage, orders: [receipt(wallet.address, 'bronze')]});
  assert.equal(m.wall.holds(), true); assert.deepEqual(m.worker.calls, [], 'an expired proof is not asked');
  m.holder.click();
  assert.equal(await until(() => m.wall.state().state === 'open'), true);
  assert.deepEqual([m.wallet.connects, m.wallet.signs], [1, 1]);
  const kept = seatFields(storage.getItem(`${SEAT_KEY}${wallet.address}`));
  assert.ok(Date.now() - kept.issued < 60000, 'the fresh proof replaced the expired one');
  assert.match(m.rows()[0], /^Bronze Mint · paid · /);
  assert.equal(m.worker.calls.filter((c) => !c.startsWith('GET /api/premint/receipts?')).length, 0, 'nothing but the receipts');
});

test('a wallet holding no seat, or a payment still being checked, signs once and opens nothing; its proof is kept for the checkout', async () => {
  const visitor = await standInWallet(), m = await mint({wallet: visitor});
  m.holder.click();
  assert.equal(await until(() => m.rows().length > 0 || m.text('slot-reservation-rows') !== ''), true);
  assert.equal(m.text('slot-reservation-rows'), 'No submitted purchases for this wallet.');
  assert.equal(m.wall.holds(), true); assert.equal(m.paid.length, 0); assert.equal(m.text('slot-status'), '');
  assert.deepEqual([visitor.connects, visitor.signs], [1, 1]);
  assert.ok(seatFields(m.storage.getItem(`${SEAT_KEY}${visitor.address}`)), 'kept: a purchase next connects with no second signature');
  const waiting = await standInWallet(), w = await mint({wallet: waiting, orders: [receipt(waiting.address, 'gold', {status: 'submitted'})]});
  w.holder.click();
  assert.equal(await until(() => w.rows().length > 0), true);
  assert.match(w.rows()[0], /^Golden Aiolos · submitted · /); assert.equal(w.wall.holds(), true); assert.equal(w.paid.length, 0);
});

test('a refused approval, no wallet in this browser, or another wallet than hers: nothing read, nothing kept, the wall stands, and the next press asks again', async () => {
  const shy = await standInWallet({refuse: true}), m = await mint({wallet: shy, orders: [receipt(shy.address, 'gold')]});
  m.holder.click();
  assert.equal(await until(() => m.text('slot-status') !== ''), true);
  assert.equal(m.text('slot-status'), 'Wallet approval cancelled. Nothing was sent by this checkout.');
  assert.deepEqual(m.worker.calls, []); assert.equal(m.storage.getItem(`${SEAT_KEY}${shy.address}`), null); assert.equal(m.wall.holds(), true);
  shy.refuse = false; m.holder.click();   // the same page, the approval given this time
  assert.equal(await until(() => m.wall.state().state === 'open'), true);
  assert.deepEqual([shy.connects, shy.signs], [2, 2]);
  const none = await mint();
  none.holder.click();
  assert.equal(await until(() => none.text('slot-status') !== ''), true);
  assert.equal(none.text('slot-status'), 'Open optimism.fit in your Solana wallet’s browser, or install Phantom, Solflare or Backpack.');
  assert.deepEqual(none.worker.calls, []); assert.equal(none.wall.holds(), true);
  // a link from Harmony names her wallet (#mint:for=<hers>): another wallet signs nothing and reads nothing here
  const hers = await standInWallet(), other = await standInWallet(), h = await mint({wallet: other, hash: `#mint:for=${hers.address}`, orders: [receipt(other.address, 'gold')]});
  h.holder.click();
  assert.equal(await until(() => h.text('slot-status') !== ''), true);
  assert.match(h.text('slot-status'), /is not hers/); assert.equal(other.signs, 0); assert.deepEqual(h.worker.calls, []); assert.equal(h.wall.holds(), true);
});

test('the seats\' own road is unchanged: a seat opens its tier with its price, Connect signs once, and the tier\'s paid receipt is saved and opens the wall', async () => {
  const wallet = await standInWallet(), m = await mint({wallet, orders: [receipt(wallet.address, 'gold')]});
  m.seats.gold.click();
  assert.equal(await until(() => m.worker.calls.length === 1 && !m.byId.get('slot-go').disabled), true);
  assert.deepEqual([m.dialog.open, m.dialog.dataset.tier, m.text('slot-title'), m.text('slot-price'), m.text('slot-go')], [true, 'gold', 'Golden Aiolos.', '$1,000 · Pre-mint access.', 'Connect wallet']);
  m.byId.get('slot-form').dispatchEvent(new Event('submit', {cancelable: true}));
  assert.equal(await until(() => m.text('slot-go') === 'Access reserved' && m.wall.state().state === 'open'), true);
  assert.deepEqual([wallet.connects, wallet.signs, wallet.transactions], [1, 1, 0]);
  const ask = `GET /api/premint/receipts?buyer=${wallet.address} [x-seat]`;
  assert.deepEqual(m.worker.calls.filter((c) => !c.startsWith('GET /api/premint/seat?') && c !== 'GET /nestos-release.json'), ['GET /api/premint/availability?creator=photons_enjoyor', ask, ask]);
  assert.ok(m.storage.getItem(`dyson-mainnet-order-v1:${wallet.address}:gold`), 'the tier\'s order saved, as before');
  // THE SEAT CARD (Oct 16 2026): the paid receipt reads the seat once, with the same proof, for its codes; the wall and the receipts are as they were
  assert.equal(await until(() => m.worker.calls.some((c) => c === `GET /api/premint/seat?buyer=${wallet.address} [x-seat]`)), true, 'the seat read with the proof');
  assert.equal(m.byId.get('slot-seat').hidden, false, 'the card\'s place shows under a paid receipt');
  assert.equal(await until(() => m.worker.calls.includes('GET /nestos-release.json')), true, 'and the installer\'s doors, once');
});

test('the holder\'s road on the pages: one control on a tracenet, none on the film\'s page since its seats left it, no price, bound by the checkout; no timer on the road', () => {
  const direct = readFileSync(here('./dl-direct.js'), 'utf8');
  assert.deepEqual([...new Set([...direct.matchAll(/el\('([a-z-]+)'\)/g)].map((x) => x[1]))].sort(), [...IDS].sort(), 'the stand-in page carries every id the checkout asks for, and no other');
  assert.match(direct, /document\.querySelectorAll\('\[data-mint-holder\]'\)\.forEach\(link => link\.addEventListener\('click', e => \{ e\.preventDefault\(\); void holder\(\); \}\)\);/);
  const road = direct.slice(direct.indexOf('async function holder()'), direct.indexOf('let sdk;'));
  assert.ok(road.length > 200); assert.doesNotMatch(road, /setTimeout|setInterval|requestAnimationFrame|api\('(availability|orders)/, 'nothing at rest, no quote, no order');
  // the control's place and kind, not its words: the words are his (a tracenet's reads "Already a member?" since ad4285d8)
  // CLEAR THE MINT (lane/clear-the-mint, his Oct 30 2026 03:21:04 UTC "Yes, clear it"): the road left the film's page with its seats; it was the one door
  // there into the legacy reservation slot (#slot-dialog), which the page now opens nowhere and which says nothing of its own
  const warm = readFileSync(here('./warm.html'), 'utf8'), slot = warm.slice(warm.indexOf('<dialog id="slot-dialog"'), warm.indexOf('</dialog>', warm.indexOf('<dialog id="slot-dialog"')));
  assert.equal((warm.match(/data-mint-holder/g) || []).length, 0, 'none on the film\'s page');
  assert.match(slot, /<h2 id="slot-title"><\/h2><p id="slot-price"><\/p>/, 'the slot carries no tier and no price of its own');
  assert.doesNotMatch(slot, /legacy-reservations|Bronze|pre-mint/, 'nor the earlier test reservations');
  const tracenet = readFileSync(here('./tracenet.html'), 'utf8');
  assert.match(tracenet, /<button[^>]*\bid="tn-holder"[^>]*\bdata-mint-holder\b[^>]*>[^<]+<\/button>/, 'on a tracenet, the control tracenet.js binds (#tn-holder)');
  assert.equal((tracenet.match(/data-mint-holder/g) || []).length, 1, 'one on a tracenet');
  assert.doesNotMatch(/<button[^>]*data-mint-holder[^>]*>[\s\S]*?<\/button>/.exec(tracenet)[0], /\$|data-mint-tier|data-seat-price/, 'no price, no tier');
});

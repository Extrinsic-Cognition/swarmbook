// dl-paywall.test.mjs: THE PAYWALL ON THE GOLDEN ARMOR (dl-paywall.js; his words in its header and in lab/PAYWALL.md). For a viewer with no
// paid receipt the film holds on the previous screen, the last frame before her wall of light (1111), and the choice stands there: it is the
// wall (Oct 15 2026); a holder plays on (the wallet that signed the seat proof this browser keeps: an order id opens nothing), and the mint is
// the 7 days from his launch day. Stand-ins only: no page, no Worker, a key made here for the wallet, no purchase. node --test dl-paywall.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync, readdirSync} from 'node:fs';
import {RECIPIENT, TERMS, SEAT_KEY, encode58, seatSignIn, sealSeatProof} from './dl-direct-protocol.mjs';
import {LAUNCH_DAY, MINT_DAYS, STOP_S, FRAME_S, STOP_FRAME, HOLD_FRAME, HOLD_S, RECEIPT_KEY, CHOICE_FRAMES, launchMs, opensAt, exclusive, mintState, mintLine, paintSeats, paintLaw, reached, onHold, choiceAt, dock, savedProofs, paidReceipt, paidSeats, reviewOf, createPaywall, DRAWN_FRAME, MINT_CLOSES as SET_CLOSE, closesMs} from './dl-paywall.js'; const MINT_CLOSES = '2026-11-18T00:00:00+00:00';   // a close as it stood through Nov 17 2026: the wall's two sides of one stay proven; the house's own (SET_CLOSE) is none since he reopened the mint (Nov 19 2026)
import {GOLD_DAYS, BRONZE_DAYS, OPEN_DAYS, LAW_WORDS, whenText} from './tracenet-register.mjs';
import {SHOTS, FOLD} from '../lab/cubism.mjs';
import {loopUnitAt} from './warm-assembly.js'; import { Storage } from '../worker/stand-ins.mjs';

const DAY = 86400000, here = (p) => new URL(p, import.meta.url);
const frameAt = (n) => n * FRAME_S;   // a presented frame's time (requestVideoFrameCallback mediaTime)
const ID = '0b6c2f0e-3a4d-4c1e-9f2a-6d5e4c3b2a19', ID2 = '9d1e7a55-0c3b-4f6a-8e2d-1a2b3c4d5e6f';
// the holder's wallet (a key made here) and its seat proof, signed as the checkout has it signed when it connects (the worlds' clock: Oct 14 20:00 UTC)
const KEYS = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']);
const WALLET = encode58(new Uint8Array(await crypto.subtle.exportKey('raw', KEYS.publicKey)));
const signIn = async (address = WALLET, now = Date.UTC(2026, 9, 14, 20)) => {
  const text = seatSignIn({host: 'optimism.fit', origin: 'https://optimism.fit', address, now});
  return sealSeatProof(text, new Uint8Array(await crypto.subtle.sign('Ed25519', KEYS.privateKey, new TextEncoder().encode(text))));
};
const PROOF = await signIn(), KEPT = {[`${SEAT_KEY}${WALLET}`]: PROOF};
const RECEIPTS = `/api/premint/receipts?buyer=${WALLET}`;
const receipt = (over = {}) => ({id: ID, tier: 'bronze', buyer: WALLET, status: 'paid', recipient: RECIPIENT, termsVersion: TERMS, signature: 'stand-in-signature', ...over});

class Media extends EventTarget {
  constructor(t = 0) { super(); this.t = t; this.paused = false; this.readyState = 4; this.seeks = []; }
  get currentTime() { return this.t; }
  set currentTime(v) { this.t = v; this.seeks.push(v); queueMicrotask(() => this.dispatchEvent(new Event('seeked'))); }
  pause() { this.paused = true; }
  play() { this.paused = false; }
}
const tick = () => new Promise((r) => setTimeout(r, 0));
// a piece of the page that records the animations asked of it (the compositor's, in the page)
class Piece extends EventTarget {
  constructor(data = {}, height = 600) { super(); this.hidden = true; this.dataset = {...data}; this.animations = []; this.parentElement = {clientHeight: height}; }
  animate(keys, opts) { this.animations.push({keys, opts}); return {}; }
}
// a seat of the choice: the checkout's button, its price, its closed mark
class Seat extends Piece {
  constructor(data, price) { super(data); this.disabled = false; this.attrs = new Set(); this.price = {dataset: {}, textContent: price}; }
  toggleAttribute(name, on) { if (on) this.attrs.add(name); else this.attrs.delete(name); }
  querySelector(s) { return s === '[data-seat-price]' ? this.price : null; }
  closest(s) { return s === '[data-mint-tier]' ? this : null; }
  setAttribute(n, v) { this.attrs.add(`${n}=${v}`); }
}
// THE CHOICE as warm.html lays it out: the question; the two seats, "Not mint" and the line (the mint's days, and the free way's words unseen)
const choiceOf = () => {
  const bronze = new Seat({choicePiece: '2', lane: '1', from: '4.42', dock: '1800', mintTier: 'bronze'}, '$10');
  const gold = new Seat({choicePiece: '2', lane: '2', from: '1.3', dock: '1800', dockDelay: '350', mintTier: 'gold'}, '$1,000');
  const not = Object.assign(new Piece({choicePiece: '2', lane: '3', from: '4.42', dock: '1500', dockDelay: '800'}), {attrs: {}, setAttribute(n, v) { this.attrs[n] = String(v); }});
  const pieces = [new Piece({choicePiece: '1', lane: '0', from: '1.3', dock: '2400'}), bronze, gold, not, new Piece({choicePiece: '2', lane: '0', from: '1.43', dock: '1400', dockDelay: '1400'})];
  const line = {hidden: false, textContent: 'The mint runs for 7 days from launch.'}, free = {hidden: true};
  const box = new Piece({stage: '0'});
  return Object.assign(box, {pieces, not, line, free, seats: [bronze, gold],
    querySelectorAll: (s) => (s === '[data-choice-piece]' ? pieces : s === '[data-mint-tier]' ? [bronze, gold] : []),
    querySelector: (s) => (s === '[data-paywall-not]' ? not : s === '[data-mint-line]' ? line : s === '[data-free-line]' ? free : null)});
};
function world({storage = new Storage(), answer = null, now = Date.UTC(2026, 9, 14, 20), review = null, launch = undefined, continuousSound = false, hold = undefined, closes = undefined, warmPair = undefined} = {}) {
  const film = new Media(0), song = new Media(0), events = new EventTarget(), doc = Object.assign(new EventTarget(), {hidden: false});
  const sphere = {held: false, redraws: 0, setHeld(v) { this.held = v; }, redraw() { this.redraws++; }};
  const choice = choiceOf();
  const asked = [], seats = [], changes = [], clock = {now};
  const fetcher = async (url, init = {}) => { asked.push(url); seats.push(init.headers?.['x-seat'] ?? null); if (answer instanceof Error) throw answer; const a = typeof answer === 'function' ? answer(url) : answer; return {ok: Boolean(a), json: async () => a}; };
  const make = () => createPaywall({film, song, sphere, choice, onChange: (s) => changes.push(s), fetcher, storage, now: () => clock.now, review, events, doc, launch, continuousSound, hold, closes, warmPair});
  return {film, song, sphere, choice, events, doc, asked, seats, changes, clock, make};
}

test('his launch day is one constant, unset: the paywall is on today and on any day', () => {
  assert.equal(LAUNCH_DAY, null); assert.equal(launchMs(), null); assert.equal(opensAt(), null);
  for (const t of [0, Date.UTC(2026, 9, 14), Date.UTC(2030, 0, 1), NaN]) assert.equal(exclusive(t), true, `on at ${t}`);
  const app = readdirSync(here('./')).filter((f) => /\.(m?js|html)$/.test(f) && !f.endsWith('.test.mjs'));
  const where = app.filter((f) => /\bLAUNCH_DAY\s*=/.test(readFileSync(here(`./${f}`), 'utf8')));
  assert.deepEqual(where, ['dl-paywall.js'], 'one place'); assert.match(readFileSync(here('./dl-paywall.js'), 'utf8'), /THE LAUNCH DAY, his alone \(his 19:13 WEST, Oct 14 2026: "i want to keep 7 day exclusivity"\)/);
});

test('7 days from the launch day the rest of the film is for minters, then for everyone; not a date keeps it on', () => {
  const launch = '2026-10-20T00:00:00+01:00', start = Date.parse(launch);
  assert.equal(MINT_DAYS, 7); assert.equal(opensAt(launch), start + 7 * DAY); assert.equal(exclusive(start - DAY, launch), true, 'before the launch day: on'); assert.equal(exclusive(start, launch), true); assert.equal(exclusive(start + 7 * DAY - 1, launch), true, 'the last millisecond of the seventh day: on'); assert.equal(exclusive(start + 7 * DAY, launch), false, 'the eighth day: for everyone'); assert.equal(exclusive(start + 30 * DAY, launch), false);
  for (const bad of ['', 'soon', 'next tuesday', 20261020, {}]) assert.equal(exclusive(start + 30 * DAY, bad), true, `${JSON.stringify(bad)}: on`);
});

test('the replacement holds the user-marked big explosion, frame 1380', () => {
  assert.equal(STOP_FRAME, 1381); assert.equal(HOLD_FRAME, 1380); assert.equal(STOP_S, frameAt(1381)); assert.ok(frameAt(HOLD_FRAME) < HOLD_S && HOLD_S < frameAt(HOLD_FRAME + 1));
  for (const t of [frameAt(HOLD_FRAME), HOLD_S, 50.05, 61.767, 154]) assert.equal(reached(t), true);
  for (const t of [0, 29.563, 37.08705, 37.9, 43.3, 45.7, frameAt(1379), NaN, undefined, null]) assert.equal(reached(t), false);
  for (const t of [frameAt(HOLD_FRAME), HOLD_S, frameAt(HOLD_FRAME + 1) - 1e-4]) assert.equal(onHold(t), true);
  for (const t of [frameAt(HOLD_FRAME) - 1e-3, frameAt(HOLD_FRAME + 1), NaN]) assert.equal(onHold(t), false);
});

test('the seat proofs this browser keeps: one per wallet as the checkout keeps it, whole and unexpired, at most six; an order id is none', async () => {
  const now = Date.UTC(2026, 9, 14, 20), other = encode58(new Uint8Array(32).fill(7));
  const s = new Storage({...KEPT, [`${RECEIPT_KEY}${WALLET}:bronze`]: ID, [`${RECEIPT_KEY}${WALLET}:gold`]: ID2, [`${SEAT_KEY}${other}`]: PROOF,
    [`${SEAT_KEY}Wallet3`]: 'not-a-proof', [`${SEAT_KEY}${encode58(new Uint8Array(32).fill(8))}`]: ID, 'other:key': PROOF, 'dyson-whitelist': 'x'});
  assert.deepEqual(savedProofs(s, now), [{buyer: WALLET, proof: PROOF}], 'the order ids, a proof under another wallet\'s name, and what is no proof: none'); assert.deepEqual(savedProofs(new Storage(KEPT), Date.UTC(2026, 9, 14, 20) + 30 * DAY - 1), [{buyer: WALLET, proof: PROOF}], 'its last millisecond'); assert.deepEqual(savedProofs(new Storage(KEPT), Date.UTC(2026, 9, 14, 20) + 30 * DAY), [], 'expired: not asked');
  const many = new Storage(Object.fromEntries(await Promise.all(Array.from({length: 9}, async (_, i) => {
    const address = encode58(new Uint8Array(32).fill(i + 1));
    return [`${SEAT_KEY}${address}`, await signIn(address)];   // signed by another key: well formed, and the Worker's to refuse
  }))));
  assert.equal(savedProofs(many, now).length, 6); assert.deepEqual(savedProofs(null, now), []); assert.deepEqual(savedProofs({get length() { throw new Error('SecurityError'); }}, now), [], 'storage refused: none');
});

test('a paid receipt is the Worker\'s publicOrder for this id: paid, the pinned recipient, the current terms, a tier it sells', () => {
  assert.equal(paidReceipt(receipt(), ID), true); assert.equal(paidReceipt(receipt({tier: 'gold'}), ID), true);
  for (const [name, o] of [['another id', receipt({id: ID2})], ['submitted', receipt({status: 'submitted'})], ['open', receipt({status: 'open'})],
    ['failed', receipt({status: 'failed'})], ['another recipient', receipt({recipient: '11111111111111111111111111111111'})],
    ['old terms', receipt({termsVersion: 'premint-direct-v0'})], ['no such tier', receipt({tier: 'platinum'})], ['no signature', receipt({signature: null})], ['nothing', null]]) {
    assert.equal(paidReceipt(o, ID), false, name);
  }
  // a wallet's paid receipts among its /receipts: its own, each paid
  assert.deepEqual(paidSeats([receipt({status: 'submitted'}), receipt(), receipt({id: ID2, buyer: 'another'}), null], WALLET), [receipt()]);
  for (const orders of [undefined, null, {}, 'x']) assert.deepEqual(paidSeats(orders, WALLET), []);
});

test('a visitor: the film plays to frame 1379, pauses on frame 1380 where it stands (no seek), the choice standing, and nothing more runs', async () => {
  const w = world(), wall = w.make();
  assert.equal(wall.state().state, 'watch');
  for (let n = 0; n < HOLD_FRAME; n += 37) assert.equal(wall.at(frameAt(n)), false);
  assert.equal(wall.at(frameAt(HOLD_FRAME - 1)), false, 'frame 1379 is drawn');
  w.film.t = frameAt(HOLD_FRAME) + 0.012; w.song.t = frameAt(HOLD_FRAME) + 0.02;   // the clocks a little past the presented frame, as playing media's are
  assert.equal(wall.at(frameAt(HOLD_FRAME)), true, 'frame 1380 is the last'); assert.equal(w.film.paused, true); assert.equal(w.song.paused, true); assert.deepEqual(w.film.seeks, [], 'paused where it stood: not one seek of the picture'); assert.equal(w.film.currentTime, frameAt(HOLD_FRAME) + 0.012); assert.deepEqual(w.song.seeks, [frameAt(HOLD_FRAME) + 0.012], 'the song stands with the picture'); assert.equal(w.sphere.held, true, 'the sphere stands still'); assert.equal(w.sphere.redraws, 1, 'the hold\'s frame drawn once'); assert.equal(w.choice.hidden, false, 'the choice stands: it is the wall'); assert.equal(w.choice.dataset.stage, '3'); assert.deepEqual(w.changes, ['held']);
  assert.equal(wall.holds(), true); assert.equal(wall.at(frameAt(STOP_FRAME)), true);
  await tick();
  assert.deepEqual(w.asked, [], 'a visitor with no receipt asks the Worker nothing'); assert.deepEqual({holds: wall.state().holds, hold: wall.state().hold, toHold: wall.state().toHold, mint: wall.state().mint}, {holds: 1, hold: HOLD_FRAME, toHold: null, mint: 'unset'}); assert.equal(w.choice.line.textContent, 'The mint runs for 7 days from launch.', 'his launch day unset: no countdown');
});

test('a pause that lands off the hold is put on it, never further back than a frame: a late frame callback, or the song ahead of the picture', async () => {
  const late = world(), wall = late.make();
  late.film.t = frameAt(HOLD_FRAME + 1) + 0.003;   // the frame callback for 1111 came late: the clock already in 1112
  assert.equal(wall.at(frameAt(HOLD_FRAME)), true); assert.deepEqual(late.film.seeks, [HOLD_S], 'put back on frame 1380'); assert.ok(frameAt(STOP_FRAME) + 0.003 - HOLD_S < FRAME_S, 'back by less than a frame');
  await tick();
  assert.equal(late.sphere.redraws, 1, 'drawn once, after its seek');
  // the song is the clock and runs ahead of the picture: the song's second reaches the hold with the picture three frames behind
  const ahead = world(), w2 = ahead.make();
  ahead.film.t = frameAt(HOLD_FRAME - 3) + 0.01;
  assert.equal(w2.at(frameAt(HOLD_FRAME - 3), frameAt(HOLD_FRAME) + 0.01), true, 'the song past frame 1380\'s start'); assert.deepEqual(ahead.film.seeks, [HOLD_S], 'the picture forward onto the hold'); assert.equal(ahead.song.currentTime, HOLD_S, 'the song with it'); assert.equal(ahead.choice.dataset.stage, '3');
});

test('a song running without frames (the film stalled) stops at the hold by its own time', async () => {
  const b = world(); b.make();
  b.film.t = 36.2; b.song.t = frameAt(HOLD_FRAME) + 0.02; b.song.paused = false; b.song.dispatchEvent(new Event('timeupdate'));
  assert.equal(b.song.paused, true); assert.equal(b.film.paused, true); assert.equal(b.choice.hidden, false); assert.deepEqual(b.film.seeks, [HOLD_S]); assert.equal(b.song.currentTime, HOLD_S);
});

test('a holder whose wallet signed in plays on past the golden flash: one ask at load, with the proof, and no wall', async () => {
  const w = world({storage: new Storage(KEPT), answer: {orders: [receipt()]}}), wall = w.make();
  await tick(); await tick();
  assert.deepEqual(w.asked, [RECEIPTS]); assert.deepEqual(w.seats, [PROOF], 'the wallet\'s seat proof in x-seat'); assert.equal(wall.state().state, 'open'); assert.equal(wall.state().opened, 'receipt'); assert.equal(wall.at(frameAt(STOP_FRAME)), false); assert.equal(wall.at(38.071), false); assert.equal(w.film.paused, false); assert.equal(w.choice.hidden, true); assert.deepEqual(w.changes, []);
});

test('at the wall, the checkout\'s paid receipt opens it and the film plays on from his second', async () => {
  const storage = new Storage(), w = world({storage, answer: {orders: [receipt({tier: 'gold'})]}}), wall = w.make();
  assert.equal(wall.at(frameAt(HOLD_FRAME)), true);
  // dl-direct.js: the holder's wallet connected and signed in once (the proof kept), its receipts read, and says so
  storage.setItem(`${SEAT_KEY}${WALLET}`, PROOF);
  w.events.dispatchEvent(new Event('dl-premint-paid'));
  await tick(); await tick();
  assert.equal(wall.state().state, 'open'); assert.equal(wall.holds(), false); assert.equal(w.choice.hidden, true, 'a holder: the choice goes'); assert.equal(w.sphere.held, false); assert.deepEqual(w.changes, ['held', 'open'], 'dl-twelve.js sync() plays the film and its song on from the hold'); assert.equal(wall.at(39), false);
});

test('a receipt the Worker does not call paid, another wallet\'s, a refused proof, or a Worker out of reach, leaves the wall standing', async () => {
  for (const answer of [{orders: [receipt({status: 'submitted'})]}, {orders: [receipt({buyer: 'another-wallet'})]}, {orders: []}, null, {error: 'Sign in with this wallet to see its purchases.'}, new Error('offline')]) {
    const w = world({storage: new Storage(KEPT), answer}), wall = w.make();
    await tick(); await tick();
    assert.equal(wall.at(frameAt(HOLD_FRAME)), true, JSON.stringify(answer?.orders?.[0]?.status ?? answer?.message ?? answer));
    await tick(); await tick();
    assert.equal(wall.holds(), true); assert.equal(w.choice.hidden, false);
  }
});

// THE SEAT PROOF (Oct 15 2026): the checkout used to keep a bare order id here and the wall opened on it; an id is in its payment's memo on
// mainnet, so anyone could plant one. Such a browser now meets the wall and asks nothing until its wallet signs in.
test('an order id alone opens nothing: a browser carrying only the checkout\'s saved order ids meets the wall and asks the Worker nothing', async () => {
  const paid = (url) => (url === `/api/premint/orders/${ID}` ? {order: receipt({tier: 'gold'})} : null);   // the Worker would call that id paid
  const w = world({storage: new Storage({[`${RECEIPT_KEY}${WALLET}:gold`]: ID, [`${RECEIPT_KEY}${WALLET}:bronze`]: ID2}), answer: paid}), wall = w.make();
  await tick(); await tick();
  assert.deepEqual(w.asked, [], 'no id is asked after');
  w.film.t = frameAt(HOLD_FRAME) + 0.01;
  assert.equal(wall.at(frameAt(HOLD_FRAME)), true, 'the wall holds');
  w.events.dispatchEvent(new Event('dl-premint-paid')); await tick(); await tick();
  assert.equal(wall.holds(), true); assert.deepEqual(w.asked, []); assert.equal(wall.state().receipts, 0);
  // an expired proof is not asked either; its wallet signs in again in the checkout
  const old = world({storage: new Storage({[`${SEAT_KEY}${WALLET}`]: await signIn(WALLET, Date.UTC(2026, 9, 14, 20) - 30 * DAY)}), answer: {orders: [receipt()]}}), stale = old.make();
  await tick(); await tick();
  assert.deepEqual(old.asked, []); assert.equal(stale.state().state, 'watch');
});

test('after the 7 days the film plays for everyone; within them the choice says the days left of the mint', () => {
  // the window is computed from his constant; here the arithmetic the page runs, at three instants of a launch 3 days ago
  const launch = '2026-10-11T00:00:00+01:00', now = Date.parse('2026-10-14T20:00:00+01:00');
  assert.equal(exclusive(now, launch), true); assert.equal(exclusive(now + 4 * DAY, launch), false); assert.equal(opensAt(launch), Date.parse('2026-10-18T00:00:00+01:00')); assert.equal(mintLine(mintState(now, launch)), 'The mint is open 7 days: 4 days left.', '3 days and 4 hours left: the fourth day counts');
  // the wall reads exclusive() at load, at the stop and when the page is shown again: unset here, so it stands
  const w = world({now: Date.UTC(2040, 0, 1)}), wall = w.make();
  assert.equal(wall.state().exclusive, true); assert.equal(wall.at(STOP_S), true);
});

test('held, a seek past the hold goes back to it; a seek before it plays up to it again, the song with it', async () => {
  const w = world(), wall = w.make();
  w.film.t = frameAt(HOLD_FRAME) + 0.01; wall.at(frameAt(HOLD_FRAME)); await tick();
  w.film.currentTime = 61.767; await tick(); await tick();
  assert.equal(w.film.currentTime, HOLD_S, 'his conversion second is behind the wall'); assert.equal(wall.holds(), true); assert.equal(w.choice.hidden, false);
  w.film.currentTime = 12.7; await tick();
  assert.equal(wall.state().state, 'watch'); assert.equal(w.choice.hidden, true, 'before her cut: no choice yet'); assert.equal(w.sphere.held, false); assert.equal(w.song.currentTime, 12.7, 'the song goes where the picture went'); assert.deepEqual(w.changes, ['held', 'watch']); assert.equal(wall.at(frameAt(HOLD_FRAME)), true, 'and the hold holds again');
});

test('his page (the lab) meets the wall as a visitor does; ?paywall=off is a minter\'s view for the lanes\' proofs; the site itself is never a lab', () => {
  // his Oct 15 2026 00:11 WEST, over his page playing on through the wall: "you gotta stop the video dude what the hell? do you know the
  // meaning of paywall or not?"
  const lab = (pathname, search = '') => { const top = {}; top.parent = top; top.location = {pathname, search}; return {parent: top}; };
  assert.equal(reviewOf(lab('/intro/dyson-society/lab/hero-ab.html', '')), 'visitor', 'his page as it opens'); assert.equal(reviewOf(lab('/intro/dyson-society/lab/hero-ab.html', '?v=film')), 'visitor'); assert.equal(reviewOf(lab('/lab/hero-ab.html', '?v=film&paywall=on')), 'visitor'); assert.equal(reviewOf(lab('/lab/hero-ab.html', '?v=film&paywall=off')), 'holder', 'a minter\'s view, asked by name'); assert.equal(reviewOf(lab('/app/index.html')), null, 'a page of the site framing it: not a lab');
  const top = {}; top.parent = top; assert.equal(reviewOf(top), null, 'the page on its own');
  assert.equal(reviewOf({get parent() { return {get location() { throw new Error('SecurityError'); }}; }}), null, 'framed by another site'); assert.equal(reviewOf(undefined), null);
  const w = world({review: 'holder'}), wall = w.make();
  assert.equal(wall.at(STOP_S), false); assert.equal(wall.state().opened, 'lab');
  const v = world({review: 'visitor'}), seen = v.make();
  assert.equal(seen.at(frameAt(HOLD_FRAME)), true);
});

test('the page: no box at the stop, the choice is the wall, on the film\'s own clock', () => {
  const html = readFileSync(here('./warm.html'), 'utf8'), twelve = readFileSync(here('./dl-twelve.js'), 'utf8');
  const wallJs = readFileSync(here('./dl-paywall.js'), 'utf8'), sphere = readFileSync(here('./warm-sphere.js'), 'utf8'), warm = readFileSync(here('./warm.js'), 'utf8');
  const css = readFileSync(here('./dl-paywall.css'), 'utf8');
  // the box that stood at the stop is gone: from the page, its sheet and the wall (his 01:0x: "there is absolutely no need for this")
  assert.doesNotMatch(html, /id="dl-paywall"|class="dl-paywall"[ >]|data-paywall-until|The rest of the film is for minters/); assert.doesNotMatch(css, /\.dl-paywall \{|\.dl-paywall-seat|\.dl-paywall-until|\.dl-paywall-holders/);
  const code = wallJs.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  assert.doesNotMatch(code, /offer|OFFER_DOCK|show\(|data-paywall-until/, 'no box in the wall\'s code'); assert.match(html, /<link rel="stylesheet" href="\.\/dl-paywall\.css\?v=[\w-]+">/); assert.match(html, /<script type="module" src="\.\/warm-entry\.mjs\?v=[\w-]+"><\/script>/); assert.match(readFileSync(here('./warm-entry.mjs'), 'utf8'), /import\('\.\/dl-twelve\.js\?v=seen-once-1'\)/); assert.match(twelve, /import \{createPaywall, HOLD_S, onHold, reached, DRAWN_FRAME, MINT_CLOSES, FRAME_S\} from '\.\/dl-paywall\.js\?v=climax-1';/, 'this cut of the wall, not a cached one');
  // the film's frame is handed to the wall before the sphere draws it, and canPlay asks it
  assert.match(twelve, /if \(wall\.at\(presented\?\.mediaTime \?\? film\.currentTime, [^)]*\)\) \{ moment\(\); return; \}\s*keepTime\(\); moment\(\); sphere\.redraw\(\); follow\(\);/); assert.match(twelve, /if \(wall\.holds\(\) && !cinematicEnabled\)/);
  // THE ANIME NEVER STOPS (his Oct 18 2026 00:3x WEST), but once, his own (Oct 21 2026): THE FREEZE ON THE DRAWN ARROW, until the mint closes
  assert.match(twelve, /createPaywall\(\{film, song, sphere, continuousSound: cinematicEnabled,\s+choice: stage\.ownerDocument\.querySelector\('#dl-paywall-choice'\), onChange: \(\) => sync\(\), stopsFilm: true, hold: DRAWN_FRAME, closes: MINT_CLOSES\}\)/); assert.match(twelve, /const cinematicEnabled = false;/, 'no freeze at the golden flash for anyone');
  // no timer of its own: the page's clock is the film's frames, the song's time and the causes
  assert.doesNotMatch(wallJs, /\b(setTimeout|setInterval|requestAnimationFrame)\s*\(/);
  // the hold seeks only to put a pause onto its own frame (holdS: HOLD_FRAME's, or THE FREEZE's), or a seek past it back: never anywhere else
  assert.deepEqual([...wallJs.matchAll(/film\.currentTime\s*=(?!=)\s*([^;]+);/g)].map((m) => m[1].trim()), ['holdS', 'holdS']);
  // the sphere stands still while held, whatever the page's own pause says
  assert.match(sphere, /function canAnimate\(\) \{ return !destroyed && !paused && !held && /); assert.match(sphere, /setHeld\(value\) \{ held = Boolean\(value\); visibility\(\); requestFrame\(\); \}/); assert.match(warm, /from '\.\/warm-sphere\.js\?v=mint-3'/);
});

// THE CHOICE (his Oct 14 2026 23:20 WEST over THE FOLD: "this is where you need to start slowly introducing the choice: MINT OR NOT MINT??";
// 23:2x: "the pop-ups you do here must be aligned to the lyssajudron anime harmony animations eh")
test('the choice comes in on her three shots\' cuts, all before the wall, and the wall stays on his golden flash', () => {
  assert.deepEqual([...CHOICE_FRAMES], SHOTS.map((s) => s.frames[0]), 'her cut, her face, the beam: the film\'s own cuts'); assert.deepEqual([...CHOICE_FRAMES], [886, 1006, 1096]); assert.ok(CHOICE_FRAMES.every((f) => f < HOLD_FRAME), 'every stage before the hold'); assert.equal(choiceAt(FOLD.start), 1, 'her cut, THE FOLD\'s first second');
  for (const [n, k] of [[0, 0], [540, 0], [885, 0], [886, 1], [1005, 1], [1006, 2], [1095, 2], [1096, 3], [1111, 3]]) assert.equal(choiceAt(frameAt(n)), k, `frame ${n}`);
  for (const t of [NaN, undefined, null, Infinity]) assert.equal(choiceAt(t), 0);
});

test('each piece docks as a world of the twelve: along the orbits\' own 3:2 Lissajous, from far and small and unseen to its place', () => {
  for (let lane = 0; lane < 4; lane++) {
    const path = dock(lane, {from: 0.4 * lane, reach: 150});
    assert.equal(path.length, 25); assert.deepEqual(path[0].opacity, 0, 'unseen at the start'); assert.equal(path[0].scale, 0.35, 'small: far'); assert.ok(Math.hypot(path[0].x, path[0].y) > 20, `lane ${lane} starts away from its place`); assert.deepEqual({x: path.at(-1).x, y: path.at(-1).y, scale: path.at(-1).scale, opacity: path.at(-1).opacity}, {x: 0, y: 0, scale: 1, opacity: 1}, 'it ends at its place, whole');
    for (let i = 1; i < path.length; i++) { assert.ok(path[i].scale >= path[i - 1].scale); assert.ok(path[i].opacity >= path[i - 1].opacity); }
  }
  // lane 0 is the orbits' first lane as warm-assembly.js flies it (no azimuth at its start): the way left points along that very curve
  const smooth = (x) => x * x * (3 - 2 * x), path = dock(0, {from: 0, reach: 100});
  for (const k of path.slice(0, -1)) {
    const left = 100 * (1 - smooth(k.offset)), p = loopUnitAt(0, (Math.PI / 2) * k.offset, 0);
    assert.ok(Math.abs(k.x - left * p[0]) < 0.02 && Math.abs(k.y + left * p[1]) < 0.02, `at ${k.offset}: (${k.x}, ${k.y}) on the orbit`);
  }
});

test('a visitor: the question at her cut, the seats, "Not mint" and the line at her face, each docking once, the light at the beam; at the hold it stands, the wall', () => {
  const w = world(), wall = w.make(), c = w.choice, docked = () => c.pieces.map((p) => p.animations.length);
  assert.equal(wall.at(frameAt(885)), false); assert.equal(c.hidden, true, 'nothing before her cut');
  wall.at(frameAt(886));
  assert.equal(c.hidden, false); assert.equal(c.dataset.stage, '1'); assert.deepEqual(docked(), [1, 0, 0, 0, 0], 'the question');
  const q = c.pieces[0].animations[0];
  assert.deepEqual({duration: q.opts.duration, delay: q.opts.delay, easing: q.opts.easing, fill: q.opts.fill}, {duration: 2400, delay: 0, easing: 'linear', fill: 'backwards'}); assert.equal(q.keys[0].opacity, 0); assert.equal(q.keys.at(-1).transform, 'translate(0px, 0px) scale(1)'); assert.deepEqual(q.keys.map((k) => k.transform), dock(0, {from: 1.3, reach: 0.22 * 600}).map((k) => `translate(${k.x}px, ${k.y}px) scale(${k.scale})`), 'from a fifth of the stage away, along lane 0');
  for (let n = 887; n < 1006; n += 7) wall.at(frameAt(n));
  assert.deepEqual(docked(), [1, 0, 0, 0, 0], 'each frame of a stage asks nothing more');
  wall.at(frameAt(1006));
  assert.equal(c.dataset.stage, '2'); assert.deepEqual(docked(), [1, 1, 1, 1, 1], 'the two seats, "Not mint" and the line'); assert.deepEqual(c.pieces.slice(1).map((p) => [p.animations[0].opts.duration, p.animations[0].opts.delay]), [[1800, 0], [1800, 350], [1500, 800], [1400, 1400]], 'one after another');
  const settled = Math.max(...c.pieces.slice(1).map((p) => p.animations[0].opts.duration + p.animations[0].opts.delay)) / 1000;
  assert.ok(frameAt(1006) + settled < frameAt(1096), `all of it in place (${(frameAt(1006) + settled).toFixed(2)} s) before the beam`);
  wall.at(frameAt(1096));
  assert.equal(c.dataset.stage, '3', 'the beam: its light'); assert.deepEqual(docked(), [1, 1, 1, 1, 1], 'nothing more comes'); assert.equal(wall.state().choice, 3);
  w.film.t = frameAt(HOLD_FRAME) + 0.01;
  assert.equal(wall.at(frameAt(HOLD_FRAME)), true, 'the wall holds on the previous screen'); assert.equal(c.hidden, false, 'the choice stands'); assert.equal(c.dataset.stage, '3', 'as at that frame'); assert.deepEqual(docked(), [1, 1, 1, 1, 1], 'nothing docks again, nothing comes up: no change of screen');
});

test('"Not mint" is the free way: the choice stays and says the code is free on day 15 with no fuel, and the hold stays', () => {
  const w = world(), wall = w.make(), c = w.choice;
  w.film.t = frameAt(HOLD_FRAME) + 0.01; wall.at(frameAt(HOLD_FRAME));
  assert.equal(wall.holds(), true); assert.equal(c.line.hidden, false); assert.equal(c.free.hidden, true);
  c.not.dispatchEvent(new Event('click'));
  assert.equal(wall.holds(), true, 'the hold stays'); assert.equal(w.film.paused, true); assert.deepEqual(w.changes, ['held']); assert.equal(c.hidden, false, 'the choice stays'); assert.equal(c.dataset.stage, '3'); assert.deepEqual([c.line.hidden, c.free.hidden, c.not.attrs['aria-pressed']], [true, false, 'true'], 'it says the free way'); assert.equal(wall.state().declined, true);
  // pressed before the wall, it stays too, and the film holds at the wall all the same
  const v = world(), seen = v.make();
  seen.at(frameAt(1010)); v.choice.not.dispatchEvent(new Event('click'));
  seen.at(frameAt(1096)); assert.equal(v.choice.hidden, false); assert.equal(v.choice.dataset.stage, '3');
  assert.equal(seen.at(frameAt(HOLD_FRAME)), true); assert.equal(v.choice.hidden, false);
});

test('the mint is the 7 days from his launch day: the choice counts them down; once over, a seat pressed reads closed and opens no checkout', () => {
  const launch = '2026-10-20T00:00:00+01:00', start = Date.parse(launch), at = (d) => start + d * DAY;
  const day = (ms) => new Intl.DateTimeFormat('en', {month: 'long', day: 'numeric'}).format(ms);
  const read = (t) => { const m = mintState(t, launch); return [m.phase, m.daysLeft, mintLine(m)]; };
  assert.deepEqual(read(at(-1)), ['before', 7, `The mint is open 7 days, from ${day(start)}.`]); assert.deepEqual(read(at(0)), ['open', 7, 'The mint is open 7 days: 7 days left.'], 'day 0'); assert.deepEqual(read(at(6.5)), ['open', 1, 'The mint is open 7 days: 1 day left.']); assert.deepEqual(read(at(7) - 1), ['open', 1, 'The mint is open 7 days: 1 day left.'], 'its last millisecond');
  const free = day(start + 15 * DAY);
  assert.deepEqual(read(at(7)), ['closed', 0, `The mint is closed. The code is free from ${free}.`], 'day 7 is over: closed, and the day the code is free'); assert.deepEqual(read(at(8)), ['closed', 0, `The mint is closed. The code is free from ${free}.`], 'day 8'); assert.deepEqual(read(at(15) - 1), ['closed', 0, `The mint is closed. The code is free from ${free}.`]); assert.deepEqual(read(at(15)), ['closed', 0, 'The mint is closed. The code is free.'], 'day 15: the law\'s OPEN_DAYS from the launch'); assert.equal(mintState(at(1), launch).freeAt, start + OPEN_DAYS * DAY);
  assert.deepEqual(mintState(Date.now(), null), {phase: 'unset', start: null, end: null, daysLeft: null, freeAt: null, free: false}); assert.equal(mintLine(mintState(Date.now())), 'The mint runs for 7 days from launch.', 'his launch day unset (today): no countdown');
  for (const t of [at(-1), at(0), at(6.99), at(7) - 1, at(7), at(8), NaN]) assert.equal(exclusive(t, launch), mintState(t, launch).phase !== 'closed', `the wall at ${t}`);
  // within the mint: the hold, the choice counting down, a seat's press going on to the checkout
  const press = (root, seat) => { const e = new Event('click', {cancelable: true}); Object.defineProperty(e, 'target', {value: seat}); root.dispatchEvent(e); return e; };
  const w = world({launch, now: start + 2.5 * DAY}), wall = w.make();
  assert.equal(w.choice.line.textContent, 'The mint is open 7 days: 5 days left.', 'written at the making');
  w.film.t = frameAt(HOLD_FRAME) + 0.01; assert.equal(wall.at(frameAt(HOLD_FRAME)), true);
  assert.equal(press(w.choice, w.choice.seats[1]).defaultPrevented, false, 'the checkout opens');
  // the mint's days end while the choice stands (no timer waits for that instant): the next press finds the seats closed and goes no further
  w.clock.now = start + 7 * DAY;
  assert.equal(press(w.choice, w.choice.seats[0]).defaultPrevented, true, 'the checkout does not open'); assert.deepEqual(w.choice.seats.map((s) => [s.disabled, s.price.textContent, s.attrs.has('data-closed')]), [[true, 'Closed', true], [true, 'Closed', true]]); assert.equal(w.choice.line.textContent, `The mint is closed. The code is free from ${free}.`);
  // a page opened after the mint's days: no wall, no choice; the film plays for everyone
  const after = world({launch, now: start + 8 * DAY}), open = after.make();
  assert.equal(open.state().state, 'open'); assert.equal(open.state().opened, 'window'); assert.equal(open.at(frameAt(HOLD_FRAME)), false); assert.equal(open.at(frameAt(1010)), false); assert.equal(after.choice.hidden, true);
  paintSeats({querySelectorAll: (s) => (s === '[data-mint-tier]' ? w.choice.seats : [])}, false);
  assert.deepEqual(w.choice.seats.map((s) => [s.disabled, s.price.textContent]), [[false, '$10'], [false, '$1,000']], 'and open again for a mint that is open');
});

test('a holder never sees the choice; his page (the lab) shows it and STOPS the film at the wall; a minter\'s view (?paywall=off) never sees it', async () => {
  const h = world({storage: new Storage(KEPT), answer: {orders: [receipt()]}}), held = h.make();
  await tick(); await tick();
  for (const n of [886, 1006, 1096]) held.at(frameAt(n));
  assert.equal(h.choice.hidden, true); assert.deepEqual(h.choice.pieces.map((p) => p.animations.length), [0, 0, 0, 0, 0]);
  // his page as it opens (his 23:4x WEST: "I WANT TO ALWAYS DO QA ON A SINGLE COMULATED VERSION DUDE"; 00:11: "you gotta stop the video")
  const v = world({review: 'visitor'}), page = v.make();
  page.at(frameAt(886)); assert.equal(v.choice.hidden, false); assert.equal(v.choice.dataset.stage, '1');
  page.at(frameAt(1006)); assert.equal(v.choice.dataset.stage, '2');
  v.film.t = frameAt(HOLD_FRAME) + 0.01;
  assert.equal(page.at(frameAt(HOLD_FRAME)), true, 'the film holds on the previous screen'); assert.equal(v.film.paused, true); assert.equal(v.choice.hidden, false, 'the choice stands: the wall');
  v.film.currentTime = HOLD_S + 1; await tick(); await tick();
  assert.equal(v.film.currentTime, HOLD_S, 'a seek past the wall goes back to it'); assert.equal(page.holds(), true);
  // a minter's view, asked by name for the lanes' proofs that look past the stop
  const lab = world({review: 'holder'}), seen = lab.make();
  for (const n of [886, 1006, 1096]) seen.at(frameAt(n));
  assert.equal(lab.choice.hidden, true); assert.equal(seen.at(frameAt(HOLD_FRAME)), false, 'it plays on'); assert.equal(lab.film.paused, false);
  const bare = world(), wall = createPaywall({film: bare.film, song: bare.song, storage: new Storage(), now: () => Date.UTC(2026, 9, 14, 20), review: null, events: bare.events, doc: bare.doc});
  assert.equal(wall.at(frameAt(1006)), false, 'no choice on the page: the wall works as before');
});

test('a seek: before her cut puts the choice away, past a cut brings every piece its stage holds, and from the wall back before it again', async () => {
  const w = world(), wall = w.make(), c = w.choice;
  w.film.currentTime = 34.0; await tick();
  assert.equal(c.dataset.stage, '2'); assert.deepEqual(c.pieces.map((p) => p.animations.length), [1, 1, 1, 1, 1], 'the question with the seats');
  w.film.currentTime = 12.7; await tick();
  assert.equal(c.hidden, true); assert.equal(c.dataset.stage, '0');
  w.film.t = frameAt(HOLD_FRAME) + 0.01; wall.at(frameAt(HOLD_FRAME)); await tick();
  assert.equal(c.hidden, false, 'at the hold: standing');
  w.film.currentTime = 30.2; await tick();
  assert.equal(wall.state().state, 'watch'); assert.equal(c.dataset.stage, '1'); assert.equal(c.hidden, false, 'sought back from the wall into her cut');
});

test('Snowtrace is introduced before the offer, in document flow outside the picture', () => {
  const html = readFileSync(here('./warm.html'), 'utf8');
  const stage = html.slice(html.indexOf('id="sphere-stage"'), html.indexOf('<div class="genesis-controls">'));
  assert.doesNotMatch(stage, /data-mint-tier|dl-paywall-choice/);
  const intro = html.indexOf('id="snowtrace-title"');
  const choice = html.slice(html.indexOf('<section class="dl-paywall-choice"'), html.indexOf('<a class="snowtrace-browse"'));
  assert.ok(intro > 0 && intro < html.indexOf('class="snowtrace-tier snowtrace-kit"'), 'explain the project before any price choice'); assert.match(choice, /data-layout="editorial"/); assert.doesNotMatch(choice, /data-choice-piece|data-lane|data-dock/);
  // YOUR PRESENCE IN THE MMO (his Oct 29 2026 10:41 UTC: "stop using 10/1k range dio merda, just have 1 single one and make it about your mmo
  // presence"): no seat and no range, one kit. STAKE, DON'T SPEND (his ~18:2x UTC: "staking only, with staking rewards that become fuel and credits for
  // the project snowtrace cohort... this works when there is a lot of stake moved"): the kit is a stake of SOL, no ticket and nothing sold; its rewards
  // fill her tank or the ClawRiders' by the staker's toggle (his 18:08); the scale said plainly; its door paused until the stake pool exists
  assert.doesNotMatch(html, /data-mint-tier="(?:bronze|gold)"|Bronze Mint<|Gold Mint<|Choose (?:Bronze|Gold)/, 'no seat is offered');
  // THE ONE OFFER (his Oct 30 2026 "simply collapse into 1 ... keep the gas tank refuelment"): the one kit the page renders is the refuel card after
  // the film; the old offer is kept only inside the inert commented-out templates
  const live = html.replace(/<template data-commented-out>[\s\S]*?<\/template>/g, '');
  // REMOVED (his Oct 30 2026, the tank's card struck through in red: "remove this shit dude"): the page renders no kit at all; the refuel card is inert too
  assert.equal((live.match(/class="snowtrace-tier snowtrace-kit"/g) || []).length, 0, 'no kit'); assert.match(html, /<template data-commented-out><!-- REMOVED \(his Oct 30 2026[^]*?<section class="dl-refuel" id="refuel"/, 'the refuel card kept, inert'); assert.match(choice, /<h3>Enter the MMO\.<\/h3><span>Stake SOL<\/span><\/div><p>Keep your SOL, keep your soul\. Believers give its light to Space Router\.<\/p>/);
  // SOL IS THE SUN (his Oct 30 2026 ~10:1x UTC, over the words above: "you dont get what sol represents?"; Oct 14 19:40 UTC: "do you understanf "DYSON
  // LIGHT" the light of the dyson sphere..."; Oct 29 20:37 UTC: "the pun of sol soul soul.md"): SOL is the sun the sphere is built round and the soul a swarm
  // never takes; the staker keeps it and gives only its light. None of these lines says "SOL staked on" or "its rewards fuel" any more
  // WHO BELIEVES IN SPACE ROUTER (his Oct 30 2026 09:30 UTC: "can we make sure that the staking part of it is about who believes in space router in
  // solana please?"): the kit says who stakes, $POOL says whose it is, the rite's second chapter (its words, its spoken line, its pass) says what the
  // stake means; belief in the router, never a promise of a return
  assert.match(html, /<h3><a href="#her-door">Stake SOL\.<\/a> Give its light to Space Router\.<\/h3>/, 'the rite\'s second chapter: the stake gives its light to Space Router'); assert.match(html, /<strong>SOL staked<\/strong><span>Its light, to Space Router<\/span>/, 'the pass: its light, to Space Router'); assert.match(readFileSync(new URL('./swarm-explainer.js', import.meta.url), 'utf8'), /'Stake SOL\. Give its light to Space Router\.'/, 'the chapter\'s spoken line says it too'); assert.doesNotMatch(html.replace(/<!--[\s\S]*?-->/g, ' '), /SOL staked on Space Router|Its rewards fuel the swarm|For everyone on Solana/, 'SOL is the sun and the soul, never money spent');
  assert.doesNotMatch(html.replace(/<!--[\s\S]*?-->/g, ' '), /Join the swarm\.<\/h3>|For SOL stakers only|The starter kit<\/span>/, 'no staking line that leaves Space Router out'); assert.match(choice, /<li><b>Her fuel:<\/b> your stake's rewards, every epoch\.<\/li><li><b>Your toggle:<\/b> her credits, or the ClawRiders'\.<\/li>/, 'the toggle: her credits, or the ClawRiders\''); assert.match(choice, /<p class="snowtrace-kit-scale">It works when a lot of stake moves: 1 SOL ≈ \$0\.44 of inference a month\.<\/p>/, 'the scale, plainly');
  const said = choice.replace(/<!--[\s\S]*?-->/g, ' ');
  assert.doesNotMatch(said, /USDC|\$30\b|Claim your presence|Later, and capped|will be sold|10% of|runs for 7 days|Not mint\b/, 'staking only: no ticket, no sale, no mint\'s days');
  // THE TOKENS IN HIS WORDS (his 19:12:48 UTC: "$WARM is liquid upfront qnd is what the futarchy runs decisions on * $POOL is liquid only after 5 years to
  // who staked the most"): the futarchy runs on $WARM; $POOL is the stakers', liquid after five years; nothing of a sale on the page, its comments included
  // PROMPT-TO-MINE (his 20:55:59 UTC: "make fucking enourmous attention strategically to how memetic can "Prompt-to-Mine" can be... imagine like mining the
  // supply with rebates dude..."; 20:56:41: "it's like proof of work distribution dude"; 21:02:32 "Halve by date"; 21:04:16 "Every 6 months"): $WARM's
  // line names it, 1 mined per $1 burned, halving every six months. THE DOOR OPENS WITH THE POOL (lane/the-door-opens-with-the-pool): its door to buy
  // $WARM stands in its title, shut and with no address until the pool trades (warm-door.test.mjs)
  assert.match(said, /<dt>\$WARM <span>on chain: SWARM<\/span><a class="snowtrace-warm-door" data-warm-door target="_blank" rel="noopener" aria-label="Buy \$WARM" hidden>Buy \$WARM ↗<\/a><\/dt><dd>Prompt-to-mine: every \$1 your Swarmy burns in the Space Router mines 1 \$WARM, halving every six months\. Liquid from day one; the swarm's futarchy runs on it\.<\/dd>/, '$WARM: prompt-to-mine, its halving, liquid upfront, the futarchy on it');
  assert.match(said, /<dt>\$POOL <span>on chain: SPOOL<\/span><\/dt><dd>For the believers who give their SOL's light to Space Router\. Liquid after five years, to whoever staked the most\.<\/dd>/, '$POOL: the believers\', who give their SOL\'s light to Space Router, liquid after five years, to who staked the most'); assert.doesNotMatch(choice, /\bsale\b|\bsold\b|\bsell\b|14 days|seed (?:its |the )?liquidity/i, 'nothing of a sale on the page: none of it is built, and he gave no word for the page');
  // THE WINDOW COUNTS DOWN (lane/the-window-counts-down; his Oct 30 2026 03:58:31 UTC click "Show the countdown"): the window's line is shown at the offer's
  // footer (the paywall writes $WARM's days there, at the load and at the stop), the free line hidden until the free way is pressed
  assert.match(said, /<footer class="snowtrace-offer-footer"><p class="dl-paywall-choice-line"><span data-mint-line><\/span><span data-free-line hidden>/, 'the window\'s line shown, the free line hidden');
  // YOUR HANDS ARE THE WAVE (his Oct 29 2026 16:16 UTC: "the core is ... dualsense broadcast across devices"): the kit opens on his hands and his codes
  assert.match(choice, /<ul><li><b>Your hands:<\/b> your DualSense\. One wave, every screen\.<\/li><li><b>Your spells:<\/b> hold L2 and R2, then ↓✕ ←◯ ↑△ →□\.<\/li>/);
  // THE PATH TO THE KIT (his Oct 29 2026 16:2x UTC: "too much text too little pathos"; "optimize for MMO vibes and bringing this fucking lyssajudron with you"):
  // the page reads the hero, the offer and its kit, then the rest; the offer in two lines; the kit's lines a name and a few words; her slot opens the kit
  const at = (s) => { const i = html.indexOf(s); assert.ok(i > 0, s); return i; }, kit = at('class="snowtrace-tier snowtrace-kit"');
  assert.ok(at('id="harmony-doors"') < at('id="mint"') && kit < at('id="rite"') && kit < at('id="oath-response"'), 'the offer and its kit before the swarm and the ceremony'); assert.ok(kit < at('class="snowtrace-path"') && kit < at('class="snowtrace-tokens"') && at('class="snowtrace-path"') < at('id="rite"'), 'Snowtrace\'s three steps and the tokens\' small print under the kit'); assert.ok(at('id="oath-response"') < at('id="purpose"'), 'the governance film keeps its place after the ceremony');
  // HIS NAME AND THE OATH OFF THE MINT (his Nov 7 2026 "Take both off"): the served page carries neither, rendered or commented out
  assert.ok(!/Meridio|Custodio|I am a trace|id="quantum-roma"|id="iuramentum"|IURAMENTUM/.test(html), 'no lore name and no oath in what the site serves');
  const words = (s) => s.replace(/<!--[\s\S]*?-->/g, ' ').replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean);
  const head = /<header class="snowtrace-offer-heading">([\s\S]*?)<\/header>/.exec(choice)[1], why = /<p class="snowtrace-offer-why">([\s\S]*?)<\/p>/.exec(head);
  const heading = words(head.replace(why?.[0] ?? '', ''));
  assert.ok(heading.length <= 16, `the offer in two lines, few words (its eyebrow with them): ${heading.join(' ')}`);
  // WHY OUR ROUTER (his Oct 29 2026 ~17:3x UTC: "why would you use any other router? because if you use our router you are helping to get open source shit
  // going like the 3d anamorphic shit we did here"): the answer in one short line under the router's, the work named, linked only to its public code
  assert.ok(why && words(why[1]).length <= 18, `why our router, in one short line: ${why && words(why[1]).join(' ')}`); assert.match(why[1], /^Why our router\? /); assert.match(why[1], /open source/); assert.deepEqual([...why[1].matchAll(/href="([^"]+)"/g)].map((m) => m[1]), ['https://github.com/Extrinsic-Cognition/monorepo'], 'linked to the public code, as the doors to Harmony are'); assert.doesNotMatch(html, /docs\.extrinsiccognition\.com/, 'his docs behind a sign-in: never linked, never named by address on the public page, its comments included');
  for (const li of choice.match(/<li><b>[^<]+<\/b>[^<]*<\/li>/g)) assert.ok(li.replace(/<b>[^<]+<\/b>/, '').replace(/<[^>]+>/g, '').trim().split(/\s+/).length <= 10, `a kit line is a name and a few words: ${li}`);
  assert.match(choice, /<article class="snowtrace-tier snowtrace-kit"><figure class="snowtrace-kit-her"><button type="button" id="her-door" aria-label="Paint your Lyssajudron"><img data-kit-her alt="" hidden>/,
    'the kit opens on her slot: the door to her making, her picture in it once she is made (dl-her-colours.js KIT_HER)');
  assert.equal((html.match(/id="her-door"/g) || []).length, 1, 'one door to her making, in the kit'); assert.match(choice, /<button type="button" class="dl-paywall-gold" data-kit disabled>Stake your SOL<\/button><span class="snowtrace-kit-state">Paused<\/span>/, 'its door paused until the stake pool exists'); assert.doesNotMatch(choice, /\$10\b|\$1,000/, 'no range'); assert.match(choice, /data-paywall-not aria-pressed="false"/); assert.match(choice, /data-law="open"/); assert.doesNotMatch(choice, /yield|profit|apprecia|worth|\$WARM (?:for|at) \$/i);
});

test('the editorial offer stays readable before the film cut, never docks, and hides for a verified holder', async () => {
  const w = world(); w.choice.dataset.layout = 'editorial';
  const wall = w.make();
  assert.equal(w.choice.hidden, false, 'reading the introduction must not require playing the film');
  for (const n of [0, 886, 1006, 1096, HOLD_FRAME]) wall.at(frameAt(n));
  assert.equal(wall.holds(), true); assert.deepEqual(w.choice.pieces.map(p => p.animations.length), [0, 0, 0, 0, 0], 'no floating pieces');
  const h = world({storage: new Storage(KEPT), answer: {orders: [receipt({tier: 'gold'})]}});
  h.choice.dataset.layout = 'editorial';
  const holder = h.make(); await tick(); await tick();
  assert.equal(holder.state().state, 'open'); assert.equal(h.choice.hidden, true, 'a verified holder is not sold the same access again');
});

// THE LAW's words on the choice (tracenet-register.mjs: his to move, the page's words move with them)
test('the choice says the law\'s days: the register\'s constants write every [data-law] piece, and the page carries them as written', () => {
  assert.deepEqual([GOLD_DAYS, BRONZE_DAYS, OPEN_DAYS], [0, 15, 15]); assert.deepEqual({...LAW_WORDS}, {gold: 'now', bronze: 'on day 15', open: 'on day 15'}); assert.equal(whenText(1), 'on day 1'); assert.equal(whenText(30), 'on day 30');
  const piece = (law, textContent) => ({dataset: {law}, textContent});
  const pieces = [piece('gold', 'later'), piece('bronze', 'on day 7'), piece('open', ''), piece('platinum', 'kept')];
  paintLaw({querySelectorAll: (s) => (s === '[data-law]' ? pieces : [])});
  assert.deepEqual(pieces.map((p) => p.textContent), ['now', 'on day 15', 'on day 15', 'kept'], 'a word the law does not name stays as written');
  paintLaw(null); paintLaw({});
  // the wall writes them at its making
  const w = world(), law = [piece('bronze', 'on day 9')];
  w.choice.querySelectorAll = ((all) => (s) => (s === '[data-law]' ? law : all(s)))(w.choice.querySelectorAll);
  w.make();
  assert.equal(law[0].textContent, 'on day 15');
  // the page carries the law's words as the script writes them (nothing else shows first), and the mint's days are one constant, here
  const html = readFileSync(here('./warm.html'), 'utf8'), stage = html.slice(html.indexOf('<section class="dl-paywall-choice"'), html.indexOf('<a class="snowtrace-browse"'));
  const written = [...stage.matchAll(/data-law="(\w+)">([^<]*)</g)].map((m) => m.slice(1));
  assert.deepEqual(written.map(([tier]) => tier), ['open', 'open'], 'the starter kit carries no seat\'s day; the free way says the open day');
  for (const [tier, words] of written) assert.equal(words, LAW_WORDS[tier], tier);
  for (const f of ['./tracenet.js', './tracenet-register.mjs', './dl-twelve.js', '../worker/tracenet-vault.mjs', '../tools/tracenet-publish.mjs', '../tools/build-optimism-fit.mjs', './dl-paywall.js']) {
    const src = readFileSync(here(f), 'utf8');
    if (f !== './dl-paywall.js') assert.doesNotMatch(src, /MINT_DAYS\s*=/, `${f} defines no second mint`);
    assert.doesNotMatch(src.replace(/\/\/.*$/gm, ''), /EXCLUSIVE_DAYS/, `${f}: the old name is read nowhere`);
  }
});

// A separate public bundle must still follow Harmony's source palette, including later :root overrides.
test('the public mint keeps DysonLight Harmony ice and accent tokens', () => {
  const tokens = source => Object.fromEntries([...source.matchAll(/--([\w-]+)\s*:\s*([^;}]+)/g)].map(m => [m[1], m[2].trim()]));
  const ice = readFileSync(here('../../harmony-ice.css'), 'utf8');
  const roots = [...ice.matchAll(/:root\s*\{([^}]+)\}/g)].map(m => m[1]).join('\n');
  const palette = tokens(roots);
  const accent = tokens(readFileSync(here('../../harmony-accent.css'), 'utf8'));
  const hand = tokens(readFileSync(here('../../harmony-ice.hand.css'), 'utf8'));
  const mint = tokens(readFileSync(here('./dl-paywall.css'), 'utf8'));
  for (const name of ['stone', 'panel', 'panel2', 'ink', 'ink2', 'line']) {
    assert.equal(mint[`dl-${name}`], palette[name], `Harmony's effective ${name}`);
  }
  for (const [ours, theirs] of [['accent', 'harmony-orange'], ['accent-edge', 'harmony-orange-edge'], ['accent-light', 'harmony-orange-ink']]) {
    assert.equal(mint[`dl-${ours}`], accent[theirs], `Harmony's ${theirs}`);
  }
  assert.equal(mint['dl-accent-ink'], hand['ice-ink']);
});


test('THE ANIME NEVER STOPS: with stopsFilm false the offer stands over the moving film at frame 1380, never a pause or a seek', () => {
  const w = world(), wall = createPaywall({film: w.film, song: w.song, sphere: w.sphere, choice: w.choice, onChange: () => {}, fetcher: async () => ({ok: false}),
    storage: new Storage(), now: () => w.clock.now, events: w.events, doc: w.doc, stopsFilm: false});
  const paused = w.film.paused, songPaused = w.song.paused;
  w.film.t = HOLD_S; w.song.t = HOLD_S + 0.02;
  assert.equal(wall.at(frameAt(HOLD_FRAME)), false, 'the frame of the wall is drawn and the film goes on'); assert.equal(wall.holds(), false); assert.equal(w.film.paused, paused, 'the film is not paused'); assert.equal(w.song.paused, songPaused, 'nor the song'); assert.equal(w.film.currentTime, HOLD_S, 'nothing sought'); assert.deepEqual(w.song.seeks, []); assert.equal(wall.state().state, 'passed'); assert.equal(w.choice.hidden, false, 'the offer stands'); assert.deepEqual(w.film.seeks, []); assert.equal(wall.at(frameAt(HOLD_FRAME + 30)), false, 'and past it');
});

test('cinematic hold freezes only the picture; return leaves the mint offer and receipts unchanged', async () => {
  const w = world({continuousSound: true}), wall = w.make();
  w.film.t = HOLD_S; w.song.t = HOLD_S + 0.02;
  assert.equal(wall.at(frameAt(HOLD_FRAME)), true); assert.equal(w.film.paused, true); assert.equal(w.song.paused, false, 'original soundtrack keeps playing'); assert.deepEqual(w.song.seeks, [], 'hold never resets the song');
  w.song.t = HOLD_S + 8.6;
  assert.equal(wall.releasePicture(), true); assert.equal(wall.releasePicture(), false, 'return is idempotent'); assert.equal(wall.holds(), false); assert.equal(wall.at(w.song.t), false);
  w.film.currentTime = w.song.t;
  await tick();
  assert.equal(w.film.currentTime, w.song.t, 'handoff is not clamped back to the freeze'); assert.equal(w.choice.hidden, false, 'the unpaid offer stays available'); assert.equal(wall.state().state, 'held'); assert.equal(wall.state().opened, null); assert.equal(wall.state().receipts, 0); assert.deepEqual(w.asked, []); assert.deepEqual(w.song.seeks, []);
  w.film.currentTime = 20;
  await tick();
  assert.equal(wall.state().state, 'watch', 'an explicit backward seek rearms the introduction'); assert.equal(wall.state().pictureReleased, false);
  w.film.t = HOLD_S; wall.at(frameAt(HOLD_FRAME));
  assert.equal(wall.holds(), true);
});

test('a static hold cannot be opened by the cinematic presentation method', () => {
  const w = world(), wall = w.make();
  w.film.t = HOLD_S; wall.at(frameAt(HOLD_FRAME));
  assert.equal(wall.releasePicture(), false); assert.equal(wall.holds(), true);
});

// THE FREEZE ON THE DRAWN ARROW (his Oct 21 2026 WEST: "on the moment of the arrow fully drawn we will "freeze" the page until the mint has
// happened"; "until oct 30th 11:59", moved to Breakpoint by his Oct 29 2026 19:39 UTC "Yes, until Breakpoint", and to its opening by his 23:46:40
// "End at Nov 15"): the same wall at his full draw, standing until the mint closes
test('THE FREEZE ON THE DRAWN ARROW: a visitor plays past the golden flash to frame 3616, THE CLIMAX, and is held there while the mint is open', async () => {
  assert.equal(DRAWN_FRAME, 3616, 'the bow at its full bend overhead, just before unleashing');
  assert.equal(closesMs(MINT_CLOSES), Date.UTC(2026, 10, 18), 'as Breakpoint\'s last day ends (his Nov 11 2026 "Yes, through Nov 17"): Nov 18, 00:00 in London, which is UTC in November'); assert.equal(SET_CLOSE, null, 'REOPENED (his Nov 19 2026 "Yes, reopen it"): the house sets no close'); assert.equal(closesMs(SET_CLOSE), null); for (const day of [Date.UTC(2026, 10, 19), Date.UTC(2027, 0, 1)]) { assert.equal(exclusive(day, LAUNCH_DAY, SET_CLOSE), true, 'no close and no launch day: held, whatever the day'); assert.equal(mintState(day, LAUNCH_DAY, SET_CLOSE).phase, 'unset'); assert.equal(world({hold: DRAWN_FRAME, closes: SET_CLOSE, now: day}).make().at(frameAt(DRAWN_FRAME)), true, 'so the film stops on his full draw for everyone without a seat'); }
  const w = world({hold: DRAWN_FRAME, closes: MINT_CLOSES, now: Date.UTC(2026, 9, 21, 18)}), wall = w.make();
  for (const n of [0, HOLD_FRAME, HOLD_FRAME + 1, 3000, DRAWN_FRAME - 1]) assert.equal(wall.at(frameAt(n)), false, `frame ${n} plays`);
  w.film.t = frameAt(DRAWN_FRAME) + 0.01; w.song.t = w.film.t;
  assert.equal(wall.at(frameAt(DRAWN_FRAME)), true, 'his full draw is the last frame'); assert.equal(w.film.paused, true); assert.equal(w.song.paused, true); assert.equal(w.sphere.held, true); assert.deepEqual(w.changes, ['held']); assert.deepEqual({hold: wall.state().hold, mint: wall.state().mint, exclusive: wall.state().exclusive}, {hold: DRAWN_FRAME, mint: 'open', exclusive: true}); assert.equal(w.choice.line.textContent, '$WARM \u00b7 28 days left', 'CLEAR THE MINT (lane/clear-the-mint): the window\'s line says $WARM and its days, never the mint');
  w.film.currentTime = frameAt(DRAWN_FRAME + 200); await tick();
  assert.ok(Math.abs(w.film.currentTime - (DRAWN_FRAME + 0.5) * FRAME_S) < 1e-9, 'a seek past it while held: back onto his full draw'); assert.equal(wall.holds(), true);
});

test('THE FREEZE opens for everyone once the mint has closed (at the next cause: a showing of the page, a press of Play); a holder never meets it', () => {
  const close = closesMs(MINT_CLOSES);
  const after = world({hold: DRAWN_FRAME, closes: MINT_CLOSES, now: close}).make();
  assert.equal(after.state().state, 'open'); assert.equal(after.at(frameAt(DRAWN_FRAME)), false); assert.equal(world({hold: DRAWN_FRAME, closes: MINT_CLOSES, review: 'holder'}).make().at(frameAt(DRAWN_FRAME)), false, 'a minter plays on');
  const w = world({hold: DRAWN_FRAME, closes: MINT_CLOSES, now: close - 60000}), wall = w.make();
  assert.equal(wall.at(frameAt(DRAWN_FRAME)), true);
  w.clock.now = close; w.doc.dispatchEvent(new Event('visibilitychange'));
  assert.equal(wall.state().state, 'open'); assert.equal(w.sphere.held, false); assert.deepEqual(w.changes, ['held', 'open']);
  const w2 = world({hold: DRAWN_FRAME, closes: MINT_CLOSES, now: close - 60000}), wall2 = w2.make();
  wall2.at(frameAt(DRAWN_FRAME)); w2.clock.now = close + 1;
  assert.equal(wall2.holds(), false, 'Play pressed after the close: it plays');
  // the law: a close given rules the mint; without one, the launch day's law as it was
  assert.equal(exclusive(close - 1, null, MINT_CLOSES), true); assert.equal(exclusive(close, null, MINT_CLOSES), false); assert.equal(exclusive(close + DAY), true, 'no close given: the launch day unset still holds'); assert.equal(mintState(close - 1, null, MINT_CLOSES).phase, 'open'); assert.equal(mintLine(mintState(close, null, MINT_CLOSES)), '$WARM\'s window is closed.');
  // CLEAR THE MINT (lane/clear-the-mint, his Oct 30 2026 03:21:04 UTC "Yes, clear it"): the film's page (a close given) says $WARM, its last day counting 1;
  // the launch day's law under a close keeps its free day in the window's words; with no close (a tracenet) the launch day's words stand as they were
  assert.equal(mintLine(mintState(close - 1, null, MINT_CLOSES)), '$WARM \u00b7 1 day left'); assert.equal(mintLine(mintState(close - 3 * DAY + 1, null, MINT_CLOSES)), '$WARM \u00b7 3 days left');
  const launch = new Date(close - 10 * DAY).toISOString(), freeAt = Date.parse(launch) + OPEN_DAYS * DAY;   // the code free 5 days after the close
  assert.equal(mintLine(mintState(close, launch, MINT_CLOSES)), `$WARM's window is closed. The code is free from ${new Intl.DateTimeFormat('en', {month: 'long', day: 'numeric'}).format(freeAt)}.`); assert.equal(mintLine(mintState(freeAt, new Date(freeAt - OPEN_DAYS * DAY).toISOString(), new Date(freeAt - 1).toISOString())), '$WARM\'s window is closed. The code is free.');
  for (const t of [close - DAY, close, close + 30 * DAY]) for (const m of [mintState(t, null, MINT_CLOSES), mintState(t, launch, MINT_CLOSES)]) assert.doesNotMatch(mintLine(m), /\bmint/i, 'no mint on the film\'s page');
  assert.match(mintLine(mintState(close, launch)), /^The mint is closed\. The code is free from /, 'a tracenet (no close given): its own words, as they were');
});

// THE STOP HOLDS UNTIL BREAKPOINT OPENS (his Oct 29 2026 19:39 UTC "Yes, until Breakpoint"; 23:46:40 "End at Nov 15"; 23:47:01 "i want it to be over
// once breakpoint is there so people feel FOMO cause they missed the window"): past the old close of Oct 30 the stop still holds, up to Breakpoint's
// opening in London, and by Breakpoint's first morning the window is over
test('THE STOP HOLDS THROUGH BREAKPOINT: past Oct 30 the film still stops on his full draw, through Breakpoint\'s three days, and once they are over it plays on', () => {
  const old = Date.UTC(2026, 9, 30, 23, 59), close = closesMs(MINT_CLOSES);
  for (const [now, why] of [[old, 'the old close'], [old + DAY, 'the day after it'], [Date.UTC(2026, 10, 14, 12), 'the last day before Breakpoint'], [Date.UTC(2026, 10, 15, 9), 'Breakpoint\'s first morning'], [Date.UTC(2026, 10, 17, 21), 'its last evening'], [close - 1, 'its last minute']]) {
    assert.equal(exclusive(now, null, MINT_CLOSES), true, `${why}: held`); assert.equal(world({hold: DRAWN_FRAME, closes: MINT_CLOSES, now}).make().at(frameAt(DRAWN_FRAME)), true, `${why}: the film stops on his full draw`);
  }
  for (const [now, why] of [[close, 'Breakpoint is over'], [Date.UTC(2026, 10, 18, 9), 'the morning after it']]) {
    assert.equal(exclusive(now, null, MINT_CLOSES), false, `${why}: the window is over`); assert.equal(world({hold: DRAWN_FRAME, closes: MINT_CLOSES, now}).make().at(frameAt(DRAWN_FRAME)), false, `${why}: it plays on`);
  }
});

test('his preview looks past THE FREEZE with ?paywall=off on the house\'s own doors; the site itself never', () => {
  const page = (hostname, search) => { const w = {location: {hostname, search}}; w.parent = w; return w; };
  assert.equal(reviewOf(page('mint-lane.localhost', '?debug=off&paywall=off')), 'holder', 'his preview, asked by name');
  for (const host of ['127.0.0.1', 'localhost', '192.168.1.20', '10.0.0.7', 'studio.local']) assert.equal(reviewOf(page(host, '?paywall=off')), 'holder', host);
  assert.equal(reviewOf(page('mint-lane.localhost', '?debug=off')), null, 'his preview as a visitor meets it');
  for (const host of ['optimism.fit', 'poleis.us', 'localhost.evil.com']) assert.equal(reviewOf(page(host, '?paywall=off')), null, host);
});

test('THE MINT WINDOW: one move into the freeze, on the film\'s seconds: the song fades out, the sphere crosses and comes to rest on the drawn arrow', () => {
  const twelve = readFileSync(here('./dl-twelve.js'), 'utf8'), sphere = readFileSync(here('./warm-sphere.js'), 'utf8');
  // the song leaves with the picture: its volume falls to nothing over the last 0.8 s before the drawn arrow when the wall will hold there
  assert.match(twelve, /const FREEZE_S = DRAWN_FRAME \* FRAME_S, FREEZE_FADE = \.8;/);
  // the sphere is told ahead, at each frame the film presents and at each of the wall's changes, whether the wall holds this viewer there
  assert.match(twelve, /const windowAhead = \(\) => \{ const s = wall\.state\(\); return s\.state === 'held' \|\| \(s\.state === 'watch' && s\.exclusive\); \};/); assert.match(twelve, /toWindow\(presented\?\.mediaTime \?\? film\.currentTime\);\s*(\/\/[^\n]*\n\s*)*if \(wall\.at\(/); assert.match(twelve, /sphere\.setMintWindow\?\.\(ahead\);/); assert.match(twelve, /const sync = \(\) => \{\s*showState\(\);\s*sphere\.setMintWindow\?\.\(windowAhead\(\)\);/);
  // the sphere's window lands on the wall's own frame
  assert.equal(Number(/export const MINT_WINDOW = Object\.freeze\(\{from: \d+, frame: (\d+),/.exec(sphere)?.[1]), DRAWN_FRAME);
  // its own second (the turn, the orbits, the rite, the units' spin) is the film's run through mintClockAt; the crossing is the film's own
  assert.match(sphere, /const own = mintClockAt\(seconds, mintMode\);/); assert.match(sphere, /const base = poseAt\(own\), keep = handAt\(own\);/); assert.match(sphere, /orbitTimeAt\(ownNow\(\)\)/); assert.match(sphere, /riteNow = mintMode \? rite\(t => mintClockAt\(t, mintMode\)\) : rite\(\);/); assert.match(sphere, /clock \+= dt \* \(moment === null \? 1 : mintSpeedAt\(momentNow\(\), mintMode\)\);/); assert.match(sphere, /mintNowK = mintCrossAt\(filmNow, mintMode\);/);
  // the anime's circle grown in front of the faces; the satellites faded
  assert.match(sphere, /drawSkin\(shownSkin, center, radius, \{yaw, pitch\}, layout\.slots\);\s*if \(mintNowK > 0\) \{ drawRising\(center, radius, \{yaw, pitch\}\); drawFloating\(center, radius\); drawMintStar\(center, radius, mintNowK\); drawSeatSparks\(center, radius\); \}/, 'the golds rise, then the bronzes float, then his circle and the sparks'); assert.match(sphere, /draw\.alpha = seen \* shown \* satNow;/);
  // his "stop using placeholders for the profiles... you should arrive to the freeze moment with all hexagons unallocated and an empty tank
  // fuel": the illustration's seats empty with the crossing (a confirmed seat stays), so on the stop every hexagon is an opening; no
  // stand-in picture anywhere
  assert.match(sphere, /const kept = held \? \(mode === 'illustration' \? 1 - mintNowK : 1\) : 0, slot = kept > 0 \? held : undefined;/); assert.match(sphere, /const vacantSeat = !pentagon && !slot && !miniature;/); assert.match(sphere, /if \(slot\) \{ ctx\.save\(\); ctx\.globalAlpha \*= kept; ctx\.fill\(\); ctx\.restore\(\); \}/); assert.match(sphere, /ctx\.globalAlpha = alpha \* \.48 \* \(slot \? kept : 1\);/); assert.match(sphere, /ctx\.globalAlpha = alpha \* \.7 \* forming \* kept;/); assert.doesNotMatch(sphere, /pfpIn|pfpMark|tileAt/);
  // the crossing is the film's own, never the page's clock once all has stopped; on the stop only his glow and the flask's liquor live on
  // (his "it cant stop like this... cant you add some shaders for the glow of him?... droplets of liquor in the flask here": dl-mint-flask.js)
  assert.match(sphere, /if \(\(overlayBusy \|\| \(mintNowK > 0 && !reduced && !paused\)\) && inView && !document\.hidden\) frame = requestAnimationFrame\(tick\);/); assert.doesNotMatch(sphere, /mintBusy|mintFrom|MINT\.cross/);
});

test('THE DOOR OPENS WITH THE POOL: the door to buy $WARM is asked at the line\'s causes, once in flight, and opens only on the chain\'s word', async () => {
  const {RPC, DLMM, doorHref} = await import('./warm-door.mjs');
  const pair = 'FfaxTfLjCTwdBCfm5k5GYyzKysJAEmZqZLyt1o7AT3Eg';
  const warmPair = {cluster: 'mainnet', mint: null, pair, opening: '2026-10-30T20:00:00Z', close: '2026-11-15T00:00:00Z'};
  const slice = (s) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(s)); return [b.toString('base64'), 'base64']; };
  const trading = {owner: DLMM, data: slice(Date.parse(warmPair.opening) / 1000), lamports: 1, executable: false};
  const chainSays = (value) => (url) => (url === RPC ? {jsonrpc: '2.0', id: 1, result: {context: {slot: 1}, value}} : null);
  const withDoor = (w) => { const door = {hidden: true}; const q = w.choice.querySelector; w.choice.querySelector = (s) => (s === '[data-warm-door]' ? door : q(s)); return door; };
  const reads = (w) => w.asked.filter((u) => u === RPC).length;
  const stop = (DRAWN_FRAME + 1) * FRAME_S;
  // before the opening: nothing is asked, the door stays shut, the stop asks nothing either
  const early = world({now: Date.parse('2026-10-30T12:00:00Z'), answer: chainSays(trading), hold: DRAWN_FRAME, closes: MINT_CLOSES, warmPair});
  const earlyDoor = withDoor(early), earlyWall = early.make();
  await tick(); earlyWall.at(stop); await tick();
  assert.equal(reads(early), 0); assert.equal(earlyDoor.hidden, true); assert.equal(earlyDoor.href, undefined);
  // after the opening, the pool trading: one read at the making, and the door opens on the pair's page
  const open = world({now: Date.parse('2026-10-31T00:00:00Z'), answer: chainSays(trading), hold: DRAWN_FRAME, closes: MINT_CLOSES, warmPair});
  const openDoor = withDoor(open), openWall = open.make();
  await tick();
  assert.equal(reads(open), 1); assert.equal(openDoor.hidden, false); assert.equal(openDoor.href, doorHref(pair)); assert.equal(openWall.state().door, true);
  openWall.at(stop); await tick();
  assert.equal(reads(open), 1, 'open once: the stop asks nothing more');
  // the pool not on chain: one read at the making, shut; the stop is a cause, it asks once more; nothing at rest
  const none = world({now: Date.parse('2026-10-31T00:00:00Z'), answer: chainSays(null), hold: DRAWN_FRAME, closes: MINT_CLOSES, warmPair});
  const noneDoor = withDoor(none), noneWall = none.make();
  await tick();
  assert.equal(reads(none), 1); assert.equal(noneDoor.hidden, true); assert.equal(noneWall.state().door, false);
  noneWall.at(stop); await tick();
  assert.equal(reads(none), 2); assert.equal(noneDoor.hidden, true);
  await new Promise((r) => setTimeout(r, 30));
  assert.equal(reads(none), 2, 'no read at rest');
  // as committed (the set names no pool): nothing is asked, whatever the day
  const bare = world({now: Date.parse('2026-10-31T00:00:00Z'), answer: chainSays(trading), hold: DRAWN_FRAME, closes: MINT_CLOSES});
  const bareDoor = withDoor(bare); bare.make(); await tick();
  assert.equal(reads(bare), 0); assert.equal(bareDoor.hidden, true);
  // a page without the door (a tracenet's) asks nothing
  const tn = world({now: Date.parse('2026-10-31T00:00:00Z'), answer: chainSays(trading), hold: DRAWN_FRAME, closes: MINT_CLOSES, warmPair});
  tn.make(); await tick();
  assert.equal(reads(tn), 0);
});

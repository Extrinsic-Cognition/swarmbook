// dl-mint-pour.test.mjs: THE SPEED OF LIGHT (his Oct 28 2026: "the spotlight has to be on the flask because ideally we show the flask gettting filled at
// the speed of light with latest solana stuff"): while the wall holds the stop and the page is seen, one socket listens for the transactions that name the
// mint's wallet and every notice reads the seats at once; the poll stays the floor. node --test dl-mint-pour.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { WS, subscribeMessage, isNotice, mountMintPour } from './dl-mint-pour.js';
import { RECIPIENT } from './dl-direct-protocol.mjs';

test('the request and the notice: logsSubscribe on the recipient at confirmed; a logs notification that did not fail', () => {
  assert.deepEqual(WS, ['wss://solana-rpc.publicnode.com'], 'NO SOCKET THAT REFUSES A BROWSER (Nov 12 2026): api.mainnet-beta answers a page\'s handshake 403, so no page opens it');
  assert.deepEqual(JSON.parse(subscribeMessage()), { jsonrpc: '2.0', id: 1, method: 'logsSubscribe', params: [{ mentions: [RECIPIENT] }, { commitment: 'confirmed' }] });
  const notice = (err) => JSON.stringify({ jsonrpc: '2.0', method: 'logsNotification', params: { result: { context: { slot: 1 }, value: { signature: 's', err, logs: [] } }, subscription: 7 } });
  assert.equal(isNotice(notice(null)), true); assert.equal(isNotice(notice({ InstructionError: [0, 'x'] })), false, 'a failed transaction is no seat');
  assert.equal(isNotice('{"jsonrpc":"2.0","result":7,"id":1}'), false, 'the subscription\'s own answer'); assert.equal(isNotice('nope'), false);
});

test('the socket: opened on her entrance at the stop, the request sent on open, a notice reads the seats at once, closed when the page is hidden', async () => {
  const docListeners = new Map(), winListeners = new Map(), sockets = [], reads = [];
  class FakeSocket { constructor(url) { this.url = url; this.sent = []; this.closed = false; sockets.push(this); } send(m) { this.sent.push(m); } close() { this.closed = true; } }
  let held = false, hidden = false, intervals = 0;
  const doc = { get hidden() { return hidden; }, addEventListener: (t, f) => docListeners.set(t, f) };
  const win = { location: { hostname: 'optimism.fit', search: '' }, WebSocket: FakeSocket, addEventListener: (t, f) => winListeners.set(t, f),
    setInterval: () => ++intervals, dlTwelve: { state: () => ({ paywall: { state: held ? 'held' : 'watch' } }) } };
  const fetcher = async (url, opts) => { const body = JSON.parse(opts.body); reads.push(Array.isArray(body) ? 'tx' : body.method); return { ok: true, json: async () => (Array.isArray(body) ? [] : { jsonrpc: '2.0', id: 1, result: [] }) }; };
  const pour = mountMintPour({ win, doc, fetcher, live: () => ({ close() {} }) });
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(sockets.length, 0, 'no socket before the stop'); assert.equal(reads.length, 1, 'one read at the load');
  docListeners.get('dl-athena')({ detail: { type: 'entered' } }); assert.equal(sockets.length, 0, 'her entrance before the wall holds: still none');
  held = true; docListeners.get('dl-athena')({ detail: { type: 'entered' } });
  assert.equal(sockets.length, 1); assert.equal(sockets[0].url, WS[0]);
  sockets[0].onopen(); assert.deepEqual(sockets[0].sent, [subscribeMessage()]);
  docListeners.get('dl-athena')({ detail: { type: 'landed' } }); assert.equal(sockets.length, 1, 'one socket, never two');
  sockets[0].onmessage({ data: JSON.stringify({ jsonrpc: '2.0', method: 'logsNotification', params: { result: { value: { err: null } } } }) });
  await new Promise((r) => setTimeout(r, 10));
  assert.equal(reads.length, 2, 'a notice reads the seats at once'); assert.equal(pour.state().heard, 1);
  hidden = true; docListeners.get('visibilitychange')(); assert.equal(sockets[0].closed, true, 'hidden: closed'); assert.equal(pour.state().socket, null);
  hidden = false; docListeners.get('visibilitychange')(); assert.equal(sockets.length, 2, 'seen again on the stop: opened again'); assert.equal(sockets[1].url, WS[0], 'the one provider that answers a browser, again');
  sockets[1].onclose(); assert.equal(pour.state().socket, null, 'a socket that drops is let go; the poll\'s next turn opens another');
});
test('THE HOUSE SAYS IT AT ONCE: the door\'s socket at the load; a pushed mint falls into the flask at once, a gap or an opening reads the list, nothing before the terms', async () => {
  const lives = [], gets = [], winL = new Map(), list = [1, 2, 3].map((n) => ({ n, signature: `s${n}`, tier: 'bronze', at_ms: n })), tick = () => new Promise((r) => setTimeout(r, 10));
  const win = { location: { hostname: 'optimism.fit', search: '' }, addEventListener: (t, f) => winL.set(t, f), setInterval: () => 0, dlTwelve: { state: () => ({ paywall: { state: 'watch' } }) } };
  const fetcher = async (url, o) => { if (String(url).startsWith('/space-router/v1/drops')) { const after = Number(new URL(url, 'https://x').searchParams.get('after')); gets.push(after); return { ok: true, json: async () => ({ drops: list.filter((d) => d.n > after) }) }; } const b = JSON.parse(o.body); return { ok: true, json: async () => (Array.isArray(b) ? [] : { jsonrpc: '2.0', id: 1, result: [] }) }; };
  const pour = mountMintPour({ win, doc: { hidden: false, addEventListener() {} }, fetcher, live: (o) => (lives.push(o), { close() {} }) });
  assert.equal(lives.length, 1, 'one socket to the door, at the load'); lives[0].onDrops([list[0]]); assert.equal(pour.state().deposits, null, 'before the terms, nothing');
  winL.get('dl-deposit-terms')({ detail: {} }); await tick(); assert.deepEqual([pour.state().deposits, pour.state().after], [3, 3]);
  list.push({ n: 4, signature: 's4', tier: 'gold', at_ms: 4 }); lives[0].onDrops([list[3]]); assert.equal(pour.state().deposits, 4, 'the pushed mint is in the flask at once'); assert.deepEqual(gets, [0], 'with no read');
  list.push({ n: 5, signature: 's5', tier: 'bronze', at_ms: 5 }, { n: 6, signature: 's6', tier: 'bronze', at_ms: 6 }); lives[0].onDrops([list[5]]); await tick(); assert.deepEqual([gets.at(-1), pour.state().deposits], [4, 6], 'a gap: the list read from where it stands');
  lives[0].onOpen(); await tick(); assert.equal(gets.at(-1), 6, 'an opening reads what was missed');
});
test('HER SPHERE WEARS THE RIDERS (his Nov 24 2026 19:18:38 UTC "the claw-rider is a hexagon of a lyssajudron on the unit0 of the meta swarm"): after the minted hexagons, the claw riders the drops door names, numbered on from them, the front\'s one fold', async () => {
  const winL = new Map(), pours = [], tick = () => new Promise((r) => setTimeout(r, 10)), answers = [{ drops: [{ n: 1, signature: 'box-1', tier: 'bronze', at_ms: 1 }], riders: ['rider-1', 'rider-2', 'nobody'] }, { drops: [{ n: 2, signature: 'box-2', tier: 'gold', at_ms: 2 }] }], again = async () => { winL.get('dl-deposit-terms')({ detail: {} }); await tick(); };
  const win = { location: { hostname: 'box.room', search: '' }, addEventListener: (t, f) => winL.set(t, f), setInterval: () => 0, genesisSphere: { setPour: (l) => pours.push(l.map((s) => `${s.signature}:${s.slot}`)) } }, fetcher = async (url, o) => ({ ok: true, json: async () => (String(url).startsWith('/space-router/v1/drops') ? answers.shift() : Array.isArray(JSON.parse(o.body)) ? [] : { jsonrpc: '2.0', id: 1, result: [] }) });
  const pour = mountMintPour({ win, doc: { hidden: false, addEventListener() {} }, fetcher, ticks: false }); await again(); assert.deepEqual([pours.at(-1), pour.state().riders], [['box-1:1', 'rider-1:2', 'rider-2:3'], 2], 'the minted first, then the riders the door names; a name that is no rider\'s passed over');
  await again(); assert.deepEqual(pours.at(-1), ['box-1:1', 'box-2:2', 'rider-1:3', 'rider-2:4'], 'a new mint stands before them and they are numbered on; an answer that names no riders keeps them');
});

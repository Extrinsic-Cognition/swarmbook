// dl-drops-live.test.mjs · THE HOUSE SAYS IT AT ONCE, the page's half: one socket to the door's LIVE_PATH while the page is shown, the lists it says handed on
// ('pong' and noise passed over), a ping while open, a socket that drops opened again (1, 2, 5 s...), none while hidden or closed. node --test app/dl-drops-live.test.mjs
import test from 'node:test'; import assert from 'node:assert/strict';
import { liveDrops, freshOf, LIVE_PATH, PING_MS, AGAIN_MS } from './dl-drops-live.mjs';

test('freshOf: the well-formed rows past where the page stands, in order', () => {
  assert.deepEqual(freshOf([{ n: 3, signature: 'c' }, { n: 1, signature: 'a' }, { n: 2, signature: 'b' }, { n: 4 }, { n: '5', signature: 'e' }, null], 1).map((d) => d.n), [2, 3]); assert.deepEqual(freshOf(null, 0), []);
});
test('one socket while shown: on the door\'s own name, its lists handed on, a ping while open, opened again after a drop, shut while hidden and after close()', () => {
  const sockets = [], timers = [], beats = [], listeners = {}, got = []; let hidden = false, opens = 0;
  class Fake { constructor(url) { this.url = url; this.sent = []; sockets.push(this); } send(m) { this.sent.push(m); } close() { this.onclose?.(); } }
  const win = { WebSocket: Fake, location: { protocol: 'https:', host: 'swarmbook.com' }, setTimeout: (f, ms) => timers.push([f, ms]), clearTimeout() {}, setInterval: (f, ms) => beats.push([f, ms]), clearInterval() {} };
  const live = liveDrops({ win, doc: { get hidden() { return hidden; }, addEventListener: (t, f) => (listeners[t] = f) }, onDrops: (r) => got.push(r), onOpen: () => opens++ });
  assert.equal(sockets.length, 1); assert.equal(sockets[0].url, `wss://swarmbook.com${LIVE_PATH}`);
  sockets[0].onopen(); assert.equal(opens, 1, 'an opening reads what was missed'); assert.deepEqual(beats.map((b) => b[1]), [PING_MS]); beats[0][0](); assert.deepEqual(sockets[0].sent, ['ping']);
  for (const data of ['{"drops":[{"n":1,"signature":"a"}]}', 'pong', '{"other":1}']) sockets[0].onmessage({ data }); assert.deepEqual(got, [[{ n: 1, signature: 'a' }]], 'only a list is handed on');
  sockets[0].onclose(); timers[0][0](); sockets[1].onclose(); timers[1][0](); sockets[2].onclose(); assert.deepEqual(timers.map((t) => t[1]), AGAIN_MS.slice(0, 3), 'a drop: opened again after 1, 2, 5 s');
  hidden = true; listeners.visibilitychange(); timers[2][0](); assert.equal(sockets.length, 3, 'hidden: none opened');
  hidden = false; listeners.visibilitychange(); assert.equal(sockets.length, 4, 'shown again: opened at once'); sockets[3].onopen(); assert.equal(opens, 2);
  live.close(); assert.equal(timers.length, 3, 'closed for good: nothing opened again');
});

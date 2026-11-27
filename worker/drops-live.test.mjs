// drops-live.test.mjs · THE HOUSE SAYS IT AT ONCE, the door's half: the hall says what the Worker hands it to every open socket (a gone one passed over) and refuses
// a page that is not a socket; liveDoor hands a page to the one hall, or is not here without one; sayDrop says the list's row, nothing without a hall or a row, and
// never throws. node --test embertide-app/ui/intro/dyson-society/worker/drops-live.test.mjs
import test from 'node:test'; import assert from 'node:assert/strict';
import { DropsLive, liveDoor, sayDrop, LIVE_PATH } from './drops-live.mjs';

test('the hall, its door and the say', async () => {
  const got = [], open = (i) => ({ send: (m) => got.push([i, JSON.parse(m)]) }), hall = new DropsLive({ getWebSockets: () => [open(1), { send() { throw new Error('gone'); } }, open(2)] });
  assert.equal(await (await hall.fetch(new Request('https://hall/say', { method: 'POST', body: '{"drops":[{"n":1}]}' }))).text(), 'said'); assert.deepEqual(got, [[1, { drops: [{ n: 1 }] }], [2, { drops: [{ n: 1 }] }]]);
  for (const method of ['GET', 'POST']) assert.equal((await hall.fetch(new Request(`https://swarmbook.com${LIVE_PATH}`, { method, body: method === 'POST' ? '{}' : undefined }))).status, 426, `a page's ${method} that is not a socket says nothing`);
  const asked = [], row = { n: 7, signature: 'known', tier: 'gold', at_ms: 1 }, DB = { prepare: () => ({ bind: (s) => ({ first: async () => (s === 'known' ? row : null) }) }) };
  const env = { DB, DROPS_LIVE: { idFromName: (n) => (asked.push(n), n), get: () => ({ fetch: async (r, o) => (asked.push([String(r.url ?? r), o?.body ?? null]), new Response('ok')) }) } };
  assert.equal((await liveDoor(new Request(`https://swarmbook.com${LIVE_PATH}`), {})).status, 404, 'no hall bound: not here');
  await liveDoor(new Request(`https://swarmbook.com${LIVE_PATH}`), env); assert.deepEqual(asked.splice(0), ['drops', [`https://swarmbook.com${LIVE_PATH}`, null]], 'a page to the one hall');
  await sayDrop(env, 'known'); assert.deepEqual(asked.splice(0), ['drops', ['https://hall/say', JSON.stringify({ drops: [row] })]], 'the list\'s own row');
  await sayDrop(env, 'unknown'); await sayDrop({ DB }, 'known'); await sayDrop({ ...env, DB: { prepare() { throw new Error('D1 down'); } } }, 'known'); assert.deepEqual(asked, [], 'no row, no hall, D1 down: nothing said, nothing thrown');
});

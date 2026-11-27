import test from 'node:test';
import assert from 'node:assert/strict';
import {mountMintChairs} from './dl-mint-chairs.mjs';

// a page as the reader meets it: a window and a document that dispatch events, and a fetch that answers by hand
function page() {
  const win = new EventTarget(), doc = new EventTarget(), asked = [];
  doc.defaultView = win; doc.hidden = false;
  let answer = () => ({ok: true, json: async () => ({phase: 'open', rule: 'sum', shows: 'gold', held: [{rank: 1, usd: 1000}]})});
  const fetcher = (url, options) => { asked.push({url, options}); return Promise.resolve(answer()); };
  return {win, doc, asked, fetcher, answer: fn => { answer = fn; }};
}
const settle = () => new Promise(resolve => setImmediate(resolve));

test('one read at the load, held chairs as ranks and dollars, and no timer of its own', async () => {
  const {win, doc, asked, fetcher} = page(), seen = [];
  const timers = [globalThis.setTimeout, globalThis.setInterval];
  globalThis.setInterval = () => { throw new Error('the reader polls'); };
  try {
    const chairs = mountMintChairs({doc, win, fetcher});
    chairs.listen(value => seen.push(value));
    await chairs.ready; await settle();
    assert.equal(asked.length, 1); assert.equal(asked[0].url, '/api/premint/chairs'); assert.equal(asked[0].options.cache, 'no-store');
    assert.deepEqual(chairs.state(), {status: 'live', phase: 'open', rule: 'sum', shows: 'gold', held: [{rank: 1, usd: 1000}]});
    assert.deepEqual(seen.map(s => s.status), ['connecting', 'live']);
    chairs.destroy();
  } finally { [globalThis.setTimeout, globalThis.setInterval] = timers; }
});

test('a purchase, the page shown again and the network back each read once more; a cause during a read reads once after it', async () => {
  const {win, doc, asked, fetcher} = page();
  const chairs = mountMintChairs({doc, win, fetcher});
  await chairs.ready; await settle();
  win.dispatchEvent(new Event('dl-premint-paid')); await settle(); await settle();
  assert.equal(asked.length, 2);
  doc.hidden = true; doc.dispatchEvent(new Event('visibilitychange')); win.dispatchEvent(new Event('online')); await settle();
  assert.equal(asked.length, 2, 'a hidden page asks nothing');
  doc.hidden = false; doc.dispatchEvent(new Event('visibilitychange')); await settle(); await settle();
  assert.equal(asked.length, 3);
  // two purchases said while one read is out: one more read, not two
  let release;
  const slow = new Promise(resolve => { release = resolve; });
  const before = asked.length;
  const reading = mountMintChairs({doc, win, fetcher: (...request) => { asked.push(request); return slow; }});
  win.dispatchEvent(new Event('dl-premint-paid')); win.dispatchEvent(new Event('dl-premint-paid'));
  release({ok: true, json: async () => ({phase: 'open', held: []})});
  await reading.ready; await settle(); await settle(); await settle();
  // the first reader (fast) read twice more, the slow one read at its load and once after it
  assert.equal(asked.length - before, 4);
  chairs.destroy(); reading.destroy();
  win.dispatchEvent(new Event('dl-premint-paid')); doc.dispatchEvent(new Event('visibilitychange')); await settle();
  assert.equal(asked.length - before, 4, 'nothing reads after destroy');
});

test('unreadable is unknown and holds no chair; an outage after an answer keeps the chairs it had', async () => {
  const {win, doc, fetcher, answer} = page();
  answer(() => ({ok: true, json: async () => ({held: 'all'})}));
  const odd = mountMintChairs({doc, win, fetcher});
  await odd.ready;
  assert.deepEqual(odd.state(), {status: 'unknown', held: []});
  odd.destroy();
  answer(() => ({ok: false, status: 404, json: async () => ({})}));
  const missing = mountMintChairs({doc, win, fetcher});
  await missing.ready;
  assert.deepEqual(missing.state(), {status: 'unknown', held: []});
  missing.destroy();
  answer(() => ({ok: true, json: async () => ({phase: 'open', held: [{rank: 1, usd: 10}, {rank: 2, usd: 10}]})}));
  const live = mountMintChairs({doc, win, fetcher});
  await live.ready;
  answer(() => { throw new Error('offline'); });
  await live.refresh();
  assert.equal(live.state().status, 'live'); assert.equal(live.state().held.length, 2);
  live.destroy();
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { FUEL_REF, readFuel, readBite, watchFuel } from './tracenet-fuel.mjs';

const owner = { handle: 'photons_enjoyor', hostname: '127.0.0.1' };
const purse = level => ({ schema: 'embertide.purse/v1', level });
const envelope = (rev, value) => ({ name: FUEL_REF, ref: { rev, value } });
const entry = (rev, value, name = FUEL_REF) => ({ type: 'ref', payload: { name, rev, value } });
const answer = (url, body) => ({ ok: true, url, json: async () => body });

test('fuel is only a finite canonical fraction, with unknown distinct from zero', () => {
  assert.equal(readFuel(purse(.42)), .42);
  assert.equal(readFuel(purse(-1)), 0); assert.equal(readFuel(purse(2)), 1);
  for (const value of [null, {}, { schema: 'other', level: .5 }, ...[null, undefined, NaN, Infinity, '0.5'].map(purse)])
    assert.equal(readFuel(value), null);
  assert.equal(readFuel({ ...purse(.42), posted_usd: 77, reserved_usd: 5, burns: [{ cost_usd: 8 }] }), .42);
  // HIS WORD ON THE TANK (his Oct 16 2026 17:17 WEST, "make it 50% full"): the tank's one law (unit0-liquid.mjs purseLevel), on the Council's laptop too
  assert.equal(readFuel({ ...purse(.7703), his: { level: .5, by: 'Guido', at: '2026-10-16T16:17:32.012Z' } }), .5);
  assert.equal(readFuel({ ...purse(.7703), his: { level: .5, by: 'Guido' } }), .77, 'a word with no instant is no word');
});

test('the piranhas: the first read primes, a fresh burn bites once, a duplicate does not', async () => {
  // readBite's law: priming is silent, each burn's energy is the one law's (biteEnergy), memory stays bounded.
  const old = { schema: 'embertide.purse/v1', level: .8, burns: [{ id: 'old1', at_ms: 1, cost_usd: .5 }] };
  const primed = readBite(old, null);
  assert.equal(primed.energy, 0); assert.ok(primed.seen.has('old1'));
  const sip = { schema: 'embertide.purse/v1', level: .8, burns: [{ id: 'old1', at_ms: 1, cost_usd: .5 }, { id: 'new1', at_ms: 2, cost_usd: .01 }] };
  const bite = readBite(sip, primed.seen);
  assert.equal(bite.energy, .575); assert.ok(bite.seen.has('new1'));
  assert.equal(readBite(sip, bite.seen).energy, 0);
  assert.equal(readBite({ schema: 'wrong', level: .8 }, bite.seen).energy, 0);

  // the watch: a burn smaller than the level's thousandth still thrashes the tank (level unchanged, energy over the wire)
  let stream;
  const calls = [];
  const watcher = watchFuel({ ...owner, onChange: (level, energy) => calls.push([level, energy]),
    join: options => { stream = options; return { close() {} }; },
    fetcher: url => Promise.resolve(answer(url, envelope(4, old))) });
  try {
    await watcher.refresh();
    assert.deepEqual(calls, [[null, 0], [.8, 0]]);                          // the hydration prime is silent
    stream.onEntry(entry(5, { schema: 'embertide.purse/v1', level: .8, burns: [{ id: 'old1', at_ms: 1, cost_usd: .5 }, { id: 'b2', at_ms: 2, cost_usd: .51 }] }));
    assert.deepEqual(calls, [[null, 0], [.8, 0], [.8, .938]]);              // a same-level burn still bites
    stream.onEntry(entry(6, sip));
    assert.deepEqual(calls, [[null, 0], [.8, 0], [.8, .938], [.8, .575]]);
    stream.onEntry(entry(7, sip));
    assert.deepEqual(calls, [[null, 0], [.8, 0], [.8, .938], [.8, .575]]);  // nothing new: no wake
    stream.onEntry(entry(8, { schema: 'embertide.purse/v1', level: .7, burns: sip.burns }));
    assert.deepEqual(calls, [[null, 0], [.8, 0], [.8, .938], [.8, .575], [.7, 0]]);   // a level move alone: no bite
  } finally { watcher.stop(); }
});

test('public pages, other profiles and non-loopback destinations never read or subscribe', async () => {
  const forbidden = () => assert.fail('private Nest accessed');
  for (const args of [{ ...owner, hostname: 'optimism.fit' }, { ...owner, handle: 'someone_else' },
    { ...owner, nestBase: 'https://127.0.0.1:8904' }, { ...owner, nestBase: 'http://example.com' },
    { ...owner, nestBase: 'http://user:pass@127.0.0.1:8904' }, { ...owner, nestBase: 'http://127.0.0.1:8904/other' },
    { ...owner, nestBase: 'http://127.0.0.1:8904/?private=true' }]) {
    const levels = [];
    const watcher = watchFuel({ ...args, fetcher: forbidden, join: forbidden, onChange: level => levels.push(level) });
    await watcher.refresh(); watcher.stop(); watcher.stop();
    assert.deepEqual(levels, [null]);
  }
});

test('stream revisions beat delayed hydration, duplicate levels sleep, and withdrawal stays withdrawn', async () => {
  let stream, release, closed = 0;
  const levels = [], calls = [];
  const watcher = watchFuel({ ...owner, onChange: level => levels.push(level),
    join: options => { stream = options; return { close() { closed++; } }; },
    fetcher: (url, options) => {
      calls.push({ url, options });
      return new Promise(resolve => { release = () => resolve(answer(url, envelope(4, purse(.9)))); });
    },
  });
  try {
    assert.equal(stream.refs, FUEL_REF); assert.equal(stream.types, 'ref');
    const pending = watcher.refresh();
    stream.onEntry(entry(5, purse(.4)));
    release(); await pending;
    assert.deepEqual(levels, [null, .4]);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, `http://127.0.0.1:8904/nest/ref/${FUEL_REF}`);
    assert.equal(calls[0].options.credentials, 'omit'); assert.equal(calls[0].options.redirect, 'error');
    assert.equal(calls[0].options.cache, 'no-store');
    stream.onEntry(entry(6, purse(.4)));
    stream.onEntry(entry(5, purse(.8)));
    stream.onEntry(entry(7, purse(.7), `${FUEL_REF}/private`));
    stream.onEntry(entry(7.1, purse(.7)));
    assert.deepEqual(levels, [null, .4]);
    stream.onEntry(entry(7, null));
    stream.onEntry(entry(6, purse(.9)));
    stream.onEntry(entry(8, purse(0)));
    stream.onEntry(entry(9, { schema: 'wrong', level: 1 }));
    assert.deepEqual(levels, [null, .4, null, 0, null]);
  } finally { watcher.stop(); watcher.stop(); }
  assert.equal(closed, 1);
  stream.onEntry(entry(20, purse(1))); assert.deepEqual(levels, [null, .4, null, 0, null]);
});

test('failed or misdirected reads keep the last confirmed level; reopen and gaps recover', async () => {
  let stream, response, reads = 0;
  const levels = [];
  const watcher = watchFuel({ ...owner, onChange: level => levels.push(level),
    join: options => { stream = options; return { close() {} }; },
    fetcher: async url => { reads++; return response(url); },
  });
  try {
    stream.onEntry(entry(2, purse(.6)));
    for (const failure of [() => { throw new Error('transport'); }, url => ({ ...answer(url, envelope(9, null)), redirected: true }),
      url => answer(`${url}/elsewhere`, envelope(9, null)), url => answer(url, { ...envelope(9, null), name: 'other' })]) {
      response = failure; await watcher.refresh();
      assert.equal(levels.at(-1), .6);
    }
    response = url => answer(url, envelope(10, null));
    stream.onStatus('open'); await watcher.refresh();
    assert.equal(levels.at(-1), null);
    response = url => answer(url, envelope(11, purse(.8)));
    stream.onGap(); await watcher.refresh();
    assert.equal(levels.at(-1), .8); assert.ok(reads >= 6);
  } finally { watcher.stop(); }
});

test('stop aborts hydration and ignores even a transport that resolves after cancellation', async () => {
  let stream, release, readSignal, closed = 0;
  const levels = [], controller = new AbortController();
  const watcher = watchFuel({ ...owner, signal: controller.signal, onChange: level => levels.push(level),
    join: options => { stream = options; return { close() { closed++; } }; },
    fetcher: (url, { signal }) => { readSignal = signal; return new Promise(resolve => { release = () => resolve(answer(url, envelope(9, purse(1)))); }); },
  });
  const pending = watcher.refresh();
  controller.abort(); assert.equal(readSignal.aborted, true); assert.equal(closed, 1);
  release(); await pending;
  stream.onEntry(entry(10, purse(.5))); await watcher.refresh(); watcher.stop();
  assert.deepEqual(levels, [null]); assert.equal(closed, 1);
  watchFuel({ ...owner, signal: controller.signal, onChange: () => assert.fail('aborted notification'),
    fetcher: () => assert.fail('aborted fetch'), join: () => assert.fail('aborted subscription') });
});

test('a bounded hung read aborts and a queued reconnect recovers without a second subscription', async () => {
  let stream, requests = 0, aborted = 0, recover;
  const recovered = new Promise(resolve => { recover = resolve; });
  const watcher = watchFuel({ ...owner, readTimeoutMs: 10,
    join: options => { stream = options; return { close() {} }; },
    onChange: level => { if (level === .7) recover(); },
    fetcher: (url, { signal }) => {
      if (++requests === 1) return new Promise((resolve, reject) => signal.addEventListener('abort', () => {
        aborted++; reject(new Error('timeout'));
      }, { once: true }));
      return Promise.resolve(answer(url, envelope(12, purse(.7))));
    },
  });
  try {
    stream.onStatus('open'); stream.onGap(); await recovered;
    assert.equal(aborted, 1); assert.equal(requests, 2);
  } finally { watcher.stop(); }
});

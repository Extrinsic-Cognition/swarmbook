import test from 'node:test';
import assert from 'node:assert/strict';
import { loadAppearance, readAppearance, watchAppearance } from './tracenet-appearance.mjs';

const F = globalThis.HER_FACE;
const envelope = (name, value) => ({ name, ref: { rev: 4, seq: 8, ts: 20, value } });
const paint = (extra = {}) => envelope(F.PAINT_REF, { schema: F.PAINT_SCHEMA, golem: 'lyssajudron', birth: 'current',
  parts: { base: '#abcdef', coat: '#123456' }, painted: [], ...extra });
const light = (extra = {}) => envelope(F.LIGHT_REF, { schema: F.LIGHT_SCHEMA, golem: 'lyssajudron', birth: 'current', color: '#456abc', ...extra });
const owner = { handle: 'photons_enjoyor', hostname: '127.0.0.1' };

test('unfinished appearance keeps current partial colours and never promotes historical/private fields', () => {
  const out = readAppearance({ paint: paint({ before: { parts: { base: '#000000' } }, by: 'private', secret: 'hidden' }), light: light() });
  assert.equal(out.parts.base, '#ABCDEF'); assert.equal(out.parts.coat, '#123456');
  assert.equal(out.parts.gold, F.BORN_PAINT.gold); assert.equal(out.light, '#456ABC');
  assert.equal(out.gaze, null); assert.equal(out.source, 'local'); assert.equal(out.mintStatus, 'unverified');
  assert.equal(out.attributes.length, 7);
  assert.deepEqual(out.attributes[0], { trait_type: 'Base', value: '#ABCDEF' });
  assert.doesNotMatch(JSON.stringify(out), /private|hidden|before|rarity|wallet/);
});

test('canonical eye forms require opened eyes and invalid colours fall back per part', () => {
  assert.equal(readAppearance({ paint: paint({ gaze: 'star' }) }).gaze, null);
  const out = readAppearance({ paint: paint({ opened: '2026-10-15T00:00:00.000Z', gaze: 'star', parts: { base: 'red', eyes: '#abcdef' } }) });
  assert.equal(out.gaze, 'star'); assert.equal(out.parts.base, F.BORN_PAINT.base); assert.equal(out.parts.eyes, '#ABCDEF');
  assert.deepEqual(out.attributes.at(-1), { trait_type: 'Gaze', value: 'star' });
  assert.equal(readAppearance({ paint: paint({ opened: true, gaze: 'invented' }) }).gaze, null);
});

test('envelopes must match their ref, schema, revision and golem; different births are not combined', () => {
  const born = readAppearance();
  for (const bad of [{ ...paint(), name: F.LIGHT_REF }, paint({ schema: 'other' }), paint({ golem: 'other' }), { ...paint(), ref: { ...paint().ref, rev: 0 } }])
    assert.deepEqual(readAppearance({ paint: bad }), born);
  const mixed = readAppearance({ paint: paint(), light: light({ birth: 'old' }) });
  assert.equal(mixed.parts.base, '#ABCDEF'); assert.equal(mixed.light, F.LIGHT_BORN);
  born.parts.base = '#000000'; assert.equal(readAppearance().parts.base, F.BORN_PAINT.base);
});

test('public pages, other profiles and non-loopback Nest endpoints make zero local reads', async () => {
  let reads = 0; const fetcher = async () => { reads++; throw new Error('must not fetch'); };
  for (const args of [{ ...owner, hostname: 'optimism.fit' }, { ...owner, handle: 'somebody_else' }, { ...owner, nestBase: 'https://example.com' },
    { ...owner, nestBase: 'http://user:pass@127.0.0.1:8904' }, { ...owner, nestBase: 'http://127.0.0.1:8904/other' }])
    assert.deepEqual(await loadAppearance({ ...args, fetcher }), readAppearance());
  assert.equal(reads, 0);
});

test('owner preview reads the two existing refs once, with no credentials and caller cancellation', async () => {
  const calls = [], controller = new AbortController();
  const fetcher = async (url, options) => { calls.push({ url, options }); return { ok: true, url, json: async () => url.endsWith(F.PAINT_REF) ? paint() : light() }; };
  const out = await loadAppearance({ ...owner, fetcher, signal: controller.signal });
  assert.equal(out.light, '#456ABC'); assert.equal(calls.length, 2);
  assert.deepEqual(new Set(calls.map(c => c.url)), new Set([F.PAINT_REF, F.LIGHT_REF].map(n => `http://127.0.0.1:8904/nest/ref/${n}`)));
  for (const { options } of calls) { assert.equal(options.credentials, 'omit'); assert.equal(options.redirect, 'error'); assert.equal(options.cache, 'no-store'); assert.equal(options.signal, controller.signal); }
  controller.abort(); await loadAppearance({ ...owner, fetcher, signal: controller.signal }); assert.equal(calls.length, 2);
});

test('read failures and redirected responses retain safe defaults; one failed component does not erase the other', async () => {
  assert.deepEqual(await loadAppearance({ ...owner, fetcher: async () => { throw new Error('private transport details'); } }), readAppearance());
  const out = await loadAppearance({ ...owner, fetcher: async url => ({ ok: true, redirected: url.endsWith(F.LIGHT_REF), json: async () => paint() }) });
  assert.equal(out.parts.base, '#ABCDEF'); assert.equal(out.light, F.LIGHT_BORN);
});

test('owner projection follows changes and rejects delayed snapshots, duplicates and unrelated prefix matches', async () => {
  const changes = [], reads = [], releases = [];
  let stream, closed = 0;
  const watcher = watchAppearance({ ...owner, onChange: value => changes.push(value),
    join: options => { stream = options; return { close() { closed++; } }; },
    fetcher: url => { reads.push(url); return new Promise(resolve => releases.push(() => resolve({ ok: true, url,
      json: async () => url.endsWith(F.PAINT_REF) ? paint() : light() }))); },
  });
  const pending = watcher.refresh();
  stream.onEntry({ type: 'ref', seq: 100, payload: { name: F.PAINT_REF, rev: 10,
    value: paint({ parts: { base: '#112233' }, opened: true, gaze: 'star' }).ref.value } });
  for (const release of releases) release(); await pending;
  assert.equal(changes.at(-1).parts.base, '#112233'); assert.equal(changes.at(-1).gaze, 'star');
  assert.equal(changes.at(-1).light, '#456ABC'); assert.equal(changes.at(-1).revisions.paint, 10);
  const count = changes.length;
  stream.onEntry({ type: 'ref', seq: 101, payload: { name: F.PAINT_REF, rev: 9, value: paint().ref.value } });
  stream.onEntry({ type: 'ref', seq: 102, payload: { name: `${F.PAINT_REF}-private`, rev: 11, value: paint().ref.value } });
  assert.equal(changes.length, count);
  stream.onEntry({ type: 'ref', seq: 103, payload: { name: F.PAINT_REF, rev: 11, value: null } });
  assert.equal(changes.at(-1).parts.base, F.BORN_PAINT.base); assert.equal(changes.at(-1).gaze, null);
  watcher.stop(); watcher.stop(); assert.equal(closed, 1); assert.equal(reads.length, 2);
  stream.onEntry({ type: 'ref', seq: 104, payload: { name: F.PAINT_REF, rev: 12, value: paint().ref.value } });
  assert.equal(changes.at(-1).revisions.paint, 11);
});

test('public and unrelated profile views neither read nor subscribe to a private Nest', () => {
  for (const args of [{ ...owner, hostname: 'optimism.fit' }, { ...owner, handle: 'another_builder' }, { ...owner, nestBase: 'https://private.example' }]) {
    const changes = [];
    const watcher = watchAppearance({ ...args, fetcher() { assert.fail('private read'); }, join() { assert.fail('private subscription'); }, onChange: value => changes.push(value) });
    assert.equal(changes.length, 1); assert.equal(changes[0].source, 'born'); watcher.stop();
  }
});

test('Council follows its local owner without borrowing a public profile identity', async () => {
  let joined = 0, closed = 0; const changes = [];
  const watcher = watchAppearance({ localOwner: true, hostname: '127.0.0.1', onChange: value => changes.push(value),
    join: () => { joined++; return { close() { closed++; } }; },
    fetcher: async url => ({ ok: true, url, json: async () => url.endsWith(F.PAINT_REF) ? paint() : light() }),
  });
  await watcher.refresh(); assert.equal(joined, 1); assert.equal(changes.at(-1).parts.base, '#ABCDEF');
  watcher.stop(); assert.equal(closed, 1);
  for (const args of [{ hostname: 'optimism.fit' }, { hostname: '127.0.0.1', nestBase: 'https://elsewhere.example' }]) {
    watchAppearance({ ...args, localOwner: true, join() { assert.fail('non-local subscription'); }, fetcher() { assert.fail('non-local read'); } }).stop();
  }
});

test('reopen and gap recover withdrawn refs; an aborted read cannot repaint', async () => {
  let stream, requests = 0, signal;
  const changes = [], abort = new AbortController();
  const watcher = watchAppearance({ ...owner, signal: abort.signal, onChange: value => changes.push(value),
    join: options => { stream = options; return { close() {} }; },
    fetcher: async (url, options) => { signal = options.signal; requests++; return { ok: true, url,
      json: async () => ({ name: url.endsWith(F.PAINT_REF) ? F.PAINT_REF : F.LIGHT_REF, ref: { rev: 20, seq: 200, value: null } }) }; },
  });
  stream.onStatus('open');
  await watcher.refresh();
  assert.equal(changes.at(-1).revisions.paint, 20);
  stream.onGap(); const count = changes.length; abort.abort();
  await Promise.resolve(); await Promise.resolve();
  assert.equal(signal.aborted, true); assert.equal(changes.length, count); assert.ok(requests >= 2);
});

test('a hung hydration expires and a queued reconnect can recover on the same subscription', async () => {
  let stream, requests = 0, aborted = 0, recovered;
  const done = new Promise(resolve => { recovered = resolve; });
  const watcher = watchAppearance({ ...owner, readTimeoutMs: 10,
    join: options => { stream = options; return { close() {} }; },
    onChange: value => { if (value.revisions.paint === 31 && value.revisions.light === 31) recovered(value); },
    fetcher: (url, { signal }) => {
      requests++;
      if (requests === 1) return new Promise((resolve, reject) => signal.addEventListener('abort', () => { aborted++; reject(new Error('timeout')); }, { once: true }));
      return Promise.resolve({ ok: true, url, json: async () => ({ name: url.endsWith(F.PAINT_REF) ? F.PAINT_REF : F.LIGHT_REF,
        ref: { rev: 31, seq: 310, value: null } }) });
    },
  });
  try {
    stream.onStatus('open'); stream.onGap();
    await done;
    assert.equal(aborted, 1); assert.equal(requests, 4);
  } finally { watcher.stop(); }
});

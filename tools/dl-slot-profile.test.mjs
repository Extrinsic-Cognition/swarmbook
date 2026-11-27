import test from 'node:test';
import assert from 'node:assert/strict';
import { bindSlotProfile, createSlotProfileResolver, SlotProfileError } from '../app/dl-slot-profile.js';

const image = handle => `https://pbs.twimg.com/profile_images/12345/${handle}_400x400.jpg`;
const response = url => ({ ok: true, text: async () => JSON.stringify({ url }) });

class Element extends EventTarget {
  constructor(id) { super(); this.id = id; this.value = ''; this.hidden = false; this.attributes = new Map(); }
  setAttribute(key, value) { this.attributes.set(key, value); }
  removeAttribute(key) { this.attributes.delete(key); if (key === 'src') delete this.src; }
  getAttribute(key) { return this.attributes.get(key); }
}
function form(resolve) {
  const input = new Element('slot-twitter'), portrait = new Element('slot-portrait'), note = new Element('slot-profile-note');
  const controller = bindSlotProfile({ input, portrait, note, resolve });
  return { input, portrait, note, controller };
}

test('only the buyer lookup resolves a handle once, including concurrent blur and submit', async () => {
  const calls = [];
  const resolve = createSlotProfileResolver({ fetch: async (url, options) => { calls.push({ url, options }); return response(image('alice')); } });
  const [first, second] = await Promise.all([resolve('@Alice'), resolve('alice')]);
  assert.deepEqual(first, { handle: 'alice', avatarUrl: image('alice') });
  assert.equal(first, second);
  assert.equal(await resolve('https://x.com/Alice'), first);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, 'https://unavatar.io/x/alice?json&fallback=false');
  assert.equal(calls[0].options.credentials, 'omit');
  assert.equal(calls[0].options.redirect, 'error');
  await assert.rejects(resolve('https://evil.invalid/@alice'), SlotProfileError);
  assert.equal(calls.length, 1, 'invalid input must not contact a profile service');
});

test('failed or unsafe profile resolution cannot silently retry or fall back to another picture', async () => {
  for (const value of ['https://evil.invalid/avatar.jpg', 'https://pbs.twimg.com/other/123.jpg', undefined]) {
    let calls = 0;
    const resolve = createSlotProfileResolver({ fetch: async () => { calls++; return response(value); } });
    await assert.rejects(resolve('alice'), /clear the optional X field/);
    await assert.rejects(resolve('@ALICE'), /clear the optional X field/);
    assert.equal(calls, 1);
  }
});

test('an unresponsive response body has an eight-second-configurable bound and aborts', async () => {
  let signal;
  const resolve = createSlotProfileResolver({ timeoutMs: 5, fetch: async (url, options) => {
    signal = options.signal; return { ok: true, text: () => new Promise(() => {}) };
  } });
  await assert.rejects(resolve('alice'), /could not be loaded/);
  assert.equal(signal.aborted, true);
});

test('clearing the optional field bypasses lookup and preserves explicit network disclosure', async () => {
  const f = form(() => assert.fail('empty optional field must not resolve'));
  f.controller.setNetworkNotice('This reservation is on Solana devnet and uses test SOL.');
  assert.equal(await f.controller.prepare(), null);
  assert.equal(f.portrait.hidden, true);
  assert.match(f.note.textContent, /public|publish/);
  assert.match(f.note.textContent, /not verified by X/);
  assert.match(f.note.textContent, /devnet/);
  assert.equal(f.input.getAttribute('aria-describedby'), f.note.id);
});

test('a late lookup cannot paint or submit the previously entered handle', async () => {
  const pending = new Map();
  const f = form(handle => new Promise(resolve => pending.set(handle, resolve)));
  f.input.value = 'alice';
  const first = f.controller.prepare();
  f.input.value = 'bob'; f.input.dispatchEvent(new Event('input'));
  const second = f.controller.prepare();
  pending.get('bob')({ handle: 'bob', avatarUrl: image('bob') });
  assert.equal((await second).handle, 'bob');
  pending.get('alice')({ handle: 'alice', avatarUrl: image('alice') });
  await assert.rejects(first, /profile changed/);
  assert.equal(f.portrait.src, image('bob'));
  assert.equal(f.portrait.alt, '@bob on X');
  assert.match(f.note.textContent, /linked to your wallet/);
  assert.match(f.note.textContent, /not verified by X/);
});

test('an unavailable photo is actionable and clearing it allows a plain GitHub reservation', async () => {
  const f = form(createSlotProfileResolver({ fetch: async () => ({ ok: false }) }));
  f.input.value = 'alice';
  await assert.rejects(f.controller.prepare(), SlotProfileError);
  assert.equal(f.input.getAttribute('aria-invalid'), 'true');
  assert.match(f.note.textContent, /clear the optional X field/);
  assert.equal(f.portrait.hidden, true);
  f.input.value = ''; f.input.dispatchEvent(new Event('input'));
  assert.equal(await f.controller.prepare(), null);
  assert.equal(f.input.getAttribute('aria-invalid'), undefined);
});

test('the actual reservation sender emits a refresh hint only after a successful confirmation', async () => {
  const names = ['window', 'document', 'dispatchEvent', 'CustomEvent'];
  const previous = Object.fromEntries(names.map(name => [name, globalThis[name]]));
  const nodes = new Map(), events = [];
  const node = id => { if (!nodes.has(id)) nodes.set(id, new Element(id)); return nodes.get(id); };
  node('#slot-dialog').querySelector = selector => node(selector);
  globalThis.window = {};
  globalThis.document = { querySelector: node };
  globalThis.dispatchEvent = event => { events.push(event); return true; };
  globalThis.CustomEvent = class extends Event { constructor(type, options) { super(type); this.detail = options.detail; } };
  try {
    const { send } = await import('../app/dl-slot.js?confirmation-test');
    class Transaction { add(...instructions) { this.instructions = instructions; return this; } }
    const me = { key: 'synthetic-buyer' }, instructions = [{ memo: 'synthetic' }, { bid: 'synthetic' }];
    let confirmation = { value: { err: null } }, submits = 0;
    const api = { web3: { Transaction }, conn: {
      getLatestBlockhash: async () => ({ blockhash: 'synthetic-blockhash', lastValidBlockHeight: 123 }),
      sendRawTransaction: async bytes => { assert.deepEqual(bytes, new Uint8Array([1, 2, 3])); submits++; return 'synthetic-signature'; },
      confirmTransaction: async (value, commitment) => {
        assert.deepEqual(value, { signature: 'synthetic-signature', blockhash: 'synthetic-blockhash', lastValidBlockHeight: 123 });
        assert.equal(commitment, 'confirmed'); return confirmation;
      },
    } };
    const provider = { signTransaction: async tx => {
      assert.equal(tx.feePayer, me); assert.deepEqual(tx.instructions, instructions);
      return { serialize: () => new Uint8Array([1, 2, 3]) };
    } };
    assert.equal(await send(api, provider, me, instructions), 'synthetic-signature');
    assert.equal(events.length, 1);
    assert.equal(events[0].type, 'dl-reservation-confirmed');
    assert.deepEqual(events[0].detail, { signature: 'synthetic-signature' });
    for (const failure of [{ value: { err: { InstructionError: [1, 'Custom'] } } }, { value: {} }, null]) {
      confirmation = failure;
      await assert.rejects(send(api, provider, me, instructions), /not confirmed/);
    }
    assert.equal(submits, 4);
    assert.equal(events.length, 1, 'failed/unknown confirmation cannot announce a reservation');
  } finally {
    for (const name of names) { if (previous[name] === undefined) delete globalThis[name]; else globalThis[name] = previous[name]; }
  }
});

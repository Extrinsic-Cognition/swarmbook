// worker/the-payee-is-not-the-key.test.mjs: THE PAYEE IS NOT THE KEY (Oct 28 2026; plans/the-marketing-plan-2026-10-28.md S1). Seats pay a creator's
// payee, which may be a multisig's vault (his: a 2-of-3 Squads multisig of three Keystones); Gold bids are sealed to the creator's key and its totals
// signed by it, which a vault cannot do. A creator naming both: the checkout pays the payee, the Gold pot names the key. No network: invented wallets.
import test from 'node:test';
import assert from 'node:assert/strict';
import { d1, migrated } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by the migrations named
import { createHandler } from './premint.mjs';
import { creatorOf, payeeOf, keyOf } from './creators.mjs';
import { readManifest, FIRST_TRACENET, SCHEMA } from '../app/tracenet-register.mjs';
import { RECIPIENT, PAYEE, GENESIS, encode58 } from '../app/dl-direct-protocol.mjs';

const KEY = encode58(new Uint8Array(32).fill(11)), VAULT = encode58(new Uint8Array(32).fill(22));
const blockhash = encode58(new Uint8Array(32).fill(7));
const REGISTER = { schema: SCHEMA, handle: 'rider_one', name: 'Rider One', wallet: KEY, payee: VAULT, items: [] };

function setup() {
  const db = migrated();
  const DB = d1(db);
  const ASSETS = { fetch: async (req) => (new URL(req.url).pathname === '/app/tracenet/rider_one.json' ? Response.json(REGISTER) : new Response('no', { status: 404 })) };
  const env = { DB, PREMINT_ENABLED: 'true', ASSETS };
  const handle = createHandler({ clock: () => 1793000000, clockMs: () => 1793000000000, fetcher: async (url, opts) => {
    if (url.includes('coinbase')) return Response.json({ data: { base: 'SOL', currency: 'USD', amount: '100' } });
    const { method } = JSON.parse(opts.body);
    const result = { getGenesisHash: GENESIS, getLatestBlockhash: { value: { blockhash, lastValidBlockHeight: 200 } }, getBlockHeight: 100 }[method];
    return Response.json({ result: result ?? null });
  } });
  const get = async (path) => { const r = await handle(new Request(`https://optimism.fit${path}`, { headers: { origin: 'https://optimism.fit' } }), env, {}); return { status: r.status, body: await r.json() }; };
  return { env, get };
}

test('a register names its key and, apart, its payee; a payee that is no address is dropped', () => {
  const m = readManifest({ ...REGISTER }, 'rider_one');
  assert.equal(m.wallet, KEY); assert.equal(m.payee, VAULT);
  assert.equal('payee' in readManifest({ ...REGISTER, payee: 'not an address' }, 'rider_one'), false);
  assert.equal('payee' in readManifest({ ...REGISTER, payee: undefined }, 'rider_one'), false, 'a register without one reads as before');
  assert.equal(payeeOf({ register: m }), VAULT, 'seats pay the payee'); assert.equal(keyOf({ register: m }), KEY, 'the key seals and signs');
  assert.equal(payeeOf({ register: { wallet: KEY } }), KEY, 'no payee: the wallet is both'); assert.equal(keyOf({ register: { wallet: KEY } }), KEY);
  assert.equal(payeeOf(null), null); assert.equal(keyOf({ register: {} }), null);
});

test('the first tracenet: its key is RECIPIENT and its payee PAYEE, equal until the vault exists, so its register reads exactly as before', async () => {
  const { env } = setup();
  const first = await creatorOf(env, 'https://optimism.fit', FIRST_TRACENET);
  assert.equal(keyOf(first), RECIPIENT); assert.equal(payeeOf(first), PAYEE);
  if (PAYEE === RECIPIENT) assert.equal('payee' in first.register, false, 'no payee field while they are one');
  else assert.equal(first.register.payee, PAYEE);
});

test('a creator whose payee is a vault: the checkout pays the vault, the Gold pot seals bids to the key', async () => {
  const { get } = setup();
  const offer = await get('/api/premint/availability?creator=rider_one');
  assert.equal(offer.status, 200, JSON.stringify(offer.body)); assert.equal(offer.body.recipient, VAULT);
  const pot = await get('/api/premint/gold/pot?month=2026-11&creator=rider_one');
  assert.equal(pot.status, 200, JSON.stringify(pot.body)); assert.equal(pot.body.recipient, KEY, 'a bid is sealed to the key, never to a vault');
});

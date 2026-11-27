// tracenet-tank.test.mjs · THE FAN PAYS FROM THE TANK: the doors on a database built by every migration, through the Worker's own handler. A creator names a
// price with the tracenet's key; a fan's tank pays it inside the ledger, once per row, never past its fuel or what its calls in flight hold; the drops open to
// that tank's key and to no other, for the days paid; the 402 hands the tank's terms. Everything invented; no chain is asked.
// node --test embertide-app/ui/intro/dyson-society/worker/tracenet-tank.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { d1, migrated, migrations } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by the migrations named
import { createHash } from 'node:crypto';
import { createHandler } from './premint.mjs';
import { DEPOSIT_PATH } from './space-router-deposit.mjs';
import { HOLD_MS } from './space-router.mjs';
import { seatSignIn, sealSeatProof } from '../app/dl-direct-protocol.mjs';
import { newTankKey } from '../app/space-router-deposit.mjs';
import { DAY_MS } from '../app/tracenet-register.mjs';
import { wallet } from './stand-ins.mjs';

const ORIGIN = 'https://optimism.fit', T0 = Date.UTC(2026, 10, 2, 12), HANDLE = 'kiln_traces';
const BYTES = Buffer.from('# a trace\nthe steps, the dead ends, the fix.\n');
const drop = (id, published) => ({ id, file: 'trace.md', published: new Date(published).toISOString() });
const FRESH = drop('2026-11-02-a-fresh-trace', T0 - 3600_000);
const hashOf = (key) => createHash('sha256').update(key).digest('hex');
async function site({ migrate = migrations } = {}) {
  const db = migrated(migrate);
  const creator = await wallet(), stranger = await wallet(), state = { now: T0 }, drops = [FRESH];
  db.prepare('INSERT INTO creators(handle,name,wallet,created_at,updated_at) VALUES(?,?,?,1,1)').run(HANDLE, 'Kiln', creator.address);
  const addDrop = (d) => { drops.push(d); db.prepare('INSERT INTO drops(handle,id,title,kind,file,bytes,sha256,published) VALUES(?,?,?,?,?,?,?,?)')
    .run(HANDLE, d.id, `A trace ${d.id}`, 'trace', d.file, BYTES.length, hashOf(BYTES), d.published); };
  addDrop(drops.pop());
  const VAULT = { get: async (key) => (drops.some((d) => key === `vault/${HANDLE}/${d.id}/${d.file}`) ? { body: BYTES, size: BYTES.length, httpMetadata: { contentType: 'text/markdown' } } : null) };
  const handler = createHandler({ fetcher: async () => { throw new Error('no chain is asked'); }, clockMs: () => state.now, clock: () => Math.floor(state.now / 1000) });
  const env = { DB: d1(db), VAULT, ASSETS: { fetch: async () => new Response('', { status: 404 }) } };
  const proof = async (w) => { const text = seatSignIn({ host: 'optimism.fit', origin: ORIGIN, address: w.address, now: state.now }); return sealSeatProof(text, await w.sign(new TextEncoder().encode(text))); };
  const ask = async (path, { method = 'GET', body, headers = {} } = {}) => {
    const r = await handler(new Request(`${ORIGIN}${path}`, { method, headers: { 'content-type': 'application/json', ...headers }, body: body === undefined ? undefined : JSON.stringify(body) }), env);
    const text = await r.text(); let json = null; try { json = JSON.parse(text); } catch { json = null; }
    return { status: r.status, body: json, text };
  };
  const price = async (usd, w = creator, headers = { origin: ORIGIN }) => ask(`/api/premint/creators/${HANDLE}/price`, { method: 'POST', body: { usd }, headers: { ...headers, 'x-seat': await proof(w) } });
  const subscribe = (key, ip) => ask(`/api/premint/creators/${HANDLE}/subscribe`, { method: 'POST', headers: { ...(key ? { authorization: `Bearer ${key}` } : {}), ...(ip ? { 'cf-connecting-ip': ip } : {}) } });
  const read = (d = FRESH, key) => ask(`/vault/${HANDLE}/${d.id}/${d.file}`, { headers: key ? { authorization: `Bearer ${key}` } : {} });
  /** a tank poured with `usd`, as the deposit door makes one (its key kept only by its sha256): its key */
  const tank = (usd) => { const key = newTankKey(), h = hashOf(key); db.prepare('INSERT INTO sr_tanks(name, key_sha256, poured_usd, made_at) VALUES(?,?,?,?)').run(`t-${h.slice(0, 12)}`, h, usd, 1); return key; };
  const fuel = (key) => db.prepare('SELECT poured_usd - drunk_usd AS fuel FROM sr_tanks WHERE key_sha256 = ?').get(hashOf(key)).fuel;
  return { db, state, ask, price, subscribe, read, tank, fuel, addDrop, creator, stranger };
}

test('a price is named by the tracenet\'s own key, on this website, inside its bounds; the register shows it, no repo and no deploy', async () => {
  const s = await site();
  assert.equal((await s.ask(`/api/premint/creators/${HANDLE}`)).body.tank, null, 'no price named, no terms');
  assert.equal((await s.price(5, s.stranger)).status, 401, 'another wallet names no price');
  assert.equal((await s.price(5, s.creator, {})).status, 403, 'only on this website');
  for (const usd of [0.1, 20000, 'five']) assert.equal((await s.price(usd)).status, 400, String(usd));
  const set = await s.price(5);
  assert.equal(set.status, 200, set.text); assert.deepEqual([set.body.usd, set.body.days], [5, 30]);
  assert.deepEqual((await s.ask(`/api/premint/creators/${HANDLE}`)).body.tank, { usd: 5, days: 30, door: `/api/premint/creators/${HANDLE}/subscribe`, header: 'authorization: Bearer <your tank key>', fill: DEPOSIT_PATH });
  assert.equal((await s.price(7.499)).body.usd, 7.5, 'to the cent');
  assert.equal((await s.ask('/api/premint/creators/nobody_here/price', { method: 'POST', body: { usd: 5 }, headers: { origin: ORIGIN } })).status, 404);
});

test('a fan\'s tank pays the price inside the ledger and opens the drops to its key alone; the days stack; a dry tank meets 402 naming the deposit door', async () => {
  const s = await site(); await s.price(5);
  const fan = s.tank(12), other = s.tank(50);
  const shut = await s.read();
  assert.equal(shut.status, 402); assert.equal(shut.body.tank.usd, 5); assert.equal(shut.body.tank.fill, DEPOSIT_PATH);
  const first = await s.subscribe(fan);
  assert.equal(first.status, 201, first.text); assert.equal(first.body.until, new Date(T0 + 30 * DAY_MS).toISOString()); assert.equal(first.body.fuel, 7);
  const open = await s.read(FRESH, fan);
  assert.equal(open.status, 200); assert.equal(open.text, BYTES.toString());
  assert.equal((await s.read(FRESH, other)).status, 402, 'another tank\'s key opens nothing it did not pay for');
  assert.equal((await s.subscribe(fan)).body.until, new Date(T0 + 60 * DAY_MS).toISOString(), 'a second payment stacks its days');
  const dry = await s.subscribe(fan);
  assert.equal(dry.status, 402); assert.equal(dry.body.fill, DEPOSIT_PATH); assert.equal(s.fuel(fan), 2, 'a refused payment takes nothing');
  assert.equal(s.db.prepare('SELECT COUNT(*) AS n FROM tracenet_access').get().n, 2);
  assert.equal(s.db.prepare("SELECT COUNT(*) AS n FROM tracenet_access WHERE id LIKE '%' || ? || '%' OR tank LIKE '%sr_%'").get(fan.slice(3, 20)).n, 0, 'the key is in no row');
  assert.equal((await s.subscribe(newTankKey())).status, 401, 'a key no tank holds');
  assert.equal((await s.subscribe(null)).status, 401, 'no key');
  // the days run out: a drop published after them is closed to the key again
  s.state.now = T0 + 61 * DAY_MS; const late = drop('2027-01-02-after-the-days', s.state.now - 3600_000); s.addDrop(late);
  assert.equal((await s.read(late, fan)).status, 402);
});

test('what the calls in flight hold is not the tank\'s to spend; a hold older than HOLD_MS holds nothing', async () => {
  const s = await site(); await s.price(5);
  const fan = s.tank(6), name = s.db.prepare('SELECT name FROM sr_tanks WHERE key_sha256 = ?').get(hashOf(fan)).name;
  s.db.prepare('INSERT INTO sr_holds(tank, usd, at) VALUES(?,?,?)').run(name, 2, T0 - 1000);
  assert.equal((await s.subscribe(fan)).status, 402, '$6 less a $2 call in flight is under $5');
  s.state.now = T0 + HOLD_MS + 1;
  assert.equal((await s.subscribe(fan)).status, 201, 'the stale hold holds nothing');
});

test('no price, no subscription; a database without 0016 answers shut, never broken', async () => {
  const s = await site();
  assert.equal((await s.subscribe(s.tank(10))).status, 409);
  const old = await site({ migrate: migrations.filter((n) => !n.startsWith('0016')) });
  assert.equal((await old.ask(`/api/premint/creators/${HANDLE}`)).body.tank, null);
  assert.equal((await old.price(5)).status, 503);
  assert.equal((await old.subscribe(old.tank(10))).status, 409);
  assert.equal((await old.read()).status, 402, 'the vault answers as before');
});

test('the subscribe door is bounded by asks a minute, as the deposit door is', async () => {
  const s = await site(); await s.price(5); const fan = s.tank(1);
  let last = null; for (let k = 0; k < 31; k++) last = await s.subscribe(fan, '203.0.113.9');
  assert.equal(last.status, 429);
});

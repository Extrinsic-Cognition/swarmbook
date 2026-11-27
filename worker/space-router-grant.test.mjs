// space-router-grant.test.mjs · A FLASK LETS ITS HARMONY SPEND (worker/space-router-grant.mjs, app/space-router-grant.mjs): the grant's text read back byte for
// byte, its times and its signature; a filled flask lets a key spend and that key then drinks from the flask's tank through the Worker's own handler, within
// its cap a UTC day, until its end; every refusal with its reason. A database built by every migration; MiniRouter a stand-in: no network, no money.
// node --test embertide-app/ui/intro/dyson-society/worker/space-router-grant.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { d1, migrated, migrations } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by the migrations named
import { createHandler } from './premint.mjs';
import { CHAT_PATH, TANK_PATH, TRACENET_PATH } from './space-router.mjs';
import { MAX_LIVE, PERSON_PATH } from './space-router-grant.mjs'; import { PORTRAIT_PATH, HER } from './space-router-portrait.mjs';
import { tankOfAuthority } from './space-router-link.mjs'; import { wallet } from './stand-ins.mjs';
import { GRANT_PATH, GRANT_MS, DAY_MS, grantAsk, grantFields, grantMessage, grantSignIn, sealGrantProof, verifyGrantProof } from '../app/space-router-grant.mjs';
import { newOracleKey } from '../app/space-router-oracle.mjs';
import { addSql, refillSql, keyHash, newKey } from '../tools/space-router-tank.mjs';

const SITE = 'https://optimism.fit', HOST = 'optimism.fit', OPEN = Date.UTC(2026, 9, 31, 12), T0 = OPEN + 60_000, SOL = 'openai/gpt-5.6-sol', ORACLE = await newOracleKey();
async function flask() {   // a flask as the page makes it: an Ed25519 key, its address (stand-ins.mjs wallet)
  const { address, sign } = await wallet(), proof = async (ask, { now = T0, host = HOST, origin = SITE } = {}) => { const text = grantSignIn({ host, origin, address, now, ...ask }); return sealGrantProof(text, await sign(new TextEncoder().encode(text))); };
  return { address, proof, tank: await tankOfAuthority(address) };
}
const harmony = (label = 'Harmony a1b2', cap = 1, days = 90) => { const key = newKey(); return { secret: key, key: keyHash(key), label, cap, days }; };   // the key stays with the machine; the ask names its sha256
function site({ through = migrations.length } = {}) {
  const db = migrated(migrations.slice(0, through));
  const clock = { ms: T0 }, up = { calls: 0, cost: 0.5 };
  const fetcher = async (url, init = {}) => { if (String(url).includes('api.coinbase.com')) return Response.json({ data: { base: 'SOL', currency: 'USD', amount: '10.00' } }); up.calls++; const body = JSON.parse(init.body);
    return new Response(JSON.stringify({ id: 'c', object: 'chat.completion', model: body.model, choices: [{ index: 0, message: { role: 'assistant', content: 'ok' }, finish_reason: 'stop' }], usage: { prompt_tokens: 1, completion_tokens: 1 } }), { status: 200, headers: { 'content-type': 'application/json', 'x-minirouter-cost-usd': String(up.cost) } }); };
  const handle = createHandler({ fetcher, clockMs: () => clock.ms, clock: () => Math.floor(clock.ms / 1000) });
  const env = { ASSETS: { fetch: () => new Response('asset') }, DB: d1(db), SPACE_ROUTER_KEY: 'mr-house', SPACE_ROUTER_ORACLE_KEY: ORACLE.secret, SPACE_ROUTER_OPENED_AT: new Date(OPEN).toISOString(), SPACE_ROUTER_TRACENET_SOL: '0.1' };
  let ip = 0; const ask = async (path, { method = 'POST', key, body } = {}) => { const r = await handle(new Request(`${SITE}${path}`, { method, headers: { ...(key ? { authorization: `Bearer ${key}` } : {}), 'content-type': 'application/json', 'cf-connecting-ip': `203.0.113.${ip++ % 200}` }, body: body === undefined ? undefined : JSON.stringify(body) }), env, {}); return { status: r.status, body: await r.json().catch(() => null) }; };
  const fill = (f, usd = 10) => { db.prepare('INSERT INTO sr_tanks(name, key_sha256, markup_bps, made_at) VALUES (?, ?, 500, ?)').run(f.tank, `unkeyed:${f.tank}`, clock.ms); db.exec(refillSql(f.tank, usd, 'deposit:test', { nowMs: clock.ms })); };   // a tank as a counted deposit leaves it: fuel, no key
  return { db, clock, up, ask, fill, grant: (proof) => ask(GRANT_PATH, { body: { proof } }), call: (key) => ask(CHAT_PATH, { key, body: { model: SOL, messages: [{ role: 'user', content: 'say ok' }] } }),
    row: (key) => { const r = db.prepare('SELECT * FROM sr_grants WHERE key_sha256 = ?').get(key); return r ? { ...r } : null; }, fuel: (f) => { const t = db.prepare('SELECT poured_usd - drunk_usd AS fuel FROM sr_tanks WHERE name = ?').get(f.tank); return t.fuel; } };
}

test('the grant\'s text: read back byte for byte, its times and its signature checked; what an ask may name', async () => {
  const f = await flask(), h = harmony(), proof = await f.proof(h), g = grantFields(proof);
  assert.deepEqual([g.address, g.key, g.label, g.cap, g.days, g.end], [f.address, h.key, 'Harmony a1b2', 1, 90, false]);
  assert.equal(new TextDecoder().decode(g.bytes), grantMessage(g), 'the text is the message the law writes');
  assert.ok(new TextDecoder().decode(g.bytes).includes(`Let Harmony a1b2 spend from your flask on Space Router: up to 1 USD a day, for 90 days. Its key's sha256 is ${h.key}. This sends no transaction and moves no funds.`));
  const ok = await verifyGrantProof(proof, { host: HOST, origin: SITE, now: T0 + 1000 }); assert.deepEqual([ok.payer, ok.key, ok.cap, ok.days, ok.end, ok.issued], [f.address, h.key, 1, 90, false, T0]);
  assert.equal(await verifyGrantProof(proof, { host: 'other.example', origin: 'https://other.example', now: T0 }), null, 'another site');
  assert.equal(await verifyGrantProof(proof, { host: HOST, origin: SITE, now: T0 + GRANT_MS }), null, 'expired'); assert.equal(await verifyGrantProof(proof, { host: HOST, origin: SITE, now: T0 - 11 * 60000 }), null, 'issued past the skew');
  const other = await flask(), forged = `${proof.split('.')[0]}.${(await other.proof(h)).split('.')[1]}`; assert.equal(await verifyGrantProof(forged, { host: HOST, origin: SITE, now: T0 }), null, 'another key\'s signature');
  const raised = sealGrantProof(new TextDecoder().decode(g.bytes).replace('up to 1 USD', 'up to 999 USD'), g.signature); assert.equal(await verifyGrantProof(raised, { host: HOST, origin: SITE, now: T0 }), null, 'a cap raised after the signature');
  const end = await verifyGrantProof(await f.proof({ key: h.key, end: true }), { host: HOST, origin: SITE, now: T0 }); assert.deepEqual([end.end, end.key, end.cap], [true, h.key, undefined]);
  for (const bad of [{ ...h, cap: 0 }, { ...h, cap: 1001 }, { ...h, cap: 1.5 }, { ...h, days: 0 }, { ...h, days: 367 }, { ...h, label: '<b>x' }, { ...h, label: '' }, { ...h, key: h.secret }]) assert.equal(grantAsk(bad), null, JSON.stringify(bad));
  assert.equal(grantFields(await f.proof({ ...h, label: 'a\nb' })), null, 'a name that breaks the text');
});

test('a filled flask lets a key spend: the key then drinks from the flask\'s tank, within its cap a day, until the flask ends it', async () => {
  const s = site(), f = await flask(), h = harmony(), proof = await f.proof(h);
  assert.equal((await s.call(h.secret)).status, 401, 'before the grant the key is no one\'s');
  assert.equal((await s.grant(proof)).status, 402, 'a flask that holds nothing lets nothing spend'); s.fill(f);
  const made = await s.grant(proof); assert.equal(made.status, 201, JSON.stringify(made.body)); assert.deepEqual(made.body, { tank: f.tank, label: 'Harmony a1b2', cap_usd: 1, until: new Date(T0 + 90 * DAY_MS).toISOString() });
  assert.equal((await s.grant(proof)).status, 200, 'the same proof again'); const kept = s.row(h.key);
  assert.deepEqual([kept.tank, kept.payer, kept.cap_usd, kept.ended_at, kept.drunk_usd], [f.tank, f.address, 1, null, 0]); assert.ok(!JSON.stringify(s.db.prepare('SELECT * FROM sr_grants').all()).includes(h.secret), 'the key itself is nowhere');
  const first = await s.call(h.secret); assert.equal(first.status, 200, JSON.stringify(first.body)); assert.ok(Math.abs(s.fuel(f) - (10 - 0.525)) < 1e-9, 'the flask\'s tank drank the call');
  const tank = await s.ask(TANK_PATH, { method: 'GET', key: h.secret }); assert.equal(tank.body.tank, f.tank); assert.deepEqual(tank.body.grant, { label: 'Harmony a1b2', cap_usd: 1, spent_today_usd: 0.525, until: new Date(T0 + 90 * DAY_MS).toISOString() });
  assert.equal((await s.call(h.secret)).status, 200, 'under its cap it is let in'); const calls = s.up.calls, over = await s.call(h.secret);
  assert.equal(over.status, 429); assert.match(over.body.error.message, /Harmony a1b2 has spent its \$1 for today/); assert.equal(s.up.calls, calls, 'nothing went upstream');
  s.clock.ms += DAY_MS; assert.equal((await s.call(h.secret)).status, 200, 'the next UTC day it drinks again'); assert.ok(Math.abs(s.row(h.key).drunk_usd - 0.525) < 1e-9, 'the day\'s count starts again');
  const stranger = await flask(); s.fill(stranger); assert.equal((await s.grant(await stranger.proof({ key: h.key, end: true }, { now: s.clock.ms }))).status, 404, 'another flask ends nothing of this one');
  assert.equal((await s.grant(await f.proof({ key: h.key, end: true }, { now: s.clock.ms }))).status, 200); assert.equal((await s.call(h.secret)).status, 401, 'an ended key opens nothing');
  assert.equal((await s.grant(await f.proof(h, { now: s.clock.ms }))).status, 409, 'an ended key is never let in again');
});

test('THE RIDER\'S COLOURS CROSS, THE RIDER IS A HEXAGON: a Harmony its flask let in says the six colours its rider gave her; every key of that rider with no minted face wears them; no face of a person crosses', async () => {
  const s = site(), f = await flask(), h = harmony(), RED = { light: '#FF3B30', base: '#F2E8DC', coat: '#2E4057', gold: '#C9A227', eyes: '#E4572E', thruster: '#76B041' }, say = (b, key = h.secret) => s.ask(PERSON_PATH, { key, body: b }), of = async (...k) => (await s.ask(`${PORTRAIT_PATH}?riders=${k.join(',')}`, { method: 'GET' })).body.riders, row = () => s.db.prepare('SELECT * FROM sr_persons').all().map((r) => ({ ...r }));
  assert.equal((await say({ colours: RED })).status, 401, 'a key no flask let in says nothing'); assert.equal((await say({ colours: RED }, undefined)).status, 401); assert.equal((await s.ask(PERSON_PATH, { method: 'GET' })).status, 405);
  s.fill(f); assert.equal((await s.grant(await f.proof(h))).status, 201); assert.deepEqual(await of(f.address), {}, 'nothing said: the site wears her default');
  for (const b of [{ colours: { ...RED, eyes: 'red' } }, { colours: RED, person: '5a72c9fe34607a9b4d5ff8271031ed125e9b56f64aa3a69eb714ae1856b15cc2' }, { person: '5a72c9fe34607a9b4d5ff8271031ed125e9b56f64aa3a69eb714ae1856b15cc2' }, { forget: true }, {}, null]) assert.equal((await say(b)).status, 400, JSON.stringify(b)); assert.deepEqual(row(), [], 'a person\'s face is refused: a rider is a hexagon');
  const kept = await say({ colours: { ...RED, light: '#ff3b30' } }); assert.deepEqual([kept.status, kept.body], [201, { colours: RED }]); assert.deepEqual(row(), [{ tank: f.tank, person: '', rider: f.address, said_at: T0, colours: JSON.stringify(RED) }]);
  s.clock.ms += 1000; assert.equal((await say({ colours: RED })).status, 200, 'the same again'); assert.equal(row()[0].said_at, T0, 'nothing written');
  const x = await flask(); s.db.prepare('INSERT INTO sr_x(address, x_id, handle, tank, bound_at, signature) VALUES (?, ?, ?, ?, ?, ?)').run(x.address, '1', 'box_room', f.tank, T0, 's'); const stranger = await flask();
  assert.deepEqual(await of(f.address, x.address, stranger.address), { [f.address]: { colours: RED }, [x.address]: { colours: RED } }, 'the flask, and the other browser its X holds: one rider; a stranger wears the default');
  assert.equal((await say({ colours: { ...RED, coat: '#000000' } })).status, 201, 'her colours changed are kept anew'); assert.equal(JSON.parse(row()[0].colours).coat, '#000000');
  assert.equal((await s.grant(await f.proof({ key: h.key, end: true }, { now: s.clock.ms }))).status, 200); assert.equal((await say({ colours: RED })).status, 401, 'an ended key says nothing more');
  const old = site({ through: migrations.indexOf('0034_the_rider_says_its_person.sql') }); assert.equal((await old.ask(`${PORTRAIT_PATH}?riders=${f.address}`, { method: 'GET' })).status, 200, 'a database behind 0034: the faces alone, as before');
});

test('THE RIDER STANDS ON THE META SWARM: a tracenet opened registers its claw rider, nothing minted; the ball lists every rider after the minted, in their colours else her default; the Pantheon\'s board by the traces they egressed', async () => {
  const s = site(), f = await flask(), g = await flask(), h = harmony('Harmony a1b2', 5), k = harmony('Harmony b2c3', 5), get = async (p) => (await s.ask(p, { method: 'GET' })).body, RED = { light: '#FF3B30', base: '#F2E8DC', coat: '#2E4057', gold: '#C9A227', eyes: '#E4572E', thruster: '#76B041' };
  s.fill(f); s.fill(g); await s.grant(await f.proof(h)); await s.grant(await g.proof(k)); assert.equal((await get(`${PORTRAIT_PATH}?riders=`)).registered, 0, 'no tracenet opened: no rider');
  for (const [key, id] of [[h, 'a'], [k, 'b'], [h, 'c']]) { s.clock.ms += 1000; assert.equal((await s.ask(TRACENET_PATH, { key: key.secret, body: { id: id.repeat(32) } })).status, 201); }
  assert.deepEqual(s.db.prepare('SELECT tank, handle, traces FROM sr_riders ORDER BY first_at').all().map((r) => ({ ...r })), [{ tank: f.tank, handle: '', traces: 0 }, { tank: g.tank, handle: '', traces: 0 }], 'each opening rider once, a second tracenet no second row');
  assert.equal((await s.ask(PERSON_PATH, { key: k.secret, body: { colours: RED } })).status, 201); s.db.prepare("UPDATE sr_riders SET traces = 3, handle = 'box_room' WHERE tank = ?").run(f.tank);
  assert.deepEqual((await get(PORTRAIT_PATH)).hexagons, [{ n: 1, signature: 'rider-1', colours: null, picture: HER, handle: 'box_room', traces: 3 }, { n: 2, signature: 'rider-2', colours: RED, traces: 0 }], 'her default where no colours came, theirs where they did');
  const board = (await get(`${PORTRAIT_PATH}?board`)).board; assert.deepEqual(board.map((r) => [r.rank, r.signature, r.traces, r.month.fees]), [[1, 'rider-1', 3, 0], [2, 'rider-2', 0, 0]], 'eligible for the Pantheon, by the traces they egressed');
  assert.deepEqual((await get(`${PORTRAIT_PATH}?riders=${f.address}`)).riders[f.address].rider.traces, 3);
});

test('the refusals: a key that is not free, too many keys, a grant past its end, a tracenet past the cap, a database behind the migration', async () => {
  const s = site(), f = await flask(), g = await flask(), h = harmony('Harmony 1', 1, 1); s.fill(f); s.fill(g);
  assert.equal((await s.grant('not a proof')).status, 401); assert.equal((await s.ask(GRANT_PATH, { method: 'GET' })).status, 405);
  assert.equal((await s.grant(await f.proof(h))).status, 201); assert.equal((await s.grant(await g.proof(h))).status, 409, 'a key one flask let spend is not another\'s to take');
  const own = newKey(); s.db.exec(addSql('ownkeyed', keyHash(own), { nowMs: T0 })); assert.equal((await s.grant(await f.proof({ ...h, key: keyHash(own) }))).status, 409, 'a tank\'s own key is never a grant\'s');
  assert.equal((await s.ask(TRACENET_PATH, { key: h.secret, body: { id: 'a'.repeat(32) } })).status, 201, 'a tracenet of $1.00 within a cap of $1'); assert.equal(s.row(h.key).drunk_usd, 1, 'counted on the key');
  assert.equal((await s.ask(TRACENET_PATH, { key: h.secret, body: { id: 'b'.repeat(32) } })).status, 429, 'the next one is past the cap'); assert.ok(Math.abs(s.fuel(f) - 9) < 1e-9, 'and took nothing');
  s.clock.ms += DAY_MS; assert.equal((await s.call(h.secret)).status, 401, 'past its end the key opens nothing');
  for (let i = 0; i < MAX_LIVE; i++) assert.equal((await s.grant(await g.proof(harmony(`Harmony ${i}`), { now: s.clock.ms }))).status, 201); assert.equal((await s.grant(await g.proof(harmony('one more'), { now: s.clock.ms }))).status, 429);
  const old = site({ through: migrations.indexOf('0024_the_grants.sql') }); assert.equal((await old.call(newKey())).status, 401, 'no grants table: an unknown key is no one\'s, as before');
});

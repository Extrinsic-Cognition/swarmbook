// space-router.test.mjs · SPACE ROUTER'S PUBLIC DOOR (worker/space-router.mjs, lane/space-routers-public-door; his Oct 30 2026 00:1x UTC "Yes, build it"): the
// door on a database built by every migration in order, as D1 applies them, through the Worker's own handler. MiniRouter is a stand-in: no network, no money.
// node --test worker/space-router.test.mjs (Node 22+).
import test from 'node:test';
import assert from 'node:assert/strict';
import { d1, migrated, migrations } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by the migrations named
import { createHandler } from './premint.mjs';
import { CHAT_PATH, MODELS_PATH, TANK_PATH, TRACENET_PATH, MINE_PATH, HOLD_MS, UPSTREAM, BODY_BYTES, MINTED } from './space-router.mjs';
import * as L from '../app/space-router-law.mjs';
import { newOracleKey } from '../app/space-router-oracle.mjs';
import { addSql, refillSql, showSql, keyHash, newKey } from '../tools/space-router-tank.mjs';

const SITE = 'https://optimism.fit', OPEN = Date.UTC(2026, 9, 31, 12), HOUSE_KEY = 'mr-house-key-for-tests', SOL = 'openai/gpt-5.6-sol';
const ORACLE = await newOracleKey();   // THE ROUTER IS THE ORACLE: the door is shut without its key (worker/space-router-oracle.test.mjs)


/** MiniRouter, a stand-in: an exact cost in its header (or usage.cost, or none), its answer, its refusals; every call it was sent */
function router() {
  const s = { solUsd: '150.00', cost: 0.0979, where: 'header', content: 'ok', tools: null, status: 200, error: '', fail: false, gate: null, refuseAbove: Infinity }, calls = [];
  async function fetcher(url, init = {}) {
    const body = init.body ? JSON.parse(init.body) : null; calls.push({ url: String(url), auth: init.headers?.authorization, body });
    if (String(url).endsWith('/models')) return Response.json({ object: 'list', data: [{ id: SOL }] });
    if (String(url).includes('api.coinbase.com')) return Response.json({ data: { base: 'SOL', currency: 'USD', amount: s.solUsd } });   // SOL's dollar price, as the mint reads it
    if (s.gate) await s.gate;
    if (s.fail) throw new TypeError('fetch failed');
    if ((body?.max_tokens ?? 0) > s.refuseAbove) return new Response(JSON.stringify({ error: { message: "Insufficient credits: your available balance is $19.80, below this request's worst-case estimate of $27.53" } }), { status: 402 });
    if (s.status !== 200) return new Response(JSON.stringify({ error: { message: s.error } }), { status: s.status, headers: s.status === 429 ? { 'retry-after': '7' } : {} });
    const usage = { prompt_tokens: 12, completion_tokens: 3, total_tokens: 15, ...(s.where === 'usage' ? { cost: s.cost } : {}) };
    const message = { role: 'assistant', content: s.content, ...(s.tools ? { tool_calls: s.tools } : {}) };
    return new Response(JSON.stringify({ id: 'chatcmpl-1', object: 'chat.completion', created: 1, model: body.model, choices: [{ index: 0, message, finish_reason: s.tools ? 'tool_calls' : 'stop' }], usage }),
      { status: 200, headers: { 'content-type': 'application/json', 'x-minirouter-balance-usd': '317.95', ...(s.where === 'header' ? { 'x-minirouter-cost-usd': String(s.cost) } : {}) } });
  }
  return { s, calls, fetcher };
}

function setup({ opened = new Date(OPEN).toISOString(), houseKey = HOUSE_KEY, mine, through = migrations.length, db: withDb = true, seatWasm = null } = {}) {
  const db = migrated(migrations.slice(0, through));
  const up = router(), clock = { ms: OPEN + 60_000 }, handle = createHandler({ fetcher: up.fetcher, clockMs: () => clock.ms, seatWasm });
  const env = { ASSETS: { fetch: () => new Response('asset') }, ...(withDb ? { DB: d1(db) } : {}), ...(houseKey ? { SPACE_ROUTER_KEY: houseKey } : {}), SPACE_ROUTER_ORACLE_KEY: ORACLE.secret,
    ...(opened ? { SPACE_ROUTER_OPENED_AT: opened } : {}), ...(mine !== undefined ? { SPACE_ROUTER_MINE_WARM: String(mine) } : {}) };
  // PROMPT-TO-MINE IS FOR WHO MINTED: a test's tank has bought a tracenet before it (a row burns() leaves out), unless it says it minted nothing; deposit: one of a tank's, and its place on the ball
  const tank = (name, usd, { minted = true } = {}) => { const key = newKey(); db.exec(addSql(name, keyHash(key), { nowMs: clock.ms })); if (usd) db.exec(refillSql(name, usd, 'a test pour', { nowMs: clock.ms }));
    if (minted) db.prepare("INSERT INTO sr_ledger(at, kind, tank, usd, warm, why) VALUES (1, 'burn', ?, 0, 0, 'tracenet:before')").run(name); return key; };
  let paid = 0; const deposit = (name, usd, place = usd >= 10) => { const sig = `${name}:${newKey()}`; db.prepare("INSERT INTO sr_deposits VALUES (?, 'payer', ?, '0', ?, 'mint', 'mainnet', 1, ?, 1, 'none')").run(sig, name, usd, ++paid);
    if (place) db.prepare("INSERT INTO sr_drops(signature, tier, usd, at_ms, slot, heard_at) VALUES (?, 'bronze', ?, 1, 1, 1)").run(sig, usd); };
  const ask = (path, { method = 'POST', key, xkey, body, ip = '203.0.113.7' } = {}) => handle(new Request(`${SITE}${path}`, { method,
    headers: { ...(key ? { authorization: `Bearer ${key}` } : {}), ...(xkey ? { 'x-api-key': xkey } : {}), ...(body !== undefined ? { 'content-type': 'application/json' } : {}), 'cf-connecting-ip': ip },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body) }), env, {});
  const call = (key, extra = {}) => ask(CHAT_PATH, { key, body: { model: SOL, messages: [{ role: 'user', content: 'say ok' }], ...extra } });
  const burns = () => db.prepare("SELECT * FROM sr_ledger WHERE kind = 'burn' AND why IS NOT 'tracenet:before' ORDER BY id").all().map((r) => ({ ...r }));
  const row = (name) => ({ ...db.prepare('SELECT * FROM sr_tanks WHERE name = ?').get(name) });
  return { db, env, up, clock, tank, deposit, ask, call, burns, row };
}
const drink = L.charge(0.0979, L.MARKUP_BPS);   // 0.102795
const events = (text) => text.split('\n\n').filter(Boolean).map((e) => e.replace(/^data: /, '')).map((d) => (d === '[DONE]' ? d : JSON.parse(d)));

test('a call drinks the router\'s cost plus 5 %, mines $WARM at the opening\'s rate and rides MiniRouter with the house\'s key, never the tank\'s; its receipt keeps no prompt', async () => {
  const s = setup(), key = s.tank('rider-one', 10);
  const r = await s.call(key);
  assert.equal(r.status, 200);
  assert.equal((await r.json()).choices[0].message.content, 'ok');
  assert.deepEqual([r.headers.get('x-space-router-usd'), r.headers.get('x-space-router-warm'), r.headers.get('x-space-router-fuel-usd')], ['0.102795', '0.102795', '9.897205']);
  assert.equal(r.headers.get('x-minirouter-balance-usd'), null, 'nothing of the house\'s account reaches the caller');
  assert.equal(s.up.calls.length, 1);
  assert.deepEqual([s.up.calls[0].url, s.up.calls[0].auth, s.up.calls[0].body.stream, s.up.calls[0].body.model], [`${UPSTREAM}/chat/completions`, `Bearer ${HOUSE_KEY}`, false, SOL]);
  const [b] = s.burns();
  assert.deepEqual({ ...b, id: 0 }, { id: 0, at: s.clock.ms, kind: 'burn', tank: 'rider-one', usd: drink, router_usd: 0.0979, markup_bps: 500, warm: drink, model: SOL, tokens_in: 12, tokens_out: 3,
    ms: 0, estimated: null, why: null, tokens_cached: null, warm_spent: 0 }, 'the receipt: what, when, how much, how many tokens (the cached ones: migration 0013); nothing of what was said');
  const t = s.row('rider-one');
  assert.deepEqual([t.calls, +t.warm.toFixed(9), +(t.poured_usd - t.drunk_usd).toFixed(9), +t.router_usd.toFixed(9)], [1, drink, 9.897205, 0.0979]);
  assert.equal(s.db.prepare('SELECT COUNT(*) AS n FROM sr_holds').get().n, 0, 'the hold is gone once it burned');
  assert.equal(+s.db.prepare('SELECT owed FROM sr_mine').get().owed.toFixed(9), drink, 'the mine knows what it owes');
  const r2 = await s.ask(CHAT_PATH, { xkey: key, body: { model: SOL, messages: [{ role: 'user', content: 'again' }] } });
  assert.equal(r2.status, 200, 'the key as x-api-key, as Anthropic\'s clients send it');
});

test('stream:true is replayed from the whole answer: the role, the text, tool calls as deltas, the finish with usage, [DONE]; MiniRouter is still asked whole', async () => {
  const s = setup(), key = s.tank('rider-one', 10);
  const r = await s.call(key, { stream: true, stream_options: { include_usage: true } });
  assert.equal(r.status, 200); assert.equal(r.headers.get('content-type'), 'text/event-stream'); assert.equal(r.headers.get('x-space-router-usd'), '0.102795');
  const ev = events(await r.text());
  assert.deepEqual(ev[0].choices[0].delta, { role: 'assistant', content: '' }); assert.equal(ev[1].choices[0].delta.content, 'ok');
  assert.equal(ev[2].choices[0].finish_reason, 'stop'); assert.equal(ev[2].usage.completion_tokens, 3); assert.equal(ev.at(-1), '[DONE]');
  assert.deepEqual([s.up.calls[0].body.stream, 'stream_options' in s.up.calls[0].body], [false, false], 'the burn needs the exact cost: MiniRouter answers whole');
  s.up.s.tools = [{ id: 'call_1', type: 'function', function: { name: 'read', arguments: '{"path":"a"}' } }]; s.up.s.content = '';
  const tools = events(await (await s.call(key, { stream: true })).text());
  assert.deepEqual(tools[1].choices[0].delta.tool_calls, [{ index: 0, id: 'call_1', type: 'function', function: { name: 'read', arguments: '' } }]);
  assert.deepEqual(tools[2].choices[0].delta.tool_calls, [{ index: 0, function: { arguments: '{"path":"a"}' } }]);
  assert.equal(tools[3].choices[0].finish_reason, 'tool_calls');
});

test('PROMPT-TO-MINE halves by date: the same dollar mines 1 in the first six months, 0.5 from the first halving, 1/1024 in the fifth year; the tank tells the rate and the next halving', async () => {
  const s = setup(), key = s.tank('rider-one', 100);
  const mined = async () => Number((await s.call(key)).headers.get('x-space-router-warm'));
  assert.equal(await mined(), drink);
  s.clock.ms = L.halvingAt(OPEN, 1) - 1; assert.equal(await mined(), drink, 'a millisecond before the first halving');
  s.clock.ms = L.halvingAt(OPEN, 1); assert.equal(await mined(), +(drink / 2).toFixed(9));
  s.clock.ms = L.halvingAt(OPEN, 10) + 1; assert.equal(await mined(), +(drink / 1024).toFixed(9), 'the fifth year, when $POOL unlocks');
  const tank = await (await s.ask(TANK_PATH, { method: 'GET', key })).json();
  assert.deepEqual(tank, { tank: 'rider-one', minted: true, fuel_usd: +(100 - 4 * drink).toFixed(9), poured_usd: 100, burned_usd: +(4 * drink).toFixed(9), calls: 4, in_flight: 0,
    warm_mined: +(2 * drink + drink / 2 + drink / 1024).toFixed(9), warm_spent: 0, warm_balance: +(2 * drink + drink / 2 + drink / 1024).toFixed(9), usd_per_warm: 1, rate_now: 1 / 1024, opened_at: '2026-10-31T12:00:00.000Z', next_halving_at: '2032-04-30T12:00:00.000Z' });
  assert.deepEqual(s.burns().map((b) => b.warm), [drink, drink, +(drink / 2).toFixed(9), +(drink / 1024).toFixed(9)], 'each receipt keeps what its burn mined');
  assert.deepEqual(await (await s.ask(MINE_PATH, { method: 'GET' })).json(), { schema: 'embertide.space-router-mine/1', mined: tank.warm_mined, rate_now: 1 / 1024, usd_per_warm: 1, opened_at: tank.opened_at, next_halving_at: tank.next_halving_at }, 'THE MINE\'S SUM IS PUBLIC: no key, and it names no tank and no dollar');
});

test('shut until he opens it: no opening named, no house key, no database or no tables; no key, a stranger\'s, a router key: 401, and nothing is sent', async () => {
  let s = setup({ opened: null }); const key = s.tank('rider-one', 10);
  let r = await s.call(key); assert.equal(r.status, 503); assert.match((await r.json()).error.message, /opens with the \$WARM sale/);
  assert.equal((await s.ask(TANK_PATH, { method: 'GET', key })).status, 200, 'a holder may read the tank before the opening');
  assert.equal((await (await s.ask(TANK_PATH, { method: 'GET', key })).json()).next_halving_at, null); assert.deepEqual(await (await s.ask(MINE_PATH, { method: 'GET' })).json(), { schema: 'embertide.space-router-mine/1', mined: 0, rate_now: 1, usd_per_warm: 1, opened_at: null, next_halving_at: null }, 'before the opening the mine says zero and no date');
  s = setup({ opened: new Date(OPEN + 3_600_000).toISOString() }); r = await s.call(s.tank('rider-one', 10));   // named for an hour ahead (PAY A TANK)
  assert.equal(r.status, 503, 'an opening named ahead keeps the fuel waiting'); assert.equal(s.up.calls.length, 0);
  s = setup({ houseKey: null }); r = await s.call(s.tank('rider-one', 10)); assert.equal(r.status, 503);
  s = setup({ db: false }); r = await s.call('sr_whatever'); assert.equal(r.status, 503);
  s = setup({ through: migrations.indexOf('0011_space_router.sql') }); r = await s.call('sr_whatever'); assert.equal(r.status, 503, 'a database behind the migration');
  s = setup(); s.tank('rider-one', 10);
  for (const k of [undefined, 'sr_not-a-tank-of-ours', 'sk-or-v1-a-router-key']) {
    r = await s.call(k); assert.equal(r.status, 401); assert.equal((await r.json()).error.type, 'authentication_error');
  }
  assert.equal(s.up.calls.length, 0, 'nothing went upstream');
});

test('a dry tank is a 402 and nothing is sent; the last call may drink past zero; calls in flight hold the fair price; a hold that never came back holds nothing after fifteen minutes', async () => {
  const s = setup();
  const dry = s.tank('dry');
  let r = await s.call(dry); assert.equal(r.status, 402); assert.match((await r.json()).error.message, /empty/); assert.equal(s.up.calls.length, 0);
  s.db.exec(refillSql('dry', 0.06, 'a little'));
  r = await s.call(dry); assert.equal(r.status, 200, 'fuel above nothing lets one call in');
  assert.equal(+(s.row('dry').poured_usd - s.row('dry').drunk_usd).toFixed(9), -0.042795, 'it drank past zero by what it cost over its hold');
  r = await s.call(dry); assert.equal(r.status, 200, 'THE COUNTER-TANK DRINKS: the $WARM that call mined pays the next'); assert.deepEqual([r.headers.get('x-space-router-warm'), r.headers.get('x-space-router-warm-spent')], ['0', String(drink)], 'paid in $WARM, it mined nothing');
  r = await s.call(dry); assert.equal(r.status, 402, 'dollars and $WARM both gone');
  const busy = s.tank('busy', 0.08);
  let open; s.up.s.gate = new Promise((ok) => { open = ok; });
  const first = s.call(busy), second = s.call(busy);
  await new Promise((ok) => setTimeout(ok, 20));
  r = await s.call(busy); assert.equal(r.status, 402); assert.match((await r.json()).error.message, /in flight hold all/, 'two holds of 5 cents each hold all of 8 cents');
  assert.equal((await (await s.ask(TANK_PATH, { method: 'GET', key: busy })).json()).in_flight, 2);
  open(); s.up.s.gate = null;
  assert.deepEqual([(await first).status, (await second).status], [200, 200]);
  const stale = s.tank('stale', 1);
  s.db.prepare('INSERT INTO sr_holds(tank, usd, at) VALUES (?, ?, ?)').run('stale', 100, s.clock.ms - HOLD_MS - 1);
  r = await s.call(stale); assert.equal(r.status, 200, 'a hold older than fifteen minutes holds nothing');
  assert.equal(s.db.prepare('SELECT COUNT(*) AS n FROM sr_holds').get().n, 0, 'and the burn sweeps it');
});

test('the router\'s refusals cost nothing; the house\'s credit is never the caller\'s tank; the credit reservation is retried with a quarter of the output; an unsaid cost is charged at the hold, marked estimated', async () => {
  const s = setup(), key = s.tank('rider-one', 10), none = () => s.burns().length;
  s.up.s.fail = true; let r = await s.call(key); assert.equal(r.status, 502); assert.match((await r.json()).error.message, /Nothing was charged/); s.up.s.fail = false;
  s.up.s.status = 402; s.up.s.error = 'Insufficient credits'; r = await s.call(key);
  assert.deepEqual([r.status, r.headers.get('retry-after')], [503, '60']); assert.match((await r.json()).error.message, /refuelling/);
  s.up.s.status = 400; s.up.s.error = 'unknown model zz'; r = await s.call(key); assert.equal(r.status, 400); assert.match((await r.json()).error.message, /unknown model zz.*Nothing was charged/);
  s.up.s.status = 429; r = await s.call(key); assert.deepEqual([r.status, r.headers.get('retry-after')], [429, '7']);
  s.up.s.status = 200;
  assert.equal(none(), 0); assert.equal(s.db.prepare('SELECT COUNT(*) AS n FROM sr_holds').get().n, 0, 'every refusal freed its hold');
  s.up.s.refuseAbove = 8192; r = await s.call(key, { max_tokens: 32768 });
  assert.equal(r.status, 200); assert.deepEqual(s.up.calls.slice(-2).map((c) => c.body.max_tokens), [32768, 8192], 'a quarter of the output, once');
  s.up.s.refuseAbove = Infinity;
  s.up.s.where = 'usage'; r = await s.call(key); assert.equal(r.headers.get('x-space-router-usd'), '0.102795', 'usage.cost when the header is missing');
  s.up.s.where = 'none'; r = await s.call(key);
  const last = s.burns().at(-1);
  assert.deepEqual([last.estimated, last.router_usd, last.usd], [1, null, drink], 'charged the fair price of the exact drinks before it (both 0.102795)');
  const guess = s.tank('guess', 10), usd = async () => Number((await s.call(guess)).headers.get('x-space-router-usd'));
  s.up.s.where = 'none'; assert.equal(await usd(), L.FIRST_HOLD_USD, 'a first call whose cost is unsaid: 5 cents');
  s.up.s.where = 'header'; assert.equal(await usd(), drink);
  s.up.s.where = 'none'; assert.equal(await usd(), drink, 'the fair price is the exact drinks\' alone: a guess never prices the next guess');
});

test('PROMPT-TO-MINE IS FOR WHO MINTED: a tank with no mint drinks the same, mines nothing and leaves the mine as it was; a hexagon of its own, or a tracenet it bought, and it mines; nothing else is a mint', async () => {
  const s = setup(), owed = () => +s.db.prepare('SELECT owed FROM sr_mine').get().owed.toFixed(9), mined = async (key, extra) => Number((await s.call(key, extra)).headers.get('x-space-router-warm')), told = async (k) => (await (await s.ask(TANK_PATH, { method: 'GET', key: k })).json()).minted;
  const key = s.tank('claw-rider', 20, { minted: false }); assert.equal(await mined(s.tank('snowtracer', 20)), drink, 'one that minted mines as it did');
  const r = await s.call(key), b = s.burns().at(-1), t = s.row('claw-rider');
  assert.deepEqual([r.status, r.headers.get('x-space-router-usd'), r.headers.get('x-space-router-warm'), b.usd, b.router_usd, b.warm, +t.drunk_usd.toFixed(9), t.calls, t.warm, owed()],
    [200, String(drink), '0', drink, 0.0979, 0, drink, 1, 0, drink], 'it drinks the same; its answer, its row and its tank say 0, never the share the mine gave last, and the mine owes no more');
  s.deposit('claw-rider', 9.99); s.deposit('claw-rider', 50, false); s.deposit('someone-else', 1000); s.db.exec(refillSql('claw-rider', 5, 'tracenet:a gift'));
  assert.equal(await mined(key, { model: 'tracenet' }), 0, 'no mint: a deposit that took no place on the ball, another tank\'s hexagon, a refill or a model by a tracenet\'s name'); assert.equal(await told(key), false, 'THE GOLD IS FOR WHO MINTED: its tank says so');
  let open; s.up.s.gate = new Promise((ok) => { open = ok; }); const sent = s.up.calls.length, early = s.call(key); for (let i = 0; i < 9999 && s.up.calls.length === sent; i++) await new Promise((ok) => setTimeout(ok, 1));
  for (let i = 0; i < 40; i++) s.deposit('claw-rider', 5); s.deposit('claw-rider', 12); for (let i = 0; i < 40; i++) s.deposit('claw-rider', 100, false); open(); s.up.s.gate = null;
  assert.equal((await early).headers.get('x-space-router-warm'), '0', 'a call let in before the mint mines nothing'); assert.equal(await mined(key), drink, 'the next one mines, however many small deposits came before its hexagon and however large the refills after it'); assert.equal(await told(key), true, 'and its tank says it minted');
  const stood = s.tank('mined-before', drink, { minted: false }); s.db.exec("UPDATE sr_tanks SET warm = 0.2 WHERE name = 'mined-before'"); await s.call(stood);
  assert.equal((await s.call(stood)).headers.get('x-space-router-warm-spent'), String(drink), 'what a tank had mined before the rule is its own: it still pays a call');
  const plan = s.db.prepare(`EXPLAIN QUERY PLAN SELECT ${MINTED}`).all('claw-rider').map((x) => x.detail).join('\n'); assert.match(plan, /sr_deposits USING COVERING INDEX sr_deposits_tank/);
  assert.match(plan, /sr_ledger USING INDEX sr_ledger_why/); assert.doesNotMatch(plan, /SCAN (sr_|d\b)|TEMP B-TREE/, 'bounded (migration 0029): no table is scanned, nothing is sorted');
  const behind = setup({ through: migrations.indexOf('0020_the_drops.sql') }); assert.equal((await behind.call(behind.tank('rider-one', 10))).status, 503, 'a database with no list of hexagons is shut'); assert.equal(behind.up.calls.length, 0);
});

test('the mine stops at its size once he names it: what is left of it is mined, then nothing', async () => {
  const s = setup({ mine: 0.15 }), key = s.tank('rider-one', 10);
  const mined = [];
  for (let i = 0; i < 3; i++) mined.push(Number((await s.call(key)).headers.get('x-space-router-warm')));
  assert.deepEqual(mined, [drink, +(0.15 - drink).toFixed(9), 0]);
  assert.equal(+s.row('rider-one').warm.toFixed(9), 0.15); assert.equal(+s.db.prepare('SELECT owed FROM sr_mine').get().owed.toFixed(9), 0.15);
  assert.equal(+(10 - s.row('rider-one').poured_usd + s.row('rider-one').drunk_usd).toFixed(9), +(3 * drink).toFixed(9), 'the calls still drink');
});

test('the models are MiniRouter\'s, for a tank\'s key, read once in ten minutes; the doors refuse a wrong method, a body too long, not JSON, no messages; another path is a 404', async () => {
  const s = setup(), key = s.tank('rider-one', 10);
  assert.equal((await s.ask(MODELS_PATH, { method: 'GET' })).status, 401);
  assert.deepEqual((await (await s.ask(MODELS_PATH, { method: 'GET', key })).json()).data, [{ id: SOL }]);
  await s.ask(MODELS_PATH, { method: 'GET', key }); assert.equal(s.up.calls.filter((c) => c.url.endsWith('/models')).length, 1);
  assert.equal((await s.ask(CHAT_PATH, { method: 'GET', key })).headers.get('allow'), 'POST');
  assert.equal((await s.ask(CHAT_PATH, { key, body: 'x'.repeat(BODY_BYTES + 1) })).status, 413);
  assert.equal((await s.ask(CHAT_PATH, { key, body: '{not json' })).status, 400);
  assert.equal((await s.ask(CHAT_PATH, { key, body: { model: SOL, messages: [] } })).status, 400);
  assert.equal((await s.ask('/space-router/v1/embeddings', { key, body: {} })).status, 404);
  assert.equal(s.up.calls.filter((c) => c.url.endsWith('/chat/completions')).length, 0);
});

test('the tank tool: a key made once and kept only as its hash; a refill pours into a named tank only and mines nothing; show reads the sums', () => {
  const s = setup(), key = newKey();
  assert.match(key, /^sr_[A-Za-z0-9_-]{43}$/);
  s.db.exec(addSql('sponsored-one', keyHash(key), { markupBps: 0 }));
  assert.deepEqual({ ...s.db.prepare('SELECT name, key_sha256, markup_bps FROM sr_tanks').get() }, { name: 'sponsored-one', key_sha256: keyHash(key), markup_bps: 0 });
  assert.equal(JSON.stringify(s.db.prepare('SELECT * FROM sr_tanks').all()).includes(key), false, 'the key itself is nowhere');
  s.db.exec(refillSql('sponsored-one', 30, "a rider's month"));
  s.db.exec(refillSql('no-such-tank', 30));
  assert.deepEqual(s.db.prepare("SELECT tank, usd, warm, why FROM sr_ledger WHERE kind = 'refill'").all().map((r) => ({ ...r })), [{ tank: 'sponsored-one', usd: 30, warm: null, why: "a rider's month" }]);
  assert.deepEqual({ ...s.db.prepare(showSql('sponsored-one')).get() }, { name: 'sponsored-one', markup_bps: 0, fuel_usd: 30, poured_usd: 30, burned_usd: 0, calls: 0, warm_mined: 0 });
  assert.throws(() => addSql('Bad Name', keyHash(key))); assert.throws(() => refillSql('sponsored-one', -1)); assert.throws(() => addSql('x', 'nothex'));
});

test('THE COUNTER-TANK DRINKS: past its dollars a call drinks the tank\'s $WARM and mines nothing; both gone is a 402 that names both; the tank tells its balance', async () => {
  const s = setup(), key = s.tank('rider-one', drink), told = (r) => ['x-space-router-warm', 'x-space-router-warm-spent', 'x-space-router-fuel-usd'].map((h) => r.headers.get(h));
  assert.deepEqual(told(await s.call(key)), [String(drink), '0', '0'], 'the dollars drank, and mined'); assert.deepEqual(told(await s.call(key)), ['0', String(drink), '0'], 'the $WARM paid, and mined nothing');
  const b = s.burns().at(-1), t = s.row('rider-one'); assert.deepEqual([b.usd, b.warm, b.warm_spent, +t.drunk_usd.toFixed(9), +t.warm.toFixed(9), +t.warm_spent.toFixed(9)], [drink, 0, drink, drink, drink, drink]);
  const r = await s.call(key); assert.equal(r.status, 402); assert.match((await r.json()).error.message, /\$0\.000000, 0\.000000 \$WARM/); assert.equal(s.up.calls.length, 2, 'nothing was sent');
  const tank = await (await s.ask(TANK_PATH, { method: 'GET', key })).json(); assert.deepEqual([tank.warm_mined, tank.warm_spent, tank.warm_balance, tank.usd_per_warm], [drink, drink, 0, L.USD_PER_WARM]);
});

test('SPENT $WARM GOES BACK TO THE MINE: where the mine is named the ledger\'s $WARM is no credit; a tank drinks what its flasks paid back after its dollars, mining nothing on it; two calls split from one tank never take it below nothing', async () => {
  const seatWasm = new WebAssembly.Module((await import('node:fs')).readFileSync(new URL('./poleis-seat.wasm', import.meta.url))), s = setup({ seatWasm }), key = s.tank('rider-one', drink), spent = (r) => r.headers.get('x-space-router-warm-spent'); s.env.SPACE_ROUTER_MINE = (await import('./space-router-seat.mjs')).lawOf(seatWasm).mine({ do: 'terms' }).mine; assert.equal(spent(await s.call(key)), '0'); const dry = await s.call(key); assert.deepEqual([dry.status, /0\.000000 \$WARM/.test((await dry.json()).error.message)], [402, true], 'the ledger\'s $WARM, a drink\'s worth, is no credit'); s.db.prepare("UPDATE sr_tanks SET warm_back = ? WHERE name = 'rider-one'").run(1.5 * drink); let open; s.up.s.gate = new Promise((ok) => { open = ok; }); const two = [s.call(key), s.call(key)]; while (s.up.calls.length < 3) await new Promise((ok) => setTimeout(ok, 5)); open();   // what its flask paid back, as the deposit door counts it; both calls held at the router, so both split their price from the same tank
  const both = await Promise.all(two), t = s.row('rider-one'); assert.deepEqual([both.map((r) => r.status), both.map(spent).sort(), +t.warm_back.toFixed(9), +t.warm_spent.toFixed(9), +t.warm_drunk.toFixed(9), s.burns().slice(-2).map((b) => +b.warm.toFixed(9)).sort(), (await s.call(key)).status], [[200, 200], [String(+(0.5 * drink).toFixed(9)), String(drink)], 0, +(1.5 * drink).toFixed(9), +(1.5 * drink).toFixed(9), [0, +(0.5 * drink).toFixed(9)], 402], 'the first took a drink\'s worth, the second only what was left, its rest in dollars that mine; what it drank as credits is the take-back\'s target; then dry');
});

test('A TRACENET IS BOUGHT FROM THE TANK: shut until he names the price; it leaves the tank\'s dollars as one burn that mines $WARM, for it is itself a mint; the same id pays once; a short tank pays nothing; calls never hold its price', async () => {
  const s = setup(), key = s.tank('maker', 20, { minted: false }), id = 'a'.repeat(32);
  assert.equal((await s.ask(TRACENET_PATH, { method: 'GET' })).status, 503, 'no price named: shut');
  assert.equal((await s.ask(TRACENET_PATH, { key, body: { id } })).status, 503);
  s.env.SPACE_ROUTER_TRACENET_SOL = '0.1';   // his Nov 3 "0.1 sol", at the stand-in's $150 a SOL
  assert.deepEqual(await (await s.ask(TRACENET_PATH, { method: 'GET' })).json(), { sol: 0.1, usd: 15, sol_usd: 150 }, 'the price, to anyone: in SOL, and its dollars now');
  assert.equal((await s.ask(TRACENET_PATH, { body: { id } })).status, 401, 'no key');
  assert.equal((await s.ask(TRACENET_PATH, { key, body: { id: 'not-hex' } })).status, 400);
  const r = await s.ask(TRACENET_PATH, { key, body: { id } }), j = await r.json();
  assert.equal(r.status, 201); assert.deepEqual([j.id, j.sol, j.usd, j.warm, j.fuel_usd], [id, 0.1, 15, 15, 5], '0.1 SOL is $15 out of $20, 15 $WARM mined at the opening\'s rate');
  const b = s.burns().at(-1);
  assert.deepEqual([b.kind, b.tank, b.usd, b.router_usd, b.warm, b.model, b.why, b.tokens_in], ['burn', 'maker', 15, 0, 15, 'tracenet', `tracenet:${id}`, null], 'the receipt: what, when, how much, nothing more');
  assert.deepEqual([s.row('maker').drunk_usd, s.row('maker').warm, s.row('maker').calls], [15, 15, 0]);
  s.clock.ms += 1000;
  const again = await s.ask(TRACENET_PATH, { key, body: { id } });
  assert.equal(again.status, 200, 'the same id: the same receipt'); assert.equal((await again.json()).receipt, j.receipt); assert.equal(s.row('maker').drunk_usd, 15, 'nothing taken twice');
  const short = await s.ask(TRACENET_PATH, { key, body: { id: 'b'.repeat(32) } });
  assert.equal(short.status, 402, '$5 left, $15 asked'); assert.match((await short.json()).error.message, /\$5\.00.*0\.1 SOL, \$15\.00 now/);
  assert.deepEqual([s.row('maker').drunk_usd, s.burns().length], [15, 1], 'nothing taken, no row');
  s.up.s.solUsd = 'not a price'; s.clock.ms += 61_000;
  assert.equal((await s.ask(TRACENET_PATH, { key, body: { id: 'c'.repeat(32) } })).status, 503, 'no live SOL price: nothing taken'); assert.equal(s.row('maker').drunk_usd, 15);
  s.up.s.solUsd = '150.00';
  let open; s.up.s.gate = new Promise((ok) => { open = ok; });
  const pending = s.call(key); await new Promise((ok) => setTimeout(ok, 30));
  assert.equal(s.db.prepare('SELECT usd FROM sr_holds').get().usd, L.FIRST_HOLD_USD, 'a call holds the fair price of calls, never a tracenet\'s');
  open(); const after = await pending; assert.deepEqual([after.status, after.headers.get('x-space-router-warm')], [200, String(drink)], 'the tank minted: its calls mine from then on'); assert.equal((await (await s.ask(TANK_PATH, { method: 'GET', key })).json()).minted, true, 'and it says so');
});

test('THE MINE IS LIVE: a receipt names its burn, the ledger row its own batch wrote, two calls of one millisecond each their own; a database behind migration 0031 shuts the door before anything is sent', async () => {
  const s = setup(), key = s.tank('rider-one', 10); await s.call(key); await s.call(key); const one = (sql) => Object.values(s.db.prepare(sql).get())[0];
  assert.deepEqual([one('SELECT COUNT(*) FROM sr_receipts'), one("SELECT COUNT(DISTINCT r.burn) FROM sr_receipts r JOIN sr_ledger l ON l.id = r.burn AND l.at = r.at AND l.tank = r.tank AND l.kind = 'burn' AND l.usd = " + drink)], [2, 2]);
  const old = setup({ through: migrations.findIndex((m) => m.startsWith('0031')) }), r = await old.call(old.tank('rider-one', 10)); assert.deepEqual([r.status, old.up.calls.length], [503, 0], 'a Worker ahead of its migration answers shut, and sends nothing it could not write');
});

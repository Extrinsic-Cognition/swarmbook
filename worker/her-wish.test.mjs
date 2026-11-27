// her-wish.test.mjs · THE WISH IS A CALL, IN THE APP (worker/space-router.mjs hello and wish, lane/the-wish-is-a-call; his Nov 1 2026 02:11 UTC "3 wishes as CAC *
// social proof as K-factor", 04:51 UTC "there should be 0 wishes granted outside of the app... that is our foot-in-the-door gtm operation dude"): her wish, one
// call on the house's own tank, granted under DysonLight's own key alone, on a database built by every migration in order, as D1 applies them, through the
// Worker's own handler. MiniRouter is a stand-in (no network, no money); Apple and Google are invented (worker/invented-apple.mjs, worker/invented-android.mjs:
// their roots, the phones' keys); Google's revocation list is the stand-in's too.
// node --test worker/her-wish.test.mjs (Node 22+).
import test from 'node:test';
import assert from 'node:assert/strict';
import { d1, migrated } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by every migration in order
import { createHash } from 'node:crypto';
import { createHandler } from './premint.mjs';
import { WISH_PATH, HELLO_PATH, APP_PATH, AASA_PATH, ASSETLINKS_PATH, CHAT_PATH, SWARMY, WISH_TOKENS, WISH_PER_MINUTE, FUEL, DAY_MS, IN_APP } from './space-router.mjs';
import { inventedApple } from './invented-apple.mjs';
import { inventedGoogle, PACKAGE, DIGEST } from './invented-android.mjs';
import { STATUS_URL } from './android-attest.mjs';
import * as L from '../app/space-router-law.mjs';
import * as W from '../app/dl-her-wishes.mjs';
import { newOracleKey } from '../app/space-router-oracle.mjs';
import { addSql, refillSql, keyHash, newKey } from '../tools/space-router-tank.mjs';

const SITE = 'https://optimism.fit', DAY0 = Date.UTC(2026, 10, 1), NOW = DAY0 + 9 * 3600_000, HOUSE_KEY = 'mr-house-key-for-tests', MODEL = 'a/small-model';
const STORE = 'https://apps.apple.com/app/dysonlight/id0000000000', PLAY = 'https://play.google.com/store/apps/details?id=fit.example.dysonlight';   // invented pages in the stores
const ORACLE = await newOracleKey(), APPLE = inventedApple({ now: NOW }), GOOGLE = inventedGoogle({ now: NOW }), ELSEWHERE = inventedApple({ now: NOW, appId: 'ZZZZZ99999.fit.example.other' });

function router() {   // MiniRouter, a stand-in: its exact cost in its header, its answer, its refusals; every call it was sent
  const s = { cost: 0.0012, content: 'Granted: here is your plan.', status: 200, revoked: [], statusDown: false }, calls = [], lists = [];
  async function fetcher(url, init = {}) {
    if (String(url) === STATUS_URL) { lists.push(Date.now()); return s.statusDown ? new Response('down', { status: 503 })   // Google's revocation list, as Google writes it
      : new Response(JSON.stringify({ entries: Object.fromEntries(s.revoked.map((k) => [k, { status: 'REVOKED', reason: 'KEY_COMPROMISE' }])) }), { status: 200 }); }
    const body = init.body ? JSON.parse(init.body) : null; calls.push({ url: String(url), auth: init.headers?.authorization, body });
    if (s.status !== 200) return new Response(JSON.stringify({ error: { message: 'busy' } }), { status: s.status });
    return new Response(JSON.stringify({ id: 'chatcmpl-1', object: 'chat.completion', created: 1, model: body.model, choices: [{ index: 0, message: { role: 'assistant', content: s.content }, finish_reason: 'stop' }],
      usage: { prompt_tokens: 40, completion_tokens: 30, total_tokens: 70 } }), { status: 200, headers: { 'content-type': 'application/json', 'x-minirouter-cost-usd': String(s.cost) } });
  }
  return { s, calls, lists, fetcher };
}
function setup({ tank = 'wishes', pour = 1, model = MODEL, day = '0.5', opened = null, named = true, apps = APPLE.appId, root = APPLE.pem, store = STORE, play = null } = {}) {
  const db = migrated();
  const up = router(), clock = { ms: NOW }, handle = createHandler({ fetcher: up.fetcher, clockMs: () => clock.ms });
  if (tank && named) { db.exec(addSql(tank, keyHash(newKey()), { nowMs: clock.ms })); if (pour) db.exec(refillSql(tank, pour, 'the house sponsors her wishes', { nowMs: clock.ms })); }
  const env = { ASSETS: { fetch: () => new Response('asset') }, DB: d1(db), SPACE_ROUTER_KEY: HOUSE_KEY, SPACE_ROUTER_ORACLE_KEY: ORACLE.secret,
    ...(tank ? { SPACE_ROUTER_WISH_TANK: tank } : {}), ...(model ? { SPACE_ROUTER_WISH_MODEL: model } : {}), ...(day ? { SPACE_ROUTER_WISH_USD_DAY: day } : {}),
    ...(apps ? { SPACE_ROUTER_WISH_APPS: apps } : {}), ...(root ? { SPACE_ROUTER_WISH_ROOT: root } : {}), ...(store ? { SPACE_ROUTER_WISH_STORE: store } : {}), ...(play ? { SPACE_ROUTER_WISH_PLAY: play } : {}),
    ...(opened ? { SPACE_ROUTER_OPENED_AT: opened } : {}) };
  const ask = (path, { method = 'GET', body, origin = method === 'POST' ? SITE : null, type = 'application/json', ip = '203.0.113.7', ua = null } = {}) => handle(new Request(`${SITE}${path}`, { method,
    headers: { ...(origin ? { origin } : {}), ...(body !== undefined ? { 'content-type': type } : {}), 'cf-connecting-ip': ip, ...(ua ? { 'user-agent': ua } : {}) },
    body: body === undefined ? undefined : typeof body === 'string' ? body : JSON.stringify(body) }), env, {});
  const win = () => W.windowOf(clock.ms);
  /** her page in the app, on a phone: hello proves helloData(window, friend), a wish proves wishData(window, words), as the cover's bridge does */
  const app = (phone = APPLE.phone()) => ({
    phone, hello: (friend = null, o = {}) => { const w = o.window ?? win(), p = phone.prove(W.helloData(w, friend)); return ask(HELLO_PATH, { method: 'POST', body: { key: W.keyOf(p.key), window: w, friend, ...p, key: W.keyOf(p.key) }, ...o }); },
    wish: (words, o = {}) => { const w = o.window ?? win(), p = phone.prove(W.wishData(w, words)); return ask(WISH_PATH, { method: 'POST', body: { key: W.keyOf(p.key), window: w, wish: words, assertion: p.assertion }, ...o }); },
  });
  const rows = () => db.prepare('SELECT id, code, usd, leaf FROM her_wishes ORDER BY id').all().map((r) => ({ ...r }));
  const apps_ = () => db.prepare('SELECT key, code, app, counter, friend FROM her_apps ORDER BY at, code').all().map((r) => ({ ...r }));
  const tankRow = (name = tank) => ({ ...db.prepare('SELECT * FROM sr_tanks WHERE name = ?').get(name) });
  const dump = () => db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map(({ name }) => JSON.stringify(db.prepare(`SELECT * FROM "${name}"`).all())).join('\n');
  return { db, env, up, clock, ask, app, rows, apps: apps_, tankRow, dump };
}
const read = async (r) => ({ status: r.status, body: await r.json() });
const codeOf = (phone) => W.codeOfDigest(createHash('sha256').update(`${W.HER_KEY_DOMAIN}\n${W.keyOf(phone.keyId)}`).digest());

test('the door is shut until he names the tank, the model, the day\'s ceiling, the apps and Apple\'s root, and the tank stands: GET says so, nothing is asked', async () => {
  for (const o of [{ tank: null }, { model: null }, { day: null }, { day: '0' }, { named: false }, { apps: null }, { apps: 'not-an-app' }, { root: null }, { root: 'not a certificate' }]) {
    const s = setup(o), a = s.app();
    assert.deepEqual(await read(await s.ask(WISH_PATH)), { status: 200, body: { open: false } }, JSON.stringify(o));
    assert.equal((await a.hello()).status, 503, JSON.stringify(o));
    assert.deepEqual([s.up.calls.length, s.rows().length, s.apps().length], [0, 0, 0]);
  }
  const s = setup(); delete s.env.SPACE_ROUTER_KEY;
  assert.deepEqual((await read(await s.ask(WISH_PATH))).body, { open: false }, 'no house key: shut');
  assert.deepEqual((await read(await setup().ask(WISH_PATH))).body, { open: true, store: STORE, play: null }, 'open: and where the app is');
  assert.deepEqual((await read(await setup({ store: 'http://not-https.example', play: PLAY }).ask(WISH_PATH))).body, { open: true, store: null, play: PLAY });
});

test('0 wishes outside the app: her page\'s old word, a script, a curl, a key never born, a forged or another app\'s proof, all refused before a call', async () => {
  const s = setup();
  for (const body of [{ code: 'AAAAAAAAAA', wish: 'a plan for my week' }, { wish: 'x' }, {}]) {
    const r = await read(await s.ask(WISH_PATH, { method: 'POST', body }));
    assert.deepEqual([r.status, r.body.error.message], [403, IN_APP], JSON.stringify(body));
  }
  const p = APPLE.phone(), never = await read(await s.ask(WISH_PATH, { method: 'POST', body: { key: W.keyOf(p.keyId), window: W.windowOf(s.clock.ms), wish: 'x', assertion: p.assert('x') } }));
  assert.equal(never.status, 409, 'a key never born: her hello attests it first');
  const forged = s.app(); assert.equal((await forged.hello()).status, 200);
  const bad = await read(await s.ask(WISH_PATH, { method: 'POST', body: { key: W.keyOf(forged.phone.keyId), window: W.windowOf(s.clock.ms), wish: 'x', assertion: APPLE.phone().assert('x') } }));
  assert.deepEqual([bad.status, /not signed by the attested key/.test(bad.body.error.message)], [403, true], 'another key\'s signature');
  const other = await read(await s.app(ELSEWHERE.phone()).hello());
  assert.equal(other.status, 403, 'an app under another root'); assert.match(other.body.error.message, /does not end under the root/);
  const foreignApp = await read(await s.app(APPLE.phone({ app: 'ZZZZZ99999.fit.example.other' })).hello());
  assert.equal(foreignApp.status, 403); assert.match(foreignApp.body.error.message, /app the door does not name/);
  const dev = await read(await s.app(APPLE.phone({ environment: 'development' })).hello());
  assert.equal(dev.status, 403, 'a developer\'s build, while the app is named in production'); assert.match(dev.body.error.message, /development environment/);
  assert.equal((await s.ask(HELLO_PATH, { method: 'POST', body: { key: W.keyOf(APPLE.phone().keyId), window: W.windowOf(s.clock.ms) } })).status, 409, 'a hello with no proof is an assertion of no key');
  assert.equal((await s.ask(WISH_PATH, { method: 'POST', body: { code: 'AAAAAAAAAA', wish: 'x' }, origin: 'https://elsewhere.example', ip: '192.0.2.1' })).status, 403, 'another site');
  assert.equal((await s.ask(WISH_PATH, { method: 'POST', body: 'code=AAAAAAAAAA&wish=x', type: 'application/x-www-form-urlencoded', ip: '192.0.2.2' })).status, 403, 'a form');
  assert.equal(s.up.calls.length, 0, 'not one call asked of the router');
  assert.equal(s.rows().length, 0, 'not one wish granted');
});

test('her hello in the app: her her born at her key\'s first word, her code the key\'s; every later open an assertion that moves her counter; a replay is refused', async () => {
  const s = setup(), a = s.app(), code = codeOf(a.phone);
  const one = await read(await a.hello());
  assert.deepEqual(one, { status: 200, body: { code, wishes: { granted: 3, used: 0, left: 3 } } });
  assert.ok(W.isHerCode?.(code) ?? /^[0-9A-HJKMNP-TV-Z]{10}$/.test(code), 'a her code');
  assert.deepEqual(s.apps(), [{ key: W.keyOf(a.phone.keyId), code, app: APPLE.appId, counter: 0, friend: null }], 'one row: the key, her code, the app; no address, no name');
  const again = await read(await a.hello());
  assert.deepEqual(again, { status: 200, body: { code, wishes: { granted: 3, used: 0, left: 3 } } }, 'the same her at the next open');
  assert.equal(s.apps()[0].counter, 1, 'its counter moved');
  const w = W.windowOf(s.clock.ms), old = a.phone.assert(W.helloData(w, null));
  assert.equal((await s.ask(HELLO_PATH, { method: 'POST', body: { key: W.keyOf(a.phone.keyId), window: w, assertion: old } })).status, 200, 'counter 2');
  const replay = await read(await s.ask(HELLO_PATH, { method: 'POST', body: { key: W.keyOf(a.phone.keyId), window: w, assertion: old } }));
  assert.deepEqual([replay.status, /did not advance/.test(replay.body.error.message)], [403, true], 'the same word twice');
  const stale = await read(await a.hello(null, { window: w - 2 })), ahead = await a.hello(null, { window: w + 1 });
  assert.equal(stale.status, 403, 'a proof of a window past'); assert.equal(ahead.status, 200, 'a phone a little ahead');
  a.phone.wipe(); const reborn = await read(await a.hello());
  assert.equal(reborn.status, 200, 'a phone erased whole (a new mark, a new key) is a new her'); assert.notEqual(reborn.body.code, code);
});

test('ONE PHONE, ONE BIRTH: a reinstall (a new key, the keychain\'s mark) takes back her code, her friends and her wishes as they stood; no new three, no friend counted twice', async () => {
  const s = setup(), a = s.app(), code = codeOf(a.phone), friend = s.app();
  assert.equal((await friend.hello()).status, 200); const fcode = codeOf(friend.phone);
  assert.equal((await a.hello(fcode)).status, 200); assert.equal((await a.wish('a plan for my week')).status, 200);
  assert.deepEqual((await read(await friend.hello())).body.wishes, { granted: 4, used: 0, left: 4 }, 'her friend was born in the app: one more for the friend');
  const before = s.apps().find((r) => r.code === code);
  a.phone.forget();   // the app deleted and installed again: a new key, the keychain's mark kept
  const back = await read(await a.hello(fcode));
  assert.deepEqual(back, { status: 200, body: { code, wishes: { granted: 3, used: 1, left: 2 } } }, 'her back, her wishes as they stood');
  const after = s.apps().find((r) => r.code === code);
  assert.deepEqual([s.apps().length, after.key, after.counter, after.friend], [2, W.keyOf(a.phone.keyId), 0, before.friend], 'one row: re-keyed, her friend as born');
  assert.deepEqual((await read(await friend.hello())).body.wishes, { granted: 4, used: 0, left: 4 }, 'the reinstall is no second friend');
  assert.equal((await a.wish('again')).status, 200, 'the new key wishes'); assert.equal(s.rows().length, 2);
  const unmarked = APPLE.phone(), w = W.windowOf(s.clock.ms), p = unmarked.prove(W.helloData(w, null));
  const bare = await read(await s.ask(HELLO_PATH, { method: 'POST', body: { key: W.keyOf(p.key), window: w, attestation: p.attestation }, ip: '198.51.100.1' }));
  assert.deepEqual([bare.status, /no phone's mark/.test(bare.body.error.message)], [403, true], 'a first word with no mark');
  const lifted = APPLE.phone(), q = lifted.prove(W.helloData(w, null));
  const swapped = await read(await s.ask(HELLO_PATH, { method: 'POST', body: { key: W.keyOf(q.key), window: w, attestation: q.attestation, phone: a.phone.mark }, ip: '198.51.100.2' }));
  assert.deepEqual([swapped.status, /nonce/.test(swapped.body.error.message)], [403, true], 'another phone\'s mark laid on an attestation: the attestation does not bind it');
  assert.equal(s.apps().length, 2, 'nothing born of them');
});

test('ANDROID PROVES ITSELF: DysonLight on Android is born by its keystore\'s attestation and wishes by its key; an unlocked boot, another app, a revoked chain are refused', async () => {
  const both = `${APPLE.appId} ${GOOGLE.app('production')}`, roots = APPLE.pem + GOOGLE.pem;
  const s = setup({ apps: both, root: roots }), a = s.app(GOOGLE.phone());
  const one = await read(await a.hello());
  assert.deepEqual([one.status, one.body.wishes], [200, { granted: 3, used: 0, left: 3 }]);
  assert.deepEqual(s.apps().map((r) => [r.app, r.counter]), [[`android:${PACKAGE}`, 0]]);
  assert.equal((await a.wish('a plan for my week')).status, 200, 'a wish under the Android key'); assert.equal(s.up.calls.length, 1);
  const w = W.windowOf(s.clock.ms), old = a.phone.assert(W.helloData(w, null));
  assert.equal((await s.ask(HELLO_PATH, { method: 'POST', body: { key: a.phone.keyId, window: w, assertion: old } })).status, 200);
  assert.equal((await s.ask(HELLO_PATH, { method: 'POST', body: { key: a.phone.keyId, window: w, assertion: old } })).status, 403, 'a replay');
  a.phone.forget(); assert.equal((await read(await a.hello())).body.wishes.used, 1, 'a reinstall on Android: her back');
  const unlocked = await read(await s.app(GOOGLE.phone({ locked: false, verified: false })).hello());
  assert.deepEqual([unlocked.status, /boot is not locked/.test(unlocked.body.error.message)], [403, true], 'an unlocked phone, the app named in production');
  const dev = setup({ apps: GOOGLE.app('development'), root: GOOGLE.pem });
  assert.equal((await dev.app(GOOGLE.phone({ locked: false, verified: false })).hello()).status, 200, 'the house\'s own unlocked phones, the app named for development');
  const other = await read(await s.app(GOOGLE.phone({ ofDigest: 'cd'.repeat(32) })).hello());
  assert.deepEqual([other.status, /app the door does not name/.test(other.body.error.message)], [403, true], 'another signing key');
  const soft = await read(await s.app(GOOGLE.phone({ security: 0 })).hello());
  assert.deepEqual([soft.status, /trusted environment/.test(soft.body.error.message)], [403, true], 'a key in software');
  const r = setup({ apps: both, root: roots }); r.up.s.revoked = [GOOGLE.int.serial.toString(16)];
  const revoked = await read(await r.app(GOOGLE.phone()).hello());
  assert.deepEqual([revoked.status, /revoked/.test(revoked.body.error.message)], [403, true], 'a leaked keybox, revoked by Google');
  const d = setup({ apps: both, root: roots }); d.up.s.statusDown = true;
  assert.equal((await d.app(GOOGLE.phone()).hello()).status, 503, 'the list unread: no Android birth'); assert.equal(d.apps().length, 0);
  assert.equal((await d.app(APPLE.phone()).hello()).status, 200, 'the iPhone does not wait on Google');
  assert.equal(s.up.lists.length, 1, 'the list read once an hour, however many births');
});

test('her three wishes in the app ride the router on the house\'s tank: three answers, each a burn, a receipt and a wish\'s row, no $WARM, no word kept; the fourth: Fuel me', async () => {
  const s = setup(), a = s.app(); const { body: { code } } = await read(await a.hello());
  const said = [];
  for (const words of ['a plan for my week', 'a name for my cat', 'a haiku about snow']) {
    const r = await a.wish(`  ${words}\n `);
    assert.equal(r.status, 200, words);
    const j = await r.json(); said.push(j.wishes);
    assert.equal(j.answer, 'Granted: here is your plan.');
    assert.ok(r.headers.get('x-space-router-receipt'), 'its receipt, signed and kept');
    assert.equal(r.headers.get('x-space-router-usd'), String(L.charge(0.0012, L.MARKUP_BPS)));
  }
  assert.deepEqual(said.map((w) => w.left), [2, 1, 0]);
  const sent = s.up.calls.map((c) => c.body);
  assert.deepEqual(sent[0], { model: MODEL, messages: [{ role: 'system', content: SWARMY }, { role: 'user', content: 'a plan for my week' }], max_tokens: WISH_TOKENS, stream: false },
    'her words, the wish as she takes it, the house\'s model, a bounded answer');
  assert.ok(s.up.calls.every((c) => c.auth === `Bearer ${HOUSE_KEY}`), 'the house\'s key upstream');
  const rows = s.rows();
  assert.deepEqual(rows.map((r) => [r.code, r.usd]), [[code, 0.00126], [code, 0.00126], [code, 0.00126]], 'three rows, each its burn\'s cost');
  assert.ok(rows.every((r) => /^[0-9a-f]{64}$/.test(r.leaf)), 'each with its receipt\'s leaf');
  const t = s.tankRow();
  assert.deepEqual([t.calls, +t.drunk_usd.toFixed(9), t.warm], [3, 0.00378, 0], 'the house\'s tank drank three calls and mined nothing');
  assert.equal(s.db.prepare('SELECT owed FROM sr_mine WHERE id = 1').get().owed, 0, 'no $WARM owed for a wish');
  for (const w of ['a plan for my week', 'a name for my cat', 'a haiku about snow']) assert.ok(!s.dump().includes(w), `the words "${w}" are kept nowhere`);
  const four = await read(await a.wish('one more'));
  assert.deepEqual(four, { status: 402, body: { error: { message: FUEL, type: 'insufficient_quota', code: null }, wishes: { granted: 3, used: 3, left: 0 } } });
  assert.equal(s.up.calls.length, 3, 'nothing sent for a wish the house does not owe');
  assert.deepEqual((await read(await a.hello())).body.wishes, { granted: 3, used: 3, left: 0 });
  assert.deepEqual((await read(await s.app().hello())).body.wishes, { granted: 3, used: 0, left: 3 }, 'another phone\'s her has her own three');
});

test('the K-factor in the app: a friend born in DysonLight from her code grants her one more call; a web code, her own code, or the same friend twice grants none', async () => {
  const s = setup(), a = s.app(); const { body: { code } } = await read(await a.hello());
  for (const w of ['one', 'two', 'three']) assert.equal((await a.wish(w)).status, 200);
  assert.equal((await a.wish('four')).status, 402);
  const friend = s.app(); assert.equal((await friend.hello(code)).status, 200);
  assert.equal(s.apps().find((r) => r.key === W.keyOf(friend.phone.keyId)).friend, code, 'born from her code');
  assert.equal((await friend.hello(code)).status, 200, 'the friend opens again');
  assert.deepEqual((await read(await a.hello())).body.wishes, { granted: 4, used: 3, left: 1 }, 'one more, once');
  const r = await read(await a.wish('four'));
  assert.deepEqual([r.status, r.body.wishes], [200, { granted: 4, used: 4, left: 0 }]);
  assert.equal((await s.app().hello('AAAAAAAAAA')).status, 200, 'a code no app\'s her has (a web code): born, counted for nobody');
  s.db.prepare('INSERT INTO her_births(code, ref, born_at) VALUES (?, ?, ?)').run('BBBBBBBBBB', code, 1);   // a birth the web once told (the old worker/her.mjs, its table kept) from her link
  assert.deepEqual((await read(await a.hello())).body.wishes, { granted: 4, used: 4, left: 0 }, 'a birth on the web grants nothing');
  const self = s.app(), selfCode = codeOf(self.phone); assert.equal((await self.hello(selfCode)).status, 200);
  assert.equal(s.apps().find((r) => r.code === selfCode).friend, null, 'her own code brings her no friend');
  assert.equal(W.onHouse(1), 4);
});

test('the day\'s ceiling: past it she sleeps until the next UTC day and nothing is claimed; the next day she answers again', async () => {
  const s = setup({ day: '0.1' }), a = s.app(), b = s.app();   // the claim counts an answer's cost, and one in flight at the fair estimate (FIRST_HOLD_USD 0.05)
  await a.hello(); await b.hello();
  assert.equal((await a.wish('one')).status, 200);
  assert.equal((await b.wish('one')).status, 200);
  assert.equal((await a.wish('two')).status, 200);   // 0.00252 spent + 0.05 in flight fits 0.1
  s.up.s.cost = 0.03; assert.equal((await b.wish('two')).status, 200);
  assert.equal((await b.wish('three')).status, 200);   // 0.03906 + 0.05 fits 0.1; then the day is full
  const late = await a.wish('three');
  assert.equal(late.status, 503);
  assert.equal(late.headers.get('retry-after'), String(15 * 3600), 'the seconds to the next UTC day');
  assert.match((await late.json()).error.message, /sleeps until tomorrow/);
  assert.equal(s.rows().length, 5, 'nothing claimed for it');
  s.clock.ms += DAY_MS;
  assert.equal((await a.wish('three')).status, 200, 'the next day: answered');
});

test('a call that is not answered spends no wish: MiniRouter refusing, or the house\'s tank dry, deletes the claim and charges nothing', async () => {
  const s = setup(), a = s.app(); await a.hello();
  s.up.s.status = 500;
  const r = await a.wish('one');
  assert.equal(r.status, 502); assert.match((await r.json()).error.message, /Nothing was charged/);
  assert.deepEqual([s.rows().length, s.tankRow().calls], [0, 0]);
  assert.equal(s.db.prepare('SELECT COUNT(*) AS n FROM sr_holds').get().n, 0, 'the hold let go');
  s.up.s.status = 200; assert.equal((await read(await a.hello())).body.wishes.left, 3, 'her three, all still hers');
  const dry = setup({ pour: 0 }), d0 = dry.app(); await d0.hello();
  const d = await d0.wish('one');
  assert.equal(d.status, 503); assert.match((await d.json()).error.message, /tank is dry/);
  assert.deepEqual([dry.rows().length, dry.up.calls.length], [0, 0], 'nothing claimed, nothing sent');
});

test('bounds: an empty wish, a long one, a long hello, the wrong method; six wishes a minute from one address', async () => {
  const s = setup(), a = s.app(); await a.hello();
  assert.equal((await a.wish('   \n ')).status, 400);
  assert.equal((await s.ask(WISH_PATH, { method: 'POST', body: JSON.stringify({ key: 'k', wish: 'x'.repeat(3000) }) })).status, 413);
  assert.equal((await s.ask(HELLO_PATH, { method: 'POST', body: JSON.stringify({ key: 'k', attestation: 'A'.repeat(20000) }) })).status, 413);
  assert.equal((await s.ask(WISH_PATH, { method: 'PUT', body: {} })).status, 405);
  assert.equal((await s.ask(HELLO_PATH)).status, 405);
  const t = setup(), many = t.app(); await many.hello();
  const helper = t.app(); await helper.hello();
  for (let i = 0; i < 9; i++) await t.app().hello(codeOf(many.phone));   // nine friends: twelve wishes owed
  const statuses = []; for (let i = 0; i < WISH_PER_MINUTE + 1; i++) statuses.push((await many.wish(`w${i}`, { ip: '198.51.100.9' })).status);
  assert.deepEqual(statuses, [...Array(WISH_PER_MINUTE).fill(200), 429]);
  assert.equal((await many.wish('from another address', { ip: '198.51.100.10' })).status, 200);
});

test('the app\'s door on the web: iOS and Android open DysonLight on /wish (the link files name the apps); a browser is sent on to its store, else to her page', async () => {
  const s = setup({ apps: `${APPLE.appId} ${GOOGLE.app('production')}`, play: PLAY });
  const aasa = await s.ask(AASA_PATH);
  assert.equal(aasa.status, 200); assert.match(aasa.headers.get('content-type'), /application\/json/);
  assert.deepEqual(await aasa.json(), { applinks: { details: [{ appIDs: [APPLE.appId], components: [{ '/': `${APP_PATH}*` }] }] } });
  const go = await s.ask(`${APP_PATH}?friend=AAAAAAAAAA`);
  assert.deepEqual([go.status, go.headers.get('location')], [302, STORE]);
  const links = await s.ask(ASSETLINKS_PATH);
  assert.deepEqual(await links.json(), [{ relation: ['delegate_permission/common.handle_all_urls'], target: { namespace: 'android_app', package_name: PACKAGE,
    sha256_cert_fingerprints: [DIGEST.toUpperCase().match(/../g).join(':')] } }], 'Android\'s link file: the package and its signing digest');
  const ANDROID_UA = 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Mobile Safari/537.36';
  assert.equal((await s.ask(APP_PATH, { ua: ANDROID_UA })).headers.get('location'), PLAY, 'an Android browser: Google Play');
  assert.equal((await setup().ask(APP_PATH, { ua: ANDROID_UA })).headers.get('location'), `${SITE}/?her`, 'no Play page named: her page, never the App Store');
  const none = setup({ store: null, apps: null });
  assert.equal((await none.ask(AASA_PATH)).status, 404, 'no app named: no link file'); assert.equal((await none.ask(ASSETLINKS_PATH)).status, 404);
  assert.deepEqual([(await none.ask(APP_PATH)).status, (await none.ask(APP_PATH)).headers.get('location')], [302, `${SITE}/?her`], 'no store yet: her page');
  assert.equal((await s.ask(APP_PATH, { method: 'POST', body: {} })).status, 405);
});

test('a wish is the house\'s before the router opens: the chat still waits for the sale, her wishes do not; the wish is cut to its length as she takes it', async () => {
  const s = setup({ opened: new Date(DAY0 + 30 * DAY_MS).toISOString() }), a = s.app(); await a.hello();
  const chat = await s.ask(CHAT_PATH, { method: 'POST', body: { model: MODEL, messages: [{ role: 'user', content: 'x' }] } });
  assert.equal(chat.status, 503, 'the chat waits for the opening');
  assert.equal((await a.wish('w'.repeat(W.WISH_CHARS + 50))).status, 200, 'her wish answers before it');
  assert.equal(s.up.calls[0].body.messages[1].content.length, W.WISH_CHARS);
});

// space-router-x.test.mjs · X HOLDS THE FLASK (worker/space-router-x.mjs, app/space-router-x.mjs): the mint page's X sign-in holds a flask; Harmony's X sign-in then lets
// its key spend that flask, within X_CAP a UTC day; a second browser's flask fills the same credits; a key asked before any flask waits for the first; every refusal.
// A database built by every migration; X and MiniRouter are stand-ins: no network, no money. node --test embertide-app/ui/intro/dyson-society/worker/space-router-x.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { d1, migrated, migrations } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by the migrations named
import { createHandler } from './premint.mjs';
import { CHAT_PATH, TANK_PATH } from './space-router.mjs';
import { GRANT_PATH, grantSignIn, sealGrantProof, verifyGrantProof } from '../app/space-router-grant.mjs';
import { X_PATH, X_BACK, X_CAP, xBackOf } from '../app/space-router-x.mjs';
import { tankOfAuthority, tankOfFlask } from './space-router-link.mjs'; import { wallet } from './stand-ins.mjs';
import { sha256Hex } from '../app/dl-society-codes.mjs';
import { newOracleKey } from '../app/space-router-oracle.mjs';
import { refillSql, keyHash, newKey } from '../tools/space-router-tank.mjs';

const SITE = 'https://optimism.fit', HOST = 'optimism.fit', T0 = Date.UTC(2026, 10, 19, 19), ORACLE = await newOracleKey(), X_API = 'https://x.test/2', HARMONY_BACK = 'http://localhost:8990/holytraces.html';
async function flask() {   // a flask as the page makes it, and the X text it signs for one sign-in's verifier
  const { address, sign } = await wallet(), proof = async (verifier, now = T0) => { const text = grantSignIn({ host: HOST, origin: SITE, address, now, x: true, key: await sha256Hex(verifier) }); return sealGrantProof(text, await sign(new TextEncoder().encode(text))); };   // its key: stand-ins.mjs wallet
  return { address, proof, own: await tankOfAuthority(address) };
}
function site({ through = migrations.length } = {}) {
  const db = migrated(migrations.slice(0, through)), DB = d1(db);
  const codes = new Map(), people = { anna: { id: '1001', username: 'anna_x', name: 'Anna' }, bea: { id: '1002', username: 'bea', name: 'Bea' } }, seen = [];
  const fetcher = async (url, init = {}) => {   // X's two doors as the house's public client meets them (a code is good once, for its verifier and its address back), then MiniRouter
    if (String(url).startsWith(X_API)) {
      if (String(url).endsWith('/oauth2/token')) { const q = new URLSearchParams(init.body), c = codes.get(q.get('code')); seen.push(Object.fromEntries(q)); codes.delete(q.get('code'));
        return c && c.verifier === q.get('code_verifier') && c.back === q.get('redirect_uri') && q.get('client_id') ? Response.json({ access_token: `tok-${c.who}`, token_type: 'bearer' }) : Response.json({ error: 'invalid_request' }, { status: 400 }); }
      const who = /^Bearer tok-(\w+)$/.exec(init.headers?.authorization ?? '')?.[1]; return who ? Response.json({ data: people[who] }) : Response.json({}, { status: 401 });
    }
    return new Response(JSON.stringify({ id: 'c', object: 'chat.completion', model: JSON.parse(init.body).model, choices: [{ index: 0, message: { role: 'assistant', content: 'ok' }, finish_reason: 'stop' }], usage: { prompt_tokens: 1, completion_tokens: 1 } }), { status: 200, headers: { 'content-type': 'application/json', 'x-minirouter-cost-usd': '0.5' } });
  };
  const clock = { ms: T0 }, handle = createHandler({ fetcher, clockMs: () => clock.ms, clock: () => Math.floor(clock.ms / 1000) });
  const env = { ASSETS: { fetch: () => new Response('asset') }, DB, X_API, SPACE_ROUTER_KEY: 'mr-house', SPACE_ROUTER_ORACLE_KEY: ORACLE.secret, SPACE_ROUTER_OPENED_AT: new Date(T0 - 86_400_000).toISOString() };
  let ip = 0, n = 0; const ask = async (path, { method = 'POST', key, body } = {}) => { const r = await handle(new Request(`${SITE}${path}`, { method, redirect: 'manual', headers: { ...(key ? { authorization: `Bearer ${key}` } : {}), 'content-type': 'application/json', 'cf-connecting-ip': `203.0.113.${ip++ % 200}` }, body: body === undefined ? undefined : JSON.stringify(body) }), env, {}); return { status: r.status, location: r.headers.get('location'), body: await r.json().catch(() => null) }; };
  const signIn = (who, back = SITE + X_BACK) => { const code = `code-${++n}`, verifier = `v${String(n).padStart(3, '0')}`.padEnd(43, 'Q'); codes.set(code, { who, verifier, back }); return { code, verifier }; };   // one X answer
  return { db, clock, seen, ask, env, signIn,
    hold: async (f, who) => { const s = signIn(who); return ask(X_PATH, { body: { ...s, proof: await f.proof(s.verifier, clock.ms) } }); },   // the mint page
    harmony: (who, secret) => ask(X_PATH, { body: { ...signIn(who, HARMONY_BACK), redirect_uri: HARMONY_BACK, key: keyHash(secret), label: `Harmony ${keyHash(secret).slice(0, 4)}` } }),   // Harmony's X door
    fill: (tank, usd = 10) => { db.prepare('INSERT INTO sr_tanks(name, key_sha256, markup_bps, made_at) VALUES (?, ?, 500, ?)').run(tank, `unkeyed:${tank}`, clock.ms); db.exec(refillSql(tank, usd, 'deposit:test', { nowMs: clock.ms })); },
    call: (key) => ask(CHAT_PATH, { key, body: { model: 'openai/gpt-5.6-sol', messages: [{ role: 'user', content: 'say ok' }] } }) };
}

test('the X text: read back for one sign-in, the grant door takes none, and X\'s answer comes back to the page in the fragment', async () => {
  const f = await flask(), v = 'w'.repeat(43), p = await verifyGrantProof(await f.proof(v), { host: HOST, origin: SITE, now: T0 + 1000 });
  assert.deepEqual([p.payer, p.x, p.key, p.label], [f.address, true, await sha256Hex(v), undefined]);
  const s = site(); s.fill(f.own); assert.equal((await s.ask(GRANT_PATH, { body: { proof: await f.proof(v) } })).status, 401, 'an X text lets no key spend through the grant door');
  const back = await s.ask(`${X_BACK}?state=${'s'.repeat(22)}&code=ab.c:d`, { method: 'GET' }); assert.equal(back.status, 302); assert.equal(back.location, `/app/warm.html?door=deposit#x=${'s'.repeat(22)}.ab.c%3Ad`);
  assert.deepEqual(xBackOf(new URL(back.location, SITE).hash), { state: 's'.repeat(22), code: 'ab.c:d' });
  assert.equal((await s.ask(`${X_BACK}?error=access_denied&state=${'s'.repeat(22)}`, { method: 'GET' })).location, '/app/warm.html?door=deposit#x=no'); assert.equal(xBackOf('#x=no'), 'no');
  assert.equal((await s.ask(`${X_BACK}?state=<b>&code=x`, { method: 'GET' })).location, '/app/warm.html?door=deposit#x=no', 'nothing X did not say goes on the page');
});

test('X first, then the mint: Harmony\'s X sign-in sees the flask\'s credits and spends them within X_CAP a day; a second browser fills the same credits', async () => {
  const s = site(), f = await flask(), mac = newKey();
  const early = await s.harmony('anna', mac); assert.equal(early.status, 202, 'Harmony before any flask: its key waits'); assert.deepEqual([early.body.x.username, early.body.waits], ['anna_x', true]);
  assert.equal((await s.call(mac)).status, 401);
  const held = await s.hold(f, 'anna'); assert.equal(held.status, 201, JSON.stringify(held.body)); assert.deepEqual(held.body, { handle: '@anna_x', tank: f.own });
  assert.equal((await s.hold(f, 'anna')).status, 200, 'the same X account again'); assert.equal(await tankOfFlask(s.env, f.address), f.own, 'its deposits fill its own tank, now the X account\'s');
  assert.deepEqual(s.seen.at(-1).redirect_uri, SITE + X_BACK, 'the door traded the code itself, for the site\'s own address back');
  s.fill(f.own);   // the 10 USDC counted
  const first = await s.call(mac); assert.equal(first.status, 200, 'the key that waited spends now: ' + JSON.stringify(first.body));
  const t = await s.ask(TANK_PATH, { method: 'GET', key: mac }); assert.equal(t.body.tank, f.own); assert.equal(t.body.grant.cap_usd, X_CAP); assert.ok(Math.abs(t.body.fuel_usd - 9.475) < 1e-9);
  const mac2 = newKey(), now = await s.harmony('anna', mac2); assert.equal(now.status, 200, JSON.stringify(now.body)); assert.equal(now.body.tank, f.own); assert.ok(Math.abs(now.body.fuel_usd - 9.475) < 1e-9, 'Harmony sees the balance');
  assert.equal((await s.harmony('anna', mac2)).status, 200, 'the same key again');
  for (let i = 0; i < 10; i++) assert.equal((await s.call(mac2)).status, 200, `call ${i}`); assert.equal((await s.call(mac2)).status, 429, `past $${X_CAP} a day`);
  const g = await flask(); assert.equal((await s.hold(g, 'anna')).status, 201); assert.equal(await tankOfFlask(s.env, g.address), f.own, 'a second browser\'s flask fills the same credits');
  assert.ok(!JSON.stringify(s.db.prepare('SELECT * FROM sr_grants').all()).includes(mac), 'no key itself is kept'); assert.ok(!JSON.stringify(s.db.prepare('SELECT * FROM sr_x').all()).includes('tok-'), 'no X token is kept');
});

test('the refusals: another X account\'s flask, a text for another sign-in, X saying no, a flask with credits of its own, a database behind the migration', async () => {
  const s = site(), f = await flask(), g = await flask(); assert.equal((await s.hold(f, 'anna')).status, 201);
  assert.equal((await s.hold(f, 'bea')).status, 409, 'a flask is one X account\'s');
  const a = s.signIn('bea'), b = s.signIn('bea'); assert.equal((await s.ask(X_PATH, { body: { ...a, proof: await g.proof(b.verifier) } })).status, 401, 'a text names one sign-in');
  assert.equal((await s.ask(X_PATH, { body: { code: 'code-none', verifier: 'v'.repeat(43), proof: await g.proof('v'.repeat(43)) } })).status, 401, 'X did not let it in');
  s.fill(g.own); assert.equal((await s.hold(g, 'anna')).status, 409, 'a flask with credits of its own does not join an X account that holds another');
  const mine = newKey(); s.db.prepare('INSERT INTO sr_tanks(name, key_sha256, markup_bps, made_at) VALUES (?, ?, 500, ?)').run('ownkeyed', keyHash(mine), T0); assert.equal((await s.harmony('anna', mine)).status, 409, 'a tank\'s own key is never a grant\'s');
  assert.equal((await s.ask(X_PATH, { method: 'GET' })).status, 405); assert.equal((await s.ask(X_PATH, { body: { code: 'x' } })).status, 400);
  const old = site({ through: migrations.indexOf('0025_x_holds_the_flask.sql') }), tried = old.seen.length;
  assert.equal((await old.harmony('anna', newKey())).status, 404, 'behind 0025 the door is not there'); assert.equal(old.seen.length, tried, 'and no code was traded: Harmony\'s X door takes its own road');
  assert.equal(await tankOfFlask(old.env, f.address), f.own, 'deposits fill the flask\'s own tank, as before');
});

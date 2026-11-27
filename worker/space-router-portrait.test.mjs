// space-router-portrait.test.mjs · HER PORTRAIT'S PASS, AND EVERYONE'S FACES: the door on D1's surface over node:sqlite (the deposits' list of migration
// 0020 and this door's 0021), a stand-in bucket and a stand-in for Reactor. A face is its deposit's: every ask is by a signature the house has heard.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { d1, migrated } from './d1-on-sqlite.mjs'; import { portraitDoor, coloursOf, PORTRAIT_PATH, RIDERS, PASSES, SETS, PICTURES, MAX_PICTURE, CAP_S, MODEL, TOKENS } from './space-router-portrait.mjs'; import { encode58, seatSignIn, sealSeatProof } from '../app/dl-direct-protocol.mjs';

const sig = (k) => String(k).repeat(88), SIG = sig(5); const wallet = async () => { const pair = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']); return { pair, address: encode58(new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))) }; }, proofOf = async (w) => { const text = seatSignIn({ host: 'x', origin: 'https://x', address: w.address, now: 1000 }); return sealSeatProof(text, new Uint8Array(await crypto.subtle.sign('Ed25519', w.pair.privateKey, new TextEncoder().encode(text)))); }, FLASK = await wallet(), THIEF = await wallet(), PROOF = await proofOf(FLASK);   /* A FACE IS SET BY ITS DEPOSIT'S OWN FLASK: the flask that paid every deposit stand() counts, its sign-in sent with every ask unless a test says otherwise; classical: a flask is a Solana key, and Solana signs with it */
function stand({ drops = [SIG], paid = drops, reactor = () => new Response(JSON.stringify({ jwt: 'a-pass' }), { status: 200 }) } = {}) {
  const db = migrated(['0020_the_drops.sql', '0021_her_portraits.sql', '0015_space_router_deposits.sql', '0011_space_router.sql', '0025_x_holds_the_flask.sql', '0028_one_name_for_her.sql']), asked = [], bucket = new Map(); db.exec('CREATE TABLE creators (handle TEXT PRIMARY KEY, name TEXT NOT NULL, wallet TEXT NOT NULL UNIQUE)');   /* the creators' register (migration 0007), its three columns the list reads */
  drops.forEach((s, i) => db.prepare("INSERT INTO sr_drops(signature, tier, usd, at_ms, slot, heard_at) VALUES (?, 'bronze', 10, ?, 1, 1)").run(s, i)); paid.forEach((s) => db.prepare("INSERT INTO sr_deposits VALUES (?, ?, 'st-000000000000', '0', 10, 'mint', 'devnet', 1, 1, 1, 'none')").run(s, FLASK.address));
  const VAULT = { put: async (k, v) => void bucket.set(k, v), get: async (k) => (bucket.has(k) ? { body: bucket.get(k) } : null), delete: async (k) => void bucket.delete(k) };
  const door = portraitDoor({ fetcher: async (url, init) => { asked.push({ url, init }); return reactor(); }, clockMs: () => 1000 }), env = { REACTOR_API_KEY: 'the-key', DB: d1(db), VAULT };
  const raw = async (path, { method = 'GET', body, e = env, seat = PROOF } = {}) => { const r = await door(new Request(`https://x${PORTRAIT_PATH}${path}`, { method, headers: { 'cf-connecting-ip': '1.2.3.4', ...(seat ? { 'x-seat': seat } : {}) }, body }), e); return { status: r.status, type: r.headers.get('content-type'), cache: r.headers.get('cache-control'), bytes: new Uint8Array(await r.arrayBuffer()) }; };
  const ask = async (body, o = {}) => { const r = await raw('', { method: o.method ?? 'POST', body: (o.method ?? 'POST') === 'POST' ? JSON.stringify(body) : undefined, e: o.e, ...('seat' in o ? { seat: o.seat } : {}) }); return { status: r.status, body: JSON.parse(new TextDecoder().decode(r.bytes)) }; };
  const claim = (s, payer, handle, tank = 'st-000000000000') => { db.prepare("INSERT OR REPLACE INTO sr_deposits VALUES (?, ?, ?, '0', 10, 'mint', 'devnet', 1, 1, 1, 'none')").run(s, payer, tank); if (handle) db.prepare('INSERT INTO creators VALUES (?, ?, ?)').run(handle, handle, payer); };
  return { claim, burn: (tank, at, usd, router, warm, why = null, markup = 500) => db.prepare("INSERT INTO sr_ledger(at, kind, tank, usd, router_usd, markup_bps, warm, why) VALUES (?, 'burn', ?, ?, ?, ?, ?, ?)").run(at, tank, usd, router, markup, warm, why), raw, ask, asked, bucket, env, rows: () => db.prepare('SELECT COUNT(*) AS n FROM sr_portraits').get().n, kept: (s) => db.prepare('SELECT colours, sets FROM sr_hexagons WHERE signature = ?').get(s) ?? null };
}
const RED = { light: '#ff0000', base: '#ffeeee', coat: '#aa0000', gold: '#ffcc00', eyes: '#00ffcc', thruster: '#cc00ff' }, UP = Object.fromEntries(Object.entries(RED).map(([k, v]) => [k, v.toUpperCase()]));
const JPEG = (n = 64) => { const b = new Uint8Array(n); b.set([0xff, 0xd8, 0xff, 0xe0]); return b; }, said = (r) => JSON.parse(new TextDecoder().decode(r.bytes));

test('a deposit the house has heard takes a pass: one session on the one model, the key in the ask\'s header only, its number its place in the list', async () => {
  const s = stand({ drops: [sig(1), sig(2), SIG] }), a = await s.ask({ signature: SIG });
  assert.equal(a.status, 200); assert.deepEqual(a.body, { jwt: 'a-pass', seconds: CAP_S, left: PASSES - 1, hexagon: 3 }); assert.equal(s.rows(), 1);
  const { url, init } = s.asked[0], sent = JSON.parse(init.body).authorization_details[0];
  assert.equal(url, TOKENS); assert.equal(init.headers['Reactor-API-Key'], 'the-key'); assert.ok(!init.body.includes('the-key')); assert.ok(!JSON.stringify(a.body).includes('the-key'));
  assert.deepEqual(sent.resources.models.match, [MODEL]); assert.deepEqual(sent.constraints, { max_sessions: 1, max_session_duration_seconds: CAP_S });
});
test('refusals: another method, unopened, not a signature, a deposit the house has not heard; Reactor asked for none of them', async () => {
  const s = stand();
  assert.equal((await s.ask(null, { method: 'DELETE' })).status, 405); assert.equal((await s.ask({ signature: SIG }, { e: { REACTOR_API_KEY: 'the-key' } })).status, 503); assert.equal((await s.ask(null, { method: 'GET', e: {} })).status, 503);
  for (const signature of [undefined, 'st-0123456789ab', 'review-001', 12]) assert.equal((await s.ask({ signature })).status, 400);
  const unheard = await s.ask({ signature: sig(9) }); assert.equal(unheard.status, 402); assert.match(unheard.body.error.message, /10 USDC/); assert.equal(s.asked.length, 0); assert.equal(s.rows(), 0); const cold = stand(), uncounted = stand({ paid: [] }); for (const seat of [null, 'not-a-proof', await proofOf(THIEF)]) { assert.equal((await cold.ask({ signature: SIG, colours: RED }, { seat })).status, 401, 'A FACE IS SET BY ITS DEPOSIT\'S OWN FLASK: no pass and no colours for a stranger'); assert.equal((await cold.raw(`/${SIG}`, { method: 'PUT', body: JPEG(), seat })).status, 401, 'nor a picture'); } assert.equal(cold.kept(SIG), null); assert.equal(cold.rows(), 0); assert.equal(cold.asked.length, 0); assert.equal(cold.bucket.size, 0); assert.equal((await uncounted.ask({ signature: SIG, colours: RED })).status, 401, 'a deposit heard and not yet counted is nobody\'s yet'); assert.equal((await cold.raw('')).status, 200, 'the list stays public');
});
test('a deposit\'s passes end; a painter that refuses spends none; its number is said all the same', async () => {
  const s = stand(); for (let i = 0; i < PASSES; i++) assert.equal((await s.ask({ signature: SIG })).body.left, PASSES - 1 - i);
  const spent = await s.ask({ signature: SIG }); assert.equal(spent.status, 429); assert.equal(spent.body.hexagon, 1); assert.equal(s.rows(), PASSES); assert.equal(s.asked.length, PASSES);
  const down = stand({ reactor: () => new Response('{"error":"no available capacity"}', { status: 429 }) }), d = await down.ask({ signature: SIG });
  assert.equal(d.status, 502); assert.equal(d.body.hexagon, 1); assert.equal(down.rows(), 0);
});
test('her six colours are kept as the hexagon\'s, pass or no pass, and nothing else of the ask is', async () => {
  assert.deepEqual(coloursOf(RED), UP); for (const bad of [null, 'red', { ...RED, eyes: 'red' }, { ...RED, eyes: '#12345' }, { light: '#ffffff' }, { ...RED, eyes: 'data:image/png;base64,AAAA' }]) assert.equal(coloursOf(bad), null);
  const s = stand(); assert.equal((await s.ask({ signature: SIG, colours: RED })).status, 200); assert.deepEqual(JSON.parse(s.kept(SIG).colours), UP);
  await s.ask({ signature: SIG, colours: { ...RED, picture: 'data:image/png;base64,AAAA', eyes: '#000001' } }); assert.deepEqual(JSON.parse(s.kept(SIG).colours), { ...UP, eyes: '#000001' });
  await s.ask({ signature: SIG, colours: 'no' }); assert.equal(s.kept(SIG).sets, 2, 'an ask with no colours changes none');
  for (let i = 0; i < SETS + 3; i++) await s.ask({ signature: SIG, colours: { ...RED, eyes: `#00000${i}` } }); assert.equal(s.kept(SIG).sets, SETS, 'a deposit sets its colours a bounded number of times');
  const unpainted = stand(), a = await unpainted.ask({ signature: SIG, colours: RED }, { e: { DB: unpainted.env.DB } });
  assert.equal(a.status, 503); assert.equal(a.body.hexagon, 1); assert.deepEqual(JSON.parse(unpainted.kept(SIG).colours), UP, 'with no key yet: the number is said and the colours kept');
});
test('the house keeps a hexagon\'s picture: after its colours, pass or no pass, a JPEG under a new name each time; the door serves it', async () => {
  const s = stand(), dry = stand(), none = { DB: dry.env.DB, VAULT: dry.env.VAULT }; await s.ask({ signature: SIG });
  await dry.ask({ signature: SIG, colours: RED }, { e: none }); assert.equal((await dry.raw(`/${SIG}`, { method: 'PUT', body: JPEG(), e: none })).status, 200, 'with no key and no pass her drawing is kept all the same'); assert.equal(dry.rows(), 0); assert.equal((await dry.raw(`/${SIG}`)).status, 200);
  assert.equal((await s.raw(`/${SIG}`, { method: 'PUT', body: JPEG() })).status, 409, 'no colours yet'); await s.ask({ signature: SIG, colours: RED });
  assert.equal((await s.raw(`/${SIG}`, { method: 'PUT', body: new Uint8Array([0x89, 0x50, 0x4e, 0x47]) })).status, 415); assert.equal((await s.raw(`/${SIG}`, { method: 'PUT', body: JPEG(MAX_PICTURE + 1) })).status, 413);
  assert.equal((await s.raw('/st-nope', { method: 'PUT', body: JPEG() })).status, 400); assert.equal((await s.raw(`/${SIG}`, { method: 'POST', body: JPEG() })).status, 405); assert.equal(s.bucket.size, 0);
  const kept = await s.raw(`/${SIG}`, { method: 'PUT', body: JPEG(900) }), path = said(kept).picture; assert.equal(kept.status, 200); assert.match(path, new RegExp(`^${PORTRAIT_PATH}/[0-9a-f]{32}\\.jpg$`));
  const got = await s.raw(path.slice(PORTRAIT_PATH.length)); assert.equal(got.status, 200); assert.equal(got.type, 'image/jpeg'); assert.match(got.cache, /immutable/); assert.equal(got.bytes.length, 900);
  const again = said(await s.raw(`/${SIG}`, { method: 'PUT', body: JPEG(700) })).picture; assert.notEqual(again, path); assert.equal(s.bucket.size, 1, 'the painting before it is let go'); assert.equal((await s.raw(path.slice(PORTRAIT_PATH.length))).status, 404);
  for (let i = 2; i < PICTURES; i++) assert.equal((await s.raw(`/${SIG}`, { method: 'PUT', body: JPEG() })).status, 200); assert.equal((await s.raw(`/${SIG}`, { method: 'PUT', body: JPEG() })).status, 429);
  assert.equal((await s.raw('/nothing.jpg')).status, 404); assert.equal((await s.raw(`/${SIG}`, { method: 'PUT', body: JPEG(), e: { DB: s.env.DB } })).status, 503, 'no bucket bound');
});
test('the list: everyone\'s faces by their deposits\' signatures, in the house\'s order, each with its colours and its painting when one is kept', async () => {
  const s = stand({ drops: [sig(1), sig(2), sig(3), sig(4)], paid: [sig(1), sig(3)] });
  await s.ask({ signature: sig(1), colours: RED }); await s.ask({ signature: sig(3), colours: { ...RED, light: '#0000ff' } }); const p = said(await s.raw(`/${sig(3)}`, { method: 'PUT', body: JPEG() })).picture;
  const r = await s.ask(null, { method: 'GET' }); assert.equal(r.status, 200);
  assert.deepEqual(r.body, { count: 4, hexagons: [{ n: 1, signature: sig(1), colours: UP }, { n: 3, signature: sig(3), colours: { ...UP, light: '#0000FF' }, picture: p }] });
  s.claim(sig(1), 'payer-one', 'seiya', 'tank-one'); s.claim(sig(3), 'payer-three', null, 'tank-three');   // a counted deposit whose payer claimed a page; one whose payer claimed none
  assert.deepEqual((await s.ask(null, { method: 'GET' })).body.hexagons.map((h) => h.handle ?? null), ['seiya', null], 'a hexagon names its depositor\'s page once there is one');
  const now = await s.raw(`/${sig(3)}`); assert.equal(now.status, 200); assert.equal(now.type, 'image/jpeg'); assert.match(now.cache, /max-age=60/, 'the deposit\'s own address serves its painting as it stands now'); assert.equal((await s.raw(`/${sig(1)}`)).status, 404, 'none kept yet');
  assert.deepEqual((await stand({ drops: [] }).ask(null, { method: 'GET' })).body, { count: 0, hexagons: [] });
  s.burn('tank-three', 100, 10.5, 10, 5); s.burn('tank-three', 700, 2.1, 2, 1); s.burn('tank-one', 800, 1.05, 1, 0.25); s.burn('tank-one', 850, 1.05, null, 0); s.burn('tank-one', 900, 3, 0, 0, 'tracenet', 0); const m = (fees, burned, mined, calls) => ({ fees, burned, mined, calls });   // THE PANTHEON'S BOARD: the same hexagons, a flask each, ranked by the fees its calls brought since the window's start, then of all time
  assert.deepEqual(said(await s.raw('?board&since=600')), { count: 4, since: 600, board: [{ rank: 1, n: 3, signature: sig(3), colours: { ...UP, light: '#0000FF' }, picture: p, month: m(0.1, 2.1, 1, 1), all: m(0.6, 12.6, 6, 2) }, { rank: 2, n: 1, signature: sig(1), colours: UP, handle: 'seiya', month: m(0.1, 2.1, 0.25, 2), all: m(0.1, 2.1, 0.25, 2) }] }, 'a cost not known pays the markup it would have; a tracenet bought is no fee; month ties fall to all time; a hexagon with no deposit is no flask');
  assert.deepEqual(said(await stand({ drops: [] }).raw('?board')), { count: 0, since: 0, board: [] }, 'the window is the last 30 days, never before the start of time');
});
test('a swarm\'s faces: of the keys asked, each that paid a hexagon\'s deposit with its first one\'s painting and its person\'s page; no other key, and no list of keys', async () => {
  const s = stand({ drops: [sig(1), sig(2), sig(3), sig(4)], paid: [sig(1), sig(2), sig(3)] }), [B, C] = ['B', 'C'].map((k) => k.repeat(44)), F = FLASK.address, of = async (...k) => (({ registered, ...rest }) => (assert.equal(registered, 0, 'no tracenet egressed: no claw rider'), rest))(said(await s.raw(`?riders=${k.join(',')}`))), put = async (n) => { await s.ask({ signature: sig(n), colours: RED }); return said(await s.raw(`/${sig(n)}`, { method: 'PUT', body: JPEG() })).picture; };
  assert.deepEqual(await of(F), { riders: {} }, 'a hexagon with no painting yet'); const two = await put(2); assert.deepEqual(await of(F, B, F), { riders: { [F]: { picture: two } } }); const one = await put(1); assert.deepEqual(await of(F), { riders: { [F]: { picture: one } } }, 'her first hexagon, whichever was painted last');
  const three = await put(3); s.claim(sig(3), B, 'seiya'); assert.deepEqual(await of(F, B, C), { riders: { [F]: { picture: one }, [B]: { picture: three, handle: 'seiya' } } }, 'and the page her person claimed'); assert.deepEqual(await of(C), { riders: {} }); assert.deepEqual(await of('', 'x', "' OR 1=1 --", 'O'.repeat(44)), { riders: {} }, 'what is no key is not asked');
  const many = await s.raw(`?riders=${[...Array.from({ length: RIDERS }, (_, i) => `${'2'.repeat(41)}${encode58([i + 1]).padStart(3, '3')}`), F].join(',')}`); assert.deepEqual(said(many), { riders: {}, registered: 0 }, 'a hundred keys an ask, the rest not read'); assert.match(many.cache, /public, max-age=20/);
  assert.ok(!JSON.stringify((await s.ask(null, { method: 'GET' })).body).includes(F), 'the list names no key'); assert.equal((await s.raw('?riders=' + F, { e: {} })).status, 503);
});

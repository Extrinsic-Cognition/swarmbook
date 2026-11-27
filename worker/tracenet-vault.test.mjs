// tracenet-vault.test.mjs: THE VAULT (tracenet-vault.mjs; the register and THE LAW in app/tracenet-register.mjs, his words in lab/PAYWALL.md):
// a drop opens to a Gold Mint receipt at its publish time, to a Bronze Mint receipt and to everyone 15 days after; the receipt is the
// checkout's own paid order of the wallet that signed the request's seat proof (x-seat), its tier the row's; an order id opens nothing (THE
// SEAT PROOF, Oct 15 2026). Stand-ins only: the orders table in memory (every migration applied, as premint.test.mjs does), a key made here
// for each wallet, the site's assets read from this folder, no Solana, no purchase.
// node --test worker/tracenet-vault.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { migrated } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by the migrations named
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createHandler } from './premint.mjs';
import { createVault, manifestOf, paidRow, seatOf } from './tracenet-vault.mjs';
import { RECIPIENT, TERMS, SEAT_PROOF_DAYS, encode58, seatSignIn, sealSeatProof } from '../app/dl-direct-protocol.mjs';
import { DAY_MS, GOLD_DAYS, BRONZE_DAYS, OPEN_DAYS, HANDLE, ITEM_ID, FILE, SCHEMA, opensAt, opensFor, readManifest, validItem, vaultPath } from '../app/tracenet-register.mjs'; import { wallet } from './stand-ins.mjs';

const root = new URL('../', import.meta.url);                       // the folder: its real registers are checked whole, empty or not
const site = new URL('./fixtures/tracenet-site/', import.meta.url);   // the stand-in site the gate is proved on: one register, one drop (never built, never served)
const registers = readdirSync(new URL('app/tracenet/', root)).filter((name) => name.endsWith('.json')).map((name) => name.slice(0, -5));
const HIS = 'photons_enjoyor';
const register = JSON.parse(readFileSync(new URL(`app/tracenet/${HIS}.json`, site), 'utf8'));
const drop = readManifest(register, HIS).items[0];
const bytesOf = (item) => readFileSync(new URL(`vault/${HIS}/${item.id}/${item.file}`, site));
// PAID is a Bronze Mint receipt, GOLD a Gold Mint one; every receipt that fails a condition is a Gold Mint row, so the condition alone refuses it
const PAID = 'deadcafe-0000-4000-8000-00000000aa01', SUBMITTED = 'deadcafe-0000-4000-8000-00000000aa02', OPEN = 'deadcafe-0000-4000-8000-00000000aa03',
  ELSEWHERE = 'deadcafe-0000-4000-8000-00000000aa04', OLD_TERMS = 'deadcafe-0000-4000-8000-00000000aa05', GOLD = 'deadcafe-0000-4000-8000-00000000aa06',
  UNKNOWN = 'deadcafe-0000-4000-8000-00000000aa99';
// each receipt is its own wallet's, with a key made here: the wallet signs its seat proof at the instant `now` of the request (as the checkout
// does, it is issued then); `proof(w, now, over)` changes what it signs, to show what the Worker refuses
const W = { bronze: await wallet(), gold: await wallet(), submitted: await wallet(), open: await wallet(), elsewhere: await wallet(), oldTerms: await wallet(), none: await wallet() };
async function proof(w, now, { host = 'optimism.fit', origin = 'https://optimism.fit', signer = w, issued = now, edit = (t) => t } = {}) {
  const text = edit(seatSignIn({ host, origin, address: w.address, now: issued }));
  return sealSeatProof(text, new Uint8Array(await crypto.subtle.sign('Ed25519', signer.pair.privateKey, new TextEncoder().encode(text))));
}

// the site's assets as the Worker reads them: the registers and the vault from this folder, nothing else
function assets() {
  return { fetch: async (request) => {
    const path = new URL(request.url).pathname;
    const rel = /^\/(app\/tracenet\/[^/]+\.json|vault\/[^/]+\/[^/]+\/[^/]+)$/.test(path) && !path.includes('..') ? path.slice(1) : null;
    const file = rel && new URL(rel, site);
    if (!file || !existsSync(file) || !statSync(file).isFile()) return new Response('no such asset', { status: 404 });
    const body = readFileSync(file);
    return new Response(body, { headers: { 'content-type': rel.endsWith('.json') ? 'application/json' : 'text/markdown', 'content-length': String(body.length), etag: '"x"' } });
  } };
}
function setup({ now = Date.parse(drop.published) + 1000 } = {}) {
  const db = migrated();
  const insert = db.prepare("INSERT INTO premint_orders(id,tier,buyer,recipient,lamports,sol_usd,created_at,expires_at,blockhash,last_valid_block_height,terms_version,github,signature,status) VALUES(?,?,?,?,'100000000','100',1000,1090,'blockhash',200,?,'',?,?)");
  insert.run(PAID, 'bronze', W.bronze.address, RECIPIENT, TERMS, 'sig-paid', 'paid');
  insert.run(GOLD, 'gold', W.gold.address, RECIPIENT, TERMS, 'sig-gold', 'paid');
  insert.run(SUBMITTED, 'gold', W.submitted.address, RECIPIENT, TERMS, 'sig-submitted', 'submitted');
  insert.run(OPEN, 'gold', W.open.address, RECIPIENT, TERMS, null, 'open');
  insert.run(ELSEWHERE, 'gold', W.elsewhere.address, W.elsewhere.address, TERMS, 'sig-elsewhere', 'paid');
  insert.run(OLD_TERMS, 'gold', W.oldTerms.address, RECIPIENT, 'premint-direct-v0', 'sig-old', 'paid');
  const DB = { prepare(sql) { return { bind(...params) { return { first: async () => db.prepare(sql).get(...params) ?? null, all: async () => ({ results: db.prepare(sql).all(...params) }), run: async () => ({ meta: { changes: db.prepare(sql).run(...params).changes } }) }; }, first: async () => db.prepare(sql).get() ?? null, all: async () => ({ results: db.prepare(sql).all() }) }; } };
  const state = { now };
  const env = { DB, PREMINT_ENABLED: 'true', ASSETS: assets() };
  const handle = createHandler({ clock: () => Math.floor(state.now / 1000), clockMs: () => state.now, fetcher: async () => { throw new Error('no network in this test'); } });
  const vault = createVault({ clock: () => state.now });
  const get = (path, headers = {}, method = 'GET') => handle(new Request(`https://optimism.fit${path}`, { method, headers }), env);
  // the request a wallet's page sends: its seat proof, signed at this instant
  const seat = async (w, over) => ({ 'x-seat': await proof(w, state.now, over) });
  return { db, env, state, handle, vault, get, seat };
}
const dropPath = `/vault/${HIS}/${drop.id}/${drop.file}`;

test('every register in the folder is whole (every drop with the Nest\'s sanitization receipt), and the fixture site holds one drop on disk with its size and sha256', () => {
  assert.ok(registers.includes(HIS));
  const whole = (base, handle, atLeast) => {
    assert.match(handle, HANDLE);
    const data = JSON.parse(readFileSync(new URL(`app/tracenet/${handle}.json`, base), 'utf8'));
    assert.equal(data.schema, SCHEMA); assert.equal(data.handle, handle); assert.ok(Array.isArray(data.items) && data.items.length >= atLeast);
    for (const item of data.items) {
      assert.ok(validItem(item), JSON.stringify(item));
      assert.match(item.id, ITEM_ID); assert.match(item.file, FILE);
      const bytes = readFileSync(new URL(`vault/${handle}/${item.id}/${item.file}`, base));
      assert.equal(item.bytes, bytes.length);
      assert.equal(item.sha256, createHash('sha256').update(bytes).digest('hex'));
    }
    assert.deepEqual(readManifest(data, handle).items.map((i) => i.id), [...data.items].sort((a, b) => Date.parse(b.published) - Date.parse(a.published)).map((i) => i.id), 'newest first');
    return data;
  };
  // a drop in the folder's registers carries the Nest's sanitization receipt (validItem, through whole), and the build reads the Nest again before it ships one
  for (const handle of registers) whole(root, handle, 0);
  assert.match(readFileSync(new URL('tools/build-optimism-fit.mjs', root), 'utf8'), /nest\/ref\/\$\{SANITIZED_REF\(sha\)\}/, 'the build asks the Nest for every drop');
  whole(site, HIS, 1);
  assert.ok(!existsSync(new URL(`vault/${HIS}/${drop.id}/${drop.file}`, root)), 'the fixture\'s drop is not in the folder the build copies');
});

test('the law, tiered: Gold from the publish time, Bronze and everyone from day 15, to the millisecond; no publish time, never', () => {
  assert.deepEqual([GOLD_DAYS, BRONZE_DAYS, OPEN_DAYS], [0, 15, 15]);
  const published = '2026-10-14T21:00:00.000Z', t0 = Date.parse(published);
  assert.equal(opensFor({ published }, 'gold'), t0);
  assert.equal(opensFor({ published }, 'bronze'), t0 + 15 * DAY_MS);
  assert.equal(opensAt({ published }), t0 + 15 * DAY_MS);
  for (const tier of ['gold', 'bronze', null]) assert.equal(opensFor({ published: 'never' }, tier), null);
  assert.equal(opensAt({ published: 'never' }), null); assert.equal(opensAt({}), null); assert.equal(opensAt(null), null);
});

test('a visitor meets the wall until day 15: 402, the instant it opens to everyone, no bytes; HEAD too', async () => {
  const s = setup();
  for (const method of ['GET', 'HEAD']) {
    const r = await s.get(dropPath, {}, method);
    assert.equal(r.status, 402);
    assert.equal(r.headers.get('cache-control'), 'no-store');
    const body = method === 'GET' ? await r.json() : null;
    if (body) {
      assert.deepEqual(body, { error: `Seat holders first; free from ${new Date(opensAt(drop)).toISOString()}.`, opensAt: new Date(opensAt(drop)).toISOString(), tier: null });
      assert.equal(body.opensAt, '2026-10-29T21:51:05.751Z', 'the fixture drop, published Oct 14 21:51:05.751 UTC: 15 days on');
      assert.ok(!JSON.stringify(body).includes('The subscribe portal'));
    }
  }
});

test('a Bronze Mint receipt before day 15 is 402 with the instant it opens for Bronze; from that instant, 200', async () => {
  const bronzeAt = opensFor(drop, 'bronze');
  for (const now of [Date.parse(drop.published), Date.parse(drop.published) + 7 * DAY_MS, bronzeAt - 1]) {
    const s = setup({ now });
    for (const method of ['GET', 'HEAD']) {
      const r = await s.get(dropPath, await s.seat(W.bronze), method);
      assert.equal(r.status, 402, `${method} at ${new Date(now).toISOString()}`);
      assert.equal(r.headers.get('cache-control'), 'no-store');
      if (method === 'GET') assert.deepEqual(await r.json(), { error: `Bronze Mint opens this drop at ${new Date(bronzeAt).toISOString()}.`, opensAt: new Date(bronzeAt).toISOString(), tier: 'bronze' });
    }
  }
  const s = setup({ now: bronzeAt });
  const r = await s.get(dropPath, await s.seat(W.bronze));
  assert.equal(r.status, 200);
  assert.equal(createHash('sha256').update(new Uint8Array(await r.arrayBuffer())).digest('hex'), drop.sha256);
});

test('a Gold Mint receipt opens the drop from its publish time: the register\'s bytes and sha256, no-store, nosniff, saved under its own name; HEAD carries no body', async () => {
  const before = setup({ now: Date.parse(drop.published) - 1 });
  assert.equal((await before.get(dropPath, await before.seat(W.gold))).status, 402, 'the millisecond before it is published');
  const s = setup({ now: Date.parse(drop.published) });
  const r = await s.get(dropPath, await s.seat(W.gold));
  assert.equal(r.status, 200);
  const bytes = new Uint8Array(await r.arrayBuffer());
  assert.equal(bytes.length, drop.bytes);
  assert.equal(createHash('sha256').update(bytes).digest('hex'), drop.sha256);
  assert.deepEqual(bytes, new Uint8Array(bytesOf(drop)));
  assert.equal(r.headers.get('cache-control'), 'private, no-store');
  assert.equal(r.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(r.headers.get('content-disposition'), `attachment; filename="${drop.file}"`);
  assert.equal(r.headers.get('content-length'), String(drop.bytes));
  const head = await s.get(dropPath, await s.seat(W.gold), 'HEAD');
  assert.equal(head.status, 200); assert.equal(head.body, null); assert.equal(head.headers.get('content-length'), String(drop.bytes));
});

test('a wallet whose receipt is not paid, not to the recipient, not under the terms, or that holds none, opens nothing, Gold Mint or not', async () => {
  const s = setup();
  assert.equal((await s.get(dropPath, await s.seat(W.gold))).status, 200, 'the paid Gold Mint receipt the others are measured against');
  for (const [name, w] of Object.entries({ submitted: W.submitted, open: W.open, 'to another recipient': W.elsewhere, 'old terms': W.oldTerms, 'no order at all': W.none })) {
    const r = await s.get(dropPath, await s.seat(w));
    assert.equal(r.status, 402, name);
    assert.equal((await r.json()).tier, null, `${name}: no seat`);
  }
  // the five conditions, on a row
  const row = { status: 'paid', recipient: RECIPIENT, terms_version: TERMS, tier: 'bronze', signature: 's' };
  assert.equal(paidRow(row, { wallet: RECIPIENT }), true);   // the first tracenet's row (creator none), to its wallet
  for (const change of [{ status: 'submitted' }, { recipient: 'x' }, { terms_version: 'v0' }, { tier: 'silver' }, { signature: '' }, { signature: null }]) assert.equal(paidRow({ ...row, ...change }, { wallet: RECIPIENT }), false, JSON.stringify(change));
  assert.equal(paidRow(null, { wallet: RECIPIENT }), false); assert.equal(paidRow(row, { wallet: RECIPIENT, handle: 'alice' }), false, 'another creator\'s tracenet');
});

// THE HOLE, CLOSED (Oct 15 2026, ec-workspace docs/the-mint-where-it-stands-hypertrace-2026-10-15.md, item 2): an order id is public (its
// payment's memo on mainnet; until today /api/premint/holders and /receipts handed it out too), and the vault took a bare one in x-receipt as a
// seat, so one Gold sale opened every Gold drop to anyone. Now only the holding wallet's signature does.
test('an order id alone opens nothing, in any header or the address; the holding wallet\'s seat proof does, and no other proof', async () => {
  const s = setup();
  for (const headers of [{ 'x-receipt': GOLD }, { 'x-receipt': PAID }, { 'x-seat': GOLD }, { 'x-receipt': GOLD, 'x-seat': GOLD }, { authorization: `Bearer ${GOLD}` }]) {
    const r = await s.get(dropPath, headers);
    assert.equal(r.status, 402, JSON.stringify(headers));
    assert.deepEqual(await r.json(), { error: `Seat holders first; free from ${new Date(opensAt(drop)).toISOString()}.`, opensAt: new Date(opensAt(drop)).toISOString(), tier: null });
  }
  assert.equal((await s.get(`${dropPath}?receipt=${GOLD}`)).status, 402, 'in the address');
  assert.equal((await s.get(`${dropPath}?seat=${encodeURIComponent(await proof(W.gold, s.state.now))}`)).status, 402, 'a proof in the address is not carried: the header alone');
  // what the id does still answer: whether the order is paid (the checkout's recovery), never the drop
  assert.equal((await (await s.get(`/api/premint/orders/${GOLD}`)).json()).order.status, 'paid');
  // the Gold wallet's own proof: the drop
  const r = await s.get(dropPath, await s.seat(W.gold));
  assert.equal(r.status, 200);
  assert.equal(createHash('sha256').update(new Uint8Array(await r.arrayBuffer())).digest('hex'), drop.sha256);
  // and no proof that is not exactly the Gold wallet's own sign-in, fresh, for this site
  const refused = {
    'the Gold wallet named, another key signing': await proof(W.gold, s.state.now, { signer: W.none }),
    'another site': await proof(W.gold, s.state.now, { host: 'evil.example', origin: 'https://evil.example' }),
    'www: another host': await proof(W.gold, s.state.now, { host: 'www.optimism.fit', origin: 'https://www.optimism.fit' }),
    'expired': await proof(W.gold, s.state.now, { issued: s.state.now - SEAT_PROOF_DAYS * DAY_MS }),
    'issued an hour ahead': await proof(W.gold, s.state.now, { issued: s.state.now + 3600e3 }),
    'its expiry pushed out after signing': await proof(W.gold, s.state.now, { edit: (t) => t.replace(/Expiration Time: .*/, `Expiration Time: ${new Date(s.state.now + 400 * DAY_MS).toISOString()}`) }),
  };
  for (const [name, p] of Object.entries(refused)) assert.equal((await s.get(dropPath, { 'x-seat': p })).status, 402, name);
  // seatOf: the wallet, or null
  const at = s.state.now, request = async (headers) => seatOf(new Request('https://optimism.fit/vault/x', { headers }), at);
  assert.equal((await request({ 'x-seat': await proof(W.gold, at) }))?.buyer, W.gold.address);
  for (const headers of [{}, { 'x-receipt': GOLD }, { 'x-seat': GOLD }, { 'x-seat': refused.expired }]) assert.equal(await request(headers), null, JSON.stringify(headers).slice(0, 40));
  // a wallet holding both seats opens by the sooner: Gold
  s.db.prepare("INSERT INTO premint_orders(id,tier,buyer,recipient,lamports,sol_usd,created_at,expires_at,blockhash,last_valid_block_height,terms_version,github,signature,status) VALUES(?,'bronze',?,?,'100000000','100',1000,1090,'blockhash',200,?,'','sig-gold-bronze','paid')").run('deadcafe-0000-4000-8000-00000000aa07', W.gold.address, RECIPIENT, TERMS);
  assert.equal((await s.get(dropPath, await s.seat(W.gold))).status, 200, 'its Bronze receipt does not hide its Gold one');
});

test('from day 15 after the publish time the drop is everyone\'s, free: the last millisecond before is not', async () => {
  const opens = opensAt(drop);
  const before = setup({ now: opens - 1 });
  assert.equal((await before.get(dropPath)).status, 402);
  const after = setup({ now: opens });
  const r = await after.get(dropPath);
  assert.equal(r.status, 200);
  assert.equal(new Uint8Array(await r.arrayBuffer()).length, drop.bytes);
  assert.equal(r.headers.get('cache-control'), 'private, no-store');
  const later = setup({ now: opens + 400 * DAY_MS });
  assert.equal((await later.get(dropPath)).status, 200);
});

test('what no register names is not served: another handle, another id, another file, a walk up, a method that is not a read', async () => {
  const s = setup();
  for (const path of [`/vault/nobody/${drop.id}/${drop.file}`, `/vault/${HIS}/no-such-drop/${drop.file}`, `/vault/${HIS}/${drop.id}/other.md`, `/vault/${HIS}/${drop.id}/`, `/vault/${HIS}/${drop.id}`,
    `/vault/${HIS}/${drop.id}/%2e%2e`, `/vault/${HIS}/${drop.id}/%2e%2e/${drop.file}`, `/vault/${HIS}/${drop.id}/${drop.file}/x`, `/vault/${HIS}/${drop.id}/${drop.file}%00`, '/vault/', '/vault']) {
    const r = await s.get(path, await s.seat(W.gold));
    assert.equal(r.status, 404, path);
  }
  for (const method of ['POST', 'PUT', 'DELETE']) assert.equal((await s.get(dropPath, await s.seat(W.gold), method)).status, 405, method);
  // a walk up is resolved by the URL before any Worker sees it: what arrives is the drop's own path, or a folder (no file: nothing)
  assert.equal(new URL(`https://optimism.fit/vault/${HIS}/../${HIS}/${drop.id}/${drop.file}`).pathname, dropPath);
  assert.equal(new URL(`https://optimism.fit/vault/${HIS}/${drop.id}/${drop.file}/..`).pathname, `/vault/${HIS}/${drop.id}/`);
  assert.equal((await s.get(`/vault/${HIS}/${drop.id}/${drop.file}/..`, await s.seat(W.gold))).status, 404);
  assert.deepEqual(vaultPath('/vault/a/b/c'), { handle: 'a', id: 'b', file: 'c' }, 'one letter is a whole handle, id and file by the register\'s rules');
  assert.deepEqual(vaultPath(`/vault/${HIS}/${drop.id}/${drop.file}`), { handle: HIS, id: drop.id, file: drop.file });
  for (const bad of ['/vault/x/y/z.', '/vault/x/Y/z', '/vault/x/y/z%20w', '/vault/x/y/.hidden', '/vault/x/-y/z', `/vault/${'a'.repeat(33)}/y/z`]) assert.equal(vaultPath(bad), null, bad);
  assert.equal(await manifestOf(s.env, 'https://optimism.fit', '..'), null);
  assert.equal(await manifestOf(s.env, 'https://optimism.fit', 'nobody'), null);
  assert.equal((await manifestOf(s.env, 'https://optimism.fit', HIS)).items[0].id, drop.id);
});

test('a register that is not this handle\'s, or not a register, serves nothing even to a holder', async () => {
  const s = setup();
  const data = JSON.parse(readFileSync(new URL(`app/tracenet/${HIS}.json`, site), 'utf8'));
  for (const wrong of [{ ...data, handle: 'someone_else' }, { ...data, schema: 'other/1' }, { ...data, items: null }, 'not json at all', null]) {
    s.env.ASSETS = { fetch: async (request) => {
      const path = new URL(request.url).pathname;
      if (path.endsWith('.json')) return wrong === null ? new Response('gone', { status: 404 }) : new Response(typeof wrong === 'string' ? wrong : JSON.stringify(wrong), { headers: { 'content-type': 'application/json' } });
      return new Response(bytesOf(drop));
    } };
    assert.equal((await s.get(dropPath, await s.seat(W.gold))).status, 404, JSON.stringify(wrong)?.slice(0, 40));
  }
});

test('the Worker runs first on /vault/*, the premint door still answers, and a missing asset behind a paid receipt is 404', async () => {
  const config = readFileSync(new URL('wrangler.optimism-fit.jsonc', root), 'utf8');
  const first = /"run_worker_first":\s*\[([^\]]*)\]/.exec(config)?.[1] ?? '';
  assert.ok(first.includes('"/vault/*"'), first); assert.ok(first.includes('"/api/premint/*"'), first);
  const s = setup();
  const order = await s.get(`/api/premint/orders/${PAID}`);
  assert.equal(order.status, 200); assert.equal((await order.json()).order.status, 'paid');
  assert.equal((await s.get('/app/warm.html')).status, 404, 'the stand-in assets hold only registers and the vault');
  const register = { schema: SCHEMA, handle: HIS, name: 'x', items: [{ ...drop, id: 'ghost-drop' }] };
  s.env.ASSETS = { fetch: async (request) => (new URL(request.url).pathname.endsWith('.json') ? Response.json(register) : new Response('gone', { status: 404 })) };
  assert.equal((await s.get(`/vault/${HIS}/ghost-drop/${drop.file}`, await s.seat(W.gold))).status, 404);
  // without a database (checkout being prepared) a visitor still meets the wall and an open drop is still everyone's
  const bare = setup({ now: opensAt(drop) }); delete bare.env.DB;
  assert.equal((await bare.get(dropPath)).status, 200);
  const bareLocked = setup(); delete bareLocked.env.DB;
  assert.equal((await bareLocked.get(dropPath, await bareLocked.seat(W.gold))).status, 402, 'no database: no receipt to read, even for the Gold wallet');
});

test('the build copies the vault, refuses a register that is not on disk, and gives each handle its address', () => {
  const build = readFileSync(new URL('tools/build-optimism-fit.mjs', root), 'utf8');
  assert.match(build, /\['app', 'js', 'skills', 'submission', 'vault'\]/);
  assert.match(build, /tracenets\.map\(handle => `\/\$\{handle\} \/app\/tracenet\.html\?of=\$\{handle\} 302`\)/);
  assert.match(build, /'\/vault\/\*',\n\s+'  Cache-Control: private, no-store'/);
  assert.match(build, /Publish it again\. Nothing was built\./);
  assert.match(build, /import \{ SCHEMA, HANDLE, ITEM_ID, FILE, SANITIZED_REF, validItem \} from '\.\.\/app\/tracenet-register\.mjs'/);
});

// worker/creators.test.mjs: TRACENET IS FOR EVERY CREATOR (worker/creators.mjs, worker/connect.mjs; his Oct 23 2026 WEST: "it has to be for more
// creators to come and do the same as well"; his road: SOL to every creator directly, Stripe Connect an optional switch). A wallet claims a handle
// (its seat proof the claim), once; the register answers from D1 with the payee; the first tracenet answers from the asset with RECIPIENT; a drop's
// bytes go to R2 and the register lists them; the vault opens that drop by this creator's receipts alone; the front door; a SOL seat for a creator
// pays its wallet at its price; the Connect switch: onboarding, the price, the status, and a card checkout with the destination and the 30 %.
// node --test creators.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { migrated } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by the migrations named
import { mkdtempSync, statSync } from 'node:fs';
import { assetsOf, wallet } from './stand-ins.mjs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { createHandler } from './premint.mjs';
import { PATH, MAX_DROP, MAX_WAITING, dropId, rowToRegister, creatorOf, payeeOf } from './creators.mjs';
import { PATHS as CONNECT } from './connect.mjs';
import { PATHS as BRONZE, PLATFORM_FEE_PERCENT } from './bronze.mjs';
import { paidRow } from './tracenet-vault.mjs';
import { RECIPIENT, GENESIS, TERMS, encode58, seatSignIn, sealSeatProof, quoteLamports } from '../app/dl-direct-protocol.mjs';
import { FIRST_TRACENET, NO_PREV, opensFor } from '../app/tracenet-register.mjs';
import { dropLineText, lineHash, headOf, proveItems } from '../app/tracenet-drop-line.mjs';
import { stampText, proveStamps, cosignsOn } from '../app/tracenet-stamp.mjs';
import { createTracenetDoor, SITE_PATH, CHAIN } from '../vendor/tools/embertide-mesh/lib/tracenet-create.mjs'; import { tankOfAuthority } from './space-router-link.mjs'; import { keyHash } from '../tools/space-router-tank.mjs';   // THE VOW MAKES THE PAGE: the house's half, on this door

const site = new URL('./fixtures/tracenet-site/', import.meta.url), ORIGIN = 'https://optimism.fit';
const proofOf = async (w, now) => { const text = seatSignIn({ host: 'optimism.fit', origin: ORIGIN, address: w.address, now }); return sealSeatProof(text, new Uint8Array(await crypto.subtle.sign('Ed25519', w.pair.privateKey, new TextEncoder().encode(text)))); };
const ALICE = await wallet(), BOB = await wallet(), FAN = await wallet();
const blockhash = encode58(new Uint8Array(32).fill(7));
// THE DROP IS SIGNED BY ITS CREATOR: the headers of a drop whose line `w` signed (the creator page's own road, app/creator.js); `as` signs for another wallet's tracenet
const iso = (ms) => new Date(ms).toISOString();
async function signedDrop(w, handle, { title = 'A trace', kind = 'trace', file = 'trace.md', bytes, published, prev = NO_PREV, as = w } = {}) {
  const sha256 = createHash('sha256').update(bytes).digest('hex'), id = dropId(published, title);
  const text = dropLineText({ handle, wallet: as.address, id, title, kind, file, bytes: bytes.length, sha256, published, prev });
  const sig = encode58(new Uint8Array(await crypto.subtle.sign('Ed25519', w.pair.privateKey, new TextEncoder().encode(text))));
  return { headers: { 'x-title': title, 'x-kind': kind, 'x-file': file, 'x-published': published, 'x-prev': prev, 'x-sig': sig }, text, sig };
}

function r2() {   // R2's two calls, in memory
  const store = new Map();
  return { store, async put(key, bytes, opts = {}) { store.set(key, { bytes: new Uint8Array(bytes), opts }); }, async get(key) { const o = store.get(key); return o ? { body: o.bytes, size: o.bytes.length, httpMetadata: o.opts.httpMetadata, customMetadata: o.opts.customMetadata } : null; } };
}
function setup({ keys = false, vault = true } = {}) {
  const db = migrated();
  const state = { time: 1_800_000_000, calls: [] };
  const DB = { prepare(sql) { return { bind(...params) { return { first: async () => db.prepare(sql).get(...params) ?? null, all: async () => ({ results: db.prepare(sql).all(...params) }), run: async () => ({ meta: { changes: db.prepare(sql).run(...params).changes } }) }; }, first: async () => db.prepare(sql).get() ?? null, all: async () => ({ results: db.prepare(sql).all() }) }; } };
  const assets = assetsOf(site);
  const VAULT = r2();
  const env = { DB, PREMINT_ENABLED: 'true', ASSETS: assets, ...(vault ? { VAULT } : {}), ...(keys ? { STRIPE_SECRET_KEY: 'sk_test_x', STRIPE_PRICE_BRONZE: 'price_first', STRIPE_WEBHOOK_SECRET: 'whsec_x' } : {}) };
  const handle = createHandler({ clock: () => state.time, clockMs: () => state.time * 1000, fetcher: async (url, opts = {}) => {
    if (String(url).startsWith('https://api.stripe.com/')) {
      state.calls.push({ route: new URL(url).pathname, method: opts.method, body: opts.body ?? null });
      const route = new URL(url).pathname;
      if (route === '/v1/accounts' && opts.method === 'POST') return Response.json({ id: 'acct_alice1234' });
      if (route.startsWith('/v1/accounts/')) return Response.json({ id: 'acct_alice1234', charges_enabled: state.enabled ?? false });
      if (route === '/v1/account_links') return Response.json({ url: 'https://connect.stripe.com/setup/e/acct_alice1234/x' });
      if (route === '/v1/prices' && opts.method === 'POST') return Response.json({ id: 'price_alice1234' });
      if (route.startsWith('/v1/prices/')) return Response.json({ id: route.slice(11), active: true, unit_amount: route.endsWith('alice1234') ? 700 : 1000, currency: 'usd', recurring: { interval: 'month' } });
      if (route === '/v1/checkout/sessions') return Response.json({ id: 'cs_1', url: 'https://checkout.stripe.com/c/pay/cs_1' });
      return Response.json({ error: { message: 'No such route' } }, { status: 404 });
    }
    if (String(url).includes('coinbase')) return Response.json({ data: { base: 'SOL', currency: 'USD', amount: '100' } });
    const { method } = JSON.parse(opts.body);
    return Response.json({ result: { getGenesisHash: GENESIS, getLatestBlockhash: { value: { blockhash, lastValidBlockHeight: 200 } }, getBlockHeight: 100, getSignatureStatuses: { value: [null] } }[method] ?? null });
  } });
  const once = async (r) => { const text = await r.text(); return { status: r.status, text, json: () => JSON.parse(text), headers: r.headers }; };
  const call = async (path, init = {}) => once(await handle(new Request(`${ORIGIN}${path}`, init), env, {}));
  const post = (path, data, headers = {}) => call(path, { method: 'POST', headers: { 'content-type': 'application/json', origin: ORIGIN, ...headers }, body: JSON.stringify(data) });
  return { db, env, state, call, post, VAULT };
}

test('the pure bits: a drop id, a row as a register, the first tracenet from its asset with RECIPIENT as payee', async () => {
  assert.equal(dropId('2026-11-03T10:00:00.000Z', 'The subscribe portal: how a drop is gated!'), '2026-11-03-the-subscribe-portal-how-a-drop-is-gated');
  assert.equal(dropId('2026-11-03T10:00:00.000Z', '!!!'), '2026-11-03-drop');
  const reg = rowToRegister({ handle: 'alice', name: 'Alice', line: 'traces', x: 'https://x.com/alice', avatar: null, wallet: ALICE.address, stripe_account: 'acct_alice1234', stripe_price: 'price_alice1234', bronze_cents: 700 }, [{ id: '2026-11-03-x', title: 'x', kind: 'trace', file: 'x.md', bytes: 3, sha256: 'a'.repeat(64), published: '2026-11-03T10:00:00.000Z' }]);
  assert.equal(reg.wallet, ALICE.address); assert.equal(reg.stripe, 'acct_alice1234'); assert.equal(reg.price, 'price_alice1234'); assert.equal(reg.bronzeUsd, 7); assert.equal(reg.items.length, 1);
  const t = setup();
  const first = await creatorOf(t.env, ORIGIN, FIRST_TRACENET);
  assert.equal(first.source, 'asset'); assert.equal(payeeOf(first), RECIPIENT); assert.equal(first.register.items.length, 1, 'the fixture\'s drop');
  assert.equal(await creatorOf(t.env, ORIGIN, 'nobody'), null); assert.equal(await creatorOf(t.env, ORIGIN, '..'), null);
  assert.equal(MAX_DROP, 25 * 1024 * 1024);
});

test('a wallet claims a handle once, with its seat proof; the register answers from D1 with the payee; the front door; a second claim or a second wallet is refused', async () => {
  const t = setup(), proof = await proofOf(ALICE, t.state.time * 1000);
  let r = await t.post(PATH, { handle: '@alice', name: 'Alice', line: 'traces of a game' }); assert.equal(r.status, 401, 'no seat proof');
  r = await t.post(PATH, { handle: 'bad handle', name: 'Alice' }, { 'x-seat': proof }); assert.equal(r.status, 400);
  r = await t.post(PATH, { handle: '@alice', name: 'Alice', line: 'traces of a game' }, { 'x-seat': proof }); assert.equal(r.status, 201, r.text);
  assert.deepEqual(r.json(), { ok: true, handle: 'alice', wallet: ALICE.address, url: 'https://optimism.fit/alice' });
  r = await t.call(`${PATH}/alice`); assert.equal(r.status, 200); const reg = r.json();
  assert.equal(reg.handle, 'alice'); assert.equal(reg.wallet, ALICE.address); assert.equal(reg.x, 'https://x.com/alice'); assert.equal(reg.source, 'd1'); assert.deepEqual(reg.items, []); assert.deepEqual(reg.bronze, { card: false, usd: null });
  r = await t.call(`${PATH}/${FIRST_TRACENET}`); assert.equal(r.status, 200); assert.equal(r.json().wallet, RECIPIENT); assert.equal(r.json().source, 'asset');
  r = await t.call(`${PATH}/nobody`); assert.equal(r.status, 404);
  r = await t.post(PATH, { handle: 'alice', name: 'Mallory' }, { 'x-seat': await proofOf(BOB, t.state.time * 1000) }); assert.equal(r.status, 409, 'the handle is Alice\'s');
  r = await t.post(PATH, { handle: 'alice2', name: 'Alice' }, { 'x-seat': proof }); assert.equal(r.status, 409, 'one tracenet a wallet');
  r = await t.post(PATH, { handle: FIRST_TRACENET, name: 'x' }, { 'x-seat': await proofOf(BOB, t.state.time * 1000) }); assert.equal(r.status, 409, 'the first tracenet is taken by its asset'); { const o = setup(); o.env.SPACE_ROUTER_TREASURY = RECIPIENT; const p = await proofOf(BOB, o.state.time * 1000), claim = (handle) => o.post(PATH, { handle, name: 'Bob' }, { 'x-seat': p }); assert.equal((await claim('bob_x')).status, 402, 'where deposits are open: no flask of 10 USDC'); o.db.prepare("INSERT INTO sr_deposits(signature, payer, tank, amount, usd, mint, cluster, slot, paid_at, credited_at, keyed) VALUES ('s', ?, 't', '0', 10, 'm', 'devnet', 1, 1, 1, 'none')").run(BOB.address); assert.equal((await claim('bob_x')).status, 403, 'A NAME IS ITS OWNER\'S: no X account holds this flask'); o.db.prepare("INSERT INTO sr_x VALUES (?, '7', 'Bob_X', 't', 1, 's')").run(BOB.address); assert.equal((await claim('elonmusk')).status, 403, 'another account\'s handle'); assert.equal((await claim('bob_x')).status, 201, 'the handle X itself said, in any case'); }
  r = await t.call('/alice'); assert.equal(r.status, 302); assert.equal(r.headers.get('location'), 'https://optimism.fit/app/tracenet.html?of=alice');
  r = await t.call('/nobody'); assert.equal(r.status, 404, 'no creator: the assets answer (the stand-in says no)');
});

test('a drop: the creator\'s bytes into R2 and its line into the register; refused for a stranger\'s wallet, the first tracenet, a missing name, too long; the vault opens it to this creator\'s Bronze receipt on Bronze\'s day and to nobody else\'s', async () => {
  const t = setup(), proof = await proofOf(ALICE, t.state.time * 1000);
  assert.equal((await t.post(PATH, { handle: 'alice', name: 'Alice' }, { 'x-seat': proof })).status, 201);
  const bytes = new TextEncoder().encode('# a trace\nhello\n'), sha = createHash('sha256').update(bytes).digest('hex');
  const drop = (headers, body = bytes, handle = 'alice') => t.call(`${PATH}/${handle}/drops`, { method: 'POST', headers: { 'content-type': 'text/markdown', 'content-length': String(body.length), 'x-title': 'A trace', 'x-kind': 'trace', 'x-file': 'trace.md', ...headers }, body });
  let r = await drop({}); assert.equal(r.status, 401, 'no proof');
  r = await drop({ 'x-seat': await proofOf(BOB, t.state.time * 1000) }); assert.equal(r.status, 401, 'another wallet');
  r = await drop({ 'x-seat': proof, 'x-title': '' }); assert.equal(r.status, 400);
  r = await drop({ 'x-seat': proof, 'x-file': 'a/b' }); assert.equal(r.status, 400);
  r = await drop({ 'x-seat': proof, 'content-length': String(MAX_DROP + 1) }); assert.equal(r.status, 413);
  r = await drop({ 'x-seat': proof }, bytes, FIRST_TRACENET); assert.equal(r.status, 403, 'the first tracenet publishes through the house');
  const first = await signedDrop(ALICE, 'alice', { bytes, published: iso(t.state.time * 1000) });
  r = await drop({ 'x-seat': proof, ...first.headers }); assert.equal(r.status, 201, r.text);
  const made = r.json(); assert.equal(made.sha256, sha); assert.equal(made.bytes, bytes.length); assert.match(made.id, /^2027-01-15-a-trace$/);
  assert.ok(t.VAULT.store.has(`vault/alice/${made.id}/trace.md`));
  r = await drop({ 'x-seat': proof, ...(await signedDrop(ALICE, 'alice', { bytes, published: iso(t.state.time * 1000 + 1000), prev: made.line })).headers }); assert.equal(r.status, 409, 'the same title today');
  const reg = (await t.call(`${PATH}/alice`)).json(); assert.equal(reg.items.length, 1); assert.equal(reg.items[0].sha256, sha);
  // the vault: a stranger 402; Alice's own Bronze receipt opens it on Bronze's day; a Bronze receipt for the first tracenet does not
  const vault = `/vault/alice/${made.id}/trace.md`;
  r = await t.call(vault); assert.equal(r.status, 402);
  const fanProof = await proofOf(FAN, t.state.time * 1000);
  const seat = (id, creator, recipient) => t.db.prepare("INSERT INTO premint_orders(id,tier,buyer,recipient,lamports,sol_usd,created_at,expires_at,blockhash,last_valid_block_height,terms_version,github,signature,status,paid_at,creator) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)")
    .run(id, 'bronze', FAN.address, recipient, '100', '100', 1, 2, blockhash, 200, TERMS, '', `sig-${id}`, 'paid', 1, creator);
  seat('deadcafe-0000-4000-8000-000000000001', null, RECIPIENT);   // a seat of the first tracenet's (older rows name none)
  r = await t.call(vault, { headers: { 'x-seat': fanProof } }); assert.equal(r.status, 402, 'a seat of the first tracenet opens nothing of Alice\'s');
  seat('deadcafe-0000-4000-8000-000000000002', 'alice', ALICE.address);
  r = await t.call(vault, { headers: { 'x-seat': fanProof } }); assert.equal(r.status, 402); assert.match(r.json().error, /Bronze Mint opens this drop at/);
  const item = reg.items[0]; t.state.time = Math.ceil(opensFor(item, 'bronze') / 1000);
  r = await t.call(vault, { headers: { 'x-seat': fanProof } }); assert.equal(r.status, 200, r.text); assert.equal(r.text, '# a trace\nhello\n'); assert.equal(r.headers.get('content-type'), 'text/markdown');
  assert.equal(paidRow({ status: 'paid', recipient: ALICE.address, creator: 'alice', terms_version: TERMS, tier: 'bronze', signature: 's' }, { handle: 'alice', wallet: ALICE.address }), true);
  assert.equal(paidRow({ status: 'paid', recipient: ALICE.address, creator: 'alice', terms_version: TERMS, tier: 'bronze', signature: 's' }, { handle: 'bob', wallet: ALICE.address }), false);
  assert.equal(paidRow({ status: 'paid', recipient: RECIPIENT, creator: null, terms_version: TERMS, tier: 'bronze', signature: 's' }, { handle: FIRST_TRACENET, wallet: RECIPIENT }), true);
  r = await setup({ vault: false }).call(`${PATH}/alice/drops`, { method: 'POST', headers: { 'x-seat': proof, 'content-length': '1', 'x-title': 'x', 'x-file': 'x' }, body: 'x' }); assert.equal(r.status, 404, 'no creator in a fresh database');
});

test('THE DROP IS SIGNED BY ITS CREATOR: the door keeps only a line the tracenet\'s wallet signed, at its instant, after the last and naming it; the register carries the chain; a row past the door is no link', async () => {
  const t = setup(), proof = await proofOf(ALICE, t.state.time * 1000), now = t.state.time * 1000;
  assert.equal((await t.post(PATH, { handle: 'alice', name: 'Alice' }, { 'x-seat': proof })).status, 201);
  const bytes = new TextEncoder().encode('# a trace\nhello\n'), other = new TextEncoder().encode('# the second\n');
  const drop = (headers, body = bytes) => t.call(`${PATH}/alice/drops`, { method: 'POST', headers: { 'content-type': 'text/markdown', 'content-length': String(body.length), 'x-seat': proof, ...headers }, body });
  let r = await drop({ 'x-title': 'A trace', 'x-kind': 'trace', 'x-file': 'trace.md' }); assert.equal(r.status, 400, `an unsigned drop, as main kept it, is no drop: ${r.text}`);
  const good = await signedDrop(ALICE, 'alice', { bytes, published: iso(now) });
  r = await drop({ ...good.headers, 'x-sig': (await signedDrop(BOB, 'alice', { bytes, published: iso(now), as: ALICE })).sig }); assert.equal(r.status, 401, 'signed by another wallet');
  r = await drop({ ...good.headers, 'x-title': 'Another title' }); assert.equal(r.status, 401, 'a word changed after the signature');
  r = await drop({ ...good.headers, 'x-sig': '' }); assert.equal(r.status, 401, 'no signature');
  r = await drop({ ...good.headers, 'x-published': '2027-01-15' }); assert.equal(r.status, 400, 'an instant, exactly as the line names it');
  r = await drop((await signedDrop(ALICE, 'alice', { bytes, published: iso(now + 11 * 60000) })).headers); assert.equal(r.status, 400, 'more than ten minutes from the door\'s clock');
  assert.equal(t.VAULT.store.size, 0, 'nothing refused reached the vault');
  r = await drop(good.headers); assert.equal(r.status, 201, r.text);
  const one = r.json(); assert.equal(one.prev, NO_PREV); assert.equal(one.sig, good.sig); assert.equal(one.line, await lineHash(good.text));
  const second = (over) => signedDrop(ALICE, 'alice', { title: 'The second', file: 'second.md', bytes: other, published: iso(now + 1000), prev: one.line, ...over });
  r = await drop((await second({ prev: NO_PREV })).headers, other); assert.equal(r.status, 409, 'it names a line that is not the last');
  r = await drop((await second({ published: iso(now) })).headers, other); assert.equal(r.status, 409, 'not after the line before it');
  const two = await second();
  r = await drop(two.headers, other); assert.equal(r.status, 201, r.text); assert.equal(r.json().prev, one.line);
  let reg = (await t.call(`${PATH}/alice`)).json();
  assert.deepEqual(reg.items.map((i) => [i.title, i.prev, i.sig]), [['The second', one.line, two.sig], ['A trace', NO_PREV, good.sig]], 'the register carries the chain, newest first');
  assert.deepEqual((await proveItems(reg)).items.map((i) => [i.title, i.proof, i.linked]), [['The second', 'signed', true], ['A trace', 'signed', true]]);
  assert.equal(await headOf(reg), await lineHash(two.text));
  // a row written past the door (no signature, or one that does not verify) is not drawn and is no link: the next drop still names the second
  t.db.prepare('INSERT INTO drops(handle,id,title,kind,file,bytes,sha256,published) VALUES(?,?,?,?,?,?,?,?)').run('alice', '2027-01-14-old', 'Old', 'trace', 'old.md', 3, 'a'.repeat(64), iso(now - 86400000));
  t.db.prepare('INSERT INTO drops(handle,id,title,kind,file,bytes,sha256,published,prev,sig) VALUES(?,?,?,?,?,?,?,?,?,?)').run('alice', '2027-01-15-forged', 'Forged', 'trace', 'f.md', 3, 'b'.repeat(64), iso(now + 2000), 'e'.repeat(64), good.sig);   // newest, and a signature that is not over its line
  reg = (await t.call(`${PATH}/alice`)).json(); assert.equal(reg.items.length, 4);
  assert.deepEqual((await proveItems(reg)).items.map((i) => i.title), ['The second', 'A trace'], 'the unsigned row and the forged one are not drawn');
  assert.equal(await headOf(reg), await lineHash(two.text), 'the forged row is skipped by the head');
  r = await drop((await signedDrop(ALICE, 'alice', { title: 'The third', file: 'third.md', bytes, published: iso(now + 3000), prev: await lineHash(two.text) })).headers); assert.equal(r.status, 201, r.text);
  // two drops that name the same last line at once: one is kept (drops_chain, one signed line per prev)
  assert.ok(t.db.prepare("SELECT name FROM sqlite_master WHERE type='index' AND name='drops_chain'").get(), 'the chain\'s index');
  reg = (await t.call(`${PATH}/alice`)).json(); const head = await headOf(reg);
  const [a, b] = await Promise.all(['Fourth A', 'Fourth B'].map(async (title, k) => drop((await signedDrop(ALICE, 'alice', { title, file: `f${k}.md`, bytes, published: iso(now + 4000 + k), prev: head })).headers)));
  assert.deepEqual([a.status, b.status].sort(), [201, 409], `${a.text} / ${b.text}`);
});

test('a SOL seat for a creator pays the creator\'s wallet at the creator\'s price; availability names it; a creator cannot buy its own seat; the first tracenet is unchanged', async () => {
  const t = setup(), proof = await proofOf(ALICE, t.state.time * 1000);
  assert.equal((await t.post(PATH, { handle: 'alice', name: 'Alice' }, { 'x-seat': proof })).status, 201);
  t.db.prepare('UPDATE creators SET bronze_cents=700 WHERE handle=?').run('alice');
  let r = await t.call('/api/premint/availability?creator=alice'); assert.equal(r.status, 200);
  let a = r.json(); assert.equal(a.recipient, ALICE.address); assert.equal(a.creator, 'alice'); assert.equal(a.bronzeUsd, 7);
  r = await t.call('/api/premint/availability'); a = r.json(); assert.equal(a.recipient, RECIPIENT); assert.equal(a.creator, FIRST_TRACENET); assert.equal(a.bronzeUsd, 10);
  r = await t.call('/api/premint/availability?creator=nobody'); assert.equal(r.status, 404);
  const id = (n) => `deadcafe-0000-4000-8000-00000000000${n}`;
  r = await t.post('/api/premint/orders', { id: id(1), tier: 'bronze', buyer: FAN.address, creator: 'alice' }); assert.equal(r.status, 200, r.text);
  let { order } = r.json(); assert.equal(order.recipient, ALICE.address); assert.equal(order.creator, 'alice'); assert.equal(order.lamports, quoteLamports(7, '100'));
  assert.equal(t.db.prepare('SELECT creator FROM premint_orders WHERE id=?').get(id(1)).creator, 'alice');
  r = await t.post('/api/premint/orders', { id: id(2), tier: 'bronze', buyer: FAN.address }); assert.equal(r.status, 200);
  ({ order } = r.json()); assert.equal(order.recipient, RECIPIENT); assert.equal(order.creator, FIRST_TRACENET); assert.equal(order.lamports, quoteLamports(10, '100'));
  assert.equal(t.db.prepare('SELECT creator FROM premint_orders WHERE id=?').get(id(2)).creator, null, 'the first tracenet\'s rows name none, as before');
  r = await t.post('/api/premint/orders', { id: id(3), tier: 'gold', buyer: FAN.address, creator: 'alice' }); assert.equal(r.status, 200); assert.equal(r.json().order.lamports, quoteLamports(1000, '100'), 'Gold\'s old price is the protocol\'s');
  r = await t.post('/api/premint/orders', { id: id(4), tier: 'bronze', buyer: ALICE.address, creator: 'alice' }); assert.equal(r.status, 400, 'her own seat');
  r = await t.post('/api/premint/orders', { id: id(5), tier: 'bronze', buyer: FAN.address, creator: 'nobody' }); assert.equal(r.status, 404);
});

test('the Connect switch: off by default (SOL only); onboarding makes the account once and a link; the price in whole dollars; status asks Stripe; a card checkout to an onboarded creator carries the destination and the 30 %', async () => {
  const t = setup({ keys: true }), proof = await proofOf(ALICE, t.state.time * 1000), bob = await proofOf(BOB, t.state.time * 1000);
  assert.equal((await t.post(PATH, { handle: 'alice', name: 'Alice' }, { 'x-seat': proof })).status, 201);
  let r = await t.call(`${BRONZE.plan}?creator=alice`); assert.deepEqual(r.json(), { card: false, sol: true, creator: 'alice', usd: null }, 'SOL only until the switch');
  r = await t.post(BRONZE.checkout, { back: 'https://optimism.fit/app/tracenet.html?of=alice', creator: 'alice' }); assert.equal(r.status, 409);
  r = await t.post(CONNECT.onboard, { handle: 'alice', back: 'https://optimism.fit/app/creator.html' }); assert.equal(r.status, 401);
  r = await t.post(CONNECT.onboard, { handle: 'alice', back: 'https://optimism.fit/app/creator.html' }, { 'x-seat': bob }); assert.equal(r.status, 401);
  r = await t.post(CONNECT.onboard, { handle: FIRST_TRACENET, back: 'https://optimism.fit/app/creator.html' }, { 'x-seat': proof }); assert.equal(r.status, 409, 'the first tracenet is the platform');
  r = await t.post(CONNECT.onboard, { handle: 'alice', back: 'https://optimism.fit/app/creator.html' }, { 'x-seat': proof }); assert.equal(r.status, 201, r.text);
  assert.deepEqual(r.json(), { url: 'https://connect.stripe.com/setup/e/acct_alice1234/x', account: 'acct_alice1234' });
  const made = new URLSearchParams(t.state.calls.find((c) => c.route === '/v1/accounts').body); assert.equal(made.get('type'), 'express'); assert.equal(made.get('metadata[handle]'), 'alice');
  const link = new URLSearchParams(t.state.calls.find((c) => c.route === '/v1/account_links').body); assert.equal(link.get('return_url'), 'https://optimism.fit/app/creator.html?connect=return');
  r = await t.post(CONNECT.onboard, { handle: 'alice', back: 'https://optimism.fit/app/creator.html' }, { 'x-seat': proof }); assert.equal(r.status, 201);
  assert.equal(t.state.calls.filter((c) => c.route === '/v1/accounts' && c.method === 'POST').length, 1, 'the account is made once');
  r = await t.post(CONNECT.price, { handle: 'alice', usd: 7.5 }, { 'x-seat': proof }); assert.equal(r.status, 400, 'whole dollars');
  r = await t.post(CONNECT.price, { handle: 'alice', usd: 7 }, { 'x-seat': proof }); assert.equal(r.status, 201); assert.deepEqual(r.json(), { ok: true, handle: 'alice', price: 'price_alice1234', usd: 7 });
  const price = new URLSearchParams(t.state.calls.find((c) => c.route === '/v1/prices').body); assert.equal(price.get('unit_amount'), '700'); assert.equal(price.get('recurring[interval]'), 'month'); assert.equal(price.get('product_data[name]'), 'Bronze · alice');
  r = await t.call(`${CONNECT.status}?handle=alice`, { headers: { 'x-seat': proof } }); assert.deepEqual(r.json(), { handle: 'alice', account: 'acct_alice1234', onboarded: false, price: 'price_alice1234', usd: 7, card: false });
  r = await t.call(`${BRONZE.plan}?creator=alice`); assert.equal(r.json().card, false, 'not onboarded yet: no card road');
  t.state.enabled = true;
  r = await t.call(`${CONNECT.status}?handle=alice`, { headers: { 'x-seat': proof } }); assert.equal(r.json().onboarded, true); assert.equal(r.json().card, true);
  r = await t.call(`${BRONZE.plan}?creator=alice`); assert.deepEqual(r.json(), { card: true, usd: 7, currency: 'usd', interval: 'month', sol: true, creator: 'alice', destination: true });
  r = await t.post(BRONZE.checkout, { back: 'https://optimism.fit/app/tracenet.html?of=alice', creator: 'alice' }); assert.equal(r.status, 201, r.text);
  const session = new URLSearchParams(t.state.calls.find((c) => c.route === '/v1/checkout/sessions').body);
  assert.equal(session.get('line_items[0][price]'), 'price_alice1234'); assert.equal(session.get('subscription_data[transfer_data][destination]'), 'acct_alice1234');
  assert.equal(session.get('subscription_data[application_fee_percent]'), String(PLATFORM_FEE_PERCENT)); assert.equal(PLATFORM_FEE_PERCENT, 30); assert.equal(session.get('subscription_data[metadata][creator]'), 'alice');
  assert.equal(t.db.prepare('SELECT creator FROM bronze_subs').get().creator, 'alice');
  // the first tracenet's card checkout: the platform's own price, no destination, no fee
  r = await t.post(BRONZE.checkout, { back: 'https://optimism.fit/app/warm.html' }); assert.equal(r.status, 201);
  const own = new URLSearchParams(t.state.calls.at(-1).body); assert.equal(own.get('line_items[0][price]'), 'price_first'); assert.equal(own.get('subscription_data[transfer_data][destination]'), null); assert.equal(own.get('subscription_data[application_fee_percent]'), null);
  r = await t.call(`${BRONZE.plan}`); assert.equal(r.json().creator, FIRST_TRACENET); assert.equal(r.json().usd, 10);
});

test('THE STAMP IS THE COSIGN: a stamper\'s half on a drop waits, the creator\'s countersign completes it, the register carries the stamps and a reader counts the cosigned, each stamper once; what the door refuses', async () => {
  const t = setup(), now = t.state.time * 1000, proof = await proofOf(ALICE, now);
  assert.equal((await t.post(PATH, { handle: 'alice', name: 'Alice' }, { 'x-seat': proof })).status, 201);
  const bytes = new TextEncoder().encode('# a trace\nhello\n'), on = createHash('sha256').update(bytes).digest('hex'), d = await signedDrop(ALICE, 'alice', { bytes, published: iso(now) });
  let r = await t.call(`${PATH}/alice/drops`, { method: 'POST', headers: { 'content-type': 'text/markdown', 'content-length': String(bytes.length), 'x-seat': proof, ...d.headers }, body: bytes });
  assert.equal(r.status, 201, r.text);
  t.state.time += 120;   // two minutes on: the follows come after the drop
  const at = iso(now + 60000), signWith = async (w, text) => encode58(new Uint8Array(await crypto.subtle.sign('Ed25519', w.pair.privateKey, new TextEncoder().encode(text))));
  const stamp = async (w, { by = ALICE, drop = on, door = 'MOD', when = at, cosigner = null } = {}) => { const s = { stamper: w.address, by: by.address, on: drop, door, at: when }, text = stampText(s);
    return { ...s, sig: await signWith(w, text), ...(cosigner ? { cosig: await signWith(cosigner, text) } : {}) }; };
  const put = (body, handle = 'alice') => t.post(`${PATH}/${handle}/stamps`, body);
  const half = await stamp(BOB);
  r = await put(half, 'nobody'); assert.equal(r.status, 404, 'no such tracenet');
  r = await put({ ...half, stamper: ALICE.address }); assert.equal(r.status, 400, 'nobody stamps their own drop');
  r = await put({ ...half, door: 'mod' }); assert.equal(r.status, 400, 'a door of the five');
  r = await put(await stamp(FAN, { by: BOB })); assert.equal(r.status, 409, 'the creator it names is not this tracenet\'s wallet');
  r = await put(await stamp(BOB, { drop: 'c'.repeat(64) })); assert.equal(r.status, 404, 'no such drop on this tracenet');
  r = await put(await stamp(BOB, { when: iso(now - 1000) })); assert.equal(r.status, 400, 'followed before it was published');
  r = await put(await stamp(BOB, { when: iso(t.state.time * 1000 + 11 * 60000) })); assert.equal(r.status, 400, 'from the future');
  r = await put({ ...half, sig: await signWith(FAN, stampText(half)) }); assert.equal(r.status, 401, 'the half signed by another wallet');
  r = await put({ ...half, sig: undefined }); assert.equal(r.status, 401, 'no signature');
  r = await put({ ...half, cosig: await signWith(FAN, stampText(half)) }); assert.equal(r.status, 401, 'a countersign that is not the creator\'s');
  r = await put({ ...half, cosig: 5 }); assert.equal(r.status, 401);
  assert.equal(t.db.prepare('SELECT COUNT(*) AS n FROM stamps').get().n, 0, 'nothing refused was kept');
  r = await put(half); assert.equal(r.status, 201, r.text); const { id } = r.json(); assert.equal(id, createHash('sha256').update(stampText(half)).digest('hex')); assert.equal(r.json().cosigned, false);
  r = await put(half); assert.equal(r.status, 200, 'the same half again'); assert.deepEqual(r.json(), { ok: true, id, cosigned: false });
  r = await put(await stamp(BOB, { door: 'API' })); assert.equal(r.status, 409, 'one stamp a stamper a drop');
  let reg = (await t.call(`${PATH}/alice`)).json(); const proven = new Map();
  assert.deepEqual(reg.stamps, [half], 'the register carries the half as it was signed');
  await proveStamps(reg.stamps, proven); assert.equal(cosignsOn(reg.stamps, { on, by: ALICE.address }, proven), 0, 'a half is no cosign');
  const cosig = await signWith(ALICE, stampText(half));
  r = await put({ ...half, cosig }); assert.equal(r.status, 200, r.text); assert.deepEqual(r.json(), { ok: true, id, cosigned: true }, 'the creator\'s countersign completes it');
  r = await put(half); assert.deepEqual(r.json(), { ok: true, id, cosigned: true }, 'and the half again finds it cosigned');
  r = await put(await stamp(FAN, { door: 'GAMEPAD', cosigner: ALICE })); assert.equal(r.status, 201, r.text); assert.equal(r.json().cosigned, true, 'a stamp may come whole');
  reg = (await t.call(`${PATH}/alice`)).json(); assert.equal(reg.stamps.length, 2); assert.ok(reg.stamps.every((s) => typeof s.cosig === 'string'));
  await proveStamps(reg.stamps, proven); assert.equal(cosignsOn(reg.stamps, { on, by: ALICE.address }, proven), 2, 'bob and the fan');
  // a row written past the door (a countersign that is not alice's) is no cosign for any reader
  const MALLORY = await wallet(), forged = await stamp(MALLORY, { cosigner: MALLORY });
  t.db.prepare('INSERT INTO stamps(id,handle,drop_sha256,by_wallet,stamper,door,at,sig,cosig,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)').run('f'.repeat(64), 'alice', on, ALICE.address, MALLORY.address, 'MOD', at, forged.sig, forged.cosig, 1);
  reg = (await t.call(`${PATH}/alice`)).json(); assert.equal(reg.stamps.length, 3);
  await proveStamps(reg.stamps, proven); assert.equal(cosignsOn(reg.stamps, { on, by: ALICE.address }, proven), 2, 'the forged row adds nobody');
  // at most MAX_WAITING halves wait on a drop; a whole stamp waits on nobody
  assert.equal(t.db.prepare('SELECT COUNT(*) AS n FROM stamps WHERE cosig IS NULL').get().n, 0, 'none waits now');
  for (let k = 0; k < MAX_WAITING; k++) { r = await put(await stamp(await wallet())); assert.equal(r.status, 201, r.text); }
  r = await put(await stamp(await wallet())); assert.equal(r.status, 429, 'the halves that wait are full');
  r = await put(await stamp(await wallet(), { cosigner: ALICE })); assert.equal(r.status, 201, 'a cosigned stamp still comes');
  // the first tracenet's drops take stamps as well: its creator is its register's wallet (RECIPIENT)
  const first = (await t.call(`${PATH}/${FIRST_TRACENET}`)).json(), item = first.items[0], owner = { address: first.wallet };
  r = await put(await stamp(BOB, { by: owner, drop: item.sha256, when: iso(Math.max(Date.parse(item.published), now)) }), FIRST_TRACENET); assert.equal(r.status, 201, r.text); assert.equal(r.json().cosigned, false);
  assert.equal((await t.call(`${PATH}/${FIRST_TRACENET}`)).json().stamps.length, 1);
});

// THE VOW MAKES THE PAGE (Nov 4 2026, tools/embertide-mesh/lib/tracenet-create.mjs): the house's key claims at the Vow and signs each cleaned trace's line; this
// door, the one optimism.fit runs, checks both; and the Nest's chain is the register it serves, line for line (the gate of "The tracenet, annealed")
test('THE VOW MAKES THE PAGE: the house claims its page at the Vow, its signed lines pass this door, and the Nest\'s chain is the register served', async () => {
  const t = setup(), refs = new Map(), keyFile = join(mkdtempSync(join(tmpdir(), 'tracenet-house-')), 'house.key.pem');
  const door = { read: async (n) => refs.get(n) ?? null, write: async (n, value, { expect }) => { if ((refs.get(n)?.rev ?? 0) !== expect) throw Object.assign(new Error('Nest refused (409)'), { status: 409 }); refs.set(n, { value, rev: expect + 1 }); return { ref: refs.get(n) }; } };
  const fetch = async (url, init = {}) => {   // the wire: the Space Router's pay stood in, the rest this Worker, with the length the wire would carry
    if (new URL(url).pathname === SITE_PATH) return Response.json({ sol: 0.1, usd: 9.28, warm: 9.28, receipt: 2, at: iso(t.state.time * 1000), fuel_usd: 1 }, { status: 201 });
    const r = await t.call(new URL(url).pathname, { ...init, headers: { ...init.headers, ...(init.body ? { 'content-length': String(init.body.length) } : {}) } }); return new Response(r.text, { status: r.status });
  };
  const house = createTracenetDoor({ site: ORIGIN, door, keyFile, fetch, keyOf: () => 'sr_stand_in', clock: () => t.state.time * 1000 });
  const [code, made] = await house.create({ name: 'Wtg', colour: '#ebb22c' });
  assert.equal(code, 200); assert.deepEqual([made.page.url, refs.get('tracenet/house').value.page.handle], [`${ORIGIN}/Wtg`, 'Wtg']);
  assert.equal((await t.call(`${PATH}/Wtg`)).json().wallet, made.page.signer, 'the site names the house\'s key as the creator'); assert.equal(statSync(keyFile).mode & 0o777, 0o600);
  assert.equal((await house.claim('Wtg', 'Wtg')).url, `${ORIGIN}/Wtg`, 'a claim the site holds for this key stands (a press again)'); assert.match((await house.claim('two words')).error, /address/);
  const tank = await tankOfAuthority(FAN.address), riders = async () => (await t.call(`/space-router/v1/portrait?riders=${FAN.address}`)).json(), at0 = (t.state.time + 60) * 1000; t.db.prepare('INSERT INTO sr_tanks(name, key_sha256, markup_bps, made_at) VALUES (?, ?, 500, 0)').run(tank, keyHash('sr_stand_in'));   // the rider's flask, whose tank this Harmony's key opens
  assert.deepEqual(await riders(), { riders: {}, registered: 0 }, 'no trace egressed yet: no claw rider, nothing minted, nothing paid');
  for (const title of ['The first trace', 'The second trace']) {
    t.state.time += 60; const [c, d] = await house.drop({ bytes: Buffer.from(`# ${title}\n`), file: 'trace.md', title, sanitized: { ref: 'tracenet/sanitized/x', rev: 1, seat: 'mac', ts: 1 } }); assert.equal(c, 201, d.error);
  }
  const served = (await t.call(`${PATH}/Wtg`)).json(), chain = refs.get(CHAIN('Wtg')).value;
  assert.deepEqual((await proveItems(served)).items.map((i) => [i.proof, i.linked]), [['signed', true], ['signed', true]], 'each line the house\'s, each naming the one before');
  const line = ({ id, title, kind, file, bytes, sha256, published, prev, sig }) => ({ id, title, kind, file, bytes, sha256, published, prev, sig });
  assert.deepEqual(chain.items.map(line), served.items.map(line), 'THE GATE: the Nest\'s chain is the register served, line for line'); assert.equal(chain.items[0].sanitized.ref, 'tracenet/sanitized/x');
  assert.equal((await house.drop({ bytes: Buffer.from('x'), file: 'x.md', title: 'café' }))[0], 400, 'a title that cannot travel in a header');
  // THE CLAW RIDER IS REGISTERED: its tracenet egressed a trace under its Harmony's key: the first registers the rider, the second moves only a count and a time
  assert.deepEqual({ ...t.db.prepare('SELECT * FROM sr_riders').get() }, { tank, handle: 'Wtg', traces: 2, first_at: at0, last_at: at0 + 60000 });
  assert.deepEqual(await riders(), { riders: { [FAN.address]: { rider: { traces: 2, at: iso(at0 + 60000) } } }, registered: 1 }, 'every key of that rider says so beside its face');
  t.state.time += 60; assert.equal((await createTracenetDoor({ site: ORIGIN, door, keyFile, fetch, keyOf: () => '', clock: () => t.state.time * 1000 }).drop({ bytes: Buffer.from('# three\n'), file: 'trace.md', title: 'The third trace' }))[0], 201);
  assert.equal(t.db.prepare('SELECT traces FROM sr_riders').get().traces, 2, 'a drop under no key is taken as before and registers nobody');
});

// space-router-oracle.test.mjs · THE ROUTER IS THE ORACLE (app/space-router-oracle.mjs, worker/space-router.mjs, tools/space-router-oracle.mjs; lane/the-router-is-
// the-oracle, his Oct 30 2026 04:46:03 UTC "Yes, build it"): every burned call's receipt, signed with the router's key, verified as a stranger would; each hour
// sealed into an RFC 9162 Merkle root that never changes; a receipt's proof for its own tank only; the anchor's memo. On a database built by every migration in
// order, through the Worker's own handler; MiniRouter is a stand-in: no network, no money, no chain.  node --test worker/space-router-oracle.test.mjs (Node 22+)
import test from 'node:test';
import assert from 'node:assert/strict';
import { d1, migrated, migrations } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by the migrations named
import { createHandler } from './premint.mjs';
import { CHAT_PATH, ORACLE_PATH, ROOT_PATH, PROOF_PATH, UPSTREAM, CARD_BYTES } from './space-router.mjs';
import * as O from '../app/space-router-oracle.mjs';
import { addSql, refillSql, keyHash, newKey } from '../tools/space-router-tank.mjs';
import { anchorDraft, memoInstruction, MAX_TX } from '../tools/space-router-oracle.mjs';
import { TERMS, encode58, seatSignIn, sealSeatProof } from '../app/dl-direct-protocol.mjs';
import { signerOf } from '../vendor/tools/warm-launch/rpc.mjs';

const SITE = 'https://optimism.fit', OPEN = Date.UTC(2026, 9, 31, 12), SOL = 'openai/gpt-5.6-sol';
const ORACLE = await O.newOracleKey();
const enc = new TextEncoder(), dec = new TextDecoder();

function router() {   // MiniRouter's shape: its cost in its header; it answers the model it was asked, and says the words it was given back; s.usage adds to its usage
  const calls = [], s = { usage: {} };
  const fetcher = async (url, init = {}) => {
    const body = init.body ? JSON.parse(init.body) : null; calls.push(body);
    const said = body.messages.at(-1).content;
    return new Response(JSON.stringify({ id: `chatcmpl-${calls.length}`, object: 'chat.completion', created: 1, model: body.model,
      choices: [{ index: 0, message: { role: 'assistant', content: `heard: ${said}` }, finish_reason: 'stop' }], usage: { prompt_tokens: 12, completion_tokens: 3, total_tokens: 15, ...s.usage } }),
    { status: 200, headers: { 'content-type': 'application/json', 'x-minirouter-cost-usd': '0.0979' } });
  };
  return { calls, fetcher, s };
}
function setup({ oracle = ORACLE.secret, through = migrations.length } = {}) {
  const db = migrated(migrations.slice(0, through));
  const up = router(), clock = { ms: OPEN + 60_000 }, handle = createHandler({ fetcher: up.fetcher, clockMs: () => clock.ms });
  const env = { ASSETS: { fetch: () => new Response('asset') }, DB: d1(db), SPACE_ROUTER_KEY: 'mr-house-key-for-tests', SPACE_ROUTER_OPENED_AT: new Date(OPEN).toISOString(),
    ...(oracle === null ? {} : { SPACE_ROUTER_ORACLE_KEY: oracle }) };
  const tank = (name, usd = 10) => { const key = newKey(); db.exec(addSql(name, keyHash(key), { nowMs: clock.ms })); db.exec(refillSql(name, usd, 'a test pour', { nowMs: clock.ms })); return key; };
  const ask = (path, { method = 'GET', key, body, headers = {} } = {}) => handle(new Request(`${SITE}${path}`, { method,
    headers: { ...(key ? { authorization: `Bearer ${key}` } : {}), ...(body ? { 'content-type': 'application/json' } : {}), 'cf-connecting-ip': '203.0.113.7', ...headers },
    body: body ? JSON.stringify(body) : undefined }), env, {});
  const call = (key, words = 'say ok', extra = {}) => ask(CHAT_PATH, { method: 'POST', key, body: { model: SOL, messages: [{ role: 'user', content: words }], ...extra } });
  return { db, env, up, clock, tank, ask, call };
}
const receiptIn = (r) => JSON.parse(dec.decode(O.fromB64u(r.headers.get('x-space-router-receipt'))));
const leafHex = async (signed) => O.hexOf(await O.leafOf(signed));

test('a burned call answers with its receipt, signed by the key /oracle names: the sha256 of what was asked and of what came back, the models, the provider, the cost; the door keeps the receipt and never the words', async () => {
  const s = setup(), key = s.tank('rider-one');
  const oracle = await (await s.ask(ORACLE_PATH)).json();
  assert.deepEqual([oracle.alg, oracle.key, oracle.period_ms, oracle.seal_after_ms, oracle.anchor], ['Ed25519', ORACLE.publicHex, 3_600_000, 300_000, null]);
  const asked = { model: SOL, messages: [{ role: 'user', content: 'say ok' }] };
  const r = await s.call(key), answer = await r.json(), signed = receiptIn(r);
  assert.equal(await O.verifyReceipt(signed, oracle.key), true, 'a stranger verifies it with the key the door names');
  assert.deepEqual({ ...signed, nonce: 0, sig: 0 }, { v: 1, at: s.clock.ms, tank: 'rider-one', asked_model: SOL, model: SOL, provider: new URL(UPSTREAM).host,
    ask: await O.askOf(asked), answer: await O.answerOf(answer), usd: 0.102795, router_usd: 0.0979, tokens_in: 12, tokens_out: 3, tokens_cached: null, nonce: 0, by: ORACLE.publicHex, sig: 0 });
  assert.equal(signed.answer, O.hexOf(await O.sha256(enc.encode(O.canonical(answer)))), 'the answer is the whole answer the caller got, canonical');
  const row = { ...s.db.prepare('SELECT * FROM sr_receipts').get() };
  assert.deepEqual([row.period, row.at, row.tank, row.body, row.leaf], [O.periodOf(s.clock.ms), s.clock.ms, 'rider-one', O.canonical(signed), await leafHex(signed)]);
  assert.equal(/say ok|heard/.test(JSON.stringify(s.db.prepare('SELECT * FROM sr_receipts').all())), false, 'nothing of what was said is kept');
  for (const lie of [{ usd: 0.000001 }, { model: 'another/model' }, { answer: await O.answerOf({ ...answer, choices: [] }) }, { by: '00'.repeat(32) }])
    assert.equal(await O.verifyReceipt({ ...signed, ...lie }, oracle.key), false, `a receipt with ${Object.keys(lie)[0]} changed does not verify`);
  const other = await O.newOracleKey();
  assert.equal(await O.verifyReceipt(signed, other.publicHex), false, 'nor under another key');
  const streamed = receiptIn(await s.call(key, 'say ok', { stream: true, stream_options: { include_usage: true } }));
  assert.equal(streamed.ask, signed.ask, 'a stream asks the same: how it travels is not what it asks');
  assert.notEqual(streamed.nonce, signed.nonce, 'two equal calls are two receipts');
  const cachedRows = () => s.db.prepare("SELECT tokens_cached FROM sr_ledger WHERE kind = 'burn' ORDER BY id").all().map((r) => r.tokens_cached);
  s.up.s.usage = { prompt_tokens_details: { cached_tokens: 11 } };
  assert.equal(receiptIn(await s.call(key, 'cached on the chat wire')).tokens_cached, 11, 'the chat wire\'s cached input, in the receipt');
  s.up.s.usage = { cache_read_input_tokens: 9 };
  assert.equal(receiptIn(await s.call(key, 'cached on Anthropic\'s wire')).tokens_cached, 9, 'and Anthropic\'s');
  s.up.s.usage = { prompt_tokens_details: { cached_tokens: 0 } };
  assert.equal(receiptIn(await s.call(key, 'none cached')).tokens_cached, 0, 'a cache that paid for nothing is 0, not unsaid');
  assert.deepEqual(cachedRows(), [null, null, 11, 9, 0], 'the ledger keeps it beside tokens_in and tokens_out');
});

test('shut without the oracle: no key, a key that is not one, a database behind either of the oracle\'s migrations; nothing is sent upstream and nothing is charged', async () => {
  for (const s of [setup({ oracle: null }), setup({ oracle: '{"kty":"OKP"}' }), setup({ oracle: 'not json' }), setup({ through: migrations.indexOf('0012_the_oracle.sql') }),
    setup({ through: migrations.indexOf('0013_the_cached_input.sql') })]) {
    const key = s.tank('rider-one'), r = await s.call(key);
    assert.equal(r.status, 503); assert.match((await r.json()).error.message, /being prepared/);
    assert.equal(s.up.calls.length, 0, 'nothing went upstream');
    assert.equal(s.db.prepare("SELECT COUNT(*) AS n FROM sr_ledger WHERE kind = 'burn'").get().n, 0);
  }
  const s = setup({ oracle: null });
  assert.equal((await s.ask(ORACLE_PATH)).status, 503); assert.equal((await s.ask(`${ROOT_PATH}?period=1`)).status, 503);
});

test('RFC 9162: Certificate Transparency\'s test vectors; every inclusion proof of trees of 1 to 17 leaves holds, and a wrong leaf or index fails', async () => {
  const inputs = ['', '00', '10', '2021', '3031', '40414243', '5051525354555657', '606162636465666768696a6b6c6d6e6f'].map(O.bytesOfHex);
  const ct = []; for (const d of inputs) ct.push(await O.sha256(Uint8Array.from([0, ...d])));
  const roots = ['6e340b9cffb37a989ca544e6bb780a2c78901d3fb33738768511a30617afa01d', 'fac54203e7cc696cf0dfcb42c92a1d9dbaf70ad9e621f4bd8d98662f00e3c125',
    'aeb6bcfe274b70a14fb067a5e5578264db0fa9b51af5e0ba159158f329e06e77', 'd37ee418976dd95753c1c73862b9398fa2a2cf9b4ff0fdfe8b30cd95209614b7',
    '4e3bbb1f7b478dcfe71fb631631519a3bca12c9aefca1612bfce4c13a86264d4', '76e67dadbcdf1e10e1b74ddc608abd2f98dfb16fbce75277b5232a127f2087ef',
    'ddb89be403809e325750d3d263cd78929c2942b7942a34b77e122c9594a74c8c', '5dc9da79a70659a9ad559cb701ded9a2ab9d823aad2f4960cfe370eff4604328'];
  for (let n = 1; n <= 8; n++) assert.equal(O.hexOf(await O.rootOf(ct.slice(0, n))), roots[n - 1], `the root of ${n}`);
  assert.equal(O.hexOf(await O.rootOf([])), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', 'the empty tree');
  for (let n = 1; n <= 17; n++) {
    const leaves = []; for (let i = 0; i < n; i++) leaves.push(await O.sha256(enc.encode(`receipt ${i}`)));
    const root = await O.rootOf(leaves);
    for (let i = 0; i < n; i++) {
      const p = await O.proofOf(leaves, i);
      assert.equal(await O.verifyInclusion(leaves[i], i, n, p, root), true, `leaf ${i} of ${n}`);
      if (n > 1) assert.equal(await O.verifyInclusion(leaves[(i + 1) % n], i, n, p, root), false, 'another leaf');
      if (n > 1) assert.equal(await O.verifyInclusion(leaves[i], (i + 1) % n, n, p, root), false, 'another place');
      assert.equal(await O.verifyInclusion(leaves[i], n, n, p, root), false, 'a place past the end');   // the size itself is bound by the anchored memo, not the path
    }
  }
});

test('an hour is sealed only once it is five minutes over, then never changes; a receipt\'s proof is its own tank\'s alone and leads to the sealed root', async () => {
  const s = setup(), key = s.tank('rider-one'), other = s.tank('rider-two');
  const P = O.periodOf(s.clock.ms), signed = [];
  for (const w of ['one', 'two', 'three', 'four', 'five']) signed.push(receiptIn(await s.call(w === 'four' ? other : key, w)));
  let r = await s.ask(`${ROOT_PATH}?period=${P}`);
  assert.equal(r.status, 409); assert.match((await r.json()).error.message, /is sealed at 2026-10-31T13:05:00.000Z/);
  const leaf = await leafHex(signed[0]);
  assert.equal((await s.ask(`${PROOF_PATH}?receipt=${leaf}`, { key })).status, 409, 'no proof before the seal');
  s.clock.ms = O.sealableAt(P) - 1; assert.equal((await s.ask(`${ROOT_PATH}?period=${O.hourOf(P)}`)).status, 409, 'a millisecond before');
  s.clock.ms = O.sealableAt(P);
  r = await s.ask(`${ROOT_PATH}?period=${O.hourOf(P)}`); const seal = await r.json();
  const leaves = []; for (const x of signed) leaves.push(await O.leafOf(x));
  assert.deepEqual([r.status, seal.period, seal.hour, seal.n, seal.root, seal.by], [200, P, '2026-10-31T12Z', 5, O.hexOf(await O.rootOf(leaves)), ORACLE.publicHex]);
  s.db.prepare('INSERT INTO sr_receipts(period, at, tank, leaf, body) VALUES (?, ?, ?, ?, ?)').run(P, s.clock.ms, 'rider-one', 'ab'.repeat(32), '{}');
  s.clock.ms += 86_400_000;
  assert.deepEqual(await (await s.ask(`${ROOT_PATH}?period=${P}`)).json(), seal, 'a day later, with a receipt written after the seal: the same root');
  assert.equal((await s.ask(`${PROOF_PATH}?receipt=${'ab'.repeat(32)}`, { key })).status, 409, 'the late one is said to be outside it');
  const proof = await (await s.ask(`${PROOF_PATH}?receipt=${leaf}`, { key })).json();
  assert.deepEqual([proof.index, proof.n, proof.root, proof.receipt], [0, 5, seal.root, signed[0]]);
  assert.equal(await O.verifyInclusion(await O.leafOf(proof.receipt), proof.index, proof.n, proof.proof.map(O.bytesOfHex), O.bytesOfHex(seal.root)), true);
  assert.equal(await O.verifyReceipt(proof.receipt, ORACLE.publicHex), true);
  const fourth = await leafHex(signed[3]);
  assert.equal((await s.ask(`${PROOF_PATH}?receipt=${fourth}`, { key })).status, 404, 'another tank\'s receipt is not this tank\'s to prove');
  assert.equal((await s.ask(`${PROOF_PATH}?receipt=${fourth}`, { key: other })).status, 200);
  assert.equal((await s.ask(`${PROOF_PATH}?receipt=${leaf}`)).status, 401, 'no key, no proof');
  assert.equal((await s.ask(`${PROOF_PATH}?receipt=nothex`, { key })).status, 400);
  const empty = await (await s.ask(`${ROOT_PATH}?period=${P - 5}`)).json();
  assert.deepEqual([empty.n, empty.root, empty.sealed_at], [0, O.hexOf(await O.rootOf([])), null], 'an hour without receipts is the empty tree');
  assert.equal(s.db.prepare('SELECT COUNT(*) AS n FROM sr_seals').get().n, 1, 'and is not written');
  assert.equal((await s.ask(`${ROOT_PATH}?period=soon`)).status, 400);
});

test('the anchor: a memo of the hour, the count, the root and the key, read back the same; one Memo-program transaction, signed, under the size a transaction carries', async () => {
  const memo = O.memoOf({ period: 498149, n: 5, root: 'cd'.repeat(32), by: ORACLE.publicHex });
  assert.equal(memo, `space-router oracle v1 2026-10-30T05Z n=5 root=${'cd'.repeat(32)} by=${ORACLE.publicHex}`);
  assert.deepEqual(O.memoRead(memo), { period: 498149, hour: '2026-10-30T05Z', n: 5, root: 'cd'.repeat(32), by: ORACLE.publicHex });
  assert.equal(O.memoRead(`${memo} and more`), null);
  const seed = Buffer.from('11'.repeat(32), 'hex'), { createPrivateKey, createPublicKey } = await import('node:crypto');
  const priv = createPrivateKey({ key: Buffer.concat([Buffer.from('302e020100300506032b657004220420', 'hex'), seed]), format: 'der', type: 'pkcs8' });
  const payer = signerOf([...seed, ...createPublicKey(priv).export({ format: 'der', type: 'spki' }).subarray(12)]);
  const ix = memoInstruction(memo, payer.address), draft = anchorDraft(memo, payer);
  assert.deepEqual([ix.program, ix.keys, ix.data.toString('utf8')], ['MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr', [{ key: payer.address, signer: true, writable: true }], memo]);
  assert.ok(draft.size <= MAX_TX && draft.message.includes(Buffer.from(memo)), `${draft.size} bytes, the memo inside`);
});

// THE NAMED WALK ON THE DOOR (worker/space-router.mjs trailOf, O.walkedOf): a creator's tracenet in D1 (worker/creators.mjs), its cards' bytes in a stand-in R2,
// read only through the vault's own gate (worker/tracenet-vault.mjs). An invented tracenet and invented cards.
const TN = 'kiln_traces', DAY = 86_400_000, CARD = enc.encode('### the dive lands on the beat\n- **Fix:** in `ball-dive.mjs`, read the clock\n```js\ndiveAt(path, t)\n```\n');
function trails(s) {
  const bytes = new Map(), reads = [], hex = async (b) => O.hexOf(await O.sha256(b)), prepare = s.env.DB.prepare;   // reads: the register's D1 reads, then R2's
  s.env.DB.prepare = (sql) => { const m = /FROM (creators|drops) WHERE/.exec(sql); if (m) reads.push(m[1]); return prepare(sql); };
  s.env.VAULT = { get: async (k) => { reads.push(k); const b = bytes.get(k); return b ? { body: b, size: b.length, httpMetadata: { contentType: 'text/markdown' } } : null; } };
  s.db.prepare('INSERT INTO creators(handle, name, wallet, created_at, updated_at) VALUES (?, ?, ?, 1, 1)').run(TN, 'Kiln', '11111111111111111111111111111111');
  const card = async (id, ageMs, b = CARD) => { bytes.set(`vault/${TN}/${id}/card.md`, b); s.db.prepare('INSERT INTO drops(handle, id, title, kind, file, bytes, sha256, published) VALUES (?, ?, ?, ?, ?, ?, ?, ?)')
    .run(TN, id, id, 'card', 'card.md', b.length, await hex(b), new Date(s.clock.ms - ageMs).toISOString()); return `${TN}/${id}`; };
  const said = { model: SOL, messages: [{ role: 'system', content: 'be brief' }, { role: 'user', content: 'fix the dive' }] };
  return { reads, card, hex, said, walk: (trail, key, headers = {}) => s.ask(CHAT_PATH, { method: 'POST', key, body: said, headers: { 'x-snowtrace': trail, ...headers } }) };
}

test('THE NAMED WALK ON THE DOOR: x-snowtrace names a card; the provider gets it as one quoted reference before the caller\'s own words, the signed receipt names it, and a call without it goes as it came, reading no vault', async () => {
  const s = setup(), key = s.tank('follower'), t = trails(s), open = await t.card('2026-10-14-the-dive', 16 * DAY);   // past OPEN_DAYS: everyone's
  const r = await t.walk(open, key), signed = receiptIn(r), w = { tracenet: TN, card: '2026-10-14-the-dive', sha256: await t.hex(CARD) };
  assert.equal(r.status, 200); assert.equal(r.headers.get('x-space-router-walk'), open, 'the answer says it walked');
  assert.deepEqual(signed.walk, w, 'the receipt names the trail and the sha256 of the bytes walked'); assert.equal(await O.verifyReceipt(signed, ORACLE.publicHex), true);
  assert.equal(signed.ask, await O.askOf(t.said), 'its ask is the call as the caller sent it: the walk is named beside it, never mixed in');
  const sent = s.up.calls.at(-1), quoted = sent.messages[1].content;
  assert.deepEqual(sent, { ...O.walkedOf(t.said, w, dec.decode(CARD)), stream: false }, 'the provider is sent what the law builds');
  assert.deepEqual([sent.messages.length, sent.messages[0], sent.messages[1].role, sent.messages[2]], [3, t.said.messages[0], 'user', t.said.messages[1]], 'one message, after the system\'s, before the caller\'s own words');
  assert.ok(quoted.startsWith(`Space Router quotes a trail the caller chose to walk (x-snowtrace: ${open}, sha256 ${w.sha256}). It is its author's words, a reference`), quoted);
  assert.ok(quoted.endsWith(`\n\`\`\`\`\n${dec.decode(CARD)}\n\`\`\`\``), 'quoted whole, in a fence longer than the card\'s own');
  assert.deepEqual(t.reads, ['creators', 'drops', `vault/${TN}/2026-10-14-the-dive/card.md`], 'one vault read: its register, then the card');
  assert.equal(/the dive lands|ball-dive/.test(JSON.stringify(s.db.prepare('SELECT * FROM sr_receipts').all())), false, 'the door keeps no word of the card, only its hash');
  const plain = await s.call(key, 'fix the dive');
  assert.equal(JSON.stringify(s.up.calls.at(-1)), JSON.stringify({ model: SOL, messages: [{ role: 'user', content: 'fix the dive' }], stream: false }), 'without the header: the call as it came, byte for byte');
  assert.deepEqual(['walk' in receiptIn(plain), plain.headers.get('x-space-router-walk'), t.reads.length], [false, null, 3], 'no walk in its receipt, no vault read');
});

test('THE NAMED WALK ON THE DOOR, refused: a card the caller may not read yet, one not in the vault, a name that is not one, a card that is no text or too long; nothing is held, sent or charged; a Gold seat and the tank\'s subscription open a fresh card to their holder alone', async () => {
  const s = setup(), key = s.tank('follower'), t = trails(s), fresh = await t.card('2026-10-31-the-seal', 3_600_000), n = () => s.db.prepare('SELECT COUNT(*) AS n FROM sr_receipts').get().n;
  await t.card('2026-10-15-a-picture', 16 * DAY, Uint8Array.of(0xff, 0xd8, 0xff, 0xe0)); await t.card('2026-10-16-a-whole-trace', 16 * DAY, new Uint8Array(CARD_BYTES + 1).fill(97));
  const r = await t.walk(fresh, key);
  assert.equal(r.status, 403); assert.match((await r.json()).error.message, /^The trail kiln_traces\/2026-10-31-the-seal is not yours to walk yet: Seat holders first; free from 2026-11-15T11:01:00\.000Z\. Nothing was sent\.$/);
  for (const [trail, status] of [[`${TN}/2026-11-01-no-such-card`, 404], [`nobody_here/2026-10-31-the-seal`, 404], [TN, 400], [`${fresh}/card.md`, 400], [`../${TN}`, 400], [`${TN}/2026-10-15-a-picture`, 415], [`${TN}/2026-10-16-a-whole-trace`, 413]]) {
    const no = await t.walk(trail, key); assert.equal(no.status, status, trail); assert.deepEqual(Object.keys((await no.json()).error), ['message', 'type', 'code'], 'the door\'s own error shape');
  }
  assert.deepEqual([s.up.calls.length, n(), s.db.prepare('SELECT COUNT(*) AS n FROM sr_holds').get().n], [0, 0, 0], 'nothing was held, sent upstream or charged');
  s.db.prepare('INSERT INTO tracenet_access(id, tank, handle, usd, paid_at, until) VALUES (?, ?, ?, ?, ?, ?)').run('ab'.repeat(16), 'follower', TN, 5, s.clock.ms, s.clock.ms + 30 * DAY);   // THE FAN PAYS FROM THE TANK
  const paid = await t.walk(fresh, key);
  assert.equal(paid.status, 200); assert.equal(receiptIn(paid).walk.card, '2026-10-31-the-seal', 'its own subscription opens the fresh card');
  assert.equal((await t.walk(fresh, s.tank('stranger'))).status, 403, 'and to no other tank'); assert.equal(n(), 1);
  const pair = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']), buyer = encode58(new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))), seatText = seatSignIn({ host: 'optimism.fit', origin: SITE, address: buyer, now: s.clock.ms });
  s.db.prepare("INSERT INTO premint_orders(id, tier, buyer, recipient, creator, lamports, sol_usd, created_at, expires_at, blockhash, last_valid_block_height, terms_version, github, signature, status) VALUES ('o-gold', 'gold', ?, ?, ?, '1', '100', 1, 2, 'bh', 1, ?, '', 'sig-gold', 'paid')").run(buyer, '11111111111111111111111111111111', TN, TERMS);
  const seat = { 'x-seat': sealSeatProof(seatText, new Uint8Array(await crypto.subtle.sign('Ed25519', pair.privateKey, enc.encode(seatText)))) };
  assert.deepEqual([(await t.walk(fresh, s.tank('gold-seat'), seat)).status, n()], [200, 2], 'a Gold seat of this tracenet opens it from its publish time (GOLD_DAYS), by the seat proof it carries');
});

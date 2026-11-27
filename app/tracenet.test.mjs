// tracenet.test.mjs: THE PORTAL TO A TRACENET (tracenet.js, tracenet.html; the register and THE LAW in tracenet-register.mjs, his words in
// app/tracenet/LANDING.md and lab/PAYWALL.md). Stand-ins only: a document of plain objects, a storage, a Worker that answers from a table, keys
// made here for the wallets' seat proofs; no page, no wallet, no purchase. node --test app/tracenet.test.mjs
// THE TRAIL'S END (Nov 1 2026): tracenet.html is the trail's end (tracenet-trail.mjs). THE VOW MAKES THE PAGE (Nov 4 2026): the page before it, its backup
// and the tests of its bytes went; the last test reads the trail's end for the laws that still bind every tracenet page.
import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { RECIPIENT, TERMS, TIERS, SEAT_KEY, encode58, seatSignIn, sealSeatProof } from './dl-direct-protocol.mjs';
import { RECEIPT_KEY, MINT_DAYS } from './dl-paywall.js';
import { DAY_MS, GOLD_DAYS, BRONZE_DAYS, OPEN_DAYS, TIER_DAYS, LAW_WORDS, SCHEMA, opensAt, opensFor, openTo, openToAll, readManifest, validItem, vaultUrl, vaultPath } from './tracenet-register.mjs';
import { stateOf, handleOf, sizeText, subscription, sha256Hex } from './tracenet.js'; import { Storage, wallet as standIn } from '../worker/stand-ins.mjs';

const here = (p) => new URL(p, import.meta.url);
const ID = '0b6c2f0e-3a4d-4c1e-9f2a-6d5e4c3b2a19', ID2 = '9d1e7a55-0c3b-4f6a-8e2d-1a2b3c4d5e6f', ID3 = '5a6b7c8d-1e2f-4a3b-8c4d-5e6f7a8b9c0d';
const NOW = Date.UTC(2026, 9, 14, 22);
// three wallets, each with a key made here and its seat proof as the checkout keeps it (signed in at NOW); the Worker answers each its receipts
const wallet = async () => { const { address, sign } = await standIn(), text = seatSignIn({ host: 'optimism.fit', origin: 'https://optimism.fit', address, now: NOW });
  return { address, proof: sealSeatProof(text, await sign(new TextEncoder().encode(text))) }; };   // its key: stand-ins.mjs wallet
const W1 = await wallet(), W2 = await wallet(), W3 = await wallet();
const kept = (...ws) => Object.fromEntries(ws.map((w) => [`${SEAT_KEY}${w.address}`, w.proof]));
const receiptsOf = (w) => `/api/premint/receipts?buyer=${w.address}`;
const receipt = (id, over = {}) => ({ id, tier: 'bronze', buyer: W1.address, status: 'paid', recipient: RECIPIENT, termsVersion: TERMS, signature: 'stand-in', ...over });
const item = (over = {}) => ({ id: '2026-10-14-a-drop', title: 'A drop', kind: 'trace', file: 'a-drop.md', bytes: 12, sha256: 'a'.repeat(64), published: new Date(NOW - 3600e3).toISOString(), sanitized: { ref: `tracenet/sanitized/${'a'.repeat(48)}`, rev: 1, seat: 'stand-in', ts: 1 }, ...over });
const HIS = 'photons_enjoyor';

// THE LAW, tiered (his Oct 15 2026 00:36 WEST, in lab/PAYWALL.md): Gold from the publish time, Bronze from day 15, everyone free from day 15
test('the law, tiered and in one place: a drop is the Gold Mint\'s from its publish time, the Bronze Mint\'s and everyone\'s from day 15, to the millisecond', () => {
  assert.deepEqual([GOLD_DAYS, BRONZE_DAYS, OPEN_DAYS], [0, 15, 15]);
  assert.deepEqual(Object.keys(TIER_DAYS).sort(), Object.keys(TIERS).sort(), 'every tier the checkout sells has its days');
  assert.equal(MINT_DAYS, 7, 'the mint\'s own days are another constant (dl-paywall.js)');
  // one definition: the register module's, read by the page, the wall, the Worker, the publisher and the build
  for (const file of ['tracenet.js', 'dl-paywall.js', 'dl-twelve.js', '../worker/tracenet-vault.mjs', '../tools/tracenet-publish.mjs', '../tools/build-optimism-fit.mjs']) {
    assert.doesNotMatch(readFileSync(here(file), 'utf8'), /\b(GOLD_DAYS|BRONZE_DAYS|OPEN_DAYS|TIER_DAYS)\s*=[^=]/, `${file} defines no second law`);
  }
  assert.match(readFileSync(here('tracenet-register.mjs'), 'utf8'), /export const GOLD_DAYS = 0;\nexport const BRONZE_DAYS = 15;\nexport const OPEN_DAYS = 15;/);
  const i = item(), t0 = Date.parse(i.published), day15 = t0 + 15 * DAY_MS;
  assert.equal(opensFor(i, 'gold'), t0); assert.equal(opensFor(i, 'bronze'), day15); assert.equal(opensFor(i, null), day15); assert.equal(opensAt(i), day15);
  assert.equal(opensFor(i, 'platinum'), day15, 'a tier the law does not name waits for everyone');
  assert.equal(openTo(i, 'gold', t0 - 1), false); assert.equal(openTo(i, 'gold', t0), true, 'Gold: the publish time itself');
  assert.equal(openTo(i, 'bronze', day15 - 1), false); assert.equal(openTo(i, 'bronze', day15), true, 'Bronze: day 15, not a millisecond before');
  assert.equal(openTo(i, null, day15 - 1), false); assert.equal(openToAll(i, day15), true, 'everyone: day 15, free');
  // the page's states follow it
  assert.equal(stateOf(i, NOW, null), 'locked'); assert.equal(stateOf(i, NOW, 'gold'), 'yours'); assert.equal(stateOf(i, NOW, 'bronze'), 'waiting');
  assert.equal(stateOf(i, day15 - 1, 'bronze'), 'waiting'); assert.equal(stateOf(i, day15, 'bronze'), 'open'); assert.equal(stateOf(i, day15, null), 'open');
  assert.equal(stateOf(item({ published: 'never' }), NOW, null), 'locked'); assert.equal(stateOf(item({ published: 'never' }), NOW, 'gold'), 'waiting', 'no date: never opens');
});

test('the handle comes from the address alone, in the register\'s form', () => {
  assert.equal(handleOf(`?of=${HIS}`), HIS); assert.equal(handleOf('?of=Some_One9'), 'Some_One9');
  for (const bad of ['', '?of=', '?of=@photons_enjoyor', '?of=../x', '?of=a b', `?of=${'a'.repeat(33)}`, '?x=1']) assert.equal(handleOf(bad), null, bad);
});

test('the register as read: this handle\'s only, whole drops only, newest first, words trimmed, links https only', () => {
  const data = { schema: SCHEMA, handle: HIS, name: '  Who  ', line: ' one line ', x: `https://x.com/${HIS}`, avatar: 'http://not-https/x.png',
    items: [item({ id: 'older', published: new Date(NOW - 3 * DAY_MS).toISOString() }), { id: 'broken' }, item({ id: 'newer', published: new Date(NOW - DAY_MS).toISOString() }), item({ id: 'bad-sha', sha256: 'xyz' }), item({ id: 'no-title', title: ' ' })] };
  const m = readManifest(data, HIS);
  assert.deepEqual(m.items.map((i) => i.id), ['newer', 'older']);
  assert.equal(m.name, 'Who'); assert.equal(m.line, 'one line'); assert.equal(m.x, `https://x.com/${HIS}`); assert.equal(m.avatar, null);
  assert.equal(readManifest({ ...data, name: '' }, HIS).name, HIS);
  for (const wrong of [{ ...data, handle: 'other' }, { ...data, schema: 'x' }, { ...data, items: {} }, null, 'text', 42]) assert.equal(readManifest(wrong, HIS), null);
  assert.equal(readManifest(data, '../x'), null);
  assert.equal(validItem(item()), true);
  for (const change of [{ id: 'Upper' }, { id: '-lead' }, { file: 'a/b' }, { file: 'dot.' }, { file: '' }, { kind: 'Trace' }, { bytes: -1 }, { bytes: 1.5 }, { title: 'x'.repeat(141) }, { published: 'soon' },
    { sanitized: undefined }, { sanitized: null }, { sanitized: { ref: 'tracenet/sanitized/' + 'b'.repeat(48), rev: 1, seat: 's', ts: 1 } }, { sanitized: { ref: `tracenet/sanitized/${'a'.repeat(48)}`, rev: -1, seat: 's', ts: 1 } }, { sanitized: { ref: `tracenet/sanitized/${'a'.repeat(48)}`, rev: 1, seat: '', ts: 1 } }, { sanitized: { ref: `tracenet/sanitized/${'a'.repeat(48)}`, rev: 1, seat: 's', ts: 0 } }]) assert.equal(validItem(item(change)), false, JSON.stringify(change));
  assert.equal(vaultUrl(HIS, item()), `/vault/${HIS}/2026-10-14-a-drop/a-drop.md`);
  assert.deepEqual(vaultPath(vaultUrl(HIS, item())), { handle: HIS, id: '2026-10-14-a-drop', file: 'a-drop.md' });
});

test('the seat this browser carries: among the wallets that signed in here, the paid receipt whose tier opens a drop soonest, each wallet asked once with its proof; an order id, or a Worker that does not answer, is no seat', async () => {
  const asked = [], seats = [];
  // W1 has only a submitted order, W2 a Bronze Mint receipt, W3 a Gold Mint and a Bronze Mint one
  const table = { [W1.address]: [receipt(ID, { status: 'submitted' })], [W2.address]: [receipt(ID2, { buyer: W2.address })],
    [W3.address]: [receipt(ID, { buyer: W3.address }), receipt(ID3, { buyer: W3.address, tier: 'gold' })] };
  const fetcher = async (url, init = {}) => { asked.push(url); seats.push(init.headers?.['x-seat']); const orders = table[new URL(url, 'https://optimism.fit').searchParams.get('buyer')]; return { ok: Boolean(orders), json: async () => ({ orders }) }; };
  const storage = new Storage({ ...kept(W1, W2), other: 'x' });
  assert.deepEqual(await subscription({ fetcher, storage, now: NOW }), { buyer: W2.address, tier: 'bronze', proof: W2.proof });
  assert.deepEqual(asked, [receiptsOf(W1), receiptsOf(W2)]); assert.deepEqual(seats, [W1.proof, W2.proof], 'each wallet\'s own proof in x-seat');
  asked.length = 0;
  assert.deepEqual(await subscription({ fetcher, storage: new Storage(kept(W3, W2, W1)), now: NOW }), { buyer: W3.address, tier: 'gold', proof: W3.proof }, 'the Gold Mint seat over the Bronze');
  assert.deepEqual(asked, [receiptsOf(W3)], 'a Gold Mint receipt ends the asking');
  // the checkout's saved order ids, a bare id where a proof goes, an expired proof: nothing asked, no seat
  asked.length = 0;
  assert.equal(await subscription({ fetcher, storage: new Storage({ [`${RECEIPT_KEY}${W3.address}:gold`]: ID3, [`${SEAT_KEY}${W2.address}`]: ID2 }), now: NOW }), null);
  assert.equal(await subscription({ fetcher, storage: new Storage(kept(W3)), now: NOW + 30 * DAY_MS }), null, 'expired');
  assert.deepEqual(asked, []);
  assert.equal(await subscription({ fetcher, storage: new Storage(), now: NOW }), null);
  assert.equal(await subscription({ fetcher: async () => { throw new Error('down'); }, storage, now: NOW }), null);
  assert.equal(await subscription({ fetcher: async () => ({ ok: true, json: async () => ({ orders: [receipt(ID, { buyer: W2.address, recipient: 'x' })] }) }), storage: new Storage(kept(W2)), now: NOW }), null);
  assert.equal(await subscription({ fetcher: async () => ({ ok: true, json: async () => ({ orders: [receipt(ID3, { tier: 'gold' })] }) }), storage: new Storage(kept(W2)), now: NOW }), null, 'another wallet\'s receipt');
  assert.equal(await subscription({ storage: null }), null);
  assert.equal(sizeText(999), '999 B'); assert.equal(sizeText(2048), '2.0 KB'); assert.equal(sizeText(3 * 1048576), '3.0 MB');
  assert.equal(await sha256Hex(new TextEncoder().encode('')), 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');
});

// THE TRAIL'S END: the page as it is (tracenet-trail.mjs mounts it; its face, its one trace and its keyboard are tracenet-trail.test.mjs's). What of the
// old page's law still binds it is asserted here; what tested the old bytes went with the backup (THE VOW MAKES THE PAGE).
test('the trail\'s end page keeps the laws: no second law of days, no NFT words, no Society tier handler on a creator plan, the holder\'s road, one module and no other script, its sheets present, nothing perpetual at rest', () => {
  const html = readFileSync(here('tracenet.html'), 'utf8');
  assert.doesNotMatch(html, /data-days|EXCLUSIVE_DAYS|subscribers' for/, 'the old 7-day law stays gone');
  assert.doesNotMatch(html, /Save NFT metadata|NFT issued/);
  assert.doesNotMatch(html, /data-mint-tier=/, 'no Society tier handler is reached from this page');
  assert.match(html, /<button[^>]*id="tn-holder"[^>]*data-mint-holder[^>]*>[^<]*<\/button>/, 'the holder\'s road stays');
  assert.match(html, /Restore Society access/);
  const sheets = [...html.matchAll(/<link rel="stylesheet" href="([^"?#]+\.css)(\?v=[^"]+)?"/g)];
  assert.ok(sheets.length >= 2, `the page links ${sheets.length} sheets`);
  for (const [, href] of sheets) assert.ok(existsSync(new URL(href, here('tracenet.html'))), `${href} exists where the page asks for it`);
  assert.match(html, /href="\.\/tracenet-trail\.css\?v=/, 'its own sheet is versioned');
  assert.match(html, /import \{ mountTrail \} from '\.\/tracenet-trail\.mjs\?v=[^']+'; mountTrail\(\);/);
  assert.equal((html.match(/<script\b/g) || []).length, 1, 'one module, no other script');
  assert.doesNotMatch(html, /<script src=/);
  assert.doesNotMatch(readFileSync(here('tracenet-trail.css'), 'utf8'), /animation[^;]*\binfinite\b/, 'no perpetual CSS animation at rest');
});

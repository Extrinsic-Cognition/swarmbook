// app/tracenet-drop-line.test.mjs: THE DROP IS SIGNED BY ITS CREATOR (Oct 25 2026, lane/the-drop-is-signed; app/tracenet-drop-line.mjs). The line a creator's
// wallet signs (its text pinned word for word: a new text is a new schema), its hash, the head of a register, the signature's check, and what a reader may draw:
// a drop proven by the Nest's receipt (the house's own registers) or by its creator's signature, a forged or unproven line never, and a link that skips a line
// said, not hidden. node --test app/tracenet-drop-line.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { encode58 } from './dl-direct-protocol.mjs';
import { NO_PREV, SANITIZED_REF, readManifest, validItem } from './tracenet-register.mjs';
import { DROP_SCHEMA, DROP_STATEMENT, dropId, dropLineText, lineHash, lineOf, lastSigned, headOf, verifyDropLine, proveItems } from './tracenet-drop-line.mjs'; import { wallet } from '../worker/stand-ins.mjs';

const ALICE = await wallet(), BOB = await wallet();
const sha = (s) => createHash('sha256').update(s).digest('hex');
const sign = async (w, text) => encode58(new Uint8Array(await crypto.subtle.sign('Ed25519', w.pair.privateKey, new TextEncoder().encode(text))));
const register = (items, w = ALICE) => ({ handle: 'alice', wallet: w.address, items });
/** a signed item of alice's, its line linked to `prev` */
async function signed(title, published, prev, w = ALICE) {
  const item = { id: dropId(published, title), title, kind: 'trace', file: 'x.md', bytes: 3, sha256: sha(title), published, prev };
  return { ...item, sig: await sign(w, lineOf(register([]), item)) };
}

test('the line a wallet signs: word for word, the title JSON-quoted, its hash the sha256 of the text; dropId as the publisher names a drop', async () => {
  const text = dropLineText({ handle: 'alice', wallet: 'W', id: '2027-01-15-a-trace', title: 'A "trace"\nwith a break', kind: 'trace', file: 'trace.md', bytes: 17, sha256: 'a'.repeat(64), published: '2027-01-15T08:00:00.000Z' });
  assert.equal(text, `A tracenet drop, signed by its creator:\nW\n\n${DROP_STATEMENT}\n\nHandle: alice\nId: 2027-01-15-a-trace\nTitle: "A \\"trace\\"\\nwith a break"\nKind: trace\nFile: trace.md\n` +
    `Bytes: 17\nSHA-256: ${'a'.repeat(64)}\nPublished: 2027-01-15T08:00:00.000Z\nPrevious: none\nSchema: ${DROP_SCHEMA}`);
  assert.equal(text.split('\n').length, 15, 'no field carries a line break of its own');
  assert.equal(await lineHash(text), sha(text));
  assert.equal(dropId('2026-11-03T10:00:00.000Z', 'The subscribe portal: how a drop is gated!'), '2026-11-03-the-subscribe-portal-how-a-drop-is-gated');
  assert.equal(dropId('2026-11-03T10:00:00.000Z', '!!!'), '2026-11-03-drop');
});

test('the signature: the register\'s wallet over the item\'s own line, and nothing else verifies', async () => {
  const one = await signed('A trace', '2027-01-15T08:00:00.000Z', NO_PREV);
  assert.equal(await verifyDropLine(register([one]), one), true);
  assert.equal(await verifyDropLine(register([one], BOB), one), false, 'another wallet\'s tracenet');
  for (const over of [{ title: 'B trace' }, { bytes: 4 }, { published: '2027-01-15T08:00:01.000Z' }, { prev: 'c'.repeat(64) }, { sha256: 'd'.repeat(64) }, { kind: 'patch' }, { file: 'y.md' }])
    assert.equal(await verifyDropLine(register([]), { ...one, ...over }), false, `a word changed: ${Object.keys(over)}`);
  assert.equal(await verifyDropLine(register([]), { ...one, sig: await sign(BOB, lineOf(register([]), one)) }), false, 'signed by another key');
  assert.equal(await verifyDropLine(register([]), { ...one, sig: 'not-base58!' }), false);
  assert.equal(await verifyDropLine(register([]), { ...one, sig: undefined }), false);
  assert.equal(await verifyDropLine({ handle: 'alice', items: [] }, one), false, 'a register that names no wallet');
});

test('the register keeps a signed item whole or not at all; the head is the newest line that verifies', async () => {
  const one = await signed('A trace', '2027-01-15T08:00:00.000Z', NO_PREV);
  assert.equal(validItem(one, { receipt: false }), true);
  assert.equal(validItem({ ...one, sig: 'short' }, { receipt: false }), false);
  assert.equal(validItem({ ...one, prev: 'x' }, { receipt: false }), false);
  assert.equal(validItem({ ...one, sig: undefined, prev: undefined }, { receipt: false }), true, 'a line from before the law is a whole line, proven or not');
  const two = await signed('B trace', '2027-01-15T09:00:00.000Z', await lineHash(lineOf(register([]), one)));
  const forged = { ...(await signed('C trace', '2027-01-15T10:00:00.000Z', await lineHash(lineOf(register([]), two)))), title: 'C changed' };
  assert.equal(await headOf(register([])), NO_PREV);
  assert.equal(await headOf(register([one])), await lineHash(lineOf(register([]), one)));
  assert.equal(await headOf(register([forged, two, one])), await lineHash(lineOf(register([]), two)), 'a row that only looks signed is skipped');
  assert.equal((await lastSigned(register([forged, two, one]))).title, 'B trace');
  const m = readManifest({ schema: 'optimism.tracenet/1', handle: 'alice', wallet: ALICE.address, items: [one, two] }, 'alice', { receipt: false });
  assert.deepEqual(m.items.map((i) => [i.title, i.sig, i.prev]), [['B trace', two.sig, two.prev], ['A trace', one.sig, NO_PREV]], 'the register carries sig and prev through, newest first');
});

test('what a reader draws: proven by the Nest\'s receipt or by its creator\'s signature; a forged or unproven line never; a link that skips a line is said', async () => {
  const one = await signed('A trace', '2027-01-15T08:00:00.000Z', NO_PREV);
  const two = await signed('B trace', '2027-01-15T09:00:00.000Z', await lineHash(lineOf(register([]), one)));
  const three = await signed('C trace', '2027-01-15T10:00:00.000Z', await lineHash(lineOf(register([]), two)));
  const sealed = { id: '2027-01-14-his', title: 'His', file: 'his.md', bytes: 3, sha256: sha('his'), published: '2027-01-14T08:00:00.000Z',
    sanitized: { ref: SANITIZED_REF(sha('his')), rev: 4, seat: 'claude-x', ts: 1 } };
  const unproven = { id: '2027-01-14-old', title: 'Old', file: 'old.md', bytes: 3, sha256: sha('old'), published: '2027-01-14T09:00:00.000Z' };
  const forged = { ...three, id: '2027-01-15-forged', title: 'Forged' };
  let shown = await proveItems(register([three, forged, two, one, unproven, sealed]));
  assert.deepEqual(shown.items.map((i) => [i.title, i.proof, i.linked]), [['C trace', 'signed', true], ['B trace', 'signed', true], ['A trace', 'signed', true], ['His', 'nest', undefined]]);
  shown = await proveItems(register([three, one]));   // the second line taken out of the register: the third still stands, its link says a line is missing
  assert.deepEqual(shown.items.map((i) => [i.title, i.linked]), [['C trace', false], ['A trace', true]]);
  assert.equal(await proveItems(null), null);
  const his = await proveItems(readManifest({ schema: 'optimism.tracenet/1', handle: 'photons_enjoyor', items: [sealed] }, 'photons_enjoyor', { receipt: false }));
  assert.deepEqual(his.items.map((i) => i.proof), ['nest'], 'the first tracenet\'s drops stand on the Nest\'s receipt, as before');
});

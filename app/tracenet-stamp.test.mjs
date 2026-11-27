// app/tracenet-stamp.test.mjs: THE STAMP IS THE COSIGN (Oct 29 2026, lane/the-stamp-is-the-cosign; app/tracenet-stamp.mjs). The words both wallets sign
// (pinned word for word: a new text is a new schema), each field's law, the stamper's signature and the creator's countersign, and the count a reader
// makes: cosigned stamps only, one a stamper, on this pointer by this creator. node --test app/tracenet-stamp.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { encode58 } from './dl-direct-protocol.mjs';
import { STAMP_SCHEMA, STAMP_STATEMENT, STAMP_DOORS, STAMP_PREFIX, stampText, stampOf, stampId, proveStamp, stampKey, proveStamps, cosignsOn } from './tracenet-stamp.mjs'; import { wallet } from '../worker/stand-ins.mjs';

const ALICE = await wallet(), BOB = await wallet(), CAROL = await wallet();
const sha = (s) => createHash('sha256').update(s).digest('hex');
const sign = async (w, text) => encode58(new Uint8Array(await crypto.subtle.sign('Ed25519', w.pair.privateKey, new TextEncoder().encode(text))));
const DROP = sha('a trace'), AT = '2027-01-15T08:00:00.000Z';
/** a stamp of `stamper`'s on alice's drop, signed by `signer` (the stamper), countersigned by `cosigner` when one is named */
async function stamped({ stamper = BOB, by = ALICE, on = DROP, door = 'MOD', at = AT, signer = stamper, cosigner = null } = {}) {
  const s = { stamper: stamper.address, by: by.address, on, door, at }, text = stampText(s);
  return { ...s, sig: await sign(signer, text), ...(cosigner ? { cosig: await sign(cosigner, text) } : {}) };
}

test('the words both wallets sign: word for word, one field a line; its id the sha256 of the words', async () => {
  const text = stampText({ stamper: 'S', by: 'C', on: 'a'.repeat(64), door: 'MOD', at: AT });
  assert.equal(text, `A tracenet stamp, countersigned by the drop's creator:\nS\n\n${STAMP_STATEMENT}\n\nStamper: S\nCreator: C\nDrop: ${'a'.repeat(64)}\nDoor: MOD\n` +
    `Followed: ${AT}\nSchema: ${STAMP_SCHEMA}`);
  assert.equal(text.split('\n').length, 11, 'no field carries a line break of its own');
  assert.equal(await stampId({ stamper: 'S', by: 'C', on: 'a'.repeat(64), door: 'MOD', at: AT }), sha(text));
  assert.equal(STAMP_SCHEMA, 'optimism.tracenet/stamp/1'); assert.equal(STAMP_PREFIX, 'stamps/');
  assert.equal(`${STAMP_PREFIX}${sha(text)}`.length <= 80, true, 'its entry\'s name fits a Nest ref (80 at most)');
});

test('each field by its own law: two wallets never the same one, a sha256, one of the five doors, an instant as toISOString writes it; nothing else kept', () => {
  const good = { stamper: BOB.address, by: ALICE.address, on: DROP, door: 'GAMEPAD', at: AT };
  assert.deepEqual(stampOf({ ...good, title: 'words', sig: 'x' }), good, 'only the five fields');
  assert.deepEqual(STAMP_DOORS, ['GAMEPAD', 'ASSETS', 'API', 'MEMORY', 'MOD']);
  for (const door of STAMP_DOORS) assert.ok(stampOf({ ...good, door }));
  for (const [what, over] of [['nobody stamps their own drop', { stamper: ALICE.address }], ['a stamper that is no wallet', { stamper: 'not a wallet' }], ['a creator that is no wallet', { by: '' }],
    ['a pointer that is no sha256', { on: 'A'.repeat(64) }], ['a short pointer', { on: 'a'.repeat(63) }], ['a door of none of the five', { door: 'mod' }], ['a door with words', { door: 'MOD\nTitle: x' }],
    ['a day, not an instant', { at: '2027-01-15' }], ['an instant not as toISOString writes it', { at: '2027-01-15T08:00:00Z' }], ['no instant', { at: undefined }]])
    assert.equal(stampOf({ ...good, ...over }), null, what);
  assert.equal(stampOf(null), null); assert.equal(stampOf('MOD'), null);
});

test('the signatures: the stamper\'s over the words makes a half; the creator\'s over the same words makes the cosign; nothing else verifies', async () => {
  const half = await stamped(), full = await stamped({ cosigner: ALICE });
  assert.deepEqual(await proveStamp(half), { id: sha(stampText(half)), cosigned: false });
  assert.deepEqual(await proveStamp(full), { id: sha(stampText(full)), cosigned: true });
  assert.equal(await proveStamp(await stamped({ signer: CAROL })), null, 'the stamper\'s half signed by another key');
  assert.equal(await proveStamp({ ...half, door: 'API' }), null, 'a word changed after the signature');
  assert.equal(await proveStamp({ ...half, sig: 'not-base58!' }), null);
  assert.equal(await proveStamp({ ...half, sig: undefined }), null, 'no signature, no stamp');
  assert.equal((await proveStamp(await stamped({ cosigner: BOB }))).cosigned, false, 'the stamper countersigning its own stamp is no cosign');
  assert.equal((await proveStamp(await stamped({ cosigner: CAROL }))).cosigned, false, 'a third wallet\'s countersign is no cosign');
  assert.equal((await proveStamp({ ...full, cosig: half.sig })).cosigned, false, 'the stamper\'s signature in the countersign\'s place');
  assert.equal((await proveStamp({ ...full, cosig: 'nope' })).cosigned, false);
  assert.equal(await proveStamp({ ...full, stamper: ALICE.address }), null, 'nobody stamps their own drop');
});

test('the count: cosigned stamps only, one a stamper, on this pointer by this creator; each proven once and again only when a signature changes', async () => {
  const other = sha('another trace');
  const list = [await stamped({ cosigner: ALICE }), await stamped({ door: 'API', cosigner: ALICE }), await stamped({ stamper: CAROL, cosigner: ALICE }),
    await stamped({ stamper: CAROL, on: other, cosigner: ALICE }), await stamped({ stamper: CAROL, by: BOB, cosigner: BOB })];
  const halfOnly = await stamped({ stamper: CAROL, door: 'ASSETS' }), forged = { ...(await stamped({ stamper: CAROL, door: 'MEMORY' })), cosig: (await stamped({ stamper: CAROL, door: 'MEMORY', cosigner: CAROL })).cosig };
  const proven = new Map();
  assert.equal(cosignsOn(list, { on: DROP, by: ALICE.address }, proven), 0, 'nothing proven yet: nothing counted');
  assert.equal(await proveStamps([...list, halfOnly, forged, null, 'x'], proven), 7, 'each stamp proven once');
  assert.equal(await proveStamps([...list, halfOnly, forged], proven), 0, 'and never again');
  assert.equal(cosignsOn([...list, halfOnly, forged], { on: DROP, by: ALICE.address }, proven), 2, 'bob once (two doors) and carol; carol\'s half and her forged countersign add nobody');
  assert.equal(cosignsOn(list, { on: other, by: ALICE.address }, proven), 1);
  assert.equal(cosignsOn(list, { on: DROP, by: CAROL.address }, proven), 0, 'nobody\'s stamps on this pointer are by carol');
  assert.equal(cosignsOn(list, { on: DROP }, proven), null, 'a pointer whose creator\'s wallet is not named: no count');
  assert.equal(cosignsOn(list, { by: ALICE.address }, proven), null, 'no pointer: no count');
  const completed = { ...halfOnly, cosig: (await stamped({ stamper: CAROL, door: 'ASSETS', cosigner: ALICE })).cosig };
  assert.notEqual(stampKey(completed), stampKey(halfOnly));
  assert.equal(await proveStamps([completed], proven), 1, 'a countersign that came is proven');
  assert.equal(cosignsOn([...list, completed], { on: DROP, by: ALICE.address }, proven), 2, 'carol still counts once');
});

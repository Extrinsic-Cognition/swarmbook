// tracenet-publish.test.mjs: the publisher (tracenet-publish.mjs): one file becomes one drop with its hash and its time, in a folder of its own.
// node --test tools/tracenet-publish.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { publish, slugOf, receiptFromNest } from './tracenet-publish.mjs';
import { readManifest, opensAt, opensFor, validReceipt, DAY_MS, OPEN_DAYS, SANITIZED_REF } from '../app/tracenet-register.mjs';

// a Nest that has sanitized every file (a stand-in receipt), and one that has sanitized none
const nestYes = async (sha) => ({ ref: SANITIZED_REF(sha), rev: 3, seat: 'stand-in-pass', ts: 1792014665751 });
const nestNo = async () => null;

const NOW = Date.UTC(2026, 9, 14, 22, 30);
test('a file becomes a drop: copied under the vault, hashed, timed, first in the register, with the Nest\'s receipt; the register starts with a name and keeps it', async () => {
  const root = mkdtempSync(join(tmpdir(), 'tracenet-publish-')), src = join(root, 'src'); mkdirSync(src);
  try {
    writeFileSync(join(src, 'walk.md'), '# a walk\n');
    await assert.rejects(publish({ root, handle: 'who', file: join(src, 'walk.md'), title: 'A walk', now: NOW, receipt: nestYes }), /--name/);
    const first = await publish({ root, handle: 'who', file: join(src, 'walk.md'), title: 'A walk, the first', name: 'Who', line: 'traces', x: 'https://x.com/who', now: NOW, receipt: nestYes });
    const sha = createHash('sha256').update('# a walk\n').digest('hex');
    assert.deepEqual(first, { id: '2026-10-14-a-walk-the-first', title: 'A walk, the first', kind: 'trace', file: 'walk.md', bytes: 9, sha256: sha, published: new Date(NOW).toISOString(), sanitized: { ref: SANITIZED_REF(sha), rev: 3, seat: 'stand-in-pass', ts: 1792014665751 } });
    assert.equal(validReceipt(first), true);
    assert.equal(readFileSync(join(root, 'vault', 'who', first.id, 'walk.md'), 'utf8'), '# a walk\n');
    const register = JSON.parse(readFileSync(join(root, 'app', 'tracenet', 'who.json'), 'utf8'));
    assert.equal(register.name, 'Who'); assert.equal(register.line, 'traces'); assert.equal(register.x, 'https://x.com/who');
    assert.deepEqual(readManifest(register, 'who').items, [first]);
    assert.equal(opensFor(first, 'gold'), NOW, 'the Gold Mint\'s from its publish time');
    assert.equal(opensAt(first), NOW + OPEN_DAYS * DAY_MS, 'everyone\'s, and the Bronze Mint\'s, 15 days on');
    assert.equal(opensFor(first, 'bronze'), NOW + 15 * DAY_MS);
    writeFileSync(join(src, 'bench.txt'), 'numbers');
    const second = await publish({ root, handle: 'who', file: join(src, 'bench.txt'), title: 'A bench', kind: 'bench', now: NOW + 3600e3, receipt: nestYes });
    const again = JSON.parse(readFileSync(join(root, 'app', 'tracenet', 'who.json'), 'utf8'));
    assert.equal(again.name, 'Who', 'the name stays without --name');
    assert.deepEqual(again.items.map((i) => i.id), [second.id, first.id], 'newest first');
    await assert.rejects(publish({ root, handle: 'who', file: join(src, 'walk.md'), title: 'A walk, the first', now: NOW, receipt: nestYes }), /already has a drop/);
    assert.ok(!existsSync(join(root, 'vault', 'who', first.id, 'other')));
  } finally { rmSync(root, { recursive: true, force: true }); }
});
test('nothing is written for a file the Nest has not sanitized, nor for a handle, title, kind, file or time that is not whole', async () => {
  const root = mkdtempSync(join(tmpdir(), 'tracenet-publish-')), src = join(root, 'src'); mkdirSync(src);
  try {
    writeFileSync(join(src, 'ok.md'), 'x'); writeFileSync(join(src, 'bad name.md'), 'x');
    // THE GATE: the Nest holds no receipt for these bytes
    await assert.rejects(publish({ root, handle: 'who', file: join(src, 'ok.md'), title: 'ok', name: 'Who', now: NOW, receipt: nestNo }), /not sanitized in the Nest: it holds no tracenet\/sanitized\/[0-9a-f]{48} for ok\.md/);
    await assert.rejects(publish({ root, handle: 'who', file: join(src, 'ok.md'), title: 'ok', name: 'Who', now: NOW, receipt: async (sha) => ({ ref: SANITIZED_REF('0'.repeat(64)), rev: 1, seat: 's', ts: 1 }) }), /not whole/);
    await assert.rejects(publish({ root, handle: 'who', file: join(src, 'ok.md'), title: 'ok', name: 'Who', now: NOW, receipt: async () => { throw new Error('the Nest answered 503'); } }), /503/);
    assert.ok(!existsSync(join(root, 'app')) && !existsSync(join(root, 'vault')), 'nothing written without the receipt');
    for (const args of [{ handle: '@who' }, { handle: 'a'.repeat(33) }, { title: '' }, { title: 'x'.repeat(141) }, { kind: 'Trace' }, { file: join(src, 'missing.md') }, { file: join(src, 'bad name.md') }, { file: src }, { now: NaN }]) {
      await assert.rejects(publish({ root, handle: 'who', file: join(src, 'ok.md'), title: 'ok', name: 'Who', now: NOW, receipt: nestYes, ...args }), JSON.stringify(args));
    }
    assert.ok(!existsSync(join(root, 'app')) && !existsSync(join(root, 'vault')), 'nothing written');
    assert.equal(slugOf('The subscribe portal: how a drop is gated (a design trace)'), 'the-subscribe-portal-how-a-drop-is-gated-a-design-trace');
    assert.equal(slugOf('!!!'), 'drop');
    assert.equal(slugOf('Ünïcode  dashes --- here'), 'unicode-dashes-here');
    // the Nest's answers, as receiptFromNest reads them: 404 is no receipt, a ref is one, anything else is a refusal
    const sha = 'a'.repeat(64);
    assert.equal(await receiptFromNest(sha, { fetcher: async () => ({ status: 404, ok: false }) }), null);
    assert.deepEqual(await receiptFromNest(sha, { fetcher: async (url) => { assert.equal(url, `http://127.0.0.1:8904/nest/ref/${SANITIZED_REF(sha)}`); return { status: 200, ok: true, json: async () => ({ name: SANITIZED_REF(sha), ref: { rev: 7, seat: 'the-pass', ts: 5, seq: 1, value: {} } }) }; } }), { ref: SANITIZED_REF(sha), rev: 7, seat: 'the-pass', ts: 5 });
    await assert.rejects(receiptFromNest(sha, { fetcher: async () => ({ status: 503, ok: false }) }), /503/);
    assert.equal(await receiptFromNest(sha, { fetcher: async () => ({ status: 200, ok: true, json: async () => ({ name: SANITIZED_REF(sha), ref: { rev: 7, seat: 'the-pass', ts: 5, value: { sha256: 'b'.repeat(64) } } }) }) }), null, 'a receipt whose value names other bytes is no receipt');
    assert.ok(SANITIZED_REF(sha).length <= 80, "the ref fits the Nest's door");
  } finally { rmSync(root, { recursive: true, force: true }); }
});

// storyboard-canvas.test.mjs · FRAMES ONTO HIS CANVAS, THE CANVAS IS ONE LOG (Nov 1 2026): the storyboard tool against a throwaway Nest (this tree's nest.mjs on
// a loopback port): --dry checks every op as the Nest's door would and writes nothing; the run PUTs each frame once by its hash and lays the plan through
// canvas-say's draw, one canvas.op an item of the mouth's ids (the frames images by their blobs, the row's title a title, the captions texts, the note a
// sticky); the same plan again is refused before anything is written; --seed is gone; nothing on the old road. The frames are a plate of the house (invented).
//   nice -n 19 node --test embertide-app/ui/intro/dyson-society/tools/storyboard-canvas.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { itemsOf, imageSize } from './storyboard-canvas.mjs';
import { startScratchNest } from '../vendor/tools/embertide-mesh/tests/scratch-canvas-nest.mjs';
import { itemsOf as foldItems, CANVAS_OP } from '../vendor/tools/embertide-mesh/lib/canvas-fold.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url)), TOOL = path.join(HERE, 'storyboard-canvas.mjs');
const PNG = path.resolve(HERE, '../../plates/sample/two-clocks-one-stone.png');
const PAGE = 'page-5b0a4d00-5b0a-4d00-8000-0000005b0a4d', DOC = `harmony-golem-${PAGE}`;
const run = (args, env = {}) => new Promise((resolve) => {
  const p = spawn(process.execPath, [TOOL, ...args], { env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
  let out = '', err = ''; p.stdout.on('data', (d) => { out += d; }); p.stderr.on('data', (d) => { err += d; });
  const t = setTimeout(() => p.kill('SIGKILL'), 60_000); p.on('close', (code) => { clearTimeout(t); resolve({ code, out, err }); });
});

test('the plan as items: a frame an image by its blob, its time and caption under it, the row\'s title over it', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'storyboard-plan-'));
  try {
    fs.copyFileSync(PNG, path.join(dir, 'a.png'));
    const { items, blobs } = itemsOf({ rows: [{ id: 'r', title: 'A ROW', y: 100, frames: [{ file: 'a.png', time: '0.0 s', caption: 'the first' }] }] }, dir);
    assert.deepEqual(items.map((it) => [it.id, it.kind]), [['r-title', 'text'], ['r-0', 'image'], ['r-0-t', 'text'], ['r-0-c', 'text']]);
    assert.equal(blobs.size, 1); assert.equal(items[1].blobId, createHash('sha256').update(fs.readFileSync(PNG)).digest('hex'));
    assert.equal(imageSize(fs.readFileSync(PNG)).width, 480);
  } finally { fs.rmSync(dir, { recursive: true, force: true }); }
});

test('the tool on a throwaway Nest: --dry writes nothing; the run lays the plan as canvas.op lines of the mouth\'s ids and each frame once by its hash; again is refused; --seed is gone', async () => {
  const N = await startScratchNest(), dir = fs.mkdtempSync(path.join(os.tmpdir(), 'storyboard-run-'));
  try {
    fs.copyFileSync(PNG, path.join(dir, 'a.png')); fs.copyFileSync(PNG, path.join(dir, 'b.png'));
    const plan = path.join(dir, 'plan.json');
    fs.writeFileSync(plan, JSON.stringify({ rows: [{ id: 'row1', title: 'THE FIRST FRAMES', y: 100, w: 240, frames: [{ file: 'a.png', time: '0.0 s', caption: 'one' }, { file: 'b.png', caption: 'two' }] }],
      texts: [{ id: 'head', text: 'A STORYBOARD', xywh: [0, 0, 900, 48], fontSize: 36, fontWeight: 700 }], notes: [{ id: 'note', text: 'draw on any frame', xywh: [600, 0, 300, 120] }] }));
    const dry = await run([plan, '--page', PAGE, '--dry', '--nest', N.url]);
    assert.equal(dry.code, 0, dry.err); assert.match(dry.out, /^8 items pass the Nest's check as 8 ops/);
    assert.equal((await N.entries(CANVAS_OP)).length, 0, 'the rehearsal writes nothing');
    const no = await run([plan, '--page', PAGE, '--nest', N.url]); assert.equal(no.code, 1); assert.match(no.err, /born by his word alone/, 'a new page without his word: refused'); const r = await run([plan, '--page', PAGE, '--nest', N.url, '--his-word', 'a storyboard page, the test asks for it']);
    assert.equal(r.code, 0, r.err + r.out);
    const doc = (await N.canvas(DOC)).doc, items = foldItems(doc, 'one'), by = Object.fromEntries(items.map((it) => [it.id, it]));
    assert.deepEqual(items.map((it) => it.id), ['harmony-claude:row1-title', 'harmony-claude:row1-0', 'harmony-claude:row1-0-t', 'harmony-claude:row1-0-c', 'harmony-claude:row1-1', 'harmony-claude:row1-1-c', 'harmony-claude:head', 'harmony-claude:note'], 'in the plan\'s order, the mouth\'s ids');
    const hash = createHash('sha256').update(fs.readFileSync(PNG)).digest('hex');
    assert.deepEqual([by['harmony-claude:row1-0'].kind, by['harmony-claude:row1-0'].content.blob, by['harmony-claude:row1-0'].content.w], ['image', hash, 24000], 'a frame: its blob by its hash, 240 wide');
    assert.ok((await fetch(`${N.url}/nest/blob/${hash}`)).ok, 'the frame\'s bytes on the Nest');
    assert.deepEqual([by['harmony-claude:row1-title'].content.role, by['harmony-claude:head'].content.role, by['harmony-claude:row1-0-c'].content.role, by['harmony-claude:note'].content.role], ['title', 'title', 'text', 'sticky']);
    assert.ok((await N.ref('harmony/canvas-library')).value.document.pages.some((p) => p.id === PAGE && p.name === 'Storyboard'), 'the page listed under its name');
    const again = await run([plan, '--page', PAGE, '--nest', N.url]);
    assert.equal(again.code, 1); assert.match(again.err, /is on the page already/); assert.equal(foldItems((await N.canvas(DOC)).doc, 'one').length, 8, 'nothing more written');
    const seed = await run(['--seed', '--page', PAGE, '--nest', N.url]); assert.equal(seed.code, 1); assert.match(seed.err, /--seed is gone/);
    assert.deepEqual(await N.docRefs(), [], 'no snapshot ref'); assert.equal((await N.entries('harmony.canvas.op')).length, 0, 'no old op');
  } finally { await N.stop(); fs.rmSync(dir, { recursive: true, force: true }); }
});

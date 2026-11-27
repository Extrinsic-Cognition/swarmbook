#!/usr/bin/env node
// storyboard-canvas.mjs: FRAMES ONTO HIS CANVAS, as a storyboard. His words, Oct 14 2026 16:1x WEST: "dude omg why the fuck it loads so slow dude???
// can you fucking open up a canvas storyboard of the first few frames please??"; then, over the hero at 32.6 s: "can you show me the frames where this
// is happening please?? i need to teach you some spatial computing shit".
// A plan (JSON) names rows of frames. Each frame is PUT on the Nest as a blob named by its sha256 (the canvas's own rule: an image carries its blob's
// sha256, never bytes) and drawn on the page as an image item, its caption under it, the row's title over it, the plan's notes and texts where the plan
// puts them. The glasses fetch an image's bytes from the Nest by its hash. The drawing is canvas-say.mjs draw on the page --page of the canvas library
// ("+"), added there under --name when missing. THE CANVAS IS ONE LOG (Nov 1 2026): each item is one canvas.op of the mouth's id (harmony-claude:<its
// id>), and every op is first made as canvas-say's draw makes it (drawPlan) and checked as the Nest's door checks it (canvas-fold.mjs checkCanvasOp):
// nothing is written unless all of them pass, nor when an id already stands on the page. --dry stops there (no blob, no op). No snapshot: a board is
// its ops, so a glass that opens the page holds every frame (the old road's --seed is gone with its snapshot).
//   node storyboard-canvas.mjs <plan.json> --page page-<uuid> [--name Storyboard] [--his-word "<his words>"] [--dry] [--house <a house tree>] [--nest http://127.0.0.1:8904]
// plan: {rows: [{id, title?, x?, y, w?, h?, gap?, frames: [{file, time?, caption?}]}], notes: [{id, text, xywh}], texts: [{id, text, xywh, fontSize?, fontWeight?, wrap?}]}
// A caption wraps at its frame's width, and a text at its box's when the plan says wrap: hasMaxWidth, laid out by the core itself (core/src/paint.rs
// text_ops), the same lines on every glass. A text without it is one line per newline: on the Storyboard page a long caption ran into its neighbour's
// (Oct 17 2026, THE TWELVE's last row and her entrance's first draw).
// canvas-say is read from the tree this tool stands in, else --house. COST: one PUT per frame (15 to 80 KB) and one append per item; nothing keeps running.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const PLAN = args.find((a, i) => !a.startsWith('--') && !['--page', '--name', '--house', '--nest', '--his-word'].includes(args[i - 1]));
const PAGE = opt('--page', ''), NAME = opt('--name', 'Storyboard'), DRY = args.includes('--dry'), HIS = opt('--his-word', '');   // HIS: his words asking for the page, when it is a new tab (A TAB IS BORN BY HIS WORD ALONE, 187d182110)
const HOUSE = path.resolve(opt('--house', path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..', '..')));   // this tool's own tree
const NEST = opt('--nest', process.env.NEST || 'http://127.0.0.1:8904').replace(/\/$/, '');
const SAY = path.join(HOUSE, 'tools/embertide-mesh/canvas-say.mjs');

/** A JPEG's or PNG's size, read from its header. */
export function imageSize(b) {
  if (b[0] === 0x89 && b[1] === 0x50) return {width: b.readUInt32BE(16), height: b.readUInt32BE(20)};
  for (let i = 2; i + 9 < b.length;) {
    if (b[i] !== 0xff) { i++; continue; }
    const m = b[i + 1], len = b.readUInt16BE(i + 2);
    if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return {width: b.readUInt16BE(i + 7), height: b.readUInt16BE(i + 5)};
    i += 2 + len;
  }
  throw new Error('not a JPEG or PNG');
}
const sha = (b) => createHash('sha256').update(b).digest('hex');
const text = (id, s, xywh, {fontSize = 16, fontWeight = 400, wrap = false} = {}) => ({id, kind: 'text', xywh, fontSize, fontWeight: String(fontWeight), ...(wrap ? {hasMaxWidth: true} : {}), runs: [{text: s}]});   // the core takes the weight as a string; wrap: its lines break at the box's width
const note = (id, s, xywh) => ({id, kind: 'note', xywh, background: '--affine-note-background-orange', paragraphs: s.split('\n').map((t) => ({type: 'text', runs: [{text: t}]}))});

/** The plan as canvas items, in drawing order, and the frames' bytes by blob id. */
export function itemsOf(plan, base) {
  const items = [], blobs = new Map();
  for (const row of plan.rows || []) {
    const w = row.w ?? 320, h0 = row.h, gap = row.gap ?? 24, x0 = row.x ?? 0;
    if (row.title) items.push(text(`${row.id}-title`, row.title, [x0, row.y - 52, Math.max(1200, row.frames.length * (w + gap)), 40], {fontSize: 26, fontWeight: 700}));
    row.frames.forEach((f, i) => {
      const bytes = fs.readFileSync(path.resolve(base, f.file)), size = imageSize(bytes), h = h0 ?? Math.round(w * size.height / size.width), blobId = sha(bytes);
      blobs.set(blobId, bytes);
      const x = x0 + i * (w + gap);
      items.push({id: `${row.id}-${i}`, kind: 'image', blobId, xywh: [x, row.y, w, h], naturalWidth: size.width, naturalHeight: size.height, size: bytes.length});
      if (f.time) items.push(text(`${row.id}-${i}-t`, f.time, [x, row.y + h + 6, w, 24], {fontSize: 18, fontWeight: 700}));
      if (f.caption) items.push(text(`${row.id}-${i}-c`, f.caption, [x, row.y + h + (f.time ? 32 : 6), w, 44], {fontSize: 14, wrap: true}));
    });
  }
  for (const t of plan.texts || []) items.push(text(t.id, t.text, t.xywh, t));
  for (const n of plan.notes || []) items.push(note(n.id, n.text, n.xywh));
  return {items, blobs};
}

async function main() {
  if (args.includes('--seed')) throw new Error('--seed is gone: THE CANVAS IS ONE LOG, a page is its ops (no snapshot to seed)');
  if (!PLAN || !/^page-[0-9a-f-]{36}$/.test(PAGE)) throw new Error('usage: storyboard-canvas.mjs <plan.json> --page page-<uuid> [--name Storyboard] [--his-word "<his words>"] [--dry]');
  const plan = JSON.parse(fs.readFileSync(PLAN, 'utf8')), {items, blobs} = itemsOf(plan, path.dirname(path.resolve(PLAN)));
  process.env.CANVAS_PAGE = PAGE; process.env.CANVAS_NAME = NAME; process.env.NEST = NEST;
  const say = await import(pathToFileURL(SAY).href), {checkCanvasOp} = await import(pathToFileURL(path.join(HOUSE, 'tools/embertide-mesh/lib/canvas-fold.mjs')).href);
  const doc = `harmony-golem-${PAGE}`, {fold} = await say.board(doc);
  // the rehearsal: canvas-say draw's own ops (drawPlan: one op an item, the mouth's ids), each checked as the Nest's door checks it, on the page as it stands
  const made = say.drawPlan(items, {doc, fold}), standing = new Set(say.itemsOf(fold).map((it) => it.id));
  if (made.notCarried.length) throw new Error(`the record carries no op for ${made.notCarried.map((x) => x.id).join(', ')}`);
  let bytes = 0;
  for (const p of made.ops) {
    if (standing.has(p.id)) throw new Error(`${p.id} is on the page already: give the new rows new ids`);
    try { checkCanvasOp('harmony-claude', p); } catch (e) { throw new Error(`the Nest would refuse ${p.id}: ${e.message}`); }
    bytes += JSON.stringify(p).length;
  }
  const kb = [...blobs.values()].reduce((s, x) => s + x.length, 0) / 1024;
  console.log(`${items.length} items pass the Nest's check as ${made.ops.length} ops (${(bytes / 1024).toFixed(1)} KB); ${blobs.size} frames, ${kb.toFixed(0)} KB of blobs; page ${PAGE} (${NAME})`);
  if (DRY) return;
  for (const [hash, body] of blobs) {
    const r = await fetch(`${NEST}/nest/blob`, {method: 'PUT', headers: {'content-type': 'application/octet-stream', 'x-sha256': hash}, body, signal: AbortSignal.timeout(30_000)});
    const j = await r.json().catch(() => null);
    if (!r.ok || j?.hash !== hash) throw new Error(`blob ${hash.slice(0, 12)}: ${r.status} ${JSON.stringify(j).slice(0, 200)}`);
  }
  const file = path.join(os.tmpdir(), `storyboard-items-${process.pid}.json`);
  fs.writeFileSync(file, JSON.stringify(items));
  try { if (HIS) { const e = spawnSync(process.execPath, [SAY, 'ensure', '--his-word', HIS], {env: process.env, encoding: 'utf8', timeout: 60_000}); if (e.status !== 0) throw new Error(`canvas-say ensure ended ${e.status}: ${(e.stderr || e.stdout).slice(0, 600)}`); }   // the page born by his word first; without it draw lays only on a page that stands
    const run = spawnSync(process.execPath, [SAY, 'draw', file], {env: process.env, encoding: 'utf8', timeout: 120_000});
    if (run.status !== 0) throw new Error(`canvas-say draw ended ${run.status}: ${(run.stderr || run.stdout).slice(0, 600)}`);
    console.log(run.stdout.trim());
  } finally { fs.rmSync(file, {force: true}); }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e.message || e); process.exit(1); });

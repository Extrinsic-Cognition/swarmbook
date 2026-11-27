#!/usr/bin/env node
// canvas-page.proof.mjs: A CANVAS PAGE AS THE CANVAS DRAWS IT, off every screen. His word, Oct 14 2026 16:5x WEST, after I wrote that the Storyboard
// page was checked on the Nest but not seen drawn: "show to me the latest all coward".
// The canvas's own dev host (life-menu/editor2/dev.html: the host role on its own IndexedDB, the am:editor-* bridge, the same editor, core and
// renderer every glass runs) is opened in a headless Chrome on the page's id; the page's export (its record from the Nest plus every image's bytes,
// made by --export on the Mac that holds the Nest) is put in the dev host's import field, as his hand would; once the editor holds every item and
// every image, the board is drawn region by region at scale 1 by the editor's own captureRegion (__harmonyDev.api.screenshotRegion), and the
// window is pictured as the editor shows it.
//   node canvas-page.proof.mjs --export <page.json> --page page-<uuid> [--nest http://127.0.0.1:8904]       on the Nest's Mac: the export file
//   node canvas-page.proof.mjs --render <page.json> --out <dir> [--regions x,y,w,h;x,y,w,h] [--chrome <path>]   anywhere: the pictures
// Writes <out>/region-<n>.png, <out>/window.png and <out>/canvas-page.json (they hold what the page holds: keep them out of git).
// COST: --export reads one record and its blobs (about 1 MB); --render, one Chrome for under a minute.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {door} from '../lab/storyboard.proof.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UI = path.resolve(HERE, '../../..');
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const NEST = opt('--nest', 'http://127.0.0.1:8904').replace(/\/$/, '');
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** The page's export as the dev host takes it: the record its ref names, and every image's bytes, each checked against its name. */
export async function exportPage(page) {
  const doc = `harmony-golem-${page}`, get = (p) => fetch(`${NEST}${p}`, {signal: AbortSignal.timeout(30_000)});
  const ref = (await (await get(`/nest/ref/harmony/canvas-doc/${doc}`)).json()).ref;
  if (!ref) throw new Error(`${doc} has no snapshot on the Nest`);
  const record = await (await get(`/nest/blob/${ref.value.snapshot}`)).json();
  const blobs = [];
  for (const id of record.blobIds) {
    const bytes = Buffer.from(await (await get(`/nest/blob/${id}`)).arrayBuffer());
    if (createHash('sha256').update(bytes).digest('hex') !== id) throw new Error(`blob ${id.slice(0, 12)}: its bytes are not its name`);
    blobs.push({id, mime: bytes[0] === 0x89 ? 'image/png' : 'image/jpeg', dataBase64: bytes.toString('base64')});
  }
  return {doc, rev: ref.rev, seq: ref.value.seq, export: {...record, blobs}};
}

async function render(file, out, regions) {
  const exp = JSON.parse(fs.readFileSync(file, 'utf8')), doc = exp.docID;
  fs.mkdirSync(out, {recursive: true});
  const CHROME = opt('--chrome', CHROMES.find((c) => fs.existsSync(c)));
  if (!CHROME) throw new Error('no Chrome here');
  const d = await door(UI), dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'canvas-page-chrome-'));
  const child = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--window-size=1440,900', '--hide-scrollbars', '--no-first-run',
    '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', '--force-color-profile=srgb', 'about:blank'], {stdio: 'ignore'});
  let ws = null;
  const end = async () => { try { ws?.close(); } catch {} try { child.kill('SIGTERM'); } catch {} for (let i = 0; i < 30 && child.exitCode === null && child.signalCode === null; i++) await sleep(100);
    if (child.exitCode === null && child.signalCode === null) { try { child.kill('SIGKILL'); } catch {} } try { fs.rmSync(dir, {recursive: true, force: true}); } catch {} await d.close(); };
  const results = {at: new Date().toISOString(), host: os.hostname(), doc, items: exp.board.items.length, images: exp.blobIds.length, regions: []};
  const errors = [];
  try {
    let port = null;
    for (let i = 0; i < 400 && !port; i++) { await sleep(150); try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {} }
    if (!port) throw new Error('Chrome did not open its debugging port');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json());
    results.browser = ver.Browser;
    ws = new WebSocket(ver.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0; const wait = new Map();
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    ws.onmessage = (m) => { const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 300));
      if (x.method === 'Runtime.consoleAPICalled' && (x.params.type === 'error' || x.params.type === 'warning')) errors.push(`console.${x.params.type}: ` + x.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300));
      if (x.method === 'Network.responseReceived' && x.params.response.status >= 400) errors.push(`${x.params.response.status} ${x.params.response.url.replace(d.origin, '')}`);
      if (x.method === 'Network.loadingFailed') errors.push(`failed ${x.params.errorText}`); };
    const t = await send('Target.createTarget', {url: 'about:blank'}), s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable', 'DOM.enable', 'Network.enable']) await send(m, {}, s);
    await send('Emulation.setDeviceMetricsOverride', {width: 1440, height: 900, deviceScaleFactor: 1, mobile: false}, s);
    const ev = async (expression) => { const r = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true}, s);
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 400)); return r.result.value; };
    await send('Page.navigate', {url: `${d.origin}/intro/life-menu/editor2/dev.html?project=${encodeURIComponent(doc)}`}, s);
    const until = async (expr, ms = 60000) => { const t0 = Date.now(); for (;;) { let v = null; try { v = await ev(expr); } catch {} if (v) return v; if (Date.now() - t0 > ms) throw new Error(`waited ${ms} ms for ${expr}`); await sleep(250); } };
    await until('window.__harmonyDev && window.__harmonyDev.ready.then(() => true)');
    // the import, as his hand would: the export file in the dev host's field (the host stores the bytes and the record, then reloads the editor)
    const root = await send('DOM.getDocument', {depth: 1}, s), input = await send('DOM.querySelector', {nodeId: root.root.nodeId, selector: '#v1-file'}, s);
    const t0 = Date.now();
    await send('DOM.setFileInputFiles', {files: [path.resolve(file)], nodeId: input.nodeId}, s);
    const state = await until(`window.__harmonyDev.api.state().then(x => x.loaded && x.items >= ${results.items} && x.blobs >= ${results.images} ? x : null).catch(() => null)`, 90000);
    results.loadedMs = Date.now() - t0; results.state = {items: state.items, blobs: state.blobs, digest: state.digest, recordDigest: exp.digest};
    console.log(`the editor holds ${state.items} items and ${state.blobs} images in ${results.loadedMs} ms; digest ${state.digest} (the record's ${exp.digest})`);
    await sleep(1500);
    for (const [i, [x, y, w, h]] of regions.entries()) {
      const rect = JSON.stringify({x, y, w, h});
      await ev(`window.__harmonyDev.api.screenshotRegion(${rect})`);   // the first pass decodes the images
      await sleep(800);
      const url = await ev(`window.__harmonyDev.api.screenshotRegion(${rect})`), file_ = `region-${i + 1}.png`;
      fs.writeFileSync(path.join(out, file_), Buffer.from(String(url).split(',')[1], 'base64'));
      results.regions.push({rect: [x, y, w, h], file: file_});
      console.log(`  region ${i + 1} ${rect}: ${file_}`);
    }
    const shot = await send('Page.captureScreenshot', {format: 'png'}, s);
    fs.writeFileSync(path.join(out, 'window.png'), Buffer.from(shot.data, 'base64'));
  } catch (error) { results.failed = String(error.message); throw error; } finally {
    results.errors = errors;
    if (errors.length) console.log('page errors: ' + errors.slice(0, 8).join(' | '));
    fs.writeFileSync(path.join(out, 'canvas-page.json'), JSON.stringify(results, null, 1));
    await end();
  }
}

async function main() {
  if (args.includes('--export')) {
    const page = opt('--page', ''); if (!/^page-[0-9a-f-]{36}$/.test(page)) throw new Error('--page page-<uuid>');
    const e = await exportPage(page);
    fs.writeFileSync(opt('--export'), JSON.stringify(e.export));
    return console.log(`${e.doc}: rev ${e.rev}, seq ${e.seq}, ${e.export.board.items.length} items, ${e.export.blobs.length} images, ${(fs.statSync(opt('--export')).size / 1024).toFixed(0)} KB`);
  }
  const regions = opt('--regions', '-20,-350,3320,990;-20,800,2800,1480;-20,2320,2940,1480;-20,3930,3300,730').split(';').map((r) => r.split(',').map(Number));
  return render(opt('--render'), path.resolve(opt('--out', path.join(os.tmpdir(), 'canvas-page-proof'))), regions);
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e.message || e); process.exit(1); });

#!/usr/bin/env node
// braindance.proof.mjs: the braindance viewer (braindance.html) proved in a muted headless Chrome over CDP, off every screen, on the new Mac
// (the serving Mac serves the house: no heavy job there). The tree goes there by git archive; this file runs there under bounded.mjs.
//   node braindance.proof.mjs --out <dir> [--chrome <path>]
// - The replication: the page at 30.0 s on the record's shot "over Athena's shoulder, down at the fight", the film's own frame beside it at
//   its native 960 x 540 (?film=side), with her head at mu (the default) and her feet at mu; then 37.132 s (his tag, the column), 43.0 s in the
//   establishing space (the pinnacle), 77 s (his thanks). The same seconds from a free orbit with no film (the whole braindance: every Gaussian,
//   the shot's camera as a frustum). The torn still (CUTS.md device 4) at the start, half and end of the move that leaves it.
// - The cost: ms a frame (120 draws of one state, each read back by one pixel), triangles and draw calls, at 1440 x 900 dpr 2; the bytes the
//   page loads, counted at the door; draws at rest (3 s, nothing pressed: 0), while the film plays (3 s: one a film frame) and after its pause.
// The door: this tree's embertide-app/ui at / (the page is /intro/dyson-society/lab/braindance.html, as aiolos serves it), byte ranges (a film
// seeks), GET and HEAD only. ?nest= points the page's one Nest read (his tags) at the door, which has no Nest: the page falls back to its copy
// of rev 1, said in the receipt. Every other request is refused and listed.
// A candidate beside the record: the door also serves lab/braindance.mirror-x.json, the record with every x negated (each mu and look), for the
// page's ?record=, at 30.0 and 43.0 s: the first pictures had her, Dolbar and the pinnacle's star each on the other side of the film's frame.
// Writes <out>/braindance.proof.json and PNGs; those holding a film frame go to <out>/frames/ (the mirror's strip list drops frames/ folders).
// COST: one Chrome (about 500 MB) for about a minute.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UI = path.resolve(HERE, '../../..');   // embertide-app/ui
const PAGE = '/intro/dyson-society/lab/braindance.html';
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', path.join(os.tmpdir(), 'braindance-proof')));
const pw = path.join(os.homedir(), 'Library/Caches/ms-playwright');
const cft = fs.existsSync(pw) ? fs.readdirSync(pw).filter(d => d.startsWith('chromium-')).sort().reverse()
  .map(d => path.join(pw, d, 'chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')) : [];
const CHROME = opt('--chrome', [...cft, '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].find(c => fs.existsSync(c)));
const TYPES = {html: 'text/html; charset=utf-8', js: 'text/javascript', mjs: 'text/javascript', json: 'application/json', png: 'image/png', mp4: 'video/mp4', glb: 'model/gltf-binary'};
const sleep = ms => new Promise(r => setTimeout(r, ms));

const MIRROR = '/intro/dyson-society/lab/braindance.mirror-x.json';
const mirrorX = (v) => Array.isArray(v) ? v.map(mirrorX) : v && typeof v === 'object'
  ? Object.fromEntries(Object.entries(v).map(([k, w]) => [k, (k === 'mu' || k === 'look') && Array.isArray(w) && w.length === 3 ? [-w[0], w[1], w[2]] : mirrorX(w)])) : v;
function door(root) {
  root = fs.realpathSync(root);
  const bytes = {}, asks = [];
  const server = http.createServer((req, res) => {
    const p = new URL(req.url, 'http://x').pathname; asks.push(`${req.method} ${p}${req.headers.range ? ` ${req.headers.range}` : ''}`);
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    if (p === MIRROR) {
      const body = JSON.stringify({...mirrorX(JSON.parse(fs.readFileSync(path.join(root, 'intro/dyson-society/lab/braindance.json'), 'utf8'))), candidate: 'the record with every x negated (braindance.proof.mjs)'});
      res.writeHead(200, {'content-type': 'application/json', 'content-length': Buffer.byteLength(body), 'cache-control': 'no-store'}); return res.end(req.method === 'HEAD' ? undefined : body);
    }
    let fp; try { fp = fs.realpathSync(path.join(root, decodeURIComponent(p))); } catch { res.writeHead(404); return res.end(); }
    if (fp !== root && !fp.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    let st; try { st = fs.statSync(fp); } catch { res.writeHead(404); return res.end(); }
    if (st.isDirectory()) { res.writeHead(404); return res.end(); }
    const type = TYPES[path.extname(fp).slice(1).toLowerCase()] || 'application/octet-stream';
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    let start = 0, end = st.size - 1, code = 200;
    if (m) {
      start = m[1] === '' ? st.size - Number(m[2]) : Number(m[1]); end = Math.min(m[1] !== '' && m[2] !== '' ? Number(m[2]) : st.size - 1, st.size - 1); code = 206;
      if (!(start >= 0 && start <= end)) { res.writeHead(416, {'content-range': `bytes */${st.size}`}); return res.end(); }
    }
    res.writeHead(code, {'content-type': type, 'accept-ranges': 'bytes', 'content-length': end - start + 1, 'cache-control': 'no-store',
      ...(code === 206 ? {'content-range': `bytes ${start}-${end}/${st.size}`} : {})});
    if (req.method === 'HEAD') return res.end();
    const s = fs.createReadStream(fp, {start, end}); s.on('data', c => { bytes[p] = (bytes[p] ?? 0) + c.length; }); s.pipe(res);
  });
  return new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', () => resolve({origin: `http://127.0.0.1:${server.address().port}`, bytes, asks,
    close: () => new Promise(r => { server.closeAllConnections?.(); server.close(() => r()); })})); });
}

async function main() {
  if (!CHROME) throw new Error('no Chrome found: --chrome <path>');
  fs.mkdirSync(path.join(OUT, 'frames'), {recursive: true});
  const d = await door(UI);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'braindance-chrome-'));
  const child = spawn(CHROME, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--no-first-run', '--no-default-browser-check',
    '--autoplay-policy=no-user-gesture-required', '--mute-audio', '--hide-scrollbars', '--disable-background-networking', '--disable-component-update',
    '--enable-gpu', 'about:blank'], {stdio: 'ignore'});
  let ws;
  const end = async () => {
    try { ws?.close(); } catch {}
    try { child.kill('SIGTERM'); } catch {}
    for (let i = 0; i < 30 && child.exitCode === null && child.signalCode === null; i++) await sleep(100);
    if (child.exitCode === null && child.signalCode === null) { try { child.kill('SIGKILL'); } catch {} await sleep(200); }
    try { fs.rmSync(dir, {recursive: true, force: true}); } catch {}
    await d.close();
  };
  process.on('SIGTERM', () => end().then(() => process.exit(3)));
  const results = {at: new Date().toISOString(), host: os.hostname(), load: os.loadavg(), chrome: CHROME};
  try {
    let port = null;
    for (let i = 0; i < 300 && !port; i++) { await sleep(100); if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`); try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {} }
    if (!port) throw new Error('Chrome did not open its debugging port in 30 s');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then(r => r.json());
    results.browser = ver.Browser;
    ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0; const wait = new Map(), errors = [], refused = []; let loads = 0;
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    ws.onmessage = m => {
      const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const {url} = x.params.request, ok = url.startsWith(d.origin + '/') || url.startsWith('data:') || url.startsWith('blob:');
        if (ok) send('Fetch.continueRequest', {requestId: x.params.requestId}, x.sessionId).catch(() => {});
        else { refused.push(url.slice(0, 120)); send('Fetch.failRequest', {requestId: x.params.requestId, errorReason: 'BlockedByClient'}, x.sessionId).catch(() => {}); }
        return;
      }
      if (x.method === 'Page.loadEventFired') loads++;
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 300));
      if (x.method === 'Runtime.consoleAPICalled' && ['error', 'warning'].includes(x.params.type)) errors.push(`console.${x.params.type}: ` + x.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 300));
    };
    const t = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: 1920, height: 1080});
    const s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable']) await send(m, {}, s);
    await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
    await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s);
    // count the page's own frame requests: at rest there must be none
    await send('Page.addScriptToEvaluateOnNewDocument', {source: 'window.__raf = 0; { const r = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = (f) => { window.__raf++; return r(f); }; }'}, s);
    const ev = async (expression) => { const r = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true}, s); if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 400)); return r.result?.value; };
    const until = async (expr, ms = 30000) => { const t0 = Date.now(); while (!(await ev(expr))) { if (Date.now() - t0 > ms) throw new Error(`waited ${ms} ms for ${expr}`); await sleep(100); } };
    const open = async (query, [w, h], dpr = 1) => {
      await send('Emulation.setDeviceMetricsOverride', {width: w, height: h, deviceScaleFactor: dpr, mobile: false}, s);
      const n = loads; const nav = await send('Page.navigate', {url: `${d.origin}${PAGE}?nest=${encodeURIComponent(d.origin)}&${query}`}, s);
      if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
      const t0 = Date.now(); while (loads === n && Date.now() - t0 < 20000) await sleep(50);
      await until('Boolean(window.braindance)');
      return ev('window.braindance.ready');
    };
    const shoot = async (name, sub = '') => {
      await ev('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
      const b64 = (await send('Page.captureScreenshot', {format: 'png'}, s)).data;
      const fp = path.join(OUT, sub, `${name}.png`); fs.writeFileSync(fp, Buffer.from(b64, 'base64')); return path.relative(OUT, fp);
    };
    const SIDE = [1920, 604], WIDE = [1600, 964];

    // the first load, its bytes at the door
    const first = await open('t=30&film=side', SIDE);
    results.firstLoad = {info: first, bytes: {...d.bytes}, total: Object.values(d.bytes).reduce((a, b) => a + b, 0)};
    console.log(`renderer ${first.renderer}; athena ${first.athena}; fighters [${first.fighters}]; tags ${first.tags}; bytes ${results.firstLoad.total}`);

    // the replication, the film beside it
    results.pictures = [];
    const side = [
      {name: '30.0-over-her-shoulder-head-at-mu', q: 't=30&film=side', set: {t: 30.0, cam: 'shot', space: 'cinematographic'}},
      {name: '30.0-over-her-shoulder-feet-at-mu', q: 't=30&film=side&anchor=feet', set: {t: 30.0, cam: 'shot', space: 'cinematographic'}},
      {name: '37.132-his-tag-the-column', q: 't=37.132&film=side', set: {t: 37.132, cam: 'shot', space: 'cinematographic'}},
      {name: '43.0-the-pinnacle-establishing', q: 't=43&film=side&space=establishing', set: {t: 43.0, cam: 'shot', space: 'establishing'}},
      {name: '77.0-his-thanks', q: 't=77&film=side', set: {t: 77.0, cam: 'shot', space: 'cinematographic'}},
      {name: '14.0-ikki-takes-the-blast', q: 't=14&film=side', set: {t: 14.0, cam: 'shot', space: 'cinematographic'}},
      {name: 'candidate-mirror-x-30.0-over-her-shoulder', q: 't=30&film=side&record=braindance.mirror-x.json', set: {t: 30.0, cam: 'shot', space: 'cinematographic'}},
      {name: 'candidate-mirror-x-37.132-the-column', q: 't=37.132&film=side&record=braindance.mirror-x.json', set: {t: 37.132, cam: 'shot', space: 'cinematographic'}},
      {name: 'candidate-mirror-x-43.0-the-pinnacle', q: 't=43&film=side&space=establishing&record=braindance.mirror-x.json', set: {t: 43.0, cam: 'shot', space: 'establishing'}},
    ];
    for (const p of side) {
      await open(p.q, SIDE); const r = await ev(`window.braindance.set(${JSON.stringify(p.set)})`);
      results.pictures.push({...p, film: r.film, info: r.info, file: await shoot(p.name, 'frames')});
      console.log(`${p.name}: film at ${r.film}, shot ${r.info.shot}, triangles ${r.info.triangles}`);
    }
    // the whole braindance from a free orbit, no film
    for (const p of [
      {name: '30.0-free-the-whole-braindance', q: 't=30&film=off&cam=free', set: {t: 30.0, cam: 'free', space: 'cinematographic'}},
      {name: '37.132-free-the-column', q: 't=37.132&film=off&cam=free', set: {t: 37.132, cam: 'free', space: 'cinematographic'}},
      {name: '43.0-free-establishing', q: 't=43&film=off&cam=free&space=establishing', set: {t: 43.0, cam: 'free', space: 'establishing'}},
    ]) {
      await open(p.q, WIDE); const r = await ev(`window.braindance.set(${JSON.stringify(p.set)})`);
      results.pictures.push({...p, info: r.info, file: await shoot(p.name)});
    }
    // the torn still and the move that leaves it
    await open('t=30&film=off&still=1', WIDE);
    await until('window.braindance.info().still', 15000).catch(() => {});
    for (const u of [0, 0.4, 0.7, 1]) {
      const r = await ev(`window.braindance.set({t: 30, cam: 'shot', leave: ${u}})`);
      results.pictures.push({name: `still-leave-${u}`, info: r.info, file: await shoot(`30.0-torn-still-leave-${u}`, 'frames')});
    }

    // the cost at a glass's size: 1440 x 900 at dpr 2, the film in its corner
    results.bench = [];
    for (const [q, set] of [['t=30', {t: 30, cam: 'shot'}], ['t=37.132', {t: 37.132, cam: 'shot'}], ['t=43&space=establishing', {t: 43, cam: 'shot', space: 'establishing'}],
      ['t=30&cam=free', {t: 30, cam: 'free'}]]) {
      await open(q, [1440, 900], 2); await ev(`window.braindance.set(${JSON.stringify(set)})`);
      const b = await ev('window.braindance.bench(120)'); results.bench.push({q, ...b});
      console.log(`bench ${q}: median ${b.median.toFixed(2)} ms, p95 ${b.p95.toFixed(2)} ms, triangles ${b.triangles}, calls ${b.calls}, ${b.size.join(' x ')}`);
    }
    // at rest, while the film plays, after its pause
    await open('t=20', [1440, 900], 2); await ev('window.braindance.set({t: 20, cam: "shot"})');
    const count = () => ev('({draws: window.braindance.info().draws, raf: window.__raf, by: window.braindance.info().by})');
    const a0 = await count(); await sleep(3000); const a1 = await count();
    await ev('document.getElementById("play").click()'); await sleep(3000); const p1 = await count();
    await ev('document.getElementById("play").click()'); await sleep(300); const q0 = await count(); await sleep(3000); const q1 = await count();
    results.rest = {atRest3s: {draws: a1.draws - a0.draws, raf: a1.raf - a0.raf}, playing3s: {draws: p1.draws - a1.draws, raf: p1.raf - a1.raf, by: p1.by},
      afterPause3s: {draws: q1.draws - q0.draws, raf: q1.raf - q0.raf}, filmAt: await ev('document.getElementById("video").currentTime')};
    console.log(`rest: ${JSON.stringify(results.rest)}`);
    results.errors = errors; results.refused = [...new Set(refused)];
    results.asks = d.asks.length;
  } finally {
    fs.writeFileSync(path.join(OUT, 'braindance.proof.json'), JSON.stringify(results, null, 1));
    await end();
  }
}
main().then(() => process.exit(0), e => { console.error(e.stack || e.message); process.exit(1); });

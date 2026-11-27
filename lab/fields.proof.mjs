#!/usr/bin/env node
// fields.proof.mjs: THE FIELDS (fields.js) proved in a muted headless Chrome over CDP, off every screen, on the lab page fields.html (and, with
// --hero, on hero-ab.html with the lines FIELDS.md gives the unboxing session applied by this door, so nothing of that session's is edited).
// Passes:
//   pictures: the page paused at the film's seconds of each piece, one picture each (the hair 29.6 to 33.4 s, the light 42.5 to 52.5 s, each
//             silhouette candidate round its moment), and the bare scenes at the same seconds for before and after;
//   cost:     the film played through each piece's window (fields.html ?fields=hair, light, dissolve), each film frame rendered --bench times
//             with the fields and --bench times without them inside the same draw, in turn order, two timer queries (?pair=1): the field's GPU
//             a render is the difference within one frame (the GPU's clock state, which follows the whole frame's work, cancels), the
//             scene's own beside it; the JS of the fields' updates and of their extra render; full and lysa budgets;
//   rest:     the page with every field, played a second then paused: for 3 s the draws, the animation frames asked, the video frame
//             callbacks left waiting (counted by wrapping the page's own calls from its first line);
//   --hero:   hero-ab.html (the film's view) with the lines and without them (a second door serving main's unboxing.js), pictures at
//             HERO_SECONDS; with the pass hero-cost, the box's own draws (its JS and GPU a draw) through her shot and the light's window.
// Writes <out>/fields.proof.json and <out>/pictures/*.jpg (they hold the film's frames and the game's figures: keep them out of git).
//   node fields.proof.mjs --out <dir> [--size 1440x900] [--chrome <path>] [--passes pictures,cost,rest] [--only hair,light] [--bench 8] [--hero]
//     [--nest <url>]
// COST: one Chrome (about 500 MB) for two to four minutes; run it on the new Mac, niced, under a time limit (tools/dead-tasks/bounded.mjs).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {DISSOLVE_CANDIDATES, CUTS} from './fields-plan.mjs';
import {heroLines} from './fields-lines.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UI = path.resolve(HERE, '../../..');
const LAB = '/intro/dyson-society/lab';
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', path.join(os.tmpdir(), 'fields-proof')));
const [W, H] = opt('--size', '1440x900').split('x').map(Number);
const PASSES = new Set(opt('--passes', 'pictures,cost,rest').split(','));
const BENCH = Number(opt('--bench', '8'));
const HERO = args.includes('--hero');
const ONLY = opt('--only', '');   // the pictures whose name begins so (hair, light, dissolve-athena ...)
const NEST = opt('--nest', 'http://127.0.0.1:8904').replace(/\/$/, '');
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')];
const CHROME = opt('--chrome', CHROMES.find((c) => fs.existsSync(c)));
const TYPES = {html: 'text/html; charset=utf-8', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg',
  webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', m4a: 'audio/mp4', woff2: 'font/woff2', glb: 'model/gltf-binary'};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** The door: this tree's embertide-app/ui at /, byte ranges, GET only; `swap` serves another text for a path (the hero's lines). */
export function door(root, swap = new Map(), {isolated = false} = {}) {
  const iso = isolated ? {'cross-origin-opener-policy': 'same-origin', 'cross-origin-embedder-policy': 'require-corp'} : {};
  root = fs.realpathSync(root);
  const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    const pathname = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (pathname === '/__blank') { res.writeHead(200, {'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store'}); return res.end('<!doctype html><title>blank</title><body style="background:#fff">'); }
    if (swap.has(pathname)) { const body = Buffer.from(swap.get(pathname)); res.writeHead(200, {'content-type': TYPES[path.extname(pathname).slice(1)] || 'text/plain', 'content-length': body.length, 'cache-control': 'no-store'}); return res.end(req.method === 'HEAD' ? undefined : body); }
    let fp;
    try { fp = fs.realpathSync(path.join(root, pathname)); } catch { res.writeHead(404); return res.end(); }
    if (fp !== root && !fp.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    let st;
    try { st = fs.statSync(fp); } catch { res.writeHead(404); return res.end(); }
    if (st.isDirectory()) { res.writeHead(404); return res.end(); }
    const type = TYPES[path.extname(fp).slice(1).toLowerCase()] || 'application/octet-stream';
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (m) {
      const start = m[1] === '' ? st.size - Number(m[2]) : Number(m[1]), end = Math.min(m[1] !== '' && m[2] !== '' ? Number(m[2]) : st.size - 1, st.size - 1);
      if (!(start >= 0 && start <= end)) { res.writeHead(416, {'content-range': `bytes */${st.size}`}); return res.end(); }
      res.writeHead(206, {'content-type': type, 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${st.size}`, 'content-length': end - start + 1, 'cache-control': 'no-store', ...iso});
      return req.method === 'HEAD' ? res.end() : fs.createReadStream(fp, {start, end}).pipe(res);
    }
    res.writeHead(200, {'content-type': type, 'accept-ranges': 'bytes', 'content-length': st.size, 'cache-control': 'no-store', ...iso});
    return req.method === 'HEAD' ? res.end() : fs.createReadStream(fp).pipe(res);
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((r) => { server.closeAllConnections?.(); server.close(() => r()); })}));
  });
}

// from every document's first line: the page's own asks for frames, counted (the rest pass reads them)
const COUNT = `(() => { if (window.__fc) return; const C = window.__fc = {raf: 0, rvfc: 0, rvfcCancel: 0, rvfcFired: 0};
  const raf = window.requestAnimationFrame.bind(window); window.requestAnimationFrame = (f) => { C.raf++; return raf(f); };
  const P = HTMLVideoElement.prototype, ask = P.requestVideoFrameCallback, cancel = P.cancelVideoFrameCallback;
  if (ask) { P.requestVideoFrameCallback = function (f) { C.rvfc++; return ask.call(this, (...a) => { C.rvfcFired++; return f(...a); }); };
    P.cancelVideoFrameCallback = function (id) { C.rvfcCancel++; return cancel.call(this, id); }; }
})();`;

// the lab page's helpers, run in the page
const HELPER = `window.__fp = (() => {
  const F = () => window.fields;
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  return {
    async ready() {
      const t0 = performance.now();
      for (;;) {
        const f = F(), s = f?.state;
        if (f && f.film.readyState >= 3 && s && !Object.values(s).some(v => String(v).startsWith('loading'))) break;
        if (performance.now() - t0 > 60000) throw new Error('the page did not come up in 60 s: ' + JSON.stringify(F()?.state));
        await new Promise(r => setTimeout(r, 150));
      }
      document.querySelector('.panel').style.visibility = 'hidden';
      await frames(3);
      return {state: F().state, on: F().on, budget: F().budget, gl: (() => { const g = F().renderer.getContext(), d = g.getExtension('WEBGL_debug_renderer_info'); return d ? g.getParameter(d.UNMASKED_RENDERER_WEBGL) : null; })()};
    },
    async seek(t) {
      const f = F().film, n0 = F().draws; f.pause();
      if (Math.abs(f.currentTime - t) > 1e-4) { f.currentTime = t; await new Promise(r => f.addEventListener('seeked', r, {once: true})); }
      const t0 = performance.now();
      while (F().draws === n0 || Math.abs((F().last?.t ?? -1) - f.currentTime) > 1e-3) { if (performance.now() - t0 > 5000) break; await frames(1); }
      await frames(2);
      return {t: f.currentTime, last: F().last};
    },
    async play(from, to) {
      const f = F().film; f.pause();
      f.currentTime = from; await new Promise(r => f.addEventListener('seeked', r, {once: true}));
      await frames(3);
      const d0 = F().draws, w0 = performance.now();
      await f.play();
      while (f.currentTime < to && !f.ended) await new Promise(r => setTimeout(r, 50));
      f.pause();
      const wall = performance.now() - w0;
      await frames(6);
      return {draws: F().draws - d0, wall, log: F().log.filter(e => e.draw > d0 && e.reason === 'film').map(e => ({t: e.t, cpuMs: e.cpuMs, gpuMs: e.gpuMs, bench: e.bench,
        fieldsMs: e.fieldsMs, gpuOn: e.gpuOn, gpuOff: e.gpuOff, cpuOn: e.cpuOn, cpuOff: e.cpuOff, calls: e.onCalls ?? e.calls, triangles: e.onTriangles ?? e.triangles, points: e.onPoints ?? e.points}))};
    },
    async rest(ms) {
      const f = F().film; f.pause();
      f.currentTime = 45.3; await new Promise(r => f.addEventListener('seeked', r, {once: true}));
      await f.play(); await new Promise(r => setTimeout(r, 1000)); f.pause();
      await new Promise(r => setTimeout(r, 300));
      const c0 = {...window.__fc}, d0 = F().draws;
      await new Promise(r => setTimeout(r, ms));
      const c1 = {...window.__fc};
      return {ms, draws: F().draws - d0, raf: c1.raf - c0.raf, rvfcAsked: c1.rvfc - c0.rvfc, rvfcWaiting: c1.rvfc - c1.rvfcCancel - c1.rvfcFired, counts: c1};
    },
  };
})(); 'ok'`;

// the hero's helpers (hero-ab.html, the film's view): ready, a picture at a second, the box's own draws through a window
const HERO_HELPER = `window.__fh = (() => {
  const H = window.hero, doc = () => H.frame.contentDocument, win = () => H.frame.contentWindow, film = () => doc()?.getElementById('dl-twelve-film');
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const settled = () => { const s = H.unbox?.state; return s && !String(s.cloth?.at).startsWith('loading') && !String(s.seiya?.at).startsWith('loading') && s.athena?.at !== 'loading'; };
  return {
    async ready() {
      const t0 = performance.now();
      while (!(H.theater && H.unbox && film()?.readyState >= 3 && settled())) { if (performance.now() - t0 > 90000) throw new Error('the hero did not come up in 90 s'); await new Promise(r => setTimeout(r, 200)); }
      film().pause();
      const stage = doc().getElementById('sphere-stage').getBoundingClientRect();
      win().scrollBy(0, Math.round(stage.top + stage.height / 2 - win().innerHeight / 2));
      document.querySelector('.ab').style.visibility = 'hidden';
      await frames(4);
      return {cloth: H.unbox.state.cloth.at, seiya: H.unbox.state.seiya.at, athena: H.unbox.state.athena.at};
    },
    async seek(t) {
      const f = film(); f.pause();
      if (Math.abs(f.currentTime - t) > 1e-4) { f.currentTime = t; await new Promise(r => f.addEventListener('seeked', r, {once: true})); }
      await frames(12);
      const b = H.boxLog.at(-1);
      return {t: f.currentTime, box: b ? {t: b.t, reason: b.reason, draws: b.draws, cpuMs: b.cpuMs, gpuMs: b.gpuMs, calls: b.calls, triangles: b.triangles, athena: b.athena} : null};
    },
    async play(from, to) {
      const f = film(); f.pause();
      f.currentTime = from; await new Promise(r => f.addEventListener('seeked', r, {once: true}));
      await frames(6);
      const n0 = H.boxLog.length, w0 = performance.now();
      await f.play();
      while (f.currentTime < to && !f.ended) await new Promise(r => setTimeout(r, 50));
      f.pause();
      const wall = performance.now() - w0;
      await frames(6);
      return {wall, log: H.boxLog.slice(n0).filter(e => e.reason === 'film' || e.reason === 'screen').map(e => ({t: e.t, cpuMs: e.cpuMs, gpuMs: e.gpuMs, bench: 1, calls: e.calls, triangles: e.triangles}))};
    },
  };
})(); 'ok'`;
const HERO_SECONDS = [29.7, 29.8, 29.86, 30.5, 31.5, 32.6, 33.4, 37.18, 43.6, 44.6, 45.6, 46.3, 47.2, 48.4, 50.3, 51.5];

const med = (xs) => { const a = xs.filter(Number.isFinite).sort((p, q) => p - q); return a.length ? a[Math.floor(a.length / 2)] : null; };
const pct = (xs, p) => { const a = xs.filter(Number.isFinite).sort((m, n) => m - n); return a.length ? a[Math.min(a.length - 1, Math.floor(a.length * p))] : null; };
const r3 = (x) => (x === null ? null : Math.round(x * 1000) / 1000);
const summary = (run) => ({draws: run.draws, wall: Math.round(run.wall), perSecond: +(run.draws / (run.wall / 1000)).toFixed(1),
  cpuMs: {median: r3(med(run.log.map((e) => e.cpuMs))), p95: r3(pct(run.log.map((e) => e.cpuMs), 0.95))},
  gpuMsPerRender: {median: r3(med(run.log.map((e) => e.gpuMs / (e.bench || 1)))), p95: r3(pct(run.log.map((e) => e.gpuMs / (e.bench || 1)), 0.95)), read: run.log.filter((e) => Number.isFinite(e.gpuMs)).length},
  calls: med(run.log.map((e) => e.calls)), triangles: med(run.log.map((e) => e.triangles)), points: med(run.log.map((e) => e.points))});

// the pictures: [name, params, seconds]
const PICTURES = [
  ['hair', 'fields=hair', [29.6, 30.5, 31.5, 32.6, 33.4, 37.0, 73.5]],
  ['hair-before', 'fields=none', [30.5, 32.6]],
  ['hair-far', 'fields=hair&far=2.2', [31.5]],
  ['ripple', 'fields=hair', [29.77, 29.8, 29.86, 30.2, 33.0, 37.18, 37.3]],
  ['ripple-still', 'fields=hair&ripple=0', [29.8, 29.86, 37.18]],
  ['hair-face-flow', 'fields=hair&flow=face&far=2.2', [31.5]],
  ['light', 'fields=light', [42.6, 43.4, 43.9, 44.6, 45.5, 46.3, 47.2, 48.4, 49.8, 50.3, 51.2, 52.5]],
  ['light-before', 'fields=box', [45.5, 47.2, 50.3]],
  ...DISSOLVE_CANDIDATES.flatMap((c) => {   // her strands are on her as she goes (bindHair): the hair field with her candidate
    const on = c.body === 'athena' ? 'hair,dissolve' : 'dissolve';
    return [
      [`dissolve-${c.id}`, `fields=${on}&moment=${c.id}`, [c.at - 0.1, c.at + 0.4, c.at + 0.9, c.at + 1.5, c.at + 2.4].map((x) => +x.toFixed(3))],
      ...['smoke', 'water', 'petals'].filter((s) => s !== c.style).map((s) => [`dissolve-${c.id}-${s}`, `fields=${on}&moment=${c.id}&style=${s}`, [+(c.at + 0.9).toFixed(3)]]),
    ];
  }),
];
// the cost windows: [name, piece params, bare params, from, to]
const pick = DISSOLVE_CANDIDATES[0];
const MODES = {
  hair: [['the strands streaming', CUTS.shoulder[0], CUTS.shoulder[1]]],
  light: [['the star\'s rays', 43.15, CUTS.burst], ['the burst', CUTS.burst, 47.6], ['the sun and the flood', 47.6, CUTS.centaur], ['the centaur\'s flames', CUTS.centaur, CUTS.knights]],
  dissolve: [['in the air', pick.at, pick.at + 4.0]],
};
const COSTS = [
  ['hair', 'fields=hair', 'fields=none', CUTS.shoulder[0] - 0.2, CUTS.shoulder[1]],
  ['light', 'fields=light', 'fields=box', CUTS.star, CUTS.knights],
  ['dissolve', `fields=dissolve&moment=${pick.id}`, `fields=body&moment=${pick.id}`, pick.at - 0.2, pick.at + 3.6],
];

async function main() {
  if (!CHROME) throw new Error('no Chrome here');
  fs.mkdirSync(path.join(OUT, 'pictures'), {recursive: true});
  const swap = new Map();
  if (HERO) {
    const file = path.join(HERE, 'unboxing.js'), lines = heroLines(fs.readFileSync(file, 'utf8'));
    swap.set(`${LAB}/unboxing.js`, lines.text);
    console.log(`the hero's lines: ${lines.applied.length} applied (${lines.applied.join(', ')})`);
  }
  const d = await door(UI, swap, {isolated: !HERO});
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'fields-chrome-'));
  const child = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, `--window-size=${W},${H}`, '--hide-scrollbars', '--no-first-run',
    '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', '--disable-default-apps',
    '--disable-features=Translate,MediaRouter,OptimizationHints', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows', '--force-color-profile=srgb', '--autoplay-policy=no-user-gesture-required', 'about:blank'], {stdio: 'ignore'});
  console.log(`chrome pid ${child.pid}, door ${d.origin}`);
  let ws = null;
  const end = async () => {
    try { ws?.close(); } catch {}
    try { child.kill('SIGTERM'); } catch {}
    for (let i = 0; i < 30 && child.exitCode === null && child.signalCode === null; i++) await sleep(100);
    if (child.exitCode === null && child.signalCode === null) { try { child.kill('SIGKILL'); } catch {} await sleep(200); }
    try { fs.rmSync(dir, {recursive: true, force: true}); } catch {}
    await d.close();
  };
  const onSig = () => end().then(() => process.exit(3));
  process.on('SIGTERM', onSig); process.on('SIGINT', onSig);
  const results = {at: new Date().toISOString(), chrome: CHROME, host: os.hostname(), loadavg: os.loadavg(), cpus: os.cpus().length, size: [W, H], bench: BENCH, hero: HERO, pictures: [], cost: {}, errors: []};
  try {
    let port = null;
    for (let i = 0; i < 400 && !port; i++) {
      await sleep(150);
      if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`);
      try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {}
    }
    if (!port) throw new Error('Chrome did not open its debugging port in 60 s');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json());
    results.browser = ver.Browser;
    ws = new WebSocket(ver.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0;
    const wait = new Map(), refused = [], origins = new Set([d.origin]);
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    const tags = `${NEST}/nest/ref/mint/seiya-tags`;
    ws.onmessage = (m) => {
      const x = JSON.parse(m.data), p = x.params;
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const {url, method} = p.request, ok = [...origins].some((o) => url.startsWith(o + '/')) || (method === 'GET' && url === tags) || url.startsWith('data:') || url.startsWith('blob:');
        if (ok) send('Fetch.continueRequest', {requestId: p.requestId}, x.sessionId).catch(() => {});
        else { refused.push(url.slice(0, 120)); send('Fetch.failRequest', {requestId: p.requestId, errorReason: 'BlockedByClient'}, x.sessionId).catch(() => {}); }
        return;
      }
      if (x.method === 'Runtime.exceptionThrown') results.errors.push(String(p?.exceptionDetails?.exception?.description || p?.exceptionDetails?.text).slice(0, 300));
      if (x.method === 'Runtime.consoleAPICalled' && (p.type === 'error' || p.type === 'warning')) results.errors.push(`console.${p.type}: ` + p.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300));
    };
    const t = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: W, height: H});
    const s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable', 'Network.enable']) await send(m, {}, s);
    await send('Network.setCacheDisabled', {cacheDisabled: false}, s);
    await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: 1, mobile: false}, s);
    await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s);
    await send('Page.addScriptToEvaluateOnNewDocument', {source: COUNT}, s);
    const ev = async (expression) => {
      const r = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true}, s);
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 400));
      return r.result.value;
    };
    const open = async (params) => {
      const nav = await send('Page.navigate', {url: `${d.origin}${LAB}/fields.html?${params}`}, s);
      if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
      await sleep(400);
      await ev(HELPER);
      return ev('window.__fp.ready()');
    };
    const shot = async () => (await send('Page.captureScreenshot', {format: 'jpeg', quality: 85, captureBeyondViewport: false}, s)).data;
    if (PASSES.has('pictures')) {
      for (const [name, params, seconds] of PICTURES.filter(([n]) => !ONLY || ONLY.split(',').some((o) => n.startsWith(o)))) {
        const ready = await open(params);
        results.renderer ??= ready.gl;
        for (const sec of seconds) {
          const at = await ev(`window.__fp.seek(${sec})`), file = `pictures/${name}-${sec.toFixed(3)}.jpg`;
          fs.writeFileSync(path.join(OUT, file), Buffer.from(await shot(), 'base64'));
          results.pictures.push({name, params, second: sec, film: at.t, file, last: at.last && {calls: at.last.calls, triangles: at.last.triangles, points: at.last.points, hair: at.last.hair, light: at.last.light, dissolve: at.last.dissolve}});
        }
        console.log(`pictures ${name}: ${seconds.length} (${JSON.stringify(ready.state)})`);
      }
    }
    if (PASSES.has('cost')) {
      for (const budget of ['full', 'lysa']) for (const [name, piece, , from, to] of COSTS.filter(([n]) => !ONLY || ONLY === 'none' || ONLY.split(',').some((o) => n.startsWith(o)))) {
        // one draw a film frame, the frame rendered BENCH times with the fields and BENCH times without, in turn order (fields.html ?pair=1)
        await open(`${piece}&budget=${budget}&bench=${BENCH}&pair=1`);
        const run = await ev(`window.__fp.play(${from}, ${to})`), L = run.log.filter((e) => Number.isFinite(e.gpuOn) && Number.isFinite(e.gpuOff));
        const per = (f) => L.map(f);
        results.cost[`${name}-${budget}`] = {window: [from, to], draws: run.draws, paired: L.length, perSecond: +(run.draws / (run.wall / 1000)).toFixed(1),
          fieldGpuMs: {median: r3(med(per((e) => (e.gpuOn - e.gpuOff) / e.bench))), p95: r3(pct(per((e) => (e.gpuOn - e.gpuOff) / e.bench), 0.95))},
          sceneGpuMs: {median: r3(med(per((e) => e.gpuOff / e.bench))), p95: r3(pct(per((e) => e.gpuOff / e.bench), 0.95))},
          fieldRenderCpuMs: {median: r3(med(per((e) => (e.cpuOn - e.cpuOff) / e.bench))), p95: r3(pct(per((e) => (e.cpuOn - e.cpuOff) / e.bench), 0.95))},
          fieldUpdateCpuMs: {median: r3(med(run.log.map((e) => e.fieldsMs))), p95: r3(pct(run.log.map((e) => e.fieldsMs), 0.95))},
          calls: {median: med(run.log.map((e) => e.calls)), max: Math.max(...run.log.map((e) => e.calls ?? 0))}, triangles: {median: med(run.log.map((e) => e.triangles)), max: Math.max(...run.log.map((e) => e.triangles ?? 0))},
          points: {median: med(run.log.map((e) => e.points)), max: Math.max(...run.log.map((e) => e.points ?? 0))}};
        const c = results.cost[`${name}-${budget}`];
        c.isolated = await ev('window.crossOriginIsolated === true');
        // the field at work: its own moments (the light's forms by the film's cuts; the dissolve while it is in the air)
        c.modes = {};
        for (const [mode, a, b] of MODES[name] ?? []) {
          const M = L.filter((e) => e.t >= a && e.t < b);
          if (M.length) c.modes[mode] = {from: a, to: b, n: M.length, fieldGpuMs: {median: r3(med(M.map((e) => (e.gpuOn - e.gpuOff) / e.bench))), p95: r3(pct(M.map((e) => (e.gpuOn - e.gpuOff) / e.bench), 0.95))},
            sceneGpuMs: r3(med(M.map((e) => e.gpuOff / e.bench))), fieldUpdateCpuMs: r3(med(M.map((e) => e.fieldsMs))), fieldRenderCpuMs: r3(med(M.map((e) => (e.cpuOn - e.cpuOff) / e.bench)))};
        }
        c.log = L.map((e) => [r3(e.t), r3(e.gpuOn / e.bench), r3(e.gpuOff / e.bench), r3(e.cpuOn / e.bench), r3(e.cpuOff / e.bench), r3(e.fieldsMs)]);
        console.log(`cost ${name} (${budget}): the field ${JSON.stringify(c.fieldGpuMs)} ms GPU a render over the scene's ${JSON.stringify(c.sceneGpuMs)}; ` +
          `its render ${JSON.stringify(c.fieldRenderCpuMs)} ms and its update ${JSON.stringify(c.fieldUpdateCpuMs)} ms of JS; ${c.paired} of ${c.draws} draws paired`);
      }
    }
    if (HERO) {
      const plain = await door(UI);
      origins.add(plain.origin);
      const heroAt = async (origin) => {
        const nav = await send('Page.navigate', {url: `${origin}${LAB}/hero-ab.html?v=film&paywall=off`}, s);
        if (nav.errorText) throw new Error(`the hero did not open: ${nav.errorText}`);
        await sleep(600); await ev(HERO_HELPER);
        return ev('window.__fh.ready()');
      };
      results.hero = {lines: heroLines(fs.readFileSync(path.join(HERE, 'unboxing.js'), 'utf8')).applied, before: {}, after: {}};
      try {
        for (const [which, origin] of [['after', d.origin], ['before', plain.origin]]) {
          const row = results.hero[which];
          row.ready = await heroAt(origin);
          row.pictures = [];
          for (const sec of HERO_SECONDS) {
            const at = await ev(`window.__fh.seek(${sec})`), file = `pictures/hero-${which}-${sec.toFixed(3)}.jpg`;
            fs.writeFileSync(path.join(OUT, file), Buffer.from(await shot(), 'base64'));
            row.pictures.push({second: sec, file, ...at});
          }
          if (PASSES.has('hero-cost')) for (const [name, from, to] of [['hair', 29.4, 33.6], ['light', 42.3, 53.1]]) {
            const run = await ev(`window.__fh.play(${from}, ${to})`);
            row[`cost-${name}`] = summary({...run, draws: run.log.length});
          }
          console.log(`hero ${which}: ${row.pictures.length} pictures; ${JSON.stringify(row.ready)}; cost ${JSON.stringify({hair: row['cost-hair']?.gpuMsPerRender, light: row['cost-light']?.gpuMsPerRender})}`);
        }
      } finally { await plain.close(); }
    }
    if (PASSES.has('rest')) {
      await open('fields=hair,light,dissolve');
      results.rest = await ev('window.__fp.rest(3000)');
      console.log(`rest: ${JSON.stringify(results.rest)}`);
    }
    results.refused = [...new Set(refused)];
    if (results.errors.length) console.log('page errors: ' + results.errors.slice(0, 6).join(' | '));
  } finally {
    fs.writeFileSync(path.join(OUT, 'fields.proof.json'), JSON.stringify(results, null, 1));
    console.log(`wrote ${path.join(OUT, 'fields.proof.json')}`);
    process.off('SIGTERM', onSig); process.off('SIGINT', onSig);
    await end();
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

#!/usr/bin/env node
// storyboard.proof.mjs: THE HERO'S STORYBOARD, its own frames as a glass draws them (tools/storyboard-canvas.mjs puts them on his canvas). His words,
// Oct 14 2026 16:1x WEST: "dude omg why the fuck it loads so slow dude??? can you fucking open up a canvas storyboard of the first few frames please??";
// then, over the hero at 32.6 s: "when athena is there, the fucking dodecahedron must be sized down to align with the battlefied... can you show me the
// frames where this is happening please??".
// One muted headless Chrome over CDP, off every screen, on hero-ab.html as main has it (the film's view, the default), in two passes:
// 1. THE LOAD, cold (a new profile; the door says no-store, aiolos says no-cache): from the navigation to --load seconds after it, the frames Chrome
//    paints (Page.startScreencast, one kept every 100 ms at most), every file (bytes, asked, done), the long animation frames with the scripts in
//    them (PerformanceObserver in every document), a CPU profile by file (Profiler, 1 ms samples), and the hero's milestones polled every 100 ms
//    (the page, the theater, the film's first frame and its playing, the box and its first draw, the models). A poll waits for the main thread, so a
//    gap between two polls is the main thread held.
// 2. THE SECONDS: the film paused at each of --seconds, the panel hidden, the stage in the middle of the window, one picture each.
// Writes <out>/storyboard.json, <out>/load/<ms>.jpg and <out>/at/<s>.jpg (they hold the film's frames: keep them out of git).
//   node storyboard.proof.mjs --out <dir> [--size 1440x900] [--chrome <path>] [--load 20] [--seconds 0,1.5,29.563] [--nest http://127.0.0.1:8904]
// The door: this tree's embertide-app/ui at / (the page at /intro/dyson-society/lab/hero-ab.html, as aiolos serves it), byte ranges, GET only; the
// one other request let through is his tags' read; everything else is refused and listed.
// COST: one Chrome (about 500 MB) for about a minute and a half; run it on the new Mac, niced, under a time limit.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UI = path.resolve(HERE, '../../..');
const PAGE = '/intro/dyson-society/lab/hero-ab.html?paywall=off';   // a minter's view: the lab stops at the wall as a visitor's page does
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', path.join(os.tmpdir(), 'storyboard-proof')));
const [W, H] = opt('--size', '1440x900').split('x').map(Number);
const LOAD_S = Number(opt('--load', '20'));
const NEST = opt('--nest', 'http://127.0.0.1:8904').replace(/\/$/, '');
// the film's first shots at its cuts, then Athena's two shots (the two-shot's last frame first, for the box's right size)
const SECONDS = opt('--seconds', '0,1.5,2.903,4.2,5.405,6.406,7.5,8.542,8.909,10,11.044,13.5,16.049,17.5,18.018,19.052,29.53,29.563,30.3,31,31.7,32.4,32.6,33.1,33.567,34.3,35,35.8,36.5')
  .split(',').map(Number);
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')];
const CHROME = opt('--chrome', CHROMES.find((c) => fs.existsSync(c)));
const TYPES = {html: 'text/html; charset=utf-8', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg',
  webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', m4a: 'audio/mp4', woff2: 'font/woff2', glb: 'model/gltf-binary'};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function door(root) {   // also tools/canvas-page.proof.mjs
  root = fs.realpathSync(root);
  const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    if (req.url === '/__blank') { res.writeHead(200, {'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store'}); return res.end('<!doctype html><title>blank</title><body style="background:#fff">'); }   // a new tab, before the page
    let fp;
    try { fp = fs.realpathSync(path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname))); } catch { res.writeHead(404); return res.end(); }
    if (fp !== root && !fp.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    let st;
    try { st = fs.statSync(fp); } catch { res.writeHead(404); return res.end(); }
    if (st.isDirectory()) { res.writeHead(404); return res.end(); }
    const type = TYPES[path.extname(fp).slice(1).toLowerCase()] || 'application/octet-stream';
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (m) {
      const start = m[1] === '' ? st.size - Number(m[2]) : Number(m[1]), end = Math.min(m[1] !== '' && m[2] !== '' ? Number(m[2]) : st.size - 1, st.size - 1);
      if (!(start >= 0 && start <= end)) { res.writeHead(416, {'content-range': `bytes */${st.size}`}); return res.end(); }
      res.writeHead(206, {'content-type': type, 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${st.size}`, 'content-length': end - start + 1, 'cache-control': 'no-store'});
      return req.method === 'HEAD' ? res.end() : fs.createReadStream(fp, {start, end}).pipe(res);
    }
    res.writeHead(200, {'content-type': type, 'accept-ranges': 'bytes', 'content-length': st.size, 'cache-control': 'no-store'});
    return req.method === 'HEAD' ? res.end() : fs.createReadStream(fp).pipe(res);
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((r) => { server.closeAllConnections?.(); server.close(() => r()); })}));
  });
}

// in every document from its first line: the long animation frames (with their scripts), the long tasks, the paints
const OBSERVE = `(() => { if (window.__sb) return; const L = window.__sb = {origin: performance.timeOrigin, loaf: [], long: [], paint: []};
  const on = (type, f) => { try { new PerformanceObserver((l) => { for (const e of l.getEntries()) f(e); }).observe({type, buffered: true}); } catch {} };
  on('long-animation-frame', (e) => L.loaf.push({start: Math.round(e.startTime), ms: Math.round(e.duration), blocking: Math.round(e.blockingDuration),
    render: Math.round(e.renderStart ? e.startTime + e.duration - e.renderStart : 0), style: Math.round(e.styleAndLayoutStart ? e.startTime + e.duration - e.styleAndLayoutStart : 0),
    scripts: (e.scripts || []).map((s) => ({ms: Math.round(s.duration), compile: Math.round(Math.max(0, s.executionStart - s.startTime)), forced: Math.round(s.forcedStyleAndLayoutDuration || 0),
      what: (s.sourceURL || '').split('/').pop() + (s.sourceFunctionName ? ' ' + s.sourceFunctionName : '') + ' (' + (s.invokerType || '') + ' ' + String(s.invoker || '').slice(0, 60) + ')'}))
      .sort((a, b) => b.ms - a.ms).slice(0, 4)}));
  on('longtask', (e) => L.long.push([Math.round(e.startTime), Math.round(e.duration), e.name]));
  on('paint', (e) => L.paint.push([e.name, Math.round(e.startTime)]));
})();`;

// what the hero has done: polled during the load
const MILESTONES = `(() => { const h = window.hero, d = h?.frame?.contentDocument, f = d?.getElementById('dl-twelve-film'), u = h?.unbox, s = u?.state;
  return {now: performance.now(), dom: document.readyState, frame: d?.readyState ?? null, hero: Boolean(h), theater: Boolean(h?.theater), unbox: Boolean(u),
    box: h?.boxLog?.length ?? 0, film: f ? {rs: f.readyState, t: Math.round(f.currentTime * 1000) / 1000, paused: f.paused} : null,
    models: s ? {cloth: s.cloth?.at ?? null, seiya: s.seiya?.at ?? null, athena: s.athena?.error ? 'error: ' + s.athena.error : s.athena?.at ?? null} : null}; })()`;

// what the page runs for the pictures
const HELPER = `window.__sb2 = (() => {
  const H = window.hero, doc = () => H.frame.contentDocument, win = () => H.frame.contentWindow, film = () => doc().getElementById('dl-twelve-film');
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  return {
    async ready() {
      const t0 = performance.now();
      while (!(H.theater && H.unbox && film()?.readyState >= 3)) { if (performance.now() - t0 > 60000) throw new Error('the hero did not come up in 60 s'); await new Promise(r => setTimeout(r, 200)); }
      film().pause();
      const stage = doc().getElementById('sphere-stage').getBoundingClientRect();
      win().scrollBy(0, Math.round(stage.top + stage.height / 2 - win().innerHeight / 2));
      document.querySelector('.ab').style.visibility = 'hidden';
      await frames(4);
      return {stage: [stage.width, stage.height]};
    },
    async seek(t, settle = 8) {
      const f = film(); f.pause();
      if (Math.abs(f.currentTime - t) > 1e-4) { f.currentTime = t; await new Promise(r => f.addEventListener('seeked', r, {once: true})); }
      await frames(settle);
      const b = H.boxLog.at(-1);
      return {t: f.currentTime, box: b ? {t: b.t, reason: b.reason, draws: b.draws, w: b.w, h: b.h} : null};
    },
  };
})(); 'ok'`;

/** A CPU profile's self time by file and by function (ms), over its whole span. */
export function cpuBy(profile) {
  const byId = new Map(profile.nodes.map((n) => [n.id, n])), self = new Map();
  const { samples = [], timeDeltas = [] } = profile;
  for (let i = 0; i < samples.length; i++) self.set(samples[i], (self.get(samples[i]) || 0) + (timeDeltas[i + 1] ?? timeDeltas[i] ?? 0));
  const file = new Map(), fn = new Map();
  for (const [id, us] of self) {
    const c = byId.get(id)?.callFrame || {}, f = c.url ? c.url.split('/').pop().split('?')[0] : c.functionName || '(?)';
    file.set(f, (file.get(f) || 0) + us);
    const k = `${f} ${c.functionName || '(anonymous)'}:${(c.lineNumber ?? -1) + 1}`;
    fn.set(k, (fn.get(k) || 0) + us);
  }
  const top = (m, n) => [...m].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, us]) => [k, Math.round(us / 100) / 10]);
  return {totalMs: Math.round([...self.values()].reduce((a, b) => a + b, 0) / 1000), byFile: top(file, 14), byFunction: top(fn, 24)};
}

async function main() {
  if (!CHROME) throw new Error('no Chrome here');
  for (const d of ['load', 'at']) fs.mkdirSync(path.join(OUT, d), {recursive: true});
  const d = await door(UI);
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'storyboard-chrome-'));
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
  const results = {at: new Date().toISOString(), chrome: CHROME, host: os.hostname(), loadavg: os.loadavg(), cpus: os.cpus().length, size: [W, H], page: PAGE, loadSeconds: LOAD_S};
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
    const wait = new Map(), events = [], errors = [], refused = [], net = new Map(), shots = [];
    let casting = false, lastKept = -1e9, docReq = null;
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    const tags = `${NEST}/nest/ref/mint/seiya-tags`;
    ws.onmessage = (m) => {
      const x = JSON.parse(m.data), p = x.params;
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const {url, method} = p.request, ok = url.startsWith(d.origin + '/') || (method === 'GET' && url === tags) || url.startsWith('data:');
        if (ok) send('Fetch.continueRequest', {requestId: p.requestId}, x.sessionId).catch(() => {});
        else { refused.push(url.slice(0, 120)); send('Fetch.failRequest', {requestId: p.requestId, errorReason: 'BlockedByClient'}, x.sessionId).catch(() => {}); }
        return;
      }
      if (x.method === 'Page.screencastFrame') {
        send('Page.screencastFrameAck', {sessionId: p.sessionId}, x.sessionId).catch(() => {});
        const wall = p.metadata.timestamp * 1000;
        if (casting && wall - lastKept >= 100) { lastKept = wall; shots.push({wall, data: p.data}); }
        return;
      }
      if (x.method === 'Network.requestWillBeSent') {
        const r = net.get(p.requestId) || {url: p.request.url, ranges: 0};
        if (!r.asked) { r.asked = p.timestamp; r.wall = p.wallTime; }
        if (p.type === 'Document' && /hero-ab\.html/.test(p.request.url) && !docReq) docReq = {ts: p.timestamp, wall: p.wallTime};
        net.set(p.requestId, r);
      }
      if (x.method === 'Network.responseReceived') { const r = net.get(p.requestId); if (r) { r.status = p.response.status; r.type = p.type; r.first = p.timestamp; } }
      if (x.method === 'Network.dataReceived') { const r = net.get(p.requestId); if (r) r.got = (r.got || 0) + (p.encodedDataLength || p.dataLength || 0); }
      if (x.method === 'Network.loadingFinished') { const r = net.get(p.requestId); if (r) { r.done = p.timestamp; r.bytes = p.encodedDataLength; } }
      if (x.method === 'Network.loadingFailed') { const r = net.get(p.requestId); if (r) { r.done = p.timestamp; r.failed = p.errorText; } }
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(p?.exceptionDetails?.exception?.description || p?.exceptionDetails?.text).slice(0, 300));
      if (x.method === 'Runtime.consoleAPICalled' && (p.type === 'error' || p.type === 'warning')) errors.push(`console.${p.type}: ` + p.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300));
      events.push(x.method);
    };
    const t = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: W, height: H});
    const s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable', 'Network.enable', 'Performance.enable']) await send(m, {}, s);
    await send('Network.setCacheDisabled', {cacheDisabled: true}, s);
    await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: 1, mobile: false}, s);
    await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s);
    // the renderer of the door's origin first (a blank page, as a new tab), so the profiler and the observers ride the same process into the page
    await send('Page.navigate', {url: `${d.origin}/__blank`}, s);
    await sleep(800);
    await send('Page.addScriptToEvaluateOnNewDocument', {source: OBSERVE}, s);
    await send('Profiler.enable', {}, s);
    await send('Profiler.setSamplingInterval', {interval: 1000}, s);
    await send('Profiler.start', {}, s);
    casting = true;
    await send('Page.startScreencast', {format: 'jpeg', quality: 60, maxWidth: W, maxHeight: H, everyNthFrame: 1}, s);
    const ev = async (expression) => {
      const r = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true}, s);
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 400));
      return r.result.value;
    };
    const wall0 = Date.now();
    const nav = await send('Page.navigate', {url: `${d.origin}${PAGE}`}, s);
    if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    // the milestones, polled until --load seconds after the navigation
    const polls = [];
    while (Date.now() - wall0 < LOAD_S * 1000) {
      const asked = Date.now();
      try { const m = await ev(MILESTONES); polls.push({asked: asked - wall0, ...m}); } catch (e) { polls.push({asked: asked - wall0, error: String(e.message).slice(0, 120)}); }
      await sleep(100);
    }
    casting = false;
    await send('Page.stopScreencast', {}, s).catch(() => {});
    const {profile} = await send('Profiler.stop', {}, s);
    const seen = await ev(`({top: window.__sb, frame: window.hero?.frame?.contentWindow?.__sb ?? null})`);
    const origin = seen.top?.origin ?? wall0, ms = (wall) => Math.round(wall - origin);
    // the frames, in ms since the navigation's start (the page's own timeOrigin)
    results.load = {navStart: origin, frames: []};
    for (const f of shots.filter((x) => x.wall >= origin)) { const at = ms(f.wall), file = `load/${String(Math.max(0, at)).padStart(6, '0')}.jpg`; fs.writeFileSync(path.join(OUT, file), Buffer.from(f.data, 'base64')); results.load.frames.push({ms: at, file}); }
    // the files: asked and done in ms since the navigation (the document's request maps CDP's monotonic clock onto the wall)
    const toMs = (ts) => docReq && ts ? Math.round((docReq.wall + (ts - docReq.ts)) * 1000 - origin) : null;
    results.load.files = [...net.values()].filter((r) => docReq && r.asked >= docReq.ts).map((r) => ({file: r.url.replace(d.origin, '').replace(/^\/intro\//, '').slice(0, 90), status: r.status ?? null, type: r.type ?? null,
      kb: Math.round((r.bytes ?? r.got ?? 0) / 102.4) / 10, asked: toMs(r.asked), first: toMs(r.first), done: toMs(r.done), failed: r.failed ?? undefined}))
      .sort((a, b) => (a.asked ?? 1e9) - (b.asked ?? 1e9));
    results.load.paint = {top: seen.top?.paint ?? [], frame: (seen.frame?.paint ?? []).map(([n, t]) => [n, Math.round(t + (seen.frame.origin - origin))])};
    results.load.loaf = (seen.top?.loaf ?? []).filter((e) => e.ms >= 50);
    results.load.loafFrame = (seen.frame?.loaf ?? []).filter((e) => e.ms >= 50).map((e) => ({...e, start: Math.round(e.start + (seen.frame.origin - origin))}));
    results.load.long = seen.top?.long ?? [];
    // the milestones: the first poll each was true at (in the page's ms), and the polls' gaps (the main thread held)
    const first = (pred) => { const p = polls.find((x) => !x.error && pred(x)); return p ? Math.round(p.now) : null; };
    results.load.milestones = {
      domReady: first((x) => x.dom !== 'loading'), frameReady: first((x) => x.frame === 'complete'), hero: first((x) => x.hero), theater: first((x) => x.theater),
      filmFirstFrame: first((x) => x.film?.rs >= 2), filmPlaying: first((x) => x.film && !x.film.paused && x.film.t > 0), unbox: first((x) => x.unbox), firstBoxDraw: first((x) => x.box > 0),
      models: polls.filter((x) => x.models).reduce((acc, x) => { for (const [k, v] of Object.entries(x.models)) { const last = acc[k]?.at(-1); if (!last || last[1] !== v) (acc[k] ||= []).push([Math.round(x.now), v]); } return acc; }, {}),
      filmAtEnd: polls.at(-1)?.film ?? null,
    };
    const gaps = []; for (let i = 1; i < polls.length; i++) if (!polls[i].error && !polls[i - 1].error) { const g = polls[i].now - polls[i - 1].now; if (g > 250) gaps.push([Math.round(polls[i - 1].now), Math.round(g)]); }
    results.load.held = gaps;
    results.load.cpu = profile ? cpuBy(profile) : null;
    console.log(`load: ${results.load.frames.length} frames kept, ${results.load.files.length} requests; milestones ${JSON.stringify(results.load.milestones)}`);
    console.log(`  long frames (>= 50 ms): ${results.load.loaf.length}, the longest ${JSON.stringify(results.load.loaf.slice().sort((a, b) => b.ms - a.ms).slice(0, 3))}`);
    console.log(`  cpu by file: ${JSON.stringify(results.load.cpu?.byFile?.slice(0, 8))}`);

    // pass 2: the hero at the film's seconds
    await ev(HELPER);
    results.ready = await ev('window.__sb2.ready()');
    const shot = async () => (await send('Page.captureScreenshot', {format: 'jpeg', quality: 85, captureBeyondViewport: false}, s)).data;
    results.seconds = [];
    for (const sec of SECONDS) {
      const at = await ev(`window.__sb2.seek(${sec}, 8)`);
      const file = `at/${sec.toFixed(3)}.jpg`;
      fs.writeFileSync(path.join(OUT, file), Buffer.from(await shot(), 'base64'));
      results.seconds.push({second: sec, film: at.t, box: at.box, file});
    }
    console.log(`  ${results.seconds.length} pictures at the film's seconds; the box at 32.6 s: ${JSON.stringify(results.seconds.find((x) => x.second === 32.6)?.box)}`);
    results.errors = errors.slice(0, 40);
    results.refused = [...new Set(refused)];
    if (errors.length) console.log('page errors: ' + errors.slice(0, 6).join(' | '));
    if (refused.length) console.log('refused: ' + results.refused.join(', '));
  } finally {
    fs.writeFileSync(path.join(OUT, 'storyboard.json'), JSON.stringify(results, null, 1));
    console.log(`wrote ${path.join(OUT, 'storyboard.json')}`);
    process.off('SIGTERM', onSig); process.off('SIGINT', onSig);
    await end();
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

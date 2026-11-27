#!/usr/bin/env node
// anti-satellites.proof.mjs: DOLBAR'S ATTACK (anti-satellites.js: his three acts on the film's beats, lab/dolbar-beats.js) proved on the hero
// itself (hero-ab.html, with its two lines), in a muted headless Chrome over CDP, off every screen.
//   node anti-satellites.proof.mjs --out <dir> [--size 1440x900] [--scale 1] [--chrome <path>] [--clip 4.3:11.2:2] [--root <ui dir>] [--no-pictures]
//   (--scale 2: his MacBook's pixels; --root: serve another tree's embertide-app/ui, the code before a change, for its cost)
// - Pictures at the film's beats (the film paused there): before the orb, the orb, the mass, the cut back to him, the focus lines, the charge
//   at its height, the release, the strike crossing, the landing, the streaks, the hand of light, the flash, the sweep, the blow gathering
//   itself, the block, his tag, the last frame before the impact, the impact, the shatter.
// - A clip (--clip from:to:step): every step-th film frame of the span, seeked one by one, as JPEGs for ffmpeg to make a film of.
// - THE FRAME TIME: the film played through the window (a second before the orb to 0.55 s after the impact) with the layer and again without
//   it (its destroy()), twice each, alternating: the page's frames (requestAnimationFrame in the hero's document: intervals over 25 and 50 ms,
//   the 95th percentile, the longest), long animation frames (PerformanceObserver), CDP Performance.getMetrics (script, task, layout, style),
//   the layer's own draws and script milliseconds, and THE GPU: a Chrome trace of each pass (toplevel, gpu, viz), the GPU process's main and
//   viz compositor threads' busy milliseconds a page frame (their top-level tasks summed); then playing 20 to 24 s (outside its window) and
//   paused 3 s inside it (at rest).
// The door: a tree's embertide-app/ui at / (the page at /intro/dyson-society/lab/hero-ab.html, as aiolos serves it), byte ranges (206), GET
// only. Every other request is refused and listed (his tags' read too: the page takes its rev-1 tags; nothing touches a Nest or his door).
// Writes <out>/anti-satellites.proof.json and PNGs (they hold the film's frames: keep them out of git).
// COST: one Chrome (about 500 MB) for about three minutes; run it niced, under a time limit.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {FPS, frameTime, RISE, ORB, RELEASE, LANDED, BLOCK, PEAK, WIND, ANTI} from './anti-satellites.js';
import {BEATS} from './dolbar-beats.js';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UI_HERE = path.resolve(HERE, '../../..');
const PAGE = '/intro/dyson-society/lab/hero-ab.html?v=film&paywall=off';   // a minter's view: the lab stops at the wall as a visitor's page does
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', path.join(os.tmpdir(), 'anti-satellites-proof')));
const [W, H] = opt('--size', '1440x900').split('x').map(Number), SCALE = Number(opt('--scale', '1')) || 1;
const CLIP = opt('--clip', null)?.split(':').map(Number) ?? null;
const UI = path.resolve(opt('--root', UI_HERE)), PICTURES = !args.includes('--no-pictures');
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')];
const CHROME = opt('--chrome', CHROMES.find((c) => fs.existsSync(c)));
const TYPES = {html: 'text/html; charset=utf-8', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg',
  webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', m4a: 'audio/mp4', woff2: 'font/woff2', glb: 'model/gltf-binary'};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const r3 = (t) => Math.round(t * 1000) / 1000;
// a picture's second, to the millisecond and inside its frame: the browser shows the frame whose time is at or before the second, so a
// second rounded down from a frame's own time shows the frame before it (4.471 s is frame 133's, purple; 4.472 s is 134's, the flood)
const inFrame = (t) => Math.ceil(t * 1000 + 0.5) / 1000;

// the moments to picture: the film's beats (lab/dolbar-beats.js) and his three acts
const SECONDS = [
  ['before the orb (the coup de grace)', frameTime(ORB - 2)], ['the orb lit in his hand: they set off', frameTime(ORB)], ['the mass at his border', 5.5],
  ['the cut back to him, still charging', frameTime(192)], ['the focus lines on his palm', 7.8], ['the charge at its height', frameTime(BEATS.peak)],
  ['THE RELEASE: the strike, all at once', frameTime(RELEASE)], ['the strike crossing', frameTime(RELEASE + 1)], ['the landing on the shield', frameTime(LANDED)],
  ['the streaks: the blow driven in', frameTime(BEATS.streaks[0])], ['the hand of light', frameTime(BEATS.hand)], ['the flash', frameTime(BEATS.flash)],
  ['the sweep over Seiya', frameTime(BEATS.sweep)], ['the blow gathering itself', frameTime(BLOCK - 1)], ['THE BLOCK: the last blow lands', frameTime(BLOCK)],
  ['his tag: the peak', frameTime(PEAK)], ['the last frame before the impact', frameTime(ANTI.impact - 1)], ['the impact: gone, the shield shatters', frameTime(ANTI.impact)],
  ['the shatter', 11.2],
].map(([name, t]) => [name, inFrame(t)]);

function door(root) {
  root = fs.realpathSync(root);
  const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
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

// what the page runs for the proof
const HELPER = `window.__anti = (() => {
  const H = window.hero, doc = () => H.frame.contentDocument, win = () => H.frame.contentWindow, film = () => doc().getElementById('dl-twelve-film');
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : win().requestAnimationFrame(f)); win().requestAnimationFrame(f); });
  const layer = () => doc().getElementById('hero-anti-satellites');
  let anti = null;
  // the long animation frames, in both documents (the hero's iframe and the panel's page)
  const loaf = {top: [], hero: []};
  const watch = (w, list) => { try { new w.PerformanceObserver((l) => { for (const e of l.getEntries()) list.push({start: e.startTime, duration: e.duration, blocking: e.blockingDuration ?? null}); }).observe({type: 'long-animation-frame', buffered: false}); return true; } catch { return false; } };
  return {
    async ready() {
      const t0 = performance.now();
      // what stood when it did not come up: the page's mount, its parts, the film's load (a failed wait says which)
      // (own: the frame's own handle, window.hero in the page, beside the panel's: a page that mounted while the panel holds none says the panel never attached)
      const seen = () => { let f = null, o = null; try { f = film(); o = win().hero ?? null; } catch {} return JSON.stringify({page: Boolean(H.page), mounts: H.page?.mounts ?? null, theater: Boolean(H.theater), kick: Boolean(H.kick), unbox: Boolean(H.unbox),
        own: o ? {mounts: o.mounts ?? null, theater: Boolean(o.theater), kick: Boolean(o.kick), unbox: Boolean(o.unbox)} : null,
        layer: Boolean(f && layer()), anti: Boolean(f && layer()?.antiSatellites), film: f ? {readyState: f.readyState, networkState: f.networkState, t: f.currentTime, paused: f.paused, preload: f.preload, error: f.error?.code ?? null} : null}); };
      while (!(H.theater && H.kick && film()?.readyState >= 3 && layer()?.antiSatellites)) { if (performance.now() - t0 > 60000) throw new Error('the hero did not come up in 60 s: ' + seen()); await new Promise(r => setTimeout(r, 200)); }
      anti = layer().antiSatellites;
      const stage = doc().getElementById('sphere-stage').getBoundingClientRect();
      win().scrollBy(0, Math.round(stage.top + stage.height / 2 - win().innerHeight / 2));
      document.querySelector('.ab').style.visibility = 'hidden';
      await frames(4);
      const kids = [...doc().getElementById('sphere-stage').children].map(c => c.id || c.tagName.toLowerCase());
      return {stage: [stage.width, stage.height], order: kids, loaf: {top: watch(window, loaf.top), hero: watch(win(), loaf.hero)}, stats: anti.stats};
    },
    stats() { return anti ? anti.stats : null; },
    unmount() { anti?.destroy(); anti = null; return !layer(); },
    async seek(t, settle = 4) {
      const f = film(); f.pause();
      if (Math.abs(f.currentTime - t) > 1e-4) { f.currentTime = t; await new Promise(r => f.addEventListener('seeked', r, {once: true})); }
      // the page's sphere, paused, may keep the frame it drew before the seek (its draw waits on a presented frame): its own redraw, so the
      // picture's faces are the second's (the satellites draw on the seek themselves)
      await frames(2); win().genesisSphere?.redraw?.();
      await frames(settle);
      return {t: f.currentTime, charge: anti ? anti.at(f.currentTime) : null, stats: anti ? anti.stats : null, worlds: (H.kick?.worlds ?? []).length};
    },
    async play(from, to) {
      await this.seek(from, 3);
      const f = film(), w = win(), a = anti ? {...anti.stats} : null, l0 = {top: loaf.top.length, hero: loaf.hero.length};
      const gaps = [];
      let prev = null, on = true;
      const tick = (now) => { if (prev !== null) gaps.push(now - prev); prev = now; if (on) w.requestAnimationFrame(tick); };
      w.requestAnimationFrame(tick);
      const t0 = performance.now();
      await f.play();
      while (f.currentTime < to && !f.paused) await new Promise(r => setTimeout(r, 20));
      f.pause(); on = false;
      await frames(2);
      const b = anti ? {...anti.stats} : null, sorted = [...gaps].sort((x, y) => x - y), q = (p) => sorted[Math.min(sorted.length - 1, Math.floor(p * sorted.length))];
      const long = (list, n0) => { const e = list.slice(n0); return {count: e.length, ms: Math.round(e.reduce((s, x) => s + x.duration, 0)), longest: Math.round(Math.max(0, ...e.map(x => x.duration)))}; };
      return {from, to: f.currentTime, wall_s: (performance.now() - t0) / 1000, frames: gaps.length, over25: gaps.filter(g => g > 25).length, over50: gaps.filter(g => g > 50).length,
        p50: q(0.5), p95: q(0.95), longest: sorted.at(-1) ?? null, loafTop: long(loaf.top, l0.top), loafHero: long(loaf.hero, l0.hero),
        anti: b ? {draws: b.draws - a.draws, frames: b.frames - a.frames, ms: b.drawMs - a.drawMs, max: b.drawMax, waiting: b.waiting, pixels: b.pixels} : null};
    },
    async rest(ms) {
      const a = anti ? {...anti.stats} : null;
      await new Promise(r => setTimeout(r, ms));
      const b = anti ? {...anti.stats} : null;
      return {ms, draws: b.draws - a.draws, frames: b.frames - a.frames, waiting: b.waiting, shown: b.shown, pixels: b.pixels};
    },
  };
})(); 'ok'`;

async function main() {
  if (!CHROME) throw new Error('no Chrome here');
  fs.mkdirSync(path.join(OUT, 'clip'), {recursive: true});
  const d = await door(UI);
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'anti-satellites-chrome-'));
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
  const results = {at: new Date().toISOString(), chrome: CHROME, host: os.hostname(), load: os.loadavg(), size: [W, H], scale: SCALE, window: {rise: RISE, from_s: r3(frameTime(RISE)), impact: ANTI.impact, impact_s: r3(frameTime(ANTI.impact)), fps: FPS}, seconds: SECONDS};
  const errors = [], refused = [];   // the page's own errors and the door's refusals: kept on a failed run too, where they say why
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
    const wait = new Map(), events = [], trace = {events: [], done: null};
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    ws.onmessage = (m) => {
      const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const {url} = x.params.request, ok = url.startsWith(d.origin + '/') || url.startsWith('data:') || url.startsWith('blob:');
        if (ok) send('Fetch.continueRequest', {requestId: x.params.requestId}, x.sessionId).catch(() => {});
        else { refused.push(url.slice(0, 120)); send('Fetch.failRequest', {requestId: x.params.requestId, errorReason: 'BlockedByClient'}, x.sessionId).catch(() => {}); }
        return;
      }
      if (x.method === 'Tracing.dataCollected') { for (const e of x.params.value) trace.events.push(e); return; }
      if (x.method === 'Tracing.tracingComplete') { trace.done?.(); return; }
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 300));
      if (x.method === 'Runtime.consoleAPICalled' && x.params.type === 'error') errors.push('console: ' + x.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300));
      events.push(x.method);
    };
    const t = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: W, height: H});
    const s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable', 'Performance.enable']) await send(m, {}, s);
    await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: SCALE, mobile: false}, s);
    await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s);
    const loaded = new Promise((r) => { const iv = setInterval(() => { if (events.includes('Page.loadEventFired')) { clearInterval(iv); r(); } }, 50); });
    const nav = await send('Page.navigate', {url: `${d.origin}${PAGE}`}, s);
    if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    await Promise.race([loaded, sleep(20000)]);
    const ev = async (expression) => {
      const r = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true}, s);
      if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 400));
      return r.result.value;
    };
    const until = async (expr, ms = 30000) => { const t0 = Date.now(); while (!(await ev(expr))) { if (Date.now() - t0 > ms) throw new Error(`waited ${ms} ms for ${expr}`); await sleep(200); } };
    await until('Boolean(window.hero)');
    await ev(HELPER);
    results.ready = await ev('window.__anti.ready()');
    console.log(`stage ${results.ready.stage.map(Math.round).join('x')}; the layers ${JSON.stringify(results.ready.order)}; long animation frames observed: ${JSON.stringify(results.ready.loaf)}`);
    const shot = async (format = 'png') => (await send('Page.captureScreenshot', {format, quality: format === 'jpeg' ? 88 : undefined, captureBeyondViewport: false}, s)).data;
    const save = (rel, b64) => { const fp = path.join(OUT, rel); fs.writeFileSync(fp, Buffer.from(b64, 'base64')); return fp; };

    results.pictures = [];
    for (const [name, sec] of PICTURES ? SECONDS : []) {
      const at = await ev(`window.__anti.seek(${sec}, 6)`);
      const fp = save(`anti-${sec.toFixed(3)}s.png`, await shot());
      const c = at.charge;
      results.pictures.push({name, second: at.t, file: path.basename(fp), worlds: at.worlds, charge: c && {on: c.on, frame: c.frame, level: c.level, gather: c.gather, align: c.align, woken: c.woken, signals: c.signals.length}, last: at.stats?.last, pixels: at.stats?.pixels});
      console.log(`  ${name}, ${at.t.toFixed(3)} s: ${c?.on ? `level ${c.level.toFixed(2)} gather ${c.gather.toFixed(2)} align ${c.align.toFixed(2)} signals ${c.signals.length}` : 'off'}; drawn ${JSON.stringify(at.stats?.last)}; ${at.worlds} worlds`);
    }
    if (CLIP) {
      const [a, b, step = 1] = CLIP;
      results.clip = {from: a, to: b, step, frames: 0};
      for (let n = Math.ceil(a * FPS); frameTime(n) < b; n += step) {
        await ev(`window.__anti.seek(${frameTime(n)}, 2)`);
        save(`clip/f${String(results.clip.frames).padStart(4, '0')}.jpg`, await shot('jpeg'));
        results.clip.frames++;
      }
      console.log(`  clip: ${results.clip.frames} frames from ${a} to ${b} s, every ${step}`);
    }

    const metrics = async () => Object.fromEntries((await send('Performance.getMetrics', {}, s)).metrics.map((m) => [m.name, m.value]));
    const KEYS = ['RecalcStyleCount', 'RecalcStyleDuration', 'LayoutCount', 'LayoutDuration', 'ScriptDuration', 'TaskDuration'];
    // THE GPU: a trace of the pass (browser-wide), the GPU process's main and viz compositor threads' top-level tasks summed, a page frame
    const gpuOf = (list, frames) => {
      const proc = new Map(), thread = new Map();
      for (const e of list) if (e.ph === 'M') { if (e.name === 'process_name') proc.set(e.pid, e.args?.name); if (e.name === 'thread_name') thread.set(`${e.pid}:${e.tid}`, e.args?.name); }
      const busy = {};
      for (const e of list) {
        if (e.ph !== 'X' || !(e.dur > 0) || !String(e.cat).split(',').includes('toplevel')) continue;
        const p = proc.get(e.pid), th = thread.get(`${e.pid}:${e.tid}`);
        const key = p === 'GPU Process' ? `gpu ${th}` : p === 'Renderer' && th === 'CrRendererMain' ? 'renderer main' : p === 'Renderer' && th === 'Compositor' ? 'renderer compositor' : null;
        if (key) busy[key] = (busy[key] ?? 0) + e.dur / 1000;
      }
      const per = Object.fromEntries(Object.entries(busy).map(([k, v]) => [k, Math.round((v / Math.max(1, frames)) * 1000) / 1000]));
      const gpu = Object.entries(per).filter(([k]) => k.startsWith('gpu ')).reduce((a, [, v]) => a + v, 0);
      return {msPerFrame: per, gpuMsPerFrame: Math.round(gpu * 1000) / 1000};
    };
    const traced = async (f) => {
      trace.events.length = 0;
      await send('Tracing.start', {traceConfig: {recordMode: 'recordContinuously', includedCategories: ['toplevel', 'gpu', 'viz', '__metadata']}, transferMode: 'ReportEvents'});
      const out = await f();
      const done = new Promise((r) => { trace.done = r; });
      await send('Tracing.end');
      await Promise.race([done, sleep(20000)]);
      return {...out, gpu: gpuOf(trace.events, out.frames)};
    };
    const windowed = async (from, to) => traced(async () => {
      const a = await metrics(), w = await ev(`window.__anti.play(${from}, ${to})`), b = await metrics();
      return {...w, metrics: Object.fromEntries(KEYS.map((k) => [k, Math.round((b[k] - a[k]) * (k.endsWith('Duration') ? 1e6 : 1)) / (k.endsWith('Duration') ? 1e3 : 1)]))};   // durations in ms
    });
    const [A, B] = [frameTime(ORB) - 1, frameTime(ANTI.impact) + 0.55];
    results.cost = {with: [], without: []};
    results.cost.with.push(await windowed(A, B));
    results.cost.outside = await windowed(20.0, 24.0);
    await ev('window.__anti.seek(7.75, 3)');
    results.cost.rest = await ev('window.__anti.rest(3000)');
    results.cost.with.push(await windowed(A, B));
    results.cost.unmounted = await ev('window.__anti.unmount()');
    results.cost.without.push(await windowed(A, B));
    results.cost.without.push(await windowed(A, B));
    for (const [k, v] of Object.entries(results.cost)) console.log(`  ${k}: ${JSON.stringify(v)}`);
  } finally {
    results.errors = errors;
    results.refused = [...new Set(refused)];
    if (errors.length) console.log('page errors: ' + errors.join(' | '));
    if (refused.length) console.log('refused: ' + results.refused.join(', '));
    fs.writeFileSync(path.join(OUT, 'anti-satellites.proof.json'), JSON.stringify(results, null, 1));
    console.log(`wrote ${path.join(OUT, 'anti-satellites.proof.json')}`);
    process.off('SIGTERM', onSig); process.off('SIGINT', onSig);
    await end();
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

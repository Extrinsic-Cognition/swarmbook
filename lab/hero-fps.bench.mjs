#!/usr/bin/env node
// hero-fps.bench.mjs: WHERE THE HERO'S FRAMES GO, measured in a muted headless Chrome over CDP (the scaffolding of app/dl-twelve.proof.mjs).
// His Oct 21 2026 WEST: "anyhthinh to increase fps you can do?". The served mint page (app/warm.html?debug=off) plays from its start with the
// sound tapped on at --at seconds, as his finger does; through each WINDOW of the film (seconds of the picture) this reads the screen's frames
// (a requestAnimationFrame of its own, installed before the page: their deltas, and how many ran past 20, 34 and 50 ms), the film's own count
// of frames presented and dropped (getVideoPlaybackQuality), the long tasks, the theater's and the box's last draw (window.hero.state()), the
// canvases on the page and their pixels, and a CPU profile of the window (Profiler.start/stop at 0.5 ms), summed by function: self time, and
// inclusive time for this page's own functions (a sample counts once for every function on its stack).
//   nice -n 19 node lab/hero-fps.bench.mjs [--url http://127.0.0.1:9059/intro/dyson-society/app/warm.html?debug=off] [--size 1000x1000] [--dsf 2]
//     [--at 2] [--windows rest,fold,...] [--out <json>] [--shot <dir>: a picture at the end of each window] [--chrome <path>]
// The windows are the film's moments (mint-arrow-of-justice-timeline, mint-strike-storyboard): rest (2 to 6 s), fold (29.5 to 33), inversion
// (45 to 52), unboxing (58 to 66), birth (77.5 to 81), swarm (90 to 96), strike (100 to 107), birds (107 to 113), pull (118 to 121.5) and
// arrow (128 to 135); grace (115.4 to 118.1, the vessel's three rungs). From 120.65 s the page freezes on the drawn arrow while the mint is open
// (dl-paywall.js DRAWN_FRAME): the windows past it need ?paywall=off in --url (the house's own doors only). Exit 0 when it ran, 2 when it could not.
// Requests leave only to the page's own origin; it ends everything it started.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : fallback; };
const URL_ = opt('--url', 'http://127.0.0.1:9059/intro/dyson-society/app/warm.html?debug=off'), AT = Number(opt('--at', '2'));
const [W, H] = opt('--size', '1000x1000').split('x').map(Number), DSF = Number(opt('--dsf', '2'));
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  '/Applications/Chromium.app/Contents/MacOS/Chromium', path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')];
const CHROME = opt('--chrome', CHROMES.find(c => fs.existsSync(c)));
const ALL = {rest: [2, 6], fold: [29.5, 33], inversion: [45, 52], unboxing: [58, 66], birth: [77.5, 81], swarm: [90, 96], strike: [100, 107], birds: [107, 113], grace: [115.4, 118.1], pull: [118, 121.5], arrow: [128, 135]};
const WINDOWS = opt('--windows', Object.keys(ALL).join(',')).split(',').filter(k => ALL[k]).map(k => ({name: k, from: ALL[k][0], to: ALL[k][1]}));
const OUT = opt('--out', null), SHOT = opt('--shot', null);
const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const stat = (xs) => { const s = [...xs].sort((a, b) => a - b), at = p => s[Math.min(s.length - 1, Math.floor(p * s.length))]; return s.length ? {n: s.length, min: +s[0].toFixed(2), median: +at(.5).toFixed(2), p95: +at(.95).toFixed(2), max: +s[s.length - 1].toFixed(2)} : null; };

// before the page: the screen's frames and the long tasks, counted from the first script on
const INSTALL = `(() => { const S = window.__fps = {raf: [], long: [], longMs: 0, doubles: 0, lastDraws: null};
  // the screen's frames, and the frames in which the sphere drew twice (one draw a frame is the law: warm-sphere.js tick)
  const loop = (now) => { S.raf.push(now); const d = window.genesisSphere?.getViewState?.().draws; if (Number.isFinite(d)) { if (S.lastDraws !== null && d - S.lastDraws >= 2) S.doubles++; S.lastDraws = d; } requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  try { new PerformanceObserver((list) => { for (const e of list.getEntries()) { S.long.push([e.startTime, e.duration]); S.longMs += e.duration; } }).observe({type: 'longtask', buffered: true}); } catch {} })()`;
const FILM = `document.getElementById('dl-twelve-film')`;
const READ = `(() => { const film = ${FILM}; const q = film?.getVideoPlaybackQuality?.(); const S = window.__fps;
  return JSON.stringify({t: film ? film.currentTime : null, paused: film?.paused, now: performance.now(), total: q?.totalVideoFrames ?? null, dropped: q?.droppedVideoFrames ?? null,
    rafN: S.raf.length, longN: S.long.length, longMs: S.longMs, doubles: S.doubles, hero: window.hero ? window.hero.state() : null, sphere: window.genesisSphere?.getViewState?.() ?? null}); })()`;
// the screen's frames since index i: their deltas and how many ran long
const FRAMES = (i) => `(() => { const r = window.__fps.raf.slice(${i}); const d = []; for (let k = 1; k < r.length; k++) d.push(r[k] - r[k - 1]);
  return JSON.stringify({deltas: d.map(x => +x.toFixed(2)), over20: d.filter(x => x > 20).length, over34: d.filter(x => x > 34).length, over50: d.filter(x => x > 50).length}); })()`;
const CANVASES = `JSON.stringify([...document.querySelectorAll('canvas')].map(c => { const s = getComputedStyle(c), b = c.getBoundingClientRect();
  return {id: c.id || c.className || c.tagName, w: c.width, h: c.height, css: [Math.round(b.width), Math.round(b.height)], shown: s.display !== 'none' && s.visibility !== 'hidden' && !c.hidden && Number(s.opacity) > 0 && b.width > 0,
    mpx: +(c.width * c.height / 1e6).toFixed(2)}; }))`;
const GPU = `(() => { const c = document.createElement('canvas'), gl = c.getContext('webgl2'); if (!gl) return '"no webgl2"'; const x = gl.getExtension('WEBGL_debug_renderer_info');
  return JSON.stringify({renderer: x ? gl.getParameter(x.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER), dpr: devicePixelRatio, inner: [innerWidth, innerHeight]}); })()`;
const TAP = `(() => { const b = document.querySelector('[data-twelve-sound]'); if (!b) return 'null'; const r = b.getBoundingClientRect();
  if (r.top < 0 || r.bottom > innerHeight) b.scrollIntoView({block: 'nearest', behavior: 'instant'}); const q = b.getBoundingClientRect(); return JSON.stringify({x: q.left + q.width / 2, y: q.top + q.height / 2}); })()`;

/** The profile summed by function: self time, and inclusive time for the page's own functions (one count a sample for each function on its stack). */
function summarize(profile) {
  const nodes = new Map(), parent = new Map();
  for (const n of profile.nodes) { nodes.set(n.id, n); for (const c of n.children ?? []) parent.set(c, n.id); }
  const key = (n) => { const f = n.callFrame, file = (f.url || '').split('?')[0].split('/').pop(); return file ? `${f.functionName || '(anonymous)'} ${file}:${f.lineNumber + 1}` : (f.functionName || '(anonymous)'); };
  const self = new Map(), incl = new Map(); let total = 0;
  const own = (n) => /dyson-society|three\.module/.test(n.callFrame.url || '');
  profile.samples.forEach((id, i) => {
    const dt = (profile.timeDeltas[i] || 0) / 1000; total += dt;
    const n = nodes.get(id); if (!n) return;
    const k = key(n); self.set(k, (self.get(k) || 0) + dt);
    const seen = new Set();
    for (let p = id; p !== undefined; p = parent.get(p)) { const m = nodes.get(p); if (!m || !own(m)) continue; const kk = key(m); if (seen.has(kk)) continue; seen.add(kk); incl.set(kk, (incl.get(kk) || 0) + dt); }
  });
  const top = (m, n) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => [k, +v.toFixed(1)]);
  const special = Object.fromEntries(['(idle)', '(program)', '(garbage collector)', '(root)'].map(k => [k, +(self.get(k) || 0).toFixed(1)]));
  return {ms: +total.toFixed(0), special, self: top(self, 18), inclusive: top(incl, 18)};
}

async function main() {
  if (!CHROME) { console.error('no Chrome on this Mac'); return 2; }
  const origin = new URL(URL_).origin;
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'hero-fps-bench-'));
  const child = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, `--window-size=${W},${H}`, '--hide-scrollbars',
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions',
    '--disable-default-apps', '--disable-features=Translate,MediaRouter,OptimizationHints', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows', '--ignore-gpu-blocklist', '--enable-gpu-rasterization', 'about:blank'], {stdio: 'ignore'});
  let ws = null;
  const end = async () => {
    try { ws?.close(); } catch {}
    try { child.kill('SIGTERM'); } catch {}
    for (let i = 0; i < 30 && child.exitCode === null && child.signalCode === null; i++) await sleep(100);
    if (child.exitCode === null && child.signalCode === null) { try { child.kill('SIGKILL'); } catch {} await sleep(200); }
    try { fs.rmSync(dir, {recursive: true, force: true}); } catch {}
  };
  const bound = setTimeout(() => { console.error('300 s passed: ended'); end().then(() => process.exit(2)); }, 300000);
  const onSig = () => end().then(() => process.exit(2)); process.on('SIGTERM', onSig); process.on('SIGINT', onSig);
  const out = {url: URL_, size: `${W}x${H}@${DSF}`, chrome: CHROME, when: new Date().toISOString(), windows: []};
  try {
    let port = null;
    for (let i = 0; i < 400 && !port; i++) { await sleep(150); if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`); try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {} }
    if (!port) throw new Error('Chrome did not open its debugging port');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then(r => r.json());
    ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0; const wait = new Map(), errors = [];
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    ws.onmessage = m => {
      const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const url = x.params.request.url, ok = url.startsWith(origin + '/') || url.startsWith('data:') || url.startsWith('blob:');
        if (ok) send('Fetch.continueRequest', {requestId: x.params.requestId}, x.sessionId).catch(() => {});
        else send('Fetch.failRequest', {requestId: x.params.requestId, errorReason: 'BlockedByClient'}, x.sessionId).catch(() => {});
        return;
      }
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 200));
    };
    const t = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: W, height: H});
    const s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable', 'Profiler.enable']) await send(m, {}, s);
    await send('Profiler.setSamplingInterval', {interval: 500}, s);
    await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
    await send('Page.addScriptToEvaluateOnNewDocument', {source: INSTALL}, s);
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: DSF, mobile: false}, s);
    await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s); await send('Page.bringToFront', {}, s).catch(() => {});
    const read = async (expr) => JSON.parse((await send('Runtime.evaluate', {expression: expr, returnByValue: true}, s)).result?.value ?? 'null');
    const nav = await send('Page.navigate', {url: URL_}, s); if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    // the film playing past --at, then the tap for the sound where his finger would be
    let st = null;
    for (let i = 0; i < 600; i++) { await sleep(100); try { st = await read(READ); } catch { st = null; } if (st?.t >= AT && st.paused === false) break; }
    if (!(st?.t >= AT)) throw new Error(`the film did not play past ${AT} s within 60 s (it read ${st?.t})`);
    const tap = await read(TAP);
    if (tap) for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', {type, x: tap.x, y: tap.y, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: 1}, s);
    out.gpu = await read(GPU);
    out.soundOn = (await read(`JSON.stringify(window.dlTwelve?.state?.().soundOn ?? null)`));
    // the windows, in the film's order, each profiled from its first second to its last
    for (const w of WINDOWS.sort((a, b) => a.from - b.from)) {
      let a = null;
      for (let i = 0; i < 1500; i++) { a = await read(READ); if (a.t >= w.from) break; if (a.t > w.to) break; await sleep(60); }
      if (!(a?.t >= w.from) || a.t > w.to) { out.windows.push({name: w.name, skipped: `the film read ${a?.t}`}); continue; }
      await send('Profiler.start', {}, s);
      let b = a;
      while (b.t < w.to && b.t >= a.t - 1) { await sleep(80); b = await read(READ); }
      const {profile} = await send('Profiler.stop', {}, s);
      if (SHOT) { fs.mkdirSync(SHOT, {recursive: true}); const shot = await send('Page.captureScreenshot', {format: 'png'}, s); fs.writeFileSync(path.join(SHOT, `${w.name}.png`), Buffer.from(shot.data, 'base64')); }
      const frames = await read(FRAMES(a.rafN));
      const canvases = await read(CANVASES);
      const seconds = (b.now - a.now) / 1000, dropped = b.dropped - a.dropped, presented = b.total - a.total;
      out.windows.push({name: w.name, film: [+a.t.toFixed(2), +b.t.toFixed(2)], seconds: +seconds.toFixed(2),
        screen: {fps: +(frames.deltas.length / seconds).toFixed(1), delta_ms: stat(frames.deltas), over20: frames.over20, over34: frames.over34, over50: frames.over50},
        film_frames: {presented, dropped, per_s: +(presented / seconds).toFixed(1)},
        long_tasks: {n: b.longN - a.longN, ms: +(b.longMs - a.longMs).toFixed(0)},
        theater: b.hero?.last ? {cpuMs: b.hero.last.cpuMs, gpuUs: b.hero.last.gpuUs, w: b.hero.last.w, h: b.hero.last.h, m: b.hero.last.m, burst: b.hero.last.burst} : null,
        box: b.hero?.boxLast ? {cpuMs: b.hero.boxLast.cpuMs, gpuMs: b.hero.boxLast.gpuMs, calls: b.hero.boxLast.calls, triangles: b.hero.boxLast.triangles, w: b.hero.boxLast.w, h: b.hero.boxLast.h, mode: b.hero.boxLast.mode, reason: b.hero.boxLast.reason} : null,
        sphere: b.sphere ? {radius: b.sphere.radius, stageSide: b.sphere.stageSide, kernel: b.sphere.kernel, count: b.sphere.count, cosmos: b.sphere.cosmos,
          draws_per_s: Number.isFinite(b.sphere.draws) && Number.isFinite(a.sphere?.draws) ? +((b.sphere.draws - a.sphere.draws) / seconds).toFixed(1) : null, drawMs: b.sphere.drawMs ?? null,
          frames_drawn_twice: b.doubles - a.doubles} : null,
        canvases: canvases.filter(c => c.shown), profile: summarize(profile)});
      const last = out.windows.at(-1);
      console.error(`${w.name.padEnd(10)} ${last.film[0]}-${last.film[1]} s: screen ${last.screen.fps} fps (median ${last.screen.delta_ms?.median} ms, p95 ${last.screen.delta_ms?.p95}, >34 ms x${last.screen.over34}); sphere ${last.sphere?.draws_per_s ?? '?'} draws/s (${last.sphere?.frames_drawn_twice ?? '?'} frames drawn twice); film ${last.film_frames.per_s}/s, dropped ${dropped}; long tasks ${last.long_tasks.n} (${last.long_tasks.ms} ms); idle ${last.profile.special['(idle)']} of ${last.profile.ms} ms`);
    }
    out.errors = errors.slice(0, 8);
  } catch (e) { out.error = String(e?.message || e); }
  clearTimeout(bound); await end();
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  else console.log(JSON.stringify(out, null, 1));
  if (out.error) { console.error(out.error); return 2; }
  return 0;
}
main().then(code => process.exit(code));

#!/usr/bin/env node
// irradiance.proof.mjs: THE INVERSION OF THE MASK at the golden flash (irradiance.js, mounted by hero-ab.html at 45.445 s) proved on the hero
// itself, in a muted headless Chrome over CDP, off every screen.
//   node irradiance.proof.mjs --out <dir> [--size 1440x900] [--scale 1] [--chrome <path>] [--seconds 45.0,45.45,...]
// - Pictures at the film's seconds (the film paused there, the panel hidden, the stage in the middle of the window): before the flash, its
//   frame, the liquor rising, the burst, the vortex, the sun, the white rays, after the centaur's cut, and the red burst (11.2 s, untouched).
// - THE COST: the film played through the window (44.4 to 50.6 s) with the inversion and without it (its destroy()), twice each, alternating:
//   the page's frames (requestAnimationFrame in the hero's document: intervals over 25 and 50 ms, the 95th percentile, the longest), long
//   animation frames, CDP Performance.getMetrics, and the layer's own draws and script milliseconds (stats.drawMs); its plan's integration in
//   idle time (stats.readyMs); then 3 s paused inside the window (at rest: no draw, nothing waiting).
// The door: this tree's embertide-app/ui at / (lab/storyboard.proof.mjs door(): byte ranges, GET only); every other request is refused and
// listed (his tags' read too: the page takes its rev-1 tags). The page opens with ?paywall=off (a minter's view: the lab stops at the wall as a
// visitor's page does). Writes <out>/irradiance.proof.json and JPEGs (they hold the film's frames: keep them out of git).
// THE INVERSION STANDS OFF THE FREEZE ONLY: since e6ecbb4015 (Oct 16 2026 02:19 WEST, "Hold the golden flash for the original liquor scene and observe
// finalized NFT supply") lab/hero-mount.js mounts it only while the freeze is off (`!freezeSpace && inverted()`), and since 61409e1693 (Oct 15 16:34
// WEST, his "anime until the mint freeze, then native 3D") the freeze is the hero's default, ?freeze=off its diagnostic switch. The page as everyone
// meets it has no inversion; this proof opens the lab with ?freeze=off, where the hero still mounts it (on the default it waited for it 90 s and failed).
// COST: one Chrome (about 500 MB) for about two minutes; run it niced, under a time limit.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {door} from './storyboard.proof.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UI = path.resolve(HERE, '../../..');
const PAGE = '/intro/dyson-society/lab/hero-ab.html?v=film&paywall=off&freeze=off';   // ?freeze=off: the one hero that mounts the inversion (above)
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', path.join(os.tmpdir(), 'irradiance-proof')));
const [W, H] = opt('--size', '1440x900').split('x').map(Number), SCALE = Number(opt('--scale', '1')) || 1;
const SECONDS = opt('--seconds', '45.0,45.45,45.8,46.3,47.0,47.7,48.5,49.6,50.5,11.2').split(',').map(Number);
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'];
const CHROME = opt('--chrome', CHROMES.find((c) => fs.existsSync(c)));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// what the page runs for the proof
const HELPER = `window.__inv = (() => {
  const H = window.hero, doc = () => H.frame.contentDocument, win = () => H.frame.contentWindow, film = () => doc().getElementById('dl-twelve-film');
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : win().requestAnimationFrame(f)); win().requestAnimationFrame(f); });
  const layer = () => doc().getElementById('hero-irradiance');
  let inv = null;
  const loaf = {top: [], hero: []};
  const watch = (w, list) => { try { new w.PerformanceObserver((l) => { for (const e of l.getEntries()) list.push({start: e.startTime, duration: e.duration}); }).observe({type: 'long-animation-frame', buffered: false}); return true; } catch { return false; } };
  return {
    async ready() {
      const t0 = performance.now();
      // what stood when it did not come up: the page's mount, its parts, the film's load (a failed wait says which)
      // (own: the frame's own handle, window.hero in the page, beside the panel's: a page that mounted while the panel holds none says the panel never attached)
      const seen = () => { let f = null, o = null; try { f = film(); o = win().hero ?? null; } catch {} return JSON.stringify({page: Boolean(H.page), mounts: H.page?.mounts ?? null, theater: Boolean(H.theater), unbox: Boolean(H.unbox), inversion: Boolean(H.inversion),
        own: o ? {mounts: o.mounts ?? null, theater: Boolean(o.theater), unbox: Boolean(o.unbox), inversion: Boolean(o.inversion)} : null,
        film: f ? {readyState: f.readyState, networkState: f.networkState, t: f.currentTime, paused: f.paused, preload: f.preload, error: f.error?.code ?? null} : null}); };
      while (!(H.theater && H.unbox && H.inversion && film()?.readyState >= 3)) { if (performance.now() - t0 > 90000) throw new Error('the hero did not come up in 90 s: ' + seen()); await new Promise(r => setTimeout(r, 200)); }
      inv = H.inversion;
      film().pause();
      const stage = doc().getElementById('sphere-stage').getBoundingClientRect();
      win().scrollBy(0, Math.round(stage.top + stage.height / 2 - win().innerHeight / 2));
      document.querySelector('.ab').style.visibility = 'hidden';
      await frames(4);
      const kids = [...doc().getElementById('sphere-stage').children].map(c => c.id || c.tagName.toLowerCase());
      return {stage: [stage.width, stage.height], order: kids, loaf: {top: watch(window, loaf.top), hero: watch(win(), loaf.hero)}, stats: inv.stats};
    },
    stats() { return inv ? inv.stats : null; },
    unmount() { inv?.destroy(); inv = null; return !layer(); },
    async seek(t, settle = 8) {
      const f = film(); f.pause();
      if (Math.abs(f.currentTime - t) > 1e-4) { f.currentTime = t; await new Promise(r => f.addEventListener('seeked', r, {once: true})); }
      await frames(2); win().genesisSphere?.redraw?.();
      await frames(settle);
      const b = H.boxLog.at(-1);
      return {t: f.currentTime, plan: inv ? (({on, k, level, alpha, reach}) => ({on, k, level, alpha, reach: [Math.min(...reach), Math.max(...reach)]}))(inv.at(f.currentTime)) : null,
        stats: inv ? inv.stats : null, box: b ? {t: b.t, reason: b.reason, draws: b.draws} : null, out: H.unbox?.out ?? null};
    },
    async play(from, to) {
      await this.seek(from, 3);
      const f = film(), w = win(), a = inv ? {...inv.stats} : null, l0 = {top: loaf.top.length, hero: loaf.hero.length};
      const gaps = [], inside = [];
      let prev = null, on = true;
      const tick = (now) => { if (prev !== null) { gaps.push(now - prev); if (f.currentTime >= 45.445 && f.currentTime < 50.05) inside.push(now - prev); } prev = now; if (on) w.requestAnimationFrame(tick); };
      w.requestAnimationFrame(tick);
      const t0 = performance.now();
      await f.play();
      while (f.currentTime < to && !f.paused) await new Promise(r => setTimeout(r, 20));
      f.pause(); on = false;
      await frames(2);
      const b = inv ? {...inv.stats} : null, q = (list, p) => { const s = [...list].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(p * s.length))] ?? null; };
      const long = (list, n0) => { const e = list.slice(n0); return {count: e.length, ms: Math.round(e.reduce((s, x) => s + x.duration, 0)), longest: Math.round(Math.max(0, ...e.map(x => x.duration)))}; };
      return {from, to: f.currentTime, wall_s: (performance.now() - t0) / 1000, frames: gaps.length, over25: gaps.filter(g => g > 25).length, over50: gaps.filter(g => g > 50).length,
        p50: q(gaps, 0.5), p95: q(gaps, 0.95), longest: Math.max(0, ...gaps), window: {frames: inside.length, p50: q(inside, 0.5), p95: q(inside, 0.95), longest: Math.max(0, ...inside), over25: inside.filter(g => g > 25).length},
        loafTop: long(loaf.top, l0.top), loafHero: long(loaf.hero, l0.hero),
        inversion: b ? {draws: b.draws - a.draws, frames: b.frames - a.frames, ms: b.drawMs - a.drawMs, perDraw: (b.drawMs - a.drawMs) / Math.max(1, b.draws - a.draws), max: b.drawMax, readyMs: b.readyMs,
          boxGlass: b.boxGlass - a.boxGlass, waiting: b.waiting, shown: b.shown, pixels: b.pixels} : null};
    },
    async rest(ms) {
      const a = inv ? {...inv.stats} : null;
      await new Promise(r => setTimeout(r, ms));
      const b = inv ? {...inv.stats} : null;
      return {ms, draws: b.draws - a.draws, frames: b.frames - a.frames, waiting: b.waiting, shown: b.shown, pixels: b.pixels};
    },
  };
})(); 'ok'`;

async function main() {
  if (!CHROME) throw new Error('no Chrome here');
  fs.mkdirSync(OUT, {recursive: true});
  const d = await door(UI);
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'irradiance-chrome-'));
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
  const results = {at: new Date().toISOString(), chrome: CHROME, host: os.hostname(), load: os.loadavg(), size: [W, H], scale: SCALE, page: PAGE, seconds: SECONDS};
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
    const wait = new Map(), events = [];
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
    results.ready = await ev('window.__inv.ready()');
    console.log(`stage ${results.ready.stage.map(Math.round).join('x')}; the layers ${JSON.stringify(results.ready.order)}; plan in idle time ${results.ready.stats.readyMs?.toFixed(2)} ms`);
    const shot = async () => (await send('Page.captureScreenshot', {format: 'jpeg', quality: 88, captureBeyondViewport: false}, s)).data;

    results.pictures = [];
    for (const sec of SECONDS) {
      const at = await ev(`window.__inv.seek(${sec}, 8)`), file = `inversion-${sec.toFixed(3)}s.jpg`;
      fs.writeFileSync(path.join(OUT, file), Buffer.from(await shot(), 'base64'));
      results.pictures.push({second: at.t, file, plan: at.plan, last: at.stats?.last, pixels: at.stats?.pixels, box: at.box, out: at.out});
      console.log(`  ${at.t.toFixed(3)} s: ${at.plan?.on ? `level ${at.plan.level.toFixed(2)} reach ${at.plan.reach.map(Math.round).join('-')} px, glass ${at.stats.last?.glass}` : 'off'}; box ${JSON.stringify(at.box)}`);
    }

    const metrics = async () => Object.fromEntries((await send('Performance.getMetrics', {}, s)).metrics.map((m) => [m.name, m.value]));
    const KEYS = ['RecalcStyleCount', 'RecalcStyleDuration', 'LayoutCount', 'LayoutDuration', 'ScriptDuration', 'TaskDuration'];
    const windowed = async (from, to) => {
      const a = await metrics(), w = await ev(`window.__inv.play(${from}, ${to})`), b = await metrics();
      return {...w, metrics: Object.fromEntries(KEYS.map((k) => [k, Math.round((b[k] - a[k]) * (k.endsWith('Duration') ? 1e6 : 1)) / (k.endsWith('Duration') ? 1e3 : 1)]))};   // durations in ms
    };
    const [A, B] = [44.4, 50.6];
    results.cost = {with: [], without: []};
    results.cost.with.push(await windowed(A, B));
    await ev('window.__inv.seek(47.5, 3)');
    results.cost.rest = await ev('window.__inv.rest(3000)');
    results.cost.with.push(await windowed(A, B));
    results.cost.unmounted = await ev('window.__inv.unmount()');
    results.cost.without.push(await windowed(A, B));
    results.cost.without.push(await windowed(A, B));
    for (const [k, v] of Object.entries(results.cost)) console.log(`  ${k}: ${JSON.stringify(v)}`);
  } finally {
    results.errors = errors;
    results.refused = [...new Set(refused)];
    if (errors.length) console.log('page errors: ' + errors.join(' | '));
    if (refused.length) console.log('refused: ' + results.refused.join(', '));
    fs.writeFileSync(path.join(OUT, 'irradiance.proof.json'), JSON.stringify(results, null, 1));
    console.log(`wrote ${path.join(OUT, 'irradiance.proof.json')}`);
    process.off('SIGTERM', onSig); process.off('SIGINT', onSig);
    await end();
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

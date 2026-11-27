#!/usr/bin/env node
// ko-edge.proof.mjs: the KO edge (ko-edge.js) proved on the hero itself (hero-ab.html, as main has it), in a muted headless Chrome over CDP, off
// every screen. The page is loaded as it is; the edge is put on its stage from outside (the import and mountKoEdge, the two lines hero-ab.html
// would carry), so the proof needs no edit of the unboxing session's page.
//   node ko-edge.proof.mjs --out <dir> [--size 1440x900] [--chrome <path>] [--nest http://127.0.0.1:8904] [--clip 17.8:23.3]
// - Pictures at the film's seconds (the film paused there): before the hit, the hit, his 18.1 s, his spasms' drawings and the falls between
//   them, the calm while Dolbar talks, the last frame held in the two-shot, the first in her view, her face, the last frame before the beam, the beam.
// - A clip: every film frame of --clip, seeked one by one (the edge is a function of the film's second), as JPEGs for ffmpeg to make a film of.
// - The cost while the film plays, 17.0 to 23.0 s with the edge and again without it (CDP Performance.getMetrics: style recalcs, layouts,
//   script and task time), and 40 to 44 s, outside its window; then at rest (paused) for 3 s: no frame, no write, nothing waiting.
// The door: this tree's embertide-app/ui at / (the page at /intro/dyson-society/lab/hero-ab.html, as aiolos serves it), byte ranges, GET only;
// the one other request let through is his tags' read; everything else is refused and listed. Writes <out>/ko-edge.proof.json and PNGs (they
// hold the film's frames: keep them out of git).
// COST: one Chrome (about 500 MB) for about a minute and a half; run it on the new Mac, niced, under a time limit.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {KO, FPS, frameTime} from './ko-edge.js';

const frames = (a, b) => { const out = []; for (let n = Math.ceil(a * FPS); frameTime(n) < b; n++) out.push(frameTime(n)); return out; };

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UI = path.resolve(HERE, '../../..');
const PAGE = '/intro/dyson-society/lab/hero-ab.html?v=film&paywall=off';   // a minter's view: the lab stops at the wall as a visitor's page does
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', path.join(os.tmpdir(), 'ko-edge-proof')));
const [W, H] = opt('--size', '1440x900').split('x').map(Number);
const NEST = opt('--nest', 'http://127.0.0.1:8904').replace(/\/$/, '');
const [CLIP_A, CLIP_B] = opt('--clip', '17.8:23.3').split(':').map(Number);
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')];
const CHROME = opt('--chrome', CHROMES.find((c) => fs.existsSync(c)));
const TYPES = {html: 'text/html; charset=utf-8', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg',
  webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', m4a: 'audio/mp4', woff2: 'font/woff2', glb: 'model/gltf-binary'};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// the moments to picture: before, the hit, his 18.1 s, a drawing of the yank and the fall after it, a jerk after the cut, the calm while Dolbar
// talks, the scream's strongest drawing, the drop, the sway, the cut to her, her face, the last frame before the beam, the beam
const r3 = (t) => Math.round(t * 1000) / 1000;
const SECONDS = [
  ['before the hit', 17.95], ['the hit', frameTime(KO.frames.hit)], ['his 18.1 s', 18.1], ['a drawing of the yank', frameTime(544)], ['the fall before the next', frameTime(548)],
  ['a jerk after the cut', frameTime(582)], ['the calm while Dolbar talks', 20.5], ['the scream\'s strongest drawing', frameTime(659)], ['his body drops', frameTime(676)],
  ['the sway', frameTime(826)], ['held, the last frame of the two-shot', frameTime(KO.frames.held - 1)], ['her view, its first frame', frameTime(KO.frames.held)], ['her face', 34.5],
  ['the last frame before the beam', frameTime(KO.frames.healed - 1)], ['the beam', frameTime(KO.frames.healed)],
].map(([name, t]) => [name, r3(t)]);

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
const HELPER = `window.__ko = (() => {
  const H = window.hero, doc = () => H.frame.contentDocument, win = () => H.frame.contentWindow, film = () => doc().getElementById('dl-twelve-film');
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  let edge = null;
  return {
    async ready() {
      const t0 = performance.now();
      while (!(H.theater && film()?.readyState >= 3)) { if (performance.now() - t0 > 60000) throw new Error('the hero did not come up in 60 s'); await new Promise(r => setTimeout(r, 200)); }
      const stage = doc().getElementById('sphere-stage').getBoundingClientRect();
      win().scrollBy(0, Math.round(stage.top + stage.height / 2 - win().innerHeight / 2));
      document.querySelector('.ab').style.visibility = 'hidden';
      await frames(4);
      return {stage: [stage.width, stage.height]};
    },
    async mount() {
      const m = await import('/intro/dyson-society/lab/ko-edge.js');
      edge = m.mountKoEdge({stage: doc().getElementById('sphere-stage'), film: film()});
      await new Promise(r => setTimeout(r, 300));
      const kids = [...doc().getElementById('sphere-stage').children].map(c => c.id || c.tagName.toLowerCase());
      return {stats: edge.stats, order: kids};
    },
    unmount() { edge?.destroy(); edge = null; return true; },
    stats() { return edge ? edge.stats : null; },
    rect() { const r = doc().getElementById('hero-ko-edge')?.getBoundingClientRect(); return r ? [r.left, r.top, r.width, r.height].map(v => Math.round(v * 10) / 10) : null; },
    view() { return [win().innerWidth, win().innerHeight, doc().documentElement.clientWidth]; },
    async seek(t, settle = 4) {
      const f = film(); f.pause();
      if (Math.abs(f.currentTime - t) > 1e-4) { f.currentTime = t; await new Promise(r => f.addEventListener('seeked', r, {once: true})); }
      await frames(settle);
      return {t: f.currentTime, style: edge ? edge.at(f.currentTime) : null};
    },
    async play(from, to) {
      await this.seek(from, 3);
      const f = film(), a = edge ? {...edge.stats} : null, t0 = performance.now();
      await f.play();
      while (f.currentTime < to && !f.paused) await new Promise(r => setTimeout(r, 40));
      f.pause();
      await frames(2);
      const b = edge ? {...edge.stats} : null;
      return {from, to: f.currentTime, wall_s: (performance.now() - t0) / 1000, writes: b ? b.writes - a.writes : null, frames: b ? b.frames - a.frames : null, waiting: b ? b.waiting : null};
    },
    async rest(ms) { const a = edge ? {...edge.stats} : null; await new Promise(r => setTimeout(r, ms)); const b = edge ? {...edge.stats} : null; return {ms, writes: b.writes - a.writes, frames: b.frames - a.frames, waiting: b.waiting}; },
  };
})(); 'ok'`;

async function main() {
  if (!CHROME) throw new Error('no Chrome here');
  fs.mkdirSync(path.join(OUT, 'clip'), {recursive: true});
  const d = await door(UI);
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'ko-edge-chrome-'));
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
  const results = {at: new Date().toISOString(), chrome: CHROME, host: os.hostname(), load: os.loadavg(), size: [W, H], seconds: SECONDS};
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
    const wait = new Map(), events = [], errors = [], refused = [];
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    const tags = `${NEST}/nest/ref/mint/seiya-tags`;
    ws.onmessage = (m) => {
      const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const {url, method} = x.params.request, ok = url.startsWith(d.origin + '/') || (method === 'GET' && url === tags) || url.startsWith('data:');
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
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: 1, mobile: false}, s);
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
    results.ready = await ev('window.__ko.ready()');
    results.mount = await ev('window.__ko.mount()');
    console.log(`stage ${results.ready.stage.map(Math.round).join('x')}; the edge after ${JSON.stringify(results.mount.order)}; red painted in ${results.mount.stats.paintMs?.toFixed(1)} ms`);
    const shot = async (format = 'png') => (await send('Page.captureScreenshot', {format, quality: format === 'jpeg' ? 88 : undefined, captureBeyondViewport: false}, s)).data;
    const save = (rel, b64) => { const fp = path.join(OUT, rel); fs.writeFileSync(fp, Buffer.from(b64, 'base64')); return fp; };

    results.pictures = [];
    for (const [name, sec] of SECONDS) {
      const at = await ev(`window.__ko.seek(${sec}, 6)`);
      const fp = save(`ko-${sec.toFixed(3)}s.png`, await shot());
      results.pictures.push({name, second: at.t, style: at.style, file: path.basename(fp), box: await ev('window.__ko.stats().size'), rect: await ev('window.__ko.rect()'), view: await ev('window.__ko.view()')});
      console.log(`  ${name}, ${at.t.toFixed(3)} s: ${JSON.stringify(at.style)} rect ${JSON.stringify(results.pictures.at(-1).rect)} of ${JSON.stringify(results.pictures.at(-1).view)}`);
    }
    results.clip = {from: CLIP_A, to: CLIP_B, frames: 0};
    for (const sec of frames(CLIP_A, CLIP_B)) {
      await ev(`window.__ko.seek(${sec}, 2)`);
      save(`clip/f${String(results.clip.frames).padStart(4, '0')}.jpg`, await shot('jpeg'));
      results.clip.frames++;
    }
    console.log(`  clip: ${results.clip.frames} frames from ${CLIP_A} to ${CLIP_B} s`);

    const metrics = async () => Object.fromEntries((await send('Performance.getMetrics', {}, s)).metrics.map((m) => [m.name, m.value]));
    const KEYS = ['RecalcStyleCount', 'RecalcStyleDuration', 'LayoutCount', 'LayoutDuration', 'ScriptDuration', 'TaskDuration'];
    const windowed = async (from, to) => {
      const a = await metrics(), w = await ev(`window.__ko.play(${from}, ${to})`), b = await metrics();
      return {...w, metrics: Object.fromEntries(KEYS.map((k) => [k, Math.round((b[k] - a[k]) * (k.endsWith('Duration') ? 1e6 : 1)) / (k.endsWith('Duration') ? 1e3 : 1)]))};   // durations in ms
    };
    results.cost = {};
    results.cost.withEdge = await windowed(17.0, 23.0);
    results.cost.outside = await windowed(40.0, 44.0);
    await ev('window.__ko.seek(22, 3)');
    results.cost.rest = await ev('window.__ko.rest(3000)');
    await ev('window.__ko.unmount()');
    results.cost.withoutEdge = await windowed(17.0, 23.0);
    for (const [k, v] of Object.entries(results.cost)) console.log(`  ${k}: ${JSON.stringify(v)}`);
    results.errors = errors;
    results.refused = [...new Set(refused)];
    if (errors.length) console.log('page errors: ' + errors.join(' | '));
    if (refused.length) console.log('refused: ' + results.refused.join(', '));
  } finally {
    fs.writeFileSync(path.join(OUT, 'ko-edge.proof.json'), JSON.stringify(results, null, 1));
    console.log(`wrote ${path.join(OUT, 'ko-edge.proof.json')}`);
    process.off('SIGTERM', onSig); process.off('SIGINT', onSig);
    await end();
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

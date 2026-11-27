#!/usr/bin/env node
// cuts.proof.mjs: THE CUTS WIRED (cuts.js on cuts.html) proved in a muted headless Chrome over CDP, off every screen.
//   node cuts.proof.mjs --out <dir> [--size 1280x800] [--dpr 2] [--chrome <path>] [--tags <ref.json>] [--no-pictures]
//   node cuts.proof.mjs --out <dir> --pictures-at 29.5,29.6     (pictures at those seconds alone: a look at a moment of the film)
// - Pictures at the film seconds the lane names, the film paused there (the plan is a pure function of the film's second; a seek into a
//   block cut seeks the frame before it first, as the page does for him): the pass at 11.00 / 11.10 / 11.25 / 11.45 s; 24.10 s, where the
//   film has no cut; the codec's cut at the film's cuts 29.563 s (the two-shot to over Athena's shoulder) and 36.570 s (her face to the
//   column), each on its first frame, its fourth and its eighth; the chips at 37.2 s. JPEG, css px.
// - The cost while it plays through each kind of cut, and through the armor's flurry (64.9 to 69.6 s, the film's own cut device: none of
//   ours there): the page's draws by cause, the frames they cover, the keeps (copies into the frame that stands), its JS ms and GPU ms a draw
//   (EXT_disjoint_timer_query_webgl2; on ANGLE Metal a query carries a floor); then at rest (paused, 3 s): draws and the page's
//   requestAnimationFrame calls must both be 0.
// - A bench at four paused frames (the picture, the normals, the matte, the blocks half filled): 60 draws each, asked one at a time.
// The door: this tree's embertide-app/ui at / (so the page is /intro/dyson-society/lab/cuts.html, as aiolos serves it), byte ranges, GET
// only; his tags from --tags (the ref as the Nest answered it, read once on the serving Mac) at /nest/ref/mint/seiya-tags of the door
// itself, the page opened with ?nest=<the door>; every other request is refused and listed. Writes <out>/cuts.proof.json and the pictures.
// COST: one Chrome (about 400 MB) for about a minute; run it under nice and a time limit, on the new Mac (the serving Mac serves the house).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UI = path.resolve(HERE, '../../..');   // embertide-app/ui
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', path.join(os.tmpdir(), 'cuts-proof')));
const [W, H] = opt('--size', '1280x800').split('x').map(Number), DPR = Number(opt('--dpr', 2));
const TAGS = opt('--tags', null), PICTURES = !args.includes('--no-pictures');
const AT = opt('--pictures-at', null)?.split(',').map(Number).filter(Number.isFinite) ?? null;   // pictures at these seconds alone (a look)
const FPS = 30000 / 1001, mid = (frame) => +((frame + 0.5) / FPS).toFixed(4);   // the middle of a frame, so the picture is that frame's
const SECONDS = [[11.00, 'pass-1-picture'], [11.10, 'pass-2-normals'], [11.25, 'pass-3-matte'], [11.45, 'pass-4-picture-back'], [24.10, 'no-cut-24.10'],
  [mid(886), 'cut-29.563-1-the-two-shot-stands'], [mid(889), 'cut-29.563-2-half-filled'], [mid(893), 'cut-29.563-3-her-shoulder-whole'],
  [mid(1096), 'cut-36.570-1-her-face-stands'], [mid(1099), 'cut-36.570-2-half-filled'], [mid(1103), 'cut-36.570-3-the-column-whole'],
  [37.2, 'chips-at-37.2-in-the-pass']];
const WINDOWS = [[10.4, 12.0, 'the pass at the first burst'], [29.0, 30.4, 'the codec\'s cut at the film\'s 29.563 s'],
  [36.3, 38.6, 'the cut at 36.570 s, the pass at 37.10 s, the cut at 38.071 s, the chips'], [61.2, 62.6, 'the pass at his conversion tag'],
  [64.6, 69.9, 'the armor\'s flurry, the film\'s own cut device: none of ours']];
const BENCH = [[11.45, 'picture'], [11.10, 'normals'], [11.25, 'matte'], [mid(889), 'blocks']];
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')];
const CHROME = opt('--chrome', CHROMES.find(c => fs.existsSync(c)));
const TYPES = {html: 'text/html; charset=utf-8', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg', mp4: 'video/mp4', woff2: 'font/woff2'};
const sleep = ms => new Promise(r => setTimeout(r, ms));
const stat = (xs) => { const s = xs.filter(Number.isFinite).sort((a, b) => a - b), at = p => s[Math.min(s.length - 1, Math.floor(p * s.length))]; return s.length ? {n: s.length, min: +s[0].toFixed(3), median: +at(0.5).toFixed(3), p95: +at(0.95).toFixed(3), max: +s.at(-1).toFixed(3)} : null; };

function door(root, tagsBody) {
  root = fs.realpathSync(root);
  const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    const p = new URL(req.url, 'http://x').pathname;
    if (p === '/nest/ref/mint/seiya-tags') {
      if (!tagsBody) { res.writeHead(404, {'access-control-allow-origin': '*'}); return res.end(); }
      res.writeHead(200, {'content-type': 'application/json', 'access-control-allow-origin': '*', 'cache-control': 'no-store'}); return res.end(tagsBody);
    }
    let fp; try { fp = fs.realpathSync(path.join(root, decodeURIComponent(p))); } catch { res.writeHead(404); return res.end(); }
    if (fp !== root && !fp.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    let st; try { st = fs.statSync(fp); } catch { res.writeHead(404); return res.end(); }
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
  return new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', () => resolve({origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(r => { server.closeAllConnections?.(); server.close(() => r()); })})); });
}

// before the page's own scripts: count its requestAnimationFrame calls (the law: none at rest)
const COUNT_RAF = `(() => { const raf = window.requestAnimationFrame.bind(window); window.__rafCalls = 0; window.requestAnimationFrame = (f) => { window.__rafCalls++; return raf(f); }; })();`;
// what the proof runs in the page (never a requestAnimationFrame of its own: it waits by timers and by the page's own draws)
const HELPER = `window.__proof = (() => {
  const C = window.cuts, wait = (ms) => new Promise(r => setTimeout(r, ms));
  const counts = () => ({draws: C.state().draws, keeps: C.state().keeps, log: C.log.length, raf: window.__rafCalls, at: performance.now(), t: C.film.currentTime});
  return {
    async seek(t) { await C.seek(t); await wait(120); return {t: C.film.currentTime, plan: C.plan(), state: C.state()}; },
    clip() { const b = C.box(), x = Math.max(0, b.cx - 1.3 * b.R), y = Math.max(0, b.cy - 1.3 * b.R); return {x, y, width: Math.min(b.w, b.cx + 1.32 * b.R + 230) - x, height: Math.min(b.h, b.cy + 1.3 * b.R) - y}; },
    async play(from, to) {
      await C.seek(from); await wait(150);
      const a = counts(), f = C.film;
      await f.play();
      while (f.currentTime < to && !f.paused) await wait(40);
      f.pause(); await wait(100);
      const b = counts(), draws = C.log.slice(a.log, b.log), by = {}, state = {};
      for (const d of draws) {
        by[d.reason] = (by[d.reason] ?? 0) + 1;
        const k = d.filled !== null ? 'blocks' : d.pass;
        (state[k] ??= {draws: 0, cpu: [], gpu: []}).draws++; state[k].cpu.push(d.cpuMs); if (d.gpuMs !== null) state[k].gpu.push(d.gpuMs);
      }
      const frames = new Set(draws.filter(d => d.reason === 'frame').map(d => d.f));
      return {from: a.t, to: b.t, wall_s: (b.at - a.at) / 1000, draws: b.draws - a.draws, keeps: b.keeps - a.keeps, by, frames: frames.size,
        span_frames: draws.length ? Math.max(...draws.map(d => d.f)) - Math.min(...draws.map(d => d.f)) + 1 : 0, raf: b.raf - a.raf, state,
        cuts: [...new Set(draws.map(d => d.pass + (d.filled !== null ? ' blocks ' + Math.round(d.filled * 6) + '/6' : '')))]};
    },
    async rest(ms) { const a = counts(); await wait(ms); const b = counts(); return {ms, draws: b.draws - a.draws, raf: b.raf - a.raf, keeps: b.keeps - a.keeps, film: [a.t, b.t]}; },
    async bench(t, n) {
      await C.seek(t); await wait(100);
      const from = C.log.length;
      for (let i = 0; i < n; i++) { C.redraw(); await wait(16); }
      await wait(200); C.redraw(); await wait(50);
      const d = C.log.slice(from, from + n);
      return {t, n: d.length, pass: d[0]?.pass, filled: d[0]?.filled, cpu: d.map(x => x.cpuMs), gpu: d.map(x => x.gpuMs).filter(v => v !== null)};
    },
  };
})(); 'ok'`;

async function main() {
  if (!CHROME) throw new Error('no Chrome here');
  fs.mkdirSync(OUT, {recursive: true});
  const d = await door(UI, TAGS ? fs.readFileSync(TAGS, 'utf8') : null);
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'cuts-chrome-'));
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
  const onSig = () => end().then(() => process.exit(3)); process.on('SIGTERM', onSig); process.on('SIGINT', onSig);
  const results = {at: new Date().toISOString(), chrome: CHROME, host: os.hostname(), load: os.loadavg().map(v => +v.toFixed(2)), size: [W, H], dpr: DPR};
  try {
    let port = null;
    for (let i = 0; i < 400 && !port; i++) { await sleep(150); if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`); try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {} }
    if (!port) throw new Error('Chrome did not open its debugging port in 60 s');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then(r => r.json());
    results.browser = ver.Browser;
    ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0; const wait = new Map(), events = [], errors = [], refused = [];
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
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 300));
      if (x.method === 'Runtime.consoleAPICalled' && (x.params.type === 'error' || x.params.type === 'warning')) errors.push(`console.${x.params.type}: ` + x.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 300));
      events.push(x.method);
    };
    const t = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: W, height: H});
    const s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable']) await send(m, {}, s);
    await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: DPR, mobile: false}, s);
    await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s); await send('Page.bringToFront', {}, s).catch(() => {});
    await send('Page.addScriptToEvaluateOnNewDocument', {source: COUNT_RAF}, s);
    const loaded = new Promise(r => { const iv = setInterval(() => { if (events.includes('Page.loadEventFired')) { clearInterval(iv); r(); } }, 50); });
    const page = `${d.origin}/intro/dyson-society/lab/cuts.html?bare&nest=${encodeURIComponent(d.origin)}`;
    const nav = await send('Page.navigate', {url: page}, s); if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    await Promise.race([loaded, sleep(20000)]);
    const ev = async (expression) => { const r = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true}, s); if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 400)); return r.result?.value; };
    const until = async (expr, ms = 30000) => { const t0 = Date.now(); while (!(await ev(expr))) { if (Date.now() - t0 > ms) throw new Error(`waited ${ms} ms for ${expr}`); await sleep(200); } };
    await until('Boolean(window.cuts)');
    results.ready = await ev('window.cuts.ready');
    await ev(HELPER);
    console.log(`renderer ${results.ready.renderer}; timer ${results.ready.timer}; dpr ${results.ready.dpr}; tags ${results.ready.tags} from ${results.ready.tagsFrom}; cuts ${results.ready.shots}`);

    results.pictures = [];
    if (PICTURES) {
      for (const [sec, name] of AT ? AT.map(t => [t, `look-${t.toFixed(3)}`]) : SECONDS) {
        const at = await ev(`window.__proof.seek(${sec})`);
        const clip = await ev('window.__proof.clip()');
        const b64 = (await send('Page.captureScreenshot', {format: 'jpeg', quality: 84, captureBeyondViewport: false, clip: {...clip, scale: 1 / DPR}}, s)).data;
        const file = path.join(OUT, `${name}.jpg`); fs.writeFileSync(file, Buffer.from(b64, 'base64'));
        results.pictures.push({second: sec, file: path.basename(file), bytes: fs.statSync(file).size, t: at.t, pass: at.plan.pass, passFrame: at.plan.passFrame, blocks: at.plan.blocks,
          cut: at.plan.cut, chips: at.plan.chips.map(c => `${c.t} ${c.name} ${c.colour} face ${c.face}`), held: [at.state.heldFor, at.state.heldFrame], draws: at.state.draws, keeps: at.state.keeps});
        console.log(`${sec.toFixed(3)} s ${name}: ${at.plan.pass}${at.plan.blocks ? ` blocks ${at.plan.blocks.filled.toFixed(2)} (cut ${at.plan.blocks.cut})` : ''}, chips ${at.plan.chips.length}, held ${at.state.heldFor}@${at.state.heldFrame}`);
      }
    }
    if (!AT) {
      results.windows = [];
      for (const [from, to, what] of WINDOWS) {
        const r = await ev(`window.__proof.play(${from}, ${to})`);
        for (const k of Object.keys(r.state)) r.state[k] = {draws: r.state[k].draws, cpu_ms: stat(r.state[k].cpu), gpu_ms: stat(r.state[k].gpu)};
        results.windows.push({what, ...r});
        console.log(`${what}: ${r.draws} draws (${JSON.stringify(r.by)}) over ${r.frames} film frames of ${r.span_frames}, ${r.keeps} keeps, rAF ${r.raf}; ${r.cuts.join(', ')}; ${Object.entries(r.state).map(([k, v]) => `${k} ${v.draws} draws JS ${v.cpu_ms?.median} GPU ${v.gpu_ms?.median}`).join('; ')}`);
      }
      results.rest = await ev('window.__proof.rest(3000)');
      console.log(`at rest 3 s: ${results.rest.draws} draws, ${results.rest.raf} rAF calls, ${results.rest.keeps} keeps, film ${results.rest.film}`);
      results.bench = [];
      for (const [sec, what] of BENCH) {
        const b = await ev(`window.__proof.bench(${sec}, 60)`);
        results.bench.push({what, t: b.t, n: b.n, pass: b.pass, filled: b.filled, cpu_ms: stat(b.cpu), gpu_ms: stat(b.gpu)});
        console.log(`bench ${what} at ${sec}: JS ${JSON.stringify(stat(b.cpu))} GPU ${JSON.stringify(stat(b.gpu))}`);
      }
    }
    results.info = await ev('window.cuts.state()');
    results.refused = refused; results.errors = errors;
    console.log(`refused ${refused.length}: ${refused.slice(0, 5).join(' ')}; errors ${errors.length}: ${errors.slice(0, 3).join(' | ')}`);
  } finally {
    fs.writeFileSync(path.join(OUT, 'cuts.proof.json'), JSON.stringify(results, null, 1));
    await end();
  }
}
main().then(() => process.exit(0), (e) => { console.error(e); process.exit(1); });

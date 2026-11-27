#!/usr/bin/env node
// syrup-glass.bench.mjs: the syrup glass measured in a muted headless Chrome over CDP, from this tree's files, off every screen.
//   node syrup-glass.bench.mjs --out <dir> [--sizes 1920x1080,1280x720] [--frames 300] [--no-pictures] [--chrome <path>]
// The road is tools/embertide-mesh/glass-proof.mjs's: the same Chrome flags, a loopback door of its own over the tree, and Fetch
// interception that lets through nothing but that door and the star's picture (his X picture, the lab's stand-in). Pictures by
// Page.captureScreenshot at the instants the task names, staged by the page's own deterministic clock (__syrup.hold, advance, draw).
// Then, at each size: 300 frames with ripples alive (a bronze drop every 24 frames, a gold every 96) with the GPU time of every pass
// by EXT_disjoint_timer_query_webgl2 when Chrome exposes it, and the frame deltas; 300 frames at rest, where the page's draws must be
// zero. Writes <out>/syrup-glass.bench.json and the PNGs. Ends everything it started (the Chrome by pid, its profile folder, the door).
// COST: one Chrome (~400 MB), about 40 s; run it under nice -n 19 and tools/dead-tasks/bounded.mjs on the serving Mac.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');   // the house (the worktree) root: embertide-app/ui/intro/dyson-society/lab -> house
const PAGE = '/embertide-app/ui/intro/dyson-society/lab/syrup-glass.html';
const FACE_ORIGIN = 'https://pbs.twimg.com';
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', path.join(HERE, 'syrup-glass-pictures')));
const SIZES = opt('--sizes', '1920x1080,1280x720').split(',').map(s => s.split('x').map(Number));
const FRAMES = Number(opt('--frames', 300));
const PICTURES = !args.includes('--no-pictures');
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'];
const CHROME = opt('--chrome', process.env.GLASS_PROOF_CHROME || CHROMES.find(c => fs.existsSync(c)));
const TYPES = { html: 'text/html; charset=utf-8', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', svg: 'image/svg+xml', mp4: 'video/mp4', woff2: 'font/woff2', woff: 'font/woff' };
const sleep = ms => new Promise(r => setTimeout(r, ms));
export const stat = (xs) => { const s = [...xs].sort((a, b) => a - b), at = p => s[Math.min(s.length - 1, Math.floor(p * s.length))]; return s.length ? { n: s.length, min: s[0], median: at(0.5), p95: at(0.95), max: s[s.length - 1], mean: s.reduce((a, b) => a + b, 0) / s.length } : null; };

function door(root) {
  root = fs.realpathSync(root);
  const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    let fp; try { fp = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname)); fp = fs.realpathSync(fp); } catch { res.writeHead(404); return res.end(); }
    if (fp !== root && !fp.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    let st; try { st = fs.statSync(fp); } catch { res.writeHead(404); return res.end(); }
    if (st.isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(fp).slice(1).toLowerCase()] || 'application/octet-stream', 'content-length': st.size, 'cache-control': 'no-store' });
    return req.method === 'HEAD' ? res.end() : fs.createReadStream(fp).pipe(res);
  });
  return new Promise((resolve, reject) => { server.once('error', reject); server.listen(0, '127.0.0.1', () => resolve({ origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise(r => { server.closeAllConnections?.(); server.close(() => r()); }) })); });
}

const CDP = opt('--cdp', null), URL_ = opt('--url', null);   // a Chrome already running (a glass's own, over the house's tunnel) and the page it can reach
const QUERY = opt('--query', '');   // more of the page's own knobs for every size, e.g. quality=lean (the page's header lists them)

/** A muted headless Chrome of its own with the page open at W x H, off every screen; or, with --cdp, a Chrome already running (a glass's own:
 *  `embertide-app/ui/glass/tools/remote-chrome.sh lysa@192.168.8.106 150 --use-angle=gl-egl &` puts one on lysa, headless, with its DevTools at
 *  this Mac's 19333) opening the page from --url, served where that glass can reach it (`tools/serve-range/serve -p 8986 -b <this Mac's LAN
 *  address> -t 600 embertide-app/ui`, then --url http://<that address>:8986/intro/dyson-society/lab/syrup-glass.html). `fn({ev, shot, send, s,
 *  errors, refused})` runs against it once the page's `ready` expression has settled (the syrup glass by default; syrup-inside.clip.mjs opens the
 *  inside view). Ends everything it started: its own Chrome and door, or only the tab it opened on the other. */
export async function withPage({ W, H, fn, out = OUT, chrome = CHROME, log = console.log, page = `${PAGE}?bench=1${QUERY ? '&' + QUERY : ''}`,
  ready = 'window.__syrup ? window.__syrup.ready : Promise.reject(new Error("no __syrup on the page"))', cdp = CDP, url = URL_ }) {
  const remote = Boolean(cdp);
  if (!remote && !chrome) throw new Error("no Chrome on this Mac (a glass's own is named with --cdp)");
  if (remote && !url) throw new Error('--cdp needs --url: the page, served where that Chrome can reach it');
  fs.mkdirSync(out, { recursive: true });
  const d = remote ? null : await door(ROOT);
  const origin = remote ? new URL(url).origin : d.origin;
  const dir = remote ? null : fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'syrup-glass-chrome-'));
  const child = remote ? null : spawn(chrome, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, `--window-size=${W},${H}`, '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', '--disable-default-apps',
    '--disable-features=Translate,MediaRouter,OptimizationHints,IsolateOrigins,site-per-process', '--disable-site-isolation-trials', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--force-color-profile=srgb', '--autoplay-policy=user-gesture-required', 'about:blank'], { stdio: 'ignore' });
  log(remote ? `a Chrome already running at ${cdp}; the page ${url}` : `chrome pid ${child.pid}, door ${d.origin}`);
  let ws = null, closeTab = async () => {};
  const end = async () => {
    try { await closeTab(); } catch {}
    try { ws?.close(); } catch {}
    if (child) { try { child.kill('SIGTERM'); } catch {} for (let i = 0; i < 30 && child.exitCode === null && child.signalCode === null; i++) await sleep(100);
      if (child.exitCode === null && child.signalCode === null) { try { child.kill('SIGKILL'); } catch {} await sleep(200); } try { fs.rmSync(dir, { recursive: true, force: true }); } catch {} }
    if (d) await d.close();
  };
  const onSig = () => end().then(() => process.exit(3)); process.on('SIGTERM', onSig); process.on('SIGINT', onSig);
  try {
    let base = remote ? cdp.replace(/\/$/, '') : null;
    if (!remote) {
      let port = null; for (let i = 0; i < 400 && !port; i++) { await sleep(150); if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`); try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {} }
      if (!port) throw new Error('Chrome did not open its debugging port in 60 s');
      base = `http://127.0.0.1:${port}`;
    }
    const ver = await fetch(`${base}/json/version`).then(r => r.json());
    ws = new WebSocket(ver.webSocketDebuggerUrl.replace(/^ws:\/\/[^/]+/, 'ws://' + new URL(base).host));   // through a tunnel the socket's host is the tunnel's end (glass/tools/cdp.mjs)
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0; const wait = new Map(), events = [], errors = [], refused = [];
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, { resolve, reject, method }); ws.send(JSON.stringify({ id: n, method, params, sessionId })); });
    ws.onmessage = m => { const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') { const u = x.params.request.url, ok = u.startsWith(origin + '/') || u.startsWith(FACE_ORIGIN + '/');
        if (ok) send('Fetch.continueRequest', { requestId: x.params.requestId }, x.sessionId).catch(() => {});
        else { refused.push(u.slice(0, 100)); send('Fetch.failRequest', { requestId: x.params.requestId, errorReason: 'BlockedByClient' }, x.sessionId).catch(() => {}); } return; }
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 300));
      if (x.method === 'Runtime.consoleAPICalled' && x.params.type === 'error') errors.push('console: ' + x.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 300));
      events.push(x.method); };
    const t = await send('Target.createTarget', { url: 'about:blank', newWindow: true, width: W, height: H });
    closeTab = () => send('Target.closeTarget', { targetId: t.targetId }).catch(() => {});
    const s = (await send('Target.attachToTarget', { targetId: t.targetId, flatten: true })).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable']) await send(m, {}, s);
    await send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] }, s);
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false }, s);
    await send('Emulation.setFocusEmulationEnabled', { enabled: true }, s); await send('Page.bringToFront', {}, s).catch(() => {});
    const loaded = new Promise(r => { const iv = setInterval(() => { if (events.includes('Page.loadEventFired')) { clearInterval(iv); r(); } }, 50); });
    const target = remote ? [url, /[?&]bench=/.test(url) ? '' : 'bench=1', QUERY].filter(Boolean).reduce((a, b) => a + (a.includes('?') ? '&' : '?') + b) : `${d.origin}${page}`;
    const nav = await send('Page.navigate', { url: target }, s); if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    await Promise.race([loaded, sleep(20000)]);
    const ev = async (expression, awaitPromise = true) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise }, s); if (r.exceptionDetails) throw new Error(String(r.exceptionDetails.exception?.description || r.exceptionDetails.text || 'the page threw').slice(0, 400)); return r.result.value; };
    const shot = async (name, clip) => { const r = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false, ...(clip ? { clip } : {}) }, s); const fp = path.join(out, `${name}.png`); fs.writeFileSync(fp, Buffer.from(r.data, 'base64')); log(`  picture ${name} (${Math.round(r.data.length * 3 / 4 / 1024)} KB)`); return fp; };
    const star = await ev(ready);
    return { browser: ver.Browser, star, result: await fn({ ev, shot, send, s, errors, refused, star }) };
  } finally { process.off('SIGTERM', onSig); process.off('SIGINT', onSig); await end(); }
}

async function main() {
  const results = { at: new Date().toISOString(), chrome: CDP ? null : CHROME, cdp: CDP, url: URL_, host: os.hostname(), load: os.loadavg(), sizes: {} };
  const [w0] = SIZES[0];
  for (const [W, H] of SIZES) {
    const key = `${W}x${H}`; console.log(`\n== ${key} ==`);
    const { browser, result } = await withPage({ W, H, fn: async ({ ev, shot, errors, refused, star }) => {
      const info = await ev('window.__syrup.info()'); console.log(`renderer ${info.renderer}; GPU timer ${info.timer}; star ${star}; textures ${(info.textureBytes / 1048576).toFixed(2)} MB; mesh ${(info.meshBytes / 1024).toFixed(0)} KB`);
      const size = { info, star, pictures: [] };
      const staged = async (js, ms) => { await ev(js, false); if (ms) await ev(`window.__syrup.advance(${ms})`, false); await ev('window.__syrup.draw()', false); await ev('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))'); };
      const front = async (lo, hi) => ev(`(() => { const f = window.__syrup.faces().filter(f => f.open && f.dir[2] > 0.6 && f.dir[1] > ${lo} && f.dir[1] < ${hi}); return f.length ? f[Math.floor(f.length / 2)].face : -1; })()`, false);
      if (PICTURES && W === w0) {
        await ev('window.__syrup.hold(true)', false);
        await staged('window.__syrup.expand()', 1700); await staged('window.__syrup.expand()', 1700);           // two rungs: 80 seats
        await staged('window.__syrup.crowd()', 2800);                                                             // a crowd lands, its ripples fade
        const b = await front(-0.1, 0.45);
        await staged(`window.__syrup.buy('bronze', ${b})`, 260); size.pictures.push(await shot('1-bronze-mid-fall'));
        await staged('0', 440); size.pictures.push(await shot('2-ripple-at-0.3s'));                                // it landed at 400 ms; 300 ms on
        const g = await front(-0.55, -0.1);
        await staged(`window.__syrup.buy('gold', ${g})`, 450); size.pictures.push(await shot('3-gold-setting'));
        const under = await ev("(() => { const f = window.__syrup.faces().filter(f => f.open && f.dir[1] < -0.45 && f.dir[2] > -0.2); return f.length ? f[Math.floor(f.length / 2)].face : -1; })()", false);
        await staged(under >= 0 ? `window.__syrup.buy('gold', ${under})` : "window.__syrup.buy('gold')", 640);
        const R = 0.34 * H, cx = W * 0.55, cy = H * 0.5;
        size.pictures.push(await shot('5-caustics', { x: Math.round(cx - 1.5 * R), y: Math.round(cy + 0.55 * R), width: Math.round(3 * R), height: Math.round(1.05 * R), scale: 2 }));
        await staged('window.__syrup.expand()', 1700); size.pictures.push(await shot('4-a-rung-later'));
        size.staged = await ev('window.__syrup.stats()', false);
        await ev('window.__syrup.hold(false)', false);
      } else { await ev('window.__syrup.expand()', false); await ev('window.__syrup.advance(1700)', false); await ev('window.__syrup.expand()', false); await ev('window.__syrup.advance(1700)', false); await ev('window.__syrup.draw()', false); }
      // alive: 300 frames with ripples, drops and the level moving
      const alive = await ev(`window.__syrup.benchAlive(${FRAMES})`);
      size.alive = { frames: alive.frames, draws: alive.draws, passes: alive.passes, delta_ms: stat(alive.deltas), draw_cpu_ms: stat(alive.cpu) };
      const passLine = Object.entries(alive.passes).map(([k, v]) => `${k} ${v.us.toFixed(0)}µs (n ${v.n}, max ${v.max_us.toFixed(0)})`).join('; ');
      console.log(`alive: ${alive.draws} draws in ${alive.frames} frames; frame delta median ${size.alive.delta_ms.median.toFixed(2)} ms, p95 ${size.alive.delta_ms.p95.toFixed(2)}; draw cpu median ${size.alive.draw_cpu_ms.median.toFixed(2)} ms\n  GPU: ${passLine || 'no timer'}`);
      // rest: the page must draw nothing
      const rest = await ev(`window.__syrup.benchRest(${FRAMES})`);
      size.rest = rest; console.log(`rest: ${rest.draws} draws in ${rest.frames} frames (page frames ${rest.pageFrames}, energy ${rest.energy.toExponential(2)}, rippling ${rest.rippling}, sync reads ${rest.syncReads})`);
      // each pass alone, between finishes
      size.passesAlone_us = await ev('window.__syrup.benchPasses(60)', false);
      console.log('alone: ' + Object.entries(size.passesAlone_us).map(([k, v]) => `${k} ${v.toFixed(0)}µs`).join('; '));
      size.errors = errors.splice(0); size.refused = refused.splice(0);
      if (size.errors.length) console.log('page errors: ' + size.errors.join(' | '));
      if (size.refused.length) console.log('refused: ' + size.refused.join(', '));
      return size;
    } });
    results.browser = browser; results.sizes[key] = result;
  }
  fs.writeFileSync(path.join(OUT, 'syrup-glass.bench.json'), JSON.stringify(results, null, 1));
  console.log(`\nwrote ${path.join(OUT, 'syrup-glass.bench.json')}`);
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(e => { console.error('bench failed: ' + (e.stack || e)); process.exit(1); });

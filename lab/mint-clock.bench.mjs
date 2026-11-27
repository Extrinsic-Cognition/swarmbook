#!/usr/bin/env node
// mint-clock.bench.mjs: the mint clock's page proved in a muted headless Chrome over CDP, off every screen (--headless=new opens no
// window), from this tree's files behind a loopback door of its own. Pictures at seven instants of financial time, each taken at
// rest (the sphere's own `alive` false); the law of rest (300 frames with no cause: the sphere's draws must be 0); and the cell count
// where Canvas 2D falls under 30 fps: a full sphere of holders at every class I rung from 30 to 10,230 hexagons, sixty rAF-paced
// draws each, until the median frame is past two vsyncs (over 40 ms) twice running. Writes <out>/mint-clock.bench.json and the pictures.
//   node mint-clock.bench.mjs [--out <dir>] [--size 1600x900] [--frames 300] [--no-pictures] [--no-fps] [--until <cells>] [--chrome <path>]
//   node mint-clock.bench.mjs --cdp <port> --door-port <port> --door <origin the browser reaches> --profile <user-data-dir> ...
//     drives a browser already open (lysa's, over an ssh tunnel: mint-clock.lysa.mjs). Any browser must prove it is this run's
//     (Browser.getBrowserCommandLine carries --user-data-dir=<profile>, under --enable-automation) or nothing is touched.
// COST: one Chrome (~300 MB) for 60 to 150 s; run it under nice -n 19 and tools/dead-tasks/bounded.mjs on the serving Mac. Ends
// everything it started (the Chrome by pid, its profile folder, the door); a remote browser is asked to close.
import fs from 'node:fs';
import os from 'node:os';
import net from 'node:net';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '../../../../..');   // embertide-app/ui/intro/dyson-society/lab -> the house (the worktree) root
const PAGE = '/embertide-app/ui/intro/dyson-society/lab/mint-clock.html';
const FACE_ORIGIN = 'https://pbs.twimg.com';
const args = process.argv.slice(2), has = k => args.includes(k), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', path.join(HERE, 'mint-clock-pictures')));
const [W, H] = opt('--size', '1600x1000').split('x').map(Number);   // the stage is 900 px tall at 1600 wide: the hint line and the stage fit
const FRAMES = Number(opt('--frames', 300)), UNTIL = Number(opt('--until', 10230)), NAME = opt('--name', null);
const PICTURES = !has('--no-pictures'), FPS = !has('--no-fps');
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Chromium.app/Contents/MacOS/Chromium', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'];
const CHROME = opt('--chrome', process.env.GLASS_PROOF_CHROME || CHROMES.find(c => fs.existsSync(c)));
const CDP = opt('--cdp', null), DOOR_PORT = Number(opt('--door-port', 0)), DOOR = opt('--door', null), PROFILE = opt('--profile', null);
const LADDER = Array.from({ length: 31 }, (_, i) => 10 * ((i + 2) ** 2 - 1));   // the class I Goldbergs GP(n,0), n = 2..32
const TYPES = { html: 'text/html; charset=utf-8', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml', mp4: 'video/mp4', woff2: 'font/woff2', woff: 'font/woff' };
const sleep = ms => new Promise(r => setTimeout(r, ms));
const stat = xs => { const s = [...xs].sort((a, b) => a - b), at = p => s[Math.min(s.length - 1, Math.floor(p * s.length))]; return s.length ? { n: s.length, min: s[0], median: at(.5), p95: at(.95), max: s[s.length - 1] } : null; };
const FLAGS = ['--headless=new', '--mute-audio', '--enable-automation', '--remote-allow-origins=*', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', '--disable-default-apps',
  '--disable-features=Translate,MediaRouter,OptimizationHints,IsolateOrigins,site-per-process', '--disable-site-isolation-trials',
  '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', '--force-color-profile=srgb', '--autoplay-policy=user-gesture-required'];

/** The door: this tree's files, GET and HEAD, loopback only (a fixed port when an ssh -R must reach it). */
function door(root, port = 0) {
  root = fs.realpathSync(root);
  const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    let fp; try { fp = fs.realpathSync(path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname))); } catch { res.writeHead(404); return res.end(); }
    if (fp !== root && !fp.startsWith(root + path.sep)) { res.writeHead(403); return res.end(); }
    let st; try { st = fs.statSync(fp); } catch { res.writeHead(404); return res.end(); }
    if (st.isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'content-type': TYPES[path.extname(fp).slice(1).toLowerCase()] || 'application/octet-stream', 'content-length': st.size, 'cache-control': 'no-store' });
    return req.method === 'HEAD' ? res.end() : fs.createReadStream(fp).pipe(res);
  });
  return new Promise((resolve, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', () => resolve({ origin: `http://127.0.0.1:${server.address().port}`, port: server.address().port, close: () => new Promise(r => { server.closeAllConnections?.(); server.close(() => r()); }) })); });
}

/** A port the OS says is free here (a tunnel's local end; the OS, never a fixed number: another seat's tunnel may hold it). */
export function freePort() {
  return new Promise((resolve, reject) => { const s = net.createServer(); s.once('error', reject); s.listen(0, '127.0.0.1', () => { const p = s.address().port; s.close(() => resolve(p)); }); });
}

async function spawnChrome(profile) {
  if (!CHROME) throw new Error('no Chrome on this Mac');
  const child = spawn(CHROME, [...FLAGS, '--remote-debugging-port=0', `--user-data-dir=${profile}`, `--window-size=${W},${H}`, 'about:blank'], { stdio: 'ignore' });
  let port = null;
  for (let i = 0; i < 400 && !port; i++) { await sleep(150); if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`); try { port = Number(fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {} }
  if (!port) throw new Error('Chrome did not open its debugging port in 60 s');
  return { child, port };
}

/** Drive the page in the browser at `port`: the browser proves it is this run's first; the page reads nothing but the door (and `allow`). */
async function drive({ port, origin, allow = [], profile, fn, log = console.log }) {
  const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then(r => r.json());
  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
  let id = 0; const wait = new Map(), events = [], errors = [], refused = [];
  // a call that is never answered is an error after 60 s, never a hung run (the browser may be gone, or not ours)
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => {
    const n = ++id, timer = setTimeout(() => { if (wait.delete(n)) reject(new Error(`${method}: no answer in 60 s`)); }, 60000);
    wait.set(n, { resolve: v => { clearTimeout(timer); resolve(v); }, reject: e => { clearTimeout(timer); reject(e); }, method });
    ws.send(JSON.stringify({ id: n, method, params, sessionId }));
  });
  ws.onmessage = m => {
    const x = JSON.parse(m.data);
    if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
    if (x.method === 'Fetch.requestPaused') {
      const url = x.params.request.url, ok = url.startsWith(origin + '/') || allow.some(o => url.startsWith(o + '/'));
      if (ok) send('Fetch.continueRequest', { requestId: x.params.requestId }, x.sessionId).catch(() => {});
      else { refused.push(url.slice(0, 100)); send('Fetch.failRequest', { requestId: x.params.requestId, errorReason: 'BlockedByClient' }, x.sessionId).catch(() => {}); }
      return;
    }
    if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 300));
    if (x.method === 'Runtime.consoleAPICalled' && x.params.type === 'error') errors.push('console: ' + x.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 300));
    events.push(x.method);
  };
  try {
    const cmd = await send('Browser.getBrowserCommandLine');
    const mine = cmd.arguments.some(a => a === `--user-data-dir=${profile}`);
    if (!mine) throw new Error(`not this run's browser: it runs ${cmd.arguments.filter(a => a.startsWith('--user-data-dir')).join(' ') || 'no profile flag'}; nothing touched`);
    log(`browser ${ver.Browser}, this run's (${profile})`);
    const t = await send('Target.createTarget', { url: 'about:blank', newWindow: true, width: W, height: H });
    const s = (await send('Target.attachToTarget', { targetId: t.targetId, flatten: true })).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable']) await send(m, {}, s);
    await send('Fetch.enable', { patterns: [{ urlPattern: '*', requestStage: 'Request' }] }, s);
    await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false }, s);
    await send('Emulation.setFocusEmulationEnabled', { enabled: true }, s); await send('Page.bringToFront', {}, s).catch(() => {});
    const loaded = new Promise(r => { const iv = setInterval(() => { if (events.includes('Page.loadEventFired')) { clearInterval(iv); r(); } }, 50); });
    const nav = await send('Page.navigate', { url: `${origin}${PAGE}?bench=1${allow.includes(FACE_ORIGIN) ? '' : '&face=0'}` }, s);
    if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    await Promise.race([loaded, sleep(20000)]);
    const ev = async (expression, awaitPromise = true) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise }, s); if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 400)); return r.result?.value; };
    // a picture: the viewport scrolled to the stage (the hint line above it) or to the calls and the log; JPEG, so the record stays light
    const shot = async (name, at = '#oath-sphere') => {
      await ev(`scrollTo({top: Math.max(0, document.querySelector(${JSON.stringify(at)}).offsetTop - 72), behavior: 'instant'})`, false);   // warm.css scrolls smooth: a picture mid-scroll otherwise
      await ev('new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)))');
      const r = await send('Page.captureScreenshot', { format: 'jpeg', quality: 90, captureBeyondViewport: false }, s);
      const fp = path.join(OUT, `${name}.jpg`); fs.writeFileSync(fp, Buffer.from(r.data, 'base64')); log(`  picture ${name} (${(fs.statSync(fp).size / 1024).toFixed(0)} KB)`); return path.basename(fp);
    };
    const star = await ev('window.__clock ? window.__clock.ready : Promise.reject(new Error("no __clock on the page"))');
    const out = await fn({ ev, shot, send, s, errors, refused, star, browser: ver.Browser });
    if (CDP) await send('Browser.close').catch(() => {});
    return out;
  } finally { try { ws.close(); } catch {} }
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  const results = { at: new Date().toISOString(), host: os.hostname(), load: os.loadavg(), size: `${W}x${H}`, remote: Boolean(CDP), pictures: [], rest: null, fps: [] };
  const d = await door(ROOT, DOOR_PORT);
  let chrome = null, profile = PROFILE;
  if (!CDP) { profile = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'mint-clock-chrome-')); chrome = await spawnChrome(profile); console.log(`chrome pid ${chrome.child.pid}, door ${d.origin}`); }
  else if (!PROFILE || !DOOR) throw new Error('--cdp needs --profile (the browser must prove it is ours) and --door (the origin it reaches)');
  const end = async () => {
    if (chrome) { try { chrome.child.kill('SIGTERM'); } catch {} for (let i = 0; i < 30 && chrome.child.exitCode === null && chrome.child.signalCode === null; i++) await sleep(100);
      if (chrome.child.exitCode === null && chrome.child.signalCode === null) { try { chrome.child.kill('SIGKILL'); } catch {} await sleep(200); } try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} }
    await d.close();
  };
  const onSig = () => end().then(() => process.exit(3)); process.on('SIGTERM', onSig); process.on('SIGINT', onSig);
  try {
    await drive({ port: CDP ? Number(CDP) : chrome.port, origin: DOOR || d.origin, allow: PICTURES && !CDP ? [FACE_ORIGIN] : [], profile, fn: async ({ ev, shot, send, errors, refused, star, browser }) => {
      results.browser = browser; results.star = star;
      results.info = await ev('window.__clock.info()');
      const sys = await send('SystemInfo.getInfo').catch(() => null);
      results.canvas2d = sys?.gpu?.featureStatus?.['2d_canvas'] ?? 'unknown'; results.gl = sys?.gpu?.auxAttributes?.glRenderer ?? null;
      console.log(`canvas ${results.info.canvas} (${results.canvas2d}; gl ${results.gl}); dpr ${results.info.dpr}; stage ${results.info.size.join('x')}; star ${star}`);
      const frame = () => ev('new Promise(r => requestAnimationFrame(() => r()))');
      const rest = async () => { for (let i = 0; i < 600; i++) { if (!(await ev('window.__clock.stats().alive', false))) return i; await frame(); } throw new Error('the page never rested'); };
      if (PICTURES) {
        await rest(); results.pictures.push(await shot('1-genesis-30-seats-at-0'));
        const g = await ev('window.__clock.buy(0, "gold")', false);
        console.log(`a gold at genesis: $${g.t}, the marks of ${g.opened.join(' and ')} reached in one cause`);
        await rest(); results.pictures.push(await shot('2-one-gold-opens-two-rungs-at-1000'));
        const script = await ev('window.__clock.crowd(7)', false);
        console.log(`the crowd's script from here: ${script.length} causes`);
        let k = 0, r = null;
        const until = async pred => { while (k < script.length) { r = await ev(`window.__clock.apply(${JSON.stringify(script[k++])})`, false); if (r.why) throw new Error(r.why); if (pred(r)) return r; } return r; };
        await until(x => x.rung === 7); await rest(); results.pictures.push(await shot(`3-the-top-rung-opens-at-${r.t}`));
        await until(x => x.finale.level >= 4); await rest(); results.pictures.push(await shot(`4-the-close-refines-level-${r.finale.level}-at-${r.t}`));
        await until(x => x.finale.closed); results.pictures.push(await shot(`5-the-flare-at-the-last-seat-${r.t}`));
        await rest(); results.pictures.push(await shot(`6-closed-on-the-star-at-${r.t}`));
        results.arc = { causes: k + 1, t: r.t, finale: r.finale };
        await ev('window.__clock.scrub(2500)', false); await frame(); await frame(); results.pictures.push(await shot('7-the-slider-at-2500'));
        await ev('window.__clock.live()', false); await rest();
        results.pictures.push(await shot('8-his-three-calls-and-the-log', '.calls'));
      }
      await rest();
      results.rest = await ev(`window.__clock.benchRest(${FRAMES})`);
      console.log(`rest: ${results.rest.draws} draws in ${results.rest.frames} frames`);
      if (FPS) for (const cap of LADDER) {
        if (cap > UNTIL) break;
        const b = await ev(`window.__clock.benchDraw(${cap}, 60)`);
        const row = { capacity: cap, faces: b.faces, setup_ms: b.setup_ms, draw: stat(b.draw_ms), raf: stat(b.raf_ms) };
        results.fps.push(row);
        console.log(`${String(cap).padStart(5)} cells: draw ${row.draw.median.toFixed(1)} ms (p95 ${row.draw.p95.toFixed(1)}); frame ${row.raf.median.toFixed(1)} ms (p95 ${row.raf.p95.toFixed(1)}) = ${(1000 / row.raf.median).toFixed(0)} fps; skin ${b.setup_ms.toFixed(0)} ms`);
        // a frame is a whole number of vsyncs: 16.7 ms is 60 fps, 33.3 is 30 fps still; under 30 fps is a median past two vsyncs (over 40 ms)
        if (results.fps.length >= 2 && results.fps.at(-1).raf.median > 40 && results.fps.at(-2).raf.median > 40) break;
      }
      results.under60 = results.fps.find(r => r.raf.median > 20)?.capacity ?? null;
      results.under30 = results.fps.find(r => r.raf.median > 40)?.capacity ?? null;
      if (FPS) console.log(`Canvas 2D: 60 fps ${results.under60 ? `lost at ${results.under60} cells` : `held to ${results.fps.at(-1)?.capacity} cells`}; 30 fps ${results.under30 ? `lost at ${results.under30} cells` : `held to ${results.fps.at(-1)?.capacity} cells`}`);
      results.errors = errors.splice(0); results.refused = refused.splice(0);
      if (results.errors.length) console.log('page errors: ' + results.errors.join(' | '));
      if (results.refused.length) console.log('refused: ' + results.refused.join(', '));
    } });
  } finally { process.off('SIGTERM', onSig); process.off('SIGINT', onSig); await end(); }
  const receipt = path.join(OUT, NAME ? `mint-clock.bench.${NAME}.json` : 'mint-clock.bench.json');
  fs.writeFileSync(receipt, JSON.stringify(results, null, 1));
  console.log(`wrote ${receipt}`);
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(e => { console.error('bench failed: ' + (e.stack || e)); process.exit(1); });

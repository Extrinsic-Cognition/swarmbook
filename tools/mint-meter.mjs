#!/usr/bin/env node
// mint-meter.mjs · THE MINT PAGE'S COST, READ (Oct 15 2026; his "shit is lagging shit is heavy"; house/CLAUDE.md The performance culture: cost
// first, number first, a landing without a number is not a landing). A muted headless Chrome off every screen loads app/warm.html, lets it settle,
// seeks the film where asked, and reads six seconds at rest: the main thread's task and script time (CDP Performance), the screen frames and the 2D
// and WebGL calls a second (counted, no stack captured: a stack a call cost more than the page did on the first try), the CPU by script and by the
// nearest JS caller of each native call (CDP Profiler), the bytes by kind, the heap, the console's errors.
//   nice -n 19 node tools/mint-meter.mjs --url http://127.0.0.1:8921/intro/dyson-society/app/warm.html [--seek 20] [--mobile] [--scroll '#genesis-sphere'] [--label before]
// A plain clone has no films (app/saint-seiya.{mp4,m4a} are not in git): --serve [port] serves ../.. (embertide-app/ui/intro) with Range answers
// (206) from this process, and --standin <dir> lays a stand-in pair over the films' names from that dir (saint-seiya.mp4 and saint-seiya.m4a, or
// WebM under those names: the headless Chrome of playwright decodes no H.264 or AAC; a WebM is served as webm whatever its name). To make one:
//   ffmpeg -f lavfi -i "testsrc2=size=960x540:rate=30" -f lavfi -i "sine=frequency=440:sample_rate=48000" -t 154.311 -c:v libvpx-vp9 -deadline realtime -cpu-used 8 -row-mt 1 -b:v 940k -pix_fmt yuv420p -c:a libopus -b:a 123k -ac 2 -f webm saint-seiya.mp4
//   ffmpeg -i saint-seiya.mp4 -vn -c:a copy -f webm saint-seiya.m4a
// The numbers here are this box's (a CPU-rastered canvas with no GPU); the ones that count are read where he stands (lysa, a phone, the Mac).
import {createServer} from 'node:http';
import {createReadStream, statSync, existsSync, openSync, readSync, closeSync} from 'node:fs';
import {join, extname, normalize, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const arg = (k, d = null) => { const i = process.argv.indexOf(k); return i > 0 && !process.argv[i + 1]?.startsWith('--') ? process.argv[i + 1] : i > 0 ? true : d; };
const here = dirname(fileURLToPath(import.meta.url));
const MIME = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.wasm': 'application/wasm', '.mp4': 'video/mp4', '.m4a': 'audio/mp4', '.woff2': 'font/woff2', '.glb': 'model/gltf-binary'};

/** serve(root, port, standin): a static server with Range answers; a stand-in dir's files answer under the films' names; WebM bytes go out as webm. */
export function serve(root, port, standin = null) {
  const server = createServer((req, res) => {
    const url = new URL(req.url, 'http://x'); let p = normalize(decodeURIComponent(url.pathname)); if (p.endsWith('/')) p += 'index.html';
    let file = join(root, p);
    if (standin && /\/dyson-society\/app\/saint-seiya\.(mp4|m4a)$/.test(p)) file = join(standin, p.slice(p.lastIndexOf('/') + 1));
    if (!file.startsWith(root) && !(standin && file.startsWith(standin))) { res.writeHead(403); return res.end(); }
    if (!existsSync(file) || !statSync(file).isFile()) { res.writeHead(404); return res.end(); }
    const size = statSync(file).size; let type = MIME[extname(file)] || 'application/octet-stream';
    { const fd = openSync(file, 'r'), b = Buffer.alloc(4); readSync(fd, b, 0, 4, 0); closeSync(fd); if (b.readUInt32BE(0) === 0x1A45DFA3) type = extname(file) === '.m4a' ? 'audio/webm' : 'video/webm'; }
    const range = /bytes=(\d*)-(\d*)/.exec(req.headers.range || '');
    res.setHeader('Accept-Ranges', 'bytes'); res.setHeader('Content-Type', type); res.setHeader('Cache-Control', 'no-store');
    if (range) {
      const a = range[1] ? +range[1] : Math.max(0, size - +range[2]), b = range[2] && range[1] ? Math.min(+range[2], size - 1) : size - 1;
      res.writeHead(206, {'Content-Range': `bytes ${a}-${b}/${size}`, 'Content-Length': b - a + 1}); return createReadStream(file, {start: a, end: b}).pipe(res);
    }
    res.writeHead(200, {'Content-Length': size}); createReadStream(file).pipe(res);
  });
  return new Promise(resolve => server.listen(port, '127.0.0.1', () => resolve(server)));
}

/** meter({url, seek, mobile, scroll, settleMs, windowMs}): the page read at rest; returns the numbers and prints them. */
export async function meter({url, seek = null, mobile = false, scroll = null, settleMs = 6000, windowMs = 6000, label = 'page', browsers = process.env.PLAYWRIGHT_BROWSERS_PATH} = {}) {
  const require = createRequire(import.meta.url);
  const pw = ['playwright-core', 'playwright', '/opt/node-tools/node_modules/playwright-core'].map(n => { try { return require(n); } catch { return null; } }).find(Boolean);
  if (!pw) throw new Error('playwright-core is not on this box (npm i -g playwright-core, or PLAYWRIGHT_BROWSERS_PATH with its Chromium)');
  const browser = await pw.chromium.launch({headless: true, args: ['--autoplay-policy=no-user-gesture-required', '--mute-audio']});
  const context = await browser.newContext(mobile
    ? {viewport: {width: 390, height: 844}, deviceScaleFactor: 2, isMobile: true, hasTouch: true, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'}
    : {viewport: {width: 1280, height: 800}});
  const page = await context.newPage();
  await page.addInitScript(() => {
    const counts = {};
    const site = () => { const s = (new Error().stack || '').split('\n'); for (const l of s.slice(2)) { const m = /(https?:\/\/[^\s)]+?)(:\d+:\d+)?\)?$/.exec(l.trim()); if (m) return m[1].replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, ''); } return '?'; };
    const wrap = (obj, name, tag) => { const f = obj[name]; obj[name] = function (...a) { const k = tag + ' ' + site(); counts[k] = (counts[k] || 0) + 1; return f.apply(this, a); }; };
    wrap(window, 'requestAnimationFrame', 'raf'); wrap(window, 'setTimeout', 'timeout'); wrap(window, 'setInterval', 'interval');
    if (HTMLVideoElement.prototype.requestVideoFrameCallback) wrap(HTMLVideoElement.prototype, 'requestVideoFrameCallback', 'rvfc');
    const get = CanvasRenderingContext2D.prototype.getImageData; CanvasRenderingContext2D.prototype.getImageData = function (...a) { const k = 'getImageData ' + site(); counts[k] = (counts[k] || 0) + 1; return get.apply(this, a); };
    for (const name of ['drawImage', 'fill', 'stroke', 'arc', 'lineTo', 'clip', 'fillText', 'putImageData', 'clearRect']) { const f = CanvasRenderingContext2D.prototype[name]; CanvasRenderingContext2D.prototype[name] = function (...a) { counts['2d.' + name] = (counts['2d.' + name] || 0) + 1; return f.apply(this, a); }; }
    for (const proto of [window.WebGL2RenderingContext?.prototype, window.WebGLRenderingContext?.prototype].filter(Boolean)) for (const name of ['texSubImage2D', 'texImage2D', 'drawArrays', 'drawElements', 'drawElementsInstanced', 'readPixels']) { const f = proto[name]; if (!f) continue; proto[name] = function (...a) { counts['gl.' + name] = (counts['gl.' + name] || 0) + 1; return f.apply(this, a); }; }
    window.__meter = {snap: () => ({...counts})};
  });
  const bytes = {}, errors = [];
  page.on('response', async r => { try { const b = await r.body(); const t = r.request().resourceType(); bytes[t] = (bytes[t] || 0) + b.length; bytes.__files = (bytes.__files || 0) + 1; } catch {} });
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0, 160)); });
  page.on('pageerror', e => errors.push('pageerror: ' + String(e).slice(0, 160)));
  const cdp = await context.newCDPSession(page); await cdp.send('Performance.enable'); await cdp.send('Profiler.enable'); await cdp.send('Profiler.setSamplingInterval', {interval: 500});
  const t0 = Date.now(); await page.goto(url, {waitUntil: 'load', timeout: 60000}); const loadMs = Date.now() - t0;
  if (scroll) await page.evaluate(sel => document.querySelector(sel)?.scrollIntoView({block: 'center'}), scroll);
  await page.waitForTimeout(settleMs);
  if (seek !== null) { await page.evaluate(t => { const f = document.getElementById('dl-twelve-film'); if (f) { f.currentTime = t; f.play().catch(() => {}); } }, Number(seek)); await page.waitForTimeout(3000); }
  const film = await page.evaluate(() => { const f = document.getElementById('dl-twelve-film'); return f ? {t: +f.currentTime.toFixed(1), paused: f.paused, ready: f.readyState, w: f.videoWidth} : null; });
  const sphere = await page.evaluate(() => window.genesisSphere?.getViewState?.() ?? null);
  const metric = async () => Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(m => [m.name, m.value]));
  const before = await page.evaluate(() => window.__meter.snap()), m0 = await metric(); await cdp.send('Profiler.start');
  await page.waitForTimeout(windowMs);
  const {profile} = await cdp.send('Profiler.stop'); const after = await page.evaluate(() => window.__meter.snap()), m1 = await metric();
  await browser.close();
  const perSec = Object.entries(after).map(([k, v]) => [k, (v - (before[k] || 0)) / (windowMs / 1000)]).filter(([, v]) => v > 0.2).sort((a, b) => b[1] - a[1]);
  const self = {}, byUrl = {}, owner = {}, dt = profile.timeDeltas, idx = new Map(profile.nodes.map(n => [n.id, n])), parent = new Map();
  for (const n of profile.nodes) for (const c of n.children || []) parent.set(c, n.id);
  const clean = u => (u || '').replace(/^https?:\/\/[^/]+/, '').replace(/\?.*$/, '');
  for (let i = 0; i < profile.samples.length; i++) {
    const n = idx.get(profile.samples[i]), cf = n.callFrame, u = clean(cf.url) || '(native)', k = `${u} ${cf.functionName || '(anon)'}:${cf.lineNumber + 1}`;
    self[k] = (self[k] || 0) + (dt[i] || 0); byUrl[u] = (byUrl[u] || 0) + (dt[i] || 0);
    let m = n; while (m && !clean(m.callFrame.url)) m = idx.get(parent.get(m.id));
    const o = m ? `${clean(m.callFrame.url)} ${m.callFrame.functionName || '(anon)'}:${m.callFrame.lineNumber + 1}` : (cf.functionName === '(idle)' ? '(idle)' : `(no JS caller: ${cf.functionName || '?'})`);
    owner[o] = (owner[o] || 0) + (dt[i] || 0);
  }
  const top = (o, n = 14) => Object.entries(o).sort((a, b) => b[1] - a[1]).slice(0, n).map(([k, v]) => `${(v / 1000).toFixed(1).padStart(7)} ms  ${k}`);
  const d = k => Math.round((m1[k] - m0[k]) * 1000);
  const total = Object.entries(bytes).filter(([k]) => k !== '__files').reduce((s, [, v]) => s + v, 0);
  const out = {label, url, mobile, seek, film, sphere: sphere && {kernel: sphere.kernel, stageSide: sphere.stageSide}, loadMs, files: bytes.__files, bytes: total, task_ms: d('TaskDuration'), script_ms: d('ScriptDuration'), layout_ms: d('LayoutDuration'), style_ms: d('RecalcStyleDuration'), heap_mb: +(m1.JSHeapUsedSize / 1048576).toFixed(1), perSec: Object.fromEntries(perSec.slice(0, 25).map(([k, v]) => [k, +v.toFixed(1)])), byUrl: Object.fromEntries(Object.entries(byUrl).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([k, v]) => [k, +(v / 1000).toFixed(1)])), owner: Object.fromEntries(Object.entries(owner).sort((a, b) => b[1] - a[1]).slice(0, 14).map(([k, v]) => [k, +(v / 1000).toFixed(1)])), errors: [...new Set(errors)].slice(0, 8)};
  console.log(`\n==== ${label} ${mobile ? '(mobile 390x844)' : '(desktop 1280x800)'}${seek !== null ? ` film sought to ${seek} s` : ''} film ${JSON.stringify(film)} sphere ${JSON.stringify(out.sphere)}`);
  console.log(`load ${loadMs} ms; files ${bytes.__files}; bytes ${(total / 1024).toFixed(0)} KB (${Object.entries(bytes).filter(([k]) => k !== '__files').map(([k, v]) => `${k} ${(v / 1024).toFixed(0)}`).join(', ')})`);
  console.log(`in ${windowMs / 1000} s at rest: task ${out.task_ms} ms, script ${out.script_ms} ms, layout ${out.layout_ms} ms, style ${out.style_ms} ms; heap ${out.heap_mb} MB`);
  console.log('a second:'); for (const [k, v] of perSec.slice(0, 16)) console.log(`  ${v.toFixed(1).padStart(8)}/s  ${k}`);
  console.log('CPU by script:'); for (const l of top(byUrl, 8)) console.log('  ' + l);
  console.log('CPU by nearest JS caller (its native children counted in):'); for (const l of top(owner)) console.log('  ' + l);
  if (errors.length) { console.log('console errors:'); for (const e of out.errors) console.log('  ' + e); }
  return out;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const servePort = arg('--serve'), standin = arg('--standin');
  const server = servePort ? await serve(join(here, '..', '..'), servePort === true ? 8931 : Number(servePort), standin) : null;
  const url = arg('--url') || `http://127.0.0.1:${servePort === true ? 8931 : servePort}/dyson-society/app/warm.html`;
  const seek = arg('--seek'), label = arg('--label', 'page');
  const runs = process.argv.includes('--all') ? [{}, {seek: 20}, {mobile: true}] : [{seek: seek === null ? null : Number(seek), mobile: Boolean(arg('--mobile')), scroll: arg('--scroll')}];
  const out = [];
  for (const r of runs) out.push(await meter({url, label: label + (r.seek ? `-t${r.seek}` : '') + (r.mobile ? '-mobile' : ''), ...r}));
  if (arg('--json')) (await import('node:fs')).writeFileSync(arg('--json'), JSON.stringify(out, null, 1));
  server?.close();
}

#!/usr/bin/env node
// unboxing.proof.mjs: the hero's unboxing (unboxing.js in hero-ab.html, at his paywall and conversion tags) proved in a muted headless
// Chrome over CDP, off every screen (the app's Browser pane runs no frames while it is hidden).
//   node unboxing.proof.mjs --out <dir> [--size 1440x900] [--dpr 2] [--chrome <path>] [--nest http://127.0.0.1:8904] [--no-pictures]
// - Pictures at the film seconds the task names, the film paused there (the box is a pure function of the film's second; the page's own
//   sphere keeps turning, as it does), clipped to the hero's stage, the lab's panel hidden for the picture.
// - The hand-over: at the gold star (42.342 s) and at the end, shut and home before it fades (61.767 + 5.2 + 4.7 s), with the page's motion
//   paused so its pose stands still, the stage with the box out (the page's skin hushed) against the page's own sphere at the same instant:
//   the pixel difference in the sphere's square.
// - The cost while it plays, five windows (A with no box, the burst and the opening, the cloth turning, Seiya and the shut, A after): the box's draws a second by
//   cause (the film's frames, the screen's), its JS and GPU ms a draw (EXT_disjoint_timer_query_webgl2: a query on ANGLE Metal carries a
//   floor of about 0.2 ms), the theater's draws, the page's frames; then at rest (the page's own Pause) all of them must be 0.
// The door: this tree's embertide-app/ui at / (so the page is /intro/dyson-society/lab/hero-ab.html, as aiolos serves it), byte ranges (a
// film seeks), GET only. The one other request let through is his tags' read, GET <nest>/nest/ref/mint/seiya-tags; everything else is
// refused and listed. Writes <out>/unboxing.proof.json and the PNGs (they hold the film's frames: keep them out of git).
// --hear: THE WORLDS HEAR THE FILM (orbit-kick.js): the sphere's frames (warm.html's animation-frame callbacks: its whole draw) timed with the
// worlds hearing the film and not, the same windows of it alternately, twice each; pictures of the stage at --at seconds (or the defaults
// below), the page's motion paused, hearing and not at the same instant; and what the worlds read of the score drawn as a chart (hear-chart.png).
// COST: one Chrome (about 500 MB) for about three minutes; run it under nice -n 19 and tools/dead-tasks/bounded.mjs on the new Mac, never on
// the serving Mac (his word, Oct 14 2026 18:1x: it serves his page and renders it).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const UI = path.resolve(HERE, '../../..');   // embertide-app/ui
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
// --query a=b&c=d: more of the page's own options (a variant to show him, e.g. empty=knights); --at 46.5,51.2: the pictures' seconds;
// --pictures-only: the pictures and nothing after them (no hand-over, no windows, no rest); --viewport: the pictures of the whole window, not the
// stage (THE FOLD's dark is the whole page's)
const PAGE = `/intro/dyson-society/lab/hero-ab.html?v=film&paywall=off&her=on${opt('--query', '') ? `&${opt('--query', '')}` : ''}`;
const OUT = path.resolve(opt('--out', path.join(os.tmpdir(), 'unboxing-proof')));
const [W, H] = opt('--size', '1440x900').split('x').map(Number), DPR = Number(opt('--dpr', 2));
const NEST = opt('--nest', 'http://127.0.0.1:8904').replace(/\/$/, '');
const PICTURES = !args.includes('--no-pictures');
// Athena's cut (her matte) and her shot, the flood; the box's slow opening from the gold star (42.34 s) to the gold centaur (50.05 s), with his
// 47.2 s; its faces leaving for the worlds at the knights (53.05 s) and riding them (his 58.7 s); Seiya rising, the faces coming back, shut,
// the wings, Athena again over the ascent
const SECONDS = opt('--at', '') ? opt('--at', '').split(',').map(Number).filter(Number.isFinite)
  : [28.15, 30, 37.6, 42.9, 44.6, 47.2, 49.0, 50.1, 53.3, 54.0, 55.5, 58.7, 62.5, 65, 67.4, 68.3, 69.8, 70.6, 71.3, 73];
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', '/Applications/Chromium.app/Contents/MacOS/Chromium'];
const CHROME = opt('--chrome', CHROMES.find(c => fs.existsSync(c)));
const TYPES = {html: 'text/html; charset=utf-8', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg', svg: 'image/svg+xml', mp4: 'video/mp4', m4a: 'audio/mp4', woff2: 'font/woff2', glb: 'model/gltf-binary'};
const sleep = ms => new Promise(r => setTimeout(r, ms));
// --load [--paused]: the first LOAD_S seconds of the page from its first byte, every frame instrumented before its own scripts run: long tasks
// (with their attribution), long animation frames (with the scripts that made them), the gaps between frames, and the box's own setup steps
// ('unboxing:*' measures); --paused presses the page's own Pause as soon as it exists, so the film never plays; --cold gives every fragment shader
// of the run a line of its own that is never true, so no shader cache on this Mac (Metal's is the system's, outside Chrome's profile) knows it:
// a first visit's compiles and pipelines
const LOAD_S = Number(opt('--seconds', 15)), NONCE = 1 + Math.floor(Math.random() * 1e6);
const INSTRUMENT = `(() => {
  const log = window.__loadLog = {href: location.href, origin: performance.timeOrigin, longtasks: [], loafs: [], gaps: [], frames: 0};
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) log.longtasks.push({start: e.startTime, dur: e.duration,
    by: (e.attribution || []).map(a => [a.containerType, a.containerName || a.containerSrc || a.containerId].join(' '))}); }).observe({type: 'longtask', buffered: true}); } catch (e) {}
  try { new PerformanceObserver(l => { for (const e of l.getEntries()) log.loafs.push({start: e.startTime, dur: e.duration, blocking: e.blockingDuration,
    scripts: (e.scripts || []).map(s => ({src: (s.sourceURL || '').split('/').pop(), fn: s.sourceFunctionName, invoker: s.invoker, dur: s.duration, start: s.startTime}))}); })
    .observe({type: 'long-animation-frame', buffered: true}); } catch (e) {}
  // the time each frame's callback actually runs (a frame's own timestamp is its vsync's, the same however late the main thread gets to it)
  let last = 0; const tick = () => { const now = performance.now(); log.frames++; if (last && now - last > 25) log.gaps.push({at: last, gap: now - last}); last = now; if (now < ${LOAD_S * 1000 + 500}) requestAnimationFrame(tick); };
  requestAnimationFrame(tick);
  if (${args.includes('--cold')}) for (const C of [window.WebGLRenderingContext, window.WebGL2RenderingContext].filter(Boolean)) {
    const create = C.prototype.createShader, source = C.prototype.shaderSource, kinds = new WeakMap();
    C.prototype.createShader = function (kind) { const shader = create.call(this, kind); if (shader) kinds.set(shader, kind); return shader; };
    C.prototype.shaderSource = function (shader, text) {
      if (kinds.get(shader) === this.FRAGMENT_SHADER) text = text.replace(/void\s+main\s*\(\s*(void)?\s*\)\s*\{/, (m) => m + ' if (gl_FragCoord.x < -${NONCE}.5) discard; ');
      return source.call(this, shader, text);
    };
  }
  if (${args.includes('--paused')} && location.pathname.endsWith('/app/warm.html')) {
    // the film's own Pause ("Pause the mint film and motion"; #motion only stops the sphere's turn), pressed as soon as it exists, and the film
    // held paused for the first five seconds should the page start it after the press
    const t0 = performance.now(), iv = setInterval(() => {
      const b = document.querySelector('[data-twelve-pause]'), f = document.getElementById('dl-twelve-film');
      if (b && b.getAttribute('aria-pressed') !== 'true') b.click(); else if (f && !f.paused) f.pause();
      if (performance.now() - t0 > 5000) clearInterval(iv);
    }, 20);
  }
})();`;
// --hear: each animation-frame callback of the sphere's page (warm.html), timed
const RAF_COST = `(() => {
  if (!location.pathname.endsWith('/app/warm.html')) return;
  const raf = window.requestAnimationFrame.bind(window), log = window.__rafCost = [];
  window.requestAnimationFrame = (cb) => raf((ts) => { const t0 = performance.now(); try { cb(ts); } finally { if (log.length < 100000) log.push(performance.now() - t0); } });
})();`;
// --hear: what the worlds hear, drawn as a chart in the page from the very modules it runs (the film's seconds across; the score's energy and
// what the worlds feel of it, the beats and the lines said, the swarm's breath, how far out and how fast round the worlds go; his moments marked)
const HEAR_CHART = `(async () => {
  const {SCORE} = await import('/intro/dyson-society/lab/satellites-score.js');
  const {hearAt, throbAt, LOOP, FELT} = await import('/intro/dyson-society/lab/orbit-kick.js');
  const W = 2400, H = 900, L = 70, R = 30, T = 70, c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d'), x = (s) => L + (W - L - R) * s / LOOP, fps = SCORE.fps, V = SCORE.values;
  g.fillStyle = '#fbfaf6'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#2a2620'; g.font = '700 30px ui-sans-serif, system-ui'; g.fillText('What the twelve worlds hear: satellites-score.js, read by orbit-kick.js at the film\\'s second', L, 44);
  const band = (y0, h, label) => { g.fillStyle = '#6b6252'; g.font = '20px ui-sans-serif, system-ui'; g.fillText(label, L, y0 - 8); g.strokeStyle = '#e4dfd2'; g.lineWidth = 1; g.strokeRect(L, y0, W - L - R, h); };
  const curve = (y0, h, n, at, top, color, width = 2.5) => { g.beginPath(); for (let i = 0; i < n; i++) { const [s, v] = at(i); g[i ? 'lineTo' : 'moveTo'](x(s), y0 + h - h * Math.max(0, Math.min(1, v / top))); } g.strokeStyle = color; g.lineWidth = width; g.stroke(); };
  const y1 = T + 40, h1 = 200; band(y1, h1, 'the energy (the score\\'s slow curve, filled) and what the worlds feel of it (over 0.55, squared: line)');
  g.beginPath(); g.moveTo(x(0), y1 + h1);
  for (let i = 0; i < SCORE.frames; i++) g.lineTo(x(i / fps), y1 + h1 - h1 * V.energy[i] / 255);
  g.lineTo(x(LOOP), y1 + h1); g.closePath(); g.fillStyle = 'rgba(169,130,66,.35)'; g.fill();
  curve(y1, h1, SCORE.frames, (i) => [i / fps, FELT[i]], 1, '#7a5a22');
  const y2 = y1 + h1 + 50, h2 = 100; band(y2, h2, 'the beats (ticks over 0.3) and the lines said (bars, as long as each stands, as dark as it weighs)');
  g.strokeStyle = '#2a2620'; g.lineWidth = 1.5;
  for (let i = 0; i < SCORE.frames; i++) if (V.beat[i] > 76) { g.beginPath(); g.moveTo(x(i / fps), y2 + h2); g.lineTo(x(i / fps), y2 + h2 - 0.6 * h2 * V.beat[i] / 255); g.stroke(); }
  for (const [t0, t1, w] of SCORE.lines) { g.fillStyle = 'rgba(109,134,152,' + (0.2 + w).toFixed(2) + ')'; g.fillRect(x(t0), y2 + 6, Math.max(3, x(t1) - x(t0)), 26); }
  const y3 = y2 + h2 + 50, h3 = 110; band(y3, h3, 'the whole swarm at once: what is said, the bass\\'s pulses and the beats (out of the loop, 0 to 0.15)');
  curve(y3, h3, SCORE.frames, (i) => [i / fps, throbAt(i / fps)[0]], 0.15, '#438c82', 1.2);
  const y4 = y3 + h3 + 50, h4 = 170; band(y4, h4, 'along the trails, the energy: out of the loop (gold, 0 to 0.15) and the swarm\\'s turn speed (blue, 0 to 0.15 rad/s)');
  const n4 = Math.floor(LOOP / 0.05);
  curve(y4, h4, n4, (i) => [i * 0.05, hearAt(i * 0.05)[0]], 0.15, '#a98242');
  curve(y4, h4, n4, (i) => [i * 0.05, (hearAt(i * 0.05 + 0.05)[1] - hearAt(i * 0.05)[1]) / 0.05], 0.15, '#6d8698');
  g.fillStyle = '#6b6252'; g.font = '18px ui-monospace, monospace';
  for (let s = 0; s <= LOOP; s += 10) g.fillText(String(s), x(s) - 8, H - 22);
  const moments = [[11.044, 'burst'], [37.10, 'burst'], [42.342, 'gold star'], [50.05, 'centaur'], [53.053, 'knights'], [61.767, 'Seiya'], [69.67, 'shut']];
  g.font = '17px ui-sans-serif, system-ui';
  for (const [s, name] of moments) { g.strokeStyle = 'rgba(42,38,32,.35)'; g.setLineDash([4, 6]); g.beginPath(); g.moveTo(x(s), T + 40); g.lineTo(x(s), H - 46); g.stroke(); g.setLineDash([]); g.fillStyle = '#2a2620'; g.fillText(name, x(s) + 4, H - 48); }
  return c.toDataURL('image/png').split(',')[1];
})()`;
const stat = (xs) => { const s = xs.filter(Number.isFinite).sort((a, b) => a - b), at = p => s[Math.min(s.length - 1, Math.floor(p * s.length))]; return s.length ? {n: s.length, min: s[0], median: at(0.5), p95: at(0.95), max: s.at(-1)} : null; };

function door(root) {
  root = fs.realpathSync(root);
  const server = http.createServer((req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    let fp; try { fp = fs.realpathSync(path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname))); } catch { res.writeHead(404); return res.end(); }
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

// what the page runs for the proof: the film's seconds, the counters, the pictures' clip, the pixel difference of two pictures
const HELPER = `window.__proof = (() => {
  const H = window.hero, doc = () => H.frame.contentDocument, win = () => H.frame.contentWindow, film = () => doc().getElementById('dl-twelve-film');
  const frames = (n) => new Promise(r => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const motion = () => doc().getElementById('motion');
  const counts = () => ({box: H.unbox.draws, log: H.boxLog.length, theater: H.state().last?.draws ?? 0, page: H.kick.frames, at: performance.now(), t: film().currentTime});
  return {
    async ready() {
      const t0 = performance.now();
      while (!(H.unbox && film()?.readyState >= 3 && !/loading/.test(H.unbox.state.cloth.at + H.unbox.state.seiya.at) && !H.unbox.state.cloth.shattering &&
        !(H.unbox.state.held && H.unbox.state.held.done < H.unbox.state.held.want && !H.unbox.state.held.error))) {
        if (performance.now() - t0 > 60000) throw new Error('the hero did not come up in 60 s');
        await new Promise(r => setTimeout(r, 200));
      }
      const stage = doc().getElementById('sphere-stage').getBoundingClientRect();
      win().scrollBy(0, Math.round(stage.top + stage.height / 2 - win().innerHeight / 2));
      await frames(4);
      const gl = H.unbox.renderer.getContext(), info = gl.getExtension('WEBGL_debug_renderer_info');
      while (/loading/.test(H.unbox.state.athena?.at ?? '') && performance.now() - t0 < 60000) await new Promise(r => setTimeout(r, 200));
      return {renderer: info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER), timer: Boolean(gl.getExtension('EXT_disjoint_timer_query_webgl2')),
        dpr: devicePixelRatio, models: {cloth: H.unbox.state.cloth, seiya: H.unbox.state.seiya, athena: H.unbox.state.athena}, tags: H.state().used};
    },
    async seek(t, settle = 4) {
      const f = film(); f.pause();
      if (Math.abs(f.currentTime - t) > 1e-3) { f.currentTime = t; await new Promise(r => f.addEventListener('seeked', r, {once: true})); }
      await frames(settle);
      return f.currentTime;
    },
    // the page's own Pause (#motion): the sphere and the film stand still
    async motion(paused) { if ((motion().getAttribute('aria-pressed') === 'true') !== paused) motion().click(); await frames(3); return motion().getAttribute('aria-pressed'); },
    // the stage's square round the sphere, in this page's css px: the clip of a picture
    clip(k = 1.25, whole = false) {
      const s = doc().getElementById('sphere-stage').getBoundingClientRect(), v = win().genesisSphere.getViewState(), R = v.radius * Math.min(s.width, s.height);
      const cx = s.left + s.width * 0.55, cy = s.top + s.height * 0.5, x0 = Math.max(0, s.left), y0 = Math.max(0, s.top);
      if (whole) return {x: x0, y: y0, width: Math.min(innerWidth, s.right) - x0, height: Math.min(innerHeight, s.bottom) - y0};
      return {x: cx - k * R, y: cy - k * R, width: 2 * k * R, height: 2 * k * R, R};
    },
    panel(shown) { document.querySelector('.ab').style.visibility = shown ? '' : 'hidden'; document.querySelector('.ab').style.transition = 'none'; },
    // the box off (the page's own sphere draws) or on again, at the page's next frame
    async box(on) { H.unbox.setEnabled(on); H.unbox.sync(film().currentTime); win().genesisSphere.redraw(); await frames(4); return {out: H.unbox.out, hushed: H.kick.hushed}; },
    async play(from, to) {
      await this.seek(from, 3);
      const a = counts(), f = film();
      await f.play();
      while (f.currentTime < to && !f.paused) await new Promise(r => setTimeout(r, 50));
      f.pause();
      const b = counts(), draws = b.box > a.box ? H.boxLog.slice(-(b.box - a.box)) : [];
      const wall = (b.at - a.at) / 1000, by = {};
      for (const d of draws) by[d.reason] = (by[d.reason] ?? 0) + 1;
      return {from: a.t, to: b.t, wall_s: wall, box: {draws: b.box - a.box, per_s: (b.box - a.box) / wall, by, cpu: draws.map(d => d.cpuMs), gpu: draws.map(d => d.gpuMs).filter(v => v !== null),
        px: draws.at(-1) ? [draws.at(-1).w, draws.at(-1).h] : null, calls: draws.at(-1)?.calls ?? null, tris: draws.at(-1)?.triangles ?? null},
        theater: {draws: b.theater - a.theater, per_s: (b.theater - a.theater) / wall}, page: {frames: b.page - a.page, per_s: (b.page - a.page) / wall},
        hidden: doc().getElementById('hero-box').hidden, athena: H.unbox.state.athena?.swing ?? null};
    },
    async rest(ms) { const a = counts(); await new Promise(r => setTimeout(r, ms)); const b = counts(); return {ms, box: b.box - a.box, theater: b.theater - a.theater, page: b.page - a.page, film: [a.t, b.t]}; },
    async diff(pa, pb) {
      const img = async (b64) => { const r = await fetch('data:image/png;base64,' + b64); return createImageBitmap(await r.blob()); };
      const [A, B] = [await img(pa), await img(pb)], w = Math.min(A.width, B.width), h = Math.min(A.height, B.height);
      const c = new OffscreenCanvas(w, h), x = c.getContext('2d', {willReadFrequently: true});
      x.drawImage(A, 0, 0); const a = x.getImageData(0, 0, w, h).data; x.clearRect(0, 0, w, h); x.drawImage(B, 0, 0); const b = x.getImageData(0, 0, w, h).data;
      let sum = 0, max = 0, over8 = 0, over32 = 0; const n = w * h, hist = [];
      for (let i = 0; i < a.length; i += 4) { const d = Math.max(Math.abs(a[i] - b[i]), Math.abs(a[i + 1] - b[i + 1]), Math.abs(a[i + 2] - b[i + 2])); sum += d; if (d > max) max = d; if (d > 8) over8++; if (d > 32) over32++; hist.push(d); }
      hist.sort((p, q) => p - q);
      return {w, h, mean: sum / n, p99: hist[Math.floor(0.99 * n)], p999: hist[Math.floor(0.999 * n)], max, over8: over8 / n, over32: over32 / n};
    },
  };
})(); 'ok'`;

async function main() {
  if (!CHROME) throw new Error('no Chrome on this Mac');
  fs.mkdirSync(OUT, {recursive: true});
  const d = await door(UI);
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'unboxing-chrome-'));
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
  const results = {at: new Date().toISOString(), chrome: CHROME, host: os.hostname(), load: os.loadavg(), size: [W, H], dpr: DPR};
  try {
    let port = null;
    for (let i = 0; i < 400 && !port; i++) { await sleep(150); if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`); try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {} }
    if (!port) throw new Error('Chrome did not open its debugging port in 60 s');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then(r => r.json());
    results.browser = ver.Browser;
    ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0; const wait = new Map(), events = [], errors = [], refused = [];
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    const tags = `${NEST}/nest/ref/mint/seiya-tags`;
    ws.onmessage = m => {
      const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const {url, method} = x.params.request, ok = url.startsWith(d.origin + '/') || (method === 'GET' && url === tags) || url.startsWith('data:');
        if (ok) send('Fetch.continueRequest', {requestId: x.params.requestId}, x.sessionId).catch(() => {});
        else { refused.push(url.slice(0, 120)); send('Fetch.failRequest', {requestId: x.params.requestId, errorReason: 'BlockedByClient'}, x.sessionId).catch(() => {}); }
        return;
      }
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 300));
      if (x.method === 'Runtime.consoleAPICalled' && x.params.type === 'error') errors.push('console: ' + x.params.args.map(a => a.value ?? a.description).join(' ').slice(0, 300));
      events.push(x.method);
    };
    const t = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: W, height: H});
    const s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable']) await send(m, {}, s);
    await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: DPR, mobile: false}, s);
    await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s); await send('Page.bringToFront', {}, s).catch(() => {});
    if (args.includes('--load')) await send('Page.addScriptToEvaluateOnNewDocument', {source: INSTRUMENT}, s);
    if (args.includes('--hear')) await send('Page.addScriptToEvaluateOnNewDocument', {source: RAF_COST}, s);
    const loaded = new Promise(r => { const iv = setInterval(() => { if (events.includes('Page.loadEventFired')) { clearInterval(iv); r(); } }, 50); });
    const nav = await send('Page.navigate', {url: `${d.origin}${PAGE}`}, s); if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    await Promise.race([loaded, sleep(20000)]);
    if (args.includes('--load')) {
      await sleep(LOAD_S * 1000 + 800);
      const read = async (expr) => { const r = await send('Runtime.evaluate', {expression: expr, returnByValue: true}, s); return r.result?.value; };
      const top = await read('JSON.stringify({log: window.__loadLog, nav: performance.getEntriesByType("navigation")[0]?.startTime ?? 0, measures: performance.getEntriesByType("measure").filter(m => m.name.startsWith("unboxing:")).map(m => ({name: m.name.slice(9), start: m.startTime, dur: m.duration})), frame: document.querySelector("iframe")?.contentWindow?.__loadLog ?? null, film: document.querySelector("iframe")?.contentDocument?.getElementById("dl-twelve-film")?.currentTime ?? null})');
      const r = JSON.parse(top), tasks = [], shift = (r.frame?.origin ?? 0) - (r.log?.origin ?? 0);
      for (const k of [...(r.frame?.longtasks ?? []), ...(r.frame?.loafs ?? [])]) k.start += shift;
      // the page's and its frame's observers both see each long task of their one thread: tasks whose spans overlap are one (the longer kept)
      for (const k of [...(r.log?.longtasks ?? []), ...(r.frame?.longtasks ?? [])].sort((a, b) => a.start - b.start)) {
        const last = tasks.at(-1);
        if (last && k.start < last.start + last.dur && k.start + k.dur > last.start) { if (k.dur > last.dur) tasks[tasks.length - 1] = k; continue; }
        tasks.push(k);
      }
      const loafs = [...(r.log?.loafs ?? []), ...(r.frame?.loafs ?? [])];
      const cause = (k) => {
        const inside = r.measures.filter(m => m.start < k.start + k.dur && m.start + m.dur > k.start).map(m => `${m.name} ${m.dur.toFixed(0)} ms`);
        const loaf = loafs.filter(f => f.start <= k.start + 1 && f.start + f.dur >= k.start + k.dur - 1).sort((a, b) => b.dur - a.dur)[0];
        const scripts = (loaf?.scripts ?? []).sort((a, b) => b.dur - a.dur).slice(0, 3).map(x => `${x.src || '?'}${x.fn ? ' ' + x.fn : ''} (${x.invoker}) ${x.dur.toFixed(0)} ms`);
        return [...inside, ...scripts].join('; ') || k.by.join(', ');
      };
      const list = tasks.filter(k => k.dur > 50);
      results.load = {seconds: LOAD_S, paused: args.includes('--paused'), film: r.film, frames: (r.log?.frames ?? 0), measures: r.measures,
        tasks: list.map(k => ({start: Math.round(k.start), dur: Math.round(k.dur), cause: cause(k)})), gaps: [...(r.log?.gaps ?? [])].map(g => ({at: Math.round(g.at), gap: Math.round(g.gap),
          during: r.measures.filter(m => m.start < g.at + g.gap && m.start + m.dur > g.at).map(m => m.name).join('; ')})),
        sum: Math.round(list.reduce((m, k) => m + k.dur, 0)), max: Math.round(Math.max(0, ...list.map(k => k.dur)))};
      const over = (ms) => results.load.gaps.filter(g => g.gap > ms).length;
      results.load.cold = args.includes('--cold');
      console.log(`load, ${LOAD_S} s${results.load.paused ? ', the page paused at once' : ', the film playing'}${results.load.cold ? ', every shader cold' : ''} (film at ${r.film?.toFixed?.(2)} s): ${list.length} long tasks over 50 ms, ${results.load.sum} ms in all, the longest ${results.load.max} ms; frame gaps over 25 / 34 / 50 ms (a frame or more missed at 60 Hz, two, three): ${over(25)} / ${over(34)} / ${over(50)}, the longest ${Math.max(0, ...results.load.gaps.map(g => g.gap))} ms; ${results.load.frames} frames`);
      for (const k of results.load.tasks) console.log(`  task at ${k.start} ms, ${k.dur} ms: ${k.cause}`);
      for (const g of results.load.gaps) console.log(`  frame gap at ${g.at} ms: ${g.gap} ms${g.during ? ` (during ${g.during})` : ''}`);
      for (const m of r.measures) console.log(`  step ${m.name}: at ${Math.round(m.start)} ms, ${m.dur.toFixed(1)} ms`);
      results.errors = errors;
      return;
    }
    const ev = async (expression) => { const r = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true}, s); if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 400)); return r.result?.value; };
    const until = async (expr, ms = 30000) => { const t0 = Date.now(); while (!(await ev(expr))) { if (Date.now() - t0 > ms) throw new Error(`waited ${ms} ms for ${expr}`); await sleep(200); } };
    await until('Boolean(window.hero)');
    await ev(HELPER);
    try { results.ready = await ev('window.__proof.ready()'); }
    catch (e) { console.log('page errors: ' + errors.join(' | ')); throw e; }
    if (args.includes('--probe')) {   // one second, looked at: the worlds the hook read and the faces riding them
      const sec = Number(opt('--probe', 56));
      await ev(`window.__proof.seek(${sec}, 30)`);
      console.log(JSON.stringify(await ev(`({t: ${sec}, worlds: window.hero.kick.worlds.length, list: window.hero.kick.worlds.map(w => [Math.round(w.x), Math.round(w.y), +w.r.toFixed(2)]), riding: window.hero.unbox.riding, out: window.hero.unbox.out, errors: ${JSON.stringify('')}})`)));
      return;
    }
    try { await Promise.resolve(); } catch (e) { console.log('page errors: ' + errors.join(' | ')); console.log('refused: ' + [...new Set(refused)].join(', ')); throw e; }
    console.log(`renderer ${results.ready.renderer}; timer ${results.ready.timer}; dpr ${results.ready.dpr}; cloth ${results.ready.models.cloth.at} (${results.ready.models.cloth.tris} tris), seiya ${results.ready.models.seiya.at} (${results.ready.models.seiya.tris} tris), athena ${results.ready.models.athena?.at}`);
    const shotRaw = async (clip, scale = 1 / DPR) => (await send('Page.captureScreenshot', {format: 'png', captureBeyondViewport: false, clip: {...clip, scale}}, s)).data;   // 1 / DPR: css px; 1: the device's
    const save = (name, b64) => { const fp = path.join(OUT, `${name}.png`); fs.writeFileSync(fp, Buffer.from(b64, 'base64')); return fp; };

    // the pictures, the film paused at each second
    results.pictures = [];
    if (PICTURES) {
      await ev('window.__proof.panel(false)');
      for (const sec of SECONDS) {
        const at = await ev(`window.__proof.seek(${sec}, 8)`);
        const clip = args.includes('--viewport') ? {x: 0, y: 0, width: W, height: H} : await ev('window.__proof.clip(0, true)');
        const fp = save(`at-${sec.toFixed(2)}s`, await shotRaw(clip));
        const st = await ev('JSON.stringify(window.hero.state())');
        const box = JSON.parse(st).box, her = await ev('window.hero.unbox.athena');
        results.pictures.push({second: at, file: fp, state: box, athena: her});
        console.log(`  picture at ${at.toFixed(2)} s: ${path.basename(fp)} (box ${box.out ? 'out' : 'asleep'}${her ? ', Athena on' : ''})`);
      }
      await ev('window.__proof.panel(true)');
    }
    if (args.includes('--pictures-only')) { results.errors = errors; return; }

    if (args.includes('--hear')) {
      // the sphere's frames, hearing and not, alternately over the same windows of the film
      results.hear = {windows: [], pictures: []};
      const sphere = 'window.hero.frame.contentWindow', mean = (xs) => xs.reduce((a, b) => a + b, 0) / Math.max(1, xs.length);
      for (const [name, from, to] of [['the narration, quiet, before the first burst', 0.5, 10.5], ['the meteors, loud', 99, 111]]) {
        const by = {on: [], off: []}, wall = {on: 0, off: 0};
        for (const on of [true, false, true, false]) {
          await ev(`(window.hero.kick.hear(${on}), ${sphere}.__rafCost.length = 0, true)`);
          const w = await ev(`window.__proof.play(${from}, ${to})`);
          by[on ? 'on' : 'off'].push(...await ev(`Array.from(${sphere}.__rafCost)`)); wall[on ? 'on' : 'off'] += w.wall_s;
        }
        const out = {name, from, to, on: {...stat(by.on), mean: mean(by.on), per_s: by.on.length / wall.on}, off: {...stat(by.off), mean: mean(by.off), per_s: by.off.length / wall.off}};
        results.hear.windows.push(out);
        const f = (v) => v.toFixed(3);
        console.log(`  ${name} (${from} to ${to} s, twice each way): the sphere's frame, hearing: median ${f(out.on.median)} ms, p95 ${f(out.on.p95)}, mean ${f(out.on.mean)} (${out.on.n} frames, ${out.on.per_s.toFixed(1)}/s); not: ${f(out.off.median)}, ${f(out.off.p95)}, ${f(out.off.mean)} (${out.off.n}, ${out.off.per_s.toFixed(1)}/s)`);
      }
      // pictures: the stage at each second, the page's motion paused, hearing and not
      await ev('window.__proof.panel(false)');
      const secs = opt('--at', '') ? SECONDS : [3.64, 90.0, 96.96, 105.0, 108.4];
      for (const sec of secs) {
        await ev('window.__proof.motion(false)');
        await ev(`window.__proof.seek(${sec}, 8)`);
        await ev('window.__proof.motion(true)');
        const clip = await ev('window.__proof.clip(0, true)'), shot = {};
        for (const on of [true, false]) {
          await ev(`(window.hero.kick.hear(${on}), ${sphere}.genesisSphere.redraw(), new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(r)))))`);
          shot[on ? 'on' : 'off'] = save(`hear-${sec.toFixed(2)}s-${on ? 'on' : 'off'}`, await shotRaw(clip));
        }
        results.hear.pictures.push({second: sec, ...shot});
        console.log(`  pictures at ${sec.toFixed(2)} s: ${path.basename(shot.on)}, ${path.basename(shot.off)}`);
      }
      await ev('window.hero.kick.hear(true)');
      await ev('window.__proof.motion(false)');
      await ev('window.__proof.panel(true)');
      results.hear.chart = save('hear-chart', await ev(HEAR_CHART));
      // at rest: the page's own Pause, hearing
      await ev('window.__proof.seek(105, 6)');
      await ev('window.__proof.motion(true)');
      results.hear.rest = await ev(`(async () => { ${sphere}.__rafCost.length = 0; const r = await window.__proof.rest(3000); return {...r, sphereFrames: ${sphere}.__rafCost.length}; })()`);
      await ev('window.__proof.motion(false)');
      console.log(`  at rest at 105 s, hearing (the page's Pause): the sphere's frames ${results.hear.rest.sphereFrames}, the box ${results.hear.rest.box}, the theater ${results.hear.rest.theater} in ${results.hear.rest.ms} ms`);
      results.errors = errors; results.refused = [...new Set(refused)];
      if (errors.length) console.log('page errors: ' + errors.join(' | '));
      return;
    }

    // the hand-over: the stage with the box against the page's own sphere, the same instant, the page's motion paused
    results.handover = [];
    await ev('window.__proof.panel(false)');
    for (const [name, sec, settle] of [['the gold star, the box comes out', 42.342, 8], ['shut and home, before it fades', 61.767 + 5.2 + 4.7, 8]]) {
      await ev('window.__proof.motion(false)');
      await ev(`window.__proof.seek(${sec}, ${settle})`);   // the page's own frames run meanwhile (its fold under the end card takes 1.6 s of them)
      await ev('window.__proof.motion(true)');
      const clip = await ev('window.__proof.clip(1.25)');
      const withBox = await shotRaw(clip, 1), on = await ev('JSON.stringify(window.hero.state().box)');
      const off = await ev('window.__proof.box(false)');
      const page = await shotRaw(clip, 1);
      const diff = await ev(`window.__proof.diff(${JSON.stringify(withBox)}, ${JSON.stringify(page)})`);
      await ev('window.__proof.box(true)');
      save(`handover-${sec.toFixed(2)}s-box`, withBox); save(`handover-${sec.toFixed(2)}s-page`, page);
      results.handover.push({name, second: sec, box: JSON.parse(on), afterOff: off, clipR: clip.R, diff});
      console.log(`  hand-over at ${sec.toFixed(2)} s (${name}): mean ${diff.mean.toFixed(2)}/255, p99 ${diff.p99}, p99.9 ${diff.p999}, max ${diff.max}, ${(diff.over8 * 100).toFixed(2)} % of pixels over 8/255, ${(diff.over32 * 100).toFixed(3)} % over 32`);
    }
    await ev('window.__proof.motion(false)');
    await ev('window.__proof.panel(true)');

    // the cost while it plays
    results.windows = [];
    for (const [name, from, to] of [['A, no box', 20, 24], ['Athena over her shoulder', 27.5, 31.9], ['THE FOLD, her cut to the sphere whole again', 29.3, 38.4], ['the column, the flood, the second burst', 36.4, 42.3],
      ['the slow opening, star to centaur', 42.3, 51.5], ['the faces riding the worlds', 53.0, 60.5], ['Seiya, the faces home, the shut, Athena again', 60.5, 74.2], ['A after', 75, 79]]) {
      const w = await ev(`window.__proof.play(${from}, ${to})`);
      const out = {name, ...w, box: {...w.box, cpu: stat(w.box.cpu), gpu: stat(w.box.gpu)}};
      results.windows.push(out);
      console.log(`  ${name} (${w.from.toFixed(1)} to ${w.to.toFixed(1)} s, ${w.wall_s.toFixed(1)} s): box ${w.box.draws} draws (${w.box.per_s.toFixed(1)}/s; ${JSON.stringify(w.box.by)}), JS median ${out.box.cpu?.median?.toFixed(2) ?? '-'} ms p95 ${out.box.cpu?.p95?.toFixed(2) ?? '-'}, GPU median ${out.box.gpu?.median?.toFixed(3) ?? '-'} ms p95 ${out.box.gpu?.p95?.toFixed(3) ?? '-'}; theater ${w.theater.per_s.toFixed(1)}/s; page ${w.page.per_s.toFixed(1)}/s; canvas ${w.box.px?.join('x') ?? '-'}, hidden at the end ${w.hidden}`);
    }
    // at rest: the page's own Pause in the hover, then in A
    results.rest = [];
    for (const sec of [55, 25]) {
      await ev(`window.__proof.seek(${sec}, 6)`);
      await ev('window.__proof.motion(true)');
      const r = await ev('window.__proof.rest(3000)');
      results.rest.push({second: sec, ...r});
      console.log(`  at rest at ${sec} s (the page's Pause): box ${r.box}, theater ${r.theater}, page frames ${r.page} in ${r.ms} ms`);
      await ev('window.__proof.motion(false)');
    }
    results.errors = errors; results.refused = [...new Set(refused)];
    if (errors.length) console.log('page errors: ' + errors.join(' | '));
    if (refused.length) console.log('refused: ' + results.refused.join(', '));
  } finally {
    fs.writeFileSync(path.join(OUT, 'unboxing.proof.json'), JSON.stringify(results, null, 1));
    console.log(`wrote ${path.join(OUT, 'unboxing.proof.json')}`);
    process.off('SIGTERM', onSig); process.off('SIGINT', onSig);
    await end();
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch(e => { console.error(e); process.exit(1); });

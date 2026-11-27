#!/usr/bin/env node
// seiya-sound.proof.mjs: THE SOUND FIRST, MEASURED (Oct 14 2026). A real Chrome, headless and muted, opens the built optimism.fit (dist/optimism-fit,
// served by this script's own loopback door; every other address Chrome asks for is mapped to that door too and answered 404, so nothing leaves
// this Mac) at a phone's size on a throttled link (Network.emulateNetworkConditions: --mbps down, --rtt ms), as a visitor does: at the top of
// /app/warm.html (--entry top: the hero's galaxy film starts loading there), scrolled to the sphere at --scroll-ms, tapped at --tap-ms after
// navigation (--entry sphere opens at #oath-sphere instead). It reads, from the page's own clocks:
//   paint_ms      navigation to the sphere's first face painted from the film: CanvasRenderingContext2D.drawImage of #dl-twelve-film onto
//                 #genesis-sphere, wrapped before any page script runs (Page.addScriptToEvaluateOnNewDocument), the same on both pages
//   flow_ms       the tap to sound flowing: the first frame at which the sound's element (the song when the page has one, else the film: the
//                 page before this lane) is unmuted, playing with future data and past the time it had at the tap
//   playing_ms    the tap to that element's first `playing` event (null when it was already playing at the tap and never stopped)
//   stalls        in the watch after the tap: `waiting` events of the sound's element and of the film AFTER each one's first `playing` since the
//                 tap (the wait between play() and that first playing is the start, playing_ms), and the ms from each to the next `playing`
//   bytes         what Chrome fetched before the tap and by the end, by file (Network.dataReceived), and the Cache-Control each film answered
//   twelve        the new page's own word, window.dlTwelve.state(): primed, seeks, nudges, drift
// Nothing of the house is read or written and no glass is told anything; no deploy.
//   node tools/seiya-sound.proof.mjs --dist <dir> [--runs 5] [--mbps 3] [--rtt 40] [--entry top|sphere] [--scroll-ms 3000] [--tap-ms 6000] [--watch-ms 12000] [--ports 18961,18962]
//        [--size 390x844] [--dpr 3] [--chrome <path>] [--out <json>] [--shot <png>]
// Chrome's port can take tens of seconds to open on a loaded Mac (waited for up to 90 s). Run it under tools/dead-tasks/bounded.mjs.
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const DIST = path.resolve(arg('--dist', ''));
if (!arg('--dist', '') || !fs.existsSync(path.join(DIST, 'app', 'warm.html'))) { console.error('--dist <dist/optimism-fit> with app/warm.html in it'); process.exit(2); }
const [PAGE, CDP] = arg('--ports', '18961,18962').split(',').map(Number);
const RUNS = Number(arg('--runs', 5)), MBPS = Number(arg('--mbps', 3)), RTT = Number(arg('--rtt', 40));
const TAP_MS = Number(arg('--tap-ms', 6000)), WATCH_MS = Number(arg('--watch-ms', 12000)), SCROLL_MS = Number(arg('--scroll-ms', 3000)), ENTRY = arg('--entry', 'top');
const [VW, VH] = arg('--size', '390x844').split('x').map(Number), DPR = Number(arg('--dpr', 3));
const CHROME = arg('--chrome', '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'), OUT = arg('--out', ''), SHOT = arg('--shot', '');
const sleep = ms => new Promise(ok => setTimeout(ok, ms));
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.gif': 'image/gif', '.mp4': 'video/mp4', '.m4a': 'audio/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.woff': 'font/woff', '.txt': 'text/plain', '.md': 'text/markdown', '.ico': 'image/x-icon', '.wasm': 'application/wasm' };

// Cloudflare's _headers, as its asset worker reads it (workers-shared parseHeaders, generateRuleRegExp): a path line, then indented "Name: value"
// lines; one * a rule, anywhere, standing for any characters; :name a path segment. Every matching rule applies in order; a later one overrides.
function headerRules(file) {
  if (!fs.existsSync(file)) return [];
  const out = []; let rule = null;
  for (const raw of fs.readFileSync(file, 'utf8').split('\n')) {
    if (!raw.trim()) continue;
    if (/^\s/.test(raw)) { const m = /^\s*([^:]+):\s*(.*)$/.exec(raw); if (rule && m) rule.headers.push([m[1].trim().toLowerCase(), m[2].trim()]); continue; }
    const re = new RegExp('^' + raw.trim().split('*').map(s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('(?<splat>.*)').replace(/:[A-Za-z_]+/g, '[^/]+') + '$');
    rule = { path: raw.trim(), re, headers: [] }; out.push(rule);
  }
  return out;
}
const RULES = headerRules(path.join(DIST, '_headers'));
const door = { served: 0, bytes: 0, foreign: new Map(), refused: [] };

const server = http.createServer((req, res) => {
  const host = (req.headers.host || '').split(':')[0], u = new URL(req.url, 'http://x'), p = decodeURIComponent(u.pathname);
  if (host !== '127.0.0.1' && host !== 'localhost') { door.foreign.set(req.headers.host + p, (door.foreign.get(req.headers.host + p) || 0) + 1); res.writeHead(404); return res.end(); }
  if (req.method !== 'GET' && req.method !== 'HEAD') { door.refused.push(`${req.method} ${p}`); res.writeHead(405); return res.end(); }
  const f = path.resolve(DIST, '.' + p);
  if (!f.startsWith(DIST + path.sep) || !fs.existsSync(f) || !fs.statSync(f).isFile()) { door.refused.push(`GET ${p}`); res.writeHead(404); return res.end(); }
  const size = fs.statSync(f).size;
  // the live site's default, as measured Oct 14 (Workers static assets): max-age=0, must-revalidate; the dist's _headers may override it
  const h = { 'content-type': MIME[path.extname(f)] || 'application/octet-stream', 'accept-ranges': 'bytes', 'cache-control': 'public, max-age=0, must-revalidate' };
  for (const r of RULES) if (r.re.test(p)) for (const [k, v] of r.headers) h[k] = v;
  let start = 0, end = size - 1, status = 200;
  const range = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
  if (range && (range[1] || range[2])) {
    if (range[1]) { start = Number(range[1]); end = range[2] ? Math.min(Number(range[2]), size - 1) : size - 1; } else start = Math.max(0, size - Number(range[2]));
    if (start >= size || start > end) { res.writeHead(416, { 'content-range': `bytes */${size}` }); return res.end(); }
    status = 206; h['content-range'] = `bytes ${start}-${end}/${size}`;
  }
  h['content-length'] = end - start + 1;
  door.served++; door.bytes += end - start + 1;
  res.writeHead(status, h);
  if (req.method === 'HEAD') return res.end();
  fs.createReadStream(f, { start, end }).pipe(res);
});

// in the page before any of its scripts: the first face painted from the film, every media event of the two elements, the tap and the sound's flow
const PROBE = `(() => {
  const P = {firstPaint: null, paints: 0, events: [], tap: null, tapT: null, flow: null, flowSrc: null, load: null, hit: null};
  window.__proof = P;
  const dI = CanvasRenderingContext2D.prototype.drawImage;
  CanvasRenderingContext2D.prototype.drawImage = function(src, ...a) {
    if (src instanceof HTMLVideoElement && src.id === 'dl-twelve-film' && this.canvas && this.canvas.id === 'genesis-sphere') { P.paints++; if (P.firstPaint === null) P.firstPaint = Math.round(performance.now()); }
    return dI.call(this, src, ...a);
  };
  const TYPES = ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough', 'play', 'playing', 'pause', 'waiting', 'stalled', 'seeking', 'seeked', 'suspend', 'error', 'volumechange', 'ratechange'];
  const watch = el => { if (el.__watched) return; el.__watched = true; for (const t of TYPES) el.addEventListener(t, () => P.events.push([Math.round(performance.now()), el.id, t, el.readyState, Math.round(el.currentTime * 1000) / 1000, el.muted ? 'm' : 'u', el.paused ? 'p' : 'r'])); };
  new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.id === 'dl-twelve-film' || n.id === 'dl-twelve-song') watch(n); }).observe(document, {childList: true, subtree: true});
  addEventListener('load', () => { P.load = Math.round(performance.now()); });
  const soundEl = () => document.getElementById('dl-twelve-song') || document.getElementById('dl-twelve-film');
  document.addEventListener('pointerup', e => {
    if (P.tap !== null) return;
    P.tap = Math.round(performance.now()); P.hit = e.target && e.target.id || String(e.target && e.target.tagName);
    const el = soundEl(); if (!el) return; P.flowSrc = el.id; P.tapT = el.currentTime; const t0 = performance.now();
    const look = () => { if (!el.muted && !el.paused && el.readyState >= 3 && el.currentTime > P.tapT) { P.flow = Math.round(performance.now()); return; } if (performance.now() - t0 < 30000) requestAnimationFrame(look); };
    requestAnimationFrame(look);
  }, true);
})();`;
const STATE = `(() => {
  const el = x => x && { t: Math.round(x.currentTime * 1000) / 1000, ready: x.readyState, paused: x.paused, muted: x.muted, rate: x.playbackRate, preload: x.preload,
    ahead: (() => { const b = x.buffered; for (let i = 0; i < b.length; i++) if (b.start(i) <= x.currentTime + 0.25 && b.end(i) >= x.currentTime) return Math.round((b.end(i) - x.currentTime) * 10) / 10; return 0; })(),
    ranges: Array.from({ length: x.buffered.length }, (_, i) => [Math.round(x.buffered.start(i) * 10) / 10, Math.round(x.buffered.end(i) * 10) / 10]) };
  const c = document.querySelector('#genesis-sphere'), r = c && c.getBoundingClientRect();
  return { now: Math.round(performance.now()), film: el(document.getElementById('dl-twelve-film')), song: el(document.getElementById('dl-twelve-song')),
    twelve: window.dlTwelve ? window.dlTwelve.state() : null, probe: window.__proof && { firstPaint: __proof.firstPaint, paints: __proof.paints, load: __proof.load, tap: __proof.tap, flow: __proof.flow, flowSrc: __proof.flowSrc, hit: __proof.hit, events: __proof.events },
    canvas: r && { x: r.left + r.width / 2, y: r.top + r.height / 2, w: Math.round(r.width), h: Math.round(r.height), inView: r.bottom > 0 && r.top < innerHeight }, scrollY: Math.round(scrollY) };
})()`;

async function cdp(port, waitMs) {
  let target = null; const t0 = Date.now();
  while (!target && Date.now() - t0 < waitMs) { try { const list = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json(); target = list.find(t => t.type === 'page'); } catch { /* not up yet */ } if (!target) await sleep(250); }
  if (!target) throw new Error(`Chrome never answered on its debugging port in ${waitMs} ms`);
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((ok, no) => { ws.addEventListener('open', ok, { once: true }); ws.addEventListener('error', no, { once: true }); });
  let id = 0; const wait = new Map(), listeners = new Set();
  ws.addEventListener('message', m => { const d = JSON.parse(m.data); if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); } else for (const l of listeners) l(d); });
  const send = (method, params = {}) => new Promise(ok => { const i = ++id; wait.set(i, ok); ws.send(JSON.stringify({ id: i, method, params })); });
  const ev = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.result && r.result.exceptionDetails) return { error: (r.result.exceptionDetails.exception && r.result.exceptionDetails.exception.description) || r.result.exceptionDetails.text }; return r.result && r.result.result ? r.result.result.value : r; };
  return { send, ev, on: l => listeners.add(l), off: l => listeners.delete(l), portMs: Date.now() - t0, close: () => ws.close() };
}

const fileOf = url => { try { return new URL(url).pathname; } catch { return url; } };
const classOf = p => p.endsWith('/saint-seiya.mp4') ? 'film' : p.endsWith('/saint-seiya.m4a') ? 'song' : p.includes('/warm-media/') ? 'warm_media' : 'other';
const med = xs => { const s = xs.filter(x => typeof x === 'number').sort((a, b) => a - b); return s.length ? s[Math.floor((s.length - 1) / 2)] : null; };
const min = xs => { const s = xs.filter(x => typeof x === 'number'); return s.length ? Math.min(...s) : null; };
const kb = n => Math.round(n / 1024);

async function run(C, n, net, errors) {
  net.clear(); errors.length = 0; let tapWall = null;
  const onNet = d => {
    const q = d.params && d.params.requestId;
    if (d.method === 'Network.requestWillBeSent') net.set(q, { url: d.params.request.url, type: d.params.type, bytes: 0, before: 0, status: null, cc: null, range: d.params.request.headers.Range || d.params.request.headers.range || null });
    else if (d.method === 'Network.responseReceived') { const r = net.get(q); if (r) { r.status = d.params.response.status; const h = d.params.response.headers; r.cc = h['cache-control'] || h['Cache-Control'] || null; r.cached = Boolean(d.params.response.fromDiskCache); } }
    else if (d.method === 'Network.dataReceived') { const r = net.get(q); if (r) { const b = d.params.encodedDataLength || d.params.dataLength || 0; r.bytes += b; if (tapWall === null) r.before += b; } }
    else if (d.method === 'Network.loadingFailed') { const r = net.get(q); if (r) r.failed = d.params.errorText; }
    else if (d.method === 'Runtime.exceptionThrown') errors.push(String(d.params.exceptionDetails && (d.params.exceptionDetails.exception && d.params.exceptionDetails.exception.description || d.params.exceptionDetails.text)).slice(0, 240));
    else if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') errors.push((d.params.args || []).map(a => String(a.value ?? a.description ?? '')).join(' ').slice(0, 240));
  };
  C.on(onNet);
  await C.send('Page.navigate', { url: 'about:blank' }); await sleep(400);
  await C.send('Network.clearBrowserCache');
  const navAt = Date.now();
  await C.send('Page.navigate', { url: `http://127.0.0.1:${PAGE}/app/warm.html${ENTRY === 'sphere' ? '#oath-sphere' : ''}` });
  if (ENTRY !== 'sphere') {   // the visitor swipes down to the sphere
    while (Date.now() - navAt < SCROLL_MS) await sleep(50);
    await C.ev(`(() => { const c = document.querySelector('#genesis-sphere'); if (c) c.scrollIntoView({block: 'center', behavior: 'instant'}); return Boolean(c); })()`);
  }
  while (Date.now() - navAt < TAP_MS - 700) await sleep(50);
  const before = await C.ev(STATE);
  if (!before || !before.canvas) throw new Error('no #genesis-sphere on the page: ' + JSON.stringify(before).slice(0, 300) + ' errors: ' + errors.join(' | '));
  if (!before.canvas.inView) { await C.ev(`document.querySelector('#genesis-sphere').scrollIntoView({block: 'center', behavior: 'instant'})`); }
  const box = (await C.ev(STATE)).canvas;
  while (Date.now() - navAt < TAP_MS) await sleep(10);
  const atTap = await C.ev(STATE);
  tapWall = Date.now();
  await C.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: box.x, y: box.y }] });
  await C.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await sleep(WATCH_MS);
  const end = await C.ev(STATE);
  C.off(onNet);   // this run's listener goes with it, or the next run counts every byte twice
  const P = end.probe || {};
  // a stall is a `waiting` AFTER the element's first `playing` since the tap: the wait between play() and that first playing is the start, measured as playing_ms
  const stalls = (id, from) => { const ev = (P.events || []).filter(e => e[1] === id && e[0] >= from); let waits = 0, ms = 0, open = null, started = false; for (const e of ev) { if (e[2] === 'playing') { if (open !== null) { ms += e[0] - open; open = null; } started = true; } else if (e[2] === 'waiting' && started && open === null) { waits++; open = e[0]; } } if (open !== null) ms += end.now - open; return { waits, ms }; };
  const soundId = P.flowSrc || (end.song ? 'dl-twelve-song' : 'dl-twelve-film');
  const playing = (P.events || []).find(e => e[1] === soundId && e[2] === 'playing' && e[0] >= P.tap);
  const bytes = { before: { total: 0, film: 0, song: 0, warm_media: 0, other: 0 }, end: { total: 0, film: 0, song: 0, warm_media: 0, other: 0 } }, cc = {};
  for (const r of net.values()) { const c = classOf(fileOf(r.url)); bytes.before[c] += r.before; bytes.before.total += r.before; bytes.end[c] += r.bytes; bytes.end.total += r.bytes; if ((c === 'film' || c === 'song') && r.cc) cc[c] = r.cc; }
  const out = {
    run: n, paint_ms: P.firstPaint ?? null, load_ms: P.load ?? null, tap_ms: P.tap ?? null, tap_hit: P.hit, sound: soundId,
    flow_ms: P.flow != null && P.tap != null ? P.flow - P.tap : null, playing_ms: playing ? playing[0] - P.tap : null,
    stalls: { sound: stalls(soundId, P.tap || 0), film: stalls('dl-twelve-film', P.tap || 0) },
    bytes_kb: { before: Object.fromEntries(Object.entries(bytes.before).map(([k, v]) => [k, kb(v)])), end: Object.fromEntries(Object.entries(bytes.end).map(([k, v]) => [k, kb(v)])) },
    cache_control: cc, at_tap: { film: atTap.film, song: atTap.song, twelve: atTap.twelve && { primed: atTap.twelve.primed, primed_ms: atTap.twelve.primed_ms, primed_by: atTap.twelve.primed_by, inView: atTap.twelve.inView } },
    at_end: { film: end.film, song: end.song, twelve: end.twelve && { primed: end.twelve.primed, soundOn: end.twelve.soundOn, hearing: end.twelve.hearing, seeks: end.twelve.seeks, nudges: end.twelve.nudges, drift: end.twelve.drift, waits: end.twelve.waits }, apart_ms: end.song && end.film ? Math.round(Math.abs(end.song.t - end.film.t) * 1000) : null },
    canvas: box, scrollY: end.scrollY, errors: [...new Set(errors)].slice(0, 8), events: (P.events || []).filter(e => e[2] !== 'volumechange' && e[2] !== 'ratechange').slice(0, 60),
  };
  return out;
}

async function main() {
  await new Promise(ok => server.listen(PAGE, '127.0.0.1', ok));
  const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'seiya-proof-'));
  const chrome = spawn(CHROME, ['--headless=new', `--remote-debugging-port=${CDP}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--mute-audio',
    `--window-size=${VW},${VH}`, `--host-resolver-rules=MAP * 127.0.0.1:${PAGE}`, '--disable-background-networking', '--disable-component-update', '--disable-sync', 'about:blank'], { stdio: 'ignore' });
  const exited = new Promise(ok => chrome.on('exit', ok));
  const out = { at: new Date().toISOString(), dist: DIST, link: { mbps: MBPS, rtt_ms: RTT }, glass: { size: [VW, VH], dpr: DPR }, entry: ENTRY, scroll_ms: ENTRY === 'sphere' ? null : SCROLL_MS, tap_at_ms: TAP_MS, watch_ms: WATCH_MS, chrome: CHROME, rules: RULES.map(r => r.path), runs: [] };
  let C = null;
  try {
    C = await cdp(CDP, 90000); out.chrome_port_ms = C.portMs;
    await C.send('Runtime.enable'); await C.send('Page.enable'); await C.send('Network.enable', { maxTotalBufferSize: 1024 * 1024, maxResourceBufferSize: 256 * 1024 });
    await C.send('Emulation.setDeviceMetricsOverride', { width: VW, height: VH, deviceScaleFactor: DPR, mobile: true });
    await C.send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
    await C.send('Emulation.setFocusEmulationEnabled', { enabled: true }); await C.send('Page.bringToFront');
    await C.send('Network.emulateNetworkConditions', { offline: false, latency: RTT, downloadThroughput: MBPS * 1e6 / 8, uploadThroughput: MBPS * 1e6 / 16 });
    await C.send('Page.addScriptToEvaluateOnNewDocument', { source: PROBE });
    const net = new Map(), errors = [];
    for (let n = 1; n <= RUNS; n++) {
      out.runs.push(await run(C, n, net, errors));
      console.error(`run ${n}: ${JSON.stringify({ paint_ms: out.runs[n - 1].paint_ms, flow_ms: out.runs[n - 1].flow_ms, playing_ms: out.runs[n - 1].playing_ms, stalls: out.runs[n - 1].stalls, before_kb: out.runs[n - 1].bytes_kb.before })}`);
      if (n === 1 && SHOT) { const r = await C.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(SHOT, Buffer.from(r.result.data, 'base64')); }
    }
    const R = out.runs;
    out.summary = {
      paint_ms: { min: min(R.map(r => r.paint_ms)), median: med(R.map(r => r.paint_ms)) },
      flow_ms: { min: min(R.map(r => r.flow_ms)), median: med(R.map(r => r.flow_ms)), missing: R.filter(r => r.flow_ms === null).length },
      playing_ms: { min: min(R.map(r => r.playing_ms)), median: med(R.map(r => r.playing_ms)) },
      sound_stall_ms: { min: min(R.map(r => r.stalls.sound.ms)), median: med(R.map(r => r.stalls.sound.ms)), max: Math.max(...R.map(r => r.stalls.sound.ms)), waits: R.map(r => r.stalls.sound.waits) },
      film_stall_ms: { median: med(R.map(r => r.stalls.film.ms)), waits: R.map(r => r.stalls.film.waits) },
      before_tap_kb: { total: med(R.map(r => r.bytes_kb.before.total)), film: med(R.map(r => r.bytes_kb.before.film)), song: med(R.map(r => r.bytes_kb.before.song)), warm_media: med(R.map(r => r.bytes_kb.before.warm_media)) },
      end_kb: { total: med(R.map(r => r.bytes_kb.end.total)) },
      apart_ms: { median: med(R.map(r => r.at_end.apart_ms)), max: R.some(r => typeof r.at_end.apart_ms === 'number') ? Math.max(...R.map(r => r.at_end.apart_ms).filter(x => typeof x === 'number')) : null },
      seeks: R.map(r => r.at_end.twelve && r.at_end.twelve.seeks), nudges: R.map(r => r.at_end.twelve && r.at_end.twelve.nudges),
      cache_control: R[0].cache_control, errors: [...new Set(R.flatMap(r => r.errors))].slice(0, 8),
    };
  } finally {
    if (C) C.close(); chrome.kill('SIGTERM');
    await Promise.race([exited, sleep(8000).then(() => chrome.kill('SIGKILL'))]);
    server.close(); server.closeAllConnections?.();
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* gone with Chrome */ }
  }
  out.door = { served: door.served, bytes_mb: Math.round(door.bytes / 1048576 * 10) / 10, foreign: Object.fromEntries(door.foreign), refused: [...new Set(door.refused)].slice(0, 20) };
  if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 1));
  console.log(JSON.stringify({ summary: out.summary, door: out.door, chrome_port_ms: out.chrome_port_ms }, null, 1));
}
main().then(() => process.exit(0)).catch(e => { console.error('proof failed:', e && e.stack || e); try { server.close(); } catch { /* closed */ } process.exit(1); });

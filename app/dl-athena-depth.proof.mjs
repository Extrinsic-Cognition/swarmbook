// dl-athena-depth.proof.mjs · THE DEPTH AT THE DISPLAY'S RATE, seen in a real Chrome (Oct 27 2026; dl-athena.mjs DEPTH, figureOptions; dl-athena-layer.mjs look).
// Run on the new Mac, never on the serving Mac:  nice -n 10 node embertide-app/ui/intro/dyson-society/app/dl-athena-depth.proof.mjs [--out <dir>]  (~25 s)
// A private loopback door serves this tree's embertide-app/ui at /ui/ and an invented Nest (house/purse as the Mac's Nest held it on Oct 22, its money alone,
// never a write). The page mounts her layer as the Mac overlay's corner mounts it (one-corner.mjs: engine 'come', the purse, the engine's two files from
// room/) and calls her; the browser is headless, muted, off every screen. The engine is read through the page's own fetcher (the mount wrapped to keep the
// instance in hand: the proof's seam, never the page's).
//   A. THE DISPLAY'S RATE: over 3 s her engine paints on every frame the browser gives (paints = requestAnimationFrame calls, within 3 %), and one picture
//      costs under 1.5 ms (300 drawOnce in a row, at 300 x 300); the purse sampled on every paint.
//   B. THE LOOK: the pointer moved to her left and above turns the camera (lookYaw > 0: unit0's front slides with the pointer; lookPitch > 0: it rises) and slides the sprite left and up;
//      to her right, the other way; both written on the engine's own picture (depth.writes grew), and the spring settled within a second (the look within
//      0.01 of tanh of the pull).
//   C. AT REST: with the pointer still, a second passes with no write (depth.writes stands) while the engine keeps painting.
//   D. A LOOK IS NO PAINT OF THE SPRITE: the perch moved by its `translate` alone (one style), the sprite's img untouched.
// Exit 0 when every check holds; the summary is one JSON line; pictures a-rest.png, b-left.png, c-right.png (her corner, 2x).
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { DEPTH, lookOf, depthOf } from './dl-athena.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url)), TREE = path.resolve(HERE, '../../../../..'), UI = path.join(TREE, 'embertide-app/ui');
const arg = (k, d) => { const i = process.argv.indexOf(k); return i > 0 ? process.argv[i + 1] : d; };
const out = path.resolve(arg('--out', fs.mkdtempSync(path.join(os.tmpdir(), 'dl-athena-depth-proof-')))); fs.mkdirSync(out, { recursive: true });
const SIZE = [900, 700], DPR = 2;
const PURSE = { schema: 'embertide.purse/v1', posted_usd: 318.32, reserved_usd: 0, full_usd: 413.28, level: 0.7702, ledger: { at_ms: 1792327015154, source: 'ledger', mac: 'mac' }, burns: [],
  his: { level: 0.5, by: 'Guido', at: '2026-10-16T16:17:32.012Z', why: 'his word, Oct 16 2026 17:17:32 WEST: "make it 50% full"' } };
const REFS = { 'house/purse': { value: PURSE, rev: 1076 }, 'house/blobby': { value: { schema: 'embertide.blobby/v1', at: 'home' }, rev: 3 }, 'mint/drops': { value: { schema: 'embertide.mint-drops/v1', drops: [] }, rev: 1 } };
const reads = { refs: 0, streams: 0, other: [] };
let ORIGIN = '';
const PAGE = () => `<!doctype html><html><head><meta charset="utf-8"><title>the depth</title><style>html,body{margin:0;height:100%;background:#15171a}</style></head><body>
<script type="module">
import { mountLayer } from '/ui/intro/dyson-society/app/dl-athena-layer.mjs';
const files = { register: new URL('/ui/intro/room/roma-engine.js', location.href), engine: new URL('/ui/intro/room/lysa-engine.js', location.href) };   // one-corner.mjs FILES
const fetcher = async (url, o) => { const r = await fetch(url, o); if (!String(url).endsWith('lysa-engine.js')) return r; const t = await r.text();   // the proof's seam: the instance in hand
  return { ok: r.ok, status: r.status, text: async () => t + ';(function(){const m=window.PoleisEngine.mount;window.PoleisEngine.mount=function(c,o){const i=m.call(this,c,o);globalThis.__inst=i;globalThis.__PE=window.PoleisEngine;return i;};})();' }; };
const layer = mountLayer({ fetcher, topics: [], corner: [24, 64], engine: 'come', label: 'Nefertiti', purse: { nest: ${JSON.stringify(ORIGIN)}, now: () => Date.now() }, files });
globalThis.__layer = layer;
layer.come({ from: [innerWidth - 60, innerHeight - 60] });
</script></body></html>`;
const server = http.createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost'), p = url.pathname;
  const J = (s, code = 200) => { res.setHeader('access-control-allow-origin', '*'); res.setHeader('content-type', 'application/json'); res.writeHead(code); res.end(s); };
  if (p === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  if (p.startsWith('/nest/ref/')) { reads.refs++; const name = decodeURIComponent(p.slice('/nest/ref/'.length)), ref = REFS[name]; return ref ? J(JSON.stringify({ name, ref })) : J('{"error":"no ref"}', 404); }
  if (p === '/nest/stream') { reads.streams++; res.writeHead(200, { 'content-type': 'text/event-stream', 'cache-control': 'no-cache', 'access-control-allow-origin': '*' }); res.write(': the proof\n\n'); req.on('close', () => res.end()); return; }
  if (p === '/ui/intro/dyson-society/app/depth-proof.html') { res.setHeader('content-type', 'text/html; charset=utf-8'); res.end(PAGE()); return; }
  if (!p.startsWith('/ui/')) { reads.other.push(p); res.writeHead(404); res.end(); return; }
  const file = path.join(UI, decodeURIComponent(p.slice('/ui/'.length)));
  if (!path.resolve(file).startsWith(UI + path.sep)) { res.writeHead(403); res.end(); return; }
  fs.readFile(file, (error, body) => {
    if (error) { reads.other.push(p); res.writeHead(404); res.end(); return; }
    const types = { '.html': 'text/html; charset=utf-8', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml' };
    res.setHeader('content-type', types[path.extname(file)] || 'application/octet-stream'); res.end(body);
  });
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const port = server.address().port; ORIGIN = `http://127.0.0.1:${port}`;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'dl-athena-depth-chrome-'));
const chrome = arg('--chrome', path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'));
const child = spawn(chrome, ['--headless=new', '--remote-debugging-port=0', `--user-data-dir=${profile}`, '--no-first-run', '--disable-extensions', '--disable-sync', '--disable-component-update',
  '--disable-background-networking', '--mute-audio', `--window-size=${SIZE.join(',')}`, 'about:blank'], { stdio: 'ignore', detached: true });
const kill = () => { try { process.kill(-child.pid, 'SIGKILL'); } catch { /* gone */ } };
process.once('exit', () => { kill(); try { fs.rmSync(profile, { recursive: true, force: true }); } catch { /* gone */ } });
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const watchdog = setTimeout(() => { console.error('the depth proof exceeded 90 s'); kill(); process.exit(2); }, 90000);
let socket, failed = null;
const summary = { pass: false, out };
try {
  let debugPort;
  for (let i = 0; !debugPort && i < 150; i++) { try { debugPort = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch { await sleep(100); } }
  assert.ok(debugPort, 'headless browser started');
  const version = await (await fetch(`http://127.0.0.1:${debugPort}/json/version`)).json();
  socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  let id = 0; const pending = new Map(), errors = [], blocked = [];
  const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { pending.set(++id, { resolve, reject }); socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })); });
  let call = null;
  socket.onmessage = (event) => {
    const m = JSON.parse(event.data);
    if (pending.has(m.id)) { const q = pending.get(m.id); pending.delete(m.id); m.error ? q.reject(new Error(m.error.message)) : q.resolve(m.result); return; }
    if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
    if (m.method === 'Fetch.requestPaused' && call) {
      const r = m.params, local = r.request.url.startsWith(ORIGIN + '/'); if (!local) blocked.push(r.request.url.slice(0, 120));
      void call(local ? 'Fetch.continueRequest' : 'Fetch.failRequest', local ? { requestId: r.requestId } : { requestId: r.requestId, errorReason: 'BlockedByClient' }).catch(() => {});
    }
  };
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  call = (method, params) => send(method, params, sessionId);
  const evaluate = async (expression) => { const r = await call('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result.value; };
  await call('Runtime.enable'); await call('Page.enable'); await call('Fetch.enable', { patterns: [{ urlPattern: '*' }] });
  await call('Emulation.setDeviceMetricsOverride', { width: SIZE[0], height: SIZE[1], deviceScaleFactor: DPR, mobile: false });
  const READ = `(() => { const L = globalThis.__layer, s = L && L.state(), i = globalThis.__inst; return s ? { engine: s.engine, live: s.live, at: s.at, box: L.box(), depth: s.depth, purse: s.purse && { samples: s.purse.samples, kept: s.purse.kept, paints: s.purse.paints, shown: s.purse.shown },
    fpsCap: i ? i.fpsCap : null, cull: i ? i.cullOffscreen : null, img: (() => { const im = L.els.her; return { transform: im.style.transform || '', translate: im.style.translate || '' }; })() } : null; })()`;
  const until = async (f, ms, why) => { const end = Date.now() + ms; let v; while (Date.now() < end) { v = await evaluate(READ); if (errors.length) throw new Error(errors.join('\n')); if (f(v)) return v; await sleep(60); } throw new Error(why + ': ' + JSON.stringify(v)); };
  const shot = async (name, v) => { const b = v.box, x = Math.max(0, v.at[0] - 20), y = Math.max(0, v.at[1] - 20); const r = await call('Page.captureScreenshot', { format: 'png', clip: { x, y, width: Math.min(b.w + 40, SIZE[0] - x), height: Math.min(b.h + 40, SIZE[1] - y), scale: DPR } }); fs.writeFileSync(path.join(out, name + '.png'), Buffer.from(r.data, 'base64')); };
  const move = (x, y) => call('Input.dispatchMouseEvent', { type: 'mouseMoved', x, y, button: 'none', buttons: 0, pointerType: 'mouse' });
  await call('Page.navigate', { url: `${ORIGIN}/ui/intro/dyson-society/app/depth-proof.html` });
  let v = await until((x) => x && x.engine && x.live && x.purse && x.purse.shown, 15000, 'her engine stood and the purse showed');
  await sleep(800); v = await evaluate(READ);
  assert.equal(v.fpsCap, 0, 'no cap on the engine'); assert.equal(v.cull, false, 'no offscreen test');
  await shot('a-rest', v);
  // A. the display's rate
  const rate = await evaluate(`new Promise((done) => { const i = globalThis.__inst; let paints = 0, rafs = 0; const prev = i.onSceneFrame; i.onSceneFrame = (...a) => { paints++; return prev && prev(...a); };
    const t0 = performance.now(); const f = () => { rafs++; if (performance.now() - t0 < 3000) requestAnimationFrame(f); else { i.onSceneFrame = prev; done({ paints, rafs, s: (performance.now() - t0) / 1000 }); } }; requestAnimationFrame(f); })`);
  assert.ok(rate.rafs >= 100, 'the browser gave frames: ' + JSON.stringify(rate));
  assert.ok(Math.abs(rate.paints - rate.rafs) <= Math.max(2, rate.rafs * 0.03), 'she paints on every frame the display gives: ' + JSON.stringify(rate));
  const cost = await evaluate(`(() => { const PE = globalThis.__PE, i = globalThis.__inst; PE.drawOnce(i); const n = 300, t0 = performance.now(); for (let k = 0; k < n; k++) PE.drawOnce(i); return { ms_per_picture: Math.round((performance.now() - t0) / n * 1000) / 1000, canvas: [i.cv.width, i.cv.height] }; })()`);
  assert.ok(cost.ms_per_picture < 1.5, 'one picture under 1.5 ms: ' + JSON.stringify(cost));
  const before = await evaluate(READ);
  assert.ok(before.purse.samples + before.purse.kept >= rate.paints * 0.9, 'the purse sampled on every paint: ' + JSON.stringify(before.purse));
  summary.rate = { ...rate, per_s: Math.round(rate.paints / rate.s), ...cost };
  // B. the look: left and above her, then right and below
  const c = [before.at[0] + before.box.w / 2, before.at[1] + before.box.h / 2];
  const left = [Math.max(2, c[0] - 300), Math.max(2, c[1] - 200)];
  await move(left[0], left[1]); await sleep(1100); v = await evaluate(READ); await shot('b-left', v);
  const wantL = lookOf(left, [v.at[0] + v.box.w / 2, v.at[1] + v.box.h / 2]), dL = depthOf(wantL);
  assert.ok(v.depth.writes > before.depth.writes, 'the look was written on the engine\'s picture: ' + JSON.stringify(v.depth));
  assert.ok(v.depth.yaw > 0.08 && v.depth.pitch > 0.03, 'the camera turned toward a pointer left and above (unit0\'s front slides with the pointer: yaw +, and rises: pitch +): ' + JSON.stringify(v.depth));
  assert.ok(Math.abs(v.depth.look[0] - wantL[0]) < 0.01 && Math.abs(v.depth.look[1] - wantL[1]) < 0.01, 'the spring settled on the look: ' + JSON.stringify({ look: v.depth.look, wantL }));
  assert.ok(Math.abs(v.depth.yaw - dL.yaw) < 0.01 && Math.abs(v.depth.pitch - dL.pitch) < 0.01, 'the turn is the law\'s: ' + JSON.stringify({ at: v.depth, law: dL }));
  assert.match(v.depth.sprite, /^-\d+(\.\d+)?px -\d+(\.\d+)?px$/, 'the sprite slid left and up: ' + v.depth.sprite);
  summary.left = { pointer: left, look: v.depth.look, yaw: v.depth.yaw, pitch: v.depth.pitch, sprite: v.depth.sprite, writes: v.depth.writes - before.depth.writes };
  const right = [Math.min(SIZE[0] - 2, c[0] + 300), Math.min(SIZE[1] - 2, c[1] + 120)];
  const wasWrites = v.depth.writes;
  await move(right[0], right[1]); await sleep(1100); v = await evaluate(READ); await shot('c-right', v);
  assert.ok(v.depth.yaw < -0.08 && v.depth.pitch < -0.03, 'the camera turned toward a pointer right and below: ' + JSON.stringify(v.depth));
  assert.match(v.depth.sprite, /^\d+(\.\d+)?px \d+(\.\d+)?px$/, 'the sprite slid right and down: ' + v.depth.sprite);
  summary.right = { pointer: right, look: v.depth.look, yaw: v.depth.yaw, pitch: v.depth.pitch, sprite: v.depth.sprite, writes: v.depth.writes - wasWrites };
  // C. at rest: the pointer still, the spring given its time (DEPTH.settle), then a second with no write while the engine paints
  await sleep(1500); const still0 = await evaluate(READ); await sleep(1000); const still1 = await evaluate(READ);
  assert.equal(still1.depth.writes, still0.depth.writes, 'nothing written at rest');
  assert.ok(still1.depth.steps > still0.depth.steps + 30, 'the engine kept painting (the look stepped on each picture): ' + JSON.stringify({ a: still0.depth.steps, b: still1.depth.steps }));
  summary.rest = { writes: still1.depth.writes, steps_in_1s: still1.depth.steps - still0.depth.steps };
  // D. the sprite's img untouched: the perch's translate alone
  assert.equal(v.img.transform, ''); assert.equal(v.img.translate, '');
  summary.depth = DEPTH; summary.reads = reads; summary.blocked = blocked.length; summary.pass = true;
} catch (e) { failed = e; }
clearTimeout(watchdog); try { socket?.close(); } catch { /* closed */ } kill(); server.close();
if (failed) { summary.error = String(failed.message || failed); console.log(JSON.stringify(summary)); process.exit(1); }
console.log(JSON.stringify(summary)); process.exit(0);

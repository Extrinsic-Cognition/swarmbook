#!/usr/bin/env node
// fight-lyssa-seiya.proof.mjs: ONE WHOLE FIGHT FROM FIXED CAUSES IN A REAL BROWSER, OFF EVERY SCREEN (lane fight-lyssa-seiya, Oct 18 2026).
// Run on the new Mac, never the serving Mac: a headless Chrome (no window on any screen) loads lab/fight-lyssa-seiya.html from a local door
// over the tree's ui folder, reads the plan of the default causes, draws the fight at the summoning, at every hit (mid-freeze: the pose held),
// at her spells, and through his fall, saves each frame, and has the page lay them out on one contact sheet. It checks nothing runs at rest.
//   node fight-lyssa-seiya.proof.mjs --tree <checkout> --out <folder> [--chrome <path>] [--width 1280] [--height 720] [--for harleyquintiti]
// --for harleyquintiti (Oct 24 2026): THE FIGHT FOR HARLEYQUINTITI, the page's protect fight from its scripted hand (HIS_SCRIPT), no Nest (?nest=0): the
// summoning before her, his meteors, his body stopping her dives, his meteor breaking her bolt, her strikes reaching Harleyquintiti, his hits, her flights,
// the end; it passes when Seiya wins with her protected, every frame is saved, and nothing runs at rest.
// The page has no film and no sound: The rule's item 8 (the sound never restarts the picture) does not bind it; the door here is node's own.
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const arg = (k, d) => { const i = process.argv.indexOf(k); return i < 0 ? d : process.argv[i + 1]; };
const tree = path.resolve(arg('--tree', '.')), out = path.resolve(arg('--out', path.join(os.tmpdir(), 'fight-lyssa-seiya-proof')));
const W = Number(arg('--width', 1280)), H = Number(arg('--height', 720));
const FOR = arg('--for', null) === 'harleyquintiti' ? 'harleyquintiti' : null, NAME = FOR ? 'harley' : 'fight';
const chrome = arg('--chrome', path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'));
const root = path.join(tree, 'embertide-app/ui');
fs.mkdirSync(out, { recursive: true });
const MIME = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.woff2': 'font/woff2', '.png': 'image/png' };
const requested = [];
const server = http.createServer((req, res) => {
  const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname); requested.push(pathname);
  if (pathname === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  const file = path.resolve(root, `.${pathname}`);
  if (!file.startsWith(root + path.sep)) { res.writeHead(403); res.end(); return; }   // as aiolos: the path as asked lies under ui; a link in it is followed
  fs.readFile(file, (error, body) => {
    if (error) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'cache-control': 'no-store' }); res.end(body);
  });
});
await new Promise((ok) => server.listen(0, '127.0.0.1', ok));
const port = server.address().port, profile = fs.mkdtempSync(path.join(os.tmpdir(), 'fight-ls-chrome-'));
const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
const child = spawn(chrome, ['--headless=new', '--remote-debugging-port=0', '--remote-allow-origins=*', `--user-data-dir=${profile}`, '--no-first-run',
  '--no-default-browser-check', '--disable-extensions', '--disable-sync', '--disable-component-update', '--disable-background-networking', '--mute-audio',
  '--use-angle=metal', `--window-size=${W},${H}`, 'about:blank'], { stdio: 'ignore', detached: true });
const kill = () => { try { process.kill(-child.pid, 'SIGKILL'); } catch {} };
process.once('exit', kill);
const watchdog = setTimeout(() => { console.error('the fight proof passed 240 s'); kill(); process.exit(2); }, 240000);
let socket;
const t0 = Date.now();
try {
  let debugPort;
  for (let i = 0; !debugPort && i < 300; i++) { try { debugPort = fs.readFileSync(path.join(profile, 'DevToolsActivePort'), 'utf8').split('\n')[0]; } catch { await sleep(100); } }
  if (!debugPort) throw new Error('Chrome did not start');
  const version = await (await fetch(`http://127.0.0.1:${debugPort}/json/version`)).json();
  socket = new WebSocket(version.webSocketDebuggerUrl);
  await new Promise((ok, no) => { socket.onopen = ok; socket.onerror = no; });
  let id = 0; const pending = new Map(), errors = [], consoles = [];
  socket.onmessage = (event) => {
    const m = JSON.parse(event.data);
    if (pending.has(m.id)) { const c = pending.get(m.id); pending.delete(m.id); m.error ? c.no(new Error(m.error.message)) : c.ok(m.result); }
    else if (m.method === 'Runtime.exceptionThrown') errors.push(m.params.exceptionDetails.exception?.description ?? m.params.exceptionDetails.text);
    else if (m.method === 'Runtime.consoleAPICalled') { const line = m.params.args.map((a) => a.value ?? a.description).join(' '); (m.params.type === 'error' ? errors : consoles).push(line); }
  };
  const send = (method, params = {}, sessionId) => new Promise((ok, no) => { pending.set(++id, { ok, no }); socket.send(JSON.stringify({ id, method, params, ...(sessionId ? { sessionId } : {}) })); });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const call = (method, params) => send(method, params, sessionId);
  const evaluate = async (expression) => {
    const r = await call('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
    return r.result.value;
  };
  await call('Runtime.enable'); await call('Page.enable');
  await call('Emulation.setFocusEmulationEnabled', { enabled: true });
  await call('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await call('Page.navigate', { url: `http://127.0.0.1:${port}/intro/dyson-society/lab/fight-lyssa-seiya.html?play=0${FOR ? '&for=harleyquintiti&nest=0&seat=proof' : ''}` });
  for (let i = 0; i < 300; i++) {
    const s = await evaluate('window.FIGHT ? (window.FIGHT.error ? "error" : window.FIGHT.ready ? "ready" : "loading") : (document.getElementById("err") && !document.getElementById("err").hidden ? "error" : "loading")').catch(() => 'loading');
    if (s !== 'loading') break; if (errors.length) break; await sleep(100);
  }
  const state = await evaluate('window.FIGHT && window.FIGHT.ready ? "ready" : (document.getElementById("err")?.textContent || "not ready")');
  if (state !== 'ready') throw new Error(`the page did not get ready: ${state}\n${errors.join('\n')}`);
  const loadMs = Date.now() - t0;
  const gpu = await evaluate(`(() => { const c = document.createElement('canvas').getContext('webgl2'); const e = c && c.getExtension('WEBGL_debug_renderer_info'); return e ? c.getParameter(e.UNMASKED_RENDERER_WEBGL) : 'unknown'; })()`);
  const events = await evaluate('FIGHT.events()'), freezes = await evaluate('FIGHT.freezes()'), end = await evaluate('FIGHT.end()');
  // the instants: the summoning, every hit and block mid-freeze, her spells as they show, his fall
  const at = (g) => { let acc = 0; for (const f of freezes) { if (f.g >= g) break; acc += f.hold; } return g + acc; };
  const mid = (e) => { const f = freezes.find((x) => Math.abs(x.g - e.g) < 1e-6); return f ? f.w + Math.min(f.hold / 2, 300) : e.w; };
  const sec = (ms) => `${(ms / 1000).toFixed(2)} s`;
  const cells = [{ w: at(900), label: 'SUMMONING: Seiya at his place (the magic word)', sub: 'his savestate\'s 19.39 units: 1.86 m', kind: 'summon' }];
  let n = 0;
  for (const e of events) {
    if (e.kind === 'hit' || e.kind === 'block') {
      n++;
      const who = e.kind === 'block' ? 'BLOCK' : e.who === 'her' ? 'HER HIT' : 'HIS HIT';
      const label = e.kind === 'block' ? `${who}: his ${e.what} held by THE KNIGHTIAN WIND` : `${who} ${n}: ${e.name}${e.damage ? `  -${e.damage.toFixed(2)}` : ''}`;
      cells.push({ w: mid(e), label, sub: `in-game ${sec(e.g)} · wall ${sec(mid(e))} · Seiya ${(e.his_hp ?? 0).toFixed(1)} · her ${(e.her_hp ?? 0).toFixed(1)}`, kind: e.kind, what: e.what, who: e.who, g: e.g });
    }
    if (e.kind === 'mark') cells.push({ w: at(e.g + 300), label: 'THE POST-IT slapped on him', sub: `in-game ${sec(e.g)}`, kind: 'mark', g: e.g });
    if (e.kind === 'gust') cells.push({ w: at(e.g + 120), label: 'THE KNIGHTIAN WIND: the gust on the downbeat', sub: `in-game ${sec(e.g)}`, kind: 'gust', g: e.g });
    if (e.kind === 'broken') cells.push({ w: at(e.g + 200), label: `his meteor breaks her ${e.what}`, sub: `in-game ${sec(e.g)}`, kind: 'broken', g: e.g });
  }
  const plan = await evaluate('(() => { const P = FIGHT.plan; return { spells: P.spells.map((s) => ({ kind: s.kind, g0: s.g0, g1: s.g1, g2: s.g2, g3: s.g3, gold: !!s.gold })) }; })()');
  for (const s of plan.spells) {
    if (s.kind === 'blink') { cells.push({ w: at(s.g0 + 240), label: 'THE BLACKHOLE: she sinks', sub: `in-game ${sec(s.g0 + 240)}`, kind: 'blink' }); cells.push({ w: at(s.g2 + 150), label: '...INTO A WHITEHOLE: she rises round him', sub: `in-game ${sec(s.g2 + 150)}`, kind: 'blink' }); }
    if (s.kind === 'bolt') cells.push({ w: at(s.g0 + (s.g1 - s.g0) * 0.55), label: s.gold ? 'THE SAGITTARIUS ARMOR: her gold arrow flies' : 'LIGHTNING BOLT: the light-boomerang flies', sub: `in-game ${sec(s.g0 + (s.g1 - s.g0) * 0.55)}`, kind: 'bolt' });
    if (s.kind === 'armor') cells.push({ w: at(s.g1 - 300), label: 'THE SAGITTARIUS ARMOR: she turns gold', sub: `in-game ${sec(s.g1 - 300)}`, kind: 'armor' });
  }
  const fall = end.fall;
  if (fall) for (const [dt, label] of [[120, 'HIS FALL begins (the ragdoll over his rig)'], [400, 'his fall'], [800, 'his fall'], [2400, 'he lies where he fell'], [end.g - fall.g - 40, 'the end']])
    cells.push({ w: at(fall.g + 1) + dt + (dt === end.g - fall.g - 40 ? 0 : 0), label, sub: `in-game ${sec(fall.g + dt)} · ${end.winner} wins`, kind: 'fall' });
  if (FOR) {   // THE FIGHT FOR HARLEYQUINTITI: the instants that show the protecting, a few of each kind
    cells.length = 0;
    const pick = (f, k) => events.filter(f).slice(0, k);
    cells.push({ w: at(900), label: 'SUMMONING: Seiya before Harleyquintiti', sub: 'she stands 1.2 m behind him, the Lyssajudron before them', kind: 'summon' });
    for (const e of pick((x) => x.kind === 'act' && x.move === 'meteor', 2)) cells.push({ w: at(e.g + 400), label: `PEGASUS RYU SEI KEN · ${e.n} taps · cosmos x${e.cosmos.toFixed(2)}`, sub: `in-game ${sec(e.g)} · ${e.by}`, kind: 'meteor', g: e.g });
    for (const e of pick((x) => x.kind === 'dive' && x.on === 'seiya', 3)) cells.push({ w: mid(e), label: 'HIS BODY STOPS HER DIVE', sub: `in-game ${sec(e.g)} · seat ${e.seat}`, kind: 'stop', g: e.g });
    for (const e of pick((x) => x.kind === 'broken', 2)) cells.push({ w: at(e.g + 150), label: `HIS METEOR BREAKS HER ${e.what === 'finisher' ? 'GOLD ARROW' : 'BOLT'}`, sub: `in-game ${sec(e.g)}`, kind: 'broken', g: e.g });
    for (const e of pick((x) => x.kind === 'hit' && x.on === 'harley', 3)) cells.push({ w: mid(e), label: `HER ${String(e.what).toUpperCase()} REACHES HARLEYQUINTITI  -${e.damage.toFixed(2)}`, sub: `in-game ${sec(e.g)} · Harleyquintiti ${e.harley_hp.toFixed(1)}`, kind: 'harley', g: e.g });
    for (const e of pick((x) => x.kind === 'hit' && x.who === 'seiya', 3)) cells.push({ w: mid(e), label: `HIS HIT: ${e.name}  -${e.damage.toFixed(2)}`, sub: `in-game ${sec(e.g)} · her ${e.her_hp.toFixed(1)}`, kind: 'hit', g: e.g });
    for (const e of pick((x) => x.kind === 'act' && x.move === 'punch', 1)) cells.push({ w: at(e.g + 520), label: 'THE PUNCH (59.3040): his lunge', sub: `in-game ${sec(e.g)}`, kind: 'punch', g: e.g });
    const sp = (k, f) => plan.spells.filter((x) => x.kind === k && (!f || f(x)))[0];
    const blink = sp('blink'), bolt = sp('bolt', (x) => !x.gold), gold = sp('bolt', (x) => x.gold);
    if (blink) cells.push({ w: at(blink.g2 + 150), label: 'THE WHITEHOLE: she rises round him, the line to her open', sub: `in-game ${sec(blink.g2 + 150)}`, kind: 'blink' });
    if (bolt) cells.push({ w: at(bolt.g0 + (bolt.g1 - bolt.g0) * 0.5), label: 'LIGHTNING BOLT: she flies at Harleyquintiti', sub: `in-game ${sec(bolt.g0 + (bolt.g1 - bolt.g0) * 0.5)}`, kind: 'bolt' });
    if (gold) cells.push({ w: at(gold.g0 + (gold.g1 - gold.g0) * 0.5), label: 'THE GOLD ARROW flies at her', sub: `in-game ${sec(gold.g0 + (gold.g1 - gold.g0) * 0.5)}`, kind: 'gold' });
    cells.push({ w: end.wall_ms - 40, label: end.protected ? 'HARLEYQUINTITI PROTECTED' : end.taken ? 'HARLEYQUINTITI TAKEN' : 'THE END', sub: `in-game ${sec(end.g)} · ${end.winner || 'time'} · Harleyquintiti ${(end.harley ?? 0).toFixed(1)}`, kind: 'end' });
  }
  cells.sort((a, b) => a.w - b.w);
  // every frame, saved
  const shots = [];
  for (let i = 0; i < cells.length; i++) {
    const c = cells[i];
    const st = await evaluate(`(async () => { const s = FIGHT.draw(${c.w}); await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))); return s; })()`);
    const shot = await call('Page.captureScreenshot', { format: 'png' });
    const file = `${NAME}-${String(i + 1).padStart(2, '0')}-${c.kind}.png`; fs.writeFileSync(path.join(out, file), Buffer.from(shot.data, 'base64'));
    if (c.kind === 'hit' || c.kind === 'block') c.sub = `in-game ${sec(st.g)} \u00b7 wall ${sec(c.w)} \u00b7 Seiya ${st.hp.seiya.toFixed(1)} \u00b7 her ${st.hp.her.toFixed(1)}`;   // the health as drawn: the frame after the hit
    shots.push({ file, ...c, state: st });
  }
  // the contact sheet, laid out by the page from the same draws
  const sheetUrl = await evaluate(`FIGHT.sheet(${JSON.stringify(cells.map((c) => ({ w: c.w, label: c.label, sub: c.sub })))}, { cols: 5, cw: 384, ch: 216 })`);
  fs.writeFileSync(path.join(out, `${NAME}-sheet.png`), Buffer.from(sheetUrl.split(',')[1], 'base64'));
  // what a frame costs (the draw of one instant, the GPU's included by a read-back), and nothing at rest
  const bench = await evaluate(`(() => { const gl = document.getElementById('glass').getContext('webgl2'), px = new Uint8Array(4), t = []; for (let i = 0; i < 40; i++) { const a = performance.now(); FIGHT.draw(${Math.round(end.wall_ms / 2)} + i * 25); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); t.push(performance.now() - a); } t.sort((x, y) => x - y); return { median_ms: t[20], p95_ms: t[38] }; })()`);
  const planMs = await evaluate('FIGHT.replanMs ? FIGHT.replanMs() : null');
  const before = await evaluate('FIGHT.frames'); await sleep(1500); const idle = (await evaluate('FIGHT.frames')) - before;
  const report = { proof: FOR ? 'fight-for-harleyquintiti' : 'fight-lyssa-seiya', at: new Date().toISOString(), gpu, viewport: [W, H], load_ms: loadMs, end, events: events.length,
    kinds: events.reduce((m, e) => ((m[e.kind] = (m[e.kind] || 0) + 1), m), {}), freezes: freezes.length, frames_saved: shots.length,
    cells: shots.map((s) => ({ file: s.file, w: Math.round(s.w), label: s.label, sub: s.sub, g: s.state.g, freeze: s.state.freeze, hp: s.state.hp })),
    bench, plan_ms: planMs, idle_frames: idle, errors, consoles: consoles.slice(0, 20), requested: [...new Set(requested)] };
  report.pass = !errors.length && (FOR ? end.winner === 'Seiya' && end.protected === true && shots.every((x) => x.state.harley) : end.winner === 'Lyssajudron' && !!end.fall)
    && shots.length === cells.length && idle === 0 && fs.statSync(path.join(out, `${NAME}-sheet.png`)).size > 10000;
  fs.writeFileSync(path.join(out, FOR ? 'harley-proof.json' : 'proof.json'), JSON.stringify(report, null, 1) + '\n');
  console.log(JSON.stringify({ pass: report.pass, gpu, end: { g: end.g, winner: end.winner, wall_ms: end.wall_ms }, frames_saved: shots.length, bench, plan_ms: planMs, idle_frames: idle, errors: errors.length, load_ms: loadMs }));
  if (!report.pass) process.exitCode = 1;
} catch (e) {
  console.error(String(e?.stack || e)); process.exitCode = 1;
} finally {
  clearTimeout(watchdog); try { socket?.close(); } catch {} kill(); server.close();
  await sleep(200); fs.rmSync(profile, { recursive: true, force: true });
}

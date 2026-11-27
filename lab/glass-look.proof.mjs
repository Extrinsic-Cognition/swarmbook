#!/usr/bin/env node
// glass-look.proof.mjs: THE GLASS IS TRANSPARENT, proved in a real browser (glass-look.mjs, theater.js). His words, Oct 17 2026 20:4x WEST, over two
// screenshots of the debug start's still (the dodecahedron as flat opaque faces over Seiya): "why the fuck is it like this at the beginning and is not
// like glass?" and "it must be a glass i. dont want to seethis it must be transparent".
// A muted headless Chrome, off every screen, opens the served mint page with ?debug (the second burst's first frame, held until the hero is up, as his
// house's doors do on the Nest's word mint/debug-start) and, with --glass cuts, his word for THE CUTS' flash. It records every draw of the theater
// (window.hero.state().last: the pass drawn, the burst's age, whether the film was paused) and pictures the glass where it stands:
//   1. THE HOLD: the film held 5 ms into the burst. The glass's middle (a disc of a quarter of its radius at the glass's centre, read off the
//      composited page) must show the film through it: never the flat normals (periwinkle, 0.5 0.5 1 toward the eye) or the flat gold matte, so the
//      patch must carry the film's own texture (a spread of its pixels) and not lean blue.
//   2. THE RELEASE: the film plays through the burst's first fifth of a second: with no word every draw is the glass (pass 0); with --glass cuts the
//      flash plays (pass 1 or 2 in a draw while the film moves) and is never drawn while it is held (the hold itself stands inside the flash's tenth).
// The pass each draw used is read off the renderer (the uniform uPass of the theater's WebGL program), so main's tree and a lane are judged alike.
// (A pause made from outside the page does not hold: a muted visitor's film is played again by the page itself, so the hold is the held case.)
// Exit 0 PASS, 1 FAIL, 2 could not run. Requests leave only to the page's own origin. It ends its Chrome and its profile and gives itself 150 s.
//   nice -n 19 node lab/glass-look.proof.mjs --url http://127.0.0.1:<port>/intro/dyson-society/app/warm.html [--glass cuts] [--out <dir>] [--chrome <path>]
// The page must be served with byte ranges (tools/serve-range, aiolos): never python's http.server (the house's rule 8).
// COST: one Chrome for about twenty seconds; run it on the new Mac, niced, under a time limit.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const BASE = opt('--url', ''), GLASS = opt('--glass', ''), OUT = opt('--out', null);
const [W, H] = opt('--size', '1280x900').split('x').map(Number);
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')];
const CHROME = opt('--chrome', CHROMES.find((c) => fs.existsSync(c)));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const BURST2 = 1141 * 1001 / 30000;   // app/dl-twelve-clock.js BURST2_S, lab/hero-mount.js BURSTS[1].t

// the pass a draw used, read off the renderer itself: the theater's canvas's WebGL2 context, its current program, the uniform uPass (the shader's own
// switch between the glass, the normals and the matte), so the house's main and a lane are judged by the same reading
const PASS = `(() => { const c = document.getElementById('hero-theater'), gl = c?.getContext('webgl2'), p = gl?.getParameter(gl.CURRENT_PROGRAM);
  const at = p ? gl.getUniformLocation(p, 'uPass') : null; return at ? gl.getUniform(p, at) : null; })()`;
// in the page: a log of the theater's draws, one row a new draw (rAF reads hero.state().last and the uniform), never a hook into the page's own code
const ARM = `(() => { if (window.__glassDraws) return true; const rows = window.__glassDraws = []; let was = -1; const pass = () => ${PASS};
  const look = () => { const s = window.hero?.state?.(), d = s?.last, f = document.getElementById('dl-twelve-film');
    if (d && d.draws !== was) { was = d.draws; rows.push({t: +d.t.toFixed(4), pass: pass(), burst: +(d.burst || 0).toFixed(3), paused: Boolean(f?.paused), draws: d.draws}); }
    requestAnimationFrame(look); };
  requestAnimationFrame(look); return true; })()`;
const STATE = `JSON.stringify((() => { const f = document.getElementById('dl-twelve-film'), s = window.dlTwelve?.state?.(), h = window.hero, d = h?.state?.().last;
  const c = document.getElementById('hero-theater'), r = c?.getBoundingClientRect();
  return {t: f?.currentTime ?? null, paused: f?.paused ?? null, ready: f?.readyState ?? 0, debug: s?.debug ?? null, theater: Boolean(h?.theater), unbox: Boolean(h?.unbox), glass: h?.glass ?? null,
    canvas: r && !c.hidden ? {left: r.left, top: r.top, width: r.width, height: r.height} : null, draw: d ? {t: d.t, pass: ${PASS}, burst: d.burst, pose: d.pose ? {x: d.pose.x, y: d.pose.y, r: d.pose.radiusHeight} : null} : null,
    draws: (window.__glassDraws || []).length}; })())`;

/** A PNG's pixels are not decoded here: the patch is read by the page itself off the screenshot (an <img> of it on a canvas of the same origin). */
const PATCH = (png, x, y, rad) => `(async () => { const img = new Image(); img.src = 'data:image/png;base64,${png}'; await img.decode();
  const c = document.createElement('canvas'); c.width = img.width; c.height = img.height; const g = c.getContext('2d'); g.drawImage(img, 0, 0);
  const x0 = Math.max(0, Math.round(${x} - ${rad})), y0 = Math.max(0, Math.round(${y} - ${rad})), n = Math.max(1, Math.round(2 * ${rad}));
  const px = g.getImageData(x0, y0, n, n).data, Y = (o) => 0.299 * px[o] + 0.587 * px[o + 1] + 0.114 * px[o + 2];
  let k = 0, hf = 0; const sum = [0, 0, 0];
  for (let j = 0; j + 1 < n; j++) for (let i = 0; i + 1 < n; i++) { if ((i - n / 2) ** 2 + (j - n / 2) ** 2 > (n / 2) ** 2) continue; const o = (j * n + i) * 4; k++;
    for (let ch = 0; ch < 3; ch++) sum[ch] += px[o + ch];
    hf += (Math.abs(Y(o + 4) - Y(o)) + Math.abs(Y(o + 4 * n) - Y(o))) / 2; }
  return JSON.stringify({n: k, mean: sum.map((v) => +(v / k).toFixed(1)), hf: +(hf / k).toFixed(2)}); })()`;

/** The glass's middle: the film through it carries its texture (a flat face is flat but for its edges: under 2.5 of luminance a pixel, its high pass)
 *  and does not lean blue as the normals' face toward the eye (0.5 0.5 1). */
export const isGlass = (p) => Boolean(p && p.n > 50 && p.hf >= 2.5 && !(p.mean[2] > p.mean[0] + 40 && p.mean[2] > 180));

async function main() {
  if (!BASE || !CHROME) { console.error('usage: glass-look.proof.mjs --url <the served mint page> [--glass cuts] [--out dir]'); return 2; }
  const page = new URL(BASE); page.searchParams.set('debug', ''); if (GLASS) page.searchParams.set('glass', GLASS);
  const url = page.href, origin = page.origin;
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'glass-look-proof-'));
  const child = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, `--window-size=${W},${H}`, '--hide-scrollbars',
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions',
    '--disable-default-apps', '--disable-features=Translate,MediaRouter,OptimizationHints', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows', 'about:blank'], {stdio: 'ignore'});
  let ws = null;
  const end = async () => {
    try { ws?.close(); } catch {}
    try { child.kill('SIGTERM'); } catch {}
    for (let i = 0; i < 30 && child.exitCode === null && child.signalCode === null; i++) await sleep(100);
    if (child.exitCode === null && child.signalCode === null) { try { child.kill('SIGKILL'); } catch {} await sleep(200); }
    try { fs.rmSync(dir, {recursive: true, force: true}); } catch {}
  };
  const bound = setTimeout(() => { console.error('150 s passed: ended'); end().then(() => process.exit(2)); }, 150000);
  const onSig = () => end().then(() => process.exit(2)); process.on('SIGTERM', onSig); process.on('SIGINT', onSig);
  const out = {url, glass: GLASS || 'no word', chrome: CHROME, when: new Date().toISOString(), checks: {}};
  try {
    let port = null;
    for (let i = 0; i < 400 && !port; i++) { await sleep(150); if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`); try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {} }
    if (!port) throw new Error('Chrome did not open its debugging port');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json());
    ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0; const wait = new Map(), errors = [], refused = new Set();
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    ws.onmessage = (m) => {
      const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const u = x.params.request.url, ok = !u.startsWith(origin + '/lock/') && (u.startsWith(origin + '/') || u.startsWith('data:') || u.startsWith('blob:'));
        if (ok) send('Fetch.continueRequest', {requestId: x.params.requestId}, x.sessionId).catch(() => {});
        else { refused.add(new URL(u).origin); send('Fetch.failRequest', {requestId: x.params.requestId, errorReason: 'BlockedByClient'}, x.sessionId).catch(() => {}); }
        return;
      }
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 300));
    };
    const tg = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: W, height: H});
    const s = (await send('Target.attachToTarget', {targetId: tg.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable']) await send(m, {}, s);
    await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: 1, mobile: false}, s);
    await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s); await send('Page.bringToFront', {}, s).catch(() => {});
    const evaluate = async (expr) => { const r = await send('Runtime.evaluate', {expression: expr, returnByValue: true, awaitPromise: true}, s); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result?.value; };
    const read = async (expr) => JSON.parse(await evaluate(expr) ?? 'null');
    const nav = await send('Page.navigate', {url}, s); if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    const picture = async (name, st) => {
      const shot = await send('Page.captureScreenshot', {format: 'png'}, s);
      if (OUT) { fs.mkdirSync(OUT, {recursive: true}); fs.writeFileSync(path.join(OUT, `${name}.png`), Buffer.from(shot.data, 'base64')); }
      const c = st.canvas, p = st.draw?.pose;
      if (!c || !p) return {missing: true};
      const x = c.left + p.x * c.width, y = c.top + (1 - p.y) * c.height, rad = Math.max(4, 0.25 * p.r * c.height * Math.sqrt(15) / 4);
      return {at: [Math.round(x), Math.round(y), Math.round(rad)], ...await read(PATCH(shot.data, x, y, rad))};
    };
    // 1. THE HOLD: the first draw of the theater with the film held in the burst
    let st = null, hold = null;
    for (let i = 0; i < 1500 && !hold; i++) {
      await sleep(20);
      try { await evaluate(ARM); st = await read(STATE); } catch { continue; }
      if (st?.debug?.released) break;
      if (st?.paused && st.draw && st.draw.burst > 0 && Math.abs(st.t - BURST2) < 0.05 && st.canvas) hold = {state: st, patch: await picture('1-hold', st)};
    }
    out.hold = hold ?? {missed: true, state: st};
    // 2. THE RELEASE: the burst's first half second of film as it plays
    for (let i = 0; i < 1500; i++) { await sleep(20); st = await read(STATE); if (st?.t > BURST2 + 0.6 && !st.paused) break; }
    const rows = await read('JSON.stringify(window.__glassDraws || [])');
    const flash = rows.filter((r) => r.t >= BURST2 && r.t < BURST2 + 0.25);
    out.release = {draws: flash, debug: st?.debug};
    const cuts = GLASS === 'cuts', moving = flash.filter((r) => !r.paused), resting = rows.filter((r) => r.paused && r.t >= BURST2 && r.t < BURST2 + 0.25);
    out.held = {draws: resting.length};
    const checks = out.checks;
    if (!hold) checks['the hold was pictured (the debug start held the film in the burst)'] = false;
    else {
      checks['at the hold the theater drew the glass (pass 0)'] = hold.state.draw.pass === 0;
      checks[`at the hold the glass's middle shows the film (texture ${hold.patch.hf}, mean ${hold.patch.mean})`] = isGlass(hold.patch);
    }
    checks['the burst was drawn as the film played through its first fifth of a second'] = moving.length >= 2;
    if (cuts) checks['his word cuts: the flash played while the film moved'] = moving.some((r) => r.pass === 1 || r.pass === 2);
    else checks['no word: every draw of the burst was the glass'] = flash.every((r) => r.pass === 0);
    checks[`the held film was drawn (${resting.length} draws inside the flash's fifth) and never as a pass`] = resting.length >= 1 && resting.every((r) => r.pass === 0)
      && rows.filter((r) => r.paused).every((r) => r.pass === 0);
    checks['the page read the look the address asked for'] = (st?.glass?.pass ?? null) === (cuts ? 'cuts' : 'none');
    out.passes = {hold: hold?.state?.draw?.pass ?? null, release: flash.map((r) => r.pass)};
    checks['no error in the page'] = errors.length === 0;
    Object.assign(out, {errors: errors.slice(0, 5), refused: [...refused], drawsLogged: rows.length, pass: Object.values(checks).every(Boolean)});
  } catch (e) { out.error = String(e?.message || e); }
  clearTimeout(bound); await end();
  console.log(JSON.stringify(out, null, 1));
  if (out.error) return 2;
  for (const [what, ok] of Object.entries(out.checks)) console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`);
  console.log(out.pass ? 'PASS: the glass is transparent where it was a flat still' : 'FAIL');
  return out.pass ? 0 : 1;
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === new URL(import.meta.url).pathname) main().then((code) => process.exit(code));

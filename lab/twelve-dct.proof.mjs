#!/usr/bin/env node
// twelve-dct.proof.mjs: THE TWELVE as a glass draws them, second by second, pictured headless (sagittarius-flight.mjs, theater.js; his Oct 17 2026 20:3x
// WEST word "the dodecaheron faces must begin to be aligned with the DCTs of the anime dude the spirit of the music"). A muted headless Chrome, off every
// screen, opens the lab's hero (lab/hero-ab.html, its panel hidden, the page in its frame as everyone meets it; --query adds the lab's switches:
// twelve=centre is THE TWELVE's other anchor), holds the film with the page's own pause (#motion: a pause from outside is played again by the page),
// puts it at each of --seconds (a proof's seek, never the page's: no tap, no sound), waits for the theater's draw of that second and pictures the window.
// It records each draw's flight (phase, the anime's light, the hole, the twelve, the throbs counted) beside its picture: <out>/at/<second>.jpg and
// <out>/twelve.json (the pictures hold the film's frames: keep them out of git). Checks: every second in THE TWELVE's span drew the twelve; the hole on
// the anime's light in the gathering and the glory (the anchor 'light'), at the middle with 'centre'; and from the cut no glass and no hole. THE ANIME
// NEVER STOPS (d17315abf, Oct 18 2026; his 00:5x WEST over a pause on the burst, "why the fuck when i pause on any fucking frame, regardless of the
// previous frame i see this shit?"): THE TWELVE end at the cut to the burst (sagittarius-flight.mjs SKY_FLASH, frame 1362), where they once flew home
// half a second past the old hold; from the cut the theater draws nothing, playing or paused, its canvas hidden: the anime alone.
//   nice -n 19 node lab/twelve-dct.proof.mjs --url http://127.0.0.1:<port>/intro/dyson-society/lab/hero-ab.html?paywall=off --out <dir> [--query twelve=centre]
//     [--seconds 42.4,43.7] [--size 1440x900] [--chrome <path>]
// Served with byte ranges only (tools/serve-range, aiolos): never python's http.server (the house's rule 8). Exit 0 PASS, 1 FAIL, 2 could not run.
// COST: one Chrome for about a minute; run it on the new Mac, niced, under a time limit.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {SKY_FLIGHT_START, SKY_FLASH} from './sagittarius-flight.mjs';   // THE TWELVE's span, from the law that flies it

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 && args[i + 1] ? args[i + 1] : d; };
const BASE = opt('--url', ''), QUERY = opt('--query', ''), OUT = path.resolve(opt('--out', path.join(os.tmpdir(), 'twelve-dct-proof')));
const [W, H] = opt('--size', '1440x900').split('x').map(Number);
const SECONDS = opt('--seconds', '42.36,42.9,43.1,43.2,43.3,43.4,43.45,43.72,44.3,44.78,45.05,45.3,45.5,45.8,45.98').split(',').map(Number);
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')];
const CHROME = opt('--chrome', CHROMES.find((c) => fs.existsSync(c)));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const FLIGHT = [SKY_FLIGHT_START, SKY_FLASH], CUT = SKY_FLASH;   // frames 1269 to the cut (1362): no glass from the cut on

// the hero's window: the page itself when it holds the film, else the frame that does (lab/hero-ab.html's)
const HERO = `const fr = document.getElementById('dl-twelve-film') ? null : [...document.querySelectorAll('iframe')].find((x) => { try { return Boolean(x.contentDocument?.getElementById('dl-twelve-film')); } catch { return false; } }) ?? null;
  const w = fr ? fr.contentWindow : window, d = w.document, film = d.getElementById('dl-twelve-film');`;
const READY = `(() => { ${HERO} const h = w.hero; return JSON.stringify({up: Boolean(h?.theater && h?.unbox && film && film.readyState >= 2), rs: film?.readyState ?? null, t: film?.currentTime ?? null}); })()`;
const HOLD = `(() => { ${HERO} document.querySelector('.ab')?.style.setProperty('visibility', 'hidden');
  const m = d.getElementById('motion'); if (m && m.getAttribute('aria-pressed') !== 'true') m.click();
  const stage = d.getElementById('sphere-stage').getBoundingClientRect(); w.scrollBy(0, Math.round(stage.top + stage.height / 2 - w.innerHeight / 2));
  return JSON.stringify({held: m?.getAttribute('aria-pressed') === 'true', paused: film.paused}); })()`;
const SEEK = (t) => `(async () => { ${HERO} film.pause(); if (Math.abs(film.currentTime - ${t}) > 1e-4) { film.currentTime = ${t}; await new Promise((r) => film.addEventListener('seeked', r, {once: true})); }
  for (let i = 0; i < 90; i++) { await new Promise((r) => w.requestAnimationFrame(r)); const l = w.hero.state().last; if (l && Math.abs(l.t - film.currentTime) < 1e-3 && i > 3) break; }
  const l = w.hero.state().last, f = l?.flight, th = d.getElementById('hero-theater');
  return JSON.stringify({t: film.currentTime, paused: film.paused, drawn: l?.t ?? null, theater: th ? (th.hidden ? 'hidden' : 'shown') : null, flight: f ? {phase: f.phase, anchor: f.anchor ?? null, light: f.light ?? null, center: f.center, hole: f.hole,
    hits: f.hits, r: f.r, faces: f.faces} : null}); })()`;

async function main() {
  if (!BASE || !CHROME) { console.error('usage: twelve-dct.proof.mjs --url <the served lab hero> --out <dir> [--query twelve=centre]'); return 2; }
  const page = new URL(BASE); if (QUERY) for (const [k, v] of new URLSearchParams(QUERY)) page.searchParams.set(k, v);
  const url = page.href, origin = page.origin, centre = page.searchParams.get('twelve') === 'centre';
  fs.mkdirSync(path.join(OUT, 'at'), {recursive: true});
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'twelve-dct-proof-'));
  const child = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, `--window-size=${W},${H}`, '--hide-scrollbars',
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions',
    '--disable-default-apps', '--disable-features=Translate,MediaRouter,OptimizationHints', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows', '--force-color-profile=srgb', 'about:blank'], {stdio: 'ignore'});
  let ws = null;
  const end = async () => {
    try { ws?.close(); } catch {}
    try { child.kill('SIGTERM'); } catch {}
    for (let i = 0; i < 30 && child.exitCode === null && child.signalCode === null; i++) await sleep(100);
    if (child.exitCode === null && child.signalCode === null) { try { child.kill('SIGKILL'); } catch {} await sleep(200); }
    try { fs.rmSync(dir, {recursive: true, force: true}); } catch {}
  };
  const bound = setTimeout(() => { console.error('170 s passed: ended'); end().then(() => process.exit(2)); }, 170000);
  const onSig = () => end().then(() => process.exit(2)); process.on('SIGTERM', onSig); process.on('SIGINT', onSig);
  const out = {url, when: new Date().toISOString(), chrome: CHROME, size: [W, H], seconds: [], checks: {}};
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
    let ready = null;
    for (let i = 0; i < 600 && !ready?.up; i++) { await sleep(150); try { ready = await read(READY); } catch { ready = null; } }
    if (!ready?.up) throw new Error(`the hero did not come up in 90 s: ${JSON.stringify(ready)}`);
    out.hold = await read(HOLD);
    await sleep(400);
    for (const sec of SECONDS) {
      const at = await read(SEEK(sec));
      const shot = await send('Page.captureScreenshot', {format: 'jpeg', quality: 86}, s), file = `at/${sec.toFixed(3)}.jpg`;
      fs.writeFileSync(path.join(OUT, file), Buffer.from(shot.data, 'base64'));
      out.seconds.push({second: sec, file, ...at});
    }
    const flying = out.seconds.filter((x) => x.second >= FLIGHT[0] && x.second < FLIGHT[1]);
    const c = out.checks;
    c['every second of THE TWELVE drew the twelve, held'] = flying.length > 0 && flying.every((x) => x.paused && x.flight && x.flight.faces?.length === 12 && Math.abs(x.drawn - x.t) < 1e-3);
    // his 22:2x: from the cut to the sky until the anime's beam rises (43.06 s) no face is in the picture
    const offCanvas = (f) => f[0] < -f[2] || f[0] > 1 + f[2] || f[1] < -f[2] || f[1] > 1 + f[2];
    c['no face in the sky before the beam rises'] = flying.filter((x) => x.second < 43.05).every((x) => x.flight.faces.every(offCanvas));
    const holed = flying.filter((x) => x.flight?.hole > 0 && (x.flight.phase === 'gather' || x.flight.phase === 'glory'));
    if (centre) c['the anchor centre: the hole at the middle'] = holed.every((x) => Math.hypot(x.flight.center[0] - .5, x.flight.center[1] - .5) < .01);
    else c['the hole on the anime\'s light in the gathering and the glory'] = holed.length > 0 && holed.every((x) => x.flight.light && Math.hypot(x.flight.center[0] - x.flight.light[0], x.flight.center[1] - x.flight.light[1]) < .01);
    // THE ANIME NEVER STOPS: from the cut the theater rests (its canvas hidden), or what it draws for that second holds no face and no hole
    const after = out.seconds.filter((x) => x.second > CUT + .02);
    c['from the cut no glass and no hole, held: the anime alone'] = after.length > 0 && after.every((x) => x.paused && (x.theater === 'hidden'
      || (Math.abs(x.drawn - x.t) < 1e-3 && !(x.flight?.faces?.length > 0) && !(x.flight?.hole > 0))));
    c['no error in the page'] = errors.length === 0;
    Object.assign(out, {errors: errors.slice(0, 5), refused: [...refused], pass: Object.values(c).every(Boolean)});
  } catch (e) { out.error = String(e?.message || e); }
  clearTimeout(bound); await end();
  fs.writeFileSync(path.join(OUT, 'twelve.json'), JSON.stringify(out, null, 1));
  if (out.error) { console.log(`could not run: ${out.error}`); return 2; }
  for (const [what, ok] of Object.entries(out.checks)) console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`);
  console.log(`${out.seconds.length} pictures in ${path.join(OUT, 'at')}; ${out.pass ? 'PASS' : 'FAIL'}`);
  return out.pass ? 0 : 1;
}
if (process.argv[1] && fs.realpathSync(process.argv[1]) === new URL(import.meta.url).pathname) main().then((code) => process.exit(code));

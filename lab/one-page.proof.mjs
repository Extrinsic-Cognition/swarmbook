#!/usr/bin/env node
// one-page.proof.mjs: ONE PAGE (lab/hero-mount.js), proved in a real browser. His words, Oct 15 2026 WEST: 01:3x "ON MY PAGE RIGHT NOW THERE IS
// FUCKING NOTHING ABOUT THE SHIT I SPENT SO MUCH FUCKING TIME ON DUDE"; 00:1x "add all i asked to the version you show me"; earlier "I WANT TO
// ALWAYS DO QA ON A SINGLE COMULATED VERSION DUDE". The page he opens and publishes (app/warm.html) mounts the hero itself, once; the lab's
// lab/hero-ab.html is a panel over that same mount and mounts nothing.
//   nice -n 19 node lab/one-page.proof.mjs --url <page> [--rest-at 16] [--rest-ms 5000] [--wall on|off] [--mounts 1|0|any] [--out <file.json>]
// One muted headless Chrome over CDP, off every screen, requests only to the page's own origin (the rest refused and listed: no Nest, no chain).
// It reads, on the page as served:
//   the hero's document: the page's own, or the frame's that holds #sphere-stage (lab/hero-ab.html's iframe)
//   the stage: its canvases (each by its id, or its parent's) and the hero's layers (#hero-*), each counted: none may stand twice
//   the mount: the handle in the hero's document (window.hero, hero-mount.js mountHero: .mounts); on a page that frames it, the scripts that page
//   fetched itself (none of the hero's: it mounts nothing)
//   AT REST under the page's own Pause, --rest-at seconds into the film and the box made: for --rest-ms, every animation frame, video-frame
//   callback, timeout, interval, 2D and WebGL draw that runs in any frame of the page, with the script that asked for it
//   AT THE WALL (a visitor; --wall off skips it): the film held on its frame and the page's own Pause pressed, the same count. THE MINT WINDOW
//   (his Oct 21 2026 WEST "it cant stop this abrutly dude"; app/warm-sphere.js): held on the stop the wall keeps its frames while it shows (his glow
//   burns on, the liquor falls) unless the page's own pause or reduced motion says still, so its rest is read under the page's own Pause
//   the page's errors (uncaught), its console errors, every response of 400 and over, every request refused
// PASS, all of: no page error; no file of the page answered 400 or over (the Worker's /api/ and the browser's /favicon.ico listed apart); no
// layer twice; the mounts as --mounts says; a framing page fetched no script; nothing at rest (all counts 0) under the Pause and at the wall.
// THE WALL WHERE THE PAGE PUTS IT (Nov 2 2026): sought a second and a half before the page's own wall (dl-paywall.js state().stop), THE FREEZE ON THE DRAWN
// ARROW since 991328213 (Oct 22 2026, frame 3616, his "on the moment of the arrow fully drawn we will "freeze" the page until the mint has happened"),
// where it stood at frame 1111 when this proof was born. THE NEST REFUSED HERE: on a local host the page follows his eye's head on the Nest (THE FILM IN
// DEPTH, app/dl-depth.js, 63878c14d, Oct 18 2026); this proof lets nothing leave the page's origin, so the page's Nest wire (room/nest-wire.mjs) retries a
// door his own page finds open: those reconnect timers are the refusal's, counted apart (wire) and listed, never the page's rest.
// Exit 0 on PASS, 1 on FAIL, 2 when it could not run. It ends the Chrome it started (by pid) and its profile folder, and gives itself 180 s.
// Serve the page with tools/serve-range (it answers Range with 206), never python's http.server (~/AGENTS.md), and never open it on his door
// (8921): aiolos's lock answers a fresh browser with a page that asks Touch ID by itself (app/dl-twelve.proof.mjs, NEVER AT HIS DOOR). Nothing
// under /lock/ leaves this Chrome, and a page answered by the lock ends the proof at once (exit 2).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : fallback; };
const URL_ = opt('--url', 'http://127.0.0.1:8921/intro/dyson-society/app/warm.html'), REST_AT = Number(opt('--rest-at', '16')), REST_MS = Number(opt('--rest-ms', '5000'));
const WALL = opt('--wall', 'on') !== 'off', MOUNTS = opt('--mounts', 'any'), OUT = opt('--out', null);
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', '/Applications/Chromium.app/Contents/MacOS/Chromium'];
const CHROME = opt('--chrome', CHROMES.find((c) => fs.existsSync(c)));
const W = 1280, H = 1300;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// THE INSTRUMENT, in every frame before the page's own scripts: each animation frame, video frame, timer and draw that runs, and where it was
// asked (the first script frame of the stack that asked)
const INSTRUMENT = `(() => {
  if (window.__op) return;
  const P = window.__op = {raf: 0, rvfc: 0, timeouts: 0, intervals: 0, draws2d: 0, drawsGL: 0, src: {}};
  const where = () => { const line = (new Error().stack || '').split('\\n').slice(2).find((l) => /\\.m?js|\\.html/.test(l) && !/__op/.test(l)) || '';
    return line.replace(/^\\s*at\\s+/, '').replace(/\\?v=[^:)]+/, '').replace(/https?:\\/\\/[^/]+\\/intro\\/dyson-society\\//, '').replace(/https?:\\/\\/[^/]+\\//, '').slice(0, 96); };
  const tally = (k, w) => { P.src[k + ' ' + w] = (P.src[k + ' ' + w] || 0) + 1; };
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => { const w = where(); return raf((t) => { P.raf++; tally('raf', w); cb(t); }); };
  const st = window.setTimeout.bind(window), si = window.setInterval.bind(window);
  window.setTimeout = (cb, ms, ...a) => { const w = where(); return st(typeof cb === 'function' ? (...x) => { P.timeouts++; tally('timeout', w); cb(...x); } : cb, ms, ...a); };
  window.setInterval = (cb, ms, ...a) => { const w = where(); return si(typeof cb === 'function' ? (...x) => { P.intervals++; tally('interval', w); cb(...x); } : cb, ms, ...a); };
  const rv = HTMLVideoElement.prototype.requestVideoFrameCallback;
  if (rv) HTMLVideoElement.prototype.requestVideoFrameCallback = function (cb) { const w = where(); return rv.call(this, (now, m) => { P.rvfc++; tally('rvfc', w); cb(now, m); }); };
  const c2 = CanvasRenderingContext2D.prototype, di = c2.drawImage, fr = c2.fillRect;
  c2.drawImage = function (...a) { P.draws2d++; return di.apply(this, a); };
  c2.fillRect = function (...a) { P.draws2d++; return fr.apply(this, a); };
  for (const G of [window.WebGLRenderingContext, window.WebGL2RenderingContext].filter(Boolean)) for (const k of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
    const f = G.prototype[k]; if (f) G.prototype[k] = function (...a) { P.drawsGL++; return f.apply(this, a); };
  }
})();`;

// the page's helpers, from the top document: the hero's window is the page itself, or the frame that holds the stage
const HELPER = `window.__one = (() => {
  const heroWin = () => {
    if (document.getElementById('sphere-stage')) return window;
    for (const f of document.querySelectorAll('iframe')) { try { if (f.contentDocument?.getElementById('sphere-stage')) return f.contentWindow; } catch {} }
    return null;
  };
  const wins = () => { const out = [window]; for (const f of document.querySelectorAll('iframe')) { try { if (f.contentWindow.__op) out.push(f.contentWindow); } catch {} } return out; };
  const film = () => heroWin()?.document.getElementById('dl-twelve-film') ?? null;
  const handle = () => { try { return heroWin()?.hero ?? null; } catch { return null; } };
  return {
    film() { const f = film(); return f ? {t: f.currentTime, ready: f.readyState, paused: f.paused} : null; },
    own() { return heroWin() === window; },
    boxMade() { const h = handle() ?? window.hero; return Boolean(h?.unbox); },
    paywall() { return heroWin()?.dlTwelve?.state?.().paywall?.state ?? null; },
    wallStop() { const s = heroWin()?.dlTwelve?.state?.().paywall?.stop; return Number.isFinite(s) ? s : null; },
    stage() {
      const w = heroWin(), d = w?.document, stage = d?.getElementById('sphere-stage');
      if (!stage) return null;
      const canvases = [...stage.querySelectorAll('canvas')].map((c) => c.id || (c.parentElement?.id ? c.parentElement.id + ' >' : '(none)'));
      const layers = [...d.querySelectorAll('[id^="hero-"]')].map((e) => e.id);
      const twice = [...new Set(layers.filter((id, i) => layers.indexOf(id) !== i))];
      const h = handle();
      return {own: w === window, canvases, count: canvases.length, children: [...stage.children].map((c) => c.id || c.tagName.toLowerCase()), layers, twice,
        handle: h ? {mounts: h.mounts ?? null, frozen: Object.isFrozen(h), keys: Object.keys(h)} : null,
        // the lab's own document (a page that frames the hero): the scripts it fetched itself; it mounts nothing, so none of the hero's
        top: w === window ? null : {hero: Boolean(window.hero), scripts: performance.getEntriesByType('resource').map((e) => e.name).filter((n) => /\\.m?js(\\?|$)/.test(n)).map((n) => n.replace(location.origin, ''))},
        bubble: Boolean(d.querySelector('.ds-invite'))};
    },
    pause() { const b = heroWin().document.querySelector('[data-twelve-pause]'); if (b.getAttribute('aria-pressed') !== 'true') b.click(); return b.getAttribute('aria-pressed'); },
    play() { const b = heroWin().document.querySelector('[data-twelve-pause]'); if (b.getAttribute('aria-pressed') === 'true') b.click(); return b.getAttribute('aria-pressed'); },
    seek(t) { film().currentTime = t; return true; },
    counts() {
      const sum = {raf: 0, rvfc: 0, timeouts: 0, intervals: 0, draws2d: 0, drawsGL: 0}, src = {};
      for (const w of wins()) { const P = w.__op; if (!P) continue; for (const k of Object.keys(sum)) sum[k] += P[k]; for (const [k, v] of Object.entries(P.src)) src[k] = (src[k] || 0) + v; }
      return {at: performance.now(), sum, src};
    },
    running() {
      const out = [];
      for (const w of wins()) for (const a of w.document.getAnimations()) if (a.playState === 'running') out.push((a.animationName || a.id || 'animation') + ' on ' + (a.effect?.target?.id || a.effect?.target?.className || a.effect?.target?.tagName || '?'));
      return out;
    },
  };
})();`;

async function main() {
  if (!CHROME) { console.error('no Chrome on this Mac'); return 2; }
  const origin = new URL(URL_).origin;
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'one-page-proof-'));
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
  const bound = setTimeout(() => { console.error('180 s passed: ended'); end().then(() => process.exit(2)); }, 180000);
  const onSig = () => end().then(() => process.exit(2)); process.on('SIGTERM', onSig); process.on('SIGINT', onSig);
  const out = {url: URL_, restAt: REST_AT, restMs: REST_MS, chrome: CHROME, when: new Date().toISOString()};
  try {
    let port = null;
    for (let i = 0; i < 400 && !port; i++) { await sleep(150); if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`); try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {} }
    if (!port) throw new Error('Chrome did not open its debugging port');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json());
    ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0; const wait = new Map(), errors = [], consoleErrors = [], bad = [], api = [], favicon = [], refused = new Set(); let atDoor = false;
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    ws.onmessage = (m) => {
      const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const url = x.params.request.url, door = url.startsWith(origin + '/lock/');   // his door's lock: never asked
        const ok = !door && (url.startsWith(origin + '/') || url.startsWith('data:') || url.startsWith('blob:'));
        if (door) atDoor = true;
        if (ok) send('Fetch.continueRequest', {requestId: x.params.requestId}, x.sessionId).catch(() => {});
        else { refused.add(url.slice(0, 120)); send('Fetch.failRequest', {requestId: x.params.requestId, errorReason: 'BlockedByClient'}, x.sessionId).catch(() => {}); }
        return;
      }
      // a file the page asks for and does not get; the Worker's /api/ (optimism.fit's, not a file) and the browser's own /favicon.ico apart
      if (x.method === 'Network.responseReceived' && x.params.response.status >= 400) {
        const at = x.params.response.url.replace(origin, ''), line = `${x.params.response.status} ${at}`;
        (/^\/api\//.test(at) ? api : at === '/favicon.ico' ? favicon : bad).push(line);
      }
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 300));
      if (x.method === 'Runtime.consoleAPICalled' && x.params.type === 'error') consoleErrors.push(x.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 200));
    };
    const t = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: W, height: H});
    const s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable', 'Network.enable']) await send(m, {}, s);
    await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: 1, mobile: false}, s);
    await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s); await send('Page.bringToFront', {}, s).catch(() => {});
    await send('Page.addScriptToEvaluateOnNewDocument', {source: INSTRUMENT}, s);
    const ev = async (expr) => { const r = await send('Runtime.evaluate', {expression: expr, returnByValue: true, awaitPromise: true}, s); if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text); return r.result?.value; };
    const helper = async () => { if (!(await ev('Boolean(window.__one)'))) await ev(HELPER); };
    const locked = async () => { let at = atDoor; try { at ||= await ev("document.title === 'DysonLight \u00b7 Harmony'"); } catch {} return at; };
    const until = async (expr, ms, step = 100) => {
      const t0 = Date.now();
      while (Date.now() - t0 < ms) {
        if (await locked()) throw new Error(`${origin} answered with the house's lock (DysonLight \u00b7 Harmony): its Touch ID was never asked; prove on a tree served by tools/serve-range`);
        try { await helper(); if (await ev(expr)) return true; } catch {}
        await sleep(step);
      }
      return false;
    };
    const windowed = async (ms) => {
      const a = await ev('window.__one.counts()');
      await sleep(ms);
      const b = await ev('window.__one.counts()');
      const counts = Object.fromEntries(Object.keys(a.sum).map((k) => [k, b.sum[k] - a.sum[k]]));
      const sources = Object.fromEntries(Object.entries(b.src).map(([k, v]) => [k, v - (a.src[k] || 0)]).filter(([, v]) => v > 0));
      // THE NEST REFUSED HERE (the header): the page's Nest wire's reconnect timers, while this proof refused the Nest, counted apart
      const nestRefused = [...refused].some((u) => /\/nest\//.test(u));
      const wire = nestRefused ? Object.entries(sources).filter(([k]) => /^timeout .*\((?:.*\/)?room\/nest-wire\.mjs:\d+/.test(k)).reduce((n, [, v]) => n + v, 0) : 0;
      counts.timeouts -= wire;
      return {ms: Math.round(b.at - a.at), counts, wire, sources, running: await ev('window.__one.running()')};
    };
    const nav = await send('Page.navigate', {url: URL_}, s); if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    const t0 = Date.now();
    if (!(await until(`(() => { const f = window.__one.film(); return Boolean(f && f.ready >= 2 && f.t >= ${REST_AT}); })()`, 90000))) throw new Error(`the film did not play past ${REST_AT} s within 90 s: ${JSON.stringify(await ev('window.__one?.film()'))}`);
    out.playedMs = Date.now() - t0;
    out.boxMade = await until('window.__one.boxMade()', 20000);
    out.stage = await ev('window.__one.stage()');
    // AT REST: the page's own Pause; a second and a half for the last frame asked before it to come and go, then the count
    out.pausedAt = (await ev('window.__one.film()')).t;
    await ev('window.__one.pause()'); await sleep(1500);
    out.rest = await windowed(REST_MS);
    if (WALL) {
      // AT THE WALL: played again, sought a second and a half before the page's own wall (the header), held on its frame (a visitor's page)
      out.wallStop = await ev('window.__one.wallStop()');
      await ev('window.__one.play()'); await sleep(300); await ev(`window.__one.seek(${Math.max(0, (out.wallStop ?? 37) - 1.5)})`);
      out.held = await until('window.__one.paywall() === "held" && window.__one.film().paused', 30000);
      out.heldAt = (await ev('window.__one.film()'))?.t ?? null;
      out.wallPaused = await ev('window.__one.pause()');   // THE MINT WINDOW (the header): the wall's rest is the one under the page's own Pause
      await sleep(1500);
      out.wall = await windowed(REST_MS);
      out.stageAtWall = await ev('window.__one.stage()');
    }
    const zero = (w) => Boolean(w) && Object.values(w.counts).every((v) => v === 0);
    const st = out.stage;
    const checks = {
      'no page error': errors.length === 0,
      'no file of the page answered 400 or over (the Worker\'s /api/ and the browser\'s favicon apart)': bad.length === 0,
      'the hero\'s stage is there': Boolean(st),
      'no layer twice': Boolean(st) && st.twice.length === 0 && (!out.stageAtWall || out.stageAtWall.twice.length === 0),
      ...(MOUNTS === 'any' ? {} : {[`mounted ${MOUNTS} time(s) by the page itself (window.hero.mounts in the hero's document)`]: (st?.handle?.mounts ?? 0) === Number(MOUNTS)}),
      ...(!st || st.own ? {} : {'the frame\'s parent loads no script of the hero (it mounts nothing)': (st.top?.scripts ?? []).length === 0}),
      [`nothing at rest under the page's Pause (${REST_MS} ms)`]: zero(out.rest),
      ...(WALL ? {[`nothing at rest at the wall (${REST_MS} ms)`]: out.held && zero(out.wall)} : {}),
    };
    Object.assign(out, {checks, errors: errors.slice(0, 8), consoleErrors: consoleErrors.slice(0, 8), bad: bad.slice(0, 20), api: [...new Set(api)], favicon: favicon.length, refused: [...refused].slice(0, 20), pass: Object.values(checks).every(Boolean)});
  } catch (e) { out.error = String(e?.message || e); }
  clearTimeout(bound); await end();
  const text = JSON.stringify(out, null, 1);
  if (OUT) fs.writeFileSync(OUT, text);
  console.log(text);
  if (out.error) { console.log(`COULD NOT RUN: ${out.error}`); return 2; }
  for (const [what, ok] of Object.entries(out.checks)) console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`);
  console.log(`canvases in #sphere-stage (${out.stage?.own ? 'the page\'s own document' : 'the frame\'s'}): ${out.stage?.count} [${out.stage?.canvases.join(', ')}]`);
  console.log(`at rest: ${JSON.stringify(out.rest?.counts)}${out.wall ? `; at the wall (${out.heldAt?.toFixed?.(3)} s): ${JSON.stringify(out.wall.counts)}` : ''}; the refused Nest's retries apart: ${out.rest?.wire ?? 0}${out.wall ? ` and ${out.wall.wire}` : ''}`);
  console.log(out.pass ? 'PASS' : 'FAIL');
  return out.pass ? 0 : 1;
}
main().then((code) => process.exit(code));

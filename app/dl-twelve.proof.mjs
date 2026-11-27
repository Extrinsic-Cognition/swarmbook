#!/usr/bin/env node
// dl-twelve.proof.mjs: THE SOUND NEVER RESTARTS THE PICTURE, proved in a real browser (dl-twelve-clock.js; his words, Oct 14 2026 22:0x WEST:
// "there's been 10 times i said playing audio would cause replay from the start; every time you fixed that ... i tell you to fix, you tell me
// you fix, you break again"). A muted headless Chrome, off every screen, opens the served hero, lets the film play past --at seconds, then
// presses the page's sound control with a real input event (CDP Input.dispatchMouseEvent: a trusted gesture, as his finger is; the autoplay
// policy is Chrome's own, so the song starts only because of it), and reads the film's and the song's seconds every 100 ms for 4 s.
//   nice -n 19 node app/dl-twelve.proof.mjs [--url http://127.0.0.1:8921/intro/dyson-society/lab/hero-ab.html] [--at 6] [--tap button|sphere|invite] [--screenshot /tmp/invite.png]
//     [--chrome <path>]
// The Chrome: --chrome, else $CHROME, else the first of Google Chrome, Google Chrome for Testing and Chromium in /Applications, else the newest
// Playwright Chrome for Testing in this user's cache: the new Mac, where the lander's gate runs this proof for rule 8, has only that one, and
// with the three alone the proof said "no Chrome on this Mac" there and exited 2 (THE PROOF FINDS ITS CHROME, Oct 21 2026).
// The page is the mint itself (app/warm.html, the film in its own document) or a page that frames it (lab/hero-ab.html): the film is found in either.
// PASS, all of: the sound is on and heard; the film never reads below the second it showed at the tap; no seek of the film backward by more
// than a second; the film played on (3 s or more in the 4 s); the song within 0.15 s of the picture at the end; and both media report a
// seekable range past the tap (a server without Range, python's http.server, reports [0, 0] and fails here, by its name). Exit 0 on PASS, 1 on
// FAIL, 2 when it could not run. Requests leave only to the page's own origin (Fetch interception), nothing else goes out. It ends everything
// it started (the Chrome by pid, its profile folder) and gives itself 120 s.
// NEVER AT HIS DOOR (Oct 15 2026): aiolos's lock (HARMONY_LOCK_HOURS, DysonLight · Harmony) answers a fresh browser's page with a page that
// asks Touch ID by itself on load (POST /lock/touchid), so every run of this proof on 8921 put the Touch ID panel on his screen (aiolos's log,
// "lock: opened by Touch ID", at 02:11:27, 02:11:45 and 02:17:24 WEST, each a run of this proof). Nothing under /lock/ ever leaves this
// Chrome now, and a page answered by the lock ends the proof at once (exit 2): prove on the same tree served by tools/serve-range instead.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); return i >= 0 && args[i + 1] ? args[i + 1] : fallback; };
const URL_ = opt('--url', 'http://127.0.0.1:8921/intro/dyson-society/lab/hero-ab.html'), AT = Number(opt('--at', '6')), TAP = opt('--tap', 'button');
const PLAYWRIGHT = path.join(os.homedir(), 'Library/Caches/ms-playwright');
/** the Playwright Chromes for Testing in this user's cache, newest build first (chromium-<build>; the headless shells are not Chrome) */
function playwrightChromes(root = PLAYWRIGHT) {
  let builds = [];
  try { builds = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)); } catch { return []; }
  return builds.sort((a, b) => Number(b.slice(9)) - Number(a.slice(9))).flatMap((d) => ['chrome-mac-arm64', 'chrome-mac']
    .map((sub) => path.join(root, d, sub, 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')));
}
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing', '/Applications/Chromium.app/Contents/MacOS/Chromium', ...playwrightChromes()];
const CHROME = opt('--chrome', process.env.CHROME || CHROMES.find(c => fs.existsSync(c)));
const W = Number(opt('--width', '1280')), H = Number(opt('--height', '1300'));   // defaults keep the sound button on screen
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

// the hero's window: the page itself when it holds the film (app/warm.html), else the frame that does (lab/hero-ab.html's); f the frame or null
const HERO = `const f = document.getElementById('dl-twelve-film') ? null : [...document.querySelectorAll('iframe')].find((x) => { try { return Boolean(x.contentDocument?.getElementById('dl-twelve-film')); } catch { return false; } }) ?? null;
  const w = f ? f.contentWindow : window, d = w.document;`;
// in the page: the hero's window, its film and song, and a log of every seek made from now on
const ARM = `(() => {
  ${HERO}
  const film = d?.getElementById('dl-twelve-film'), song = d?.getElementById('dl-twelve-song');
  if (!film || !song || film.readyState < 2) return JSON.stringify({ready: false, t: film ? film.currentTime : null});
  if (!w.__seeks) { const P = w.HTMLMediaElement.prototype, desc = Object.getOwnPropertyDescriptor(P, 'currentTime'); w.__seeks = [];
    Object.defineProperty(P, 'currentTime', {configurable: true, get: desc.get, set(v) {
      w.__seeks.push({id: this.id, from: +desc.get.call(this).toFixed(3), to: +(+v).toFixed(3)}); desc.set.call(this, v); }}); }
  const fr = f ? f.getBoundingClientRect() : {left: 0, top: 0}, target = ${JSON.stringify(TAP)} === 'sphere' ? d.getElementById('genesis-sphere') : d.querySelector(${JSON.stringify(TAP === 'invite' ? '.ds-invite' : '[data-twelve-sound]')});
  if (!target) return JSON.stringify({ready: false, t: film.currentTime, missing: ${JSON.stringify(TAP)}});
  let r = target.getBoundingClientRect(); const reach = (m) => m.seekable.length ? m.seekable.end(m.seekable.length - 1) : 0;
  if (fr.top + r.top + r.height / 2 > innerHeight - 4 || fr.top + r.top < 0) { target.scrollIntoView({block: 'nearest', behavior: 'instant'}); r = target.getBoundingClientRect(); }
  const style = w.getComputedStyle(target), hit = d.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
  const visible = r.width > 0 && r.height > 0 && style.visibility === 'visible' && Number(style.opacity) > .95;
  const hitsTarget = hit === target || target.contains(hit);
  const controls = d.querySelector('.dl-twelve-controls')?.getBoundingClientRect();
  const overlapsControls = controls && r.left < controls.right && r.right > controls.left && r.top < controls.bottom && r.bottom > controls.top;
  return JSON.stringify({ready: true, t: film.currentTime, paused: film.paused, hidden: document.hidden, x: fr.left + r.left + r.width / 2, y: fr.top + r.top + r.height / 2,
    visible, hitsTarget, overlapsControls, background: style.backgroundImage,
    filmReach: reach(film), songReach: reach(song), soundOn: w.dlTwelve?.state?.().soundOn});
})()`;
const READ = `(() => { ${HERO}
  return JSON.stringify([d.getElementById('dl-twelve-film').currentTime, d.getElementById('dl-twelve-song').currentTime]); })()`;
const STATE = `(() => { ${HERO} const s = w.dlTwelve.state();
  return JSON.stringify({soundOn: s.soundOn, hearing: s.hearing, invitation: Boolean(d.querySelector('.ds-invite')), seeks: s.seeks, held: s.held ?? null, nudges: s.nudges, drift: s.drift, song: s.song, film: s.film, log: w.__seeks}); })()`;

async function main() {
  if (!CHROME) { console.error('no Chrome on this Mac'); return 2; }
  const origin = new URL(URL_).origin;
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'dl-twelve-proof-'));
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
  const bound = setTimeout(() => { console.error('120 s passed: ended'); end().then(() => process.exit(2)); }, 120000);
  const onSig = () => end().then(() => process.exit(2)); process.on('SIGTERM', onSig); process.on('SIGINT', onSig);
  const out = {url: URL_, tap: TAP, at: AT, chrome: CHROME, when: new Date().toISOString()};
  try {
    let port = null;
    for (let i = 0; i < 400 && !port; i++) { await sleep(150); if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`); try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {} }
    if (!port) throw new Error('Chrome did not open its debugging port');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then(r => r.json());
    ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0; const wait = new Map(), events = [], errors = [], refused = new Set(); let atDoor = false;
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    ws.onmessage = m => {
      const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const url = x.params.request.url, door = url.startsWith(origin + '/lock/');   // his door: never asked (NEVER AT HIS DOOR above)
        const ok = !door && (url.startsWith(origin + '/') || url.startsWith('data:') || url.startsWith('blob:'));
        if (door) atDoor = true;
        if (ok) send('Fetch.continueRequest', {requestId: x.params.requestId}, x.sessionId).catch(() => {});
        else { refused.add(new URL(url).origin); send('Fetch.failRequest', {requestId: x.params.requestId, errorReason: 'BlockedByClient'}, x.sessionId).catch(() => {}); }
        return;
      }
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 200));
      events.push(x.method);
    };
    const t = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: W, height: H});
    const s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable']) await send(m, {}, s);
    await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: 1, mobile: false}, s);
    await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s); await send('Page.bringToFront', {}, s).catch(() => {});
    const read = async (expr) => JSON.parse((await send('Runtime.evaluate', {expression: expr, returnByValue: true}, s)).result?.value ?? 'null');
    const nav = await send('Page.navigate', {url: URL_}, s); if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    let armed = null;
    for (let i = 0; i < 600; i++) { await sleep(100);
      let locked = atDoor; try { locked ||= await read(`JSON.stringify(document.title === 'DysonLight \u00b7 Harmony')`); } catch {}
      if (locked) throw new Error(`${origin} answered with the house's lock (DysonLight \u00b7 Harmony): its Touch ID was never asked; prove on the same tree served by tools/serve-range`);
      try { armed = await read(ARM); } catch { armed = null; } if (armed?.ready && armed.t >= AT && !armed.paused) break; }
    if (!armed?.ready || armed.t < AT) throw new Error(`the film did not play past ${AT} s within 60 s (it read ${armed?.t})`);
    if (!(armed.x > 0 && armed.x < W && armed.y > 0 && armed.y < H)) throw new Error(`the ${TAP} is off screen at (${armed.x}, ${armed.y}): a tap there would hit nothing`);
    if (TAP === 'invite' && (!armed.visible || !armed.hitsTarget || armed.overlapsControls || armed.background === 'none')) {
      throw new Error(`the invitation must be visible, styled, directly clickable and clear of transport controls: ${JSON.stringify(armed)}`);
    }
    out.before = armed;
    const screenshot = opt('--screenshot', null);
    if (screenshot) {
      const shot = await send('Page.captureScreenshot', {format: 'png'}, s);
      fs.writeFileSync(screenshot, Buffer.from(shot.data, 'base64'));
    }
    // the tap: a trusted press and release where his finger would be
    const tapAt = (await read(READ))[0];
    for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', {type, x: armed.x, y: armed.y, button: type === 'mouseMoved' ? 'none' : 'left', clickCount: 1}, s);
    const samples = [];
    for (let i = 0; i < 40; i++) { await sleep(100); samples.push(await read(READ)); }
    const st = await read(STATE);
    const films = samples.map(x => x[0]), last = samples.at(-1);
    const backward = (st.log || []).filter(e => e.id === 'dl-twelve-film' && e.to < e.from - 1);
    const checks = {
      'the sound is on and heard': st.soundOn === true && st.hearing === true,
      [`the film never below its second at the tap (${tapAt.toFixed(2)} s)`]: Math.min(...films) >= tapAt - 0.05,
      'no seek of the film back by more than a second': backward.length === 0,
      'the film played on (3 s or more in 4 s)': films.at(-1) - tapAt >= 3,
      'the song within 0.15 s of the picture at the end': Math.abs(last[1] - last[0]) <= 0.15,
      'both media can be sought past the tap (a server that answers Range)': armed.filmReach > tapAt && armed.songReach > tapAt,
      'the invitation disappears once sound is enabled': st.invitation === false,
    };
    Object.assign(out, {tapAt, samples: samples.filter((_, i) => i % 4 === 3), state: st, checks, errors: errors.slice(0, 5), refused: [...refused], pass: Object.values(checks).every(Boolean)});
  } catch (e) { out.error = String(e?.message || e); }
  clearTimeout(bound); await end();
  console.log(JSON.stringify(out, null, 1));
  if (out.error) return 2;
  for (const [what, ok] of Object.entries(out.checks)) console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`);
  console.log(out.pass ? 'PASS: the sound came in where the picture was, and the picture never went back' : 'FAIL');
  return out.pass ? 0 : 1;
}
main().then(code => process.exit(code));

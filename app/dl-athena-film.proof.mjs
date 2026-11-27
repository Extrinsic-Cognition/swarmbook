#!/usr/bin/env node
// dl-athena-film.proof.mjs: ATHENA BRINGS THE GOVERNANCE FILM, proved in a real browser (dl-athena-film.js; his Oct 29 2026 16:40 and 16:41 UTC words: "athena brings
// the attention to the other mint video about governance"; "you will bring up the new video and let the user independent"). A muted headless Chrome, off every
// screen, opens the mint's page (app/warm.html) as a visitor meets it, and with real presses (CDP Input.dispatchMouseEvent: trusted input, as his hand is):
//   1. the film plays; SKIP TO THE MINT is pressed; she comes, makes her entrance and lands (her own events, read off the page);
//   2. THE ROAD IS ONE TAKE (his Oct 30 2026 08:09:46 UTC "i think it could be smoother", over the card pinned on the creator's corner): on her landing, her entrance played out (THE LYSSAJUDRON ENTERS, Nov 11 2026),
//      "Give me my colours." is the whole screen and nothing sits on it, its line, its field and its door each taking a press; the card waits for her to be
//      made, comes with the rebate, unseen under it; ON TRACK (Oct 30 2026 15:57 UTC): a first visit's rebate has no × until WATCH THE FILM is pressed, so the proof goes down to his film and back up as a visitor does; the card stands once the rebate is closed by its ×, taking a press where it stands;
//   3. a press on the card opens the film on its stage; it plays, its soundtrack heard and at the picture's second;
//   4. The rule, item 8, on this film: a tap on Sound mutes, a second unmutes; for 4 s after each the picture never reads below its second at the tap, plays on,
//      and is never sought (every write of its time is logged); the soundtrack ends within 0.35 s of the picture; both media can be sought past the tap;
//   5. Pause holds the picture and its sound; × closes the stage back to the card; no page error.
//   nice -n 19 node app/dl-athena-film.proof.mjs [--url http://127.0.0.1:8977/intro/dyson-society/app/warm.html] [--chrome <path>] [--shots <dir>] [--press <css>]   (--press: ANOTHER PAGE'S DOOR TO THE SAME FILM, Nov 11 2026, the Swarmbook page's [data-film]: steps 1 and 2 are the mint page's and are left out; a real press on that door, then 3 to 5 as written)
// The Chrome as dl-twelve.proof.mjs finds it (--chrome, $CHROME, /Applications, else the newest Playwright Chrome for Testing in this user's cache). Requests leave
// only to the page's own origin. Exit 0 on PASS, 1 on FAIL, 2 when it could not run. It ends what it started (the Chrome by pid, its profile folder) and gives
// itself 150 s. Never at his door: a page answered by the house's lock ends it at once (dl-twelve.proof.mjs NEVER AT HIS DOOR).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';

const args = process.argv.slice(2), opt = (n, f) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : f; };
const URL_ = opt('--url', 'http://127.0.0.1:8977/intro/dyson-society/app/warm.html'), SHOTS = opt('--shots', null), PRESS = opt('--press', null);
const W = Number(opt('--width', '1440')), H = Number(opt('--height', '900'));
function chromeOf() {
  const given = opt('--chrome', process.env.CHROME); if (given && fs.existsSync(given)) return given;
  for (const p of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    '/Applications/Chromium.app/Contents/MacOS/Chromium']) if (fs.existsSync(p)) return p;
  const pw = path.join(os.homedir(), 'Library/Caches/ms-playwright');
  const dirs = fs.existsSync(pw) ? fs.readdirSync(pw).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split('-')[1] - +a.split('-')[1]) : [];
  for (const d of dirs) for (const arch of ['chrome-mac-arm64', 'chrome-mac']) { const p = path.join(pw, d, arch, 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'); if (fs.existsSync(p)) return p; }
  return null;
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const out = {url: URL_, when: new Date().toISOString(), checks: [], errors: [], refused: []};
const check = (ok, what, detail) => { out.checks.push({ok: !!ok, what, ...(detail === undefined ? {} : {detail})}); console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`); };

// in the page from its first byte: her moments as they are told, and every write of a medium's time (the governance film's marked)
const RECORD = `(() => { window.__heard = []; document.addEventListener('dl-athena', (e) => window.__heard.push({type: e.detail?.type, t: Math.round(performance.now())}));
  const P = HTMLMediaElement.prototype, d = Object.getOwnPropertyDescriptor(P, 'currentTime'); window.__writes = [];
  Object.defineProperty(P, 'currentTime', {configurable: true, get: d.get, set(v) {
    window.__writes.push({film: !!this.closest?.('.dl-athena-film'), tag: this.tagName, from: +d.get.call(this).toFixed(3), to: +(+v).toFixed(3)}); d.set.call(this, v); }}); })()`;
const box = (sel) => `(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const r = e.getBoundingClientRect(), s = getComputedStyle(e);
  const x = r.left + r.width / 2, y = r.top + r.height / 2, hit = r.width ? document.elementFromPoint(x, y) : null;
  return {x, y, w: r.width, h: r.height, shown: r.width > 0 && r.height > 0 && s.visibility === 'visible' && s.display !== 'none', hits: !!hit && (hit === e || e.contains(hit)), on: hit ? hit.className || hit.tagName : null}; })()`;
// the writes of the governance film's own time (its picture: never) and of its soundtrack's (the sound brought to the picture, the law's one direction)
const FILM = `(() => { const s = window.dlAthenaFilm?.state?.(), w = (window.__writes || []).filter((w) => w.film);
  return s ? {...s, writes: w.filter((x) => x.tag === 'VIDEO'), aligned: w.filter((x) => x.tag === 'AUDIO')} : null; })()`;

async function main() {
  const chrome = chromeOf(); if (!chrome) { out.error = 'no Chrome on this Mac'; return 2; }
  out.chrome = chrome;
  const origin = new URL(URL_).origin, dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'dl-athena-film-proof-'));
  const child = spawn(chrome, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, `--window-size=${W},${H}`, '--hide-scrollbars', '--no-first-run',
    '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', '--disable-default-apps',
    '--disable-features=Translate,MediaRouter,OptimizationHints', '--disable-background-timer-throttling', '--disable-renderer-backgrounding', '--disable-backgrounding-occluded-windows', 'about:blank'], {stdio: 'ignore'});
  let ws = null;
  const end = async () => {
    try { ws?.close(); } catch {}
    try { child.kill('SIGTERM'); } catch {}
    for (let i = 0; i < 30 && child.exitCode === null && child.signalCode === null; i++) await sleep(100);
    if (child.exitCode === null && child.signalCode === null) { try { child.kill('SIGKILL'); } catch {} await sleep(200); }
    try { fs.rmSync(dir, {recursive: true, force: true}); } catch {}
  };
  const bound = setTimeout(() => { out.errors.push('150 s passed: ended'); end().then(() => { console.log(JSON.stringify(out, null, 1)); process.exit(2); }); }, 150000);
  const onSig = () => end().then(() => process.exit(2)); process.on('SIGTERM', onSig); process.on('SIGINT', onSig);
  try {
    let port = null;
    for (let i = 0; i < 400 && !port; i++) { await sleep(150); if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`); try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {} }
    if (!port) throw new Error('Chrome did not open its debugging port');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json());
    ws = new WebSocket(ver.webSocketDebuggerUrl); await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0, atDoor = false; const wait = new Map(), refused = new Set();
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    ws.onmessage = (m) => {
      const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const w = wait.get(x.id); wait.delete(x.id); return x.error ? w.reject(new Error(`${w.method}: ${x.error.message}`)) : w.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const url = x.params.request.url, door = url.startsWith(origin + '/lock/'), ok = !door && (url.startsWith(origin + '/') || url.startsWith('data:') || url.startsWith('blob:'));
        if (door) atDoor = true;
        if (ok) send('Fetch.continueRequest', {requestId: x.params.requestId}, x.sessionId).catch(() => {});
        else { refused.add(new URL(url).origin); send('Fetch.failRequest', {requestId: x.params.requestId, errorReason: 'BlockedByClient'}, x.sessionId).catch(() => {}); }
        return;
      }
      if (x.method === 'Runtime.exceptionThrown') out.errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 300));
    };
    const t = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: W, height: H});
    const s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
    for (const m of ['Page.enable', 'Runtime.enable']) await send(m, {}, s);
    await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
    await send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: 1, mobile: false}, s);
    await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s); await send('Page.bringToFront', {}, s).catch(() => {});
    await send('Page.addScriptToEvaluateOnNewDocument', {source: RECORD}, s);
    const js = async (expr) => { const r = await send('Runtime.evaluate', {expression: expr, returnByValue: true}, s); return r.result?.value ?? null; };
    const press = async (x, y) => { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', {type, x, y, button: type === 'mouseMoved' ? 'none' : 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1}, s); };
    const until = async (expr, ms) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await js(expr).catch(() => false)) return true; await sleep(150); } return false; };
    const shot = async (name) => { if (!SHOTS) return; fs.mkdirSync(SHOTS, {recursive: true}); const p = path.join(SHOTS, name); fs.writeFileSync(p, Buffer.from((await send('Page.captureScreenshot', {format: 'png'}, s)).data, 'base64')); (out.shots ||= []).push(p); };
    const nav = await send('Page.navigate', {url: URL_}, s); if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
    const t0 = Date.now(), at = () => +((Date.now() - t0) / 1000).toFixed(1); let card = null;

    if (PRESS) { const there = await until(`!!document.querySelector(${JSON.stringify(PRESS)}) && !!window.dlAthenaFilm`, 30000); if (atDoor) throw new Error(`${origin} answered with the house's lock`); await js(`document.querySelector(${JSON.stringify(PRESS)})?.scrollIntoView({block: 'center'})`); await sleep(1500); card = await js(box(PRESS)); const before = await js(`({up: !!window.dlAthenaFilm?.state?.().up, media: document.querySelectorAll('video, audio').length})`); check(there && card?.shown && card.hits, 'the page\'s own door to the film stands and takes a press', card); check(before && !before.up && before.media === 0, 'before the press: no player up, no picture and no sound in the page', before); if (!card?.hits) throw new Error(`the door ${PRESS} is not there to press: ${JSON.stringify(card)}`); await shot('1-the-door.png'); } else {   // 1. the film plays; SKIP TO THE MINT, pressed; she comes, enters and lands
    const plays = await until(`(() => { if (document.title === 'DysonLight · Harmony') return false; const f = window.dlTwelve?.state?.().film; return !!f && f.t > 1.5 && !f.paused; })()`, 45000);
    if (atDoor || await js(`document.title === 'DysonLight · Harmony'`)) throw new Error(`${origin} answered with the house's lock: prove on the same tree served by tools/serve-range`);
    if (!plays) throw new Error(`the film did not play within 45 s: ${JSON.stringify(await js('window.dlTwelve?.state?.().film ?? null'))}`);
    const skip = await js(box('[data-twelve-skip]'));
    if (!skip?.shown || !skip.hits) throw new Error(`SKIP TO THE MINT is not there to press: ${JSON.stringify(skip)}`);
    out.skip = {at: at(), from: await js('window.dlTwelve.state().film.t')};
    await press(skip.x, skip.y);
    // THE SKIP ASKS FIRST (lane/her-egg-first-and-the-skip-asks, his Oct 29 2026 20:45:41 UTC): her question, answered Skip
    if (!await until(`!!window.dlAthena?.state?.().asking`, 3000)) throw new Error('SKIP TO THE MINT did not ask first');
    const yes = await js(box('.dl-athena-ask [data-ask="skip"]')); await press(yes.x, yes.y);
    const landed = await until(`(window.__heard || []).some((e) => e.type === 'landed')`, 70000);
    out.heard = await js('window.__heard'); out.landed_s = at();
    check(landed && out.heard.some((e) => e.type === 'entered'), 'the real skip: she comes, makes her entrance and lands', out.heard);
    if (!landed) throw new Error('she did not land within 70 s of the skip');
    await sleep(1200); out.entrance = {played: await js(`!!document.querySelector('.dl-her-e')`), left: await until(`!document.querySelector('.dl-her-e')`, 9000), at: at()}; await sleep(400);   // her egg's flash and her making's opening; then THE LYSSAJUDRON ENTERS (Nov 11 2026, dl-her-colours.js ENTER): her entrance plays out over her making (5.9 s; none on a page without its sheet) and leaves it

    // 2. THE ROAD IS ONE TAKE: on her landing her making is the whole screen, nothing on it; the card comes with her being made, under the rebate, then stands
    const state0 = await js(FILM), there = await js(`!!document.querySelector('.dl-athena-film')`);
    const making = await js(`(() => ({open: window.DL_HER?.state?.().open ?? null, reason: window.DL_HER?.state?.().reason ?? null}))()`);
    const say = await js(box('.dl-her-say')), field = await js(box('.dl-her-field')), go = await js(box('.dl-her-go')), router = await js(`!!document.querySelector('.dl-router')`);
    check(making.open && !state0?.up && !there, 'on her landing her making is the whole screen and no card sits on it', {making, up: state0?.up ?? null, there});
    check(say?.hits && field?.hits && go?.shown && go.hits, '"Give me my colours." whole: its line, its field and its door each under a press', {say, field, go});
    check(!router, 'the rebate waits for her making, as before', {router});
    await shot('1-her-making-with-nothing-on-it.png');
    const tool = await js(box('.dl-her-tool')); await press(tool.x, tool.y);
    if (!await until('!!window.DL_HER?.state?.().whole', 6000)) throw new Error('her die did not fire her six chambers');
    const door = await js(box('.dl-her-go')); await press(door.x, door.y);
    const made = await until(`(window.__heard || []).some((e) => e.type === 'made')`, 5000); await sleep(900);
    const under = await js(FILM), unseen = await js(`(() => { const f = document.querySelector('.dl-athena-film'); return !!f && getComputedStyle(f).visibility === 'hidden'; })()`);
    check(made && under?.up && !under.open && unseen && await js(`!!document.querySelector('.dl-router.on')`), 'made: the rebate slams in and the card comes with it, unseen under it', {made, up: under?.up ?? null, unseen});
    check(under?.film && under.film.src === null, 'not a byte of the film before the press', under?.film); /* ON TRACK (dl-space-router.js, his Oct 30 2026 "i dont want people able to get out of track"): a first visit's rebate has no × until its WATCH THE FILM is pressed, so the road to the card is a visitor's own: down to his film by the call, back up by the wheel, then the × */ await sleep(700); const noX = await js(`document.querySelector('.dl-router-close')?.hidden === true`), down = await js(box('.dl-router-down')), said = await js(`document.querySelector('.dl-router-down')?.getAttribute('aria-label') ?? null`); await shot('1-the-rebate-on-track.png'); if (down?.hits) await press(down.x, down.y); const away = await until(`'spaceRouterAway' in document.documentElement.dataset`, 9000); await sleep(1200); for (let i = 0; i < 6 && !(await js('scrollY === 0')); i++) { await send('Input.dispatchMouseEvent', {type: 'mouseWheel', x: W / 2, y: H / 2, deltaX: 0, deltaY: -20000}, s); await sleep(500); } const back = await until(`scrollY === 0 && document.querySelector('.dl-router-close')?.hidden === false`, 6000); check(noX && said === 'WATCH THE FILM' && down?.hits && away && back, 'ON TRACK: a first visit\'s rebate has no ×; WATCH THE FILM carries the page down to his film, and back up by the wheel the × is there', {noX, said, down, away, back});
    const shut = await js(box('.dl-router-close')); await press(shut.x, shut.y); await sleep(500);
    card = await js(box('.dl-athena-film-go'));
    check(card?.shown && card.hits && !(await js(`!!document.querySelector('.dl-router')`)), 'the rebate closed by its ×: the card stands and takes a press where it stands', card);
    await shot('1-the-card-after-the-rebate.png'); }

    // 3. a press on the card: the stage, the film playing with its soundtrack at its second
    await press(card.x, card.y);
    const playing = await until(`(() => { const s = window.dlAthenaFilm.state(); return s.open && s.film.t >= 3 && !s.film.paused && s.song && !s.song.paused; })()`, 30000);
    const s1 = await js(FILM);
    check(playing && s1.sound && !s1.song.muted, 'a press opens the stage: the film plays and its soundtrack is heard', {open: s1.open, film: s1.film, song: s1.song, sound: s1.sound});
    await shot('2-the-stage-playing.png');

    // 4. The rule, item 8, on this film: a tap that mutes, a tap that unmutes; the picture never goes back
    const soundB = await js(box('.dl-athena-film-bar button:nth-child(2)'));
    if (!soundB?.hits) throw new Error(`the stage's Sound is not there to press: ${JSON.stringify(soundB)}`);
    const reach = s1.film.seekable, songReach = s1.song.seekable;
    for (const [n, want] of [[1, false], [2, true]]) {
      const tapAt = (await js(FILM)).film.t;
      await press(soundB.x, soundB.y);
      const samples = []; for (let i = 0; i < 40; i++) { await sleep(100); samples.push((await js(FILM)).film.t); }
      const s2 = await js(FILM);
      check(s2.sound === want && s2.song.muted === !want, `tap ${n} on Sound: the soundtrack ${want ? 'unmuted' : 'muted'}, the button says it (${s2.words?.[1]})`, {sound: s2.sound, muted: s2.song.muted});
      check(Math.min(...samples) >= tapAt - 0.05, `tap ${n}: the picture never below its second at the tap (${tapAt.toFixed(2)} s) for 4 s`, {tapAt, min: Math.min(...samples)});
      check(samples.at(-1) - tapAt >= 3, `tap ${n}: the picture played on (3 s or more in 4 s)`, {from: tapAt, to: samples.at(-1)});
      if (want) check(Math.abs(s2.song.t - s2.film.t) <= 0.35, 'the soundtrack within 0.35 s of the picture at the end', {film: s2.film.t, song: s2.song.t});
    }
    const s3 = await js(FILM);
    check(s3.writes.length === 0, 'no write of the governance film\'s picture time, by any tap: only its soundtrack is brought to the picture', {picture: s3.writes, soundtrack: s3.aligned});
    check(reach > s1.film.t && songReach > s1.film.t, 'both media can be sought past the taps (a server that answers Range)', {film: reach, song: songReach});

    // 5. Pause holds it; × closes back to the card, her making open and its Continue reachable again
    const playB = await js(box('.dl-athena-film-bar button:nth-child(1)'));
    await press(playB.x, playB.y); await sleep(300);
    const held = (await js(FILM)).film.t; await sleep(1000); const s4 = await js(FILM);
    check(s4.film.paused && s4.song.paused && Math.abs(s4.film.t - held) < 0.01 && s4.words?.[0] === 'Play', 'Pause holds the picture and its sound', {film: s4.film, song: s4.song, words: s4.words});
    const close = await js(box('.dl-athena-film-close'));
    await press(close.x, close.y); await sleep(400);
    const s5 = await js(FILM), card2 = await js(box(PRESS || '.dl-athena-film-go'));
    check(!s5.open && card2?.shown && card2.hits, PRESS ? '× closes the stage back to the page, its door under a press again' : '× closes the stage back to the card, under a press again', {open: s5.open, card: card2});
    await shot('3-back-to-the-card.png');
    check(out.errors.length === 0, 'no page error', out.errors);
    out.refused = [...refused];
  } catch (e) { out.error = String(e?.message || e).slice(0, 400); }
  clearTimeout(bound); await end();
  const failed = out.checks.filter((c) => !c.ok).length;
  out.pass = !out.error && failed === 0 && out.checks.length > 0;
  console.log(JSON.stringify(out, null, 1));
  if (out.error) { console.log(`COULD NOT RUN: ${out.error}`); return out.checks.some((c) => !c.ok) ? 1 : 2; }
  console.log(out.pass ? PRESS ? 'PASS: the door opens the governance film, it plays with its sound, never goes back on a tap, pauses and closes' : 'PASS: she lands, her making stands alone, the governance film comes with her being made, plays with its sound, never goes back on a tap, pauses and closes' : `FAIL: ${failed} check(s)`);
  return out.pass ? 0 : 1;
}
main().then((code) => process.exit(code));

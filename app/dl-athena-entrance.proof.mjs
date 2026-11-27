#!/usr/bin/env node
// dl-athena-entrance.proof.mjs: her entrance watched in a real browser, from the film's skip to her offer (lane/keep-your-sol-keep-your-soul, his Oct 29 2026 18:19 UTC: "we desperately need
// to work on the intro dude... like dramatically"; lane/her-egg-first-and-the-skip-asks, his 20:44:34 UTC "the text is so fucking unconsequential" and
// 20:45:41 "there needs to be a fucking confimration popup for when to skip"; lane/theres-no-time, his Oct 30 2026 06:24:04 UTC "we gotta work on the shit
// that gets visualized to screen while she talks... the player can simply scroll down and read more"). A headless Chrome, off every screen, opens the mint's
// page (app/warm.html) at each size (under 768 px wide with touch emulated) as a first visit and presses the film's own skip ([data-twelve-skip]) by a trusted
// press (CDP Input.dispatchMouseEvent, as his hand is, once nothing covers its target):
//   0. the press asks first (her question, ASK, read once its slam is over): Stay leaves the film and the sound as they were, nothing sought; pressed again, its Skip skips;
//   1. each line of STORY (dl-athena.mjs) under her in its turn, in its pose, with its figures (SHOWS) and no other: no motion graphic but the page's own
//      countdown, on its line, its words the page's, inside the screen and clear of her; no sound-word on a line; a frame of each with --shots;
//   2. on "egg", with no seat and the deposit door open (THE EGG WAITS FOR THE MINT, SHE HANDS BACK TO THE FLASK: dl-athena.js), her egg is laid where her hands
//      hold it and offered (html[data-egg-offered]): nothing falls, nothing flashes, her picture stays; and she holds it out past the beat she would land on;
//   3. THE OFFER IS TWO PATHS (dl-paywall.css): the split (#dl-sides) up behind her, its two plates (the pool's a.dl-stake-plate, the flask's a.dl-flask-plate)
//      inside the screen and pressable (the page's own elementFromPoint at each centre hits it); nothing pressed after the skip: her making waits, no side taken;
//   THE ROAD IS ONE TAKE, read off the page's own frames: the letterbox open under the hit's white, closing where it is seen, closed as her first line comes in;
//   4. a return visit (the browser keeps the minted egg, dl-space-router.js FILM_SEEN_KEY: ON TRACK holds only a first visit, and NO SKIP THE FIRST TIME hides
//      her Skip on it), at the first size, during her entrance: a wheel up, a wheel sideways, a stray press on her picture and stray keys (Space, a) leave it
//      running and the page still; her Skip asks; Stay, Esc and a press beside the question keep it running; Skip then Skip ends it as before, and she lands;
//   5. SCROLLING READS ON, on a return visit, twice (a wheel down at the first size, a finger's pan up at the last, by CDP Input.dispatchTouchEvent): her
//      entrance ends quietly (her moment 'read', no landing, no skip, no question, no stop's bubble); the page lands on the offer (READ_ON.to under the page's
//      own scroll-padding) where the live page holds it, else comes to rest, its landing unchecked (READ_ON.to is inside a <template> of warm.html); nothing
//      pulls him back (her making, the governance card and the rebate stay shut), the film stands as it stood (nothing sought: CLAUDE.md, The rule, 8), and the scroll is his again;
//   and the page throws no error.
//   nice -n 19 node app/dl-athena-entrance.proof.mjs [--url <the page>] [--sizes 1440x900,390x844] [--chrome <path>] [--shots <folder>]
// The split stands only while the deposit door is live (dl-paywall.css): served with no deposit door answering, the offer's checks fail.
// The Chrome: as dl-red-road.proof.mjs finds it. Exit 0 on PASS, 1 on FAIL, 2 when it could not run (no Chrome; or the mint closed, MINT_CLOSES,
// after which the film plays through with no skip and no stop). It ends what it started (the Chrome by pid, its profile folder) and gives itself 420 s.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { MINT_CLOSES } from './dl-paywall.js';
import { STORY, ENTRANCE, SHOWS, ASK, READ_ON, EGG, ATHENA_POSE, COUNT, countPlates } from './dl-athena.mjs';
import { FILM_SEEN_KEY } from './dl-space-router.js';   // a return visit: the minted egg this browser keeps

const args = process.argv.slice(2), opt = (n, f) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : f; };
const URL_ = opt('--url', 'http://127.0.0.1:8977/intro/dyson-society/app/warm.html'), SHOTS = opt('--shots', null);
const SIZES = opt('--sizes', '1440x900,390x844').split(',').map((s) => s.split('x').map(Number)).filter(([w, h]) => w > 0 && h > 0);
const SETTLE_MS = 1100;   // a figure's rise (.65 s) and her card's slam are over by then
const AFTER_TURN_MS = 1400;   // a turn's own animation is over by then (the hit's white .42 s, its focus lines .5 s),
const TURN_EDGE_MS = 150;     // or this long before the line ends, whichever comes first: a turn is read on its own line
const BEFORE_TURN_MS = 300;   // a turning line is read settled, or this long before its turn, whichever comes first: its figures as they stood before it
function chromeOf() {
  const given = opt('--chrome', process.env.CHROME); if (given && fs.existsSync(given)) return given;
  for (const p of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    '/Applications/Chromium.app/Contents/MacOS/Chromium']) if (fs.existsSync(p)) return p;
  const pw = path.join(os.homedir(), 'Library/Caches/ms-playwright');
  const dirs = fs.existsSync(pw) ? fs.readdirSync(pw).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split('-')[1] - +a.split('-')[1]) : [];
  for (const d of dirs) for (const arch of ['chrome-mac-arm64', 'chrome-mac']) { const p = path.join(pw, d, arch, 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'); if (fs.existsSync(p)) return p; }
  return null;
}
const out = { url: URL_, when: new Date().toISOString(), walks: [], checks: [], errors: [] };
const check = (ok, what, detail) => { out.checks.push({ ok: !!ok, what, ...(detail === undefined ? {} : { detail }) }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`); };
if (Date.now() > Date.parse(MINT_CLOSES)) { console.log(JSON.stringify({ ...out, error: `the mint closed at ${MINT_CLOSES}: no skip and no stop to walk` }, null, 1)); process.exit(2); }
const chrome = chromeOf();
if (!chrome) { console.log(JSON.stringify({ ...out, error: 'no Chrome on this Mac' }, null, 1)); process.exit(2); }
out.chrome = chrome;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'athena-entrance-proof-')), port = 9500 + Math.floor(Math.random() * 400);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--mute-audio',
  '--hide-scrollbars', '--use-angle=metal', '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
let code = 2;
const end = () => { try { proc.kill('SIGKILL'); } catch {} try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} process.exit(code); };
setTimeout(() => { out.errors.push('420 s passed'); console.log(JSON.stringify(out, null, 1)); end(); }, 420_000).unref();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// what the page tells of her (her moments, the film's skip), and on a return visit the minted egg it keeps
const SEEN_SCRIPT = `window.__walk = { seen: [] };
    document.addEventListener('dl-athena', (e) => { let d = {}; try { d = JSON.parse(JSON.stringify(e.detail || {})); } catch {} __walk.seen.push({ ...d, s: +(performance.now() / 1000).toFixed(2) }); });
    document.addEventListener('dl-skip-to-mint', () => __walk.seen.push({ type: 'skip', s: +(performance.now() / 1000).toFixed(2) }));`;
const RETURN = `try { localStorage.setItem(${JSON.stringify(FILM_SEEN_KEY)}, '1'); } catch {}`;

async function page([W, H], { returning = false, touch = W < 768 } = {}) {   // a fresh tab at this size, opened on the page as a first visit or a return one; its thrown errors and its console's errors kept
  let target = null;
  for (let i = 0; i < 80 && !target; i++) { await sleep(250); try { target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json(); } catch {} }
  if (!target?.webSocketDebuggerUrl) throw new Error('Chrome did not open a tab');
  const ws = new WebSocket(target.webSocketDebuggerUrl); let id = 0; const wait = new Map(), errs = [], said = [];
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); }
    else if (d.method === 'Runtime.exceptionThrown') errs.push(String(d.params.exceptionDetails?.exception?.description ?? d.params.exceptionDetails?.text).slice(0, 300));
    else if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') said.push(d.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 200));
  };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('the tab did not answer')); });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable'); await send('Page.enable');
  await send('Storage.clearDataForOrigin', { origin: new URL(URL_).origin, storageTypes: 'all' });   // one Chrome's tabs share the page's storage (her paint, wishes, name, the minted egg)
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false }); if (touch) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: SEEN_SCRIPT + (returning ? RETURN : '') });
  await send('Page.navigate', { url: URL_ });
  const js = async (expression) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text); return r.result?.result?.value; };
  const until = async (expression, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await js(expression).catch(() => false)) return true; await sleep(200); } return false; };
  const press = async (sel, ms = 3000) => {   // a trusted press at the centre of what `sel` names, once nothing covers it there (waited for, `ms` at most)
    const t0 = Date.now(); let where = null;
    do { where = await js(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2,
      hit = document.elementFromPoint(x, y); return { x, y, on: r.width > 0 && !!hit && (hit === e || e.contains(hit)) }; })()`).catch(() => null); if (where?.on) break; await sleep(150); } while (Date.now() - t0 < ms);
    if (where?.on) await pressAt(where.x, where.y);
    return where;
  };
  const pressAt = async (x, y) => { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1 }); };
  const key = async (k) => {   // a trusted key: down and up
    const [code, vk, text] = { Escape: ['Escape', 27, ''], ' ': ['Space', 32, ' '], a: ['KeyA', 65, 'a'] }[k];
    await send('Input.dispatchKeyEvent', { type: 'keyDown', key: k, code, windowsVirtualKeyCode: vk, ...(text ? { text } : {}) }); await send('Input.dispatchKeyEvent', { type: 'keyUp', key: k, code, windowsVirtualKeyCode: vk });
  };
  const shot = async (name) => {
    if (!SHOTS) return null;
    fs.mkdirSync(SHOTS, { recursive: true }); const s = await send('Page.captureScreenshot', { format: 'png' }), f = path.join(SHOTS, `${name}.png`);
    fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); return f;
  };
  return { send, js, until, press, pressAt, key, shot, errs, said, close: () => { try { ws.close(); } catch {} } };
}

// what the page shows of her entrance at this moment: her line, her pose, her figures (each with its box, its words and how far it has come in), every figure
// made so far, any motion graphic of the old kinds left in her layer, a sound-word standing, her portrait's box, her egg, and the page's own countdown
const LOOK = `(() => {
  const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round); }, tidy = (t) => (t ?? '').replace(/\\s+/g, ' ').trim();
  const items = [...document.querySelectorAll('.dl-athena-mg-item.on')].map((e) => ({ key: e.dataset.mg, box: box(e), text: tidy(e.textContent), opacity: +(+getComputedStyle(e).opacity).toFixed(2) }));
  const s = window.dlAthena.state(), intro = document.querySelector('.dl-athena-intro'), sfx = document.querySelector('.dl-athena-sfx.on');
  return { beat: s.seen.beat, say: document.querySelector('.dl-athena-say-line')?.textContent ?? '', pose: s.pose, items, her: box(document.querySelector('.dl-athena-portrait')),
    made: [...document.querySelectorAll('.dl-athena-mg-item')].map((e) => e.dataset.mg), graphics: document.querySelectorAll('.dl-athena-mg :is(.slam, .sun, .motes, .spark, .plate, .slash)').length,
    sfx: sfx ? sfx.textContent : null, mint: tidy(document.querySelector('[data-mint-line]')?.textContent), hit: intro?.classList.contains('hit') ?? false, vw: innerWidth, vh: innerHeight,
    door: (() => { const d = document.querySelector(${JSON.stringify(COUNT.door)}); return !!d && !d.disabled; })(),
    egg: (() => { const e = document.querySelector('.dl-athena-egg'); return e && !e.hidden ? box(e) : null; })(), dropped: !!s.dropped, offered: !!s.offered, teleports: s.teleports,
    faded: +(+getComputedStyle(document.querySelector('.dl-athena-portrait')).opacity).toFixed(2) };
})()`;
const overlap = (a, b) => (a && b ? Math.max(0, Math.min(a[2], b[2]) - Math.max(a[0], b[0])) * Math.max(0, Math.min(a[3], b[3]) - Math.max(a[1], b[1])) : 0);
// THE SKIP ASKS FIRST: her question as the page shows it (the div: her bubble's own question buttons share its class), read once its slam is over
const ASKING = `!!window.dlAthena?.state?.().asking`;
const ASK_LOOK = `(() => { const a = document.querySelector('div.dl-athena-ask'), b = a?.querySelector('.dl-athena-ask-box')?.getBoundingClientRect();
  const q = a?.querySelector('.dl-athena-ask-q'), qb = q?.getBoundingClientRect();
  return { shown: !!a && !a.hidden, q: q?.textContent ?? '', seen: !!q && +getComputedStyle(q).opacity === 1 && !!b && qb.width > 0 && qb.left >= b.left - 8 && qb.right <= b.right + 8, buttons: [...(a?.querySelectorAll('button') ?? [])].map((x) => x.textContent),
    focus: document.activeElement?.textContent ?? null, inside: !!b && b.left >= 0 && b.top >= 0 && b.right <= innerWidth && b.bottom <= innerHeight, box: b ? [b.left, b.top, b.right, b.bottom].map(Math.round) : null }; })()`;
const askRead = async (p) => { await p.until(`(document.querySelector('div.dl-athena-ask')?.getAnimations({ subtree: true }) ?? []).every((a) => a.playState === 'finished')`, 5000); return p.js(ASK_LOOK); };
// THE ROAD IS ONE TAKE: her intro's classes, the letterbox and the hit's white at each of the page's own frames, from the skip to her offer
const TAKE = `(() => { const T = window.__take = []; const cs = (sel) => { const e = document.querySelector(sel); return e ? getComputedStyle(e) : null; };
  const op = (sel) => { const c = cs(sel); return c && c.display !== 'none' && c.visibility !== 'hidden' ? +(+c.opacity).toFixed(3) : 0; };
  const sy = (sel) => { const c = cs(sel); if (!c || c.transform === 'none') return c ? 1 : 0; const m = c.transform.match(/matrix\\(([^)]+)\\)/); return m ? +(+m[1].split(',')[3]).toFixed(3) : 1; };
  (function rec() { const intro = document.querySelector('.dl-athena-intro'), on = !!intro && !intro.hidden;
    T.push({ t: performance.now(), intro: on ? intro.className : '', lb: on ? sy('.dl-athena-lb.t') : 0, white: on ? op('.dl-athena-white') : 0 });
    if (!document.documentElement.hasAttribute('data-egg-offered') && T.length < 20000) requestAnimationFrame(rec); })(); })()`;
// THE OFFER IS TWO PATHS: her egg, the split behind her, each plate's box and whether a press at its centre reaches it, and what was taken since the skip
const OFFER = `(() => { const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.right, r.bottom].map(Math.round); }, root = document.documentElement, sides = document.querySelector('#dl-sides');
  const plate = (sel) => { const e = document.querySelector(sel), b = box(e); if (!b) return null; const hit = document.elementFromPoint((b[0] + b[2]) / 2, (b[1] + b[3]) / 2);
    return { box: b, on: !!hit && (hit === e || e.contains(hit)), opacity: +(+getComputedStyle(e).opacity).toFixed(2) }; };
  return { vw: innerWidth, vh: innerHeight, offered: root.hasAttribute('data-egg-offered'), sides: sides && getComputedStyle(sides).display !== 'none' ? box(sides) : null,
    pool: plate('a.dl-stake-plate[data-side="pool"]'), flask: plate('a.dl-flask-plate[data-side="flask"]'), making: root.dataset.herMaking ?? null, hexagon: window.dlHexagon?.state?.().stage ?? null,
    chose: root.dataset.chose ?? null, path: location.pathname }; })()`;
const filmOf = (s) => ({ seeks: s.seeks, skip: s.skip ?? null, film: +s.film.t.toFixed(2), paused: s.film.paused, soundOn: s.soundOn, song: { t: +s.song.t.toFixed(2), muted: s.song.muted, paused: s.song.paused } });
const RUNNING = `!__walk.seen.some((e) => e.type === 'skipped' || e.type === 'landed' || e.type === 'read') && !document.querySelector('.dl-athena-intro')?.hidden`;
const FILM_PLAYS = `(() => { const b = document.querySelector('[data-twelve-skip]'), f = window.dlTwelve?.state?.().film; if (!b || b.hidden || !f) return false;
    const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && f.ready >= 3 && !f.paused && f.t > 2; })()`;
// the trusted way to her entrance: the film's skip, pressed once it plays, its question answered Skip; then her entrance, past `beat`
async function toHer(p, need, beat = 2) {
  need(await p.until(FILM_PLAYS, 45000), 'the film plays and its skip stands on it');
  await p.press('[data-twelve-skip]'); need(await p.until(ASKING, 3000), 'the film\'s skip asks');
  await p.press(`div.dl-athena-ask [data-ask="skip"]`);
  need(await p.until(`__walk.seen.some((e) => e.type === 'entered') && (window.dlAthena.state().seen.beat ?? -1) >= ${beat}`, 60000), `her entrance runs, past her line ${beat}`);
}
const still = async (p) => { let y = -1; for (let i = 0; i < 40; i++) { await sleep(150); const now = await p.js('Math.round(scrollY)'); if (i > 3 && now === y) return now; y = now; } return y; };   // the page at rest

async function walk([W, H]) {
  const tag = `${W}x${H}`, w = { size: tag, beats: [] }, p = await page([W, H]); out.walks.push(w);
  const ok = (cond, what, detail) => check(cond, `${tag}: ${what}`, detail);
  const need = (cond, what, detail) => { ok(cond, what, detail); if (!cond) throw new Error(`${tag}: ${what}`); };   // the walk goes no further than its first fall
  need(await p.until(FILM_PLAYS, 45000), 'the film plays and its skip stands on it', await p.js('window.dlTwelve?.state?.()?.film ?? null').catch(() => null));
  // EVERY LOOK IS THE PAGE'S OWN: a watcher in the page (its frame loop) sees each line begin and reads it at its own moments (SETTLE_MS in; a turn's
  // AFTER_TURN_MS past its word, or TURN_EDGE_MS before the line ends), so a slow frame or a late poll here on a loaded Mac never shifts a read
  const plan = ENTRANCE.map((beat, i) => (beat.say ? { i, settle: beat.turn ? Math.min(SETTLE_MS, beat.turn.ms - BEFORE_TURN_MS) : SETTLE_MS, turn: beat.turn ? Math.min(beat.turn.ms + AFTER_TURN_MS, ENTRANCE[i + 1].at - beat.at - TURN_EDGE_MS) : null,
    drop: beat.turn?.drop ? beat.turn.ms + 40 : null } : null)).filter(Boolean);   // drop: her egg read 40 ms into its turn, where her hands held it
  await p.js(`(() => { const plan = ${JSON.stringify(plan)}, look = () => (${LOOK}); window.__looks = {}; let last = -1;
    (function watch() { const b = window.dlAthena?.state?.().seen?.beat ?? -1;
      if (b !== last) { last = b; const at = plan.find((x) => x.i === b);
        if (at) { setTimeout(() => { window.__looks[b] = look(); }, at.settle); if (at.turn != null) setTimeout(() => { window.__looks[b + 't'] = look(); }, at.turn);
          if (at.drop != null) setTimeout(() => { window.__looks[b + 'd'] = look(); }, at.drop); } }
      if (last < ${plan.at(-1).i}) requestAnimationFrame(watch); })(); })()`);
  await p.js(TAKE);
  // 0. THE SKIP ASKS FIRST: the film's skip asks her question; Stay leaves the film and the sound as they were; pressed again, its Skip skips
  const film0 = await p.js('window.dlTwelve.state()');
  w.skip = await p.press('[data-twelve-skip]');
  need(w.skip?.on, 'the film\'s skip is pressed by a trusted press', w.skip);
  need(await p.until(ASKING, 3000), 'the film\'s skip asks first: her question over the page', await p.js(ASK_LOOK));
  w.ask = await askRead(p); w.ask.shot = await p.shot(`0-ask-${tag}`);
  ok(w.ask.shown && w.ask.seen && w.ask.q === ASK.ask && w.ask.buttons.join('|') === [ASK.stay, ASK.skip].join('|') && w.ask.focus === ASK.stay && w.ask.inside,
    `her question: "${ASK.ask}" ${ASK.stay} or ${ASK.skip}, the focus on ${ASK.stay}, inside the screen`, w.ask);
  const stay = await p.press(`div.dl-athena-ask [data-ask="stay"]`); await sleep(700);
  const film1 = await p.js('window.dlTwelve.state()'); w.stay = { before: filmOf(film0), after: filmOf(film1) };
  ok(stay?.on && !(await p.js(ASKING)) && film1.skip === undefined && film1.seeks === film0.seeks && film1.film.t > film0.film.t && !film1.film.paused
    && film1.soundOn === film0.soundOn && film1.song.muted === film0.song.muted && film1.song.paused === film0.song.paused, `${ASK.stay}: the film plays on from where it was, nothing sought, the sound as it was`, w.stay);
  w.skipAgain = await p.press('[data-twelve-skip]');
  need(w.skipAgain?.on && await p.until(ASKING, 3000), 'the film\'s skip asks again', w.skipAgain);
  w.skipped = await p.press(`div.dl-athena-ask [data-ask="skip"]`);
  need(w.skipped?.on && await p.until('!!window.dlTwelve.state().skip', 3000) && !(await p.js(ASKING)), `${ASK.skip}: the film skips to the stop as before`, await p.js('window.dlTwelve.state().skip ?? null'));
  need(await p.until(`__walk.seen.some((e) => e.type === 'entered')`, 60000), 'her entrance begins after the skip', await p.js('__walk.seen'));
  // 1 and 2: each line in its turn, in its pose, with its figures; each turn as her reading reaches its word
  for (const [i, beat] of ENTRANCE.entries()) {
    if (!beat.say) continue;
    const line = STORY.find((l) => l.say === beat.say({ querySelector: () => null })), n = STORY.indexOf(line) + 1;
    const looked = (k) => p.js(`new Promise((r) => { const t = performance.now(); (function tick() { const v = window.__looks[${JSON.stringify(k)}]; if (v || performance.now() - t > 30000) r(v ?? null); else setTimeout(tick, 16); })(); })`);
    const seen = await looked(String(i));   // the frame is taken after the page's own read
    if (!seen) { ok(false, `line ${n} comes`, { beat: i }); break; }
    const keys = seen.items.map((x) => x.key).sort(), b = { n, say: seen.say, pose: seen.pose, keys, items: seen.items, made: seen.made, graphics: seen.graphics, sfx: seen.sfx };
    b.shot = await p.shot(`${n}-${tag}`); w.beats.push(b);
    ok(seen.beat === i && seen.say === line.say && seen.pose === line.pose, `line ${n} "${line.say}" in her ${line.pose}`, { beat: seen.beat, say: seen.say, pose: seen.pose });
    ok(keys.join() === [...line.show].sort().join(), `line ${n}: its figures (${line.show.join(', ') || 'none'}) and no other`, keys);
    // THERE'S NO TIME: no motion graphic but the countdown (no slam, breath, sun or spark made in her layer), and no sound-word over a line of hers
    ok(seen.made.every((k) => k === 'count') && seen.graphics === 0 && seen.sfx === null, `line ${n}: no motion graphic but the countdown, no sound-word`, { made: seen.made, graphics: seen.graphics, sfx: seen.sfx });
    for (const it of seen.items) {
      const inside = it.box[0] >= 0 && it.box[1] >= 0 && it.box[2] <= seen.vw && it.box[3] <= seen.vh, area = (it.box[2] - it.box[0]) * (it.box[3] - it.box[1]);
      ok(inside && overlap(it.box, seen.her) <= area * 0.04, `line ${n}: ${it.key} inside the screen and clear of her`, { box: it.box, her: seen.her, over: overlap(it.box, seen.her) });
      // THE COUNT IS AN OPENING (dl-athena.mjs COUNT): the page's days on the freeze's two plates, OPEN only with the kit's door open; a line with no days as the page shows it
      const plates = it.key === 'count' ? countPlates(seen.mint, seen.door) : null, want = plates ? plates.map((pl) => `${pl.name} ${pl.stamp}`).join(' ') : seen.mint;
      if (SHOWS[it.key]?.from) ok(it.text && it.text === want && it.opacity > 0.95, `line ${n}: ${it.key} says "${want}" from the page's own "${seen.mint}", whole`, { text: it.text, mint: seen.mint, door: seen.door, opacity: it.opacity });
    }
    if (!beat.turn) continue;
    const turned = await looked(`${i}t`), t = { n, items: turned.items, pose: turned.pose, hit: turned.hit, beat: turned.beat };
    t.shot = await p.shot(`${n}-turn-${tag}`); b.turn = t;
    if (line.turn.pose || line.turn.hit) ok(turned.beat === i && turned.pose === (line.turn.pose ?? line.pose) && turned.hit === !!line.turn.hit && turned.items.length === line.show.length,
      `line ${n}: on "${line.turn.at}" her ${line.turn.pose ?? line.pose}${line.turn.hit ? ' and her card\'s hit' : ''}, nothing else`, { pose: turned.pose, hit: turned.hit, items: turned.items });
    if (line.turn.drop) {   // THE EGG WAITS FOR THE MINT: with no seat, on "egg" her egg is laid where her hands hold it in her picture and offered; nothing falls, nothing flashes
      const d = await looked(`${i}d`), [hl, ht, hr, hb] = seen.her, kx = (hr - hl) / ATHENA_POSE[0], ky = (hb - ht) / ATHENA_POSE[1];
      const want = [hl + EGG.box[0] * kx, ht + EGG.box[1] * ky, hl + (EGG.box[0] + EGG.box[2]) * kx, ht + (EGG.box[1] + EGG.box[3]) * ky].map(Math.round);
      t.offer = { at: d?.egg, want, offered: turned.offered, dropped: turned.dropped, faded: turned.faded, teleports: turned.teleports };
      ok(d?.egg && d.egg.every((v, k) => Math.abs(v - want[k]) <= 4), `line ${n}: on "${line.turn.at}" her egg is laid where her hands hold it`, t.offer);
      ok(turned.offered && !turned.dropped && turned.teleports === 0 && turned.faded > 0.95 && turned.hit === false, `line ${n}: it is offered (html[data-egg-offered]): nothing falls, nothing flashes, her picture stays`, t.offer);
    }
  }
  // 3. she holds her egg out past the beat she would land on, and THE OFFER IS TWO PATHS behind her
  await p.js(`new Promise((r) => { const e = __walk.seen.find((x) => x.type === 'entered'); setTimeout(r, Math.max(0, e.s * 1000 + ${ENTRANCE.at(-1).at + 1200} - performance.now())); })`);
  w.offer = await p.js(OFFER); w.offer.shot = await p.shot(`13-offer-${tag}`); w.seen = await p.js('__walk.seen');
  const o = w.offer, inside = (b) => !!b && b[0] >= 0 && b[1] >= 0 && b[2] <= o.vw && b[3] <= o.vh && b[2] > b[0] && b[3] > b[1];
  ok(o.offered && w.seen.some((e) => e.type === 'egg' && e.offered) && !w.seen.some((e) => ['landed', 'skipped', 'read'].includes(e.type)), 'she holds her egg out past the beat she would land on: offered, no landing',
    { offered: o.offered, seen: w.seen.map((e) => e.type) });
  ok(inside(o.sides), 'the split (#dl-sides) stands behind her', o.sides);
  for (const side of ['pool', 'flask']) ok(inside(o[side]?.box) && o[side].on && o[side].opacity > 0.95, `the ${side}'s plate inside the screen, a press at its centre reaching it`, o[side]);
  ok(o.making === 'waiting' && !o.hexagon && !o.chose && o.path === new URL(URL_).pathname, 'nothing pressed after the skip: her making waits, no side taken, the page where it was', o);
  // THE ROAD IS ONE TAKE, read off the page's own frames: the letterbox
  { const T = await p.js('window.__take'), e0 = T.find((f) => /\bgo\b/.test(f.intro))?.t ?? NaN, rel = (f) => (f ? Math.round(f.t - e0) : null);
    const card = T.filter((f) => f.t >= e0 && f.t <= e0 + ENTRANCE[1].at + 300), from = card.find((f) => f.lb > 0.02), to = card.find((f) => f.lb >= 0.98);
    w.bars = { underWhite: Math.max(0, ...card.filter((f) => f.white > 0.05).map((f) => f.lb)), from: rel(from), to: rel(to), whiteWhileMoving: Math.max(0, ...card.filter((f) => f.lb > 0.02 && f.lb < 0.98).map((f) => f.white)), line: ENTRANCE[1].at };
    ok(w.bars.underWhite <= 0.02 && from && to && w.bars.to - w.bars.from >= 300 && w.bars.whiteWhileMoving === 0 && w.bars.to <= ENTRANCE[1].at + 80,
      'the letterbox stays open under the hit\'s white, then closes where it is seen, closed as her first line comes in', w.bars); }
  w.consoleErrors = p.said;
  ok(p.errs.length === 0, 'no error thrown on the page', p.errs);
  p.close();
}

// 4. THE SKIP ASKS FIRST during her entrance (his Oct 29 2026 20:45:41 UTC: "it is so fucking easy to skip accidentaly"): on a return visit, at one size
async function skips([W, H]) {
  const tag = `${W}x${H}`, w = { size: `${tag}, a return visit's skips` }, p = await page([W, H], { returning: true }); out.walks.push(w);
  const ok = (cond, what, detail) => check(cond, `${tag} skips: ${what}`, detail);
  const need = (cond, what, detail) => { ok(cond, what, detail); if (!cond) throw new Error(`${tag} skips: ${what}`); };
  await toHer(p, need, 1);
  // a wheel up, a wheel sideways, a stray press on her picture, stray keys (Space and a: what a viewer presses at a film): nothing reads on, nothing skips
  const beat0 = await p.js('window.dlAthena.state().seen.beat'), y0 = await p.js('scrollY');
  for (const [dx, dy] of [[0, -480], [480, 0]]) await p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x: Math.round(W / 2), y: Math.round(H / 2), deltaX: dx, deltaY: dy });
  await p.pressAt(Math.round(W * 0.3), Math.round(H * 0.5)); await p.key(' '); await p.key('a'); await sleep(1200);
  w.stray = { beat0, beat: await p.js('window.dlAthena.state().seen.beat'), asking: await p.js(ASKING), y0, y: await p.js('scrollY'), seen: await p.js('__walk.seen.map((e) => e.type)') };
  ok(await p.js(RUNNING) && !w.stray.asking && w.stray.y === y0, 'a wheel up or sideways, a stray press on her picture and stray keys leave her entrance running, nothing asked, the page under her still', w.stray);
  // her Skip asks; Stay keeps; Esc keeps; a press beside the question keeps
  for (const [how, close] of [[ASK.stay, () => p.press(`div.dl-athena-ask [data-ask="stay"]`)], ['Esc', () => p.key('Escape')], ['a press beside the question', () => p.pressAt(8, Math.round(H - 8))]]) {
    const pressed = await p.press('.dl-athena-skip');
    need(pressed?.on && await p.until(ASKING, 3000), `her Skip asks (to be answered ${how})`, pressed);
    if (how === ASK.stay) w.ask = { ...(await askRead(p)), shot: await p.shot(`skips-ask-${tag}`) };
    await close(); await sleep(500);
    const st = { asking: await p.js(ASKING), running: await p.js(RUNNING), beat: await p.js('window.dlAthena.state().seen.beat') };
    ok(!st.asking && st.running, `${how}: the question closes and her entrance runs on`, st);
  }
  ok(w.ask?.q === ASK.ask && w.ask.seen && w.ask.focus === ASK.stay && w.ask.inside, `her Skip's question is the film's: "${ASK.ask}", the focus on ${ASK.stay}, inside the screen`, w.ask);
  // Skip then Skip: her entrance ends as before, and she lands
  await p.press('.dl-athena-skip'); need(await p.until(ASKING, 3000), 'her Skip asks once more');
  await p.press(`div.dl-athena-ask [data-ask="skip"]`);
  const landed = await p.until(`__walk.seen.some((e) => e.type === 'landed')`, 5000);
  w.seen = await p.js('__walk.seen');
  const land = w.seen.find((e) => e.type === 'landed'), skip = w.seen.find((e) => e.type === 'skipped');
  ok(landed && skip && land?.entrance === 'skipped' && !(await p.js(ASKING)), `${ASK.skip} then ${ASK.skip}: her entrance ends as before (skipped at beat ${skip?.beat}) and she lands`, { skip, land });
  ok(p.errs.length === 0, 'no error thrown on the page', p.errs);
  p.close();
}

// 5. SCROLLING READS ON (his Oct 30 2026 06:24:04 UTC: "the player can simply scroll down and read more"): on a return visit a scroll down during her entrance,
// by a wheel or a finger's pan, ends her entrance quietly and carries the page to the offer where the live page holds it; nothing pulls him back, nothing is sought, and the scroll is his again
async function reads([W, H], how) {
  const tag = `${W}x${H}`, w = { size: `${tag}, a return visit read on by ${how}` }, p = await page([W, H], { returning: true, touch: how === 'touch' || W < 768 }); out.walks.push(w);
  const ok = (cond, what, detail) => check(cond, `${tag} reads on (${how}): ${what}`, detail);
  const need = (cond, what, detail) => { ok(cond, what, detail); if (!cond) throw new Error(`${tag} reads on (${how}): ${what}`); };
  await toHer(p, need, 2);
  const film0 = await p.js('window.dlTwelve.state()'), y0 = await p.js('Math.round(scrollY)'), OFF = `document.querySelector(${JSON.stringify(READ_ON.to)})`;
  w.before = { beat: await p.js('window.dlAthena.state().seen.beat'), y: y0, offer: await p.js(`${OFF} ? Math.round(${OFF}.getBoundingClientRect().top + scrollY) : null`) };
  const x = Math.round(W / 2), y = Math.round(H / 2);
  if (how === 'wheel') await p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY: 120 });
  else {   // one finger, panned up the screen in steps
    await p.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] });
    for (let k = 1; k <= 6; k++) { await p.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y - 20 * k }] }); await sleep(16); }
    await p.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  }
  const atRest = await still(p);
  w.read = await p.js(`(() => { const o = ${OFF}?.getBoundingClientRect(), intro = document.querySelector('.dl-athena-intro');
    return { top: o ? Math.round(o.top) : null, pad: parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0, y: Math.round(scrollY), intro: !intro || intro.hidden,
      asking: !!window.dlAthena.state().asking, bubble: window.dlAthena.state().bubble ?? null, seen: __walk.seen.map((e) => e.type),
      read: __walk.seen.find((e) => e.type === 'read') ?? null, making: window.DL_HER?.state?.().open ?? null, card: !!window.dlAthenaFilm?.state?.().up,
      router: document.documentElement.dataset.spaceRouter ?? null, herMaking: document.documentElement.dataset.herMaking ?? null }; })()`);
  w.read.shot = await p.shot(`5-read-${how}-${tag}`);
  const moved = how === 'wheel' ? 'wheel down' : 'finger\'s pan up';
  if (w.read.top === null) ok(w.read.y >= y0 && atRest === w.read.y, `a ${moved} leaves the page at rest, never pulled back up; where it lands is not checked: ${READ_ON.to} is not in the live page`, { before: w.before, after: w.read });
  else ok(w.read.y > y0 && Math.abs(w.read.top - w.read.pad) <= 2 && atRest === w.read.y, `a ${moved} lands the page on the offer (${READ_ON.to} at the page's own scroll-padding, ${w.read.pad} px)`, { before: w.before, after: w.read });
  ok(w.read.intro && w.read.read && w.read.read.beat >= 1 && !w.read.seen.some((t) => t === 'landed' || t === 'skipped') && !w.read.asking && w.read.bubble !== 'stop',
    'her entrance ends quietly: her picture gone, her moment "read", no landing, no skip, no question, no stop\'s bubble', { seen: w.read.seen, read: w.read.read, intro: w.read.intro, asking: w.read.asking, bubble: w.read.bubble });
  ok(w.read.making === false && !w.read.card && !w.read.router && w.read.herMaking === 'waiting', 'nothing pulls him back: her making, the governance card and the rebate stay shut, her making left to the kit\'s door',
    { making: w.read.making, card: w.read.card, router: w.read.router, herMaking: w.read.herMaking });
  const film1 = await p.js('window.dlTwelve.state()');
  ok(film1.seeks === film0.seeks && film1.film.paused === film0.film.paused && Math.abs(film1.film.t - film0.film.t) < 0.05 && film1.song.muted === film0.song.muted,
    'the film stands as it stood: nothing sought, the sound as it was (CLAUDE.md, The rule, 8)', { before: filmOf(film0), after: filmOf(film1) });
  if (how === 'wheel') {   // the scroll his again: a wheel of a screen (warm-layout.css snaps the page to its pages, so a shorter one from the hero snaps back to it)
    await p.send('Input.dispatchMouseEvent', { type: 'mouseWheel', x, y, deltaX: 0, deltaY: H }); const y2 = await still(p);
    ok(y2 > w.read.y, 'the scroll is his again: the page reads on under his wheel of a screen', { at: w.read.y, then: y2 });
  }
  ok(p.errs.length === 0, 'no error thrown on the page', p.errs);
  p.close();
}

try {
  for (const size of SIZES) await walk(size).catch((e) => out.errors.push(String(e?.message || e).slice(0, 400)));
  if (SIZES.length) await skips(SIZES[0]).catch((e) => out.errors.push(String(e?.message || e).slice(0, 400)));
  if (SIZES.length) await reads(SIZES[0], 'wheel').catch((e) => out.errors.push(String(e?.message || e).slice(0, 400)));
  if (SIZES.length) await reads(SIZES.at(-1), 'touch').catch((e) => out.errors.push(String(e?.message || e).slice(0, 400)));
  const failed = out.checks.filter((x) => !x.ok).length;
  code = failed || out.errors.length ? 1 : 0; out.pass = code === 0;
  console.log(JSON.stringify(out, null, 1));
  console.log(code === 0 ? `PASS: the skip asks first; her entrance, line by line with no motion graphic but the page's countdown; the letterbox closing where it is seen; on "egg" her egg offered where her hands hold it and held out, the split up behind her and both its plates in the screen and pressable, nothing pressed, at ${SIZES.map((s) => s.join('x')).join(' and ')}; on a return visit no stray press or key skips her, Stay and Esc keep her, Skip ends her as before; a wheel down and a finger's pan up end her quietly, nothing sought` : `FAIL: ${failed} check(s), ${out.errors.length} error(s)`);
} catch (e) {
  out.errors.push(String(e?.message || e).slice(0, 400)); console.log(JSON.stringify(out, null, 1)); code = out.checks.some((x) => !x.ok) ? 1 : 2;
}
end();

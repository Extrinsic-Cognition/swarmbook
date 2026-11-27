#!/usr/bin/env node
// dl-her-colours.proof.mjs: HER COLOURS ON THE MINT, proved in a real browser (dl-her-colours.js; the plan's lane 1 number: a paint made on the site and drawn by
// Harmony, equal part by part). A headless Chrome, off every screen, opens the mint's page (app/warm.html) and:
//   1. on ?her, her making opens and Harmony's renderer draws her bare, out of the box, with her three that carry a wish (HER THREE WISHES, dl-her-wishes.mjs):
//      the nine other chairs empty in her renderer, their ghosts and her three charges beside her, her wish bar three charged of twelve and the fourth pentagon
//      next (his ladder), 3/12, in her eyes' paint, and no shader of theirs refused by the GPU; then (HER WISHES SPENT) each chamber her presses fire spends a
//      wish, the die's four more cross the first rung: the fourth pentagon comes in her slam, its unit1 out of its ghost, 4/12, the count kept beside her refs;
//   2. real presses (CDP Input.dispatchMouseEvent: trusted input, as his hand is) turn the drum to a chamber and shoot the field, then the die paints the rest;
//   3. her renderer (lyssajudron.mjs, its own state().paint) holds exactly the parts the making holds, the browser keeps the same two refs, her-face.js reads
//      them back part by part, and her eyes opened once all six fired;
//   4. on the page as a visitor meets it, her landing opens the making and not the rebate, Continue brings the rebate in ('made', dl-space-router.js) and her
//      picture into the starter kit, drawn (THE PATH TO THE KIT); a skip to the mint keeps her making (THE SKIP KEEPS HER);
//   5. THE SHOT: in a fresh browser each press, drag and release on the field fires, ドン where it was let go, and the drum turns on, forward, to the next bare
//      chamber in the order they fire; on the sixth to the next one; with reduced motion the turn and no ドン.
//   nice -n 19 node app/dl-her-colours.proof.mjs [--url http://127.0.0.1:8977/intro/dyson-society/app/warm.html] [--chrome <path>] [--screenshot <png>]
// The Chrome: --chrome, else $CHROME, else the first of Google Chrome, Google Chrome for Testing and Chromium in /Applications, else the newest Playwright
// Chrome for Testing in this user's cache (as dl-twelve.proof.mjs finds it: the new Mac, where the gate runs, has only that one). Exit 0 on PASS, 1 on
// FAIL, 2 when it could not run. It ends what it started (the Chrome by pid, its profile folder) and gives itself 120 s.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const args = process.argv.slice(2), opt = (n, f) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : f; };
const URL_ = opt('--url', 'http://127.0.0.1:8977/intro/dyson-society/app/warm.html'), SHOT = opt('--screenshot', null);
function chromeOf() {
  const given = opt('--chrome', process.env.CHROME); if (given && fs.existsSync(given)) return given;
  for (const p of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    '/Applications/Chromium.app/Contents/MacOS/Chromium']) if (fs.existsSync(p)) return p;
  const pw = path.join(os.homedir(), 'Library/Caches/ms-playwright');
  const dirs = fs.existsSync(pw) ? fs.readdirSync(pw).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split('-')[1] - +a.split('-')[1]) : [];
  for (const d of dirs) for (const arch of ['chrome-mac-arm64', 'chrome-mac']) { const p = path.join(pw, d, arch, 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'); if (fs.existsSync(p)) return p; }
  return null;
}
const out = { url: URL_, when: new Date().toISOString(), checks: [], errors: [] };
const check = (ok, what, detail) => { out.checks.push({ ok: !!ok, what, ...(detail === undefined ? {} : { detail }) }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`); };
const chrome = chromeOf();
if (!chrome) { console.log(JSON.stringify({ ...out, error: 'no Chrome on this Mac' }, null, 1)); process.exit(2); }
out.chrome = chrome;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'her-colours-proof-')), port = 9500 + Math.floor(Math.random() * 400);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--mute-audio',
  '--hide-scrollbars', '--use-angle=metal', '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
let code = 2;
const end = () => { try { proc.kill('SIGKILL'); } catch {} try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} process.exit(code); };
setTimeout(() => { out.errors.push('120 s passed'); console.log(JSON.stringify(out, null, 1)); end(); }, 120_000).unref();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function page() {   // a fresh tab on the page's own origin, its console's errors kept
  let target = null;
  for (let i = 0; i < 80 && !target; i++) { await sleep(250); try { target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json(); } catch {} }
  if (!target?.webSocketDebuggerUrl) throw new Error('Chrome did not open a tab');
  const ws = new WebSocket(target.webSocketDebuggerUrl); let id = 0; const wait = new Map(), errs = [], said = [];   // said: the console's errors (three.js says a refused shader there)
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); } else if (d.method === 'Runtime.exceptionThrown') errs.push(String(d.params.exceptionDetails?.exception?.description ?? d.params.exceptionDetails?.text).slice(0, 300));
    else if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') said.push(d.params.args.map((x) => String(x.value ?? x.description ?? '')).join(' ').slice(0, 300)); };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('the tab did not answer')); });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable'); await send('Page.enable');
  const js = async (expression) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text); return r.result?.result?.value; };
  const press = async (x, y) => { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1 }); };
  const until = async (expression, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await js(expression).catch(() => false)) return true; await sleep(200); } return false; };
  return { send, js, press, until, errs, said, close: () => { try { ws.close(); } catch {} } };
}
const centre = (sel) => `(() => { const r = document.querySelector(${JSON.stringify(sel)})?.getBoundingClientRect(); return r ? [r.left + r.width / 2, r.top + r.height / 2] : null; })()`;

try {
  // 1-3: her making on ?her, painted by real presses and the die, drawn as kept
  const a = await page(), sep = URL_.includes('?') ? '&' : '?';
  await a.send('Page.navigate', { url: `${URL_}${sep}her` });
  const drawn = await a.until('!!(window.DL_HER && DL_HER.state().her && DL_HER.state().her.paint)', 30000);
  check(drawn, 'on ?her her making opens and Harmony\'s renderer draws her');
  if (!drawn) throw new Error(`her renderer did not draw: ${JSON.stringify(await a.js('window.DL_HER ? DL_HER.state() : null').catch(() => null))}`);
  const bare = await a.js(`(async () => { const L = await import('./dl-her-colours.mjs'), s = DL_HER.state(); return { her: s.her.paint, form: s.her.form ?? null, bare: { ...L.BARE }, whole: s.whole }; })()`);
  check(JSON.stringify(bare.her) === JSON.stringify(bare.bare) && bare.form === null && !bare.whole, 'out of the box she is bare white vinyl, her eyes shut, not whole', bare);
  // HER THREE WISHES (his Oct 29 2026 17:29 UTC: "you should make that it starts with 3, the ones you can see that have a "wish charge" in them")
  await sleep(600);   // a few of her frames with the ghosts and the charges in them: a shader the GPU refused says so in the console by now
  const wish = await a.js(`(() => { const s = DL_HER.state(), bar = document.querySelector('.dl-her-wishes');
    return { drawn: s.wishes.drawn, placed: s.her.placed, eye: bar ? getComputedStyle(bar).getPropertyValue('--eye').trim().toUpperCase() : null, eyes: s.st.parts.eyes,
      slots: [...document.querySelectorAll('.dl-her-slot')].map((e) => ['charged', 'spent', 'next', 'empty'].find((c) => e.classList.contains(c))?.[0] ?? '?').join(''), count: document.querySelector('.dl-her-count')?.textContent ?? null }; })()`);
  const gone = Object.entries(wish.placed || {}).filter(([, x]) => x === 'gone').map(([k]) => +k).sort((x, y) => x - y);
  check(JSON.stringify(gone) === '[3,4,5,6,7,8,9,10,11]' && JSON.stringify(wish.drawn) === JSON.stringify({ seats: [0, 1, 2], lit: [0, 1, 2], ghosts: 9, charges: 3, pentagons: 0, why: null }),
    'she starts with her three that carry a wish: the nine other chairs empty in her renderer, their ghosts and her three charges beside her', { gone, drawn: wish.drawn });
  check(wish.slots === 'cccneeeeeeee' && wish.count === '3/12' && wish.eye === wish.eyes, 'her wish bar: three charged of twelve, the fourth pentagon next, 3/12, her charges in her eyes\' paint',
    { slots: wish.slots, count: wish.count, eye: wish.eye, eyes: wish.eyes });
  check(!a.said.some((e) => /Shader Error|WebGLProgram|VALIDATE_STATUS|WebGL: /.test(e)), 'the GPU took every shader she is drawn with, her ghosts\' and her charges\' too', a.said.slice(0, 3));
  const field = await a.js(`(() => { const r = document.querySelector('.dl-her-field').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; })()`);
  await a.press(field[0] + field[2] * .58, field[1] + field[3] * .5);   // her light: a hue on the field; its release turns the drum on to her porcelain (THE SHOT)
  await sleep(250);
  await a.press(...(await a.js(centre('.dl-her-part[data-part="base"]'))));   // her porcelain's chamber pressed: it stays under the hammer
  await sleep(600);
  await a.press(field[0] + field[2] * .12, field[1] + field[3] * .3);   // and the field paints it
  await sleep(250);
  const shot = await a.js(`(() => { const s = DL_HER.state(); return { sel: s.sel, turn: s.turn, light: s.st.light, base: s.st.parts.base, painted: s.st.painted }; })()`);
  check(shot.sel === 'coat' && shot.turn === 2 && !!shot.light && shot.painted.includes('base') && shot.base !== '#F3F3F0',
    'a press on the field paints the chamber under the hammer, and each release turns the drum on to the next bare one', shot);
  const bar = `[...document.querySelectorAll('.dl-her-slot')].map((e) => ['charged', 'spent', 'next', 'empty'].find((c) => e.classList.contains(c))?.[0] ?? '?').join('')`;
  const two = await a.js(`({ slots: ${bar}, spent: DL_HER.state().wishes.spent, lit: DL_HER.state().wishes.drawn.lit })`);
  check(two.slots === 'sscneeeeeeee' && two.spent === 2 && JSON.stringify(two.lit) === '[2]', 'two chambers fired by his presses: two wishes spent, their slots dimmed and their halos out', two);
  await a.press(...(await a.js(centre('.dl-her-tool'))));   // ⚄
  await sleep(250);
  const don = await a.js(`(() => { const m = document.querySelector('.dl-her-slam'), f = m && getComputedStyle(m.querySelector('.dl-her-slam-sfx')); return { on: !!m?.classList.contains('on'), sfx: m?.textContent, opacity: f ? +f.opacity : null, anim: f?.animationName ?? null }; })()`);
  if (SHOT) { const s1 = await a.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(SHOT.replace(/\.png$/, '') + '-slam.png', Buffer.from(s1.result.data, 'base64')); }
  await sleep(950);
  const four = await a.js(`(async () => { const s = DL_HER.state(), W = await import('./dl-her-wishes.mjs');
    return { slots: ${bar}, count: document.querySelector('.dl-her-count')?.textContent, spent: s.wishes.spent, slams: s.wishes.slams, drawn: s.wishes.drawn, kept: W.kept(localStorage),
      gone: Object.entries(s.her.placed || {}).filter(([, x]) => x === 'gone').map(([k]) => +k).sort((x, y) => x - y) }; })()`);
  check(don.on && don.sfx === 'ドン' && don.anim === 'dl-her-don' && don.opacity > .5, 'the die crosses her first rung: her entrance\'s slam over her, ドン', don);
  check(four.slots === 'ssscneeeeeee' && four.count === '4/12' && four.spent === 6 && four.slams === 1 && four.kept === 6, 'the fourth pentagon came with four wishes, three spent by the die: 4/12, the count kept beside her refs', four);
  check(JSON.stringify(four.gone) === '[4,5,6,7,8,9,10,11]' && JSON.stringify(four.drawn) === JSON.stringify({ seats: [0, 1, 2, 3], lit: [3], ghosts: 8, charges: 1, pentagons: 1, why: null }),
    'on her: the fourth unit1 out of its ghost with its pentagon on it, its halo the one lit', { gone: four.gone, drawn: four.drawn });
  const v = await a.js(`(async () => { const L = await import('./dl-her-colours.mjs'), s = DL_HER.state(), kept = JSON.parse(localStorage.getItem(L.KEEP_KEY) || 'null');
    return { st: s.st, whole: s.whole, her: s.her.paint, form: s.her.form ?? null, kept, faceParts: kept && globalThis.HER_FACE.paintOf(kept.paint), faceLight: kept && globalThis.HER_FACE.lightOf(kept.light),
      go: document.querySelector('.dl-her-go').disabled, eye: getComputedStyle(document.querySelector('.dl-her-wishes')).getPropertyValue('--eye').trim().toUpperCase() }; })()`);
  check(v.whole && !v.go, 'the die fires all six: she is whole and Continue opens', { whole: v.whole, disabled: v.go });
  check(JSON.stringify(v.her) === JSON.stringify(v.st.parts), 'her renderer holds exactly the parts the making holds, part by part', { her: v.her, making: v.st.parts });
  check(v.kept && JSON.stringify(v.faceParts) === JSON.stringify(v.st.parts) && v.faceLight === v.st.light, 'the browser keeps her two refs and her-face.js reads them back, part by part, her light too',
    { kept: v.faceParts, light: v.faceLight });
  check(v.form === 'bare', 'her eyes opened once all six fired (Harmony\'s climax)', { form: v.form });
  check(v.eye === v.st.parts.eyes && v.eye !== bare.bare.eyes, 'her eyes painted, her charges on the wish bar take their paint', { eye: v.eye, eyes: v.st.parts.eyes });
  if (SHOT) { const s = await a.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(SHOT, Buffer.from(s.result.data, 'base64')); out.screenshot = SHOT; }
  out.errors.push(...a.errs.filter((e) => /dl-her|lyssajudron|her-face/.test(e))); a.close();
  // 4: the page as a visitor meets it: her landing, the making, Continue, the choice; and the skip
  const b = await page();
  await b.send('Page.navigate', { url: URL_ });
  await b.until('!!window.DL_HER', 20000);
  const flow = await b.js(`(async () => { const z = (ms) => new Promise((r) => setTimeout(r, ms)), gold = () => !!document.querySelector('.dl-router'), o = {};
    o.before = { making: document.documentElement.dataset.herMaking, gold: gold() };
    document.dispatchEvent(new CustomEvent('dl-athena', { detail: { type: 'landed', at: Date.now() } })); await z(900);
    o.landed = { open: DL_HER.state().open, reason: DL_HER.state().reason, gold: gold() }; return o; })()`);
  check(flow.before.making === 'waiting' && !flow.before.gold, 'her making claims the landing before it comes', flow.before);
  check(flow.landed.open && flow.landed.reason === 'stop' && !flow.landed.gold, 'her landing opens her making, and not the rebate', flow.landed);
  const back = await b.js(`({ count: document.querySelector('.dl-her-count')?.textContent, spent: DL_HER.state().wishes.spent, slams: DL_HER.state().wishes.slams })`);
  check(back.count === '4/12' && back.spent === 6 && back.slams === 0, 'a visitor who comes back stands on the rung they reached: 4/12, no slam for it again', back);
  await b.until('!!(DL_HER.state().her)', 20000);
  await b.press(...(await b.js(centre('.dl-her-tool')))); await sleep(700);
  await b.press(...(await b.js(centre('.dl-her-go')))); await sleep(1200);
  const made = await b.js(`({ open: DL_HER.state().open, making: document.documentElement.dataset.herMaking, gold: !!document.querySelector('.dl-router.on'), layer: !!document.querySelector('.dl-her') })`);
  check(!made.open && made.making === 'made' && made.gold && !made.layer, 'Continue: she is made, the rebate slams in, her layer and its canvas are gone', made);
  // THE PATH TO THE KIT: her picture, from her renderer's canvas at Continue, stands in the starter kit as Your Swarmy, and it is her (neither empty nor flat)
  const pic = await b.js(`(async () => { const img = document.querySelector('[data-kit-her]'); await img.decode?.().catch(() => {}); const c = document.createElement('canvas');
    c.width = img.naturalWidth; c.height = img.naturalHeight; const g = c.getContext('2d'); g.drawImage(img, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data, shades = new Set(); let lit = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i + 3] > 8) { lit++; shades.add(((d[i] >> 4) << 8) | ((d[i + 1] >> 4) << 4) | (d[i + 2] >> 4)); }
    return { hidden: img.hidden, src: img.src.slice(0, 5), w: img.naturalWidth, lit: +(lit / (d.length / 4)).toFixed(3), shades: shades.size, kept: localStorage.getItem((await import('./dl-her-colours.mjs')).KEEP_KEY)?.includes('blob:') ?? false }; })()`);
  check(!pic.hidden && pic.src === 'blob:' && pic.w === 640 && pic.lit > .03 && pic.lit < .97 && pic.shades >= 24 && !pic.kept, 'her picture stands in the kit, drawn, kept for the visit only', pic);
  b.close();
  const c = await page();
  await c.send('Page.navigate', { url: URL_ });
  await c.until('!!window.DL_HER', 20000);
  const skip = await c.js(`(async () => { document.dispatchEvent(new CustomEvent('dl-skip-to-mint')); document.dispatchEvent(new CustomEvent('dl-athena', { detail: { type: 'landed', at: Date.now() } }));
    await new Promise((r) => setTimeout(r, 900)); return { making: document.documentElement.dataset.herMaking, open: DL_HER.state().open, gold: !!document.querySelector('.dl-gold') }; })()`);
  // THE SKIP KEEPS HER (his Oct 29 2026 16:2x UTC: "skips past the coloring phase of the lyssajudron"): after a skip, her landing opens her making as for everyone
  check(skip.making !== 'skipped' && skip.open, 'a skip to the mint: her making opens on her landing, the choice after it', skip);
  c.close();
  // 5: THE SHOT (his Oct 30 2026 04:00:16 UTC: "u lost the fucking gun effect that moves to next component to be colored on every one i let go of")
  const d = await page();
  await d.send('Page.navigate', { url: URL_ }); await d.until('!!window.DL_HER', 20000);
  await d.js('localStorage.clear()');   // a visitor who has not made her yet
  await d.send('Page.navigate', { url: `${URL_}${sep}her` });
  await d.until('!!(window.DL_HER && DL_HER.state().open && DL_HER.state().her)', 30000); await sleep(600);
  const fb = await d.js(`(() => { const r = document.querySelector('.dl-her-field').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; })()`);
  const drag = async (u0, v0, u1, v1) => {   // a press, a drag and a release on the field, trusted input as his hand is
    const x0 = fb[0] + fb[2] * u0, y0 = fb[1] + fb[3] * v0, x1 = fb[0] + fb[2] * u1, y1 = fb[1] + fb[3] * v1, mouse = (type, x, y, buttons) => d.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons, clickCount: 1 });
    await mouse('mouseMoved', x0, y0, 0); await mouse('mousePressed', x0, y0, 1);
    for (const t of [.35, .7, 1]) await mouse('mouseMoved', x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, 1);
    await mouse('mouseReleased', x1, y1, 0); return [x1, y1];
  };
  const after = `(() => { const s = DL_HER.state(), b = [...document.querySelectorAll('.dl-her-bang')].at(-1), r = b?.getBoundingClientRect(), g = document.createRange(); if (b) g.selectNodeContents(b);
    const t = b && g.getBoundingClientRect();
    return { sel: s.sel, turn: s.turn, bangs: s.bangs, spent: s.wishes.spent, whole: s.whole, cyl: document.querySelector('.dl-her-cyl').style.getPropertyValue('--turn'),
      don: b ? { text: b.textContent, at: [r.left, r.top], word: [t.left + t.width / 2, t.top + t.height / 2], anim: getComputedStyle(b).animationName } : null, burst: !!document.querySelector('.dl-her-bang-at') }; })()`;
  const shots = [];
  for (let k = 0; k < 6; k++) {
    const at = await drag(.14 + .13 * k, .3, .2 + .13 * k, .62), s = await d.js(after); shots.push({ ...s, released: at });
    if (k === 0 && SHOT) { const s1 = await d.send('Page.captureScreenshot', { format: 'png' }); fs.writeFileSync(SHOT.replace(/\.png$/, '') + '-shot.png', Buffer.from(s1.result.data, 'base64')); }
    await sleep(520);   // the drum's turn (420 ms)
  }
  const want = ['base', 'coat', 'gold', 'thruster', 'eyes', 'light'], near = (p, q, px) => p && q && Math.hypot(p[0] - q[0], p[1] - q[1]) <= px;
  check(shots.every((s, k) => s.sel === want[k] && s.turn === k + 1 && s.cyl === `${-60 * (k + 1)}deg`),
    'each release turns the drum one chamber forward to the next bare one in the order they fire, and the sixth on to the next', shots.map((s) => [s.sel, s.turn, s.cyl]));
  check(shots.every((s, k) => s.bangs === k + 1 && s.don?.text === 'ドン' && s.don.anim === 'dl-her-bang' && s.burst && near(s.don.at, s.released, 2) && near(s.don.word, s.released, 16)),
    'each release fires: ドン where it was let go, in her slam\'s grammar', shots.map((s) => ({ released: s.released.map(Math.round), at: s.don?.at.map(Math.round), word: s.don?.word.map(Math.round) })));
  check(shots.every((s, k) => s.spent === k + 1) && shots[5].whole, 'each chamber\'s first colour spent one wish and the turns none; her six fired, she is whole', shots.map((s) => s.spent));
  const angle = await d.js(`(() => { const m = new DOMMatrix(getComputedStyle(document.querySelector('.dl-her-cyl')).transform); return Math.round(Math.atan2(m.b, m.a) * 180 / Math.PI); })()`);
  check(angle === 0, 'the drum stands a whole turn on: -360 deg, at rest', { angle });
  await d.send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] }); await sleep(400);
  await drag(.5, .4, .6, .5); const still = await d.js(after);
  check(still.sel === 'base' && still.turn === 7 && still.bangs === 6 && !still.don && still.spent === 6, 'with reduced motion a release turns the drum and fires no ドン; her painted light spends no wish',
    { sel: still.sel, turn: still.turn, bangs: still.bangs, don: still.don, spent: still.spent });
  out.errors.push(...d.errs.filter((e) => /dl-her|lyssajudron|her-face/.test(e))); d.close();
  const failed = out.checks.filter((x) => !x.ok).length;
  code = failed || out.errors.length ? 1 : 0; out.pass = code === 0;
  console.log(JSON.stringify(out, null, 1));
  console.log(code === 0 ? 'PASS: a paint made on the mint is drawn by Harmony\'s renderer and kept for the key, part by part' : `FAIL: ${failed} check(s), ${out.errors.length} error(s)`);
} catch (e) {
  out.errors.push(String(e?.message || e).slice(0, 400)); console.log(JSON.stringify(out, null, 1)); code = out.checks.some((x) => !x.ok) ? 1 : 2;
}
end();

#!/usr/bin/env node
// dl-warm-words.proof.mjs: THE PAGE SAYS $WARM, NEVER THE MINT (lane/clear-the-mint; his Oct 30 2026 UTC, 03:18:17: "i am left at a page where people mint
// shit dude"; 03:21:04 his click "Yes, clear it" on "Clear the old NFT mint off the page and make it the $WARM launch page?"). A headless Chrome, off every
// screen, opens the page (app/warm.html) at each size and reads every word a visitor can meet on it, at each moment of the walk, by trusted presses only
// (CDP Input.dispatchMouseEvent, as his hand is):
//   1. the film playing, its own skip standing on it;
//   2. the skip pressed: her question; answered Skip: her entrance with her own Skip, her landing, her making;
//   3. coloured and Continue: the rebate; JOIN THE $WARM: the kit, and under it the window's line at the offer's footer, counting $WARM's days to the close
//      (THE WINDOW COUNTS DOWN, his Oct 30 2026 03:58:31 UTC click "Show the countdown"): "$WARM · N days left", N the days to MINT_CLOSES;
//   4. each chapter of the swarm's rite pressed in turn; the free way pressed; every word her topics can say (dl-athena.js TOPICS, each topic's line, its
//      questions and answers and its doors, read from the page as it then stands);
//   5. presses on the film's stage (the faces of the dodecahedron): whatever opens is read; the legacy reservation slot (#slot-dialog) never opens, and the
//      page has no door to it;
//   6. the app's own entry (?from=harmony).
// A word is every text the page renders (an element not display:none, not visibility:hidden: Element.checkVisibility; a word fading in is read before it
// has), with every aria-label, title, alt and placeholder, ::before and ::after content, an SVG's title and desc, the tab's title and the link preview's
// words. Text a canvas draws is pixels, not words: it is not read here. FAIL when any word says mint (minted, pre-mint, ...), NFT, Augur (capital A: the
// pass; the founding corpus) or Bronze; or the walk falls; or the page throws.
//   nice -n 19 node app/dl-warm-words.proof.mjs [--url <the page>] [--sizes 1440x900,390x844] [--chrome <path>]
// The Chrome: as dl-red-road.proof.mjs finds it. Exit 0 on PASS, 1 on FAIL, 2 when it could not run. After MINT_CLOSES the film has no skip and no
// stop: steps 1 to 3 are not walked, the rest is read. It ends what it started (the Chrome by pid, its profile folder) and gives itself 420 s.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { MINT_CLOSES } from './dl-paywall.js';

const args = process.argv.slice(2), opt = (n, f) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : f; };
const URL_ = opt('--url', 'http://127.0.0.1:8977/intro/dyson-society/app/warm.html');
const SIZES = opt('--sizes', '1440x900,390x844').split(',').map((s) => s.split('x').map(Number)).filter(([w, h]) => w > 0 && h > 0);
const OPEN = !(Date.now() >= Date.parse(MINT_CLOSES));   // the window: the film's skip and its stop stand until it closes
/** Whether a word says the old mint: mint (minted, minting, pre-mint), NFT, Augur (the pass), Bronze. */
const saysTheMint = (t) => /\bmint/i.test(t) || /\bnft/i.test(t) || /\bAugur/.test(t) || /\bbronze/i.test(t);
function chromeOf() {
  const given = opt('--chrome', process.env.CHROME); if (given && fs.existsSync(given)) return given;
  for (const p of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    '/Applications/Chromium.app/Contents/MacOS/Chromium']) if (fs.existsSync(p)) return p;
  const pw = path.join(os.homedir(), 'Library/Caches/ms-playwright');
  const dirs = fs.existsSync(pw) ? fs.readdirSync(pw).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split('-')[1] - +a.split('-')[1]) : [];
  for (const d of dirs) for (const arch of ['chrome-mac-arm64', 'chrome-mac']) { const p = path.join(pw, d, arch, 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'); if (fs.existsSync(p)) return p; }
  return null;
}
const out = { url: URL_, when: new Date().toISOString(), open: OPEN, walks: [], checks: [], errors: [] };
const check = (ok, what, detail) => { out.checks.push({ ok: !!ok, what, ...(detail === undefined ? {} : { detail }) }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`); };
const chrome = chromeOf();
if (!chrome) { console.log(JSON.stringify({ ...out, error: 'no Chrome on this Mac' }, null, 1)); process.exit(2); }
out.chrome = chrome;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'warm-words-proof-')), port = 9500 + Math.floor(Math.random() * 400);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--mute-audio',
  '--hide-scrollbars', '--use-angle=metal', '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
let code = 2;
const end = () => { try { proc.kill('SIGKILL'); } catch {} try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} process.exit(code); };
setTimeout(() => { out.errors.push('420 s passed'); console.log(JSON.stringify(out, null, 1)); end(); }, 420_000).unref();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// every word the page renders now: {t, at, kind}
const READ = `(() => {
  const words = [], shown = (el) => !!el && el.checkVisibility({ visibilityProperty: true });
  const where = (el) => { const parts = []; for (let e = el; e && e !== document.body && e !== document.documentElement && parts.length < 3; e = e.parentElement)
    parts.unshift(e.id ? '#' + e.id : e.tagName.toLowerCase() + (typeof e.className === 'string' && e.className.trim() ? '.' + e.className.trim().split(/\\s+/)[0] : '')); return parts.join(' > ') || 'document'; };
  const add = (text, el, kind) => { const t = String(text ?? '').replace(/\\s+/g, ' ').trim(); if (t) words.push({ t, at: where(el), kind }); };
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const el = n.parentElement; if (!el || ['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE'].includes(el.tagName)) continue;
    const svg = el.closest('svg'), named = svg && /^(title|desc)$/i.test(el.localName);
    if (named ? shown(svg) : shown(el)) add(n.data, el, named ? 'svg-' + el.localName : 'text');
  }
  for (const el of document.body.querySelectorAll('*')) {
    if (!shown(el)) continue;
    for (const a of ['aria-label', 'title', 'alt', 'placeholder', 'aria-description', 'aria-roledescription']) if (el.hasAttribute(a)) add(el.getAttribute(a), el, a);
    if (el.localName === 'input' && /^(button|submit|reset)$/i.test(el.type)) add(el.value, el, 'value');
    for (const p of ['::before', '::after']) { const c = getComputedStyle(el, p).content; if (c && c !== 'none' && c !== 'normal') add(c.replace(/^"|"$/g, ''), el, p); }
  }
  add(document.title, document.documentElement, 'tab');
  for (const m of document.querySelectorAll('meta[name=description], meta[property^="og:"], meta[name^="twitter:"]')) if (!/^https?:/.test(m.content)) add(m.content, document.documentElement, 'preview');
  return words;
})()`;
// every word her topics can say on the page as it stands: each topic's line, its questions and their answers, its doors (dl-athena.js TOPICS, the module the page loaded)
const HERS = `(async () => {
  const src = performance.getEntriesByType('resource').map((e) => e.name).find((n) => /\\/dl-athena\\.js(\\?|$)/.test(n)); if (!src) return null;
  const { TOPICS, ASK } = await import(src), words = [], add = (t, at) => { t = String(t ?? '').replace(/\\s+/g, ' ').trim(); if (t) words.push({ t, at, kind: 'her' }); };
  for (const k of TOPICS) { let s = null; try { s = k.say(document); } catch (e) { add('(her topic threw: ' + e.message + ')', k.id); continue; }
    add(s.line, k.id); for (const [q, a] of s.ask ?? []) { add(q, k.id); add(a, k.id); } for (const d of s.doors ?? []) add(d.label, k.id); }
  for (const v of Object.values(ASK ?? {})) if (typeof v === 'string') add(v, 'ask');
  return words;
})()`;

async function page() {   // a fresh tab, its thrown errors and its console's errors kept
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
  const js = async (expression) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text); return r.result?.result?.value; };
  const until = async (expression, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await js(expression).catch(() => false)) return true; await sleep(200); } return false; };
  // a trusted press at the centre of what `sel` names, once it is in sight (brought there at once, never by the page's smooth scroll) and nothing covers it
  const press = async (sel, at = [.5, .5]) => {
    const where = await js(`(async () => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null;
      const r0 = e.getBoundingClientRect(); if (r0.top < 0 || r0.bottom > innerHeight) e.scrollIntoView({ block: 'center', inline: 'nearest', behavior: 'instant' });
      await new Promise((f) => requestAnimationFrame(() => requestAnimationFrame(f)));
      const r = e.getBoundingClientRect(), x = r.left + r.width * ${at[0]}, y = r.top + r.height * ${at[1]}, hit = document.elementFromPoint(x, y);
      return { x, y, on: !!hit && (hit === e || e.contains(hit)), hit: hit ? hit.tagName + '.' + hit.className : null }; })()`);
    if (!where?.on) return where;
    await tap(where.x, where.y);
    return where;
  };
  const tap = async (x, y) => { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1 }); };
  return { send, js, until, press, tap, errs, said, close: () => { try { ws.close(); } catch {} } };
}

async function walk([W, H]) {
  const tag = `${W}x${H}`, w = { size: tag, moments: [] }, p = await page(), words = new Map(); out.walks.push(w);
  const ok = (cond, what, detail) => check(cond, `${tag}: ${what}`, detail);
  const need = (cond, what, detail) => { ok(cond, what, detail); if (!cond) throw new Error(`${tag}: ${what}`); };   // the walk goes no further than its first fall
  const read = async (moment, expr = READ) => {   // the words of this moment, each kept once with the first moment that showed it
    const got = (await p.js(expr)) ?? []; w.moments.push({ moment, words: got.length });
    for (const x of got) if (!words.has(x.t)) words.set(x.t, { ...x, moment });
  };
  await p.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
  await p.send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__walk = { seen: [], dialogs: [] };
    for (const m of ['show', 'showModal']) { const f = HTMLDialogElement.prototype[m]; HTMLDialogElement.prototype[m] = function (...a) { __walk.dialogs.push(this.id || '?'); return f.apply(this, a); }; }
    document.addEventListener('dl-athena', (e) => { let d = {}; try { d = JSON.parse(JSON.stringify(e.detail || {})); } catch {} __walk.seen.push({ ...d, s: +(performance.now() / 1000).toFixed(2) }); });` });
  await p.send('Page.navigate', { url: URL_ });
  if (OPEN) {
    // 1. the film plays, its skip standing on it
    const skippable = await p.until(`(() => { const b = document.querySelector('[data-twelve-skip]'), f = window.dlTwelve?.state?.().film; if (!b || b.hidden || !f) return false;
      const r = b.getBoundingClientRect(); return r.width > 0 && r.height > 0 && f.ready >= 3 && !f.paused && f.t > 2; })()`, 45000);
    need(skippable, 'the film plays and its skip stands on it');
    await read('the film'); w.said = { skip: await p.js(`document.querySelector('[data-twelve-skip]').textContent`) };
    // 2. the skip pressed: her question, read, answered Skip; her entrance, her own Skip, her landing, her making
    w.skip = await p.press('[data-twelve-skip]');
    need(w.skip?.on && await p.until('!!window.dlAthena?.state?.().asking', 3000), 'the skip, pressed by a trusted press, asks her question', w.skip);
    await read('her question'); w.said.question = await p.js(`document.getElementById('dl-athena-ask-q')?.textContent ?? null`);
    w.asked = await p.press('.dl-athena-ask [data-ask="skip"]');
    need(w.asked?.on, 'her question answered Skip', w.asked);
    if (await p.until(`__walk.seen.some((e) => e.type === 'entered') && !document.querySelector('.dl-athena-skip')?.hidden`, 60000)) { await read('her entrance'); w.said.herSkip = await p.js(`document.querySelector('.dl-athena-skip').textContent`); }
    need(await p.until(`__walk.seen.some((e) => e.type === 'landed')`, 90000), 'her entrance plays and she lands', await p.js('__walk.seen'));
    need(await p.until('!!(window.DL_HER && DL_HER.state().open && DL_HER.state().her)', 30000), 'her landing opens her making');
    await read('her making');
    // 3. coloured, Continue: the rebate; JOIN THE $WARM: the kit
    await p.press('.dl-her-field', [.62, .45]); await sleep(300); await p.press('.dl-her-tool'); await sleep(1200);
    w.go = await p.press('.dl-her-go');
    need(w.go?.on && await p.until(`!!document.querySelector('.dl-router.on')`, 8000), 'coloured, Continue: the rebate slams in', w.go);
    await p.until(`getComputedStyle(document.querySelector('.dl-router-down .cry')).opacity === '1'`, 5000);
    await read('the rebate');
    w.join = await p.press('.dl-router-down');
    need(w.join?.on, 'JOIN THE $WARM, pressed by a trusted press', w.join);
    await sleep(2500);
    await read('the kit');
    w.countdown = await p.js(`(() => { const e = document.querySelector('[data-mint-line]'); return e ? { text: e.textContent, footer: !!e.closest('.snowtrace-offer-footer'),
      shown: e.checkVisibility({ visibilityProperty: true }) && e.getBoundingClientRect().height > 0, now: Date.now() } : null; })()`);
    const left = w.countdown ? Math.ceil((Date.parse(MINT_CLOSES) - w.countdown.now) / 86400000) : null, says = (n) => `$WARM \u00b7 ${n} day${n === 1 ? '' : 's'} left`;
    ok(w.countdown?.shown && w.countdown.footer && [says(left), says(left + 1)].includes(w.countdown.text), `the window counts down at the offer's footer: "${says(left)}"`, w.countdown);
  } else await sleep(6000);
  // 4. the swarm's rite, chapter by chapter; the free way; every word of her topics
  for (let k = 0; k < 4; k++) { const hit = await p.press(`[data-swx-chapter="${k}"]`); ok(hit?.on, `the rite's chapter ${k + 1} pressed`, hit); await sleep(500); await read(`the rite, chapter ${k + 1}`);
    if (k === 1) (w.said ??= {}).chapter = await p.js(`[...document.querySelectorAll('[data-swx-chapter="1"], [data-swx-copy="1"] h3, [data-swx-announcement], .swx-pass strong')].map((e) => e.textContent.trim())`); }
  const not = await p.press('[data-paywall-not]'); ok(not?.on, 'the free way pressed', not); await sleep(300); await read('the free way');
  const hers = await p.js(HERS); ok(Array.isArray(hers) && hers.length > 0, 'her topics read', hers?.length);
  for (const x of hers ?? []) if (!words.has(x.t)) words.set(x.t, { ...x, moment: 'her topics' });
  // 5. presses on the film's stage: on the faces of the dodecahedron, and whatever opens is read, then closed
  await p.js(`document.getElementById('oath-sphere').scrollIntoView({ block: 'start', behavior: 'instant' })`); await sleep(600);
  const stage = await p.js(`(() => { const r = document.getElementById('sphere-stage').getBoundingClientRect(); return [r.left, r.top, r.width, r.height]; })()`);
  w.stage = [];
  for (const [fx, fy] of [[.5, .5], [.42, .4], [.58, .6], [.38, .62], [.62, .38]]) {
    const x = stage[0] + stage[2] * fx, y = Math.max(4, Math.min(H - 4, stage[1] + stage[3] * fy));
    await p.tap(x, y); await sleep(700);
    const opened = await p.js(`[...document.querySelectorAll('dialog[open]')].map((d) => d.id)`);
    w.stage.push({ at: [Math.round(x), Math.round(y)], opened });
    await read(`a press on the stage at ${fx},${fy}`);
    await p.js(`for (const d of document.querySelectorAll('dialog[open]')) d.close(); document.getElementById('face-note').hidden = true; document.getElementById('arrival-receipt').hidden = true;`);
  }
  ok(true, 'the stage pressed at five places', w.stage);
  // THE LEGACY RESERVATION SLOT, KEPT OFF: its old door, if the page still has one, pressed and read; then, over the whole walk, the slot never opened
  if (await p.js(`!!document.querySelector('[data-mint-holder]')`)) { w.holder = await p.press('[data-mint-holder]'); await sleep(700); await read('the holder\'s road');
    await p.js(`for (const d of document.querySelectorAll('dialog[open]')) d.close();`); }
  w.dialogs = await p.js('__walk.dialogs');
  ok(!w.dialogs.includes('slot-dialog') && !w.holder, 'the legacy reservation slot: no door to it on the page, and it never opened', { dialogs: w.dialogs, holder: w.holder ?? null });
  w.consoleErrors = p.said;
  ok(p.errs.length === 0, 'no error thrown on the page', p.errs);
  // 6. the app's own entry
  const harmony = new URL(URL_); harmony.searchParams.set('from', 'harmony');
  await p.send('Page.navigate', { url: harmony.href });
  await p.until(`document.documentElement.dataset.entry === 'harmony' && document.readyState === 'complete'`, 15000); await sleep(1500);
  await read('the app\'s entry');
  // the verdict: every word read, none of them the old mint
  const all = [...words.values()], bad = all.filter((x) => saysTheMint(x.t));
  w.read = all.length; w.mint = bad;
  ok(bad.length === 0, `${all.length} words read: none says mint, NFT, Augur or Bronze`, bad.map((x) => `${x.moment} · ${x.at} · ${x.kind}: ${x.t.slice(0, 160)}`));
  p.close();
}

try {
  for (const size of SIZES) await walk(size).catch((e) => out.errors.push(String(e?.message || e).slice(0, 400)));
  const failed = out.checks.filter((x) => !x.ok).length;
  code = failed || out.errors.length ? 1 : 0; out.pass = code === 0;
  console.log(JSON.stringify(out, null, 1));
  console.log(code === 0 ? `PASS: every word of the page read at ${SIZES.map((s) => s.join('x')).join(' and ')}, none of them the old mint` : `FAIL: ${failed} check(s), ${out.errors.length} error(s)`);
} catch (e) {
  out.errors.push(String(e?.message || e).slice(0, 400)); console.log(JSON.stringify(out, null, 1)); code = out.checks.some((x) => !x.ok) ? 1 : 2;
}
end();

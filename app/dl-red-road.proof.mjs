#!/usr/bin/env node
// dl-red-road.proof.mjs: THE HEXAGON PATH, red's road from her offer, walked in a real browser by real presses (dl-hexagon.js, lane/the-hexagon-path: his Nov 22 2026 words there,
// "you cant compare the quality of the pentagon path vs this hexagon path... it is so fucking suboptimal dude", then "Yes, build it"). It was dl-path-to-the-kit.proof.mjs, THE PATH TO
// THE KIT (her making on her landing, Continue, the rebate, JOIN THE $WARM to the kit): that road left the page when her egg came to wait for the mint, so this one walks the road that
// stands. A headless Chrome, off every screen, opens the mint's page (app/warm.html) at each size (under 768 px wide with touch emulated) and, by trusted presses only (CDP
// Input.dispatchMouseEvent, as his hand is, each once nothing covers its target):
//   1. the film's own skip ([data-twelve-skip]), its question answered Skip, and her entrance to "Take this egg.": her egg offered, the split up behind her (dl-athena-entrance.proof.mjs
//      reads that road line by line);
//   2. a press on the red plate (a.dl-flask-plate[data-side="flask"]): the path's stages go, in, deep, her (window.dlHexagon), each on its time (PRESS, DIVE) and none sooner; her making
//      open in the hexagon, nothing made yet, the page where it was;
//   3. the die (the first .dl-her-tool) colours her: her state another, all of her painted, and Enter the world (.dl-her-go) opens;
//   4. Enter the world: the stage world at once, then rest; her face on the opened ball (END), nothing made and no freeze after it, the page given back;
//   5. the two plates: her face on X, X's own compose door (INTENT, in a tab of the visitor's: never pressed here, it leaves the house) whose text is her link, read back by fromHerLink
//      (dl-her-reel.mjs) to her colours; the ride, standing: on a Mac with no touch the download the release names for it, any address one the release names, no address a plate with no door (aria-disabled, or a span; a phone) (nestos-release.json);
//   the page's own film and song never sought, played or paused on the way (CLAUDE.md, The rule, 8), and the page throws no error.
//   nice -n 19 node app/dl-red-road.proof.mjs [--url <the page>] [--sizes 1440x900,390x844] [--chrome <path>] [--shots <folder>]
// The split stands only while the deposit door is live (dl-paywall.css): served with no deposit door answering, the walk stops at the offer.
// The Chrome: as dl-her-colours.proof.mjs finds it. Exit 0 on PASS, 1 on FAIL, 2 when it could not run (no Chrome; or the mint closed, MINT_CLOSES, after which
// the film plays through with no skip and no stop). It ends what it started (the Chrome by pid, its profile folder) and gives itself 360 s.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { MINT_CLOSES } from './dl-paywall.js';
import { PRESS, DIVE, END } from './dl-hexagon.js';   // the path's times: from the press, from the dive, from her Enter
import { fromHerLink, INTENT } from './dl-her-reel.mjs';   // her link read back; X's own compose door
import { installLinks, MANIFEST } from './dl-seat-card.mjs';   // the downloads a published release names

const args = process.argv.slice(2), opt = (n, f) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : f; };
const URL_ = opt('--url', 'http://127.0.0.1:8977/intro/dyson-society/app/warm.html'), SHOTS = opt('--shots', null);
const SIZES = opt('--sizes', '1440x900,390x844').split(',').map((s) => s.split('x').map(Number)).filter(([w, h]) => w > 0 && h > 0);
const LATE_MS = 1500;   // a stage may come this late on a loaded Mac (its timers are the page's own), never sooner than its time
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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'red-road-proof-')), port = 9500 + Math.floor(Math.random() * 400);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--mute-audio',
  '--hide-scrollbars', '--use-angle=metal', '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
let code = 2;
const end = () => { try { proc.kill('SIGKILL'); } catch {} try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} process.exit(code); };
setTimeout(() => { out.errors.push('360 s passed'); console.log(JSON.stringify(out, null, 1)); end(); }, 360_000).unref();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function page([W, H]) {   // a fresh tab at this size, a first visit to the page (its storage cleared), its thrown errors and its console's errors kept
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
  await send('Runtime.enable'); await send('Page.enable'); await send('Storage.clearDataForOrigin', { origin: new URL(URL_).origin, storageTypes: 'all' });   // one Chrome's tabs share the page's storage
  await send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false }); if (W < 768) await send('Emulation.setTouchEmulationEnabled', { enabled: true, maxTouchPoints: 5 });
  await send('Page.addScriptToEvaluateOnNewDocument', { source: `window.__walk = { seen: [] }; document.addEventListener('dl-athena', (e) => __walk.seen.push({ type: e.detail?.type, s: +(performance.now() / 1000).toFixed(2) }));` });
  await send('Page.navigate', { url: URL_ });
  const js = async (expression) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text); return r.result?.result?.value; };
  const until = async (expression, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await js(expression).catch(() => false)) return true; await sleep(200); } return false; };
  const press = async (sel, ms = 8000) => {   // a trusted press at the centre of what `sel` names, once nothing covers it there (waited for, `ms` at most)
    const t0 = Date.now(); let where = null;
    do { where = await js(`(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e) return null; const r = e.getBoundingClientRect(), x = r.left + r.width / 2, y = r.top + r.height / 2, hit = document.elementFromPoint(x, y);
      return { x, y, on: r.width > 0 && !!hit && (hit === e || e.contains(hit)), hit: hit ? hit.tagName + '.' + hit.className : null }; })()`).catch(() => null); if (where?.on) break; await sleep(150); } while (Date.now() - t0 < ms);
    if (where?.on) for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x: where.x, y: where.y, button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1 });
    return where;
  };
  const shot = async (name) => { if (!SHOTS) return null; fs.mkdirSync(SHOTS, { recursive: true }); const s = await send('Page.captureScreenshot', { format: 'png' }), f = path.join(SHOTS, `${name}.png`); fs.writeFileSync(f, Buffer.from(s.result.data, 'base64')); return f; };
  return { js, until, press, shot, errs, said, close: () => { try { ws.close(); } catch {} } };
}

// the road as the page holds it: the path's stage and its log (each stage with its ms from the press), her making, and the page's own film and song
const STATE = `(() => { const h = window.dlHexagon?.state?.(), m = window.DL_HER?.state?.(), f = window.dlTwelve?.state?.(); return { stage: h?.stage ?? null, log: h?.log ?? [], why: h?.why ?? null, face: h?.face ?? null,
  open: m?.open ?? null, st: m?.st ?? null, whole: m?.whole ?? null, making: document.documentElement.dataset.herMaking ?? null, path: location.pathname, film: f ? { seeks: f.seeks, paused: f.film.paused, song: f.song.paused } : null }; })()`;

async function walk([W, H]) {
  const tag = `${W}x${H}`, w = { size: tag }, p = await page([W, H]); out.walks.push(w);
  const ok = (cond, what, detail) => check(cond, `${tag}: ${what}`, detail);
  const need = (cond, what, detail) => { ok(cond, what, detail); if (!cond) throw new Error(`${tag}: ${what}`); };   // the walk goes no further than its first fall
  // 1. to her offer: the film's skip, its question answered Skip, her entrance to "Take this egg."
  need(await p.until(`(() => { const b = document.querySelector('[data-twelve-skip]'), f = window.dlTwelve?.state?.().film; return !!b && !b.hidden && b.getBoundingClientRect().width > 0 && !!f && f.ready >= 3 && !f.paused && f.t > 2; })()`, 45000),
    'the film plays and its skip stands on it', await p.js('window.dlTwelve?.state?.()?.film ?? null').catch(() => null));
  w.skip = await p.press('[data-twelve-skip]');
  need(w.skip?.on && await p.until('!!window.dlAthena?.state?.().asking', 3000), 'the film\'s skip, pressed, asks first', w.skip);
  w.asked = await p.press('div.dl-athena-ask [data-ask="skip"]');
  need(w.asked?.on && await p.until(`document.documentElement.hasAttribute('data-egg-offered') && getComputedStyle(document.querySelector('#dl-sides')).display !== 'none'`, 90000),
    'Skip: her entrance runs to "Take this egg.", her egg offered and the split up behind her', await p.js('__walk.seen'));
  await p.until(`document.querySelector('a.dl-flask-plate[data-side="flask"]').getAnimations().every((a) => a.playState === 'finished')`, 3000);   // the plate's own slide in, over
  w.offer = { ...(await p.js(STATE)), shot: await p.shot(`1-offer-${tag}`) };
  // 2. the red plate: go, in, deep, her
  w.red = await p.press('a.dl-flask-plate[data-side="flask"]');
  need(w.red?.on && await p.until(`window.dlHexagon?.state?.().stage === 'her'`, PRESS.dive + DIVE.open + LATE_MS + 4000), 'the red plate, pressed, takes the hexagon path to her making', { red: w.red, ...(await p.js(STATE)) });
  w.her = { ...(await p.js(STATE)), shot: await p.shot(`2-her-${tag}`) };
  const due = { go: 0, in: PRESS.land, deep: PRESS.dive, her: PRESS.dive + DIVE.open }, stages = w.her.log.filter(([s]) => s in due);
  ok(stages.map(([s]) => s).join() === 'go,in,deep,her' && stages.every(([s, ms]) => ms >= due[s] - 20 && ms <= due[s] + LATE_MS), 'its stages go, in, deep, her, each on its time and none sooner', { log: w.her.log, due });
  ok(w.her.open && w.her.making === 'waiting' && w.her.path === w.offer.path, 'her making opens in the hexagon, nothing made yet, the page where it was', { open: w.her.open, making: w.her.making, path: w.her.path });
  // 3. the die colours her
  w.die = await p.press('.dl-her-tool', 9000);   // the die, the first of her tools, once her making's own entrance no longer covers it
  need(w.die?.on && await p.until(`(() => { const m = window.DL_HER.state(); return JSON.stringify(m.st) !== ${JSON.stringify(JSON.stringify(w.her.st))} && m.whole && !document.querySelector('.dl-her-go').disabled; })()`, 4000),
    'the die colours her: her state another, all of her painted, and Enter the world opens', { die: w.die, before: w.her.st, after: (await p.js(STATE)).st });
  w.coloured = { ...(await p.js(STATE)), shot: await p.shot(`3-coloured-${tag}`) };
  // 4. Enter the world: world at once, then rest
  w.go = await p.press('.dl-her-go');
  need(w.go?.on && await p.until(`window.dlHexagon.state().stage === 'world'`, 3000), 'Enter the world: the stage world at once', { go: w.go, ...(await p.js(STATE)) });
  need(await p.until(`window.dlHexagon.state().stage === 'rest'`, END.loose + 45000 + LATE_MS), 'the arrow let go and the ball opened: the stage rest', await p.js(STATE));
  w.rest = await p.js(`(async () => { const box = (e) => { if (!e) return null; const r = e.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map(Math.round); };
    const x = document.querySelector('.dl-hexagon-plates.on a.dl-flask-plate.l'), ride = document.querySelector('.dl-hexagon-plates.on .dl-flask-plate.r');
    return { ...${STATE}, faceBox: box(document.querySelector('.dl-hexagon-face')), x: x && { href: x.getAttribute('href'), target: x.target, box: box(x) }, ride: ride && { tag: ride.localName, href: ride.getAttribute('href'), disabled: ride.getAttribute('aria-disabled'), mac: /Mac/.test(navigator.platform) && navigator.maxTouchPoints === 0, box: box(ride) },
      made: __walk.seen.some((e) => e.type === 'made'), freeze: document.documentElement.dataset.spaceRouter ?? null, onTrack: document.documentElement.hasAttribute('data-on-track'),
      release: await fetch(${JSON.stringify(MANIFEST)}, { cache: 'no-store' }).then((r) => r.json()).catch(() => null) }; })()`);
  w.rest.shot = await p.shot(`4-rest-${tag}`);
  const r = w.rest, at = Object.fromEntries(r.log.map(([s, ms]) => [s, ms]));
  ok(r.face && r.faceBox?.[2] > 0 && 'plates' in at && at.rest >= at.world && !r.made && !r.freeze && !r.onTrack, 'her face on the opened ball, the plates in, then rest: nothing made and no freeze after it, the page given back',
    { log: r.log, faceBox: r.faceBox, made: r.made, freeze: r.freeze, onTrack: r.onTrack });
  // 5. the two plates: her face on X, read back to her colours; the ride
  const link = r.x?.href ? new URL(r.x.href) : null, her = link && `${link.origin}${link.pathname}` === INTENT ? fromHerLink(link.searchParams.get('text')) : null;
  const hex = (v) => String(v ?? '').toUpperCase(), mine = w.coloured.st, painted = [...(mine?.painted ?? [])].sort();
  ok(her && r.x.target === '_blank' && r.x.box[2] > 0 && painted.length > 0 && [...her.st.painted].sort().join() === painted.join() && painted.every((k) => hex(her.st.parts[k]) === hex(mine.parts[k])) && hex(her.st.light) === hex(mine.light),
    'her face on X: X\'s own compose door, its text her link, read back to her colours (never pressed: it leaves the house)', { href: r.x?.href, her: her?.st ?? null, mine });
  const doors = installLinks(r.release).map((d) => d.href), want = r.ride?.mac ? installLinks(r.release).find((d) => d.platform === 'macos')?.href : null;   // the plate is <a aria-disabled> until rideTo gives it this desktop's installer (A STRANGER DOWNLOADS HARMONY)
  ok(r.ride && r.ride.box[2] > 0 && (want ? r.ride.href === want && r.ride.disabled !== 'true' : r.ride.href ? doors.includes(r.ride.href) : r.ride.tag !== 'a' || r.ride.disabled === 'true'), r.ride?.href ? `the ride is a link, to a download the release names${want ? ': this Mac\'s' : ''}` : `the ride stands, with no door: ${r.ride?.tag === 'a' ? 'its plate aria-disabled' : 'a span'} (the release ${r.release?.status ?? 'unread'}${want ? ', which names this Mac\'s download' : ''})`, { ride: r.ride, doors, want });
  ok(r.film && w.offer.film && r.film.seeks === w.offer.film.seeks && r.film.paused === w.offer.film.paused && r.film.song === w.offer.film.song, 'the page\'s own film and song never sought, played or paused on the way (CLAUDE.md, The rule, 8)',
    { before: w.offer.film, after: r.film });
  w.consoleErrors = p.said;
  ok(p.errs.length === 0, 'no error thrown on the page', p.errs);
  p.close();
}

try {
  for (const size of SIZES) await walk(size).catch((e) => out.errors.push(String(e?.message || e).slice(0, 400)));
  const failed = out.checks.filter((x) => !x.ok).length;
  code = failed || out.errors.length ? 1 : 0; out.pass = code === 0;
  console.log(JSON.stringify(out, null, 1));
  console.log(code === 0 ? `PASS: from her offer down red's road by real presses: the hexagon to her making on its times, the die, Enter the world, the ball opened to rest, her face on X read back to her colours, the ride standing, the page's film never sought, at ${SIZES.map((s) => s.join('x')).join(' and ')}` : `FAIL: ${failed} check(s), ${out.errors.length} error(s)`);
} catch (e) {
  out.errors.push(String(e?.message || e).slice(0, 400)); console.log(JSON.stringify(out, null, 1)); code = out.checks.some((x) => !x.ok) ? 1 : 2;
}
end();

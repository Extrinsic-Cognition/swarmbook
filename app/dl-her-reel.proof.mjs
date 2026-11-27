#!/usr/bin/env node
// dl-her-reel.proof.mjs: HER REEL, proved in a real browser (dl-her-reel.js, dl-her-reel.mjs; his Oct 29 2026 18:33 UTC "how do we go from this to something that
// can go viral my dude? like socially shared..."). A headless Chrome, off every screen, opens the mint's page (app/warm.html) and:
//   1. on ?her her making opens with no share; real presses on the die spend her three wishes, the fourth pentagon comes, and the share stands at the end of her bar;
//   2. a real press on the share films her reel on her canvas (room/birth-film.mjs): cued to the next downbeat, its ring rolling, her four pentagons a ドン a beat
//      and ドクン; at its end the card: the reel a video the browser plays back, its length the reel's bars to a picture, thirty pictures a second, its doors;
//   3. its words: her bar as text and the link to her, which reads back as her paint and her wishes spent;
//   4. a friend: a browser that keeps nothing of hers opens that link: her making opens on the sharer's her (her renderer's own paint), at the sharer's rung,
//      no share, nothing kept; the friend's first real press makes her their own (their first wish spent, their refs kept, the link gone from the address).
//   nice -n 19 node app/dl-her-reel.proof.mjs [--url http://127.0.0.1:8977/intro/dyson-society/app/warm.html] [--chrome <path>] [--screenshot <png>]
// The Chrome as dl-her-colours.proof.mjs finds it. Exit 0 on PASS, 1 on FAIL, 2 when it could not run. It ends what it started and gives itself 120 s.
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
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'her-reel-proof-')), port = 9500 + Math.floor(Math.random() * 400);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--mute-audio',
  '--hide-scrollbars', '--use-angle=metal', '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
let code = 2;
const end = () => { try { proc.kill('SIGKILL'); } catch {} try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} process.exit(code); };
setTimeout(() => { out.errors.push('120 s passed'); console.log(JSON.stringify(out, null, 1)); end(); }, 120_000).unref();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function page() {   // a fresh tab, its page's errors and its console's kept
  let target = null;
  for (let i = 0; i < 80 && !target; i++) { await sleep(250); try { target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json(); } catch {} }
  if (!target?.webSocketDebuggerUrl) throw new Error('Chrome did not open a tab');
  const ws = new WebSocket(target.webSocketDebuggerUrl); let id = 0; const wait = new Map(), errs = [], said = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); } else if (d.method === 'Runtime.exceptionThrown') errs.push(String(d.params.exceptionDetails?.exception?.description ?? d.params.exceptionDetails?.text).slice(0, 300));
    else if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') said.push(d.params.args.map((x) => String(x.value ?? x.description ?? '')).join(' ').slice(0, 300)); };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('the tab did not answer')); });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  await send('Runtime.enable'); await send('Page.enable');
  const js = async (expression) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text); return r.result?.result?.value; };
  const press = async (x, y) => { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1 }); };
  const until = async (expression, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await js(expression).catch(() => false)) return true; await sleep(200); } return false; };
  const png = async (file) => { const r = await send('Page.captureScreenshot', { format: 'png' }); if (r.result?.data) fs.writeFileSync(file, Buffer.from(r.result.data, 'base64')); };
  return { send, js, press, until, png, errs, said, close: () => { try { ws.close(); } catch {} } };
}
const centre = (sel) => `(() => { const r = document.querySelector(${JSON.stringify(sel)})?.getBoundingClientRect(); return r && r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null; })()`;
const shotOf = (suffix) => (SHOT ? SHOT.replace(/\.png$/i, `${suffix}.png`) : null);

try {
  // 1: her making on ?her, no share; the die spends her three, the fourth pentagon comes, the share stands
  const a = await page(), sep = URL_.includes('?') ? '&' : '?';
  await a.send('Page.navigate', { url: `${URL_}${sep}her` });
  const drawn = await a.until('!!(window.DL_HER && DL_HER.state().her && DL_HER.state().her.paint)', 30000);
  check(drawn, 'on ?her her making opens and Harmony\'s renderer draws her');
  if (!drawn) throw new Error(`her renderer did not draw: ${JSON.stringify(await a.js('window.DL_HER ? DL_HER.state() : null').catch(() => null))}`);
  const before = await a.js(`({ share: DL_HER.state().share, hidden: document.querySelector('.dl-her-share')?.hidden, count: document.querySelector('.dl-her-count')?.textContent })`);
  check(before.share === false && before.hidden === true && before.count === '3/12', 'her three wishes, none spent: no share yet', before);
  const die = await a.js(centre('.dl-her-tool')); await a.press(...die);
  const stands = await a.until(`DL_HER.state().share === true && document.querySelector('.dl-her-count')?.textContent === '4/12'`, 4000);
  await sleep(1400);   // the slam and the share's own coming in
  const at = await a.js(centre('.dl-her-share'));
  check(stands && !!at, 'the die spends her three: the fourth pentagon comes and the share stands at the end of her bar', { at, wishes: await a.js('DL_HER.state().wishes') });
  // 2: the share films her reel; the card at its end. Nothing of the reel is loaded before its press: its page half and Harmony's film come with it
  const loaded = () => a.js(`performance.getEntriesByType('resource').map((e) => e.name.split('?')[0].split('/').pop()).filter((n) => /^(dl-her-reel\\.js|birth-film\\.mjs|lyric-flock\\.mjs)$/.test(n)).sort()`);
  const loadedBefore = await loaded();
  check(loadedBefore.length === 0, 'before the share\'s press nothing of the reel is loaded: neither its page half nor Harmony\'s film', loadedBefore);
  const t0 = Date.now(); await a.press(...at);
  const cued = await a.until(`document.querySelector('.dl-her-share').classList.contains('cued') || document.querySelector('.dl-her-share').classList.contains('rolling')`, 2000);
  const rolling = await a.until(`document.querySelector('.dl-her-share').classList.contains('rolling')`, 4000);
  check(cued && rolling, 'its press films her reel: cued to the next downbeat, then its ring rolls over the reel\'s bars', await a.js('DL_HER.state().reel'));
  const carded = await a.until('DL_HER.state().reel?.card === true', 30000), took = Date.now() - t0;
  const st = await a.js('DL_HER.state().reel'); out.reel = st; out.took_ms = took;
  if (!carded) throw new Error(`no card: ${JSON.stringify(st)}`);
  const loadedAfter = await loaded();
  check(loadedAfter.join(',') === 'birth-film.mjs,dl-her-reel.js,lyric-flock.mjs', 'the press brought them: the reel\'s page half and Harmony\'s film', loadedAfter);
  const f = st.film, bars = st.bars, bar_ms = f.grid.beat_ms * f.grid.beats_per_bar, want = bars * bar_ms;
  check(/^video\/(mp4|webm)/.test(st.reel.mime) && st.reel.bytes > 300_000 && f.errors === 0, 'her reel is a video file the browser made, muted (a video-only container), no error', { mime: st.reel.mime, bytes: st.reel.bytes, file: st.reel.file });
  check(Math.abs(f.duration_ms - want) <= 1000 / 30 * 2 && f.end?.on_bar === true && f.start?.on_bar === true, `her reel runs its ${bars} bars from a downbeat to a downbeat (${want} ms), to a picture or two`, { duration_ms: f.duration_ms, want, start: f.start, end: f.end });
  check(f.pictures >= f.duration_ms / 1000 * 30 * 0.85 && f.direct === f.pictures, 'thirty pictures a second, each taken from her own canvas after her draw', { pictures: f.pictures, pictures_a_s: f.pictures_a_s, draw_ms: f.draw_ms, draw_max_ms: f.draw_max_ms, source_ms: f.source_ms });
  check(f.shots === 4 && f.eyes === true && st.shots === 4 && st.eyes === true, 'her four pentagons came in, a ドン a beat, and ドクン after them', { shots: f.shots, eyes: f.eyes });
  await sleep(700);
  const play = await a.js(`(async () => { const v = document.querySelector('.dl-her-reel video'), t1 = v.currentTime; await new Promise((r) => setTimeout(r, 700));
    return { paused: v.paused, muted: v.muted, t1, t2: v.currentTime, duration: v.duration, w: v.videoWidth, h: v.videoHeight }; })()`);
  check(!play.paused && play.muted && play.t2 > play.t1 && play.w === 1080 && play.h === 1920 && Math.abs(play.duration * 1000 - f.duration_ms) < 250, 'the card plays her reel back, muted, 1080 x 1920, its own length', play);
  if (shotOf('-card')) await a.png(shotOf('-card'));
  // THE REEL ITSELF, LOOKED AT (his Oct 30 2026 "u never checked if the video worked or was trash?"): six of its own pictures, from its start to its end, side by
  // side on one sheet (--screenshot's -frames.png): what a friend sees when it is shared
  if (shotOf('-frames')) {
    const sheet = await a.js(`(async () => { const src = document.querySelector('.dl-her-reel video'), v = document.createElement('video'); v.muted = true; v.src = src.currentSrc || src.src;
      await new Promise((r) => { v.onloadeddata = r; }); const n = 6, w = 270, h = 480, c = document.createElement('canvas'); c.width = w * n; c.height = h; const g = c.getContext('2d');
      for (let i = 0; i < n; i++) { v.currentTime = Math.min(v.duration - 0.05, (i + 0.5) * v.duration / n); await new Promise((r) => { v.onseeked = r; }); g.drawImage(v, i * w, 0, w, h); }
      return c.toDataURL('image/png'); })()`);
    if (typeof sheet === 'string' && sheet.startsWith('data:image/png')) fs.writeFileSync(shotOf('-frames'), Buffer.from(sheet.split(',')[1], 'base64'));
  }
  // 3: its words, its doors, and the link to her
  const words = await a.js(`(async () => { const R = await import('./dl-her-reel.mjs'), W = await import('./dl-her-wishes.mjs'), s = DL_HER.state(), cap = s.reel.caption, link = cap.split('\\n').pop(), back = R.fromHerLink(link);
    const doors = [...document.querySelectorAll('.dl-her-reel-door')].map((d) => ({ k: d.classList[1], hidden: d.hidden, label: d.getAttribute('aria-label'), text: d.textContent.trim() }));
    return { cap, line: W.line(s.wishes.spent), link, sameParts: JSON.stringify(back?.st.parts) === JSON.stringify(s.st.parts), sameLight: back?.st.light === s.st.light, spent: back?.spent, mine: s.wishes.spent, doors,
      x: document.querySelector('.dl-her-reel-door.x')?.href, intent: R.INTENT, code: back?.code ?? null, mineCode: s.friends.code }; })()`);
  out.caption = words.cap;
  check(words.cap.split('\n').includes(words.line) && /^https:\/\/optimism\.fit\/#her=1\./.test(words.link) && words.sameParts && words.sameLight && words.spent === words.mine
    && /^[0-9A-HJKMNP-TV-Z]{10}$/.test(words.code ?? '') && words.code === words.mineCode,
    'its words carry her bar as text and the link to her, which reads back as her paint, her wishes spent and her code (A FRIEND GRANTS A WISH)', { caption: words.cap, code: words.code });
  check(words.doors.map((d) => d.k).join(',') === 'share,save,x,shut' && words.doors.every((d) => d.label && !/[a-z]{3,}/i.test(d.text)) && words.x === `${words.intent}?${new URLSearchParams({ text: words.cap })}`,
    'its doors: the browser\'s share (where it shares files), save, X with its words, close; a glyph each, no word', words.doors);
  const sharer = await a.js(`({ parts: DL_HER.state().st.parts, count: document.querySelector('.dl-her-count').textContent, spent: DL_HER.state().wishes.spent, code: DL_HER.state().friends.code })`);
  check(a.errs.length === 0 && a.said.length === 0, 'no error on the page and none in its console', { errs: a.errs, said: a.said });
  a.close();
  // 4: a friend: a browser that keeps nothing of hers opens the link
  const b = await page();
  await b.send('Page.navigate', { url: new URL('dl-her-reel.mjs', URL_).href }); await sleep(600);
  await b.js('localStorage.clear(), true');   // the friend's browser: nothing of hers in it
  await b.send('Page.navigate', { url: `${URL_}${words.link.slice(words.link.indexOf('#'))}` });
  const opened = await b.until(`!!(window.DL_HER && DL_HER.state().visit && DL_HER.state().her && DL_HER.state().her.paint)`, 30000);
  await sleep(900);
  const visit = await b.js(`({ reason: DL_HER.state().reason, visit: DL_HER.state().visit, paint: DL_HER.state().her.paint, count: document.querySelector('.dl-her-count').textContent, share: DL_HER.state().share,
    own: DL_HER.state().st.painted, keys: Object.keys(localStorage).filter((k) => /^dl\\.her/.test(k)), drawn: DL_HER.state().wishes.drawn })`);
  check(opened && visit.reason === 'visit' && JSON.stringify(visit.paint) === JSON.stringify(sharer.parts) && visit.count === sharer.count && visit.share === false,
    'a friend\'s link opens her making on the sharer\'s her: her renderer in the sharer\'s paint, the sharer\'s rung, no share', visit);
  check(visit.own.length === 0 && visit.keys.length === 0 && visit.visit.spent === sharer.spent, 'nothing of the sharer\'s kept in the friend\'s browser, the friend\'s own her untouched', { own: visit.own, keys: visit.keys });
  if (shotOf('-visit')) await b.png(shotOf('-visit'));
  const field = await b.js(centre('.dl-her-field')); await b.press(field[0] - 40, field[1]);
  await sleep(500);
  const mine = await b.js(`({ visit: DL_HER.state().visit, count: document.querySelector('.dl-her-count').textContent, spent: DL_HER.state().wishes.spent, hash: location.hash,
    keys: Object.keys(localStorage).filter((k) => /^dl\\.her/.test(k)).sort(), drawn: DL_HER.state().wishes.drawn, light: DL_HER.state().st.light, her: DL_HER.state().her.light ?? null,
    ref: DL_HER.state().friends.ref })`);
  check(mine.visit === null && mine.count === '3/12' && mine.spent === 1 && mine.hash === '' && mine.keys.join(',') === 'dl.her,dl.her.friends,dl.her.wishes' && JSON.stringify(mine.drawn?.seats) === '[0,1,2]'
    && mine.ref === sharer.code,
    'the friend\'s first press makes her their own: their first wish spent on their own rung, their refs kept with the sharer\'s code, the link gone from the address', mine);
  check(b.errs.length === 0 && b.said.length === 0, 'no error on the friend\'s page and none in its console', { errs: b.errs, said: b.said });
  b.close();
  code = out.checks.every((c) => c.ok) ? 0 : 1;
} catch (e) { out.errors.push(String(e?.message || e).slice(0, 400)); code = out.checks.length && out.checks.every((c) => c.ok) ? 2 : 1; }
console.log(JSON.stringify({ ...out, verdict: code === 0 ? 'PASS' : 'FAIL' }, null, 1));
end();

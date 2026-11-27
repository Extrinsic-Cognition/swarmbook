#!/usr/bin/env node
// dl-her-wish.proof.mjs: THE WISH IS A CALL, IN THE APP, proved in a real browser (dl-her-wishes.mjs, dl-her-colours.js, worker/space-router.mjs hello and wish,
// worker/app-attest.mjs; his Nov 1 2026 02:11 UTC "* 3 wishes as CAC * social proof as K-factor" and 04:51 UTC "all of that needs to happen in the dysonlight
// harmony app... there should be 0 wishes granted outside of the app... that is our foot-in-the-door gtm operation dude"). A headless Chrome, off every screen, on
// the mint's page (app/warm.html) as the site serves it; the doors are the Worker's own code (its burn, its oracle, its check of the app's key) on a database every
// migration built (node:sqlite, as D1 applies them), the house's tank poured and his words named; Apple is invented (worker/invented-apple.mjs: its root, the
// phone's key); MiniRouter is a stand-in (no network, no money). Two glasses, one after the other:
//   THE WEB (a browser): 1. on ?her her making opens and the door into the app stands where the field would, Make a wish, at 3/12; 2. a real press on the die
//      colours her and spends nothing; 3. her page's own fetch of a wish, as the old page sent it, is refused (Her wishes are granted in DysonLight); 4. a real
//      press on the door goes to /wish, and the Worker sends the browser on to the app in the store.
//   THE APP (the same page with DysonLight's hand, as Host/WishFront.swift gives it; the hand's key in this process, as the phone's is in its Secure Enclave):
//      5. her hello, the key's attestation, names her code and the field stands at 3/12, no door; 6. the die spends nothing; 7. a real press in the field, typed
//      words and a real press on Wish: the key proves it, one call on the house's tank, her answer under her bar, one wish spent; 8. two more: her three spent,
//      the fourth pentagon in her slam, Fuel me; 9. the door holds her one key and three wishes (cost, leaf), the tank three calls, no $WARM, no word; 10. her last
//      word sent again is refused (its counter did not advance); 11. no error on either page.
//   THE APP AGAIN (ONE PHONE, ONE BIRTH, lane/one-phone-one-birth: DysonLight deleted and installed again, its page's storage gone with it, a fresh browser context):
//      12. a new key, the keychain's mark kept: her hello attests the new key with the same mark, and the door gives her back (her code, her three wishes spent,
//      4/12, Fuel me), one row re-keyed, the tank still three calls: no new three.
//   nice -n 19 node app/dl-her-wish.proof.mjs [--url http://127.0.0.1:8977/intro/dyson-society/app/warm.html] [--chrome <path>] [--screenshot <png>] [--screenshot-web <png>] [--screenshot-again <png>] [--window 1440,900]
// Exit 0 on PASS, 1 on FAIL, 2 when it could not run. It ends what it started and gives itself 150 s.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { spaceRouterDoor, SWARMY, IN_APP } from '../worker/space-router.mjs'; import { d1, migrated } from '../worker/d1-on-sqlite.mjs';
import { inventedApple } from '../worker/invented-apple.mjs';
import { newOracleKey } from './space-router-oracle.mjs';
import { addSql, refillSql, keyHash, newKey } from '../tools/space-router-tank.mjs';

const args = process.argv.slice(2), opt = (n, f) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : f; };
const URL_ = opt('--url', 'http://127.0.0.1:8977/intro/dyson-society/app/warm.html'), SHOT = opt('--screenshot', null), SHOT_WEB = opt('--screenshot-web', null), SHOT_AGAIN = opt('--screenshot-again', null), WINDOW = opt('--window', '1440,900');
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

// the wish door: the Worker's own code on a database every migration built, the house's tank poured, his three words named
const db = migrated(), DB = d1(db);   // D1's surface on node:sqlite (worker/d1-on-sqlite.mjs)
const ANSWER = 'Granted. Here is your plan: one thing a day, done before noon.', MODEL = 'a/small-model', sent = [];
async function miniRouter(url, init = {}) {   // MiniRouter, a stand-in: no network, no money
  const body = JSON.parse(init.body || 'null'); sent.push({ url: String(url), body });
  return new Response(JSON.stringify({ id: 'chatcmpl-proof', object: 'chat.completion', created: 1, model: body.model, choices: [{ index: 0, message: { role: 'assistant', content: ANSWER }, finish_reason: 'stop' }],
    usage: { prompt_tokens: 60, completion_tokens: 20, total_tokens: 80 } }), { status: 200, headers: { 'content-type': 'application/json', 'x-minirouter-cost-usd': '0.0012' } });
}
db.exec(addSql('wishes', keyHash(newKey()), { nowMs: Date.now() })); db.exec(refillSql('wishes', 2, 'the house sponsors her wishes', { nowMs: Date.now() }));
const APPLE = inventedApple(), PHONE = APPLE.phone(), STORE = 'https://apps.apple.com/app/dysonlight/id0000000000';   // an invented Apple and its phone; an invented page in the store
const env = { DB, SPACE_ROUTER_KEY: 'mr-proof-house-key', SPACE_ROUTER_ORACLE_KEY: (await newOracleKey()).secret, SPACE_ROUTER_WISH_TANK: 'wishes', SPACE_ROUTER_WISH_MODEL: MODEL, SPACE_ROUTER_WISH_USD_DAY: '1',
  SPACE_ROUTER_WISH_APPS: APPLE.appId, SPACE_ROUTER_WISH_ROOT: APPLE.pem, SPACE_ROUTER_WISH_STORE: STORE };
const doors = [spaceRouterDoor({ fetcher: miniRouter })], asks = [], hand = [];
// DysonLight's hand inside the page (Host/WishFront.swift's dysonlight handler), its key here: prove(data) an attestation at the key's first word, an assertion after
const HAND = `window.webkit = { messageHandlers: { dysonlight: { postMessage: (m) => fetch('/__dysonlight', { method: 'POST', body: JSON.stringify(m) }).then((r) => r.json()) } } };`;
async function serve(send, { requestId, request }) {   // a browser's own request to the doors (the wish's, her friends', the app's on the web), the store, or the app's hand
  const url = new URL(request.url), headers = new Headers(request.headers);
  if (url.pathname === '/__dysonlight') {
    const m = JSON.parse(request.postData || 'null'); hand.push(m?.op);
    const reply = m?.op === 'prove' ? PHONE.prove(m.data) : m?.op === 'forget' ? (PHONE.forget(), null) : null;
    await send('Fetch.fulfillRequest', { requestId, responseCode: 200, responseHeaders: [{ name: 'content-type', value: 'application/json' }], body: Buffer.from(JSON.stringify(reply)).toString('base64') }); return;
  }
  if (url.origin === new URL(STORE).origin) {   // the store: never the network
    await send('Fetch.fulfillRequest', { requestId, responseCode: 200, responseHeaders: [{ name: 'content-type', value: 'text/html' }], body: Buffer.from('<!doctype html><title>the store</title>').toString('base64') }); return;
  }
  const req = () => new Request(url, { method: request.method, headers, body: request.method === 'POST' ? request.postData ?? '' : undefined });
  let res = null; for (const d of doors) { res = await d(req(), env, url); if (res) break; }
  res = res ?? new Response('{}', { status: 404, headers: { 'content-type': 'application/json' } });
  const body = Buffer.from(await res.arrayBuffer());
  asks.push({ method: request.method, path: `${url.pathname}${url.search}`, origin: headers.get('origin'), said: request.postData ?? null, status: res.status });
  await send('Fetch.fulfillRequest', { requestId, responseCode: res.status, responseHeaders: [...res.headers].map(([name, value]) => ({ name, value })), body: body.toString('base64') });
}

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'her-wish-proof-')), port = 9100 + Math.floor(Math.random() * 400);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--mute-audio',
  '--hide-scrollbars', '--use-angle=metal', `--window-size=${WINDOW}`, 'about:blank'], { stdio: 'ignore' });
out.window = WINDOW;
let code = 2;
const end = () => { try { proc.kill('SIGKILL'); } catch {} try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} process.exit(code); };
setTimeout(() => { out.errors.push('150 s passed'); console.log(JSON.stringify(out, null, 1)); end(); }, 150_000).unref();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function connect(url) {
  const ws = new WebSocket(url); let id = 0; const wait = new Map(), on = [];
  ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); } else for (const f of on) f(d); };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('Chrome did not answer')); });
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  return { ws, send, on: (f) => on.push(f) };
}
const centre = (sel) => `(() => { const r = document.querySelector(${JSON.stringify(sel)})?.getBoundingClientRect(); return r && r.width ? [r.left + r.width / 2, r.top + r.height / 2] : null; })()`;
const seen = (sel) => `(() => { const e = document.querySelector(${JSON.stringify(sel)}); if (!e || e.hidden) return false; const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; })()`;

try {
  let B = null; for (let i = 0; i < 80 && !B; i++) { await sleep(250); try { const v = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json(); if (v.webSocketDebuggerUrl) B = await connect(v.webSocketDebuggerUrl); } catch {} }
  if (!B) throw new Error('Chrome did not answer');
  async function glass(app, browserContextId) {   // one page, a browser's or DysonLight's (its hand injected before the page's own scripts), its doors answered here
    const t = await B.send('Target.createTarget', { url: 'about:blank', ...(browserContextId ? { browserContextId } : {}) }), c = await connect(`ws://127.0.0.1:${port}/devtools/page/${t.result.targetId}`), errs = [], said = [];
    c.on((d) => {
      if (d.method === 'Runtime.exceptionThrown') errs.push(String(d.params.exceptionDetails?.exception?.description ?? d.params.exceptionDetails?.text).slice(0, 300));
      else if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') said.push(d.params.args.map((x) => String(x.value ?? x.description ?? '')).join(' ').slice(0, 300));
      else if (d.method === 'Fetch.requestPaused') void serve(c.send, d.params).catch((e) => out.errors.push(`a door: ${String(e?.message || e).slice(0, 200)}`));
    });
    await c.send('Runtime.enable'); await c.send('Page.enable');
    await c.send('Fetch.enable', { patterns: ['*/space-router/v1/wish*', '*/wish?*', '*/wish', '*/__dysonlight', `${new URL(STORE).origin}/*`].map((urlPattern) => ({ urlPattern, requestStage: 'Request' })) });
    if (app) await c.send('Page.addScriptToEvaluateOnNewDocument', { source: HAND });
    const js = async (expression) => { const r = await c.send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text); return r.result?.result?.value; };
    const press = async (x, y) => { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await c.send('Input.dispatchMouseEvent', { type, x, y, button: 'left', buttons: type === 'mousePressed' ? 1 : 0, clickCount: 1 }); };
    const until = async (expression, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await js(expression).catch(() => false)) return true; await sleep(200); } return false; };
    await c.send('Page.navigate', { url: `${URL_}${URL_.includes('?') ? '&' : '?'}her` });
    return { t, c, js, press, until, errs, said };
  }
  const opened = (g, more) => g.until(`!!(window.DL_HER && DL_HER.state().her && DL_HER.state().her.paint && ${more})`, 40000);
  const die = async (g) => { await g.press(...await g.js(centre('.dl-her-tool'))); return g.until(`DL_HER.state().whole === true`, 6000); };
  // THE WEB
  const w = await glass(false);
  const wOpen = await opened(w, 'DL_HER.state().calls && DL_HER.state().calls.open === true');
  check(wOpen && await w.js(seen('.dl-her-app')) && !(await w.js(seen('.dl-her-wish'))) && await w.js(`document.querySelector('.dl-her-app')?.textContent === 'Make a wish' && document.querySelector('.dl-her-count')?.textContent === '3/12'`),
    'THE WEB: on ?her her making opens, and the door into the app stands where the field would, Make a wish, at 3/12; no field', { calls: await w.js('DL_HER.state().calls').catch(() => null), wish: await w.js('DL_HER.state().wish').catch(() => null) });
  if (!wOpen) throw new Error(`her making did not open on the web: ${JSON.stringify(await w.js('window.DL_HER ? DL_HER.state() : null').catch(() => null)).slice(0, 400)}`);
  check(await die(w) && await w.js('DL_HER.state().wishes.spent === 0 && DL_HER.state().wishes.slams === 0 && document.querySelector(".dl-her-count").textContent === "3/12"') && !asks.some((a) => a.method === 'POST'),
    'THE WEB: a real press on the die colours all six of her and spends nothing; nothing asks a wish');
  const old = await w.js(`fetch('/space-router/v1/wish', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code: 'AAAAAAAAAA', wish: 'a plan for my week' }) })
    .then(async (r) => ({ status: r.status, message: (await r.json()).error?.message }))`);
  check(old.status === 403 && old.message === IN_APP && sent.length === 0, 'THE WEB: her page\'s own fetch of a wish, as the old page sent it, is refused: Her wishes are granted in DysonLight; the router asked nothing', old);
  if (SHOT_WEB) { await w.until(`[...document.querySelectorAll('.dl-her-slot')].every((e) => !e.getAnimations().length)`, 4000); const r = await w.c.send('Page.captureScreenshot', { format: 'png' }); if (r.result?.data) fs.writeFileSync(SHOT_WEB, Buffer.from(r.result.data, 'base64')); }
  await w.press(...await w.js(centre('.dl-her-app')));
  const went = await w.until(`location.href === ${JSON.stringify(STORE)}`, 10000);
  check(went && asks.some((a) => a.path === '/wish' && a.status === 302), 'THE WEB: a real press on the door goes to /wish, and the Worker sends the browser on to the app in the store', { at: await w.js('location.href').catch(() => null) });
  const webErrs = { errs: [...w.errs], said: [...w.said] };
  await B.send('Target.closeTarget', { targetId: w.t.result.targetId }).catch(() => {});
  // THE APP
  const a = await glass(true);
  const aOpen = await opened(a, 'DL_HER.state().wish && DL_HER.state().wish.code && DL_HER.state().wish.field === true');
  const hello = asks.find((x) => x.path === '/space-router/v1/wish/hello'), helloSaid = hello ? JSON.parse(hello.said) : null;
  check(aOpen && hello?.status === 200 && typeof helloSaid?.attestation === 'string' && /^[0-9A-HJKMNP-TV-Z]{10}$/.test(await a.js('DL_HER.state().wish.code')) && await a.js(seen('.dl-her-wish'))
    && !(await a.js(seen('.dl-her-app'))) && await a.js(`document.querySelector('.dl-her-wish-in')?.placeholder === 'Make a wish' && document.querySelector('.dl-her-count')?.textContent === '3/12'`),
    'THE APP: her hello, the app key\'s attestation, names her code; the field stands under her bar at 3/12, Make a wish; no door', { wish: await a.js('DL_HER.state().wish').catch(() => null), hand: [...hand] });
  if (!aOpen) throw new Error(`her making did not open in the app: ${JSON.stringify(await a.js('window.DL_HER ? DL_HER.state() : null').catch(() => null)).slice(0, 400)}`);
  check(await die(a) && await a.js('DL_HER.state().wishes.spent === 0'), 'THE APP: a real press on the die colours her and spends no wish');
  const wish = async (words, k) => {
    if (!(await a.until(`DL_HER.state().wish.wishing === false && !document.querySelector('.dl-her-wish-in').readOnly`, 30000))) return false;
    await a.press(...await a.js(centre('.dl-her-wish-in'))); await a.c.send('Input.insertText', { text: words }); await a.press(...await a.js(centre('.dl-her-wish-go')));
    return a.until(`DL_HER.state().wish.wishing === false && DL_HER.state().wish.made === ${k}`, 30000);
  };
  const t0 = Date.now(), first = await wish('a plan for my week', 1), ms = Date.now() - t0;
  const one = await a.js(`({ answer: document.querySelector('.dl-her-answer')?.textContent, field: document.querySelector('.dl-her-wish-in')?.value, spent: DL_HER.state().wishes.spent,
    count: document.querySelector('.dl-her-count')?.textContent, wish: DL_HER.state().wish })`);
  const post = asks.find((x) => x.method === 'POST' && x.path === '/space-router/v1/wish' && x.status === 200), postSaid = post ? JSON.parse(post.said) : null;
  check(first && one.answer === ANSWER && await a.js(seen('.dl-her-answer')) && one.field === '' && one.spent === 1 && one.count === '3/12' && one.wish.left === 2,
    'THE APP: a real press in the field, typed words and a real press on Wish: her answer shows under her bar, and the call spent one of her three wishes', { ms, one });
  check(post && typeof postSaid.assertion === 'string' && postSaid.wish === 'a plan for my week' && sent.length === 1 && sent[0].body.model === MODEL && sent[0].body.messages[0].content === SWARMY
    && sent[0].body.messages[1].content === 'a plan for my week', 'THE APP: the app\'s key proved the wish (an assertion) and the call rode the house\'s tank with her words and the visitor\'s', { post: { ...post, said: { ...postSaid, assertion: `${postSaid?.assertion?.slice(0, 16)}…` } } });
  out.wish_ms = ms;
  const more = (await wish('a name for my cat', 2)) && (await wish('a haiku about snow', 3));
  await a.until('DL_HER.state().wishes.slams === 1', 4000); await sleep(600);   // her slam
  const three = await a.js(`({ spent: DL_HER.state().wishes.spent, count: document.querySelector('.dl-her-count')?.textContent, slams: DL_HER.state().wishes.slams, left: DL_HER.state().wish.left,
    fuel: document.querySelector('.dl-her-fuel')?.textContent, seats: DL_HER.state().wishes.drawn?.seats?.length ?? null })`);
  check(more && three.spent === 3 && three.count === '4/12' && three.slams === 1 && three.left === 0 && three.seats === 4, 'THE APP: two more wishes: her three spent, the fourth pentagon comes in her slam, on her renderer too', three);
  check(await a.js(seen('.dl-her-fuel')) && three.fuel === 'Fuel me.' && !(await a.js(seen('.dl-her-wish'))), 'THE APP: past the house\'s three, the field leaves and she says Fuel me.');
  if (SHOT) { const r = await a.c.send('Page.captureScreenshot', { format: 'png' }); if (r.result?.data) fs.writeFileSync(SHOT, Buffer.from(r.result.data, 'base64')); }
  const keys = db.prepare('SELECT code, app, counter FROM her_apps').all().map((r) => ({ ...r })), rows = db.prepare('SELECT code, usd, leaf FROM her_wishes ORDER BY id').all().map((r) => ({ ...r }));
  const tank = { ...db.prepare("SELECT calls, drunk_usd, warm FROM sr_tanks WHERE name = 'wishes'").get() }, herCode = one.wish.code;
  const dump = db.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map(({ name }) => JSON.stringify(db.prepare(`SELECT * FROM "${name}"`).all())).join('\n');
  check(keys.length === 1 && keys[0].code === herCode && keys[0].app === APPLE.appId && keys[0].counter >= 3 && rows.length === 3 && rows.every((r) => r.code === herCode && r.usd > 0 && /^[0-9a-f]{64}$/.test(r.leaf))
    && tank.calls === 3 && tank.warm === 0 && !['a plan for my week', 'a name for my cat', 'a haiku about snow'].some((x) => dump.includes(x)),
    'THE APP: the door holds her one key and three wishes, each with its burn\'s cost and its receipt\'s leaf; the house\'s tank three calls, no $WARM mined; none of the words kept', { keys, rows, tank });
  const last = asks.filter((x) => x.method === 'POST' && x.path === '/space-router/v1/wish').at(-1);
  const again = await a.js(`fetch('/space-router/v1/wish', { method: 'POST', headers: { 'content-type': 'application/json' }, body: ${JSON.stringify(last?.said ?? '{}')} }).then(async (r) => ({ status: r.status, message: (await r.json()).error?.message }))`);
  check(again.status === 403 && /counter did not advance/.test(again.message) && sent.length === 3, 'THE APP: her last word sent again is refused (its counter did not advance); nothing asked of the router', again);
  await B.send('Target.closeTarget', { targetId: a.t.result.targetId }).catch(() => {});
  // THE APP AGAIN: the app deleted and installed again (ONE PHONE, ONE BIRTH): its key dies with it (forget), the keychain's mark stays, its page's storage is gone
  PHONE.forget();
  const fresh = (await B.send('Target.createBrowserContext', {})).result?.browserContextId, b = await glass(true, fresh);
  const bOpen = await opened(b, 'DL_HER.state().wish && DL_HER.state().wish.code') && await b.until(`DL_HER.state().wish.left === 0 && document.querySelector('.dl-her-count')?.textContent === '4/12'`, 30000);
  const hellos = asks.filter((x) => x.path === '/space-router/v1/wish/hello'), reborn = hellos.at(-1), rebornSaid = reborn ? JSON.parse(reborn.said) : null;
  const back = await b.js(`({ code: DL_HER.state().wish.code, granted: DL_HER.state().wish.granted, used: DL_HER.state().wish.used, left: DL_HER.state().wish.left,
    count: document.querySelector('.dl-her-count')?.textContent })`).catch(() => null);
  const rekeyed = db.prepare('SELECT code, key, counter FROM her_apps').all().map((r) => ({ ...r })), calls = db.prepare("SELECT calls FROM sr_tanks WHERE name = 'wishes'").get()?.calls;
  check(bOpen && hellos.length === 2 && reborn.status === 200 && typeof rebornSaid?.attestation === 'string' && rebornSaid.key !== helloSaid.key && rebornSaid.phone === helloSaid.phone
    && back?.code === herCode && back.granted === 3 && back.used === 3 && back.left === 0 && back.count === '4/12' && await b.js(seen('.dl-her-fuel')) && !(await b.js(seen('.dl-her-wish')))
    && rekeyed.length === 1 && rekeyed[0].code === herCode && rekeyed[0].key === rebornSaid.key && calls === 3 && sent.length === 3,
    'THE APP AGAIN (a reinstall): a new key, the keychain\'s mark: her hello attests the new key with the same mark and the door gives her back, her code, her three wishes spent, 4/12, Fuel me; one row, re-keyed; no new three',
    { back, rekeyed, phone: rebornSaid?.phone === helloSaid?.phone, newKey: rebornSaid?.key !== helloSaid?.key, calls });
  if (SHOT_AGAIN) { await b.until(`[...document.querySelectorAll('.dl-her-slot')].every((e) => !e.getAnimations().length)`, 4000); const r = await b.c.send('Page.captureScreenshot', { format: 'png' }); if (r.result?.data) fs.writeFileSync(SHOT_AGAIN, Buffer.from(r.result.data, 'base64')); }
  check(webErrs.errs.length === 0 && webErrs.said.length === 0 && a.errs.length === 0 && a.said.length === 0 && b.errs.length === 0 && b.said.length === 0, 'no error on any page and none in their consoles',
    { web: webErrs, app: { errs: a.errs, said: a.said }, again: { errs: b.errs, said: b.said } });
  await B.send('Target.closeTarget', { targetId: b.t.result.targetId }).catch(() => {});
  code = out.checks.every((x) => x.ok) ? 0 : 1;
} catch (e) { out.errors.push(String(e?.message || e).slice(0, 400)); code = 1; }
out.asks = asks.map(({ method, path: p, status }) => `${method} ${p} ${status}`);
console.log(JSON.stringify({ ...out, verdict: code === 0 ? 'PASS' : 'FAIL' }, null, 1));
end();

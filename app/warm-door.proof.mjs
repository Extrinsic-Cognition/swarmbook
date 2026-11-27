#!/usr/bin/env node
// warm-door.proof.mjs: THE DOOR OPENS WITH THE POOL (lane/the-door-opens-with-the-pool; his Oct 30 2026 click "Yes, build it" on "Build the page's buy-$WARM
// button, shown once trading opens?"). A headless Chrome, off every screen, opens the page (app/warm.html) at each size, four times:
//   1. as committed: the mainnet set names no pool (warm-pair.mjs), so the door to buy $WARM stays shut and the page asks the chain nothing;
//   2. a pool named, its opening passed, the chain saying the pair stands and trades: after one read of 8 bytes of the pair (getAccountInfo, its activation
//      point), the door opens in $WARM's title, to the pair's page on Meteora;
//   3. a pool named, its opening passed, the chain saying there is no such account: one read, and the door stays shut;
//   4. a pool named, its opening not reached: no read, and the door stays shut.
// In 2 to 4 the page's warm-pair.mjs is answered by a stand-in naming the devnet rehearsal's pair, and the cluster by a stand-in answer (CDP Fetch), so the
// proof never reaches mainnet. That Chrome runs without its cross-origin checks (--disable-web-security), so no preflight leaves the Mac and the stand-in
// answers the page's read itself; the cluster's public door answers a browser's cross-origin reads (the mint's count read it so, dl-mint-liquor.mjs).
// FAIL when the door opens when it should not, stays shut when it should open, leads anywhere but the pair's page, asks when it should not, is covered or
// out of $WARM's title when open, or the page throws.
//   nice -n 19 node app/warm-door.proof.mjs [--url <the page>] [--sizes 1440x900,390x844] [--chrome <path>] [--shots <dir>]
// The Chrome: as dl-warm-words.proof.mjs finds it. Exit 0 on PASS, 1 on FAIL, 2 when it could not run. It ends what it started (each tab, the Chrome by
// pid, its profile folder) and gives itself 300 s.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { ACTIVATION_AT, DLMM, RPC, doorHref } from './warm-door.mjs';

const args = process.argv.slice(2), opt = (n, f) => { const i = args.indexOf(n); return i >= 0 && args[i + 1] ? args[i + 1] : f; };
const URL_ = opt('--url', 'http://127.0.0.1:8986/embertide-app/ui/intro/dyson-society/app/warm.html');
const SIZES = opt('--sizes', '1440x900,390x844').split(',').map((s) => s.split('x').map(Number)).filter(([w, h]) => w > 0 && h > 0);
const SHOTS = opt('--shots', null);
const PAIR = 'FfaxTfLjCTwdBCfm5k5GYyzKysJAEmZqZLyt1o7AT3Eg';   // the devnet rehearsal's pair (tools/warm-launch/LANDING.md, r3): an address of the right shape
function chromeOf() {
  const given = opt('--chrome', process.env.CHROME); if (given && fs.existsSync(given)) return given;
  for (const p of ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
    '/Applications/Chromium.app/Contents/MacOS/Chromium']) if (fs.existsSync(p)) return p;
  const pw = path.join(os.homedir(), 'Library/Caches/ms-playwright');
  const dirs = fs.existsSync(pw) ? fs.readdirSync(pw).filter((d) => /^chromium-\d+$/.test(d)).sort((a, b) => +b.split('-')[1] - +a.split('-')[1]) : [];
  for (const d of dirs) for (const arch of ['chrome-mac-arm64', 'chrome-mac']) { const p = path.join(pw, d, arch, 'Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing'); if (fs.existsSync(p)) return p; }
  return null;
}
const out = { url: URL_, when: new Date().toISOString(), visits: [], checks: [], errors: [] };
const check = (ok, what, detail) => { out.checks.push({ ok: !!ok, what, ...(detail === undefined ? {} : { detail }) }); console.log(`${ok ? 'PASS' : 'FAIL'}  ${what}`); };
const chrome = chromeOf();
if (!chrome) { console.log(JSON.stringify({ ...out, error: 'no Chrome on this Mac' }, null, 1)); process.exit(2); }
out.chrome = chrome;
const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'warm-door-proof-')), port = 9500 + Math.floor(Math.random() * 400);
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--no-first-run', '--no-default-browser-check', '--mute-audio',
  '--hide-scrollbars', '--use-angle=metal', '--disable-web-security', '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
let code = 2;
const end = () => { try { proc.kill('SIGKILL'); } catch {} try { fs.rmSync(profile, { recursive: true, force: true }); } catch {} process.exit(code); };
setTimeout(() => { out.errors.push('300 s passed'); console.log(JSON.stringify(out, null, 1)); end(); }, 300_000).unref();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const b64 = (s) => Buffer.from(s).toString('base64');
const activation = (ms) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(Math.floor(ms / 1000))); return b.toString('base64'); };

async function page(onPaused) {   // a fresh tab: its thrown errors kept, its paused requests handed to onPaused(params, send)
  let target = null;
  for (let i = 0; i < 80 && !target; i++) { await sleep(250); try { target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: 'PUT' })).json(); } catch {} }
  if (!target?.webSocketDebuggerUrl) throw new Error('Chrome did not open a tab');
  const ws = new WebSocket(target.webSocketDebuggerUrl); let id = 0; const wait = new Map(), errs = [];
  const send = (method, params = {}) => new Promise((r) => { const i = ++id; wait.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && wait.has(d.id)) { wait.get(d.id)(d); wait.delete(d.id); }
    else if (d.method === 'Runtime.exceptionThrown') errs.push(String(d.params.exceptionDetails?.exception?.description ?? d.params.exceptionDetails?.text).slice(0, 300));
    else if (d.method === 'Fetch.requestPaused') void onPaused(d.params, send);
  };
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('the tab did not answer')); });
  await send('Runtime.enable'); await send('Page.enable');
  const js = async (expression) => { const r = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }); if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description ?? r.result.exceptionDetails.text); return r.result?.result?.value; };
  const until = async (expression, ms = 15000) => { const t0 = Date.now(); while (Date.now() - t0 < ms) { if (await js(expression).catch(() => false)) return true; await sleep(200); } return false; };
  const close = async () => { try { ws.close(); } catch {} try { await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`); } catch {} };
  return { send, js, until, errs, close };
}

// the four moments: what warm-pair.mjs says (null: as committed), what the chain says of the pair, and what must follow
const now0 = Date.now(), passed = new Date(now0 - 3600_000).toISOString(), ahead = new Date(now0 + 86400_000).toISOString(), close = '2026-11-15T00:00:00Z';
const named = (opening) => `export const WARM_PAIR = Object.freeze(${JSON.stringify({ cluster: 'mainnet', mint: null, pair: PAIR, opening, close })});\n`;
const CASES = [
  { name: 'as committed', module: null, chain: null, open: false, reads: 0 },
  { name: 'the pool stands and trades', module: named(passed), chain: { owner: DLMM, data: [activation(Date.parse(passed)), 'base64'], lamports: 1, executable: false, rentEpoch: 0, space: 8 }, open: true, reads: 1 },
  { name: 'the pool is not on chain', module: named(passed), chain: null, open: false, reads: 1 },
  { name: 'the opening is not reached', module: named(ahead), chain: { owner: DLMM, data: [activation(Date.parse(passed)), 'base64'], lamports: 1, executable: false, rentEpoch: 0, space: 8 }, open: false, reads: 0 },
];

async function visit([W, H], c) {
  const tag = `${W}x${H}, ${c.name}`, v = { size: `${W}x${H}`, case: c.name, reads: [] };
  out.visits.push(v);
  const ok = (cond, what, detail) => check(cond, `${tag}: ${what}`, detail);
  const p = await page(async (q, send) => {
    const url = q.request.url;
    try {
      if (url.startsWith(RPC)) {
        v.reads.push({ method: q.request.method, body: q.request.postData ? JSON.parse(q.request.postData) : null });
        const body = JSON.stringify({ jsonrpc: '2.0', id: 1, result: { context: { slot: 1 }, value: c.chain } });
        await send('Fetch.fulfillRequest', { requestId: q.requestId, responseCode: 200, body: b64(body),
          responseHeaders: [{ name: 'content-type', value: 'application/json' }, { name: 'access-control-allow-origin', value: '*' }] });
      } else if (c.module && /\/warm-pair\.mjs(\?|$)/.test(url)) {
        await send('Fetch.fulfillRequest', { requestId: q.requestId, responseCode: 200, body: b64(c.module), responseHeaders: [{ name: 'content-type', value: 'text/javascript' }] });
      } else await send('Fetch.continueRequest', { requestId: q.requestId });
    } catch (e) { out.errors.push(`${tag}: ${e.message}`); }
  });
  try {
    await p.send('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 1, mobile: false });
    await p.send('Fetch.enable', { patterns: [{ urlPattern: '*warm-pair.mjs*', requestStage: 'Request' }, { urlPattern: `${RPC}*`, requestStage: 'Request' }] });
    await p.send('Page.navigate', { url: URL_ });
    const made = await p.until(`(() => { const l = document.querySelector('[data-mint-line]'); return !!l && l.textContent.length > 0; })()`, 30000);
    ok(made, "the page made its paywall (the window's line is written)");
    if (c.open) await p.until(`!document.querySelector('[data-warm-door]')?.hidden`, 6000);
    await sleep(1500);   // a read in flight answers in milliseconds here: the door's state has settled
    v.door = await p.js(`(async () => { const d = document.querySelector('[data-warm-door]'); if (!d) return null;
      const dt = d.closest('dt'); dt.scrollIntoView({ block: 'center', behavior: 'instant' });
      await new Promise((f) => requestAnimationFrame(() => requestAnimationFrame(f)));
      const r = d.getBoundingClientRect(), hit = r.width ? document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2) : null;
      return { hidden: d.hidden, href: d.getAttribute('href'), text: d.textContent, label: d.getAttribute('aria-label'), target: d.target, rel: d.rel,
        shown: d.checkVisibility({ visibilityProperty: true }) && r.width > 0 && r.height > 0, onTop: !!hit && (hit === d || d.contains(hit)),
        inTitle: !!d.closest('.snowtrace-tokens dt'), titleShown: dt.checkVisibility({ visibilityProperty: true }) && dt.getBoundingClientRect().height > 0,
        rect: [r.left, r.top, r.width, r.height].map(Math.round), scrollY: Math.round(scrollY) }; })()`);
    const d = v.door;
    ok(d?.titleShown && d.inTitle, "$WARM's title stands on the page, the door in it", d);
    if (c.open) {
      ok(d && !d.hidden && d.shown && d.onTop, 'the door is open and nothing covers it', d);
      ok(d?.href === doorHref(PAIR), "it leads to the pair's page on Meteora", d?.href);
      ok(d?.text === 'Buy $WARM ↗' && d.label === 'Buy $WARM' && d.target === '_blank' && /noopener/.test(d.rel), 'it says Buy $WARM and opens apart', d);
    } else ok(d && d.hidden && !d.shown && d.href === null, 'the door is shut, with no address', d);
    ok(v.reads.length === c.reads, `the chain is read ${c.reads} time${c.reads === 1 ? '' : 's'}`, v.reads.length);
    for (const r of v.reads) {
      const prm = r.body?.params ?? [];
      ok(r.method === 'POST' && r.body?.method === 'getAccountInfo' && prm[0] === PAIR && prm[1]?.dataSlice?.offset === ACTIVATION_AT && prm[1]?.dataSlice?.length === 8,
        "the read is 8 bytes of the pair's account, its activation point", r);
    }
    if (c.open && SHOTS && d) {
      fs.mkdirSync(SHOTS, { recursive: true });
      const box = await p.js(`(() => { const r = document.querySelector('.snowtrace-tokens').getBoundingClientRect(); return [r.left, r.top + scrollY, r.width, r.height]; })()`);
      const shot = await p.send('Page.captureScreenshot', { format: 'png', clip: { x: Math.max(0, box[0] - 16), y: Math.max(0, box[1] - 16), width: box[2] + 32, height: box[3] + 32, scale: 2 } });
      if (shot.result?.data) { const f = path.join(SHOTS, `warm-door-${v.size}.png`); fs.writeFileSync(f, Buffer.from(shot.result.data, 'base64')); v.shot = f; }
    }
    ok(p.errs.length === 0, 'the page throws nothing', p.errs);
  } finally { await p.close(); }
}

try {
  for (const size of SIZES) for (const c of CASES) await visit(size, c);
  const failed = out.checks.filter((c) => !c.ok);
  code = failed.length || out.errors.length ? 1 : 0;
  console.log(`${code ? 'FAIL' : 'PASS'}: ${out.checks.length - failed.length} of ${out.checks.length} checks, ${out.visits.length} visits${out.errors.length ? `, errors: ${out.errors.join('; ')}` : ''}`);
} catch (e) {
  out.errors.push(String(e?.stack ?? e).slice(0, 400)); code = 2;
  console.log(JSON.stringify(out, null, 1));
}
if (opt('--json', null)) fs.writeFileSync(opt('--json'), JSON.stringify(out, null, 1));
end();

#!/usr/bin/env node
// tracenet.proof.mjs: THE PORTAL AND THE VAULT, proved on a door of their own: this folder's app/ and vault/ served as optimism.fit serves them,
// the Worker's handler (worker/premint.mjs with the vault) on /vault/* and /api/premint/*, an orders table in memory holding two paid stand-in
// receipts, a Gold Mint one and a Bronze Mint one (signatures that were never transactions), each its own wallet's, a key made by this proof,
// which signs the request's seat proof (x-seat; an order id opens nothing), no Solana, no purchase, nothing posted. THE LAW,
// tiered (app/tracenet-register.mjs): the Gold receipt opens the drop at once, the Bronze one and everyone on day 15. Then a muted headless Chrome off every screen
// opens the page as a visitor and the door counts what the page asked for; the pictures go to --out.
//   node lab/tracenet.proof.mjs --out <dir> [--site <dir>] [--chrome <path>] [--no-chrome]
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, mkdtempSync, statSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { join, extname, resolve, dirname } from 'node:path';
import { tmpdir, hostname, loadavg } from 'node:os';
import { fileURLToPath } from 'node:url';
import { DatabaseSync } from 'node:sqlite';
import { createHandler } from '../worker/premint.mjs';
import { RECIPIENT, TERMS, encode58, seatSignIn, sealSeatProof } from '../app/dl-direct-protocol.mjs';
import { opensAt, opensFor, readManifest, DAY_MS } from '../app/tracenet-register.mjs';

const here = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, fallback) => { const i = process.argv.indexOf(name); return i > 0 ? process.argv[i + 1] : fallback; };
const out = resolve(arg('--out', join(here, 'lab', 'tracenet-pictures')));
// the register and the vault under proof are the fixture site's (worker/fixtures/tracenet-site: one register, one drop, never built, never served); the page is this folder's
const site = resolve(arg('--site', join(here, 'worker', 'fixtures', 'tracenet-site')));
const CHROMES = [arg('--chrome', null), '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'].filter(Boolean);
const CHROME = process.argv.includes('--no-chrome') ? null : CHROMES.find((c) => existsSync(c));
const HANDLE = 'photons_enjoyor', PAID = 'deadcafe-0000-4000-8000-00000000aa01', GOLD = 'deadcafe-0000-4000-8000-00000000aa06';   // PAID: a Bronze Mint receipt
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.md': 'text/markdown', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };

// the site's assets, from this folder (app/ and vault/ only: the rest of optimism.fit is not under proof here)
const assets = { fetch: async (request) => {
  const path = new URL(request.url).pathname;
  // THE TRAIL'S END (lane/the-trails-end, Oct 31 2026): the page's modules reach ../../ (the site's root: room/, poleis/, the token sheet, the fonts, the
  // brand, qrcode-generator.js, as the build ships them from embertide-app/ui/intro), so this door serves that tree at the root as optimism.fit does
  if (!/^\/(app|vault|room|poleis|fonts|brand)\/[A-Za-z0-9._\/-]+$|^\/(harmony-accent\.css|qrcode-generator\.js)$/.test(path) || path.includes('..')) return new Response('not found', { status: 404 });
  const file = join(/^\/(vault\/|app\/tracenet\/)/.test(path) ? site : /^\/app\//.test(path) ? here : join(here, '..'), path);   // here is dyson-society/; its parent is embertide-app/ui/intro, the site's root
  if (!existsSync(file) || !statSync(file).isFile()) return new Response('not found', { status: 404 });
  const body = readFileSync(file);
  return new Response(body, { headers: { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'content-length': String(body.length) } });
} };
const db = new DatabaseSync(':memory:');
// the D1 the door reads: every migration in order, as worker/space-router.proof.mjs lays it. Since BRONZE IS A SUBSCRIPTION (5822b3fdc, Oct 23 2026:
// "a Gold seat won by a sealed bid holds Gold for its access month alone") the vault reads a wallet's rows joined to gold_bids (migration 0005); on the
// first two migrations alone that read threw, the door swallowed it as no rows, and every receipt met 402 (the red the sweep found, Nov 1 2026)
for (const name of readdirSync(join(here, 'worker', 'migrations')).filter((n) => n.endsWith('.sql')).sort()) db.exec(readFileSync(join(here, 'worker', 'migrations', name), 'utf8'));
const insert = db.prepare("INSERT INTO premint_orders(id,tier,buyer,recipient,lamports,sol_usd,created_at,expires_at,blockhash,last_valid_block_height,terms_version,github,signature,status) VALUES(?,?,?,?,'100000000','100',1000,1090,'blockhash',200,?,'',?,?)");
// each receipt's wallet: a key made here, never anyone's wallet
const wallet = async () => { const pair = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']); return { pair, address: encode58(new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))) }; };
const W = { bronze: await wallet(), gold: await wallet() };
insert.run(PAID, 'bronze', W.bronze.address, RECIPIENT, TERMS, 'stand-in-never-a-transaction', 'paid');
insert.run(GOLD, 'gold', W.gold.address, RECIPIENT, TERMS, 'stand-in-never-a-transaction-either', 'paid');
const DB = { prepare(sql) { return { bind(...params) { return { first: async () => db.prepare(sql).get(...params) ?? null, all: async () => ({ results: db.prepare(sql).all(...params) }), run: async () => ({ meta: { changes: db.prepare(sql).run(...params).changes } }) }; }, first: async () => db.prepare(sql).get() ?? null, all: async () => ({ results: db.prepare(sql).all() }) }; } };
const clock = { ms: Date.now() };
const env = { DB, PREMINT_ENABLED: 'true', ASSETS: assets };
const handle = createHandler({ clock: () => Math.floor(clock.ms / 1000), clockMs: () => clock.ms, fetcher: async () => { throw new Error('no network under proof'); } });
const asked = [];
const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://127.0.0.1');
  asked.push(`${req.method} ${url.pathname}${url.search}`);
  const chunks = []; for await (const c of req) chunks.push(c);
  const request = new Request(`https://optimism.fit${req.url}`, { method: req.method, headers: req.headers, body: chunks.length ? Buffer.concat(chunks) : undefined });
  const response = await handle(request, env);
  res.writeHead(response.status, Object.fromEntries(response.headers));
  res.end(Buffer.from(await response.arrayBuffer()));
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const origin = `http://127.0.0.1:${server.address().port}`;
const register = readManifest(JSON.parse(readFileSync(join(site, 'app', 'tracenet', `${HANDLE}.json`), 'utf8')), HANDLE), drop = register.items[0];
const dropUrl = `${origin}/vault/${HANDLE}/${drop.id}/${drop.file}`;
const timed = async (label, url, init = {}) => { const t0 = performance.now(); const r = await fetch(url, init); const bytes = new Uint8Array(await r.arrayBuffer()); return { label, status: r.status, ms: +(performance.now() - t0).toFixed(2), bytes: bytes.length, sha256: createHash('sha256').update(bytes).digest('hex'), cache: r.headers.get('cache-control'), disposition: r.headers.get('content-disposition'), body: r.status !== 200 ? new TextDecoder().decode(bytes) : null }; };
const iso = (ms) => new Date(ms).toISOString();
// the wallet's seat proof as its page sends it, signed at the door's instant (the Worker's clock) for the host the Worker sees
const seat = async (w) => { const text = seatSignIn({ host: 'optimism.fit', origin: 'https://optimism.fit', address: w.address, now: clock.ms }); return { 'x-seat': sealSeatProof(text, new Uint8Array(await crypto.subtle.sign('Ed25519', w.pair.privateKey, new TextEncoder().encode(text)))) }; };
const R = { at: new Date().toISOString(), host: hostname(), load: loadavg().map((l) => +l.toFixed(1)), drop: { id: drop.id, bytes: drop.bytes, sha256: drop.sha256, published: drop.published, gold: iso(opensFor(drop, 'gold')), bronze: iso(opensFor(drop, 'bronze')), opensAt: iso(opensAt(drop)) }, door: {}, page: null };
clock.ms = Date.parse(drop.published) + 1000;   // the drop just published
R.door.visitor = await timed('a visitor, the day it lands', dropUrl);
R.door.gold = await timed('a Gold Mint receipt, the day it lands', dropUrl, { headers: await seat(W.gold) });
R.door.goldHead = await timed('a Gold Mint receipt, HEAD', dropUrl, { method: 'HEAD', headers: await seat(W.gold) });
R.door.bronze = await timed('a Bronze Mint receipt, the day it lands', dropUrl, { headers: await seat(W.bronze) });
R.door.bareId = await timed('the Gold Mint order id alone (as its payment\'s memo shows it), the day it lands', dropUrl, { headers: { 'x-receipt': GOLD } });
R.door.unpaid = await timed('a wallet with no receipt, signed in, the day it lands', dropUrl, { headers: await seat(await wallet()) });
clock.ms = opensAt(drop) - 1; R.door.lastMs = await timed('a visitor, the last millisecond before day 15', dropUrl);
R.door.lastMsBronze = await timed('a Bronze Mint receipt, the last millisecond before day 15', dropUrl, { headers: await seat(W.bronze) });
clock.ms = opensAt(drop); R.door.day15 = await timed('a visitor, day 15', dropUrl);
R.door.day15Bronze = await timed('a Bronze Mint receipt, day 15', dropUrl, { headers: await seat(W.bronze) });
clock.ms = opensAt(drop) + 30 * DAY_MS; R.door.day45 = await timed('a visitor, day 45', dropUrl);
clock.ms = Date.now();
R.door.register = await timed('the register', `${origin}/app/tracenet/${HANDLE}.json`);
R.door.page = await timed('the page', `${origin}/app/tracenet.html?of=${HANDLE}`);
const bronzeBody = JSON.parse(R.door.bronze.body ?? '{}');
const ok = R.door.visitor.status === 402 && R.door.gold.status === 200 && R.door.gold.sha256 === drop.sha256 && R.door.gold.bytes === drop.bytes && R.door.goldHead.status === 200 && R.door.goldHead.bytes === 0 &&
  R.door.bronze.status === 402 && bronzeBody.opensAt === iso(opensFor(drop, 'bronze')) && bronzeBody.tier === 'bronze' &&
  R.door.bareId.status === 402 && R.door.unpaid.status === 402 && R.door.lastMs.status === 402 && R.door.lastMsBronze.status === 402 && R.door.day15.status === 200 && R.door.day15.sha256 === drop.sha256 &&
  R.door.day15Bronze.status === 200 && R.door.day45.status === 200 && R.door.register.status === 200 && R.door.page.status === 200;
R.door.verdict = ok ? 'HOLDS' : 'FAILS';
// a muted headless Chrome off every screen, driven over CDP: a device the size of the glass (a phone is a phone: mobile metrics, scale 2),
// the page opened as a visitor, its paint waited for by its own rows, the window's own width against the document's (no sideways scroll),
// the title, the rows, then the picture
async function chromePage({ url, width, height, mobile, png }) {
  const profile = mkdtempSync(join(tmpdir(), 'tracenet-proof-'));
  const child = spawn(CHROME, ['--headless=new', '--mute-audio', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check', `--user-data-dir=${profile}`, '--remote-debugging-port=0', '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
  const t0 = performance.now();
  try {
    const portFile = join(profile, 'DevToolsActivePort');
    for (let i = 0; i < 100 && !existsSync(portFile); i++) await new Promise((r) => setTimeout(r, 100));
    const port = readFileSync(portFile, 'utf8').split('\n')[0];
    const target = (await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()).find((t) => t.type === 'page');
    const ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
    let id = 0; const waiting = new Map(), events = [];
    ws.onmessage = (m) => { const msg = JSON.parse(m.data); if (msg.id && waiting.has(msg.id)) { waiting.get(msg.id)(msg); waiting.delete(msg.id); } else if (msg.method) events.push(msg); };
    const send = (method, params = {}) => new Promise((r) => { const n = ++id; waiting.set(n, (msg) => r(msg.result ?? msg.error)); ws.send(JSON.stringify({ id: n, method, params })); });
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: mobile ? 2 : 1, mobile });
    await send('Page.enable');
    await send('Runtime.enable');   // the page's own errors: exceptions and console errors, read after the paint
    await send('Page.navigate', { url });
    const read = async () => (await send('Runtime.evaluate', { expression: 'JSON.stringify({w: innerWidth, sw: document.documentElement.scrollWidth, h: innerHeight, sh: document.documentElement.scrollHeight, title: document.title, rows: document.querySelectorAll("#tt-drop:not([hidden])").length, status: document.getElementById("tt-status")?.textContent ?? null, seats: [...document.querySelectorAll("[data-mint-tier]")].filter((b) => !b.hidden && !b.disabled).map((b) => b.dataset.mintTier + ": " + b.textContent.trim()), law: null, mint: null})', returnByValue: true })).result?.value;
    let page = null;
    for (let i = 0; i < 60; i++) { page = JSON.parse(await read() ?? 'null'); if (page && (page.rows > 0 || page.status)) break; await new Promise((r) => setTimeout(r, 100)); }
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    if (shot?.data) writeFileSync(png, Buffer.from(shot.data, 'base64'));
    ws.close();
    const errors = events.filter((e) => e.method === 'Runtime.exceptionThrown' || (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error'))
      .map((e) => String(e.params.exceptionDetails?.exception?.description ?? e.params.exceptionDetails?.text ?? e.params.args?.map((a) => a.value ?? a.description).join(' ')).slice(0, 200));
    return { ...page, errors, sideways: page ? page.sw > page.w : null, ms: +(performance.now() - t0).toFixed(0), png: existsSync(png) ? statSync(png).size : null };
  } finally { child.kill('SIGKILL'); await new Promise((r) => child.on('exit', r)); rmSync(profile, { recursive: true, force: true }); }
}
if (CHROME) {
  mkdirSync(out, { recursive: true });
  R.page = { chrome: CHROME, shots: {} };
  for (const [name, width, height, mobile] of [['1-a-visitor-1440x900', 1440, 900, false], ['2-a-visitor-on-a-phone-390x844', 390, 844, true]]) {
    asked.length = 0;
    const shot = await chromePage({ url: `${origin}/app/tracenet.html?of=${HANDLE}`, width, height, mobile, png: join(out, `${name}.png`) });
    R.page.shots[name] = { ...shot, asked: [...asked] };
  }
  // THE TRAIL'S END (lane/the-trails-end, Oct 31 2026): the page shows the first trace alone (#tt-drop), sells no seat (the mint does), and names no one
  // (its title is "Your tracenet", never the register's name): the rows are the one trace, the seats none, the title the page's own.
  R.page.verdict = Object.values(R.page.shots).every((s) => s.rows === Math.min(1, register.items.length) && s.sideways === false && s.seats?.length === 0 && s.errors.length === 0 && s.title.startsWith('Your tracenet') && !s.title.includes(register.name)) ? 'HOLDS' : 'FAILS';
}
server.close();
console.log(JSON.stringify(R, null, 2));
process.exit(ok && (!R.page || R.page.verdict === 'HOLDS') ? 0 : 1);

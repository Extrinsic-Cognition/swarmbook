#!/usr/bin/env node
// mint-dev.mjs: THE MINT'S DEV SERVER, the local road (his Oct 22 2026 14:2x WEST, over the download: "make me debug locally, you are not going to
// oneshot this... i want it to be complete with a live link that has a cookie in the installer so we know when the user logs into harmony which
// browser session it was"). One port on this Mac's loopback that is optimism.fit for one person:
// - the page, as the static preview serves it (proxied byte for byte to serve-range, ranges and all); / opens the mint on the local road;
// - the Worker's own handler (worker/premint.mjs) against a SQLite file holding every migration (worker/premint.test.mjs's D1 adapter), the gate
//   armed by the local release (app/nestos-release.local.json, HARMONY_RELEASE);
// - the installer the local release names: DysonLight Harmony, zipped from the app installed here (~/Applications/Embertide.app: Embertide is only
//   its package name, tools/brand/names.tsv; its face is DysonLight Harmony), the bundle under its face's name with its signature untouched (a
//   bundle's folder name is not sealed). Every download is logged with the visit and Athena's answer its address carries (?s=, ?a=);
// - /dev/installs: what Harmony has reported (the premint_installs rows), to read while debugging;
// - with --lan, her step out of the Mac into the iPhone (app/dl-handoff.mjs, harmony-clip/) in the house: / opens the page in handoff mode and
//   /dev/lan names the house's Nest (--nest <url>, else this Mac's 8904 head: the primary, or a replica's upstream) and this glass (--glass <seat>,
//   the scene entity the card sits on), which the page's code carries to the phone. Her words go on the Nest itself (THE HANDOFF JOINS THE ONENESS:
//   the phone's signed her.handoff entries, stamped with the station's count), and the page hears them on the Nest's stream: no door here.
// No money moves here: Solana's reads and the price answer from a stand-in, and a broadcast is refused. Bronze by card reaches Stripe only with test
// keys named in this shell (STRIPE_SECRET_KEY=sk_test_..., STRIPE_PRICE_BRONZE, STRIPE_WEBHOOK_SECRET from `stripe listen --forward-to
// 127.0.0.1:9060/api/premint/bronze/stripe`); a live key is refused.
//   node tools/mint-dev.mjs [--port 9060] [--static http://127.0.0.1:9059] [--app ~/Applications/Embertide.app] [--rebuild-zip] [--start <seconds>|off] [--lan [--nest <url>] [--glass <seat>]]
// --start: where / sends the page's film (dl-twelve-clock.js ?debug=<seconds>), his checkpoint for a scene he is shaping; off (the default) is the film's top
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync, readdirSync, mkdirSync, existsSync, statSync, createReadStream, rmSync, renameSync, writeFileSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createHandler } from '../worker/premint.mjs';
import { GENESIS, encode58 } from '../app/dl-direct-protocol.mjs';
import { INSTALLER_NAMES, DEV_PORT } from '../app/harmony-link.mjs';   // THE LINK: the installer's name and the local road's port, as Harmony reads them

export const ZIP_NAME = INSTALLER_NAMES[0], APP_FACE = 'DysonLight Harmony.app', LOCAL_RELEASE = '/app/nestos-release.local.json';
export const SITE_ROOT = '/intro/dyson-society';   // optimism.fit's root is this folder of embertide-app/ui
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const PORT = Number(opt('--port', String(DEV_PORT))), STATIC = new URL(opt('--static', 'http://127.0.0.1:9059'));
const START = ((v) => (v === 'off' || (Number.isFinite(Number(v)) && Number(v) >= 2) ? v : 'off'))(opt('--start', 'off'));   // ?debug's own law: off, or a second from 2
const APP = opt('--app', path.join(os.homedir(), 'Applications/Embertide.app')), CACHE = path.join(os.homedir(), 'Library/Caches/gg.embertide.mint-dev');
const LAN = args.includes('--lan'), NEST_OPT = opt('--nest', null), GLASS = opt('--glass', null), NEST_PORT = 8904;
const run = promisify(execFile);
const HOP = new Set(['host', 'connection', 'keep-alive', 'content-length', 'transfer-encoding', 'upgrade']);   // a hop's own, not the request's

/** database(file): a SQLite file with every migration applied once, in order, behind the D1 calls the Worker makes. */
export function database(file) {
  const db = new DatabaseSync(file);
  db.exec('CREATE TABLE IF NOT EXISTS dev_migrations(name TEXT PRIMARY KEY)');
  const dir = new URL('../worker/migrations/', import.meta.url);
  for (const name of readdirSync(dir).filter((n) => n.endsWith('.sql')).sort()) {
    if (db.prepare('SELECT 1 FROM dev_migrations WHERE name=?').get(name)) continue;
    db.exec(readFileSync(new URL(name, dir), 'utf8')); db.prepare('INSERT INTO dev_migrations(name) VALUES(?)').run(name);
  }
  const DB = { prepare(sql) { return { bind(...params) { return { first: async () => db.prepare(sql).get(...params) ?? null, all: async () => ({ results: db.prepare(sql).all(...params) }), run: async () => ({ meta: { changes: db.prepare(sql).run(...params).changes } }) }; }, first: async () => db.prepare(sql).get() ?? null, all: async () => ({ results: db.prepare(sql).all() }) }; } };
  return { db, DB };
}
/** vaultOnDisk(dir): R2's two calls the Worker makes (get, put), on a folder: a creator's drops on the local road (worker/creators.mjs). */
export function vaultOnDisk(dir) {
  const fileOf = (key) => { const p = path.normalize(path.join(dir, key)); if (!p.startsWith(dir + path.sep)) throw new Error('key outside the vault'); return p; };
  return {
    async put(key, bytes, opts = {}) { const p = fileOf(key); mkdirSync(path.dirname(p), { recursive: true }); writeFileSync(p, bytes); writeFileSync(`${p}.meta.json`, JSON.stringify({ contentType: opts.httpMetadata?.contentType ?? 'application/octet-stream', ...(opts.customMetadata ?? {}) })); },
    async get(key) { const p = fileOf(key); if (!existsSync(p)) return null; const meta = JSON.parse(readFileSync(`${p}.meta.json`, 'utf8')); const bytes = readFileSync(p); return { body: bytes, size: bytes.length, httpMetadata: { contentType: meta.contentType }, customMetadata: meta }; },
  };
}
/** standIn: Solana's reads and the price, answered here; a broadcast refused. No money moves on the local road. */
export async function standIn(url, opts) {
  if (String(url).startsWith('https://api.stripe.com/')) return fetch(url, opts);   // Stripe in test mode (the env refuses a live key): the card road for real, no money
  if (String(url).includes('coinbase')) return Response.json({ data: { base: 'SOL', currency: 'USD', amount: '150' } });
  const { method } = JSON.parse(opts?.body || '{}');
  if (method === 'sendTransaction') throw new Error('the mint dev server never broadcasts');
  const result = { getGenesisHash: GENESIS, getLatestBlockhash: { value: { blockhash: encode58(new Uint8Array(32).fill(7)), lastValidBlockHeight: 1e9 } },
    getBlockHeight: 1, getTransaction: null, getSignatureStatuses: { value: [null] } }[method];
  return Response.json({ result: result ?? null });
}
/** zipOf(app, cache, rebuild): DysonLight Harmony zipped (the installed bundle under its face's name), made once and kept in the cache. */
export async function zipOf(app = APP, cache = CACHE, rebuild = false) {
  const zip = path.join(cache, ZIP_NAME);
  if (existsSync(zip) && !rebuild) return zip;
  if (!existsSync(path.join(app, 'Contents/Info.plist'))) throw new Error(`no app at ${app}`);
  const stage = path.join(cache, 'stage'), part = `${zip}.part`;
  rmSync(stage, { recursive: true, force: true }); mkdirSync(stage, { recursive: true });
  await run('ditto', [app, path.join(stage, APP_FACE)]);
  await run('ditto', ['-c', '-k', '--sequesterRsrc', '--keepParent', path.join(stage, APP_FACE), part]);
  renameSync(part, zip); rmSync(stage, { recursive: true, force: true });
  return zip;
}

/** houseOf(head, local): the house's Nest from a Nest head read at `local`: the primary itself, a replica's upstream, else null. Pure. */
export function houseOf(head, local) {
  if (!head || typeof head !== 'object') return null;
  if (head.role === 'primary') return local;
  return typeof head.upstream === 'string' && /^https?:\/\//.test(head.upstream) ? head.upstream.replace(/\/+$/, '') : null;
}
/** nestOf(local): the house's Nest by this Mac's own Nest at `local` (one read of its head), or null when none answers. */
export async function nestOf(local = `http://127.0.0.1:${NEST_PORT}`) {
  try {
    const r = await fetch(`${local}/nest/head`, { cache: 'no-store', signal: AbortSignal.timeout(3000) });
    return r.ok ? houseOf(await r.json(), local) : null;
  } catch { return null; }
}

const proxy = (req, res, pathOverride) => {   // byte for byte to the static preview: its ranges, its headers, its redirects
  const up = http.request({ host: STATIC.hostname, port: STATIC.port, method: req.method, path: pathOverride ?? req.url, headers: { ...req.headers, host: STATIC.host } }, (r) => {
    res.writeHead(r.statusCode, r.headers); r.pipe(res);
  });
  up.on('error', () => { if (!res.headersSent) { res.writeHead(502, { 'content-type': 'text/plain' }); res.end(`The static preview at ${STATIC.href} is not answering: start mint-lane first.`); } });
  req.pipe(up);
};
const readBody = (req) => new Promise((resolve, reject) => { const parts = []; req.on('data', (c) => parts.push(c)); req.on('end', () => resolve(Buffer.concat(parts))); req.on('error', reject); });

export async function serve({ port = PORT } = {}) {
  mkdirSync(CACHE, { recursive: true });
  const { db, DB } = database(path.join(CACHE, 'premint.sqlite'));
  const assets = { fetch: (request) => fetch(new URL(SITE_ROOT + new URL(request.url).pathname, STATIC), { cache: 'no-store' }) };   // optimism.fit's paths in this tree
  const stripe = Object.fromEntries(['STRIPE_SECRET_KEY', 'STRIPE_PRICE_BRONZE', 'STRIPE_WEBHOOK_SECRET'].filter((k) => process.env[k]).map((k) => [k, process.env[k]]));   // BRONZE BY CARD: Stripe's test keys from this shell, never a file
  if (stripe.STRIPE_SECRET_KEY && !stripe.STRIPE_SECRET_KEY.startsWith('sk_test_')) throw new Error('mint-dev takes Stripe test keys only (sk_test_...)');
  const env = { DB, PREMINT_ENABLED: 'true', ASSETS: assets, HARMONY_RELEASE: LOCAL_RELEASE, VAULT: vaultOnDisk(path.join(CACHE, 'vault')), ...stripe };   // VAULT: R2's stand-in, a folder
  const handle = createHandler({ fetcher: standIn });
  const nest = LAN ? (NEST_OPT ?? await nestOf()) : null;   // THE HOUSE: where the phone writes her words and the page hears them
  let zip = null;
  const making = zipOf(APP, CACHE, args.includes('--rebuild-zip')).then((z) => { zip = z; console.log(`mint-dev: ${ZIP_NAME} ready (${(statSync(z).size / 1048576).toFixed(1)} MB) from ${APP}`); })
    .catch((e) => console.log(`mint-dev: no installer: ${e.message}`));
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://${req.headers.host || `127.0.0.1:${port}`}`);
    try {
      if (url.pathname === '/') { res.writeHead(302, { location: `${SITE_ROOT}/app/warm.html?debug=${START}&harmony=local${LAN ? '&handoff=lan' : ''}`, 'cache-control': 'no-store' }); res.end(); return; }
      if (url.pathname === '/dev/lan') {   // the house for the page's code: the Nest her words go on, and the glass the card sits on
        res.writeHead(LAN ? 200 : 404, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(LAN ? { nest, glass: GLASS } : { nest: null, glass: null })); return;
      }
      if (url.pathname === `/dev/${ZIP_NAME}`) {
        await making;
        if (!zip) { res.writeHead(503, { 'content-type': 'text/plain' }); res.end('The installer could not be made: see the dev server\'s log.'); return; }
        console.log(`mint-dev: download  visit=${url.searchParams.get('s') ?? '-'}  athena=${url.searchParams.get('a') ?? '-'}`);
        res.writeHead(200, { 'content-type': 'application/zip', 'content-length': statSync(zip).size, 'content-disposition': `attachment; filename="${ZIP_NAME}"`, 'cache-control': 'no-store' });
        if (req.method === 'HEAD') { res.end(); return; }
        createReadStream(zip).pipe(res); return;
      }
      if (url.pathname === '/dev/installs') { res.writeHead(200, { 'content-type': 'application/json', 'cache-control': 'no-store' }); res.end(JSON.stringify(db.prepare('SELECT visit,athena,via,installed_at,saved_at FROM premint_installs ORDER BY installed_at DESC').all(), null, 1)); return; }
      if (url.pathname.startsWith('/api/premint/')) {
        const body = req.method === 'GET' || req.method === 'HEAD' ? undefined : await readBody(req);
        const headers = Object.fromEntries(Object.entries(req.headers).filter(([k]) => !HOP.has(k)));
        const answer = await handle(new Request(url, { method: req.method, headers, body }), env);
        if (url.pathname === '/api/premint/install' && req.method === 'POST') console.log(`mint-dev: install   ${answer.status} ${body}`);
        res.writeHead(answer.status, Object.fromEntries(answer.headers)); res.end(Buffer.from(await answer.arrayBuffer())); return;
      }
      proxy(req, res);
    } catch (error) { if (!res.headersSent) res.writeHead(500, { 'content-type': 'text/plain' }); res.end(String(error?.message || error)); }
  });
  await new Promise((resolve) => server.listen(port, '127.0.0.1', resolve));
  console.log(`mint-dev: http://mint-dev.localhost:${port}/  (the page proxied from ${STATIC.href}; the Worker on ${path.join(CACHE, 'premint.sqlite')})`);
  if (LAN) console.log(`mint-dev: her step out: the house's Nest ${nest ?? 'NONE (name it: --nest <url>)'}, this glass ${GLASS ?? 'NONE (name it: --glass <seat>)'}`);
  return server;
}

if (import.meta.url === `file://${process.argv[1]}`) serve();

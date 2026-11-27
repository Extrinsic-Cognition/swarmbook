#!/usr/bin/env node
// THE X DOOR: his X profile on the Nest. His words, Oct 12 2026 08:33 WEST, over the Mac's onboarding (the Lyssajudron card, its paint, the Spotify
// tile): "before this is shown... can you show me proper delightful ux for connecting twitter profile? like... i need to start using twitter thing...
// do you understand me dude?". The onboarding's first step is his X; this door is its hand on this Mac.
//
// Why a door and not the page: his Harmony window (harmony-mac/native/Shell.swift) cancels every navigation off its own list and every new window, so
// x.com never loads inside it, and a sign-in typed into an app's web view is the worst way in. The door opens X's own consent page in his default
// browser, where he is already signed in (one tap: Authorize app), takes the callback on this Mac's loopback, trades the code for a token through
// the house's X app worker (embertide-app/site/account.html's: a public client with PKCE, the worker holds the exchange and /me), writes his profile
// on the Nest (IDENTITY_REF, compare-and-swap, seat x-door: one user, one Nest, so every glass knows who he is) and brings the Harmony window back to
// the front. The token is used once for /me and dropped: nothing of X's is kept but what his profile shows the world.
//
//   node x-door.mjs [--port 8936] [--no-open]    (--no-open: a proof's door, it answers the address and opens no browser)
// Routes (127.0.0.1 only; a page of this Mac's loopback gets its Origin echoed, never *):
//   GET  /x/state     {connected: the Nest's profile or null, pending: n, last: {ok, error, at}}
//   POST /x/begin     a PKCE pair and a state (10 min), X's authorize address; opens it in his browser  -> {url, opened}
//   GET  /x/callback  X's answer: the state checked, the code traded, the profile written, the window brought forward; a small page for the tab
//   POST /x/forget    his profile off the Nest (value null)
// THE ADDRESS X ANSWERS (09:1x, his "fix it" after X's consent page said "Something went wrong" for http://127.0.0.1:8936/x/callback): X answers only to
// the callbacks its app lists, and the house's app (OnlyTraces, client bXlx...) lists https://onlytraces.fit/ and the dev page
// http://localhost:8990/holytraces.html (antimirror-marketplace/auth/README.md; read back from X itself on Oct 12: it sent both a code, refused the
// rest). He had authorized the app before, so X answers at once, no consent tap. 8990 is the release server's (nest-release/serve.mjs, IPv4 *:8990),
// but a browser asks localhost on IPv6 first (his Brave reached [::1]:8990, Oct 12). So while a sign-in is in the air the door holds [::1]:8990 (the
// catcher): X's answer at /holytraces.html is the door's, every other request passes to the release server on 127.0.0.1:8990 untouched, and the
// door lets go as soon as nothing is pending (or after STATE_MS). --callback loopback goes back to /x/callback here, if he ever lists it.
// Cost: an idle socket; a sign-in is three https calls and one Nest write, and [::1]:8990 held for its few seconds.
import http from 'node:http';
import fs from 'node:fs';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFile } from 'node:child_process';

export const IDENTITY_REF = 'identity/x';
export const X_CLIENT_ID = 'bXlxcHpiaXF2WUoyRFB5SENhQk06MTpjaQ';   // the house's X app (account.html, holytraces.html): a public client, PKCE
export const X_WORKER = 'https://holytraces-x-auth.guido-e95.workers.dev';   // its exchange: POST /token {code, code_verifier, redirect_uri}, GET /me (Bearer)
export const X_AUTHORIZE = 'https://x.com/i/oauth2/authorize';
export const SCOPES = 'tweet.read users.read';
export const APP_BUNDLE = 'gg.embertide.harmony-mac';   // the Harmony window's app: brought forward when X answers
export const SITE = process.env.EMBERTIDE_SOCIETY_SITE || 'https://optimism.fit', WALL_PATH = '/space-router/v1/portrait', SWARMBOOK = 'https://swarmbook.com/', MAKING = `${SWARMBOOK}app/warm.html?door=deposit&then=making`;   // X CARRIES HER IN: where an X account with no Swarmy makes one; where one paid and not coloured yet is given her colours
export const X_HOLDS = '/space-router/v1/x';   // X HOLDS THE FLASK (Nov 19 2026, his "when they use twitter on the harmony app they see balance"; the site's law: dyson-society/app/space-router-x.mjs): the site trades the code itself and lets this Mac's key spend the flask this X account holds
export const LIGHT_REF = 'scene/entities/golem-lyssajudron-light', PAINT_REF = 'scene/entities/golem-lyssajudron-paint', NAME = /^[0-9a-z]{1,32}$/;   // NAME: her name, the birth every glass and her wallet's door take
const bare = (p) => !p?.birth || (Array.isArray(p.painted) && !p.painted.length && !p.opened);   // no her stands here: none born, or one unboxed with no part painted yet (a paint with no list is from before the unboxing: every part of it was a choice)
/** hueOf('#RRGGBB'): a colour's hue in degrees, to a tenth (her light's own field) */
export const hueOf = (hex) => { const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255), x = Math.max(r, g, b), d = x - Math.min(r, g, b); return d ? Math.round((x === r ? ((g - b) / d + 6) % 6 : x === g ? (b - r) / d + 2 : (r - g) / d + 4) * 600) / 10 : 0; };
export const STATE_MS = 10 * 60 * 1000;
const PORT = +(process.env.XDOOR_PORT ?? 8936);
const HOST = '127.0.0.1';
const NEST = String(process.env.MESH_NEST || process.env.NEST_URL || 'http://127.0.0.1:8904').replace(/\/$/, '');
export const redirectOf = (port) => `http://127.0.0.1:${port}/x/callback`;
export const CATCH = { host: '::1', port: 8990, path: '/holytraces.html', pass: { host: '127.0.0.1', port: 8990 } };   // the listed dev callback, and the release server it borrows from
export const X_CALLBACK = `http://localhost:${CATCH.port}${CATCH.path}`;
const b64url = (buf) => Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
/** pkce(): a verifier and its S256 challenge (RFC 7636) */
export function pkce(rand = crypto.randomBytes) { const verifier = b64url(rand(32)); return { verifier, challenge: b64url(crypto.createHash('sha256').update(verifier).digest()) }; }
/** loopbackOrigin(origin): the Origin of a page this Mac's own loopback served (http on 127.0.0.1, localhost or [::1]), or null (spotify-wheel.mjs's rule) */
export function loopbackOrigin(origin) { return typeof origin === 'string' && /^http:\/\/(127\.0\.0\.1|localhost|\[::1\])(:\d{1,5})?$/.test(origin) ? origin : null; }
/** profileOf(me, now): X's /2/users/me data as the Nest keeps it; the avatar at 400 px (X answers its 48 px _normal) */
export function profileOf(me, now = Date.now()) {
  if (!me || typeof me.username !== 'string' || !/^[A-Za-z0-9_]{1,15}$/.test(me.username)) return null;
  const img = typeof me.profile_image_url === 'string' && /^https:\/\/pbs\.twimg\.com\//.test(me.profile_image_url) ? me.profile_image_url.replace(/_normal(\.[a-z]+)$/i, '_400x400$1') : null;
  return { schema: 'embertide.x-profile/1', id: me.id ? String(me.id) : null, handle: '@' + me.username, username: me.username, name: typeof me.name === 'string' ? me.name.slice(0, 50) : me.username,
    img, verified: !!me.verified, at: new Date(now).toISOString(), by: 'x-door', scopes: SCOPES };
}
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
/** the tab X lands in: his face in her hexagon and the way back, or what went wrong; a page of its own (no font, no script from anywhere) */
export function tabPage(profile, error = null, flask = null) {
  const face = profile?.img ? `<img src="${esc(profile.img)}" alt="">` : '<b>𝕏</b>';
  const purse = !flask ? '' : flask.waits ? ' Mint your flask on swarmbook.com with this X: Harmony spends from it then.' : Number.isFinite(flask.fuel_usd) ? ` Your flask holds $${flask.fuel_usd.toFixed(2)}; Harmony may spend $${flask.cap_usd} a day of it.` : flask.said ? ` ${esc(flask.said)}` : '';
  const line = profile ? `${esc(profile.handle)} is on your Nest.${purse} DysonLight Harmony is in front again; this tab can go.` : `Not connected: ${esc(error || 'X did not answer')}. Back in DysonLight Harmony, Connect tries again.`;
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${profile ? 'Connected' : 'Not connected'} · DysonLight Harmony</title>
<style>html,body{margin:0;height:100%;background:#f4f1e8;color:#242522;font:400 15px/1.5 'Bodoni 72',Didot,Georgia,serif}body{display:grid;place-items:center}main{text-align:center;padding:24px}
.hex{width:168px;height:194px;margin:0 auto 22px;background:linear-gradient(160deg,#e8c56a,#b3862e);clip-path:polygon(50% 0,100% 25%,100% 75%,50% 100%,0 75%,0 25%);display:grid;place-items:center}
.hex i{display:grid;place-items:center;width:156px;height:180px;background:#faf8f1;clip-path:inherit;overflow:hidden}.hex img{width:100%;height:100%;object-fit:cover}.hex b{font:600 64px/1 Georgia,serif}
h1{font:italic 400 34px/1.1 'Bodoni 72',Didot,Georgia,serif;margin:0 0 10px}p{margin:0;color:#62685e;font:500 12px/1.6 ui-monospace,Menlo,monospace;letter-spacing:.04em}</style></head>
<body><main><div class="hex"><i>${face}</i></div><h1>${profile ? (profile.verified ? 'Connected ✓' : 'Connected') : 'Not connected'}</h1><p>${line}</p></main><script>setTimeout(function(){try{window.close()}catch(e){}},2500)</script></body></html>`;
}

/** makeDoor({...}): the door's handler and its memory; every reach outward is a parameter, so the test drives it without X, a Nest or a browser */
export function makeDoor({ port = PORT, redirect = X_CALLBACK, nest = NEST, worker = X_WORKER, clientId = X_CLIENT_ID, site = SITE, key = null, onFlask = null, fetch: f = globalThis.fetch, open = null, activate = null, hold = null, settled = null, now = Date.now } = {}) {
  const pending = new Map(), S = { last: null, flask: null };
  async function readRef(name = IDENTITY_REF) { const r = await f(`${nest}/nest/ref/${name}`, { cache: 'no-store' }); if (r.status === 404) return { rev: 0, value: null }; if (!r.ok) throw new Error(`the Nest said ${r.status}`); const j = await r.json(); return { rev: j?.ref?.rev ?? 0, value: j?.ref?.value ?? null }; }
  async function writeRef(value, name = IDENTITY_REF) {   // compare-and-swap; one more try on the rev another seat left
    let { rev } = await readRef(name);
    for (let i = 0; i < 2; i++) {
      const r = await f(`${nest}/nest/ref/${name}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ seat: 'x-door', value, expect: rev, cause: [] }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok) return j?.ref?.rev ?? rev + 1;
      if (r.status === 409 && typeof j?.current?.rev === 'number') { rev = j.current.rev; continue; }
      throw new Error(`the Nest said ${r.status}${j?.error ? ': ' + j.error : ''}`);
    }
    throw new Error('the Nest kept moving');
  }
  function begin() {
    for (const [k, v] of pending) if (now() - v.at > STATE_MS) pending.delete(k);
    while (pending.size >= 4) pending.delete(pending.keys().next().value);   // a few tries in the air at most: the newest win
    const p = pkce(), state = b64url(crypto.randomBytes(16)); pending.set(state, { verifier: p.verifier, at: now() });
    const u = new URL(X_AUTHORIZE);
    for (const [k, v] of Object.entries({ response_type: 'code', client_id: clientId, redirect_uri: redirect, scope: SCOPES, state, code_challenge: p.challenge, code_challenge_method: 'S256' })) u.searchParams.set(k, v);
    return { url: u.toString(), state };
  }
  async function callback(q) {
    const state = q.get('state'), saved = state && pending.get(state);
    if (q.get('error')) { if (saved) pending.delete(state); throw Object.assign(new Error(q.get('error') === 'access_denied' ? 'you said no on X' : `X said ${q.get('error')}`), { status: 200 }); }
    if (!saved || now() - saved.at > STATE_MS) throw Object.assign(new Error('this answer is not one this door asked for (or it waited more than 10 minutes)'), { status: 400 });
    pending.delete(state);
    const code = q.get('code'); if (!code) throw Object.assign(new Error('X sent no code'), { status: 400 });
    let k = null; try { k = key?.() || null; } catch { k = null; }
    if (k) {   // X HOLDS THE FLASK: the site trades the code, knows this X account and lets this Mac's key (by its sha256) spend the flask it holds; a site behind it (404) leaves the code to the old road
      const mark = crypto.createHash('sha256').update(k).digest('hex'), r = await f(`${site}${X_HOLDS}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code, verifier: saved.verifier, redirect_uri: redirect, key: mark, label: `Harmony ${mark.slice(0, 4)}` }) }).catch(() => null);
      if (r && r.status !== 404) {
        const j = await r.json().catch(() => ({})), profile = profileOf(j?.x, now()); if (!profile) throw new Error(`the site could not read X (${j?.error?.message || 'http ' + r.status})`);
        S.flask = { tank: j.tank ?? null, fuel_usd: Number.isFinite(j.fuel_usd) ? j.fuel_usd : null, cap_usd: j.grant?.cap_usd ?? null, waits: !!j.waits, said: j.error?.message ?? null, at: now() };
        await writeRef(profile); if (S.flask.tank && onFlask) try { onFlask(S.flask); } catch { /* the purse reads it at its next read */ } return profile;   // THE FLASK FILLS AT THE X ANSWER: Harmony reads the flask this key now opens, at once
      }
    }
    const tr = await f(`${worker}/token`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ code, code_verifier: saved.verifier, redirect_uri: redirect }) });
    const tok = await tr.json().catch(() => ({}));
    if (!tok?.access_token) throw new Error(`the trade of the code failed (${tok?.error_description || tok?.error || 'http ' + tr.status})`);
    const mr = await f(`${worker}/me`, { headers: { authorization: `Bearer ${tok.access_token}` } });
    const profile = profileOf((await mr.json().catch(() => ({})))?.data, now());   // the token ends here: used once, never kept
    if (!profile) throw new Error('X gave no profile');
    await writeRef(profile);
    return profile;
  }
  /** bring(): X CARRIES HER IN (Nov 19 2026, his "people mint their lyssajudron online the social swarmy thing with pfp linked to their twitter; in the app, they connect
   *  their twitter; if they dont got already the swarmy, they are directed to swarmbook.com to create a profile"): the her his X account holds, asked of the site by that
   *  account (the wall lists only the coloured whose page is claimed), laid on the Nest ONCE as the page made her. ONE NAME FOR HER (Nov 22 2026, his "there is only ever 1
   *  lyssajudron for user", "this is the fucking delicate point... we need idempotency"): her birth is the name the site says, the same by X, by the download, on every Mac;
   *  a her that stands on the Nest is never written again, the same one's eyes and colours or another's; one unboxed and not painted yet takes her, and THE MINTED ONE IS SHE: a download's draft (another browser's) gives way to her. None: the way to make one. */
  async function bring() {
    const me = (await readRef()).value; if (!me?.username) return { connected: false }; if (!/^\d{1,20}$/.test(me.id ?? '')) return { found: null, handle: me.handle };   // an identity from before X said its id: nothing is known, nothing is sold
    const get = async (p) => { const r = await f(site + p, { cache: 'no-store' }); if (!r.ok && r.status !== 405) throw new Error(`the site said ${r.status}`); return r.ok ? r.json() : null; }, said = await get(`${X_HOLDS}?id=${me.id}`), u = me.username.toLowerCase();
    const h = said ? said.her : ((await get(WALL_PATH))?.hexagons || []).find((x) => typeof x?.handle === 'string' && x.handle.toLowerCase() === u);   // a site from before this door (405): its wall, as before it; it says no name, so nothing is laid
    if (!h) return { found: false, handle: me.handle, mint: SWARMBOOK };
    const { light, ...parts } = h.colours || {}, held = (await readRef(PAINT_REF)).value, draft = !!light && held?.from === 'optimism.fit/download' && (held.birth !== h.name || Object.keys(parts).some((p) => held.parts?.[p] !== parts[p]) || (await readRef(LIGHT_REF)).value?.color !== light), paint = !!light && NAME.test(h.name ?? '') && (bare(held) || draft);   // draft: as the download laid her and no hand since, another than the one this person minted
    if (paint) { const by = { golem: 'lyssajudron', by: 'x-door', at: new Date(now()).toISOString(), from: 'connect-with-x', birth: h.name }; await writeRef({ schema: 'embertide.golem-light/1', color: light, hue: hueOf(light), ...by }, LIGHT_REF); await writeRef({ schema: 'embertide.golem-paint/1', parts, painted: Object.keys(parts), ...(held?.before ? { before: held.before } : {}), ...by }, PAINT_REF); }
    return { found: true, handle: me.handle, hexagon: h.n, name: h.name, picture: h.picture ? site + h.picture : null, painted: paint, light: light || null };
  }
  /** way(): where his press goes (the mint, or her colours when she is paid and has none), a her made here first carried as her own: her colours and her name in the fragment, which no server reads */
  async function way() {
    const to = (await bring().catch(() => null))?.found ? MAKING : SWARMBOOK, [light, paint] = await Promise.all([LIGHT_REF, PAINT_REF].map((n) => readRef(n).then((r) => r.value, () => null)));
    try { const [{ fromRefs }, { mineOf }] = await Promise.all([import('../../embertide-app/ui/intro/dyson-society/app/dl-her-colours.mjs'), import('../../embertide-app/ui/intro/dyson-society/app/dl-her-reel.mjs')]), st = NAME.test(paint?.birth ?? '') && !bare(paint) ? fromRefs({ paint: { ...paint, painted: paint.painted ?? Object.keys(paint.parts ?? {}) }, light }) : null; return st ? to + mineOf(st, paint.birth) : to; } catch { return to; }
  }
  const json = (res, code, o, h = {}) => { const b = JSON.stringify(o); res.writeHead(code, { 'content-type': 'application/json', 'cache-control': 'no-store', 'content-length': Buffer.byteLength(b), ...h }); res.end(b); };
  function handle(req, res) {
    const u = new URL(req.url, 'http://x'), p = u.pathname, page = loopbackOrigin(req.headers.origin);
    if (page) { res.setHeader('access-control-allow-origin', page); res.setHeader('vary', 'origin'); }
    if (req.method === 'OPTIONS') {
      if (!page) return json(res, 403, { error: 'the X door answers pages of this Mac only' });
      res.writeHead(204, { 'access-control-allow-methods': 'GET, POST', 'access-control-allow-headers': 'content-type', 'access-control-max-age': '600' }); return res.end();
    }
    if (req.method === 'GET' && p === '/x/state') return void readRef().then((r) => json(res, 200, { connected: r.value, pending: pending.size, last: S.last, flask: S.flask, callback: redirect }))
      .catch((e) => json(res, 502, { error: String(e.message || e), pending: pending.size, last: S.last }));
    if (req.method === 'POST' && (p === '/x/swarmy' || p === '/x/swarmbook')) {   // X CARRIES HER IN: his Swarmy brought in; with none, his press opens swarmbook.com in his browser
      if (req.headers.origin && !page) return json(res, 403, { error: 'the X door answers pages of this Mac only' });
      if (p === '/x/swarmbook') return void way().then((url) => { let opened = false; if (open) try { open(url); opened = true; } catch { opened = false; } json(res, 200, { url, opened }); });
      return void bring().then((j) => json(res, 200, j), (e) => json(res, 502, { error: String(e.message || e) }));
    }
    if (req.method === 'POST' && (p === '/x/begin' || p === '/x/forget')) {
      if (req.headers.origin && !page) return json(res, 403, { error: 'the X door answers pages of this Mac only' });
      if (p === '/x/forget') return void writeRef(null).then(() => { S.last = { ok: true, forgot: true, at: now() }; json(res, 200, { connected: null }); }).catch((e) => json(res, 502, { error: String(e.message || e) }));
      const b = begin();
      S.last = { ok: null, began: true, at: now() };
      return void Promise.resolve(hold ? hold() : null).then(() => {   // the catcher listens before his browser goes to X (X answers within a second)
        let opened = false;
        if (open) { try { open(b.url); opened = true; } catch { opened = false; } }
        json(res, 200, { url: b.url, opened, callback: redirect });
      }, (e) => {
        pending.delete(b.state); S.last = { ok: false, error: `the door could not hold ${redirect} (${e?.code || e?.message || e})`, at: now() };
        json(res, 503, { error: S.last.error });
      });
    }
    if (req.method === 'GET' && (p === '/x/callback' || p === CATCH.path)) {
      return void callback(u.searchParams).then((profile) => {
        S.last = { ok: true, handle: profile.handle, at: now() };
        if (activate) try { activate(); } catch { /* the tab still says the way back */ }
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); res.end(tabPage(profile, null, S.flask));
      }).catch((e) => {
        S.last = { ok: false, error: String(e.message || e), at: now() };
        res.writeHead(e.status || 502, { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' }); res.end(tabPage(null, String(e.message || e)));
      }).then(() => { if (settled) try { settled(); } catch { /* the catcher's timer lets go anyway */ } });
    }
    json(res, 404, { error: 'not found' });
  }
  return { handle, begin, callback, bring, pending, state: () => ({ pending: pending.size, last: S.last, flask: S.flask, callback: redirect }) };
}

/** catcher(door, at): while a sign-in is in the air the door holds at.host:at.port (IPv6 only, so the release server keeps its IPv4 socket): at.path goes
 *  to the door, every other request passes to at.pass untouched; it lets go when the door has nothing pending (settle) or STATE_MS after the last hold */
export function catcher(door, at = CATCH, log = () => {}) {
  let server = null, ready = null, lapse = null;
  function pass(req, res) {
    const p = http.request({ host: at.pass.host, port: at.pass.port, method: req.method, path: req.url, headers: req.headers }, (r) => { res.writeHead(r.statusCode, r.headers); r.pipe(res); });
    p.on('error', () => { if (!res.headersSent) res.writeHead(502); res.end(); });
    req.pipe(p);
  }
  function release() {
    clearTimeout(lapse); lapse = null; if (!server) return;
    const s = server; server = null; ready = null; s.close(); s.closeIdleConnections?.(); log(`let go of [${at.host}]:${at.port}`);
  }
  function hold() {
    clearTimeout(lapse); lapse = setTimeout(release, STATE_MS); lapse.unref?.();
    if (ready) return ready;
    const s = server = http.createServer((req, res) => (new URL(req.url, 'http://x').pathname === at.path ? door.handle(req, res) : pass(req, res)));
    ready = new Promise((ok, no) => {
      s.once('error', (e) => { if (server === s) { server = null; ready = null; } no(e); });
      s.listen({ host: at.host, port: at.port, ipv6Only: true }, () => { log(`holds [${at.host}]:${s.address().port}${at.path}`); ok(s.address().port); });
    });
    return ready;
  }
  return { hold, release, settle: () => { if (!door.pending.size) release(); }, get held() { return !!server; } };
}

export function serve({ port = PORT, open = true, callback = 'listed', key = null, onFlask = null } = {}) {
  const listed = callback !== 'loopback', log = (m) => console.log(JSON.stringify({ at: new Date().toISOString(), catcher: m }));
  let c = null;
  const door = makeDoor({ port, key, onFlask, redirect: listed ? X_CALLBACK : redirectOf(port), open: open ? (url) => execFile('open', [url], () => {}) : null, activate: () => execFile('open', ['-b', APP_BUNDLE], () => {}),
    hold: listed ? () => c.hold() : null, settled: listed ? () => c.settle() : null });
  if (listed) c = catcher(door, CATCH, log);
  const server = http.createServer(door.handle);
  return new Promise((ok, no) => { server.once('error', no); server.listen(port, HOST, () => ok({ server, door, catcher: c, bound: `${HOST}:${server.address().port}` })); });   // a port already held is a refusal, never an uncaught error in the process that started it
}

const isMain = (() => { try { return !!process.argv[1] && fs.realpathSync(process.argv[1]) === fs.realpathSync(fileURLToPath(import.meta.url)); } catch { return false; } })();
if (isMain) {
  const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const { bound, door } = await serve({ port: +opt('--port', PORT), open: !args.includes('--no-open'), callback: opt('--callback', 'listed') });
  console.log(JSON.stringify({ at: new Date().toISOString(), up: true, bound, nest: NEST, ref: IDENTITY_REF, callback: door.state().callback, opens: !args.includes('--no-open') }));
  for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => process.exit(0));
}

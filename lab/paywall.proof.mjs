#!/usr/bin/env node
// paywall.proof.mjs: THE WALL AT THE DRAWN ARROW (app/dl-paywall.js createPaywall, as app/dl-twelve.js mounts it: the wall's frame DRAWN_FRAME, its close
// MINT_CLOSES, the film stopped there and the song with it) proved on the page optimism.fit serves (app/warm.html) and on the lab's (lab/hero-ab.html),
// in a muted headless Chrome over CDP, off every screen.
// THE WALL IS READ OFF THE PAGE. Every pass takes the wall's frame, its stop second and its close from the page's own word, window.dlTwelve.state()
// .paywall (hold, stop, closes), and a frame's length from those two (stop is the second after the wall's frame): no frame or second of the film is
// written in this proof. Its moments are leads of seconds before that stop.
// THE LAW AT THE WALL, as main's page holds it since THE CLIMAX (212f43dafb, landed by 991328213, Oct 22 2026: his Oct 21 2026 WEST "on the moment of
// the arrow fully drawn we will freeze the page until the mint has happened"; the stop on the bow's full bend):
//   - a visitor with no paid seat, while the mint is open: the film plays up to the wall's frame and stops there (the wall held); the song stops with it,
//     put on the picture's second, after fading out over the stop's last moments; the sphere stands held; the page puts the picture on the frame when
//     its pause lands off it, never further back than a frame; the Restart waits and the Skip goes while it holds; no frame but the wall's is
//     presented after it; the hold is the wall's own, never a presentation's (THE ANIME NEVER STOPS: the cinematic is off for everyone);
//   - a tap of the sound before the wall brings the song in at the picture's second and never takes the picture back (CLAUDE.md, The rule, 8);
//   - a holder (a seat proof this browser keeps, its wallet's paid receipt read with it: one ask at load) and a minter's view (the lab's ?paywall=off)
//     play on through the stop, the wall open and never held; after the close (MINT_CLOSES) the wall is open for everyone from the load;
//   - an order id alone (an older checkout's, or a payment's memo on mainnet) opens nothing and asks the Worker nothing;
//   - his lab (hero-ab.html as it opens) meets the wall as a visitor does.
// THE OFFER IS COMMENTED OUT (c35854ae6 THE PAGE COMMENTED OUT, landed by 9f523da5d, Oct 30 2026, his "please comment out all this"): the page's offer,
// #dl-paywall-choice with its stages on the cuts, "Not staking" and the line of $WARM's days, stands inert in a <template data-commented-out>, and the
// wall holds with no choice. A pass that meets a choice still checks it (its last stage at the wall, its line the page's own mintLine, away for a
// holder; on a phone its controls in the gutters and a finger tall), so they engage again when the template is unwrapped.
// WHY IT WAS REWRITTEN (Nov 2 2026, his ruling, relayed by the sweep's seat: retire mint-opus-liquor, and rewrite paywall for the wall's new place at the
// drawn arrow). Until then this proof held the wall at the golden flash under the presentation's freeze: his Oct 18 2026 00:3x WEST word that the anime
// never stops took that freeze away for everyone (981621e87c, landed by d17315abf), and its passes waited for a hold that never came, 20 s and more each,
// past the sweep's 150 s. Gone with the page's seats and its holder's road (YOUR PRESENCE IN THE MMO, Oct 29; CLEAR THE MINT, his Oct 30 2026 03:21:04
// UTC "Yes, clear it"): the passes checkout, returning (and its tracenet and phone parts) and the choice's gold seat. Gone with the offer (above): the
// passes notmint and choice. Gone with the cinematic: the liquor glass the old passes waited for, up to 45 s a page.
//   nice -n 19 node lab/paywall.proof.mjs --out <dir> [--upstream <origin of a static server over a build>] [--base <an embertide-app/ui for the before>]
//                                       [--chrome <path>] [--passes visitor,song,holder,bareid,window,phone,lab,before] [--bound <s>]
// THE SITE. With --upstream every byte but the Worker's comes from that server with its Range (tools/serve-range over tools/build-optimism-fit.mjs --out
// answers 206, as optimism.fit does), the page /app/warm.html as optimism.fit serves it. Without it the door serves this tree's embertide-app/ui at /
// (the page at /intro/dyson-society/app/warm.html, as aiolos serves it). The build ships no lab: the lab pass runs on this tree.
// The passes (S is the page's stop second; each a first visit in its own browser context, so no pass reads another's storage):
//   visitor   put at S - 2 s by the proof's own seek, the film plays into the wall: held on its frame, the song stopped with it on the picture's
//             second, the sphere held, the Restart waiting, the Skip away (shown before the wall), nothing of the page sought further back than a
//             frame; then 2.5 s at rest: no frame but the wall's presented, still held (the page's own counters over it said, her entrance's among them)
//   song      at S - 6 s the sound tapped on (a trusted click on the page's own button): the song in at the picture's second, the picture never back
//             past its frame at the tap, the song never back on the way; at the wall both stop, the song faded out and put on the picture's second
//   holder    a browser that keeps the wallet's seat proof: one ask at load, the wall open; at S - 2 s it plays on through the stop, the Restart free
//   bareid    a browser that carries only the checkout's saved order ids of the wallet's paid orders: nothing asked, and the wall holds
//   window    the mint's close set one day back (the door rewrites the one constant, MINT_CLOSES, for itself only): the wall open for everyone at
//             load, the film on through the stop, the Skip away
//   phone     390 x 844: the wall holds, the song with it, nothing of the page sideways, still held after
//   lab       hero-ab.html as his lab opens it (a visitor: the wall holds in the frame) and with ?paywall=off (a minter's view: the wall open, the film
//             on through the stop)
//   before    (named only) the page's own costs before the wall, on --base's tree when given: 3 s playing, then 3 s under the page's own Pause
// The Worker: /api/premint/* answered by a stand-in (availability, an empty holders list, the tank as worker/premint.mjs counts it, a wallet's receipts
// to its seat proof only, checked as the Worker checks it, orders by id; anything else 404; it takes nothing). Every other request is refused and
// listed: no Nest, no Solana, no unpkg. No purchase: a receipt is a stand-in, its signature random bytes that were never a transaction.
// Writes <out>/paywall.proof.json and JPEGs (the film's frames: keep them out of git); exits 1 when a pass fails. Each pass has its own bound (PASS_S)
// and the run its own (--bound, 140 s): a pass over its bound fails with what its pages showed, and the run ends inside the sweep's 150 s.
// COST: one Chrome (about 500 MB) for about a minute (seven passes, eight pages); run it on the new Mac, niced, under a time limit.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {randomBytes, randomUUID} from 'node:crypto';
import * as PROTOCOL from '../app/dl-direct-protocol.mjs';
import {RECEIPT_KEY, choiceAt, mintState, mintLine} from '../app/dl-paywall.js';

const {RECIPIENT, TERMS, TIERS, SEAT_KEY, encode58, orderMemo, quoteLamports, seatSignIn, sealSeatProof, verifySeatProof} = PROTOCOL;
const HERE = path.dirname(fileURLToPath(import.meta.url));
const UI = path.resolve(HERE, '../../..');
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const OUT = path.resolve(opt('--out', path.join(os.tmpdir(), 'paywall-proof')));
const BASE_TREE = opt('--base', null);
const UPSTREAM = opt('--upstream', null);
if (UPSTREAM && !['127.0.0.1', 'localhost', '[::1]'].includes(new URL(UPSTREAM).hostname)) throw new Error('--upstream: a server on this machine only');
const PASSES = opt('--passes', 'visitor,song,holder,bareid,window,phone,lab').split(',');
const BOUND_S = Number(opt('--bound', '140')), PASS_S = 40;   // the run's bound and a pass's own, in seconds
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')];
const CHROME = opt('--chrome', CHROMES.find((c) => fs.existsSync(c)));
const TYPES = {html: 'text/html; charset=utf-8', js: 'text/javascript', mjs: 'text/javascript', css: 'text/css', json: 'application/json', png: 'image/png', jpg: 'image/jpeg',
  webp: 'image/webp', svg: 'image/svg+xml', mp4: 'video/mp4', m4a: 'audio/mp4', woff2: 'font/woff2', glb: 'model/gltf-binary', ttf: 'font/ttf'};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const DAY = 86400000, T0 = Date.now();
const LEAD_S = 2, SOUND_LEAD_S = 6;   // where a pass puts the film before the page's stop (the page's own Skip lands 3 s before it)
// what the page asks the Worker at load, whatever the wall does (the holders on the sphere, the tank under the offer)
const LOAD_READS = ['/api/premint/holders', '/api/premint/tank'];
const loadRead = (call) => LOAD_READS.some((p) => call.includes(p));

// THE STAND-IN WORKER: the premint Worker's GET answers in its own shapes (worker/premint.mjs publicOrder), for stand-in orders only
function standInWorker() {
  const orders = new Map(), calls = [];
  const order = (buyer, tier) => {
    const created = Math.floor(Date.now() / 1000) - 3600;
    const o = {id: randomUUID(), tier, buyer, recipient: RECIPIENT, lamports: quoteLamports(TIERS[tier].usd, '103.88'), solUsd: '103.88', createdAt: created, expiresAt: created + 90,
      blockhash: encode58(randomBytes(32)), lastValidBlockHeight: 1, termsVersion: TERMS, signature: encode58(randomBytes(64)), status: 'paid', paidSlot: 1};
    o.memo = orderMemo(o); orders.set(o.id, o); return o;
  };
  const handle = async (req, res, url) => {
    calls.push({at: Date.now(), call: `${req.method} ${url.pathname}${url.search}`, seat: Boolean(req.headers['x-seat'])});
    const json = (data, status = 200) => { res.writeHead(status, {'content-type': 'application/json', 'cache-control': 'no-store'}); res.end(JSON.stringify(data)); };
    if (req.method !== 'GET') return json({error: 'The stand-in takes nothing.'}, 403);
    if (url.pathname === '/api/premint/availability') return json({enabled: true, recipient: RECIPIENT, cluster: 'mainnet-beta', tiers: TIERS, termsVersion: TERMS});
    if (url.pathname === '/api/premint/holders') return json({holders: []});
    if (url.pathname === '/api/premint/tank') {
      if (typeof PROTOCOL.tankOf !== 'function') return json({error: 'Not found'}, 404);
      const n = {}; for (const o of orders.values()) if (o.status === 'paid') n[o.tier] = (n[o.tier] || 0) + 1;
      return json(PROTOCOL.tankOf(Object.entries(n).map(([tier, k]) => ({tier, n: k}))));
    }
    if (url.pathname === '/api/premint/receipts') {
      // the Worker's own check (worker/premint.mjs): a wallet's receipts to its seat proof only, signed for this door's host
      const seat = await verifySeatProof(req.headers['x-seat'], {host: req.headers.host, origin: `http://${req.headers.host}`, now: Date.now()});
      if (seat?.buyer !== url.searchParams.get('buyer')) return json({error: 'Sign in with this wallet to see its purchases.'}, 401);
      return json({orders: [...orders.values()].filter((o) => o.buyer === seat.buyer)});
    }
    const m = /^\/api\/premint\/orders\/([0-9a-f-]{36})$/.exec(url.pathname);
    if (m && orders.has(m[1])) return json({order: orders.get(m[1])});
    return json({error: 'Not found'}, 404);
  };
  return {order, handle, calls};
}

// the media a lane's worktree links to main's copies (gitignored, never committed: the galaxy films); their targets are served as aiolos serves
// main's, and no other link out of the tree is followed
const LINKED = ['intro/dyson-society/app/warm-media'];
const TREE = {page: '/intro/dyson-society/app/warm.html', lab: '/intro/dyson-society/lab/hero-ab.html'};
const BUILT = {page: '/app/warm.html', lab: null};
// the one constant a door may set for itself (the mint's close, for the window pass): his close is never written by a seat into the tree
const CLOSES_LINE = /export const MINT_CLOSES = (?:'[^']*'|null);/;
function door(root, worker, {closes = null, upstream = null} = {}) {
  const site = upstream ? BUILT : TREE;
  root = upstream ? null : fs.realpathSync(root);
  const allowed = upstream ? [] : [root, ...LINKED.map((p) => { try { return fs.realpathSync(path.join(root, p)); } catch { return null; } }).filter(Boolean)];
  const closed = (src) => src.replace(CLOSES_LINE, `export const MINT_CLOSES = ${JSON.stringify(closes)};`);
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname.startsWith('/api/premint/')) return worker.handle(req, res, url);
    if (req.method !== 'GET' && req.method !== 'HEAD') { res.writeHead(405); return res.end(); }
    const wall = Boolean(closes) && url.pathname.endsWith('/app/dl-paywall.js');
    if (upstream) {
      // the bytes as the static server answers them: its status (206 for a range), its headers but the connection's own, its body as it comes
      const headers = {};
      if (!wall) for (const k of ['range', 'if-range']) if (req.headers[k]) headers[k] = req.headers[k];
      const ask = http.request(new URL(req.url, upstream), {method: req.method, headers}, (up) => {
        up.on('error', () => res.destroy());
        if (wall) {
          const chunks = [];
          up.on('data', (c) => chunks.push(c));
          up.on('end', () => {
            const src = Buffer.concat(chunks).toString('utf8'), body = closed(src);
            if (up.statusCode !== 200 || body === src) { res.writeHead(500); return res.end('no MINT_CLOSES line'); }
            res.writeHead(200, {'content-type': up.headers['content-type'] || 'text/javascript', 'cache-control': 'no-store'}); res.end(body);
          });
          return;
        }
        const h = {...up.headers};
        for (const k of ['connection', 'keep-alive', 'transfer-encoding']) delete h[k];
        res.writeHead(up.statusCode, h);
        up.pipe(res);
      });
      ask.on('error', () => { if (!res.headersSent) res.writeHead(502); res.end(); });
      res.on('close', () => { if (!res.writableFinished) ask.destroy(); });   // the browser let go of a range: so does the door
      return ask.end();
    }
    let fp;
    try { fp = fs.realpathSync(path.join(root, decodeURIComponent(url.pathname))); } catch { res.writeHead(404); return res.end(); }
    if (!allowed.some((a) => fp === a || fp.startsWith(a + path.sep))) { res.writeHead(403); return res.end(); }
    let st;
    try { st = fs.statSync(fp); } catch { res.writeHead(404); return res.end(); }
    if (st.isDirectory()) { res.writeHead(404); return res.end(); }
    const type = TYPES[path.extname(fp).slice(1).toLowerCase()] || 'application/octet-stream';
    if (wall) {
      const src = fs.readFileSync(fp, 'utf8'), body = closed(src);
      if (body === src) { res.writeHead(500); return res.end('no MINT_CLOSES line'); }
      res.writeHead(200, {'content-type': type, 'cache-control': 'no-store'}); return res.end(body);
    }
    const m = /^bytes=(\d*)-(\d*)$/.exec(req.headers.range || '');
    if (m) {
      const start = m[1] === '' ? st.size - Number(m[2]) : Number(m[1]), end = Math.min(m[1] !== '' && m[2] !== '' ? Number(m[2]) : st.size - 1, st.size - 1);
      if (!(start >= 0 && start <= end)) { res.writeHead(416, {'content-range': `bytes */${st.size}`}); return res.end(); }
      res.writeHead(206, {'content-type': type, 'accept-ranges': 'bytes', 'content-range': `bytes ${start}-${end}/${st.size}`, 'content-length': end - start + 1, 'cache-control': 'no-store'});
      return req.method === 'HEAD' ? res.end() : fs.createReadStream(fp, {start, end}).pipe(res);
    }
    res.writeHead(200, {'content-type': type, 'accept-ranges': 'bytes', 'content-length': st.size, 'cache-control': 'no-store'});
    return req.method === 'HEAD' ? res.end() : fs.createReadStream(fp).pipe(res);
  });
  return new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(0, '127.0.0.1', () => resolve({...site, origin: `http://127.0.0.1:${server.address().port}`, upstream, closes,
      close: () => new Promise((r) => { server.closeAllConnections?.(); server.close(() => r()); })}));
  });
}

// THE INSTRUMENT, in every frame before the page's own scripts: each animation frame, video frame, timer and draw that runs, and where it was
// asked (the first script frame of the stack that asked). The proof's own observer uses the untouched requestVideoFrameCallback (rv).
const INSTRUMENT = `(() => {
  if (window.__pw) return;
  const P = window.__pw = {raf: 0, rvfc: 0, timeouts: 0, intervals: 0, draws2d: 0, clears2d: 0, drawsGL: 0, src: {}, loaf: []};
  const where = () => { const line = (new Error().stack || '').split('\\n').slice(2).find((l) => /\\.m?js/.test(l) && !/__pw|INSTRUMENT/.test(l)) || '';
    return line.replace(/^\\s*at\\s+/, '').replace(/\\?v=[^:)]+/, '').replace(/https?:\\/\\/[^/]+\\/intro\\/dyson-society\\//, '').replace(/https?:\\/\\/[^/]+\\//, '').slice(0, 90); };
  const tally = (k, w) => { P.src[k + ' ' + w] = (P.src[k + ' ' + w] || 0) + 1; };
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => { const w = where(); return raf((t) => { P.raf++; tally('raf', w); cb(t); }); };
  const st = window.setTimeout.bind(window), si = window.setInterval.bind(window);
  window.setTimeout = (cb, ms, ...a) => { const w = where(); return st(typeof cb === 'function' ? (...x) => { P.timeouts++; tally('timeout', w); cb(...x); } : cb, ms, ...a); };
  window.setInterval = (cb, ms, ...a) => { const w = where(); return si(typeof cb === 'function' ? (...x) => { P.intervals++; tally('interval', w); cb(...x); } : cb, ms, ...a); };
  // every seek of a medium in this frame: [id, from, to, at ms, the proof's own (1) or the page's (0)]
  const ct = Object.getOwnPropertyDescriptor(HTMLMediaElement.prototype, 'currentTime');
  P.seeks = []; P.mine = false;
  Object.defineProperty(HTMLMediaElement.prototype, 'currentTime', {configurable: true, get: ct.get, set(v) {
    P.seeks.push([this.id || this.tagName, Math.round(ct.get.call(this) * 1e4) / 1e4, Math.round(v * 1e4) / 1e4, Math.round(performance.now()), P.mine ? 1 : 0]);
    if (P.seeks.length > 600) P.seeks.splice(0, 200);
    ct.set.call(this, v);
  }});
  const rv = P.rv = HTMLVideoElement.prototype.requestVideoFrameCallback;
  if (rv) HTMLVideoElement.prototype.requestVideoFrameCallback = function (cb) { const w = where(); return rv.call(this, (now, m) => { P.rvfc++; tally('rvfc', w); cb(now, m); }); };
  const c2 = CanvasRenderingContext2D.prototype, di = c2.drawImage, cr = c2.clearRect;
  c2.drawImage = function (...a) { P.draws2d++; return di.apply(this, a); };
  c2.clearRect = function (...a) { P.clears2d++; return cr.apply(this, a); };
  for (const G of [window.WebGLRenderingContext, window.WebGL2RenderingContext].filter(Boolean)) for (const k of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
    const f = G.prototype[k]; if (f) G.prototype[k] = function (...a) { P.drawsGL++; return f.apply(this, a); };
  }
  // the choice's pieces dock by the script (dl-paywall.js dock()): when each was asked
  const an = Element.prototype.animate;
  Element.prototype.animate = function (...a) { if (this.dataset?.choicePiece) (P.docks ||= []).push([this.dataset.choicePiece, Math.round(performance.now())]); return an.apply(this, a); };
  try { new PerformanceObserver((l) => { for (const e of l.getEntries()) P.loaf.push([Math.round(e.startTime), Math.round(e.duration), Math.round(e.blockingDuration || 0)]); }).observe({type: 'long-animation-frame', buffered: true}); } catch {}
})();`;

// the page's helpers, from the top document: the mint is the page itself, or the lab's frame. THE WALL is the page's own word (wall()): its frame, its
// stop, its close; a frame's length is read off it (the stop is the second after the wall's frame)
const HELPER = `window.__h = (() => {
  const mint = () => document.getElementById('page')?.contentWindow ?? window;
  const el = (id) => mint().document.getElementById(id);
  const film = () => el('dl-twelve-film'), song = () => el('dl-twelve-song');
  const r1 = (v) => Math.round(v * 10) / 10, r4 = (v) => Math.round(v * 1e4) / 1e4, r6 = (v) => Math.round(v * 1e6) / 1e6;
  const wallOf = () => mint().dlTwelve?.state?.()?.paywall ?? null;
  const frameS = () => { const w = wallOf(); return w ? w.stop / (w.hold + 1) : NaN; };
  const frameOf = (t) => Math.floor(t / frameS() + 1e-6);
  const log = [], events = [];
  let watching = false;
  const wins = () => [...new Set([window, mint()])];
  const top = (e) => { if (!e) return null; const r = e.getBoundingClientRect(), t = mint().document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
    return {on: Boolean(t && e.contains(t)), by: t && !e.contains(t) ? (t.id ? '#' + t.id : t.tagName.toLowerCase() + (t.className && typeof t.className === 'string' ? '.' + t.className.trim().split(/\\s+/).join('.') : '')).slice(0, 80) : null}; };
  return {
    ready() { const s = mint().dlTwelve?.state?.(); return Boolean(s && s.paywall && film() && film().readyState >= 2 && s.primed); },
    wall() { const w = wallOf(); return w ? {hold: w.hold, stop: w.stop, frameS: w.stop / (w.hold + 1), closes: w.closes, launch: w.launch, state: w.state, exclusive: w.exclusive, review: w.review} : null; },
    watch() {
      const f = film(); if (!f || watching) return Boolean(f); watching = true;
      const rv = mint().__pw.rv, s = song();
      // [the presented frame's second, frames presented, at ms, the song's second, the song playing, the film's own clock at that frame]
      const obs = (now, m) => { log.push([r6(m.mediaTime), m.presentedFrames, r1(now), r4(s.currentTime), s.paused ? 0 : 1, r6(f.currentTime)]); if (log.length > 6000) log.splice(0, 2000); rv.call(f, obs); };
      rv.call(f, obs);
      // the two media's own events: [type, id, its second, at ms]
      for (const m of [f, s]) for (const type of ['play', 'pause', 'seeking', 'seeked', 'waiting']) m.addEventListener(type, () => { events.push([type, m.id, r4(m.currentTime), r1(mint().performance.now())]); if (events.length > 3000) events.splice(0, 1000); });
      return true;
    },
    log: (n = 0) => (n ? log.slice(-n) : log),
    events: (since = 0) => events.filter((e) => e[3] >= since),
    state() { const s = mint().dlTwelve?.state?.(); return s ? {film: s.film, song: {...s.song, volume: r4(song().volume)}, paywall: s.paywall, sphere: s.sphere, soundOn: s.soundOn, primed: s.primed, hearing: s.hearing, cinematic: s.cinematic, inView: s.inView} : null; },
    // one look at both clocks, the wall and the choice's stage together: a stage is judged by the second it was read at
    sample() { const f = film(), s = song(), w = wallOf(), c = el('dl-paywall-choice');
      return {at: r1(mint().performance.now()), film: r4(f.currentTime), frame: frameOf(f.currentTime), filmPaused: f.paused, song: r4(s.currentTime), songPaused: s.paused, volume: r4(s.volume), muted: s.muted,
        wall: w?.state ?? null, stage: c?.dataset.stage ?? null, hidden: c ? c.hidden : null}; },
    counts() {
      const sum = {raf: 0, rvfc: 0, timeouts: 0, intervals: 0, draws2d: 0, clears2d: 0, drawsGL: 0}, src = {};
      for (const w of wins()) { const P = w.__pw; if (!P) continue; for (const k of Object.keys(sum)) sum[k] += P[k]; for (const [k, v] of Object.entries(P.src)) src[k] = (src[k] || 0) + v; }
      return {sum, src, at: performance.now()};
    },
    running() { return wins().flatMap((w) => w.document.getAnimations().filter((a) => a.playState === 'running').map((a) => (a.animationName || a.constructor.name) + ' on ' + (a.effect?.target?.id || a.effect?.target?.className || a.effect?.target?.tagName || '?'))).slice(0, 12); },
    rect(sel) { const e = mint().document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.width, r.height]; },
    // the same, scrolled into the window first (the offer stands in the page's flow below the film; instant: a rect read during a glide is where it was)
    reveal(sel) { const e = mint().document.querySelector(sel); if (!e) return null; e.scrollIntoView({block: 'center', behavior: 'instant'}); const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2, r.width, r.height]; },
    // whether a press at the middle of the element lands on it, and what stands over it when it does not
    onTop(sel) { return top(mint().document.querySelector(sel)); },
    // the Restart (it waits while the wall holds) and the Skip (shown only while the wall is ahead), as the page leaves them
    controls() { const q = (s) => mint().document.querySelector(s), r = q('[data-twelve-restart]'), k = q('[data-twelve-skip]'); return {restartDisabled: r ? r.disabled : null, skipHidden: k ? k.hidden : null}; },
    choice() {
      const c = el('dl-paywall-choice'); if (!c) return null;
      const m = mint(), control = (e) => { const r = e.getBoundingClientRect(); return {sel: e.id ? '#' + e.id : [...e.attributes].map((a) => a.name).find((n) => n.startsWith('data-')) ?? e.tagName, hidden: e.hidden, disabled: Boolean(e.disabled),
        text: e.textContent.trim().replace(/\\s+/g, ' ').slice(0, 60), rect: [r.left, r.top, r.width, r.height].map(Math.round)}; };
      return {hidden: c.hidden, stage: c.dataset.stage, layout: c.dataset.layout ?? null, display: m.getComputedStyle(c).display,
        controls: [...c.querySelectorAll('button, a[href], a[data-warm-door]')].map(control), seats: c.querySelectorAll('[data-mint-tier]').length, holderRoad: c.querySelectorAll('[data-mint-holder]').length,
        scrollWidth: m.document.documentElement.scrollWidth, view: [m.innerWidth, m.innerHeight], docks: (m.__pw?.docks ?? []).length};
    },
    // every control of the choice a visitor can see, each scrolled to the middle in turn as a thumb brings it: its box, whether a press lands on it
    fits() {
      const c = el('dl-paywall-choice'); if (!c) return null;
      const m = mint(), out = [];
      for (const e of c.querySelectorAll('button, a[data-warm-door]')) {
        if (e.hidden || e.closest('[hidden]') !== null && e.closest('[hidden]') !== c) continue;
        e.scrollIntoView({block: 'center', behavior: 'instant'});
        const r = e.getBoundingClientRect(); if (!r.width && !r.height) continue;
        const t = top(e);
        out.push({what: e.id ? '#' + e.id : [...e.attributes].map((a) => a.name).find((n) => n.startsWith('data-')) ?? e.tagName.toLowerCase(), text: e.textContent.trim().replace(/\\s+/g, ' ').slice(0, 48),
          disabled: Boolean(e.disabled), left: Math.round(r.left), right: Math.round(r.right), height: Math.round(r.height), onTop: t.on, under: t.by});
      }
      return {controls: out, scrollWidth: m.document.documentElement.scrollWidth, width: m.innerWidth};
    },
    words() { const c = el('dl-paywall-choice'), q = (s) => c?.querySelector(s); return c ? {line: q('[data-mint-line]')?.hidden ? null : q('[data-mint-line]')?.textContent.trim() ?? null, lineText: q('[data-mint-line]')?.textContent.trim() ?? null,
      free: q('[data-free-line]')?.hidden ? null : q('[data-free-line]')?.textContent.trim() ?? null, not: q('[data-paywall-not]')?.getAttribute('aria-pressed') ?? null} : null; },
    athena() { const a = mint().dlAthena?.state?.(); return a ? {entered: a.entered, entering: Boolean(a.entering), left: Boolean(a.left), asking: Boolean(a.asking), coming: a.coming ?? null} : null; },
    seek(t) { const s = song(), f = film(), P = mint().__pw; P.mine = true; try { if (s && s.readyState >= 1) s.currentTime = t; f.currentTime = t; } finally { P.mine = false; } return true; },
    // the page's own seeks of a medium (the film by default) since the proof armed it (the proof's own are not counted)
    seeks: (since = 0, id = 'dl-twelve-film') => mint().__pw.seeks.filter(([sid, , , at, mine]) => sid === id && !mine && at >= since),
    now: () => mint().performance.now(),
    frame() { const f = film(); return {t: r4(f.currentTime), frame: frameOf(f.currentTime), paused: f.paused, rate: f.playbackRate}; },
    stage() { const s = el('sphere-stage').getBoundingClientRect(); mint().scrollBy(0, Math.round(s.top + s.height / 2 - mint().innerHeight / 2)); return [s.width, s.height].map(Math.round); },
    loaf: () => mint().__pw.loaf.length,
    hideLabPanel() { const p = document.querySelector('.ab'); if (p) p.style.visibility = 'hidden'; return Boolean(p); },
  };
})(); 'ok'`;

// a pass's verdict: every named check true; the names that failed, said
const judge = (r) => { r.failed = Object.entries(r.checks ?? {}).filter(([, v]) => !v).map(([k]) => k); r.pass = Object.keys(r.checks ?? {}).length > 0 && r.failed.length === 0; return r.pass ? 'PASS' : `FAIL (${r.failed.join(', ') || 'no check ran'})`; };
// the wall's frame of a film's second, and whether a frame reading is on it, paused (W: the page's own wall, read by up())
const frameIn = (t, W) => Math.floor(t / W.frameS + 1e-6);
const onWall = (f, W) => Boolean(f) && f.paused && frameIn(f.t, W) === W.hold;
const backOf = (seeks) => { const back = seeks.filter(([, from, to]) => to < from).map(([, from, to]) => Math.round((from - to) * 1e4) / 1e4); return back.length ? Math.max(...back) : 0; };

async function main() {
  if (!CHROME) throw new Error('no Chrome here');
  fs.mkdirSync(OUT, {recursive: true});
  const worker = standInWorker();
  // the stand-in wallet: a key made for this run (in the holder's kept proof), never a wallet of anyone's
  const keys = await crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify']);
  const buyer = encode58(new Uint8Array(await crypto.subtle.exportKey('raw', keys.publicKey)));
  const signIn = async (origin, now = Date.now()) => { const text = seatSignIn({host: new URL(origin).host, origin, address: buyer, now}); return sealSeatProof(text, new Uint8Array(await crypto.subtle.sign('Ed25519', keys.privateKey, new TextEncoder().encode(text)))); };
  const doors = {lane: await door(UI, worker, {upstream: UPSTREAM})};
  if (PASSES.includes('lab')) doors.tree = UPSTREAM ? await door(UI, worker) : doors.lane;   // the lab is never in the build: its pass runs on this tree
  if (PASSES.includes('before') && BASE_TREE) doors.base = await door(BASE_TREE, worker);
  if (PASSES.includes('window')) doors.over = await door(UI, worker, {closes: new Date(Date.now() - DAY).toISOString(), upstream: UPSTREAM});
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'paywall-chrome-'));
  const child = spawn(CHROME, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, '--window-size=1440,900', '--hide-scrollbars', '--no-first-run',
    '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions', '--disable-default-apps',
    '--disable-features=Translate,MediaRouter,OptimizationHints', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows', '--force-color-profile=srgb', '--autoplay-policy=no-user-gesture-required', 'about:blank'], {stdio: 'ignore'});
  const unique = [...new Set(Object.values(doors))];
  console.log(`chrome pid ${child.pid}; doors ${Object.entries(doors).map(([k, d]) => `${k} ${d.origin}${d.upstream ? ` (bytes from ${d.upstream})` : ''}${d.closes ? ` (MINT_CLOSES ${d.closes})` : ''}`).join(', ')}`);
  let ws = null, ended = false;
  const R = {at: new Date().toISOString(), chrome: CHROME, host: os.hostname(), load: os.loadavg(), passesAsked: PASSES, bound_s: BOUND_S, pass_s: PASS_S,
    site: UPSTREAM ? {upstream: UPSTREAM, page: BUILT.page, lab: 'this tree (the build ships no lab)'} : {tree: UI, page: TREE.page}, wall: null, passes: {}, race: []};
  const write = () => { try { R.ms = Date.now() - T0; fs.writeFileSync(path.join(OUT, 'paywall.proof.json'), JSON.stringify(R, null, 1)); } catch { /* the folder went */ } };
  const end = async () => {
    if (ended) return; ended = true;
    try { ws?.close(); } catch {}
    try { child.kill('SIGTERM'); } catch {}
    for (let i = 0; i < 30 && child.exitCode === null && child.signalCode === null; i++) await sleep(100);
    if (child.exitCode === null && child.signalCode === null) { try { child.kill('SIGKILL'); } catch {} await sleep(200); }
    try { fs.rmSync(dir, {recursive: true, force: true}); } catch {}
    for (const d of unique) await d.close();
  };
  const onSig = () => { write(); end().then(() => process.exit(3)); };
  process.on('SIGTERM', onSig); process.on('SIGINT', onSig);
  // THE RUN'S BOUND: past it the proof writes what it has and ends, inside the sweep's 150 s
  const watchdog = setTimeout(() => { R.overTheBound = true; console.log(`over the run's bound (${BOUND_S} s): ending with what ran`); write(); end().then(() => process.exit(1)); }, BOUND_S * 1000);
  watchdog.unref();
  try {
    let port = null;
    for (let i = 0; i < 400 && !port; i++) {
      await sleep(150);
      if (child.exitCode !== null) throw new Error(`Chrome ended at once (exit ${child.exitCode})`);
      try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {}
    }
    if (!port) throw new Error('Chrome did not open its debugging port in 60 s');
    const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json());
    R.browser = ver.Browser;
    ws = new WebSocket(ver.webSocketDebuggerUrl);
    await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
    let id = 0;
    const wait = new Map(), refused = [], errors = [], fired = new Map();
    const send = (method, params = {}, sessionId) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
    const origins = unique.map((d) => d.origin + '/');
    ws.onmessage = (m) => {
      const x = JSON.parse(m.data);
      if (x.id && wait.has(x.id)) { const wt = wait.get(x.id); wait.delete(x.id); return x.error ? wt.reject(new Error(`${wt.method}: ${x.error.message}`)) : wt.resolve(x.result); }
      if (x.method === 'Fetch.requestPaused') {
        const {url} = x.params.request, ok = origins.some((o) => url.startsWith(o)) || url.startsWith('data:') || url.startsWith('blob:');
        if (ok) send('Fetch.continueRequest', {requestId: x.params.requestId}, x.sessionId).catch(() => {});
        else { refused.push(url.slice(0, 120)); send('Fetch.failRequest', {requestId: x.params.requestId, errorReason: 'BlockedByClient'}, x.sessionId).catch(() => {}); }
        return;
      }
      if (x.method === 'Runtime.exceptionThrown') errors.push(String(x.params?.exceptionDetails?.exception?.description || x.params?.exceptionDetails?.text).slice(0, 300));
      if (x.method === 'Runtime.consoleAPICalled' && x.params.type === 'error') errors.push('console: ' + x.params.args.map((a) => a.value ?? a.description).join(' ').slice(0, 300));
      if (x.method === 'Page.loadEventFired') fired.set(x.sessionId, true);
    };
    // one fresh browser context a pass: its own storage, so a receipt of one pass is never another's
    const pages = new Set();
    const open = async (url, {w = 1440, h = 900, mobile = false, seed = ''} = {}) => {
      const t0 = Date.now();
      const {browserContextId} = await send('Target.createBrowserContext', {disposeOnDetach: true});
      const t = await send('Target.createTarget', {url: 'about:blank', browserContextId, newWindow: true, width: w, height: h});
      const page = {w, h, mobile};
      page.close = async () => { if (!pages.has(page)) return; pages.delete(page); await send('Target.closeTarget', {targetId: t.targetId}).catch(() => {}); await send('Target.disposeBrowserContext', {browserContextId}).catch(() => {}); };
      pages.add(page);
      const s = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
      for (const m of ['Page.enable', 'Runtime.enable', 'Performance.enable']) await send(m, {}, s);
      await send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]}, s);
      await send('Emulation.setDeviceMetricsOverride', {width: w, height: h, deviceScaleFactor: mobile ? 2 : 1, mobile}, s);
      if (mobile) await send('Emulation.setTouchEmulationEnabled', {enabled: true, maxTouchPoints: 5}, s);
      await send('Emulation.setFocusEmulationEnabled', {enabled: true}, s);
      await send('Page.addScriptToEvaluateOnNewDocument', {source: seed + INSTRUMENT}, s);
      fired.delete(s);
      const nav = await send('Page.navigate', {url}, s);
      if (nav.errorText) throw new Error(`the page did not open: ${nav.errorText}`);
      for (let i = 0; i < 200 && !fired.get(s); i++) await sleep(100);
      const ev = async (expression) => {
        const r = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true}, s);
        if (r.exceptionDetails) throw new Error((r.exceptionDetails.exception?.description || r.exceptionDetails.text).slice(0, 400));
        return r.result.value;
      };
      const until = async (expr, ms = 20000, step = 100) => { const t1 = Date.now(); for (;;) { const v = await ev(expr); if (v) return v; if (Date.now() - t1 > ms) throw new Error(`waited ${ms} ms for ${expr.slice(0, 160)}`); await sleep(step); } };
      const shot = async (name) => { const fp = path.join(OUT, name); fs.writeFileSync(fp, Buffer.from((await send('Page.captureScreenshot', {format: 'jpeg', quality: 78, captureBeyondViewport: false}, s)).data, 'base64')); return name; };
      const click = async (x, y) => { for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await send('Input.dispatchMouseEvent', {type, x, y, button: 'left', clickCount: 1}, s); };
      const metrics = async () => Object.fromEntries((await send('Performance.getMetrics', {}, s)).metrics.map((m) => [m.name, m.value]));
      Object.assign(page, {s, ev, until, shot, click, metrics});
      await until('Boolean(window.__pw)', 20000);
      await ev(HELPER);
      page.openedMs = Date.now() - t0;
      return page;
    };
    // a pass runs on its own and inside its own bound: a wait that times out, a throw or the bound fails that pass with what each open page showed
    // at that moment, and the next pass runs; the pages it opened are closed after it
    const LAST_SEEN = `(() => { const m = document.getElementById('page')?.contentWindow ?? window; return {state: window.__h.state(), sample: window.__h.sample(), frame: window.__h.frame(),
      log: window.__h.log(8), events: window.__h.events().slice(-16), seeks: m.__pw.seeks.slice(-12), choice: window.__h.choice(), athena: window.__h.athena(), controls: window.__h.controls(),
      ready: m.document.getElementById('dl-twelve-film')?.readyState, network: m.document.getElementById('dl-twelve-film')?.networkState, hidden: m.document.hidden}; })()`;
    let current = null;
    const pass = async (name, fn, bound = PASS_S) => {
      const r = R.passes[name] ||= {};
      if (Date.now() - T0 > (BOUND_S - 12) * 1000) { r.checks = {ranInsideTheRunsBound: false}; console.log(`${name}: ${judge(r)}: not run, the run's bound is near`); return; }
      const before = new Set(pages), t0 = Date.now();
      current = name;
      let timer = null;
      const run = fn(r);
      run.catch(() => {});   // past its bound the pass's own promise may still fail as its pages close: that is said below, never thrown
      try { await Promise.race([run, new Promise((_, no) => { timer = setTimeout(() => no(new Error(`over the pass's bound (${bound} s)`)), bound * 1000); })]); }
      catch (e) {
        r.error = String(e?.message || e).slice(0, 600);
        r.lastSeen = [];
        let k = 0;
        for (const p of pages) { if (before.has(p)) continue; r.lastSeen.push(p.ev ? await p.ev(LAST_SEEN).catch((x) => ({unreadable: String(x.message).slice(0, 200)})) : {unopened: true}); if (p.shot) r.lastSeen.at(-1).picture = await p.shot(`${name.replace(/\W+/g, '-')}-failed-${++k}.jpg`).catch(() => null); }
        r.checks = {...(r.checks ?? {}), ranToItsEnd: false};
        console.log(`${name}: ${r.error}`);
        console.log(`  last seen: ${JSON.stringify(r.lastSeen).slice(0, 3000)}`);
      } finally {
        clearTimeout(timer);
        r.ms = Date.now() - t0;
        r.errors = [...(r.errors ?? []), ...errors.splice(0)];
        for (const p of [...pages]) if (!before.has(p)) await p.close();
      }
      console.log(`${name}: ${judge(r)} (${(r.ms / 1000).toFixed(1)} s)`);
    };
    // a page ready to play: the hero in view, the film primed and presenting frames, the proof's observer on it; the wall read off the page
    const up = async (p) => {
      await p.until('Boolean(document.getElementById("page")?.contentWindow?.dlTwelve || window.dlTwelve)', 30000, 200);
      await p.ev('window.__h.hideLabPanel()');
      const stage = await p.ev('window.__h.stage()');
      await p.until('window.__h.ready()', 30000, 100);
      await p.until('window.__h.watch()', 10000, 100);
      const W = await p.ev('window.__h.wall()');
      if (!(Number.isInteger(W?.hold) && W.hold > 0 && W.stop > 0 && W.frameS > 0)) throw new Error(`the page names no wall: ${JSON.stringify(W)}`);
      if (!R.wall) { R.wall = {hold: W.hold, stop: W.stop, frameS: W.frameS, holdSecond: Math.round(W.hold * W.frameS * 1e4) / 1e4, closes: W.closes, launch: W.launch}; console.log(`the page's wall: frame ${W.hold}, its stop ${W.stop.toFixed(3)} s (a frame ${(W.frameS * 1000).toFixed(4)} ms), until ${W.closes}`); }
      return {stage, W, openedMs: p.openedMs};
    };
    // the proof's own seek, `lead` seconds before the page's stop (the film and the song, marked as the proof's), then the film playing there
    const near = async (p, W, lead) => {
      const t = Math.round((W.stop - lead) * 1e4) / 1e4;
      await p.ev(`window.__h.seek(${t})`);
      await p.until(`(() => { const s = window.__h.state(); return s.film.t >= ${t - 0.05} && !s.film.paused; })()`, 15000, 50);
      return t;
    };
    // EACH ARRIVAL AT THE WALL, recorded (R.race): whether it held, the sound on or not, and the wall's frame as presented beside the film's own clock
    // read in that frame's callback (the page's draw reads that clock too)
    const arrive = async (p, W, ms) => {
      let err = null;
      try { await p.until('(() => { const s = window.__h.state(); return s?.paywall?.state === "held" && s.film.paused; })()', ms, 50); } catch (e) { err = e; }
      const seen = await p.ev(`(() => { const s = window.__h.state(); return {around: window.__h.log().filter(([t]) => Math.abs(t - ${W.hold * W.frameS}) < 0.15), film: window.__h.frame(), wall: s?.paywall?.state, sound: Boolean(s?.hearing)}; })()`).catch(() => null);
      const at = seen?.around.find(([t]) => frameIn(t, W) === W.hold);
      R.race.push({pass: current, held: !err, sound: seen?.sound ?? null, filmAfter: seen?.film.t ?? null, wall: seen?.wall ?? null,
        wallFrame: at ? {presented: at[0], clock: at[5], clockBehindMs: Math.round((at[0] - at[5]) * 1e6) / 1e3} : null});
      if (err) throw err;
    };
    // a page that plays on through the stop: a frame presented past the wall's, and the film still playing
    const through = (p, W, ms) => p.until(`(() => { const s = window.__h.state(); return !s.film.paused && window.__h.log().some(([t]) => t > ${(W.hold + 0.5) * W.frameS}); })()`, ms, 50);
    // a press as a visitor's: the control scrolled into view (the offer stands below the film), one trusted click at its middle, the hero
    // brought back into view after
    const press = async (p, sel, {back = true} = {}) => {
      const r = await p.ev(`window.__h.reveal(${JSON.stringify(sel)})`);
      if (!r) throw new Error(`no ${sel} on the page`);
      await sleep(150);
      const top = await p.ev(`window.__h.onTop(${JSON.stringify(sel)})`);
      await p.click(r[0], r[1]);
      if (back) { await sleep(150); await p.ev('window.__h.stage()'); }
      return {rect: r.map(Math.round), onTop: top?.on ?? false, under: top?.by ?? null};
    };
    const KEYS = ['ScriptDuration', 'TaskDuration', 'LayoutCount', 'RecalcStyleCount'];
    // a window of time read by the page's own counters (nothing of the proof runs in the page meanwhile)
    const windowed = async (p, ms) => {
      const a = await p.ev('window.__h.counts()'), ma = await p.metrics();
      await sleep(ms);
      const b = await p.ev('window.__h.counts()'), mb = await p.metrics();
      const d = Object.fromEntries(Object.keys(a.sum).map((k) => [k, b.sum[k] - a.sum[k]]));
      const src = Object.fromEntries(Object.entries(b.src).map(([k, v]) => [k, v - (a.src[k] || 0)]).filter(([, v]) => v > 0).sort((x, y) => y[1] - x[1]).slice(0, 8));
      const perf = Object.fromEntries(KEYS.map((k) => [k, k.endsWith('Duration') ? Math.round((mb[k] - ma[k]) * 1e5) / 100 : mb[k] - ma[k]]));   // durations in ms
      return {ms: Math.round(b.at - a.at), counts: d, sources: src, perf, running: await p.ev('window.__h.running()')};
    };
    // the frames the film presented after a moment (ms on the page's clock) and past the wall's frame
    const pastWall = (log, W, since = 0) => log.filter(([t, , now]) => now >= since && t > (W.hold + 0.5) * W.frameS).length;
    const say = (k, v) => console.log(`  ${k}: ${typeof v === 'string' ? v : JSON.stringify(v)}`);

    if (PASSES.includes('before')) await pass('before', async (r) => {
      const d = doors.base ?? doors.lane;
      const p = await open(`${d.origin}${d.page}#oath-sphere`);
      const {W} = await up(p);
      r.door = doors.base ? `--base ${BASE_TREE}` : 'the page under proof';
      await near(p, W, 8);
      r.playing = await windowed(p, 3000);   // its playing seconds, all before the wall
      r.filmAfter = (await p.ev('window.__h.state()')).film;
      r.pause = await press(p, '[data-twelve-pause]', {back: false}); await sleep(1200);   // the page's own Pause (dl-twelve.js: #motion)
      r.pausedByHim = await windowed(p, 3000);
      r.pausedFilm = await p.ev('window.__h.frame()');
      r.checks = {played: r.playing.counts.rvfc > 0, beforeTheWall: r.filmAfter.t < W.hold * W.frameS, pausedByItsButton: r.pausedFilm.paused};
      say('playing', r.playing.counts); say('paused by the page\'s own button', r.pausedByHim.counts);
    });

    if (PASSES.includes('visitor')) await pass('visitor', async (r) => {
      const p = await open(`${doors.lane.origin}${doors.lane.page}#oath-sphere`);
      const {W, openedMs} = await up(p);
      r.openedMs = openedMs; r.wall = W;
      const from = await near(p, W, LEAD_S);
      const armed = await p.ev('window.__h.now()');
      r.before = {sample: await p.ev('window.__h.sample()'), controls: await p.ev('window.__h.controls()')};
      await arrive(p, W, LEAD_S * 2000 + 10000);
      const heldAt = await p.ev('window.__h.now()');
      await sleep(500);
      r.held = {frame: await p.ev('window.__h.frame()'), state: await p.ev('window.__h.state()'), controls: await p.ev('window.__h.controls()'), choice: await p.ev('window.__h.choice()'),
        words: await p.ev('window.__h.words()'), athena: await p.ev('window.__h.athena()')};
      r.picture = await p.shot('visitor-held-at-the-wall-1440x900.jpg');
      r.filmSeeks = await p.ev(`window.__h.seeks(${armed})`);
      r.songSeeks = await p.ev(`window.__h.seeks(${armed}, 'dl-twelve-song')`);
      r.rest = await windowed(p, 2500);
      r.after = {frame: await p.ev('window.__h.frame()'), state: await p.ev('window.__h.state()')};
      const log = await p.ev('window.__h.log()');
      // a late frame past the wall's may be presented before the pause lands (the page then puts the picture back on the wall's frame, never further
      // than a frame): counted, never a fault; after the hold no frame but the wall's own is presented
      r.presented = {fromTheSeek: log.filter(([, , now]) => now >= armed).length, pastTheWall: pastWall(log, W),
        afterTheHold: log.filter(([t, , now]) => now > heldAt + 50 && frameIn(t, W) !== W.hold).length};
      const st = r.held.state, said = mintLine(mintState(Date.now(), W.launch, W.closes)), holdStage = String(choiceAt((W.hold + 0.5) * W.frameS));
      r.said = said;
      r.checks = {
        playedIntoIt: !r.before.sample.filmPaused && r.before.sample.frame < W.hold && r.presented.fromTheSeek > 0,
        skipWhileAhead: r.before.controls.skipHidden === false,
        onTheWallsFrame: onWall(r.held.frame, W),
        wallHeld: st.paywall.state === 'held' && st.paywall.pictureHeld === true && st.paywall.holds === 1,
        songStopsWithIt: st.song.paused && Math.abs(st.song.t - st.film.t) <= W.frameS,
        theWallsOwnNotAPresentation: !st.cinematic?.active,
        sphereHeld: st.sphere?.held === true,
        restartWaits: r.held.controls.restartDisabled === true,
        skipAway: r.held.controls.skipHidden === true,
        // the offer (#dl-paywall-choice) stands only when the page holds it: commented out since c35854ae6 (landed by 9f523da5d, Oct 30), so these engage when it returns
        choiceIfAnyStands: !r.held.choice || (!r.held.choice.hidden && r.held.choice.stage === holdStage),
        lineIfAnyCountsTheDays: !r.held.words || r.held.words.line === said,
        neverBackPastAFrame: backOf(r.filmSeeks) <= W.frameS + 1e-4,
        stillHeld: onWall(r.after.frame, W) && r.after.state.paywall.state === 'held' && r.after.state.paywall.holds === 1 && r.presented.afterTheHold === 0,
      };
      say('the wall', `from ${from} s: held on frame ${r.held.frame.frame} at ${r.held.frame.t} s (paused ${r.held.frame.paused}); the song ${st.song.t} s (paused ${st.song.paused}, volume ${st.song.volume}); sphere held ${st.sphere?.held}; ${JSON.stringify(r.held.controls)}; the choice stage ${r.held.choice?.stage} (the page's choiceAt ${holdStage}), hidden ${r.held.choice?.hidden}; its line "${r.held.words?.line}" (the page's own words now: "${said}"); her ${JSON.stringify(r.held.athena)}`);
      say('the page\'s seeks', {film: r.filmSeeks, song: r.songSeeks});
      say('2.5 s at rest', `${JSON.stringify(r.rest.counts)} from ${JSON.stringify(r.rest.sources)}; presented ${JSON.stringify(r.presented)}; still ${JSON.stringify(r.after.frame)} ${r.after.state.paywall.state}`);
    });

    if (PASSES.includes('song')) await pass('song', async (r) => {
      // THE SOUND BEFORE THE WALL (CLAUDE.md, The rule, 8): the sound tapped on as a visitor taps it, the song in at the picture's second, the picture never
      // taken back; at the wall the song stops with the picture (the wall's: continuousSound off since THE ANIME NEVER STOPS)
      const p = await open(`${doors.lane.origin}${doors.lane.page}#oath-sphere`);
      const {W} = await up(p);
      const from = await near(p, W, SOUND_LEAD_S);
      await p.until(`window.__h.state().film.t >= ${from + 0.4}`, 10000, 20);
      const armed = await p.ev('window.__h.now()');
      r.tap = {before: await p.ev('window.__h.sample()'), onTop: await p.ev('window.__h.onTop("[data-twelve-sound]")')};
      const button = await p.ev('window.__h.rect("[data-twelve-sound]")');
      await p.click(button[0], button[1]);   // a trusted click on the page's own sound button
      await p.until('window.__h.state().soundOn && window.__h.state().hearing && !window.__h.state().song.paused', 10000, 50);
      r.joined = await p.ev('window.__h.sample()');
      const approach = [];
      for (let i = 0; i < 40; i++) { const s = await p.ev('window.__h.sample()'); approach.push(s); if (s.wall === 'held') break; await sleep(200); }
      r.approach = approach;
      await arrive(p, W, 12000);
      const samples = [];
      for (let i = 0; i < 6; i++) { samples.push(await p.ev('window.__h.sample()')); await sleep(400); }
      r.samples = samples;
      r.filmSeeks = await p.ev(`window.__h.seeks(${armed})`);
      r.songSeeks = await p.ev(`window.__h.seeks(${armed}, 'dl-twelve-song')`);
      const log = await p.ev('window.__h.log()');
      r.tapFrame = log.filter(([, , now]) => now < armed).at(-1)?.[0] ?? null;
      const after = log.filter(([, , now]) => now >= armed);
      r.lowestAfterTap = after.length ? Math.min(...after.map(([t]) => t)) : null;
      const playing = approach.filter((s) => s.wall !== 'held' && !s.songPaused);
      r.checks = {soundOn: r.joined.song > 0 && !r.joined.songPaused,
        inAtThePicturesSecond: Math.abs(r.joined.song - r.joined.film) <= 1,
        tapSeeksNoPicture: r.filmSeeks.every(([, , , t]) => t > r.joined.at),
        tapNeverTakesThePictureBack: r.tapFrame !== null && r.lowestAfterTap !== null && r.lowestAfterTap >= r.tapFrame - 1e-3,
        pictureOnlyForwardOrOntoTheWall: r.filmSeeks.every(([, f, t]) => t >= f || frameIn(t, W) === W.hold),
        songNeverBackwardsOnTheWay: playing.every((s, i) => i === 0 || s.song >= playing[i - 1].song - 0.03),
        bothStopAtTheWall: samples.every((s) => onWall({t: s.film, paused: s.filmPaused}, W) && s.songPaused && s.wall === 'held'),
        songOnThePicturesSecond: samples.every((s) => Math.abs(s.song - s.film) <= W.frameS),
        songFadedOut: samples.every((s) => s.volume <= 0.05) && playing.length > 0 && playing[0].volume >= 0.95,
        songOnlyToThePicture: r.songSeeks.every(([, f, t]) => t >= f || frameIn(t, W) === W.hold)};
      say('the tap', `at film ${r.tap.before.film} s (the button on top ${r.tap.onTop?.on}) -> the song ${r.joined.song} s with the film at ${r.joined.film} s; the film's lowest frame after it ${r.lowestAfterTap} s (at the tap ${r.tapFrame})`);
      say('the way to the wall', approach.map((s) => `${s.film}/${s.song} v${s.volume}${s.songPaused ? ' song paused' : ''}${s.wall === 'held' ? ' HELD' : ''}`).join(', '));
      say('at the wall', samples.map((s) => `${s.film} (frame ${s.frame}${s.filmPaused ? ', paused' : ''}) / ${s.song}${s.songPaused ? ' paused' : ''} v${s.volume}`).join('; '));
      say('the page\'s seeks', {film: r.filmSeeks, song: r.songSeeks});
    });

    if (PASSES.includes('holder')) await pass('holder', async (r) => {
      const o = worker.order(buyer, 'gold');   // the stand-in Worker's paid receipt for the stand-in wallet: no purchase was made
      // the wallet's seat proof, kept as the checkout keeps it after the wallet signed in once (SEAT_KEY + the wallet)
      const seed = `try { if (!localStorage.getItem(${JSON.stringify(`${SEAT_KEY}${buyer}`)})) localStorage.setItem(${JSON.stringify(`${SEAT_KEY}${buyer}`)}, ${JSON.stringify(await signIn(doors.lane.origin))}); } catch {}\n`;
      const calls0 = worker.calls.length;
      const p = await open(`${doors.lane.origin}${doors.lane.page}#oath-sphere`, {seed});
      const {W} = await up(p);
      r.receipt = {id: o.id, tier: o.tier, standIn: true};
      await p.until('window.__h.state().paywall.state === "open"', 15000, 50);
      await near(p, W, LEAD_S);
      await through(p, W, LEAD_S * 2000 + 8000);
      await sleep(400);
      const st = await p.ev('window.__h.state()');
      r.paywall = st.paywall; r.frame = await p.ev('window.__h.frame()'); r.choice = await p.ev('window.__h.choice()'); r.controls = await p.ev('window.__h.controls()');
      r.asked = worker.calls.slice(calls0).filter((c) => c.call.startsWith('GET /api/premint/receipts')).map((c) => `${c.call}${c.seat ? ' [x-seat]' : ''}`);
      r.otherReads = worker.calls.slice(calls0).map((c) => c.call).filter((c) => !c.startsWith('GET /api/premint/receipts') && !loadRead(c));
      const ask = `GET /api/premint/receipts?buyer=${buyer} [x-seat]`;
      r.checks = {oneAskWithTheProof: r.paywall.asks === 1 && r.asked.length === 1 && r.asked[0] === ask, wallOpen: r.paywall.state === 'open' && r.paywall.opened === 'receipt',
        neverHeld: r.paywall.holds === 0, choiceAway: !r.choice || r.choice?.hidden, playsOnThroughTheStop: !r.frame.paused && frameIn(r.frame.t, W) > W.hold, restartFree: r.controls.restartDisabled === false};
      say('the holder', `${JSON.stringify({state: r.paywall.state, opened: r.paywall.opened, holds: r.paywall.holds, asks: r.paywall.asks, receipts: r.paywall.receipts})}; film ${r.frame.t} s (frame ${r.frame.frame}, paused ${r.frame.paused}); the choice hidden ${r.choice?.hidden}; asked ${JSON.stringify(r.asked)}; its other reads ${JSON.stringify(r.otherReads)}`);
    });

    if (PASSES.includes('bareid')) await pass('bareid', async (r) => {
      // THE SEAT PROOF's other side: the wallet's paid orders by id alone, as an older checkout kept them in a browser and as anyone reads them in the
      // payments' memos on mainnet: the wall stands and the Worker is asked nothing
      const ids = {gold: worker.order(buyer, 'gold').id, bronze: worker.order(buyer, 'bronze').id};
      const seed = Object.entries(ids).map(([tier, id]) => `try { localStorage.setItem(${JSON.stringify(`${RECEIPT_KEY}${buyer}:${tier}`)}, ${JSON.stringify(id)}); } catch {}\n`).join('');
      const calls0 = worker.calls.length;
      const p = await open(`${doors.lane.origin}${doors.lane.page}#oath-sphere`, {seed});
      const {W} = await up(p);
      r.ids = ids;
      await near(p, W, LEAD_S);
      await arrive(p, W, LEAD_S * 2000 + 10000); await sleep(400);
      const st = await p.ev('window.__h.state()');
      r.paywall = st.paywall; r.frame = await p.ev('window.__h.frame()');
      r.asked = worker.calls.slice(calls0).map((c) => c.call).filter((c) => c.includes('/receipts') || c.includes('/orders/'));
      r.checks = {wallHolds: st.paywall.state === 'held' && onWall(r.frame, W), askedNothing: r.asked.length === 0 && st.paywall.asks === 0 && st.paywall.receipts === 0};
      say('the bare ids', `${JSON.stringify({state: st.paywall.state, asks: st.paywall.asks, receipts: st.paywall.receipts})}; held on frame ${r.frame.frame} at ${r.frame.t} s, paused ${r.frame.paused}; asked ${JSON.stringify(r.asked)}`);
    });

    if (PASSES.includes('window')) await pass('window', async (r) => {
      // the mint's close a day back (this door's MINT_CLOSES): the wall is open for everyone from the load, and the film plays on through the stop
      const d = doors.over;
      const p = await open(`${d.origin}${d.page}#oath-sphere`);
      const {W} = await up(p);
      r.closes = W.closes; r.atLoad = (await p.ev('window.__h.state()')).paywall;
      await near(p, W, LEAD_S);
      await through(p, W, LEAD_S * 2000 + 8000);
      await sleep(400);
      const st = await p.ev('window.__h.state()');
      r.paywall = st.paywall; r.frame = await p.ev('window.__h.frame()'); r.choice = await p.ev('window.__h.choice()'); r.words = await p.ev('window.__h.words()'); r.controls = await p.ev('window.__h.controls()');
      r.said = mintLine(mintState(Date.now(), W.launch, W.closes));
      r.checks = {theDoorsClose: r.closes === d.closes, openForEveryoneFromTheLoad: r.atLoad.state === 'open' && r.atLoad.opened === 'window' && r.atLoad.exclusive === false,
        neverHeld: r.paywall.holds === 0, choiceAway: !r.choice || r.choice?.hidden, playsOnThroughTheStop: !r.frame.paused && frameIn(r.frame.t, W) > W.hold,
        lineIfAnySaysItClosed: !r.words || r.words?.lineText === r.said, skipAway: r.controls.skipHidden === true};
      say('closed a day ago', `${JSON.stringify({state: r.paywall.state, opened: r.paywall.opened, holds: r.paywall.holds, exclusive: r.paywall.exclusive})}; film ${r.frame.t} s (frame ${r.frame.frame}, paused ${r.frame.paused}); the choice hidden ${r.choice?.hidden}; its line "${r.words?.lineText}" (the page's own words: "${r.said}")`);
    });

    if (PASSES.includes('phone')) await pass('phone', async (r) => {
      // the wall on a phone (390 x 844, a first visit): held on its frame, the song with it, nothing of the page sideways; a choice, when the page
      // holds one, stands with its controls inside the 16 px gutters and a finger tall
      const p = await open(`${doors.lane.origin}${doors.lane.page}#oath-sphere`, {w: 390, h: 844, mobile: true});
      const {W} = await up(p);
      await near(p, W, LEAD_S);
      await arrive(p, W, LEAD_S * 2000 + 10000); await sleep(600);
      r.frame = await p.ev('window.__h.frame()'); r.state = await p.ev('window.__h.state()');
      r.picture = await p.shot('wall-phone-390x844-held.jpg');
      r.scrollWidth = await p.ev('(document.getElementById("page")?.contentDocument ?? document).documentElement.scrollWidth');
      r.choice = await p.ev('window.__h.choice()');
      const fit = r.choice ? await p.ev('window.__h.fits()') : null;
      r.controls = fit ? fit.controls.map((q) => ({...q, fits: q.left >= 16 - 0.5 && q.right <= fit.width - 16 + 0.5 && q.height >= 44 - 0.5})) : null;
      if (fit) await p.ev('window.__h.stage()');
      await sleep(1500);
      r.after = await p.ev('window.__h.frame()'); r.afterState = await p.ev('window.__h.state()');
      r.checks = {holds: r.state.paywall.state === 'held' && onWall(r.frame, W), songStopsWithIt: r.state.song.paused && Math.abs(r.state.song.t - r.state.film.t) <= W.frameS,
        stillHeld: onWall(r.after, W) && r.afterState.paywall.state === 'held' && r.afterState.paywall.holds === 1, noSideways: r.scrollWidth <= 390,
        choiceIfAnyStands: !r.choice || (!r.choice?.hidden && r.choice?.stage === String(choiceAt((W.hold + 0.5) * W.frameS)) && r.controls.every((q) => q.fits && (q.disabled || q.onTop)))};
      say('the phone', `held at ${r.frame.t} s (frame ${r.frame.frame}, paused ${r.frame.paused}), the song ${r.state.song.t} s (paused ${r.state.song.paused}); scrollWidth ${r.scrollWidth}; the choice ${r.choice ? `stage ${r.choice?.stage}, its controls ${JSON.stringify(r.controls)}` : 'none on the page'}; after ${JSON.stringify(r.after)} ${r.afterState.paywall.state}`);
    });
    if (PASSES.includes('lab')) {
      const d = doors.tree;
      await pass('lab, a minter\'s view', async (r) => {   // ?paywall=off (dl-paywall.js reviewOf 'holder'): the lanes' proofs that look past the stop
        const p = await open(`${d.origin}${d.lab}?v=film&paywall=off`);
        const {W} = await up(p);
        r.atLoad = (await p.ev('window.__h.state()')).paywall;
        await near(p, W, LEAD_S);
        await through(p, W, LEAD_S * 2000 + 8000);
        await sleep(300);
        const st = await p.ev('window.__h.state()');
        r.paywall = st.paywall; r.frame = await p.ev('window.__h.frame()'); r.choice = await p.ev('window.__h.choice()');
        r.checks = {wallOpenAsAMinter: r.atLoad.state === 'open' && r.atLoad.opened === 'lab' && r.atLoad.review === 'holder', neverHeld: r.paywall.holds === 0, choiceAway: !r.choice || r.choice?.hidden,
          playsOnThroughTheStop: !r.frame.paused && frameIn(r.frame.t, W) > W.hold};
        say('his lab, ?paywall=off', `${JSON.stringify({state: r.paywall.state, opened: r.paywall.opened, holds: r.paywall.holds, review: r.paywall.review})}; film ${r.frame.t} s (frame ${r.frame.frame}, paused ${r.frame.paused}); the choice hidden ${r.choice?.hidden}`);
      });
      await pass('lab, as it opens', async (r) => {   // his one page for QA meets the wall as a visitor does (dl-paywall.js reviewOf 'visitor')
        const p = await open(`${d.origin}${d.lab}?v=film`);
        const {W} = await up(p);
        r.atLoad = (await p.ev('window.__h.state()')).paywall;
        await near(p, W, LEAD_S);
        await arrive(p, W, LEAD_S * 2000 + 10000); await sleep(500);
        const st = await p.ev('window.__h.state()');
        r.paywall = st.paywall; r.frame = await p.ev('window.__h.frame()'); r.choice = await p.ev('window.__h.choice()');
        r.picture = await p.shot('lab-as-it-opens-held-at-the-wall.jpg');
        r.checks = {aVisitorsWall: r.atLoad.review === 'visitor' && r.atLoad.state === 'watch', held: st.paywall.state === 'held' && onWall(r.frame, W), songStopsWithIt: st.song.paused,
          choiceIfAnyStands: !r.choice || (!r.choice?.hidden && r.choice?.stage === String(choiceAt((W.hold + 0.5) * W.frameS)))};
        say('his lab as it opens', `${JSON.stringify({state: st.paywall.state, review: st.paywall.review, holds: st.paywall.holds})}; held on frame ${r.frame.frame} at ${r.frame.t} s (paused ${r.frame.paused}); the song paused ${st.song.paused}; the choice stage ${r.choice?.stage}, hidden ${r.choice?.hidden}`);
      });
    }

    R.refused = [...new Set(refused)];
    R.workerCalls = [...new Set(worker.calls.map((c) => c.call.replace(/buyer=[^&]+/, 'buyer=<the stand-in>')))];
    R.raceSummary = {arrivals: R.race.length, held: R.race.filter((x) => x.held).length, heard: R.race.filter((x) => x.sound).length};
    console.log(`the arrivals at the wall: ${R.race.map((x) => `${x.pass} ${x.held ? 'held' : 'NOT HELD'} (sound ${x.sound ? 'on' : 'off'}; the wall's frame shown at ${x.wallFrame?.presented ?? '?'} s, the film's clock ${x.wallFrame?.clock ?? '?'} s)`).join('; ')}`);
    if (R.refused.length) console.log(`refused: ${R.refused.join(', ')}`);
    R.verdict = Object.fromEntries(Object.entries(R.passes).map(([k, v]) => [k, v.pass === true]));
    R.pass = Object.keys(R.verdict).length > 0 && Object.values(R.verdict).every(Boolean);
    console.log(`verdict: ${Object.entries(R.verdict).map(([k, v]) => `${k} ${v ? 'PASS' : 'FAIL'}`).join(', ')}: ${R.pass ? 'every pass holds' : 'NOT every pass holds'} (${((Date.now() - T0) / 1000).toFixed(1)} s)`);
    if (!R.pass) process.exitCode = 1;
  } finally {
    clearTimeout(watchdog);
    write();
    console.log(`wrote ${path.join(OUT, 'paywall.proof.json')}`);
    process.off('SIGTERM', onSig); process.off('SIGINT', onSig);
    await end();
  }
}

if (process.argv[1] && fs.realpathSync(process.argv[1]) === fileURLToPath(import.meta.url)) main().catch((e) => { console.error(e); process.exit(1); });

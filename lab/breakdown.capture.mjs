#!/usr/bin/env node
// breakdown.capture.mjs: THE BREAKDOWN's passes, his hero scene by scene as After Effects' 3D view lays a shot out (lab/breakdown.html shows
// them). His words, Oct 15 2026 ~01:00 WEST, over the behind-the-scenes of an After Effects opening (its 2D layers stood as cards in depth, the
// shot's camera a frustum, the finished shot under it): "can you please start outlining to me what we have scene by scene? is it possible for
// you to give me something like this or not?".
//
// WHAT IT DOES. One muted headless Chrome over CDP, off every screen, opens his page and for each scene of scenes.mjs plays the film in to the
// scene's second, pauses it with the page's own pause (the sphere, the film and the song stand still: nothing draws until a cause), seeks it
// to the second exactly and lets it settle. Then it takes the page apart into the layers it is drawn in, one transparent PNG per layer, the
// page's own paper hidden and Chrome's default background transparent (Emulation.setDefaultBackgroundColorOverride, alpha 0), every other
// layer hidden (visibility, which changes no layout and wakes no observer):
//   film        the film's own frame at that second (app/dl-twelve.js #dl-twelve-film, read into a canvas, the 1986 picture inside the file:
//               theater-light.mjs CROP), laid where the theater has the film behind the page (theater.js, fit 0.92 on the hero)
//   paper       the page's paper: the backgrounds of the stage's ancestors and .atmosphere (app/warm.css, app/warm-layout.css)
//   sphere      the sphere's 2D canvas (app/warm-sphere.js #genesis-sphere, and #hero-front while the box is out: orbit-kick.js THE HUSH) with
//               the twelve worlds left out
//   worlds      the same canvases with only the twelve worlds and their Lissajous trails (warm-sphere.js orbitalSocieties; orbit-kick.js
//               moves them): the page draws them on the sphere's own canvas, so the pass sets apart what is drawn in their four lane colours
//               (orbit-kick.js LANES, the colours only orbitalSocieties uses) and what is drawn after one inside the same save (their
//               miniatures once the network comes), by own-property wrappers on that context in this Chrome only; the page is not touched
//   dark        THE FOLD's black (#hero-dark, driven by unboxing.js onDark)
//   theater     the theater's burst glass (lab/theater.js #hero-theater)
//   irradiance  the inversion of the mask (lab/irradiance.js #hero-irradiance)
//   box         the box, the unboxing and the fold (lab/unboxing.js #hero-box)
//   raid        Dolbar's raid, the shield, the resistance (lab/anti-satellites.js #hero-anti-satellites)
//   sacrifice   THE SACRIFICE, the one who takes the hit cut out and held up for one second (lab/sacrifice.js #hero-sacrifice)
//   ko          the KO edge (lab/ko-edge.js #hero-ko-edge)
//   dom         the DOM over it: THE CHOICE, the wall's offer, the sound buttons (seen on a hover), the invitation bubble (app/warm.html,
//               app/dl-paywall.js, app/dl-twelve.js, the bubble's mounting)
//   composite   the page whole, as he sees it at that second (taken first, before anything is hidden)
// A layer is found by its element in the hero's document: [data-layer~="<pass>"] if the page marks it so, else the id its mounting gives it
// (the ids above). Each pass's z is its place in the page's own stacking (z-index, then positioned or not, then the document's order: the
// sphere's canvas is static, so it paints under every positioned layer whatever their order), read off the page at each scene; its box is its
// elements' on the window; its ink is where its PNG holds any pixel. Writes <out>/<scene id>/<pass>.png and <out>/manifest.json.
//
// WHICH PAGE. His page is the mint page itself, app/warm.html; lane/one-page moves every hero layer into its own document, and lab/hero-ab.html
// becomes a panel over it. The capture finds the hero either way, by what the page holds and never by a script of the lab's: the document
// with #sphere-stage is the page's own or the frame's (hero-ab.html's iframe, as now); a handle the page may offer (window.hero) is only asked
// for the box's models and a redraw, and nothing waits on it. --url auto (the default) opens app/warm.html?paywall=off and goes where his page
// goes (on his door THE BRIDGE, d723196c, sends it on to lab/hero-ab.html until one-page lands): the page it ends on is taken when the layers
// stand in its own document or in its frame; when they stand in neither (a door with no bridge, before one-page), the capture goes through
// lab/hero-ab.html?v=film&paywall=off. --url <page> takes that page as it is.
// A door behind the house's lock (aiolos answers a browser with "DysonLight · Harmony", the Touch ID lock) is left as it is: the capture asks
// nothing of it (no POST ever leaves this Chrome), says so and ends; unlock the door, or capture a served tree (--origin of serve-range).
//
// WHOSE VIEW. --url is the minter's view (?paywall=off: no choice, no wall), so the scenes behind the wall are reached. A scene up to the wall
// (the hold on frame 1111, 37.087 s: app/dl-paywall.js HOLD_S) is taken as a visitor meets it, the same page without ?paywall=off, as his page
// is (THE CHOICE comes in from her cut, the film holds on the previous screen with the choice standing as the wall); --views holder takes every
// scene in --url's own view. A scene past the wall that the page still holds there (a page that does not take ?paywall=off as a minter's) is
// not written, and the manifest says so.
//
// PRIVACY. Requests go only to the page's origin, GET and HEAD only (everything else is refused and listed, his tags' read from the Nest
// included: the page then uses its copy as at rev 1); never to the submission's videos (submission/*.mp4: his hackathon demo and pitch, web
// cuts of ~/Movies), which the wall's offer will hold: they are refused at the network, and before every pass (the composite too) every
// <video> inside #dl-paywall and #dl-paywall-choice is display:none, checked on the page before the picture is taken (a scene where one shows
// is not written). The pictures hold frames of the Saint Seiya film: lab/breakdown-pictures/ is gitignored, never committed, never sent.
//
//   nice -n 19 node lab/breakdown.capture.mjs [--url auto|<page>] [--origin http://127.0.0.1:8921] [--only id,id] [--out <dir>]
//                                              [--size 1440x900] [--views auto|holder] [--lead 1.2] [--limit 1500] [--chrome <path>] [--probe-private]
// --probe-private plants a <video> in #dl-paywall at each scene and proves it never reaches a picture (the proof of the privacy rule).
// COST: one Chrome (about 500 MB) for about 15 s a scene (its play-in, its settling, twelve pictures); run it niced, under its own --limit.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import zlib from 'node:zlib';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {SCENES, HOLD_S, problems} from './scenes.mjs';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ORIGIN = 'http://127.0.0.1:8921';
export const PAGES = Object.freeze({
  one: '/intro/dyson-society/app/warm.html?paywall=off',                 // his page, once lane/one-page lands (the layers in its own document)
  framed: '/intro/dyson-society/lab/hero-ab.html?v=film&paywall=off',    // the lab's page over it (the layers in its iframe), until then
});
export const OUT = path.join(HERE, 'breakdown-pictures');

// The passes, as the page is built (#sphere-stage in app/warm.html and what is mounted on it). `of`: the elements' ids in the hero's document;
// [data-layer~="<id>"] is looked for first.
export const PASSES = Object.freeze([
  {id: 'film', name: "the film's own frame", file: 'app/saint-seiya.mp4 (app/dl-twelve.js #dl-twelve-film)', of: ['#dl-twelve-film'], how: 'the video read into a canvas'},
  {id: 'paper', name: "the page's paper", file: 'app/warm.css, app/warm-layout.css', of: [], how: "the stage's ancestors and .atmosphere alone"},
  {id: 'sphere', name: 'the sphere', file: 'app/warm-sphere.js', of: ['#genesis-sphere', '#hero-front'], how: 'its canvas without the lane colours'},
  {id: 'worlds', name: 'the twelve worlds and their Lissajous trails', file: 'app/warm-sphere.js orbitalSocieties, lab/orbit-kick.js', of: ['#genesis-sphere', '#hero-front'], how: "the sphere's canvas, the lane colours alone"},
  {id: 'dark', name: "the fold's black", file: '#hero-dark (lab/unboxing.js onDark)', of: ['#hero-dark'], how: 'its element alone'},
  {id: 'theater', name: "the theater's burst glass", file: 'lab/theater.js', of: ['#hero-theater'], how: 'its canvas alone'},
  {id: 'irradiance', name: 'the inversion of the mask', file: 'lab/irradiance.js', of: ['#hero-irradiance'], how: 'its canvas alone'},
  {id: 'box', name: 'the box (the unboxing, the fold)', file: 'lab/unboxing.js', of: ['#hero-box'], how: 'its canvas alone'},
  {id: 'raid', name: "Dolbar's raid, the shield", file: 'lab/anti-satellites.js', of: ['#hero-anti-satellites'], how: 'its canvas alone'},
  {id: 'sacrifice', name: 'the sacrifice, cut out and held up', file: 'lab/sacrifice.js', of: ['#hero-sacrifice'], how: 'its canvas alone'},
  {id: 'ko', name: 'the KO edge', file: 'lab/ko-edge.js', of: ['#hero-ko-edge'], how: 'its element alone'},
  {id: 'dom', name: 'the DOM over it', file: 'app/warm.html, app/dl-paywall.js, app/dl-twelve.js, the bubble', of: [], how: 'every element that is not a layer, the paper, the film or the song'},
  {id: 'composite', name: 'the page as he sees it', file: 'his page', of: [], how: 'nothing hidden'},
]);
export const LAYER_IDS = Object.freeze(PASSES.filter((p) => p.id !== 'composite').map((p) => p.id));
// the page's stacking as it stands (Oct 15 2026): the plate, the paper, the static sphere canvas (the worlds on it), then the positioned
// layers in the order they are mounted, then the DOM at z-index 4 and 5. The capture reads it off the page each time; the test holds a
// manifest to the page's own reading and to this.
export const STACK = Object.freeze(['film', 'paper', 'sphere', 'worlds', 'dark', 'theater', 'irradiance', 'box', 'raid', 'sacrifice', 'ko', 'dom']);
// what orbit-kick.js reads as the twelve's (warm-sphere.js orbitalSocieties: the light theme's four lanes, then the dark's)
export const LANES = Object.freeze(['#a98242', '#438c82', '#b49a68', '#6d8698', '#d6bd7d', '#85bcb0', '#c7ac7a', '#9cbbb9']);
// theater-light.mjs CROP: the 1986 picture inside the 960 x 540 file; theater.js on the hero (createTheater fit)
export const CROP = Object.freeze([82, 4, 796, 532]);
export const THEATER_FIT = 0.92;
// THE PRIVATE RULE (his hackathon videos, which the wall's offer will hold): never shown in a pass, the composite included
export const PRIVATE_CSS = '#dl-paywall video,#dl-paywall-choice video,video[data-bd-probe]{display:none!important;visibility:hidden!important}';
// the submission's files are never asked for, whatever the page says
const PRIVATE_PATH = /\/submission\/|\/Movies\//i;

/** Whether the capture lets a request through: the page's own origin only, GET or HEAD (data: and blob: of the page too), never the
 *  submission's files. */
export function allowed(url, origin, method = 'GET') {
  if (typeof url !== 'string') return false;
  if (url.startsWith('data:') || url.startsWith('blob:')) return true;
  if (method !== 'GET' && method !== 'HEAD') return false;
  let u;
  try { u = new URL(url); } catch { return false; }
  if (u.origin !== origin) return false;
  let p = u.pathname;
  try { p = decodeURIComponent(p); } catch {}
  return !PRIVATE_PATH.test(p);
}
/** The two views of one page: the holder's (?paywall=off) and the visitor's (without it); which one `url` itself is. */
export function viewsOf(url) {
  const u = new URL(url), visitor = new URL(url), holder = new URL(url);
  visitor.searchParams.delete('paywall'); holder.searchParams.set('paywall', 'off');
  return {visitor: visitor.href, holder: holder.href, given: u.searchParams.get('paywall') === 'off' ? 'holder' : 'visitor'};
}
/** Which view takes a scene: a visitor's up to the wall's hold (as his page meets it), a holder's after; 'holder' mode: --url's own. */
export const viewFor = (scene, mode = 'auto', given = 'holder') => mode === 'auto' ? (scene.t <= HOLD_S + 1e-3 ? 'visitor' : 'holder') : given;
/** The film's picture behind the page in window px, as theater.js lays it on the stage ({x, y, w, h}): centred, its height
 *  min(1, aspect / FA) x fit of the stage's. */
export function filmBox(stage, crop = CROP, fit = THEATER_FIT) {
  const FA = crop[2] / crop[3], aspect = stage.w / stage.h, hd = Math.min(1, aspect / FA) * fit;
  const h = hd * stage.h, w = h * FA;
  return [stage.x + (stage.w - w) / 2, stage.y + (stage.h - h) / 2, w, h].map((v) => Math.round(v * 10) / 10);
}
/** Whether a manifest's stacking for a scene is the page's: every pass it names once, in an order consistent with STACK. */
export function stackProblems(order) {
  const out = [];
  if (!Array.isArray(order) || !order.length) return ['no order'];
  if (new Set(order).size !== order.length) out.push('a pass twice');
  for (const id of order) if (!STACK.includes(id)) out.push(`${id} is not a layer`);
  const known = order.filter((id) => STACK.includes(id));
  for (let i = 1; i < known.length; i++) if (STACK.indexOf(known[i]) < STACK.indexOf(known[i - 1])) out.push(`${known[i]} over ${known[i - 1]}: not the page's stacking`);
  return out;
}

/** A PNG's size and where it holds any pixel (alpha > 0): {w, h, ink: [x, y, w, h] | null}. RGBA or RGB, 8 bits, not interlaced. */
export function pngInk(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('not a PNG');
  let w = 0, h = 0, type = 0, depth = 0, interlace = 0, off = 8;
  const idat = [];
  while (off < buf.length) {
    const len = buf.readUInt32BE(off), kind = buf.toString('latin1', off + 4, off + 8), data = buf.subarray(off + 8, off + 8 + len);
    if (kind === 'IHDR') { w = data.readUInt32BE(0); h = data.readUInt32BE(4); depth = data[8]; type = data[9]; interlace = data[12]; }
    else if (kind === 'IDAT') idat.push(data);
    else if (kind === 'IEND') break;
    off += 12 + len;
  }
  if (depth !== 8 || interlace !== 0 || type !== 6) return {w, h, ink: [0, 0, w, h]};   // no alpha to read (or not ours to read): all of it
  const raw = zlib.inflateSync(Buffer.concat(idat)), bpp = 4, stride = w * bpp;
  let prev = new Uint8Array(stride), cur = new Uint8Array(stride);
  let x0 = w, y0 = h, x1 = -1, y1 = -1;
  for (let y = 0; y < h; y++) {
    const at = y * (stride + 1), f = raw[at];
    for (let i = 0; i < stride; i++) {
      const x = raw[at + 1 + i], a = i >= bpp ? cur[i - bpp] : 0, b = prev[i], c = i >= bpp ? prev[i - bpp] : 0;
      let v;
      if (f === 0) v = x;
      else if (f === 1) v = x + a;
      else if (f === 2) v = x + b;
      else if (f === 3) v = x + ((a + b) >> 1);
      else { const p = a + b - c, pa = Math.abs(p - a), pb = Math.abs(p - b), pc = Math.abs(p - c); v = x + (pa <= pb && pa <= pc ? a : pb <= pc ? b : c); }
      cur[i] = v & 255;
    }
    for (let px = 0; px < w; px++) if (cur[px * 4 + 3]) { if (px < x0) x0 = px; if (px > x1) x1 = px; if (y < y0) y0 = y; y1 = y; }
    [prev, cur] = [cur, prev];
  }
  return {w, h, ink: x1 < 0 ? null : [x0, y0, x1 - x0 + 1, y1 - y0 + 1]};
}

// ------------------------------------------------------------------------------------------------------------------------------------------
// What runs in the page. The hero's document is the page's own (app/warm.html) or a frame's (lab/hero-ab.html's iframe): whichever holds
// #sphere-stage. Never a requestAnimationFrame loop of its own: it waits on the page's own frames and timers, and it only hides, reads and asks
// for one draw.
export function pageHelper(passes, lanes, privateCss, crop, fit) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  const frames = (n) => new Promise((r) => { let k = 0; const f = () => (++k >= n ? r() : requestAnimationFrame(f)); requestAnimationFrame(f); });
  const heroWin = () => {
    if (document.getElementById('sphere-stage')) return window;
    for (const f of document.querySelectorAll('iframe')) { try { if (f.contentDocument?.getElementById('sphere-stage')) return f.contentWindow; } catch {} }
    return null;
  };
  const win = () => heroWin(), doc = () => heroWin()?.document ?? null, own = () => heroWin() === window;
  const film = () => doc()?.getElementById('dl-twelve-film') ?? null;
  // a handle the page may offer (lab/hero-ab.html's window.hero today): asked, never waited on
  const handle = () => { try { return window.hero ?? win()?.hero ?? null; } catch { return null; } };
  const LANES = new Set(lanes), PASS = Object.fromEntries(passes.map((p) => [p.id, p]));
  const find = (id) => {
    const d = doc(), marked = [...d.querySelectorAll(`[data-layer~="${id}"]`)];
    return marked.length ? marked : PASS[id].of.map((s) => d.querySelector(s)).filter(Boolean);
  };
  const layersHere = (d) => Boolean(d?.querySelector('[data-layer], #hero-theater, #hero-box'));
  let mode = 'all', depth = 0, block = null, wrapped = null, marked = [];
  // the sphere's 2D context, wrapped in own properties (whatever prototype orbit-kick.js puts under it): 'all' draws everything, 'worlds' only
  // what is the twelve's, 'sphere' everything else
  function wrap() {
    const canvas = doc().getElementById('genesis-sphere'), ctx = canvas?.getContext('2d');
    if (!ctx || wrapped === ctx) return;
    const up = (name) => Object.getPrototypeOf(ctx)[name];
    const lane = (v) => typeof v === 'string' && LANES.has(v.toLowerCase());
    const pass = (isLane) => {
      if (isLane && block === null && depth >= 1) block = depth;
      if (mode === 'all') return true;
      const world = isLane || block !== null;
      return mode === 'worlds' ? world : !world;
    };
    const def = (name, value) => Object.defineProperty(ctx, name, {configurable: true, writable: true, value});
    def('save', function (...a) { depth++; return up('save').apply(this, a); });
    def('restore', function (...a) { depth = Math.max(0, depth - 1); if (block !== null && depth < block) block = null; return up('restore').apply(this, a); });
    def('clearRect', function (...a) { if (depth === 0) block = null; return up('clearRect').apply(this, a); });
    for (const name of ['fill', 'fillRect', 'fillText']) def(name, function (...a) { return pass(lane(this.fillStyle)) ? up(name).apply(this, a) : undefined; });
    for (const name of ['stroke', 'strokeRect', 'strokeText']) def(name, function (...a) { return pass(lane(this.strokeStyle)) ? up(name).apply(this, a) : undefined; });
    def('drawImage', function (...a) { return pass(false) ? up('drawImage').apply(this, a) : undefined; });
    wrapped = ctx;
  }
  const styleIn = (d, id) => { let s = d.getElementById(id); if (!s) { s = d.createElement('style'); s.id = id; d.head.append(s); } return s; };
  const rect = (el) => { const r = el.getBoundingClientRect(); return [r.left, r.top, r.width, r.height].map((v) => Math.round(v * 10) / 10); };
  const union = (rs) => {
    const ok = rs.filter((r) => r[2] > 0 && r[3] > 0);
    if (!ok.length) return null;
    const x0 = Math.min(...ok.map((r) => r[0])), y0 = Math.min(...ok.map((r) => r[1])), x1 = Math.max(...ok.map((r) => r[0] + r[2])), y1 = Math.max(...ok.map((r) => r[1] + r[3]));
    return [x0, y0, x1 - x0, y1 - y0].map((v) => Math.round(v * 10) / 10);
  };
  // the frame's box in the window (0, 0 on the one page), so every box is in the window's px
  const offset = () => { if (own()) return [0, 0]; const f = [...document.querySelectorAll('iframe')].find((x) => { try { return x.contentWindow === win(); } catch { return false; } }); const r = f?.getBoundingClientRect(); return r ? [r.left, r.top] : [0, 0]; };
  const inWindow = (r) => { if (!r) return r; const [ox, oy] = offset(); return [r[0] + ox, r[1] + oy, r[2], r[3]].map((v) => Math.round(v * 10) / 10); };
  // the lab's panel, wherever it stands, is never in a picture
  const PANEL = '.ab,.ab-toggle,[data-lab-panel]';
  const panelOff = () => { for (const d of new Set([document, doc()])) styleIn(d, 'bd-panel').textContent = `${PANEL}{visibility:hidden!important}`; };
  // the private rule, asserted before every picture: every <video> of the wall's offer and choice hidden
  const privateCheck = () => {
    const d = doc(), w = win();
    styleIn(d, 'bd-private').textContent = privateCss;
    const vids = [...d.querySelectorAll('#dl-paywall video, #dl-paywall-choice video, video[data-bd-probe]')];
    for (const v of vids) { try { v.pause(); v.muted = true; } catch {} }
    const shown = vids.filter((v) => { const r = v.getBoundingClientRect(); return w.getComputedStyle(v).display !== 'none' || r.width > 0 || r.height > 0; });
    return {videos: vids.length, shown: shown.length};
  };
  let groups = null, order = null;
  return {
    // where this page holds the hero: its own document (the one page) or a frame's; its film up, then the layers within `wait` ms
    async whereHero(timeout = 60000, wait = 10000) {
      const t0 = performance.now(), here = location.href;
      if (document.documentElement.hasAttribute('data-lock')) return {hero: false, layers: false, own: false, locked: true, href: here, why: 'the door answered with its lock'};
      while (!(film()?.readyState >= 2 && win()?.genesisSphere)) { if (performance.now() - t0 > timeout) return {hero: false, layers: false, own: false, href: here, why: 'no hero film here'}; await sleep(200); }
      const t1 = performance.now();
      while (!layersHere(doc())) { if (performance.now() - t1 > wait) return {hero: true, layers: false, own: own(), href: here, why: `no layer ${Math.round(wait / 1000)} s after the film`}; await sleep(200); }
      return {hero: true, layers: true, own: own(), href: here, why: own() ? 'the layers in its own document' : 'the layers in its frame'};
    },
    async ready(timeout = 120000) {
      const t0 = performance.now();
      // the film and the sphere, then (15 s at most: a page may hold none) the layers, and the box's models if the page says
      const hero = () => { const w = win(), f = film(); return Boolean(doc() && f && f.readyState >= 3 && w.genesisSphere); };
      const models = () => {
        const h = handle();
        if (h && 'unbox' in h && !h.unbox) return false;   // the page says a box is coming: it comes a few seconds after the stage
        const s = h?.unbox?.state;
        return !s || (!/^loading/.test(s.cloth?.at ?? '') && !/^loading/.test(s.seiya?.at ?? '') && (!s.held || s.held.error || s.held.done >= s.held.want));
      };
      while (!hero()) { if (performance.now() - t0 > timeout) throw new Error('the hero did not come up'); await sleep(250); }
      const t1 = performance.now();
      while (!(layersHere(doc()) && models()) && performance.now() - t1 < 15000 && performance.now() - t0 < timeout) await sleep(250);
      const d = doc(), w = win();
      if (document.documentElement.hasAttribute('data-lock')) throw new Error('the door answered with its lock');
      panelOff();
      const stage = d.getElementById('sphere-stage'), r = stage.getBoundingClientRect();
      w.scrollBy(0, Math.round(r.top + r.height / 2 - w.innerHeight / 2));
      wrap();
      privateCheck();
      await frames(3);
      return {stage: inWindow(rect(stage)), viewport: [innerWidth, innerHeight], ms: Math.round(performance.now() - t0), own: own(), handle: Boolean(handle()), layers: layersHere(d)};
    },
    // a <video> in the wall (THE CHOICE, which is the wall since a46521bc) and in the offer if it stands, as his hackathon videos will stand
    // there (no source: nothing is asked for)
    probe() {
      const d = doc(), walls = ['dl-paywall-choice', 'dl-paywall'].map((id) => d.getElementById(id)).filter(Boolean);
      for (const wall of walls) {
        if (wall.querySelector('video[data-bd-probe]')) continue;
        const v = d.createElement('video'); v.dataset.bdProbe = 'submission/demo.mp4'; v.muted = true; v.width = 320; v.height = 180;
        wall.append(v);
      }
      return walls.length;
    },
    // the film played in to t (from t - lead), paused by the page's own pause, sought to t exactly and settled
    async seek(t, lead = 1.2) {
      const d = doc(), f = film(), pause = d.querySelector('[data-twelve-pause]');
      const paused = () => pause?.getAttribute('aria-pressed') === 'true';
      const seekTo = async (s) => { if (Math.abs(f.currentTime - s) < 0.004) return; f.currentTime = s; await new Promise((r) => { const done = () => r(); f.addEventListener('seeked', done, {once: true}); setTimeout(done, 8000); }); };
      wrap();
      if (paused()) pause.click();
      const from = Math.max(0, t - lead);
      if (t - from > 0.05) {
        await seekTo(from);
        if (f.paused) { try { await f.play(); } catch {} }
        const t0 = performance.now();
        while (f.currentTime < t - 0.04 && !f.paused && performance.now() - t0 < (lead + 4) * 1000) await sleep(25);
      }
      if (pause && !paused()) pause.click();
      else f.pause();
      await sleep(60);
      await seekTo(t);
      await frames(4);
      // the docking pieces (THE CHOICE, the offer), the bubble: until none of the stage's own finite animations runs, 6 s at most (the page's
      // endless ones, elsewhere, never end)
      const t1 = performance.now(), stage = d.getElementById('sphere-stage');
      const moving = () => stage.getAnimations({subtree: true}).some((a) => a.playState === 'running' && Number.isFinite(a.effect?.getComputedTiming?.().endTime));
      while (performance.now() - t1 < 6000 && moving()) await sleep(100);
      const h = handle();
      try { h?.theater?.ask?.(); h?.unbox?.ask?.(); h?.inversion?.redraw?.(); } catch {}
      win().genesisSphere?.redraw?.();
      await frames(4); await sleep(350);
      let box = null;
      try { box = h?.state?.().box?.out ?? null; } catch {}
      return {t: f.currentTime, paused: f.paused, box, paywall: win().dlTwelve?.state?.().paywall?.state ?? null};
    },
    // what each pass is made of at this second, and the page's stacking: z-index, positioned or not, the document's order
    snapshot() {
      const d = doc(), w = win(), all = [...d.querySelectorAll('*')], index = new Map(all.map((el, i) => [el, i]));
      const visible = new Set(all.filter((el) => w.getComputedStyle(el).visibility === 'visible'));
      const stage = d.getElementById('sphere-stage');
      const under = (el) => [el, ...el.querySelectorAll('*')];
      const ancestors = []; for (let el = stage; el; el = el.parentElement) ancestors.push(el);
      const atmosphere = [...d.querySelectorAll('.atmosphere')].flatMap(under);
      const layerEls = new Set();
      groups = {};
      for (const p of passes) {
        if (p.id === 'film' || p.id === 'paper' || p.id === 'dom' || p.id === 'composite') continue;
        const els = find(p.id);
        for (const el of els) for (const e of under(el)) layerEls.add(e);
        groups[p.id] = {roots: els, marks: els.flatMap(under).filter((e) => visible.has(e))};
      }
      groups.paper = {roots: ancestors, marks: [...ancestors, ...atmosphere].filter((e) => visible.has(e))};
      const paperSet = new Set(groups.paper.marks);
      const media = (e) => e.tagName === 'VIDEO' || e.tagName === 'AUDIO' || e.tagName === 'SOURCE' || e.tagName === 'TRACK';
      const dom = all.filter((e) => visible.has(e) && !paperSet.has(e) && !ancestors.includes(e) && !layerEls.has(e) && !media(e) && !e.closest('video,audio') &&
        !e.closest(PANEL) && !e.closest('head') && e.tagName !== 'HEAD' && e.tagName !== 'STYLE' && e.tagName !== 'SCRIPT');
      groups.dom = {roots: dom, marks: dom};
      // the stacking: [z-index, positioned, the document's order] of each pass's first element; paper under all, the film's plate under it
      const key = (el) => { const cs = w.getComputedStyle(el), z = cs.zIndex === 'auto' ? 0 : Number(cs.zIndex) || 0; return [z, cs.position === 'static' ? 0 : 1, index.get(el) ?? 0]; };
      const cmp = (A, B) => A[0] - B[0] || A[1] - B[1] || A[2] - B[2];
      const keys = {film: [-Infinity, 0, 0], paper: [-1e9, 0, 0]};
      for (const [id, g] of Object.entries(groups)) {
        if (id === 'paper') continue;
        if (id === 'dom') { keys.dom = g.marks.filter((e) => e.getBoundingClientRect().width > 0).map(key).sort(cmp).at(-1) ?? [1e9, 1, 0]; continue; }
        keys[id] = g.roots[0] ? key(g.roots[0]) : null;
      }
      if (keys.worlds) keys.worlds = [keys.worlds[0], keys.worlds[1], keys.worlds[2] + 0.5];   // on the sphere's own canvas, after its skin
      order = passes.map((p) => p.id).filter((id) => id !== 'composite' && keys[id]).sort((a, b) => cmp(keys[a], keys[b]));
      const vp = [0, 0, innerWidth, innerHeight];
      const clip = (r) => { const x0 = Math.max(0, r[0]), y0 = Math.max(0, r[1]), x1 = Math.min(vp[2], r[0] + r[2]), y1 = Math.min(vp[3], r[1] + r[3]); return [x0, y0, x1 - x0, y1 - y0]; };
      const boxes = {paper: vp, dom: union(dom.map((e) => clip(inWindow(rect(e)))))};
      for (const [id, g] of Object.entries(groups)) if (!(id in boxes)) boxes[id] = inWindow(union(g.roots.map(rect)));
      const st = inWindow(rect(stage));
      const FA = crop[2] / crop[3], hd = Math.min(1, (st[2] / st[3]) / FA) * fit, fh = hd * st[3], fw = fh * FA;
      boxes.film = [st[0] + (st[2] - fw) / 2, st[1] + (st[3] - fh) / 2, fw, fh].map((v) => Math.round(v * 10) / 10);
      const present = Object.fromEntries(Object.entries(groups).map(([id, g]) => [id, {elements: g.roots.length, shown: g.marks.length, by: id === 'paper' || id === 'dom' ? null : g.roots.map((e) => (e.id ? `#${e.id}` : e.tagName.toLowerCase()))}]));
      return {order, boxes, present, stage: st, own: own(), keys: Object.fromEntries(Object.entries(keys).map(([k, v]) => [k, v && v.map((x) => (Number.isFinite(x) ? x : String(x)))]))};
    },
    privateCheck,
    // one pass on: every other layer hidden, the paper hidden but for 'paper', the sphere's context filtered for 'sphere' and 'worlds'
    async apply(id) {
      const d = doc();
      for (const el of marked) el.removeAttribute('data-bd-on');
      marked = [];
      const inner = styleIn(d, 'bd-pass'), top = own() ? null : styleIn(document, 'bd-pass-top');
      if (id === 'composite') { inner.textContent = ''; if (top) top.textContent = ''; }
      else {
        for (const el of groups[id]?.marks ?? []) { el.setAttribute('data-bd-on', ''); marked.push(el); }
        if (top) top.textContent = id === 'paper' ? '' : 'html,body{background:transparent!important}';
        inner.textContent = '*{visibility:hidden!important}[data-bd-on]{visibility:visible!important}' + (id === 'paper' ? '' : 'html,body{background:transparent!important}');
      }
      const want = id === 'sphere' ? 'sphere' : id === 'worlds' ? 'worlds' : 'all';
      if (want !== mode) { mode = want; depth = 0; block = null; win().genesisSphere.redraw(); await frames(3); }
      await frames(2);
      return privateCheck();
    },
    // the film's frame at this second: the 1986 picture inside the file, as a PNG
    filmFrame() {
      const f = film(), c = document.createElement('canvas');
      c.width = crop[2]; c.height = crop[3];
      c.getContext('2d').drawImage(f, crop[0], crop[1], crop[2], crop[3], 0, 0, crop[2], crop[3]);
      return {png: c.toDataURL('image/png').split(',')[1], t: f.currentTime};
    },
  };
}

// ------------------------------------------------------------------------------------------------------------------------------------------
const CHROMES = ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing',
  path.join(os.homedir(), 'Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing')];
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** Chrome, headless and muted, off every screen, on its own new profile; end() ends it and removes its profile. */
export async function launch(chrome, [W, H]) {
  const dir = fs.mkdtempSync(path.join(process.env.TMPDIR || os.tmpdir(), 'breakdown-chrome-'));
  const child = spawn(chrome, ['--headless=new', '--mute-audio', '--remote-debugging-port=0', `--user-data-dir=${dir}`, `--window-size=${W},${H}`, '--hide-scrollbars',
    '--no-first-run', '--no-default-browser-check', '--disable-background-networking', '--disable-component-update', '--disable-sync', '--disable-extensions',
    '--disable-default-apps', '--disable-features=Translate,MediaRouter,OptimizationHints', '--disable-background-timer-throttling', '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows', '--force-color-profile=srgb', '--autoplay-policy=no-user-gesture-required', 'about:blank'], {stdio: 'ignore'});
  let ws = null;
  const end = async () => {
    try { ws?.close(); } catch {}
    try { child.kill('SIGTERM'); } catch {}
    for (let i = 0; i < 30 && child.exitCode === null && child.signalCode === null; i++) await sleep(100);
    if (child.exitCode === null && child.signalCode === null) { try { child.kill('SIGKILL'); } catch {} await sleep(200); }
    try { fs.rmSync(dir, {recursive: true, force: true}); } catch {}
  };
  let port = null;
  for (let i = 0; i < 400 && !port; i++) {
    await sleep(150);
    if (child.exitCode !== null) { await end(); throw new Error(`Chrome ended at once (exit ${child.exitCode})`); }
    try { port = Number(fs.readFileSync(path.join(dir, 'DevToolsActivePort'), 'utf8').split('\n')[0]) || null; } catch {}
  }
  if (!port) { await end(); throw new Error('Chrome did not open its debugging port in 60 s'); }
  const ver = await fetch(`http://127.0.0.1:${port}/json/version`).then((r) => r.json());
  ws = new WebSocket(ver.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = () => j(new Error('no debugging socket')); });
  return {ws, end, pid: child.pid, browser: ver.Browser};
}

/** One page target over the socket: send(method, params), ev(expression), on(event, fn), and the requests in flight (media aside). */
export async function pageOf(ws, [W, H]) {
  let id = 0, session;
  const wait = new Map(), handlers = new Map(), flight = new Map();
  const send = (method, params = {}, sessionId = session) => new Promise((resolve, reject) => { const n = ++id; wait.set(n, {resolve, reject, method}); ws.send(JSON.stringify({id: n, method, params, sessionId})); });
  ws.onmessage = (m) => {
    const x = JSON.parse(m.data);
    if (x.id && wait.has(x.id)) { const w = wait.get(x.id); wait.delete(x.id); return x.error ? w.reject(new Error(`${w.method}: ${x.error.message}`)) : w.resolve(x.result); }
    const p = x.params;
    if (x.method === 'Network.requestWillBeSent' && p.type !== 'Media') flight.set(p.requestId, Date.now());
    if (x.method === 'Network.loadingFinished' || x.method === 'Network.loadingFailed') flight.delete(p.requestId);
    for (const fn of handlers.get(x.method) ?? []) fn(p, x.sessionId);
  };
  const t = await send('Target.createTarget', {url: 'about:blank', newWindow: true, width: W, height: H});
  session = (await send('Target.attachToTarget', {targetId: t.targetId, flatten: true})).sessionId;
  const on = (method, fn) => { if (!handlers.has(method)) handlers.set(method, []); handlers.get(method).push(fn); };
  const ev = async (expression) => {
    const r = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true});
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result?.value;
  };
  // the network quiet for `ms` (requests older than 20 s, a stream's, do not count), `max` ms at most
  const quiet = async (ms = 1500, max = 30000) => {
    const t0 = Date.now(); let still = Date.now();
    while (Date.now() - t0 < max) {
      const now = Date.now(), busy = [...flight.values()].some((at) => now - at < 20000);
      if (busy) still = now; else if (now - still >= ms) return true;
      await sleep(100);
    }
    return false;
  };
  return {send, ev, on, quiet};
}

async function main() {
  const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const ORIGIN_ = opt('--origin', ORIGIN).replace(/\/$/, ''), URL_ARG = opt('--url', 'auto');
  const OUTDIR = path.resolve(opt('--out', OUT)), [W, H] = opt('--size', '1440x900').split('x').map(Number);
  const MODE = opt('--views', 'auto'), LEAD = Number(opt('--lead', '1.2')), LIMIT = Number(opt('--limit', '1500')), PROBE = args.includes('--probe-private');
  const only = opt('--only', null)?.split(',').map((s) => s.trim()).filter(Boolean) ?? null;
  const CHROME = opt('--chrome', CHROMES.find((c) => fs.existsSync(c)));
  const wrong = problems(SCENES);
  if (wrong.length) throw new Error(`scenes.mjs: ${wrong.join('; ')}`);
  if (!CHROME) throw new Error('no Chrome here');
  const scenes = only ? SCENES.filter((s) => only.includes(s.id)) : SCENES;
  if (only && scenes.length !== only.length) throw new Error(`no scene ${only.filter((id) => !SCENES.some((s) => s.id === id)).join(', ')} in scenes.mjs`);
  fs.mkdirSync(OUTDIR, {recursive: true});
  const manifestPath = path.join(OUTDIR, 'manifest.json');
  let old = null;
  try { old = JSON.parse(fs.readFileSync(manifestPath, 'utf8')); } catch {}
  const manifest = {schema: 'breakdown/1', captured: new Date().toISOString(), url: null, asked: URL_ARG, page: null, views: null, viewport: [W, H], dpr: 1,
    passes: PASSES.map(({id, name, file, how}) => ({id, name, file, how})), stack: STACK, host: os.hostname(), loadavg: os.loadavg().map((v) => Math.round(v)),
    refused: [], errors: [], skipped: [], private: {rule: PRIVATE_CSS, probe: PROBE, checks: 0, videos: 0, shown: 0}, scenes: {}};
  // a run of some scenes keeps the others the last run took
  if (only && old?.schema === manifest.schema) for (const [id, s] of Object.entries(old.scenes ?? {})) if (!only.includes(id) && SCENES.some((x) => x.id === id)) manifest.scenes[id] = s;
  const write = () => fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 1));

  const t0 = Date.now();
  const chrome = await launch(CHROME, [W, H]);
  const bound = setTimeout(() => { console.error(`the capture passed its ${LIMIT} s: ended`); chrome.end().then(() => process.exit(2)); }, LIMIT * 1000);
  const stop = () => { clearTimeout(bound); return chrome.end(); };
  process.on('SIGINT', () => stop().then(() => process.exit(3)));
  process.on('SIGTERM', () => stop().then(() => process.exit(3)));
  manifest.browser = chrome.browser;
  console.log(`chrome ${chrome.browser} pid ${chrome.pid}; ${scenes.length} scenes`);
  try {
    const page = await pageOf(chrome.ws, [W, H]);
    let origin = ORIGIN_;
    page.on('Fetch.requestPaused', (p, sid) => {
      const ok = allowed(p.request.url, origin, p.request.method);
      if (!ok && manifest.refused.length < 200) manifest.refused.push(`${p.request.method} ${p.request.url.slice(0, 160)}`);
      page.send(ok ? 'Fetch.continueRequest' : 'Fetch.failRequest', ok ? {requestId: p.requestId} : {requestId: p.requestId, errorReason: 'BlockedByClient'}, sid).catch(() => {});
    });
    page.on('Runtime.exceptionThrown', (p) => manifest.errors.push(String(p?.exceptionDetails?.exception?.description || p?.exceptionDetails?.text).slice(0, 300)));
    for (const m of ['Page.enable', 'Runtime.enable', 'Network.enable']) await page.send(m);
    await page.send('Fetch.enable', {patterns: [{urlPattern: '*', requestStage: 'Request'}]});
    await page.send('Emulation.setDeviceMetricsOverride', {width: W, height: H, deviceScaleFactor: 1, mobile: false});
    await page.send('Emulation.setFocusEmulationEnabled', {enabled: true});
    await page.send('Emulation.setDefaultBackgroundColorOverride', {color: {r: 0, g: 0, b: 0, a: 0}});
    const helper = `window.__bd = (${pageHelper.toString()})(${JSON.stringify(PASSES)}, ${JSON.stringify(LANES)}, ${JSON.stringify(PRIVATE_CSS)}, ${JSON.stringify(CROP)}, ${THEATER_FIT}); 'ok'`;
    // a page opened and followed wherever it goes (THE BRIDGE replaces app/warm.html with the lab's page on his door), then the helper in it
    const open = async (url) => {
      await page.ev(`window.__bdLeft = true`).catch(() => {});
      await page.send('Page.navigate', {url});
      let last = '', same = 0;
      for (let i = 0; i < 300 && same < 3; i++) {
        await sleep(150);
        const at = await page.ev(`!window.__bdLeft && document.readyState === 'complete' ? location.href : ''`).catch(() => '');
        same = at && at === last ? same + 1 : 0; last = at;
      }
      await page.ev(helper);
      const locked = await page.ev(`document.documentElement.hasAttribute('data-lock')`).catch(() => false);
      if (locked) throw new Error(`${new URL(url).origin} answered with the house's lock (DysonLight · Harmony): nothing was asked of it; unlock the door, or capture a served tree (--origin)`);
      return last;
    };
    // WHICH PAGE: the one page when its own document holds the layers, else the lab's page over it
    let url = URL_ARG;
    if (URL_ARG === 'auto') {
      const one = ORIGIN_ + PAGES.one;
      await open(one);
      const seen = await page.ev(`window.__bd.whereHero()`);
      url = seen.layers ? seen.href : ORIGIN_ + PAGES.framed;
      manifest.picked = {tried: one, ...seen, url};
      console.log(`--url auto: ${url} (${seen.href === one ? 'app/warm.html' : `app/warm.html went on to ${seen.href}`}: ${seen.why})`);
    }
    origin = new URL(url).origin;
    const views = viewsOf(url);
    Object.assign(manifest, {url, views: {visitor: views.visitor, holder: views.holder, mode: MODE}});
    const groups = [['visitor', scenes.filter((s) => viewFor(s, MODE, views.given) === 'visitor')], ['holder', scenes.filter((s) => viewFor(s, MODE, views.given) === 'holder')]];
    for (const [view, list] of groups) {
      if (!list.length) continue;
      const at = view === 'visitor' ? views.visitor : views.holder;
      await open(at);
      const up = await page.ev(`window.__bd.ready()`);
      await sleep(3500); await page.quiet(1500, 30000);   // what the page builds in its idle time (the box's models and pictures), whether or not it says
      manifest.stage = up.stage;
      manifest.page = up.own ? 'app/warm.html: the layers in its own document' : 'lab/hero-ab.html: the layers in its frame (app/warm.html)';
      console.log(`${view}: the hero up in ${up.ms} ms (${up.own ? 'its own document' : 'through the frame'}${up.handle ? ', a handle offered' : ''}); stage ${up.stage.join(' ')}`);
      for (const scene of list) {
        const s0 = Date.now();
        if (PROBE) await page.ev(`window.__bd.probe()`);
        const got = await page.ev(`window.__bd.seek(${scene.t}, ${LEAD})`);
        if (Math.abs(got.t - scene.t) > 0.1) {
          const why = got.paywall === 'held' ? `the wall held the film at ${got.t.toFixed(3)} s (this page did not take ?paywall=off as a minter's view)` : `the film stood at ${got.t.toFixed(3)} s`;
          manifest.skipped.push({id: scene.id, t: scene.t, view, why});
          write();
          console.log(`${scene.id} at ${scene.t} s (${view}): not written: ${why}`);
          continue;
        }
        const snap = await page.ev(`window.__bd.snapshot()`);
        const dir = path.join(OUTDIR, scene.id);
        fs.rmSync(dir, {recursive: true, force: true});
        fs.mkdirSync(dir, {recursive: true});
        const shot = async () => Buffer.from((await page.send('Page.captureScreenshot', {format: 'png', captureBeyondViewport: false})).data, 'base64');
        const entry = {id: scene.id, t: scene.t, at: Math.round(got.t * 1000) / 1000, view, url: at, own: snap.own, paywall: got.paywall, boxOut: got.box, order: snap.order, stage: snap.stage, passes: []};
        const record = (id, file, buf, box, z) => {
          const {w, h, ink} = pngInk(buf);
          fs.writeFileSync(path.join(dir, file), buf);
          const p = PASSES.find((x) => x.id === id);
          entry.passes.push({id, name: p.name, file: p.file, png: `${scene.id}/${file}`, z, size: [w, h], box, ink, present: snap.present[id] ?? null, bytes: buf.length});
        };
        let leaked = false;
        const guard = (check) => { manifest.private.checks++; manifest.private.videos = Math.max(manifest.private.videos, check.videos); if (check.shown) { manifest.private.shown += check.shown; leaked = true; } };
        // the composite first, nothing hidden
        guard(await page.ev(`window.__bd.apply('composite')`));
        const composite = await shot();
        const film = await page.ev(`window.__bd.filmFrame()`);
        for (const id of snap.order) {
          if (id === 'film') { record('film', 'film.png', Buffer.from(film.png, 'base64'), snap.boxes.film, snap.order.indexOf('film')); continue; }
          guard(await page.ev(`window.__bd.apply(${JSON.stringify(id)})`));
          record(id, `${id}.png`, await shot(), snap.boxes[id] ?? null, snap.order.indexOf(id));
        }
        guard(await page.ev(`window.__bd.apply('composite')`));
        record('composite', 'composite.png', composite, [0, 0, W, H], null);
        if (leaked) { fs.rmSync(dir, {recursive: true, force: true}); manifest.errors.push(`${scene.id}: a video of the wall's offer showed: nothing written`); write(); continue; }
        entry.ms = Date.now() - s0;
        manifest.scenes[scene.id] = entry;
        write();
        console.log(`${scene.id} at ${entry.at} s (${view}): ${entry.passes.filter((p) => p.ink && p.id !== 'composite').map((p) => p.id).join(' ')} in ${(entry.ms / 1000).toFixed(1)} s`);
      }
    }
  } catch (error) {
    manifest.errors.push(String(error?.stack || error).slice(0, 600));
    console.error(String(error?.stack || error));
  } finally {
    manifest.took_s = Math.round((Date.now() - t0) / 100) / 10;
    write();
    await stop();
  }
  console.log(`wrote ${manifestPath} (${Object.keys(manifest.scenes).length} scenes, ${manifest.skipped.length} not written, ${manifest.refused.length} requests refused, ${manifest.errors.length} page errors; private: ${manifest.private.checks} checks, ${manifest.private.videos} videos seen at most, ${manifest.private.shown} shown) in ${manifest.took_s} s`);
  return manifest.private.shown || manifest.errors.some((e) => /did not come up|Chrome|debugging/.test(e)) ? 1 : 0;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().then((code) => process.exit(code), (error) => { console.error(String(error?.stack || error)); process.exit(1); });
}

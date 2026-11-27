// sacrifice.js: THE SACRIFICE, the one who intercepts the hit cut out of the film, enhanced and shown large for one second, for the hero
// (hero-ab.html). His words, Oct 15 2026 00:27 WEST, over his page at about 10.8 s (the red dodecahedron, the shield closed, the swarm on it):
// "i need you to segment out and enhance the sacrifice here again of aiolos one second time: (the guy that savees the hit)"; his tag on the
// film at 10.835 s (mint/seiya-tags rev 1, cuts.js TAGS_AT_REV_1): "THIS MOMENT IS FUCKING CRITICAL DUDE!  THIS IS THE MOMENT OF SACRIFICE!!!!";
// Oct 14 13:0x WEST, over the hero paused at 12.7 s: "that exact moment where he intercepts the hit needs to be slowed down like fucking
// slow-mo dude"; and 13:4x, having heard a slow-mo of the film and its song: "it is awful dude. you cant slow down the audio it morphs like
// shit... but the animation is epic.. cant you just keep the animation ongoing for longer? natural speed... longer duration of the animation
// more fluid..." (that slow-mo was taken out: hero-ab.html THE SLOW-MO, commit c51dbd1a built it).
//
// THE READING. The film and its song keep their own speed, always (THE SOUND NEVER RESTARTS THE PICTURE, dl-twelve-clock.js). The one who
// intercepts is cut out of the film's own frames (segmented), enhanced, and stands on the page as his own figure for ONE SECOND, his frames
// spread over that second in their order, fluid, while the film runs on underneath. On film the sacrifice lasts 0.4 s (frames 319 to 330,
// 10.644 to 11.011 s); on the page it lasts one second.
//
// THE FRAMES (saint-seiya.mp4 ?v=53561d47, 960 x 540, 30000/1001 fps): the blast's streaks come from the left; Seiya crouches at the centre;
// the one who intercepts flies in from the left over frames 316 to 318 (10.544 to 10.611 s: a motion-blurred streak tangled with Seiya and
// the purple cliff, no figure of him alone is in those frames); from frame 319 (10.644 s) he stands in front of Seiya with his arms spread,
// ONE HELD CEL to frame 330 (11.011 s): the same drawing in every frame, only the blast's light on him changes (the strike's white flash on
// 324 to 326, his tag's frame 325 among them); frame 331 (11.044 s) cuts to the close-up of the hit landing on his armour, the hero's first
// burst (hero-ab.html BURSTS[0]).
//
// THE MATTE (tools/film-matte.swift; its header says what Vision gave frame by frame): Apple Vision's foreground instance mask of the held cel,
// the union of its clean frames (327, 328, 330), the holes inside the figure filled: one matte for the twelve frames, shipped as
// lab/sacrifice-masks.png (360 x 321, white with the matte as its alpha, 18 kB; no film pixel in it). The page composites the figure from its
// own film; nothing of the film is in git.
//
// THE TIMING (his words, Oct 15 2026 02:1x WEST, over the page at about 11 s: "are you sure it is well timed? cant you upscale it? it is
// super blurry dude"). The first cut (aacc1aa2) stretched the twelve cels over the second, each held a twelfth: the figure trailed the film
// and stood 0.6 s into the next shot. Now THE FIGURE IS LOCKED TO THE FILM, at its natural speed, a pure function of the film's frame
// (sacrificeAt, frameAt): on each film frame 319 to 330 the cel shown is that very frame, cut out of it as the film presents it
// (requestVideoFrameCallback's frame: no slow replay, never behind the film); at the cut to the hit (frame 331, 11.044 s) cel 330 holds over
// the theater's burst to frame 348 (its end, 11.645 s: 30 film frames from 319, the second), and on frame 349 he is gone. He comes in over the
// first 0.1 s (three frames: 319 at a quarter, 320 at three quarters) and goes over the last 0.1 s (347 at three quarters, 348 at a quarter).
// He stands large over the stage at the sphere's centre-right (SACRIFICE.height sphere radii tall, his centre SACRIFICE.at radii from the
// sphere's), the hero of that second: over the theater's burst and the shield's shatter, under the page's controls and the sound bubble.
// The film, the song, the faces, the burst and the shield are untouched. prefers-reduced-motion: one still cut-out, his tag's frame, whole,
// drawn once it is there and held for the second (no fade).
//
// WHAT IT DRAWS. Each cut-out is prepared ONCE, from the frame the film presents (requestVideoFrameCallback's frame, as dl-twelve.js and
// unboxing.js take theirs), on that frame, at twice the film's pixels (the zoom): the matte's box of the frame drawn 2x with the enhancement (an unsharp
// mask, contrast 1.15 and saturation 1.1: an SVG filter the mount puts in the page, which Chrome and Firefox take on a canvas; a browser
// without url() filters on a canvas gets the contrast and the saturation, one with no canvas filter the zoom alone), through the matte
// (destination-in), a gold rim light along his edges facing the blast (the society's lit gold #e5c782: the silhouette less itself shifted
// 7 px right and 6 down, on him), and a soft gold glow under him (#d4a34a: the silhouette blurred 14 px and 4 px). The rim and the glow come
// from the matte alone, made once as the second comes near. Paused or sought onto a frame of 319 to 330, the film shows that frame: its
// cel is cut from the film itself. Paused or sought into the hold (331 to 348) with cel 330 never presented, a hidden helper film (unboxing.js
// THE KNIGHTS IN THE FRAMES) seeks once to frame 330, the cel is cut from it, and the helper is let go. A cel the film dropped while playing
// is never stood in for in 319 to 330 (the next presented frame brings its own); in the hold the last cel presented holds.
//
// THE COST. Nothing at rest: outside the second no canvas pixels (0 x 0), no timer, no requestAnimationFrame of its own, no frame callback
// waiting; the film's timeupdate (about four a second while it plays) answered with a comparison, and while the film plays it never draws
// (the frame callback is the clock). From a second before it the film's frame callback runs, one comparison a frame until 319 comes; inside
// it each presented frame of 319 to 330 prepares its own cut-out (one filtered drawImage of 360 x 321 film pixels at 2x and three composites,
// on the GPU; stats.prepMs) and draws it: a clear and one drawImage, 1:1, onto a canvas of the cut-out's size scaled by CSS to the figure's
// (stats.drawMs); the hold draws cel 330 once and again only as it fades (347, 348). The cut-outs are 800 x 722 each (2.3 MB of canvas
// memory a cel, 28 MB for the twelve) and are released with the rim and the glow on frame 349. sacrificeAt: about a microsecond a call
// (sacrifice.test.mjs measures it). SACRIFICE.md holds the numbers measured on the hero.
//
//   import {mountSacrifice} from './sacrifice.js';
//   const sacrifice = mountSacrifice({stage, film});   // the hero's #sphere-stage and #dl-twelve-film
//   sacrifice.at(t) -> the figure at second t; sacrifice.stats; sacrifice.element (its canvas, which holds the handle as .sacrifice); sacrifice.destroy()
// The sphere is the page's own (its window's genesisSphere, warm-sphere.js: getViewState().radius, its centre 55 % across and halfway down its
// canvas). The canvas goes in right after the stage's last canvas (the raid's), with no z-index of its own: over the drawings, under the
// page's controls. The plan is pure and tested without a browser (sacrifice.test.mjs).

import {SPHERE_X} from '../app/sphere-centre.mjs';
export const FPS = 30000 / 1001;
export const frameTime = (n) => n / FPS;
/** The film's frame on screen at second t: the frame whose time is at or before it (a mediaTime written a microsecond short is still its
 *  frame: Chrome keeps media times in whole microseconds). */
export const frameAt = (t) => Math.floor(t * FPS + 1e-3);
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };

export const SACRIFICE = Object.freeze({
  first: 319, last: 330,            // the held cel: he stands with his arms spread, frame 319 (10.644 s) to 330 (11.011 s)
  tag: 325,                         // his tag's frame (10.835 s): the still under reduced motion
  film: Object.freeze([960, 540]),  // the film's pixels
  box: Object.freeze([490, 215, 360, 321]),   // the matte's box in the film's pixels (film-matte.swift: [494,219 352x313], padded by 4)
  masks: 'sacrifice-masks.png',     // the matte: white, the matte as its alpha, the box's size
  second: 1,                        // seconds he stands on the page from frame 319: 30 film frames, 319 to 348
  in: 0.1, out: 0.1,                // seconds: he comes in over the first three frames, he goes over the last three
  height: 2.4,                      // his height in sphere radii
  at: Object.freeze([0.35, 0.1]),   // his centre from the sphere's, in radii: right, down
  zoom: 2,                          // the cut-outs at twice the film's pixels
  margin: 40,                       // 2x pixels round the cut-out, for the glow
  sphere: 0.2,                      // the sphere's radius as a share of the stage's shorter side when the page gives none (warm-sphere.js's view)
  gold: Object.freeze({glow: '#d4a34a', rim: '#e5c782'}),   // the society's gold and its lit gold
  rim: Object.freeze({dx: 7, dy: 6, alpha: 0.85}),          // the rim light: the silhouette less itself shifted away from the blast (2x px), on him
  glow: Object.freeze([[14, 0.7], [4, 0.45]]),               // the glow under him: [blur in 2x px, alpha], twice
  enhance: Object.freeze({sharpen: 0.7, blur: 1.5, contrast: 1.15, saturate: 1.1}),   // the unsharp mask (its strength, its blur in 2x px) and after it
});
/** The cut-outs: one a frame of the held cel. */
export const COUNT = SACRIFICE.last - SACRIFICE.first + 1;
/** The first frame he is gone (349: 30 frames from 319), and the cut to the hit, where cel 330 begins to hold (331, 11.044 s). */
export const END = SACRIFICE.first + Math.round(SACRIFICE.second * FPS), CUT = SACRIFICE.last + 1;
/** The second's bounds in film seconds: frame 319's time (10.644 s) to frame 349's (11.645 s). */
export const FROM = frameTime(SACRIFICE.first), TO = frameTime(END);
/** A prepared cut-out's pixels: the matte's box at the zoom, with the margin round it. */
export const CELL = Object.freeze([SACRIFICE.box[2] * SACRIFICE.zoom + 2 * SACRIFICE.margin, SACRIFICE.box[3] * SACRIFICE.zoom + 2 * SACRIFICE.margin]);

const OFF = Object.freeze({on: false, film: null, frame: null, hold: false, alpha: 0, rect: null, figure: null, still: false});

/**
 * Where he stands on the stage: {rect, figure}, both [x, y, w, h] in the stage's CSS pixels. figure is the matte's box scaled to his
 * height (sac.height radii), his centre sac.at radii from the sphere's; rect is the cut-out's cell (the margin for the glow round it).
 * geometry: {centre: [x, y], radius} (the sphere's, in the stage's pixels).
 */
export function rectOf({centre, radius}, sac = SACRIFICE) {
  const h = sac.height * radius, k = h / sac.box[3], w = sac.box[2] * k, m = (sac.margin / sac.zoom) * k;
  const x = centre[0] + sac.at[0] * radius - w / 2, y = centre[1] + sac.at[1] * radius - h / 2;
  return {figure: [x, y, w, h], rect: [x - m, y - m, w + 2 * m, h + 2 * m]};
}

/**
 * The figure at the film's second t, locked to the film's frame there (frameAt): {on, film (the film's frame at t), frame (the cel shown:
 * the film's own frame from 319 to 330, cel 330 from 331 to 348; his tag's frame under reduced motion), hold (the film past the cel, on the
 * hit), alpha (in over the first sac.in s of frames, out over the last sac.out s; whole under reduced motion), rect and figure (where, given a
 * geometry), still}. Off before frame 319 and from frame 349. Pure.
 */
export function sacrificeAt(t, geometry = null, sac = SACRIFICE, {reduced = false} = {}) {
  if (!Number.isFinite(t)) return OFF;
  const n = frameAt(t), end = sac.first + Math.round(sac.second * FPS);
  if (n < sac.first || n >= end) return OFF;
  const fin = Math.max(1, Math.round(sac.in * FPS)), fout = Math.max(1, Math.round(sac.out * FPS));
  const alpha = reduced ? 1 : Math.min(ease((n - sac.first + 1) / fin), ease((end - n) / fout));
  const where = geometry ? rectOf(geometry, sac) : {rect: null, figure: null};
  return {on: true, film: n, frame: reduced ? sac.tag : Math.min(n, sac.last), hold: n > sac.last, alpha, ...where, still: reduced};
}

/** Whether second t is near enough to the second for the film's frame callback to be running: a second before frame 319 to a quarter after
 *  frame 349. */
export const near = (t, sac = SACRIFICE) => t >= frameTime(sac.first) - 1 && t < frameTime(sac.first + Math.round(sac.second * FPS)) + 0.25;

const SVG = 'http://www.w3.org/2000/svg';

/** Put the sacrifice on the hero's stage, driven by its film. Returns {at, stats, element, destroy}. */
export function mountSacrifice({stage, film, sphere = null, sphereCanvas = null, after = null, masks = null, sac = SACRIFICE, reduced} = {}) {
  const doc = stage.ownerDocument, view = doc.defaultView;
  const still = reduced ?? Boolean(view.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  if (view.getComputedStyle(stage).position === 'static') stage.style.position = 'relative';
  const canvases = [...stage.children].filter((el) => el.tagName === 'CANVAS');
  const page = sphereCanvas ?? stage.querySelector?.('#genesis-sphere') ?? canvases[0] ?? null;
  const handleOf = () => sphere ?? view.genesisSphere ?? null;
  const count = sac.last - sac.first + 1, videoFrames = typeof film.requestVideoFrameCallback === 'function';
  const [CW, CH] = [sac.box[2] * sac.zoom + 2 * sac.margin, sac.box[3] * sac.zoom + 2 * sac.margin], M = sac.margin, BW = sac.box[2] * sac.zoom, BH = sac.box[3] * sac.zoom;
  const layer = doc.createElement('canvas');
  layer.id = 'hero-sacrifice';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, {position: 'absolute', left: '0', top: '0', width: '0', height: '0', pointerEvents: 'none', visibility: 'hidden'});
  layer.width = 0; layer.height = 0;
  const anchor = after ?? canvases.at(-1) ?? null;
  if (anchor) anchor.after(layer); else stage.append(layer);
  const idle = (f) => (view.requestIdleCallback ? view.requestIdleCallback(f, {timeout: 4000}) : view.setTimeout(f, 0));

  // THE MATTE, loaded once in the page's idle time
  let mask = null, maskState = 'none';
  const loadMask = () => {
    if (mask || maskState === 'loading' || typeof view.Image !== 'function') return;
    maskState = 'loading';
    const img = new view.Image();
    img.decoding = 'async';
    img.onload = () => { mask = img; maskState = 'ready'; if (shown) { makeOnce(); if (film.paused) settle(film.currentTime, true); } };
    img.onerror = () => { maskState = 'error'; };
    img.src = new URL(masks ?? sac.masks, import.meta.url).href;
  };
  idle(loadMask);

  // THE RIM AND THE GLOW, from the matte alone, made once as the second comes near and let go after it
  const once = {ready: false, ms: null, filters: null};
  let glow = null, rim = null;
  const blank = () => { const c = doc.createElement('canvas'); c.width = CW; c.height = CH; return c; };
  const silhouette = (colour) => {
    const c = blank(), g = c.getContext('2d');
    g.fillStyle = colour; g.fillRect(M, M, BW, BH);
    g.globalCompositeOperation = 'destination-in'; g.drawImage(mask, M, M, BW, BH);
    g.globalCompositeOperation = 'source-over';
    return c;
  };
  const makeOnce = () => {
    if (once.ready || !mask) return;
    const t0 = view.performance.now();
    const sil = silhouette(sac.gold.glow);
    glow = blank();
    const g = glow.getContext('2d'), filters = typeof g.filter === 'string';
    once.filters = filters;
    for (const [blur, alpha] of sac.glow) {
      g.globalAlpha = alpha;
      if (filters) { g.filter = `blur(${blur}px)`; g.drawImage(sil, 0, 0); }
      else { const k = 1 + blur / 400; g.drawImage(sil, (CW - CW * k) / 2, (CH - CH * k) / 2, CW * k, CH * k); }   // no blur to be had: a halo a little larger than him
    }
    if (filters) g.filter = 'none';
    g.globalAlpha = 1;
    rim = silhouette(sac.gold.rim);
    const r = rim.getContext('2d');
    r.globalCompositeOperation = 'destination-out'; r.drawImage(sil, sac.rim.dx, sac.rim.dy);   // the silhouette less itself shifted: the edges facing the blast
    r.globalCompositeOperation = 'source-over';
    once.ready = true; once.ms = view.performance.now() - t0;
  };
  const letGo = () => {
    for (const c of [glow, rim]) if (c) { c.width = 0; c.height = 0; }
    glow = rim = null; once.ready = false;
    for (let k = 0; k < count; k++) if (cuts[k]) { cuts[k].width = 0; cuts[k].height = 0; }
    have.fill(false);
  };

  // THE ENHANCEMENT: the filter the context takes, decided once (the SVG filter put in the page for it)
  let enhance = null;
  const filterFor = (g) => {
    if (enhance !== null) return enhance;
    if (typeof g.filter !== 'string') return (enhance = '');
    const {sharpen, blur, contrast, saturate} = sac.enhance;
    if (typeof doc.createElementNS === 'function' && !doc.getElementById('hero-sacrifice-enhance')) {
      const svg = doc.createElementNS(SVG, 'svg');
      svg.setAttribute('width', '0'); svg.setAttribute('height', '0'); svg.setAttribute('aria-hidden', 'true');
      svg.style.position = 'absolute';
      const f = (c) => `<feFunc${c} type="linear" slope="${contrast}" intercept="${((1 - contrast) / 2).toFixed(4)}"/>`;
      svg.innerHTML = `<filter id="hero-sacrifice-enhance" color-interpolation-filters="sRGB" x="0" y="0" width="1" height="1">` +
        `<feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" result="soft"/>` +
        `<feComposite in="SourceGraphic" in2="soft" operator="arithmetic" k1="0" k2="${1 + sharpen}" k3="${-sharpen}" k4="0" result="sharp"/>` +
        `<feComponentTransfer in="sharp" result="contrast">${f('R')}${f('G')}${f('B')}</feComponentTransfer>` +
        `<feColorMatrix in="contrast" type="saturate" values="${saturate}"/></filter>`;
      stage.append(svg);
    }
    for (const f of ['url(#hero-sacrifice-enhance)', `contrast(${contrast}) saturate(${saturate})`]) {
      g.filter = 'none'; g.filter = f;
      if (g.filter !== 'none') { g.filter = 'none'; return (enhance = f); }
    }
    g.filter = 'none';
    return (enhance = '');
  };

  // THE CUT-OUTS, one a frame, each prepared once from the frame presented (the film's, or the helper's)
  const cuts = new Array(count).fill(null), have = new Array(count).fill(false);
  let prepared = 0, prepMs = 0, prepMax = 0;
  const prepare = (slot, source) => {
    if (!mask) return false;
    if (!once.ready) makeOnce();
    if (!once.ready) return false;
    const t0 = view.performance.now();
    const c = cuts[slot] ?? (cuts[slot] = doc.createElement('canvas'));
    if (c.width !== CW || c.height !== CH) { c.width = CW; c.height = CH; }
    const g = c.getContext('2d');
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
    g.clearRect(0, 0, CW, CH);
    if ('imageSmoothingQuality' in g) g.imageSmoothingQuality = 'high';
    const f = filterFor(g);
    if (f) g.filter = f;
    g.drawImage(source, sac.box[0], sac.box[1], sac.box[2], sac.box[3], M, M, BW, BH);   // the zoom, enhanced
    if (f) g.filter = 'none';
    g.globalCompositeOperation = 'destination-in'; g.drawImage(mask, M, M, BW, BH);          // through the matte
    g.globalCompositeOperation = 'source-atop'; g.globalAlpha = sac.rim.alpha; g.drawImage(rim, 0, 0);   // the rim light on him
    g.globalCompositeOperation = 'destination-over'; g.globalAlpha = 1; g.drawImage(glow, 0, 0);          // the glow under him
    g.globalCompositeOperation = 'source-over';
    have[slot] = true; prepared++;
    const ms = view.performance.now() - t0;
    prepMs += ms; prepMax = Math.max(prepMax, ms);
    return true;
  };
  /** the cel to draw for the plan s: its own; in the hold (or the still) the last one cut before it; in 319 to 330 never another (-1: none) */
  const celFor = (s) => {
    const slot = s.frame - sac.first;
    if (have[slot]) return slot;
    if (s.hold || s.still) for (let k = slot - 1; k >= 0; k--) if (have[k]) return k;
    return -1;
  };

  // THE HELPER: a hidden film for the one cel the film is not showing (the hold's 330, the still's 325), sought once, let go after
  let helper = null, helping = false, helperSeeks = 0, helperMs = 0, helperRuns = 0, cancel = 0;
  const releaseHelper = () => { if (helper) { try { helper.removeAttribute('src'); helper.load(); } catch {} helper = null; } };
  async function fetchCel(slot) {
    if (helping || !shown || !mask || have[slot]) return;
    helping = true; helperRuns++;
    const mine = ++cancel, t0 = view.performance.now();
    try {
      const v = helper ?? (helper = doc.createElement('video'));
      v.muted = true; v.preload = 'auto'; v.playsInline = true;
      const src = film.currentSrc || film.src;
      if (v.src !== src) v.src = src;
      if (v.readyState < 2) await new Promise((ok, no) => { v.addEventListener('loadeddata', ok, {once: true}); v.addEventListener('error', () => no(new Error('the helper film did not load')), {once: true}); });
      if (cancel === mine && shown && !have[slot]) {
        v.currentTime = (sac.first + slot + 0.5) / FPS;   // inside the frame
        await new Promise((ok) => v.addEventListener('seeked', ok, {once: true}));
        helperSeeks++;
        if (cancel === mine && shown && prepare(slot, v)) apply(film.currentTime, 'prepared');
      }
    } catch (error) { view.console?.warn?.('sacrifice: the helper film gave no frame', error); }
    finally { helping = false; helperMs += view.performance.now() - t0; releaseHelper(); }
  }

  // THE LAYER: the cut-out's pixels, scaled by CSS to where he stands; read and placed as the second comes in, and on a resize
  let ctx = null, geo = null, where = null, shown = false, lastKey = '', draws = 0, drawMs = 0, drawMax = 0, frames = 0, drawn = null, seen = null;
  const fit = () => {
    const l = stage.getBoundingClientRect(), s = page?.getBoundingClientRect?.() ?? l, sv = handleOf()?.getViewState?.();
    const r = Math.min(s.width, s.height) * (Number.isFinite(sv?.radius) && sv.radius > 0 ? sv.radius : sac.sphere);
    geo = {centre: [s.left - l.left + s.width * SPHERE_X, s.top - l.top + s.height * 0.5], radius: r, width: l.width, height: l.height};
    where = rectOf(geo, sac);
    const [x, y, w, h] = where.rect;
    Object.assign(layer.style, {left: `${x.toFixed(1)}px`, top: `${y.toFixed(1)}px`, width: `${w.toFixed(1)}px`, height: `${h.toFixed(1)}px`});
    if (layer.width !== CW || layer.height !== CH) { layer.width = CW; layer.height = CH; }
    ctx = layer.getContext('2d');
  };
  const empty = () => { if (layer.width || layer.height) { layer.width = 0; layer.height = 0; } ctx = null; };
  const draw = (s, cel) => {
    const t0 = view.performance.now(), g = ctx;
    g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1;
    g.clearRect(0, 0, CW, CH);
    if (cel < 0) { drawn = {film: s.film, frame: null, alpha: s.alpha}; return; }
    g.globalAlpha = s.alpha; g.drawImage(cuts[cel], 0, 0);
    g.globalAlpha = 1;
    draws++;
    const ms = view.performance.now() - t0;
    drawMs += ms; drawMax = Math.max(drawMax, ms);
    drawn = {film: s.film, frame: sac.first + cel, alpha: s.alpha};
  };
  const hide = () => { shown = false; lastKey = ''; layer.style.visibility = 'hidden'; empty(); cancel++; letGo(); releaseHelper(); };
  const apply = (t, why) => {
    const s = sacrificeAt(t, null, sac, {reduced: still});
    seen = s.film;
    if (!s.on) { if (shown) hide(); return s; }
    if (doc.hidden) return s;
    if (!shown) { shown = true; lastKey = ''; makeOnce(); fit(); layer.style.visibility = 'visible'; }
    const cel = celFor(s), key = `${cel}:${s.alpha.toFixed(3)}`;
    if (key === lastKey && why !== 'prepared') return s;
    lastKey = key;
    draw(s, cel);
    return s;
  };

  // THE CAUSES: the film's frames while near the second (the clock: each presented frame brings its own cel), its timeupdate (asks for the
  // frames near the second; draws only when no frame callback can), a seek, a pause; a resize while he is shown
  let waiting = null;
  const ask = () => { if (waiting === null && videoFrames) waiting = film.requestVideoFrameCallback(onFrame); };
  const stop = () => { if (waiting !== null) { film.cancelVideoFrameCallback?.(waiting); waiting = null; } };
  /** the cel the film shows at t is cut from the film itself, if it is not cut already (the film must show it: readyState 2 or more) */
  const cutFromFilm = (s) => s.on && !doc.hidden && s.film === s.frame && !have[s.frame - sac.first] && film.readyState >= 2 && prepare(s.frame - sac.first, film);
  function onFrame(now, meta) {
    waiting = null; frames++;
    const t = meta?.mediaTime ?? film.currentTime;
    apply(t, cutFromFilm(sacrificeAt(t, null, sac, {reduced: still})) ? 'prepared' : 'frame');
    if (!film.paused && near(film.currentTime, sac)) ask();
  }
  /** the film still on the frame at t (paused, sought, or with no frame callback to tell): its cel now, and the helper for a cel it is not showing */
  const settle = (t, helped) => {
    if (near(t, sac) && mask && !doc.hidden) makeOnce();
    const s = sacrificeAt(t, null, sac, {reduced: still});
    apply(t, cutFromFilm(s) ? 'prepared' : 'settle');
    if (helped && s.on && shown && !doc.hidden && !have[s.frame - sac.first]) fetchCel(s.frame - sac.first);
  };
  const onTime = () => {
    const t = film.currentTime;
    if (near(t, sac) && !once.ready && mask && !doc.hidden) makeOnce();
    if (film.paused) { stop(); apply(t, 'time'); return; }
    if (!videoFrames) { settle(t, false); return; }
    if (near(t, sac)) ask();   // playing: the frame callback draws; a timeupdate only asks for it, and hides what a jump left behind
    else { stop(); if (shown) hide(); }
  };
  const onPause = () => { stop(); settle(film.currentTime, true); };
  const onSeek = () => { lastKey = ''; if (film.paused || !videoFrames) settle(film.currentTime, film.paused); else onTime(); };
  const on = {play: onTime, playing: onTime, timeupdate: onTime, seeked: onSeek, pause: onPause, ended: onPause, emptied: onPause};
  for (const [type, fn] of Object.entries(on)) film.addEventListener(type, fn);
  const resized = typeof view.ResizeObserver === 'function' ? new view.ResizeObserver(() => { if (shown) { fit(); lastKey = ''; apply(film.currentTime, 'resize'); } }) : null;
  resized?.observe(stage);
  onTime();

  const handle = {
    at: (t) => sacrificeAt(t, geo, sac, {reduced: still}),
    get stats() {
      return {draws, frames, drawMs, drawMax, prepared, prepMs, prepMax, once: {...once}, helper: {runs: helperRuns, seeks: helperSeeks, ms: helperMs, on: Boolean(helper)},
        mask: maskState, enhance, shown, have: have.map(Number).join(''), waiting: waiting !== null, reduced: still, pixels: [layer.width, layer.height], where, drawn, film: seen};
    },
    element: layer,
    destroy() {
      stop(); cancel++;
      for (const [type, fn] of Object.entries(on)) film.removeEventListener(type, fn);
      resized?.disconnect();
      hide();
      layer.remove();
      doc.getElementById?.('hero-sacrifice-enhance')?.parentNode?.remove();
    },
  };
  layer.sacrifice = handle;   // for a reader: the page's line keeps no name for it
  return handle;
}

// ko-edge.js: THE KO EDGE, the hero's borders while Seiya is one hit from KO. His words, Oct 14 2026 15:3x WEST, over hero-ab.html at film
// 18.1 s: "see this exact moment when he is grabbed by the hair? can you do some radial thing like in call of duty when you are 1 hit away
// from KO like pulsating borders or some shit you get what i mean? like...".
//
// THE MOMENTS, read off app/saint-seiya.mp4 (30000/1001 fps) frame by frame, its cuts by ffmpeg's scene score (receipts in LANDING.md, "The KO
// edge"): frame 536 (17.884 s) Dolbar's claws come in at the top of the frame behind Seiya's head; frame 540 (18.018 s) the gauntlet closes in
// his hair: THE HIT, his 18.1 s; 18.118 to 18.418 s the yank; 19.052 s the cut to the two of them, Dolbar holding him up by the hair ("You are
// the last one!", "Athena! All your Knights are no more."); frame 886 (29.563 s) the cut to over Athena's shoulder, he is still held, off the
// frame ("With the last Knight I will have my fun", "Enjoy the show up there"); frame 1096 (36.570 s) the cut to the beam of gold light.
//
// WHAT IT DOES, Call of Duty's low-health screen on the hero's stage: at the hit the stage's borders flash red at once (a cut, never a fade:
// CUTS.md) and stay red; at the cut to Athena the red steps down to her view (0.55); at the beam's first frame it is gone: the light is the cure.
// Every change of level is at one of the film's own cuts or at the hit. It sits on no burst (hero-ab.html's BURSTS: 11.044 and 37.10 s, 5.2 s
// each), so the rule of one holds with the theater's glass.
// THE PULSE IS HIS BODY'S (his words, 16:0x WEST: "make sure to DCT align the red halo with the spasms of saint seya eh"; by "DCT aligned" he
// means aligned to what the source does, known in advance, Oct 12: "the oscillations here are not DCT aligned to the music tbh... like you know in
// advance how it is going to oscillate"): the red surges in from the borders on the very frame each new drawing of Seiya's body lands, by how
// much the picture changed in the DCT's own count (ko-spasms.js, measured off the film by tools/ko-spasms.mjs: the AC energy of the 8 x 8 DCT of
// each frame's change from the last), and falls back by e every 0.18 s until the next. So it throbs with the yank on fours (18.15 to 18.92 s),
// his jerks after the cut (19.15 to 19.42 s), the scream (21.82 to 22.49 s), his body dropping (22.56 to 23.19 s) and swaying (27.39 to 28.90 s),
// and holds still while Dolbar talks over him and while she watches: no beat of a seat's own.
//
// THE COST: two canvases of at most 360 px a side, painted once when the page is idle and stretched over the hero (the red is blurry by
// nature); in the window each film frame sets two opacities and one scale (the compositor's work: no layout, no paint); outside the window it
// only answers the film's timeupdate (about four a second while playing) with a comparison; at rest (the film paused) nothing at all: no frame
// callback is left waiting (in WebKit a waiting requestVideoFrameCallback costs 17 to 24 ms of CPU a second at rest, measured Oct 14 2026), no
// timer, no requestAnimationFrame. prefers-reduced-motion keeps the red and drops the surges and the flash. Its box is the window's width over
// the rows of the window the hero section holds, a fixed layer (the stage stops short of the window's sides, 1,205 of 1,440 px on the first
// proof, and the section clips at 1,354), fitted when the red comes in and on a scroll or a resize while it is in.
//
//   import {mountKoEdge} from './ko-edge.js';
//   const ko = mountKoEdge({stage, film});   // the hero's #sphere-stage and its #dl-twelve-film, in the page's own document
//   ko.at(t) -> the style drawn at second t; ko.stats; ko.destroy()
// The layer goes in right after the stage's last canvas (the sphere, the theater's glass, the box, its front), with no z-index of its own: the
// drawings are under the red and the page's controls stay over it, as a game's HUD stays over its damage screen. The plan is pure and tested
// without a browser (ko-edge.test.mjs): koAt(t) and styleAt(t) are functions of the film's second alone, edgeTexture(w, h, look) the red's pixels.
import {SPASMS} from './ko-spasms.js';

export const FPS = 30000 / 1001;

export const KO = Object.freeze({
  frames: Object.freeze({hit: 540, held: 886, healed: 1096}),   // the gauntlet closes; the cut to her; the cut to the beam
  view: 0.55,                                                    // the red's level in her view, from the cut to her to the beam
  flash: 0.22,                                                   // seconds: the hit's flash falls by e in this long
  fall: 0.18,                                                    // seconds: a spasm's surge falls by e in this long
});

/** The second a frame is shown at, and the line a moment begins on: half a frame before its own frame, so no frame's time sits on a line. */
export const frameTime = (n) => n / FPS;
const line = (n) => (n - 0.5) / FPS;
const frameAt = (t) => Math.floor(t * FPS + 0.5);   // the frame whose half-frame span holds t
const round3 = (v) => Math.round(v * 1000) / 1000;

/** A spasm's strength at each frame of the hold, 0..1: its DCT energy over the floor, full at `full`. */
export const STRENGTH = Object.freeze(SPASMS.energy.map((e) => Math.min(1, Math.max(0, (e - SPASMS.floor) / (SPASMS.full - SPASMS.floor)))));

// the surge at each frame of the hold: a spasm's strength at its own frame, else the last surge fallen by one frame's worth
const envelope = (fall) => {
  const keep = Math.exp(-1 / (FPS * fall)), out = new Float64Array(STRENGTH.length);
  for (let i = 0, last = 0; i < out.length; i++) out[i] = last = Math.max(STRENGTH[i], last * keep);
  return out;
};
const SURGE = envelope(KO.fall);

/** What the edge is at the film's second t: {on, level, flash, beat, spasm}. Pure. */
export function koAt(t, ko = KO) {
  const {hit: h, held: k, healed: c} = ko.frames;
  if (!(t >= line(h) && t < line(c))) return {on: false, level: 0, flash: 0, beat: 0, spasm: 0};
  const since = Math.max(0, t - frameTime(h)), level = t < line(k) ? 1 : ko.view, flash = Math.exp(-since / ko.flash);
  // the surge: his body's, in the hold only (in her view he is off the frame and the red holds still). SURGE[i] is the surge at frame i's own
  // time; from there it falls continuously, and in the half frame before a frame's time a new spasm holds at its strength while the last one falls.
  const n = frameAt(t), i = n - SPASMS.from, inHold = i >= 0 && i < STRENGTH.length && t < line(k);
  let beat = 0;
  if (inHold) {
    const env = ko.fall === KO.fall ? SURGE : envelope(ko.fall), fall = (v, from) => v * Math.exp(-(t - from) / ko.fall);
    beat = t >= frameTime(n) ? fall(env[i], frameTime(n)) : Math.max(STRENGTH[i], i > 0 ? fall(env[i - 1], frameTime(n - 1)) : 0);
  }
  return {on: true, level, flash: flash < 1e-3 ? 0 : flash, beat, spasm: inHold ? STRENGTH[i] : 0};
}

/** The two layers' style at second t: {shown, steady, pulse, scale}, opacities in 0..1 to three places, the pulse layer's scale. Pure. */
export function styleAt(t, ko = KO, {reduced = false} = {}) {
  const s = koAt(t, ko);
  if (!s.on) return {shown: false, steady: 0, pulse: 0, scale: 1};
  if (reduced) return {shown: true, steady: round3(s.level * 0.8), pulse: 0, scale: 1};
  const throb = Math.max(s.beat, s.flash);
  return {
    shown: true,
    steady: round3(Math.min(1, s.level * 0.6 + s.flash * 0.4)),
    pulse: round3(Math.min(1, s.level * (0.18 + 0.82 * s.beat) + s.flash)),
    scale: round3(1 + 0.07 * (1 - throb)),   // between beats the surge stands 7 % further out, past the borders; on the beat it reaches in
  };
}

// THE RED: a superellipse vignette (clear in the middle, full at the borders, deepest in the corners) whose inner line seeps in and out by a
// seeded value noise, as blood comes in from the edges of a game's screen. `steady` is the dark rim that stays; `pulse` reaches further in, brighter.
export const LOOKS = Object.freeze({
  steady: Object.freeze({inner: 0.72, p: 3.2, seep: 0.14, alpha: 0.82, rgbIn: [176, 10, 18], rgbOut: [96, 0, 8], seed: 11}),
  pulse: Object.freeze({inner: 0.56, p: 2.6, seep: 0.18, alpha: 0.9, rgbIn: [214, 18, 30], rgbOut: [140, 0, 12], seed: 29}),
});

const hash = (x, y, s) => {
  let h = (x * 374761393 + y * 668265263 + s * 2147483647) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};
const vnoise = (x, y, s) => {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi, sx = xf * xf * (3 - 2 * xf), sy = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, s), b = hash(xi + 1, yi, s), c = hash(xi, yi + 1, s), d = hash(xi + 1, yi + 1, s);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy;
};
const fbm = (x, y, s) => (4 * vnoise(x, y, s) + 2 * vnoise(x * 2.03, y * 2.03, s + 1) + vnoise(x * 4.1, y * 4.1, s + 2)) / 7;
const smooth = (a, b, x) => { const v = Math.min(1, Math.max(0, (x - a) / (b - a))); return v * v * (3 - 2 * v); };

/** The red's pixels, w x h RGBA (not premultiplied), for a look of LOOKS. Pure and seeded: the same bytes every time. */
export function edgeTexture(w, h, look) {
  const px = new Uint8ClampedArray(w * h * 4), {inner, p, seep, alpha, rgbIn, rgbOut, seed} = look;
  const fy = 6, fx = 6 * (w / h);   // about six blots of seep across the shorter side, round on the stage
  for (let y = 0; y < h; y++) {
    const v = ((y + 0.5) / h) * 2 - 1, av = Math.abs(v) ** p;
    for (let x = 0; x < w; x++) {
      const u = ((x + 0.5) / w) * 2 - 1, d = (Math.abs(u) ** p + av) ** (1 / p);
      if (d < inner - seep) continue;
      const n = fbm(((x + 0.5) / w) * fx, ((y + 0.5) / h) * fy, seed);
      let a = smooth(inner - seep * (n - 0.5) * 2, 1, d);
      if (a <= 0) continue;
      a = a ** 1.35 * alpha * (0.8 + 0.2 * n);
      const k = smooth(0.92, 1.18, d), i = (y * w + x) * 4;
      px[i] = rgbIn[0] + (rgbOut[0] - rgbIn[0]) * k;
      px[i + 1] = rgbIn[1] + (rgbOut[1] - rgbIn[1]) * k;
      px[i + 2] = rgbIn[2] + (rgbOut[2] - rgbIn[2]) * k;
      px[i + 3] = a * 255;
    }
  }
  return px;
}

/** Put the edge on the hero's stage, driven by its film. Returns {at, stats, element, destroy}.
 *  The red's borders are the screen's: the part of `cover` (by default the stage's positioned ancestor, the hero's section) inside the window,
 *  fitted when the red comes in and again on a scroll or a resize while it is in, so it stands at the window's edges, not the stage's. */
export function mountKoEdge({stage, film, ko = KO, after = null, cover = null, reduced} = {}) {
  const doc = stage.ownerDocument, view = doc.defaultView;
  const still = reduced ?? Boolean(view.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  if (view.getComputedStyle(stage).position === 'static') stage.style.position = 'relative';
  const over = cover ?? stage.offsetParent ?? stage;
  const box = doc.createElement('div');
  box.id = 'hero-ko-edge';
  box.setAttribute('aria-hidden', 'true');
  // fixed: its box is the window's, so the hero section's overflow clip (which stops it 43 px short of each side of a 1,440 px window, the
  // second proof) does not cut it; it still paints in the stage's order, after the drawings and before the controls
  Object.assign(box.style, {position: 'fixed', left: '0', right: '0', top: '0', height: '0px', overflow: 'hidden', pointerEvents: 'none', visibility: 'hidden', contain: 'strict'});
  let size = null;
  const fit = () => {   // the window's width, over the rows of the window the hero section holds
    const c = over.getBoundingClientRect(), t = Math.max(c.top, 0), b = Math.min(c.bottom, view.innerHeight);
    size = [doc.documentElement?.clientWidth || view.innerWidth, Math.max(0, b - t)];
    box.style.top = `${t}px`;
    box.style.height = `${size[1]}px`;
  };
  const layers = {steady: doc.createElement('canvas'), pulse: doc.createElement('canvas')};
  for (const c of Object.values(layers)) {
    Object.assign(c.style, {position: 'absolute', inset: '0', width: '100%', height: '100%', opacity: '0', willChange: 'opacity, transform', transformOrigin: '50% 50%'});
    box.append(c);
  }
  const canvases = [...stage.children].filter((el) => el.tagName === 'CANVAS');
  const anchor = after ?? canvases.at(-1) ?? null;
  if (anchor) anchor.after(box); else stage.append(box);

  let painted = false, paintMs = null;
  const paint = () => {
    if (painted) return;
    painted = true;
    const t0 = view.performance.now();
    if (!size) fit();
    const sw = size[0] || 1200, sh = size[1] || 800;
    const tw = Math.max(2, Math.min(360, Math.round(sw / 4))), th = Math.max(2, Math.round(tw * sh / sw));
    for (const [name, c] of Object.entries(layers)) {
      c.width = tw; c.height = th;
      const g = c.getContext('2d'), img = g.createImageData(tw, th);
      img.data.set(edgeTexture(tw, th, LOOKS[name]));
      g.putImageData(img, 0, 0);
    }
    paintMs = view.performance.now() - t0;
  };

  let waiting = null, said = '', writes = 0, frames = 0, shown = false;
  const near = (t) => t >= line(ko.frames.hit) - 1.5 && t < line(ko.frames.healed) + 0.25;
  const apply = (t) => {
    const s = styleAt(t, ko, {reduced: still});
    const key = s.shown ? `${s.steady}|${s.pulse}|${s.scale}` : 'off';
    if (key === said) return s;
    if (s.shown && !shown) fit();
    if (s.shown && !painted) paint();
    said = key; writes++; shown = s.shown;
    box.style.visibility = s.shown ? 'visible' : 'hidden';
    layers.steady.style.opacity = String(s.steady);
    layers.pulse.style.opacity = String(s.pulse);
    layers.pulse.style.transform = s.scale === 1 ? '' : `scale(${s.scale})`;
    return s;
  };
  const ask = () => { if (waiting === null && typeof film.requestVideoFrameCallback === 'function') waiting = film.requestVideoFrameCallback(onFrame); };
  const stop = () => { if (waiting !== null) { film.cancelVideoFrameCallback?.(waiting); waiting = null; } };
  function onFrame(now, meta) {
    waiting = null; frames++;
    apply(meta?.mediaTime ?? film.currentTime);
    if (!film.paused && near(film.currentTime)) ask();
  }
  const onTime = () => { const t = film.currentTime; apply(t); if (!film.paused && near(t)) ask(); else if (film.paused) stop(); };
  const onPause = () => { stop(); apply(film.currentTime); };
  const on = {play: onTime, playing: onTime, timeupdate: onTime, seeked: onTime, pause: onPause, ended: onPause, emptied: onPause};
  for (const [type, fn] of Object.entries(on)) film.addEventListener(type, fn);
  const onView = () => { if (shown) fit(); };   // a scroll or a resize moves the window's edges; nothing while the red is out
  view.addEventListener('resize', onView, {passive: true});
  view.addEventListener('scroll', onView, {passive: true});
  if (view.requestIdleCallback) view.requestIdleCallback(paint, {timeout: 4000}); else view.setTimeout(paint, 0);
  onTime();

  return {
    at: (t) => styleAt(t, ko, {reduced: still}),
    get stats() { return {writes, frames, waiting: waiting !== null, painted, paintMs, reduced: still, size}; },
    element: box,
    destroy() {
      stop();
      for (const [type, fn] of Object.entries(on)) film.removeEventListener(type, fn);
      view.removeEventListener('resize', onView);
      view.removeEventListener('scroll', onView);
      box.remove();
    },
  };
}

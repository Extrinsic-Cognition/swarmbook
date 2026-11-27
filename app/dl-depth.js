// dl-depth.js: THE FILM IN DEPTH, the mint's film as a window his head moves, the Nintendo 3DS's face tracking without its slits.
// His words, Oct 18 2026 WEST: 01:55, over four frames of the clad (the greaves, the belt with the lightning, the arm and hip, the shoulder with the
// lightning): "what i am trying to do here is trying to provoke some depth effect with the camera where based on head moving aroudn we can cause
// nintendo 3Ds typa shit you get what i mean or not dude?"; 03:04: "there are tthose things including cloth but also flashes and such... all i am
// saying: why the hell dont we make it likd nintendo 3Ds my dude?"; 03:2x, his tap: "send the 3DS head-tracked depth brief to BRAND now, ahead of
// the cloth cutting"; Oct 4 07:34: "yeah but it's parallax effect, not?". Before them: Sept 23 (two-eyes.html) "the 2 side by side windows that
// were supposed to use depth maps with webcam depthmap and cause depth screen effect", Oct 14 10:0x (room/mac-eye.mjs) "right now on lysa there is a
// depth effect. Depth box".
// WHAT IT IS: the smooth per-pixel window from the one-preview shown before his Oct 18 03:22 dispatch: guessed colour depth from -10 to +4 mm,
// smoothed at 240x135; thin flashes independently at +30 mm. dl-depth-window.js preserves that preview's shaders and default strength of one.
// The mint keeps its existing pictureViewport crop and single film. No second video, time seek, playback or audio control lives here.
// A fresh camera body leads; otherwise a bounded music-shaped orbit supplies the eye around the fixed picture centre. Mouse input steers its shape.
// The first camera body is the rest reference, reset after a 3 s absence. Explicit eye, mouse and test modes retain direct input.
// The original easing advances 25% toward the target per caused frame, snapping within 0.2 mm. A paused film with a settled eye schedules nothing.
// COST: one video upload/mipmap plus two 240x135 depth passes per changed film frame. Pointer-only motion reuses them and draws only the view.
// The seven-step window and flash fill are the recovered WebGL treatment; CPU submission time is exposed separately from pass counts, not as GPU time.
import {follow, cardOf, MM_PER_PX} from '../vendor/embertide-app/ui/intro/room/mac-eye.mjs';
import {NestSource} from '../vendor/embertide-app/ui/intro/room/nest-hub.mjs';
import {pictureViewport} from '../lab/mint-freeze-layout.mjs';
import {createWindowRenderer, RENDERER, LOW} from './dl-depth-window.js?v=depth-orbit-1';
import {orbitAt, steeringOf, NEUTRAL, ORBIT} from './dl-depth-orbit.js';

export const FPS = 30000 / 1001;
export const DEPTH_MM = Object.freeze([-10, 4, 30]);   // smooth background-to-cloth range, separate flashes: millimetres before the glass (+ toward him)
export const REST_M = 0.55;            // a head straight ahead this far: the receipt's distance
export const MIN_SLIDE_PX = 0.35;      // under this, in device px, nothing slides that the eye could see: the canvas stays hidden
export const SOURCE = Object.freeze({w: 960, h: 540, content: Object.freeze([82, 4, 796, 532])});   // the film's frame and its picture inside it
const LOCAL = /^(127\.0\.0\.1|localhost|\[::1\]|.*\.local|.*\.localhost)$/;

/** slideOf(eye, d): how far a plane d metres before the glass slides on it for an eye at [x, y, z] metres (the picture's axes: x right, y up, z out
 *  toward him), against the same eye straight ahead at the same distance: [x, y] metres on the glass. */
export function slideOf(eye, d) { const k = eye[2] / (eye[2] - d); return [eye[0] * (1 - k), eye[1] * (1 - k)]; }
/** pxPerCm(z, depths, mmPerPx): the slide of the nearest layer against the farthest, CSS px per centimetre of a head moving sideways z metres away. */
export function pxPerCm(z = REST_M, depths = DEPTH_MM, mmPerPx = MM_PER_PX) {
  const e = [0.01, 0, z], near = Math.max(...depths) / 1000, far = Math.min(...depths) / 1000;
  return Math.abs(slideOf(e, near)[0] - slideOf(e, far)[0]) * 1000 / mmPerPx;
}
/** The frame of the film presented at second t (its frames start at n / FPS). */
export const frameAt = (t) => Math.floor(t * FPS + 1e-3);
/** The picture's content rectangle in a box w x h (CSS or device px): {left, top, width, height}. */
export function contentRect(w, h) {
  const p = pictureViewport(w, h), [x, y, cw, ch] = SOURCE.content;
  return {left: p.left + x / SOURCE.w * p.width, top: p.top + y / SOURCE.h * p.height, width: cw / SOURCE.w * p.width, height: ch / SOURCE.h * p.height};
}
/** shiftsOf(eye, content): each layer's slide in the content's own units (u right, v down, 0..1 over its width and height) for an eye in metres in
 *  the picture's axes and a content `widthM` x `heightM` metres on the glass. */
export function shiftsOf(eye, {widthM, heightM}, depths = DEPTH_MM) {
  return depths.map((mm) => { const [x, y] = slideOf(eye, mm / 1000); return [x / widthM, -y / heightM]; });
}
/** Whether a draw would show anything the eye could see: some layer slides MIN_SLIDE_PX or more on a content `pxW` x `pxH` device px. */
export const anySlide = (shifts, pxW, pxH) => shifts.some(([u, v]) => Math.hypot(u * pxW, v * pxH) >= MIN_SLIDE_PX);

/** A point seen true from REST_M, projected through the same screen from the current eye. Unlike a lateral slide, z motion changes its scale. */
export function projectPoint([x, y], eye, depthM) {
  const k0 = REST_M / (REST_M - depthM), k1 = eye[2] / (eye[2] - depthM);
  return [eye[0] + (x / k0 - eye[0]) * k1, eye[1] + (y / k0 - eye[1]) * k1];
}
export function anyProjection(eye, {widthM, heightM}, pxW, pxH) {
  return DEPTH_MM.some((mm) => [-1, 1].some((sx) => [-1, 1].some((sy) => {
    const p = [sx * widthM / 2, sy * heightM / 2], q = projectPoint(p, eye, mm / 1000);
    return Math.hypot((q[0] - p[0]) / widthM * pxW, (q[1] - p[1]) / heightM * pxH) >= MIN_SLIDE_PX;
  })));
}

/** The window over the stage's existing picture. All media ownership remains with the mint film clock. */
export function mountDepth({stage, film, after, q = new URLSearchParams(), win = globalThis.window, doc = win?.document, followHead = follow} = {}) {
  if (!stage || !film || !win || !doc) return null;
  const local = LOCAL.test(win.location.hostname), mode = q.get('depth') || (local ? 'auto' : 'orbit');
  if (mode === 'off') return null;
  const canvas = doc.createElement('canvas');
  canvas.id = 'dl-depth'; canvas.hidden = true; canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {position: 'absolute', inset: '0', width: '100%', height: '100%', pointerEvents: 'none'});
  (after ?? stage.firstChild)?.after ? (after ?? stage.firstChild).after(canvas) : stage.append(canvas);
  const S = {ms: null, mode, eye: null, aim: null, eyeFrom: null, frame: null, draws: 0, skipped: 0, loaded: false,
    visible: false, error: null, words: 0, last: null, moving: false, trajectory: null};
  let renderer = null, callback = null, raf = 0, stopped = false, inView = true;
  let follower = null, head = null, pointer = null, proofEye = null, reference = null, bodyAt = -Infinity, controls = NEUTRAL;
  const motionQuery = win.matchMedia?.('(prefers-reduced-motion: reduce)');
  let reducedMotion = Boolean(motionQuery?.matches);
  const orbital = mode === 'auto' || mode === 'orbit';
  const boxOf = () => stage.getBoundingClientRect();
  const inSpan = (t) => t >= ORBIT.start && t < ORBIT.end;
  const allowed = () => !stopped && !doc.hidden && inView && inSpan(film.currentTime);
  const card = () => {
    const box = boxOf(); if (!box.width || !box.height) return null;
    const r = contentRect(box.width, box.height);
    return cardOf({rect: {left: box.left + r.left, top: box.top + r.top, width: r.width, height: r.height}, screenW: win.screen?.width || win.innerWidth,
      screenX: win.screenX || 0, screenY: win.screenY || 0, chromeY: Math.max(0, (win.outerHeight || 0) - (win.innerHeight || 0))});
  };
  function setup() {
    if (renderer) return renderer;
    if (S.error) return null;
    try {
      const gl = canvas.getContext('webgl2', {premultipliedAlpha: false, alpha: true, antialias: false, preserveDrawingBuffer: mode === 'test'});
      if (!gl) throw new Error('no webgl2');
      renderer = createWindowRenderer(gl); return renderer;
    } catch (e) { S.error = String(e.message || e); return null; }
  }
  function hide() { canvas.hidden = true; S.visible = false; }
  function draw() {
    const t0 = win.performance.now(), t = film.currentTime, n = S.frame ?? frameAt(t);
    if (!S.eye || !allowed()) { hide(); return; }
    const dpr = Math.min(2, win.devicePixelRatio || 1), box = boxOf(), W = Math.round(box.width * dpr), H = Math.round(box.height * dpr);
    if (!W || !H) return;
    const rect = contentRect(W, H), full = pictureViewport(W, H);
    const content = {widthM: rect.width / dpr * MM_PER_PX / 1000, heightM: rect.height / dpr * MM_PER_PX / 1000};
    const shifts = shiftsOf(S.eye, content);
    S.last = {frame: n, slidesPx: shifts.map(([u, v]) => [Math.round(u * rect.width / dpr * 100) / 100, Math.round(v * rect.height / dpr * 100) / 100])};
    if (!anyProjection(S.eye, {widthM: full.width / dpr * MM_PER_PX / 1000, heightM: full.height / dpr * MM_PER_PX / 1000}, full.width, full.height)) {
      hide(); S.skipped++; return;
    }
    if (film.readyState < 2 || !setup()) return;
    if (canvas.width !== W || canvas.height !== H) { canvas.width = W; canvas.height = H; }
    try {
      renderer.upload(film, n);
      renderer.draw({width: W, height: H, rect: full, clip: rect, mmPerDevicePx: MM_PER_PX / dpr, eye: S.eye.map((v) => v * 1000), depths: DEPTH_MM});
      S.loaded = true; canvas.hidden = false; S.visible = true; S.draws++;
      S.ms = Math.round((win.performance.now() - t0) * 100) / 100;
    } catch (e) { S.error = String(e.message || e); hide(); }
  }
  function cancelWork() {
    if (raf) win.cancelAnimationFrame(raf); raf = 0;
    if (callback !== null) film.cancelVideoFrameCallback?.(callback); callback = null;
  }
  function suspend() { cancelWork(); S.eye = S.aim = null; S.eyeFrom = null; S.moving = false; S.trajectory = null; hide(); }
  function schedule() { if (!raf && allowed() && S.aim && (S.eyeFrom || S.moving)) raf = win.requestAnimationFrame(tick); }
  function tick() {
    raf = 0; if (!allowed() || !S.aim) { suspend(); return; }
    S.moving = false;
    for (let i = 0; i < 3; i++) {
      const d = S.aim[i] - S.eye[i];
      if (Math.abs(d) > .0002) { S.eye[i] += d * .25; S.moving = true; } else S.eye[i] = S.aim[i];
    }
    draw();
    // Playing orbit motion is sampled only by presented film frames. Pausing allows a finite settle to that frozen film second.
    const followsFilm = (S.eyeFrom === 'orbit' || S.eyeFrom === 'orbit-steered') && !film.paused;
    if (S.moving && !followsFilm) schedule();
    else if (!S.eyeFrom && callback !== null) { film.cancelVideoFrameCallback?.(callback); callback = null; }
  }
  const hasCallback = typeof film.requestVideoFrameCallback === 'function';
  function onFrame(_now, meta) {
    callback = null;
    if (!allowed()) { suspend(); return; }
    const t = meta?.mediaTime ?? film.currentTime;
    S.frame = frameAt(t); chooseEye(t); schedule(); chain();
  }
  function chain() {
    if (!allowed() || !hasCallback || callback !== null || film.paused || !S.aim || (!S.eyeFrom && !S.moving)) return;
    callback = film.requestVideoFrameCallback(onFrame);
  }
  function setEye(eye, from) {
    if (stopped) return;
    const same = S.aim && eye && Math.hypot(...S.aim.map((v, i) => v - eye[i])) < 1e-4;
    S.aim = eye; S.eyeFrom = eye ? from : null; S.words++;
    if (!eye) { suspend(); return; }
    S.eye ??= [0, 0, REST_M];
    if (!same) { S.moving = true; schedule(); }
  }
  function chooseEye(t = film.currentTime) {
    if (!allowed()) { suspend(); return; }
    S.trajectory = null;
    if (head) setEye(head, 'camera');
    else if (mode === 'test') setEye(proofEye, proofEye ? 'a proof' : null);
    else if (mode === 'mouse') setEye(pointer ? [pointer.x * .12, -pointer.y * .08, REST_M] : [0, 0, REST_M], pointer ? 'mouse' : null);
    else if (orbital && (!reducedMotion || pointer)) {
      // Reduced motion has no automatic orbit: a pointer may choose a still point on the same path; film time never rotates it.
      const sample = reducedMotion ? ORBIT.start + 4 : t;
      S.trajectory = {...orbitAt(sample, controls), kind: reducedMotion ? 'manual-orbit' : 'music-orbit', steered: Boolean(pointer)};
      setEye(S.trajectory.eye, reducedMotion ? 'orbit-steered' : 'orbit');
    } else setEye([0, 0, REST_M], null);
  }
  function wake() {
    if (!allowed()) { suspend(); return; }
    S.frame = frameAt(film.currentTime); chooseEye(); schedule(); chain();
  }
  const filmListeners = [];
  for (const type of ['play', 'loadeddata', 'seeked', 'pause', 'timeupdate']) {
    const fn = () => {
      if (!allowed()) { suspend(); return; }
      if (type === 'timeupdate' && callback !== null) return;
      if (type === 'pause' && callback !== null) { film.cancelVideoFrameCallback?.(callback); callback = null; }
      wake();
    };
    film.addEventListener(type, fn); filmListeners.push([type, fn]);
  }
  const resize = () => { if (S.visible) schedule(); };
  const visibility = () => { if (doc.hidden) suspend(); else wake(); };
  const motionChanged = (event) => { reducedMotion = event.matches; wake(); };
  win.addEventListener('resize', resize, {passive: true});
  doc.addEventListener?.('visibilitychange', visibility);
  motionQuery?.addEventListener?.('change', motionChanged);
  const observer = typeof win.IntersectionObserver === 'function' ? new win.IntersectionObserver((entries) => {
    const entry = entries.find((e) => e.target === stage); if (!entry) return;
    inView = entry.isIntersecting; if (inView) wake(); else suspend();
  }) : null;
  observer?.observe(stage);
  if (mode === 'eye' || (mode === 'auto' && local)) {
    const nest = q.get('nest') || `${win.location.protocol}//${win.location.hostname}:8904`;
    follower = followHead({Source: NestSource, nest, seat: q.get('eye-seat') || 'eye-mac', card, win,
      onHead: (w) => {
        const c = card(), measured = w && c ? w.u.map((v) => v * c.h_m) : null;
        if (measured) {
          const now = win.performance.now();
          if (!reference || now - bodyAt > 3000) reference = measured;
          bodyAt = now;
          head = [measured[0] - reference[0], measured[1] - reference[1], Math.max(.2, REST_M + measured[2] - reference[2])];
        } else head = null;
        chooseEye(); chain();
      }});
  }
  const movePointer = (e) => {
    if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
    const box = boxOf(), r = contentRect(box.width, box.height);
    if (!r.width || !r.height) return;
    const x = ((e.clientX - box.left - r.left) / r.width - .5) * 2, y = ((e.clientY - box.top - r.top) / r.height - .5) * 2;
    pointer = {x: Math.max(-1.4, Math.min(1.4, x)), y: Math.max(-1.4, Math.min(1.4, y))};
    controls = steeringOf(x, y);
    if (!head) { chooseEye(); chain(); }
  };
  const leavePointer = () => { pointer = null; controls = NEUTRAL; if (!head) { chooseEye(); chain(); } };
  if (mode === 'mouse' || orbital) {
    stage.addEventListener('pointermove', movePointer, {passive: true});
    stage.addEventListener('pointerleave', leavePointer, {passive: true});
  }
  const rounded = (e) => e && e.map((v) => Math.round(v * 1000) / 1000);
  const handle = Object.freeze({
    state: () => ({renderer: RENDERER, mode: S.mode, eye: rounded(S.eye), aim: rounded(S.aim), moving: S.moving, from: S.eyeFrom,
      words: S.words, frame: S.frame, visible: S.visible, draws: S.draws, skipped: S.skipped, last: S.last, ms: S.ms,
      loaded: S.loaded, error: S.error, pxPerCm: Math.round(pxPerCm() * 100) / 100, depthsMm: DEPTH_MM,
      trajectory: S.trajectory, controls: {...controls}, reducedMotion, inView,
      low: LOW, passes: renderer?.state() ?? {frame: null, uploads: 0, classifications: 0, blurs: 0, views: 0}, eyeState: follower?.state?.() ?? null}),
    eye: mode === 'test' ? (e) => { proofEye = Array.isArray(e) && e.length === 3 && e.every(Number.isFinite) && e[2] > .03 ? e.slice() : null; chooseEye(); chain(); } : undefined,
    stop() {
      follower?.stop(); stage.removeEventListener('pointermove', movePointer); stage.removeEventListener('pointerleave', leavePointer);
      for (const [type, fn] of filmListeners) film.removeEventListener?.(type, fn);
      win.removeEventListener?.('resize', resize); doc.removeEventListener?.('visibilitychange', visibility);
      motionQuery?.removeEventListener?.('change', motionChanged); observer?.disconnect();
      head = pointer = proofEye = null; suspend(); stopped = true; renderer?.stop();
    },
  });
  win.dlDepth = handle; wake(); return handle;
}

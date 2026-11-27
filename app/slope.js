// slope.js: the slippery slope between the chamber and the wall. Up to a point of no return the
// scroll scrubs the story as it always did; past it, the page glides the rest of the way on its own,
// so nobody is left hanging between the two with the worlds half flown. Coming down from the chamber
// the point is almost at once; climbing back from the wall it is just as near: neither holds. The
// glide itself, either way, is slow and smooth, in and out; the climb lands on the chamber whole,
// just under the hero, never at the top of the page. Input takes an ordinary glide back; an optional
// first-descent film keeps a steady forward pace until it finishes, is skipped, or the hand reverses.

import { assemblyBounds } from './assembly-layout.js';

export const REST = { CHAMBER: 0, WALL: 1 };

/** The two points of no return, as places in the story (0 the chamber whole, 1 the wall): leaving the
 *  chamber the wall takes over past `down`; leaving the wall the chamber takes over below `up`. Both sit
 *  a hair from their rest: the wall lets go at once, and so does the chamber; nothing holds. */
export const POINTS = { down: .06, up: .95 };

/** Where a stopped scroll should rest: x the place in the story, lastRest the rest it left, dir the way
 *  the hand last moved (positive down the page, negative up, zero unknown). The hand is sovereign: past
 *  the two near points, its direction decides, whatever glide it interrupted. Null outside the story. */
export function decide(x, lastRest, points = POINTS, dir = 0) {
  if (!(x > 0 && x < 1)) return null;
  if (x <= points.down) return REST.CHAMBER;
  if (x >= points.up) return REST.WALL;
  if (dir > 0) return REST.WALL;
  if (dir < 0) return REST.CHAMBER;
  return lastRest === REST.CHAMBER ? REST.WALL : REST.CHAMBER;
}

/** The glide's easing, either way: slow in, slow out, the engine's smoother step. */
export const ease = (k) => { const t = Math.min(1, Math.max(0, k)); return t * t * t * (t * (t * 6 - 15) + 10); };
/** How long a glide takes for a distance in pixels: about two seconds for a whole story. */
export const duration = (d) => (460 + Math.min(440, Math.abs(d) * .22)) * 2;

/** A complete first descent takes this long; entering partway through keeps the same scene speed. */
export const INTRO_DURATION_MS = 64_000;
export const OUTRO_REVEAL_MS = 3600;
export const outroDuration = distance => Math.max(2200, Math.min(9000, Math.abs(distance) * 1.8));

/** The film starts from rest: its speed ramps up over this long, then holds steady. */
export const INTRO_RAMP_MS = 2400;
// Integral of the quintic ease. Its velocity and acceleration meet the plateau
// without a kink; a complete ramp covers half the distance of cruising.
const rampIntegral = u => u ** 6 - 3 * u ** 5 + 2.5 * u ** 4;
const rampDistance = (elapsed, ramp) => {
  const t = Math.max(0, elapsed);
  return t < ramp ? ramp * rampIntegral(t / ramp) : t - ramp / 2;
};
const filmRamp = (took, ramp) => Math.max(.001, Math.min(ramp, took / 2));
/** Unit progress: a smooth velocity ramp, then cruising, reaching 1 at `took`. */
export function filmProgress(elapsed, took, ramp = INTRO_RAMP_MS) {
  const r = filmRamp(took, ramp);
  return rampDistance(Math.min(took, elapsed), r) / rampDistance(took, r);
}
/** Unit progress per millisecond, including the incoming velocity at the end. */
export function filmVelocity(elapsed, took, ramp = INTRO_RAMP_MS) {
  if (elapsed < 0 || elapsed > took) return 0;
  const r = filmRamp(took, ramp);
  return ease(elapsed / r) / rampDistance(took, r);
}
const approachRamp = fromX => Math.min(INTRO_RAMP_MS, Math.max(0, -fromX) * INTRO_DURATION_MS * 2);
/** Time to reach the chamber at cruising speed, even when starting just above it. */
export function approachDuration(fromX) {
  return Math.max(0, -fromX) * INTRO_DURATION_MS + approachRamp(fromX) / 2;
}
/** One analytic path crosses the chamber; an overrun belongs to the film. */
export function approachProgress(elapsed, fromX) {
  const boundaryAt = approachDuration(fromX), ramp = approachRamp(fromX);
  if (elapsed >= boundaryAt) return Math.min(1, (elapsed - boundaryAt) / INTRO_DURATION_MS);
  return fromX + rampDistance(elapsed, ramp) / INTRO_DURATION_MS;
}
/** Unit travel with a supplied incoming velocity (fraction per millisecond).
 * The incoming cruise decelerates smoothly while a bounded quintic passage
 * supplies the remaining distance. Both accelerations meet at zero, the path
 * is monotonic even for a short destination, and it stops exactly at `took`.
 */
export function outroProgress(elapsed, took, incomingVelocity = 0) {
  const u = Math.min(1, Math.max(0, elapsed / took));
  const v = Math.max(0, incomingVelocity * took), span = v > 1 ? 1 / v : 1;
  const z = Math.min(1, u / span), coast = v * span * (z - rampIntegral(z));
  return Math.min(1, Math.max(0, coast + (1 - v * span / 2) * ease(u)));
}

export function installSlope(root, { points = POINTS, settle = 140, reduced = matchMedia('(prefers-reduced-motion: reduce)'), intro = null, autoStart = true, autoStartDelay = 1200, restoreOnReload = false } = {}) {
  const stage = root.querySelector('.assembly-stage');
  let lastRest = REST.CHAMBER, timer = null, raf = null, motion = null, wrote = null, lastY = scrollY, dir = 0;
  let introUsed = false, downUntil = 0, touchY = null;
  let autoTimer = null, autoDone = !autoStart || !intro;
  let reloadPending = restoreOnReload && !autoDone, reloadLayout = null;
  // Match the sculpture's pin and landing, including the sticky header.
  const bounds = () => assemblyBounds(root, stage);
  const position = () => { const { start, length } = bounds(); return (scrollY - start) / length; };
  // The scroll film consumes active frames. A delayed callback after device
  // sleep cannot skip the journey or its final reveal in one scroll write.
  const startClock = (carried = 0) => {
    let previous = performance.now(), elapsed = carried;
    return now => {
      elapsed += Math.max(0, Math.min(100, now - previous)); previous = now;
      return elapsed;
    };
  };
  const clearSettle = () => { if (timer !== null) clearTimeout(timer); timer = null; };
  const endIntro = (completed = false) => { introUsed = true; intro.end({ completed }); };
  const cancel = () => {
    if (raf !== null) cancelAnimationFrame(raf);
    raf = null;
    const wasIntro = motion?.cinematic;
    motion = null;
    if (wasIntro) endIntro();
  };
  const stop = () => { cancel(); clearSettle(); downUntil = 0; };
  const write = (x) => {
    const { start, length } = bounds();
    wrote = start + length * x;
    scrollTo({ left: 0, top: wrote, behavior: 'instant' });
    // Read back the browser's actual scroll, including any pixel rounding or clamping.
    if (motion?.cinematic && motion.phase !== 'outro') intro.render(Math.min(1, Math.max(0, position())));
  };
  const writeOutro = () => {
    const { start, length } = bounds();
    const target = intro.outroTarget();
    motion.x = 1 + ((target - start) / length - 1) * motion.travel;
    write(motion.x);
    intro.renderOutro(motion.reveal);
  };
  const continueToAnatomy = (incomingVelocity = 0, carried = 0) => {
    if (!intro.prepareOutro?.()) return false;
    const { start, length } = bounds(), distance = intro.outroTarget() - (start + length);
    const took = outroDuration(distance), velocity = distance > 0 ? incomingVelocity * length / distance : 0;
    const readElapsed = startClock(carried);
    motion = { cinematic: true, phase: 'outro', x: 1, travel: 0, reveal: 0 };
    const update = elapsed => {
      motion.travel = outroProgress(elapsed, took, velocity);
      motion.reveal = Math.min(1, Math.max(0, (elapsed - took) / OUTRO_REVEAL_MS));
      writeOutro();
    };
    update(carried);
    const step = now => {
      if (!motion) return;
      if (document.hidden || reduced.matches) { stop(); return; }
      const elapsed = readElapsed(now);
      update(elapsed);
      if (motion.reveal < 1) raf = requestAnimationFrame(step);
      else { raf = null; motion = null; lastRest = REST.WALL; endIntro(true); }
    };
    raf = requestAnimationFrame(step);
    return true;
  };
  const glide = (rest, cinematic = false) => {
    const { start, length } = bounds(), fromX = (scrollY - start) / length, d = (rest - fromX) * length;
    if (Math.abs(d) < 2) { lastRest = rest; return; }
    clearSettle(); downUntil = 0;
    const fromAbove = cinematic && fromX < 0;
    motion = { cinematic, x: fromX };
    wrote = scrollY;
    // Stop any native smooth-wheel scroll at its current position immediately. Waiting for the
    // first RAF leaves a gap where the wheel's next native scroll would cancel the new film.
    if (cinematic) { intro.begin(); write(fromX); }
    const readElapsed = startClock(), took = cinematic
      ? fromAbove ? approachDuration(fromX) + INTRO_DURATION_MS : INTRO_DURATION_MS * (1 - fromX)
      : duration(d);
    const terminalVelocity = fromAbove ? 1 / INTRO_DURATION_MS : cinematic ? (1 - fromX) * filmVelocity(took, took) : 0;
    const step = (now) => {
      if (!motion) return;
      if (document.hidden || reduced.matches) { stop(); return; }
      const elapsed = readElapsed(now);
      const k = Math.min(1, elapsed / took);
      if (!cinematic) motion.x = fromX + (rest - fromX) * ease(k);
      else if (fromAbove) motion.x = approachProgress(elapsed, fromX);
      else motion.x = fromX + (rest - fromX) * filmProgress(elapsed, took);
      write(motion.x);
      if (k < 1) raf = requestAnimationFrame(step);
      else if (cinematic && continueToAnatomy(terminalVelocity, elapsed - took)) { /* Carry the same movement beyond the wall. */ }
      else { raf = null; motion = null; lastRest = rest; if (cinematic) endIntro(true); }
    };
    raf = requestAnimationFrame(step);
  };
  const settled = () => {
    timer = null;
    if (motion || reduced.matches || document.hidden) return;
    const { start, length } = bounds(), x = (scrollY - start) / length;
    if (x <= 0) { lastRest = REST.CHAMBER; return; }
    if (x >= 1) { lastRest = REST.WALL; return; }
    const rest = decide(x, lastRest, points, dir);
    if (rest !== null) glide(rest);
  };
  const scheduleSettle = () => { clearSettle(); if (!document.hidden && !reduced.matches) timer = setTimeout(settled, settle); };
  const canIntroduce = (replay = false) => intro && (replay || !introUsed || intro.repeatEnabled?.())
    && !reduced.matches && !document.hidden && intro.eligible({ replay });
  const startIntro = (fromAbove = false) => {
    const x = position();
    if (!canIntroduce() || !(x < 1 && (fromAbove || x >= 0))) return false;
    cancel(); glide(REST.WALL, true);
    return !!motion;
  };
  // a scroll the glide did not write (a scrollbar drag, a script) is the hand again: the glide lets go.
  // Every scroll of the hand's says which way it went; that is what decides once it stops
  const onScroll = () => {
    const y = scrollY;
    if (wrote !== null && Math.abs(y - wrote) < 2) { lastY = y; return; }
    wrote = null;
    // Browser restoration can arrive before or after the async wall mounts.
    // It is not a gesture, and must not start an ordinary glide on empty bounds.
    if (reloadPending && !motion) { lastY = y; return; }
    cancelAuto();
    if (motion) stop();
    if (lastY !== null && y !== lastY) dir = y > lastY ? 1 : -1;
    lastY = y;
    // Only a recent physical downward gesture may start the film. Restored positions, resize and
    // arbitrary programmatic scrolls still use the ordinary slope; a settle timer never starts it.
    if (dir > 0 && downUntil > performance.now() && startIntro()) return;
    if (dir < 0 || position() >= 1) downUntil = 0;
    scheduleSettle();
  };
  const ordinaryIntent = () => { if (motion) { cancel(); scheduleSettle(); } };
  const directionalIntent = (event, direction) => {
    cancelAuto();
    if (document.hidden || reduced.matches) { stop(); return; }
    if (motion?.cinematic) {
      if (direction > 0) { event.preventDefault(); return; }
      if (direction < 0) { stop(); dir = -1; lastY = scrollY; }
      return;
    }
    ordinaryIntent();
    if (direction) dir = direction;
    downUntil = 0;
    if (direction > 0 && canIntroduce()) {
      if (startIntro()) event.preventDefault();
      // Above the chamber, let the gesture enter the story. At its exact edge start directly so
      // there is no native scroll to race against the first frame of the movie.
      else if (position() < 0) downUntil = performance.now() + 400;
    }
  };
  const onWheel = (event) => {
    if (event.ctrlKey || event.metaKey) { cancelAuto(); stop(); return; }
    directionalIntent(event, Math.sign(event.deltaY));
  };
  const onKey = (event) => {
    cancelAuto(); // typing and focused controls also take priority over restoration
    if (event.key === 'Escape') { cancelAuto(); stop(); return; }
    const editable = event.target?.isContentEditable || event.target?.closest?.('input, textarea, select, [contenteditable="true"]');
    const spaceOnControl = (event.key === ' ' || event.key === 'Spacebar') && event.target?.closest?.('button, a, [role="button"]');
    if (editable || spaceOnControl || event.altKey || event.ctrlKey || event.metaKey) return;
    // End is an explicit request to leave for the bottom of the page, including during the film.
    if (event.key === 'End') { cancelAuto(); stop(); dir = 1; return; }
    const direction = ['ArrowDown', 'PageDown'].includes(event.key) ? 1
      : ['ArrowUp', 'PageUp', 'Home'].includes(event.key) ? -1
      : (event.key === ' ' || event.key === 'Spacebar') ? (event.shiftKey ? -1 : 1) : 0;
    directionalIntent(event, direction);
  };
  const onTouchStart = (event) => {
    cancelAuto();
    touchY = event.touches.length === 1 ? event.touches[0].clientY : null;
    if (!motion?.cinematic) ordinaryIntent();
  };
  const onTouchMove = (event) => {
    if (touchY === null || event.touches.length !== 1) return;
    const y = event.touches[0].clientY, direction = Math.sign(touchY - y);
    touchY = y;
    directionalIntent(event, direction);
  };
  const onTouchEnd = () => { touchY = null; };
  const onVisibility = () => { if (document.hidden) stop(); };
  const onReduced = () => { if (reduced.matches) stop(); };
  const onResize = () => { downUntil = 0; intro?.resize?.(); if (motion) { if (motion.phase === 'outro') writeOutro(); else write(motion.x); } };
  const skip = () => {
    if (!motion?.cinematic) return;
    if (motion.phase === 'outro') {
      motion.travel = 1; motion.reveal = 1; writeOutro();
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null; motion = null; clearSettle(); downUntil = 0;
      lastRest = REST.WALL; lastY = scrollY; endIntro(true); return;
    }
    write(REST.WALL);
    stop(); lastRest = REST.WALL; lastY = scrollY;
  };
  const replay = () => {
    stop();
    if (!canIntroduce(true)) return false;
    write(REST.CHAMBER);
    lastRest = REST.CHAMBER; lastY = scrollY; dir = 1;
    glide(REST.WALL, true);
    return !!motion;
  };
  // The first descent starts by itself: once the assembly is ready and the page still rests at the
  // chamber, a beat, then the film. Any gesture before that hands the start back to the hand.
  const cancelAuto = () => {
    autoDone = true; reloadPending = false; reloadLayout = null;
    if (autoTimer !== null) clearTimeout(autoTimer); autoTimer = null;
  };
  const tryAuto = () => {
    autoTimer = null;
    if (autoDone) return;
    if (document.hidden || reduced.matches || motion) { autoTimer = setTimeout(tryAuto, 400); return; }
    if (!canIntroduce()) { autoTimer = setTimeout(tryAuto, 250); return; }
    if (reloadPending) {
      // Native scroll restoration, async chain layout, and initial page load
      // need to agree before we choose the resume point. Do not take over a
      // restored position while the browser is still measuring/loading it.
      if (document.readyState && document.readyState !== 'complete') {
        autoTimer = setTimeout(tryAuto, 100); return;
      }
      const current = { ...bounds(), y: scrollY };
      if (!reloadLayout || Object.keys(current).some(k => Math.abs(current[k] - reloadLayout[k]) > .5)) {
        reloadLayout = current; autoTimer = setTimeout(tryAuto, 100); return;
      }
      reloadPending = false; reloadLayout = null; autoDone = true;
      const restored = position();
      if (restored >= 1) return; // ordinary content below the story stays put
      lastY = scrollY; dir = 1;
      if (restored > 0 && (1 - restored) * current.length < 2) {
        write(REST.WALL); lastRest = REST.WALL; lastY = scrollY; return;
      }
      startIntro(restored < 0); return;
    }
    const x = position();
    autoDone = true;
    if (x > .001) return; // the hand already entered the story: it decides
    dir = 1; lastY = scrollY;
    // Above the chamber, the hero scrolls away first on the ordinary glide; the film starts as it lands.
    startIntro(true);
  };
  if (!autoDone) autoTimer = setTimeout(tryAuto, reloadPending ? 0 : autoStartDelay);
  intro?.setReview?.((index,x)=>{
    cancelAuto();stop();
    if(!canIntroduce(true))return;
    intro.begin();motion={cinematic:true,x};write(x);intro.resize?.();intro.render(x);intro.reviewing?.(index);
    lastY=scrollY;
  });
  intro?.setSkip(skip);
  intro?.setReplay?.(replay);
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('wheel', onWheel, { passive: false });
  addEventListener('pointerdown', cancelAuto, { passive: true });
  addEventListener('keydown', onKey, { passive: false });
  addEventListener('touchstart', onTouchStart, { passive: true });
  addEventListener('touchmove', onTouchMove, { passive: false });
  addEventListener('touchend', onTouchEnd, { passive: true });
  addEventListener('touchcancel', onTouchEnd, { passive: true });
  addEventListener('resize', onResize);
  addEventListener('pagehide', stop);
  document.addEventListener('visibilitychange', onVisibility);
  reduced.addEventListener('change', onReduced);
  { const { start, length } = bounds(); lastRest = (scrollY - start) / length >= .5 ? REST.WALL : REST.CHAMBER; }
  return {
    destroy() {
      cancelAuto(); stop(); intro?.setSkip(null); intro?.setReplay?.(null); intro?.setReview?.(null);
      removeEventListener('scroll', onScroll);
      removeEventListener('wheel', onWheel);
      removeEventListener('pointerdown', cancelAuto);
      removeEventListener('keydown', onKey);
      removeEventListener('touchstart', onTouchStart);
      removeEventListener('touchmove', onTouchMove);
      removeEventListener('touchend', onTouchEnd);
      removeEventListener('touchcancel', onTouchEnd);
      removeEventListener('resize', onResize);
      removeEventListener('pagehide', stop);
      document.removeEventListener('visibilitychange', onVisibility);
      reduced.removeEventListener('change', onReduced);
    },
  };
}

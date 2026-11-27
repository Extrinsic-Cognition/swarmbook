// heartbeat.js: THE HEARTBEAT, the Lissajous orbits beating like a heart while Seiya is held, for the hero (hero-ab.html). His words, Oct 14
// 2026 21:5x WEST, over the hero at the KO edge (Dolbar holding Seiya up by the hair): "can you add a synced heart beat rythim natural like
// accelerated there like fucking resident evil games when the heart is beating"; and then: "i mean to the lyssajudrean orbits eh... not else...
// i mean... it could be intresting to see the dodecahedron getting bigger and covering more of the orgiinal (larger surgace = more captrue)".
//
// THE WINDOW is the KO edge's (ko-edge.js): from THE HIT, frame 540 (18.018 s, the gauntlet closes in his hair) to THE BEAM, frame 1096
// (36.570 s, the light is the cure). The heart is the danger's own, as Resident Evil's screen beats when the body is in danger: the first beat
// lands on the hit's frame, and from there it RACES, 72 beats a minute at the hit to 156 at the beam, climbing slowly and then faster (the rate
// is 72 + 84 u^1.6, u the share of the window gone). Each beat is a heart's, LUB-DUB: the first sound on the beat, the second one a systole
// later, weaker (0.55), the systole shortening as the heart races as a heart's does (0.36 s x the root of the period: 0.33 s at the hit, 0.22 s
// at the beam); each sound a thump (it reaches its peak in 35 ms and falls, x/t e^(1 - x/t)), stronger as the danger grows (0.6 to 1).
//
// WHAT IT MOVES, his "not else": THE LISSAJOUS ORBITS (warm-sphere.js's twelve lanes): on each lub they reach 8 % further out and come back,
// on each dub less; and THE DODECAHEDRON, his "getting bigger and covering more of the original (larger surface = more capture)": it swells
// with the danger, a third larger by the beam (eased in, so the hold grows on it), its faces showing the film bigger, and it thumps 3 % with
// each lub; the orbits stand at their 1.5 radii of the swollen sphere, so they swell with it. At the beam's first frame the heart stops racing
// and the sphere lets its breath out over 0.4 s, back at its own size before the theater's burst (37.10 s). The red edge keeps its own pulse
// (his body's spasms, ko-edge.js): the heart is not on it.
//
// THE TRACE (his words, 22:1x WEST, over the orbits beating: "is it too much to ask to make each of them a fucking line like ecg dude? those
// are continuous straight liness... not alive lines"): while the heart beats, each orbit is drawn as an ECG strip, the line itself moved
// across its own direction by the heart's PQRST: the head of the trail is now, its tail TRACE.seconds ago, so each beat's spike is born
// at the head and travels down the orbit as the film goes on, as a monitor's strip does. The waves are the textbook's (a P bump, the Q
// dip, the R spike, the S dip, the T bump), their intervals shortening with the period as the heart races; ecgAt(t) is the strip's value
// at second t, ecgTrail(t) the 65 samples the sphere draws (warm-sphere.js orbitalSocieties). Outside the window the orbits are their
// smooth selves.
//
// SYNCED: the beat is a pure function of the film's second (heartAt(t)), asked by the sphere at each of its own draws through setPulse, so it
// is the film's clock (and the song's, the film keeps time to it), a pause holds it, a seek lands on the same beat, and it beats at the screen's
// rate, not the film's 29.97 frames (a thump of 35 ms is about one film frame). THE COST: the beats placed once at import (about 160); each
// draw of the sphere asks heartAt once (a search of the beats and two exponentials); no frame callback, no timer, no requestAnimationFrame of
// its own (the sphere draws only while it animates, and nothing at rest). prefers-reduced-motion: the sphere at its size, no beat.
//
//   import {mountHeartbeat} from './heartbeat.js';
//   const heart = mountHeartbeat({film, view});   // the hero's #dl-twelve-film and the page's window (its genesisSphere)
//   heart.at(t) -> the heart at second t; heart.stats; heart.destroy()
// The plan is pure and tested without a browser (heartbeat.test.mjs).
import {KO} from './ko-edge.js';

export const FPS = 30000 / 1001;
export const frameTime = (n) => n / FPS;
const line = (n) => (n - 0.5) / FPS;
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };

export const HEART = Object.freeze({
  from: KO.frames.hit,     // frame 540 (18.018 s): the hit, the first beat
  to: KO.frames.healed,    // frame 1096 (36.570 s): the beam, the heart lets go
  bpm: Object.freeze([72, 156]),   // at the hit, at the beam
  climb: 1.6,              // the rate climbs as u^climb: slowly, then racing
  systole: 0.36,           // seconds x the root of the period: the lub to the dub
  thump: 0.035,            // seconds: a sound reaches its peak in this long, then falls (x/t e^(1 - x/t))
  dub: 0.55,               // the second sound's strength against the first
  strength: Object.freeze([0.6, 1]),   // the beat's strength at the hit and at the beam
  loop: 0.08,              // the orbits' reach on a full lub: this much further out
  size: 0.03,              // the sphere's own thump on a full lub
  swell: 1 / 3,            // the sphere's growth by the beam: a third larger
  exhale: 0.4,             // seconds: back at its own size after the beam
});

const T0 = frameTime(HEART.from), T1 = frameTime(HEART.to), SPAN = T1 - T0;
/** The rate at second t of the window, beats a minute. */
export const bpmAt = (t, heart = HEART) => { const u = clamp((t - T0) / SPAN); return heart.bpm[0] + (heart.bpm[1] - heart.bpm[0]) * u ** heart.climb; };
/** The beats gone by second t, from the hit (the integral of the rate): beat k falls where this reaches k. */
export const phaseAt = (t, heart = HEART) => {
  const u = clamp((t - T0) / SPAN), [a, b] = heart.bpm;
  return (SPAN / 60) * (a * u + ((b - a) * u ** (heart.climb + 1)) / (heart.climb + 1));
};

/** THE BEATS, placed once: [{t, period}] from the hit's frame to the beam, each where the phase reaches its count (solved by bisection). */
export const BEATS = Object.freeze((() => {
  const out = [], last = phaseAt(T1);
  for (let k = 0; k < last; k++) {
    let lo = T0, hi = T1;
    for (let i = 0; i < 48; i++) { const mid = (lo + hi) / 2; if (phaseAt(mid) < k) lo = mid; else hi = mid; }
    const t = k === 0 ? T0 : hi;
    out.push(Object.freeze({t, period: 60 / bpmAt(t)}));
  }
  return out;
})());

const thump = (x, tau) => (x <= 0 ? 0 : (x / tau) * Math.exp(1 - x / tau));

/** THE TRACE: the strip's length in seconds and samples, and each wave as [centre (s from the R, at 72 bpm), width (s), height]. */
export const TRACE = Object.freeze({
  seconds: 1.6, steps: 257,   // four samples a step of the orbit's 65, so the R spike (36 ms) is drawn, not stepped over
  waves: Object.freeze([[-0.16, 0.030, 0.14], [-0.035, 0.012, -0.12], [0, 0.018, 1], [0.035, 0.014, -0.28], [0.24, 0.050, 0.32]]),   // P Q R S T
});
const bump = (x, c, w, a) => a * Math.exp(-0.5 * ((x - c) / w) ** 2);
const REST = 60 / HEART.bpm[0];   // the period the waves are drawn at; shorter periods draw them closer
/** The ECG's value at the film's second t (-0.28 to 1, the R spike 1): the last beat's waves and the next one's P. 0 outside the window. */
export function ecgAt(t, heart = HEART) {
  if (!(t >= line(heart.from) && t < line(heart.to))) return 0;
  let lo = 0, hi = BEATS.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (BEATS[mid].t <= t) lo = mid; else hi = mid - 1; }
  let v = 0;
  for (let k = Math.max(0, lo - 1); k <= Math.min(lo + 1, BEATS.length - 1); k++) {
    const {t: at, period} = BEATS[k], x = t - at, scale = Math.sqrt(period / REST);
    for (const [c, w, a] of heart.trace?.waves ?? TRACE.waves) v += bump(x, c * scale, w * Math.sqrt(scale), a);
  }
  return v;
}
/** The strip the sphere draws: out[i] is the ECG i/(steps-1) of TRACE.seconds ago; out[0] now. One walk from the oldest sample to now,
 *  the beat moving forward as it goes, each wave skipped past four widths (44 us for the 257 samples, warmed, on the M5 Max). */
export function ecgTrail(t, heart = HEART, out = new Float32Array(TRACE.steps)) {
  const n = out.length - 1, span = heart.trace?.seconds ?? TRACE.seconds, waves = heart.trace?.waves ?? TRACE.waves, from = line(heart.from), to = line(heart.to);
  let lo = -1;
  for (let i = n; i >= 0; i--) {
    const s = t - (i / n) * span;
    if (!(s >= from && s < to)) { out[i] = 0; continue; }
    if (lo < 0) { lo = 0; let hi = BEATS.length - 1; while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (BEATS[mid].t <= s) lo = mid; else hi = mid - 1; } }
    else while (lo + 1 < BEATS.length && BEATS[lo + 1].t <= s) lo++;
    let v = 0;
    for (let k = Math.max(0, lo - 1); k <= Math.min(lo + 1, BEATS.length - 1); k++) {
      const {t: at, period} = BEATS[k], x = s - at, scale = Math.sqrt(period / REST), wide = Math.sqrt(scale);
      for (let j = 0; j < waves.length; j++) {
        const c = waves[j][0] * scale, w = waves[j][1] * wide;
        if (Math.abs(x - c) < 4 * w) v += bump(x, c, w, waves[j][2]);
      }
    }
    out[i] = v;
  }
  return out;
}
const TRAIL = new Float32Array(TRACE.steps);   // the one strip, filled at each draw
const OFF = Object.freeze({on: false, bpm: 0, beat: -1, pulse: 0, loop: 1, size: 1, trace: null});

/**
 * The heart at the film's second t: {on, bpm, beat (the last beat's index, -1 before the first), pulse (0..1, the lub-dub's sound now), loop
 * (the orbits' reach, 1 is their own), size (the sphere's, 1 is its own)}. Pure.
 */
export function heartAt(t, heart = HEART, {reduced = false} = {}) {
  if (!Number.isFinite(t)) return OFF;
  if (t >= line(heart.to) && t < line(heart.to) + heart.exhale) {   // the breath out: the swell let go, no beat
    const k = clamp((t - line(heart.to)) / heart.exhale);
    return reduced ? OFF : {on: true, bpm: 0, beat: -1, pulse: 0, loop: 1, size: 1 + heart.swell * (1 - ease(k)), trace: null};
  }
  if (!(t >= line(heart.from) && t < line(heart.to))) return OFF;
  if (reduced) return {on: true, bpm: bpmAt(t, heart), beat: -1, pulse: 0, loop: 1, size: 1, trace: null};
  // the last beat at or before t (a time a hair short of the hit's frame is that frame: the first beat holds from its line)
  let lo = 0, hi = BEATS.length - 1;
  while (lo < hi) { const mid = (lo + hi + 1) >> 1; if (BEATS[mid].t <= t) lo = mid; else hi = mid - 1; }
  const u = clamp((t - T0) / SPAN), strength = heart.strength[0] + (heart.strength[1] - heart.strength[0]) * u;
  let pulse = 0;
  for (let k = Math.max(0, lo - 1); k <= lo; k++) {   // this beat and the one before it (its dub can still be falling)
    const {t: at, period} = BEATS[k], x = Math.max(0, t - at), dub = heart.systole * Math.sqrt(period);
    pulse = Math.max(pulse, thump(x || 1e-9, heart.thump), heart.dub * thump(x - dub, heart.thump));
  }
  pulse = clamp(pulse * strength);
  return {on: true, bpm: bpmAt(t, heart), beat: lo, pulse, loop: 1 + heart.loop * pulse, size: (1 + heart.swell * ease(u)) * (1 + heart.size * pulse),
    trace: ecgTrail(t, heart, TRAIL)};
}

/** Give the page's sphere the heart, asked at every one of its draws at the film's second. Returns {at, stats, destroy}. */
export function mountHeartbeat({film, view, heart = HEART, reduced} = {}) {
  const still = reduced ?? Boolean(view.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  let asked = 0, given = null;
  const fn = () => { asked++; return heartAt(film.currentTime, heart, {reduced: still}); };
  // the sphere may come after the hero's mount: given on the first of the film's events that finds it, and then nothing more is listened to
  const give = () => {
    const sphere = view.genesisSphere;
    if (!sphere?.setPulse || given === sphere) return;
    sphere.setPulse(fn); given = sphere;
    for (const type of ['play', 'timeupdate', 'seeked']) film.removeEventListener(type, give);
  };
  for (const type of ['play', 'timeupdate', 'seeked']) film.addEventListener(type, give);
  give();
  return {
    at: (t) => heartAt(t, heart, {reduced: still}),
    get stats() { return {asked, given: Boolean(given), reduced: still, beats: BEATS.length}; },
    destroy() {
      for (const type of ['play', 'timeupdate', 'seeked']) film.removeEventListener(type, give);
      if (given?.setPulse) given.setPulse(null);
      given = null;
    },
  };
}

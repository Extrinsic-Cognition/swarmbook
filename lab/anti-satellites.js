// anti-satellites.js: DOLBAR'S ATTACK, his swarm charging with him at his border, striking on his blow and pressing on the shield until the one
// who takes it blocks it, for the hero (hero-ab.html). His words, Oct 15 2026 02:2x WEST, over his page during the raid (the sphere with red film
// faces, the gold honeycomb shield round it, the red swarmies scattered outside it doing nothing): "honestly super fucking poor performance on the
// attack... completely uncorrelated to the animation of dolbar dude... like he charges a lot and then does hyper quicck attac from a distancr and
// then the other gguy blocks it". Before it, on this layer: Oct 14 2026 19:37:56 WEST, "see when it becomes red halo when dolbar is charging the
// attack before the dodecahedron explodes in umpact? can you show some anti-unit1satellites... imagine that dolbar is sending signal to attack to
// others and we visually see the shit aligned there"; 21:21, "you gotta be morphofield aware my dude... i would appreciate if the red attackers
// were just like rimworld raiders coming from the borders where dolbar is... assume these aredolbar's swarmies"; 22:2x, "they dont have a shield
// up?"; 23:09, "you keep sending waves from dolbar even after the attack has been sent"; 23:15, "just some futile resistence dude".
//
// THE ATTACK IS DOLBAR'S: every move of the swarm sits on a beat of his animation, the film's own frames (lab/dolbar-beats.js, measured off
// saint-seiya.mp4 by tools/dolbar-beats.mjs; 30000/1001 fps), in his three acts.
// 1. HE CHARGES A LOT: the orb lit in his hand (frame 115, 3.837 s) to the blast let go (frame 251, 8.375 s), through the red flood over him
//    (134, 4.471 s), the cut to Seiya in his pink light (162 to 191) and back to him (192) until the focus lines close on his palm (the red at its
//    height, 980 thousandths, on 245). The swarm comes in from past his border (RimWorld's raiders at the map's edge: the left, where the
//    morpho-field puts him) and MASSES THERE: thirty-six in a column at the stage's edge, level with the sphere. They charge with him: the
//    charge's BUILD (the film's red over the faces' square, lab/dolbar-charge.js, summed from the orb and 1 at the release) draws them tighter
//    (the mass's half-height from 0.36 of the stage to 0.25), their TREMBLE grows with it (to 0.012 of the stage's height, times the red) and
//    their GLOW is the red held (and a red glow round the mass, the same). The film's flow sways them on their places (the field, below). Nothing
//    crosses to the sphere. His SIGNAL runs into them on each rise of his red (the old dashes from past his border), the last before the
//    release. The twelve FEEL IT COMING: the shield rises with the build (up by 75 % of it, the side facing the mass first, closed all round by
//    90 %, so it is whole before the blast), and the twelve fire at the mass, futile (THE RESISTANCE), more as the charge builds.
// 2. HYPER-QUICK ATTACK FROM A DISTANCE: on frame 251, his hand thrust out of the frame in light, the swarm STRIKES AT ONCE, every one from
//    where it stands, all along the blow's one way (the mass to the sphere), a front as wide as the mass: a third of the way on that frame, two
//    thirds on the next, landing on the shield on 254 (three
//    frames, 0.1 s), drawn as streaks behind each and the film's speed lines over the way, never a drift. ONE BLOW: from 254 they stay on the
//    shield, pressing it in, and the blow drives them into it on each beat the film shows: the streaks' flicker (256, 259, 261, 264, 266), the
//    hand of light (267), the flash (286), the sweep over Seiya (290). The cells under them light, a ripple runs from each, the shield flares.
//    No second approach, no wandering; no signal leaves him after the release (his 23:09).
// 3. THE OTHER GUY BLOCKS IT: the blow presses on while the blast pours over Seiya (290 to 315), the press and the shield's light rising: the
//    blow gathering itself; over the three frames before the block it draws back (0.07 of the ring) and the LAST AND BIGGEST BLOW lands on frame
//    319, as the one who takes it stands in it (THE SACRIFICE, lab/sacrifice.js SACRIFICE.first, his cut-out over the stage), presses the shield
//    in to its PEAK on his tag (SACRIFICE.tag, frame 325, 10.844 s: white-gold, the cracks start from under each) and holds to the cut to the hit
//    (frame 331, 11.044 s, the hero's first burst), where the swarm is gone on the cut and the shield SHATTERS outward with the theater's blast
//    (its pieces gone by 11.812 s). No blow after the last.
//
// THE DEFENCE (his 22:2x): the shield is the ring the swarm keeps outside of until it strikes (1.5 x 1.18 sphere radii): two rows of hexagonal
// cells honeycombed round it (the Dyson society's figure: an arrival becomes a hexagon), the outer row's corners on the ring; 96 cells a row at
// the hero's size, 84 on a phone (a cell 0.064 radii, 6 px at least); the page's gold leading (#b28a3e, lit #e5c782) over a pale light fill,
// never opaque; on the raid's canvas, under the swarm. Its light by direction is the threat's (each swarmie spread round the ring as
// e^(5 (cos - 1)), about 26 degrees either way), times its strength, closing all round with the build. THE TWELVE HOLD IT UP: each world off the
// sphere's face gives off a thin tether of light to the two inner cells either side of it, at 45 % while they fire, whole from the release
// (they stop firing and hold it against the blow). A swarmie on it lights the cells under it; each blow sends a ripple through the cells round
// it (10 cells a second, gone in 0.4 s). The strike dents it (0.03 of the ring at the most, deepest under each), the cracks run from the peak,
// and it holds to the cut; then its cells fly out 0.55 to 1 radius as the theater's planes do, turning and fading.
//
// THE RESISTANCE (his 23:15): from the flood until the release the twelve fire at the mass, futile: each swarmie draws their fire on its own
// seeded cadence (1.1 shots a second, times its own pace, 0.6 to 1.4, and the build squared, while it is within reach of their loop), so the
// fire rises as he charges; the world nearest where it was fired at (off the sphere's face, within 3 radii, its line clear of the sphere)
// fires a bolt in the society's gold (#e5c782 over #b28a3e) that reaches it in 4 frames, its dot flaring with a ring opening off it. Four in five
// hit: the swarmie flares, a gold ring opens off it, and it is thrown back along the bolt 0.06 radii (out in 2 frames, back in 10); the rest
// pass beside it and fly on, fading. None falls, the swarm's own path is untouched (the throw is only drawn).
//
// THE MORPHO-FIELD OF THE SCENE (dolbar-field.js, measured off the film by tools/morpho-field.mjs): for every frame of the charge the optical flow
// from the frame before, 20 x 11 cells of 12 px over a 240 x 136 decode; over the blast (6.406 to 8.342 s) the moving cells run +x, from Dolbar
// to Seiya, so DOLBAR'S BORDER IS THE LEFT EDGE. While they mass, the flow under each (the film laid over the stage, its middle on the sphere's
// centre and its height the stage's) pushes it with inertia and a spring draws it back to its place (0.03 of the stage's height at the most):
// the sparks and the zoom on his palm sway the mass. The strike is the blow's own straight line.
//
// All of it is a pure function of the film's frame and the stage (raidFor, shieldFor: worked out once per stage in the page's idle time, the
// raid 216 frames x 36 swarmies x 4 numbers, the shield 239 frames x 192 cells), so a seek lands on the same picture. prefers-reduced-motion: a
// still, the swarm massed at its height and a faint ring, drawn once, no signal, no strike, no bolt, no pieces.
//
// THE COST. A canvas the stage's size, made when the orb lights and emptied when the shield's last piece is gone (11.812 s; 0 x 0 outside);
// one sprite of 96 px a side and one glow of 64, painted once when the page is idle; the field's flow decoded once at import. Inside the window
// each presented film frame draws: one clear; the mass's glow (one drawImage); the tethers; the shield's cells by their light (a path, a fill and
// a stroke a level), its lit cells, its cracks; the twelve's bolts; the signals (one path); the strike's streaks and speed lines (two paths,
// on its four frames and the beats); thirty-six sprites. Outside the window it only answers the film's timeupdate with a comparison; at rest (the
// film paused) nothing at all: no frame callback waiting (in WebKit a waiting requestVideoFrameCallback costs 17 to 24 ms of CPU a second at
// rest, ko-edge.js), no timer, no requestAnimationFrame.
//
//   import {mountAntiSatellites} from './anti-satellites.js';
//   const anti = mountAntiSatellites({stage, film, worlds: () => kick?.worlds ?? []});   // the hero's #sphere-stage and #dl-twelve-film
//   anti.at(t) -> the charge at second t; anti.stats; anti.element (its canvas, which holds the handle as .antiSatellites); anti.destroy()
// The sphere is the page's own (its window's genesisSphere, warm-sphere.js: getViewState().radius, its centre 55 % across and halfway down its
// canvas, the loop at 1.5 radii); the worlds are orbit-kick.js's list of the page's last frame. The canvas goes in right after the stage's last
// canvas, with no z-index of its own: over the drawings, under the page's controls. The plan is pure and tested without a browser
// (anti-satellites.test.mjs): chargeAt(t), blowAt(n), swarmAt(n, geometry), formation(state, geometry), shieldAt(n, geometry) and
// resistanceAt(n, geometry) are functions of the film's second, the measured beats and field and the page's geometry alone.
import {SPHERE_X} from '../app/sphere-centre.mjs';
import {CHARGE} from './dolbar-charge.js';
import {FIELD} from './dolbar-field.js';
import {BEATS} from './dolbar-beats.js';
import {SACRIFICE} from './sacrifice.js';

export const FPS = 30000 / 1001;
/** The second a frame is shown at; a moment's line is half a frame before its frame, so no frame's time sits on a line. */
export const frameTime = (n) => n / FPS;
const line = (n) => (n - 0.5) / FPS;
const frameAt = (t) => Math.floor(t * FPS + 0.5);   // the frame whose half-frame span holds t
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (x) => { x = clamp(x); return x * x * (3 - 2 * x); };
const out2 = (x) => { x = clamp(x); return 1 - (1 - x) * (1 - x); };   // quick to start, slow to arrive
const TAU = Math.PI * 2;
const wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a));

export const ANTI = Object.freeze({
  orb: BEATS.orb,          // frame 115 (3.837 s): the orb lit in his hand; the swarm sets off for his border
  rise: 500,               // thousandths of the faces' square in the halo's red: the frame has become his red halo (frame 134, 4.471 s)
  release: BEATS.release,  // frame 251 (8.375 s): THE BLAST LET GO, his hand thrust out in light: THE STRIKE, all at once
  sent: BEATS.release,     // no signal leaves him from the release (his Oct 14 2026 23:09 WEST: "you keep sending waves from dolbar even after
                           // the attack has been sent"); the ones already running arrive
  cross: 3,                // frames: the strike lands on the shield this many frames after the release (254): "in at most 4 frames"
  pulses: Object.freeze([...BEATS.streaks, BEATS.hand, BEATS.flash, BEATS.sweep]),   // the beats the blow drives them into the shield on
  block: SACRIFICE.first,  // frame 319 (10.644 s): the one who takes it stands in it: the last blow lands (THE SACRIFICE's own frame)
  peak: SACRIFICE.tag,     // frame 325 (10.844 s): his tag: the last blow at its height
  impact: BEATS.hit,       // frame 331 (11.044 s): the cut to the hit landing, the hero's first burst: the swarm gone, the shield shatters
  hold: 0.45,              // seconds: the brightness falls by e in this long when the red drops (a cut away from it holds it)
  signal: Object.freeze({rise: 60, gap: 0.15, travel: 0.55, flare: 0.22}),   // a signal: the red over its held level by 60 thousandths (or
                           // another twelfth of the charge in), at least 0.15 s after the last; it runs from his border to the swarm in
                           // 0.55 s; their flare falls by e in 0.22 s
  aligned: 0.55,           // the share of the charge by which the lines were at their brightest (the first version's; chargeAt's align)
  end: 1.18,               // the shield's ring, in loop radii (the loop is 1.5 sphere radii): outside every world (the lanes reach 1.09)
  count: 36,               // his swarm
  border: 'left',          // Dolbar's border, the edge they come from: the field's measure (above); 'right' mirrors it
  mass: Object.freeze({    // THE MASS at his border
    x: 0.1,                // its centre in from his edge, a share of the stage's width (at most `room` of the way to the shield)
    room: 0.45,
    wide: Object.freeze([0.07, 0.045]),   // its half-width, a share of the stage's width: as they come in, and at the charge's height
    tall: Object.freeze([0.36, 0.25]),    // its half-height, a share of the stage's height: the same
    setOff: 0.8,           // seconds: they set off from past the edge one after another over this long, from the orb
    walk: Object.freeze([0.5, 0.9]),      // seconds each takes to walk in to its place
    tremble: 0.012,        // stage heights: the tremble at the charge's height, times the red (0.4 to 1)
    sway: 0.03,            // stage heights: the most the film's flow sways one off its place
    field: 0.55,           // the share of the picture's motion (the flow under it) a swarmie takes as its own
    spring: 9,             // a second squared: the pull back to its place
    keep: 0.86,            // the share of its sway's speed kept from one film frame to the next
  }),
  raid: Object.freeze({
    press: 0.03,           // ring radii: how far the blow presses the shield in at the last (PRESS 1)
    wind: 0.07,            // ring radii: the blow gathering itself, drawn back over the three frames before the block
    kick: 0.05,            // ring radii: how far a beat drives each one into the shield, at its full power
    power: Object.freeze({land: 1, streak: 0.55, hand: 0.75, flash: 0.85, sweep: 0.6, block: 1}),   // each blow's power
  }),
  shield: Object.freeze({  // THE DEFENCE (see the header)
    cell: 0.064,           // sphere radii: a cell's size (a hexagon's centre to its corner), `least` px at least
    least: 6,
    kernel: 5,             // the threat round the ring: each swarmie spread as e^(5 (cos - 1)), about 26 degrees either way
    saturate: 0.8,         // a direction holds 1 - e^(-D / 0.8) of the shield for a density D
    rise: 0.75,            // the share of the charge's build by which it is up
    close: Object.freeze([0.5, 0.9]),   // the shares of the build between which it closes all round
    margin: 0.06,          // ring radii: a swarmie this near the ring touches it
    ripple: Object.freeze([0.4, 10, 0.07]),   // a blow's ripple: seconds it lasts, cells a second it spreads, seconds it takes to light
    gone: 11.8,            // seconds: the last of its pieces gone, after the burst (11.044 s)
    still: 0.3,            // prefers-reduced-motion: the faint still ring's share of its light
  }),
  resist: Object.freeze({  // THE RESISTANCE (see the header): the twelve fire at the mass until the release
    rate: 1.1,             // shots a second a swarmie draws (times its own pace, 0.6 to 1.4, and the build squared)
    reach: 3,              // sphere radii: a world fires at a swarmie this near it
    hit: 0.8,              // the share of bolts that hit (the rest pass beside it, 1.2 to 2.4 swarmie sizes off, and fly on)
    jolt: 0.06,            // sphere radii: how far a hit throws it back along the bolt (out in 2 frames, back in 10)
  }),
  sphere: 0.2,             // the sphere's radius as a share of the stage's height when the page gives none (warm-sphere.js's view)
  seed: 1988,              // the film's year, as THE CUTS' blocks
});

/** The halo's red at frame n, 0..1 (the measure's frames only; 0 elsewhere). */
export const shareAt = (n) => (n >= CHARGE.from && n < CHARGE.to ? CHARGE.share[n - CHARGE.from] / 1000 : 0);

/** The first frame of his red halo: the first from the orb whose red reaches `rise`. Frame 134 (4.471 s) off the film. */
export const RISE = (() => { for (let n = ANTI.orb; n < ANTI.impact; n++) if (shareAt(n) * 1000 >= ANTI.rise) return n; return ANTI.impact; })();
/** The orb lit in his hand: the window's first frame. Frame 115 (3.837 s). */
export const ORB = ANTI.orb;
/** THE STRIKE: the blast let go, all of them on it. Frame 251 (8.375 s). */
export const RELEASE = ANTI.release;
/** The strike lands on the shield, every one. Frame 254 (8.475 s). */
export const LANDED = RELEASE + ANTI.cross;
/** The beats the blow drives them into the shield on (the streaks' flicker, the hand of light, the flash, the sweep). */
export const PULSES = ANTI.pulses;
/** The last blow lands on the block, as the one who takes it stands in it. Frame 319 (10.644 s). */
export const BLOCK = ANTI.block;
/** The last blow at its height: his tag. Frame 325 (10.844 s). */
export const PEAK = ANTI.peak;
/** The frames the blow draws back over before the block: the blow gathering itself. */
export const WIND = 3;
/** The first frame with nothing of the shield left: its pieces, shattered at the burst, are gone. Frame 354 (11.812 s). */
export const GONE = Math.round(ANTI.shield.gone * FPS);

// THE PLAN, made once at import from the film's measure: for each frame from the orb to the impact its brightness (the red, held), its
// gather (the red summed from the halo, 1 at the impact: the signals' twelfths), its BUILD (the red summed from the orb, 1 at the release)
const SPAN = ANTI.impact - ORB, KEEP = Math.exp(-1 / (FPS * ANTI.hold));
export const LEVEL = Object.freeze(Array.from((() => { const out = new Float64Array(SPAN); for (let i = 0, last = 0; i < SPAN; i++) out[i] = last = Math.max(shareAt(ORB + i), last * KEEP); return out; })()));
const summed = (from, to) => {
  const out = new Float64Array(SPAN);
  let sum = 0;
  for (let n = ORB; n < ORB + SPAN; n++) { if (n >= from && n < to) sum += shareAt(n); out[n - ORB] = sum; }
  return Array.from(out.map((v) => Math.min(1, v / (sum || 1))));
};
export const GATHER = Object.freeze(summed(RISE, ANTI.impact));
export const BUILD = Object.freeze(summed(ORB, RELEASE));
const levelAt = (n) => LEVEL[clamp(n - ORB, 0, SPAN - 1)];
/** The charge's build at frame n: 0 before the orb, the red summed from it, 1 from the release on. */
export const buildAt = (n) => (n < ORB ? 0 : n >= RELEASE ? 1 : BUILD[n - ORB]);

/**
 * The frames a signal goes out on, each with its power 0..1: the halo's first frame; each frame the red rises over what it held (a cut back
 * into the red: the power by the rise); and between them one each time another twelfth of the charge is in (power 0.5). At least `gap` seconds
 * apart, the last before the release.
 */
export const SIGNALS = Object.freeze((() => {
  const out = [{frame: RISE, power: 1}], gap = Math.round(ANTI.signal.gap * FPS), quantum = 1 / 12;
  let since = GATHER[RISE - ORB];
  for (let n = RISE + 1; n < ANTI.impact; n++) {
    const over = shareAt(n) - LEVEL[n - 1 - ORB];
    since += GATHER[n - ORB] - GATHER[n - 1 - ORB];
    if (n >= ANTI.sent) break;   // the attack is sent: no more waves from him
    if (n - out.at(-1).frame < gap) continue;
    if (over * 1000 >= ANTI.signal.rise) out.push({frame: n, power: Math.round(clamp(0.45 + over * 1.5) * 1000) / 1000, why: 'rise'});
    else if (since >= quantum && n < ANTI.impact - gap) out.push({frame: n, power: 0.5, why: 'charge'});
    else continue;
    since = 0;
  }
  out[0].why = 'halo';
  return out.map(Object.freeze);
})());

// THE BLOW, frame by frame from the orb to the impact (a pure function of the frame): its PULSE (0..1: how hard it drives the swarm into the
// shield, on each blow and decaying by e in 1.6 frames; a third of it on the frame before: the swing), its PRESS (0..1 of anti.raid.press of the
// ring: how far the shield is pressed in) and the shield's FLARE (0..1: white-gold)
const BLOWS = Object.freeze([[LANDED, ANTI.raid.power.land], ...BEATS.streaks.map((f) => [f, ANTI.raid.power.streak]), [BEATS.hand, ANTI.raid.power.hand],
  [BEATS.flash, ANTI.raid.power.flash], [BEATS.sweep, ANTI.raid.power.sweep], [BLOCK, ANTI.raid.power.block]].map(Object.freeze));
const swing = (d) => (d === -1 ? 0.35 : d >= 0 ? Math.exp(-d / 1.6) : 0);
const glint = (d) => (d === -1 ? 0.4 : d >= 0 ? Math.exp(-d / 1.5) : 0);   // a blow's flash on the shield: rising over two frames, falling by e in 1.5
const [PULSE, PRESS, FLARE] = (() => {
  const pulse = new Float64Array(SPAN), press = new Float64Array(SPAN), flare = new Float64Array(SPAN), I = ANTI.impact;
  for (let n = ORB; n < I; n++) {
    const k = n - ORB;
    for (const [f, a] of BLOWS) if (f !== BLOCK || n < PEAK) pulse[k] = Math.max(pulse[k], a * swing(n - f));
    const gather = ease((n - BEATS.sweep) / (BLOCK - WIND - BEATS.sweep));   // the blow gathering itself, after the sweep
    if (n < LANDED - 1) press[k] = 0;
    else if (n < LANDED) press[k] = 0.15;   // the shield braces as they near
    else if (n < BLOCK - WIND) press[k] = Math.min(0.85, 0.3 + 0.15 * gather + 0.5 * pulse[k]);
    else if (n < BLOCK) { const u = ease((n - (BLOCK - WIND) + 1) / WIND); press[k] = press[BLOCK - WIND - 1 - ORB] * (1 - u) + 0.06 * u; }
    else if (n <= PEAK) press[k] = 0.45 + 0.45 * ease((n - BLOCK) / (PEAK - BLOCK));
    else press[k] = 0.9 + 0.1 * ease((n - PEAK) / Math.max(1, I - 1 - PEAK));
    if (k) press[k] = Math.min(press[k], press[k - 1] + 0.39);   // a blow dents it over two frames at the most
    if (n < RELEASE) flare[k] = 0;
    else if (n < LANDED) flare[k] = 0.15 * (n - RELEASE + 1);   // the strike coming
    else if (n < BLOCK - WIND) { let f = 0.18 + 0.12 * gather; for (const [b, a] of BLOWS) if (b < BLOCK) f = Math.max(f, a * 0.8 * glint(n - b)); flare[k] = f; }
    else if (n < BLOCK) { const u = ease((n - (BLOCK - WIND) + 1) / WIND); flare[k] = flare[BLOCK - WIND - 1 - ORB] * (1 - u) + 0.36 * u; }
    else if (n <= PEAK) flare[k] = 0.7 + 0.3 * ease((n - BLOCK) / (PEAK - BLOCK));
    else flare[k] = 0.55 + 0.45 * Math.exp(-(n - PEAK) / 4);
  }
  return [pulse, press, flare].map((a) => Object.freeze(Array.from(a)));
})();
/** The blow at frame n: {pulse, press, flare} (all 0 before the orb; the impact's last numbers after it). Pure. */
export function blowAt(n) {
  const k = clamp(Math.round(n) - ORB, 0, SPAN - 1);
  if (!(n >= ORB)) return {pulse: 0, press: 0, flare: 0};
  return {pulse: n < ANTI.impact ? PULSE[k] : 0, press: PRESS[k], flare: FLARE[k]};
}
const flareAt = (n) => (n < ORB ? 0 : n < ANTI.impact ? FLARE[n - ORB] : 0.55 + 0.45 * Math.exp(-(n - PEAK) / 4));

const OFF = Object.freeze({on: false, frame: null, share: 0, level: 0, gather: 0, build: 0, align: 0, woken: false, still: false, signals: Object.freeze([])});

/** What the charge is at the film's second t: {on, frame, share, level, gather, build, align, woken, still, signals: [{frame, age, power}]}. Pure. */
export function chargeAt(t, anti = ANTI, {reduced = false} = {}) {
  if (!(t >= line(ORB) && t < line(anti.impact))) return OFF;
  const n = clamp(frameAt(t), ORB, anti.impact - 1), i = n - ORB, {travel, flare} = anti.signal;
  if (reduced) return {on: true, frame: n, share: shareAt(n), level: LEVEL[i], gather: 1, build: 1, align: 1, woken: true, still: true, signals: []};
  const signals = [];
  for (const s of SIGNALS) {
    if (s.frame > n) break;
    const age = Math.max(0, t - frameTime(s.frame));   // from its frame on (a time written a hair short of the frame's own is that frame)
    if (age < travel + 5 * flare) signals.push({frame: s.frame, age, power: s.power});
  }
  return {on: true, frame: n, share: shareAt(n), level: LEVEL[i], gather: GATHER[i], build: buildAt(n), align: ease(GATHER[i] / anti.aligned), woken: true, still: false, signals};
}

// THE FIELD, decoded once: the flow of every frame of the charge, [vx, vy] px a frame by cell, frame-major then row-major
const FLOW = (() => {
  const s = atob(FIELD.flow), out = new Int8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = (s.charCodeAt(i) << 24) >> 24;
  return out;
})();
const [FW, FH] = FIELD.decode, [COLS, ROWS] = FIELD.grid, [OX, OY] = FIELD.origin, PER = COLS * ROWS * 2;

/**
 * The picture's motion at frame n under the point (fx, fy) of the frame (0..1 across and down): [vx, vy] in px a frame of the decode, read
 * between the four nearest cells' centres (the edge's cells beyond the grid). [0, 0] outside the field's frames and on its cuts. Pure.
 */
export function flowAt(n, fx, fy) {
  const k = n - FIELD.from;
  if (k < 0 || k >= FIELD.to - FIELD.from) return [0, 0];
  const u = clamp((fx * FW - OX) / FIELD.cell - 0.5, 0, COLS - 1), v = clamp((fy * FH - OY) / FIELD.cell - 0.5, 0, ROWS - 1);
  const c0 = Math.min(Math.floor(u), COLS - 2), r0 = Math.min(Math.floor(v), ROWS - 2), a = u - c0, b = v - r0;
  const at = (c, r, j) => FLOW[k * PER + (r * COLS + c) * 2 + j];
  const read = (j) => (at(c0, r0, j) * (1 - a) + at(c0 + 1, r0, j) * a) * (1 - b) + (at(c0, r0 + 1, j) * (1 - a) + at(c0 + 1, r0 + 1, j) * a) * b;
  return [read(0), read(1)];
}

// seeded, the same every run
const rand = (seed) => { let s = seed >>> 0; return () => { s = (s + 0x6d2b79f5) >>> 0; let x = s; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; }; };
// a frame's own noise for one swarmie, 0..1: the tremble (a pure function of the frame, so a seek lands on the same picture)
const noise = (n, i, j) => { let x = Math.imul(n + 1, 374761393) ^ Math.imul(i + 1, 668265263) ^ Math.imul(j + 7, 1274126177); x = Math.imul(x ^ (x >>> 13), 1274126177); return ((x ^ (x >>> 16)) >>> 0) / 4294967296; };
// the strike's way: the share of it the head and the tail of each streak are at, on the release's frame and the next ones to the landing
const HEAD = Object.freeze([0.34, 0.68, 0.92, 1]), TAIL = Object.freeze([0, 0.14, 0.45, 0.8]);

/**
 * THE RAID for one stage, worked out once (memoized: a resize makes another): {pos: for every frame from the orb to the impact and every
 * swarmie [x, y, heading, state] in the stage's css px (state 0 waiting past the border, 1 massing, 2 striking, 3 pressing on the shield, 4 the
 * last blow), from and to (each one's place when it strikes and where it lands on the ring), still (the mass at its height, for reduced motion),
 * mass ([x, y] its centre)}. geometry: {centre: [x, y], radius (the sphere's, px), width, height (the stage's, px)}. Each film frame (dt
 * 1/29.97 s) one that has set off walks in to its place in THE MASS (out-eased), the mass tightening with the build; the field's flow under it
 * sways it, a spring brings it back; it trembles with the build and the red. On the release all strike from where each stands, along the
 * blow's one way (the mass's centre to the sphere's), HEAD of the way a frame, landing on the ring on LANDED; then each stays on the ring where it landed, pressed in by the blow (PRESS)
 * and driven in by each beat (PULSE), draws back over the WIND frames before the block and lands the last blow on it.
 */
const RAIDS = new Map();
export function raidFor({centre: [cx0, cy], radius: r, width: W, height: H}, anti = ANTI) {
  const key = [cx0, cy, r, W, H].map((v) => Math.round(v * 10) / 10).join('|') + (anti === ANTI ? '' : JSON.stringify(anti));
  if (RAIDS.has(key)) return RAIDS.get(key);
  const mirror = anti.border === 'right', cx = mirror ? W - cx0 : cx0;   // worked out with his border on the left; the right mirrors it
  const {mass, raid} = anti, N = anti.count, ring = r * 1.5 * anti.end, dt = 1 / FPS, rnd = rand(anti.seed), aspect = FW / FH, I = anti.impact;
  const pos = new Float32Array((I - ORB) * N * 4), from = new Float32Array(N * 2), to = new Float32Array(N * 2), still = new Float32Array(N * 4);
  // THE MASS: at his border, level with the sphere, never nearer the shield than `room` of the way to it
  const mx = Math.min(mass.x * W, Math.max(0, cx - ring) * mass.room), my = cy;
  const half = (b) => [W * (mass.wide[0] + (mass.wide[1] - mass.wide[0]) * ease(b)), H * (mass.tall[0] + (mass.tall[1] - mass.tall[0]) * ease(b))];
  // their places: a sunflower in the unit disc (each its own share of the mass), seeded and jittered; where they wait, past the edge
  const golden = Math.PI * (3 - Math.sqrt(5)), turn = rnd() * TAU;
  const agents = Array.from({length: N}, (_, i) => {
    const k = Math.sqrt((i + 0.5) / N) * (0.9 + 0.1 * rnd()), a = turn + i * golden + (rnd() - 0.5) * 0.3;
    return {i, ux: k * Math.cos(a), uy: k * Math.sin(a), start: ORB + Math.round(rnd() * mass.setOff * FPS),
      walk: Math.max(1, Math.round((mass.walk[0] + (mass.walk[1] - mass.walk[0]) * rnd()) * FPS)), wait: -(0.04 + 0.08 * rnd()) * H,
      f: [0.7 + 1.1 * rnd(), 1.6 + 2.2 * rnd()], ph: [rnd() * TAU, rnd() * TAU, rnd() * TAU], x: 0, y: 0, sx: 0, sy: 0, vx: 0, vy: 0};
  });
  const [hx1, hy1] = half(1), hy0 = half(0)[1];
  for (const g of agents) {
    const x = mx + g.ux * hx1, y = my + g.uy * hy1;
    still.set([mirror ? W - x : x, y, mirror ? Math.PI - Math.atan2(cy - y, cx - x) : Math.atan2(cy - y, cx - x), 1], g.i * 4);
  }
  const most = mass.sway * H;
  for (let n = ORB; n < I; n++) {
    const t = frameTime(n), b = buildAt(n), lv = levelAt(n), [hx, hy] = half(b), {pulse, press} = blowAt(n);
    if (n === RELEASE) {
      // THE STRIKE: from where each stands on the charge's last frame, all along the blow's one way (the mass's centre to the sphere's), to
      // the ring: a front as wide as the mass (an offset across the way over 0.9 of the ring is drawn in to it)
      const wx = cx - mx, wy = cy - my, wl = Math.hypot(wx, wy) || 1, ux = wx / wl, uy = wy / wl;
      for (const g of agents) {
        const p = clamp((g.x - cx) * -uy + (g.y - cy) * ux, -0.9 * ring, 0.9 * ring), along = Math.sqrt(ring * ring - p * p);
        from[g.i * 2] = g.x; from[g.i * 2 + 1] = g.y; to[g.i * 2] = cx - uy * p - ux * along; to[g.i * 2 + 1] = cy + ux * p - uy * along;
      }
    }
    for (const g of agents) {
      let state = 0, x, y, heading;
      if (n < g.start) { x = g.wait; y = my + g.uy * hy0; heading = 0; }
      else if (n < RELEASE) {
        state = 1;
        // the field: the film's own motion under it sways it (px a frame of the decode, to the stage's px a second), a spring brings it back
        const [fx, fy] = flowAt(n, 0.5 + (g.x - cx) / (H * aspect), 0.5 + (g.y - cy) / H), moved = fx || fy ? 2.5 : 0;
        g.vx = (g.vx + ((fx * (H / FH) * FPS * mass.field - g.vx) * moved - g.sx * mass.spring) * dt) * mass.keep;
        g.vy = (g.vy + ((fy * (H / FH) * FPS * mass.field - g.vy) * moved - g.sy * mass.spring) * dt) * mass.keep;
        g.sx = clamp(g.sx + g.vx * dt, -most, most); g.sy = clamp(g.sy + g.vy * dt, -most, most);
        // walking in to its place, the place tightening with the build; trembling with the build and the red
        const w = out2((n - g.start) / g.walk), px = mx + g.ux * hx, py = my + g.uy * hy, A = mass.tremble * H * b * b * (0.4 + 0.6 * lv);
        x = g.wait + (px - g.wait) * w + g.sx * w + A * (0.6 * Math.sin(TAU * g.f[0] * t + g.ph[0]) + 0.4 * (2 * noise(n, g.i, 0) - 1));
        y = (my + g.uy * hy0) + (py - my - g.uy * hy0) * w + g.sy * w + A * (0.6 * Math.sin(TAU * g.f[1] * t + g.ph[1]) + 0.4 * (2 * noise(n, g.i, 1) - 1));
        heading = Math.atan2(cy - y, cx - x) + 0.3 * b * Math.sin(TAU * g.f[1] * t + g.ph[2]);
      } else {
        const sx = from[g.i * 2], sy = from[g.i * 2 + 1], ax = to[g.i * 2], ay = to[g.i * 2 + 1], th = Math.atan2(ay - cy, ax - cx);
        if (n < LANDED) { state = 2; const u = HEAD[n - RELEASE]; x = sx + (ax - sx) * u; y = sy + (ay - sy) * u; heading = Math.atan2(ay - sy, ax - sx); }
        else {
          state = n >= BLOCK - WIND ? 4 : 3;
          // on the ring where it landed: pressed in by the blow and driven in on each beat; drawn back before the block
          const e = n >= BLOCK - WIND && n < BLOCK ? 1 + raid.wind * ease((n - (BLOCK - WIND) + 1) / WIND) : 1 - raid.press * press - raid.kick * pulse;
          x = cx + Math.cos(th) * ring * e; y = cy + Math.sin(th) * ring * e; heading = th + Math.PI;
        }
      }
      g.x = x; g.y = y;
      const j = ((n - ORB) * N + g.i) * 4;
      pos[j] = mirror ? W - x : x; pos[j + 1] = y; pos[j + 2] = mirror ? Math.PI - heading : heading; pos[j + 3] = state;
    }
  }
  if (mirror) for (let i = 0; i < N; i++) { from[i * 2] = W - from[i * 2]; to[i * 2] = W - to[i * 2]; }
  const plan = Object.freeze({pos, from, to, still, mass: Object.freeze([mirror ? W - mx : mx, my]), ring});
  if (RAIDS.size > 3) RAIDS.delete(RAIDS.keys().next().value);
  RAIDS.set(key, plan);
  return plan;
}

/** The raid at frame n for a stage: [{x, y, heading, state}] by swarmie (state 0 waiting, 1 massing, 2 striking, 3 pressing, 4 the last blow). Pure (memoized). */
export function swarmAt(n, geometry, anti = ANTI) {
  const {pos} = raidFor(geometry, anti), k = clamp(Math.round(n) - ORB, 0, anti.impact - ORB - 1), N = anti.count, out = [];
  for (let i = 0; i < N; i++) { const j = (k * N + i) * 4; out.push({x: pos[j], y: pos[j + 1], heading: pos[j + 2], state: pos[j + 3]}); }
  return out;
}

// THE DEFENCE (see the header): the shield for one stage, worked out once from its raid and kept with it (a WeakMap on the raid's plan: a
// stage the raid forgets, the shield forgets too)
const SHIELDS = new WeakMap();
const CORNER = [[0, 1], [1, 0.5], [1, -0.5], [0, -1], [-1, -0.5], [-1, 0.5]];   // a cell's six corners: [half-steps round, cell sizes out]
// a frame's own numbers, in this order: strength, closure, flare, crack (how far run), crackAlpha, press, fade, age (seconds since the
// burst), tether, lit (the lit share's own light: 1, fading after the burst), any (anything to draw)
const SLOT = 11;

/**
 * THE SHIELD for one stage, worked out once (memoized with its raid; geometry as raidFor's): the ring the swarm keeps outside of until it strikes
 * (1.5 x anti.end sphere radii) as two rows of hexagonal cells, honeycombed, cell c on the c-th half-step round from +x (the outer row on the
 * odd ones, its corners on the ring; the inner on the even ones), K a row (12 x 4 to 12 x 8: 96 at the hero's size, 84 on a phone; a cell
 * anti.shield.cell radii, `least` px at least). For every frame from the orb to GONE: each cell's light (the threat by direction, times the
 * strength) and its lit share (a swarmie's touch and each blow's ripple), 0..255, and the frame's own numbers (SLOT); the cracks from where each
 * lands; each cell's flight when it shatters; the twelve's shots at the mass.
 */
export function shieldFor(geometry, anti = ANTI) {
  const raid = raidFor(geometry, anti), had = SHIELDS.get(raid);
  if (had) return had;
  const {centre: [cx, cy], radius: r} = geometry, N = anti.count, sh = anti.shield, impact = anti.impact, ring = r * 1.5 * anti.end;
  const K = 12 * clamp(Math.round((TAU * ring / Math.max(sh.cell * r, sh.least) - 3 * Math.PI) / Math.sqrt(3) / 12), 4, 8);
  const C = 2 * K, half = Math.PI / K, s = TAU * ring / (Math.sqrt(3) * K + 3 * Math.PI), W = Math.sqrt(3) * s, depth = anti.raid.press * ring;
  const COS = new Float64Array(C), SIN = new Float64Array(C);
  for (let m = 0; m < C; m++) { COS[m] = Math.cos(m * half); SIN[m] = Math.sin(m * half); }
  const round = (m) => ((m % C) + C) % C;
  const at = (n, i, k) => raid.pos[((n - ORB) * N + i) * 4 + k];
  // where each lands (the strike is straight in: its angle round the sphere) and the dent they press, deepest under each, a cell wide
  const landed = Float64Array.from({length: N}, (_, i) => Math.atan2(raid.to[i * 2 + 1] - cy, raid.to[i * 2] - cx));
  const dent = new Float64Array(C);
  for (let m = 0; m < C; m++) for (const a of landed) { const u = wrap(m * half - a) / (2 * half); dent[m] = Math.max(dent[m], Math.exp(-u * u)); }
  const dentAt = (a) => { const f = round(a / half), m = Math.floor(f) % C, k = f - Math.floor(f); return dent[m] * (1 - k) + dent[(m + 1) % C] * k; };
  // the cells: their centres and corners as they stand, and as the strike presses them in at the most
  const centres = new Float32Array(C * 2), pressed = new Float32Array(C * 2), verts = new Float32Array(C * 12), dented = new Float32Array(C * 12);
  for (let c = 0; c < C; c++) {
    const p = ring - (c & 1 ? 0.75 : 2.25) * s, q = p - depth * dent[c];
    centres[c * 2] = cx + p * COS[c]; centres[c * 2 + 1] = cy + p * SIN[c]; pressed[c * 2] = cx + q * COS[c]; pressed[c * 2 + 1] = cy + q * SIN[c];
    for (let j = 0; j < 6; j++) {
      const m = round(c + CORNER[j][0]), e = p + CORNER[j][1] * s, f = e - depth * dent[m], o = c * 12 + j * 2;
      verts[o] = cx + e * COS[m]; verts[o + 1] = cy + e * SIN[m]; dented[o] = cx + f * COS[m]; dented[o + 1] = cy + f * SIN[m];
    }
  }
  // seeded: each cell's flight when it shatters (its way out, how far, its turn), and the cracks
  const rnd = rand(anti.seed + impact), fly = new Float32Array(C * 4);
  for (let c = 0; c < C; c++) {
    const a = c * half + (rnd() - 0.5) * 0.3;
    fly[c * 4] = Math.cos(a); fly[c * 4 + 1] = Math.sin(a); fly[c * 4 + 2] = r * (0.55 + 0.45 * rnd()); fly[c * 4 + 3] = (rnd() - 0.5) * 1.8;
  }
  // the cracks: from where each lands, two running along the shield either way, wandering in across it, and one straight across it; six
  // points each, as it stands and as pressed in
  const P = 6, crack = new Float32Array(N * 3 * P * 4);
  for (let i = 0; i < N; i++) for (let b = 0; b < 3; b++) {
    const span = (0.5 + 0.4 * rnd()) * TAU / N;
    let e = ring - 0.2 * s;
    for (let p = 0; p < P; p++) {
      let a = landed[i];
      if (b < 2) {
        a += (b ? -1 : 1) * span * (p / (P - 1)) + (p ? (rnd() - 0.5) * 0.6 * half : 0);
        if (p) e = clamp(e - s * (0.2 + 0.9 * (rnd() - 0.3)), ring - 2.9 * s, ring - 0.3 * s);
      } else { a += p ? (rnd() - 0.5) * 1.2 * half : 0; e = ring - s * (0.2 + 2.9 * (p / (P - 1))); }
      const f = e - depth * dentAt(a), o = ((i * 3 + b) * P + p) * 4;
      crack[o] = cx + e * Math.cos(a); crack[o + 1] = cy + e * Math.sin(a); crack[o + 2] = cx + f * Math.cos(a); crack[o + 3] = cy + f * Math.sin(a);
    }
  }
  // frame by frame, read off the raid
  const F = GONE - ORB, level = new Uint8Array(F * C), glow = new Uint8Array(F * C), glob = new Float32Array(F * SLOT);
  const ang = new Float64Array(N), gap = new Float64Array(N), L = new Float64Array(C), lit = new Float64Array(C);
  // THE RESISTANCE's schedule: from the flood each massed swarmie draws the twelve's fire on its own seeded cadence (a phase that turns faster
  // as the charge builds: the build squared) while it is within reach of their loop, until the release, when they stop and hold the shield up.
  // Each shot: its frame, its target, a hit or a miss (and which side, how far)
  const rz = anti.resist, aim = rand(anti.seed + 1101), shots = [], loop = r * (1.5 * 1.09 + rz.reach);
  const phase = Float64Array.from({length: N}, () => aim()), pace = Float64Array.from({length: N}, () => 0.6 + 0.8 * aim());
  const DIRS = C / 4, D = new Float64Array(DIRS);   // the threat is read every fourth half-step (7.5 degrees at 96 a row) and between them in a line
  const hits = [], margin = sh.margin * ring, [life, speed, attack] = sh.ripple;
  // the kernel e^(kernel (k - 1)) read off a table for k (the cosine between two directions) from -0.4 (under e^-7: left out) to 1
  const KERN = 512, kern = new Float64Array(KERN + 2);
  for (let q = 0; q <= KERN + 1; q++) kern[q] = Math.exp(sh.kernel * (-1.4 + 1.4 * q / KERN));
  for (let n = ORB; n < impact; n++) {
    const row = (n - ORB) * C, b = buildAt(n), {flare, press} = blowAt(n);
    for (let i = 0; i < N; i++) {
      const x = at(n, i, 0) - cx, y = at(n, i, 1) - cy, d = Math.sqrt(x * x + y * y), on = at(n, i, 3) > 0;
      ang[i] = Math.atan2(y, x); gap[i] = on ? d - ring : Infinity;
      // the twelve's fire at it, from the flood to the release
      if (at(n, i, 3) === 1 && n >= RISE && n < RELEASE) {
        phase[i] += rz.rate * pace[i] * b * b * ease((loop - d) / (0.25 * r)) / FPS;
        if (phase[i] >= 1) {
          phase[i] = clamp(phase[i] - 1 + (aim() - 0.5) * 0.4, -0.5, 0.9);
          shots.push(n, i, aim() < rz.hit ? 1 : 0, (aim() < 0.5 ? -1 : 1) * (1.2 + 1.2 * aim()));
        }
      }
    }
    // each blow's ripple: the landing and the block from under every one, a beat from under a third of them in turn
    BLOWS.forEach(([f, a], k) => { if (f === n) for (let i = 0; i < N; i++) if (f === LANDED || f === BLOCK || i % 3 === k % 3) hits.push(n, landed[i], (f === LANDED || f === BLOCK ? 0.9 : 0.6) * a); });
    // its strength and closure: the charge's build (the twelve feel it coming)
    const strength = ease(b / sh.rise), closure = ease((b - sh.close[0]) / (sh.close[1] - sh.close[0]));
    // the threat by direction: each swarmie that has set off, spread round the ring
    D.fill(0);
    for (let i = 0; i < N; i++) {
      if (!(at(n, i, 3) > 0)) continue;
      const ca = Math.cos(ang[i]), sa = Math.sin(ang[i]);
      for (let d = 0; d < DIRS; d++) {
        const k = COS[d * 4] * ca + SIN[d * 4] * sa;
        if (k > -0.4) { const f = (k + 0.4) * (KERN / 1.4), q = f | 0; D[d] += kern[q] + (kern[q + 1] - kern[q]) * (f - q); }
      }
    }
    let any = 0;
    for (let c = 0; c < C; c++) {
      const d = c >> 2, t = (c & 3) / 4, local = 1 - Math.exp(-(D[d] * (1 - t) + D[(d + 1) % DIRS] * t) / sh.saturate);
      const v = Math.round(255 * strength * (local + closure - local * closure));
      level[row + c] = v; any |= v;
    }
    // its lit share: under each swarmie touching it, and the ripples the blows send through the cells round them
    L.fill(0);
    for (let i = 0; i < N; i++) {
      if (!(gap[i] < margin)) continue;
      const k = 0.8 * ease(1 - gap[i] / margin), Px = cx + ring * Math.cos(ang[i]), Py = cy + ring * Math.sin(ang[i]), mc = Math.round(ang[i] / half);
      for (let q = -6; q <= 6; q++) { const c = round(mc + q), ex = centres[c * 2] - Px, ey = centres[c * 2 + 1] - Py; L[c] += k * Math.exp(-(ex * ex + ey * ey) / (0.6 * W * W)); }
    }
    for (let h = 0; h < hits.length; h += 3) {
      const age = (n - hits[h]) / FPS;
      if (age < 0 || age >= life) continue;
      const A = hits[h + 2] * ease(age / attack) * (1 - ease(age / life)), th = hits[h + 1], front = speed * age;
      if (!(A > 0)) continue;
      const Px = cx + ring * Math.cos(th), Py = cy + ring * Math.sin(th), mc = Math.round(th / half), R = 2 * Math.ceil(speed * life + 3);
      for (let q = -R; q <= R; q++) {
        const c = round(mc + q), ex = centres[c * 2] - Px, ey = centres[c * 2 + 1] - Py, e = Math.sqrt(ex * ex + ey * ey) / W - front;
        L[c] += A * Math.exp(-e * e / 0.56);
      }
    }
    // eased in and out over a few frames: no cell lights or goes dark at once
    for (let c = 0; c < C; c++) {
      const to = clamp(L[c]);
      lit[c] += (to - lit[c]) * (to > lit[c] ? 0.35 : 0.25);
      const v = Math.round(255 * lit[c]); glow[row + c] = v; any |= v;
    }
    // the cracks run from the peak to the impact; the tethers under half while the twelve fire, whole from the release (they hold it up)
    const u = n >= PEAK ? ease((n - PEAK) / Math.max(1, impact - 1 - PEAK)) : 0;
    const tether = Math.min(1, strength * (1 + 0.5 * flare)) * (0.45 + 0.55 * ease((n - RELEASE + 1) / 4));
    glob.set([strength, closure, flare, u, 1, press, 1, -1, tether, 1, any ? 1 : 0], (n - ORB) * SLOT);
  }
  // the burst: it shatters, a white-gold flash with the theater's, its pieces fly out and are gone by `gone`; the cracks (left where the
  // shield stood) go in 0.13 s, the lit share and the tethers in 0.2 s
  const last = (impact - 1 - ORB) * SLOT, span = sh.gone - frameTime(impact);
  for (let n = impact; n < GONE; n++) {
    const age = (n - impact) / FPS, fade = 1 - ease(age / span), go = 1 - ease(age / 0.2);
    const flare = Math.max(flareAt(n) * go, ease(age / 0.1) * (1 - ease((age - 0.1) / 0.45)));
    glob.set([glob[last], 1, flare, 1, 1 - ease(age / 0.13), 1, fade, age, glob[last + 8] * go, go, fade > 0 ? 1 : 0], (n - ORB) * SLOT);
  }
  const plan = Object.freeze({centre: Object.freeze([cx, cy]), radius: r, ring, cell: s, K, cells: C, half, inner: ring - 2.25 * s, impact, still: sh.still,
    centres, pressed, verts, dented, fly, crack, crackPoints: P, level, glow, glob, hits: Float32Array.from(hits), shots: Float32Array.from(shots)});
  SHIELDS.set(raid, plan);
  return plan;
}

// the shield at a frame, written into a held set of arrays (no garbage a frame): what shieldAt returns and what the layer draws
const blank = (plan) => ({on: false, frame: null, still: false, strength: 0, closure: 0, flare: 0, crack: 0, crackAlpha: 0, press: 0, fade: 0, age: -1, tether: 0,
  level: new Float32Array(plan.cells), glow: new Float32Array(plan.cells), centres: new Float32Array(plan.cells * 2), verts: new Float32Array(plan.cells * 12),
  cracks: new Float32Array(plan.crack.length / 2), crackLines: new Uint8Array(plan.crack.length / (plan.crackPoints * 4)), crackCount: 0});
function shieldInto(plan, n, out, still = false) {
  const C = plan.cells;
  out.frame = n; out.still = still; out.crackCount = 0; out.crackLines.fill(0);
  if (still || !(n >= ORB && n < GONE)) {
    // prefers-reduced-motion: a faint still ring, as it stands; outside its frames, nothing
    const k = still ? plan.still : 0;
    out.on = still; out.strength = k; out.closure = still ? 1 : 0; out.flare = 0; out.crack = 0; out.crackAlpha = 0; out.press = 0;
    out.fade = still ? 1 : 0; out.age = -1; out.tether = 0;
    out.level.fill(k); out.glow.fill(0); out.centres.set(plan.centres); out.verts.set(plan.verts);
    return out;
  }
  const o = (n - ORB) * SLOT, G = plan.glob;
  out.strength = G[o]; out.closure = G[o + 1]; out.flare = G[o + 2]; out.crack = G[o + 3]; out.crackAlpha = G[o + 4]; out.press = G[o + 5];
  out.fade = G[o + 6]; out.age = G[o + 7]; out.tether = G[o + 8]; out.on = G[o + 10] > 0;
  // after the burst the pieces keep the light and the lit share the cells had on the last frame before it (the lit share fading)
  const lit = G[o + 9] / 255, row = (Math.min(n, plan.impact - 1) - ORB) * C;
  for (let c = 0; c < C; c++) { out.level[c] = plan.level[row + c] / 255; out.glow[c] = plan.glow[row + c] * lit; }
  const {centres, pressed, verts, dented, fly} = plan, p = out.press;
  if (out.age >= 0) {
    // shattered: each cell a piece flying out from where the strike left it, at once and slowing as the theater's planes go, turning, shrinking
    const k = 1 - Math.exp(-out.age / 0.2) + 0.2 * out.age, scale = 1 - 0.3 * Math.min(1, k);
    for (let c = 0; c < C; c++) {
      const f = c * 4, x0 = pressed[c * 2], y0 = pressed[c * 2 + 1], x = x0 + fly[f] * fly[f + 2] * k, y = y0 + fly[f + 1] * fly[f + 2] * k;
      const ca = Math.cos(fly[f + 3] * k) * scale, sa = Math.sin(fly[f + 3] * k) * scale;
      out.centres[c * 2] = x; out.centres[c * 2 + 1] = y;
      for (let j = c * 12; j < c * 12 + 12; j += 2) { const vx = dented[j] - x0, vy = dented[j + 1] - y0; out.verts[j] = x + vx * ca - vy * sa; out.verts[j + 1] = y + vx * sa + vy * ca; }
    }
  } else if (p > 0) {
    for (let j = 0; j < C * 12; j++) out.verts[j] = verts[j] + (dented[j] - verts[j]) * p;
    for (let j = 0; j < C * 2; j++) out.centres[j] = centres[j] + (pressed[j] - centres[j]) * p;
  } else { out.verts.set(verts); out.centres.set(centres); }
  // the cracks, run as far as they have: each a line of points (as pressed in), its last one partway
  if (out.crack > 0 && out.crackAlpha > 0) {
    const P = plan.crackPoints, cr = plan.crack, reach = out.crack * (P - 1), whole = Math.min(P - 1, Math.floor(reach)), part = reach - whole;
    const point = (b, q, k) => { const a = (b * P + q) * 4; out.cracks[(b * P + k) * 2] = cr[a] + (cr[a + 2] - cr[a]) * p; out.cracks[(b * P + k) * 2 + 1] = cr[a + 1] + (cr[a + 3] - cr[a + 1]) * p; };
    for (let b = 0; b < out.crackLines.length; b++) {
      for (let q = 0; q <= whole; q++) point(b, q, q);
      let k = whole + 1;
      if (part > 1e-6 && k < P) {
        point(b, k, k);
        const o = (b * P + whole) * 2;
        out.cracks[o + 2] = out.cracks[o] + (out.cracks[o + 2] - out.cracks[o]) * part; out.cracks[o + 3] = out.cracks[o + 1] + (out.cracks[o + 3] - out.cracks[o + 1]) * part;
        k++;
      }
      out.crackLines[b] = k; out.crackCount += k - 1;
    }
  }
  return out;
}

/**
 * THE SHIELD at frame n for a stage (see the header): {on (anything to draw), frame, strength (0..1: the charge's build, eased), closure (0..1:
 * all round), flare (0..1: white-gold), crack (0..1: how far the cracks have run), crackAlpha, press (0..1), fade (its pieces' share of their
 * light), age (seconds since the burst, -1 before it), tether (the twelve's tethers' light), level and glow (each cell's light and lit share,
 * 0..1), centres and verts (each cell's centre and six corners in css px: as they stand, pressed in, or flying), cracks (each crack's points,
 * [x, y] x crackPoints a crack, crackLines[b] of them run so far) and crackCount (the segments run, all of them)}. reduced: a faint still ring.
 * A pure function of the frame and the stage (memoized per stage).
 */
export function shieldAt(n, geometry, anti = ANTI, {reduced = false} = {}) {
  const plan = shieldFor(geometry, anti);
  return shieldInto(plan, Math.round(n), blank(plan), reduced);
}

// THE RESISTANCE at a frame, written into held arrays (no garbage a frame): a shot lives LIFE frames from its own (its bolt flies FLIGHT of
// them, its hit jolts the swarmie for the rest)
const FLIGHT = 4, LIFE = FLIGHT + 12, MOST = 96;
const resistBlank = (N) => ({frame: null, shots: 0, hits: 0, misses: 0, bolts: new Float32Array(MOST * 5), boltCount: 0,
  flashes: new Float32Array(MOST * 4), flashCount: 0, rings: new Float32Array(MOST * 4), ringCount: 0, kick: new Float32Array(N * 3)});
// whether the segment (x0, y0) to (x1, y1) comes within `r` of (cx, cy)
const crosses = (x0, y0, x1, y1, cx, cy, r) => {
  const dx = x1 - x0, dy = y1 - y0, len = dx * dx + dy * dy, k = len > 0 ? clamp(((cx - x0) * dx + (cy - y0) * dy) / len) : 0;
  const px = x0 + dx * k - cx, py = y0 + dy * k - cy;
  return px * px + py * py < r * r;
};
function resistInto(plan, raid, n, worlds, out, anti = ANTI, still = false) {
  const N = anti.count, pos = raid.pos;
  out.frame = n; out.shots = out.hits = out.misses = out.boltCount = out.flashCount = out.ringCount = 0; out.kick.fill(0);
  if (still || !(n >= ORB && n < RELEASE) || !worlds?.length) return out;   // from the release the blow overtakes their fire
  const S = plan.shots, count = S.length / 4, [cx, cy] = plan.centre, r = plan.radius, size = r * 0.075, reach = anti.resist.reach * r, J = anti.resist.jolt * r;
  let k = 0, lo = 0, hi = count;   // the first shot still alive (the list is in frame order)
  while (lo < hi) { const mid = (lo + hi) >> 1; if (S[mid * 4] <= n - LIFE) lo = mid + 1; else hi = mid; }
  for (k = lo; k < count && S[k * 4] <= n; k++) {
    const f = S[k * 4], i = S[k * 4 + 1], hit = S[k * 4 + 2] > 0, side = S[k * 4 + 3], age = n - f, held = Math.min(1, age / FLIGHT);
    const j0 = ((f - ORB) * N + i) * 4, jn = ((n - ORB) * N + i) * 4, fx = pos[j0], fy = pos[j0 + 1], tx = pos[jn], ty = pos[jn + 1];
    // its world: the one nearest where it was fired at, within reach, off the sphere's face (no bolt across the film; a little looser once
    // fired, so a world drifting does not drop a shot it has fired), its line clear of the sphere
    let w = -1, best = Infinity;
    for (let q = 0; q < worlds.length; q++) {
      const x = worlds[q]?.[0], y = worlds[q]?.[1];
      if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
      const ex = x - cx, ey = y - cy, d = Math.sqrt((x - fx) * (x - fx) + (y - fy) * (y - fy));
      if (ex * ex + ey * ey < (r * (1.05 - 0.1 * held)) ** 2 || d > reach * (1 + 0.5 * held) || d >= best) continue;
      if (crosses(x, y, tx, ty, cx, cy, r * 1.02)) continue;
      w = q; best = d;
    }
    if (w < 0) continue;
    out.shots++;
    const ox = worlds[w][0], oy = worlds[w][1], L = Math.sqrt((tx - ox) * (tx - ox) + (ty - oy) * (ty - oy)) || 1, ax = (tx - ox) / L, ay = (ty - oy) / L;
    // the bolt: a streak out of the world, its head on the swarmie on its FLIGHT-th frame and gone after it; a miss passes beside it and
    // flies on, fading
    const px = hit ? tx : tx - ay * side * size, py = hit ? ty : ty + ax * side * size, h = (age + 1) / FLIGHT;
    if (hit) out.hits++; else out.misses++;
    if (h <= (hit ? 1.25 : 1.4) && out.boltCount < MOST) {
      const head = Math.min(h, hit ? 1 : 1.4), tail = Math.max(0, h - 0.5), o = out.boltCount++ * 5;
      out.bolts[o] = ox + (px - ox) * tail; out.bolts[o + 1] = oy + (py - oy) * tail; out.bolts[o + 2] = ox + (px - ox) * head; out.bolts[o + 3] = oy + (py - oy) * head;
      out.bolts[o + 4] = hit ? 1 : 1 - clamp((h - 1) / 0.4);
    }
    // the muzzle flash: the world's dot flares and a ring opens off it
    if (age < 5 && out.flashCount < MOST) {
      const o = out.flashCount++ * 4;
      out.flashes[o] = ox; out.flashes[o + 1] = oy; out.flashes[o + 2] = age; out.flashes[o + 3] = Number.isFinite(worlds[w][2]) ? worlds[w][2] : 1.8;
    }
    // the hit: the swarmie flares, a ring off it, and it is thrown back along the bolt (out in 2 frames, back in 10), then comes on again
    const since = age - (FLIGHT - 1);
    if (hit && since >= 0) {
      const jolt = since < 2 ? ease((since + 1) / 2) : 1 - ease((since - 1) / 10), lit = since === 0 ? 0.6 : 1 - ease((since - 1) / 9);
      out.kick[i * 3] += ax * J * jolt; out.kick[i * 3 + 1] += ay * J * jolt; out.kick[i * 3 + 2] = Math.max(out.kick[i * 3 + 2], lit);
      if (since < 6 && out.ringCount < MOST) { const o = out.ringCount++ * 4; out.rings[o] = i; out.rings[o + 2] = since; out.rings[o + 3] = size; }
    }
  }
  // the hit's ring goes round the swarmie where it is drawn (thrown back)
  for (let q = 0; q < out.ringCount; q++) {
    const o = q * 4, i = out.rings[o], j = ((n - ORB) * N + i) * 4;
    out.rings[o] = pos[j] + out.kick[i * 3]; out.rings[o + 1] = pos[j + 1] + out.kick[i * 3 + 1];
  }
  return out;
}

/**
 * THE RESISTANCE at frame n for a stage (see the header): the twelve fire at the mass until the release. {frame, shots (alive and fired by a
 * world), hits, misses, bolts ([x0, y0, x1, y1, alpha] x boltCount: tail and head), flashes ([x, y, frames since, the world's dot radius] x
 * flashCount), rings ([x, y, frames since, the swarmie's size] x ringCount: the hits), kick ([dx, dy, flare] a swarmie, by its index in the
 * raid: a drawn offset back along the bolt, the raid's own path untouched)}. geometry: as formation's, its worlds the shooters ([x, y, r]).
 * reduced: nothing. A pure function of the frame and the stage.
 */
export function resistanceAt(n, geometry, anti = ANTI, {reduced = false} = {}) {
  const plan = shieldFor(geometry, anti), worlds = (geometry.worlds ?? []).map((p) => (Array.isArray(p) ? p : [p?.x, p?.y, p?.r]));
  return resistInto(plan, raidFor(geometry, anti), Math.round(n), worlds, resistBlank(anti.count), anti, reduced);
}

// THE RESISTANCE drawn (css px): the bolts in the society's gold (#e5c782 over #b28a3e, the misses fading), the muzzle flashes by their
// age; the hits' rings go on after the swarm (paintHits). A handful of strokes a frame
function paintResistance(g, rz) {
  for (let pass = 0; pass < 2; pass++) {
    const faint = pass === 1;
    let drawn = 0;
    for (let b = 0; b < rz.boltCount; b++) {
      const o = b * 5;
      if ((rz.bolts[o + 4] < 0.66) !== faint || rz.bolts[o + 4] <= 0) continue;
      if (!drawn++) g.beginPath();
      g.moveTo(rz.bolts[o], rz.bolts[o + 1]); g.lineTo(rz.bolts[o + 2], rz.bolts[o + 3]);
    }
    if (!drawn) continue;
    const k = faint ? 0.45 : 1;
    g.globalAlpha = 0.6 * k; g.strokeStyle = '#b28a3e'; g.lineWidth = 2.8; g.stroke();
    g.globalAlpha = k; g.strokeStyle = '#e5c782'; g.lineWidth = 1.3; g.stroke();
  }
  for (let age = 0; age < 5; age++) {
    let drawn = 0;
    for (let q = 0; q < rz.flashCount; q++) {
      const o = q * 4;
      if (rz.flashes[o + 2] !== age) continue;
      if (!drawn++) g.beginPath();
      const rad = rz.flashes[o + 3] * (1.6 + 3.4 * age / 5);
      g.moveTo(rz.flashes[o] + rad, rz.flashes[o + 1]); g.arc(rz.flashes[o], rz.flashes[o + 1], rad, 0, TAU);
    }
    if (!drawn) continue;
    const u = age / 5;
    g.globalAlpha = (1 - u) * (1 - u); g.strokeStyle = '#b28a3e'; g.lineWidth = 1.2; g.stroke();
    if (age < 2) { g.globalAlpha = 1 - age * 0.45; g.fillStyle = '#e5c782'; g.fill(); }   // the dot itself flares
  }
}
function paintHits(g, rz) {
  for (let since = 0; since < 6; since++) {
    let drawn = 0;
    for (let q = 0; q < rz.ringCount; q++) {
      const o = q * 4;
      if (rz.rings[o + 2] !== since) continue;
      if (!drawn++) g.beginPath();
      const rad = rz.rings[o + 3] * (0.5 + 0.9 * since / 6);
      g.moveTo(rz.rings[o] + rad, rz.rings[o + 1]); g.arc(rz.rings[o], rz.rings[o + 1], rad, 0, TAU);
    }
    if (!drawn) continue;
    const u = since / 6;
    g.globalAlpha = (1 - u) * (1 - u); g.strokeStyle = '#e5c782'; g.lineWidth = 1.6; g.stroke();
  }
}

// THE SHIELD drawn (css px, the layer's transform set): the cells sorted by their light into a few levels, one path, one fill and one stroke
// a level (scratch lists, no garbage a frame)
const HEAD_ = new Int32Array(32), NEXT = new Int32Array(1024), TIE = new Uint8Array(64);
const sortCells = (values, n, Q) => { HEAD_.fill(-1, 0, Q + 1); for (let c = 0; c < n; c++) { const q = Math.round(values[c] * Q); if (q > 0) { NEXT[c] = HEAD_[q]; HEAD_[q] = c; } } };
const traceCells = (g, verts, first) => {
  let count = 0;
  for (let c = first; c >= 0; c = NEXT[c], count++) {
    const o = c * 12;
    g.moveTo(verts[o], verts[o + 1]);
    for (let j = o + 2; j < o + 12; j += 2) g.lineTo(verts[j], verts[j + 1]);
    g.closePath();
  }
  return count;
};
const tone = (a, b, k) => `rgb(${Math.round(a[0] + (b[0] - a[0]) * k)},${Math.round(a[1] + (b[1] - a[1]) * k)},${Math.round(a[2] + (b[2] - a[2]) * k)})`;
const PALE = [251, 243, 220], WHITE_GOLD = [255, 240, 200], LEAD = [178, 138, 62], LIT = [229, 199, 130];   // the leading #b28a3e, lit #e5c782

// the twelve hold it up: from each world a tether of light to the centres of the two inner cells either side of it, outward; a world over
// the sphere's face lets it go (from 1.14 radii in to 1.02: no line across the film), and one right under the shield holds it already.
// Returns how many worlds tie.
function paintTethers(g, sh, plan, worlds) {
  const n = Math.min(worlds?.length ?? 0, TIE.length);
  if (!(sh.tether > 0) || !n) return 0;
  const [cx, cy] = plan.centre, r = plan.radius, C = plan.cells, Q = 6;
  let tied = 0;
  for (let w = 0; w < n; w++) {
    const x = worlds[w]?.[0], y = worlds[w]?.[1];
    TIE[w] = 0;
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    const d = Math.hypot(x - cx, y - cy), k = sh.tether * ease((d - r * 1.02) / (r * 0.12)) * (1 - ease((d - plan.inner + r * 0.1) / (r * 0.06)));
    TIE[w] = Math.round(clamp(k) * Q);
    if (TIE[w]) tied++;
  }
  for (let q = Q; q >= 1 && tied; q--) {
    let drawn = 0;
    for (let w = 0; w < n; w++) {
      if (TIE[w] !== q) continue;
      if (!drawn++) g.beginPath();
      const x = worlds[w][0], y = worlds[w][1], m = 2 * Math.floor((((Math.atan2(y - cy, x - cx) / plan.half) % C) + C) % C / 2), m2 = (m + 2) % C;
      g.moveTo(x, y); g.lineTo(sh.centres[m * 2], sh.centres[m * 2 + 1]);
      g.moveTo(x, y); g.lineTo(sh.centres[m2 * 2], sh.centres[m2 * 2 + 1]);
    }
    if (!drawn) continue;
    g.globalAlpha = 0.42 * q / Q; g.strokeStyle = '#e5c782'; g.lineWidth = 2.4; g.stroke();
    g.globalAlpha = 0.75 * q / Q; g.strokeStyle = '#b28a3e'; g.lineWidth = 0.7; g.stroke();
  }
  return tied;
}

// the cells by their light (the gold leading over a pale light fill, never opaque; white-gold as it flares), the lit ones, the cracks.
// Returns how many cells it drew.
function paintShield(g, sh) {
  const C = sh.level.length, f = clamp(sh.flare), Q = 20;
  let drawn = 0;
  if (sh.fade > 0) {
    const fill = tone(PALE, WHITE_GOLD, f), lead = tone(LEAD, LIT, f);
    sortCells(sh.level, C, Q);
    for (let q = Q; q >= 1; q--) {
      if (HEAD_[q] < 0) continue;
      const k = (q / Q) * sh.fade;
      g.beginPath(); drawn += traceCells(g, sh.verts, HEAD_[q]);
      g.globalAlpha = k * (0.16 + 0.24 * f); g.fillStyle = fill; g.fill();
      if (f > 0.03) { g.globalAlpha = k * 0.34 * f; g.strokeStyle = '#f1d48a'; g.lineWidth = 2.4 + 2.2 * f; g.stroke(); }
      g.globalAlpha = k * (0.6 + 0.3 * f); g.strokeStyle = lead; g.lineWidth = 0.8 + 0.5 * f; g.stroke();
    }
    // the lit ones: a swarmie's touch and the ripples the blows send
    sortCells(sh.glow, C, 12);
    for (let q = 12; q >= 1; q--) {
      if (HEAD_[q] < 0) continue;
      g.beginPath(); traceCells(g, sh.verts, HEAD_[q]);
      g.globalAlpha = 0.42 * q / 12; g.fillStyle = 'rgb(255,238,190)'; g.fill();
      g.globalAlpha = 0.85 * q / 12; g.strokeStyle = '#e5c782'; g.lineWidth = 2; g.stroke();
    }
  }
  if (sh.crackCount > 0 && sh.crackAlpha > 0) {
    const P = sh.cracks.length / 2 / sh.crackLines.length;
    g.beginPath();
    for (let b = 0; b < sh.crackLines.length; b++) {
      const k = sh.crackLines[b], o = b * P * 2;
      if (k < 2) continue;
      g.moveTo(sh.cracks[o], sh.cracks[o + 1]);
      for (let q = 1; q < k; q++) g.lineTo(sh.cracks[o + q * 2], sh.cracks[o + q * 2 + 1]);
    }
    g.globalAlpha = 0.85 * sh.crackAlpha; g.strokeStyle = '#b28a3e'; g.lineWidth = 1.8; g.stroke();
    g.globalAlpha = sh.crackAlpha; g.strokeStyle = 'rgb(255,252,240)'; g.lineWidth = 0.7; g.stroke();
  }
  return drawn;
}

// the speed lines over the strike's way: seeded, each [its place across the band, -1..1; its length, a share of the way; where it starts]
const SPEED = Object.freeze(Array.from({length: 22}, (_, i) => { const r = rand(ANTI.seed + 77 + i); return Object.freeze([r() * 2 - 1, 0.6 + 0.5 * r(), r()]); }));

/**
 * Where everything is at a state of chargeAt: {antis: [{x, y, angle, size, alpha, flare, i (its index in the raid)}], dashes: [[x0, y0, x1, y1,
 * alpha]...] (Dolbar's signals), streaks: [[x0, y0, x1, y1, alpha]...] (the strike's and each blow's), speed: [[x0, y0, x1, y1]...] (the speed
 * lines, speedAlpha), glow: {x, y, rx, ry, alpha} or null (the mass's red glow)}. geometry: {centre: [x, y], radius (the sphere's, px), width and
 * height (the stage's, px; when left out, a stage of 5.5 x 5 radii round the centre), worlds}. Dolbar's signals run from past his border, level
 * with the sphere, to each one massing; the strike's streaks run from where each stood (its tail TAIL of the way, its head HEAD) on the release
 * and the frames to the landing; on each beat a short streak behind each one driven into the shield. With the state still (reduced motion)
 * the mass stands at its height. Pure.
 */
export function formation(state, {centre, radius: r, width, height}, anti = ANTI) {
  const out = {antis: [], dashes: [], streaks: [], speed: [], speedAlpha: 0, glow: null};
  if (!state?.on || !(r > 0)) return out;
  const [cx, cy] = centre, H = height > 0 ? height : r * 5, W = width > 0 ? width : Math.max(cx + r * 2.75, r * 5.5);
  const {travel, flare: fall} = anti.signal, n = state.frame, b = state.still ? 1 : buildAt(n), {pulse} = state.still ? {pulse: 0} : blowAt(n);
  const dolbar = anti.border === 'right' ? [W + r * 0.3, cy] : [-r * 0.3, cy];
  let flare = 0;
  for (const s of state.signals) if (s.age >= travel) flare = Math.max(flare, s.power * Math.exp(-(s.age - travel) / fall));
  const plan = raidFor({centre, radius: r, width: W, height: H}, anti), N = anti.count, k = clamp(n - ORB, 0, anti.impact - ORB - 1), ring = plan.ring;
  const light = 0.3 + 0.7 * state.level, alpha = clamp(light * (0.55 + 0.45 * b) * (0.8 + 0.2 * flare) + 0.3 * pulse);
  let sx = 0, sy = 0, sxx = 0, syy = 0, m = 0;
  for (let i = 0; i < N; i++) {
    const j = state.still ? i * 4 : (k * N + i) * 4, src = state.still ? plan.still : plan.pos;
    const x = src[j], y = src[j + 1], st = src[j + 3];
    if (!st) continue;
    const size = r * 0.075 * (1 + 0.25 * b + 0.5 * flare + 0.35 * pulse) * (st >= 2 ? 1.15 : 1);
    out.antis.push({x, y, angle: src[j + 2], size, alpha, flare: Math.max(flare, pulse), i});
    sx += x; sy += y; sxx += x * x; syy += y * y; m++;
    if (st === 1) {
      // each of Dolbar's signals on its way: a dash from past his border to the swarmie
      const ax = x - dolbar[0], ay = y - dolbar[1], far = Math.hypot(ax, ay);
      for (const s of state.signals) {
        if (s.age >= travel || far <= size) continue;
        const u = Math.max(0.06, s.age / travel), reach = (far - size * 0.9) / far, a0 = Math.max(0, u - 0.2) * reach, a1 = u * reach;
        out.dashes.push([dolbar[0] + ax * a0, dolbar[1] + ay * a0, dolbar[0] + ax * a1, dolbar[1] + ay * a1, clamp(s.power * (0.55 + 0.45 * state.level))]);
      }
    } else if (n >= RELEASE && n <= LANDED) {
      // THE STRIKE's streak: from its tail to its head, on the straight line from where it stood to where it lands
      const q = n - RELEASE, fx = plan.from[i * 2], fy = plan.from[i * 2 + 1], tx = plan.to[i * 2], ty = plan.to[i * 2 + 1];
      out.streaks.push([fx + (tx - fx) * TAIL[q], fy + (ty - fy) * TAIL[q], fx + (tx - fx) * HEAD[q], fy + (ty - fy) * HEAD[q], q < 3 ? 1 : 0.5]);
    } else if (pulse > 0.25 && st >= 3) {
      // a blow drives it into the shield: a short streak behind it, along its way in
      const dx = x - cx, dy = y - cy, d = Math.hypot(dx, dy) || 1, len = ring * 0.16 * pulse;
      out.streaks.push([x + (dx / d) * len, y + (dy / d) * len, x, y, clamp(pulse)]);
    }
  }
  // the speed lines over the strike's way, on the release and the frames to the landing: along the blow's one way, across the band the swarm
  // strikes from, from behind the mass to the ring
  if (!state.still && n >= RELEASE && n < LANDED && m) {
    const q = n - RELEASE, [mx, my] = plan.mass, wx = cx - mx, wy = cy - my, wl = Math.hypot(wx, wy) || 1, ux = wx / wl, uy = wy / wl, gap = Math.max(1, wl - ring);
    const spread = Math.sqrt(Math.max(0, (sxx + syy) / m - (sx / m) ** 2 - (sy / m) ** 2)) || r;
    out.speedAlpha = [0.85, 0.6, 0.3][q];
    for (const [v, len, u] of SPEED) {
      const p = clamp(v * spread * 1.3, -0.95 * ring, 0.95 * ring), stop = wl - Math.sqrt(ring * ring - p * p) - 0.03 * ring;
      const a = -(0.3 + 0.5 * u) * gap + q * 0.4 * gap, e = Math.min(stop, a + len * gap);
      if (e > a) out.speed.push([mx + ux * a - uy * p, my + uy * a + ux * p, mx + ux * e - uy * p, my + uy * e + ux * p]);
    }
  }
  // the mass's glow: round them, as red as the red held and the charge's build (and each blow)
  if (m) {
    const gx = sx / m, gy = sy / m, rx = 1.7 * Math.sqrt(Math.max(0, sxx / m - gx * gx)) + 0.5 * r, ry = 1.7 * Math.sqrt(Math.max(0, syy / m - gy * gy)) + 0.5 * r;
    const a = clamp(0.5 * state.level * (0.25 + 0.75 * b) * (n >= RELEASE && n < LANDED ? 0.5 : 1) + 0.25 * pulse);
    if (a > 0.01) out.glow = {x: gx, y: gy, rx, ry, alpha: a};
  }
  return out;
}

/** The swarmie's picture, `px` a side, its point at +x: a pentagon of the sphere turned point-first, its dot and ring in the halo's red. */
export function paintSprite(g, px) {
  const c = px / 2, unit = px / 2;
  g.clearRect(0, 0, px, px);
  const glow = g.createRadialGradient(c, c, 0, c, c, unit);
  glow.addColorStop(0, 'rgba(214,18,30,0.42)'); glow.addColorStop(0.45, 'rgba(214,18,30,0.16)'); glow.addColorStop(1, 'rgba(214,18,30,0)');
  g.fillStyle = glow; g.fillRect(0, 0, px, px);
  const k = unit * 0.56, corner = (j) => [c + k * Math.cos((j * TAU) / 5), c + k * Math.sin((j * TAU) / 5)];
  g.beginPath();
  for (let j = 0; j < 5; j++) { const [x, y] = corner(j); if (j) g.lineTo(x, y); else g.moveTo(x, y); }
  g.closePath();
  g.fillStyle = 'rgba(140,0,12,0.5)'; g.fill();
  g.lineJoin = 'round'; g.lineWidth = Math.max(1, px * 0.035); g.strokeStyle = 'rgb(214,18,30)'; g.stroke();
  g.beginPath(); g.arc(c, c, k * 1.34, 0, TAU); g.lineWidth = Math.max(1, px * 0.016); g.strokeStyle = 'rgba(214,18,30,0.45)'; g.stroke();
  g.beginPath(); g.arc(c, c, k * 0.2, 0, TAU); g.fillStyle = 'rgb(255,226,214)'; g.fill();
  return g;
}

/** The mass's glow, `px` a side: the halo's red, soft, falling to nothing at the edge. */
export function paintGlow(g, px) {
  const c = px / 2, glow = g.createRadialGradient(c, c, 0, c, c, c);
  g.clearRect(0, 0, px, px);
  glow.addColorStop(0, 'rgba(214,18,30,0.55)'); glow.addColorStop(0.5, 'rgba(214,18,30,0.22)'); glow.addColorStop(1, 'rgba(214,18,30,0)');
  g.fillStyle = glow; g.fillRect(0, 0, px, px);
  return g;
}

/** Put Dolbar's swarm on the hero's stage, driven by its film. Returns {at, stats, element, destroy}. */
export function mountAntiSatellites({stage, film, sphere = null, sphereCanvas = null, worlds = () => [], after = null, anti = ANTI, reduced} = {}) {
  const doc = stage.ownerDocument, view = doc.defaultView;
  const still = reduced ?? Boolean(view.matchMedia?.('(prefers-reduced-motion: reduce)').matches);
  if (view.getComputedStyle(stage).position === 'static') stage.style.position = 'relative';
  const canvases = [...stage.children].filter((el) => el.tagName === 'CANVAS');
  const page = sphereCanvas ?? stage.querySelector?.('#genesis-sphere') ?? canvases[0] ?? null;
  const handleOf = () => sphere ?? view.genesisSphere ?? null;
  const layer = doc.createElement('canvas');
  layer.id = 'hero-anti-satellites';
  layer.setAttribute('aria-hidden', 'true');
  Object.assign(layer.style, {position: 'absolute', left: '0', top: '0', width: '100%', height: '100%', pointerEvents: 'none', visibility: 'hidden'});
  layer.width = 0; layer.height = 0;
  const anchor = after ?? canvases.at(-1) ?? null;
  if (anchor) anchor.after(layer); else stage.append(layer);

  // the sprite and the glow, painted once in idle time (or when the orb first lights)
  const SPRITE = 96, GLOW = 64, sprite = doc.createElement('canvas'), glowing = doc.createElement('canvas');
  let painted = false, paintMs = null;
  const paint = () => {
    if (painted) return;
    painted = true;
    const t0 = view.performance.now();
    sprite.width = SPRITE; sprite.height = SPRITE; glowing.width = GLOW; glowing.height = GLOW;
    const g = sprite.getContext('2d'), h = glowing.getContext('2d');
    if (g) paintSprite(g, SPRITE);
    if (h) paintGlow(h, GLOW);
    paintMs = view.performance.now() - t0;
  };

  // the boxes, read when the window comes in and on a resize while it is in: the layer's css size and the sphere canvas's place in it
  let box = null, ctx = null, dpr = 1;
  const fit = () => {
    const l = layer.getBoundingClientRect(), s = page?.getBoundingClientRect?.() ?? l;
    dpr = Math.min(view.devicePixelRatio || 1, 2);
    box = {w: Math.max(1, l.width), h: Math.max(1, l.height), sx: s.left - l.left, sy: s.top - l.top, sw: Math.max(1, s.width), sh: Math.max(1, s.height)};
    const W = Math.round(box.w * dpr), H = Math.round(box.h * dpr);
    if (layer.width !== W || layer.height !== H) { layer.width = W; layer.height = H; }
    ctx = layer.getContext('2d');
  };
  const empty = () => { if (layer.width || layer.height) { layer.width = 0; layer.height = 0; } ctx = null; };

  let waiting = null, frames = 0, draws = 0, drawMs = 0, drawMax = 0, shown = false, last = null, said = '';
  const stageFrame = () => {
    const s = handleOf()?.getViewState?.(), r = Math.min(box.sw, box.sh) * (Number.isFinite(s?.radius) ? s.radius : anti.sphere);
    return {centre: [box.sx + box.sw * SPHERE_X, box.sy + box.sh * 0.5], radius: r, width: box.w, height: box.h};
  };
  const geometry = () => {
    const list = (() => { try { return worlds() ?? []; } catch { return []; } })().map((w) => [box.sx + w.x, box.sy + w.y, w.r]);
    return {...stageFrame(), worlds: list};
  };
  const strokeLines = (g, list) => { g.beginPath(); for (const [x0, y0, x1, y1] of list) { g.moveTo(x0, y0); g.lineTo(x1, y1); } };
  let held = null, fought = null;   // the shield's and the resistance's numbers for the frame drawn, kept from draw to draw (no garbage a frame)
  const draw = (state, n) => {
    const t0 = view.performance.now();
    const geo = geometry(), f = formation(state, geo, anti), g = ctx, plan = shieldFor(geo, anti);
    if (held?.level.length !== plan.cells) held = blank(plan);
    const sh = shieldInto(plan, n, held, still);
    g.setTransform(1, 0, 0, 1, 0, 0);
    g.clearRect(0, 0, layer.width, layer.height);
    // the raid is the background: it stays whole whatever the page fades in front of its sphere (the panel's C and B)
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    g.lineCap = 'round'; g.lineJoin = 'round';
    // under everything: the mass's red glow
    if (f.glow && painted) { g.globalAlpha = f.glow.alpha; g.drawImage(glowing, f.glow.x - f.glow.rx, f.glow.y - f.glow.ry, 2 * f.glow.rx, 2 * f.glow.ry); }
    // under the swarm: the twelve's tethers, THE SHIELD
    const tied = sh.on ? paintTethers(g, sh, plan, geo.worlds) : 0;
    const cells = sh.on ? paintShield(g, sh) : 0;
    // THE RESISTANCE: the twelve's bolts and muzzle flashes over the shield (their own), the jolts and the hits' rings on the swarmies
    const rz = resistInto(plan, raidFor(geo, anti), n, geo.worlds, fought?.kick.length === anti.count * 3 ? fought : (fought = resistBlank(anti.count)), anti, still);
    if (rz.boltCount || rz.flashCount) paintResistance(g, rz);
    if (f.dashes.length) {
      g.strokeStyle = 'rgb(255,92,76)'; g.lineWidth = 2.4;
      g.globalAlpha = Math.max(...f.dashes.map((d) => d[4]));
      strokeLines(g, f.dashes); g.stroke();
    }
    // THE STRIKE: the speed lines over its way, the streaks behind each (a red sheath round a pale core)
    if (f.speed.length) { g.globalAlpha = f.speedAlpha * 0.55; g.strokeStyle = 'rgb(214,18,30)'; g.lineWidth = 1; strokeLines(g, f.speed); g.stroke(); }
    if (f.streaks.length) {
      strokeLines(g, f.streaks);
      const a = Math.max(...f.streaks.map((s) => s[4]));
      g.globalAlpha = 0.45 * a; g.strokeStyle = 'rgb(214,18,30)'; g.lineWidth = 5; g.stroke();
      g.globalAlpha = 0.9 * a; g.strokeStyle = 'rgb(255,214,200)'; g.lineWidth = 1.6; g.stroke();
    }
    if (painted) {
      for (const a of f.antis) {
        const hit = rz.kick[a.i * 3 + 2], size = a.size * (1 + 0.35 * hit), c = Math.cos(a.angle) * size * dpr, s = Math.sin(a.angle) * size * dpr;
        g.globalAlpha = Math.min(1, a.alpha + 0.35 * hit);
        g.setTransform(c, s, -s, c, (a.x + rz.kick[a.i * 3]) * dpr, (a.y + rz.kick[a.i * 3 + 1]) * dpr);
        g.drawImage(sprite, -1, -1, 2, 2);
      }
    }
    if (rz.ringCount) { g.setTransform(dpr, 0, 0, dpr, 0, 0); paintHits(g, rz); }
    g.globalAlpha = 1;
    draws++;
    const ms = view.performance.now() - t0;
    drawMs += ms; drawMax = Math.max(drawMax, ms);
    last = {t: n, antis: f.antis.length, streaks: f.streaks.length, speed: f.speed.length, dashes: f.dashes.length, glow: f.glow ? Math.round(f.glow.alpha * 1000) / 1000 : 0,
      shield: {cells, tied, strength: sh.strength, flare: sh.flare, press: sh.press, cracks: sh.crackCount, age: sh.age},
      resist: {shots: rz.shots, bolts: rz.boltCount, flashes: rz.flashCount, hits: rz.ringCount}};
  };
  // the layer is up from the orb's frame until the shield's last piece is gone (GONE, 11.812 s): the swarm leaves on the impact's cut, the
  // shield's pieces fly on with the theater's blast; under reduced motion there are no pieces, and it goes on the impact
  const end = still ? anti.impact : GONE;
  const apply = (t) => {
    const state = chargeAt(t, anti, {reduced: still});
    if (!(t >= line(ORB) && t < line(end))) {
      if (shown) { shown = false; said = ''; layer.style.visibility = 'hidden'; empty(); }
      return state;
    }
    const n = clamp(frameAt(t), ORB, end - 1), key = still ? 'still' : `${n}`;
    if (shown && key === said) return state;   // the same frame drawn already (a timeupdate after the frame callback)
    if (!shown) { shown = true; fit(); paint(); layer.style.visibility = 'visible'; }
    said = key;
    draw(state, n);
    return state;
  };
  const near = (t) => t >= line(ORB) - 1 && t < line(end) + 0.25;
  const ask = () => { if (!still && waiting === null && typeof film.requestVideoFrameCallback === 'function') waiting = film.requestVideoFrameCallback(onFrame); };
  const stop = () => { if (waiting !== null) { film.cancelVideoFrameCallback?.(waiting); waiting = null; } };
  function onFrame(now, meta) {
    waiting = null; frames++;
    apply(meta?.mediaTime ?? film.currentTime);
    if (!film.paused && near(film.currentTime)) ask();
  }
  const onTime = () => { const t = film.currentTime; apply(t); if (!film.paused && near(t)) ask(); else if (film.paused) stop(); };
  const onPause = () => { stop(); apply(film.currentTime); };
  const onSeek = () => { said = ''; onTime(); };
  const on = {play: onTime, playing: onTime, timeupdate: onTime, seeked: onSeek, pause: onPause, ended: onPause, emptied: onPause};
  for (const [type, fn] of Object.entries(on)) film.addEventListener(type, fn);
  const resized = typeof view.ResizeObserver === 'function' ? new view.ResizeObserver(() => { if (shown) { fit(); said = ''; apply(film.currentTime); } }) : null;
  resized?.observe(stage);
  // in idle time: the sprites and the raid for this stage, then in the next idle time its shield (each some tens of ms, never on a frame of
  // the window)
  const idle = (f) => (view.requestIdleCallback ? view.requestIdleCallback(f, {timeout: 4000}) : view.setTimeout(f, 0));
  const shielded = () => { try { if (box) shieldFor(stageFrame(), anti); } catch {} };
  const ready = () => { paint(); try { fit(); raidFor(stageFrame(), anti); if (!shown) empty(); } catch {} idle(shielded); };
  idle(ready);
  onTime();

  const handle = {
    at: (t) => chargeAt(t, anti, {reduced: still}),
    get stats() { return {draws, frames, drawMs, drawMax, waiting: waiting !== null, shown, painted, paintMs, reduced: still, pixels: [layer.width, layer.height], last}; },
    element: layer,
    destroy() {
      stop();
      for (const [type, fn] of Object.entries(on)) film.removeEventListener(type, fn);
      resized?.disconnect();
      layer.remove();
      empty();
    },
  };
  layer.antiSatellites = handle;   // for a reader (anti-satellites.proof.mjs): the page's line keeps no name for it
  return handle;
}

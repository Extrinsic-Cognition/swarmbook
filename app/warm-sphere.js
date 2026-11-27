import {SPHERE_X} from './sphere-centre.mjs';
import {createHolderOrbits} from './dl-holder-orbits.js?v=hexagons-1';
import {buildMembershipLayout} from './warm-membership.js';
import {buildAssemblySkin} from './assembly-geometry.js';
import {loopPoint, loopUnitAt} from './warm-assembly.js';
import {orbitTimeAt, validFlock, hexesAt, HEXES, fieldAt, fieldStrength, BIRTH, birthAt, unfoldAt, PULL, pullAt, pullFall, pullPlan, FORM, formAt, formLift, VOLLEY, volleyLaunch, volleyAt, volleyPath, volleySeen, volleyCore} from '../lab/rite-unit1s.js?v=mint-2';
import {makeOrigami, poseInto} from '../lab/origami.mjs?v=mint-2';
import {COLONY_REACH, COLONY_FLING, colonyPicture, flowAt, flowPoint} from '../lab/the-colony.mjs?v=the-cut-1';
import {cosmosBodyAt, cosmosPanels, cosmosReach, cosmosScales} from './warm-cosmos.mjs?v=the-cut-1';
import {createMintFlask, FLASK, SEAT, priorRise} from './dl-mint-flask.js?v=flask-2';

const TAU = Math.PI * 2;
const SCENES = ['seed', 'arrival', 'society', 'network'];
const TIMES = {seed: 0, arrival: 6, society: 16, network: 26};
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const ease = x => { x = clamp(x); return x * x * (3 - 2 * x); };
const lerp = (a, b, t) => a + (b - a) * t;
const dot = (a, b) => a.reduce((sum, x, i) => sum + x * b[i], 0);

// THE FRAME (Oct 15 2026; his "i want it invariant but way more optimized... do all rust c low wasm"): everything draw() worked out per frame
// (the twelve's trails, the ECG strips, the rings and their ticks, the stars, the faces turned, lit, projected and sorted) is one flat buffer in a
// fixed layout, built by house/embertide-mint (Rust, one .wasm, the same bytes on every glass: mint-wasm.mjs) once useWasm() has it, and by the
// jsFrame twins below until then and wherever it cannot load. The twins are the reference the kernel is pinned to (mint-wasm.test.mjs, 1e-9); the
// drawing below reads the buffer and only issues draws, so the picture is the same from either. Nothing per frame allocates but the faces' corner
// lists the hit test and the anchors keep.
export const FRAME = Object.freeze({TRAILS: 12 * 65 * 3, RINGS: 3 * 181 * 3, TICKS: 96 * 4, STARS: 76 * 4, FACE_IN: 25, FACE_OUT: 24, TRACE_MAX: 680, FACES_MAX: 1024});
const TRAIL_MS = 15500, TRACE_REACH = .1, TRACE_BANDS = 8;   // the trail's span; the R spike's height across the orbit (a share of the sphere's radius); the strip's fade in 8 strokes
const RINGS = Object.freeze([{r: 1.3, tilt: .98, roll: -.2}, {r: 1.58, tilt: .36, roll: .26}, {r: 1.44, tilt: 1.13, roll: .82}]);
const LIGHT = Object.freeze([-.32, .7, .64]);
const STARS = Object.freeze(Array.from({length: 76}, (_, i) => Object.freeze({
  x: (Math.sin(i * 127.1 + 38.2) * 43758.5453) % 1,
  y: (Math.sin(i * 311.7 + 13.9) * 9631.131) % 1,
  size: i % 13 === 0 ? 1.25 : .45 + i % 3 * .2,
})));
function projectAt(p, cx, cy, radius) {
  const scale = radius * 4 / (4 - p[2]);
  return [cx + p[0] * scale, cy - p[1] * scale];
}
let kernel = null;
/** useWasm(mint): draw from house/embertide-mint's doors (mint-wasm.mjs, loaded) from the next frame; useWasm(null) returns to the JS twins. */
export function useWasm(mint) { kernel = mint && mint.loaded ? mint : null; return kernel !== null; }
export const frameOf = () => kernel || jsFrame;
let glass = null;   // THE SHAPES ARE RUST'S (mint-glass.mjs): the graphics card's layers over the sphere, once the kernel and a card stand
export function useGlass(g) { glass = g || null; return glass !== null; }
let scratch = new Float64Array(32768);
const tracePts = new Float64Array(65 * 3);
/** The JS twins of the kernel's frame builders: the same layouts, the same operation order, into one scratch buffer (read it before the next). */
export const jsFrame = {
  get loaded() { return true; },
  trails(at, yaw, pitch, cx, cy, orbital) {
    const out = scratch;
    for (let chair = 0; chair < 12; chair++) for (let i = 0; i <= 64; i++) {
      const step = 64 - i, age = step / 64;
      const p = rotate(loopPoint(chair, at - age * TRAIL_MS), yaw, pitch), q = projectAt(p, cx, cy, orbital);
      const o = (chair * 65 + i) * 3; out[o] = q[0]; out[o + 1] = q[1]; out[o + 2] = p[2];
    }
    return out.subarray(0, FRAME.TRAILS);
  },
  trace(beat, at, yaw, pitch, cx, cy, orbital, radius) {
    if (!beat || beat.length < 2 || beat.length > FRAME.TRACE_MAX) return null;
    const out = scratch, n = beat.length - 1, per = n / 64, pts = tracePts;
    for (let chair = 0; chair < 12; chair++) {
      for (let step = 64, i = 0; step >= 0; step--, i++) {
        const p = rotate(loopPoint(chair, at - step / 64 * TRAIL_MS), yaw, pitch), q = projectAt(p, cx, cy, orbital);
        pts[i * 3] = q[0]; pts[i * 3 + 1] = q[1]; pts[i * 3 + 2] = p[2] > 0 ? 1 : 0;
      }
      for (let j = n; j >= 0; j--) {
        const i = 64 - j / per, i0 = Math.min(63, Math.floor(i)), k = i - i0;
        const ax = pts[i0 * 3], ay = pts[i0 * 3 + 1], dx = pts[i0 * 3 + 3] - ax, dy = pts[i0 * 3 + 4] - ay;
        const len = Math.hypot(dx, dy) || 1, v = (beat[j] || 0) * radius * TRACE_REACH;
        const o = (chair * (n + 1) + (n - j)) * 4;
        out[o] = ax + dx * k - dy / len * v; out[o + 1] = ay + dy * k + dx / len * v;
        out[o + 2] = Math.min(TRACE_BANDS - 1, Math.floor((1 - j / n) * TRACE_BANDS)); out[o + 3] = pts[i0 * 3 + 2];
      }
    }
    return out.subarray(0, 12 * (n + 1) * 4);
  },
  rings(yaw, cx, cy, radius) {
    const out = scratch;
    for (const [index, ring] of RINGS.entries()) for (let i = 0; i <= 180; i++) {
      const a = i / 180 * TAU;
      const p = rotate([Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0], ring.roll + yaw * .13, ring.tilt), q = projectAt(p, cx, cy, radius);
      const o = (index * 181 + i) * 3; out[o] = q[0]; out[o + 1] = q[1]; out[o + 2] = p[2];
    }
    let t = 0;
    for (const [index, ring] of RINGS.entries()) for (let j = 0; j < 72; j++) {
      if (index !== 0 && j % 6) continue;
      const a = j / 72 * TAU, long = j % 6 === 0;
      const p = rotate([Math.cos(a) * ring.r, Math.sin(a) * ring.r, 0], ring.roll + yaw * .13, ring.tilt);
      const q = rotate([Math.cos(a) * (ring.r + (long ? .036 : .014)), Math.sin(a) * (ring.r + (long ? .036 : .014)), 0], ring.roll + yaw * .13, ring.tilt);
      const pp = projectAt(p, cx, cy, radius), qq = projectAt(q, cx, cy, radius), o = FRAME.RINGS + t * 4;
      out[o] = pp[0]; out[o + 1] = pp[1]; out[o + 2] = qq[0]; out[o + 3] = qq[1]; t++;
    }
    return out.subarray(0, FRAME.RINGS + FRAME.TICKS);
  },
  stars(clock, width, height, cx, cy, radius) {
    const out = scratch;
    for (let i = 0; i < STARS.length; i++) {
      const s = STARS[i], x = (s.x + 1) % 1 * width, y = (s.y + 1) % 1 * height;
      const distance = Math.hypot(x - cx, y - cy);
      const alpha = .13 + .13 * (.5 + .5 * Math.sin(clock * .18 + i));
      const o = i * 4; out[o] = x; out[o + 1] = y; out[o + 2] = alpha; out[o + 3] = distance < radius * .8 ? 1 : 0;
    }
    return out.subarray(0, FRAME.STARS);
  },
  faces(packed, n, yaw, pitch, cx, cy, radius) {
    if (!(n > 0)) return null;
    if (scratch.length < n * (FRAME.FACE_OUT + 1)) scratch = new Float64Array(n * (FRAME.FACE_OUT + 1));   // the twin has no cap: a skin past the kernel's 1024 faces is its
    const out = scratch, at = p => projectAt(rotate(p, yaw, pitch), cx, cy, radius);
    for (let f = 0; f < n; f++) {
      const i = f * FRAME.FACE_IN, o = f * FRAME.FACE_OUT, nv = packed[i];
      const normal = [packed[i + 1], packed[i + 2], packed[i + 3]], center = [packed[i + 4], packed[i + 5], packed[i + 6]];
      const turned = rotate(normal, yaw, pitch), m = at(center);
      out[o] = turned[2]; out[o + 1] = clamp(.31 + .69 * Math.max(0, dot(turned, LIGHT))); out[o + 2] = m[0]; out[o + 3] = m[1];
      for (let v = 0; v < 6; v++) {
        if (v < nv) { const q = at([packed[i + 7 + v * 3], packed[i + 8 + v * 3], packed[i + 9 + v * 3]]); out[o + 4 + v * 2] = q[0]; out[o + 5 + v * 2] = q[1]; }
        else { out[o + 4 + v * 2] = 0; out[o + 5 + v * 2] = 0; }
      }
      if (nv === 5) {
        // the face's own square as the screen sees it: the affine fit of the perspective at its centre, two tangent axes one circumradius long
        const across = unit(cross(Math.abs(normal[1]) > .95 ? [1, 0, 0] : [0, 1, 0], normal)), up = cross(normal, across);
        const v0 = [packed[i + 7], packed[i + 8], packed[i + 9]];
        const rho = Math.hypot(...v0.map((v, k) => v - center[k]));
        const x = at(center.map((c, k) => c + across[k] * rho)), y = at(center.map((c, k) => c - up[k] * rho));
        out[o + 16] = x[0] - m[0]; out[o + 17] = x[1] - m[1]; out[o + 18] = y[0] - m[0]; out[o + 19] = y[1] - m[1]; out[o + 20] = m[0]; out[o + 21] = m[1];
      } else for (let k = 16; k < 22; k++) out[o + k] = 0;
      out[o + 22] = turned[2] > -.02 ? 1 : 0; out[o + 23] = 0;
    }
    const order = Array.from({length: n}, (_, k) => k).sort((a, b) => out[a * FRAME.FACE_OUT] - out[b * FRAME.FACE_OUT]);
    for (let k = 0; k < n; k++) out[n * FRAME.FACE_OUT + k] = order[k];
    return out.subarray(0, n * (FRAME.FACE_OUT + 1));
  },
};
/** packSkin(skin): a skin's faces as faces() takes them (the pentagons first, as the skin lists them), packed once and kept with the skin; rho:
 *  a pentagon's circumradius on the unit sphere (the film's picture on a chair is a square 2 rho wide). */
const packs = new WeakMap();
export function packSkin(skin) {
  const n = skin.pents.length + skin.hexes.length;
  let p = packs.get(skin);
  if (p && p.n === n) return p;
  const packed = new Float64Array(n * FRAME.FACE_IN);
  let f = 0;
  for (const list of [skin.pents, skin.hexes]) for (const face of list) {
    const o = f * FRAME.FACE_IN;
    packed[o] = face.verts.length;
    packed[o + 1] = face.normal[0]; packed[o + 2] = face.normal[1]; packed[o + 3] = face.normal[2];
    packed[o + 4] = face.center[0]; packed[o + 5] = face.center[1]; packed[o + 6] = face.center[2];
    for (let v = 0; v < 6 && v < face.verts.length; v++) { packed[o + 7 + v * 3] = face.verts[v][0]; packed[o + 8 + v * 3] = face.verts[v][1]; packed[o + 9 + v * 3] = face.verts[v][2]; }
    f++;
  }
  const first = skin.pents[0];
  p = {packed, n, rho: first ? Math.hypot(...first.verts[0].map((v, k) => v - first.center[k])) : 0};
  packs.set(skin, p);
  return p;
}
// THE FILM ONCE A FRAME: the twelve and the star all show the same decoded frame, and drawImage(video) thirteen times a frame was the hero's
// single heaviest line (2.5 to 4.3 s of every 6 s on the meter, Oct 15 2026). The frame's centre square is painted once per presented frame
// (the key: the film's second the sphere was handed, setMoment) into a staging canvas of `side` px, at least as large as it shows on screen,
// and every face is drawn from that: one copy of a video frame a frame, twelve of a bitmap.
const staged = new WeakMap();
const STAGE_STEP = 64, STAGE_MAX = 1024;
function stagedFilm(media, stage) {
  let s = staged.get(media);
  if (!s) {
    const canvas = document.createElement('canvas');
    s = {canvas, ctx: canvas.getContext('2d', {alpha: false}), side: 0, key: null};
    staged.set(media, s);
  }
  // mid-seek (no frame to give) the last frame stands, at the size it was staged (mediaReady)
  const side = Math.max(STAGE_STEP, Math.min(STAGE_MAX, Math.ceil(stage.side / STAGE_STEP) * STAGE_STEP)), ready = media.readyState >= 2 && media.videoWidth > 0;
  if (s.side !== side && ready) { s.canvas.width = side; s.canvas.height = side; s.side = side; s.key = null; }
  const key = stage.key ?? media.currentTime;
  if (s.key !== key && ready) {
    const square = Math.min(media.videoWidth, media.videoHeight);
    s.ctx.drawImage(media, (media.videoWidth - square) / 2, (media.videoHeight - square) / 2, square, square, 0, 0, side, side);
    s.key = key;
  }
  return s;
}

// THE MOMENT (his Oct 14 2026 11:2x to 11:3x WEST, over the hero's sphere grown to the network in its first seconds: "this must not start
// expanding from the get go... THIS IS ONE MOMENT IN A TIMELINE... YOU ARE LETTING GO OF ALL THE SPECTACLES LIKE THAT", "GO STUDY THE
// MOMENTS OF THE VIDEO", "TUTTE LE VOLTE CHE HO URLATO 'BURN MY COSMOSSSS'", "QUANTE VOLTE HO DETTO DI CONCENTRARCI SUL MOMENTO IN CUI LUI
// FA RYUSEIKEN"). The illustration's growth no longer runs on a timer from the page's load: its time is the film's, handed in by dl-twelve.js
// with each painted frame (setMoment). The moments are the film's own, read off saint-seiya.mp4 (?v=53561d47, 154.3 s; since THE CUT,
// dl-twelve.js, ?v=e2321f14, 152.4 s: those after his second aim 1.902 s earlier) by its burned-in
// subtitles (macOS Vision OCR, four reads a second) and its gold light (the share of golden pixels, four reads a second):
//   100.25 s  "Burn! Burn, my cosmos!" (to 103.0): the cosmos lights the sphere, gold, rising to the flash
//   104.25 s  "Pegasus Ryu Sei Ken! (Pegasus Meteor Punch)" (to 106.0); the gold flash 105.0 to 106.5, white at its peak
//   107.0 s   the meteor burst, the radial gold streaks; the rain 108.5 to 111.0; the hit on Dolbar 111.5
//   145.598 s the editor's end card (147.5 before THE CUT), then the loop at 152.4 s
// The twelve chairs hold through everything before the burst; the society arrives with the meteors, 107.0 to 112.0 (the illustration's
// phases 4 to 28, every hexagon a meteor landing); the network holds through the arrow of justice (124 s) to the end card; under the end
// card the sphere folds to the twelve, so the loop opens on them again. A pure function of the film's second: a seek, a loop, a tap that
// restarts the song from its start, all land on the same picture as a first play would.
// THE GRACE (his Oct 21 2026 WEST, over the swarms already in formation on a whole Goldberg as he draws: "you see there is no grace period?
// you should make it start as the dodecahedron and then make it expand 2/3 times until the arrow is fully drawn... on the moment of the arrow
// fully drawn we will "freeze" the page until the mint has happened"): as the strike's film folds home (the cut to the Sagittarius cloth,
// frame 3455, 115.282 s, the film over the stage) the vessel is the twelve again, and it grows its Goldberg three times on his rite with the
// bow, each rung whole in GRACE_S: as he raises the bow (frame 3488, 116.383 s: 'arrival', 20 places), as the star runs down its string
// (frame 3517, 117.351 s: 'society', 80) and as he draws the arrow (frame 3540, 118.118 s, THE PULL's cue: 'network', 150), all of it before
// the arrow is fully drawn (frame 3616, 120.654 s: dl-paywall.js DRAWN_FRAME, the freeze on THE CLIMAX). The phases are the illustration's own (11, 21, 28).
export const SEIYA_MOMENTS = Object.freeze({cosmos: 100.25, flash: 106.5, meteors: 107, impact: 112, fold: 115.282, bow: 116.383, star: 117.351, draw: 118.118, credits: 145.598});
export function momentPhase(t, m = SEIYA_MOMENTS) {
  if (!Number.isFinite(t) || t < m.meteors || t >= m.credits) return 0;
  if (t < m.impact) return 4 + (t - m.meteors) * 24 / (m.impact - m.meteors);
  if (t < m.fold || t >= m.draw) return 28;
  return t >= m.star ? 21 : t >= m.bow ? 11 : 0;   // THE GRACE
}
export function momentCosmos(t, m = SEIYA_MOMENTS) {
  if (!Number.isFinite(t) || t < m.cosmos || t >= m.impact + 2) return 0;
  if (t < m.flash) return ease((t - m.cosmos) / (m.flash - m.cosmos));
  return t < m.impact ? 1 : 1 - ease((t - m.impact) / 2);
}
// THE POSE IS THE FILM'S (his Oct 14 2026 22:1x WEST, over THE FOLD landing elsewhere at each load: "every single fucking time i log in
// there is a new different position"): the hero sphere's turn is a function of the film's second, never of the page's own clock. Until
// this the sphere turned on the page's clock from its load (0.12 rad a second while in view), so the face she folds from at her cut
// (29.563 s: lab/cubism.mjs chooseFace, on the sphere's pose at that instant) was whichever stood at the right then: a different root
// face, join, zoom and fit at every load (lab/CUBISM.md: four fit classes, their scale 2.6 x apart). Now: three turns a loop of the film,
// so the loop's seam is no jump, through POSE.yaw at her cut, the face of the fit's tightest join (pent:2's class, yaw 234 deg, join gap
// 5.6 px, mean 11.8 px: lab/cubism.mjs FIT). A hand (a drag, a key, the growth's own turn) still turns it; what the hand added is eased
// out over the 2.5 s before her cut and is nothing through the fold, so the fold always begins from its own pose, and once the sphere is
// whole again (38.071 s) the hand may turn it again. A seek lands on the pose a first play would.
// THE CUT (dl-twelve.js): the film lost his second aim at `cut` and is `loop` seconds now; the sphere keeps the uncut film's turn (three
// turns in `uncut` seconds) up to the cut, so every pose before it is the one he confirmed, and turns what the lost 1.902 s held back in
// over the rest of the film (7.7 % faster), so three turns still close the loop with no jump at its seam.
export const POSE = Object.freeze({at: 29.563, yaw: 234 * Math.PI / 180, pitch: -.12, turns: 3, loop: 152.412, uncut: 154.31, cut: 3825 * 1001 / 30000, settle: 2.5, back: 38.071});
/** The sphere's own pose at the film's second t. */
export function poseAt(t, p = POSE) {
  if (!Number.isFinite(t)) return {yaw: p.yaw, pitch: p.pitch};
  const rate = p.turns * TAU / (p.uncut ?? p.loop), cut = p.cut ?? Infinity;
  if (t <= cut) return {yaw: p.yaw + rate * (t - p.at), pitch: p.pitch};
  return {yaw: p.yaw + rate * (cut - p.at) + (p.turns * TAU - rate * cut) / (p.loop - cut) * (t - cut), pitch: p.pitch};
}
/** How much of what the hand added to the pose is kept at second t: all until settle seconds before her cut, eased to none at it, none through the fold, all after. */
export function handAt(t, p = POSE) {
  if (!Number.isFinite(t) || t < p.at - p.settle || t >= p.back) return 1;
  return t < p.at ? 1 - ease((t - (p.at - p.settle)) / p.settle) : 0;
}
// THE MINT WINDOW (his Oct 21 2026 WEST, at the drawn arrow: "it cant stop this abrutly dude... the "freeze" moment is basically where we go
// from old anime until that point, into something new, this something new is the time window in which the mint can happen"; then "i would
// appreciate if for the mint you made the inner circle larger inside the sphere, the inner circle with the anime... and if the satellites
// were made more transparent less opaque considering the hexagons will begin to get allocated"; then, over a crossing run on the page's own
// clock once the film had stopped: "you stop all and when all is stopped you make the image bigger? ... no smooth interpolation"; then, over
// portrait marks on the illustration's seats: "stop using placeholders for the profiles... you should arrive to the freeze moment with all
// hexagons unallocated and an empty tank fuel"). ONE MOVE, on the film's second, for a viewer the wall holds on THE CLIMAX (dl-paywall.js
// DRAWN_FRAME, frame 3616, 120.654 s: the bow at its full bend overhead): the page crosses into the window as he draws, from the draw
// (`from`, frame 3540, 118.118 s: THE PULL's cue) to the drawn arrow, eased in and out (mintCrossAt): the anime's circle grows from the
// star's .34 of the radius to `star`, laid in front of the faces; the satellites (the rite's units, their links and ribbons, the holders'
// orbits) fade to `satellites`; the illustration's seats empty (drawSkin `kept`), so on the stop every hexagon is unallocated and nothing
// has been poured: the window starts from nothing, and only real mints may fill it. The sphere's own motion (its turn, the orbits, the
// swarm and its wings, the units' spin) comes to rest with it (mintClockAt): its second runs as the film's until `settle` seconds before
// the arrow, then slower (its speed 1 - smoothstep(u²)) to nothing on it, resting 11/35 of `settle` behind the film's (the formation whole
// by then). Both land on the frame where the film stops, whose drawing has stood since frame 3615: nothing starts once all has stopped.
// When the window is over (the mint closed, a holder's receipt) the film moves on and the page crosses back over `back` of its seconds,
// its motion running back into the film's.
export const MINT_WINDOW = Object.freeze({from: 3540, frame: 3616, settle: .7, back: 1.3, star: .62, satellites: .35});
const FILM_FRAME_S = 1001 / 30000;
const smoother = x => { x = clamp(x); return x * x * x * (x * (x * 6 - 15) + 10); };
/** How far the page has crossed into the mint window at the film's second t, 0 to 1. mode: 'ahead' (the wall holds this viewer on the
 *  drawn arrow), 'leaving' (the window over, the film moving on from the arrow), or null (none: a holder, the mint closed). */
export function mintCrossAt(t, mode, m = MINT_WINDOW) {
  if (!Number.isFinite(t) || !mode) return 0;
  const from = m.from * FILM_FRAME_S, to = m.frame * FILM_FRAME_S;
  if (mode === 'leaving') return t < to ? 0 : 1 - smoother((t - to) / m.back);
  return smoother((t - from) / (to - from));
}
/** The sphere's own second at the film's second t: the film's, but for its way into the mint window and back out of it. */
export function mintClockAt(t, mode, m = MINT_WINDOW) {
  if (!Number.isFinite(t) || !mode) return t;
  const to = m.frame * FILM_FRAME_S, lag = m.settle * 11 / 35;
  if (mode === 'leaving') return t < to ? t : t - lag * (1 - ease((t - to) / m.back));
  const u = clamp((t - to + m.settle) / m.settle);
  return u <= 0 ? t : to - m.settle + m.settle * (u - .6 * u ** 5 + 2 / 7 * u ** 7);
}
/** How fast the sphere's own second runs at the film's second t, 1 to 0 on the way into the window (the page's own clock runs with it). */
export function mintSpeedAt(t, mode, m = MINT_WINDOW) {
  if (!Number.isFinite(t) || mode !== 'ahead') return 1;
  const u = clamp((t - m.frame * FILM_FRAME_S + m.settle) / m.settle);
  return 1 - ease(u * u);
}
// A film mid-seek has no frame to give for a moment (the wall putting it back onto its frame as it holds there): the frame last staged from it
// stands in, so the picture never blinks out on the stop (Oct 21 2026: one frame of no film in the circle and the twelve, on the freeze).
/** THE MINT'S LAND (dl-mint-ledger.js, his "is there persistence among hexs? remember the floating vs anchored hex thing or not?"): the film's own
 *  front on the stop, the direction of the sphere that faces the eye in the film's pose there (poseAt at the sphere's rest second, no hand), in the
 *  sphere's own frame; the land law places the chain's seats from it, the same on every screen. */
export const MINT_FRONT = (() => {
  const {yaw, pitch} = poseAt(mintClockAt(MINT_WINDOW.frame * FILM_FRAME_S, 'ahead'));
  return Object.freeze([Math.cos(pitch) * Math.sin(yaw), Math.sin(pitch), Math.cos(pitch) * Math.cos(yaw)]);
})();
// a bronze floats: `lift` of the radius off its face, bobbing `bob` at `rate` radians a second, drawn at `shrink` of its face, tethered to its home
export const FLOAT = Object.freeze({lift: .05, bob: .012, rate: 1.3, shrink: .86});
// A GOLD RISES (dl-mint-ledger.js foldWorld, his Oct 28 2026 03:2x WET: "golden hexagons are anchored and can be upgraded in height like extruding
// radially outwards"): an anchored gold stands out of the glass along its own radius, `base` of the radius at its first level and `step` more for
// each gold its holder bought again, `max` at most; a bronze is never raised (it floats, FLOAT).
export const RISE = Object.freeze({base: .022, step: .055, max: .4});
/** riseOf(level): how far a gold of this level stands out of the glass, in radii. Pure. */
export const riseOf = (level) => Math.min(RISE.max, RISE.base + RISE.step * Math.max(0, (Number.isFinite(level) ? level : 1) - 1));
const mediaReady = media => media instanceof HTMLVideoElement
  ? (media.readyState >= 2 && media.videoWidth > 0) || staged.get(media)?.key != null
  : Boolean(media?.complete && media.naturalWidth);
function drawPortrait(ctx, media, x, y, width, height, stage = null) {
  if (media instanceof HTMLVideoElement) {
    if (stage) { const s = stagedFilm(media, stage); ctx.drawImage(s.canvas, 0, 0, s.side, s.side, x, y, width, height); return; }
    const side = Math.min(media.videoWidth, media.videoHeight);
    ctx.drawImage(media, (media.videoWidth - side) / 2, (media.videoHeight - side) / 2, side, side, x, y, width, height);
  } else ctx.drawImage(media, x, y, width, height);
}

function rotate(p, yaw, pitch) {
  const c = Math.cos(yaw), s = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
  const x = p[0] * c - p[2] * s, z = p[0] * s + p[2] * c;
  return [x, p[1] * cp - z * sp, p[1] * sp + z * cp];
}

// THE ORIGAMI's turns (lab/origami.mjs), as quaternions [w, x, y, z]: a unit's pose eased from one turn to another (the page's face to the
// pentagon flying flat, to its own spin as it shuts, to the bird's flight as it opens) without passing through a squashed one
const qMul = (a, b) => [a[0] * b[0] - a[1] * b[1] - a[2] * b[2] - a[3] * b[3], a[0] * b[1] + a[1] * b[0] + a[2] * b[3] - a[3] * b[2],
  a[0] * b[2] - a[1] * b[3] + a[2] * b[0] + a[3] * b[1], a[0] * b[3] + a[1] * b[2] - a[2] * b[1] + a[3] * b[0]];
const qAxis = (x, y, z, t) => { const s = Math.sin(t / 2); return [Math.cos(t / 2), x * s, y * s, z * s]; };
/** qSpin(yaw, pitch): rotate(p, yaw, pitch)'s turn: about y by -yaw, then about x by pitch (their product, written out). */
const qSpin = (yaw, pitch) => {
  const ca = Math.cos(pitch / 2), sa = Math.sin(pitch / 2), cb = Math.cos(yaw / 2), sb = -Math.sin(yaw / 2);
  return [ca * cb, sa * cb, ca * sb, sa * sb];
};
/** qRows(x, y, z): the turn taking a frame's axes x, y, z (unit, right-handed) onto the view's x, y, z. */
function qRows(x, y, z) {
  const m00 = x[0], m01 = x[1], m02 = x[2], m10 = y[0], m11 = y[1], m12 = y[2], m20 = z[0], m21 = z[1], m22 = z[2], tr = m00 + m11 + m22;
  let q;
  if (tr > 0) { const s = Math.sqrt(tr + 1) * 2; q = [s / 4, (m21 - m12) / s, (m02 - m20) / s, (m10 - m01) / s]; }
  else if (m00 > m11 && m00 > m22) { const s = Math.sqrt(1 + m00 - m11 - m22) * 2; q = [(m21 - m12) / s, s / 4, (m01 + m10) / s, (m02 + m20) / s]; }
  else if (m11 > m22) { const s = Math.sqrt(1 + m11 - m00 - m22) * 2; q = [(m02 - m20) / s, (m01 + m10) / s, s / 4, (m12 + m21) / s]; }
  else { const s = Math.sqrt(1 + m22 - m00 - m11) * 2; q = [(m10 - m01) / s, (m02 + m20) / s, (m12 + m21) / s, s / 4]; }
  return q;
}
function qSlerp(a, b, t) {
  if (t <= 0) return a;
  if (t >= 1) return b;
  let d = a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3], s = 1;
  if (d < 0) { d = -d; s = -1; }
  if (d > .9995) {
    const r = [a[0] + (s * b[0] - a[0]) * t, a[1] + (s * b[1] - a[1]) * t, a[2] + (s * b[2] - a[2]) * t, a[3] + (s * b[3] - a[3]) * t], l = Math.hypot(...r);
    return [r[0] / l, r[1] / l, r[2] / l, r[3] / l];
  }
  const th = Math.acos(d), k0 = Math.sin((1 - t) * th) / Math.sin(th), k1 = s * Math.sin(t * th) / Math.sin(th);
  return [a[0] * k0 + b[0] * k1, a[1] * k0 + b[1] * k1, a[2] * k0 + b[2] * k1, a[3] * k0 + b[3] * k1];
}

function inside(point, polygon) {
  let result = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [x, y] = polygon[i], [xx, yy] = polygon[j];
    if ((y > point[1]) !== (yy > point[1]) && point[0] < (xx - x) * (point[1] - y) / (yy - y) + x) result = !result;
  }
  return result;
}

function path(ctx, points) {
  ctx.beginPath();
  points.forEach(([x, y], i) => i ? ctx.lineTo(x, y) : ctx.moveTo(x, y));
  ctx.closePath();
}

const unit = p => { const length = Math.hypot(...p) || 1; return p.map(x => x / length); };
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const blend = (a, b, t) => a.map((x, i) => lerp(x, b[i], t));
function alignCorners(source, target) {
  let best = Infinity, offset = 0;
  for (let shift = 0; shift < source.length; shift++) {
    const cost = target.reduce((sum, p, i) => sum + p.reduce((d, x, axis) => d + (x - source[(i + shift) % source.length][axis]) ** 2, 0), 0);
    if (cost < best) { best = cost; offset = shift; }
  }
  return target.map((_, i) => source[(i + offset) % source.length]);
}

// Adapt the original anatomy-growth.js growthTransition geometry: inherited
// polygons travel to their new faces; a new hex opens from an existing edge.
// Here confirmed membership assignments take precedence over empty geometry.
function morphPlan(previous, next) {
  const oldFaces = [...previous.skin.pents, ...previous.skin.hexes];
  const used = new Set(), pinned = new Map();
  for (const [id, slot] of next.slots) {
    const old = previous.slots.get(id);
    if (old) { pinned.set(slot.faceIndex, old.face); used.add(old.face.id); }
  }
  const startFor = (face, index) => {
    let from = index < 0 ? previous.skin.pents.find(old => old.id === face.id) : pinned.get(index);
    if (!from && index >= 0) {
      from = previous.skin.hexes.filter(old => !used.has(old.id)).sort((a, b) => dot(b.normal, face.normal) - dot(a.normal, face.normal))[0];
      if (from) used.add(from.id);
    }
    if (from) return {face, start: alignCorners(from.verts, face.verts), startNormal: from.normal};
    let score = -Infinity, edge = [face.center, face.center];
    for (const old of oldFaces) for (let i = 0; i < old.verts.length; i++) {
      const a = old.verts[i], b = old.verts[(i + 1) % old.verts.length];
      const candidate = dot(unit(blend(a, b, .5)), face.normal);
      if (candidate > score) { score = candidate; edge = [a, b]; }
    }
    const middle = blend(...edge, .5), direction = edge[1].map((x, i) => x - edge[0][i]);
    const length = dot(direction, direction) || 1;
    const start = face.verts.map(p => blend(...edge, clamp(.5 + dot(p.map((x, i) => x - middle[i]), direction) / length)));
    return {face, start, startNormal: unit(middle)};
  };
  const pents = next.skin.pents.map(face => startFor(face, -1));
  const hexes = next.skin.hexes.map(startFor);
  return progress => {
    if (progress >= 1) return next.skin;
    const interpolate = ({face, start, startNormal}) => {
      const verts = face.verts.map((point, i) => blend(start[i], point, progress));
      return {...face, verts, normal: unit(blend(startNormal, face.normal, progress)), center: [0, 1, 2].map(axis => verts.reduce((sum, point) => sum + point[axis], 0) / verts.length)};
    };
    return {pents: pents.map(interpolate), hexes: hexes.map(interpolate)};
  };
}

/**
 * The labelled genesis illustration and the confirmed membership renderer share
 * one instrument. setSnapshot permanently leaves the automatic illustration;
 * only explicit setScene calls can enter that illustration again.
 */
export function createGenesisSphere(canvas, {onScene = () => {}, onSelect = () => {}, onAdmission = () => {}, onHolderSelect = () => {}, onHoldersChange = () => {}, lightTheme = true, showSeatIndex = true, automatic: autoplay = true} = {}) {
  const ctx0 = canvas.getContext('2d', {alpha: true}), own = Object.getPrototypeOf(ctx0); let ctx = ctx0, onGlass = false;   // own: the context's own prototype, which the hero's kick swaps for its hook (orbit-kick.js THE HUSH)
  if (!ctx) throw new Error('The genesis sphere needs a 2D canvas');
  const media = matchMedia('(prefers-reduced-motion: reduce)');
  // held: the paywall holds the film at his second (dl-paywall.js); the sphere stands still whatever the page's own pause says
  let reduced = media.matches, paused = false, held = false, inView = true, destroyed = false;
  let width = 1, height = 1, frame = 0, lastTime = null, clock = 0, phaseTime = 0, dpr = 1;
  // THE FILM IS THE CLOCK OF THE PICTURE: while the film plays it asks for a frame at each one it presents (dl-twelve.js redraw) and the sphere
  // draws then; askedAt is the last ask, and a film that stops asking (a stall, a pause) hands the frames back to the screen within FILM_WAIT_MS.
  // THE SCREEN'S FRAMES BETWEEN (his Oct 21 2026 WEST "anyhthinh to increase fps you can do?"; lab/hero-fps.bench.mjs): the film's frames come
  // thirty a second, and until now the swarm, the orbits and the birds moved at that rate alone (Oct 15: two draws of the same decoded frame on a
  // 60 Hz glass were the hero's cost, before the swarm). Now, while the film plays, the sphere also draws between its frames, one every
  // SCREEN_STEP_MS at most (60 a second on any glass) and only while a draw is cheap (the last under SCREEN_DRAW_MS: the leaves unfolding keep
  // to the film's frames, so the film never waits on the picture). Between frames the orbits' clock is the frame on show run on by the screen's
  // time since it came (momentNow), never past the frame, as the theater reads its clock; the swarm's own clock is the film's second itself.
  let askedAt = -Infinity, drawnAt = -Infinity, drawnAsk = -Infinity, drawMs = 0, draws = 0, momentAt = -Infinity;
  const FILM_WAIT_MS = 250, SCREEN_STEP_MS = 12, SCREEN_DRAW_MS = 8, FRAME_S = 1001 / 30000;
  // HELD_FPS: on the stop his glow and the flask's liquor move on at this many draws a second (THE MINT WINDOW, dl-mint-flask.js)
  const HELD_FPS = 30;
  const momentNow = () => moment + Math.min(FRAME_S, Math.max(0, (performance.now() - momentAt) / 1000));
  // THE MINT WINDOW (above): mintMode is dl-twelve.js's word from the wall ('ahead', 'leaving' or null); the sphere's own second (ownNow) is
  // the film's run through mintClockAt, and the crossing (mintNowK) and the satellites' share (satNow) are the film's second's, each draw.
  let mintMode = null, mintNowK = 0, satNow = 1;
  const ownNow = () => mintClockAt(momentNow(), mintMode);
  // the frame's buffers (FRAME), filled once a draw and read by the two passes (far, near)
  const bodies = new Float64Array(8 * 64), rgbOf = (c) => [1, 3, 5].map((k) => parseInt(c.slice(k, k + 2), 16) / 255).concat(1);
  let lanesOn = null, skinsOn = false;
  const balls = [], trailsBuf = new Float64Array(FRAME.TRAILS), ringsBuf = new Float64Array(FRAME.RINGS + FRAME.TICKS), starsBuf = new Float64Array(FRAME.STARS);
  let traceBuf = null, traceLen = 0, at = 0, orbitalRadius = 1, stageSide = STAGE_STEP;
  // automatic: false (the mint's hero) = no growth on the page's own clock; the film's moment (setMoment) moves the illustration, or nothing does.
  let mode = 'illustration', automatic = autoplay, scene = 'seed', yaw = -.32, pitch = -.12;
  let shownYaw = yaw, shownPitch = pitch, handYaw = 0, handPitch = 0;   // THE POSE IS THE FILM'S: the pose the last moment set, and what the hand added since
  let cosmos = 0, moment = null, chosen = false, graceNow = false;   // the film's gold (0 to 1), its last second, a scene the viewer picked by hand; past the fold (THE GRACE, the stop)
  let bodyState = cosmosBodyAt(null), bodyPacked = null;
  let settleIllustration = false;
  let layout = buildMembershipLayout(null, {capacity: 0, seats: []}, 0);
  let renderedRadius = .2, networkAmount = 0;
  // THE CAMERA (his Oct 30 2026, over the page's ending: "start becoming kogima dude fucking use camera cuts and 3d real-time engines using floating 3JS animations like
  // there is rich lineage"; "to avoid breking track, getting the code we had built for the place there"; "the more DND adjacent you put it the better"): a camera over
  // the sphere's own projection, for a scene's cuts and dollies: a zoom on its radius, its centre moved by shares of the canvas, a turn added to its pose, and a drift
  // (radians a second) that keeps it floating between cuts. Identity at rest: nothing of the sphere moves while no scene holds it. camera(shot) cuts there (ms 0) or
  // eases there over ms; camera(null) lets go at once. While a camera eases or drifts it asks for a frame a frame; at rest it asks for none.
  const CAM_REST = Object.freeze({zoom: 1, x: 0, y: 0, yaw: 0, pitch: 0, drift: 0});
  let cam = {...CAM_REST}, camFrom = null, camTo = null, camAt = 0, camMs = 0, camRaf = 0, camLast = 0;
  // THE HEARTBEAT (lab/heartbeat.js): a function asked at every draw for {loop, size}, the Lissajous orbits' reach and the sphere's size as
  // shares of their own; none (the mint page) is 1 and 1. drawnSize is the size the last draw used, so getViewState answers what is on screen.
  let pulse = null, drawnSize = 1, loopReach = 1, beatTrace = null;
  // THE RITE (lab/rite-unit1s.js): a function asked at every draw for the twelve as unit1s while Seiya performs his rite, or null outside it:
  // {amount, size, spin, childScale, children, offset(chair, age)}: the units' growth, the music's thump, the dance of his hands on each trail
  let rite = null, riteNow = null;   // beatTrace: THE TRACE, the orbits as ECG strips (lab/heartbeat.js ecgTrail), or null
  const TRACE_REACH = .1, TRACE_BANDS = 8;   // the R spike's height across the orbit (a share of the sphere's radius); the strip's fade in 8 strokes
  const tracePts = new Float32Array(130), traceSide = new Uint8Array(65);   // one orbit's 65 points and which side of the sphere each stands
  let pointer = null, hitFaces = [];
  let selectedId = null, growth = null;
  // What is drawn over the faces (dl-voices.js) finds them through anchors: each face's projected centre and outline in the last frame, by
  // seat id (a member), pent:N (a chair) or hex:N (an open place). mine: the seats this viewer holds, drawn gold.
  const anchors = new Map(), mine = new Set();
  const holderOrbits = createHolderOrbits({requestFrame});
  const flask = createMintFlask({requestFrame});   // THE FLASK AND HIS GLOW, on THE MINT WINDOW (dl-mint-flask.js)
  // A SEAT TAKES A HEXAGON (dl-mint-flask.js), ITS OWN (dl-mint-ledger.js foldWorld: the land law over the chain's seats from the film's front):
  // the face each seat holds (face index -> seat, made again only when the chain grows), where each seat stands this frame (its spark's mark), and
  // the masses a floating bronze is tethered to (a chair's pentagon, a gold's hexagon) as they stand this frame
  let seatFaces = null, seatFacesOf = -1;
  const seatCenters = new Map(), massCenters = new Map(), floating = [], rising = [];
  function seatsOnFaces(seats) {
    if (seatFacesOf !== seats.length) {
      const world = flask.world(MINT_FRONT);
      seatFaces = new Map();
      for (const seat of seats) { const cell = world.get(seat.id); if (cell) seatFaces.set(cell.face, {...seat, ...cell}); }
      seatFacesOf = seats.length;
    }
    return seatFaces;
  }
  let overlay = null, overlayBusy = false; let seatFace = null;   // seatFace: what is drawn on each seat's hexagon (dl-her-portrait.js, setSeatFace)
  let previewing = false, previewSerial = 0, waveNormal = null, waveAt = -10000;
  let pendingAdmission = null;
  const continuingArrivals = new Set();
  // The twelve (his Oct 12 2026 10:0x: "before all there needs to be 12 people"): a picture per pentagon, chair 0 to 11, set by setChairs.
  const chairs = Array(12).fill(null), pictures = new Map();
  let star = null;   // the one at the centre, set by setStar
  const picture = src => {
    // One shared video element supplies the mint; every face samples the same decoded frame.
    if (src instanceof HTMLVideoElement) return src;
    if (!pictures.has(src)) {
      const image = new Image(); image.decoding = 'async'; image.onload = () => requestFrame(); image.src = src; pictures.set(src, image);
    }
    return pictures.get(src);
  };
  const nestedSkin = buildAssemblySkin(20);
  const seedSkin = buildAssemblySkin(0);
  // THE UNITS' LADDER (lab/rite-unit1s.js THE HEXAGONS): the rite's units grow their own Goldberg a rung at a time, as the page's sphere
  // grows its own (morphPlan: a hexagon that stays travels to its new place, a new one opens from an edge). Each rung's skin is made once,
  // and each step's opening is kept as LADDER_STEPS skins made on first use, so packSkin packs every one once (its cache is per skin) and
  // twelve families at twelve different moments of a step share them: no skin made a frame. A unit's twelve pentagons, its chairs, turn
  // from the seed's silver to gold as its first hexagons open (seedness, drawSkin), as the page's own seed does when it grows.
  const ladderSkins = HEXES.ladder.map((n) => n ? buildAssemblySkin(n) : seedSkin);
  const ladderKept = ladderSkins.map(() => []), ladderPlans = [];
  const LADDER_STEPS = 48;
  function unitSkinAt(node, chair) {
    if (!HEXES.steps[node.depth]) return seedSkin;
    const {level, progress} = hexesAt(node, riteNow.t, chair), top = ladderSkins.length - 1;
    if (level >= top) return ladderSkins[top];
    const q = Math.round(progress * LADDER_STEPS);
    if (q <= 0) return ladderSkins[level];
    if (q >= LADDER_STEPS) return ladderSkins[level + 1];
    const kept = ladderKept[level];
    if (!kept[q]) {
      ladderPlans[level] ??= morphPlan({skin: ladderSkins[level], slots: new Map()}, {skin: ladderSkins[level + 1], slots: new Map()});
      const skin = ladderPlans[level](q / LADDER_STEPS);
      if (level === 0) skin.seedness = 1 - q / LADDER_STEPS;
      kept[q] = skin;
    }
    return kept[q];
  }
  // THE ORIGAMI (lab/origami.mjs): the seed's twelve pentagons on hinges, one net per root (a unit is born as its parent's pentagon on its
  // own chair, a unit1 as the page's), made once; the bird at each of ORIGAMI_BEATS steps of its wingbeat kept per root as it is first
  // asked, so a flock of a thousand birds turns no hinge a frame
  const origami = seedSkin.pents.map((_, root) => makeOrigami(seedSkin.pents, root));
  for (const model of origami) { const F = model.frame; model.turn = qRows(F.x, F.y, F.z); model.shut = Float64Array.from(model.faces.flat(2)); }
  const ORIGAMI_BEATS = 32, birdPoses = new Map(), origamiPoseBuf = new Float64Array(180);
  const origamiTurned = new Float64Array(180), origamiScreen = new Float64Array(120), origamiDepth = new Float64Array(12), origamiOrder = new Int8Array(12);
  // the bird seen from behind and above (radians about its own right), its half span in the solid's radii
  const BIRD_TILT = -.95, BIRD_HALF = 1.8;
  function origamiPose(model, s, phase) {
    if (s === 0) return model.shut;
    if (s >= 1 && phase !== null) {
      const step = ((Math.round(phase / TAU * ORIGAMI_BEATS) % ORIGAMI_BEATS) + ORIGAMI_BEATS) % ORIGAMI_BEATS, key = model.root * ORIGAMI_BEATS + step;
      let pose = birdPoses.get(key);
      if (!pose) { pose = poseInto(new Float64Array(180), model, 1, step / ORIGAMI_BEATS * TAU); birdPoses.set(key, pose); }
      return pose;
    }
    return poseInto(origamiPoseBuf, model, s, phase);
  }
  /** birdTurn(model, heading): the bird's flight: its back up and seen from behind and above, its head `heading` radians round from up. */
  const birdTurn = (model, heading) => qMul(qAxis(0, 0, 1, heading), qMul(qAxis(1, 0, 0, BIRD_TILT), model.turn));
  // THE ORIGAMI drawn: a unit's twelve pentagons as its hinges stand at pose s (-1 one pentagon, 0 shut, 1 the bird) and wingbeat `phase`,
  // turned by q, `rho` px to the solid's unit radius, at (x, y); `bird` (0 to 1) how far its frame is the bird's (its back's centre the
  // point it flies by, seen without perspective). Shut, it is drawSkin's miniature seed corner for corner (the same perspective, lit and
  // colours, its far faces faint), so a unit handed from one to the other at its close is not seen to change. Opened, each face keeps its
  // colour outside and is glass inside, and under the bird lies its glass membrane, wingtip to head to wingtip to tail. look: 'silver' (a
  // seed as the page draws it) or 'gold' (a leaf). Strokes only where a face is large enough to show one. film: the picture its root face
  // still carries, peeled off the page's dodecahedron (THE BIRTH), and how much of it ({media, amount}), laid on the face as drawSkin lays a
  // chair's, so the face lifts off the dodecahedron as itself.
  // THE BIRDS AS SPRITES (his Oct 21 2026 WEST "anyhthinh to increase fps you can do?"; lab/hero-fps.bench.mjs): a leaf open and flying (s 1,
  // its frame the bird's) looks like its wingbeat's step (ORIGAMI_BEATS), its heading round the glass (BIRD_HEADINGS steps of the circle, 7.5
  // degrees: a pixel at a wingtip of these sizes) and its scale, and nothing else: the twelve nets are one bird in their own frame (the roots'
  // birds are congruent, lab/origami.test.mjs), the light stands still in the view, and a bird is seen without perspective. So each (step,
  // heading) is painted once, by the drawing below, onto a sheet at a BIRD_SPRITE scale (css px to the solid's radius), and every bird after
  // is one copy off the sheet, scaled to its own rho. 1,728 birds a frame were 20,000 fills and strokes (24 ms a draw on the M5 Max at
  // 2000 x 2000 px: the pull and the arrow at 13 to 15 fps, half the film's frames dropped); they are 1,728 copies now. A bird on its way open
  // (s under 1, or still turning into its flight), a face still carrying the film, or one larger than the sheets serve (rho past the last scale
  // by half) is drawn as before.
  const BIRD_HEADINGS = 48, BIRD_REACH = 3.1, BIRD_SPRITE = Object.freeze([2, 4]);   // the bird's farthest corner from its back's centre, in solid radii (wingtips up)
  // THE SHEET IS PAINTED WHOLE, ONCE (Nov 26 2026, THE RITE'S UNITS ARE RUST'S): a tile was painted the first time its bird was asked, 3,072
  // of them over the intro's first fourteen seconds. The graphics card takes a sheet as one picture (mint-glass.mjs sheet), so every (step,
  // heading) is painted at the sheet's making and it is never written again: tile step * BIRD_HEADINGS + heading, sheet k of four.
  const birdSheets = new Map();   // `${rhoS}|${look}` -> {canvas, tile (css px), cols, dpr, k, on: the glass that holds it}
  function birdSheet(rhoS, look) {
    const name = `${rhoS}|${look}`;
    let sheet = birdSheets.get(name);
    if (sheet && sheet.dpr === dpr) return sheet;
    const tile = Math.ceil(2 * BIRD_REACH * rhoS) + 2, n = ORIGAMI_BEATS * BIRD_HEADINGS, cols = Math.ceil(Math.sqrt(n)), rows = Math.ceil(n / cols);
    const canvas = document.createElement('canvas');
    canvas.dataset.sprite = 'bird';   // what a copy off it is (lab/rite-unit1s.proof.mjs counts each as a bird painted)
    canvas.width = Math.ceil(cols * tile * dpr); canvas.height = Math.ceil(rows * tile * dpr);
    const g = canvas.getContext('2d', {alpha: true});
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    for (let i = 0; i < n; i++) drawOrigamiOn(g, origami[0], 1, Math.floor(i / BIRD_HEADINGS) / ORIGAMI_BEATS * TAU, (i % cols + .5) * tile, (Math.floor(i / cols) + .5) * tile, rhoS, birdTurn(origami[0], i % BIRD_HEADINGS / BIRD_HEADINGS * TAU), 1, look, 1, null);
    birdSheets.set(name, sheet = {canvas, tile, cols, dpr, k: BIRD_SPRITE.indexOf(rhoS) * 2 + (look === 'gold' ? 1 : 0), on: null});
    return sheet;
  }
  /** birdTile(phase, heading): the tile of a flying bird at this wingbeat and heading, on any sheet */
  const birdTile = (phase, heading) => (((Math.round(phase / TAU * ORIGAMI_BEATS) % ORIGAMI_BEATS) + ORIGAMI_BEATS) % ORIGAMI_BEATS) * BIRD_HEADINGS + ((Math.round(heading / TAU * BIRD_HEADINGS) % BIRD_HEADINGS) + BIRD_HEADINGS) % BIRD_HEADINGS;
  function drawOrigami(model, s, phase, x, y, rho, q, alpha, look, bird, film = null, heading = null) {
    if (!(alpha > .002) || !(rho > .05)) return;
    const last = BIRD_SPRITE[BIRD_SPRITE.length - 1];
    if (heading !== null && s >= 1 && bird >= 1 && phase !== null && film === null && rho <= last * 1.5) {
      const rhoS = BIRD_SPRITE.find(r => rho <= r) ?? last, sheet = birdSheet(rhoS, look), i = birdTile(phase, heading);
      const side = sheet.tile * rho / rhoS, t = sheet.tile * sheet.dpr; ctx.globalAlpha = alpha;
      ctx.drawImage(sheet.canvas, (i % sheet.cols) * t, Math.floor(i / sheet.cols) * t, t, t, x - side / 2, y - side / 2, side, side);
      return;
    }
    drawOrigamiOn(ctx, model, s, phase, x, y, rho, q, alpha, look, bird, film);
  }
  /** The drawing itself, on `ctx` (the page's, or a sheet's): see THE ORIGAMI drawn, above. */
  function drawOrigamiOn(ctx, model, s, phase, x, y, rho, q, alpha, look, bird, film) {
    const pose = origamiPose(model, s, phase), [w, qx, qy, qz] = q; const m00 = 1 - 2 * (qy * qy + qz * qz), m01 = 2 * (qx * qy - w * qz), m02 = 2 * (qx * qz + w * qy);
    const m10 = 2 * (qx * qy + w * qz), m11 = 1 - 2 * (qx * qx + qz * qz), m12 = 2 * (qy * qz - w * qx);
    const m20 = 2 * (qx * qz - w * qy), m21 = 2 * (qy * qz + w * qx), m22 = 1 - 2 * (qx * qx + qy * qy);
    const o = model.frame.o, ox = o[0] * bird, oy = o[1] * bird, oz = o[2] * bird, T = origamiTurned, P = origamiScreen;
    for (let i = 0; i < 60; i++) {
      const px = pose[i * 3] - ox, py = pose[i * 3 + 1] - oy, pz = pose[i * 3 + 2] - oz;
      const rx = m00 * px + m01 * py + m02 * pz, ry = m10 * px + m11 * py + m12 * pz, rz = m20 * px + m21 * py + m22 * pz;
      const k = rho * ((1 - bird) * 4 / (4 - rz) + bird); T[i * 3] = rx; T[i * 3 + 1] = ry; T[i * 3 + 2] = rz; P[i * 2] = x + rx * k; P[i * 2 + 1] = y - ry * k;
    }
    for (let f = 0; f < 12; f++) {
      // far to near; where faces lie on one another (the rest stacked under the root, every other ring of them turned face up again) the
      // root is drawn last, then those facing the glass
      const a = f * 15, facing = (T[a + 3] - T[a]) * (T[a + 7] - T[a + 1]) - (T[a + 4] - T[a + 1]) * (T[a + 6] - T[a]) > 0;
      let z = (facing ? 1e-6 : 0) + (f === model.root ? 2e-6 : 0); for (let v = 0; v < 5; v++) z += T[(f * 5 + v) * 3 + 2]; origamiDepth[f] = z; origamiOrder[f] = f;
      for (let j = f; j > 0 && origamiDepth[origamiOrder[j - 1]] > z; j--) { origamiOrder[j] = origamiOrder[j - 1]; origamiOrder[j - 1] = f; }
    }
    const open = s > 0 ? ease(s) : 0, stroked = rho > 2.4; ctx.save(); ctx.lineJoin = 'round'; ctx.lineWidth = .5;
    if (s > .25) {
      // the glass membrane: the far corner of each wingtip's face, the head (the root's first corner) and the tail's far corner
      let lx = 0, ly = 0, lb = Infinity, rx = 0, ry = 0, rb = -Infinity, tx = x, ty = y, tb = Infinity;
      const F = model.frame, along = (i) => (pose[i * 3] - o[0]) * F.x[0] + (pose[i * 3 + 1] - o[1]) * F.x[1] + (pose[i * 3 + 2] - o[2]) * F.x[2];
      for (let v = 0; v < 5; v++) {
        const l = model.wings[0][2] * 5 + v, r = model.wings[1][2] * 5 + v, a = along(l), b = along(r);
        if (a < lb) { lb = a; lx = P[l * 2]; ly = P[l * 2 + 1]; }
        if (b > rb) { rb = b; rx = P[r * 2]; ry = P[r * 2 + 1]; }
      }
      for (let f = 0; f < 12; f++) if (model.role[f] === 'tail') for (let v = 0; v < 5; v++) {
        const i = f * 5 + v, back = (pose[i * 3] - o[0]) * F.y[0] + (pose[i * 3 + 1] - o[1]) * F.y[1] + (pose[i * 3 + 2] - o[2]) * F.y[2];
        if (back < tb) { tb = back; tx = P[i * 2]; ty = P[i * 2 + 1]; }
      }
      const h = model.root * 5; ctx.globalAlpha = alpha * .38 * ease((s - .25) / .5); ctx.fillStyle = lightTheme ? '#faeeda' : '#f4dfb0';
      ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(P[h * 2], P[h * 2 + 1]); ctx.lineTo(rx, ry); ctx.lineTo(tx, ty); ctx.closePath(); ctx.fill();
    }
    for (let j = 0; j < 12; j++) {
      const f = origamiOrder[j], a = f * 15;
      // its normal as it is turned now (its corners anticlockwise from outside), front when it faces the glass as drawSkin's are
      const e1x = T[a + 3] - T[a], e1y = T[a + 4] - T[a + 1], e1z = T[a + 5] - T[a + 2], e2x = T[a + 6] - T[a], e2y = T[a + 7] - T[a + 1], e2z = T[a + 8] - T[a + 2];
      let nx = e1y * e2z - e1z * e2y, ny = e1z * e2x - e1x * e2z, nz = e1x * e2y - e1y * e2x; const nl = Math.hypot(nx, ny, nz) || 1; nx /= nl; ny /= nl; nz /= nl;
      const front = nz > -.02, side = front ? 1 : -1; const lit = clamp(.31 + .69 * Math.max(0, side * (nx * LIGHT[0] + ny * LIGHT[1] + nz * LIGHT[2]))); ctx.beginPath();
      for (let v = 0; v < 5; v++) { const p = (f * 5 + v) * 2; if (v) ctx.lineTo(P[p], P[p + 1]); else ctx.moveTo(P[p], P[p + 1]); }
      ctx.closePath();
      if (front || open <= 0) {
        ctx.globalAlpha = alpha * (front ? 1 : .15);
        ctx.fillStyle = !lightTheme ? `rgb(${Math.round(87 + 124 * lit)},${Math.round(74 + 108 * lit)},${Math.round(43 + 74 * lit)})`
          : look === 'gold' ? `rgb(${Math.round(148 + 83 * lit)},${Math.round(131 + 78 * lit)},${Math.round(86 + 70 * lit)})`
            : `rgb(${Math.round(192 + 56 * lit)},${Math.round(195 + 53 * lit)},${Math.round(185 + 56 * lit)})`;
      } else {
        // an open face seen from inside: glass
        ctx.globalAlpha = alpha * lerp(.15, .55, open);
        ctx.fillStyle = lightTheme ? `rgb(${Math.round(226 + 26 * lit)},${Math.round(232 + 20 * lit)},${Math.round(230 + 22 * lit)})` : `rgb(${Math.round(120 + 70 * lit)},${Math.round(126 + 66 * lit)},${Math.round(118 + 60 * lit)})`;
      }
      ctx.fill();
      if (film && f === model.root && front && film.amount > .002) {
        // the face's own square as the glass sees it (drawSkin's: two tangent axes a circumradius long, through the same projection)
        const n = model.normals[f], c = model.centres[f], across = unit(cross(Math.abs(n[1]) > .95 ? [1, 0, 0] : [0, 1, 0], n)), up = cross(n, across);
        const at = (p) => {
          const px = p[0] - ox, py = p[1] - oy, pz = p[2] - oz;
          const rx = m00 * px + m01 * py + m02 * pz, ry = m10 * px + m11 * py + m12 * pz, rz = m20 * px + m21 * py + m22 * pz, k = rho * ((1 - bird) * 4 / (4 - rz) + bird);
          return [x + rx * k, y - ry * k];
        };
        const r = model.rho, mid = at(c), ax = at(c.map((v, i) => v + across[i] * r)), ay = at(c.map((v, i) => v - up[i] * r));
        ctx.save(); ctx.globalAlpha = alpha * film.amount; ctx.clip(); ctx.transform(ax[0] - mid[0], ax[1] - mid[1], ay[0] - mid[0], ay[1] - mid[1], mid[0], mid[1]);
        drawPortrait(ctx, film.media, -1, -1, 2, 2, {key: Number.isFinite(moment) ? moment : null, side: stageSide});
        ctx.restore(); ctx.save(); ctx.globalAlpha = alpha * film.amount * (1 - lit) * .5; ctx.fillStyle = lightTheme ? '#2f3328' : '#050706'; ctx.fill(); ctx.restore();
      }
      if (stroked) {
        ctx.strokeStyle = lightTheme ? (front ? 'rgba(151,113,42,.74)' : 'rgba(91,109,88,.28)') : front ? 'rgba(227,197,128,.66)' : 'rgba(161,150,106,.3)'; ctx.stroke();
      }
    }
    ctx.restore();
  }

  // THE BIRTH laid on the stage (lab/rite-unit1s.js birthAt): his hands' picture over the stage, BIRTH_REACH sphere radii from its centre to
  // the picture's edges; the page's face `chair` where the sphere shows it now (its centre on the canvas and its depth)
  const BIRTH_REACH = [1.6, 1.3], birthOut = new Float64Array(3), pageFaceOut = new Float64Array(3);
  function pageFace(chair, center, radius) {
    const packed = packSkin(layout.skin).packed, o = chair * FRAME.FACE_IN;
    const p = rotate([packed[o + 4], packed[o + 5], packed[o + 6]], yaw, pitch), q = projectAt(p, center[0], center[1], radius);
    pageFaceOut[0] = q[0]; pageFaceOut[1] = q[1]; pageFaceOut[2] = p[2];
    return pageFaceOut;
  }
  /** birthPlace(out, b, chair, ox, oy, oz, center, radius): where unit1 `chair` is at birth state b, its orbit's point (ox, oy, oz): from the
   *  sphere's centre (its face drawn in place there, at the sphere's own size) onto its hand's stream, then out to its orbit. */
  function birthPlace(out, b, chair, ox, oy, oz, center, radius) {
    const fz = pageFace(chair, center, radius)[2];
    const hx = center[0] + (b.ride[0] - .5) * 2 * BIRTH_REACH[0] * radius, hy = center[1] + (b.ride[1] - .5) * 2 * BIRTH_REACH[1] * radius;
    const x = lerp(center[0], hx, b.peel), y = lerp(center[1], hy, b.peel), z = lerp(fz, 1, b.peel);
    out[0] = lerp(x, ox, b.orbit); out[1] = lerp(y, oy, b.orbit); out[2] = lerp(z, oz, b.orbit);
    return out;
  }
  /** riteSpark(b, chair, front, center, radius): THE BIRTH's spark for face `chair`, running in from round the stage, gathering speed, and
   *  its flash on the face as it strikes, fading as the face lifts off. Gold laid on, not light added: the stage is pale (light added on it
   *  is white on white), a gold streak clear at its tail and a bright head in a gold halo. */
  let sparkSprite = null;
  function riteSpark(b, chair, front, center, radius) {
    if (!(b.spark > 0)) return;
    const face = pageFace(chair, center, radius), fx = face[0], fy = face[1];
    if ((face[2] > 0) !== front) return;
    let dx = fx - center[0], dy = fy - center[1], dl = Math.hypot(dx, dy);
    if (dl < radius * .08) { const a = chair * 2.39996; dx = Math.cos(a); dy = Math.sin(a); dl = 1; }
    dx /= dl; dy /= dl;
    if (!sparkSprite) {
      sparkSprite = document.createElement('canvas'); sparkSprite.width = sparkSprite.height = 64;
      const g = sparkSprite.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
      r.addColorStop(0, 'rgba(255,253,244,1)'); r.addColorStop(.16, 'rgba(255,221,140,.95)'); r.addColorStop(.42, 'rgba(214,152,44,.42)'); r.addColorStop(1, 'rgba(196,128,30,0)');
      g.fillStyle = r; g.fillRect(0, 0, 64, 64);
    }
    ctx.save();
    if (b.spark < 1) {
      const run = b.spark * b.spark, out = radius * 2.4 * (1 - run), x = fx + dx * out, y = fy + dy * out;
      const len = radius * (.3 + .5 * b.spark), tx = x + dx * len, ty = y + dy * len, line = ctx.createLinearGradient(tx, ty, x, y);
      line.addColorStop(0, 'rgba(196,138,40,0)'); line.addColorStop(1, 'rgba(196,138,40,.9)');
      ctx.strokeStyle = line; ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1.6, radius * .016); ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(x, y); ctx.stroke();
      const head = Math.max(6, radius * .07); ctx.drawImage(sparkSprite, x - head, y - head, head * 2, head * 2);
    } else {
      const flash = 1 - clamp(b.peel / .4), big = radius * (.16 + .2 * (1 - flash));
      ctx.globalAlpha = .85 * flash; ctx.drawImage(sparkSprite, fx - big, fy - big, big * 2, big * 2);
    }
    ctx.restore();
  }

  // THE PULL (lab/rite-unit1s.js): the plan of the page's own sphere (made once a skin: the pentagon each unit1 takes, the hex each swarm
  // takes, from the unit1s' orbits' points as the draw begins), and where a unit falls to on the canvas now: a geostationary post over a
  // pentagon or a hex's own place, turned with the sphere, the way there bowed out from the sphere's centre so a fall round it never
  // crosses its faces
  const pullPlans = new WeakMap(), pullOut = new Float64Array(4), PULL_ROOT = Object.freeze({depth: 1, id: 0});
  function pullPlanNow() {
    const skin = layout.skin;
    if (!riteNow || riteNow.t < PULL.at || !skin?.hexes?.length) return null;
    let plan = pullPlans.get(skin);
    if (!plan) {
      const at = orbitTimeAt(PULL.at) * 1000 + 18000;
      plan = pullPlan(Array.from({length: 12}, (_, i) => loopPoint(i, at)), skin.pents, skin.hexes);
      pullPlans.set(skin, plan);
    }
    return plan;
  }
  /** pullPlace(out, face, lift, w, sx, sy, sz, center, radius, bow): unit falling `w` of the way from (sx, sy) at depth sz onto face `face`
   *  of the page's skin (a pentagon below 12, then its hexes), `lift` radii over its centre; out: [x, y, depth, its place's depth]. */
  function pullPlace(out, face, lift, w, sx, sy, sz, center, radius, bow) {
    const packed = packSkin(shownSkin).packed, o = face * FRAME.FACE_IN, r = 1 + lift;
    const c = [packed[o + 4], packed[o + 5], packed[o + 6]], l = Math.hypot(c[0], c[1], c[2]) || 1;
    const p = rotate([c[0] / l * r, c[1] / l * r, c[2] / l * r], yaw, pitch), q = projectAt(p, center[0], center[1], radius);
    const k = Math.min(1, w), x = lerp(sx, q[0], w), y = lerp(sy, q[1], w);
    const dx = x - center[0], dy = y - center[1], dl = Math.hypot(dx, dy) || 1, out2 = 4 * k * (1 - k) * radius * bow;
    out[0] = x + dx / dl * out2; out[1] = y + dy / dl * out2; out[2] = lerp(sz, p[2], k); out[3] = p[2];
    return out;
  }
  /** pullCatch(hex, a, front, center, radius): a hex lighting gold as its swarm is caught on it, fading over the catch (front faces, in the
   *  front pass, under the bodies). */
  function pullCatch(hex, a, front, center, radius) {
    if (!(a > .01)) return;
    const pack = packSkin(shownSkin), o = (12 + hex) * FRAME.FACE_IN, nv = pack.packed[o], P = pack.packed, S = shellNow.centre, K = shellNow.panel;
    const n = rotate([pack.packed[o + 1], pack.packed[o + 2], pack.packed[o + 3]], yaw, pitch);
    if ((n[2] > 0) !== front || !front) return;
    ctx.save(); ctx.beginPath();
    for (let v = 0; v < nv; v++) {
      // the panel where drawSkin lays it (warm-cosmos.mjs cosmosPanels: its centre moved out, the panel drawn smaller round it)
      const corner = [0, 1, 2].map((j) => P[o + 4 + j] * S + (P[o + 7 + v * 3 + j] - P[o + 4 + j]) * K);
      const q = projectAt(rotate(corner, yaw, pitch), center[0], center[1], radius);
      if (v) ctx.lineTo(q[0], q[1]); else ctx.moveTo(q[0], q[1]);
    }
    ctx.closePath(); ctx.globalAlpha = a * .22; ctx.fillStyle = lightTheme ? '#e8c77a' : '#c9a35a'; ctx.fill();
    ctx.globalAlpha = a * .9; ctx.strokeStyle = lightTheme ? '#c1922f' : '#f1d48a'; ctx.lineWidth = 1.6; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
  }

  // THE FORMATION's places (lab/rite-unit1s.js FORM), on the page's panels where drawSkin lays them this frame: from 115 s the vessel stands
  // open (warm-cosmos.mjs cosmosPanels: each panel's centre moved out to 1.3 radii, the panel drawn at nine tenths round it), so a swarm sits
  // on the hex that is seen, never on the closed sphere inside it. Per hex of the page's skin, made once a skin: its centre, then twelve
  // offsets from it on its outline drawn in to FORM.reach (slot 2k its corner k, slot 2k + 1 the middle of the edge from it to the next).
  // formPlace puts slot k of hex `hex` (k -1: its centre) `lift` radii over its panel and `inward` of the way from there to the sphere's centre,
  // turned with the sphere and projected as projectAt does, without an array made (a thousand leaves a frame): out [x, y, depth].
  const SHELL_REST = Object.freeze({centre: 1, panel: 1});
  // shownSkin: the page's skin as this frame draws it, a growing one's morph (THE GRACE: its hexes are the coming skin's, in its order, on their
  // way), so a swarm falls onto its hex where the hex is seen
  let shellNow = SHELL_REST, shownSkin = null;
  const formSlots = new WeakMap(), formOut = new Float64Array(3), formTurn = {yaw: NaN, pitch: NaN, c: 1, s: 0, cp: 1, sp: 0};
  function formSlotsOf(skin) {
    let slots = formSlots.get(skin);
    if (slots) return slots;
    const packed = packSkin(skin).packed, n = skin.hexes.length; slots = new Float64Array(n * 39);
    for (let h = 0; h < n; h++) {
      const o = (skin.pents.length + h) * FRAME.FACE_IN, nv = packed[o], w = h * 39;
      for (let j = 0; j < 3; j++) slots[w + j] = packed[o + 4 + j];
      for (let k = 0; k < 12; k++) {
        const a = (k >> 1) % nv, b = (a + (k & 1)) % nv;
        for (let j = 0; j < 3; j++) slots[w + 3 + k * 3 + j] = FORM.reach * ((packed[o + 7 + a * 3 + j] + packed[o + 7 + b * 3 + j]) / 2 - packed[o + 4 + j]);
      }
    }
    formSlots.set(skin, slots);
    return slots;
  }
  function formPlace(out, hex, k, lift, inward, center, radius) {
    const s = formSlotsOf(shownSkin), w = hex * 39, i = w + 3 + k * 3, S = shellNow.centre, K = k < 0 ? 0 : shellNow.panel, T = formTurn;
    if (T.yaw !== yaw || T.pitch !== pitch) { T.yaw = yaw; T.pitch = pitch; T.c = Math.cos(yaw); T.s = Math.sin(yaw); T.cp = Math.cos(pitch); T.sp = Math.sin(pitch); }
    let x0 = s[w] * S + (K ? s[i] * K : 0), y0 = s[w + 1] * S + (K ? s[i + 1] * K : 0), z0 = s[w + 2] * S + (K ? s[i + 2] * K : 0);
    const l = Math.hypot(x0, y0, z0) || 1, r = (l + lift) * (1 - inward) / l; x0 *= r; y0 *= r; z0 *= r;
    const x = x0 * T.c - z0 * T.s, z1 = x0 * T.s + z0 * T.c, y = y0 * T.cp - z1 * T.sp, z = y0 * T.sp + z1 * T.cp, scale = radius * 4 / (4 - z);
    out[0] = center[0] + x * scale; out[1] = center[1] - y * scale; out[2] = z;
    return out;
  }
  /** formPostLift(hex, lift, inward): the lift pullPlace takes (radii over the unit sphere along the hex's centre) to put a swarm `lift` over
   *  its panel where it is seen, `inward` of the way in to the centre. */
  function formPostLift(hex, lift, inward) {
    const s = formSlotsOf(shownSkin), w = hex * 39;
    return (Math.hypot(s[w], s[w + 1], s[w + 2]) * shellNow.centre + lift) * (1 - inward) - 1;
  }
  /** turnTo(a, b): the least turn from heading a to heading b, radians in (-pi, pi]. */
  const turnTo = (a, b) => ((b - a) % TAU + TAU * 1.5) % TAU - Math.PI;
  // THE VOLLEY's core (lab/rite-unit1s.js volleyCore): the swarm delivered into the sphere's centre, taken in as light where the film shows through it
  // (the star's window, a little past it at the height of the arrivals); and THE THREE WAVES' strikes where a page asks them. Light added, as the arrows' is: the window is the film
  function paintCore(center, radius) {
    const k = volleyCore(riteNow.t), {glow} = arrowSpritesOf();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    if (k > .003) { const r = radius * (.3 + .14 * k); ctx.globalAlpha = .65 * k; ctx.drawImage(glow, center[0] - r, center[1] - r, r * 2, r * 2); }
    for (let i = 0; i < impactN; i++) { const o = i * 5, x = impactBuf[o], y = impactBuf[o + 1], since = impactBuf[o + 2], depth = impactBuf[o + 3], a = 1 - since / SPARK_S, big = radius * STRIKE_FLASH[depth] * (1 + 2.5 * since), n = STRIKE_SPARKS[depth], s = Math.max(1.5, big * .16); ctx.globalAlpha = a * a * (depth === 3 ? .3 : 1); ctx.drawImage(glow, x - big, y - big, big * 2, big * 2); for (let j = 0; j < n; j++) { const an = impactBuf[o + 4] * 1.7 + j * TAU / n, d = big * (.4 + 3 * since / SPARK_S); ctx.drawImage(glow, x + Math.cos(an) * d - s, y + Math.sin(an) * d - s, s * 2, s * 2); } }   // THE THREE WAVES (after-the-mint-tree.mjs strikeAt): each body that struck Dolbar breaks into light where it hit, a flash and its sparks flying out, over SPARK_S
    ctx.restore();
  }

  // Reused by every family and both depth passes. Heap addresses preserve parent identity across births and seeks.
  const familyPose = new Float64Array(157 * 3), familyStrike = new Float64Array(157), strikeOut = new Float64Array(6), impactBuf = new Float64Array(5 * 12 * 157), STRIKE_FLASH = [0, .42, .16, .06], STRIKE_SPARKS = [0, 0, 0, 0], SPARK_S = .4;   // THE THREE WAVES: a node's way at Dolbar this frame (its children's links fade with it), the page's answer, and the strikes this frame: [x, y, seconds since, depth, the body's own number], each depth's flash (radii) and sparks (none here: the page's embers are the sparks, after-the-mint-tree.mjs emberAt)
  // THE FORMATION and THE VOLLEY: each swarm's hex, the second its unit2 was caught on it and the second it leaves it (read by its leaves)
  const familyHex = new Int32Array(157), familyCaught = new Float64Array(157), familyLaunch = new Float64Array(157);
  // THE FIELD (lab/rite-unit1s.js fieldAt): each node's fade in the family being placed (a child takes its parent's), and the field's answer
  const familyFade = new Float64Array(157), familyPull = new Float64Array(157), fieldOut = new Float64Array(3);
  let fieldRadius = 0, fieldOn = 0, impactN = 0;   // the sphere as the field sees it this frame (its radius times its shell's reach), and its strength
  // THE COLONY (lab/the-colony.mjs) this frame: how much of the swarm behind the sphere is lifted in front of the film, how far all are flung
  // THE TWELVE LEFT BEHIND (his "leave the unit0s behind... they begin to clog the scene later", over the twelve big balls over the meteors):
  // while the film holds the stage the unit1s, their ribbons and their trails fade from in front of it, as their arrows are pulled into it,
  // and come back with the fold; behind the film they go on as ever, steady
  let colonyLift = 0, colonyFling = 0, colonySpread = 0, twelveBehind = 0;
  // THE THROW (lab/the-colony.mjs): this frame, whether the colony holds, and his fist and Dolbar's chest on this canvas (the film's marks
  // through the picture's mapping on the stage, the box's own)
  // THE FLOW (lab/the-colony.mjs) this frame: the film's mapping on this canvas, and the shot whose drawn lines the arrows trace, or null
  let colonyPic = null, flowNow = null;
  const familyDrawPool = Array.from({length: 12 * 157}, () => ({}));
  const familyDrawOrder = [];

  function emitScene(next, force = false) {
    if (scene === next && !force) return;
    scene = next; onScene(scene);
  }

  function updateLayout(snapshot, initial = false) {
    const next = buildMembershipLayout(initial ? null : layout, snapshot, clock);
    for (const slot of next.slots.values()) if (slot.isNew) continuingArrivals.add(slot.seat.id);
    if (next.fingerprint !== layout.fingerprint) {
      if (next.capacity !== layout.capacity) beginGrowth(layout, next);
      layout = next;
    } else {
      // Metadata refreshes must reach the inspector without restarting a flight.
      layout = next;
    }
  }

  // THE GRACE's rungs come under a second apart (SEIYA_MOMENTS bow, star, draw): each grows in GRACE_S, whole before the next comes
  const GRACE_S = .7;
  function beginGrowth(previous, next) {
    const grace = Number.isFinite(moment) && moment >= SEIYA_MOMENTS.fold && moment < SEIYA_MOMENTS.draw + 1;
    growth = {
      at: clock, duration: grace ? GRACE_S : 1.6, progress: 0, applied: 0, tilt: 0,
      fromRadius: renderedRadius, fromCapacity: previous.capacity,
      toCapacity: next.capacity, shape: morphPlan(previous, next),
    };
  }

  function illustration() {
    let count = 0, capacity = 0, nextScene = 'seed';
    if (phaseTime >= 4 && phaseTime < 12) {
      nextScene = 'arrival'; count = Math.min(8, 1 + Math.floor((phaseTime - 4) * .9)); capacity = 20;
    } else if (phaseTime >= 12 && phaseTime < 22) {
      nextScene = 'society'; count = Math.min(60, 8 + Math.floor((phaseTime - 12) * 5.2)); capacity = count <= 20 ? 20 : count <= 30 ? 30 : 80;
    } else if (phaseTime >= 22) {
      nextScene = 'network'; count = Math.min(118, 60 + Math.floor((phaseTime - 22) * 12)); capacity = count <= 80 ? 80 : 150;
    }
    // FOLLOW THE COUNT (his Nov 19 2026 "Follow the count", asked which floor all three balls share, starting with the mint page's freeze; Oct 21 "i would like the
    // dodecahedron there to start doing goldberg expansion as the mints are happening on solana"): held on the arrow, the vessel his grace grows is the floor the
    // chain's mints make (the flask's world, dl-mint-ledger.js worldOf, as every ball folds it), a rung a beat up to the floor's own and never past it, with no
    // place of the illustration's: the dodecahedron while no one has minted, a rung more as the mints fill one. Before the fold, and past the window, the film's own
    if (mintMode === 'ahead' && graceNow) { const floor = flask.world(MINT_FRONT).capacity; capacity = phaseTime >= 28 ? floor : Math.min(phaseTime >= 21 ? 80 : phaseTime >= 11 ? 30 : 0, floor); count = 0; }
    emitScene(nextScene);
    if (layout.count !== count || layout.capacity !== capacity) {
      updateLayout({capacity, seats: Array.from({length: count}, (_, i) => ({id: `illustrated-place:${i}`, label: `A place in the society`}))});
    }
  }

  function resize() {
    if (destroyed) return;
    const bounds = canvas.getBoundingClientRect(); width = Math.max(1, bounds.width); height = Math.max(1, bounds.height); dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); requestFrame();
  }

  const project = (p, center, radius) => projectAt(p, center[0], center[1], radius);

  function atmosphere(center, radius) {
    const glow = ctx.createRadialGradient(center[0], center[1], radius * .15, center[0], center[1], radius * 1.85);
    glow.addColorStop(0, lightTheme ? '#fffefa00' : '#e3c4780b'); glow.addColorStop(.56, lightTheme ? '#dbb66512' : '#c3aa6516'); glow.addColorStop(1, '#c3aa6500');
    ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
    if (cosmos > 0) {   // "Burn, my cosmos!": the film's gold behind the sphere, only while it burns (one gradient a frame, none at rest)
      const burn = ctx.createRadialGradient(center[0], center[1], radius * .55, center[0], center[1], radius * (1.5 + .9 * cosmos));
      burn.addColorStop(0, `rgba(255, 216, 128, ${(.6 * cosmos).toFixed(3)})`);
      burn.addColorStop(.45, `rgba(238, 178, 58, ${(.26 * cosmos).toFixed(3)})`);
      burn.addColorStop(1, 'rgba(238, 178, 58, 0)'); ctx.fillStyle = burn; ctx.fillRect(0, 0, width, height);
    }
    if (lightTheme) {
      ctx.save(); ctx.translate(center[0], center[1] + radius * 1.15); ctx.scale(1, .13); const shadow = ctx.createRadialGradient(0, 0, radius * .1, 0, 0, radius * 1.25);
      shadow.addColorStop(0, '#39443724'); shadow.addColorStop(.55, '#70776110'); shadow.addColorStop(1, '#70776100');
      ctx.fillStyle = shadow; ctx.beginPath(); ctx.arc(0, 0, radius * 1.25, 0, TAU); ctx.fill(); ctx.restore();
    }
    ctx.save();
    if (onGlass) kernel.glassStars(lightTheme);   // THE SHAPES ARE RUST'S
    else for (let i = 0; i < STARS.length; i++) {
      const s = STARS[i], o = i * 4, x = starsBuf[o], y = starsBuf[o + 1], alpha = starsBuf[o + 2];
      if (starsBuf[o + 3] === 1) continue;
      ctx.fillStyle = lightTheme ? `rgba(133,112,71,${alpha * .9})` : `rgba(204,197,165,${alpha})`;
      ctx.beginPath(); ctx.arc(x, y, s.size, 0, TAU); ctx.fill();
      if (s.size > 1) {
        ctx.strokeStyle = lightTheme ? 'rgba(103,124,112,.19)' : 'rgba(195,173,119,.12)'; ctx.lineWidth = .6;
        ctx.beginPath(); ctx.moveTo(x - 5, y); ctx.lineTo(x + 5, y); ctx.moveTo(x, y - 5); ctx.lineTo(x, y + 5); ctx.stroke();
      }
    }
    ctx.restore();
  }

  function instrument(center, radius, front) {
    if (onGlass && !front) return void kernel.glassRings(lightTheme);   // THE SHAPES ARE RUST'S: the back rings and their ticks
    ctx.save();
    const colors = lightTheme ? ['rgba(132,111,63,.21)', 'rgba(103,120,102,.11)', 'rgba(71,128,125,.14)'] : ['rgba(194,163,99,.28)', 'rgba(153,164,131,.17)', 'rgba(118,179,175,.19)'];
    let tick = FRAME.RINGS;
    for (let index = 0; index < 3; index++) {
      ctx.strokeStyle = colors[index]; ctx.lineWidth = index === 0 ? .7 : .55; ctx.beginPath(); let pen = false;
      for (let i = 0; i <= 180; i++) {
        const o = (index * 181 + i) * 3;
        if ((ringsBuf[o + 2] > 0) !== front) { pen = false; continue; }
        pen ? ctx.lineTo(ringsBuf[o], ringsBuf[o + 1]) : ctx.moveTo(ringsBuf[o], ringsBuf[o + 1]); pen = true;
      }
      ctx.stroke(); const ticks = index === 0 ? 72 : 12;
      if (front) { tick += ticks * 4; continue; }
      // the ring's ticks in one path (they never cross: one stroke paints what 72 painted)
      ctx.beginPath();
      for (let j = 0; j < ticks; j++, tick += 4) { ctx.moveTo(ringsBuf[tick], ringsBuf[tick + 1]); ctx.lineTo(ringsBuf[tick + 2], ringsBuf[tick + 3]); }
      ctx.stroke();
    }
    ctx.restore();
  }

  // The one at the centre (his Oct 12 2026 10:1x: "we are going to select top "backers" and i will be at the center of this... the
  // Festival of Cannes of meme coins"): the Dyson sphere's star. His face in a disc with its light around it, drawn between the far
  // faces and the near ones, so it is seen through every panel still open; as backers take the panels the sphere closes on his light.
  function drawStar(center, radius, alpha, stage = null) {
    if (!mediaReady(star)) return;
    const r = radius * .34, [x, y] = center; ctx.save(); ctx.globalAlpha = alpha; const light = ctx.createRadialGradient(x, y, r * .9, x, y, radius * .98);
    light.addColorStop(0, 'rgba(255,233,178,.75)'); light.addColorStop(.45, 'rgba(244,206,128,.28)'); light.addColorStop(1, 'rgba(244,206,128,0)');
    ctx.fillStyle = light; ctx.beginPath(); ctx.arc(x, y, radius * .98, 0, TAU); ctx.fill();
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip(); drawPortrait(ctx, star, x - r, y - r, r * 2, r * 2, stage); ctx.restore();
    ctx.strokeStyle = '#d9b46a'; ctx.lineWidth = 1.4; ctx.shadowColor = '#ffe0a0'; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    ctx.restore();
  }

  // A GOLD RISES (RISE): each anchored gold in sight stands out of the glass as a prism, the far ones first: its walls that face the eye (far to
  // near), each in the gold's shade as it turns to the light with a fine line at each level, then its top catching the light; its mass and its
  // spark's mark move to the top, so the bronzes it holds are tethered there. Drawn after the faces, before the bronzes float.
  function drawRising(center, radius, spin) {
    if (!rising.length) return;
    const at = (p) => projectAt(rotate(p, spin.yaw, spin.pitch), center[0], center[1], radius), out = (v, k) => [v[0] * k, v[1] * k, v[2] * k];
    rising.sort((a, b) => a.depth - b.depth); ctx.save(); ctx.lineJoin = 'round';
    for (const g of rising) {
      const level = g.seat.level ?? 1, k = 1 + riseOf(level) * g.show, verts = g.face.verts, n = verts.length, c = g.face.center;
      const top = verts.map((v) => at(out(v, k)));
      const walls = verts.map((v, i) => {
        const w = verts[(i + 1) % n], mid = [(v[0] + w[0]) / 2, (v[1] + w[1]) / 2, (v[2] + w[2]) / 2];
        const across = unit(mid.map((m, j) => m - dot(mid, c) * c[j])), turned = rotate(across, spin.yaw, spin.pitch);
        return {v, w, z: rotate(out(mid, (1 + k) / 2), spin.yaw, spin.pitch)[2], lit: clamp(.3 + .7 * Math.max(0, dot(turned, LIGHT)))};
      }).sort((a, b) => a.z - b.z);
      for (const wall of walls) {
        const quad = [at(wall.v), at(wall.w), at(out(wall.w, k)), at(out(wall.v, k))], l = wall.lit; ctx.globalAlpha = .96 * g.show; path(ctx, quad);
        ctx.fillStyle = `rgb(${Math.round(132 + 84 * l)},${Math.round(96 + 66 * l)},${Math.round(34 + 40 * l)})`; ctx.fill();
        ctx.globalAlpha = .5 * g.show; ctx.strokeStyle = '#6e5016'; ctx.lineWidth = .6; ctx.stroke();
        ctx.globalAlpha = .45 * g.show; ctx.strokeStyle = '#f6e2a8'; ctx.lineWidth = .5;
        for (let L = 2; L <= level; L++) {   // a fine line round the walls where each level begins
          const kL = 1 + riseOf(L - 1) * g.show;
          const a = at(out(wall.v, kL)), b = at(out(wall.w, kL)); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
        }
      }
      const lit = clamp(.4 + .6 * Math.max(0, dot(rotate(c, spin.yaw, spin.pitch), LIGHT))); ctx.globalAlpha = g.show; path(ctx, top);
      ctx.fillStyle = `rgb(${Math.round(198 + 52 * lit)},${Math.round(156 + 62 * lit)},${Math.round(62 + 66 * lit)})`; ctx.fill();
      ctx.globalAlpha = .85 * g.show; ctx.strokeStyle = '#fff1c4'; ctx.lineWidth = .9; ctx.stroke();
      if (g.flash > 0) { ctx.globalAlpha = g.flash; ctx.strokeStyle = '#d9a23a'; ctx.lineWidth = 1.7; ctx.shadowColor = '#f0c870'; ctx.shadowBlur = 17; path(ctx, top); ctx.stroke(); ctx.shadowBlur = 0; }
      const mid = at(out(c, k)); massCenters.set(g.seat.home, mid); seatCenters.set(g.seat.id, mid); seatFace?.(ctx, {id: g.seat.id, points: top, mid, show: g.show, center, radius});
    }
    ctx.restore();
  }

  // A BRONZE FLOATS (his Oct 14 law, lab/mint-gravity.mjs: "they can be bronze ones and they just float and relocate"): over its land, off the glass,
  // bobbing, tethered to its home mass (a chair, or the gold that captured it); drawn after the faces and before his circle, its tether first
  function drawFloating(center, radius) {
    if (!floating.length) return;
    const t = reduced ? 0 : performance.now() / 1000, up = floating.map((f) => lifted(f, center, radius, t));
    ctx.save(); ctx.lineCap = 'round'; ctx.setLineDash([2, 3]);
    floating.forEach((f, i) => {
      const home = massCenters.get(f.seat.home);
      if (!home) return;
      ctx.globalAlpha = .34 * f.show; ctx.strokeStyle = '#a0703c'; ctx.lineWidth = .8;
      ctx.beginPath(); ctx.moveTo(...up[i].mid); ctx.lineTo(...home); ctx.stroke();
    });
    ctx.setLineDash([]);
    floating.forEach((f, i) => {
      const {mid, points} = up[i], lit = f.lit;
      seatCenters.set(f.seat.id, mid);
      path(ctx, points);
      ctx.globalAlpha = .9 * f.show; ctx.fillStyle = `rgb(${Math.round(148 + 62 * lit)},${Math.round(96 + 52 * lit)},${Math.round(50 + 38 * lit)})`; ctx.fill();
      ctx.globalAlpha = .7 * f.show; ctx.strokeStyle = '#7a4f26'; ctx.lineWidth = .9; ctx.stroke(); seatFace?.(ctx, {id: f.seat.id, points, mid, show: f.show, center, radius});
      if (f.flash > 0) {
        ctx.globalAlpha = f.flash; ctx.strokeStyle = '#c07a4a'; ctx.lineWidth = 1.7; ctx.shadowColor = '#f0c870'; ctx.shadowBlur = 17;
        path(ctx, points); ctx.stroke(); ctx.shadowBlur = 0;
      }
    });
    ctx.restore();
  }
  // where a floating bronze stands: off its face, out from the sphere and up the glass, by its own bob
  function lifted(f, center, radius, t) {
    const bob = FLOAT.bob * Math.sin(t * FLOAT.rate + (f.seat.face * 2.399) % TAU), k = 1 + FLOAT.lift * .4 + bob;
    const mid = [center[0] + (f.middle[0] - center[0]) * k, center[1] + (f.middle[1] - center[1]) * k - radius * (FLOAT.lift + bob)];
    const points = f.points.map(([x, y]) => {
      const px = center[0] + (x - center[0]) * k, py = center[1] + (y - center[1]) * k - radius * (FLOAT.lift + bob);
      return [mid[0] + (px - mid[0]) * FLOAT.shrink, mid[1] + (py - mid[1]) * FLOAT.shrink];
    });
    return {mid, points};
  }
  // A SEAT TAKES A HEXAGON: the spark that leaves the liquor where the seat's drop fell, between its landing and its hexagon's appearing, on an
  // arc up to the hexagon, a short tail behind it
  function drawSeatSparks(center, radius) {
    const now = Date.now(), R = radius * FLASK.fill;
    for (const seat of flask.seats()) {
      const p = (now - seat.land) / SEAT.spark_ms, to = seatCenters.get(seat.id);
      if (!(p >= 0 && p < 1) || !to) continue;
      const from = [center[0] + seat.x * R, center[1] + flask.surfaceAt(seat.x) * R];
      const lift = [(from[0] + to[0]) / 2, Math.min(from[1], to[1]) - R * .16];
      const at = (u) => [(1 - u) * (1 - u) * from[0] + 2 * u * (1 - u) * lift[0] + u * u * to[0], (1 - u) * (1 - u) * from[1] + 2 * u * (1 - u) * lift[1] + u * u * to[1]];
      const e = ease(p), gold = seat.metal === 'gold';
      ctx.save(); ctx.lineCap = 'round';
      for (let i = 9; i >= 1; i--) {
        const a = at(Math.max(0, e - i * .03)), b = at(Math.max(0, e - (i - 1) * .03));
        ctx.globalAlpha = (1 - i / 10) * .8; ctx.strokeStyle = gold ? '#e2a93c' : '#b9763f'; ctx.lineWidth = 3.6 - i * .3;
        ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
      }
      const head = at(e), glow = ctx.createRadialGradient(head[0], head[1], 0, head[0], head[1], 11);
      glow.addColorStop(0, '#fffbe8'); glow.addColorStop(.3, gold ? '#f3c24f' : '#d58a50'); glow.addColorStop(1, 'rgba(240,190,90,0)');
      ctx.globalAlpha = 1; ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(head[0], head[1], 11, 0, TAU); ctx.fill();
      ctx.restore();
    }
  }

  // THE MINT WINDOW's anime: the star's own picture and ring, grown and laid in front of the faces as the window opens; it comes through the
  // faces while still small (whole by two fifths of the way), so it opens as a window, not as a ghost over them. HIS GLOW (dl-mint-flask.js):
  // the circle drawn through its shader, his cosmos burning on in the stop, the ring breathing with it (the frame itself with no WebGL2)
  function drawMintStar(center, radius, k) {
    if (!mediaReady(star)) return;
    const r = radius * lerp(.34, MINT_WINDOW.star, k), [x, y] = center, stage = {key: Number.isFinite(moment) ? moment : null, side: stageSide};
    const seconds = reduced ? 0 : performance.now() / 1000, breath = .5 + .5 * Math.sin(seconds * 1.9) * Math.sin(seconds * .73 + 1.3);
    ctx.save(); ctx.globalAlpha = ease(k * 2.5);
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.clip();
    // the anime behind the liquor (his "can you make the anime behind the liquor?"): under the flask's surface the shader shows him through it,
    // and a drop falling in front of him is drawn over him
    const film = star instanceof HTMLVideoElement ? stagedFilm(star, stage) : null, flaskR = radius * FLASK.fill;
    const lit = film ? flask.aura(film.canvas, film.key, k, seconds, r * 2 * dpr, r / flaskR) : null;
    if (lit) ctx.drawImage(lit, x - r, y - r, r * 2, r * 2); else drawPortrait(ctx, star, x - r, y - r, r * 2, r * 2, stage);
    flask.paintAbove(ctx, x, y, flaskR, r, k, dpr);
    ctx.restore();
    ctx.strokeStyle = '#d9b46a'; ctx.lineWidth = 1.6; ctx.shadowColor = '#ffe0a0'; ctx.shadowBlur = 18 + 16 * breath * k;
    ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.stroke();
    ctx.restore();
  }

  function drawCosmosCore(center, radius, alpha) {
    const {heat, opening, release} = bodyState;
    if (heat <= 0) return;
    const [x, y] = center, r = radius * (.55 + .16 * opening + .06 * release);
    ctx.save(); ctx.globalAlpha = alpha * heat;
    const glow = ctx.createRadialGradient(x - r * .12, y - r * .1, r * .08, x, y, r * 1.65);
    glow.addColorStop(0, '#fffefa'); glow.addColorStop(.3, '#fff3b5');
    glow.addColorStop(.52, '#f5c34fcc'); glow.addColorStop(.78, '#dd9c252b'); glow.addColorStop(1, '#c8871800');
    ctx.fillStyle = glow; ctx.beginPath(); ctx.arc(x, y, r * 1.65, 0, TAU); ctx.fill();
    // A finite pulse leaves the opened vessel on the strike, without erasing its faces.
    if (release > 0) {
      ctx.globalAlpha = alpha * release * .4; ctx.strokeStyle = '#f8cf6c'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.ellipse(x, y, radius * (1 + .6 * release), radius * (.25 + .1 * release), -.3, 0, TAU); ctx.stroke();
    }
    ctx.restore();
  }

  // nearOnly: the far faces left out (THE UNITS' LADDER: a grown unit's far side lies under its near one)
  // THE UNITS' SKINS, BATCHED (the same bench, Oct 21 2026): a miniature's faces are a convex solid's, its near faces never over one another and
  // its far ones all under them, so within a side the picture is the same in any order: the faces of one colour go down in one path and one
  // fill (lit in 32 steps, under a unit of RGB apart), and a side's seams in one stroke a colour, where every face was a path, a colour, a fill
  // and a stroke of its own (a unit1 of 110 hexagons: 61 of each a frame, and 156 units a frame). A face's seam is painted after every fill of
  // its side either way: a shared edge wore the later face's whole stroke before too.
  const miniFills = new Map(), miniStrokes = [[], [], [], []], miniColours = new Map();   // fills: colour key -> faces; strokes: far hex, far pent, near hex, near pent
  function miniColour(pentagon, lit, variation, seed) {
    if (!lightTheme) return pentagon ? `rgb(${Math.round(87 + 124 * lit)},${Math.round(74 + 108 * lit)},${Math.round(43 + 74 * lit)})`
      : `rgb(${Math.round(102 + 126 * lit)},${Math.round(105 + 112 * lit)},${Math.round(93 + 104 * lit)})`;
    if (!pentagon) return `rgb(${Math.round(185 + 63 * lit + variation)},${Math.round(190 + 58 * lit + variation)},${Math.round(178 + 62 * lit + variation)})`;
    return seed >= 1
      ? `rgb(${Math.round(192 + 56 * lit)},${Math.round(195 + 53 * lit)},${Math.round(185 + 56 * lit)})`
      : seed <= 0
        ? `rgb(${Math.round(148 + 83 * lit)},${Math.round(131 + 78 * lit)},${Math.round(86 + 70 * lit)})`
        : `rgb(${Math.round(lerp(148 + 83 * lit, 192 + 56 * lit, seed))},${Math.round(lerp(131 + 78 * lit, 195 + 53 * lit, seed))},${Math.round(lerp(86 + 70 * lit, 185 + 56 * lit, seed))})`;
  }
  function facePath(buf, f, nv) {
    const o = f * FRAME.FACE_OUT;
    ctx.moveTo(buf[o + 4], buf[o + 5]);
    for (let v = 1; v < nv; v++) ctx.lineTo(buf[o + 4 + v * 2], buf[o + 5 + v * 2]);
    ctx.closePath();
  }
  function drawMiniature(skin, buf, count, npent, alpha, nearOnly) {
    const seed = skin.seedness ?? (skin.hexes.length === 0 ? 1 : 0), seedQ = Math.round(seed * 48);
    miniFills.clear(); for (const list of miniStrokes) list.length = 0;
    for (let k = 0; k < count; k++) {
      const f = buf[count * FRAME.FACE_OUT + k], o = f * FRAME.FACE_OUT, front = buf[o + 22] === 1;
      if (nearOnly && !front) continue;
      const pentagon = f < npent, side = (front ? 2 : 0) + (pentagon ? 1 : 0);
      const key = side * 4096 + Math.round(buf[o + 1] * 32) * 8 + (pentagon ? 0 : (f - npent) % 5);
      let faces = miniFills.get(key);
      if (!faces) miniFills.set(key, faces = []);
      faces.push(f); miniStrokes[side].push(f);
    }
    ctx.save(); ctx.lineJoin = 'round'; ctx.lineWidth = .5;
    for (let side = nearOnly ? 2 : 0; side < 4; side += 2) {   // the far faces first, faint, then the near
      ctx.globalAlpha = alpha * (side ? 1 : .15);
      for (const [key, faces] of miniFills) {
        if ((key >> 12) - (key >> 12 & 1) !== side) continue;
        const pentagon = key >> 12 & 1, litQ = key & 4095;
        const colour = `${key}|${seedQ}`;
        let fill = miniColours.get(colour);
        if (!fill) miniColours.set(colour, fill = miniColour(pentagon, (litQ >> 3) / 32, pentagon ? 0 : ((litQ & 7) - 2) * 1.2, seed));
        ctx.fillStyle = fill; ctx.beginPath();
        for (const f of faces) facePath(buf, f, pentagon ? 5 : 6);
        ctx.fill();
      }
      for (let pentagon = 0; pentagon < 2; pentagon++) {
        const faces = miniStrokes[side + pentagon];
        if (!faces.length) continue;
        ctx.strokeStyle = lightTheme
          ? (side ? pentagon ? 'rgba(151,113,42,.74)' : 'rgba(69,78,65,.40)' : 'rgba(91,109,88,.28)')
          : side ? (pentagon ? 'rgba(227,197,128,.66)' : 'rgba(173,160,112,.37)') : 'rgba(161,150,106,.3)';
        ctx.beginPath();
        for (const f of faces) facePath(buf, f, pentagon ? 5 : 6);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
  function drawSkin(skin, center, radius, spin, members, alpha = 1, miniature = false, nearOnly = false) {
    const memberByFace = new Map();
    if (members) for (const slot of members.values()) memberByFace.set(slot.faceIndex, slot);
    // THE FRAME: every face turned, lit, projected and sorted far to near by the kernel (or its JS twin), read off one buffer
    const pack = packSkin(skin), count = pack.n, npent = skin.pents.length;
    const transforming = !miniature && bodyState.heat > 0;
    // THE COLONY (lab/the-colony.mjs): the dodecahedron explodes, each panel flung out across the screen with its film, COLONY_REACH radii
    // along its own line from the centre (a face square to the viewer along its golden-angle line, blended into its lean as it turns)
    const burstReach = miniature ? 0 : (bodyState.burst || 0) * radius * COLONY_REACH;
    if (transforming) bodyPacked = cosmosPanels(pack.packed, count, FRAME.FACE_IN, bodyState, bodyPacked);
    const packed = transforming ? bodyPacked : pack.packed;
    const seats = members === layout.slots && mintNowK > 0 && !growth ? flask.seats() : null, flaskNow = Date.now();
    const onFaces = seats?.length ? seatsOnFaces(seats) : null;
    if (members === layout.slots) { floating.length = 0; rising.length = 0; }
    const buf = frameOf().faces(packed, count, spin.yaw, spin.pitch, center[0], center[1], radius) || jsFrame.faces(packed, count, spin.yaw, spin.pitch, center[0], center[1], radius);
    if (!buf) return;
    if (miniature) { drawMiniature(skin, buf, count, npent, alpha, nearOnly); return; }
    const stage = miniature ? null : {key: Number.isFinite(moment) ? moment : null, side: stageSide};
    ctx.save(); ctx.lineJoin = 'round';
    let starBehind = !miniature;
    for (let k = 0; k < count; k++) {
      const f = buf[count * FRAME.FACE_OUT + k], o = f * FRAME.FACE_OUT, pentagon = f < npent, index = pentagon ? -1 : f - npent;
      const face = pentagon ? skin.pents[f] : skin.hexes[index], depth = buf[o], front = buf[o + 22] === 1;
      if (nearOnly && !front) continue;
      if (starBehind && front) {
        drawStar(center, radius, alpha, stage);
        if (transforming) drawCosmosCore(center, radius, alpha);
        // THE FLASK (dl-mint-flask.js): the mint's liquor inside the glass, behind its near faces and the anime's circle
        if (mintNowK > 0) flask.paint(ctx, center[0], center[1], radius * FLASK.fill, alpha * mintNowK, dpr, Date.now(), mintMode === 'ahead' ? priorRise(mintNowK) : 1);
        starBehind = false;
      }
      // a member still waiting for their turn on the carpet is not on the sphere yet; THE MINT WINDOW: the illustration's seats empty as the
      // window opens (kept, 1 to 0), so on the stop every hexagon is unallocated, no one's yet: the window starts from nothing
      const member = memberByFace.get(index), held = member && clock >= member.born ? member : undefined;
      const kept = held ? (mode === 'illustration' ? 1 - mintNowK : 1) : 0, slot = kept > 0 ? held : undefined;   // a confirmed seat stays
      const vacantSeat = !pentagon && !slot && !miniature;
      // a seat of the mint: one paid before the viewer came comes in at its point of the crossing; one paid on the stop as its spark reaches it
      const seat = onFaces && !pentagon ? onFaces.get(index) : undefined;
      const seatShow = !seat ? 0 : seat.prior ? ease((mintNowK - seat.k) / .07) : flaskNow >= seat.appear ? ease((flaskNow - seat.appear) / 450) : 0;
      const seatFlash = !seat ? 0 : seat.prior ? (mintNowK >= seat.k ? 1 - ease((mintNowK - seat.k) / .14) : 0) : flaskNow >= seat.appear ? 1 - ease((flaskNow - seat.appear) / 2100) : 0;
      const seedFrame = pentagon && skin.hexes.length === 0 && !miniature;
      let ox = 0, oy = 0;
      if (burstReach > 0) {
        const dx = buf[o + 2] - center[0], dy = buf[o + 3] - center[1], dl = Math.hypot(dx, dy), lean = Math.min(1, dl / (radius * .25)), a = f * 2.39996;
        const ux = Math.cos(a) * (1 - lean) + (dl > 0 ? dx / dl : 0) * lean, uy = Math.sin(a) * (1 - lean) + (dl > 0 ? dy / dl : 0) * lean, ul = Math.hypot(ux, uy) || 1;
        ox = ux / ul * burstReach; oy = uy / ul * burstReach;
      }
      const nv = face.verts.length, points = new Array(nv);
      for (let v = 0; v < nv; v++) points[v] = [buf[o + 4 + v * 2] + ox, buf[o + 5 + v * 2] + oy];
      const age = slot ? clock - slot.born : 10;
      const arriving = slot && (slot.isNew || continuingArrivals.has(slot.seat.id));
      const forming = arriving ? ease(age / 1.7) : 1;
      const lit = buf[o + 1];
      const person = pentagon && front && !miniature ? chairs[Number(face.id.split(':')[1])] : null;
      const portrait = mediaReady(person) ? person : null;
      ctx.globalAlpha = alpha * (front ? 1 : .15);
      if (lightTheme && pentagon) {
        // the seed's silver frame, a grown skin's gold chairs, and between them a unit's first hexagons opening (THE UNITS' LADDER)
        const seed = skin.seedness ?? (skin.hexes.length === 0 ? 1 : 0);
        ctx.fillStyle = seed >= 1
          ? `rgb(${Math.round(192 + 56 * lit)},${Math.round(195 + 53 * lit)},${Math.round(185 + 56 * lit)})`
          : seed <= 0
            ? `rgb(${Math.round(148 + 83 * lit)},${Math.round(131 + 78 * lit)},${Math.round(86 + 70 * lit)})`
            : `rgb(${Math.round(lerp(148 + 83 * lit, 192 + 56 * lit, seed))},${Math.round(lerp(131 + 78 * lit, 195 + 53 * lit, seed))},${Math.round(lerp(86 + 70 * lit, 185 + 56 * lit, seed))})`;
      } else if (lightTheme && (slot || miniature)) {
        const variation = (index % 5 - 2) * 1.2;
        ctx.fillStyle = `rgb(${Math.round(185 + 63 * lit + variation)},${Math.round(190 + 58 * lit + variation)},${Math.round(178 + 62 * lit + variation)})`;
      } else if (lightTheme) {
        ctx.fillStyle = `rgba(${Math.round(209 + 25 * lit)},${Math.round(213 + 24 * lit)},${Math.round(204 + 27 * lit)},${front ? .78 : .15})`;
      } else if (pentagon) {
        ctx.fillStyle = `rgb(${Math.round(87 + 124 * lit)},${Math.round(74 + 108 * lit)},${Math.round(43 + 74 * lit)})`;
      } else if (slot || miniature) {
        const brightness = lerp(.23, 1, forming);
        ctx.fillStyle = `rgb(${Math.round((102 + 126 * lit) * brightness)},${Math.round((105 + 112 * lit) * brightness)},${Math.round((93 + 104 * lit) * brightness)})`;
      } else {
        ctx.fillStyle = `rgba(${Math.round(22 + 17 * lit)},${Math.round(30 + 21 * lit)},${Math.round(25 + 15 * lit)},.94)`;
      }
      // A vacant place is an opening in the wireframe. Only an occupied place
      // receives material; the initial twelve-pentagon seed is a metal frame.
      path(ctx, points);
      if (portrait) {
        // one of the twelve: the person's picture on the pentagon, shaded on the side the panels around it are shaded
        ctx.save(); ctx.clip(); ctx.transform(buf[o + 16], buf[o + 17], buf[o + 18], buf[o + 19], buf[o + 20] + ox, buf[o + 21] + oy); drawPortrait(ctx, portrait, -1, -1, 2, 2, stage); ctx.restore();
        ctx.save(); ctx.globalAlpha *= (1 - lit) * .5; ctx.fillStyle = lightTheme ? '#2f3328' : '#050706'; path(ctx, points); ctx.fill(); ctx.restore();
        path(ctx, points);
      } else if (seatShow > 0 && seat.anchored) {
        // a gold of the mint: anchored, set into the glass on its own land as its spark reaches it
        ctx.save(); ctx.globalAlpha = alpha * (front ? .9 : .15) * seatShow;
        ctx.fillStyle = `rgb(${Math.round(176 + 70 * lit)},${Math.round(136 + 72 * lit)},${Math.round(52 + 60 * lit)})`;
        ctx.fill(); ctx.restore();
      } else if (seatShow > 0) {
        // a bronze of the mint floats over its land: the land shows the shadow it casts
        ctx.save(); ctx.globalAlpha = alpha * (front ? .16 : .05) * seatShow; ctx.fillStyle = '#5a3c1e'; ctx.fill(); ctx.restore();
      } else if (!vacantSeat && !seedFrame && !seat) {
        if (slot) { ctx.save(); ctx.globalAlpha *= kept; ctx.fill(); ctx.restore(); }   // the seat's material leaves it as the window opens
        else ctx.fill();
      }
      ctx.strokeStyle = lightTheme
        ? (front ? pentagon ? 'rgba(151,113,42,.74)' : 'rgba(69,78,65,.40)' : 'rgba(91,109,88,.28)')
        : front ? (pentagon ? 'rgba(227,197,128,.66)' : 'rgba(173,160,112,.37)') : 'rgba(161,150,106,.3)';
      ctx.lineWidth = miniature ? .5 : .65; ctx.stroke();
      if (transforming && front) {
        // Light comes through the actual panel seams; the film keeps playing on each separated face.
        ctx.save();
        ctx.globalAlpha = alpha * bodyState.heat * .22; ctx.strokeStyle = '#d09a32'; ctx.lineWidth = 5;
        ctx.stroke();
        ctx.globalAlpha = alpha * bodyState.heat * .95; ctx.strokeStyle = '#fff0b5'; ctx.lineWidth = 1.5;
        ctx.stroke(); ctx.restore();
      }
      if (front && !miniature && alpha > .7) hitFaces.push({points, face, slot, index, depth});
      if (miniature) continue;
      const middle = [buf[o + 2] + ox, buf[o + 3] + oy];
      anchors.set(slot ? slot.seat.id : face.id, {x: middle[0], y: middle[1], z: depth, points});
      if (pentagon && front) massCenters.set(`chair:${Number(face.id.split(':')[1])}`, middle);
      if (seat?.anchored && front) { massCenters.set(seat.home, middle); seatCenters.set(seat.id, middle); }
      if (seat?.anchored && front && seatShow > 0) rising.push({seat, face, depth, show: seatShow, flash: seatFlash});
      if (seat && !seat.anchored && front && seatShow > 0) floating.push({seat, points, middle, lit, show: seatShow, flash: seatFlash});
      if (!front) continue;
      if (lightTheme && radius > 90 && !vacantSeat && !seedFrame) {
        // A narrow inset catches the light like a machined panel edge. The
        // polygon remains the actual Goldberg face, not a decorative overlay.
        const inset = points.map(([x, y]) => [lerp(x, middle[0], .055), lerp(y, middle[1], .055)]);
        ctx.globalAlpha = alpha * .48 * (slot ? kept : 1);
        ctx.strokeStyle = pentagon ? '#f5e6bf' : '#ffffff'; ctx.lineWidth = .7;
        path(ctx, inset); ctx.stroke();
      }
      if (pentagon && radius > 90 && !portrait) {
        const chair = Number(face.id.split(':')[1]);
        ctx.globalAlpha = alpha * (.35 + lit * .35);
        ctx.strokeStyle = lightTheme ? '#907340' : '#ede1b2'; ctx.lineWidth = .65;
        const r = radius * .008;
        ctx.beginPath(); ctx.arc(...middle, r, 0, TAU); ctx.stroke();
        if (depth > .5) {
          ctx.fillStyle = lightTheme ? '#786a47' : '#e7d6a4'; ctx.font = `${Math.max(6, radius * .022)}px ui-monospace,monospace`; ctx.textAlign = 'center';
          ctx.fillText(String(chair + 1).padStart(2, '0'), middle[0], middle[1] + radius * .041);
        }
      } else if (slot && radius > 180) {
        ctx.globalAlpha = alpha * .7 * forming * kept;
        ctx.fillStyle = lightTheme ? selectedId === slot.seat.id ? '#4b988b' : '#a17b37' : selectedId === slot.seat.id ? '#bde2cc' : '#f3df9d';
        ctx.beginPath(); ctx.arc(...middle, selectedId === slot.seat.id ? 3 : 1.25, 0, TAU); ctx.fill();
      }
      if (seatFlash > 0 && seat.anchored) {
        ctx.globalAlpha = alpha * seatFlash;
        ctx.strokeStyle = seat.metal === 'gold' ? '#d9a23a' : '#c07a4a'; ctx.lineWidth = 1.7;
        ctx.shadowColor = '#f0c870'; ctx.shadowBlur = 17;
        path(ctx, points); ctx.stroke(); ctx.shadowBlur = 0;
      }
      if (arriving && age < 2.1) {
        ctx.globalAlpha = alpha * (1 - ease(age / 2.1)) * kept;
        ctx.strokeStyle = lightTheme ? '#b38325' : '#f1d48a'; ctx.lineWidth = 1.7;
        ctx.shadowColor = '#e9c278'; ctx.shadowBlur = 17;
        path(ctx, points); ctx.stroke(); ctx.shadowBlur = 0;
      }
      if (slot && selectedId === slot.seat.id) {
        ctx.globalAlpha = alpha * .8 * kept; ctx.strokeStyle = lightTheme ? '#b9862f' : '#f5dda0'; ctx.lineWidth = 2;
        ctx.shadowColor = '#e5c782'; ctx.shadowBlur = 17;
        path(ctx, points); ctx.stroke(); ctx.shadowBlur = 0;
      }
      if (slot && mine.has(slot.seat.id)) {
        // the hexagon this viewer holds: gold among the ivory, the first one they see
        ctx.globalAlpha = alpha * .58 * forming * kept; ctx.fillStyle = lightTheme ? '#dcb867' : '#e8c77a'; path(ctx, points); ctx.fill();
        ctx.globalAlpha = alpha * forming * kept; ctx.strokeStyle = lightTheme ? '#a77a26' : '#f5dda0'; ctx.lineWidth = 1.8;
        ctx.shadowColor = '#e5c782'; ctx.shadowBlur = 12; path(ctx, points); ctx.stroke(); ctx.shadowBlur = 0;
      }
      const waveAge = clock - waveAt - 1.2;
      if (waveNormal && waveAge >= 0 && waveAge < 2.2) {
        const angularDistance = Math.acos(clamp(dot(face.normal, waveNormal), -1, 1));
        const wave = clamp(1 - Math.abs(angularDistance - waveAge * 1.6) / .3) * (1 - waveAge / 2.2);
        if (wave > 0) {
          ctx.globalAlpha = wave * alpha * .8; ctx.fillStyle = '#e4c87f';
          path(ctx, points);
          if (vacantSeat || seedFrame) { ctx.strokeStyle = '#b28a3e'; ctx.lineWidth = 1; ctx.stroke(); }
          else ctx.fill();
        }
      }
    }
    ctx.restore();
  }

  // The red carpet (his Oct 12 2026 10:1x: "this has to become and feel like the Festival of Cannes of meme coins"): nobody flies in from
  // off the sphere any more (forty gold curves at once were noise). A member walks in on their turn and the flashes go off where they land:
  // three glints, a white core in a gold halo, gone in under a second.
  function arrivals(center, radius) {
    if (colonySpread >= 1 || mintNowK > .999) return;   // THE COLONY: the faces they flash on are under the film; THE MINT WINDOW: on the stop the illustration's seats are empty, so none walks in (a glint there stood frozen while the sphere was held)
    ctx.save();
    for (const slot of layout.slots.values()) {
      const age = clock - slot.born;
      if ((!slot.isNew && !continuingArrivals.has(slot.seat.id)) || age < 0 || age > .7) continue;
      if (rotate(slot.face.normal, yaw, pitch)[2] < .05) continue;
      const at = project(rotate(slot.face.center, yaw, pitch), center, radius);
      for (let k = 0; k < 3; k++) {
        const t = (age - k * .11) / .34;
        if (t < 0 || t > 1) continue;
        const a = slot.faceIndex * 2.399963 + k * 2.1, d = radius * (.03 + .03 * k);
        const x = at[0] + Math.cos(a) * d, y = at[1] + Math.sin(a) * d, s = (radius * .028 + 2) * (1 - t * .5);
        ctx.globalAlpha = (1 - t) * (1 - colonySpread);
        const core = ctx.createRadialGradient(x, y, 0, x, y, s * 2.2);
        core.addColorStop(0, 'rgba(255,255,255,1)'); core.addColorStop(.3, 'rgba(255,226,150,.75)'); core.addColorStop(1, 'rgba(255,226,150,0)');
        ctx.fillStyle = core; ctx.beginPath(); ctx.arc(x, y, s * 2.2, 0, TAU); ctx.fill();
        ctx.strokeStyle = lightTheme ? 'rgba(170,128,46,.9)' : 'rgba(255,240,200,.95)'; ctx.lineWidth = .9;
        ctx.shadowColor = '#ffe3a1'; ctx.shadowBlur = 8;
        ctx.beginPath(); ctx.moveTo(x - s * 3, y); ctx.lineTo(x + s * 3, y); ctx.moveTo(x, y - s * 3); ctx.lineTo(x, y + s * 3);
        ctx.moveTo(x - s, y - s); ctx.lineTo(x + s, y + s); ctx.moveTo(x - s, y + s); ctx.lineTo(x + s, y - s); ctx.stroke();
        ctx.shadowBlur = 0;
      }
    }
    ctx.restore();
  }

  // THE TRACE (lab/heartbeat.js, his "make each of them a fucking line like ecg dude... not alive lines"): while the heart beats, one orbit's
  // trail is an ECG strip, each of its samples moved across the line's own direction by the heart's PQRST at its age (the head now, the
  // tail TRACE.seconds ago), four samples to each of the orbit's 64 steps so the R spike is drawn, not stepped over; the strip fades from its
  // head as the trail did, in TRACE_BANDS strokes (12 orbits, 96 strokes a draw, against the trail's 780). The samples' places come off the
  // frame's trace buffer (the kernel's, or jsFrame's), one chair's run of (n + 1) x [x, y, band, on].
  function traceOrbit(chair, color, front) {
    const n = traceLen - 1, base = chair * traceLen * 4;
    ctx.strokeStyle = color; ctx.lineJoin = 'round';
    let band = -1, open = false, has = false, px = 0, py = 0;
    for (let j = n; j >= 0; j--) {
      const o = base + (n - j) * 4, x = traceBuf[o], y = traceBuf[o + 1], b = traceBuf[o + 2], on = (traceBuf[o + 3] === 1) === front;   // the sample's side is this pass's
      if (open && (b !== band || !on)) { ctx.lineTo(x, y); ctx.stroke(); open = false; }
      if (on && !open) {
        band = b; const age = 1 - (b + .5) / TRACE_BANDS;
        ctx.globalAlpha = Math.min(1, (.12 + (1 - age) * .62) * (front ? 1 - twelveBehind : .5));
        ctx.lineWidth = .5 + (1 - age) * 1.1;
        ctx.beginPath(); if (has) ctx.moveTo(px, py); else ctx.moveTo(x, y); open = true;
      }
      if (open) ctx.lineTo(x, y);
      px = x; py = y; has = true;
    }
    if (open) ctx.stroke();
  }

  // Every Unit1 is the centre of its own twelve Unit2s, and each Unit2 has its own twelve Unit3s.
  // This is the galaxy journey's parent-relative composition: parent + local orbit * parent scale.
  // The parents stay readable; only tiny descendants resolve into wings. No unrelated flat particle cloud.
  function riteUnit(pos, r, chair, z, front, cx, cy, birth = null, stageRadius = 1) {
    const f = riteNow.flock, family = riteNow.family, t = riteNow.t, plan = pullPlanNow();
    const phase = f.phase + chair * .43, turn = phase * .3 + .35 * Math.sin(phase * .7) + f.bank;
    const cs = Math.cos(turn), sn = Math.sin(turn);
    const reach = (2.5 + f.spread * .25) * (1 - .28 * f.charge + .6 * f.release);
    const rootSize = r * (1 - .24 * f.refinement);
    const birdColor = lightTheme ? ['#806438', '#386b65', '#8a724b', '#526a7c'][chair % 4] : '#dacda7';
    for (const node of family) {
      const index = node.id * 3, parent = node.parent === null ? null : node.parent * 3;
      let px = pos[0], py = pos[1], zz = z;
      if (parent !== null) {
        const u = phase * (.5 + node.depth * .18) + node.chair * TAU / 12 + node.parent * .43;
        const q = loopUnitAt(node.chair, u, f.orbitTime * 1000);
        // THE PULL: a swarm's unit3s draw in round it as it falls onto its hex
        const orbit = rootSize * node.scale / riteNow.childScale * reach * node.amount * (node.depth === 3 ? 1 - PULL.gather * Math.min(1, familyPull[node.parent]) : 1);
        const hand = riteNow.offset((chair + node.parent) % 12, 0);
        const x = q[0] * f.stretch + hand[0] * .35, y = -q[1] / f.stretch + hand[1] * .35;
        px = familyPose[parent] + (x * cs - y * sn) * orbit;
        py = familyPose[parent + 1] + (x * sn + y * cs) * orbit;
        zz = familyPose[parent + 2] + q[2] * .18 * node.scale * node.amount;
      }
      // THE COLONY (lab/the-colony.mjs): a unit2 is flung apart at the burst (its unit3s placed from it), then every unit2 and unit3 is an
      // arrow of THE FLOW, tracing the lines the film's shot draws; the unit1s stay steady (his "keep the 12 unit1 satellites steady and have
      // unit2s be the arrows and unit3s and so on")
      let arrow = null, linkFade = parent === null ? 1 : 1 - familyStrike[node.parent];
      if (node.depth === 2 && colonyFling > 0) { px += (px - cx) * colonyFling; py += (py - cy) * colonyFling; }
      if (node.depth >= 2 && flowNow && flowNow.pull > 0 && colonyPic) {
        arrow = flowPoint(node.depth === 2 ? (node.id - 1) * 12 + chair : 144 + (node.id - 13) * 12 + chair, riteNow.t, flowNow.shot, flowNow.since);
        const k = flowNow.pull, sc = colonyPic.scale;
        px += (colonyPic.left + arrow.x * sc - px) * k; py += (colonyPic.top + arrow.y * sc - py) * k;
        linkFade = 1 - k;
      }
      // THE PULL: a unit2 falls with its swarm onto its own hex and is caught there; the unit1 is on its post already (orbitalSocieties)
      // THE VOLLEY: when a swarm leaves its hex for the sphere's centre, its unit2 first and each leaf `lag` after the one before it; once
      // delivered it is no more drawn, to the loop (the end card's twelve, with no hex to stand on, never bring it back)
      if (node.depth === 2) familyLaunch[node.id] = volleyLaunch(node, chair); if (node.depth === 2 && riteNow.strike) familyLaunch[node.id] = Infinity;   // where a page asks THE THREE WAVES, the swarms strike on its beats, never on the mint's volley
      const flight = node.depth === 2 ? volleyAt(familyLaunch[node.id], t) : node.depth === 3 ? volleyAt(familyLaunch[node.parent] + VOLLEY.lag * (1 + node.chair), t) : 0;
      let pull = 0, form = 0;
      if (plan) {
        pull = node.depth === 2 ? pullAt(node, chair, t) : node.depth === 1 ? pullAt(PULL_ROOT, chair, t) : familyPull[node.parent];
        if (node.depth === 2 && pull > 0) {
          const hex = plan.swarms[chair * 12 + node.chair], since = t - PULL.at - pullFall(node, chair);
          familyHex[node.id] = hex; familyCaught[node.id] = PULL.at + pullFall(node, chair);
          // its post drawn in to the sphere's centre as it flies, and the swarm with it
          pullPlace(pullOut, 12 + hex, formPostLift(hex, formLift(t), volleyPath(flight)), pull, px, py, zz, [cx, cy], stageRadius, .2);
          px = pullOut[0]; py = pullOut[1]; zz = pullOut[2];
          // its hex warms as the swarm falls to it and flashes as it is caught, and again as the swarm leaves it
          pullCatch(hex, since < 0 ? .3 * pull : 1 - clamp(since / .45), front, [cx, cy], stageRadius);
          if (flight > 0) pullCatch(hex, 1 - clamp(flight * VOLLEY.flight / .45), front, [cx, cy], stageRadius);
        } else if (node.depth === 3 && pull > 0) {
          // THE FORMATION: a leaf leaves its orbit round its unit2 for its own place on the swarm's hex, and from there, THE VOLLEY, flies
          // into the sphere's centre `lag` after the one before it
          form = formAt(familyCaught[node.parent], t);
          if (form > 0) {
            formPlace(formOut, familyHex[node.parent], node.chair, formLift(t), volleyPath(flight), [cx, cy], stageRadius);
            px = lerp(px, formOut[0], form); py = lerp(py, formOut[1], form); zz = lerp(zz, formOut[2], form);
            linkFade *= 1 - form;
          }
        }
      }
      familyPull[node.id] = pull;
      // delivered: a unit folding into the core grows smaller and fainter, and once in it is no more drawn
      const st = riteNow.strike ? riteNow.strike(strikeOut, node.depth, chair, node.id, t, px, py, cx, cy, stageRadius) : false; familyStrike[node.id] = st ? strikeOut[2] : 0; if (st) { px = strikeOut[0]; py = strikeOut[1]; zz = lerp(zz, 1, strikeOut[2]); linkFade *= 1 - strikeOut[2]; if (front && strikeOut[4] >= 0 && strikeOut[4] < SPARK_S) { const o = impactN++ * 5; impactBuf[o] = px; impactBuf[o + 1] = py; impactBuf[o + 2] = strikeOut[4]; impactBuf[o + 3] = node.depth; impactBuf[o + 4] = node.id + chair * 157; } } const seenV = flight > 0 ? volleySeen(flight) : st ? strikeOut[3] : 1, shrink = .4 + .6 * seenV;   // THE THREE WAVES (after-the-mint-tree.mjs strikeAt, where the page asks it): a body's way at Dolbar on its wave's beat, whole until it strikes him, then broken into light where it hit (paintCore)
      // THE FIELD: in front of the dodecahedron the unit is pushed off its faces; its children are placed from where it is pushed to (not
      // a unit THE PULL has caught: it rests on its face)
      const body = Math.max(.65, rootSize * node.scale);
      fieldAt(fieldOut, px, py, zz, body, cx, cy, fieldRadius, fieldOn * (1 - Math.min(1, pull)));
      px = fieldOut[0]; py = fieldOut[1];
      const fade = fieldOut[2] * (parent === null ? 1 : familyFade[node.parent]);
      familyFade[node.id] = fade;
      familyPose[index] = px; familyPose[index + 1] = py; familyPose[index + 2] = zz;
      // THE COLONY: a unit behind the sphere comes in front of the film as the sphere bursts, and goes back behind it as it closes; an arrow
      // is always in front of the film, as seen as its place on its path, or its flash where it is spent
      // a unit1, steady, is left behind the film while it holds the stage (twelveBehind)
      const k = arrow ? flowNow.pull : 0, lift = !(zz > 0) && colonyLift > 0, pass = zz > 0 || lift || k > 0;
      const shown = (lift ? colonyLift : 1) * (arrow ? 1 + (arrow.alpha - 1) * k : node.depth === 1 ? 1 - twelveBehind : 1) * seenV, flash = arrow ? (lift ? colonyLift : 1) * arrow.hit * k : 0;
      if (pass === front && fade * Math.max(shown, flash) > .002) {
        const draw = familyDrawPool[chair * 157 + node.id];
        draw.node = node; draw.px = px; draw.py = py; draw.zz = zz;
        draw.parentX = parent === null ? px : familyPose[parent];
        draw.parentY = parent === null ? py : familyPose[parent + 1];
        draw.chair = chair; draw.turn = turn; draw.birdColor = birdColor; draw.linkFade = linkFade;
        draw.flowK = k; draw.flowDx = arrow ? arrow.dx : 0; draw.flowDy = arrow ? arrow.dy : 0; draw.flowSpeed = arrow ? arrow.speed * colonyPic.scale : 0;
        draw.flowGlow = arrow ? arrow.glow : 1;
        draw.body = body * shrink;
        // THE ORIGAMI (lab/origami.mjs): a body in the making or a leaf is drawn as its hinged pentagons (oModel), a grown parent as its skin
        draw.oModel = null; draw.oFilm = null; draw.oHeading = null;
        let born = Math.min(1, node.amount * 3) * riteNow.amount;
        if (node.depth === 1 && birth) {
          // THE BIRTH: the page's own face, lifted off and flown flat on his hand, then folded shut on its orbit into the seed it grows from
          const flat = qMul(qAxis(0, 0, 1, (t - BIRTH.peel) * 2.2 + chair * .5), origami[chair].turn);
          draw.oModel = origami[chair]; draw.oS = birth.fold - 1; draw.oPhase = null; draw.oLook = 'silver'; draw.oBird = 0;
          draw.oQ = qSlerp(qSlerp(qSpin(yaw, pitch), flat, birth.peel), qSpin(chair + f.phase * .5, .25), birth.fold);
          draw.oRho = body + (stageRadius - body) * (1 - birth.peel) ** 3;
          // the face's own picture goes with it, fading as it shuts
          const person = chairs[chair];
          draw.oFilm = mediaReady(person) && birth.fold < 1 ? {media: person, amount: 1 - birth.fold} : null;
          born = ease(birth.peel / .3);
        } else if (node.depth >= 2 && (node.amount < 1 || node.depth === 3)) {
          // a child: its parent's pentagon on its chair, peeled off and shut as it comes out; a leaf, a gold seed until it opens into its bird
          const model = origami[node.chair], grow = ease(node.amount), own = qSpin(chair + f.phase * .5 + node.id * .38, .25);
          let q = grow >= 1 ? own : qSlerp(qSpin(chair + f.phase * .5 + node.parent * .38, .25), own, grow);
          let s = node.amount - 1, rho = lerp(Math.max(.65, rootSize * node.scale / riteNow.childScale), body, grow), toBird = 0;
          if (node.depth === 3) {
            s = clamp(s + unfoldAt(node, t, clamp(Math.hypot(px - cx, py - cy) / (stageRadius * 2.6))), -1, 1);
            if (s > 0) {
              // THE FORMATION: turned to the sphere's centre on the screen, a little smaller, its wings beating with every other bird's
              let heading = -(turn + node.chair * .15);
              if (form > 0) heading += turnTo(heading, Math.atan2(px - cx, py - cy)) * form;
              toBird = ease(s / .6);
              q = qSlerp(q, birdTurn(model, heading), toBird);
              rho = body * (1 + (BIRD_HALF / model.span - 1) * ease((s - .1) / .6)) * (1 + (FORM.size - 1) * form);
              if (s >= 1) draw.oHeading = heading;   // flying: THE BIRDS AS SPRITES
            }
          }
          draw.oModel = model; draw.oS = s; draw.oQ = q; draw.oRho = rho * shrink; draw.oBird = toBird;
          draw.oPhase = f.flutter + node.id * .38 * (1 - form); draw.oLook = node.depth === 3 ? 'gold' : 'silver';
        }
        const seen = born * (front ? .95 : .45 + .5 * (st ? strikeOut[2] : 0)) * fade;   // on its way at him, a body behind the cage is lit as one before it, so it comes round with no step
        draw.alpha = seen * shown * satNow; draw.flash = seen * flash * satNow; if (st) draw.alpha = seen * shown * lerp(satNow, 1, Math.max(strikeOut[2], strikeOut[5]));   // THE MINT WINDOW: the satellites fade; a body on its way at him lights up whole, and glows as the page asks (its sixth word)
        familyDrawOrder.push(draw);
      }
    }
  }

  // THE RITE'S UNITS ARE RUST'S (Nov 26 2026; his "Do this task here" on "The rite's units drawn by the Rust kernel", after "we have profund
  // performance fps issues... it is important we get highest performances"): the swarm of a pass was handed to the canvas one call at a time,
  // about 7,300 calls a draw (a stroke a link, a fill a colour of every small ball, a copy a bird). With a graphics card and the kernel, the
  // page writes each unit's sixteen numbers (embertide-mint glass.rs UNIT: its place, size, alpha, its skin's slot or its bird's tile, its
  // link) and the kernel writes the shapes as the card's instances in this same order; the arrows and the core's light, which the canvas
  // laid over the units, wait for the layer over that glass (drawScene). A pass that holds a unit the kernel does not draw (one still
  // folding, one that carries the film) stays the canvas's, whole. skinSlots: a unit's skin -> [its slot in the kernel, the pass that last wore it].
  const skinSlots = new Map(); let slotsOf = null, slotPass = 0, unitsLate = false;
  function skinSlot(skin) {
    let e = skinSlots.get(skin);
    if (!e) {
      const pack = packSkin(skin); let slot = skinSlots.size, old = null;
      if (slot >= 64) { for (const kv of skinSlots) if (!old || kv[1][1] < old[1][1]) old = kv; if (old[1][1] === slotPass) return -1; skinSlots.delete(old[0]); slot = old[1][0]; }
      if (!kernel.glassUnitSkin(slot, pack.packed, pack.n, skin.pents.length, skin.seedness ?? (skin.hexes.length === 0 ? 1 : 0))) return -1;
      skinSlots.set(skin, e = [slot, 0]);
    }
    e[1] = slotPass; return e[0];
  }
  function unitsToGlass() {
    const U = onGlass && kernel.glassUnits && glass.sheet ? kernel.units : null, f = riteNow.flock, last = BIRD_SPRITE[BIRD_SPRITE.length - 1], launch = 4 * f.release * (1 - f.release);
    if (!U || familyDrawOrder.length * 16 > U.length) return false;
    if (slotsOf !== glass) { skinSlots.clear(); slotsOf = glass; } slotPass++;
    let o = 0;
    for (const draw of familyDrawOrder) {
      const {node, px, py, body, chair} = draw, alpha = draw.alpha * (1 - ARROW_GHOST * draw.flowK), linked = node.parent !== null && draw.linkFade > .01, seen = alpha >= .002;
      let kind = 0, size = body, a = 0, b = 0;
      if (seen && draw.oModel && !(draw.oS === 0 && body < 2.6)) {
        const rho = draw.oRho;
        if (rho > .05) {
          if (!(draw.oHeading !== null && draw.oS >= 1 && draw.oBird >= 1 && draw.oPhase !== null && draw.oFilm === null && rho <= last * 1.5)) return false;
          const rhoS = BIRD_SPRITE.find(r => rho <= r) ?? last, sheet = birdSheet(rhoS, draw.oLook);
          if (sheet.on !== glass) { if (!glass.sheet(sheet.k, sheet.canvas, sheet.cols, sheet.tile * sheet.dpr)) return false; sheet.on = glass; }
          kind = 3; size = sheet.tile * rho / rhoS; a = birdTile(draw.oPhase, draw.oHeading); b = sheet.k;
        }
      } else if (seen && node.depth === 3) { kind = 2; a = draw.turn; }
      else if (seen) { const skin = unitSkinAt(node, chair); if ((b = skinSlot(skin)) < 0) return false; kind = skin.hexes.length > 0 ? 1 : 4; a = chair + f.phase * .5 + node.id * .38; }
      U[o] = kind; U[o + 1] = px; U[o + 2] = py; U[o + 3] = size; U[o + 4] = alpha; U[o + 5] = a; U[o + 6] = b;
      U[o + 7] = linked ? draw.alpha * (node.depth === 2 ? .18 : .07 + .15 * (1 - node.amount)) * (1 + f.charge) * draw.linkFade : 0; U[o + 8] = draw.parentX; U[o + 9] = draw.parentY; U[o + 10] = chair % 4;
      U[o + 11] = linked && launch > .01 ? draw.alpha * launch * .6 * draw.linkFade : 0; U[o + 12] = Math.max(.7, body * .3); U[o + 13] = launch * .45;
      U[o + 14] = seen && node.depth < 3 && f.charge > .01 ? alpha * f.charge * .3 : 0; U[o + 15] = body * (1 + .35 * f.charge); o += 16;
    }
    kernel.glassUnits(o / 16, lightTheme); return true;
  }
  function paintRiteUnits() {
    const f = riteNow.flock;
    // Evaluate parent-first, paint far-to-near across all twelve families, including cross-family overlaps.
    familyDrawOrder.sort((a, b) => a.zz - b.zz || a.chair - b.chair || a.node.id - b.node.id);
    if ((unitsLate = unitsToGlass())) return;
    // Ownership lines sit beneath every body in this depth pass.
    for (const draw of familyDrawOrder) {
      const {node, px, py, parentX, parentY, body, alpha, birdColor} = draw;
      if (node.parent !== null && draw.linkFade > .01) {
        // Ownership is legible during birth and the burn; the branch never changes its parent.
        const link = node.depth === 2 ? .18 : .07 + .15 * (1 - node.amount);
        ctx.globalAlpha = alpha * link * (1 + f.charge) * draw.linkFade; ctx.strokeStyle = birdColor; ctx.lineWidth = .55;
        ctx.beginPath(); ctx.moveTo(parentX, parentY); ctx.lineTo(px, py); ctx.stroke(); const launch = 4 * f.release * (1 - f.release);
        if (launch > .01) {   // its release stroke fades with its link while it flies as an arrow
          ctx.globalAlpha = alpha * launch * .6 * draw.linkFade; ctx.strokeStyle = '#c99b44'; ctx.lineWidth = Math.max(.7, body * .3);
          ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px - (px - parentX) * launch * .45, py - (py - parentY) * launch * .45); ctx.stroke();
        }
      }
    }
    for (const draw of familyDrawOrder) {
      const {node, px, py, body, turn, chair} = draw;
      // an arrow of THE FLOW is light on the film (paintArrows), its body gone into it
      const alpha = draw.alpha * (1 - ARROW_GHOST * draw.flowK);
      if (alpha < .002) continue;
      if (draw.oModel && !(draw.oS === 0 && body < 2.6)) {
        // THE ORIGAMI: a unit being born, a leaf's gold seed, a leaf opening into its bird or flying as one
        drawOrigami(draw.oModel, draw.oS, draw.oPhase, px, py, draw.oRho, draw.oQ, alpha, draw.oLook, draw.oBird, draw.oFilm, draw.oHeading);
      } else if (node.depth === 3) {
        // At this radius twelve faces are subpixel work: a shut leaf is one gold pentagon, its seed's own colour.
        ctx.globalAlpha = alpha; ctx.fillStyle = ctx.strokeStyle = lightTheme ? '#c6b280' : '#a18b57'; ctx.lineWidth = .5; ctx.beginPath();
        for (let k = 0; k < 5; k++) {
          const angle = turn + k * TAU / 5, x = px + Math.cos(angle) * body, y = py + Math.sin(angle) * body;
          if (k) ctx.lineTo(x, y); else ctx.moveTo(x, y);
        }
        ctx.closePath(); ctx.fill(); ctx.stroke();
      } else {
        // A grown unit draws its near faces only: its far ones (15 % under a near face at up to 95 %) would double its cost for under one
        // percent of its colour. The seeds draw as they always have.
        const skin = unitSkinAt(node, chair);
        drawSkin(skin, [px, py], body, {yaw: chair + f.phase * .5 + node.id * .38, pitch: .25}, null, alpha, true, skin.hexes.length > 0);
      }
      if (node.depth < 3 && f.charge > .01) {
        ctx.globalAlpha = alpha * f.charge * .3; ctx.fillStyle = '#ffd36d'; ctx.beginPath(); ctx.arc(px, py, body * (1 + .35 * f.charge), 0, TAU); ctx.fill();
      }
    }
    paintArrows();
  }

  // THE FLOW drawn as light (his "the swarmies are too opaque...", over the arrows as solid sticks of gold and white balls over the film):
  // each arrow a thin trail down the film's own line, the length it ran in the last ARROW_TRAIL seconds, clear at its tail and whole at its
  // head, and a glowing head; spent on a point, a flash. Light added, not paint laid over: the anime shows through every one of them, and
  // where they bunch they brighten, as the film's own light does. Two small sprites made once; a transform and two copies an arrow.
  const ARROW_TRAIL = .06, ARROW_GHOST = 1; let arrowSprites = null;
  function arrowSpritesOf() {
    if (arrowSprites) return arrowSprites;
    const glow = document.createElement('canvas'), trail = document.createElement('canvas'); glow.width = glow.height = 64;
    const g = glow.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    r.addColorStop(0, 'rgba(255,250,234,1)'); r.addColorStop(.16, 'rgba(255,228,160,.85)'); r.addColorStop(.45, 'rgba(255,196,96,.24)'); r.addColorStop(1, 'rgba(255,176,64,0)');
    g.fillStyle = r; g.fillRect(0, 0, 64, 64); trail.width = 128; trail.height = 16; const t = trail.getContext('2d'), img = t.createImageData(128, 16);
    for (let y = 0; y < 16; y++) for (let x = 0; x < 128; x++) {
      const along = (x + .5) / 128, across = Math.exp(-((((y + .5) / 16 - .5) / .2) ** 2)), o = (y * 128 + x) * 4;
      img.data[o] = 255; img.data[o + 1] = Math.round(196 + 44 * along); img.data[o + 2] = Math.round(100 + 110 * along * along);
      img.data[o + 3] = Math.round(255 * along ** 1.7 * across);
    }
    t.putImageData(img, 0, 0);
    return (arrowSprites = {glow, trail});
  }
  function paintArrows() {
    let any = false;
    for (const draw of familyDrawOrder) if (draw.flowK > 0) { any = true; break; }
    if (!any) return;
    const {glow, trail} = arrowSpritesOf(), m = ctx.getTransform();
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    for (const draw of familyDrawOrder) {
      if (!(draw.flowK > 0)) continue;
      const {node, px, py, body, flowDx: cs, flowDy: sn} = draw, unit2 = node.depth === 2, a = draw.alpha * draw.flowK * draw.flowGlow;
      // the arrow's own frame: its head at the origin, its way along x
      ctx.setTransform(m.a * cs + m.c * sn, m.b * cs + m.d * sn, m.c * cs - m.a * sn, m.d * cs - m.b * sn, m.a * px + m.c * py + m.e, m.b * px + m.d * py + m.f);
      if (a > .003) {
        const len = Math.min(40 + body * 24, draw.flowSpeed * ARROW_TRAIL), wide = unit2 ? Math.max(2.4, body * .9) : 2;
        if (len > 2) { ctx.globalAlpha = a * (unit2 ? .5 : .32); ctx.drawImage(trail, -len, -wide / 2, len + wide * .25, wide); }
        const head = unit2 ? Math.max(4, body * 1.7) : Math.max(2.6, body * 2.2);
        ctx.globalAlpha = a * (unit2 ? .6 : .4); ctx.drawImage(glow, -head, -head, head * 2, head * 2);
      }
      if (draw.flash > .003) {
        const big = (unit2 ? Math.max(6, body * 3) : Math.max(4, body * 3.5)) * (1 + draw.flash);
        ctx.globalAlpha = draw.flash * (unit2 ? .55 : .3) * (.5 + .5 * draw.flowGlow); ctx.drawImage(glow, -big, -big, big * 2, big * 2);
      }
    }
    ctx.restore();
  }

  // THE RITE'S DANCE, drawn (lab/rite-unit1s.js): the last RIBBON_S of a unit1's own path, sampled RIBBON_N times, each sample on the
  // Lissajous at its own time and pulled by its hand at its own second, widening and brightening toward the unit; smooth where the long
  // trail's 65 points over 15.5 s turned his hands' turns into corners (the first rewatch, 17:4x WEST)
  const RIBBON_S = 1, RIBBON_N = 30;
  function riteRibbon(chair, color, front, center, radius) {
    ctx.save(); ctx.strokeStyle = color; ctx.lineCap = 'round';
    let px = 0, py = 0, pfade = 1;
    const unit = radius * (.14 + chair % 3 * .012) * riteNow.size * (1 - .24 * riteNow.flock.refinement), plan = pullPlanNow();   // its unit1's body, as riteUnit sizes it
    for (let k = RIBBON_N; k >= 0; k--) {
      const age = k / RIBBON_N * RIBBON_S, p = rotate(loopPoint(chair, at - age * 1000), yaw, pitch);
      const q = projectAt(p, center[0], center[1], orbitalRadius);
      const d = riteNow.offset(chair, age * 1000 / TRAIL_MS);
      // THE BIRTH: the ribbon is the path the unit flew, off its face, along his hand and out to its orbit; none before it peeled off
      let sx = q[0] + d[0] * orbitalRadius, sy = q[1] + d[1] * orbitalRadius, sz = p[2], born = 1;
      const b = birthAt(chair, riteNow.t - age);
      if (b) { birthPlace(birthOut, b, chair, sx, sy, sz, center, radius); sx = birthOut[0]; sy = birthOut[1]; sz = birthOut[2]; born = ease(b.peel / .4); }
      // THE PULL: and its fall onto its post, where the ribbon gathers into the unit
      const w = plan ? pullAt(PULL_ROOT, chair, riteNow.t - age) : 0;
      if (w > 0) { pullPlace(pullOut, plan.posts[chair], PULL.altitude, w, sx, sy, sz, center, radius, .35); sx = pullOut[0]; sy = pullOut[1]; sz = pullOut[2]; } const st = w > 0 && riteNow.strike ? riteNow.strike(strikeOut, 1, chair, 0, riteNow.t - age, sx, sy, center[0], center[1], radius) : false; if (st) { sx = strikeOut[0]; sy = strikeOut[1]; sz = lerp(sz, 1, strikeOut[2]); }   // THE THREE WAVES: the ribbon is the way its unit1 flew at him
      // THE FIELD bends the ribbon as it bends its unit: each sample at its own depth and its own second (not on its way at him: the unit is not pushed then)
      fieldAt(fieldOut, sx, sy, sz, unit * 4 / (4 - p[2]), center[0], center[1], fieldRadius, st ? 0 : fieldOn);
      const x = fieldOut[0], y = fieldOut[1], fade = fieldOut[2] * born, lift = !(sz > 0) && colonyLift > 0;
      if (k < RIBBON_N && (sz > 0 || lift) === front) {
        const life = 1 - age / RIBBON_S;
        ctx.globalAlpha = (front ? .7 * (1 - twelveBehind) : .3) * life * riteNow.amount * Math.min(fade, pfade) * (lift ? colonyLift : 1) * satNow; ctx.lineWidth = .5 + 2.4 * life;
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
      }
      px = x; py = y; pfade = fade;
    }
    ctx.restore();
  }

  function orbitalSocieties(center, radius, front) {
    if (mode !== 'illustration') return;
    const colors = lightTheme ? ['#A98242', '#438C82', '#B49A68', '#6D8698'] : ['#d6bd7d', '#85bcb0', '#c7ac7a', '#9cbbb9'];
    ctx.save();
    familyDrawOrder.length = 0; if (!front) balls.length = 0; else impactN = 0;   /* balls: the twelve's bodies as drawn this frame, [x, y, r, z] (z > 0 before the cage), handed to an overlay (after-the-mint-tree.mjs: THE BALLS STAND CLEAR) */
    // The original Poleis 3:2 spherical Lissajous, walked at uniform arc length. Twelve moving histories share four tilted lanes. A trail is
    // the last 15.5 s of a world's path, fading and thinning toward the tail: 64 segments a chair, each its own alpha and width. The twelve's
    // points come off the frame's trail buffer; the segments of one age wear one alpha and width, so the three chairs of a lane at that age go
    // down in one path (256 strokes a pass where 768 went, the same lines: nothing a stroke paints changes), the oldest first as before.
    // THE PULL: the twelve leave their orbits for their posts, and their orbits' long trails go with them
    const plan = riteNow ? pullPlanNow() : null, trailsKept = plan ? 1 - Math.min(1, pullAt(PULL_ROOT, 0, riteNow.t)) : 1;
    // THE SHAPES ARE RUST'S: off the rite, the trails or the heartbeat's strips and the bodies are the kernel's instances (glass.rs)
    const card = onGlass && !riteNow; let nb = 0;
    const body = (...b) => { if (nb < 64) bodies.set(b, 8 * nb++); };
    if (card) { if (lanesOn !== lightTheme) { kernel.glassLanes(colors.flatMap(rgbOf)); lanesOn = lightTheme; }
      if (!skinsOn) skinsOn = [nestedSkin, seedSkin].every((k, i) => kernel.glassSkin(i, packSkin(k).packed, packSkin(k).n, k.pents.length, k.seedness ?? (k.hexes.length ? 0 : 1))); }
    if (beatTrace && traceBuf && card) kernel.glassTrace(front, front ? 1 - twelveBehind : .5);
    else if (beatTrace && traceBuf) for (let chair = 0; chair < 12; chair++) traceOrbit(chair, colors[chair % 4], front);
    else if (card) kernel.glassTrails(front, front ? 1 - twelveBehind : .5);
    else if (trailsKept > .002) for (let step = 63; step >= 0; step--) {
      const age = step / 64, i = 64 - step;   // i: the segment's own point in the trail; i - 1 the one before it
      for (let lane = 0; lane < 4; lane++) {
        let open = false;
        for (let chair = lane; chair < 12; chair += 4) {
          const o = (chair * 65 + i) * 3;
          if ((trailsBuf[o + 2] > 0) !== front) continue;
          if (!open) {
            ctx.globalAlpha = (.09 + (1 - age) * .48) * (front ? 1 - twelveBehind : .5) * trailsKept;
            ctx.strokeStyle = colors[lane]; ctx.lineWidth = .35 + (1 - age) * .9;
            ctx.beginPath(); open = true;
          }
          ctx.moveTo(trailsBuf[o - 3], trailsBuf[o - 2]); ctx.lineTo(trailsBuf[o], trailsBuf[o + 1]);
        }
        if (open) ctx.stroke();
      }
    }
    for (let chair = 0; chair < 12; chair++) {
      const color = colors[chair % 4], o = (chair * 65 + 64) * 3, z = trailsBuf[o + 2];
      // Each ribbon segment follows its own depth, as the long trails do, even when its head is in the other pass.
      if (riteNow) riteRibbon(chair, color, front, center, radius);
      if (!riteNow && (z > 0) !== front) continue;
      const pos = [trailsBuf[o], trailsBuf[o + 1]];
      const perspective = 4 / (4 - z);
      ctx.globalAlpha = front ? .9 : .5; ctx.fillStyle = color;
      if (riteNow) {
        // Each summoned Unit1 delegates to its own smaller units; only the smallest generation resolves into wings.
        const d0 = riteNow.offset(chair, 0), release = riteNow.flock.release * .14;   // THE COLONY leaves the unit1s steady on their orbits
        let head = [pos[0] + d0[0] * orbitalRadius + (pos[0] - center[0]) * release,
          pos[1] + d0[1] * orbitalRadius + (pos[1] - center[1]) * release], depth = z;
        // THE BIRTH: until it has closed, the unit1 is its face of the dodecahedron peeled off onto his hand, and before that a spark
        const b = birthAt(chair, riteNow.t);
        if (b) {
          birthPlace(birthOut, b, chair, head[0], head[1], z, center, radius);
          head = [birthOut[0], birthOut[1]]; depth = birthOut[2];
          if (b.peel < .4) riteSpark(b, chair, front, center, radius);
        }
        // THE PULL: from the draw it falls onto its geostationary post over its pentagon, and turns with the sphere
        const w1 = plan ? pullAt(PULL_ROOT, chair, riteNow.t) : 0;
        let near = perspective;
        if (w1 > 0) {
          pullPlace(pullOut, plan.posts[chair], PULL.altitude, w1, head[0], head[1], depth, center, radius, .35);
          head = [pullOut[0], pullOut[1]]; depth = pullOut[2]; near = lerp(perspective, 4 / (4 - pullOut[3]), Math.min(1, w1));
        }
        ctx.globalAlpha = front ? .9 : .5; ctx.fillStyle = color;
        const r1 = radius * (.14 + chair % 3 * .012) * near * riteNow.size; if (front) balls.push([head[0], head[1], r1, depth]);
        riteUnit(head, r1, chair, depth, front, center[0], center[1], b, radius);
        continue;
      }
      if (card && networkAmount < .1) body(2, pos[0], pos[1], perspective, 1.25, 0, front ? .9 : .5, chair % 4);
      else if (networkAmount < .1) {
        ctx.beginPath(); ctx.arc(...pos, 1.8 * perspective, 0, TAU); ctx.fill();
        ctx.globalAlpha *= .25; ctx.beginPath(); ctx.arc(...pos, 5 * perspective, 0, TAU); ctx.strokeStyle = color; ctx.stroke();
      } else {
        const bodyRadius = radius * (.062 + chair % 3 * .012) * perspective * networkAmount; balls.push([pos[0], pos[1], bodyRadius, z]);
        if (card) body(0, pos[0], pos[1], bodyRadius, yaw * .6 + chair, .25, front ? 1 : .45, 0);
        else drawSkin(nestedSkin, pos, bodyRadius, {yaw: yaw * .6 + chair, pitch: .25}, null, front ? 1 : .45, true);
        if (front && bodyRadius > 16) {
          // A society can itself hold societies: three geometrically real
          // miniature seeds orbit the small Goldberg on a second scale.
          for (let node = 0; node < 3; node++) {
            const q = loopUnitAt(node, clock * .25 + node * TAU / 3 + chair, at);
            const mini = project(q, pos, bodyRadius * 1.45);
            if (card) body(1, mini[0], mini[1], bodyRadius * .16, chair + node + clock * .1, .15, .7, 0);
            else drawSkin(seedSkin, mini, bodyRadius * .16, {yaw: chair + node + clock * .1, pitch: .15}, null, .7, true);
          }
        }
      }
    }
    if (card) kernel.glassBodies(bodies, nb, lightTheme);
    if (riteNow) { paintRiteUnits(); if (front && !unitsLate) paintCore(center, radius); }
    ctx.restore();
  }

  function draw() {   // THE CAMERA: its turn added to the pose for this draw alone, the pose itself (the film's, the hand's) left as it was
    if (cam.yaw === 0 && cam.pitch === 0) { drawScene(); return; }
    const yawRest = yaw, pitchRest = pitch; yaw += cam.yaw; pitch = clamp(pitch + cam.pitch, -1.35, 1.35);
    try { drawScene(); } finally { yaw = yawRest; pitch = pitchRest; }
  }
  const camEase = (k) => (k < .5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
  function camStep(now) {
    camRaf = 0; if (destroyed) return;
    const dt = camLast ? Math.min(.1, (now - camLast) / 1000) : 0; camLast = now;
    if (camTo) { const k = camMs > 0 ? Math.min(1, (now - camAt) / camMs) : 1, e = camEase(k);
      for (const key of ['zoom', 'x', 'y', 'yaw', 'pitch']) cam[key] = camFrom[key] + (camTo[key] - camFrom[key]) * e;
      if (k >= 1) { camTo = null; camFrom = null; } }
    if (cam.drift) cam.yaw += cam.drift * dt;
    requestFrame();
    if (camTo || cam.drift) camRaf = requestAnimationFrame(camStep); else camLast = 0;
  }
  function drawScene() {
    ctx = ctx0; ctx.clearRect(0, 0, width, height);
    // THE SHAPES ARE RUST'S: the far glass over this canvas, the middle 2D layer, the near glass, the top 2D layer (mint-glass.mjs)
    onGlass = Boolean(glass && glass.canvas === canvas && kernel?.glassTrails && Object.getPrototypeOf(ctx0) === own); if (onGlass) glass.begin(dpr, width, height);   // THE BOX TAKES THE BALL BACK: while the kick hooks this canvas (the film's flat anime, its colony, its cosmos) the frame is drawn on it, never on the glass
    let beat = null;
    if (pulse) { try { beat = pulse(); } catch { beat = null; } }
    drawnSize = Number.isFinite(beat?.size) && beat.size > 0 ? beat.size : 1;
    loopReach = Number.isFinite(beat?.loop) && beat.loop > 0 ? beat.loop : 1;
    beatTrace = beat?.trace && typeof beat.trace.length === 'number' && beat.trace.length >= 2 ? beat.trace : null;
    // THE MINT WINDOW, this frame: left once the film is back before the arrow (a seek, the loop) or past its way back; the crossing is the
    // film's second's, and on the window's way the rite runs on the sphere's own second, so the swarm and its wings come to rest with it
    const filmNow = moment === null ? NaN : momentNow(), arrowAt = MINT_WINDOW.frame * FRAME_S;
    if (mintMode === 'leaving' && !(filmNow >= arrowAt - FRAME_S && filmNow <= arrowAt + MINT_WINDOW.back)) mintMode = null;
    mintNowK = mintCrossAt(filmNow, mintMode); satNow = 1 - (1 - MINT_WINDOW.satellites) * mintNowK;
    if (mintMode === 'ahead' && mintNowK > 0) flask.prepare();   // THE FLASK, made with the seats paid so far in it, on the scene's way
    if (mintMode === 'ahead' && (held || mintNowK > .999)) flask.open(Date.now(), {still: reduced});   // THE FLASK opens on the stop
    riteNow = null; unitsLate = false;
    if (rite) { try { riteNow = mintMode ? rite(t => mintClockAt(t, mintMode)) : rite(); } catch { riteNow = null; } }
    if (riteNow && !(riteNow.amount > 0 && typeof riteNow.offset === 'function' && validFlock(riteNow.flock) &&
      Array.isArray(riteNow.family) && riteNow.family.length <= 157 && riteNow.family.every(n =>
        Number.isInteger(n.id) && n.id >= 0 && n.id < 157 && Number.isFinite(n.amount) &&
        Number.isFinite(n.scale) && (n.parent === null || Number.isInteger(n.parent) && n.parent >= 0 && n.parent < n.id)))) riteNow = null;
    const center = [width * (SPHERE_X + cam.x), height * (.5 + cam.y)];   // THE CAMERA: the centre moved and the radius drawn nearer, both identity at rest
    const radius = Math.min(width, height) * renderedRadius * drawnSize * cam.zoom;
    bodyState = cosmosBodyAt(mode === 'illustration' && !previewing && !chosen ? moment : null);
    shellNow = bodyState.heat > 0 ? cosmosScales(bodyState) : SHELL_REST;   // where drawSkin lays the page's own panels this frame
    shownSkin = growth ? growth.shape(growth.progress) : layout.skin;
    hitFaces = []; anchors.clear();
    // THE FRAME, built once: the stars, the rings and their ticks, the twelve's trails (or their ECG strips) at this clock and pose
    const F = frameOf();
    // The film owns orbit phase before and after the summon, including when the bodies are hidden for comparison (on THE MINT WINDOW's
    // way, the sphere's own second).
    at = (moment === null ? clock : orbitTimeAt(ownNow())) * 1000 + 18000; orbitalRadius = radius * lerp(1.5, 1.7, networkAmount) * loopReach;
    draws++;
    starsBuf.set(F.stars(clock, width, height, center[0], center[1], radius));
    ringsBuf.set(F.rings(yaw, center[0], center[1], radius));
    if (mode === 'illustration') {
      trailsBuf.set(F.trails(at, yaw, pitch, center[0], center[1], orbitalRadius));
      const strip = beatTrace ? F.trace(beatTrace, at, yaw, pitch, center[0], center[1], orbitalRadius, radius) : null;
      if (strip) { if (!traceBuf || traceBuf.length < strip.length) traceBuf = new Float64Array(strip.length); traceBuf.set(strip); traceLen = beatTrace.length; }
      else traceBuf = null;
    }
    // the film's staging: a square as large as a chair shows on this glass (a near face's scale is radius x 4 / 3 at most), or the star
    stageSide = Math.ceil(Math.max(2 * packSkin(layout.skin).rho * radius * 4 / 3, radius * .68, radius * 2 * MINT_WINDOW.star * mintNowK) * dpr);
    // THE FIELD keeps the units off the faces where they stand this frame: the open shell reaches past the sphere's radius
    fieldRadius = radius * cosmosReach(layout.skin, bodyState);
    const colony = riteNow?.colony ?? null;   // while the dodecahedron is out of the way the field is off
    fieldOn = riteNow ? fieldStrength(riteNow.t) * (1 - (colony ? Math.max(colony.spread, colony.burst) : 0)) : 0;
    colonyLift = colony ? Math.min(1, colony.burst * 2) * (1 - colony.gather) : 0; colonyFling = colony ? colony.fling * COLONY_FLING : 0;
    flowNow = colony ? flowAt(riteNow.t) : null; colonyPic = colony ? colonyPicture(width, height) : null;
    colonySpread = colony ? colony.spread : 0; twelveBehind = flowNow ? flowNow.pull : 0;
    atmosphere(center, radius); instrument(center, radius, false); orbitalSocieties(center, radius, false);
    if (onGlass) { glass.draw(0); ctx = glass.mid; if (unitsLate) paintArrows(); }
    const orbitFrame = {center, radius, width, height, clock, yaw, pitch, reduced: reduced || paused || held};
    ctx.save(); ctx.globalAlpha = 1 - mintNowK; holderOrbits.draw(ctx, {...orbitFrame, front: false}); ctx.restore();
    seatCenters.clear(); massCenters.clear();
    drawSkin(shownSkin, center, radius, {yaw, pitch}, layout.slots);
    if (mintNowK > 0) { drawRising(center, radius, {yaw, pitch}); drawFloating(center, radius); drawMintStar(center, radius, mintNowK); drawSeatSparks(center, radius); }
    instrument(center, radius, true); arrivals(center, radius); orbitalSocieties(center, radius, true);
    if (onGlass) { glass.draw(1); ctx = glass.top; if (unitsLate) { paintArrows(); paintCore(center, radius); } }
    ctx.save(); ctx.globalAlpha = 1 - mintNowK; holderOrbits.draw(ctx, {...orbitFrame, front: true}); ctx.restore();
    hitFaces.sort((a, b) => a.depth - b.depth);
    // One small fixed bearing, like an engraved scientific instrument.
    ctx.save(); ctx.globalAlpha = .4; ctx.fillStyle = lightTheme ? '#8d774b' : '#c8b987';
    ctx.font = '8px ui-monospace,monospace'; ctx.textAlign = 'center';
    if (showSeatIndex) ctx.fillText('I · II · III · IV · V · VI · VII · VIII · IX · X · XI · XII', center[0], center[1] + radius * 1.66);
    ctx.restore();
    overlayBusy = overlay ? Boolean(overlay(ctx, {anchor: id => anchors.get(id), center, radius, width, height, balls})) : false;
  }

  function canAnimate() { return !destroyed && !paused && !held && !reduced && inView && !document.hidden; }
  /** Home: the page's own pose; under the film, the film's own at its second, the hand's addition let go (THE POSE IS THE FILM'S). */
  function home() {
    if (moment === null) { yaw = -.32; pitch = -.12; return; }
    const base = poseAt(mintClockAt(moment, mintMode));
    handYaw = 0; handPitch = 0; yaw = shownYaw = base.yaw; pitch = shownPitch = base.pitch;
  }
  function requestFrame() {
    if (destroyed) return;
    if (!frame) frame = requestAnimationFrame(tick);
  }
  function tick(timestamp) {
    frame = 0;
    if (destroyed) return;
    const dt = lastTime == null ? 0 : Math.min(.05, (timestamp - lastTime) / 1000);
    lastTime = timestamp;
    if (canAnimate()) {
      clock += dt * (moment === null ? 1 : mintSpeedAt(momentNow(), mintMode));   // THE MINT WINDOW: the units' spin comes to rest with the rest
      if (!pointer && moment === null) yaw += dt * .12;   // the page's own turn, only until the film's first second (THE POSE IS THE FILM'S)
      if (mode === 'illustration' && automatic) phaseTime = Math.min(28, phaseTime + dt);
    }
    if (mode === 'illustration' && !previewing) illustration();
    if (pendingAdmission && (reduced || paused)) {
      const arriving = layout.slots.get(pendingAdmission.result.seatId);
      if (arriving) arriving.born = clock - 4;
      waveAt = clock - 4; pendingAdmission.at = clock;
    }
    for (const id of continuingArrivals) {
      const slot = layout.slots.get(id);
      if (!slot || clock - slot.born > 4) continuingArrivals.delete(id);
    }
    const targetRadius = .2 + .12 * Math.sqrt(Math.min(1, layout.count / 118));
    // A film seek has no elapsed growth time. Restore its destination geometry now;
    // otherwise a paused backward seek keeps the later, smaller pentagons indefinitely.
    if (settleIllustration) {
      if (mode === 'illustration' && !previewing && !chosen) {
        growth = null; renderedRadius = targetRadius;
      }
      settleIllustration = false;
    }
    const catchup = reduced || paused || held || !inView || document.hidden ? 1 : 1 - Math.exp(-dt * 2.8);
    if (growth) {
      const p = reduced ? 1 : ease((clock - growth.at) / growth.duration);
      if (canAnimate() && !pointer) {
        // warm-assembly.js turns 1.05 radians during its docking phase. Use
        // that same phase for the radius and morph, rather than an unrelated
        // background drift. Pointer movement always owns the camera.
        yaw += (p - growth.applied) * 1.05;
        const tilt = .12 * Math.sin(p * Math.PI);
        pitch += tilt - growth.tilt;
        growth.tilt = tilt;
      } else if (pointer) growth.tilt = .12 * Math.sin(p * Math.PI);
      growth.progress = p; growth.applied = p;
      renderedRadius = lerp(growth.fromRadius, targetRadius, p);
      if (p >= 1) growth = null;
    } else renderedRadius = lerp(renderedRadius, targetRadius, catchup);
    const targetNetwork = mode === 'illustration' && scene === 'network' ? 1 : 0;
    networkAmount = lerp(networkAmount, targetNetwork, reduced || paused || held ? 1 : 1 - Math.exp(-dt * .8));
    // a draw: at each frame the film presents (asked), at every screen frame with no film driving, and between the film's frames while a draw
    // is cheap (THE SCREEN'S FRAMES BETWEEN)
    const asked = askedAt !== drawnAsk, heldStep = held && !asked && timestamp - drawnAt < 1000 / HELD_FPS;
    if (!heldStep && (asked || !filmDrives() || (timestamp - drawnAt >= SCREEN_STEP_MS && drawMs < SCREEN_DRAW_MS))) {
      const t0 = performance.now();
      draw();
      drawMs = performance.now() - t0; drawnAt = timestamp; drawnAsk = askedAt;
    }
    if (pendingAdmission && clock >= pendingAdmission.at) {
      const completed = pendingAdmission.result;
      pendingAdmission = null;
      onAdmission(completed);
    }
    if (canAnimate()) {
      // THE FILM IS THE CLOCK OF THE PICTURE, and the screen's frames run between its (above): the next tick is the screen's either way, and
      // one a frame (a layer that asked for a frame during this draw has it scheduled already: two ticks in one frame drew twice)
      if (!frame) frame = requestAnimationFrame(tick);
    } else {
      lastTime = null;
      // over a paused sphere, a panel or a vote still moving keeps the frames, and only while it moves; held on the stop, THE MINT WINDOW
      // keeps them while it shows (his glow burns on, the liquor falls), unless the page's own pause or reduced motion says still
      if ((overlayBusy || (mintNowK > 0 && !reduced && !paused)) && inView && !document.hidden) frame = requestAnimationFrame(tick);
    }
  }
  function filmDrives() {
    const film = chairs[0];
    return typeof HTMLVideoElement !== 'undefined' && film instanceof HTMLVideoElement && !film.paused && !film.ended && performance.now() - askedAt < FILM_WAIT_MS;
  }

  function pointerDown(event) {
    if (event.button !== 0) return;
    pointer = {id: event.pointerId, x: event.clientX, y: event.clientY, startX: event.clientX, startY: event.clientY, moved: false};
    canvas.setPointerCapture?.(event.pointerId);
  }
  function pointerMove(event) {
    if (!pointer) {
      const bounds = canvas.getBoundingClientRect();
      const holder = holderOrbits.hitTest(event.clientX - bounds.left, event.clientY - bounds.top);
      canvas.style.cursor = holder ? 'pointer' : 'grab';
      canvas.title = holder ? `@${holder.handle} · Public X profile supplied by this reservation's wallet` : '';
      return;
    }
    if (event.pointerId !== pointer.id) return;
    const dx = event.clientX - pointer.x, dy = event.clientY - pointer.y;
    if (Math.hypot(event.clientX - pointer.startX, event.clientY - pointer.startY) > 5) pointer.moved = true;
    yaw += dx * .006; pitch = clamp(pitch + dy * .004, -1.35, 1.35);
    pointer.x = event.clientX; pointer.y = event.clientY;
    requestFrame();
  }
  function pointerUp(event) {
    if (!pointer || event.pointerId !== pointer.id) return;
    const wasClick = !pointer.moved;
    pointer = null;
    if (!wasClick) return;
    const bounds = canvas.getBoundingClientRect(), point = [event.clientX - bounds.left, event.clientY - bounds.top];
    const holder = holderOrbits.hitTest(...point);
    if (holder) { onHolderSelect(holder); return; }
    const hit = [...hitFaces].reverse().find(face => inside(point, face.points));
    if (!hit) return;
    selectFace(hit);
  }
  function selectFace(hit) {
    selectedId = hit.slot?.seat.id || null;
    const identity = {kind: hit.index < 0 ? 'pent' : 'hex', faceIndex: hit.index, faceId: hit.face.id, ...(hit.slot ? {seatId: hit.slot.seat.id} : {})};
    if (hit.index < 0) onSelect({...identity, title: 'One of twelve chairs', detail: 'The pentagons mark the chamber. A society needs people who can answer for its decisions.'});
    else if (hit.slot && mode === 'confirmed') onSelect({...identity, title: hit.slot.seat.label || 'A confirmed place', detail: hit.slot.seat.detail || `Mint identity: ${hit.slot.seat.id}`});
    else if (hit.slot) onSelect({...identity, title: 'A place in the society', detail: 'In this illustration, an arrival becomes a hexagon. Live places will appear only after a confirmed mint.'});
    else onSelect({...identity, title: 'Room for another mind', detail: 'An unoccupied face in the illustration. It is not a minted seat or a reservation.'});
    requestFrame();
  }
  function pointerCancel() { pointer = null; }
  function keyDown(event) {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'Enter', ' '].includes(event.key)) return;
    event.preventDefault();
    if (event.key === 'Enter' || event.key === ' ') {
      const hit = [...hitFaces].reverse().find(face => face.index >= 0);
      if (hit) selectFace(hit);
      return;
    } else if (event.key === 'Home') { home(); }
    else if (event.key === 'ArrowLeft') yaw -= .14;
    else if (event.key === 'ArrowRight') yaw += .14;
    else pitch = clamp(pitch + (event.key === 'ArrowUp' ? -.1 : .1), -1.35, 1.35);
    requestFrame();
  }
  function visibility() {
    if (!canAnimate() && frame) { cancelAnimationFrame(frame); frame = 0; lastTime = null; }
    else if (canAnimate()) requestFrame();
  }
  function motionChange(event) { reduced = event.matches; visibility(); requestFrame(); }
  const resizeObserver = new ResizeObserver(resize);
  const intersection = new IntersectionObserver(entries => { inView = entries[0]?.isIntersecting !== false; visibility(); }, {rootMargin: '40px'});
  resizeObserver.observe(canvas); intersection.observe(canvas);
  document.addEventListener('visibilitychange', visibility);
  media.addEventListener('change', motionChange);
  canvas.addEventListener('pointerdown', pointerDown); canvas.addEventListener('pointermove', pointerMove);
  canvas.addEventListener('pointerup', pointerUp); canvas.addEventListener('pointercancel', pointerCancel);
  canvas.addEventListener('lostpointercapture', pointerCancel); canvas.addEventListener('keydown', keyDown);
  resize();

  return {
    setScene(next) {
      if (!SCENES.includes(next)) throw new RangeError(`Unknown genesis scene: ${next}`);
      pendingAdmission = null;
      mode = 'illustration'; automatic = false; previewing = false; phaseTime = TIMES[next]; chosen = true;   // his pick outlasts the film's moment
      const oldScene = scene;
      illustration(); if (oldScene === scene) emitScene(scene, true); requestFrame();
    },
    setSnapshot(snapshot) {
      // Validation happens before abandoning the last readable state.
      const next = buildMembershipLayout(mode === 'confirmed' ? layout : null, snapshot, clock);
      if (mode !== 'confirmed') { continuingArrivals.clear(); growth = null; }
      for (const slot of next.slots.values()) if (slot.isNew) continuingArrivals.add(slot.seat.id);
      // the carpet takes one at a time: new members walk in in turn, the nearest to the eye first, the whole line inside 1.5 s
      const line = [...next.slots.values()].filter(slot => slot.isNew)
        .sort((a, b) => rotate(b.face.normal, yaw, pitch)[2] - rotate(a.face.normal, yaw, pitch)[2]);
      const step = line.length > 1 && canAnimate() ? Math.min(.22, 1.5 / line.length) : 0;   // no frames, no queue: all at once
      line.forEach((slot, i) => { slot.born = clock + i * step; });
      pendingAdmission = null;
      if (next.capacity !== layout.capacity) {
        if (mode === 'confirmed') beginGrowth(layout, next);
        else growth = null;
      }
      layout = next; mode = 'confirmed'; automatic = false; previewing = false; networkAmount = 0;
      emitScene(next.count ? 'society' : 'seed'); requestFrame();
    },
    previewAdmission(faceIndex) {
      const originalSlots = [...layout.slots.values()];
      const occupied = originalSlots.find(slot => slot.faceIndex === faceIndex);
      if (mode === 'confirmed' && occupied) {
        return {faceIndex, faceId: occupied.face.id, illustration: false, unavailable: true, reason: 'This confirmed place is already occupied.'};
      }
      const priorMode = mode;
      mode = 'illustration'; automatic = false; previewing = true; networkAmount = 0;
      let capacity = layout.capacity || 20;
      // This preview has its own identities. It cannot mutate or impersonate
      // the verified mint records last supplied to setSnapshot.
      const remaining = originalSlots.filter(slot => priorMode === 'confirmed' || slot.faceIndex !== faceIndex);
      const seats = remaining.map((slot, i) => ({id: `preview-existing:${i}`, label: 'Illustrated place'}));
      if (seats.length >= capacity) capacity = [20, 30, 80, 110, 150, 240, 260, 350, 470, 480, 630, 740, 800, 990, 1070, 1200].find(n => n > capacity) || capacity;
      let base = buildMembershipLayout(null, {capacity, seats}, clock);
      if (capacity === layout.capacity) {
        // Preserve the clicked geometry when entering preview from the live
        // view; only the separate illustration's identity labels change.
        remaining.forEach((old, i) => {
          const slot = base.slots.get(`preview-existing:${i}`);
          slot.faceIndex = old.faceIndex; slot.face = base.skin.hexes[old.faceIndex];
        });
      }
      let available = base.skin.hexes.map((face, index) => ({face, index})).filter(({index}) => ![...base.slots.values()].some(slot => slot.faceIndex === index));
      if (!available.length) {
        // Exhausted illustrative geometry restarts as a new, clearly labelled
        // chamber, never as an additional confirmed mint on a full live floor.
        base = buildMembershipLayout(null, {capacity: 20, seats: []}, clock);
        available = base.skin.hexes.map((face, index) => ({face, index}));
      }
      const chosen = available.find(item => item.index === faceIndex) || available.sort((a, b) => rotate(b.face.normal, yaw, pitch)[2] - rotate(a.face.normal, yaw, pitch)[2])[0];
      const id = `preview-arrival:${++previewSerial}`;
      const next = buildMembershipLayout(base, {capacity: base.capacity, seats: [...base.slots.values()].map(slot => slot.seat).concat({id, label: 'Your arrival — illustration'})}, clock);
      const slot = next.slots.get(id);
      slot.faceIndex = chosen.index; slot.face = chosen.face;
      continuingArrivals.clear(); continuingArrivals.add(id);
      if (next.capacity !== layout.capacity) beginGrowth(layout, next);
      else growth = null;
      layout = next; selectedId = id;
      waveNormal = chosen.face.normal; waveAt = clock;
      yaw = Math.atan2(waveNormal[0], waveNormal[2]);
      pitch = Math.atan2(waveNormal[1], Math.hypot(waveNormal[0], waveNormal[2]));
      emitScene('arrival', true);
      pendingAdmission = {
        at: clock + 3.5,
        result: {kind: 'hex', faceIndex: chosen.index, faceId: chosen.face.id, seatId: id, illustration: true},
      };
      requestFrame();
      return {faceIndex: chosen.index, faceId: chosen.face.id, illustration: true};
    },
    setHolders(profiles = []) {
      holderOrbits.setProfiles(profiles);
      onHoldersChange(profiles);
    },
    // The twelve: one picture URL (or null) per pentagon, chair 0 to 11; each loads once and is laid on its face as the sphere turns.
    setChairs(sources = []) {
      for (let i = 0; i < 12; i++) chairs[i] = sources[i] ? picture(sources[i]) : null;
      requestFrame();
    },
    // The one at the centre: a picture URL (or null) drawn as the sphere's star, seen through the panels still open.
    setStar(src) { star = src ? picture(src) : null; requestFrame(); },
    setPaused(value) { paused = Boolean(value); visibility(); requestFrame(); },
    // THE PAYWALL (dl-paywall.js): held at his 37.132 s the sphere stands still and draws only on a cause; the page's own pause is left as it is
    setHeld(value) { held = Boolean(value); visibility(); requestFrame(); },
    // THE FLASK (dl-mint-pour.js): the paid seats counted ({gold, bronze}); once the window is open each new one falls into it as a drop
    setPour(seats) { flask.setSeats(seats); requestFrame(); },
    // THE MINT WINDOW (dl-twelve.js, from the wall): whether the wall holds this viewer on the drawn arrow (watching while the mint is open,
    // or held there). Let go at the arrow, the window is left on the film's seconds ('leaving'); let go before it, there was none.
    setMintWindow(on) {
      const next = on ? 'ahead' : mintMode && Number.isFinite(moment) && moment >= (MINT_WINDOW.frame - 1) * FRAME_S ? 'leaving' : null;
      if (next !== mintMode) { mintMode = next; requestFrame(); }
    },
    // dl-voices.js: one function drawn over the faces at the end of every frame, given the anchors; it returns true while something it draws moves
    setOverlay(fn) { overlay = typeof fn === 'function' ? fn : null; requestFrame(); },
    // dl-her-portrait.js: one function drawn on each seat's hexagon as it stands this frame (a bronze's floating plate, a gold's top), given its id, its outline, its middle and how far it has come in: the seat's face
    setSeatFace(fn) { seatFace = typeof fn === 'function' ? fn : null; requestFrame(); },
    // lab/heartbeat.js: one function asked at every draw for {loop, size} (the orbits' reach and the sphere's size, 1 is its own); null for none
    setPulse(fn) { pulse = typeof fn === 'function' ? fn : null; requestFrame(); },
    // lab/rite-unit1s.js: one function asked at every draw for the rite's unit1s (or null outside the rite); null for none
    setRite(fn) { rite = typeof fn === 'function' ? fn : null; requestFrame(); },
    // the seats this viewer holds (seat ids), drawn gold
    setMine(ids = []) { mine.clear(); for (const id of ids) mine.add(id); requestFrame(); },
    // where a face was in the last frame ({x, y, z, points} in css px; z > 0 faces the eye), or undefined
    anchor(id) { return anchors.get(id); },
    redraw() { askedAt = performance.now(); requestFrame(); },
    // The film's second (dl-twelve.js, each painted frame and each seek): the illustration's phase and the cosmos are functions of it alone.
    // Nothing moves on a second that changes neither; a confirmed ledger, a preview or a scene picked by hand keep their own picture.
    setMoment(seconds) {
      if (!Number.isFinite(seconds)) return;
      settleIllustration ||= moment === null || seconds < moment || seconds - moment > .5;
      if (seconds !== moment) momentAt = performance.now();
      moment = seconds; automatic = false;
      const own = mintClockAt(seconds, mintMode);   // the sphere's own second: the film's, but on THE MINT WINDOW's way
      const glow = momentCosmos(own), phase = momentPhase(own); graceNow = own >= SEIYA_MOMENTS.fold;
      let moved = glow !== cosmos;
      cosmos = glow;
      if (mode === 'illustration' && !previewing && !chosen && phase !== phaseTime) { phaseTime = phase; moved = true; }
      // THE POSE IS THE FILM'S: the turn at this second, plus what the hand added since the last one, eased out before her cut
      const base = poseAt(own), keep = handAt(own);
      handYaw += yaw - shownYaw; handPitch += pitch - shownPitch;
      if (keep === 0) { handYaw = 0; handPitch = 0; }
      // THE MINT WINDOW: on the way into it the hand's own turn (a drag, the vessel's growth turns) eases out the shortest way round, so the stop
      // stands in the film's own pose on every screen, the pose the land law's front is taken in (MINT_FRONT): THE POSE IS THE FILM'S
      const unwind = mintMode === 'ahead' ? 1 - mintCrossAt(seconds, mintMode) : 1, turned = unwind < 1 ? handYaw - TAU * Math.round(handYaw / TAU) : handYaw;
      shownYaw = base.yaw + turned * keep * unwind; shownPitch = clamp(base.pitch + handPitch * keep * unwind, -1.35, 1.35);
      if (shownYaw !== yaw || shownPitch !== pitch) { yaw = shownYaw; pitch = shownPitch; moved = true; }
      if (moved) requestFrame();
    },
    resetView() { home(); selectedId = null; requestFrame(); },
    /** camera(shot): THE CAMERA. shot {zoom, x, y, yaw, pitch, drift, ms}: any field left out keeps where the camera stands; ms 0 (or none) a cut, else a dolly
     *  eased over ms; null lets go at once (identity, no drift). Returns the shot it took. */
    camera(shot) {
      if (camRaf) { cancelAnimationFrame(camRaf); camRaf = 0; } camLast = 0;
      if (shot == null) { cam = {...CAM_REST}; camTo = camFrom = null; requestFrame(); return null; }
      const fin = (v, d) => (Number.isFinite(v) ? v : d), to = {zoom: Math.max(.05, fin(shot.zoom, cam.zoom)), x: fin(shot.x, cam.x), y: fin(shot.y, cam.y),
        yaw: fin(shot.yaw, cam.yaw), pitch: clamp(fin(shot.pitch, cam.pitch), -1.35, 1.35)};
      cam.drift = fin(shot.drift, 0); const ms = Math.max(0, fin(shot.ms, 0));
      if (ms === 0) { Object.assign(cam, to); camTo = camFrom = null; } else { camFrom = {...cam}; camTo = to; camAt = performance.now(); camMs = ms; }
      camRaf = requestAnimationFrame(camStep); return {...to, drift: cam.drift, ms};
    },
    cameraState() { return {...cam, moving: Boolean(camTo)}; },
    getViewState() {
      return {yaw, pitch, radius: renderedRadius * drawnSize, capacity: layout.capacity, count: layout.count,
        growthProgress: growth ? growth.progress : 1, growing: Boolean(growth), mode, holderCount: holderOrbits.count,
        scene, phaseTime, moment, cosmos, body: {...bodyState}, automatic, paused, held, mint: {mode: mintMode, cross: mintNowK, flask: flask.state()},
        // the frame (Oct 15 2026): whether the kernel draws it, the film's staging square, the ECG strip's samples and whether the last draw built it
        kernel: kernel !== null, stageSide, strip: {samples: beatTrace ? beatTrace.length : 0, built: traceBuf ? traceLen : 0},
        // the draws so far and the last one's cost (lab/hero-fps.bench.mjs reads the rate off them)
        draws, drawMs};
    },
    destroy() {
      destroyed = true; holderOrbits.destroy(); if (frame) cancelAnimationFrame(frame); if (camRaf) cancelAnimationFrame(camRaf);
      resizeObserver.disconnect(); intersection.disconnect();
      document.removeEventListener('visibilitychange', visibility); media.removeEventListener('change', motionChange);
      canvas.removeEventListener('pointerdown', pointerDown); canvas.removeEventListener('pointermove', pointerMove);
      canvas.removeEventListener('pointerup', pointerUp); canvas.removeEventListener('pointercancel', pointerCancel);
      canvas.removeEventListener('lostpointercapture', pointerCancel); canvas.removeEventListener('keydown', keyDown);
      hitFaces = []; pointer = null; pendingAdmission = null; continuingArrivals.clear();
    },
  };
}

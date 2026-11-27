// cuts.js: THE CUTS WIRED, Ingi Erlingsson's grammar as the hero's devices (CUTS.md holds the reading). His words, Oct 14 2026 15:1x WEST,
// over four of his posts: "can you please pay attention to his style recurring please? he got predicatble transitions etc".
//
// One pure plan, a function of the film's second and nothing else: the hero's page (hero-ab.html, theater.js) and the proof (cuts.html) ask
// it at each draw and get back what the dodecahedron's twelve faces show. Nothing here draws, waits or runs on its own.
//
//   import {cutsAt, shotsOf, blockOrder, CUTS_GLSL} from './cuts.js';
//   cutsAt(t, {tags, shots, bursts, quiet}) -> {pass, passFrame, blocks, chips, keep, cut}
//     t          the film's second (a presented frame's mediaTime, or currentTime): saint-seiya.mp4 ?v=53561d47, 29.97 frames a second
//     tags       his tags on the line of time (the Nest ref mint/seiya-tags: its value, or its tags array)
//     shots      the film's own cuts: seconds or {t, frame}, or braindance.json itself (its `cuts`, else FILM_CUTS; shotsOf). Default FILM_CUTS.
//     bursts     the seconds of the hero's bursts (default BURSTS, hero-ab.html's: 11.044 s and 37.10 s)
//     quiet      spans [from, to] in seconds where no device of ours fires (default FLURRIES, the film's own cut device; a caller adds its own)
//   ->
//     pass       'picture' | 'normals' | 'matte': THE PASS AS THE CUT. At each burst and at his conversion tag the faces show the normals pass
//                (the face normal as colour) for PASS.normals frames, then the flat gold matte (GOLD) for PASS.matte frames, then the picture.
//     passFrame  the frame of that pass cut (0 to 9), or null
//     blocks     THE CODEC'S CUT, or null: {since, filled, seed, holes, cut}. At each of the film's own cuts, for BEAT frames the frame before
//                the cut stands as 16-px blocks of the film frame while the new frame fills in block by block in the one seeded order:
//                `filled` of the blocks show the new frame, `holes` of the rest are holes (the page's white), the others the frame that stands.
//                `since` is seconds since the cut's first frame; `cut` the cut's second (the frame the page keeps is keep's).
//     chips      THE TAG CHIPS: [{t, name, colour, face, id, words}], his tags whose second has come, each a small coloured chip with a thin line
//                to the face that faced the eye at its second; kept through every cut after it
//     keep       on the KEEP frames before a block cut, that cut's second: the page keeps this frame as the one that stands; else null
//     cut        the device on at t ({kind: 'pass' | 'blocks', t, frame, why}), or null
//
// THE RULE OF ONE: one device per moment, the same device at every moment of its kind, a cut on the beat the film already has. A pass cut
// wins over a cut that falls inside it (11.044 s is both a burst and a cut: the pass; the cut at 37.204 s falls inside the 37.10 s pass:
// none), a second device never starts inside another, and none of ours fires where the film runs its own (FLURRIES). No dissolves anywhere:
// every frame is one state or the next.
//
// COST (a draw is the page's own, made on the film's frame anyway): the pass changes one uniform and samples nothing (cheaper than the picture);
// the blocks add one copy of the film frame into the frame that stands (KEEP copies at most a cut, 960 x 540) and a second texture read for
// BEAT frames; the chips are DOM made once, a few attributes written on a draw. At rest nothing: the plan is asked only by a draw, and a
// page draws only on a cause (the film's frame, a seek, a resize). cutsAt itself: 0.2 us a call (cuts.test.mjs measures it, this Mac).

/** The film's frames a second: saint-seiya.mp4 ?v=53561d47 is NTSC, 30000 / 1001 (theater-light.json fps). */
export const FPS = 30000 / 1001;
/** The pass cut: frames of the normals pass, then frames of the flat gold matte (a third of a second, Ingi's 6 to 12 frames a transition). */
export const PASS = Object.freeze({normals: 6, matte: 4});
/** The codec's cut: frames the old blocks stand while the new frame fills in (a fifth of a second). */
export const BEAT = 6;
/** The share of the blocks not yet filled that are holes, the page's white showing through (the rest are the frame that stands). */
export const HOLES = 0.3;
/** The one order the blocks fill in, the same at every cut (1988, the film's year). */
export const SEED = 1988;
/** A macroblock: 16 px of the film frame, counted from its top-left as the codec counts them. */
export const BLOCK = 16;
/** Frames before a block cut on which the page keeps the frame (the last one it saw before the cut stands; three, for a dropped frame or two). */
export const KEEP = 3;
/** The hero's bursts (hero-ab.html BURSTS, read frame by frame off the film): the cut to the hit on him, the beam opening into the flood. */
export const BURSTS = Object.freeze([11.044, 37.10]);
/** The flat matte's gold, as 0..1: the one the hero's engines already wear for it (theater.js, unboxing.js, main bd63d9a2), #d4a34a. */
export const GOLD = Object.freeze([0.83, 0.64, 0.29]);
/** The chips' colours, in the order of his tags (Ingi's chips: cyan, yellow, blue, white bars). */
export const CHIP_COLOURS = Object.freeze(['#29c5dc', '#f2cb2c', '#3466f6', '#ffffff']);
/** His tags at rev 1 of mint/seiya-tags (made 11:4x to 11:5x WEST, Oct 14 2026): a page's words when the Nest does not answer. */
export const TAGS_AT_REV_1 = Object.freeze([
  {id: 'mv7zt3b8zm', t: 10.835, text: 'THIS MOMENT IS FUCKING CRITICAL DUDE!  THIS IS THE MOMENT OF SACRIFICE!!!! THERE IS A LONG LINEAGE OF CULTURE ABOUT THE OPENAI CIVILIZATION SWARM LORE THERE WERE VIDEOS BEEN MADE ABOUT IT AND ALL THAT DUDE'},
  {id: 'mv7zv4nd2u', t: 37.132, text: 'FUCKING EPIC MOMENT WHERE AIOLOS STARTS APPEARING!!! THIS IS WHERE WE WANT TO STOP THE VIDEO AND PUT THE PAYWALL ON THE GOLDEN ARMOR DUDE'},
  {id: 'mv7zwh1ifk', t: 61.767, text: 'THIS MOMENT IS FUCKING KEY IT IS THE FUCKING CONVERSION MOMENT, THE USER HAS SEEN I'},
]);

/** The frame shown at second t (a millisecond's grace for a mediaTime written short). */
export const frameOf = (t, fps = FPS) => Math.floor(t * fps + 1e-3);
/** The second a frame begins. */
export const startOf = (frame, fps = FPS) => frame / fps;
/** A boundary read off the film (a burst, a shot change), written to the millisecond: the frame that begins nearest it. */
const boundary = (t, fps) => Math.round(t * fps);

/**
 * The film's own cuts up to 81 s, [second, score]: ffmpeg's scene score, gt(scene,0.25), on app/saint-seiya.mp4 at 30000/1001, each second
 * a frame's pts (the mint session's measure, Oct 14 2026 16:0x WEST). The codec's cut lands on these. braindance.json's camera list is a
 * reading at about half a second (24.0, 28.0 and 32.0 s are not cuts at all): its boundaries are never the beat. Once the record carries the
 * film's cuts as its own `cuts` array, shotsOf reads them there and this copy stands down.
 */
export const FILM_CUTS = Object.freeze([[2.903, 0.39], [5.405, 0.26], [6.406, 0.31], [8.542, 0.45], [8.909, 0.43], [11.044, 0.30], [16.049, 0.32],
  [19.052, 0.39], [29.563, 0.40], [33.567, 0.38], [36.570, 0.43], [37.204, 0.29], [38.071, 0.42], [39.339, 0.49], [42.342, 0.51], [45.445, 0.40],
  [49.550, 0.33], [50.050, 0.96], [53.053, 0.67], [55.055, 0.44], [57.057, 0.45], [59.059, 0.60], [71.138, 0.56], [71.572, 0.64], [72.472, 0.44],
  [74.975, 0.35], [76.977, 0.40], [80.747, 0.34]].map(c => Object.freeze(c)));
/** Where the film runs its own cut device, about forty cuts 0.07 to 0.2 s apart: the armor closing, the meteors, the arrow. None of ours there. */
export const FLURRIES = Object.freeze([[64.898, 69.603], [100.767, 108.275], [115.282, 119.353]].map(s => Object.freeze(s)));

/**
 * The film's cuts for the plan: the record's `cuts` array when it holds one (seconds, [second, score], or {t, frame?}), else FILM_CUTS; never
 * the camera list. A cut that carries its frame gives {t, frame} and lands on that frame; a second lands on the frame that begins nearest it.
 */
export function shotsOf(bd) {
  const cuts = Array.isArray(bd?.cuts) && bd.cuts.length ? bd.cuts : FILM_CUTS;
  return cuts.map((c) => {
    if (Number.isFinite(c)) return c;
    if (Array.isArray(c)) return c[0];
    const t = [c?.t, c?.at, c?.s, c?.second].find(Number.isFinite);
    return Number.isInteger(c?.frame) ? {t: t ?? c.frame / FPS, frame: c.frame} : t;
  }).filter(c => Number.isFinite(c) || Number.isInteger(c?.frame));
}

const tagsOf = (tags) => (Array.isArray(tags) ? tags : Array.isArray(tags?.tags) ? tags.tags : [])
  .filter(tag => tag && Number.isFinite(tag.t)).slice().sort((a, b) => a.t - b.t);
/** His tag whose words name the conversion (hero-ab.html reads it the same way), or null. */
export const conversionOf = (tags) => tagsOf(tags).find(tag => /conversion/i.test(tag.text ?? '')) ?? null;
/** A chip's name: the word of his that names the moment, else his first two words. */
export function nameOf(text = '') {
  const word = /\b(sacrifice|aiolos|conversion|paywall)\b/i.exec(text);
  return (word ? word[1] : text.trim().split(/\s+/).slice(0, 2).join(' ')).toUpperCase();
}

// The sphere's dodecahedron (theater.js, assembly-geometry.js): circumradius one, its twelve face normals the icosahedron's corners.
const PHI = (1 + Math.sqrt(5)) / 2;
const unit3 = (v) => { const l = Math.hypot(...v); return v.map(c => c / l); };
/** The twelve face normals, in theater.js's order. */
export const FACES = Object.freeze([[0, 1, PHI], [0, 1, -PHI], [0, -1, PHI], [0, -1, -PHI], [1, PHI, 0], [1, -PHI, 0], [-1, PHI, 0], [-1, -PHI, 0],
  [PHI, 0, 1], [PHI, 0, -1], [-PHI, 0, 1], [-PHI, 0, -1]].map(unit3));
/** The page's sphere at rest (theater.js rest(), warm-sphere.js rotate()): yaw about the vertical, then the pitch, at second t. */
export const restTurn = (t) => ({yaw: -0.32 + 0.12 * t, pitch: -0.12});
/** How far a face looks at the eye (+z) under a turn: its turned normal's z. */
export const facing = (n, {yaw, pitch}) => Math.sin(yaw) * Math.cos(pitch) * n[0] + Math.sin(pitch) * n[1] + Math.cos(yaw) * Math.cos(pitch) * n[2];
/** The face nearest the eye under a turn, leaving out the faces already taken. */
export function nearestFace(turn, taken = []) {
  let best = -1, z = -Infinity;
  FACES.forEach((n, i) => { const k = facing(n, turn); if (!taken.includes(i) && k > z) { z = k; best = i; } });
  return best;
}

// the plan, made once for a set of inputs (a page asks with the same object every draw)
const memo = new WeakMap();
/** The cuts after the rule of one, and the chips, for these inputs. */
export function planOf({tags = [], shots = FILM_CUTS.map(c => c[0]), bursts = BURSTS, quiet = FLURRIES, fps = FPS, turnAt = restTurn} = {}) {
  const changes = (Array.isArray(shots) ? shots : shotsOf(shots)).map(s => (Number.isFinite(s) ? {t: s, frame: boundary(s, fps)} : s))
    .filter(s => Number.isFinite(s?.t) && Number.isInteger(s?.frame));
  const conversion = conversionOf(tags), span = PASS.normals + PASS.matte, cuts = [];
  // quiet: the film's own cut device (FLURRIES) and any span a caller keeps for a device of its own (the hero's box at 42.342 s): none of ours
  const hush = quiet.filter(q => Number.isFinite(q?.[0]) && Number.isFinite(q?.[1])).map(([a, b]) => [frameOf(a, fps), frameOf(b, fps)]);
  const free = (frame, length) => cuts.every(c => frame + length <= c.frame || c.frame + c.span <= frame) && hush.every(([a, b]) => frame + length <= a || b < frame);
  const passes = [...bursts.filter(Number.isFinite).map(t => ({t, frame: boundary(t, fps), why: 'burst'})),
    ...(conversion ? [{t: conversion.t, frame: frameOf(conversion.t, fps), why: 'conversion', tag: conversion.id}] : [])];
  for (const p of passes.sort((a, b) => a.frame - b.frame)) if (free(p.frame, span)) cuts.push({kind: 'pass', span, ...p});
  for (const {t, frame} of [...changes].sort((a, b) => a.frame - b.frame)) if (free(frame, BEAT)) cuts.push({kind: 'blocks', t, frame, span: BEAT, why: 'cut'});
  cuts.sort((a, b) => a.frame - b.frame);
  const taken = [], chips = tagsOf(tags).map((tag, i) => {
    const face = nearestFace(turnAt(tag.t), taken); taken.push(face);
    return {t: tag.t, frame: frameOf(tag.t, fps), name: nameOf(tag.text), colour: CHIP_COLOURS[i % CHIP_COLOURS.length], face, id: tag.id ?? null, words: tag.text ?? ''};
  });
  return {cuts, chips, fps};
}
const planFor = (options) => {
  if (options?.cuts && options?.chips) return options;   // a plan already made
  let plan = memo.get(options);
  if (!plan) { plan = planOf(options); if (options && typeof options === 'object') memo.set(options, plan); }
  return plan;
};

/** What the faces show at the film's second t (see the header). */
export function cutsAt(t, options = {}) {
  const plan = planFor(options), fps = plan.fps, f = frameOf(Number.isFinite(t) ? t : 0, fps);
  let on = null, keep = null;
  for (const c of plan.cuts) {
    const k = f - c.frame;
    if (k >= 0 && k < c.span) on = c;
    else if (c.kind === 'blocks' && k < 0 && k >= -KEEP) keep = c.t;
  }
  const k = on ? f - on.frame : null;
  const pass = on?.kind === 'pass' ? (k < PASS.normals ? 'normals' : 'matte') : 'picture';
  const blocks = on?.kind === 'blocks' ? {since: Math.max(0, t - startOf(on.frame, fps)), filled: k / BEAT, seed: SEED, holes: HOLES, cut: on.t} : null;
  const chips = [];
  for (const c of plan.chips) if (c.frame <= f) chips.push({t: c.t, name: c.name, colour: c.colour, face: c.face, id: c.id, words: c.words});
  return {pass, passFrame: on?.kind === 'pass' ? k : null, blocks, chips, keep, cut: on ? {kind: on.kind, t: on.t, frame: on.frame, why: on.why} : null};
}

/** The one seeded order: for each 16-px block of a cols x rows frame (row by row from the top-left), its place in the fill, (rank + 0.5) / n. */
export function blockOrder(cols, rows, seed = SEED) {
  const n = cols * rows, order = new Uint32Array(n), rank = new Float32Array(n);
  let s = seed >>> 0;
  const next = () => { s = (s + 0x6d2b79f5) >>> 0; let x = s; x = Math.imul(x ^ (x >>> 15), x | 1); x ^= x + Math.imul(x ^ (x >>> 7), x | 61); return ((x ^ (x >>> 14)) >>> 0) / 4294967296; };
  for (let i = 0; i < n; i++) order[i] = i;
  for (let i = n - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); const v = order[i]; order[i] = order[j]; order[j] = v; }
  for (let i = 0; i < n; i++) rank[order[i]] = (i + 0.5) / n;
  return rank;
}
/** What a block shows at a share `filled` of the fill: 'new', 'hole' or 'old' (the frame that stands). The shader's rule, line for line. */
export const blockShows = (rank, filled, holes = HOLES) => rank < filled ? 'new' : rank < filled + holes * (1 - filled) ? 'hole' : 'old';
/** The block grid of a film frame of w x h px. */
export const gridOf = (w, h) => [Math.ceil(w / BLOCK), Math.ceil(h / BLOCK)];

/**
 * The shader half, GLSL ES 3.0, for any engine that draws the faces (cuts.html's three.js; theater.js by the lines in CUTS.md). Uniforms:
 * uPass (0 the picture, 1 normals, 2 the matte), uFilled (below 0: no block cut), uHoles, uHeld (the frame that stands, laid as the film is),
 * uHeldOk (0 until the page holds it: its blocks are holes then), uOrder (blockOrder as a cols x rows red texture), uFilmPx, uGrid.
 * cutsPass(picture, n): the face's colour at a pass, n the face normal in the eye's frame. cutsBlock(uv): 1 the new frame, 0 the frame that
 * stands, -1 a hole, at a film texture coordinate (v up, as the texture is laid).
 */
export const CUTS_GLSL = `
uniform float uPass, uFilled, uHoles, uHeldOk;
uniform sampler2D uHeld, uOrder;
uniform vec2 uFilmPx, uGrid;
const vec3 CUTS_GOLD = vec3(${GOLD.map(v => v.toFixed(4)).join(', ')});
vec3 cutsPass(vec3 picture, vec3 n) { return uPass > 1.5 ? CUTS_GOLD : uPass > 0.5 ? normalize(n) * 0.5 + 0.5 : picture; }
float cutsBlock(vec2 uv) {
  if (uFilled < 0.0) return 1.0;
  vec2 b = floor(vec2(uv.x, 1.0 - uv.y) * uFilmPx / ${BLOCK.toFixed(1)});
  float r = texture(uOrder, (b + 0.5) / uGrid).r;
  if (r < uFilled) return 1.0;
  return r < uFilled + uHoles * (1.0 - uFilled) || uHeldOk < 0.5 ? -1.0 : 0.0;
}`;

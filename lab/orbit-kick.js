// orbit-kick.js: THE SATELLITES THROWN, for the hero in hero-ab.html. His words, Oct 14 2026 13:4x WEST, over the bursts: "consider i would
// also love if the lyssajusian unit1s satellite trajectories reacted to changed there my dude". The twelve worlds that fly round the page's
// sphere on its spherical Lissajous (warm-sphere.js orbitalSocieties: the Poleis 3:2 loop, four lanes, each world trailing the last 15.5 s
// of its path) are thrown outward by each burst's blast, swing back in past their loop and settle on it, and the whole swarm is swung round
// the sphere and back the same way: the loop's radius times 1 + out and a turn about the sphere's centre, both a struck spring's swing.
// Each point of a trail takes the kick of the film's second it was flown at (now less its age), so a trail keeps the swerve and carries it
// back along itself until it leaves the tail, and the worlds flare while they are out.
//
// From outside the page, so nothing of app/ changes: while a kick or its wake is on the trails (from just before each burst until its KICK
// seconds and the trail's 15.5 s are over), the sphere's own 2D context answers moveTo, lineTo and arc through this file (a prototype of
// its own put between the context and the 2D context's, the kick worked out once a frame for each step of a trail), and only what is drawn in the four lane colours (warm-sphere.js orbitalSocieties) moves: a point of a trail by
// how old the trail's width says it is (.35 + .9 * (1 - age), one sixty-fourth of the trail between the two ends of a segment), a world by
// now. Outside those windows the context is the page's own again; nothing at rest costs anything. If those colours change in warm-sphere.js
// nothing moves; if that width rule
// changes, the swerve sits at the wrong place along the trail. In the page itself (its lane's, when he says so) this is one line of
// orbitalSocieties: project(p, center, orbitalRadius * (1 + out)), turned, at the kick of moment - age * 15.5, `moment` being the film's
// second the sphere already has (setMoment).
//
// THE HUSH (the unboxing, unboxing.js: his paywall and conversion tags, Oct 14 2026 14:xx WEST, "i want to keep white background and only the
// dodecahedron faces can carry video signal"). While the 3D box is out it stands where the page's dodecahedron stood, so the page must not
// draw its own; its rings, its stars, its satellites and their trails stay. hush(decide) puts the same prototype on the context while `decide`
// is set, and in each of the page's frames:
// - the frame begins at its clearRect (warm-sphere.js draw(): the first thing it does, at save depth 0);
// - the skin begins where `lineJoin = 'round'` is set at save depth 1 (drawSkin's first line, ctx.save(); ctx.lineJoin = 'round'; the twelve
//   miniatures the satellites become set it at depth 2, inside orbitalSocieties' own save, and are left alone); decide() is asked then, once
//   a frame, before the skin draws anything, and answers 0 (draw it), 1 (draw it, and send what comes after it to `front`) or 2 (hush it, and
//   send what comes after it to `front`);
// - while a hushed skin lasts (to the restore that brings the depth back to 0), fill, stroke, fillRect, strokeRect, drawImage, fillText and
//   strokeText draw nothing (the faces, their pictures, their shade, their edges, the star behind them);
// - after the skin, everything the page draws in front of its sphere (the near halves of the rings, the near worlds and trails, the holders'
//   near tiles, the bearing under it) goes to `front`, a 2D canvas laid over the 3D box, so what was in front of the dodecahedron stays in
//   front of the box; the page's state at that moment (its transform, styles, alpha) is copied over first, and `front` is cleared at the
//   start of each of the page's frames.
// So the page's own frame is the one place the box takes over and hands back: decide() may draw the box itself before it answers, in the
// same task as the page's draw, and no frame shows both or neither. The kick works the same on both canvases. hush(null) lets go.
//
// THE WORLDS AS FACES (his words, Oct 14 2026 15:4x WEST, over the open box at 58.7 s: "can you make it so that when that happens basically the
// pentagons faces here start being anchored to the lyssajudrean satellites orbiring please?", then "i mean each pentagon face becomes one of
// them indepently"). While the context answers, each of the twelve worlds the page draws in its lane colours (orbitalSocieties: a dot of
// 1.8 x its perspective, then a ring of 5 x) is read where it lands, kick and all: `worlds` is the last page frame's list of {x, y, r} in
// css px (r the dot's radius, so its perspective is r / 1.8). hideWorlds(true) keeps their dots and rings off the page (their trails stay):
// a face of the box is the world then (unboxing.js).
//
// THE WORLDS HEAR THE FILM (his words, Oct 14 2026 18:32 WEST, over the hero: "one thing i really dont like is that the orbiting satellites are
// not reacting to the music my dude... to what is being said... to the growing amounts of energy... you get what i mean or not??", then 18:34
// "eh waht are you waiting to turn them into lyssajusianz trajectories that react to the thing dude you get what i mean or not?"). The film's
// sound, measured once off its soundtrack (satellites-score.js, tools/satellites-score.mjs: no analyser on the page, his "you know in advance
// how it is going to oscillate"), bends the twelve's Lissajous trajectories the way a blast does, a pure function of the film's second.
// The energy changes slowly (hearAt), so it is taken at each point of a trail's own second and a trail keeps the energy it was flown through:
// - the energy (the score's slow curve, rising to the meteors): over the film's resting level (0.55 of its range) the loop widens and the
//   swarm turns about the sphere, both as its square (0.14 of the loop and 0.12 radians a second at the height; a whole number of turns over
//   the film, so a loop of it does not jump), so a trail at the height curls round the sphere, wider at its head.
// The rest changes faster than a trail's points can carry: they are 0.24 s and about 15 px apart, so a change faster than a second, drawn
// along a trail, breaks it into corners (the first pictures, 19:05 WEST). It moves the whole swarm at once, at the film's second (throbAt):
// - what is said (each line of the film's burned-in subtitles, the score's lines; saidAt): a lean out and round as the line comes (lines under
//   0.6 s after the last one that leaned lean no more: the subtitle reads' flicker), and the loop held a little wider while it stands;
// - the bass: the loop breathes out with its pulses (its rise over its own half second; its level stands high all through the film);
// - the beats (the score's onsets over 0.3 of their height, each decaying in 0.16 s), and the energy: each world's dot and ring flare.
// So the context answers all through the film, through a lighter prototype of its own while the box does not hush the skin (only the members
// the kick needs; the rest are the page's own), and it changes nothing the page does not draw: at rest nothing. ?hear=off on hero-ab.html
// (createOrbitKick's hear: false) leaves the kick alone, as before.
import {SPHERE_X} from '../app/sphere-centre.mjs';
import {SCORE} from './satellites-score.js';

const LANES = new Set(['#a98242', '#438c82', '#b49a68', '#6d8698', '#d6bd7d', '#85bcb0', '#c7ac7a', '#9cbbb9']);   // light, then dark
const SPAN = 15.5, STEPS = 64;   // the trail's seconds and its steps (warm-sphere.js: at - age * 15500 ms, age = step / 64)
export const KICK = 6;   // seconds a kick lasts on the worlds themselves
const DELAY = 0.12;   // the blast reaches them this long after the burst begins
const OUT = 0.62, TURN = 0.3;   // at the most: out by this much of the loop's radius, round by this many radians
// what a hushed skin does not draw, and the state copied to `front` when the page's front layer goes there
const HUSHED = ['fill', 'stroke', 'fillRect', 'strokeRect', 'drawImage', 'fillText', 'strokeText'];
const STATE = ['globalAlpha', 'globalCompositeOperation', 'fillStyle', 'strokeStyle', 'lineWidth', 'lineCap', 'lineJoin', 'miterLimit',
  'lineDashOffset', 'shadowBlur', 'shadowColor', 'shadowOffsetX', 'shadowOffsetY', 'font', 'textAlign', 'textBaseline', 'direction',
  'imageSmoothingEnabled', 'filter'];
// a struck spring, e^(-u / decay) sin(pi u / half), scaled so its first swing peaks at one
const swing = (u, decay, half) => { const w = Math.PI / half, peak = Math.atan(w * decay) / w; return Math.exp((peak - u) / decay) * Math.sin(w * u) / Math.sin(w * peak); };

/** The kick at the film's second s: [out, turn], from every burst {t, power} whose blast is still on the worlds. */
export function kickAt(s, bursts) {
  let out = 0, turn = 0;
  for (const b of bursts) {
    const u = s - b.t - DELAY;
    if (!(u > 0 && u < KICK)) continue;
    const p = b.power ?? 1;
    out += p * OUT * swing(u, 0.8, 1.4);
    turn += p * TURN * swing(u, 1.0, 2.2);
  }
  return [out, turn];
}

/** Whether the kick or its wake is on the trails at second s (and the context must answer). */
export const kickNear = (s, bursts) => bursts.some(b => s >= b.t - 0.5 && s < b.t + DELAY + KICK + SPAN);

// THE WORLDS HEAR THE FILM: the score read once, at import, into what the worlds take from it (four arrays of the film's 4,625 frames)
const FPS = SCORE.fps, FRAMES = SCORE.frames, V = SCORE.values;
export const LOOP = FRAMES / FPS;   // the film's seconds; it loops (dl-twelve.js), and a second before 0 is one before its end
const lerp = (arr, f) => { const i = Math.max(0, Math.min(arr.length - 1, Math.floor(f))), j = Math.min(arr.length - 1, i + 1), k = Math.max(0, Math.min(1, f - i)); return arr[i] * (1 - k) + arr[j] * k; };
// the energy as the worlds feel it: none at the film's resting level (0.55 of the score's range) and under, all of it at the height, squared
export const FELT = Float32Array.from(V.energy, (b) => Math.max(0, (b / 255 - 0.55) / 0.45) ** 2);
// the turn: FELT summed over the film's frames, its speed set so the whole sum is a whole number of turns, about 0.12 radians a second at the height
const SPUN = (() => { const out = new Float64Array(FRAMES + 1); for (let i = 0; i < FRAMES; i++) out[i + 1] = out[i] + FELT[i] / FPS; return out; })();
export const TURNS = Math.max(1, Math.round(0.12 * SPUN[FRAMES] / (2 * Math.PI)));
const SPIN = 2 * Math.PI * TURNS / SPUN[FRAMES];
// the bass's pulses: its rise over its own mean of the half second about it, 1 at the film's 98th percentile
const PULSE = (() => {
  const b = V.bass, raw = new Float32Array(FRAMES), half = 8;
  let sum = 0;
  for (let i = 0; i < Math.min(FRAMES, half); i++) sum += b[i];
  for (let i = 0; i < FRAMES; i++) {
    if (i + half < FRAMES) sum += b[i + half];
    if (i - half - 1 >= 0) sum -= b[i - half - 1];
    raw[i] = Math.max(0, b[i] - sum / (Math.min(FRAMES - 1, i + half) - Math.max(0, i - half) + 1));
  }
  const top = Float32Array.from(raw).sort()[Math.floor(0.98 * FRAMES)] || 1;
  return raw.map((v) => Math.min(1, v / top));
})();
// the beats' flash: each onset over 0.3 of its height, decaying in 0.16 s
const FLASH = (() => { const out = new Float32Array(FRAMES), d = Math.exp(-1 / (0.16 * FPS)); let env = 0; for (let i = 0; i < FRAMES; i++) { env = Math.max(env * d, Math.max(0, (V.beat[i] / 255 - 0.3) / 0.7)); out[i] = env; } return out; })();
// what is said: [second, weight against the film's heaviest line, seconds it stands, whether it leans]
const HEAVIEST = Math.max(...SCORE.lines.map((l) => l[2]));
const SAID = (() => { let leaned = -Infinity; return SCORE.lines.map(([t0, t1, w]) => { const leans = t0 - leaned >= 0.6; if (leans) leaned = t0; return [t0, w / HEAVIEST, t1 - t0, leans]; }); })();
const HELD = Math.max(4, ...SAID.map(([, , len]) => len + 0.6));   // a line is on the worlds this long at most after it comes
// the last index of a sorted [[t, ...]] list at or before t (-1 if none)
const before = (list, t) => { let lo = 0, hi = list.length - 1, at = -1; while (lo <= hi) { const mid = (lo + hi) >> 1; if (list[mid][0] <= t) { at = mid; lo = mid + 1; } else hi = mid - 1; } return at; };
const ease = (u) => u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u);
const inFilm = (s) => (s < 0 ? s + LOOP : s);
/** The energy at second s, taken at each point of a trail's own second: [out (of the loop's radius), turn (radians)]. */
export function hearAt(s) {
  if (!Number.isFinite(s)) return [0, 0];
  s = inFilm(s);
  if (s < 0) return [0, 0];
  const f = s * FPS;
  return [0.14 * lerp(FELT, f), SPIN * lerp(SPUN, f)];
}
/** What is said at second t: [out (of the loop's radius), turn (radians)], a lean as each line comes and the loop held wider while it stands. */
export function saidAt(t) {
  if (!Number.isFinite(t)) return [0, 0];
  t = inFilm(t);
  let out = 0, turn = 0, held = 0;
  for (let i = before(SAID, t); i >= 0 && t - SAID[i][0] < HELD; i--) {
    const [at, k, len, leans] = SAID[i], u = t - at;
    held = Math.max(held, k * ease(u / 0.3) * (1 - ease((u - len) / 0.6)));   // the most of any line standing
    if (leans && u < 4) { out += 0.06 * k * swing(u, 0.5, 0.9); turn += 0.04 * k * swing(u, 0.7, 1.4); }
  }
  return [out + 0.03 * held, turn];
}
/** The fast of the sound at second t, on the whole swarm at once: [out (of the loop's radius: what is said, the bass's pulses, the beats),
 * turn (radians: what is said), flare (x a world's dot and ring: the beats, the energy)]. */
export function throbAt(t) {
  if (!Number.isFinite(t)) return [0, 0, 1];
  t = inFilm(t);
  if (t < 0) return [0, 0, 1];
  const f = t * FPS, flash = lerp(FLASH, f), [out, turn] = saidAt(t);
  return [out + 0.04 * lerp(PULSE, f) + 0.02 * flash, turn, 1 + 0.6 * flash + 0.35 * lerp(FELT, f)];
}
/** Whether the film's sound is on the worlds at second s: all through the film, which loops. */
export const hears = (s) => Number.isFinite(s) && s >= 0;
const NONE = Object.freeze([0, 0]), NOW = Object.freeze([0, 0, 1]);

/**
 * canvas: the page's sphere (its 2D context is the page's own); film: its clock; bursts: [{t, power}]; front: a 2D canvas over the box (THE HUSH);
 * hear: whether the worlds hear the film (THE WORLDS HEAR THE FILM).
 * at(second): answers or lets go of the context for that second of the film; hush(decide | null): see THE HUSH; hear(on): the worlds hear the
 * film or not, from the page's next frame; on: whether it answers; hushed: whether the page's last skin was hushed; frames: the page's frames
 * while the context answered; destroy(): lets go.
 */
export function createOrbitKick({canvas, film, bursts, front = null, hear = true}) {
  const ctx = canvas.getContext('2d'), base = Object.getPrototypeOf(ctx), doc = canvas.ownerDocument, view = doc.defaultView;
  const own = (name) => Object.getOwnPropertyDescriptor(base, name);
  const stroke = own('strokeStyle'), fill = own('fillStyle'), join = own('lineJoin'), lw = own('lineWidth');
  let on = false, kicking = false, hearing = Boolean(hear), lane = false, stack = [], frame = null, cx = 0, cy = 0, flare = 1, x = 0, y = 0;
  // THE HUSH: the decider, the save depth in this frame, whether the skin is being drawn and how (decide()'s answer), whether the page's
  // front layer goes to `front`
  let decide = null, depth = 0, skin = false, mode = 0, ahead = false, hushed = false, frames = 0;   // frames: the page's, counted while it answers
  let dirty = false;   // `front` holds a front layer
  // the line width the page set last (read again at each restore and as the context is taken): a trail's step without a read of the context
  // for each of its 1,536 points a frame
  let width = 1;
  const widthNow = (self) => { if (lw) width = lw.get.call(to(self)); };
  let worlds = [], hiding = false, dotNext = false;   // THE WORLDS AS FACES (dotNext: a lane fill was just set, its next arc is a world's dot)
  const lead = front?.getContext('2d') ?? null;
  const to = (self) => ahead ? lead : self;
  // each step of a trail's kick in this frame: its scale out and its turn
  const scale = new Float64Array(STEPS + 2), cos = new Float64Array(STEPS + 2), sin = new Float64Array(STEPS + 2);
  // the sphere's centre (warm-sphere.js draw(): 55 % across, halfway down, in css px), read again only when the canvas changes size
  const centre = () => { const box = canvas.getBoundingClientRect(); cx = box.width * SPHERE_X; cy = box.height * 0.5; };
  const sized = new view.ResizeObserver(centre);
  // once a page frame, when the worlds' colours first come: the kick at each step of the trails (the film's second less the step's age)
  const seen = () => {
    const key = doc.timeline.currentTime;
    if (key === frame) return;
    frame = key;
    const t = film.currentTime, [throb, lean, heard] = hearing ? throbAt(t) : NOW;
    let blast = 0;
    for (let k = 0; k <= STEPS + 1; k++) {
      const s = t - k / STEPS * SPAN, [out, turn] = kickAt(s, bursts), [hOut, hTurn] = hearing ? hearAt(s) : NONE;
      scale[k] = (1 + out + hOut) * (1 + throb); cos[k] = Math.cos(turn + hTurn + lean); sin[k] = Math.sin(turn + hTurn + lean);
      if (k === 0) blast = out;
    }
    flare = (1 + 1.2 * Math.max(0, blast)) * heard;
  };
  const move = (px, py, k) => {
    const dx = px - cx, dy = py - cy;
    x = cx + (dx * cos[k] - dy * sin[k]) * scale[k]; y = cy + (dx * sin[k] + dy * cos[k]) * scale[k];
  };
  const stepOf = (width) => Math.min(STEPS, Math.max(0, Math.round((1 - (width - 0.35) / 0.9) * STEPS)));
  // whether a style is a lane's ('#rrggbb'; the rest are rgb() or a gradient), each string the page sets looked at once
  const laneOf = new Map();
  const isLane = (v) => {
    if (typeof v !== 'string' || v.length !== 7) return false;
    let is = laneOf.get(v);
    if (is === undefined) { is = LANES.has(v.toLowerCase()); if (laneOf.size < 256) laneOf.set(v, is); }
    return is;
  };
  const style = (v) => { const was = lane; lane = isLane(v); if (lane && !was && kicking) seen(); };
  const filled = (v) => { style(v); dotNext = lane; };
  // `front` empty (when it holds anything: the page draws all through the film, and most of its frames send nothing there)
  const clearFront = () => {
    if (!lead || !dirty) return;
    dirty = false;
    if (typeof base.reset === 'function') { base.reset.call(lead); return; }
    base.setTransform.call(lead, 1, 0, 0, 1, 0, 0); base.clearRect.call(lead, 0, 0, front.width, front.height);
  };
  // the page's front layer goes to `front` from here: the size of the page's canvas, its state the page's own at this moment
  const toFront = (self) => {
    if (front.width !== canvas.width || front.height !== canvas.height) { front.width = canvas.width; front.height = canvas.height; }
    ahead = true; dirty = true;
    if (base.getTransform) base.setTransform.call(lead, base.getTransform.call(self));
    for (const name of STATE) { const d = own(name); if (d?.get && d.set) d.set.call(lead, d.get.call(self)); }
    if (base.getLineDash) base.setLineDash.call(lead, base.getLineDash.call(self));
  };
  // every member of the 2D context goes where the page's drawing goes now (its own canvas, or `front` after a skin); the ones below add to that
  const forward = {};
  for (const name of Object.getOwnPropertyNames(base)) {
    const d = own(name);
    if (name === 'constructor' || name === 'canvas' || !d) continue;
    if (typeof d.value === 'function') forward[name] = {configurable: true, writable: true, value(...args) { return d.value.apply(to(this), args); }};
    else if (d.get) forward[name] = {configurable: true, get() { return d.get.call(to(this)); }, ...(d.set ? {set(v) { d.set.call(to(this), v); }} : {})};
  }
  // the members the kick and the worlds' reading need (to(this) is the page's own canvas unless a hushed skin sent the front layer away)
  const kickMembers = {
    strokeStyle: {configurable: true, get() { return stroke.get.call(to(this)); }, set(v) { style(v); stroke.set.call(to(this), v); }},
    fillStyle: {configurable: true, get() { return fill.get.call(to(this)); }, set(v) { filled(v); fill.set.call(to(this), v); }},
    save: {configurable: true, writable: true, value() { stack.push(lane); depth++; base.save.call(to(this)); }},
    restore: {configurable: true, writable: true, value() {
      lane = stack.pop() ?? false; depth = Math.max(0, depth - 1);
      base.restore.call(to(this)); widthNow(this);
      if (skin && depth === 0) { skin = false; if (mode && lead) toFront(this); }
    }},
    ...(lw && {lineWidth: {configurable: true, get() { return lw.get.call(to(this)); }, set(v) { if (v > 0 && v < Infinity) width = +v; lw.set.call(to(this), v); }}}),
    moveTo: {configurable: true, writable: true, value(px, py) {
      if (!lane || !kicking) return base.moveTo.call(to(this), px, py);
      move(px, py, stepOf(lw ? width : this.lineWidth) + 1); base.moveTo.call(to(this), x, y);
    }},
    lineTo: {configurable: true, writable: true, value(px, py) {
      if (!lane || !kicking) return base.lineTo.call(to(this), px, py);
      move(px, py, stepOf(lw ? width : this.lineWidth)); base.lineTo.call(to(this), x, y);
    }},
    arc: {configurable: true, writable: true, value(px, py, r, a0, a1, ccw) {
      if (!lane) return base.arc.call(to(this), px, py, r, a0, a1, ccw);
      let ax = px, ay = py, ar = r;
      if (kicking) { move(px, py, 0); ax = x; ay = y; ar = r * flare; }
      if (dotNext) { worlds.push({x: ax, y: ay, r}); dotNext = false; }   // a world's dot: the first arc after its lane fill (its ring comes next)
      if (hiding && r < 10) return undefined;       // that world is a face of the box now: no dot, no ring
      base.arc.call(to(this), ax, ay, ar, a0, a1, ccw);
    }},
    // the page's frame begins: its own canvas again, `front` cleared
    ...(base.clearRect && {clearRect: {configurable: true, writable: true, value(...args) {
      if (!skin) { depth = 0; ahead = false; mode = 0; frames++; worlds = []; clearFront(); }
      return base.clearRect.apply(this, args);
    }}}),
  };
  const answers = Object.create(base, {
    ...forward,
    ...kickMembers,
    ...(join && {lineJoin: {configurable: true, get() { return join.get.call(to(this)); }, set(v) {
      if (v === 'round' && depth === 1 && !skin && !ahead && decide) { skin = true; mode = Number(decide()) || 0; hushed = mode === 2; }
      join.set.call(to(this), v);
    }}}),
    ...Object.fromEntries(HUSHED.filter(name => typeof base[name] === 'function').map(name => [name, {configurable: true, writable: true, value(...args) {
      if (skin && mode === 2) return undefined;
      return base[name].apply(to(this), args);
    }}])),
  });
  // without a hush only the kick's own members answer (`light`); the rest of the 2D context stays the page's own, so the music costs only them
  const light = Object.create(base, kickMembers);
  let proto = null;
  const take = (next) => { lane = false; stack = []; frame = null; depth = 0; skin = false; mode = 0; ahead = false; widthNow(ctx); centre(); sized.observe(canvas); Object.setPrototypeOf(ctx, next); };
  const leave = () => { Object.setPrototypeOf(ctx, base); sized.disconnect(); ahead = false; skin = false; hushed = false; clearFront(); };
  const sync = () => {
    const next = decide !== null ? answers : kicking ? light : null;
    if (next === proto) return;
    if (!next) leave();
    else if (!proto) take(next);
    else { ahead = false; skin = false; clearFront(); Object.setPrototypeOf(ctx, next); }
    proto = next; on = Boolean(next);
  };
  const wants = (s) => Number.isFinite(s) && (kickNear(s, bursts) || (hearing && hears(s)));
  return {
    get on() { return on; },
    get hushed() { return hushed; },
    get frames() { return frames; },
    /** THE WORLDS AS FACES: the twelve worlds of the page's last frame, {x, y, r} css px; and their dots and rings off (true) or on */
    get worlds() { return worlds; },
    hideWorlds(value) { hiding = Boolean(value); },
    at(second) {
      const was = kicking;
      kicking = wants(second);
      if (kicking && !was) frame = null;
      sync();
    },
    hear(value) { hearing = Boolean(value); frame = null; kicking = wants(film.currentTime); sync(); },
    get hearing() { return hearing; },
    hush(next) {
      decide = typeof next === 'function' ? next : null;
      if (!decide) hushed = false;
      sync();
    },
    destroy() { decide = null; kicking = false; if (on) { on = false; proto = null; leave(); } },
  };
}

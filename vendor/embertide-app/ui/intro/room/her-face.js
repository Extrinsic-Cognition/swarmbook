/* HER-FACE-BEGIN · HER FACE, HER PAINT, HER LIGHT: ONE SOURCE (Oct 13 2026 03:4x WEST). His word, over the Board's thirteen balls beside lysa's well:
   "you must use a nest level singleton for the board assets... why the fuck lysa has the right colors? the board ones dont have the eyes".
   Until this the Board (NestBoard.html TWELVE-CORE) carried its own copy of her born paint and drew unit0 with one lens and no face, while lysa
   (well.mjs -> lyssajudron.mjs) drew her floating eyes and read the form his hand chose for them on the paint ref.
   THE ONE OBJECT is on the Nest: her paint ref (PAINT_REF: his parts, and the eyes' form his hand chose, `gaze`, once they `opened`) and her light ref
   (LIGHT_REF); the onboarding writes them, every glass reads them. THE ONE CODE is this text: what that object means on a glass (paintOf, lightOf,
   formOf), her born colours where the ref names none, her floating eyes' line (EYE_LINE) and their forms (EYE_FORMS), Brock's acting on the house clock
   (brockAt, tideAt) and the uniforms both renderers set from it (faceAt, gazeOf). It lives once, in embertide-app/ui/intro/room/her-face.js, inlined
   byte for byte into NestBoard.html between its HER-FACE marks (node her-face-inline.mjs; her-face.test.mjs fails on a byte of drift) and imported by
   lyssajudron.mjs, well.mjs and room-board-state.mjs. A script, not a module (the page inlines it; the iPad bundles that page alone), so it hands itself
   over as globalThis.HER_FACE, the singleton. Pure: no DOM, no clock of its own (lyssajudron.test.mjs greps it); ES5, as the Board's own text is. */
var HER_FACE = (function () {
  'use strict';
  var PAINT_REF = 'scene/entities/golem-lyssajudron-paint', LIGHT_REF = 'scene/entities/golem-lyssajudron-light';   // the Nest's refs: {schema, golem, parts, painted, gaze?, opened?, by, at, from} and {schema, golem, color, hue, name, by, at, from}
  var PAINT_SCHEMA = 'embertide.golem-paint/1', LIGHT_SCHEMA = 'embertide.golem-light/1';
  var PAINT_PARTS = ['base', 'coat', 'gold', 'eyes', 'thruster'];   // Spore's layers on her body (his Oct 12 07:1x): the twenty hexagons, the twelve pentagons, her gold, her eyes, her flame
  var BORN_PAINT = { base: '#F6EFE1', coat: '#E0CFAE', gold: '#C9A14A', eyes: '#E8572A', thruster: '#E8572A' };   // as she was born: ivory porcelain, a deeper ivory, gold wire, ember
  var LIGHT_BORN = '#FFDCAE';   // her light as born on the Board: the well's blaze
  var EYE_INK = '#1A120C';   // her floating eyes' ink (lyssajudron.mjs floatingEyeMaterial's colour)
  /* Brock's eyes, FLOATING (his Oct 12 2026 07:5x WEST: "the eyes must be floating... the hex seam passes through... like as if it was magic source"): one dark
     line each side of her face, on the circle of latitude y at radius r (both in her radius K), from azimuth `from` to `to` (radians either side of +z, her
     front), `thick` its radius. h: the almond's half height when her eyes open, in K; len: a line's length, in K. */
  var EYE_LINE = { y: 0.33, r: 1.07, from: 0.3, to: 1.0, thick: 0.022 };
  var EYE_H = 0.115, EYE_LEN = (EYE_LINE.to - EYE_LINE.from) * Math.sqrt(EYE_LINE.r * EYE_LINE.r - EYE_LINE.y * EYE_LINE.y);
  /* THE LIGHT GAME INSIDE HER (his same turn): water caustics in her inner light, `bars` of every `every` bars of the house clock, eased over `ease` of a bar. */
  var TIDE = { every: 8, bars: 2, ease: 0.5 };
  /* THE EYES ACT LIKE BROCK, AND A GHOST IS SEALED IN HER (his Oct 12 07:5x: "animate the eyes like brock from pokemn... the ghost encapsulated of brock"): shut
     lines that still act: a blink squeezes them, they arc up while her light game plays (^ ^), slant in on an errand (\ /), and from bar `at` of every `every`
     bars, for `bars` bars, the ghost opens them (a fire in them, her porcelain `dark`er). All a pure function of the house clock. */
  var BROCK = { every: 16, at: 10, bars: 1.5, ease: 0.5, blink_ms: 220, rest: 0.18, dark: 0.78 };
  /* THE GAZE ON HER (his Oct 13 00:5x): once her eyes opened (the onboarding's milestone) they stay open in the form his hand gave them. open (0..1), arc and
     tilt (Brock's units: tilt > 0 slants in), h (the almond's height, times EYE_H), exp (its profile: lower is rounder), iris (its radius, in K), pupil (0 none,
     1 slit, 2 round, 3 dot, 4 star, 5 spiral), glints (0..2). The names are the onboarding's GAZES, and 'bare': opened, none chosen yet. */
  var EYE_FORMS = {
    bare:   { open: 1,   arc: 0, tilt: 0,    h: 1,    exp: 0.75, iris: 0.085, pupil: 0, glints: 0 },
    cat:    { open: 1,   arc: 0, tilt: 0.25, h: 1,    exp: 0.75, iris: 0.085, pupil: 1, glints: 1 },
    round:  { open: 1,   arc: 0, tilt: 0,    h: 1.35, exp: 0.45, iris: 0.11,  pupil: 2, glints: 2 },
    gentle: { open: 1,   arc: 0, tilt: -0.7, h: 0.95, exp: 0.7,  iris: 0.088, pupil: 2, glints: 1 },
    fierce: { open: 0.8, arc: 0, tilt: 1,    h: 0.85, exp: 0.95, iris: 0.075, pupil: 1, glints: 1 },
    sleepy: { open: 0.5, arc: 0, tilt: 0,    h: 1,    exp: 0.6,  iris: 0.09,  pupil: 2, glints: 1 },
    joy:    { open: 0,   arc: 1, tilt: 0,    h: 1,    exp: 0.75, iris: 0.085, pupil: 0, glints: 0 },
    star:   { open: 1,   arc: 0, tilt: 0,    h: 1.35, exp: 0.45, iris: 0.11,  pupil: 4, glints: 2 },
    cold:   { open: 1,   arc: 0, tilt: 0.15, h: 0.8,  exp: 0.95, iris: 0.05,  pupil: 3, glints: 0 },
    dizzy:  { open: 1,   arc: 0, tilt: 0,    h: 1.3,  exp: 0.45, iris: 0.1,   pupil: 5, glints: 0 }
  };
  var GAZE_NONE = [0, 0, 0.085, 1], SHAPE_NONE = [1, 0.75, 0.43];   // the eyes' standing uniforms with no form, Brock's lines: uGaze (on, pupil, iris, glints), uShape (height, profile, the iris along the line)
  function has(o, k) { return Object.prototype.hasOwnProperty.call(o, k); }
  function smooth01(v) { return v <= 0 ? 0 : v >= 1 ? 1 : v * v * (3 - 2 * v); }
  function blinkOf(ms, at, dur) { var u = (ms - at) / dur; return u > 0 && u < 1 ? smooth01(u < 0.35 ? u / 0.35 : (1 - u) / 0.65) : 0; }   // shut fast, open slower
  function hash32(n) { var h = Math.imul((n | 0) ^ 0x9e3779b9, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); return (h ^ (h >>> 16)) >>> 0; }
  /** hex(v): a '#RRGGBB' in upper case, else null. */
  function hex(v) { return typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v.toUpperCase() : null; }
  /** paintOf(value): the paint ref's parts, a '#RRGGBB' or null each (null: that part as she was born); null for another schema or none. */
  function paintOf(value) {
    if (!value || typeof value !== 'object' || value.schema !== PAINT_SCHEMA || !value.parts || typeof value.parts !== 'object') return null;
    var out = {}; for (var i = 0; i < PAINT_PARTS.length; i++) out[PAINT_PARTS[i]] = hex(value.parts[PAINT_PARTS[i]]); return out;
  }
  /** lightOf(value): the light ref's colour ('#RRGGBB'), or null (her light as she was born). */
  function lightOf(value) { return value && typeof value === 'object' && value.schema === LIGHT_SCHEMA ? hex(value.color) : null; }
  /** formOf(value): the form her eyes wear by the paint ref: once they `opened`, the `gaze` his hand chose, 'bare' until one is; eyes not yet opened, or a name
   *  that is no form, is null: Brock's lines. (well.mjs's reading since house 3ac92d76, now the one place every glass reads it from.) */
  function formOf(value) {
    if (!value || typeof value !== 'object' || !value.opened) return null;
    var name = typeof value.gaze === 'string' ? value.gaze : 'bare';
    return has(EYE_FORMS, name) ? name : null;
  }
  /** tideAt(bars): the light game, 0..1 at that bar of the house clock. */
  function tideAt(bars) {
    var x = (((bars % TIDE.every) + TIDE.every) % TIDE.every) - (TIDE.every - TIDE.bars); if (!(x > 0)) return 0;
    return smooth01(x / TIDE.ease) * smooth01((TIDE.bars - x) / TIDE.ease);
  }
  /** brockAt(clock, {busy}): her face acting at that instant, {ghost, open, arc, tilt, squeeze}, each 0..1 (busy 0..1: how much she is on an errand). The clock
   *  is beat-clock.mjs's (lyssajudron-score.mjs clockOf): bar, bar_phase, epoch_ms, bar_ms, beat_ms, beats_per_bar, now_ms. */
  function brockAt(c, opts) {
    var bars = c.bar + c.bar_phase, x = (((bars - BROCK.at) % BROCK.every) + BROCK.every) % BROCK.every;
    var ghost = x < BROCK.bars ? smooth01(x / BROCK.ease) * smooth01((BROCK.bars - x) / BROCK.ease) : 0;
    var squeeze = blinkOf(x, BROCK.bars - 0.12, 0.42);   // the eyes shut with a squeeze (in bars)
    if (ghost === 0) for (var bar = c.bar - 1; bar <= c.bar; bar++) {   // this bar's blink, and the last bar's if it runs over the line
      var h = hash32(bar); if (h % 4 === 0) continue;
      var at = c.epoch_ms + bar * c.bar_ms + (((h >>> 3) % Math.max(1, (c.beats_per_bar - 1) * 4)) / 4) * c.beat_ms;
      squeeze = Math.max(squeeze, blinkOf(c.now_ms, at, BROCK.blink_ms), h % 7 === 0 ? blinkOf(c.now_ms, at + BROCK.blink_ms * 1.3, BROCK.blink_ms) : 0);
    }
    var b = Math.min(1, Math.max(0, Number(opts && opts.busy) || 0));
    return { ghost: ghost, open: ghost, arc: (BROCK.rest + (1 - BROCK.rest) * tideAt(bars)) * (1 - ghost), tilt: Math.max(b, 0.6 * ghost), squeeze: squeeze };
  }
  /** gazeOf(name): the eyes' standing uniforms for a form, or for none (Brock's lines): {form, gaze: [on, pupil, iris, glints], shape: [height, profile, iris along]}. */
  function gazeOf(name) {
    var f = typeof name === 'string' && has(EYE_FORMS, name) ? name : null, e = f ? EYE_FORMS[f] : null;
    return { form: f, gaze: e ? [1, e.pupil, e.iris, e.glints] : GAZE_NONE.slice(), shape: e ? [e.h, e.exp, 0.43] : SHAPE_NONE.slice() };
  }
  /** faceAt(clock, form, busy): everything a renderer sets on her eyes at an instant: {form, ghost, acting (brockAt's), brock: [arc, tilt, open, squeeze], gaze,
   *  shape}. With a form her eyes stand open in it (its arc, tilt and open), Brock's squeeze still blinking them; without one, Brock's acting whole. */
  function faceAt(c, form, busy) {
    var a = brockAt(c, { busy: busy }), g = gazeOf(form), e = g.form ? EYE_FORMS[g.form] : null;
    return { form: g.form, ghost: a.ghost, acting: a, brock: e ? [e.arc, e.tilt, e.open, a.squeeze] : [a.arc, a.tilt, a.open, a.squeeze], gaze: g.gaze, shape: g.shape };
  }
  function freeze(o) { Object.keys(o).forEach(function (k) { if (o[k] && typeof o[k] === 'object') freeze(o[k]); }); return Object.freeze(o); }
  return freeze({ PAINT_REF: PAINT_REF, LIGHT_REF: LIGHT_REF, PAINT_SCHEMA: PAINT_SCHEMA, LIGHT_SCHEMA: LIGHT_SCHEMA, PAINT_PARTS: PAINT_PARTS, BORN_PAINT: BORN_PAINT, LIGHT_BORN: LIGHT_BORN,
    EYE_INK: EYE_INK, EYE_LINE: EYE_LINE, EYE_H: EYE_H, EYE_LEN: EYE_LEN, TIDE: TIDE, BROCK: BROCK, EYE_FORMS: EYE_FORMS,
    hex: hex, paintOf: paintOf, lightOf: lightOf, formOf: formOf, tideAt: tideAt, brockAt: brockAt, gazeOf: gazeOf, faceAt: faceAt });
})();
if (typeof globalThis === 'object' && globalThis) globalThis.HER_FACE = HER_FACE;   // the singleton: one object on every glass (a module imports this file for its side effect and reads it here)
/* HER-FACE-END */
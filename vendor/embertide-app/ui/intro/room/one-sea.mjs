// one-sea.mjs · THE SEA: one surface in the twin, and every glass a porthole on it (Oct 16 2026 16:4x WEST).
// His words to the warden, over the flock's scripted shadows: "you dont have the slightest clue what it means to have anamorphic projections wtf are
// those shadows? they are scripted and dumb. the shadow that matters here is the one directly between my eye and the screen... but since we dont have
// that, JUST FUCKING ANCHOR IT TO SOMEWHERE IN THE FUCKIN DIGITAL TWIN... i want a single homogenous sea surface waving that spans in depth all screens
// like imagine i am in a submarine with my room dude". The warden's ruling under ORFAM: the eye is one fixed point of the Station frame (the program's
// own `eye`, `follow` false: one.mjs eyeNow), the sea is ONE THING, a program on the Nest, and each glass shows its own view of it.
//
// THE SURFACE is a height field over the Station's floor plane, at the height the program says (`surface_y`, metres in the Station frame), the sum of
// a few plane waves: h(x, z, t) = sum a_i sin(k_i (x cos d_i + z sin d_i) - w_i t), k = 2 pi / l, w = k speed, t the seconds since the program's grid
// epoch on the HOUSE CLOCK (one.mjs at()): every glass samples the same surface at the same instant (foundation 2: only the program crosses, never a
// picture). THE PORTHOLE: for each pixel of a glass the ray from the eye through that point of the glass's rectangle (one-law.mjs: the plane's c, r,
// u, w, h; the same geometry as frustum/project, written as a ray so a shader can run it) meets the surface where it crosses y = surface_y, behind the
// plane as a window: the surface in depth, the water under it, the air above it (nothing drawn: the glass's own face shows). One continuous sea
// across tv1, tv2, lysa, pelino, the Macs: the horizon (the rays level with the eye) is the one world line at the eye's height on every glass.
// A GEOMETRIC FACT the program must respect: through a glass whose top edge stands below the eye, every ray goes down; a surface ABOVE the eye is
// seen through no such glass (his sofa eye is 1.13 m over the floor; tv1's top edge 1.05 m, tv2's 0.97 m). So the default surface lies BELOW the eye
// and the glasses show it receding in depth to the horizon; a surface above the eye (the submarine looking up) is one number away (room-sea.mjs).
// THE ROAD: a WebGL fragment shader on a whole-screen transparent canvas under the flock's (the overlay's layer one.mjs mounts), painted at most
// SEA_HZ times a second while the word is on and the page is shown; nothing at rest when the word is off. No 2D canvas can draw this at this cost.
// COST (the numbers in SEA-LANDING.md): one full-screen triangle, a fragment of ~40 flops per wave per pixel; the canvas is painted at the page's
// css pixels (SEA_DPR 1) times the program's `res` (1 by default; 0.5 halves the work on a weak glass). At rest: nothing.
// Pure parts: no I/O, no clock, no DOM. Total: bad input gives null, never a throw.
//
// THE SEAS AND THE OCEAN (Oct 17 2026 21:56 and 22:0x WEST). His words: "do you understand that minimizing cosync latency is critical to have our
// music field done right?"; "can you please start visualizing the music field synced across all screens? consider that, according to the complex
// adaptive algorithm, we will have instead an initial moment where the field is fragments and segmented (separate seas) and then we will unify into
// AR OCEAN". The unification is the measurement, never a cutscene. A glass knows the house clock within a FOG: half the quickest round trip it
// kept (one.mjs S.rtt; house-clock.mjs fog()). While the fog is wide, or its clock is stale, the glass is a SEA of its own: it draws the surface it
// can tell apart, the mean of the surface over the instants its fog allows (each wave's height times sin(d)/d, d = k speed fog: the fast waves
// flatten first, exactly, blurOf), inside a rim of its own colour (tintOf(seat)). When the fog has stood under OCEAN.in_ms for OCEAN.settle pictures
// the rim dissolves and the glass is a porthole on the OCEAN, the one surface at the one instant; a fog over OCEAN.out_ms, or no probe for
// OCEAN.stale_ms, makes it a sea again (Croquet's lesson, read that night: "synced" is a number with thresholds and hysteresis, never a word).
// THE MUSIC FIELD: with `clock: 'song'` in the word the waves' t is the song's own position (the song's cause as the rite pushes it on its stream,
// music_cause: the position at its stamp, the state, the length, taken at its apply_at, causeOf and songInForce; the rule of lib/shared-scene-clock.mjs
// songAt), so every glass samples the surface at the song's instant, a paused song stands the ocean still on every screen at once, and the sync is
// seen, not said. No song loaded: no field (nothing drawn, the lens says why).
//
// THE SHIP'S SKY (Oct 18 2026; his link of 15:31 WEST and the law in one-ship.mjs): with a `voyage` in the word the porthole's plane hit is swapped for
// a sky at infinity in the vessel's frame. The same ray from the eye through each pixel, its angle off the bow, the rest frame's star it sees by the
// aberration and the Doppler factor of its light (the half angle, so float32 keeps it at any gamma; the rapidity taken in doubles on the CPU, as the
// waves' phase is), procedural stars from a seed, the 2.7255 K background and the band of the galaxy as glows, the destination dead ahead. The voyage
// rides the word's clock (the song's own position with `clock: 'song'`: one song, one voyage); it shows only on the glasses it names (the first cut,
// tv1 alone), its HUD as text on one of them; a parked ship (before its departure, after its arrival) paints nothing, and a sky whose causes did not
// move (the eye's rapidity by under 1e-4, the eye, the glass, the size) is not painted again.
// THE PORTAL OPENS ON THE BEAT (Oct 29 2026, lane/the-portal-opens-on-the-beat; his words and the law: sea-flag.mjs): the portal his hold on the black ball
// opens is a circle of the shader's own (u_portal, portalPx): a pixel outside it is nothing, so whatever composes the canvas (the page, the membrane's water
// refracting it) shows only the circle. Its radius is handed at each picture (sea-flag.mjs portalAt at the picture's house instant); no portal, the whole glass.
import { sub, add, dot, unit, GENESIS_MS, GENESIS_BEAT_MS } from './one-law.mjs';
import { onFront } from './house-door.mjs'; import { seaWater, glassList } from './cast-wasm.mjs';   // THE FIRE (Nov 16 2026): the water, the sun and the cadence are the module's (sea_water.rs) once it is loaded
import { voyageOf, voyageAt, eyePhiOf, hudOf, countdownText, rotationOf, destinationOf, meanGlowOf, bandGlowOf, bandOf, STARS, KS, WHITE, WARP, T_CMB, SKY_EPS_PHI } from './one-ship.mjs';
import { rowsOf, gridOfRows } from './traces-land.mjs';
// THE OCEAN IS THE TRACES and ONE LAND UNDER THE SEA: the land under the waves (the word's land, its grid, its height, the line of his traces) is sea-land.mjs's, said again here
import { LAND_KINDS, LAND_FIELD, LAND_DEFAULTS, landOf, gridOf, landAt, frontOf } from './sea-land.mjs';
export { LAND_KINDS, LAND_FIELD, LAND_DEFAULTS, landOf, gridOf, landAt, frontOf };

export const SEA_REF = 'room/sea';   // list: the word each reader of this layer reads and hands to program(), which asks the one list's sea for it and is gated by its answer
export const SCHEMA = 'embertide.room-sea/v1';
export const MAX_WAVES = 4;      // the shader's loop bound: a program with more is cut to the first four
export const SEA_HZ = 30;        // the most pictures a second (her picture's own cap, one.mjs PICTURES_PER_S)
export const SEA_DPR = 1;        // the sea is painted at css pixels: a low-frequency field wants no retina
export const UNDER_RES = 0.5;    // THE WAVES FROM BELOW: under the water the picture is soft light, painted at half the css pixels each way (a quarter of them)
export const H_RANGE_M = 0.25;   // the height the diagnostic picture encodes: h in [-H_RANGE/2, +H_RANGE/2] -> red 0..1 (one-sea.proof.mjs reads it)
export const LAMBDA_RANGE_M = 64; // the depth the diagnostic picture encodes in green
export const DEFAULTS = Object.freeze({
  surface_y: -0.25,              // the Station's metres: 0.43 m over the floor (-0.68), 0.70 m under his seated eye (0.45): seen through every glass he has
  waves: [{ a: 0.06, l: 2.4, dir: 0.3, speed: 0.55 }, { a: 0.035, l: 1.3, dir: 2.1, speed: 0.8 }, { a: 0.02, l: 0.7, dir: 4.0, speed: 1.1 }],
  water: { near: [0.16, 0.45, 0.55], deep: [0.02, 0.10, 0.20], sky: [0.75, 0.86, 0.92], alpha: 0.6, fog_m: 12 },
  sun: [0.3, 1, -0.2],
  hz: SEA_HZ, res: 1,
});
/** THE SEAS AND THE OCEAN's numbers: in_ms is house-clock.mjs STEP_MS (the measured one-way error of the quickest of four probes on the Nest's own Mac);
 *  out_ms three of them (hysteresis: the ocean is not lost on one slow probe); settle pictures in a row under in_ms before the rim goes; stale_ms with
 *  no probe makes a sea of any glass; ease_ms the rim's fade either way. */
export const OCEAN = Object.freeze({ in_ms: 4, out_ms: 12, settle: 3, stale_ms: 2500, ease_ms: 800, sigma_in_m: 0.05, sigma_out_m: 0.10 });   // sigma: THE WINDOWS OF THE SUBMARINE (Oct 23 2026): the glass's place in the gauge's frame, the second measurement the ocean is earned by (PLACE_SIGMA_M 0.05 is the admission of a placement)
export const SONG_STATES = Object.freeze(['playing', 'paused', 'stalled']);   // the music word's states that carry a position (lib/shared-scene-clock.mjs songLoaded)

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const fin3 = (p) => Array.isArray(p) && p.length === 3 && p.every(num);
const col3 = (c, d) => (Array.isArray(c) && c.length === 3 && c.every((v) => num(v) && v >= 0 && v <= 1) ? [c[0], c[1], c[2]] : [...d]);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/** seaOf(value): the Nest's word as the law reads it: the program whole, every knob within its range, or null (no word, off, not a sea). */
export function seaOf(value) {
  if (!value || typeof value !== 'object' || value.schema !== SCHEMA || value.on !== true) return null;
  if (!num(value.surface_y)) return null;
  const waves = (Array.isArray(value.waves) ? value.waves : []).filter((w) => w && num(w.a) && w.a > 0 && num(w.l) && w.l > 0 && num(w.dir) && num(w.speed)).slice(0, MAX_WAVES)
    .map((w) => ({ a: w.a, l: w.l, dir: w.dir, speed: w.speed }));
  if (!waves.length) return null;
  const voyage = value.voyage == null ? null : voyageOf(value.voyage); if (value.voyage != null && !voyage) return null;   // THE SHIP: a voyage that is not one refuses the word (no sea shows in its place)
  const g = value.grid && typeof value.grid === 'object' ? value.grid : {};
  const M = seaWater(value), water = value.water && typeof value.water === 'object' ? value.water : {};   // M: the module's answer; without it the page's text below answers, outgrown: the door's witness and fallback (sea-water.test.mjs holds the two equal)
  const sun = M ? M.sun : unit(fin3(value.sun) ? value.sun : DEFAULTS.sun) || unit(DEFAULTS.sun);
  return {
    surface_y: value.surface_y, waves,
    grid: { epoch_ms: num(g.epoch_ms) ? g.epoch_ms : GENESIS_MS, beat_ms: num(g.beat_ms) && g.beat_ms > 0 ? g.beat_ms : GENESIS_BEAT_MS },
    water: M ? M.water : { near: col3(water.near, DEFAULTS.water.near), deep: col3(water.deep, DEFAULTS.water.deep), sky: col3(water.sky, DEFAULTS.water.sky),
      alpha: num(water.alpha) ? clamp(water.alpha, 0, 1) : DEFAULTS.water.alpha, fog_m: num(water.fog_m) && water.fog_m > 0 ? water.fog_m : DEFAULTS.water.fog_m },
    sun, hz: M ? M.hz : num(value.hz) ? clamp(Math.round(value.hz), 1, 60) : SEA_HZ, res: num(value.res) ? clamp(value.res, 0.25, 1) : 1,
    clock: value.clock === 'song' ? 'song' : 'house',   // THE MUSIC FIELD: the waves on the song's own position, else on the house clock since the epoch
    voyage,                                             // THE SHIP: the voyage's cause (one-ship.mjs voyageOf), or null: the sea
    frame: typeof value.frame === 'string' ? value.frame : 'station', by: value.by ?? null, at: value.at ?? null,
    land: landOf(value.land),                           // THE OCEAN IS THE TRACES: the land under the waves, or null: the sea alone
  };
}

/** songPhase(song, house_ms): the song's position in seconds at the house instant, from the rite's music word (the rule of lib/shared-scene-clock.mjs
 *  songAt: position_ms, plus the time since its stamp while playing, never past its duration), or null (no song with a position: no field). */
export function songPhase(song, house_ms) {
  if (!song || typeof song !== 'object' || !num(house_ms) || !SONG_STATES.includes(song.state) || !num(song.position_ms) || !num(song.stamp_ms)) return null;
  let p = song.position_ms + (song.state === 'playing' ? Math.max(0, house_ms - song.stamp_ms) : 0);
  if (num(song.duration_ms) && song.duration_ms > 0) p = Math.min(p, song.duration_ms);
  return Math.max(0, p) / 1000;
}
/** causeOf(x): the song's cause as the rite pushes it (a /rite/stream tick frame, its music_cause, or the cause itself; rite.mjs songPub: its TIMING only)
 *  -> { music_seq, stamp_ms, apply_at, state, position_ms, duration_ms } or null. No apply_at: the stamp. */
export function causeOf(x) {
  const m = x && typeof x === 'object' && x.music_cause && typeof x.music_cause === 'object' ? x.music_cause : x;
  if (!m || typeof m !== 'object' || !Number.isSafeInteger(m.music_seq) || !num(m.stamp_ms)) return null;
  return { music_seq: m.music_seq, stamp_ms: m.stamp_ms, apply_at: num(m.apply_at) ? m.apply_at : m.stamp_ms, state: typeof m.state === 'string' ? m.state : 'none',
    position_ms: num(m.position_ms) ? m.position_ms : null, duration_ms: num(m.duration_ms) ? m.duration_ms : null };
}
/** songInForce(held, heard, house_ms): the cause the waves ride at a house instant. A cause heard is in force from its apply_at (stamp + the aligned delay:
 *  the one instant the rite gives every glass to change on, so a seek or a pause moves every porthole together), the cause held until then; nothing heard,
 *  the held one stands (a cause stands until the next). The rite numbers its causes from 1 at each start, so only a seq that differs is a new cause. */
export function songInForce(held, heard, house_ms) {
  if (!heard) return held || null;
  if (held && held.music_seq === heard.music_seq) return heard;
  return !num(heard.apply_at) || (num(house_ms) && house_ms >= heard.apply_at) ? heard : held || null;
}
/** phaseOf(sea, house_ms, song): the seconds the waves are at: since the program's epoch on the house clock (the one t every glass puts into the waves),
 *  or, with the word's clock 'song', the song's own position at that house instant (null with no song: no field without the music). */
export const phaseOf = (sea, house_ms, song = null) => (!sea || !num(house_ms) ? null : sea.clock === 'song' ? songPhase(song, house_ms) : (house_ms - sea.grid.epoch_ms) / 1000);
/** axisOf(sea, house_ms, song): THE SHIP's position on the word's clock, ms: the house instant itself, or with clock 'song' the song's own position (its
 *  voyage's `at` is then a position of the song: 0, the song's first second; one song, one voyage). null with no song: no voyage without the music. */
export const axisOf = (sea, house_ms, song = null) => { if (!sea || !num(house_ms)) return null; if (sea.clock !== 'song') return house_ms; const s = songPhase(song, house_ms); return s == null ? null : s * 1000; };
/** baseOf(sea, voyage, song): the departure's instant on Earth's calendar (UTC ms), the HUD's date being it plus Earth's time since: the house instant
 *  `at`, or on the song's clock the house instant the song stood at `at` by its cause in force (stamp - position + at). */
export const baseOf = (sea, v, song = null) => (!sea || !v ? null : sea.clock !== 'song' ? v.at : song && num(song.stamp_ms) && num(song.position_ms) ? song.stamp_ms - song.position_ms + v.at : null);
const kOf = (w) => (2 * Math.PI) / w.l;

/** blurOf(wave, fog_s): what a glass whose clock is foggy by fog_s seconds can tell of a wave: the mean of its sine over the phases the fog allows,
 *  sin(d)/d with d = k speed fog_s (1 with no fog; the fast waves flatten first; past d = pi a wave is gone, its sign even turned). */
export function blurOf(w, fog_s = 0) { const d = kOf(w) * Math.abs(w.speed) * (num(fog_s) ? Math.abs(fog_s) : 0); return d < 1e-9 ? 1 : Math.sin(d) / d; }

/** heightAt(sea, x, z, t, fog_s): the surface's height over its plane at (x, z) at the instant t (s), metres; with a fog, the height a foggy glass draws. */
export function heightAt(sea, x, z, t, fog_s = 0, grid = null, front = 1) {
  if (!sea || !num(x) || !num(z) || !num(t)) return null;
  let h = landAt(sea.land, grid, x, z, front);   // THE OCEAN IS THE TRACES: the land first (as far as his line reached), the waves on it
  for (const w of sea.waves) { const k = kOf(w); h += w.a * blurOf(w, fog_s) * Math.sin(k * (x * Math.cos(w.dir) + z * Math.sin(w.dir)) - k * w.speed * t); }
  return h;
}
/** normalAt(sea, x, z, t, fog_s): the surface's unit normal there (up is +y), of the surface a glass with that fog draws. */
export function normalAt(sea, x, z, t, fog_s = 0, grid = null, front = 1) {
  if (!sea || !num(x) || !num(z) || !num(t)) return null;
  let hx = 0, hz = 0;
  if (sea.land && grid) { const e = sea.land.span_m / (grid.n - 1) / 2, L = (px, pz) => landAt(sea.land, grid, px, pz, front); hx += (L(x + e, z) - L(x - e, z)) / (2 * e); hz += (L(x, z + e) - L(x, z - e)) / (2 * e); }   // the land's slope, as the shader takes it
  for (const w of sea.waves) { const k = kOf(w), c = w.a * blurOf(w, fog_s) * k * Math.cos(k * (x * Math.cos(w.dir) + z * Math.sin(w.dir)) - k * w.speed * t); hx += c * Math.cos(w.dir); hz += c * Math.sin(w.dir); }
  return unit([-hx, 1, -hz]);
}

/** oceanStep(prev, { fog_ms, probe_age_ms, now_ms, sigma_m, framed }, law): THE SEAS AND THE OCEAN, one step at a picture. prev: the last state or null (a
 *  glass starts as a sea). Two measurements (THE WINDOWS OF THE SUBMARINE, Oct 23 2026): the clock's fog, and the glass's place in the gauge's frame:
 *  `framed` false (the glass stands in another frame, or none stands) is not known, like a stale clock; `sigma_m` (metres, the glass's own sigma) must
 *  stand under sigma_in_m for a run to count and over sigma_out_m to lose the ocean; null leaves the clock to judge alone (every glass before tonight).
 *  -> { state: 'sea' | 'ocean', runs (pictures in a row under the thresholds), since_ms (when the state was entered), fog_ms (null when unknown or stale),
 *  sigma_m, framed, rim (0..1: how much of the sea's rim is drawn, eased over ease_ms either way) }. Pure: the caller keeps the state. */
export function oceanStep(prev, { fog_ms = null, probe_age_ms = null, now_ms = 0, sigma_m = null, framed = null } = {}, law = OCEAN) {
  const p = prev && typeof prev === 'object' ? prev : { state: 'sea', runs: 0, since_ms: now_ms, fog_ms: null, rim: 1 };
  const sig = num(sigma_m) && sigma_m >= 0 ? sigma_m : null, sIn = num(law.sigma_in_m) ? law.sigma_in_m : Infinity, sOut = num(law.sigma_out_m) ? law.sigma_out_m : Infinity;
  const known = num(fog_ms) && fog_ms >= 0 && (!num(probe_age_ms) || probe_age_ms <= law.stale_ms) && framed !== false;
  let state = p.state, runs = p.runs, since = p.since_ms;
  if (!known) { runs = 0; if (state !== 'sea') { state = 'sea'; since = now_ms; } }
  else if (state === 'ocean') { if (fog_ms > law.out_ms || (sig != null && sig > sOut)) { state = 'sea'; since = now_ms; runs = 0; } else runs = Math.min(runs + 1, law.settle); }
  else { runs = fog_ms <= law.in_ms && (sig == null || sig <= sIn) ? runs + 1 : 0; if (runs >= law.settle) { state = 'ocean'; since = now_ms; } }
  const k = law.ease_ms > 0 && num(now_ms) ? clamp((now_ms - since) / law.ease_ms, 0, 1) : 1;
  const rim = state === 'ocean' ? 1 - k : k >= 1 ? 1 : Math.max(num(p.rim) ? p.rim : 0, k);
  return { state, runs, since_ms: since, fog_ms: known ? fog_ms : null, sigma_m: sig, framed: framed === false ? false : framed === true ? true : null, rim };
}

/** tintOf(seat): the colour a glass's own sea wears while it is a sea (sRGB 0..1): one hue per seat name, the same on every machine with no table and no
 *  word (HSL hue from the name's FNV-1a hash, saturation 0.55, lightness 0.5); a glass with no name wears the water's near. */
export function tintOf(seat) {
  const s = typeof seat === 'string' ? seat : ''; if (!s) return [...DEFAULTS.water.near];
  let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  const hue = (h % 360) / 360, a = 0.55 * 0.5, f = (n) => { const k = (n + hue * 12) % 12; return 0.5 - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)); };
  return [f(0), f(8), f(4)];
}

/** rayOf(plane, eye, s, t): the ray from the eye through the point of the glass's rectangle at (s, t): s 0..1 from its left edge, t 0..1 from its top
 *  (page coordinates). -> { p (the point on the plane), d (unit) } or null (no plane, no eye, the eye on the plane). */
export function rayOf(pl, eye, s, t) {
  if (!pl || !fin3(pl.c) || !fin3(pl.r) || !fin3(pl.u) || !num(pl.w) || !num(pl.h) || !fin3(eye) || !num(s) || !num(t)) return null;
  const p = add(add(pl.c, pl.r, (s - 0.5) * pl.w), pl.u, (0.5 - t) * pl.h), d = unit(sub(p, eye));
  return d ? { p, d } : null;
}

/** hitOf(sea, plane, eye, s, t, house_ms): what the ray through that point of the glass meets: { kind: 'surface', lambda (m along the ray), p (the point
 *  on the surface's plane), h (the height there), t_s } | { kind: 'water' } (the surface above the eye, the ray going down: water) | { kind: 'air' }
 *  (the surface below the eye, the ray going up: nothing drawn) | null. The same rule as the shader's, in the same words. */
export function hitOf(sea, pl, eye, s, t, house_ms, { song = null, fog_s = 0 } = {}) {
  const ray = rayOf(pl, eye, s, t), ts = phaseOf(sea, house_ms, song); if (!ray || ts == null) return null;
  const dy = sea.surface_y - eye[1];
  if (Math.abs(ray.d[1]) > 1e-4 && dy * ray.d[1] > 0) { const lambda = dy / ray.d[1], p = add(eye, ray.d, lambda); return { kind: 'surface', lambda, p, h: heightAt(sea, p[0], p[2], ts, fog_s), t_s: ts }; }
  return { kind: dy > 0 ? 'water' : 'air', t_s: ts };
}

/** horizonRow(plane, eye, H, s): the page row (px from the top) where the glass's point, in its column s (its middle when unsaid), has the eye's height: the
 *  rays level with the eye, the one world line at the eye's height across every glass. -> { t (0..1), row, where: 'inside' | 'above' | 'below' the picture }
 *  or null for a glass whose up vector is level (no row has the eye's height). */
export function horizonRow(pl, eye, H, s = 0.5) {
  if (!pl || !fin3(pl.c) || !fin3(pl.r) || !fin3(pl.u) || !num(pl.w) || !num(pl.h) || !fin3(eye) || !(H > 0)) return null;
  const uy = pl.u[1] * pl.h; if (Math.abs(uy) < 1e-6) return null;
  const t = 0.5 - (eye[1] - pl.c[1] - pl.r[1] * (s - 0.5) * pl.w) / uy;
  return { t, row: t * H, where: t < 0 ? 'above' : t > 1 ? 'below' : 'inside' };
}

/** seesSurface(sea, plane, eye): whether any corner ray of the glass meets the surface's plane (the glass shows the sea, not only water or air). Pure
 *  GEOMETRY, hitOf's own rule for the plane y = surface_y asked without a clock: a word on the song's clock has no phase until the rite's stream hands
 *  one, and this question once went through hitOf, whose null phase made every glass "only air" (his press of the sea on the song's clock REFUSED,
 *  Oct 19 2026 13:5x WEST, while the same geometry passed on the house clock). */
export function seesSurface(sea, pl, eye) {
  if (!sea || !num(sea.surface_y) || !fin3(eye)) return false;
  const dy = sea.surface_y - eye[1];
  for (const [s, t] of [[0, 0], [1, 0], [0, 1], [1, 1], [0.5, 0.5]]) { const ray = rayOf(pl, eye, s, t); if (ray && Math.abs(ray.d[1]) > 1e-4 && dy * ray.d[1] > 0) return true; }
  return false;
}

/** uniformsOf(sea, plane, eye, house_ms, W, H, mode, { song, fog_ms, rim, tint, module }): every number the shader takes, as the layer sets them (and as a test
 *  reads them). song: the song's cause in force (songInForce: the waves' t with clock 'song'); fog_ms: this glass's clock fog (each wave's amplitude is handed blurred by
 *  it: the shader draws the surface this glass can tell apart); rim 0..1 and tint: the sea's own rim (THE SEAS AND THE OCEAN). module: the sea's doors of the
 *  one WASM (sea-wasm.mjs), holding the same word: the instant and the waves' numbers are then the module's (sea.rs, the same double as the lines below). */
export function uniformsOf(sea, pl, eye, house_ms, W, H, mode = 0, { song = null, fog_ms = null, rim = 0, tint = null, module = null } = {}) {
  const ts = module ? module.phase(house_ms, song) : phaseOf(sea, house_ms, song); if (ts == null || !pl || !fin3(eye) || !(W > 0) || !(H > 0)) return null;
  const fog_s = num(fog_ms) ? Math.abs(fog_ms) / 1000 : 0;
  // THE CLOCK IN DOUBLES: the phase omega t of each wave is taken here, in float64, modulo 2 pi, and handed to the shader ready: a float32 t at 2e7 s since the
  // epoch (Oct 2026) keeps about 2 s of it, seconds of phase, and the proof read heights 20 cm off the law until this line (Oct 16 2026 16:3x WEST).
  const rows = module ? module.waves(ts, fog_ms) : null; if (module && !rows) return null;
  const waves = rows || sea.waves.map((w) => { const k = kOf(w), ph = (k * w.speed * ts) % (2 * Math.PI); return [w.a * blurOf(w, fog_s), k, w.dir, ph < 0 ? ph + 2 * Math.PI : ph]; }); while (waves.length < MAX_WAVES) waves.push([0, 1, 0, 0]);
  return { res: [W, H], eye: [...eye], c: [...pl.c], r: [...pl.r], u: [...pl.u], wh: [pl.w, pl.h], y: sea.surface_y, t: ts, waves, n: sea.waves.length,
    near: sea.water.near, deep: sea.water.deep, sky: sea.water.sky, alpha: sea.water.alpha, fog: sea.water.fog_m, sun: sea.sun, mode,
    fog_ms: num(fog_ms) ? Math.abs(fog_ms) : 0, rim: num(rim) ? clamp(rim, 0, 1) : 0, tint: col3(tint, DEFAULTS.water.near),
    land: sea.land ? [sea.land.centre[0], sea.land.centre[1], sea.land.span_m, sea.land.rise_m] : [0, 0, 1, 0], land_on: sea.land ? 1 : 0 };   // THE OCEAN IS THE TRACES: the land's frame (drawn only once the glass holds the grid)
}

/** skyUniformsOf(sea, plane, eye, house_ms, W, H, mode, { song, rim, tint }): THE SHIP: every number the sky's half of the shader takes, from the word's
 *  voyage, the glass, the eye and the instant, or null (no voyage, no instant on its clock, a parked ship: nothing to draw). The rapidity and every
 *  exponential of it are taken here in doubles and handed as float32-safe numbers (e^phi and e^-phi, phi under PHI_EYE_MAX); the stars' light is
 *  exposed from the glass's own pixel (its angle at the glass's centre): a magnitude 6.5 star's image at rest is the faintest light drawn, -1 white. */
export function skyUniformsOf(sea, pl, eye, house_ms, W, H, mode = 0, { song = null, rim = 0, tint = null } = {}) {
  const v = sea && sea.voyage; if (!v || !pl || !fin3(pl.c) || !num(pl.w) || !fin3(eye) || !(W > 0) || !(H > 0)) return null;
  const axis = axisOf(sea, house_ms, song), st = axis == null ? null : voyageAt(v, axis); if (!st || st.parked) return null;
  const phi = eyePhiOf(v, st.phi), r = Math.hypot(...sub(pl.c, eye)), pix = r > 0 ? pl.w / W / r : 1e-3, sig = 0.75 * pix, norm = 1 / (2 * Math.PI * sig * sig);
  const L0 = STARS.F0 * 10 ** (-0.4 * 6.5) * norm, Lw = STARS.F0 * 10 ** 0.4 * norm, R = rotationOf(v.seed), b = v.bow;
  return { res: [W, H], eye: [...eye], c: [...pl.c], r: [...pl.r], u: [...pl.u], wh: [pl.w, pl.h], mode, rim: num(rim) ? clamp(rim, 0, 1) : 0, tint: col3(tint, DEFAULTS.water.near),
    ship: 1, bow: [...b], perp: unit(Math.abs(b[0]) < 0.9 ? [0, -b[2], b[1]] : [-b[2], 0, b[0]]) || [1, 0, 0], eph: [Math.exp(phi), Math.exp(-phi)], phi, phi_law: st.phi,
    rot: [R[0][0], R[1][0], R[2][0], R[0][1], R[1][1], R[2][1], R[0][2], R[1][2], R[2][2]],   // column-major, as uniformMatrix3fv takes it: the map's direction is R times the rest frame's
    seed: v.seed, psf: [sig, norm, pix], tone: [L0, 1 / Math.log(1 + Lw / L0)], dest: destinationOf(v, st, phi), glow: [meanGlowOf(), bandGlowOf(), STARS.band_w],
    alpha: v.alpha, state: st };
}

export const VERT = `attribute vec2 a_pos; void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }`;
export const SKY_UNIFORMS = Object.freeze(['u_bow', 'u_perp', 'u_eph', 'u_rot', 'u_seed', 'u_psf', 'u_tone', 'u_dest', 'u_glow', 'u_salpha']);   // THE SHIP: the sky's own (beside the ray's, the rim's and the mode, as the sea names them)
const glf = (x) => { const s = Number(x).toPrecision(9); return /[.eE]/.test(s) ? s : `${s}.0`; };   // a GLSL float literal
// u_wave: a wave as (a (m), k (rad/m), dir (rad), the phase omega t at this instant (rad), the last in doubles on the CPU: see uniformsOf).
export const FRAG = `precision highp float;
uniform vec2 u_res; uniform vec3 u_eye, u_c, u_r, u_u; uniform vec2 u_wh; uniform float u_y;
uniform vec4 u_wave[4]; uniform int u_n; uniform vec3 u_near, u_deep, u_sky, u_sun; uniform float u_alpha, u_fog; uniform int u_mode;
uniform float u_rim; uniform vec3 u_tint;                                   // THE SEAS AND THE OCEAN: the sea's own rim (1: a sea of its own; 0: the ocean) in the glass's tint
uniform vec3 u_portal;                                                      // THE PORTAL OPENS ON THE BEAT: its circle on this glass, centre and radius in device px (a radius under 0: the whole glass)
vec4 rimmed(vec3 c, float a, vec2 st) {                                     // the porthole's rim: the tint strongest at the edges, over the whole glass a little, gone at u_rim 0
  float edge = 1.0 - smoothstep(0.0, 0.22, min(min(st.x, 1.0 - st.x), min(st.y, 1.0 - st.y)));
  c = mix(c, u_tint, u_rim * (0.35 + 0.65 * edge)); a = max(a, u_rim * edge * 0.9);
  return vec4(c * a, a);
}
uniform sampler2D u_land; uniform vec4 u_land_xf; uniform int u_land_on; uniform float u_land_n;   // THE OCEAN IS THE TRACES: the grid as a texture, (centre x, centre z, span, rise), on, n
uniform float u_land_front;   // THE LINE: the land's depth his traces' line reached (sea-land.mjs frontOf z: 0 its far edge, 1 today's, -1 before it leaves); beyond it the sea
float line(vec2 p) { if (u_land_on == 0 || u_land_front < 0.0 || u_land_front >= 1.0) return 0.0; vec2 uv = (p - u_land_xf.xy) / u_land_xf.z + 0.5; if (uv.x < 0.0 || uv.x > 1.0) return 0.0; float d = (uv.y - u_land_front) * u_land_xf.z; return exp(-d * d / 0.008); }   // the line itself: light a few cm each side of where it stands
float land(vec2 p) { if (u_land_on == 0) return 0.0; vec2 uv = (p - u_land_xf.xy) / u_land_xf.z + 0.5; if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0 || uv.y > u_land_front) return 0.0; vec2 tc = (uv * (u_land_n - 1.0) + 0.5) / u_land_n; return texture2D(u_land, tc).r * u_land_xf.w; }
float hgt(vec2 p) { float h = land(p); for (int i = 0; i < 4; i++) { if (i >= u_n) break; vec4 w = u_wave[i]; vec2 d = vec2(cos(w.z), sin(w.z)); h += w.x * sin(w.y * dot(d, p) - w.w); } return h; }
vec3 nrm(vec2 p) { float hx = 0.0, hz = 0.0; if (u_land_on == 1) { float e = u_land_xf.z / (u_land_n - 1.0) * 0.5; hx += (land(p + vec2(e, 0.0)) - land(p - vec2(e, 0.0))) / (2.0 * e); hz += (land(p + vec2(0.0, e)) - land(p - vec2(0.0, e))) / (2.0 * e); } for (int i = 0; i < 4; i++) { if (i >= u_n) break; vec4 w = u_wave[i]; vec2 d = vec2(cos(w.z), sin(w.z)); float c = w.x * w.y * cos(w.y * dot(d, p) - w.w); hx += c * d.x; hz += c * d.y; } return normalize(vec3(-hx, 1.0, -hz)); }
// THE WAVES FROM BELOW (Oct 29 2026, his press 07:2x UTC: "under the water every screen shows the waves overhead and the light coming down from the
// surface, not flat colour"). Under the surface the sun's light comes down through the waves, and where they bend it together it is bright: lit(p) is
// that light as it leaves the surface at p, from the waves' curvature (a crest gathers it, a trough spreads it: the sign of the heights' Laplacian), sharpened.
float bend(vec2 p) { float l = 0.0, s = 1e-6; for (int i = 0; i < 4; i++) { if (i >= u_n) break; vec4 w = u_wave[i]; vec2 d = vec2(cos(w.z), sin(w.z)); float k2 = w.x * w.y * w.y; l += k2 * sin(w.y * dot(d, p) - w.w); s += k2; } return l / s; }
float lit(vec2 p) { return pow(clamp(0.5 + 0.5 * bend(p), 0.0, 1.0), 6.0); }
// the light coming down along the ray from the eye: eight steps through the water at the same distances for every pixel (so neighbouring pixels cross the
// same shafts: a column of the glass sees one shaft, never a grain), each lit by the surface straight up the sun's way under the water (lw: refracted,
// steeper) and dimmed by the water above it; the water nearest the eye weighs most, so the shafts do not average away
float shafts(vec3 d, float span, vec3 lw) {
  float acc = 0.0, sum = 1e-6;
  for (int i = 0; i < 8; i++) {
    float s = (float(i) + 0.5) / 8.0 * span, wt = exp(-s / 1.2); vec3 q = u_eye + d * s; float z = u_y - q.y;
    if (z > 0.0) acc += pow(lit(q.xz + lw.xz * (z / lw.y)), 1.7) * exp(-z / 3.0) * wt;   // the brightest of the light alone: sparse shafts a ray passes through or misses
    sum += wt;
  }
  return acc / sum;
}
void main() {
  if (u_portal.z >= 0.0 && length(gl_FragCoord.xy - u_portal.xy) > u_portal.z) { gl_FragColor = vec4(0.0); return; }   // THE PORTAL: nothing outside its circle
  vec2 st = gl_FragCoord.xy / u_res;                                        // st.y: 0 at the page's bottom (GL), so the glass's up is +st.y
  vec3 P = u_c + u_r * ((st.x - 0.5) * u_wh.x) + u_u * ((st.y - 0.5) * u_wh.y);
  vec3 d = normalize(P - u_eye);
  float dy = u_y - u_eye.y;                                                 // the surface over (+) or under (-) the eye
  vec3 LW = normalize(vec3(u_sun.x * 0.75, max(abs(u_sun.y), 0.35), u_sun.z * 0.75));   // the sun's way under the water (bent steeper at the surface)
  vec3 SHAFT = mix(u_near, u_sky, 0.5);                                    // the colour of the light under the water
  float BED_M = 1.6;                                                       // the sea's floor under the surface (the same depth on every glass)
  bool hit = abs(d.y) > 1e-4 && dy * d.y > 0.0;
  if (!hit) {
    if (dy > 0.0) {                                                         // the submarine: the surface above, this ray goes down into the water
      if (u_mode == 1) { gl_FragColor = vec4(0.5, 0.0, 0.5, 1.0); return; }
      // the deep, and the sea's floor BED_M under the surface where the ray meets it: the light coming down lands there, its web moving with the waves
      float k = clamp(-d.y * 1.2, 0.0, 1.0), lb = (u_y - BED_M - u_eye.y) / d.y; vec3 c = mix(u_near, u_deep, k * 0.85); float span = 4.0;
      if (d.y < -1e-4 && lb > 0.0) {
        vec3 B = u_eye + d * lb; float web = pow(lit(B.xz + LW.xz * (BED_M / LW.y)), 1.6), fb = clamp(lb / u_fog, 0.0, 1.0);   // the floor's web, sharper than the light in the water
        c = mix(mix(u_deep, u_near, 0.5) * (0.55 + 1.7 * web), mix(u_near, u_deep, k * 0.85), smoothstep(0.0, 0.8, fb)); span = min(lb, 4.0);
      }
      float sh = shafts(d, span, LW); c += SHAFT * sh * 4.0;   // the light coming down through the water between
      gl_FragColor = rimmed(c, clamp(u_alpha + 0.35 * sh, 0.0, 1.0), st); return;
    }
    if (u_mode == 1) { gl_FragColor = vec4(0.5, 0.0, 0.0, 1.0); return; }  // the air above the horizon: nothing drawn, the glass's own face shows
    gl_FragColor = vec4(0.0); return;
  }
  float lam = dy / d.y; vec3 H = u_eye + d * lam; float h = hgt(H.xz); vec3 n = nrm(H.xz);
  if (u_mode == 1) { gl_FragColor = vec4(h / ${H_RANGE_M.toFixed(3)} + 0.5, lam / ${LAMBDA_RANGE_M.toFixed(1)}, 1.0, 1.0); return; }
  float far = clamp(lam / u_fog, 0.0, 1.0);
  float spec = pow(max(dot(reflect(d, n), u_sun), 0.0), 80.0);
  vec3 c; float a;
  if (dy < 0.0) {                                                           // the sea seen from above it, receding to the horizon
    float fres = 0.02 + 0.98 * pow(1.0 - max(dot(n, -d), 0.0), 5.0);
    vec3 base = mix(u_near, u_deep, far * 0.7 + 0.3 * clamp(h / 0.12 + 0.5, 0.0, 1.0) * 0.0);
    c = mix(base, u_sky, fres); c = mix(c, u_sky * 0.9, far * 0.5) + spec * 0.6; a = clamp(u_alpha + 0.4 * spec, 0.0, 1.0);
  } else {                                                                  // the underside of the surface, seen from the water: THE WAVES FROM BELOW
    // Snell's window: within ~49 degrees of straight up the sky through the surface (its edge softened, the waves bending it); beyond it the surface is a
    // mirror of the lit water under it, its waves bright where they gather the light; the light coming down between it and the eye; far, the water's own colour
    float win = smoothstep(0.58, 0.72, dot(d, n)), lt = mix(lit(H.xz), 0.14, smoothstep(0.55, 0.95, far)), sh = shafts(d, min(lam, 4.0), LW);   // far, the waves' light fades to its mean before it outruns the pixels
    vec3 mirror = mix(u_deep, u_near, 0.3) + SHAFT * lt * 1.1, sky = mix(u_near, u_sky, 0.75) + 0.3 * lt;
    c = mix(mirror, sky, win) + spec * 0.5 + SHAFT * sh * 3.4; c = mix(c, mix(u_deep, u_near, 0.3), far * 0.6); a = clamp(u_alpha + 0.3 * spec + 0.3 * sh + 0.2 * lt, 0.0, 1.0);
  }
  float ln = line(H.xz); c = mix(c, vec3(1.0), ln * 0.85); a = max(a, ln * 0.9);   // THE LINE where it stands on the surface, the same place on every glass at one instant
  gl_FragColor = rimmed(c, a, st);
}`;
// THE SHIP: the sky's own program (one-ship.mjs's law), built at the first picture of a voyage, so the sea's program stays the sea's alone, its text as it
// stood (SHIP-LANDING.md: lysa's Intel GPU, one program for both against two). The ray, the rim and the diagnostic modes are the sea's own words.
export const SKY_FRAG = `precision highp float;
uniform vec2 u_res; uniform vec3 u_eye, u_c, u_r, u_u; uniform vec2 u_wh; uniform int u_mode;
uniform float u_rim; uniform vec3 u_tint;
uniform vec3 u_portal;                                                      // THE PORTAL OPENS ON THE BEAT, as the sea's
vec4 rimmed(vec3 c, float a, vec2 st) {                                     // the porthole's rim: the tint strongest at the edges, over the whole glass a little, gone at u_rim 0
  float edge = 1.0 - smoothstep(0.0, 0.22, min(min(st.x, 1.0 - st.x), min(st.y, 1.0 - st.y)));
  c = mix(c, u_tint, u_rim * (0.35 + 0.65 * edge)); a = max(a, u_rim * edge * 0.9);
  return vec4(c * a, a);
}
uniform vec3 u_bow, u_perp; uniform vec2 u_eph; uniform mat3 u_rot; uniform float u_seed;
uniform vec3 u_psf; uniform vec2 u_tone; uniform vec3 u_dest; uniform vec3 u_glow; uniform float u_salpha;
const float PI = 3.14159265;
const vec3 KS = vec3(${glf(KS[0])}, ${glf(KS[1])}, ${glf(KS[2])});
const vec3 WH = vec3(${glf(WHITE[0])}, ${glf(WHITE[1])}, ${glf(WHITE[2])});
const float NC = ${glf(STARS.N)}, STAR_A = ${glf(STARS.p * 289)}, INNER = ${glf(STARS.inner)}, M_MAX = ${glf(STARS.m_max)}, M_MIN = ${glf(STARS.m_min)};
const float T_LO = ${glf(STARS.T_lo)}, T_HI = ${glf(STARS.T_hi)}, F0 = ${glf(STARS.F0)}, T_GLOW = ${glf(STARS.T_glow)}, GLOW_G = ${glf(bandOf(STARS.T_glow)[1])}, T_BG = ${glf(T_CMB)};
const float WA = ${glf(WARP.a)}, WB = ${glf(WARP.b)};
vec3 band3(float T) { vec3 x = KS / T; vec3 e = exp(-min(x, vec3(87.0))); vec3 den = mix(1.0 - e, x * (1.0 - 0.5 * x), step(x, vec3(1e-3))); return WH * e / max(den, vec3(1e-30)); }
float band1(float T) { float x = KS.y / T; float e = exp(-min(x, 87.0)); float den = x < 1e-3 ? x * (1.0 - 0.5 * x) : 1.0 - e; return WH.y * e / max(den, 1e-30); }
float perm(float x) { return mod((34.0 * x + 1.0) * x, 289.0); }
vec4 sky(vec3 d, vec2 st) {
  vec3 dm = d - u_bow;
  vec3 dp = d + u_bow;
  float tq2 = min(dot(dm, dm) / max(dot(dp, dp), 1e-38), 1e12);
  float tq = sqrt(tq2);
  float D = (1.0 + tq2) / (u_eph.y + u_eph.x * tq2);
  float T = u_eph.x * tq;
  float uu = T > 1.0 ? 1.0 / T : T;
  float u2 = uu * uu;
  float ri = 1.0 / (1.0 + u2);
  float cs = (T > 1.0 ? u2 - 1.0 : 1.0 - u2) * ri;
  float sn = 2.0 * uu * ri;
  vec3 pe = d - dot(d, u_bow) * u_bow;
  float lp2 = dot(pe, pe);
  vec3 m = u_rot * (cs * u_bow + sn * (lp2 > 1e-14 ? pe * inversesqrt(lp2) : u_perp));
  if (u_mode == 1) return vec4(clamp((log2(max(D, 1e-30)) + 16.0) / 32.0, 0.0, 1.0), 2.0 * atan(T) / PI, 0.25, 1.0);
  vec3 am = abs(m);
  vec3 A; vec3 U; vec3 V; float f;
  if (am.x >= am.y && am.x >= am.z) { f = m.x > 0.0 ? 0.0 : 1.0; A = vec3(m.x > 0.0 ? 1.0 : -1.0, 0.0, 0.0); U = vec3(0.0, 0.0, 1.0); V = vec3(0.0, 1.0, 0.0); }
  else if (am.y >= am.z) { f = m.y > 0.0 ? 2.0 : 3.0; A = vec3(0.0, m.y > 0.0 ? 1.0 : -1.0, 0.0); U = vec3(1.0, 0.0, 0.0); V = vec3(0.0, 0.0, 1.0); }
  else { f = m.z > 0.0 ? 4.0 : 5.0; A = vec3(0.0, 0.0, m.z > 0.0 ? 1.0 : -1.0); U = vec3(1.0, 0.0, 0.0); V = vec3(0.0, 1.0, 0.0); }
  float ma = dot(m, A);
  vec2 sq = vec2(dot(m, U), dot(m, V)) / ma;
  vec2 gc = (sq * (WA - WB * abs(sq)) + 1.0) * 0.5 * NC;
  vec2 g = clamp(floor(gc), 0.0, NC - 1.0);
  float a = perm(mod(g.x + u_seed, 289.0));
  a = perm(mod(a + g.y, 289.0));
  a = perm(mod(a + f, 289.0));
  if (u_mode == 2) return vec4(g.x * 4.0 / 255.0, g.y * 4.0 / 255.0, (f * 32.0 + (a < STAR_A ? 16.0 : 0.0)) / 255.0, 1.0);
  vec3 L = vec3(0.0);
  float sig = D * u_psf.x;
  float w = smoothstep(0.04, 0.12, sig * NC / 1.5707963);
  if (a < STAR_A && w < 1.0) {
    float b = perm(mod(a + g.x + 1.0, 289.0));
    float cc = perm(mod(b + g.y + 2.0, 289.0));
    vec2 sp = INNER + (1.0 - 2.0 * INNER) * vec2(b, cc) / 288.0;
    if (length(gc - g - sp) * (0.48 / NC) < 5.0 * sig) {
    vec2 su = -1.0 + (g + sp) * (2.0 / NC);
    vec2 tt = sign(su) * (WA - sqrt(WA * WA - 4.0 * WB * abs(su))) / (2.0 * WB);
    vec3 dv = m - normalize(A + tt.x * U + tt.y * V);
    float q = dot(dv, dv) / max(sig * sig, 1e-36);
    if (q < 25.0) {
      float dd = perm(mod(cc + f + 3.0, 289.0));
      float ee = perm(mod(dd + 5.0, 289.0));
      float hh = perm(mod(ee + 7.0, 289.0));
      float mag = max(M_MIN, M_MAX + log2((dd * 289.0 + ee + 0.5) / 83521.0) * 0.50171665);
      float th = (hh + 0.5) / 289.0;
      float Ts = T_LO + (T_HI - T_LO) * th * th * th * th;
      L += (1.0 - w) * F0 * exp2(-1.32877124 * mag) * band3(Ts * D) / (band1(Ts) * D * D) * exp(-0.5 * q) * u_psf.y;
    }
    }
  }
  float G = w * u_glow.x + (abs(m.y) < 4.0 * u_glow.z ? u_glow.y * exp(-(m.y * m.y) / (u_glow.z * u_glow.z)) : 0.0);
  if (G > 0.0 && G * band1(T_GLOW * D) > 1e-2 * GLOW_G * u_tone.x) L += G * band3(T_GLOW * D) / GLOW_G;
  float Tb = T_BG * D;
  if (Tb > 600.0) L += band3(Tb);
  if (tq < 2.5 * u_psf.x) { float th = 2.0 * tq; L += u_dest * exp(-0.5 * th * th / (u_psf.x * u_psf.x)) * u_psf.y; }
  float Y = dot(L, vec3(0.2126, 0.7152, 0.0722));
  vec3 c = Y > 0.0 ? L * (clamp(log(1.0 + Y / u_tone.x) * u_tone.y, 0.0, 1.0) / Y) : vec3(0.0);
  float mx = max(c.r, max(c.g, c.b));
  if (mx > 1.0) c /= mx;
  return u_rim > 0.0 ? rimmed(c, u_salpha, st) : vec4(c * u_salpha, u_salpha);
}
void main() {
  if (u_portal.z >= 0.0 && length(gl_FragCoord.xy - u_portal.xy) > u_portal.z) { gl_FragColor = vec4(0.0); return; }   // THE PORTAL: nothing outside its circle
  vec2 st = gl_FragCoord.xy / u_res;                                        // st.y: 0 at the page's bottom (GL), so the glass's up is +st.y
  vec3 P = u_c + u_r * ((st.x - 0.5) * u_wh.x) + u_u * ((st.y - 0.5) * u_wh.y);
  gl_FragColor = sky(normalize(P - u_eye), st);                           // the sky at infinity in the vessel's frame, through this pixel
}`;

/** portalPx(portal, w, h): THE PORTAL OPENS ON THE BEAT (sea-flag.mjs portalAt): the shader's u_portal for a portal's radius (0 to 1) on a canvas of w x h
 *  device px: its circle round the glass's middle, PORTAL_COVER of the half diagonal at 1 (past the corners); null, or 1 and over, is the whole glass. Pure. */
export const PORTAL_COVER = 1.02;
export function portalPx(portal, w, h) {
  if (!num(portal) || portal >= 1 || !num(w) || !num(h)) return [0, 0, -1];
  return [w / 2, h / 2, Math.max(0, portal) * PORTAL_COVER * Math.hypot(w, h) / 2];
}

/** mountSeaLayer({ doc, host, win, perf }): the layer on an overlay glass. program(value, rev) takes the ref's value (the Nest's word, or null);
 *  paint({ plane, eye, now, W, H, mode, seat, song, fog_ms, probe_age_ms, tint }) draws the sea at the house instant `now` (ms) through the glass: song the
 *  song's cause in force (songInForce: the waves' t with clock 'song'), fog_ms this glass's clock fog and probe_age_ms the age of its last probe (THE SEAS AND THE OCEAN:
 *  the layer keeps the sea-or-ocean state, oceanStep, and draws the rim in the seat's tint); pixel(x, y) reads one device pixel of the last picture
 *  ([r, g, b, a] bytes; the proof's road); stats() for the page's state and the lens; on(), hz() for the page's cadence; stop() ends it. The canvas
 *  stands FIRST in the host: under her square and the flock's canvas, over the glass's own face. module: the sea's doors of the one WASM (sea-wasm.mjs):
 *  the word and the land's grid are handed to it too, and the waves the shader takes are its (uniformsOf), the page's law the geometry and the colours. */
export function mountSeaLayer({ doc, host, win, perf = globalThis.performance, rite = null, fetch: fetchImpl = globalThis.fetch ? globalThis.fetch.bind(globalThis) : null, module = null } = {}) {
  const Z = { sea: null, rev: null, cv: null, gl: null, prog: null, loc: null, W: 0, H: 0, res: 1, frames: 0, painted: 0, drawMs: 0, lastMs: 0, why: 'no program on the Nest', dead: false, lost: false, horizon: null, ocean: null, song: null,
    voyage: null, hud: null, hudText: '', skyKey: null, skyPhi: null, blank: true, sky: null, attrib: 0,
    landTex: null, landGrid: null, landKey: null, landWhy: null, landReads: 0, landLoading: false,   // THE OCEAN IS THE TRACES: the grid this glass holds, as a texture, and where it stands
    field: null, fieldRev: null, landBaked: null, landBakes: 0, landBakeMs: null, flagMs: null, front: null };   // THE TRACES ARE THE ONE LAND: the writer's rows, the bakes, his flag, the line
  const riteBase = typeof rite === 'string' && rite ? rite.replace(/\/$/, '') : (win && win.location && onFront(win.location) ? win.location.origin : win && win.location && typeof win.location.hostname === 'string' && win.location.hostname ? `${win.location.protocol}//${win.location.hostname}:8903` : null);   // the rite beside this glass's Nest (on the house's secure front, the page's own origin: house-door.mjs)
  const clockNow = () => (perf && typeof perf.now === 'function' ? perf.now() : 0);
  function lay(g) {   // the grid in hand: the module's copy and this glass's texture (made once, its bytes replaced at each bake); the next picture draws it
    Z.landGrid = g; if (module) { try { module.grid(g); } catch { /* the module keeps no land: its heights are the waves' alone */ } }
    const gl = Z.gl; if (!gl || typeof gl.createTexture !== 'function') return;
    try { const tex = Z.landTex || gl.createTexture(); gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, tex); gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, g.n, g.n, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, g.v);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      Z.landTex = tex; } catch (e) { Z.landWhy = 'the land\'s texture was refused: ' + String(e && e.message || e).slice(0, 80); }
  }
  function bake() {   // THE TRACES ARE THE ONE LAND: the writer's rows laid on the grid (traces-land.mjs gridOfRows), again only when a lay moved them
    const L = Z.sea && Z.sea.land, key = 'rev ' + Z.fieldRev; if (!L || L.kind !== 'traces' || !Z.field || key === Z.landBaked) return false;
    const t0 = clockNow(), g = gridOfRows(Z.field); if (!g) return false;
    Z.landBakeMs = Math.round((clockNow() - t0) * 100) / 100; Z.landBaked = key; Z.landBakes++; Z.landWhy = null;
    lay(g); return true;
  }
  function landLoad() {   // the land the word names: his traces' rows are the Nest's (field()), laid at once; another kind's grid is read once from the rite
    const L = Z.sea && Z.sea.land; if (!L) { Z.landKey = null; return; }
    const key = L.kind + ' ' + L.url;
    if (Z.landKey === key && (Z.landGrid || Z.landWhy || Z.landLoading || L.kind === 'traces')) { bake(); return; }
    Z.landKey = key; Z.landGrid = null; Z.landWhy = null; Z.landBaked = null;
    if (L.kind === 'traces') { if (!Z.field) Z.landWhy = 'no land of his traces on the Nest yet: the writer lays it on his word'; bake(); return; }
    if (!riteBase || !fetchImpl) { Z.landWhy = 'no rite to read the land from'; return; }
    Z.landReads++; Z.landLoading = true;
    fetchImpl(riteBase + L.url, { cache: 'no-store' }).then((r) => (r && r.ok ? r.json() : null)).then((j) => {
      if (Z.landKey !== key) return; Z.landLoading = false;
      const g = gridOf(j); if (!g) { Z.landWhy = 'the rite gave no grid of the land'; return; }
      lay(g);
    }).catch((e) => { if (Z.landKey !== key) return; Z.landLoading = false; Z.landWhy = 'the land did not come from the rite: ' + String(e && e.message || e).slice(0, 80); });
  }   // THE SHIP: the ship as this glass last drew it, its HUD's element and text, the sky's last causes
  function canvas() {
    if (Z.cv || !doc || !host) return Z.cv;
    const cv = doc.createElement('canvas'); cv.id = 'one-sea'; cv.setAttribute('aria-hidden', 'true');
    cv.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;display:block';
    if (typeof host.insertBefore === 'function' && host.firstChild) host.insertBefore(cv, host.firstChild); else host.appendChild(cv);
    Z.cv = cv;
    try { Z.gl = cv.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, preserveDrawingBuffer: false, powerPreference: 'low-power' }) || null; } catch { Z.gl = null; }
    if (!Z.gl) { Z.why = 'no WebGL on this glass'; return cv; }
    if (typeof cv.addEventListener === 'function') { cv.addEventListener('webglcontextlost', (e) => { if (e && e.preventDefault) e.preventDefault(); Z.lost = true; Z.prog = null; Z.sky = null; Z.why = 'the WebGL context was lost'; }); cv.addEventListener('webglcontextrestored', () => { Z.lost = false; Z.landTex = null; build(); }); }   // a restored context holds no texture: the land is laid again at the next picture
    build(); return cv;
  }
  function build() {
    const gl = Z.gl; if (!gl) return;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { Z.why = 'the shader did not compile: ' + String(gl.getShaderInfoLog(s) || '').slice(0, 160); gl.deleteShader(s); return null; } return s; };
    const v = sh(gl.VERTEX_SHADER, VERT), f = sh(gl.FRAGMENT_SHADER, FRAG); if (!v || !f) return;
    const p = gl.createProgram(); gl.attachShader(p, v); gl.attachShader(p, f); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { Z.why = 'the program did not link: ' + String(gl.getProgramInfoLog(p) || '').slice(0, 160); return; }
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const a = gl.getAttribLocation(p, 'a_pos'); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
    Z.prog = p; Z.attrib = a; Z.sky = null; Z.loc = {}; for (const n of ['u_res', 'u_eye', 'u_c', 'u_r', 'u_u', 'u_wh', 'u_y', 'u_wave', 'u_n', 'u_near', 'u_deep', 'u_sky', 'u_sun', 'u_alpha', 'u_fog', 'u_mode', 'u_rim', 'u_tint', 'u_land', 'u_land_xf', 'u_land_on', 'u_land_n', 'u_land_front', 'u_portal']) Z.loc[n] = gl.getUniformLocation(p, n);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.clearColor(0, 0, 0, 0);
  }
  /** buildSky(): THE SHIP's own program, at the first picture of a voyage (a page that never voyages never compiles it); its a_pos bound where the sea's is,
   *  so the one triangle's buffer serves both. -> { prog, loc } or null (and the lens says why). */
  function buildSky() {
    const gl = Z.gl; if (!gl || Z.lost) return null;
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { Z.why = 'the sky\'s shader did not compile: ' + String(gl.getShaderInfoLog(s) || '').slice(0, 160); gl.deleteShader(s); return null; } return s; };
    const v = sh(gl.VERTEX_SHADER, VERT), f = sh(gl.FRAGMENT_SHADER, SKY_FRAG); if (!v || !f) return null;
    const p = gl.createProgram(); gl.attachShader(p, v); gl.attachShader(p, f); gl.bindAttribLocation(p, Z.attrib ?? 0, 'a_pos'); gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { Z.why = 'the sky\'s program did not link: ' + String(gl.getProgramInfoLog(p) || '').slice(0, 160); return null; }
    const loc = {}; for (const n of ['u_res', 'u_eye', 'u_c', 'u_r', 'u_u', 'u_wh', 'u_mode', 'u_rim', 'u_tint', 'u_portal', ...SKY_UNIFORMS]) loc[n] = gl.getUniformLocation(p, n);
    Z.sky = { prog: p, loc }; return Z.sky;
  }
  function size(W, H, res) {
    const cv = canvas(); if (!cv || !Z.gl) return false;
    if (Z.landGrid && !Z.landTex) lay(Z.landGrid);   // ONE LAND UNDER THE SEA: a grid that came before this glass's context (or before it was restored) is laid now; until then no land was drawn
    const pw = Math.max(1, Math.round(W * SEA_DPR * res)), ph = Math.max(1, Math.round(H * SEA_DPR * res));
    if (cv.width !== pw || cv.height !== ph || Z.W !== W || Z.H !== H || Z.res !== res) { cv.width = pw; cv.height = ph; Z.W = W; Z.H = H; Z.res = res; Z.gl.viewport(0, 0, pw, ph); }
    return true;
  }
  function clear() { if (Z.gl && Z.cv && !Z.lost) { try { Z.gl.clear(Z.gl.COLOR_BUFFER_BIT); } catch { /* a lost context */ } } }
  function blank() { if (!Z.blank) { clear(); Z.blank = true; } Z.skyKey = null; Z.skyPhi = null; }   // THE SHIP: a glass that draws no sky is cleared once, then nothing (a parked ship costs nothing)
  /** hudSay(lines): THE SHIP'S HUD, text on the one glass the voyage names: a block in the host's lower left, its words set only when they change; null hides it. */
  function hudSay(lines) {
    const text = Array.isArray(lines) ? lines.join('\n') : ''; if (text === Z.hudText) return; Z.hudText = text;
    if (!text) { if (Z.hud) Z.hud.hidden = true; return; }
    if (!Z.hud && doc && host) {
      const el = doc.createElement('div'); el.id = 'one-ship-hud'; el.setAttribute('aria-hidden', 'true');
      el.style.cssText = 'position:absolute;left:3%;bottom:4%;pointer-events:none;white-space:pre;font:600 clamp(12px,2.1vh,40px)/1.35 ui-monospace,Menlo,Consolas,monospace;color:rgba(232,238,255,0.92);text-shadow:0 0 6px rgba(0,0,0,0.9),0 0 2px rgba(0,0,0,1);letter-spacing:0.02em';
      host.appendChild(el); Z.hud = el;
    }
    if (Z.hud) { Z.hud.textContent = text; Z.hud.hidden = false; }
  }
  /** paintSky(...): THE SHIP: the sky through this glass at the house instant, or nothing (a glass the voyage does not name, a parked ship, causes that did not move). */
  function paintSky({ plane, eye, now, W, H, mode, seat, song, tint, portal = null }) {
    const V = Z.sea.voyage;
    if (!seat || !V.glasses.includes(seat)) { Z.voyage = null; Z.why = `the voyage shows on ${V.glasses.join(', ') || 'no glass'} alone (not on ${seat || 'a glass with no name'})`; blank(); hudSay(null); return false; }
    const axis = axisOf(Z.sea, now, song), st = axis == null ? null : voyageAt(V, axis);
    if (!st) { Z.voyage = null; Z.why = 'no instant on the voyage\'s clock'; blank(); hudSay(null); return false; }
    Z.voyage = { state: st.state, tau_s: st.tau, phi: st.phi, gamma: st.gamma, deficit: st.deficit, earth_s: st.t, left_s: st.left };
    if (st.parked) { Z.why = st.state === 'before' ? `parked: the ship leaves for ${V.name} in ${countdownText(-st.tau)}` : `parked: arrived at ${V.name}`; blank(); hudSay(null); return false; }
    hudSay(seat === V.hud ? hudOf(V, st, baseOf(Z.sea, V, song)) : null);
    if (!size(W, H, Z.sea.res) || !Z.gl || !Z.prog || Z.lost) return false;
    const U = skyUniformsOf(Z.sea, plane, eye, now, Z.cv.width, Z.cv.height, mode, { song, rim: Z.ocean.rim, tint: tint || tintOf(seat) }); if (!U) { Z.why = 'the glass has no rectangle'; return false; }
    Z.voyage.eye_phi = U.phi; Z.voyage.eye_gamma = Math.cosh(U.phi);
    const ring = portalPx(portal, Z.cv.width, Z.cv.height);   // THE PORTAL OPENS ON THE BEAT
    const key = [...U.c, ...U.r, ...U.u, ...U.wh, ...U.eye.map((v) => Math.round(v * 1000)), U.res[0], U.res[1], mode, Math.round(U.rim * 100), ...U.tint, V.at, V.a, V.seed, Z.rev, Math.round(ring[2])].join(',');
    if (key === Z.skyKey && Z.skyPhi != null && Math.abs(U.phi - Z.skyPhi) < SKY_EPS_PHI) { Z.why = null; return false; }   // nothing that moves a pixel moved: no picture
    const P = Z.sky || buildSky(); if (!P) return false;
    const gl = Z.gl, L = P.loc, t0 = perf.now();
    gl.useProgram(P.prog);
    gl.uniform2f(L.u_res, U.res[0], U.res[1]); gl.uniform3f(L.u_eye, U.eye[0], U.eye[1], U.eye[2]); gl.uniform3f(L.u_c, U.c[0], U.c[1], U.c[2]);
    gl.uniform3f(L.u_r, U.r[0], U.r[1], U.r[2]); gl.uniform3f(L.u_u, U.u[0], U.u[1], U.u[2]); gl.uniform2f(L.u_wh, U.wh[0], U.wh[1]); gl.uniform1i(L.u_mode, U.mode);
    gl.uniform1f(L.u_rim, U.rim); gl.uniform3f(L.u_tint, ...U.tint); if (L.u_portal) gl.uniform3f(L.u_portal, ...ring);
    gl.uniform3f(L.u_bow, ...U.bow); gl.uniform3f(L.u_perp, ...U.perp); gl.uniform2f(L.u_eph, U.eph[0], U.eph[1]); gl.uniformMatrix3fv(L.u_rot, false, new Float32Array(U.rot)); gl.uniform1f(L.u_seed, U.seed);
    gl.uniform3f(L.u_psf, ...U.psf); gl.uniform2f(L.u_tone, U.tone[0], U.tone[1]); gl.uniform3f(L.u_dest, ...U.dest); gl.uniform3f(L.u_glow, ...U.glow); gl.uniform1f(L.u_salpha, U.alpha);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    Z.frames++; Z.painted++; Z.lastMs = perf.now() - t0; Z.drawMs = Math.round(Z.lastMs * 100) / 100; Z.why = null; Z.blank = false; Z.skyKey = key; Z.skyPhi = U.phi;
    Z.horizon = null;
    return true;
  }
  return {
    program(value, rev = null) {
      const A = glassList({ now_ms: null, active: null, entities: {}, paths: {}, screens: null, sea: { word: value, game_shows: true } })?.sea; Z.sea = A && !A.stands ? null : seaOf(value); Z.rev = rev;   /* THE LIST CARRIES THE ROOM'S THINGS (room_things.rs sea_stands): at no instant and no seat, a game band's word too (game_shows), the list stands a word on and a sea, which seaOf's gate already holds; before the module seaOf answers alone */ Z.skyKey = null; Z.skyPhi = null; Z.flagMs = value && value.flag && num(value.flag.at_ms) ? value.flag.at_ms : null;   // THE LINE: his flag opening the sea starts it again
      if (module) { try { if (!module.program(Z.sea ? value : null)) Z.sea = null; } catch { Z.sea = null; } }   // the module reads the same word, or there is no sea to draw
      landLoad();   // THE OCEAN IS THE TRACES
      if (!Z.sea) { Z.why = value ? 'the word is off or not a sea' : 'no program on the Nest'; clear(); Z.blank = true; Z.voyage = null; hudSay(null); return; }
      if (!Z.sea.voyage) { Z.voyage = null; hudSay(null); }
      Z.why = null;
    },
    /** field(value, rev): THE TRACES ARE THE ONE LAND: the writer's rows (LAND_FIELD.traces), kept whatever the word; a land of his traces is laid again with
     *  them. -> true when the land's grid moved (the next picture draws it) */
    field(value, rev = null) { const f = rowsOf(value); Z.field = f; Z.fieldRev = f ? rev : null; return bake(); },
    on: () => !Z.dead && !!Z.sea,
    hz: () => (Z.sea ? Z.sea.hz : SEA_HZ),
    sea: () => Z.sea,
    /** clear(): the glass's sea taken off, its word kept (another world stands in its place: overlay-behind.mjs); once, then nothing */
    clear() { if (!Z.blank) { clear(); Z.blank = true; } Z.horizon = null; hudSay(null); },
    paint({ plane, eye, now, W, H, mode = 0, seat = null, song = null, fog_ms = null, probe_age_ms = null, tint = null, sigma_m = null, framed = null, portal = null } = {}) {
      if (Z.dead || !Z.sea) return false;
      if (!num(now)) { Z.why = 'no house time yet'; return false; }
      if (!plane) { Z.why = 'this glass has no place: no path holds it and the Nest marks none'; return false; }
      if (!fin3(eye)) { Z.why = 'no viewpoint: no program eye and no observed one'; return false; }
      Z.ocean = oceanStep(Z.ocean, { fog_ms, probe_age_ms, now_ms: now, sigma_m, framed });   // THE SEAS AND THE OCEAN: judged at every picture, from this glass's own fog and its own place in the frame
      Z.song = Z.sea.clock === 'song' ? (song && typeof song === 'object' ? { music_seq: song.music_seq ?? null, state: song.state ?? null, position_ms: num(song.position_ms) ? song.position_ms : null } : null) : null;
      if (Z.sea.clock === 'song' && songPhase(song, now) == null) { Z.why = 'the field waits for the music: no song with a position on the rite'; clear(); Z.blank = true; Z.skyKey = null; hudSay(null); return false; }
      if (Z.sea.voyage) return paintSky({ plane, eye, now, W, H, mode, seat, song, tint, portal });   // THE SHIP: the porthole looks out to the sky while a voyage is the word's
      const under = Z.sea.surface_y > eye[1] && mode !== 1;   // THE WAVES FROM BELOW: under the water, a quarter of the pixels (the diagnostic picture keeps them all)
      if (!size(W, H, under ? Math.min(Z.sea.res, UNDER_RES) : Z.sea.res) || !Z.gl || !Z.prog || Z.lost) return false;
      const U = uniformsOf(Z.sea, plane, eye, now, Z.cv.width, Z.cv.height, mode, { song, fog_ms, rim: Z.ocean.rim, tint: tint || tintOf(seat), module }); if (!U) { Z.why = 'the glass has no rectangle'; return false; }
      const gl = Z.gl, L = Z.loc, t0 = perf.now();
      gl.useProgram(Z.prog);
      gl.uniform2f(L.u_res, U.res[0], U.res[1]); gl.uniform3f(L.u_eye, U.eye[0], U.eye[1], U.eye[2]); gl.uniform3f(L.u_c, U.c[0], U.c[1], U.c[2]);
      gl.uniform3f(L.u_r, U.r[0], U.r[1], U.r[2]); gl.uniform3f(L.u_u, U.u[0], U.u[1], U.u[2]); gl.uniform2f(L.u_wh, U.wh[0], U.wh[1]);
      gl.uniform1f(L.u_y, U.y); gl.uniform4fv(L.u_wave, new Float32Array(U.waves.flat())); gl.uniform1i(L.u_n, U.n);
      gl.uniform3f(L.u_near, ...U.near); gl.uniform3f(L.u_deep, ...U.deep); gl.uniform3f(L.u_sky, ...U.sky); gl.uniform3f(L.u_sun, ...U.sun);
      gl.uniform1f(L.u_alpha, U.alpha); gl.uniform1f(L.u_fog, U.fog); gl.uniform1i(L.u_mode, U.mode);
      gl.uniform1f(L.u_rim, U.rim); gl.uniform3f(L.u_tint, ...U.tint);
      if (L.u_portal) gl.uniform3f(L.u_portal, ...portalPx(portal, Z.cv.width, Z.cv.height));   // THE PORTAL OPENS ON THE BEAT: the circle, or the whole glass
      const landOn = U.land_on && Z.landTex && Z.landGrid ? 1 : 0;   // THE OCEAN IS THE TRACES: drawn once this glass holds the grid; the sea alone before
      Z.front = landOn && Z.sea.land.kind === 'traces' ? frontOf(Z.field, Z.flagMs, now) : null;   // THE LINE: where it stands at this picture's instant (the whole land for any other)
      if (L.u_land_front) gl.uniform1f(L.u_land_front, Z.front ? Z.front.z : 1);
      if (L.u_land_on) gl.uniform1i(L.u_land_on, landOn); if (L.u_land_xf) gl.uniform4fv(L.u_land_xf, new Float32Array(U.land)); if (L.u_land_n) gl.uniform1f(L.u_land_n, Z.landGrid ? Z.landGrid.n : 1);
      if (landOn) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, Z.landTex); gl.uniform1i(L.u_land, 0); }
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      Z.frames++; Z.painted++; Z.lastMs = perf.now() - t0; Z.drawMs = Math.round(Z.lastMs * 100) / 100; Z.why = null; Z.blank = false;
      Z.horizon = horizonRow(plane, eye, H);
      return true;
    },
    pixel(x, y) {   // one device pixel of the last picture, [r, g, b, a] bytes, (x, y) from the page's top left in device px; null without a context
      if (!Z.gl || !Z.cv || Z.lost) return null;
      const px = new Uint8Array(4); try { Z.gl.readPixels(Math.round(x), Math.round(Z.cv.height - 1 - y), 1, 1, Z.gl.RGBA, Z.gl.UNSIGNED_BYTE, px); } catch { return null; }
      return [px[0], px[1], px[2], px[3]];
    },
    stats() {
      return { on: !!Z.sea, rev: Z.rev, surface_y: Z.sea ? Z.sea.surface_y : null, waves: Z.sea ? Z.sea.waves.length : 0, hz: Z.sea ? Z.sea.hz : null, res: Z.sea ? Z.sea.res : null,
        law: module ? 'the module' : 'the page',   // whose numbers move the water: the one WASM's sea doors, or this file's lines
        land: Z.sea && Z.sea.land ? { kind: Z.sea.land.kind, span_m: Z.sea.land.span_m, rise_m: Z.sea.land.rise_m, centre: [...Z.sea.land.centre], held: !!Z.landGrid, n: Z.landGrid ? Z.landGrid.n : null, drawn: !!(Z.landTex && Z.landGrid), why: Z.landWhy, reads: Z.landReads,   // THE OCEAN IS THE TRACES
          bakes: Z.landBakes, ...(Z.sea.land.kind === 'traces' ? { field_rev: Z.fieldRev, bake_ms: Z.landBakeMs, weeks: Z.field ? Z.field.weeks : null, start: Z.field ? Z.field.start : null, front: Z.front } : {}) } : null,   // THE TRACES ARE THE ONE LAND: how often it was laid, what of, the line
        clock: Z.sea ? Z.sea.clock : null, song: Z.song,   // THE MUSIC FIELD: whose instant the waves are at, and the song as this glass last heard of it
        ocean: Z.ocean ? { state: Z.ocean.state, runs: Z.ocean.runs, fog_ms: Z.ocean.fog_ms == null ? null : Math.round(Z.ocean.fog_ms * 10) / 10, sigma_m: Z.ocean.sigma_m == null ? null : Math.round(Z.ocean.sigma_m * 1000) / 1000, framed: Z.ocean.framed, rim: Math.round(Z.ocean.rim * 100) / 100, since_ms: Z.ocean.since_ms } : null,   // THE SEAS AND THE OCEAN, and the frame
        painted: Z.painted, draw_ms: Z.drawMs, px: Z.cv ? [Z.cv.width, Z.cv.height] : null, webgl: !!Z.gl, horizon: Z.horizon ? { t: Math.round(Z.horizon.t * 1000) / 1000, where: Z.horizon.where } : null,
        voyage: Z.sea && Z.sea.voyage ? { to: Z.sea.voyage.to, name: Z.sea.voyage.name, a: Z.sea.voyage.a, at: Z.sea.voyage.at, glasses: [...Z.sea.voyage.glasses], hud: Z.sea.voyage.hud,   // THE SHIP: the cause and the ship at the last look
          law: Z.sea.voyage.eye_gamma_max ? `the eye's sky capped at gamma ${Z.sea.voyage.eye_gamma_max}` : 'the exact law', tau_end_s: Z.sea.voyage.tau_end, ...(Z.voyage || {}), hud_text: Z.hudText || null } : null, why: Z.why };
    },
    stop() { Z.dead = true; if (Z.cv && Z.cv.parentNode) Z.cv.parentNode.removeChild(Z.cv); if (Z.hud && Z.hud.parentNode) Z.hud.parentNode.removeChild(Z.hud); Z.cv = null; Z.gl = null; Z.prog = null; Z.hud = null; },
  };
}

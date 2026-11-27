// sea-land.mjs · THE LAND UNDER THE SEA: the word's land, its grid and its height, the sea's land law alone (one-sea.mjs imports it and says it again).
// Its own file (Oct 29 2026, lane/one-land-under-the-sea, at the Board seat's ask) so that a reader of the land takes this file, traces-land.mjs and
// traces-field.mjs into its closure, never the sea's shader, the ship or the room's law: the Board bakes the land in its composer, and a lane on one-sea.mjs
// or one-ship.mjs then restamps no Board.
/* THE OCEAN IS THE TRACES (Oct 26 2026 19:5x WET, his "the traces landscape by kat poet engineer are treated as a simple ornament, a decoration... it's totally
   fucking wrong dude: THE OCEAN THAT THE SUBMARINE SCENE IS IN, THAT IS THE TRACES LANDSCAPE DUDE... please go grab it"; Oct 18 05:33 "the manifold: MANIFOLD AKA
   THAT TRACES THING IN MANIFOLD AMPLITUHEDRON 2D PEAKS AND VALLEYS"; Oct 17 18:04 "imagine what you have there is a static landscape... what if we started
   making it vibrate to the sound of music?"): the surface every porthole looks out on is the LAND of his traces, After Which's year as its height grid
   (intro/after-which/sky3d.json `grid`: n x n bytes 0..255, the turns' weight), laid flat on the Station's floor plane, `span_m` across and along from
   `centre`, rising `rise_m` at its highest; the waves ride on it: the music's vibration over the landscape. The word names it (`land`); a glass reads the grid
   from the rite beside its Nest (/ui/intro/after-which/sky3d.json, served raw from the house) and samples it as a texture; the law here samples it the same
   way (landAt: bilinear at the texel centres) so a proof reads what a glass draws. No land in the word: the sea as before.
   ONE LAND UNDER THE SEA (Oct 29 2026, lane/one-land-under-the-sea): the kind 'traces' is his year and his live days as one land in Kat's own layout
   (traces-land.mjs): the days along, today at the near edge (+z).
   THE TRACES ARE THE ONE LAND (Nov 3 2026, lane/the-traces-are-the-one-land; his words: traces-land.mjs): the kind 'traces' reads no file. Its rows are the one
   writer's (scene/entities/traces-manifold: a row a week from the day he picked to today, across his topics), handed to the sea's layer as they move (one-sea.mjs
   field()), and the line of his traces slides over them a week a beat (frontOf): the land beyond it is the sea. Every glass lays the same bytes from the same ref. */
// Pure: no I/O, no clock, no DOM. Bad input gives null (or 0 for a height), never a throw.
import { REF as TRACES_REF } from './traces-land.mjs';

export const LAND_KINDS = Object.freeze({ 'after-which': '/ui/intro/after-which/sky3d.json', traces: null });   // the file a kind's grid is read from (his traces: none, the Nest's rows)
export const LAND_FIELD = Object.freeze({ traces: TRACES_REF });   // the Nest ref a kind's land reads: the writer's rows
export const LAND_DEFAULTS = Object.freeze({ span_m: 24, rise_m: 0.8, centre: [0, 0] });

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);

/** landOf(v): the land the word names, or null: { kind (LAND_KINDS), url, span_m (2..400), rise_m (0..10), centre [x, z] (the Station's metres) }; the kind
 *  'traces' adds field (the Nest ref of the writer's rows). */
export function landOf(v) {
  if (!v || typeof v !== 'object' || typeof v.kind !== 'string' || !Object.prototype.hasOwnProperty.call(LAND_KINDS, v.kind)) return null;
  const span_m = num(v.span_m) ? clamp(v.span_m, 2, 400) : LAND_DEFAULTS.span_m, rise_m = num(v.rise_m) ? clamp(v.rise_m, 0, 10) : LAND_DEFAULTS.rise_m;
  const c = Array.isArray(v.centre) && v.centre.length === 2 && v.centre.every(num) ? [v.centre[0], v.centre[1]] : [...LAND_DEFAULTS.centre];
  const traces = v.kind === 'traces' ? { field: LAND_FIELD.traces } : {};
  return { kind: v.kind, url: LAND_KINDS[v.kind], span_m, rise_m, centre: c, ...traces };
}
/** gridOf(json): the height grid as the page carries it (sky3d.json `grid` {n, hmax, v}), or null: { n, v: Uint8Array n*n (row k = z, column i = x), hmax }. */
export function gridOf(json) {
  const g = json && typeof json === 'object' && json.grid && typeof json.grid === 'object' ? json.grid : null; if (!g) return null;
  const n = Number(g.n), v = Array.isArray(g.v) ? g.v : null; if (!Number.isInteger(n) || n < 2 || n > 1024 || !v || v.length !== n * n) return null;
  const bytes = new Uint8Array(n * n); for (let i = 0; i < v.length; i++) { const x = Number(v[i]); if (!Number.isFinite(x)) return null; bytes[i] = Math.max(0, Math.min(255, Math.round(x))); }
  return { n, v: bytes, hmax: num(g.hmax) ? g.hmax : null };
}
/** landAt(land, grid, x, z, front): the land's height (m) at a point of the floor plane: the grid laid over [centre - span/2, centre + span/2] on x and z,
 *  bilinear between texel centres (as the shader samples it), 0 beyond its edge (the open sea round the land), beyond the line's front (frontOf's z: the land
 *  his line has not reached yet; 1, the whole land, when unsaid) and with no land or grid. */
export function landAt(land, grid, x, z, front = 1) {
  if (!land || !grid || !num(x) || !num(z)) return 0;
  const u = (x - land.centre[0]) / land.span_m + 0.5, w = (z - land.centre[1]) / land.span_m + 0.5;
  if (u < 0 || u > 1 || w < 0 || w > 1 || w > front) return 0;
  const n = grid.n, fx = u * (n - 1), fz = w * (n - 1), i0 = Math.floor(fx), k0 = Math.floor(fz), i1 = Math.min(n - 1, i0 + 1), k1 = Math.min(n - 1, k0 + 1), tx = fx - i0, tz = fz - k0;
  const at = (i, k) => grid.v[k * n + i] / 255;
  return (at(i0, k0) * (1 - tx) * (1 - tz) + at(i1, k0) * tx * (1 - tz) + at(i0, k1) * (1 - tx) * tz + at(i1, k1) * tx * tz) * land.rise_m;
}
/** frontOf(R, flag_ms, house_ms): THE LINE (his Nov 3 2026 14:21 UTC "one wall of the room is where the line of traces begins, then over time it slides over
 *  the room", 14:27 "why the fuck do you feel the urge to show all at once?", 15:12 "yeah 100 works"): where the line of his traces stands at a house instant.
 *  It leaves its first wall (the land's far edge) on the entry's own clock (R.grid, R.t0_beat: the downbeat after the lay), or on the first downbeat after his
 *  flag opens the sea (flag_ms) when that is later, and slides a week a beat to today's edge. R: traces-land.mjs rowsOf; one entry, one clock. -> { week (the rows behind it, fractional; -1 before it leaves),
 *  z (the land's depth it reached, 0 to 1; -1 before it leaves), t0_ms, end_ms } or null (no rows, no instant). A lookup of the instant (THE PIXEL IS A LOOKUP). */
export function frontOf(R, flag_ms, house_ms) {
  if (!R || !R.grid || !num(house_ms)) return null;
  const G = R.grid, bar = G.beat_ms * G.beats_per_bar, lay = G.epoch_ms + R.t0_beat * G.beat_ms, t0 = num(flag_ms) && flag_ms > lay ? lay + Math.ceil((flag_ms - lay) / bar) * bar : lay;
  const W = R.weeks, w = (house_ms - t0) / G.beat_ms, end_ms = t0 + (W - 1) * G.beat_ms;
  return w < 0 ? { week: -1, z: -1, t0_ms: t0, end_ms } : { week: Math.min(W - 1, w), z: W > 1 ? Math.min(1, w / (W - 1)) : 1, t0_ms: t0, end_ms };
}

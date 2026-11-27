// traces-land.mjs · THE TRACES ARE THE ONE LAND (Nov 3 2026, lane/the-traces-are-the-one-land): his traces as the land under the one sea, read off the one
// writer's rows. His words (UTC): Oct 26 19:07 "THE OCEAN THAT THE SUBMARINE SCENE IS IN, THAT IS THE TRACES LANDSCAPE DUDE"; Nov 2 02:01 "we should just
// bring them together"; Nov 3 13:23 "the after-which is supposed to be the shared submarine see that appears onto the displays after scanning"; 14:21
// "imagine that one wall of the room is where the line of traces begins, then over time it slides over the room tracing a complete flooring/ceiling
// depending on the height of the curves"; 14:29 "a date from which the user wants to trace back to today". The lineage: ec-workspace
// docs/the-display-wide-overlays-synced-with-the-room-and-the-screens-hypertrace-2026-11-02.md, its section of Nov 3 10:13 to 15:13 UTC.
// WHAT STOOD (ONE LAND UNDER THE SEA, Oct 29): every glass baked After Which's year (sky3d.json, its last turn Oct 24) and the snowfield's live days into one
// land by her law (the blur, the gamma) in this file, and the Board drew the traces manifold beside it as a second picture.
// WHAT THIS IS: one writer (tools/traces-manifold/traces_manifold.py) lays the land's rows on the Nest (REF, SCHEMA): a row a week from the day he picked in
// the walk (identity/traces `since`) to today, across his topics in a row by their likeness (or the hours of the house's day), bytes. A glass reads them and
// lays them on the sea's grid; nothing of his traces is computed on a glass. The rows run along (z) from the far edge (his first week) to the near edge
// (today, +z), the columns across (x). Where the line stands at an instant is the land's law (sea-land.mjs frontOf).
// COST: the rows ~60 x 96 bytes (the ref ~15 KB) once a lay; a grid of 65,536 texels, bilinear (no blur, no gamma: the writer's), once a lay. At rest: nothing.
// Pure: no I/O, no clock, no DOM. Bad input gives null, never a throw.

export const REF = 'scene/entities/traces-manifold', SCHEMA = 'embertide.traces-manifold/2';
export const TRACES_N = 256;                     // the grid's side: embertide-scene sea.rs LAND_N_MAX, the most the module holds
export const WEEKS_MAX = 1040, COLS_MAX = 256;   // twenty years of weeks; the most places a row carries across
const num = (v) => typeof v === 'number' && Number.isFinite(v);
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const byte = (x) => Number.isInteger(x) && x >= 0 && x <= 255;
const list = (a, n) => (Array.isArray(a) ? a.filter((x) => Array.isArray(x) && x.length === n && typeof x[0] === 'string' && x.slice(1).every((y) => Number.isInteger(y) && y >= 0)) : []);

/** rowsOf(value): the writer's land as the law reads it, or null: { weeks, cols, rows: Uint8Array(weeks * cols) (row w along, column c across), start,
 *  today, grid: { epoch_ms, beat_ms, beats_per_bar, source } (the line's one clock, her path's words), t0_beat (the downbeat it leaves on), names: [[title,
 *  peak week, col, show week]], goals: [[title, week, col]] } */
export function rowsOf(v) {
  if (!v || typeof v !== 'object' || v.schema !== SCHEMA || !Array.isArray(v.rows)) return null;
  const W = v.rows.length, C = v.cols, g = v.grid;
  if (!W || W > WEEKS_MAX || !Number.isInteger(C) || C < 2 || C > COLS_MAX || !g || !num(g.epoch_ms) || !(g.beat_ms > 0) || !(g.beats_per_bar >= 1) || !num(v.t0_beat)) return null;
  const rows = new Uint8Array(W * C);
  for (let w = 0; w < W; w++) { const r = v.rows[w]; if (!Array.isArray(r) || r.length !== C || !r.every(byte)) return null; rows.set(r, w * C); }
  return { weeks: W, cols: C, rows, start: DAY.test(v.start) ? v.start : null, today: DAY.test(v.today) ? v.today : null,
    grid: { epoch_ms: g.epoch_ms, beat_ms: g.beat_ms, beats_per_bar: Math.round(g.beats_per_bar), source: typeof g.source === 'string' ? g.source : null }, t0_beat: v.t0_beat,
    names: list(v.names, 4).filter((x) => x[1] < W && x[2] < C && x[3] < W), goals: list(v.goals, 3).filter((x) => x[1] < W && x[2] < C) };
}
/** gridOfRows(R, n): the rows as the sea's grid (sea-land.mjs gridOf's shape: n x n bytes, row k = z, column i = x): row k at the week k (W - 1) / (n - 1), column
 *  i at the place i (C - 1) / (n - 1), bilinear between the cells, rounded (+ - x / floor only, in the order written: the same bytes on every engine).
 *  -> { n, v: Uint8Array(n * n), hmax: null } or null */
export function gridOfRows(R, n = TRACES_N) {
  if (!R || !Number.isInteger(n) || n < 2) return null;
  const v = new Uint8Array(n * n), W = R.weeks, C = R.cols, at = (w, c) => R.rows[w * C + c];
  for (let k = 0; k < n; k++) {
    const r = W > 1 ? k * (W - 1) / (n - 1) : 0, r0 = Math.floor(r), r1 = Math.min(W - 1, r0 + 1), tr = r - r0;
    for (let i = 0; i < n; i++) {
      const cc = i * (C - 1) / (n - 1), c0 = Math.floor(cc), c1 = Math.min(C - 1, c0 + 1), tc = cc - c0;
      v[k * n + i] = Math.round((at(r0, c0) * (1 - tc) + at(r0, c1) * tc) * (1 - tr) + (at(r1, c0) * (1 - tc) + at(r1, c1) * tc) * tr);
    }
  }
  return { n, v, hmax: null };
}

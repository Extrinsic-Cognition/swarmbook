// assembly-floor.mjs: THE BALL IS SOLANA'S STATE on any of her engines (room/assembly-gpu.mjs). The meta swarm's floor (dyson-society/app/swarmbook-floor.mjs: the mints
// the house's door lists, folded by the land law, the rung following the count; on a glass, the Nest's `mint/floor`) and everyone's faces, handed to an engine: her
// cells (floorRows: two texels a cell) and the faces' atlas (one tile a held hexagon, drawn by the faces' own hook). Swarmbook's front (dyson-society/app/
// assembly-dive.mjs) and the welcome's ball (../assembly-home.mjs) draw the same floor through it: his Nov 19 2026 "Yes, do both", asked "Put the same Solana floor on
// the welcome's ball and the mint page's sphere next?". It imports the engine by the welcome's own path, so a page holds one instance of it, and nothing outside room/:
// the land law's skin (dyson-society/app/assembly-geometry.js buildAssemblySkin) is handed in by the page from its own place (the site's build puts that folder at
// /app/, the house serves it where it stands, and the build's walk places a file once: a path into it from here was missing on the built site, Nov 20 2026).
import { cellOf, cellsOf, frequencyFor } from './assembly-gpu.mjs';

const unit = (v) => { const l = Math.hypot(v[0], v[1], v[2]) || 1; return [v[0] / l, v[1] / l, v[2] / l]; };
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
/** A face's tile in her atlas: TILE px square, its hexagon point up, RC from its middle to a point (RIN to a flat), as dl-her-portrait.js's hook draws it. */
export const TILE = 128, RC = 60, RIN = RC * Math.sqrt(3) / 2;
/** tileOf(i, cols): where tile i stands in the atlas: its middle and its hexagon's six points, from the top, clockwise. Pure. */
export const tileOf = (i, cols) => { const x = (i % cols + .5) * TILE, y = (Math.floor(i / cols) + .5) * TILE; return { mid: [x, y], points: Array.from({ length: 6 }, (_, k) => [x + RC * Math.sin(k * Math.PI / 3), y - RC * Math.cos(k * Math.PI / 3)]) }; };
/** floorRows(floor): her skin's cells as the floor names them (swarmbook-floor.mjs: {count, capacity, held: [{face, signature}]}) -> {m, n (her cells), rows (the
 *  engine's setFloor: 8 n floats), ids (a cell's id -> its held hexagon)}. A held hexagon is a member's cell (row 1's w: 1, or 2 for `floor.mine`, the visitor's own) and takes tile `its place in held`; its face stands
 *  upright on the ball: its up is the cell's corner nearest the skin's north, its right the middle of the edge on that corner's right, both scaled so the tile's
 *  hexagon lies on the cell's. A sealed house (`floor.sealed`: the chairs a posiverse holds, swarmbook-floor.mjs SEALED) is its chair's cell, row 1's w 3, laid by its pentagon's middle. Pure. */
export function floorRows(floor, skinOf) {
  const m = frequencyFor(floor.count), n = cellsOf(m), rows = new Float32Array(n * 8), sealed = (floor.sealed || []).filter((c) => Number.isInteger(c) && c >= 0 && c < 12), skin = (floor.held.length || sealed.length) && skinOf ? skinOf(floor.capacity) : null, ids = new Map();
  if (!skin) return { m, n, rows, ids }; for (const c of sealed) rows[(n + cellOf(unit(skin.pents.find((p) => p.id === `pent:${c}`).center), m).id) * 4 + 3] = 3;   // no member to place (or no skin handed): her lattice by the count, every cell open
  floor.held.forEach((h, slot) => {
    const face = skin.hexes[h.face], cc = unit(face.center), id = cellOf(cc, m).id, k = Math.abs(cc[1]) > .999 ? 0 : 1;   // at a pole the skin's north is no direction: its east is taken
    const north = unit([(k ? 0 : 1) - cc[k] * cc[0], (k ? 1 : 0) - cc[k] * cc[1], -cc[k] * cc[2]]);
    const tan = face.verts.map((v) => { const u = unit(v), d = dot(u, cc); return [u[0] / d - cc[0], u[1] / d - cc[1], u[2] / d - cc[2]]; });   // its corners on the cell's own plane
    const A = tan.reduce((best, t) => (dot(t, north) > dot(best, north) ? t : best)), right = cross(cc, A);
    const B = tan.map((t, j) => { const q = tan[(j + 1) % tan.length]; return [(t[0] + q[0]) / 2, (t[1] + q[1]) / 2, (t[2] + q[2]) / 2]; }).reduce((best, t) => (dot(t, right) > dot(best, right) ? t : best));
    const ka = RC / TILE / dot(A, A), kb = RIN / TILE / dot(B, B);
    rows.set([B[0] * kb, B[1] * kb, B[2] * kb, slot + 1], id * 4); rows.set([A[0] * ka, A[1] * ka, A[2] * ka, h === floor.mine ? 2 : 1], (n + id) * 4); ids.set(id, h);
  });
  return { m, n, rows, ids };
}
/** EMPTY: a house that holds no mint, the dodecahedron (a clean account is empty). floorOf(v): a floor as another writer said it (the Nest's `mint/floor`), or EMPTY
 *  when it is not one: a count, the places of the rung that count is on, each held hexagon a place of it; its sealed houses kept, a chair 0 to 11 each. Pure. */
export const EMPTY = Object.freeze({ count: 0, capacity: 0, held: Object.freeze([]) });
export function floorOf(v) {
  if (!v || !Number.isInteger(v.count) || v.count < 0 || !Number.isInteger(v.capacity) || cellsOf(frequencyFor(v.count)) - 12 !== v.capacity || !Array.isArray(v.held)) return EMPTY;
  const held = v.held.filter((h) => h && Number.isInteger(h.face) && h.face >= 0 && h.face < v.capacity), faces = new Set(held.map((h) => h.face));
  return faces.size === held.length && held.length <= v.count ? { count: v.count, capacity: v.capacity, held, sealed: (Array.isArray(v.sealed) ? v.sealed : []).filter((c) => Number.isInteger(c) && c >= 0 && c < 12) } : EMPTY;
}
/** floorOn(A, doc, skinOf): the floor and everyone's faces on engine A, skinOf the land law's skin builder. -> {floor(f) (her lattice by its count, her members' cells
 *  its held hexagons, their tiles laid again), faces(fn) (the faces' hook, dl-her-portrait.js face(ctx, seat): a hexagon it has no face for stays paper), skin(fn), cells()} */
export function floorOn(A, doc, skinOf = null) {
  let floor = null, cells = null, hook = null, atlas = null;
  const lay = () => {
    if (!hook || !floor?.held.length) return; const cols = Math.ceil(Math.sqrt(floor.held.length)), rows = Math.ceil(floor.held.length / cols);
    atlas ??= doc.createElement('canvas'); atlas.width = cols * TILE; atlas.height = rows * TILE; const g = atlas.getContext('2d');
    floor.held.forEach((h, i) => { const t = tileOf(i, cols); g.save(); g.beginPath(); g.rect(t.mid[0] - TILE / 2, t.mid[1] - TILE / 2, TILE, TILE); g.clip(); hook(g, { id: h.signature, show: 1, ...t }); g.restore(); });
    A.setFaces(atlas, cols, rows, 2 * RIN);
  };
  const set = (f) => { floor = f; cells = floorRows(f, skinOf); A.setMembers(f.count); A.setFloor(cells.rows, cells.n); lay(); };
  return { floor: set, faces(fn) { hook = fn; lay(); }, skin(fn) { skinOf = fn; if (floor) set(floor); }, cells: () => cells };
}

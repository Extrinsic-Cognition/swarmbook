// mint-wasm.mjs · THE SPHERE'S FRAME IN ONE WASM (Oct 15 2026; his "i want it invariant but way more optimized... do all rust c low wasm";
// house/CLAUDE.md The performance culture: the hot path is Rust). house/embertide-mint (Rust, no_std, f64 and libm only, on embertide-score's
// curve) is built once by its build.sh into ./wasm/embertide-mint.wasm, so every glass that draws the mint's hero runs the same bytes. This
// file is the whole glue, no bindgen: load() instantiates the module once (a fetch of the same origin; a file read under node) and exposes the
// doors under their names over two flat f64 buffers (IN, OUT). warm-sphere.js stays the reference and the fallback: its jsFrame twins write
// the same layouts, and useWasm(mint) swaps these in; until the bytes land, and wherever they cannot, the page draws from its own JS.
//
// THE LAYOUTS (embertide-mint/src/frame.rs, the contract):
//   trails(at, yaw, pitch, cx, cy, orbital): 12 chairs x 65 points (the oldest first) x [x, y, z]
//   trace(beat, at, yaw, pitch, cx, cy, orbital, radius): 12 chairs x beat.length samples (j = n..0) x [x, y, band, on]; null past 680 samples
//   rings(yaw, cx, cy, radius): 3 rings x 181 points x [x, y, z], then 96 ticks x [x0, y0, x1, y1]
//   stars(clock, width, height, cx, cy, radius): 76 x [x, y, alpha, skip]
//   faces(packed, n, yaw, pitch, cx, cy, radius): n x [depth, lit, mx, my, 6 corners x [x, y], decal x6, front, 0], then the order (n indices,
//     far first); packed holds n x [nv, normal x3, centre x3, 6 corners x3]; null past 1024 faces
// Every view returned is OUT itself (a Float64Array over the module's memory): read it before the next door is asked.
let W = null, I = null, O = null, U = null;
export const FRAME = Object.freeze({TRAILS: 12 * 65 * 3, RINGS: 3 * 181 * 3, TICKS: 96 * 4, STARS: 76 * 4, FACE_IN: 25, FACE_OUT: 24, TRACE_MAX: 680, FACES_MAX: 1024});
const v3 = (i = 0) => [O[i], O[i + 1], O[i + 2]];

export const mint = {
  get loaded() { return W !== null; },
  // ---- the laws, one call each ----
  loopUnitAt: (chair, u, at) => (W.mint_loop_unit_at(chair, u, at), v3()),
  loopPoint: (chair, at) => (W.mint_loop_point(chair, at), v3()),
  phaseAtDistance: (turns) => W.mint_phase_at_distance(turns),
  rotate: (p, yaw, pitch) => (W.mint_rotate(p[0], p[1], p[2], yaw, pitch), v3()),
  project: (p, center, radius) => (W.mint_project(p[0], p[1], p[2], center[0], center[1], radius), [O[0], O[1]]),
  poseAt: (t) => (W.mint_pose_at(t), {yaw: O[0], pitch: O[1]}),
  handAt: (t) => W.mint_hand_at(t),
  momentPhase: (t) => W.mint_moment_phase(t),
  momentCosmos: (t) => W.mint_moment_cosmos(t),
  star: (i) => (W.mint_star(i), v3()),
  // ---- the frame builders: a whole frame's geometry in one call ----
  trails: (at, yaw, pitch, cx, cy, orbital) => O.subarray(0, W.mint_trails(at, yaw, pitch, cx, cy, orbital)),
  trace(beat, at, yaw, pitch, cx, cy, orbital, radius) {
    if (!beat || beat.length < 2 || beat.length > FRAME.TRACE_MAX) return null;
    I.set(beat);
    const n = W.mint_trace(beat.length, at, yaw, pitch, cx, cy, orbital, radius);
    return n ? O.subarray(0, n) : null;
  },
  rings: (yaw, cx, cy, radius) => O.subarray(0, W.mint_rings(yaw, cx, cy, radius)),
  stars: (clock, width, height, cx, cy, radius) => O.subarray(0, W.mint_stars(clock, width, height, cx, cy, radius)),
  faces(packed, n, yaw, pitch, cx, cy, radius) {
    if (!(n > 0) || n > FRAME.FACES_MAX) return null;
    I.set(packed.length === n * FRAME.FACE_IN ? packed : packed.subarray(0, n * FRAME.FACE_IN));
    const m = W.mint_faces(n, yaw, pitch, cx, cy, radius);
    return m ? O.subarray(0, m) : null;
  },
  // ---- THE SHAPES ARE RUST'S (embertide-mint glass.rs): the trails and the twelve's bodies as the graphics card's instances ----
  get exports() { return W; },
  glassSkin: (which, packed, n, npent, seed) => (I.set(packed.subarray(0, n * FRAME.FACE_IN)), W.mint_glass_skin(which, n, npent, seed) === 1),
  glassLanes: (rgba) => (I.set(rgba), W.mint_glass_lanes()),
  glassTrails: (front, scale) => W.mint_glass_trails(front ? 1 : 0, scale),
  glassTrace: (front, scale) => W.mint_glass_trace(front ? 1 : 0, scale),
  glassStars: (light) => W.mint_glass_stars(light ? 1 : 0),
  glassRings: (light) => W.mint_glass_rings(light ? 1 : 0),
  glassBodies: (list, n, light) => (I.set(list.subarray(0, n * 8)), W.mint_glass_bodies(n, light ? 1 : 0)),
  // ---- THE RITE'S UNITS ARE RUST'S (glass.rs units): units is where the page writes a pass's units, 16 doubles each (glass.rs UNIT) ----
  get units() { return U; }, glassUnits: (n, light) => W.mint_glass_units(n, light ? 1 : 0),
  glassUnitSkin: (slot, packed, n, npent, seed) => (I.set(packed.subarray(0, n * FRAME.FACE_IN)), W.mint_glass_unit_skin(slot, n, npent, seed) === 1),
};

/** load({bytes, url}): the module, instantiated once -> mint. bytes (an ArrayBuffer or a view) skips the read; url defaults to ./wasm/embertide-mint.wasm
 *  beside this file (a fetch on a page, a file read under node). A second call answers the same object. */
export async function load({bytes = null, url = null} = {}) {
  if (W) return mint;
  const u = new URL(url || './wasm/embertide-mint.wasm', import.meta.url);
  const src = bytes || (u.protocol === 'file:'
    ? await (await import('node:fs/promises')).readFile(u)
    : await fetch(u).then((r) => { if (!r.ok) throw new Error(`${u.pathname}: ${r.status}`); return r.arrayBuffer(); }));
  const {instance} = await WebAssembly.instantiate(src, {});
  const E = instance.exports;
  I = new Float64Array(E.memory.buffer, E.mint_io_in(), E.mint_in_len());
  O = new Float64Array(E.memory.buffer, E.mint_io_out(), E.mint_out_len()); U = new Float64Array(E.memory.buffer, E.mint_glass_units_ptr(), E.mint_glass_units_max() * 16);
  W = E;
  return mint;
}

// scene-wasm.mjs · THE SCENE'S LAW IN ONE WASM (Oct 14 2026). His words, 01:5x WEST: "i have different instances of the same scene across pelino,
// seeker, ipad etc.. it gotta be a singleton glass instance"; Sept 19: "IO VOGLIO 1 SOLO INSTANCE DI LYSSAJUDRON SYNCHRONIZED ACROSS ALL THE TVs ON
// THE MESH". house/embertide-scene (Rust, no_std, no allocator; her score is embertide-score's) is built once by its build.sh into
// ./wasm/embertide-scene.wasm: her twelve on their chairs, an agent's unit1 out of her and THE HOLD, her body on the song's beat, the refs read
// once from their bytes. The same law is the library the iPhone and the iPad link. This file is the whole glue, no bindgen.
//
// THE BOARD READS IT (Oct 14 2026, tools/embertide-mesh/scene-law/LANDING.md): NestBoard.html carries the .wasm and these SCENE-GLUE lines inline
// (scene-inline.mjs) and draws its frame by them on every glass that admits WebAssembly; TWELVE-CORE's text is its fallback (a page that refuses WebAssembly)
// and still lays the page's own program for its names, trails and picks. THE REAL GLASSES READ IT (embertide-scene/LANDING.md section 9):
// one-agents.mjs, the agents on lysa's well and the glasses that draw her own body, takes its hash, chairs and gait from it, and a unit1's flight
// piece by piece (on, target, airOf, dur, fly, drift), its own text the fallback. room-board-state.mjs still reads by its own text: it switches in its
// own lane (section 8 there). scene-wasm.test.mjs holds the .wasm to the page's text of the day.
//
// A SCENE is what a glass holds between two causes. Hand it each cause as the Nest sends it, the entry's stamp with it; ask it for a moment (a Board
// holds the composer's state, not the refs: programOf(room.agents) and songSaid(room.her.song) in place of the agent, beat and air doors):
//   const scene = await load();                                   // once: a fetch of the same origin (a file read under node); instantiate(bytes) where they are in hand
//   scene.frame({ cm: true, floor_y, bounds, screens });          // the frame this glass draws in (a Board: centimetres from its floor)
//   scene.herPath(value); scene.herLight('#F0910B');              // scene/entities/golem-lyssajudron-path, her light as the caller read it
//   scene.beat(value, ts); scene.air(value, ts);                  // radio/beat and radio/program: her clock's word
//   scene.agent(key, value, ts); scene.agentsKeep(keys, ts);      // cua/agents/<key> (a place: it holds that glass; no place and a name or parts: it sits
//                                                                 // at home; a null value: it left), and a keyframe's read
//   scene.program(now);                                           // the fold, after any of the above (never a frame)
//   scene.eval32(ms); n = scene.dots32(ms);                       // the frame: scene.balls32 (13 x 16 floats), scene.dots32Of(n) (12 x 16 a unit1 seen),
//                                                                 // scene.hold32 (12: how much each unit1 holds a glass), scene.breath32 (12: its breath)
//   (scene.eval, scene.dots, scene.balls, scene.dotsOf: the same frame in doubles, for a proof or a host that wants them)
//   scene.wayProgram(v); scene.wayGlasses(own, planes); scene.wayAgents(list, taken); scene.travellers(ms); scene.wayChairs(ms)   // THE WAY ON EVERY GLASS (one-agents.mjs travellersAt, wayChairs)
//   scene.wayEnter({ now, plane, eye, W, H, rect, step_ms, horizon_ms })   // THE WAY ENTERS THE PICTURE: ms until a unit1 on its way stands in it, or null
// No call reads a clock: `now` and `ms` are the caller's, on the Nest's clock. One scene a module; nothing allocates after load().
// COST: embertide-scene/LANDING.md (measured). A text crosses as UTF-8 (TextEncoder.encodeInto, no garbage), a name as its code units.
import { pathDoor } from './one-law.mjs'; import { houseDoor } from './house-door.mjs';   // THE PATH IS MOVED TO THE MODULE: one-law's pathAt is this module's door once it stands, its text the fallback
// SCENE-GLUE-BEGIN: from here to SCENE-GLUE-END the text a page that carries the module inline carries too (NestBoard.html's SCENE-LAW block, laid by
// scene-inline.mjs: these lines but for their `export`); load(), below the end, finds the bytes where a page or a test has none in hand.
let W = null, S = 0, IN = null, OUT = null, OUT32 = null, HOLD = null, HOLD32 = null, BREATH32 = null, SPIN32 = null, TXT = null, U16 = null, ENC = null, DEC = null, api = null, seated = 0;
const STRIDE = 16, BALLS = 13, DOTS_AT = BALLS * STRIDE, CHAIRS_IN = 64;
const KINDS = [null, 'all', 'kick', 'clap', 'hats', 'clave', 'fill'];   // a hit's kind by band.rs Hit's code (scene_spin)
const nul = (x) => (x === x ? x : null), v3 = (i = 0) => [OUT[i], OUT[i + 1], OUT[i + 2]];
const hexOf = (n) => '#' + (n >>> 0).toString(16).padStart(6, '0');
/** a name into U16 at `at` -> the index past it (its code units, as the Boards hash and order a seat) */
function name(s, at = 0) { s = String(s == null ? '' : s); const n = Math.min(s.length, U16.length - at); for (let i = 0; i < n; i++) U16[at + i] = s.charCodeAt(i); return at + n; }
/** names as records (a length, then the units) -> how many fitted */
function names(list) { let at = 0, n = 0; for (const s of list) { const t = String(s == null ? '' : s); if (at + 1 + t.length > U16.length) break; U16[at] = t.length; at = name(t, at + 1); n++; } return n; }
/** a ref's value into TXT as the JSON a glass was sent -> its bytes; 0 for no value; -1 when it does not fit (the door is not called: a value that is too long is not a leave) */
function text(value) {
  if (value === null || value === undefined) return 0;
  const t = typeof value === 'string' ? value : JSON.stringify(value); if (typeof t !== 'string') return 0;
  const r = ENC.encodeInto(t, TXT); return r.read === t.length ? r.written : -1;
}
const stamp = (ts) => (typeof ts === 'number' && Number.isFinite(ts) ? ts : NaN);
function records(n, at = 0) { const out = []; for (let k = 0; k < n; k++) { const len = U16[at]; out.push(String.fromCharCode(...U16.subarray(at + 1, at + 1 + len))); at += 1 + len; } return out; }
/** a glass as a plane ({c, r, u, n, w, h}: one-law.mjs planeOf's, a leaning glass's lean kept) into IN[at..at + 14]; a vector unsaid is NaN */
function plane(pl, at = 0) { const q = (p) => (Array.isArray(p) ? p : [NaN, NaN, NaN]), c = q(pl.c), r = q(pl.r), u = q(pl.u), n = q(pl.n); IN.set([c[0], c[1], c[2], r[0], r[1], r[2], u[0], u[1], u[2], n[0], n[1], n[2], pl.w, pl.h], at); }
/** a gait ({w, ph}: six drift rates, six phases) into IN[0..12] */
function gaitIn(g) { const w = g.w, ph = g.ph; for (let i = 0; i < 6; i++) { IN[i] = w[i]; IN[6 + i] = ph[i]; } }
/** two points into IN at `at` (six numbers) */
function ends(a, b, at) { IN[at] = a[0]; IN[at + 1] = a[1]; IN[at + 2] = a[2]; IN[at + 3] = b[0]; IN[at + 4] = b[1]; IN[at + 5] = b[2]; }
/** a pair of shares into IN at `at` (NaN, NaN: none said) */
function pair(q, at) { const ok = Array.isArray(q) && q.length >= 2; IN[at] = ok ? q[0] : NaN; IN[at + 1] = ok ? q[1] : NaN; }
/** THE PATH RIDES THE MODULE: a program's numbers into scene_path_in (scene_path_on's order; NaN: unsaid, as pathAt reads a number that is not one)
 *  -> its points, or -1 when one is not [x, y, z] (pathAt's null) */
const num = (v) => (typeof v === 'number' ? v : NaN);
let PV = null;
const SHAPE_KEYS = ['rise_share', 'bend', 'along', 'out_m', 'speed_m_s', 'min_s', 'max_s', 'link_bars'];
const shapeOut = (his) => ({ ...Object.fromEntries(SHAPE_KEYS.map((k, i) => [k, OUT[i]])), arc: OUT[9] === 1 ? 'headroom' : 'flight', his: his ? 'shape' : 'law' });
const arcOf = (shape) => (shape && shape.arc === 'headroom' ? 1 : 0);   // THE TWO ARCS, BOTH KEPT: his curve stands on the module's flight arc, or on the writer's headroom arc of Nov 2 (flight_of.rs ARC_HEADROOM)
function pathIn(pr) {
  const pts = pr.points, n = pts.length, v = PV || (PV = new Float64Array(W.memory.buffer, W.scene_path_in(S), W.scene_path_in_len())), g = pr.grid || {};
  v[0] = num(g.beat_ms); v[1] = num(g.beats_per_bar); v[2] = num(g.epoch_ms); v[3] = num(pr.t0_beat); v[4] = pr.loop ? 1 : 0;
  for (let j = 0, at = 5; j < n; j++, at += 4) {
    const q = pts[j] && pts[j].p; if (!Array.isArray(q) || q.length !== 3) return -1;
    v[at] = num(q[0]); v[at + 1] = num(q[1]); v[at + 2] = num(q[2]); v[at + 3] = num(pts[j].bars);
  }
  return n;
}
/** THE DANCE IS THE MODULE'S: a dance's glass, eye and hold into IN (scene_dance_at's order; NaN: unsaid) */
const DANCE_LEGS = ['down', 'out', 'round', 'back', 'home'], DANCE_ROOM = 32;
function danceArgs(pl, eye, slot) { plane(pl); const e = Array.isArray(eye) ? eye : [NaN, NaN, NaN], p = slot.p; IN.set([num(e[0]), num(e[1]), num(e[2]), p[0], p[1], p[2], num(slot.across_m)], 14); IN[38] = num(e.sigma_m); }   // THE DANCE STANDS ON THE ROOM: the eye's doubt (an array's sigma_m; NaN: unsaid) at 38
const pathRoom = () => (typeof W.scene_path_on === 'function' && typeof W.scene_path_in === 'function' ? (W.scene_path_in_len() - 5) / 4 : 0);
/** THE WAY ON EVERY GLASS: a word of a unit1's sample from its kind and the seat it names (scene_travellers; way.rs Word), the page's own string */
const WAY_AT = 4, WAY_STRIDE = 20;
const wayWord = (k, s) => (k === 0 ? 'her wire' : k === 1 ? `inside ${s}` : k === 2 ? `on ${s}'s glass` : k === 3 ? `out of ${s}` : k === 4 ? `before ${s}` : k === 5 ? 'before him' : k === 6 ? 'the room' : s);

function make() {
  const scene = {
    STRIDE, BALLS,
    /** the frame's balls, as the last eval left them: 13 x 16 numbers (twEval's layout); a caller may fade one (its alpha, index 12) before dots() */
    balls: OUT.subarray(0, DOTS_AT),
    /** the first n dots of the last dots(): n x 16 numbers (twDots's layout) */
    dotsOf: (n) => OUT.subarray(DOTS_AT, DOTS_AT + n * STRIDE),
    /** THE FRAME AS A GPU TAKES IT: the same balls and dots as floats, in the module's own memory: eval32(ms), then dots32(ms), write what the
     *  page's twEval and twDots write into their Float32Arrays (the dots laid round the balls as the floats hold them); hand these views to
     *  bufferSubData as they are, with no copy. A caller may fade a ball (balls32[i * 16 + 12] = 0) between the two. */
    balls32: OUT32.subarray(0, DOTS_AT), dots32Of: (n) => OUT32.subarray(DOTS_AT, DOTS_AT + n * STRIDE),
    /** how much each of the twelve holds a glass at the last eval (twEval's `held`, by chair: 0 on its wire and in flight, 1 at the glass; A PIN IS
     *  NOT A HOLD): hold beside eval's balls, hold32 (floats, as the page's Float32Array holds them) beside eval32's; her body's breath reads it */
    hold: HOLD, hold32: HOLD32, breath32: BREATH32,   // + THE UNIT1 BREATHES (Nov 4 2026): how far each of the twelve's plates ride out at the last eval32, a share of its radius (paint.rs EXPAND x open_of, the overlays' own breath)
    eval32(ms) { return W.scene_eval32(S, ms); },
    /** THE BAND SPINS BY THE MODULE (Nov 5 2026, band.rs scene_spin): each of her twelve's turn in place at ms, x, y, z, w a chair (48 floats): its tumble on her dance clock, its
     *  twirl on its newest hit of `hits` (the band's hitsAt: by seat, newest first; counted in the song's beat_ms), at the song's intensity k and wakefulness w; none: no twirl.
     *  onto: composed onto the last eval32's balls in place. null where this .wasm has no spin door (an older build) */
    spin(ms, hits = null, beat_ms = 600, k = 0, w = 0, onto = false) {
      if (!SPIN32) return null; if (hits) { for (let s = 0; s < 12; s++) { const h = hits[s] && hits[s][0]; IN[s] = (h && KINDS.indexOf(h.kind)) || 0; IN[12 + s] = h ? h.ago_ms / beat_ms : NaN; } IN[24] = k; IN[25] = w; }
      W.scene_spin(S, ms, hits ? 1 : 0, onto ? 1 : 0); return SPIN32; },
    dots32(ms) { return W.scene_dots32(S, ms); },
    /** the scene made new: no glass, no agent, no word of the song, the Station's metres (a glass that reads its whole state again) */
    reset() { W.scene_init(S); seated = 0; },
    /** frame({cm, floor_y, bounds: {x0, x1, z0, z1}, screens: [{id, c, yaw, w, h, rot?, axes?, geometry_known?}]}): the frame this glass draws in */
    frame({ cm = false, floor_y = 0, bounds = null, screens = [] } = {}) {
      const b = bounds || {}; W.scene_frame(S, cm ? 1 : 0, Number.isFinite(floor_y) ? floor_y : 0, +b.x0 || 0, +b.x1 || 0, +b.z0 || 0, +b.z1 || 0); let n = 0;
      for (const m of screens) {
        if (!m || typeof m.id !== 'string' || !Array.isArray(m.c)) continue;
        IN[0] = m.c[0]; IN[1] = m.c[1]; IN[2] = m.c[2]; IN[3] = m.yaw; IN[4] = m.w; IN[5] = m.h;
        const q = Array.isArray(m.rot) && m.rot.length === 4 && m.rot.every(Number.isFinite) ? m.rot : null; for (let i = 0; i < 4; i++) IN[6 + i] = q ? q[i] : NaN;
        const a = Array.isArray(m.axes) && m.axes.length === 3 && m.axes.every((r) => Array.isArray(r) && r.length === 3 && r.every(Number.isFinite)) ? m.axes : null; for (let i = 0; i < 9; i++) IN[10 + i] = a ? a[(i / 3) | 0][i % 3] : NaN;
        if (W.scene_glass(S, name(m.id), m.geometry_known === false ? 0 : 1) >= 0) n++;
      }
      return n;
    },
    /** her program (the ref's value, or null) -> whether she has one */
    herPath(value) { const n = text(value); return n < 0 ? false : W.scene_her_path(S, n) === 1; },
    /** THE PATH RIDES THE MODULE (Nov 2 2026): pathAt(program, house_ms) by the module, one-law.mjs's answer to the bit ({ p, leg, k, at, to, bar,
     *  moving, done }, or null); undefined where this .wasm has no path door (an older build: the caller keeps its text) or the points do not fit */
    /** THE ACTOR'S TAKE BY THE OWNER (take.rs): an actor's walk laid from the cause, as the owner's door asks it: from, to (metres), the cause's instant and the grid it
     *  names (null: the genesis grid's), and HIS DRAG WALKS THE ACTOR's via, the corners his hand drew (take_via: one leg a corner) -> { bars, t0_beat, done_ms, yaw (null: a leg of
     *  no way), metres, seconds, legs: each leg's bars }, or null for an end that is not one or more corners than the law's room (takeLaw().via_max) */
    take(from, to, now, g, via = []) { const d = via.length ? W.scene_take_via : W.scene_take; if (typeof d !== 'function') return null; IN.set([num(from[0]), num(from[1]), num(from[2]), num(to[0]), num(to[1]), num(to[2]), num(g && g.beat_ms), num(g && g.beats_per_bar), num(g && g.epoch_ms), ...via.flat().map(num)]); const n = via.length ? d(S, num(now), via.length) : d(S, num(now)); return n ? { bars: OUT[0], t0_beat: OUT[1], done_ms: OUT[2], yaw: nul(OUT[3]), metres: OUT[4], seconds: OUT[5], legs: via.length ? Array.from(OUT.subarray(6, n)) : [OUT[0]] } : null; },
    takeLaw() { const n = typeof W.scene_take_law === 'function' ? W.scene_take_law(S) : 0; return n >= 2 ? { pace_m_bar: OUT[0], min_bars: OUT[1], via_max: n >= 3 ? OUT[2] : 0 } : null; },
    /** HIS DRAG WALKS THE ACTOR (drag.rs): dragBegin(p) the press, where the picked actor stands (m) -> whether a drag stands; dragTo(sx, sy, f, b, scale, floorY) his finger on the canvas through
     *  this Board's own frame (f: cx, cy, focal, projection, eye, right, up, back) onto the floor within b (x0, x1, z0, z1, the Board's unit; scale of them a metre; floorY the floor's y on the Nest, m),
     *  the trail kept in metres -> the hit [x, 0, z] in the Board's unit, where the page draws the actor under his hand, or null off the floor; dragEnd() the release -> { via: the corners (m), to: where he let go }, or null */
    dragBegin(p) { IN.set([num(p[0]), num(p[1]), num(p[2])]); return typeof W.scene_drag_begin === 'function' && W.scene_drag_begin(S) === 1; },
    dragTo(sx, sy, f, b, scale, floorY) { if (typeof W.scene_drag_to !== 'function') return null; IN.set([sx, sy, f.cx, f.cy, f.focal, f.projection === 'orthographic' ? 1 : 0, ...f.eye, ...f.right, ...f.up, ...f.back, b.x0, b.x1, b.z0, b.z1, scale, floorY].map(num)); return W.scene_drag_to(S) ? v3() : null; },   // holy: the Board's own view frame carried into the module's floor hit (drag.rs floor_hit, the page's ray to its floor), as scene_board_eye carries a glass's; no overlay calls it
    dragEnd() { const n = typeof W.scene_drag_end === 'function' ? W.scene_drag_end(S) : 0; return n ? { via: Array.from({ length: n - 1 }, (_, i) => v3(3 * i)), to: v3(3 * (n - 1)) } : null; },
    /** THE LEFT THING IS THE MODULE'S (left.rs, scene_left): one ask of the left law, { op, ...its arguments } -> { ok } or { fail: { code, message, status } }; null where this .wasm has none */
    left(req) { const n = typeof W.scene_left === 'function' ? text(req) : 0, m = n > 0 ? W.scene_left(S, n) : 0; return m ? JSON.parse(DEC.decode(TXT.subarray(0, m))) : null; }, /* THE WALK KNOWS THE WORLD (Nov 18 2026, route.rs scene_route): route(ask) the way a body walks to his tap, the ask in the Board's own shapes ({ unit, from: [x, z], to: [x, z], walls, cage, openings, reach, block: { c, yaw, scale, block: the body's extras.block } | null }) -> { word: 1 reached, 2 stopped before what cannot be stood on or reached, 3 cut where one way's room ends, to: [x, z], via: the corners } in the ask's unit; null where this .wasm has no such door or the ask names no two places */ route(req) { const n = typeof W.scene_route === 'function' ? text(req) : 0, m = n > 0 ? W.scene_route(S, n) : 0; return m ? { word: OUT[0], to: [OUT[2], OUT[3]], via: Array.from({ length: OUT[1] }, (_, i) => [OUT[4 + 2 * i], OUT[5 + 2 * i]]) } : null; }, /* THE ROOM HOLDS THE CITY OUT (Nov 19 2026, shell.rs scene_room_shell): roomShell(ask) the room's shell, its walls less its doors' and windows' gaps, its floor and its ceiling ({ unit, walls, cage, openings }, the Board's shapes) -> the triangles' corners (x y z, the ask's unit), nine numbers a triangle; null where this .wasm has no such door or the ask names no wall */ roomShell(req) { const n = typeof W.scene_room_shell === 'function' ? text(req) : 0, m = n > 0 ? W.scene_room_shell(S, n) : 0; return m ? Float32Array.from(OUT.subarray(0, 9 * m)) : null; }, /* THE CITY IS PLACED BY HIS HAND (Nov 19 2026, city_place.rs scene_city_place): cityPlace(c, yaw, room, tap, turn, floor) a block's pose after his press (c [x, y, z] its origin, the Board's unit, y over the floor; room [x, z] the room's middle; tap [x, z] his tap on the city or null; turn rad; floor the ground's way down) -> [x, y, z, yaw], or null where this .wasm has no such door */ cityPlace(c, yaw, room, tap, turn, floor) { if (typeof W.scene_city_place !== 'function') return null; IN.set([num(c[0]), num(c[1]), num(c[2]), num(yaw), num(room[0]), num(room[1]), tap ? num(tap[0]) : NaN, tap ? num(tap[1]) : NaN, num(turn), num(floor)]); return W.scene_city_place(S) === 4 ? [OUT[0], OUT[1], OUT[2], OUT[3]] : null; },
    pathOn(pr, ms) {
      const room = pathRoom(); if (!room) return undefined;
      const pts = pr && pr.points; if (!Array.isArray(pts) || !pts.length) return null;
      if (pts.length > room) return undefined;
      const n = pathIn(pr); if (n < 0) return null;
      const r = W.scene_path_on(S, n, num(ms)); if (r !== 1) return r === 0 ? null : undefined;
      const leg = OUT[3], to = OUT[5], lab = (j) => (pts[j].at != null ? pts[j].at : null);
      return { p: v3(), leg, k: OUT[4], at: lab(leg), to: to === to ? lab(to) : null, bar: OUT[6], moving: OUT[7] !== 0, done: OUT[8] !== 0 };
    }, /* THE BODY WALKS HIS TRAJECTORY (gait.rs walk_on): walkOn(pr, ms, d, y0, c) an actor's feet on its take at ms under the scene's clock c (null: none), d its measures in metres (actor gaitDims), y0 its entity's facing -> the 19 numbers scene_actor_gait takes, or null */ walkOn(pr, ms, d, y0, c) { const room = pathRoom(), pts = pr && pr.points; if (!room || !d || typeof W.scene_path_walk !== 'function' || !Array.isArray(pts) || !pts.length || pts.length > room) return null; const n = pathIn(pr), lag = c && (pr.clock === 'house' || Number.isFinite(pr.clock_lag_ms)) && typeof W.scene_path_walk_lag === 'function' ? (pr.clock === 'house' ? Infinity : pr.clock_lag_ms) : null, walk = lag === null ? W.scene_path_walk : (...a) => W.scene_path_walk_lag(...a, lag); /* A WALK HOLDS AT A PAUSE (Nov 17 2026): a take laid under the clock carries its lag (gait.rs path_ms_at); one laid in a house whose clock was never commanded, `clock: 'house'` (gait.rs HOUSE) */ return n >= 0 && walk(S, n, num(ms), num(y0), d[0], d[1], d[2], d[3], d[4], d[5], c ? 1 : 0, c ? +c.positionMs : NaN, c ? +c.anchorMs : NaN, c && Number.isFinite(c.rate) ? c.rate : 1, c && c.mode === 'playing' ? 1 : 0, c && Number.isFinite(c.endMs) ? c.endMs : NaN, c && Number.isFinite(c.originMs) ? c.originMs : NaN) === 1 ? OUT.slice(0, 19) : null; },
    /** HER POP RIDES THE MODULE (Nov 2 2026): her-pop.mjs poseAt(pop, now, reached) by the module, its answer to the bit ({ phase, s, position, yaw, height,
     *  moving }, or null in the ball); pop is popOf's, checked whole. undefined where this .wasm has no pop door (an older build: the caller keeps its text) */
    popPose(pop, now, reached = null) {
      if (typeof W.scene_pop_pose !== 'function') return undefined;
      if (!pop || typeof now !== 'number' || !Number.isFinite(now)) return null;
      const f = pop.from, t = pop.to; IN[0] = f[0]; IN[1] = f[1]; IN[2] = f[2]; IN[3] = t[0]; IN[4] = t[1]; IN[5] = t[2];
      IN[6] = pop.h0; IN[7] = pop.h1; IN[8] = pop.hop_m; IN[9] = pop.at_ms; IN[10] = pop.ms; IN[11] = pop.out ? 1 : 0;
      if (W.scene_pop_pose(S, now, typeof reached === 'number' ? reached : NaN) !== 1) return null;
      return { phase: OUT[0] === 0 ? 'out' : OUT[0] === 1 ? 'rest' : 'back', s: OUT[1], position: [OUT[2], OUT[3], OUT[4]], yaw: pop.yaw, height: OUT[5], moving: OUT[6] !== 0 };
    },
    /** THE WRITER RIDES THE MODULE (Nov 3 2026, pop.rs): her-pop.mjs restOf by the module, to the bit ({ at, f, height } or null); popFlight(kind, l): her flight's
     *  [ms, hop_m] (0 out of the ball, 1 back into it: the arc null, the standing packet's; 2 the call over a way l m long). undefined with no writer door */
    popRest(ball, eye, pl, aspect = null) { if (typeof W.scene_pop_rest !== 'function') return undefined; plane(pl); ends(ball, eye, 14); return W.scene_pop_rest(S, typeof aspect === 'number' ? aspect : NaN) === 1 ? { at: v3(), f: OUT[3], height: OUT[4] } : null; },
    popFlight(kind, l = NaN) { if (typeof W.scene_pop_flight !== 'function') return undefined; W.scene_pop_flight(S, kind, l); return [OUT[0], nul(OUT[1])]; },
    /** THE SHOT IS THE MODULE'S (Nov 3 2026, shot.rs): a link's shot at `now` and its way, `n` steps a leg (one-links-glass.mjs's linkAt and trailOf to the bit),
     *  over its legs ([{ F, T, t0, dur }], `g` its gait as gait() gives it, `done` its landing or null) or, with no gait, over the path its fact carries (`legs`
     *  the path) -> { at: { leg, e, p, landed }, way: [{ leg, pts }] } (no way with n 0), null for no shot; undefined with no shot door */
    shot(g, legs, done, now, n = 0) {
      if (typeof W.scene_shot !== 'function') return undefined;
      if (g && !(Array.isArray(legs) && legs.length && legs.length <= (IN.length - 12) >> 3)) return null;
      const k = g ? legs.length : pathIn(legs); if (k < 0) return null;
      if (g) { gaitIn(g); legs.forEach((L, i) => { ends(L.F, L.T, 12 + 8 * i); IN[18 + 8 * i] = L.t0; IN[19 + 8 * i] = L.dur; }); }
      const r = W.scene_shot(S, g ? 0 : 1, k, g && typeof done === 'number' ? done : NaN, typeof now === 'number' ? now : NaN, n), way = []; let lg = null; if (r < 0) return null;
      for (let i = 0, o = 6; i < r; i++, o += 4) { if (!lg || lg.leg !== OUT[o]) way.push(lg = { leg: OUT[o], pts: [] }); lg.pts.push(v3(o + 1)); }
      return { at: { leg: OUT[0], e: OUT[1], p: v3(2), landed: OUT[5] !== 0 }, way };
    },
    /** THE CARD FLIES BY THE MODULE (Nov 3 2026, embertide-score's flight.rs): flight-law.mjs's numbers to the bit. cardBuild(b, slot): a flight's 38
     *  numbers (flight-law.mjs packFlight) built into a slot -> whether it reads; cardAt(slot, now): its sample's phase index at a house instant (-1: null),
     *  its 18 numbers in cardOut; cardWindow(b): its timing from b's first 9 -> whether it reads (8 in cardOut); cardLaw(): its 11 constants into cardOut.
     *  cardSlots is 0 where this .wasm has no card door (an older build) */
    cardSlots: typeof W.scene_card_slots === 'function' ? W.scene_card_slots() : 0,
    cardOut: OUT,
    cardBuild(b, slot) { IN.set(b); return W.scene_card_build(S, slot) === 1; }, cardAt: (slot, now) => W.scene_card_at(S, slot, now), /* THE CAMERA SAYS IT FILMS BLACK (Nov 24 2026, camera_word.rs scene_camera_word): cameraWord(rgba, seat, ageMs, camera, stillMs, thermal) a phone's camera picture as RGBA pixels (a Uint8Array or a canvas's Uint8ClampedArray, 4096 pixels at most; null: none came), its seat, the picture's age in ms (NaN: unsaid), the phone's word on its camera (-1 unsaid, 0 closed, 1 its picture comes, 2 open off it, 3 resting hot), how long its picture has not moved (ms; NaN: unsaid) and the phone's thermal status (0 to 6; NaN: unsaid) -> { kind, mean, dark, words } (words '' when it has nothing to say), null where this .wasm has no such door; cameraMoved(before, now) two such pictures of one size -> whether the newest moved (true where this .wasm has no such door) */ cameraMoved(before, now) { if (typeof W.scene_camera_moved !== 'function' || !before || !now || before.length !== now.length || before.length > 16384) return true; TXT.set(before); TXT.set(now, before.length); return W.scene_camera_moved(S, before.length) === 1; }, cameraWord(rgba, seat, ageMs, camera, stillMs, thermal) { if (typeof W.scene_camera_word !== 'function') return null; const c = rgba ? rgba.subarray(0, 16384) : new Uint8Array(0); TXT.set(c); const m = W.scene_camera_word(S, c.length, name(seat), num(ageMs), num(stillMs), num(camera), num(thermal)); return { kind: OUT[0], mean: nul(OUT[1]), dark: nul(OUT[2]), words: m ? DEC.decode(TXT.subarray(0, m)) : '' }; },
    cardWindow(b) { IN.set(b); return W.scene_card_window(S) === 1; }, cardLaw: () => W.scene_card_law(S),
    /** THE WINDOW IS A DOOR (Nov 7 2026, cast.rs cast_point and slide): point(pl, eye, p) where this glass shows the thing at p (pl as cast takes it, metres, the scene's frame; folded as her cast) -> { p: its shown point, px: [x, y] shares and its depth, or null }; slide(pl, eye, p, x, y) its place when his finger, having pressed it there, is at (x, y) of the glass -> [x, y, z] m, or null */
    point(pl, eye, p) { if (typeof W.scene_cast_point !== 'function' || !pl || !Array.isArray(eye) || !Array.isArray(p)) return null; plane({ c: pl.c, r: pl.r, u: pl.u, n: pl.n, w: pl.size[0], h: pl.size[1] }); IN.set([eye[0], eye[1], eye[2], NaN, NaN, NaN, NaN], 14); IN.set([p[0], p[1], p[2]], 28); return W.scene_cast_point(S, 0, 0) ? { p: v3(0), px: OUT[5] === OUT[5] ? [OUT[5], OUT[6], OUT[7]] : null } : null; },
    slide(pl, eye, p, x, y) { if (typeof W.scene_slide !== 'function' || !pl || !Array.isArray(eye) || !Array.isArray(p)) return null; plane({ c: pl.c, r: pl.r, u: pl.u, n: pl.n, w: pl.size[0], h: pl.size[1] }); IN.set([eye[0], eye[1], eye[2], NaN, NaN, NaN, NaN], 14); IN.set([p[0], p[1], p[2]], 28); return W.scene_slide(S, num(x), num(y), 1) === 4 ? v3(0) : null; },
    boardEye(pl, eye, rect, w, h) { if (typeof W.scene_board_eye !== 'function') return null; plane({ c: pl.c, r: pl.r, u: pl.u, n: pl.n, w: pl.size[0], h: pl.size[1] }); IN.set([eye[0], eye[1], eye[2], rect[0], rect[1], rect[2], rect[3]], 14); return W.scene_board_eye(S, w, h) ? [OUT[0], OUT[1], OUT[2], OUT[3], OUT[4]] : null; }, glassEyes(pl, w, h, fov = NaN) { if (typeof W.scene_glass_eyes !== 'function') return null; plane({ c: pl.c, r: pl.r, u: pl.u, n: pl.n, w: pl.size[0], h: pl.size[1] }); return W.scene_glass_eyes(S, w, h, fov) ? Array.from(OUT.subarray(0, 15)) : null; }, eyeIn(p, yaw, h, look, pitch) { return typeof W.scene_eye_in === 'function' && W.scene_eye_in(p[0], p[1], p[2], yaw, h, look, pitch) ? Array.from(new Float64Array(W.memory.buffer, W.scene_eye_in_out(), 12)) : null; },   /* THE EYE IN THE CHARACTER (view_door.rs eye_in): a body's own camera, R (its right, down, ahead) then C, in the units p and h came in */   /* THE BOARD FROM A DEVICE'S EYES (npc.rs): cx, cy, focal, the eye, its right, up, back */   // holy: the glue of the module's own door (scene_glass_eyes): the camera is npc.rs's, from the Nest's plane; nothing of this page's own   // THE EYE IS THE WINDOW: cx, cy, focal, focal_y, the eye to the glass (scene_board_eye over cast.rs)
    lift(f, sx, sy, things = [], floorY = NaN, b = null) { const L = typeof W.scene_lift === 'function' && f ? new Float64Array(W.memory.buffer, W.scene_lift_in(), W.scene_lift_in_len()) : null, ng = (v) => -v; if (!L || 24 + 11 * things.length > L.length) return null; L.set([...f.right, ...f.up.map(ng), ...f.back.map(ng), ...f.eye, f.cx, f.cy, f.focal, f.projection === 'orthographic' ? 1 : 0, f.near, sx, sy, floorY, ...(b ? [b.x0, b.x1, b.z0, b.z1] : [NaN, NaN, NaN, NaN])].map(num)); things.forEach((t, i) => L.set(t.map(num), 24 + 11 * i)); const r = W.scene_lift(things.length), O = new Float64Array(W.memory.buffer, W.scene_lift_out(), 12); return r ? { thing: r === 3 ? O[0] : -1, floor: r === 2, p: r > 1 ? [O[1], O[2], O[3]] : null, dist: O[4], T: O[5], from: [O[6], O[7], O[8]], dir: [O[9], O[10], O[11]] } : null; },   // holy: HER HANDS (Nov 22 2026, lift.rs scene_lift): the Board's own frame record (its eye, right, up, back, centre and focal, plan or pinhole, near) carried into the module's one ray, as dragTo carries it; things [p, yaw, k, lo, hi] (eleven numbers: local bounds placed as scene_model places a thing), floorY the floor's y or NaN, b its bounds or null -> { thing: the index met or -1, floor, p, dist, T: the ray's parameter there, from, dir: the ray }, or null
    /** THE SAME STAMP, THE SAME POINT (Nov 4 2026): her on one glass at ms by the program the module holds, the cast door every overlay bends from (cast.rs cast, the part of cast-wasm.mjs cast's answer a Board's pane draws): pl the glass as boardEye takes it (metres, the scene's frame), eye his (metres), fold false for a moving glass -> { p, shown, mirror, side_m, picture, share, seen, body }, or null when she is not cast */
    cast(pl, eye, ms, fold = true) { if (typeof W.scene_cast !== 'function' || !pl || !Array.isArray(eye)) return null; plane({ c: pl.c, r: pl.r, u: pl.u, n: pl.n, w: pl.size[0], h: pl.size[1] }); IN.set([eye[0], eye[1], eye[2], NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN], 14);
      if (!W.scene_cast(S, num(ms), fold ? 1 : 0, 0, NaN)) return null;
      return { p: [OUT[0], OUT[1], OUT[2]], shown: [OUT[9], OUT[10], OUT[11]], mirror: OUT[12] === 1, side_m: OUT[13], picture: OUT[24] === OUT[24] ? [OUT[24], OUT[25]] : null, share: OUT[27], seen: OUT[28] === 1, body: OUT[29] }; },
    /** THE DANCE IS THE MODULE'S (Nov 2 2026, dance.rs: one-dance.mjs's law, its stand-in eye gone). danceRoom(room): the glasses a dance's round visits
     *  ({ all: { seat: plane }, home: seat }, or null: none), in their names' order -> false where this .wasm has no dance (an older build) */
    danceRoom(room) {
      if (typeof W.scene_dance_room !== 'function') return false;
      const all = (room && room.all) || {}, seats = Object.keys(all).sort().slice(0, DANCE_ROOM); let home = 0;
      seats.forEach((s, i) => { const pl = all[s]; if (pl && pl.c && pl.r && pl.u && pl.n) plane(pl); else IN.fill(NaN, 0, 14); W.scene_dance_glass(S, i); if (s === room.home) home = i + 1; });
      return W.scene_dance_room(S, seats.length, home) >= 0;
    },
    /** danceAt(pl, eye, slot, k, R, chair): the dancing unit1 k ms into its dance before the glass of plane pl, round the last danceRoom ({ p, across_m,
     *  leg }), or null past its end or with no eye before the glass */
    danceAt(pl, eye, slot, k, R, chair) { danceArgs(pl, eye, slot); return W.scene_dance_at(S, num(k), num(R), num(chair)) === 1 ? { p: v3(), across_m: OUT[3], leg: DANCE_LEGS[OUT[4]] } : null; },
    /** danceCrossings(pl, eye, slot, t0, R, chair, step): where a dance beginning at t0 crosses that glass: [{ at_ms, q, dir: 'in' | 'out', across_m, leg }] */
    danceCrossings(pl, eye, slot, t0, R, chair, step) {
      danceArgs(pl, eye, slot); const n = W.scene_dance_crossings(S, num(t0), num(R), num(chair), num(step)), out = [];
      for (let i = 0, at = 0; i < n; i++, at += 6) out.push({ at_ms: OUT[at], q: [OUT[at + 1], OUT[at + 2]], dir: OUT[at + 3] === 1 ? 'in' : 'out', across_m: OUT[at + 4], leg: DANCE_LEGS[OUT[at + 5]] });
      return out;
    },
    /** danceEnter(pl, eye, slot, from, to, R, chair, view): the first moment in [from, to) ms into the dance its body falls on view's glass ({ plane, eye }) -> ms, or null */
    danceEnter(pl, eye, slot, from, to, R, chair, view) { danceArgs(pl, eye, slot); plane(view.plane, 21); IN.set(view.eye, 35); const k = W.scene_dance_enter(S, num(from), num(to), num(R), num(chair)); return nul(k); },
    /** the dance's schedule ({ lead, ms, bend_in, bend_out, horizon, step }), or null where this .wasm has no dance */
    danceTime() { if (typeof W.scene_dance_time !== 'function') return null; W.scene_dance_time(S); return { lead: OUT[0], ms: OUT[1], bend_in: OUT[2], bend_out: OUT[3], horizon: OUT[4], step: OUT[5] }; },
    /** her light, '#RRGGBB' or a number */
    herLight(c) { W.scene_her_light(S, typeof c === 'string' ? parseInt(c.replace('#', ''), 16) || 0 : c >>> 0); },
    /** her place at ms: { glass, c, yaw, s } */
    her(ms) { const n = W.scene_her(S, ms); return { glass: n ? String.fromCharCode(...U16.subarray(0, n)) : null, c: v3(), yaw: OUT[3], s: OUT[4] }; },
    /** a word of the ear (radio/beat's value, the Nest's stamp of its entry) -> whether the song her clock stands on moved */
    beat(value, ts = null) { const n = text(value); return n < 0 ? false : W.scene_beat(S, n, stamp(ts)) === 1; },
    /** a word of the station (radio/program's value, the entry's stamp) */
    air(value, ts = null) { const n = text(value); return n < 0 ? false : W.scene_air(S, n, stamp(ts)) === 1; },
    songClear() { W.scene_song_clear(S); },
    /** the song's two words as a composer carries them to a glass (room.her.song: { beat, air }, or null): her clock takes the pair at once, as
     *  NestBoard.html's twTake tunes it (a glass that holds the composer's state, not the refs) -> whether the song her clock stands on moved */
    songSaid(sv) { const n = text(sv); return n < 0 ? false : W.scene_song_said(S, n) === 1; },
    /** the song her clock stands on (twTune's): null, or { at, epoch_ms, beat_ms, since, on, was: [[{at, epoch_ms, beat_ms}, weight], ...], word } */
    song() { const r = W.scene_song(S), word = [null, 'genesis', 'song', 'held'][r & 255]; if (!word) return null; const was = [];
      for (let i = 0; i < r >>> 8; i++) was.push([{ at: nul(OUT[5 + 4 * i]), epoch_ms: nul(OUT[6 + 4 * i]), beat_ms: nul(OUT[7 + 4 * i]) }, OUT[8 + 4 * i]]);
      return { at: nul(OUT[0]), epoch_ms: nul(OUT[1]), beat_ms: nul(OUT[2]), since: nul(OUT[3]), on: OUT[4] === 1, was, word }; },
    /** her clock at ms (twClock's) */
    clock(ms) { W.scene_clock(S, ms); return { ms: OUT[0], beat: OUT[1], bar: OUT[2], bar_phase: OUT[3], beat_phase: OUT[4], bars: OUT[5], beats: OUT[6], lift: nul(OUT[7]) }; }, /* THE FREEZE FREEZES HER (Nov 11 2026, scene_time.rs): c the Nest's program clock (null: none stands): actorMs(c, now) an actor's instant (the line's ms; none: now, to the bit), playBar(c, ms, L, barMs) a play's bar at it (L the set's left entity), clipOf(n, named, known) the clip a rig plays on the line (-3: the walk-or-idle rule as before), clipS(dur_s, ms) its second (once, held at the end), lineLive(c, ms, len_ms) whether a frame is asked */ actorMs(c, now) { return W.scene_time_actor_ms(c ? 1 : 0, c ? +c.positionMs : NaN, c ? +c.anchorMs : NaN, c && Number.isFinite(c.rate) ? c.rate : 1, c && c.mode === 'playing' ? 1 : 0, c && Number.isFinite(c.endMs) ? c.endMs : NaN, c && Number.isFinite(c.originMs) ? c.originMs : NaN, now); }, playBar(c, ms, L, barMs) { return W.scene_time_play_bar(c ? 1 : 0, ms, L && L.hold ? L.hold.bar : NaN, L && L.hold && L.hold.run ? Date.parse(L.hold.run) : NaN, L ? Date.parse(L.at) : NaN, barMs); }, clipOf(n, named, known) { return W.scene_time_clip(n >>> 0, named | 0, known ? 1 : 0); }, clipS(dur, ms) { return W.scene_time_clip_s(dur, ms); }, lineLive(c, ms, len) { return W.scene_time_live(c && c.mode === 'playing' ? 1 : 0, ms, len) === 1; }, /* A WALK HOLDS AT A PAUSE (Nov 17 2026, gait.rs arrival, scene_time.rs take_lag, gait.rs path_ms_at): arrivalAt(c, now, lag, end) the house instant a take with that lag whose line ends at end arrives, asked at now (NaN: held until the clock's next command; no door: end), takeLag(c, h0) the word a take laid at h0 carries (NaN: none; Infinity: the house's instant, a clock never commanded; else its lag), pathMs(c, now, lag) where a take with that lag is on its line at now (no door: now) */ arrivalAt(c, now, lag, end) { return typeof W.scene_time_arrival === 'function' ? W.scene_time_arrival(c ? 1 : 0, c ? +c.positionMs : NaN, c ? +c.anchorMs : NaN, c && Number.isFinite(c.rate) ? c.rate : 1, c && c.mode === 'playing' ? 1 : 0, c && Number.isFinite(c.endMs) ? c.endMs : NaN, c && Number.isFinite(c.originMs) ? c.originMs : NaN, now, lag == null ? NaN : +lag, end) : end; }, takeLag(c, h0) { return typeof W.scene_time_take_lag === 'function' ? W.scene_time_take_lag(c ? 1 : 0, c ? +c.positionMs : NaN, c ? +c.anchorMs : NaN, c && Number.isFinite(c.rate) ? c.rate : 1, c && c.mode === 'playing' ? 1 : 0, c && Number.isFinite(c.endMs) ? c.endMs : NaN, c && Number.isFinite(c.originMs) ? c.originMs : NaN, c && c.commanded === true ? 1 : 0, c && c.source === 'song' ? 1 : 0, h0) : NaN; }, pathMs(c, now, lag) { return typeof W.scene_time_path_ms === 'function' ? W.scene_time_path_ms(c ? 1 : 0, c ? +c.positionMs : NaN, c ? +c.anchorMs : NaN, c && Number.isFinite(c.rate) ? c.rate : 1, c && c.mode === 'playing' ? 1 : 0, c && Number.isFinite(c.endMs) ? c.endMs : NaN, c && Number.isFinite(c.originMs) ? c.originMs : NaN, now, Number.isFinite(lag) ? lag : NaN) : now; },
    /** one word of one agent's ref: its key (the ref's name past cua/agents/), its value (null: it left), the entry's stamp on the Nest's clock (this glass's
     *  own now on that clock when the entry carries none: a leave with no moment moves nothing, for no door reads a clock) -> whether it moved something */
    agent(key, value, ts) { const n = text(value); if (n < 0) return false; return W.scene_agent(S, name(key), n, stamp(ts)) === 1; },   /* THE COPY IS THE MODULE'S (Nov 12 2026, copy.rs): this glass's copy of the room, fed cause by cause: copyScene(scene/active's value), entity(the ref's name past scene/entities/, its value, its rev); copy(rows) -> { schema, hash, n, members, frame, dropped, moves, rows } or null on older bytes */ copyScene(value) { const n = text(value); return n >= 0 && typeof W.scene_copy_scene === 'function' && W.scene_copy_scene(S, n) === 1; }, entity(key, value, rev) { const n = text(value); return n >= 0 && typeof W.scene_entity === 'function' && W.scene_entity(S, name(key), n, num(rev)) === 1; }, copy(rows = 1) { const n = typeof W.scene_copy === 'function' ? W.scene_copy(S, rows ? 1 : 0) : 0; try { return n ? JSON.parse(DEC.decode(TXT.subarray(0, n))) : null; } catch { return null; } },
    /** the agents a keyframe read (their keys) and the read's moment: every other one has left */
    agentsKeep(keys, ts) { return W.scene_agents_keep(S, names(keys), stamp(ts)) === 1; },
    /** the program for the agents carried at now: who holds a glass first (the newest place first), then who sits at home (THE SEAT AT HOME: it
     *  said a name or parts and holds no glass; who has sat longest first), twelve chairs in all -> how many unit1s fly (unit1(i)); seated() says how many sit (home(i)) */
    program(now) { const r = W.scene_program(S, now); seated = r >>> 8; return r & 255; },
    /** the program for the agents a composer hands a glass (room.agents: { list } or the list; null: none), in their order, as NestBoard.html's
     *  twProgram lays it from that same list: no fold, no clock (the fold is not touched). On the cause that moved the list, never a frame.
     *  -> how many unit1s fly, as program(); -1 when the list is longer than the module reads (TXT): the caller keeps its own law for it */
    programOf(agents) { const n = text(agents); if (n < 0) return -1; const r = W.scene_program_list(S, n); seated = r >>> 8; return r & 255; },
    seated: () => seated,
    /** one unit1 that flies: { seat, name, chair, tone, t, gone, legs, named, w, ph }, or null past the list */
    unit1(i) { const n = W.scene_unit1(S, i); if (n < 0) return null; return { seat: String.fromCharCode(...U16.subarray(0, n)), name: OUT[18] ? String.fromCharCode(...U16.subarray(n, n + OUT[18])) : null, chair: OUT[0], tone: hexOf(OUT[1]), t: OUT[2], gone: OUT[3], legs: OUT[4], named: OUT[5], w: Array.from(OUT.subarray(6, 12)), ph: Array.from(OUT.subarray(12, 18)) }; },
    /** one that sits at home, by chair: { seat, name, chair, tone, named }, or null past the list (its unit1 is on its wire in the frame, its dots lit by its parts) */
    home(i) { const n = W.scene_home(S, i); if (n < 0) return null; return { seat: String.fromCharCode(...U16.subarray(0, n)), name: OUT[3] ? String.fromCharCode(...U16.subarray(n, n + OUT[3])) : null, chair: OUT[0], tone: hexOf(OUT[1]), named: OUT[2] }; },
    /** twEval: her figure at ms into scene.balls -> 13 */
    eval(ms) { return W.scene_eval(S, ms); },
    /** twDots: the twelve dots round each ball of scene.balls -> how many (scene.dotsOf(n)) */
    dots(ms) { return W.scene_dots(S, ms); },
    /** twHeld: ['seat@glass', ...] */
    held(ms) { const n = W.scene_held(S, ms); return n ? DEC.decode(TXT.subarray(0, n)).split('\n') : []; },
    rigLine(line) { const n = text(line); return n < 0 ? -1 : W.scene_rig_line(S, n); }, cones(world) { const n = text(world); return n > 0 && W.scene_cones(S, n) >= 0 ? new Float32Array(W.memory.buffer, W.scene_cones_out(S), W.scene_cones_out_len()) : null; },   // rigLine: THE GLASSES READ THE BODY (Nov 2 2026): one line of the glass's body stream (/body/stream of its own door, the JSON with the datagram's b64) handed whole -> the bodies it rebuilt (0 or more), -1 for a line with no datagram; cones: THE CONES (Nov 3 2026, embertide-scene cones.rs): {lamp, eyes, walls} as the Nest holds them -> [count, stride, then a stride a polygon: kind (0 doubt, 1 seen, 2 both), eye, eye or -1, wall, vertices, (x, y) in the lamp's px]
    rigAt(ms) { if (!W.scene_rig_state(S)) return null; const st = { seq: OUT[0], ms: OUT[1], count: nul(OUT[2]), bones: OUT[3], chi2: OUT[4], taken: OUT[5], recovered: OUT[6], frame: OUT[7] }; const n = W.scene_rig_at(S, ms); return { ...st, n, j: OUT.subarray(0, 68), speed: OUT[68] }; },   // what this glass holds of him and his joints at the house instant, one ask (speed: the fastest joint's, m/s): the wire sequence, the entity's instant (ms, before the step), the music's count, the bones held, the last residual's chi2, the datagrams taken, the bodies rebuilt from parity, the frame's hash; n the joints known, j OUT[4 j .. 4 j + 4] x, y, z (m, NaN unseen), sigma (m) in rig.rs JOINTS' order, the one step from the entity; null with no entity
    /** twChair: chair `seat` of hers at ms */
    chair(seat, ms) { W.scene_chair(S, seat, ms); return v3(); },
    glassList(ask) { if (typeof W.scene_glass_list !== 'function') return null; const b = ENC.encode(JSON.stringify(ask)), n = W.scene_glass_list_txt_len(), t = new Uint8Array(W.memory.buffer, W.scene_glass_list_txt(), n); if (b.length > n) return null; t.set(b); const k = W.scene_glass_list(b.length); return k ? JSON.parse(DEC.decode(t.subarray(0, k))) : null; },   /* ONE GLASS (glass_list.rs): a glass's whole list at a stamp, the game under the asker's rule ("asker": "board": the Board's own, THE FIRE, Nov 16 2026) */
    lawText() { return typeof W.scene_law_text === 'function' ? JSON.parse(DEC.decode(new Uint8Array(W.memory.buffer, W.scene_law_text(), W.scene_law_text_len()))) : null; }, axes(m) { if (typeof W.scene_her_axes !== 'function') return null; const i = new Float64Array(W.memory.buffer, W.scene_her_axes_in(), 14), q = Array.isArray(m.rot) && m.rot.length === 4 ? m.rot : null, a = Array.isArray(m.axes) && m.axes.length === 3 ? m.axes : null; i[0] = num(m.yaw); for (let k = 0; k < 4; k++) i[1 + k] = q ? num(q[k]) : NaN; for (let k = 0; k < 9; k++) { const v = a && Array.isArray(a[k / 3 | 0]) ? a[k / 3 | 0] : null; i[5 + k] = v ? num(v[k % 3]) : NaN; } if (!W.scene_her_axes()) return null; const o = new Float64Array(W.memory.buffer, W.scene_her_axes_out(), 9); return [[o[0], o[1], o[2]], [o[3], o[4], o[5]], [o[6], o[7], o[8]]]; },   /* THE LAW SAYS ITS NUMBERS (law_text.rs) and a glass's axes (scene_her_axes: its axes, else its rotation, else its yaw) */
    herWires(cm = true, n = 128) { if (typeof W.scene_her_wires !== 'function' || !W.scene_her_wires(cm ? 1 : 0, n)) return null; const o = new Float64Array(W.memory.buffer, W.scene_her_wires_out(), 12 * (n + 1)); return [0, 1, 2, 3].map((l) => Array.from({ length: n + 1 }, (_, i) => { const k = 3 * (l * (n + 1) + i); return [o[k], o[k + 1], o[k + 2]]; })); }, herWireYaw: (lane, bars) => W.scene_her_wire_yaw(lane, bars), herFlash: (barPhase) => W.scene_her_flash(barPhase), herWorld(o, c, yaw, s) { return W.scene_her_world(o[0], o[1], o[2], c[0], c[1], c[2], yaw, s) === 1 ? Array.from(new Float64Array(W.memory.buffer, W.scene_her_world_out(), 3)) : null; }, chairAt(H, seat, ms) { if (typeof W.scene_her_chair_at !== 'function') return null; IN.set([H.c[0], H.c[1], H.c[2], H.yaw, H.s], 0); return W.scene_her_chair_at(S, seat >>> 0, ms) === 1 ? [v3(), v3(3)] : null; },   /* HER WIRES (her_wires.rs, THE FIRE, Nov 16 2026): the wires at azimuth 0 by lane, their turn, their flash on the one, a point of her frame in the room; chairAt: a chair of hers about her place handed in, and her body, in the frame's unit, on the scene's clock and song */
    hash(s) { return W.scene_hash(S, name(s)) >>> 0; },   // ---- the laws that hold no scene ----
    /** THE MODULE IS ONE LAW (Nov 7 2026): the identity of the law these bytes carry (scene_law_id: blake3 over the crate's sources, 16 hex, the same on every target); null on a module older than the door. A glass says it in its lens; module-word.rs compares it with the Nest's scene/module */
    lawId() { return typeof W.scene_law_id === 'function' ? DEC.decode(new Uint8Array(W.memory.buffer, W.scene_law_id(), W.scene_law_id_len())) : null; },
    gait(s) { W.scene_gait(S, name(s)); return { w: [OUT[0], OUT[1], OUT[2], OUT[3], OUT[4], OUT[5]], ph: [OUT[6], OUT[7], OUT[8], OUT[9], OUT[10], OUT[11]] }; },
    /** twChairs(seats, home), chairsOf(seats, {taken}): { seat: chair }. seats: who holds a glass; home: who sits at home, who has sat longest first (they
     *  take the chairs left, in their own order); taken: chairs that are not free (her eyes, on a glass that draws her whole body). null: more than
     *  64 of either, more than the door reads (a glass hands it the twelve it carries) */
    chairs(seats, { home = [], taken = [], pins = null, asking = null } = {}) { const all = [...seats, ...home]; if (seats.length > CHAIRS_IN || home.length > CHAIRS_IN || names(all) !== all.length) return null; let mask = 0; for (const k of taken) if (Number.isInteger(k) && k >= 0 && k < 12) mask |= 1 << k;
      // THE CHAIR IS PINNED ON THE SEAT (Oct 26 2026): pins {seat: {chair, at}} into IN[2i], IN[2i + 1] a record (32 fit), the pinned door; a .wasm without it (an older build) seats by hash
      const pinned = pins && typeof pins === 'object' && typeof W.scene_chairs_pinned === 'function';
      if (pinned) for (let i = 0; i < all.length && 2 * i + 1 < IN.length; i++) { const p = pins[all[i]]; const c = p && Number.isInteger(p.chair) && p.chair >= 0 && p.chair < 12 ? p.chair : -1; IN[2 * i] = c; IN[2 * i + 1] = c >= 0 && Number.isFinite(p.at) ? p.at : 0; }
      const asks = Array.isArray(asking) && asking.length && typeof W.scene_chairs_asking === 'function' ? [...new Set(asking)].map((s) => all.indexOf(s)).filter((r) => r >= 0) : [], end = all.reduce((a, s) => a + 1 + String(s).length, 0);   // EVERY ASKER KEEPS ITS CHAIR: after the names, how many wait on his word and each one's record (the one waiting longest first)
      if (asks.length && end + 1 + asks.length <= U16.length) { for (let i = 0; i < 2 * all.length && i < IN.length; i++) IN[i] = pinned ? IN[i] : (i % 2 ? 0 : -1); U16[end] = asks.length; asks.forEach((r, k) => { U16[end + 1 + k] = r; }); W.scene_chairs_asking(S, seats.length, home.length, mask); } else if (pinned) W.scene_chairs_pinned(S, seats.length, home.length, mask); else W.scene_chairs(S, seats.length, home.length, mask);
      const out = {}; for (let i = 0; i < all.length; i++) if (OUT[i] >= 0) out[all[i]] = OUT[i]; return out; },
    tone(seat) { return hexOf(W.scene_tone(seat)); },
    rigPhase(id, dur, sec) { return W.scene_actor_phase(W.scene_u16(S), name(id), dur, sec); },   // rigPhase (actor.rs phase): the clock plus a fixed offset from the id, in the clip; no actor needed (THE WINDOWS POSE BY THE MODULE)
    unit2(seat, chair, bars) { W.scene_unit2(S, seat, chair, bars); return v3(); },
    // ---- a unit1's flight piece by piece, for a glass that lays its own way (one-agents.mjs): metres, or centimetres when cm is said. A plane is
    // {c, r, u, n, w, h} (one-law.mjs planeOf), a gait {w, ph} (gait()), a place {what, at, to, box} (agentOf's). No piece reads or moves the scene;
    // each answers in OUT[0..6], as chair() and her() do, so none is called between an eval() and the dots() that reads its balls (eval32 is OUT32's).
    /** twOn: the place on a plane at x, y (shares from its top left) and `out` before it */
    on(pl, x, y, out = 0) { plane(pl); W.scene_on(S, x, y, out); return v3(); },
    gather(pl, eye, chair, taken = 0) { plane(pl); IN.set(eye, 14); W.scene_gather(S, chair >>> 0, taken >>> 0); return OUT[3] === 1 ? v3() : null; },   // THE UNIT1S GATHER (gather.rs): chair's slot in the glass his word names, for his eye; taken: bit k, chair k
    /** twTarget: where a place puts its unit1 on a plane -> { p, sit (1: an act sits there), q (the point on the glass, shares) } */
    target(pl, place, cm = false) { plane(pl); pair(place.at, 14); pair(place.to, 16); const b = place.box, ok = Array.isArray(b) && b.length >= 4;
      for (let i = 0; i < 4; i++) IN[18 + i] = ok ? b[i] : NaN;
      W.scene_target(S, cm ? 1 : 0, place.what === 'act' ? 1 : 0); return { p: v3(), sit: OUT[3], q: [OUT[4], OUT[5]] }; },
    // ---- THE FLIGHT IS DERIVED FROM THE SPACE (Nov 7 2026, flight_of.rs): a seat's flight laid whole by the module from the space at the stamp. A shape is
    // his fact cua/paths/shape ({rise_share, bend, along, out_m, speed_m_s, min_s, max_s, link_bars}; a number unsaid is the law's). ----
    /** flightOf({ glass, home, eye, cage, grid, start_ms, chair, end, from, shape, since, old }) -> { points: [{ p, code, bars }], t0_beat, seconds, beats, bars, eye,
     *  head, cage, height_m, from ('path' | 'home' | 'given'), from_idx, end, sit } or { why }; end { kind: 'point' | 'fact' | 'totem' | 'gather' | 'hand', p, act, at, to, box }
     *  (gather: p his eye at the word), old: the path that stands (its points, grid, t0_beat; `inside` the indices labelled inside her glass) */
    flightOf({ glass, home = null, eye = null, cage = null, grid = null, start_ms, chair = null, end, from = null, shape = null, since = null, old = null } = {}) {
      if (typeof W.scene_flight_of !== 'function') return undefined;
      IN.fill(NaN); if (glass) plane(glass); if (home) plane(home, 14); const p3 = (v, at) => { if (Array.isArray(v)) IN.set(v.map(num), at); };
      p3(eye, 28); IN[31] = num(cage && cage.floor_y); IN[32] = num(cage && cage.ceiling_y); const g = grid || {}; IN[33] = num(g.epoch_ms); IN[34] = num(g.beat_ms); IN[35] = num(g.beats_per_bar);
      IN[36] = num(start_ms); IN[37] = Number.isInteger(chair) ? chair : NaN; IN[38] = ['point', 'fact', 'totem', 'gather', 'hand'].indexOf(end.kind); p3(end.p, 39); IN[42] = end.act ? 1 : 0;
      pair(end.at, 43); pair(end.to, 45); if (Array.isArray(end.box) && end.box.length >= 4) IN.set(end.box.slice(0, 4).map(num), 47);
      if (from) { p3(from.p, 51); IN[54] = from.inside ? 1 : 0; } SHAPE_KEYS.slice(0, 7).forEach((k, i) => { IN[55 + i] = num(shape && shape[k]); }); IN[62] = num(since);
      IN[63] = old ? (old.inside || []).reduce((m, j) => m + 2 ** j, 0) : 0; const k = old ? pathIn(old) : 0; if (k < 0) return { why: 'the path that stands is no path' };
      const n = W.scene_flight_of(S, k, arcOf(shape)); if (n < 0) return { why: 'no plane for the glass' };
      if (n === 0) return { why: ['', 'no end', 'no slot: it is not seated, or his eye was not before the glass', 'nowhere it leaves from', 'no moment'][OUT[0]] };
      const points = []; for (let i = 0; i < n; i++) { const o = 20 + 5 * i; points.push({ p: v3(o), code: OUT[o + 3], bars: OUT[o + 4] }); }
      return { points, t0_beat: OUT[1], seconds: OUT[2], beats: OUT[3], bars: OUT[4], eye: v3(5), head: OUT[8] === 1, cage: OUT[9] === 1, height_m: nul(OUT[10]), from: ['path', 'home', 'given'][OUT[11]], from_idx: nul(OUT[12]), end: v3(13), sit: OUT[16] === 1 };
    },
    /** THE TOTEM: a unit1's hold over a plane at its chair -> { p, across_m }; handHold(pl, at): where his hand's drop at `at` (shares) holds */
    totem(pl, chair) { plane(pl); return W.scene_totem(S, num(chair)) ? { p: v3(), across_m: OUT[3] } : null; },
    handHold(pl, at) { plane(pl); pair(at, 14); return W.scene_hand_hold(S) ? { p: v3(), across_m: OUT[3] } : null; },   offGlass(was, now, p) { if (!was || !now || !Array.isArray(p) || typeof W.scene_off_glass !== 'function') return null; plane(was); plane(now, 14); IN.set(p, 28); return W.scene_off_glass(S) ? { d_m: OUT[0], off: OUT[1] === 1 } : null; },   acrossOf(asks) { return typeof W.scene_across === 'function' ? W.scene_across(asks ? 1 : 0) : null; },   // A RESTING UNIT1 FOLLOWS ITS GLASS (way.rs off_glass): how far its glass, moved, carries a flight's end; acrossOf: THE ASKING UNIT1 IS TWICE A RESTING ONE (way.rs across_of, two thirds)
    handShot(from, x, speed = NaN, g = NaN) { if (typeof W.scene_hand_shot !== 'function') return null; IN.fill(NaN, 0, 6); IN.set(from, 0); IN.set(x, 3); return W.scene_hand_shot(S, speed, g) ? { v: v3(), s: OUT[3], speed_mps: OUT[4], g: OUT[5] } : null; },   /* THE SHOT (hand_aim.rs): the parabola from his hand to the hit, there when the straight line would be; null with no door */ totemLine(pl, chair, across_m = NaN) { if (typeof W.scene_totem_line !== 'function') return null; plane(pl); return W.scene_totem_line(S, num(chair), num(across_m)) ? { p: v3(), across_m: OUT[3], at: [OUT[4], OUT[5]] } : null; },   // THE GRAB TAKES THE TOTEM (ffi.rs scene_totem_line): a unit1's spot in THE TOTEM LINE before plane pl at its chair, `at` its shares on the glass; null with no door (older bytes), no plane or no chair
    /** THE ONE ARC: the top of the arc from a to b under a ceiling (NaN: none) by his shape; flightBars(a, b, shape, grid) -> { seconds, bars }; sharedBars(ways, total) -> bars a leg */
    apex(a, b, ceiling_y, shape) { ends(a, b, 0); IN[6] = num(ceiling_y); SHAPE_KEYS.slice(0, 7).forEach((k, i) => { IN[7 + i] = num(shape && shape[k]); }); IN[14] = arcOf(shape); W.scene_apex(S); return v3(); },
    flightBars(a, b, shape, grid) { ends(a, b, 0); SHAPE_KEYS.slice(0, 7).forEach((k, i) => { IN[6 + i] = num(shape && shape[k]); }); const g = grid || {}; IN[13] = num(g.epoch_ms); IN[14] = num(g.beat_ms); IN[15] = num(g.beats_per_bar); W.scene_flight_bars(S); return { seconds: OUT[0], bars: OUT[1] }; },
    sharedBars(ways, total) { IN.set(ways.map(num)); const n = W.scene_shared_bars(S, ways.length, num(total)); return Array.from(OUT.subarray(0, n)); },
    /** his shape inside its bounds -> { ...the eight numbers, his: 'shape' | 'law' }; shapeAt(a, b, top, ceiling_y, was): the shape his drag of the top says */
    shapeOf(f) { SHAPE_KEYS.forEach((k, i) => { IN[i] = num(f && f[k]); }); IN[8] = arcOf(f) || NaN; W.scene_shape_of(S); return shapeOut(OUT[8] === 1); },
    shapeAt(a, b, top, ceiling_y, was) { ends(a, b, 0); IN.set(top.map(num), 6); IN[9] = num(ceiling_y); SHAPE_KEYS.forEach((k, i) => { IN[10 + i] = num(was && was[k]); }); IN[18] = arcOf(was); W.scene_shape_at(S); return shapeOut(true); },
    /** airOf: where a unit1 holds a plane, over its top edge and a little before it */
    airOf(pl, cm = false) { plane(pl); W.scene_air_of(S, cm ? 1 : 0); return v3(); },
    /** twDur: a flight's seconds from a to b */
    dur(a, b, cm = false) { ends(a, b, 0); return W.scene_dur(S, cm ? 1 : 0); },
    /** twFly: a unit1 of gait g on its flight from F to T at e (0..1 of its way) */
    fly(g, F, T, e, cm = false) { gaitIn(g); ends(F, T, 12); W.scene_fly(S, cm ? 1 : 0, e); return v3(); },
    /** twDrift: a unit1 of gait g holding about c at t (seconds of the house time) */
    drift(g, c, t, cm = false) { gaitIn(g); IN[12] = c[0]; IN[13] = c[1]; IN[14] = c[2]; W.scene_drift(S, cm ? 1 : 0, t); return v3(); },
    // ---- THE WAY ON EVERY GLASS (Oct 28 2026, embertide-scene/src/way.rs; LANDING.md 14): one-agents.mjs travellersAt in the module. The way holds its
    // own state (her program, the glasses, the agents' table), fed on a cause; travellers(ms) answers any moment. A call that answers -1 (or false) holds
    // nothing of that cause: the caller keeps its own law for it (way.rs WHAT IS NOT HELD). ----
    /** her program for the way (the ref's value, or null) -> 1 held, 0 none that places her, -1 not held */
    wayProgram(value) { const n = text(value); return n < 0 ? -1 : W.scene_way_program(S, n); },
    /** the way's glasses of one kind (own: false her program's, true the glass's own), {seat: plane} with planes as one-law.mjs planeOf makes them
     *  ({c, r, u, n, w, h}) -> whether every one is held */
    wayGlasses(own, planes) { const k = own ? 1 : 0; W.scene_way_glasses_clear(S, k);
      for (const [seat, pl] of Object.entries(planes || {})) { if (seat.length > 48) return false; plane(pl); if (W.scene_way_glass(S, k, name(seat)) < 0) return false; } return true; },
    /** the agents for the way (travellersAt's list, as the follower holds them) and her chairs that are not free -> how many the table holds, -1 none */
    wayAgents(agents, taken = []) { let mask = 0; for (const k of taken || []) if (Number.isInteger(k) && k >= 0 && k < 12) mask |= 1 << k;
      let n; try { n = text(agents); } catch { return -1; } return n <= 0 ? -1 : W.scene_way_agents(S, n, mask); },
    /** travellersAt at ms (the house time) on what the way holds -> { moving, wake_ms, list: [{ index (the agent's in the list handed), chair, asks, p, at, to,
     *  k, moving, out, sit, across_m, inside, until, act, t }] }, by chair */
    /** THE CHAIRS ARE THE WAY'S (way.rs chairs_at): the chairs the way seats the agents it holds on at ms, its program not asked -> [[index in the list handed, chair]], the newest first */
    wayChairs(ms) { const n = W.scene_way_chairs(S, ms), out = []; for (let k = 0; k < n; k++) out.push([OUT[2 * k], OUT[2 * k + 1]]); return out; },
    travellers(ms) {   // THE WAY HOLDS AT THE TOTEM (way.rs, Nov 7 2026): the way's own answer is what every glass draws
      const n = W.scene_travellers(S, ms), list = []; let at = 0;
      const rec = () => { const len = U16[at], s = len ? String.fromCharCode(...U16.subarray(at + 1, at + 1 + len)) : ''; at += 1 + len; return s; };
      for (let i = 0; i < n; i++) {
        const o = WAY_AT + i * WAY_STRIDE, a = rec(), b = rec();
        list.push({ index: OUT[o], chair: OUT[o + 1], asks: OUT[o + 2] === 1, p: [OUT[o + 3], OUT[o + 4], OUT[o + 5]], at: wayWord(OUT[o + 13], a), to: OUT[o + 14] < 0 ? null : wayWord(OUT[o + 14], b),
          k: OUT[o + 6], moving: OUT[o + 7] === 1, out: OUT[o + 8], sit: OUT[o + 9], across_m: OUT[o + 10], inside: OUT[o + 11] === 1, until: nul(OUT[o + 12]), act: OUT[o + 15] === 1, t: nul(OUT[o + 16]) });
      }
      return { moving: OUT[0] === 1, wake_ms: nul(OUT[1]), list };
    },
    /** THE WAY ENTERS THE PICTURE (Oct 28 2026, way.rs enter; LANDING.md 16): the ms from now until a unit1 on its way first stands in this glass's picture
     *  (plane {c, r, u, n, w, h} as one-law.mjs planeOf makes it, the eye before it, W x H css px, rect {x, y, w, h} in shares or null), on what the way
     *  holds, sampled every step_ms (50) up to horizon_ms (3000) -> ms (0: one stands there now; the horizon itself: none by then, the glass sleeps until then), or null: no eye before the glass,
     *  no plane, or a module without the door */
    wayEnter({ now = NaN, plane: pl = null, eye = null, W: w = 0, H: h = 0, rect = null, step_ms = NaN, horizon_ms = NaN } = {}) {
      if (typeof W.scene_way_enter !== 'function' || !pl || !Array.isArray(pl.c) || !Array.isArray(pl.r) || !Array.isArray(pl.u) || !Array.isArray(pl.n) || !Array.isArray(eye)) return null;
      plane(pl); IN[14] = eye[0]; IN[15] = eye[1]; IN[16] = eye[2];
      if (rect) { IN[17] = rect.x; IN[18] = rect.y; IN[19] = rect.w; IN[20] = rect.h; IN[21] = 1; } else { IN[17] = IN[18] = IN[19] = IN[20] = NaN; IN[21] = 0; }
      const n = (v) => (typeof v === 'number' ? v : NaN);
      return nul(W.scene_way_enter(S, n(now), n(w), n(h), n(step_ms), n(horizon_ms)));
    },
    /** wordOf: one word of an agent's ref as the composer takes it: { agent, placed, since }: agentOf(value) (placed) or seatedOf(value) (it says no place
     *  and a name or parts), and `since` when the value says a number; null: neither */
    wordOf(value) {
      const n = text(value), code = n > 0 ? W.scene_agent_read(S, n) : 0; if (!code) return null;
      const place = (o, glass) => { const pair = (i) => (OUT[i] === OUT[i] ? [OUT[i], OUT[i + 1]] : null); return { glass: glass || null, what: OUT[o + 1] ? 'act' : 'look', at: pair(o + 2), to: pair(o + 4), box: OUT[o + 6] === OUT[o + 6] ? [OUT[o + 6], OUT[o + 7], OUT[o + 8], OUT[o + 9]] : null, t: OUT[o] }; };
      const nt = OUT[10], np = OUT[11], since = nul(OUT[13]), w = records(5 + nt + np), parts = [];
      for (let i = 0; i < np; i++) { const p = { name: w[5 + nt + i], state: ['waiting', 'working', 'done'][OUT[48 + 2 * i] - 1] }; if (OUT[49 + 2 * i] >= 0) p.chair = OUT[49 + 2 * i]; parts.push(p); }
      const said = { ...(w[4] ? { name: w[4] } : {}), ...(np ? { parts } : {}) };
      if (code === 2) return { agent: { seat: w[0], ...said }, placed: false, since };
      const a = { seat: w[0], ...place(0, w[1]), tool: w[2] || null, app: w[3] || null, trail: [], ...said };
      for (let i = 0; i < nt; i++) a.trail.push(place(16 + 10 * i, w[5 + i]));
      return { agent: a, placed: true, since };
    },
    /** agentOf: a ref's value re-typed, as room-board-state.mjs gives it: an agent with a place (null: none) */
    agentOf(value) { const w = scene.wordOf(value); return w && w.placed ? w.agent : null; },
    /** seatedOf: the value as an agent seated at home: { seat, name?, parts? } when it says a name or parts (null: neither) */
    seatedOf(value) { const w = scene.wordOf(value), a = w && w.agent; return a && (a.name || a.parts) ? { seat: a.seat, ...(a.name ? { name: a.name } : {}), ...(a.parts ? { parts: a.parts } : {}) } : null; },
    /** the module's own exports and its scene, for a proof */
    raw: () => ({ W, S, IN, OUT, OUT32, TXT, U16 }),
    /** THE MUSIC FIELD (Oct 17 2026, embertide-scene/src/field.rs): the field's doors on this module, a state of their own beside the scene (fieldDoors below) */
    field: fieldDoors(W),
  };
  return scene;
}
// ---- THE MUSIC FIELD'S DOORS (Oct 17 2026; his "our bible is iroh + wasm synced in laplace domain"). field.rs holds what NestBoard.html's MUSIC-FIELD-CORE and
// SPATIAL-MATH said, word for word (the program as the Board places it, the field at one instant, the still field and its lines, the song's conditioning), behind
// doors of the flock's shape: field_this() is the module's own field, every door answers in its OUT; no door reads a clock. The calls answer what that text
// answered (mfProgram, mfAt, mfLevel, mfMap, mfIso, mfVerbAt, mfBeat, mfCondition, lyricElapsed, spatialAt), in the same shapes. The text left the page on Nov 2
// 2026 (the Board draws the field by these doors alone); its answers stand in embertide-scene/tests/field.json, and field-wasm.test.mjs holds the bytes to them. ----
const FD_VERBS = ['still', 'pulse', 'rise', 'fall', 'gather', 'scatter', 'spin', 'drift', 'burst', 'fade'], FD_KIND = ['none', 'still', 'orbit', 'path', 'other'], FD_PLACED = ['screen', 'program', 'listener'];
const fdHex6 = (n) => (n === n ? '#' + (n >>> 0).toString(16).toUpperCase().padStart(6, '0') : null);
function fieldDoors(W) {
  const F = W.field_this(), mem = W.memory.buffer, enc = new TextEncoder();
  const TXT = new Uint8Array(mem, W.field_txt(F), W.field_txt_len()), U = new Uint16Array(mem, W.field_u16(F), W.field_u16_len()), SCR = new Float64Array(mem, W.field_scr(F), W.field_scr_len());
  const O = new Float64Array(mem, W.field_out(F), W.field_out_len()), XS = new Float64Array(mem, W.field_xs(F), W.field_xs_len()), ZS = new Float64Array(mem, W.field_zs(F), W.field_zs_len());
  const A2 = new Float64Array(mem, W.field_a2(F), W.field_a2_len()), DB = new Float64Array(mem, W.field_db(F), W.field_db_len()), SEGS = new Float64Array(mem, W.field_segs(F), W.field_segs_len());
  const STRIDE = W.field_stride(), HEAD = 8, nul = (x) => (x === x ? x : null);
  const put = (value) => { const t = typeof value === 'string' ? value : JSON.stringify(value === undefined ? null : value); const r = enc.encodeInto(t, TXT); return r.read === t.length && r.written < TXT.length ? r.written : -1; };
  const names = (n) => { const out = []; let at = 0; for (let k = 0; k < n; k++) { const len = U[at]; out.push(String.fromCharCode(...U.subarray(at + 1, at + 1 + len))); at += 1 + len; } return out; };
  let seatNames = [];
  const seatRow = (i) => O.subarray(HEAD + i * STRIDE, HEAD + (i + 1) * STRIDE);
  const field = {
    /** mfProgram(v, screens, floorY): room.music's value, the screens (cm, the floor at 0), the floor (metres) -> P, or null when v is no object */
    program(v, screens, floorY) {
      const len = put(v); let ns = 0, at = 0;
      for (const m of screens || []) {
        if (!m || typeof m.id !== 'string' || !Array.isArray(m.c) || m.c.length !== 3 || !m.c.every((x) => typeof x === 'number' && isFinite(x)) || ns >= SCR.length / 3) continue;
        const id = m.id.slice(0, 48); if (at + 1 + id.length > U.length) break;
        U[at] = id.length; for (let k = 0; k < id.length; k++) U[at + 1 + k] = id.charCodeAt(k); at += 1 + id.length;
        SCR[3 * ns] = m.c[0]; SCR[3 * ns + 1] = m.c[1]; SCR[3 * ns + 2] = m.c[2]; ns++;
      }
      const n = len < 0 ? 0 : W.field_program(F, len, ns, typeof floorY === 'number' && isFinite(floorY) ? floorY : NaN);
      if (len < 0 || !O[7]) { seatNames = []; return null; }
      seatNames = names(n);
      const seats = seatNames.map((seat, i) => { const r = seatRow(i); return { seat, x: [r[0], r[1], r[2]], gain: r[3], mute: r[4] === 1, on: r[5] === 1, placed: FD_PLACED[r[6]] }; });
      // the name: the program's own word (mfProgram's `p ? p.name : 'none'`: a name the law does not run is still the ref's; the module says `other` of it)
      // p: the law's program as the value says it (mfProgram's `p`): the page reads its orbit, its path's points and its floor to draw them, nothing of the law
      return { p: O[5] === 0 ? null : v.spatial, live: O[0] === 1, listener: [O[1], O[2], O[3]], heard: O[4] === 1 ? 'program' : 'sofa', name: O[5] === 0 ? 'none' : v.spatial.name, kind: FD_KIND[O[5]], playing: O[6] === 1, seats, title: v && typeof v.title === 'string' ? v.title : '', bytes: true };
    },
    /** mfAt(P, houseMs) on the program last placed -> { src, e, dmin, seats } */
    at(houseMs) {
      const n = W.field_at(F, houseMs);
      const seats = []; for (let i = 0; i < n; i++) { const r = seatRow(i); seats.push({ seat: seatNames[i], x: [r[0], r[1], r[2]], law: r[3], adv: r[4], d: nul(r[5]), loud: r[6], gain: r[7], mute: r[8] === 1, on: r[9] === 1, placed: FD_PLACED[r[10]] }); }
      return { src: O[0] === 1 ? [O[1], O[2], O[3]] : null, e: O[4], dmin: nul(O[5]), seats };
    },
    /** mfLevel at a point (Station metres) from the seats as the last at() read them */
    level(p) { return W.field_level(F, p[0], p[1], p[2]); },
    /** mfMap(seats, bounds, floorY) from the seats as the last at() read them -> the map, its lines at MF_ISO's levels (mfMap's shape) */
    map(bounds, floorY) {
      const n = W.field_map(F, bounds.x0, bounds.x1, bounds.z0, bounds.z1, typeof floorY === 'number' && isFinite(floorY) ? floorY : NaN);
      const nx = O[0], nz = O[1], max = O[3], imax = O[4];
      const m = { nx, nz, cell: O[2], xs: Array.from(XS.subarray(0, n ? nx + 1 : 0)), zs: Array.from(ZS.subarray(0, n ? nz + 1 : 0)), a2: Array.from(A2.subarray(0, n)), db: Array.from(DB.subarray(0, n)), max, imax, iso: [] };
      if (max > 0) for (const t of [-6, -12, -18]) m.iso.push({ db: t, segs: field.iso(t) });
      return m;
    },
    /** mfIso at a level (dB) on the last map -> [[[x0, z0], [x1, z1]], ...] (cm) */
    iso(t) { const n = W.field_iso(F, t), segs = []; for (let i = 0; i < n; i++) segs.push([[SEGS[4 * i], SEGS[4 * i + 1]], [SEGS[4 * i + 2], SEGS[4 * i + 3]]]); return segs; },
    /** room.graphic's value -> true when read (an object) */
    graphic(G) { const len = put(G); return len >= 0 && W.field_graphic(F, len) === 1; },
    /** mfVerbAt(G, e) on the graphic last read */
    verbAt(e) { W.field_verb_at(F, e); return { verb: FD_VERBS[O[0]], w: O[1], line: O[2], section: O[3], t_ms: nul(O[4]), light: nul(O[5]) }; },
    /** mfBeat(G.grid, houseMs, holdMs) on the graphic last read, or null */
    beat(houseMs, holdMs) { return W.field_beat(F, houseMs, typeof holdMs === 'number' ? holdMs : NaN) ? { phase: O[0], beat: O[1], one: O[2] === 1, env: O[3] } : null; },
    /** lyricElapsed(G.song, houseMs, holdMs) on the graphic last read, or null */
    elapsed(houseMs, holdMs) { return nul(W.field_elapsed(F, houseMs, typeof holdMs === 'number' ? holdMs : NaN)); },
    /** mfCondition(G, houseMs, holdMs) on the graphic last read, or null */
    condition(houseMs, holdMs) {
      if (!W.field_condition(F, houseMs, typeof holdMs === 'number' ? holdMs : NaN)) return null;
      const pal = O[6] === O[6] || O[7] === O[7] || O[8] === O[8] ? [fdHex6(O[6]), fdHex6(O[7]), fdHex6(O[8])] : null;
      return { verb: FD_VERBS[O[0]], w: O[1], line: O[2], section: O[3], light: nul(O[4]), e: O[5], palette: pal, beat: O[9] === 1 ? { phase: O[10], beat: O[11], one: O[12] === 1, env: O[13] } : null, pool: O[14], stem: O[15], alpha: O[16], dash: O[17], flash: O[18], lift: O[19], gather: O[20], flock: [O[21], O[22]] };   // flock: THE FLOCK'S EASE IS A LOOKUP, its gather and lift as drawn at this instant (field.rs flock_ease)
    },
    /** spatialAt(p, seat, seq, ts) on the program last placed (a proof's door) */
    spatialAt(seat, seq, ts) {
      const s = String(seat == null ? '' : seat).slice(0, 48); for (let k = 0; k < s.length; k++) U[k] = s.charCodeAt(k);
      const on = W.field_spatial_at(F, s.length, typeof seq === 'number' ? seq : NaN, typeof ts === 'number' ? ts : NaN) === 1;
      return on ? { on: true, advance_ms: O[1], gain: O[2], t: O[3], e: O[4], d_m: O[5], d_max_m: O[6], d_min_m: O[7], src: [O[8], O[9], O[10]] } : { on: false, advance_ms: O[1], gain: O[2], t: null };
    },
    VERBS: FD_VERBS,
  };
  return field;
}

/** THE RIG'S POSE IS THE MODULE'S (Nov 4 2026, embertide-scene/src/actor.rs): an actor, a rigged body and its clips, in an instance of its own (its GLB and its work in that instance's memory): the
 *  Board's rig law (rigParse, rigPose, rigClipFor, rigDur, rigPhase, the clip road) word for word. actor(bytes, { clips }) -> { N, joints, n, nv, idle, P, NB, UV, JI, W, tri, parts, images, JM, gpu(), clips(),
 *  clipName(c), clipIndex(name), clipFor(name, walking), dur(c), phase(id, dur, sec), pose(c, t) -> Float32Array (16 a joint), bounds() -> [x0, y0, z0, x1, y1, z1], clip(name, text, ms), skin(lay), wear(a) }; a clip c is its index, -1 the walk, -2 the bind pose;
 *  clips: room for the road's (THE ROOM IS THE HOST'S, actor.rs parse_room: 512 clips, 65,536 channels, 16 MB of keys; else the file's own, 128 and 4,096). THE WINDOWS POSE BY THE MODULE (Nov 4 2026): skin(lay) is sim-bodies.mjs's skinInto (actor.rs skin):
 *  every vertex's place and unit normal at the last pose, laid by lay (17 numbers: the turn's cosine and sine, the place, the affine's 9 and 3; none: as bound) -> Float32Array, 6 a vertex; wear(a): this body takes actor a's pose (a dressed body on the rig's bones); worn(j, yaw, h): this body worn by his joints (THE COSTUME IS WORN BY HIS RIG); lod(cells): its triangles cut for a flat glass;
 *  actorNow(bytes, { clips }) is actor() at once, on the module instantiate() compiled (a parse in a fetch's wake). */
let BYTES = null, MOD = null;
const bytesOf = (b) => (b instanceof Uint8Array ? b : new Uint8Array(b));
async function actor(bytes, { clips = false, admitOnly = false } = {}) { const { exports } = await WebAssembly.instantiate(MOD || (MOD = await WebAssembly.compile(BYTES)), {}); return actorOf(exports, bytesOf(bytes), clips, admitOnly); }
function actorNow(bytes, { clips = false } = {}) { if (!MOD) throw new Error('the module is not compiled yet'); return actorOf(new WebAssembly.Instance(MOD, {}).exports, bytesOf(bytes), clips); }
function actorOf(x, u, clips, admitOnly = false) {
  const at8 = (n) => Math.ceil(n / 8) * 8, enc = new TextEncoder(), dec = new TextDecoder(), m = x.memory, room = (n) => { if (m.buffer.byteLength < n) m.grow(Math.ceil((n - m.buffer.byteLength) / 65536)); };
  const out = at8(m.buffer.byteLength), glb = out + 192, wk = at8(glb + u.length), H = () => new Uint32Array(m.buffer, wk, 48), cap = clips ? [512, 65536] : [128, 4096], keys = clips ? 16 << 20 : 0;   // out holds 24 numbers (a parse's 4, a box's 6, a skin's lay); the header: Actor's counts, then each table's bytes from the work's start
  let need = Math.max(1 << 20, 4 * u.length) + keys, r = 0;
  for (let tries = 0; tries < 4 && !(r > 0); tries++) {   // the parse says what it needs: the index's bytes, then the whole's (as the weld's host loops)
    room(wk + need); if (tries === 0) new Uint8Array(m.buffer, glb, u.length).set(u);
    r = x.scene_actor_parse_room ? x.scene_actor_parse_room(glb, u.length, wk, need, out, cap[0], cap[1]) : x.scene_actor_parse(glb, u.length, wk, need, out); const o = new Float64Array(m.buffer, out, 4);
    if (r <= 0 && -r === 12 && o[0] > need) need = o[0] + keys; else if (r <= 0) throw new Error('the module refused the rig (' + -r + ')');
  }
  if (!(r > 0)) throw new Error('the module was handed too little work for the rig');
  if (admitOnly) return true;   // the projected silhouette needs just the Board parser's verdict, before GPU buffers or image copies
  const len = need, nj = H()[2], nv = H()[3], nt = H()[4], jm = at8(wk + len), nm = jm + 64 * nj, txt = at8(nm + 256), txtN = 1 << 20, gpu = txt + txtN, sk = gpu + 64 * nv, wf = sk + 24 * nv + 64, wj = wf + 8 * 331, ld = at8(wj + 8 * 68 + 8); room(ld + 4 * (2 * nv + 3 * nt)); let fit = null;
  const h = H(), V = (T, i, n) => new T(m.buffer, wk + h[i], n), pt = V(Float64Array, 27, 8 * h[5]), im = V(Uint32Array, 28, 4 * h[6]), t32 = V(Uint32Array, 26, 3 * nt), parts = [], images = [], JM = V(Float64Array, 20, 16 * nj), lay = new Float64Array(m.buffer, out, 17);
  const names = (s) => { s = String(s == null ? '' : s); const n = Math.min(s.length, 120), a = new Uint16Array(m.buffer, nm, 120); for (let i = 0; i < n; i++) a[i] = s.charCodeAt(i); return n; };
  for (let i = 0; i < h[5]; i++) parts.push({ at: pt[i * 8], count: pt[i * 8 + 1], rgba: [pt[i * 8 + 2], pt[i * 8 + 3], pt[i * 8 + 4], pt[i * 8 + 5]], image: pt[i * 8 + 6], cut: pt[i * 8 + 7] });
  for (let i = 0; i < h[6]; i++) images.push({ bytes: u.slice(im[i * 4], im[i * 4] + im[i * 4 + 1]), type: im[i * 4 + 3] ? dec.decode(u.subarray(im[i * 4 + 2], im[i * 4 + 2] + im[i * 4 + 3])) : 'image/png' });
  return { N: r, joints: nj, n: nt, nv, idle: h[38] | 0, P: V(Float32Array, 21, 3 * nv), NB: V(Float32Array, 22, 3 * nv), UV: V(Float32Array, 23, 2 * nv), JI: V(Uint16Array, 24, 4 * nv), W: V(Float32Array, 25, 4 * nv), tri: nv > 65536 ? t32 : Uint16Array.from(t32), parts, images, JM, gl: null,
    skin(l = null) { if (l) lay.set(l); x.scene_actor_skin(wk, len, !l ? 0 : out, sk, 6 * nv); return new Float32Array(m.buffer, sk, 6 * nv); }, wear(a) { JM.set(a.JM); },
    worn(j, yaw, h) { if (fit === null) fit = x.scene_actor_fit ? x.scene_actor_fit(wk, len, wf) : -1; if (fit < 0) return null; new Float64Array(m.buffer, wj, j.length).set(j); return x.scene_actor_wear(wk, len, wf, wj, j.length, yaw, h, out, jm) >= 0 ? { lay: Array.from(lay), jm: new Float32Array(m.buffer, jm, 16 * nj) } : null; }, lod(cells) { const o = ld + 8 * nv, k = x.scene_actor_lod ? x.scene_actor_lod(wk, len, cells, ld, 2 * nv, o, 3 * nt) : 0; return k ? new Uint32Array(m.buffer, o, 3 * k).slice() : null; },   // THE COSTUME ON A FLAT GLASS (actor.rs lod): the body's own triangles cut by `cells` across its bind box, 3 vertex indices a kept one (read skin()'s vertices at them); null: none, or a module before the door   // THE COSTUME IS WORN BY HIS RIG (actor.rs fit, wear): this body on his 17 joints (51 or 68 numbers, scene_rig_at's), the skin's lay and the joints' row; null: no table fits, or no place
    gpu() { x.scene_actor_gpu(wk, len, gpu, 16 * nv); return new Float32Array(m.buffer, gpu, 16 * nv); }, clips() { return h[7]; }, dur(c) { return x.scene_actor_dur(wk, len, c); }, phase(id, dur, sec) { return x.scene_actor_phase(nm, names(id), dur, sec); },
    clipName(c) { if (c < 0) return c === -1 ? '#walk' : ''; const n = x.scene_actor_clip_name(wk, len, c, nm, 120); return String.fromCharCode.apply(null, new Uint16Array(m.buffer, nm, Math.min(n, 120))); }, clipIndex(name) { return x.scene_actor_clip_index(wk, len, nm, names(name)); },
    clipFor(name, walking) { return x.scene_actor_clip_for(wk, len, nm, names(name), walking ? 1 : 0); }, gaitDims(k) { return x.scene_actor_gait_dims && x.scene_actor_gait_dims(wk, len, out) ? Array.from(new Float64Array(m.buffer, out, 6), (v) => v * k) : null; }, gait(w, k) { if (!x.scene_actor_gait) return null; new Float64Array(m.buffer, out, 24).set(w); return x.scene_actor_gait(wk, len, out, k, jm) ? new Float32Array(m.buffer, jm, 16 * nj) : null; },   /* THE BODY WALKS HIS TRAJECTORY: a lent walk's measures (gait.rs Dims, times k) and its pose over walkOn's feet (null: no lent walk) */ pose(c, t) { x.scene_actor_pose(wk, len, c, t, jm); return new Float32Array(m.buffer, jm, 16 * nj); }, bounds() { x.scene_actor_bounds(wk, len, out); return Array.from(new Float64Array(m.buffer, out, 6)); },
    clip(name, text, ms) { const t = String(text), w = enc.encodeInto(t, new Uint8Array(m.buffer, txt, txtN)); if (w.read !== t.length) throw new Error('a clip past its room'); const i = x.scene_actor_clip(wk, len, nm, names(name), txt, w.written, Number.isFinite(ms) ? ms : NaN); if (i < 0) throw new Error('the module refused the clip (' + -i + ')'); return i; },
  };
}
/** THE PLAY IS A PROGRAM (Nov 4 2026, embertide-scene/src/play.rs): play(bytes) -> null (no play), or { n, bars, name, acts (an act's code -> its name), body(i) -> 64 hex, scale(i), at(bar) -> Float64Array 8 x n (x, y, z, yaw, act, cycle, since, moving; null: no instant), done(bar), bar(L, now, barMs) (THE BAR HELD BY HIS HAND, Nov 9 2026: the set's left thing L {at, hold?} -> its play's bar at the house instant by the module's clock law, scene_play_bar; NaN no instant) }, in an instance of its own. THE CAMERA IS A MEMBER (Nov 9 2026): lens(i) -> mm (0: no camera), shot(bar) -> the camera the scene is seen through (-1: none), camera(i, bar, aspect, pose?) -> the 21 numbers of play.rs camera (eye 3, yaw, pitch, hfov, lens, its viewfinder's plane c 3, r 3, u 3, n 3, w, h) through a set's pose [x, y, z, yaw, scale, unit], or null */
async function play(bytes) {
  const u = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes), { exports: x } = await WebAssembly.instantiate(MOD || (MOD = await WebAssembly.compile(BYTES)), {}), m = x.memory;
  const out = m.buffer.byteLength, tmp = out + 32, src = tmp + 256, wk = Math.ceil((src + u.length) / 8) * 8, room = (n) => m.buffer.byteLength < n && m.grow(Math.ceil((n - m.buffer.byteLength) / 65536));
  room(wk); new Uint8Array(m.buffer, src, u.length).set(u); x.scene_play_parse(src, u.length, wk, 0, out);
  const need = new Float64Array(m.buffer, out, 1)[0]; if (!(need > 0)) return null; room(wk + need + 4096);
  const n = x.scene_play_parse(src, u.length, wk, need, out), o = new Float64Array(m.buffer, out, 4), res = wk + need, view = new Float64Array(m.buffer, res, 8 * n), str = (k) => DEC.decode(new Uint8Array(m.buffer, tmp, k));
  return n ? { n, bars: o[2], name: str(x.scene_play_name(wk, need, tmp, 256)), acts: Array.from({ length: o[1] }, (_, i) => str(x.scene_play_act(wk, need, i, tmp, 256))), scale: (i) => x.scene_play_scale(wk, need, i),
    body: (i) => (x.scene_play_body(wk, need, i, tmp) ? Array.from(new Uint8Array(m.buffer, tmp, 32), (b) => b.toString(16).padStart(2, '0')).join('') : null),
    at: (bar) => (x.scene_play_at(wk, need, bar, res, 8 * n) ? view : null), done: (bar) => x.scene_play_done(wk, need, bar) === 1, lens: (i) => (typeof x.scene_play_lens === 'function' ? x.scene_play_lens(wk, need, i) : 0), shot: (bar) => (typeof x.scene_play_shot === 'function' ? x.scene_play_shot(wk, need, bar) : -1), bar: (L, now, barMs) => (typeof x.scene_play_bar === 'function' ? x.scene_play_bar(L && L.hold ? L.hold.bar : NaN, L && L.hold && L.hold.run ? Date.parse(L.hold.run) : NaN, L ? Date.parse(L.at) : NaN, now, barMs) : NaN), camera: (i, bar, aspect, pose) => { if (typeof x.scene_play_camera !== 'function') return null; if (pose) new Float64Array(m.buffer, tmp, 6).set(pose); return x.scene_play_camera(wk, need, i, bar, aspect, pose ? tmp : 0, tmp + 48) ? Array.from(new Float64Array(m.buffer, tmp + 48, 21)) : null; } } : null;
}
/** THE MEMORY IS EDITED, NOT REPLAYED (Nov 8 2026, embertide-scene/src/memory.rs): memory(bytes) -> null (no memory, or a module before the door), or { joints, ticks, fps, t0, t1, pose(s, rewrites) -> Float64Array 3 x joints at the film's second (null: no second), bones(s, rewrites, m16) -> Float64Array 256 (both a view into the instance's memory, standing until the next pose or bones call: copy what you keep), THREE's column-major instance matrices for rig's 16 bones through m16 (column-major, the world's frame to the glass's; null: as they stand; null: no second) }, in an instance of its own (the bytes past its memory); rewrites: an array of [at_s, joint (-1: every seen joint), dx, dy, dz], 1024 at most */
async function memory(bytes) {
  const u = bytesOf(bytes), { exports: x } = await WebAssembly.instantiate(MOD || (MOD = await WebAssembly.compile(BYTES)), {}); if (typeof x.scene_memory_bones !== 'function') return null;
  const m = x.memory, out = m.buffer.byteLength, mat = out + 32, res = out + 160, cam = out + 2208, gl = cam + 72, dd = gl + 96, c5 = dd + 24, f16 = c5 + 40, src = out + 2592, rw = Math.ceil((src + u.length) / 8) * 8, room = (n) => m.buffer.byteLength < n && m.grow(Math.ceil((n - m.buffer.byteLength) / 65536));
  room(rw + 8 * 5 * 1024 + 4096); new Uint8Array(m.buffer, src, u.length).set(u); if (!x.scene_memory_info(src, u.length, out)) return null;   // + 4096: THE TAKE ON THE FLOOR's value, laid past the rewrites (take below)
  const o = new Float64Array(m.buffer, out, 4), M16 = new Float64Array(m.buffer, mat, 16), view = new Float64Array(m.buffer, res, 256), R = new Float64Array(m.buffer, rw, 5 * 1024), J = o[0];
  const board = typeof x.scene_memory_frame === 'function', CAM = new Float64Array(m.buffer, cam, 9), GL = new Float64Array(m.buffer, gl, 12), D3 = new Float64Array(m.buffer, dd, 3), C5 = new Float64Array(m.buffer, c5, 5), F16 = new Float64Array(m.buffer, f16, 16);
  const lay = (r) => { const n = Math.min(1024, Array.isArray(r) ? r.length : 0); for (let i = 0; i < n; i++) R.set(r[i].slice(0, 5), 5 * i); return n; };
  // THE MEMORY ON THE BOARD (Nov 8 2026): sceneMs(clock, now) the scene's millisecond off the Nest's program (scene_memory_scene_ms); filmS(sceneMs, originMs, t0, duration_s) the film's second;
  // frame(cam9, ratio, glass12, scale) the shot's camera standing on a glass -> the 16 numbers (a copy; null: refused); at(s, rewrites, m16) the joints through that frame, 3 a joint
  // (a view, standing until the next call); cause(m16, at_s, joint, d3) his move in the room undone through the frame -> the rewrite's row [at_s, joint, dx, dy, dz] (null: refused)
  return { joints: J, ticks: o[1], fps: o[2], t0: o[3], t1: o[3] + (o[1] - 1) / o[2], pose: (s, r) => (x.scene_memory_pose(src, u.length, rw, lay(r), s, res, 3 * J) ? view.subarray(0, 3 * J) : null),
    bones: (s, r, t) => { if (t) M16.set(t); return x.scene_memory_bones(src, u.length, rw, lay(r), s, t ? mat : 0, res, 256) ? view : null; },
    sceneMs: (c, now) => (board && c ? x.scene_memory_scene_ms(+c.positionMs, +c.anchorMs, Number.isFinite(c.rate) ? c.rate : 1, c.mode === 'playing' ? 1 : 0, Number.isFinite(c.endMs) ? c.endMs : NaN, now) : NaN),
    filmS: (ms, originMs, t0, dur) => (board ? x.scene_memory_film_s(ms, Number.isFinite(originMs) ? originMs : 0, t0, dur) : NaN),
    frame: (cam9, ratio, glass12, scale) => { if (!board) return null; CAM.set(cam9); GL.set(glass12); return x.scene_memory_frame(cam, ratio, gl, scale, f16) ? Float64Array.from(F16) : null; },
    at: (s, r, t) => { if (!board) return null; if (t) M16.set(t); const n = x.scene_memory_joints(src, u.length, rw, lay(r), s, t ? mat : 0, res, 256); return n ? view.subarray(0, n) : null; },
    cause: (t, s, k, d) => { if (!board) return null; M16.set(t); D3.set(d); return x.scene_memory_cause(mat, s, k, dd, c5) ? Array.from(C5) : null; },
    // THE KITCHEN ON THE DND BOARD: centre() the set's centre on the floor [x, z] (null: nothing seen); foot(s) her feet at s (NaN: unseen); place(p3, yaw, cx, cz, foot, scale) the memory stood on the room's floor -> 16 numbers (a copy; null: refused)
    centre: () => (typeof x.scene_memory_centre === 'function' && x.scene_memory_centre(src, u.length, c5) ? [C5[0], C5[1]] : null),
    foot: (s) => (typeof x.scene_memory_foot === 'function' ? x.scene_memory_foot(src, u.length, s) : NaN), shotAt: (s) => (typeof x.scene_memory_shot === 'function' ? x.scene_memory_shot(src, u.length, s) : NaN),   // shotAt: THE PLAYER WEARS HER BODY, the shot she was seen in at s
    place: (p, yaw, cx, cz, foot, scale) => { if (typeof x.scene_memory_place !== 'function') return null; CAM.set(p); return x.scene_memory_place(cam, yaw, cx, cz, foot, scale, f16) ? Float64Array.from(F16) : null; }, take: (j, i, now, open, end, r) => { const b = typeof x.scene_take_floor_role === 'function' ? new TextEncoder().encode(j) : null, tk = rw + 8 * 5 * 1024; if (!b || b.length > 4096) return null; new Uint8Array(m.buffer, tk, b.length).set(b); const s = x.scene_take_floor_second(tk, b.length, now, open, end); return x.scene_take_floor_role(tk, b.length, i, s, src, u.length, rw, lay(r), res) === 22 ? { s, rolling: x.scene_take_floor_rolling(tk, b.length, now, open, end) === 1, a: Float64Array.from(view.subarray(0, 22)) } : null; } };   // THE TAKE ON THE FLOOR (Nov 24 2026, take_on_the_floor.rs): take(json, role, now, rec_open, rec_end, rewrites) -> { s: the take's second, rolling, a: x y z yaw act moving + the 16 numbers (scene metres) } or null, this memory being the role's body
}
/** THE WALLS TAKE POSTERS (Nov 6 2026, embertide-scene/src/poster.rs): picture(bytes) -> { type (image/png, image/jpeg, image/gif or image/webp), w, h (its pixels as shown), size_m: [w, h] (the poster's metres) } or null for bytes that are no picture a poster is; probed by the module in an instance of its own (the bytes laid past its memory), never by the page's word. The hang and the hung are left()'s ops. */
let TS = null; /* THE TAKE STRIP (Nov 26 2026, take_strip.rs): its own instance, made once; numbers at `at` (8 KB), words at +8192 (1 KB), the bytes handed at +9216 */ function takeStrip() { if (!MOD) return null; if (!TS) { const x = new WebAssembly.Instance(MOD, {}).exports; if (typeof x.scene_take_strip !== 'function') return null; TS = { x, at: Math.ceil(x.memory.buffer.byteLength / 8) * 8 }; } const { x, at } = TS, enc = new TextEncoder(), dec = new TextDecoder(), put = (u) => { const need = at + 9216 + u.length; if (x.memory.buffer.byteLength < need) x.memory.grow(Math.ceil((need - x.memory.buffer.byteLength) / 65536)); new Uint8Array(x.memory.buffer, at + 9216, u.length).set(u); return at + 9216; }; const nums = (n) => Array.from(new Float64Array(x.memory.buffer, at, n)), word = (f) => dec.decode(new Uint8Array(x.memory.buffer, at + 8192, f(at + 8192, 1024))).slice(0); return { /** read(entries (the record's log entries, or their JSON; a film's chunk lists are not handed)) -> { head (12 numbers), rows [{ n (14), seat, word, why }], id, by, *  at(x) -> { count, s, film [each row's film second at x], clock } } or null: no record. A read on the take's cause; at(x) on the playhead's (one parse). */ read(j) { const u = enc.encode(typeof j === 'string' ? j : JSON.stringify(j, (k, v) => (k === 'chunks' || k === 'blobs' ? undefined : v))), p = put(u), n = x.scene_take_strip(p, u.length, at, 12 + 14 * 24); if (!n) return null; const all = nums(12 + 14 * n), w = (what, i, xx = 0) => word((o, k) => x.scene_take_strip_word(put(u), u.length, what, i, xx, o, k)); return { head: all.slice(0, 12), rows: Array.from({ length: n }, (_, i) => ({ n: all.slice(12 + 14 * i, 26 + 14 * i), seat: w(0, i), word: w(1, i), why: w(2, i) })), id: w(3, 0), by: w(4, 0), at: (X) => { const c = w(5, 0, X); x.scene_take_strip_at(put(u), u.length, X, at); const a = nums(2 + n); return { count: a[0], s: a[1], film: a.slice(2), clock: c }; } }; }, /** moovAt(head bytes) -> the film's moov's file offset, or null */ moovAt(b) { const o = x.scene_film_moov_at(put(b), b.length); return Number.isNaN(o) ? null : o; }, /** look(moov bytes, s) -> { ts, w, h, samples, n, key, list [[offset, size, dts]], codec, description } or null */ look(m, s) { const p = put(m), N = 7 + 3 * 300, k = x.scene_film_look(p, m.length, s, at, N); if (!k) return null; const o = nums(7 + 3 * k), d = x.scene_film_word(p, m.length, 1, at + 8192, 1024); return { ts: o[0], w: o[1], h: o[2], samples: o[3], n: o[4], key: o[5], list: Array.from({ length: k }, (_, i) => o.slice(7 + 3 * i, 10 + 3 * i)), description: new Uint8Array(x.memory.buffer, at + 8192, d).slice(), codec: word((q, kk) => x.scene_film_word(p, m.length, 0, q, kk)) }; }, }; } function picture(bytes) { if (!MOD) throw new Error('the module is not compiled yet'); const u = bytesOf(bytes), x = new WebAssembly.Instance(MOD, {}).exports, m = x.memory, out = m.buffer.byteLength, src = out + 64, end = src + u.length; if (typeof x.scene_picture !== 'function') return null; if (m.buffer.byteLength < end) m.grow(Math.ceil((end - m.buffer.byteLength) / 65536)); new Uint8Array(m.buffer, src, u.length).set(u); const ok = x.scene_picture(src, u.length, out), o = new Float64Array(m.buffer, out, 5); return ok ? { type: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'][o[0]], w: o[1], h: o[2], size_m: [o[3], o[4]] } : null; }
/** THE SAME EYE ON EVERY GLASS (Nov 7 2026): overlayEye(v, frame, now, anchor, mode): his-eye's value as the fold wrote it at the house instant `now`, its leg (leg.rs FIELDS) looked up by the module's leg door and handed to its eye door (overlay_eye.rs) -> the eight numbers (code, x, y, z, sigma, age, moving, until), or null. Every glass asks this one door (api.eye on the Board). */
function overlayEye(v, frame, now, anchor, mode = 2) {
  if (typeof W?.scene_overlay_eye !== 'function') return null; const l = Array.isArray(v?.leg) && v.leg.length === 25 && typeof W.scene_leg_at === 'function' ? v.leg : null, put = (p, at) => { if (Array.isArray(p) && p.length === 3) for (let i = 0; i < 3; i++) IN[at + i] = stamp(p[i]); };
  const leg = l && (IN.set(l.map(stamp)), W.scene_leg_at(S, stamp(now)) === 1) ? [OUT[0], OUT[1], OUT[2], OUT[6], OUT[8], OUT[9]] : null; IN.fill(NaN, 0, 27); IN[0] = v?.kind === 'his-eye' ? 1 : 0; IN[1] = v?.frame === frame ? 1 : 0; if (leg) IN.set(leg, 17);
  put(v?.x, 2); put(v?.transform?.position, 5); IN[8] = stamp(v?.ms); put(v?.v, 9); IN[12] = stamp(v?.step_ms); IN[13] = stamp(v?.sigma_m); put(v?.sigma?.position_m, 14); put(anchor?.eye, 23); IN[26] = anchor?.follow === false && anchor?.frame === frame ? 1 : 0;
  W.scene_overlay_eye(S, mode, stamp(now)); return Array.from(OUT.subarray(0, 8)); }
/** instantiate(bytes): the module from its own bytes, instantiated once -> the scene of this glass. Rejects where WebAssembly is refused (a page's
 *  policy without 'wasm-unsafe-eval') or the bytes are no module: the caller keeps its own law. */
export async function instantiate(bytes) {
  if (api) return api;
  BYTES = bytes;
  const { module, instance } = await WebAssembly.instantiate(bytes, {});
  MOD = module; W = instance.exports; S = W.scene_this();
  const mem = W.memory.buffer;   // the module never grows its memory (no allocator): these views stand for its life
  IN = new Float64Array(mem, W.scene_in(S), W.scene_in_len()); OUT = new Float64Array(mem, W.scene_out(S), W.scene_out_len()); OUT32 = new Float32Array(mem, W.scene_out32(S), W.scene_out32_len());
  HOLD = new Float64Array(mem, W.scene_hold(S), W.scene_hold_len()); HOLD32 = new Float32Array(mem, W.scene_hold32(S), W.scene_hold32_len()); BREATH32 = W.scene_breath32 ? new Float32Array(mem, W.scene_breath32(S), W.scene_breath32_len()) : null;   // a module before the breath: none
  SPIN32 = W.scene_spin ? new Float32Array(mem, W.scene_spin32(S), W.scene_spin32_len()) : null;   // a module before the band's spin: none
  TXT = new Uint8Array(mem, W.scene_txt(S), W.scene_txt_len()); U16 = new Uint16Array(mem, W.scene_u16(S), W.scene_u16_len());
  ENC = new TextEncoder(); DEC = new TextDecoder();
  api = make(); api.actor = actor; api.play = play; api.actorNow = actorNow; api.picture = picture; api.takeStrip = takeStrip; api.eye = overlayEye; api.memory = memory; api.roomLaw = (ask) => { if (!W || typeof W.scene_room_law !== 'function') return null; const t = new Uint8Array(W.memory.buffer, W.scene_room_law_txt(), W.scene_room_law_txt_len()), b = ENC.encode(JSON.stringify(ask)); if (b.length > t.length) return null; t.set(b); const n = W.scene_room_law(b.length); return n ? JSON.parse(DEC.decode(t.subarray(0, n))) : null; }; api.react = (ask) => { if (!W || typeof W.scene_react !== 'function') return null; const t = new Uint8Array(W.memory.buffer, W.scene_react_txt(), W.scene_react_txt_len()), b = ENC.encode(JSON.stringify(ask)); if (b.length > t.length) return null; t.set(b); const n = W.scene_react(b.length); return n ? JSON.parse(DEC.decode(t.subarray(0, n))) : null; }; api.surface = (f32, pose) => { if (!MOD || !(f32 instanceof Float32Array) || f32.length < 9 || !Array.isArray(pose) || pose.length !== 13) return null; const x = new WebAssembly.Instance(MOD, {}).exports; if (typeof x.scene_surface_lay !== 'function') return null; const n = f32.length, nt = Math.floor(n / 9), m = x.memory, at = Math.ceil(m.buffer.byteLength / 8) * 8, po = Math.ceil((at + 4 * n) / 8) * 8, o = po + 104, ix = o + 96 * nt, bo = Math.ceil((ix + 12 * nt) / 8) * 8, end = bo + 48; if (m.buffer.byteLength < end) m.grow(Math.ceil((end - m.buffer.byteLength) / 65536)); new Float32Array(m.buffer, at, n).set(f32); new Float64Array(m.buffer, po, 13).set(pose.map(Number)); const k = x.scene_surface_lay(at, n, po, o, ix, bo, nt), b = new Float64Array(m.buffer, bo, 6); return k ? { n: k, v: 3 * k, data: new Float32Array(m.buffer, o, 24 * k).slice(), index: new Uint32Array(m.buffer, ix, 3 * k).slice(), min: [b[0], b[1], b[2]], max: [b[3], b[4], b[5]] } : null; };   // THE LAW IS DRAWN (Nov 10 2026): the law's room as a glass draws it, by the module's door (room_law.rs); hung on this line so the Board's inline copy of the glue grows by none; THE BOARD DRAWS THE LIDAR MESH (Nov 11 2026): api.surface(f32, pose) room/surface's floats laid in the Board's room by surface_lay.rs, in an instance of its own (pose: the join's R, t, the floor's y) -> { n, v, data (8 floats a vertex), index, min, max } as glbMesh hands the mesh layer, or null
  if (typeof pathDoor === 'function') pathDoor(api.pathOn);   // the Board's inline copy has no pathDoor: its ONE-BODY finds SCENE_LAW.scene
  return api;
}
// SCENE-GLUE-END

export { overlayEye };   // the one eye door, from the glue (the Board carries it inline, api.eye)
export function skinTris(part, frame, lay) { if (typeof W?.scene_skin_tris !== 'function') return null; const m = W.memory.buffer; new Uint8Array(m, W.scene_skin_part(), part.length).set(part); new Uint8Array(m, W.scene_skin_frame(), frame.length).set(frame); new Float64Array(m, W.scene_skin_lay(), 16).set(lay); const n = W.scene_skin_tris(part.length, frame.length); return n < 0 ? null : new Float32Array(m, W.scene_skin_tris_out(), n); }   // THE BOARD BENDS HER LIVE (skin.rs scene_skin_tris): a game part and a frame of its poses (their bytes) bent by the game's own law and laid on the room by lay (A 9, t 3, r g b, kind) -> its triangles, STRIDE floats a corner (a view on the module: used before the next call), or null
export const societyPlan = (m, n, root) => (typeof W?.scene_society === 'function' ? W.scene_society(m, n, root) : 0);   // THE SOCIETY OPENS (Nov 19 2026, society.rs): GP(m, n) cut from a seat (orb.js's order; -1 the Chancery's own); 0 off the ladder or before the society
export const societyFrame = (t, left = 0) => (typeof W?.scene_society_frame === 'function' && W.scene_society_frame(t, left) ? new Float32Array(W.memory.buffer, W.scene_society_out(), W.scene_society_out_len()) : null);   // its frame at t: HEAD, then STRIDE a face (society.rs)
export function overlayClock(v, count, wall, epoch) {
  const t = W?.scene_overlay_clock?.(v?.clock === 'station', typeof v?.clock_epoch === 'string' && !!v.clock_epoch && v.clock_epoch === epoch, stamp(count), stamp(wall));
  return Number.isFinite(t) ? t : null;
}
export const overlayPace = (step, dt) => W?.scene_overlay_pace?.(step == null, Number(step), Number(dt)) ?? null;
export function overlayGaps(gaps, n) {
  if (!W?.scene_overlay_gaps) return { gap_ms: null, gap_max_ms: null, gap_n: 0 };
  OUT.set(gaps); W.scene_overlay_gaps(S, n, gaps.length);
  return { gap_ms: Number.isNaN(OUT[0]) ? null : OUT[0], gap_max_ms: Number.isNaN(OUT[1]) ? null : OUT[1], gap_n: OUT[2] };
}

// One opt-in diagnostic collector per overlay realm; Rust owns its bounded state independently of scene.reset().
export function createMotionPaint() {
  if (typeof W?.scene_motion !== 'function') return null;
  const call = (op, value, t, mono = NaN, unc = NaN, index = 0) => W.scene_motion(S, op, op < 3 ? text(value) : 0, stamp(t), stamp(mono), stamp(unc), index);
  const active = (t) => W.scene_motion_active(S, stamp(t)) === 1;
  const read = (op, t, index = 0) => { const n = call(op, null, t, NaN, NaN, index); return n ? JSON.parse(DEC.decode(TXT.subarray(0, n))) : null; };
  return {
    ask: (value, t) => call(0, value, t) === 1,
    receive: (value, o) => active(o.t) && call(1, { value, frame: o.frame }, o.t, o.mono, o.unc_ms) === 1,
    paint: (o) => active(o.t) && call(2, o, o.t, o.mono, o.unc_ms) === 1,
    frame: (mono) => call(3, null, NaN, mono),
    state(t) { const s = read(4, t); if (s) s.rows = Array.from({ length: s.retained }, (_, i) => read(5, t, i)); return s; },
  };
}

/** load({bytes, url}): the module, instantiated once -> the scene of this glass. bytes: the .wasm's own bytes (a test's, a page that holds them);
 *  url: where it is (default ./wasm/embertide-scene.wasm beside this file). Rejects when the module is not there: the caller keeps its own law. */
/** THE LIGHT MEASURES ITS WALL (Nov 7 2026, embertide-scene/src/light_wall.rs): lightWall(points [[x, y, z, sigma_m, eyes_m]] (the light's triangulated points, the Station's metres), walls [{ a: [x, z], b: [x, z], y0, h }] (the drawn walls), { near_m, min_n, inside: [x, z] }) -> { walls: [one a drawn wall, in order: { n } (the points given), and when measured normal, d, centre, extent_m, sigma_m, sigma_rad, inward_m, turned_deg, rms_m, dropped], corners: [{ i, j, x, z, sigma_m }], off, of }, by the module in an instance of its own after load(); null where it has no such door. Outside the glue's marks: no page carries it. */
export function lightWall(points, walls, { near_m = 0.3, min_n = 30, inside = null } = {}) {
  if (!MOD) throw new Error('the module is not compiled yet: await load() first');
  const x = new WebAssembly.Instance(MOD, {}).exports; if (typeof x.scene_light_wall !== 'function') return null;
  const m = x.memory, at = Math.ceil(m.buffer.byteLength / 8) * 8, nw = walls.length, P = 5 * points.length, W = 6 * nw, O = 15 * nw + 3 + 5 * nw * Math.max(0, nw - 1) / 2, all = P + W + 4 + O;
  if (m.buffer.byteLength < at + 8 * all) m.grow(Math.ceil((at + 8 * all - m.buffer.byteLength) / 65536));
  const f = new Float64Array(m.buffer, at, all); points.forEach((p, i) => f.set(p.slice(0, 5), 5 * i)); walls.forEach((w, i) => f.set([w.a[0], w.a[1], w.b[0], w.b[1], w.y0, w.h], P + 6 * i)); f.set([near_m, min_n, inside ? inside[0] : NaN, inside ? inside[1] : NaN], P + W);
  if (!x.scene_light_wall(at, points.length, at + 8 * P, nw, at + 8 * (P + W), at + 8 * (P + W + 4), O)) return null;
  const o = f.subarray(P + W + 4), wallsOut = walls.map((_, i) => { const r = o.subarray(15 * i, 15 * i + 15); return Number.isNaN(r[1]) ? { n: r[0] } : { n: r[0], normal: [r[1], 0, r[2]], d: r[3], centre: [r[4], r[5], r[6]], extent_m: { w: r[7], h: r[8] }, sigma_m: r[9], sigma_rad: r[10], inward_m: r[11], turned_deg: r[12] * 180 / Math.PI, rms_m: r[13], dropped: r[14] }; });
  let q = 15 * nw; const corners = []; for (let c = 0, k = o[q++]; c < k; c++, q += 5) corners.push({ i: o[q], j: o[q + 1], x: o[q + 2], z: o[q + 3], sigma_m: o[q + 4] });
  return { walls: wallsOut, corners, off: o[q], of: o[q + 1] };
}
/** THE LIGHT CLOSES ITS LOOP (Nov 7 2026, embertide-scene/src/light_join.rs): lightJoin(eyes [{ c: [x, y, z], sigma_m, sigma_rad }] (the devices' cameras as the house holds them),
 *  walls [{ a: [x, z], b: [x, z], y0, h, sigma_m, sigma_rad }] (the drawn walls), rays [[node, eye, ox, oy, oz, dx, dy, dz, sigma_rad]] (one node's rays contiguous),
 *  { near_m, iters, inside }) -> { eyes: [{ turn, shift: [x, y, z], sigma_rad, sigma_m, rays }], walls: [{ nodes, shift, turn, sigma_m, sigma_rad, rms }], nodes, off,
 *  lone, rays, rms, iters, converged }, or null (no door, or the inputs refused). The poses and the walls solved together from the light's rays. */
export function lightJoin(eyes, walls, rays, { near_m = NaN, iters = NaN, inside = null } = {}) {
  if (!MOD) throw new Error('the module is not compiled yet: await load() first');
  const x = new WebAssembly.Instance(MOD, {}).exports; if (typeof x.scene_light_join !== 'function') return null;
  const m = x.memory, at = Math.ceil(m.buffer.byteLength / 8) * 8, ne = eyes.length, nw = walls.length, nr = rays.length, E = 5 * ne, W = 8 * nw, R = 9 * nr, O = 7 * ne + 6 * nw + 7, all = E + W + R + 4 + O;
  if (m.buffer.byteLength < at + 8 * all) m.grow(Math.ceil((at + 8 * all - m.buffer.byteLength) / 65536));
  const f = new Float64Array(m.buffer, at, all);
  eyes.forEach((e, i) => f.set([e.c[0], e.c[1], e.c[2], e.sigma_m, e.sigma_rad], 5 * i)); walls.forEach((w, i) => f.set([w.a[0], w.a[1], w.b[0], w.b[1], w.y0, w.h, w.sigma_m, w.sigma_rad], E + 8 * i)); rays.forEach((r, i) => f.set(r.slice(0, 9), E + W + 9 * i));
  f.set([near_m, iters, inside ? inside[0] : NaN, inside ? inside[1] : NaN], E + W + R);
  if (!x.scene_light_join(at, ne, at + 8 * E, nw, at + 8 * (E + W), nr, at + 8 * (E + W + R), at + 8 * (E + W + R + 4), O)) return null;
  const o = f.subarray(E + W + R + 4), s = o.subarray(7 * ne + 6 * nw);
  return { eyes: eyes.map((_, i) => ({ turn: o[7 * i], shift: [o[7 * i + 1], o[7 * i + 2], o[7 * i + 3]], sigma_rad: o[7 * i + 4], sigma_m: o[7 * i + 5], rays: o[7 * i + 6] })),
    walls: walls.map((_, i) => { const r = o.subarray(7 * ne + 6 * i, 7 * ne + 6 * i + 6); return { nodes: r[0], shift: r[1], turn: r[2], sigma_m: r[3], sigma_rad: r[4], rms: r[5] }; }),
    nodes: s[0], off: s[1], lone: s[2], rays: s[3], rms: s[4], iters: s[5], converged: s[6] === 1 };
}
/** THE LIDAR IS THE FRAME (Nov 8 2026, embertide-scene/src/mesh_shell.rs): meshShell(f32) (a LiDAR surface's bytes: xyz, three vertices a triangle) -> { floor, ceiling, walls, triangles }
 *  (floor and ceiling { kind, n, d, y, area } or null, walls largest first { kind, n, d, centre, extent_m, area, sigma_m, sigma_rad }), by the module in an instance of its own after
 *  load() (the bytes laid past its memory, two bytes a triangle lent); null where it has no such door. */
export function meshShell(f32) {
  if (!MOD) throw new Error('the module is not compiled yet: await load() first');
  const x = new WebAssembly.Instance(MOD, {}).exports; if (typeof x.scene_mesh_shell !== 'function') return null;
  const n = f32 instanceof Float32Array ? f32.length : 0, m = x.memory, at = Math.ceil(m.buffer.byteLength / 8) * 8, work = at + 4 * n, out = Math.ceil((work + 2 * Math.floor(n / 9)) / 8) * 8, O = 8 + 11 * 64, end = out + 8 * O;
  if (m.buffer.byteLength < end) m.grow(Math.ceil((end - m.buffer.byteLength) / 65536));
  if (n) new Float32Array(m.buffer, at, n).set(f32);
  if (!x.scene_mesh_shell(at, n, work, out, O)) return null;
  const o = new Float64Array(m.buffer, out, O), level = (kind, i, s) => (Number.isNaN(o[i]) ? null : { kind, n: [0, s, 0], d: o[i + 1], y: o[i], area: o[i + 2] });
  const walls = Array.from({ length: o[7] }, (_, k) => { const w = o.subarray(8 + 11 * k, 19 + 11 * k); return { kind: 'wall', n: [w[0], 0, w[1]], d: w[2], centre: [w[3], w[4], w[5]], extent_m: { w: w[6], h: w[7] }, area: w[8], sigma_m: w[9], sigma_rad: w[10] }; });
  return { floor: level('floor', 1, 1), ceiling: level('ceiling', 4, -1), walls, triangles: o[0] };
}
const OWN = {};   // a pure door's own instance, made once, its doubles one page past the module's memory (lightWall's road, without a page grown at every call)
function own(door) { if (!MOD) throw new Error('the module is not compiled yet: await load() first'); if (!OWN[door]) { const x = new WebAssembly.Instance(MOD, {}).exports; if (typeof x[door] !== 'function') return null; OWN[door] = { x, at: Math.ceil(x.memory.buffer.byteLength / 8) * 8 }; x.memory.grow(1); } return OWN[door]; }
/** THE ONE CODE LAW (Nov 8 2026, code_word.rs): codeGlass({ now, dnd, face, twin, touch, flash, flashSince, asks: [{ until, began, why }] }) -> one glass's word { form, until?, why } *  (no until: standing), null for nothing or no door; codeOn(word, seat, now) -> the form ('full', 'corner', 'badge') this glass wears from screens.code, or null; *  codeBegan(began, till, now) -> when an asker's walk began. The adopter decides (lib/harmony-screen-codes.mjs), every glass looks up. */
export const CODE_FORMS = ['', 'full', 'corner', 'badge'], CODE_WHYS = ['', 'walk', 'sight', 'her', 'face', 'flash', 'twin'];
export function codeGlass({ now, dnd = false, face = false, twin = false, touch = -Infinity, flash = 0, flashSince = NaN, asks = [] }) {
  const d = MOD && own('scene_code_glass'); if (!d) return null; const n = Math.min(asks.length, 64), f = new Float64Array(d.x.memory.buffer, d.at, n * 3 + 3);
  asks.slice(0, n).forEach((a, i) => f.set([Number(a.until), Number(a.began), CODE_WHYS.indexOf(a.why)], i * 3));
  const form = d.x.scene_code_glass(Number(now), dnd ? 1 : 0, face ? 1 : 0, twin ? 1 : 0, Number(touch), Number(flash) || 0, Number(flashSince), d.at, n, d.at + n * 24), o = f.subarray(n * 3);
  return form ? { form: CODE_FORMS[form], ...(Number.isFinite(o[1]) ? { until: o[1] } : {}), why: CODE_WHYS[o[2]] } : null;
}
export function codeOn(word, seat, now) {
  const e = word && typeof word === 'object' && word[seat] && typeof word[seat] === 'object' ? word[seat] : null, d = e && MOD && own('scene_code_on'), u = e && Number(e.until);
  return d ? CODE_FORMS[d.x.scene_code_on(Math.max(0, CODE_FORMS.indexOf(e.form)), e.until == null ? Infinity : Number.isFinite(u) ? u : 0, Number(now))] || null : null;
}
/** THE ONE ENCODER (Nov 8 2026, micro_qr.rs): microQr(kind, what) -> { text, n, symbol, mask, isDark(row, col) } | null: kind 'alnum' (the smallest symbol for a text),
 *  'name' (a glass's name in capitals as an M2), 'number' (0 to 99999 as an M1); null for what it cannot hold or before the module is loaded. */
export function microQr(kind, what) {
  const d = MOD && own('scene_micro_qr'), K = ['alnum', 'name', 'number'].indexOf(kind); if (!d || K < 0) return null;
  const t = K === 2 ? String(what) : kind === 'name' ? String(what || '').toUpperCase() : String(what || ''), b = new TextEncoder().encode(K === 2 ? '' : t).slice(0, 64), k = Number(what);
  if (K === 2 && !/^[0-9]{1,5}$/.test(t)) return null;
  new Uint8Array(d.x.memory.buffer, d.at, b.length).set(b);
  const w = d.x.scene_micro_qr(K, d.at, b.length, K === 2 ? k : 0, d.at + 64), n = w & 0xff; if (!n) return null;
  const m = new Uint8Array(d.x.memory.buffer, d.at + 64, n * n).slice();
  return { text: t, n, symbol: (w >> 8) & 0xf, mask: (w >> 12) & 0xf, isDark: (i, j) => i >= 0 && j >= 0 && i < n && j < n && m[i * n + j] === 1 };
}
export const codeBegan =(began, till, now) => { const d = MOD && own('scene_code_began'); return d ? d.x.scene_code_began(Number(began), Number(till), Number(now)) : Number(now); };
/** THE GLASS SAYS ITS CODE (Nov 9 2026, his ~12:4x UTC "why the fuck dont we have fucking nest state about QR codes... pelino is not displaying it. lysa is not displaying it. newmac *  is not displaying it", then "Glasses report back"; read that minute: the adopter told 21 glasses `full` from 12:33:44 to 12:34:29 and no glass said whether it drew): codeSaid(nest, *  glass, form, on, fx) -> a painter's word of what it draws, on glass/code/<glass> { schema, glass, forms, seen, page, last } (its time the Nest's own: the ref's ts; the page keeps no clock), written only when its forms or the page's *  visibility move (seen: document.visibilityState; a TV's page under a fullscreen game says hidden); `last` the newest forms it drew, kept across a reload; a CAS refused once, then taken *  again. fx: a page whose own fetch is gated (tv1's) hands its own. Read by embertide-meter's codes (told against said, glass by glass). Nothing at rest: one ~300 B POST a change. */
const SAID = {}; export function codeSaid(nest, glass, form, on, fx) {
  if (typeof document === 'undefined' || !/^[a-z0-9][a-z0-9-]{0,47}$/.test(String(glass)) || !form) return;
  const s = SAID[glass] || (SAID[glass] = { forms: {}, rev: null, key: '', last: null, base: String(nest).replace(/\/$/, ''), fx: fx || globalThis.fetch.bind(globalThis) }); s.forms[form] = !!on;
  if (!s.hear) { s.hear = 1; document.addEventListener('visibilitychange', () => codeSaid(s.base, glass, form, s.forms[form])); }
  const forms = Object.keys(s.forms).filter((f) => s.forms[f]).sort(), seen = document.visibilityState === 'visible', key = forms.join() + '|' + seen; if (key === s.key) return; s.key = key; if (forms.length) s.last = { forms, seen };
  const post = (turn) => s.fx(`${s.base}/nest/ref/glass/code/${glass}`, { method: 'POST', headers: { 'content-type': 'application/json' }, cache: 'no-store', body: JSON.stringify({ seat: glass, expect: s.rev === null ? 0 : s.rev, value: { schema: 'embertide.glass-code/v1', glass, forms, seen, page: location.pathname, last: s.last } }) }).then((r) => r.json().catch(() => null).then((j) => { const ref = r.ok ? j && j.ref : j && j.current; s.rev = ref && Number.isSafeInteger(ref.rev) ? ref.rev : null; if (!s.last && ref && ref.value && ref.value.last) s.last = ref.value.last; if (r.status === 409 && !turn) return post(1); })).catch(() => {});
  post(0); }
/** THE CODE JOINS THE CODE IN THE MODULE (Nov 7 2026, marker_join.rs): markerJoin(a, b, maxDeg) (12 numbers each: centre, right, up, normal) -> { R, t, yaw_deg, residual_deg } (x_b = R x_a + t), { refused: [code, side, field] }, or null (no door) */
export function markerJoin(a, b, maxDeg = 5) {
  const d = own('scene_marker_join'); if (!d) return null;
  const f = new Float64Array(d.x.memory.buffer, d.at, 38); f.set(a.slice(0, 12), 0); f.set(b.slice(0, 12), 12); const ok = d.x.scene_marker_join(d.at, d.at + 96, Number(maxDeg), d.at + 192), o = Array.from(f.subarray(24, 38));
  return ok ? { R: o.slice(0, 9), t: o.slice(9, 12), yaw_deg: o[12], residual_deg: o[13] } : { refused: o.slice(0, 3) };
}
/** THE FIRST CODE IS BORN IN THE SPACE (Nov 7 2026, first_room.rs): firstRoom(R, t, up, offset) (the eye in the held frame, its up, its code's place on its glass) -> { Q, deg, right, up, normal, camera: { R, t }, qr }, or null (no least turn, no door) */
export function firstRoom(R, t, up, off = [0, 0]) {
  const d = own('scene_first_room'); if (!d) return null; const f = new Float64Array(d.x.memory.buffer, d.at, 51); f.set([...R, ...t, ...up, ...off].map(Number));
  if (!d.x.scene_first_room(d.at, d.at + 136)) return null; const o = Array.from(f.subarray(17, 51));
  return { Q: o.slice(0, 9), deg: o[9], right: o.slice(10, 13), up: o.slice(13, 16), normal: o.slice(16, 19), camera: { R: o.slice(19, 28), t: o.slice(28, 31) }, qr: o.slice(31, 34) };
}
/** THE IDLE IPAD JOINS BY ITS OWN LIDAR (Nov 8 2026, surface_vote.rs): surfaceJoin(ref, pose, mesh, every) (ref: the joined mesh's f32 in its world; pose { yaw, t, floor }: that world's join and the room's floor y; mesh: the new world's f32) -> { stands, best, second, samples, planes, walls, floor } or null; NO JOIN WITHOUT THE MATRIX'S OWN DOUBT (Nov 9 2026, one_room.rs scene_join_doubt): with pose.sigma_m and pose.sigma_rad (the joined world's own doubt) the answer carries doubt: the vote's best as the start of the one system's fit, { joined, modes, rank, nulls, yaw, t, sigma_rad, sigma_t, chi2, rows, doubt_m, reach_m }, null on an older module or a doubt unsaid; THE WALK SAYS WHAT THE HOUSE WAITS FOR (Nov 12 2026, surface_vote.rs said/say, the door scene_surface_say): every answer carries `say`, the verdict as the one plain sentence a glass shows (pose.bar: the join's doubt bar, so a fit under it is said found), and a room with no floor (pose.floor null) or a scan the door cannot judge answers { say } alone; say is null on a module without the door */
export function surfaceJoin(ref, pose, mesh, every = 8) {
  if (!MOD) throw new Error('the module is not compiled yet: await load() first'); const x = new WebAssembly.Instance(MOD, {}).exports; if (typeof x.scene_surface_join !== 'function') return null; const say = (w) => { if (typeof x.scene_surface_say !== 'function') return null; const mm = x.memory, p = Math.ceil(mm.buffer.byteLength / 8) * 8; mm.grow(1); new Float64Array(mm.buffer, p, 5).set(w); const n = x.scene_surface_say(p, p + 40, 1024); return n ? new TextDecoder().decode(new Uint8Array(mm.buffer, p + 40, n)) : null; }; if (pose.floor == null || !Number.isFinite(Number(pose.floor))) return { say: say([0, 0, 0, 0, 0]) };   /* the vote's views are read before say grows the memory */
  const m = x.memory, nr = ref.length, nn = mesh.length, W = Math.ceil(2 * Math.floor(nn / 9) / 4) + 6 * Math.ceil(nr / 9 / every) + 3 * 240 * 240, at = Math.ceil(m.buffer.byteLength / 8) * 8, a = at + 4 * nr, pz = Math.ceil((a + 4 * nn) / 8) * 8, w = pz + 40, o = Math.ceil((w + 4 * W) / 8) * 8;
  if (m.buffer.byteLength < o + 328) m.grow(Math.ceil((o + 328 - m.buffer.byteLength) / 65536)); new Float32Array(m.buffer, at, nr).set(ref); new Float32Array(m.buffer, a, nn).set(mesh); new Float64Array(m.buffer, pz, 5).set([pose.yaw, ...pose.t, pose.floor]);
  if (!x.scene_surface_join(at, nr, every, pz, a, nn, w, W, o)) return { say: say([1, 0, 0, 0, 0]) }; const r = new Float64Array(m.buffer, o, 14);
  const q = pose.sigma_m > 0 && pose.sigma_rad > 0 && typeof x.scene_join_doubt === 'function' ? (new Float64Array(m.buffer, o + 112, 11).set([pose.yaw, ...pose.t, pose.sigma_m, pose.sigma_rad, r[1], r[2], r[3], r[4], r[0]]), x.scene_join_doubt(at, nr, o + 112, a, nn, o + 160, w, W, o + 200) ? new Float64Array(m.buffer, o + 200, 16) : null) : null;   // the vote's work is room enough for the two shell reads (2 words a triangle against 6 a sample)
  return { stands: r[0] === 1, best: { yaw: r[1], t: [r[2], r[3], r[4]], agree: r[5] }, second: { yaw: r[6], t: [r[7], NaN, r[8]], agree: r[9] }, samples: r[10], planes: r[11], walls: r[12], floor: r[13], doubt: q && { joined: q[0] === 1, modes: q[1], rank: q[2], nulls: q[3], yaw: q[4], t: [q[5], q[6], q[7]], sigma_rad: q[8], sigma_t: [q[9], q[10], q[11]], chi2: q[12], rows: q[13], doubt_m: q[14], reach_m: q[15] }, say: say([1, 1, r[5], r[9], q && q[0] === 1 && q[14] <= pose.bar ? 1 : 0]) };
}
/** THE MESHES HOLD EACH OTHER (Nov 9 2026, surface_fit.rs): surfaceFit(ref, refPose, mesh, seed, every) (ref, mesh: f32 meshes in their own worlds; refPose, seed: { yaw, t }, their joins) -> { holds, yaw, t, sigma_rad, sigma_m, rms, pairs, samples, cells, iters, far, far_c } or null */
export function surfaceFit(ref, refPose, mesh, seed, every = 4) {
  if (!MOD) throw new Error('the module is not compiled yet: await load() first'); const x = new WebAssembly.Instance(MOD, {}).exports; if (typeof x.scene_surface_fit !== 'function') return null;
  const m = x.memory, nr = ref.length, nn = mesh.length, W = 15 * Math.ceil(nr / 9 / every), at = Math.ceil(m.buffer.byteLength / 8) * 8, a = at + 4 * nr, pz = Math.ceil((a + 4 * nn) / 8) * 8, w = pz + 64, o = Math.ceil((w + 4 * W) / 8) * 8;
  if (m.buffer.byteLength < o + 128) m.grow(Math.ceil((o + 128 - m.buffer.byteLength) / 65536)); new Float32Array(m.buffer, at, nr).set(ref); new Float32Array(m.buffer, a, nn).set(mesh); new Float64Array(m.buffer, pz, 8).set([refPose.yaw, ...refPose.t, seed.yaw, ...seed.t]); if (!x.scene_surface_fit(at, nr, pz, a, nn, pz + 32, every, w, W, o)) return null; const r = new Float64Array(m.buffer, o, 16);
  return { holds: r[0] === 1, yaw: r[1], t: [r[2], r[3], r[4]], sigma_rad: r[5], sigma_m: r[6], rms: r[7], pairs: r[8], samples: r[9], cells: r[10], iters: r[11], far: r[12], far_c: [r[13], r[14], r[15]] };
}
/** THE SHELL IS CALLED (Nov 9 2026, shared_shell.rs, ffi.rs scene_shared_shell): sharedShell({ shell: [plane], worlds: [{ prior, sigma_m, seen: [plane] }], screens: [prior], sights: [{ world, screen, p, yaw, sigma_m, sigma_rad }] }) (plane { kind: 0 floor 1 ceiling 2 wall, n, d, sigma_m, sigma_rad, c: a wall's centre or none, w: its width along it or none }; prior { have, p, yaw, sigma_m, sigma_rad, p_moved }; a world's seen planes in its own world, a sight in that world) -> { gauge, rows, chi2, n, rank, nulls, moves, over, floor_y, height, spans, shell: [plane + c (laid on it, at the middle of its witnesses' span, its normal into the room), w (that span's width, NaN: none), witnesses, born, outside (its point stands outside the room a better witnessed wall bounds: THE WALL OUTSIDE THE ROOM IS NO BOUND, Nov 25 2026)], worlds: [{ joined, yaw, t, sigma_m, sigma_rad, ways, rejoined, moved, why, z, held (its planes alone hold its join) }], screens: [{ placed, p, yaw, sigma_m, sigma_rad, moved, moved_m, sights, z }], work: [{ kind, target, gain }] } or null (an older module, or words it refuses) */
export function sharedShell({ shell = [], worlds = [], screens = [], sights = [] }) {
  if (!MOD) throw new Error('the module is not compiled yet: await load() first'); const x = new WebAssembly.Instance(MOD, {}).exports; if (typeof x.scene_shared_shell !== 'function') return null; const P = (q) => [q.kind, ...q.n, q.d, q.sigma_m, q.sigma_rad, ...(Array.isArray(q.c) && q.c.length === 3 ? q.c : [NaN, NaN, NaN]), Number.isFinite(q.w) && q.w > 0 ? q.w : NaN], Q = (q) => (q && q.have ? [1, ...q.p, q.yaw, q.sigma_m, q.sigma_rad, q.p_moved || 0] : [0, 0, 0, 0, 0, 0, 0, 0]), w = [shell.length, worlds.length, screens.length, sights.length, ...shell.flatMap(P), ...worlds.flatMap((v) => [...Q(v.prior), v.sigma_m, v.seen.length, ...v.seen.flatMap(P)]), ...screens.flatMap(Q), ...sights.flatMap((v) => [v.world, v.screen, ...v.p, v.yaw, v.sigma_m, v.sigma_rad])];
  const m = x.memory, N = 13 + 8 * 14 + 8 * 16 + 12 * 11, at = Math.ceil(m.buffer.byteLength / 8) * 8, o = at + 8 * w.length; if (m.buffer.byteLength < o + 8 * N) m.grow(Math.ceil((o + 8 * N - m.buffer.byteLength) / 65536)); new Float64Array(m.buffer, at, w.length).set(w); const k = x.scene_shared_shell(at, w.length, o, N), r = k ? Array.from(new Float64Array(m.buffer, o, k)) : null; if (!r) return null; let i = 13; const cut = (n, z, f) => Array.from({ length: n }, () => f(r.slice(i, i += z)));
  return { gauge: r[1], rows: r[2], chi2: r[3], n: r[4], rank: r[5], nulls: r[6], moves: r[7], over: r[8], floor_y: r[10], height: r[11], spans: r[12] === 1, shell: cut(r[9], 14, (v) => ({ kind: v[0], n: v.slice(1, 4), d: v[4], sigma_m: v[5], sigma_rad: v[6], c: v.slice(7, 10), w: v[10], witnesses: v[11], born: v[12], outside: v[13] === 1 })), worlds: cut(worlds.length, 13, (v) => ({ joined: v[0] === 1, yaw: v[1], t: v.slice(2, 5), sigma_m: v[5], sigma_rad: v[6], ways: v[7], rejoined: v[8] === 1, moved: v[9] === 1, why: v[10], z: v[11], held: v[12] === 1 })), screens: cut(screens.length, 11, (v) => ({ placed: v[0] === 1, p: v.slice(1, 4), yaw: v[4], sigma_m: v[5], sigma_rad: v[6], moved: v[7] === 1, moved_m: v[8], sights: v[9], z: v[10] })), work: cut(worlds.length, 3, (v) => ({ kind: ['none', 'scan', 'overlap', 'tie', 'slide', 'plane', 'screen'][v[0]] || 'none', target: v[1], gain: v[2] })) };
}
export function roomFaces(planes) { if (!MOD) throw new Error('the module is not compiled yet: await load() first'); const x = new WebAssembly.Instance(MOD, {}).exports; if (typeof x.scene_room_faces !== 'function' || !planes.length) return null; const K = { floor: 0, ceiling: 1, wall: 2, unknown: 4 }, V = (v) => (Array.isArray(v) && v.length === 3 ? v : [NaN, NaN, NaN]), w = planes.flatMap((q) => [K[q && q.kind] ?? 3, ...V(q && q.n), q && q.d, ...V(q && q.centre), q && q.extent_m && q.extent_m.w, q && q.extent_m && q.extent_m.h].map((v) => (typeof v === 'number' ? v : NaN))), m = x.memory, at = Math.ceil(m.buffer.byteLength / 8) * 8, o = at + 8 * w.length; if (m.buffer.byteLength < o + 8 * planes.length) m.grow(Math.ceil((o + 8 * planes.length - m.buffer.byteLength) / 65536)); new Float64Array(m.buffer, at, w.length).set(w); const k = x.scene_room_faces(at, w.length, o, planes.length); return k === planes.length ? Array.from(new Float64Array(m.buffer, o, k)) : null; }   /* THE LAW IS HEARD AND DRAWN (Nov 10 2026, room_law.rs scene_room_faces and scene_room_law): roomFaces(planes) (a posting's planes { kind, n, d, centre, extent_m }) -> each plane's word (0 not the room's, 1 the room's as it stands, 3 a wall seen at one end only, its doubt times that), null on an older module; roomLaw({ belief, work }) (room/belief's and room/work's values) -> { stands, said, worlds, work, walls, things, unsaid, cut } (a row { id, sigma_m, doubt, tier, hue, bar }), null on an older module */
export function roomMesh(ask) { if (typeof W?.scene_room_mesh !== 'function') return null; const t = new Uint8Array(W.memory.buffer, W.scene_room_list_txt(), W.scene_room_list_txt_len()), b = ENC.encode(JSON.stringify(ask)); if (b.length > t.length) return null; t.set(b); const n = W.scene_room_mesh(b.length); return new Float32Array(W.memory.buffer, W.scene_room_mesh_f32(), 12 * n).slice(); }   // THE PHONE'S WINDOW DRAWS THE BOARD'S ROOM (Nov 12 2026, room_mesh.rs): the room list's ask -> its rows as the lot's vertices (12 floats a vertex, metres in the scene's frame), or null on a module before the door
export function news(was, now) { if (typeof W?.scene_news !== 'function') return null; const t = new Uint8Array(W.memory.buffer, W.scene_news_txt(), W.scene_news_txt_len()), A = JSON.stringify(was), B = JSON.stringify(now), a = ENC.encodeInto(String(A), t), b = ENC.encodeInto(String(B), t.subarray(a.written)); if (a.read !== String(A).length || b.read !== String(B).length) return null; const r = W.scene_news(a.written, b.written); return r < 0 ? null : r === 1; }   // ONLY NEWS IS WRITTEN (Nov 24 2026, news.rs): whether `now` carries news over `was`, the value the Nest holds (past its clocks, its receipt and its doubt), by the one judge the residual measure reads with; null when the module holds no such door or the two pass its text
let LOADING = null; export function load(o = {}) { return api ? Promise.resolve(api) : LOADING || (LOADING = loadOnce(o).finally(() => { LOADING = null; })); }   // one load in flight: two callers at once share it, so the module is instantiated once
async function loadOnce(o = {}) { const { buf, module } = await moduleBytes(o); const a = await instantiate(buf); a.module = module; return a; }
/** moduleBytes({bytes, url, sha256, nest}) -> { buf, module: { sha256, named, checked: 'match' | 'mismatch' | 'unchecked' } }: THE BYTES ARE THE NAMED ONES (THE FIRE, Nov 16 2026; foundation 9, "verified by hash before it runs", as SceneLaw.swift): their sha256 against the house's (`sha256`, else the Nest's word scene/module wasm_sha256, one GET beside a page's fetch, at the house's door);
 *  three words: 'match' (the bytes are the named ones), 'mismatch' (they are not: the module runs and says so, never refused), 'unchecked' (no word in hand: the Nest away, a file read, no WebCrypto outside a secure context). Whether a glass refuses on a mismatch is his ruling, not built. COST: one digest a load.
 *  The Nest asked is the page's own (nestHere): the lander's walks read this lane's first cut asking http://127.0.0.1:8904 from pages a scratch house served on another host (Nov 17 2026, 01:45 UTC: 6 requests to the live house in two walks). */
export const nestHere = (loc = globalThis.location, port = globalThis.__NEST_PORT) => {   /* the Nest this page reads, as the glass pages name it (field-glass.mjs nestOfPage): its own origin on the house's front, ?nest=<an origin> when the page was given one, else the page's own host on the Nest's port (aiolos injects __NEST_PORT); null where there is no http page (node, a file) */
  if (!loc || !/^https?:$/.test(loc.protocol || '') || !loc.hostname) return null; const own = houseDoor(null, loc); if (own) return own;
  let q = null; try { q = new URLSearchParams(loc.search || '').get('nest'); } catch { q = null; }
  return q && /^https?:\/\/[^/?#\s]+$/.test(q) ? q : `${loc.protocol}//${loc.hostname}:${port || 8904}`;
};
export async function moduleBytes({ bytes = null, url = null, sha256 = null, nest = null } = {}) {
  const at = url || new URL('./wasm/embertide-scene.wasm', import.meta.url), file = !bytes && typeof process !== 'undefined' && !!process.versions?.node && String(at).startsWith('file:');
  const door = (bytes || file) && !nest ? null : nest || nestHere();   /* handed bytes and a file read ask no Nest unless one is named */
  const word = sha256 || !door ? Promise.resolve(sha256) : fetch(`${door}/nest/ref/scene/module`, { cache: 'no-store' }).then((r) => (r.ok ? r.json() : null)).then((j) => j?.ref?.value?.wasm_sha256 ?? null, () => null);
  const buf = bytes || (file ? await import('node:fs/promises').then((F) => F.readFile(new URL(at))).catch(() => { throw new Error('embertide-scene.wasm: not in this tree (every tree holds it: the lander lays it at the gate, THE WASM IS DERIVED; a seat builds it with embertide-scene/build.sh)'); })
    : await fetch(at).then((r) => { if (!r.ok) throw new Error('embertide-scene.wasm: http ' + r.status); return r.arrayBuffer(); }));
  const sub = globalThis.crypto?.subtle, own = sub ? Array.from(new Uint8Array(await sub.digest('SHA-256', buf)), (x) => x.toString(16).padStart(2, '0')).join('') : null, named = (await word) || null;
  return { buf, module: { sha256: own, named, checked: named && own ? (named === own ? 'match' : 'mismatch') : 'unchecked' } };
}

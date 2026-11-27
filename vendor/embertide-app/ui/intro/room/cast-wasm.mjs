// cast-wasm.mjs · HER CAST IN THE ONE WASM (Oct 18 2026). His words: "THE ANAMORPHIC PROJECTION IS CASTED FROM THE WASM NEXUS DONT FUCKING FORGET IT DUDE
// PORCODDIO BECAUSE AR IS ALSO A WASM-NEXUS PROJECTION" (15:36 WEST); "do you understand that the anamorphic ovelray must be coordinated by the WASM NEXUS?"
// (16:02, to the TOTEM seat). house/embertide-scene carries her cast since this day (cast.rs: one-law.mjs fold, frustum, project, intersectsAperture and
// viewOf and one.mjs's square, held to them bit for bit by tests/cast.rs, and HER BOSS ENTRANCE AT THE FIRST BUBBLE, born there). The bytes are the scene's
// own, ./wasm/embertide-scene.wasm (her, the flock and the horde in one module by hash on every glass and in the phone's fold), and this file is the whole
// glue for its cast doors, no bindgen. It instantiates the bytes for itself (the horde's glue does the same): the program it holds is its own.
// The API below uses Station planes {c,n,r,u,w,h}; now is always the caller's house instant.
import { moduleBytes } from './scene-wasm.mjs';   /* the bytes and their word: one loader for the one module (THE FIRE) */
export const CAST_N = 44, CAST_POINT_N = 15, ENTRANCE_POINTS = 6;
let x = null, S = 0, ENC = null, api = null, making = null;
const fin = (v) => typeof v === 'number' && Number.isFinite(v);
const NO = Object.freeze({});
/** cageIn(IN, room): EVERY LAYER OBEYS THE ROOM: the room's cage (one-air.mjs roomOf: { floor: [[x, z]], y0, height }) at IN[40..59] as zone.rs Room::of reads it; undefined: not asked (0), null: no closed cage (-1: nothing is drawn). */
export const cageIn = (i, room) => { i.fill(NaN, 40, 59); if (!room) i[40] = room === undefined ? 0 : -1; else { const f = room.floor.slice(0, 8); i[40] = f.length; f.forEach((c, k) => { i[41 + 2 * k] = c[0]; i[42 + 2 * k] = c[1]; }); i[57] = room.y0; i[58] = room.y0 + room.height; } };

/** The bytes of embertide-scene.wasm, in hand -> the cast's doors. One instance a module: two calls in flight share the one being made. */
export function instantiate(bytes) {
  if (api) return Promise.resolve(api);
  return making ??= make(bytes).finally(() => { making = null; });
}
async function make(bytes) {
  const { instance } = await WebAssembly.instantiate(bytes, {});
  x = instance.exports;
  if (typeof x.scene_cast !== 'function' || typeof x.scene_entrance !== 'function' || typeof x.scene_cast_point !== 'function') throw new Error('embertide-scene.wasm: no cast doors (a module older than her cast)');
  S = x.scene_this(); ENC = new TextEncoder();
  x.scene_frame(S, 0, 0, NaN, NaN, NaN, NaN);   // the overlay and native AR take the path in the scene's metres; these unset bounds invent no room, a valid path supplies the whole pose
  const law = typeof x.scene_law_id === 'function' ? new TextDecoder().decode(new Uint8Array(x.memory.buffer, x.scene_law_id(), x.scene_law_id_len())) : null;   // THE MODULE IS ONE LAW (Nov 7 2026): the law these bytes carry, said in the lens
  const IN = () => new Float64Array(x.memory.buffer, x.scene_in(S), x.scene_in_len());
  const OUT = (n) => new Float64Array(x.memory.buffer, x.scene_out(S), n);
  let held;   // the program the module holds: the object handed (a Nest value or an entrance's), or null
  let E = null;   // the last entrance laid: { obj, args }; reusing it preserves object identity
  /** The plane at IN[0..14] in the doors' layout (centre, right, up, normal, width, height), the eye at 14..17, the part of the glass at 17..21. */
  function put(i, plane, eye, rect) {
    i.fill(NaN, 0, 31);
    if (!plane) return;
    i.set(plane.c, 0); i.set(plane.r, 3); i.set(plane.u, 6); i.set(plane.n, 9); i[12] = plane.w; i[13] = plane.h;
    if (eye) i.set(eye, 14);
    if (rect) { i[17] = fin(rect.x) ? rect.x : NaN; i[18] = fin(rect.y) ? rect.y : NaN; i[19] = fin(rect.w) ? rect.w : NaN; i[20] = fin(rect.h) ? rect.h : NaN; }
  }
  const nan = (v) => (Number.isNaN(v) ? null : v);
  const label = (i) => { const q = held && Array.isArray(held.points) ? held.points[i] : null; return q && q.at != null ? q.at : null; };
  api = { law,
    glassInFrame(look, join, aspect) {
      const m = join?.world_from_frame; if (!Array.isArray(look?.at) || look.at.length !== 3 || !look.at.every(fin) || !Array.isArray(m) || m.length !== 12 || !m.every(fin) || typeof x.scene_agents_look_in_frame !== 'function') return null;
      const i = IN(); i.set(look.at, 0); i[3] = look.yaw_deg; i[4] = look.pitch_deg; i[5] = look.roll_deg; i[6] = look.fov_deg; i.set(m, 7);   // holy: input marshaling of the native lens to the existing Rust glass_of_look law; no projection here
      if (x.scene_agents_look_in_frame(S, aspect) !== 22) return null;
      const o = OUT(22), v = (a) => Array.from(o.subarray(a, a + 3));
      return { plane: { c: v(0), r: v(3), u: v(6), n: v(9), w: o[12], h: o[13] }, eye: v(14), forward: v(17), fov_deg: o[20], aspect: o[21] };   // holy: output marshaling of the Rust lens law; the module owns the projection
    },
    /** her program, handed to the module (TXT, scene_her_path) only when it is not the one held. -> whether the module holds a program. */
    program(pr) {
      if (pr === held) return held != null;
      if (pr && E && pr === E.obj) return api.entrance(E.args) === E.obj;
      held = pr ?? null;
      const text = held ? JSON.stringify(held) : '';
      const buf = new Uint8Array(x.memory.buffer, x.scene_txt(S), x.scene_txt_len());
      const { read, written } = text ? ENC.encodeInto(text, buf) : { read: 0, written: 0 };
      if (!text || read < text.length || written >= buf.length) { x.scene_her_path(S, 0); held = null; return false; }   // a program past the buffer casts nothing: the law reads a value whole or not at all
      if (x.scene_her_path(S, written) !== 1) { held = null; return false; }
      return true;
    },
    /** HER BOSS ENTRANCE AT THE FIRST BUBBLE: the program the read lays (cast.rs entrance), held by the module, and as a program object for the page
     *  (golem-path/1: its points, labels, bars, grid and eye; `scale` her figure's fit, `entrance` the cause). Its eye is anchored at his seat before the
     *  code's glass (follow: false, one.mjs THE EYE IS ANCHORED IN THE TWIN); the phone that read the code is his eye while its pose is fresh (THE PHONE IS
     *  HIS EYE). null when the read or the glass is not one. */
    entrance({ read_ms, hit_ms = NaN, beat_ms = NaN, glass, plane, frame = null } = NO) {
      if (!fin(read_ms) || typeof glass !== 'string' || !glass || !plane) return null;
      const args = { read_ms, hit_ms, beat_ms, glass, plane, frame };
      put(IN(), plane, null, null);
      const units = new Uint16Array(x.memory.buffer, x.scene_u16(S), x.scene_u16_len()), n = Math.min(glass.length, units.length);
      for (let k = 0; k < n; k++) units[k] = glass.charCodeAt(k);
      if (x.scene_entrance(S, read_ms, fin(hit_ms) ? hit_ms : NaN, fin(beat_ms) ? beat_ms : NaN, n) !== ENTRANCE_POINTS) return null;
      const o = OUT(4 * ENTRANCE_POINTS + 8), g = 4 * ENTRANCE_POINTS;
      const at = [`the dark in ${glass}`, `inside ${glass}`, `on ${glass}'s glass`, `out of ${glass}`, `before ${glass}`, `before ${glass}`];   // cast.rs entrance's labels
      const points = at.map((label, k) => ({ p: [o[k * 4], o[k * 4 + 1], o[k * 4 + 2]], at: label, ...(Number.isNaN(o[k * 4 + 3]) ? {} : { bars: o[k * 4 + 3] }) }));
      held = { schema: 'embertide.golem-path/1', ...(typeof frame === 'string' && frame ? { frame } : {}), golem: 'lyssajudron', name: 'entrance', home: glass,
        eye: [o[g + 4], o[g + 5], o[g + 6]], follow: false, grid: { epoch_ms: o[g], beat_ms: o[g + 1], beats_per_bar: o[g + 2], source: 'the read' }, t0_beat: o[g + 3], loop: false,
        points, scale: o[g + 7], entrance: { read_ms, hit_ms: fin(hit_ms) ? hit_ms : null, glass } };
      if (E && Object.is(E.args.read_ms, read_ms) && Object.is(E.args.hit_ms, hit_ms) && Object.is(E.args.beat_ms, beat_ms) && E.args.glass === glass && E.args.plane === plane && E.args.frame === frame) { held = E.obj; return held; }   // Object.is: an unsaid hit (NaN) is the same unsaid hit   // the same cause and glass: the same object, so a page's identity checks hold
      E = { obj: held, args };
      return held;
    },
    /** her on this glass at now, by the program the module holds (cast.rs cast and square) -> viewOf's answer, with `square` when a box was handed. */
    cast(now, { plane, eye, rect = null, fold = true, anamorphic = false, body = NaN, box = null, side = NaN, reach = NaN } = NO) {
      if (held == null || !plane || !eye) return null;
      const i = IN(); put(i, plane, eye, rect);
      if (box) { i[21] = box.x; i[22] = box.y; i[23] = box.w; i[24] = box.h; i[25] = side; i[26] = reach; }
      if (x.scene_cast(S, now, fold ? 1 : 0, anamorphic ? 1 : 0, fin(body) && body > 0 ? body : NaN) !== CAST_N) return null;
      const o = OUT(CAST_N), e = [o[21], o[22], o[23]];
      const frustum = { l: o[14], r: o[15], b: o[16], t: o[17], near: o[18], far: o[19], d: o[20], eye: e, x: plane.r, y: plane.u, z: plane.n };
      const leg = o[3], to = o[5] < 0 ? null : o[5];
      return { p: [o[0], o[1], o[2]], leg, k: o[4], at: label(leg), to: to == null ? null : label(to), bar: o[6], moving: o[7] === 1, done: o[8] === 1,
        plane, shown: [o[9], o[10], o[11]], as: o[12] === 1 ? 'mirror' : 'window', side_m: o[13], frustum,
        picture: Number.isNaN(o[24]) ? null : [o[24], o[25]], share: nan(o[27]), seen: o[28] === 1, body: o[29],
        square: o[30] === 1 ? { k: o[31], cx: o[32], cy: o[33], sq: { x: o[34], y: o[35], w: o[36], h: o[37] },
          frustum: o[38] === 1 ? { l: o[39], r: o[40], b: o[41], t: o[42], near: o[43], eye: e, x: plane.r, y: plane.u, z: plane.n } : null } : null };
    },
    /** one point of hers on this glass, `across` metres (cast.rs cast_point; volume: the glass's cut before it, cast_point_as) -> { p, as, side_m, px, seen, frustum }, or null when the eye is not before it. */
    point(plane, eye, rect, p, across, volume = false) {
      if (!plane || !eye || !Array.isArray(p)) return null;
      const i = IN(); put(i, plane, eye, rect); i[28] = p[0]; i[29] = p[1]; i[30] = p[2];
      if (x.scene_cast_point(S, across, volume ? 1 : 0) !== CAST_POINT_N) return null;
      const o = OUT(CAST_POINT_N); return { p: [o[0], o[1], o[2]], as: o[3] === 1 ? 'mirror' : 'window', side_m: o[4], px: Number.isNaN(o[5]) ? null : [o[5], o[6], o[7]], seen: o[8] === 1, frustum: { l: o[9], r: o[10], b: o[11], t: o[12], near: o[13], d: o[14], eye: [...eye], x: plane.r, y: plane.u, z: plane.n } };
    },
    /** THE WINDOW IS A DOOR (Nov 7 2026, cast.rs slide): his drag of the thing at p on this glass, his finger now at (sx, sy) in shares of its picture -> { p: its new place in the space, z: its depth along the view, unchanged }, or null. fold: a thing before the glass slides as the glass shows it, its mirror. */
    slide(plane, eye, rect, p, sx, sy, fold = true) { if (!plane || !eye || !Array.isArray(p) || typeof x.scene_slide !== 'function') return null; const i = IN(); put(i, plane, eye, rect); i[28] = p[0]; i[29] = p[1]; i[30] = p[2]; if (x.scene_slide(S, sx, sy, fold ? 1 : 0) !== 4) return null; const o = OUT(4); return { p: [o[0], o[1], o[2]], z: o[3] }; },
    /** THE AIR ON THE OVERLAYS AND TV3 (aircast.rs): his traces as the room's air, placed on a glass by the one line. lay once a room, at once a frame; cast: 4 floats a point. */
    air: { cy: () => x.crystal_this(), F: (p, n) => new Float32Array(x.memory.buffer, p, n),
      lay(C, floor, y0, height) { const c = this.cy(), n = Math.min(C.n, x.crystal_traces_len() / 6), nf = Math.min(floor.length, x.crystal_floor_len() / 2);
        this.F(x.crystal_traces(c), 6 * n).set(C.traces.subarray(0, 6 * n)); new Uint32Array(x.memory.buffer, x.crystal_near(c), 3 * n).set(C.near.subarray(0, 3 * n)); this.F(x.crystal_floor(c), 2 * nf).set(floor.slice(0, nf).flat());
        return x.crystal_deliver(c, n, nf, y0, height, 1) === 1 ? n : 0; },
      plane: (n, k, weeks) => x.crystal_air(x.crystal_this(), n, k, weeks, -1), starts: (n) => Array.from({ length: 9 }, (_, i) => x.crystal_at(n, i)), visible: () => x.crystal_visible_points(),
      beats: (house, at, g) => x.crystal_beats(house, at, g.epoch_ms, g.beat_ms, g.beats_per_bar),
      cut(n, plane, eye, rect, sigma) { put(IN(), plane, eye, rect); const m = x.crystal_cut(this.cy(), S, n, 0, fin(sigma) ? sigma : NaN); return m ? this.F(x.crystal_px(), 4 * m) : null; },   // THE SCREEN CUTS THE ROOM VOLUME (zone.rs): this glass's part of the room's air; his eye and its doubt only sway it
      world(n) { const m = x.crystal_world(this.cy(), n); return m ? this.F(x.crystal_px(), 4 * m) : null; },
      colours(n) { const c = this.cy(); return { rgb: this.F(x.crystal_rgb(c), 3 * n), mote: this.F(x.crystal_mote(c), 24 * n), line: this.F(x.crystal_line(c), 36 * n) }; } },
    /** THE MIRROR AIMS AT ANYTHING (mirror.rs): the room in a mirror at this glass, true (no aim) or turned so the aim stands at its centre. wire: 5 floats a segment; points: 3 a point; null with no glass. */
    mirror: { F: (p, n) => new Float32Array(x.memory.buffer, p, n),
      wire(plane, eye, rect, room, screens, aim) { put(IN(), plane, eye, rect); const nf = room ? room.floor.length : 0, a = aim || [NaN, NaN, NaN]; this.F(x.scene_mirror_in(), 2 * nf + screens.length).set([...(room ? room.floor.flat() : []), ...screens]);
        const n = x.scene_mirror_wire(S, nf, room ? room.y0 : NaN, room ? room.height : NaN, screens.length / 11, a[0], a[1], a[2]); return n ? this.F(x.scene_mirror_px(), 5 * n) : null; },
      points(plane, eye, rect, xyz, aim) { put(IN(), plane, eye, rect); const a = aim || [NaN, NaN, NaN]; this.F(x.scene_mirror_in(), xyz.length).set(xyz); const n = x.scene_mirror_points(S, xyz.length / 3, a[0], a[1], a[2]); return n ? this.F(x.scene_mirror_px(), 3 * n) : null; } },
    /** THE ONE POINT (one_point.rs): the Nest's word at the house instant on this glass, by its cut (no eye) -> { p, x, y, k, seen, miss_m }, or null with no glass. */
    handAim(plane, cam, index, thumb, miss = NaN) { if (typeof x.scene_hand_aim !== 'function' || !cam || !index || !thumb) return null; const i = IN(); put(i, plane, null, null); i.set(cam, 14); i.set(index, 17); i.set(thumb, 20); const k = x.scene_hand_aim(S, miss); if (!k) return null; const o = OUT(16); return { tip: [o[0], o[1], o[2]], d: [o[3], o[4], o[5]], reach: o[15], pinch_m: o[6], shut: o[7], hit: k === 2 ? { q: [o[8], o[9], o[10]], at: [o[11], o[12]], t: o[13] } : null }; },   /* HIS HAND IS ONE RAY (hand_aim.rs, Nov 10 2026): the camera through the middle of his thumb and index tips, open or shut, and its hit on `plane` (null: none asked) -> { tip, d, reach, pinch_m, shut, hit: { q, at, t (metres from the lens) } | null }; null with no ray or bytes without the door */
    onePoint(plane, eye, rect, w, t) { put(IN(), plane, eye, rect); const f = w.from || [NaN, NaN, NaN]; if (x.scene_one_point(S, f[0], f[1], f[2], w.to[0], w.to[1], w.to[2], w.at_ms, t) !== 1) return null; const o = OUT(8); return { p: [o[0], o[1], o[2]], x: o[3], y: o[4], k: o[6], seen: o[3] === o[3], miss_m: o[7] === o[7] ? o[7] : null }; },
    /** Asset transform and measured-glass projection in bounded WASM batches.
     * The host only copies coordinates and assembles triangles for its canvas. */
    /** THE PATH ENTERS THE PICTURE (way.rs path_enter, scene_path_enter; his Oct 28 2026 17:15 "make the overlays sleep while nothing in their picture moves"):
     *  a golem-path program (her tour's) -> the ms from `now` until its point stands in this picture (0: now), or until the path rests,
     *  the horizon itself (3 s) when neither by then; null without the door, a program, a place, an eye before the glass. The program crosses as text each
     *  call (read whole, held nowhere: the module's own program stands). */
    pathEnter({ now = NaN, program = null, plane = null, eye = null, W = 0, H = 0, rect = null, step_ms = NaN, horizon_ms = NaN } = NO) {
      if (typeof x.scene_path_enter !== 'function' || !program || typeof program !== 'object' || !plane || !Array.isArray(eye) || !fin(now)) return null;
      const text = JSON.stringify(program), buf = new Uint8Array(x.memory.buffer, x.scene_txt(S), x.scene_txt_len());
      const { read, written } = ENC.encodeInto(text, buf); if (read < text.length || written >= buf.length) return null;
      const i = IN(); put(i, plane, eye, rect); i[21] = rect ? 1 : 0;
      const ms = x.scene_path_enter(S, written, now, W, H, fin(step_ms) ? step_ms : NaN, fin(horizon_ms) ? horizon_ms : NaN);
      return Number.isNaN(ms) ? null : ms;
    },
    projectVertices(vertices, pose, plane, eye, W, H, { rect = null, fold = true, room } = NO) {   // room: the cage the cut is held to (cageIn; only with fold 'volume')
      if (!vertices || vertices.length % 3 || !pose || !plane || !eye || !Array.isArray(pose.position)) return null;
      if (typeof x.scene_cast_vertices !== 'function') throw new Error('embertide-scene.wasm: no batched projection door');
      const i = IN(); put(i, plane, eye, rect); i.set(pose.position, 21);
      i[24] = fin(pose.scale) ? pose.scale : 1; i[25] = pose.yaw || 0;
      if (pose.q) i.set(pose.q, 26);
      i[30] = W; i[31] = H; cageIn(i, room);
      const count = vertices.length / 3, batch = Math.floor(x.scene_out_len() / 3);
      const input = new Float32Array(x.memory.buffer, x.scene_out32(S), x.scene_out32_len());
      const X = new Float32Array(count), Y = new Float32Array(count), Z = new Float32Array(count), ok = new Uint8Array(count);
      for (let at = 0; at < count; at += batch) {
        const n = Math.min(batch, count - at); input.set(vertices.subarray(at * 3, (at + n) * 3));
        if (x.scene_cast_vertices(S, n, fold === 'volume' ? (room === undefined ? 2 : 3) : fold ? 1 : 0) !== n) return null;   // 'volume': the glass's cut of the room before it (cast.rs Fold), 3 inside the room's cage
        const o = OUT(n * 3);
        for (let j = 0; j < n; j++) if (fin(o[j * 3]) && fin(o[j * 3 + 1])) {
          X[at + j] = o[j * 3]; Y[at + j] = o[j * 3 + 1]; Z[at + j] = o[j * 3 + 2]; ok[at + j] = 1;
        }
      }
      return { X, Y, Z, ok };
    },
    /** The world pose from the very door used by native AR, with her cadence (moving, next_ms: scene_her_cadence). The viewer's eye
     * affects projection only; it never rotates the shared body. */
    pose(now) {
      if (!held || held.visible === false || !fin(now)) return null;
      x.scene_her(S, now);
      const o = OUT(5); if (![...o].every(fin)) return null;
      const p = { position: [o[0], o[1], o[2]], yaw: o[3], scale: o[4], q: null }, c = typeof x.scene_her_cadence === 'function' && x.scene_her_cadence(S, now) === 1 ? OUT(2) : null;
      return c ? { ...p, moving: c[0] === 1, next_ms: nan(c[1]) } : p;   // HER CADENCE (her.rs cadence): she moves, or the next leg that moves her; a glass paints her on cause by it
    },
    /** One material field, shared with phone AR. A renderer copies its samples;
     * it never starts its own wave or animation clock. `own`: THE MEMBRANE NEEDS NO WALK (Oct 28 2026), the water of a glass the room has not measured,
     * in its own frame (her-pop.mjs ownGlassOf): her pop's pushes and taps alone, never her path's opening or crossings (ffi.rs scene_glass_portal). */
    portal(now, plane, enabled = true, own = false) {
      const door = own ? x.scene_glass_portal : x.scene_portal;
      if (typeof door !== 'function') return null;
      put(IN(), plane, null, null);
      if (door(S, now, enabled && held && plane ? 1 : 0) !== 1536) return null;
      const o = OUT(5);
      return { awake: o[0] === 1, next_ms: nan(o[1]), tick: o[2], width_m: o[3], height_m: o[4], columns: 24, rows: 16,
        samples: Array.from(new Float32Array(x.memory.buffer, x.scene_out32(S), 1536)) };
    },
    /** THE MEMBRANE STANDS (Oct 27 2026): a tap on the shared water at the house instant `ms`, named `seq` (a page's start at 1000), at the point `p`
     *  ([x, y, z] in the plane's frame, metres), `amp` in units of the opening's; true when it fell on the glass. A .wasm without the door: false.
     *  `own`: on a glass's own frame, as portal(). */
    portalTap(ms, seq, p, amp, plane, own = false) {
      const door = own ? x.scene_glass_portal_tap : x.scene_portal_tap;
      if (typeof door !== 'function' || !held || !plane || !Array.isArray(p) || p.length !== 3) return false;
      put(IN(), plane, null, null);
      return door(S, ms, seq >>> 0, p[0], p[1], p[2], amp) === 1;
    },
    /** THE MEMBRANE GIVES WAY (Oct 28 2026): her pop's push on the shared water (portal.rs Portal::push): her flight from the house instant `ms`,
     *  `flightMs` long, at `p` (the ball's point, [x, y, z] in the plane's frame, metres), `size` the ball's diameter in metres, `amp` in units of the
     *  opening's, `out` true out of the ball (the water domes toward the room, then tears) or false back into it (it dents in, then closes), named
     *  `seq`; true when it fell on the glass. A .wasm without the door: false (the caller taps instead). `own`: on a glass's own frame, as portal(). */
    portalPush(ms, seq, p, amp, flightMs, size, out, plane, own = false) {
      const door = own ? x.scene_glass_portal_push : x.scene_portal_push;
      if (typeof door !== 'function' || !held || !plane || !Array.isArray(p) || p.length !== 3) return false;
      put(IN(), plane, null, null);
      return door(S, ms, seq >>> 0, p[0], p[1], p[2], amp, flightMs, size, out ? 1 : 0) === 1;
    },
    // THE EYE RIDES THE WIRE (Nov 2 2026): his body's line off the wind's wire handed whole to the module (rig.rs line_datagram, the parity rebuilding a lost one), his head out of it
    /** rigLine(line): one line of the body stream -> the bodies the module rebuilt with it (0 or more), -1 for no datagram in it */
    rigLine(line) {
      const u8 = typeof x.scene_rig_line === 'function' && typeof line === 'string' ? new TextEncoder().encode(line) : null, buf = u8 && new Uint8Array(x.memory.buffer, x.scene_txt(S), x.scene_txt_len());
      return !u8 || !u8.length || u8.length > buf.length ? -1 : (buf.set(u8), x.scene_rig_line(S, u8.length));
    },
    /** rigEye(ms): his eye at the house instant ms, the one step from the entity the module holds (scene_rig_head: THE EYE IS BEFORE THE HEAD, the head's centre carried along the shoulders' facing, the facing's doubt in its sigma), and its last body's instant: { at [m], sigma_m, ms }, or null */
    rigEye(ms) { if (typeof x.scene_rig_head !== 'function' || !fin(ms) || x.scene_rig_state(S) !== 1) return null; const last = OUT(8)[1], o = x.scene_rig_head(S, ms) === 1 ? OUT(4) : null; return o ? { at: [o[0], o[1], o[2]], sigma_m: o[3], ms: last } : null; },
    /** rigAt(ms): his joints at the house instant ms, the one step from the entity the module holds (scene_rig_at) -> { j, ms: its last body's instant, speed }, or null (him-rows.mjs entityAt reads it). */
    rigAt(ms) { if (!fin(ms) || x.scene_rig_state(S) !== 1) return null; const last = OUT(8)[1], n = x.scene_rig_at(S, ms), o = OUT(69); return n ? { j: Float64Array.from(o.subarray(0, 68)), ms: last, speed: o[68] } : null; },
    /** the program the module holds (the object handed, or the entrance's), or null */
    held: () => held ?? null,
    /** The module's memory in bytes (the cost of this instance, for a lens). */
    memoryBytes() { return x.memory.buffer.byteLength; },
    /** THE ISLAND RANKS HIS MEMES (island.rs meme_order, scene_meme_order; Nov 4 2026): `counts` one per meme (its firings at the current kind, house/meme-ranks)
     *  -> the meme indices in laid order (the most fired first, a tie the seed order). Identity (seed order) when the module is before it or counts is empty. */
    order(counts) {
      if (typeof x.scene_meme_order !== 'function' || !Array.isArray(counts) || !counts.length || counts.length > x.scene_in_len()) return (counts || []).map((_, i) => i);
      IN().set(counts.map((c) => (Number.isFinite(c) ? c : 0)));
      const n = x.scene_meme_order(S, counts.length);
      return n ? Array.from(OUT(n), (v) => v | 0) : counts.map((_, i) => i);
    },
    /** HER DOCK IS THE ISLAND'S LEFT (island.rs dock_beside, scene_island_dock; Nov 4 2026): her box [w, h] docked beside the island [x, y, w, h] on a panel [w, h] (px), `margin` inside it -> her box's top left [x, y], or null. */
    islandDock(island, her, panel, margin = 10) { if (typeof x.scene_island_dock !== 'function' || island?.length !== 4 || her?.length !== 2 || panel?.length !== 2) return null; IN().set([...island, ...her, ...panel, margin]); return x.scene_island_dock(S) ? Array.from(OUT(2)) : null; },
    /** THE HAND OF MEMES (island.rs hand_box and hand_slots, scene_hand; Nov 10 2026): the entry [x, y, w, h] on a panel [w, h] (px), `n` lines laid, `lit` the one lit -> [x, y, w, foot, scale, then the line in each of five slots (-1 none)], or null: no hand. */
    hand(entry, panel, n, lit, margin = 10) { if (typeof x.scene_hand !== 'function' || entry?.length !== 4 || panel?.length !== 2) return null; IN().set([...entry, ...panel, margin]); return x.scene_hand(S, n, lit) ? Array.from(OUT(10)) : null; },
  };
  return api;
}
/** The cast's doors when this window already made them (another page, a test's load), else null: a page mounting after them casts her at once. */
export const ready = () => api;
/** seaWater(word): the word room/sea's water, sun and cadence as the module reads them (sea_water.rs: seaOf's defaults and clamps, once) -> { water: { near, deep, sky, alpha, fog_m }, sun, hz }, or null: no module yet, no door, no object. */ export const seaWater = (v) => { if (typeof x?.sea_water !== 'function' || !v || typeof v !== 'object') return null; const u8 = ENC.encode(JSON.stringify(v)), buf = new Uint8Array(x.memory.buffer, x.sea_water_txt(), x.sea_water_txt_len()); if (u8.length > buf.length) return null; buf.set(u8); if (x.sea_water(u8.length) !== 15) return null; const o = Array.from(new Float64Array(x.memory.buffer, x.sea_water_out(), 15)); return { water: { near: o.slice(0, 3), deep: o.slice(3, 6), sky: o.slice(6, 9), alpha: o[12], fog_m: o[13] }, sun: o.slice(9, 12), hz: o[14] }; };
export const glassShows = (procOff, lineAgeMs, placed, poseAgeMs) => (typeof x?.scene_glass_shows === 'function' ? x.scene_glass_shows(procOff ? 1 : 0, +lineAgeMs, placed ? 1 : 0, +poseAgeMs) === 1 : null), glassNextMs = (procOff, lineAgeMs, poseAgeMs) => { const ms = typeof x?.scene_glass_next_ms === 'function' ? x.scene_glass_next_ms(procOff ? 1 : 0, +lineAgeMs, +poseAgeMs) : NaN; return Number.isFinite(ms) ? ms : null; }, glassList = (ask) => { if (typeof x?.scene_glass_list !== 'function') return null; const t = new Uint8Array(x.memory.buffer, x.scene_glass_list_txt(), x.scene_glass_list_txt_len()), b = new TextEncoder().encode(JSON.stringify(ask)); if (b.length > t.length) return null; t.set(b); const n = x.scene_glass_list(b.length); return n ? JSON.parse(new TextDecoder().decode(t.subarray(0, n))) : null; }, gamePlace = (ask) => { if (typeof x?.scene_game_place !== 'function') return null; const t = new Uint8Array(x.memory.buffer, x.scene_game_txt(), x.scene_game_txt_len()), b = new TextEncoder().encode(JSON.stringify(ask)); if (b.length > t.length) return null; t.set(b); const n = x.scene_game_place(b.length), a = n ? JSON.parse(new TextDecoder().decode(t.subarray(0, n))) : null, p = a && a.place, M = p && p.matrix, k = p && p.mirror ? -1 : 1; if (Array.isArray(M) && M.length === 16) Object.assign(p, { at: (q) => (Array.isArray(q) && q.length === 3 && q.every(Number.isFinite) ? [0, 1, 2].map((i) => M[i] * q[0] + M[4 + i] * q[1] + M[8 + i] * q[2] + M[12 + i]) : null), yaw: (u) => (Number.isFinite(u) ? k * u * Math.PI / 1800 : 0) + p.heading, key: JSON.stringify([p.kind, M, p.heading, p.mirror, p.d ?? null, p.vfov_deg ?? null]) }); return a; }, gameThings = (ask) => { if (typeof x?.scene_game_things !== 'function') return null; const t = new Uint8Array(x.memory.buffer, x.scene_things_txt(), x.scene_things_txt_len()), b = new TextEncoder().encode(JSON.stringify(ask)); if (b.length > t.length) return null; t.set(b); const n = x.scene_game_things(b.length); return n ? JSON.parse(new TextDecoder().decode(t.subarray(0, n))) : null; }, lotFaces = (ask) => { if (typeof x?.scene_lot_faces !== 'function') return null; const t = new Uint8Array(x.memory.buffer, x.scene_things_txt(), x.scene_things_txt_len()), b = new TextEncoder().encode(JSON.stringify(ask)); if (b.length > t.length) return null; t.set(b); const n = x.scene_lot_faces(b.length), h = n ? JSON.parse(new TextDecoder().decode(t.subarray(0, n))) : null; return h ? { ...h, verts: new Float32Array(x.memory.buffer, x.scene_lot_faces_f32(), 12 * h.n).slice() } : null; }, gamePresent = (traj, t) => { if (typeof x?.scene_game_present !== 'function' || !Array.isArray(traj) || !traj.length) return null; const q = traj.slice(-x.scene_game_present_in_len()), b = new Float64Array(x.memory.buffer, x.scene_game_present_in(), 6 * q.length); q.forEach((s, k) => b.set([s.t, Number.isFinite(s.at) ? s.at : s.t, s.pos[0], s.pos[1], s.pos[2], Number.isFinite(s.yaw) ? s.yaw : 0], 6 * k)); if (!x.scene_game_present(q.length, Number.isFinite(t) ? t : NaN)) return null; const o = new Float64Array(x.memory.buffer, x.scene_game_present_out(), 4); return { pos: [o[0], o[1], o[2]], yaw: o[3] }; };   /* THE GAME STANDS BY THE LIST (Nov 16 2026, embertide-scene/src/glass_list.rs): the glass list's doors on this instance. glassShows: the Board's standing rule (gameLive, live only: a line, no process found off past FRESH_MS, a place, the line within HOLD_MS, a pose within LIVE_MS), ages in ms (NaN: none), null before the module; glassNextMs: ms until a standing game falls on its own, null when it does not stand; glassList(ask): the whole door ({list, game}), null on a module before it or an ask it refuses; gamePlace(ask): the game door (game.rs, scene_game_place: {place, why, figures, guests, skin}), its place's matrix applied as at(mm) -> m and yaw(tenths) -> rad, the product alone (THE PLACE IS ONE MATRIX); gameThings(ask): the things door (things.rs, scene_game_things: the game's ask with the assets -> {place, why, things: [{id, name, def, sha256, tris, model}], cut}); gamePresent(traj, t): THE SIMS AT THE PRESENT (game.rs scene_game_present: a Sim's trail as sims-law.mjs sampleInto keeps it, the house stamp -> { pos mm, yaw tenths }, the residual read again from the lines); lotFaces(ask): the lot's faces door (things.rs scene_lot_faces: the game's ask with the arch -> {n, floors, walls, ground, from, why, maps, mapped, faces, verts: STRIDE 12 a vertex, a mapped face its map's index in maps}) */
/** The cast's doors, the bytes found where a page or a test has none in hand (./wasm/embertide-scene.wasm beside this file), their sha256 said against the one the house names (scene-wasm.mjs moduleBytes: api.module says 'match', 'mismatch' (it runs and says so; refusing is his ruling) or 'unchecked' with no word in hand). */
export async function load(o = {}) { if (api) return api; const { buf, module } = await moduleBytes(o); const a = await instantiate(buf); a.module = module; return a; }

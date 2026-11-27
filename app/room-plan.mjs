// room-plan.mjs - THE ROOM ON ITS PAGE: the plan of a society's room, drawn on cause (Oct 12 2026). His words: Oct 12 09:49 "it's optimism.fit
// now. not poleis.us" (the place where all the rooms are: every polis alive a door into its own page, each one a room, his user's page his);
// Sept 2026 18:5x "it all begins with Nests where you can stream your knightian wind hologram (embertide blocks) and see the ones of others";
// Oct 4 06:25 a room pane is his room, procedural from its facts, at Pokémon secret-base level of detail, never a scripted picture; the screens'
// law: nothing at rest costs anything. The page's own words stand: "You can see its life from here. Its words open to those who belong": the
// room's life (its shell, its things, its glasses, who stands in it) is the public half, drawn for a visitor; the words stay the members'.
// WHAT IT DRAWS: one program (embertide.room-program/1, tools/embertide-mesh/lib/room-program.mjs: the room folded on the house from the Nest's
// scene and his wind, a few hundred bytes), handed by the society's body over the socket polis.js already holds, as {t:'room', program} and,
// when one presence moves, {t:'presence', id, at, yaw, placed}. A plan seen from above (x right, z down, y up out of the page): a wall its line,
// a door a dashed leaf on its wall, a window a light line, a thing its box turned by its yaw with its class, a glass a short thick line (gold
// when lit), a presence a mark with its heading and its name (his wind filled, an actor a ring); an unplaced presence stands dashed by the door
// (TWIN-2026-10-10.md 3: the unplaced stand at the door), at the plan's near corner when the room has no door. A guess is not drawn: the note
// says how many wait for the scan.
// COST: a paint is a few dozen strokes (about 0.2 ms); it happens on a program, on a presence that moved by a pixel or changed its state, and on
// the box's own resize (a cause); never on a timer; at rest 0 frames. THE READ is the house's, verbatim (a page cannot import the house's tools;
// tools/embertide-mesh/tests/room-program.test.mjs holds the two to one text).

export const INKS = Object.freeze({ wall: '#2b2620', door: '#4c7a4c', window: '#2a9fb8', thing: '#a58343', glass: '#6b6358', lit: '#c9a24a', wind: '#2b2620', actor: '#a58343', game: '#1f6f80', ink: '#2b2620', dim: '#6b6358' });
export const GLASS_DEFAULT_M = 0.6;   // a glass the program holds without a size is drawn this wide
export const FIGURE_PX = 5, HEADING_PX = 11, GHOST_STEP_PX = 14;

/** inksOf(host): the page's own palette (its CSS variables) where there is a page; INKS elsewhere. */
export function inksOf(host) {
  if (typeof getComputedStyle !== 'function' || !host || !host.nodeType) return INKS;
  const cs = getComputedStyle(host), v = (name, fallback) => (cs.getPropertyValue(name) || '').trim() || fallback;
  return { ...INKS, wall: v('--ink', INKS.wall), door: v('--laurel', INKS.door), thing: v('--bronze', INKS.thing), glass: v('--ink2', INKS.glass), lit: v('--gold', INKS.lit), wind: v('--ink', INKS.wind), actor: v('--bronze', INKS.actor), ink: v('--ink', INKS.ink), dim: v('--ink2', INKS.dim) };
}

/** planOf(program, {w, h, pad}): the plan in canvas pixels, pure: segs (walls), openings, boxes (things), glasses (screens), figures (presences),
 *  `at(x, z)` the projection it used, `door` where the unplaced stand. null when the program holds nothing to place. */
export function planOf(program, { w = 380, h = 285, pad = 18 } = {}) {
  if (!program) return null;
  const pts = [];
  for (const wl of program.walls) pts.push([wl.a[0], wl.a[2]], [wl.b[0], wl.b[2]]);
  for (const t of program.things) { const r = Math.hypot(t.size_m[0], t.size_m[2]) / 2; pts.push([t.at[0] - r, t.at[2] - r], [t.at[0] + r, t.at[2] + r]); }
  for (const s of program.screens) pts.push([s.at[0], s.at[2]]);
  for (const p of program.presences) if (p.placed) pts.push([p.at[0], p.at[2]]);
  if (!pts.length) return null;
  let x0 = Infinity, x1 = -Infinity, z0 = Infinity, z1 = -Infinity;
  for (const [x, z] of pts) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); z0 = Math.min(z0, z); z1 = Math.max(z1, z); }
  const dx = Math.max(1, x1 - x0), dz = Math.max(1, z1 - z0), scale = Math.max(1e-6, Math.min((w - 2 * pad) / dx, (h - 2 * pad) / dz));
  const ox = (w - dx * scale) / 2 - x0 * scale, oz = (h - dz * scale) / 2 - z0 * scale;
  const at = (x, z) => [ox + x * scale, oz + z * scale];
  const segs = program.walls.map((wl) => { const [ax, ay] = at(wl.a[0], wl.a[2]), [bx, by] = at(wl.b[0], wl.b[2]); return { id: wl.id, x1: ax, y1: ay, x2: bx, y2: by }; });
  const walls = Object.fromEntries(program.walls.map((wl) => [wl.id, wl]));
  const openings = [...program.doors.map((o) => ({ ...o, kind: 'door' })), ...program.windows.map((o) => ({ ...o, kind: 'window' }))].map((o) => {
    const wl = walls[o.wall], ux = wl.b[0] - wl.a[0], uz = wl.b[2] - wl.a[2], L = Math.hypot(ux, uz) || 1, hx = (ux / L) * o.width_m / 2, hz = (uz / L) * o.width_m / 2;
    const [x1, y1] = at(o.at[0] - hx, o.at[2] - hz), [x2, y2] = at(o.at[0] + hx, o.at[2] + hz); return { id: o.id, kind: o.kind, x1, y1, x2, y2 }; });
  const boxes = program.things.map((t) => { const [cx, cy] = at(t.at[0], t.at[2]); return { id: t.id, cx, cy, w: Math.max(2, t.size_m[0] * scale), d: Math.max(2, t.size_m[2] * scale), yaw: t.yaw, label: t.kind }; });
  const glasses = program.screens.map((s) => {   // the glass's own +x is (cos yaw, 0, -sin yaw): the house's rotation.y
    const half = (s.size_m ? s.size_m[0] : GLASS_DEFAULT_M) / 2, rx = Math.cos(s.yaw) * half, rz = -Math.sin(s.yaw) * half;
    const [x1, y1] = at(s.at[0] - rx, s.at[2] - rz), [x2, y2] = at(s.at[0] + rx, s.at[2] + rz); return { id: s.id, x1, y1, x2, y2, lit: s.lit === true }; });
  const door = program.doors[0] ? at(program.doors[0].at[0], program.doors[0].at[2]) : at(x0, z1);   // where the unplaced stand: by the door, else the plan's near corner
  let ghosts = 0;
  const figures = program.presences.map((p) => { const [x, y] = p.placed ? at(p.at[0], p.at[2]) : [door[0] + GHOST_STEP_PX * ghosts++, door[1] - 12]; return { id: p.id, kind: p.kind, title: p.title, x, y, yaw: p.yaw, placed: p.placed, playing: p.playing }; });
  return { w, h, scale, at, segs, openings, boxes, glasses, figures, door };
}

/** paint(ctx, plan, inks, {w, h, dpr}): the plan on a 2D context; returns the strokes made. A null plan clears the box. */
export function paint(ctx, plan, ink = INKS, { w = 380, h = 285, dpr = 1 } = {}) {
  ctx.save(); ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
  if (!plan) { ctx.restore(); return 0; }
  let strokes = 0;
  ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.font = '10px ui-monospace, Menlo, monospace'; ctx.textBaseline = 'middle';
  ctx.strokeStyle = ink.wall; ctx.lineWidth = 2; ctx.setLineDash([]);
  for (const s of plan.segs) { ctx.beginPath(); ctx.moveTo(s.x1, s.y1); ctx.lineTo(s.x2, s.y2); ctx.stroke(); strokes++; }
  for (const o of plan.openings) { ctx.strokeStyle = o.kind === 'door' ? ink.door : ink.window; ctx.lineWidth = 4; ctx.setLineDash(o.kind === 'door' ? [4, 3] : []); ctx.beginPath(); ctx.moveTo(o.x1, o.y1); ctx.lineTo(o.x2, o.y2); ctx.stroke(); strokes++; }
  ctx.setLineDash([]);
  for (const b of plan.boxes) { ctx.save(); ctx.translate(b.cx, b.cy); ctx.rotate(-b.yaw); ctx.strokeStyle = ink.thing; ctx.lineWidth = 1; ctx.strokeRect(-b.w / 2, -b.d / 2, b.w, b.d); ctx.restore(); strokes++; ctx.fillStyle = ink.dim; ctx.textAlign = 'center'; ctx.fillText(b.label, b.cx, b.cy); }
  for (const g of plan.glasses) { ctx.strokeStyle = g.lit ? ink.lit : ink.glass; ctx.lineWidth = g.lit ? 5 : 4; ctx.beginPath(); ctx.moveTo(g.x1, g.y1); ctx.lineTo(g.x2, g.y2); ctx.stroke(); strokes++; ctx.fillStyle = ink.dim; ctx.textAlign = 'center'; ctx.fillText(g.id, (g.x1 + g.x2) / 2, (g.y1 + g.y2) / 2 - 9); }
  for (const f of plan.figures) {
    const c = ink[f.kind] || ink.ink; ctx.setLineDash(f.placed ? [] : [3, 3]); ctx.strokeStyle = c; ctx.fillStyle = c; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(f.x, f.y, FIGURE_PX, 0, Math.PI * 2); if (f.kind === 'wind' && f.placed) ctx.fill(); else ctx.stroke(); strokes++;
    if (f.yaw !== null && f.yaw !== undefined && f.placed) { ctx.beginPath(); ctx.moveTo(f.x, f.y); ctx.lineTo(f.x + Math.sin(f.yaw) * HEADING_PX, f.y + Math.cos(f.yaw) * HEADING_PX); ctx.stroke(); }   // its heading: local +z turned by its yaw
    ctx.setLineDash([]); ctx.fillStyle = ink.ink; ctx.textAlign = 'left'; ctx.fillText(f.title, f.x + FIGURE_PX + 4, f.y);
  }
  ctx.restore(); return strokes;
}

/** noteOf(program, why): the one line under the plan: what stands, how many guesses wait, and why the room is as last seen when it is. */
export function noteOf(program, why = '') {
  if (!program) return '';
  const n = (k, one, many) => `${k} ${k === 1 ? one : many}`;
  const parts = [n(program.walls.length, 'wall', 'walls'), n(program.things.length, 'thing', 'things'), n(program.screens.length, 'glass', 'glasses'), `${program.presences.length} here`];
  if (program.guesses) parts.push(`${n(program.guesses, 'guess', 'guesses')} waiting for the scan`);
  if (why) parts.push(why);
  return parts.join(' · ');
}

/** mountRoomPlan(host, {inks, dpr, observe}): the box (a canvas and a [data-note] line) kept drawn on cause. -> { program(p), presence(d), offline(why), dispose(), stats }.
 *  program(p) draws the program (a read one, readProgram); presence(d) moves one figure and paints only if it moved by a pixel or changed state;
 *  offline(why) keeps the drawing and says so in the note; the box's own resize repaints (a cause). No timer, ever. */
export function mountRoomPlan(host, { inks = null, dpr = typeof devicePixelRatio === 'number' ? devicePixelRatio : 1, observe = typeof ResizeObserver === 'function' ? ResizeObserver : null } = {}) {
  const canvas = host && typeof host.querySelector === 'function' ? host.querySelector('canvas') : null, note = canvas ? host.querySelector('[data-note]') : null;
  if (!canvas) return null;
  const S = { program: null, plan: null, ink: inks || inksOf(host), w: 0, h: 0, why: '', stats: { paints: 0, skipped: 0 } };
  const size = () => { const w = Math.max(1, Math.round(canvas.clientWidth || 380)), h = Math.max(1, Math.round(canvas.clientHeight || w * 0.75)); return [w, h]; };
  const say = () => { if (note) note.textContent = noteOf(S.program, S.why); };
  const draw = () => {
    const [w, h] = size(), ctx = canvas.getContext('2d'); if (!ctx) return false;
    if (S.w !== w || S.h !== h) { S.w = w; S.h = h; canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr); }
    S.plan = planOf(S.program, { w, h }); paint(ctx, S.plan, S.ink, { w, h, dpr }); S.stats.paints++; say(); return true;
  };
  const ro = observe ? new observe(() => { if (S.program) draw(); }) : null; if (ro) ro.observe(canvas);
  return {
    stats: S.stats,
    program(p) { if (!p) return false; S.program = p; S.why = ''; host.hidden = false; return draw(); },
    presence(d) {
      if (!S.program || !d) return false;
      const i = S.program.presences.findIndex((x) => x.id === d.id); if (i < 0) { S.stats.skipped++; return false; }
      const f = S.program.presences[i], before = S.plan ? S.plan.figures.find((x) => x.id === d.id) : null;
      const next = { ...f, at: d.at, yaw: d.yaw === undefined ? f.yaw : d.yaw, placed: d.placed === undefined ? f.placed : d.placed, playing: d.playing === undefined ? f.playing : d.playing };
      let changed = !before || next.placed !== f.placed || next.playing !== f.playing || Math.abs((next.yaw ?? 0) - (f.yaw ?? 0)) > 0.05;
      if (!changed && next.placed) { const [x, y] = S.plan.at(next.at[0], next.at[2]); changed = Math.hypot(x - before.x, y - before.y) >= 1; }
      if (!changed) { S.stats.skipped++; return false; }   // under a pixel: the drawn figure stands; the next move is measured from it
      S.program = { ...S.program, presences: S.program.presences.map((x, k) => (k === i ? next : x)) }; S.why = ''; return draw();
    },
    offline(why) { if (!S.program) return; S.why = why ? `the room as last seen: ${why}` : 'the room as last seen'; say(); },
    dispose() { if (ro) ro.disconnect(); S.program = null; S.plan = null; },
  };
}

// ---- THE READ (the house's, verbatim: tools/embertide-mesh/lib/room-program.mjs; its test holds the two to one text) ----
export const READ = Object.freeze({ schema: 'embertide.room-program/1', walls: 64, openings: 64, things: 64, screens: 16, presences: 32, coord: 100, size: 20, title: 80, word: 32, kinds: ['wind', 'actor', 'game'] });
const rNum = (v) => typeof v === 'number' && Number.isFinite(v);
const rId = (s) => (typeof s === 'string' && /^[\w.:-]{1,64}$/.test(s) ? s : null);
const rVec = (v, lim) => (Array.isArray(v) && v.length === 3 && v.every((x) => rNum(x) && Math.abs(x) < lim) ? [v[0], v[1], v[2]] : null);
const rYaw = (v) => (rNum(v) && Math.abs(v) <= 7 ? v : null);
const rWord = (s, n) => (typeof s === 'string' && s && s.length <= n ? s : null);
const rList = (v, n, f) => { if (!Array.isArray(v) || v.length > n) return null; const out = []; for (const x of v) { const y = f(x); if (!y) return null; out.push(y); } return out; };
/** readProgram(x): the program as the page keeps it, or null: a program that does not read whole is not drawn at all (never half). */
export function readProgram(x) {
  if (!x || typeof x !== 'object' || x.schema !== READ.schema || x.units !== 'm' || x.up !== 'y') return null;
  const walls = rList(x.walls, READ.walls, (w) => { const id = rId(w?.id), a = rVec(w?.a, READ.coord), b = rVec(w?.b, READ.coord); return id && a && b && rNum(w.height_m) && w.height_m > 0 && w.height_m < READ.size ? { id, a, b, height_m: w.height_m } : null; });
  const opening = (o) => { const id = rId(o?.id), wall = rId(o?.wall), at = rVec(o?.at, READ.coord); return id && wall && at && rNum(o.width_m) && o.width_m > 0 && o.width_m < READ.size ? { id, wall, at, width_m: o.width_m, height_m: rNum(o.height_m) ? o.height_m : null } : null; };
  const doors = rList(x.doors, READ.openings, opening), windows = rList(x.windows, READ.openings, opening);
  const things = rList(x.things, READ.things, (t) => { const id = rId(t?.id), at = rVec(t?.at, READ.coord), size = rVec(t?.size_m, READ.size), yaw = rYaw(t?.yaw), kind = rWord(t?.kind, READ.word); return id && at && size && yaw !== null && kind && size.every((s) => s > 0) ? { id, kind, at, yaw, size_m: size } : null; });
  const screens = rList(x.screens, READ.screens, (s) => { const id = rId(s?.id), at = rVec(s?.at, READ.coord), yaw = rYaw(s?.yaw); const size = s?.size_m == null ? null : Array.isArray(s.size_m) && s.size_m.length === 2 && s.size_m.every((v) => rNum(v) && v > 0 && v < READ.size) ? [s.size_m[0], s.size_m[1]] : undefined; return id && at && yaw !== null && size !== undefined ? { id, at, yaw, size_m: size, lit: s.lit === true ? true : s.lit === false ? false : null, registration: rWord(s.registration, READ.word) } : null; });
  const presences = rList(x.presences, READ.presences, (p) => { const id = rId(p?.id), at = rVec(p?.at, READ.coord), title = rWord(p?.title, READ.title); return id && at && title && READ.kinds.includes(p.kind) ? { id, kind: p.kind, title, at, yaw: rYaw(p.yaw), placed: p.placed !== false, playing: p.playing === true } : null; });
  if (!walls || !doors || !windows || !things || !screens || !presences) return null;
  if (!walls.length && !screens.length && !presences.length) return null;
  const held = new Set(walls.map((w) => w.id));
  if (doors.some((o) => !held.has(o.wall)) || windows.some((o) => !held.has(o.wall))) return null;
  const guesses = Number.isSafeInteger(x.guesses) && x.guesses >= 0 ? x.guesses : 0, at_ms = Number.isSafeInteger(x.at_ms) && x.at_ms >= 0 ? x.at_ms : 0;
  return { schema: READ.schema, frame: rWord(x.frame, 64), scan: rWord(x.scan, 64), at_ms, units: 'm', up: 'y', walls, doors, windows, things, screens, presences, guesses };
}
/** readPresence(x): one presence's move, {t:'presence', id, at, yaw?, placed?, playing?, at_ms?}, or null. A field left out leaves the figure's as it was. */
export function readPresence(x) {
  if (!x || typeof x !== 'object' || x.t !== 'presence') return null;
  const id = rId(x.id), at = rVec(x.at, READ.coord); if (!id || !at) return null;
  return { id, at, yaw: x.yaw === undefined ? undefined : rYaw(x.yaw), placed: x.placed === undefined ? undefined : x.placed !== false, playing: x.playing === undefined ? undefined : x.playing === true, at_ms: Number.isSafeInteger(x.at_ms) && x.at_ms >= 0 ? x.at_ms : 0 };
}
// ---- end of THE READ ----

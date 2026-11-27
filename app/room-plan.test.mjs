// room-plan.test.mjs - the room on its page: the plan is pure, the box paints on cause only (Oct 12 2026).
// Run: node --test --test-force-exit embertide-app/ui/intro/dyson-society/app/room-plan.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as P from './room-plan.mjs';

const program = () => P.readProgram({ schema: 'embertide.room-program/1', frame: 'station:s', scan: 's', at_ms: 1, units: 'm', up: 'y',
  walls: [{ id: 'w0', a: [-2, 0, -1.5], b: [2, 0, -1.5], height_m: 2.6 }, { id: 'w1', a: [2, 0, -1.5], b: [2, 0, 1.5], height_m: 2.6 }, { id: 'w2', a: [2, 0, 1.5], b: [-2, 0, 1.5], height_m: 2.6 }, { id: 'w3', a: [-2, 0, 1.5], b: [-2, 0, -1.5], height_m: 2.6 }],
  doors: [{ id: 'd0', wall: 'w1', at: [2, 0, 0.4], width_m: 0.9, height_m: 2 }], windows: [{ id: 'n0', wall: 'w0', at: [0, 1.2, -1.5], width_m: 1.6, height_m: 1.2 }],
  things: [{ id: 'b0', kind: 'sofa', at: [-1.5, 0.45, 0], yaw: 0, size_m: [1.8, 0.9, 0.9] }], screens: [{ id: 'tv2', at: [1.95, 1.1, -0.3], yaw: -1.571, size_m: [1.08, 0.61], lit: true }],
  presences: [{ id: 'visitor', kind: 'actor', title: 'Visitor', at: [-0.9, 0, 1.2], yaw: 3.142, placed: true, playing: false }, { id: 'wind', kind: 'wind', title: 'Knightian wind', at: [0, 0.9, 0], yaw: 0, placed: false, playing: true }], guesses: 2 });

/** a 2D context that remembers every call and every property set */
function fakeCtx() { const calls = []; return new Proxy({ calls }, { get: (t, k) => (k === 'calls' ? calls : (...a) => { calls.push([k, ...a]); }), set: (t, k, v) => { calls.push(['set', k, v]); return true; } }); }
function fakeHost({ w = 380, h = 285 } = {}) {
  const ctx = fakeCtx(), canvas = { width: 0, height: 0, clientWidth: w, clientHeight: h, getContext: () => ctx }, note = { textContent: '' };
  return { host: { hidden: true, querySelector: (s) => (s === 'canvas' ? canvas : note) }, canvas, note, ctx };
}
const paints = (ctx) => ctx.calls.filter((c) => c[0] === 'clearRect').length;

test('the plan: the room fits the box with its margin; a door lies on its wall; the unplaced stand by the door; nothing to place is no plan', () => {
  const p = program(); assert.ok(p, 'the fixture reads');
  const plan = P.planOf(p, { w: 380, h: 285, pad: 18 });
  const xs = plan.segs.flatMap((s) => [s.x1, s.x2]), ys = plan.segs.flatMap((s) => [s.y1, s.y2]);
  assert.ok(Math.min(...xs) >= 18 - 1e-9 && Math.max(...xs) <= 380 - 18 + 1e-9 && Math.min(...ys) >= 18 - 1e-9 && Math.max(...ys) <= 285 - 18 + 1e-9, 'inside the margin');
  assert.ok(Math.abs((Math.max(...xs) - Math.min(...xs)) / (Math.max(...ys) - Math.min(...ys)) - 4 / 3) < 1e-6, 'the room keeps its shape: 4 m by 3 m');
  const d = plan.openings.find((o) => o.kind === 'door'), w1 = plan.segs.find((s) => s.id === 'w1');
  assert.ok(Math.abs(d.x1 - w1.x1) < 1e-6 && Math.abs(d.x2 - w1.x1) < 1e-6, 'the door is on its wall (x = the wall\'s)');
  assert.ok(Math.abs(Math.hypot(d.x2 - d.x1, d.y2 - d.y1) - 0.9 * plan.scale) < 1e-6, 'as wide as it is');
  const n = plan.openings.find((o) => o.kind === 'window'); assert.ok(Math.abs(n.y1 - plan.segs[0].y1) < 1e-6, 'the window on the north wall');
  const ghost = plan.figures.find((f) => f.id === 'wind'), m = plan.figures.find((f) => f.id === 'visitor');
  assert.equal(ghost.placed, false); assert.deepEqual([ghost.x, ghost.y], [plan.door[0], plan.door[1] - 12], 'an unplaced presence stands by the door');
  assert.deepEqual([m.x, m.y], plan.at(-0.9, 1.2), 'a placed one where it is');
  const g = plan.glasses[0]; assert.ok(Math.abs(Math.hypot(g.x2 - g.x1, g.y2 - g.y1) - 1.08 * plan.scale) < 1e-6 && g.lit, 'the glass as wide as the screen, lit');
  assert.ok(Math.abs(g.x1 - g.x2) < 0.1, 'a glass turned -pi/2 about +y lies along z (within a tenth of a pixel: the yaw is 3 decimals)');
  assert.equal(plan.boxes[0].label, 'sofa');
  assert.equal(P.planOf({ ...p, walls: [], things: [], screens: [], presences: [p.presences[1]] }), null, 'only a ghost: nothing to place');
  assert.equal(P.planOf(null), null);
});

test('the paint: one clear, a stroke per wall, opening, thing, glass and figure; the ghost dashed, the wind filled only when placed', () => {
  const ctx = fakeCtx(), plan = P.planOf(program(), { w: 380, h: 285 });
  const strokes = P.paint(ctx, plan, P.INKS, { w: 380, h: 285, dpr: 2 });
  assert.equal(strokes, 4 + 2 + 1 + 1 + 2);
  assert.deepEqual(ctx.calls[1], ['setTransform', 2, 0, 0, 2, 0, 0]); assert.deepEqual(ctx.calls[2], ['clearRect', 0, 0, 380, 285]);
  assert.ok(ctx.calls.some((c) => c[0] === 'setLineDash' && c[1].length === 2 && c[1][0] === 3), 'the ghost is dashed');
  assert.equal(ctx.calls.filter((c) => c[0] === 'fill').length, 0, 'an unplaced wind is a ring, not a filled mark');
  assert.ok(ctx.calls.some((c) => c[0] === 'fillText' && c[1] === 'Visitor') && ctx.calls.some((c) => c[0] === 'fillText' && c[1] === 'tv2'), 'names on the plan');
  assert.equal(P.paint(fakeCtx(), null), 0, 'no plan: the box is cleared, nothing else');
});

test('the box: paints on a program, on a presence that moved a pixel or changed state, never on one that did not; offline keeps the drawing', () => {
  const { host, canvas, note, ctx } = fakeHost();
  const box = P.mountRoomPlan(host, { dpr: 2, observe: null });
  assert.ok(box); assert.equal(paints(ctx), 0, 'nothing drawn before a program');
  assert.equal(box.program(program()), true); assert.equal(host.hidden, false); assert.equal(paints(ctx), 1); assert.deepEqual([canvas.width, canvas.height], [760, 570]);
  assert.equal(note.textContent, '4 walls · 1 thing · 1 glass · 2 here · 2 guesses waiting for the scan');
  assert.equal(box.presence(P.readPresence({ t: 'presence', id: 'visitor', at: [-0.9, 0, 1.201] })), false, 'a millimetre is under a pixel');
  assert.equal(paints(ctx), 1); assert.equal(box.stats.skipped, 1);
  assert.equal(box.presence(P.readPresence({ t: 'presence', id: 'visitor', at: [-0.9, 0, 1.204] })), false, 'measured from the drawn figure, not the last skipped one');
  assert.equal(box.presence(P.readPresence({ t: 'presence', id: 'visitor', at: [-0.4, 0, 1.2] })), true, 'half a metre paints'); assert.equal(paints(ctx), 2);
  assert.equal(box.presence(P.readPresence({ t: 'presence', id: 'visitor', at: [-0.4, 0, 1.2], playing: true })), true, 'a take starting paints'); assert.equal(paints(ctx), 3);
  assert.equal(box.presence(P.readPresence({ t: 'presence', id: 'wind', at: [9, 0, 9] })), false, 'an unplaced wind moving in its own frame paints nothing');
  assert.equal(box.presence(P.readPresence({ t: 'presence', id: 'wind', at: [0.3, 0.9, 0.2], placed: true })), true, 'anchored: it steps into the room'); assert.equal(paints(ctx), 4);
  assert.ok(ctx.calls.some((c) => c[0] === 'fill'), 'and is drawn filled');
  assert.equal(box.presence(P.readPresence({ t: 'presence', id: 'nobody', at: [0, 0, 0] })), false); assert.equal(paints(ctx), 4);
  box.offline('the connection closed'); assert.equal(paints(ctx), 4); assert.match(note.textContent, /the room as last seen: the connection closed$/);
  assert.equal(box.program(program()), true); assert.doesNotMatch(note.textContent, /last seen/, 'a new program clears the note');
  assert.equal(box.program(null), false);
  box.dispose(); assert.equal(box.presence(P.readPresence({ t: 'presence', id: 'wind', at: [0, 0, 0] })), false, 'disposed: nothing');
  assert.equal(P.mountRoomPlan({ querySelector: () => null }), null, 'no canvas: no box');
});

test('the resize is a cause: the box repaints when its own size changes, through an observer, with no timer in the module', () => {
  const { host, ctx, canvas } = fakeHost(); let cb = null;
  const box = P.mountRoomPlan(host, { dpr: 1, observe: class { constructor(f) { cb = f; } observe() {} disconnect() { cb = null; } } });
  cb(); assert.equal(paints(ctx), 0, 'no program: a resize draws nothing');
  box.program(program()); canvas.clientWidth = 500; canvas.clientHeight = 375; cb(); assert.equal(paints(ctx), 2); assert.deepEqual([canvas.width, canvas.height], [500, 375]);
  box.dispose(); assert.equal(cb, null);
  const src = readFileSync(fileURLToPath(import.meta.url).replace(/\.test\.mjs$/, '.mjs'), 'utf8');
  assert.doesNotMatch(src, /setTimeout|setInterval|requestAnimationFrame/, 'nothing at rest costs anything: no timer draws');
});

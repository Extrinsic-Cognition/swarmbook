// fight-hands.mjs: SEIYA'S HANDS OFF THE AIR (Oct 25 2026). His pad's Hand (embertide-pad's cause, class 4: the sticks and the triggers, the
// d-pad, the buttons as HAND_* bits) becomes Seiya's moves by ONE law on every glass and on the Mac that holds the pad: the fight page
// (fight-lyssa-seiya.html, from the glass's own ear on the wave) and the PS console (tools/embertide-mesh/pad-console.mjs, which writes the
// Nest's record) import this file, so one cause gives the same press at the same beat with the same plan's digest everywhere. His words, Oct 25
// 12:0x WET: "do you know what it fucking means to have seya vorpx'd across all devices"; "how were you supposed to synce game logic on phones
// else?... we have the infra in place from time ago... when we had the board and i could move the board with my finger on 1 device and have it
// reciprocated onto the other devices": one fight, every glass drawing it from its own place from the same causes at the same stamp; a glass
// with an ear takes the cause off the air, a phone takes the record off the Nest's one wire, and both press the same beat. No node import: a
// browser loads this file as it is. The press's law (pressValue, digestOf, validPress) was the page's own, copied into the console on Oct 25
// 00:xx and held equal by a test; now it lives here once.
import * as F from './fight-lyssa-seiya.mjs';

export const REF = 'fight/harleyquintiti', SCHEMA = 'embertide.fight-harleyquintiti/1', MAX_PRESSES = 3000, LEAD_MS = F.BEAT_MS;
// the Hand's buttons (embertide-pad report.rs, the law's HAND_* bits) and its d-pad, 0..7 clockwise from up, 8 released
export const BIT = Object.freeze({ SQUARE: 1 << 0, CROSS: 1 << 1, CIRCLE: 1 << 2, TRIANGLE: 1 << 3, PS: 1 << 12 });
export const handOf = (v) => ({ buttons: (v[2] >>> 0) & 0xffff, dpad: ((v[1] >>> 16) & 0x0f) });

/** what a Hand says against the one before it: {ps, moves: [{move, side?}]} on the edges only (a press, never a hold); side is the screen's, -1 or 1 */
export function edgesOf(prev, cur) {
  const was = prev || { buttons: 0, dpad: 8 }, down = (b) => (cur.buttons & b) && !(was.buttons & b), moves = [];
  if (down(BIT.CROSS)) moves.push({ move: 'meteor' });
  if (down(BIT.TRIANGLE)) moves.push({ move: 'punch' });
  if (down(BIT.CIRCLE)) moves.push({ move: 'back' });
  if (cur.dpad !== was.dpad) { if (cur.dpad === 0) moves.push({ move: 'punch' }); else if (cur.dpad === 4) moves.push({ move: 'back' }); else if (cur.dpad === 2) moves.push({ move: 'step', side: 1 }); else if (cur.dpad === 6) moves.push({ move: 'step', side: -1 }); }
  return { ps: !!down(BIT.PS), moves };
}


// the fight page's own (fight-lyssa-seiya.html): a press it takes, and its plan's digest, byte for byte (pad-console.test.mjs holds them to the page)
export const validPress = (c) => c && Number.isInteger(c.beat) && c.beat >= 0 && c.beat < 100000 && F.MOVES[c.move] && (c.dir === undefined || c.dir === 1 || c.dir === -1);
export const digestOf = (Pl) => { let h = 0x811c9dc5; const t = JSON.stringify(Pl.events.map((e) => [e.kind, Math.round(e.g), e.who || '', e.on || '', e.what || e.move || ''])) + JSON.stringify(Pl.end);
  for (let i = 0; i < t.length; i++) { h ^= t.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; } return h.toString(16).padStart(8, '0'); };

/** the side step's dir for a side of the glass: the page's stepDir without its camera object. The camera stands on the perpendicular of the line from
 *  Seiya to her, averaged over the last 1.2 s and turned to the room's +z (the page's cameraAt); the glass's right is that camera's right. A freeze's
 *  slow orbit is left out: a step during his time freeze reads the side the fight stood at. */
export function stepDir(P, g, side) {
  let sx = 0, sz = 0;
  for (let i = 0; i < 6; i++) { const t = Math.max(0, g - i * 200), s = F.seiyaAt(P, t), h = F.herAt(P, t); const perp = Math.atan2(h.p[0] - s.x, h.p[2] - s.z) - Math.PI / 2; sx += Math.sin(perp); sz += Math.cos(perp); }
  let az = Math.atan2(sx, sz); if (Math.cos(az) < 0) az += Math.PI;
  const s = F.seiyaAt(P, g), w = F.toWorld([1, 1, 0], s.yaw, [s.x, 0, s.z]), right = [Math.cos(az), -Math.sin(az)];
  return Math.sign((w[0] - s.x) * right[0] + (w[2] - s.z) * right[1] || 1) * Math.sign(side || 1) > 0 ? 1 : -1;
}

/** the value a press writes on the fight's ref, as the page's press() writes it: a new fight a beat from now when none is live, else his move at the
 *  beat it lands on; the plan of the result, its digest and its end beside it. law: {measured, bodies} */
export function pressValue(v, now, move, side, law, by) {
  const plan = (his) => F.planFight({ ...law, protect: true, his });
  const Pv = v && v.schema === SCHEMA && Number.isFinite(v.t0) ? plan((v.his || []).filter(validPress)) : null;
  const live = Pv && now - v.t0 < Pv.wall_ms;
  let value;
  if (!live) value = { schema: SCHEMA, t0: Math.round(now + LEAD_MS), his: [], by, at: Math.round(now), n: (Number(v?.n) || 0) + 1 };
  else {
    const g = F.inGame(Pv, Math.max(0, now - v.t0)).g, dir = move === 'step' ? stepDir(Pv, g, side) : undefined;
    value = { ...v, his: [...v.his.filter(validPress), { beat: Math.floor(g / F.BEAT_MS + 1e-9) + 1, move, ...(dir ? { dir } : {}), by }].slice(-MAX_PRESSES), by, at: Math.round(now) };
  }
  const Pn = plan(value.his); value.digest = digestOf(Pn); value.end = { winner: Pn.end.winner, g: Pn.end.g, wall_ms: Pn.wall_ms, harley: Pn.end.harley };
  return { value, started: !live };
}

/** THE STAMP IS THE CAUSE'S: a capture above 1e12 is the house's milliseconds at the capture (embertide-pad count::HouseMs, the sender's
 *  --count house), the one time every glass presses the beat by; a tick count (a sender without the house's count) says nothing of the time,
 *  and the reader's own house time stands in, said so (stamped: false) */
export const whenOf = (capture, now) => (Number.isFinite(capture) && capture > 1e12 ? { when: capture, stamped: true } : { when: now, stamped: false });

/** a Hand off the air -> the fight after it, as every glass computes it: the edges against the Hand before (a press, never a hold), each move
 *  pressed at the cause's stamp. {cur: the Hand to hold as the one before, ps, moves, value: the fight after the moves (null when none), started,
 *  when, stamped} */
export function takeHandValue(fight, prev, hand, nowMs, law, by = 'pad') {
  const cur = handOf(hand.v), e = edgesOf(prev, cur), { when, stamped } = whenOf(hand.capture, nowMs);
  let value = fight, started = false;
  for (const m of e.moves) { const r = pressValue(value, when, m.move, m.side, law, by); value = r.value; started = started || r.started; }
  return { cur, ps: e.ps, moves: e.moves, value: e.moves.length ? value : null, started, when, stamped };
}

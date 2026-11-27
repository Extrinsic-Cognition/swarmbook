// cast-wave.mjs: THE CAST IS ONE WAVE (lane the-cast-is-one-wave, Oct 25 2026 WET). His words, Oct 25 2026 22:4x WET, over the house's founding belief as the
// seat said it back: "i live in this reality: "Everything that reaches any eye is a projection of one hidden reality" can you code now?" (the belief is his
// sentence of Feb 28 2026, "What comes out is just pixels: projections of a hidden reality"; THE-MUSIC-FIELD.md).
// WHAT STOOD: a cast of his hand (spell.cast) moved her twelve on every glass at its instant, the same way, wherever his hand was (lyssajudron-ferro.mjs
// fluxOfSpell takes a place and reads none): one picture sent to every screen, not one event seen from each. The cast's palm was in its schema since
// Oct 24 (spell-book.mjs castPayload) and no writer filled it: aiolos's caster handed the seat's name where the placed hand belonged.
// THE LAW: the cast is one event in the room, at one place and one instant: his palm in the Station at the packet that pinched (castPalm), at its at_ms.
// The wave leaves the palm at the field's one speed (C_MPS: the kernel's shell, field-wave.mjs measuredShell's 343000 mm/s) and reaches her at her Station
// point at at_ms + d / C_MPS (castWave); the side of her facing his palm answers first and the far side FERRO.lag_ms later, as she answers the song's magnet
// (fluxAt); the spell's own shape, beats and strength stay fluxOfSpell's (fluxOfCast). Her Station point is the one his hand is placed about (the well's
// frame: drawHands, roomView), her program carried into the Station, the same on every glass at the same stamp: so every glass shows the one impact from
// its own eye and none waits on another. They agree because they sample one wave (THE-MUSIC-FIELD.md law 8).
// WHAT IT IS NOT: no palm in the Station (a phone not yet joined to the Station by a code), no Station point for her (a glass with no place in her room),
// a palm further than WAVE_MAX_M from her (a mismeasure), or no clock for her twelve: the cast is what it was, the same on every glass at its instant.
//   withPalm(cast, entry)                          the book's cast (spell-book.mjs castOf) with his palm and its frame off the entry's payload (castPayload's);
//                                                  the book's own read is left as the Board's ONE-BODY block holds it, so the Board reloads for nothing here
//   castPalm(cast)                                 his palm when he cast, [x, y, z] Station metres, or null
//   castWave(cast, her)                            her { p: her Station point, pl: this glass's plane { r, u, n }, q: her turn in the glass's axes [x, y, z, w]
//                                                  or null } -> { d_m, flight_ms, pole: a unit in her own axes, towards his palm } or null
//   fluxOfCast(cast, now_ms, beat_ms, place, wave) the cast's flux on her twelve this picture, in fluxOfSpell's units: each seat at its own instant (now_ms -
//                                                  flight_ms - FERRO.lag_ms * (1 - toward)); the turn, the pull and the gold at the cast's arrival at her.
//                                                  wave or place null: fluxOfSpell's own, unchanged
//   WAVE_TAIL_MS                                   how much later than its own beats a cast with a palm lets her last seat go, at the most (a well's end timer)
// COST: a held cast, one picture: one square root and one quaternion turn (castWave), twelve satellite directions and thirteen fluxOfSpell (twelve multiplies
// each): a few hundred operations; nothing without a cast, nothing at rest. Pure: no clock, no I/O.
import { fluxOfSpell, FERRO } from './lyssajudron-ferro.mjs';
import * as SC from './lyssajudron-score.mjs';
import { inHerAxes } from './hand-reach.mjs';

export const C_MPS = 343;                                                      // the field's one speed (the kernel's shell; the station's rays)
export const WAVE_MAX_M = 15;                                                  // a palm further than this from her is not in this room
export const WAVE_TAIL_MS = Math.ceil((WAVE_MAX_M / C_MPS) * 1000) + FERRO.lag_ms;   // the longest flight and the far side's lag: 44 + 70 ms
const num = (v) => typeof v === 'number' && Number.isFinite(v);
const v3 = (v) => Array.isArray(v) && v.length === 3 && v.every(num);
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const unit = (a) => { const l = Math.hypot(a[0], a[1], a[2]); return l > 1e-9 ? [a[0] / l, a[1] / l, a[2] / l] : null; };

/** withPalm(cast, entry): { ...cast, palm, frame } when the spell.cast entry's payload carries his palm (three finite numbers, frame 'station' or 'eye'), else
 *  the cast as it is (null stays null). */
export function withPalm(cast, entry) {
  const p = entry && entry.payload; if (!cast || !p || !v3(p.palm) || (p.frame !== 'station' && p.frame !== 'eye')) return cast;
  return { ...cast, palm: p.palm.slice(), frame: p.frame };
}

/** castPalm(cast): his palm in the Station when he cast (withPalm's palm and frame), or null when the cast carries none or another frame's. */
export function castPalm(cast) { return cast && cast.frame === 'station' && v3(cast.palm) ? cast.palm : null; }

/** castWave(cast, her): where and when the cast's wave reaches her: { d_m: his palm to her point, flight_ms: d_m / C_MPS, pole: towards his palm in her own
 *  axes (the vector carried into this glass's axes by its plane, then by her turn's inverse, as the well draws her) }; null when there is no wave to draw. */
export function castWave(cast, her) {
  const palm = castPalm(cast); if (!palm || !her || !v3(her.p) || !her.pl || !v3(her.pl.r) || !v3(her.pl.u) || !v3(her.pl.n)) return null;
  const v = [palm[0] - her.p[0], palm[1] - her.p[1], palm[2] - her.p[2]], d = Math.hypot(v[0], v[1], v[2]);
  if (!(d <= WAVE_MAX_M)) return null;
  const g = unit([dot(her.pl.r, v), dot(her.pl.u, v), dot(her.pl.n, v)]);
  const q = Array.isArray(her.q) && her.q.length === 4 && her.q.every(num) ? her.q : null, pole = g && unit(inHerAxes(g, q));
  return pole ? { d_m: Math.round(d * 1000) / 1000, flight_ms: (d / C_MPS) * 1000, pole } : null;   // his palm at her very centre: no side faces it
}

/** fluxOfCast(cast, now_ms, beat_ms, place, wave): fluxOfSpell's flux once the wave has reached her: nothing before it, the side facing his palm first,
 *  the far side FERRO.lag_ms later, so the last seat lets go that much after the spell's own beats; null when no seat is moved. */
export function fluxOfCast(cast, now_ms, beat_ms, place = null, wave = null) {
  if (!wave || !place) return fluxOfSpell(cast, now_ms, beat_ms, place);
  if (!num(now_ms)) return null;
  const t = now_ms - wave.flight_ms, head = fluxOfSpell(cast, t, beat_ms, place), out = new Float64Array(SC.SEATS);
  let moved = !!head;
  for (let s = 0; s < SC.SEATS; s++) {
    const dir = unit(SC.satelliteAt(s, place)), toward = dir ? (1 + dot(dir, wave.pole)) / 2 : 1;
    const f = fluxOfSpell(cast, t - FERRO.lag_ms * (1 - toward), beat_ms, place);
    if (f) { out[s] = f.out[s]; moved = true; }
  }
  if (!moved) return null;
  return head ? { ...head, out } : { out, turn: 0, pull: 0, gold: 0, spell: cast.spell, u: null };
}

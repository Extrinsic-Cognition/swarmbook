// fight-hands.test.mjs: SEIYA'S HANDS OFF THE AIR (Oct 25 2026). The one law of his pad's presses: a Hand off the air becomes Seiya's moves on
// its edges, pressed at the cause's stamp (the house's milliseconds at the capture), so every replica of the fight that takes the same causes
// computes the same fight, whatever its own clock and whenever the cause reached it: the glass with an ear, the Mac's console writing the
// Nest's record, a phone taking that record off the Nest's wire.
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as F from './fight-lyssa-seiya.mjs';
import * as H from './fight-hands.mjs';

const law = { measured: JSON.parse(fs.readFileSync(new URL('./seiya-fight.hades.json', import.meta.url), 'utf8')), bodies: JSON.parse(fs.readFileSync(new URL('./seiya-bodies.hades.json', import.meta.url), 'utf8')) };
// the Hand's v (embertide-pad cause.rs from_pad): sticks, triggers | dpad << 16, buttons (HAND_* bits), seq | id << 8
const v = (buttons = 0, dpad = 8) => [0x80808080 | 0, dpad << 16, buttons, 1 << 8, 0, 0];
const T = 1_792_900_000_000;   // a house stamp: milliseconds since the epoch, Oct 25 2026

test('the stamp is the cause\'s when it is the house\'s milliseconds, the reader\'s own time when it is a tick count', () => {
  assert.deepEqual(H.whenOf(T + 5, 123), { when: T + 5, stamped: true });
  assert.deepEqual(H.whenOf(4242, T), { when: T, stamped: false }, 'a tick count says nothing of the time');
  assert.deepEqual(H.whenOf(undefined, T), { when: T, stamped: false });
});

test('PS is the face\'s, never the fight\'s; a press opens the fight a beat from its stamp', () => {
  const ps = H.takeHandValue(null, null, { capture: T, v: v(H.BIT.PS) }, T + 999, law);
  assert.equal(ps.ps, true); assert.equal(ps.value, null, 'PS moves no fight: the console switches the face by aiolos\'s door');
  const a = H.takeHandValue(null, null, { capture: T, v: v(H.BIT.CROSS) }, T + 999, law);
  assert.equal(a.started, true); assert.equal(a.value.t0, T + H.LEAD_MS, 'a beat from the cause\'s stamp, not from when this glass read it');
  assert.equal(a.value.schema, H.SCHEMA); assert.deepEqual(a.value.his, []);
  const held = H.takeHandValue(a.value, a.cur, { capture: T + 30, v: v(H.BIT.CROSS) }, T + 999, law);
  assert.equal(held.value, null, 'a hold is no press');
});

test('two replicas that read the same causes at different times compute the same fight, beat for beat and digest for digest', () => {
  const causes = [{ capture: T, v: v(H.BIT.CROSS) }, { capture: T + 20, v: v() }, { capture: T + 5 * F.BEAT_MS + 120, v: v(H.BIT.TRIANGLE) }, { capture: T + 5 * F.BEAT_MS + 160, v: v() },
    { capture: T + 9 * F.BEAT_MS + 40, v: v(0, 2) }, { capture: T + 9 * F.BEAT_MS + 80, v: v() }];
  const replay = (lag) => { let fight = null, prev = null; for (const c of causes) { const t = H.takeHandValue(fight, prev, c, c.capture + lag, law); prev = t.cur; if (t.value) fight = t.value; } return fight; };
  const near = replay(5), far = replay(180), late = replay(2500);   // the glass beside the pad, a glass across the room, a phone through the Nest's wire
  assert.equal(near.his.length, 2, 'the punch and the side step, pressed into the fight the first press opened');
  assert.deepEqual(far.his, near.his, 'the same presses at the same beats');
  assert.deepEqual(late.his, near.his);
  assert.equal(far.digest, near.digest); assert.equal(late.digest, near.digest, 'the same plan: one fight on every replica');
  const P = F.planFight({ ...law, protect: true, his: near.his });
  assert.equal(near.digest, H.digestOf(P), 'the digest is the plan of the presses');
  const g = F.inGame(F.planFight({ ...law, protect: true, his: [] }), causes[2].capture - near.t0).g;
  assert.equal(near.his[0].beat, Math.floor(g / F.BEAT_MS + 1e-9) + 1, 'the punch at the beat of its own stamp');
});

test('a replica that takes the Nest\'s record of a press it already pressed off the air moves nothing', () => {
  const a = H.takeHandValue(null, null, { capture: T, v: v(H.BIT.CROSS) }, T + 3, law), rel = H.takeHandValue(a.value, a.cur, { capture: T + 25, v: v() }, T + 28, law);
  const b = H.takeHandValue(a.value, rel.cur, { capture: T + 4 * F.BEAT_MS + 10, v: v(H.BIT.TRIANGLE) }, T + 4 * F.BEAT_MS + 14, law);
  const record = H.pressValue(a.value, T + 4 * F.BEAT_MS + 10, 'punch', undefined, law, 'pad').value;   // the console's write from the same cause
  assert.deepEqual(record.his, b.value.his, 'the record is the air'); assert.equal(record.digest, b.value.digest);
});

// lyssajudron-council.mjs - THE COUNCIL'S LIFE (Oct 12 2026 11:2x WEST). His words over the well with the twelve playing their hits: "it's too boring
// dude... make it dance... make it rotate... make it alive... have you forgotten the good council thing you did some time ago or no?? there was
// lyssajudron animated there...". The council (the Poleis wall engine in discussion: Harmony's sky, one.mjs fit 'her', the gold one with the orange
// sparks) is alive because every chamber holds its own council: "Every real civilization carries twelve loops" (lysa-engine.js RQ.agentExtentOf). Her own
// twelve loops are her children's wires; round each child fly its twelve agents on its own four lanes, the 3:2 spherical Lissajous at its scale (the
// engine's discussionLoopOrbit: a lane's tilt, its azimuth turning, three agents a lane a third apart, the phase seeded by the chamber's name; the loops at
// one.mjs's orbit, 1.43 of the child's radius), each leaving a fading trail. Here a child's agents are sparks of its own tone (lyssajudron-band.mjs toneOf),
// they fly a loop in four bars, and when their child plays they burst out with its light and fall back to their lanes (the band's open).
// A pure function of the clock and the band's open (itself the clock's): every glass flies the same agents. Alive with no song too: they always fly.
// EVERY UNIT1 CARRIES ITS TWELVE (Oct 13 2026 09:5x WEST). His words over an agent's unit1 out of her, drawn as a bare ball: "you have it all wrong. you
// are treating unit1s as without any unit2 satellite... that is not how lyssajudrons are... can you add the 12 dots orbiting every unit1 please?". She is a
// fractal: unit0 carries twelve unit1s, each unit1 carries twelve unit2s, and these agents ARE its unit2s. They were flown round a child only where it stands
// on its wire at her size: a unit1 that left its wire (placed at the mouth of her glass, filling it; drawn alone on a glass it crosses) kept them at her
// scale, inside its own body, or lost them (well.mjs hid them where she is not). Now a child's twelve take the child's own size every picture, read off its
// instance (lyssajudron.mjs place and only: 1 on its wire, its size in the room when placed, 0 when its chair is empty or it is not drawn on this glass): the
// loops at 1.43 of ITS radius, the agents 0.13 of it, wherever it is; an undrawn child has none. The Boards fly the same law (NestBoard.html TWELVE-CORE
// twAgent, her-twelve.test.mjs holds the two equal). No new draw, no new picture: 12 square roots a picture more.
// THE BREATH (Oct 14 2026 02:4x WEST, his "every unit in the tree of lyssajudron can be 'breathing state' or closed? or open"; her-breath.mjs): a unit2 has
// no tiles and no cause of its own: it is its unit1's. Each dot swells by its parent's lift (frame's `lift`, per seat: what stands in its unit1's aLyOpen:
// its hit while it breathes, 1 while it stands open on a glass), COUNCIL.swell of its size at a lift of 1, in the scale of the instance it already has: no
// attribute, no draw, 12 products a picture. With no lift said, or a lift of 0, a dot is as it was, to the bit.
// COST: 144 agents of 7 points (the head and its trail): ~1000 curve points a picture, ~0.3 ms of JS on the Mac; two draws (the agents, their trails).
import * as SC from './lyssajudron-score.mjs';
import { toneOf } from './lyssajudron-band.mjs';

export const COUNCIL = Object.freeze({
  chairs: 12,           // a chamber's twelve loops (lysa-engine.js RQ.discussionLoops): three agents on each of its four lanes
  bars: 4,              // an agent flies its loop in this many bars
  precess: 48,          // a child's lanes turn round it once in this many bars
  orbit: 1.55 / 2.1,    // the loops' radius over the engine's 2.1 (one.mjs LYSA.orbit, the council view's): 1.43 of the child's radius
  size: 0.13,           // an agent's radius in its child's (the engine's agentScale .11, a little more to read on a glass)
  trail: 7,             // a trail's points, the head first
  trailTurns: 0.06,     // how much of its loop a trail spans
  burst: 0.8,           // when its child plays its council flies this much further out at a full hit
  light: 1.25,          // an agent's light, times its child's tone (they are its sparks)
  swell: 0.6,           // THE BREATH: a dot is this much larger at its parent's lift of 1 (its hit's peak; held, while its unit1 stands open)
});
const TAU = Math.PI * 2;
const num = (v) => typeof v === 'number' && Number.isFinite(v);

/** agentAt(seat, chair, bars, open, back): where agent `chair` of child `seat` flies at the bar count `bars`, metres from the child's centre in her axes (y up,
 *  z towards the eye, as the score's); open: how far its child stands open (the band's: its council flies out with it); back: turns behind it (its trail). */
export function agentAt(seat, chair, bars, open = 0, back = 0) {
  const lane = chair % SC.LANES, u = SC.phaseAtDistance(bars / COUNCIL.bars + chair / COUNCIL.chairs + SC.seedOf(`unit1·${seat}`) * 0.18 - back);
  const p = SC.scorePoint(lane, u, lane * Math.PI * 0.43 + (TAU * bars) / COUNCIL.precess + seat * 0.7);
  const k = SC.K * SC.CHILD_SCALE * COUNCIL.orbit * (1 + COUNCIL.burst * Math.max(0, num(open) ? open : 0));
  return [p[0] * k, p[1] * k, -p[2] * k];
}

/** sizeOf(matrices, seat): a child's own size this picture, off its instance matrix (column-major, 16 a child): the length of its first column, which is the
 *  one scale lyssajudron.mjs composes it with (a turn does not change it). 1 on its wire (to within single precision: said as exactly 1, so her home is
 *  untouched to the bit), 0 for a chair that is empty or not drawn here. */
export function sizeOf(m, seat) {
  const j = seat * 16, k = Math.hypot(m[j], m[j + 1], m[j + 2]);
  return !(k > 1e-4) ? 0 : Math.abs(k - 1) < 1e-4 ? 1 : k;
}

/** mountCouncil(THREE, {sats}) -> {agents, trails, frame(clock, {open, offsets, tail, lift}), state(), dispose()}. The agents and their trails go beside her satellites (the
 *  same parent, the same axes); frame() flies them round where each child stands this picture (its instance, moved by offsets: the band's kick and hop) at
 *  the child's own size this picture (EVERY UNIT1 CARRIES ITS TWELVE: sizeOf below), swollen by its lift (THE BREATH: `lift`, per seat, 0..1 and a little
 *  over); state().shown: the children that carry their twelve on this glass. */
export function mountCouncil(T, { sats } = {}) {
  const parent = sats?.parent; if (!parent || !sats.instanceMatrix) throw new Error('no satellites to hold a council round');
  const N = SC.SEATS * COUNCIL.chairs, P = COUNCIL.trail, segs = P - 1;
  const agents = new T.InstancedMesh(new T.IcosahedronGeometry(SC.R_SAT * COUNCIL.size, 1), new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), N);
  const pos = new Float32Array(N * segs * 6), col = new Float32Array(N * segs * 6), C = new T.Color();
  for (let s = 0; s < SC.SEATS; s++) {
    const tone = new T.Color(toneOf(s));
    for (let ch = 0; ch < COUNCIL.chairs; ch++) {
      const a = s * COUNCIL.chairs + ch; agents.setColorAt(a, C.copy(tone).multiplyScalar(COUNCIL.light));
      for (let q = 0; q < segs; q++) { const o = (a * segs + q) * 6, f0 = 0.9 * (1 - q / segs), f1 = 0.9 * (1 - (q + 1) / segs);   // a trail fades from its agent to nothing
        col[o] = tone.r * f0; col[o + 1] = tone.g * f0; col[o + 2] = tone.b * f0; col[o + 3] = tone.r * f1; col[o + 4] = tone.g * f1; col[o + 5] = tone.b * f1; }
    }
  }
  const geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3).setUsage(T.DynamicDrawUsage)); geo.setAttribute('color', new T.BufferAttribute(col, 3));
  const trails = new T.LineSegments(geo, new T.LineBasicMaterial({ vertexColors: true, transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false }));
  agents.name = 'council-agents'; trails.name = 'council-trails'; agents.renderOrder = 6; trails.renderOrder = 6;
  trails.userData.glow = true;   // light, never an occluder (well-smoke.mjs's occlusion pass hides it)
  for (const m of [agents, trails]) { m.frustumCulled = false; m.raycast = () => {}; }
  agents.instanceMatrix.setUsage(T.DynamicDrawUsage);
  parent.add(agents, trails);
  const M = new T.Matrix4(), pt = new Float64Array(P * 3), S0 = { frames: 0, bars: null, shown: 0 };
  function frame(c, { open = null, offsets = null, tail = 1, lift = null } = {}) {
    if (!c) return false;
    const cc = SC.normalClock(c), bars = SC.barsAt(cc), sm = sats.instanceMatrix.array, turns = COUNCIL.trailTurns * (num(tail) ? Math.max(0, Math.min(1, tail)) : 1); S0.bars = bars; let shown = 0;   // tail: how much of its trail an agent keeps here (1 in her well; shorter round a unit1 alone on a glass, where a full trail is a line across its face)
    for (let s = 0; s < SC.SEATS; s++) {
      const j = s * 16, cx = sm[j + 12] + (offsets ? offsets[s * 3] : 0), cy = sm[j + 13] + (offsets ? offsets[s * 3 + 1] : 0), cz = sm[j + 14] + (offsets ? offsets[s * 3 + 2] : 0), op = open ? Math.max(0, open[s]) : 0;
      const k = sizeOf(sm, s); if (k > 0) shown++;   // EVERY UNIT1 CARRIES ITS TWELVE: at its own size, wherever it stands; none round a child that is not drawn
      const g = lift && k > 0 && lift[s] > 0 ? k * (1 + COUNCIL.swell * lift[s]) : k;   // THE BREATH: a dot's own size by its parent's lift (k itself where there is none: her home to the bit)
      for (let ch = 0; ch < COUNCIL.chairs; ch++) {
        const a = s * COUNCIL.chairs + ch;
        if (k > 0) for (let q = 0; q < P; q++) { const p = agentAt(s, ch, bars, op, (q * turns) / segs); pt[q * 3] = cx + p[0] * k; pt[q * 3 + 1] = cy + p[1] * k; pt[q * 3 + 2] = cz + p[2] * k; }
        else for (let q = 0; q < P; q++) { pt[q * 3] = cx; pt[q * 3 + 1] = cy; pt[q * 3 + 2] = cz; }   // no child here: its agents have no size and their trails no length
        if (g === 1) M.makeTranslation(pt[0], pt[1], pt[2]); else M.makeScale(g, g, g).setPosition(pt[0], pt[1], pt[2]);
        agents.setMatrixAt(a, M);
        for (let q = 0; q < segs; q++) { const o = (a * segs + q) * 6; pos[o] = pt[q * 3]; pos[o + 1] = pt[q * 3 + 1]; pos[o + 2] = pt[q * 3 + 2]; pos[o + 3] = pt[q * 3 + 3]; pos[o + 4] = pt[q * 3 + 4]; pos[o + 5] = pt[q * 3 + 5]; }
      }
    }
    agents.instanceMatrix.needsUpdate = true; geo.attributes.position.needsUpdate = true; S0.frames++; S0.shown = shown;
    return true;
  }
  return {
    agents, trails, frame,
    state: () => ({ agents: N, frames: S0.frames, bars: S0.bars == null ? null : Math.round(S0.bars * 1000) / 1000, shown: S0.shown, flying: S0.shown * COUNCIL.chairs }),   // shown: the children that carry their twelve on this glass this picture
    dispose() { for (const m of [agents, trails]) { m.parent?.remove(m); m.geometry.dispose(); m.material.dispose(); } agents.dispose?.(); },
  };
}

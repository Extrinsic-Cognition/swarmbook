// lyssajudron.mjs - THE LYSSAJUDRON AT HOME (Oct 11 2026, lane LYSSA of intro/room/LYSSAJUDRON-HOME-2026-10-10.md). His words, Oct 10 22:15: "the main
// character is the lyssajudron dude... make it about the NestOS and the Lyssajudron that becomes functionally equivalent to [Curie]... the topos of it
// and oikos, home". It is the house's spirit, the Lar of the NestOS: roma-0 whole (unit0, a Goldberg polyhedron of 12 gold pentagons and 20 paper
// hexagons, plus 12 fractal satellites at childScale .42 on four gold wires, the engine's 3:2 spherical Lissajous lanes), and unmistakably a home robot:
// it hovers at eye height on an ember thruster and bobs once a beat, lands a gesture on every downbeat (the thruster's push, the eyes stepping onto
// their lane phase, the wires flashing: lyssajudron-score.mjs), three of its satellites are eye-stalks that look independently (seat 0 at him, seat 1
// at the work, seat 2 around, A8), it turns its body to who speaks, it moves to where the work is and comes HOME when the phrase is over (the room's
// centre once walls stand, else its disc), a satellite reaches out to its hand to take a picture and carries it to a glass, and it says one line in
// first person at its feet, returning to the phase's rest line when the work is done.
//
// THE RHYTHM (his Oct 10 22:50 law, section 0): this glass computes its own view on its own; what it shares with every other glass is the rhythm. Every
// quantity here is a pure function of the clock the twin hands over in each 'paint' ({ctx, camera, W, H, clock}) and the causes placed on that grid as
// notes (lyssajudron-score.mjs): the orbits close in 12 bars, the bob is one beat, a gaze turns from the next beat for one beat, a go-to from the next
// downbeat for one bar, a carry leaves on the downbeat and lands on the next, a line changes on a downbeat, the homecoming is the first downbeat a bar
// after the phrase's last note. No wall-clock read and no timer of its own (the test greps this file for the two time globals and the frame request:
// zero hits). The chain of samples is the twin's (twin.animate(true, 'lyssajudron') while visible, A6); without one, the stage's touch() through the
// twin's one paint request. The cap is per beat (SAMPLES_PER_BEAT by the clock's own ms), never per second or per frame.
//
// THE CONTRACT WITH twin (mountTwin's layer bus, twin.mjs; the TWIN lane's additions by exact name, each guarded here):
//   twin.THREE, twin.stage.addLayer/removeLayer/touch, twin.host (the caption's parent), twin.on(event, fn) (returns the unsubscribe), twin.emit,
//   twin.camera() / detail.camera ({C, f, r, u, project(p) -> [px, py, depth] | null, ray(px, py)}), twin.place(seat), twin.glasses() (each with the
//   Nest's own `name` for the seat, A10), twin.viewer() ({position}: the Mac's placed glass or the camera: the hand reaches toward it). The guesses
//   are never said here: the status line of the twin is the ONE line for them (his rule: one line), and the count the bus tells ('guesses', or the
//   'scan' detail's `guesses`) is only kept, in state().guesses.
//   twin.clock() -> {now_ms, beat_ms, bar_ms, beat_phase, bar_phase, downbeat_ms, bpm, source, beat, bar, epoch_ms} (else detail.clock, else the options'
//   clock, else the genesis clock frozen at its epoch: the figure stands still until a clock arrives). twin.animate(on, who), twin.work().
//   Bus in: 'paint', 'cursor' {x, y, hit, at_ms}, 'glass' {seat, what, pose, at_ms}, 'scan' {phase, scan, at_ms, dial?, guesses?}, 'wall' {id, a, b, h,
//   beat, scored?} (a wall with scored === false stays off the paint: no step, no trace, not counted), 'thing' {id, box, beat, scored?} (alike),
//   'pairing' {open, code}, 'guesses' {n} (a count, kept, never said), 'flight-plan' (answered synchronously with origin = {position: the card's point on the hand,
//   satellite}), 'flight-start' {flight (its origin, its grid)}, 'flight-landed' {landed_beat, seat}, 'flight-cleared'; 'glasses' (the twin's own) for
//   the placed quads. Until the twin's first 'cursor' arrives, a pointermove on twin.host is read here with the last sampled clock's now_ms (never
//   event.timeStamp, A5).
//   During a carry (A7) the carrier is placed from flight-law's flightAt(flight, now_ms) when the flight carries an origin and a grid: at the hand
//   through any phase before FLIGHT's 'carry' (a 'window' or 'overlay' that fills the window, a 'room' that shrinks to the hand), one radius under the
//   card along the arc, under it on the glass, then back to its wire over the bar after 'flight-landed'; else the score's own arc (carryAt). The image
//   is FLIGHT's to draw on the bus road; a carry() asked of this API draws its own small quad on the hand.
//
// COST (section 4; the harness in lyssa2/ measures it): per sample 12 satelliteAt (one table search and 6 trig each), 3 stalks, a wall trace, 4 wire
// rotations and one opacity, the yaw, the thruster, 15 instance matrices: ~15-40 us of JS on the Mac; at most SAMPLES_PER_BEAT = 18 samples a beat
// (by the clock's own ms: ~30 a second at 100 bpm), so well under 1 ms of JS per beat. Draws: unit0 2 (gold, paper) + its ink edges 1 + satellites 2
// + eyes 1 + wires 4 + thruster 2 + glow 1 + pool 1 + the floor disc and its rim 2 = 16, plus a stalk per reaching eye and a quad while a code, a held
// glass or a carried image shows. At rest (hidden, the tab not shown, unmounted): the chain is released, no sample, nothing computes. Visible with no
// song and no cause: the figure moves (its identity, on the genesis grid) and the twin re-renders per sample: that render is the real cost and TWIN's
// road (A11); this layer's own work per beat is in state().work when a stopwatch is given (the twin's work() is the meter).
//
// THE COUNCIL AS THE BOARD'S SKIN (Oct 13 2026 16:2x WEST). His words over the Council tab, with tv1's Board in his other eye: "can you bring the board
// tech and synchronicity into the council? you get what i mean? make the council as if it was a digital skin of that". Two things of the Board's were
// not hers here. (1) EVERY UNIT1 CARRIES ITS TWELVE (his 09:5x "can you add the 12 dots orbiting every unit1 please?"): the Board, her well and the
// phone's AR flew twelve unit2 agents round each of her twelve; the twin's Lyssajudron did not (unit2-dots/LANDING.md NOT LANDED 3). Now her council
// (lyssajudron-council.mjs mountCouncil, the law the Board's twAgent is held equal to) is mounted beside her satellites and flown every sample on the
// clock her twelve dance on, at each child's own size read off its instance (a travelling unit1 keeps its twelve, an empty chair has none), with the
// short trail a unit1 shows alone on a glass (COUNCIL_TAIL, the well's LONE_TAIL). (2) HER CLOCK IS THE BOARD'S: the twin hands this paint the two
// clocks it already takes (dance, bob) folded from radio/beat and radio/program as the Board's twClock folds them (council-song.mjs); nothing here
// changed for that. COST: +2 draws (the agents, their trails), ~1000 curve points a sample (~0.3 ms of JS on the Mac at a full sample, 144 agents), no
// read, no timer. A fault in the council's mount leaves her as she was (state().council.off says why).
//
// HER FERROFLUID IN THE COUNCIL (Oct 14 2026 01:4x WEST). His words over the Mac's window: "why dont i see the synchronized ferrofluid effect across the
// screens my dude? why is it only on lysa and newmac and in AR?". The liquid (lyssajudron-ferro.mjs: mounted and driven by the well alone since Oct 12) now
// rides her body wherever she is mounted with `ferro` (default true: the twin; the well passes false and keeps its own handle): framed every sample on the
// clock her bob takes (the song as heard, else the dance clock, else the paint's: bobAt's own rule) with the wakefulness of the song's word the paint hands
// (`song`: its state and the stamp of the word that changed it, council-song.mjs songStateOf; lyssajudron-ferro.mjs songOn wakes it over 900 ms from a play
// and settles it from a pause), so the Council and lysa's well raise the same spikes at the same instant. THE FLUX on her twelve (his Oct 12 12:4x "as if the
// ferrofluid was causing magnetic flux that causes the satellites to swooosh"): fluxAt's out and turn fling each child out along its orbit vector and sweep
// the twelve round her vertical, by the band's own formula; the wires turn with them and each swells by its three riders' mean fling (the well's band bends
// its wires through them; there is no band here). COST: while a song plays, one draw of ~24k triangles and 203 numbers a sample (the well's measure on lysa)
// and 12 more satelliteAt a sample for the flux; nothing at rest (songOn 0: the mesh hidden, frame() returns at once, no flux). A fault in the mount leaves
// her as she was (state().ferro.off says why); stop() disposes it with her.
import * as SC from './lyssajudron-score.mjs';
import { createUnit0Liquid, glassShell } from './unit0-liquid.mjs';
import { buildGoldberg } from '../poleis/orb.js';
import * as FL from './flight-law.mjs';
import { mountCouncil } from './lyssajudron-council.mjs';
import { fluxOfCast } from './cast-wave.mjs';   // THE CAST IS ONE WAVE (lane the-board-takes-the-wave, Oct 25 2026): a held cast reaches her twelve from his palm, a flight after its instant (fluxOfSpell's own shape)
import { mountFerro, songOn, fluxAt, fluxOfHand, fluxSum, handOf } from './lyssajudron-ferro.mjs';   // HER SPELL'S FLUX (lane the-two-hands-cast, Oct 24 2026: fluxOfSpell, read now through cast-wave.mjs fluxOfCast): a cast on the Nest moves her twelve   // fluxOfHand, fluxSum, handOf: HIS HAND IS THE SECOND MAGNET (lane hand-reach, Oct 14 2026): a glass that holds his hand hands the sample a cause (detail.hand) and her liquid and her twelve take it   // HER FERROFLUID IN THE COUNCIL (Oct 14 2026 01:4x WEST): the liquid under her tiles here too, on the song's word the twin folds, and its flux on her twelve   // THE COUNCIL AS THE BOARD'S SKIN (Oct 13 2026 16:2x WEST): her twelve carry their twelve here too, as on the Board and in her well
import * as HB from './her-breath.mjs';   // THE BREATH (Oct 14 2026 02:4x WEST, his "every unit in the tree of lyssajudron can be 'breathing state' or closed? or open"): the three states by cause, the lift, unit0's tiles
import { openAt, hitsAt } from './lyssajudron-band.mjs';   // THE BREATH on a glass with no band and no ear (the twin): THE TWELVE PLAY's plan of hits on the paint's clock, pure, nothing mounted
import { restOf } from './terrain-layer.mjs';   // THE ANCHOR (Oct 11): where its stand rests on a held thing is the height the table sculpts that thing at
import './her-face.js';   // HER FACE, ONE SOURCE (Oct 13 2026 03:4x WEST, his "a nest level singleton for the board assets"): her paint and light as born, her eyes' line and forms, Brock's law, the reading of her refs: one text, this module's and the Board's (NestBoard.html inlines it), handed over as globalThis.HER_FACE
const HF = globalThis.HER_FACE;

export const INK = Object.freeze({ paper: 0xf5f2e9, ink: 0x242522, gold: 0xc9a14a, ember: 0xe8572a, floor: 0x242522, wire: 0xd4a94e, ivory: 0xf6efe1, ivoryDeep: 0xe0cfae });   // FIXER: the hexagons ivory porcelain, the pentagons a deeper ivory, every edge a gold wire
export const SAMPLES_PER_BEAT = 18;           // A11: the cap, per beat by the clock's own ms (~30 a second at 100 bpm)
export const FLOOR_R = 1.2;                   // the dark floor disc under it: its home
export const EYES = SC.EYE_SEATS;             // the eye-stalks: him, the work, around
export const CARRIER = 3;                     // the satellite that flies a picture out
export const HOLDER = 1;                      // the satellite that holds an unplaced glass (A9) and traces a wall
export const SAT_OPEN = 0.4;                  // THE TWELVE PLAY (lyssajudron-band.mjs): a satellite's tiles lift this share of its radius at a hit of strength 1
export const UNIT0_OPEN = HB.BREATH.lift[0];   // THE BREATH (her-breath.mjs): unit0's tiles lift this share of HER radius at a lift of 1 (0.13: 2.7 cm; no corner of a tile then reaches the skin of a child gathered in to her)
export const UNIT0_GLOW = Object.freeze([0.05, 0.75]);   // THE BREATH: a lifted tile of unit0 warms in her own inner light (her light stays hers: no child's tone), its seams the more: [the tile, its seam] at a lift of 1
export const SCOUT = 2;                       // FIXER: the 'around' eye: it flies to the nearest unseen tile after his hand's hop
export const LOW_SHARE = 0.2;                 // paintMsPerBeat over this share of a beat: 96 wire segments, no thruster
export const CARD_W = 0.6, CARD_H = 0.2;      // the join code's card, beside the figure
export const FOOT_R = 0.46;                   // its feet on the table: the flight stand's base (minis-layer.mjs STAND.r), the caption under its near rim
export const HOP = Object.freeze({ beats: 2, arc: 0.32, scoutBars: 2, scoutHover: 0.42 });
/** CALM (his Oct 12 2026 08:2x WEST: "can you make it oscillate less than now?"): her body takes this share of the bob and the downbeat dip of the
 *  score (lyssajudron-score.mjs hoverY, 0.05 m a beat and 0.03 m on the one, the same in its Rust twin): 2 cm and 1.2 cm, still on the beat. The score
 *  keeps its law and its pins; the hop of his hand keeps its whole arc. */
export const COUNCIL_TAIL = 0.4;   // THE COUNCIL AS THE BOARD'S SKIN: how much of its trail an agent keeps here (the well's LONE_TAIL: a unit1 seen from a room away)
const RIDERS = Object.freeze(Array.from({ length: SC.LANES }, (_, lane) => Array.from({ length: SC.SEATS }, (_, s) => s).filter((s) => SC.laneOf(s) === lane)));   // HER FERROFLUID IN THE COUNCIL: the three seats on each wire (the flux swells a wire by its riders' mean fling)
export const BOB_CALM = 0.4;   // FIXER (Oct 11): his hand's hop lasts two beats and rises an arc; the scout eye hovers over the unseen tile two bars
/** The D&D table's lines (FIXER, Oct 11, judged against his "the magical ux that converts only the ads have it"): first person, the dungeon master's
 *  companion, never a count, never a machine, never an id. The score's own lines (lyssajudron-score.mjs LINES) are untouched; these ride beside them. */
export const TABLE_LINES = Object.freeze({
  old: 'Your home, as I remember it. Set me down where the mist is.',
  home: "I'm home. Set me down where the mist is.",
  place: 'A new glass is here. Show me the wall it hangs on.',
  scout: "I haven't seen this corner. Walk me here.",
  seen: "I've seen every corner you walked me to.",
  stay: "I'll stay where you put me.",
});
/** THE ANCHOR (Oct 11; his 10:22 "the origin of this hackathon was anchoring agents to stuff in my nest oss spatial computing"): its home is a scene entity
 *  of kind 'golem' on the Nest (twin.golem()), set on a thing of his room; standing on a held thing, its rest line names the thing. */
export const ANCHOR_LINES = Object.freeze({
  old: (thing) => `Your home, as I remember it. I'm keeping watch from your ${thing}.`,
  home: (thing) => `I'm home, keeping watch from your ${thing}.`,
});
export const RISE_MIN = 0.4;                  // the least from the surface its stand rests on to its centre: the rod's socket (minis-layer.mjs BODY_BOTTOM 0.19), the base and its collar (0.09), a hand of rod
/** thingName(name): a held thing's name as the scan gave it, for a line: one space, no article, at most 32 characters; null when it has none. */
export const thingName = (name) => { const s = typeof name === 'string' ? name.replace(/\s+/g, ' ').trim().replace(/^the /i, '') : ''; return s ? s.slice(0, 32) : null; };
export const STAND_M = 0.9;                   // a step back from a wall: where it stands to draw one, and the least its home keeps off any wall
/** cardHeight(): the card's height in the hand, the module's (flight-law.mjs cardLaw: FLIGHT's own, so the plan's origin sits on the hand whatever its law
 *  says); NaN until the module stands, and no card is carried then (THE CARD FLIES BY THE MODULE) */
export const cardHeight = () => { const law = FL.cardLaw(); return law && law.carry_m > 0 ? law.carry_m : NaN; };
export const CAPTION_CSS = 'position:absolute;left:0;top:0;visibility:hidden;white-space:nowrap;max-width:min(520px,calc(100% - 24px));overflow:hidden;text-overflow:ellipsis;'
  + 'padding:4px 12px;border-radius:6px;background:rgba(245,240,228,.96);color:#242522;border:1px solid #c9a14a;box-shadow:inset 0 0 0 2px rgba(245,240,228,.96),inset 0 0 0 3px rgba(201,161,74,.45),0 3px 10px rgba(20,12,4,.35);'   // INTEGRATOR (Oct 11, the D&D table): its words on a parchment plate with the gold double rule, the table's one paper
  + 'font:600 12px/1.35 Archivo,system-ui,sans-serif;pointer-events:none;';
export const { clipLine, LINES } = SC;
const pad = (n) => String(n).padStart(2, '0');
/** restLine(ms): hologram.mjs's rest line, kept for the glass that wants the house's quiet hour. */
export const restLine = (ms) => { const d = new Date(ms); return `nothing moved since ${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const { num, vec3, add, sub, mix, unit, len } = SC;

/** goldbergGeometry(THREE, skin, radius): unit0's skin (orb.js buildGoldberg) as one flat-shaded, non-indexed geometry: group 0 the 12 pentagons, group 1
 *  the hexagons; each face a fan with its own normal. The same geometry at radius K is the body, at K*0.42 every satellite (A8: roma-0 whole). */
export function goldbergGeometry(T, skin, radius = 1) {
  const pos = [], nor = [], bary = [], wire = [], tile = []; let pent = 0;
  for (let fi = 0; fi < skin.faces.length; fi++) { const f = skin.faces[fi];
    const n = f.normal, v = f.verts, last = v.length - 2;
    for (let i = 1; i + 1 < v.length; i++) {
      const mask = [1, i === last ? 1 : 0, i === 1 ? 1 : 0];   // FIXER: which of the fan triangle's edges are the face's own (the edge opposite each corner): the gold wire runs on those alone
      [v[0], v[i], v[i + 1]].forEach((p, k) => { pos.push(p[0] * radius, p[1] * radius, p[2] * radius); nor.push(n[0], n[1], n[2]); bary.push(k === 0 ? 1 : 0, k === 1 ? 1 : 0, k === 2 ? 1 : 0); wire.push(...mask); tile.push(fi); });
    }
    if (f.chair >= 0) pent += (v.length - 2) * 3;
  }
  const g = new T.BufferGeometry();
  g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(nor, 3));
  g.setAttribute('aBary', new T.Float32BufferAttribute(bary, 3)); g.setAttribute('aWire', new T.Float32BufferAttribute(wire, 3));
  g.setAttribute('aLyFace', new T.Float32BufferAttribute(tile, 1));   // THE BREATH: the tile a vertex belongs to (orb.js's order: the twelve pentagons, chair i at i, then the hexagons): unit0's shader reads its tile's lift by it
  g.addGroup(0, pent, 0); g.addGroup(pent, pos.length / 3 - pent, 1);
  return g;
}
/** porcelain(THREE, color, roughness): ivory porcelain with gold wire on every face's own edges (his Sept 20 "gold wires above ivory marble"; FIXER, Oct 11:
 *  white hexagons and solid gold pentagons read as a football). One pass: the edge is the triangle's barycentric distance to a face edge (aWire masks the
 *  fan's inner diagonals), about 1.4 px wide on the glass, gold and a little metallic; the body and the satellites share it (no draw added). */
export function porcelain(T, color, roughness = 0.38, light = null) {
  const m = new T.MeshStandardMaterial({ color, flatShading: true, roughness, metalness: 0.02 });
  m.userData.wireGold = new T.Color(INK.wire);   // HER PAINT (Oct 12): the gold of her edges is one Color the shader reads, so her gold can be painted
  m.onBeforeCompile = (sh) => {
    sh.uniforms.uWireGold = { value: m.userData.wireGold };
    const L = light || LY_DARK; sh.uniforms.uLyLift = L.lift || LY_DARK.lift; sh.uniforms.uLyTime = L.time; sh.uniforms.uLyTide = L.tide; sh.uniforms.uLyLight = L.color; sh.uniforms.uLyGhost = L.ghost || LY_DARK.ghost; sh.uniforms.uLyIris = L.iris || LY_DARK.iris;   // THE LIGHT GAME (TIDE) and THE GHOST (BROCK): one holder for her body and her eyes
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec3 aBary;\nattribute vec3 aWire;\nvarying vec3 vBary;\nvarying vec3 vWire;\nvarying vec3 vLyP;\nvarying float vLyBody;\nvarying vec4 vLyTone;\n#ifdef USE_INSTANCING\nattribute vec3 aLyTone;\nattribute vec4 aLyEye;\nattribute vec4 aLyPush;\nattribute vec4 aLySpin;\nattribute float aLyOpen;\nvec3 lyTurn(vec4 q, vec3 v) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }\n#else\nattribute float aLyFace;\nuniform float uLyLift[32];\n#endif')
      // THE TWELVE PLAY (lyssajudron-band.mjs): a satellite's tiles lift off their seams along their own normals by aLyOpen (an eye's tiles, round aLyEye, stay shut),
      // and the whole of it is kicked out from her along aLyPush (a direction in its own axes, w metres): the twelve breathe out on their hits; and it turns in place
      // by aLySpin (a quaternion in its own axes, all 0 = none): its tumble and its pirouettes; the eye's disc stays where it looks, its tiles shut round it
      .replace('#include <begin_vertex>', `#include <begin_vertex>\nvBary = aBary; vWire = aWire; vLyP = position;\n#ifdef USE_INSTANCING\nvLyBody = 0.0;\nvec3 lyN = lyTurn(aLySpin, normal);\ntransformed = lyTurn(aLySpin, transformed);\nfloat lyOpen = aLyOpen * (1.0 - aLyEye.w * smoothstep(0.55, 0.85, dot(lyN, aLyEye.xyz)));\ntransformed += lyN * (lyOpen * ${(SC.R_SAT * SAT_OPEN).toFixed(5)}) + aLyPush.xyz * aLyPush.w;\nvLyTone = vec4(aLyTone, max(lyOpen, 0.0));\n#else\nvLyBody = 1.0;\nfloat lyLift = uLyLift[int(aLyFace + 0.5)];\ntransformed += normal * (lyLift * ${(SC.K * UNIT0_OPEN).toFixed(5)});\nvLyTone = vec4(0.0, 0.0, 0.0, lyLift);\n#endif`)   // USE_INSTANCING is defined for the vertex stage only: the fragment learns it here;   // THE BREATH (her-breath.mjs): unit0 is not instanced: each of her 32 tiles lifts along its own normal by its own number of uLyLift (pentagon i its band's, a hexagon its three pentagons' mean, the eyes' tiles 0), UNIT0_OPEN of her radius at 1
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>\nuniform vec3 uWireGold;\nvarying vec3 vBary;\nvarying vec3 vWire;\nvarying vec3 vLyP;\nvarying float vLyBody;\nvarying vec4 vLyTone;\nuniform float uLyTime;\nuniform float uLyTide;\nuniform vec3 uLyLight;\nuniform float uLyGhost;\nuniform vec3 uLyIris;\n${LY_CAUSTIC_GLSL}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
  vec3 lyB = vBary + (1.0 - vWire) * 4.0, lyW = max(fwidth(vBary), vec3(1e-5));
  vec3 lyE = smoothstep(lyW * 0.7, lyW * 1.9, lyB);
  float lyWire = 1.0 - min(min(lyE.x, lyE.y), lyE.z);
  diffuseColor.rgb = mix(diffuseColor.rgb, uWireGold, lyWire);
  if (uLyGhost > 0.001 && vLyBody > 0.5) diffuseColor.rgb *= 1.0 - ${BROCK.dark.toFixed(2)} * uLyGhost * (1.0 - lyWire);   // THE GHOST: the armour goes dark (unit0 only)`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n  roughnessFactor = mix(roughnessFactor, 0.28, lyWire);')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\n  metalnessFactor = mix(metalnessFactor, 0.75, lyWire);')
      .replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n  totalEmissiveRadiance += uWireGold * lyWire * 0.22;\n  if (uLyTide > 0.001 && vLyBody > 0.5) totalEmissiveRadiance += uLyLight * lyCaustic(vLyP / ${SC.K.toFixed(4)}, uLyTime) * uLyTide * (1.0 - lyWire) * 0.9;   // unit0 only: the satellites draw instanced\n  if (uLyGhost > 0.001 && vLyBody > 0.5) totalEmissiveRadiance += uLyIris * lyWire * uLyGhost * 1.6;   // its seams lit from inside, by the fire in its eyes
  if (vLyTone.a > 0.001) totalEmissiveRadiance += vLyTone.rgb * vLyTone.a * (0.45 + 2.0 * lyWire);   // THE TWELVE PLAY: an open satellite's own tone, its seams burning in it
  if (vLyBody > 0.5 && vLyTone.a > 0.001) totalEmissiveRadiance += uLyLight * vLyTone.a * (${UNIT0_GLOW[0].toFixed(3)} + ${UNIT0_GLOW[1].toFixed(3)} * lyWire);   // THE BREATH: a lifted tile of unit0 warms in her own light, its seams the more`);
  };
  m.customProgramCacheKey = () => 'lyssa-porcelain-7';
  return m;
}
/** Brock's eyes, FLOATING (his Oct 12 2026 07:5x WEST: "the eyes must be floating... whatever dynamic elastic animation being done, the hex seam passes
 *  through... like as if it was magic source"): one dark line each side of her face, a tube on the circle of latitude y at radius r (both in her radius
 *  K), from azimuth `from` to `to` (radians either side of +z), `thick` its radius: the height of the bezel's upper fifth, starting under the bezel. */
export const EYE_LINE = HF.EYE_LINE;   // HER FACE, ONE SOURCE (her-face.js): the line's numbers live there, with the Board's
/** THE LIGHT GAME INSIDE HER (his same turn: "can you make it do the thing sometimes like light plays and like as if there is an underwater light game
 *  inside the unit0??"): water caustics on her porcelain and on her floating eyes, in her inner light (her glow towards white), `bars` of every `every`
 *  bars of the house clock, eased in and out over `ease` of a bar, so every glass plays the same light at the same instant. Nothing at rest: while the
 *  tide is 0 the shaders skip it (one uniform branch). */
export const TIDE = HF.TIDE, tideAt = HF.tideAt;   // HER FACE, ONE SOURCE (her-face.js)
/** THE EYES ACT LIKE BROCK, AND A GHOST IS SEALED IN HER (his Oct 12 2026 07:5x WEST: "can you animate the eyes like brock from pokemn? do you know the story of
 *  nelo angelo?? i need you to make that lyssajudron the ghost encapsulated of brock"). Brock's eyes are two closed lines that still act: a blink squeezes
 *  them thinner, they arc up when he is happy (^ ^), they slant in when he means it (\ /), and once in a long while they OPEN. Nelo Angelo is Vergil
 *  sealed in the black armour Mundus made of him, his face seen only when the helmet cracks: her porcelain is the armour, Brock the ghost sealed in it.
 *  From bar `at` of every `every` bars, for `bars` bars, the ghost opens its eyes: the lines part into two almonds with a fire in them (a slit pupil, a
 *  glint) in the colour of her eyes (the paint layer: ember as she was born), her seams glow from inside with it and her porcelain goes `dark` (the black angel), then they shut with a squeeze. She smiles (^ ^) while
 *  her light game plays (TIDE), slants in while she runs an errand (a carry, the scout), and blinks in most bars, at a beat the bar number picks (a
 *  hash), now and then twice. All of it a pure function of the house clock (brockAt): every glass acts the same face at the same instant, and a frozen
 *  clock holds it. Cost: a vec4 and a float a sample; ~20 ALU a vertex of the eyes (2 x 175), an iris test a fragment of the eyes, one multiply-add a
 *  fragment of her body while the ghost shows; no draw added. */
export const BROCK = HF.BROCK, brockAt = HF.brockAt;   // HER FACE, ONE SOURCE (her-face.js): brockAt(clock, {busy}) -> {ghost, open, arc, tilt, squeeze}, the same text the Board acts her face by
/** THE EYE LOCKS ON (his Oct 12 2026 12:54 WEST, over the well where his pointer stirs the smoke: "can you make it so that the eye locks in when i hover and
 *  cause smoke, eye of the lyssajudron locks in onto the cursor... so it follows the cursor around"). Her eye is the lens on her face (Curie's dark glass,
 *  its ring, the gold bezel: the one eye a glass sees of her). A point handed to lockOn() (a hand on a glass, where it stands in her room) is looked at as
 *  a creature looks: the GAZE locks on in a saccade (`gaze`, a stiff spring with a little overshoot: the snap), her FACE follows over her porcelain
 *  (`head`, softer, `share` of the way: the lens and Brock's floating eyes turn about her centre, her shell and its seams stay), the ring darts ahead
 *  inside the lens by what the face has not turned (`iris`: `per` of K a radian, at most `max` of K) and tightens as it locks (`focus`). The look is the
 *  angle between him and the point, seen from her centre, times `gain`, eased to at most `yaw` and `pitch` (in the well she hovers 0.47 m behind a 17 cm
 *  glass: its edge is 10 degrees from her; the face is a cartoon's), at most `turn` from her body's own front. No point: all of it goes home (`home`),
 *  then stands exactly as born and costs nothing. The springs are closed-form (exact for any step) on the clock handed to the sample; the hand is that
 *  glass's own, as the smoke's is: never on the Nest. */
export const LOCK = Object.freeze({ gaze: { hz: 6.5, zeta: 0.6 }, head: { hz: 2.4, zeta: 0.7, share: 0.7 }, home: { hz: 1.3, zeta: 0.9 }, focus: { hz: 4.5, zeta: 0.4, by: 0.16 },
  iris: { per: 0.5, max: 0.1 }, gain: 4, yaw: 0.8, pitch: 0.6, turn: 1.2 });
/** springTo(x, v, to, {hz, zeta}, dt_s) -> [x, v]: an underdamped spring (zeta < 1) stepped exactly over dt_s toward `to` (closed form: one step of 100 ms
 *  is ten of 10 ms). */
export function springTo(x, v, to, { hz, zeta }, dt) {   // a lookup: the spring's closed form at any elapsed time from where it was (exact: one step of 100 ms is ten of 10 ms)
  if (!(dt > 0)) return [x, v];
  const w = 2 * Math.PI * hz, a = zeta * w, wd = w * Math.sqrt(1 - zeta * zeta), e = x - to, k = Math.exp(-a * dt), c = Math.cos(wd * dt), s = Math.sin(wd * dt);   // a lookup: the closed form's envelope at the elapsed time
  return [to + k * (e * c + ((v + a * e) / wd) * s), k * (v * c - ((a * v + w * w * e) / wd) * s)];
}
/** THE GAZE ON HER (his Oct 13 2026 00:5x WEST, over her in the well while the eyes he had chosen showed only in the onboarding's strip: "why the fuck are
 *  the eyes not appearing onto the lyssajudron? remember the whole hexagon seam passthrough please remember it..."). Once her eyes have opened (the
 *  onboarding's milestone, `opened` on her paint ref) her floating eyes stay open in the form his hand gave them (`gaze` on the same ref, the onboarding's
 *  GAZE; none given yet: 'bare'): white, the iris in her eyes' paint, the form's pupil and lights, her lids in ink, and her hexagons still pass through
 *  them along the glass's own view ray (floatingEyeMaterial). Brock's blinks go on (a squeeze shuts the almond); the form's arc and slant stand for his;
 *  the ghost's bar still darkens her armour and lights her seams. No form (no milestone on the Nest): Brock's lines, as before. A form: open (0..1), arc
 *  and tilt (BROCK's units: tilt > 0 slants in, \ /; < 0 droops, / \), h (the almond's height, times BROCK's) and exp (its profile: lower is rounder),
 *  iris (its radius, in K), pupil (0 none, 1 slit, 2 round, 3 dot, 4 star, 5 spiral), glints (0..2). Cost: two uniforms; the pupil a branch a fragment. */
export const EYE_FORMS = HF.EYE_FORMS;   // HER FACE, ONE SOURCE (her-face.js): bare and the onboarding's nine, {open, arc, tilt, h, exp, iris, pupil, glints} each
const LY_DARK ={ lift: { value: new Float32Array(32) }, time: { value: 0 }, tide: { value: 0 }, color: { value: [1, 0.85, 0.66] }, ghost: { value: 0 }, iris: { value: [0.91, 0.34, 0.16] } };
// The caustic: Dave Hoskins' tileable water caustic (after joltz0r), four iterations, on a plane through her body turned a little to her side.
const LY_CAUSTIC_GLSL = `
float lyCaustic(vec3 p, float t) {
  vec2 q = mod(vec2(p.x * 0.9 + p.z * 0.35, p.y * 0.9 - p.z * 0.2) * 6.2831853, 6.2831853) - 250.0, i = q;
  float c = 1.0, inten = 0.005;
  for (int n = 0; n < 4; n++) {
    float tt = t * (1.0 - (3.5 / float(n + 1)));
    i = q + vec2(cos(tt - i.x) + sin(tt + i.y), sin(tt - i.y) + cos(tt + i.x));
    c += 1.0 / length(vec2(q.x / (sin(i.x + tt) / inten), q.y / (cos(i.y + tt) / inten)));
  }
  c /= 4.0; c = 1.17 - pow(c, 1.4);
  return clamp(pow(abs(c), 8.0), 0.0, 1.5);
}`;
/** floatingEyeMaterial(THREE, skin, radius, gold, light, faces): her floating eyes, dark, and her hexagons PASS THROUGH them (his Oct 12 2026 08:2x WEST,
 *  over the open eyes with the seams cast from her centre: "are you stupid dude? that is not hexagonal passthrough... are you acting like you dont have
 *  perfect data from the camera parameters?"). The glass's own camera, as three hands it to every draw (cameraPosition, modelMatrix), is taken into her
 *  frame; the view ray through each point of an eye goes on to her shell behind it (a convex polyhedron: it enters through the last plane it crosses
 *  inwards, passthrough()); that face shows faintly through the dark of the eye, and where the point behind lies on a face's edge her gold seam is
 *  drawn, as thin as on her shell: so from wherever a glass looks, her hex grid runs straight through the eyes and on around them, whatever the eyes do.
 *  uEyeLocal (userData.eyeLocal): the eyes' matrix in unit0's frame, one for both (they move as one). Plus the light game. And Brock acting
 *  (userData.brock, brockAt's arc, tilt, open, squeeze): the tube is bent in its vertex stage, never rebuilt: its centre line arcs and slants, a
 *  squeeze thins it, and opening stretches it apart along normal.y into an almond, where the ghost's eye burns (its fire, a slit pupil, a glint). */
export function floatingEyeMaterial(T, skin, radius, gold, light = null, faces = null) {
  const L = light || LY_DARK, N = skin.faces.length, P = skin.faces.filter((f) => f.chair >= 0).length;   // orb.js puts the pentagons first
  const K = radius.toFixed(5), R = (radius * EYE_LINE.thick).toFixed(5), H = (radius * 0.115).toFixed(5), LEN = ((EYE_LINE.to - EYE_LINE.from) * Math.sqrt(EYE_LINE.r ** 2 - EYE_LINE.y ** 2)).toFixed(4);
  const faceN = skin.faces.map((f) => new T.Vector3(f.normal[0], f.normal[1], f.normal[2]));
  const faceH = skin.faces.map((f) => radius * (f.normal[0] * f.verts[0][0] + f.normal[1] * f.verts[0][1] + f.normal[2] * f.verts[0][2]));
  const m = new T.MeshBasicMaterial({ color: 0x1a120c, toneMapped: false });
  m.userData.eyeLocal = new T.Matrix4(); m.userData.brock = new T.Vector4(BROCK.rest, 0, 0, 0);   // brock: x arc, y tilt, z open, w squeeze
  m.userData.gaze = new T.Vector4(0, 0, 0.085, 1); m.userData.shape = new T.Vector3(1, 0.75, 0.43);   // THE GAZE ON HER: x on, y pupil, z iris, w glints; shape: x height, y profile, z the iris along the line
  m.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, { uFaceN: { value: faceN }, uFaceH: { value: faceH }, uWireGold: { value: gold }, uEyeLocal: { value: m.userData.eyeLocal }, uLyTime: L.time, uLyTide: L.tide, uLyLight: L.color, uBrock: { value: m.userData.brock }, uGaze: { value: m.userData.gaze }, uShape: { value: m.userData.shape }, uLyGhost: L.ghost || LY_DARK.ghost, uLyIris: L.iris || LY_DARK.iris,
      uCoat: { value: faces?.coat || new T.Color(INK.ivoryDeep) }, uBase: { value: faces?.base || new T.Color(INK.ivory) } });
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform mat4 uEyeLocal;\nuniform vec4 uBrock;\nuniform vec4 uGaze;\nuniform vec3 uShape;\nvarying vec3 vLyE;\nvarying vec3 vLyV;\nvarying vec2 vBr;\nvarying float vBrN;')
      .replace('#include <begin_vertex>', `#include <begin_vertex>
  float brU = uv.x, brS = max(sin(3.14159265 * pow(brU, 0.83)), 0.0);   // along the line, inner end 0; the almond is widest where it faces him
  float brT = (1.0 - 0.55 * uBrock.w) * (1.0 + 0.8 * uGaze.x * (1.0 - min(uBrock.z * 4.0, 1.0))), brH = uBrock.z * (1.0 - 0.9 * uBrock.w * uGaze.x) * ${H} * uShape.x * pow(brS, uShape.y);   // THE GAZE ON HER: its height and profile, a blink shuts it; a form closed in a smile is inked bold
  transformed += normal * (${R} * (brT - 1.0));
  transformed.y += normal.y * brH + ${K} * (uBrock.x * 0.11 * (4.0 * brU * (1.0 - brU) - 0.5) + uBrock.y * 0.13 * (brU - 0.5) - uBrock.w * 0.012);
  vBr = vec2(brU, normal.y * (brH + ${R} * brT) / ${K}); vBrN = normal.y;
  vLyE = (uEyeLocal * vec4(transformed, 1.0)).xyz;
  mat4 lyToHer = uEyeLocal * inverse(modelMatrix);   // the glass's world into her frame: the camera's own parameters, as three hands them to this draw
  vLyV = isOrthographic ? mat3(lyToHer) * -vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]) : vLyE - (lyToHer * vec4(cameraPosition, 1.0)).xyz;`);
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', `#include <common>\nuniform vec3 uFaceN[${N}];\nuniform float uFaceH[${N}];\nuniform vec3 uWireGold;\nuniform float uLyTime;\nuniform float uLyTide;\nuniform vec3 uLyLight;\nuniform vec4 uBrock;\nuniform vec4 uGaze;\nuniform vec3 uShape;\nuniform float uLyGhost;\nuniform vec3 uLyIris;\nuniform vec3 uCoat;\nuniform vec3 uBase;\nvarying vec3 vLyE;\nvarying vec3 vLyV;\nvarying vec2 vBr;\nvarying float vBrN;\n${LY_CAUSTIC_GLSL}`)
      .replace('#include <color_fragment>', `#include <color_fragment>
  vec3 lyD = normalize(vLyV); float lyIn = -1e9, lyOut = 1e9; int lyK = 0;   // HEXAGONAL PASSTHROUGH: the view ray on to her shell behind this point
  for (int i = 0; i < ${N}; i++) { float nd = dot(uFaceN[i], lyD), t = (uFaceH[i] - dot(uFaceN[i], vLyE)) / nd; if (nd < -1e-5) { if (t > lyIn) { lyIn = t; lyK = i; } } else if (nd > 1e-5) { lyOut = min(lyOut, t); } }
  vec3 lyX = vLyE + lyD * lyIn, lyNk = uFaceN[lyK]; float lyEdge = 1.0;   // the face it enters, and how far inside that face the point lies from its nearest edge
  for (int j = 0; j < ${N}; j++) { float c = dot(uFaceN[j], lyNk); if (j != lyK && c > -0.999) { lyEdge = min(lyEdge, (uFaceH[j] - dot(uFaceN[j], lyX)) / sqrt(1.0 - c * c)); } }
  bool lyHit = lyIn > -1e8 && lyIn < lyOut; float lyEw = max(fwidth(lyEdge), 1e-6), lySeam = lyHit ? 1.0 - smoothstep(lyEw * 0.7, lyEw * 1.9, lyEdge) : 0.0;
  bool gzOn = uGaze.x > 0.5 && uBrock.z > 0.002; if (gzOn) diffuseColor.rgb = vec3(0.985, 0.975, 0.955);   // THE GAZE ON HER: the white of her eyes
  if (lyHit) diffuseColor.rgb = mix(diffuseColor.rgb, (lyK < ${P} ? uCoat : uBase) * (1.0 - ${BROCK.dark.toFixed(2)} * uLyGhost), 0.16);   // her face behind, faint in the dark of the eye
  if (uBrock.z > 0.002) {   // THE GHOST opens its eyes: its fire burns in them, a slit pupil, a glint (her seams still pass through them); or her gaze, open for good
    vec2 brP = vec2((vBr.x - uShape.z) * ${LEN}, vBr.y); float brD = length(brP), brAa = clamp(fwidth(brD), 1e-4, 0.03), brAx = max(fwidth(brP.x), 1e-4), brOn = smoothstep(0.0, 0.35, uBrock.z);
    float brIris = 1.0 - smoothstep(0.085 - brAa, 0.085 + brAa, brD);   // the edges filtered about themselves, a thin mark faded by its share of a pixel: on a small glass (lysa) the pupil never swallows the fire
    float brSlit = (1.0 - smoothstep(0.011 - brAx * 0.5, 0.011 + brAx * 0.5, abs(brP.x))) * min(1.0, 0.022 / brAx) * (1.0 - smoothstep(0.05, 0.068, abs(brP.y)));
    float brGlint = (1.0 - smoothstep(0.011 - brAa * 0.5, 0.011 + brAa * 0.5, length(brP - vec2(0.032, 0.03)))) * min(1.0, 0.022 / brAa);
    if (!gzOn) {
    vec3 brFire = mix(uLyIris * 1.3, vec3(1.0), 0.5 * (1.0 - smoothstep(0.0, 0.06, brD)));   // hotter towards the pupil
    diffuseColor.rgb = mix(diffuseColor.rgb, uLyIris, 0.45 * (1.0 - smoothstep(0.085, 0.17, brD)) * brOn);   // the fire bleeds into the dark of the almond
    diffuseColor.rgb = mix(diffuseColor.rgb, brFire * (1.0 - 0.85 * brSlit), brIris * brOn);
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), brGlint * brIris * uBrock.z);
    } else {   // THE GAZE ON HER: the iris in her eyes' paint, darker at its rim; the form's pupil; its lights; her lids in ink
    float gzR = uGaze.z, gzK = uGaze.y, gzIr = 1.0 - smoothstep(gzR - brAa, gzR + brAa, brD), gzPu = 0.0; vec3 gzPc = vec3(0.06);
    diffuseColor.rgb = mix(diffuseColor.rgb, mix(uLyIris, uLyIris * 0.6, smoothstep(gzR * 0.7, gzR, brD)), gzIr);
    if (gzK > 0.5 && gzK < 1.5) gzPu = (1.0 - smoothstep(gzR * 0.13 - brAx * 0.5, gzR * 0.13 + brAx * 0.5, abs(brP.x))) * min(1.0, gzR * 0.26 / brAx) * (1.0 - smoothstep(gzR * 0.78, gzR * 0.86, abs(brP.y)));   // a slit
    else if (gzK > 1.5 && gzK < 2.5) gzPu = 1.0 - smoothstep(gzR * 0.44 - brAa, gzR * 0.44 + brAa, brD);   // round
    else if (gzK > 2.5 && gzK < 3.5) gzPu = 1.0 - smoothstep(gzR * 0.3 - brAa, gzR * 0.3 + brAa, brD);   // a pinpoint
    else if (gzK > 3.5 && gzK < 4.5) { vec2 q = abs(brP) / (gzR * 0.8); float st = pow(q.x, 0.6667) + pow(q.y, 0.6667), sw = clamp(fwidth(st), 1e-4, 0.3);   // a star, white, inked at its edge
      diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.06), (1.0 - smoothstep(1.16 - sw, 1.16 + sw, st)) * gzIr); gzPu = 1.0 - smoothstep(1.0 - sw, 1.0 + sw, st); gzPc = vec3(1.0); }
    else if (gzK > 4.5) { float sp = fract(brD / (gzR * 0.26) - atan(brP.y, brP.x) / 6.2831853), sw = clamp(fwidth(sp), 1e-3, 0.2);   // a spiral
      gzPu = (1.0 - smoothstep(0.17, 0.17 + sw * 1.5, min(sp, 1.0 - sp))) * smoothstep(gzR * 0.04, gzR * 0.1, brD); }
    diffuseColor.rgb = mix(diffuseColor.rgb, gzPc, gzPu * gzIr);
    float gzG = uGaze.w > 0.5 ? 1.0 - smoothstep(gzR * 0.2 - brAa, gzR * 0.2 + brAa, length(brP - vec2(0.36, 0.36) * gzR)) : 0.0;   // its lights, towards the outer corner
    if (uGaze.w > 1.5) gzG = max(gzG, 1.0 - smoothstep(gzR * 0.1 - brAa, gzR * 0.1 + brAa, length(brP - vec2(-0.32, -0.38) * gzR)));
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(1.0), gzG * gzIr);
    diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.067), clamp(smoothstep(0.5, 0.74, vBrN) + smoothstep(0.66, 0.86, -vBrN), 0.0, 1.0));   // her lids in ink, the upper heavier
    }
  }
  diffuseColor.rgb = mix(diffuseColor.rgb, uWireGold + uLyIris * 1.6 * uLyGhost, lySeam);   // her seam where the glass sees it behind, lit from inside while the ghost shows
  if (uLyTide > 0.001) diffuseColor.rgb += uLyLight * lyCaustic(vLyE / ${radius.toFixed(4)}, uLyTime) * uLyTide * 0.9;`);
  };
  m.customProgramCacheKey = () => 'lyssa-floating-eye-5';
  return m;
}
/** passthrough(skin, radius, p, d): the eyes' view ray in JS, the shader's twin for the test: from p along d (her frame, metres) the face of her shell the
 *  ray enters, {face, at, edge} (edge: how far inside that face `at` lies from its nearest edge, metres), or null when the ray passes her by. */
export function passthrough(skin, radius, p, d) {
  const F = skin.faces, dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2], u = unit(d), h = F.map((f) => radius * dot(f.normal, f.verts[0]));
  let tin = -1e9, tout = 1e9, k = -1;
  F.forEach((f, i) => { const nd = dot(f.normal, u), t = (h[i] - dot(f.normal, p)) / nd; if (nd < -1e-5) { if (t > tin) { tin = t; k = i; } } else if (nd > 1e-5) tout = Math.min(tout, t); });
  if (k < 0 || !(tin < tout)) return null;
  const at = add(p, u, tin); let edge = Infinity;
  F.forEach((f, j) => { const c = dot(f.normal, F[k].normal); if (j !== k && c > -0.999) edge = Math.min(edge, (h[j] - dot(f.normal, at)) / Math.sqrt(1 - c * c)); });
  return { face: k, at, edge };
}
// HER PAINT (Oct 12 2026 07:1x WEST, his "can you make it more customizable please? like as if it was a spore demo creator app where you can select and
// paint... check", with the Spore Creature Creator's box): Spore's paint layers on her body. base: the twenty porcelain hexagons (unit0's and the
// satellites'), coat: the twelve pentagons, and her details: her gold (the wires, every face's edge, the bezel, the stalks, her home's rim), her eyes (the
// iris and the eye-stalks' pentagons), her flame (the thruster, its heart, its light). A part is a hex, or null: as she was born. The Nest holds them in
// PAINT_REF; the host reads it and calls paint() (this file keeps no clock of its own). The colour of her light is the well's own ref (well.mjs LIGHT_REF).
export const PAINT_PARTS = HF.PAINT_PARTS, PAINT_REF = HF.PAINT_REF, BORN_PAINT = HF.BORN_PAINT;   // HER FACE, ONE SOURCE (her-face.js): the ref {schema embertide.golem-paint/1, golem, parts, painted, gaze?, opened?, by, at, from}, her parts, her born colours
export const formOf = HF.formOf;   // formOf(the paint ref's value) -> the form her eyes wear ('bare', the onboarding's gaze), or null: Brock's lines (the well reads it through here)
const hexOk = (v) => (typeof v === 'string' && /^#[0-9a-fA-F]{6}$/.test(v) ? v.toUpperCase() : null);
/** partOf(hit): which of her parts a three.js intersection struck ('base', 'coat', 'gold', 'eyes', 'thruster', 'light'), else null. */
export function partOf(hit) {
  for (let o = hit?.object; o; o = o.parent) { const d = o.userData; if (d?.parts) return d.parts[hit.face?.materialIndex ?? 1] ?? null; if (d?.part) return d.part; }
  return null;
}
/** targetOf(x, twin): a target as a Station point: a vec3, {position}, a pose, or a seat name (its placed pose, else its ghost); null when nothing stands there. */
export function targetOf(x, twin = null) {
  const v = vec3(x) || vec3(x?.position) || vec3(x?.pose?.position); if (v) return v;
  if (typeof x === 'string' && twin) { try { return vec3(twin.place?.(x)?.position) || vec3(twin.ghost?.(x)?.position); } catch { return null; } }
  return null;
}
/** floorHit(camera, px, py, floorY): where a window point's ray meets the floor plane, or null (the cursor's room hit when the twin gives none). */
export function floorHit(cam, px, py, floorY = 0) {
  if (!cam || typeof cam.ray !== 'function') return null;
  const r = cam.ray(px, py); if (!r || Math.abs(r.d[1]) < 1e-6) return null;
  const t = (floorY - r.o[1]) / r.d[1]; if (t <= 0) return null;
  return add(r.o, r.d, t);
}
/** hitOf(detail): the cursor event's room hit as a point: hit.position | hit.point | hit itself. */
export const hitOf = (d) => vec3(d?.hit?.position) || vec3(d?.hit?.point) || vec3(d?.hit) || null;
/** quadCorners(centre, right, up, w, h): a quad's four corners. projectedRect(corners, project): their window box {x0, y0, x1, y1}, null when any is behind the eye. */
export const quadCorners = (p, r, u, w, h) => [add(add(p, r, -w / 2), u, h / 2), add(add(p, r, w / 2), u, h / 2), add(add(p, r, w / 2), u, -h / 2), add(add(p, r, -w / 2), u, -h / 2)];
export function projectedRect(corners, project) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const c of corners) { const q = project(c); if (!q) return null; x0 = Math.min(x0, q[0]); y0 = Math.min(y0, q[1]); x1 = Math.max(x1, q[0]); y1 = Math.max(y1, q[1]); }
  return { x0, y0, x1, y1 };
}
export const rectsOverlap = (a, b, margin = 8) => !!(a && b) && a.x0 < b.x1 + margin && b.x0 < a.x1 + margin && a.y0 < b.y1 + margin && b.y0 < a.y1 + margin;
/** cardSpot(body, cam, glasses): where the code card stands: at the figure's right, else its left, else above it: the first that covers no placed glass. */
export function cardSpot(body, cam, glasses = []) {
  const r = cam?.r || [1, 0, 0], u = cam?.u || [0, 1, 0];
  const spots = [add(add(body, r, 0.84), [0, 1, 0], 0.02), add(add(body, r, -0.84), [0, 1, 0], 0.02), add(body, [0, 1, 0], 0.76)];
  if (!cam || typeof cam.project !== 'function') return spots[0];
  const rects = [];
  for (const g of glasses) {
    const p = vec3(g?.pose?.position); if (!p) continue; const yaw = num(g.pose.yaw) ? g.pose.yaw : 0, w = num(g.pose.size?.[0]) ? g.pose.size[0] : 0.6, h = num(g.pose.size?.[1]) ? g.pose.size[1] : 0.35;
    const rc = projectedRect(quadCorners(p, [Math.cos(yaw), 0, -Math.sin(yaw)], [0, 1, 0], w, h), cam.project); if (rc) rects.push(rc);
  }
  if (!rects.length) return spots[0];
  for (const p of spots) { const rc = projectedRect(quadCorners(p, r, u, CARD_W, CARD_H), cam.project); if (rc && !rects.some((g) => rectsOverlap(rc, g))) return p; }
  return spots[2];
}

/** mountLyssajudron(twin, {THREE?, document?, clock?, stopwatch?, samplesPerBeat?, council?}) -> {lookAt(target, at_ms?), goTo(pos, at_ms?), say(line, at_ms?),
 *  carry(seat, image, at_ms?), remember(), hold(seat), lockOn(point | null) (THE EYE LOCKS ON), sample(detail), state(), stop()}. Returns at once; its objects stand in the twin's stage from the
 *  first paint. The options are seams for the test and the harness: THREE (else twin.THREE), document (null: no caption), clock (a function: the clock
 *  when the twin and the paint give none), stopwatch (a function returning ms, for state().work; never read for phase), samplesPerBeat (the cap, default
 *  SAMPLES_PER_BEAT; 0: none), council (default true: her twelve carry their twelve, THE COUNCIL AS THE BOARD'S SKIN; false for a glass that mounts and
 *  drives her council itself, the well: well.mjs THE COUNCIL'S LIFE), ferro (default true: the liquid under her tiles rides her body and wakes on the paint's
 *  `song`, HER FERROFLUID IN THE COUNCIL; false for a glass that mounts and drives it itself, the well: well.mjs HER FERROFLUID), breath (default true: her
 *  tiles breathe by themselves every sample on the paint's `song` and THE TWELVE PLAY's plan of hits, THE BREATH below; false for a glass that has the
 *  song's ear and says breathe({on, levels, open, song}) itself once a picture, after its band: the well). */
export function mountLyssajudron(twin, { THREE = null, document: doc = twin?.host?.ownerDocument ?? null, clock: clockFn = null, stopwatch = null, samplesPerBeat = SAMPLES_PER_BEAT, wasm = true, council: wantCouncil = true, ferro: wantFerro = true, breath: wantBreath = true } = {}) {
  const T = THREE || twin?.THREE, stage = twin?.stage;
  const S = { on: true, visible: true, chained: false, clock: SC.genesisClock(SC.GENESIS_MS), clockSource: 'none', lastSample_ms: -Infinity, barSeen: null,
    step: 'nothing', dial: null, line: SC.LINES.nothing, restText: SC.LINES.nothing, said: null, lines: [], lastNote: -Infinity, restBeat: null, restAt: null,
    start: [0, 0, 0], home: [0, 0, 0], floor: 0, goes: [], gazes: [], yaw0: 0, pose: [0, SC.HOVER_M, 0], yaw: 0, cam: null,
    him: null, work: null, around: null, env: [null, null, null], walls: [], things: [], glasses: [], held: null, pairing: { open: false, code: '' },
    carry: null, carried: null, hand: null, world: null, showing: null, guessesTold: null, cursorFromTwin: false, low: false, work_: { beat: null, ms: 0, n: 0, last: null }, draws: 0,
    pinned: null,   // pinned: where his hand set it down on the table (minis-layer.mjs's 'mini-go'): its home until the room is gone
    pinnedBy: null, anchor: null, handRev: null, rises: [], riseStart: 0, base: 0,   // THE ANCHOR: who pinned it ('hand' on this glass, 'nest' for the golem every glass reads, kept while it stands), the golem as last read, the rise chain (its stand's height over the floor, eased onto a thing and off it), the stand's height at the last sample
    chainStart: [0, 0, 0], hop: null, scout: null, hovered: false, dive: null, bob: null, placeSaid: new Set() };   // FIXER (Oct 11): the go chain's own start (a hop re-anchors it), the hop his hand asked for, the scout eye's errand, his pointer on it, the eye inside it
  S.placed = {}; S.only = null;   // HER UNIT1 AWAY: the satellites a glass has placed off their wires (place), the ones it draws alone (only)
  const counts = { samples: 0, skipped: 0, causes: 0, captionWrites: 0, touches: 0 };
  S.lock = { to: null, ms: null, g: [0, 0], gv: [0, 0], h: [0, 0], hv: [0, 0], f: 0, fv: 0, o: 0, ov: 0, touch: false, rest: true };   // THE EYE LOCKS ON: the point, the gaze and the face (yaw, pitch in her body's frame) with their speeds, the focus
  const offs = [];
  // THE LAW IN RUST (Oct 11; his 04:0x "write rust or c, i need hyperoptimized code" and his "everything matters"): the score and the flight law swap for
  // embertide-score's one .wasm (score-wasm.mjs: 47 KB fetched once at mount, the same bytes on every glass, pinned to the JS at 1e-9 by the crate's vectors) the
  // moment it lands; until then, and wherever it is not there, the JS laws run. Every sample after the swap is Rust's through SC.* and FL.*, live bindings:
  // nothing here copies a law at import (flightAt is read from FL at the call). state().law says which runs: 'js', 'rust', or 'mixed' when one half failed.
  S.law = 'js'; if (wasm) Promise.all([SC.useWasm(), FL.useWasm()]).then(([a, b]) => { S.law = a && b ? 'rust' : a || b ? 'mixed' : 'js'; call(() => twin?.host?.setAttribute?.('data-law', S.law)); }).catch(() => {});   // data-law on the host: any inspector reads which law runs, no probe
  const call = (f, ...a) => { try { return f(...a); } catch { return null; } };
  const on = (ev, fn) => { if (typeof twin?.on !== 'function') return; const off = twin.on(ev, fn); offs.push(typeof off === 'function' ? off : () => twin.off?.(ev, fn)); };
  const nowClock = () => clockFrom(null);   // the clock a cause is stamped with: the twin's now, else the option's, else the last sample's

  // ---- the objects: built once, moved per sample ----
  let lyLight = null, lyWhite = null, eyeMat = null, tank = null; const faceEyes = [];   // the light game's holder, her floating eyes (HER FACE)
  let root = null, bodyGroup = null, body = null, edges = null, sats = null, council = null, ferro = null, eyes = null, wires = [], wireMat = null, thruster = null, core = null, glow = null, pool = null, floor = null, rim = null, stalks = [];
  let tiles = null, marks = null, shut = null, openAttr = null;   // THE BREATH: unit0's tiles (her-breath.mjs tilesOf), her face's marks and the tiles they keep shut, her twelve's aLyOpen
  S.breath = { on: 0, song: null, rest: true, peak: 0, held: 0, off: null };
  const PENT = new Float64Array(SC.SEATS), HELD = new Float32Array(SC.SEATS), LIFT1 = new Float32Array(SC.SEATS), WROTE = new Uint8Array(SC.SEATS), TURNED = [0, 0, 0, 1], BREATHED = { unit0: null, unit1: LIFT1 };
  let codeQuad = null, holdQuad = null, carryQuad = null, skin = null, lens = null, irisMat = null, flare = null, inkMat = null, paperMat = null, bezel = null;
  const M4 = T ? new T.Matrix4() : null, Q = T ? new T.Quaternion() : null, V = T ? new T.Vector3() : null, V2 = T ? new T.Vector3() : null, SCL = T ? new T.Vector3(1, 1, 1) : null, SCP = T ? new T.Vector3(1, 1, 1) : null;   // SCP: the size of a placed or an undrawn satellite (place, only)
  const Z = T ? new T.Vector3(0, 0, 1) : null, Y = T ? new T.Vector3(0, 1, 0) : null;
  const LENS_AT = T ? new T.Vector3(0, SC.K * 0.08, SC.K * 0.98) : null, IRIS_Z = 0.014, QL = T ? new T.Quaternion() : null, QT = T ? new T.Quaternion() : null, EL = T ? new T.Euler(0, 0, 0, 'YXZ') : null; let irisMesh = null;   // THE EYE LOCKS ON: where her lens sits as born, its ring, her face's turn
  function makeWires(segments) {
    for (const w of wires) { w.removeFromParent(); w.children[0]?.geometry?.dispose?.(); }   // a wire is a Group round its Line (stop() disposes it the same way)
    wires = [];
    for (let lane = 0; lane < SC.LANES; lane++) {
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(SC.wirePoints(lane, segments).flat(), 3));
      const line = new T.Line(g, wireMat); line.renderOrder = 4; line.userData.lane = lane;   // its lane: THE TWELVE REACH bends it through its satellites (lyssajudron-band.mjs)
      const grp = new T.Group(); grp.userData.part = 'gold'; grp.add(line); bodyGroup.add(grp); wires.push(grp);
    }
  }
  function quad(w, h) {
    const m = new T.Mesh(new T.PlaneGeometry(w, h), new T.MeshBasicMaterial({ color: 0xffffff, side: T.DoubleSide, toneMapped: false, transparent: true }));
    m.visible = false; m.renderOrder = 6; root.add(m); return m;
  }
  if (T && stage && typeof stage.addLayer === 'function') {
    skin = buildGoldberg(1, 1);
    root = new T.Group(); root.name = 'lyssajudron';
    lyLight = { lift: { value: new Float32Array(32) }, time: { value: 0 }, tide: { value: 0 }, color: { value: new T.Color(0xffe2b8) }, ghost: { value: 0 }, iris: { value: new T.Color(INK.ember) } }; lyWhite = new T.Color(0xffffff);
    inkMat = porcelain(T, INK.ivoryDeep, 0.46, lyLight);   // FIXER (Oct 11): the twelve a deeper ivory, gold-wired; gold-filled pentagons on white hexagons read as a football, never a Curie-like robot
    paperMat = porcelain(T, INK.ivory, 0.34, lyLight);     // the twenty: ivory porcelain, a glaze's sheen
    wireMat = new T.LineBasicMaterial({ color: INK.gold, transparent: true, opacity: SC.WIRE_OPACITY, toneMapped: false });   // one material for the four wires: one opacity write per sample (the downbeat's flash)
    bodyGroup = new T.Group(); bodyGroup.name = 'unit0'; root.add(bodyGroup);
    // HIS ORDER (Oct 16 2026 15:5x WEST): "the only thing that needs to happen is that the unit0 keeps all it has right now and juse the colored hexagonal faces now become
    // glass... the rest is unchanges as it is". So the twenty hexagons (part `base`, the porcelain his picture tints) are the glass of the flask (unit0-liquid.mjs glassShell)
    // and the twelve pentagons (part `coat`) stay the porcelain they were, with their gold wire; the twelve satellites keep both as before.
    body = new T.Mesh(goldbergGeometry(T, skin, SC.K), [inkMat, glassShell(paperMat)]); body.castShadow = true; body.renderOrder = 5; body.userData.parts = ['coat', 'base']; bodyGroup.add(body);
    tank = createUnit0Liquid(T, SC.K); bodyGroup.add(tank.group);
    if (wantFerro) { try { ferro = mountFerro(T, { radius: SC.K, light: lyLight.color.value }); body.add(ferro.mesh); } catch (e) { ferro = null; S.ferroError = String(e?.message || e).slice(0, 120); } } else { ferro = null; S.ferroError = "the glass's own"; }   // HER FERROFLUID IN THE COUNCIL: the liquid on her shell (the parent and the axes the well gives it, well.mjs HER FERROFLUID), its gloss in her inner light's hue; a fault leaves her as she was; ferro: false, the well's own
    edges = null;   // FIXER: the faces' own gold wire (porcelain()) replaces the ink hairlines
    try { tiles = HB.tilesOf(skin); marks = HB.marksOf(); shut = HB.shutOf(tiles, marks, null); } catch (e) { tiles = null; S.breath.off = String(e?.message || e).slice(0, 120); }   // THE BREATH: her tiles' adjacency and the tiles her face keeps shut, built once; a fault leaves her sealed, as she was
    // FIXER: its gaze, Curie's: a dark glass lens with an ember iris on the face it turns (the body's +z is its yaw: it looks where it turns), in a gold bezel
    lens = new T.Group(); lens.name = 'lens'; lens.userData.part = 'eyes'; lens.position.copy(LENS_AT); bodyGroup.add(lens);
    const lensGlass = new T.Mesh(new T.CircleGeometry(SC.K * 0.34, 28), new T.MeshStandardMaterial({ color: 0x15100b, roughness: 0.08, metalness: 0.1 })); lensGlass.position.z = 0.012;
    const iris = new T.Mesh(new T.RingGeometry(SC.K * 0.13, SC.K * 0.22, 28), new T.MeshBasicMaterial({ color: INK.ember, toneMapped: false })); iris.position.z = IRIS_Z; irisMesh = iris;
    const glint = new T.Mesh(new T.CircleGeometry(SC.K * 0.045, 10), new T.MeshBasicMaterial({ color: 0xfff6e6, toneMapped: false })); glint.position.set(-SC.K * 0.12, SC.K * 0.12, 0.016);
    bezel = new T.Mesh(new T.TorusGeometry(SC.K * 0.355, SC.K * 0.045, 6, 28), new T.MeshStandardMaterial({ color: INK.wire, roughness: 0.3, metalness: 0.75, emissive: 0x4a3209, emissiveIntensity: 0.4 })); bezel.position.z = 0.012;
    for (const m of [lensGlass, iris, glint, bezel]) { m.renderOrder = 5; lens.add(m); }
    bezel.userData.part = 'gold';
    irisMat = iris.material; lyLight.iris.value = irisMat.color;   // the ghost's fire is the colour of her eyes, painted or as born (BROCK)
    // HER FACE (Oct 12 2026 07:3x-07:5x WEST, his "doesnt he look like brock from pokemon?" over her lens, "add eyes and make the red light the mouth",
    // "make them like the pic", "the hex grid seam passes over the eyes... how close to the red light", then "the eyes must be floating... the hex seam
    // passes through... like as if it was magic source"): the lens stays where it was, its ember ring her mouth; Brock's eyes FLOAT off her shell
    // (EYE_LINE), and since 08:2x her hexagons pass through them along the glass's own view ray (floatingEyeMaterial, passthrough). Two tubes, one
    // material, two draws.
    eyeMat = floatingEyeMaterial(T, skin, SC.K, inkMat.userData.wireGold, lyLight, { coat: inkMat.color, base: paperMat.color });
    for (const side of [-1, 1]) {
      const r = Math.sqrt(EYE_LINE.r ** 2 - EYE_LINE.y ** 2), pts = [];
      for (let i = 0; i <= 16; i++) { const a = side * (EYE_LINE.from + ((EYE_LINE.to - EYE_LINE.from) * i) / 16); pts.push(new T.Vector3(Math.sin(a) * r * SC.K, EYE_LINE.y * SC.K, Math.cos(a) * r * SC.K)); }
      const eye = new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts), 24, SC.K * EYE_LINE.thick, 6, false), eyeMat);
      eye.name = side < 0 ? 'eye-left' : 'eye-right'; eye.userData.part = 'eyes'; eye.renderOrder = 5; bodyGroup.add(eye); faceEyes.push(eye);
    }
    setForm(S.form ?? null);   // THE GAZE ON HER: a form named before her eyes were built
    thruster = new T.Mesh(new T.ConeGeometry(SC.K * 0.62, 1, 16, 1, true), new T.MeshBasicMaterial({ color: INK.ember, transparent: true, opacity: 0.82, depthWrite: false, toneMapped: false, side: T.DoubleSide }));   // FIXER: the flame in normal blending (added light vanished over the bright mat and the ivory board)
    thruster.rotation.x = Math.PI; thruster.renderOrder = 6; thruster.userData.part = 'thruster'; bodyGroup.add(thruster);   // the cone's tip down
    core = new T.Mesh(new T.ConeGeometry(SC.K * 0.3, 1, 12, 1, true), new T.MeshBasicMaterial({ color: 0xffd27a, transparent: true, opacity: 0.95, depthWrite: false, toneMapped: false, side: T.DoubleSide }));
    core.rotation.x = Math.PI; core.renderOrder = 6; core.userData.part = 'thruster'; bodyGroup.add(core);   // the flame's white heart
    glow = new T.Mesh(new T.SphereGeometry(SC.K * 0.34, 10, 8), new T.MeshBasicMaterial({ color: 0xffb07a, transparent: true, opacity: 0.7, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false })); glow.renderOrder = 6; glow.userData.part = 'light'; bodyGroup.add(glow);
    makeWires(SC.WIRE_SEGMENTS);
    if (doc?.createElement) {   // FIXER: the thruster's light as an eye reads it over a bright table: a warm halo under the body (normal blending, not added light), swelling on the downbeat
      const c = doc.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d');
      if (x) { const g = x.createRadialGradient(64, 64, 2, 64, 64, 64); g.addColorStop(0, 'rgba(255,190,90,0.95)'); g.addColorStop(0.25, 'rgba(244,110,40,0.7)'); g.addColorStop(0.6, 'rgba(232,87,42,0.22)'); g.addColorStop(1, 'rgba(232,87,42,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128);
        const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace;
        flare = new T.Sprite(new T.SpriteMaterial({ map: tex, transparent: true, depthWrite: false, toneMapped: false })); flare.name = 'thruster-light'; flare.renderOrder = 6; flare.userData.part = 'thruster'; bodyGroup.add(flare); }
    }
    sats = new T.InstancedMesh(goldbergGeometry(T, skin, SC.K * SC.CHILD_SCALE), [inkMat, paperMat], SC.SEATS); sats.castShadow = true; sats.renderOrder = 5; sats.userData.parts = ['coat', 'base']; root.add(sats);
    for (const [name, n] of [['aLyTone', 3], ['aLyEye', 4], ['aLyPush', 4], ['aLySpin', 4], ['aLyOpen', 1]]) sats.geometry.setAttribute(name, new T.InstancedBufferAttribute(new Float32Array(SC.SEATS * n), n).setUsage(T.DynamicDrawUsage)); openAttr = sats.geometry.getAttribute('aLyOpen');   // THE TWELVE PLAY's lantern, shut (all 0) until a band opens it (lyssajudron-band.mjs)
    if (wantCouncil) { try { council = mountCouncil(T, { sats }); } catch (e) { council = null; S.councilError = String(e?.message || e).slice(0, 120); } } else { council = null; S.councilError = "the glass's own"; }   // THE COUNCIL AS THE BOARD'S SKIN: her twelve's twelve, beside the satellites (the same parent, the same axes); a fault leaves her as she was. council: false (Oct 14 2026 01:0x): the well mounts and drives her council itself (well.mjs THE COUNCIL'S LIFE, on the band's open and offsets); from Oct 13 16:46 to then it carried both, 288 chairs on two clocks
    eyes = new T.InstancedMesh(new T.CircleGeometry(SC.K * SC.CHILD_SCALE * 0.8, 5), new T.MeshBasicMaterial({ color: INK.ember, toneMapped: false, side: T.DoubleSide }), EYES.length); eyes.renderOrder = 6; eyes.userData.part = 'eyes'; root.add(eyes);
    floor = new T.Mesh(new T.CircleGeometry(FLOOR_R, 48), new T.MeshStandardMaterial({ color: INK.floor, roughness: 1, metalness: 0, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 })); floor.rotation.x = -Math.PI / 2; floor.receiveShadow = true; floor.renderOrder = 1; root.add(floor);   // the depth offset: it lies on the twin's wood floor (room-3d's depth range 0.001-10000 m: millimetres z-fight, the fan's wedges showed as a starburst)
    const stalkGeo = new T.CylinderGeometry(0.009, 0.013, 1, 6, 1, true); stalkGeo.translate(0, 0.5, 0);   // a thin gold stalk from the body's rim to its eye, grown along y: the drawn line from unit0 to the satellite, however far it reaches
    for (const e of EYES) { const l = new T.Mesh(stalkGeo, new T.MeshBasicMaterial({ color: INK.gold, transparent: true, opacity: 0.85, toneMapped: false })); l.renderOrder = 5; l.visible = false; l.userData.part = 'gold'; root.add(l); stalks[e] = l; }   // the eye-stalks (Curie's): shown whenever an eye is off its wire, so no eye is ever a stray ball
    pool = new T.Mesh(new T.CircleGeometry(0.2, 32), new T.MeshBasicMaterial({ color: INK.ember, transparent: true, opacity: 0.2, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 })); pool.rotation.x = -Math.PI / 2; pool.renderOrder = 3; root.add(pool);   // the thruster's light on the floor
    rim = new T.Mesh(new T.RingGeometry(FLOOR_R - 0.012, FLOOR_R, 64), new T.MeshBasicMaterial({ color: INK.gold, transparent: true, opacity: 0.5, toneMapped: false, side: T.DoubleSide, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -4 })); rim.rotation.x = -Math.PI / 2; rim.renderOrder = 2; root.add(rim);
    codeQuad = quad(CARD_W, CARD_H); holdQuad = quad(0.16, 0.1); carryQuad = quad(1, 1);   // the carried card: a unit, scaled to the card's height as it is drawn
    stage.addLayer(root);
  }
  const textQuad = (q, lines, { w = 768, h = 256, size = 84, fg = '#242522', head = '' } = {}) => {   // the full text, fitted: the font shrinks until the widest line fits the card. FIXER: the table's one paper, a parchment place-card with the gold double rule (minis-layer.mjs's nameplates), a small gold head over it
    if (!q || !doc?.createElement) return;
    const c = doc.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); if (!x) return;
    const bg = x.createLinearGradient(0, 0, 0, h); bg.addColorStop(0, '#f7f1e3'); bg.addColorStop(1, '#ecdfc4'); x.fillStyle = bg; x.fillRect(0, 0, w, h);
    x.strokeStyle = '#c9a14a'; x.lineWidth = 16; x.strokeRect(8, 8, w - 16, h - 16); x.strokeStyle = 'rgba(176,136,58,0.85)'; x.lineWidth = 6; x.strokeRect(30, 30, w - 60, h - 60);
    const top = head ? h * 0.2 : 0, font = (px) => `700 ${px}px Archivo, system-ui, sans-serif`; let px = head ? Math.min(size, 70) : size; x.font = font(px);
    const widest = Math.max(0, ...lines.map((t) => x.measureText(t).width)); if (widest > w - 110) { px = Math.max(16, Math.floor(px * (w - 110) / widest)); x.font = font(px); }
    x.textAlign = 'center'; x.textBaseline = 'middle';
    if (head) { x.fillStyle = '#8a6a2c'; x.font = `700 ${Math.round(h * 0.17)}px Archivo, system-ui, sans-serif`; x.fillText(head, w / 2, h * 0.33); x.font = font(px); }
    x.fillStyle = fg; lines.forEach((t, i) => x.fillText(t, w / 2, h / 2 + top * 0.6 + (i - (lines.length - 1) / 2) * px * 1.2));
    q.material.map?.dispose(); const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; q.material.map = tex; q.material.needsUpdate = true;
  };
  const mirrorQuad = (q) => {   // FIXER: the glass it holds is a tiny gilded mirror, asleep (the table's mirrors, minis-layer.mjs), never a blank white card
    if (!q || !doc?.createElement) return;
    const c = doc.createElement('canvas'); c.width = 128; c.height = 80; const x = c.getContext('2d'); if (!x) return;
    x.fillStyle = '#c9a14a'; x.fillRect(0, 0, 128, 80); x.fillStyle = '#f3d58a'; x.fillRect(3, 3, 122, 74);
    const g = x.createRadialGradient(52, 30, 4, 64, 40, 70); g.addColorStop(0, '#3a4a55'); g.addColorStop(0.6, '#1b252d'); g.addColorStop(1, '#0d1217'); x.fillStyle = g; x.fillRect(10, 10, 108, 60);
    x.fillStyle = 'rgba(255,248,230,0.28)'; x.beginPath(); x.moveTo(28, 70); x.lineTo(70, 10); x.lineTo(84, 10); x.lineTo(42, 70); x.closePath(); x.fill();
    q.material.map?.dispose(); const tex = new T.CanvasTexture(c); tex.colorSpace = T.SRGBColorSpace; q.material.map = tex; q.material.needsUpdate = true;
  };
  const imageQuad = (q, image) => {
    if (!q) return;
    q.material.map?.dispose();
    if (image && T) { const tex = new T.CanvasTexture(image); tex.colorSpace = T.SRGBColorSpace; q.material.map = tex; q.material.color.set(0xffffff); }
    else { q.material.map = null; q.material.color.set(INK.paper); }
    q.material.needsUpdate = true;
  };

  // ---- the caption: hologram.mjs's makeLayer/writeCaption/moveCaption, ported ----
  let layer = null, cap = null, capAt = null;
  function makeLayer(parent) {
    if (layer || !doc || typeof parent?.append !== 'function') return layer;
    layer = doc.createElement('div'); layer.className = 'lyssajudron'; layer.style.cssText = 'position:absolute;inset:0;overflow:hidden;pointer-events:none;';
    cap = doc.createElement('div'); cap.className = 'lyssajudron-line'; cap.setAttribute('role', 'status'); cap.setAttribute('aria-live', 'polite');
    cap.style.cssText = CAPTION_CSS; layer.append(cap); parent.append(layer);
    try { if (doc.defaultView?.getComputedStyle(parent).position === 'static') parent.style.position = 'relative'; } catch { /* a parent we cannot read: left as it is */ }
    writeCaption();
    return layer;
  }
  function writeCaption() { if (cap && cap.textContent !== S.line) { cap.textContent = S.line; counts.captionWrites++; } }
  function moveCaption(x, y, shown = true) {
    if (!cap) return;
    if (!shown) { if (cap.style.visibility !== 'hidden') cap.style.visibility = 'hidden'; capAt = null; return; }
    const rx = Math.round(x * 2) / 2, ry = Math.round(y * 2) / 2;
    if (capAt && capAt[0] === rx && capAt[1] === ry) return;
    capAt = [rx, ry]; cap.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, 0)`; cap.style.visibility = 'visible';
  }
  if (twin?.host) makeLayer(twin.host);

  // ---- the clock and the chain ----
  function clockFrom(detail) {
    const fromPaint = detail?.clock ?? null, fromTwin = fromPaint ? null : typeof twin?.clock === 'function' ? call(() => twin.clock()) : null, fromOption = fromPaint || fromTwin ? null : typeof clockFn === 'function' ? call(clockFn) : null;
    const c = fromPaint ?? fromTwin ?? fromOption;
    S.clockSource = fromPaint ? 'paint' : fromTwin ? 'twin' : fromOption ? 'option' : 'none';
    return c ? SC.normalClock(c) : S.clock;   // nothing gives a time: the last sample's (at mount, the genesis epoch: frozen until a clock arrives)
  }
  const canAnimate = () => typeof twin?.animate === 'function';
  function chain(onOff) {
    const want = onOff && S.on && S.visible;
    if (canAnimate()) { if (want !== S.chained) { S.chained = want; call(() => twin.animate(want, 'lyssajudron')); } return; }
    S.chained = want;
    if (want) { counts.touches++; if (typeof stage?.touch === 'function') stage.touch(); else twin?.requestPaint?.(); }   // the twin's one paint request, through the stage's cause
  }
  const visibleNow = () => !(doc?.hidden === true);
  function onVisibility() { S.visible = visibleNow(); chain(S.visible); }
  doc?.addEventListener?.('visibilitychange', onVisibility);

  // ---- the state as a function of the clock (section 1's motions) ----
  const chainAtXZ = (c) => SC.chainAt(S.goes, S.chainStart, c, c.beats_per_bar, SC.mix);   // a go-to: one bar from its downbeat, chained
  // THE ANCHOR: the rise, its stand's height over the floor where it stands (0 on the floor; on the sofa its seat cushion over the sofa's foot), rides the
  // go chain's beats and the hop's: onto a thing over the first half of a move, off it over the second, so the stand never cuts through a thing's side
  const riseStep = (a, b, k) => a + (b - a) * SC.smooth(b > a ? Math.min(1, 2 * k) : Math.max(0, 2 * k - 1));
  const hoverOver = (rise) => Math.max(SC.HOVER_M, rise + RISE_MIN);   // its centre at eye height over the floor, or just over a thing taller than that
  /** liftAt(c): {rise, arc, k}: the hop's while it flies (its beats, its arc), else the rise chain's. */
  const liftAt = (c) => {
    const h = S.hop, t = SC.beatsAt(c);
    if (h && t < h.beat + h.span) { if (t < h.beat) return { rise: h.riseFrom, arc: 0, k: 0 }; const k = SC.smooth((t - h.beat) / h.span); return { rise: riseStep(h.riseFrom, h.riseTo, k), arc: 4 * k * (1 - k) * h.arc, k }; }
    return { rise: SC.chainAt(S.rises, S.riseStart, c, c.beats_per_bar, riseStep), arc: 0, k: 1 };
  };
  // Body height is a pure sample of the shared clock. A renderer cannot ease from
  // its previous picture: late mounts and sleeping screens have different histories.
  // Any future transition must be a shared, stamped cause with both endpoint laws.
  const bobAt = (c, base, bobClock = S.bob ?? S.dance ?? c) => BOB_CALM * (SC.hoverY(bobClock, base) - base);
  const bobState = () => { const k = S.bob ?? S.dance ?? S.clock; return { clock: S.bob ? 'bob' : S.dance ? 'dance' : 'paint', source: k.source, bpm: Math.round(k.bpm * 10) / 10, fading: false }; };
  /** bodyAt(c): the body now: the go chain; while his hand's hop flies (FIXER: from the beat after the click, HOP.beats long, an arc HOP.arc high: the
   *  ads' three seconds, never a whole bar from a downbeat), the hop. Before its beat it stands where it was set down; after it the chain, re-anchored at the hop's end. */
  const bodyAt = (c, bobClock = S.bob ?? S.dance ?? c) => {
    const h = S.hop, t = SC.beatsAt(c), l = liftAt(c), base = S.floor + hoverOver(l.rise), y = base + bobAt(c, base, bobClock) + l.arc;   // CALM: a share of the bob, on the bob clock (bobAt: the song's while it plays, else the dance clock's, still while the song is)
    if (h && t < h.beat + h.span) { if (t < h.beat) return [h.from[0], y, h.from[2]]; const p = SC.mix(h.from, h.to, l.k); return [p[0], y, p[2]]; }
    const p = chainAtXZ(c); return [p[0], y, p[2]];
  };
  const baseAt = (c) => { const l = liftAt(c); return S.floor + l.rise + l.arc; };   // where its stand's base stands now: the floor, or the thing it was set on (minis-layer.mjs reads it, base())
  /** thingAt(p): the held thing under the spot p, told on the bus (the terrain has set it down), its centre nearest p -> {t, rise}: the height its stand
   *  rests at there over the thing's foot (terrain-layer.mjs restOf: a sofa's seat cushion, a table's top). Else null: the floor. */
  function thingAt(p) {
    if (!p || !S.things.length) return null;
    const M = call(() => twin?.model?.()), things = Array.isArray(M?.things) ? M.things : []; let best = null, bd = Infinity;
    for (const t of things) {
      if (!Array.isArray(t?.at) || !Array.isArray(t?.size) || !S.things.some((x) => x.id === t.id)) continue;
      const cs = Math.cos(t.yaw || 0), sn = Math.sin(t.yaw || 0), dx = p[0] - t.at[0], dz = p[2] - t.at[2], s = dx * cs - dz * sn, v = dx * sn + dz * cs;
      if (Math.abs(s) > t.size[0] / 2 + 0.02 || Math.abs(v) > t.size[2] / 2 + 0.02) continue;   // its footprint, in its own frame as restOf reads it
      const d = Math.hypot(dx, dz); if (d < bd) { bd = d; best = t; }
    }
    if (!best) return null;
    const y = call(() => restOf(best, M.room?.ring || [], p)); return num(y) ? { t: best, rise: Math.max(0, y - (best.at[1] - best.size[1] / 2)) } : null;
  }
  const riseOf = (p) => thingAt(p)?.rise ?? 0;
  const yawAt = (c) => SC.chainAt(S.gazes, S.yaw0, c, 1, SC.yawStep);                                                                                   // a turn: one beat from its beat, chained
  const note = (list, to, beat) => { list.push({ to, beat }); list.sort((a, b) => a.beat - b.beat); };
  const localOf = (p, bodyP, yaw) => { const d = sub(p, bodyP), cs = Math.cos(yaw), sn = Math.sin(yaw); return [d[0] * cs - d[2] * sn, d[1], d[0] * sn + d[2] * cs]; };   // R_y(-yaw)(p - body)
  const drawing = (c) => { const b = SC.beatsAt(c); return S.walls.findLast((w) => b >= w.beat && b < w.beat + c.beats_per_bar) || null; };   // the newest wall in its bar
  const placedGlasses = () => S.glasses.filter((g) => g.pose);
  const viewerP = () => vec3(call(() => twin?.viewer?.())?.position) || (S.cam ? [...S.cam.C] : null);   // the Mac's placed glass, else this window's eye (the hand reaches toward it)
  const nameOf = (seat) => { const g = (call(() => twin?.glasses?.()) || []).find((x) => x && x.seat === seat); return typeof g?.name === 'string' && g.name.trim() ? g.name.trim() : null; };   // the Nest's own name for the seat (A10), never a kind
  /** homeOf(): the room's centre on its floor once walls stand (the mean of the held walls' midpoints, kept STAND_M off every wall on the disc's side:
   *  one wall's mean is the wall itself), else the disc's centre. */
  function homeOf() {
    if (S.pinned) return [S.pinned[0], S.floor, S.pinned[2]];   // the dungeon master put it there: it stays
    if (!S.walls.length) return [S.start[0], S.floor, S.start[2]];
    let x = 0, z = 0; for (const w of S.walls) { x += (w.a[0] + w.b[0]) / 2; z += (w.a[2] + w.b[2]) / 2; }
    let h = [x / S.walls.length, S.floor, z / S.walls.length];
    for (const w of S.walls) {   // off the wall's line by STAND_M, toward where it started (the disc): the side he walked
      const ux = w.b[0] - w.a[0], uz = w.b[2] - w.a[2], L = Math.hypot(ux, uz); if (L < 1e-6) continue;
      const t = Math.max(0, Math.min(1, ((h[0] - w.a[0]) * ux + (h[2] - w.a[2]) * uz) / (L * L))), fx = w.a[0] + ux * t, fz = w.a[2] + uz * t, d = Math.hypot(h[0] - fx, h[2] - fz);
      if (d >= STAND_M) continue;
      let nx = -uz / L, nz = ux / L; if (nx * (S.start[0] - fx) + nz * (S.start[2] - fz) < 0) { nx = -nx; nz = -nz; }
      h = [fx + nx * STAND_M, S.floor, fz + nz * STAND_M];
    }
    return h;
  }
  const onTable = () => call(() => twin?.terrain?.()) === true;   // the D&D table stands (terrain-layer.mjs's claim; twin.terrain() with no word only answers)
  /** restText(): the line it returns to: on the D&D table, once walls stand, a dungeon master's companion inviting the one gesture (FIXER: "Home, as I
   *  remember it. 3 walls." was a count, never a voice); elsewhere the score's own rest line. */
  const restText = () => {
    if (S.walls.length && !S.showing && onTable()) { const name = S.pinned ? thingName(thingAt(S.pinned)?.t.kind) : null;   // THE ANCHOR: set on a held thing, it names it
      return SC.clipLine(name ? (S.step === 'old' ? ANCHOR_LINES.old(name) : ANCHOR_LINES.home(name)) : S.step === 'old' ? TABLE_LINES.old : TABLE_LINES.home); }
    return SC.clipLine(SC.restLineOf({ phase: S.step, walls: S.walls.length, things: S.things.length, showing: S.showing, dial: S.dial }));
  };
  function targets(c, cam) {
    const w = drawing(c);
    const work = w ? mix(w.top[0], w.top[1], 0.5) : S.work;
    const him = S.him || (cam ? [...cam.C] : null);
    const placed = placedGlasses(), around = placed.length ? vec3(placed[((c.bar % placed.length) + placed.length) % placed.length].pose.position) : null;
    return [him, work, around];
  }
  /** lockFace(c, bodyP, yaw, cam): THE EYE LOCKS ON, stepped to this sample's clock. QL is her face's turn in her body's frame (identity while she stands
   *  as born); her lens turns with it, its ring set ahead and tightened. */
  function lockFace(c, bodyP, yaw, cam) {
    const L = S.lock, dt = L.ms == null ? 0 : Math.min(1, Math.max(0, (c.now_ms - L.ms) / 1000)); L.ms = c.now_ms;
    if (!L.to && L.rest) return;
    let ty = 0, tp = 0;
    if (L.to) {   // the look in her body's frame: from him (else her own front) towards the point, `gain` times the angle, eased
      const d = sub(L.to, bodyP), C = cam ? vec3(cam.C) : null, d0 = C ? sub(C, bodyP) : [Math.sin(yaw), 0, Math.cos(yaw)];
      const yawOf = (v) => Math.atan2(v[0], v[2]), pitchOf = (v) => Math.atan2(v[1], Math.hypot(v[0], v[2])), wrap = (a) => Math.atan2(Math.sin(a), Math.cos(a)), ease = (x, m) => m * Math.tanh((LOCK.gain * x) / m);
      ty = Math.max(-LOCK.turn, Math.min(LOCK.turn, wrap(yawOf(d0) + ease(wrap(yawOf(d) - yawOf(d0)), LOCK.yaw) - yaw)));
      tp = Math.max(-LOCK.pitch, Math.min(LOCK.pitch, pitchOf(d0) + ease(pitchOf(d) - pitchOf(d0), LOCK.pitch)));
    }
    const on = !!L.to, gs = on ? LOCK.gaze : LOCK.home, hs = on ? LOCK.head : LOCK.home, share = on ? LOCK.head.share : 1;
    for (let i = 0; i < 2; i++) { const t = i ? tp : ty; [L.g[i], L.gv[i]] = springTo(L.g[i], L.gv[i], t, gs, dt); [L.h[i], L.hv[i]] = springTo(L.h[i], L.hv[i], t * share, hs, dt); }   // his: her gaze and face follow his hand's point and his eye, which move at every sample: carried between two of his samples, dt at most 1 s
    const cause = (k, to, spec) => { const q = L[k + 'c'] && L[k + 'c'].to === to ? L[k + 'c'] : (L[k + 'c'] = { t0: c.now_ms, x: L[k], v: L[k + 'v'], to }); [L[k], L[k + 'v']] = springTo(q.x, q.v, to, spec, (c.now_ms - q.t0) / 1000); }; cause('f', on ? 1 : 0, LOCK.focus);   // a lookup: THE FIRE (Nov 16 2026), a spring at the time since its cause (its target's change), anchored there as embertide-scene workers.rs anchors its bodies
    L.touch = on && HB.handOn(L.to, bodyP, cam ? vec3(cam.C) : null);   // THE BREATH: his hand on her (the eye's ray through the point meets her body): her tiles open under it and hold, on a spring of this glass's own
    cause('o', L.touch ? 1 : 0, HB.BREATH.hand);
    if (!L.touch && Math.abs(L.o) < 1e-4 && Math.abs(L.ov) < 1e-4) { L.o = 0; L.ov = 0; }   // seated: exactly, also while his pointer rests on the glass beside her (her eye stays locked; her breath is at rest)
    L.rest = !on && Math.max(Math.abs(L.f), Math.abs(L.fv), Math.abs(L.o), Math.abs(L.ov), ...L.g.map(Math.abs), ...L.gv.map(Math.abs), ...L.h.map(Math.abs), ...L.hv.map(Math.abs)) < 1e-4;
    if (L.rest) { L.g = [0, 0]; L.gv = [0, 0]; L.h = [0, 0]; L.hv = [0, 0]; L.f = 0; L.fv = 0; L.o = 0; L.ov = 0; L.fc = L.oc = null; }   // home: exactly as born, no cause held
    if (!QL) return;
    QL.setFromEuler(EL.set(-L.h[1], L.h[0], 0, 'YXZ'));
    if (tiles && (QL.x !== TURNED[0] || QL.y !== TURNED[1] || QL.z !== TURNED[2] || QL.w !== TURNED[3])) { TURNED[0] = QL.x; TURNED[1] = QL.y; TURNED[2] = QL.z; TURNED[3] = QL.w; HB.shutOf(tiles, marks, TURNED, shut); }   // THE EYES' TILES STAY SHUT wherever her face turns: the marks turn with it (only while it turns)
    if (lens) { lens.position.copy(LENS_AT).applyQuaternion(QL); lens.quaternion.copy(QL); }
    if (irisMesh) {
      let ox = LOCK.iris.per * (L.g[0] - L.h[0]), oy = LOCK.iris.per * (L.g[1] - L.h[1]); const r = Math.hypot(ox, oy); if (r > LOCK.iris.max) { ox *= LOCK.iris.max / r; oy *= LOCK.iris.max / r; }
      irisMesh.position.set(ox * SC.K, oy * SC.K, IRIS_Z); irisMesh.scale.setScalar(1 - LOCK.focus.by * L.f);
    }
  }
  function sample(detail = {}) {
    if (!S.on) return null;
    if (Object.hasOwn(detail, 'fuel')) tank?.fill(detail.fuel);
    const c = clockFrom(detail);
    S.bob = detail?.bob ? SC.normalClock(detail.bob) : null;   // HER BOB ON THE SONG (well.mjs): the clock her height bobs on; else the dance clock, else the paint clock (bobAt)
    S.dance = detail?.dance ? SC.normalClock(detail.dance) : null;   // THE DANCE CLOCK (well.mjs): the clock that places her twelve and bobs her; it stops with the song. Her program keeps c
    const gap = samplesPerBeat > 0 ? c.beat_ms / samplesPerBeat : 0;
    if (gap && c.now_ms - S.lastSample_ms < gap && c.now_ms >= S.lastSample_ms) { counts.skipped++; chain(true); return null; }   // A11: the cap, per beat by the clock
    const t0 = typeof stopwatch === 'function' ? stopwatch() : 0;
    S.clock = c; S.lastSample_ms = c.now_ms; counts.samples++;
    const cam = detail.camera || call(() => twin?.camera?.()) || null; if (cam) S.cam = cam;
    const b = SC.beatsAt(c), bpb = c.beats_per_bar;
    S.goes = SC.pruneChain(S.goes, c, bpb); S.gazes = SC.pruneChain(S.gazes, c, 1); S.rises = SC.pruneChain(S.rises, c, bpb);
    if (S.hop && b >= S.hop.beat + S.hop.span) S.hop = null;   // landed: the chain stands where the hop ended
    // the lines: the rest line is read once a bar (a change lands on the downbeat); a cause's line takes its downbeat and holds until the homecoming or its own end
    if (c.bar !== S.barSeen) { S.barSeen = c.bar; S.restText = restText(); }
    while (S.lines.length && b >= S.lines[0].beat) S.said = S.lines.shift();
    if (S.said && num(S.said.until) && b >= S.said.until) S.said = null;
    if (S.restBeat != null && b >= S.restBeat) homecoming(S.restBeat, cam);
    const text = S.said ? S.said.text : S.restText; if (text !== S.line) { S.line = text; writeCaption(); }
    // A shared spatial entrance supplies the authoritative centres and turns;
    // this renderer keeps the existing eye, shell, ink and liquid materials.
    const shared = detail.sharedBalls?.length === 13 * 16 ? detail.sharedBalls : null;
    const bodyP = shared ? [shared[0], shared[1], shared[2]] : bodyAt(c);
    const yaw = shared ? 2 * Math.atan2(shared[5], shared[7]) : yawAt(c), tgts = targets(c, cam);
    S.pose = bodyP; S.yaw = yaw; S.base = baseAt(c);
    // HER FERROFLUID IN THE COUNCIL: the liquid's wakefulness from the song's word the paint hands (none: 0, and nothing below costs), on the clock her bob takes (bobAt's rule); THE FLUX, its pull on the twelve
    const air = (ferro || wantBreath) && !S.only ? songOn(detail?.song ?? null, c.now_ms) : 0; S.ferroOn = ferro ? air : 0;
    // HIS HAND IS THE SECOND MAGNET (lane hand-reach, Oct 14 2026): the glass that holds his hand (the Board: NestBoard.html twHandCause) hands the sample a cause { pole: from her centre
    // to his palm in HER ROOT'S axes (unit), field 0..1, pull 0..1 } (lib/hand-reach.mjs handCause's units); the pole is turned into her body's own axes (the liquid rides the body) and
    // her liquid takes it beside the song's magnet (mountFerro frame(c, on, hand)), her twelve its flux beside the song's (fluxOfHand, fluxSum). None: nothing below costs.
    const handC = ferro && !S.only && detail?.hand && bodyGroup && body ? (() => { const h = handOf(detail.hand); if (!h) return null; Q.copy(bodyGroup.quaternion).multiply(body.quaternion).invert(); V.set(h.pole[0], h.pole[1], h.pole[2]).applyQuaternion(Q); return { pole: [V.x, V.y, V.z], field: h.field, pull: h.pull }; })() : null;
    S.hand = handC ? handC.field : 0;
    // HER SPELL (lane the-two-hands-cast, Oct 24 2026): the cast the glass holds (detail.spell: spell-book.mjs castOf's { spell, at_ms }), its flux on her twelve for its beats by the house clock (lyssajudron-ferro.mjs fluxOfSpell), beside the song's and his hand's; over, nothing below costs
    // THE CAST IS ONE WAVE (lane the-board-takes-the-wave, Oct 25 2026; cast-wave.mjs): detail.wave is the held cast's wave from his palm to her as the host found it ({ flight_ms, pole:
    // towards his palm in HER ROOT'S axes }), its pole turned into her body's own axes as his hand's is; her twelve take the cast a flight after its instant, the side facing his palm
    // first (fluxOfCast). No wave: the cast as it was (fluxOfSpell's own, through fluxOfCast).
    const waveC = ferro && !S.only && detail?.spell && detail?.wave && bodyGroup && body ? (() => { const w = detail.wave; if (!Number.isFinite(w.flight_ms) || !Array.isArray(w.pole) || w.pole.length !== 3 || !w.pole.every(Number.isFinite)) return null; Q.copy(bodyGroup.quaternion).multiply(body.quaternion).invert(); V.set(w.pole[0], w.pole[1], w.pole[2]).applyQuaternion(Q); return { flight_ms: w.flight_ms, pole: [V.x, V.y, V.z] }; })() : null;
    const liquidClock = S.bob ?? S.dance ?? c, spellF = ferro && !S.only && detail?.spell ? fluxOfCast(detail.spell, liquidClock.now_ms, liquidClock.beat_ms || 600, S.dance ?? c, waveC) : null; S.spell = spellF ? { spell: spellF.spell, u: spellF.u == null ? null : Math.round(spellF.u * 100) / 100, flight_ms: waveC ? Math.round(waveC.flight_ms * 10) / 10 : null } : null;
    const flux = S.ferroOn > 0.002 || handC || spellF ? fluxSum(fluxSum(S.ferroOn > 0.002 ? fluxAt(liquidClock, S.ferroOn, S.dance ?? c) : null, handC ? fluxOfHand(handC, S.dance ?? c) : null), spellF) : null, fct = flux ? Math.cos(flux.turn) : 1, fst = flux ? Math.sin(flux.turn) : 0;
    tank?.frame(liquidClock.now_ms / 1000, Math.max(air, handC?.field ?? 0));
    S.flux = flux ? { turn: Math.round(flux.turn * 1000) / 1000, out: Math.round(Math.max(...flux.out) * 1000) / 1000 } : null;
    const world = new Array(SC.SEATS), orbit = new Array(SC.SEATS), reach = [0, 0, 0], traced = [false, false, false]; let carried = null;
    for (let seat = 0; seat < SC.SEATS; seat++) {
      let o = SC.satelliteAt(seat, S.dance ?? c); if (flux) { const g = 1 + flux.out[seat]; o = [(o[0] * fct + o[2] * fst) * g, o[1] * g, (-o[0] * fst + o[2] * fct) * g]; }   // on THE DANCE CLOCK: the twelve stand still while the song is. THE FLUX: flung out along its orbit vector and swept round her vertical (the band's own formula, lyssajudron-band.mjs frame)
      const ow = SC.worldOf(o, bodyP, yaw); orbit[seat] = ow; let p = ow;
      const e = EYES.indexOf(seat);
      if (e >= 0) { const t = tgts[e]; const g = !t ? 0 : seat === 2 ? SC.GAZE_MAX * 0.6 : seat === 0 && !S.him ? SC.GLANCE : SC.envelope(S.env[e], c); if (g > 0) p = SC.worldOf(SC.stalkAt(e, o, [0, 0, 0], localOf(t, bodyP, yaw), g), bodyP, yaw); reach[e] = g; }
      if (seat === HOLDER && S.walls.length) { const tr = SC.traceAt(S.walls, c, p); if (tr) { p = tr.position; traced[e] = true; } }   // the work eye traces the newest wall's rising edge and comes back, on its stalk
      world[seat] = p;
    }
    // FIXER (Oct 11): the scout. After his hand's hop the 'around' eye flies to the nearest tile the twin has not seen (fog-layer.mjs's 'scout') over a beat,
    // hovers over it bobbing on the beat, on its gold stalk from the body, and comes back over a beat when its errand ends: the dungeon master's companion
    // pointing into the fog. Like the carry, an errand off its wire: the score's paths are untouched.
    let scouting = 0; const sc = S.scout;
    if (sc && b >= sc.until + 1) S.scout = null;
    else if (sc && b >= sc.beat) {
      scouting = SC.at(sc.beat, c, 1) * (1 - SC.at(sc.until, c, 1));
      if (scouting > 0) { const hover = [sc.to[0], S.floor + HOP.scoutHover + 0.035 * Math.cos(2 * Math.PI * c.beat_phase), sc.to[2]]; reach[EYES.indexOf(SCOUT)] = SC.GAZE_MAX; void hover; /* L1 (the judge, Oct 11): the satellite never leaves its pinned 3:2 lane; the scout is its gaze, the eye-stalk reaching toward the tile */ }
    }
    if (S.carry) {
      const k = S.carry, hand = SC.handOf(bodyP, viewerP()); S.hand = hand;
      const f = k.flight && k.flight.origin && k.flight.grid ? FL.flightAt(k.flight, c.now_ms) : null;
      const r = SC.carryAt(k, c, orbit[k.satellite], hand, f);
      if (r && r.phase === 'done') { S.carry = null; S.carried = null; S.hand = null; if (carryQuad) carryQuad.visible = false; } else if (r) { carried = r; world[k.satellite] = r.position; }
    } else S.hand = null;
    // HER UNIT1 AWAY (Oct 13 2026 04:2x WEST; his "i want to see lyssajudron held inside of lysa, i want the unit1s to be able to become spatial trycua
    // agents"): a satellite a glass has placed (place()) stands k of the way from its wire to a point of this body's own frame. Like the carry and the
    // scout, an errand off its wire: the score's paths are untouched, and it is on its wire again the picture after place(seat, null).
    for (const key in S.placed) { const pl = S.placed[key], seat = +key, w0 = world[seat]; if (!pl || !pl.p || !w0 || (S.carry && S.carry.satellite === seat)) continue;
      world[seat] = pl.k >= 1 ? pl.p : [w0[0] + (pl.p[0] - w0[0]) * pl.k, w0[1] + (pl.p[1] - w0[1]) * pl.k, w0[2] + (pl.p[2] - w0[2]) * pl.k]; }
    if (shared) for (let seat = 0; seat < SC.SEATS; seat++) { const i = (seat + 1) * 16; world[seat] = [shared[i], shared[i + 1], shared[i + 2]]; orbit[seat] = world[seat]; }
    S.carried = carried; S.world = world;
    if (root) {
      bodyGroup.position.set(bodyP[0], bodyP[1], bodyP[2]); bodyGroup.rotation.y = yaw;
      bodyGroup.visible = !S.only; eyes.visible = !S.only;   // only(): a glass that draws her travelling unit1s draws nothing else of her (she is held in her home glass, which shows her)
      for (let lane = 0; lane < wires.length; lane++) { wires[lane].rotation.y = SC.wireYaw(lane, c) + (flux ? flux.turn : 0); wires[lane].scale.setScalar(flux ? 1 + RIDERS[lane].reduce((a, s) => a + flux.out[s], 0) / RIDERS[lane].length : 1); }   // THE FLUX: the wires turn with the twelve and each swells by its riders' mean fling (the well's band bends them through; no band here)
      wireMat.opacity = SC.wireBrightness(c);   // the downbeat's flash
      const tl = SC.thrusterLength(c), flash = SC.flashAt(c); thruster.visible = !S.low; thruster.scale.set(1, tl, 1); thruster.position.y = -(SC.K * 0.92 + tl / 2);
      core.visible = !S.low; core.scale.set(1, tl * 0.7, 1); core.position.y = -(SC.K * 0.92 + tl * 0.35);
      for (const e of EYES) {
        const l = stalks[e], p = world[e], off = len(sub(p, orbit[e])) > 0.01, on = off && !(S.carry && S.carry.satellite === e) && !S.only && !S.placed[e]; l.visible = on; if (!on) continue;
        const d = sub(p, bodyP), L = len(d), u = unit(d);
        l.position.set(bodyP[0] + u[0] * SC.K * 0.9, bodyP[1] + u[1] * SC.K * 0.9, bodyP[2] + u[2] * SC.K * 0.9); V2.set(u[0], u[1], u[2]); l.quaternion.setFromUnitVectors(Y, V2); l.scale.set(1, Math.max(0.01, L - SC.K * 0.9 - SC.R_SAT * 0.8), 1);
        l.material.opacity = 0.35 + 0.65 * Math.max(traced[e] ? 1 : 0, Math.min(1, reach[e] / SC.GAZE_MAX));
      }
      glow.visible = !S.low; glow.position.y = -SC.K * 0.95; glow.material.opacity = 0.45 + 0.45 * (1 - c.beat_phase) ** 2 + 0.1 * flash;
      if (flare) { const fs = 0.42 + 0.34 * flash + 0.08 * (1 - c.beat_phase) ** 2; flare.visible = !S.low; flare.scale.set(fs, fs * 1.2, 1); flare.position.y = -(SC.K * 0.92 + tl * 0.7); flare.material.opacity = 0.6 + 0.38 * flash; }   // the thruster's light swells on the one
      pool.position.set(bodyP[0], S.base + 0.012, bodyP[2]); pool.material.opacity = 0.08 + 0.22 * (1 - c.beat_phase) ** 2 + 0.1 * flash;
      const bars = SC.barsAt(c), tq = detail.turns;
      // THE LIGHT GAME and the eyes' spring (his Oct 12 07:5x): the tide on the house clock, her inner light her glow's towards white; the eyes breathe
      // out from her on every beat and stretch on the downbeat (a damped spring), and the seams cast on them follow wherever they go
      lyLight.time.value = ((c.now_ms % 3_600_000) / 1000) * 0.6; lyLight.tide.value = tideAt(bars); lyLight.color.value.copy(glow.material.color).lerp(lyWhite, 0.35);
      const spring = Math.exp(-5 * c.beat_phase) * Math.cos(11 * c.beat_phase), down = c.beat % bpb === 0 ? 1 : 0.45;
      lockFace(c, bodyP, yaw, cam || S.cam);   // THE EYE LOCKS ON: her face turned about her centre to the point a hand holds (as born while none does)
      for (const e of faceEyes) { e.quaternion.copy(QL); e.scale.set(1 + 0.05 * down * spring, 1 + 0.02 * spring, 1 + 0.03 * spring); e.updateMatrix(); }
      if (faceEyes[0]) eyeMat.userData.eyeLocal.copy(faceEyes[0].matrix);
      const herFace = HF.faceAt(c, S.form, Math.max(scouting, S.carry ? 1 : 0)); S.brock = herFace.acting;   // HER FACE (her-face.js faceAt, the Board's twDraw sets the same): Brock's acting, and once in sixteen bars the ghost in her opens her eyes; with a form (THE GAZE ON HER) they stand open in it, Brock's blinks still in them
      lyLight.ghost.value = herFace.ghost; eyeMat.userData.brock.set(herFace.brock[0], herFace.brock[1], herFace.brock[2], herFace.brock[3]);
      for (let seat = 0; seat < SC.SEATS; seat++) {
        const p = world[seat]; V.set(p[0], p[1], p[2]);
        const e = EYES.indexOf(seat), t = seat === SCOUT && scouting > 0.5 && cam ? [...cam.C] : e >= 0 ? tgts[e] : null;   // the scout looks back at him over the tile
        if (t) { const d = unit(sub(t, p)); V2.set(d[0], d[1], d[2]); Q.setFromUnitVectors(Z, V2); if (tq) Q.premultiply(QT.fromArray(tq, seat * 4)); } else if (tq) Q.fromArray(tq, seat * 4); else if (tq === null) Q.identity(); else Q.setFromAxisAngle(Y, (bars * Math.PI * 2) / 12 + seat * 0.5);   // HER TWELVE TURN BY ONE LAW (Nov 5 2026): detail.turns, the module's turn a seat (x, y, z, w in this root's axes: embertide-scene band.rs, its ball's in the frame), on an eye's gaze; null: none of her own (a band's aLySpin turns it: the well); unsaid, a page outside the room: her slow yaw as it was
        const pl1 = S.placed[seat], s1 = S.only && !S.only.has(seat) ? 0 : !pl1 ? 1 : pl1.gone ? 0 : 1 + (pl1.s - 1) * pl1.k;   // HER UNIT1 AWAY: a placed satellite's own size (0: its chair is empty); a glass that draws only some of the twelve draws no other
        if (shared) { const i = (seat + 1) * 16; Q.set(shared[i + 4], shared[i + 5], shared[i + 6], shared[i + 7]); }
        M4.compose(V, Q, shared ? SCP.setScalar(shared[(seat + 1) * 16 + 3] / SC.R_SAT) : s1 === 1 ? SCL : SCP.setScalar(s1)); sats.setMatrixAt(seat, M4);
        if (e >= 0) {
          const d = t ? unit(sub(t, p)) : cam ? unit(sub(cam.C, p)) : [0, 0, 1];
          V.set(p[0] + d[0] * SC.R_SAT * 0.99, p[1] + d[1] * SC.R_SAT * 0.99, p[2] + d[2] * SC.R_SAT * 0.99);
          V2.set(d[0], d[1], d[2]); Q.setFromUnitVectors(Z, V2); M4.compose(V, Q, SCL); eyes.setMatrixAt(e, M4);
        }
      }
      sats.instanceMatrix.needsUpdate = true; eyes.instanceMatrix.needsUpdate = true;
      if (ferro) ferro.frame(liquidClock, S.ferroOn, handC);   // HER FERROFLUID IN THE COUNCIL: shaped for this instant on the clock her bob takes, as the well shapes its own (hidden while no song plays and no hand reaches: songOn 0, no cause); HIS HAND its second magnet
      // THE BREATH, by herself (a glass with no ear: the twin): her body's tiles on the song's wakefulness and THE TWELVE PLAY's plan of hits on the clock her liquid takes (pure: every glass alike); a glass with the ear says breathe() itself (breath: false)
      const own = wantBreath ? breathe({ on: air, song: detail?.song ?? null, open: air > 0.002 ? openAt(liquidClock, air, hitsAt(liquidClock, null, S.dance ?? c)) : null, breath: detail?.breath ?? null }) : null;
      if (council) council.frame(S.dance ?? c, { tail: COUNCIL_TAIL, lift: own ? own.unit1 : null });   // THE COUNCIL AS THE BOARD'S SKIN: each child's twelve round where it stands this sample, at its size, on the clock the twelve dance on
      floor.position.set(S.home[0], S.floor + 0.004, S.home[2]); rim.position.set(S.home[0], S.floor + 0.006, S.home[2]);
      const face = (q, p, lift = 0) => { q.position.set(p[0], p[1] + lift, p[2]); if (cam) q.lookAt(cam.C[0], cam.C[1], cam.C[2]); };
      codeQuad.visible = !!(S.pairing.open && S.pairing.code && S.hovered);   // FIXER (L5): the join code is a place-card on his hover, never ink on the empty table's first frame
      if (codeQuad.visible) face(codeQuad, cardSpot(bodyP, cam, placedGlasses()));   // beside the figure, never over a glass
      const inside = !!(S.dive?.on && S.dive.who === 'lyssajudron' && c.now_ms >= S.dive.at_ms + S.dive.ms * 0.6); if (root.visible === inside) root.visible = !inside;   // FIXER: the eye inside it (the micro tier): it steps out of its own view
      if (holdQuad.visible) face(holdQuad, world[HOLDER], 0.12);
      if (carryQuad.visible && carried) { const g = (1 + 4 * (num(carried.k) ? carried.k : 0)) * cardHeight(); carryQuad.scale.set(g, g, 1); face(carryQuad, carried.position, g / 2 + SC.R_SAT); } else if (carryQuad.visible && !carried) carryQuad.visible = false;
      S.draws = 16 + stalks.filter((l) => l.visible).length + (codeQuad.visible ? 1 : 0) + (holdQuad.visible ? 1 : 0) + (carryQuad.visible ? 1 : 0) + (ferro?.mesh.visible ? 1 : 0) + (tank?.state().draws ?? 0);
    }
    if (cap && root && !root.visible) moveCaption(0, 0, false);
    else if (cap && cam && typeof cam.project === 'function') {   // at its feet: under the near rim of its base on the table (minis-layer.mjs's flight stand, FOOT_R), never over the rod and the base
      const C = vec3(cam.C), dx = C ? C[0] - bodyP[0] : 0, dz = C ? C[2] - bodyP[2] : 1, dl = Math.hypot(dx, dz) || 1;
      const f = cam.project([bodyP[0] + (dx / dl) * FOOT_R, S.base, bodyP[2] + (dz / dl) * FOOT_R]); if (f) moveCaption(f[0], f[1] + 10); else moveCaption(0, 0, false);
    }
    if (typeof stopwatch === 'function') { const ms = stopwatch() - t0, w = S.work_; if (w.beat !== c.beat) { if (w.beat != null) w.last = { beat: w.beat, jsMsPerBeat: Math.round(w.ms * 1000) / 1000, samplesPerBeat: w.n }; w.beat = c.beat; w.ms = 0; w.n = 0; } w.ms += ms; w.n++; }
    if (S.low !== relief()) { S.low = !S.low; if (root) makeWires(S.low ? SC.WIRE_SEGMENTS_LOW : SC.WIRE_SEGMENTS); }
    chain(true);
    return { beat: c.beat, bar: c.bar, pose: bodyP, yaw, satellites: world, carried, targets: tgts, line: S.line };
  }
  /** heldOf() -> how many of her twelve hold a glass (THE HOLD: place(seat, p, {k, open}) with a point and not gone, by the hold's weight: place's open,
   *  which is its k unless the glass that placed it said less, A PIN IS NOT A HOLD), and HELD[s] = that weight a seat (0 on its wire, 0 for a pin): one
   *  rule, read by her breath (breathe) and handed to the band (held() in the api: THE HELD CORE, lyssajudron-band.mjs). */
  function heldOf() { let n = 0; for (let s = 0; s < SC.SEATS; s++) { const pl = S.placed[s], k = pl && pl.p && !pl.gone ? (pl.open ?? pl.k) : 0; HELD[s] = k; if (k > 0) n++; } return n; }
  /** breathe({on, levels, open, song, breath}) -> {unit0, unit1} | null: THE BREATH (her-breath.mjs), once a picture, after the band where one plays. on: the song's
   *  wakefulness (songOn, 0..1); levels: the ear's twelve band levels now, or null; open: how open THE TWELVE PLAY stands each of her twelve (per seat; the
   *  band's own array, read never written), or null; song: the air's word, for the state's name. What it writes: unit0's 32 lifts into her shader's one
   *  uniform (pentagon i its band's, a hexagon its three pentagons' mean, her face's tiles 0; all of them open under his hand); and aLyOpen of each of
   *  her twelve that holds a glass (THE HOLD: open by place's open, which is its k unless the glass that placed it said less: A PIN IS NOT A HOLD) over what
   *  the band wrote there, nothing of the others'; breath (THE UNIT1 BREATHES, Nov 4 2026: the scene's breath32, each one's plates' ride out in its radius, the overlays' own) opens every one of the twelve, held or not.
   *  Returns the two arrays (hers to keep: the same each call), unit1 the lift a council scales its dots by. Nothing at rest: with no song, no hand
   *  and no unit1 out it returns before any of it. */
  function breathe({ on = 0, levels = null, open = null, song = null, breath = null } = {}) {
    if (!tiles || !lyLight || !openAttr) return null;
    const B = S.breath, w = HB.clamp01(on), hand = HB.clamp01(S.lock.o), U = lyLight.lift.value, held = heldOf();
    B.on = w; B.song = song; BREATHED.unit0 = U;
    if (!(w > 0) && !(hand > 0) && !held && B.rest && !breath) return BREATHED;   // nothing at rest costs anything
    const arr = openAttr.array; let dirty = false, peak = 0;
    for (let s = 0; s < SC.SEATS; s++) {   // her twelve: the band's open stands as it wrote it; a unit1 that holds a glass stands open by its hold's weight (place's open; a pin with open 0 stands shut)
      const k = HELD[s], base = breath ? breath[s] / SAT_OPEN : open ? open[s] : 0;   // THE UNIT1 BREATHES: the scene's ride out as this shader's lift (SAT_OPEN of its radius at 1)
      if (k > 0 && !breath) { const v = Math.fround(HB.openOver(base, k)); if (arr[s] !== v) { arr[s] = v; dirty = true; } WROTE[s] = 1; }
      else if (WROTE[s] || breath) { WROTE[s] = breath ? 1 : 0; const v = Math.fround(base); if (arr[s] !== v) { arr[s] = v; dirty = true; } }   // home again: what the band plays, or shut; breathing: the scene's breath, held or not
      LIFT1[s] = Math.max(0, arr[s]);
    }
    if (dirty) openAttr.needsUpdate = true;
    if (w > 0 || hand > 0) { HB.liftsOf(tiles, HB.bandsOf(PENT, { on: w, levels, open, hand }), shut, U); for (let i = 0; i < U.length; i++) if (U[i] > peak) peak = U[i]; }
    else U.fill(0);
    B.peak = peak; B.held = held; B.rest = !(w > 0) && !(hand > 0) && !held && !breath;
    return BREATHED;
  }
  function relief() { const w = typeof twin?.work === 'function' ? call(() => twin.work()) : null; return !!(w && num(w.paintMsPerBeat) && w.paintMsPerBeat > LOW_SHARE * S.clock.beat_ms); }
  /** homecoming(beat, cam): the phrase is over: on this downbeat the body goes home over one bar, turns to him, the disc moves to the home, and the
   *  caption returns to the rest line. The guesses are not said: the twin's status line is the one line for them (his rule). */
  function homecoming(beat, cam) {
    S.restBeat = null; S.restAt = beat; counts.causes++;
    const home = homeOf(); S.home = home;
    note(S.goes, [home[0], S.floor, home[2]], beat); note(S.rises, riseOf(home), beat);   // THE ANCHOR: home on a held thing, its stand goes up onto it
    const him = S.him || (cam ? [...cam.C] : null), yaw = him ? SC.yawToward(home, him) : null; if (yaw != null) note(S.gazes, yaw, beat);
    S.said = null;
  }

  // ---- the causes: each placed on the grid as a note the moment it is heard ----
  const stamp = (d) => (num(d?.at_ms) ? d.at_ms : num(d?.ts) ? d.ts : nowClock().now_ms);
  const nextDownbeat = (ms) => SC.downbeatOf(ms, nowClock());
  /** noteCause(beat): a note of the phrase: the homecoming moves to the first downbeat a bar after it. */
  const noteCause = (beat) => { if (!num(beat)) return; S.lastNote = Math.max(S.lastNote, beat); S.restBeat = SC.homeBeatOf(S.lastNote, nowClock().beats_per_bar); };
  function sayOn(text, ms, { until = null, kind = 'cause' } = {}) {   // a line on the next downbeat; a newer cause's line replaces a pending one (latest wins)
    const beat = nextDownbeat(ms); S.lines = S.lines.filter((l) => l.beat < beat); S.lines.push({ text: SC.clipLine(text), beat, until, kind }); S.lines.sort((a, b) => a.beat - b.beat); counts.causes++; return beat;
  }
  function aim(target, ms, who = 'work') {   // the body yaw turns to the work, and to him when there is no work (A8): from the next beat after the cause
    const c = nowClock(), beat = SC.beatOf(ms, c), yaw = SC.yawToward(bodyAt(SC.clockOf(c, SC.beatTime(beat, c))), target); if (yaw == null) return;
    if (who === 'him' && S.work && !S.hovered) return;   // FIXER: pointed at, it turns to him whatever its work (Curie looking back)
    note(S.gazes, yaw, beat);
  }
  function lookAt(target, ms = nowClock().now_ms, who = 'work') {
    const p = targetOf(target, twin); const c = nowClock(), beat = SC.beatOf(ms, c); counts.causes++;
    if (who === 'him') { S.him = p; S.env[0] = p ? { since: beat, until: null } : S.env[0] && { ...S.env[0], until: beat }; }
    else { S.work = p; S.env[1] = p ? { since: beat, until: null } : S.env[1] && { ...S.env[1], until: beat }; }
    if (p) aim(p, ms, who);
    return beat;
  }
  function goTo(pos, ms = nowClock().now_ms) {
    const p = targetOf(pos, twin); if (!p) return null;
    const beat = nextDownbeat(ms);
    note(S.goes, [p[0], S.floor, p[2]], beat); note(S.rises, riseOf(p), beat); counts.causes++; noteCause(beat);
    return beat;
  }
  function planCarry(seat, to, ms) {   // the carrier leaves its wire on the beat the cause is heard, is on the hand by the downbeat; the card's point on the hand is the origin
    const m = cardHeight(); if (!(m > 0)) return null;   // no module: no card is carried
    const c = nowClock(), beat = nextDownbeat(ms), heard = SC.beatOf(ms, c), cb = SC.clockOf(c, SC.beatTime(beat, c)), bodyP = bodyAt(cb);
    const hand = SC.handOf(bodyP, viewerP()), card = SC.cardOnHand(hand, m);
    S.carry = { seat: typeof seat === 'string' ? seat : null, satellite: CARRIER, origin: card, hand, to: to || card, beat, heard, landed: false, landed_beat: null, landedAt: null, flight: null, image: false };
    sayOn(SC.showLine(nameOf(S.carry.seat)), ms); if (to) lookAt(to, ms, 'work'); noteCause(beat + c.beats_per_bar);
    return { beat, origin: { position: card, satellite: CARRIER } };
  }
  function carry(seat, image = null, ms = nowClock().now_ms) {
    const to = targetOf(seat, twin); if (!to) return null;
    const r = planCarry(seat, to, ms); if (!r) return null; S.carry.image = !!image;
    if (carryQuad) { imageQuad(carryQuad, image); carryQuad.visible = true; }
    return { beat: r.beat, origin: r.origin.position };
  }
  function remember() { if (S.step !== 'old') return false; counts.causes++; twin?.remember?.(); const beat = sayOn(SC.LINES.remembering, nowClock().now_ms); noteCause(beat); return true; }

  on('paint', (d) => { sample(d); });
  on('cursor', (d) => {
    S.cursorFromTwin = true; if (S.hovered) return;   // FIXER: pointed at, it looks at HIM, never at the floor behind itself where the pointer's ray lands
    const ms = stamp(d);
    const hit = hitOf(d) || (num(d?.x) && num(d?.y) ? floorHit(call(() => twin?.camera?.()), d.x, d.y, S.floor) : null);
    lookAt(hit, ms, 'him');
  });
  const onPointer = (e) => {   // until the twin's own 'cursor' arrives: the hit read here, at the last sampled clock's ms (A5: never event.timeStamp)
    if (S.cursorFromTwin || !twin?.host) return;
    const r = twin.host.getBoundingClientRect?.() || { left: 0, top: 0 }; const x = e.clientX - r.left, y = e.clientY - r.top;
    lookAt(floorHit(call(() => twin?.camera?.()), x, y, S.floor), nowClock().now_ms, 'him');
  };
  twin?.host?.addEventListener?.('pointermove', onPointer);
  on('glass', (d) => {
    if (!d?.seat) return; const ms = stamp(d), pose = d.pose && vec3(d.pose.position) ? { ...d.pose } : null;
    const g = S.glasses.find((x) => x.seat === d.seat) || (S.glasses.push({ seat: d.seat, pose: null, lit: false }), S.glasses[S.glasses.length - 1]);
    if (pose) g.pose = pose;
    if (d.what === 'lit' || d.what === 'online') g.lit = true; if (d.what === 'offline') g.lit = false;
    if (d.what === 'placed' && pose) { if (S.held?.seat === d.seat) { S.held = null; holdQuad && (holdQuad.visible = false); } lookAt(pose.position, SC.beatTime(nextDownbeat(ms), nowClock()) - 1, 'work'); noteCause(sayOn(SC.LINES.join, ms)); }
    else if (!g.pose && !S.held && d.what !== 'offline' && !S.walls.length) { S.held = { seat: d.seat }; if (holdQuad) { mirrorQuad(holdQuad); holdQuad.visible = true; } noteCause(sayOn(SC.LINES.hold, ms)); }
    else if (!g.pose && d.what === 'online' && S.walls.length && !S.placeSaid.has(d.seat)) { S.placeSaid.add(d.seat); const c = nowClock(), after = SC.beatTime(Math.max(...S.walls.map((w) => w.beat)) + c.beats_per_bar, c); noteCause(sayOn(TABLE_LINES.place, Math.max(ms, after))); }   // said once the walls stand (the wall's own line first)   // FIXER: walls stand, so it never 'holds it till it knows your walls': the glass waits by the door to be hung
  });
  on('glasses', (list) => { if (Array.isArray(list)) for (const g of list) { const mine = S.glasses.find((x) => x.seat === g.seat); const pose = g.pose && vec3(g.pose.position) ? { ...g.pose } : null; if (mine) { if (pose) mine.pose = pose; mine.lit = !!g.lit; } else S.glasses.push({ seat: g.seat, pose, lit: !!g.lit }); } });
  on('scan', (d) => {
    const phase = typeof d?.phase === 'string' ? d.phase : 'nothing'; S.step = phase; S.dial = d?.dial ?? S.dial; if (num(d?.guesses)) S.guessesTold = d.guesses; const ms = stamp(d); counts.causes++;
    if (phase === 'nothing') {   // no room stands: the home is the disc again, but for the golem the Nest holds (THE ANCHOR: it stays where every glass reads it), its stand off any thing
      S.walls = []; S.things = []; if (S.pinnedBy !== 'nest') { S.pinned = null; S.pinnedBy = null; }
      if (S.riseStart || S.rises.length) note(S.rises, 0, SC.beatOf(ms, nowClock()) + 1);
    }
    if (phase === 'live') { const ghost = (call(() => twin?.glasses?.()) || []).find((g) => g.ghost && !g.pose); if (ghost) lookAt(ghost.ghost, ms, 'work'); }
  });
  on('guesses', (d) => { const n = num(d?.n) ? d.n : num(d?.guesses) ? d.guesses : num(d?.count) ? d.count : num(d) ? d : null; if (n != null) S.guessesTold = n; });   // TWIN's 'guesses' {n, text, scan}, once per compile: the count, kept for state(); never said (the twin's status line is the one line)
  on('wall', (d) => {
    const a = vec3(d?.a), b = vec3(d?.b); if (!a || !b || d.scored === false) return; const h = num(d?.h) ? d.h : 2.4, c = nowClock();   // a guess stays off the paint: no step, no trace, not counted (his Oct 11 01:4x word)
    const nt = SC.noteOf({ kind: 'wall', beat: d.beat, at_ms: stamp(d) }, c);
    const top = [[a[0], a[1] + h, a[2]], [b[0], b[1] + h, b[2]]], mid = mix(a, b, 0.5);
    if (d.id != null && S.walls.some((w) => w.id === d.id)) return;   // told twice (tellStanding): one note
    S.walls.push({ id: d.id ?? null, a, b, h, beat: nt.beat, top }); S.walls.sort((x, y) => x.beat - y.beat); S.floor = Math.min(S.floor, a[1]);
    if (d.reveal) { noteCause(nt.beat); counts.causes++; return; }   // THE REVEAL (reveal-plan.mjs): the wall clicks where the looking made it certain; it stays home and looks (its eyes on 'gaze'), never walks to it
    const toward = unit(sub([S.home[0], a[1], S.home[2]], mid)), stand = add(mid, toward, STAND_M);   // a step back from the wall, toward where it stood
    const start = nt.beat;   // it moves to the wall as the wall rises (one bar), the next wall re-aims it from where it is; a beat already past is at rest (A12)
    note(S.goes, [stand[0], S.floor, stand[2]], start); note(S.rises, riseOf(stand), start); note(S.gazes, SC.yawToward(stand, mid) ?? 0, start);
    const bar0 = Math.floor(nt.beat / c.beats_per_bar) * c.beats_per_bar;   // the downbeat of the bar the first wall rises in
    if (!S.lines.some((l) => l.text === SC.LINES.wall) && S.line !== SC.LINES.wall) { S.lines = S.lines.filter((l) => l.beat < bar0); S.lines.push({ text: SC.LINES.wall, beat: bar0, until: null, kind: 'cause' }); S.lines.sort((x, y) => x.beat - y.beat); }
    if (S.held) S.held.walkBeat = nt.beat + c.beats_per_bar;
    noteCause(nt.beat); counts.causes++;
  });
  on('thing', (d) => {
    const box = d?.box; const p = vec3(box?.center) || (vec3(box?.min) && vec3(box?.max) ? mix(box.min, box.max, 0.5) : null); if (!p || d.scored === false) return;
    if (d.id != null && S.things.some((t) => t.id === d.id)) return;
    const c = nowClock(), nt = SC.noteOf({ kind: 'thing', beat: d.beat, at_ms: stamp(d) }, c);
    if (d.reveal) { S.things.push({ id: d.id ?? null, at: p, beat: nt.beat }); noteCause(nt.beat); counts.causes++; return; }   // THE REVEAL: its eyes are the looking's
    S.things.push({ id: d.id ?? null, at: p, beat: nt.beat }); S.work = p; S.env[1] = { since: nt.beat, until: nt.beat + c.beats_per_bar }; noteCause(nt.beat); counts.causes++;
  });
  on('gaze', (d) => {   // THE REVEAL (splat-layer.mjs): the work eye's stalk reaches to where the looking looks on this beat (the satellite keeps its lane, L1); the body does not turn per look; to: null lets go
    const c = nowClock(), beat = num(d?.beat) ? d.beat : SC.beatOf(stamp(d), c), to = vec3(d?.to);
    if (to) { if (!S.work || !S.env[1] || S.env[1].until != null) S.env[1] = { since: beat, until: null }; S.work = to; } else if (S.work) { S.env[1] = S.env[1] && { ...S.env[1], until: beat }; S.work = null; }   // the stalk reaches out once and swings from look to look
  });
  on('say', (d) => {   // a layer's one line for it to say (fog-layer.mjs: what it has seen of the floor): on the next downbeat, held `bars` bars (1 to 4), the homecoming after it
    const text = typeof d?.text === 'string' ? d.text.trim() : ''; if (!text) return; const ms = stamp(d), c = nowClock(), bars = num(d?.bars) ? Math.max(1, Math.min(4, Math.round(d.bars))) : 1;
    const beat = sayOn(text, ms, { until: SC.downbeatOf(ms, c) + bars * c.beats_per_bar }); noteCause(beat + (bars - 1) * c.beats_per_bar); });
  on('pairing', (d) => { S.pairing = { open: !!d?.open, code: typeof d?.code === 'string' ? d.code.trim().slice(0, 40) : '' }; if (codeQuad) { if (S.pairing.open && S.pairing.code) textQuad(codeQuad, [S.pairing.code], { head: 'join me with' }); codeQuad.visible = !!(S.pairing.open && S.pairing.code && S.hovered); } counts.causes++; });   // FIXER (L5): a parchment place-card, shown while he points at it
  on('mini-hover', (d) => {   // FIXER: his pointer on it (minis-layer.mjs): the body and its lens turn to him from the next beat (Curie looking back); the join code's card stands while pointed at
    const was = S.hovered; S.hovered = !!d?.on && (!d.who || d.who === 'lyssajudron'); if (S.hovered === was) return;
    if (S.hovered && S.cam) lookAt([...S.cam.C], stamp(d), 'him');
    if (codeQuad) codeQuad.visible = !!(S.pairing.open && S.pairing.code && S.hovered);
  });
  on('dive', (d) => { S.dive = d && d.who ? { who: d.who, on: !!d.on, at_ms: num(d.at_ms) ? d.at_ms : nowClock().now_ms, ms: num(d.ms) ? d.ms : 0 } : null; });   // FIXER: the eye goes into a mini (twin.mjs, the micro tier)
  on('scout', (d) => {   // FIXER: fog-layer.mjs names the nearest tile it has not seen after his hand's hop: the eye's errand from the landing beat, and the line
    const to = vec3(d?.to); if (!to || !num(d?.beat)) return; const c = nowClock(), until = d.beat + HOP.scoutBars * c.beats_per_bar;
    const yawTo = SC.yawToward(bodyAt(SC.clockOf(c, SC.beatTime(d.beat, c))), to); if (yawTo != null) note(S.gazes, yawTo, d.beat);   // its lens turns to the corner
    S.scout = { to, beat: d.beat, until }; S.lines = S.lines.filter((l) => l.beat < d.beat); S.lines.push({ text: SC.clipLine(typeof d.text === 'string' && d.text ? d.text : TABLE_LINES.scout), beat: d.beat, until, kind: 'cause' }); S.lines.sort((a, b) => a.beat - b.beat);
    noteCause(until); counts.causes++;
  });
  on('flight-plan', (d) => {   // answered synchronously: the twin reads origin back from this same object
    if (!d || typeof d !== 'object') return; const ms = stamp(d), to = vec3(d.to?.position) || vec3(d.to);
    const r = planCarry(d.seat ?? null, to, ms); if (r) d.origin = r.origin; counts.causes++;
  });
  on('flight-start', (d) => {
    const f = d?.flight; if (!f) return; const c = nowClock(), ts = num(f.ts) ? f.ts : stamp(d), beat = SC.downbeatOf(ts, c), same = S.carry && (!d.seat || !S.carry.seat || d.seat === S.carry.seat);
    const to = vec3(f.to?.position) || (same ? S.carry.to : null);
    if (!same && !planCarry(d.seat ?? null, to, ts)) return;   // a flight nobody planned here: the hand is made now (none without the module)
    const origin = vec3(f.origin?.position) || S.carry.origin;
    S.carry = { ...S.carry, seat: d.seat ?? S.carry.seat, satellite: num(f.origin?.satellite) ? f.origin.satellite : CARRIER, origin, to: to || S.carry.to, beat: same ? S.carry.beat : beat, landed: false, landed_beat: null, landedAt: null, flight: f, image: false };
    counts.causes++;
  });
  on('flight-landed', (d) => {
    if (!S.carry || (d?.seat && S.carry.seat && d.seat !== S.carry.seat)) return; const c = nowClock();
    S.carry.landed = true; S.carry.landed_beat = num(d?.landed_beat) ? d.landed_beat : Math.max(S.carry.beat + c.beats_per_bar, SC.downbeatOf(c.now_ms, c)); S.carry.landedAt = S.carried?.position ? [...S.carried.position] : null;
    const seat = d?.seat ?? S.carry.seat; S.showing = seat ? { seat, name: nameOf(seat) } : { seat: null, name: null };
    noteCause(S.carry.landed_beat); counts.causes++;
  });
  on('flight-cleared', (d) => { if (S.showing && (!d?.seat || !S.showing.seat || d.seat === S.showing.seat)) { S.showing = null; noteCause(nextDownbeat(nowClock().now_ms)); } if (!S.carry || (d?.seat && S.carry.seat && d.seat !== S.carry.seat)) return; S.carry = null; S.carried = null; carryQuad && (carryQuad.visible = false); counts.causes++; });

  /** hopTo(p, fly, span): the hop a hand asked for (his here, on 'mini-go'; any glass's, through the golem on the Nest): from where it stands on the fly
   *  beat to p over `span` beats, an arc, its stand onto the thing there or off the one it left; it stays there. */
  function hopTo(p, fly, span) {
    const c = nowClock(), cf = SC.clockOf(c, SC.beatTime(fly, c)), at = bodyAt(cf), r0 = liftAt(cf).rise, r1 = riseOf(p);   // where it stands on the hop's beat (a hop still in flight hands over its own point)
    S.pinned = [p[0], S.floor, p[2]]; S.home = [...S.pinned];
    S.hop = { from: [at[0], S.floor, at[2]], to: [p[0], S.floor, p[2]], beat: fly, span, arc: HOP.arc, riseFrom: r0, riseTo: r1 };
    S.goes = []; S.chainStart = [p[0], S.floor, p[2]]; S.rises = []; S.riseStart = r1;   // the go chain re-anchored where the hop ends: a later go starts from there
    const yawTo = SC.yawToward(at, p); if (yawTo != null) note(S.gazes, yawTo, fly);   // it turns into its hop
    const land = fly + span; noteCause(land);
    S.lines = S.lines.filter((l) => l.beat < fly); S.lines.push({ text: SC.clipLine(TABLE_LINES.stay), beat: fly, until: land + c.beats_per_bar, kind: 'cause' }); counts.causes++;
  }
  on('mini-go', (d) => {   // his hand set the mini down on a square or on a held thing (minis-layer.mjs, which asks the owner's door to write it). FIXER (Oct 11): it hops there from the beat after the click over HOP.beats beats (the ads' three seconds; never a whole bar from the next downbeat), and stays
    const p = targetOf(d?.to); if (!p || (d?.who && d.who !== 'lyssajudron')) return; const ms = stamp(d), c = nowClock();
    const fly = num(d?.fly_ms) ? Math.round((d.fly_ms - c.epoch_ms) / c.beat_ms) : SC.beatOf(ms, c) + 1, span = num(d?.fly_ms) && num(d?.land_ms) ? Math.max(1, Math.round((d.land_ms - d.fly_ms) / c.beat_ms)) : HOP.beats;
    hopTo(p, fly, span); S.pinnedBy = 'hand'; S.handRev = num(S.anchor?.rev) ? S.anchor.rev : -1;   // a read of the golem older than this hand's write never undoes it
  });
  /** adopt(g, first): THE ANCHOR. The golem the Nest holds (twin.golem(): {position, rev, anchor, hop}) is its home on every glass. Read at mount it stands
   *  there (a cause already past is at rest, A12); moved by a hand on any glass it hops there on that hand's beats (they ride in the entity); a read older
   *  than his own hand's write here is not taken. Gone from the Nest, the home is the walls' again. */
  function adopt(g, first = false) {
    if (!g) { if (S.pinnedBy === 'nest') { S.pinned = null; S.pinnedBy = null; } S.anchor = null; return; }
    const p = vec3(g.position); if (!p) return;
    if (S.pinnedBy === 'hand' && num(S.handRev) && num(g.rev) && g.rev <= S.handRev) return;
    const same = S.pinned && Math.hypot(S.pinned[0] - p[0], S.pinned[2] - p[2]) < 0.01, seen = !!S.anchor;
    S.anchor = { name: g.name ?? null, rev: num(g.rev) ? g.rev : null, position: [...p], anchor: g.anchor ?? null }; S.pinnedBy = 'nest'; counts.causes++;
    if (same) return;
    const c = nowClock(), h = g.hop, live = num(h?.fly_ms) && num(h?.land_ms) && h.land_ms >= c.now_ms - c.bar_ms;   // a hop that landed more than a bar ago is a cause already past
    if (first || (!seen && !live) || (h && !live)) {   // at rest there: what moved before this glass looked is where it stands (the notes still ahead stay)
      const b = SC.beatsAt(c); S.goes = S.goes.filter((n) => n.beat > b); S.rises = S.rises.filter((n) => n.beat > b); S.hop = null;
      S.pinned = [p[0], S.floor, p[2]]; S.home = [...S.pinned]; S.start = [p[0], 0, p[2]]; S.chainStart = [p[0], S.floor, p[2]]; S.riseStart = riseOf(p); return;
    }
    const fly = live ? Math.round((h.fly_ms - c.epoch_ms) / c.beat_ms) : SC.beatOf(c.now_ms, c) + 1, span = live ? Math.max(1, Math.round((h.land_ms - h.fly_ms) / c.beat_ms)) : HOP.beats;
    hopTo(p, fly, span);
  }
  adopt(call(() => twin?.golem?.()) ?? null, true);
  on('scene', () => adopt(call(() => twin?.golem?.()) ?? null));   // the twin re-read /nest/scene (a scene ref rang): the golem as it stands now

  // HER PAINT: a colour written into her own materials, nothing rebuilt, no draw added (nothing at rest). born: her colours as built, kept to come back to.
  let born = null, marked = null, bornLight = null, lightColor = null; const painted = {};
  function light(hex = null) {
    if (!glow || !lyLight) return null;
    if (!bornLight) bornLight = glow.material.color.clone();
    lightColor = HF.hex(hex);
    if (lightColor) glow.material.color.set(lightColor); else glow.material.color.copy(bornLight);
    lyLight.color.value.copy(glow.material.color).lerp(lyWhite, 0.35);
    return lightColor;
  }
  function paint(parts = {}) {
    if (!T || !body || !parts || typeof parts !== 'object') return { ...painted };
    const was = marked; if (was) mark(null);   // the lift comes off before a colour is written and goes back on in the new colour
    if (!born) born = { base: paperMat.color.clone(), coat: inkMat.color.clone(), edge: inkMat.userData.wireGold.clone(), wire: wireMat.color.clone(), bezel: bezel.material.color.clone(),
      stalk: stalks[EYES[0]]?.material.color.clone() ?? null, rim: rim.material.color.clone(), iris: irisMat.color.clone(), eye: eyes.material.color.clone(),
      flame: thruster.material.color.clone(), core: core.material.color.clone(), flare: flare ? flare.material.color.clone() : null, pool: pool.material.color.clone() };
    const white = new T.Color(0xffffff);
    for (const part of PAINT_PARTS) {
      if (!(part in parts)) continue;
      const hex = hexOk(parts[part]), c = hex ? new T.Color(hex) : null; painted[part] = hex;
      const put = (col, b, f = (k) => k) => { if (col && b) col.copy(c ? f(c.clone()) : b); };
      if (part === 'base') put(paperMat.color, born.base);
      else if (part === 'coat') put(inkMat.color, born.coat);
      else if (part === 'gold') { put(inkMat.userData.wireGold, born.edge); put(paperMat.userData.wireGold, born.edge); put(wireMat.color, born.wire); put(bezel.material.color, born.bezel); put(rim.material.color, born.rim); for (const e of EYES) put(stalks[e]?.material.color, born.stalk); }
      else if (part === 'eyes') { put(irisMat.color, born.iris); put(eyes.material.color, born.eye); }
      else if (part === 'thruster') { put(thruster.material.color, born.flame); put(core.material.color, born.core, (k) => k.lerp(white, 0.55)); put(flare?.material.color, born.flare, (k) => k.lerp(white, 0.35)); put(pool.material.color, born.pool); }
    }
    if (was) mark(was);
    return { ...painted };
  }
  function setForm(name) {   // THE GAZE ON HER: her eyes open for good in a form (EYE_FORMS), or null: Brock's lines; returns the form in force (HER FACE: gazeOf, the Board's uGaze and uShape are the same numbers)
    const g = HF.gazeOf(name); S.form = g.form;
    if (eyeMat) { eyeMat.userData.gaze.set(g.gaze[0], g.gaze[1], g.gaze[2], g.gaze[3]); eyeMat.userData.shape.set(g.shape[0], g.shape[1], g.shape[2]); }
    return g.form;
  }
  function mark(part) {   // the part under or in his hand, lifted: porcelain and gold glow (emissive), eyes, flame and wires brighten; every other part as it is
    if (!T || !body) return null; marked = PAINT_PARTS.includes(part) ? part : null;
    const white = new T.Color(0xffffff);
    const lift = (m, on, k = 0.3) => {
      if (!m) return;
      if (m.emissive) { if (!m.userData.bornEmissive) m.userData.bornEmissive = m.emissive.clone(); if (on) m.emissive.copy(m.color).multiplyScalar(k); else m.emissive.copy(m.userData.bornEmissive); return; }
      if (on && !m.userData.lit) { m.userData.lit = m.color.clone(); m.color.lerp(white, 0.45); } else if (!on && m.userData.lit) { m.color.copy(m.userData.lit); m.userData.lit = null; }
    };
    lift(paperMat, marked === 'base'); lift(inkMat, marked === 'coat'); lift(bezel.material, marked === 'gold', 0.6); lift(wireMat, marked === 'gold');
    lift(irisMat, marked === 'eyes'); lift(eyes.material, marked === 'eyes'); lift(thruster.material, marked === 'thruster'); lift(core.material, marked === 'thruster');
    return marked;
  }
  function breathState() {
    const B = S.breath; if (!tiles) return { off: B.off ?? 'no body' };
    const heldSeats = []; for (let s = 0; s < SC.SEATS; s++) if (HELD[s] > 0) heldSeats.push(s);
    const cause = { song: B.on > 0 && (!B.song || B.song.state === 'playing') ? 'playing' : B.song?.state ?? 'none', held: heldSeats, hand: S.lock.touch }, r3 = (v) => Math.round(v * 1000) / 1000;
    return { by: wantBreath ? 'herself (the plan)' : "the glass's own (breathe)", unit0: HB.stateOf(0, cause), unit1: Array.from({ length: SC.SEATS }, (_, s) => HB.stateOf(HB.unitOf(1, s), cause)[0]).join(''),
      on: r3(B.on), hand: r3(HB.clamp01(S.lock.o)), touch: S.lock.touch, held: heldSeats, peak: r3(B.peak), rest: B.rest, tiles: Array.from(lyLight.lift.value, r3), shut: Array.from(shut, r3), open: Array.from(LIFT1, r3),
      word: Array.from(HB.wordOf(cause), (b) => b.toString(16).padStart(2, '0')).join('') };
  }
  const api = {
    breathe,
    /** held() -> her twelve's held weights, k a seat (0..1: THE HOLD, a unit1 off its wire holding a glass, place's k; the array breathe() reads), or null
     *  when none is held: the band's seventh argument (lyssajudron-band.mjs frame: THE HELD CORE, a held seat keeps its core lit, song or no song). Nothing
     *  at rest: null costs the band one test. */
    held: () => (heldOf() ? HELD : null),
    paint, light, mark, painted: () => ({ ...painted }), form: (name = null) => setForm(name),
    lookAt: (target, at_ms) => lookAt(target, at_ms), goTo: (pos, at_ms) => goTo(pos, at_ms),
    lockOn: (p) => { S.lock.to = vec3(p); return !!S.lock.to; },   // THE EYE LOCKS ON: a point in the stage's frame (a hand on a glass); null lets her eye go
    say: (line, at_ms = nowClock().now_ms) => { const beat = sayOn(line, at_ms, { until: SC.downbeatOf(at_ms, nowClock()) + nowClock().beats_per_bar }); noteCause(beat); return beat; },
    carry: (seat, image, at_ms) => carry(seat, image, at_ms), remember, sample,
    fuel: level => tank?.fill(level),
    slosh: (seconds, energy) => tank?.frame(seconds, energy),
    // A projection can place its frame and pins at this instant before its single
    // sample. This reads the held cause chains; it never advances or paints them.
    poseAt: ({ clock = S.clock, dance = null, bob = null } = {}) => {
      const c = SC.normalClock(clock);
      return bodyAt(c, bob ? SC.normalClock(bob) : dance ? SC.normalClock(dance) : c);
    },
    /** place(seat, p, {s, k, gone, open}): HER UNIT1 AWAY: one of her twelve stands at p (this body's own frame: the frame its pose is in) instead of on its wire,
     *  s times its own size, k of the way there (0: on its wire as born, 1: at p). gone: its chair is empty (it is away, in the room or in another glass:
     *  nothing of it is drawn here, p not needed). open: how much it holds a glass there (0..1), THE BREATH's open state for it (breathe() lays it over the
     *  band's lift, her-breath.mjs openOver); unsaid, it is k (a unit1 the module is let off its wire holds, as in the well). A PIN IS NOT A HOLD (Oct 14 2026,
     *  the twelve shells on every Board that drew her body): a glass whose own law places her twelve every picture says open: 0 for one at its chair or in
     *  flight, and the hold's weight only for one at a glass. place(seat, null): on its wire again. only(seats | null): draw only these of the twelve and nothing else of
     *  her (her body, her wires, her eyes: a glass her unit1 crosses while she is held in lysa); null: the whole of her. Both stand until said again; nothing
     *  is written anywhere and the score is untouched. */
    place: (seat, p, { s = 1, k = 1, gone = false, open = null } = {}) => { if (!Number.isInteger(seat) || seat < 0 || seat >= SC.SEATS) return false; const q = vec3(p); if (!q && !gone) { delete S.placed[seat]; return true; }
      const kk = num(k) ? Math.max(0, Math.min(1, k)) : 1; S.placed[seat] = { p: q, s: num(s) && s >= 0 ? s : 1, k: kk, open: num(open) ? Math.max(0, Math.min(1, open)) : kk, gone: !!gone }; return true; },
    only: (seats) => { S.only = Array.isArray(seats) ? new Set(seats.filter((n) => Number.isInteger(n) && n >= 0 && n < SC.SEATS)) : null; return S.only ? [...S.only] : null; },
    eyes: () => (S.world ? EYES.map((e) => [...S.world[e]]) : null), body: () => (S.pose ? [...S.pose] : null),   // THE REVEAL's read (reveal-layer.mjs): where its eyes and body stand at the last sample
    base: () => S.base, riseAt: (p) => riseOf(vec3(p)),   // THE ANCHOR's reads (minis-layer.mjs): where its stand's base stands at the last sample; how high it would stand at a spot
    hold: (seat) => (S.held && S.held.seat === seat && S.world ? { position: [...S.world[HOLDER]], satellite: HOLDER } : null),   // TWIN's ask (A9): where the held glass rides
    state: () => ({ law: S.law, beat: S.clock.beat, bar: S.clock.bar, beat_phase: S.clock.beat_phase, source: S.clock.source, clockSource: S.clockSource, bob: bobState(), council: council ? council.state() : { off: S.councilError ?? 'none' }, ferro: ferro ? { ...ferro.state(), flux: S.flux ?? null } : { off: S.ferroError ?? 'none' }, gaze: S.yaw, pose: [...S.pose], step: S.step, line: S.line, restText: S.restText,
      lineNext: S.lines[0] ? { text: S.lines[0].text, beat: S.lines[0].beat, until: S.lines[0].until ?? null } : null, lines: S.lines.length, goes: S.goes.length, gazes: S.gazes.length,
      carrying: S.carry ? { seat: S.carry.seat, satellite: S.carry.satellite, beat: S.carry.beat, heard: S.carry.heard, landed: S.carry.landed, phase: S.carried?.phase ?? null } : null, hand: S.hand ? [...S.hand] : null, held: S.held?.seat ?? null,
      hop: S.hop ? { beat: S.hop.beat, span: S.hop.span, to: [...S.hop.to], riseTo: S.hop.riseTo } : null, base: S.base, pinnedBy: S.pinnedBy, anchor: S.anchor ? { rev: S.anchor.rev, position: [...S.anchor.position], ref: S.anchor.anchor?.ref ?? null } : null,
      on: S.pinned ? thingName(thingAt(S.pinned)?.t.kind) : null, scout: S.scout ? { beat: S.scout.beat, until: S.scout.until, to: [...S.scout.to] } : null, hovered: S.hovered,
      eyes: { him: S.him, work: S.work, around: S.around }, walls: S.walls.length, things: S.things.length, glasses: S.glasses.length, home: [...S.home], homeBeat: S.restBeat, lastNote: S.lastNote, showing: S.showing, guesses: num(S.guessesTold) ? S.guessesTold : 0,
      paint: { ...painted }, fuel: tank?.state() ?? null, marked, brock: S.brock ? { ...S.brock } : null, form: S.form ?? null,
      breath: breathState(),   // THE BREATH: unit0's state and her twelve's by the causes, the song's wakefulness, his hand's ease, the chairs held open, unit0's 32 lifts, the word every glass derives (40 bytes, hex)
      lock: { on: !!S.lock.to, gaze: S.lock.g.map((v) => Math.round(v * 1000) / 1000), face: S.lock.h.map((v) => Math.round(v * 1000) / 1000), focus: Math.round(S.lock.f * 1000) / 1000,   // THE EYE LOCKS ON: radians in her body's frame [yaw, pitch]; the ring's place in the lens (of K)
        iris: irisMesh ? [Math.round((irisMesh.position.x / SC.K) * 1000) / 1000, Math.round((irisMesh.position.y / SC.K) * 1000) / 1000] : null, rest: S.lock.rest }, satellites: S.world ? S.world.map((p) => [...p]) : null, placed: Object.fromEntries(Object.entries(S.placed).map(([k, v]) => [k, v.gone ? 'gone' : { p: v.p, s: v.s, k: v.k }])), only: S.only ? [...S.only] : null, pairing: S.pairing.open, low: S.low, chained: S.chained, visible: S.visible, draws: S.draws, work: S.work_.last, counts: { ...counts } }),
    stop() {
      if (!S.on) return; S.on = false; chain(false);
      for (const off of offs.splice(0)) call(off);
      twin?.host?.removeEventListener?.('pointermove', onPointer); doc?.removeEventListener?.('visibilitychange', onVisibility);
      if (root && stage?.removeLayer) { call(() => stage.removeLayer(root)); for (const w of wires) w.children[0]?.geometry?.dispose?.(); stalks[0]?.geometry.dispose(); body?.geometry.dispose(); sats?.geometry.dispose(); eyes?.geometry.dispose(); }
      if (council) { call(() => council.dispose()); council = null; }
      if (ferro) { call(() => ferro.dispose()); ferro = null; }   // HER FERROFLUID IN THE COUNCIL: the liquid goes with her
      tank?.dispose(); tank = null; body?.material?.[1]?.dispose();   // the glass is unit0's own clone; the coat's porcelain is the satellites' too and goes with them
      layer?.remove(); layer = null; cap = null;
    },
  };
  try { const w = doc?.defaultView; if (w && new URLSearchParams(w.location?.search || '').has('awake')) w.LYSSA = api; } catch { /* no window: no proof seam */ }   // the proof's numbers (A2's door, as the twin's ?awake)
  S.visible = visibleNow(); chain(true);
  return api;
}

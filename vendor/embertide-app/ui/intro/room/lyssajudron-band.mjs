// lyssajudron-band.mjs - THE TWELVE PLAY (Oct 12 2026 11:0x WEST). His words over the onboarding's well, her twelve riding their wires while only her
// liquid answered the beat: "can you please start thinking about this? because i dont like it at all what it is right now... i would like to see
// satellite unit1s also beating the rythm... like... come on dude... start thinking more creative".
// THE BAND. Her ferrofluid is the house's kick (lyssajudron-ferro.mjs: a surge on every beat, the bar's accents, the phrase's one the highest). The twelve
// are her band round it: each of her four wires is one voice of a drum kit and its three satellites take that voice's hits in turn, so the beat runs
// along the wire from one child to the next: lane 0 the kick (1 and 3), lane 1 the clap (2 and 4), lane 2 the hats (the offbeats), lane 3 the son clave
// (3-2, in one bar). The phrase is her liquid's four bars: on its last beat the twelve sweep round her clockwise, one after the other (the fill), and on
// the phrase's one, where her liquid surges highest, all twelve open together.
// A HIT. A satellite is a lantern, and each child wears its own tone (his 09:23 "use colors to outline diversity... use difff hex color... make it
// beautiful": the house's cold spectrum, the 15 hexes the poleis' members wear, poleis/engine.js RQ.SPECTRUM, aurora mint to orchid; a wire's three hold
// neighbouring tones, a voice is a family; her own light stays hers, warm, at the centre). On its hit its porcelain tiles lift off their seams along
// their own normals (the body's shader: lyssajudron.mjs aLyOpen; an eye's tiles stay shut round the eye) and its light spills out between them: the core
// under its tiles in its tone, its seams burning in it, a halo blooming in the well's smoke; then the tiles close, ringing as her liquid rings (the same
// surge: ferro surge(), a 26 ms rise and the 7.5 Hz ring).
// THE DANCE (his 11:2x "it's too boring dude... make it dance... make it rotate... make it alive... have you forgotten the good council thing"): her whole
// council sways about her centre a side each beat, leaning into it, nodding on every beat (a slow drift with no song); every child tumbles on its own
// axis, a turn in four bars, stepping on the beat with a song; a big hit (the kick, the clap, the one, the fill) spins it a whole pirouette about her
// vertical, a light one (the hats, the clave) shimmies it; a hit hops it. Its council flies round it (lyssajudron-council.mjs).
// A pure function of the clock and the song: every glass opens the same lantern at the same instant, a frozen clock holds them, and with no song none opens.
// THE SONG LEADS (his 11:3x, over her twelve flashing, spinning and hopping on every hit of a drum machine of ours: "i said make it dance... i didnt say
// make him a crackhead... is there really no DCT study on frequencies of songs and climaxes or idk?"): the song is studied once (radio/song-score.py: its
// beats, its bar's one, its intensity, its kick, snap and hats, its sections and climax, on the Nest as radio/score) and the well hands the band the song's
// own clock and that study (`song`: I(beat) its intensity, kick/snap/hat(beat) its hits' strength, drop(beat) a drop or the climax's first beat). So:
// - a voice plays only when the song is that intense (BAND.voices min: the kick always, the clap from 0.3, the hats from 0.65, the clave at a peak; the
//   twelve's unison from 0.4, the fill from 0.7), and as hard as the song hits it there (the kick lane by its kick, the clap by its snap, the hats by them);
// - on a drop and at the climax the twelve open together;
// - her council sways a side each BAR, a whole sway in two, eased, as wide as the song is intense, and nods on the beat; every child tumbles smoothly;
// - a pirouette only when the twelve play together and the song is past DANCE.twirl.min, a shimmy only at a peak, a hop a third of what it was.
// With no study of the song on the air the band plays as a calm song (DANCE.calm): the kick, the clap and the twelve on the one; nothing spins.
// THE TWELVE REACH (his 11:5x, over the twelve lighting and turning in place, every one at the same distance from her: "you know you can play with radial
// distance of individual satellites or not? like... do you not understand the degrees of freedom here?"): a child's distance from her is its own to dance.
// Each child on its wire reaches out on its own hits and stands furthest ON the hit, as a dancer lands on the beat:
// it sets out DANCE.reach.lead beats before it (the study knows the song ahead) and is home DANCE.reach.back after, as far as its voice reaches and the song
// hits it there (the kick furthest; the hats a ripple running along their wire, each child in turn). On the phrase's one the twelve bloom together, on
// the fill a ripple runs round her clockwise, and before a drop they gather in to her over two beats and burst out on it. Under it all the formation breathes
// with the song: close to her while it is quiet, wide at the climax (its intensity over the eight beats round now). Her four gold wires stretch through
// their satellites (a wire's radius eased from each of its three to the next along it), so no child ever leaves its wire.
// THE PIROUETTE (his 12:0x, as the twelve began to reach: "idk dude like... do you not fucking know pirouettes and momentum/inertia? like shrinking your radii
// makes you go faster spin..."): her council turns about her vertical as a skater does, w = L / I (L the song's, DANCE.spin.turns a beat at its full; I the
// mean of (1 + reach)^2): gathered in before a drop she spins up about 1.5 times, bursting out she brakes to under half; summed over the song's beats (spinAt)
// and shown as a lookup of its last change (turnOf). Her wires turn with the twelve, her body and face stay; a child off its wire holds its place.
// THE EAR (his 12:3x, over the twelve reaching on the study's beats: "you understand that it needs to be reactive to music like the good old microsoft
// music visualizers?"): with the song's spectrum (radio/song-score.py: twelve bands from 40 Hz to 12 kHz, 25 frames a second, read once from the radio's
// own copy of the song; the Nest's radio/spectrum) the twelve are its bars, as on Windows Media Player's. Each child plays the band of its colour (mint the
// bass, orchid the air) and stands out from her as far as its band sounds now (up at once, down over DANCE.ear.release_ms, read 40 ms ahead: a picture is
// seen a frame after it is drawn); its lantern opens on its band's onsets; her council's angular momentum is the song's loudness, so the pirouette speeds
// with the sound and brakes as the bars throw the twelve out. The drum machine of ours is gone wherever the spectrum is heard; the study's drops still
// gather the twelve in before them and spin them on them. Without a spectrum yet (a song's first play) the band dances on the study as above.
// THE COIL (his 12:4x, over the bars: "make the amplitudes more springy coiled? like... there is little variance between small oscillations and higher
// ones... it feels plasticky tbh"): a bar tracked its band with nothing behind it (up at once, a slow fall, every band on its own gain), so the twelve sat
// at much the same distance and moved like plastic. Now each child hangs on a damped spring out from her (zeta 0.17: a hit rings on in swings, each about a
// third of the last), its band the force: its level pulls it to a rest raised to the power 2.6 (quiet stays close to her, only the peaks go far), and its
// band's own hits throw it out, so it flies past its rest, recoils inside it and rings home. The bass's coils are heavy (1.6 Hz), the air's light (3.4 Hz).
// Soft walls (tanh) keep it off her and inside the shaft. Every frame's state is summed exactly once a song (the spring's own solution over each 40 ms),
// so every glass rings alike. Measured on Madame: the reach's spread 0.101 -> 0.142, its median 0.12 -> -0.01 (at rest), its peaks 0.30 as before.
// With a spectrum: 12 coils carried on from their frame (~1 us), 12 onsets from ~13 frames each a picture; the coils' and the pirouette's sums once a song (THE PULSE's growing spectrum: its new frames alone, GROWN below)
// (~6 ms each on the Mac).
// COST: per picture the hits of the last BAND.look beats and the next DANCE.reach.lead (~12 of a phrase's ~60), 12 surges, 12 matrix decompositions and
// quaternions, 12 places of the score (the holds), 12 attribute writes, 24 instance matrices and colours, the four wires' points bent, turned and sent
// (1028, 12 KB), up to three eye discs; the pirouette's sum once a song (~2300 eighths of a beat, each a reachAt: ~4 ms on the Mac, grown as it plays);
// two draws (the cores, the halos) only while a song plays, and the cores alone while a seat is held (THE HELD CORE: 12 compares a picture, a write only on
// a change). The lift, the reach and the turn are the vertex shader's.
// THE HELD CORE (Oct 14 2026 05:4x WEST, HER-BREATH-LANDING.md NOT LANDED 3; his 02:44 "every unit in the tree of lyssajudron can be 'breathing state' or
// closed? or open"): a seat her body holds open (THE HOLD: lyssajudron.mjs held(), the well's seventh argument to frame) keeps its core lit, song or no song,
// BAND.held of its tone by as far as it is held (place's k), the hit riding over it while a song plays; no halo; core and halo at the satellite's own size.
// With no song the held cores are the band's one draw, written only when a held seat moves, grows or lets go (the others at size 0); with no seat held and no
// song the band draws and writes nothing, THE TWELVE PLAY as it was to the bit (lyssajudron-band.test.mjs, her-breath.test.mjs).
import * as SC from './lyssajudron-score.mjs';
import { surge } from './lyssajudron-ferro.mjs';

/** The house's cold spectrum: poleis/engine.js RQ.SPECTRUM (anatomy-scene.js holds the same 15), aurora mint to orchid. */
export const SPECTRUM = Object.freeze(['#60d8a8', '#30a890', '#37c9bf', '#72dee4', '#28aac0', '#52c7f2', '#1a95d8', '#74b2f8', '#97beff', '#7788ed', '#b8b5fc', '#936dd9', '#c89bea', '#e2b5ec', '#c66cbb']);
export const BAND = Object.freeze({
  voices: Object.freeze([   // lane k plays voice k: its steps in sixteenths of a bar, A its strength, fall how long its tiles stay open (in beats)
    Object.freeze({ name: 'kick', steps: Object.freeze([0, 8]), A: 1, fall: 0.45, min: 0 }),          // min: the song's intensity from which the voice plays
    Object.freeze({ name: 'clap', steps: Object.freeze([4, 12]), A: 0.9, fall: 0.4, min: 0.3 }),
    Object.freeze({ name: 'hats', steps: Object.freeze([2, 6, 10, 14]), A: 0.5, fall: 0.22, min: 0.65 }),
    Object.freeze({ name: 'clave', steps: Object.freeze([0, 3, 6, 10, 12]), A: 0.66, fall: 0.3, min: 0.85 }),
  ]),
  phrase: 4,                                      // bars: her liquid's phrase (FERRO.phrase, the first downbeat of every four)
  unison: Object.freeze({ A: 1.25, fall: 0.6, min: 0.4 }),  // the phrase's one: the twelve together (a drop and the climax too, whatever the intensity)
  fill: Object.freeze({ A: 0.75, fall: 0.3, min: 0.7 }),    // the phrase's last beat: the twelve one after the other, clockwise round her
  held: 0.9,                                      // THE HELD CORE: the light under a satellite's tiles while her body holds it open (THE HOLD), times its tone at a full hold, by how far it is held; song or no song, never the hit's flash (core[0] + core[1] = 1.62 with its halo). Read on the lane's headless pictures (HER-BREATH-LANDING.md, THE HELD CORE): at 0.9 the heart is a light of the unit's tone a step under its own sparks (its council's dots, COUNCIL.light 1.25 of the tone) and 0.56 of the flash; at 0.65 it read as a ball a third darker than its sparks, a weight in the shell
  core: Object.freeze([0.12, 1.5]),               // the light under a satellite's tiles, times its tone: shut, and the more at a full hit
  halo: Object.freeze([2.0, 2.4, 1.15]),          // a halo across, in the satellite's radius (shut, the more at a full hit), and its light at a full hit
  knee: 1.5,                                     // hits on one satellite add up softly over 1 (the one over a ringing fill): never past 1 + 1/knee
  look: 3,                                        // beats: a hit older than this has rung out
});
export const DANCE = Object.freeze({
  calm: 0.45,                                                              // the song's intensity when the song on the air has no study yet: a calm song
  sway: Object.freeze({ yaw: Object.freeze([0.04, 0.15]), roll: Object.freeze([0.012, 0.045]), nod: Object.freeze([0.012, 0.045]), bars: 2 }),   // her council: a side each bar, a whole sway in `bars`, eased, a lean into it and a nod on the beat; [quiet, climax] by the song's intensity
  drift: Object.freeze({ yaw: 0.05, roll: 0.02, bars: 8 }),                // with no song: a slow drift, alive
  tumble: 16,                                                              // beats a child's tumble takes for a turn, smooth
  twirl: Object.freeze({ beats: 2, kinds: Object.freeze(['all']), min: 0.55 }),   // a pirouette, a whole turn about her vertical, only when the twelve play together and the song is this intense
  shimmy: Object.freeze({ beats: 0.5, angle: 0.16, min: 0.8 }),           // the hats and the clave at a peak: a small wiggle that comes back
  reach: Object.freeze({                                                   // THE TWELVE REACH: how far a child stands out from her, in shares of its distance from her
    lead: 0.5, back: 1,                                                    // beats: it sets out this long before its hit (furthest ON it) and is home this long after
    voices: Object.freeze([0.2, 0.15, 0.08, 0.1]),                         // a voice's reach at a full hit: the kick, the clap, the hats, the clave
    unison: 0.25, fill: 0.14, drop: 0.38,                                  // the nine on the phrase's one, the fill's ripple round her, a drop's burst
    gather: Object.freeze({ beats: 2, share: -0.26 }),                     // before a drop the twelve gather in to her, to the range's floor (her arms in: the pirouette spins up)
    breath: Object.freeze([-0.06, 0.08]), span: 4,                         // the formation by the song's intensity over span beats each side of now: [quiet, climax]
    range: Object.freeze([-0.2, 0.42]),                                    // never into her (a child's skin 3.5 cm off hers at the least), never through the walls
  }),
  ear: Object.freeze({                                                     // THE EAR: the song's spectrum (radio/song-score.py), its twelve bands the twelve
    lead_ms: 40,                                                           // the song is read this far ahead (a picture is seen about a frame after it is drawn)
    release_ms: 260,                                                       // a bar falls back over this (up at once: the newest frame rises in over its 40 ms)
    coil: Object.freeze({                                                  // THE COIL: a child hangs on a spring out from her, its band pulling it (his 12:4x "springy coiled")
      hz: Object.freeze([1.6, 3.4]),                                       // its natural frequency: the bass's heavy coil to the air's light one, pitch-spaced between
      zeta: 0.17,                                                          // its damping: a hit rings on in swings, each about a third of the last
      rest: Object.freeze([-0.1, 0.36]), curve: 2.6,                       // where its band's level holds it, silent to full, the level raised to curve: quiet stays close, the peaks go far
      kick: 0.6,                                                           // a hit throws it out: its onset (0..1, the band's own scale) as a speed of kick times its angular frequency
    }),
    onset_ms: 170, onset: Object.freeze([0.2, 0.55]),                      // a lantern opens on its band's rise (its flux) from onset[0], full at onset[1] (the study's own scale a band when it has one), closing over onset_ms
    loud_ms: 700,                                                          // the loudness (the bands' mean), her council's angular momentum, falls over this
  }),
  spin: Object.freeze({                                                    // THE PIROUETTE: her council turns about her vertical, its rate L / I
    turns: 0.125,                                                          // its angular momentum at the song's full intensity: a turn in 8 beats with the twelve at rest (I = 1)
    steps: 8, from: -64,                                                   // the turn is summed in eighths of a beat from 64 beats before the song's one
    ease_ms: 180,                                                          // a glass catches up with the song's turn this fast (a song waking, stopping, changing never jumps)
  }),
});
const intensityOf = (song, b) => (song && typeof song.I === 'function' ? clamp01(song.I(b)) : DANCE.calm);   // the song's intensity at beat b (a calm song without a study)
const mix = (r, k) => r[0] + (r[1] - r[0]) * k;
const TAU = 2 * Math.PI;
const STEPS = 16;   // a voice's steps are sixteenths: four a beat
const num = (v) => typeof v === 'number' && Number.isFinite(v);
const mod = (a, m) => ((a % m) + m) % m;
const clamp01 = (v) => (num(v) ? Math.max(0, Math.min(1, v)) : 0);

/** toneOf(seat): the satellite's own tone: a wire's three take neighbouring tones of the spectrum (a voice is a family), twelve of the fifteen. */
export function toneOf(seat) {
  const s = mod(Math.round(num(seat) ? seat : 0), SC.SEATS), rank = SC.laneOf(s) * 3 + Math.floor(s / SC.LANES);
  return SPECTRUM[Math.round((rank * (SPECTRUM.length - 1)) / (SC.SEATS - 1))];
}

const PLANS = new Map();
/** phrasePlan(beats_per_bar): one phrase's hits in beats from its first downbeat, sorted: {beat, all: true} the phrase's one (the twelve), {beat, lane, n}
 *  a voice's (n: its count in the phrase; the wire's three take them in turn), {beat, slot} the fill's twelve; and each voice's count in a phrase. */
export function phrasePlan(bpb = SC.BEATS_PER_BAR) {
  const n = Math.max(1, Math.round(num(bpb) ? bpb : SC.BEATS_PER_BAR)); let plan = PLANS.get(n); if (plan) return plan;
  const hits = [{ beat: 0, all: true, kind: 'all', A: BAND.unison.A, fall: BAND.unison.fall }], count = [0, 0, 0, 0], last = BAND.phrase - 1;
  for (let bar = 0; bar < BAND.phrase; bar++) for (let step = 0; step < n * 4; step++) {
    if ((bar === 0 && step === 0) || (bar === last && step / 4 >= n - 1)) continue;   // the phrase's one is the twelve's; its last beat is the fill
    BAND.voices.forEach((v, lane) => { if (v.steps.includes(step % STEPS)) hits.push({ beat: bar * n + step / 4, lane, n: count[lane]++, kind: v.name, A: v.A, fall: v.fall }); });
  }
  for (let slot = 0; slot < SC.SEATS; slot++) hits.push({ beat: BAND.phrase * n - 1 + slot / SC.SEATS, slot, kind: 'fill', A: BAND.fill.A, fall: BAND.fill.fall });
  hits.sort((a, b) => a.beat - b.beat);
  plan = Object.freeze({ beats: BAND.phrase * n, hits: Object.freeze(hits.map(Object.freeze)), count: Object.freeze(count) }); PLANS.set(n, plan); return plan;
}
/** fillOrder(clock, turn): the twelve clockwise round her as the eye before her sees them (her own x right, y up), from twelve o'clock, where the score has
 *  them at that instant (on their wires, never on an errand) turned by her council's pirouette `turn` (radians about her vertical), so every glass sweeps
 *  them in the same order. */
export function fillOrder(clock, turn = 0) {
  const c = SC.normalClock(clock), ct = Math.cos(turn), st = Math.sin(turn);
  return Array.from({ length: SC.SEATS }, (_, seat) => { const p = SC.satelliteAt(seat, c); return { seat, a: mod(Math.atan2(p[0] * ct + p[2] * st, p[1]), 2 * Math.PI) }; })
    .sort((x, y) => x.a - y.a).map((x) => x.seat);
}
let FILL = { key: null, order: null };   // the last fill's order (one fill rings at a time: BAND.look is under a phrase)
/** seatsOf(hit, phrase, plan, clock, place, turnAt): who plays a hit of the plan in phrase number `phrase`: the twelve, the wire's next in turn, or the fill's
 *  slot (the order where they stand as the fill begins, by `place`: the clock that places her twelve on their wires, the dancers' own when none is given;
 *  turned by turnAt(ms), her council's pirouette then, in radians). */
export function seatsOf(h, phrase, plan, c, place = null, turnAt = null) {
  if (h.all) return Array.from({ length: SC.SEATS }, (_, s) => s);
  if (num(h.slot)) {
    const at = c.epoch_ms + (phrase * plan.beats + plan.beats - 1) * c.beat_ms, pc = place ? SC.normalClock(place) : c, tn = turnAt ? turnAt(at) : 0;
    const key = `${pc.epoch_ms}|${pc.beat_ms}|${pc.beats_per_bar}|${at}|${Math.round(tn * 1000)}`;
    if (FILL.key !== key) FILL = { key, order: fillOrder(SC.clockOf(pc, at), tn) };
    return [FILL.order[h.slot]];
  }
  return [h.lane + SC.LANES * mod(phrase * plan.count[h.lane] + h.n, 3)];
}
/** eachHit(clock, song, place, behind, ahead, fn, turnAt): the plan's hits from `behind` beats ago to `ahead` beats ahead that the song plays (a voice from
 *  its min intensity, the twelve and the fill from theirs), newest first: fn(seats, beat, hit, k), k how hard the song hits it there (0.35 to 1; 1 without a
 *  study). */
function eachHit(c, song, place, behind, ahead, fn, turnAt = null) {
  const plan = phrasePlan(c.beats_per_bar), now = SC.beatsAt(c);
  for (let p = Math.floor((now + ahead) / plan.beats); p >= Math.floor((now - behind) / plan.beats); p--) {   // the phrases the window touches (a fill rings over the next one's one)
    for (let i = plan.hits.length - 1; i >= 0; i--) {
      const h = plan.hits[i], b = p * plan.beats + h.beat; if (b > now + ahead) continue; if (now - b > behind) break;   // the plan is sorted: the rest rang out
      const v = num(h.lane) ? BAND.voices[h.lane] : null, min = h.all ? BAND.unison.min : num(h.slot) ? BAND.fill.min : v.min; if (intensityOf(song, b) < min) continue;   // the song is not that intense here
      const by = v && song ? [song.kick, song.snap, song.hat, null][h.lane] : null;
      fn(seatsOf(h, p, plan, c, place, turnAt), b, h, typeof by === 'function' ? 0.35 + 0.65 * clamp01(by(Math.floor(b))) : 1);   // as hard as the song hits there
    }
  }
}
/** hitsAt(clock, song, place, turnAt): every satellite's last two hits at the clock's instant within BAND.look beats, newest first: for each seat [{ago_ms, A,
 *  fall, kind}]. song (the well's study of the song on the air, or null: a calm song): a voice plays from its min intensity, as hard as the song's own hit
 *  there, and the twelve open together on a drop and at the climax. place, turnAt: where her twelve stand (seatsOf). */
export function hitsAt(clock, song = null, place = null, turnAt = null) {
  const c = SC.normalClock(clock), now = SC.beatsAt(c), out = Array.from({ length: SC.SEATS }, () => []);
  if (!earOf(song)) eachHit(c, song, place, BAND.look, 0, (seats, b, h, k) => { const hit = { ago_ms: (now - b) * c.beat_ms, A: h.A * k, fall: h.fall, kind: h.kind }; for (const s of seats) if (out[s].length < 2) out[s].push(hit); }, turnAt);   // the plan only where the song's spectrum is not heard: with it, its drops alone
  if (song && typeof song.drop === 'function') for (let b = Math.floor(now); b >= Math.ceil(now - BAND.look); b--) if (song.drop(b)) {   // a drop, the climax: the twelve together
    const hit = { ago_ms: (now - b) * c.beat_ms, A: BAND.unison.A, fall: BAND.unison.fall, kind: 'all' };
    for (let s = 0; s < SC.SEATS; s++) { if (out[s].length && out[s][0].ago_ms <= hit.ago_ms) { if (out[s].length < 2) out[s].push(hit); } else { out[s].unshift(hit); out[s].length = Math.min(2, out[s].length); } }
  }
  return out;
}
/** openAt(clock, on): how open each of the twelve stands at the clock's instant (0 shut, 1 a full hit's peak; the ring dips a little under), times the
 *  song's wakefulness on (ferro songOn): nothing opens without a song. */
export function openAt(clock, on = 1, hits = null) {
  const out = new Float64Array(SC.SEATS), w = clamp01(on); if (!(w > 0)) return out;
  const c = SC.normalClock(clock);
  (hits || hitsAt(c)).forEach((hs, seat) => { let v = 0; for (const h of hs) v += h.A * surge(h.ago_ms, c.beat_ms, h.fall); if (v > 1) v = 1 + (v - 1) / (1 + BAND.knee * (v - 1)); out[seat] = w * Math.max(-0.1, v); });
  return out;
}
/** reachOf(x): a hit's reach x beats after it (before it: x < 0): 0 until DANCE.reach.lead before, eased out to 1 ON the hit, eased home by DANCE.reach.back. */
export const reachOf = (x) => { const R = DANCE.reach; return !(x >= -R.lead && x <= R.back) ? 0 : x < 0 ? SC.smooth(1 + x / R.lead) : 1 - SC.smooth(x / R.back); };
// ---- THE EAR: the song's spectrum, frame by frame ----
// THE HIT AT ITS SAMPLE (Oct 29 2026; his 00:59 UTC "the music beat is not 40ms dio stronzo... the music has infinite resolution in the sense that you can
// start to make things happen in AR that are timed with the music, like the ferrofluid stuff of swarmy / lyssajudron", 01:4x "why not both?"). A frame's
// levels are the peak of 43 ms windows ending in it, and the bars raised the next frame across the whole frame before it (up to 42.67 ms ahead of its
// hit). THE PULSE now says where each frame's hit began (embertide-radio/pulse/src/pulse.rs hit_at: the sample of steepest change in the 2.67 ms window
// that rose most, one letter of two frames' span, 1.35 ms a letter; 0 none): such a frame rises AT ITS HIT over HIT.attack_ms and fades from there; a
// frame with none (the study's table, a held sound, a bridged hole) rises as it always did. One rule for the bars, the lanterns and her loudness.
export const HIT = Object.freeze({ attack_ms: 6 });
/** hitAt(ear, fr): where frame fr's hit began, in frames from the frame's first sample (-1: the frame before it began; up to 1), or null for none */
export function hitAt(ear, fr) { const A = ear && ear.at; if (!A || !(fr >= 0) || fr >= ear.frames || fr >= A.length) return null; const p = A[fr]; return p > 0 && p <= 63 ? ((p - 1) / 62) * 2 - 1 : null; }
/** standOf(ear, fr, f, d, k): how much of frame fr's value stands at frame-time f (frames since the table's first; d ms a frame): from its hit, rising over
 *  HIT.attack_ms and fading over k ms; with no hit, rising across the frame before it and fading from its own first sample (the bars as they were) */
export function standOf(ear, fr, f, d, k) {
  const h = hitAt(ear, fr);
  if (h == null) { const x = f - fr; return x < -1 ? 0 : x < 0 ? x + 1 : Math.exp(-(x * d) / k); }
  const ms = (f - fr - h) * d; return ms < 0 ? 0 : Math.min(1, ms / HIT.attack_ms) * Math.exp(-ms / k);
}
/** bandOf(seat): the band of the song's spectrum a child plays: its colour's rank (toneOf: mint the bass, orchid the air), so its colour is its pitch. */
export const bandOf = (seat) => { const s = mod(Math.round(num(seat) ? seat : 0), SC.SEATS); return SC.laneOf(s) * 3 + Math.floor(s / SC.LANES); };
/** earOf(song): the song's spectrum the well heard (radio/spectrum decoded: {fps, offset_ms, one_ms, bands, frames, levels: 0..63 a band a frame, at: THE PULSE's
 *  hits, one letter a frame, or null}), or null. */
export const earOf = (song) => { const e = song?.ear; return e && e.bands === SC.SEATS && e.fps > 0 && e.frames > 1 && e.levels?.length >= e.frames * e.bands ? e : null; };
const earMs = (c, ear) => c.now_ms - c.epoch_ms + (num(ear.one_ms) ? ear.one_ms : 0) + DANCE.ear.lead_ms;   // the song's ms at the clock's instant (its epoch is its bar's one), read ahead
const LV = new Float64Array(SC.SEATS), ON = new Float64Array(SC.SEATS), PULSE = new Float64Array(SC.SEATS);
/** levelsAt(ear, ms, out): THE BARS: each band's level at the song's ms, 0..1, as on a visualizer: the newest frame rising in over its 40 ms, every older one
 *  fading by its age over DANCE.ear.release_ms, the highest of them. */
export function levelsAt(ear, ms, out = new Float64Array(SC.SEATS)) {
  out.fill(0); const B = ear.bands, L = ear.levels, d = 1000 / ear.fps, f = (ms - (ear.offset_ms || 0)) / d, i = Math.floor(f), k = DANCE.ear.release_ms;
  if (!(i >= -1 && i < ear.frames)) return out;
  for (let fr = Math.min(ear.frames - 1, i + 2), stop = Math.max(0, i - Math.ceil((3 * k) / d)); fr >= stop; fr--) {   // the frames that stand now: rising at their hit (or across the frame before), fading after
    const w = standOf(ear, fr, f, d, k); if (!(w > 0)) continue; for (let b = 0; b < B; b++) { const v = (L[fr * B + b] / 63) * w; if (v > out[b]) out[b] = v; } }
  return out;
}
/** riseOf(ear, frame, band): the band's rise into the frame (its flux) on its own scale, 0..1: the study's ear.onset (from its 95th rise, full at its 99.5th),
 *  DANCE.ear.onset without one. A hit of the band, never its chatter. */
export function riseOf(ear, fr, b) {
  const B = ear.bands, L = ear.levels, q = Array.isArray(ear.onset?.[b]) && ear.onset[b][1] > ear.onset[b][0] ? ear.onset[b] : DANCE.ear.onset;
  const x = (fr > 0 ? Math.max(0, L[fr * B + b] - L[(fr - 1) * B + b]) : L[b]) / 63; return Math.max(0, Math.min(1, (x - q[0]) / (q[1] - q[0])));
}
/** onsetsAt(ear, ms, out): each band's onset at the song's ms, 0..1: its level's rise from a frame to the next (its flux) on the band's own scale (the
 *  study's ear.onset: from its 95th rise, full at its 99.5th; DANCE.ear.onset without one), fading over DANCE.ear.onset_ms: a child's lantern opens on its
 *  own band's hits, never on its chatter. */
export function onsetsAt(ear, ms, out = new Float64Array(SC.SEATS)) {
  out.fill(0); const B = ear.bands, d = 1000 / ear.fps, f = (ms - (ear.offset_ms || 0)) / d, i = Math.floor(f), k = DANCE.ear.onset_ms;
  if (!(i >= -1 && i < ear.frames)) return out;
  for (let fr = Math.min(ear.frames - 1, i + 2), stop = Math.max(0, i - Math.ceil((3 * k) / d)); fr >= stop; fr--) {   // each frame's rise at its hit (THE HIT AT ITS SAMPLE), else across the frame before
    const w = standOf(ear, fr, f, d, k); if (!(w > 0)) continue; for (let b = 0; b < B; b++) { const v = riseOf(ear, fr, b) * w; if (v > out[b]) out[b] = v; } }
  for (let b = 0; b < B; b++) out[b] = Math.min(1, out[b]);
  return out;
}
// GROWN, NOT RESUMMED (Oct 12 2026 21:1x WEST, from the profile of the moment on lysa: once a second, exactly, one picture took 37 to 62 ms, and the trace
// named it: THE PULSE hands the well a new spectrum object every second, the whole song so far with its new frames, and the three tables below (keyed by
// the object) were summed again from frame 0 inside that picture: a dropped frame a second on every glass through a first play, longer as the song went
// on). Now an ear that grew out of the ear before it (the same track, fps, bands and offset, the same levels up to the earlier one's end) takes that
// ear's tables and sums its new frames alone: the same numbers, a few hundred frames a second instead of the song. The pirouette's sum keeps the rate
// its past was summed at (the pulse's beat estimate may drift: her council's turn no longer jumps with it).
// THE EAR BEFORE IT IS LET GO (Oct 13 2026 02:0x WEST, his "go fix this leak on lysa please": lysa's renderer grew 3.4 MB a second while a song played,
// 12.8 GB by 01:49, the kiosk reloaded by hand). LINEAGE held each ear's parent as the VALUE of a WeakMap entry, and a WeakMap keeps a value alive as
// long as its key lives: the newest ear lives in the well (its pulse), so every ear read since the song began lived on through the chain, each with its
// levels (frames x bands) and its three tables (means, coils, turns: ~4 MB an ear at 25,000 frames, one ear a second). Now an ear seen for the first
// time takes SEEDS: the TABLES of the newest ear of its line (LAST), never that ear; each table is grown from its seed the first time it is asked, and
// the seed is let go then. When the well drops an ear it goes, tables and all; LAST keeps the newest ear of the song on the air alone (an earlier song's
// go with it). The numbers are the same (GROWN, NOT RESUMMED, tested); what a glass holds is one ear's tables and, until grown from, one earlier ear's.
const SEEDS = new WeakMap(), LAST = new Map();   // ear -> {frames, means, coils, spins}: the tables of the ear it grew from (each null once grown from); `${track}|${live}` -> the newest ear seen
const keyOf = (ear) => (ear.track == null ? null : `${ear.track}|${ear.live ? 1 : 0}`);   // a study of the song and THE PULSE of it are two lines of growth (the pulse's bytes are never the study's)
function seedsOf(ear) {
  let s = SEEDS.get(ear); if (s) return s;
  const key = keyOf(ear), p = key == null ? null : LAST.get(key) ?? null; s = { frames: 0, means: null, coils: null, spins: null };
  if (p && p !== ear && p.fps === ear.fps && p.bands === ear.bands && (p.offset_ms || 0) === (ear.offset_ms || 0) && ear.frames >= p.frames && ear.levels.length >= p.frames * p.bands) {
    const n = p.frames * p.bands, A = ear.levels, Q = p.levels; let same = true; for (let i = 0; i < n; i++) if (A[i] !== Q[i]) { same = false; break; }
    if (same) s = { frames: p.frames, means: MEANS.get(p) ?? null, coils: COILS.get(p) ?? null, spins: SPINS_EAR.get(p) ?? null };   // its tables, never it
  }
  SEEDS.set(ear, s);
  if (key != null) { for (const k of LAST.keys()) if (k.slice(0, k.lastIndexOf('|')) !== String(ear.track)) LAST.delete(k); LAST.set(key, ear); }   // the song on the air alone is kept
  return s;
}
/** heldEars(): the ears this module holds of its own (LAST: the newest of each line of the song on the air); a test's eye on the leak. */
export const heldEars = () => [...LAST.values()];
const MEANS = new WeakMap();   // a song's spectrum -> its loudness a frame (the bands' mean, 0..1), once (grown from its seed: the ear before it's table)
const meansOf = (ear) => { let m = MEANS.get(ear); if (m) return m;
  const s = seedsOf(ear), pm = s.means, from = pm ? Math.min(s.frames, pm.length, ear.frames) : 0; m = new Float32Array(ear.frames); if (pm) m.set(pm.subarray(0, from)); s.means = null;
  for (let fr = from; fr < ear.frames; fr++) { let t = 0; for (let b = 0; b < ear.bands; b++) t += ear.levels[fr * ear.bands + b]; m[fr] = t / ear.bands / 63; } MEANS.set(ear, m); return m; };
/** loudAt(ear, ms): the song's loudness at its ms, 0..1: the bands' mean, up at once, down over DANCE.ear.loud_ms (her council's angular momentum). */
export function loudAt(ear, ms) {
  const m = meansOf(ear), d = 1000 / ear.fps, f = (ms - (ear.offset_ms || 0)) / d, i = Math.floor(f), k = DANCE.ear.loud_ms; if (!(i >= -1 && i < ear.frames)) return 0;
  let v = 0;
  for (let fr = Math.min(ear.frames - 1, i + 2), stop = Math.max(0, i - Math.ceil((3 * k) / d)); fr >= stop; fr--) { const u = m[fr] * standOf(ear, fr, f, d, k); if (u > v) v = u; }
  return v;
}
// THE COIL: each band's child on a damped spring (x'' + 2 zeta w x' + w^2 x = w^2 rest), pulled to the rest its level asks and thrown out by its hits. A
// pure function of the song: every frame's state is summed once a song, exactly (the spring's own solution over each 40 ms, its pull held), and a
// picture carries the frame's state on to its instant.
const COIL = Array.from({ length: SC.SEATS }, (_, b) => { const C = DANCE.ear.coil, w = 2 * Math.PI * C.hz[0] * Math.pow(C.hz[1] / C.hz[0], b / (SC.SEATS - 1)); return Object.freeze({ w, a: C.zeta * w, wd: w * Math.sqrt(1 - C.zeta * C.zeta) }); });
const COILS = new WeakMap();   // a song's spectrum -> every band's coil at the start of every frame: x its stretch, v its speed (the frame's kick in), u the rest it is pulled to
/** stretchOf(x, v, u, coil, t): a coil's stretch t seconds on from stretch x and speed v, pulled to u (the underdamped spring's own solution). */
export const stretchOf = (x, v, u, K, t) => { const e = x - u, E = Math.exp(-K.a * t); return u + E * (e * Math.cos(K.wd * t) + ((v + K.a * e) / K.wd) * Math.sin(K.wd * t)); };
const speedOf = (x, v, u, K, t) => { const e = x - u, E = Math.exp(-K.a * t); return E * (v * Math.cos(K.wd * t) - ((K.a * v + K.w * K.w * e) / K.wd) * Math.sin(K.wd * t)); };
function coilsOf(ear) {
  let T = COILS.get(ear); if (T) return T;
  const C = DANCE.ear.coil, B = ear.bands, n = ear.frames, t = 1 / ear.fps; T = { x: new Float32Array(n * B), v: new Float32Array(n * B), u: new Float32Array(n * B) };
  const s = seedsOf(ear), P = s.coils, from = P ? Math.min(s.frames, n) : 0; s.coils = null;   // GROWN: the frames summed for the ear before it stand (its tables, seeded; the ear itself is let go); each coil goes on from its last frame's state
  if (P) { T.x.set(P.x.subarray(0, from * B)); T.v.set(P.v.subarray(0, from * B)); T.u.set(P.u.subarray(0, from * B)); }
  for (let b = 0; b < B; b++) {
    const K = COIL[b]; let x = C.rest[0], v = 0;   // before the song, every child where silence holds it
    if (from > 0) { const o = (from - 1) * B + b; x = stretchOf(T.x[o], T.v[o], T.u[o], K, t); v = speedOf(T.x[o], T.v[o], T.u[o], K, t); }   // the state after the last frame summed before
    for (let fr = from; fr < n; fr++) {
      const u = C.rest[0] + (C.rest[1] - C.rest[0]) * Math.pow(ear.levels[fr * B + b] / 63, C.curve), o = fr * B + b;
      v += C.kick * K.w * riseOf(ear, fr, b); T.x[o] = x; T.v[o] = v; T.u[o] = u;   // a hit of its band throws it out
      const x1 = stretchOf(x, v, u, K, t); v = speedOf(x, v, u, K, t); x = x1;
    }
  }
  COILS.set(ear, T); return T;
}
/** coilsAt(ear, ms, out): every band's coil at the song's ms: how far its child stretches out from her, in shares of its distance (before the soft walls). */
export function coilsAt(ear, ms, out = new Float64Array(SC.SEATS)) {
  const T = coilsOf(ear), B = ear.bands, d = 1000 / ear.fps, f = (ms - (ear.offset_ms || 0)) / d, i = Math.min(ear.frames - 1, Math.floor(f));
  if (i < 0) return out.fill(DANCE.ear.coil.rest[0]);
  for (let b = 0; b < B; b++) { const o = i * B + b; out[b] = stretchOf(T.x[o], T.v[o], i === ear.frames - 1 && f > ear.frames ? DANCE.ear.coil.rest[0] : T.u[o], COIL[b], ((f - i) * d) / 1000); }
  return out;
}
/** softWall(y): the reach's soft walls: as it is near her rest, eased into DANCE.reach.range (never into her, never through the shaft). */
const softWall = (y) => { const R = DANCE.reach.range; return y >= 0 ? R[1] * Math.tanh(y / R[1]) : R[0] * Math.tanh(y / R[0]); };
/** pulseAt(clock, song): the song's sound at the clock's instant for the rest of her (the well: her liquid, her light): {bass: its three lowest bands, loud}, or
 *  null without its spectrum. */
export function pulseAt(clock, song) { const ear = earOf(song); if (!ear) return null; const ms = earMs(SC.normalClock(clock), ear), lv = levelsAt(ear, ms, PULSE); return { bass: (lv[0] + lv[1] + lv[2]) / 3, loud: loudAt(ear, ms) }; }
/** openEar(clock, on, song, hits): with the song's spectrum, how open each lantern stands: its band's onset (onsetsAt), or the twelve's surge on a drop (hits:
 *  hitsAt's, its drops alone with a spectrum), times the song's wakefulness on. */
export function openEar(clock, on, song, hits = null) {
  const out = new Float64Array(SC.SEATS), w = clamp01(on), ear = earOf(song); if (!(w > 0) || !ear) return out;
  const c = SC.normalClock(clock), ons = onsetsAt(ear, earMs(c, ear), ON), drop = openAt(c, 1, hits || hitsAt(c, song));
  for (let s = 0; s < SC.SEATS; s++) out[s] = w * Math.max(ons[bandOf(s)], drop[s]);
  return out;
}
/** gatherAt(song, now): before a drop of the song (its study) the twelve gather in to her, down to DANCE.reach.gather.share of their distance over the
 *  gather's beats, home again ON the drop (now: the song's beat). */
function gatherAt(song, now) {
  const R = DANCE.reach; let g = 0; if (!song || typeof song.drop !== 'function') return 0;
  for (let b = Math.ceil(now); b <= Math.floor(now + R.gather.beats); b++) if (song.drop(b)) { const x = now - b; if (x < 0) g = Math.min(g, R.gather.share * (x < -R.lead ? SC.smooth((x + R.gather.beats) / (R.gather.beats - R.lead)) : 1 - SC.smooth((x + R.lead) / R.lead))); }
  return g;
}
/** reachAt(clock, on, song, place): how far each of the twelve stands out from her at the clock's instant, in shares of its distance from her (0 on its
 *  wire's rest, DANCE.reach.range): the formation's breath by the song's intensity round now, the gathering before a drop, and the furthest reach among its
 *  own hits (the next DANCE.reach.lead beats and the last DANCE.reach.back: its voice's, the nine's on the one and on a drop, the fill's ripple), times the
 *  song's wakefulness on. Every seat is given; a child off its wire holds its place (the band's frame keeps it). place, turnAt: where they stand (seatsOf). */
export function reachAt(clock, on = 1, song = null, place = null, turnAt = null) {
  const out = new Float64Array(SC.SEATS), w = clamp01(on); if (!(w > 0)) return out;
  const c = SC.normalClock(clock), R = DANCE.reach, now = SC.beatsAt(c), ear = earOf(song), gather = gatherAt(song, now); let I = 0;
  if (ear) {   // THE EAR: each child on its band's coil (pulled by its level, thrown by its hits, ringing), gathered in before a drop
    const x = coilsAt(ear, earMs(c, ear), LV);   // THE COIL: each child on its band's spring
    for (let s = 0; s < SC.SEATS; s++) out[s] = w * softWall(x[bandOf(s)] + gather);
    return out;
  }
  eachHit(c, song, place, R.back, R.lead, (seats, b, h, k) => { const u = (h.all ? R.unison : num(h.slot) ? R.fill : R.voices[h.lane] * k) * reachOf(now - b); for (const s of seats) if (u > out[s]) out[s] = u; }, turnAt);
  if (song && typeof song.drop === 'function') for (let b = Math.ceil(now - R.back); b <= Math.floor(now + R.lead); b++) if (song.drop(b)) {   // a drop: out on it (in to her before it: gatherAt)
    const u = R.drop * reachOf(now - b); if (u > 0) for (let s = 0; s < SC.SEATS; s++) if (u > out[s]) out[s] = u;
  }
  for (let j = -R.span; j <= R.span; j++) I += intensityOf(song, now + j);   // the formation breathes: the song's intensity over the beats round now
  const breath = mix(R.breath, I / (2 * R.span + 1));
  for (let s = 0; s < SC.SEATS; s++) out[s] = w * Math.max(R.range[0], Math.min(R.range[1], breath + gather + out[s]));
  return out;
}
/** inertiaAt(clock, song): her council's moment of inertia about her vertical at the clock's instant, as a share of its at rest: the mean of (1 + reach)^2
 *  over the twelve (each child a like mass at its distance from her). */
export function inertiaAt(clock, song = null) { const r = reachAt(clock, 1, song); let I = 0; for (let s = 0; s < SC.SEATS; s++) I += (1 + r[s]) ** 2; return I / SC.SEATS; }
const SPINS = new WeakMap();   // a song's study (the well's feed: one object a song) -> its pirouette's turns at every step from DANCE.spin.from, grown as it plays
/** spinAt(clock, song): THE PIROUETTE: how far her council has turned about her vertical at the song's beat, in turns: the sum of L / I over the song, its
 *  angular momentum L (the song's intensity over the beats round now, DANCE.spin.turns a beat at its full) over its moment of inertia I (inertiaAt): the
 *  twelve gathered in, faster; reaching out, slower. A pure function of the song's beat (every glass turns her alike); 0 without a study. */
export function spinAt(clock, song = null) {
  if (!song || typeof song.I !== 'function') return 0;
  const c = SC.normalClock(clock), S = DANCE.spin, R = DANCE.reach, ear = earOf(song); if (ear) return spinEar(c, song, ear);
  const x = (SC.beatsAt(c) - S.from) * S.steps; if (!(x > 0)) return 0;
  let T = SPINS.get(song); if (!T) { T = [0]; SPINS.set(song, T); }
  while (T.length <= x + 1) {   // the next step, at the turn rate of its middle
    const m = S.from + (T.length - 0.5) / S.steps; let L = 0; for (let j = -R.span; j <= R.span; j++) L += intensityOf(song, m + j);
    T.push(T[T.length - 1] + (S.turns * L) / (2 * R.span + 1) / inertiaAt(SC.clockOf(c, c.epoch_ms + m * c.beat_ms), song) / S.steps);
  }
  const i = Math.floor(x); return T[i] + (T[i + 1] - T[i]) * (x - i);
}
/** turnOf(change, ms): THE PIROUETTE at an instant, in radians: a lookup of the band's last change {goal(ms), t0, off}, its offset fading over DANCE.spin.ease_ms */
export const turnOf = (c, ms) => c.goal(ms) + c.off * Math.exp(-Math.max(0, ms - c.t0) / DANCE.spin.ease_ms);

const SPINS_EAR = new WeakMap();   // a song's spectrum -> its pirouette's turns at every frame from the song's start (the whole song summed once)
/** spinEar(clock, song, ear): THE PIROUETTE heard: L the song's loudness (loudAt: DANCE.spin.turns a beat at its full), I the twelve's own as the ear reaches
 *  them (the mean of (1 + reach)^2), summed frame by frame; turns at the clock's instant. */
function spinEar(c, song, ear) {
  let T = SPINS_EAR.get(ear); const d = 1000 / ear.fps;
  if (!T) {
    const C = coilsOf(ear), B = ear.bands, rate = (DANCE.spin.turns * 1000) / c.beat_ms; T = new Float64Array(ear.frames + 1);   // rate: turns a second at full loudness, at rest
    const s = seedsOf(ear), P = s.spins, from = P ? Math.min(P.length - 1, s.frames, ear.frames) : 0; s.spins = null; if (P) T.set(P.subarray(0, from + 1));   // GROWN: the turns summed for the ear before it stand (seeded; the ear itself is let go)
    for (let fr = from; fr < ear.frames; fr++) {
      const ms = (ear.offset_ms || 0) + (fr + 0.5) * d, g = gatherAt(song, (ms - (num(ear.one_ms) ? ear.one_ms : 0)) / c.beat_ms); let I = 0;
      for (let s = 0; s < SC.SEATS; s++) { const b = bandOf(s), o = fr * B + b; I += (1 + softWall(stretchOf(C.x[o], C.v[o], C.u[o], COIL[b], d / 2000) + g)) ** 2; }   // each child on its coil at the frame's middle
      T[fr + 1] = T[fr] + ((rate * loudAt(ear, ms)) / (I / SC.SEATS)) * (d / 1000);
    }
    SPINS_EAR.set(ear, T);
  }
  const f = (earMs(c, ear) - (ear.offset_ms || 0)) / d, i = Math.floor(f);
  return i < 0 ? 0 : i >= ear.frames ? T[ear.frames] : T[i] + (T[i + 1] - T[i]) * (f - i);
}

/** swayAt(clock, on, song): her council's turn about her centre, {yaw, pitch, roll} in radians: a slow drift with no song; with one, a side each bar (a whole
 *  sway in DANCE.sway.bars, eased: a sine of the bars), a lean into it and a nod on the beat, as wide as the song is intense, by its wakefulness on. */
export function swayAt(clock, on = 0, song = null, place = null) {
  const c = SC.normalClock(clock), w = clamp01(on), b = SC.beatsAt(c), f = b - Math.floor(b), bars = SC.barsAt(c), D = DANCE.sway, R = DANCE.drift, k = intensityOf(song, b);
  const rb = place ? SC.barsAt(SC.normalClock(place)) : bars;   // THE DANCE CLOCK (his Oct 12 14:4x "still moving when i pause the music"): the drift keeps the place clock, which stops with the song
  const s = Math.sin((2 * Math.PI * bars) / D.bars);
  const rest = [R.yaw * Math.sin((2 * Math.PI * rb) / R.bars), 0, R.roll * Math.sin((2 * Math.PI * rb) / (R.bars * 1.375) + 1)], go = [mix(D.yaw, k) * s, mix(D.nod, k) * Math.pow(1 - f, 3), -mix(D.roll, k) * s];
  return { yaw: rest[0] + (go[0] - rest[0]) * w, pitch: rest[1] + (go[1] - rest[1]) * w, roll: rest[2] + (go[2] - rest[2]) * w };
}
function haloTexture(T) {   // a soft light with a hotter heart, white: the halo's colour is its instance's (its tone, its strength)
  const n = 64, d = new Uint8Array(n * n * 4);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const r = Math.hypot(x + 0.5 - n / 2, y + 0.5 - n / 2) / (n / 2), a = r >= 1 ? 0 : Math.pow(1 - r, 2.2) * (0.55 + 0.45 * Math.exp(-r * r * 18)), o = (y * n + x) * 4;
    d[o] = 255; d[o + 1] = 255; d[o + 2] = 255; d[o + 3] = Math.round(255 * a);
  }
  const t = new T.DataTexture(d, n, n); t.magFilter = T.LinearFilter; t.minFilter = T.LinearFilter; t.needsUpdate = true; return t;
}

/** mountBand(THREE, {sats, eyes}) -> {frame(clock, on, camera, song, place, flux, held), open, offsets, state(), dispose()}. sats: her satellites' InstancedMesh
 *  (lyssajudron.mjs: its geometry carries aLyTone, aLyEye, aLyPush, aLySpin and aLyOpen); eyes: her eye-stalks' (their discs: an eye's tiles stay shut round
 *  it). The cores and the halos go beside the satellites (the same parent, the same axes). frame() turns her council about her centre and every child in
 *  place for the clock's instant (alive with no song too), and with the song's wakefulness on (songOn) opens the twelve on their hits, reaches the nine out
 *  from her with their wires (THE TWELVE REACH; place: the clock that placed them on their wires, the dancers' own when none) and turns the halos to the
 *  camera; it answers whether the lanterns are lit. open and offsets (how far each child's centre moved, in her axes) are this picture's, for its council. held
 *  (THE HELD CORE): her body's held weights, k a seat (lyssajudron.mjs held(); null when none): a seat held open keeps its core lit, song or no song. */
export function mountBand(T, { sats, eyes = null, eyeSeats = SC.EYE_SEATS, scene = null } = {}) {
  let LAW = scene && typeof scene.spin === 'function' ? scene : null; if (!LAW && typeof scene?.then === 'function') scene.then((m) => { LAW = typeof m?.spin === 'function' ? m : null; }, () => {});   // THE BAND SPINS BY THE MODULE: the scene's spin door (scene-wasm.mjs), once it stands
  const g = sats?.geometry, A = (n) => g?.getAttribute?.(n), tone = A('aLyTone'), eye = A('aLyEye'), push = A('aLyPush'), spin = A('aLySpin'), open = A('aLyOpen');
  if (!tone || !eye || !push || !spin || !open) throw new Error('her satellites carry no lantern (aLyTone, aLyEye, aLyPush, aLySpin, aLyOpen)');
  const root = sats.parent ?? null, heart = root?.getObjectByName?.('unit0') ?? null;   // her council (the body's layer) and her body (bodyGroup): the sway turns the one about the other's centre
  const born = root ? { p: root.position.clone(), q: root.quaternion.clone() } : null;
  const tones = Array.from({ length: SC.SEATS }, (_, s) => new T.Color(toneOf(s)));   // linear, as the shader adds them
  tones.forEach((c, s) => tone.setXYZ(s, c.r, c.g, c.b)); tone.needsUpdate = true;
  if (!g.boundingSphere) g.computeBoundingSphere(); const R = g.boundingSphere?.radius > 0 ? g.boundingSphere.radius : SC.R_SAT;
  const tex = haloTexture(T);
  const cores = new T.InstancedMesh(new T.IcosahedronGeometry(R * 0.86, 1), new T.MeshBasicMaterial({ color: 0xffffff, toneMapped: false }), SC.SEATS);
  const halos = new T.InstancedMesh(new T.PlaneGeometry(1, 1), new T.MeshBasicMaterial({ map: tex, color: 0xffffff, transparent: true, blending: T.AdditiveBlending, depthWrite: false, toneMapped: false }), SC.SEATS);
  for (const m of [cores, halos]) { m.frustumCulled = false; m.raycast = () => {}; m.visible = false; m.instanceMatrix.setUsage(T.DynamicDrawUsage); m.setColorAt(0, new T.Color(0)); m.instanceColor.setUsage(T.DynamicDrawUsage); }
  cores.name = 'band-cores'; cores.renderOrder = 5; halos.name = 'band-halos'; halos.renderOrder = 7;
  halos.userData.glow = true;   // well-smoke.mjs's occlusion pass hides a glow as it hides a sprite (in its plain black a halo would be a square shadow)
  root?.add(cores, halos);
  const S0 = { on: 0, open: new Float64Array(SC.SEATS), offsets: new Float64Array(SC.SEATS * 3), reach: new Float64Array(SC.SEATS), turn: 0, change: null, inertia: 1, peak: 0, frames: 0, sway: null, moved: false, held: false };   // change: THE PIROUETTE's last cause (below)
  const M = new T.Matrix4(), Q = new T.Quaternion(), Qp = new T.Quaternion(), QR = new T.Quaternion(), QW = new T.Quaternion(), Qt = new T.Quaternion(), V = new T.Vector3(), V2 = new T.Vector3(), SZ = new T.Vector3(), C = new T.Color(), N = new T.Vector3();
  const E = new T.Euler(0, 0, 0, 'YXZ'), FREE = new Uint8Array(SC.SEATS), SCALE = new Float32Array(SC.SEATS);   // SCALE: each satellite's own size this picture (sizeOf: a placed unit1 is drawn s times its size, a gone one at 0): its core and its halo take it
  const sizeOf = (sm, s) => { const l = Math.hypot(sm[s * 16], sm[s * 16 + 1], sm[s * 16 + 2]); return Math.abs(l - 1) < 1e-6 ? 1 : l; };   // the instance matrix's first column: its size; 1 to the bit where the body drew it at 1 (the turn's float32 rounding aside), so THE TWELVE PLAY's cores and halos are as they were (three's decompose says 1 for a size of 0: not used)
  // HER WIRES STRETCH AND TURN: each gold wire (lyssajudron.mjs makeWires: a Line tagged with its lane, in a Group turned to its azimuth in her body) bends out
  // from her centre through its three satellites (at each of its points the reach eased from the satellite behind it along the wire to the one ahead,
  // smoothstep) and turns with her council's pirouette about her vertical
  const BENT = new WeakMap(), K3 = [{}, {}, {}];   // a wire's geometry -> {base: its points as the body drew them, at: each point's share of the wire's length, bent}
  function wiresOf() { const out = []; for (const o of heart?.children ?? []) { const l = o.children?.[0]; if (l?.isLine && Number.isInteger(l.userData?.lane)) out.push(l); } return out; }
  function unbend() { for (const l of wiresOf()) { const B = BENT.get(l.geometry); if (B?.bent) { const p = l.geometry.getAttribute('position'); p.array.set(B.base); p.needsUpdate = true; l.geometry.boundingSphere = null; B.bent = false; } } }
  function bend(reach, place, turn) {
    const pc = SC.normalClock(place), bars = SC.barsAt(pc), eb = SC.eyeBarsAt(pc), ct = Math.cos(turn), st = Math.sin(turn);
    for (const l of wiresOf()) {
      const pos = l.geometry.getAttribute('position'), a = pos.array, n = pos.count, lane = l.userData.lane; let B = BENT.get(l.geometry);
      if (!B) { const base = Float32Array.from(a), at = new Float64Array(n); for (let i = 1; i < n; i++) at[i] = at[i - 1] + Math.hypot(base[i * 3] - base[i * 3 - 3], base[i * 3 + 1] - base[i * 3 - 2], base[i * 3 + 2] - base[i * 3 - 1]); for (let i = 1; i < n; i++) at[i] /= at[n - 1]; B = { base, at, bent: false }; BENT.set(l.geometry, B); }
      for (let j = 0; j < 3; j++) { const s = lane + SC.LANES * j; K3[j].f = mod(SC.turnsOf(s, SC.EYE_SEATS.includes(s) ? eb : bars), 1); K3[j].r = reach[s]; }   // where its three stand along it (the score's satelliteAt) and how far each reaches
      K3.sort((x, y) => x.f - y.f);
      for (let i = 0; i < n; i++) {
        const f = B.at[i]; let k = 2; for (let j = 0; j < 3; j++) if (K3[j].f <= f) k = j;   // the satellite behind this point (before the first: the last, round the loop)
        const p = K3[k], q = K3[(k + 1) % 3], r = 1 + p.r + (q.r - p.r) * SC.smooth(mod(f - p.f, 1) / (mod(q.f - p.f, 1) || 1)), o = i * 3, bx = B.base[o] * r, bz = B.base[o + 2] * r;
        a[o] = bx * ct + bz * st; a[o + 1] = B.base[o + 1] * r; a[o + 2] = -bx * st + bz * ct;
      }
      pos.needsUpdate = true; l.geometry.boundingSphere = null; B.bent = true;
    }
  }
  // AN EYE'S DISC GOES WITH ITS SATELLITE: the body draws a disc at every sample; a disc still where the band left it was not drawn again (a sample skipped),
  // so the band's last move comes off it first and a disc never runs away
  const EYE_AT = new Float32Array(eyeSeats.length * 3).fill(NaN), EYE_BY = new Float64Array(eyeSeats.length * 3);
  function moveEyes(by) {   // by: every seat's offset (the offsets' layout), or null: home
    const em = eyes?.instanceMatrix?.array; if (!em) return;
    eyeSeats.forEach((s, e) => { const k = e * 16 + 12, b = e * 3; if (k + 2 >= em.length) return;
      if (em[k] === EYE_AT[b] && em[k + 1] === EYE_AT[b + 1] && em[k + 2] === EYE_AT[b + 2]) for (let d = 0; d < 3; d++) em[k + d] -= EYE_BY[b + d];
      for (let d = 0; d < 3; d++) { EYE_BY[b + d] = by ? by[s * 3 + d] : 0; em[k + d] += EYE_BY[b + d]; EYE_AT[b + d] = em[k + d]; } });
    eyes.instanceMatrix.needsUpdate = true;
  }
  // THE HELD CORE (the law is in the header): with no song the held cores are the band's one draw, written only when a held seat moves, grows or lets go
  const HOLD_AT = new Float32Array(SC.SEATS * 4).fill(NaN), HOLD_K = new Float32Array(SC.SEATS); let holdStale = true;   // what each held core was last written with (x, y, z, its size) and the hold it is lit by; stale after the song's own writes of every core
  function hold(hk) {   // hk: her body's held weights (k a seat, 0..1), or null: none held
    if (!hk) { if (S0.held) { S0.held = false; cores.visible = false; holdStale = true; HOLD_K.fill(0); } return; }
    const sm = sats.instanceMatrix.array; let dirty = false;
    for (let s = 0; s < SC.SEATS; s++) {
      const j = s * 16, o = s * 4, k = Math.fround(Math.max(0, Math.min(1, hk[s])) || 0), sc = k > 0 ? SCALE[s] : 0, x = sm[j + 12], y = sm[j + 13], z = sm[j + 14];
      if (!holdStale && HOLD_AT[o] === x && HOLD_AT[o + 1] === y && HOLD_AT[o + 2] === z && HOLD_AT[o + 3] === sc && HOLD_K[s] === k) continue;
      HOLD_AT[o] = x; HOLD_AT[o + 1] = y; HOLD_AT[o + 2] = z; HOLD_AT[o + 3] = sc; HOLD_K[s] = k; dirty = true;
      cores.setMatrixAt(s, M.makeScale(sc, sc, sc).setPosition(x, y, z)); cores.setColorAt(s, C.copy(tones[s]).multiplyScalar(BAND.held * k));   // at its satellite, at its size, its tone by its hold; a seat not held: no core (size 0)
    }
    holdStale = false;
    if (dirty) { cores.instanceMatrix.needsUpdate = true; cores.instanceColor.needsUpdate = true; }
    if (!S0.held) { S0.held = true; cores.visible = true; }
  }
  function shut() { open.array.fill(0); open.needsUpdate = true; push.array.fill(0); push.needsUpdate = true; cores.visible = false; halos.visible = false; unbend(); moveEyes(null); S0.open = new Float64Array(SC.SEATS); S0.offsets = new Float64Array(SC.SEATS * 3); S0.reach = new Float64Array(SC.SEATS); S0.inertia = 1; S0.peak = 0; S0.moved = false; S0.held = false; holdStale = true; }   // the song's lights off (a held core is lit again by hold(), after)
  function frame(c, on, camera = null, song = null, place = null, flux = null, held = null) {   // song: the well's study of the song on the air (null: a calm song); place: the clock that placed her twelve (the well's house clock); flux: her ferrofluid's pull on them (lyssajudron-ferro.mjs fluxAt); held: her body's held weights, k a seat (lyssajudron.mjs held(); null: none held): THE HELD CORE
    if (!c) return false;
    S0.on = clamp01(on); const w = S0.on > 0.002 ? S0.on : 0, cc = SC.normalClock(c), pc = place ? SC.normalClock(place) : cc;
    const turnAt = w > 0 && song && typeof song.I === 'function' ? (ms) => TAU * spinAt(SC.clockOf(cc, ms), song) : null;   // THE PIROUETTE: her council's turn at an instant, the song's (radians)
    const hs = w > 0 ? hitsAt(cc, song, pc, turnAt) : null; S0.I = intensityOf(song, SC.beatsAt(cc));
    // HER COUNCIL SWAYS: the layer turns about her centre, which stays where it stood (the layer moves by her centre less its turned self)
    if (root && heart && born) {
      const sw = swayAt(cc, w, song, pc); S0.sway = sw; Qt.setFromEuler(E.set(sw.pitch, sw.yaw, sw.roll, 'YXZ')); root.quaternion.copy(born.q).multiply(Qt);   // the drift on the place clock (THE DANCE CLOCK: still while the song is)
      V.copy(heart.position); V2.copy(V).applyQuaternion(Qt); root.position.copy(V.sub(V2).applyQuaternion(born.q)).add(born.p);
    }
    // EVERY CHILD TURNS IN PLACE, BY THE MODULE (THE BAND SPINS BY THE MODULE, Nov 5 2026: embertide-scene band.rs, scene_spin): its tumble on the place clock (THE DANCE CLOCK: still
    // while the song is), its twirl about her vertical on its newest hit (the hits, the song's intensity and its wakefulness are this page's: the module reads no study), in her axes; carried into its own for the shader
    const qw = LAW ? LAW.spin(pc.now_ms, hs, cc.beat_ms, S0.I, w) : null, sm = sats.instanceMatrix.array;   // no module yet: no turn
    for (let s = 0; s < SC.SEATS; s++) {
      M.fromArray(sm, s * 16).decompose(V, QR, SZ); SCALE[s] = sizeOf(sm, s);
      if (qw) QW.fromArray(qw, s * 4); else QW.identity();
      Q.copy(QR).invert().multiply(QW).multiply(QR); spin.setXYZW(s, Q.x, Q.y, Q.z, Q.w);
    }
    spin.needsUpdate = true; S0.frames++;
    // THE PIROUETTE as this glass shows it, a lookup of its last change (turnOf; THE PIXEL IS A LOOKUP, his Nov 1 2026 "none of this shit is autoregressive in any meaningful way")
    const grid = turnAt ? `${cc.epoch_ms}|${cc.beat_ms}|${cc.beats_per_bar}` : '', key = turnAt ? song : null, goal = turnAt || (() => 0), t0 = cc.now_ms;   // a change: the song's study, its clock's grid, its wake or rest, first seen at t0
    if (!S0.change || S0.change.key !== key || S0.change.grid !== grid) S0.change = { key, grid, goal, t0, off: SC.wrap((S0.change ? turnOf(S0.change, t0) : goal(t0)) - goal(t0)) };   // set on a cause, read every picture
    S0.turn = turnOf(S0.change, cc.now_ms);
    let hk = null; if (held && held.length >= SC.SEATS) for (let s = 0; s < SC.SEATS; s++) if (held[s] > 0) { hk = held; break; }   // THE HELD CORE: the seats her body holds open, by how much; null when none is (a weight of 0 on every seat is none: nothing at rest)
    if (!hs && Math.abs(SC.wrap(S0.turn)) < 1e-3) { S0.turn = 0; if (S0.moved || S0.peak > 0 || (cores.visible && !S0.held)) shut(); hold(hk); return false; }   // no song, home: alive, nothing lit but a held core, nothing moved
    const o = earOf(song) ? openEar(cc, w, song, hs) : openAt(cc, w, hs), rc = reachAt(cc, w, song, pc, turnAt), hp = heart?.position ?? null, yaw = heart?.rotation?.y ?? 0, turn = S0.turn + (flux ? flux.turn : 0), ct = Math.cos(turn), st = Math.sin(turn);   // HER FLUX (the ferrofluid seat's fluxAt, his 12:4x): her liquid's surge whips the twelve round her a little
    // A CHILD OFF ITS WIRE HOLDS ITS PLACE (an eye on its stalk looking at him, a child carrying a card): only a child where the score has it reaches and turns
    let inertia = 0;
    for (let s = 0; s < SC.SEATS; s++) { const j = s * 16, q = hp ? SC.worldOf(SC.satelliteAt(s, pc), [hp.x, hp.y, hp.z], yaw) : null; FREE[s] = q && Math.hypot(sm[j + 12] - q[0], sm[j + 13] - q[1], sm[j + 14] - q[2]) < 0.02 ? 1 : 0; if (!FREE[s]) rc[s] = 0; else if (flux) rc[s] = Math.max(DANCE.reach.range[0], Math.min(DANCE.reach.range[1], rc[s] + flux.out[s])); inertia += (1 + rc[s]) ** 2; }   // and flings them out along it
    S0.inertia = inertia / SC.SEATS;
    if (camera?.getWorldQuaternion) camera.getWorldQuaternion(Q); else Q.identity();
    if (root?.getWorldQuaternion) { root.getWorldQuaternion(Qp); Q.premultiply(Qp.invert()); }   // the halos face the eye: its turn in the satellites' axes
    const em = eyes?.instanceMatrix?.array ?? null; let peak = 0;
    for (let s = 0; s < SC.SEATS; s++) {
      const j = s * 16, e = eyeSeats.indexOf(s), u = Math.max(0, o[s]), kh = hk ? Math.fround(Math.max(0, Math.min(1, hk[s])) || 0) : 0, sc = SCALE[s]; if (u > peak) peak = u; HOLD_K[s] = kh;
      if (e >= 0 && em) {   // the eye's disc faces its own +z: that direction in its satellite's axes (its matrix's columns, no scale), where its tiles stay shut
        const k = e * 16; N.set(em[k + 8], em[k + 9], em[k + 10]).normalize();
        eye.setXYZW(s, sm[j] * N.x + sm[j + 1] * N.y + sm[j + 2] * N.z, sm[j + 4] * N.x + sm[j + 5] * N.y + sm[j + 6] * N.z, sm[j + 8] * N.x + sm[j + 9] * N.y + sm[j + 10] * N.z, 1);
      }
      open.setX(s, o[s]);
      let x = sm[j + 12], y = sm[j + 13], z = sm[j + 14], ox = 0, oy = 0, oz = 0;
      if (FREE[s]) {   // THE TWELVE REACH and THE PIROUETTE: out from her centre by its reach and round her vertical by her council's turn, in its own axes for the shader; its core, its halo, its council and an eye's disc ride it
        const dx = x - hp.x, dy = y - hp.y, dz = z - hp.z, g = 1 + rc[s];
        ox = (dx * ct + dz * st) * g - dx; oy = dy * g - dy; oz = (-dx * st + dz * ct) * g - dz; const L = Math.hypot(ox, oy, oz);
        if (L > 1e-9) push.setXYZW(s, (sm[j] * ox + sm[j + 1] * oy + sm[j + 2] * oz) / L, (sm[j + 4] * ox + sm[j + 5] * oy + sm[j + 6] * oz) / L, (sm[j + 8] * ox + sm[j + 9] * oy + sm[j + 10] * oz) / L, L); else push.setXYZW(s, 0, 0, 0, 0);
        x += ox; y += oy; z += oz;
      } else push.setXYZW(s, 0, 0, 0, 0);
      S0.offsets[s * 3] = ox; S0.offsets[s * 3 + 1] = oy; S0.offsets[s * 3 + 2] = oz;
      cores.setMatrixAt(s, M.makeScale(sc, sc, sc).setPosition(x, y, z)); cores.setColorAt(s, C.copy(tones[s]).multiplyScalar(Math.max(BAND.core[0] + BAND.core[1] * u, BAND.held * kh)));   // at its satellite's size; THE HELD CORE: a held seat's core no dimmer than its hold (none held: as it was, to the bit)
      const size = R * sc * (BAND.halo[0] + BAND.halo[1] * u); M.compose(V.set(x, y, z), Q, SZ.set(size, size, 1)); halos.setMatrixAt(s, M); halos.setColorAt(s, C.copy(tones[s]).multiplyScalar(BAND.halo[2] * u));
    }
    open.needsUpdate = true; eye.needsUpdate = true; push.needsUpdate = true;
    cores.instanceMatrix.needsUpdate = true; cores.instanceColor.needsUpdate = true; halos.instanceMatrix.needsUpdate = true; halos.instanceColor.needsUpdate = true;
    moveEyes(S0.offsets);   // the eyes' discs with their satellites
    if (heart) bend(rc, pc, turn);   // HER WIRES STRETCH AND TURN through them
    cores.visible = !!hs || !!hk; halos.visible = !!hs; S0.held = !!hk; holdStale = true; S0.open = o; S0.reach = rc; S0.peak = peak; S0.moved = true;   // THE HELD CORE stays lit while the band eases home after a song; this picture wrote every core: the held cores' own writes are stale
    return !!hs;
  }
  const r3 = (v) => Math.round(v * 1000) / 1000;
  return {
    cores, halos, frame,
    get open() { return S0.open; }, get offsets() { return S0.offsets; },
    state: () => ({ on: r3(S0.on), open: Array.from(S0.open, r3), reach: Array.from(S0.reach, r3), turn: r3(S0.turn), inertia: r3(S0.inertia), peak: r3(S0.peak), frames: S0.frames, shown: cores.visible, held: S0.held ? Array.from(HOLD_K, r3) : null, sway: S0.sway ? { yaw: r3(S0.sway.yaw), pitch: r3(S0.sway.pitch), roll: r3(S0.sway.roll) } : null }),
    dispose() { shut(); spin.array.fill(0); spin.needsUpdate = true; if (root && born) { root.position.copy(born.p); root.quaternion.copy(born.q); } for (const m of [cores, halos]) { m.parent?.remove(m); m.geometry.dispose(); m.material.dispose(); m.dispose?.(); } tex.dispose(); },
  };
}

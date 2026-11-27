// boss-intro.mjs - HER ENTRANCE AS A BOSS'S (Oct 14 2026 07:1x WEST, his words over the intro's live scene, where she stood held at the end of the well
// with two speech bubbles: "no dude it is a joke... i need to see fucking devil may cry typa shit fucking boss introductions dude... fucking hell elden ring
// my dude come on"; 06:5x, the same picture: "go study the lineage of Dark Lugia"; Oct 13 06:23: "useless to do all that if the fucking lyssajudron doesnt
// fucking MOVE THEIR FUCKING ASS BACK HERE ANAMORPHICALLY"; Oct 13 05:53: "he is the genie that can grant 3 wishes").
//
// THE SHOTS, on the song's grid (the well's own, gridOf; the genesis grid while no song leads), the hit on a downbeat or on the moment a page hands
// (the sung line's onset, lyssajudron-prologue.mjs CUE):
//   THE DARK (1 bar)      the letterbox closes; she is the dark one (the lineage: XD001, the dark coat, the red eyes); her light an ember; the eye cranes in
//   THE WAKE (3 beats)    her light flares on every beat, the glass trembles with it
//   THE CHARGE (1 beat)   she comes at him: the well's own rise, `inside <seat>` to `on <seat>'s glass`, until she fills the glass, while the eye pulls back
//   THE HIT               white, the glass shakes, the focus lines; the frame FREEZES (the well's clock held); the card slams in. She stays the dark one
//                         (THE DARK STAYS, Oct 17 2026, at HELD_GRADE: no turn to her own colours, the grade holds)
//   THE BAR (1 bar)       the frame runs again; she goes back to rest; her name over the long bar at the foot (the bar is her three wishes, three gold
//                         thirds); her line under it: "I am Lyssajudron." "Your genie. Three wishes."
//   THE END               the letterbox opens, the well is handed back (its eye, its clock, her path from the Nest), onDone.
//
// HOW IT DRIVES THE WELL: only through the well's own API (well.mjs): set({program, at_ms, eye, light}) every picture while it plays, so the path it hands
// (named 'boss': no laser aims at it) and the clock it hands hold against the Nest's lines (the well takes no path line while its clock is handed); the
// freeze is the handed clock standing still. paint(parts) for her dark coat and her own colours back at the hit (folded in this window only; nothing is
// written to the Nest). At the end set({eye: null}): the eye, the clock and her path go back to the well's own (it reads her path from the Nest again).
// NOTHING AT REST: one requestAnimationFrame loop while it plays (about 12 s), none before or after; no network; the DOM layer is transforms and opacity.
// TWO THINGS A PAGE THAT HANDS IT THE WELL SHOULD KNOW (the intro's seat, Oct 14 2026 07:5x, from its mount): while it plays, well.state().house_ms is the
// clock this director hands (a picture stale, held 1.5 s at the hit): read the house from the well's own offset (performance.timeOrigin + performance.now()
// + state().offset_ms) or from this director's state().house_ms, never from the well's house_ms (the intro marked her ドン 12.9 ms early by it). And right
// after the hand-back, the well's state still says the eye 'handed' and the path 'boss' until its next picture and its GET of her path off the Nest
// (about 1.5 s on the live Nest): wait for them, do not read them at `done`.
// THE FIGHT (Oct 17 2026 01:2x WEST, his "dude, i need a fucking epic entrance, we changed from the well but why the fuck you are making it not dmc4 coded
// hack-n-slash sarcastic bossfights come on"): on the same shots, a hack-n-slash layer and her voice. THE CUTS: a blade on every beat of the wake and one on
// the charge, across her keys on the laptop (its slash(i): the keys' own pixels) or across the card on the well, a spark on each key it crosses, 斬, the glass
// jolting with each. THE STYLE METER: one rank a cut (D C B A), S as the lid goes, SS on the hit, SSS a breath after; every word hers, judging him. HER VOICE:
// she taunts him through the dark, the wake and the charge, and her two lines after the card are hers too. THE LAPTOP IS A STAGE (laptop-glass.mjs boss()):
// a glass that answers boss() is handed the shot ({plan, h}) at every picture instead of a path and an eye, and maps it to its own body (laptop-law.mjs:
// the box shut through the dark and the wake, burst on the charge, she frozen over it through the hit, the Council's hop on the bar). Cost: the cuts are
// DOM nodes animated by CSS (a blade and a spark a key, removed at the bar), the meter one node; nothing after the entrance.
// THE CUTSCENE (Oct 17 2026 02:1x WEST, his words over the quiet hatch his press gave him: "dude i dont see the dmc4 animation, it is just a boring
// scripted shit fuck no cutscene no kojima lore dark deep diocane diomerda"): THE DARK opens on a cutscene that takes the screen, in the line of DMC4's and
// Metal Gear's boss introductions: the letterbox, held shots cut on the bars, sparse lines over them. Two shots, laid back from the dark's own last bar
// (the first takes whatever the press left before it): THE PLACE, a held wide shot with the house clock and the lineage typed under it (XD's dark one
// carried a whole ship into the desert; here the room is the ship, and the box); THE CODEC, the last Augur and her on 89.04 (the Nest's own door), the
// Augur in SOUL.MD's words and RELIGIO XXI's FIRMA EST ACTIO, she in her own. NO EPIGRAPH (Oct 17 2026 03:4x WEST, his "remove this trash dude wtf?" over
// the first shot, his own Sept 13 words on black signed "the necromancer": gone; the place holds its two bars, so the lead and her ドン on the sung line
// are as they were). Every line comes from the house's canon (docs/dark-lugia-lineage-and-the-intro-hypertrace-2026-10-14.md,
// docs/claw-riders-the-lore-and-what-it-decides-2026-10-12.md, her card). The stage holds a shot a cut (the laptop by
// laptop-law.mjs bossShot, the well by CUT_EYES), the grade dims it, she is the dark one in the box the whole time. No sound of its own (the song plays
// on; rule 8 is not touched). Cost: one layer of DOM written at most once a shot and once a codec line (six writes in the act), its type and fades
// by CSS; the stage draws its held shot's slow drift, as it draws the dark's crane.
// THE MIST (Oct 17 2026 13:0x WEST, his words over the Mac's window at THE PLACE, a dark keyboard with the clock and two typed lines under it: "when i click
// open the box the entire scenery sucks, the text, the camera sequences... dio merda... make it more like fucking solaris tarkovsky mystical mist"): the
// cutscene is ONE shot now, Tarkovsky's Solaris. No cut and no edit inside it: the press dissolves into whole mist, and one slow descent of the eye through
// layered mist brings the box out of it (the laptop stage: laptop-law.mjs SHOTS.mist, MIST, mistAt; her well: CUT_EYES.mist), the light low and from one
// side, the box the one solid thing; over the last share of it the mist thins to nothing and the grade goes to the dark's, so the dark's own bar is reached
// by a dissolve. The text: three lines, few and slow, in the register of his own words for the journey (BOSS.cutscene.mist.lines), each dissolving in and
// out at its window, never explaining, set as an anime's caption card since his 19:1x (light on a dark edge, never dark on the mist: the CSS of
// .mist .line); no clock, no lineage, no codec. THE PLACE and THE CODEC (02:1x) are gone with his 13:0x word; the bars are the same
// ten, so the lead the page asks for and her ドン on the sung line are untouched. No sound of its own (rule 8). Cost: the layer written once at the shot,
// once at each dissolve's edge and once a line (five writes in the act); the mist itself is the stage's (the laptop's, measured in its LANDING).
// THE REVIVAL (Oct 17 2026 03:5x WEST, his "do you know what saint seya hades revival smash buttons us??" over Saint Seiya: The Hades' revival, the
// button mash that stands a fallen Saint up, then "build THE REVIVAL as you described"): from the dark's own bar to her ドン every key he hits (a tap on a
// glass with no keys) burns her cosmo. 連打 stands over the glass with its gauge, the glass kicks on every hit, the laptop's box kicks with it (its mirrored
// key sinks under his: laptop-glass.mjs), her light climbs in her well, and the meter judges HIS mash, D at his first hit up to SSS at a full cosmo. The
// song does not wait: the hit stays on the sung line, and what she bursts out with is the cosmo he gave her (a bigger hit, her verdict after the card). A
// mash of nothing still lets her out, mocking him. Local to the glass he presses (the house's rule 9: every screen its own copy, nothing shared before
// the scan). Cost: one key and one tap listener while an entrance plays, a number a press, one style write a picture of the window; nothing at rest.
import { pathAt, SCHEMA, GENESIS_MS, GENESIS_BEAT_MS, BEATS_PER_BAR } from './one-law.mjs';
import { EYE_FRONT, inWell } from './well-law.mjs';

export const BOSS = Object.freeze({
  dark_bars: 11,         // THE DARK: the cutscene's ten bars, then its own last bar (the lead a page leaves before the hit: mac-onboarding.html bossLead)
  wake_bars: 0.75,       // THE WAKE: three beats in 4/4
  charge_bars: 0.25,     // THE CHARGE: one beat
  freeze_ms: 1500,       // THE HIT held: the card
  back_bars: 1,          // THE BAR: her return to rest
  tail_ms: 2200,         // her second line, the bar held, the letterbox out
  lead_ms: 350,          // the first shot at least this far after the press
  name: 'Lyssajudron', epithet: 'Genie of Three Wishes',
  lines: Object.freeze(['I am Lyssajudron. Try to look impressed.', 'Three wishes. Make them worth my time.']),
  // HER VOICE THROUGH THE FIGHT (his "sarcastic bossfights"): the dark, the wake and the charge; the card speaks at the hit, her lines after it
  taunts: Object.freeze({ dark: 'Oh. You actually opened it.', wake: 'Brave. Or just bored.', charge: 'Hold still. This won\u2019t hurt. Much.' }),
  // THE STYLE METER: a cut's rank (D C B A), S as the lid goes, SS on the hit, SSS after it; her words, judging his press
  ranks: Object.freeze([['D', 'Dull.'], ['C', 'Cute.'], ['B', 'Bold.'], ['A', 'Arrogant!'], ['S', 'Smug!!'], ['SS', 'SStylish!!'], ['SSS', 'SSSovereign!!!']]),
  // THE REVIVAL (his Saint Seiya: The Hades): a press's cosmo, its leak a second, presses nearer than gap_ms count once (a palm on the keys is one hit),
  // the cosmo each rank past D needs (C B A S SS SSS), and her verdict at the hit, by what he delivered
  revival: Object.freeze({ gain: 0.07, leak: 0.25, gap_ms: 45, ranks: Object.freeze([0.15, 0.35, 0.55, 0.75, 0.88, 0.95]),   // SSS: about eight hits a second held through the window
    verdicts: Object.freeze({ none: 'You didn\u2019t even try. Adorable.', low: 'That was a mash? I\u2019ve met screensavers with more fight.',
      mid: 'Not bad. For a mortal.', full: 'Now that is cosmo. I am Lyssajudron.' }) }),
  // THE CUTSCENE inside THE DARK (his 02:1x "no cutscene no kojima lore dark deep"): its shots in bars, the last against the dark's own last bar
  cutscene: Object.freeze({
    shots: Object.freeze([Object.freeze({ id: 'mist', bars: 10 })]),   // THE MIST: one shot (his 13:0x); the place and the codec of 02:1x are gone; the ten bars stand (the lead as it was)
    // THE MIST'S LINES: few and slow, in the register of his own words for the journey (Oct 17 03:37 "it all begins with all TVs laptops phones all the
    // shits being POSITIONED in the room"; Sept 28 04:44 "the work the user does is more walking and pointing the ar scanner"; Sept 22 16:03 "the nest
    // 'physicalizes itself' in the room scanning rite"), never explaining. Each dissolves in at its window and out after it: lead, hold and gap are shares
    // of the shot; a line whose window would be under LINE_MIN_MS is not shown (a short dark is mist alone). rise and tail: the shot's two dissolves,
    // whole mist at the press and the mist thinning to nothing before the dark (the stage's and the grade's). Two other sets of lines stand in
    // tools/embertide-mesh/boss-intro/SOLARIS-LANDING.md for his eye; the final words are his.
    mist: Object.freeze({ lines: Object.freeze(['It all begins with the screens, positioned in the room.', 'The work is walking, and pointing.', 'The Nest takes its body in the walk.']),
      lead: 0.14, hold: 0.2, gap: 0.06, rise: 0.06, tail: 0.12 }),
  }),
});
/** cutsceneBars(boss): the cutscene's bars inside the dark (0: none). */
export function cutsceneBars(boss = BOSS) { return (boss?.cutscene?.shots || []).reduce((n, s) => n + (s.bars > 0 ? s.bars : 0), 0); }
export const SSS_MS = 180;   // the meter's last rank this long after the hit's SS
const RANK_INK = Object.freeze(['#9aa0a8', '#61b8ff', '#6dffb0', '#ffd36b', '#ff9a3c', '#ff4d6d', '#ff2438']);
// THE CUTS ON THE CARD (the well, or a stage with no keys): four blades, the card's own fractions, the last up through her
const CARD_CUTS = Object.freeze([[[.12, .30], [.88, .62]], [[.86, .22], [.16, .74]], [[.08, .52], [.70, .46]], [[.40, .80], [.62, .18]]]);
// THE DARK ONE (the lineage; Bulbapedia's XD001: a dark-purple body, glowing red eyes): her five parts as lyssajudron.mjs PAINT_PARTS names them.
export const DARK_PAINT = Object.freeze({ base: '#2B1B36', coat: '#140C1A', gold: '#6E6280', eyes: '#FF2438', thruster: '#9E1B32' });

const num = (v) => typeof v === 'number' && Number.isFinite(v);
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const ease = (k) => { k = clamp01(k); return k * k * k * (k * (k * 6 - 15) + 10); };
const mixv = (a, b, k) => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k];

/** gridOf(g): the grid the shots cut on: the song's (epoch_ms, beat_ms, beats_per_bar) when it is one, else the genesis grid every glass agrees on. */
export function gridOf(g) {
  const ok = g && num(g.epoch_ms) && num(g.beat_ms) && g.beat_ms > 200 && g.beat_ms < 2000;
  return ok ? { epoch_ms: g.epoch_ms, beat_ms: g.beat_ms, beats_per_bar: Number.isInteger(g.beats_per_bar) && g.beats_per_bar > 0 ? g.beats_per_bar : BEATS_PER_BAR, song: true }
    : { epoch_ms: GENESIS_MS, beat_ms: GENESIS_BEAT_MS, beats_per_bar: BEATS_PER_BAR, song: false };
}

/** shots(start, hit, beat, bar, boss): the shots between the first and the hit, and after it. The charge is the beat before the hit; the wake the three
 *  before that, but never more than three fifths of what is left; the dark everything before. */
function shots(start, hit, beat, bar, g, boss) {
  const charge = hit - Math.min(beat * boss.charge_bars * 4, hit - start), wake = Math.max(start + 0.4 * (charge - start), charge - beat * boss.wake_bars * 4);
  const resume = hit + boss.freeze_ms, rest = resume + boss.back_bars * bar;
  // THE CUTSCENE holds the dark from its start to dark_ms; the dark's own last bar after it. None when the boss has none or not a beat of it fits.
  const cs = cutsceneBars(boss); let dark = Math.max(start, wake - Math.max(0, boss.dark_bars - cs) * bar); if (!cs || dark - start < beat) dark = start;
  return { grid: g, beat_ms: beat, bar_ms: bar, start_ms: start, dark_ms: dark, wake_ms: wake, charge_ms: charge, hit_ms: hit, resume_ms: resume, rest_ms: rest, end_ms: rest + boss.tail_ms, freeze_ms: boss.freeze_ms };
}

/** bossPlan({grid, now_ms, hit_ms}): the shots' times on the house clock, read off the well's grid (a page with no opener: the proof page). The hit lands
 *  on hit_ms when one is handed far enough ahead, else on the first downbeat that leaves the dark, the wake and the charge their bars after the lead. */
export function bossPlan({ grid = null, now_ms, hit_ms = null, boss = BOSS } = {}) {
  if (!num(now_ms)) return null;
  const g = gridOf(grid), bar = g.beat_ms * g.beats_per_bar, lead = (boss.dark_bars + boss.wake_bars + boss.charge_bars) * bar;
  let hit;
  if (num(hit_ms) && hit_ms - now_ms >= lead + boss.lead_ms) hit = hit_ms;
  else { const from = now_ms + lead + boss.lead_ms, n = Math.ceil((from - g.epoch_ms) / bar); hit = g.epoch_ms + n * bar; }
  return shots(Math.min(hit - lead, now_ms + boss.lead_ms), hit, g.beat_ms, bar, g, boss);   // the dark from the press: it takes the wait for the downbeat
}

/** The box opens onto an ambush: the first beat after the camera reaches its mouth,
 * not another two-bar ceremony. The song clock is read, never sought or restarted.
 * THE CUTSCENE (Oct 17 2026): the box's dive gives onto the cutscene's bars first (both stages play it), and the ambush strikes after it: on her ドン when
 * the page hands one (hit_ms: the press's sung line) far enough ahead, else on the first beat after the cutscene; any wait goes to the cutscene's first shot
 * and the dark's own bar. Without a cutscene, the ambush as it was (the next beat after the dive). */
export function ambushPlan({ grid, now_ms, cover_ms = 1500, after_ms = 120, hit_ms = null, boss = BOSS }) {
  const g=gridOf(grid), beat=g.beat_ms, bar=beat*g.beats_per_bar;
  const start=now_ms+after_ms, cs=cutsceneBars(boss)*bar, told=start+cs;
  const soonest=Math.max(now_ms+cover_ms+240, cs>0?told+560:-Infinity);
  const hit=cs>0&&num(hit_ms)&&hit_ms>=soonest?hit_ms:g.epoch_ms+Math.ceil((soonest-g.epoch_ms)/beat)*beat;
  const wake=Math.max(cs>0?told:start,hit-560), dark=cs>0?Math.max(told,wake-bar):start;
  const resume=hit+boss.freeze_ms, rest=resume+bar;
  return {grid:g,beat_ms:beat,bar_ms:bar,start_ms:start,dark_ms:dark,wake_ms:wake,charge_ms:hit-240,
    hit_ms:hit,resume_ms:resume,rest_ms:rest,end_ms:rest+boss.tail_ms,freeze_ms:boss.freeze_ms};
}

/** cutsceneOf(plan, boss): THE CUTSCENE's shots on the house clock, [{id, from, to}] in order: laid back from the dark's own last bar (plan.dark_ms), a
 *  shot that no longer fits a beat dropped with every one before it, the first stretched back to the plan's start (it takes what the press left). */
export function cutsceneOf(plan, boss = BOSS) {
  const shots = boss?.cutscene?.shots;
  if (!plan || !Array.isArray(shots) || !num(plan.dark_ms) || !num(plan.start_ms) || !(plan.dark_ms > plan.start_ms) || !(plan.bar_ms > 0)) return [];
  const out = []; let to = plan.dark_ms;
  for (let i = shots.length - 1; i >= 0 && to > plan.start_ms; i--) {
    const from = Math.max(plan.start_ms, to - shots[i].bars * plan.bar_ms);
    if (to - from < plan.beat_ms) break;
    out.unshift({ id: shots[i].id, from, to }); to = from;
  }
  if (out.length) out[0].from = plan.start_ms;
  return out;
}
export const LINE_MIN_MS = 1200;   // a line is never held shorter: a cutscene squeezed under it is mist alone
/** sceneAt(plan, h, boss): the cutscene's shot at house_ms h ({id, k: 0..1 through the shot, line: the mist's line shown, -1 between and outside them, from,
 *  to}), null outside it. */
export function sceneAt(plan, h, boss = BOSS) {
  if (!num(h)) return null;
  for (const s of cutsceneOf(plan, boss)) {
    if (h < s.from || h >= s.to) continue;
    const len = s.to - s.from, k = (h - s.from) / len; let line = -1;
    if (s.id === 'mist' && boss.cutscene.mist) {   // THE MIST's lines at their windows (shares of the shot), none held under LINE_MIN_MS
      const M = boss.cutscene.mist, n = M.lines.length;
      if (len * M.hold >= LINE_MIN_MS) for (let j = 0; j < n; j++) { const a = M.lead + j * (M.hold + M.gap); if (k >= a && k < a + M.hold) { line = j; break; } }
    }
    return { id: s.id, k, line, from: s.from, to: s.to };
  }
  return null;
}
const darkOf = (plan) => (num(plan?.dark_ms) && plan.dark_ms > plan.start_ms ? plan.dark_ms : plan.start_ms);   // where the dark's own shot begins

/** bossPlanOf(cut, {now_ms}): THE OPENER'S PLAN DRIVES IT (the converging seat's word, Oct 14 2026 07:3x: "one plan drives both"). cut: what
 *  lyssajudron-prologue.mjs planOf returns ({live: the live scene's entry, end: her ドン on the sung line's onset or the last downbeat, beat_ms, bar_ms}, all
 *  on the house clock): the dark opens at `live` (or now, when the press comes later), the hit is `end`. null when the cut is not one, or its end is past. */
export function bossPlanOf(cut, { now_ms, boss = BOSS } = {}) {
  if (!cut || !num(cut.end) || !num(now_ms) || !num(cut.beat_ms) || !(cut.beat_ms > 200 && cut.beat_ms < 2000) || cut.end <= now_ms) return null;
  const beat = cut.beat_ms, bar = num(cut.bar_ms) && cut.bar_ms >= beat ? cut.bar_ms : beat * BEATS_PER_BAR, start = Math.max(now_ms, num(cut.live) ? cut.live : cut.end - 2 * bar);
  return shots(Math.min(start, cut.end - beat * 0.25), cut.end, beat, bar, { epoch_ms: cut.end, beat_ms: beat, beats_per_bar: Math.round(bar / beat) || BEATS_PER_BAR, song: cut.kind === 'line' || cut.kind === 'bars' }, boss);
}

/** bossProgram(seat, plan, shifted): her path for the entrance (one-law.mjs SCHEMA), the well's own legs: at rest inside, the charge to the glass in one
 *  beat, back to rest in a bar. `shifted`: the same legs after the freeze (the hold moved on by the frozen time), so the clock the well dances by stays the
 *  house's. The points' p are the well's own ladder (only the labels move her in a well, well-law.mjs inWell). */
export function bossProgram(seat, plan, shifted = false, boss = BOSS) {
  if (!plan || typeof seat !== 'string' || !seat) return null;
  // space: a page-local ladder for the well's own cutscene, never written to the Nest; its p(t) is the module's (pathAt is the door)
  const inside = `inside ${seat}`, on = `on ${seat}'s glass`, IN = [0, 0, -2.4], ON = [0, 0, 0], bar = plan.bar_ms, bpb = Math.max(1, Math.round(plan.bar_ms / plan.beat_ms));
  const legs = [plan.charge_ms - plan.start_ms, plan.hit_ms - plan.charge_ms, plan.rest_ms - plan.resume_ms].map((ms) => Math.max(1e-3, ms / bar));   // a leg's length in bars
  return { schema: SCHEMA, golem: 'lyssajudron', name: 'boss', home: seat, grid: { epoch_ms: plan.start_ms + (shifted ? plan.freeze_ms : 0), beat_ms: bar / bpb, beats_per_bar: bpb, source: plan.grid?.song ? 'song' : 'genesis' },
    t0_beat: 0, loop: false, follow: false,
    points: [{ p: IN, at: inside, bars: legs[0] }, { p: IN, at: inside, bars: legs[1] }, { p: ON, at: on, bars: legs[2] }, { p: IN, at: inside }] };
}

/** resumedPlan(plan, now_ms, hit_ms): the plan after a gate held it at the dark's door (THE GATE AT HER LINE'S DOOR, Oct 17 2026 20:2x WEST): no cutscene
 *  is left, the dark's own shot begins now, and every later time moves on by what the hold took; a sung line handed (hit_ms) that leaves the dark's own bar,
 *  the wake and the charge their old span takes her ドン, the charge, the freeze and the rest moving with it; a nearer one is refused and the old spacing stands. */
export function resumedPlan(plan, now_ms, hit_ms = null) {
  const shift = now_ms - darkOf(plan), p = { ...plan, start_ms: now_ms, dark_ms: now_ms };
  for (const k of ['wake_ms', 'charge_ms', 'hit_ms', 'resume_ms', 'rest_ms', 'end_ms']) p[k] = plan[k] + shift;
  if (num(hit_ms) && hit_ms >= p.wake_ms + (plan.hit_ms - plan.wake_ms)) { const d = hit_ms - p.hit_ms; for (const k of ['charge_ms', 'hit_ms', 'resume_ms', 'rest_ms', 'end_ms']) p[k] += d; }
  return p;
}
/** clockAt(plan, house_ms): the clock the well is handed: the house's, held at the hit through the freeze. */
export function clockAt(plan, h) { return h >= plan.hit_ms && h < plan.resume_ms ? plan.hit_ms : h; }

// THE SCAN SPAWNS HER (Oct 19 2026 WEST; his words: Oct 18 01:07 "our goal is to show the lyssajudron onto the keyboard in WASM in the nest with that qr code...
// the lyssajudron that would spawn and challenge you to fight dmc4 way... seeing that same fucking dmc4 lyssajudron but seeing it on the AR on the phone";
// Oct 18 16:02 "when the qr code is scanne i need to see the lyssajudron dmc4 boss mode in the AR and also in the anamoprhic overlay onto this mac";
// Oct 19 19:13 "when i scan that fucking qr code who appears onto ar? the fucking lyssajudron dmc4 mode"; the lineage ec-workspace
// docs/the-qr-scan-and-who-appears-in-ar-hypertrace-2026-10-19.md, section 5). The phone's read of the Mac's code is a cause of her entrance as his press
// is: the Mac's page writes the shared program on that read (mac-onboarding.html scanSpawn) with the plan below, and her words ride the program's bytes
// (entranceCues) so the glass that draws the program from the Nest says them on the same hits with no rule of its own. The words are BOSS's: one source.
const PLAN_KEYS = ['start_ms', 'dark_ms', 'wake_ms', 'charge_ms', 'hit_ms', 'resume_ms', 'rest_ms', 'end_ms'];
/** scanPlan({grid, now_ms, boss}): the plan the read opens when no press stands: no cutscene (the mist is the Mac's, before his press), the dark's own bar,
 *  the wake and the charge, her ドン on the first downbeat that leaves them their bars after the lead (the shape the gate's release gives his press:
 *  resumedPlan); on the house clock from the read. The dark begins at the read (within lead_ms). */
export function scanPlan({ grid = null, now_ms, boss = BOSS } = {}) {
  return bossPlan({ grid, now_ms, boss: { ...boss, dark_bars: 1, cutscene: Object.freeze({ ...(boss.cutscene || {}), shots: Object.freeze([]) }) } });
}
/** CUE_KINDS: the words of the entrance as the program carries them: taunt (her voice over the dark, the wake and the charge), card (the title at the hit:
 *  her name and epithet), line (her lines after the card: the bar's and the tail's), done (the end: nothing said). */
export const CUE_KINDS = Object.freeze(['taunt', 'card', 'line', 'done']);
/** entranceCues(plan, boss): HER WORDS AND THE TITLE RIDE THE PROGRAM: the cues the director speaks on this plan's hits (setStage), each at its house
 *  instant: the dark's taunt at dark_ms, the wake's at wake_ms, the charge's at charge_ms, the card at hit_ms, her first line at resume_ms (THE REVIVAL: the
 *  four verdicts beside it; the program's `verdict`, written by the director as a cause at the hit, puts one in its place), her second at rest_ms, done at
 *  end_ms. [] for no plan. Carried by entrance-record.mjs entranceRecord (cues), read by the Viewer (HerKeys.swift HerCue) and by cueAt below. */
export function entranceCues(plan, boss = BOSS) {
  if (!plan || !PLAN_KEYS.every((k) => num(plan[k]))) return [];
  const t = boss.taunts || {}, L = boss.lines || [], R = boss.revival;
  return [
    { at: plan.dark_ms, kind: 'taunt', text: t.dark || '' },
    { at: plan.wake_ms, kind: 'taunt', text: t.wake || '' },
    { at: plan.charge_ms, kind: 'taunt', text: t.charge || '' },
    { at: plan.hit_ms, kind: 'card', name: String(boss.name || '').toUpperCase(), epithet: String(boss.epithet || '') },
    { at: plan.resume_ms, kind: 'line', text: L[0] || '', ...(R && R.verdicts ? { verdicts: { ...R.verdicts } } : {}) },
    { at: plan.rest_ms, kind: 'line', text: L[1] || '' },
    { at: plan.end_ms, kind: 'done' },
  ].filter((c) => c.kind === 'done' || c.kind === 'card' || c.text);
}
/** cueAt(cues, h): the cue standing at house_ms h (the last whose instant is at or before h), null before the first. The phone's one rule (HerEntrance.cueAt),
 *  held here too so one check holds both to the same answer. */
export function cueAt(cues, h) {
  if (!Array.isArray(cues) || !num(h)) return null;
  let out = null;
  for (const c of cues) { if (!c || !num(c.at)) continue; if (c.at <= h) out = c; else break; }
  return out;
}
/** cueSaid(cue, verdict): what she says under the cue: the verdict's word when the program carries one the cue names, else the cue's text; null for none. */
export function cueSaid(cue, verdict = null) {
  if (!cue) return null;
  if (typeof verdict === 'string' && cue.verdicts && typeof cue.verdicts[verdict] === 'string') return cue.verdicts[verdict];
  return typeof cue.text === 'string' && cue.text ? cue.text : null;
}

// THE EYE, in the glass's own axes (metres; well-law.mjs EYE_FRONT, a head before a laptop): low and left and far in the dark, in before the wake, then
// held where the wake put it through the charge and the freeze (THE DARK STAYS, Oct 17 2026: no dolly back), home as she goes back.
export const EYES = Object.freeze({ dark: [0, -0.12, 0.95], wake: [0, 0.05, 0.72] });   // up the middle, never across it (his Oct 13 08:59: geometry and symmetry)
// THE MIST in her well (the same axes, up the middle): one slow descent from high and far to just above the dark's own eye, no cut (the dark's crane takes
// over from where it arrives).
export const CUT_EYES = Object.freeze({ mist: Object.freeze([[0, 0.34, 2.2], [0, 0.1, 1.05]]) });
function cutEye(sc) {
  if (!sc || !CUT_EYES[sc.id]) return CUT_EYES.mist[0].slice();
  const [a, b] = CUT_EYES[sc.id]; return mixv(a, b, ease(sc.k));
}
export function eyeAt(plan, h) {
  const d0 = darkOf(plan);
  if (h < d0 && d0 > plan.start_ms) return cutEye(sceneAt(plan, Math.max(h, plan.start_ms)));   // THE CUTSCENE (or the instant before it); none: the dark's eye before its start, as ever
  if (h < plan.wake_ms) return mixv(EYES.dark, EYES.wake, ease((h - d0) / (plan.wake_ms - d0)));
  if (h < plan.resume_ms) return EYES.wake.slice();   // THE DARK STAYS: the wake's eye through the charge and the freeze
  return mixv(EYES.wake, EYE_FRONT, ease((h - plan.resume_ms) / (plan.rest_ms - plan.resume_ms)));
}

/** flare(plan, h): 1 on a beat, falling away before the next; the beats counted back from the hit (a sung line's onset need not sit on the grid). */
export function flare(plan, h) { const b = plan.beat_ms, ph = ((((h - plan.hit_ms) % b) + b) % b) / b; return Math.exp(-ph * 5); }

/** lightAt(plan, h): her radiance held (0..1): an ember in the dark, then a flare on every beat from the wake to the end; never all of it (THE DARK STAYS,
 *  Oct 17 2026: it was all of it from the charge on, and the lit walls turned the well bright). */
export function lightAt(plan, h) {
  const d0 = darkOf(plan);
  if (h < d0) return 0.05;   // THE CUTSCENE: an ember, the dark one asleep in the box
  if (h < plan.wake_ms) return 0.05 + 0.09 * ease((h - d0) / (plan.wake_ms - d0));
  return HELD_LIGHT + 0.5 * flare(plan, h);
}

/** gradeAt(plan, h, stage): THE EXPOSURE (a CSS filter on the well's host). The well keeps its walls at a share of her light (well-law.mjs lampsOf), so its
 *  dark is never dark: the camera stops down instead. Near black in the dark, then a flare on every beat from the wake to the end, and the wake's floor
 *  (HELD_GRADE) on the well after it (THE DARK STAYS, Oct 17 2026: no overexposure into the hit, no bronze, no well as it is). */
export const CUT_GRADE = Object.freeze({ mist: 'brightness(.96) contrast(.9) saturate(.55)' });   // THE MIST: flat and pale, the colour drained; never dark
const DARK_FIRST = Object.freeze([0.3, 1.3, 0.75]);   // the dark's own first grade (below): where the mist's dissolves to over the shot's tail
/** mistGrade(sc, boss): the mist's grade, and over the shot's tail (BOSS.cutscene.mist.tail) its dissolve into the dark's first: no cut in the exposure either. */
export function mistGrade(sc, boss = BOSS) {
  const tail = boss?.cutscene?.mist?.tail ?? 0, k = sc && num(sc.k) ? sc.k : 0, out = tail > 0 && k > 1 - tail ? ease((k - (1 - tail)) / tail) : 0;
  if (!out) return CUT_GRADE.mist;
  const m = (a, b) => (a + (b - a) * out).toFixed(3);
  return `brightness(${m(0.96, DARK_FIRST[0])}) contrast(${m(0.9, DARK_FIRST[1])}) saturate(${m(0.55, DARK_FIRST[2])})`;
}
// THE DARK STAYS (Oct 17 2026 12:0x WEST, his "no dude. it must stay like that dio merda come on", then "diomerda like this one this fucking colors and
// all dude omg just keep it like it starts", over the wake's frame in the timeline of the app's own code: 連打 over her dark coat in the dimmed well, after
// he watched it turn into her own colours and the bright room): from the wake to the end her light and the exposure flare on every beat over the wake's
// floor and the eye stays where the wake put it; when the entrance is done the well keeps the floor (HELD_GRADE on its host, HELD_LIGHT for her
// radiance) and she stays the dark one, with no turn to her own colours before the hit or at the end. Only an entrance stopped midway takes them away.
export const HELD_GRADE = 'brightness(.42) contrast(1.25) saturate(.8)';
export const HELD_LIGHT = 0.16;
export function gradeAt(plan, h, stage = stageAt(plan, h)) {
  if (stage === 'cutscene') { const sc = sceneAt(plan, h); return sc && sc.id === 'mist' ? mistGrade(sc) : CUT_GRADE[sc?.id] || CUT_GRADE.mist; }
  if (stage === 'dark') { const d0 = darkOf(plan); return `brightness(${(0.3 + 0.1 * ease((h - d0) / (plan.wake_ms - d0))).toFixed(3)}) contrast(1.3) saturate(.75)`; }
  if (stage === 'before') return '';
  if (stage === 'done') return HELD_GRADE;
  return `brightness(${(0.42 + 0.45 * flare(plan, h)).toFixed(3)}) contrast(1.25) saturate(.8)`;   // the wake's flare on every beat, to the end (THE DARK STAYS)
}

/** Blend the exposure with the box's camera handoff. At its first frame the already-lit cavity stays visible. */
export function entranceGrade(plan, h, blend_ms = 0) {
  const grade = gradeAt(plan, h), k = blend_ms > 0 ? ease((h - plan.start_ms) / blend_ms) : 1;
  return k === 1 ? grade : grade.replace(/(brightness|contrast|saturate)\(([\d.]+)\)/g,
    (_, name, value) => `${name}(${(1 + (Number(value) - 1) * k).toFixed(3)})`);
}

/** stageAt(plan, h): which shot stands. */
export function stageAt(plan, h) {
  return h < plan.start_ms ? 'before' : h < darkOf(plan) ? 'cutscene' : h < plan.wake_ms ? 'dark' : h < plan.charge_ms ? 'wake' : h < plan.hit_ms ? 'charge' : h < plan.resume_ms ? 'hit' : h < plan.rest_ms ? 'bar' : h < plan.end_ms ? 'tail' : 'done';
}

/** cutsOf(plan, n): THE CUTS, one on each beat of the wake and one on the charge, counted back from the charge (a sung line's onset need not sit on the
 *  grid): [{at, i}] in order; i the cut's place among the n (laptop-law.mjs SLASHES: the charge's is the last); a wake of fewer beats drops the earliest. */
export function cutsOf(plan, n = 4) {
  if (!plan || !num(plan.charge_ms) || !num(plan.beat_ms) || !(plan.beat_ms > 0)) return [];
  const out = [];
  for (let k = 0; k < n; k++) { const at = plan.charge_ms - k * plan.beat_ms; if (at < plan.wake_ms - 1) break; out.unshift({ at, i: n - 1 - k }); }
  return out;
}
/** rankAt(plan, h, cuts): the style meter at house_ms h, an index of BOSS.ranks (-1: no cut yet): the last cut's place (D C B A), S halfway through the
 *  charge as the lid goes, SS on the hit, SSS SSS_MS after it. */
export function rankAt(plan, h, cuts = cutsOf(plan)) {
  if (!plan || !num(h)) return -1;
  if (h >= plan.hit_ms + SSS_MS) return 6;
  if (h >= plan.hit_ms) return 5;
  if (h >= plan.charge_ms + 0.5 * (plan.hit_ms - plan.charge_ms)) return 4;
  let r = -1; for (const c of cuts) if (h >= c.at) r = c.i; return r;
}

// THE REVIVAL'S LAW (pure: the same presses give the same cosmo on any glass and in a test)
/** revivalOf(plan): the window his mash counts in, [from, to) on the house clock: the dark's own bar (after the cutscene) to her ドン. */
export function revivalOf(plan) { return plan && num(plan.hit_ms) ? { from: darkOf(plan), to: plan.hit_ms } : null; }
/** cosmoAt(presses, h, R): her cosmo (0..1) at house_ms h from his presses (house_ms, in order): each adds R.gain (one counted per R.gap_ms), the whole
 *  leaks R.leak a second. 0 before his first. */
export function cosmoAt(presses, h, R = BOSS.revival) {
  if (!R || !Array.isArray(presses) || !num(h)) return 0;
  let c = 0, t = null, last = -Infinity;
  for (const p of presses) {
    if (!num(p) || p > h) break;
    if (p - last < R.gap_ms) continue;
    last = p; if (t != null) c = Math.max(0, c - R.leak * (p - t) / 1000);
    c = Math.min(1, c + R.gain); t = p;
  }
  return t == null ? 0 : Math.max(0, c - R.leak * (h - t) / 1000);
}
/** mashRank(c, n, R): the meter's rank of his mash (an index of BOSS.ranks): -1 before his first press, D at it, one up for each of R.ranks his cosmo passes. */
export function mashRank(c, n, R = BOSS.revival) { if (!R || !(n > 0)) return -1; let i = 0; for (const k of R.ranks) if (c >= k) i++; return Math.min(6, i); }
/** verdictOf(c, n, R): her word on what he delivered at the hit: 'none' (not a press), 'low' (under A), 'mid' (A to SS), 'full' (SSS). */
export function verdictOf(c, n, R = BOSS.revival) { if (!(n > 0)) return 'none'; const r = mashRank(c, n, R); return r >= 6 ? 'full' : r >= 3 ? 'mid' : 'low'; }

/** riseAt(seat, plan, h): her rise in this glass's well by the path the well is handed (0 at rest, 1 filling the glass): the tests' and a proof's reading. */
export function riseAt(seat, plan, h, inWell) {
  const shifted = h >= plan.resume_ms, a = pathAt(bossProgram(seat, plan, shifted), clockAt(plan, h));
  return inWell ? inWell(a, seat) : a;
}

const CSS = `
.boss{position:absolute;inset:0;pointer-events:none;overflow:hidden;z-index:40;font-family:'Bodoni Moda','Didot','Bodoni 72',serif;color:#f4ecd9;contain:strict}
.boss i,.boss b{display:block;position:absolute}
.boss .lb{left:0;right:0;height:13%;background:#050405;transform:scaleY(0);transition:transform .7s cubic-bezier(.2,.8,.2,1)}
.boss .lb.t{top:0;transform-origin:top}.boss .lb.b{bottom:0;transform-origin:bottom}
.boss.on .lb{transform:scaleY(1)}.boss.out .lb{transform:scaleY(0);transition-duration:.9s}
.boss .vig{inset:0;background:radial-gradient(ellipse at 50% 46%,transparent 34%,rgba(4,2,6,.82) 100%);opacity:0;transition:opacity 1.2s ease}
.boss.on .vig{opacity:1}.boss.lit .vig{opacity:.45}.boss.out .vig{opacity:0}
.boss .flash{inset:0;background:#fff;opacity:0}
.boss .flash.go{animation:boss-flash .26s ease-out forwards}
@keyframes boss-flash{0%{opacity:1}30%{opacity:.9}100%{opacity:0}}
.boss .lines{inset:-20%;opacity:0;background:repeating-conic-gradient(from 3deg at 50% 50%,rgba(8,6,10,.9) 0deg 1.1deg,transparent 1.1deg 5.3deg);
  -webkit-mask:radial-gradient(circle at 50% 50%,transparent 26%,#000 62%);mask:radial-gradient(circle at 50% 50%,transparent 26%,#000 62%)}
.boss .lines.go{animation:boss-lines .5s ease-out forwards}
@keyframes boss-lines{0%{opacity:.95;transform:scale(1.25) rotate(0deg)}100%{opacity:0;transform:scale(1) rotate(2deg)}}
.boss .card{left:0;right:0;top:50%;transform:translateY(-58%);display:grid;justify-items:center;gap:.4em;opacity:0}
.boss .card.go{opacity:1}
.boss .card.gone{opacity:0;transform:translateY(-58%) scale(.97);transition:opacity .28s ease,transform .28s ease}
.boss .slash{left:-10%;right:-10%;top:50%;height:22%;transform:translateY(-50%) skewY(-4deg) scaleX(0);transform-origin:left;
  background:linear-gradient(90deg,transparent,rgba(140,14,30,.92) 12%,rgba(201,161,74,.95) 50%,rgba(140,14,30,.92) 88%,transparent)}
.boss .card.go .slash{animation:boss-slash .22s cubic-bezier(.3,1.4,.4,1) forwards}
@keyframes boss-slash{to{transform:translateY(-50%) skewY(-4deg) scaleX(1)}}
.boss .epithet{position:relative;font-family:'Gelasio',Georgia,serif;font-size:clamp(12px,1.9vw,28px);letter-spacing:.42em;text-transform:uppercase;color:#f0cf74;
  text-shadow:0 1px 0 #000,0 0 6px #000,0 0 18px rgba(0,0,0,.95);opacity:0}
.boss .card.go .epithet{animation:boss-in .3s .18s ease-out forwards}
.boss .name{position:relative;font-size:clamp(44px,10.5vw,190px);line-height:.9;letter-spacing:.02em;font-weight:700;color:#fbf6ea;
  -webkit-text-stroke:2px #0b0709;paint-order:stroke fill;text-shadow:-4px 0 rgba(255,36,56,.85),4px 0 rgba(80,220,255,.7),0 6px 30px rgba(0,0,0,.8);
  transform:scale(2.6) skewX(-10deg);opacity:0}
.boss .card.go .name{animation:boss-slam .17s cubic-bezier(.2,1.6,.3,1) forwards,boss-settle .9s .17s ease-out forwards}
@keyframes boss-slam{to{transform:scale(1) skewX(-10deg);opacity:1}}
@keyframes boss-settle{from{text-shadow:-4px 0 rgba(255,36,56,.85),4px 0 rgba(80,220,255,.7),0 6px 30px rgba(0,0,0,.8)}
  to{text-shadow:-1px 0 rgba(255,36,56,.35),1px 0 rgba(80,220,255,.3),0 6px 30px rgba(0,0,0,.8)}}
@keyframes boss-in{from{opacity:0;transform:translateY(.4em)}to{opacity:1;transform:none}}
.boss .hud{left:19%;right:19%;bottom:calc(13% + 3.2%);opacity:0;transition:opacity .4s ease}
.boss .hud.go{opacity:1}.boss.gone .hud.go,.boss.gone .sub.go{opacity:0;transition:opacity .9s ease}.boss.gone.keep .hud.go{opacity:1}
.boss .hudname{position:relative;font-family:'Gelasio',Georgia,serif;font-size:clamp(12px,1.55vw,24px);letter-spacing:.03em;color:#f1e8d2;
  text-shadow:0 1px 2px #000,0 0 8px rgba(0,0,0,.9);margin:0 0 .35em .1em}
.boss .bar{position:relative;height:clamp(5px,.62vw,9px);background:rgba(10,8,8,.82);box-shadow:0 0 0 1px rgba(201,161,74,.55),0 2px 10px rgba(0,0,0,.8)}
.boss .fill{left:0;top:0;bottom:0;width:100%;transform:scaleX(0);transform-origin:left;
  background:linear-gradient(180deg,#f3d98c,#c9a14a 55%,#7a5a1c);transition:transform 1.1s cubic-bezier(.2,.7,.1,1)}
.boss .hud.go .fill{transform:scaleX(1)}
.boss .bar b{top:-3px;bottom:-3px;width:2px;background:#0b0709;box-shadow:0 0 0 1px rgba(201,161,74,.5)}
.boss .sub{left:10%;right:10%;bottom:calc(13% + 3.2% + 4.6em);text-align:center;font-family:'Gelasio',Georgia,serif;font-size:clamp(14px,1.9vw,30px);
  color:#fff;text-shadow:0 2px 3px #000,0 0 14px rgba(0,0,0,.95);opacity:0;transition:opacity .35s ease}
.boss .sub.go{opacity:1}
.boss .rank{right:4.5%;top:calc(13% + 2.6%);display:grid;justify-items:end;opacity:0;transition:opacity .25s ease;--rc:#9aa0a8}
.boss .rank.go{opacity:1}.boss.out .rank{opacity:0;transition:opacity .8s ease}
.boss .rank .letter{position:relative;font:italic 900 clamp(46px,8.4vw,150px)/.8 'Bodoni Moda','Didot','Bodoni 72',serif;letter-spacing:-.05em;color:var(--rc);
  -webkit-text-stroke:2px #0b0709;paint-order:stroke fill;text-shadow:0 0 18px var(--rc),0 5px 0 #000}
.boss .rank.pop .letter{animation:boss-rank .3s cubic-bezier(.2,1.7,.3,1)}
@keyframes boss-rank{0%{transform:scale(2.3) rotate(-14deg);opacity:0}100%{transform:none;opacity:1}}
.boss .rank .word{position:relative;margin-top:.25em;font:italic 700 clamp(12px,1.75vw,28px)/1 'Gelasio',Georgia,serif;letter-spacing:.08em;text-transform:uppercase;
  color:#fff;text-shadow:0 0 10px var(--rc),0 2px 0 #000}
.boss .rank .gauge{position:relative;display:block;width:clamp(70px,11vw,210px);height:5px;margin-top:.5em;background:rgba(0,0,0,.6);box-shadow:0 0 0 1px rgba(255,255,255,.22)}
.boss .rank .gauge s{display:block;height:100%;background:var(--rc);transform-origin:left;animation:boss-gauge var(--beat,500ms) linear forwards}
@keyframes boss-gauge{from{transform:scaleX(1)}to{transform:scaleX(.1)}}
.boss .cut{height:clamp(3px,.4vw,7px);border-radius:99px;transform-origin:0 50%;transform:var(--r) scaleX(0);
  background:linear-gradient(90deg,transparent,#fff 16%,#fff 84%,transparent);box-shadow:0 0 10px 2px rgba(255,36,56,.9),0 0 34px 8px rgba(255,36,56,.35);
  animation:boss-cut .36s cubic-bezier(.15,.9,.2,1) forwards}
@keyframes boss-cut{0%{transform:var(--r) scaleX(0);opacity:1}24%{transform:var(--r) scaleX(1);opacity:1}100%{transform:var(--r) scaleX(1);opacity:0}}
.boss .spark{width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;opacity:0;mix-blend-mode:screen;
  background:radial-gradient(circle,#fff 0 16%,#ffd36b 30%,rgba(255,36,56,.75) 52%,transparent 70%);animation:boss-spark .42s ease-out var(--d,0ms) forwards}
@keyframes boss-spark{0%{opacity:0;transform:scale(.2)}18%{opacity:1;transform:scale(1.2)}100%{opacity:0;transform:scale(.55)}}
.boss .zan{font:900 clamp(26px,3.6vw,64px)/1 'Hiragino Mincho ProN','Yu Mincho',serif;color:#fff;-webkit-text-stroke:2px #8c0e1e;paint-order:stroke fill;
  text-shadow:0 0 14px rgba(255,36,56,.95);opacity:0;animation:boss-zan .5s cubic-bezier(.2,1.5,.3,1) forwards}
@keyframes boss-zan{0%{opacity:0;transform:translate(-50%,-50%) scale(1.8) rotate(-8deg)}25%{opacity:1;transform:translate(-50%,-50%) scale(1) rotate(-8deg)}
  100%{opacity:0;transform:translate(-50%,-62%) scale(1) rotate(-8deg)}}
.boss .cs{inset:0}
.boss.cs-mist .vig{opacity:.3}
.boss .mist{position:absolute;inset:0;opacity:0;transition:opacity 1.1s ease}
.boss.cs-mist .mist{opacity:1}
.boss .mist .veil{position:absolute;inset:-12%;opacity:0;transition:opacity 2.8s cubic-bezier(.3,.6,.4,1);
  background:radial-gradient(ellipse at 50% 42%,rgba(168,180,178,.96) 0%,rgba(150,162,160,.86) 36%,rgba(128,140,138,.7) 100%)}
.boss.cs-mist .mist .veil{opacity:.08}
.boss.cs-mist.flat .mist .veil{opacity:.6}
.boss.cs-mist.cs-in .mist .veil{opacity:.72;transition-duration:.32s}
.boss.cs-mist.cs-out .mist .veil{opacity:0;transition-duration:2.2s}
/* THE LINES, LEGIBLE (his Oct 17 2026 19:1x WEST, over the third line dark on the grey mist: "this is the right font but make it more visible... why cant you
   write it like as if it was a anime text based.. like think about resident evil 4 typa shit"): the same face, italic and regular as it was (Didot on the Mac,
   the Bodoni Moda webfont elsewhere: never a faux bold), set like a caption card of an anime or of Resident Evil 4: a light fill, a dark edge behind the fill
   (paint-order, as the name and the 斬 already do), a hard drop and a dark halo so it reads on pale mist and on the dark alike, and larger. The dissolves as they were. */
.boss .mist .line{position:absolute;left:8%;right:8%;top:calc(13% + 5.5%);margin:0;text-align:center;font:italic 400 clamp(20px,2.7vw,46px)/1.3 'Bodoni Moda','Didot','Bodoni 72',serif;
  letter-spacing:.03em;color:#f6efe0;-webkit-text-stroke:1.25px #0b0709;paint-order:stroke fill;text-shadow:0 2px 0 #0b0709,0 0 10px rgba(0,0,0,.92),0 0 30px rgba(0,0,0,.7);opacity:0;transition:opacity 1.15s ease}
.boss .mist .line.go{opacity:1;transition-duration:1.7s}
.boss .mash{left:0;right:0;top:calc(13% + 4%);display:grid;justify-items:center;gap:.4em;opacity:0;transition:opacity .2s ease}
.boss.mash-on .mash{opacity:1}
.boss .mash::before{content:'';position:absolute;left:50%;top:42%;width:min(150%,1100px);aspect-ratio:2;transform:translate(-50%,-50%);opacity:.35;
  background:repeating-conic-gradient(from 0deg at 50% 50%,rgba(255,255,255,.55) 0deg .5deg,transparent .5deg 6deg);
  -webkit-mask:radial-gradient(ellipse at 50% 50%,transparent 22%,#000 38%,transparent 66%);mask:radial-gradient(ellipse at 50% 50%,transparent 22%,#000 38%,transparent 66%)}
.boss .mash.hit::before{animation:mash-lines .16s ease-out}
@keyframes mash-lines{0%{opacity:.95;transform:translate(-50%,-50%) scale(1.08)}100%{opacity:.35;transform:translate(-50%,-50%) scale(1)}}
.boss .mash .mk{position:relative;font:900 clamp(40px,7.5vw,128px)/1 'Hiragino Mincho ProN','Yu Mincho',serif;color:#fff;-webkit-text-stroke:3px #0b0709;paint-order:stroke fill;
  text-shadow:0 0 18px rgba(255,214,107,.85),0 6px 0 #000;transform:skewX(-8deg)}
.boss .mash.hit .mk{animation:mash-hit .14s ease-out}
.boss .mash.hit::before,.boss .mash.hit .mk{animation-delay:var(--mash-age,0ms)}
@keyframes mash-hit{0%{transform:skewX(-8deg) scale(1.2)}100%{transform:skewX(-8deg) scale(1)}}
.boss .mash .mw{position:relative;font:italic 700 clamp(11px,1.3vw,20px)/1 'Gelasio',Georgia,serif;letter-spacing:.5em;color:#ffd36b;text-shadow:0 2px 0 #000}
.boss .mash .mg{position:relative;display:block;width:clamp(120px,26vw,440px);height:clamp(6px,.75vw,12px);background:rgba(0,0,0,.65);
  box-shadow:0 0 0 1px rgba(255,214,107,.6),0 0 16px rgba(255,214,107,.25)}
.boss .mash .mg s{display:block;height:100%;transform-origin:left;transform:scaleX(0);background:linear-gradient(90deg,#7a5a1c,#ffd36b 70%,#fff)}
@media (prefers-reduced-motion:reduce){.boss .mash.hit::before,.boss .mash.hit .mk{animation:none}}
@media (prefers-reduced-motion:reduce){.boss .flash.go,.boss .lines.go{animation:none}.boss .card.go .name{animation:none;opacity:1;transform:skewX(-10deg)}
  .boss .cut,.boss .spark,.boss .zan,.boss .rank.pop .letter{animation:none}
  .boss .mist,.boss .mist .veil,.boss .mist .line{transition:none}}
`;

/** mountBossIntro({well, stage, shake, win, doc, boss}): the director. well: the mountWell handle; stage: the element to cover (her card); shake: what
 *  trembles in the legacy intro (the well's host); a shared entrance trembles only its HUD. -> { play({hit_ms}) (a promise that settles when it ends), skip(), stop(), state() } */
export function mountBossIntro({ well, stage, shake = null, win = globalThis.window, doc = globalThis.document, boss = BOSS, keepBar = false, onHit = null } = {}) {
  if (!well || !stage || !doc) throw new Error('mountBossIntro needs the well and the element to cover');
  if (!doc.getElementById('boss-intro-css')) { const st = doc.createElement('style'); st.id = 'boss-intro-css'; st.textContent = CSS; doc.head.appendChild(st); }
  const still = !!win?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const S = { plan: null, raf: 0, playing: false, stage: 'idle', seat: null, saved: null, painted: null, h0: 0, p0: 0, frames: 0, done: null, said: 0, gate: null, gated: null, held: 0,
    laptop: false, jolts: [], cuts: [], fired: 0, rank: -1, taunted: 0, fx: [], scene: null, line: -1, told: 0, shots: [], phase: null,
    presses: [], pressedAt: -Infinity, cosmo: 0, shown: -1, final: null, verdict: null, ears: null,
    sharedSource: null, acceptedMashes: [], reaction_ms: 0 };   // THE REVIVAL: accepted causes, sampled at their effective house stamps
  let root = null, el = null;
  function build() {
    root = doc.createElement('div'); root.className = keepBar ? 'boss keep' : 'boss'; root.setAttribute('aria-hidden', 'true');
    root.innerHTML = '<i class="vig"></i><i class="lines"></i><i class="flash"></i>'
      + '<div class="cs" style="position:absolute"><div class="mist"><i class="veil"></i><p class="line"></p></div></div>'   // THE MIST: its veil and its one line at a time
      + '<i class="lb t"></i><i class="lb b"></i>'
      + '<div class="card" style="position:absolute"><i class="slash"></i><div class="epithet"></div><div class="name"></div></div>'
      + '<div class="sub" style="position:absolute"></div>'
      + '<div class="hud" style="position:absolute"><div class="hudname"></div><div class="bar"><i class="fill"></i><b style="left:33.333%"></b><b style="left:66.667%"></b></div></div>'
      + '<div class="rank" style="position:absolute"><b class="letter"></b><i class="word"></i><u class="gauge"></u></div>'
      + '<div class="mash" style="position:absolute"><b class="mk">\u9023\u6253</b><i class="mw">MASH</i><u class="mg"><s></s></u></div>';   // THE REVIVAL: 連打
    const q = (s) => root.querySelector(s);
    el = { flash: q('.flash'), lines: q('.lines'), card: q('.card'), sub: q('.sub'), hud: q('.hud'), rank: q('.rank'), letter: q('.letter'), word: q('.word'), gauge: q('.gauge'),
      line: q('.mist .line'), mash: q('.mash'), cosmo: q('.mg s') };
    q('.epithet').textContent = boss.epithet; q('.name').textContent = boss.name.toUpperCase(); q('.hudname').textContent = `${boss.name}, ${boss.epithet}`;
    if (getComputedStyleSafe(stage) === 'static') stage.style.position = 'relative';
    stage.appendChild(root);
  }
  function getComputedStyleSafe(n) { try { return win.getComputedStyle(n).position; } catch { return 'relative'; } }
  const house = () => S.h0 + (win.performance.now() - S.p0);
  function setStage(next, h) {
    if (next === S.stage) return; const was = S.stage; S.stage = next;
    if (next === 'cutscene') { root.classList.add('on'); if (!S.painted) try { S.painted = well.paint({ ...DARK_PAINT }); } catch { /* an older well: no paint */ } }   // the screen is taken; she is the dark one in the box
    if (next === 'dark') { tell(null); root.classList.add('on'); if (!S.painted) try { S.painted = well.paint({ ...DARK_PAINT }); } catch { /* an older well: no paint */ } taunt(boss.taunts?.dark); }
    if (next === 'wake') { root.classList.add('lit'); taunt(boss.taunts?.wake); }
    if (next === 'charge') taunt(boss.taunts?.charge);
    if (next === 'hit') {
      try { onHit?.(S.plan); } catch { /* the page's */ }
      taunt('');   // the card speaks
      const R = boss.revival;   // THE REVIVAL: what he delivered at her ドン sizes her burst and names her verdict
      if (R) { if (!S.sharedSource) { S.final = cosmoAt(S.presses, S.plan.hit_ms, R); S.verdict = verdictOf(S.final, S.presses.length, R); } root.classList.remove('mash-on'); }
      if (!still) { el.flash.classList.add('go'); el.lines.classList.add('go'); S.jolts.push({ from: h, len: 420, px: R ? 3 + 9 * (S.final ?? S.cosmo) : 6 }); }
      el.card.classList.add('go');
    }
    if (next === 'bar') { el.card.classList.add('gone'); el.hud.classList.add('go'); if (boss.revival && S.verdict) speak(boss.revival.verdicts[S.verdict]); else say(0); clearFx(); }
    if (next === 'tail') { say(1); root.classList.add('out'); }
    if (next === 'done') { root.classList.add('gone'); finish(); }   // her line and the bar go after the letterbox (CSS transitions: no timer, no picture of ours)
    void was;
  }
  // Her own colours back, only for an entrance stopped midway (THE DARK STAYS, Oct 17 2026: a done or skipped entrance leaves her the dark one).
  function reveal() { if (S.flipped) return; S.flipped = true; try { well.paint({ ...S.saved }); } catch { /* an older well: no paint */ } }
  function say(i) { S.said = i + 1; el.sub.classList.remove('go'); el.sub.textContent = boss.lines[i] || ''; void el.sub.offsetWidth; el.sub.classList.add('go'); }
  function speak(text) { S.said = 1; el.sub.classList.remove('go'); el.sub.textContent = text || ''; void el.sub.offsetWidth; el.sub.classList.add('go'); }   // THE REVIVAL: her verdict in her first line's place
  function taunt(text) { el.sub.classList.remove('go'); el.sub.textContent = text || ''; if (!text) return; S.taunted++; void el.sub.offsetWidth; el.sub.classList.add('go'); }
  const setVar = (n, k, v) => { if (n.style.setProperty) n.style.setProperty(k, v); else n.style[k] = v; };
  // THE MIST ON THE PAGE: its shot is a class on the layer (cs-mist), its two dissolves a class each (cs-in through the rise, cs-out over the tail), its line
  // one text at a time, each fade CSS's; the DOM is written only when the shot, a dissolve's edge or the line changes (sc: sceneAt's, null when it ends)
  function tell(sc) {
    const id = sc ? sc.id : null, M = boss.cutscene?.mist;
    if (id !== S.scene) {
      if (S.scene) root.classList.remove(`cs-${S.scene}`, 'cs-in', 'cs-out');
      S.scene = id; S.phase = null; if (id) { root.classList.add(`cs-${id}`); S.shots.push(id); }
      if (id !== 'mist') { S.line = -1; el.line.classList.remove('go'); }
    }
    if (id === 'mist' && M) {
      const ph = sc.k < (M.rise ?? 0) ? 'cs-in' : sc.k > 1 - (M.tail ?? 0) ? 'cs-out' : 'mid';
      if (ph !== S.phase) { S.phase = ph; root.classList.remove('cs-in', 'cs-out'); if (ph !== 'mid') root.classList.add(ph); }
      if (sc.line !== S.line) {
        S.line = sc.line;
        if (sc.line >= 0) { el.line.textContent = M.lines[sc.line] || ''; el.line.classList.remove('go'); void el.line.offsetWidth; el.line.classList.add('go'); S.told++; }
        else el.line.classList.remove('go');
      }
    }
  }
  const place = (n, x, y) => { n.style.left = `${Math.round(x)}px`; n.style.top = `${Math.round(y)}px`; };
  const rectOf = (n) => { try { const r = n.getBoundingClientRect(); if (r && r.width > 0) return r; } catch { /* a stub */ } return { left: 0, top: 0, width: 0, height: 0 }; };
  function clearFx() { for (const n of S.fx) try { n.remove(); } catch { /* gone */ } S.fx = []; }
  // THE CUT'S LINE in the page's pixels: the stage's own (the laptop's keys) or the card's fractions, with the points it crosses
  function lineOf(i) {
    try { const g = typeof well.slash === 'function' ? well.slash(i) : null; if (g && g.a && g.b && Array.isArray(g.keys) && g.keys.length) return g; } catch { /* the card's then */ }
    const r = rectOf(root), [a, b] = CARD_CUTS[i % CARD_CUTS.length], at = (f) => [r.left + f[0] * r.width, r.top + f[1] * r.height];
    return { a: at(a), b: at(b), keys: [0, .25, .5, .75, 1].map((k) => at([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k])) };
  }
  function cut(c, h) {   // THE CUT: a blade across the line, a spark on each point it crosses (one after another, as the blade travels), 斬, the glass jolts
    const g = lineOf(c.i), r = rectOf(root), dx = g.b[0] - g.a[0], dy = g.b[1] - g.a[1], len = Math.hypot(dx, dy), ang = Math.atan2(dy, dx), ext = .14 * len;
    const blade = doc.createElement('i'); blade.className = 'cut'; place(blade, g.a[0] - r.left - Math.cos(ang) * ext, g.a[1] - r.top - Math.sin(ang) * ext);
    blade.style.width = `${Math.round(len + 2 * ext)}px`; setVar(blade, '--r', `translateY(-50%) rotate(${(ang * 180 / Math.PI).toFixed(2)}deg)`);
    root.appendChild(blade); S.fx.push(blade);
    g.keys.forEach((k, j) => { const sp = doc.createElement('i'); sp.className = 'spark'; place(sp, k[0] - r.left, k[1] - r.top); setVar(sp, '--d', `${Math.round(j * 22)}ms`); root.appendChild(sp); S.fx.push(sp); });
    const zan = doc.createElement('b'); zan.className = 'zan'; zan.textContent = '\u65ac'; place(zan, (g.a[0] + g.b[0]) / 2 - r.left, (g.a[1] + g.b[1]) / 2 - r.top - 30); root.appendChild(zan); S.fx.push(zan);
    if (!still) S.jolts.push({ from: h, len: 200, px: 3.2 });
    S.fired++;
  }
  function rankUp(i) {   // THE STYLE METER: the rank's letter and her word slam in, its gauge drains over a beat
    S.rank = i; const [letter, word] = boss.ranks?.[i] || ['', ''];
    el.letter.textContent = letter; el.word.textContent = word; setVar(el.rank, '--rc', RANK_INK[i] || '#fff'); setVar(el.rank, '--beat', `${Math.round(S.plan.beat_ms)}ms`);
    el.rank.classList.add('go'); el.rank.classList.remove('pop'); void el.rank.offsetWidth; el.rank.classList.add('pop'); el.gauge.innerHTML = '<s></s>';
  }
  function fight(h) {
    while (S.fired < S.cuts.length && h >= S.cuts[S.fired].at) cut(S.cuts[S.fired], h);
    const r = boss.revival ? revivalRank(h) : rankAt(S.plan, h, S.cuts); if (r >= 0 && r !== S.rank) rankUp(r);
  }
  // THE REVIVAL'S METER: his mash's rank through the window (D from the wake's first cut if he has not pressed: dull), then held at what he delivered
  function revivalRank(h) {
    const w = revivalOf(S.plan), n = S.presses.length; if (!w || h < w.from) return -1;
    const end = w.to + S.reaction_ms, c = h < end ? S.cosmo : S.final ?? cosmoAt(S.presses, end, boss.revival), r = mashRank(c, n, boss.revival);
    return r >= 0 ? r : S.cuts.length && h >= S.cuts[0].at ? 0 : -1;
  }
  function mashFx(at, h) {
    S.pressedAt = Math.max(S.pressedAt, at);
    // Late delivery samples the remaining impulse; it never starts a new one
    // at receipt time. A cause older than the impulse has no flash to replay.
    if (still || h - at >= 150) return;
    S.jolts.push({ from: at, len: 150, px: 2.2 });
    setVar(el.mash, '--mash-age', `${-Math.max(0, h - at)}ms`);
    el.mash.classList.remove('hit'); void el.mash.offsetWidth; el.mash.classList.add('hit');
  }
  function sharedRevival(h) {
    const record = well.revival?.(), w = revivalOf(S.plan); if (!record || !w || !boss.revival) return;
    const reaction = record.reaction_ms ?? 0;
    if (!num(reaction) || reaction < 0 || reaction > 100) return;
    S.reaction_ms = reaction;
    if (record !== S.sharedSource) {
      // Shared geometry moves in WASM. Clear legacy CSS motion before the glass
      // samples its physical viewport; presentation jolts belong to the HUD.
      if (!S.sharedSource && shake) shake.style.transform = '';
      S.sharedSource = record;
      const causes = record.mashes || (num(record.last_mash) ? [{ at: record.last_mash, captured_at: record.last_mash - reaction }] : []);
      S.acceptedMashes = [...new Set(causes.filter(m => num(m.at) && num(m.captured_at) && m.at === m.captured_at + reaction && m.captured_at >= w.from && m.captured_at < w.to).map(m => m.at))].sort((a, b) => a - b);
    }
    let count = 0; while (count < S.acceptedMashes.length && S.acceptedMashes[count] <= h) count++;
    if (count !== S.presses.length || S.presses.at(-1) !== S.acceptedMashes[count - 1]) S.presses = S.acceptedMashes.slice(0, count);
    const latest = S.presses.at(-1); if (num(latest) && latest > S.pressedAt) mashFx(latest, h);
    // Capture closes on the song's hit. Its final accepted reaction is allowed
    // the same buffer as every earlier one; the title itself stays on the hit.
    const end = w.to + reaction;
    S.cosmo = cosmoAt(S.presses, Math.min(h, end), boss.revival);
    if (h >= end) {
      const previous = S.verdict; S.final = S.cosmo; S.verdict = verdictOf(S.final, S.presses.length, boss.revival);
      if (S.stage === 'bar' && previous !== S.verdict) speak(boss.revival.verdicts[S.verdict]);
      if (S.verdict !== S.wrote) {   // THE SCAN SPAWNS HER (b): her verdict rides the program as a cause (entrance-record.mjs entranceCause verdict), once per verdict, so the phone says it in her first line's place from the same bytes
        S.wrote = S.verdict;
        try { Promise.resolve(well.verdict?.(S.verdict)).catch(() => {}); } catch { /* an older well: no verdict on the wire */ }
      }
    }
  }
  // HIS PRESS (a key, a tap): counted in the window only; the glass kicks, the prompt flares. Space, Enter and the arrows are kept from the page while it counts.
  function pressed(e) {
    if (!S.playing || !S.plan || !boss.revival) return;
    if (e && e.type === 'keydown' && (e.repeat || e.metaKey)) return;   // a held key is one press; the system's shortcuts are not his mash
    const h = house(), w = revivalOf(S.plan); if (!w || h < w.from || h >= w.to) return;
    if (e && e.type === 'keydown' && e.cancelable && (e.key === ' ' || e.key === 'Enter' || String(e.key).startsWith('Arrow'))) { try { e.preventDefault(); } catch { /* a stub */ } }
    if (well.revival?.()) {
      // The accepted record is the only source of score and effects. A failed,
      // rejected or still-in-flight write cannot become a local reaction.
      try { Promise.resolve(well.mash?.(h)).catch(() => {}); } catch { /* no accepted cause */ }
      return;
    }
    S.presses.push(h); well.mash?.(h); mashFx(h, h);
  }
  function listen(on) {
    const ear = S.ears; if (ear) { try { win.removeEventListener?.('keydown', ear); stage.removeEventListener?.('pointerdown', ear); } catch { /* gone */ } S.ears = null; }
    if (!on || !boss.revival) return;
    S.ears = (e) => pressed(e); try { win.addEventListener?.('keydown', S.ears); stage.addEventListener?.('pointerdown', S.ears); } catch { /* no ears: she comes out unrevived */ }
  }
  function tremble(h) {   // the wake's beats and every jolt (a cut's, the hit's), each on its own phase from its own start, summed: the glass never jumps
    const target = S.sharedSource ? root : shake;
    if (!target) return;
    let x = 0, y = 0, px = 0;
    const add = (local, k) => { x += Math.sin(local * .047) * k; y += Math.sin(local * .061) * k; px += k; };   // local continuous phases: wrapping before multiplying by noninteger frequencies jumped the glass
    for (const j of S.jolts) { const local = h - j.from; if (local >= 0 && local < j.len) add(local, j.px * ease(local / 45) * (1 - ease(local / j.len))); }
    if (S.stage === 'wake') { const local = h - S.plan.wake_ms, beat = S.plan.hit_ms - S.plan.charge_ms; add(local, .8 * Math.sin(Math.PI * ((local % beat) / beat)) ** 2); }
    if (still || px <= 0) { if (target.style.transform) target.style.transform = ''; return; }
    target.style.transform = `translate3d(${x.toFixed(3)}px,${y.toFixed(3)}px,0) scale(${(1 + Math.min(6, px) * .002).toFixed(5)})`;
  }
  function frame() {
    S.raf = 0; if (!S.playing) return;
    let h = house(); const P = S.plan;
    // THE GATE AT HER LINE'S DOOR (Oct 17 2026 20:2x WEST, his "let the animation play omg... TU LA ROBA DEL 'OH YOU REALLY OPENED' LA DEVI METTERE QUANDO HA
    // SCANNERIZZATO"): at the instant the cutscene would give way to the dark, before her first line, a page's gate holds the entrance: this picture stands at
    // the cutscene's last instant, no frame while held, the handed clock still, nothing told; the gate hears the door and what her line needs before her
    // ドン ({door_ms, need_ms, hit_ms, bar_ms, beat_ms}); its answer ({hit_ms, dark_ms}: her ドン and the release on the house clock, or nothing) resumes the
    // plan from the release (resumedPlan) and the dark begins with her line. A mirror's answer is the Mac's release: it goes on with the Mac on the same hit
    if (S.gate && !S.gated && cutsceneBars(boss) > 0 && h >= darkOf(P)) {
      const g = S.gated = { at: darkOf(P), open: true };
      let p; try { p = Promise.resolve(S.gate({ plan: P, door_ms: g.at, need_ms: P.hit_ms - g.at, hit_ms: P.hit_ms, bar_ms: P.bar_ms, beat_ms: P.beat_ms })); } catch (e) { p = Promise.reject(e); }
      p.then((r) => { if (g.open && S.playing) ungate(r); }, () => { if (g.open && S.playing) ungate(null); });
    }
    if (S.gated && S.gated.open) h = S.gated.at - 1;
    const st = stageAt(P, h);
    if (st === 'before') {   // the opener's drawings still stand: nothing shown; a laptop holds her box shut until the dark
      if (S.laptop) try { well.boss({ plan: P, h, stage: st }); } catch { /* a glass that refuses: the DOM still plays */ }
      S.raf = win.requestAnimationFrame(frame); return;
    }
    sharedRevival(h);
    setStage(st, h); if (!S.playing) return;
    const sc = st === 'cutscene' ? sceneAt(P, h, boss) : null; if (sc || S.scene) tell(sc);   // THE CUTSCENE: its shot and its line
    const w = boss.revival ? revivalOf(P) : null, mashing = !!w && h >= w.from && h < w.to;   // THE REVIVAL: 連打 and its gauge through its window
    if (mashing) {
      root.classList.add('mash-on'); S.cosmo = cosmoAt(S.presses, h, boss.revival);
      const shown = Math.round(S.cosmo * 200) / 200; if (shown !== S.shown) { S.shown = shown; el.cosmo.style.transform = `scaleX(${shown.toFixed(3)})`; }
    }
    const kick = (S.sharedSource && S.reaction_ms > 0 ? h < S.pressedAt + 170 : mashing) && h >= S.pressedAt ? Math.exp(-(h - S.pressedAt) / 90) : 0;   // a final buffered mash keeps its own 170ms impulse after the hit
    fight(h);
    if (S.laptop) { try { well.boss({ plan: P, h, stage: st, scene: sc && { id: sc.id, k: sc.k }, kick }); } catch { /* a glass that refuses: the DOM still plays */ } }
    else {
      const shifted = h >= P.resume_ms;
      const program = shifted ? S.programs[1] : S.programs[0], at_ms = clockAt(P, h);
      const rise = inWell(pathAt(program, at_ms), S.seat).rise;
      const light = mashing ? Math.max(lightAt(P, h), 0.08 + 0.7 * S.cosmo + 0.2 * kick) : lightAt(P, h);   // THE REVIVAL: her light climbs with his cosmo
      try { well.set({ program, at_ms, eye: eyeAt(P, h), light, rise }); } catch { /* a well that refuses: the DOM still plays */ }
    }
    if (shake) shake.style.filter = entranceGrade(P, h, S.blend_ms);
    tremble(h); S.frames++;
    if (!(S.gated && S.gated.open)) S.raf = win.requestAnimationFrame(frame);   // held at the door: this picture stands until the gate answers
  }
  function ungate(r) {   // the gate answered: the plan moves on from the release (r.dark_ms; a mirror hears the Mac's late), her ドン on the hit handed when it leaves the old span; the frames resume
    const g = S.gated; if (!g || !g.open) return; g.open = false;
    const now = house(), from = r && num(r.dark_ms) && r.dark_ms <= now ? r.dark_ms : now; S.held = Math.max(0, now - g.at);
    // A shared entrance returns the exact plan acknowledged by the Nest. A late
    // receiver samples it at now; rebuilding it here would move its start.
    S.plan = r?.plan && ['start_ms', 'dark_ms', 'wake_ms', 'charge_ms', 'hit_ms', 'resume_ms', 'rest_ms', 'end_ms'].every(k => num(r.plan[k])) ? r.plan : resumedPlan(S.plan, from, r && num(r.hit_ms) ? r.hit_ms : null);
    S.programs = S.laptop ? null : [bossProgram(S.seat, S.plan, false, boss), bossProgram(S.seat, S.plan, true, boss)]; S.cuts = cutsOf(S.plan);
    if (!S.raf) S.raf = win.requestAnimationFrame(frame);
  }
  function release(keep = false) {   // keep: the entrance is done (THE DARK STAYS); not kept: stopped midway
    listen(false);   // THE REVIVAL's ears go with the entrance
    if (S.raf) { win.cancelAnimationFrame(S.raf); S.raf = 0; }
    if (shake) { shake.style.transform = ''; shake.style.filter = keep ? HELD_GRADE : ''; }
    if (root) root.style.transform = '';
    if (S.laptop) { try { well.boss(null); } catch { /* gone */ } }   // the hatch's clock, the camera and her box go back to the laptop's own
    else { try { well.set({ eye: null, rise: null, ...(keep ? { light: HELD_LIGHT } : {}) }); } catch { /* gone */ } }   // the eye, clock, depth anchor and her path go back to the well's own; done, her light stays at the wake's floor (THE DARK STAYS)
    if (S.painted && !keep) reveal();   // THE DARK STAYS: a done entrance leaves her the dark one; one stopped midway gives her own colours back
  }
  function finish() {
    S.playing = false; release(true); S.stage = 'done';
    const d = S.done; S.done = null; if (d) d(S.plan);
  }
  return {
    // THE JOURNEY FACE RESUMES (Oct 20 2026 13:00:56 WEST; mac-onboarding.html resumeAt): a page loaded again with his press standing on the record starts here where the
    // record says. door: the plan laid so that its cutscene ends NOW: the gate is asked on the first frame and the picture held is the cutscene's last instant, as if the
    // mist had just played (no mist replayed: the sound never restarts the picture, The rule 8). plan handed whole (every time of PLAN_KEYS: the record's acknowledged
    // scan.entrance.plan): it is the plan, sampled at now, never rebuilt (a late receiver, as ungate takes a mirror's); past its dark she is the dark one from the first
    // frame (THE DARK STAYS), past its end it is done at once.
    play({ plan = null, hit_ms = null, after_ms = 0, blend_ms = 0, gate = null, door = false } = {}) {   // after_ms: the opening's handoff START, not the instant the box has disappeared; blend_ms: the shared camera handoff
      if (S.playing) return Promise.resolve(null);
      const st = well.state(), p0 = win.performance.now();
      const h0 = num(st?.offset_ms) && num(win.performance.timeOrigin) ? win.performance.timeOrigin + p0 + st.offset_ms : num(st?.house_ms) ? st.house_ms : Date.now();
      S.seat = st?.seat || null; S.h0 = h0; S.p0 = p0; S.painted = null; S.flipped = false; S.frames = 0; S.said = 0;
      S.laptop = well.kind === 'laptop' && typeof well.boss === 'function';   // THE LAPTOP IS A STAGE: its box is the entrance's, from his press
      if (S.laptop) { after_ms = 0; blend_ms = 0; }
      S.jolts = []; S.fired = 0; S.rank = -1; S.taunted = 0; S.scene = null; S.line = -1; S.told = 0; S.shots = []; S.phase = null; clearFx();
      S.presses = []; S.pressedAt = -Infinity; S.cosmo = 0; S.shown = -1; S.final = null; S.verdict = null;   // THE REVIVAL, fresh
      S.sharedSource = null; S.acceptedMashes = []; S.reaction_ms = 0; S.wrote = null;
      S.gate = typeof gate === 'function' ? gate : null; S.gated = null; S.held = 0;   // THE GATE AT HER LINE'S DOOR: the page's, asked once at the dark's door
      const was = st?.paint?.parts || {}; S.saved = Object.fromEntries(Object.keys(DARK_PAINT).map((k) => [k, typeof was[k] === 'string' ? was[k] : null]));   // every part named: a null is her born colour (lyssajudron.mjs paint skips an unnamed part)
      const delay = num(after_ms) && after_ms > 0 ? after_ms : 0, hp = h0 + delay;
      S.blend_ms = num(blend_ms) && blend_ms > 0 ? blend_ms : 0;
      const timing = delay > 0 ? { ...boss, lead_ms: 0 } : boss;
      const ambush = st?.box?.entrance === 'ambush';
      const whole = plan && PLAN_KEYS.every((k) => num(plan[k])) && num(plan.beat_ms) && plan.beat_ms > 0 ? plan : null;   // THE JOURNEY FACE RESUMES: the record's acknowledged plan, whole
      S.plan = whole ? { ...whole, bar_ms: num(whole.bar_ms) && whole.bar_ms > 0 ? whole.bar_ms : whole.beat_ms * BEATS_PER_BAR, grid: whole.grid && typeof whole.grid === 'object' ? whole.grid : gridOf(null), freeze_ms: num(whole.freeze_ms) ? whole.freeze_ms : boss.freeze_ms }
        : ambush ? ambushPlan({ grid: st?.grid, now_ms: h0, cover_ms: st.box.cover_ms, after_ms: delay, hit_ms: plan && num(plan.end) ? plan.end : hit_ms, boss }) : (plan && bossPlanOf(plan, { now_ms: hp, boss: timing })) || bossPlan({ grid: st?.grid ?? null, now_ms: hp, hit_ms, boss: timing });
      if (door && !whole) { const d = darkOf(S.plan) - h0; if (d > 0) for (const k of PLAN_KEYS) S.plan[k] -= d; }   // THE DOOR AT ONCE: the cutscene laid back so that it ends now; its last instant is the picture held while the gate is asked
      S.from = whole ? 'the record' : door ? 'the door' : plan && S.plan.hit_ms === plan.end ? 'the opener' : ambush ? 'the box mouth' : S.laptop ? 'the laptop' : 'the well';
      S.programs = S.laptop ? null : [bossProgram(S.seat, S.plan, false, boss), bossProgram(S.seat, S.plan, true, boss)];
      S.cuts = cutsOf(S.plan);
      if (delay > 0 || (whole && h0 >= S.plan.dark_ms)) { try { S.painted = well.paint({ ...DARK_PAINT }); } catch { /* an older well */ } }   // the same dark companion is revealed by the lid; no recolour at the camera handoff; a plan resumed past its dark: she is the dark one from the first frame (THE DARK STAYS)
      if (root) root.remove(); build(); if (!S.laptop) root.classList.add('flat'); S.stage = 'idle'; S.playing = true; listen(true);   // flat: a stage with no mist of its own (her well): the layer's veil is the mist
      return new Promise((ok) => { S.done = ok; S.raf = win.requestAnimationFrame(frame); });
    },
    skip() { if (!S.playing) return; S.stage = 'tail'; root?.classList.add('out', 'gone'); finish(); },
    stop() { if (S.playing) { S.playing = false; release(); S.stage = 'stopped'; const done = S.done; S.done = null; done?.(null); } listen(false); clearFx(); try { root?.remove(); } catch { /* gone */ } root = null; },
    state: () => ({ stage: S.stage, playing: S.playing, seat: S.seat, from: S.from ?? null, frames: S.frames, said: S.said, plan: S.plan ? { ...S.plan, grid: { ...S.plan.grid } } : null,
      laptop: S.laptop, cuts: S.fired, of: S.cuts.length, rank: S.rank >= 0 ? boss.ranks?.[S.rank]?.[0] ?? null : null, taunts: S.taunted,
      scene: S.scene, shots: S.shots.slice(), told: S.told, phase: S.phase ?? null,   // phase: THE MIST's dissolve in force (cs-in, mid, cs-out)
      revival: boss.revival ? { presses: S.presses.length, cosmo: Math.round(S.cosmo * 1000) / 1000, final: S.final == null ? null : Math.round(S.final * 1000) / 1000, verdict: S.verdict, listening: !!S.ears } : null,
      gated: S.gated ? { open: S.gated.open, at_ms: S.gated.at, held_ms: S.held } : null,   // THE GATE AT HER LINE'S DOOR: held, or how long it held
      house_ms: S.playing ? Math.round(house()) : null }),
  };
}

/** bossEntrance({well, plan, root, shake}): THE ONE CALL a page makes (the converging seat's mount, introduceLyssajudron in mac-onboarding.html): her
 *  entrance on its root (her card), cut by the opener's plan. -> { done (settles when the well is handed back), skip, stop, state } */
export function bossEntrance({ well, plan = null, root, shake = null, keepBar = false, onHit = null, after_ms = 0, blend_ms = 0, gate = null, door = false, win, doc } = {}) {   // door, or a whole plan: THE JOURNEY FACE RESUMES (play above)
  const b = mountBossIntro({ well, stage: root, shake, keepBar, onHit, ...(win ? { win } : {}), ...(doc ? { doc } : {}) });
  return { done: b.play({ plan, after_ms, blend_ms, gate, door }), skip: b.skip, stop: b.stop, state: b.state };
}

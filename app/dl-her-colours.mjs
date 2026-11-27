// dl-her-colours.mjs · HER COLOURS ON THE MINT (Oct 28 2026, lane/her-colours-on-the-mint; plans/the-marketing-plan-2026-10-28.md, lane 1): the law of
// her paint as the mint's page makes it, pure (no DOM, no clock of its own, no network). The page half is dl-her-colours.js.
//
// His words (UTC). Oct 12 03:48, over Harmony's first onboarding: "i want to see the lyssajudron first introduced and there i want it to be introduced
// with a color spectrum picker, like as if that is the only thing customizable about the lyssajudron (the color of the light)". Oct 12 22:04: "it is
// awful if you automatically start this as pre-configured colors... think about a kid unboxing a toy". Oct 18 03:01: "there is gotta be continuiuty on
// the colors and selection of the lyssajudron minted". Oct 27 17:34: "what if we migrated the lyssajudron minting from harmony app to the website here?".
// Oct 28 13:13: "let's move the color customization of the introduction and all to optimism.fit"; 13:32: "it's not just colors... the karaoke the music
// the colors are supposed to bring up community". Oct 28 13:55, over Harmony's screen after the code: "i said that we should have moved it to the mint
// page". Oct 28 14:11, his pick: making her comes before the seats, free.
//
// THE SAME LAW AS HARMONY'S. The drum's six chambers in the order they fire, the bare and the ice she comes out of the box in, the field (the hue across;
// for a part the lightness down at one saturation, for her light the hue alone at the gold's law), the gold that turns a hue into her light, the hue's
// names and the die are Harmony's own (tools/embertide-mesh/mac-onboarding.html, the pick), number for number: dl-her-colours.test.mjs reads them out of
// that page and fails on a digit of drift, for as long as Harmony still has a drum. The parts, their born colours, her eyes' forms and the two refs'
// schemas are her-face.js's (HER_FACE, the one source every glass draws her by).
//
// WHAT IT MAKES: the Nest's own two values, the paint ref (scene/entities/golem-lyssajudron-paint) and the light ref (-light), written exactly as
// Harmony's pick writes them, kept in the visitor's browser (KEEP_KEY) until the key carries them (the plan's lane 4: the box writes them to the Nest).
// Every glass then draws them with lyssajudron.mjs paint() and light(), part by part, as it draws the ones made in Harmony.
import '../vendor/embertide-app/ui/intro/room/her-face.js';   // HER FACE, ONE SOURCE: it hands itself over as globalThis.HER_FACE

const HF = globalThis.HER_FACE;

export const GOLEM = 'lyssajudron';   // the refs' golem, as Harmony's pick names her
export const PARTS = HF.PAINT_PARTS;   // her body's layers: base (the hexagons' porcelain), coat (the pentagons), gold, eyes, thruster (her flame)
export const CHAMBERS = Object.freeze(['light', 'base', 'coat', 'gold', 'thruster', 'eyes']);   // the drum's chambers in the order they fire (Harmony's .cyl)
export const CALLED = Object.freeze({ light: 'her light', base: 'her porcelain', coat: 'her pentagons', gold: 'her gold', thruster: 'her flame', eyes: 'her eyes' });
export const BORN = HF.BORN_PAINT;   // as she was born: ivory porcelain, a deeper ivory, gold wire, ember
export const BARE = Object.freeze({ base: '#F3F3F0', coat: '#DEDEDA', gold: '#B9B9B4', eyes: '#9E9E99', thruster: '#D3D3CE' });   // THE UNBOXING: white vinyl
export const ICE = '#E9F2F8';   // her bare light: the palace's ice
export const GOLD = '#F0B90B';   // the gold whose saturation and lightness a picked hue takes to become her light (lysa-engine.js HEX_COLOR.gold)
export const FIELD = Object.freeze({ s: .82, top: .95, bottom: .08 });   // a part's field: one saturation, the lightness from near white to near black
export const FORMS = Object.freeze(Object.keys(HF.EYE_FORMS).filter((f) => f !== 'bare'));   // her eyes' forms, as the onboarding offers them
export const NAMES = Object.freeze([[15, 'red'], [40, 'amber'], [60, 'gold'], [80, 'lime'], [150, 'green'], [190, 'teal'], [215, 'sky'], [250, 'blue'],
  [285, 'violet'], [320, 'magenta'], [345, 'rose'], [361, 'red']]);
export const KEEP_KEY = 'dl.her', BORN_KEY = 'dl.her.born';   // where the visitor's browser keeps her until the key carries her; the name she was born under, when she was made in Harmony first (ONE NAME FOR HER)

const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);
const turn = (h) => ((h % 360) + 360) % 360;
export const hexOk = HF.hex;   // '#RRGGBB' upper case, else null

/** hexToHsl('#RRGGBB') -> [hue 0..360, s, l]: Harmony's own. */
export function hexToHsl(hex) {
  const n = parseInt(hex.slice(1), 16), r = ((n >> 16) & 255) / 255, g = ((n >> 8) & 255) / 255, b = (n & 255) / 255, mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  let h = 0, s = 0;
  if (mx !== mn) { const d = mx - mn; s = l > .5 ? d / (2 - mx - mn) : d / (mx + mn); h = mx === r ? ((g - b) / d + (g < b ? 6 : 0)) : mx === g ? ((b - r) / d + 2) : ((r - g) / d + 4); h /= 6; }
  return [h * 360, s, l];
}
/** hslToHex(hue, s, l) -> '#RRGGBB': Harmony's own. */
export function hslToHex(h, s, l) {
  h = turn(h) / 360;
  const f = (p, q, t) => { if (t < 0) t += 1; if (t > 1) t -= 1; if (t < 1 / 6) return p + (q - p) * 6 * t; if (t < 1 / 2) return q; if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6; return p; };
  let r, g, b;
  if (s === 0) { r = g = b = l; } else { const q = l < .5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q; r = f(p, q, h + 1 / 3); g = f(p, q, h); b = f(p, q, h - 1 / 3); }
  const to = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return ('#' + to(r) + to(g) + to(b)).toUpperCase();
}
const GOLD_HSL = hexToHsl(GOLD);
/** goldAt(hue): her light at that hue, the gold's own saturation and lightness (what the engine lights her hexagons with). */
export const goldAt = (hue) => hslToHex(hue, GOLD_HSL[1], GOLD_HSL[2]);
export function nameOf(hue) { for (const [to, name] of NAMES) if (hue < to) return name; return 'red'; }

/** fieldColour(chamber, u, v): the colour under the hand on the field, u across (the hue), v down (a part's lightness; her light ignores it). */
export function fieldColour(chamber, u, v) {
  const h = clamp01(u) * 360;
  return chamber === 'light' ? goldAt(h) : hslToHex(h, FIELD.s, FIELD.top - clamp01(v) * (FIELD.top - FIELD.bottom));
}
/** fieldSpot(chamber, hex): where the field holds that colour, {u, v} (her light: its hue in the middle, as Harmony's thumb stands). */
export function fieldSpot(chamber, hex) {
  const [h, , l] = hexToHsl(hex);
  return { u: h / 360, v: chamber === 'light' ? .5 : clamp01((FIELD.top - l) / (FIELD.top - FIELD.bottom)) };
}

/** blank(): her as she comes out of the box: every part bare, her light the ice, no eyes' form, the light's chamber under the hammer. */
export function blank() {
  return { parts: { ...BARE }, painted: [], light: null, gaze: null, sel: 'light' };
}
/** isBare(st, chamber) */
export const isBare = (st, chamber) => (chamber === 'light' ? !st.light : !st.painted.includes(chamber));
/** colourOf(st, chamber): what the chamber shows: her light or its ice; a part's paint, its bare vinyl until painted. */
export const colourOf = (st, chamber) => (chamber === 'light' ? st.light || ICE : st.parts[chamber] || BARE[chamber]);
/** whole(st): every chamber painted (Harmony's whole(): her six fired). */
export const whole = (st) => CHAMBERS.every((c) => !isBare(st, c));

/** put(st, chamber, hex) -> a new state: that chamber painted. */
export function put(st, chamber, hex) {
  const c = hexOk(hex); if (!c || !CHAMBERS.includes(chamber)) return st;
  if (chamber === 'light') return { ...st, light: c };
  return { ...st, parts: { ...st.parts, [chamber]: c }, painted: st.painted.includes(chamber) ? st.painted : [...st.painted, chamber] };
}
/** bare(st, chamber) -> a new state: that chamber back as she came out of the box (Harmony's ↺). */
export function bare(st, chamber) {
  if (chamber === 'light') return { ...st, light: null };
  if (!PARTS.includes(chamber)) return st;
  return { ...st, parts: { ...st.parts, [chamber]: BARE[chamber] }, painted: st.painted.filter((p) => p !== chamber) };
}
/** gazeTo(st, form) -> a new state: her eyes in that form (one of FORMS), or none. */
export const gazeTo = (st, form) => ({ ...st, gaze: FORMS.includes(form) ? form : null });
/** roll(st, rand) -> a new state: Harmony's die, her paint at random round one hue (a pale porcelain, a coat across the wheel, a warm gold, vivid eyes,
 *  a flame) and her light on the flame's hue. rand: () -> [0, 1). */
export function roll(st, rand = Math.random) {
  const h = rand() * 360, r = rand;
  const parts = {
    base: hslToHex(turn(h + 25 * r()), .3 + .35 * r(), .84 + .08 * r()),
    coat: hslToHex(turn(h + 140 + 80 * r()), .55 + .3 * r(), .38 + .2 * r()),
    gold: hslToHex(turn(h + 30 + 40 * r()), .65 + .25 * r(), .5 + .15 * r()),
    eyes: hslToHex(turn(h + 170 + 40 * r()), .8 + .15 * r(), .5 + .1 * r()),
    thruster: hslToHex(turn(h + 190 + 60 * r()), .85 + .1 * r(), .52 + .1 * r()),
  };
  return { ...st, parts, painted: [...PARTS], light: goldAt(hexToHsl(parts.thruster)[0]) };
}

/** refs(st, {at, by}) -> {paint, light}: the Nest's two values as Harmony's pick writes them (its paintW and lightW), from the mint. */
export function refs(st, { at = null, by = null } = {}) {
  const when = typeof at === 'string' ? at : null, who = typeof by === 'string' && by ? by.slice(0, 64) : undefined;
  const paint = { schema: HF.PAINT_SCHEMA, golem: GOLEM, parts: Object.fromEntries(PARTS.map((p) => [p, st.parts[p] || BARE[p]])),
    painted: PARTS.filter((p) => st.painted.includes(p)), gaze: st.gaze || undefined, by: who, at: when, from: 'optimism.fit' };
  const color = st.light || ICE, h = hexToHsl(color)[0];
  const light = { schema: HF.LIGHT_SCHEMA, golem: GOLEM, color, hue: Math.round(h * 10) / 10, name: st.light ? nameOf(h) : 'ice', bare: st.light ? undefined : true,
    by: who, at: when, from: 'optimism.fit' };
  return { paint, light };
}
/** fromRefs({paint, light}) -> a state, or null when neither is hers: the inverse of refs (a kept making, or one read back). */
export function fromRefs(v) {
  const p = v && HF.paintOf(v.paint), l = v && HF.lightOf(v.light);
  if (!p && !l) return null;
  const st = blank(), painted = Array.isArray(v.paint?.painted) ? v.paint.painted.filter((x) => PARTS.includes(x)) : [];
  for (const part of PARTS) if (p && p[part]) st.parts[part] = p[part];
  st.painted = painted.filter((x) => p && p[x]);
  st.light = l && !v.light?.bare ? l : null;
  st.gaze = FORMS.includes(v.paint?.gaze) ? v.paint.gaze : null;
  return st;
}

/** keep(storage, st, now): her refs in the browser (localStorage), nothing else; kept(storage): the state kept there, or null. */
export function keep(storage, st, now = () => new Date().toISOString()) {
  try { storage?.setItem(KEEP_KEY, JSON.stringify(refs(st, { at: now() }))); return true; } catch { return false; }
}
export function kept(storage) {
  try { return fromRefs(JSON.parse(storage?.getItem(KEEP_KEY) ?? 'null')); } catch { return null; }
}
export function minted(storage, colours) { const was = kept(storage); if (!was || CHAMBERS.some((c) => colourOf(was, c) !== colours[c])) keep(storage, CHAMBERS.reduce((st, c) => put(st, c, colours[c]), blank())); try { storage?.removeItem(BORN_KEY); } catch { /* refused: her hexagon holds her */ } }   // THE MINTED ONE IS SHE (ONE NAME FOR HER, Nov 22 2026): the six colours the house says are what this browser keeps, under the house's one name; a draft of its own is gone, the very same keeps her eyes' form
// HIS LYSSAJUDRON'S NAME (THE CREATOR, his Oct 30 2026 06:28:18 UTC: "perhaps we could treat better the lyssajudron character creation page... like as if it
// was a true mmo"): the one field he types in her making, kept in this browser beside her refs (NAME_KEY), never inside them: the refs are Harmony's contract
// (her-face.js reads their two shapes), and the key carries them alone until the box reads a name.
export const NAME_KEY = 'dl.her.name', NAME_MAX = 18;
/** herName(raw): a name as he typed it, fit to keep: no control character, one space between words, none at either end, NAME_MAX letters at most. Pure. */
export function herName(raw) {
  return [...String(raw ?? '').replace(/\s+/g, ' ').replace(/[\u0000-\u001f\u007f]/g, '').trim()].slice(0, NAME_MAX).join('').trim();
}
/** keepHerName(storage, name): kept (none when it is empty); keptHerName(storage): the name kept, or ''. */
export function keepHerName(storage, name) {
  try { const n = herName(name); if (n) storage?.setItem(NAME_KEY, n); else storage?.removeItem?.(NAME_KEY); return true; } catch { return false; }
}
export function keptHerName(storage) {
  try { return herName(storage?.getItem(NAME_KEY) ?? ''); } catch { return ''; }
}

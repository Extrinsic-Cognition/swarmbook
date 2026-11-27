// glass-look.mjs: THE GLASS IS TRANSPARENT, ALWAYS, AND ITS LOOK IS HIS (lab/theater.js reads it). His words, Oct 17 2026 WEST: 20:4x, over the debug
// start's still of the dodecahedron as flat opaque faces (periwinkle toward the eye, mint, blue, purple, magenta) over Seiya in the gold: "why the
// fuck is it like this at the beginning and is not like glass?" and "it must be a glass i. dont want to seethis it must be transparent"; 20:5x, told
// the fix was queued: "are you kidding me? what do i gotta do to be able to edit this manually? do you understand the anamorphic shadow beef with
// butterflies i was telling you about or not??"; 21:1x: "it is a massive failure if i cant edit in my canvas-mcp my dude".
// WHAT HE SAW: THE CUTS' device (lab/CUTS.md, his Oct 14 "predictable transitions") drew a burst's first tenth of a second as the glass's normals and
// the next tenth as a flat gold matte, judged by the film's second alone, and the debug start (app/dl-twelve-clock.js rule 7) holds the film 5 ms into
// the second burst until the hero is up: the flash stood as a still for the whole load.
// THE LAW NOW: the glass is a shadow, as the butterflies' and the one overlay's shadows are (docs/inverse-anamorphic-butterflies-on-the-sleepy-ipad-
// hypertrace-2026-10-14.md, room/ONE-OVERLAY-LANDING.md): the film seen through its faces, its gold leading, its dark halo, its refraction, light
// added over the film at a flash; never a fill or a flat colour of its own, not as a still and not as a flash. The box's and Athena's cuts are not in
// his word and keep their device.
// HIS HAND ON IT: the look is the Nest's entry mint/glass {pass, by, at}, his to set from the Canvas (the serving Mac's hands "Mint glass: ..." in
// tools/embertide-mesh/house-hands.mjs, which run tools/mint-glass.mjs), read once at the page's load on his house's doors (asksNest: loopback, the
// LAN, a .local name), never by a browser under automation; ?glass=none|cuts on the page's address wins (a proof's word). With no word, and on
// optimism.fit, the glass is transparent. pass 'cuts' brings THE CUTS' flash back by his word only, and then only while the film plays through the
// burst's first fifth of a second: a held film shows the glass, never the pass.
// COST: one GET of a ~150 B ref at the page's load on his doors (none on optimism.fit, none under automation); no follow, nothing at rest. Per draw a
// comparison or two.
import {asksNest} from '../app/dl-twelve-clock.js?v=debug-start-2';

export const GLASS_REF = 'mint/glass';
export const PASSES = Object.freeze(['none', 'cuts']);
export const CLEAR = Object.freeze({pass: 'none', from: 'default'});

/** A word -> the look it names, or null for a word that names none ('cuts' or 'none', any case, around spaces). */
const passOf = (word) => {
  const s = String(word ?? '').trim().toLowerCase();
  return PASSES.includes(s) ? s : null;
};

/** The Nest's entry mint/glass -> the look: {pass: 'none' | 'cuts', from: 'nest'}; no entry, or any other value, is the transparent glass. */
export function lookOf(value) {
  const pass = value && typeof value === 'object' ? passOf(value.pass) : null;
  return pass ? Object.freeze({pass, from: 'nest'}) : CLEAR;
}

/** The look the page's address asks for (?glass=none|cuts), or undefined when it names none (the Nest's word may then decide). */
export function lookOfAddress(search) {
  const v = new URLSearchParams(search || '').get('glass');
  if (v === null) return undefined;
  const pass = passOf(v);
  return pass ? Object.freeze({pass, from: 'address'}) : CLEAR;
}

/** Which pass a burst's glass is drawn as at its age (seconds of the burst, -1 none): 0 the glass (the film through it), 1 the normals, 2 the gold
 *  matte. Only his word 'cuts' gives 1 or 2, and only while the film moves through the burst's first fifth of a second; a held film (the debug
 *  start's hold, a pause) shows the glass. */
export function passAt(age, {look = CLEAR, moving = false} = {}) {
  if (look?.pass !== 'cuts' || !moving || !(age >= 0)) return 0;
  return age < 0.1 ? 1 : age < 0.2 ? 2 : 0;
}

/** The look for this page, once, at its load: the address's word, else the Nest's on his house's doors (never under automation), else the clear
 *  glass. Never throws: a Nest that does not answer in 3 s leaves the glass transparent. */
export async function readLook({search = '', hostname = '', protocol = 'http:', webdriver = false, fetch = globalThis.fetch, nest = null} = {}) {
  const asked = lookOfAddress(search);
  if (asked) return asked;
  if (!asksNest(hostname) || webdriver || typeof fetch !== 'function') return CLEAR;
  try {
    const base = (nest || `${protocol}//${hostname}:8904`).replace(/\/$/, '');
    const r = await fetch(`${base}/nest/ref/${GLASS_REF}`, {cache: 'no-store', signal: AbortSignal.timeout(3000)});
    return r.ok ? lookOf((await r.json())?.ref?.value) : CLEAR;
  } catch { return CLEAR; }
}

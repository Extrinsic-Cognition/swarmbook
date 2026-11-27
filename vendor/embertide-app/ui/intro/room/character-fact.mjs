// character-fact.mjs: THE SEAT IS BORN (Nov 1 2026, lane/the-seat-is-born). His words, UTC: 20:35 "it is no proper MMO if we dont properly handle the character
// creation... look at the shit i see on mac"; 20:36 "this is all shit that is lacking character creation and companions/golems below"; 22:1x "Yes, cut the
// birth", over "Is a `character` entry on the Nest your word, so the seat's birth at its vow can be cut next?". The lineage:
// docs/the-party-is-born-character-creation-and-the-companions-below-hypertrace-2026-11-01.md (a member of the party is born, never listed).
//
// One entry of the Nest a character: character/<id> = { schema, kind, of, name, face, chair, born: { at, how } }. This lane births one kind, the seat: a
// session at work is born at its vow (cua/agents/<seat>.vow, THE OATH ON THE NEST) by its own hand (session-parts.mjs: at the vow, and at its next prompt
// for a seat that swore before this lane), a silhouette: no name, no face and no chair until his pick gives them (his typed word, signed: the next lane).
// It dies with its seat: the session's end writes it null as it writes the entry, and the reaper takes it with the entry. The vow's words never reach it
// (they stay off every glass by the oath's own rule): `born` says the moment and how, nothing of the oath or its line. Pure; no state, no timer.
// THE WARDEN IS PICKED (Nov 1 2026, his 23:10 UTC "assume that everything was built for a general png or whatever, then replace those general values with
// neferittis' ones... do backup of what we got, replace or whaytever then put the image back as if i selected it in my onboarding"): the account's warden of
// the spool is one character too, character/warden, as the onboarding picks it: a name and an image (any PNG; its bytes on the Nest by their sha256), born
// at the pick (how: 'onboarding'), one an account. No glass names her picture by a path of its own: each draws the warden's face from this entry, so his
// Nefertiti is the values of his pick (tools/embertide-mesh/onboarding-pick.mjs) and a new account's warden is its own.
// HER CARD IS THE PICK'S (Nov 2 2026): the warden's hand-off card (dyson-society/app/dl-handoff.mjs CARD: the picture the phone's camera holds) is made from
// the picked image at the pick (dyson-society/tools/her-card.mjs makeCard), and the entry names its three pictures by sha256: card = { sprite (the face
// fitted and thinned, laid over the perch), perch (the card without her), card (the two together: ARKit's reference), team (THE POSTERS: whose Claw Riders
// poster it is, a starter's id) }, or null when none was made.
export const CHARACTER_PREFIX = 'character/', CHARACTER_SCHEMA = 'embertide.character/1';
export const CHARACTER_KINDS = Object.freeze(['seat', 'warden']);   // the player and the companion come with their own births
export const WARDEN_ID = 'warden', WARDEN_REF = CHARACTER_PREFIX + WARDEN_ID;   // one warden an account: its entry's name is the role, never hers
const HOW = Object.freeze({ seat: 'vow', warden: 'onboarding' });
export const NAME_MAX = 40, CHAIRS = 12;   // a name as a party row holds it; the curiae's twelve chairs (a budget, never a requirement: his Nov 1 01:32 UTC)
const SEAT = /^[A-Za-z0-9_.-]{1,48}$/, HEX64 = /^[0-9a-f]{64}$/;
const num = (v) => typeof v === 'number' && Number.isFinite(v);
const CARD_PICTURES = Object.freeze(['sprite', 'perch', 'card']), TEAM_ID = /^[a-z]{1,16}$/;   // a team's id is the maker's (dyson-society/tools/her-card.mjs TEAMS)
/** cardOf(c): a warden's card read whole: its three pictures by sha256 and the team whose poster it is, when named; or null */
export const cardOf = (c) => (c && typeof c === 'object' && CARD_PICTURES.every((k) => typeof c[k] === 'string' && HEX64.test(c[k]))
  ? { sprite: c.sprite, perch: c.perch, card: c.card, ...(typeof c.team === 'string' && TEAM_ID.test(c.team) ? { team: c.team } : {}) } : null);
const nameOf = (v) => (typeof v === 'string' ? v.replace(/[\u0000-\u001f\u007f-\u009f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, NAME_MAX) : '') || null;

/** characterOf(value, id): one character/<id> value read whole -> { kind, of, name, face, chair, born: { at, how } }; null for another schema or kind, a seat's
 *  character whose `of` is not its id, the warden under another id, or a birth with no moment or another road (a seat at its vow, the warden at its pick). A
 *  name is one line, a face the sha256 of its bytes on the Nest, a chair one of the twelve. */
export function characterOf(v, id = null) {
  if (!v || typeof v !== 'object' || v.schema !== CHARACTER_SCHEMA || !CHARACTER_KINDS.includes(v.kind)) return null;
  if (v.kind === 'seat' && (typeof v.of !== 'string' || !SEAT.test(v.of) || (id !== null && v.of !== id))) return null;
  if (v.kind === 'warden' && (v.of !== null || (id !== null && id !== WARDEN_ID))) return null;
  const b = v.born && typeof v.born === 'object' ? v.born : null;
  if (!b || !num(b.at) || b.how !== HOW[v.kind]) return null;
  return { kind: v.kind, of: v.of, name: nameOf(v.name), face: typeof v.face === 'string' && HEX64.test(v.face) ? v.face : null,
    chair: Number.isInteger(v.chair) && v.chair >= 1 && v.chair <= CHAIRS ? v.chair : null, born: { at: b.at, how: b.how }, ...(v.kind === 'warden' ? { card: cardOf(v.card) } : {}) };
}
/** wardenPick({ name, face, at, card }): the account's warden as its onboarding picks it: a name, the sha256 of the picked image's bytes on the Nest, and
 *  the hand-off card made from it (cardOf), or none */
export const wardenPick = ({ name, face, at, card = null }) => ({ schema: CHARACTER_SCHEMA, kind: 'warden', of: null, name: nameOf(name), face: typeof face === 'string' && HEX64.test(face) ? face : null,
  chair: null, born: { at, how: 'onboarding' }, card: cardOf(card) });
/** wardenOf(refs): the warden a page holds (Map or object: name -> { value }), or null when none was picked */
export function wardenOf(refs) {
  const r = refs instanceof Map ? refs.get(WARDEN_REF) : refs && typeof refs === 'object' ? refs[WARDEN_REF] : null;
  return r && typeof r === 'object' ? characterOf(r.value, WARDEN_ID) : null;
}
/** faceSrc(face, base): where a glass reads a face: the Nest's blob door at its base (the Nest itself, or the Canvas's relay); null for no face */
export const faceSrc = (face, base = '') => (typeof face === 'string' && HEX64.test(face) ? `${String(base || '').replace(/\/+$/, '')}/nest/blob/${face}` : null);
/** seatBirth({ seat, at }): what a seat is born as at its vow: a silhouette, at the vow's own moment */
export const seatBirth = ({ seat, at }) => ({ schema: CHARACTER_SCHEMA, kind: 'seat', of: seat, name: null, face: null, chair: null, born: { at, how: 'vow' } });
/** birthOf({ seat, vowAt, held }): the value to write for a seat that has sworn (vowAt: its vow's moment) while no character of it stands (held: what
 *  character/<seat> holds now); undefined otherwise. A character is born once: its birth never writes over one, named or not. */
export function birthOf({ seat, vowAt, held = null }) {
  if (typeof seat !== 'string' || !SEAT.test(seat) || !num(vowAt) || characterOf(held, seat)) return undefined;
  return seatBirth({ seat, at: vowAt });
}
/** charactersOf(refs): the seats' characters among the refs a page holds (Map or object: name -> { value }) -> Map seat -> character; a ref that left (null),
 *  another schema, or a character whose `of` is not its own name's tail is none */
export function charactersOf(refs) {
  const out = new Map();
  for (const [name, ref] of refs instanceof Map ? refs : Object.entries(refs && typeof refs === 'object' ? refs : {})) {
    if (typeof name !== 'string' || !name.startsWith(CHARACTER_PREFIX) || !ref || typeof ref !== 'object') continue;
    const id = name.slice(CHARACTER_PREFIX.length), c = characterOf(ref.value, id);
    if (c && c.kind === 'seat') out.set(id, c);
  }
  return out;
}

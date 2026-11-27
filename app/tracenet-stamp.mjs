// tracenet-stamp.mjs: THE STAMP IS THE COSIGN (Oct 29 2026, lane/the-stamp-is-the-cosign; the design: ec-workspace docs/beat-cosign-with-true-neutrality-
// 2026-10-25.md section 5 points 3 and 4, docs/tamagotchi-pokemon-exchange-the-lineage-hypertrace-2026-10-27.md section 10). His words: "THE VOTES ARE
// "STAMPS OF APPROVALS" ON CONCEPTS / POINTED-INFORMATION... IT'S ALL ABOUT POINTERS AND REPUTATION MY DUDE!!!!" (Sept 8 2026 03:38 WEST); "we gotta beat
// cosign by a16z with true neutrality" (Sept 28 02:45); "what do they trade dude? think... we have been trying to build cosign alternative... they network"
// (Oct 27 03:16 WET); "EVERY PROBLEM IS SOLVED ONLY ONCE" (Oct 17). Cosign by a16z counts who believes in a person, and a16z holds that graph. Here a stamp
// is on a pointer, a drop's sha256, and it is earned by use: the stamper, whose agent followed the drop and opened a /snow door with it, signs the stamp;
// the drop's creator countersigns the same words; the two signatures are the cosign. It lives with both wallets (each one's Nest keeps it as
// stamps/<id>), and any index may keep a copy (the register's D1 is one: worker/creators.mjs POST <handle>/stamps). Every reader checks both signatures
// itself, so no database is its authority. A stamp carries nobody's words: two wallets, a hash, a door and an instant. Nothing of a room or a trace can
// ride it out of a Nest, so its shape is its sanitization. A stamper counts once on a pointer, and nobody stamps their own drop.
//   STAMP_DOORS                          the /snow doors a follow opens (life-menu/the-room.mjs DOORS; its test pins them equal)
//   stampText(stamp)                     the words both wallets sign, one field a line
//   stampOf(input)                       the stamp's five fields, each by its own law, or null
//   stampId(stamp)                       the sha256 hex of its words: its name in every Nest (stamps/<id>) and every index
//   proveStamp(signed)                   {id, cosigned} when the stamper's signature verifies (cosigned: the creator's too), else null
//   stampKey(signed)                     what a reader remembers a proof by: the five fields and both signatures
//   proveStamps(list, proven)            proves into `proven` (stampKey -> proveStamp's answer) the stamps it does not hold yet; resolves to how many
//   cosignsOn(list, {on, by}, proven)    the stampers whose stamp on this pointer by this creator `proven` holds cosigned, each once; null with no pointer
// Pure: no clock, no storage; WebCrypto's SHA-256 and Ed25519 by the drop line's own check (walletSigned). Nothing runs at rest.
import { WALLET, SIG } from './tracenet-register.mjs';
import { lineHash, walletSigned } from './tracenet-drop-line.mjs';

export const STAMP_SCHEMA = 'optimism.tracenet/stamp/1';
export const STAMP_DOORS = Object.freeze(['GAMEPAD', 'ASSETS', 'API', 'MEMORY', 'MOD']);   // the Rosetta stone's five doors (THE GAME SPELL IS SNOW)
export const STAMP_PREFIX = 'stamps/';   // a stamp's entry on a Nest: stamps/<id>
// the wallet shows this line (mine, his to reword; it lives inside every signed stamp, so a new line is a new schema)
export const STAMP_STATEMENT = 'Sign this line to stamp a drop your agent followed, or to countersign a stamp on a drop of yours. This sends no transaction and moves no funds.';
const HASH = /^[0-9a-f]{64}$/;
const isInstant = (s) => typeof s === 'string' && Number.isFinite(Date.parse(s)) && new Date(Date.parse(s)).toISOString() === s;

/** The words the stamper's wallet and the drop's creator's wallet both sign, one field a line (each field bounded by its own law: stampOf). */
export function stampText({ stamper, by, on, door, at }) {
  return `A tracenet stamp, countersigned by the drop's creator:\n${stamper}\n\n${STAMP_STATEMENT}\n\nStamper: ${stamper}\nCreator: ${by}\nDrop: ${on}\nDoor: ${door}\n` +
    `Followed: ${at}\nSchema: ${STAMP_SCHEMA}`;
}
/** {stamper, by, on, door, at} when each field keeps its law (two wallets, never the same one; a sha256; one of the five doors; an instant as toISOString
 *  writes it), else null. Nothing else of the input is kept: the signatures travel beside the stamp. */
export function stampOf(input) {
  if (!input || typeof input !== 'object') return null;
  const { stamper, by, on, door, at } = input;
  if (!WALLET.test(stamper ?? '') || !WALLET.test(by ?? '') || stamper === by) return null;
  if (!HASH.test(on ?? '') || !STAMP_DOORS.includes(door) || !isInstant(at)) return null;
  return { stamper, by, on, door, at };
}
export const stampId = (stamp) => lineHash(stampText(stamp));
/** {id, cosigned} when signed.sig is the stamper's signature over the stamp's words (cosigned: signed.cosig is the creator's over the same), else null. */
export async function proveStamp(signed) {
  const s = stampOf(signed);
  if (!s || !SIG.test(signed.sig ?? '')) return null;
  const text = stampText(s);
  if (!await walletSigned(s.stamper, signed.sig, text)) return null;
  const cosigned = typeof signed.cosig === 'string' && SIG.test(signed.cosig) && await walletSigned(s.by, signed.cosig, text);
  return { id: await lineHash(text), cosigned };
}
/** What a reader remembers a proof by: the five fields and both signatures (a stamp whose countersign changes is proven again). */
export const stampKey = (signed) => (signed && typeof signed === 'object' ? [signed.stamper, signed.by, signed.on, signed.door, signed.at, signed.sig, signed.cosig ?? ''].map(String).join('|') : '');
/** Proves into `proven` every stamp of the list it does not hold yet (each once: a reader's whole cost); resolves to how many it proved now. */
export async function proveStamps(list, proven) {
  let n = 0;
  for (const s of Array.isArray(list) ? list : []) { const k = stampKey(s); if (!k || proven.has(k)) continue; proven.set(k, await proveStamp(s)); n++; }
  return n;
}
/** The stampers whose stamp on `on` by `by` the proofs hold cosigned, each counted once; null when the pointer or its creator's wallet is not named. */
export function cosignsOn(list, { on, by } = {}, proven = new Map()) {
  if (!HASH.test(on ?? '') || !WALLET.test(by ?? '')) return null;
  const who = new Set();
  for (const s of Array.isArray(list) ? list : []) if (s && s.on === on && s.by === by && proven.get(stampKey(s))?.cosigned === true) who.add(s.stamper);
  return who.size;
}

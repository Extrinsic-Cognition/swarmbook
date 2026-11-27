// dl-her-friends.mjs · A FRIEND GRANTS A WISH (Oct 29 2026, lane/a-friend-grants-a-wish): the law of her code, of a friend's birth from a link to her and of
// the wish it grants the sharer, pure (no DOM, no clock of its own, no network). The page half is dl-her-colours.js (her code drawn at the share's press, the
// birth told, the wishes granted); the doors were the Worker's, worker/her.mjs (migration 0009_her_births.sql), gone since lane/one-phone-one-birth: a friend
// counts when born in DysonLight (worker/space-router.mjs hello); the link is dl-her-reel.mjs's (herLink).
//
// His words (UTC). Sept 18 15:31: "why the fuck dont we make referral codes or invte codes"; Oct 16 07:3x: "IT IS ALL ABOUT DECOMP AND SHARE AND INVITE GAMES
// MY DUDE OMG"; Oct 29 18:33, over her making at 4/12: "how do we go from this to something that can go viral my dude? like socially shared... we have the
// chance to kickstart some cool shit here with $WARM rebates for users and $POOL for long term stakers..."; 20:28, to "Build the referral next, a wish to the
// sharer for each friend whose Swarmy is born?": "Yes, build it".
//
// HER CODE, CODE_LENGTH letters of the Society's alphabet (dl-society-codes.mjs: Crockford's base32, read alike by the page and the Worker), every visitor's own
// and free: drawn in this browser at their first press of her reel's share and carried by the link to her (#her=), never by ?ref=, the paid seat's code, which
// the checkout freezes on an order (REFERRALS.md: a code that is no paid seat's refuses the order). A length no other code of the Society has (a seat's is 8,
// a claim's 12), so neither is ever read as the other.
// A FRIEND'S BIRTH: a friend who opens that link lands on the sharer's her (a visit, dl-her-colours.js) and makes her their own at their first stroke; their
// browser keeps the sharer's code as its ref (arrived: the latest link wins, as a paid seat's code does) unless their own her was born before, or told, or the
// code is their own. Her eyes open (all six chambers fired: her birth, the climax of Harmony's film of it, room/birth-film.mjs) and their browser tells the
// Worker once, its own code drawn then if it has none. (Gone since lane/one-phone-one-birth, Nov 1 2026: the web's two doors of births, worker/her.mjs; a
// friend counts when born in DysonLight, at the app's hello, worker/space-router.mjs. The browser still keeps the ref and hands it to the app's door.)
// THE WISH IT GRANTS (as it stood on the web until THE WISH IS IN THE APP; the door counts a code's friends now, dl-her-wishes.mjs onHouse, and granted
// below is read by no page): when her making opened, the sharer's browser asked how many friends were born from its code (the old /api/her/friends?code=) and spent a wish of theirs
// for each one it has not granted yet (granted), as a fired chamber spends one: the bar moves, and a rung's last brings the next pentagon in her slam. A wish
// granted is a wish used, in the genie's lore and on his ladder, where using her wishes is what brings the next pentagon (dl-her-wishes.mjs). The share carries
// the count of friends born: a number, no word (his Oct 29 06:07: only words he acts on).
// KEPT in this browser beside her wishes (KEEP_KEY): her code, the ref until her birth is told, whether it was, the friends granted; never on the Nest.
// NOT HERE: a person (two codes a browser drew: no address, no wallet, no name); $WARM, $POOL or SOL: a wish on her bar. A birth is a browser's word, so a hand
// can make friends of itself (a cleared browser, a second one): the day a rebate rides a birth, a birth needs more proof than that, his call.
import { normalizeCode, randomCode } from './dl-society-codes.mjs';

export const CODE_LENGTH = 10;   // 50 bits: never guessed, and a length of its own
export const KEEP_KEY = 'dl.her.friends';   // {code, ref, told, seen, at}
export const MOST = 9999;   // a count at most, as the link's (dl-her-reel.mjs)
/** isHerCode(c): a her code in its canonical form (upper case, ungrouped) */
export const isHerCode = (c) => typeof c === 'string' && c.length === CODE_LENGTH && normalizeCode(c, CODE_LENGTH) === c;
/** draw(random): a fresh her code, each letter from one random byte (dl-society-codes.mjs randomCode) */
export const draw = (random) => randomCode(CODE_LENGTH, random);
/** none(): a browser that keeps nothing of her friends */
export const none = () => ({ code: null, ref: null, told: false, seen: 0 });
/** count(n): a count as the Worker says it, else 0; at most MOST */
export const count = (n) => (Number.isInteger(n) && n > 0 ? Math.min(n, MOST) : 0);
/** kept(storage): what this browser keeps of her friends; anything broken or foreign is none */
export function kept(storage) {
  try {
    const v = JSON.parse(storage?.getItem(KEEP_KEY) ?? 'null'); if (!v || typeof v !== 'object') return none();
    return { code: isHerCode(v.code) ? v.code : null, ref: isHerCode(v.ref) ? v.ref : null, told: v.told === true, seen: count(v.seen) };
  } catch { return none(); }
}
/** keep(storage, f, now): her friends as this browser stands, in this browser, nothing else */
export function keep(storage, f, now = () => new Date().toISOString()) {
  try { storage?.setItem(KEEP_KEY, JSON.stringify({ code: f.code, ref: f.ref, told: f.told === true, seen: count(f.seen), at: now() })); return true; } catch { return false; }
}
/** arrived(f, code, whole): a visit from a link carrying `code` ended at this browser's first stroke: the sharer's code kept as its ref (the latest link wins),
 *  unless it is no her code, this browser's own, its own her was born before (whole) or her birth is told; the same f when nothing changes */
export function arrived(f, code, whole) {
  if (!isHerCode(code) || code === f.code || code === f.ref || f.told || whole) return f;
  return { ...f, ref: code };
}
/** granted(seen, born): the wishes the friends born grant now, those not granted before */
export const granted = (seen, born) => Math.max(0, count(born) - count(seen));

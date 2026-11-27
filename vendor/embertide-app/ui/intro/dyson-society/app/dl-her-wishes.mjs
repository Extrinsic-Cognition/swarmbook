// dl-her-wishes.mjs · HER THREE WISHES (Oct 29 2026, lane/her-three-wishes): the law of the wishes her making starts with, pure (no DOM, no clock of its
// own, no network). The page half is dl-her-colours.js: the wish bar on her making and the mint's mount of her (stageHer's `wishes`).
//
// His words (UTC). Sept 24 18:03: "i want harmony to feel like a inventory or a menu for real life... treating my life as if it was cyberpunk or watchdogs
// or XCOM". Oct 13 04:52: "he is the genie that can grant 3 wishes". Oct 17 03:19: "the lore is: * lyssajudron is dead * nefertiit comes and offers 3
// wishes (aka: trial for 3 ai calls before quitting)". Oct 21 12:05: "keep the 12 unit1 satellites steady". Oct 27 03:26: "the entire point of
// gamification of spending with the mmo effects". Oct 29 17:29, over her making ("Give me my colours."): "u been following what i said about the 12 things
// here or not dude? you should make that it starts with 3, the ones you can see that have a "wish charge" in them... gamify this shit dude please...";
// 17:31: "like gamify the dopamine from starting with 3 pentagons, using all 3 wishes and then unlocking a 4th pentagon and getting 4 wishes now and so on".
//
// THE WISH CHARGE is what his picture shows inside three of her twelve: the eye-stalks' pentagon (room/lyssajudron.mjs `eyes`, a five-sided disc on each
// of the score's EYE_SEATS, in the paint of her eyes: the grey of her bare vinyl out of the box). So her making starts with those three of her twelve, one
// wish in each; the other nine chairs are not hers yet: empty (the renderer's own seam, place(seat, null, {gone: true}): nothing of them drawn) and, on
// the mint alone, their ghosts on the wires. dl-her-wishes.test.mjs reads the renderer's text and fails the day the charge is drawn otherwise.
// HIS LADDER (17:31): a rung of n pentagons holds n wishes; when all n are spent the next pentagon comes, and with it n + 1 wishes: 3, then 4, and so on to
// her twelve (ladder). The next pentagon is the bar's next slot.
// WHAT SPENDS A WISH HERE (lane/her-wishes-unlock; the $WARM seat's word, Oct 29 18:2x UTC, from his: "What spends a wish on the mint page is your design"):
// in his lore a wish is one of the trial's AI calls, through the Space Router, whose door is not built. On her making the nearest real act is a chamber
// firing: a part of her taking its first colour (a press on the field, or the die), Harmony's own milestone (her eyes open once all six have fired). So a
// fired chamber spends one wish, and a chamber made bare again (↺) and fired again spends another. Her making fires six, so every visitor who makes her
// spends her three and sees the fourth pentagon come. When the Space Router's door is built, its call spends a wish here instead.
// THE WISH IS A CALL (Nov 1 2026, lane/the-wish-is-a-call; his Nov 1 02:11 UTC "i said it to remind you of the fucking gamification we can enable dude...
// * 3 wishes as CAC * social proof as K-factor", over the loop round her; his Oct 17 03:19 "3 wishes (aka: trial for 3 ai calls before quitting)", Oct 27 22:10
// "sponsor/subsidize inference ... INTO OUR SPACE-ROUTER", Oct 29 17:51 "the entire fucking model is that inference is sponsored as CAC to onboard more people").
// The router's door was built on Oct 30 (worker/space-router.mjs), and a wish never rode it: a chamber's colour spent it, so the trial cost the house nothing
// and gave the visitor nothing, and a friend born granted a wish worth nothing. Now a wish is one AI call: she answers it, the house's tank pays (the CAC), and
// it is what spends a wish on the ladder. The house pays her three and one for each friend born from her links (onHouse: the K-factor's reward is a call).
// THE WISH IS IN THE APP (his Nov 1 2026 04:51 UTC, over those words: "all of that needs to happen in the dysonlight harmony app... there should be 0 wishes
// granted outside of the app... that is our foot-in-the-door gtm operation dude"). A wish is granted only to DysonLight: her page inside the app (its cover,
// harmony-clip Host/WishFront.swift) proves each word with the app's own key, made by Apple's App Attest in the phone and vouched for by Apple (the door's
// check: worker/app-attest.mjs), and the door takes no other. Her her is born at that key's first word (HELLO_PATH): her code is the key's, the house owes it
// three, and a friend born in the app from her links one more (onHouse; the friend's code rides the app's link, appLink). On the web nothing is granted and
// nothing is spent: her colours, a friend's birth and her bar's slots move nothing, and where the field would stand her page shows the door into the app.
// The words a key proves are this law's (helloData, wishData), the same on the page and at the door, bound to a ten-minute window (windowOf).
// KEPT (his: "a returning visitor keeps their level"): the level is the door's, in the app: the wishes it granted her code, read at each open. Nothing of it is kept
// in the browser any more (the browser's count was the colours' law: dl.her.wishes, left unread).
// ONE PHONE, ONE BIRTH (his Nov 1 2026 06:03 UTC "please do what is still open", over "a reinstall gets three more wishes"): a key dies with its install, so a
// reinstall made a new key and a new her with three more wishes. The app keeps a phone's mark in its keychain, which outlives the install (Apple keeps it; on
// Android the mark is drawn from the phone's own id for this app's signing key, which outlives it too) and never leaves the phone with its backup. The mark rides
// the key's first word, bound into what the key attests (bornData), and the door keeps its hash beside her: a new key with a mark the door knows takes the her that
// mark was born with (her code, her friends, her wishes as they stood), so the phone gets her back and no new three. A phone erased whole is a new phone.
// ANDROID PROVES ITSELF (the same day): DysonLight on Android proves the same words with a key its keystore attests (worker/android-attest.mjs); its hand in her
// page is window.dysonlight, a web message port, where the iPhone's is the WebKit handler (BRIDGE).
// OPEN, his to say: what comes after the twelfth.
import { EYE_SEATS, SEATS } from '../../room/lyssajudron-score.mjs';
import { isHerCode, CODE_LENGTH } from './dl-her-friends.mjs';
import { randomCode } from './dl-society-codes.mjs';

export const TWELVE = SEATS;   // her unit1s
export const CHARGED = EYE_SEATS;   // the three that carry a wish charge: the eye-stalks (him, the work, around)
export const WISHES = CHARGED.length;   // the genie's three: the first rung
export const EMPTY = Object.freeze(Array.from({ length: TWELVE }, (_, s) => s).filter((s) => !CHARGED.includes(s)));   // the nine chairs not hers yet
export const ORDER = Object.freeze([...CHARGED, ...EMPTY]);   // the order her pentagons come in: her three, then the nine by seat
/** ladder(spent): HIS LADDER at `spent` wishes spent in all -> {pentagons, left, next, seats, lit}: the rung she stands on (n pentagons, n wishes), the wishes
 *  left on it, the pentagon that comes when they are spent (n + 1; null on the twelfth), her seats on it in ORDER, and the seats whose wish is still there
 *  (lit: a rung spends its pentagons in ORDER). Anything but a count is none spent. */
export function ladder(spent = 0) {
  let n = WISHES, rest = Number.isInteger(spent) && spent > 0 ? spent : 0;
  while (n < TWELVE && rest >= n) { rest -= n; n++; }
  const left = n - Math.min(rest, n);
  return { pentagons: n, left, next: n < TWELVE ? n + 1 : null, seats: ORDER.slice(0, n), lit: ORDER.slice(n - left, n) };
}
// THE WISH IS A CALL, IN THE APP: the Worker's doors (worker/space-router.mjs), a wish as it takes one, and the words the app's key proves.
export const WISH_PATH = '/space-router/v1/wish';   // GET -> {open, store}; POST {key, window, wish, assertion} -> {answer, wishes}
export const HELLO_PATH = '/space-router/v1/wish/hello';   // POST {key, window, friend, attestation | assertion} -> {code, wishes}: her her born, or asked again
export const APP_PATH = '/wish';   // the app's door on the web: DysonLight opens on it (its link); a browser is sent on to the app in the store
export const BRIDGE = 'dysonlight';   // the app's hand inside her page: window.webkit.messageHandlers.dysonlight (harmony-clip Host/WishFront.swift)
export const WISH_CHARS = 280;   // a wish at most, as she takes it
export const WINDOW_MS = 600_000;   // a proof's window: the app's key proves words bound to one of them, the door takes this one and its two neighbours
export const PROOF_DOMAIN = 'optimism.fit/wish/v1';
export const HER_PHONE_DOMAIN = 'optimism.fit/her/phone/v1';   // the door keeps base64url(sha256 of this, a newline and the phone's mark), never the mark
export const HER_KEY_DOMAIN = 'optimism.fit/her/v1';   // her code is the first CODE_LENGTH letters of sha256 of this, a newline and the key's name
/** onHouse(born): the calls the house pays a her code: the genie's three, and one for each friend born in the app from its links (the K-factor) */
export const onHouse = (born = 0) => WISHES + (Number.isInteger(born) && born > 0 ? born : 0);
/** wishOf(text): a wish as the door takes it: its whitespace one space, trimmed, at most WISH_CHARS; '' when nothing is said */
export const wishOf = (text) => String(text ?? '').replace(/\s+/g, ' ').trim().slice(0, WISH_CHARS);
/** windowOf(ms): the window a proof made at `ms` is bound to; windowsAt(ms): the ones the door takes then (a phone's clock a little behind or ahead) */
export const windowOf = (ms) => Math.floor(ms / WINDOW_MS);
export const windowsAt = (ms) => [windowOf(ms) - 1, windowOf(ms), windowOf(ms) + 1];
/** helloData(window, friend): the words her hello proves: the law's name, the act, the window, the friend whose link brought her ('' for none) */
export const helloData = (window, friend = null) => `${PROOF_DOMAIN}\nhello\n${window}\n${isHerCode(friend) ? friend : ''}`;
/** wishData(window, wish): the words a wish proves: the law's name, the act, the window, the wish as sent */
export const wishData = (window, wish) => `${PROOF_DOMAIN}\nwish\n${window}\n${wish}`;
/** keyOf(appKey): the app's key id (Apple's base64) as the door names it: base64url, unpadded; '' for anything else */
/** bornData(data, phone): what a key's first word attests: her hello's words and the phone's mark (ONE PHONE, ONE BIRTH) */
export const bornData = (data, phone) => `${data}\nphone ${phone}`;
/** phoneOf(mark): the phone's mark as the door takes it (base64url of 32 bytes), else '' */
export const phoneOf = (mark) => (typeof mark === 'string' && /^[A-Za-z0-9_-]{43}$/.test(mark) ? mark : '');
export const keyOf = (appKey) => (typeof appKey === 'string' && /^[A-Za-z0-9+/_-]{43}=?$/.test(appKey) ? appKey.replace(/\+/g, '-').replace(/\//g, '_').replace(/=$/, '') : '');
/** codeOfDigest(d): her code from the digest of her key (HER_KEY_DOMAIN): a letter of the Society's alphabet from each of its first CODE_LENGTH bytes */
export const codeOfDigest = (d) => randomCode(CODE_LENGTH, () => d.slice(0, CODE_LENGTH));
/** appLink(friend): the door into the app from her page, carrying the friend whose link brought this visitor */
export const appLink = (friend = null) => (isHerCode(friend) ? `${APP_PATH}?friend=${friend}` : APP_PATH);
/** count(spent): her unit1s as a state, '3/12' on the first rung */
export const count = (spent = 0) => `${ladder(spent).pentagons}/${TWELVE}`;
/** line(spent): her bar as text anyone can paste (HER REEL's caption): a filled pentagon for each of hers, a hollow one for each chair not hers yet, the count */
export const line = (spent = 0) => { const n = ladder(spent).pentagons; return `${'⬟'.repeat(n)}${'⬠'.repeat(TWELVE - n)} ${n}/${TWELVE}`; };
/** slots(eyes, spent): the wish bar, one slot a chair in ORDER: {seat, state, colour}. state: 'charged' (a pentagon of hers with its wish), 'spent' (a pentagon
 *  whose wish this rung has spent), 'next' (the pentagon that comes when they all are), 'empty'; a pentagon shows her eyes' paint (eyes, '#RRGGBB'). */
export function slots(eyes = null, spent = 0) {
  const L = ladder(spent), used = L.pentagons - L.left;
  return ORDER.map((seat, k) => {
    const state = k < used ? 'spent' : k < L.pentagons ? 'charged' : k === L.pentagons ? 'next' : 'empty';
    return { seat, state, colour: k < L.pentagons ? eyes : null };
  });
}

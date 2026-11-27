// swarmbook-floor.mjs: THE BALL IS SOLANA'S STATE (Nov 19 2026). His words over Swarmbook's front, UTC: 16:51 "i had shared the polyehdron where each hexagon was a
// face of the colored lyssajudron"; 16:57 "the thing is, you over there got a fucking static unit0... you forgot that the hexagon count and the hexagon IDs are
// supposed to live on solana dude"; asked "Rebuild the front's ball from the mint list on Solana?": "Yes, rebuild it". The lineage: ec-workspace
// docs/swarmbook-is-the-new-poleis-us-and-the-claw-riders-hypertrace-2026-11-10.md, section 17.
// The front's ball is the meta swarm's floor: every Lyssajudron minted is one hexagon. A mint is a deposit on Solana; the house hears the chain once and keeps
// the one ordered list (worker/space-router-deposit.mjs, /space-router/v1/drops: each mint's signature, its number, its tier; THE HOUSE HEARS ONCE). This module
// reads that list where it left off and folds it through his land law with the rung following the count (dl-mint-ledger.js foldFloor): the dodecahedron with no
// mint, a rung more when the places are full, a held hexagon keeping its place. It keeps no list of its own and names no hexagon: the same list, the same floor,
// on every screen. EVERYONE'S FACES are the mint sphere's own (dl-her-portrait.js: the door's faces, each drawn to the standard, its painting or her painter's
// drawing from its six colours); this module only loads that module once someone has minted and hands its hook on. Nothing of it is loaded for an empty floor.
// HIS REVIEW: ?pour=N on the house's own doors (as the mint page's, dl-mint-pour.js) stands N seats of the lab's own in for the chain's, their faces her painter's
// from colours made up here; a public name never.
// THE HEX IS A PAGE (Nov 19 2026, his 13:20 UTC "the swarmbook is made by many pages... that hex is a page", 16:59 "everyone that mints a lyssajudron and joins claw
// riders will have their profile there... that is the tracenet"; 16:42, over this page's hero, "you are not considering whether users have or not have already
// signed up"): a held hexagon's face leads to its holder's page (/<handle>, their tracenet, once the door's faces name a handle), and this browser's own person is
// read off the mint page's own store (dl-kit-deposit.js: the flask's key made here, its deposit's signature once counted, the page it claimed): their hexagon is
// the floor's `mine`, and the hero's door and line are theirs (heroOf). The store is per site name: a flask made on another name is not known here.
// Cost: one GET at the load and one at each opening of the door's socket (THE HOUSE SAYS IT AT ONCE, Nov 20 2026, his "Build it": every mint the door hears is
// pushed to the open page the moment its list takes it, dl-drops-live.mjs; no poll); a fold is under 30 ms at the last rung; with a mint, the faces'
// module, its GET of the door's faces and one more of the same list for the pages (held 20 s by the door); one read of the browser's store at the load.
import { foldFloor, reviewSeats, FILM_FRONT } from './dl-mint-ledger.js?v=floor-1';
import { liveDrops, freshOf, ridersOf, riderSeats } from './dl-drops-live.mjs?v=riders-1';

export const DROPS = '/space-router/v1/drops', FACES = '/space-router/v1/portrait', PAGE = 500, WALL = 150, FRONT = FILM_FRONT;   // FRONT: the film's own front on the stop, so this floor is the mint page's (FOLLOW THE COUNT)
export const HOUSES = Object.freeze(['ARIES', 'TAVRVS', 'GEMINI', 'CANCER', 'LEO', 'VIRGO', 'LIBRA', 'SCORPIO', 'SAGITTARIVS', 'CAPRICORNVS', 'AQVARIVS', 'PISCES']), SEALED = Object.freeze({ 2: 'Nefertiti' });   // THE TWELVE HOUSES (his Oct 18 2026 "each pentagon is a house of the zodiac from seya"; Nov 19 "the 12 pentagons become the 12 houses of the golden knights"): the meta swarm's pentagons by chair; a house a posiverse holds: Gemini, Nefertiti's flask, the first (his Nov 20 "make nefertiti the gemini house", "the first pentagon is nefertiti")
export const MINT = './warm.html#mint', FLASK = './warm.html?door=deposit', MAKING = './warm.html?door=deposit&then=making';   // the mint page; its flask's door; the one step on to her making for a flask already filled (dl-kit-deposit.js asked())
export const HOUSE = /^(localhost|127\.0\.0\.1|\[::1\])$|\.localhost$/, HANDLE = /^[A-Za-z0-9_-]{1,32}$/;
/** reviewOf(location): his review's seats, N, on the house's own doors alone; null anywhere else or with no ?pour. Pure. */
export const reviewOf = ({ hostname = '', search = '' } = {}) => { const q = new URLSearchParams(search).get('pour'); return HOUSE.test(hostname) && q !== null && Number(q) >= 0 ? Math.min(630, Math.floor(Number(q))) : null; };
/** reviewColours(n): six colours for the review's n-th face (the door's shape: light, base, coat, gold, eyes, thruster), turned round the wheel by the golden step. Pure. */
export function reviewColours(n) {
  const hex = (h, s, l) => { const f = (k) => { const q = (k + h * 12) % 12; return Math.round(255 * (l - s * Math.min(l, 1 - l) * Math.max(-1, Math.min(q - 3, 9 - q, 1)))).toString(16).padStart(2, '0'); }; return `#${f(0)}${f(8)}${f(4)}`.toUpperCase(); };
  const h = (n * .6180339887) % 1;
  return { light: hex(h, .8, .6), base: hex((h + .5) % 1, .25, .2), coat: hex((h + .08) % 1, .55, .45), gold: hex(.12, .7, .55), eyes: hex((h + .33) % 1, .9, .6), thruster: hex((h + .66) % 1, .85, .55) };
}
/** reviewOwn(location, n): his review's visitor. ?me=K makes seat K of the N this browser's own (its page as the review's faces name it: every fourth seat has
 *  claimed none); ?me=0 a flask made and not yet filled; null with no ?me, a K past N, or off the house's own doors. Pure. */
export const reviewOwn = (loc, n = reviewOf(loc)) => { const q = new URLSearchParams(loc?.search ?? '').get('me'), k = Number(q); return n === null || q === null || !Number.isInteger(k) || k < 0 || k > n ? null : { flask: true, paid: k ? reviewSeats(k)[k - 1].signature : null, handle: null }; };
/** ownOf(idb): what this browser keeps of its person, read off the mint page's own store ('dl-flask', dl-kit-deposit.js): {flask, paid (its deposit's signature,
 *  once counted), handle (the page it claimed)}; null where no flask was ever made here. A browser with no such store gets none: the open that would make it is undone. */
export const ownOf = (idb) => new Promise((ok) => {
  try { const o = idb.open('dl-flask'); o.onupgradeneeded = () => o.transaction.abort(); o.onerror = () => ok(null);
    o.onsuccess = () => { const db = o.result; try { const t = db.transaction('keys'), s = t.objectStore('keys'), [f, p, h] = ['flask', 'paid', 'handle'].map((k) => s.get(k));
      t.oncomplete = () => { db.close(); ok(f.result ? { flask: true, paid: typeof p.result === 'string' ? p.result : null, handle: typeof h.result === 'string' && HANDLE.test(h.result) ? h.result : null } : null); };
      t.onerror = t.onabort = () => { db.close(); ok(null); }; } catch { db.close(); ok(null); } };
  } catch { ok(null); }
});
/** heroOf(own, mine, page): the hero's door and its line for this browser's person. Nothing done here: the mint page, the page's own line. A flask made and not yet
 *  filled: its door. A flask filled: their page (page: its address), or her making while none is claimed; and once the floor holds their hexagon (mine), its
 *  number, in the mint sphere's own words. Pure. */
export const heroOf = (own, mine, page) => ({ href: !own ? MINT : !own.paid ? FLASK : page ?? MAKING, line: mine ? `Your hexagon, number ${mine.n}.` : null });

/** mountFloor({onFloor, onFaces, live}): the floor as the list stands, said at once (the dodecahedron until the door answers) and again at every mint the door
 *  pushes (live: its socket, dl-drops-live.mjs) or a read finds; the faces' hook (none: the faces go to her sphere, the page's own), said each time a face arrives. A
 *  floor carries `list` (the one list it folded, the mints then the riders: her sphere's pour), `mine` (this browser's own hexagon, one of `held`, or null) and
 *  `pageOf(h)` (where a held hexagon's face leads, or null). -> {read(), state()} */
export function mountFloor({ win = window, doc = document, fetcher = (...a) => win.fetch(...a), load = () => import('./dl-her-portrait.js?v=portrait-4'), idb = win.indexedDB, live = liveDrops, onFloor = () => {}, onFaces = null } = {}) {
  const review = reviewOf(win.location), seats = review === null ? [] : reviewSeats(review); let riders = [], after = 0, busy = false, why = null, floor = null, portrait = null, own = reviewOwn(win.location, review);
  const pages = new Map(), urlOf = (handle) => (review === null ? `/${handle}` : `./tracenet.html?of=${handle}`);   // pages: a mint's signature -> its holder's page (a handle), as the door's faces name it; a handle's address (the house's own doors have no Worker to turn /<handle>)
  const reviewFaces = async () => ({ ok: true, json: async () => ({ count: floor.count, hexagons: floor.held.slice(0, WALL).map((h) => ({ n: h.n, signature: h.signature, colours: reviewColours(h.n), ...(h.n % 4 ? { handle: `rider-${h.n}` } : {}) })) }) });
  /** pageOf(h): where a held hexagon's face leads: its holder's page; the visitor's own with no page claimed yet, her making (where the page is claimed); else null */
  const pageOf = (h) => { const mine = h.signature === own?.paid, handle = pages.get(h.signature) ?? (mine ? own.handle : null); return handle ? urlOf(handle) : mine ? MAKING : null; };
  const hero = () => { const a = doc.querySelector?.('.hero .mint-big'); if (!a) return; const h = heroOf(own, floor?.mine, floor?.mine ? pageOf(floor.mine) : own?.handle ? urlOf(own.handle) : null), line = a.querySelector('.mint-big-kicker');
    a.setAttribute('href', h.href); if (line && h.line) line.textContent = h.line; };
  const turn = async () => { try { const r = await (review === null ? fetcher(FACES) : reviewFaces()), b = r.ok ? await r.json() : null; for (const h of b?.hexagons || []) if (typeof h?.signature === 'string' && typeof h.handle === 'string' && HANDLE.test(h.handle)) pages.set(h.signature, h.handle); hero(); } catch { /* the door did not answer: no face leads anywhere yet */ } };
  const say = () => {
    const list = [...seats, ...riderSeats(riders, seats.length)], f = foldFloor(list, FRONT); onFloor(floor = { ...f, list, sealed: Object.keys(SEALED).map(Number), count: seats.length, review: review !== null, mine: (own?.paid && f.held.find((h) => h.signature === own.paid)) || null, pageOf }); hero();
    if (!floor.held.length) return;                                  // an empty floor has no face: nothing of the faces is loaded
    portrait ??= load().then((m) => { const p = review === null ? win.DL_HER_PORTRAIT : m.mountHerPortrait({ win, doc, fetcher: reviewFaces });
      if (onFaces) win.dispatchEvent(new win.CustomEvent('genesis-sphere', { detail: { setSeatFace: onFaces } })); return p; }, (e) => { why = String(e?.message || e).slice(0, 120); return null; });   // the faces' module takes this as its sphere: its hook is handed on
    void portrait.then((p) => p?.fill()); void turn();
  };
  const take = (drops) => { for (const d of drops) { seats.push({ signature: d.signature, slot: d.n, tier: d.tier === 'gold' ? 'gold' : 'bronze' }); after = d.n; } if (drops.length) say(); };
  async function read() {
    if (busy || review !== null || doc.hidden) return; busy = true; let more = false;
    try {
      const r = await fetcher(`${DROPS}?after=${after}`), j = r.ok ? await r.json() : null, drops = freshOf(j?.drops, after);
      why = r.ok ? null : `the door answered ${r.status}`; more = drops.length >= PAGE; take(drops);
      const on = ridersOf(j, riders); if (on.length !== riders.length) { riders = on; say(); }   // THE RIDER STANDS ON THE META SWARM (his Nov 24 2026 19:18:38 UTC "the claw-rider is a hexagon of a lyssajudron on the unit0 of the meta swarm"): every claw rider the list names (its `riders`), after the minted ones, with no seat and no mint
    } catch (e) { why = String(e?.message || e).slice(0, 120); } finally { busy = false; }   // the door did not answer: the floor stands as it was read
    if (more) void read();                                           // the door gives PAGE drops an answer: a longer list is read on
  }
  say(); void read();
  if (review === null) void ownOf(idb).then((o) => { if (!o) return; own = o; if (floor.held.length) say(); else hero(); });   // this browser's own person: their hexagon marked once the list holds it, the hero theirs at once
  doc.addEventListener('visibilitychange', () => { if (doc.hidden) return; void read(); if (floor.held.length) void turn(); });   // shown again: the list, and the pages claimed since
  if (review === null) live({ win, doc, onOpen: () => void read(), onDrops: (rows) => { const f = freshOf(rows, after); if (f.length) (f[0].n === after + 1 ? take(f) : void read()); } });   // a mint the door pushes falls in at once; across a gap the list is read
  return (win.__swarmbookFloor = { read, state: () => ({ count: seats.length, after, review, why, capacity: floor?.capacity ?? null, faces: portrait ? 'asked' : null, own: own && { paid: own.paid, handle: own.handle }, mine: floor?.mine?.n ?? null, pages: pages.size }), portrait: () => portrait });   // a proof's reader
}

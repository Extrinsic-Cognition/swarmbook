// after-the-mint.mjs: AFTER THE MINT (Nov 2 2026, lane/after-the-mint). His words, UTC: Nov 2 ~01:3x "ok, can we work on a optimism.fit landing page for
// after the mint? let's look into it?"; then, over the mock drawn back (the diving Lyssajudron with the arrow let go, SPACE ROUTER OPEN, THE CODE IS FREE, its
// doors and three cards): "can you please for now show me optimism.fit after the mint phase? like, this: it is supposed to be implemented there no?". It was
// not: from MINT_CLOSES (dl-paywall.js; Nov 18 00:00 UTC until he reopened the mint on Nov 19 2026, none since) the mint page only let its film run past the drawn arrow and closed its
// seats. This is the page / opens on from that instant (worker/premint.mjs THE FRONT DOORS), its doors the mint page's own (its refuel, its stake, the
// trail, the download).
// THE HERO IS THE MINT'S OWN BALL (his Nov 12 2026 ~07:12 UTC "why dont we bring the goldberg tree in there in space router?", ~07:40 "The mint's, as staged";
// it moves his Nov 2 ~02:3x "put the diving lyssajudron there... the same one from the welcome pages"): the Goldberg tree, after-the-mint-tree.mjs, its seats the
// door's deposits, its deposit door the mint page's own. Cost here: the page's own check and its doors, once at load; the tree draws on a cause only.
import {mintState, LAUNCH_DAY, MINT_CLOSES} from './dl-paywall.js';

export const PAGE = './after-the-mint.html', MINT_PAGE = './warm.html', ROAD = ['side', 'door'], sideOf = (search) => { const s = new URLSearchParams(search ?? '').get('side'); return s === 'flask' || s === 'pool' ? s : null; };   /* sideOf: the side of the split the visit came by (warm.html's two plates at her offer), or null */

/** isAfter(now, closes): the $WARM window is over at this instant (ms): the mint's own word (dl-paywall.js mintState with MINT_CLOSES, or the close given); never, while no close is set. Pure. */
export const isAfter = (now, closes = MINT_CLOSES) => mintState(now, LAUNCH_DAY, closes).phase === 'closed';

/** carry(href, search): a door to another page of the site keeps the visit's query (a friend's ?ref=, Harmony's ?from=), its fragment after it; the road's own words (ROAD: the side clicked, the door asked) stay on their page. Pure. */
export function carry(href, search) {
  if (!search || search === '?') return href;
  const [path, hash = ''] = href.split('#'), [base, query = ''] = path.split('?');
  const q = new URLSearchParams(query); for (const [k, v] of new URLSearchParams(search)) if (!q.has(k) && !ROAD.includes(k)) q.set(k, v);
  const s = q.toString();
  return `${base}${s ? `?${s}` : ''}${hash ? `#${hash}` : ''}`;
}

/** mountAfter(): before the window closes the page is not yet: the visit goes on to the mint page (a #preview address stays, for the lanes' looks, and a visit the split sent, ?side=flask or ?side=pool: THE SPLIT LEADS WHERE YOU CLICK, his Nov 12 2026 ~06:38 UTC "it gotta split based on what people click... i would probably just jump straight to the space router page"; it opens on its side, marked on the tree and its card first, and a line [data-after-close] true only after the close is left out before it). Then
 *  every [data-carry] door keeps the visit's query, and the tree comes in, by a literal path, so the build walks it (tools/page-files.mjs). */
export async function mountAfter({win = window, doc = document, now = () => Date.now(), closes = MINT_CLOSES, hero = async () => (await import('./after-the-mint-tree.mjs')).mountTree()} = {}) {
  const side = sideOf(win.location.search), early = !isAfter(now(), closes); if (early && win.location.hash !== '#preview' && !side) { win.location.replace(carry(MINT_PAGE, win.location.search)); return null; }
  const doors = [...doc.querySelectorAll('[data-carry]')];
  for (const a of doors) a.setAttribute('href', carry(a.getAttribute('href'), win.location.search)); if (side) { doc.documentElement.dataset.side = side; if (early) for (const l of doc.querySelectorAll('[data-after-close]')) l.hidden = true; }
  await hero();
  return {doors: doors.length, side};
}

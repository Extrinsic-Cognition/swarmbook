// swarmbook-board.mjs: THE PANTHEON'S BOARD (his Nov 19 2026, UTC: "where is this supposed to be implemented? we need this both in the website (global
// leaderboard)", then "Yes, lay it" over the board drawn on this page). Every flask is a rider, ranked as the router's door ranks them (?board: the fees its
// prompts brought the swarm in the last 30 days, then of all time), twelve at most, each with its face (the house's painting, else her painter's drawing from its
// six colours, cut to the hexagon as the wall cuts it), the visitor's own row in the mint's gold, a held page linked. Nothing at rest: one read at load and one when
// the page is shown again (the door holds it 20 s); her renderer only once the board comes near the view, and a face once. While the door does not answer (a copy
// served without the Worker) the section stays hidden: it never says "no rider yet" on a guess.
import { FACES, MAKING, HANDLE, HOUSE, ownOf } from './swarmbook-floor.mjs?v=board-1';
const ROWS = 12, AGAIN_MS = 20000, usd = (x) => `$${(Number(x) || 0).toFixed(2)}`, num = (x) => (Number(x) || 0).toLocaleString('en-US', { maximumFractionDigits: 2 }), int = (x) => Math.trunc(Number(x)) || 0;
/** rowsOf(board, paid, at): the rows' markup, pure. Each: its rank, a slot for its face, who (a claimed page's handle, linked by at(handle); the visitor's own row
 *  with none leads to her making, where a page is claimed), the month's burn, the fees it brought the swarm, the $WARM it mined. paid: this browser's deposit. */
export const rowsOf = (board, paid, at) => board.slice(0, ROWS).map((r) => { const n = int(r.n), h = typeof r.handle === 'string' && HANDLE.test(r.handle) ? r.handle : null, mine = !!paid && r.signature === paid, href = h ? at(h) : mine ? MAKING : null, m = r.month || {}, who = h ? `@${h}` : `Hexagon ${n}`;
  return `<li class="${[int(r.rank) === 1 && 'top', mine && 'mine'].filter(Boolean).join(' ')}"><span class="am-board-rank">${int(r.rank) || ''}</span><span class="am-board-face"></span><span class="am-board-who"><b>${href ? `<a href="${href}">${who}</a>` : who}</b><small>${[Number.isInteger(r.traces) && `${r.traces} traces`, h ? `Hexagon ${n}` : 'no page claimed', mine && 'you'].filter(Boolean).join(' · ')}</small></span><span class="am-board-num burn"><b>${usd(m.burned)}</b><small>burned this month</small></span><span class="am-board-num fee"><b>${usd(m.fees)}</b><small>to the swarm</small></span><span class="am-board-num warm"><b>${num(m.mined)}</b><small>$WARM mined</small></span></li>`; }).join('');
/** mountBoard(): reads the board into #board; -> {read(), state()} */
export function mountBoard({ win = window, doc = document, fetcher = (...a) => win.fetch(...a), idb = win.indexedDB, load = () => import('./dl-her-portrait.js?v=portrait-4') } = {}) {
  const sec = doc.getElementById('board'), ol = sec?.querySelector('.am-board-rows'), none = sec?.querySelector('.am-board-empty'); if (!ol || !none) return null;
  const at = HOUSE.test(win.location.hostname) ? (h) => `./tracenet.html?of=${h}` : (h) => `/${h}`, own = ownOf(idb), got = new Map();   // got: a rider's signature -> its face, cut once
  let list = [], readAt = -Infinity, near = !win.IntersectionObserver, drawing = false;
  const seat = () => ol.querySelectorAll('.am-board-face').forEach((s, i) => { const c = got.get(list[i]?.signature); if (c && s.firstChild !== c) s.replaceChildren(c); });
  async function faces() {   // the faces not cut yet: a painting the house keeps, else her painter from the six colours (a rider with neither keeps the empty hexagon)
    const want = list.filter((r) => !got.has(r.signature)); if (drawing || !near || !want.length) return; drawing = true;
    try { const m = await load(), cut = (r, pic) => { got.set(r.signature, m.cutHex(pic, doc, 128, null)); seat(); }, her = [];
      await Promise.all(want.map((r) => typeof r.picture !== 'string' ? void her.push(r) : new Promise((ok) => { const im = new win.Image(); im.onload = () => ok(cut(r, im)); im.onerror = () => ok(her.push(r)); im.src = r.picture; })));
      const drawn = her.filter((r) => typeof r.colours?.light === 'string');
      if (drawn.length) await m.drawHers(drawn.map((r) => ({ parts: Object.fromEntries(m.PARTS.map((k) => [k, r.colours[k]])), painted: [...m.PARTS], light: r.colours.light, gaze: null, sel: 'light' })), { win, doc, px: 256, each: (c, i) => cut(drawn[i], c) });
    } catch { /* her renderer did not start: the rows stand with their empty hexagons */ } finally { drawing = false; }
  }
  async function read() {
    if (win.performance.now() - readAt < AGAIN_MS) return; readAt = win.performance.now();
    try { const r = await fetcher(`${FACES}?board`), b = r.ok ? await r.json() : null; if (!Array.isArray(b?.board)) return;
      list = b.board.slice(0, ROWS); ol.innerHTML = rowsOf(list, (await own)?.paid ?? null, at); ol.hidden = !list.length; none.hidden = !!list.length; sec.hidden = false; seat(); void faces();
    } catch { /* the door did not answer: the board stays as it stood */ }
  }
  if (!near) new win.IntersectionObserver((e) => { if (e.some((x) => x.isIntersecting)) { near = true; void faces(); } }, { rootMargin: '600px' }).observe(sec);
  doc.addEventListener('visibilitychange', () => { if (doc.visibilityState === 'visible') void read(); });
  void read(); return { read, state: () => ({ shown: !sec.hidden, rows: list.length, faces: got.size }) };
}

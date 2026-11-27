// dl-drops-live.mjs: THE HOUSE SAYS IT AT ONCE, the page's half (Nov 20 2026, his "Build it", asked "Build the live ball: the site pushes each mint, the Mac
// listens to Solana and updates your screens?", after "any time, anywhere we got that diving lyssajudron, it gotta be updating asap with solana state"). The door
// says each mint the moment its list takes it (worker/drops-live.mjs); a ball's page holds one socket to it while the page is shown, takes the rows it says, and
// reads the list itself only when the socket opens (what it missed) or across a gap. No poll: a socket that drops opens again (1, 2, 5, 10, then every 30 s).
// Cost: one socket a shown page, asleep at the door between mints; a 'ping' a PING_MS while it is open, so no hop closes it idle, answered by the door asleep.
export const LIVE_PATH = '/space-router/v1/drops/live', PING_MS = 45000, AGAIN_MS = Object.freeze([1000, 2000, 5000, 10000, 30000]);
/** freshOf(list, after): the list's well-formed rows past `after`, in its order. Pure. */
export const freshOf = (list, after) => (Array.isArray(list) ? list : []).filter((d) => typeof d?.signature === 'string' && Number.isInteger(d.n) && d.n > after).sort((a, b) => a.n - b.n);
export const ridersOf = (j, was = []) => (Array.isArray(j?.riders) ? j.riders.filter((s) => /^rider-\d+$/.test(s)) : was), riderSeats = (riders, from) => riders.map((signature, k) => ({ signature, slot: from + k + 1, tier: 'bronze', buyer: null }));   /* ridersOf(answer, was): THE RIDER STANDS ON THE META SWARM (his Nov 24 2026 19:18:38 UTC "the claw-rider is a hexagon of a lyssajudron on the unit0 of the meta swarm"): the claw riders the drops door's answer names (its `riders`, `rider-<n>`), or `was` where it names none; riderSeats(riders, from): them as seats after the `from` minted ones, so every ball folds the one list, the mints then the riders. Pure. */
/** liveDrops({win, doc, onDrops, onOpen}): the door's socket while the page is shown; onDrops(rows) with the rows it says, onOpen() at each opening. -> {close()} */
export function liveDrops({ win = window, doc = document, onDrops = () => {}, onOpen = () => {} } = {}) {
  let ws = null, tries = 0, beat = 0, wait = 0, done = false;
  const again = () => { win.clearTimeout(wait); if (!done && !doc.hidden) wait = win.setTimeout(open, AGAIN_MS[Math.min(tries++, AGAIN_MS.length - 1)]); };
  function open() {
    if (done || ws || doc.hidden) return; try { ws = new win.WebSocket(`${win.location.protocol === 'https:' ? 'wss' : 'ws'}://${win.location.host}${LIVE_PATH}`); } catch { ws = null; again(); return; }
    ws.onopen = () => { tries = 0; beat = win.setInterval(() => { try { ws?.send('ping'); } catch { /* closing */ } }, PING_MS); onOpen(); };
    ws.onmessage = (e) => { let m = null; try { m = JSON.parse(e.data); } catch { return; } if (Array.isArray(m?.drops)) onDrops(m.drops); };   // 'pong' is no list
    ws.onclose = () => { win.clearInterval(beat); ws = null; again(); };
  }
  doc.addEventListener('visibilitychange', () => { if (doc.hidden) ws?.close(); else open(); });
  open();
  return { close() { done = true; win.clearTimeout(wait); ws?.close(); } };
}

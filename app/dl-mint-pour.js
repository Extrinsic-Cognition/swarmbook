// dl-mint-pour.js · THE SEATS THAT POUR INTO THE FLASK (dl-mint-flask.js), read off Solana, the source of truth (his Oct 21 2026 WEST: "it's all sedimented
// on solana as source of truth"): every seat paid so far, verified and in the chain's order (dl-mint-ledger.js readSeats), handed to the sphere (setPour).
// Read at the page's load, at the checkout's own word (dl-premint-paid), when the page is shown again, and every POUR.poll_ms while the wall holds the film
// on the stop (a seat paid while he waits falls as it is read); a read that fails keeps what was read before. HIS REVIEW: ?pour=N on the house's own doors
// stands N seats of the lab's own in for the chain's (dl-mint-ledger.js reviewSeats) and one more every POUR.demo_ms while held (POUR.demo_more at most),
// so he sees the world fill with no buyer; optimism.fit never.
import {POUR, reviewPourOf} from './dl-mint-flask.js?v=flask-2';
import {readSeats, reviewSeats} from './dl-mint-ledger.js?v=flask-2'; import {DROPS_PATH} from './dl-kit-deposit.mjs';
import {PAYEE} from './dl-direct-protocol.mjs';
import {liveDrops, freshOf, ridersOf, riderSeats} from './dl-drops-live.mjs?v=riders-1';   // THE HOUSE SAYS IT AT ONCE: the door's push of every mint; the claw riders its list names

// THE SPEED OF LIGHT (his Oct 28 2026 03:0x WET: "the spotlight has to be on the flask because ideally we show the flask gettting filled at the speed of
// light with latest solana stuff"): while the wall holds the film on the stop and the page is seen, one websocket to the chain listens for every
// transaction that names the mint's wallet (logsSubscribe, mentions, at confirmed: a slot or two, under a second); each one reads the seats at once (the
// ledger reads at confirmed too), so a seat paid falls into every open flask as the chain confirms it, never a poll later. The poll stays the floor (a
// socket that drops, a provider that refuses it); the socket opens on the stop (her entrance there, dl-athena.js's 'dl-athena' coming, entered or landed; else the
// poll's next turn) and closes when the stop is left or the page is hidden.
export const WS = Object.freeze(['wss://solana-rpc.publicnode.com']);   /* NO SOCKET THAT REFUSES A BROWSER (the live walk of Nov 12 2026 08:37 UTC: every visit held on the stop opened wss://api.mainnet-beta.solana.com first and got 403). Both hosts answered Node on Oct 28; a browser sends its Origin, and asked from https://optimism.fit in a headless Chrome on Nov 12 09:06 UTC api.mainnet-beta refused the handshake (3 of 3) while this one opened in 0.15 s and answered the logsSubscribe in 0.2 s (2 of 3; once it opened and said nothing in 8 s: the poll is the floor). The refusing host is off the list */
export const subscribeMessage = (recipient = PAYEE, id = 1) => JSON.stringify({jsonrpc: '2.0', id, method: 'logsSubscribe', params: [{mentions: [recipient]}, {commitment: 'confirmed'}]});   /* the logsSubscribe request for the transactions naming the recipient, at confirmed. Pure */
export const isNotice = (data) => { try { const m = JSON.parse(data); return m?.method === 'logsNotification' && m.params?.result?.value?.err == null; } catch { return false; } };   /* whether a socket message is a logs notification of a transaction that did not fail. Pure */

export function mountMintPour({win = window, doc = document, fetcher = (...a) => fetch(...a), camera = true, ticks = true, live = liveDrops} = {}) {   /* camera: the flask's own shots on the door's words; ticks: the reads on a timer while the stop holds (the Space Router page's tree takes neither: after-the-mint-tree.mjs) */
  let sphere = win.genesisSphere ?? null, seats = null, pending = false, again = false, more = 0, ws = null, wsAt = 0, heard = 0;
  const review = reviewPourOf(win);
  let terms = win.dlDepositTerms ?? null, deposits = null, after = 0, riders = [];   /* THE HOUSE HEARS ONCE (his Nov 11 2026 UTC "i dont think you realize that there's gonna be a catchup delay", over every page reading the chain by itself; 08:10:10 "using webhooks solana txns landing"): no page reads the chain for the deposits. The door keeps their one ordered list (worker/space-router-deposit.mjs DROPS_PATH); every page reads that one answer from where it left off, a newcomer the whole of it at once, and the payer's own page tells the door its signature as it is sent */
  const give = () => { const minted = [...(seats ?? []), ...(deposits ?? [])]; if (sphere && (seats || deposits || riders.length)) sphere.setPour?.([...minted, ...riderSeats(riders, minted.length)]); };   /* HER SPHERE WEARS THE RIDERS (his Nov 24 2026 19:18:38 UTC "the claw-rider is a hexagon of a lyssajudron on the unit0 of the meta swarm"; ~22:3x "do all"): after the minted hexagons, the claw riders the door's list names, the front's one fold (swarmbook-floor.mjs), their faces the portrait door's */
  const take = (rows) => { deposits ??= []; for (const d of rows) { deposits.push({signature: d.signature, slot: d.n, tier: d.tier, buyer: null, order: null, memo: null, at_ms: d.at_ms}); after = d.n; } give(); };
  const dropsNow = async () => { if (!terms || doc.hidden) return; try { const j = await (await fetcher(`${DROPS_PATH}?after=${after}`)).json(); riders = ridersOf(j, riders); if (!Array.isArray(j?.drops)) { give(); return; } take(freshOf(j.drops, after)); } catch { /* the door did not answer: what was read stands */ } };
  win.addEventListener('dl-deposit-terms', (e) => { terms = e.detail; void dropsNow(); }); if (camera) doc.addEventListener('dl-tank-filled', () => sphere?.camera?.({zoom: 1, x: 0, y: 0, ms: 600})); const left = () => camera && sphere?.camera?.(win.innerWidth > 700 ? {zoom: 1.05, x: -.12, y: -.12, ms: 900} : {zoom: 1.5, x: 0, y: -.62, ms: 900}); doc.addEventListener('dl-flask-waits', left);   /* THE FLASK STANDS WHOLE (Nov 20 2026, his "look at how ugly this all is compared to the rest of the other ones"): at x -.3 the flask stood past the screen's left edge on every window wider than 700 px and its glow stood alone in the middle; at -.12 it stands whole on the left, in front of its own glow. THE LIQUOR ON THE LEFT (his Nov 11 2026 06:27 UTC): the flask's own camera lays the flask and its liquor in the screen's left half, the egg's place being the right (above it on a phone), from the press until the flask is filled */
  doc.addEventListener('dl-tank-pouring', (e) => { left(); fetcher(DROPS_PATH, {method: 'POST', headers: {'content-type': 'application/json'}, body: JSON.stringify({signature: e?.detail?.signature})}).then(dropsNow, dropsNow); });   /* THE FLASK IS THE SCREEN (his 08:10:10 UTC "the more you operate 3D spatially cgi motiongraphics onto the liquor flask the best"; then, over a pour with no liquor in sight, "u dont realize there's the liquor stuff? ... you need to keep the plot in place"): the sphere's own camera goes down to the liquor while his drop falls (at rest, with few deposits, the liquor lies under the screen's lower edge and her picture's band; at zoom 1.6, y -.45 it is the middle of the picture), and stands back at the fill */
  const held = () => win.dlTwelve?.state?.()?.paywall?.state === 'held';
  async function refresh() {
    if (review !== null || doc.hidden) return;
    if (pending) { again = true; return; }   // a notice while a read is out: one more read after it, so no seat waits for the poll
    pending = true;
    try { seats = await readSeats({fetcher, known: seats ?? []}); give(); }
    catch { /* no RPC answered: the world keeps what was read, and the next cause reads again */ }
    finally { pending = false; if (again) { again = false; void refresh(); } }
  }
  const quiet = () => { if (ws) { const w = ws; ws = null; try { w.close(); } catch { /* already closed */ } } };
  const listen = () => {   // the stop, seen, no socket yet: open one (the providers in turn) and read on every notice
    if (review !== null || ws || doc.hidden || !held() || typeof win.WebSocket !== 'function') return;
    let w; try { w = new win.WebSocket(WS[wsAt++ % WS.length]); } catch { return; }
    ws = w;
    w.onopen = () => { try { w.send(subscribeMessage()); } catch { /* closed meanwhile */ } };
    w.onmessage = (e) => { if (isNotice(e.data)) { heard++; void refresh(); } };
    w.onclose = w.onerror = () => { if (ws === w) ws = null; };
  };
  win.addEventListener('genesis-sphere', (event) => { sphere = event.detail; give(); });
  win.addEventListener('dl-premint-paid', () => void refresh());
  doc.addEventListener('dl-athena', (e) => { if (['coming', 'entered', 'landed'].includes(e?.detail?.type)) listen(); });   // her entrance on the stop: the wall holds, listen at once
  doc.addEventListener('visibilitychange', () => { if (!doc.hidden) { void refresh(); listen(); void dropsNow(); } else quiet(); });
  if (review !== null) {
    seats = reviewSeats(review); give();
    if (ticks) win.setInterval(() => { if (held() && !doc.hidden && more < POUR.demo_more) { more++; seats = reviewSeats(review + more); give(); } }, POUR.demo_ms);
  } else {
    void refresh(); listen();
    if (ticks) win.setInterval(() => { if (held()) { void refresh(); listen(); } else quiet(); }, POUR.poll_ms); void dropsNow(); if (ticks) live({win, doc, onOpen: () => void dropsNow(), onDrops: (rows) => { const f = freshOf(rows, after); if (terms && f.length) (f[0].n === after + 1 ? take(f) : void dropsNow()); }});   /* THE HOUSE SAYS IT AT ONCE (Nov 20 2026, his "Build it"): the door pushes every mint its list takes (dl-drops-live.mjs), so a deposit falls into every open flask the moment it is heard, whatever the film is doing; the list is read at each opening and across a gap, never on a timer */
  }
  return {state: () => ({review, seats: seats?.length ?? null, deposits: deposits?.length ?? null, riders: riders.length, after, more, socket: ws ? ws.url ?? true : null, heard})};
}

if (typeof window !== 'undefined' && typeof document !== 'undefined' && !document.documentElement.hasAttribute('data-pour-own')) mountMintPour();   // a page that mounts it with its own doors says so (html[data-pour-own])

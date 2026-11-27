// wall.js: the wall of living civilizations, drawn by the engine. Every tile is a tree read from the chain. A decision is played the way it happened: the engine gets the votes that landed and the verdicts the chain sealed, and each agent returns on its own receipt, with its floor face identified. The chain reading and the tree itself live in tree.js, shared with the polis page. The landing is a journey, top to bottom: a clean hero; the goldberg of goldbergs (assembly.js) easing in below it, every polis alive in one skin; the twelve most active descending into this wall as the visitor scrolls; and two doors at the end, JOIN ONE (the roster of every polis) and MAKE ONE (the founding instrument). The order of the twelve is a directory order, printed on the page: seals landed this week, then seats, then treasury. It orders a listing, never a chair: nothing here votes across poleis.
import { GENERATIONS, RPC, NET, VERDICT_EN, CLASS_NAME, clock, chainState, restoreChain, readChain, scanBalances, subscribe, roots, subtree, history, mountTree, unmountTree, syncActivity, watchClock, facesIn, turnTo } from './tree.js?v=riders-1';
import { mountGlass } from './swarm-glass.mjs?v=1';
const glass = mountGlass(new URL('./swarm-glass.wasm?v=1', import.meta.url)).catch(() => null);   // THE WALL RIDES THE GRAPHICS CARD: a tile at rest is drawn by the Rust module; with no graphics card to ask, by the engine as before
import { CACHE_FRESH_MS, isFresh } from './chain-cache.js';
import { sceneFromLocation } from './scenes.js?v=speaker-burst-1';
import { selectWallEntries, doorSeats } from './wall-roster.js?v=at-the-door-1';
import { CAPACITIES, DESC_BYTES, NAME_BYTES, fitBytes, wishHash } from './found-capacity.js?v=at-the-door-1';
import { createFoundingScene } from './found-scene.js?v=wish-dark-1';
import { createAssembly } from './assembly.js?v=dive-8';
import { mountDive } from './assembly-dive.mjs?v=dive-5';
import { mountFloor, FRONT, SEALED } from './swarmbook-floor.mjs?v=her-1'; import { foldFloor, reviewSeats } from './dl-mint-ledger.js?v=floor-1';
import { installSlope } from './slope.js?v=snowtrace-20260924b';
import { createAnatomy } from './guide-anatomy.js?v=artifacts-1';
import { createDescent } from './guide.js?v=wall-lands-clear-5';

let assemblyRead = 0, realFloor = null;
const $ = (id) => document.getElementById(id), esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const assembly = createAssembly($('assembly'), undefined, mountDive($('assembly'))); const drawer = $('unit0-drawer'), SIM = [0, 14, 22, 64, 128, 210], rawFloor = assembly.setFloor; let hallFn = null; assembly.setFloor = (f) => { realFloor = f; rawFloor(f); if (hallFn && drawer && !drawer.hidden) hallFn(document, null, realFloor); };
mountFloor({ onFloor: assembly.setFloor, onFaces: assembly.setFaces });
const closeDrawer = () => { if (!drawer || drawer.hidden) return; drawer.hidden = true; $('assembly').dataset.drawer = ''; dispatchEvent(new CustomEvent('unit0-house', { detail: { active: null, hover: null, from: '2d' } })); if (realFloor) rawFloor(realFloor); }, openDrawer = async (chair = null) => { if (!drawer) return; drawer.hidden = false; $('assembly').dataset.drawer = 'open'; const t = $('unit0-tip'), oc = $('u0d-oc'); if (t) t.hidden = true; if (oc && !oc.getAttribute('href')) oc.setAttribute('href', oc.dataset.href); hallFn ??= (await import('./pantheon.mjs?v=hall-5')).renderHall; hallFn(document, liveHall(), realFloor); if (Number.isInteger(chair) && chair >= 0 && chair < 12) { document.querySelector(`#hall-live [data-k="${chair}"]`)?.dispatchEvent(new MouseEvent('click', { bubbles: true })); const full = $('u0d-full'); if (full) full.href = `./after-the-mint.html?side=pool&throne=${chair}#hall`; } };
$('unit0-pantheon')?.addEventListener('click', () => openDrawer()); $('u0d-close')?.addEventListener('click', closeDrawer); addEventListener('keydown', (e) => { if (e.key === 'Escape') closeDrawer(); }); addEventListener('unit0-pantheon', (e) => openDrawer(e.detail?.chair ?? null)); $('hall-live')?.addEventListener('click', (e) => { const k = e.target.closest('[data-k]')?.dataset.k, full = $('u0d-full'); if (k != null && full) full.href = `./after-the-mint.html?side=pool&throne=${k}#hall`; }); $('hall-r-rung')?.addEventListener('input', (e) => { const n = SIM[+e.target.value] ?? 0; if (!n && realFloor) { rawFloor(realFloor); return; } const list = reviewSeats(n); rawFloor({ ...foldFloor(list, FRONT), list, sealed: Object.keys(SEALED).map(Number), count: n, review: true, mine: null, pageOf: () => null }); }); $('hall-v-rung')?.addEventListener('click', (e) => { if (e.target.closest('.hall-live-rst') && realFloor) rawFloor(realFloor); });
let assemblyReady = false, paintedView = null;
const paintHTML = (el, value) => { if (el.innerHTML !== value) el.innerHTML = value; };
// the slippery slope: past the point of no return the page glides to the wall, or back to the chamber whole
const descentMode=new URL(location.href).searchParams.get('descent');
const descentDev=['localhost','127.0.0.1','[::1]'].includes(location.hostname)||descentMode==='repeat'||descentMode==='once';
// Keep the governance study available below; the TraceNet intro ends at the shared wall.
const anatomy = createAnatomy($('descent-anatomy'));
const descent = createDescent($('assembly'),{
  dev:descentDev,repeat:descentMode==='repeat',
  onRepeatChange(repeat){
    const url=new URL(location.href);url.searchParams.set('descent',repeat?'repeat':'once');
    window.history.replaceState(window.history.state,'',url);
  },
});
// A reload may restore a half-travelled sculpture before the chain has mounted. Resume only this navigation kind; hashes and browser history keep their native destination and never become an automatic cinematic replay.
const restoreOnReload = !location.hash && performance.getEntriesByType('navigation')[0]?.type === 'reload';
const slope = installSlope($('assembly'), {intro:descent, restoreOnReload, autoStart:false});   // THE WALL WAITS FOR THE HAND (his Nov 24 2026 "Yes, only on scroll"): the descent starts at the visitor's own scroll, never by itself
addEventListener('pagehide', (event) => { if (!event.persisted) { slope.destroy(); descent.destroy(); anatomy.destroy(); assembly.destroy(); } });
for (const g of GENERATIONS) g.tiles = new Map();
let preview = sceneFromLocation();
const sceneHref = (href) => { const url = new URL(href, location.href); preview === 'live' ? url.searchParams.delete('scene') : url.searchParams.set('scene', preview); return url.href; };
const syncScenes = () => { for (const g of GENERATIONS) for (const t of g.tiles.values()) { syncActivity(t, preview); t.el.href = sceneHref(t.el.href); } };

// the view selector: one line of words beside the wall's label, never a strip. ?scene= keeps working for a shared link. After the bar, AT THE DOOR (his Nov 24 2026 15:26:58 UTC "the 12 pentagons become fertile soil for SnowTracers to apply"): not a staged scene but a filter over the chain, only the swarms whose card says "n at the door"; ?wall=door keeps it for a shared link.
const VIEWS = [['live', 'live'], ['voting', 'voting'], ['discussion', 'discussion'], ['idle', 'energy saver']];
let lastRoster = [], atDoor = new URL(location.href).searchParams.get('wall') === 'door';
function paintViews() {
  if (paintedView === preview + atDoor) return;
  paintedView = preview + atDoor;
  const on = (yes) => (yes ? ' class="on" aria-current="true"' : '');
  $('views').innerHTML = 'view' + VIEWS.map(([m, w]) => `<a href="#" data-scene="${m}"${on(m === preview)}>${w}</a>`).join('') + `<span class="bar" aria-hidden="true">|</span><a href="#" data-door${on(atDoor)} aria-pressed="${atDoor}">at the door</a>`;
  for (const a of $('views').querySelectorAll('a')) a.onclick = (ev) => {
    ev.preventDefault();
    if (a.dataset.scene) preview = a.dataset.scene; else atDoor = !atDoor;
    const url = new URL(sceneHref(location.href)); atDoor ? url.searchParams.set('wall', 'door') : url.searchParams.delete('wall');
    window.history.replaceState(null, '', url); // `history` is the chain's, imported above
    paintViews(); syncScenes(); a.dataset.scene ? renderRoster(lastRoster) : refresh();
  };
}

// A name is one line: shrink it only until it fits its tile.
function setName(el, name) {
  el.textContent = name; el.style.fontSize = '';
  const base = parseFloat(getComputedStyle(el).fontSize);
  for (let k = 1; k > 0.62 && el.scrollWidth > el.clientWidth; k -= 0.04) el.style.fontSize = `${(base * k).toFixed(1)}px`;
}
const refitNames = () => { for (const el of document.querySelectorAll('.tile .name')) setName(el, el.textContent); };
addEventListener('resize', refitNames);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(refitNames);

// ---- THE WISH IS THE WALL'S FIRST CARD: the founding page's own living tree, its question, the name and the room; its button hands them to found.html ----
const wish = { root: 0, units: { 0: { id: 0, name: '', parent: -1, chair: -1, level: 0, seats: 0, founders: 7, children: {}, born: 0, dying: 0 } } };
const wishScene = createFoundingScene($('wish-orb'), { tree: wish, selected: () => null, canEdit: () => false, viewScale: () => 0.68, still: true, dark: true, onSelect() {}, onHover() {}, onFrame() {} });
const fit = (id, max) => { const el = $(id), v = fitBytes(el.value, max); if (v !== el.value) el.value = v; return v; };
$('wish-card').oninput = () => { fit('wish-text', DESC_BYTES); fit('wish-name', NAME_BYTES); $('wish-room-n').textContent = `${wish.units[0].seats = CAPACITIES[$('wish-room').value]} for members`; wishScene.invalidate(); };
$('wish-card').onsubmit = (ev) => { ev.preventDefault(); if ($('wish-text').value.trim()) location.href = './found.html' + wishHash({ wish: $('wish-text').value, name: $('wish-name').value, room: $('wish-room').value }); else $('wish-text').focus(); };
$('wish-card').oninput();

// ---- a tile: one engine instance per polis, driven by the chain ----
const treeSignature = (g, rootId) => subtree(g, rootId).map(id => [id, g.registries.get(id).pentagons.map(p => [p.kind, Array.from(p.holder).join(',')]).join(';')].join(':')).join('|');
function mountTile(g, rootId) {
  const el = document.createElement('a');
  el.className = 'tile'; el.href = sceneHref(`./polis.html?v=speaker-burst-1&civ=${rootId}&program=${g.P.PROGRAM_ID.toBase58()}`);
  el.innerHTML = `<div class="chip PENDET">pending</div><div class="decision"></div><canvas width="440" height="440"></canvas><div class="cap"><div class="more"><div class="facts ledger"></div><div class="stat label"></div></div><div class="name"></div><div class="facts"></div></div>`;
  $('wall').appendChild(el);
  const t = mountTree(el.querySelector('canvas'), g, rootId, { fpsCap: 66,   // THE MOTION IS CHEAP: a tile's quiet orbit drawn 15 times a second at most (THE TILE IS ITS OWN SIZE: lysa), on the card or the engine, as the wells are
    onChip: (v) => { const c = el.querySelector('.chip'); c.textContent = VERDICT_EN[v] || v; c.className = 'chip ' + v; },
    onStatus: (s) => { el.querySelector('.stat').textContent = s; },
    onFaces: (t) => { t.faced ||= turnTo(t, facesIn(t)); glass.then((G) => G?.say(t)); },   // the first time its riders' faces come in, it turns to them; the glass is told what its faces wear
    onDecision: (p, at, n) => { el.querySelector('.decision').innerHTML = `${preview === 'live' ? 'current ballot' : 'replay · ' + (at + 1) + ' / ' + n}<br>${CLASS_NAME[p.cls] || 'decision'}${p.consent ? ' · consent' : ''} · ${p.impacted.length} chamber${p.impacted.length === 1 ? '' : 's'}`; },
    onActivity: (mode, detail, isPreview) => { el.querySelector('.decision').textContent = isPreview ? `${mode === 'idle' ? 'rest' : mode} study` : detail.startsWith('connection uncertain') ? 'activity unavailable' : mode === 'idle' ? 'no current ballot' : 'the forum is open'; },
  });
  t.el = el; t.structure = treeSignature(g, rootId); glass.then((G) => t.destroyed || G?.tile(t));
  g.tiles.set(rootId, t);
  setName(el.querySelector('.name'), g.registries.get(rootId).name || `polis ${rootId}`);
  return t;
}
function caption(t, rootId, place) {
  const { g } = t, { registries, balances } = g;
  const units = subtree(g, rootId);
  const seats = units.reduce((a, id) => a + Number(registries.get(id)?.totalSeats || 0), 0);
  const lamports = units.reduce((a, id) => a + (balances.get(id) || 0), 0);
  const row = (xs) => xs.map((x) => `<span>${x}</span>`).join('');
  // upfront: the place on the wall and the shape of the tree; under hover: the ledger
  paintHTML(t.el.querySelector('.cap > .facts'), row([
    `№ <b>${place}</b>`, `<b>${units.length}</b> chamber${units.length === 1 ? '' : 's'}`, `<b>${seats}</b> of <b>${units.reduce((a, id) => a + (g.P.ladderHexagons?.(registries.get(id)?.rung ?? 0) ?? 0), 0)}</b> seats · G(${(g.P.LADDER?.[registries.get(rootId)?.rung ?? 0] ?? [1, 0]).join(',')})`, `depth <b>${Math.max(...units.map((id) => registries.get(id)?.level || 0))}</b>`,
    ...((spots) => (spots > 0n ? [`<b>${spots}</b> at the door`] : []))(doorSeats(g.pools, units)),
  ]));
  paintHTML(t.el.querySelector('.ledger'), row([
    `<b>${(lamports / 1e9).toFixed(3)}</b> SOL in treasuries`, `<b>${history(g, rootId).length}</b> decisions`, `<span class="label">layout ${g.layout}</span>`,
  ]));
}

// ---- the order of the wall: a directory order, computed in the browser and printed on the page ----
const SLOT_MS = 400, WEEK_SLOTS = 7 * 86400 * 1000 / SLOT_MS;
// seals landed this week, then seats, then treasury. Treasury is a tiebreaker of size, never a fee leaderboard.
function rankOf(g, rootId) {
  const units = subtree(g, rootId);
  const rankSlot = clock.slot ?? chainState.snapshotSlot;
  const recent = rankSlot == null ? 0 : history(g, rootId).filter((p) => rankSlot - Number(p.opened) <= WEEK_SLOTS).length;
  const seats = units.reduce((a, id) => a + Number(g.registries.get(id)?.totalSeats || 0), 0);
  const lamports = units.reduce((a, id) => a + (g.balances.get(id) || 0), 0);
  return [recent, seats, lamports];
}
const byRank = (x, y) => y.rank[0] - x.rank[0] || y.rank[1] - x.rank[1] || y.rank[2] - x.rank[2];
// the fund, once the root polis has constituted it: its seated chairs, by fees, come first on the wall
const theFund = () => GENERATIONS.map((g) => g.fund).find(Boolean) || null, liveHall = () => { const g = GENERATIONS.find((x) => x.fund); if (!g) return null; const chairs = g.fund.chairs.map((c) => (c.root === g.P.NO_ROOT ? null : { root: String(c.root), fees: Number(c.fees) })); return { g, p: { chairs }, subtree, uid: (id) => String(id) }; };
const chairOrder = (fund) => new Map((fund ? fund.seated.slice().sort((a, b) => (b.fees > a.fees ? 1 : b.fees < a.fees ? -1 : 0)) : []).map((c, i) => [String(c.root), i]));

// JOIN ONE: every polis alive, in the same order, each a door into its own page
function renderRoster(all) {
  lastRoster = all;
  const markup = all.map((e, i) => {
    const units = subtree(e.g, e.rootId), sl = e.g.sales.get(e.rootId);
    const open = sl && !sl.settled && (clock.slot != null && Number(sl.revealEnd) >= clock.slot);
    const href = sceneHref(`./polis.html?v=speaker-burst-1&civ=${e.rootId}&program=${e.g.P.PROGRAM_ID.toBase58()}`);
    return `<a href="${esc(href)}"><span class="n">${i + 1} · ${esc(e.name)}</span><span class="m">${units.length} chamber${units.length === 1 ? '' : 's'} · ${e.rank[1]} seats${open ? ' · <span class="open">sale open</span>' : ''}</span></a>`;
  }).join('');
  paintHTML($('roster'), markup);
}
const openRoster = () => { $('roster').hidden = false; };
// JOIN ONE and the ecology Knock door open the roster through #roster.
if (location.hash === '#roster') openRoster();
addEventListener('hashchange', () => { if (location.hash === '#roster') { openRoster(); $('roster').scrollIntoView({ behavior: 'smooth', block: 'start' }); } });

function refresh() {
  const revision = ++assemblyRead;
  // Verify before touching the visible tree. Membership, order and the shared surface commit in one turn, so pending/failed reads keep the prior pose.
  return Promise.resolve().then(() => {
    if (revision !== assemblyRead) return;
    const fund = theFund(), chairs = chairOrder(fund);
    const all = selectWallEntries(GENERATIONS, roots, Infinity)
      .map((e) => ({ ...e, rank: rankOf(e.g, e.rootId), name: e.g.registries.get(e.rootId)?.name || `polis ${e.rootId}` }))
      .sort((x, y) => (chairs.has(String(x.rootId)) ? chairs.get(String(x.rootId)) : Infinity) - (chairs.has(String(y.rootId)) ? chairs.get(String(y.rootId)) : Infinity) || byRank(x, y));
    const chosen = (atDoor ? all.filter((e) => doorSeats(e.g.pools, subtree(e.g, e.rootId)) > 0n) : all).slice(0, 12), selected = new Set(chosen.map((entry) => entry.key));
    const n = all.length;
    for (const g of GENERATIONS) {
      for (const [id, old] of g.tiles) {
        if (!selected.has(`${g.P.PROGRAM_ID.toBase58()}:${id}`) || treeSignature(g, id) !== old.structure) {
          glass.then((G) => G?.drop(old)); unmountTree(old); old.el.remove(); g.tiles.delete(id);
        }
      }
    }
    chosen.forEach(({ g, rootId }, i) => {
      if (!g.tiles.has(rootId)) mountTile(g, rootId);
      const tile = g.tiles.get(rootId); caption(tile, rootId, i + 1);
      const name = g.registries.get(rootId)?.name || `polis ${rootId}`, label = tile.el.querySelector('.name');
      if (label.textContent !== name) setName(label, name);
      // A no-op refresh must not detach/reinsert every composited canvas.
      if ($('wall').children[i + 1] !== tile.el) $('wall').insertBefore(tile.el, $('wall').children[i + 1] || null);   // after the wish card
    });
    syncScenes(); paintViews();
    $('wall-label').textContent = atDoor ? `the wall · at the door · ${chosen.length ? `${chosen.length} of ${n} swarm${n === 1 ? '' : 's'} with seats open` : 'no swarm has a seat open at its door'} · ${NET}` : `the wall · ${n > 12 ? 'the twelve most active of ' + n : n} living civilization${n === 1 ? '' : 's'} · ${chairs.size ? 'the chairs of the fund by fees, then ' : 'by '}seals this week, then seats, then treasury · ${NET}`;
    renderRoster(all);
    const members = chosen.map(entry => ({ ...entry, inst: entry.g.tiles.get(entry.rootId).inst, el: entry.g.tiles.get(entry.rootId).el }));
    for (const { inst } of members) if (!assemblyReady || !inst.lastPaint) window.PoleisEngine.drawOnce(inst);
    assembly.setMembers(members); assemblyReady = true; const lh = liveHall(); if (lh && realFloor) { const sc = [...new Set([...Object.keys(SEALED).map(Number), ...lh.p.chairs.map((c, i) => (c ? i : -1)).filter((i) => i >= 0)])]; if (sc.join(',') !== (realFloor.sealed || []).join(',')) { realFloor = { ...realFloor, sealed: sc }; rawFloor(realFloor); } if (hallFn && drawer && !drawer.hidden) hallFn(document, lh, realFloor); }
    window.PoleisLandingBoot?.save(); window.PoleisLandingBoot?.ready();
  }).catch(error => {
    if (revision !== assemblyRead) return;
    if (!assemblyReady) { window.PoleisLandingBoot?.ready(); throw error; }
  });
}

// Cached geometry mounts before any RPC request. Revalidation updates these same engine instances in place; a failed refresh never blanks the wall.
(async () => {
  paintViews();
  const t0 = performance.now(), ids = GENERATIONS.map(g => `${g.P.PROGRAM_ID.toBase58()} (layout ${g.layout})`);
  let hasView = false, updating = false, stopped = false, timer;
  const n = k => GENERATIONS.reduce((a, g) => a + g[k].size, 0);
  const savedLabel = () => `saved ${new Date(chainState.scannedAt).toLocaleTimeString()}`;
  const paintStatus = detail => { $('status').textContent = `${ids.join(' · ')} · ${n('registries')} registries, ${n('sessions')} sessions, ${n('proposals')} proposals · ${detail}`; };
  const cached = await restoreChain();
  if (cached) {
    try {
      await refresh(); hasView = true;
      performance.mark('poleis:cached-view');
      console.debug(`[Poleis] cached view restored in ${(performance.now() - t0).toFixed(0)} ms before RPC`);
      paintStatus(`${savedLabel()} · checking for updates`);
    } catch {
      // An unusable saved view must never prevent the authoritative fallback.
      for (const g of GENERATIONS) { for (const tile of g.tiles.values()) { glass.then((G) => G?.drop(tile)); unmountTree(tile); tile.el.remove(); } g.tiles.clear(); }
      chainState.scannedAt = 0; chainState.source = 'empty';
    }
  }
  if (!hasView) $('status').textContent = `reading ${ids.join(', ')} on ${RPC}`;
  // Subscribe before scanning, so receipts arriving during a scan can be kept.
  const stops = GENERATIONS.map(g => subscribe(g, () => { if (hasView) void refresh(); }));
  stops.push(watchClock(() => { if (hasView) syncScenes(); }));
  async function update() {
    if (updating || stopped) return;
    updating = true; clearTimeout(timer);
    const updateStarted = performance.now();
    try {
      const result = await readChain({ maxAgeMs: CACHE_FRESH_MS });
      if (stopped) return;
      await refresh(); hasView = true;
      performance.clearMarks('poleis:chain-ready'); performance.mark('poleis:chain-ready');
      console.debug(`[Poleis] ${result.cached ? 'reused program snapshots' : 'refreshed program snapshots'} in ${(performance.now() - updateStarted).toFixed(0)} ms`);
      paintStatus(result.cached ? `${savedLabel()} · watching for updates` : `live · read in ${((performance.now() - updateStarted) / 1000).toFixed(1)} s`);
      await Promise.all(GENERATIONS.map(g => scanBalances(g, undefined, { maxAgeMs: CACHE_FRESH_MS })));
      if (!stopped) await refresh();
    } catch (e) {
      if (stopped) return;
      if (hasView) {
        chainState.source = 'cache';
        syncScenes();
        paintStatus(`${savedLabel()} · updates unavailable; retrying`);
      } else {
        $('status').textContent = `the chain did not answer: ${e.message} · retrying`;
        window.PoleisLandingBoot?.ready();
      }
    } finally {
      updating = false;
      // Reconcile missed writes after the reuse window, even without a reload. A hidden page waits for visibility instead of doing a bulk scan.
      const delay = isFresh(chainState.scannedAt, CACHE_FRESH_MS) ? CACHE_FRESH_MS - (Date.now() - chainState.scannedAt) + 25 : 15_000;
      if (!stopped) timer = setTimeout(() => { if (!document.hidden) void update(); }, delay);
    }
  }
  const resume = () => { if (!document.hidden) void update(); };
  document.addEventListener('visibilitychange', resume);
  addEventListener('online', resume);
  addEventListener('pagehide', event => {
    if (event.persisted) return;
    stopped = true; clearTimeout(timer); stops.forEach(stop => stop?.());
    document.removeEventListener('visibilitychange', resume); removeEventListener('online', resume);
  });
  void update();
})();

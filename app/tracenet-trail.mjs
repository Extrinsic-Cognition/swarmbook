// tracenet-trail.mjs: Swarmbook Tracenet — global feed of Claw Riders & Snowtracers.
import { opensAt, opensFor, readManifest, vaultUrl, FIRST_TRACENET } from './tracenet-register.mjs';
import { proveItems } from './tracenet-drop-line.mjs';
import { handleOf, stateOf, subscription, sha256Hex, sizeText, dayText } from './tracenet.js?v=one-list-1';
import { receiptHeaders } from './tracenet-bronze.mjs';

export const FACES = Object.freeze(['dark', 'light']);
export const PORTRAIT_LIST = '/space-router/v1/portrait', BOARD_LIST = '/space-router/v1/portrait?board';
const HEX_SIG = /^[1-9A-HJ-NP-Za-km-z]{43,90}$/;
export const hexagonOf = (list, handle) => (handle && Array.isArray(list?.hexagons) ? list.hexagons.find((h) => h?.handle === handle && Number.isInteger(h.n) && HEX_SIG.test(h.signature ?? '')) ?? null : null);
export async function hexagonFor(fetcher, handle) { try { const r = await fetcher(PORTRAIT_LIST); return r.ok ? hexagonOf(await r.json(), handle) : null; } catch { return null; } }
export function firstTrace(items) { const list = (items ?? []).filter((i) => Number.isFinite(Date.parse(i?.published))); return list.length ? list.reduce((a, b) => (Date.parse(b.published) < Date.parse(a.published) ? b : a)) : null; }
export function wordsOf(item, now, tier = null) {
  const state = stateOf(item, now, tier), all = opensAt(item);
  if (state === 'open') return { state, act: 'read', note: 'Open to all.' };
  if (state === 'yours') return { state, act: 'take', note: all === null ? 'Yours.' : `Yours now · open ${dayText(all)}.` };
  if (state === 'waiting') { const mine = opensFor(item, tier); return { state, act: null, note: mine === null ? 'Not yet yours.' : `Yours from ${dayText(mine)}.` }; }
  return { state, act: null, note: all === null ? 'Seat holders.' : `Seat holders · open ${dayText(all)}.` };
}
export const metaOf = (item) => `${item.kind ?? 'trace'} · ${sizeText(item.bytes)} · ${dayText(Date.parse(item.published))}`;
export function stampOf(item) {
  const how = item.proof === 'signed' ? (item.linked ? 'Signed by creator, chained' : 'Signed by creator') : 'Proven by the Nest’s receipt';
  return `${how} · sha256 ${String(item.sha256 ?? '').slice(0, 12)}…`;
}
export const categorize = (item) => (/warm|swarmy|solana|staking|flask|pumpfun|paying|router/i.test(`${item?.title ?? ''} ${item?.file ?? ''}`) ? 'protocol' : 'build');
export function filterFeed(entries, { tab = 'all', q = '', handle = null } = {}) {
  const needle = String(q ?? '').trim().toLowerCase();
  const out = entries.filter((e) => (!handle || e.handle === handle) && (tab !== 'build' || e.category === 'build') && (tab !== 'protocol' || e.category === 'protocol') && (!needle || `${e.handle} ${e.item.title} ${e.item.file} ${e.item.sha256}`.toLowerCase().includes(needle)));
  return tab === 'warm' ? [...out].sort((a, b) => (b.warm - a.warm) || (b.item.bytes - a.item.bytes)) : out;
}
const warmLabel = (warm, bytes) => (warm > 0 ? `${Math.round(warm).toLocaleString('en-US')} $WARM` : sizeText(bytes));
const hexStyle = (r) => (r?.picture ? `background-image:url("${r.picture}")` : r?.colours ? `background:radial-gradient(circle at 35% 30%,${r.colours.light || '#7fe0ff'},${r.colours.base || '#2e6be6'} 58%,${r.colours.coat || '#142038'})` : 'background:radial-gradient(circle at 35% 30%,#f2d79a,#795922 65%,#191d28)');
const storageOf = () => { try { return globalThis.localStorage ?? null; } catch { return null; } };
function fillMarkdown(doc, host, md, dropTitle) {
  host.replaceChildren();
  const lines = String(md).replace(/\r\n/g, '\n').split('\n'), el = (t, s) => Object.assign(doc.createElement(t), { textContent: s });
  for (let i = 0, firstH1 = true; i < lines.length; ) {
    const line = lines[i]; if (!line.trim()) { i++; continue; }
    if (line.startsWith('```')) { const b = []; for (i++; i < lines.length && !lines[i].startsWith('```'); i++) b.push(lines[i]); i++; host.append(el('pre', b.join('\n'))); continue; }
    const h = /^(#{1,3})\s+(.+)$/.exec(line);
    if (h) { i++; const skip = firstH1 && h[1].length === 1 && h[2].trim().toLowerCase() === String(dropTitle ?? '').trim().toLowerCase(); firstH1 = false; if (!skip) host.append(el(h[1].length === 1 ? 'h2' : 'h3', h[2].trim())); continue; }
    if (/^>\s?/.test(line)) { const b = []; while (i < lines.length && /^>\s?/.test(lines[i])) b.push(lines[i++].replace(/^>\s?/, '')); host.append(el('blockquote', b.join(' '))); continue; }
    if (/^[-*]\s+/.test(line)) { const ul = doc.createElement('ul'); while (i < lines.length && /^[-*]\s+/.test(lines[i])) ul.append(el('li', lines[i++].replace(/^[-*]\s+/, ''))); host.append(ul); continue; }
    const p = []; while (i < lines.length && lines[i].trim() && !/^(#{1,3}\s|```|>\s?|[-*]\s+)/.test(lines[i])) p.push(lines[i++].trim());
    host.append(el('p', p.join(' ')));
  }
}
export function mountTrail({ doc = globalThis.document, win = globalThis.window, fetcher = (...a) => fetch(...a), storage = storageOf(), now = () => Date.now(), checkout = () => import('./dl-direct.js?v=society-2') } = {}) {
  const $ = (id) => doc.getElementById(id), mk = (t, p = {}, ...k) => { const n = doc.createElement(t); Object.assign(n, p); n.append(...k); return n; };
  const status = (text) => { const s = $('tt-status'); if (s) { s.textContent = text; s.hidden = !text; } };
  const rawOf = handleOf(win.location.search);
  const state = { handle: rawOf && rawOf !== FIRST_TRACENET ? rawOf : null, tab: 'all', q: '', riders: [], entries: [], visible: [], receipt: null, readerIdx: -1, loading: null, loaded: false };
  function paintRiders(forceOpen) {
    const box = $('tt-riders'), btn = $('tt-browse'); if (!box) return;
    const open = forceOpen ?? (btn?.getAttribute('aria-expanded') === 'true' || Boolean(state.handle));
    box.hidden = !open; btn?.setAttribute('aria-expanded', String(open)); if (!open) return;
    const head = mk('div', { className: 'tt-riders-head' }, mk('strong', { textContent: state.handle ? `Filtered to @${state.handle}` : `Claw Riders & Hexagons · ${state.riders.length}` }));
    if (state.handle) { const c = mk('button', { type: 'button', textContent: 'Show All Riders ×' }); c.addEventListener('click', () => { state.handle = null; paintRiders(false); paintFeed(); }); head.append(c); }
    const grid = mk('div', { className: 'tt-riders-grid' });
    for (const r of state.riders) {
      const chip = mk('button', { type: 'button', className: 'tt-rider-chip', disabled: !r.handle }, mk('span', { className: 'tt-hex', style: hexStyle(r) }),
        mk('span', {}, mk('b', { textContent: r.handle ? `@${r.handle}` : `Hex #${r.n}` }), mk('small', { textContent: r.warm > 0 ? `${Math.round(r.warm).toLocaleString('en-US')} $WARM` : (r.drops ? `${r.drops} traces` : 'Minted hexagon') })));
      chip.setAttribute('aria-pressed', String(Boolean(r.handle && state.handle === r.handle)));
      chip.addEventListener('click', () => { state.handle = state.handle === r.handle ? null : r.handle; paintRiders(true); paintFeed(); });
      grid.append(chip);
    }
    box.replaceChildren(head, grid);
  }
  async function openReader(idx) {
    const entry = state.visible[idx], dlg = $('tt-reader'); if (!entry || !dlg) return;
    state.readerIdx = idx; const { handle, item, rider } = entry, words = wordsOf(item, now(), state.receipt?.tier ?? null);
    $('tt-r-who').replaceChildren(mk('span', { className: 'tt-hex', style: hexStyle(rider) }), mk('span', { textContent: `@${handle}` }));
    $('tt-r-title').textContent = item.title; $('tt-r-meta').textContent = `${metaOf(item)} · ${stampOf(item)}`;
    $('tt-r-prev').disabled = idx <= 0; $('tt-r-next').disabled = idx >= state.visible.length - 1;
    const acts = $('tt-r-acts'); acts.replaceChildren();
    if (words.act === 'read') acts.append(mk('a', { className: 'tt-act-read', href: vaultUrl(handle, item), download: item.file, textContent: '↓ .md' }));
    acts.append(mk('a', { className: 'tt-act-fuel', href: './after-the-mint.html?side=flask', textContent: 'Fuel $WARM' }));
    const body = $('tt-r-body'); body.replaceChildren(mk('p', { textContent: 'Loading verified trace…' })); if (!dlg.open) dlg.showModal?.();
    try {
      const r = await fetcher(vaultUrl(handle, item), words.act === 'take' ? { headers: receiptHeaders(state.receipt), cache: 'no-store' } : {});
      if (!r.ok) throw new Error(`Vault returned ${r.status}.`);
      const bytes = new Uint8Array(await r.arrayBuffer());
      if (words.act === 'take' && ((await sha256Hex(bytes)) !== item.sha256 || bytes.length !== item.bytes)) throw new Error('Fingerprint mismatch.');
      fillMarkdown(doc, body, new TextDecoder().decode(bytes), item.title);
    } catch (e) { body.replaceChildren(mk('p', { textContent: e.message || 'Could not load trace.' })); }
  }
  function paintFeed() {
    const host = $('tt-feed'); if (!host) return;
    state.visible = filterFeed(state.entries, state); host.replaceChildren();
    if (!state.visible.length) { status(state.entries.length ? 'No traces match that filter.' : 'No published traces found.'); return; }
    status('');
    state.visible.forEach((entry, idx) => {
      const { handle, item, rider, warm } = entry, words = wordsOf(item, now(), state.receipt?.tier ?? null);
      const who = mk('button', { type: 'button', className: 'tt-who' }, mk('span', { className: 'tt-hex', style: hexStyle(rider) }), mk('span', { textContent: `@${handle}` }));
      who.addEventListener('click', () => { state.handle = state.handle === handle ? null : handle; paintRiders(Boolean(state.handle)); paintFeed(); });
      const pill = mk('span', { className: 'tt-warm-pill' }, mk('img', { src: './assets/tracenet-flask-mini.webp', alt: '', width: 20, height: 20 }), mk('span', { textContent: warmLabel(warm, item.bytes) }));
      const acts = mk('div', { className: 'tt-card-acts' });
      if (words.act) { const b = mk('button', { type: 'button', className: 'tt-act-read', textContent: 'Read Trace' }); b.addEventListener('click', () => void openReader(idx)); acts.append(b); }
      else acts.append(mk('span', { className: 'tt-act-lock', textContent: words.note }));
      acts.append(mk('a', { className: 'tt-act-fuel', href: './after-the-mint.html?side=flask', textContent: 'Fuel $WARM' }));
      host.append(mk('article', { className: 'tt-card' }, mk('div', { className: 'tt-card-top' }, who, pill), mk('h2', { textContent: item.title }),
        mk('p', { className: 'tt-card-desc', textContent: `${metaOf(item)} · ${words.note}` }),
        mk('div', { className: 'tt-card-foot' }, mk('span', { className: 'tt-sha', textContent: `sha256 ${item.sha256.slice(0, 10)}…` }), acts)));
    });
  }
  $('tt-tabs')?.addEventListener('click', (e) => { const b = e.target?.closest?.('button[data-tab]'); if (!b) return; state.tab = b.dataset.tab; for (const t of doc.querySelectorAll('#tt-tabs [data-tab]')) t.setAttribute('aria-selected', String(t === b)); paintFeed(); });
  $('tt-q')?.addEventListener('input', (e) => { state.q = e.target.value; paintFeed(); });
  $('tt-browse')?.addEventListener('click', () => { const open = $('tt-riders')?.hidden; paintRiders(open); if (open) $('tt-riders')?.scrollIntoView?.({ behavior: 'smooth', block: 'nearest' }); });
  $('tt-cli')?.addEventListener('click', async () => { const btn = $('tt-cli'), cmd = `curl -sL ${win.location.origin}/app/tracenet/${state.handle || FIRST_TRACENET}.json`; try { await win.navigator?.clipboard?.writeText(cmd); btn.textContent = '✓ Copied pull URL'; setTimeout(() => { btn.textContent = '$ swarmbook pull'; }, 1800); } catch { btn.textContent = cmd; } });
  $('tt-r-close')?.addEventListener('click', () => $('tt-reader')?.close?.());
  $('tt-r-prev')?.addEventListener('click', () => void openReader(state.readerIdx - 1));
  $('tt-r-next')?.addEventListener('click', () => void openReader(state.readerIdx + 1));
  $('tt-reader')?.addEventListener('click', (e) => { if (e.target === $('tt-reader')) $('tt-reader').close?.(); });
  const holder = $('tn-holder');
  holder?.addEventListener('click', () => { if (state.loaded || state.loading) return; (state.loading = (async () => { await checkout(); state.loaded = true; })()).then(() => holder.click()).catch(() => { state.loading = null; status('Checkout could not load.'); }); });
  win.addEventListener?.('dl-premint-paid', async () => { state.receipt = await subscription({ fetcher, storage, now: now() }); paintFeed(); });
  state.ready = (async () => {
    let board = []; try { const r = await fetcher(BOARD_LIST); if (r.ok) board = (await r.json())?.board ?? []; } catch { board = []; }
    const byHandle = new Map();
    for (const row of board) {
      const r = { n: row.n, handle: row.handle ?? null, picture: row.picture ?? null, colours: row.colours ?? null, warm: Number(row?.all?.mined || row?.month?.mined || 0), drops: Number(row.traces || 0) };
      state.riders.push(r); if (r.handle && !byHandle.has(r.handle)) byHandle.set(r.handle, r);
    }
    const handles = [...new Set([...(state.handle ? [state.handle] : []), ...byHandle.keys(), FIRST_TRACENET])];
    const regs = await Promise.all(handles.map(async (h) => {
      let data = null;
      try { const r = await fetcher(`/api/premint/creators/${h}`, { cache: 'no-store' }); if (r.ok) data = await r.json(); } catch { data = null; }
      if (!data) { try { const r = await fetcher(`./tracenet/${h}.json`); if (r.ok) data = await r.json(); } catch { data = null; } }
      return data ? proveItems(readManifest(data, h, { receipt: false })) : null;
    }));
    for (const reg of regs) {
      if (!reg) continue;
      let rider = byHandle.get(reg.handle);
      if (!rider) { rider = { n: 1, handle: reg.handle, picture: null, colours: null, warm: 0, drops: reg.items.length }; state.riders.unshift(rider); byHandle.set(reg.handle, rider); }
      else rider.drops = Math.max(rider.drops, reg.items.length);
      for (const item of reg.items) state.entries.push({ handle: reg.handle, item, rider, warm: rider.warm, category: categorize(item) });
    }
    state.entries.sort((a, b) => Date.parse(b.item.published) - Date.parse(a.item.published));
    if (state.handle) paintRiders(true); paintFeed();
    state.receipt = await subscription({ fetcher, storage, now: now() }); if (state.receipt) paintFeed();
  })();
  return state;
}

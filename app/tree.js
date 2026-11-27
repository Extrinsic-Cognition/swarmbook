// tree.js: what every page shares. One reader per generation of the program,
// the tree of a polis read from its registries and its current activity.
// Live receipts settle individually. Historical playback is an explicit preview.
import { create as createLive } from '../js/poleis-client.js';
import { create as createGen7 } from './gen/poleis-client-v7.js';
import { LADDER, skinForRung, rungFor } from './orb.js';
import { ActivityScene } from './scenes.js?v=speaker-burst-1';
import { classifyActivity } from './activity.js?v=speaker-burst-1';
import { createSnapshotStore, snapshotScope, isFresh } from './chain-cache.js';
import { mountRiders, seatedOf, pictureOf } from './riders.mjs?v=riders-1';

export const RPC = new URLSearchParams(location.search).get('rpc') || 'https://api.devnet.solana.com';
export const NET = RPC.includes('devnet') ? 'devnet' : RPC.includes('127.0.0.1') ? 'localnet' : 'the chain';
export const web3 = window.solanaWeb3;
export const E = window.PoleisEngine;
// web3 derives the websocket endpoint itself: the same host, and one port up when the RPC names one (8899 -> 8900 on a local validator)
export const conn = new web3.Connection(RPC, { commitment: 'confirmed' });
// Every generation of the program is read. A layout bump is a new program id,
// and the poleis founded on the old one stay alive there, so each generation
// keeps the client that reads its layout; a client parses only its own layout,
// so two generations under one id cost one extra scan and never a wrong tree.
export const GENERATIONS = [{ layout: 7, P: createGen7({ web3, nacl: window.nacl }) }, { layout: 8, P: createLive({ web3, nacl: window.nacl }) }];
for (const g of GENERATIONS) Object.assign(g, { registries: new Map(), sessions: new Map(), proposals: new Map(), balances: new Map(), configs: new Map(), sales: new Map(), registryData: new Map(), assemblyFloors: new Map(), fund: null, tallies: new Map(), options: new Map(), stakes: new Map(), pools: new Map(), knocks: new Map() });
export const clock = { slot: null, updated: 0 };
export const VERDICT = { 1: 'RATUM', 2: 'REIECTUM', 3: 'DISSENSIO', 4: 'DISSENSIO' };
export const VERDICT_EN = { RATUM: 'PASSED', REIECTUM: 'REJECTED', DISSENSIO: 'DEADLOCK', PENDET: 'pending', SUFFRAGIUM: 'voting', SETTLING: 'settling', DISCUSSIO: 'discussion', OTIUM: 'at rest', PREVIEW: 'motion preview' };
export const CLASS_NAME = ['codex', 'signal', 'treasury', 'seat', 'act'];
export const key = (h) => Array.from(h).map((b) => b.toString(16).padStart(2, '0')).join('');
export const uid = (b) => b.toString(); // unit ids are 64-bit and Number rounds past 2^53: keys are decimal strings
export const nameOf = (id) => `u${id}`;

// the skin a chamber wears is the rung its registry stores: the G(m,n) of the
// ladder, its hexagons the floor's capacity, unsold seats absent. A registry
// without a rung wears the lowest rung that holds its seats
const skins = new Map();
export function skinForSeats(seats, rung) {
  const r = Number.isInteger(rung) && rung >= 0 && rung < LADDER.length ? rung : rungFor(Number(seats));
  if (!skins.has(r)) { const s = skinForRung(r); skins.set(r, { pents: s.faces.slice(0, 12), hexes: s.faces.slice(12) }); }
  return skins.get(r);
}

// ---- the chain ----
function take(g, d, address, lamports = 0, verify = true) {
  const { P } = g;
  // the fund: the polis of poleis, its tallies, its options and its stakes (the legacy generation has none)
  if (P.Fund && d[0] === P.DISC.FUND) { const f = P.Fund.parse(d); if (f && address?.equals(P.fundPda())) { f.lamports = lamports; g.fund = f; return ['fund', f]; } }
  if (P.FeeTally && d[0] === P.DISC.FEE_TALLY) { const t = P.FeeTally.parse(d); if (t) { g.tallies.set(uid(t.root), t); return ['tally', t]; } }
  if (P.Option && d[0] === P.DISC.OPTION) { const o = P.Option.parse(d); if (o) { g.options.set(key(o.hash), o); return ['option', o]; } }
  if (P.Stake && d[0] === P.DISC.STAKE) { const s = P.Stake.parse(d); if (s) { g.stakes.set(`${key(s.hash)}|${s.unit}|${s.holder.toBase58()}`, s); return ['stake', s]; } }
  // the door: a chamber's pool of spots open by admission, and the keys knocking at it
  if (P.Pool && d[0] === P.DISC.POOL) { const pl = P.Pool.parse(d); if (pl && address?.equals(P.poolPda(pl.unit))) { g.pools.set(uid(pl.unit), pl); if (verify) verifyKnocks(g, pl.unit).catch(() => {}); return ['pool', pl]; } }
  if (P.Knock && d[0] === P.DISC.KNOCK) { const kn = P.Knock.parse(d); if (kn) { g.knocks.set(`${uid(kn.unit)}|${kn.key.toBase58()}`, kn); return ['knock', kn]; } }
  // a closed knock arrives as an empty account: forget it by its address
  if (d.length === 0 && address && P.Knock) { for (const [k, kn] of g.knocks) if (P.knockPda(kn.unit, kn.key).equals(address)) { g.knocks.delete(k); return ['knock', null]; } }
  if (d[0] === P.DISC.REGISTRY) { const r = P.Registry.parse(d); if (r) { if (address && !address.equals(P.registryPda(r.unit))) return null; g.registries.set(uid(r.unit), r); g.registryData.set(uid(r.unit), d.slice()); return ['registry', r]; } }
  else if (d[0] === P.DISC.SESSION) { const s = P.Session.parse(d); if (s) { g.sessions.set(`${key(s.hash)}|${s.unit}`, s); return ['session', s]; } }
  else if (d[0] === P.DISC.PROPOSAL) { const p = P.Proposal.parse(d); if (p) { g.proposals.set(key(p.hash), p); return ['proposal', p]; } }
  else if (P.DISC.CONFIG !== undefined && d[0] === P.DISC.CONFIG) { const c = P.Config.parse(d); if (c) { if (address && !address.equals(P.configPda(c.root ?? 0n))) return null; g.configs.set(uid(c.root ?? 0n), c); return ['config', c]; } }
  else if (P.DISC.SEAT_SALE !== undefined && d[0] === P.DISC.SEAT_SALE) { const sl = P.Sale.parse(d); if (sl && sl.saleId === 0n) { g.sales.set(uid(sl.unit), sl); return ['sale', sl]; } }
  else if (P.AssemblyFloor && d[0] === P.DISC.ASSEMBLY_FLOOR) { const r = P.AssemblyFloor.parse(d); if (r && address?.equals(P.assemblyFloorPda(r.sourceProgram, r.unit))) { g.assemblyFloors.set(`${r.sourceProgram.toBase58()}:${r.unit}`, r); return ['assembly-floor', r]; } }
  return null;
}
// a knock closes to a key outside this program, so the program's subscription never says so:
// after a pool moves (an admission), ask the chain which knocks at that unit still stand
export async function verifyKnocks(g, unit) {
  const mine = [...g.knocks.entries()].filter(([, kn]) => kn.unit === unit);
  if (!mine.length) return false;
  const infos = await conn.getMultipleAccountsInfo(mine.map(([, kn]) => g.P.knockPda(kn.unit, kn.key)), 'confirmed');
  let gone = false;
  mine.forEach(([k, kn], i) => { if (!infos[i]) {
    g.knocks.delete(k); g.rawAccounts?.delete(g.P.knockPda(kn.unit, kn.key).toBase58()); gone = true;
  } });
  if (gone) scheduleCacheSave();
  if (gone) window.dispatchEvent(new Event('poleis:knocks'));
  return gone;
}
// Keep parsed Map objects alive: mounted engines close over them. A successful
// scan replaces their contents; a failed scan leaves the complete old view.
const ACCOUNT_MAPS = ['registries', 'sessions', 'proposals', 'configs', 'sales', 'registryData', 'assemblyFloors', 'tallies', 'options', 'stakes', 'pools', 'knocks'];
export const chainState = { scannedAt: 0, snapshotSlot: null, source: 'empty' };
let cacheStore, cacheTimer, chainRequest;
const store = () => cacheStore ||= createSnapshotStore(snapshotScope(RPC, GENERATIONS));
function decodeSnapshot(g, accounts) {
  const next = { P: g.P, fund: null, rawAccounts: new Map() };
  for (const name of ACCOUNT_MAPS) next[name] = new Map();
  for (const row of accounts) {
    take(next, row.data, new web3.PublicKey(row.address), row.lamports, false);
    next.rawAccounts.set(row.address, row);
  }
  return next;
}
function installSnapshot(g, next) {
  for (const name of ACCOUNT_MAPS) { g[name].clear(); for (const [id, value] of next[name]) g[name].set(id, value); }
  g.fund = next.fund; g.rawAccounts = next.rawAccounts;
  for (const id of g.balances.keys()) if (!g.registries.has(id)) g.balances.delete(id);
}
export async function restoreChain() {
  try {
    const saved = await store().read();
    if (!saved || saved.generations.length !== GENERATIONS.length) return null;
    const decoded = GENERATIONS.map((g, i) => {
      const row = saved.generations[i];
      if (row.program !== g.P.PROGRAM_ID.toBase58() || row.layout !== g.layout) throw new Error('cache scope changed');
      return decodeSnapshot(g, row.accounts);
    });
    // A subscription can observe parent and child writes separately. Such a
    // partial saved graph must trigger a fresh read, never a broken renderer.
    for (const next of decoded) {
      const visited = new Set(), visiting = new Set();
      const visit = id => {
        if (visited.has(id)) return;
        if (visiting.has(id) || !next.registries.has(id)) throw new Error('incomplete cached tree');
        visiting.add(id);
        for (const child of childrenOf(next, next.registries.get(id))) visit(child.unit);
        visiting.delete(id); visited.add(id);
      };
      for (const id of next.registries.keys()) visit(id);
    }
    GENERATIONS.forEach((g, i) => {
      const row = saved.generations[i];
      installSnapshot(g, decoded[i]);
      g.balances.clear(); for (const [id, value] of row.balances) if (g.registries.has(id)) g.balances.set(id, value);
      g.balancesAt = row.balancesAt; g.accountSlot = row.slot;
      g.observedSlot = Math.max(row.slot, ...row.accounts.map(a => a.slot || 0));
    });
    chainState.scannedAt = saved.scannedAt;
    chainState.snapshotSlot = Math.min(...saved.generations.map(g => g.slot));
    chainState.source = 'cache';
    // No cached clock becomes evidence of an open ballot or a missed deadline.
    clock.slot = null; clock.updated = 0;
    return { scannedAt: saved.scannedAt, savedAt: saved.savedAt };
  } catch { return null; }
}
export async function saveChainCache() {
  if (!chainState.scannedAt || GENERATIONS.some(g => !g.rawAccounts)) return false;
  try { return await store().write({ scannedAt: chainState.scannedAt, savedAt: Date.now(), generations: GENERATIONS.map(g => ({
    program: g.P.PROGRAM_ID.toBase58(), layout: g.layout, slot: g.accountSlot,
    accounts: [...g.rawAccounts.values()], balances: [...g.balances], balancesAt: g.balancesAt || 0,
  })) }); } catch { return false; }
}
function scheduleCacheSave() {
  if (cacheTimer) return;
  cacheTimer = setTimeout(() => { cacheTimer = null; void saveChainCache(); }, 250);
}
async function fetchSnapshot(g, reset = false) {
  const minContextSlot = reset ? 0 : (g.observedSlot || g.accountSlot || 0);
  const result = await conn.getProgramAccounts(g.P.PROGRAM_ID, { commitment: 'confirmed', withContext: true, minContextSlot });
  return { slot: result.context.slot, accounts: result.value.map(({ account, pubkey }) => ({
    address: pubkey.toBase58(), data: new Uint8Array(account.data), lamports: account.lamports, slot: result.context.slot,
  })) };
}
export async function scan(g) {
  const result = await fetchSnapshot(g);
  installSnapshot(g, decodeSnapshot(g, result.accounts)); g.accountSlot = result.slot;
}
// Every treasury of a generation in one request. A recent, complete balance
// observation is reused too; account deltas do not extend its freshness.
export async function scanBalances(g, ids = [...g.registries.keys()], { maxAgeMs = 0 } = {}) {
  if (isFresh(g.balancesAt, maxAgeMs) && ids.every(id => g.balances.has(id))) return;
  const observedAt = Date.now(), next = new Map();
  for (let i = 0; i < ids.length; i += 100) {
    const chunk = ids.slice(i, i + 100);
    const infos = await conn.getMultipleAccountsInfo(chunk.map(id => g.P.treasuryPda(BigInt(id))), 'confirmed');
    chunk.forEach((id, k) => next.set(id, infos[k] ? infos[k].lamports : 0));
  }
  for (const [id, value] of next) if (g.registries.has(id)) g.balances.set(id, value);
  if ([...g.registries.keys()].every(id => next.has(id))) g.balancesAt = observedAt;
  scheduleCacheSave();
}
/** One in-flight read. Only the read-only landing opts into the reuse window. */
export function readChain({ maxAgeMs = 0 } = {}) {
  if (chainRequest) return chainRequest;
  chainRequest = (async () => {
    let reuse = isFresh(chainState.scannedAt, maxAgeMs);
    const observedAt = Date.now();
    if (!reuse) for (const g of GENERATIONS) g.scanUpdates = new Map();
    try {
      const slot = await conn.getSlot('confirmed');
      // A validator can restart at the same endpoint. A backwards clock
      // invalidates reuse and its old slot watermark; only a full read replaces it.
      const reset = chainState.snapshotSlot != null && slot < chainState.snapshotSlot;
      if (reset) { reuse = false; for (const g of GENERATIONS) g.scanUpdates = new Map(); }
      const snapshots = reuse ? null : await Promise.all(GENERATIONS.map(g => fetchSnapshot(g, reset)));
      if (snapshots) {
        const decoded = snapshots.map((snapshot, i) => {
          const rows = new Map(snapshot.accounts.map(row => [row.address, row]));
          // Subscription receipts newer than the scan must not be rolled back.
          for (const [address, update] of GENERATIONS[i].scanUpdates) if (update.slot > snapshot.slot) {
            update.row.data.length ? rows.set(address, update.row) : rows.delete(address);
          }
          return decodeSnapshot(GENERATIONS[i], [...rows.values()]);
        });
        GENERATIONS.forEach((g, i) => {
          installSnapshot(g, decoded[i]); g.accountSlot = snapshots[i].slot;
          g.observedSlot = Math.max(g.accountSlot, ...[...g.rawAccounts.values()].map(row => row.slot || 0));
          if (reset) { g.balances.clear(); g.balancesAt = 0; }
        });
        chainState.scannedAt = observedAt; chainState.snapshotSlot = slot; chainState.source = 'live';
        scheduleCacheSave();
      }
      clock.slot = slot; clock.updated = Date.now();
      return { cached: reuse, scannedAt: chainState.scannedAt };
    } catch (error) { clock.slot = null; throw error; }
    finally { for (const g of GENERATIONS) g.scanUpdates = null; }
  })().finally(() => { chainRequest = null; });
  return chainRequest;
}
// A deadline passes without an account write. Refresh the clock independently;
// a failed read is unknown, never evidence of current voting.
export function watchClock(onChange) {
  let pending = false;
  const update = async () => {
    if (pending) return; pending = true;
    try { clock.slot = await conn.getSlot('confirmed'); clock.updated = Date.now(); }
    catch { clock.slot = null; }
    finally { pending = false; onChange(); }
  };
  const timer = setInterval(update, 5000);
  const visible = () => { if (!document.hidden) update(); };
  document.addEventListener('visibilitychange', visible);
  return () => { clearInterval(timer); document.removeEventListener('visibilitychange', visible); };
}
/** on(kind, view) for every account change, including authenticated assembly-floor pages. */
export function subscribe(g, on) {
  const id = conn.onProgramAccountChange(g.P.PROGRAM_ID, (info, context) => {
    const row = { address: info.accountId.toBase58(), data: new Uint8Array(info.accountInfo.data), lamports: info.accountInfo.lamports };
    if (context.slot < Math.max(g.accountSlot || 0, g.rawAccounts?.get(row.address)?.slot || 0)) return;
    row.slot = context.slot; g.observedSlot = Math.max(g.observedSlot || 0, context.slot);
    g.scanUpdates?.set(row.address, { row, slot: context.slot });
    const got = take(g, row.data, info.accountId, row.lamports);
    if (g.rawAccounts) {
      row.data.length ? g.rawAccounts.set(row.address, row) : g.rawAccounts.delete(row.address);
      scheduleCacheSave();
    }
    if (got) on(got[0], got[1]);
  }, 'confirmed');
  return () => conn.removeProgramAccountChangeListener(id);
}

// ---- the tree ----
export const childrenOf = (g, r) => r.pentagons.map((p, k) => (p.kind === g.P.HOLDER.UNIT ? { chair: k, unit: uid(g.P.holderUnit(p.holder)) } : null)).filter(Boolean);
export function subtree(g, id, out = []) { out.push(id); const r = g.registries.get(id); if (r) for (const c of childrenOf(g, r)) subtree(g, c.unit, out); return out; }
// A polis is alive when it is a council, or a founding whose first sale is still
// open. A founding whose reveal window passed with nothing revealed can never
// ratify: it stays on chain and off the wall.
export function alive(g, rootId) {
  const cfg = g.configs.get(rootId);
  if (!cfg) return true; // layout 7 keeps one config for its one tree
  if (cfg.mode === g.P.MODE.COUNCIL) return true;
  const sl = g.sales.get(rootId);
  // Directory membership may use the saved observation's slot; activity
  // still requires the freshly read clock. Null must not compare as slot zero.
  const observedSlot = clock.slot ?? chainState.snapshotSlot;
  return !!sl && (sl.board.length > 0 || (observedSlot != null && Number(sl.revealEnd) >= observedSlot));
}
export const roots = (g) => [...g.registries.values()].filter((r) => r.level === 0).map((r) => uid(r.unit)).filter((id) => alive(g, id));
// the decisions of one tree, oldest first: a proposal belongs to the tree its origin is in.
// Only a decision closed under the chairs is drawn: every crew bound in a touched
// chamber was a chamber of it. The chain refuses anything else since round 12; what the
// older law let through stays on chain and is not drawn
export const closed = (g, p) => { const imp = new Set(p.impacted.map(uid)); return p.impacted.every((id) => { const r = g.registries.get(uid(id)); return !r || childrenOf(g, r).every((c) => imp.has(c.unit)); }); };
export const history = (g, rootId) => { const units = new Set(subtree(g, rootId)); return [...g.proposals.values()].filter((p) => units.has(uid(p.origin)) && closed(g, p)).sort((a, b) => Number(a.opened - b.opened)); };
export const sessionOf = (g, p, id) => g.sessions.get(`${key(p.hash)}|${id}`);

// ---- a swarm wears its riders (riders.mjs): a chamber's keys are read once a registry, a key's face asked once; a ball at rest is drawn again when faces came in ----
const trees = new Set(), seated = new WeakMap();
export const riders = mountRiders({ draw: (list) => import('./dl-her-portrait.js?v=portrait-4').then((m) => m.drawHers(list.map((c) => ({ parts: Object.fromEntries(m.PARTS.map((k) => [k, c[k]])), painted: [...m.PARTS], light: c.light, gaze: null, sel: 'light' })), { px: PX })), onFaces: () => { for (const t of trees) { t.on.onFaces?.(t); if (t.inst.paused) E.drawOnce(t.inst); } } });   /* THE PENTAGONS ARE THE NECROMANCERS (his Nov 23 2026 11:30 UTC: "if a pentagon is a single signer, it is a person: in our default choices it is either nefertiti, dante, newly created pfp... lyssajudrons are hexagons, necromancers are pentagons"): a pentagon one key holds wears its person, Nefertiti (THE RIDER IS A HEXAGON, his Nov 24 2026 ~18:1x UTC "you are misunderstanding hexagons and pentagons": a Harmony user is a rider, a hexagon, and their colours are the hexagon's); one that is a unit is its own tree; an open one wears nobody. The picture is asked once and a ball at rest drawn again when it comes. */ const persons = new Map(); export const personOf = (who, picture = pictureOf) => { if (!persons.has(who)) { persons.set(who, null); picture(new URL(`./assets/${who}`, import.meta.url).href).then((img) => { persons.set(who, { rest: { img }, wait: { img, dim: 0.42 }, yes: { img, rim: '#FFC62E', width: 5 } }); for (const t of trees) { t.on.onFaces?.(t); if (t.inst.paused) E.drawOnce(t.inst); } }, () => {}); } return persons.get(who); }, NECROMANCER = 'her-sprite.png', LYSSAJUDRON = 'her-default.jpg';   /* A HELD HEXAGON WEARS HER (his Nov 23 2026 "why u making hexagons blank in some?", then "yeah. build all"; Nov 22 14:08 "we should allow everyone to have their own colored face lyssajudron there"): a hexagon a key holds wears that rider's own Lyssajudron when the house holds one, else her in her default colours (her-default.jpg, her own painter's drawing of them); a hexagon nobody holds stays bare, so the seats still read off the ball */
export function seatedIn(g, r) { if (r && !seated.has(r)) { seated.set(r, seatedOf(r, (h) => (h.kind === g.P.HOLDER.KEY ? new web3.PublicKey(h.holder).toBase58() : null))); riders.ask(seated.get(r)); } return seated.get(r) ?? []; }
/** facesIn(t): the hexagons of a society's root that wear a face now (every one a key holds: its rider's Lyssajudron, or her default). turnTo(t, at): the society turned so that those hexagons of its root face the glass; false with none. */
export const facesIn = (t) => seatedIn(t.g, t.g.registries.get(t.rootId)).flatMap((k, i) => (k ? [i] : []));
export function turnTo(t, at) {
  const n = at.map((i) => t.inst.geo[nameOf(t.rootId)]?.hexes[i]?.normal).filter(Boolean); if (!n.length) return false;
  const [x, y, z] = [0, 1, 2].map((k) => n.reduce((a, v) => a + v[k], 0)), yaw = Math.atan2(x, -z);
  Object.assign(t.inst, { yaw0: yaw - t.inst.animT * t.inst.spin, discussionViewYaw: yaw, discussionViewAt: t.inst.animT, pitch: Math.max(-0.9, Math.min(-0.16, -0.8 * Math.atan2(y, Math.hypot(x, z)))) });
  return true;
}

// ---- a tree in the engine, driven by the chain ----
/** o: size, onChip(verdict), onStatus(text), onDecision(p, at, n), onIdle(). Returns t; play the next decision with playNext(t). */
export function mountTree(canvas, g, rootId, o = {}) {
  const { registries } = g;
  const units = subtree(g, rootId);
  const orgs = units.map((id) => ({ n: nameOf(id), d: '', v: 'PENDET', py: 0, pn: 0, pa: 0, hy: 0, hn: 0 }));
  const children = {}, chairs = {};
  for (const id of units) { const r = registries.get(id); const ch = childrenOf(g, r); if (ch.length) children[nameOf(id)] = ch.map((c) => ({ seat: c.chair, to: nameOf(c.unit) })); }
  for (const id of units) chairs[nameOf(id)] = registries.get(id).pentagons.map(p => ({
    kind: p.kind === g.P.HOLDER.UNIT ? 'unit' : p.kind === g.P.HOLDER.KEY ? 'key' : 'vacant',
    holder: key(p.holder),
  }));
  const t = { g, rootId, at: -1, inst: null, units: units.length, on: o, preview: 'live', mode: null,
    liveBallot: null, previewBallot: false, replayCount: 0, replayTimer: null, settleTimer: null, discussion: null, destroyed: false };
  t.scene = new ActivityScene(canvas);
  // a lone chamber does not fill the square: every root is drawn at the size a
  // root with one crew in orbit would have, and only a deeper tree shrinks from there
  const EXT = E.extentOf(children, nameOf(rootId), 2.1, 0.5);
  t.inst = E.mount(canvas, {
    name: nameOf(rootId), orgs, children, chairs,
    size: o.size || 440, extentScale: 1.12 * Math.min(1, EXT / 2.6), orbit: 2.1, childScale: 0.5, tetherEnd: 1.64,
    yaw0: Number(BigInt(rootId) % 360n) * 0.0175, spin: 0.00030, seed: 1000 + Number(BigInt(rootId) % 100000n) + g.layout * 13,
    cullOffscreen: true, driven: true, dpr: o.dpr ?? true, fpsCap: o.fpsCap, /* the bitmap follows the display's pixel ratio: sharp on retina; a small tile says dpr: false and a cap in ms between paints (THE WELLS COST LESS) */
    geoOf: (name) => { const r = registries.get(name.slice(1)); return skinForSeats(r.totalSeats, r.rung); },
    onChip: (v) => { if (t.preview === 'voting') o.onChip?.('PREVIEW'); else if (t.mode === 'voting') o.onChip?.('SUFFRAGIUM'); },
    onStatus: () => {}, // Display activity, not the engine's illustrated countdown.
    onIdle: () => {}, // Activity and individual return motions determine the handoff.
  });
  t.inst.wear = (node, i, vote, type) => { if (type === 'pent') return registries.get(node.slice(1))?.pentagons[i]?.kind === g.P.HOLDER.KEY ? personOf(NECROMANCER)?.rest ?? null : null; const k = seatedIn(g, registries.get(node.slice(1)))[i], hers = riders.wears(k, vote, t.inst.agentVoting) ?? (k ? personOf(LYSSAJUDRON) : null); return !hers || hers.img ? hers : !t.inst.agentVoting ? hers.rest : vote === 'gold' ? hers.yes : hers.wait; };
  trees.add(t);
  E.setActive(t.inst, false);
  t.scene.bind(t.inst);
  return t;
}
export function unmountTree(t) { t.destroyed = true; trees.delete(t); clearTimers(t); t.scene.destroy(); E.unmount(t.inst); }
export function activityOf(g, rootId, discussion = null) {
  return classifyActivity({ proposals: history(g, rootId), units: subtree(g, rootId), sessionFor: (p, id) => sessionOf(g, p, id), votingState: g.P.STATE.VOTING, slot: clock.slot, discussion });
}
// One mode gate shared by the wall and the individual polis. A live snapshot
// adds confirmed identities to the current ballot; it never replays that ballot.
function clearTimers(t) {
  clearTimeout(t.replayTimer); clearTimeout(t.settleTimer);
  t.replayTimer = null; t.settleTimer = null;
}
function slotValue(value) {
  if (typeof value === 'bigint') return value >= 0n ? value : null;
  if (typeof value === 'number') return Number.isSafeInteger(value) && value >= 0 ? BigInt(value) : null;
  if (typeof value === 'string' && /^\d+$/.test(value)) return BigInt(value);
  return null;
}
function sessionEnd(g, session) {
  if (!session) return null;
  if (Object.values(g.P.STATE).includes(session.state) && session.state !== g.P.STATE.VOTING) return 'closed';
  const slot = slotValue(clock.slot), deadline = slotValue(session.deadline);
  return session.state === g.P.STATE.VOTING && slot !== null && deadline !== null && slot > deadline ? 'deadline' : null;
}
function sessionVerdict(g, session) {
  if (!session || session.state === g.P.STATE.EXPIRED) return null;
  return VERDICT[session.state] || null;
}
function ballotUnits(t, p) {
  const impacted = new Set(p.impacted.map(uid));
  return subtree(t.g, t.rootId).filter(id => impacted.has(id));
}
function reconcileFloor(t) {
  for (const id of subtree(t.g, t.rootId)) {
    const node = nameOf(id), st = t.inst.st[node], r = t.g.registries.get(id), sold = Number(r.totalSeats);
    if (!st) continue;
    const geometry = skinForSeats(sold, r.rung), previous = st.hv;
    t.inst.geo[node] = geometry; // The cache preserves identity within a skin class.
    st.hv = Array.from({ length: geometry.hexes.length }, (_, i) => i >= sold ? 'vacant'
      : previous[i] === 'vacant' ? null : previous[i] ?? null);
  }
}
// A holder's seats occupy consecutive hexagons. Read its exact vote once and
// attach it to every owned index, including skins with more than twenty seats.
function recordedVotes(t, p) {
  const votes = [], { P, registries } = t.g;
  const choice = (v, floor) => v === P.VOTE.PRO ? (floor ? 'gold' : 'yes')
    : v === P.VOTE.CONTRA ? (floor ? 'red' : 'no') : v === P.VOTE.ABSTENTIO ? 'abstain' : null;
  for (const id of ballotUnits(t, p)) {
    const r = registries.get(id), s = sessionOf(t.g, p, id), node = nameOf(id);
    if (!s) continue;
    for (let i = 0; i < 12; i++) {
      const v = choice(s.chairVoice(i), false);
      if (v === null) continue;
      const chair = r.pentagons[i];
      const child = chair.kind === P.HOLDER.UNIT ? sessionOf(t.g, p, uid(P.holderUnit(chair.holder))) : null;
      // An expired child's mandate encodes ABSTENTIO but adds no abstention
      // tally: it is heard-from absence. The parent voice must exist first.
      votes.push(child?.state === P.STATE.EXPIRED
        ? { node, kind: 'pent', i, v: 'absens', reason: 'expired-child' }
        : { node, kind: 'pent', i, v });
    }
    let cursor = 0;
    const capacity = t.inst.geo[node].hexes.length;
    for (const [i, holder] of r.holders.entries()) {
      const v = choice(s.holderVoice(i), true), seats = Number(holder.seats);
      if (v !== null) for (let j = 0; j < seats && cursor + j < capacity; j++) votes.push({ node, kind: 'hex', i: cursor + j, v });
      cursor += seats;
    }
  }
  return votes;
}
function feedLiveBallot(t, p) {
  reconcileFloor(t);
  // Final account writes can arrive with the terminal state. Read all voices
  // before marking the remaining eligible identities absent or showing a seal.
  for (const vote of recordedVotes(t, p)) E.receiveAgentVote(t.inst, vote);
  for (const id of ballotUnits(t, p)) {
    const s = sessionOf(t.g, p, id), reason = sessionEnd(t.g, s);
    const verdict = sessionVerdict(t.g, s);
    // Supply a real outcome with its terminal proof before release can be
    // scheduled. setAgentVerdict closes missing direct voices itself.
    if (verdict) E.setAgentVerdict(t.inst, nameOf(id), verdict);
    else if (reason) E.expireAgentUnit(t.inst, nameOf(id), reason);
  }
}
function showMode(t, mode, preview) {
  t.mode = mode; t.scene.set(mode, preview, t.discussion);
}
function beginLiveBallot(t, p) {
  const id = key(p.hash), changed = t.liveBallot?.id !== id;
  if (changed) {
    t.liveBallot = { id, p, ended: false };
    reconcileFloor(t);
    E.beginAgentBallot(t.inst, { id: `live:${id}`, units: ballotUnits(t, p).map(nameOf), preview: false });
    const h = history(t.g, t.rootId); t.at = h.indexOf(p);
    t.on.onDecision?.(p, t.at, h.length);
  } else {
    t.liveBallot.p = p;
    // Quiet orbit preserves receipts while the clock is unavailable. Rebind
    // the same ballot on recovery without restarting any confirmed arrival.
    E.beginAgentBallot(t.inst, { id: `live:${id}`, units: ballotUnits(t, p).map(nameOf), preview: false });
  }
  return changed;
}
export function syncActivity(t, preview = 'live', discussion = null) {
  if (t.destroyed) return;
  const changed = t.preview !== preview;
  t.preview = preview; t.discussion = discussion;
  if (changed) {
    clearTimers(t); t.previewBallot = false;
    // Explicit preview changes may abandon a study. Live account polling may not.
    if (t.liveBallot || t.inst.agentVoting) E.endAgentBallot(t.inst);
    t.liveBallot = null;
  }
  const activity = activityOf(t.g, t.rootId, discussion);
  if (preview === 'voting') {
    const fresh = changed || t.mode !== 'voting' || !t.previewBallot;
    if (fresh) { t.previewBallot = true; playNext(t); }
    showMode(t, 'voting', true); t.on.onChip?.('PREVIEW');
    const hasHistory = history(t.g, t.rootId).length > 0;
    const detail = hasHistory ? 'motion preview · deepest chambers first; recorded choices; arrival and deadline timing illustrated' : 'no recorded ballot · agents remain in orbit';
    t.on.onStatus?.(detail);
    if (!hasHistory) t.on.onActivity?.('voting', detail, true);
    return;
  }
  if (preview === 'live') {
    if (activity.mode === 'voting') {
      clearTimeout(t.settleTimer); t.settleTimer = null;
      beginLiveBallot(t, activity.proposal);
      feedLiveBallot(t, activity.proposal);
      showMode(t, 'voting', false);
      t.on.onChip?.('SUFFRAGIUM');
      t.on.onStatus?.('voting now · child chambers resolve before their parents');
      return;
    }
    if (t.liveBallot) {
      const tracked = t.liveBallot;
      tracked.p = t.g.proposals.get(tracked.id) || tracked.p;
      feedLiveBallot(t, tracked.p);
      if (E.hasPendingAgentMotion(t.inst)) {
        tracked.ended = false; // A late confirmed receipt can replace a timeout.
        showMode(t, 'voting', false);
        const uncertain = activity.reason === 'chain clock unavailable';
        const returning = [...t.inst.agentBallot.votes.values()].some(receipt => Number.isFinite(receipt.start)
          && t.inst.animT < receipt.start + receipt.duration);
        const harmonizing = E.agentWaveActive(t.inst);
        const releasing = E.agentReleaseActive(t.inst);
        const resolved = [...t.inst.agentBallot.units].every(node => t.inst.agentBallot.resolved.has(node));
        const progress = releasing ? 'agents returning to orbit' : harmonizing ? 'outcome resounding through the tree'
          : returning ? 'agents returning to their chairs' : resolved ? 'chambers preparing to return to orbit' : 'awaiting child resolution';
        const detail = uncertain ? `connection uncertain · ${returning && !harmonizing && !releasing ? 'confirmed votes settling' : progress}`
          : `${activity.expired ? 'window ended' : 'ballot closed'} · ${progress}`;
        t.on.onChip?.('SETTLING'); t.on.onStatus?.(detail); t.on.onActivity?.('voting', detail, false);
        if (!t.settleTimer) t.settleTimer = setTimeout(() => {
          t.settleTimer = null;
          if (!t.destroyed && t.preview === 'live') syncActivity(t, 'live', t.discussion);
        }, 100);
        return;
      }
      // An unknown clock never closes a still-open session. Keep its identity
      // and received voices so a recovered connection resumes without a reset.
      const ids = ballotUnits(t, tracked.p);
      if (!tracked.ended && ids.length && ids.every(id => sessionEnd(t.g, sessionOf(t.g, tracked.p, id)))) {
        E.endAgentBallot(t.inst); tracked.ended = true;
      }
    }
  }
  clearTimeout(t.settleTimer); t.settleTimer = null;
  const mode = preview === 'live' ? activity.mode : preview;
  showMode(t, mode, preview !== 'live');
  // Entering discussion clears any prior engine ballot. A later live ballot
  // must rebind its identity, even if that proposal was previously observed.
  if (mode === 'discussion') t.liveBallot = null;
  t.on.onChip?.(preview !== 'live' ? 'PREVIEW' : mode === 'discussion' ? 'DISCUSSIO' : 'OTIUM');
  const detail = mode === 'discussion' ? (preview !== 'live' ? 'poetry study · complete poems on a shared clock; illustrative discussion' : 'discussion in progress · public message metadata')
    : activity.reason === 'chain clock unavailable' && preview === 'live' ? 'connection uncertain · activity unavailable'
    : activity.expired && preview === 'live' ? 'window ended · awaiting seal' : 'quiet orbit · energy saver mode';
  t.on.onStatus?.(detail); t.on.onActivity?.(mode, detail, preview !== 'live');
}
// The preview resolves one depth at a time, leaves first. These relative
// arrival/deadline times illustrate the order; they are not transaction times.
export function playNext(t) {
  const h = history(t.g, t.rootId);
  clearTimeout(t.replayTimer); t.replayTimer = null;
  if (!h.length) {
    reconcileFloor(t);
    E.beginAgentBallot(t.inst, { id: `preview:empty:${++t.replayCount}`, units: [], preview: true });
    return null;
  }
  t.at = (t.at + 1) % h.length;
  const p = h[t.at], rnd = t.inst.rnd, events = [];
  reconcileFloor(t);
  const units = ballotUnits(t, p), names = new Set(units.map(nameOf));
  const nodes = t.inst.nodes.filter(node => names.has(node.name));
  const depths = nodes.map(node => node.depth), maxDepth = Math.max(0, ...depths), minDepth = Math.min(maxDepth, ...depths);
  const stage = new Map(nodes.map(node => [node.name, (maxDepth - node.depth) * 8000]));
  const duration = (maxDepth - minDepth + 1) * 8000 + 1800;
  E.beginAgentBallot(t.inst, { id: `preview:${key(p.hash)}:${++t.replayCount}`, units: [...names], preview: true });
  for (const vote of recordedVotes(t, p)) events.push({ ...vote, t: stage.get(vote.node) + 400 + rnd() * 3200 });
  for (const id of units) {
    const s = sessionOf(t.g, p, id), reason = sessionEnd(t.g, s);
    const start = stage.get(nameOf(id));
    if (reason) events.push({ t: start + 4200, node: nameOf(id), kind: 'deadline', reason });
    const verdict = sessionVerdict(t.g, s);
    if (verdict) events.push({ t: start + 6500, node: nameOf(id), kind: 'verdict', v: verdict });
  }
  E.scheduleAgentVotes(t.inst, events);
  t.on.onDecision?.(p, t.at, h.length);
  const advance = () => {
    t.replayTimer = null;
    if (t.destroyed || t.preview !== 'voting') return;
    const ballot = t.inst.agentBallot;
    if (!ballot?.preview) return;
    // Browser timers can fire while RAF is suspended. The study must complete
    // its active timeline and consume every queued receipt before advancing.
    if (ballot.events.length || t.inst.animT - ballot.started < duration || E.hasPendingAgentMotion(t.inst)) {
      t.replayTimer = setTimeout(advance, 100); return;
    }
    playNext(t);
  };
  t.replayTimer = setTimeout(advance, duration);
  return { p, at: t.at, n: h.length };
}

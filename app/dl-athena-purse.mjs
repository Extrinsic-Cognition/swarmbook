// dl-athena-purse.mjs · THE FUEL IN HER TANK (Oct 22 2026 20:39 WEST, his "yeah ok... but you need to put the fucking minirouter fuel in her tank dude
// please... hypertrace all we had done historically also with MMO animations for when calls were expended"). The MiniRouter purse in Nefertiti's unit0 on
// the layer (dl-athena-layer.mjs), by the house's own law and painter, nothing invented:
//   THE FUEL, the ale in her unit0 (Sept 21 03:46 "start drawing a 'liquid line' that is supposed to simulate that there is fuel inside of the unit0...
//   the bottom should be darker like as if there was ale in it"; Sept 18 "turn the unit0 of every swarm as the 'tank fuel'");
//   THE BALANCE under Blobby, or under the surface while a Harmony claims him, and what calls in flight hold (Sept 21 09:52 "how much money is left in
//   the minirouter tank??", 09:59 "start showing the balance right below blobby of how much money we got in the router");
//   THE DAMAGE NUMBERS, the MMO animation for a call expended: every call landing while she is out rises from his feet as "-$0.80 · 99k" for three
//   beats, coloured by its lane, big over half a dollar, and the balance pulses red (Sept 21 09:59 "every time we use tokens i wanna see like in league of
//   legends the DPS or any number flashing to screen showing me how much i spent"; Sept 22 21:16 "i had all the fucking MMO looking expense animation
//   thing"; Oct 14 09:40 "I HAD MMO TYPA ANIMATIONS FOR EVERY MINIROUTER EXPENSE"); THE PIRANHAS, the liquid bitten by the burn (Sept 28 20:56 "THE MMO
//   LIKE ANIMATION OF TANK FUEL BEING SLOWLY DEPLETED LIKE FUCKIN PIRANHAS"); a sale of the mint as a drop of its metal (Oct 14, THE FUEL IS A FLUID).
// ONE PURSE, ONE PAINTER (his Oct 11 21:4x "there is only 1 anamorphic moving thing"): what is painted here is room/lyssajudron-purse.mjs, the one page's
// own painter in her square (mountPurse2D: layers over her unit0, under her perch, the money over everything), fed by the same three refs the one page
// reads: house/purse (tools/embertide-mesh/lib/house-purse.mjs writes it on a cause: the router's posted credit, what in flight holds, the high-water
// mark, the level, the newest calls of both Macs with their own ids and times), house/blobby (where he is), mint/drops (the mint's sales), read once
// when her engine stands and then followed on the window's one connection to the Nest (room/nest-hub.mjs NestSource). No purse on the Nest: nothing.
// THE LEVEL IS THE ONE LAW'S (room/unit0-liquid.mjs purseLevel: his word on the tank while it stands, Oct 16 2026 17:17 "make it 50% full", as the Board,
// the well and the laptop take it): applied to the value before the painter reads it (levelled); money, rows and ledger stand as the ref holds them.
// THE TIME: a number's instant is its row's own on the genesis grid (the painter's law: the same flight on every glass); this glass hands the painter
// the Mac's clock, the house time to the millisecond on a Mac that keeps it (no second clock in the window). A row older than this glass's first
// picture is history and never rises: what burned while she was in the ball is at rest when she comes out.
// COST: nothing until her first coming (this module and the painter's come with her engine, 170 KB once); then one GET of each ref, one subscriber on
// the window's one socket (nothing flows at rest), and the purse's sample on the engine's own paint while she is shown (20 pictures a second at rest,
// every picture while a number flies); in the ball nothing runs (her engine is paused, so nothing samples).
import {PURSE_SCHEMA, purseLevel} from '../vendor/embertide-app/ui/intro/room/unit0-liquid.mjs';

export const PURSE_PAINTER = '../../room/lyssajudron-purse.mjs', NEST_HUB = '../../room/nest-hub.mjs';
export const REFS = Object.freeze(['house/purse', 'house/blobby', 'mint/drops', 'house/settings']);   // the one page's PURSE_REFS, in its order (pinned by the test)
const num = (v) => typeof v === 'number' && Number.isFinite(v);

/** levelled(value): a purse's value with the tank's level as the one law reads it (his word while it stands, else the purse's own, a thousandth's step);
 *  any other value as it is. Pure. */
export function levelled(value) {
  if (!value || typeof value !== 'object' || value.schema !== PURSE_SCHEMA) return value;
  const level = purseLevel(value);
  return level == null ? value : {...value, level};
}

/** mountPurseIn({doc, box, before, disc, fetcher, nest, refs, Source, now, dpr, zoom, modules, stalled}) -> {take, sample, read, first, state, close}.
 *  stalled(): THE TANK HEARS THE ASK (Nov 4 2026): the seats stalled on his word, as agents-fact.mjs stalledOf orders them, from the follower the page already
 *  holds (one-shadows.mjs: its agents layer); read at the mount and at every sample, so the one at the centre and his two answers stand in her tank (the law's
 *  stall, lyssajudron-purse.mjs); null: a page with no agents.
 *  box: her square (the layer's figure); before: her perch (the purse's layers go under it); disc(): her unit0 in the box's px (discIn), null while the
 *  engine has none; fetcher: the page's fetch; nest: the Nest's origin; refs: the ref names (REFS); Source: an EventSource over the Nest (the hub's
 *  NestSource by default); now(): the house time; modules: {purse, hub} already loaded (a test's). take(ref, name) is the cause, and the seam for a proof:
 *  a reading {value, rev} handed in as the Nest's stream would hand it, never written anywhere. */
export async function mountPurseIn({doc, box, before = null, disc = () => null, fetcher = (...a) => fetch(...a), nest, refs = REFS, Source = null,
  now = () => Date.now(), dpr = 1, zoom = null, modules = null, stalled = null} = {}) {
  const P = modules?.purse ?? await import(PURSE_PAINTER);
  const Src = Source ?? (modules?.hub ?? await import(NEST_HUB)).NestSource;
  const law = P.createPurse(), painter = P.mountPurse2D({document: doc, box, before, disc, dpr, zoom, law});
  const Q = {refs: 0, reads: 0, errors: 0, es: null, closed: false};
  painter.mark(now());   // this glass has the time: what the purse listed before now is history
  const ask = () => { if (typeof stalled !== 'function') return false; let st = null; try { st = stalled(); } catch { Q.errors++; st = null; } if (!law.stall(st, now())) return false; painter.touch(); return true; };
  ask();
  const sample = () => { if (Q.closed) return null; ask(); try { return painter.sample(now()); } catch { Q.errors++; return null; } };
  function take(ref, name = refs[0]) {
    if (Q.closed || !ref || typeof ref !== 'object' || !refs.includes(name)) return false;
    const moved = painter.take(levelled(ref.value ?? null), {rev: num(ref.rev) ? ref.rev : null, now: now(), ref: name});
    if (moved) { Q.refs++; sample(); }
    return moved;
  }
  async function read() {   // the keyframe: at mount, and when the stream opened again or said it skipped
    for (const name of refs) {
      if (Q.closed) return;
      try { const r = await fetcher(`${nest}/nest/ref/${name}`, {cache: 'no-store'}), j = r && r.ok ? await r.json() : null; if (j?.ref) take(j.ref, name); } catch { Q.errors++; }
    }
    Q.reads++;
  }
  function follow() {   // the refs when they move: one subscriber for the three, on the window's one socket
    if (Q.es || Q.closed || typeof Src !== 'function') return;
    try {
      let opened = false; const es = Q.es = new Src(`${nest}/nest/stream?types=ref&refs=${refs.join(',')}`);
      es.onmessage = (m) => { try { const e = JSON.parse(m.data), n = e && e.type === 'ref' && e.payload ? e.payload.name : null; if (refs.includes(n)) take(e.payload, n); } catch { /* not an entry */ } };
      es.onopen = () => { if (opened) void read(); opened = true; };
      if (typeof es.addEventListener === 'function') es.addEventListener('gap', () => void read());
    } catch { Q.es = null; Q.errors++; }
  }
  follow();
  const first = read();
  return {
    take, sample, read, first,
    state: () => ({...painter.state(), refs: Q.refs, reads: Q.reads, errors: Q.errors, stream: !!Q.es}),
    close() { Q.closed = true; if (Q.es) { try { Q.es.close(); } catch { /* closed */ } Q.es = null; } painter.stop(); },
  };
}

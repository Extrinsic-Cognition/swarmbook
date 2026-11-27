// space-tanks.mjs · SPACE-ROUTER'S TANKS (Oct 26 2026; his words: ../SPACE-ROUTER-THE-TANKS-LANDING.md; Sept 17 15:04 "make it fucking unlimited").
// A TANK is one holder's key and balance on the purse door (minirouter-openai-shim.mjs): Aiolos, Nefertiti, a rider, a sponsored seat. The treasury pours into
// it in bulk (a refill row, his hand) and every call drinks from it (a burn row: the router's own cost plus the tank's markup, the house's take, which is what
// MiniRouter keeps today: x-minirouter-markup-bps 500). There is no day cap: the tank is the limit, and a dry tank is a 402 with nothing sent.
//   <dir>/tanks.json          { schema, tanks: { <name>: { key_sha256, private, markup_bps, made_at } } }   the key's hash, never the key
//   <dir>/keys/<name>.key     the key itself (sr_…), 0600, written once by `space-tanks.mjs add` and read by the holder's harness; never printed
//   <dir>/ledger.jsonl        one row a pour, a drink or a mint: { at, kind: 'refill', tank, usd, why } | { at, kind: 'burn', tank, usd, router_usd, markup_bps, warm, … }
//                             | { at, kind: 'mint', tank, usd: 0, hexagon | tracenet, why }
// <dir> is ~/.embertide/space-router (SPACE_TANKS_DIR for a test). The ledger is the one truth: every reader folds it, so a refill written by the CLI is seen
// by the door's next call.
// THE HOLD: a call is let in while the tank holds more than its calls in flight; each call in flight holds the tank's fair price (the mean of its last twenty
// drinks, 5 cents before its first), never MiniRouter's worst case (his Sept 21 12:50: twelve astra units refused on a "worst-case estimate"). So the last call
// may drink past zero by what it cost over its hold, and the next is refused until a refill. At a house door (a local brain) a call costs nothing and needs
// nothing in the tank: it is let in free and burned at 0, so the tank still counts it.
// $WARM ON THE BURN: the charge, the hold, the rate and its halving by date are one law with the site's public door (embertide-app/ui/intro/dyson-society/app/
// space-router-law.mjs, his words there). A burn row carries the $WARM its dollars mined at its instant (SPACE_ROUTER_OPENED_AT; none named: the opening's rate);
// an older row without one is mined at its own instant's rate. A refill, a call at a house door and what $WARM paid (THE COUNTER-TANK DRINKS) mine nothing.
// PROMPT-TO-MINE IS FOR WHO MINTED (his Nov 22 2026 14:08:14 UTC "prompt-2-mine with $WARM should not be possible unless people minted the lyssajudron"; the site's
// half: dyson-society/worker/space-router.mjs): a call mines only for a tank whose mint row stood as it was let in. That row is the treasury's witness of what the
// site says, a hexagon's number or a paid tracenet's receipt, by his hand as a pour is. What a tank mined before the rule stays its own.
// COST: a call stats tanks.json and the ledger, re-reads tanks.json only when it changed and the ledger only from where it last stopped; no timer, no poll.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { NAME_RX, FIRST_HOLD_USD, FAIR_OF, WARM_PER_USD, USD_PER_WARM, isTankKey, charge, instantMs, warmMined, split, fairHold } from '../../../embertide-app/ui/intro/dyson-society/app/space-router-law.mjs';

export { NAME_RX, FIRST_HOLD_USD, WARM_PER_USD, USD_PER_WARM, isTankKey, charge };
// The $WARM drunk dollars owe at one rate (the opening's by default), to the nano. A refill owes none. Pure. A tank's own sum is its rows' (state below).
export const warmOwed = (drunkUsd, perUsd = WARM_PER_USD) => +(Math.max(0, drunkUsd) * perUsd).toFixed(9);

export const tanksDir = (env = process.env) => env.SPACE_TANKS_DIR || path.join(env.HOME || os.homedir(), '.embertide', 'space-router');
export const keyHash = key => crypto.createHash('sha256').update(String(key)).digest('hex');
const dollars = n => (n < 0 ? '-$' : '$') + Math.abs(n).toFixed(6);

function writeAtomic(file, text, mode = 0o600) {
  const tmp = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, text, { mode });
  fs.renameSync(tmp, file);
}

export function openTanks(dir = tanksDir(), { openedAt = process.env.SPACE_ROUTER_OPENED_AT } = {}) {
  const opened = instantMs(openedAt);   // the opening's instant, from which the rate halves (none named: the opening's rate)
  const file = path.join(dir, 'tanks.json'), book = path.join(dir, 'ledger.jsonl');
  let seen = '', byHash = new Map(), byName = new Map();
  function load() {
    let st; try { st = fs.statSync(file); } catch { if (seen) { seen = ''; byHash = new Map(); byName = new Map(); } return byName; }
    const k = st.mtimeMs + ':' + st.size;
    if (k === seen) return byName;
    seen = k; byHash = new Map(); byName = new Map();
    let j = null; try { j = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {}
    for (const [name, t] of Object.entries(j?.tanks || {})) {
      if (!NAME_RX.test(name) || !/^[0-9a-f]{64}$/.test(String(t?.key_sha256 || ''))) continue;
      const tank = { name, private: t.private === true, markup_bps: Number.isFinite(t.markup_bps) && t.markup_bps > 0 ? Math.floor(t.markup_bps) : 0 };
      byName.set(name, tank); byHash.set(t.key_sha256, tank);
    }
    return byName;
  }

  // The ledger, folded from the byte it last stopped at; a line cut by a read is carried as bytes, so a word of his split across two reads is whole.
  let offset = 0, carry = Buffer.alloc(0);
  const sums = new Map();
  const sumOf = name => { let s = sums.get(name); if (!s) sums.set(name, s = { poured: 0, drunk: 0, router: 0, calls: 0, warm: 0, spent: 0, recent: [], minted: false }); return s; };
  function apply(row) {
    if (!row || typeof row.tank !== 'string' || !Number.isFinite(row.usd)) return;
    const s = sumOf(row.tank);
    if (row.kind === 'refill') s.poured += row.usd;
    else if (row.kind === 'mint') s.minted ||= row.hexagon > 0 || row.tracenet > 0;
    else if (row.kind === 'burn') {
      const spent = Number.isFinite(row.warm_spent) ? row.warm_spent : 0; s.drunk += row.usd - spent * USD_PER_WARM; s.spent += spent; s.calls++; s.warm += Number.isFinite(row.warm) ? row.warm : warmMined(row.usd, Date.parse(row.at), opened);
      if (Number.isFinite(row.router_usd)) s.router += row.router_usd;
      if (!row.estimated && !row.free) { s.recent.push(row.usd); if (s.recent.length > FAIR_OF) s.recent.shift(); }   // the fair price is the router's road's
    }
  }
  function fold() {
    let size = 0; try { size = fs.statSync(book).size; } catch {}
    if (size < offset) { offset = 0; carry = Buffer.alloc(0); sums.clear(); }   // the book was cut or replaced: read it again from the start
    if (size === offset) return;
    const fd = fs.openSync(book, 'r');
    let buf;
    try { buf = Buffer.alloc(size - offset); fs.readSync(fd, buf, 0, buf.length, offset); } finally { fs.closeSync(fd); }
    offset = size;
    const all = carry.length ? Buffer.concat([carry, buf]) : buf;
    let start = 0;
    for (let nl = all.indexOf(10, start); nl !== -1; nl = all.indexOf(10, start)) {
      const line = all.subarray(start, nl).toString('utf8'); start = nl + 1;
      if (line.trim()) { try { apply(JSON.parse(line)); } catch {} }
    }
    carry = Buffer.from(all.subarray(start));
  }
  const append = row => { fs.mkdirSync(dir, { recursive: true, mode: 0o700 }); fs.appendFileSync(book, JSON.stringify(row) + '\n', { mode: 0o600 }); };

  const holds = new Map();
  let seq = 0;
  const heldOf = name => { let t = 0; for (const usd of (holds.get(name) || new Map()).values()) t += usd; return t; };
  const balance = name => { fold(); const s = sumOf(name); return s.poured - s.drunk; };

  return {
    dir, file, book,
    count: () => load().size,
    // the tank a key opens, or null (not a tank key, or one this door does not hold)
    forKey(key) { if (!isTankKey(key)) return null; load(); return byHash.get(keyHash(key)) || null; },
    balance,
    // free: a house door in front of a local brain, where a call costs nothing and needs nothing in the tank
    admit(tank, { free = false } = {}) {
      fold();
      const s = sumOf(tank.name), bal = s.poured - s.drunk, warmBal = s.warm - s.spent, held = heldOf(tank.name);
      if (!free && bal + warmBal * USD_PER_WARM - held <= 0) return { ok: false, why: bal + warmBal * USD_PER_WARM <= 0
        ? `tank ${tank.name} is dry (${dollars(bal)}, ${warmBal.toFixed(6)} $WARM); the treasury refills it (tools/embertide-mesh/space-tanks.mjs refill ${tank.name} <usd>); nothing was sent`
        : `tank ${tank.name} holds ${dollars(bal)} and its ${holds.get(tank.name).size} call(s) in flight hold all of it; nothing was sent` };
      const hold = { ok: true, tank, id: ++seq, usd: free ? 0 : fairHold(s.recent), free, minted: s.minted, done: false };
      let m = holds.get(tank.name); if (!m) holds.set(tank.name, m = new Map());
      m.set(hold.id, hold.usd);
      return hold;
    },
    // the drink: the router's cost (null when the router did not say it: the hold is charged and the row says estimated) plus the tank's markup
    settle(hold, { routerUsd = NaN, by = null, lane = null, model = null, via = null, tokens = null, ms = null } = {}) {
      if (!hold || hold.done) return null;
      hold.done = true; holds.get(hold.tank.name)?.delete(hold.id);
      const known = Number.isFinite(routerUsd), usd = known ? charge(routerUsd, hold.tank.markup_bps) : hold.usd, at = Date.now(), s = (fold(), sumOf(hold.tank.name)), { usd_fuel, warm_spent } = hold.free ? { usd_fuel: usd, warm_spent: 0 } : split(usd, s.poured - s.drunk, s.warm - s.spent);
      append({ at: new Date(at).toISOString(), kind: 'burn', tank: hold.tank.name, usd, router_usd: known ? routerUsd : null, markup_bps: hold.tank.markup_bps, warm: hold.minted ? warmMined(usd_fuel, at, opened) : 0,
        ...(warm_spent ? { warm_spent } : {}), ...(known ? {} : { estimated: true }), ...(hold.free ? { free: true } : {}), by, lane, model, via, tokens, ms });
      return { usd, balance: balance(hold.tank.name) };
    },
    // an answer that never burned (refused upstream, unreachable, cut off) frees its hold and costs the tank nothing
    release(hold) { if (!hold || hold.done) return; hold.done = true; holds.get(hold.tank.name)?.delete(hold.id); },
    refill(name, usd, why = '') {
      if (!load().has(name)) throw new Error(`no tank ${name} in ${file}`);
      if (!(Number.isFinite(usd) && usd > 0)) throw new Error(`a refill is a positive number of dollars, not ${usd}`);
      append({ at: new Date().toISOString(), kind: 'refill', tank: name, usd: +usd.toFixed(9), why: String(why).slice(0, 500) });
      return { usd, balance: balance(name) };
    },
    // the treasury's witness of a holder's mint, { hexagon: its number on the ball } or { tracenet: its receipt } as the site says it: the tank mines from its next call
    mint(name, by, why = '') {
      const [[what, n] = []] = Object.entries(by ?? {});
      if (!load().has(name)) throw new Error(`no tank ${name} in ${file}`);
      if (!['hexagon', 'tracenet'].includes(what) || !(Number.isInteger(n) && n > 0)) throw new Error('a mint is a hexagon\'s number or a paid tracenet\'s receipt, as the site says it');
      append({ at: new Date().toISOString(), kind: 'mint', tank: name, usd: 0, [what]: n, why: String(why).slice(0, 500) });
    },
    state() {
      fold();
      return [...load().values()].map(t => {
        const s = sumOf(t.name);
        return { name: t.name, private: t.private, minted: s.minted, markup_bps: t.markup_bps, balance_usd: s.poured - s.drunk, poured_usd: s.poured, drunk_usd: s.drunk,
          take_usd: s.drunk - s.router, calls: s.calls, in_flight: holds.get(t.name)?.size || 0, warm_mined: +s.warm.toFixed(9), warm_spent: +s.spent.toFixed(9), warm_owed: +(s.warm - s.spent).toFixed(9) };
      });
    },
  };
}

// A holder's key, made where the holder's harness runs: <dir>/keys/<name>.key (0600, never overwritten). Its hash is all a door needs, so a key never
// travels: the new Mac's Aiolos makes his here and the serving Mac's door holds only the hash (an ssh key's way).
export function makeKey(dir, name) {
  if (!NAME_RX.test(name)) throw new Error(`a tank's name is lowercase letters, digits and dashes, 32 at most: not ${JSON.stringify(name)}`);
  fs.mkdirSync(path.join(dir, 'keys'), { recursive: true, mode: 0o700 });
  const key = 'sr_' + crypto.randomBytes(32).toString('base64url'), keyFile = path.join(dir, 'keys', `${name}.key`);
  fs.writeFileSync(keyFile, key + '\n', { mode: 0o600, flag: 'wx' });
  return { keyFile, sha256: keyHash(key) };
}

// A new tank on this door: with a holder's key hash (keySha256), or with a key made here beside it. Only the hash goes into tanks.json, one tank a key.
export function addTank(dir, name, { private: priv = false, markupBps = 0, keySha256 = null } = {}) {
  if (!NAME_RX.test(name)) throw new Error(`a tank's name is lowercase letters, digits and dashes, 32 at most: not ${JSON.stringify(name)}`);
  if (!(Number.isInteger(markupBps) && markupBps >= 0 && markupBps <= 10000)) throw new Error(`the markup is whole basis points from 0 to 10000, not ${markupBps}`);
  if (keySha256 !== null && !/^[0-9a-f]{64}$/.test(String(keySha256))) throw new Error('a key\'s hash is 64 lowercase hex digits (space-tanks.mjs key <name> prints it)');
  const file = path.join(dir, 'tanks.json');
  let j = { schema: 'space-router.tanks/v1', tanks: {} };
  if (fs.existsSync(file)) j = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (j.tanks?.[name]) throw new Error(`tank ${name} is already in ${file}`);
  if (keySha256 && Object.values(j.tanks || {}).some(t => t.key_sha256 === keySha256)) throw new Error('that key already opens another tank');
  const made = keySha256 ? null : makeKey(dir, name);
  j.tanks = { ...(j.tanks || {}), [name]: { key_sha256: keySha256 || made.sha256, private: !!priv, markup_bps: markupBps, made_at: new Date().toISOString() } };
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
  writeAtomic(file, JSON.stringify(j, null, 1) + '\n');
  return { name, keyFile: made ? made.keyFile : null };
}

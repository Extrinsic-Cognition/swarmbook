// tracenet-create.mjs · A TRACENET IS BOUGHT FROM THE TANK, the house's half (Nov 2 2026, his "Charge the tank" over Harmony's Tracenet tab; the lineage:
// ec-workspace docs/paying-for-a-tracenet-hypertrace-2026-11-02.md; the site's half: dyson-society/worker/space-router.mjs TRACENET_PATH). The tab never
// reaches the site and never holds a key: it asks this door, behind harmony-aiolos's localOnly like every /api/ path.
//   GET  /api/tracenet  the site's price and the holder's tank: { open, price_sol, price_usd, keyed, fuel_usd, deposit } (his 0.1 SOL, its dollars now)
//   POST /api/tracenet  { name, colour, vow? }: the site takes the price from the tank, then this door writes the Nest's tracenet/house with the receipt (and the vow), so a house
//                       stands on the Nest only once it was paid. The id is drawn once a press and sent again on a retry: the tank pays once.
// The key is the holder's Space Router key (SPACE_ROUTER_TANK_KEY, Settings' keys in ~/.embertide/keys.env), never on the Nest, the page or a log.
// THE VOW MAKES THE PAGE (Nov 4 2026, his "dont you think that is fragmented and chaotics?", "please let's anneal a better design my dude...", "u building then?";
// the design on the Canvas, the Claude page's "The tracenet, annealed"): a tracenet is one chain of signed lines, the Nest its home (tracenet/chain/<handle>, the
// register's shape), the site's D1 a cache that verifies every line (worker/creators.mjs, app/tracenet-drop-line.mjs). The house's key (KEY_FILE: Ed25519, made at
// the first claim on this Mac, 0600; its public half is a Solana address, no wallet app; never on the Nest, a page or a log) claims optimism.fit/<the name> at the
// Vow when the name is an address, and signs each drop's line: a cleaned trace (tracenet-sanitize.mjs --drop) goes to the site's door first, which holds the
// line's time to ten minutes, then onto the Nest's chain. The first tracenet is not this road: its key and its payee are his.
// One outbound call a read or a press, to the site alone; the Nest on loopback. The words in the answers are mine, his to reword.
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { encode58, seatSignIn, sealSeatProof } from '../../../embertide-app/ui/intro/dyson-society/app/dl-direct-protocol.mjs';
import { NO_PREV, dropId, dropLineText, lineHash } from '../../../embertide-app/ui/intro/dyson-society/app/tracenet-drop-line.mjs';
import { HANDLE, SCHEMA as REGISTER } from '../../../embertide-app/ui/intro/dyson-society/app/tracenet-register.mjs';

export const ROUTE = '/api/tracenet', HOUSE_REF = 'tracenet/house', HOUSE_SCHEMA = 'embertide.tracenet-house/1', SEAT = 'harmony-tracenet', KEY_NAME = 'SPACE_ROUTER_TANK_KEY';
export const SITE_PATH = '/space-router/v1/tracenet', TANK_PATH = '/space-router/v1/tank', DEPOSIT_PAGE = '/app/warm.html', CREATORS = '/api/premint/creators', DROPS_PATH = '/space-router/v1/drops?after=0', BOARD_PATH = '/space-router/v1/portrait?board', FACES_PATH = '/space-router/v1/portrait', SWARMBOOK = 'AJdsmjxQjHnBxDEdRxwEk2UMRW7bgNmvEMUwMziRTyab';   // Swarmbook's program, poleis-client.js PROGRAM_ID (the live generation, layout 8: the one with doors)
// A FLASK LETS ITS HARMONY SPEND (Nov 19 2026, the site's half: dyson-society/app/space-router-grant.mjs): a Harmony with no key the site knows makes its own (keyMake, kept
// in the keys file like every key) and its deposit link asks the person's flask to let that key spend, by its sha256 alone; the key never leaves this Mac. GRANT_CAP and
// GRANT_DAYS are mine, his to change: $5 a day for 90 days.
export const GRANT_CAP = 5, GRANT_DAYS = 90;
export const grantLink = (base, key) => { const hash = crypto.createHash('sha256').update(key).digest('hex'); return `${base}${DEPOSIT_PAGE}?door=deposit&grant=${hash}&name=${encodeURIComponent(`Harmony ${hash.slice(0, 4)}`)}&cap=${GRANT_CAP}&days=${GRANT_DAYS}`; };
export const KEY_FILE = path.join(os.homedir(), '.embertide', 'tracenet', 'key', 'house.pem'), CHAIN = (handle) => `tracenet/chain/${handle}`;
export const VOW_ID = /^[a-z][a-z0-9-]{0,40}-\d{1,15}$/;   // HIS FINGER VOWS THE HOUSE (Nov 4 2026): the Nest entry his Mac's passkey signed (harmony-mac/native/TracenetVowCore.swift), kept as the house's link
/** nameOf(s): a house's name as it is kept: one space between words, no control character, at most 28 letters; '' for none */
export const nameOf = (s) => String(s || '').replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 28).trim();
/** houseKey(file): the house's Ed25519 key, made once (0600 in a 0700 folder) and read ever after; of two makers at once, both read the one that was written. */
export function houseKey(file = KEY_FILE) {
  try { return crypto.createPrivateKey(fs.readFileSync(file)); } catch (e) { if (e.code !== 'ENOENT') throw e; }
  fs.mkdirSync(path.dirname(file), { recursive: true, mode: 0o700 });
  try { fs.writeFileSync(file, crypto.generateKeyPairSync('ed25519').privateKey.export({ type: 'pkcs8', format: 'pem' }), { mode: 0o600, flag: 'wx' }); } catch (e) { if (e.code !== 'EEXIST') throw e; }
  return crypto.createPrivateKey(fs.readFileSync(file));
}
/** addressOf(key): the key's public half as a Solana address (base58 of its 32 raw bytes): the creator's wallet on the site */
export const addressOf = (key) => encode58(crypto.createPublicKey(key).export({ format: 'der', type: 'spki' }).subarray(-32));
/** doorsOf(pools, registries): YOUR SWARMS SHOWS WHO HAS ROOM (Nov 24 2026): Swarmbook's swarms whose door holds open seats, each root's units summed as the wall's card sums them (wall.js caption), from the
 *  chain's bytes in poleis-client.js's layouts: a Pool (35 bytes: unit@3, open@11, filled@19), a Registry (unit@2, root@266, its name@275, the name's length@274, 64 at most). -> [{civ, name, open}], the most room first; null when a read failed. Pure. */
export function doorsOf(pools, regs) { if (!Array.isArray(pools) || !Array.isArray(regs)) return null; const u = (d, o) => d.readBigUInt64LE(o), reg = new Map(regs.filter((d) => d.length >= 339).map((d) => [u(d, 2), { root: u(d, 266), name: d.subarray(275, 275 + Math.min(d[274], 64)).toString('utf8') }])), open = new Map();
  for (const d of pools) { const r = d.length === 35 ? reg.get(u(d, 3)) : null, n = r ? u(d, 11) - u(d, 19) : 0n; if (n > 0n) open.set(r.root, (open.get(r.root) || 0n) + n); }
  return [...open].map(([root, n]) => ({ civ: String(root), name: reg.get(root)?.name || `polis ${root}`, open: Number(n) })).sort((a, b) => b.open - a.open || a.name.localeCompare(b.name)); }
const signs = (key, text) => crypto.sign(null, Buffer.from(text, 'utf8'), key);

/** createTracenetDoor({site, door, keyOf, keyMake, onTank, fetch, newId, keyFile, clock}) -> { terms(), create(body), claim(handle, name), drop(o), tank() }, each a Promise of [status, body] but claim's {page} and tank's dollars */
export function createTracenetDoor({ site, door, rpc = process.env.EMBERTIDE_SWARMBOOK_RPC || 'https://api.devnet.solana.com', keyOf = () => process.env[KEY_NAME], keyMake = null, onTank = () => {}, fetch: f = globalThis.fetch, newId = () => crypto.randomBytes(16).toString('hex'), keyFile = KEY_FILE, clock = Date.now }) {
  const base = String(site).replace(/\/+$/, '');
  const ask = (path, init = {}) => f(base + path, { ...init, signal: AbortSignal.timeout(10_000) }).then(async (r) => ({ status: r.status, j: await r.json().catch(() => null) }), () => ({ status: 0, j: null }));
  const auth = (key) => ({ authorization: `Bearer ${key}` });
  const chain = (filters, dataSlice) => f(rpc, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'getProgramAccounts', params: [SWARMBOOK, { encoding: 'base64', filters, dataSlice }] }), signal: AbortSignal.timeout(10_000) }).then((r) => r.json()).then((j) => j.result.map((a) => Buffer.from(a.account.data[0], 'base64'))).catch(() => null);   // the chain's accounts of one kind (disc and layout 8 in their first two bytes), read on the tab's ask as the rest of terms() is
  const seatOf = (key, now) => { const u = new URL(base), m = seatSignIn({ host: u.host, origin: u.origin, address: addressOf(key), now }); return sealSeatProof(m, signs(key, m)); };
  // THE FLASK HOLDS THE TANK'S DOLLARS (Nov 19 2026): every reading of the tank this key is given goes to onTank ({fuel_usd, gold, at_ms}; gold: what its calls mined, THE GOLD IS A RING), house/purse's cause in harmony-aiolos. THE GOLD IS FOR WHO MINTED (his Nov 22 2026 14:08 UTC): gold is null where the site does not say this tank minted (a hexagon of its own, or a tracenet it bought: the word its calls mine by); a press says none
  const fuelOf = (usd, mined, minted) => { if (!Number.isFinite(usd)) return null; try { onTank({ fuel_usd: usd, ...(minted === undefined ? {} : { gold: minted && Number.isFinite(mined) ? mined : null }), at_ms: clock() }); } catch { /* the purse's fault is its own */ } return usd; };
  /** tank(): the tank's dollars as the site says them to this Mac's key now; null with no key (none is made here) or a key the site does not know */
  const tank = async () => { const key = keyOf(), t = key ? await ask(TANK_PATH, { headers: auth(key) }) : null; return t?.status === 200 ? fuelOf(t.j?.fuel_usd, t.j?.warm_mined, t.j?.minted === true) : null; };
  async function terms() {
    let key = keyOf(); if (!key && keyMake) try { key = keyMake(); } catch { key = ''; }
    const [p, t, dr, bd, fc, pl, rg] = await Promise.all([ask(SITE_PATH), key ? ask(TANK_PATH, { headers: auth(key) }) : null, ask(DROPS_PATH), ask(BOARD_PATH), ask(FACES_PATH), chain([{ dataSize: 35 }, { memcmp: { offset: 0, bytes: encode58([21, 8]) } }]), chain([{ memcmp: { offset: 0, bytes: encode58([5, 8]) } }], { offset: 0, length: 339 })]);   // THE SOCIETY OPENS (Nov 19 2026): the chain's drops and the board, for the society the tab opens; EVERY MINT IS A HEXAGON (Nov 20 2026): everyone's faces, the front's own door
    const price = p.status === 200 && Number.isFinite(p.j?.usd) ? p.j.usd : null, fuel = t?.status === 200 ? fuelOf(t.j?.fuel_usd, t.j?.warm_mined, t.j?.minted === true) : null, unknown = t?.status === 401;
    return [200, { open: price !== null, price_sol: price === null || !Number.isFinite(p.j?.sol) ? null : p.j.sol, price_usd: price, keyed: !!key && !unknown, fuel_usd: fuel,
      deposit: key && unknown ? grantLink(base, key) : base + DEPOSIT_PAGE, society: dr.status === 200 && bd.status === 200 && Array.isArray(dr.j?.drops) && Array.isArray(bd.j?.board) ? { drops: dr.j.drops, board: bd.j.board, faces: fc.status === 200 && Array.isArray(fc.j?.hexagons) ? fc.j.hexagons : [] } : null, doors: doorsOf(pl, rg) }];   // a key the site does not know asks a flask for it; a known one refills its flask
  }
  /** claim(handle, name): the page for the house's key: {handle, signer, url}, or {error} said once; a claim the site already holds for this key stands. Never throws. */
  async function claim(handle, name) {
    if (!HANDLE.test(handle)) return { error: 'A page\'s address is letters, digits or _: this name makes none.' };
    let key; try { key = houseKey(keyFile); } catch (e) { return { handle, error: `The house's key could not be made (${e.code || e.message}).` }; }
    const signer = addressOf(key), r = await ask(CREATORS, { method: 'POST', headers: { origin: base, 'content-type': 'application/json', 'x-seat': seatOf(key, clock()) }, body: JSON.stringify({ handle, name }) });
    if (r.status !== 201 && (await ask(`${CREATORS}/${handle}`)).j?.wallet !== signer) return { handle, error: r.j?.error || `The site answered ${r.status || 'nothing'}; no page.` };
    if (!(await door.read(CHAIN(handle)).catch(() => null))) await door.write(CHAIN(handle), { schema: REGISTER, handle, name, wallet: signer, items: [] }, { expect: 0, seat: SEAT }).catch(() => {});
    return { handle, signer, url: `${base}/${handle}` };
  }
  let owed = null;   // a receipt paid whose house the Nest did not keep: the next press writes it and pays nothing
  async function create(body) {
    const name = nameOf(body?.name), colour = String(body?.colour || '').toLowerCase(), key = keyOf();
    if (!name || !/^#[0-9a-f]{6}$/.test(colour)) return [400, { error: 'Name it and pick its colour.' }];
    if (!key) return [428, { need: 'key', error: 'Add your Space Router key in Settings.' }];
    let paid = owed, fuel = null;
    if (!paid) {
      const id = newId(), post = () => ask(SITE_PATH, { method: 'POST', headers: { ...auth(key), 'content-type': 'application/json' }, body: JSON.stringify({ id }) });
      let r = await post(); if (r.status === 0) r = await post();   // the site did not answer: once more with the same id, so the tank pays once
      const said = r.j?.error?.message;
      if (r.status === 401) return [401, { need: 'key', error: 'The site does not know this key.' }];
      if (r.status === 402) return [402, { need: 'fuel', error: said || 'Your tank is short.', deposit: base + DEPOSIT_PAGE }];
      if (r.status === 503 || r.status === 404) return [503, { need: 'price', error: said || 'Not open yet.' }];
      if (r.status !== 200 && r.status !== 201) return [502, { error: `The site answered ${r.status || 'nothing'}; nothing was taken.` }];
      paid = { sol: r.j.sol ?? null, usd: r.j.usd, warm: r.j.warm, receipt: r.j.receipt, id, at: r.j.at }; fuel = fuelOf(r.j.fuel_usd) ?? r.j.fuel_usd;
    }
    const page = await claim(name, name);   // THE VOW MAKES THE PAGE: a page that could not be claimed is said on the house, and the paid house stands all the same
    const value = { schema: HOUSE_SCHEMA, name, colour, at: new Date().toISOString(), by: SEAT, paid, ...(typeof body?.vow === 'string' && VOW_ID.test(body.vow) ? { vow: body.vow } : {}), page };
    let last = null;
    for (let k = 0; k < 2; k++) {   // a compare-and-swap; refused once, the rev the Nest names now is taken and written once more
      try { const cur = await door.read(HOUSE_REF); const w = await door.write(HOUSE_REF, value, { expect: cur?.rev ?? 0, seat: SEAT }); owed = null; void tank(); return [200, { ref: w.ref, fuel_usd: fuel, page }]; }
      catch (e) { last = e; if (e.status !== 409) break; }
    }
    owed = paid;
    return [502, { error: `Paid, but the Nest did not keep the house (${last?.message || 'no answer'}). Press again: it is written without paying again.`, paid }];
  }
  /** drop({bytes, file, title, kind, sanitized}): a cleaned trace as the chain's next line, signed by the house's key: the site's door first, then the Nest's chain. */
  async function drop({ bytes, file, title, kind = 'trace', sanitized = null }) {
    title = String(title ?? '').trim().slice(0, 120);   // the site's own cut of a title, so the line signed here is the line it checks
    if (!title || /[^\x20-\x7e]/.test(title)) return [400, { error: 'Name the drop in plain letters: its title travels in a header.' }];
    const page = (await door.read(HOUSE_REF).catch(() => null))?.value?.page, handle = page?.handle;
    if (!page?.url) return [409, { error: 'This house has no page yet.' }];
    const key = houseKey(keyFile), wallet = addressOf(key), cur = await door.read(CHAIN(handle)).catch(() => null), chain = cur?.value;
    if (chain?.wallet !== wallet || !Array.isArray(chain.items)) return [409, { error: 'The chain on the Nest is not this house\'s key\'s.' }];
    const now = clock(), published = new Date(now).toISOString(), last = chain.items[0];
    const line = { id: dropId(published, title), title, kind, file, bytes: bytes.length, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), published, prev: last ? await lineHash(dropLineText({ ...last, handle, wallet })) : NO_PREV };
    line.sig = encode58(signs(key, dropLineText({ ...line, handle, wallet })));
    const sr = keyOf(), r = await ask(`${CREATORS}/${handle}/drops`, { method: 'POST', headers: { ...(sr ? auth(sr) : {}), 'x-seat': seatOf(key, now), 'x-title': title, 'x-kind': kind, 'x-file': file, 'x-published': published, 'x-prev': line.prev, 'x-sig': line.sig, 'content-type': 'application/octet-stream' }, body: bytes });
    if (r.status !== 201) return [r.status || 502, { error: r.j?.error || 'The site did not take the drop.' }];
    const items = [{ ...line, ...(sanitized ? { sanitized } : {}) }, ...chain.items];
    try { await door.write(CHAIN(handle), { ...chain, items }, { expect: cur.rev, seat: SEAT }); } catch (e) { return [502, { error: `The site took the drop; the Nest did not keep its line (${e.message}).`, line: items[0] }]; }
    return [201, { id: line.id, url: r.j.url, line: r.j.line }];
  }
  return { terms, create, claim, drop, tank };
}

// node tracenet-create.mjs claim [handle]: the page for a house that stands without one (a Vow before this lane), by the house's name or the address given. His press.
if (process.argv[2] === 'claim' && fs.realpathSync(process.argv[1] || '.') === fs.realpathSync(fileURLToPath(import.meta.url))) {
  const { createRefDoor } = await import('./music-timeline.mjs'), door = createRefDoor({ origin: process.env.NEST || 'http://127.0.0.1:8904' }), cur = await door.read(HOUSE_REF);
  if (!cur?.value?.paid) { console.error('No paid house on this Nest: the Vow comes first.'); process.exit(1); }
  const page = await createTracenetDoor({ site: process.env.EMBERTIDE_SOCIETY_SITE || 'https://optimism.fit', door }).claim(process.argv[3] || cur.value.name, cur.value.name);
  if (page.url) await door.write(HOUSE_REF, { ...cur.value, page }, { expect: cur.rev, seat: SEAT });
  console.log(page.url ? `the page stands: ${page.url} (signed by ${page.signer})` : `no page: ${page.error}`); process.exit(page.url ? 0 : 1);
}

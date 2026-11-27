// worker/creators.mjs: TRACENET IS FOR EVERY CREATOR (his Oct 23 2026 WEST: "how do we build a patreon-like thing where people can do the same?...
// tracenet has many profiles, mine is just the first... it has to be for more creators to come and do the same as well"). Three things:
// 1. creatorOf(env, origin, handle): a creator's register with its payee, from D1 (creators + drops) or, for a handle with no row, from the asset
//    register in git (the first tracenet's, app/tracenet/<handle>.json); the first tracenet's payee is the protocol's RECIPIENT when its file names none.
// 2. The doors, under /api/premint/creators/:
//    - GET  <handle>            the register, public as the asset is (who, the payee's wallet, the drops' lines; never a key)
//    - POST (create)            {handle, name, line, x, avatar}: a wallet claims a handle. The wallet is the request's seat proof (x-seat, the same
//                               Sign In With Solana the checkout uses): the creator is whoever holds the wallet. First come; a handle is one wallet's.
//    - POST <handle>/drops      the bytes (the body, ≤ MAX_DROP bytes) with x-title, x-kind, x-file: hashed, put in R2 (env.VAULT) under
//                               vault/<handle>/<id>/<file>, its line into drops; the creator's seat proof required. The first tracenet's own drops
//                               keep the Nest's sanitization gate (the publisher tool); a stranger's drop has the size and the name's law, no more.
//                               THE DROP IS SIGNED BY ITS CREATOR (Oct 25 2026, app/tracenet-drop-line.mjs): the drop's line comes signed by the
//                               tracenet's wallet (x-sig) over its own words, its time (x-published, within DROP_SKEW_MS of the door's clock and after
//                               the creator's last signed line) and the hash of that last line (x-prev, NO_PREV for the first); the door refuses any
//                               other, so the register is the creator's own chain and D1 its cache, checkable without trusting this database.
//    - POST <handle>/stamps     THE STAMP IS THE COSIGN (Oct 29 2026, app/tracenet-stamp.mjs): {stamper, by, on, door, at, sig[, cosig]}, a stamp on
//                               one of this tracenet's drops (a drop a reader may draw). The stamper's half (sig) waits for the creator's countersign
//                               (cosig over the same words), which completes it; a stamp may also come whole. No seat proof: the signatures are the
//                               proof, and the door checks both. A follow comes after its drop and never from the future; one stamp a stamper a drop
//                               (stamps_once); at most MAX_WAITING halves wait on a drop. GET <handle> carries the stamps, each reader proves them itself.
// 3. The front door: GET /<handle> for a creator row is the tracenet page (the build writes that redirect only for asset registers).
// Everything is computed at the request; no timer, no cron. A creator's secrets never exist here: a wallet is public, a Stripe account id is public.
import { RECIPIENT, PAYEE, verifySeatProof } from '../app/dl-direct-protocol.mjs';
import { SCHEMA, HANDLE, ITEM_ID, FILE, KIND, WALLET, FIRST_TRACENET, SIG, PREV, NO_PREV, readManifest, registerUrl, validReceipt } from '../app/tracenet-register.mjs';
import { DROP_SKEW_MS, dropId, lastSigned, lineOf, lineHash, verifyDropLine } from '../app/tracenet-drop-line.mjs';
import { stampOf, proveStamp } from '../app/tracenet-stamp.mjs';
import { tankDoors, priceOf, tankTerms } from './tracenet-tank.mjs'; import { personOf, eggOf } from './space-router-egg.mjs'; import { isTankKey } from '../app/space-router-law.mjs'; import { keyHashOf } from '../app/space-router-deposit.mjs';
// THE CLAW RIDER IS REGISTERED (Nov 24 2026, his ~19:1x UTC "Yes, build it"; Nov 20 12:13 "a claw rider is someone with a tracenet egressing traces"; Nov 22 14:03 "claw riders = no mint anything"): a drop taken under a Space Router key
// (its Harmony's own: a tank's, or one a flask let spend) registers that tank's rider at its first, and each after moves only a count and a time (sr_riders, 0036). Nothing minted, nothing paid; a drop with no key is taken as before.
const RIDE = { tank: 'SELECT COALESCE((SELECT name FROM sr_tanks WHERE key_sha256 = ?1), (SELECT tank FROM sr_grants WHERE key_sha256 = ?1 AND ended_at IS NULL AND until > ?2)) AS tank', ride: 'INSERT INTO sr_riders(tank, handle, traces, first_at, last_at) VALUES (?1, ?2, 1, ?3, ?3) ON CONFLICT(tank) DO UPDATE SET traces = sr_riders.traces + 1, handle = excluded.handle, last_at = excluded.last_at' },
  rides = async (request, env, handle, at, now) => { const key = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim(), tank = isTankKey(key) ? (await env.DB.prepare(RIDE.tank).bind(await keyHashOf(key), now).first().catch(() => null))?.tank : null; if (tank) await env.DB.prepare(RIDE.ride).bind(tank, handle, at).run().catch(() => {}); };   // a registration that fails costs the drop nothing

export { dropId };   // <yyyy-mm-dd>-<slug>: the signer computes it too, so it lives with the line (app/tracenet-drop-line.mjs)

export const PATH = '/api/premint/creators';
export const MAX_DROP = 25 * 1024 * 1024;   // one drop's bytes, at most (a trace, a patch, a recording of a session; never a film)
export const MAX_WAITING = 64;              // a drop's stamps waiting for its creator's countersign, at most (a cosigned stamp waits on nobody)
const HTTPS = /^https:\/\/[^\s"'<>]{1,500}$/;
const enc = new TextEncoder();
const hex = (b) => Array.from(new Uint8Array(b), (x) => x.toString(16).padStart(2, '0')).join('');

/** rowToRegister(row, drops): the creator's row and drops as the page's register (readManifest's shape, with the payee). */
export function rowToRegister(row, drops = []) {
  return readManifest({ schema: SCHEMA, handle: row.handle, name: row.name, line: row.line, x: row.x, avatar: row.avatar, wallet: row.wallet, stripe: row.stripe_account, price: row.stripe_price,
    bronzeUsd: row.bronze_cents ? Math.round(row.bronze_cents) / 100 : null,
    subscribeLamports: row.subscribe_lamports ?? null,   // THE AGENTS SUBSCRIBE (0011): the creator's price for SUBSCRIPTION_DAYS, or none
    items: drops.map(itemOf) }, row.handle, { receipt: false });   // a creator's drops: no Nest receipt, the Nest is not theirs; their own signature instead
}
/** A drops row as a register's item: its line's words, and the creator's signature and chain link when the row has them (rows before Oct 25 have none). */
const itemOf = (d) => ({ id: d.id, title: d.title, kind: d.kind, file: d.file, bytes: d.bytes, sha256: d.sha256, published: d.published,
  ...(d.sanitized ? { sanitized: JSON.parse(d.sanitized) } : {}), ...(d.sig ? { sig: d.sig } : {}), ...(d.prev ? { prev: d.prev } : {}) });
/** creatorOf(env, origin, handle): {register, source: 'd1' | 'asset'} or null. The first tracenet's asset register gets RECIPIENT as its payee when it names none. */
export async function creatorOf(env, origin, handle) {
  if (!HANDLE.test(handle ?? '')) return null;
  if (env.DB) {
    let row = null; try { row = await env.DB.prepare('SELECT * FROM creators WHERE handle=?').bind(handle).first(); } catch { row = null; }
    if (row) {
      const { results } = await env.DB.prepare('SELECT * FROM drops WHERE handle=? ORDER BY published DESC').bind(handle).all();
      return { register: rowToRegister(row, results), source: 'd1', row };
    }
  }
  let register = null;
  try { const response = await env.ASSETS.fetch(new Request(`${origin}${registerUrl(handle)}`)); if (response.ok) register = readManifest(await response.json(), handle); } catch { register = null; }
  if (!register && handle === FIRST_TRACENET) register = readManifest({ schema: SCHEMA, handle, items: [] }, handle);   // the first tracenet exists wherever the Worker runs, its file served or not
  if (!register) return null;
  if (!register.wallet && handle === FIRST_TRACENET) register.wallet = RECIPIENT;
  if (handle === FIRST_TRACENET && !register.payee && PAYEE !== register.wallet) register.payee = PAYEE;   // THE PAYEE IS NOT THE KEY: once PAYEE is his vault
  return { register, source: 'asset', row: null };
}
/** payeeOf(creator): the wallet every SOL seat for this tracenet pays and every Gold bid is sealed to, or null when the register names none. */
export const payeeOf = (creator) => creator?.register?.payee ?? creator?.register?.wallet ?? null;
/** keyOf(creator): the creator's key: what Gold bids are sealed to and what signs the month's total and the drops; never a payee vault (Oct 28 2026). */
export const keyOf = (creator) => creator?.register?.wallet ?? null;
/** A stamps row as the stamp every reader proves itself (app/tracenet-stamp.mjs proveStamp): the five fields and the signatures it has. */
const stampItem = (r) => ({ stamper: r.stamper, by: r.by_wallet, on: r.drop_sha256, door: r.door, at: r.at, sig: r.sig, ...(r.cosig ? { cosig: r.cosig } : {}) });
/** The stamps this index keeps on a tracenet's drops, newest first; none where the table is not (a database before 0010). */
async function stampsOf(env, handle) {
  if (!env.DB) return [];
  try { const { results } = await env.DB.prepare('SELECT * FROM stamps WHERE handle=? ORDER BY at DESC').bind(handle).all(); return results.map(stampItem); } catch { return []; }
}
/** The wallet the request proves it holds (x-seat), or null. */
export async function walletOf(request, nowMs) { const url = new URL(request.url); return (await verifySeatProof(request.headers.get('x-seat'), { host: url.host, origin: url.origin, now: nowMs }))?.buyer ?? null; }   // the proof's check is async (an Ed25519 verify)

/** creatorDoors({request, env, url, path, clock, clockMs, json, fail}): a Response for a creators door, or null when the path is not one. */
export async function creatorDoors({ request, env, url, path, clock, clockMs, json, fail }) {
  if (path !== PATH && !path.startsWith(`${PATH}/`)) return null;
  const rest = path.slice(PATH.length + 1), parts = rest ? rest.split('/') : [];
  if (request.method === 'GET' && parts.length === 1) {
    const creator = await creatorOf(env, url.origin, parts[0]);
    if (!creator) fail('No such tracenet.', 404);
    const { register, source } = creator;
    return json({ ...register, source, bronze: { card: Boolean(register.stripe && register.price) || parts[0] === FIRST_TRACENET, usd: register.bronzeUsd }, stamps: await stampsOf(env, parts[0]),
      tank: tankTerms(await priceOf(env, parts[0]), parts[0]) });
  }
  if (request.method === 'POST' && parts.length === 2 && (parts[1] === 'price' || parts[1] === 'subscribe')) {
    // THE FAN PAYS FROM THE TANK (worker/tracenet-tank.mjs): the creator names the price with the tracenet's key; a fan's tank pays it inside the ledger
    return tankDoors({ request, env, url, creator: await creatorOf(env, url.origin, parts[0]), handle: parts[0], verb: parts[1], clockMs, json, fail, walletOf, keyOf });
  }
  if (request.method === 'POST' && parts.length === 2 && parts[1] === 'stamps') {
    // THE STAMP IS THE COSIGN: the stamper's signature is the stamp, the creator's over the same words its cosign; this table is one index's cache of them
    const handle = parts[0], creator = await creatorOf(env, url.origin, handle);
    if (!creator) fail('No such tracenet.', 404);
    if (!env.DB) fail('The stamps are not set up yet.', 503);
    const input = await request.json().catch(() => ({})), stamp = stampOf(input);
    if (!stamp) fail('A stamp names its stamper and the drop\'s creator (two wallets), the drop (its sha256), the door it opened and the instant it was followed.');
    if (stamp.by !== keyOf(creator)) fail('The stamp\'s creator is not this tracenet\'s wallet.', 409);
    let drop = null;   // the drop a reader may draw (proveItems' own proof, for the items of this sha256 only: one verify, not one a drop)
    for (const i of creator.register.items) if (i.sha256 === stamp.on && (typeof i.sig === 'string' ? await verifyDropLine(creator.register, i) : validReceipt(i))) { drop = i; break; }
    if (!drop) fail('No such drop on this tracenet.', 404);
    const at = Date.parse(stamp.at);
    if (at < Date.parse(drop.published)) fail('A drop is followed after it is published: sign the stamp again.');
    if (at > clockMs() + DROP_SKEW_MS) fail('The stamp\'s instant is ahead of now: sign it again.');
    if (input.cosig !== undefined && input.cosig !== null && typeof input.cosig !== 'string') fail('A countersign is the creator\'s signature (cosig).', 401);
    const proof = await proveStamp({ ...stamp, sig: input.sig, cosig: input.cosig ?? undefined });
    if (!proof) fail('The stamp is not signed by its stamper (sig).', 401);
    if (input.cosig && !proof.cosigned) fail('The countersign is not this tracenet\'s wallet\'s signature over the stamp.', 401);
    const kept = await env.DB.prepare('SELECT cosig FROM stamps WHERE id=?').bind(proof.id).first();
    if (kept) {   // the same stamp again: its countersign, if it brings one, completes the half that waits
      if (proof.cosigned && !kept.cosig) await env.DB.prepare('UPDATE stamps SET cosig=? WHERE id=? AND cosig IS NULL').bind(input.cosig, proof.id).run();
      return json({ ok: true, id: proof.id, cosigned: Boolean(kept.cosig) || proof.cosigned });
    }
    if (!proof.cosigned) {
      const waiting = await env.DB.prepare('SELECT COUNT(*) AS n FROM stamps WHERE drop_sha256=? AND by_wallet=? AND cosig IS NULL').bind(stamp.on, stamp.by).first();
      if ((waiting?.n ?? 0) >= MAX_WAITING) fail(`${MAX_WAITING} stamps on this drop wait for its creator's countersign: stamp it again later.`, 429);
    }
    try {
      await env.DB.prepare('INSERT INTO stamps(id,handle,drop_sha256,by_wallet,stamper,door,at,sig,cosig,created_at) VALUES(?,?,?,?,?,?,?,?,?,?)')
        .bind(proof.id, handle, stamp.on, stamp.by, stamp.stamper, stamp.door, stamp.at, input.sig, proof.cosigned ? input.cosig : null, clock()).run();
    } catch (e) {
      if (/UNIQUE/i.test(String(e?.message ?? e))) fail('This stamper has stamped this drop already.', 409);
      throw e;
    }
    return json({ ok: true, id: proof.id, cosigned: proof.cosigned }, 201);
  }
  if (request.method === 'POST' && parts.length === 0) {
    if (request.headers.get('origin') !== url.origin) fail('Use this website.', 403);
    const wallet = await walletOf(request, clockMs()); if (!wallet) fail('Sign in with the wallet that will be paid.', 401); if (env.SPACE_ROUTER_TREASURY && !(await env.DB.prepare('SELECT 1 FROM sr_deposits WHERE payer=? AND usd>=10').bind(wallet).first().catch(() => null) ?? (await eggOf(env, (await personOf(env, wallet)).tank))?.her)) fail('A profile is made by a flask of 10 USDC or more.', 402); const held = env.SPACE_ROUTER_TREASURY ? String((await env.DB.prepare('SELECT handle FROM sr_x WHERE address=?').bind(wallet).first().catch(() => null))?.handle ?? '').toLowerCase() : null;   /* A PROFILE OF THEIR OWN (his Nov 2 2026 "the user has to pay money for the tracenet creation"; Nov 11 "after people deposit 10$ usdc ... they have their own profile"): where deposits are open, a handle is claimed only by a key the house has counted 10 USDC or more from, or another browser of the same X account (ONE NAME FOR HER) */
    const input = await request.json().catch(() => ({}));
    const handle = String(input.handle ?? '').replace(/^@/, '');
    if (!HANDLE.test(handle)) fail('An X handle without the @: letters, digits, underscore, up to 32.'); if (held !== null && held !== handle.toLowerCase()) fail('A page is named by the X account that holds this flask: sign in with X on this page first.', 403);   /* A NAME IS ITS OWNER'S (Nov 20 2026, his "Yes, cut it" over that day's audit): where deposits are open, a handle is claimed only by the flask X itself said that account holds (sr_x, X HOLDS THE FLASK, Nov 19); until then any flask of 10 USDC took any free handle, its page and its payments */
    const name = String(input.name ?? '').trim().slice(0, 80); if (!name) fail('Name the creator.');
    const line = String(input.line ?? '').trim().slice(0, 200), x = HTTPS.test(input.x ?? '') ? input.x : `https://x.com/${handle}`, avatar = HTTPS.test(input.avatar ?? '') ? input.avatar : null;
    if (await creatorOf(env, url.origin, handle)) fail('That handle has a tracenet already.', 409);
    if (await env.DB.prepare('SELECT handle FROM creators WHERE wallet=?').bind(wallet).first()) fail('That wallet has a tracenet already.', 409);
    await env.DB.prepare('INSERT INTO creators(handle,name,line,x,avatar,wallet,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?)').bind(handle, name, line, x, avatar, wallet, clock(), clock()).run();
    return json({ ok: true, handle, wallet, url: `${url.origin}/${handle}` }, 201);
  }
  if (request.method === 'POST' && parts.length === 2 && parts[1] === 'drops') {
    const handle = parts[0], creator = await creatorOf(env, url.origin, handle);
    if (!creator) fail('No such tracenet.', 404);
    if (creator.source !== 'd1') fail('The first tracenet publishes through the house (the Nest\'s sanitization receipt), not this door.', 403);
    const wallet = await walletOf(request, clockMs()); if (wallet !== creator.register.wallet) fail('Sign in with this tracenet\'s wallet.', 401);
    if (!env.VAULT) fail('The vault is not set up yet.', 503);
    const title = String(request.headers.get('x-title') ?? '').trim().slice(0, 120), kind = String(request.headers.get('x-kind') ?? 'trace'), file = String(request.headers.get('x-file') ?? '');
    if (!title) fail('Name the drop (x-title).'); if (!KIND.test(kind)) fail('A kind is a lowercase word (x-kind).'); if (!FILE.test(file)) fail('A file name without a slash (x-file).');
    const length = Number(request.headers.get('content-length') ?? NaN);
    if (!(length > 0) || length > MAX_DROP) fail(`A drop is up to ${MAX_DROP / 1048576} MB, with its length named.`, 413);
    // THE DROP IS SIGNED BY ITS CREATOR: the line's time and its link come with it, signed; the door checks them and keeps the signature
    const published = String(request.headers.get('x-published') ?? ''), prev = String(request.headers.get('x-prev') ?? ''), sig = String(request.headers.get('x-sig') ?? '');
    const at = Date.parse(published);
    if (!Number.isFinite(at) || new Date(at).toISOString() !== published) fail('Sign the drop: its line names the instant it is published (x-published).');
    if (Math.abs(at - clockMs()) > DROP_SKEW_MS) fail('The drop\'s line is more than ten minutes from now: sign it again.');
    if (!PREV.test(prev) || !SIG.test(sig)) fail('Sign the drop: the line\'s signature (x-sig) and the line before it (x-prev).', 401);
    const bytes = new Uint8Array(await request.arrayBuffer());
    if (bytes.length !== length || bytes.length > MAX_DROP) fail('The bytes are not the length named.', 413);
    const id = dropId(published, title);
    if (!ITEM_ID.test(id)) fail('The title makes no drop id.');
    if (await env.DB.prepare('SELECT id FROM drops WHERE handle=? AND id=?').bind(handle, id).first()) fail('A drop of that title is published today already.', 409);
    const sha256 = hex(await crypto.subtle.digest('SHA-256', bytes));
    const last = await lastSigned(creator.register);   // the chain's newest link, as every reader finds it (app/tracenet-drop-line.mjs headOf)
    if (last && published <= last.published) fail('A drop is published after the line before it: sign it again.', 409);
    if (prev !== (last ? await lineHash(lineOf(creator.register, last)) : NO_PREV)) fail('The line before this one is not the tracenet\'s last: read the register and sign again.', 409);
    const line = { id, title, kind, file, bytes: bytes.length, sha256, published, prev, sig };
    if (!await verifyDropLine(creator.register, line)) fail('The drop\'s line is not signed by this tracenet\'s wallet.', 401);
    const key = `vault/${handle}/${id}/${file}`;
    await env.VAULT.put(key, bytes, { httpMetadata: { contentType: request.headers.get('content-type') || 'application/octet-stream' }, customMetadata: { sha256 } });
    try { await env.DB.prepare('INSERT INTO drops(handle,id,title,kind,file,bytes,sha256,published,prev,sig) VALUES(?,?,?,?,?,?,?,?,?,?)').bind(handle, id, title, kind, file, bytes.length, sha256, published, prev, sig).run(); }
    catch (e) {   // no row, no bytes; drops_chain (one signed line per prev) refused a race: said as such, any other failure is the database's own
      await env.VAULT.delete?.(key)?.catch?.(() => {});
      if (/UNIQUE/i.test(String(e?.message ?? e))) fail('Another drop took the line before this one first: read the register and sign again.', 409);
      throw e;
    }
    await rides(request, env, handle, at, clockMs()); return json({ ok: true, handle, id, file, bytes: bytes.length, sha256, published, prev, sig, line: await lineHash(lineOf(creator.register, line)), url: `${url.origin}/vault/${handle}/${id}/${file}` }, 201);
  }
  return null;
}
/** frontDoor(env, url): the tracenet page for GET /<handle> of a creator row (the build's redirects cover the asset registers), or null. */
export async function frontDoor(env, url) {
  const m = /^\/([A-Za-z0-9_]{1,32})\/?$/.exec(url.pathname); if (!m || !env.DB) return null;
  let row = null; try { row = await env.DB.prepare('SELECT handle FROM creators WHERE handle=?').bind(m[1]).first(); } catch { row = null; }
  return row ? new Response(null, { status: 302, headers: { location: `${url.origin}/app/tracenet.html?of=${row.handle}`, 'cache-control': 'no-store' } }) : null;
}
/** vaultBytes(env, origin, handle, id, file): a drop's bytes from R2 (a D1 creator's) or the assets (the first tracenet's); a Response or null. */
export async function vaultBytes(env, origin, handle, id, file) {
  if (env.VAULT) {
    const object = await env.VAULT.get(`vault/${handle}/${id}/${file}`).catch(() => null);
    if (object) return new Response(object.body, { headers: { 'content-type': object.httpMetadata?.contentType || 'application/octet-stream', 'content-length': String(object.size) } });
  }
  const asset = await env.ASSETS.fetch(new Request(`${origin}/vault/${handle}/${id}/${file}`, { method: 'GET' }));
  return asset.ok ? asset : null;
}

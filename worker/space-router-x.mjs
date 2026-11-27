// worker/space-router-x.mjs · X HOLDS THE FLASK, the door (Nov 19 2026, lane/x-is-the-flasks-name, claude-1cd371e0; his words and the law: app/space-router-x.mjs).
//   GET  X_BACK ?state&code   X's answer to the mint page: sent on to the page's deposit door, the code in the address's fragment (no log keeps it), or #x=no.
//   POST X_PATH { code, verifier, proof }   the mint page: the proof is the grant law's X text, signed by the flask, naming the sha256 of this sign-in's verifier.
//     The door trades the code with X itself (so it knows the X account, never a word of the page's) and writes that this X account holds the flask: 201
//     { handle, tank }, 200 for the same again. The tank is the X account's: the one of the first flask it held. A Harmony key that waited for this X account
//     becomes a grant on it. Refusals: 401 not a fresh text of this flask for this sign-in, or X did not let it in; 409 the flask is another X account's, or it
//     holds credits of its own while X holds another flask.
//   POST X_PATH { code, verifier, redirect_uri, key, label }   Harmony's X door (tools/embertide-mesh/x-door.mjs): the door trades the code, and the key named by
//     its sha256 may spend the flask that X account holds: X_CAP a UTC day for X_DAYS (a grant, payer `x:<id>`). 200 { x, tank, fuel_usd, grant }; 202 { x,
//     waits } when X holds no flask yet (the key waits for its first); 409 { x, error } when the key is a tank's own or another's. `x` is X's own profile read,
//     so the X door writes it as it did. 429 MAX_LIVE keys already spend from that flask, or too many asks.
//   GET  X_PATH ?id=<an X account's id>   ONE NAME FOR HER (Nov 22 2026): the her that X account holds, coloured or not, her page claimed or not: { her: { n, name, colours,
//     picture, page } } or { her: null }. What the site's wall shows everyone, asked by the one account: Harmony's X door finds her by it (the wall lists 150 coloured ones).
//   404 on a database behind migration 0025, before any code is traded: Harmony's X door then takes its own road (the profile alone), as before.
// COST: a sign-in is two https calls to X and two to four D1 reads and one write or batch. Nothing runs at rest. No token is kept: it is used once for /users/me.
import { perMinute, json, refusal } from './solana-node.mjs';
import { tankOfAuthority } from './space-router-link.mjs';
import { MAX_LIVE } from './space-router-grant.mjs'; import { eggOf } from './space-router-egg.mjs';
import { DAY_MS, LABEL_RX, MARK_RX, verifyGrantProof } from '../app/space-router-grant.mjs';
import { X_PATH, X_BACK, X_CLIENT_ID, X_CAP, X_DAYS } from '../app/space-router-x.mjs';
import { sha256Hex } from '../app/dl-society-codes.mjs'; import { PORTRAIT_PATH } from './space-router-portrait.mjs';

export { X_PATH, X_BACK }; export const MINT_PAGE = '/app/warm.html';
const STATE = /^[A-Za-z0-9_-]{16,64}$/, CODE = /^[A-Za-z0-9._~:-]{1,1024}$/, VERIFIER = /^[A-Za-z0-9._~-]{43,128}$/, X_NO = 'X did not let this sign-in in. Try again.';
const SQL = {
  ready: 'SELECT 1 FROM sr_x_waits LIMIT 1', flask: 'SELECT x_id, tank FROM sr_x WHERE address = ?1', theirs: 'SELECT tank FROM sr_x WHERE x_id = ?1 ORDER BY bound_at, address LIMIT 1', standing: 'SELECT name FROM sr_tanks WHERE name = ?1',
  hold: 'INSERT INTO sr_x(address, x_id, handle, tank, bound_at, signature) VALUES (?1, ?2, ?3, COALESCE((SELECT tank FROM sr_x WHERE x_id = ?2 ORDER BY bound_at, address LIMIT 1), ?4), ?5, ?6) ON CONFLICT(address) DO NOTHING',   // two browsers at the same instant: the second takes the first's tank
  // a key that waited for this X account spends from the flask it now holds; a tank's own key is never a grant's
  waited: `INSERT INTO sr_grants(key_sha256, tank, payer, label, cap_usd, until, signed_at, granted_at, signature) SELECT key_sha256, ?2, 'x:' || ?1, label, ?3, ?4 + ?5, asked_at, ?4, 'x:' || ?1
    FROM sr_x_waits WHERE x_id = ?1 AND NOT EXISTS (SELECT 1 FROM sr_tanks WHERE key_sha256 = sr_x_waits.key_sha256) ON CONFLICT(key_sha256) DO NOTHING`, unwait: 'DELETE FROM sr_x_waits WHERE x_id = ?1',
  held: 'SELECT tank, ended_at FROM sr_grants WHERE key_sha256 = ?1', live: 'SELECT COUNT(*) AS n FROM sr_grants WHERE tank = ?1 AND ended_at IS NULL AND until > ?2',
  grant: `INSERT INTO sr_grants(key_sha256, tank, payer, label, cap_usd, until, signed_at, granted_at, signature) SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?7, ?3
    WHERE NOT EXISTS (SELECT 1 FROM sr_tanks WHERE key_sha256 = ?1) ON CONFLICT(key_sha256) DO NOTHING`,
  wait: 'INSERT INTO sr_x_waits(key_sha256, x_id, label, asked_at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(key_sha256) DO UPDATE SET x_id = excluded.x_id, label = excluded.label, asked_at = excluded.asked_at',
  fuel: 'SELECT poured_usd - drunk_usd AS fuel FROM sr_tanks WHERE name = ?1',
};

/** xDoor({fetcher, clockMs}) -> (request, env, url) => Response for X_PATH and X_BACK */
export function xDoor({ fetcher = fetch, clockMs = () => Date.now() } = {}) {
  const limited = perMinute(20);
  async function who(env, code, verifier, redirect) {   // X's own word on who signed in: the code traded with the house's public client, the token used once for /users/me
    const api = env.X_API || 'https://api.twitter.com/2', form = new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: redirect, code_verifier: verifier, client_id: env.X_CLIENT_ID || X_CLIENT_ID });
    const t = await fetcher(`${api}/oauth2/token`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: form.toString() }), tok = await t.json().catch(() => null);
    if (!t.ok || typeof tok?.access_token !== 'string') return null;
    const m = await fetcher(`${api}/users/me?user.fields=profile_image_url,verified`, { headers: { authorization: `Bearer ${tok.access_token}` } }), me = (await m.json().catch(() => null))?.data;
    return m.ok && /^\d{1,20}$/.test(me?.id ?? '') && /^[A-Za-z0-9_]{1,15}$/.test(me?.username ?? '') ? me : null;
  }
  async function hold(env, url, b, now) {   // the mint page: this X account holds this flask
    const p = await verifyGrantProof(b.proof, { host: url.host, origin: url.origin, now });
    if (!p?.x || p.key !== await sha256Hex(b.verifier)) return refusal(401, 'Not a fresh ask of this flask for this sign-in.');
    const me = await who(env, b.code, b.verifier, url.origin + X_BACK); if (!me) return refusal(401, X_NO);
    const handle = '@' + me.username, was = await env.DB.prepare(SQL.flask).bind(p.payer).first();
    if (was) return was.x_id === me.id ? json(200, { handle, tank: was.tank }) : refusal(409, 'This flask is another X account\'s.');
    const own = await tankOfAuthority(p.payer), theirs = (await env.DB.prepare(SQL.theirs).bind(me.id).first())?.tank ?? null;
    if (theirs && theirs !== own && (await env.DB.prepare(SQL.standing).bind(own).first() || (await eggOf(env, own))?.her)) return refusal(409, 'This flask holds credits of its own, and this X account holds another flask.');   // credits, or an egg whose deposit is heard and not counted yet
    const tank = theirs ?? own;
    await env.DB.batch([env.DB.prepare(SQL.hold).bind(p.payer, me.id, me.username, tank, now, p.signature58), ...(theirs ? [] : [env.DB.prepare(SQL.waited).bind(me.id, tank, X_CAP, now, X_DAYS * DAY_MS), env.DB.prepare(SQL.unwait).bind(me.id)])]);
    const row = await env.DB.prepare(SQL.flask).bind(p.payer).first(); return row?.x_id === me.id ? json(201, { handle, tank: row.tank }) : refusal(409, 'This flask is another X account\'s.');
  }
  async function key(env, b, now) {   // Harmony: the key named by its sha256 spends the flask this X account holds
    const me = await who(env, b.code, b.verifier, b.redirect_uri); if (!me) return refusal(401, X_NO);
    const x = { id: me.id, username: me.username, name: me.name, profile_image_url: me.profile_image_url, verified: me.verified }, tank = (await env.DB.prepare(SQL.theirs).bind(me.id).first())?.tank ?? null;
    if (!tank) { await env.DB.prepare(SQL.wait).bind(b.key, me.id, b.label, now).run(); return json(202, { x, tank: null, waits: true }); }
    const held = await env.DB.prepare(SQL.held).bind(b.key).first(), no = (message, status = 409) => json(status, { x, tank, error: { message, type: 'invalid_request_error', code: null } });
    if (held && (held.tank !== tank || held.ended_at !== null)) return no('This key is not free to spend from this flask.');
    if (!held && Number((await env.DB.prepare(SQL.live).bind(tank, now).first())?.n) >= MAX_LIVE) return no(`This flask already lets ${MAX_LIVE} keys spend. End one first.`, 429);
    if (!held && Number((r => r?.meta?.changes ?? r?.changes)(await env.DB.prepare(SQL.grant).bind(b.key, tank, 'x:' + me.id, b.label, X_CAP, now + X_DAYS * DAY_MS, now).run())) !== 1) return no('This key spends from a tank of its own.');
    const fuel = Number((await env.DB.prepare(SQL.fuel).bind(tank).first())?.fuel);
    return json(200, { x, tank, fuel_usd: Number.isFinite(fuel) ? +fuel.toFixed(9) : null, grant: { label: b.label, cap_usd: X_CAP, days: X_DAYS } });
  }
  return async function door(request, env, url) {
    if (url.pathname === X_BACK) { const q = url.searchParams, s = q.get('state'), c = q.get('code');
      return new Response(null, { status: 302, headers: { location: `${MINT_PAGE}?door=deposit#x=${STATE.test(s ?? '') && CODE.test(c ?? '') ? `${s}.${encodeURIComponent(c)}` : 'no'}`, 'cache-control': 'no-store', 'referrer-policy': 'no-referrer' } }); }
    const id = request.method === 'GET' ? url.searchParams.get('id') : null; if (request.method !== 'POST' && !/^\d{1,20}$/.test(id ?? '')) return refusal(405, 'POST an X sign-in: { "code", "verifier", "proof" }.', { allow: 'POST' });
    if (limited(request, clockMs())) return refusal(429, 'Too many asks. Wait a minute.', { 'retry-after': '60' });
    if (!env.DB) return refusal(503, 'The door cannot read X now; ask again.');
    if (id) try { const tank = (await env.DB.prepare(SQL.theirs).bind(id).first())?.tank, h = tank ? (await eggOf(env, tank))?.her : null; return json(200, { her: h ? { n: h.n, name: h.name, colours: h.colours, picture: h.picture ? `${PORTRAIT_PATH}/${h.picture}.jpg` : null, page: h.page } : null }); } catch { return refusal(503, 'The door cannot read X now; ask again.'); }
    let b = null; try { b = await request.json(); } catch { b = null; }
    if (!CODE.test(b?.code ?? '') || !VERIFIER.test(b?.verifier ?? '')) return refusal(400, 'Bring X\'s code and its verifier.');
    try { await env.DB.prepare(SQL.ready).first(); } catch { return refusal(404, 'No such Space Router door.'); }   // behind migration 0025: nothing traded, the caller's own road stands
    try {
      if (b.proof !== undefined) return await hold(env, url, b, clockMs());
      if (MARK_RX.test(b.key ?? '') && LABEL_RX.test(b.label ?? '') && typeof b.redirect_uri === 'string' && /^https?:\/\/\S{1,290}$/.test(b.redirect_uri)) return await key(env, b, clockMs());
      return refusal(400, 'Bring the flask\'s proof, or a key\'s sha256, its name and the address X answered.');
    } catch { return refusal(503, 'The door cannot read X now; ask again.'); }
  };
}

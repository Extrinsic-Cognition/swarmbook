// space-router-portrait.mjs · HER PORTRAIT'S PASS, AND EVERYONE'S FACES (Nov 11 2026; the page's half: app/dl-her-portrait.js). His words that day: "can
// we build it in to our lyssajudron thing? when they buy the hex for min 10 USDC"; "i would like to imagine if we were to fill the surface with
// lyssajudron pics of other profiles", "Yes, build it"; over the others' faces drawn from colours alone for fear of what a stranger could send: "dude,
// until now there was only mocks... nobody saw this app or done shit u get me? it is only internal atm..."; and over a first cut that kept a ranking of
// its own beside the deposits' list: "have you been working in isolation?". So a face is its deposit's: everything here is keyed by the signature of a
// deposit the house has heard (sr_drops, THE HOUSE HEARS ONCE, migration 0020), whose hexagon the sphere already draws.
// - POST /space-router/v1/portrait { signature, colours?, name? }: for a deposit in sr_drops (10 USDC or more by its own law), one pass for one Reactor session
//   of CAP_S seconds on the one model, minted with the house's key (REACTOR_API_KEY, a Worker secret, his to set) and never shown; PASSES a deposit. Her six colours ({ light, base, coat, gold, eyes, thruster }, #RRGGBB each) are kept as its hexagon's (SETS times at most), pass or no pass. Every
//   answer says the hexagon's number, the deposit's place in the house's list.
// - PUT /space-router/v1/portrait/<signature> (a JPEG, 200 kB at most): her drawing, then the painting Reactor made of it in the visitor's browser, kept in the bucket under a new random name each time (PICTURES a deposit, after its colours, pass or no pass; the one before is let go). GET .../portrait/<name>.jpg serves it, held a year.
//   GET .../portrait/<signature> serves the deposit's picture as it stands now (held a minute; 404 until one is kept): one address that does not
//   change when it is painted again, for a profile's picture (worker/creators.mjs avatar).
// - GET /space-router/v1/portrait: everyone's faces, { count, hexagons: [{ n, signature, colours, picture?, handle? }] } in the list's order, WALL at
//   most, held 20 s. handle: the page its depositor claimed (creators.wallet is the deposit's payer, sr_deposits.payer), once its deposit is counted. ?board (THE PANTHEON'S BOARD, Nov 19 2026, his "we need this both in the website (global leaderboard)" and, of what elects a throne, "ideally it would be fees"): the same hexagons, one a flask (its first), ranked by the fees the flask's model calls brought the router since ?since (ms; else the last 30 days), then of all time: { count, since, board: [{ rank, n, signature, colours|null, picture?, handle?, month, all: { fees, burned, mined, calls } }] }. A fee is the markup: what a call paid less what the provider charged (usd x markup / (1 + markup) where its cost was not known); a tracenet bought is no fee. ?riders=<key>,<key> (EVERY RIDER'S FACE, Nov 22 2026, his "Yes, build it"): of the Solana keys named, RIDERS at most (a swarm's seats, which stand on the chain), each that paid a hexagon's deposit, with its first one's picture and the page its person claimed: { riders: { <key>: { picture, handle? } } }, held 20 s; and, paid or not, `colours`, her six as its rider gave them in Harmony, for a key with no minted face (THE RIDER'S COLOURS CROSS, Nov 24 2026, space-router-grant.mjs PERSON_PATH; no face of a person: THE RIDER IS A HEXAGON); and `rider` { traces, at } for a key whose tracenet egressed traces under its Harmony's key (THE CLAW RIDER IS REGISTERED: creators.mjs rides), with `registered`, how many claw riders the house knows. A key that paid none and chose none is not said; no key is ever listed, so whoever asks holds it already.
// - Refusals: 400 not a signature; 401 not the deposit's own flask (x-seat); 402 no such deposit heard; 404 no such picture; 405 another method; 409 a picture before
//   its colours; 413 too large; 415 not a JPEG; 429 the deposit's passes or pictures are given, or too many asks; 502 the painter refused; 503 unopened (no D1, no bucket for a picture; or no key: the colours are kept and the number said all the same).
// A FACE IS SET BY ITS DEPOSIT'S OWN FLASK (Nov 20 2026, his "Yes, cut it" over that day's audit): a signature is public, and until then a stranger who read the chain or this list could spend a deposit's passes and set its face. A pass, the colours and a picture are given only to the flask that paid: the site's own sign-in signed by its key (x-seat, as the creators' door reads it), whose address is the deposit's payer (sr_deposits.payer; a card's egg names its flask there too). The list and the pictures stay public.
// COST: a pass is two D1 reads, one ask of Reactor and two D1 writes; the list is two D1 reads a 20 s; a swarm's faces are two, by the payer's index and the person's key, side by side; a picture is two reads, one put, one write.
import { perMinute, json, said, refusal } from './solana-node.mjs'; import { verifySeatProof } from '../app/dl-direct-protocol.mjs'; import { personOf, born } from './space-router-egg.mjs'; import { tankOfAuthority } from './space-router-link.mjs';

export const HER = '/app/assets/her-default.jpg', HANDLE = /^[A-Za-z0-9_-]{1,32}$/, PICTURES = 12, MAX_PICTURE = 200_000, SETS = 6, WALL = 150, RIDERS = 100, COLOURS = Object.freeze(['light', 'base', 'coat', 'gold', 'eyes', 'thruster']);
export const PORTRAIT_PATH = '/space-router/v1/portrait', PASSES = 3, CAP_S = 40, MODEL = 'xmax/x2', TOKENS = 'https://api.reactor.inc/tokens';
const SIGNATURE = /^[1-9A-HJ-NP-Za-km-z]{64,88}$/, KEY = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/, PICTURE = /^\/([0-9a-f]{32})\.jpg$/, keyOf = (name) => `portraits/${name}.jpg`, DAY_MS = 86_400_000, r4 = (x) => Math.round((Number(x) || 0) * 1e4) / 1e4, sums = (r, p) => ({ fees: r4(r[`${p}fees`]), burned: r4(r[`${p}burned`]), mined: r4(r[`${p}mined`]), calls: Number(r[`${p}calls`]) || 0 });
/** coloursOf(given): her six colours as the door keeps them, or null for anything else */
export const coloursOf = (c) => (c && typeof c === 'object' && COLOURS.every((k) => typeof c[k] === 'string' && /^#[0-9a-fA-F]{6}$/.test(c[k])) ? Object.fromEntries(COLOURS.map((k) => [k, c[k].toUpperCase()])) : null);
const PAGE = 'c.handle = (SELECT k.handle FROM creators AS k WHERE k.wallet = p.payer OR k.wallet IN (SELECT address FROM sr_x WHERE tank = p.tank) LIMIT 1)';   // the page its person claimed, from whichever of their browsers (ONE NAME FOR HER)
const SQL = { drop: 'SELECT n FROM sr_drops WHERE signature = ?1', took: 'SELECT COUNT(*) AS n FROM sr_portraits WHERE signature = ?1', take: 'INSERT INTO sr_portraits(signature, made_at) VALUES (?1, ?2)',
  keep: `INSERT INTO sr_hexagons(signature, colours, set_at, sets) VALUES (?1, ?2, ?3, 1)
    ON CONFLICT(signature) DO UPDATE SET colours = excluded.colours, set_at = excluded.set_at, sets = sr_hexagons.sets + 1 WHERE sr_hexagons.sets < ${SETS}`,
  hexagon: 'SELECT picture, pictures FROM sr_hexagons WHERE signature = ?1', payer: 'SELECT payer, tank FROM sr_deposits WHERE signature = ?1', picture: 'UPDATE sr_hexagons SET picture = ?2, pictures = pictures + 1 WHERE signature = ?1',
  count: 'SELECT COUNT(*) AS n FROM sr_drops', board: `WITH f AS (SELECT p.tank AS tank, MIN(d.n) AS n FROM sr_drops AS d JOIN sr_deposits AS p ON p.signature = d.signature GROUP BY p.tank), s AS (SELECT f.tank AS tank, f.n AS n, COALESCE(SUM(CASE WHEN l.why IS NULL AND l.at >= ?1 THEN COALESCE(l.usd - l.router_usd, l.usd * l.markup_bps / (10000.0 + l.markup_bps)) END), 0) AS m_fees, COALESCE(SUM(CASE WHEN l.why IS NULL AND l.at >= ?1 THEN l.usd END), 0) AS m_burned, COALESCE(SUM(CASE WHEN l.at >= ?1 THEN l.warm END), 0) AS m_mined, COUNT(CASE WHEN l.why IS NULL AND l.at >= ?1 THEN 1 END) AS m_calls, COALESCE(SUM(CASE WHEN l.why IS NULL THEN COALESCE(l.usd - l.router_usd, l.usd * l.markup_bps / (10000.0 + l.markup_bps)) END), 0) AS a_fees, COALESCE(SUM(CASE WHEN l.why IS NULL THEN l.usd END), 0) AS a_burned, COALESCE(SUM(l.warm), 0) AS a_mined, COUNT(CASE WHEN l.why IS NULL THEN 1 END) AS a_calls FROM f LEFT JOIN sr_ledger AS l ON l.tank = f.tank AND l.kind = 'burn' GROUP BY f.tank) SELECT s.*, d.signature AS signature, h.colours AS colours, h.picture AS picture, c.handle AS handle FROM s JOIN sr_drops AS d ON d.n = s.n JOIN sr_deposits AS p ON p.signature = d.signature LEFT JOIN sr_hexagons AS h ON h.signature = d.signature LEFT JOIN creators AS c ON ${PAGE} ORDER BY s.m_fees DESC, s.a_fees DESC, s.n LIMIT ${WALL}`,
  wall: `SELECT d.n AS n, d.signature AS signature, h.colours AS colours, h.picture AS picture, c.handle AS handle FROM sr_drops AS d JOIN sr_hexagons AS h ON h.signature = d.signature
    LEFT JOIN sr_deposits AS p ON p.signature = d.signature LEFT JOIN creators AS c ON ${PAGE} ORDER BY d.n LIMIT ${WALL}`,
  riders: `SELECT p.payer AS rider, h.picture AS picture, c.handle AS handle FROM json_each(?1) AS a JOIN sr_deposits AS p ON p.payer = a.value JOIN sr_drops AS d ON d.signature = p.signature JOIN sr_hexagons AS h ON h.signature = d.signature LEFT JOIN creators AS c ON ${PAGE} WHERE h.picture IS NOT NULL ORDER BY d.n DESC`,
  persons: `WITH k AS (SELECT json_extract(a.value, '$[0]') AS rider, COALESCE((SELECT x.tank FROM sr_x AS x WHERE x.address = json_extract(a.value, '$[0]')), json_extract(a.value, '$[1]')) AS tank FROM json_each(?1) AS a)
    SELECT k.rider AS rider, s.colours AS colours, q.traces AS traces, q.last_at AS last_at FROM k LEFT JOIN sr_persons AS s ON s.tank = k.tank LEFT JOIN sr_riders AS q ON q.tank = k.tank WHERE s.tank IS NOT NULL OR q.tank IS NOT NULL`, registered: 'SELECT COUNT(*) AS n FROM sr_riders',
  on: `SELECT q.rowid AS id, q.handle AS handle, q.traces AS traces, s.colours AS colours FROM sr_riders AS q LEFT JOIN sr_persons AS s ON s.tank = q.tank ORDER BY q.first_at, q.rowid LIMIT ${WALL}` };   // THE RIDER STANDS ON THE META SWARM: every claw rider, in the order they came   // a key's person: the one its X holds, else its own   // the first hexagon of a key is read last, and stands

export function portraitDoor({ fetcher = fetch, clockMs = () => Date.now() } = {}) {
  const limited = perMinute(30), NOT_THEIRS = 'A face is set by the flask that paid its deposit: sign in with it.', theirs = async (request, env, signature) => { const u = new URL(request.url), who = (await verifySeatProof(request.headers.get('x-seat'), { host: u.host, origin: u.origin, now: clockMs() }))?.buyer; const of = who ? await env.DB.prepare(SQL.payer).bind(signature).first() : null; return !!of && (of.payer === who || of.tank === (await personOf(env, who)).tank); };   // A FACE IS SET BY ITS DEPOSIT'S OWN FLASK, or another its X account holds (ONE NAME FOR HER: paid on the phone, coloured on the Mac)
  async function picture(request, env, rest) {   // a hexagon's painting: kept by PUT under its deposit's signature, served by GET under its own name
    if (!env.DB || !env.VAULT) return refusal(503, 'Pictures are not kept yet.');
    try {
      if (request.method === 'GET') {
        const m = PICTURE.exec(rest), now = !m && SIGNATURE.test(rest.slice(1)) ? (await env.DB.prepare(SQL.hexagon).bind(rest.slice(1)).first())?.picture : null;   // by its own name, or the deposit's as it stands now
        const held = m || now ? await env.VAULT.get(keyOf(m ? m[1] : now)) : null; if (!held) return refusal(404, 'No such picture.');
        return new Response(held.body, { status: 200, headers: { 'content-type': 'image/jpeg', 'cache-control': m ? 'public, max-age=31536000, immutable' : 'public, max-age=60' } });
      }
      if (request.method !== 'PUT') return refusal(405, 'GET a picture, or PUT a deposit\'s.', { allow: 'GET, PUT' });
      if (limited(request, clockMs())) return refusal(429, 'Too many asks. Wait a minute.', { 'retry-after': '60' });
      const signature = rest.slice(1); if (!SIGNATURE.test(signature)) return refusal(400, 'Not a transaction signature.'); if (!await theirs(request, env, signature)) return refusal(401, NOT_THEIRS);
      const row = await env.DB.prepare(SQL.hexagon).bind(signature).first(); if (!row) return refusal(409, 'A picture follows its colours.');
      if (row.pictures >= PICTURES) return refusal(429, 'This hexagon\'s pictures are kept.');
      const bytes = new Uint8Array(await request.arrayBuffer()); if (bytes.length > MAX_PICTURE) return refusal(413, 'A picture is 200 kB at most.');
      if (!(bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff)) return refusal(415, 'A picture is a JPEG.');
      const name = [...crypto.getRandomValues(new Uint8Array(16))].map((b) => b.toString(16).padStart(2, '0')).join('');
      await env.VAULT.put(keyOf(name), bytes, { httpMetadata: { contentType: 'image/jpeg' } }); await env.DB.prepare(SQL.picture).bind(signature, name).run();
      if (row.picture) await env.VAULT.delete(keyOf(row.picture)).catch(() => {});   // the painting before it
      return json(200, { picture: `${PORTRAIT_PATH}/${name}.jpg` });
    } catch { return refusal(503, 'The door cannot keep a picture now.'); }
  }
  return async function door(request, env) {
    const rest = new URL(request.url).pathname.slice(PORTRAIT_PATH.length);
    if (rest) return picture(request, env, rest);
    if (request.method !== 'POST' && request.method !== 'GET') return refusal(405, 'GET the hexagons, or POST a deposit\'s signature.', { allow: 'GET, POST' });
    if (!env.DB) return refusal(503, 'Portraits are not open yet.');
    if (request.method === 'GET') {
      try {
        const q = new URL(request.url).searchParams; if (q.has('riders')) { const keys = [...new Set(q.get('riders').split(','))].filter((k) => KEY.test(k)).slice(0, RIDERS), [{ results }, chosen, registered] = await Promise.all([env.DB.prepare(SQL.riders).bind(JSON.stringify(keys)).all(), Promise.all(keys.map(async (k) => [k, await tankOfAuthority(k)])).then((ks) => env.DB.prepare(SQL.persons).bind(JSON.stringify(ks)).all()).catch(() => ({ results: [] })), env.DB.prepare(SQL.registered).first().then((r) => Number(r?.n) || 0, () => 0)]), riders = Object.fromEntries(results.map((r) => [r.rider, { picture: `${PORTRAIT_PATH}/${r.picture}.jpg`, ...(r.handle ? { handle: r.handle } : {}) }]));
          for (const r of chosen.results) { let c = null; try { c = coloursOf(JSON.parse(r.colours)); } catch { c = null; } riders[r.rider] = { ...riders[r.rider], ...(c && !riders[r.rider]?.picture ? { colours: c } : {}), ...(r.traces !== null ? { rider: { traces: r.traces, at: new Date(r.last_at).toISOString() } } : {}) }; } return json(200, { riders, registered }, { 'cache-control': 'public, max-age=20' }); }   // a database behind 0034 knows no person: the faces alone, as before
        const since = q.has('board') ? Math.max(0, Math.min(clockMs(), Number(q.get('since')) || clockMs() - 30 * DAY_MS)) : null, count = Number((await env.DB.prepare(SQL.count).first())?.n) || 0, { results } = await (since === null ? env.DB.prepare(SQL.wall) : env.DB.prepare(SQL.board).bind(since)).all(), hexagons = [];
        for (const row of results) { let c = null; try { c = coloursOf(JSON.parse(row.colours)); } catch { c = null; } if (c || since !== null) hexagons.push({ ...(since === null ? {} : { rank: hexagons.length + 1 }), n: row.n, signature: row.signature, colours: c, ...(row.picture ? { picture: `${PORTRAIT_PATH}/${row.picture}.jpg` } : {}), ...(row.handle ? { handle: row.handle } : {}), ...(since === null ? {} : { month: sums(row, 'm_'), all: sums(row, 'a_') }) }); }
        const on = (await env.DB.prepare(SQL.on).all().catch(() => ({ results: [] }))).results.map((r, k) => { let c = null; try { c = coloursOf(JSON.parse(r.colours)); } catch { c = null; } return { n: count + k + 1, signature: `rider-${r.id}`, colours: c, ...(c ? {} : { picture: HER }), ...(HANDLE.test(r.handle) ? { handle: r.handle } : {}), traces: r.traces }; });   // the riders after the minted, each a hexagon in their own colours, else her default; on the board by the traces they egressed
        return json(200, since === null ? { count, hexagons: [...hexagons, ...on] } : { count, since, board: [...hexagons, ...on.sort((a, b) => b.traces - a.traces).map((r, k) => ({ rank: hexagons.length + k + 1, ...r, month: sums({}, 'm_'), all: sums({}, 'a_') }))] }, { 'cache-control': 'public, max-age=20' });
      } catch { return refusal(503, 'The door cannot read the hexagons now.'); }
    }
    if (limited(request, clockMs())) return refusal(429, 'Too many asks. Wait a minute.', { 'retry-after': '60' });
    let body = null; try { body = await request.json(); } catch { body = null; }
    const signature = body?.signature; if (typeof signature !== 'string' || !SIGNATURE.test(signature)) return refusal(400, 'Not a transaction signature.');
    try {
      const hexagon = Number((await env.DB.prepare(SQL.drop).bind(signature).first())?.n) || null;
      if (!hexagon) return refusal(402, 'A portrait is painted for a deposit the house has heard, of 10 USDC or more.'); if (!await theirs(request, env, signature)) return refusal(401, NOT_THEIRS);
      const colours = coloursOf(body?.colours); if (colours) { await env.DB.prepare(SQL.keep).bind(signature, JSON.stringify(colours), clockMs()).run(); await born(env, signature, body?.name); }
      if (!env.REACTOR_API_KEY) return json(503, said('Portraits are not painted yet.', { hexagon }));
      const took = Number((await env.DB.prepare(SQL.took).bind(signature).first())?.n) || 0;
      if (took >= PASSES) return json(429, said('This deposit\'s portraits are painted.', { hexagon }));
      const r = await fetcher(TOKENS, { method: 'POST', headers: { 'Reactor-API-Key': env.REACTOR_API_KEY, 'content-type': 'application/json' },
        body: JSON.stringify({ authorization_details: [{ type: 'session', resources: { models: { match: [MODEL] } }, constraints: { max_sessions: 1, max_session_duration_seconds: CAP_S } }] }) });
      const jwt = r.ok ? (await r.json().catch(() => null))?.jwt : null; if (typeof jwt !== 'string' || !jwt) return json(502, said('The painter cannot be reached now.', { hexagon }));
      await env.DB.prepare(SQL.take).bind(signature, clockMs()).run();
      return json(200, { jwt, seconds: CAP_S, left: PASSES - took - 1, hexagon });
    } catch { return refusal(503, 'The door cannot give a pass now.'); }
  };
}

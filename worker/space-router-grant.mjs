// worker/space-router-grant.mjs · A FLASK LETS ITS HARMONY SPEND, the door (Nov 19 2026, lane/a-flask-lets-its-harmony-spend, claude-1cd371e0; the law and
// his words: app/space-router-grant.mjs).
//   POST /space-router/v1/grant  { proof }: a grant's text signed by a flask's own key (the page's, made in its browser). The flask's tank must stand (a
//     deposit the house counted made it); the key the text names by its sha256 is written once, with its name, its cap a UTC day and its end. From then on
//     that key opens the tank's calls (worker/space-router.mjs tankOf), within its cap, until its end. 201 { tank, label, cap_usd, until }; the same proof
//     again answers 200. The END's text, signed by the same flask, ends the key for good: 200 { ended }.
//   Refusals: 401 not a fresh grant for this site signed by the address it names; 402 the flask's tank does not stand yet (fill it first); 404 no such key
//     of this flask to end; 409 the key is another flask's, a tank's own, or ended; 429 too many asks, or MAX_LIVE keys already stand; 405; 503 no database.
//   POST /space-router/v1/person { colours } under the key itself (THE RIDER'S COLOURS CROSS, Nov 24 2026, his Nov 22 14:08 UTC "we should allow everyone to have their own colored face
//     lyssajudron"): a Harmony a flask let in says the six colours its rider gave her; they are kept on the rider (the flask's tank, sr_persons.colours) and said beside the rider's face
//     (space-router-portrait.mjs ?riders), so their hexagon wears her in them. THE RIDER IS A HEXAGON (his Nov 24 2026 ~18:1x UTC "you are misunderstanding hexagons and pentagons"): no
//     face of a person crosses and a pentagon wears none (a `person` is refused). 201 kept or changed; 200 the same again, nothing written. 401 not a live key a flask let in; 400 not her six colours.
// No fuel moves here and no key is seen here. COST: a grant is one read and one write; an end one write; a rider's colours one read and one write (none when unchanged). Nothing runs at rest.
import { perMinute, json, refusal } from './solana-node.mjs';
import { tankOfFlask } from './space-router-link.mjs';
import { GRANT_PATH, DAY_MS, verifyGrantProof } from '../app/space-router-grant.mjs'; import { isTankKey } from '../app/space-router-law.mjs'; import { keyHashOf } from '../app/space-router-deposit.mjs'; import { coloursOf } from './space-router-portrait.mjs';

export { GRANT_PATH }; export const MAX_LIVE = 12, PERSON_PATH = '/space-router/v1/person';   // the keys a flask may let spend at once
const SQL = {
  standing: `SELECT (SELECT name FROM sr_tanks WHERE name = ?1) AS tank, (SELECT COUNT(*) FROM sr_grants WHERE tank = ?1 AND ended_at IS NULL AND until > ?3) AS live,
    (SELECT tank FROM sr_grants WHERE key_sha256 = ?2) AS held, (SELECT ended_at FROM sr_grants WHERE key_sha256 = ?2) AS ended, (SELECT signature FROM sr_grants WHERE key_sha256 = ?2) AS signature`,
  // a key that is a tank's own is never a grant's; a key written once is never written again
  grant: `INSERT INTO sr_grants(key_sha256, tank, payer, label, cap_usd, until, signed_at, granted_at, signature) SELECT ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9
    WHERE NOT EXISTS (SELECT 1 FROM sr_tanks WHERE key_sha256 = ?1) ON CONFLICT(key_sha256) DO NOTHING`,
  end: 'UPDATE sr_grants SET ended_at = ?3 WHERE key_sha256 = ?1 AND tank = ?2 AND ended_at IS NULL',
  live: 'SELECT tank, payer FROM sr_grants WHERE key_sha256 = ?1 AND ended_at IS NULL AND until > ?2',   // a person is a tank (space-router-egg.mjs): kept once, said anew only when it changes
  person: `INSERT INTO sr_persons(tank, person, rider, said_at, colours) VALUES (?1, '', ?2, ?3, ?4) ON CONFLICT(tank) DO UPDATE SET colours = excluded.colours, rider = excluded.rider, said_at = excluded.said_at WHERE sr_persons.colours IS NOT excluded.colours`,   // person '': no face of a person is kept
};

/** grantDoor({clockMs}) -> (request, env, url) => Response for GRANT_PATH */
export function grantDoor({ clockMs = () => Date.now() } = {}) {
  const limited = perMinute(20);
  async function grant(request, env, url) {
    let body = null; try { body = await request.json(); } catch { body = null; }
    const now = clockMs(), p = await verifyGrantProof(body?.proof, { host: url.host, origin: url.origin, now });
    if (!p || p.x) return refusal(401, 'Not a fresh grant for this site, signed by the flask it names.');   // an X text is the X door's (space-router-x.mjs)
    const tank = await tankOfFlask(env, p.payer);
    if (p.end) {
      const r = await env.DB.prepare(SQL.end).bind(p.key, tank, now).run();
      return Number(r?.meta?.changes ?? r?.changes) === 1 ? json(200, { tank, ended: true }) : refusal(404, 'This flask let no such key spend, or it has ended.');
    }
    const s = await env.DB.prepare(SQL.standing).bind(tank, p.key, now).first(), until = p.issued + p.days * DAY_MS, said = { tank, label: p.label, cap_usd: p.cap, until: new Date(until).toISOString() };
    if (!s?.tank) return refusal(402, 'This flask holds nothing yet. Fill it first; then let a key spend.');
    if (s.held) return s.held === tank && s.ended === null && s.signature === p.signature58 ? json(200, said) : refusal(409, s.held === tank && s.ended !== null ? 'This key has ended. Ask with a new key.' : 'This key is not free to spend from this flask.');
    if (Number(s.live) >= MAX_LIVE) return refusal(429, `This flask already lets ${MAX_LIVE} keys spend. End one first.`);
    const r = await env.DB.prepare(SQL.grant).bind(p.key, tank, p.payer, p.label, p.cap, until, p.issued, now, p.signature58).run();
    return Number(r?.meta?.changes ?? r?.changes) === 1 ? json(201, said) : refusal(409, 'This key is not free to spend from this flask.');
  }
  async function person(request, env) {   // THE RIDER'S COLOURS CROSS: only her six colours, only from a key a flask let in
    let body = null; try { body = await request.json(); } catch { body = null; } const key = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim(), now = clockMs();
    const g = isTankKey(key) ? await env.DB.prepare(SQL.live).bind(await keyHashOf(key), now).first() : null; if (!g) return refusal(401, 'Not a key a flask let in. Let this Harmony spend from your flask first.');
    const c = coloursOf(body?.colours); if (!c || Object.keys(body).some((k) => k !== 'colours')) return refusal(400, 'A rider says her six colours, and nothing else.');
    const r = await env.DB.prepare(SQL.person).bind(g.tank, g.payer, now, JSON.stringify(c)).run(); return json(Number(r?.meta?.changes ?? r?.changes) === 1 ? 201 : 200, { colours: c });
  }
  return async function door(request, env, url) {
    const said = url.pathname === PERSON_PATH ? 'a person' : 'a grant';
    if (request.method !== 'POST') return refusal(405, said === 'a person' ? 'POST her colours: { "colours": { "light", "base", "coat", "gold", "eyes", "thruster" } }, under your key.' : 'POST a grant: { "proof": "<text>.<signature>" }.', { allow: 'POST' });
    if (limited(request, clockMs())) return refusal(429, 'Too many asks. Wait a minute.', { 'retry-after': '60' });
    if (!env.DB) return refusal(503, `The door cannot write ${said} now; ask again.`);
    try { return await (said === 'a person' ? person(request, env) : grant(request, env, url)); } catch { return refusal(503, `The door cannot write ${said} now; ask again.`); }
  };
}

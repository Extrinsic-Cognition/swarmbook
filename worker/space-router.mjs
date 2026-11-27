// worker/space-router.mjs · SPACE ROUTER'S PUBLIC DOOR (Oct 30 2026; his words: SPACE-ROUTERS-PUBLIC-DOOR-LANDING.md). The graph is MiniRouter's: a call rides it
// with the house's key. What is ours is the tank and the rebate.
// The purse door (tools/embertide-mesh/minirouter-openai-shim.mjs) answers only its Mac's loopback; a stranger's agent speaks HTTPS to a base URL, so its door
// is here, at the site's edge, and his LAN stays closed. Foundation 9 keeps the house's own wire (iroh between its processes); this door carries no room and
// no person, and keeps no prompt: a call's receipt is its ledger row.
//   POST /space-router/v1/chat/completions  OpenAI's chat wire. The tank's key is the bearer (or x-api-key) and never rides upstream. The call goes to
//                                            MiniRouter whole, stream:false (the burn needs the exact cost, the purse door's way); a caller's stream:true is
//                                            replayed from the whole answer. Each answer says what it drank and mined (x-space-router-usd, -warm, -fuel-usd).
//                                            THE NAMED WALK ON THE DOOR (Nov 4 2026): x-snowtrace: <tracenet>/<card> walks a card the caller may read (trailOf, below)
//   GET  /space-router/v1/models             MiniRouter's models, for a tank's key (read once a CACHE_MS by this isolate)
//   GET  /space-router/v1/tank               the key's tank: its fuel, its burns, the $WARM it mined, the rate now and the next halving
//   GET  /space-router/v1/oracle             THE ROUTER IS THE ORACLE (app/space-router-oracle.mjs, the law): the key that signs every receipt, the period and the tree
//   GET  /space-router/v1/oracle/root?period= a past hour's Merkle root, sealed on its first read once the hour is five minutes over, then never changed
//   GET  /space-router/v1/oracle/proof?receipt=<leaf>  a receipt's inclusion proof, for its own tank's key only (the holder shares by its consent)
//   GET  /space-router/v1/wish             THE WISH IS IN THE APP (Nov 1 2026, lane/the-wish-is-a-call; the law: app/dl-her-wishes.mjs): whether her wishes ride the
//                                            router, and where the app is: {open, store}
//   POST /space-router/v1/wish/hello {key, window, friend, attestation, phone[, platform] | assertion}  her her in DysonLight: born at the app key's first
//                                            word (Apple's attestation, or Android's key attestation with platform 'android'), with the phone's mark (ONE PHONE,
//                                            ONE BIRTH: a mark the door knows takes back its her), asked again at every open (an assertion): {code, wishes}
//   POST /space-router/v1/wish {key, window, wish, assertion}  one wish, one call on the house's own tank, under the app's key alone: {answer, wishes} (wish below)
//   GET  /wish, /.well-known/apple-app-site-association, /.well-known/assetlinks.json  the app's door on the web: iOS and Android open DysonLight on /wish
//                                            for the apps named; a browser is sent on to the app in its store (SPACE_ROUTER_WISH_STORE, an Android one
//                                            SPACE_ROUTER_WISH_PLAY), else to her page
// Every burned call answers with its receipt, x-space-router-receipt (base64url of the canonical signed receipt): the sha256 of what was asked and of what
// the provider answered, the models asked and answered, the provider, the instant, the tank and the cost, signed with the router's key. The door keeps the
// receipt beside the burn (migration 0012_the_oracle.sql) and never the words.
// THE TANKS (migration 0011_space_router.sql) keep the purse door's law (app/space-router-law.mjs): a call is let in while the tank holds more than its calls in
// flight hold, each holding the tank's fair price; it drinks the router's cost plus the tank's markup; a dry tank is a 402 and nothing is sent; an answer that
// never burned frees its hold, and a hold older than HOLD_MS holds nothing. PROMPT-TO-MINE, for who minted alone (MINTED, below): the burn of a tank that
// minted mines $WARM for its holder at its instant's rate, halving every six months from the opening; any other burn mines nothing. It is owed on the ledger, paid
// out by his hand, never minted here; when he names the mine's size (SPACE_ROUTER_MINE_WARM) mining stops at it. A refill mines nothing.
// His: the house's MiniRouter key (wrangler secret put SPACE_ROUTER_KEY), the opening's instant (SPACE_ROUTER_OPENED_AT; empty keeps the door shut), the
// oracle's key (SPACE_ROUTER_ORACLE_KEY, made by tools/space-router-oracle.mjs keygen; without it the door is shut: no oracle, no router), the anchor's
// address (SPACE_ROUTER_ANCHOR, public, shown by /oracle), the tanks and their pours (tools/space-router-tank.mjs), the migrations and the deploy.
import { sha256Hex } from '../app/dl-society-codes.mjs';
import { isHerCode } from '../app/dl-her-friends.mjs';
import { WISH_PATH, HELLO_PATH, APP_PATH, HER_KEY_DOMAIN, HER_PHONE_DOMAIN, bornData, phoneOf, onHouse, wishOf, windowsAt, helloData, wishData, codeOfDigest } from '../app/dl-her-wishes.mjs';
import { attestationOf, assertionOf, appsOf, rootsOf, sha256, b64url } from './app-attest.mjs';
import { androidAttestationOf, androidAssertionOf, androidAppsOf, statusOf, STATUS_URL } from './android-attest.mjs';   // ANDROID PROVES ITSELF
import { isTankKey, FIRST_HOLD_USD, FAIR_OF, USD_PER_WARM, charge, instantMs, warmMined, warmPerUsdAt, nextHalvingAt, split } from '../app/space-router-law.mjs';
import { ALG, PERIOD_MS, SEAL_AFTER_MS, canonical, hexOf, bytesOfHex, b64u, askOf, answerOf, cachedOf, receiptOf, oracleKey, signReceipt, leafOf, rootOf, proofOf,
  periodOf, hourOf, sealableAt, periodNamed, walkedOf } from '../app/space-router-oracle.mjs';
import { HANDLE, ITEM_ID } from '../app/tracenet-register.mjs';

export const PREFIX = '/space-router/v1';
export const CHAT_PATH = `${PREFIX}/chat/completions`, MODELS_PATH = `${PREFIX}/models`, TANK_PATH = `${PREFIX}/tank`, TRACENET_PATH = `${PREFIX}/tracenet`, MINE_PATH = `${PREFIX}/mine`;
export const ORACLE_PATH = `${PREFIX}/oracle`, ROOT_PATH = `${PREFIX}/oracle/root`, PROOF_PATH = `${PREFIX}/oracle/proof`;
export const AASA_PATH = '/.well-known/apple-app-site-association', ASSETLINKS_PATH = '/.well-known/assetlinks.json';
const PATHS = new Set([CHAT_PATH, MODELS_PATH, TANK_PATH, TRACENET_PATH, MINE_PATH, ORACLE_PATH, ROOT_PATH, PROOF_PATH, WISH_PATH, HELLO_PATH, APP_PATH, AASA_PATH, ASSETLINKS_PATH]);
export { WISH_PATH, HELLO_PATH, APP_PATH };   // ASSETLINKS_PATH is exported where it is declared
export const UPSTREAM = 'https://api.minirouter.sh/v1';
export const HOLD_MS = 15 * 60_000;          // longer than any answer the door waits for
export const UPSTREAM_MS = 10 * 60_000;
export const BODY_BYTES = 8 * 1024 * 1024;
export const SNOWTRACE = 'x-snowtrace', CARD_BYTES = 64 * 1024;   // the header that names a trail to walk, and the most a walked card is (a card is ~2 KB; a drop up to 25 MB is a trace)
export const CACHE_MS = 10 * 60_000;
export const PER_MINUTE = 600;               // asks a minute from one address, held by this isolate (a bound, not an account); the tank is the limit
const OPENS = 'Space Router opens with the $WARM sale.', SOON = 'Space Router is being prepared.';
// THE WISH IS A CALL: her words to a wish (the system's, the same for every wish), the most a wish says, asks and answers, and its door's own bound
export const SWARMY = 'You are the Lyssajudron, a creature of twelve pentagons that a visitor has just made and coloured; you can be called Swarmy. They have a few wishes, '
  + 'and this message is one of them. Grant it as well as words can: answer in at most 120 words, plainly and warmly, with no preamble. Never ask for money, keys or anything about who they are.';
export const WISH_TOKENS = 400, WISH_BYTES = 2048, HELLO_BYTES = 16 * 1024, ANSWER_CHARS = 4000, WISH_PER_MINUTE = 6, HELLO_PER_MINUTE = 12, DAY_MS = 86_400_000;
export const FUEL = 'Fuel me.';   // her cosmos scene's word (dl-lyssajudron.js COSMOS), when the house's wishes for a code are spent
const WISHES_SOON = 'Her wishes are being prepared.';
export const IN_APP = 'Her wishes are granted in DysonLight.';   // THE WISH IS IN THE APP: every word without the app's proof
const UNBORN = 'This key was never born: her hello attests it.', STALE = 'A proof of another window.';
const NO_CAP = 1e300;

// PROMPT-TO-MINE IS FOR WHO MINTED (his Nov 22 2026 14:08:14 UTC "prompt-2-mine with $WARM should not be possible unless people minted the lyssajudron"; the receipt:
// PROMPT-TO-MINE-IS-FOR-WHO-MINTED-LANDING.md): the tank ?1 holds a hexagon (one of its deposits, oldest first, took a place on the ball: a later one is fuel and takes none)
// or bought a tracenet. Migration 0029's two indexes bound the read. It is judged as a call is let in, with its hold, so what a prompt asked before the mint burns mines nothing.
export const MINTED = `COALESCE((SELECT 1 FROM (SELECT signature FROM sr_deposits WHERE tank = ?1 AND usd >= 1 ORDER BY paid_at LIMIT 365) AS p JOIN sr_drops AS d ON d.signature = p.signature LIMIT 1),
  (SELECT 1 FROM sr_ledger WHERE tank = ?1 AND kind = 'burn' AND why >= 'tracenet:' AND why < 'tracenet;' LIMIT 1), 0)`;
const PAYS = `(SELECT poured_usd - drunk_usd FROM sr_tanks WHERE name = ?3) - (SELECT COALESCE(SUM(usd), 0) FROM sr_holds WHERE tank = ?3 AND at > ?4) >= ?5 AND NOT EXISTS (SELECT 1 FROM sr_ledger WHERE tank = ?3 AND why = ?6)`;
const SQL = {
  tank: (p = '') => `SELECT name, markup_bps, poured_usd, drunk_usd, router_usd, calls, warm, warm_spent${p} FROM sr_tanks WHERE key_sha256 = ?1`,   // p: ', warm_back' where the mine is named (SPENT $WARM GOES BACK TO THE MINE, below)
  // A FLASK LETS ITS HARMONY SPEND (Nov 19 2026, worker/space-router-grant.mjs, migration 0024): a key that is no tank's own may be one a flask let spend. It opens
  // that flask's tank while it stands (not ended, before its end), and carries its cap a UTC day and what it drank this day (?3); a burn counts on it in the burn's batch
  granted: (p = '') => `SELECT t.name, t.markup_bps, t.poured_usd, t.drunk_usd, t.router_usd, t.calls, t.warm, t.warm_spent${p}, g.key_sha256 AS grant, g.label AS grant_label, g.cap_usd AS grant_cap, g.until AS grant_until,
    CASE WHEN g.day = ?3 THEN g.drunk_usd ELSE 0 END AS grant_drunk FROM sr_grants g JOIN sr_tanks t ON t.name = g.tank WHERE g.key_sha256 = ?1 AND g.ended_at IS NULL AND g.until > ?2`,
  grantDrink: 'UPDATE sr_grants SET drunk_usd = CASE WHEN day = ?3 THEN drunk_usd ELSE 0 END + ?2, day = ?3 WHERE key_sha256 = ?1',
  // THE HOLD, in one statement: the fair price (the last FAIR_OF exact drinks' mean, FIRST_HOLD_USD before the first) is held only while the tank's fuel
  // exceeds what its live holds hold, its $WARM counted as fuel at ?5 (THE COUNTER-TANK DRINKS; c, where the mine is named: warm_back). It names sr_receipts.burn, sr_ledger.tokens_cached, sr_tanks.warm_spent and the
  // mint's sr_drops: a database behind migration 0012, 0013, 0019, 0020 or 0031 (0032 where the mine is named) fails here, before anything is sent, and the door is shut, instead of answering calls it cannot write or judge
  hold: (c = 'warm - warm_spent') => `INSERT INTO sr_holds(tank, usd, at)
    SELECT ?1, COALESCE((SELECT AVG(usd) FROM (SELECT usd FROM sr_ledger WHERE tank = ?1 AND kind = 'burn' AND estimated IS NULL AND why IS NULL ORDER BY id DESC LIMIT ${FAIR_OF})), ?2), ?3
    WHERE (SELECT poured_usd - drunk_usd + (${c}) * ?5 FROM sr_tanks WHERE name = ?1) - (SELECT COALESCE(SUM(usd), 0) FROM sr_holds WHERE tank = ?1 AND at > ?4) > 0
      AND NOT EXISTS (SELECT burn FROM sr_receipts WHERE id = 0) AND NOT EXISTS (SELECT tokens_cached FROM sr_ledger WHERE id = 0)
    RETURNING id, usd, ${MINTED} AS minted`,
  release: 'DELETE FROM sr_holds WHERE id = ?1',
  // THE BURN, one batch (D1 runs a batch as one transaction): the mine's share first (capped by what is left of it), then the tank, the receipt, the hold
  mine: 'UPDATE sr_mine SET last = MIN(?1, MAX(0, ?2 - owed)), owed = owed + MIN(?1, MAX(0, ?2 - owed)) WHERE id = 1 RETURNING last', mined: 'SELECT owed FROM sr_mine WHERE id = 1',
  drink: (g = '') => `UPDATE sr_tanks SET drunk_usd = drunk_usd + ?1, router_usd = router_usd + ?2, calls = calls + 1, warm = warm + (SELECT last FROM sr_mine WHERE id = 1), warm_spent = warm_spent + ?4${g}
    WHERE name = ?3 RETURNING poured_usd - drunk_usd AS fuel, warm, warm_spent`,
  receipt: `INSERT INTO sr_ledger(at, kind, tank, usd, router_usd, markup_bps, warm, model, tokens_in, tokens_out, ms, estimated, tokens_cached, warm_spent)
    VALUES (?1, 'burn', ?2, ?3, ?4, ?5, (SELECT last FROM sr_mine WHERE id = 1), ?6, ?7, ?8, ?9, ?10, ?11, ?12)`,
  settle: 'DELETE FROM sr_holds WHERE id = ?1 OR at <= ?2',
  inFlight: `SELECT COUNT(*) AS n, ${MINTED} AS minted FROM sr_holds WHERE tank = ?1 AND at > ?2`,   // THE GOLD IS FOR WHO MINTED: /tank says whether the tank minted, by the word its calls mine by
  // THE ORACLE: the signed receipt, in the burn's batch; a period's leaves in the order they were written; its seal, written once
  oracle: 'INSERT INTO sr_receipts(period, at, tank, leaf, body, burn) VALUES (?1, ?2, ?3, ?4, ?5, (SELECT MAX(id) FROM sr_ledger WHERE tank = ?3 AND at = ?2))',   // THE MINE IS LIVE (migration 0031): the receipt names its burn, the ledger row this batch wrote just before it
  leaves: 'SELECT id, leaf FROM sr_receipts WHERE period = ?1 AND id <= ?2 ORDER BY id',
  seal: 'SELECT period, n, root, last_id, sealed_at FROM sr_seals WHERE period = ?1',
  sealWrite: 'INSERT OR IGNORE INTO sr_seals(period, n, root, last_id, sealed_at) VALUES (?1, ?2, ?3, ?4, ?5)',
  byLeaf: 'SELECT id, period, leaf, body FROM sr_receipts WHERE leaf = ?1 AND tank = ?2',
  // THE WISH IS IN THE APP (migration 0017_her_wishes.sql): the tank that pays by its name; her her in the app by its key (born once, its counter moved only up, by a
  // compare); her friends born in the app; THE CLAIM, in one statement: a row while the code has a wish left of the `granted` it is owed and the UTC day's wishes
  // (their burns, or the fair estimate of one in flight) leave room for one more under the ceiling; the burn writes its cost and leaf into it; a call that failed deletes it
  tankNamed: (p = '') => `SELECT name, markup_bps, poured_usd, drunk_usd, router_usd, calls, warm, warm_spent${p} FROM sr_tanks WHERE name = ?1`,
  app: 'SELECT key, code, app, pub, counter FROM her_apps WHERE key = ?1',
  byPhone: 'SELECT key FROM her_apps WHERE phone = ?1',   // ONE PHONE, ONE BIRTH (migration 0018): the her a phone's mark was born with
  rekeyed: 'UPDATE her_apps SET key = ?1, app = ?2, pub = ?3, counter = 0 WHERE phone = ?4',
  appByCode: 'SELECT code FROM her_apps WHERE code = ?1',
  born: 'INSERT INTO her_apps(key, code, app, pub, counter, friend, at, phone) VALUES (?1, ?2, ?3, ?4, 0, ?5, ?6, ?7) ON CONFLICT DO NOTHING',
  counted: 'UPDATE her_apps SET counter = ?1 WHERE key = ?2 AND counter < ?1',
  friends: 'SELECT COUNT(*) AS n FROM her_apps WHERE friend = ?1',
  wished: 'SELECT COUNT(*) AS n FROM her_wishes WHERE code = ?1',
  claim: `INSERT INTO her_wishes(code, at, usd) SELECT ?1, ?2, ?3
    WHERE (SELECT COUNT(*) FROM her_wishes WHERE code = ?1) < ?4 AND (SELECT COALESCE(SUM(usd), 0) FROM her_wishes WHERE at >= ?5) + ?3 <= ?6
    RETURNING id`,
  wishBurned: 'UPDATE her_wishes SET usd = ?1, leaf = ?2 WHERE id = ?3',
  unclaim: 'DELETE FROM her_wishes WHERE id = ?1',
  // A TRACENET IS BOUGHT FROM THE TANK, one batch: the mine's share, the burn row (why tracenet:<id>), the tank's dollars, each only while the tank's dollars beyond
  // its live holds pay the price and no row of that id stands; the tank drinks only the row written at this instant, so a retry of the id pays nothing again
  tracenetMine: `UPDATE sr_mine SET last = MIN(?1, MAX(0, ?2 - owed)), owed = owed + MIN(?1, MAX(0, ?2 - owed)) WHERE id = 1 AND ${PAYS}`,
  tracenetRow: `INSERT INTO sr_ledger(at, kind, tank, usd, router_usd, markup_bps, warm, model, why, warm_spent)
    SELECT ?7, 'burn', ?3, ?5, 0, 0, (SELECT last FROM sr_mine WHERE id = 1), 'tracenet', ?6, 0 WHERE ${PAYS}`,
  tracenetDrink: `UPDATE sr_tanks SET drunk_usd = drunk_usd + (SELECT usd FROM sr_ledger WHERE tank = ?1 AND why = ?2 AND at = ?3), warm = warm + (SELECT warm FROM sr_ledger WHERE tank = ?1 AND why = ?2 AND at = ?3)
    WHERE name = ?1 AND EXISTS (SELECT 1 FROM sr_ledger WHERE tank = ?1 AND why = ?2 AND at = ?3)`,
  tracenetPaid: 'SELECT id, at, usd, warm FROM sr_ledger WHERE tank = ?1 AND why = ?2', rider: "INSERT INTO sr_riders(tank, handle, traces, first_at, last_at) VALUES (?1, '', 0, ?2, ?2) ON CONFLICT(tank) DO NOTHING",   // THE RIDER STANDS ON THE META SWARM (Nov 24 2026, his 19:18:38 UTC "when claw-riders open up tracenets, they become eligible for snowtracers pantheon"): a tracenet opened registers its tank's claw rider, nothing minted (creators.mjs rides counts its traces after)
};

const num = (v) => (v === null || v === undefined || v === '' ? NaN : Number(v));
const text300 = (s) => String(s ?? '').replace(/\s+/g, ' ').slice(0, 300);
const enc = new TextEncoder();
const providerOf = (env) => { try { return new URL(env.SPACE_ROUTER_UPSTREAM || UPSTREAM).host; } catch { return 'unnamed'; } };
const LAST = Number.MAX_SAFE_INTEGER;

/** spaceRouterDoor({fetcher, clockMs, solUsd, vault, paid}) -> door(request, env, url): its Response for the paths above, else null (vault: the Worker's, tracenet-vault.mjs; paid(env): his deploy names the mine, the deposit door's onMine) */
export function spaceRouterDoor({ fetcher = fetch, clockMs = () => Date.now(), solUsd = null, vault = null, paid = () => false } = {}) {
  const asked = new Map(), P = (env) => (paid(env) ? ', warm_back' : ''), credit = (t) => t.warm_back ?? t.warm - t.warm_spent;   /* SPENT $WARM GOES BACK TO THE MINE (his press of Nov 23 2026 18:17:41 UTC, "Back to the mine": "One $WARM, the token: spending it as credits returns it, to be mined again"). Where his deploy names the mine, a tank's $WARM credit is what its flasks paid back into the mine's vault less what it drank of it (sr_tanks.warm_back, raised by the deposit door's count off each flask's record at finalized, migration 0032), never what the ledger says it mined (sr_tanks.warm, the router's account of what the chain mints to the flask) nor what it drank before: the hold counts it, the split drinks it after the dollars, the drink refuses to take it below nothing (a burn split from a tank another burn drank first is split again from the tank as it stands), and the part it paid mines nothing. With no mine named every statement and answer is as it was */
  let models = null;   // { at, body }: the upstream's models, read once a CACHE_MS
  const headers = (extra = {}) => ({ 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extra });
  const answer = (status, body, extra) => new Response(JSON.stringify(body), { status, headers: headers(extra) });
  // OpenAI's error shape, which every agent's client reads
  const refuse = (status, message, type, extra) => answer(status, { error: { message, type, code: null } }, extra);
  function limited(ip, now) {
    const recent = (asked.get(ip) || []).filter((t) => now - t < 60_000);
    if (recent.length >= PER_MINUTE) { asked.set(ip, recent); return true; }
    recent.push(now); asked.set(ip, recent);
    if (asked.size > 5000) for (const k of asked.keys()) { asked.delete(k); if (asked.size <= 4000) break; }
    return false;
  }
  async function words(request) {   // the call's body, at most BODY_BYTES; undefined past it
    const reader = request.body?.getReader(); if (!reader) return '';
    const dec = new TextDecoder(); let text = '', size = 0;
    for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > BODY_BYTES) { await reader.cancel(); return undefined; } text += dec.decode(value, { stream: true }); }
    return text + dec.decode();
  }
  function keyOf(request) {
    const bearer = (request.headers.get('authorization') || '').replace(/^Bearer\s+/i, '').trim(), xkey = (request.headers.get('x-api-key') || '').trim();
    return isTankKey(bearer) ? bearer : isTankKey(xkey) ? xkey : null;
  }
  async function tankOf(env, request) {
    const key = keyOf(request); if (!key) return null;
    const hash = await sha256Hex(key), now = clockMs();
    return (await env.DB.prepare(SQL.tank(P(env))).bind(hash).first()) ?? env.DB.prepare(SQL.granted(P(env))).bind(hash, now, dayOf(now)).first().catch(() => null);   // a database behind migration 0024 knows no grant: the key is no one's, as before
  }
  const dayOf = (ms) => Math.floor(ms / 86_400_000), spent = (tank) => refuse(429, `${tank.grant_label} has spent its $${tank.grant_cap} for today. Nothing was sent.`, 'insufficient_quota');
  const counts = (env, tank) => tank.grant ? (usd) => [env.DB.prepare(SQL.grantDrink).bind(tank.grant, usd, dayOf(clockMs()))] : null;   // a grant's key counts what it drinks, in the burn's own batch
  const NO_KEY = 'Use your Space Router key (sr_…) as the API key.';

  let oracle = null;   // { secret, signer }: the router's key, imported once an isolate; a key that does not import signs nothing and keeps the door shut
  async function oracleOf(env) {
    const secret = env.SPACE_ROUTER_ORACLE_KEY; if (!secret) return null;
    if (oracle?.secret !== secret) oracle = { secret, signer: await oracleKey(secret).catch(() => null) };
    return oracle.signer;
  }
  // THE SEAL: a period's root, computed once its hour is SEAL_AFTER_MS over and written once (INSERT OR IGNORE: two isolates sealing at once keep the
  // first); every later read is that row. The leaves are the period's receipts up to the seal's last id, so a receipt written later (none should be) is
  // outside it and said so. A period no receipt fell in writes nothing: its root is the empty tree's.
  async function sealOf(env, period, now) {
    if (now < sealableAt(period)) return null;
    let s = await env.DB.prepare(SQL.seal).bind(period).first();
    if (!s) {
      const rows = (await env.DB.prepare(SQL.leaves).bind(period, LAST).all()).results || [];
      if (!rows.length) return { period, n: 0, root: hexOf(await rootOf([])), last_id: 0, sealed_at: null };
      await env.DB.prepare(SQL.sealWrite).bind(period, rows.length, hexOf(await rootOf(rows.map((r) => bytesOfHex(r.leaf)))), rows.at(-1).id, now).run();
      s = await env.DB.prepare(SQL.seal).bind(period).first();
    }
    return s;
  }
  const notYet = (period) => refuse(409, `The hour ${hourOf(period)} is sealed at ${new Date(sealableAt(period)).toISOString()}.`, 'invalid_request_error');
  const sealed = (s, by) => ({ period: s.period, hour: hourOf(s.period), n: s.n, root: s.root, sealed_at: s.sealed_at === null ? null : new Date(s.sealed_at).toISOString(), by });

  async function upstreamCall(env, body) {   // the credit refusal's ladder (the purse door's, Sept 21 2026): a quarter less output at a time, floor 4096
    const base = (env.SPACE_ROUTER_UPSTREAM || UPSTREAM).replace(/\/+$/, '');
    let send = { ...body, stream: false }; delete send.stream_options;
    for (let tries = 0; ; tries++) {
      const r = await fetcher(`${base}/chat/completions`, { method: 'POST', headers: { authorization: `Bearer ${env.SPACE_ROUTER_KEY}`, 'content-type': 'application/json' },
        body: JSON.stringify(send), signal: AbortSignal.timeout(UPSTREAM_MS) });
      if (r.ok) return { r, j: await r.json() };
      const said = await r.text().catch(() => '');
      const cap = Number(send.max_tokens || send.max_completion_tokens || 0);
      if (r.status === 402 && /worst-case estimate/i.test(said) && cap > 4096 && tries < 3) {
        const to = Math.max(4096, Math.floor(cap / 4));
        send = { ...send, ...('max_tokens' in send ? { max_tokens: to } : {}), ...('max_completion_tokens' in send ? { max_completion_tokens: to } : {}) };
        continue;
      }
      return { r, said };
    }
  }

  function replay(j, model, extra) {   // one whole answer as chat.completion.chunk deltas (the purse door's streamChat)
    const msg = j?.choices?.[0]?.message || {}, enc = new TextEncoder(), out = [];
    const base = { id: j?.id || `chatcmpl-${crypto.randomUUID()}`, object: 'chat.completion.chunk', created: j?.created || Math.floor(clockMs() / 1000), model: j?.model || model };
    const chunk = (delta, finish_reason = null, more = {}) => out.push(`data: ${JSON.stringify({ ...base, choices: [{ index: 0, delta, finish_reason }], ...more })}\n\n`);
    chunk({ role: 'assistant', content: '' });
    const reasoning = typeof msg.reasoning_content === 'string' && msg.reasoning_content ? msg.reasoning_content : typeof msg.reasoning === 'string' ? msg.reasoning : '';
    if (reasoning) chunk({ reasoning_content: reasoning });
    if (typeof msg.content === 'string' && msg.content) chunk({ content: msg.content });
    (msg.tool_calls || []).forEach((tc, i) => {
      chunk({ tool_calls: [{ index: i, id: tc.id, type: 'function', function: { name: tc.function?.name, arguments: '' } }] });
      chunk({ tool_calls: [{ index: i, function: { arguments: tc.function?.arguments || '' } }] });
    });
    chunk({}, j?.choices?.[0]?.finish_reason || 'stop', j?.usage ? { usage: j.usage } : {});
    out.push('data: [DONE]\n\n');
    return new Response(enc.encode(out.join('')), { status: 200, headers: { 'content-type': 'text/event-stream', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', ...extra } });
  }

  // THE BURN, every call's road once its tank is known (a caller's by its key; a wish's, the house's own by its name): the hold, MiniRouter, the exact cost,
  // the signed receipt, one batch. more(usd, leaf): statements written in the burn's batch (a wish's row); mines false for a call that mines no $WARM (a wish:
  // the house pays its own tank); trail {walk, text}: the card the caller walks (trailOf), sent before its words and named in its receipt. -> {dry, fuel} when the
  // hold is refused (nothing sent); {refused} when MiniRouter did not answer it (nothing charged); else {j, told, usd, leaf, kept}: kept false when the burn could not be written (the answer goes back either way)
  async function burn(env, tank, body, signer, opened, now, { mines = true, more = null, trail = null } = {}) {
    const hold = await env.DB.prepare(SQL.hold(paid(env) ? 'warm_back' : undefined)).bind(tank.name, FIRST_HOLD_USD, now, now - HOLD_MS, USD_PER_WARM).first();
    if (!hold) return { dry: true, fuel: tank.poured_usd - tank.drunk_usd, warm: credit(tank) };
    const release = () => env.DB.prepare(SQL.release).bind(hold.id).run().catch(() => null);
    const t0 = clockMs();
    let up;
    try { up = await upstreamCall(env, trail ? walkedOf(body, trail.walk, trail.text) : body); }
    catch { await release(); return { refused: refuse(502, 'The router did not answer. Nothing was charged.', 'api_error') }; }
    const { r, j, said } = up;
    if (!r.ok) {
      await release();
      if (r.status === 401 || r.status === 402 || r.status === 403) return { refused: refuse(503, 'Space Router is refuelling. Nothing was charged.', 'api_error', { 'retry-after': '60' }) };   // the house's account, never the caller's
      let message = ''; try { message = JSON.parse(said)?.error?.message || ''; } catch { message = said; }
      const status = r.status >= 400 && r.status < 500 ? r.status : 502, retry = r.headers.get('retry-after');
      return { refused: refuse(status, `${text300(message) || `The router refused the call (${r.status}).`} Nothing was charged.`, status === 429 ? 'rate_limit_error' : status < 500 ? 'invalid_request_error' : 'api_error',
        retry === null ? {} : { 'retry-after': retry }) };
    }
    const cost = num(r.headers.get('x-minirouter-cost-usd') ?? j?.usage?.cost), known = Number.isFinite(cost) && cost >= 0;
    const usd = known ? charge(cost, tank.markup_bps) : +hold.usd.toFixed(9), at = clockMs();
    let { usd_fuel, warm_spent } = split(usd, tank.poured_usd - tank.drunk_usd, credit(tank)), warm = mines && hold.minted ? warmMined(usd_fuel, at, opened) : 0; const cap = Number.isFinite(num(env.SPACE_ROUTER_MINE_WARM)) ? num(env.SPACE_ROUTER_MINE_WARM) : NO_CAP;
    const u = j?.usage || {}, model = typeof j?.model === 'string' && j.model ? j.model.slice(0, 200) : body.model;
    const tokensIn = Number.isFinite(u.prompt_tokens) ? u.prompt_tokens : null, tokensOut = Number.isFinite(u.completion_tokens) ? u.completion_tokens : null, tokensCached = cachedOf(u);
    // THE ORACLE: what was asked of which model, what came back from which provider, and what it cost, signed; kept beside the burn, never the words
    const signed = await signReceipt(receiptOf({ at, tank: tank.name, asked_model: body.model, model: typeof j?.model === 'string' ? j.model.slice(0, 200) : null,
      provider: providerOf(env), ask: await askOf(body), answer: await answerOf(j), usd, router_usd: known ? cost : null, tokens_in: tokensIn, tokens_out: tokensOut,
      tokens_cached: tokensCached, walk: trail?.walk }), signer);
    const kept = canonical(signed), leaf = hexOf(await leafOf(signed));
    let mined = null, fuel = null;
    for (let tries = 0; tries < 2 && mined === null; tries++) {   // a burn that cannot be written is tried once more (where the mine is named, split again from the tank as it stands then); the answer goes back either way
      try {
        if (tries && paid(env)) { tank = { ...tank, ...await env.DB.prepare(SQL.tankNamed(P(env))).bind(tank.name).first() }; ({ usd_fuel, warm_spent } = split(usd, tank.poured_usd - tank.drunk_usd, credit(tank))); warm = mines && hold.minted ? warmMined(usd_fuel, at, opened) : 0; }
        const [m, d] = await env.DB.batch([
          env.DB.prepare(SQL.mine).bind(warm, cap),
          env.DB.prepare(SQL.drink(paid(env) ? ', warm_back = CASE WHEN warm_back - ?4 >= -5e-10 THEN MAX(0, warm_back - ?4) END, warm_drunk = warm_drunk + ?4' : undefined)).bind(usd_fuel, known ? cost : 0, tank.name, warm_spent),
          env.DB.prepare(SQL.receipt).bind(at, tank.name, usd, known ? cost : null, tank.markup_bps, model, tokensIn, tokensOut, Math.max(0, at - t0), known ? null : 1, tokensCached, warm_spent),
          env.DB.prepare(SQL.oracle).bind(periodOf(at), at, tank.name, leaf, kept),
          env.DB.prepare(SQL.settle).bind(hold.id, at - HOLD_MS),
          ...(more ? more(usd, leaf) : []),
        ]);
        mined = Number(m?.results?.[0]?.last) || 0; fuel = Number(d?.results?.[0]?.fuel);
      } catch { /* once more */ }
    }
    // the receipt goes back only when it was kept: a receipt the door could not write would prove nothing
    const told = { 'x-space-router-usd': String(usd), ...(trail ? { 'x-space-router-walk': `${trail.walk.tracenet}/${trail.walk.card}` } : {}), ...(mined === null ? {} : { 'x-space-router-warm': String(+mined.toFixed(9)), 'x-space-router-warm-spent': String(warm_spent), 'x-space-router-fuel-usd': String(+fuel.toFixed(9)),
      'x-space-router-receipt': b64u(enc.encode(kept)) }) };
    return { j, told, usd, leaf, kept: mined !== null };
  }

  // THE WISH IS IN THE APP (Nov 1 2026; his words: THE-WISH-IS-IN-THE-APP-LANDING.md; the law: app/dl-her-wishes.mjs): her wish, one call on the house's own tank,
  // granted under DysonLight's own key alone. Open only while he names the tank that pays
  // (SPACE_ROUTER_WISH_TANK, his pour: tools/space-router-tank.mjs), the model a wish asks (SPACE_ROUTER_WISH_MODEL), the most the wishes drink in a UTC day
  // (SPACE_ROUTER_WISH_USD_DAY), the apps that may wish (SPACE_ROUTER_WISH_APPS) and Apple's root (SPACE_ROUTER_WISH_ROOT), beside the house's key and the oracle's;
  // the router's opening does not gate it (the house pays its own tank before the sale, as a sponsor does). The key is made by Apple's App Attest in the phone,
  // inside the app, and vouched for by Apple (app-attest.mjs): its first word is her birth (her code drawn from the key, the friend whose link brought her when
  // that friend is an app's her too), every later word an assertion whose counter only goes up, so no word is said twice. A code is owed onHouse(friends): her
  // three and one a friend born in the app from her links. The claim is one statement (her_wishes); the burn writes its cost and leaf into the row; a call that
  // failed deletes it, so nothing was spent. A wish mines nothing, and its words are never kept: its receipt holds their sha256, as every call's does.
  const bounds = new Map();
  function bound(what, ip, now, most) {   // at most `most` asks a minute of one kind from one address, held by this isolate (a bound, not an account; the day's ceiling is the account)
    const k = `${what} ${ip}`, recent = (bounds.get(k) || []).filter((t) => now - t < 60_000);
    if (recent.length >= most) { bounds.set(k, recent); return true; }
    recent.push(now); bounds.set(k, recent);
    if (bounds.size > 5000) for (const x of bounds.keys()) { bounds.delete(x); if (bounds.size <= 4000) break; }
    return false;
  }
  const ipOf = (request) => request.headers.get('cf-connecting-ip') || 'here';
  const storeOf = (env, name = 'SPACE_ROUTER_WISH_STORE') => { try { const u = new URL(String(env[name] || '')); return u.protocol === 'https:' ? u.href : null; } catch { return null; } };
  let roots = null;   // {pem, list}: Apple's root as his hand placed it, read once an isolate
  async function wishOpen(env) {   // -> {signer, tank, model, day, apps, roots, store} while every word of his stands, else null
    const name = typeof env.SPACE_ROUTER_WISH_TANK === 'string' ? env.SPACE_ROUTER_WISH_TANK.trim() : '', model = typeof env.SPACE_ROUTER_WISH_MODEL === 'string' ? env.SPACE_ROUTER_WISH_MODEL.trim() : '';
    const day = num(env.SPACE_ROUTER_WISH_USD_DAY), apps = [...appsOf(env.SPACE_ROUTER_WISH_APPS), ...androidAppsOf(env.SPACE_ROUTER_WISH_APPS)], pem = String(env.SPACE_ROUTER_WISH_ROOT ?? '');
    if (roots?.pem !== pem) roots = { pem, list: rootsOf(pem) };
    if (!name || !model || !(day > 0) || !apps.length || !roots.list.length || !env.SPACE_ROUTER_KEY) return null;
    const signer = await oracleOf(env); if (!signer) return null;
    const tank = await env.DB.prepare(SQL.tankNamed(P(env))).bind(name).first(); if (!tank) return null;
    return { signer, tank, model: model.slice(0, 200), day, apps, roots: roots.list, store: storeOf(env), play: storeOf(env, 'SPACE_ROUTER_WISH_PLAY') };
  }
  let status = null;   // Google's revocation list, read at an Android key's first word at most once an hour (its own cache: a day): {at, revoked}
  async function revokedNow(now) {   // -> the Set of revoked serials, or null when it cannot be read (then no Android key is born: fail closed)
    if (status && now - status.at < 3_600_000) return status.revoked;
    try {
      const r = await fetcher(STATUS_URL, { headers: { accept: 'application/json' }, cf: { cacheTtl: 3600, cacheEverything: true }, signal: AbortSignal.timeout(8000) });
      const revoked = r?.ok ? statusOf(await r.json()) : null; if (revoked) status = { at: now, revoked }; return revoked ?? status?.revoked ?? null;
    } catch { return status?.revoked ?? null; }
  }
  const android = (row) => typeof row?.app === 'string' && row.app.startsWith('android:');
  async function wishesOf(env, code) {   // the code's wishes: owed by the house, used, left
    const [f, w] = await Promise.all([env.DB.prepare(SQL.friends).bind(code).first(), env.DB.prepare(SQL.wished).bind(code).first()]);
    const granted = onHouse(Number(f?.n) || 0), used = Number(w?.n) || 0;
    return { granted, used, left: Math.max(0, granted - used) };
  }
  async function proofOfApp(request, most) {   // a word of her page in the app: JSON from its own origin (or none: the app itself), at most `most` bytes -> the object, or a Response refusing it
    const origin = request.headers.get('origin');
    if (!request.headers.get('content-type')?.startsWith('application/json') || (origin !== null && origin !== new URL(request.url).origin)) return refuse(403, IN_APP, 'invalid_request_error');
    const reader = request.body?.getReader(), dec = new TextDecoder(); let text = '', size = 0;
    if (reader) for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > most) { await reader.cancel(); return refuse(413, 'Too long.', 'invalid_request_error'); } text += dec.decode(value, { stream: true }); }
    text += dec.decode();
    let o = null; try { o = JSON.parse(text); } catch { /* below */ }
    if (!o || typeof o !== 'object' || Array.isArray(o) || typeof o.key !== 'string' || !o.key) return refuse(403, IN_APP, 'invalid_request_error');
    return o;
  }
  async function keyed(env, o, said, data) {   // an assertion over `data` by a key born before: the key's row once its counter moved up, else a Response refusing it
    const row = await env.DB.prepare(SQL.app).bind(said.key).first();
    if (!row) return refuse(409, UNBORN, 'invalid_request_error');   // her page forgets the key, and her hello attests a new one
    if (!o.apps.some((a) => a.appId === row.app)) return refuse(403, `${IN_APP} (this app is no longer named)`, 'invalid_request_error');
    const v = await (android(row) ? androidAssertionOf : assertionOf)({ assertion: said.assertion, clientDataHash: await sha256(data), known: row });
    if (!v.ok) return refuse(403, `${IN_APP} (${v.why})`, 'invalid_request_error');
    const moved = await env.DB.prepare(SQL.counted).bind(v.counter, said.key).run();
    if (!((moved?.meta?.changes ?? 0) > 0)) return refuse(403, `${IN_APP} (the assertion's counter did not advance)`, 'invalid_request_error');   // two at once: the first one counts
    return { ...row, counter: v.counter };
  }
  async function hello(request, env, now) {   // her her in the app: born at her key's first word, asked again at every open after
    if (bound('hello', ipOf(request), now, HELLO_PER_MINUTE)) return refuse(429, 'Too many asks. Wait a minute.', 'rate_limit_error', { 'retry-after': '60' });
    const o = await wishOpen(env); if (!o) return refuse(503, WISHES_SOON, 'api_error');
    const said = await proofOfApp(request, HELLO_BYTES); if (said instanceof Response) return said;
    if (!windowsAt(now).includes(said.window)) return refuse(403, STALE, 'invalid_request_error');
    const friend = isHerCode(said.friend) ? said.friend : null, data = helloData(said.window, friend);
    let row;
    if (said.attestation !== undefined) {
      const phone = phoneOf(said.phone); if (!phone) return refuse(403, `${IN_APP} (the key's first word carries no phone's mark)`, 'invalid_request_error');
      const hash = await sha256(bornData(data, phone)), droid = said.platform === 'android';
      const v = droid ? await androidAttestationOf({ chain: said.attestation, clientDataHash: hash, key: said.key, apps: o.apps, roots: o.roots, revoked: await revokedNow(now), now })
        : await attestationOf({ attestation: said.attestation, clientDataHash: hash, key: said.key, apps: o.apps, roots: o.roots, now });
      if (!v.ok) return refuse(v.why === "Google's revocation list could not be read" ? 503 : 403, `${IN_APP} (${v.why})`, v.why === "Google's revocation list could not be read" ? 'api_error' : 'invalid_request_error');
      row = await env.DB.prepare(SQL.app).bind(said.key).first();
      if (!row) {
        const mark = b64url(await sha256(`${HER_PHONE_DOMAIN}\n${phone}`));
        if (await env.DB.prepare(SQL.byPhone).bind(mark).first()) await env.DB.prepare(SQL.rekeyed).bind(said.key, v.device.app, v.device.pub, mark).run();   // ONE PHONE, ONE BIRTH: her back, no new three
        else {
          const code = codeOfDigest(await sha256(`${HER_KEY_DOMAIN}\n${said.key}`));
          const by = friend && friend !== code && (await env.DB.prepare(SQL.appByCode).bind(friend).first()) ? friend : null;   // a friend counts when the link was an app's her
          await env.DB.prepare(SQL.born).bind(said.key, code, v.device.app, v.device.pub, by, now, mark).run();
        }
        row = await env.DB.prepare(SQL.app).bind(said.key).first();
        if (!row) return refuse(409, 'Two births at once: ask again.', 'invalid_request_error');
      }
    } else {
      row = await keyed(env, o, said, data); if (row instanceof Response) return row;
    }
    return answer(200, { code: row.code, wishes: await wishesOf(env, row.code) });
  }
  async function wish(request, env, now) {
    if (request.method === 'GET') { const o = await wishOpen(env); return answer(200, o ? { open: true, store: o.store, play: o.play } : { open: false }); }
    if (bound('wish', ipOf(request), now, WISH_PER_MINUTE)) return refuse(429, 'Too many wishes. Wait a minute.', 'rate_limit_error', { 'retry-after': '60' });
    const o = await wishOpen(env); if (!o) return refuse(503, WISHES_SOON, 'api_error');
    const said = await proofOfApp(request, WISH_BYTES); if (said instanceof Response) return said;
    if (!windowsAt(now).includes(said.window)) return refuse(403, STALE, 'invalid_request_error');
    const words = wishOf(said.wish); if (typeof said.wish !== 'string' || !words) return refuse(400, 'Say your wish.', 'invalid_request_error');
    const row = await keyed(env, o, said, wishData(said.window, said.wish)); if (row instanceof Response) return row;
    const code = row.code, owed = onHouse(Number((await env.DB.prepare(SQL.friends).bind(code).first())?.n) || 0), day = now - (now % DAY_MS);
    const claim = await env.DB.prepare(SQL.claim).bind(code, now, FIRST_HOLD_USD, owed, day, o.day).first();
    if (!claim) {
      const w = await wishesOf(env, code);
      if (w.left <= 0) return answer(402, { error: { message: FUEL, type: 'insufficient_quota', code: null }, wishes: w });
      return refuse(503, 'She sleeps until tomorrow: today\'s wishes are granted.', 'api_error', { 'retry-after': String(Math.ceil((day + DAY_MS - now) / 1000)) });
    }
    const unclaim = () => env.DB.prepare(SQL.unclaim).bind(claim.id).run().catch(() => null);
    const body = { model: o.model, messages: [{ role: 'system', content: SWARMY }, { role: 'user', content: words }], max_tokens: WISH_TOKENS };
    let b; try { b = await burn(env, o.tank, body, o.signer, null, now, { mines: false, more: (usd, leaf) => [env.DB.prepare(SQL.wishBurned).bind(usd, leaf, claim.id)] }); }
    catch (e) { await unclaim(); throw e; }
    if (b.dry) { await unclaim(); return refuse(503, 'She sleeps: the house\'s tank is dry. Nothing was spent.', 'api_error', { 'retry-after': '3600' }); }
    if (b.refused) { await unclaim(); return b.refused; }
    const content = b.j?.choices?.[0]?.message?.content;
    return answer(200, { answer: typeof content === 'string' ? content.slice(0, ANSWER_CHARS) : '', wishes: await wishesOf(env, code) }, b.told);
  }
  function appLinks(path, env, url, request) {   // the app's door on the web: the apps iOS and Android open on /wish, and a browser's /wish sent on to the app in its store (else her page)
    if (path === ASSETLINKS_PATH) {
      const apps = androidAppsOf(env.SPACE_ROUTER_WISH_APPS); if (!apps.length) return refuse(404, 'No app is named.', 'invalid_request_error');
      return new Response(JSON.stringify(apps.map((a) => ({ relation: ['delegate_permission/common.handle_all_urls'], target: { namespace: 'android_app', package_name: a.package,
        sha256_cert_fingerprints: [a.digest.toUpperCase().match(/../g).join(':')] } }))), { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=3600', 'x-content-type-options': 'nosniff' } });
    }
    if (path === AASA_PATH) {
      const apps = appsOf(env.SPACE_ROUTER_WISH_APPS); if (!apps.length) return refuse(404, 'No app is named.', 'invalid_request_error');
      return new Response(JSON.stringify({ applinks: { details: [{ appIDs: [...new Set(apps.map((a) => a.appId))], components: [{ '/': `${APP_PATH}*` }] }] } }),
        { status: 200, headers: { 'content-type': 'application/json', 'cache-control': 'public, max-age=3600', 'x-content-type-options': 'nosniff' } });
    }
    const droid = /\bAndroid\b/.test(request.headers.get('user-agent') || '');   // the store of the phone that asks: Google Play on Android, the App Store else
    return new Response(null, { status: 302, headers: { location: storeOf(env, droid ? 'SPACE_ROUTER_WISH_PLAY' : 'SPACE_ROUTER_WISH_STORE') || new URL('/?her', url).href, 'cache-control': 'no-store', vary: 'user-agent' } });
  }

  // THE NAMED WALK ON THE DOOR (Nov 4 2026; the design: ec-workspace docs/the-router-walks-the-trail-design-2026-10-30.md 3.2, 4a and 5; his Oct 30 06:16 UTC word
  // makes the walk free: no toll, the receipt is the proof). x-snowtrace: <tracenet>/<card> names a tracenet's drop; the vault's own gate reads it with the caller's own
  // headers (its tank's key, a seat proof, a subscription: the tier law of app/tracenet-register.mjs), so nothing new decides who may read what. -> null with no header,
  // {walk: {tracenet, card, sha256 of the bytes walked}, text}, or a Response refusing it before anything is held or sent upstream
  async function trailOf(request, env) {
    const named = request.headers.get(SNOWTRACE); if (named === null) return null;
    const [tracenet = '', card = '', more] = named.trim().split('/'), trail = `The trail ${tracenet}/${card}`;
    if (more !== undefined || !HANDLE.test(tracenet) || !ITEM_ID.test(card)) return refuse(400, `Name the trail to walk as ${SNOWTRACE}: <tracenet>/<card>. Nothing was sent.`, 'invalid_request_error');
    if (!vault) return refuse(503, SOON, 'api_error'); const r = await vault(new Request(request.url, { headers: request.headers }), env, { handle: tracenet, id: card });
    if (r.status === 402) return refuse(403, `${trail} is not yours to walk yet: ${text300((await r.json().catch(() => null))?.error)} Nothing was sent.`, 'invalid_request_error');
    if (!r.ok) return refuse(404, `${trail} is not in the vault. Nothing was sent.`, 'invalid_request_error');
    const bytes = new Uint8Array(await r.arrayBuffer()), long = bytes.length > CARD_BYTES; let text = null; try { text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { /* below */ }
    if (long || text === null) return refuse(long ? 413 : 415, `${trail} ${long ? `is ${bytes.length} bytes; a walked card is at most ${CARD_BYTES}` : 'is not text'}. Nothing was sent.`, 'invalid_request_error');
    return { walk: { tracenet, card, sha256: hexOf(await sha256(bytes)) }, text };
  }

  async function chat(request, env, now, opened) {
    const signer = env.SPACE_ROUTER_KEY ? await oracleOf(env) : null;
    if (!signer) return refuse(503, SOON, 'api_error');
    if (opened === null || now < opened) return refuse(503, OPENS, 'api_error');   // before the opening a tank's fuel waits: a pre-deposit
    const tank = await tankOf(env, request);
    if (!tank) return refuse(401, NO_KEY, 'authentication_error');
    const text = await words(request);
    if (text === undefined) return refuse(413, 'The call is too long for Space Router.', 'invalid_request_error');
    let body = null; try { body = JSON.parse(text); } catch { /* below */ }
    if (!body || typeof body !== 'object' || typeof body.model !== 'string' || !body.model || body.model.length > 200 || !Array.isArray(body.messages) || !body.messages.length)
      return refuse(400, 'Send a chat call: a model and its messages.', 'invalid_request_error');
    if (tank.grant && tank.grant_drunk >= tank.grant_cap) return spent(tank);
    const trail = await trailOf(request, env); if (trail instanceof Response) return trail;
    const b = await burn(env, tank, body, signer, opened, now, { trail, more: counts(env, tank) });
    if (b.dry) return refuse(402, b.fuel <= 0 ? `Your tank is empty ($${b.fuel.toFixed(6)}, ${b.warm.toFixed(6)} $WARM). Refuel it; nothing was sent.` : `Your calls in flight hold all of your tank's $${b.fuel.toFixed(6)}; nothing was sent.`, 'insufficient_quota');
    if (b.refused) return b.refused;
    return body.stream === true ? replay(b.j, body.model, b.told) : answer(200, b.j, b.told);
  }

  // A TRACENET IS BOUGHT FROM THE TANK (Nov 3 2026, his "Charge the tank", then "0.1 sol", over Harmony's Tracenet tab; the lineage: ec-workspace docs/paying-for-a-
  // tracenet-hypertrace-2026-11-02.md). The price is in SOL, SPACE_ROUTER_TRACENET_SOL (his 0.1, in the Worker's vars; none named, the door is shut), and the tank
  // holds dollars (his Oct 14 "of course it is USDC as credits"), so it is charged at SOL's dollar price at the instant: the mint's own read (premint.mjs price,
  // Coinbase's spot), kept a minute by this isolate. GET says both. POST {id} with the tank's key takes the dollars from the tank as one burn row. A TRACENET IS A
  // MINT (MINTED): its own dollars mine $WARM at their instant's rate, as he was told on Nov 3, and the tank's calls mine from then on. The same
  // id asked again answers the same row, so a retry never pays twice. No call goes upstream, so there is no oracle receipt: the ledger row is the receipt. The
  // fair hold of calls never counts it (the hold reads rows with no why).
  let rate = null;   // { at, usd }: SOL's dollar price, read once a minute
  async function solNow(now) { if (!rate || now - rate.at > 60_000) { const usd = num(solUsd ? await solUsd() : NaN); if (!(usd > 0)) return null; rate = { at: now, usd }; } return rate.usd; }
  async function tracenet(request, env, now, opened) {
    const sol = num(env.SPACE_ROUTER_TRACENET_SOL); if (!(sol > 0 && sol <= 100)) return refuse(503, 'A tracenet\'s price is not named yet.', 'api_error');
    const per = await solNow(now).catch(() => null); if (!per) return refuse(503, 'A live SOL price is unavailable. Try again; nothing was taken.', 'api_error');
    const price = Math.max(0.01, +(sol * per).toFixed(2));
    if (request.method === 'GET') return answer(200, { sol, usd: price, sol_usd: per });
    const tank = await tankOf(env, request); if (!tank) return refuse(401, NO_KEY, 'authentication_error');
    if (tank.grant && tank.grant_drunk + price > tank.grant_cap) return spent(tank);
    let id = null; try { id = JSON.parse(await words(request) || 'null')?.id; } catch { id = null; }
    if (typeof id !== 'string' || !/^[0-9a-f]{32}$/.test(id)) return refuse(400, 'Name the tracenet\'s id: 32 hex digits, drawn once a press.', 'invalid_request_error');
    const why = `tracenet:${id}`, cap = Number.isFinite(num(env.SPACE_ROUTER_MINE_WARM)) ? num(env.SPACE_ROUTER_MINE_WARM) : NO_CAP, pays = [warmMined(price, now, opened), cap, tank.name, now - HOLD_MS, price, why];
    await env.DB.batch([env.DB.prepare(SQL.tracenetMine).bind(...pays), env.DB.prepare(SQL.tracenetRow).bind(...pays, now), env.DB.prepare(SQL.tracenetDrink).bind(tank.name, why, now)]);
    const row = await env.DB.prepare(SQL.tracenetPaid).bind(tank.name, why).first(), t = await env.DB.prepare(SQL.tankNamed()).bind(tank.name).first(), fuel = t.poured_usd - t.drunk_usd;
    if (tank.grant && row?.at === now) await env.DB.prepare(SQL.grantDrink).bind(tank.grant, row.usd, dayOf(now)).run(); if (row) await env.DB.prepare(SQL.rider).bind(tank.name, row.at).run().catch(() => {});
    if (!row) return refuse(402, `Your tank holds $${fuel.toFixed(2)}; a tracenet is ${sol} SOL, $${price.toFixed(2)} now. Fill it; nothing was taken.`, 'insufficient_quota');
    return answer(row.at === now ? 201 : 200, { id, receipt: row.id, sol, usd: row.usd, sol_usd: per, warm: +row.warm.toFixed(9), at: new Date(row.at).toISOString(), fuel_usd: +fuel.toFixed(9) });
  }

  return async function door(request, env, url) {
    const path = url.pathname;
    if (!PATHS.has(path)) return null;
    const method = path === CHAT_PATH || path === HELLO_PATH || ((path === WISH_PATH || path === TRACENET_PATH) && request.method === 'POST') ? 'POST' : 'GET';
    const link = path === APP_PATH || path === AASA_PATH || path === ASSETLINKS_PATH;
    if (request.method !== method && !(method === 'GET' && request.method === 'HEAD' && link)) return refuse(405, `Ask with ${method}.`, 'invalid_request_error', { allow: method });
    if (link) return appLinks(path, env, url, request);
    const now = clockMs();
    if (limited(request.headers.get('cf-connecting-ip') || 'here', now)) return refuse(429, 'Too many asks. Wait a minute.', 'rate_limit_error', { 'retry-after': '60' });
    if (!env.DB) return refuse(503, SOON, 'api_error');
    const opened = instantMs(env.SPACE_ROUTER_OPENED_AT);
    try {
      if (path === WISH_PATH) return await wish(request, env, now);
      if (path === HELLO_PATH) return await hello(request, env, now);
      if (path === CHAT_PATH) return await chat(request, env, now, opened);
      if (path === TRACENET_PATH) return await tracenet(request, env, now, opened);
      if (path === MINE_PATH) { const m = await env.DB.prepare(SQL.mined).first(), next = nextHalvingAt(now, opened); return answer(200, { schema: 'embertide.space-router-mine/1', mined: +(Number(m?.owed) || 0).toFixed(9), rate_now: warmPerUsdAt(now, opened), usd_per_warm: USD_PER_WARM, opened_at: opened === null ? null : new Date(opened).toISOString(), next_halving_at: next === null ? null : new Date(next).toISOString() }); }   /* THE MINE'S SUM IS PUBLIC (Nov 11 2026, his "let's focus on these" over "Nothing on that page mints or stakes; it states the rules"): what every burn has mined so far, the rate at this instant and the next halving, for anyone, with no key; never a tank, a name or a dollar */
      if (path === ORACLE_PATH || path === ROOT_PATH || path === PROOF_PATH) {
        const signer = await oracleOf(env);
        if (!signer) return refuse(503, SOON, 'api_error');
        if (path === ORACLE_PATH) return answer(200, { schema: 'embertide.space-router-oracle/1', alg: ALG, key: signer.publicHex, period_ms: PERIOD_MS, seal_after_ms: SEAL_AFTER_MS,
          tree: 'RFC 9162, SHA-256: a leaf SHA-256(0x00 || the canonical signed receipt), a node SHA-256(0x01 || left || right)', anchor: env.SPACE_ROUTER_ANCHOR || null });
        if (path === ROOT_PATH) {
          const period = periodNamed(url.searchParams.get('period'));
          if (period === null) return refuse(400, 'Name the period: its number or its UTC hour (2026-10-30T05Z).', 'invalid_request_error');
          const s = await sealOf(env, period, now);
          return s ? answer(200, sealed(s, signer.publicHex)) : notYet(period);
        }
        const tank = await tankOf(env, request);
        if (!tank) return refuse(401, NO_KEY, 'authentication_error');
        const leaf = url.searchParams.get('receipt') || '';
        if (!/^[0-9a-f]{64}$/.test(leaf)) return refuse(400, 'Name the receipt by its leaf: 64 hex digits.', 'invalid_request_error');
        const row = await env.DB.prepare(SQL.byLeaf).bind(leaf, tank.name).first();
        if (!row) return refuse(404, 'This tank holds no receipt of that leaf.', 'invalid_request_error');
        const s = await sealOf(env, row.period, now);
        if (!s) return notYet(row.period);
        const leaves = ((await env.DB.prepare(SQL.leaves).bind(row.period, s.last_id).all()).results || []).map((r) => r.leaf), index = leaves.indexOf(leaf);
        if (index < 0) return refuse(409, `This receipt was written after the hour ${hourOf(row.period)} was sealed; no root holds it.`, 'api_error');
        const proof = await proofOf(leaves.map(bytesOfHex), index);
        return answer(200, { receipt: JSON.parse(row.body), leaf, index, ...sealed(s, signer.publicHex), proof: proof.map(hexOf) });
      }
      const tank = await tankOf(env, request);
      if (!tank) return refuse(401, NO_KEY, 'authentication_error');
      if (path === TANK_PATH) {
        const live = await env.DB.prepare(SQL.inFlight).bind(tank.name, now - HOLD_MS).first(), next = nextHalvingAt(now, opened);
        return answer(200, { tank: tank.name, minted: Boolean(live?.minted), fuel_usd: +(tank.poured_usd - tank.drunk_usd).toFixed(9), poured_usd: +tank.poured_usd.toFixed(9), burned_usd: +tank.drunk_usd.toFixed(9),
          calls: tank.calls, in_flight: Number(live?.n) || 0, warm_mined: +tank.warm.toFixed(9), warm_spent: +tank.warm_spent.toFixed(9), warm_balance: +credit(tank).toFixed(9), usd_per_warm: USD_PER_WARM, rate_now: warmPerUsdAt(now, opened),
          opened_at: opened === null ? null : new Date(opened).toISOString(), next_halving_at: next === null ? null : new Date(next).toISOString(),
          ...(tank.grant ? { grant: { label: tank.grant_label, cap_usd: tank.grant_cap, spent_today_usd: +tank.grant_drunk.toFixed(9), until: new Date(tank.grant_until).toISOString() } } : {}) });
      }
      if (!env.SPACE_ROUTER_KEY) return refuse(503, SOON, 'api_error');
      if (!models || now - models.at > CACHE_MS) {
        const base = (env.SPACE_ROUTER_UPSTREAM || UPSTREAM).replace(/\/+$/, '');
        const r = await fetcher(`${base}/models`, { headers: { authorization: `Bearer ${env.SPACE_ROUTER_KEY}` }, signal: AbortSignal.timeout(15_000) }).catch(() => null);
        if (!r?.ok) return refuse(502, 'The router did not list its models. Try again.', 'api_error');
        models = { at: now, body: await r.json() };
      }
      return answer(200, models.body);
    } catch (e) {
      return /no such (table|column)/i.test(String(e?.message ?? e)) ? refuse(503, SOON, 'api_error') : refuse(500, 'Try again.', 'api_error');   // a database behind a migration
    }
  };
}

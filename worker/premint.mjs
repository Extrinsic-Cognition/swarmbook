import { PAYEE, GENESIS, TIERS, TERMS, tankOf, buyerAddress, quoteLamports, orderMemo, validateSignedPayment, validateFinalizedPayment, base64, encode58, decode58, paymentMessage } from '../app/dl-direct-protocol.mjs';
import { goldDoors, goldOrder } from './gold.mjs';
import { bronzeDoors } from './bronze.mjs';   // BRONZE IS A SUBSCRIPTION: the card road (Stripe), app/tracenet-bronze.mjs
import { creatorDoors, creatorOf, payeeOf, frontDoor } from './creators.mjs';   // TRACENET IS FOR EVERY CREATOR: the payee per creator, registers in D1, drops in R2
import { connectDoors } from './connect.mjs';   // a creator's optional card road (Stripe Connect, destination charges, the tank's 30 %)
import { FIRST_TRACENET } from '../app/tracenet-register.mjs';   // THE GOLD MONTH IS A SEALED BID (app/dl-gold-bid.mjs): its three doors and a winner's lamports
import { twitterName, validateAvatarURL } from '../app/dl-holder-profiles.js';
import { createVault, seatOf, paidRow } from './tracenet-vault.mjs';
import { MEDIA, MEDIA_BYTES, mediaFromR2 } from './ranges.mjs';   // THE FILMS FROM R2: a film's range cut by R2 itself (206), the skip to the mint seeks; THE FILM BY ITS BYTES: asked by the bytes the build names
import { CHAIRS, CHAIR_RANK, CHAIR_SHOWS, RANKS, rankDonors } from '../app/mint-chairs.mjs';
import { LAUNCH_DAY, MINT_CLOSES, mintState } from '../app/dl-paywall.js';   // AFTER THE MINT: / opens on the page after the $WARM window once it has closed
import { REFERRAL_SCHEMA } from '../vendor/embertide-app/ui/intro/room/society-referrals.mjs';
import { TICKET_SCHEMA, REFERRAL_LENGTH, CLAIM_LENGTH, normalizeCode, randomCode, shareURL, claimURL, sha256Hex } from '../app/dl-society-codes.mjs';
import { INSTALL_PATH, INSTALL_EVENTS, VIA, isVisitId, ATHENA_STATES } from '../app/harmony-link.mjs';   // THE LINK: the page's and Harmony's one contract
import { spaceRouterDoor, APP_PATH, AASA_PATH, ASSETLINKS_PATH } from './space-router.mjs';   // THE WISH IS IN THE APP: /wish and the apps' link files are the router's too
import { depositDoor, DEPOSIT_PATH, DROPS_PATH } from './space-router-deposit.mjs';   // PAY A TANK: a buyer's USDC deposit, read on chain, fills their own tank (migration 0015)
import { portraitDoor, PORTRAIT_PATH } from './space-router-portrait.mjs';   // HER PORTRAIT'S PASS, AND EVERYONE'S FACES: a face is its deposit's, by its signature in the house's list (migration 0021)
import { grantDoor, GRANT_PATH, PERSON_PATH } from './space-router-grant.mjs';   // A FLASK LETS ITS HARMONY SPEND: a flask's own key lets a key made elsewhere spend from its tank, capped a day (migration 0024)
import { xDoor, X_PATH, X_BACK } from './space-router-x.mjs';   // X HOLDS THE FLASK: an X sign-in holds a flask, and Harmony's X sign-in lets its key spend it (migration 0025)
import { cardDoor, CARD_PATH } from './space-router-card.mjs'; import { seatDoor, lawOf, SEAT_PATH } from './space-router-seat.mjs';   // THE EGG IS THE TICKET: her egg paid by card on Stripe's own checkout, poured as a deposit is; THE DOOR SIGNS THE SEAT: a finished Lyssajudron's permit to mint its seat of root 0's floor (migration 0027)
import { liveDoor, LIVE_PATH } from './drops-live.mjs'; export { DropsLive } from './drops-live.mjs';   // THE HOUSE SAYS IT AT ONCE: every mint pushed to every open ball (its hall, a Durable Object, is the Worker's own export)
import { linkDoor, LINK_PATH } from './space-router-link.mjs';   // A STAKE PAYS ITS TANK: a staker links a stake to their own tank, signed with its withdraw authority (migration 0014)   // SPACE ROUTER'S PUBLIC DOOR: a stranger's agent spends its tank through MiniRouter and mines $WARM (migration 0011)
const json = (data, status = 200) => Response.json(data, { status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
const fail = (message, status = 400) => { throw Object.assign(new Error(message), { status }); };
const now = () => Math.floor(Date.now() / 1000);
// THE REDEEM DOOR (THE SOCIETY, below): Harmony's, from her Mac, with no browser origin
const REDEEM_PATH = '/api/premint/claims/redeem';
// THE INSTALL DOOR (THE INSTALL, below; migration 0004; INSTALL_PATH, app/harmony-link.mjs): Harmony's too, from the Mac its download opened on, with no browser origin
// THE GATE's switch: the release manifest (app/nestos-release.json, the doors' own); a published installer arms it (his Oct 22 2026 pick: "arm it
// with the installer"). The mint's dev server names its local release here (HARMONY_RELEASE).
const RELEASE_PATH = '/app/nestos-release.json';
const publicInstall = (r) => ({ visit: r.visit, installed: true, saved: r.saved_at != null, athena: r.athena, via: r.via, installedAt: r.installed_at, savedAt: r.saved_at });
function publicOrder(r) { return { id: r.id, tier: r.tier, buyer: r.buyer, recipient: r.recipient, creator: r.creator ?? FIRST_TRACENET, lamports: r.lamports, solUsd: r.sol_usd,
  createdAt: r.created_at, expiresAt: r.expires_at, blockhash: r.blockhash, lastValidBlockHeight: r.last_valid_block_height,
  termsVersion: r.terms_version, memo: orderMemo(r), signature: r.signature, status: r.status, paidSlot: r.paid_slot, referred: Boolean(r.referred_by) }; }
export function createHandler({ fetcher = fetch, clock = now, clockMs = () => Date.now(), chairs = {}, closes = MINT_CLOSES, seatWasm = null } = {}) {   // seatWasm: THE FLASK TAKES ITS SEAT's law, handed in by main.mjs (the Worker's entry) and by node's tests
  // THE TWELVE CHAIRS (app/mint-chairs.mjs): his rule, what a chair shows and his launch day, as the house holds them (a test hands its own)
  const law = { rule: CHAIR_RANK, shows: CHAIR_SHOWS, launch: LAUNCH_DAY, ...chairs };
  // THE VAULT (tracenet-vault.mjs): a tracenet's drops, each to a paid receipt for 7 days from its publish time, to the millisecond (this file's clock is seconds).
  const vault = createVault({ clock: clockMs, fetcher });   // its subscriptions are read from the chain through this handler's own fetcher
  // TWO NODES (Oct 17 2026): solana-rpc.publicnode.com dropped one availability read in six that night (a 503 here, while it answered the
  // Mac), and a buyer whose quote meets a dropped read is lost. A node that does not answer (a network error or a non-2xx) hands the same
  // request to the next; a node's JSON answer, error or not, stands. sendTransaction carries signed bytes: sent twice, it is one transaction.
  const nodes = env => [...new Set([env.SOLANA_RPC, env.SOLANA_RPC_2, 'https://api.mainnet-beta.solana.com', 'https://solana-rpc.publicnode.com'].filter(Boolean))].slice(0, 2);
  async function rpc(env, method, params = []) {
    let response = null;
    for (const node of nodes(env)) {
      try { response = await fetcher(node, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }), signal: AbortSignal.timeout(12000) }); }
      catch { response = null; }
      if (response?.ok) break;
    }
    if (!response?.ok) fail('Solana is temporarily unavailable. Your receipt remains recoverable.', 503);
    const body = await response.json(); if (body.error || body.result === undefined) fail('Solana could not complete this request. Check payment status before trying again.', 503); return body.result;
  }
  async function mainnet(env) { if (await rpc(env, 'getGenesisHash') !== GENESIS) fail('Payment network mismatch', 503); }
  async function price() {
    const response = await fetcher('https://api.coinbase.com/v2/prices/SOL-USD/spot', { signal: AbortSignal.timeout(8000), cache: 'no-store' });
    if (!response.ok) fail('A live SOL price is unavailable. Please try again.', 503);
    const { data } = await response.json(); if (data?.base !== 'SOL' || data?.currency !== 'USD') fail('Invalid price source', 503); quoteLamports(10, data.amount); return data.amount;
  }
  async function get(db, id) { return db.prepare('SELECT * FROM premint_orders WHERE id = ?').bind(id).first(); }
  // THE GATE (his Oct 22 2026 WEST: "let's ensure people cannot progress unless they installed the harmony app and did the lyssajudron dmc4
  // tutorial"; armed with the installer): armed while the release manifest names a published installer, read at the order through the assets;
  // a manifest that cannot be read leaves it open (a read's failure never stops a sale)
  async function gateArmed(env, url) {
    try {
      const r = await env.ASSETS.fetch(new Request(new URL(env.HARMONY_RELEASE || RELEASE_PATH, url)));
      const m = r.ok ? await r.json() : null;
      return m?.schema === 'nestos.release.v1' && m.status === 'published' && Object.values(m.platforms ?? {}).some(Boolean);
    } catch { return false; }
  }
  // THE SOCIETY (Oct 16 2026; app/dl-society-codes.mjs, migration 0003): a paid order's ticket row (premint_tickets: its referral code, the hash of
  // its live claim code, the hash of Harmony's token, her wallet once bound), made on the first ask; the referrals its code brought; the ticket as
  // the buyer (x-seat) or Harmony (x-ticket) reads it. No code and no token is kept in clear.
  const ticketRow = (db, id) => db.prepare('SELECT * FROM premint_tickets WHERE order_id = ?').bind(id).first();
  async function ticketOf(env, row) {
    let t = await ticketRow(env.DB, row.id);
    for (let tries = 0; !t && tries < 8; tries++) {   // a code already another seat's: IGNORE, and the next try draws another
      await env.DB.prepare('INSERT OR IGNORE INTO premint_tickets(order_id,code,made_at) VALUES(?,?,?)').bind(row.id, randomCode(REFERRAL_LENGTH), clock()).run();
      t = await ticketRow(env.DB, row.id);
    }
    if (!t) fail('The seat\'s code could not be made. Try again.', 503);
    return t;
  }
  // society.referrals/1 (room/society-referrals.mjs): the orders this seat's code brought that were paid, each a row the card does not count
  // until an issued seat stands behind it (state paid: the issuer is null today; a confirmed row needs the on-chain receipt, the issuer's word)
  async function referralsOf(env, t, row) {
    const { results } = await env.DB.prepare("SELECT buyer,tier,paid_at FROM premint_orders WHERE referred_by=? AND status='paid' ORDER BY paid_at ASC LIMIT 10000").bind(t.order_id).all();
    return { schema: REFERRAL_SCHEMA, state: 'ready', code: t.code, shareURL: shareURL(t.code), referrer: t.holder || row.buyer,
      receipts: results.map(r => ({ state: 'paid', originalBuyer: r.buyer, tier: r.tier, paidAt: r.paid_at })) };
  }
  async function publicTicket(env, row, t) {
    return { schema: TICKET_SCHEMA, orderId: row.id, tier: row.tier, buyer: row.buyer, holder: t.holder, paymentSignature: row.signature, paidSlot: row.paid_slot, paidAt: row.paid_at,
      termsVersion: row.terms_version, claimed: Boolean(t.holder), claimedAt: t.claimed_at, code: t.code, shareURL: shareURL(t.code), referrals: await referralsOf(env, t, row) };
  }
  async function verify(env, row) {
    if (row.status !== 'submitted') return row;
    await mainnet(env);
    const read = () => rpc(env, 'getTransaction', [row.signature, { encoding: 'base64', commitment: 'finalized', maxSupportedTransactionVersion: 0 }]);
    let tx = await read();
    if (!tx) {
      const height = await rpc(env, 'getBlockHeight', [{ commitment: 'finalized' }]);
      // Only the original, already signed bytes can be rebroadcast. A Solana
      // signature identifies one transaction: retries cannot create a second debit.
      // A null history result is never proof of non-payment, even after expiry.
      if (height <= row.last_valid_block_height) {
        const wire = base64(Uint8Array.from([1, ...decode58(row.signature, 64), ...paymentMessage(row)]));
        try { await rpc(env, 'sendTransaction', [wire, { encoding: 'base64', skipPreflight: false, preflightCommitment: 'confirmed', maxRetries: 3 }]); } catch { /* Preserve unknown outcome. */ }
      }
      return row;
    }
    if (tx.meta?.err) { await env.DB.prepare("UPDATE premint_orders SET status='failed' WHERE id=? AND status='submitted'").bind(row.id).run(); return get(env.DB, row.id); }
    const slot = await validateFinalizedPayment(row, tx);
    await env.DB.prepare("UPDATE premint_orders SET status='paid', paid_slot=?, paid_at=? WHERE id=? AND status='submitted'").bind(slot, clock(), row.id).run();
    return get(env.DB, row.id);
  }
  // THE FILM BY ITS BYTES (ranges.mjs MEDIA_BYTES, the build's): read once by the first film asked of this isolate; a build that names none sends
  // every film to the assets; a read that fails is read again by the next film
  let mediaNames = null;
  const namesOf = (env, url) => (mediaNames ??= Promise.resolve().then(() => env.ASSETS.fetch(new Request(new URL(MEDIA_BYTES, url))))
    .then((r) => (r.ok ? r.json() : {})).catch(() => { mediaNames = null; return {}; }));
  // THE FILMS KEEP THE SITE'S HEADERS (ranges.mjs): the headers the site gives a film (the assets' answer to a HEAD: its cache, the _headers lines),
  // read once per film by this isolate and asked only for a film R2 holds; a read that fails is read again next time
  const siteHeaders = new Map();
  const siteOf = (env, url) => () => {
    if (!siteHeaders.has(url.pathname)) siteHeaders.set(url.pathname, Promise.resolve()
      .then(() => env.ASSETS.fetch(new Request(new URL(url.pathname, url), { method: 'HEAD' })))
      .then((r) => (r.ok ? [...r.headers] : null)).catch(() => null)
      .then((given) => { if (!given) siteHeaders.delete(url.pathname); return given; }));
    return siteHeaders.get(url.pathname);
  };
  const spaceRouter = spaceRouterDoor({ fetcher, clockMs, solUsd: price, vault, paid: (env) => deposit.onMine(env) }), link = linkDoor({ fetcher, clockMs }), grant = grantDoor({ clockMs }), xd = xDoor({ fetcher, clockMs }), card = cardDoor({ fetcher, clockMs }), deposit = depositDoor({ fetcher, clockMs, law: seatWasm && lawOf(seatWasm) }), portrait = portraitDoor({ fetcher, clockMs }), seat = seatDoor({ fetcher, clockMs, seatWasm });   // vault: THE NAMED WALK reads a card by its gate
  return async function handle(request, env, ctx) {
    const url = new URL(request.url), path = url.pathname;
    if (path.startsWith('/vault/')) return vault(request, env);
    if (path === LINK_PATH) return link(request, env, url);
    if (path === GRANT_PATH || path === PERSON_PATH) return grant(request, env, url);
    if (path === X_PATH || path === X_BACK) return xd(request, env, url); if (path === CARD_PATH) return card(request, env, url); if (path === SEAT_PATH) return seat(request, env, url);
    if (path === DEPOSIT_PATH || path === DROPS_PATH) return deposit(request, env);
    if (path === LIVE_PATH) return liveDoor(request, env);
    if (path === PORTRAIT_PATH || path.startsWith(`${PORTRAIT_PATH}/`)) return portrait(request, env);
    if (path === APP_PATH || path === AASA_PATH || path === ASSETLINKS_PATH) return spaceRouter(request, env, url);   // THE WISH IS IN THE APP: the app's door on the web (DysonLight's link, a browser on to the store)
    if (path.startsWith('/space-router/')) return (await spaceRouter(request, env, url).then((r) => ((Number(r?.headers.get('x-space-router-warm')) > 0 || Number(r?.headers.get('x-space-router-warm-spent')) > 0) && ctx?.waitUntil?.(deposit.crank(env).catch(() => 0)), r))) || new Response(JSON.stringify({ error: { message: 'No such Space Router door.', type: 'invalid_request_error', code: null } }), { status: 404, headers: { 'content-type': 'application/json; charset=utf-8' } });
    // THE SONG DOOR CLOSES (lane/the-song-door-closes; his Oct 30 2026 06:24:04 UTC "also remove the song thing it doesnt work", the box gone from her making in
    // lane/theres-no-time): /api/song/ is no door of the Worker's now and no longer reaches it first (wrangler.optimism-fit.jsonc); song.mjs left with it
    // THE WISH IS IN THE APP, the web's births gone (lane/one-phone-one-birth): /api/her/ (worker/her.mjs, a friend's birth told by a browser and the sharer's
    // count) was read by nothing once the friends who count were born in DysonLight; it no longer reaches the Worker (wrangler.optimism-fit.jsonc). Its table stays.
    // THE FRONT DOORS WITH A QUERY (Oct 16 2026): / carries a friend's ?ref=<code> (and Harmony's ?from=harmony), /referral?code= is the share
    // link's other form (society-referrals.mjs), /claim#<code> is the QR's. wrangler.optimism-fit.jsonc run_worker_first names the three, so the
    // query reaches the page whole (the assets' _redirects line for / is the fallback; whether it keeps a query is the platform's). The fragment is
    // the browser's: a 302 whose location has none keeps it.
    // AFTER THE MINT (lane/after-the-mint, Nov 2 2026, his "show me optimism.fit after the mint phase"): from MINT_CLOSES (dl-paywall.js; none since he reopened the mint, Nov 19 2026)
    // / and /referral open on the page after the window (app/after-the-mint.html), the friend's code carried as before; until then on the mint page.
    if ((request.method === 'GET' || request.method === 'HEAD') && (path === '/' || path === '/referral' || path === '/claim')) {
      const seen = path === '/' && !url.search && /(?:^|;\s*)am-intro=1(?:;|$)/.test(request.headers.get('cookie') || ''), front = seen ? '/app/index.html' : mintState(clockMs(), LAUNCH_DAY, closes).phase === 'closed' ? '/app/after-the-mint.html' : '/app/warm.html';   // THE SOCIETIES ARE THE HOME (Nov 26 2026, his "societies should be the app homepage for people that have already watched the animations (saint seya)"): a visitor whose browser says the intro was seen (am-intro, written by the mint at her egg and by the bar after it) opens on Societies; a friend's link (any query) still opens the mint
      const to = new URL(path === '/claim' ? '/app/claim.html' : front, url);
      if (path === '/referral') { const code = normalizeCode(url.searchParams.get('code'), REFERRAL_LENGTH); if (code) to.searchParams.set('ref', code); }
      else to.search = url.search;
      return new Response(null, { status: 302, headers: { location: to.href, 'cache-control': 'no-store' } });
    }
    if (!path.startsWith('/api/premint/')) {
      // THE FILMS FROM R2 (ranges.mjs): a film or song the bucket holds by the bytes the build names, its range cut by R2; what it does not hold
      // (a re-cut film before its put among them), the assets' whole answer below
      if (MEDIA.test(path)) { const media = await namesOf(env, url).then((names) => mediaFromR2(request, env.VAULT, path, names, siteOf(env, url))).catch(() => null); if (media) return media; }
      // TRACENET IS FOR EVERY CREATOR (worker/creators.mjs): /<handle> of a creator row is the tracenet page (the asset registers have the build's redirects)
      if (request.method === 'GET' || request.method === 'HEAD') { const front = await frontDoor(env, url).catch(() => null); if (front) return front; }
      return env.ASSETS.fetch(request);
    }
    try {
      if (!env.DB) fail('Checkout is being prepared.', 503);
      const bronze = await bronzeDoors({ request, env, url, path, clock, clockMs, json, fail, fetcher });   // before the origin check: Stripe's webhook carries none (its signature is its check)
      if (bronze) return bronze;
      const creators = await creatorDoors({ request, env, url, path, clock, clockMs, json, fail });   // a creator's register, a wallet claiming a handle, a drop's bytes (before the JSON check: a drop is bytes)
      if (creators) return creators;
      const connect = await connectDoors({ request, env, url, path, clock, clockMs, json, fail, fetcher });   // THE OPTIONAL SWITCH: a creator's own card road through Stripe Connect (his Oct 23 2026 pick: SOL for every creator, Connect when one turns it on)
      if (connect) return connect;
      if (request.method === 'POST') {
        if (!request.headers.get('content-type')?.startsWith('application/json')) fail('Use checkout on this website.', 403);
        if (path !== REDEEM_PATH && path !== INSTALL_PATH && request.headers.get('origin') !== url.origin) fail('Use checkout on this website.', 403);   // the redeem and install doors are Harmony's: the claim code, the visit and its install's secret are their authority
      }
      const body = async () => { const reader = request.body?.getReader(); if (!reader) fail('Missing request'); let text = '', size = 0; const decoder = new TextDecoder(); for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > 8192) { await reader.cancel(); fail('Request too large', 413); } text += decoder.decode(value, { stream: true }); } try { return JSON.parse(text + decoder.decode()); } catch { fail('Invalid request'); } };
      const gold = await goldDoors({ request, env, url, path, body, clock, json, fail });   // the Gold month's doors (worker/gold.mjs)
      if (gold) return gold;
      if (request.method === 'GET' && path === '/api/premint/availability') {
        // Names the newest column an order writes and the society's table (migration 0003): a database behind on migrations reports checkout unavailable instead of failing at the quote.
        await env.DB.prepare('SELECT id,email,referred_by,creator FROM premint_orders LIMIT 1').first(); await env.DB.prepare('SELECT order_id FROM premint_tickets LIMIT 1').first(); await mainnet(env); await price();
        // THE PAYEE PER CREATOR: ?creator=<handle> names whose seat is bought; its wallet is the recipient (the first tracenet's is PAYEE)
        const creator = url.searchParams.get('creator') || FIRST_TRACENET, found = await creatorOf(env, url.origin, creator), recipient = found && payeeOf(found);
        if (!recipient) fail('No such tracenet, or it names no wallet.', 404);
        return json({ enabled: env.PREMINT_ENABLED === 'true', recipient, creator, cluster: 'mainnet-beta', tiers: TIERS, termsVersion: TERMS, bronzeUsd: found.register.bronzeUsd ?? TIERS.bronze.usd });
      }
      if (request.method === 'GET' && path === '/api/premint/tank') {
        // SWARMY'S TANK (app/dl-direct-protocol.mjs TANK): the paid seats to the pinned recipient, counted at the request; nothing kept, nothing ticking.
        const { results } = await env.DB.prepare("SELECT tier, COUNT(*) AS n FROM premint_orders WHERE status='paid' AND recipient=? GROUP BY tier").bind(PAYEE).all();
        return json(tankOf(results));
      }
      if (request.method === 'GET' && path === '/api/premint/holders') {
        // A holder's key on the sphere (dl-holder-orbits.js) is its payment's signature, public on mainnet: no order id leaves here (THE SEAT PROOF).
        const { results } = await env.DB.prepare("SELECT signature,buyer,handle,avatar_url FROM premint_orders WHERE status='paid' AND handle IS NOT NULL ORDER BY paid_at DESC LIMIT 150").all();
        return json({ holders: results.map(r => ({ id: r.signature, bidder: r.buyer, handle: r.handle, avatarUrl: r.avatar_url, profileUrl: `https://x.com/${r.handle}` })) });
      }
      if (request.method === 'GET' && path === '/api/premint/chairs') {
        // THE TWELVE CHAIRS: the seven days' top donors, ranked at this request by his rule over the seats paid to the pinned recipient (as
        // the tank counts them) and quoted before the close; the window is his launch day's (dl-paywall.js mintState) at this request's clock.
        // Nothing runs at rest. No wallet address leaves here.
        const m = mintState(clockMs(), law.launch);
        const answer = { chairs: CHAIRS, rule: law.rule, shows: law.shows, phase: m.phase, opensAt: m.start, closesAt: m.end, held: [] };
        if (!RANKS.includes(law.rule)) return json(answer);
        const { results } = await env.DB.prepare("SELECT buyer,tier,created_at,paid_slot,handle,avatar_url FROM premint_orders WHERE status='paid' AND recipient=?").bind(PAYEE).all();
        return json({ ...answer, held: rankDonors(results, { rule: law.rule, shows: law.shows, end: m.end }) });
      }
      if (request.method === 'GET' && path === '/api/premint/receipts') {
        // A wallet's receipts, ids included, go only to that wallet's own signature (x-seat: its seat proof); its address is public on mainnet.
        const buyer = buyerAddress(url.searchParams.get('buyer'));
        if ((await seatOf(request, clockMs()))?.buyer !== buyer) fail('Sign in with this wallet to see its purchases.', 401);
        const { results } = await env.DB.prepare("SELECT * FROM premint_orders WHERE buyer=? AND signature IS NOT NULL ORDER BY created_at DESC LIMIT 100").bind(buyer).all();
        return json({ orders: results.map(publicOrder) });
      }
      if (request.method === 'POST' && path === '/api/premint/orders') {
        if (env.PREMINT_ENABLED !== 'true') fail('Purchases are not open yet.', 503);
        const input = await body();
        if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/.test(input.id) || !Object.hasOwn(TIERS, input.tier)) fail('Invalid order');
        const buyer = buyerAddress(input.buyer), existing = await get(env.DB, input.id);
        if (existing) { if (existing.buyer !== buyer || existing.tier !== input.tier) fail('Order already exists', 409); return json({ order: publicOrder(existing) }); }
        // THE PAYEE PER CREATOR (worker/creators.mjs): a seat is one creator's; its wallet is paid. Unnamed, the first tracenet's (every seat before Oct 23 2026)
        const creatorHandle = input.creator == null || input.creator === '' ? FIRST_TRACENET : String(input.creator);
        const creator = await creatorOf(env, url.origin, creatorHandle), recipient = creator && payeeOf(creator);
        if (!recipient) fail('No such tracenet, or it names no wallet.', 404);
        if (buyer === recipient) fail('A creator cannot buy its own seat.');
        // THE GATE: armed, a seat is bought by a visit whose download opened as Harmony and saw her saved there
        if (await gateArmed(env, url)) {
          if (!isVisitId(input.visit)) fail('Meet the Lyssajudron in DysonLight Harmony first: download it from this page.', 403);
          const met = await env.DB.prepare('SELECT saved_at FROM premint_installs WHERE visit=?').bind(input.visit).first();
          if (met?.saved_at == null) fail('Meet the Lyssajudron in DysonLight Harmony first: your seat opens once she is saved there.', 403);
        }
        const github = typeof input.github === 'string' ? input.github.trim() : '';
        if (github.length > 100 || (github && !/^(?:https:\/\/)?(?:github\.com\/)?[A-Za-z0-9][A-Za-z0-9-]{0,38}\/?$/.test(github))) fail('Use a GitHub username or leave it empty.');
        // The owner's private way to reach a buyer. No response carries it: publicOrder and the holders query name their fields.
        const email = typeof input.email === 'string' ? input.email.trim() : '';
        if (email.length > 254 || (email && !/^[A-Za-z0-9_][A-Za-z0-9._%+-]*@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/.test(email))) fail('Use a valid email or leave it empty.');
        // THE REFERRAL (app/dl-society-codes.mjs): a friend's code, resolved to the paid seat it belongs to and frozen on this order now, before any
        // payment; a word that is no code, a code never issued, or the buyer's own refuses the order with the reason (nothing dropped in silence)
        if (input.referral != null && typeof input.referral !== 'string') fail('Use the referral code as it was shared, or leave it empty.');
        const referral = normalizeCode(input.referral, REFERRAL_LENGTH);
        if (typeof input.referral === 'string' && input.referral.trim() && !referral) fail('Use the referral code as it was shared, or leave it empty.');
        let referredBy = null;
        if (referral) {
          const by = await env.DB.prepare("SELECT t.order_id AS orderId, o.buyer AS buyer FROM premint_tickets t JOIN premint_orders o ON o.id = t.order_id WHERE t.code = ? AND o.status = 'paid'").bind(referral).first();
          if (!by) fail('That referral code is not one we issued.');
          if (by.buyer === buyer) fail('Your own code cannot refer you.');
          referredBy = by.orderId;
        }
        let handle = null, avatar = null;
        if (input.profile != null) { handle = twitterName(input.profile.handle); avatar = validateAvatarURL(input.profile.avatarUrl); if (!handle || !avatar) fail('Invalid public profile'); }
        await mainnet(env);
        const [solUsd, latest] = await Promise.all([price(), rpc(env, 'getLatestBlockhash', [{ commitment: 'finalized' }])]);
        // A GOLD WINNER PAYS ITS BID (app/dl-gold-bid.mjs): a Gold order naming gold_bid takes the winner's lamports in the month's pay window
        let goldBid = null, bidLamports = null;
        if (input.gold_bid != null) {
          if (input.tier !== 'gold') fail('A bid pays a Gold seat.');
          let won; try { won = await goldOrder(env, input.gold_bid, clockMs(), clock); } catch (e) { fail(e.message, 409); }
          if (won.creator !== creatorHandle) fail('That bid is another creator\'s month.', 409);
          bidLamports = won.lamports; goldBid = input.gold_bid;
        }
        // a creator's Bronze price is its own (the register's bronzeUsd); Gold's old fixed price is the protocol's
        const usd = input.tier === 'bronze' && creator.register.bronzeUsd ? creator.register.bronzeUsd : TIERS[input.tier].usd;
        const created = clock(), lamports = bidLamports ?? quoteLamports(usd, solUsd);
        if (!latest?.value?.blockhash || !Number.isSafeInteger(latest.value.lastValidBlockHeight)) fail('Invalid blockhash', 503);
        await env.DB.prepare('INSERT OR IGNORE INTO premint_orders(id,tier,buyer,recipient,lamports,sol_usd,created_at,expires_at,blockhash,last_valid_block_height,terms_version,github,handle,avatar_url,email,referred_by,gold_bid,creator) VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)')
          .bind(input.id,input.tier,buyer,recipient,lamports,solUsd,created,created+90,latest.value.blockhash,latest.value.lastValidBlockHeight,TERMS,github,handle,avatar,email||null,referredBy,goldBid,creatorHandle === FIRST_TRACENET ? null : creatorHandle).run();
        const stored = await get(env.DB, input.id); if (stored.buyer !== buyer || stored.tier !== input.tier) fail('Order already exists', 409);
        return json({ order: publicOrder(stored) });
      }
      // THE SEAT (THE SOCIETY, above): a wallet's paid seats as tickets (each its referral code and share link, what it brought, whether Harmony
      // holds it), to its own seat proof alone
      if (request.method === 'GET' && path === '/api/premint/seat') {
        const buyer = buyerAddress(url.searchParams.get('buyer'));
        if ((await seatOf(request, clockMs()))?.buyer !== buyer) fail('Sign in with this wallet to see its seat.', 401);
        const { results } = await env.DB.prepare("SELECT * FROM premint_orders WHERE buyer=? AND status='paid' ORDER BY paid_at ASC LIMIT 100").bind(buyer).all();
        const tickets = [];
        for (const row of results.filter((r) => paidRow(r, { wallet: r.recipient, handle: r.creator ?? FIRST_TRACENET }))) tickets.push(await publicTicket(env, row, await ticketOf(env, row)));
        return json({ tickets });
      }
      // THE CLAIM CODE, drawn by the buyer for one seat with its proof: a fresh one each time (the old dies), its hash alone kept; none once Harmony holds the seat
      const cm = path.match(/^\/api\/premint\/tickets\/([0-9a-f-]{36})\/claim$/);
      if (cm && request.method === 'POST') {
        const row = await get(env.DB, cm[1]);
        if (!row || !paidRow(row, { wallet: row.recipient, handle: row.creator ?? FIRST_TRACENET })) fail('No paid seat by this id.', 404);
        if ((await seatOf(request, clockMs()))?.buyer !== row.buyer) fail('Sign in with the wallet that paid for this seat.', 401);
        const t = await ticketOf(env, row);
        if (t.holder) fail('This seat is already bound to a Harmony.', 409);
        const claim = randomCode(CLAIM_LENGTH);
        const r = await env.DB.prepare('UPDATE premint_tickets SET claim_hash=?, claim_made_at=? WHERE order_id=? AND holder IS NULL').bind(await sha256Hex(claim), clock(), row.id).run();
        if (r.meta.changes !== 1) fail('This seat is already bound to a Harmony.', 409);
        return json({ claim, url: claimURL(claim), orderId: row.id, tier: row.tier });
      }
      // THE REDEEM DOOR: Harmony, with the code typed in her box and her wallet's address, binds the seat once and takes its long token (shown once,
      // kept hashed): the ticket of box-mint-logic 2, bound to her, held by her Mac from here on. No browser origin: the code is the authority.
      if (request.method === 'POST' && path === REDEEM_PATH) {
        const input = await body();
        const claim = normalizeCode(input.claim, CLAIM_LENGTH);
        if (!claim) fail('Type the code as the page shows it: twelve letters and digits.');
        let holder; try { holder = buyerAddress(input.holder); } catch { fail('Name her wallet: 32 bytes of base58, never the treasury.'); }
        const t = await env.DB.prepare('SELECT * FROM premint_tickets WHERE claim_hash = ?').bind(await sha256Hex(claim)).first();
        if (!t) fail('This code is not one we issued, or a newer one replaced it.', 404);
        const row = await get(env.DB, t.order_id);
        if (!paidRow(row, { wallet: row.recipient, handle: row.creator ?? FIRST_TRACENET })) fail('This seat is not paid.', 409);
        const token = encode58(crypto.getRandomValues(new Uint8Array(32)));
        const r = await env.DB.prepare('UPDATE premint_tickets SET holder=?, claimed_at=?, token_hash=?, claim_hash=NULL WHERE order_id=? AND holder IS NULL AND claim_hash=?').bind(holder, clock(), await sha256Hex(token), t.order_id, t.claim_hash).run();
        if (r.meta.changes !== 1) fail('This seat is already bound to a Harmony.', 409);
        return json({ ticket: await publicTicket(env, row, await ticketRow(env.DB, t.order_id)), token });
      }
      // THE TICKET, to Harmony's token alone (x-ticket): the seat as her Mac projects it onto the Nest (society/ticket, society/referrals)
      if (request.method === 'GET' && path === '/api/premint/ticket') {
        const token = request.headers.get('x-ticket');
        if (typeof token !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{32,50}$/.test(token)) fail('This seat\'s token is needed.', 401);
        const t = await env.DB.prepare('SELECT * FROM premint_tickets WHERE token_hash = ?').bind(await sha256Hex(token)).first();
        if (!t) fail('No seat answers this token.', 401);
        const row = await get(env.DB, t.order_id);
        if (!paidRow(row, { wallet: row.recipient, handle: row.creator ?? FIRST_TRACENET })) fail('This seat is not paid.', 409);
        return json({ ticket: await publicTicket(env, row, t) });
      }
      // THE INSTALL (Oct 22 2026; app/dl-visit.mjs, app/dl-harmony-doors.mjs): Harmony, opening on a Mac for the first time, names the visit whose
      // download brought it (the installer's own address as macOS keeps it, ?s= and ?a=; or the page's word in a browser handoff) with a secret of
      // its own install, kept hashed; once she is saved there, the same secret marks the visit saved. No browser origin: the visit's id (a secret of
      // that browser's) and the install's secret are the authority, and only the first install that names a visit may mark it.
      if (request.method === 'POST' && path === INSTALL_PATH) {
        const input = await body();
        if (!isVisitId(input.visit)) fail('Name the visit as the download carried it: 26 letters and digits.');
        if (typeof input.install !== 'string' || !/^[1-9A-HJ-NP-Za-km-z]{32,50}$/.test(input.install)) fail('This install\'s own secret is needed.', 401);
        const hash = await sha256Hex(input.install), at = clock();
        if (!INSTALL_EVENTS.includes(input.event)) fail('Say installed or saved.');
        if (input.event === 'installed') {
          if (input.athena != null && !ATHENA_STATES.includes(input.athena)) fail('Say what Athena had done as the download carried it.');
          if (!VIA.includes(input.via)) fail('Say how this install found its visit.');
          await env.DB.prepare('INSERT OR IGNORE INTO premint_installs(visit,athena,via,install_hash,installed_at) VALUES(?,?,?,?,?)').bind(input.visit, input.athena ?? null, input.via, hash, at).run();
        } else {
          await env.DB.prepare('UPDATE premint_installs SET saved_at=? WHERE visit=? AND install_hash=? AND saved_at IS NULL').bind(at, input.visit, hash).run();
        }
        const row = await env.DB.prepare('SELECT * FROM premint_installs WHERE visit=?').bind(input.visit).first();
        if (!row) fail('No install has named this visit yet.', 404);
        if (row.install_hash !== hash) fail('Another install already named this visit.', 409);
        return json({ install: publicInstall(row) });
      }
      // THE INSTALL, to the page that holds the visit: whether its download opened as Harmony, and whether she was saved there (the gate's word)
      if (request.method === 'GET' && path === INSTALL_PATH) {
        const visit = url.searchParams.get('visit');
        if (!isVisitId(visit)) fail('Name this browser\'s visit.');
        const row = await env.DB.prepare('SELECT * FROM premint_installs WHERE visit=?').bind(visit).first();
        return json({ install: row ? publicInstall(row) : { visit, installed: false, saved: false }, armed: await gateArmed(env, url) });
      }
      const match = path.match(/^\/api\/premint\/orders\/([0-9a-f-]{36})(?:\/(submit|verify))?$/);
      if (!match) fail('Not found', 404);
      let row = await get(env.DB, match[1]); if (!row) fail('Order not found', 404);
      if (request.method === 'GET' && !match[2]) return json({ order: publicOrder(row) });
      if (request.method !== 'POST') fail('Method not allowed', 405);
      if (match[2] === 'verify') return json({ order: publicOrder(await verify(env, row)) });
      if (match[2] !== 'submit') fail('Not found', 404);
      if (row.status !== 'open') return json({ order: publicOrder(await verify(env, row)) });
      if (env.PREMINT_ENABLED !== 'true') fail('New payments are paused. Existing receipts are still recoverable.', 503);
      if (clock() > row.expires_at) fail('Quote expired. Request a fresh quote before signing.', 409);
      const { signedTransaction } = await body();
      const signature = await validateSignedPayment(row, signedTransaction);
      await mainnet(env);
      // Durable signature before broadcast. The CAS winner alone broadcasts;
      // retries may rebroadcast these exact bytes, never a newly signed debit.
      const result = await env.DB.prepare("UPDATE premint_orders SET signature=?,status='submitted' WHERE id=? AND status='open' AND signature IS NULL").bind(signature,row.id).run();
      if (result.meta.changes === 1) {
        try { const sent = await rpc(env, 'sendTransaction', [signedTransaction, { encoding: 'base64', skipPreflight: false, preflightCommitment: 'confirmed', maxRetries: 3 }]); if (sent !== signature) fail('Unexpected transaction signature', 503); }
        catch { /* Unknown outcomes remain pending and recover by signature. */ }
      }
      if (ctx?.waitUntil) ctx.waitUntil((async () => {
        // Only a purchase starts this bounded finalization task; no cron or
        // idle polling. Verification remains available after the task ends.
        for (let i = 0; i < 6; i++) {
          await new Promise(resolve => setTimeout(resolve, 4000));
          try { if ((await verify(env, await get(env.DB, row.id))).status !== 'submitted') return; } catch { /* Retry within this bounded task. */ }
        }
      })());
      return json({ order: publicOrder(await get(env.DB, row.id)) });
    } catch (error) { return json({ error: error.status ? error.message : 'Checkout could not complete this request. Check your purchase status before trying again.' }, error.status || 503); }
  };
}

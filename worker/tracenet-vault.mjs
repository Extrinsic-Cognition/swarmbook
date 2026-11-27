// tracenet-vault.mjs: THE VAULT, a tracenet's drops served by the Worker alone (wrangler.optimism-fit.jsonc run_worker_first: /vault/*), by
// THE LAW of app/tracenet-register.mjs, tiered (his Oct 15 2026 00:36 WEST, in lab/PAYWALL.md): a drop opens to a Gold receipt at its
// publish time (GOLD_DAYS), to a Bronze receipt BRONZE_DAYS after, and to everyone OPEN_DAYS after.
// FOR EVERY CREATOR (Oct 23 2026, his "it has to be for more creators to come and do the same"): a receipt is for ONE creator's tracenet, like a
// Patreon membership. A wallet's receipt is the checkout's own order (premint_orders: paid, to this creator's wallet, for this creator, under the
// current terms, a tier the checkout sells, signed) of the wallet that signed THE SEAT PROOF the page carries in x-seat; a card subscriber's is the
// token (x-bronze, worker/bronze.mjs) of a subscription to this creator while Stripe says it is paid; a Gold seat won by a sealed bid holds for its
// access month alone (goldMonthHolds). The register is the creator's (worker/creators.mjs: D1, or the first tracenet's asset file); the bytes are
// R2's for a D1 creator and the assets' for the first. Before its tier's instant a paid receipt meets 402 with that instant.
// One read of the register, one Ed25519 check, one read of the wallet's rows, one read of the bytes: computed at the request; no timer, no cron.
// What it is not: the register is public by design (titles, sizes, hashes, dates), the bytes are not. His Oct 13 "one seat, one society" held while
// there was one tracenet; with many, a seat is one creator's (the first tracenet's older rows name no creator and are the first tracenet's).
// THE AGENTS SUBSCRIBE (Oct 30 2026, app/tracenet-subscribe.mjs): the third road, for a register that names a price (subscribeLamports).
// - A request carries x-subscription (its payment's signature) and the seat proof of the key that paid.
// - The payment is read on chain: one getTransaction, finalized, from the Worker's own node, whose cluster is checked once against SOLANA_CLUSTER.
// - It must be this tracenet's, paid to its payee at no less than its price, by the key that asks, inside its days. Nothing is stored.
// - Without one, the 402 hands the asker the terms (what to pay, to whom, for how long, the memo to sign): an agent pays from them.
// THE FAN PAYS FROM THE TANK (Oct 30 2026, worker/tracenet-tank.mjs): the private road, for a tracenet that names a price in dollars. The request carries
// the fan's tank key (the bearer, or x-api-key); a row the tank paid inside the ledger opens the drops as a subscription does, while it holds. The 402
// hands its terms beside the chain's (tank: the price, the days, the door, the deposit door that fills a tank).
import { TERMS, TIERS, GENESIS, verifySeatProof } from '../app/dl-direct-protocol.mjs';
import { opensAt, opensFor, openToAll, FIRST_TRACENET, vaultPath } from '../app/tracenet-register.mjs';
import { subscribeTerms, verifySubscription } from '../app/tracenet-subscribe.mjs';
import { bronzeOf } from './bronze.mjs';
import { creatorOf, payeeOf, vaultBytes } from './creators.mjs';
import { tankAccessOf, priceOf, tankTerms } from './tracenet-tank.mjs';
import { windowOf } from '../app/dl-gold-bid.mjs';

const json = (data, status = 200) => Response.json(data, { status, headers: { 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
// the clusters a subscription may be paid on, by their genesis hash: mainnet unless the Worker's SOLANA_CLUSTER says devnet (a rehearsal)
export const DEVNET_GENESIS = 'EtWTRABZaYq6iMfeYKouRu166VU2xqa1wcaWoxPkrZBG';
export const MAINNET_NODE = 'https://api.mainnet-beta.solana.com';
export const genesisOf = (env) => (env?.SOLANA_CLUSTER === 'devnet' ? DEVNET_GENESIS : env?.SOLANA_CLUSTER === 'localnet' ? env.SOLANA_GENESIS ?? null : GENESIS);   // localnet: a rehearsal's own validator, its genesis a var read only then (THE FLASK TAKES ITS SEAT), its rows labelled mainnet's (clusterOf: D1 keeps two clusters); mainnet's and devnet's stay fixed
const SIGNATURE = /^[1-9A-HJ-NP-Za-km-z]{64,88}$/;

/** The wallet the request shows it holds (x-seat: its seat proof, signed for this host), {buyer, expires}, or null. An order id is none. */
export function seatOf(request, now) {
  const url = new URL(request.url);
  return verifySeatProof(request.headers.get('x-seat'), { host: url.host, origin: url.origin, now });
}
/** A paid receipt's row for this creator: paid, to the creator's wallet, for the creator (older rows name none: the first tracenet's), under the current terms, a tier the checkout sells, signed. */
export function paidRow(row, { handle = FIRST_TRACENET, wallet } = {}) {
  return Boolean(row) && row.status === 'paid' && row.recipient === wallet && (row.creator ?? FIRST_TRACENET) === handle && row.terms_version === TERMS && Object.hasOwn(TIERS, row.tier) &&
    typeof row.signature === 'string' && row.signature.length > 0;
}
/** A Gold seat won by a sealed bid (app/dl-gold-bid.mjs) is priority access for its month alone: from the auction month's end to the next's. Any other row holds. */
export function goldMonthHolds(row, now) {
  if (!row?.gold_month) return true;
  try { const w = windowOf(row.gold_month), next = windowOf(w.access); return now >= w.ends && now < next.ends; } catch { return false; }
}
/** The handle's register (worker/creators.mjs: D1, or the asset file), or null. */
export async function manifestOf(env, origin, handle) { return (await creatorOf(env, origin, handle))?.register ?? null; }
export function createVault({ clock = () => Date.now(), fetcher = (...a) => fetch(...a) } = {}) {
  const clusters = new Map();   // a node's genesis hash, asked once per isolate
  async function rpc(node, method, params = []) {
    const r = await fetcher(node, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }), signal: AbortSignal.timeout(8000) });
    const j = await r.json();
    if (j.error) throw new Error(j.error.message || 'RPC error');
    return j.result;
  }
  /** The subscription the request shows for this tracenet, {signature, subscriber, lamports, slot, from, until}, or null. */
  async function subscriptionOf(request, env, creator, handle, now) {
    const signature = request.headers.get('x-subscription'), price = creator?.register?.subscribeLamports, payee = payeeOf(creator);
    if (!signature || !SIGNATURE.test(signature) || !price || !payee) return null;
    const seat = await seatOf(request, now);
    if (!seat) return null;
    const node = env.SOLANA_RPC || MAINNET_NODE;
    if (!clusters.has(node)) clusters.set(node, rpc(node, 'getGenesisHash').catch(() => null));
    const genesis = await clusters.get(node);
    if (genesis === null) clusters.delete(node);
    if (genesis !== genesisOf(env)) return null;
    const tx = await rpc(node, 'getTransaction', [signature, { encoding: 'base64', commitment: 'finalized', maxSupportedTransactionVersion: 0 }]);
    return verifySubscription(tx, { handle, payee, price, subscriber: seat.buyer, now });
  }
  return async function vault(request, env, named = null) {   // named {handle, id}: a drop named by THE NAMED WALK (worker/space-router.mjs), its file the register's
    const url = new URL(request.url), at = named ?? vaultPath(url.pathname);
    if (!at) return json({ error: 'Not found' }, 404);
    if (request.method !== 'GET' && request.method !== 'HEAD') return json({ error: 'Method not allowed' }, 405);
    const creator = await creatorOf(env, url.origin, at.handle), manifest = creator?.register ?? null;
    const item = manifest?.items.find((i) => i.id === at.id && (named !== null || i.file === at.file));
    if (!item) return json({ error: 'Not found' }, 404);
    const now = clock(), iso = (ms) => (ms === null ? null : new Date(ms).toISOString()), opens = iso(opensAt(item));
    if (!openToAll(item, now)) {
      const wallet = payeeOf(creator), seat = env.DB && wallet ? await seatOf(request, now) : null;
      let rows = [];
      if (seat) { try { rows = (await env.DB.prepare("SELECT o.*, g.month AS gold_month FROM premint_orders o LEFT JOIN gold_bids g ON g.commitment = o.gold_bid WHERE o.buyer = ? AND o.status = 'paid' LIMIT 100").bind(seat.buyer).all()).results.filter((r) => paidRow(r, { handle: at.handle, wallet })).filter((r) => goldMonthHolds(r, now)); } catch { rows = []; } }
      // BRONZE IS A SUBSCRIPTION: a card subscriber's token (x-bronze) holds the Bronze tier of this creator while Stripe says it is paid (worker/bronze.mjs)
      const card = env.DB ? await bronzeOf(env, request.headers.get('x-bronze'), now).catch(() => null) : null;
      // THE AGENTS SUBSCRIBE: a subscription paid on chain by the key that asks (subscriptionOf, above)
      const subscribed = await subscriptionOf(request, env, creator, at.handle, now).catch(() => null);
      // THE FAN PAYS FROM THE TANK: a subscription its tank paid inside the ledger (tankAccessOf, worker/tracenet-tank.mjs)
      const tanked = await tankAccessOf(env, request, at.handle, now);
      const tiers = [...rows.map((r) => r.tier), ...(card?.active && card.creator === at.handle ? ['bronze'] : []), ...(subscribed || tanked ? ['subscribed'] : [])];
      // the reader's tier the law opens this drop to soonest, and that instant
      const mine = tiers.map((tier) => ({ tier, at: opensFor(item, tier) })).filter((s) => s.at !== null).sort((a, b) => a.at - b.at)[0];
      const terms = subscribeTerms(manifest), tank = mine ? null : tankTerms(await priceOf(env, at.handle), at.handle);
      if (!mine) return json({ error: opens ? `Seat holders first; free from ${opens}.` : 'Seat holders only.', opensAt: opens, tier: null, ...(terms ? { subscribe: terms } : {}), ...(tank ? { tank } : {}) }, 402);
      if (!(now >= mine.at)) return json({ error: `${TIERS[mine.tier]?.name ?? 'Your subscription'} opens this drop at ${iso(mine.at)}.`, opensAt: iso(mine.at), tier: mine.tier }, 402);
    }
    const asset = await vaultBytes(env, url.origin, at.handle, item.id, item.file);
    if (!asset) return json({ error: 'Not found' }, 404);
    const headers = new Headers({ 'cache-control': 'private, no-store', 'x-content-type-options': 'nosniff', 'content-disposition': `attachment; filename="${item.file}"` });
    headers.set('content-type', asset.headers.get('content-type') || 'application/octet-stream');
    const length = asset.headers.get('content-length');
    if (length) headers.set('content-length', length);
    return new Response(request.method === 'HEAD' ? null : asset.body, { status: 200, headers });
  };
}

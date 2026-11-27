// worker/gold.mjs: THE GOLD MONTH'S DOORS (Oct 23 2026; the law: app/dl-gold-bid.mjs), FOR EVERY CREATOR (his "it has to be for more creators to
// come and do the same"): a month's auction is a creator's (?creator=<handle>, the first tracenet when unnamed); its bids are sealed to that
// creator's wallet (worker/creators.mjs keyOf: the key, never a payee vault) and its total is signed by it. Three doors under /api/premint/gold/, called by premint.mjs:
// - POST /api/premint/gold/bids   {bid}: a bid for an open month of a creator (the bid names it and signs it), its signature by its own key checked
//                                 (Web Crypto Ed25519), its commitment a point of the group (a torsion point is refused at the door, so the month's
//                                 commitments always add up), appended once; the Worker never learns an amount: the box is the creator's to open.
// - GET  /api/premint/gold/pot?month=&creator=: the month, its window and phase, the creator's wallet (what a bid is sealed to), the log's
//                                 commitments in order (what anyone sums), the count, and the posted total when there is one (the page checks it
//                                 against the log before it shows it); no bidder key, no box leaves.
// - POST /api/premint/gold/totals {total}: the creator's close, signed by its wallet's key (the only check here beside the count and the shape: the
//                                 sum is the page's arithmetic, kept off the Worker's clock); once per month, after the close.
// A winner pays through the orders door (premint.mjs): a Gold order naming gold_bid takes the winner's lamports in the pay window; see goldOrder.
import { GOLD, isMonth, windowOf, phaseOf, verifyBidWith, canonicalTotal, sumCommitments, hexBytes, verifyWith, isLamports, TOTAL_TYPE, BID_TYPE, SCHEMA } from '../app/dl-gold-bid.mjs';
import { decode58 } from '../app/dl-direct-protocol.mjs';
import { FIRST_TRACENET, HANDLE } from '../app/tracenet-register.mjs';
import { creatorOf, keyOf } from './creators.mjs';

const BIDS_PATH = '/api/premint/gold/bids', POT_PATH = '/api/premint/gold/pot', TOTALS_PATH = '/api/premint/gold/totals';
export const PATHS = Object.freeze({ bids: BIDS_PATH, pot: POT_PATH, totals: TOTALS_PATH });
const HEX64 = /^[0-9a-f]{64}$/, HEX128 = /^[0-9a-f]{128}$/;
const creatorName = (s) => (s == null || s === '' ? FIRST_TRACENET : String(s));

/** goldDoors({request, env, url, path, body, clock, json, fail, subtle, payee}): a Response for one of the three doors, or null when the path is not theirs. */
export async function goldDoors({ request, env, url, path, body, clock, json, fail, subtle = crypto.subtle, payee = null }) {   // payee(handle): the wallet a creator's bids are sealed to (the tests hand a stand-in)
  if (!path.startsWith('/api/premint/gold/')) return null;
  const nowMs = clock() * 1000;
  const walletOf = async (handle) => {
    if (!HANDLE.test(handle)) fail('No such tracenet.', 404);
    if (payee) return payee(handle);
    const creator = await creatorOf(env, url.origin, handle); const wallet = creator && keyOf(creator);
    if (!wallet) fail('No such tracenet, or it names no wallet.', 404);
    return wallet;
  };
  if (request.method === 'GET' && path === POT_PATH) {
    const month = url.searchParams.get('month'), creator = creatorName(url.searchParams.get('creator'));
    if (!isMonth(month)) fail('Name the month as YYYY-MM.');
    const recipient = await walletOf(creator);
    const { results } = await env.DB.prepare('SELECT commitment FROM gold_bids WHERE month=? AND COALESCE(creator,?)=? ORDER BY created_at ASC, rowid ASC').bind(month, FIRST_TRACENET, creator).all();
    const posted = await env.DB.prepare('SELECT lamports,blinder,bids,winners,signature,posted_at FROM gold_totals WHERE month=? AND COALESCE(creator,?)=?').bind(month, FIRST_TRACENET, creator).first();
    const total = posted ? { type: TOTAL_TYPE, schema: SCHEMA, month, creator, lamports: posted.lamports, blinder: posted.blinder, bids: posted.bids, winners: JSON.parse(posted.winners), signature: posted.signature, postedAt: posted.posted_at } : null;
    return json({ schema: SCHEMA, month, creator, window: windowOf(month), phase: phaseOf(month, nowMs), slots: GOLD.slots, reserveUsd: GOLD.reserveUsd, recipient, commitments: results.map((r) => r.commitment), count: results.length, total });
  }
  if (request.method === 'POST' && path === BIDS_PATH) {
    const { bid } = await body();
    if (!bid || bid.type !== BID_TYPE || bid.schema !== SCHEMA || !isMonth(bid.month) || !HEX64.test(bid.commitment) || !HEX64.test(bid.bidder) || !/^[0-9a-f]{176}$/.test(bid.box) || !HEX128.test(bid.signature)) fail('Invalid bid');
    const creator = creatorName(bid.creator); await walletOf(creator);
    if (phaseOf(bid.month, nowMs) !== 'open') fail(`Bids for ${bid.month} are not open.`, 409);
    if (!(await verifyBidWith(subtle, bid))) fail('The bid is not signed by its key.', 403);
    try { sumCommitments([hexBytes(bid.commitment)]); } catch { fail('The commitment is not a point of the group.'); }
    const existing = await env.DB.prepare('SELECT month FROM gold_bids WHERE commitment=? OR bidder=?').bind(bid.commitment, bid.bidder).first();
    if (existing) fail('This bid is already in the log.', 409);
    await env.DB.prepare('INSERT INTO gold_bids(commitment,month,bidder,box,signature,created_at,creator) VALUES(?,?,?,?,?,?,?)').bind(bid.commitment, bid.month, bid.bidder, bid.box, bid.signature, clock(), creator).run();
    const { n } = await env.DB.prepare('SELECT COUNT(*) AS n FROM gold_bids WHERE month=? AND COALESCE(creator,?)=?').bind(bid.month, FIRST_TRACENET, creator).first();
    return json({ ok: true, month: bid.month, creator, commitment: bid.commitment, count: n }, 201);
  }
  if (request.method === 'POST' && path === TOTALS_PATH) {
    const { total } = await body();
    if (!total || total.type !== TOTAL_TYPE || total.schema !== SCHEMA || !isMonth(total.month) || !HEX128.test(total.signature)) fail('Invalid total');
    const creator = creatorName(total.creator), recipient = await walletOf(creator);
    let bytes; try { bytes = canonicalTotal(total); } catch { fail('Invalid total'); }
    if (phaseOf(total.month, nowMs) === 'open' || phaseOf(total.month, nowMs) === 'before') fail(`${total.month} is not closed yet.`, 409);
    if (!(await verifyWith(subtle)(bytes, hexBytes(total.signature), decode58(recipient, 32)))) fail('The total is not signed by the creator\'s key.', 403);
    const { n } = await env.DB.prepare('SELECT COUNT(*) AS n FROM gold_bids WHERE month=? AND COALESCE(creator,?)=?').bind(total.month, FIRST_TRACENET, creator).first();
    if (total.bids !== n) fail(`The log holds ${n} bids for ${total.month}, not ${total.bids}.`, 409);
    if (total.winners.length > GOLD.slots) fail('More winners than slots.');
    const { results } = await env.DB.prepare('SELECT commitment FROM gold_bids WHERE month=? AND COALESCE(creator,?)=?').bind(total.month, FIRST_TRACENET, creator).all();
    const set = new Set(results.map((r) => r.commitment));
    if (!total.winners.every((w) => set.has(w.commitment))) fail('A winner is not in the log.');
    if (await env.DB.prepare('SELECT month FROM gold_totals WHERE month=? AND COALESCE(creator,?)=?').bind(total.month, FIRST_TRACENET, creator).first()) fail('The total is already posted.', 409);
    await env.DB.prepare('INSERT INTO gold_totals(month,lamports,blinder,bids,winners,signature,posted_at,creator) VALUES(?,?,?,?,?,?,?,?)')
      .bind(total.month, total.lamports, total.blinder, total.bids, JSON.stringify(total.winners), total.signature, clock(), creator).run();
    return json({ ok: true, month: total.month, creator, lamports: total.lamports, winners: total.winners.length }, 201);
  }
  return null;
}

/**
 * goldOrder(env, commitment, nowMs, clock): what a Gold order naming a bid pays: the winner's lamports and the creator, if the bid won a month now
 * in its pay window and no other order has paid or holds it. Throws with the reason otherwise (the orders door turns it into its refusal).
 */
export async function goldOrder(env, commitment, nowMs, clock) {
  if (!HEX64.test(commitment ?? '')) throw new Error('Name the winning bid.');
  const row = await env.DB.prepare('SELECT month, creator FROM gold_bids WHERE commitment=?').bind(commitment).first();
  if (!row) throw new Error('That bid is not in the log.');
  const creator = creatorName(row.creator);
  if (phaseOf(row.month, nowMs) !== 'pay') throw new Error(`${row.month} is not in its pay window.`);
  const posted = await env.DB.prepare('SELECT winners FROM gold_totals WHERE month=? AND COALESCE(creator,?)=?').bind(row.month, FIRST_TRACENET, creator).first();
  const winner = posted ? JSON.parse(posted.winners).find((w) => w.commitment === commitment) : null;
  if (!winner) throw new Error('That bid did not win, or the month is not closed yet.');
  const taken = await env.DB.prepare("SELECT id FROM premint_orders WHERE gold_bid=? AND status NOT IN ('failed','expired') AND (status IN ('paid','submitted') OR expires_at > ?)").bind(commitment, clock()).first();   // paid, in flight, or a live quote
  if (taken) throw new Error('That winning bid is already being paid.');
  if (!isLamports(winner.lamports)) throw new Error('Invalid winner');
  return { month: row.month, creator, lamports: String(winner.lamports) };   // as the quote writes lamports: text, the column's affinity
}

// warm-door.mjs · THE DOOR OPENS WITH THE POOL (lane/the-door-opens-with-the-pool; his Oct 30 2026 click "Yes, build it" on "Build the page's buy-$WARM
// button, shown once trading opens?"; the button's text was the seat's: "build the page's door to buy $WARM in a lane: it reads the pool's address from
// the mainnet set and stays hidden until trading opens. No deploy."). The page's door to buy $WARM is $WARM's own pool on Meteora (his "Yes, Meteora",
// Oct 30 00:21:06 UTC). Its address is the mainnet set's (warm-pair.mjs, written by tools/warm-launch/mainnet.mjs emit). The door opens only when that
// pool stands on chain and its trading has begun: one read of 8 bytes of the pair's account, at a cause (the page's making, the film's stop), never on a
// timer, never before the opening, never after the close, never while the set names no address. Anything but a clear answer keeps it shut.
export const DLMM = 'LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo';   // Meteora's DLMM program, the pair's owner (tools/warm-launch/chain.mjs P.dlmm)
export const RPC = 'https://api.mainnet-beta.solana.com';              // the cluster's own public door, as the mint's count read it (dl-mint-liquor.mjs)
export const ACTIVATION_AT = 816;                                      // the pair's activation point, u64 LE, unix seconds (chain.mjs readPair)
export const ASK_MS = 6000;                                            // a read is let go after this; its timer stands only while it is in flight
const ADDRESS = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/;

/** Where the door leads: the pair's own page on Meteora. */
export const doorHref = (pair) => `https://app.meteora.ag/dlmm/${pair}`;

/** Whether the door may ask the chain at this instant: a mainnet pair named, its opening reached, its window not closed (after the close the offer
 *  leaves the page, so nothing is asked). */
export function mayAsk(w, now) {
  if (!w || w.cluster !== 'mainnet' || typeof w.pair !== 'string' || !ADDRESS.test(w.pair)) return false;
  const opening = Date.parse(w.opening), close = Date.parse(w.close);
  return Number.isFinite(opening) && now >= opening && (!Number.isFinite(close) || now < close);
}

/** What the chain said (getAccountInfo's value, 8 bytes at ACTIVATION_AT in base64): open when DLMM owns the pair and its activation point has passed. */
export function opened(value, now) {
  if (!value || value.owner !== DLMM || !Array.isArray(value.data) || value.data[1] !== 'base64' || typeof value.data[0] !== 'string') return false;
  let bytes;
  try { bytes = Uint8Array.from(globalThis.atob(value.data[0]), (c) => c.charCodeAt(0)); } catch { return false; }
  if (bytes.length !== 8) return false;
  let at = 0n;
  for (let i = 7; i >= 0; i--) at = (at << 8n) | BigInt(bytes[i]);
  return at > 0n && Number(at) * 1000 <= now;
}

/** One read of the pair, when mayAsk allows it: true only when it stands and trades. */
export async function askPair(w, {fetch: f = (...a) => globalThis.fetch(...a), now = () => Date.now(), rpc = RPC, ms = ASK_MS, timers = globalThis} = {}) {
  if (!mayAsk(w, now())) return false;
  const ctl = typeof AbortController === 'function' ? new AbortController() : null;
  const timer = ctl ? timers.setTimeout(() => ctl.abort(), ms) : null;
  try {
    const r = await f(rpc, {method: 'POST', headers: {'content-type': 'application/json'}, signal: ctl?.signal,
      body: JSON.stringify({jsonrpc: '2.0', id: 1, method: 'getAccountInfo',
        params: [w.pair, {encoding: 'base64', commitment: 'confirmed', dataSlice: {offset: ACTIVATION_AT, length: 8}}]})});
    if (!r?.ok) return false;
    const j = await r.json();
    return opened(j?.result?.value ?? null, now());
  } catch {
    return false;
  } finally {
    if (timer !== null) timers.clearTimeout(timer);
  }
}

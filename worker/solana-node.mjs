// solana-node.mjs · the Worker's own Solana node for the doors that read the chain (the stake link, the deposit): one JSON-RPC call with a timeout,
// and the node's cluster checked against SOLANA_CLUSTER by its genesis, read once per isolate and node (a failed read is asked again, never cached).
import { MAINNET_NODE, genesisOf } from './tracenet-vault.mjs';

export const clusterOf = (env) => (env?.SOLANA_CLUSTER === 'devnet' ? 'devnet' : 'mainnet');
/** The doors' answers: JSON never kept by a cache, a refusal in the shape the router's answers take (`said`: its body, with more beside it) */
export const json = (status, body, extra = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...extra } }), said = (message, more = {}) => ({ error: { message, type: 'invalid_request_error', code: null }, ...more }), refusal = (status, message, extra) => json(status, said(message), extra);

/** solanaNode(fetcher) -> { rpc(env, method, params), sameCluster(env) } */
export function solanaNode(fetcher = fetch) {
  const clusters = new Map();
  async function rpc(env, method, params = []) {
    const r = await fetcher(env.SOLANA_RPC || MAINNET_NODE, { method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }), signal: AbortSignal.timeout(8000) });
    if (!r.ok) throw new Error(`the node answered ${r.status}`);
    const j = await r.json(); if (j.error) throw Object.assign(new Error(j.error.message || 'the node refused'), { refused: true }); return j.result;   /* refused: the node itself answered no (it took nothing), told apart from a node that did not answer */
  }
  async function sameCluster(env) {
    const node = env.SOLANA_RPC || MAINNET_NODE;
    if (!clusters.has(node)) clusters.set(node, rpc(env, 'getGenesisHash').catch(() => null));
    if ((await clusters.get(node)) === genesisOf(env)) return true;
    clusters.delete(node); return false;
  }
  return { rpc, sameCluster };
}

/** A per-isolate limit of asks a minute by the caller's address (cf-connecting-ip): true when this ask is one too many. */
export function perMinute(limit) {
  const asked = new Map();
  return (request, now) => {
    const ip = request.headers.get('cf-connecting-ip') || 'here', recent = (asked.get(ip) || []).filter((t) => now - t < 60_000);
    if (recent.length >= limit) { asked.set(ip, recent); return true; }
    recent.push(now); asked.set(ip, recent);
    if (asked.size > 5000) for (const k of asked.keys()) { asked.delete(k); if (asked.size <= 4000) break; }
    return false;
  };
}

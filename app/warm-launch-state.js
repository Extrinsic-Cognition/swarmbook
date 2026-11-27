// Fail closed. A marketing config alone cannot authorize a financial action.
// Mainnet activation requires a reviewed adapter; this release contains none.
export function resolveGenesisStatus(config, adapter = null) {
  const closed = { mode: 'before_genesis', title: 'Opens 14 September 2026', canMint: false, visualization: true, home: './index.html' };
  if (!config || config.schema !== 'poleis.genesis-status.v1' || config.network !== 'solana-mainnet-beta') return {...closed, error: 'Genesis status unavailable'};
  if (config.phase === 'complete') {
    if (!config.deployment?.program || !config.terms?.url || !adapter?.verifyCompletion) return {...closed, error: 'Genesis completion is not verified'};
    // Only the real chain adapter may prove completion; no redirect from a JSON flag.
    return {...closed, error: 'Completed genesis requires chain verification'};
  }
  if (config.phase !== 'before_genesis' || config.mintingEnabled !== false) return {...closed, error: 'Mainnet mint adapter is not available'};
  return closed;
}

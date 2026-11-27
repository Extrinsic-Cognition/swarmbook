// The wall is a capped view of the chain reader's living roots. This reader
// has no attributable fee-revenue index: treasury balances, endowments and
// spending are not fees, and must never be substituted for a fee leaderboard.

/**
 * Preserve the wall's established order: later roots and generations appear
 * first. Each program/root identity appears once, even if an input repeats it.
 * Use Infinity when the complete roster is needed outside the twelve tiles.
 */
export function selectWallEntries(generations, rootsFn, limit = 12) {
  const count = limit === Infinity ? Infinity : Math.max(0, Math.floor(Number(limit) || 0));
  if (!count) return [];
  const candidates = [];
  for (const g of generations) {
    const program = g.P.PROGRAM_ID.toBase58();
    for (const id of rootsFn(g)) {
      const rootId = String(id);
      candidates.push({ key: `${program}:${rootId}`, g, rootId });
    }
  }
  const selected = [], seen = new Set();
  for (let i = candidates.length - 1; i >= 0 && selected.length < count; i--) {
    const entry = candidates[i];
    if (seen.has(entry.key)) continue;
    seen.add(entry.key);
    selected.push(entry);
  }
  return selected;
}

/** Open seats at a swarm's door: each chamber's pool, open less filled; the very read its card prints as "n at the door". */
export const doorSeats = (pools, units) => units.reduce((a, id) => { const p = pools?.get(id); return a + (p ? p.open - p.filled : 0n); }, 0n);

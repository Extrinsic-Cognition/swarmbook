// SWARMY'S TANK ON THE SEATS (his Oct 17 2026, 03:0x to 03:4x WEST: "30% of every seat goes into Swarmy's tank"; "Set it at $3 a month until
// the lean replayer lands, then $1"). Each seat says what it feeds, worked out from the same TANK the Worker counts with, so the words follow the
// ration when it drops to $1. The line under the seats gives the tank so far, from one read of /api/premint/tank at load; nothing runs at rest.
// An empty tank shows no line. The words are mine, his to reword.
import { TIERS, tankMonths } from './dl-direct-protocol.mjs';

/** What one seat of this tier feeds: at $1 a month "3 months of Swarmy, free, for Seeker owners" (bronze), "300 months..." (gold); one month reads
 *  "A month of Swarmy, free, for a Seeker owner". */
export function seatFeeds(tier) {
  const months = tankMonths(TIERS[tier].usd);
  return months === 1 ? 'A month of Swarmy, free, for a Seeker owner' : `${months} months of Swarmy, free, for Seeker owners`;
}

/** The tank so far, from /api/premint/tank's answer; '' when it is empty or unreadable. */
export function tankLine(t) {
  if (!t || !Number.isFinite(t.usd) || !Number.isFinite(t.months) || t.months < 1) return '';
  return `Swarmy's tank so far: $${Math.round(t.usd).toLocaleString('en-US')}, ${t.months.toLocaleString('en-US')} free month${t.months === 1 ? '' : 's'} for Seeker owners.`;
}

export async function mountTank({ doc = document, fetcher = fetch } = {}) {
  for (const li of doc.querySelectorAll('[data-tank-tier]')) if (Object.hasOwn(TIERS, li.dataset.tankTier)) li.textContent = seatFeeds(li.dataset.tankTier);
  const out = doc.querySelector('[data-swarmy-tank-count]');
  if (!out) return '';
  try {
    const response = await fetcher('/api/premint/tank', { cache: 'no-store' });
    const line = response.ok ? tankLine(await response.json()) : '';
    if (line) { out.textContent = line; out.hidden = false; }
    return line;
  } catch { return ''; }
}

if (typeof document !== 'undefined') void mountTank();

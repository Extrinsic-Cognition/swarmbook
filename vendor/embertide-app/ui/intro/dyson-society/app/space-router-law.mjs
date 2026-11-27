// space-router-law.mjs · THE SPACE ROUTER'S LAW, one for every door that burns (Oct 30 2026, lane/space-routers-public-door): the purse door's tanks on the
// Mac (tools/embertide-mesh/lib/space-tanks.mjs) and the public door at the site's edge (worker/space-router.mjs) charge, hold and mine by these lines,
// and a page that shows the rate reads it here. Pure: no clock, no I/O, nothing of a room.
//
// THE TANK (Oct 26 2026, SPACE-ROUTER-THE-TANKS-LANDING.md): a call drinks the router's own cost plus the tank's markup, the house's take (what MiniRouter
// keeps today, x-minirouter-markup-bps 500); a call in flight holds the tank's fair price, the mean of its last FAIR_OF drinks, FIRST_HOLD_USD before its
// first (his Sept 21 12:50: never the router's worst case).
//
// PROMPT-TO-MINE (his words, UTC, Oct 29 2026, to claude-61e371e5): 20:55:59 "bro, make fucking enourmous attention strategically to how memetic can
// "Prompt-to-Mine" can be... imagine like mining the supply with rebates dude..."; 20:56:41 "it's like proof of work distribution dude"; 21:02:32 "Halve by
// date"; 21:04:16 "Every 6 months" (from the opening); Oct 27 23:4x "1$ = 1$WARM? to begin with"; Oct 28 13:50 "we should give $WARM only when money is
// spent in the SPACE-ROUTER"; Oct 30 00:0x "the point is prompt-2-mine porcoddio rebates dai". A dollar burned at an instant mines WARM_PER_USD halved once
// for every HALVING_MONTHS calendar months (UTC) since the opening: 1, 0.5, 0.25 ... 1/1024 from the fifth year, when $POOL unlocks, and on halving after
// it. Before the opening, or while none is named, a dollar mines the opening's rate. A refill (a ticket, a pour) mines nothing. The strategy: ec-workspace
// docs/prompt-to-mine-proof-of-work-distribution-hypertrace-2026-10-29.md.
export const NAME_RX = /^[a-z][a-z0-9-]{0,31}$/;
export const FIRST_HOLD_USD = 0.05;
export const FAIR_OF = 20;
export const MARKUP_BPS = 500;
export const WARM_PER_USD = 1;
export const HALVING_MONTHS = 6;
// THE COUNTER-TANK DRINKS (Nov 2 2026; his Oct 12 "a counter-fueltank that fills up as you consume", Oct 18 "use $WARM as credits for AI genie"; the receipt:
// THE-COUNTER-TANK-DRINKS-LANDING.md): a drink takes the tank's dollars first, the rest in its $WARM at USD_PER_WARM (a dollar of credits a $WARM until he names another).
export const USD_PER_WARM = 1;
export function split(usd, fuel, warm, k = USD_PER_WARM) {   // -> { usd_fuel, warm_spent }: the $WARM-paid part mines nothing; the dollars go past zero only when it is gone too
  const d = Math.max(0, usd), w = k > 0 ? Math.min(Math.max(0, warm), +((d - Math.min(d, Math.max(0, fuel))) / k).toFixed(9)) : 0;
  return { usd_fuel: +(d - w * k).toFixed(9), warm_spent: +w.toFixed(9) };
}

// Any sr_ string is a tank's key, known to a door or not: a door serves it from a tank or refuses it, and never lets it ride upstream as a router key.
export const isTankKey = (s) => typeof s === 'string' && s.startsWith('sr_');
// What a tank pays for a call: the router's cost and the tank's markup in basis points, to the nano-dollar.
export const charge = (routerUsd, markupBps = 0) => +(routerUsd * (1 + Math.max(0, markupBps) / 10000)).toFixed(9);
// The fair price a call in flight holds: the mean of the tank's last FAIR_OF drinks, FIRST_HOLD_USD before its first.
export const fairHold = (recent = []) => (recent.length ? recent.slice(-FAIR_OF).reduce((a, b) => a + b, 0) / Math.min(recent.length, FAIR_OF) : FIRST_HOLD_USD);

/** ms of an instant given as ms or an ISO string; null when it names none */
export function instantMs(v) {
  if (typeof v === 'number') return Number.isFinite(v) ? v : null;
  if (typeof v !== 'string' || !v.trim()) return null;
  const ms = Date.parse(v); return Number.isFinite(ms) ? ms : null;
}

/** the n-th halving: the opening plus n × HALVING_MONTHS calendar months, UTC; a day past its month's end lands on that month's last day (Aug 31 -> Feb 28) */
export function halvingAt(openedMs, n) {
  const o = new Date(openedMs), y = o.getUTCFullYear(), m = o.getUTCMonth() + n * HALVING_MONTHS;
  const last = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
  return Date.UTC(y, m, Math.min(o.getUTCDate(), last), o.getUTCHours(), o.getUTCMinutes(), o.getUTCSeconds(), o.getUTCMilliseconds());
}

/** the era of an instant: 0 before the first halving (and with no opening named), n from the n-th halving to the next */
export function eraAt(atMs, openedMs) {
  if (!Number.isFinite(openedMs) || !Number.isFinite(atMs) || atMs < openedMs) return 0;
  const a = new Date(atMs), o = new Date(openedMs);
  let n = Math.floor(((a.getUTCFullYear() - o.getUTCFullYear()) * 12 + a.getUTCMonth() - o.getUTCMonth()) / HALVING_MONTHS);
  while (n > 0 && halvingAt(openedMs, n) > atMs) n--;
  while (halvingAt(openedMs, n + 1) <= atMs) n++;
  return n;
}

/** $WARM one dollar burned at atMs mines */
export const warmPerUsdAt = (atMs, openedMs) => WARM_PER_USD / 2 ** eraAt(atMs, openedMs);
/** $WARM a burn of usd at atMs mines, to the nano */
export const warmMined = (usd, atMs, openedMs) => +(Math.max(0, usd) * warmPerUsdAt(atMs, openedMs)).toFixed(9);
/** the next halving after atMs (ms), or null while no opening is named */
export const nextHalvingAt = (atMs, openedMs) => (Number.isFinite(openedMs) ? halvingAt(openedMs, eraAt(atMs, openedMs) + 1) : null);

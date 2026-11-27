// SWARMY'S TANK (his Oct 17 2026: "30% of every seat goes into Swarmy's tank"; "$3 a month until the lean replayer lands, then $1"):
// the count the Worker and the page share, the words each seat says, and the one read the page makes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { TIERS, TANK, tankMonths, tankOf } from './dl-direct-protocol.mjs';
import { seatFeeds, tankLine, mountTank } from './dl-tank.js';

test('30% of every seat at $1 a month since the lean replayer landed: a bronze feeds three months, a gold three hundred', () => {
  assert.deepEqual({ ...TANK }, { share: 0.3, rationUsd: 1 });
  assert.equal(tankMonths(TIERS.bronze.usd), 3);
  assert.equal(tankMonths(TIERS.gold.usd), 300);
  assert.equal(seatFeeds('bronze'), '3 months of Swarmy, free, for Seeker owners');
  assert.equal(seatFeeds('gold'), '300 months of Swarmy, free, for Seeker owners');
});

test('the tank counts known tiers only, whole months, dollars to the cent', () => {
  assert.deepEqual(tankOf([]), { share: 0.3, rationUsd: 1, seats: { bronze: 0, gold: 0 }, usd: 0, months: 0 });
  const t = tankOf([{ tier: 'bronze', n: 2 }, { tier: 'gold', n: 1 }, { tier: 'platinum', n: 9 }, { tier: 'bronze', n: -4 }]);
  assert.deepEqual(t.seats, { bronze: 2, gold: 1 });
  assert.equal(t.usd, 306);
  assert.equal(t.months, 306);
  assert.equal(tankOf([{ tier: 'bronze', n: '7' }]).months, 21);
});

test('the line says nothing for an empty or unreadable tank, and the tank so far otherwise', () => {
  assert.equal(tankLine(tankOf([])), '');
  assert.equal(tankLine(null), '');
  assert.equal(tankLine({ usd: 'x', months: 2 }), '');
  assert.equal(tankLine(tankOf([{ tier: 'bronze', n: 1 }])), "Swarmy's tank so far: $3, 3 free months for Seeker owners.");
  assert.equal(tankLine({ usd: 1, months: 1 }), "Swarmy's tank so far: $1, 1 free month for Seeker owners.");
  assert.equal(tankLine(tankOf([{ tier: 'gold', n: 4 }])), "Swarmy's tank so far: $1,200, 1,200 free months for Seeker owners.");
});

// a document with just what mountTank touches
function page() {
  const li = (tier) => ({ dataset: { tankTier: tier }, textContent: '' });
  const items = [li('bronze'), li('gold'), li('nobody')], out = { textContent: '', hidden: true };
  return { items, out, doc: { querySelectorAll: (q) => (q === '[data-tank-tier]' ? items : []), querySelector: (q) => (q === '[data-swarmy-tank-count]' ? out : null) } };
}

test('the page fills each seat, reads /api/premint/tank once, and shows the line only when the tank holds a month', async () => {
  const p = page(), asked = [];
  const line = await mountTank({ doc: p.doc, fetcher: async (url, opts) => { asked.push([url, opts.cache]); return Response.json(tankOf([{ tier: 'gold', n: 1 }])); } });
  assert.deepEqual(asked, [['/api/premint/tank', 'no-store']]);
  assert.equal(p.items[0].textContent, '3 months of Swarmy, free, for Seeker owners');
  assert.equal(p.items[1].textContent, '300 months of Swarmy, free, for Seeker owners');
  assert.equal(p.items[2].textContent, '');
  assert.equal(line, "Swarmy's tank so far: $300, 300 free months for Seeker owners.");
  assert.equal(p.out.hidden, false);
  for (const fetcher of [async () => Response.json(tankOf([])), async () => new Response('down', { status: 503 }), async () => { throw new Error('offline'); }]) {
    const q = page();
    assert.equal(await mountTank({ doc: q.doc, fetcher }), '');
    assert.equal(q.out.hidden, true);
  }
});

// YOUR PRESENCE IN THE MMO (lane/your-presence-in-the-mmo, Oct 29 2026): the two seats left the mint page for one starter kit, the buyer's own USDC
// pre-allocated as Space Router credits, so the page carries no seat's months, no seat's share and no tank count, and its entry no longer loads this
// module (one read of /api/premint/tank fewer at each visit). The law above stays, for the Worker's tank and the day a kit has a share again.
test('the mint page carries no seat feeds since the starter kit, and does not load the module', () => {
  const html = readFileSync(new URL('./warm.html', import.meta.url), 'utf8');
  assert.doesNotMatch(html, /data-tank-tier|data-swarmy-tank-count/);
  assert.doesNotMatch(html, /30% of every seat fills the tank/);
  assert.match(html, /class="snowtrace-tier snowtrace-kit"/);
  const entry = readFileSync(new URL('./warm-entry.mjs', import.meta.url), 'utf8');
  assert.doesNotMatch(entry, /dl-tank\.js/);
});

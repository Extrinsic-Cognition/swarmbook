import test from 'node:test';
import assert from 'node:assert/strict';
import {CHAIRS, CHAIR_RANK, CHAIR_SHOWS, chairForm, rankDonors, chairsOf} from './mint-chairs.mjs';
import {mintState, MINT_DAYS} from './dl-paywall.js';

const DAY = 86400000;
// a paid order row as D1 holds it: created_at in seconds (the quote), paid_slot the finalized transaction's slot
const row = (buyer, tier, slot, extra = {}) => ({buyer, tier, created_at: 1000 + slot, paid_slot: slot, handle: null, avatar_url: null, ...extra});

test('his two calls stand unanswered: nothing is ranked and no chair is held', () => {
  assert.equal(CHAIR_RANK, null); assert.equal(CHAIR_SHOWS, null); assert.equal(CHAIRS, 12);
  assert.deepEqual(rankDonors([row('A', 'gold', 1)]), []);
  assert.deepEqual(rankDonors([row('A', 'gold', 1)], {rule: 'most'}), []);
});

test('"sum": a wallet ranks by the dollars it paid, one chair a wallet, a tie to whoever reached it first', () => {
  const rows = [row('A', 'bronze', 5), row('B', 'gold', 9), row('A', 'bronze', 6), row('C', 'bronze', 3), row('C', 'bronze', 4),
    row('D', 'gold', 2), row('D', 'bronze', 7)];
  // D 1010 (at 7), B 1000 (at 9), A 20 (reached at 6), C 20 (reached at 4): C reached 20 before A
  assert.deepEqual(rankDonors(rows, {rule: 'sum'}), [{rank: 1, usd: 1010}, {rank: 2, usd: 1000}, {rank: 3, usd: 20}, {rank: 4, usd: 20}]);
  const named = rows.map(r => ({...r, handle: r.buyer.toLowerCase(), avatar_url: `https://pbs.twimg.com/profile_images/1/${r.buyer}.jpg`}));
  assert.deepEqual(rankDonors(named, {rule: 'sum', shows: 'profile'}).map(c => c.handle), ['d', 'b', 'c', 'a']);
});

test('"single": a wallet ranks by its largest seat, a tie to whoever bought that seat first', () => {
  const rows = [row('A', 'bronze', 1), row('A', 'bronze', 2), row('A', 'bronze', 3), row('B', 'gold', 8), row('C', 'gold', 4), row('C', 'bronze', 9)];
  const ranked = rankDonors(rows, {rule: 'single', shows: 'profile'});
  assert.deepEqual(ranked.map(c => c.usd), [1000, 1000, 10]);
  // C's gold at slot 4 comes before B's at 8; three bronzes never beat one gold
  const named = rankDonors(rows.map(r => ({...r, handle: r.buyer.toLowerCase(), avatar_url: `https://pbs.twimg.com/profile_images/1/${r.buyer}.jpg`})), {rule: 'single', shows: 'profile'});
  assert.deepEqual(named.map(c => c.handle), ['c', 'b', 'a']);
});

test('twelve chairs at most; equal sums and slots fall to the wallet address, so a reload never reseats anyone', () => {
  const rows = Array.from({length: 20}, (_, i) => row(`W${String(i).padStart(2, '0')}`, i % 3 ? 'bronze' : 'gold', 100 + i));
  const ranked = rankDonors(rows, {rule: 'sum'});
  assert.equal(ranked.length, CHAIRS);
  assert.deepEqual(ranked.map(c => c.rank), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  assert.deepEqual(rankDonors([...rows].reverse(), {rule: 'sum'}), ranked);
  const same = [row('Z', 'gold', 5), row('Y', 'gold', 5)];
  assert.deepEqual(rankDonors(same, {rule: 'sum', shows: 'profile'}), rankDonors([...same].reverse(), {rule: 'sum', shows: 'profile'}));
});

test('a seat counts when its quote came before the close; rows that are not paid seats count for nothing', () => {
  const end = (1000 + 50) * 1000;
  const rows = [row('A', 'gold', 49), row('B', 'gold', 50), row('C', 'bronze', 10)];
  assert.deepEqual(rankDonors(rows, {rule: 'sum', end}).map(c => c.usd), [1000, 10]);
  assert.deepEqual(rankDonors(rows, {rule: 'sum', end: null}).map(c => c.usd), [1000, 1000, 10]);
  const bad = [row('A', 'platinum', 1), row('', 'gold', 2), row('B', 'gold', -1), row('C', 'gold', 1.5), {...row('D', 'gold', 3), paid_slot: null}, null];
  assert.deepEqual(rankDonors(bad, {rule: 'sum'}), []);
});

test('no wallet address leaves the ranking; a name and avatar only when he rules "profile" and the buyer gave one', () => {
  const rows = [row('Wallet1111', 'gold', 1, {handle: 'first', avatar_url: 'https://pbs.twimg.com/profile_images/1/a.jpg'}), row('Wallet2222', 'bronze', 2),
    row('Wallet1111', 'bronze', 3, {handle: 'later', avatar_url: 'https://pbs.twimg.com/profile_images/1/b.jpg'})];
  for (const shows of [null, 'gold']) assert.ok(!JSON.stringify(rankDonors(rows, {rule: 'sum', shows})).match(/Wallet|first|later|pbs/));
  const profiled = rankDonors(rows, {rule: 'sum', shows: 'profile'});
  assert.ok(!JSON.stringify(profiled).includes('Wallet'));
  assert.deepEqual(profiled, [{rank: 1, usd: 1010, handle: 'later', avatarUrl: 'https://pbs.twimg.com/profile_images/1/b.jpg'}, {rank: 2, usd: 10}]);
});

test('the glass is the twelve chairs through the seven days and the $WARM swarm after them, on the mint\'s own window', () => {
  assert.equal(chairForm('unset'), 'chairs'); assert.equal(chairForm('before'), 'chairs'); assert.equal(chairForm('open'), 'chairs');
  assert.equal(chairForm('closed'), 'swarm'); assert.equal(chairForm(undefined), 'chairs');
  const launch = '2026-10-20T00:00:00+01:00', start = Date.parse(launch);
  assert.equal(chairForm(mintState(Date.now()).phase), 'chairs', 'his launch day is unset today');
  assert.equal(chairForm(mintState(start - 1, launch).phase), 'chairs');
  assert.equal(chairForm(mintState(start + MINT_DAYS * DAY - 1, launch).phase), 'chairs');
  assert.equal(chairForm(mintState(start + MINT_DAYS * DAY, launch).phase), 'swarm');
});

test('an answer is taken only whole: ranks from one, at most twelve, each with its dollars', () => {
  assert.deepEqual(chairsOf(null), {status: 'unknown', held: []});
  assert.deepEqual(chairsOf({phase: 'later', held: []}), {status: 'unknown', held: []});
  assert.deepEqual(chairsOf({phase: 'open', rule: 'sum', shows: 'gold', held: [{rank: 1, usd: 1000}, {rank: 2, usd: 10, wallet: 'x'}]}),
    {status: 'live', phase: 'open', rule: 'sum', shows: 'gold', held: [{rank: 1, usd: 1000}, {rank: 2, usd: 10}]});
  assert.equal(chairsOf({phase: 'open', held: [{rank: 2, usd: 10}]}).held.length, 0, 'a list that does not start at one holds nothing');
  assert.equal(chairsOf({phase: 'open', held: Array.from({length: 14}, (_, i) => ({rank: i + 1, usd: 10}))}).held.length, CHAIRS);
  assert.equal(chairsOf({phase: 'open', rule: 'most', shows: 'all', held: []}).rule, null);
});

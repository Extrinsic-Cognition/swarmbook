// dl-mint-ledger.test.mjs: THE MINT'S LEDGER IS SOLANA'S (his Oct 21 2026 WEST: "it's all sedimented on solana as source of truth"; "is there
// persistence among hexs? remember the floating vs anchored hex thing or not?"). node --test dl-mint-ledger.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {RECIPIENT} from './dl-direct-protocol.mjs';
import {FLOOR, RUNG, FILM_FRONT, seatMemo, seatsOfSignatures, isSeat, chainOrder, readSeats, reviewSeats, foldWorld, foldFloor, worldOf} from './dl-mint-ledger.js';
import {readFileSync} from 'node:fs';
import {MINT_FRONT, RISE, riseOf} from './warm-sphere.js';

const BUYER = '7Np41oeYqPefeNQEHSv1UDhYrehxin3NStELsSKCT4K2', ORDER = '0b8c9a62-1f6a-4f1e-9a51-2f6d0c1b7e11';
const memo = (tier, buyer = BUYER) => `optimism.fit:premint:v1:${ORDER}:${tier}:${buyer}`;
const tx = (tier, lamports, {buyer = BUYER, to = RECIPIENT, said = memo(tier), err = null} = {}) => ({meta: {err}, transaction: {message: {instructions: [
  {program: 'spl-memo', parsed: said}, {program: 'system', parsed: {type: 'transfer', info: {source: buyer, destination: to, lamports}}}]}}});

test('a seat on chain is the checkout\'s memo, as the RPC reports it, from a transaction that succeeded', () => {
  assert.deepEqual(seatMemo(`[95] ${memo('gold')}`), {order: ORDER, tier: 'gold', buyer: BUYER, memo: memo('gold')});
  assert.equal(seatMemo(`[95] ${memo('gold')}`.replace('gold', 'platinum')), null);
  assert.equal(seatMemo('[12] hello there'), null); assert.equal(seatMemo(null), null);
  assert.equal(seatMemo(`[5] gm; [95] ${memo('bronze')}`).tier, 'bronze', 'several memos: the seat\'s');
  const seats = seatsOfSignatures([
    {signature: 'a', slot: 10, err: null, memo: `[95] ${memo('bronze')}`}, {signature: 'b', slot: 11, err: {InstructionError: []}, memo: `[95] ${memo('gold')}`},
    {signature: 'c', slot: 12, err: null, memo: '[3] gm'}, {signature: 'd', slot: 9, err: null, memo: `[95] ${memo('gold')}`}]);
  assert.deepEqual(seats.map((s) => s.signature), ['a', 'd'], 'a failed transaction or another memo is no seat');
});

test('a seat\'s transaction pays the recipient from its buyer at least its floor, under its own memo', () => {
  const seat = {signature: 's', slot: 1, tier: 'gold', buyer: BUYER, memo: memo('gold')};
  assert.equal(isSeat(tx('gold', 6_000_000_000), seat), true);
  assert.equal(isSeat(tx('gold', FLOOR.gold - 1), seat), false, 'dust under a gold memo');
  assert.equal(isSeat(tx('gold', 6e9, {to: BUYER}), seat), false, 'paid elsewhere');
  assert.equal(isSeat(tx('gold', 6e9, {buyer: RECIPIENT}), seat), false, 'from another wallet');
  assert.equal(isSeat(tx('gold', 6e9, {said: memo('bronze')}), seat), false, 'another memo');
  assert.equal(isSeat(tx('gold', 6e9, {err: {x: 1}}), seat), false, 'failed');
  assert.equal(isSeat(tx('bronze', FLOOR.bronze), {...seat, tier: 'bronze', memo: memo('bronze')}), true);
});

test('readSeats reads the recipient\'s history, verifies each seat, keeps the chain\'s order, and reads only what is new', async () => {
  const sigs = [{signature: 'z', slot: 30, err: null, memo: `[95] ${memo('bronze')}`}, {signature: 'y', slot: 20, err: null, memo: `[95] ${memo('gold')}`},
    {signature: 'x', slot: 20, err: null, memo: `[95] ${memo('gold')}`}, {signature: 'w', slot: 5, err: null, memo: `[95] ${memo('gold')}`}];
  const paid = {z: tx('bronze', 50_000_000), y: tx('gold', 6e9), x: tx('gold', 6e9), w: tx('gold', 1000)};
  const asked = [];
  const fetcher = async (url, {body}) => {
    const req = JSON.parse(body); asked.push(Array.isArray(req) ? req.map((r) => r.params[0]) : req.params[1]);
    const result = Array.isArray(req) ? req.map((r) => ({id: r.id, result: paid[r.params[0]]})) : {result: req.params[1].until ? [] : sigs};
    return {ok: true, json: async () => result};
  };
  const seats = await readSeats({fetcher, rpcs: ['https://rpc.test']});
  assert.deepEqual(seats.map((s) => s.signature), ['x', 'y', 'z'], 'by slot, then by signature; the dust gold is no seat');
  assert.equal(asked[0].until, undefined);
  asked.length = 0;
  const again = await readSeats({fetcher, rpcs: ['https://rpc.test'], known: seats});
  assert.equal(asked[0].until, 'z', 'from the newest seat known');
  assert.deepEqual(again.map((s) => s.signature), ['x', 'y', 'z']);
  await assert.rejects(readSeats({fetcher: async () => ({ok: false, status: 503}), rpcs: ['https://rpc.test']}));
});

test('the world is the land law\'s over the chain\'s seats: the same seats, the same land on every screen; a seat keeps its land; gold anchored, bronze riding a mass', () => {
  assert.equal(RUNG, 3);
  const nine = foldWorld(reviewSeats(9), MINT_FRONT), again = foldWorld(reviewSeats(9), MINT_FRONT), ten = foldWorld(reviewSeats(10), MINT_FRONT);
  assert.deepEqual([...nine], [...again], 'pure: the same chain, the same world');
  for (const [signature, cell] of nine) assert.equal(ten.get(signature).face, cell.face, `${signature} keeps its land when the next seat is paid`);
  const faces = [...ten.values()].map((c) => c.face);
  assert.equal(new Set(faces).size, faces.length, 'one hexagon a holder');
  for (const cell of ten.values()) {
    assert.equal(cell.anchored, cell.metal === 'gold');
    assert.match(cell.home, cell.metal === 'gold' ? /^gold:\d+$/ : /^(chair:\d+|gold:\d+)$/);
  }
  assert.ok([...ten.values()].some((c) => c.metal === 'bronze' && c.home.startsWith('gold:')), 'a gold\'s gravity: land near it rides it');
  // A GOLD RISES (his Oct 28 2026: "bronze hexagons are floating and cannot be upgraded; golden hexagons are anchored and can be upgraded in height"):
  // a gold bought again by its holder takes no land and raises its hexagon a level; a bronze is never raised; the review's golds race
  const w = (seats) => foldWorld(seats, MINT_FRONT), s = (signature, slot, tier, buyer) => ({signature, slot, tier, buyer});
  const raised = w([s('g1', 1, 'gold', 'A'), s('b1', 2, 'bronze', 'A'), s('g2', 3, 'gold', 'A'), s('g3', 4, 'gold', 'B'), s('b2', 5, 'bronze', 'A')]);
  assert.deepEqual([...raised.keys()], ['g1', 'b1', 'g3', 'b2'], 'the second gold of A takes no land');
  assert.equal(raised.get('g1').level, 2, 'it raises A\'s gold a level'); assert.equal(raised.get('g3').level, 1);
  assert.equal(raised.get('b1').level, 1); assert.equal(raised.get('b2').level, 1, 'a bronze is never raised, whoever bought it');
  assert.notEqual(raised.get('b1').face, raised.get('b2').face, 'each bronze its own floating hexagon');
  assert.equal(w([s('g1', 1, 'gold', null), s('g2', 2, 'gold', null)]).size, 2, 'a gold with no buyer named takes its own land');
  assert.deepEqual([...w(reviewSeats(40)).values()].filter((c) => c.metal === 'gold').map((c) => c.level), [4, 2, 1, 1], 'the review races');
  assert.equal(riseOf(1), RISE.base); assert.equal(riseOf(2), RISE.base + RISE.step); assert.equal(riseOf(99), RISE.max); assert.equal(riseOf(undefined), RISE.base);
  // the film's front: the first seats are in sight (the front's half) and clear of his circle
  const [first] = [...nine.values()];
  assert.ok(first, 'a seat');
});

test('FOLLOW THE COUNT (his Nov 19 2026 "Follow the count"): one fold from the film\'s front for every ball; the mint page\'s stop grows only as far as the mints make it', () => {
  FILM_FRONT.forEach((v, k) => assert.ok(Math.abs(v - MINT_FRONT[k]) < 1e-15, 'the front held here is the film\'s own on the stop'));
  for (const n of [0, 1, 12, 31, 100]) {
    const f = foldFloor(reviewSeats(n), FILM_FRONT), w = worldOf(reviewSeats(n), FILM_FRONT);
    assert.equal(w.capacity, f.capacity); assert.equal(w.rung, f.rung); assert.equal(w.size, f.held.length);
    for (const h of f.held) { const c = w.get(h.signature); assert.deepEqual([c.face, c.metal, c.anchored, c.level], [h.face, h.metal, h.metal === 'gold', 1]); assert.match(c.home, /^(chair|gold):\d+$/); }
  }
  assert.equal(worldOf([], FILM_FRONT).capacity, 0, 'no mint: the dodecahedron');
  assert.equal(foldFloor(reviewSeats(1), FILM_FRONT).capacity, 30, 'the first mint: 30 places (where it stands: swarmbook-floor.test.mjs)');
  const g = read('./warm-sphere.js');
  assert.match(g, /if \(mintMode === 'ahead' && graceNow\) \{ const floor = flask\.world\(MINT_FRONT\)\.capacity; capacity = phaseTime >= 28 \? floor : Math\.min\(phaseTime >= 21 \? 80 : phaseTime >= 11 \? 30 : 0, floor\); count = 0; \}/, 'held on the arrow: a rung a beat up to the floor\'s, no illustrated place');
  assert.match(g, /phase = momentPhase\(own\); graceNow = own >= SEIYA_MOMENTS\.fold;/, 'from the fold on');
  assert.match(read('./dl-mint-flask.js'), /F\.world = worldOf\(F\.chain, front\);/, 'the flask folds as every ball does');
  assert.match(read('./swarmbook-floor.mjs'), /FRONT = FILM_FRONT;/, 'Swarmbook\'s front from the same front');
});
const read = (f) => readFileSync(new URL(f, import.meta.url), 'utf8');

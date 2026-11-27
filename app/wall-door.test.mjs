// THE WALL SAYS WHO HAS ROOM: the door's filter and the wish card's byte limits (receipt: ../THE-WALL-SAYS-WHO-HAS-ROOM-LANDING.md).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { doorSeats } from './wall-roster.js';
import { CAPACITIES, fitBytes, wishHash, readWish } from './found-capacity.js';

test('a swarm is at the door exactly when its chambers\' pools hold open seats, the card\'s own sum', () => {
  const pools = new Map([['1', { open: 10n, filled: 2n }], ['2', { open: 3n, filled: 3n }]]);
  assert.equal(doorSeats(pools, ['1', '2', '9']), 8n);
  assert.equal(doorSeats(pools, ['2']), 0n);
  assert.equal(doorSeats(undefined, ['1']), 0n);   // before the chain's read: no swarm has room, never an invented one
});
test('the chain keeps the name in 64 bytes and the sentence in 128, cut by bytes and never inside a character', () => {
  assert.equal(new TextEncoder().encode(fitBytes('é'.repeat(70), 64)).length, 64);
  assert.equal(fitBytes('ab🙂', 5), 'ab');
  const w = readWish(wishHash({ wish: '🙂'.repeat(40), name: 'n'.repeat(80), room: 3 }));
  assert.deepEqual([new TextEncoder().encode(w.wish).length, w.name.length, w.room], [128, 64, CAPACITIES[3]]);
  assert.equal(readWish('#wish=%20&name=x'), null);   // no sentence, no hand-over: found.html opens on its first step
});

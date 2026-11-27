// THE PANTHEON'S BOARD (swarmbook-board.mjs): the rows as the door ranks them, the visitor's own row, a page linked, and the section hidden while the door
// does not answer. node --test swarmbook-board.test.mjs
import test from 'node:test'; import assert from 'node:assert/strict';
import { rowsOf, mountBoard } from './swarmbook-board.mjs';
const RIDERS = [{ rank: 1, n: 41, signature: 'S1', handle: 'kiln_lia', colours: { light: '#f0cf74', base: '#2a1b05', coat: '#b8892b', gold: '#ffe29a', eyes: '#7df9ff', thruster: '#ff6a3d' }, month: { fees: 3.9238, burned: 82.4, mined: 82 } },
  { rank: 2, n: 7, signature: 'S2', handle: '<b>', colours: null, month: { fees: 0.5, burned: 10.5, mined: 10.25 } }];
const settle = () => new Promise((ok) => setTimeout(ok, 5));
function page(answer) {
  const ol = { hidden: true, innerHTML: '', querySelectorAll: () => [] }, none = { hidden: true }, sec = { hidden: true, querySelector: (q) => (q === '.am-board-rows' ? ol : none) };
  const load = async () => ({ PARTS: ['base', 'coat', 'gold', 'eyes', 'thruster'], cutHex: (p) => ({ cut: p }), drawHers: async (list, { each }) => list.forEach((s, i) => each({ her: s.light }, i)) });
  const b = mountBoard({ win: { location: { hostname: 'swarmbook.com' }, performance: { now: () => 1e6 } }, doc: { getElementById: () => sec, addEventListener() {} }, idb: { open() { throw new Error('no store'); } }, fetcher: answer, load });
  return { b, ol, none, sec };
}
test('a rider: its rank, its page, its numbers; the visitor\'s own row in gold leads to her making; a handle that is not one is not printed', () => {
  assert.match(rowsOf([{ rank: 3, n: 5, signature: 'rider-1', handle: 'box_room', traces: 3, month: {} }], null, (h) => `/${h}`), /<small>3 traces · Hexagon 5<\/small>/, 'THE RIDER STANDS ON THE META SWARM: a claw rider\'s row says the traces it egressed');
  const [a, b] = rowsOf(RIDERS, 'S2', (h) => `/${h}`).split('</li>');
  assert.match(a, /class="top"/); assert.match(a, /<a href="\/kiln_lia">@kiln_lia<\/a>/); assert.match(a, /Hexagon 41/); assert.match(a, /\$82\.40/); assert.match(a, /\$3\.92/); assert.match(a, />82</);
  assert.match(b, /class="mine"/); assert.match(b, /<a href="\.\/warm\.html\?door=deposit&then=making">Hexagon 7<\/a>/); assert.match(b, /no page claimed · you/); assert.match(b, />10\.25</); assert.doesNotMatch(b, /<b><\/b>|&lt;b|<b>@/);
});
test('the door does not answer: the board stays hidden, never "no rider yet" on a guess', async () => {
  const p = page(async () => ({ ok: false, json: async () => ({}) })); await settle(); assert.equal(p.sec.hidden, true); assert.equal(p.b.state().shown, false);
});
test('the door answers no rider: the empty board and its call', async () => {
  const p = page(async () => ({ ok: true, json: async () => ({ count: 0, since: 0, board: [] }) })); await settle(); assert.equal(p.sec.hidden, false); assert.equal(p.ol.hidden, true); assert.equal(p.none.hidden, false);
});
test('the door answers riders: their rows, and a face for each that has its colours', async () => {
  const p = page(async () => ({ ok: true, json: async () => ({ count: 2, since: 0, board: RIDERS }) })); await settle(); await settle();
  assert.equal(p.sec.hidden, false); assert.equal(p.ol.hidden, false); assert.equal(p.none.hidden, true); assert.match(p.ol.innerHTML, /@kiln_lia/); assert.deepEqual(p.b.state(), { shown: true, rows: 2, faces: 1 });
});

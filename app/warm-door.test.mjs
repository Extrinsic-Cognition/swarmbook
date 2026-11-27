// warm-door.test.mjs · THE DOOR OPENS WITH THE POOL (lane/the-door-opens-with-the-pool): the door to buy $WARM asks the chain only for a named mainnet
// pair, only from the opening to the close, with one read of 8 bytes; it opens only on a pair DLMM owns whose activation point has passed, and the
// page holds it shut, with no address, in $WARM's title.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ACTIVATION_AT, DLMM, RPC, askPair, doorHref, mayAsk, opened} from './warm-door.mjs';
import {WARM_PAIR} from './warm-pair.mjs';

const PAIR = 'FfaxTfLjCTwdBCfm5k5GYyzKysJAEmZqZLyt1o7AT3Eg';   // the devnet rehearsal's pair (tools/warm-launch/LANDING.md, r3): an address of the right shape
const w = {cluster: 'mainnet', mint: '6LEp2cPSxr9rSBreaswRJYbBFuSjYA9PaXv4Kaja77cy', pair: PAIR, opening: '2026-10-30T20:00:00Z', close: '2026-11-15T00:00:00Z'};
const at = (s) => Date.parse(s);
const slice = (seconds) => { const b = Buffer.alloc(8); b.writeBigUInt64LE(BigInt(seconds)); return [b.toString('base64'), 'base64']; };

test('as committed the mainnet set names no pool, so the door asks nothing', () => {
  assert.equal(WARM_PAIR.cluster, 'mainnet');
  assert.equal(WARM_PAIR.pair, null);
  assert.equal(WARM_PAIR.mint, null);
  assert.equal(mayAsk(WARM_PAIR, at('2026-11-01T00:00:00Z')), false);
});

test('it asks only for a named mainnet pair, from the opening to the close', () => {
  assert.equal(mayAsk(w, at('2026-10-30T19:59:59Z')), false);
  assert.equal(mayAsk(w, at('2026-10-30T20:00:00Z')), true);
  assert.equal(mayAsk(w, at('2026-11-14T23:59:59Z')), true);
  assert.equal(mayAsk(w, at('2026-11-15T00:00:00Z')), false, 'after the close the offer leaves the page');
  assert.equal(mayAsk({...w, cluster: 'devnet'}, at('2026-11-01T00:00:00Z')), false);
  assert.equal(mayAsk({...w, pair: 'not an address'}, at('2026-11-01T00:00:00Z')), false);
  assert.equal(mayAsk({...w, opening: 'soon'}, at('2026-11-01T00:00:00Z')), false);
  assert.equal(mayAsk(null, at('2026-11-01T00:00:00Z')), false);
});

test('it opens only on a pair DLMM owns whose activation point has passed', () => {
  const now = at('2026-10-30T20:00:05Z'), opening = at('2026-10-30T20:00:00Z') / 1000;
  assert.equal(opened({owner: DLMM, data: slice(opening)}, now), true);
  assert.equal(opened({owner: DLMM, data: slice(opening + 60)}, now), false, 'not active yet');
  assert.equal(opened({owner: '11111111111111111111111111111111', data: slice(opening)}, now), false, 'not the DLMM program');
  assert.equal(opened(null, now), false, 'no account: the pool is not on chain');
  assert.equal(opened({owner: DLMM, data: ['', 'base64']}, now), false);
  assert.equal(opened({owner: DLMM, data: slice(0)}, now), false);
});

test('one read of 8 bytes of the pair, and anything unclear keeps it shut', async () => {
  const now = () => at('2026-10-31T00:00:00Z');
  const calls = [];
  const answer = (value) => async (url, init) => { calls.push({url, body: JSON.parse(init.body)}); return {ok: true, json: async () => ({jsonrpc: '2.0', id: 1, result: {context: {slot: 1}, value}})}; };
  assert.equal(await askPair(w, {fetch: answer({owner: DLMM, data: slice(at(w.opening) / 1000), lamports: 1, executable: false}), now}), true);
  assert.equal(calls.length, 1);
  assert.equal(calls[0].url, RPC);
  assert.equal(calls[0].body.method, 'getAccountInfo');
  assert.deepEqual(calls[0].body.params, [PAIR, {encoding: 'base64', commitment: 'confirmed', dataSlice: {offset: ACTIVATION_AT, length: 8}}]);
  assert.equal(await askPair(w, {fetch: answer(null), now}), false, 'the pool is not on chain');
  assert.equal(await askPair(w, {fetch: async () => ({ok: false}), now}), false, 'the cluster refused');
  assert.equal(await askPair(w, {fetch: async () => { throw new Error('offline'); }, now}), false, 'no network');
  // a read that never answers is let go after its time; its timer stands only while it is in flight
  const timers = {set: 0, cleared: 0, setTimeout(fn, ms) { this.set++; this.fn = fn; this.ms = ms; return 7; }, clearTimeout() { this.cleared++; }};
  const hang = (url, init) => new Promise((_, reject) => init.signal.addEventListener('abort', () => reject(new Error('aborted'))));
  const pending = askPair(w, {fetch: hang, now, timers, ms: 50});
  timers.fn();
  assert.equal(await pending, false);
  assert.deepEqual([timers.set, timers.cleared, timers.ms], [1, 1, 50]);
  // before the opening nothing is asked at all
  let asked = 0;
  assert.equal(await askPair(w, {fetch: async () => { asked++; return {ok: true}; }, now: () => at('2026-10-30T12:00:00Z')}), false);
  assert.equal(asked, 0);
});

test("the door leads to the pair on Meteora, and the page holds it shut, with no address, in $WARM's title", () => {
  assert.equal(doorHref(PAIR), `https://app.meteora.ag/dlmm/${PAIR}`);
  const html = readFileSync(new URL('./warm.html', import.meta.url), 'utf8');
  const dt = html.match(/<dt>\$WARM <span>on chain: SWARM<\/span>(.*?)<\/dt>/)?.[1] ?? '';
  assert.equal(dt, '<a class="snowtrace-warm-door" data-warm-door target="_blank" rel="noopener" aria-label="Buy $WARM" hidden>Buy $WARM ↗</a>');
  assert.equal((html.match(/data-warm-door/g) || []).length, 1, 'one door');
  // her "What is $WARM?" reads the dd's by their order (dl-athena.js 'tokens'): the door is in no dd
  const tokens = html.match(/<dl class="snowtrace-tokens"[\s\S]*?<\/dl>/)?.[0] ?? '';
  assert.equal((tokens.match(/<dd>/g) || []).length, 2);
  assert.doesNotMatch(tokens.match(/<dd>[\s\S]*?<\/dd>/g).join(''), /warm-door/);
  // the paywall paints it at the line's causes, from the set's own module
  const paywall = readFileSync(new URL('./dl-paywall.js', import.meta.url), 'utf8');
  assert.match(paywall, /import \{WARM_PAIR\} from '\.\/warm-pair\.mjs';/);
  assert.match(paywall, /const paintMint = \(\) => \{[^\n]*paintDoor\(\); return m; \};/);
});

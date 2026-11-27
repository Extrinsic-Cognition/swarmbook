import test from 'node:test';
import assert from 'node:assert/strict';
import {mintFraction, mintSupplyLabel, mountMintLiquor} from './dl-mint-liquor.mjs';

test('only a verified NFT supply determines the amount of liquid', () => {
  const observed = {status: 'live', minted: 45, capacity: 150};
  assert.equal(mintFraction(observed), 0.3);
  assert.equal(mintFraction({...observed, status: 'stale'}), 0.3);
  assert.equal(mintFraction({...observed, minted: 0}), 0);
  for (const status of ['unknown', 'unconfigured', 'connecting', 'stopped']) {
    assert.equal(mintFraction({...observed, status}), null);
  }
  for (const bad of [{minted: -1}, {minted: 151}, {minted: 0.1}, {minted: null}, {capacity: 0}, {capacity: Infinity}]) {
    assert.equal(mintFraction({...observed, ...bad}), null);
  }
  assert.equal(mintFraction({paid: 45, capacity: 150, status: 'live'}), null);
});

test('unknown and stale observations are visibly distinct from an empty sale', () => {
  assert.equal(mintSupplyLabel({status: 'unconfigured'}), 'NFT minting is not live yet.');
  assert.equal(mintSupplyLabel({status: 'unknown'}), 'NFT mint count unavailable.');
  assert.match(mintSupplyLabel({status: 'live', minted: 0, capacity: 150}), /^0 \/ 150 NFTs/);
  assert.match(mintSupplyLabel({status: 'stale', minted: 45, capacity: 150}), /last verified count/);
});

test('an unconfigured mount loads no SDK and resolves as unavailable, including after pagehide', async () => {
  const originalFetch = globalThis.fetch;
  let resolveFetch;
  globalThis.fetch = () => new Promise(resolve => { resolveFetch = resolve; });
  const win = new EventTarget(), doc = new EventTarget();
  let scripts = 0;
  doc.defaultView = win; doc.hidden = false; doc.head = {append() { scripts++; }};
  doc.querySelector = () => null;
  doc.createElement = () => { scripts++; throw new Error('Unconfigured deployment must not load the SDK'); };
  const mount = mountMintLiquor({doc, win});
  try {
    win.dispatchEvent(new Event('pagehide'));
    resolveFetch({ok: true, json: async () => ({network: 'solana-mainnet-beta', unit: '0', deployment: null})});
    await mount.ready;
    assert.notEqual(mount.state().status, 'live');
    win.dispatchEvent(new Event('pageshow'));
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(mount.state().status, 'unconfigured');
    assert.equal(scripts, 0);
  } finally { await mount.destroy(); globalThis.fetch = originalFetch; }
});

test('online recovery retries a failed initial config fetch', async () => {
  const originalFetch = globalThis.fetch;
  let requests = 0;
  globalThis.fetch = async () => {
    if (++requests === 1) throw new Error('offline');
    return {ok: true, json: async () => ({network: 'solana-mainnet-beta', unit: '0', deployment: null})};
  };
  const win = new EventTarget(), doc = new EventTarget();
  doc.hidden = false; doc.querySelector = () => null;
  const mount = mountMintLiquor({doc, win});
  try {
    await mount.ready;
    assert.equal(mount.state().status, 'unknown');
    win.dispatchEvent(new Event('online'));
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(requests, 2);
    assert.equal(mount.state().status, 'unconfigured');
  } finally { await mount.destroy(); globalThis.fetch = originalFetch; }
});

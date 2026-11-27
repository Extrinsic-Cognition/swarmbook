// The glass observes NFT issuance. Payments and illustrated holders never enter this feed.
import {createMintSupplyReader} from './dl-mint-supply.mjs';

export function mountMintLiquor({doc = document, win = doc.defaultView} = {}) {
  let snapshot = Object.freeze({status: 'connecting', minted: null, capacity: null, slot: null});
  let reader = null, disposed = false, suspended = false, loading = null;
  const listeners = new Set();
  const publish = value => {
    if (disposed) return;
    snapshot = Object.freeze(value);
    const label = doc.querySelector('[data-mint-supply]');
    if (label) {
      label.dataset.state = value.status;
      label.textContent = mintSupplyLabel(value);
    }
    for (const listen of listeners) listen(snapshot);
  };
  const reconcile = () => { if (!doc.hidden && !suspended && !disposed) void (reader ? reader.reconcile() : bootstrap()); };
  const sdk = () => {
    if (win.solanaWeb3) return Promise.resolve(win.solanaWeb3);
    return new Promise((resolve, reject) => {
      const script = doc.createElement('script');
      script.src = new URL('./vendor/solana-web3-1.95.8.iife.min.js', import.meta.url).href;
      script.integrity = 'sha384-ujeTtvHxhu2g5lnu14Roii2ajvVKJ74KQ6eo6GGfAi0IrKZ1YkF8N68Iw5VmIJO0';
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve(win.solanaWeb3);
      script.onerror = () => reject(new Error('The Solana reader could not load'));
      doc.head.append(script);
    });
  };
  async function load() {
    try {
      const response = await fetch(new URL('./warm-genesis.json', import.meta.url), {cache: 'no-store', signal: AbortSignal.timeout(8000)});
      if (!response.ok) throw new Error('The mint deployment could not be read');
      const config = await response.json();
      if (disposed) return;
      // An unconfigured sale needs neither a wallet SDK nor a network connection.
      const web3 = config.deployment?.program ? await sdk() : null;
      if (disposed) return;
      const connection = web3 ? new web3.Connection('https://api.mainnet-beta.solana.com', 'finalized') : null;
      reader = createMintSupplyReader({config, connection, web3, onChange: publish});
      if (!suspended) await reader.start();
    } catch (error) { publish({...snapshot, status: 'unknown', reason: error.message}); }
  }
  function bootstrap() {
    if (!loading) {
      const job = load(); loading = job;
      void job.finally(() => { if (loading === job) loading = null; });
    }
    return loading;
  }
  const ready = bootstrap();
  doc.addEventListener('visibilitychange', reconcile);
  win.addEventListener('online', reconcile);
  const stop = () => { suspended = true; void reader?.stop(); };
  const resume = () => { suspended = false; if (!disposed) void (reader ? reader.start() : bootstrap()); };
  win.addEventListener('pagehide', stop); win.addEventListener('pageshow', resume);
  return {
    ready, state: () => reader?.state() ?? snapshot,
    listen(fn) { listeners.add(fn); fn(snapshot); return () => listeners.delete(fn); },
    async destroy() {
      disposed = true; listeners.clear();
      doc.removeEventListener('visibilitychange', reconcile); win.removeEventListener('online', reconcile);
      win.removeEventListener('pagehide', stop); win.removeEventListener('pageshow', resume);
      await reader?.stop();
    },
  };
}

export function mintSupplyLabel(snapshot) {
  if (mintFraction(snapshot) !== null) {
    const count = `${snapshot.minted} / ${snapshot.capacity} NFTs minted on Solana`;
    return snapshot.status === 'stale' ? `${count} · Updates unavailable; last verified count.` : count;
  }
  return snapshot?.status === 'unconfigured' ? 'NFT minting is not live yet.'
    : snapshot?.status === 'connecting' ? 'Reading NFT mint count…' : 'NFT mint count unavailable.';
}

// Unknown is not an empty sale. A stale observation may stay visible, but cannot add a drop.
export function mintFraction(snapshot) {
  if (!['live', 'stale'].includes(snapshot?.status) || !Number.isSafeInteger(snapshot.minted)
    || !Number.isSafeInteger(snapshot.capacity) || snapshot.capacity <= 0
    || snapshot.minted < 0 || snapshot.minted > snapshot.capacity) return null;
  return snapshot.minted / snapshot.capacity;
}

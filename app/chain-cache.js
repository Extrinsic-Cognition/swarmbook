// Public chain observations only. IndexedDB keeps binary account data off the
// synchronous localStorage path; parsers rebuild BigInts, keys and voice readers.
const SCHEMA = 1;
export const CACHE_FRESH_MS = 60_000;
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
export const isFresh = (at, maxAgeMs, now = Date.now()) => Number.isFinite(at) && at > 0 && now >= at && now - at < maxAgeMs;
export const snapshotScope = (rpc, generations) => JSON.stringify([rpc, generations.map(g => [g.layout, g.P.PROGRAM_ID.toBase58()])]);

export function validSnapshot(value, now = Date.now()) {
  return value && isFresh(value.scannedAt, MAX_AGE_MS, now) && isFresh(value.savedAt, MAX_AGE_MS, now)
    && value.savedAt >= value.scannedAt && Array.isArray(value.generations) && value.generations.length > 0
    && value.generations.every(g => g && typeof g.program === 'string' && Number.isInteger(g.layout)
      && Number.isSafeInteger(g.slot) && g.slot >= 0 && Number.isFinite(g.balancesAt) && g.balancesAt >= 0 && g.balancesAt <= now
      && Array.isArray(g.accounts) && g.accounts.length <= 50_000
      && g.accounts.every(a => a && typeof a.address === 'string' && a.data instanceof Uint8Array
        && (a.slot === undefined || (Number.isSafeInteger(a.slot) && a.slot >= 0))
        && Number.isSafeInteger(a.lamports) && a.lamports >= 0)
      && Array.isArray(g.balances) && g.balances.every(b => Array.isArray(b) && /^\d+$/.test(b[0]) && Number.isSafeInteger(b[1]) && b[1] >= 0));
}

// Storage denial, quota errors, a blocked upgrade or corrupt data are cache
// misses. None may prevent the ordinary network reader from starting.
export function createSnapshotStore(scope, { indexedDB = globalThis.indexedDB } = {}) {
  let opening;
  const open = () => opening ||= new Promise(resolve => {
    if (!indexedDB) { resolve(null); return; }
    let request, settled = false;
    const finish = db => { if (settled) { db?.close(); return; } settled = true; clearTimeout(timer); resolve(db); };
    const timer = setTimeout(() => finish(null), 500);
    try {
      request = indexedDB.open('poleis-public-chain', 1);
      request.onupgradeneeded = () => { if (!request.result.objectStoreNames.contains('snapshots')) request.result.createObjectStore('snapshots'); };
      request.onsuccess = () => { request.result.onversionchange = () => request.result.close(); finish(request.result); };
      request.onerror = request.onblocked = () => finish(null);
    } catch { finish(null); }
  });
  const transact = async (mode, run) => {
    const db = await open();
    if (!db) return null;
    return new Promise(resolve => {
      let tx, result = null, done = false;
      const finish = value => { if (!done) { done = true; clearTimeout(timer); resolve(value); } };
      const timer = setTimeout(() => { try { tx?.abort(); } catch {} finish(null); }, 500);
      try {
        tx = db.transaction('snapshots', mode);
        tx.oncomplete = () => finish(result);
        tx.onabort = tx.onerror = () => finish(null);
        run(tx.objectStore('snapshots'), value => { result = value; });
      } catch { finish(null); }
    });
  };
  return {
    async read() {
      const record = await transact('readonly', (store, done) => {
        const request = store.get(scope); request.onsuccess = () => done(request.result);
      });
      return record?.schema === SCHEMA && record.scope === scope && validSnapshot(record.value) ? record.value : null;
    },
    async write(value) {
      if (!validSnapshot(value)) return false;
      return !!await transact('readwrite', (store, done) => {
        const request = store.get(scope);
        request.onsuccess = () => {
          const record = request.result;
          const previous = record?.schema === SCHEMA && record.scope === scope && validSnapshot(record.value) ? record.value : null;
          // Another tab can finish a newer scan while this one is writing.
          if (previous?.scannedAt > value.scannedAt || previous?.savedAt > value.savedAt) return;
          try { store.put({ schema: SCHEMA, scope, value }, scope); done(true); } catch { /* quota or storage denial: no cache */ }
        };
      });
    },
  };
}

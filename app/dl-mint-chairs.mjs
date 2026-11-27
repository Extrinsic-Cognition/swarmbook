// dl-mint-chairs.mjs: THE TWELVE CHAIRS' READER (the law: mint-chairs.mjs). The Worker ranks the seven days' top donors at each request
// (GET /api/premint/chairs); the page asks once at its load and again at a cause: a purchase said by dl-premint-paid (the buyer's own chair
// may light), the page shown again, the network back. One read at a time, a cause during it reads once more after it; no timer, no poll.
// What it hands the glass (lab/mint-liquor-scene.mjs setSeats, through lab/unboxing.js) is ranks and dollars, and a name and avatar only
// where he rules "profile": never a wallet. Unreadable is 'unknown', which holds no chair; a failed read keeps the last answer (an outage
// never empties a chair).
import {chairsOf} from './mint-chairs.mjs';

export function mountMintChairs({doc = document, win = doc.defaultView, fetcher = (...request) => win.fetch(...request)} = {}) {
  let snapshot = Object.freeze({status: 'connecting', held: []}), pending = null, again = false, disposed = false;
  const listeners = new Set();
  const publish = value => {
    if (disposed) return;
    snapshot = Object.freeze(value);
    for (const listen of listeners) listen(snapshot);
  };
  async function read() {
    try {
      const response = await fetcher('/api/premint/chairs', {cache: 'no-store', signal: AbortSignal.timeout(10000)});
      if (!response.ok) throw new Error(`chairs answered ${response.status}`);
      publish(chairsOf(await response.json()));
    } catch { if (snapshot.status !== 'live') publish({status: 'unknown', held: []}); }
  }
  function refresh() {
    if (disposed || doc.hidden) return pending ?? Promise.resolve(snapshot);
    if (pending) { again = true; return pending; }
    const job = read().finally(() => {
      pending = null;
      if (again && !disposed) { again = false; void refresh(); }
    });
    pending = job;
    return job;
  }
  const shown = () => { if (!doc.hidden) void refresh(); };
  const ready = refresh();
  win.addEventListener('dl-premint-paid', refresh);
  win.addEventListener('online', refresh);
  doc.addEventListener('visibilitychange', shown);
  return {
    ready, state: () => snapshot, refresh,
    listen(fn) { listeners.add(fn); fn(snapshot); return () => listeners.delete(fn); },
    destroy() {
      disposed = true; listeners.clear();
      win.removeEventListener('dl-premint-paid', refresh); win.removeEventListener('online', refresh);
      doc.removeEventListener('visibilitychange', shown);
    },
  };
}

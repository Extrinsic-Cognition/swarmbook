// app/dl-flask-grant.mjs · A FLASK LETS ITS HARMONY SPEND, the page's ask (Nov 19 2026, lane/a-flask-lets-its-harmony-spend; the law and his words:
// space-router-grant.mjs). A Harmony's link opens the deposit door with an ask in its query (?door=deposit&grant=<its key's sha256>&name=&cap=&days=). A browser
// whose flask is filled is asked once, in the door's own box and its own three parts (the stamp, the chip, the line): who may spend, how much a day, how long.
// The press signs the grant's text with the flask's key, which never leaves this browser, and posts it. Loaded only when the query carries an ask.
import { GRANT_PATH, grantAsk, grantSignIn, sealGrantProof } from './space-router-grant.mjs';

/** The ask a link's query carries, or null: only what the law lets an ask name, so nothing of the query is shown that the law did not read */
export const grantOf = (search) => { const q = new URLSearchParams(search); return q.has('grant') ? grantAsk({ key: q.get('grant'), label: q.get('name'), cap: q.get('cap'), days: q.get('days') }) : null; };
/** The box's three lines for an ask (pure) */
export const grantWords = ({ label, cap, days }) => ({ stamp: `Let ${label} spend`, chip: `Up to $${cap} a day · ${days} days · Let it`, done: 'Done. Go back to Harmony.', no: 'Not let in. Try again.' });

/** ask({ after, flask, grant, fetch, doc, loc }): the box, after `after`; resolves true once the door has written the grant, and 'fill' when the flask holds nothing yet */
export function ask({ after, flask, grant, fetch: f = globalThis.fetch, doc = document, loc = location }) {
  const box = doc.createElement('div'), w = grantWords(grant); box.className = 'snowtrace-kit-link';
  box.innerHTML = '<p class="dl-flask-stamp"></p><button type="button" class="dl-flask-addr"></button><p class="snowtrace-kit-say" role="status"></p>';
  const [stamp, chip, say] = box.children; stamp.textContent = w.stamp; chip.textContent = w.chip; after.after(box);
  return new Promise((done) => chip.addEventListener('click', async () => {
    if (chip.disabled) return; chip.disabled = true; let status = 0, body = null;
    try {
      const text = grantSignIn({ host: loc.host, origin: loc.origin, address: flask.address, ...grant });
      const proof = sealGrantProof(text, new Uint8Array(await crypto.subtle.sign('Ed25519', flask.pair.privateKey, new TextEncoder().encode(text))));
      const r = await f(GRANT_PATH, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ proof }), cache: 'no-store' }); status = r.status; body = await r.json().catch(() => null);
    } catch { status = 0; }
    if (status === 200 || status === 201) { say.textContent = w.done; box.dataset.at = 'granted'; return done(true); }
    if (status === 402) { box.remove(); return done('fill'); }
    say.textContent = typeof body?.error?.message === 'string' ? body.error.message : w.no; chip.disabled = false;
  }));
}

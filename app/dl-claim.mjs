// dl-claim.mjs: THE CLAIM PAGE (app/claim.html; Oct 16 2026). The QR on a paid seat's card (dl-seat-card.mjs) is a link here with the claim
// code in its fragment (dl-society-codes.mjs claimURL: no server log holds it), opened by a phone's camera, or the Mac's Eye one day: this page
// shows the code large, copies it in a press, and names the installer's doors (app/nestos-release.json, a published release; unpublished, it
// says so). It sends nothing anywhere. Harmony's box takes the code typed (room/box-ticket-claim.mjs). The words are mine, his to reword.
import {CLAIM_LENGTH, normalizeCode, groupCode} from './dl-society-codes.mjs';
import {installLinks, MANIFEST} from './dl-seat-card.mjs';

/** The claim code a page's fragment carries (#<code>, grouped or not), or null. */
export function claimOfHash(hash) { return normalizeCode(String(hash ?? '').replace(/^#/, ''), CLAIM_LENGTH); }

export async function mountClaimPage({doc = globalThis.document, win = globalThis.window, fetcher = (...a) => fetch(...a), clipboard = globalThis.navigator?.clipboard} = {}) {
  const code = claimOfHash(win.location.hash);
  const codeEl = doc.getElementById('claim-code'), copy = doc.getElementById('claim-copy'), status = doc.getElementById('claim-status'), install = doc.getElementById('claim-install'), none = doc.getElementById('claim-none');
  codeEl.textContent = code ? groupCode(code) : '—';
  copy.hidden = !code; none.hidden = Boolean(code);
  copy.addEventListener('click', async () => {
    try { if (typeof clipboard?.writeText !== 'function') throw new Error('clipboard unavailable'); await clipboard.writeText(code); status.textContent = 'Code copied.'; }
    catch { status.textContent = 'Couldn’t copy the code. Type it in Harmony.'; }
  });
  let links = [];
  try { const r = await fetcher(MANIFEST, {cache: 'no-store'}); links = r?.ok ? installLinks(await r.json()) : []; } catch { links = []; }
  const items = links.length ? links.map((l) => { const a = doc.createElement('a'); a.href = l.href; a.rel = 'noopener'; a.textContent = l.label; return a; })
    : [Object.assign(doc.createElement('span'), {textContent: 'Harmony’s installer isn’t published yet. Keep your code: it stays yours.'})];
  install.replaceChildren(...items);
  return {code, links};
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') void mountClaimPage();

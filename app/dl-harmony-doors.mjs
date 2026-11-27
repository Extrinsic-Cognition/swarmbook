// dl-harmony-doors.mjs: THE DOORS TO HARMONY (his Oct 22 2026 14:0x WEST: "we would require some ui button for people to download the harmony app,
// perhaps right under this hero rich, we should have 2 large themed buttons with download and github page"; 14:2x, of the download: "i want it to be
// complete with a live link that has a cookie in the installer so we know when the user logs into harmony which browser session it was"; 14:3x: "you
// gotta track state on whether athena appeared or not before they clicked the download button").
// The download's link is the installer a published release names for this desktop (nestos-release.json, read by the seat card's installLinks). A
// press writes the visit's record of it (dl-visit.mjs: what Athena had done before it) and, before the browser leaves, stamps the address with the
// visit's id and that answer (?s=<visit>&a=<athena>). macOS keeps a download's address with the file it brought (its quarantine record): that is
// the cookie in the installer, read where Harmony first opens. Unpublished, the door says it opens with its release; a phone gets no installer.
// THE LOCAL ROAD (his "make me debug locally"): on this machine's own loopback, ?harmony=local reads nestos-release.local.json, whose installer may
// be served over plain http from the loopback (never anywhere else).
import {installLinks, MANIFEST} from './dl-seat-card.mjs?v=society-1';
import './dl-visit.mjs?v=visit-1';   // the visit, mounted once with the entry's own import of it
import {ATHENA_STATES, VISIT_PARAM, ATHENA_PARAM, HER_PARAM, NAME_PARAM, isHerName} from './harmony-link.mjs'; import {kept} from './dl-her-colours.mjs'; import {herColours} from './dl-her-reel.mjs';   // THE LINK: the words both halves read; her making as the page keeps it

export const LOCAL_MANIFEST = './nestos-release.local.json';
// THE GATE (his Oct 22 2026 WEST: "let's ensure people cannot progress unless they installed the harmony app and did the lyssajudron dmc4
// tutorial"; armed with the installer): armed while a release names an installer; then a seat waits for this visit's download to open as Harmony
// and see her saved there (the Worker's install door, worker/premint.mjs THE INSTALL, which refuses the order all the same). Asked once at the
// load, after a press every POLL_MS for POLL_FOR_MS while the page is seen, and on the page's return; told as GATE_EVENT on the document.
export const GATE_EVENT = 'dl-gate', POLL_MS = 5000, POLL_FOR_MS = 30 * 60e3, NAME_MS = 400;
export {ATHENA_STATES};
const LOOPBACK = /^(localhost|127\.\d{1,3}\.\d{1,3}\.\d{1,3}|\[::1\])$|\.localhost$/i;

/** desktopOf(nav): the desktop this browser runs on, as a release names it (macos, windows, linux); null on a phone or a tablet. Pure. */
export function desktopOf(nav = globalThis.navigator) {
  const ua = nav?.userAgentData, p = ua?.platform || nav?.platform || '', agent = nav?.userAgent || '';
  if (ua?.mobile || /android|iphone|ipad|ipod/i.test(agent) || (/mac/i.test(p) && nav?.maxTouchPoints > 1)) return null;   // an iPad says Mac, and touches
  return /mac/i.test(p) ? 'macos' : /win/i.test(p) ? 'windows' : /linux/i.test(p) ? 'linux' : null;
}
/** localRoad(loc): whether this page may read the local release (?harmony=local on this machine's loopback). Pure. */
export const localRoad = (loc) => LOOPBACK.test(loc?.hostname ?? '') && new URLSearchParams(loc?.search ?? '').get('harmony') === 'local';
/** localLinks(manifest): installLinks, but an installer on the loopback may be plain http (the local road's own release only). Pure. */
export function localLinks(manifest) {
  if (manifest?.schema !== 'nestos.release.v1' || manifest.status !== 'published') return [];
  return Object.entries(manifest.platforms ?? {}).map(([platform, v]) => {
    try { const u = new URL(v && typeof v === 'object' ? v.url : v); return (u.protocol === 'https:' || (u.protocol === 'http:' && LOOPBACK.test(u.hostname))) && !u.username && !u.password ? {platform, label: platform, href: u.href} : null; } catch { return null; }
  }).filter(Boolean);
}
/** downloadURL(href, visit, athena, her): the installer's address stamped with the visit's id, what Athena had done before the press, her colours, and beside them her name. Pure. */
export function downloadURL(href, visit, athena, her = null, name = null) {
  const u = new URL(href);
  if (visit) u.searchParams.set(VISIT_PARAM, visit);
  if (ATHENA_STATES.includes(athena)) u.searchParams.set(ATHENA_PARAM, athena); if (herColours(her)) u.searchParams.set(HER_PARAM, herColours(her));
  if (her && isHerName(name)) u.searchParams.set(NAME_PARAM, name);
  return u.href;
}

export const linksOf = async (win, fetcher, road = localRoad(win.location)) => { try { const r = await fetcher(new URL(road ? LOCAL_MANIFEST : MANIFEST, import.meta.url), {cache: 'no-store'}); return r.ok ? (road ? localLinks : installLinks)(await r.json()) : []; } catch { return []; } };   // linksOf(win, fetcher): the installers the release names (published; the local road's on this machine's loopback), [] for none or a read that fails
export const rideTo = async (plate, {win = window, fetcher = (...a) => fetch(...a), storage = (() => { try { return win.localStorage; } catch { return null; } })()} = {}) => {   // rideTo(plate, ...): THE RIDE (Nov 23 2026): the red hexagon's last plate given this desktop's installer once a published release names one, its press stamped as a door's; no gate.
  const platform = desktopOf(win.navigator), href = (await linksOf(win, fetcher)).find((l) => l.platform === platform)?.href; if (!plate || !href) return null;
  plate.href = href; plate.removeAttribute('aria-disabled'); plate.addEventListener('click', () => { const press = win.dlVisit?.download(platform) ?? null; plate.href = downloadURL(href, press?.id, press?.athena, kept(storage)); }); return href; };
/** mountDoors({win, doc, fetcher}): the download door given its link (or its word that it is not open yet); window.dlDoors.state(). */
export async function mountDoors({win = window, doc = document, fetcher = (...a) => fetch(...a), storage = (() => { try { return win.localStorage; } catch { return null; } })()} = {}) {
  const door = doc.querySelector('[data-harmony-download]'), note = door?.querySelector('[data-harmony-download-note]');
  const S = {road: localRoad(win.location) ? 'local' : 'release', platform: desktopOf(win.navigator), door: null, presses: 0, last: null,
    gate: {armed: false, installed: false, saved: false, asked: 0}};
  let polling = 0, pollUntil = 0;
  // THE GATE'S WORD for this visit (the Worker's install door): whether its download opened as Harmony, and whether she was saved there
  async function check() {
    const visit = win.dlVisit?.state?.().id;
    if (!S.gate.armed || S.gate.saved || !visit) return S.gate;
    try {
      const r = await fetcher(`/api/premint/install?visit=${visit}`, {cache: 'no-store'}), body = r.ok ? await r.json() : null;
      S.gate.asked++;
      const next = {installed: Boolean(body?.install?.installed), saved: Boolean(body?.install?.saved)};
      if (next.installed !== S.gate.installed || next.saved !== S.gate.saved) { Object.assign(S.gate, next); doc.dispatchEvent(new win.CustomEvent(GATE_EVENT, {detail: {...S.gate}})); }
    } catch { /* the Worker out of reach: the gate keeps its last word */ }
    if (S.gate.saved) win.clearInterval(polling);
    return S.gate;
  }
  const poll = () => {   // after a press: asked every POLL_MS while the page is seen, for POLL_FOR_MS at most; then on the page's return alone
    pollUntil = Date.now() + POLL_FOR_MS;
    if (polling) return;
    polling = win.setInterval(() => { if (Date.now() > pollUntil || S.gate.saved) { win.clearInterval(polling); polling = 0; return; } if (!doc.hidden) void check(); }, POLL_MS);
  };
  // lead(): the way to Harmony shown (a seat pressed while the gate holds, her stop's door): the doors brought into view, the download called
  const lead = () => {
    const doors = doc.querySelector('#harmony-doors');
    doors?.scrollIntoView({behavior: win.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'center'});
    if (note && S.gate.armed) note.textContent = 'Meet the Lyssajudron in DysonLight Harmony first';
    door?.classList.remove('dl-harmony-door-called'); void door?.offsetWidth; door?.classList.add('dl-harmony-door-called');
  };
  win.dlDoors = {state: () => ({...S, gate: {...S.gate}}), lead, check};
  if (!door) return win.dlDoors;
  const links = await linksOf(win, fetcher);
  S.door = links.find((l) => l.platform === S.platform)?.href ?? null;
  S.gate.armed = links.length > 0;   // armed by a published installer, whatever this browser runs on (the Worker's gate reads the same release)
  if (S.gate.armed) { void check(); doc.addEventListener('visibilitychange', () => { if (!doc.hidden) void check(); }); }
  if (!S.door) {
    if (note) note.textContent = S.platform ? 'Opens with its release' : 'For macOS, Windows and Linux';
    return win.dlDoors;
  }
  door.href = S.door; door.removeAttribute('aria-disabled');
  if (note) note.textContent = `${{macos: 'For macOS', windows: 'For Windows', linux: 'For Linux'}[S.platform]}${S.road === 'local' ? ' · the local build' : ''}`;
  door.addEventListener('click', async (e) => {   // the press: the visit's record first, then the address the browser is about to take carries it
    const press = win.dlVisit?.download(S.platform) ?? null, her = kept(storage), ask = her && !(e?.metaKey || e?.ctrlKey || e?.shiftKey) && win.DL_HER_NAME, stamp = (name) => { door.href = downloadURL(S.door, press?.id, press?.athena, her, name); };   // HER COLOURS CROSS INTO HARMONY: the making kept at her last stroke
    stamp(null);
    S.presses++; S.last = {athena: press?.athena ?? null, href: door.href};
    if (S.gate.armed) poll();
    if (typeof ask !== 'function') return;   // no name to wait for: the browser takes the address as it stands
    e?.preventDefault?.();   // HER ONE NAME: asked of the flask for NAME_MS at most, then the press goes on, with it or without
    stamp(await Promise.race([Promise.resolve().then(() => ask.call(win)).catch(() => null), new Promise((go) => setTimeout(go, NAME_MS, null))]));
    S.last.href = door.href; win.location.assign(door.href);
  });
  return win.dlDoors;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') mountDoors();

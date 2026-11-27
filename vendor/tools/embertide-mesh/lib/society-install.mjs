// society-install.mjs: THE INSTALL'S VISIT (Oct 22 2026; the page's side: embertide-app/ui/intro/dyson-society/app/dl-visit.mjs and
// dl-harmony-doors.mjs; the Worker's door: dyson-society/worker/premint.mjs THE INSTALL). His words, Oct 22 2026 14:2x WEST, over the download:
// "i want it to be complete with a live link that has a cookie in the installer so we know when the user logs into harmony which browser session
// it was"; 14:3x: "you gotta track state on whether athena appeared or not before they clicked the download button"; his pick, the download record.
// The page stamps DysonLight Harmony's installer address with its visit (?s=), what Athena had done before the press (?a=) her colours and her name (?h= and ?n=, laid below), and macOS keeps
// that address with the download in its quarantine record (~/Library/Preferences/com.apple.LaunchServices.QuarantineEventsV2). Here, where
// Harmony first opens: findDownload reads that database read-only and asks it for the installer's own rows alone (its file name, from an allowed
// origin), never another download; the newest names the visit, kept with a secret of this install's own (~/.embertide/society/install.json, 0600 in a 0700
// folder, beside the seat's ticket), and her colours are laid. NOTHING LEAVES UNASKED (Nov 24 2026, his Oct 15 "we should have 0 telemetry policy unless opted-in",
// over the stranger's image that told the site at its first launch): only the person's yes (tell) reports the visit, once, as 'installed' to the Worker the installer
// came from (the site's; the mint's dev server's for the local road; `site` names another), and then, once she is saved here (her paint's `opened`), as 'saved', the
// page's gate's word. The yes's press in a stranger's Harmony is owed before purchases reopen (the gate holds every visit until then); this file run by hand is the local road's yes. Nothing else of the Mac leaves: the visit's id, Athena's answer and how it was found.
//   node lib/society-install.mjs [--site <origin>] [--find-only] [--state <file>] [--nest http://127.0.0.1:8904]
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { SITE, INSTALLER_NAMES, INSTALLER_ORIGINS, VISIT_PARAM, ATHENA_PARAM, HER_PARAM, NAME_PARAM, INSTALL_PATH, isVisitId, isHerName, ATHENA_STATES } from '../../../embertide-app/ui/intro/dyson-society/app/harmony-link.mjs';   // THE LINK: the page's and the Worker's one contract
import { encode58 } from '../../../embertide-app/ui/intro/dyson-society/app/dl-direct-protocol.mjs';
import { herOfColours } from '../../../embertide-app/ui/intro/dyson-society/app/dl-her-reel.mjs'; import { refs } from '../../../embertide-app/ui/intro/dyson-society/app/dl-her-colours.mjs';   // HER COLOURS: the address's word read, her two refs made as the mint makes them

export { SITE, INSTALLER_NAMES };
export const ORIGINS = INSTALLER_ORIGINS;   // the site, and the mint's dev server (harmony-link.mjs)
// the logged-in user's own record, whatever HOME a copy of this server was given (os.userInfo, not the environment)
export const QUARANTINE_DB = path.join(os.userInfo().homedir, 'Library/Preferences/com.apple.LaunchServices.QuarantineEventsV2');
export const STATE_SCHEMA = 'society.install/1';
export const PAINT_REF = 'scene/entities/golem-lyssajudron-paint', LIGHT_REF = 'scene/entities/golem-lyssajudron-light';   // harmony-first-door.mjs PAINT_REF: `opened` is her saved; her light beside it
const MAC_EPOCH_S = 978307200;   // a quarantine time is seconds since 2001-01-01
const plain = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

/** visitOfURL(url, origins, names): the visit, Athena's answer, her colours and her name (each when valid) an installer's address carries, when it is the installer's, from an allowed origin. Pure. */
export function visitOfURL(url, origins = ORIGINS, names = INSTALLER_NAMES) {
  let u; try { u = new URL(url); } catch { return null; }
  if (!origins.includes(u.origin) || !names.includes(decodeURIComponent(u.pathname.split('/').pop() || ''))) return null;
  const visit = u.searchParams.get(VISIT_PARAM), athena = u.searchParams.get(ATHENA_PARAM), her = herOfColours(u.searchParams.get(HER_PARAM)), name = u.searchParams.get(NAME_PARAM);
  return isVisitId(visit) ? { visit, athena: ATHENA_STATES.includes(athena) ? athena : null, origin: u.origin, ...(her ? { her, ...(isHerName(name) ? { name } : {}) } : {}) } : null;
}
/** findDownload({db, origins, names, open}): the newest download of the installer this Mac's quarantine record holds, {visit, athena, origin, url, at, agent}, or null.
 *  The query names the installer's file; no other row is read. */
export function findDownload({ db = QUARANTINE_DB, origins = ORIGINS, names = INSTALLER_NAMES, open = (file) => new DatabaseSync(file, { readOnly: true }) } = {}) {
  let conn; try { conn = open(db); } catch { return null; }
  try {
    const rows = conn.prepare(`SELECT LSQuarantineTimeStamp AS t, LSQuarantineDataURLString AS url, LSQuarantineAgentName AS agent FROM LSQuarantineEvent WHERE ${names.map(() => 'LSQuarantineDataURLString LIKE ?').join(' OR ')} ORDER BY LSQuarantineTimeStamp DESC LIMIT 16`)
      .all(...names.map((n) => `%/${n}?%`));
    for (const r of rows) { const v = visitOfURL(r.url, origins, names); if (v) return { visit: v.visit, athena: v.athena, origin: v.origin, url: r.url, at: Math.round((r.t + MAC_EPOCH_S) * 1000), agent: r.agent ?? null, ...(v.her ? { her: v.her, ...(v.name ? { name: v.name } : {}) } : {}) }; }
    return null;
  } catch { return null; } finally { conn.close(); }
}

// site: the Worker every report goes to; unnamed, the one the installer came from (a download from the mint's dev server reports to it, not to the site)
export function createSocietyInstall({ site = null, stateFile, nestURL, fetch: fetcher = globalThis.fetch, now = Date.now, log = () => {}, find = findDownload, timeoutMs = 8000 } = {}) {
  if (typeof stateFile !== 'string' || !stateFile) throw new TypeError('the state file is where the install\'s secret lives');
  if (typeof fetcher !== 'function') throw new TypeError('fetch is required');
  const named = site ? new URL(site).origin : null, nest = String(nestURL || '').replace(/\/$/, '');
  function readState() {
    try { const v = JSON.parse(fs.readFileSync(stateFile, 'utf8')); return plain(v) && v.schema === STATE_SCHEMA && typeof v.install === 'string' ? v : null; } catch { return null; }
  }
  function writeState(state) {
    fs.mkdirSync(path.dirname(stateFile), { recursive: true, mode: 0o700 });
    const tmp = `${stateFile}.${process.pid}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(state), { mode: 0o600 });
    fs.renameSync(tmp, stateFile);
  }
  const abortIn = (ms) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), ms); t.unref?.(); return { signal: c.signal, done: () => clearTimeout(t) }; };
  async function report(st, event, extra = {}) {   // the Worker's install door (the one 'installed' went to): the visit, this install's secret, and the event
    const a = abortIn(timeoutMs);
    try {
      const r = await fetcher(`${st.site}${INSTALL_PATH}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ visit: st.visit, install: st.install, event, ...extra }), signal: a.signal });
      const body = await r.json().catch(() => ({}));
      if (!r.ok) throw Object.assign(new Error(body.error || `the install door answered ${r.status}`), { status: r.status });
      return body.install;
    } finally { a.done(); }
  }
  /** firstLaunch(): the installer's download record read and kept here (the newest, until the yes), her colours laid; nothing leaves (tell is the yes). The state, or null with no record. */
  async function firstLaunch() {
    const kept = readState();
    if (kept?.installedAt) { if (kept.herOwed) await lay(kept, kept.herOwed); return kept; }   // her colours owed from a first launch that found no Nest
    const found = find();
    if (!found) { log('society install: no download record of DysonLight Harmony\'s installer on this Mac'); return null; }
    const st = { schema: STATE_SCHEMA, install: kept?.install || encode58(crypto.getRandomValues(new Uint8Array(32))), visit: found.visit, athena: found.athena, via: 'quarantine', site: named || found.origin, downloadedAt: found.at };
    if (kept?.herAt) st.herAt = kept.herAt; writeState(st);   // the secret first: a report that lands and an answer that is lost still have their install
    if (found.her && !st.herAt) await lay(st, { her: found.her, name: found.name }); return st;
  }
  /** tell(): the person's yes (NOTHING LEAVES UNASKED): the visit kept here reported once as 'installed' with Athena's answer; her saved is told after it (checkSaved). The state. */
  async function tell() {
    const st = readState(); if (!st?.visit || st.yesAt) return st;
    await report(st, 'installed', { athena: st.athena, via: st.via }); st.installedAt = st.yesAt = now(); writeState(st); log(`society install: visit ${st.visit} told to ${st.site} on its yes (Athena before the press: ${st.athena ?? 'not said'})`); return st;
  }
  // HER COLOURS CROSS INTO HARMONY (Nov 22 2026): her two refs, as the mint's refs() makes them in Harmony's own shapes, each laid only where none stands (expect 0: the
  // Nest's compare-and-swap against absence), under one birth, HER ONE NAME as the flask says it (the same on every Mac and on X's road; drawn here only where none came): a paint with none is bared by the onboarding's unbox, one with a birth is brought as she stands. `from` says the download, never the visit's id (a record may go public).
  const lay = (st, owed) => layHer(owed.her, owed.name).then(() => { delete st.herOwed; st.herAt = now(); }, (e) => { st.herOwed = owed; log(`society install: her colours from the site were not laid (${e.message})`); }).then(() => writeState(st));
  async function layHer(her, name) {
    const v = refs(her, { at: new Date(now()).toISOString(), by: 'mac' }), birth = name || now().toString(36) + Math.random().toString(36).slice(2, 8);
    for (const [ref, value] of [[LIGHT_REF, v.light], [PAINT_REF, v.paint]]) {
      const r = await fetcher(`${nest}/nest/ref/${ref}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ seat: 'mac', value: { ...value, from: 'optimism.fit/download', birth }, expect: 0, cause: [] }), signal: AbortSignal.timeout(timeoutMs) });
      if (!r.ok && r.status !== 409) throw new Error(`the Nest answered ${r.status} on ${ref}`);
    }
  }
  async function readPaint() {
    const a = abortIn(timeoutMs);
    try { const r = await fetcher(`${nest}/nest/ref/${PAINT_REF}`, { signal: a.signal }); return r.ok ? (await r.json())?.ref?.value ?? null : null; } catch { return null; } finally { a.done(); }
  }
  /** checkSaved(): after the yes, once her paint says opened, the visit is reported 'saved' (once). The state. */
  async function checkSaved() {
    const st = readState();
    if (!st?.yesAt || st.savedAt) return st;   // an install told before NOTHING LEAVES UNASKED carries no yes: nothing more of it leaves
    if (!(await readPaint())?.opened) return st;
    await report(st, 'saved');
    st.savedAt = now(); writeState(st);
    log('society install: she is saved here; the page\'s gate opens for its visit');
    return st;
  }
  /** watchSaved({signal}): the Nest's stream of her paint heard until she is saved (then nothing at rest); each change asks checkSaved. */
  async function watchSaved({ signal } = {}) {
    const st = readState();
    if (!st?.yesAt || st.savedAt || !nest) return;
    try {
      const r = await fetcher(`${nest}/nest/stream?types=ref&refs=${encodeURIComponent(PAINT_REF)}`, { signal, headers: { accept: 'text/event-stream' } });
      const reader = r.body.getReader(), decoder = new TextDecoder(); let buffer = '';
      for (;;) {
        const { value, done } = await reader.read(); if (done) return;
        buffer += decoder.decode(value, { stream: true });
        if (!buffer.includes('\n\n')) continue;
        buffer = buffer.slice(buffer.lastIndexOf('\n\n') + 2);
        if ((await checkSaved())?.savedAt) { await reader.cancel(); return; }
      }
    } catch (e) { if (!signal?.aborted) log(`society install: her paint is not heard (${e.message})`); }
  }
  return { firstLaunch, tell, checkSaved, watchSaved, state: readState };
}

// THE LOCAL ROAD's hand: "first launch" and the yes played by hand, the run itself the yes (a download from the mint's dev server reports to it), its own state
// file beside the dev server's unless the download was the site's (Harmony's own stays in its home)
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
  const site = opt('--site', null), origins = site ? [...new Set([...ORIGINS, new URL(site).origin])] : ORIGINS;
  if (args.includes('--find-only')) { console.log(JSON.stringify(findDownload({ origins }), null, 1)); }
  else {
    const local = (site ? new URL(site).origin : findDownload({ origins })?.origin ?? null) !== SITE;
    const stateFile = opt('--state', local ? path.join(os.homedir(), 'Library/Caches/gg.embertide.mint-dev/install.json') : path.join(os.homedir(), '.embertide/society/install.json'));
    const door = createSocietyInstall({ site, stateFile, nestURL: opt('--nest', 'http://127.0.0.1:8904'), log: (m) => console.log(m), find: () => findDownload({ origins }) });
    const st = await door.firstLaunch().then(() => door.tell()).then(() => door.checkSaved()).catch((e) => { console.log(`society install: ${e.message}`); return null; });
    console.log(JSON.stringify({ ...(st ?? {}), install: st?.install ? '(kept, secret)' : undefined }, null, 1));
  }
}

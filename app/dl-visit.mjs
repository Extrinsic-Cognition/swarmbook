// dl-visit.mjs: THE VISIT (Oct 22 2026). This browser's visit to the Society's page under one id, kept here (localStorage, and a first-party cookie
// a server of this site can read), and what happened in it that a press on Download Harmony must carry (his 14:3x WEST: "you gotta track state on
// whether athena appeared or not before they clicked the download button"). Her overlay tells its moments as events on the document
// (dl-athena.js SEEN_EVENT: coming, entered, skipped, read, landed, seats, harmony); this keeps the first time of each across reloads (a reload restarts the
// story, the visit stays) and counts her entrances. athenaBefore(visit, at) says what she had done before a moment: none (never seen), coming (her
// lyssajudron only), entered (her entrance under way), skipped or whole (her entrance done, cut short or whole: a scroll that read on, dl-athena.js
// READ_ON, cuts it short as her Skip does, in the link's own words), still (she landed with no entrance: a reader who asked for less motion). Nothing leaves this browser from here: the press's own address carries the id and the answer
// (dl-harmony-doors.mjs).
import {randomCode} from './dl-society-codes.mjs';
import {VISIT_LENGTH, ATHENA_STATES, isVisitId} from './harmony-link.mjs';
export {VISIT_LENGTH, ATHENA_STATES, isVisitId};   // the link's own words (harmony-link.mjs), which Harmony and the Worker read too

export const SEEN_EVENT = 'dl-athena';   // dl-athena.js's own word (its test holds the two to one); named here, not imported: importing her module would mount her
export const VISIT_KEY = 'dyson-visit-v1', VISIT_COOKIE = 'dl_visit', VISIT_DAYS = 30, DOWNLOADS_KEPT = 12;
const MOMENTS = Object.freeze(['coming', 'entered', 'skipped', 'read', 'landed', 'seats', 'harmony']);

const blank = (id, now) => ({id, since: now, athena: {entrances: 0, beat: -1, entrance: null, ...Object.fromEntries(MOMENTS.map((m) => [m, null]))}, downloads: []});
/** visitOf(raw, now, id): the visit a stored string holds when it is whole and not older than VISIT_DAYS, else a new one. Pure. */
export function visitOf(raw, now, id = randomCode(VISIT_LENGTH)) {
  try {
    const v = JSON.parse(raw);
    if (v && isVisitId(v.id) && Number.isFinite(v.since) && now - v.since < VISIT_DAYS * 864e5 && v.athena && Array.isArray(v.downloads)) return v;
  } catch { /* none kept, or not ours */ }
  return blank(id, now);
}
/** noteAthena(visit, detail): her moment (a SEEN_EVENT's detail) in the visit: its first time kept, her entrances counted, the beat and the entrance's end. Pure. */
export function noteAthena(visit, {type, at, beat, entrance} = {}) {
  if (!MOMENTS.includes(type) || !Number.isFinite(at)) return visit;
  const a = {...visit.athena};
  if (a[type] == null) a[type] = at;
  if (type === 'entered') a.entrances += 1;
  if (Number.isInteger(beat)) a.beat = Math.max(a.beat, beat);
  if (type === 'landed' && entrance !== undefined && a.entrance !== 'whole') a.entrance = entrance === false ? 'still' : entrance;
  return {...visit, athena: a};
}
/** athenaBefore(visit, at): what she had done before the moment `at`: none, coming, entered, skipped, whole or still. Pure. */
export function athenaBefore(visit, at) {
  const a = visit.athena, by = (t) => t != null && t <= at;
  if (by(a.landed)) return a.entrance === 'still' ? 'still' : a.entrance === 'skipped' || by(a.skipped) ? 'skipped' : 'whole';
  if (by(a.skipped) || by(a.read)) return 'skipped';
  if (by(a.entered)) return 'entered';
  return by(a.coming) ? 'coming' : 'none';
}
/** noteDownload(visit, at, platform): a press on the download, with what Athena had done before it; the last DOWNLOADS_KEPT kept. Pure. */
export function noteDownload(visit, at, platform) {
  const press = {at, platform, athena: athenaBefore(visit, at), entrances: visit.athena.entrances, beat: visit.athena.beat};
  return {visit: {...visit, downloads: [...visit.downloads, press].slice(-DOWNLOADS_KEPT)}, press};
}

/** mountVisit({win, doc, storage, now}): the visit kept in storage and in its cookie, her moments heard; window.dlVisit = {state, download(platform)}. */
export function mountVisit({win = window, doc = document, storage = (() => { try { return win.localStorage; } catch { return null; } })(), now = () => Date.now()} = {}) {
  const read = () => { try { return storage?.getItem(VISIT_KEY) ?? null; } catch { return null; } };
  let visit = visitOf(read(), now());
  const keep = () => {
    try { storage?.setItem(VISIT_KEY, JSON.stringify(visit)); } catch { /* storage refused: the visit lives as long as the page */ }
    doc.cookie = `${VISIT_COOKIE}=${visit.id}; Path=/; Max-Age=${VISIT_DAYS * 86400}; SameSite=Lax${win.location?.protocol === 'https:' ? '; Secure' : ''}`;
  };
  keep();
  doc.addEventListener(SEEN_EVENT, (e) => { visit = noteAthena(visit, e.detail); keep(); });
  const api = {state: () => JSON.parse(JSON.stringify(visit)), download: (platform) => { const r = noteDownload(visit, now(), platform); visit = r.visit; keep(); return {id: visit.id, ...r.press}; }};
  win.dlVisit = api;
  return api;
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') mountVisit();

// dl-visit.test.mjs: THE VISIT (his Oct 22 2026 14:3x WEST: "you gotta track state on whether athena appeared or not before they clicked the download
// button"). node --test dl-visit.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {SEEN_EVENT, VISIT_KEY, VISIT_COOKIE, VISIT_LENGTH, VISIT_DAYS, DOWNLOADS_KEPT, isVisitId, visitOf, noteAthena, athenaBefore, noteDownload, mountVisit} from './dl-visit.mjs';
import {SEEN_EVENT as HER_WORD} from './dl-athena.js';
import {CODE_ALPHABET} from './dl-society-codes.mjs';

test('one visit, one id of the codes\' alphabet, kept across reloads for its days and no longer', () => {
  const v = visitOf(null, 1000);
  assert.ok(isVisitId(v.id) && v.id.length === VISIT_LENGTH && [...v.id].every((c) => CODE_ALPHABET.includes(c)));
  assert.equal(visitOf(JSON.stringify(v), 1000 + 864e5).id, v.id, 'a reload keeps the visit (the story restarts, the visit stays)');
  assert.notEqual(visitOf(JSON.stringify(v), 1000 + (VISIT_DAYS + 1) * 864e5).id, v.id, 'an old visit is a new one');
  for (const raw of ['{', '{"id":"short","since":1}', JSON.stringify({...v, id: v.id.toLowerCase()}), JSON.stringify({...v, downloads: null})]) assert.notEqual(visitOf(raw, 2000).id, v.id, raw.slice(0, 30));
});

test('what Athena had done before a press: none, coming, entered, skipped, whole or still, each by its own time', () => {
  assert.equal(SEEN_EVENT, HER_WORD, 'her overlay\'s word and this one are one word');
  let v = visitOf(null, 0);
  assert.equal(athenaBefore(v, 9e9), 'none');
  v = noteAthena(v, {type: 'coming', at: 10, end: 'stop'}); assert.equal(athenaBefore(v, 11), 'coming');
  v = noteAthena(v, {type: 'entered', at: 20}); assert.equal(athenaBefore(v, 21), 'entered'); assert.equal(v.athena.entrances, 1);
  const whole = noteAthena(v, {type: 'landed', at: 30, entrance: 'whole', beat: 5});
  assert.equal(athenaBefore(whole, 31), 'whole'); assert.equal(athenaBefore(whole, 25), 'entered', 'a press during her entrance');
  const cut = noteAthena(noteAthena(v, {type: 'skipped', at: 28, beat: 3}), {type: 'landed', at: 29, entrance: 'skipped', beat: 3});
  assert.equal(athenaBefore(cut, 30), 'skipped'); assert.equal(cut.athena.beat, 3);
  // THERE'S NO TIME (his Oct 30 2026 06:24:04 UTC: "the player can simply scroll down and read more"): a scroll that read on cuts her entrance short, with no landing
  const read = noteAthena(v, {type: 'read', at: 26, beat: 2});
  assert.equal(athenaBefore(read, 27), 'skipped', 'read on: cut short'); assert.equal(athenaBefore(read, 25), 'entered'); assert.equal(read.athena.beat, 2);
  assert.equal(athenaBefore(noteAthena(visitOf(null, 0), {type: 'landed', at: 5, entrance: false}), 6), 'still', 'a reader who asked for less motion');
  assert.equal(noteAthena(v, {type: 'entered', at: 99}).athena.entered, 20, 'her first entrance is the one kept'); assert.equal(noteAthena(v, {type: 'entered', at: 99}).athena.entrances, 2);
  assert.equal(noteAthena(v, {type: 'nonsense', at: 40}), v); assert.equal(noteAthena(v, {type: 'landed'}), v, 'no time, no moment');
});

test('a press keeps what she had done, the last few presses kept; mounted, the visit is stored, in its cookie, and hears her', () => {
  let v = noteAthena(noteAthena(visitOf(null, 0), {type: 'coming', at: 1}), {type: 'entered', at: 2});
  const {visit, press} = noteDownload(v, 3, 'macos');
  assert.deepEqual(press, {at: 3, platform: 'macos', athena: 'entered', entrances: 1, beat: -1});
  let many = v; for (let i = 0; i < DOWNLOADS_KEPT + 5; i++) many = noteDownload(many, 10 + i, 'macos').visit;
  assert.equal(many.downloads.length, DOWNLOADS_KEPT); assert.equal(visit.downloads.length, 1);
  const store = new Map(), storage = {getItem: (k) => store.get(k) ?? null, setItem: (k, val) => store.set(k, val)};
  const listeners = {}, doc = {cookie: '', addEventListener: (type, f) => { listeners[type] = f; }};
  let t = 100; const win = {location: {protocol: 'https:'}};
  const api = mountVisit({win, doc, storage, now: () => t});
  const id = api.state().id;
  assert.equal(JSON.parse(store.get(VISIT_KEY)).id, id);
  assert.match(doc.cookie, new RegExp(`^${VISIT_COOKIE}=${id}; Path=/; Max-Age=${VISIT_DAYS * 86400}; SameSite=Lax; Secure$`));
  listeners[SEEN_EVENT]({detail: {type: 'coming', at: 101, end: 'stop'}}); listeners[SEEN_EVENT]({detail: {type: 'entered', at: 102}});
  t = 103; const pressed = api.download('macos');
  assert.equal(pressed.id, id); assert.equal(pressed.athena, 'entered'); assert.equal(win.dlVisit, api);
  assert.equal(JSON.parse(store.get(VISIT_KEY)).downloads.at(-1).athena, 'entered', 'kept across the reload to come');
  assert.match(readFileSync(new URL('./dl-visit.mjs', import.meta.url), 'utf8'), /named here, not imported: importing her module would mount her/);
});

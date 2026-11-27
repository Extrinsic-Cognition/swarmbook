// dl-athena-film.test.mjs: ATHENA BRINGS THE GOVERNANCE FILM (his Oct 29 2026 16:40 UTC: "i would add a step after 2, the step where athena brings the attention
// to the other mint video about governance"; 16:41: "you will bring up the new video and let the user independent, you dont want to walk hand in hand...").
// node --test dl-athena-film.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {SEEN_EVENT, FILM_Z, NAME, WORDS, JOURNEY_S, VOLUME, FADE_S, NARROW, FILMS, SOUNDTRACK, variantOf, countOf, fadeOf, playWord, mountGovernanceFilm} from './dl-athena-film.js';
import {SEEN_EVENT as HERS} from './dl-athena.js';
import {LAYER_Z} from './dl-athena.mjs';
import {HER_Z, SEEN_EVENT as HER_MAKINGS} from './dl-her-colours.js';
import {ROUTER_Z} from './dl-space-router.js';
import {JOURNEY_SECONDS} from './warm-galaxy-player.js';

const here = (p) => new URL(p, import.meta.url);
const src = readFileSync(here('./dl-athena-film.js'), 'utf8');

test('her word and the heights: her landing brings it; over her making and her layer, under the rebate that slams in after it', () => {
  assert.equal(SEEN_EVENT, HERS, 'dl-athena.js\'s own word'); assert.equal(SEEN_EVENT, HER_MAKINGS); assert.equal(FILM_Z, ROUTER_Z, 'the rebate\'s height: the rebate, appended when it slams in, stands over it'); assert.ok(FILM_Z > HER_Z && FILM_Z > LAYER_Z, 'over "Give me my colours." and over her own layer'); assert.match(src, /html\[data-space-router\] \.dl-athena-film\{visibility:hidden\}/, 'unseen while the rebate stands'); assert.doesNotMatch(src, /^import .*dl-athena\.js/m, 'her module is never imported: it would mount her');
});

test('the film is the #purpose player\'s own cut, poster and soundtrack: the same bytes, the same addresses, the same law', () => {
  const player = readFileSync(here('./warm-galaxy-player.js'), 'utf8'), page = readFileSync(here('./warm.html'), 'utf8');
  assert.equal(JOURNEY_S, JOURNEY_SECONDS); assert.match(player, /const FILM_VOLUME = \.65;/); assert.equal(VOLUME, 0.65); assert.match(player, /const revision='film-mothership-1';/); assert.match(page, /data-galaxy-media="\.\/warm-media\/film-mothership-1\/"/); assert.match(player, /video\.src=`\$\{media\}galaxy-\$\{variant\}\.mp4\?v=\$\{revision\}`/); assert.match(player, /`\$\{media\}galaxy-\$\{variant\}-poster\.jpg\?v=\$\{revision\}`/); assert.match(player, new RegExp(`matchMedia\\('${NARROW.replace(/[()]/g, '\\$&')}'\\)`), 'a phone takes the mobile cut by the player\'s own rule');
  for (const [variant, f] of Object.entries(FILMS)) {
    assert.equal(f.film.pathname.split('/app/')[1], `warm-media/film-mothership-1/galaxy-${variant}.mp4`); assert.equal(f.film.search, '?v=film-mothership-1');
    assert.equal(f.poster.pathname.split('/app/')[1], `warm-media/film-mothership-1/galaxy-${variant}-poster.jpg`); assert.equal(f.poster.search, '?v=film-mothership-1');
    for (const u of [f.film, f.poster]) assert.ok(existsSync(fileURLToPath(new URL(u.pathname, u))), `${u.pathname} in the tree`);
  }
  assert.match(player, /source:'\.\/warm-media\/fantasia-1\/fantasia-soundtrack\.m4a\?v=audio-carry-1'/); assert.equal(SOUNDTRACK.pathname.split('/app/')[1], 'warm-media/fantasia-1/fantasia-soundtrack.m4a'); assert.equal(SOUNDTRACK.search, '?v=audio-carry-1');
  assert.match(src, /import \{createJourneySoundtrack\} from '\.\/warm-journey-soundtrack\.js\?v=audio-carry-1';/); assert.match(readFileSync(here('./warm-galaxy-player.js'), 'utf8'), /from '\.\/warm-journey-soundtrack\.js\?v=audio-carry-1'/);
  assert.equal(variantOf({matchMedia: (q) => ({matches: q === NARROW})}), 'mobile'); assert.equal(variantOf({matchMedia: () => ({matches: false})}), 'desktop'); assert.equal(variantOf(null), 'desktop');
});

test('words only where the visitor acts: a name, three buttons and a count (his Oct 29 2026 06:07 UTC rule)', () => {
  assert.equal(NAME, 'Governance');
  assert.deepEqual(Object.values(WORDS), ['Play', 'Pause', 'Replay', 'Try again', 'Sound on', 'Sound off', '×']);
  assert.equal(countOf(0), '00 / 51'); assert.equal(countOf(7.9), '07 / 51'); assert.equal(countOf(50.99), '50 / 51'); assert.equal(countOf(51), '51 / 51');
  assert.equal(countOf(-3), '00 / 51'); assert.equal(countOf(99), '51 / 51'); assert.equal(countOf(NaN), '00 / 51');
  assert.equal(playWord({playing: true}), 'Pause'); assert.equal(playWord({playing: false}), 'Play'); assert.equal(playWord({playing: false, ended: true}), 'Replay');
  assert.equal(playWord({playing: true, failed: 'error'}), 'Try again');
});

test('the sound leaves with the picture over its last 1.5 s, whole before, none at the end; never cut', () => {
  for (const t of [0, 10, 49.5, JOURNEY_S - FADE_S]) assert.equal(fadeOf(t), 1, `${t}`);
  assert.ok(Math.abs(fadeOf(JOURNEY_S - FADE_S / 2) - 0.5) < 1e-9); assert.equal(fadeOf(JOURNEY_S), 0); assert.equal(fadeOf(JOURNEY_S + 2), 0); assert.equal(fadeOf(NaN), 1);
  let last = 1; for (let t = 48; t <= 51.2; t += 1 / 60) { const k = fadeOf(t); assert.ok(k <= last && k >= 0); last = k; }
  assert.equal(fadeOf(39, 41), 1); assert.equal(fadeOf(41, 41), 0, 'the film\'s own length when it has one');
});

test('The rule, item 8: nothing here writes the picture\'s time; the sound is put at the picture\'s second by the player\'s own law', () => {
  assert.doesNotMatch(src, /\.currentTime\s*=(?!=)/, 'no seek of any medium here');
  assert.match(src, /L\.sound\.update\(\{time: t, playing: on_ && S\.open, visible: true, hidden: !!doc\.hidden, sound: S\.sound, rate: v\.playbackRate \|\| 1, freeRunning: false\}\);/);
  assert.match(src, /function toggleSound\(\) \{ S\.sound = !S\.sound; S\.taps\+\+; sync\(\); \}/, 'a tap on Sound is the soundtrack\'s alone');
  const law = readFileSync(here('./warm-journey-soundtrack.js'), 'utf8');
  assert.match(law, /if\(Math\.abs\(audio\.currentTime-target\)>\.3&&reachable\(target\)\)audio\.currentTime=target;/, 'the sound to the picture, inside its seekable ranges');
});

// ---- a page of its own: the card on her landing, the stage on a press, the sound on a tap, and the let-go ----
function page({search = '', narrow = false} = {}) {
  const listeners = new Map(), events = (who) => ({
    addEventListener(type, fn) { if (!listeners.has(who)) listeners.set(who, new Map()); const m = listeners.get(who); if (!m.has(type)) m.set(type, new Set()); m.get(type).add(fn); },
    removeEventListener(type, fn) { listeners.get(who)?.get(type)?.delete(fn); },
  });
  const fire = (who, type, detail) => { for (const fn of [...(listeners.get(who)?.get(type) ?? [])]) fn({type, detail, key: detail?.key}); };
  const count = (who) => [...(listeners.get(who)?.values() ?? [])].reduce((n, s) => n + s.size, 0);
  const element = (tag) => {
    const attrs = new Map(), el = {tagName: tag.toUpperCase(), className: '', textContent: '', dataset: {}, style: {}, hidden: false, children: [], parent: null, focused: 0,
      setAttribute: (k, v) => attrs.set(k, String(v)), getAttribute: (k) => (attrs.has(k) ? attrs.get(k) : null), removeAttribute: (k) => attrs.delete(k), hasAttribute: (k) => attrs.has(k),
      toggleAttribute: (k, on) => { if (on) attrs.set(k, ''); else attrs.delete(k); return on; },
      append(...kids) { for (const k of kids) { k.parent = el; el.children.push(k); } }, remove() { if (el.parent) el.parent.children.splice(el.parent.children.indexOf(el), 1); el.parent = null; },
      focus() { el.focused++; }, getBoundingClientRect: () => ({left: 0, top: 0, width: 0, height: 0}), ...events(null)};
    Object.assign(el, events(el));
    if (tag === 'video') {
      let t = 0; el.writes = 0; el.loads = 0; el.paused = true; el.ended = false; el.duration = JOURNEY_S; el.readyState = 4; el.playbackRate = 1; el.seekable = {length: 1, end: () => JOURNEY_S};
      Object.defineProperty(el, 'currentTime', {get: () => t, set: (v) => { el.writes++; t = v; }});
      el.at = (s) => { t = s; fire(el, 'timeupdate'); };   // the decoder's own time, never a write
      Object.defineProperty(el, 'src', {get: () => el.getAttribute('src') ?? '', set: (v) => el.setAttribute('src', v)});
      el.play = () => { el.paused = false; el.ended = false; fire(el, 'play'); return Promise.resolve(); };
      el.pause = () => { if (!el.paused) { el.paused = true; fire(el, 'pause'); } };
      el.load = () => { el.loads++; };
    }
    return el;
  };
  const doc = {hidden: false, createElement: element, head: element('head'), body: element('body'), documentElement: element('html'), ...events('doc')};
  const win = {location: {search}, innerWidth: 1440, innerHeight: 900, matchMedia: (q) => ({matches: narrow && q === NARROW}), ...events('win')};
  const sounds = [];
  const soundtrack = (root, opts) => { const s = {root, opts, updates: [], destroyed: false, audio: {volume: 1, currentTime: 0, paused: true, muted: false, readyState: 0, seekable: {length: 0}},
    update(next) { s.updates.push(next); }, destroy() { s.destroyed = true; }}; sounds.push(s); return s; };
  const all = (el, out = []) => { out.push(el); for (const k of el.children) all(k, out); return out; };
  const find = (cls) => all(doc.body).find((e) => e.className === cls) ?? null;
  return {doc, win, sounds, soundtrack, find, all, count, landed: () => fire('doc', SEEN_EVENT, {type: 'landed', at: 1}), made: () => fire('doc', SEEN_EVENT, {type: 'made', at: 2}),
    key: (key) => fire('doc', 'keydown', {key}), click: (el) => fire(el, 'click')};
}

test('nothing before she lands; on her landing the card, its poster and its name, and not a byte of the film', () => {
  const p = page(), api = mountGovernanceFilm({win: p.win, doc: p.doc, soundtrack: p.soundtrack});
  assert.equal(p.doc.body.children.length, 0, 'nothing mounted while she has not landed'); assert.equal(p.count('doc'), 1, 'one listener: her word');
  p.made(); assert.equal(p.doc.body.children.length, 0, 'her making\'s word alone brings nothing');
  p.landed();
  const layer = p.find('dl-athena-film'), card = p.find('dl-athena-film-card'), go = p.find('dl-athena-film-go'), stage = p.find('dl-athena-film-stage'), video = p.all(stage).find((e) => e.tagName === 'VIDEO');
  assert.ok(layer && card && go && stage && video); assert.equal(layer.dataset.variant, 'desktop'); assert.equal(stage.hidden, true, 'the stage waits for a press');
  assert.equal(p.all(go).find((e) => e.tagName === 'IMG').src, FILMS.desktop.poster.href, 'the film\'s own first frame');
  assert.equal(video.getAttribute('src'), null, 'no byte of the film until the press'); assert.equal(video.preload, 'none'); assert.equal(video.muted, true);
  assert.equal(p.sounds.length, 1); assert.equal(p.sounds[0].opts.source, SOUNDTRACK.href); assert.equal(p.sounds[0].opts.volume, VOLUME);
  assert.ok(p.sounds[0].updates.every((u) => u.playing === false), 'no sound asked while the card waits');
  const texts = p.all(layer).map((e) => e.textContent).filter(Boolean);
  assert.deepEqual(texts.sort(), [NAME, '×', '×', 'Play', 'Sound on', '00 / 51'].sort(), 'a name, its buttons and its count: no line explains');
  p.landed(); assert.equal(p.doc.body.children.length, 1, 'she lands once: one card');
  assert.equal(api.state().up, true); assert.equal(api.state().open, false);
});

test('THE ROAD IS ONE TAKE (his Oct 30 2026 08:09:46 UTC "i think it could be smoother", over the card pinned on the creator\'s corner): while her making holds her landing the card waits for her to be made, as the rebate does; nothing sits on the creator', () => {
  const p = page(), api = mountGovernanceFilm({win: p.win, doc: p.doc, soundtrack: p.soundtrack});
  p.doc.documentElement.dataset.herMaking = 'waiting';   // dl-her-colours.js: her making claims her landing
  p.landed(); assert.equal(p.doc.body.children.length, 0, 'the creator is the whole screen: no card on it'); assert.equal(api.state().up, false);
  p.doc.documentElement.dataset.herMaking = 'made'; p.made();
  assert.equal(p.doc.body.children.length, 1, 'she is made: the card comes, with the rebate'); assert.equal(api.state().up, true);
  p.made(); assert.equal(p.doc.body.children.length, 1, 'once');
});

test('a press opens it with its sound; a tap on Sound mutes or unmutes the soundtrack and never writes the picture\'s time; pause, Escape, close, the rebate', async () => {
  const p = page(), api = mountGovernanceFilm({win: p.win, doc: p.doc, soundtrack: p.soundtrack}); p.landed();
  const layer = p.find('dl-athena-film'), stage = p.find('dl-athena-film-stage'), video = p.all(stage).find((e) => e.tagName === 'VIDEO');
  const [playB, soundB] = p.find('dl-athena-film-bar').children, s = p.sounds[0], last = () => s.updates.at(-1);
  p.click(p.find('dl-athena-film-go')); await Promise.resolve();
  assert.equal(stage.hidden, false); assert.ok(layer.hasAttribute('data-open'), 'the card stands for the closed stage');
  assert.equal(video.src, FILMS.desktop.film.href, 'the film\'s bytes on the first press'); assert.equal(video.preload, 'auto'); assert.equal(video.paused, false);
  assert.deepEqual({playing: last().playing, sound: last().sound, time: last().time, freeRunning: last().freeRunning}, {playing: true, sound: true, time: 0, freeRunning: false}, 'its sound with it, at its second');
  assert.equal(playB.textContent, 'Pause'); assert.equal(playB.focused, 1, 'the stage\'s first button takes the keys');
  video.at(12.3); assert.equal(last().time, 12.3, 'the sound is told the picture\'s second'); assert.equal(p.find('dl-athena-film-count').textContent, '12 / 51');
  p.click(soundB); assert.equal(last().sound, false); assert.equal(soundB.textContent, 'Sound off'); assert.equal(soundB.getAttribute('aria-pressed'), 'false');
  p.click(soundB); assert.equal(last().sound, true); assert.equal(soundB.textContent, 'Sound on');
  assert.equal(video.writes, 0, 'two taps on Sound: the picture\'s time never written'); assert.equal(video.paused, false, 'and the picture plays on');
  assert.equal(api.state().taps, 2);
  p.click(playB); assert.equal(video.paused, true); assert.equal(last().playing, false); assert.equal(playB.textContent, 'Play');
  p.click(playB); await Promise.resolve(); assert.equal(video.paused, false); assert.equal(last().playing, true);
  p.key('Escape'); assert.equal(stage.hidden, true); assert.equal(video.paused, true); assert.ok(!layer.hasAttribute('data-open')); assert.equal(last().playing, false, 'closed: no sound');
  assert.equal(p.find('dl-athena-film-go').focused, 1, 'the keys back on the card');
  p.click(p.find('dl-athena-film-go')); await Promise.resolve(); assert.equal(api.state().opened, 2); assert.equal(video.currentTime, 12.3, 'again from where it stood');
  p.click(p.find('dl-athena-film-veil')); assert.equal(stage.hidden, true, 'a press beside the film closes it');
  p.click(p.find('dl-athena-film-go')); await Promise.resolve();
  p.made(); assert.equal(stage.hidden, true, 'the rebate slams in: the stage closes'); assert.equal(video.paused, true);
  assert.equal(video.writes, 0, 'nothing here ever wrote the picture\'s time');
});

test('the fade: the soundtrack\'s volume whole through the film, down to none at its end; the end says Replay', () => {
  const p = page(); mountGovernanceFilm({win: p.win, doc: p.doc, soundtrack: p.soundtrack}); p.landed();
  const stage = p.find('dl-athena-film-stage'), video = p.all(stage).find((e) => e.tagName === 'VIDEO'), s = p.sounds[0];
  p.click(p.find('dl-athena-film-go'));
  video.at(20); assert.equal(s.audio.volume, VOLUME);
  video.at(JOURNEY_S - FADE_S / 2); assert.ok(Math.abs(s.audio.volume - VOLUME / 2) < 1e-9);
  video.paused = true; video.ended = true; video.at(JOURNEY_S); assert.equal(s.audio.volume, 0); assert.equal(s.updates.at(-1).playing, false);
  assert.equal(p.find('dl-athena-film-bar').children[0].textContent, 'Replay'); assert.equal(p.find('dl-athena-film-count').textContent, '51 / 51');
});

test('the card\'s ×: the film and its sound let go, the layer gone, every listener of its own removed; she brings it no more; a phone takes the mobile cut; ?handoff mounts nothing', () => {
  const p = page(), api = mountGovernanceFilm({win: p.win, doc: p.doc, soundtrack: p.soundtrack}); p.landed();
  const video = p.all(p.find('dl-athena-film-stage')).find((e) => e.tagName === 'VIDEO');
  p.click(p.find('dl-athena-film-go')); assert.ok(p.count('doc') > 1);
  p.click(p.find('dl-athena-film-shut'));
  assert.equal(p.doc.body.children.length, 0); assert.equal(p.doc.head.children.length, 0, 'its style gone too'); assert.equal(p.sounds[0].destroyed, true);
  assert.equal(video.getAttribute('src'), null); assert.equal(video.loads, 1, 'the film let go'); assert.equal(video.paused, true);
  assert.equal(p.count('doc'), 1, 'only her word is still heard'); assert.equal(api.state().gone, true);
  p.landed(); assert.equal(p.doc.body.children.length, 0, 'closed for good this visit');
  const phone = page({narrow: true}); mountGovernanceFilm({win: phone.win, doc: phone.doc, soundtrack: phone.soundtrack}); phone.landed();
  assert.equal(phone.find('dl-athena-film').dataset.variant, 'mobile'); phone.click(phone.find('dl-athena-film-go'));
  assert.equal(phone.all(phone.find('dl-athena-film-stage')).find((e) => e.tagName === 'VIDEO').src, FILMS.mobile.film.href);
  const road = page({search: '?handoff=lan'}); assert.equal(mountGovernanceFilm({win: road.win, doc: road.doc, soundtrack: road.soundtrack}), null); assert.equal(road.count('doc'), 0);
});

test('the page loads it with her story, by a literal the build walks; it comes after her making and the rebate', () => {
  const entry = readFileSync(here('./warm-entry.mjs'), 'utf8');
  assert.match(entry, /import\('\.\/dl-athena-film\.js\?v=governance-1'\)/);
  assert.ok(entry.indexOf('dl-athena-film.js') > entry.indexOf('dl-space-router.js') && entry.indexOf('dl-space-router.js') > entry.indexOf('dl-her-colours.js'));
  assert.match(src, /if \(typeof window !== 'undefined' && typeof document !== 'undefined'\) mountGovernanceFilm\(\);/);
  assert.match(src, /if \(!L\.video\.getAttribute\('src'\)\) \{ L\.video\.preload = 'auto'; L\.video\.src = L\.F\.film\.href; \}/, 'the film\'s bytes on the first press only');
});

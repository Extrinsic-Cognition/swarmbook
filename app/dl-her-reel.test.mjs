// dl-her-reel.test.mjs · HER REEL (lane/her-reel-share): the law of her reel and its link (dl-her-reel.mjs), and the page's half (dl-her-reel.js) on a glass of
// the test's own: the reel filmed by birth-film.mjs on her canvas from the press, her pentagons counted in on the beats of its second bar, its card and doors.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as R from './dl-her-reel.mjs';
import * as L from './dl-her-colours.mjs';
import * as W from './dl-her-wishes.mjs';
import * as F from './dl-her-friends.mjs';
import { FILM, beatOf, downbeatAtOrAfter, songLine } from '../vendor/embertide-app/ui/intro/room/birth-film.mjs';
const M = await import('./dl-her-reel.js');   // the page's half: the reel's maker and its words

const seeded = (s = 7) => () => (s = (s * 9301 + 49297) % 233280) / 233280;
const TRACK = '4uLU6hMCjMI75M1A2tKUQC';

test('the link carries her and nothing else: her paint, light and eyes\' form, the wishes spent, the song\'s id; read back whole, in the fragment no server reads', () => {
  const st = L.gazeTo(L.roll(L.blank(), seeded()), 'star'), link = R.herLink(st, 6, TRACK);
  assert.match(link, /^https:\/\/swarmbook\.com\/#her=1\.[0-9A-F]{6}(\.[0-9A-F]{6}){5}\.v\.star\.6\.4uLU6hMCjMI75M1A2tKUQC$/, 'the site\'s front door, everything after the #');
  const back = R.fromHerLink(link);
  assert.deepEqual([back.st.parts, back.st.painted, back.st.light, back.st.gaze, back.spent, back.track], [st.parts, st.painted, st.light, 'star', 6, TRACK]);
  assert.deepEqual(R.fromHerLink(new URL(link).hash), back, 'read from location.hash as from the link');
  const half = L.put(L.put(L.blank(), 'coat', '#112233'), 'light', '#F0B90B'), h = R.fromHerLink(R.herLink(half, 2, null));
  assert.deepEqual([h.st.painted, h.st.parts.coat, h.st.parts.base, h.st.light, h.st.gaze, h.spent, h.track], [['coat'], '#112233', L.BARE.base, '#F0B90B', null, 2, null], 'a part not painted is her bare vinyl; no song, no form');
  assert.equal(R.fromHerLink(R.herLink(L.blank(), -3, 'not a track')).spent, 0, 'anything but a count is none spent; anything but an id is no song');
  assert.equal(R.fromHerLink(R.herLink(st, 1e9)).spent, 9999, 'the count is capped');
});

test('anything that is not her link reads as no visit: another version, a bad digit, a field too many or too few, a foreign form or mask, another fragment', () => {
  const ok = R.herLink(L.roll(L.blank(), seeded(3)), 4, TRACK), frag = ok.slice(ok.indexOf('#'));
  for (const bad of [frag.replace('#her=1.', '#her=2.'), frag.replace(/\.[0-9A-F]{6}\./, '.ZZZZZZ.'), `${frag}.extra`, frag.replace(/\.[^.]+$/, ''), frag.replace('.v.', '.10.'),
    frag.replace('.v.', '.v.wink.').replace(/\.-?\.4\./, '.4.'), '#mint:for=11111111111111111111111111111111', '#state', '', null, undefined, '#her=', `#her=${'1'.repeat(200)}`])
    assert.equal(R.fromHerLink(bad), null, String(bad));
});

// A FRIEND GRANTS A WISH (lane/a-friend-grants-a-wish; his Oct 29 2026 20:28 UTC "Yes, build it"): the sharer's her code rides the link as its last field
test('the link carries the sharer\'s her code as its last field, read back; a link without one reads as before; a last field that is no her code is no link', () => {
  const st = L.roll(L.blank(), seeded(5)), code = F.draw(() => new Uint8Array(10).map((_, i) => i * 7)), link = R.herLink(st, 6, TRACK, code);
  assert.ok(F.isHerCode(code) && link.endsWith(`.${TRACK}.${code}`), link); assert.equal(R.fromHerLink(link).code, code);
  assert.deepEqual({ ...R.fromHerLink(link), code: null }, R.fromHerLink(R.herLink(st, 6, TRACK)), 'the rest of her as without it');
  assert.equal(R.fromHerLink(R.herLink(st, 6, TRACK)).code, null, 'no code rides a link made without one');
  assert.equal(R.herLink(st, 6, TRACK, 'nope'), R.herLink(st, 6, TRACK), 'anything but a her code is left out');
  assert.equal(R.herLink(st, 6, TRACK, code.toLowerCase()), R.herLink(st, 6, TRACK), 'only its canonical form');
  assert.equal(R.SITE, 'https://swarmbook.com', 'THE LINK SAYS SWARMBOOK (his Nov 26 2026 "Yes, swarmbook.com", to "Should the share link say swarmbook.com instead of optimism.fit?"): the same page, by its name'); assert.match(R.herLink(st, 6, TRACK), /^https:\/\/swarmbook\.com\/#her=1\./); assert.equal(R.herLink(st, 6, null, code, 'http://127.0.0.1:9185').startsWith('http://127.0.0.1:9185/#her=1.'), true, 'the site last');
  for (const bad of [`${link}.${code}`, link.replace(code, code.slice(1)), link.replace(code, `${code.slice(0, 9)}U`), link.replace(code, 'ABCDEFGH'), link.replace(code, 'ABCDEFGHJKMN'),
    link.replace(code, code.toLowerCase())]) assert.equal(R.fromHerLink(bad), null, bad);
});

test('her bar as text: a filled pentagon for each of hers, a hollow one for each chair not hers yet, and the count', () => {
  assert.equal(W.line(0), '⬟⬟⬟⬠⬠⬠⬠⬠⬠⬠⬠⬠ 3/12');
  assert.equal(W.line(6), '⬟⬟⬟⬟⬠⬠⬠⬠⬠⬠⬠⬠ 4/12');
  assert.equal(W.line(63), '⬟'.repeat(12) + ' 12/12');
  for (let s = 0; s < 70; s++) { const n = W.ladder(s).pentagons; assert.equal([...W.line(s)].filter((c) => c === '⬟').length, n); assert.ok(W.line(s).endsWith(` ${W.count(s)}`)); }
});

test('the caption (the page\'s half, loaded at the press): what she dances to, her bar, where to start the song, its link, the link to her as the way into Project Snowtrace; without a song, her bar and her link', () => {
  const song = R.songOf({ id: TRACK, name: 'Never Gonna Give You Up', artists: ['Rick Astley', 'Someone'] }), link = R.herLink(L.blank(), 6, TRACK);
  assert.deepEqual(song, { track_id: `spotify:track:${TRACK}`, title: 'Never Gonna Give You Up', artist: 'Rick Astley' });
  assert.equal(M.caption({ song, start_ms: 42300, spent: 6, link }), ['My Lyssajudron dances to Never Gonna Give You Up by Rick Astley', '⬟⬟⬟⬟⬠⬠⬠⬠⬠⬠⬠⬠ 4/12',
    'Add Never Gonna Give You Up by Rick Astley, start at 0:42.3', `https://open.spotify.com/track/${TRACK}`, `Join Project Snowtrace: ${link}`].join('\n'));
  assert.equal(M.caption({ song, start_ms: null, spent: 6, link }).split('\n').length, 4, 'no start (the reel cut on her own clock): no Add line');
  assert.equal(M.caption({ spent: 0, link }), `My Lyssajudron dances\n${W.line(0)}\nJoin Project Snowtrace: ${link}`);
  assert.equal(M.caption({ spent: 0 }), `My Lyssajudron dances\n${W.line(0)}`, 'no link, no invitation');
  assert.equal(R.songOf({ id: 'short', name: 'x' }), null); assert.equal(R.songOf(null), null);
  assert.equal(songLine(song), 'Never Gonna Give You Up by Rick Astley', 'the words are Harmony\'s own (birth-film.mjs)');
  assert.equal('caption' in R, false, 'the law carries none of them: nothing of birth-film.mjs loads with the page, only at the press');
});

test('the reel\'s bars and her pentagons in it: a bar of her, a ドン a beat from its second bar on a ring round her, ドクン on the beat after when her eyes are open, a bar more', () => {
  assert.deepEqual([R.reelBars(3), R.reelBars(4), R.reelBars(7), R.reelBars(12), R.reelBars(4, 3)], [3, 4, 4, 6, 4]);
  const g = { epoch_ms: 0, beat_ms: 600, beats_per_bar: 4 }, plan = R.countUp(1000, g, 4, true);
  assert.deepEqual(plan.shots.map((s) => [s.at, s.k]), [[3400, 0], [4000, 1], [4600, 2], [5200, 3]], 'from the second bar, one a beat');
  assert.equal(plan.eyes_at, 5800);
  assert.deepEqual(plan.shots.map((s) => [s.fx, s.fy]), [[0.5, 0.16], [0.84, 0.5], [0.5, 0.84], [0.16, 0.5]], 'round her, the first above');
  assert.equal(R.countUp(1000, g, 4, false).eyes_at, null, 'her eyes shut: no ドクン');
  assert.equal(R.countUp(1000, g, 40).shots.length, 12, 'twelve at most');
  assert.deepEqual(R.countUp(NaN, g, 4), { shots: [], eyes_at: null }); assert.deepEqual(R.countUp(1000, null, 4), { shots: [], eyes_at: null });
  const ends = 1000 + R.reelBars(4) * 2400; assert.ok(plan.eyes_at < ends - 2400, 'all of it inside the reel, its last bar left for her');
});

test('the grid the reel is cut on: the song\'s when its beat is placed, its 0:00 where the fit puts it; else her own clock\'s; the sung lines as the sticker reads them', () => {
  const song = { epoch_ms: 10_000, beat_ms: 500, beats_per_bar: 4, bpm: 120, source: 'song' }, state = { phase: { offset_ms: 120 }, downbeat: 2 };
  assert.deepEqual(R.reelGrid(song, state, null), { epoch_ms: 10_000, beat_ms: 500, beats_per_bar: 4, zero_ms: 10_000 - 120 - 1000, source: 'song' });
  const clock = { epoch_ms: 5, beat_ms: 600, beats_per_bar: 4, source: 'genesis' };
  assert.deepEqual(R.reelGrid(null, state, clock), { epoch_ms: 5, beat_ms: 600, beats_per_bar: 4, zero_ms: 5, source: 'genesis' });
  assert.equal(R.reelGrid(null, null, null), null);
  const lyrics = R.lyricsOf([{ ms: 1000, text: 'one' }, { ms: 2500, text: '' }, { ms: 4000, text: 'three' }], { id: TRACK });
  assert.deepEqual(lyrics, { status: 'found', synced: true, track_id: `spotify:track:${TRACK}`, lines: [{ t_ms: 1000, text: 'one' }, { t_ms: 2500, text: '' }, { t_ms: 4000, text: 'three' }] });
  assert.equal(R.lyricsOf([], { id: TRACK }), null); assert.equal(R.lyricsOf([{ ms: 1, text: 'x' }], null), null);
});

// ---- the page's half on a glass of the test's own: a document of plain nodes, a clock held by hand, birth-film.mjs stood in for by a film that keeps its calls ----
function glass({ canShare = false } = {}) {
  const G = { now: 1_000_000, timers: [], urls: [], revoked: [], clicks: [], copied: [], shared: [], films: [] };
  const node = (tag) => { const cls = new Set(), el = { tagName: tag.toUpperCase(), children: [], style: { setProperty(k, v) { el.style[k] = v; } }, attrs: {}, listeners: new Map(), hidden: false,
    get className() { return [...cls].join(' '); }, set className(v) { cls.clear(); for (const c of String(v).split(' ').filter(Boolean)) cls.add(c); },
    classList: { add: (...c) => c.forEach((x) => cls.add(x)), remove: (...c) => c.forEach((x) => cls.delete(x)), contains: (c) => cls.has(c) },
    append(...k) { for (const c of k) { c.parent = el; el.children.push(c); } }, remove() { if (el.parent) el.parent.children = el.parent.children.filter((c) => c !== el); },
    setAttribute(k, v) { el.attrs[k] = String(v); }, removeAttribute(k) { delete el.attrs[k]; }, addEventListener(t, f) { el.listeners.set(t, f); },
    click() { G.clicks.push(el); return el.listeners.get('click')?.({ target: el }); }, focus() { G.focused = el; }, play() { el.playing = true; return Promise.resolve(); }, pause() { el.playing = false; },
    querySelector: (q) => all(el).find((c) => c !== el && c.classList.contains(q.replace(/^\./, ''))) ?? null, offsetWidth: 0 };
    return el; };
  const all = (r) => [r, ...r.children.flatMap(all)];
  const head = node('head'), body = node('body'), byId = new Map();
  G.doc = { head, body, createElement: node, getElementById: (id) => byId.get(id) ?? null };
  head.append = (...k) => { for (const c of k) { byId.set(c.id, c); } };
  G.win = { Date: { now: () => G.now }, setTimeout: (fn, ms) => { G.timers.push({ fn, at: G.now + ms }); return G.timers.length; }, clearTimeout: (i) => { if (G.timers[i - 1]) G.timers[i - 1].fn = null; },
    URL: { createObjectURL: (b) => { G.urls.push(b); return `blob:${G.urls.length}`; }, revokeObjectURL: (u) => G.revoked.push(u) }, File: class { constructor(parts, name, o) { this.parts = parts; this.name = name; this.type = o?.type; } },
    matchMedia: () => ({ matches: false }) };
  G.share = { canShare: () => canShare, share: (d) => { G.shared.push(d); return Promise.resolve(); } };
  G.clipboard = { writeText: (t) => { G.copied.push(t); return Promise.resolve(); } };
  G.run = (to) => { let ran = 0;   // the clock moves to `to`: every timer due by then runs at its own instant, in order (one set while running, too)
    for (let t; (t = G.timers.filter((x) => x.fn && x.at <= to).sort((a, b) => a.at - b.at)[0]);) { const f = t.fn; t.fn = null; G.now = Math.max(G.now, t.at); f(); ran++; }
    G.now = to; return ran; };
  G.host = node('div'); G.button = node('button'); body.append(G.host);
  // the film: birth-film.mjs's own grid helpers, a reel that starts on the downbeat after its mount, keeps its shots and its ドクン, and is ready when told
  G.film = async () => ({ beatOf, downbeatAtOrAfter, mountBirthFilm(o) {
    const f = { o, shots: [], eyes: null, start: null, stopped: false };
    f.api = { started: () => f.start != null, state: () => ({ start: f.start == null ? null : { house_ms: f.start + 17, song_ms: 42300 }, grid_at_start: { source: o.grid().source } }),
      shot: (k, fx, fy, hit) => f.shots.push({ k, fx, fy, hit, at: G.now }), eyes: () => { f.eyes = G.now; }, stop: () => { f.stopped = true; } };
    f.begin = (at) => { f.start = at; }; f.done = (blob) => o.onReady(blob, { mime: 'video/mp4;codecs=avc1.42E01E', bytes: blob?.size ?? 0, pictures: 288, pictures_a_s: 30, draw_ms: 0.2,
      duration_ms: 9600, start: { house_ms: f.start + 17, song_ms: 42300 }, grid_at_start: { source: o.grid().source }, shots: f.shots.length, eyes: f.eyes != null, reason: 'the end mark', errors: 0, why: [] });
    G.films.push(f); return f.api; } });
  return G;
}
const GRID = { epoch_ms: 0, beat_ms: 600, beats_per_bar: 4, zero_ms: 0, source: 'genesis' };
const her = { canvas: { width: 1800, height: 1720 }, on: () => () => {}, places: () => [450, null] };

test('her reel from the press, never before: birth-film.mjs on her canvas with her night under her, its bars; cued to the next downbeat, then her pentagons a ドン a beat with their slots, ドクン; its card at its end', async () => {
  const G = glass(), shots = [];
  const reel = M.mountHerReel({ win: G.win, doc: G.doc, host: G.host, button: G.button, film: G.film, share: G.share, clipboard: G.clipboard });
  assert.equal(G.films.length, 0, 'nothing filmed at its mount');
  const link = R.herLink(L.blank(), 6, null);
  await reel.make({ her, grid: () => GRID, song: null, lyrics: null, pentagons: 4, eyes: true, spent: 6, link, key: 'k1', onShot: (k) => shots.push(k) });
  const f = G.films[0];
  assert.equal(f.o.source, her.canvas, 'her own canvas'); assert.deepEqual(f.o.reel, { bars: 4, layouts: R.REEL.pages }, 'her bars, on her own pages'); assert.equal(f.o.ground, R.REEL.ground, 'her night laid under her (her canvas is transparent)');
  assert.deepEqual(f.o.well.places(), [450, null], 'her place, no shadow of his'); assert.equal(typeof f.o.well.on, 'function');
  assert.ok(G.button.classList.contains('cued'), 'cued until the downbeat'); assert.equal(reel.state().filming, true);
  const d0 = downbeatAtOrAfter(GRID, G.now + 20); f.begin(d0); G.run(d0 + 120);   // the recorder started on that downbeat; the check after it
  assert.ok(G.button.classList.contains('rolling') && !G.button.classList.contains('cued'), 'the ring rolls'); assert.equal(G.button.style['--reel-ms'], `${4 * 2400}ms`);
  G.run(d0 + 2400 + 3 * 600 + 1); assert.deepEqual(f.shots.map((s) => [s.k, s.at - d0, s.hit.on]), [[0, 2400, true], [1, 3000, true], [2, 3600, true], [3, 4200, true]], 'a ドン a beat from its second bar, full');
  assert.deepEqual(shots, [0, 1, 2, 3], 'each with its slot'); assert.equal(f.eyes, null);
  G.run(d0 + 2400 + 4 * 600); assert.equal(f.eyes - d0, 4800, 'ドクン on the beat after');
  f.done({ size: 6_000_000, type: 'video/mp4' });
  const st = reel.state();
  assert.deepEqual([st.filming, st.card, st.reel, st.caption, st.share, st.opened], [false, true, { bytes: 6_000_000, mime: 'video/mp4', file: 'her-reel.mp4' }, `My Lyssajudron dances\n${W.line(6)}\nJoin Project Snowtrace: ${link}`, false, 1]);
  assert.equal(st.film.draw_ms, 0.2); assert.ok(!G.button.classList.contains('rolling'));
  const card = G.host.querySelector('.dl-her-reel'), video = card.children.find((c) => c.tagName === 'VIDEO');
  assert.deepEqual(card.children.map((c) => c.className || c.tagName), ['dl-her-reel-name', 'VIDEO', 'dl-her-reel-doors'], 'the project\'s name over her reel, its doors under it');
  assert.equal(card.querySelector('.dl-her-reel-name').textContent, 'Project Snowtrace', 'a name, no line');
  assert.deepEqual([video.src, video.muted, video.loop, video.playing], ['blob:1', true, true, true], 'the reel playing, muted, round and round');
  assert.equal(card.querySelector('.share').hidden, true, 'a browser that shares no file shows no share door');
  assert.equal(G.focused, card.querySelector('.save'), 'the first door focused');
});

test('her reel\'s doors: the browser\'s share with the file and its words; save the file, its words copied; X with its words; closed and opened again with no new film; let go at her making\'s close', async () => {
  const G = glass({ canShare: true });
  const reel = M.mountHerReel({ win: G.win, doc: G.doc, host: G.host, button: G.button, film: G.film, share: G.share, clipboard: G.clipboard });
  const song = R.songOf({ id: TRACK, name: 'Song', artists: ['Artist'] }), link = R.herLink(L.blank(), 6, TRACK);
  const o = { her, grid: () => ({ ...GRID, source: 'song' }), song, lyrics: null, pentagons: 4, eyes: false, spent: 6, link, key: 'k1' }, words = M.caption({ song, start_ms: 42300, spent: 6, link });
  assert.match(words, /Add Song by Artist, start at 0:42\.3/, 'cut on the song: where to start it');
  await reel.make(o); const f = G.films[0]; f.begin(downbeatAtOrAfter(GRID, G.now + 20)); f.done({ size: 5, type: 'video/mp4' });
  const card = G.host.querySelector('.dl-her-reel');
  assert.equal(card.querySelector('.share').hidden, false, 'the phones share the file');
  await card.querySelector('.share').click();
  assert.equal(reel.state().caption, words, 'its words: the song cut on, where to start it, her bar, the link to her');
  assert.equal(G.shared.length, 1); assert.deepEqual([G.shared[0].files[0].name, G.shared[0].files[0].type, G.shared[0].text], ['her-reel.mp4', 'video/mp4', words]);
  card.querySelector('.save').click(); await Promise.resolve();
  const a = G.clicks.find((e) => e.tagName === 'A' && e.download); assert.deepEqual([a.href, a.download], ['blob:1', 'her-reel.mp4'], 'the file to the visitor\'s own disk'); assert.deepEqual(G.copied, [words], 'its words copied for the post');
  const x = card.querySelector('.x'); assert.equal(x.href, `${R.INTENT}?${new URLSearchParams({ text: words })}`); assert.deepEqual([x.target, x.rel], ['_blank', 'noopener noreferrer']);
  card.querySelector('.shut').click(); assert.equal(card.hidden, true); assert.equal(G.focused, G.button, 'back to the share');
  await reel.make(o); assert.deepEqual([G.films.length, card.hidden, reel.state().opened], [1, false, 2], 'the same her, rung and song: the reel made already, shown again');
  await reel.make({ ...o, key: 'k2' }); assert.equal(G.films.length, 2, 'another her: another reel');
  reel.stop(); assert.equal(G.films[1].stopped, true, 'a reel filming is stopped'); assert.deepEqual(G.revoked, ['blob:1'], 'the made reel let go'); assert.equal(G.host.querySelector('.dl-her-reel'), null);
  for (const t of G.timers) assert.equal(t.fn, null, 'no timer left');
});

test('a reel that comes out empty, or a glass with no clock to cut it on, says why and leaves the share as it was', async () => {
  const G = glass(), reel = M.mountHerReel({ win: G.win, doc: G.doc, host: G.host, button: G.button, film: G.film, share: G.share, clipboard: G.clipboard });
  await reel.make({ her, grid: () => null, pentagons: 4, key: 'k' });
  assert.deepEqual([reel.state().filming, reel.state().why, G.films.length], [false, 'no clock to cut her reel on', 0]); assert.ok(!G.button.classList.contains('cued'));
  await reel.make({ her, grid: () => GRID, pentagons: 4, key: 'k' }); G.films[0].done(null);
  assert.deepEqual([reel.state().filming, reel.state().card, reel.state().why], [false, false, 'no reel']);
});

test('the reel\'s look is Harmony\'s own film: muted, 1080 x 1920, thirty pictures a second', () => {
  assert.deepEqual([FILM.w, FILM.h, FILM.fps], [1080, 1920, 30]);
});

// A REEL ITS OWN PAGES (his Oct 30 2026, over her reel's card, two of her stacked under a cream band: "u never checked if the video worked or was trash?"): her reel
// is her alone, full frame, cut on every bar between close on her and the whole of her; the room reel's two panels (her and his shadow) and its song band are the room's
test('her reel is her alone, full frame, a cut a bar between close and whole; the room reel\'s pages are the room\'s', async () => {
  const {REEL: R} = await import('./dl-her-reel.mjs'), BF = await import('../vendor/embertide-app/ui/intro/room/birth-film.mjs');
  assert.ok(BF.pagesOk(R.pages), 'pages the film takes');
  assert.deepEqual(R.pages.map((lay) => lay.map((p) => p.slice(0, 4))), [[[0, 0, BF.FILM.w, BF.FILM.h]], [[0, 0, BF.FILM.w, BF.FILM.h]]], 'one panel a page, the whole 9:16 frame: no second copy of her, no empty band');
  assert.deepEqual(R.pages.map((lay) => lay[0][4]), [true, false], 'close on her, then the whole of her, a bar each');
  assert.ok(!R.pages.flat().some((p) => p[4] === 'shadow'), 'no panel waits for a shadow the mint has not');
  const src = (await import('node:fs')).readFileSync(new URL('./dl-her-reel.js', import.meta.url), 'utf8');
  assert.match(src, /reel: \{ bars: S\.bars, layouts: REEL\.REEL\.pages \}/, 'the mint\'s reel films on its own pages');
  assert.equal(BF.pagesOk([[[0, 0, 2000, 10, true]]]), false, 'a panel outside the frame is no page'); assert.equal(BF.pagesOk([]), false); assert.equal(BF.pagesOk(BF.FILM.reel_layouts), true, 'the room\'s pages as they were');
});

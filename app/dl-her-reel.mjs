// dl-her-reel.mjs · HER REEL (Oct 29 2026, lane/her-reel-share): the law of her reel and of the link it carries, pure (no DOM, no clock of its own, no
// network). The page half is dl-her-reel.js (the reel on her making's canvas, its card) and dl-her-colours.js (the share at the end of her wish bar, a
// friend's visit); the reel itself is Harmony's own (room/birth-film.mjs).
//
// His words (UTC). Oct 13 04:46: "i said the virality here is the fucking minting of your lyssajudron dude..."; 08:18: "we need to focus on the lyssajudron
// as a viral mechanism linked to spotify my dude..."; 09:3x (birth-film.mjs): "the lyssajudron clips are supposed to be just like instagram reel clips
// exported that include music: muted"; Oct 14 00:04: "people will be able to share lyssajudron-vids... these lyssajudron-vids are the virality vector";
// Oct 29 18:33, over her making at 4/12: "how do we go from this to something that can go viral my dude? like socially shared... u get what i mean?"; and
// to the design that answered it (her reel shared at the ドン, the link carrying her, a friend landing on her): "Yes, build it".
//
// THE REEL is A REEL OF HER ROOM as Harmony films it (birth-film.mjs: muted, 1080 x 1920, cut on the song's bars, the karaoke sticker its only words), on
// her making's canvas, by the visitor's press and never before. It starts on the next downbeat: a bar of her; then her pentagons, one ドン a beat
// (countUp), and ドクン on the beat after if her eyes are open; a bar more (reelBars). Nothing of it leaves the browser but by the visitor's hand.
// THE LINK carries her, never a person: her paint, her light and her eyes' form, the wishes spent (her rung), the song's Spotify id, in the fragment
// (#her=), which no server reads (the Worker's front door keeps it across its 302). A friend who opens it lands on her as the sharer made her, at the
// sharer's rung, the sharer's song on the card; the friend's first stroke makes her their own (dl-her-colours.js), and nothing of the sharer's is kept in
// the friend's browser. HER CODE rides it since lane/a-friend-grants-a-wish (dl-her-friends.mjs, his Oct 29 20:28 UTC "Yes, build it"): the sharer's, drawn by
// their browser at the share's press, a code and no person; a friend born from the link grants the sharer a wish. Never ?ref=: that is a paid seat's code
// (REFERRALS.md), which the checkout freezes on an order. A link without her code (made before it) reads as it did.
// The reel's words (caption) are the page half's, dl-her-reel.js: they are Harmony's own (birth-film.mjs), which the page loads only at the share's press.
import * as LAW from './dl-her-colours.mjs';
import { TWELVE } from './dl-her-wishes.mjs';
import { isHerCode } from './dl-her-friends.mjs';

export const SITE = 'https://swarmbook.com';   // THE LINK SAYS SWARMBOOK (his Nov 26 2026 "Yes, swarmbook.com"): the same Worker answers both names (SWARMBOOK AND OPTIMISM.FIT ARE ONE PAGE), and a link made before still opens her
export const LINK = 'her';   // the fragment's key: #her=<v>.<light>.<base>.<coat>.<gold>.<eyes>.<thruster>.<painted>.<gaze>.<spent>.<track>[.<code>]
export const V = '1';
export const REEL = Object.freeze({ intro_bars: 1, outro_bars: 1, ring: 0.34, file: 'her-reel', ground: '#0b0d12',
  // A REEL ITS OWN PAGES (his Oct 30 2026, over her reel's card, two of her stacked under a cream band: "u never checked if the video worked or was trash? because it
  // could be among the things that get us fly if it takes proper takeoff"): the room reel's pages (room/birth-film.mjs FILM.reel_layouts) give one panel to her and one
  // to his shadow in the room, under the song's sticker band; the mint has no room and no song, so both panels were her and the band empty paper. Her reel is her
  // alone, full frame, 9:16, cut on every bar between close on her and the whole of her, the frames' slam on the downbeat as before
  pages: Object.freeze([Object.freeze([Object.freeze([0, 0, 1080, 1920, true])]), Object.freeze([Object.freeze([0, 0, 1080, 1920, false])])]),
  // HER REEL SHARP: while it films, her canvas is drawn this many device pixels tall (the reel's own height), at most SHARP_MAX device pixels a css pixel
  sharp_px: 1920, sharp_max: 3 });
/** sharpOf(css_h, dpr): the device pixels a css pixel her canvas is drawn at while her reel films: enough for REEL.sharp_px of her height, never under her glass's own
 *  (dpr), at most REEL.sharp_max. Pure. */
export const sharpOf = (cssH, dpr = 1) => Math.min(REEL.sharp_max, Math.max(dpr > 0 ? dpr : 1, cssH > 0 ? REEL.sharp_px / cssH : 1));   // a bar of her before her pentagons and one after; the ドン on a ring round her; her night under her (her canvas is transparent)
const SVG = (d) => `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
export const GLYPH = Object.freeze({ share: SVG('M12 3v12M7.5 7.5 12 3l4.5 4.5M5 12v7h14v-7'), save: SVG('M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14'), x: '𝕏', shut: '×' });   // the doors' glyphs: no word
export const INTENT = 'https://x.com/intent/post';   // X's own compose door: the words prefilled, nothing sent until the visitor posts
const HEX = /^[0-9A-F]{6}$/, TRACK = /^[A-Za-z0-9]{22}$/, COUNT = /^[0-9a-z]{1,4}$/, NONE = '-';
const count = (n) => (Number.isInteger(n) && n > 0 ? Math.min(n, 9999) : 0);

/** herLink(st, spent, track, code, site): the link to her as she stands: her paint, light and eyes' form, the wishes spent, the song's Spotify id (or none),
 *  and the sharer's her code (dl-her-friends.mjs) when there is one. */
export function herLink(st, spent = 0, track = null, code = null, site = SITE) {
  const parts = LAW.PARTS.map((p) => (LAW.hexOk(st?.parts?.[p]) || LAW.BARE[p]).slice(1));
  const painted = LAW.PARTS.reduce((m, p, i) => (st?.painted?.includes(p) ? m | (1 << i) : m), 0), light = LAW.hexOk(st?.light);
  const gaze = LAW.FORMS.includes(st?.gaze) ? st.gaze : NONE, t = TRACK.test(String(track ?? '')) ? track : NONE;
  return `${site}/#${LINK}=${[V, light ? light.slice(1) : NONE, ...parts, painted.toString(36), gaze, count(spent).toString(36), t, ...(isHerCode(code) ? [code] : [])].join('.')}`;
}
/** fromHerLink(s): {st, spent, track, code} from a link, its fragment or a location.hash; null for anything else (a bad digit, a field too many, another
 *  version, a last field that is no her code). */
export function fromHerLink(s) {
  const text = String(s ?? ''), at = text.indexOf('#'), m = new RegExp(`^${LINK}=([0-9A-Za-z.-]{1,160})$`).exec(at >= 0 ? text.slice(at + 1) : text);
  const f = m ? m[1].split('.') : null, P = LAW.PARTS.length;
  if (!f || (f.length !== P + 6 && f.length !== P + 7) || f[0] !== V) return null;
  const [light, ...rest] = f.slice(1), parts = rest.slice(0, P), [painted, gaze, spent, track, code = null] = rest.slice(P);
  if (!(light === NONE || HEX.test(light)) || !parts.every((h) => HEX.test(h)) || !COUNT.test(painted) || !COUNT.test(spent)) return null;
  if (!(gaze === NONE || LAW.FORMS.includes(gaze)) || !(track === NONE || TRACK.test(track)) || !(code === null || isHerCode(code))) return null;
  const mask = parseInt(painted, 36); if (mask >= 1 << P) return null;
  const st = LAW.blank();
  LAW.PARTS.forEach((p, i) => { if (mask & (1 << i)) { st.parts[p] = `#${parts[i]}`; st.painted.push(p); } });
  st.light = light === NONE ? null : `#${light}`; st.gaze = gaze === NONE ? null : gaze;
  return { st, spent: parseInt(spent, 36), track: track === NONE ? null : track, code };
}
/** mineOf(st, birth) / fromMine(hash): ONE NAME FOR HER (Nov 22 2026): a her made in Harmony first goes to the mint as the person's own, her colours and the name she was
 *  born under in the fragment (#mine=<birth>.<herLink's own fields>); read back as strictly as a friend's link, {birth, st} or null. Pure. */
export const mineOf = (st, birth) => `#mine=${birth}.${herLink(st).split(`#${LINK}=`)[1]}`;
export function fromMine(hash) { const m = /^#mine=([0-9a-z]{1,32})\.(.+)$/.exec(String(hash ?? '')), her = m && fromHerLink(`#${LINK}=${m[2]}`); return her ? { birth: m[1], st: her.st } : null; }
/** songOf(track): the song as the reel's words name it ({track_id, title, artist}), from the song card's pick ({id, name, artists}); null without one. */
export function songOf(track) {
  return track && TRACK.test(String(track.id ?? '')) ? { track_id: `spotify:track:${track.id}`, title: track.name || null, artist: track.artists?.[0] || null } : null;
}
/** herColours(st): HER COLOURS CROSS INTO HARMONY (Nov 22 2026): herLink's own fields cut before the wishes spent, the song and her code (a download address reaches
 *  the site's server: her colours ride it, harmony-link.mjs HER_PARAM, and her name beside them); herOfColours(h): her state from it, read as strictly as a link, or null. Pure. */
export const herColours = (st) => (st ? herLink(st).split('=')[1].split('.').slice(0, LAW.PARTS.length + 4).join('.') : null);
export const herOfColours = (h) => fromHerLink(`#${LINK}=${h}.0.${NONE}`)?.st ?? null;
/** reelBars(pentagons, beats_per_bar): the reel's bars: a bar of her, her pentagons a beat each and the beat of her eyes, a bar more. */
export function reelBars(pentagons, bpb = 4) {
  const n = Math.max(0, Math.min(TWELVE, Math.floor(pentagons) || 0)), b = Math.max(1, Math.floor(bpb) || 4);
  return REEL.intro_bars + Math.ceil((n + 1) / b) + REEL.outro_bars;
}
/** countUp(start_ms, grid, pentagons, eyes): her pentagons in the reel: one ドン a beat from its second bar, k on a ring round her ({at, k, fx, fy}: fx, fy
 *  the share of the panel), and ドクン on the beat after when her eyes are open (eyes_at, else null). start_ms: the reel's first downbeat. */
export function countUp(start_ms, grid, pentagons, eyes = false) {
  const beat = grid?.beat_ms, bpb = Math.max(1, Math.floor(grid?.beats_per_bar) || 4), n = Math.max(0, Math.min(TWELVE, Math.floor(pentagons) || 0));
  if (!Number.isFinite(start_ms) || !(beat > 0)) return { shots: [], eyes_at: null };
  const at0 = start_ms + REEL.intro_bars * bpb * beat;
  const shots = Array.from({ length: n }, (_, k) => { const a = (-90 + k * 360 / n) * Math.PI / 180;
    return { at: at0 + k * beat, k, fx: Math.round((0.5 + REEL.ring * Math.cos(a)) * 1000) / 1000, fy: Math.round((0.5 + REEL.ring * Math.sin(a)) * 1000) / 1000 }; });
  return { shots, eyes_at: eyes ? at0 + n * beat : null };
}
/** reelGrid(songGrid, songState, clock): the grid the reel is cut on, as birth-film.mjs takes it ({epoch_ms, beat_ms, beats_per_bar, zero_ms, source}): the
 *  song's when its beat is placed (dl-her-song.js: zero_ms where the song's 0:00 stood, from its fit: epoch - offset - downbeat beats), else her own clock's
 *  (the score's genesis grid, no song: zero_ms unused); null for neither. */
export function reelGrid(song, state, clock) {
  if (song && song.beat_ms > 0 && Number.isFinite(song.epoch_ms)) {
    const off = Number.isFinite(state?.phase?.offset_ms) ? state.phase.offset_ms : 0, down = Number.isFinite(state?.downbeat) ? state.downbeat : 0;
    return { epoch_ms: song.epoch_ms, beat_ms: song.beat_ms, beats_per_bar: song.beats_per_bar || 4, zero_ms: song.epoch_ms - off - down * song.beat_ms, source: 'song' };
  }
  if (clock && clock.beat_ms > 0 && Number.isFinite(clock.epoch_ms)) return { epoch_ms: clock.epoch_ms, beat_ms: clock.beat_ms, beats_per_bar: clock.beats_per_bar || 4, zero_ms: clock.epoch_ms, source: clock.source || 'genesis' };
  return null;
}
/** lyricsOf(lines, track): the song's timed lines as the reel's sticker reads them (birth-film.mjs linesOf: the lyrics ref's shape), from the song card's
 *  ({ms, text}); null without lines or a track. */
export function lyricsOf(lines, track) {
  const s = songOf(track); if (!s || !Array.isArray(lines) || !lines.length) return null;
  return { status: 'found', synced: true, track_id: s.track_id, lines: lines.filter((l) => Number.isFinite(l?.ms)).map((l) => ({ t_ms: l.ms, text: String(l.text ?? '') })) };
}

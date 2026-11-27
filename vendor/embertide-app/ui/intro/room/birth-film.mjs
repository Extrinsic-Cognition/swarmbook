// birth-film.mjs - THE BIRTH RECORDS ITSELF, CUT ON THE BEAT (Oct 13 2026 14:5x WEST). His words, 09:3x: "what makes an animation great is the annotation
// in time given by the music... the rythm... the words... that beats time", and "the lyssajudron clips are supposed to be just like instagram reel clips
// exported that include music: muted... THE LYRICS SAY ALL THAT NEEDS TO BE SAID, JUST LIKE THE MUSIC THING ON INSTAGRAM TO ADD SONGS TO PICS AND VIDEOS".
// The film of her birth is a muted reel: 1080 x 1920 at 30 pictures a second, H.264 mp4 where the glass records it (the Harmony window, WebKit), webm where
// that is all it records; NO audio track, ever (no song of anyone's goes into a produced file: the viewer adds the song on Instagram, at the position the
// share text tells). It is cut on the song's own grid as her well keeps it (well.mjs gridOf: the station's study of the song, its beats fitted to one
// period, or the pulse's provisional beat on a first play), for ANY song on Spotify:
//   - it STARTS ON A BAR'S DOWNBEAT at a known position of the song: armed when his hand lands on the field for the first shot, its recorder starts on the
//     next downbeat and starts again every FILM.lead_bars bars until the shot comes, so the start is a downbeat under two bars before the first shot (one
//     encoder, never two; a shot before any downbeat, a key's, starts the film where it is and the facts say so);
//   - a panel layout a bar (FILM.layouts, in turn: one cut on every downbeat, the panels' ink frames slammed in), a small punch on every beat;
//   - ドン where each release landed, full for a release within a sixth of a beat of the beat, smaller off it (the page's beatHit); ドクン and a flash on her
//     eyes;
//   - it ENDS ON A DOWNBEAT: the first after her eyes have been open FILM.tail_bars bars, or after FILM.span_ms when the sixth shot never comes;
//   - the only words in it are the song's: one karaoke sticker, the line being sung, its sung word lit when the ear timed the words (activity/spotify/lyrics,
//     lines[].words from whisper-local), the line whole when it timed only the lines (LRCLIB), nothing when the ref has no words (the cut on the beat
//     stands). No title card, no mark, no handle, no count, no lettering of ours.
// A REEL OF HER ROOM (Oct 14 2026 01:5x WEST; his 01:01 "we have to nail the sharing of the video... this scene is right after the lyssajudron is
// "Anime"ted", and 01:04 "people will be able to share lyssajudron-vids... the virality vector"; the same night her step became her room at once, with no
// six shots, so her birth's film has no hand to arm it there): mountBirthFilm({ reel: { bars } }) films her room as it stands, by his press on the room's
// own door: armed, its recorder starts ONCE on the next downbeat and the film ends on the downbeat `bars` bars later (reelEndOf; fewer when that many would
// pass FILM.span_ms). No shot, no ドン, no ドクン. Its pages (FILM.reel_layouts, a layout a bar) are cut on her and on HIS SHADOW (the sand that stands where
// she stood and moves as his body does: the sand's place, well.places()[1]), a panel each, so the vid holds the two of them on the song; a room with no shadow
// gives its panel to her. The share's first line says "dances to".
// HIS SHADOW IN THE FILM (Oct 14 2026 03:3x; ON CAUSE since 06:2x): state().shadow says, for every film, whether his shadow (the sand where she stood: the
// room) stood in a picture the recorder got, and state().shadow_at_ms where the room entered the film (the song time of the first picture with it; null when
// none). The room's opening is a cause the well already has: as the sand begins (well.mjs startSand, on the page's openRoom) the well says 'room' once on its
// bus; this film's ear keeps that word until the next picture the recorder gets and marks that picture. A recorder that starts with the room already standing
// (a reel of her room; a room opened before the downbeat and still open) marks its first picture by one read at its start. No read a second for it and none
// at the end (until 06:2x her place and the sand's were read from well.state() once a second, and once more at finish); her place and the sand's, for the
// panels, come from the well's two-number getter (well.places()) once a second. The receipt copies both (birth-session.mjs filmFactsOf, the mint's
// completion), so a birth's film with her room's first seconds in its tail (a Continue pressed inside the two bars after her eyes: the Seeker seat's finding,
// 065d1fd1) is told from a film of her alone, and a cut at the room is possible if he rules that a film may not hold it (nothing here cuts: the ruling is
// his). A reel says reel.shadow (the sand at its end) as before.
// ON CAUSE: one picture of the film a picture of the well, FILM.fps a second at most (paceOf). THE WELL'S OWN PICTURE (Oct 14 2026 02:4x WEST): the film
// takes it straight from the well's canvas, in the well's own frame. The well's 'paint' event says a picture is being made; a microtask queued there runs
// when the well's frame callback returns, after its draw and before the glass composes, so the drawing buffer is whole and the film's panels and its beat
// marks are of one instant. No stream of the well, no hidden video: in the Harmony window's engine the first draw from each new frame of the stream cost
// the whole of it whatever the crop (14 of the 15 ms of a picture on a 2166 x 1232 well). And the well's canvas never meets the film: there a draw of it
// onto the film itself made every read of the well cost 2.3 ms of the page's thread, so the part of it the panels need (unionOf) is copied once, 1:1, onto
// a canvas apart and the panels are cut from the copy: 0.9 ms (a bitmap, a VideoFrame, a WebGL page and a smaller canvas fed by the stream were measured
// too, and all cost more: BIRTH-FILM-LANDING.md). A well with no 'paint' bus is filmed as before: its canvas as a
// stream on a hidden video, a callback a frame of it (requestVideoFrameCallback; a glass without it draws on its animation frames). No timer draws. A film
// that gets no picture (the glass hidden) ends on its end mark all the same (one timeout, the end's own); an armed film his hand never fires is dropped.
// Nothing of this runs before his hand lands; nothing at rest.
// A REEL ON A GLASS WITH NO GROUND (Oct 29 2026, lane/her-reel-share): the mint's making films her on her own canvas (dl-her-reel.js), which is transparent:
// the page's night shows through it. The canvas apart is opaque and never cleared (a well paints its whole picture), so a picture copied there as it is
// would keep the last one wherever she is not, her wires smeared along their orbits. ground: the colour laid under each copy before it; null (every well), as before.
// COST, measured by this module and printed by the proof (tools/embertide-mesh/birth-film/birth-film.proof.mjs): state().draw_ms (the compositor's ms a
// picture), source_ms (of it, the part that brings the well's picture to the film) and direct (the pictures taken from the well's canvas itself), the
// well's own picture_ms before and during the recording, the film's bytes and seconds. The film stays in the page's memory as a Blob: this module uploads
// nothing and writes nothing to disk, and nothing leaves the Mac but by his hand on the share door (HER FILM WALKS TO THE NEST, Oct 25 2026: at its end the
// page walks the birth's own film to this Mac's own Nest, film-walk.mjs, and the keeper makes it a file on this Mac; never off it).
import { LF, lfWords, lfLineAt } from './lyric-flock.mjs';

export const FILM = Object.freeze({
  w: 1080, h: 1920, fps: 30, bitrate: 5e6,
  span_ms: 36000,       // the reel's length at most, from its first picture, when her eyes never open
  lead_bars: 2,         // an armed recorder starts again on the downbeat this many bars after it started, until the first shot: the start stays under this before it
  tail_bars: 2,         // the film ends on the first downbeat after her eyes have been open this long
  end_slack_ms: 1500,   // a film with no pictures ends this long after its end mark
  paper: '#f4f0e6', ink: '#0e0e12', box: '#fcfbf6', red: '#d61c24', dim: 'rgba(14, 14, 18, .38)',
  layouts: Object.freeze([   // a layout a bar, in turn: panels [x, y, w, h, tight] on the page (tight: close on her, FILM.tight of the picture's height); manga.py's two panels first
    Object.freeze([Object.freeze([40, 320, 1000, 700, false]), Object.freeze([40, 1050, 1000, 790, true])]),
    Object.freeze([Object.freeze([40, 320, 1000, 1520, false])]),
    Object.freeze([Object.freeze([40, 320, 1000, 790, true]), Object.freeze([40, 1140, 1000, 700, false])]),
    Object.freeze([Object.freeze([40, 320, 1000, 1520, true])]),
  ]),
  reel_layouts: Object.freeze([   // A REEL OF HER ROOM, a layout a bar, in turn: the fifth number is true (close on her) or 'shadow' (close on his shadow, where she stood)
    Object.freeze([Object.freeze([40, 320, 1000, 760, true]), Object.freeze([40, 1110, 1000, 730, 'shadow'])]),
    Object.freeze([Object.freeze([40, 320, 1000, 1520, true])]),
    Object.freeze([Object.freeze([40, 320, 1000, 730, 'shadow']), Object.freeze([40, 1080, 1000, 760, true])]),
  ]),
  reel_bars: 8,         // a reel of her room is this many bars unless told otherwise
  sticker: Object.freeze({ x: 540, y: 200, max_w: 1000, px: 54 }),   // the song's line, above the panels (under Instagram's own top bar)
  serif: '"Bodoni 72", Didot, Georgia, serif', sfx: '"Hiragino Sans", "Hiragino Kaku Gothic ProN", "Yu Gothic", "Noto Sans JP", sans-serif',
  don_ms: 900, dokun_ms: 1400, flash_ms: 80, focus_ms: 420, cut_ms: 140, beat_punch: 0.03, beat_tau_ms: 90,
  tight: 0.56,          // the tight panel shows this share of the well's height, centred on her
  on_beat: 1 / 6,       // a release within this of a beat, either side, is on the beat
});
export const MIMES = Object.freeze(['video/mp4;codecs=avc1.42E01E', 'video/mp4;codecs=avc1.4d0028', 'video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm;codecs=vp8', 'video/webm']);   // video only: the reel is muted
export const DOOR = 'https://optimism.fit';

const num = (v) => typeof v === 'number' && Number.isFinite(v);
/** pop(t_ms, at_ms, d_ms): the manga's slam: a back-eased scale from 0 at `at` to 1 at `at + d`, past 1 on the way (manga.py pop); 1 long after. */
export function pop(t, at, d = 140) { const u = Math.max(0, Math.min(1, (t - at) / d)), k = 1.9; return 1 + (k + 1) * (u - 1) ** 3 + k * (u - 1) ** 2; }
/** punch(t_ms, hits_ms, A, tau_ms): a zoom that jumps by A at each hit and decays with tau (manga.py punch). */
export function punch(t, hits, A = 0.07, tau = 120) { let z = 1; for (const h of hits) if (h <= t && t < h + 1200) z += A * Math.exp(-(t - h) / tau); return z; }
/** shake(t_ms, at_ms, amp_px): a decaying jitter for 450 ms after `at` (manga.py shake): [dx, dy]. */
export function shake(t, at, amp = 18) { if (!num(at) || !(at <= t && t < at + 450)) return [0, 0]; const a = amp * Math.exp(-(t - at) / 100); return [a * Math.sin(t * 0.097), a * Math.cos(t * 0.071)]; }
/** pickMime(isSupported): the first container this glass records, mp4 (the Harmony window, WebKit) before webm; null when it records nothing. */
export function pickMime(isSupported) { for (const m of MIMES) { try { if (isSupported(m)) return m; } catch { /* not this one */ } } return null; }
/** coverCrop(sw, sh, rw, rh, z, cx, cy): the source rectangle that fills a rw x rh panel from a sw x sh picture, zoomed z about (cx, cy) in source px (the
 *  centre when null), never past the picture's edges: [x, y, w, h]. */
export function coverCrop(sw, sh, rw, rh, z = 1, cx = null, cy = null) {
  const s = Math.max(rw / sw, rh / sh) * z, w = Math.min(sw, rw / s), h = Math.min(sh, rh / s);
  const x = Math.max(0, Math.min(sw - w, (num(cx) ? cx : sw / 2) - w / 2)), y = Math.max(0, Math.min(sh - h, (num(cy) ? cy : sh / 2) - h / 2));
  return [x, y, w, h];
}
/** unionOf(crops, sw, sh, pad): the whole-pixel rectangle of a sw x sh picture that holds every crop ([x, y, w, h] each) and `pad` px around them, never
 *  past the picture's edges: [x, y, w, h]; null for no crop. What the film copies of the well's picture, once a picture. */
export function unionOf(crops, sw, sh, pad = 2) {
  if (!Array.isArray(crops) || !crops.length) return null; let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y, w, h] of crops) { x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x + w); y1 = Math.max(y1, y + h); }
  x0 = Math.max(0, Math.floor(x0) - pad); y0 = Math.max(0, Math.floor(y0) - pad); x1 = Math.min(sw, Math.ceil(x1) + pad); y1 = Math.min(sh, Math.ceil(y1) + pad);
  return x1 > x0 && y1 > y0 ? [x0, y0, x1 - x0, y1 - y0] : null;
}
/** paceOf(fps, slack_ms): a gate that lets `fps` pictures a second through, evenly spaced: take(t_ms) says whether the picture made at t is one of them. A well
 *  that draws faster (every frame of the glass while his shadow moves) gives the film every second, third or fourth of its pictures on a schedule a step
 *  apart, so the rate holds when the glass's own frames come unevenly (a busy Mac); a slower well gives every one. After a stall one picture may follow half
 *  a step later, never a burst. */
export function paceOf(fps = FILM.fps, slack = 4) { const step = 1000 / fps; let due = -Infinity; return (t) => { if (!(t >= due - slack)) return false; due = due === -Infinity ? t + step : Math.max(due + step, t + step / 2); return true; }; }
/** pagesOk(set): a reel's own pages (A REEL ITS OWN PAGES, the mint's her reel: dl-her-reel.mjs REEL.pages), a layout a bar as FILM.reel_layouts holds them: at least one,
 *  each one panel or more of [x, y, w, h] inside the film's frame, the fifth true, false or 'shadow'. Pure. */
export function pagesOk(set) {
  return Array.isArray(set) && set.length > 0 && set.every((lay) => Array.isArray(lay) && lay.length > 0 && lay.every((p) => Array.isArray(p) && p.length === 5
    && p.slice(0, 4).every(num) && p[0] >= 0 && p[1] >= 0 && p[2] > 0 && p[3] > 0 && p[0] + p[2] <= FILM.w && p[1] + p[3] <= FILM.h && [true, false, 'shadow'].includes(p[4])));
}
/** layoutOf(k, set): the panels of bar k of the film (k from its first bar; the set's layouts in turn: FILM.layouts, or a reel's: its own pages, else FILM.reel_layouts). */
export function layoutOf(k, set = FILM.layouts) { const n = set.length, i = ((Math.floor(num(k) ? k : 0) % n) + n) % n; return set[i]; }

// ---- THE GRID: the song's clock as the well hands it (well.mjs gridOf: {epoch_ms, beat_ms, beats_per_bar, zero_ms, source, track_id, title, artist}) ----
/** gridOk(g): a grid this film can cut on. */
export function gridOk(g) { return !!g && typeof g === 'object' && num(g.epoch_ms) && num(g.beat_ms) && g.beat_ms > 200 && g.beat_ms < 2000 && num(g.zero_ms); }
const bpbOf = (g) => (num(g?.beats_per_bar) && g.beats_per_bar >= 1 ? Math.floor(g.beats_per_bar) : 4);
/** beatOf(grid, now_ms): where `now` stands on the grid: the beat and the bar counted from the epoch (negative before it), the phase in the beat, the beat's
 *  and the bar's own instants. null without a grid. */
export function beatOf(g, now) {
  if (!gridOk(g) || !num(now)) return null;
  const bpb = bpbOf(g), bar_ms = g.beat_ms * bpb, x = (now - g.epoch_ms) / g.beat_ms, beat = Math.floor(x), bar = Math.floor(beat / bpb);
  return { x, beat, bar, phase: x - beat, in_bar: beat - bar * bpb, beat_ms: g.beat_ms, bar_ms, beat_at: g.epoch_ms + beat * g.beat_ms, downbeat_ms: g.epoch_ms + bar * bar_ms };
}
/** onBeat(grid, now_ms, tol): the release's judgment: on the beat when within tol of a beat (a share of the beat, either side), and how far off it was. */
export function onBeat(g, now, tol = FILM.on_beat) { const b = beatOf(g, now); if (!b) return null; const f = b.x - Math.round(b.x); return { on: Math.abs(f) <= tol, off_ms: Math.round(f * g.beat_ms), beat_ms: g.beat_ms }; }
/** downbeatAtOrAfter(grid, t_ms): the first downbeat at or after t (house ms); null without a grid. */
export function downbeatAtOrAfter(g, t) { const b = beatOf(g, t); if (!b) return null; return b.downbeat_ms >= t ? b.downbeat_ms : b.downbeat_ms + b.bar_ms; }
/** songMs(grid, house_ms): the song's own time at that instant, at his ears (the station's anchor and the hold); null without a grid. */
export function songMs(g, house) { return gridOk(g) && num(house) ? house - g.zero_ms : null; }
/** mmss(ms, tenths): "m:ss.d" (tenths true) or "m:ss"; null for no number. */
export function mmss(ms, tenths = true) { if (!num(ms)) return null; const t = Math.max(0, ms), m = Math.floor(t / 60000), s = Math.floor((t % 60000) / 1000), d = Math.floor((t % 1000) / 100); return `${m}:${String(s).padStart(2, '0')}${tenths ? '.' + d : ''}`; }
/** filmEndOf({start_ms, eyes_ms, grid, span_ms, tail_bars}): the instant the film ends: the first downbeat at or after the earlier of (her eyes plus tail_bars
 *  bars) and (the start plus span_ms); without a grid, that instant itself. null without a start. */
export function filmEndOf({ start_ms, eyes_ms = null, grid = null, span_ms = FILM.span_ms, tail_bars = FILM.tail_bars } = {}) {
  if (!num(start_ms)) return null; const b = beatOf(grid, start_ms), bar = b ? b.bar_ms : 0;
  const want = Math.min(start_ms + span_ms, num(eyes_ms) ? eyes_ms + tail_bars * bar : Infinity);
  return b ? downbeatAtOrAfter(grid, want) : want;
}

/** reelBarsOf(grid, bars, span_ms): how many bars a reel of her room runs: `bars`, fewer when that many would pass span_ms, one at least. */
export function reelBarsOf(grid, bars = FILM.reel_bars, span_ms = FILM.span_ms) { const b = gridOk(grid) ? grid.beat_ms * bpbOf(grid) : 0, want = num(bars) && bars >= 1 ? Math.floor(bars) : FILM.reel_bars; return b > 0 ? Math.max(1, Math.min(want, Math.floor(span_ms / b))) : want; }
/** reelEndOf({start_ms, start_bar, grid, bars, span_ms}): the instant a reel of her room ends: the downbeat `bars` bars after the bar it started on (the
 *  bar told, else the downbeat nearest its first picture: an encoder's start is a moment after its downbeat); without a grid, the span. null without a start. */
export function reelEndOf({ start_ms, start_bar = null, grid = null, bars = FILM.reel_bars, span_ms = FILM.span_ms } = {}) {
  if (!num(start_ms)) return null; if (!gridOk(grid)) return start_ms + span_ms;
  const bar_ms = grid.beat_ms * bpbOf(grid), bar0 = num(start_bar) ? start_bar : Math.round((start_ms - grid.epoch_ms) / bar_ms);
  return grid.epoch_ms + (bar0 + reelBarsOf(grid, bars, span_ms)) * bar_ms;
}
// ---- THE SHARE'S WORDS: what she was born to, where to start the song, its link, the door; nothing else ----
export function spotifyLink(track_id) { const m = /^spotify:track:([A-Za-z0-9]{1,64})$/.exec(String(track_id || '').trim()); return m ? `https://open.spotify.com/track/${m[1]}` : null; }
export function songLine(song) { const t = song && song.title ? String(song.title).trim() : '', a = song && song.artist ? String(song.artist).trim() : ''; return t ? (a ? `${t} by ${a}` : t) : ''; }
/** addLine(song, start_ms): "Add <title> by <artist>, start at m:ss.d" (the film's first picture on the song's clock), or '' without a song or a start. */
export function addLine(song, start_ms) { const s = songLine(song); return s && num(start_ms) ? `Add ${s}, start at ${mmss(start_ms)}` : ''; }
/** shareTextOf(song, start_ms, how): the share's text: the birth line ('born'; a reel of her room says she dances: 'dances'), the Add line, the song's
 *  open.spotify.com link (a catalogue track's id only), the door. */
export function shareTextOf(song, start_ms, how = 'born') {
  const s = songLine(song), first = how === 'dances' ? (s ? `My Lyssajudron dances to ${s}` : 'My Lyssajudron dances') : (s ? `My Lyssajudron was born to ${s}` : 'My Lyssajudron was born');
  const lines = [first], add = addLine(song, start_ms); if (add) lines.push(add);
  const link = spotifyLink(song && song.track_id); if (link) lines.push(link);
  lines.push(DOOR); return lines.join('\n');
}

// ---- THE WORDS: the ear's lines, their words' own times when it timed them (whisper-local), the sticker at an instant ----
/** linesOf(value, track_id): the lyrics ref's timed lines when found, timed and this song's, each with its words' times when every word has one; else null. */
export function linesOf(value, track_id = null) {
  const v = value; if (!v || typeof v !== 'object' || v.status !== 'found' || v.synced !== true || !Array.isArray(v.lines) || !v.lines.length) return null;
  if (track_id && v.track_id !== track_id) return null;
  const out = [];
  for (const l of v.lines) { if (!l || !num(l.t_ms)) continue; const line = { t_ms: l.t_ms, text: String(l.text ?? '') };
    if (Array.isArray(l.words) && l.words.length && l.words.every((w) => w && num(w.t_ms))) { const ws = l.words.map((w) => ({ t_ms: w.t_ms, end_ms: num(w.end_ms) ? w.end_ms : null, text: String(w.text ?? '').trim() })).filter((w) => w.text); if (ws.length) line.words = ws; }
    out.push(line); }
  return out.length ? out : null;
}
/** timedWords(line): the line's words and their onsets as the ear timed them, folded to LF.words labels like lfWords; null when it timed only the line. */
export function timedWords(line) {
  const ws = Array.isArray(line?.words) ? line.words.filter((w) => w && w.text && num(w.t_ms)) : []; if (!ws.length) return null;
  if (ws.length <= LF.words) return { words: ws.map((w) => String(w.text).slice(0, LF.chars)), on: ws.map((w) => w.t_ms) };
  const words = [], on = [];
  for (let k = 0; k < LF.words; k++) { const a = Math.floor(k * ws.length / LF.words), b = Math.floor((k + 1) * ws.length / LF.words); words.push(ws.slice(a, b).map((w) => w.text).join(' ').slice(0, LF.chars)); on.push(ws[a].t_ms); }
  return { words, on };
}
/** karaokeAt(lines, e_ms): the sticker at this instant of the song: the line being sung (through a rest or past the last line, the line before fades over
 *  LF.fade_ms), its words, the sung word (lit; -1 when the ear timed only the line: the line stands whole, word by word only with the words' own times),
 *  whether the words are timed, the fade (0..1); null before the first line or once the fade is done. */
export function karaokeAt(lines, e) {
  const i = lfLineAt(lines, e); if (i < 0) return null;
  let s = i; while (s >= 0 && !/\S/.test(lines[s].text ?? '')) s--; if (s < 0) return null;
  const line = lines[s], tw = timedWords(line), words = tw ? tw.words : lfWords(line.text); if (!words.length) return null;
  const next = s + 1 < lines.length ? lines[s + 1].t_ms : line.t_ms + LF.tail_ms;
  let lit = -1; if (tw && e < next) for (let w = words.length - 1; w >= 0; w--) if (tw.on[w] <= e) { lit = w; break; }
  const fade = s === i ? (e < next ? 0 : Math.min(1, (e - next) / LF.fade_ms)) : Math.min(1, Math.max(0, (e - lines[i].t_ms) / LF.fade_ms));
  if (fade >= 1) return null;
  return { index: s, words, lit, timed: !!tw, fade, t_on: line.t_ms, t_off: next };
}

function makeCanvas(doc, w, h) { const c = doc.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; }
/** a manga sound: letters in a white fill with an ink rim (paint-order stroke), leaning, on a transparent sprite */
function sfxSprite(doc, text, px, { fill = '#ffffff', stroke = FILM.ink, sw = 12, rot = -10 } = {}) {
  const m = makeCanvas(doc, 8, 8).getContext('2d'); m.font = `900 ${px}px ${FILM.sfx}`;
  const w = Math.ceil(m.measureText(text).width) + sw * 2 + 40, h = Math.ceil(px * 1.35) + sw * 2 + 40, rad = rot * Math.PI / 180;
  const W = Math.ceil(Math.abs(w * Math.cos(rad)) + Math.abs(h * Math.sin(rad))), H = Math.ceil(Math.abs(w * Math.sin(rad)) + Math.abs(h * Math.cos(rad)));
  const c = makeCanvas(doc, W, H), g = c.getContext('2d'); g.translate(W / 2, H / 2); g.rotate(rad); g.font = `900 ${px}px ${FILM.sfx}`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.lineJoin = 'round'; g.lineWidth = sw * 2; g.strokeStyle = stroke; g.strokeText(text, 0, 0); g.fillStyle = fill; g.fillText(text, 0, 0); return c;
}
/** ink focus lines closing on a point, clear at the centre (the page's .focus, manga.py's art_util.focus) */
function focusSprite(doc, w, h) {
  const c = makeCanvas(doc, w, h), g = c.getContext('2d'), cx = w / 2, cy = h / 2, R = Math.hypot(w, h);
  g.fillStyle = 'rgba(14, 14, 18, .86)';
  for (let a = 0; a < 360; a += 5.3) { const r0 = a * Math.PI / 180, r1 = (a + 0.9) * Math.PI / 180; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + R * Math.cos(r0), cy + R * Math.sin(r0)); g.lineTo(cx + R * Math.cos(r1), cy + R * Math.sin(r1)); g.closePath(); g.fill(); }
  const m = g.createRadialGradient(cx, cy, 0, cx, cy, Math.min(w, h) * 0.42); m.addColorStop(0, 'rgba(0,0,0,0)'); m.addColorStop(0.32, 'rgba(0,0,0,0)'); m.addColorStop(1, 'rgba(0,0,0,1)');
  g.globalCompositeOperation = 'destination-in'; g.fillStyle = m; g.fillRect(0, 0, w, h); return c;
}
/** the page: ivory paper under a screentone; no mark, no lettering (the panels are cut by the pictures; their ink frames are drawn over them each picture) */
function paperSprite(doc) {
  const c = makeCanvas(doc, FILM.w, FILM.h), g = c.getContext('2d'); g.fillStyle = FILM.paper; g.fillRect(0, 0, FILM.w, FILM.h);
  const tile = makeCanvas(doc, 8, 8), tg = tile.getContext('2d'); tg.fillStyle = 'rgba(14, 14, 18, .11)'; tg.beginPath(); tg.arc(4, 4, 1.35, 0, Math.PI * 2); tg.fill();
  g.fillStyle = g.createPattern(tile, 'repeat'); g.fillRect(0, 0, FILM.w, FILM.h); return c;
}
/** the karaoke sticker: a white box with an ink shadow and rim, the line's words in the page's serif in rows no wider than the sticker; with timed words the
 *  sung word stands white on red, the words sung in ink, the words to come dimmed; with the line alone, every word in ink */
function stickerSprite(doc, words, lit) {
  const px = FILM.sticker.px, m = makeCanvas(doc, 8, 8).getContext('2d'); m.font = `italic 400 ${px}px ${FILM.serif}`;
  const pad = [34, 20], gap = m.measureText(' ').width, inner = FILM.sticker.max_w - pad[0] * 2, rows = []; let row = [], w = 0;
  for (let i = 0; i < words.length; i++) { const ww = Math.min(inner, m.measureText(words[i]).width); if (row.length && w + gap + ww > inner) { rows.push(row); row = []; w = 0; } row.push({ i, w: ww }); w += (row.length > 1 ? gap : 0) + ww; }
  if (row.length) rows.push(row);
  const width = (r) => r.reduce((a, x) => a + x.w, 0) + gap * (r.length - 1), lh = Math.round(px * 1.22), bw = Math.ceil(Math.max(...rows.map(width)) + pad[0] * 2), bh = lh * rows.length + pad[1] * 2;
  const c = makeCanvas(doc, bw + 14, bh + 14), g = c.getContext('2d');
  g.fillStyle = FILM.ink; g.fillRect(12, 12, bw, bh); g.fillStyle = FILM.box; g.fillRect(0, 0, bw, bh); g.lineWidth = 6; g.strokeStyle = FILM.ink; g.strokeRect(3, 3, bw - 6, bh - 6);
  g.font = m.font; g.textBaseline = 'top';
  rows.forEach((r, ri) => { let x = (bw - width(r)) / 2; const y = pad[1] + ri * lh + Math.round(px * 0.04);
    for (const it of r) { if (it.i === lit) { g.fillStyle = FILM.red; g.fillRect(x - 8, y - 4, it.w + 16, lh - 2); g.fillStyle = '#ffffff'; } else g.fillStyle = lit >= 0 && it.i > lit ? FILM.dim : FILM.ink;
      g.fillText(words[it.i], x, y, it.w); x += it.w + gap; } });
  return c;
}

/** mountBirthFilm({source, well, grid, song, lyrics, armed, now, doc, win, onReady}): the film on her well's canvas. source: the well's canvas; well: the well
 *  (its places() for her place and his shadow's once a second, its state() for its cost, its on('paint') for its pictures: the film takes each from the canvas itself, right after the well's draw; its on('room') for the room's opening); grid: the song's grid as the well keeps it (well.state().grid), or a function returning it (it moves with the
 *  study); song: {track_id, title, artist} for the share's words; lyrics: the ear's ref value (activity/spotify/lyrics), or hand it later with words(value);
 *  armed: true when his hand has landed and the shot is to come (the recorder starts on the next downbeat), false to start at once; now: the house clock.
 *  reel: { bars } for A REEL OF HER ROOM (armed: its recorder starts once on the next downbeat, the film ends `bars` bars later; no shot is awaited).
 *  ground: a colour laid under each copy of a transparent source (A REEL ON A GLASS WITH NO GROUND); null for a well, which paints its whole picture.
 *  onReady(blob, state) when the film is a file (blob null when nothing was kept).
 *  -> { shot(k, fx, fy, hit), eyes(), words(value), song(reading), disarm(), stop(), started(), progress(), blob(), measure(), state() } */
export function mountBirthFilm({ source, well = null, grid = null, song = null, lyrics = null, armed = false, reel = null, ground = null, now = () => Date.now(), doc = globalThis.document, win = globalThis.window, onReady = null } = {}) {
  const GROUND = typeof ground === 'string' && ground ? ground : null;
  const asked = { state: 0, places: 0, grid: 0 };   // THE WELL ASKED (state().well_asked): how often this film reads the well: state() for its cost (forty fields and a dozen layers' states composed), places() for her place and the sand's (two numbers), grid for the page's grid getter (on the Mac's page it reads state() too, every call: the next anneal)
  const perf = win.performance, gridNow = typeof grid === 'function' ? () => { asked.grid++; return grid(); } : () => grid, REEL = reel && typeof reel === 'object' ? { bars: num(reel.bars) && reel.bars >= 1 ? Math.floor(reel.bars) : FILM.reel_bars, layouts: pagesOk(reel.layouts) ? reel.layouts : FILM.reel_layouts } : null;   // A REEL OF HER ROOM: armed, one start, an end after its bars
  const wellCost = () => { try { asked.state++; const s = well.state(); return { picture_ms: s.picture_ms, pictures: s.pictures, slow: s.slow }; } catch { return null; } };
  const S = { armed: !!armed || !!REEL, start_house: null, start_meant: null, start_pending: false, start_on_bar: false, start_bar: null, start_late_ms: null, ended_at: null, reason: null, pictures: 0, direct: 0, draw_sum: 0, draw_max: 0, source_sum: 0, first_perf: null, last_perf: null,
    bytes: 0, mime: null, MR: null, blob: null, chunks: [], gen: 0, restarts: 0, errors: 0, why: [], shots: [], eyes_at: null, last_bar: null, line: null, line_at: null,
    song: song && typeof song === 'object' ? { track_id: song.track_id ?? null, title: song.title ?? null, artist: song.artist ?? null } : null,
    lines: null, words_from: null, well_before: wellCost(), well_during: null, source_px: [0, 0], her: null, shadow: null, shadow_seen: false, shadow_at: null, room: null, her_at: -Infinity, grid_seen: null };   // shadow_seen: his shadow stood in a picture this recorder got; shadow_at: that first picture's house ms (where the room entered the film); room: the room's opening, said by the well and not yet in a picture the recorder got
  const film = makeCanvas(doc, FILM.w, FILM.h), g = film.getContext('2d', { alpha: false, desynchronized: true }) || film.getContext('2d');
  film.setAttribute('aria-hidden', 'true'); film.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:.01;pointer-events:none;z-index:-1';
  const paper = paperSprite(doc), sprites = new Map(), stickers = new Map(), focus = new Map();
  const sprite = (key, make) => { let s = sprites.get(key); if (!s) { s = make(); sprites.set(key, s); } return s; };
  const DON = () => sprite('don', () => sfxSprite(doc, 'ドン!', 170)), DON_SMALL = () => sprite('don-small', () => sfxSprite(doc, 'ドン', 112, { sw: 9 })), DOKUN = () => sprite('dokun', () => sfxSprite(doc, 'ドクン', 230, { rot: -8 }));
  const focusOf = (w, h) => { const k = w + 'x' + h; let f = focus.get(k); if (!f) { f = focusSprite(doc, w, h); focus.set(k, f); } return f; };
  const stickerOf = (words, lit) => { const k = words.join('\u0001') + '\u0002' + lit; let s = stickers.get(k); if (!s) { if (stickers.size > 48) stickers.clear(); s = stickerSprite(doc, words, lit); stickers.set(k, s); } return s; };
  function takeWords(value) { const ls = linesOf(value, S.song && S.song.track_id ? S.song.track_id : null); S.lines = ls; S.words_from = ls ? (ls.some((l) => l.words) ? 'the ear, words timed' : 'the ear, lines timed') : 'none'; }
  if (lyrics) takeWords(lyrics);
  // THE WELL'S OWN PICTURE: the film takes each picture straight from the well's canvas, in the well's own frame, right after the well has drawn it (onPaint,
  // below). A well with no 'paint' bus is filmed as before: its canvas as a stream on a hidden video, a frame a picture of the well
  let vid = null, stream = null, track = null, recorder = null, endTimer = 0, armTimer = 0, rafId = 0, alive = true, offPaint = null, offRoom = null, direct = false;
  const pace = paceOf(FILM.fps), leaveBus = () => { for (const off of [offPaint, offRoom]) if (off) { try { off(); } catch { /* gone */ } } offPaint = offRoom = null; };
  try { if (well && typeof well.on === 'function' && typeof win.queueMicrotask === 'function') { const off = well.on('paint', onPaint); offPaint = typeof off === 'function' ? off : null; direct = true; } } catch (e) { S.why.push('well paint: ' + String(e && e.message || e).slice(0, 80)); }
  try { if (well && typeof well.on === 'function') { const off = well.on('room', onRoom); offRoom = typeof off === 'function' ? off : null; } } catch (e) { S.why.push('well room: ' + String(e && e.message || e).slice(0, 80)); }   // HIS SHADOW IN THE FILM, ON CAUSE: the well's word that the room opened (the sand began where she stood)
  const apart = direct ? makeCanvas(doc, source.width || 1, source.height || 1) : null, ag = apart ? apart.getContext('2d', { alpha: false }) : null;   // the copy of the well's picture the panels are cut from: the well's own size, never in the page
  if (direct) (doc.body || doc.documentElement).append(film);
  else try { const vs = source.captureStream(FILM.fps); vid = doc.createElement('video'); vid.muted = true; vid.playsInline = true; vid.autoplay = true; vid.setAttribute('aria-hidden', 'true');
    vid.style.cssText = film.style.cssText; vid.srcObject = vs; (doc.body || doc.documentElement).append(film, vid); vid.play().catch((e) => { S.why.push('well video: ' + String(e && e.message || e).slice(0, 80)); });
  } catch (e) { S.why.push('well capture: ' + String(e && e.message || e).slice(0, 80)); (doc.body || doc.documentElement).append(film); }
  // the recorder on the film's own stream (a frame each picture: requestFrame); no audio track, ever
  try {
    stream = film.captureStream(0); track = stream.getVideoTracks()[0] || null;
    if (!track || typeof track.requestFrame !== 'function') { stream = film.captureStream(FILM.fps); track = null; }
    const MR = win.MediaRecorder; S.mime = MR ? pickMime((m) => MR.isTypeSupported(m)) : null;
    if (!MR || !S.mime) throw new Error('this glass records no video'); S.MR = MR;
  } catch (e) { S.errors++; S.why.push(String(e && e.message || e).slice(0, 100)); }
  function startRecorder(at_house, onBar) {   // the film's first picture is this instant: a new recorder (a restarted one's late chunks are told by their generation and dropped)
    if (!S.MR || !stream || !alive) return false; const gen = ++S.gen;
    if (recorder && recorder.state !== 'inactive') { try { recorder.stop(); } catch { /* gone */ } S.restarts++; }
    S.chunks = []; S.bytes = 0; S.shadow_seen = false; S.shadow_at = null; readPlaces(); S.room = num(S.shadow) ? S.room || 'standing' : null;   // the film is this recorder's pictures: what an earlier start saw is dropped with its chunks; a room standing as the recorder starts (a reel of her room; a room opened before the downbeat and still open) is in its first picture: one read, at this cause, and a room said before but closed since is not the film's
    try {
      const r = new S.MR(stream, { mimeType: S.mime, videoBitsPerSecond: FILM.bitrate });
      r.ondataavailable = (e) => { if (gen === S.gen && e.data && e.data.size) { S.chunks.push(e.data); S.bytes += e.data.size; } };
      r.onerror = (e) => { if (gen !== S.gen) return; S.errors++; S.why.push('recorder: ' + String(e.error && e.error.message || e.error || e).slice(0, 80)); };
      r.onstop = () => { if (gen !== S.gen) return; try { S.blob = new Blob(S.chunks, { type: S.mime.split(';')[0] }); S.bytes = S.blob.size; } catch (e) { S.errors++; S.why.push('blob: ' + String(e && e.message || e).slice(0, 80)); } S.chunks = []; release(); ready(); };
      r.start(1000); recorder = r;
    } catch (e) { S.errors++; S.why.push('start: ' + String(e && e.message || e).slice(0, 80)); recorder = null; return false; }
    const b = beatOf(gridNow(), at_house); S.start_meant = at_house; S.start_pending = true; S.start_house = null; S.start_on_bar = !!onBar && !!b; S.start_bar = b ? b.bar : null; S.start_late_ms = null; S.grid_seen = snap(gridNow());   // the film's own start is the next picture drawn (the first the live encoder gets): start_house is set there and the share tells THAT instant; the proof of 18:03 measured the encoder's start at 374 ms after the downbeat it was meant on
    win.clearTimeout(armTimer); win.clearTimeout(endTimer); endTimer = win.setTimeout(() => finish('the end mark (no picture came)'), FILM.span_ms + (b ? 2 * b.bar_ms : 0) + FILM.end_slack_ms);
    return true;
  }
  const snap = (gr) => (gridOk(gr) ? { bpm: Math.round(60000 / gr.beat_ms * 10) / 10, beat_ms: Math.round(gr.beat_ms * 10) / 10, beats_per_bar: bpbOf(gr), source: gr.source ?? null, study: gr.study ? { beats: gr.study.beats, sections: gr.study.sections, residual_rms_ms: gr.study.residual_rms_ms } : null } : null);
  const endOf = () => (REEL ? reelEndOf({ start_ms: S.start_house, start_bar: S.start_bar, grid: gridNow(), bars: REEL.bars }) : filmEndOf({ start_ms: S.start_house, eyes_ms: S.eyes_at, grid: gridNow() }));
  if (!S.armed) startRecorder(now(), false);   // snap and endOf stand above this line: an unarmed film (a key's shot, a tap with no hand before it) read snap here before its own line and threw at its mount, a recorder left running (found Oct 14 2026 by this file's test)
  else armTimer = win.setTimeout(() => { if (S.start_house == null) finish('armed and never started'); }, 90000);   // a hand held on the field for a minute and a half with no downbeat (the glass hidden): dropped
  // the pictures: each picture of the well (its 'paint' event says one is being made: the microtask queued here runs when the well's frame callback returns,
  // after its draw and before the glass composes, so the well's drawing buffer is whole and is this very instant's), FILM.fps a second at most; on the
  // stream, each new frame of it, else the glass's animation frames at most FILM.fps a second
  function onPaint() { if (alive && pace(perf.now())) win.queueMicrotask(picture); }
  const useVFC = !direct && vid && typeof vid.requestVideoFrameCallback === 'function';
  let lastRaf = -1e9;
  function onVideoFrame() { if (!alive) return; picture(); try { vid.requestVideoFrameCallback(onVideoFrame); } catch { /* gone */ } }
  function onRaf(ts) { if (!alive) return; if (ts - lastRaf >= 1000 / FILM.fps - 2) { lastRaf = ts; picture(); } rafId = win.requestAnimationFrame(onRaf); }
  if (direct) { /* the well's own pictures drive the film */ } else if (useVFC) { try { vid.requestVideoFrameCallback(onVideoFrame); } catch (e) { S.why.push('vfc: ' + String(e && e.message || e).slice(0, 60)); rafId = win.requestAnimationFrame(onRaf); } } else rafId = win.requestAnimationFrame(onRaf);
  function readPlaces(t = perf.now()) {   // her place and his shadow's, as shares of the well's picture: the well's two numbers (well.places(): her centre on the glass in host px; the sand's own place across the glass, well-sand.mjs at_px[0]: where she stood before her room widened, while the sand stands; its at_px[1] is her figure's ground, and the shadow stands on it as tall as she was, so its middle is at her own height)
    S.her_at = t; try { asked.places++; const [px, sx] = well.places(), cw = source.clientWidth; S.her = num(px) && cw > 0 ? Math.max(0.1, Math.min(0.9, px / cw)) : null; S.shadow = num(sx) && cw > 0 ? Math.max(0.05, Math.min(0.95, sx / cw)) : null; } catch { S.her = null; S.shadow = null; }
  }
  function herCentre(vw, vh) {   // where she stands in the well's picture, for the panels: read once a second (readPlaces)
    const t = perf.now(); if (t - S.her_at > 1000) readPlaces(t);
    return [(num(S.her) ? S.her : 0.5) * vw, 0.46 * vh];
  }
  function onRoom(d) { if (alive) S.room = d && Array.isArray(d.at_px) ? d.at_px.slice(0, 2) : 'opened'; }   // HIS SHADOW IN THE FILM, ON CAUSE: the well says the room opened (the sand began where she stood); kept until the next picture the recorder gets (picture), or dropped at the recorder's start when the room has closed since
  function picture() {
    if (!alive) return; const t0 = perf.now(), hn = now(), gr = gridNow(), b = beatOf(gr, hn);
    if (S.first_perf == null) S.first_perf = t0; S.last_perf = t0;
    if (b && S.armed && !S.shots.length && S.last_bar != null && b.bar !== S.last_bar && (S.start_house == null || (!REEL && b.bar - S.start_bar >= FILM.lead_bars))) startRecorder(b.downbeat_ms, true);   // a downbeat passed with no shot yet: the recorder starts here, or again
    if (b) S.last_bar = b.bar;
    const pic = direct ? source : vid, vw = direct ? source.width : vid ? vid.videoWidth : 0, vh = direct ? source.height : vid ? vid.videoHeight : 0; S.source_px = [vw, vh];
    g.drawImage(paper, 0, 0);
    const lay = layoutOf(b ? b.bar - (S.start_bar ?? b.bar) : 0, REEL ? REEL.layouts : FILM.layouts), cut = b ? hn - b.downbeat_ms : Infinity;
    const hits = S.shots.map((s) => s.at), last = S.shots.length ? S.shots[S.shots.length - 1].at : null, eyesT = S.eyes_at;
    const zBeat = b ? 1 + FILM.beat_punch * Math.exp(-Math.max(0, hn - b.beat_at) / FILM.beat_tau_ms) : 1;
    const zShot = punch(hn, hits, 0.07) * (eyesT != null ? punch(hn, [eyesT], 0.14, 180) : 1);
    const sh = eyesT != null && hn - eyesT < 450 ? shake(hn, eyesT, 26) : shake(hn, last, 14);
    const [hx, hy] = vw > 0 ? herCentre(vw, vh) : [0, 0];
    const crops = vw > 0 && vh > 0 ? lay.map(([, , w, h, tight]) => { const on = tight === 'shadow' && num(S.shadow) ? [S.shadow * vw, hy] : [hx, hy], z = zBeat * zShot * (tight ? 1 / FILM.tight : 1), k = tight ? 0.6 : 1;   // each panel's cut of the well's picture: on his shadow where there is one, else on her
      return coverCrop(vw, vh, w, h, z, (tight ? on[0] : vw / 2) + sh[0] * k * vw / w, (tight ? on[1] : vh / 2) + sh[1] * k * vh / h); }) : null;
    let from = pic, ox = 0, oy = 0; const u = ag && crops ? unionOf(crops, vw, vh) : null, a0 = perf.now();
    if (u) { if (apart.width !== vw || apart.height !== vh) { apart.width = vw; apart.height = vh; } if (GROUND) { ag.fillStyle = GROUND; ag.fillRect(0, 0, u[2], u[3]); }   // A REEL ON A GLASS WITH NO GROUND: the colour under her first, so no picture keeps the last
      ag.drawImage(source, u[0], u[1], u[2], u[3], 0, 0, u[2], u[3]); from = apart; ox = u[0]; oy = u[1]; }   // THE WELL'S CANVAS NEVER MEETS THE FILM: what the panels need of it, copied once at its own size onto the canvas apart (the glass grown since: the canvas apart follows)
    for (let pi = 0; pi < lay.length; pi++) { const [x, y, w, h] = lay[pi];
      if (crops) { const [sx, sy, sw, shh] = crops[pi]; g.drawImage(from, sx - ox, sy - oy, sw, shh, x, y, w, h); if (!pi) S.source_sum += perf.now() - a0; }   // source_ms: the well's picture brought to the film: the copy and the first panel's draw (on the stream the first draw brings the whole frame, the second finds it there)
      else { g.fillStyle = FILM.ink; g.fillRect(x, y, w, h); }
      const fz = pi === 0 && last != null && hn - last < FILM.focus_ms ? 1 - (hn - last) / FILM.focus_ms : pi === lay.length - 1 && eyesT != null && hn - eyesT < FILM.focus_ms ? 1 - (hn - eyesT) / FILM.focus_ms : 0;
      if (fz > 0) { g.globalAlpha = fz; g.drawImage(focusOf(w, h), x, y); g.globalAlpha = 1; }
      g.lineWidth = cut < FILM.cut_ms ? 8 + 10 * (1 - cut / FILM.cut_ms) : 8; g.strokeStyle = FILM.ink; g.strokeRect(x - 5, y - 5, w + 9, h + 9); }   // the cut: the frames slammed in on the downbeat
    if (S.room && recorder) { if (!S.shadow_seen) { S.shadow_seen = true; S.shadow_at = hn; } S.room = null; }   // HIS SHADOW IN THE FILM, ON CAUSE: the room opened (the well's 'room', or standing as the recorder started): this picture, the first the recorder gets with it, is where the room entered the film
    const P0 = lay[0], PL = lay[lay.length - 1];
    for (const s of S.shots) if (hn - s.at < FILM.don_ms) { const d = s.full ? DON() : DON_SMALL(), z = pop(hn, s.at); g.save(); g.translate(P0[0] + (0.22 + 0.56 * s.fx) * P0[2], P0[1] + (0.2 + 0.5 * s.fy) * P0[3]); g.scale(z, z); g.globalAlpha = hn - s.at > FILM.don_ms - 200 ? (FILM.don_ms - (hn - s.at)) / 200 : 1; g.drawImage(d, -d.width / 2, -d.height / 2); g.restore(); }   // ドン where the release landed: full on the beat, smaller off it
    if (eyesT != null && hn - eyesT < FILM.dokun_ms) { const d = DOKUN(), z = pop(hn, eyesT, 100); g.save(); g.translate(FILM.w / 2, PL[1] + PL[3] * 0.38); g.scale(z, z); g.globalAlpha = hn - eyesT > FILM.dokun_ms - 300 ? (FILM.dokun_ms - (hn - eyesT)) / 300 : 1; g.drawImage(d, -d.width / 2, -d.height / 2); g.restore();
      if (hn - eyesT < FILM.flash_ms) { g.fillStyle = `rgba(255,255,255,${(1 - (hn - eyesT) / FILM.flash_ms).toFixed(3)})`; g.fillRect(0, 0, FILM.w, FILM.h); } }
    // the song's words: the sticker, the line being sung, its sung word lit when the words are timed
    if (S.lines) { const e = songMs(gr, hn), k = num(e) ? karaokeAt(S.lines, e) : null;
      if (k) { if (k.index !== S.line) { S.line = k.index; S.line_at = hn; } const d = stickerOf(k.words, k.lit), z = 0.9 + 0.1 * pop(hn, S.line_at); g.save(); g.translate(FILM.sticker.x, FILM.sticker.y); g.scale(z, z); g.globalAlpha = 1 - k.fade; g.drawImage(d, -d.width / 2, -d.height / 2); g.restore(); }
      else S.line = null; }
    S.pictures++; if (direct) S.direct++; const d = perf.now() - t0; S.draw_sum += d; if (d > S.draw_max) S.draw_max = d;
    if (S.start_pending && recorder) { S.start_pending = false; S.start_house = hn; S.start_late_ms = Math.round(hn - S.start_meant); }   // the first picture the recorder gets: the film's own start (the share's "start at"); late_ms: how far after the downbeat it was meant on
    if (track) { try { track.requestFrame(); } catch { /* the stream ended */ } }
    if (S.pictures % 30 === 0) S.well_during = wellCost();
    if (S.start_house != null) { const end = endOf(); if (num(end) && hn >= end) finish('the end mark'); }
  }
  function release() { leaveBus(); if (apart) apart.width = apart.height = 1; try { for (const tr of stream ? stream.getTracks() : []) tr.stop(); } catch { /* gone */ } try { if (vid) { vid.pause(); for (const tr of vid.srcObject ? vid.srcObject.getTracks() : []) tr.stop(); vid.srcObject = null; vid.remove(); } } catch { /* gone */ } try { film.remove(); } catch { /* gone */ } }
  function ready() { if (onReady) { try { onReady(S.blob, api.state()); } catch (e) { S.errors++; S.why.push('onReady: ' + String(e && e.message || e).slice(0, 80)); } } }
  function finish(reason) {
    if (!alive) return; alive = false; leaveBus(); S.ended_at = now(); S.reason = reason; win.clearTimeout(endTimer); win.clearTimeout(armTimer); if (rafId) win.cancelAnimationFrame(rafId); S.well_during = wellCost() || S.well_during;
    if (recorder && recorder.state !== 'inactive') { try { recorder.stop(); return; } catch (e) { S.errors++; S.why.push('stop: ' + String(e && e.message || e).slice(0, 80)); } }
    release(); ready();
  }
  const api = {
    shot(k, fx = 0.5, fy = 0.5, hit = null) { if (!alive) return; const hn = now(); if (S.start_house == null && !S.start_pending) startRecorder(hn, false);   // a shot before any downbeat (a key's, a tap faster than a bar): the film starts where it is
      S.shots.push({ k, at: hn, fx: num(fx) ? Math.max(0, Math.min(1, fx)) : 0.5, fy: num(fy) ? Math.max(0, Math.min(1, fy)) : 0.5, full: hit && typeof hit === 'object' ? !!hit.on : true, off_ms: hit && num(hit.off_ms) ? hit.off_ms : null }); },
    eyes() { if (!alive || S.eyes_at != null) return; S.eyes_at = now(); },
    words(value) { takeWords(value); },
    song(reading) { if (reading && typeof reading === 'object') S.song = { ...(S.song || {}), ...reading }; },
    disarm() { if (!alive) return; if (S.shots.length) return; S.gen++; if (recorder && recorder.state !== 'inactive') { try { recorder.stop(); } catch { /* gone */ } } recorder = null; S.chunks = []; S.bytes = 0; S.start_house = null; S.start_pending = false; alive = false; S.ended_at = now(); S.reason = 'disarmed'; win.clearTimeout(endTimer); win.clearTimeout(armTimer); if (rafId) win.cancelAnimationFrame(rafId); release(); },   // the hand left with no shot: nothing kept, nothing said
    stop() { finish('stopped'); },
    started: () => S.start_house != null,
    progress() { if (!REEL) return null; const gr = gridNow(), n = reelBarsOf(gr, REEL.bars), b = beatOf(gr, S.ended_at ?? now()); return { bars: n, done: S.start_house != null && b && num(S.start_bar) ? Math.max(0, Math.min(n, b.bar - S.start_bar)) : 0, started: S.start_house != null, ended: S.ended_at != null }; },   // A REEL OF HER ROOM: its bars and how many have passed, for the door that counts them
    blob: () => S.blob,
    measure: () => measureFilm(S.blob, doc),
    state: () => { const gr = gridNow(), start_song = songMs(gr, S.start_house); return {
      pictures: S.pictures, draw_ms: S.pictures ? Math.round(S.draw_sum / S.pictures * 100) / 100 : null, draw_max_ms: Math.round(S.draw_max * 100) / 100,
      source_ms: S.pictures ? Math.round(S.source_sum / S.pictures * 100) / 100 : null, direct: S.direct,   // source_ms: of draw_ms, the part that brings the well's picture to the film; direct: the pictures taken straight from the well's canvas (0: from its stream)
      pictures_a_s: S.pictures > 1 && S.last_perf > S.first_perf ? Math.round((S.pictures - 1) / ((S.last_perf - S.first_perf) / 1000) * 10) / 10 : 0,
      well_before: S.well_before, well_during: S.well_during, well_asked: { ...asked }, bytes: S.bytes, mime: S.mime, armed: S.armed, restarts: S.restarts,   // well_asked: the well's reads by this film (THE WELL ASKED, above)
      start: S.start_house == null ? null : { house_ms: S.start_house, song_ms: start_song == null ? null : Math.round(start_song), at: mmss(start_song), on_bar: S.start_on_bar, bar: S.start_bar, late_ms: S.start_late_ms },
      duration_ms: S.start_house == null ? 0 : Math.round((S.ended_at ?? now()) - S.start_house), end: S.ended_at == null ? null : (() => { const e = songMs(gr, S.ended_at), m = endOf(), late = num(m) ? Math.round(S.ended_at - m) : null; return { house_ms: S.ended_at, song_ms: e == null ? null : Math.round(e), late_ms: late, on_bar: late != null && Math.abs(late) <= 1500 / FILM.fps }; })(),   // on_bar: the end picture within a picture and a half of its downbeat (the proof of 18:03: 40 ms late, one picture)
      shots: S.shots.length, on_beat: S.shots.filter((s) => s.full).length, off_ms: S.shots.map((s) => s.off_ms), eyes: S.eyes_at != null,
      shadow: S.shadow_seen, shadow_at_ms: (() => { const e = S.shadow_at == null ? null : songMs(gr, S.shadow_at); return e == null ? null : Math.round(e); })(),   // HIS SHADOW IN THE FILM (Oct 14 2026 03:3x, ON CAUSE 06:2x): shadow: true once his shadow (the room) stood in a picture the recorder got; shadow_at_ms: the song time of that first picture, where the room entered the film (where a cut would fall, if he rules one), null when none. The receipt's two words on the room (birth-session.mjs filmFactsOf)
      hits: S.shots.map((s) => { const e = songMs(gr, s.at); return { k: s.k, on: s.full, off_ms: s.off_ms, song_ms: e == null ? null : Math.round(e) }; }),   // THE KARAOKE SESSION IS WHAT THE MINT READS (birth-session.mjs): each shot as judged, on the beat or off it, how far, where in the song
      words: { lines: S.lines ? S.lines.length : 0, timed: S.lines ? S.lines.filter((l) => l.words).length : 0, from: S.words_from }, grid: snap(gr), grid_at_start: S.grid_seen,
      song: S.song, share: shareTextOf(S.song, start_song, REEL ? 'dances' : 'born'), add: addLine(S.song, start_song), reel: REEL ? { bars: reelBarsOf(gr, REEL.bars), shadow: num(S.shadow), her_at: num(S.her) ? Math.round(S.her * 1000) / 1000 : null, shadow_at: num(S.shadow) ? Math.round(S.shadow * 1000) / 1000 : null } : null,
      source_px: S.source_px, film_px: [FILM.w, FILM.h], audio: 'none: a muted reel', pictures_by: direct || useVFC ? 'the well\'s frames' : 'animation frames', ended: S.ended_at != null, reason: S.reason, ready: !!S.blob, errors: S.errors, why: S.why.slice(0, 4) }; },
  };
  return api;
}

/** measureFilm(blob, doc): the film's own seconds as a video element reads them (a webm from Chrome says Infinity until it is seeked to its end: the seek is done). */
export function measureFilm(blob, doc = globalThis.document) {
  return new Promise((ok) => {
    if (!blob) return ok({ seconds: null, why: 'no film' });
    let url; try { url = URL.createObjectURL(blob); } catch (e) { return ok({ seconds: null, why: String(e && e.message || e) }); }
    const v = doc.createElement('video'); v.muted = true; v.preload = 'metadata'; let done = false;
    const end = (seconds, why = null) => { if (done) return; done = true; try { URL.revokeObjectURL(url); } catch { /* gone */ } ok({ seconds: num(seconds) ? Math.round(seconds * 1000) / 1000 : null, why }); };
    v.onloadedmetadata = () => { if (num(v.duration) && v.duration !== Infinity) return end(v.duration); v.ontimeupdate = () => { if (num(v.duration) && v.duration !== Infinity) end(v.duration); }; try { v.currentTime = 1e101; } catch { end(null, 'no seek'); } };
    v.onerror = () => end(null, 'the glass cannot read the film back'); setTimeout(() => end(null, 'no metadata in 8 s'), 8000); v.src = url;
  });
}

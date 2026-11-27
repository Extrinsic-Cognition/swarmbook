// dl-twelve-clock.js: THE SOUND NEVER RESTARTS THE PICTURE. The clock between the mint hero's film and its song (dl-twelve.js), kept here
// alone so it is tested without a browser (dl-twelve.test.mjs).
//
// His words, Oct 14 2026 22:0x WEST, the tenth time: "there's been 10 times i said playing audio would cause replay from the start; every
// time you fixed that. do you undrstand the torment nexus you put me in? i tell you to fix, you tell me you fix, you break again". Before
// that: 13:5x WEST ("it is restarting the video when i click on it ... just fucking play the sound do not restart the fucking video") and
// 21:2x WEST ("IT RESTARTS AGAIN WHEN I PRESS AUDIO PLAY").
//
// WHY IT CAME BACK. The song is the clock and the picture follows it: past 0.1 s of drift the film was sought to the song's second, however
// far that was. Every copy he was shown was served by `python3 -m http.server`, which answers a Range request with 200 and the whole file;
// Chrome then takes the film and the song for streams, their `seekable` is [0, 0], and every seek lands on 0. So the tap put the song at the
// picture's second, the song landed on 0, and the picture was sought to the song: back to the start. Each fix was right on a server that
// answers Range (aiolos, 206) and wrong on the copy he looked at. Copies are now served by tools/serve-range (C, 206).
//
// THE CHASE (his Oct 15 2026 16:3x WEST: "why the fuck i am still hearing audio getting async from time to time?"). The picture was caught up
// by a seek whenever it fell 0.1 s behind the song. A seek decodes from the keyframe before its target, and this film's keyframes stand 2.17 s
// apart (the median), up to 8.34 s (18.92 to 27.26 s): a seek cost 3 to 20 ms just past a keyframe and up to 150 ms 8 s past one at load 70,
// hundreds of ms under load. A seek that costs more than 0.1 s of the song lands the picture more than 0.1 s behind again, and it was sought
// again: at load about 350, 32 seeks between 11.1 and 19 s of the film, the picture moving 2 to 30 ms between them while the song moved 113
// to 686 ms, up to 320 ms behind the sound, frozen frames and jumps until the load passed. A drift is now caught by the picture's speed, which
// costs nothing and never freezes it; a seek is kept for a stall of more than a second, and aimed ahead of the song by what a seek costs.
//
// THE RULE, whatever the server:
//   1. The tap (soundIn) puts the song at the picture's second and never touches the picture.
//   2. While the gap is JUMP_S (1 s) or less, the clock (clockStep, keepTime) moves the picture by its speed alone, never by a seek: nothing
//      within DRIFT_LEAN_S (a frame and a half: a frame's own jitter is not a cause); past it a rate toward the song in proportion to the gap
//      (leanRate: LEAN_GAIN per second of gap, at most LEAN_MAX either way) until it is back within SETTLE_S. The picture is never sought back.
//   3. Behind the song by more than JUMP_S (a stall), the picture jumps forward to the song's second plus a lead, what the last jump cost
//      (LEAD_S until one has landed: where it lands against the song says what it cost), at most once in AGAIN_S of the song; between jumps
//      it leans.
//   4. Ahead of the song by more than JUMP_S, the sound jumped (its load, the loop's seam, a seek that landed elsewhere): the SONG goes to the
//      picture's second, and the picture holds.
//   5. Nothing is sought to a second outside the media's seekable ranges (seekableAt). Where the song cannot go to the picture, the picture
//      still holds and the sound runs where it is (count.held says so); where the picture cannot jump, it leans.
//   6. The picture's first data with the sound already on (a tap before the film loaded, pictureIn) moves it forward to the song, never back.
//   7. THE DEBUG START (his Oct 17 2026 03:5x WEST: "please for the sake of time, with a debug flag huge as fuck, make the video start at the 2nd
//      dodecahedron explosion please dude"; 04:14, over the page opened without the address flag: "i asked to make it startfrom the 2nd
//      dodecahedron thing"): ?debug on the page's address (debugStartOf), or else the Nest's word mint/debug-start on his house's doors
//      (debugStartWord, asksNest), puts the picture and the song, each at its first load, before any tap, at the second burst's first frame
//      (DEBUG_START_S, just inside frame 1141, the golden one cut in); ?debug=<seconds> at that second; ?debug=off keeps the film's own start
//      whatever the word says. Forward only and inside the seekable ranges (startAt): on a server that ignores Range nothing is sought, and the
//      page's state().debug says so (no banner since his 22:0x WEST). Nothing here runs after the first tap: the tap still brings the sound
//      to the picture (rule 1).
export const DRIFT_LEAN_S = 0.045, SETTLE_S = 0.015, LEAN_GAIN = 1.5, LEAN_MAX = 0.25, JUMP_S = 1, SEAM_S = 0.5;
export const LEAD_S = 0.2, LEAD_MIN_S = 0.05, LEAD_MAX_S = 1, AGAIN_S = 1;

/** Whether second t is inside the media's seekable ranges. A stand-in without `seekable` (a test's) is taken as seekable. */
export const seekableAt = (media, t) => {
  const ranges = media?.seekable;
  if (!ranges || typeof ranges.length !== 'number') return true;
  for (let i = 0; i < ranges.length; i++) if (ranges.start(i) - 1e-3 <= t && t <= ranges.end(i) + 1e-3) return true;
  return false;
};

/** The picture's rate toward the song for a gap (the song's second minus the picture's): LEAN_GAIN per second of gap, at most LEAN_MAX either
 *  way, in hundredths (a rate is written only when it changes). */
export const leanRate = (gap) => Math.round((1 + Math.max(-LEAN_MAX, Math.min(LEAN_MAX, gap * LEAN_GAIN))) * 100) / 100;

// the loop's seam: one of the two has wrapped to its start and the other is about to; both go on by themselves
const atSeam = (s, f, d) => Number.isFinite(d) && d > 2 * SEAM_S && ((s < SEAM_S && d - f < SEAM_S) || (f < SEAM_S && d - s < SEAM_S));

/**
 * One step of the clock, read from the two media and the clock's memory (keepTime's count: the last jump and the lead learned), written
 * nowhere: {song?, film?, lead?, rate?, held?, why}. song/film: the second to seek that one to; lead: how far ahead of the song the picture
 * jumps; rate: the film's playback rate; held: the sound jumped and could not come to the picture, so the picture held.
 */
export function clockStep(song, film, joining = false, memo = {}) {
  const s = song.currentTime, f = film.currentTime, gap = s - f;   // gap > 0: the picture is behind the song
  // a picture already leaning leans until it is back within SETTLE_S; one at its own speed is in time within DRIFT_LEAN_S
  if (Math.abs(gap) <= (film.playbackRate !== 1 ? SETTLE_S : DRIFT_LEAN_S)) return {rate: 1, why: 'in time'};
  if (atSeam(s, f, film.duration)) return {why: 'seam'};
  if (joining || gap < -JUMP_S) {   // the sound comes in, or it jumped back (its load, a seek that landed elsewhere): the SONG to the picture
    if (seekableAt(song, f)) return {song: f, rate: 1, why: joining ? 'the sound comes in at the picture' : 'the sound jumped back: to the picture'};
    return {rate: 1, held: true, why: 'the song cannot go to the picture: the picture holds'};
  }
  const again = memo.jump && memo.jump.at <= s && s - memo.jump.at < AGAIN_S;
  if (gap > JUMP_S && !again) {   // a stall: the picture jumps ahead of the song by what a jump costs, so it lands with the song, not behind it
    const lead = memo.lead ?? LEAD_S;
    if (seekableAt(film, s + lead)) return {film: s + lead, lead, rate: 1, why: 'a stall: the picture jumps ahead of the song'};
    if (seekableAt(film, s)) return {film: s, lead: 0, rate: 1, why: 'a stall: the picture jumps to the song'};
  }
  return {rate: leanRate(gap), why: gap > 0 ? 'behind: the picture speeds up' : 'ahead: the picture slows down'};
}

/**
 * The clock's hand (dl-twelve.js keepTime, on each frame the film presents): the step applied. Returns the step, or null when the two cannot
 * be compared yet (the song not playing or not ready, either seeking); a joining tap waits for the first step that is not null. count holds
 * what the page shows of it (seeks, nudges, held, drift) and its memory: jump (the song's second when the picture last jumped, the lead it
 * jumped by) and lead (what the last jump cost, learned at its landing).
 */
export function keepTime({song, film, joining = false, count = {}}) {
  if (song.paused || song.readyState < 2 || song.seeking || film.seeking) return null;
  if (count.jump?.landing) {   // the first look after a jump: it landed lead ahead of where the song was, so the song's lead on it now is its cost
    count.jump.landing = false;
    count.lead = Math.min(LEAD_MAX_S, Math.max(LEAD_MIN_S, song.currentTime - film.currentTime + count.jump.lead));
  }
  const step = clockStep(song, film, joining, count);
  count.drift = song.currentTime - film.currentTime;
  if (step.song !== undefined) { song.currentTime = step.song; count.seeks = (count.seeks ?? 0) + 1; }
  if (step.film !== undefined) { count.jump = {at: song.currentTime, lead: step.lead, landing: true}; film.currentTime = step.film; count.seeks = (count.seeks ?? 0) + 1; }
  if (step.held) count.held = (count.held ?? 0) + 1;
  if (step.rate !== undefined && step.rate !== film.playbackRate) { film.playbackRate = step.rate; count.nudges = (count.nudges ?? 0) + 1; }
  return step;
}

/** THE TAP: the sound comes in at the picture's second (a song not loaded yet keeps it as the second it starts at). The picture is not touched. */
export function soundIn(song, film) {
  if (film.readyState < 1 || (song.readyState !== 0 && !seekableAt(song, film.currentTime))) return false;
  song.currentTime = film.currentTime;
  return true;
}

/** Rejoin the continuous soundtrack after a finite authored picture replacement. Never seek either media backwards. */
export function resumePicture(film, target) {
  if (Number.isFinite(target) && target > film.currentTime && seekableAt(film, target)) film.currentTime = target;
  if (film.playbackRate !== 1) film.playbackRate = 1;
}

/** The picture's first data with the sound already on (a tap before the film loaded): it starts at the song's second, forward only. */
export function pictureIn(song, film) {
  const s = song.currentTime;
  if (s > film.currentTime && seekableAt(film, s)) film.currentTime = s;
}

// THE DEBUG START (rule 7). BURST2_S is lab/hero-mount.js BURSTS[1].t, the second burst's cut (the test pins the two equal); the start stands
// 5 ms inside the cut's first frame, so the first picture is the explosion itself, never the shot before it.
export const BURST2_S = 1141 * 1001 / 30000, DEBUG_START_S = BURST2_S + 0.005;

// a debug word: off, 0, false, no or nothing is none; a number of 2 or more is that second; any other word (burst2) is the second burst
const debugSecond = (word) => {
  const s = String(word ?? '').trim();
  if (/^(off|0|false|no)$/i.test(s)) return null;
  const n = Number(s);
  return s !== '' && Number.isFinite(n) && n >= 2 ? n : DEBUG_START_S;
};

/** The debug start a page's address asks for: undefined when it names no ?debug (the Nest's word may then decide), null for ?debug=off, 0,
 *  false or no, else the second (a bare ?debug: the second burst's first frame). */
export function debugStartOf(search) {
  const v = new URLSearchParams(search || '').get('debug');
  return v === null ? undefined : debugSecond(v);
}

/** The Nest's word mint/debug-start {start, by, at}, set by a seat on his word for his glasses: the second, or null (no word, start null,
 *  off, 0, false or no). */
export function debugStartWord(value) {
  const start = value && typeof value === 'object' ? value.start : null;
  return start === null || start === undefined || String(start).trim() === '' ? null : debugSecond(start);
}

/** Whether a page at this host reads the Nest's word: his house's doors (loopback, a private LAN address, a .local name). A public host
 *  (optimism.fit) asks nothing. */
export const asksNest = (hostname) =>
  /^(127\.\d+\.\d+\.\d+|localhost|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$|\.local$/i.test(String(hostname || ''));

/** THE RESTART (his Oct 27 2026 14:5x WET, over the hero's bar: "make it 'Restart' so people can restart by clicking it"): the medium to its first
 *  frame (or second t), inside its seekable ranges. The one seek backward on this page, and it is his finger's on the Restart button, never the
 *  sound's tap (rule 1 stands: the tap still only brings the song to the picture). Returns whether it was put there. */
export function restartTo(media, t = 0) {
  if (!(t >= 0) || !seekableAt(media, t)) return false;
  media.currentTime = t;
  return true;
}

/** At a medium's first load: put it at second t, forward only and inside its seekable ranges. Returns whether it was put there. */
export function startAt(media, t) {
  if (!(t > 0) || media.currentTime >= t || !seekableAt(media, t)) return false;
  media.currentTime = t;
  return true;
}

/** A SKIP THAT WAITS FOR THE FILM (lane/a-skip-waits-for-the-film, Oct 29 2026): startAt as soon as the medium can be sought. Before its metadata a
 *  medium has no seekable range and startAt refuses, so a press in a film's first moments would be lost; it waits instead for the medium's
 *  loadedmetadata, once, as the debug start does, and is put there then (rule 5 stands: never outside the seekable ranges). Returns true or false
 *  as startAt does (true also when the medium is already there or past), or 'waiting'; then(put) hears the late answer. */
export function startWhenSeekable(media, t, then = () => {}) {
  const go = () => startAt(media, t) || media.currentTime >= t;
  if (media.readyState >= 1) return go();
  media.addEventListener('loadedmetadata', () => then(go()), {once: true});
  return 'waiting';
}

// A buffering soundtrack is still the clock. Only a genuinely silent introduction
// uses elapsed foreground time; a network stall must not advance the camera ahead.
export function cinematicTime(time, song, audioEnabled, elapsedSeconds) {
  return audioEnabled ? Math.max(time, song.currentTime) : time + Math.max(0, elapsedSeconds);
}

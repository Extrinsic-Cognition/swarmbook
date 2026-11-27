// swarmbook-film.mjs: THE FILM IN BLUE'S PAGE (Nov 22 2026, lane/from-nefertiti-to-blue). His words, UTC, over blue's page with a box drawn between "Wishes pull riders" and the first well: "video here instead of
// right away. reduce exhaustion..."; before them "pentagons instead are the ones who should be shown the video... a proper blending of the video with the blue pents glowing stuff there". The governance film,
// its own bytes untouched, rests on its own first frame, its blue pentagon laid on the film's own (THE COVER IS THE FILM'S FIRST FRAME, his Nov 23 2026 "why the fuck u got that before i press then?" over a cover cut from its 45th second); a press plays it in place with its music, another pauses it, its end brings the rest back.
// THE SOUND (CLAUDE.md, The rule, item 8): the picture is always muted; the sound is the #purpose player's own soundtrack by the same law and module (warm-journey-soundtrack.js: put at the picture's second,
// never the other way). Sound mutes or unmutes the soundtrack alone; nothing here ever writes the picture's time. THE STILL WAITS FOR THE FILM (Nov 23 2026): pressed with no frame of the film yet, the figure says wait, not on. Cost: one still (58 KB) when it comes into view, nothing else before the press (preload none).
import {createJourneySoundtrack} from './warm-journey-soundtrack.js?v=audio-carry-1';
import {FILMS, SOUNDTRACK, VOLUME, WORDS, JOURNEY_S, fadeOf} from './dl-athena-film.js?v=governance-1';

/** mountFilm({win, doc, soundtrack}): the figure [data-wish-film] -> {press, toggleSound, state}, or null with no figure. */
export function mountFilm({win = window, doc = document, soundtrack = createJourneySoundtrack} = {}) {
  const box = doc.querySelector?.('[data-wish-film]'), video = box?.querySelector('video'), go = box?.querySelector('[data-wish-play]'), word = box?.querySelector('[data-wish-sound]'); if (!video || !go || !word) return null;
  const S = {sound: true, resume: false, failed: false}, playing = () => !video.paused && !video.ended, track = soundtrack(box, {source: SOUNDTRACK.href, volume: VOLUME, onSoundBlocked: () => { S.sound = false; sync(); }});
  const play = () => { if (!video.getAttribute('src')) { video.preload = 'auto'; video.src = FILMS.desktop.film.href; } else if (S.failed) { S.failed = false; video.load(); } const p = video.play(); sync(); return Promise.resolve(p).then(sync, sync); };
  const press = () => { if (playing()) { video.pause(); sync(); } else return play(); }, toggleSound = () => { S.sound = !S.sound; sync(); };
  function sync() {   // the sound follows the picture; the figure says its state
    const t = video.currentTime || 0, on = playing(), end = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : JOURNEY_S;
    track.update({time: t, playing: on, visible: true, hidden: !!doc.hidden, sound: S.sound, rate: video.playbackRate || 1, freeRunning: false}); track.audio.volume = VOLUME * fadeOf(t, end);
    box.dataset.film = on ? (video.readyState > 1 ? 'on' : 'wait') : t > 0 && !video.ended && !S.failed ? 'paused' : 'rest'; word.textContent = S.sound ? WORDS.on : WORDS.off; word.setAttribute('aria-pressed', String(S.sound));
  }
  go.addEventListener('click', press); word.addEventListener('click', toggleSound); video.addEventListener('error', () => { S.failed = true; sync(); }); for (const type of ['play', 'playing', 'pause', 'timeupdate', 'seeked', 'ended']) video.addEventListener(type, sync);
  doc.addEventListener('visibilitychange', () => { if (doc.hidden) { if (playing()) { S.resume = true; video.pause(); } } else if (S.resume) { S.resume = false; play(); } sync(); });   // a hidden page plays nothing; back, it plays on where it was
  const rest = box.querySelector('img'); if (rest) rest.loading = 'eager'; doc.fonts?.load?.('italic 700 20px Georgia')?.catch?.(() => null);   /* on blue alone: the still and the titles' italic are in before the page stands (the page's first frame stood with neither) */
  const pop = box.closest?.('dialog'), open = () => { if (pop && !pop.open) pop.showModal(); return play(); }, intro = () => { if (pop && !/(?:^|;\s*)am-film=1(?:;|$)/.test(String(doc.cookie ?? ''))) open(); };   /* THE FILM OPENS THE STAKE (his Nov 26 2026 "video should be introducing there, it should be skippable and the skip should be remembered... clickable when people click on her face in the circle, it should re-appear as pop-up"): a first visit opens it over the hall; its Skip, Escape or its end close it and say so for a year; her face at the oculus opens it again */
  if (pop) { pop.addEventListener('close', () => { if (playing()) video.pause(); doc.cookie = 'am-film=1; max-age=31536000; path=/; samesite=lax'; sync(); }); video.addEventListener('ended', () => pop.open && pop.close()); pop.querySelector('[data-film-skip]')?.addEventListener('click', () => pop.close()); doc.querySelector?.('[data-film-door]')?.addEventListener('click', open); }
  sync(); return {press, toggleSound, open, intro, state: () => ({...S, playing: playing(), t: video.currentTime, song: track.audio.currentTime, film: box.dataset.film})};
}

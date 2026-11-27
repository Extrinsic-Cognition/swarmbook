// The mint's twelve pentagons and central star share the supplied Saint Seiya film. THE SOUND FIRST, THE PICTURE AS AMBIANCE (his Oct 14 2026 03:3x WEST: "on that video i care about the audio most of all... the rest is ambiance"). The song travels as its own small file (saint-seiya.m4a, 2.4 MB: the mp4's own AAC track, the same samples) and is asked for before the film is made; the film (20.7 MB) stays muted for ever and is the picture only. The song is the clock: the film follows it by its speed (dl-twelve-clock.js: past 0.045 s a rate toward the song in proportion to the gap, never a seek for a gap of a second or less, never sought back; a stall of more than a second jumps it ahead of the song by what a jump costs; the picture ahead by more than a second brings the SONG to the picture: THE SOUND NEVER RESTARTS THE PICTURE, his order of Oct 14 2026 22:0x WEST; THE CHASE, his Oct 15 2026 16:3x WEST, is why it leans and no longer seeks). Until the song holds 10 s the film loads its metadata only and is not asked to play (15 s at most: a link too slow for that gets the picture anyway), so the first bytes a phone spends here are the song's. The tap that unmuted the film starts the song instead: same gesture, same button words. Both loop; both pause when the sphere leaves view or the page hides, as the film did. The faces are painted from the film exactly as before (setChairs, setStar, requestVideoFrameCallback). window.dlTwelve.state() is the glass's own word (times, readiness, seeks, nudges, waits) for a proof. A new cut of either file is a new URL: ?v= is the first 8 hex of its sha256, and the build refuses a stale one (build-optimism-fit.mjs). October 15, 20:17 WEST: at the big golden flash, hold the source picture and replace the whole hero with Opus's original liquor interior. The soundtrack continues. Only finalized NFT mint counts add liquid; no timed pour or statue. Presentation holds independently of checkout authorization and has no auto-exit.
import {createPaywall, HOLD_S, onHold, reached, DRAWN_FRAME, MINT_CLOSES, FRAME_S} from './dl-paywall.js?v=climax-1';
import {SKIP_EVENT, ASK_EVENT} from './dl-athena.mjs';   // SKIP TO THE MINT's word to her, and its question asked of her (the law's, one name for both)
import {keepTime as keepClock, soundIn, pictureIn, debugStartOf, debugStartWord, asksNest, startAt, startWhenSeekable, restartTo, DEBUG_START_S} from './dl-twelve-clock.js?v=skip-waits-1';
// THE CUT (his Oct 21 2026 WEST "please remove the 2nd repetition when he is about to shoot the arrow"): both files lost his second aim, cut without re-encoding a frame or a sample. The film lost the 57 frames 3825 to 3881 (127.628 to 129.529 s), whole closed groups of pictures between its own keyframes there; the song lost the 89 AAC frames over the same breath (127.623 to 129.522 s, quiet at -45 dB), joined frame to frame. Everything before the cut is frame for frame and sample for sample the old cut's (?v=53561d47, ?v=3eb444e0); after it the film is 1.902 s earlier and the song 1.899 s (3 ms apart), the same frames and samples but for the join's first 21 ms and the noise the decoder draws afresh in a few bands. The film's own sound is the song again, sample for sample.
const REV = {song: '2bd2d1cc', film: 'e2321f14'};
const PRIME_S = 10, PRIME_MS = 15000;

function sphereReady() {
  if (window.genesisSphere) return Promise.resolve(window.genesisSphere);
  return new Promise(resolve => addEventListener('genesis-sphere', event => resolve(event.detail), {once:true}));
}
// the last second the media can be sought to (0 on a server that ignores Range requests: every seek there lands on 0)
const reach = media => media.seekable.length ? media.seekable.end(media.seekable.length - 1) : null;
// seconds of media held past its current time
const ahead = media => {
  const b = media.buffered, t = media.currentTime;
  for (let i = 0; i < b.length; i++) if (b.start(i) <= t + 0.25 && b.end(i) >= t) return b.end(i) - t;
  return 0;
};

sphereReady().then(sphere => {
  const canvas = document.querySelector('#genesis-sphere');
  const stage = document.querySelector('#sphere-stage');
  const motion = document.querySelector('#motion');
  const sound = stage.querySelector('[data-twelve-sound]');
  const pause = stage.querySelector('[data-twelve-pause]');
  const restart = stage.querySelector('[data-twelve-restart]');
  const skip = stage.querySelector('[data-twelve-skip]');
  let skipped = false;   // SKIP TO THE MINT pressed this visit (below)
  const song = document.createElement('audio');
  song.id = 'dl-twelve-song';
  song.loop = true;
  song.preload = 'auto';
  song.src = new URL(`./saint-seiya.m4a?v=${REV.song}`, import.meta.url).href;
  stage.append(song);
  const film = document.createElement('video');
  film.id = 'dl-twelve-film';
  film.hidden = true;
  film.muted = true;
  film.defaultMuted = true;
  film.loop = true;
  film.playsInline = true;
  film.preload = 'metadata';
  film.src = new URL(`./saint-seiya.mp4?v=${REV.film}`, import.meta.url).href;
  stage.append(film);
  sphere.setChairs(Array(12).fill(film));
  sphere.setStar(film);
  // THE ANIME NEVER STOPS (his Oct 18 2026 00:3x WEST: "why the fuck are you stpping the anime? how many fucking time i gotta say do not fucking stop the anime?"): no freeze at the golden flash, for every visitor, sound on or off. The film plays through frame 1380 and the song keeps its place; the mint's offer stays on the page below the film. ONE STOP, his own (Oct 21 2026 WEST: "on the moment of the arrow fully drawn we will "freeze" the page until the mint has happened"): THE FREEZE ON THE DRAWN ARROW, on THE CLIMAX (dl-paywall.js DRAWN_FRAME, frame 3616: the bow at its full bend overhead, "with maximum potential just before unleashing"), where the wall holds the film and its song for everyone without a paid seat until the mint closes (MINT_CLOSES); then it plays on for everyone.
  const cinematicEnabled = false;
  const wall = createPaywall({film, song, sphere, continuousSound: cinematicEnabled,
    choice: stage.ownerDocument.querySelector('#dl-paywall-choice'), onChange: () => sync(), stopsFilm: true, hold: DRAWN_FRAME, closes: MINT_CLOSES});
  // THE MINT WINDOW's way in (his Oct 21 2026 WEST: "it cant stop this abrutly dude"; then "you stop all and when all is stopped you make the image bigger? ... no smooth interpolation"): while the wall will hold this viewer on the drawn arrow (watching while the mint is open, or held there) the sphere is told so ahead (setMintWindow), and crosses into the window as he draws, on the film's own seconds, its motion coming to rest on the arrow with the film (warm-sphere.js THE MINT WINDOW); the song fades out over the FREEZE_FADE seconds before it, so the music leaves with the picture instead of being cut; whole again once the wall is open
  const FREEZE_S = DRAWN_FRAME * FRAME_S, FREEZE_FADE = .8;
  const SKIP_BEFORE_S = 3;   // SKIP TO THE MINT lands this far before the arrow, so the film plays into the stop and the wall holds it as always, her entrance's frames loaded on the way
  const windowAhead = () => { const s = wall.state(); return s.state === 'held' || (s.state === 'watch' && s.exclusive); };
  const toWindow = (t) => {
    const ahead = windowAhead(), k = ahead && t > FREEZE_S - FREEZE_FADE ? Math.max(0, Math.min(1, (FREEZE_S - t) / FREEZE_FADE)) : 1;
    if (song.volume !== k) song.volume = k;
    sphere.setMintWindow?.(ahead);
  };

  let inView = false, suspended = false, frame = null;
  let primed = false;       // the song holds PRIME_S: the film may load whole and play
  let soundOn = false;      // his tap has started the song
  let soundStarted = false; // once heard, a refused foreground play resumes without seeking
  let joining = false;      // the song is coming in at the picture's second (his first tap): it joins the picture once, then it is the clock
  let songBroken = false;   // the song's file failed: the film carries the sound, as before this cut
  const cinematic = {active: false, completed: false, t: HOLD_S, mode: 'opus-liquor'};
  let cinematicFrame = null, cinematicStamp = null, cinematicTicking = false;
  const count = {seeks:0, nudges:0, held:0, waits:{song:0, film:0}, drift:0, primed_ms:null, primed_by:null, tapped_ms:null};
  // THE DEBUG START (dl-twelve-clock.js rule 7, his Oct 17 2026 03:5x and 04:14 WEST): ?debug on the address, or else the Nest's word mint/debug-start on his house's doors, puts the film and the song at the second burst's first frame through the clock (startAt). The page then HOLDS there until the hero is up (window.hero's theater and box: his 04:2x WEST over a refresh that showed the gold centaur, "this meant fucking start the page when i reefresh it there": the film had run past the explosion while the hero's 3D was still loading), and plays at once from it (not after the song's ten seconds); 20 s at most. A browser under automation (navigator.webdriver: every seat's proof) never takes the word, only the address. NO BANNER (his Oct 17 2026 22:0x WEST: "can you please remove that ugly debug banner? when you added it you completely misunderstood me"): the glass shows the hero as everyone meets it, only from that second; what the start did is state().debug's (at, from, film, song, held_ms, released), false for a medium that could not seek there. Nothing starts after the first tap.
  const asked = debugStartOf(location.search);
  let debugAt = null, debugHold = false;
  const debugStart = (at, from) => {
    if (debugAt !== null || soundOn) return;
    debugAt = at; debugHold = true; count.debug = {at, from, film: null, song: null, held_ms: null, released: null};
    const put = (media, name) => {
      const go = () => {
        if (soundOn) return;
        count.debug[name] = startAt(media, debugAt) || media.currentTime >= debugAt;
      };
      if (media.readyState >= 1) go(); else media.addEventListener('loadedmetadata', go, {once:true});
    };
    put(song, 'song'); put(film, 'film');
    const t0 = performance.now(), heroUp = () => Boolean(window.hero?.theater && window.hero?.unbox);
    const release = (why) => {
      if (!debugHold) return;
      debugHold = false; count.debug.held_ms = Math.round(performance.now() - t0); count.debug.released = why;
      prime('debug'); sync();
    };
    const wait = () => { if (!debugHold) return; if (heroUp()) release('hero'); else if (performance.now() - t0 > 20000) release('time'); else setTimeout(wait, 200); };
    setTimeout(wait, 0);
  };
  if (asked != null) debugStart(asked, 'address');
  else if (asked === undefined && asksNest(location.hostname) && !navigator.webdriver) {
    fetch(`${location.protocol}//${location.hostname}:8904/nest/ref/mint/debug-start`, {cache: 'no-store', signal: AbortSignal.timeout(3000)})
      .then(r => r.ok ? r.json() : null)
      .then(body => { const at = debugStartWord(body?.ref?.value); if (at !== null) debugStart(at, 'nest'); })
      .catch(() => {});
  }
  const videoFrames = typeof film.requestVideoFrameCallback === 'function';
  const stopFrames = () => {
    if (frame === null) return;
    if (videoFrames) film.cancelVideoFrameCallback(frame);
    else cancelAnimationFrame(frame);
    frame = null;
  };
  const hearing = () => songBroken ? !film.muted : soundOn && !song.muted;
  // The song is the clock and the picture follows it by a drift only (dl-twelve-clock.js keepTime: THE SOUND NEVER RESTARTS THE PICTURE). A joining tap (the sound coming in at the picture's second) waits for the clock's first step.
  const keepTime = () => {
    if (!soundOn || songBroken || cinematic.active) return;
    if (keepClock({song, film, joining, count})) joining = false;
  };
  // THE MOMENT: the sphere's growth is the film's, never the page's (warm-sphere.js SEIYA_MOMENTS: the twelve hold until the Ryu Sei Ken's meteors at 107 s). Each painted frame and each seek hands the sphere the second the faces show.
  const moment = () => sphere.setMoment?.(film.currentTime);
  const follow = () => {
    if (frame !== null || film.paused || document.hidden || !inView || suspended) return;
    const draw = (now, presented) => {
      frame = null;
      if (cinematicEnabled && reached(presented?.mediaTime ?? film.currentTime)) { sync(); return; }
      toWindow(presented?.mediaTime ?? film.currentTime);
      // held on this frame: the sphere is handed its second all the same, so it stands on the stop itself (THE MINT WINDOW lands whole)
      if (wall.at(presented?.mediaTime ?? film.currentTime, soundOn && !songBroken && !song.paused ? song.currentTime : NaN)) { moment(); return; }
      keepTime(); moment(); sphere.redraw(); follow();
    };
    frame = videoFrames ? film.requestVideoFrameCallback(draw) : requestAnimationFrame(draw);
  };
  const userPaused = () => motion.getAttribute('aria-pressed') === 'true';
  const canAttend = () => !debugHold && !document.hidden && inView && !suspended && !userPaused();
  const stopCinematic = () => {
    if (cinematicFrame !== null) cancelAnimationFrame(cinematicFrame);
    cinematicFrame = null; cinematicStamp = null;
  };
  const advanceCinematic = now => {
    cinematicFrame = null;
    if (!cinematic.active || !canAttend()) { cinematicStamp = null; return; }
    // A monotonic visual clock, independent of the looping soundtrack. It moves only while a drop, ripple or the finite camera entrance is alive.
    cinematic.t += cinematicStamp === null ? 0 : Math.min(.1, (now - cinematicStamp) / 1000);
    cinematicStamp = now;
    const scene = window.hero?.unbox?.freeze;
    // tick() can publish a redraw; it must not recursively schedule another transport frame while this callback is already scheduling its successor.
    cinematicTicking = true;
    try { if (scene?.active) scene.tick(cinematic.t); }
    finally { cinematicTicking = false; }
    if (scene?.active && scene.needsFrame) cinematicFrame = requestAnimationFrame(advanceCinematic);
    else cinematicStamp = null;
  };
  const wakeLiquor = () => {
    if (cinematic.active && canAttend() && !cinematicTicking && cinematicFrame === null)
      cinematicFrame = requestAnimationFrame(advanceCinematic);
  };
  const showState = () => {
    const on = hearing();
    sound.textContent = on ? 'Sound on' : 'Sound off';
    sound.setAttribute('aria-pressed', String(on));
    sound.setAttribute('aria-label', on ? 'Mute the Saint Seiya soundtrack' : 'Enable the Saint Seiya soundtrack');
    pause.textContent = userPaused() ? 'Play' : 'Pause';
    pause.setAttribute('aria-pressed', String(userPaused()));
    pause.setAttribute('aria-label', userPaused() ? 'Resume the film and motion' : 'Pause the film and motion');
    // THE RESTART waits while the wall holds the drawn arrow (his freeze until the mint): the story cannot be replayed past his own stop
    if (restart) restart.disabled = wall.holds();
    if (skip) skip.hidden = wall.holds() || !windowAhead() || skipped;   // toward the stop only: on it her own Skip stands; a holder plays on
  };
  const refused = error => error && error.name === 'NotAllowedError';
  const sync = () => {
    showState();
    sphere.setMintWindow?.(windowAhead());   // THE MINT WINDOW: the wall's word at each of its changes (open after the hold: the way back)
    // This picture replacement is for every viewer, including existing holders. It is independent of the signed receipt that authorizes a Society seat.
    if (cinematicEnabled && reached(film.currentTime) && !cinematic.active) {
      cinematic.active = true; cinematic.completed = false; cinematic.t = HOLD_S;
      film.pause();
      if (!onHold(film.currentTime)) film.currentTime = HOLD_S;
      wall.at(HOLD_S);
      sphere.setHeld?.(true);
      sphere.redraw();
    } else if (!reached(film.currentTime) && cinematic.active) {
      cinematic.active = false; stopCinematic();
      sphere.setHeld?.(false);
    }
    if (!canAttend()) { film.pause(); song.pause(); stopFrames(); stopCinematic(); return; }
    if (wall.holds() && !cinematicEnabled) { film.pause(); song.pause(); stopFrames(); return; }
    // A first sound tap during the silent reveal must join its present second. If that range is not available yet, hold both clocks until media progress.
    if (cinematic.active && joining && !songBroken) {
      if (!soundIn(song, {currentTime: cinematic.t, readyState: film.readyState})) {
        song.pause(); stopCinematic(); return;
      }
      joining = false;
    }
    // the song first
    if (soundOn && !songBroken) song.play().catch(error => {
      // A browser may require another gesture after foregrounding: the song waits for his next tap and the button says so.
      if (refused(error)) { soundOn = false; showState(); }
    });
    if (cinematic.active) {
      film.pause(); stopFrames(); sphere.setHeld?.(true);
      wakeLiquor();
      return;
    }
    // The picture is muted and may always play. Only the fallback, the film carrying the sound, can be refused: mute it, keep the picture.
    if (primed) film.play().catch(error => {
      if (refused(error) && !film.muted) { film.muted = true; showState(); film.play().catch(() => {}); }
    });
  };
  const prime = why => {
    if (primed) return;
    primed = true; count.primed_ms = Math.round(performance.now()); count.primed_by = why;
    clearTimeout(primeTimer);
    film.preload = 'auto';
    sync();
  };
  const primeTimer = setTimeout(() => prime('time'), PRIME_MS);
  const songHeld = () => { if (!primed && ahead(song) + 0.05 >= Math.min(PRIME_S, song.duration || PRIME_S)) prime('held'); else if (cinematic.active && joining) sync(); };
  for (const type of ['progress', 'loadeddata', 'suspend']) song.addEventListener(type, songHeld);
  song.addEventListener('error', () => { songBroken = true; console.error('Saint Seiya mint sound could not load; the film carries it.'); prime('error'); sync(); });
  song.addEventListener('volumechange', showState);
  song.addEventListener('playing', () => { soundStarted = true; });
  song.addEventListener('waiting', () => count.waits.song++);
  // The gesture: the first starts the song AT THE PICTURE'S SECOND and never touches the picture (dl-twelve-clock.js soundIn; his 13:5x and 22:0x WEST words there); from then on the song is the clock and the picture follows it by a drift (keepTime). The next taps mute and unmute it. The clock never stops for a mute.
  const toggleSound = () => {
    if (songBroken) { film.muted = !film.muted; sync(); return; }
    if (soundOn) { song.muted = !song.muted; showState(); return; }
    if (soundStarted) { soundOn = true; joining = false; song.muted = false; sync(); return; }
    soundOn = true; joining = true; count.tapped_ms = Math.round(performance.now());
    const joined = soundIn(song, cinematic.active ? {currentTime: cinematic.t, readyState: film.readyState} : film);
    if (cinematic.active) joining = !joined;
    sync();
  };
  sound.addEventListener('click', toggleSound);
  pause.addEventListener('click', () => { motion.click(); sync(); });
  // THE RESTART (his Oct 27 2026 14:5x WET: "why the fuck continue here is not like sound on and pause? make it same style as them and on the left and make it 'Restart' so people can restart by clicking it"): the story from its first frame, the song with it when it is on (the clock's one seek backward, restartTo: his press, never the sound's tap); a paused film plays again; nothing while the wall holds (the button is disabled then).
  const restartStory = () => {
    if (wall.holds()) { showState(); return; }
    count.restarts = (count.restarts || 0) + 1;
    count.restart = {film: restartTo(film), song: soundOn && !songBroken ? restartTo(song) : null};
    if (userPaused()) motion.click();
    moment(); sphere.redraw(); sync();
  };
  if (restart) restart.addEventListener('click', restartStory);
  // SKIP TO THE MINT (his Oct 28 2026 03:5x WET: "so people cant skip video?"; then "put a visible Skip to the mint on the film from its first second; it jumps the film to the drawn arrow and opens the card at once, her explainer skipped"): a press puts the film, and the song when it is on, SKIP_BEFORE_S before the drawn arrow through the clock (startAt, the forward seek the debug start uses); the wall holds there as it always does, and the page is told (SKIP_EVENT) so her entrance's frames load at once. Since THE SKIP KEEPS HER (his Oct 29 2026 16:2x UTC) the skip passes the film alone: her coming, her entrance, her making and then the rebate play as for everyone (dl-athena.js, dl-her-colours.js, dl-space-router.js). Shown only while the wall will hold. A SKIP THAT WAITS FOR THE FILM (lane/a-skip-waits-for-the-film, Oct 29 2026): pressed in the film's first moments, before its metadata, the seek waits for the film (startWhenSeekable) instead of being lost: count.skip.film says 'waiting', then true once the film is there (its 'seeked' moves the page, as any seek does). Measured before it: a press at 0.36 s left the film playing from 0, with no stop and no entrance of hers.
  const skipToMint = () => {
    if (wall.holds() || !windowAhead() || skipped) { showState(); return; }
    skipped = true; count.skip = {at: Math.round(performance.now()), from: film.currentTime};
    const at = Math.max(0, FREEZE_S - SKIP_BEFORE_S);
    const late = (name) => (put) => { count.skip[name] = put; sphere.redraw(); };
    count.skip.film = startWhenSeekable(film, at, late('film')); count.skip.song = soundOn && !songBroken ? startWhenSeekable(song, at, late('song')) : null;
    if (userPaused()) motion.click();
    document.dispatchEvent(new CustomEvent(SKIP_EVENT, {detail: {at: count.skip.at}}));
    moment(); sphere.redraw(); sync();
  };
  // THE SKIP ASKS FIRST (his Oct 29 2026 20:45:41 UTC: "there needs to be a fucking confimration popup for when to skip because it is so fucking easy to skip accidentaly"): a press asks her (ASK_EVENT: her question over the page, dl-athena.js) and the skip runs only on its Skip, inside that press; its Stay or Esc leave the film and the song as they were, nothing sought, nothing muted. A page without her answers nothing and skips at once, as before.
  const askToSkip = () => { if (document.dispatchEvent(new CustomEvent(ASK_EVENT, {cancelable: true, detail: {go: skipToMint, from: skip}}))) skipToMint(); };
  if (skip) skip.addEventListener('click', askToSkip); if (new URLSearchParams(location.search).get('door') === 'deposit') skipToMint();   /* THE GREEN COMES LATER IN THE ROAD (his Nov 12 2026 ~06:38 UTC "the green stuff could be later"): a visit sent by the Space Router page's Fill your tank (warm.html?door=deposit) asked for the deposit, not the film: the skip runs at the load, unasked, the picture alone (no sound is on at a load); its door opens with the terms (dl-kit-deposit.js) */
  // THE FILM PLAYS ON A SCROLL (his Nov 20 2026 06:58:29 UTC "please fix it... if i try to scroll down it stops the video"): a scroll is reading, never a pause; his Oct 27 scroll-based player is undone. Off screen the film rests by inView (nothing at rest costs anything) and comes back with the hero.
  film.addEventListener('volumechange', showState);
  film.addEventListener('playing', follow);
  film.addEventListener('pause', stopFrames);
  film.addEventListener('waiting', () => count.waits.film++);
  film.addEventListener('loadeddata', () => { if (soundOn && !songBroken && !cinematic.active) pictureIn(song, film); moment(); sphere.redraw(); sync(); });   // forward only
  film.addEventListener('seeked', () => { moment(); sync(); });
  film.addEventListener('error', () => console.error('Saint Seiya mint video could not load.'));
  const visible = new IntersectionObserver(entries => { inView = entries[0].isIntersecting; sync(); });
  visible.observe(canvas);
  const motionState = new MutationObserver(sync);
  motionState.observe(motion, {attributes:true, attributeFilter:['aria-pressed']});
  document.addEventListener('visibilitychange', sync);
  // A tap starts the sound; rotating the sphere must not change it.
  let pointer = null;
  canvas.addEventListener('pointerdown', event => {
    pointer = event.button === 0 && event.isPrimary
      ? {id:event.pointerId, x:event.clientX, y:event.clientY, moved:false} : null;
  });
  canvas.addEventListener('pointermove', event => {
    if (pointer?.id === event.pointerId && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) > 5) pointer.moved = true;
  });
  canvas.addEventListener('pointerup', event => {
    const tap = pointer?.id === event.pointerId && !pointer.moved
      && Math.hypot(event.clientX - pointer.x, event.clientY - pointer.y) <= 5;
    pointer = null;
    if (tap && !hearing()) toggleSound();
  });
  canvas.addEventListener('pointercancel', () => { pointer = null; });
  stage.addEventListener('pointerdown', () => stage.classList.add('dl-twelve-controls-visible'));
  stage.addEventListener('pointerleave', () => stage.classList.remove('dl-twelve-controls-visible'));
  window.addEventListener('pagehide', () => { suspended = true; sync(); });
  window.addEventListener('pageshow', () => { suspended = false; sync(); });
  window.dlTwelve = {
    wakeLiquor,
    state: () => ({
      primed, soundOn, songBroken, hearing: hearing(), inView, cinematic: {...cinematic}, ...count,
      song: {t: song.currentTime, ready: song.readyState, paused: song.paused, muted: song.muted, ahead: ahead(song), seekable: reach(song)},
      film: {t: film.currentTime, ready: film.readyState, paused: film.paused, rate: film.playbackRate, preload: film.preload, ahead: ahead(film), seekable: reach(film)},
      sphere: (({scene, phaseTime, moment, cosmos, capacity, count, held}) => ({scene, phaseTime, moment, cosmos, capacity, count, held}))(sphere.getViewState()),
      paywall: wall.state(),
    }),
  };
  showState();
});

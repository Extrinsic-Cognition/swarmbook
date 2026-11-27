# THE RESTART, AND THE STORY WAITS WHEN HE SCROLLS DOWN (Oct 27 2026)

Lane `lane/the-story-waits-and-restarts`, cut from origin/main 8ff8e233e, Oct 27 2026 15:0x WET, seat claude-32dd11de on the new Mac.

## His words

Oct 27 2026 14:5x WET, over a screenshot of the hero's bar (Continue ↓ on the left in its own dark style, Sound on and Pause on the right):
"can we make it so that the video pauses whenever a user scrolls down? so they dont lose track of the story... also why the fuck continue here is
not like sound on and pause? make it same style as them and on the left and make it 'Restart' so people can restart by clicking it".

## Before

- `app/warm.html`: `<a class="cinematic-continue" href="#rite">Continue ↓</a>` at the stage's bottom left, its own style (`warm-fullframe.css`), always
  shown; the film's row (`.dl-twelve-controls`: Sound, Pause) at the bottom right, shown on hover, focus or a pointer down.
- A scroll of the page left the film playing while it left the viewport until the IntersectionObserver saw none of the canvas (`inView`): the story
  ran on unseen.

## The change

1. **Restart, first in the film's own row** (`app/warm.html`): `<button data-twelve-restart>` before Sound and Pause; the row's style is every
   button's (`dl-twelve.css`), so it is theirs. The Continue link and its style are gone (`warm-fullframe.css`).
2. **The one seek backward, through the clock** (`app/dl-twelve-clock.js` `restartTo(media, t = 0)`): inside the seekable ranges; rule 1 stands
   (the sound's tap still only brings the song to the picture; the page's `film.currentTime =` assignments are still the one flash pin). The page
   (`app/dl-twelve.js` `restartStory`): the film to 0, the song to 0 only when it is on, a paused film plays again, the sphere handed its second;
   nothing while the wall holds the drawn arrow (his freeze until the mint), and the button is disabled then (`showState`).
3. **The story waits** (`app/dl-twelve.js`): a plain wheel downward (`deltaY > 0`, not alt: the camera's own wheel), or a finger panning the page
   down more than `SCROLL_PAUSE_PX` (24), while the film plays and the wall does not hold, is the page's own Pause (`#motion`), so the Pause button
   reads Play and his press (Play, or Restart) resumes it. Passive listeners, on cause only; the page's own `scroll` event is never read (a proof's
   `scrollIntoView` is not his hand).

## Cost

- At rest: three passive listeners on the window, nothing drawn, nothing polled. Per wheel or pan: one `paused` read; a pause when it applies.
- Per Restart: two seeks to 0 (the film's first keyframe: the cheapest seek in the film) and one `play()`.

## Proofs (the new Mac, nice 19)

- `node --test app/dl-twelve.test.mjs`: 19 of 19 (two new: THE RESTART pure and pinned in the page and the markup; THE STORY WAITS pinned: the
  wheel's condition, the pan's, never the scroll event). `app/dl-paywall.test.mjs` 33 of 34 and `lab/heartbeat.test.mjs`: the one red ("the public
  mint keeps DysonLight Harmony ice and accent tokens", harmony-orange) is main's own, red on main's tree the same way (212f43daf).
- Rule 8, on the lane's tree served by `tools/serve-range` (8988): `node app/dl-twelve.proof.mjs --url http://127.0.0.1:8988/app/warm.html --tap
  button` PASS, `--tap sphere` PASS ("the sound came in where the picture was, and the picture never went back").
- Live, real input in a browser on the same page: the film at 6.99 s, Pause reading "Pause"; one wheel tick down (scrollY 300): the film paused at
  7.00 s, Pause reading "Play"; wheel up, Restart pressed: the film at 0 and playing, at 1.96 s two seconds later, Pause reading "Pause";
  no `.cinematic-continue` in the document; Restart first in its row, enabled.
- `lab/mint-page-scroll.proof.mjs` (Playwright, not the gate's): its Continue checks are replaced by the Restart's (first in the row, disabled while
  the scene is held); not run here (no Playwright on this Mac's path).

## THE SCROLL IS THE PLAYER (his 15:1x WET: "the video should resume if i scroll up to hero again... it should be scroll based player")

The second cut of the same lane. The story's wait is its own state (`storyAway`), not his Pause: a wheel down or a pan down puts it away (the clocks
stop where they are, through `canAttend`); a wheel up or a pan up, once the hero is 60 % on screen (`STORY_SHOWN`), brings it back where it waited.
His Pause (the `#motion` word) is his and the button never changes for a scroll; Restart brings a story that was away back as well. Live, real
input: the film at 7.03 s after a wheel down (scrollY 500), still 7.03 s two seconds later, the Pause button reading "Pause"; one wheel up (scrollY 0):
playing, 9.04 s two seconds later. `app/dl-twelve.test.mjs` 19 of 19 (the scroll test rewritten for both ways); the rule-8 proof PASS for both taps
on the served lane.

## Not done here

- The row is shown on hover, focus or a pointer down, as before: Restart is where Sound and Pause are, by his word; whether the row should stand
  always is his.
- A keyboard scroll (Page Down, the arrows) is not read: the arrows rotate the sphere on the canvas, and a page scrolled by the keys with the hero
  on screen is rare; his word if it is wanted.

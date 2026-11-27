# THE WELLS FIT THEIR COLUMNS (Nov 23 2026)

Lane `lane/the-wells-fit-their-columns`, seat claude-cb623661 on the new Mac, cut from main d2bc852cf9. A frame-by-frame QA of the press on the
blue pentagon (the governance film in blue's page) and of the page at rest found four faults; this lane mends them. The QA's tools, numbers and
frame sheets: ec-workspace `var/journeys/2026-11-23/the-pentagon-film-qa/` (`qa-film.mjs`, `analyze.py`, `qa-rest.mjs`; `main/` before, `lane/` after).

## His words (UTC, Nov 23 2026)

- 14:41:05, over the local site in the app's pane: "are the FPS optimized? is it rasterized as video or is it fucked up in ways?".
- 14:42:41, with his screenshot of the page at 750 px: "please review qa frame by frame what happens at all resolutions when i click on the blue pentagon".

## How it was read

Chrome for Testing, new headless, off every screen, muted, GPU on (Metal, the film hardware-decoded), a trusted press. Every frame the compositor
produced from 0.5 s before to 6 s after each press (play, pause, play on, the end, the press after it) at 320x568, 390x844, 768x1024, 750x871 (his
pane), 1280x800, 1440x900, 1920x1080 and 2560x1440, and at 390x844 on 9 Mbit/s and 1.6 Mbit/s from the press on; with the page's own counters (frame
times, the video's presented frames, its events, layout shifts, long tasks, every write of a media element's time). The Mac's load was 10 to 43
during the runs, the seat at nice 19: the frame rates are a floor.

## The cost first

| | main d2bc852cf9 | this lane |
|---|---|---|
| the wells, 701 to about 1,080 px wide | a 190 px hexagon in a 127 to 181 px column: 4 overlaps, captions run together to 820 px, the page 748 / 788 / 832 px wide at 701 / 750 / 820 | the hexagon holds to its column (127 / 136 / 142 / 157 / 181 px at 701 / 750 / 820 / 900 / 1,024), 0 overlaps, no sideways scroll |
| the page at rest, the wells out of sight (top and foot) | 60 frames asked a second, the main thread 15 % busy (11 % script) | 0 frames asked, 2 % |
| the page at rest, the wells in sight | 60 frames a second, 15 to 17 % | the same: four living trees, about 1.9 ms of script a frame on this Mac |
| the press on 1.6 Mbit/s | the still fades to an empty dark box (brightness 122 of 1,000, rest 277) for 0.86 s, the film cuts in | the still stands (never under 269) until the film's first frame at 0.86 s, then the cross-fade |
| a tap on the film, touch | the whole box flashes the browser's tap blue for 0.1 s, at every press | no flash |
| JavaScript | | +7 −7, net 0 |

## What the QA found that holds (no change)

- It is a real video, never a canvas: `galaxy-desktop.mp4`, H.264 High, 1920x1080, 60 frames a second, 51 s, 24.0 MB, hardware-decoded. At every size
  on a fast network: the first film frame 30 to 64 ms after the press; in 8 clean seconds 60.0 film frames a second presented, 0 to 4 doubled steps of
  479, 0 or 1 frame dropped in 844 (one run of eight dropped 13 with one 183 ms stall, under the still's fade).
- The box never moves: 0 layout shifts, 0 long tasks, no scroll jump, 0 page errors, at every size. The box is 288x162 at 320 px, 358x201 at 390,
  640x360 from 750 up (it never grows past 640 px, on a 2,560 px screen too). The sound's word is 88x44.
- The rule, 8: no write of the film's time at any press; the pause holds its second and the next press plays on from it (14.29 s to 16.50 s); the
  press after the end is the browser's own return to 0. The sound runs 80 to 110 ms behind the picture, steady; its word mutes it alone.
- The end: the last frame is dark, the still comes back in 1.4 s with the pentagon.

## Not mended here (each named to him)

- **The film is white.** Its first 38 seconds are parchment white; the night still it rests on is its 45th second. The press takes a night box to a
  white one (brightness 277 to 974 of 1,000 in 1.4 s) on a night page. That is the film itself: his call.
- **Its weight.** 3.76 Mbit/s: on 1.6 Mbit/s it shows 2.5 s of film in 8 s, in bursts, and the sound is put back to the picture 15 times in 12 s. Trial
  cuts at 1280x720 (the box never shows more) came to 16.0 MB at 60 a second and 14.4 MB at 30 (x264 crf 22): a third lighter, not enough for that
  network; a cut that plays there needs about 1.2 Mbit/s and would show its loss.
- **The wells in sight** still cost 15 to 17 % of this Mac's main thread; lysa is slower. A cap at 30 paints a second (`fpsCap`) would halve it.

## The proofs (the new Mac, nice 19)

| | |
|---|---|
| `app/after-the-mint.test.mjs`, `app/swarmbook-film.test.mjs`, `app/riders.test.mjs`, `app/polis-knock.test.mjs` | 24 of 24: the figure says wait before the film has a frame; a tree out of view is paused and turns on in view; the wells' column rule; no tap highlight |
| `app/dl-twelve.test.mjs` (The rule, 8) | 21 of 21 |
| `app/dl-twelve.proof.mjs --url <the lane's warm.html, served with ranges by tools/serve-range> --tap button`, and `--tap sphere` | PASS and PASS: the sound came in where the picture was, and the picture never went back |
| `tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs` | green: +7 −7, net 0 in 5 files |
| the screens gate (`no-landing-adds-a-failing-screen.1.sh`, `.2.sh`) | 36 cells judged (18 a shard), 0 new failing, 0 to take out; green in 93 s and 85 s |
| the lane's files over main's built site behind the Worker's own handler (a second local copy, true faces), the press recorded again at 390x844 (fast and 1.6 Mbit/s) and 750x871; the page at rest at 1440x900 | the table above; the page 750 px wide at 750; 0 page errors |

## No gate yet

The measure it waits for: the screens gate judges 390 and 1,280 px wide and neither showed the overlap; a width between 700 and 1,080 in its
manifest, and the page's frames asked at rest read by the gate (0 with nothing animated in view).

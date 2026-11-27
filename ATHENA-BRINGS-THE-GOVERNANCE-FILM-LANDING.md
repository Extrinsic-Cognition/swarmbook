# ATHENA BRINGS THE GOVERNANCE FILM: on her landing, the page's second film comes up beside her making, free (Oct 29 2026, lane/athena-brings-the-governance-film, claude-61e371e5)

**His words,** Oct 29 2026, UTC, from the transcript's stamps (the seat that asked for this lane, claude-1a67b2d3):
- 16:28: "there are 2 videos in this fucking thing".
- 16:40, over the demo video's flow (the renegades' film; Athena arrives; "Give me my colours."): "i would add a step after 2, the step where athena brings
  the attention to the other mint video about governance... you get what i mean?"
- 16:41: "you will bring up the new video and let the user independent, you dont want to walk hand in hand...".

The brief dated these about ten minutes later (16:5x and 17:0x); the stamps above are the transcript's own.

## The flow now

1. The renegades' film (`app/dl-twelve.js`), or SKIP TO THE MINT, which passes the film alone.
2. Athena arrives (`app/dl-athena.js`): her coming, her entrance, her landing.
3. **New:** on her landing, the governance film flies out of her corner as a card, its first frame and its name. A press opens it on a stage with its sound.
   The visitor may watch it, pause it, close it back to the card, let it go for good with the card's ×, or ignore it.
4. "Give me my colours." (`app/dl-her-colours.js`): it opens on the same landing, as before. The card stands in the corner and covers none of it.
5. The call (`app/dl-space-router.js`): the rebate slams in on her making's 'made', over the card. While it stands, the card is unseen, and a stage that was
   open closes.
6. Enter the MMO: the $30 starter kit, paused.

Steps 3 and 4 begin at the same moment. Her making opens on her landing, and this lane does not delay it: nothing waits on the film.

## The governance film, and what the player uses

The film is the page's second video, `#purpose`, played by `app/warm-galaxy-player.js`. It has three media:
- **The picture:** `warm-media/film-mothership-1/galaxy-desktop.mp4`, 51 s, 1920 x 1080 at 60 fps (`galaxy-mobile.mp4` on a phone's width: 900 x 1600, 30 fps).
  The picture is always muted. It is the governance journey: Claudio's twelve pentagons round the human hexagon, the humans voting in both chambers, the swarms
  founding swarms.
- **The sound:** `warm-media/fantasia-1/fantasia-soundtrack.m4a`, 230 s. It is its own audio clock (`warm-journey-soundtrack.js`), put at the picture's second,
  so freezing or replacing a picture never cuts the music.
- **The continuation:** `warm-media/fantasia-1/fantasia-projection.mp4`, 230 s. It plays after the 51 s journey, masked on its last frame behind the
  invitation, while the soundtrack runs on.

Her stage takes the first two: the same cut and poster, the same soundtrack, at the same addresses and revisions, so the browser's cache serves both
players. It takes the soundtrack's law by importing the same module. The continuation stays the `#purpose` section's own. At the journey's end, the sound
fades with the picture over its last 1.5 s instead of being cut, and Replay starts the picture again from its first frame.

## What changes

- **`app/dl-athena-film.js` (new):** `mountGovernanceFilm`. It hears her 'landed' and brings the card. It hears 'made' and closes an open stage. Its
  height is the rebate's (`FILM_Z` = `ROUTER_Z`, 2147483001): over her making and her layer (2147483000), and under the rebate, which is appended after it.
  It mounts nothing on `?handoff`, as the rebate does.
- **`app/warm-entry.mjs`:** one literal import, after her making and the rebate.
- **`app/dl-athena-film.test.mjs` (new):** 10 tests. They cover:
  - her word and the heights;
  - the film as the player's own (the paths, revisions, length, volume and soundtrack, held to `warm-galaxy-player.js` and `warm.html`);
  - the words;
  - the fade;
  - The rule, item 8, in the source;
  - a page of its own: the card on her landing and not a byte of the film before the press; a press, two Sound taps with no write of the picture's time,
    Pause, Escape, a press beside the film, the rebate; the end's Replay; the card's ×, which lets everything go; the phone's cut; `?handoff`.
- **`app/dl-athena-film.proof.mjs` (new):** the real-browser proof, below.
- **`dl-athena.js` is untouched.** Changing it would ask for a new `?v=` on its import, and `dl-space-router.js` imports the same address. That file is
  another session's today. Two addresses would mount her twice.

Words on it, only where the visitor acts (his Oct 29 2026 06:07 UTC rule): the card's name ("Governance", his word), Play / Pause / Replay, Sound on /
Sound off, the count ("07 / 51", as the player writes its own), and ×. Nothing explains.

## Cost

- **Before her landing:** one listener; nothing mounted, fetched or run.
- **On her landing:** one fixed layer, and the poster (48,130 B; 41,520 B on a phone). No timer, no frame callback.
- **On the first press:** the film (23,982,014 B; 18,800,195 B on a phone) and its soundtrack (5,578,133 B), streamed by byte ranges.
- **While it plays:** the decoder's own work. On the film's timeupdate (about four a second), the count and the soundtrack's alignment. Over the last 2 s of
  the film, the fade on the picture's own frames.
- **Closed, paused or let go:** nothing. The card's × releases both media and removes the layer and every listener of its own.

## Measured

All on this lane's page, on the dev road (`tools/serve-range`, which answers byte ranges, and `tools/mint-dev.mjs`), in headless Chrome off every screen.

- **The real press (`app/dl-athena-film.proof.mjs`): PASS, 18 of 18 checks.** The page's own events, timed from the page's load:

  | Time | What the page said |
  | --- | --- |
  | 2.0 s | SKIP TO THE MINT pressed, the film at 1.5 s |
  | 4.2 s | `coming` |
  | 5.1 s | `entered` (her entrance) |
  | 30.8 s | `landed` |

  The checks that followed:
  - 1.2 s after her landing, the card is up and takes a press where it stands.
  - No byte of the film has been asked for before the press.
  - Her making is open. Its line, its field and its Continue each take a press where they stand; the card covers none of them.
  - The rebate has not opened.
  - A press on the card opens the stage. The film plays, and its soundtrack is heard.
  - Two taps on Sound, one muting and one unmuting:
    - for 4 s after each, the picture never read below its second at the tap (3.09 s and 7.19 s) and played on 3 s or more;
    - the picture's time was never written;
    - the soundtrack ended within 0.35 s of the picture;
    - both media can be sought past the taps.
  - Pause held the picture and its sound for 1 s.
  - × closed the stage back to the card, with her making open and its Continue under a press.
  - No page error.
- **The phone's width (375 x 812, touch).** Her landing was said to the page directly; the hero's own Skip, measured at that width, stands on screen at
  16, 103. Checked by eye:
  - the card stands beside "Give me my colours." and does not cover it;
  - a touch opens the mobile cut with its sound;
  - no page error.
- **`node --test` over `app/` (50 files, as the lander's gate runs them): 393 of 396.** The three reds are main's own, each red on main e98dbef11's own tree:
  - dl-athena's THE DEPTH;
  - dl-paywall's "Harmony ice and accent tokens";
  - warm-sphere-moment's "her cut".
- **The house's other gates:** `tools/any-room/any-room.test.mjs` and `tools/site-files.test.mjs` are green. `lab/one-page.test.mjs` has three reds, and the
  same three are red on main's own tree.
- **Rule 8,** on this lane's page served with byte ranges:
  - `node --test app/dl-twelve.test.mjs`: green, within the run above.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS.
  - The same with `--tap sphere`: PASS.

## Edges, said

- After the rebate's × (if he presses it), the card comes back, fixed at the top right, until its own ×.
- His standing wishes on governance (docs/wishes-and-the-servants-hypertrace-2026-10-11.md: "Hexagon and pentagon voting governance (Poleis)" and "the 12
  chairs around one floor") ask for the voting structure itself. This lane shows the existing film earlier and changes neither; they stand as written.
- Not deployed: optimism.fit's deploy is his word, run by the seat that asks him.

## THE FILM PROOF WALKS THE ROAD AS IT STANDS (Nov 11 2026, claude-3853f028; lane/the-film-proof-walks-the-road-as-it-stands, base main 86051c3cee)

Asked by claude-d86f9ecf, whose run of `app/dl-athena-film.proof.mjs` on the mint page failed at 996556e531 (base 1d23209d5c): is the page wrong, or the proof?
**The proof was stale, twice. The page is right.** Not handed: a hand needs his own word.

### What was wrong, and since when
1. **c21493ee88, ON TRACK (Oct 30 2026 15:57 UTC; his "i dont want people able to get out of track").** On a first visit the rebate has no × until its WATCH
   THE FILM is pressed (`dl-space-router.js`: `close.hidden = S.film === 'first'`). The proof, last changed at 9c3abe4e41 (Oct 30 09:14 UTC), pressed the ×
   all the same. A hidden button's box is 0 x 0 at 0, 0: the press fell on the page's corner, the rebate stood, and the card stayed unseen under it.
2. **34f0ed3d2d, THE LYSSAJUDRON ENTERS (Nov 11 2026 03:11 UTC).** Her making opens on an entrance of 5.9 s. The proof pressed her die 1.2 s after her landing,
   under the entrance's white.
Neither lane ran this proof: the lander runs it only when a hand names it with `--proof`.

### Read on the new Mac (each tree from git, served by tools/serve-range, Range answers 206; headless Chrome for Testing)
| tree | the proof |
| --- | --- |
| ff7da90523 (ON TRACK's parent) | PASS, 20 of 20 |
| c21493ee88 (ON TRACK) | FAIL: "the rebate closed by its ×", "a press opens the stage"; then COULD NOT RUN: the stage's Sound is not there |
| 1d23209d5c (the other seat's base) | the same three |
| main 86051c3cee, the proof as it was | FAIL: '"Give me my colours." whole' (each press lands on `dl-her-e-white`); then COULD NOT RUN: her die did not fire |
| this lane, 2416265f2c | PASS, 21 of 21: her entrance played and left by 22.1 s, she had landed at 16.2 s; no page error |

### What changed (the proof file alone; the page's code is untouched)
- After her landing the proof waits for her entrance to leave her making (`.dl-her-e` gone, 9 s at most), then presses as before.
- After "made", the first visit's own road, with trusted input: no × on the rebate, the call says WATCH THE FILM, a press on it carries the page down to his
  film (`html[data-space-router-away]`), the wheel brings it back to the top, and the × is there. One new check (ON TRACK) and one new picture
  (`1-the-rebate-on-track.png`). The × is then pressed and the proof goes on as written.
- JavaScript: 4 lines changed in place, net 0 (the gate's own count: "+4 -4, net +0 in 1 files").

### The cost
Nothing on the page. The proof runs about 10 s longer (her entrance 6 s, the road down and up 4 s); it ended inside its own 150 s each time.

### Run on the lane (2416265f2c, a scratch worktree on the new Mac, removed after)
- `node --test app/dl-athena-film.test.mjs app/dl-twelve.test.mjs`: 32 of 32.
- `tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs`: 13 of 13.
- `nice -n 19 node app/dl-athena-film.proof.mjs --url <the served page>`: PASS, 21 of 21.
- Rule 8, on the same served page: `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS; `--tap sphere`: PASS ("the sound came in
  where the picture was, and the picture never went back").
- `tools/any-room/any-room.test.mjs`: 12 of 13; the red is main's own, the same on main 86051c3cee's tree
  (`embertide-viewer-ios/Checks/house-heard/main.swift: Box-0`).
- `git merge-tree` with `lane/swarmbook-is-the-new-poleis` (which changes other lines of the same proof): no conflict.
- Not run: the lander's gates as a whole; a phone's width; Safari.

### The hand, when his word names it
`node tools/embertide-mesh/lander/lander.mjs hand lane/the-film-proof-walks-the-road-as-it-stands --commit <tip> --receipt embertide-app/ui/intro/dyson-society/ATHENA-BRINGS-THE-GOVERNANCE-FILM-LANDING.md`
with three proofs, each `--proof '@embertide-app/ui/intro/dyson-society embertide-app/ui/intro/dyson-society/app/<file> --url {serve}/embertide-app/ui/intro/dyson-society/app/warm.html <tap>'`:
`dl-athena-film.proof.mjs` (no tap), `dl-twelve.proof.mjs --tap button`, `dl-twelve.proof.mjs --tap sphere`.

### Left, said
- On a first visit the card can be seen only after the freeze has sent the visitor down to that same film (THE PROFESSOR SENDS YOU TO THE FILM FIRST), so
  it offers a film the page has already shown. Whether the card stays is his.
- With the rebate closed, the card stands over the end of the header's "Collective Self Improvement" at 1440 x 900.
- The lander does not run this proof by itself, so the next change to the freeze or to her making can leave it behind again without a red.

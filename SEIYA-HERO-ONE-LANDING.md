# lane/seiya-hero-one: every mint-page lane in one branch (Oct 14 2026, 20:4x to 21:0x WEST)

**His words, Oct 14 2026 20:4x WEST:** "fucking merge all the shit into 1 for the branch in which i said let's change the hero and have
saintseya there... it is so fucking fragmented diocane i have been working on it a lot is it all lost".

Nothing is lost. The hero with Saint Seiya is THE PATHOS FIRST (`b663ea24`, 07:26 WEST) and it has been on main since the morning, with THE
TWO NAMES ONLY (`aa8d23c9`, 07:53), her wallet on the mint link (`e8807fb5`, 10:05) and THE RYU SEI KEN (`f7396871`, 11:36). Everything
built on the mint page after that sat on seven branches, four of them still being written by one workflow (`wf_9362e266`, started 20:15).
This branch is main (`7269fc20`, 19:31) plus all seven, merged in fork order. Every merge was clean; no file was edited by hand.

## What it holds (20 commits, 32 files, +5,420 / -59; all under `embertide-app/ui/intro/dyson-society` but one line in `tools/house-mirror/strip-families.txt`)

| merged | from | what |
|---|---|---|
| 5 commits | `claude/athena-cubism-0a5d15` | lab: ONE PLANE for her, the film's light on all of her (cubism.mjs, cubism.light.mjs, the storyboard) |
| 1 | `claude/hero-unboxing-75699d` | lab: WIP THE FOLD (hero-ab.html, unboxing-plan.mjs, unboxing.js and its proof) |
| 8 | `lane/the-fold` | lab: THE FOLD on the hero as he gave it at 19:19 WEST, the faces into the hexagonal window (contains the two above) |
| 7 | `lane/anti-satellites` | lab: anti-satellites.js and its proof, dolbar-charge, hero-ab.html's pictures in their frames |
| 4 | `claude/hungry-ellis-026ec2` | lab: the braindance as a measurement (braindance.measure, .solve, .marks) |
| 1 | `claude/quizzical-mendel-1143e4` | lab: the braindance asked of the game on pelino, not stageable (inside hungry-ellis already) |
| 3 | `lane/paywall` | app: THE PAYWALL ON THE GOLDEN ARMOR, the film stops at his 37.132 s for a wallet with no paid receipt; 7 days of exclusivity from a LAUNCH_DAY that is his to set (unset: the rest of the film stays for minters); dl-paywall.js/.css/.test, paywall.proof.mjs |

The lanes were read at 20:46 WEST, and again at 21:2x: `lane/paywall` (+2), `lane/the-fold` (+1) and `lane/anti-satellites` (+2) had moved and
were merged again, clean. Their workflow is alive; a later `git merge <lane>` on this branch brings what they add.

## THE SOUND COMES IN WHERE THE PICTURE IS (one fix of this branch's own, 21:3x WEST)

His words, Oct 14 13:5x WEST, over the hero: "it is restarting the video when i click on it. i dont want it restart, just fucking play the
sound do not restart the fucking video"; and at 21:2x, over this branch: "IT RESTARTS AGAIN WHEN I PRESS AUDIO PLAY ... I SAID TIME AND TIME
AGAIN IT SHOULD NEVER FUCKING DO THAT". The cause, in `app/dl-twelve.js` toggleSound: the first tap ran `film.currentTime = song.currentTime`,
and the song, never played, stood at 0, so the picture went back to its start at every first tap, on the mint page and under the lab's
"Play with audio on" bubble alike (`lab/hero-ab.html` said it put the song at the film's second first; it never did, its bubble only presses
the page's button). The fix: the tap puts the song at the picture's second (`song.currentTime = film.currentTime`), and keepTime joins the
song to the picture once it is ready (`joining`: the song took its load time to start); the picture is never seeked by the tap. From then on
the song is the clock, as before. Proof in the Browser pane, served as above, the pane visible: the tap at film 1.89 s; 0.25 s later the
film at 2.14 s and the song at 2.17 s, then 2.39/2.42, 2.64/2.67 ... 4.90/4.93 over three seconds, the song never more than 0.04 s from the
picture, the film never back at 0. With the pane hidden the page pauses everything (`document.hidden`), so a second run showed nothing.

## Proof

- `node --test app/*.test.mjs lab/*.test.mjs` in this folder: 247 tests, 247 pass, 0 fail, 4.5 s (nice 19).
- Looked at in the Browser pane at 21:0x to 21:2x WEST, served by `python3 -m http.server` over `embertide-app/ui` (the root aiolos
  uses: the box imports `three` and `../../room/procedural/GLTFLoader.js` from above this folder, so a server rooted here breaks it,
  which is what the first look did): `/intro/dyson-society/lab/hero-ab.html?end=b` loads its 32 files with 0 failures, the 3D box in
  the hero, THE FILM / A / B and his keyframe list (the box opens 42.34 s ... the box shuts 69.67 s); `/intro/dyson-society/app/warm.html`
  opens on the Saint Seiya sphere with the Bronze and Gold mints below, 57 files, 3 failures that are not the branch's: the galaxy film
  (`app/warm-media/*` is not in git, so a fresh worktree lacks it) and `/api/premint/holders` (the Worker runs only on optimism.fit).
- Not proved here: the paywall proof and the lab proofs (headless Chrome), lysa, a phone.

## Not in it, on purpose

- Two worktrees hold edits that were never committed by their seats, and this branch takes only commits: `.claude/worktrees/distracted-jepsen-3998ac`
  (`claude/athena-cubism-0a5d15`: +185 lines in lab/cubism.mjs, cubism.test.mjs, CUBISM.md) and `.claude/worktrees/wf_9362e266-a81-2`
  (`lane/the-fold`: +8 lines in CUBISM.md and a new LANDING-THE-FOLD.md). They are still there, untouched, and their seats are still writing.
- Seven other branches ahead of main (`trusting-elion`, `spatial-git`, `recursing-tu`, `dazzling-cohen`, `asks-awake`, `glass-pieces`,
  `fuel-fluid-land`) touch no mint-page file that main does not already have by content.
- Main itself, until 21:4x WEST: landed then as main `2eb347e6` on his word ("why the fuck am i stuck seeing an old version"), so aiolos
  (his app window, 127.0.0.1:8921) serves it at once; read back from aiolos: dl-twelve.js carries the fix, dl-paywall.js answers 200.
  The eight live lanes merge main next time they land, as always.

## Where

- Worktree `~/code-ec/house/.worktrees/seiya-hero-one-20261014`, branch `lane/seiya-hero-one`, head after this file's commit.
- To look: `python3 -m http.server 8979 --bind 127.0.0.1 --directory ~/code-ec/house/.worktrees/seiya-hero-one-20261014/embertide-app/ui/intro/dyson-society`
  then `http://127.0.0.1:8979/app/warm.html` and `/lab/hero-ab.html?end=b`.

# The anime never stops: its proofs (lane/the-anime-never-stops-proofs, Nov 2 2026)

His ruling, Nov 2 2026 ~00:3x UTC, relayed by the sweep's seat: retire `mint-opus-liquor`, and rewrite `paywall` for the wall's new place at the
drawn arrow. Both proofs stood red on main since his Oct 18 2026 00:3x WEST word that the anime never stops (981621e87c, landed by d17315abf: the
presentation's freeze at the golden flash gone for every visitor, `app/dl-twelve.js` cinematicEnabled false, no switch back).

## Cost first

- **Before.** `lab/paywall.proof.mjs` on main waited for a hold that no longer exists. Each of its 12 passes waited 20 s or more, and each page also
  waited up to 45 s for a liquor glass that is gone too. It went over the sweep's bound: a timeout at 150.3 s on Nov 1. `lab/mint-opus-liquor.proof.mjs`
  stopped at its first assert (`--url is required`), and given one it could only be red.
- **Predicted.** 60 to 90 s for the rewritten proof's default passes on the new Mac.
- **Measured.** 34.1 s and 35 s on the new Mac (load 34 and 18): 8 passes on 8 pages in one Chrome (about 500 MB). Bounds: 40 s a pass, 140 s a run.
  `mint-opus-liquor.proof.mjs`: 797 lines gone.
- **The page's own cost at the wall** (read by the proof, not asserted). In the 2.5 s after the hold the page ran 302 animation frames: her entrance's
  engine ticked 151 and `app/warm-sphere.js` ticked 151, about 60 a second each. It also made about 95,500 2D draws, while the sphere reports `held`.
  `app/dl-paywall.js`'s header says the sphere stands still while held, and her entrance over the stopped picture is his own design (Oct 22). This is
  named for the page's next lane, not touched here.

## What changed

- **`lab/mint-opus-liquor.proof.mjs`: retired** (`git rm`).
  - What it held: the hero on the golden flash (the film paused on that frame, the freeze in 'twelve-chairs' mode, the liquor glass), the law his
    Oct 18 word took away.
  - `lab/MINT-FREEZE.md` now carries a dated note at its head: the four receipts in it that name the proof are its history.
  - One comment in `lab/unboxing.js` still names it. That file is a page module, so it is left to the page's next lane.
  - No test, doc index or hand names it.
- **`lab/paywall.proof.mjs`: rewritten for the wall at the drawn arrow** (212f43dafb THE CLIMAX, landed by 991328213, Oct 22: the stop on the bow's full
  bend).
  - Every pass reads the wall's frame, its stop second and its close from the page's own word, `dlTwelve.state().paywall` (hold, stop, closes). A
    frame's length comes from those two values. No frame or second of the film is written in the proof.
  - The passes: visitor, song, holder, bareid, window, phone, and lab (as it opens, and with `?paywall=off`). `before` runs only when named.
  - Retired passes, and why:
    - checkout, returning (with its tracenet and phone parts) and the choice's gold seat: the page sells no seat and has no holder's road (YOUR
      PRESENCE IN THE MMO, Oct 29; CLEAR THE MINT, his Oct 30 "Yes, clear it").
    - notmint and choice: the offer is commented out (c35854ae6 THE PAGE COMMENTED OUT, landed by 9f523da5d, Oct 30, his "please comment out all
      this"). `#dl-paywall-choice` stands inert in a `<template data-commented-out>`.
  - Every check of a choice now engages only when the page holds one, so the checks come back when the template is unwrapped.
  - Each pass is a first visit. For a returning visitor (his governance film seen) the page scrolls the hero out of view, and the film stops before
    the wall. That is the router's road, not the wall's.

## The runs

All runs were on the new Mac, through the sweep's fence (fix-try; Chrome through the fence proxy).

**`lab/paywall.proof.mjs` at 435b840a3**: every pass holds in both runs, 010924 (34.1 s) and 011035 (35 s).
- The page's wall: frame 3616, stop 120.687 s (a frame lasts 33.3667 ms), until 2026-11-15T00:00:00Z.
- Every arrival met the wall's frame as presented at 120.653867 s.

| Pass | What the page did |
|---|---|
| visitor | Held on frame 3616 at 120.6706 s. The song paused at 120.67055 s, volume 0. The sphere held, the Restart disabled. The Skip was shown before the wall and hidden at it. The page's one film seek put the picture onto the frame (120.634 to 120.6706 s), and the song was put on the picture's second. In 2.5 s at rest, no frame but the wall's was presented. |
| song | Tapped at 115.088 s; the song came in at 115.100 s with the film at 115.111 s. The film never went below its frame at the tap. The song faded 1, 0.79, 0.54, 0.29, 0.04, 0 over the last 0.8 s, and both stopped on 120.6706 s. |
| holder | One ask, with the seat proof. The wall opened (`receipt`) and never held; the film played on through the stop to frame 3630. |
| bareid | The wall held. Nothing was asked of the Worker. |
| window | With MINT_CLOSES set a day back, the wall was open for everyone from the load (`window`), never held, and the film played on through the stop. |
| phone | At 390 x 844 the wall held, the song with it; scrollWidth 390; still held after. |
| lab, `?paywall=off` | Open (`lab`), never held, on through the stop. |
| lab, as it opens | Held on the wall's frame. |

**The first cut** (603cab970, run 010403, 59.8 s) found two things, and the passes were reshaped for them (435b840a3): the page has no
`#dl-paywall-choice`, and a returning visitor's page scrolls the hero away before the wall.

**The lab folder's tests** (run 011035): 36 files, 30 pass. Six are red, with the same failing tests by name on main c11e2e53a (fix-try `LANE=main`, run
011159). None of them reads either file this lane changes.

| Test file | Failing |
|---|---|
| breakdown | 1 of 11 |
| heartbeat | 1 of 9 |
| irradiance | 1 of 21 |
| ko-edge | 1 of 15 |
| one-page | 3 of 10 |
| sacrifice | 1 of 18 |

**Rule 8 at 435b840a3** (CLAUDE.md, The rule, 8):
- `app/dl-twelve.test.mjs`: 21 of 21 (fix-try 011325).
- `app/dl-twelve.proof.mjs --url {serve}/embertide-app/ui/intro/dyson-society/app/warm.html --tap sphere`: PASS, the film never below its second at
  the tap (6.10 s) (fix-try 011325).
- The same with `--tap button`: PASS (6.02 s) (fenced.sh through run-sweep).
- The commit that adds this receipt changes no other file, so the tip carries 435b840a3's code unchanged.

**`lander.mjs plan`** at 435b840a3, against main c11e2e53a:
- 3 files changed; the merge-tree is clean.
- Rule 8 asked for the two names; the commit of this receipt carries them.
- The gate would run 178 test files, then the 3 proofs below.
- No journey, no restart. The Mac shell is untouched; a new embertide-app release; no iPad cut.

## The hand (not handed: the sweep's seat hands it)

```
node tools/embertide-mesh/lander/lander.mjs hand lane/the-anime-never-stops-proofs --commit <its tip> \
  --receipt embertide-app/ui/intro/dyson-society/lab/THE-ANIME-NEVER-STOPS-PROOFS-LANDING.md \
  --proof '@embertide-app/ui/intro/dyson-society embertide-app/ui/intro/dyson-society/app/dl-twelve.proof.mjs --url {serve}/embertide-app/ui/intro/dyson-society/app/warm.html --tap button' \
  --proof '@embertide-app/ui/intro/dyson-society embertide-app/ui/intro/dyson-society/app/dl-twelve.proof.mjs --url {serve}/embertide-app/ui/intro/dyson-society/app/warm.html --tap sphere' \
  --proof '@embertide-app/ui/intro/dyson-society embertide-app/ui/intro/dyson-society/lab/paywall.proof.mjs'
```

## What his hand still owes

Nothing, for this lane to land. Two things are his to choose later, when the page moves:
- Whether the offer comes back. If it does, the choice checks above engage again.
- Whether the sphere may draw at the wall while her entrance plays (the numbers above).

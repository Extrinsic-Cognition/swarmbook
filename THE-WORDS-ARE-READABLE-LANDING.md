# THE WORDS ARE READABLE (Nov 23 2026)

Lane `lane/the-words-are-readable`, seat claude-bd202a7f on the new Mac, cut from main 4f033a52f9. The mint page (swarmbook.com's first page,
`app/warm.html`) drew words a person cannot read: the explainer's labels at 6 px in a tall window, the split's calls at 7 px on a phone, the
film's skip at 11. No word is now drawn under 13 px on a phone or 12 px on a desktop, and no word grew into another or off the glass.

## His words (UTC, Nov 23 2026)

- 20:09:01, over two pictures of the explainer at the top of a tall window, the labels a smudge: "this is too small dude come on do QA dude".

## The cost first

CSS and the cache words only: no new request, no new draw, nothing at rest. JavaScript +8 −8, net 0, in 6 files (cache words and two pins
moved in place; her two sizes in `dl-athena.js`).

Words under the floor, counted once each, from the first second through the skip, her twelve lines and the split (the live site at
ec8f39c5b0 against this lane's built copy, the same walk):

| window | live now | this lane |
|---|---|---|
| 320x568 | 19 | 7 (the explainer's labels, 11.1 px) |
| 390x844 | 18 | 0 |
| 600x900 | 12 | 0 |
| 760x930 (his pane) | 11 | 0 |
| 1024x768 | 12 | 0 |
| 1280x800 | 3 | 0 |
| 1440x900 | 3 | 0 |

The lane read 0 too at 360x780, 375x667, 430x932, 900x800, 1000x850 and 1920x1080, and 0 lines off the glass at all thirteen.

## The QA

A probe in the page (ec-workspace `var/journeys/2026-11-23/the-site-screen-by-screen/qa-fit.js`, run by that folder's `walk.mjs`): every
visible text node's drawn size (its font size times its own scale, the SVG's included), every line box past the glass's edge, and every two
words whose line boxes cross, at seven moments of the walk (4, 10, 20, 33, 42, 52 and 60 s: the confirm, her name, her lines, the split).
The first pass read sizes only and passed a phone split whose bigger words ran into each other ("KEEP YOUR SOL THE EGG IS YOURS") and off
the glass; the second commit is that mend. A crossing the probe flags was looked at by eye and by a hit test before it was judged: her name
card (the epithet's line box touches the name's, the letters do not), "Mint your hexagon." (a 1x1 heading nobody sees) and her ドン are not
words on words.

## What lands

- `app/dl-paywall.css`:
  - the explainer: in a tall window it takes the height its words need beside her (`min(66.66vw, max(40vh, 73vh − her))`); its labels 22
    units on a desktop (were 19), 38 on a phone (were 28), 28 in a tall window as before; the stacked layout from 5:4 down, as the sheet already reads a
    tall window (it began at 1:1, and at 900x800 the labels were squeezed beside her to 8 px);
  - the split's plates: the small call and the stamp at 13 px at least; on a phone the call keeps .1em between its letters and the stamp's
    words wrap inside half the glass (`.snowtrace-tier-title > span` held them on one line);
  - the pre-deposit line `clamp(13px, 1.05vw, 15px)`; the film's controls 13 px.
- `app/dl-twelve.css`: the film's skip 13 px (was 11).
- `app/dl-athena.js`: her epithet `clamp(13px, 1.9vw, 28px)` and the confirm's Stay and Skip 13 px (were 12).
- `app/warm.html`, `app/warm-entry.mjs`, `app/dl-space-router.js`: the three moved files' cache word `readable-1`, in place; the two tests
  that pin them follow (`app/dl-athena.test.mjs`, `app/dl-twelve.test.mjs`).

## Proofs (the new Mac, nice 19, headless, off every screen; nothing paid, nothing sent)

- The 31 suites that read the moved files: 279 of 283; the 4 red are red on main with these six files (THE DEPTH, the phone's own files,
  the public mint's ice tokens, her cut's pose), none of them reads a size this lane moved.
- Rule 8: `app/dl-twelve.test.mjs` green; `app/dl-twelve.proof.mjs --tap button` PASS and `--tap sphere` PASS on this lane's served
  `warm.html` (a stage that answers Range with 206).
- The screens gate (`no-landing-adds-a-failing-screen.1.sh`, `.2.sh`): 24 cells, 0 new failing.
- THE JAVASCRIPT ONLY SHRINKS: +8 −8, net 0.

## NEVER ON HER (the follow-up, `lane/the-explainer-is-never-on-her`)

His words, 2026-11-23 20:51:48 UTC, over his tall pane with her hair across THE TRAIL: A TRACENET: "dude...".

This lane's first landing (7a4f8949f8) gave the explainer a floor of 40vh in a tall window, and at 760x930 that ran its foot 100 px into
her picture, which her layer draws over it. The check above read words against words and the glass, never against her. A first mend
started the explainer in the dark band at the top and was wrong too: that band is her layer's top bar (`.dl-athena-lb.t`, 13%), drawn
over the explainer, and it cut SOL and THEN FASTER.

- `app/dl-paywall.css`, a tall window wider than a phone (701 px and more, 5:4 and taller): the explainer from the bar's foot (13vh) to 1vh
  above her box, `min(66.66vw, 86vh − min(60vh, 540px))`; its labels the phone's 38 units at .06em and SOL 42 (15.4 px at 760x930).
- The check (`qa-fit.js`) now reads, for every word, her sprite's own alpha mapped onto the glass and her layer's two bars, and at a pixel
  of hers or the bar's which is drawn on top (every element made hit-testable for that one read). It flags the first landing's labels under
  her hair and the first mend's under the bar; on this lane, at 701x1000, 760x880, 760x930, 768x1024, 800x1000, 820x1180, 900x800 and
  1000x850 (and the phones and desktops above, unchanged by it), no word is under her, under a bar, under the floor, off the glass or on
  another.
- Proofs on its tip: the 31 suites 279 of 283 (the 4 red as on main); rule 8, `app/dl-twelve.test.mjs` green and `app/dl-twelve.proof.mjs`
  `--tap button` PASS and `--tap sphere` PASS on the lane's own tree served with Range; the screens gate 24 cells, 0 new failing;
  JavaScript +0 −0.

## What is left (named, not done here)

- 320x568 and 760x700: the explainer's labels draw 11.1 and 10.8 px; between her layer's top bar and her there are 187 and 182 px of
  height, and larger labels would leave the SVG's 960 units ("THE TRAIL: A TRACENET").
- The film's buttons (Restart, Sound off, Pause) and the sound invitation ("Play with audio on") lie under her picture from her first line
  on, in every window the walk read; her layer is drawn over them. Both stand on the live site today.
- Her hand and egg rise in front of her name's banner on her card in shorter tall windows: her entrance pose, as on the live site.
- No gate reads a screen behind a press (the confirm, her lines, the split): the screens gate reaches the pages' addresses only. No gate
  yet: the measure it waits for is the count of words under the floor, off the glass or on each other in the walk's states, read by the
  screens checker against a baseline that only shrinks.

Live at his publish alone.

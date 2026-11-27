# THE EGG'S CALL FITS THE PHONE, AND LEAVES WITH HER SCENE (lane/the-egg-fits-the-phone, Nov 21 2026)

## His words (UTC, Nov 21 2026)

About 22:45, over eight screens of the road a second person takes (the live site and a clean house): "it is full of dysgenic screens with awful
unnerving designs... just do qa screenshots, it's so fucking easy to tell". Then, on the card "Fix the faults QA marked on the road's screens":
"Do this task here".

## What stood (read on the live page, swarmbook.com, a headless Chrome on the real GPU, off every screen)

- At 390 x 844, at the egg's call (`warm.html?door=deposit`, html[data-flask-waits]): the door is 366px wide, but the call's one implicit grid
  column took its widest line's width, the stamp "MINT YOUR SWARMY EGG · $10" (nowrap at 24px: 445px). Every line is justified to that
  column's end, x=457 on a 390px glass: "$10", most of Connect X, and the end of "card, Apple Pay or a Solana wallet · with your X" were off
  the right edge. A person on a phone could not read the price.
- At 1440 x 900, scrolled into the page: her scene steps away (html[data-space-router-away]: the router's layer is hidden and moved up), but
  `html[data-flask-waits] .dl-flask-door{display:block!important}` kept the door fixed on the glass, so the call's light words lay over the
  film's cream poster ("I set you free.") and could not be read. The sheet's first rule for the door already shows it only when the scene is
  not away; the flask's later rule overrode it.

## What lands

Three style rules at the end of `app/dl-paywall.css`, no script (JavaScript +0):
- under 700px the egg call's grid column is the door's own width (`grid-template-columns:minmax(0,1fr)`);
- under 700px the stamp's size follows the glass (`font-size:min(24px,4.9vw)`: 19.11px at 390, 24px from 490 up);
- `html[data-space-router-away][data-flask-waits] .dl-flask-door{display:none!important}`: the door leaves with her scene and returns with it.

## The cost

Nothing at rest and nothing per frame: three declarations read at style time. +8 lines of CSS (five of them the comment), 0 of JavaScript.

## Proofs

- The lane's sheet served on the LIVE page by CDP (only `dl-paywall.css` substituted; every non-GET to the site's doors failed before it left):
  at 390 x 844 the stamp is 354px wide at 19.11px and every line of the call ends at x=378 (the door's right edge, 12px in); at 1440 x 900 the
  call's boxes are unchanged (446 to 1060); scrolled to the page's end the door is not shown; back at the top it stands again. Stills beside
  the walkers: ec-workspace `tools/anchor-beat/lyssa-pfp/out/second-person-walk-2026-11-21/egg-before-after.png`.
- Rule 8, on the new Mac at the lane's tip d329f674dc (23:03 UTC, nice 19, the page served by tools/serve-range, 206 on ranges):
  `node --test app/dl-twelve.test.mjs` exit 0; `app/dl-twelve.proof.mjs --url <the served warm.html> --tap button` PASS and `--tap sphere`
  PASS ("the sound came in where the picture was, and the picture never went back").

## Not changed, his to judge

The look of the moment itself: the white disc and the gold shape at the centre (the same on the real GPU as in the first stills), her place
at the glass's edge (her picture ends at its own border; the layout does not cut her), the film's buttons under her sprite at this moment, the
grey skip pill over the cream poster.

## His road after the landing

The site is published by his press: both names, swarmbook.com and optimism.fit, are one Worker. Until then the live page is as before.

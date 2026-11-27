# HER OFFER IS ONCE A BROWSER

Nov 26 2026 UTC, seat claude-212510a1, `lane/her-offer-once-per-cookie` (on `lane/the-preamble-and-the-film-seen-once`).

His words, Nov 26 2026, over that lane's film skip: "its wrong. after the first visit, you dont show her saying take this egg anymore... that
appearance of her is once per cookie".

## What changes

- **The mint, opened plain by a browser that saw her offer, goes to Societies.**
  - It is opened plain when it has no query and its hash is empty or `#purpose`.
  - The browser saw her offer when it carries `am-intro=1`, written by `dl-athena.js` at her egg and by the bar after the mint.
  - It is one statement in the head of `warm.html`, run before the film or she is loaded: `location.replace('./index.html')`.
- **A door with its own address still opens the mint:**
  - the Societies preamble's plates (`#mint`, `#refuel`);
  - Ride's mint (`?door=deposit`);
  - a friend's `?ref`, and Harmony's `?from=harmony`.
- **The film skip of the lane below is taken out.** `dl-twelve.js` is as main had it; the film is never sought for the cookie.
- **JavaScript net 0** on this member (the statement stands on an existing comment line).

## Measured (this tree served by `tools/serve-range`, headless off every screen)

- **With `am-intro=1`:**
  - `warm.html` lands on `index.html`, with the wall's 12 cards;
  - `warm.html#refuel` stays;
  - `warm.html?door=deposit` stays.
- **Without it:** `warm.html` plays its film (8 s in at 8 s).
- **Rule 8, no sound touched:**
  - `node --test app/dl-twelve.test.mjs` is green;
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <warm.html served by tools/serve-range>` passes with `--tap button` and with `--tap sphere`.
- **The site's tests:** 598 of 601, the 3 red main's own.
- **NO LANDING ADDS A FAILING SCREEN:** green on both halves.
- **THE JAVASCRIPT ONLY SHRINKS:** green.

## Owed

- Live on swarmbook.com at his word (deploy).

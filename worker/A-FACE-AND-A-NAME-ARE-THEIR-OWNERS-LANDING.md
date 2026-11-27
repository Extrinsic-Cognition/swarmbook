# A FACE AND A NAME ARE THEIR OWNERS' (Nov 20 2026, lane/a-face-and-a-name-are-their-owners, seat claude-62e500da)

## His words

- Nov 20 2026 14:16:24 UTC: "can you please audit the nest for vulnerabilities? across all devices"
- 15:50:49 UTC, over the audit's finding on the public site and the question "Close the public site's two holes next?": "Yes, cut it"
- The rulings it rests on, as the code already carries them: Nov 11 20:45 UTC "the goal is after people deposit 10$ usdc or some shit, they have
  their own profile", its address "Their X handle"; Nov 19 "shouldn't we have people first link their twitters and then do the mint", "Yes, build
  it" (X HOLDS THE FLASK). And his Nov 11 line on the faces, when the hole was first named in the door's own header: "it is only internal atm".

## The cost

- JavaScript: 25 lines changed in 7 files, none added (net 0).
- A pass, the colours or a picture: one Ed25519 check (48 microseconds on the new Mac, 2,000 runs at nice 19) and one more D1 read by primary key.
- A page's claim: one more D1 read by primary key.
- In the browser: one signature by the flask's own key an ask (24 microseconds there). Nothing at rest, no timer, no new store.

## What was so (main 7c3b9c9939)

- **The portrait door** (`worker/space-router-portrait.mjs`). A deposit's signature is public (the chain, and this door's own list of every
  hexagon), and a pass, the colours and a picture were given to whoever brought it. So anyone could set any depositor's face on the public
  wall, up to its twelve pictures, and spend its three painting passes of the house's Reactor key. The door's header said so, "internal for now".
- **The creators' door** (`worker/creators.mjs`). Where deposits are open, any flask of 10 USDC claimed any free X handle with no word from X:
  its page at `<site>/<handle>` and every payment to it.

## What stands now

- **A face is set by its deposit's own flask.** A pass and the colours (`POST`), and a picture (`PUT`), are given only when the ask carries the
  site's own sign-in signed by the flask's key (`x-seat`, as the creators' door reads it) and that address is the deposit's payer in
  `sr_deposits` (a flask's own deposit, a relayed one, the house's fill and a card's egg all name the flask there). 401 otherwise, and for a
  deposit heard and not yet counted. The list and the pictures stay public.
- **A name is its owner's.** Where deposits are open (`SPACE_ROUTER_TREASURY`), a handle is claimed only by the flask X itself said that
  account holds (`sr_x`, written by the X door after it trades the code with X), compared without case. 403 otherwise. Without a treasury (a
  stand-in) the door is as before.
- **The page sends what the door asks.** `app/dl-kit-deposit.js` offers the flask's sign-in (`DL_FLASK_SEAT`) and `app/dl-her-portrait.js`
  sends it with its two asks. A page without a flask sends none and is refused, as a stranger is.

## The tests

New Mac, a scratch worktree at 97928f1add, nice 19, `node --test --test-concurrency=4 --test-force-exit`:

| suite | result |
|---|---|
| `worker/*.test.mjs` (21 files) | 150 of 150 |
| `app/*.test.mjs` (67 files, `app/dl-twelve.test.mjs` among them) | 537 of 541; the 4 red are main's own (the same four on main: `dl-athena`, `dl-handoff`, `dl-paywall`, `warm-sphere-moment`) |
| `tools/*.test.mjs` of the mint folder (17 files) | 105 of 107; the 1 red is main's own (`storyboard-canvas`: a tab is born by his word; red at 4917d0e538 too) |
| the law gates (the JavaScript only shrinks, any room, the law is the gate, no page of its own) | 54 of 54 |

- New assertions ride existing tests. `worker/space-router-portrait.test.mjs`: every ask of the suite now carries the flask's sign-in; no
  sign-in, a broken one and another flask's each get 401 for a pass, the colours and a picture, with nothing kept, no pass taken, Reactor not
  asked; a deposit not yet counted is nobody's; the list stays public. `worker/creators.test.mjs`: with a treasury, no flask of 10 USDC 402, a
  flask no X account holds 403, another account's handle 403, the handle X said in another case 201.
- `worker/space-router-deposit.test.mjs` claimed a page twice with a deposit alone; both now show the 403 or carry the flask's `sr_x` row.
- The first run, at 123879e121, was 148 of 150: those two claims.
- Rule 8: the lane touches the mint's `app/`; `app/dl-twelve.test.mjs` passes, and the two proofs of `app/dl-twelve.proof.mjs` (`--tap
  button`, `--tap sphere`) ride the hand. Neither sound nor picture is touched.

## Not done, said plainly

1. **The live site keeps both holes until his publish press.** This lane is the code on main; the Worker on swarmbook.com and optimism.fit
   is whatever was last published. The wall held 0 hexagons at the audit's read, so nobody is exposed today. No migration is needed.
2. **A flask that never connected X cannot claim a page** until it does, from the same browser ("Connect X" in the deposit box). That is the
   Nov 19 road ("First, your X"); the Nov 11 road of typing a handle is closed by this lane.
3. A handle renamed on X after the sign-in stays bound to the flask as X said it that day.
4. The flask's sign-in is a bearer for its 30 days, as everywhere on the site; only the flask's own browser can make one.
5. Not walked in a browser by this seat: the page's two asks are covered by the suites above, not by a walk of a built site. That walk
   belongs before the press (`dist/optimism-fit`, served by `tools/serve-range`).
6. The audit's other finding on the public site stands: no content policy, no frame protection and no HSTS on the pages.

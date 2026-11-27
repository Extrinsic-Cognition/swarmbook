# THE HANDLE IS X'S WORD (Nov 20 2026, lane/the-handle-is-xs-word, seat claude-62e500da)

## His words

- Nov 20 2026 17:10:45 UTC: "Yes, fix it", to "Fix the handle form for a flask without X next?" (the question left by the walk of the built
  site before his publish press of A FACE AND A NAME ARE THEIR OWNERS).
- The road it stands on, his, as the code beside it keeps them: Nov 11 2026 20:45 UTC "the goal is after people deposit 10$ usdc or some
  shit, they have their own profile", and that night's ruling on its address, "Their X handle"; Nov 19 2026 ~19:0x UTC "shouldn't we have
  people first link their twitters and then do the mint so then when they use twitter on the harmony app they see balance?", then "Yes,
  build it" (X HOLDS THE FLASK); Nov 20 2026 05:36:40 UTC "are you not aware of swarmbook.com dude?" (THE PAGE NAMES ITS SITE).

## The cost

- At rest: nothing. No timer, no request added at the page's load.
- At her making's end: one more read of the browser's own store (X's kept word), before the plate is built.
- A flask X does not hold yet: one import of `app/dl-flask-x.mjs` (the door's own row, 33 lines, 3.8 kB) when its plate is built; then
  one press and one trip to X.
- JavaScript: net 0 lines. `app/dl-kit-deposit.js` 5 changed lines (24,595 to 25,667 bytes, most of it the comment that keeps his words),
  `app/dl-flask-x.mjs` 1 (3,758 to 3,839), `app/dl-kit-deposit.test.mjs` 1: the new pins ride an existing line.
- The sheet, `app/dl-paywall.css`: 12 lines in, 4 out (CSS, not JavaScript).
- No Worker change, no migration, no new file a page loads.

## What was so (live since Nov 20 ~17:0x UTC, main 402aaec836)

- The creators' door gives a handle only to the flask X itself says holds that account, and refuses any other with 403.
- The page's half was missing. At her making's end the plate still showed a field, "your X handle", to a flask with no X. Whatever was
  typed, the door answered "A page is named by the X account that holds this flask: sign in with X on this page first." The door's
  Connect X stands in the egg's call box, which leaves the screen 3.2 s after the fill (`LEAVE_MS`): at that sentence nothing on screen
  could be pressed to act on it. My miss in the lane before this one: I landed the rule with the Worker's tests green and never walked
  the page to its refusal.
- The plate's prefix was a literal in the sheet (`content:'optimism.fit/'`): on swarmbook.com the plate read "optimism.fit/" while the
  link it becomes read "swarmbook.com/<handle>". Live before either lane.
- The wall held 0 hexagons at 16:44 UTC: nobody had met either.

## What stands now

On the plate (`profile()` in `app/dl-kit-deposit.js`):

- **Nothing is typed.** With X's word kept, the plate shows the handle X said (read only) and claims it by itself, as before.
- **A flask X does not hold yet reads Connect X in the handle's place**: the door's own X row (`xRow`, `app/dl-flask-x.mjs`) mounted on
  the plate, its stamp left home, its press in the plate's own type with the plate's arrow.
- **X's road back opens the door on the plate.** The Worker's `X_BACK` returns to `warm.html?door=deposit#x=…`. `egg()` reads that
  fragment's presence once (`XBACK`): a flask that is filled goes to its plate instead of the egg's call; the row trades the code, the
  plate fills with the handle X said and claims it. A flask that has not paid goes to the egg's call, as before.
- **X's refusals are said on the plate**: the row writes on its box's own line (`[role=status]`; the door's box, the address box and the
  plate each have one).
- **The plate names the site it stands on** (`data-site`, read from the address, `www.` dropped), by no literal in the sheet.
- Above 700 px the plate stands higher while the freeze's call is the first cry (two lines), so it clears that call's first line.

`asked()` and the line that reads the page's query are main's, byte for byte: the pins of THE GOLDBERG TREE in
`app/dl-kit-deposit.test.mjs` stand untouched (the lane's first commit changed them and was red there; its second moved the road back
into `egg()`).

## The walk

A headless Chrome on the new Mac, off every screen. The built site (main's build, the bytes that are live) served from the serving Mac
with byte ranges through a tunnel, the lane's three files laid over it. Every write stood in; X's consent page stood in; the Worker's own
road back (`/space-router/v1/x/back`) asked live and passed on as it answered (302 to `/app/warm.html?door=deposit#x=<state>.<code>`).
At tip b1f5f416e3, four stations, no page error and no missing file in any:

| Station | What was walked | What stood |
|---|---|---|
| A filled flask, no X, 1512 wide | the fill said by the page (`then=making`), her making by its own presses (her field, her die, her Continue) | the plate reads `<site>/` and Connect X, nothing to type, no egg's call, no other Connect X on screen |
| The same, pressing the plate | the press, X, the road back | X asked with the page's own callback and an S256 challenge; back, the trade carried the code, the verifier and the flask's proof; the claim was signed by that flask for the handle X said; the plate became the link; the store kept X's word and the handle |
| The same plate, 390 wide | her making, the plate | the plate inside the glass, clear of the call under it |
| X refuses a filled flask | the road back saying no | the plate says "X did not let you in. Try again." and keeps Connect X; it clears the first cry under it |
| A flask that has not paid | Connect X at the door, the road back; then X refusing | the egg's call as before, "Your X" and the handle on it, no plate; the refusal said on the door's own line |

Frames looked at: the plate with no X at both widths, the plate after X's road back, the plate with X's refusal (and its close-ups).

## The tests

On the new Mac at nice 19, in a scratch worktree at the tip b1f5f416e3:

| Suite | Result |
|---|---|
| `app/*.test.mjs` | 537 of 541 (4 red, main's own) |
| `worker/*.test.mjs` | 150 of 150 |
| `tools/*.test.mjs` (the mint folder's) | 105 of 107 (1 red, main's own; 1 skipped) |
| The law gates (the JavaScript only shrinks, any room, the look, the law is the gate, no page of its own, the pixel is a lookup) | 59 of 59 |
| `app/dl-twelve.test.mjs` (rule 8) | 21 of 21 |

The red ones are main's own: the same files fail the same way on main (`dl-athena`, `dl-handoff`, `dl-paywall`, `warm-sphere-moment` in
`app/`; `storyboard-canvas` in `tools/`). Two runs of `tools/twelve-dct.test.mjs` were red in my first runs because a plain ssh command on
the new Mac has no `ffmpeg` on its path; with it, 7 of 7, on the lane and on main alike.

Rule 8: the lane touches the mint's `app/`, so `app/dl-twelve.test.mjs` ran (above) and the two proofs of `app/dl-twelve.proof.mjs`
(`--tap button`, `--tap sphere`) ride the hand. Neither sound nor picture is touched.

One slip: I ran `app/dl-kit-deposit.test.mjs` alone (10 assertions that read text, 0.1 s) once on the serving Mac. Every other run was on
the new Mac.

## Not done, said plainly

- **Not live.** The page changes at his publish press: three page files, no Worker change, no migration.
- **No real deposit and no real X in the walk.** The fill, the deposit's signature and X's answer were stood in. X's real consent page,
  its real code and the Worker's trade with X are the Nov 19 lane's and are unchanged here.
- **A filled flask that comes back from X sees its plate, not the egg's call.** To refill in that visit it opens the door again.
- **During the trade with X (about a second) the plate still reads Connect X**; a second press then starts X again, as at the door today.
- **The plate's place over FOLLOW THE TRAIL is as before**: it sits on the band's top edge, the letters whole. Only the first cry's case
  was moved.
- **A handle renamed on X after the flask was held**: the claim uses the handle X said at the holding (`sr_x`), unchanged here.
- **The egg's call still says "with your X"** to a flask that never connects it; paying without X still works, and its page waits for X.

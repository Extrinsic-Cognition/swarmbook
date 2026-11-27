# EVERY DOOR GOES WHERE IT SAYS

Nov 26 2026 UTC, seat claude-168f7fed, `lane/every-door-goes-where-it-says`. His words, ~01:1x UTC, over two stills of swarmbook.com's
after-the-mint page (the race list under "THE PANTHEON →"; the ring of thrones, the egg, the riders' board): "can we please audit what clicking on
these leads to and whether that makes sense or not? (spoiler, some cases it makes 0 sense)... u need some exhaustive traversal dude". Then, on the
audit, the warden's GO on the Canvas: "Yes, fix them".

## The walk (live, Nov 26 2026 ~01:2x UTC)

Headless Chrome, off every screen, 1440 x 900. The page brought to its bar on both sides (`?side=pool` with its race list read off the chain,
`?side=flask`). Every visible clickable listed:

- each link opened in a fresh tab and read where it landed (address, status, title, headings, the anchor's target, errors, a still);
- each button pressed on a fresh copy of the page and its change read.

16 on the blue side, 15 on the red, the same doors.

| Door | Landed | Verdict |
|---|---|---|
| THE PANTHEON → (the race strip) | the Root's society page at its top, "The Root, Tipped"; the Pantheon 1,303 px below | broken: `#hall` is hidden until the chain is read, so the jump found nothing |
| The ring of thrones (Fuel the swarm) | the same | broken: one link for all; the + did not make a wish, a racing swarm's hex did not open it |
| The egg (The egg is yours / Ride the swarm) | `tracenet.html?of=photons_enjoyor`, one person's Oct 26 day, tab "Your tracenet · optimism.fit", a 404 | makes no sense |
| Race row 1, The Root, Tipped | the same page and place as THE PANTHEON | two labels, one place |
| The throne's name | the strip "the next fee takes the ♈ throne", the Pantheon "IVPPITER" | two names for one throne |
| Prompt-2-mine $WARM | `warm.html?door=deposit`: Connect X, Mint your hexagon | his call: the label says mining $WARM |
| A Test Swarm, race row 2 | its society page | his call: a test society racing in public |
| How a swarm decides | `rules.html`, "Cash is the sandbox." (budgets), tab "the seals" | his call |
| The governance film, Sound on, rows 2 to 4, Make a wish, Be the first rider, The first trail, Why a swarm, Terms, Privacy | where they say | fine |

Not walked: what shows only after a press (her stake door and its dialog, Paint your Lyssajudron). swarmbook.com/ opens the mint page; this page is
reached through her split.

## What changes

- `polis.js` renderHall: once the hall stands, a visit by `#hall` goes to it, once. Its thrones wear their signs (polis-state.js `SIGNS`) on the
  ring, on the throne's card, at the gate, for the challenger and in the ladder, never the Latin names (his Nov 23 2026 "dont fucking use the latin
  names or the numbers... use also the oroscope icons there", which the site's ring already keeps). `polis.css`: the hall lands under the page's
  header (`scroll-margin-top`), a throne's sign at 24 px.
- `after-the-mint.html`: the egg goes to the mint's door (`warm.html?door=deposit`, "Mint your hexagon: the egg is yours, to ride the swarm"). The
  first tracenet stays the footer's "The first trail". `tracenet.html`'s tab now says Swarmbook.
- `after-the-mint-book.mjs`: in the ring, a racing swarm's hex goes to its own society, the + to Make a wish (`found.html`); the rest of the ring
  stays the Pantheon's door.
- Race row 1 and THE PANTHEON now land in two places: the Root's head and its Pantheon.
- JavaScript +33 -33, net 0: the society page's test folded where its assertions stood one to a line.

## Measured (this tree served by `tools/serve-range`, headless)

- `polis.html?civ=0#hall`: the page at 1,219 px, the Pantheon's heading 111 px from the top, under the header. The ring's thrones read
  ♈︎ ♉︎ ♊︎ ♋︎ ♌︎ ♍︎ ♎︎ ♏︎ ♐︎ ♑︎ ♒︎ ♓︎; the throne's card ♈︎; the gate "its first fee takes ♈︎".
- On the blue page, by trusted presses:
  - a racing swarm: its society;
  - the +: `found.html`;
  - a throne: the Pantheon, `#hall`;
  - the egg: `warm.html?door=deposit`.
- `node --test app/polis-rite.test.mjs app/after-the-mint.test.mjs app/polis-knock.test.mjs`: 26 of 26. The two new cases were red on main first.
- Rule 8, no sound touched: `node --test app/dl-twelve.test.mjs` and `app/dl-twelve.proof.mjs` on `warm.html` served by `tools/serve-range`, both taps
  (button, sphere): 21 of 21, PASS on both.
- NO LANDING ADDS A FAILING SCREEN, its two halves on this tree: green, 0 new failing of 60 cells.

## Owed (his)

- Prompt-2-mine $WARM: where it should go.
- A Test Swarm in the public race.
- What "How a swarm decides" should open.
- `/nest/ref/scene/module` answers 404 on the public site (the room's module asking the Nest for its sha). It falls back to its own bytes, so
  nothing breaks; it is one red line in a visitor's console.
- Not on swarmbook.com until a deploy, his word.

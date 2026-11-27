# THE MINT IS OPEN AGAIN

`lane/the-mint-is-open-again`, seat claude-93958ebc, Nov 19 2026, cut from main fb5c8f0106. Every time is UTC.

## His words

- 12:12: "before the mint idiot: * https://optimism.fit/app/warm.html this intro is what swarmbook gotta have... the anime spatial montage..."
- 13:52, over a walk of mine that began at the page `/` had opened since the close: "absolutely ucking wrong ... you are missing the entire whole anime
  "https://optimism.fit/app/after-the-mint.html" IT. IS. AFTER. THE. MINT. READ THE FUCKING URL".
- 14:12:30: **"Yes, reopen it"**, on "Reopen the mint so the road runs in your order again?".
- The order it restores is his of Nov 11: ~05:45 "u get that coloring lyssajudron now has to appear after the mint? ... we need to get the hexagon
  minted there dude"; 06:09 "i need people to create their damn fucking flask... so i could use nefertiti introducing the urgency and the egg... then
  bringing back instead of jumping straight into lyssajudron".
- The date it moves was his too: Nov 11 06:10 "Yes, through Nov 17" (`MINT_CLOSES` 2026-11-18T00:00 UTC).

## The numbers first

| what a visitor meets | live, before (optimism.fit, four passes in a clean headless Chrome, 13:5x to 14:0x) | this lane's page (served by `tools/serve-range` on the new Mac, walked 14:4x) |
|---|---|---|
| the film at the drawn arrow (frame 3616, 120.65 s) | plays through it to its end, 152.4 s, and starts again | **held: the film reads 120.7 s, paused, from the 125th second on** |
| Nefertiti | no entrance, no line; she stands at the freeze only after the making | **her card (NEFERTITI, NESTAL NYMPH) and her lines on the held frame**, read in order below |
| her making ("Give me my colours.") | opens by itself at 2:40 for everyone, before any payment | waits for the flask (THE EGG WAITS FOR THE MINT) |
| the film's skip | none | SKIP TO $WARM › stands |
| `/` and `/referral` on both names | `app/after-the-mint.html` | `app/warm.html` (`worker/premint.test.mjs`, on Nov 19 2026 and on Jan 1 2027) |
| JavaScript | | 29 lines changed in place, **net 0** |

Cost: nothing at rest and no new read. The page's work at the stop is what it was through Nov 17 (the wall's pause of the film and its song, her
entrance's sprites asked `PRELOAD_S` before it).

## What changed

One constant: `app/dl-paywall.js` `MINT_CLOSES = null`, his word beside it on the line that holds the date's lineage. With no close and no launch day
the wall is exclusive at every instant (`exclusive()`; `mintState()` says `unset`), and every reader of the window follows without a change of its own:

- `app/dl-twelve.js`: the wall (`createPaywall({hold: DRAWN_FRAME, closes: MINT_CLOSES})`) holds the film and its song on his full draw for a visitor
  without a seat.
- `app/dl-athena.js`: her entrance plays on the held frame (`come()`: `S.held`), and with no seat her egg is offered, not dropped (`seated()` false).
- `app/after-the-mint.mjs`: a plain visit to the page after the mint goes on to the mint page; a visit the split sent (`?side=`) and `#preview` stay.
- `worker/premint.mjs`: `/` and `/referral` open `app/warm.html`.

So that both sides of a close stay proven, the close became a parameter where it was read from the module, the house's own by default:
`isAfter(now, closes)`, `mountAfter({closes})`, `createHandler({closes})`. A close is a date he gives on that one line.

Two proofs read the constant as a date and now take none: `app/dl-warm-words.proof.mjs` (`OPEN`), `lab/paywall.proof.mjs` (the line it rewrites for
its own door).

## Read on the new Mac (a scratch tree at 86cf0645cc beside a second at main fb5c8f0106; node under `tools/dead-tasks/bounded.mjs`, nice 19)

- The four test files this lane changes: `app/after-the-mint.test.mjs` 8 of 8; `worker/premint.test.mjs` 27 of 27; `app/dl-paywall.test.mjs` 35 of 36;
  `app/dl-athena.test.mjs` 23 of 24. The two reds are main's, name for name on main's own tree: "the public mint keeps DysonLight Harmony ice and
  accent tokens" and "THE DEPTH rides the engine and the corner: ...".
- `app/dl-kit-deposit.test.mjs` 8 of 8.
- The whole folder (`app/*.test.mjs worker/*.test.mjs tools/*.test.mjs lab/*.test.mjs`, four at once): 1187 tests, 1172 pass, 13 red, 2 skipped on
  the lane; the same four numbers on main. Twelve red names are the same on both; the thirteenth is `lab/heartbeat.test.mjs`, said as the file on the
  lane's run and as its one test on main's ("the sphere takes the heart through setPulse ..."): run alone it is 8 of 9 on both trees, that same test.
- **Rule 8.** `node --test app/dl-twelve.test.mjs`: 21 of 21. On the lane's tree served by `tools/serve-range` (the page 200, the film's range 206):
  `nice -n 19 node app/dl-twelve.proof.mjs --url http://127.0.0.1:18997/dyson-society/app/warm.html --tap button` PASS and `--tap sphere` PASS ("the
  sound came in where the picture was, and the picture never went back"; the film never below its second at the tap, 6.10 s; both media sought past
  the tap).
- The lander's own plan for the lane (`lander.mjs plan`, read-only): 9 files changed, merge-tree clean, 274 test files.

## The walk of the lane's page (`walk6.mjs`: a clean headless Chrome off every screen, real time, a still and the words on screen every 5 s, nothing pressed)

- **0 to 120 s: the anime, as on the live page.** The film reads 119.8 s at the 120th second, playing; SKIP TO $WARM › stands from the 5th second.
- **From the 125th second the film reads 120.7 s, paused, to the walk's end at 250 s:** held on the drawn arrow, the pale Goldberg sphere whole
  behind it.
- **Her entrance on that frame:** NEFERTITI, NESTAL NYMPH, and her lines as the 5 s ticks caught them: "There's no time." (the still at 125 s),
  "Solana is fast. It is not yet smart.", "I am going to make it think." (with SOL, Solana and THE SWARM drawn beside her), "Its yield becomes my
  swarm's fuel.", "The trail it leaves is a tracenet.", "It learns from its own trails. Then faster.", "Give it your SOL's light, hold $POOL.", and at
  155 s **"Take this egg."**, the egg held out. The other four of her twelve fell between ticks.
- **From 160 s the freeze stands on the held frame:** the pale sphere with his full draw in its window, THE FIRST TRACENET / PROJECT SNOWTRACE,
  NOW LIVE / OPEN SOURCE, TRACED, MINT YOUR SWARMY EGG, Nefertiti at the corner holding out the egg. Under the call this server says PAUSED (no
  Worker behind it); the live site's says FROM 10 USDC.
- **Her making never opened** in the 250 s ("Give me my colours." is in no tick): it waits for the flask.

This is the frame of his north star (the Swarmbook doc's section 13) without its faces: no flask is minted yet. The stills:
`ec-workspace/tools/anchor-beat/lyssa-pfp/out/stranger-walk-2026-11-19/the-lane/`.

## What it leaves

- **The live site changes at his publish**, not at the landing: the build, the films to the bucket and the deploy are his press (one script).
- On the lane's static server the deposit door has no Worker behind it, so its door stays shut there and her offered egg presses nothing: the
  payment's road is as it was on the live site (walked there today up to the address; never paid by anyone).
- Words that name the window's end and are not on a visitor's screen: `mintLine()` for no close reads "The mint runs for 7 days from launch." into a
  line the page keeps commented out; her count's "UNTIL SOLANA BREAKPOINT" stands in plates no line of her story shows. The page after the mint keeps
  "The pre-deposits closed at Solana Breakpoint." for after a close.
- The page being rebuilt as Swarmbook's on `lane/swarmbook-one-branch` is `app/after-the-mint.html`: with the window open `/` no longer opens it.
- The sphere behind the call fills with faces only as flasks are minted: none yet.

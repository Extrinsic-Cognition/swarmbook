# THE ONE HEADER, AND THE BLUE SIDE IS THE STAKE

Nov 26 2026 UTC, seat claude-168f7fed, `lane/the-blue-side-is-the-stake`.

His words:
- ~02:0x UTC, marks over the blue page: "useless noise" over Project Snowtrace / Wishes pull riders; "unclear" over the season strip; "need real ones
  here... this fucking section we're on is for people who want to stake sol to get $pool..." over the race; "wtf is this?" over the riders' board.
- ~02:1x UTC: "im not satisfied... you should consider we need a proper webapp structure... this can be the blue sinkhole aka when you select
  pentagons stakers... but we are totally lacking navigational structure... need you to do exhaustive traversal".

Then the warden's GO on the Canvas: "build it".

## The walk (live swarmbook.com, Nov 26 2026 ~02:1x UTC)

A real browser opened each page, let its film finish, and followed every visible link: 14 distinct pages.

- **Five headers.**
  - The mint's (SWARMBOOK / UNIT 0 · The vow).
  - None on the blue and red sides.
  - SWARMBOOK · Why? How? Join, on the wall, the wish and the text pages.
  - SWARMBOOK · ← All societies, on the society pages.
  - DysonLight Harmony's, on the tracenet.
- **No way back.** The two sides are reached only from her split, and no page links back to either.
- **Dead ends.** Mint your hexagon has no visible link out.
- **The Pantheon.** It is a section down The Root's page.
- **The logo.** Every SWARMBOOK goes to the wall, not to the front door.

## What changes

- **One bar on every page but the mint** (`site-bar.css`, static links, no script): Stake (blue, `after-the-mint.html?side=pool`), Ride (red,
  `?side=flask`), Pantheon (`polis.html?civ=0#hall`), Societies (the wall), Tracenet (the first tracenet).
  - The page it is on is lit; each side lights its own colour.
  - The wordmark goes to the front door (`/`).
  - It stands in each page's own header line: after-the-mint under its twelve, coming in as the hero becomes the bar and never over the film; the
    wall, the wish and the text pages in place of Why? How? Join; the society page in place of ← All societies, beside Enter as a member; the
    tracenet in place of DysonLight Harmony's mark, beside Night and Day.
- **Why and How** move to the footer, beside Terms, Privacy and Fees.
- **The blue side is the stake.** On the pool's side, the wishes' heading, the season strip, the race and the riders' board stand down, and the
  stake road stands in their place:
  1. Stake your SOL in her: you keep it.
  2. Its yield fuels her swarm, every epoch.
  3. You hold $POOL: it unlocks in five years.
  4. Her pool opens at her launch.
  The red side keeps its race and its board.
- **JavaScript net 0:** the site's tests folded where their assertions stood one to a line.

## Measured (this tree served by `tools/serve-range`, headless and in his pane)

- On the wall, the wish, How, The Root and the tracenet: the bar stands at the top, 36 px tall. Its lit item: Societies, Societies, none, Societies,
  Tracenet.
- On the blue page the bar stands under the twelve with Stake lit once the hero becomes the bar. Shown to him in his browser pane.
- `node --test` over the site's 106 test files: 564 of 567. The 3 red are main's own: her cut's sphere, the public mint's ice tokens and the tracenet
  page's look. The last went green here, once the tracenet's own bar item carries no handle.
- The new cases (THE ONE HEADER, THE BLUE SIDE IS THE STAKE) were written after the change; both are red against main's pages, which hold neither.
- Rule 8, no sound touched: `node --test app/dl-twelve.test.mjs` and `app/dl-twelve.proof.mjs` on `warm.html` served by `tools/serve-range`, both taps
  (button, sphere): 21 of 21, PASS on both.
- **NO LANDING ADDS A FAILING SCREEN.** The first run was red, 74 new failing cells, all of them the bar's:
  - links 32 px tall and type at 11.5 px on a phone;
  - white on #4080ec at 3.8:1;
  - the bar 19 px past a 768 px glass;
  - the tracenet laid out 401 px wide on a phone.
- After the fix it is green on both halves, 0 new failing of 144 cells. Now: 44 px to a press, 13 px type, Stake's blue at 6.3:1, and the bar wraps
  under the mark below 960 px. The screens' loads name `app/site-bar.css`.

## Owed

- **The mint** (`warm.html`, the front door) wears no bar: its header is hidden under her film and her split. The bar there is the next step.
- **The Pantheon** is still a section of The Root's page; its own page is the next step.
- **Her pool** has no live numbers until it is born on Solana.
- Not on swarmbook.com until a deploy, his word.

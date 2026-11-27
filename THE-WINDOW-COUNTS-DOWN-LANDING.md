# THE WINDOW COUNTS DOWN: "$WARM · N days left" shown at the offer's footer (Oct 30 2026, lane/the-window-counts-down, claude-bf9176cc)

## His word

- Oct 30 2026 03:58:31 UTC (the transcript's stamp): his click **"Show the countdown"**. The seat's question was "Show "$WARM · N days left" on the page as
  the launch countdown?". The button's text was the seat's: "Show the $WARM · N days left line on the page as the launch countdown, in a lane stacked on
  lane/clear-the-mint."

## Stacked on lane/clear-the-mint

Cut from `lane/clear-the-mint` at c910dd1bd (handed 03:52Z; it LANDED as main 9e93797ea at 04:00:10Z, its gate 204 of 212 test files green, 8 red on
main too, 4 of 4 proofs, 393 s), because the line's words are that lane's (`dl-paywall.js` mintLine with a close given): cut on main before it, the same
line would have said "The mint is open until November 15: 16 days left.". Rebased on main after that landing, so its diff is the countdown alone.

## What changes

- **`app/warm.html`:** `<span data-mint-line hidden>` is `<span data-mint-line>`. The line the paywall writes stands at the offer's footer: **"$WARM ·
  16 days left"** on Oct 30, counting down to Nov 15 00:00 UTC (`MINT_CLOSES`, as Breakpoint opens). It stands where the line stood before
  lane/stake-dont-spend hid it, at its size (11px): left of Terms · Privacy · Fees on a wide screen, above them on a phone.
- **Her stop says it.** Her stop topic says the line when the page shows it (`dl-athena.js` shownSaid), so at the stop she says "$WARM · 16 days left"
  where she said the kit's "Keep your SOL. Its rewards fuel the swarm.". No change to her code.
- The free way ("Not staking") puts it away for its own line, as before.
- Comments in `app/warm.html` and `app/dl-paywall.js` say so.
- **`app/dl-paywall.test.mjs`** pins the line shown at the offer's footer and the free line hidden.
- **`app/dl-warm-words.proof.mjs`** reads the countdown in the browser: shown, at the offer's footer, "$WARM · N days left" with N the days to
  `MINT_CLOSES`.

## What it does not do

- **Nothing at rest.** The line is written at the load and at the stop (`paintMint`), never on a timer: a page left open across a UTC midnight keeps its
  count until its next cause (a reload, the stop).
- **After the close the offer leaves the page:** the wall opens for everyone and the editorial choice hides (`dl-paywall.js` choose), so "$WARM's window is
  closed." is written but not seen. A line after Breakpoint, for the ones who missed it, is his call.
- **The app's entry** (`?from=harmony`) hides the line (`warm-harmony-entry.css`) and builds no wall: no count there.
- **Its place and size are the old line's.** A bigger countdown (on the kit, on the hero, at the stop's picture) is a design for his word.

## Measured

On the new Mac, the lane's page served by `tools/serve-range` (206 on ranges), headless Chrome off every screen, before the rebase on main (the lane on
c910dd1bd). The rebase moved no file the page asks for (`tools/page-files.mjs`): none of the 48 files main changed after c910dd1bd is one of them, so
the reads below stand for the rebased tip; its suites ran again there, dl-paywall, dl-athena, warm-entry and dl-twelve 79 of 81, the 2 reds main's own.

- **The countdown, read live** (`app/dl-warm-words.proof.mjs`): PASS, 36 of 36 at 1440x900 and 390x844. "$WARM · 16 days left" shown at the offer's
  footer at both sizes (16 = the days to Nov 15 00:00 UTC, counted up on Oct 30); 335 and 337 words read, none of them the old mint; the slot never
  opened; no page error. Seen in a picture: at 1440 the line stands left of Terms · Privacy · Fees under the tokens' small print; at 390 above them.
- **Her stop** (`app/dl-athena-entrance.proof.mjs`): PASS, 84 of 84; her stop topic says "$WARM · 16 days left" at both sizes, her free topic "Not
  staking? The code is free on day 15, without fuel.".
- **Rule 8:** `node --test app/dl-twelve.test.mjs` 21 of 21; `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button` PASS (the tap at
  6.09 s), `--tap sphere` PASS (6.03 s).
- **The suites:** the 142 files of CLEAR THE MINT's run, 1481 of 1496 tests, 4 skipped, the same 11 reds as main's own (CLEAR-THE-MINT-LANDING.md names
  them); the touched five (dl-paywall, dl-athena, warm-entry, dl-direct, dl-twelve) 85 of 87, the 2 reds main's own.

## Cost

One attribute and its comments: +223 bytes gzipped, the comments (`warm.html` +156, `dl-paywall.js` +67). No timer, listener or draw is added; the line is
words the paywall already wrote.

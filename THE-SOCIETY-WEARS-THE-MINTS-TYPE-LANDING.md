# THE SOCIETY WEARS THE MINT'S TYPE (lane/the-society-wears-the-mints-type, Nov 5 2026, seat claude-cf93186b on the new Mac)

His words. Nov 5 2026 00:20 UTC: "can we please start being serious here? ... the product is not fully brandified yet". 03:07 UTC: "Take your picks", over the
sheet of five rulings on the look; its third read: "The society's eight pages. They wear Georgia throughout. My pick: the mint's type. They are the society's own
pages, beside the mint." Behind it Oct 25 "go for all them" (the mint's fonts on every tab).

Read on main a5f50c050: the society's app (`dyson-society/app/`: the Poleis index, polis, ecology, fees, found, privacy, rules, terms) drew every title and every
word in Georgia through its own type tokens (`poleis.css`: `--display` Georgia, `--t1` to `--t4` through it), shipped no face, and drew a few lines in the system's.

## The numbers

| | main a5f50c050 | this lane |
|---|---|---|
| the eight pages, by the measure | Georgia look, no face shipped | whole, all eight: 100 % on the two faces, the faces shipped |
| declarations, the eight together | Georgia and the system's for all | DM Sans 217, Bodoni 101, mono 33 |
| what a page loads | nothing (the device's Georgia, Times or the phone's serif) | the house's fonts.css: DM Sans 48 KB a weight, Bodoni Moda 162 KB and its italic 176 KB where a title or an italic line asks them; `font-display: block` |
| HTML lines (THE JAVASCRIPT ONLY SHRINKS) | | +23 -23, net 0: the fonts.css link on the line of each page's first sheet, inline faces through the tokens |
| the mint's rule (rule 8) | | `node --test app/dl-twelve.test.mjs` 21 of 21; `dl-twelve.proof.mjs --tap button` PASS and `--tap sphere` PASS, on this tree served by serve-range (206) |
| law gates | | the JavaScript only shrinks, no page of its own: green |

## What it is

- **The tokens.** `--display` is `'Bodoni 72'` (the house's Bodoni Moda) with Georgia behind it; a new `--words` is DM Sans; `--t1` (the place's name) and `--t2`
  (a polis's name) keep the display face, `--t3` (body) and `--t4` (labels) go through the words. Controls the page does not style take the words' face.
- **Titles, names and italic lines keep Bodoni**: every `font-style: italic` line asks the display face, because Bodoni Moda ships a true italic and DM Sans none.
- **Every literal Georgia or system stack** of these sheets and pages goes through a token; sizes, weights, spacing and colours do not move.
- Built by an Opus builder in its own worktree; it stopped on a usage limit before its proofs, and the seat checked its edits, measured, proved and committed them.

## What stays

- The welcome's copies of these sheets (`ui/intro/poleis.css`, `ui/intro/poleis/`) are their own lane (lane/the-welcome-wears-the-mints-words) or untouched.
- optimism.fit takes it at his deploy; the site already serves `/fonts/`.

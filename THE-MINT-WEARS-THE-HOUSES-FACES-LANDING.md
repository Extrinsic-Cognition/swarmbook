# THE MINT WEARS THE HOUSE'S FACES (lane/the-mint-wears-the-houses-faces, Nov 5 2026, seat claude-cf93186b)

His words, Nov 5 2026 00:20 UTC: "brother... can we please start being serious here? have you been masturbating on marginal improvements in performances when
the product is not fully brandified yet?". Behind them: Nov 2 01:19 "this is the vibes i want throughout the app... what is not good is the vibes the brand the
style", Nov 2 18:19 "why the fuck the spool has not been updated yet to the new vibes style brand?", Oct 25 "go for all them" (Bodoni for the titles, DM Sans for
the words, on every tab), Oct 13 "3 diff fonts? litter", Sept 27 "i hate that the fonts change immediately after launch".

The census of that night (one Haiku reader over the tree, 30 surfaces): none carries the brand whole, 8 partly, 20 not. The first of them is the reference
itself. The mint's page asked for 'Bodoni 72', then Didot, then Times New Roman, and shipped no face: an Apple device drew Apple's own Bodoni, Windows drew Times
New Roman, an Android its own serif. The brand doc of Oct 30 named it open ("The house holds the face but the mint doesn't load it"); it stood six days.

## The numbers

| | before | after |
|---|---|---|
| the society's wordmark and the titles (`--serif`) | Apple: Apple's Bodoni 72. Windows: Times New Roman. Android: the phone's serif | every device: Bodoni Moda, the house's own file under the name the styles already use, as `after-the-mint.html`, `tracenet.html` and every Harmony tab |
| a title set in Georgia | the device's Georgia, or its serif | Gelasio, the house's file with Georgia's metrics |
| the words (DM Sans) | `warm.css`'s three faces, `font-display: swap` | unchanged: `fonts.css` is linked before `warm.css`, so the mint's own declaration stands last |
| read live at optimism.fit, 00:5x UTC | `warm.css` 39,861 B declares DM Sans only; `/fonts/BodoniModa.ttf` answers 200 (162,104 B), unused by the mint | the same files, asked for by the mint |
| the first load | 0 B of title faces | fonts.css 2,306 B, Bodoni Moda 162,104 B and its italic 176,300 B (both preloaded): 340,710 B; Gelasio 168,556 B when a Georgia title is laid out, its italic 174,212 B with the Harmony wordmark: 683,478 B at the most, cached after |
| the first paint of a title | at once, in the device's face | `font-display: block` (fonts.css, the house's law of Sept 27): the title waits for its face, 3 s at the most; the two preloads start with the page |
| the wordmark's width at 1280 | 448 px (Apple's cut) | 517 px (Bodoni Moda sets wider): read in a headless engine on the served lane |
| JavaScript (THE JAVASCRIPT ONLY SHRINKS) | | +1 line in `app/warm.html`, paid by the stale B2 view part (`concilium-inside.03-view.part.mjs`, pasted into concilium-inside.mjs and moved past): net -526 |

## Proved (the new Mac, nice 19, the lane's tree on `tools/serve-range`)

- `node --test app/dl-twelve.test.mjs`: 21 of 21.
- `node app/dl-twelve.proof.mjs --url <the served mint> --tap button`: PASS. `--tap sphere`: PASS (the sound came in where the picture was, and the picture never
  went back; both media answer Range).
- The 19 test files that read the mint's page: 199 of 204. The five red are red on the page as on main too (read by running them on both): the cursor's look on a
  Mac (`dl-athena.test.mjs`), the public mint's ice and accent tokens (`dl-paywall.test.mjs`: Harmony's harmony-orange reads #37b6d8, the test expects #0d4769),
  the page's last script, and the two build walks (`lab/one-page.test.mjs`). None is this lane's.
- The mock, today beside after, desktop and phone, is on the Canvas (the Claude page): Apple's cut, Times New Roman, the house's face.

## Owed

- His deploy carries it to optimism.fit (the site serves `/fonts/` already; nothing new ships).
- The census's other 29 surfaces and the one law, THE ONE LOOK ON EVERY GLASS: every surface loads the two faces and the one palette and names no face or colour
  of its own, the appearance guard on every served page (it holds six). No gate yet: the measure it waits for is the count of surfaces off the standard, read by the
  lander against a baseline that only shrinks.
- The mint paints nine golds; which one is the gold is his call (the brand doc, "Which palette the mint wears").
- The guard that should hold the mint to Harmony's tokens is red on main and nobody's (`dl-paywall.test.mjs`, above).

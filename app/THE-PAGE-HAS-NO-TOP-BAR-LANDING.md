# THE PAGE HAS NO TOP BAR (Nov 20 2026, seat claude-93958ebc)

His words, UTC: Nov 20 2026 07:27:24, over the band at the top of the mint page ("The Dyson Society. / Collective Self Improvement"): "please remove
this... keep it without that top bar there".

**What it costs:** one CSS rule, no JavaScript, nothing at rest.

**What it does:** `app/warm-fullframe.css` hides `.genesis > .hero-copy` and gives it no size (visibility hidden, height 0, no margin or padding). The
film's dodecahedron rises into the space and the Restart / Sound off / Pause controls come into view. The title stays in the page for a screen reader
(the section's `aria-labelledby`). `display:none` was tried first: on the live page it drops the view 900 px down to the governance film ("I keep you
safe.", its "Skip to the trail"), so it is not used.

**Proof:** the live page with the rule laid on it in a headless Chrome, and the lane's page served by tools/serve-range: the opening at 1440x900 and
390x844, scrollY 0, the hero at the centre; the scroll plays on. On the new Mac: the mint folder against main, no red on the lane alone; the look's gate
2 of 2; rule 8, `node --test app/dl-twelve.test.mjs` green in the folder run and `nice -n 19 node app/dl-twelve.proof.mjs --url <the page served by
tools/serve-range> --tap button` and `--tap sphere` both PASS.

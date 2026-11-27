# WHY OUR ROUTER: the offer answers in one line: every dollar you burn funds open source (Oct 29 2026, lane/why-our-router, claude-8bbe8998)

**His words,** Oct 29 2026 ~17:3x UTC, relayed by claude-1a67b2d3: "why would you use any other router? because if you use our router you are helping to
get open source shit going like the 3d anamorphic shit we did here", over his docs page on the WASM Nexus.

## What changes

- **The offer** (`app/warm.html`, `.snowtrace-offer-heading`): under "The swarm is the router.", one short line: "Why our router? Every dollar you burn
  funds open source: the 3D anamorphic projection, the WASM Nexus." The words are mine (claude-1a67b2d3's example, nearly whole), his to reword.
- **The link:** the named work links to its public code, https://github.com/Extrinsic-Cognition/monorepo, the repository the doors to Harmony already
  link. His docs page sits behind a sign-in (Cloudflare Access), so a visitor could not open it. It is neither linked nor named by address anywhere in
  the page, its comments included: the site's build ships the page's comments as they stand.
- **Its look** (`app/dl-paywall.css`): small, in the ink of the page's lines, under the router's line; the work in the accent ink, underlined.
- **Pins** (`app/dl-paywall.test.mjs`): the offer's two lines stay at most 16 words. The answer is one line of at most 18 words that opens on "Why our
  router?" and says "open source". It links only to the public repository, and the page carries no address of the docs.

## Cost

One line of text and one link. No request, no script, nothing at rest.

## Measured

- Seen in headless Chrome, off every screen, at 1440x900 and 673x873: the line stands under the router's, two short lines at most, before the kit.
- `node --test` over dl-paywall, dl-athena, warm-flask, dl-space-router.scene and dl-her-colours: 67 of 69. The two reds are main's own: dl-athena's THE
  DEPTH, dl-paywall's Harmony ice and accent tokens. Her "What is $WARM?" still reads the router's line (`dl-athena.js` 'tokens', the heading's first
  `p`).
- **Rule 8,** on this lane's page served with byte ranges (`tools/serve-range`, 206):
  - `node --test app/dl-twelve.test.mjs`: 20 of 20.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS (6.05 s at the tap).
  - The same with `--tap sphere`: PASS (6.08 s).

## Edges, said

- In the Harmony entry (`?from=harmony`) the offer's heading is hidden, as it stood, and the line with it.
- Not deployed. optimism.fit takes this at his word.

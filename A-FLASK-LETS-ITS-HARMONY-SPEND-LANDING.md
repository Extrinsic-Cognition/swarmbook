# A FLASK LETS ITS HARMONY SPEND (lane/a-flask-lets-its-harmony-spend, Nov 19 2026, claude-1cd371e0)

## His words (UTC)

- Nov 19 ~17:5x: "yes", to "Should I build that link between the page and Harmony?", after: "Anna opens the mint page and sends 10 USDC. The house
  records Anna has $10 of credits. Anna opens Harmony. Harmony can't use her $10."
- Before it: Nov 10 23:38 "the idea was that harmony had a wallet and could spend it, that is the entire point of \"cash is the sandbox\""; Nov 11 07:58
  "the entire point is to have the keys for the funds of the agent locally to the user"; Nov 19 ~16:5x "this is effectively a key i hold to command my
  ai agents"; Oct 28 15:59 "non-refundable deposits that turn into usage credits". The lineage, the measures and the audit: ec-workspace
  `docs/the-flasks-money-on-solana-what-he-wanted-hypertrace-2026-11-19.md`.

## What was so (main 3eb6375b79)

A flask's deposit made its tank with no key (`worker/space-router-deposit.mjs`: "a new tank waits unkeyed"), and the Space Router's doors open a tank
only by its key. What a person paid on the page could be spent by nothing: not Harmony, not any agent.

## What is so

- **The law** (`app/space-router-grant.mjs`): a grant is one Sign In With Solana text the flask's own key signs, read back byte for byte: a key's sha256
  (the key is made on the machine that spends and never leaves it), a name, whole dollars a UTC day (1 to 1,000), whole days (1 to 366). The same flask
  signs its end.
- **The door** (`worker/space-router-grant.mjs`, migration `0024_the_grants.sql`): `POST /space-router/v1/grant`. The flask's tank must stand; a key is
  written once and never again; a tank's own key is never a grant's; 12 live keys a flask at most; an ended key stays ended.
- **The spend** (`worker/space-router.mjs`): a key that is no tank's own may be a grant's. It opens the flask's tank for chat calls and tracenets, within
  its cap (429 past it, nothing sent), counts what it drinks in the burn's own batch, and `/tank` says its grant. A database behind 0024 answers an
  unknown key as before (401).
- **The page's ask** (`app/dl-flask-grant.mjs`, `app/dl-kit-deposit.js`): a link `warm.html?door=deposit&grant=<sha256>&name=&cap=&days=` opens the
  deposit door. A browser whose flask is filled sees "Let Harmony 08f9 spend" over "Up to $5 a day · 90 days · Let it", where the address stands on the
  liquor, in the door's own box and styles (no CSS added); one press signs and the box says "Done. Go back to Harmony." A browser with no filled flask
  is sent to fill first and asked after.
- **Harmony's half** (`tools/embertide-mesh/lib/tracenet-create.mjs`, `harmony-aiolos.mjs`): a Mac with no key the site knows makes its own once (`sr_`
  and 32 random bytes, `SPACE_ROUTER_TANK_KEY` in `~/.embertide/keys.env`, 0600, the slot it already had), and the Tracenet tab's existing "Fill a Space
  Router flask" opens the ask for it. $5 a day and 90 days are mine, his to change (`GRANT_CAP`, `GRANT_DAYS`).

## What it costs (counted, not measured on the live Worker)

A grant: one read and one write. A call by a granted key: one D1 read more than a tank's own key (the lookup falls through to the grant) and one UPDATE
in the burn's existing batch. A tank's own key: unchanged. Nothing runs at rest. JavaScript: +369 -14, net +355 in 11 files (190 of them the test and
the proof): the page's passkey-free signing and the Worker's route are JavaScript where they stand; the Worker loads no WASM.

## The proofs

- `node --test embertide-app/ui/intro/dyson-society/worker/space-router-grant.test.mjs`: 3 of 3.
- The Worker's neighbours (space-router, space-router-link, space-router-deposit, space-router-oracle, tracenet-tank, premint, her-wish): 78 of 78.
- `node --test tools/embertide-mesh/lib/tracenet-create.test.mjs`: 6 of 6; `embertide-app/ui/intro/life-menu/tracenets.test.mjs`: 8 of 8.
- `nice -n 19 node embertide-app/ui/intro/dyson-society/tools/flask-grant.proof.mjs`: 5 of 5, the real `warm.html` in a headless Chrome off every
  screen, the Worker's own handler on a scratch D1 behind it, Harmony's own link: no flask shows the address and no ask; a filled flask shows the ask in
  sight and on top; one trusted press writes the grant; the Harmony key (never on the page) then drinks from that flask (chat 200, fuel 10 -> 9.475,
  `/tank` says its grant); an ask the law does not read shows nothing.
- Rule 8 (the lane touches the mint page's folder; the film and the song untouched): `node --test app/dl-twelve.test.mjs` 21 of 21; `nice -n 19 node
  app/dl-twelve.proof.mjs --url http://127.0.0.1:8987/app/warm.html --tap button` and `--tap sphere`, served by `tools/serve-range` (206): both PASS, the sound
  came in where the picture was and the picture never went back.
- The laws: any-room 13 of 13, no-page-of-its-own 3 of 3, the-look-is-a-law 2 of 2; the-javascript-only-shrinks red at +355 until his pass.

## Not done, said

- The pour's priority fee: not in this lane (it changes the deposit's bytes on both sides; its own lane).
- Not seen: the ask after a fill made under the link (it needs a deposit on a chain); the real Harmony window opening the link; a phone.
- His: "Yes, pass +355" (the exception file is written at his word, at the lane's final bytes); the Worker's deploy and migration 0024.
- `lane/the-page-carries-her-in` (the code road) stays unhanded: this is its money half, by a grant instead of a code.

# THE PROOF FINDS ITS CHROME (lane `lane/the-proof-finds-its-chrome`, Oct 21 2026)

His words, Oct 21 2026 WEST: "Do this task here: “Fix the mint proof line the lander refuses”", the task a seat raised after handing
`lane/the-twelve-gather-on-seiya` to the lander. Rule 8's proof (`app/dl-twelve.proof.mjs`, THE SOUND NEVER RESTARTS THE PICTURE) could not
be handed as the house wrote it, and on the gate host it could not find a browser.

What failed, read on the house:

- The hand, with rule 8's proof as `tools/embertide-mesh/GREEN-LANDS-ITSELF.md` wrote it (`--proof '@embertide-app/ui/intro/dyson-society
  app/dl-twelve.proof.mjs --url {serve}/... --tap button'`): `lander: the proof app/dl-twelve.proof.mjs is not in fb2a804a8913`, exit 2.
  `parseProof` (`tools/embertide-mesh/lander/lander.mjs`) takes the script as a path from the tree root whatever `@<dir>` says; the hand's
  check (`inTree`) and the gate's runner (`lander-remote.mjs`, `path.join(TREE, argv[0])`) join it to the root.
- The proof on the gate host (guidos-MacBook-Pro-2, the new Mac, the lander's `CONF.host`): it looked only in /Applications (Google Chrome,
  Google Chrome for Testing, Chromium), and none of the three is there; the one Chrome on that Mac is Playwright's Chrome for Testing in
  `~/Library/Caches/ms-playwright/chromium-1248`. Main's proof (4092c39c1) without `--chrome`: "no Chrome on this Mac", exit 2, so a mint
  lane handed without `--chrome` would be refused at its gate.

Cost: one directory read of `~/Library/Caches/ms-playwright` when the proof starts, 0.24 ms measured; nothing else in the proof's run moves.

What changed:

- `app/dl-twelve.proof.mjs`: its Chrome is `--chrome`, else `$CHROME`, else the first of the three in /Applications (as before, first),
  else the newest Playwright Chrome for Testing (`chromium-<build>` folders, the newest build first, `chrome-mac-arm64` then `chrome-mac`;
  the headless shells skipped, they are not Chrome). Its header says so.
- `tools/embertide-mesh/GREEN-LANDS-ITSELF.md`: rule 8's proof line with the script from the tree root, why, and the quoting (`--chrome
  "<path>"` is one argument: quotes group words).

The receipt, on the new Mac (the gate host), the lane's tree served by `tools/serve-range` from its root, the gate's `{serve}` layout:

- `node --test app/dl-twelve.test.mjs`: 17 of 17 pass.
- `app/dl-twelve.proof.mjs --url http://127.0.0.1:<port>/embertide-app/ui/intro/dyson-society/app/warm.html --tap button`, and `--tap
  sphere`, with no `--chrome` and no `$CHROME`: PASS both (the sound came in where the picture was, and the picture never went back); the
  Chrome it chose: `~/Library/Caches/ms-playwright/chromium-1248/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google
  Chrome for Testing`. Main's proof, the same call: exit 2, "no Chrome on this Mac".
- The doc's corrected line read by `parseProof`: the folder `embertide-app/ui/intro/dyson-society`, the script
  `embertide-app/ui/intro/dyson-society/app/dl-twelve.proof.mjs`, in the lane's commit.
- Handed to the lander with both proofs in the corrected form and no `--chrome`: the gate itself proves the proof finds its Chrome.

Not done here: the other proofs that look only in /Applications, pin `chromium-1248` or take `--chrome` alone (`lab/twelve-dct.proof.mjs`,
`lab/rite-unit1s.proof.mjs`, the room's `*.proof.mjs`) are not rule 8's and are left as they are.

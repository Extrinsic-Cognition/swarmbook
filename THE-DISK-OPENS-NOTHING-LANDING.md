# THE DISK OPENS NOTHING: a tap on the hero's disk no longer opens the passport and its vow

His word, Oct 30 2026: "why the fuck is this appearing when i click the saint seya disk dude?". He said it over the passport dialog that a tap on the hero's disk
opened: "THE DYSON SOCIETY / THE IURAMENTUM", "Two voices. One vow.", "Selected face 145".

**The cause.** In `app/warm.js` onSelect, a hexagon of the disk opened the passport preview (`openChamber`), an Oct 14 feature.

**The fix.**
- A hexagon of the disk now opens nothing. The disk's tap is the sound's (`dl-twelve.js`, rule 8's `--tap sphere`).
- A slot of the live whitelist keeps its bid (`dl-slot.js`).
- Tags: `warm.js?v=disk-1`, `warm-entry.mjs?v=society-disk-1`.

**Still on the page, his to rule.** The dialog itself stays in `warm.html`, reachable from no tap of the disk. It carries the oath's sigil, "Custodio et
custodior", on a public page. The house's rule keeps the oath and its sigil to internal surfaces (CLAUDE.md, The iuramentum).

**Proof.**
- `node --test app/warm-disk.test.mjs`: 1/1. It reads the source: a headless page never reaches the disk's hexagons, since during the film it is the Saint
  Seiya dodecahedron, all pentagons. 49 taps on its canvas opened nothing, on main's code and on this lane alike.
- `app/*.test.mjs`: 469/472. The 3 failures also fail on main.
- Rule 8: `node --test app/dl-twelve.test.mjs` PASS; `dl-twelve.proof.mjs --url {serve} --tap button` PASS and `--tap sphere` PASS, on `tools/serve-range`.

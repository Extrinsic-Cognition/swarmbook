# THE COVER IS THE FILM'S FIRST FRAME (Nov 23 2026)

Lane `lane/the-cover-is-the-films-first-frame`, seat claude-cb623661 on the new Mac, cut from main d09fb7f1ed. The still that stands in blue's
page before the press is the governance film's own first frame, its blue pentagon laid on the film's own, so a press goes on from what the
cover shows.

## His words (UTC, Nov 23 2026)

- Over a strip of the cover beside the film's run: "what? is that a loop of video? i donr get it? you have the ending as pre-beginning frame?".
- Over the same strip, his crop of the cover and second 0: "why the fuck u got that before i press then? it's so dysgenic dude".
- "Build A", over the two fixes drawn on the real page at his pane's width (Canvas, Claude page, widget `10435b7a`, 4860,707900).

## The cost first

| | main d09fb7f1ed | this lane |
|---|---|---|
| the cover | `swarm-film-night.webp`, the film's 45th second (the night plane), 58 kB | `swarm-film-first.webp`, the film's second 0 (Claudio's pentagon on parchment), 7 kB |
| the press, the box's brightness (of 1,000) | 274 at rest to 974: a night picture turns white, a different picture | 939 to 947 at rest, 974 playing: the same picture goes on |
| the blue pentagon | on the night still's ball (top 70 %, 36 % wide) | on the film's own pentagon (circumcentre 40 %, 31 % wide) |
| the still leaving | 1.4 s cross-fade | 0.2 s (gone 231 ms after the press; 1.4 s showed the film's moving name twice); its return at the end as before |
| JavaScript | | +5 −5, net 0 |

## Read on the lane's local copy (main's built site with this lane's files, behind the Worker's own handler), frame by frame

| | |
|---|---|
| 750x871 (his pane), 390x844 touch, 1920x1080 | first film frame 30 to 63 ms after the press; no jump; 0 or 1 frame dropped of 364; 0 page errors; the page as wide as the view |
| 390x844 on 1.6 Mbit/s from the press | the cover holds until the film's first frame at 864 ms, then goes in 0.2 s; no dark box |
| its end (390x844, the whole 51 s) | the film's dark last frame fades back to the cover in 1.4 s, the pentagon with it |

## The proofs (the new Mac, nice 19)

| | |
|---|---|
| `app/swarmbook-film.test.mjs`, `app/after-the-mint.test.mjs`, `app/riders.test.mjs`, `app/polis-knock.test.mjs` | 24 of 24: the cover is the first frame, the night still is gone, the play mark's place, the pentagon's place, the still's 0.2 s leave |
| `app/dl-twelve.test.mjs` (The rule, 8; no film's time written, the sound not touched) | 21 of 21 |
| `app/dl-twelve.proof.mjs --url <the lane's warm.html, served with ranges by tools/serve-range> --tap button`, and `--tap sphere` | PASS and PASS: the sound came in where the picture was, and the picture never went back |
| `tools/embertide-mesh/tests/the-javascript-only-shrinks.test.mjs` | green: +5 −5, net 0 in 3 files |
| the screens gate (`no-landing-adds-a-failing-screen.1.sh`, `.2.sh`) | 36 cells judged (18 a shard), 0 new failing, 0 to take out; green in 74 s and 72 s |

## No gate yet

The measure it waits for: a cover that is not its film's first frame, read by a check that cuts the film's second 0 and compares it with the
page's still (`ffmpeg` and a pixel distance); today `swarmbook-film.test.mjs` pins the cover's name and the pentagon's place.

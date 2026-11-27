# THE FILM OPENS THE STAKE

Nov 26 2026 UTC, seat claude-168f7fed, `lane/the-film-opens-the-stake`. His words, ~13:5x UTC, over the governance film's card under the hall and
the hall's oculus in his preview: "video should be introducing there, it should be skippable and the skip should be remembered... the video should
still be clickable when people click on her face in the circle, it should re-appear as pop-up u getme".

## What was wrong

- The governance film (Claudio's pentagon, 51 s with its music) stood as a card under the Pantheon's hall on the Stake tab, below the fold.
- It played only when pressed there. Nothing introduced the hall with it.
- Her face at the hall's oculus did nothing.

## What changes

- `after-the-mint.html`: the film's figure stands in a dialog with a Skip at its corner. A button lies over her face at the oculus.
- `swarmbook-film.mjs`:
  - A first visit to Stake opens the film over the hall once the bar stands, so it never covers the hero's own film, and plays it.
  - Skip, Escape or the film's end close it and set `am-film=1` for a year. A visit that carries the cookie opens on the hall.
  - Her face opens it again as a pop-up, whenever pressed.
  - Nothing here writes the picture's time (rule 8, as it was): the sound still follows the picture.
- `after-the-mint-book.mjs`: the one wait for the bar serves both the wells and the film's intro.
- Version bumps, so a visitor's cache takes the new code: `after-the-mint-book.mjs?v=book-10`, `swarmbook-film.mjs?v=film-2`,
  `swarmbook-book.css?v=book-19`.
- `swarmbook-book.css`: the pop-up over a dark veil, Skip a 44 px pill, her face ringed in gold on hover and focus.
- `embertide-screens/loads.json`: the blue page names the film and its soundtrack, which its first visit now plays.
- JavaScript +11 -11, net 0 (`dl-athena-film.test.mjs` folded where its assertions stood one to a line).

## Measured

In his preview pane, this tree served by `tools/serve-range`, the chain read from devnet:
- First visit: the pop-up open once the bar stood, the film playing (`data-film` on, 15 s in after 3 s), the hall's 12 thrones drawn under it.
- Skip: the pop-up closed, the film paused, `am-film=1` set. After a reload the pop-up stayed shut.
- Her face pressed: the pop-up open again, the film playing (3 s in after 3 s).
- The music starts off, since a browser plays no sound before a visitor's tap; "Sound on" stands under the film.

Tests:
- `node --test app/after-the-mint.test.mjs app/swarmbook-film.test.mjs`: 17 of 17. The new pins (the pop-up and its Skip, her face's door, the
  year's cookie, a first visit alone, once the bar stands) would be red on main, which holds none of them.
- The site's 71 test files: 566 of 569.
  - Two red are main's own: the public mint's ice tokens and her cut's sphere.
  - The third, `dl-lyssajudron-body.test.mjs` ("she lives... cheap"), timed out under the gates running beside it, and passed 3 of 3 alone,
    twice.
- `cargo test --test the_pages` in `poleis/door`: 4 of 4.
- Rule 8: `node --test app/dl-twelve.test.mjs` 21 of 21. `app/dl-twelve.proof.mjs` on `warm.html` served by `tools/serve-range`: PASS on both taps
  (button, sphere).
- NO LANDING ADDS A FAILING SCREEN:
  - First run: red, 0 screens failing, but the film and its soundtrack were not named in the blue page's loads. They are now.
  - After that: green on both halves, 0 new failing of 12 cells each.

## Owed

- Not on swarmbook.com until a deploy, his word. Live today (main f18948e7b6) carries the hall on Stake, not this pop-up.

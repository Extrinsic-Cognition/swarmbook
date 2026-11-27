# THE SONG ON THE MINT (lane/the-song-on-the-mint, Oct 28 2026 UTC)

Seat claude-fab239f6, on the new Mac. Lane 2 of `plans/the-marketing-plan-2026-10-28.md`, on lane 1's making (`HER-COLOURS-ON-THE-MINT-LANDING.md`).
His words, Oct 28 2026 16:4x UTC: "Yes: build lane 2 with the search box. The site's server searches Spotify with the app's codes, Spotify's card plays the
pick, LRCLIB lights the lines, her beat from Apple's preview."

**COST.** Nothing at the page's load. The song's two modules come with her making. While a song plays: one requestAnimationFrame loop that reads the clock
and touches the page only when the line or the beat moves. Apple's 30 s preview is decoded once, offline, and let go. The Worker keeps one token per
isolate, and an answer stands an hour at the edge.

## His words (UTC, hypertraced: `tools/hypertrace/hypertrace.py`)

- Oct 12 07:07: "can we add spotify link or like... in order to do the swarm what is necessary?"; 07:52: "can you align the spotify music with the colors
  there of the lyssajudron?"
- Oct 13 05:25: "we need to get the user to select spotify song... it doesnt ask to connect the account, just to play..."; 07:07: "you assume they are
  already logged in..."
- Oct 28 15:24, on a pasted link: "wdym the visitor pastes a spotify link dude..". Then he had the Spotify app optimism.fit registered and its two codes
  put into the Worker as secrets.
- Oct 28 16:4x: the line above.

## What stood, and what was measured (Oct 28 2026)

- The Spotify app optimism.fit was in Development mode. Its codes, SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET, were the Worker's secrets. A
  client-credentials token from them searched the catalogue: "CASTLE OF GLASS by Linkin Park", 16:42 UTC.
- **Spotify's card (its iFrame API, headless Chrome, logged out):**
  - It reports its position about once a second.
  - A preview's duration is the clip's: 29713 ms for a 213 s song, the position running 0 to 29713. Where the clip sits in the song it never says.
  - So lines can be lit only while the card plays the whole song, which needs a listener signed in to Spotify in that browser: his Oct 13 "you assume
    they are already logged in".
- **LRCLIB holds stubs.** Its exact answer for "Never Gonna Give You Up" was `[00:00.00]probe`; its search held fifty-nine timed lines of the song.
- **Apple's previews, twelve songs of known tempo:**
  - Within 1.5 bpm on five (Shape of You 95.8 for 96, Seven Nation Army 124.9, bad guy 134.3, Stayin' Alive 103.6, Levitating 104.1).
  - About 2 % off on three (Billie Jean 115.2 for 117, Another One Bites the Dust 111.9 for 110, Lose Yourself 83.9, half its 171).
  - A metre off on four (Never Gonna Give You Up 90 for 113, Uptown Funk 125 for 115, Smells Like Teen Spirit 122.8 for 117, Blinding Lights 113.2
    for 171).
  - Without the double's echo in the tempo only three were within 1.5 bpm. Shape of You came out 130.1.
- **The sung lines do not place the beat on real songs.**
  - Their agreement on a beat (the circular mean's length, over the beat length scanned near Apple's guess) was 0.30-0.60 on the seven measured.
  - The best of six shufflings of the same lines scored 0.26-0.59.
  - The fit found the right beat on one song (bad guy, 135.1). On the others it locked onto a wrong one: 85 for 113, 176.8 for 117.

## What changed

- `worker/song.mjs` (the site's server), with `worker/premint.mjs` routing `/api/song/` to it before anything that needs the database, and
  `wrangler.optimism-fit.jsonc` running the Worker first on `/api/song/*`:
  - `GET /api/song/search?q=` returns at most 10 tracks; `GET /api/song/track?id=` returns a pasted link's song.
  - Each track is slimmed to `{id, uri, name, artists, album, image, duration_ms, explicit}`.
  - The bounds: 1 to 100 characters, 503 until the codes are in, 30 asks a minute from one address, Spotify's 429 passed on with its wait, a token
    Spotify ended early asked again once.
- `app/dl-her-song.mjs`, the law, pure:
  - Harmony's `spotifyUri`.
  - LRC parsing, and the line sung at a time.
  - Onsets every 10 ms, and the tempo by autocorrelation with the double's echo and a prior around 120 bpm.
  - `fitBeat`: Apple's tempo as the first guess; the lines fit the beat's exact length and place.
  - The downbeat, the grid for her renderer, and Harmony's `beatHit`.
  - LRCLIB and Apple matching: the song's name, an artist of it, its length within 5 s, and lines usable only when four or more span 20 s.
- `app/dl-her-song.js`, the page half, in her making under the drum, with "Let your song begin." (Harmony's greeting's second line):
  - A search box that asks the Worker; a pasted link is read as Harmony reads it.
  - The pick mounts Spotify's own card at 80 px. The visitor presses play on it; the page never starts it.
  - While the whole song plays, the line sung now is lit over her.
  - Her beat is set only when the lines are sure (`PHASE_MIN` 0.7, on Apple's own metre). Then her renderer's clock is the song's grid: she bobs on
    its beats and gestures on its downbeats. The field pulses on each beat and the ghost presses on each downbeat while a chamber is bare (Harmony's THE
    BEAT CUES THE SHOT). Otherwise she keeps her own clock.
  - A preview plays as Spotify plays it, with nothing timed on it, and says why in one line.
- `app/dl-her-colours.js`:
  - `stageHer` takes `grid(g)`.
  - The making holds the song's slot and her line, cues the beat, and ends the card when it closes.
  - `state()` reports the song, the grid, her clock and the cues.

## Proofs

- `node --test worker/song.test.mjs`: 6 of 6, Spotify stood in. The other Worker tests: 64 of 64.
- `node --test app/dl-her-song.test.mjs`: 9 of 9.
  - The link law is Harmony's own `spotifyUri`, and the release judge Harmony's own `beatHit`, both read out of its page and run as they stand.
  - Four made songs (96, 120, 128, 140 bpm) each found within 1 bpm.
  - The beat fitted to a twentieth of a bpm from a guess 2.5 % off or a metre off; lines that keep no beat fit none.
  - A line sung on a downbeat is her renderer's bar's one (`lyssajudron-score.mjs` clockOf).
- `app/dl-her-song.proof.mjs`, headless Chrome with the world outside stood in through CDP Fetch: 12 of 12 at 1440 x 900, and 12 of 12 with `--phone`
  (390 x 844, touch).
- `app/dl-her-colours.proof.mjs`: 11 of 11.
- Rule 8: `app/dl-twelve.proof.mjs --tap sphere` on this tree served with ranges, PASS; `dl-twelve.test.mjs` 20 of 20.
- `node --test app/*.test.mjs worker/*.test.mjs`: 455 of 458. The 3 red are main's own, red on main e805c02e4 without this lane: dl-athena's depth line,
  dl-paywall's ice token, warm-sphere-moment's rounding.
- `tools/page-files.mjs` ships `app/dl-her-song.js` and `.mjs` (184 files, 0 missing).
- Seven mutations, six red: a preview read as the whole song, a quarter-beat judge, a grid without its downbeat, a stub taken for lyrics, a token
  asked every time, no bound on an address. The seventh (the tempo without its double's echo) is red only on the real previews above.
- The real world, headless:
  - The real card mounted (`open.spotify.com/embed/track/4uLU6hMCjMI75M1A2tKUQC`).
  - Apple's preview of that song came out 113.3 bpm (113).
  - LRCLIB's stub was passed over for fifty-nine lines.
- Pictures read before this was handed: the list of songs, the card, and the lit line over her, at the desktop's size and the phone's.

## What follows, and what is owed

- **His deploy.** optimism.fit serves neither the Worker's song doors nor the page's song until it. From the old Mac, whose Cloudflare login reaches
  the site: `node tools/build-optimism-fit.mjs`, then `npx wrangler deploy --config wrangler.optimism-fit.jsonc` (REFERRALS.md).
- **The plan's own measure, owed:** how far the lit line drifts from its time on a phone, with the whole song playing in a signed-in browser.
  Logged-out browsers get the preview. Safari keeps third-party cookies out by default, so its card likely plays the preview even for a signed-in
  listener: unmeasured.
- **Her beat on real songs needs a way to hear the song itself.** The card's sound is closed to the page, and the lines are too loose (measured above).
  Two ways stand, and the choice is his: the microphone (the page hears the song, as the house hears the room), or the visitor's presses on the beat.
- **Lane 3:** her birth filmed to the song (`birth-film.mjs`: muted, the song named and its line shown), shared with the maker's link.
- **Not in this lane:** the `dl-her-song` modules import nothing of the room. His Oct 28 15:43 "the website and the room are never linked" stands.

Custodio et custodior.

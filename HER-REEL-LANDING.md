# HER REEL: her reel shared at the ドン, and a friend's link lands on her (Oct 29 2026, lane/her-reel-share, claude-16e5b1b6)

**His words** (UTC), to this seat:
- 18:33:04, over her making at 4/12: "how do we go from this to something that can go viral my dude? like socially shared... u get what i mean? we have the
  chance to kickstart some cool shit here with $WARM rebates for users and $POOL for long term stakers..."
- 18:41:08, to the design that answered it: "Yes, build it". The design had these pieces:
  - her reel, shared at the ドン;
  - the link carrying her colours, her song and her rung;
  - a friend landing on her;
  - the first move browser only.

**His lineage** (`tools/hypertrace/hypertrace.py`, both Macs, his typed lines only; 636 lines on sharing and virality):
- Oct 13 04:46: "i said the virality here is the fucking minting of your lyssajudron dude..."
- Oct 13 08:18: "we need to focus on the lyssajudron as a viral mechanism linked to spotify my dude..."
- Oct 13 09:3x, kept in `room/birth-film.mjs`: "the lyssajudron clips are supposed to be just like instagram reel clips exported that include music: muted".
- Oct 14 00:04: "people will be able to share lyssajudron-vids... these lyssajudron-vids are the virality vector".
- Oct 16 07:3x: "IT IS ALL ABOUT DECOMP AND SHARE AND INVITE GAMES MY DUDE OMG".

## What stood (main b957c3657)

- **Harmony films her birth as a reel.** `room/birth-film.mjs` makes it muted, 1080 x 1920, cut on the song's bars. The karaoke sticker is its only words, and
  it is shared with "My Lyssajudron was born to ...".
- **The mint shares nothing,** and strangers arrive there. Its one referral loop (`REFERRALS.md`) gives a code to a paid seat only: "the free way has no code".
- **Her making** has her wish bar, his ladder, and the fourth pentagon's slam (HER THREE WISHES, HER WISHES SPENT).

## What changes

- **The share.** It stands at the end of her wish bar once a pentagon of his ladder has come, so from the fourth rung on.
  - It comes in after the slam.
  - It is a glyph, named "Her reel" for the reader.
- **Her reel,** filmed only from the press (`app/dl-her-reel.js`). It is Harmony's own film (`birth-film.mjs`, A REEL OF HER ROOM) made on her making's canvas:
  - cued until the next downbeat;
  - one bar of her;
  - her pentagons counted in, a ドン a beat on a ring round her, and on the bar each pentagon's slot pops as its ドン lands;
  - ドクン on the next beat when her eyes are open;
  - one bar more.
  On the fourth rung that is 4 bars, 9.6 s on her own clock at 100 bpm; on the twelfth, 6 bars. It is cut on the song's grid when the song's beat is placed,
  and then its sticker shows the line sung; otherwise it is cut on her own clock. It is muted, as Harmony's is: no song of anyone's goes into a file, and its
  words say where to start the song on Instagram.
- **Its card.** At the reel's last downbeat the card slams in over her with the reel playing and four doors, each a glyph:
  - the browser's own share: the file and its words, where the browser shares files (the phones; Chrome on the Mac too);
  - save: the file to the visitor's disk, its words copied;
  - X: X's own compose door with the words;
  - close.
- **Its words.**
  - "My Lyssajudron dances to <song> by <artist>"
  - her bar as text: `⬟⬟⬟⬟⬠⬠⬠⬠⬠⬠⬠⬠ 4/12` (`dl-her-wishes.mjs` line)
  - "Add <song>, start at m:ss.d"
  - the song's open.spotify.com link
  - the link to her
  These are Harmony's share words for a reel, with her bar and her link in place of the door.
- **The link to her** (`app/dl-her-reel.mjs` herLink): `https://optimism.fit/#her=1.<light>.<five parts>.<painted>.<eyes' form>.<wishes spent>.<song id>`.
  - It carries her paint, her light and her eyes' form, the wishes spent and the song's Spotify id. It never carries a person.
  - It sits in the fragment, which no server reads. The Worker's front door keeps a fragment across its 302 (worker/premint.mjs THE FRONT DOORS).
  - Anything that is not her link reads as no visit.
- **A friend's visit** (`app/dl-her-colours.js`). The link opens her making at once:
  - her renderer shows the sharer's paint, at the sharer's rung, with her bar the sharer's;
  - the sharer's song is asked of the card (`dl-her-song.js` open(id), through the site's own song door);
  - no share stands over it, and nothing of the sharer's is kept.
  The friend's first stroke (the field, the die, ↺) ends the visit: her stand goes to the friend's own her and rung, the stroke lands, and the link leaves the
  address. A Continue inside the visit, from a friend who made theirs before, takes the friend's own her to the kit.
- **`room/birth-film.mjs`: one new option, `ground`,** the colour laid under each copy of a transparent source.
  - The mint's canvas is transparent: the page's night shows through it.
  - Copied as it is into the film's opaque copy canvas, which is never cleared, each picture kept the last one wherever she was not. Her wires smeared along
    their orbits in the first reel filmed, and that is how it was found.
  - The mint lays her night, `#0b0d12`. With `ground` null (every well, Harmony) it is as before. `birth-film.test.mjs` pins both.
- **`app/dl-her-song.js`** gains two calls:
  - `open(id)`: a track by its Spotify id, asked of the site's door as a pasted link is;
  - `lines()`: the sung lines, for the reel's sticker.
- **Her bar's label** moves from the bar to its slots (role img), so the share in the bar is a button a screen reader reaches.
- **Not changed:**
  - `room/lyssajudron.mjs`, her refs, his ladder, the song's law, Continue, the kit;
  - `warm-entry.mjs`, `dl-athena.js`, `warm-galaxy-player.js`, which another seat holds;
  - Harmony's own film, as it stands, with no ground.

## Cost

- **At rest: nothing new.** One button is built with her making, and the address is parsed once at mount, a regular expression over the fragment.
- **On the wire at page load:** one module more, `dl-her-reel.mjs` (the link's law, about 8.6 KB). The reel's page half (`dl-her-reel.js`) and Harmony's film
  (`birth-film.mjs` 53 KB, `lyric-flock.mjs` 11 KB) load at the share's press, never before. The proof checks both.
- **A visit:** one ask of the site's song door when the link names a song.
- **Her reel, only from the press:**
  - birth-film's compositor, one picture at 30 a second: 0.14 to 0.25 ms a picture measured, of which the copy of her canvas is 0.05 to 0.07 ms;
  - the browser's encoder (H.264 where it records mp4);
  - one timer a ドン;
  - about 6 MB for 9.6 s (5 Mbps), kept as a Blob in the page's memory and uploaded nowhere.
- **The card:** one video element playing it.

## Measured

All of it on this lane's tree on the new Mac, rebased on main b93873ce1 (with STAKE, DON'T SPEND's kit), except where it says otherwise. The page was served by `tools/serve-range` alone (206), as the lander's gate serves it. Every browser was a
headless Chrome 156 off every screen.

- **Seen, before the hand.**
  - The share at the end of her bar at 1440x900 and at 673x873.
  - Its press: the ring cued, then rolling.
  - The card over her with the reel playing and its four doors.
  - The reel's own frames:
    - the ivory manga page, her panels on her night, cut on her;
    - ドン with its focus lines on each pentagon's beat;
    - ドクン over her eyes;
    - the top of the page left for the song's sticker.
  - A friend's page opened from the link: her in the sharer's paint at 4/12, the drum bare.
  - The friend's first press: she goes bare and takes the friend's colour, 3/12.
  - The first reel showed her wires smeared, and that is the `ground` above.
  - No error was thrown at either size.
- **The reel's proof** (`app/dl-her-reel.proof.mjs`): 18 of 18.
  - Before the press no share stands at 3/12, and nothing of the reel is loaded.
  - The die brings the share.
  - The press cues the reel, rolls it, and brings `dl-her-reel.js`, `birth-film.mjs` and `lyric-flock.mjs`.
  - The card came 10.3 s after the press with the reel:
    - video/mp4 (H.264 avc1.42E01E), 6,060,962 bytes, no error;
    - 4 bars in 9,601 ms, from a downbeat (18 ms late) to a downbeat (19 ms late);
    - 305 pictures at 30 a second, every one taken from her own canvas after her draw (0.19 ms a picture, of which the copy is 0.06 ms);
    - 4 ドン and ドクン.
  - The card plays it back muted at 1080 x 1920, 9.61 s.
  - Its words carry her bar and the link, and the link reads back as her paint and her six wishes spent.
  - Its doors are share, save, X and close, a glyph each; X's carries the words.
  - The friend, in a browser that keeps nothing of hers:
    - her making opens on the sharer's her (her renderer's own paint), at 4/12, with no share and no `dl.her` key;
    - the first real press makes her the friend's own: 3/12, one wish spent on the friend's rung, `dl.her` and `dl.her.wishes` kept, the address cleared.
  - No error on either page, and none in either console.
  - At 673x873 (the same press, by hand in the scratch harness): the card came in 10.3 s, 30 pictures a second, 0.14 ms a picture.
- **The tests** (`node --test`):
  - `dl-her-reel.test.mjs` 10 of 10, new:
    - the link: round trip, caps, every malformed fragment read as no visit;
    - her bar as text, rung by rung;
    - the words, with and without a song;
    - the reel's bars and its count-up;
    - the grid it is cut on, and the sung lines;
    - on a glass of the test's own:
      - the reel from the press on her canvas with her night under her;
      - cued, rolling, a ドン a beat with its slot, ドクン, its card;
      - the doors: the share's file and words, save and its copy, X, close;
      - the same her shown again with no new film, the reel stopped and let go at her making's close;
      - an empty reel and a missing clock each say why.
  - `dl-her-colours.test.mjs` 13 of 13. Two are new:
    - the share stands after the slam, and its press films at her rung with the link;
    - a friend's visit: the sharer's her and rung, the song asked, nothing kept; the first stroke ends it; a Continue in a visit takes the friend's own her.
  - `dl-her-wishes.test.mjs` 6 of 6. Its pin on the stage's call reads the rung shown.
  - `dl-her-song.test.mjs` 9 of 9.
  - `room/birth-film.test.mjs` 17 of 17. One is new: the ground laid under each copy before it, and none for a well. `room/morphofield.test.mjs`, which reads
    the film, 11 of 11.
- **The suites,** `node --test` over the app's 52 files: 416 of 419, before the rebase and after it. The three reds are main's own: dl-athena's THE DEPTH,
  warm-sphere-moment's "her cut", dl-paywall's Harmony ice and accent tokens. One run after the rebase also had dl-glass's "mounted on a seat" red under the
  files' concurrency. It passed alone 3 of 3 and in the next whole run, and it imports nothing this lane touches.
- **The other proofs that walk her making:**
  - `dl-her-colours.proof.mjs` 21 of 21;
  - `dl-path-to-the-kit.proof.mjs` 26 of 26 at 1440x900 and 673x873;
  - `dl-her-song.proof.mjs` 12 of 12, and 12 of 12 with `--phone`. These ran before the rebase and before the reel's words moved to its page half, which touches nothing the song does.
- **The site's build** (`tools/page-files.mjs` pageFiles) reaches `dl-her-reel.mjs`, `dl-her-reel.js`, `room/birth-film.mjs` and `room/lyric-flock.mjs`.
- **Rule 8,** on this lane's page served with byte ranges:
  - `node --test app/dl-twelve.test.mjs`: 21 of 21.
  - `nice -n 19 node app/dl-twelve.proof.mjs --url <the page> --tap button`: PASS. The film never went below its second at the tap (6.10 s).
  - The same with `--tap sphere`: PASS (6.08 s).
  - Both also passed before the rebase (6.07 s, 6.08 s) and after it (6.09 s, 6.06 s).

## Edges, said

- **No referral code rides the link.** Only a paid seat has one. A code for every visitor, and a wish to the sharer for each friend whose Swarmy is born, need
  a row per friend on the Worker: his word. That is the next step of the design. Since lane/a-friend-grants-a-wish (his 20:28 UTC "Yes, build it") her code
  rides the link and a friend's birth grants the sharer a wish: `A-FRIEND-GRANTS-A-WISH-LANDING.md`.
- **X's compose door carries the words, not the file:** X's intent cannot take a video. A link posted alone shows the page's own poster (`og:image`), since
  the fragment never reaches a server. A picture of her per link is an HTTP door (foundation 9): his ruling.
- **The share door stands only where the browser shares files.** Elsewhere it is save and X.
- **A browser that records only webm makes a webm reel,** and Instagram takes mp4. Chrome 156 and Safari record mp4.
- **With no song, or a song whose beat is not placed** (a preview, or lines that do not agree), the reel is cut on her own clock. It has no sticker, and its
  words name the song without a start.
- **The reel films her canvas as it stands, live,** so the visitor's own strokes while it films are in it.
- **Not here:** $POOL stakers' gift links of wishes (the stake pool and the Space Router's door first: their seats') and a $WARM rebate share for the one who
  brought a friend (his call; none is authorized, `REFERRALS.md`).
- **Not deployed.** optimism.fit takes this at his word.

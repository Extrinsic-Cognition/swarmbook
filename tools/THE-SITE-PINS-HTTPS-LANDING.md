# THE SITE PINS HTTPS (Nov 20 2026, lane/the-site-pins-https, seat claude-62e500da)

## His words

- Nov 20 2026 17:57:10 UTC: "Yes, cut it", to "Cut the public site's missing security headers next?" (from the Nest's audit of that day:
  its medium on the public pages).
- The law this lane yields to, his, Oct 17 2026 18:38 WEST: "put on lysa for now the live updated page of the mint of the dyson society
  optimism.fit please" (`THE-JOURNEY-GATE.md` 5d, HIS PAGE OF THE WEB STANDS ON THE GLASS HE NAMES).

## The cost

- Two header lines more on every file the site answers: about 150 bytes a response. Nothing runs anywhere.
- No Worker change, no migration, no page file changed.
- JavaScript net 0: `tools/build-optimism-fit.mjs` 1 changed line, `tools/site-files.test.mjs` 1 (the pins ride an existing line).

## What was so (live, read Nov 20 17:58 UTC)

- A page and a module answered with `X-Content-Type-Options: nosniff` and `Referrer-Policy: strict-origin-when-cross-origin` and nothing
  more: no HSTS, no content policy.
- Both names answer over plain http: `http://swarmbook.com/app/warm.html` 200, and `http://optimism.fit/` a 302 that stays on http.
- The Worker's own answers (the doors' JSON) carry nosniff. The Worker makes no HTML itself.

## What stands now

The build's `_headers`, on every file the site serves:

- `Strict-Transport-Security: max-age=31536000` (this host only; no subdomains, no preload).
- `Content-Security-Policy: base-uri 'self'; object-src 'none'; form-action 'self'`. None of the 17 pages has a base tag, an object, an
  embed or a form that posts to another site.

The films the Worker answers from the bucket take the site's header lines as before (`worker/ranges.mjs`), these two with them.

## What is left out, and why

- **Who may frame a page** (`X-Frame-Options`, `frame-ancestors`). His glasses frame a page of the web by its public name (5d), from a
  rite that stands on a LAN address; no policy of a public site can name every house. Tried on the bare browser: under
  `X-Frame-Options: SAMEORIGIN` and `frame-ancestors 'self'`, a page of another origin that frames the mint page is told "Framing ...
  violates the following Content Security Policy directive: \"frame-ancestors 'self'\". The request has been blocked."; under this lane's
  headers it loads. What a frame could do to a visitor here is small: a page framed by another site is given a storage of its own by
  today's browsers, so the visitor's flask is not in it, and X and Stripe refuse frames themselves. The test pins that no header line
  names a frame rule, so that no seat adds one without his word.
- **`upgrade-insecure-requests`.** The pages ask the visitor's own Nest on `http://127.0.0.1` (`app/dl-glass.mjs`,
  `app/tracenet-appearance.mjs`, `app/tracenet-fuel.mjs`, `app/harmony-link.mjs`, `app/warm-ceremony.js`): it would turn those asks into
  https and break them.
- **A policy on scripts.** Owed, a lane of its own. Read for it: 17 pages; inline scripts on 11 of them (import maps, classic and module
  scripts), no inline handler, no `javascript:` link; three pages and two modules take web3.js and tweetnacl from `cdn.jsdelivr.net` at
  pinned versions (the same two stand in `app/vendor/`); six room modules and one app module evaluate strings; the painter's frame runs
  Reactor's kit against hosts not read yet. It needs each page's inline scripts named by hash at the build, the CDN pair served from here,
  the evaluators read, and the painter's hosts named.
- **The Worker's own answers.** Unchanged: HSTS is a host's memory and the pages set it.
- **Plain http.** `_headers` cannot redirect, and the Worker never sees a file's request. The cure is the zone's "Always Use HTTPS" at
  Cloudflare, on both names: his press.

## The proof

A stand-in host on the new Mac: a small proxy that lays a `_headers` file's rules on each answer as Cloudflare's static assets do (every
rule whose path matches, in file order; a header said twice joined with a comma; `! Name` takes one off), in front of the built site served
with byte ranges. A headless Chrome off every screen; every write stood in.

- The `_headers` the build writes from this lane differs from main's by these two lines only.
- 17 of 17 pages load with nothing blocked and nothing refused.
- The control: on a page of the site, a base tag that points elsewhere, an object, and a form that posts to another origin are each named
  by the policy (`base-uri`, `object-src`, `form-action`). Under main's headers the same form simply leaves the page.
- A page of another origin frames the mint page: it loads.
- The painter's own frame (this site's page with no origin) loads and says ready.
- The stations under these headers, no page error in any: the front with its chamber, the split at 1440 and 390, the egg's call; a filled
  flask with no X through her making to its plate, Connect X, X's road back, the claim; the plate at 390; X refusing; a flask that has not
  paid, at the door.
- A film's byte range passes through the stand-in host (206).

## The tests

On the new Mac at nice 19, in a scratch worktree at this lane's first commit (the receipt alone came after):

| Suite | Result |
|---|---|
| `tools/*.test.mjs` (the mint folder's) | 105 of 107 (1 red, main's own; 1 skipped); `site-files.test.mjs` alone 4 of 4 |
| `worker/*.test.mjs` | 150 of 150 |
| `app/*.test.mjs` | 537 of 541 (4 red, main's own) |
| The law gates (the JavaScript only shrinks, any room, the look, the law is the gate, no page of its own, the pixel is a lookup) | 59 of 59 |

The red ones are main's own, the same as on the two lanes before this one that day.

## Not done, said plainly

- **Not live.** The headers change at his publish press. After it the press reads both headers off both names.
- **Plain http still answers** until "Always Use HTTPS" is on at Cloudflare for swarmbook.com and optimism.fit.
- **No frame protection**, by his law 5d.
- **No script policy**: the one control that would stop an injected script is the lane named above.
- **HSTS is a promise for a year.** Once a browser has seen it, that browser refuses plain http on that name until it lapses. Both names are
  served over https by Cloudflare; nothing of the house uses them over http.
- **The painter was not run.** Its frame loads under these headers; a painting needs a real pass.

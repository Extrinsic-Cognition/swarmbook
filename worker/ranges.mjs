// ranges.mjs · THE FILMS FROM R2 (Oct 28 2026, lane/the-films-from-r2), after THE FILMS ANSWER RANGES (worker/THE-FILMS-ANSWER-RANGES-LANDING.md).
// On optimism.fit the platform's assets answer a range of a film with the whole file, so a browser held the film unseekable and "Skip to the
// mint" (app/dl-twelve.js) did nothing. A range cut in the Worker's JS (every chunk of the film through a TransformStream) answered short
// checks and then, live, cut every open range short (the Worker's CPU limit in production): a film stalled seconds in, and was rolled back. His
// pick, Oct 28 14:1x WET: "put the films and songs in R2, have the Worker answer their ranges with R2's native ranged read, prove the skip seeks
// live without cutting any film short, and hand it". So a film or song lives in the bucket at media/<its path> (tools/media-to-r2.mjs puts it
// there), and the Worker hands R2 the range: R2 cuts the bytes itself and its body passes through untouched, no byte of it through JS. What the
// bucket does not hold is the assets' answer, whole, as before.
//
// THE FILM BY ITS BYTES (Oct 28 2026, lane/the-film-by-its-bytes; his 14:3x WET: "Yes: guard it so a re-cut film never plays its old copy from
// R2, prove it live, and hand it"). A film lived at media/<its path>: re-cut under its old name and deployed without the put, the bucket still
// answered with the old cut (the page's ?v= never reached the key). Now a film lives at media/<the sha256 of its bytes>.<ext>, the build names the
// bytes of every film it ships (MEDIA_BYTES, beside the films), and the door asks the bucket only for the bytes the deployed build names: a re-cut
// film is a key the bucket does not hold until its put, so the assets serve the new cut whole, and no old copy is ever asked for.
//
// THE FILMS KEEP THE SITE'S HEADERS (Oct 28 2026, lane/the-films-keep-the-sites-headers; his 15:2x WET: "Yes: make the films served from R2 carry
// the same headers the site gives them (cache, noindex on the submission videos, nosniff), prove it live, and hand it"). The site's _headers lines
// are the assets': an answer the Worker makes from R2 had none of them, so since 14:15Z the submission's videos had lost their noindex and their
// short cache (they took the object's year-long one) and every film its nosniff. Now R2's answer carries the headers the site gives that film
// (the assets' own answer to a HEAD, read once per film by the door), and only the headers its bytes decide (length, range, ETag) are its own.

/** The films and songs, and Harmony's installer (A STRANGER DOWNLOADS HARMONY, Nov 23 2026): what reaches the Worker first (wrangler.optimism-fit.jsonc run_worker_first) and what lives in the bucket. */
export const MEDIA = /\.(mp4|m4a|mp3|webm|dmg)$/i;
/** Where they live in the bucket, beside the creators' vault/<handle>/... (worker/creators.mjs): by their bytes, so a new cut is a new key. */
export const MEDIA_PREFIX = 'media/';
export const mediaKey = (sha256, pathname) => `${MEDIA_PREFIX}${sha256}.${String(pathname).split('.').pop().toLowerCase()}`;
/** The bytes of every film and song the build ships, served beside them: {pathname: {sha256, size}} (tools/build-optimism-fit.mjs writes it). */
export const MEDIA_BYTES = '/media-bytes.json';
const SHA256 = /^[0-9a-f]{64}$/;
/** The headers the bytes themselves decide, set from R2's answer: never taken from the site's. */
const BYTES_HEADERS = new Set(['content-length', 'content-range', 'content-encoding', 'transfer-encoding', 'etag', 'last-modified', 'accept-ranges']);
/** Their types and their cache, as tools/media-to-r2.mjs writes them on the object (the _headers line of the films: a new cut is a new URL). */
export const MEDIA_TYPES = Object.freeze({ mp4: 'video/mp4', m4a: 'audio/mp4', mp3: 'audio/mpeg', webm: 'video/webm', dmg: 'application/x-apple-diskimage' });
export const MEDIA_CACHE = 'public, max-age=31536000, immutable';

/** parseRange(header, size): the one byte range a Range header asks of `size` bytes, {start, end} inclusive; 'unsatisfiable' when it starts past
 *  the end; null when there is none, it is not bytes, it names several ranges (the whole answer is allowed then, RFC 9110 §14.2) or it is malformed. */
export function parseRange(header, size) {
  const m = /^bytes=(\d*)-(\d*)$/.exec(String(header ?? '').trim());
  if (!m || (m[1] === '' && m[2] === '') || !(size >= 0)) return null;
  if (m[1] === '') {   // the last n bytes
    const n = Number(m[2]); if (!(n > 0)) return 'unsatisfiable';
    return size === 0 ? 'unsatisfiable' : { start: Math.max(0, size - n), end: size - 1 };
  }
  const start = Number(m[1]), end = m[2] === '' ? size - 1 : Math.min(Number(m[2]), size - 1);
  if (start >= size) return 'unsatisfiable';
  return end < start ? null : { start, end };
}

/** mediaFromR2(request, bucket, pathname, names, site): a film or song from the bucket by the bytes the build names for it (`names`, MEDIA_BYTES),
 *  its range cut by R2 (`get` with {offset, length}): one byte range is 206 with Content-Range and Content-Length, past the end 416 (bytes
 *  star/size), none or several ranges 200 whole, a HEAD its headers; every answer says Accept-Ranges: bytes. It carries the headers the site gives
 *  that film (`site()`: [name, value] pairs, the assets' own answer: its type, its cache, its _headers lines), all but those its bytes decide.
 *  null when the build names no bytes for it, the bucket does not hold those bytes (a re-cut film before its put: never its old copy), the site's
 *  headers cannot be read, or the request is neither GET nor HEAD: the assets answer then. */
export async function mediaFromR2(request, bucket, pathname, names, site) {
  let name = pathname; try { name = decodeURIComponent(pathname); } catch { /* the path as asked */ }
  const named = names?.[name];
  if (!bucket || !SHA256.test(named?.sha256 ?? '') || (request.method !== 'GET' && request.method !== 'HEAD')) return null;
  const key = mediaKey(named.sha256, name), head = await bucket.head(key);
  if (!head || head.size !== named.size) return null;
  const given = (await site?.()) ?? (named.download ? [['content-type', MEDIA_TYPES[name.split('.').pop().toLowerCase()] ?? 'application/octet-stream'], ['cache-control', 'public, max-age=0, must-revalidate'], ['content-disposition', `attachment; filename="${name.split('/').pop()}"`], ['x-content-type-options', 'nosniff']] : null); if (!given) return null;   // an installer is no page's asset: its own headers
  const headers = new Headers();
  for (const [name, value] of given) if (!BYTES_HEADERS.has(name.toLowerCase())) headers.append(name, value);
  if (head.httpEtag) headers.set('etag', head.httpEtag);
  headers.set('accept-ranges', 'bytes');
  const range = request.method === 'GET' ? parseRange(request.headers.get('range'), head.size) : null;
  if (range === 'unsatisfiable') { headers.set('content-range', `bytes */${head.size}`); return new Response(null, { status: 416, headers }); }
  if (request.method === 'HEAD') { headers.set('content-length', String(head.size)); return new Response(null, { status: 200, headers }); }
  if (!range) {
    const whole = await bucket.get(key); if (!whole) return null;
    headers.set('content-length', String(head.size));
    return new Response(whole.body, { status: 200, headers });
  }
  const length = range.end - range.start + 1, part = await bucket.get(key, { range: { offset: range.start, length } });
  if (!part) return null;
  headers.set('content-range', `bytes ${range.start}-${range.end}/${head.size}`); headers.set('content-length', String(length));
  return new Response(part.body, { status: 206, headers });
}

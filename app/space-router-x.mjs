// app/space-router-x.mjs · X HOLDS THE FLASK (Nov 19 2026, lane/x-is-the-flasks-name, claude-1cd371e0). His words, UTC, ~19:0x, over the grant link that only the
// browser holding the flask could open: "shouldn't we have people first link their twitters and then do the mint so then when they use twitter on the harmony app
// they see balance?"; then "Yes, build it". Before it: Nov 19 ~14:1x "people mint their lyssajudron online the social swarmy thing with pfp linked to their twitter;
// in the app, they connect their twitter" (tools/embertide-mesh/X-CARRIES-HER-IN-LANDING.md). The X account is the name the credits answer to: the mint page signs
// in with X and the flask's key signs that this X account holds it (the grant law's X text, app/space-router-grant.mjs); Harmony's own "Connect with X" then hands
// the Worker its sign-in, and the Worker lets that Mac's key spend the flask X holds (worker/space-router-x.mjs). The house's X app is a public client (PKCE): no
// secret anywhere; X answers only to the callbacks its app lists, so the site's own (`${origin}${X_BACK}`) is his to list there.
import { sha256Hex } from './dl-society-codes.mjs';
export const X_PATH = '/space-router/v1/x', X_BACK = '/space-router/v1/x/back', X_AUTHORIZE = 'https://x.com/i/oauth2/authorize', X_SCOPES = 'tweet.read users.read';
export const X_CLIENT_ID = 'bXlxcHpiaXF2WUoyRFB5SENhQk06MTpjaQ';   // the house's X app (tools/embertide-mesh/x-door.mjs, embertide-app/site/account.html)
export const X_CAP = 5, X_DAYS = 90;   // what an X sign-in lets a Harmony spend from the flask X holds: $5 a UTC day, for 90 days (mine, his to change; as lib/tracenet-create.mjs GRANT_CAP)
/** The page's road back from X, read off the address's fragment (the Worker's X_BACK writes it; a fragment reaches no server and no log): {state, code}, 'no', or null */
export const xBackOf = (hash) => { if (hash === '#x=no') return 'no'; const m = /^#x=([A-Za-z0-9_-]{16,64})\.([A-Za-z0-9._~%-]{1,1200})$/.exec(hash ?? ''); if (!m) return null; try { return { state: m[1], code: decodeURIComponent(m[2]) }; } catch { return null; } };
/** nameOf(address): HER NAME as a flask gives it (ONE NAME FOR HER, worker/space-router-egg.mjs): its tank's, st and the first 12 hex of its address's sha256, with no dash */
export const nameOf = async (address) => `st${(await sha256Hex(address)).slice(0, 12)}`;

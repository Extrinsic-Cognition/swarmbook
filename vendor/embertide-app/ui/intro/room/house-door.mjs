// house-door.mjs: where this page reaches the house (THE IPAD READS THE WHOLE HOUSE, Oct 30 2026, claude-a0d1dd19; his 05:3x UTC "it is nowhere near the
// app in macos for functionalities").
//
// A page on the house's secure front (https: his iPad's Harmony window through rite-https on 8943, a phone's page on the front) has ONE origin, and the front
// routes each door on it: /nest/* to the Nest (read only, for a glass he signed in: tools/embertide-mesh/lib/front-nest-road.mjs), Harmony's list to Harmony,
// the rest to the rite. So on the front the Nest and the rite are the page's own origin. Anywhere else (the Mac's window on loopback, a TV's plain http page)
// a module keeps its own address, as before. Before this file every module wrote its own: http://127.0.0.1:8904 (on the iPad, the iPad itself) or the page's
// protocol on the Nest's or the rite's port (https on a plain http port: ERR_SSL), and the iPad's window read no Nest and no rite at all.
// A write is not this file's: the front reads the Nest and never writes it; a glass writes on its own signed door, the canvas's ops on Harmony's relay.
// COST: one property read per call; nothing at rest.

/** onFront(loc): this page came through the house's secure front, so the house is its own origin. */
export const onFront = (loc = globalThis.location) => Boolean(loc) && loc.protocol === 'https:' && typeof loc.origin === 'string' && /^https:\/\/[^/]+$/.test(loc.origin);

/** houseDoor(fallback, loc): this page's road to a door of the house (the Nest's or the rite's): its own origin on the front, else the module's own address. */
export const houseDoor = (fallback, loc = globalThis.location) => (onFront(loc) ? loc.origin : fallback);

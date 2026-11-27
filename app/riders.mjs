// riders.mjs: A SWARM WEARS ITS RIDERS (Nov 22 2026 UTC, THE-SWARM-WEARS-ITS-RIDERS-LANDING.md). His words: Sept 1 07:54 "polyhedrons are organizations... faces are individuals (agents or humans)"; Nov 20 08:26
// "lyssajudrons colored pfps are only hexagons"; Nov 22 17:50 "Patreon (pentagons) and Swarm Riders (hexagons)"; 18:02, to "Build the other riders' faces on the swarm?": "Yes, build it".
// Who holds a hexagon is Solana's word (a registry's holders, in their order); whose face a holder's key wears is the house's, asked by the key (worker/space-router-portrait.mjs ?riders). A key with no minted hexagon wears her in the colours its rider gave her in Harmony (THE RIDER'S COLOURS CROSS; THE RIDER IS A HEXAGON, his Nov 24 2026 ~18:1x UTC: a Harmony user is a rider, a hexagon; the pentagons are the necromancers, Nefertiti; Nov 24 2026, his Nov 22 14:08 UTC "we should allow everyone to have their own colored face lyssajudron"), drawn by her own painter from the six colours alone (dl-her-portrait.js drawHers, as the board and the wall draw them), all of one ask in one staging; else none.
// A face leads to its person's page, as on the front's ball (THE HEX IS A PAGE, his Nov 19 13:20 "that hex is a page"), where one was claimed.
export const FACES = '/space-router/v1/portrait', ASK = 100, PX = 256, HANDLE = /^[A-Za-z0-9_-]{1,32}$/, PICTURE = /^\/space-router\/v1\/portrait\/[0-9a-f]{32}\.jpg$/;   // ASK: the keys one ask names (the door's RIDERS); PX: a face's side as a ball draws it (the house keeps it at 480)
/** seatedOf(registry, keyOf): the key of each hexagon a chamber has seated, in its holders' order as the ball draws them; null where no key holds it. */
export const seatedOf = (r, keyOf) => r.holders.flatMap((h) => Array(Number(h.seats)).fill(keyOf(h)));
/** pictureOf(src): a face, drawn small once. A key with colours and no face is drawn by the caller's draw(colours[]) (tree.js: her painter), never from here: this file imports nothing at run time. */
export const pictureOf = (src) => new Promise((ok, no) => { const m = new Image(); m.onerror = no; m.onload = () => { const c = document.createElement('canvas'); c.width = c.height = PX; c.getContext('2d').drawImage(m, 0, 0, PX, PX); ok(c); }; m.src = src; }), COLOURS = ['light', 'base', 'coat', 'gold', 'eyes', 'thruster'];
/** mountRiders({fetcher, picture, onFaces}): ask(keys), each key's face once, every key of one turn in one ask; wears(key, vote, voting), what its hexagon wears (engine.js wear): its face, and in a vote dim until its yes, then rimmed in the
 *  floor's gold, and the page a press opens; of(key), its picture's address and that page; null for a key that wears none. onFaces: some came in. A door that does not answer is asked again when a registry is read again, never on a timer. */
export function mountRiders({ fetcher = (...a) => fetch(...a), picture = pictureOf, draw = async () => [], onFaces = () => {} } = {}) {
  const faces = new Map(); let asked = null;   // a key -> null (asked, or none), or its face
  const wear = (k, src, img, handle) => { const press = HANDLE.test(handle ?? '') ? `/${handle}` : null; faces.set(k, { src, page: press, rest: { img, press }, wait: { img, press, dim: 0.42 }, yes: { img, press, rim: '#FFC62E', width: 5 } }); };
  const flush = async (keys) => {
    let came = false;
    for (let i = 0; i < keys.length; i += ASK) {
      const some = keys.slice(i, i + ASK);
      try {
        const r = await fetcher(`${FACES}?riders=${some.join(',')}`), { riders } = await r.json();
        await Promise.all(some.filter((k) => PICTURE.test(riders[k]?.picture)).map(async (k) => { try { wear(k, riders[k].picture, await picture(riders[k].picture), riders[k].handle); came = true; } catch { faces.delete(k); } }));
        const hues = some.filter((k) => !faces.get(k) && COLOURS.every((c) => /^#[0-9A-Fa-f]{6}$/.test(riders[k]?.colours?.[c] ?? ''))); if (hues.length) try { (await draw(hues.map((k) => riders[k].colours))).forEach((img, j) => { wear(hues[j], null, img, riders[hues[j]].handle); came = true; }); } catch { for (const k of hues) faces.delete(k); }   // her painter could not stand: the default stays, asked again with the registry
      } catch { for (const k of some) faces.delete(k); }
    }
    if (came) onFaces();
  };
  return {
    ask(keys) { const fresh = keys.filter((k) => k && !faces.has(k)); if (!fresh.length) return; for (const k of fresh) faces.set(k, null); if (asked) return void asked.push(...fresh); asked = fresh; queueMicrotask(() => { const all = [...new Set(asked)]; asked = null; void flush(all); }); },
    wears: (key, vote, voting) => { const f = key ? faces.get(key) : null; return f ? (!voting ? f.rest : vote === 'gold' ? f.yes : f.wait) : null; },
    of: (key) => faces.get(key) ?? null,
  };
}

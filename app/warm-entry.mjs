// One page and one checkout. An explicit Harmony arrival starts no film, renderer or wallet operation.
import {herAddressOf} from './dl-direct-wallets.js';
import {captureReferral} from './dl-society-codes.mjs';

const storageOf = () => { try { return globalThis.localStorage ?? null; } catch { return null; } };

export function entryMode(search) {
  const sources = new URLSearchParams(search).getAll('from');
  return sources.length === 1 && sources[0] === 'harmony' ? 'harmony' : 'story';
}

export function introductionURL(href) {
  const url = new URL(href);
  url.searchParams.delete('from');
  // Keep her binding in the fragment, where checkout reads it. A separate entry marker shows the film first.
  if (herAddressOf(url.hash)) url.searchParams.set('from', 'introduction');
  else url.hash = 'oath-sphere';
  return url.href;
}

// Literal imports let tools/page-files.mjs discover and ship the complete normal introduction.
function loadStory(doc, win) {
  for (const video of doc.querySelectorAll('video[data-story-poster]')) video.poster = video.dataset.storyPoster;
  const galaxy = doc.querySelector('[data-warm-galaxy]');   // #purpose / #warm-world commented out (Nov 26 2026): load only where live
  return Promise.all([
    galaxy ? import('./warm-film-center.js?v=4') : null,
    import('./warm.js?v=disk-1'),
    import('./dl-direct-holders.js?v=ryu-sei-ken-1'),
    import('./dl-twelve.js?v=seen-once-1'),
    doc.querySelector('#oath-response, #iuramentum') ? import('./warm-ceremony.js?v=film-position-2') : null,   // the vow's ceremony, only where its mount stands (commented out, Oct 30 2026)
    import('./swarm-explainer.js?v=readable-hash-1'),
    import('./warm-dust.js?v=gold-1'),
    galaxy ? import('./warm-galaxy-player.js?v=mothership-1') : null,
    galaxy ? import('./warm-state.js?v=spatial-entry-1') : null,
    galaxy ? import('./warm-spatial.js?v=share-1') : null,
    import('./dl-mint-pour.js?v=flask-11'),
    import('./dl-athena.js?v=intro-seen-1'),
    import('./dl-visit.mjs?v=visit-1'),
    import('./dl-harmony-doors.mjs?v=doors-2'),
    new URLSearchParams(win.location.search).has('handoff') ? import('./dl-handoff.js?v=handoff-3') : null,   // her step out into the phone (?handoff=lan, the dev server's)
    import('./dl-her-colours.js?v=her-3'),
    import('./dl-her-portrait.js?v=portrait-4'),   // HER PORTRAIT IS HER DEPOSIT'S HEXAGON: at her 'made' her face comes in on the hexagon her deposit took; everyone's faces on theirs
    import('./dl-kit-deposit.js?v=split-1'),   // PRE-DEPOSITS FOR THE SPACE ROUTER: the tank's door, enabled only when the deposit door answers its terms   // HER COLOURS ON THE MINT: her making between her landing and the choice (it claims the landing at once)
    import('./dl-space-router.js?v=intro-seen-1'),   // SPACE ROUTER AT THE FREEZE: the rebate once she lands ($1 spent, 1 $WARM back); its press down to the film, then to the Canvas below
    import('./dl-side-press.js?v=side-1'),   // FROM NEFERTITI TO BLUE: a press on her blue plate hands the ball over to blue's page
    import('./dl-hexagon.js?v=hexagon-2'),   // THE HEXAGON PATH: a press on her red plate hands her egg into the hexagon, her making behind it, and the ball opened into its hexagons after it
    doc.documentElement.dataset.hexmint === undefined ? null : import('./dl-mint-hexagon.js?v=mint-1'),   // THE HEXAGON'S OWN MINT: the deposit door's stage, on the page's one ball (only there)
    import('./dl-athena-film.js?v=governance-1'),   // ATHENA BRINGS THE GOVERNANCE FILM: on her landing, the page's second film as a card over her making, free to open or ignore
    import('../lab/hero-mount.js?v=mint-3').then(({mountHero}) => mountHero({doc, win})),
  ]);
}

export async function startEntry({doc = document, win = window, storage = storageOf(), now = Date.now,
  checkout = () => import('./dl-direct.js?v=society-2'), story = loadStory} = {}) {
  // THE REFERRAL (Oct 16 2026, dl-society-codes.mjs): a friend's ?ref=<code> is kept in this browser 30 days, on either way in (the film or the
  // app's entry); the checkout says it in its fields and sends it with the order it makes. A word that is no code keeps nothing.
  captureReferral(win.location.search, storage, now());
  const mode = entryMode(win.location.search);
  doc.documentElement.dataset.entry = mode;
  if (mode === 'story') {
    await Promise.all([checkout(), story(doc, win)]);
    const url = new URL(win.location.href);
    if (url.searchParams.get('from') === 'introduction' && herAddressOf(url.hash)) {
      doc.getElementById('oath-sphere').scrollIntoView({block: 'start', behavior: 'instant'});
    }
    return mode;
  }
  const title = doc.getElementById('harmony-mint-title');
  doc.getElementById('mint').setAttribute('aria-labelledby', title.id);
  doc.querySelector('[data-watch-introduction]').href = introductionURL(win.location.href);
  // Only the existing checkout is loaded. Connecting and signing remain the buyer's explicit actions.
  await checkout();
  title.focus({preventScroll: true});
  win.scrollTo({top: 0, left: 0, behavior: 'instant'});
  return mode;
}

if (typeof document !== 'undefined' && typeof window !== 'undefined') void startEntry();

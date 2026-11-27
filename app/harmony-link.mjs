// harmony-link.mjs: THE LINK BETWEEN THE PAGE AND DYSONLIGHT HARMONY (Oct 22 2026; his "dude you gotta properly link them else it's all a joke").
// One contract, read by both halves and by the Worker between them, so none of them can drift from the others:
// - the page (dl-visit.mjs: the visit; dl-harmony-doors.mjs: the press stamps the installer's address with VISIT_PARAM, ATHENA_PARAM, HER_PARAM and NAME_PARAM);
// - the Worker (worker/premint.mjs THE INSTALL: INSTALL_PATH, its INSTALL_EVENTS and VIA, the gate's word);
// - Harmony (tools/embertide-mesh/lib/society-install.mjs: macOS's download record read for INSTALLER_NAMES from INSTALLER_ORIGINS, the visit
//   reported to the Worker), and the mint's dev server (dyson-society/tools/mint-dev.mjs: the installer served under INSTALLER_NAMES[0], DEV_PORT).
// Pure: no window, no storage, nothing mounted (dl-visit.mjs mounts the visit; this file only names what the halves agree on).
import { normalizeCode } from './dl-society-codes.mjs';

export const SITE = 'https://optimism.fit';
export const DEV_PORT = 9060;   // the mint's dev server, the local road
export const INSTALLER_NAMES = Object.freeze(['DysonLight-Harmony.zip', 'DysonLight-Harmony.dmg']);   // the installer's file, as the doors serve it (the face's name)
export const INSTALLER_ORIGINS = Object.freeze([SITE, 'https://swarmbook.com', `http://127.0.0.1:${DEV_PORT}`, `http://localhost:${DEV_PORT}`]);   // the site under its two names (one Worker, wrangler.optimism-fit.jsonc), the release's installer on the second (nestos-release.json); the mint's dev server
export const VISIT_PARAM = 's', ATHENA_PARAM = 'a', HER_PARAM = 'h', NAME_PARAM = 'n';   // the installer's address: ?s=<visit>&a=<what Athena had done>&h=<her colours, dl-her-reel.mjs herColours>&n=<her one name>
export const VISIT_LENGTH = 26;   // the visit's id: 26 letters of the codes' alphabet (dl-society-codes.mjs), 130 random bits
export const ATHENA_STATES = Object.freeze(['none', 'coming', 'entered', 'skipped', 'whole', 'still']);   // dl-visit.mjs athenaBefore's answers
export const INSTALL_PATH = '/api/premint/install';
export const INSTALL_EVENTS = Object.freeze(['installed', 'saved']);   // Harmony's first opening on a Mac; her saved there (the tutorial done)
export const VIA = Object.freeze(['quarantine', 'handoff']);   // how Harmony found its visit: macOS's download record, or the page's word in a browser
export const isHerName = (name) => typeof name === 'string' && /^[0-9a-z]{1,32}$/.test(name);   // ONE NAME FOR HER (Nov 22 2026): the flask's, the birth every road lays her under
export const isVisitId = (id) => typeof id === 'string' && id.length === VISIT_LENGTH && normalizeCode(id, VISIT_LENGTH) === id;

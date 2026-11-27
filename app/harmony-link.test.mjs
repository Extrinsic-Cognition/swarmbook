// harmony-link.test.mjs: THE LINK, whole (his Oct 22 2026 WEST: "dude you gotta properly link them else it's all a joke"). The page's own code, Harmony's
// own reporter and the Worker's own handler in one run, nothing standing in for any of the three: the visit and what Athena did, the press stamping
// the local release's installer address, macOS's download record holding it (a fixture of its schema, never the Mac's own), Harmony reading it and
// reporting to the Worker with no browser origin, the page's word on its visit, her paint opened and her saved, the gate holding and then opening.
// node --test harmony-link.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import * as LINK from './harmony-link.mjs';
import { visitOf, noteAthena, noteDownload } from './dl-visit.mjs';
import { downloadURL, localLinks, LOCAL_MANIFEST } from './dl-harmony-doors.mjs';
import { encode58 } from './dl-direct-protocol.mjs';
import { blank, put } from './dl-her-colours.mjs'; import { herColours } from './dl-her-reel.mjs';
import { createHandler } from '../worker/premint.mjs';
import { database, standIn, ZIP_NAME } from '../tools/mint-dev.mjs';
import { findDownload, createSocietyInstall } from '../vendor/tools/embertide-mesh/lib/society-install.mjs';

const here = (p) => new URL(p, import.meta.url);
const read = (p) => fs.readFileSync(here(p), 'utf8');
const DEV = `http://127.0.0.1:${LINK.DEV_PORT}`;

test('one contract, read by every half: the page, the Worker, the dev server and Harmony', () => {
  for (const [file, word] of [['./dl-visit.mjs', /from '\.\/harmony-link\.mjs'/], ['./dl-harmony-doors.mjs', /from '\.\/harmony-link\.mjs'/], ['../worker/premint.mjs', /from '\.\.\/app\/harmony-link\.mjs'/],
    ['../tools/mint-dev.mjs', /from '\.\.\/app\/harmony-link\.mjs'/], ['../../../../../tools/embertide-mesh/lib/society-install.mjs', /from '\.\.\/\.\.\/\.\.\/embertide-app\/ui\/intro\/dyson-society\/app\/harmony-link\.mjs'/]])
    assert.match(read(file), word, file);
  assert.equal(ZIP_NAME, LINK.INSTALLER_NAMES[0], 'the dev server serves the installer Harmony looks for');
  assert.deepEqual(localLinks(JSON.parse(read(LOCAL_MANIFEST))).map((l) => l.href), [`${DEV}/dev/${LINK.INSTALLER_NAMES[0]}`], 'the local release names it on the local road\'s port');
  assert.ok(LINK.INSTALLER_ORIGINS.includes(DEV) && LINK.INSTALLER_ORIGINS.includes(LINK.SITE));
  assert.match(read('../../../../../tools/embertide-mesh/harmony-aiolos.mjs'), /const SOCIETY_INSTALL = COPY \? null : createSocietyInstall\?\.\(\{ site: process\.env\.EMBERTIDE_SOCIETY_SITE \|\| undefined, nestURL: NEST,/, 'Harmony\'s server mounts it (never a copy of it)');
});

test('the link, whole: what Athena did reaches the Worker through the installer Harmony opened, and her saved opens the seat', async () => {
  // THE PAGE: a visit, Athena's entrance seen whole, then the press on Download Harmony (the local road's release)
  let visit = visitOf(null, Date.parse('2026-10-22T13:00:00Z'));
  for (const [type, at, extra] of [['coming', 1, {end: 'stop'}], ['entered', 2, {}], ['landed', 9, {entrance: 'whole', beat: 5}]]) visit = noteAthena(visit, {type, at: visit.since + at * 1000, ...extra});
  const { visit: after, press } = noteDownload(visit, visit.since + 12000, 'macos');
  assert.equal(press.athena, 'whole');
  const her = put(put(blank(), 'light', '#F00BB9'), 'thruster', '#00AAFF'), href = downloadURL(localLinks(JSON.parse(read(LOCAL_MANIFEST)))[0].href, after.id, press.athena, her, 'st0123456789ab');   // and her colours, made on the page
  assert.equal(href, `${DEV}/dev/${LINK.INSTALLER_NAMES[0]}?${LINK.VISIT_PARAM}=${after.id}&${LINK.ATHENA_PARAM}=whole&${LINK.HER_PARAM}=${herColours(her)}&${LINK.NAME_PARAM}=st0123456789ab`);
  // MACOS keeps that address with the download (a fixture of its quarantine schema, among other downloads)
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'harmony-link-')), qdb = path.join(dir, 'QuarantineEventsV2'), q = new DatabaseSync(qdb);
  q.exec('CREATE TABLE LSQuarantineEvent (LSQuarantineEventIdentifier TEXT PRIMARY KEY NOT NULL, LSQuarantineTimeStamp REAL, LSQuarantineAgentBundleIdentifier TEXT, LSQuarantineAgentName TEXT, LSQuarantineDataURLString TEXT, LSQuarantineSenderName TEXT, LSQuarantineSenderAddress TEXT, LSQuarantineTypeNumber INTEGER, LSQuarantineOriginTitle TEXT, LSQuarantineOriginURLString TEXT, LSQuarantineOriginAlias BLOB)');
  [['https://example.org/other.zip', 100], [href, 200], ['https://example.org/later.pdf', 300]].forEach(([url, t], i) => q.prepare('INSERT INTO LSQuarantineEvent(LSQuarantineEventIdentifier,LSQuarantineTimeStamp,LSQuarantineAgentName,LSQuarantineDataURLString) VALUES(?,?,?,?)').run(`e${i}`, 783000000 + t, 'Google Chrome', url));
  q.close();
  // THE WORKER, its own handler on the dev server's own database (every migration), Solana and the price stood in, the local release arming the gate
  const { DB } = database(':memory:'), handle = createHandler({ fetcher: standIn });
  const env = { DB, PREMINT_ENABLED: 'true', HARMONY_RELEASE: '/app/nestos-release.local.json', ASSETS: { fetch: (req) => (new URL(req.url).pathname === '/app/nestos-release.local.json' ? new Response(read(LOCAL_MANIFEST)) : new Response('', { status: 404 })) } };
  const worker = async (url, opts = {}) => handle(new Request(url, opts), env);
  // HARMONY: its own reporter, its fetch reaching the Worker as it would over the network (no browser origin), her paint on its Nest
  let paint = { parts: [], opened: null };
  const laid = [], fetcher = async (url, opts) => (String(url).startsWith(DEV) ? worker(url, opts) : opts?.method === 'POST' ? (laid.push(JSON.parse(opts.body)), Response.json({})) : String(url).endsWith(`/nest/ref/${'scene/entities/golem-lyssajudron-paint'}`) ? Response.json({ ref: { value: paint } }) : new Response('', { status: 404 }));
  // as Harmony's server mounts it: no site named, so the visit goes back to where the installer came from (here the local road's dev server)
  const harmony = createSocietyInstall({ stateFile: path.join(dir, 'society', 'install.json'), nestURL: 'http://127.0.0.1:8904', fetch: fetcher, find: () => findDownload({ db: qdb }) });
  const pageReads = async () => (await (await worker(`${DEV}${LINK.INSTALL_PATH}?visit=${after.id}`)).json());
  assert.deepEqual(await pageReads(), { install: { visit: after.id, installed: false, saved: false }, armed: true }, 'before Harmony opens: armed, nothing installed');
  const order = (withVisit) => worker(`${DEV}/api/premint/orders`, { method: 'POST', headers: { origin: DEV, 'content-type': 'application/json' },
    body: JSON.stringify({ id: crypto.randomUUID(), tier: 'bronze', buyer: encode58(crypto.getRandomValues(new Uint8Array(32))), github: '', profile: null, ...(withVisit ? { visit: after.id } : {}) }) });
  assert.equal((await order(true)).status, 403, 'the gate holds the seat');
  // Harmony's first opening: the record read and kept, her colours laid, nothing told (NOTHING LEAVES UNASKED); the person's yes reports the visit and what Athena did
  const first = await harmony.firstLaunch(); assert.equal((await pageReads()).install.installed, false, 'nothing leaves before the yes'); await harmony.tell();
  assert.equal(first.visit, after.id); assert.equal(first.athena, 'whole'); assert.equal(first.via, 'quarantine'); assert.deepEqual(laid.map((b) => [b.expect, b.value.color ?? b.value.parts.thruster, b.value.birth]), [[0, '#F00BB9', 'st0123456789ab'], [0, '#00AAFF', 'st0123456789ab']], 'her colours laid under her one name on Harmony\'s Nest');
  assert.deepEqual((({ installedAt, ...rest }) => rest)((await pageReads()).install), { visit: after.id, installed: true, saved: false, athena: 'whole', via: 'quarantine', savedAt: null });
  assert.equal((await order(true)).status, 403, 'installed is not yet saved');
  // her paint opens in Harmony (the Lyssajudron's tutorial done): saved, and the seat opens for that visit alone
  paint = { parts: [], opened: Date.now() };
  assert.ok((await harmony.checkSaved()).savedAt);
  assert.equal((await pageReads()).install.saved, true);
  const bought = await order(true);
  assert.equal(bought.status, 200, JSON.stringify(await bought.clone().json()));
  assert.equal((await order(false)).status, 403, 'another visit, no Harmony of its own: still held');
});

// site-files.mjs: WHAT optimism.fit CARRIES (lane/the-site-carries-only-what-pages-load, Oct 29 2026). Until this lane the build copied app/, js/, skills/,
// submission/ and vault/ whole and left out only a file named exactly LANDING.md, so the site served what no page loads: read on Oct 29 2026 at 09:3x UTC,
// 16 of the 17 .md files of app/ answered 200 at optimism.fit/app/, among them ROOM.md (his room's words) and every *-LANDING.md receipt with his quoted
// words (THE-CHOICE-AT-THE-FREEZE-LANDING.md 15,172 B, THE-GOLD-MONTH-IS-A-SEALED-BID-LANDING.md 19,556 B), with the tests, the proofs, the local road's
// release and the film's depth layers (app/saint-seiya.layers.bin, 3,171,786 B, which no page loads and the GitHub copy strips).
// His law: "everything shared outside must be thoroughly sanitized in the nest itself" (Oct 14 2026); the warden's order for this lane: the deploy carries
// only what the pages load. shipsAs() is that rule for every file of those folders, one answer each, pure; tools/build-optimism-fit.mjs copies by it and
// refuses to finish when its output holds anything the rule keeps home (outputProblems), and site-files.test.mjs holds it over this tree.
//
// What ships: the kinds a page loads (its html, scripts, styles, pictures, films and songs, fonts, wasm, models); data (json, txt) only when a page or a
// script that ships names the file, the films' own manifests under app/warm-media/ (named by computed paths), the tracenets' registers and their drops
// the build verifies (vault/: the Worker serves them by its law, worker/tracenet-vault.mjs), and the licence texts that travel with a vendored script or
// a font; of .md, only the pages for agents the site routes to (app/agent.md, which /agent.md and /llms.txt send to, and the two skills it hands an agent).
// What never ships: receipts and notes (any other .md), tests and proofs, the local road's own (*.local.*: nestos-release.local.json says of itself
// "never shipped"), dotfiles, backups, and every other kind (the film's depth layers, scripts of the house, sources, archives). gen/ is not notes: its one
// file, poleis-client-v7.js, is the module app/found.html imports, so it ships by its kind (site-files.test.mjs walks every page to hold that).
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, posix } from 'node:path'; import { createHash } from 'node:crypto';

/** The pages for agents the site routes to: app/agent.md (/agent.md and /llms.txt, the build's _redirects) and the skills it hands an agent. */
export const AGENT_PAGES = Object.freeze(['app/agent.md']);
export const SKILL_PAGE = /^skills\/[a-z0-9-]+\/SKILL\.md$/;
/** The kinds a page loads. */
export const KINDS = Object.freeze(['html', 'js', 'mjs', 'css', 'png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'ico', 'mp4', 'm4a', 'mp3', 'webm', 'ttf', 'otf', 'woff', 'woff2', 'wasm', 'glb']);
/** Data: shipped only when something that ships names it (or it is a film's manifest, a register, a licence). */
export const DATA = Object.freeze(['json', 'txt']);
export const LICENCE = /(^|\/)(OFL-[^/]+|[^/]*LICEN[CS]E[^/]*)\.txt$/i;
export const MEDIA = 'app/warm-media/';

/** shipsAs(rel, {vouched, named}): null when the file at rel (its path from dyson-society/, '/' separated) goes to the site, else why it stays home.
 *  vouched: the paths the build itself checked (each tracenet's register and its drops); named(rel): whether a shipped page or script names the file. Pure. */
export function shipsAs(rel, { vouched = new Set(), named = () => false } = {}) {
  const parts = rel.split('/'), name = parts.at(-1), ext = posix.extname(name).slice(1).toLowerCase();
  if (parts.some((p) => p.startsWith('.'))) return 'a dotfile';
  if (/\.(before|bak|orig)([-.]|$)/.test(name)) return 'a backup';
  if (/\.(test|proof|browser|spec)\.[^.]+$/.test(name)) return 'a test or a proof';
  if (/\.local\.[^.]+$/.test(name)) return "the local road's own";
  if (parts[0] === 'vault') return vouched.has(rel) ? null : 'not a drop a register names';
  if (ext === 'md') return AGENT_PAGES.includes(rel) || SKILL_PAGE.test(rel) ? null : 'a receipt or a note';
  if (KINDS.includes(ext)) return null;
  if (DATA.includes(ext)) return vouched.has(rel) || rel.startsWith(MEDIA) || LICENCE.test(rel) || named(rel) ? null : 'data no page names';
  return 'not a kind a page loads';
}

/** namer(texts): named(rel) for shipsAs: whether the file's own name stands in any of the texts (the shipped pages, scripts and styles). Pure. */
export function namer(texts) { const all = texts.join('\n'); return (rel) => all.includes(posix.basename(rel)); } /** THE PAGES RUN ONLY THEIR OWN SCRIPTS (Nov 20 2026): the name a content policy gives each script written inside a page ('sha256-<base64 of its text>'), over the pages given: a script with a src is named by its address instead, a block that is data (json, plain text) or empty runs nothing; each name once, in order. */ export const inlineScripts = (pages) => [...new Set(pages.flatMap((html) => [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].filter(([, attrs, text]) => text.trim() && !/\bsrc\s*=/i.test(attrs) && !/\btype\s*=\s*["']?(application\/(ld\+)?json|text\/plain)/i.test(attrs)).map(([, , text]) => `'sha256-${createHash('sha256').update(text).digest('base64')}'`)))].sort();

/** outputProblems(paths, {vouched, read}): the build's own output read back against the rule: every path (from the site's root) that the rule keeps home,
 *  ignoring the build's own files and the page's files outside the copied folders; with read(p), every text that names a home folder or a workers.dev account (NOTHING OF HIS HOME SHIPS). */
export function outputProblems(paths, { vouched = new Set(), copied = ['app', 'js', 'skills', 'submission', 'vault'], own = [], read = null } = {}) {
  const problems = [];
  for (const p of paths) {
    if (own.includes(p)) continue;
    const parts = p.split('/'), name = parts.at(-1);
    if (/\.md$/i.test(name) && !(AGENT_PAGES.includes(p) || SKILL_PAGE.test(p) || (parts[0] === 'vault' && vouched.has(p)))) problems.push(`${p}: a receipt or a note`);
    else if (/\.(test|proof|browser|spec)\.[^.]+$/.test(name)) problems.push(`${p}: a test or a proof`);
    else if (/\.local\.[^.]+$/.test(name)) problems.push(`${p}: the local road's own`);
    else if (read && /\.(m?js|cjs|html|css|json|md|txt|svg|xml)$/i.test(name) && /(?:^|[\s'"`(=])(?:file:\/\/)?\/(?:Users|home)\/[^/\s'"`]+\/|[A-Za-z]:\\{1,2}Users\\{1,2}[^\\\s'"`]+\\|[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev\b/m.test(read(p))) problems.push(`${p}: names a home folder or a workers.dev account`);
    else if (copied.includes(parts[0]) && shipsAs(p, { vouched, named: () => true })) problems.push(`${p}: ${shipsAs(p, { vouched, named: () => true })}`);
  }
  return problems;
}

/** planSite(root, {copied, vouched, texts}): every file of the copied folders under root (dyson-society/), split into what ships and what stays home
 *  with why. Data is judged against the texts of what ships (the copied pages, scripts and styles, and `texts`: the page's own files outside them).
 *  Reads the tree, writes nothing. */
export function planSite(root, { copied = ['app', 'js', 'skills', 'submission', 'vault'], vouched = new Set(), texts = [] } = {}) {
  const all = [];
  const walk = (rel) => { for (const name of readdirSync(join(root, rel))) { const r = posix.join(rel, name); if (statSync(join(root, r)).isDirectory()) walk(r); else all.push(r); } };
  for (const dir of copied) { try { if (statSync(join(root, dir)).isDirectory()) walk(dir); } catch { /* a folder this tree does not hold */ } }
  const code = all.filter((r) => /\.(html|m?js|css)$/i.test(r) && !shipsAs(r, { vouched }));
  const named = namer([...texts, ...code.map((r) => readFileSync(join(root, r), 'utf8'))]);
  const ship = [], home = [];
  for (const r of all) { const why = shipsAs(r, { vouched, named }); if (why) home.push({ rel: r, why }); else ship.push(r); }
  return { ship, home };
}

// worker/space-router-link.mjs · A STAKE PAYS ITS TANK (Oct 30 2026, lane/a-stake-pays-its-tank, claude-9a126af2). His word, UTC: ~12:4x "Pay a tank", on
// the seat's button "First the road to pay a tank". The button's words named a USDC kit the page had already left: since 09:41 UTC the kit pays a tank with the
// stake's rewards, at his Oct 29 18:01 "i think we should make it a staking thing so we get staking yield an use that as inference credits, so basically SOL
// inflation pays for inference". The road's own list (tools/embertide-mesh/pool/SOL-INFLATION-PAYS-FOR-INFERENCE-LANDING.md, "Not built") opens with "a
// staker's signed link", and plans/the-fuel-by-staking-hypertrace-2026-10-26.md, brick 2: "A staker links a stake account to a tank by signing with its withdraw
// authority". The staking seat (claude-61e371e5) handed this piece over at 12:5x.
//   POST /space-router/v1/link  { proof }   the proof is a Sign In With Solana text and its Ed25519 signature, in the seat proof's travelling shape
//     (dl-direct-protocol.mjs sealSeatProof: the text in base64url, a dot, the signature in base58). The text names:
//     - this site (domain and URI);
//     - the stake's withdraw authority, which signs;
//     - the stake account, in its statement;
//     - the cluster, as its Chain ID;
//     - a nonce, the time it was issued, and an expiry at most ten minutes later.
//   The door checks the text byte for byte, its times and its signature. Then it makes one getAccountInfo on the Worker's node, finalized and parsed; the node's
//   cluster is checked against SOLANA_CLUSTER by its genesis. The account must be the stake program's, and its withdrawer the signer.
//   The link is one row of sr_links (migration 0014): the stake, its authority, the authority's tank, the cluster, the time it was signed, the signature as its
//   receipt. A link signed before the one standing is refused: an old proof replayed cannot take a stake back.
// THE TANK is the authority's own: `st-` and the first 12 hex of the sha256 of its address.
//   - Its first link makes it, with a fresh key (sr_ and 32 random bytes). The key is handed back in that one answer and kept only as its sha256
//     (sr_tanks.key_sha256): never logged, never kept.
//   - A later link answers the tank and no key.
//   - The statement that asks for a new key replaces the key's hash and hands the new key back, once.
// No fuel moves here. The epoch crank pours each linked stake's reward into its tank (tools/embertide-mesh/pool/crank.mjs epoch --edge); his hand writes it.
// COST: a link is one getGenesisHash per isolate and node, one getAccountInfo, and three D1 statements at most. Nothing runs at rest.
import { decode58, encode58 } from '../app/dl-direct-protocol.mjs';
import { sha256Hex } from '../app/dl-society-codes.mjs';
import { MARKUP_BPS } from '../app/space-router-law.mjs';
import { newTankKey, isUnkeyed } from '../app/space-router-deposit.mjs';
import { solanaNode, clusterOf, json, refusal } from './solana-node.mjs';

export const LINK_PATH = '/space-router/v1/link';
export const STAKE_PROGRAM = 'Stake11111111111111111111111111111111111111';
export const LINK_MS = 600000;          // a link proof is good for ten minutes at most
const SKEW_MS = 600000;                 // a device clock up to ten minutes ahead of the Worker's (the seat proof's own skew)
const ADDR = '[1-9A-HJ-NP-Za-km-z]{32,44}';
const TEXT = new RegExp(`^([a-z0-9.-]{1,253}(?::[0-9]{1,5})?) wants you to sign in with your Solana account:\\n(${ADDR})\\n\\nLink stake account (${ADDR}) to your Swarmy's tank on Space Router( and give the tank a new key)?\\. This sends no transaction and moves no funds\\.\\n\\nURI: (\\S{1,300})\\nVersion: 1\\nChain ID: (mainnet|devnet)\\nNonce: ([1-9A-HJ-NP-Za-km-z]{8,64})\\nIssued At: (\\S{20,40})\\nExpiration Time: (\\S{20,40})$`);
const isoMs = (s) => { const ms = Date.parse(s); return Number.isFinite(ms) && new Date(ms).toISOString() === s ? ms : null; };
const b64u = (bytes) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

export { clusterOf };
export const linkStatement = (stake, rekey = false) => `Link stake account ${stake} to your Swarmy's tank on Space Router${rekey ? ' and give the tank a new key' : ''}. This sends no transaction and moves no funds.`;
/** The text a staker's wallet signs, in Sign In With Solana's order */
export function linkMessage({ domain, authority, stake, uri, cluster, nonce, issuedAt, expiresAt, rekey = false }) {
  return `${domain} wants you to sign in with your Solana account:\n${authority}\n\n${linkStatement(stake, rekey)}\n\nURI: ${uri}\nVersion: 1\nChain ID: ${cluster}\nNonce: ${nonce}\nIssued At: ${issuedAt}\nExpiration Time: ${expiresAt}`;
}
/** A fresh link for this site: a random nonce, issued now, expiring LINK_MS on */
export function linkSignIn({ host, origin, authority, stake, cluster, rekey = false, now = Date.now() }) {
  return linkMessage({ domain: host, authority, stake, uri: origin, cluster, rekey, nonce: encode58(crypto.getRandomValues(new Uint8Array(16))),
    issuedAt: new Date(now).toISOString(), expiresAt: new Date(now + LINK_MS).toISOString() });
}
/** The proof as it travels: the text in base64url, a dot, the signature in base58 */
export const sealLinkProof = (message, signature) => `${b64u(new TextEncoder().encode(message))}.${encode58(signature)}`;

/** A proof's fields as written, its signature unchecked, or null when it is not a link proof byte for byte */
export function linkFields(proof) {
  if (typeof proof !== 'string' || proof.length > 4096) return null;
  const [text64, signature58, extra] = proof.split('.');
  if (extra !== undefined || !/^[A-Za-z0-9_-]{1,3000}$/.test(text64 ?? '')) return null;
  let bytes, text, signature;
  try {
    bytes = Uint8Array.from(atob(text64.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((text64.length + 3) % 4)), (c) => c.charCodeAt(0));
    if (b64u(bytes) !== text64) return null;
    text = new TextDecoder('utf-8', { fatal: true }).decode(bytes); signature = decode58(signature58, 64);
  } catch { return null; }
  const m = TEXT.exec(text); if (!m) return null;
  const [, domain, authority, stake, rekey, uri, cluster, nonce, issuedAt, expiresAt] = m, fields = { domain, authority, stake, uri, cluster, nonce, issuedAt, expiresAt, rekey: !!rekey };
  const issued = isoMs(issuedAt), expires = isoMs(expiresAt);
  if (issued === null || expires === null || linkMessage(fields) !== text) return null;
  try { decode58(authority, 32); decode58(stake, 32); } catch { return null; }
  return { ...fields, issued, expires, bytes, signature };
}
/** The link a proof shows, or null: a link text for this host and origin, issued no later than now (and the skew), unexpired, good for at most LINK_MS, and
 *  signed by the authority it names -> { authority, stake, cluster, rekey, issued, signature58 } */
export async function verifyLinkProof(proof, { host, origin, now }) {
  const f = linkFields(proof);
  if (!f || f.domain !== host || f.uri !== origin) return null;
  if (!(f.issued <= now + SKEW_MS && now < f.expires && f.issued < f.expires && f.expires - f.issued <= LINK_MS)) return null;
  try {
    const key = await crypto.subtle.importKey('raw', decode58(f.authority, 32), 'Ed25519', false, ['verify']);
    if (!await crypto.subtle.verify('Ed25519', key, f.signature, f.bytes)) return null;
  } catch { return null; }
  return { authority: f.authority, stake: f.stake, cluster: f.cluster, rekey: f.rekey, issued: f.issued, signature58: encode58(f.signature) };
}
/** The withdraw authority of a stake account as a node answers getAccountInfo (jsonParsed), or null when it is no stake account */
export function withdrawerOf(value) {
  if (!value || value.owner !== STAKE_PROGRAM || value.data?.program !== 'stake') return null;
  const p = value.data.parsed; if (!p || !['initialized', 'delegated'].includes(p.type)) return null;
  const w = p.info?.meta?.authorized?.withdrawer; return typeof w === 'string' && new RegExp(`^${ADDR}$`).test(w) ? w : null;
}
/** The authority's own tank: st- and the first 12 hex of its address's sha256 (a tank's name: space-router-law.mjs NAME_RX) */
export const tankOfAuthority = async (authority) => `st-${(await sha256Hex(authority)).slice(0, 12)}`;
/** A flask's tank: the one its X account holds (X HOLDS THE FLASK, migration 0025: a second browser's flask fills the same credits), else its own; a database behind 0025 knows no X */
export const tankOfFlask = async (env, address) => (await env.DB.prepare('SELECT tank FROM sr_x WHERE address = ?1').bind(address).first().catch(() => null))?.tank ?? tankOfAuthority(address);
export { newTankKey };   // one shape of a tank key, made where it is used: app/space-router-deposit.mjs

const SQL = {
  standing: 'SELECT authority, tank, signed_at FROM sr_links WHERE stake = ?1',
  tank: 'SELECT name, key_sha256 FROM sr_tanks WHERE name = ?1',
  // a deposit may make the same tank at the same moment: the first maker wins, the other reads it
  make: 'INSERT INTO sr_tanks(name, key_sha256, markup_bps, made_at) VALUES (?1, ?2, ?3, ?4) ON CONFLICT(name) DO NOTHING',
  rekey: 'UPDATE sr_tanks SET key_sha256 = ?2 WHERE name = ?1',
  link: `INSERT INTO sr_links(stake, authority, tank, cluster, signed_at, linked_at, signature) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
    ON CONFLICT(stake) DO UPDATE SET authority = excluded.authority, tank = excluded.tank, cluster = excluded.cluster, signed_at = excluded.signed_at,
    linked_at = excluded.linked_at, signature = excluded.signature WHERE excluded.signed_at >= sr_links.signed_at`,
};

/** linkDoor({fetcher, clockMs}) -> (request, env, url) => Response for LINK_PATH, else null */
export function linkDoor({ fetcher = fetch, clockMs = () => Date.now() } = {}) {
  const node = solanaNode(fetcher);
  async function link(request, env, url) {
    let body = null; try { body = await request.json(); } catch { body = null; }
    const now = clockMs(), p = await verifyLinkProof(body?.proof, { host: url.host, origin: url.origin, now });
    if (!p) return refusal(401, 'Not a fresh link proof for this site, signed by the authority it names.');
    if (p.cluster !== clusterOf(env)) return refusal(400, `This door links ${clusterOf(env)} stakes.`);
    if (!await node.sameCluster(env)) return refusal(503, 'The door cannot read its cluster now.');
    let info; try { info = await node.rpc(env, 'getAccountInfo', [p.stake, { encoding: 'jsonParsed', commitment: 'finalized' }]); } catch { return refusal(503, 'The door cannot read the stake now.'); }
    const withdrawer = withdrawerOf(info?.value);
    if (!withdrawer) return refusal(422, `${p.stake} is no stake account on ${p.cluster} (finalized).`);
    if (withdrawer !== p.authority) return refusal(403, "The signer is not this stake's withdraw authority.");
    const standing = await env.DB.prepare(SQL.standing).bind(p.stake).first();
    if (standing && standing.signed_at > p.issued) return refusal(409, 'A newer link stands for this stake.');
    const tank = await tankOfAuthority(p.authority);
    const linked = await env.DB.prepare(SQL.link).bind(p.stake, p.authority, tank, p.cluster, p.issued, now, p.signature58).run();
    if (Number(linked?.meta?.changes ?? linked?.changes) !== 1) return refusal(409, 'A newer link stands for this stake.');   // a newer link landed meanwhile
    let key = null, row = await env.DB.prepare(SQL.tank).bind(tank).first();
    if (!row) {
      key = newTankKey();
      const r = await env.DB.prepare(SQL.make).bind(tank, await sha256Hex(key), MARKUP_BPS, now).run();
      if (Number(r?.meta?.changes ?? r?.changes) !== 1) { key = null; row = await env.DB.prepare(SQL.tank).bind(tank).first(); }   // a deposit made it first
    }
    // a new key on its own statement, or the first key of a tank a deposit made with none
    if (row && (p.rekey || isUnkeyed(row.key_sha256))) { key = newTankKey(); await env.DB.prepare(SQL.rekey).bind(tank, await sha256Hex(key)).run(); }
    return json(200, { stake: p.stake, authority: p.authority, tank, cluster: p.cluster, linked_at: now,
      ...(key ? { key, shown: 'once: this key is not kept here; its sha256 is' } : { key: null, shown: 'the tank stands with its key; ask for a new one with the new-key statement' }) });
  }
  return async function door(request, env, url) {
    if (url.pathname !== LINK_PATH) return null;
    if (request.method !== 'POST') return refusal(405, 'POST a link proof: { "proof": "<text>.<signature>" }.');
    try { return await link(request, env, url); } catch { return refusal(503, 'The door cannot link now; ask again.'); }
  };
}

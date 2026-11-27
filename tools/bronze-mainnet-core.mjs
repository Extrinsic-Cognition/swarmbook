// Pure launch checks. No keys, signing, network calls or website mutations.
import { createHash } from 'node:crypto';

export const PROGRAM = 'AJdsmjxQjHnBxDEdRxwEk2UMRW7bgNmvEMUwMziRTyab';
export const AUTHORITY = '3nJn2tnmR27xbkjzT49YnSnXL2KeddzM7CkEizYiKMba';
export const GENESIS = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
export const LOADER = 'BPFLoaderUpgradeab1e11111111111111111111111';
export const ROOT = '3393240975121717647';
export const SOURCE = '790caf629e58159ef0eb6267668ed8e54463aa93';
export const BINARY = Object.freeze({ bytes: 390616, sha256: 'e4514cfc2292e0663669983ed8b0fb514ef1f37ba079d55eb4a09c1391bb6bda' });
export const ACCOUNT_BYTES = Object.freeze({ config: 76, treasury: 27, registry: 1056, sale: 7284 });
export const TERMS = Object.freeze({
  name: 'DYSONLIGHT HARMONY', description: 'Bronze pre-mint access: $10 launch target, fixed SOL deposit; GitHub profile.',
  tier: 'bronze', usdPerSlot: 10, slots: 150, rung: 5, root: ROOT, sale: '0',
  commitSlots: '1080000', revealSlots: '216000', window: '216000', planCap: '10000000000', planPeriod: '1000000',
});
const fail = message => { throw new Error(message); };
export const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
export function u64(value) {
  if (!['string', 'bigint', 'number'].includes(typeof value) ||
      (typeof value === 'number' && !Number.isSafeInteger(value)) || !/^(0|[1-9][0-9]*)$/.test(String(value))) fail('Invalid integer');
  const n = BigInt(value); if (n > 18446744073709551615n) fail('Integer exceeds u64'); return n;
}
export function solForTenDollars(solUsd) {
  if (typeof solUsd !== 'string' || !/^[1-9][0-9]{0,5}(\.[0-9]{1,8})?$/.test(solUsd)) fail('Invalid SOL/USD quote');
  const [whole, fraction = ''] = solUsd.split('.'), scale = 10n ** BigInt(fraction.length);
  const price = BigInt(whole) * scale + BigInt(fraction || '0');
  return ((10n * 1000000000n * scale + price - 1n) / price).toString();
}
export function checkArtifact(bytes) {
  if (bytes.length !== BINARY.bytes || sha256(bytes) !== BINARY.sha256) fail('Artifact differs from the tested program');
}
export function planHash(plan) { const { digest, ...body } = plan; return sha256(JSON.stringify(body)); }
export function sealPlan(plan) { return { ...plan, digest: planHash(plan) }; }
export function checkPlan(plan, { now = Date.now(), fresh = true } = {}) {
  if (!plan || plan.schema !== 'dyson.bronze-mainnet-plan.v1' || plan.digest !== planHash(plan)) fail('Launch plan changed');
  if (plan.network !== 'mainnet-beta' || plan.genesis !== GENESIS || plan.program !== PROGRAM || plan.authority !== AUTHORITY ||
      plan.source !== SOURCE || JSON.stringify(plan.binary) !== JSON.stringify(BINARY) ||
      JSON.stringify(plan.terms) !== JSON.stringify(TERMS)) fail('Launch plan does not match the reviewed Bronze configuration');
  const url = new URL(plan.rpc);
  if (url.protocol !== 'https:' || url.username || url.password || url.hash || url.search) fail('Use a public HTTPS RPC endpoint without credentials');
  if (!Number.isSafeInteger(plan.createdAt) || !Number.isSafeInteger(plan.expiresAt) || plan.expiresAt !== plan.createdAt + 600000 ||
      (fresh && (now < plan.createdAt || now >= plan.expiresAt))) fail('Prepare a fresh launch plan before signing');
  if (plan.quote?.source !== 'https://api.coinbase.com/v2/prices/SOL-USD/spot' || plan.quote.currency !== 'USD' ||
      plan.depositLamports !== solForTenDollars(plan.quote.amount)) fail('Price does not match the reviewed $10 quote');
  const opened = u64(plan.openedSlot);
  if (u64(plan.commitEndSlot) !== opened + u64(TERMS.commitSlots) ||
      u64(plan.revealEndSlot) !== u64(plan.commitEndSlot) + u64(TERMS.revealSlots)) fail('Sale windows changed');
  return plan;
}
export function checkProgram({ program, programData, expectedProgramData, authorityBytes, artifact }) {
  checkArtifact(artifact);
  if (!program || program.owner !== LOADER || program.executable !== true || !program.data ||
      program.data.length !== 36 || program.data.readUInt32LE(0) !== 2 ||
      !program.data.subarray(4, 36).equals(expectedProgramData)) fail('Expected mainnet program is not deployed');
  if (!programData || programData.owner !== LOADER || programData.executable || !programData.data ||
      programData.data.length < 45 + artifact.length || programData.data.readUInt32LE(0) !== 3 || programData.data[12] !== 1 ||
      !programData.data.subarray(13, 45).equals(authorityBytes) ||
      !programData.data.subarray(45, 45 + artifact.length).equals(artifact) ||
      programData.data.subarray(45 + artifact.length).some(x => x !== 0)) fail('Deployed program bytes or upgrade authority differ');
}
export function checkSale({ plan, config, treasury, registry, sale }) {
  checkPlan(plan, { fresh: false });
  if (!config || config.authority !== AUTHORITY || config.root !== ROOT || config.mode !== 1 || config.defaultMint !== '11111111111111111111111111111111') fail('Bronze authority/configuration differs');
  if (!treasury || treasury.unit !== ROOT || !registry || registry.unit !== ROOT || registry.root !== ROOT || registry.rung !== TERMS.rung ||
      registry.frozen || registry.name !== TERMS.name || registry.desc !== TERMS.description || registry.defaultMint !== config.defaultMint ||
      registry.charter !== sha256(TERMS.name) || registry.pentagons.some(p => p.kind !== 0)) fail('Bronze registry/treasury differs');
  for (const [key, expected] of [['window', TERMS.window], ['planCap', TERMS.planCap], ['planPeriod', TERMS.planPeriod],
    ['seatReserve', plan.depositLamports], ['seatDeposit', plan.depositLamports]]) {
    if (String(registry[key]) !== expected) fail(`Registry ${key} differs`);
  }
  if (!sale || sale.unit !== ROOT || sale.saleId !== '0' || sale.seatCount !== TERMS.slots || sale.settled) fail('Bronze sale differs');
  for (const [key, expected] of [['reserve', plan.depositLamports], ['deposit', plan.depositLamports],
    ['commitEnd', plan.commitEndSlot], ['revealEnd', plan.revealEndSlot]]) {
    if (String(sale[key]) !== expected) fail(`Sale ${key} differs`);
  }
}

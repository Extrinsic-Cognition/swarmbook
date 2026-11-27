import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { AUTHORITY, PROGRAM, GENESIS, SOURCE, BINARY, ROOT, TERMS, sealPlan, checkPlan,
  solForTenDollars, checkArtifact, checkProgram, checkSale, sha256, u64 } from './bronze-mainnet-core.mjs';

const plan = () => sealPlan({ schema: 'dyson.bronze-mainnet-plan.v1', network: 'mainnet-beta', genesis: GENESIS,
  rpc: 'https://api.mainnet-beta.solana.com', program: PROGRAM, authority: AUTHORITY, source: SOURCE, binary: BINARY, terms: TERMS,
  createdAt: 1000000, expiresAt: 1600000, quote: { source: 'https://api.coinbase.com/v2/prices/SOL-USD/spot', currency: 'USD', amount: '100.00' },
  depositLamports: '100000000', openedSlot: '10', commitEndSlot: '1080010', revealEndSlot: '1296010' });
function evidence() {
  return { plan: plan(), config: { authority: AUTHORITY, root: ROOT, mode: 1, defaultMint: '11111111111111111111111111111111' },
    treasury: { unit: ROOT }, registry: { unit: ROOT, root: ROOT, rung: 5, frozen: false, name: TERMS.name, desc: TERMS.description,
      defaultMint: '11111111111111111111111111111111', charter: sha256(TERMS.name), pentagons: [{ kind: 0 }],
      window: TERMS.window, planCap: TERMS.planCap, planPeriod: TERMS.planPeriod, seatReserve: '100000000', seatDeposit: '100000000' },
    sale: { unit: ROOT, saleId: '0', seatCount: 150, reserve: '100000000', deposit: '100000000', commitEnd: '1080010', revealEnd: '1296010', settled: false } };
}
test('$10 quote uses exact arithmetic and rounds upward by at most one lamport', () => {
  assert.equal(solForTenDollars('100.00'), '100000000');
  assert.equal(solForTenDollars('112.7'), '88731145');
  assert.equal(solForTenDollars('3'), '3333333334');
  for (const bad of [0, 100, '0', '-1', 'NaN', '1e2', '00.1', '1.000000001']) assert.throws(() => solForTenDollars(bad));
  assert.throws(() => u64(Number.MAX_SAFE_INTEGER + 1));
  assert.throws(() => u64('18446744073709551616'));
});
test('launch review cannot change price, identity, network, terms or timing', () => {
  checkPlan(plan(), { now: 1000000 });
  const changed = plan(); changed.depositLamports = '1'; assert.throws(() => checkPlan(changed, { now: 1000000 }), /changed/);
  for (const patch of [{ network: 'devnet' }, { authority: PROGRAM }, { program: AUTHORITY }, { source: 'other' },
    { depositLamports: '1' }, { commitEndSlot: '20' }, { revealEndSlot: '30' }, { terms: { ...TERMS, usdPerSlot: 1 } },
    { binary: { ...BINARY, sha256: '0'.repeat(64) } }, { rpc: 'https://secret@example.com' }, { rpc: 'https://example.com?key=private' }]) {
    assert.throws(() => checkPlan(sealPlan({ ...plan(), ...patch }), { now: 1000000 }));
  }
});
test('signing rejects expired/future plans while verification can recover an older confirmed launch', () => {
  assert.throws(() => checkPlan(plan(), { now: 1600000 }), /fresh/);
  assert.throws(() => checkPlan(plan(), { now: 999999 }), /fresh/);
  checkPlan(plan(), { now: 2000000, fresh: false });
});
test('occupied root and monetary/account substitutions never become published configuration', () => {
  checkSale(evidence());
  for (const [section, key, value] of [['config', 'authority', PROGRAM], ['config', 'mode', 0], ['config', 'root', '1'],
    ['treasury', 'unit', '1'], ['registry', 'frozen', true], ['registry', 'rung', 4], ['registry', 'name', 'Other'],
    ['registry', 'charter', '0'.repeat(64)], ['registry', 'seatDeposit', '1'], ['registry', 'planCap', '1'],
    ['registry', 'pentagons', [{ kind: 1 }]], ['sale', 'settled', true], ['sale', 'saleId', '1'], ['sale', 'seatCount', 149],
    ['sale', 'reserve', '1'], ['sale', 'deposit', '1'], ['sale', 'commitEnd', '20'], ['sale', 'revealEnd', '30']]) {
    const valueSet = evidence(); valueSet[section][key] = value; assert.throws(() => checkSale(valueSet));
  }
});
test('unknown build artifacts are rejected before a signer can be loaded', () => {
  assert.throws(() => checkArtifact(Buffer.alloc(BINARY.bytes)), /tested program/);
});
// The build artifact is supplied only on the build machine; no binary is checked into Git.
test('actual SBF loader verification checks bytes, authority, executable state and padding', { skip: !process.env.BRONZE_TEST_ARTIFACT }, async () => {
  const artifact = await readFile(process.env.BRONZE_TEST_ARTIFACT);
  checkArtifact(artifact);
  const address = Buffer.alloc(32, 2), authority = Buffer.alloc(32, 3);
  const p = Buffer.alloc(36); p.writeUInt32LE(2); address.copy(p, 4);
  const data = Buffer.alloc(45 + artifact.length + 32); data.writeUInt32LE(3); data[12] = 1; authority.copy(data, 13); artifact.copy(data, 45);
  const e = { artifact, expectedProgramData: address, authorityBytes: authority,
    program: { owner: 'BPFLoaderUpgradeab1e11111111111111111111111', executable: true, data: p },
    programData: { owner: 'BPFLoaderUpgradeab1e11111111111111111111111', executable: false, data } };
  checkProgram(e);
  for (const offset of [0, 12, 13, 45, data.length - 1]) {
    const bad = Buffer.from(data); bad[offset] ^= 1; assert.throws(() => checkProgram({ ...e, programData: { ...e.programData, data: bad } }));
  }
  assert.throws(() => checkProgram({ ...e, program: null }));
  assert.throws(() => checkProgram({ ...e, program: { ...e.program, executable: false } }));
  assert.throws(() => checkProgram({ ...e, program: { ...e.program, owner: PROGRAM } }));
});

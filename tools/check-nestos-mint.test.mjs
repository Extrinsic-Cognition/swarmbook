import test from 'node:test';
import assert from 'node:assert/strict';
import { assess, diagnosticExitCode, inspectRpc, MAINNET_GENESIS, MAINNET_RPC, publicKey } from './check-nestos-mint.mjs';

const program = 'AJdsmjxQjHnBxDEdRxwEk2UMRW7bgNmvEMUwMziRTyab';
const completedConfiguration = () => ({
  genesis: {
    schema: 'poleis.genesis-status.v1', network: 'solana-mainnet-beta', mintingEnabled: true,
    deployment: { program }, terms: { url: 'https://example.com/terms' },
    nativeMint: { surface: 'harmony', trigger: 'lyssajudron.completed', adapter: { module: 'native/passport', network: 'solana-mainnet-beta' } },
    actions: { mint: { kind: 'nft' } },
  },
  whitelist: { schema: 'dl-harmony.whitelist.v1', cluster: 'devnet' },
  release: { schema: 'nestos.release.v1', status: 'published', launch: 'harmony://welcome', platforms: {
    macos: 'https://example.com/app.dmg', windows: { url: 'https://example.com/app.exe' }, linux: 'https://example.com/app.AppImage',
  } },
});
const response = result => ({ ok: true, json: async () => ({ jsonrpc: '2.0', id: 1, result }) });
function rpcReplies(...values) {
  const requests = [];
  return {
    requests,
    fetchImpl: async (url, init) => { assert.equal(url, MAINNET_RPC); requests.push(JSON.parse(init.body)); return response(values.shift()); },
  };
}

test('current unpublished state fails closed and distinguishes devnet reservation', () => {
  const report = assess({
    genesis: { schema: 'poleis.genesis-status.v1', network: 'solana-mainnet-beta', mintingEnabled: false, deployment: null, terms: null, actions: { mint: null } },
    whitelist: { schema: 'dl-harmony.whitelist.v1', cluster: 'devnet' },
    release: { schema: 'nestos.release.v1', status: 'unpublished', platforms: { macos: null, windows: null, linux: null }, launch: null },
  });
  assert.equal(report.status, 'blocked'); assert.equal(report.ready, false);
  for (const code of ['mainnet_mint_disabled', 'mainnet_program_missing_or_invalid', 'published_transaction_terms_missing',
    'harmony_lyssajudron_completion_mint_binding_missing', 'native_mainnet_mint_adapter_missing', 'native_nft_mint_action_missing',
    'nestos_release_unpublished', 'nestos_macos_installer_missing', 'nestos_windows_installer_missing', 'nestos_linux_installer_missing']) {
    assert.ok(report.blocked.includes(code), code);
  }
  assert.equal(report.advertised.whitelistAction, 'sealed_bid_reservation');
  assert.equal(diagnosticExitCode(report), 1);
  assert.ok(report.warnings.includes('legacy_whitelist_is_devnet_reservation_not_mainnet_nft_mint'));
});

test('complete config and executable mainnet account still do not prove readiness', () => {
  const report = assess(completedConfiguration(), { status: 'mainnet_program_account_observed', assurance: 'existence_only' });
  assert.deepEqual(report.blocked, []); assert.equal(report.ready, false); assert.equal(report.status, 'unverified');
  assert.equal(diagnosticExitCode(report), 2);
  assert.ok(report.unverified.includes('native_lyssajudron_to_nft_end_to_end'));
});

test('web wallet route and generic token action cannot satisfy native NFT completion', () => {
  const inputs = completedConfiguration();
  inputs.genesis.nativeMint.surface = 'browser'; inputs.genesis.nativeMint.trigger = 'wallet.connected';
  inputs.genesis.actions.mint = { kind: 'fungible_token' }; inputs.release.launch = 'https://example.com/mint';
  const report = assess(inputs);
  for (const code of ['harmony_lyssajudron_completion_mint_binding_missing', 'native_nft_mint_action_missing']) assert.ok(report.blocked.includes(code));
});

test('opening Harmony normally needs no custom URI and complete inputs still exit unverified', () => {
  const inputs = completedConfiguration();
  inputs.release.launch = null;
  const report = assess(inputs);
  assert.deepEqual(report.blocked, []);
  assert.equal(report.advertised.nativeLaunchRouteConfigured, false);
  assert.equal(report.status, 'unverified'); assert.equal(report.ready, false);
  assert.equal(diagnosticExitCode(report), 2);
});

test('missing files, schemas and invalid program addresses stay blocked', () => {
  assert.equal(publicKey(program), true);
  for (const bad of [null, '', '0'.repeat(44), 'z'.repeat(44), '1'.repeat(33)]) assert.equal(publicKey(bad), false);
  const report = assess({ inputErrors: ['genesis_file_missing'], genesis: {}, release: null, whitelist: null });
  assert.equal(report.status, 'blocked'); assert.ok(report.blocked.includes('genesis_file_missing'));
  assert.ok(report.blocked.includes('genesis_status_missing_or_invalid'));
});

test('RPC confirms only genesis identity and executable account existence with read-only calls', async () => {
  const fixture = rpcReplies(MAINNET_GENESIS, { value: { executable: true } });
  const result = await inspectRpc(program, fixture);
  assert.equal(result.status, 'mainnet_program_account_observed'); assert.equal(result.assurance, 'existence_only');
  assert.deepEqual(fixture.requests.map(request => request.method), ['getGenesisHash', 'getAccountInfo']);
  assert.deepEqual(fixture.requests[1].params[1].dataSlice, { offset: 0, length: 0 });
});

test('wrong or unknown network never causes an account lookup', async () => {
  assert.equal(publicKey(MAINNET_GENESIS), true, 'genesis is a full base58-encoded 32-byte hash');
  for (const [hash, status] of [['devnet-hash', 'wrong_network'], ['5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp', 'wrong_network'], [null, 'unknown']]) {
    const fixture = rpcReplies(hash);
    assert.equal((await inspectRpc(program, fixture)).status, status);
    assert.equal(fixture.requests.length, 1);
  }
});

test('missing/nonexecutable/malformed accounts are not successful verification', async () => {
  for (const [account, status] of [[{ value: null }, 'program_account_missing'], [{ value: { executable: false } }, 'account_not_executable'],
    [{ value: {} }, 'unknown'], [{}, 'unknown']]) {
    const result = await inspectRpc(program, rpcReplies(MAINNET_GENESIS, account));
    assert.equal(result.status, status);
    assert.equal(assess(completedConfiguration(), result).status, 'blocked');
  }
});

test('network failures, RPC errors and timeout remain unknown or blocked', async () => {
  const fixtures = [
    { fetchImpl: async () => { throw new Error('network unavailable'); } },
    { fetchImpl: async () => ({ ok: false }) },
    { fetchImpl: async () => ({ ok: true, json: async () => ({ error: { code: -1 } }) }) },
    { fetchImpl: async () => { throw Object.assign(new Error('aborted'), { name: 'AbortError' }); } },
  ];
  for (const fixture of fixtures) {
    const result = await inspectRpc(program, fixture);
    assert.ok(['unknown', 'timeout'].includes(result.status));
    assert.equal(assess(completedConfiguration(), result).status, 'blocked');
  }
});

test('RPC never substitutes the devnet reservation program for a missing native deployment', async () => {
  const fixture = rpcReplies(MAINNET_GENESIS);
  assert.equal((await inspectRpc(undefined, fixture)).status, 'program_not_configured');
  assert.equal(fixture.requests.length, 1);
});

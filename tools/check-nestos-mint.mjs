#!/usr/bin/env node
// Diagnostic only: reads public configuration and, with --rpc, two read-only
// Solana RPC methods. It never loads a wallet, signs, simulates, or sends a tx.
// Configuration/account presence is not proof of an audited or working mint.
import { readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { resolve } from 'node:path';

export const MAINNET_RPC = 'https://api.mainnet-beta.solana.com';
// Full getGenesisHash result, not the shortened Wallet Standard chain ID.
export const MAINNET_GENESIS = '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d';
const NETWORK = 'solana-mainnet-beta';
const PLATFORMS = ['macos', 'windows', 'linux'];
const appDir = fileURLToPath(new URL('../app/', import.meta.url));
const nonempty = value => typeof value === 'string' && value.trim().length > 0;
const object = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const httpsUrl = value => {
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; }
  catch { return false; }
};
export function publicKey(value) {
  if (!nonempty(value) || !/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(value)) return false;
  const alphabet = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let number = 0n;
  for (const character of value) number = number * 58n + BigInt(alphabet.indexOf(character));
  let bytes = 0;
  for (; number > 0n; number >>= 8n) bytes++;
  return bytes + (value.match(/^1*/)?.[0].length || 0) === 32;
}

// Future native configuration is declarative evidence, never executable code:
// nativeMint: {surface:'harmony', trigger:'lyssajudron.completed',
//   adapter:{module:'<native module reference>', network:'solana-mainnet-beta'}}
// actions.mint: {kind:'nft', ...}; release platform values may be HTTPS URLs
// or {url:'https://...'}. release.launch is optional: users may open Harmony
// normally after installation; a custom URI is not a mint prerequisite.
export function assess({ genesis, whitelist, release, inputErrors = [] }, rpc = { status: 'not_requested' }) {
  const blocked = [...inputErrors];
  const warnings = [];
  const need = (condition, code) => { if (!condition) blocked.push(code); };
  need(genesis?.schema === 'poleis.genesis-status.v1', 'genesis_status_missing_or_invalid');
  need(genesis?.network === NETWORK, 'genesis_network_is_not_mainnet');
  need(genesis?.mintingEnabled === true, 'mainnet_mint_disabled');
  need(publicKey(genesis?.deployment?.program), 'mainnet_program_missing_or_invalid');
  need(httpsUrl(genesis?.terms?.url), 'published_transaction_terms_missing');
  const native = genesis?.nativeMint;
  need(native?.surface === 'harmony' && native?.trigger === 'lyssajudron.completed',
    'harmony_lyssajudron_completion_mint_binding_missing');
  need(object(native?.adapter) && native.adapter.network === NETWORK && nonempty(native.adapter.module),
    'native_mainnet_mint_adapter_missing');
  need(object(genesis?.actions?.mint) && genesis.actions.mint.kind === 'nft', 'native_nft_mint_action_missing');

  need(release?.schema === 'nestos.release.v1', 'nestos_release_manifest_missing_or_invalid');
  need(release?.status === 'published', 'nestos_release_unpublished');
  for (const platform of PLATFORMS) {
    const value = release?.platforms?.[platform];
    need(httpsUrl(object(value) ? value.url : value), `nestos_${platform}_installer_missing`);
  }
  const launch = object(release?.launch) ? release.launch.url : release?.launch;

  if (whitelist?.schema !== 'dl-harmony.whitelist.v1') warnings.push('legacy_whitelist_missing_or_invalid');
  else if (!['mainnet-beta', NETWORK].includes(whitelist.cluster)) warnings.push('legacy_whitelist_is_devnet_reservation_not_mainnet_nft_mint');
  if (rpc.status !== 'not_requested' && rpc.status !== 'mainnet_program_account_observed') {
    blocked.push(`rpc_${rpc.status || 'unknown'}`);
  }
  return {
    schema: 'nestos.mint-readiness.v1',
    status: blocked.length ? 'blocked' : 'unverified',
    ready: false,
    advertised: {
      genesisNetwork: genesis?.network ?? null,
      whitelistNetwork: whitelist?.cluster ?? null,
      whitelistAction: whitelist?.schema === 'dl-harmony.whitelist.v1' ? 'sealed_bid_reservation' : null,
      mintSurface: native?.surface ?? null,
      mintTrigger: native?.trigger ?? null,
      nativeLaunchRouteConfigured: nonempty(launch),
    },
    blocked: [...new Set(blocked)], warnings, rpc,
    unverified: ['native_lyssajudron_to_nft_end_to_end', 'nft_program_behavior_and_security_review', 'installer_signatures_and_setup'],
  };
}

// This diagnostic never approves a release. Even complete-looking inputs leave
// native execution, installer signatures and program/security review unverified.
export const diagnosticExitCode = report => report.status === 'blocked' ? 1 : 2;

export async function readInputs(directory = appDir) {
  const inputErrors = [];
  const read = async (name, key) => {
    try {
      const value = JSON.parse(await readFile(resolve(directory, name), 'utf8'));
      if (!object(value)) throw new Error('invalid_json_object');
      return value;
    } catch (error) {
      inputErrors.push(`${key}_${error.code === 'ENOENT' ? 'file_missing' : 'file_unreadable_or_invalid'}`);
      return null;
    }
  };
  const [genesis, whitelist, release] = await Promise.all([
    read('warm-genesis.json', 'genesis'), read('whitelist.json', 'whitelist'), read('nestos-release.json', 'release'),
  ]);
  return { genesis, whitelist, release, inputErrors: inputErrors.sort() };
}

export async function inspectRpc(program, { fetchImpl = globalThis.fetch, timeoutMs = 5000 } = {}) {
  // The endpoint is fixed and public: no custom endpoints or credential inputs.
  const timeout = Math.max(1, Math.min(10000, Number(timeoutMs) || 5000));
  const deadline = Date.now() + timeout;
  const call = async (method, params = []) => {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error('timeout');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), remaining);
    timer.unref?.();
    try {
      const response = await fetchImpl(MAINNET_RPC, {
        method: 'POST', signal: controller.signal, headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
      });
      if (!response.ok) throw new Error('http_error');
      const json = await response.json();
      if (!object(json) || json.error || !Object.hasOwn(json, 'result')) throw new Error('invalid_rpc_response');
      return json.result;
    } finally { clearTimeout(timer); }
  };
  let network = 'unknown';
  try {
    const hash = await call('getGenesisHash');
    if (typeof hash !== 'string') return { status: 'unknown', network };
    if (hash !== MAINNET_GENESIS) return { status: 'wrong_network', network: 'not_mainnet' };
    network = NETWORK;
    if (!publicKey(program)) return { status: 'program_not_configured', network };
    const result = await call('getAccountInfo', [program, { commitment: 'finalized', encoding: 'base64', dataSlice: { offset: 0, length: 0 } }]);
    if (!object(result) || !Object.hasOwn(result, 'value')) return { status: 'unknown', network };
    if (result.value === null) return { status: 'program_account_missing', network };
    if (!object(result.value) || typeof result.value.executable !== 'boolean') return { status: 'unknown', network };
    if (!result.value.executable) return { status: 'account_not_executable', network };
    return { status: 'mainnet_program_account_observed', network, program, assurance: 'existence_only' };
  } catch (error) {
    const timeout = error?.name === 'AbortError' || error?.name === 'TimeoutError' || error?.message === 'timeout';
    return { status: timeout ? 'timeout' : 'unknown', network };
  }
}

export async function main(args = process.argv.slice(2)) {
  if (args.length === 1 && args[0] === '--help') {
    process.stdout.write('Usage: node tools/check-nestos-mint.mjs [--rpc]\nOffline by default. --rpc reads public mainnet identity and configured program existence only. No wallet or transactions.\nExit 1: blocked prerequisites. Exit 2: unverified; never release approval. Only --help exits 0. A native launch URL is optional.\n');
    return 0;
  }
  if (args.some(arg => arg !== '--rpc') || args.length > 1) {
    process.stdout.write(JSON.stringify({ status: 'error', error: 'usage: check-nestos-mint.mjs [--rpc]' }) + '\n');
    return 2;
  }
  const inputs = await readInputs();
  const rpc = args.includes('--rpc') ? await inspectRpc(inputs.genesis?.deployment?.program) : { status: 'not_requested' };
  const report = assess(inputs, rpc);
  process.stdout.write(JSON.stringify(report) + '\n');
  return diagnosticExitCode(report);
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  process.exitCode = await main();
}

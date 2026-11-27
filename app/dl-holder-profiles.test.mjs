// Run on NewMac: node --test embertide-app/ui/intro/dyson-society/app/dl-holder-profiles.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const moduleAt = async path => import(`data:text/javascript;base64,${Buffer.from(await readFile(new URL(path, import.meta.url))).toString('base64')}`);
const { twitterName, normalizeTwitterName, validateAvatarURL, slotProfileMemo, createHolderProfileReader, HOLDER_PROFILE_DESCRIPTION } = await moduleAt('./dl-holder-profiles.js');
const { create } = await moduleAt('../js/poleis-client.js');
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
function b58(bytes) {
  let n = BigInt('0x' + Buffer.from(bytes).toString('hex')), out = '';
  while (n) { out = ALPHABET[Number(n % 58n)] + out; n /= 58n; }
  for (const byte of bytes) { if (byte) break; out = '1' + out; }
  return out;
}
function un58(text) {
  let n = 0n;
  for (const char of text) { const i = ALPHABET.indexOf(char); if (i < 0) throw Error('invalid key'); n = n * 58n + BigInt(i); }
  const out = [];
  while (n) { out.push(Number(n & 255n)); n >>= 8n; }
  for (const char of text) { if (char !== '1') break; out.push(0); }
  return Uint8Array.from(out.reverse());
}
// No network/dependencies/private keys. The real browser client's instruction builder supplies
// the ABI; this deterministic PDA stand-in tests identity comparisons, not Solana curve math.
class PublicKey {
  constructor(value) {
    this.bytes = value instanceof PublicKey ? value.toBytes() : typeof value === 'string' ? un58(value) : Uint8Array.from(value);
    if (this.bytes.length !== 32) throw Error('invalid key');
  }
  toBytes() { return Uint8Array.from(this.bytes); }
  toBase58() { return b58(this.bytes); }
  static findProgramAddressSync(seeds, program) {
    return [new PublicKey(createHash('sha256').update(Buffer.concat([...seeds.map(v => Buffer.from(v)), Buffer.from(program.toBytes())])).digest()), 255];
  }
}
class TransactionInstruction { constructor(fields) { Object.assign(this, fields); } }
const web3 = { PublicKey, TransactionInstruction, SystemProgram: { programId: new PublicKey(new Uint8Array(32)) } };
const P = create({ web3, nacl: {} });
const ROOT = 145n, SALE = 0n, MEMO = new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr');
const AVATAR = 'https://pbs.twimg.com/profile_images/12345/A_b-7_400x400.jpg';
const key = seed => new PublicKey(new Uint8Array(32).fill(seed));
const signature = seed => b58(new Uint8Array(64).fill(seed));
const memo = () => slotProfileMemo('github.com/Example-Dev', { handle: '@Example_1', avatarUrl: AVATAR });
function fixture(seed = 7, nonce = 0n) {
  const bidder = key(seed), ix = P.commitSeatBid(bidder, ROOT, SALE, nonce, new Uint8Array(32).fill(3));
  const member = { bidder: bidder.toBase58(), id: `${bidder.toBase58()}:${nonce}`, nonce, bidAccount: ix.keys[2].pubkey.toBase58() };
  const entry = { signature: signature(seed), slot: 100 + seed, err: null, confirmationStatus: 'confirmed' };
  const commit = { programId: ix.programId, accounts: ix.keys.map(a => a.pubkey), data: b58(ix.data) };
  const tx = { slot: entry.slot, meta: { err: null }, transaction: { signatures: [entry.signature], message: {
    accountKeys: ix.keys.map(a => ({ pubkey: a.pubkey, signer: a.isSigner, writable: a.isWritable })),
    instructions: [{ programId: MEMO, program: 'spl-memo', parsed: memo() }, commit],
  } } };
  return { member, entry, tx, commit, ix };
}
function harness(fixtures = [fixture()], options = {}) {
  const calls = [], emissions = [];
  const conn = {
    async getSignaturesForAddress(address, config, commitment) {
      calls.push(['history', address.toBase58(), config, commitment]);
      return fixtures.filter(f => f.member.bidAccount === address.toBase58()).map(f => f.entry).reverse();
    },
    async getParsedTransaction(sig, config) {
      calls.push(['tx', sig, config]);
      return fixtures.find(f => f.entry.signature === sig)?.tx ?? null;
    },
  };
  Object.assign(conn, options);
  const reader = createHolderProfileReader({ conn, P, web3, root: ROOT, sale: SALE, onProfiles: value => emissions.push(value) });
  return { reader, calls, emissions, conn };
}
const tick = () => new Promise(resolve => setImmediate(resolve));

test('handle inputs normalize; links with status paths, queries, credentials and oversized names fail', () => {
  for (const input of ['Example_1', '@Example_1', 'https://x.com/Example_1/', 'twitter.com/Example_1', ' https://www.twitter.com/Example_1 ']) assert.equal(twitterName(input), 'example_1');
  assert.equal(normalizeTwitterName('@A'), 'a');
  for (const input of ['', null, {}, 'a'.repeat(16), 'https://x.com/name/status/1', 'https://x.com/name?q=1', 'https://evil.test/name', 'https://me@x.com/name', 'x.com:443/name', 'two names', 'hello-name', 'ümlaut']) assert.equal(twitterName(input), null, String(input));
  assert.match(HOLDER_PROFILE_DESCRIPTION, /supplied by the signing wallet/);
  assert.match(HOLDER_PROFILE_DESCRIPTION, /ownership is not verified/);
});

test('picture URLs permit the image CDN only, with bounded safe paths and query values', () => {
  assert.equal(validateAvatarURL(AVATAR), AVATAR);
  assert.equal(validateAvatarURL(AVATAR + '?format=jpg&name=400x400'), AVATAR + '?format=jpg&name=400x400');
  for (const input of [null, 'http://pbs.twimg.com/profile_images/1/a.jpg', AVATAR + '#a', AVATAR + '?tracking=id', AVATAR + '?name=9999x9999', AVATAR + '?format=jpg&format=png', AVATAR + '?name=small&name=large', AVATAR.replace('pbs.twimg.com', 'pbs.twimg.com.evil.test'), AVATAR.replace('pbs.twimg.com', 'me@pbs.twimg.com'), AVATAR.replace('pbs.twimg.com', 'pbs.twimg.com:443'), AVATAR.replace('A_b-7', '%41_b-7'), AVATAR.replace('profile_images', 'media'), AVATAR.replace('.jpg', '.svg'), AVATAR + ' ', 'https://pbs.twimg.com/profile_images/1/' + 'a'.repeat(512)]) assert.equal(validateAvatarURL(input), null, String(input));
});

test('memo generator preserves GitHub-only purchase and creates one canonical compact v2 profile', () => {
  assert.equal(slotProfileMemo('https://github.com/Example-Dev/'), 'dl-harmony · github.com/example-dev');
  assert.equal(memo(), 'dl-harmony.v2 ' + JSON.stringify({ github: 'example-dev', twitter: 'example_1', picture: AVATAR }));
  assert.ok(Buffer.byteLength(memo()) <= 600);
  assert.equal(slotProfileMemo('bad user'), null);
  assert.equal(slotProfileMemo('dev', { handle: 'someone', avatarUrl: 'https://evil.test/image.jpg' }), null);
  assert.equal(slotProfileMemo('dev', { handle: 'toolong'.repeat(3), avatarUrl: AVATAR }), null);
});

test('confirmed exact client commit plus same-transaction signed memo yields a cached public profile', async () => {
  const f = fixture(), h = harness([f]);
  const result = await h.reader.update([f.member]);
  assert.deepEqual(result, [{ id: f.member.id, bidder: f.member.bidder, handle: 'example_1', avatarUrl: AVATAR, profileUrl: 'https://x.com/example_1', signature: f.entry.signature }]);
  assert.deepEqual(h.calls[0], ['history', f.member.bidAccount, { limit: 32 }, 'confirmed']);
  assert.deepEqual(h.calls[1], ['tx', f.entry.signature, { commitment: 'confirmed', maxSupportedTransactionVersion: 0 }]);
  result[0].handle = 'changed';
  assert.equal((await h.reader.update([f.member]))[0].handle, 'example_1');
  assert.equal(h.calls.length, 2, 'successful profiles never repeat RPC while membership remains');
  assert.deepEqual(await h.reader.update([]), []);
  assert.deepEqual(h.emissions.at(-1), []);
});

test('raw memo bytes are supported only with buyer included in Memo accounts', async () => {
  for (const includeBuyer of [true, false]) {
    const f = fixture();
    f.tx.transaction.message.instructions[0] = { programId: MEMO, accounts: [key(includeBuyer ? 7 : 8)], data: b58(Buffer.from(memo())) };
    assert.equal((await harness([f]).reader.update([f.member])).length, includeBuyer ? 1 : 0);
  }
});

test('root, sale, nonce, program, bidder, PDA, signer, writable and success are mandatory', async t => {
  const mutations = {
    root: f => { const data = Uint8Array.from(f.ix.data); data[1] ^= 1; f.commit.data = b58(data); },
    sale: f => { const data = Uint8Array.from(f.ix.data); data[9] ^= 1; f.commit.data = b58(data); },
    nonce: f => { const data = Uint8Array.from(f.ix.data); data[17] ^= 1; f.commit.data = b58(data); },
    discriminator: f => { const data = Uint8Array.from(f.ix.data); data[0] = 10; f.commit.data = b58(data); },
    shortData: f => { f.commit.data = b58(f.ix.data.slice(0, 56)); },
    extendedData: f => { f.commit.data = b58(Buffer.concat([f.ix.data, Buffer.from([0])])); },
    program: f => { f.commit.programId = key(18); },
    buyerAccount: f => { f.commit.accounts[0] = key(18); },
    salePda: f => { f.commit.accounts[1] = key(18); },
    bidPda: f => { f.commit.accounts[2] = key(18); },
    system: f => { f.commit.accounts[3] = key(18); },
    extraAccount: f => { f.commit.accounts.push(key(18)); },
    signer: f => { f.tx.transaction.message.accountKeys[0].signer = false; },
    writable: f => { f.tx.transaction.message.accountKeys[2].writable = false; },
    failedHistory: f => { f.entry.err = { InstructionError: [0, 'Custom'] }; },
    failedTx: f => { f.tx.meta.err = { InstructionError: [1, 'Custom'] }; },
    noMeta: f => { f.tx.meta = null; },
    processed: f => { f.entry.confirmationStatus = 'processed'; },
    noConfirmation: f => { delete f.entry.confirmationStatus; },
    wrongSignature: f => { f.tx.transaction.signatures[0] = signature(18); },
    wrongSlot: f => { f.tx.slot++; },
    innerCommitOnly: f => { f.tx.meta.innerInstructions = [{ instructions: [f.commit] }]; f.tx.transaction.message.instructions.pop(); },
    fakeMemoProgram: f => { f.tx.transaction.message.instructions[0].programId = key(18); },
  };
  for (const [name, mutate] of Object.entries(mutations)) await t.test(name, async () => {
    const f = fixture(); mutate(f);
    assert.deepEqual(await harness([f]).reader.update([f.member]), []);
  });
});

test('members cannot smuggle a different wallet, nonce, bid account or local profile', async () => {
  const f = fixture(), h = harness([f]);
  const invalid = [
    { ...f.member, bidder: key(8).toBase58() }, { ...f.member, nonce: 1n },
    { ...f.member, id: f.member.id + '0' }, { ...f.member, bidAccount: key(8).toBase58() },
    { ...f.member, id: `${f.member.bidder}:18446744073709551616` },
  ];
  assert.deepEqual(await h.reader.update(invalid), []);
  assert.equal(h.calls.length, 0);
  assert.equal((await h.reader.update([{ id: f.member.id, bidder: f.member.bidder, handle: 'fake', avatarUrl: AVATAR }]))[0].handle, 'example_1');
});

test('legacy, malformed, duplicate and foreign-picture memos are absent only after a proven commit', async () => {
  const variants = [
    'dl-harmony · github.com/dev', 'dl-harmony · github.com/dev · x.com/person',
    'dl-harmony.v2 {"github":"dev"}', memo().replace('pbs.twimg.com', 'evil.example'),
    memo().replace('"github":', '"unknown":'), memo().replace('"twitter":"example_1"', '"twitter":"other","twitter":"example_1"'),
    memo().replace('"example_1"', '"Example_1"'), 'dl-harmony.v2 ' + ' '.repeat(601),
  ];
  for (const value of variants) {
    const f = fixture(); f.tx.transaction.message.instructions[0].parsed = value;
    const h = harness([f]);
    assert.deepEqual(await h.reader.update([f.member]), []);
    await h.reader.update([f.member]);
    assert.equal(h.calls.length, 2, 'proven absence is cached');
  }
  const f = fixture(); f.tx.transaction.message.instructions.unshift({ ...f.tx.transaction.message.instructions[0] });
  assert.deepEqual(await harness([f]).reader.update([f.member]), []);
});

test('only the creation commit memo counts, even after more than one page of unrelated attempts', async () => {
  const f = fixture(), h = harness([f]);
  const unrelated = fixture(8);
  unrelated.tx.transaction.message.instructions = [{ programId: MEMO, parsed: memo() }];
  h.conn.getSignaturesForAddress = async () => [...Array.from({ length: 31 }, (_, i) => ({ ...unrelated.entry, signature: signature(i + 20) })), f.entry, { ...f.entry, signature: signature(90) }];
  let fetched = [];
  h.conn.getParsedTransaction = async sig => { fetched.push(sig); return sig === f.entry.signature ? f.tx : unrelated.tx; };
  assert.equal((await h.reader.update([f.member])).length, 1);
  assert.deepEqual(fetched, [f.entry.signature], 'oldest within the 32-entry bound finds commit before newer traffic');
  const missing = fixture(); missing.tx.transaction.message.instructions.shift();
  const later = fixture(); later.entry.signature = signature(80); later.tx.transaction.signatures[0] = later.entry.signature; later.tx.transaction.message.instructions.pop();
  assert.deepEqual(await harness([missing, later]).reader.update([missing.member]), [], 'a separate later memo cannot decorate a prior purchase');
});

test('RPC failures, missing transactions and incomplete history can recover on the next explicit update', async () => {
  for (const kind of ['history-error', 'tx-error', 'missing-tx', 'empty-history']) {
    const f = fixture(), h = harness([f]);
    const original = kind.includes('history') ? h.conn.getSignaturesForAddress : h.conn.getParsedTransaction;
    const method = kind.includes('history') ? 'getSignaturesForAddress' : 'getParsedTransaction';
    h.conn[method] = async () => { if (kind.endsWith('error')) throw Error('offline'); return kind === 'empty-history' ? [] : null; };
    assert.deepEqual(await h.reader.update([f.member]), []);
    h.conn[method] = original;
    assert.equal((await h.reader.update([f.member])).length, 1, kind);
  }
});

test('three concurrent jobs, coalesced updates, and removals cannot publish stale results', async () => {
  const fixtures = Array.from({ length: 5 }, (_, i) => fixture(i + 7)), h = harness(fixtures);
  const gates = [], original = h.conn.getSignaturesForAddress;
  let concurrent = 0, max = 0;
  h.conn.getSignaturesForAddress = (...args) => new Promise(resolve => {
    max = Math.max(max, ++concurrent);
    gates.push(async () => { concurrent--; resolve(await original(...args)); });
  });
  const first = h.reader.update(fixtures.map(f => f.member));
  const second = h.reader.update(fixtures.map(f => f.member));
  await tick(); assert.equal(gates.length, 3);
  const removed = h.reader.update([]);
  for (const release of gates.splice(0)) await release();
  await Promise.all([first, second, removed]);
  assert.equal(max, 3); assert.equal(h.calls.filter(c => c[0] === 'tx').length, 0);
  assert.ok(h.emissions.every(value => value.length === 0));
  h.conn.getSignaturesForAddress = original;
  assert.equal((await h.reader.update([fixtures[0].member])).length, 1, 're-added identity gets a fresh job');
});

test('dispose drops queued and in-flight results and never schedules new work', async () => {
  const f = fixture(), h = harness([f]); let release;
  h.conn.getParsedTransaction = () => new Promise(resolve => { release = () => resolve(f.tx); });
  const work = h.reader.update([f.member]); await tick();
  h.reader.dispose(); const before = h.emissions.length; release();
  assert.deepEqual(await work, []); assert.deepEqual(await h.reader.update([f.member]), []);
  assert.equal(h.emissions.length, before);
});

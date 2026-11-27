import test from 'node:test';
import assert from 'node:assert/strict';
import { isPhone, walletBrowseLinks, herAddressOf, mintHash, notHers } from '../app/dl-direct-wallets.js';
import { RECIPIENT, SYSTEM, MEMO } from '../app/dl-direct-protocol.mjs';
import { readFileSync } from 'node:fs';

const mac = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Safari/605.1.15';

test('Phantom\'s own documented example is reproduced byte for byte', () => {
  // docs.phantom.com/phantom-deeplinks/other-methods/browse, read Oct 13 2026.
  const [phantom] = walletBrowseLinks('https://magiceden.io/item-details/8yjN8iRuoiYiKW487cnW9vn6mLBR5E8aCNKsBRmTP9vN');
  assert.deepEqual(phantom, { name: 'Phantom', href: 'https://phantom.com/ul/browse/https%3A%2F%2Fmagiceden.io%2Fitem-details%2F8yjN8iRuoiYiKW487cnW9vn6mLBR5E8aCNKsBRmTP9vN?ref=https%3A%2F%2Fmagiceden.io' });
});

test('each wallet opens the mint with the page and the asking site encoded whole', () => {
  const page = 'https://optimism.fit/app/warm.html?a=1&b=2#mint', links = walletBrowseLinks(new URL(page));
  assert.deepEqual(links.map(link => link.name), ['Phantom', 'Solflare', 'Backpack']);
  assert.deepEqual(links.map(link => link.href), [
    'https://phantom.com/ul/browse/https%3A%2F%2Foptimism.fit%2Fapp%2Fwarm.html%3Fa%3D1%26b%3D2%23mint?ref=https%3A%2F%2Foptimism.fit',
    'https://solflare.com/ul/v1/browse/https%3A%2F%2Foptimism.fit%2Fapp%2Fwarm.html%3Fa%3D1%26b%3D2%23mint?ref=https%3A%2F%2Foptimism.fit',
    'https://backpack.app/ul/v1/browse/https%3A%2F%2Foptimism.fit%2Fapp%2Fwarm.html%3Fa%3D1%26b%3D2%23mint?ref=https%3A%2F%2Foptimism.fit',
  ]);
  for (const { href } of links) {
    // One path segment and one parameter: nothing of the page leaks into the link's own query or fragment.
    const link = new URL(href);
    assert.equal(decodeURIComponent(link.pathname.split('/browse/')[1]), page);
    assert.deepEqual([...link.searchParams], [['ref', 'https://optimism.fit']]);
    assert.equal(link.hash, '');
  }
});

test('phones and tablets are told apart from desktops, including an iPad that reports a Mac', () => {
  assert.equal(isPhone({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1', platform: 'iPhone', maxTouchPoints: 5 }), true);
  assert.equal(isPhone({ userAgent: 'Mozilla/5.0 (Linux; Android 15; Pixel 9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Mobile Safari/537.36', platform: 'Linux armv81', maxTouchPoints: 5 }), true);
  assert.equal(isPhone({ userAgent: mac, platform: 'MacIntel', maxTouchPoints: 5 }), true);
  assert.equal(isPhone({ userAgent: mac, platform: 'MacIntel', maxTouchPoints: 0 }), false);
  assert.equal(isPhone({ userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36', platform: 'Win32', maxTouchPoints: 10 }), false);
  assert.equal(isPhone(), false);
});

// HER OWN WALLET (Oct 14 2026, his 08:3x "THE USER JOURNEY OF DYSONLIGHT HARMONY IS THAT THE FUCKING LYSSAJUDRON HAS GOT ITS OWN FUCKING WALLET"):
// Harmony's link names her in the fragment and the checkout takes her wallet alone. Invented addresses only.
const her = 'So11111111111111111111111111111111111111112', other = 'AJdsmjxQjHnBxDEdRxwEk2UMRW7bgNmvEMUwMziRTyab';
test('her address is read from #mint:for=<address> only, 32 bytes of base58, never the treasury, the system or the memo program', () => {
  assert.equal(herAddressOf(`#mint:for=${her}`), her);
  for (const hash of ['', '#mint', '#oath-sphere', `#mint:for=${her}x`, `#mint:for=${her.slice(0, 20)}`, `#mint:for=0OIl${her.slice(4)}`, `#MINT:FOR=${her}`,
    `#mint:for=${her}&more=1`, `?for=${her}`, `#mint:for=${RECIPIENT}`, `#mint:for=${SYSTEM}`, `#mint:for=${MEMO}`, null, undefined]) assert.equal(herAddressOf(hash), null, String(hash));
});

test('the wallet\'s own browser opens the mint with her name; a plain visit keeps #mint', () => {
  assert.equal(mintHash(her), `mint:for=${her}`); assert.equal(mintHash(null), 'mint');
  const page = new URL('https://optimism.fit/app/warm.html'); page.hash = mintHash(her);
  for (const { href } of walletBrowseLinks(page)) {
    const opened = new URL(decodeURIComponent(new URL(href).pathname.split('/browse/')[1]));
    assert.equal(herAddressOf(opened.hash), her, 'her name survives the hop to the phone');
  }
});

test('her wallet alone may buy: another wallet is told hers and reads nothing; with no her named, any wallet as before', () => {
  assert.equal(notHers(her, her), null); assert.equal(notHers(other, null), null);
  assert.match(notHers(other, her), /^This wallet \(AJds…Tyab\) is not hers\. Her wallet is So11…1112: .*her words imported/);
  const src = readFileSync(new URL('../app/dl-direct.js', import.meta.url), 'utf8');
  const body = name => { const at = src.indexOf(`async function ${name}()`); return at < 0 ? '' : src.slice(at, src.indexOf('\n}\n', at)); };
  // the wallet is reached in one place (reach()), and refused there; both roads, a seat's Connect and the holder's road (THE HOLDER'S ROAD,
  // Oct 15 2026), reach it first: refused before any storage or receipt is read
  const reach = body('reach'), connect = body('connect'), holder = body('holder');
  assert.ok(reach.indexOf('notHers(buyer, her)') > 0, 'refused where the wallet is reached');
  assert.match(reach, /mint\.hash = mintHash\(her\)/);
  assert.ok(connect.indexOf('await reach();') > 0 && connect.indexOf('await reach();') < connect.indexOf('localStorage.getItem'), 'a seat: refused before any storage or receipt is read');
  assert.ok(holder.indexOf('await reach();') > 0 && holder.indexOf('await reach();') < holder.indexOf('receipts()'), 'the holder\'s road: refused before any receipt is read');
  assert.match(src, /her = herAddressOf\(location\.hash\);/);
  const warm = readFileSync(new URL('../app/warm.html', import.meta.url), 'utf8');
  assert.match(warm, /!location\.hash\.startsWith\('#mint:for='\)/, 'a reload keeps her fragment');
});

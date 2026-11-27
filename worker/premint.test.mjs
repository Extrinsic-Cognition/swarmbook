import test from 'node:test';
import assert from 'node:assert/strict';
import { d1, migrated, migrations } from './d1-on-sqlite.mjs';   // D1's surface on node:sqlite, a database built by the migrations named
import { createHandler } from './premint.mjs';
import { MINT_CLOSES as SET } from '../app/dl-paywall.js'; const MINT_CLOSES = '2026-11-18T00:00:00+00:00';   // AFTER THE MINT: the front doors either side of the window's close
import { REFERRAL_LENGTH, CLAIM_LENGTH, isReferralCode, isClaimCode, shareURL, claimURL, groupCode, randomCode } from '../app/dl-society-codes.mjs';
import { VISIT_LENGTH } from '../app/dl-visit.mjs';
import { referralModel } from '../vendor/embertide-app/ui/intro/room/society-referrals.mjs';
import { RECIPIENT, GENESIS, SEAT_PROOF_DAYS, SEAT_STATEMENT, encode58, decode58, quoteLamports, paymentMessage, base64, validateSignedPayment, validateFinalizedPayment, seatMessage, seatSignIn, sealSeatProof, seatFields, verifySeatProof } from '../app/dl-direct-protocol.mjs';
const keys = await crypto.subtle.generateKey('Ed25519', true, ['sign','verify']);
const buyer = encode58(new Uint8Array(await crypto.subtle.exportKey('raw', keys.publicKey)));
const id = 'deadcafe-0000-4000-8000-000000000001';
const blockhash = encode58(new Uint8Array(32).fill(7));
async function sign(o) { const message = paymentMessage(o), signature = new Uint8Array(await crypto.subtle.sign('Ed25519', keys.privateKey, message)); return { encoded: base64(Uint8Array.from([1,...signature,...message])), signature: encode58(signature) }; }
// THE SEAT PROOF: a sign-in as the checkout writes it (fields in Sign In With Solana's order), signed by a key; `seat` is the buyer's own, now
const DAY = 86400000, SITE = { host: 'optimism.fit', origin: 'https://optimism.fit' };
const signIn = (address, { host = SITE.host, origin = SITE.origin, issued = Date.now(), days = SEAT_PROOF_DAYS, nonce = 'Nonce12345678' } = {}) =>
  ({ domain: host, address, uri: origin, nonce, issuedAt: new Date(issued).toISOString(), expiresAt: new Date(issued + days * DAY).toISOString() });
const signText = async (pair, text) => sealSeatProof(text, new Uint8Array(await crypto.subtle.sign('Ed25519', pair.privateKey, new TextEncoder().encode(text))));
const seat = (pair = keys, address = buyer, opts) => signText(pair, seatMessage(signIn(address, opts)));
// Every migration in order, as D1 applies them; `through` stops early to stand for a database that is behind.
function setup({ through = migrations.length, chairs, clockMs, closes } = {}) {
 const db = migrated(migrations.slice(0, through));
 const state = { tx: null, height: 100, sends: 0, broadcasts: [], time: 1000, genesis: GENESIS, sendThrows: false, priceThrows: false, down: new Set(), downThrows: false, tried: [] };
 const DB = d1(db);
 const env = { DB, PREMINT_ENABLED: 'true', ASSETS: { fetch: () => new Response('asset') } };
 const handle = createHandler({ clock: () => state.time, chairs, clockMs, closes, fetcher: async (url, opts) => {
   if (url.includes('coinbase')) { if (state.priceThrows) throw new Error('price down'); return Response.json({ data: { base:'SOL',currency:'USD',amount:'100' } }); }
   state.tried.push(url); if (state.down.has(url)) { if (state.downThrows) throw new Error('node down'); return new Response('down', { status: 503 }); }
   const { method } = JSON.parse(opts.body); let result;
   if (method === 'getGenesisHash') result = state.genesis;
   else if (method === 'getLatestBlockhash') result = { value: { blockhash, lastValidBlockHeight: 200 } };
   else if (method === 'getTransaction') result = state.tx;
   else if (method === 'getBlockHeight') result = state.height;
   else if (method === 'getSignatureStatuses') result = { value: [null] };
   else if (method === 'sendTransaction') { state.sends++; state.broadcasts.push(JSON.parse(opts.body).params[0]); if (state.sendThrows) throw new Error('lost response'); result = state.signature; }
   else throw new Error(method);
   return Response.json({ result });
 } });
 const call = async (path, data, origin='https://optimism.fit', headers={}) => { const response = await handle(new Request('https://optimism.fit/api/premint/'+path, { method:data===undefined?'GET':'POST', headers:data===undefined?headers:{origin,'content-type':'application/json'}, body:data===undefined?undefined:JSON.stringify(data) }), env); return { status: response.status, body: await response.json() }; };
 const create = async (overrides={}) => call('orders',{id,tier:'bronze',buyer,github:'',profile:null,...overrides});
 return { db,state,env,call,create,handle };
}
test('decimal pricing rounds upward by at most one lamport', () => { assert.equal(quoteLamports(10,'100'),'100000000'); assert.equal(quoteLamports(1000,'100'),'10000000000'); assert.equal(quoteLamports(10,'3'),'3333333334'); for(const p of ['0','NaN','-1','1e2']) assert.throws(()=>quoteLamports(10,p)); });
test('canonical base58 handles leading zeroes and rejects wrong length',()=> { const b=new Uint8Array(32); b[31]=3; assert.deepEqual(decode58(encode58(b),32),b); assert.throws(()=>decode58('0',32)); });
test('signed bytes reject altered recipient, amount, signer, blockhash and extra instruction',async()=> { const {create}=setup(); const o=(await create()).body.order; const signed=await sign(o); assert.equal(await validateSignedPayment(o,signed.encoded),signed.signature); for(const change of [{lamports:'1'},{blockhash:encode58(new Uint8Array(32).fill(8))},{buyer:encode58(new Uint8Array(32).fill(8))},{recipient:buyer}]) await assert.rejects(validateSignedPayment({...o,...change},signed.encoded)); const raw=Uint8Array.from(atob(signed.encoded),c=>c.charCodeAt(0)); raw[1]^=1; await assert.rejects(validateSignedPayment(o,base64(raw))); await assert.rejects(validateSignedPayment(o,base64(Uint8Array.from([...raw,0])))); });
test('finalized successful exact transaction alone grants access, even after quote expiry',async()=> { const s=setup(); const o=(await s.create()).body.order; const signed=await sign(o); s.state.signature=signed.signature; assert.equal((await s.call(`orders/${id}/submit`,{signedTransaction:signed.encoded})).body.order.status,'submitted'); assert.equal((await s.call(`orders/${id}/verify`,{})).body.order.status,'submitted'); s.state.time=5000; s.state.tx={transaction:[signed.encoded,'base64'],meta:{err:null},slot:123}; const paid=await s.call(`orders/${id}/verify`,{}); assert.equal(paid.body.order.status,'paid'); assert.equal(paid.body.order.paidSlot,123); assert.equal((await s.call(`receipts?buyer=${buyer}`,undefined,undefined,{'x-seat':await seat()})).body.orders.length,1); assert.equal((await s.call(`orders/${id}/submit`,{})).body.order.status,'paid'); assert.equal(new Set(s.state.broadcasts).size,1); assert.equal(s.state.broadcasts[0],signed.encoded); });
test('concurrent submits and lost responses only rebroadcast identical signed bytes',async()=> { const s=setup(); const o=(await s.create()).body.order; const signed=await sign(o); s.state.signature=signed.signature; s.state.sendThrows=true; await Promise.all([1,2,3].map(()=>s.call(`orders/${id}/submit`,{signedTransaction:signed.encoded}))); assert.equal(new Set(s.state.broadcasts).size,1); assert.equal(s.state.broadcasts[0],signed.encoded); const recovery=await s.call(`receipts?buyer=${buyer}`,undefined,undefined,{'x-seat':await seat()}); assert.equal(recovery.body.orders[0].signature,signed.signature); s.state.tx={transaction:[signed.encoded,'base64'],meta:{err:null},slot:130}; assert.equal((await s.call(`orders/${id}/verify`,{})).body.order.status,'paid'); });
test('wrong network, unavailable price, invalid profiles and cross-origin fail closed',async()=> { const s=setup(); assert.equal((await s.call('orders',{},'https://evil.example')).status,403); assert.equal((await s.create({profile:{handle:'x',avatarUrl:'https://evil.example/p.png'}})).status,400); s.state.genesis='devnet'; assert.equal((await s.create()).status,503); assert.equal(s.db.prepare('SELECT count(*) n FROM premint_orders').get().n,0); s.state.genesis=GENESIS; s.state.priceThrows=true; assert.equal((await s.create()).status,503); });
test('immutable idempotent order and no unpaid personal profile leakage',async()=> { const s=setup(); const a=await s.create({github:'example',profile:{handle:'example',avatarUrl:'https://pbs.twimg.com/profile_images/123/photo.jpg'}}); const b=await s.create({github:'other'}); assert.deepEqual(a.body.order,b.body.order); assert.equal((await s.create({tier:'gold'})).status,409); assert.equal((await s.call('holders')).body.holders.length,0); const raw=JSON.stringify((await s.call(`orders/${id}`)).body); assert.ok(!raw.includes('photo.jpg')); assert.ok(!raw.includes('github')); });
test('no paid receipt for failed, expired, or mismatched ledger transaction',async()=> { for(const mode of ['failed','expired','mismatch']) { const s=setup(); const o=(await s.create()).body.order; const signed=await sign(o); s.state.signature=signed.signature; await s.call(`orders/${id}/submit`,{signedTransaction:signed.encoded}); if(mode==='failed') s.state.tx={meta:{err:{InstructionError:[0,'error']}},slot:123}; if(mode==='expired') s.state.height=201; if(mode==='mismatch') { const wrong=await sign({...o,lamports:'1'}); s.state.tx={transaction:[wrong.encoded,'base64'],meta:{err:null},slot:123}; } const result=await s.call(`orders/${id}/verify`,{}); assert.notEqual(result.body.order?.status,'paid'); assert.equal(s.db.prepare("SELECT count(*) n FROM premint_orders WHERE status='paid'").get().n,0); } });
test('expired quote cannot broadcast and pause keeps receipt lookup available',async()=> { const s=setup(); const o=(await s.create()).body.order; s.state.time=2000; const signed=await sign(o); assert.equal((await s.call(`orders/${id}/submit`,{signedTransaction:signed.encoded})).status,409); assert.equal(s.state.sends,0); s.env.PREMINT_ENABLED='false'; assert.equal((await s.create()).status,503); assert.equal((await s.call(`orders/${id}`)).status,200); });
test('consented profiles become public only after finalized payment',async()=> { const s=setup(); const o=(await s.create({profile:{handle:'example',avatarUrl:'https://pbs.twimg.com/profile_images/123/photo.jpg'}})).body.order; const signed=await sign(o); s.state.signature=signed.signature; await s.call(`orders/${id}/submit`,{signedTransaction:signed.encoded}); assert.equal((await s.call('holders')).body.holders.length,0); s.state.tx={transaction:[signed.encoded,'base64'],meta:{err:null},slot:140}; await s.call(`orders/${id}/verify`,{}); assert.equal((await s.call('holders')).body.holders[0].handle,'example'); });

test('old missing ledger history never becomes a false unpaid order',async()=> { const s=setup(); const o=(await s.create()).body.order; const signed=await sign(o); s.state.signature=signed.signature; await s.call(`orders/${id}/submit`,{signedTransaction:signed.encoded}); s.state.height=300; s.state.time=10000; assert.equal((await s.call(`orders/${id}/verify`,{})).body.order.status,'submitted'); });

test('a late ledger result still finalizes the original unresolved payment',async()=> { const s=setup(); const o=(await s.create()).body.order; const signed=await sign(o); s.state.signature=signed.signature; await s.call(`orders/${id}/submit`,{signedTransaction:signed.encoded}); s.state.height=300; assert.equal((await s.call(`orders/${id}/verify`,{})).body.order.status,'submitted'); s.state.tx={transaction:[signed.encoded,'base64'],meta:{err:null},slot:140}; assert.equal((await s.call(`orders/${id}/verify`,{})).body.order.status,'paid'); });

test('a buyer email is optional, validated, trimmed and stored with the order it was given to',async()=> { const s=setup(); const stored=order=>s.db.prepare('SELECT email FROM premint_orders WHERE id=?').get(order).email; assert.equal((await s.create({email:'  Buyer.Name+dyson@mail.example.co.uk \n'})).status,200); assert.equal(stored(id),'Buyer.Name+dyson@mail.example.co.uk'); assert.equal((await s.create({email:'other@example.com'})).status,200); assert.equal(stored(id),'Buyer.Name+dyson@mail.example.co.uk'); for(const [n,email] of [undefined,null,'','   ',42,{}].entries()) { const other=`deadcafe-0000-4000-8000-00000000010${n}`; assert.equal((await s.create({id:other,email})).status,200); assert.equal(stored(other),null); } const before=s.db.prepare('SELECT count(*) n FROM premint_orders').get().n; for(const email of ['buyer','buyer@example','buyer@@example.com','bu yer@example.com','buyer@example.com,spy@example.com','<buyer@example.com>','buyer@example.com\r\nbcc:spy@example.com','=cmd@example.com','.buyer@example.com','buyer@-','b'.repeat(250)+'@example.com']) { const refused=await s.create({id:'deadcafe-0000-4000-8000-000000000200',email}); assert.equal(refused.status,400,email); assert.equal(refused.body.error,'Use a valid email or leave it empty.'); } assert.equal(s.db.prepare('SELECT count(*) n FROM premint_orders').get().n,before); });

test('the stored email is in no public response, before or after payment',async()=> { const s=setup(), email='private.buyer@contact.example', seen=[]; const call=async(...request)=> { const response=await s.call(...request); seen.push(JSON.stringify(response.body)); return response; }; const o=(await call('orders',{id,tier:'bronze',buyer,github:'',email,profile:{handle:'example',avatarUrl:'https://pbs.twimg.com/profile_images/123/photo.jpg'}})).body.order; const signed=await sign(o); s.state.signature=signed.signature; await call(`orders/${id}`); await call('holders'); await call(`orders/${id}/submit`,{signedTransaction:signed.encoded}); await call(`receipts?buyer=${buyer}`,undefined,undefined,{'x-seat':await seat()}); s.state.tx={transaction:[signed.encoded,'base64'],meta:{err:null},slot:150}; assert.equal((await call(`orders/${id}/verify`,{})).body.order.status,'paid'); assert.equal((await call('holders')).body.holders.length,1); assert.equal((await call(`receipts?buyer=${buyer}`,undefined,undefined,{'x-seat':await seat()})).body.orders.length,1); await call(`orders/${id}`); await call('availability'); assert.equal(s.db.prepare('SELECT email FROM premint_orders WHERE id=?').get(id).email,email); assert.equal(seen.length,10); for(const raw of seen) { assert.ok(!raw.includes('private.buyer')); assert.ok(!raw.includes('contact.example')); assert.ok(!/email/i.test(raw)); } });

test('a database without the email column reports checkout unavailable, takes no order and still serves receipts',async()=> { const s=setup({through:1}); assert.equal((await s.call('availability')).status,503); assert.equal((await s.create({email:'buyer@example.com'})).status,503); assert.equal((await s.create()).status,503); assert.equal(s.db.prepare('SELECT count(*) n FROM premint_orders').get().n,0); s.db.prepare("INSERT INTO premint_orders(id,tier,buyer,recipient,lamports,sol_usd,created_at,expires_at,blockhash,last_valid_block_height,terms_version,github,signature,status) VALUES(?,'bronze',?,?,'100000000','100',1000,1090,?,200,'premint-direct-v1','',?,'submitted')").run(id,buyer,RECIPIENT,blockhash,encode58(new Uint8Array(64).fill(9))); assert.equal((await s.call(`orders/${id}`)).body.order.status,'submitted'); assert.equal((await s.call(`receipts?buyer=${buyer}`,undefined,undefined,{'x-seat':await seat()})).body.orders.length,1); assert.equal((await s.call(`orders/${id}/verify`,{})).body.order.status,'submitted'); const current=await setup().call('availability'); assert.equal(current.status,200); assert.equal(current.body.enabled,true); });

// THE SEAT PROOF (Oct 15 2026): an order id is in its payment's memo on mainnet, so it opens nothing and leaves the Worker only to the wallet's
// own signature. Before this, /holders listed every paid order's id and /receipts gave any address's ids to anyone.
test('an order id leaves the Worker only to its wallet\'s signature: /holders names none, /receipts asks the wallet\'s seat proof',async()=> {
 const s=setup(), o=(await s.create({profile:{handle:'example',avatarUrl:'https://pbs.twimg.com/profile_images/123/photo.jpg'}})).body.order, signed=await sign(o);
 s.state.signature=signed.signature; await s.call(`orders/${id}/submit`,{signedTransaction:signed.encoded}); s.state.tx={transaction:[signed.encoded,'base64'],meta:{err:null},slot:160};
 assert.equal((await s.call(`orders/${id}/verify`,{})).body.order.status,'paid');
 assert.ok(o.memo.includes(id),'the id is in the memo every finalized payment carries on mainnet: public');
 // the sphere's holders: each keyed by its payment's signature (public on mainnet), never by its order id
 const holders=await s.call('holders');
 assert.equal(holders.body.holders.length,1); assert.equal(holders.body.holders[0].id,signed.signature); assert.equal(holders.body.holders[0].handle,'example');
 assert.ok(!JSON.stringify(holders.body).includes(id),'no order id in /holders');
 // a wallet's receipts: refused without its proof, and with any proof that is not its own, fresh, for this site
 const other=await crypto.subtle.generateKey('Ed25519',true,['sign','verify']), otherAddress=encode58(new Uint8Array(await crypto.subtle.exportKey('raw',other.publicKey)));
 const refused={ 'no proof':{}, 'an order id':{'x-seat':id}, 'the id in the old header':{'x-receipt':id}, 'another wallet\'s own proof':{'x-seat':await seat(other,otherAddress)},
  'this wallet named, another key signing':{'x-seat':await seat(other,buyer)}, 'expired':{'x-seat':await seat(keys,buyer,{issued:Date.now()-SEAT_PROOF_DAYS*DAY-1000})},
  'another site':{'x-seat':await seat(keys,buyer,{host:'evil.example',origin:'https://evil.example'})}, 'the payment\'s own signature':{'x-seat':signed.signature} };
 for(const [name,headers] of Object.entries(refused)) {
  const r=await s.call(`receipts?buyer=${buyer}`,undefined,undefined,headers);
  assert.equal(r.status,401,name); assert.equal(r.body.error,'Sign in with this wallet to see its purchases.'); assert.ok(!JSON.stringify(r.body).includes(id),`${name}: no id`);
 }
 // another wallet's own proof reads that wallet's receipts (none), never this one's
 const theirs=await s.call(`receipts?buyer=${otherAddress}`,undefined,undefined,{'x-seat':await seat(other,otherAddress)});
 assert.equal(theirs.status,200); assert.deepEqual(theirs.body.orders,[]);
 // the buyer's own fresh proof: the receipt, its id included
 const mine=await s.call(`receipts?buyer=${buyer}`,undefined,undefined,{'x-seat':await seat()});
 assert.equal(mine.status,200); assert.equal(mine.body.orders.length,1); assert.equal(mine.body.orders[0].id,id); assert.equal(mine.body.orders[0].status,'paid');
});

test('the seat proof is the exact Sign In With Solana text for this host and origin, signed by the wallet it names, issued now, for at most 30 days',async()=> {
 const now=Date.now(), text=seatSignIn({...SITE,address:buyer,now});
 const lines=text.split('\n');
 assert.deepEqual(lines.slice(0,4),['optimism.fit wants you to sign in with your Solana account:',buyer,'',SEAT_STATEMENT]);
 assert.deepEqual(lines.slice(4,8),['','URI: https://optimism.fit','Version: 1','Chain ID: mainnet']);
 assert.match(lines[8],/^Nonce: [1-9A-HJ-NP-Za-km-z]{8,}$/); assert.equal(lines[9],`Issued At: ${new Date(now).toISOString()}`); assert.equal(lines[10],`Expiration Time: ${new Date(now+30*DAY).toISOString()}`);
 assert.equal(lines.length,11); assert.notEqual(seatSignIn({...SITE,address:buyer,now}),text,'a fresh nonce each sign-in');
 const proof=await signText(keys,text), at={...SITE,now};
 assert.deepEqual(await verifySeatProof(proof,at),{buyer,expires:now+30*DAY});
 assert.equal(seatFields(proof).address,buyer); assert.equal(seatFields(proof).expires,now+30*DAY);
 const other=await crypto.subtle.generateKey('Ed25519',true,['sign','verify']);
 const no=async (name,p,when=at)=>assert.equal(await verifySeatProof(p,when),null,name);
 await no('another host',proof,{...at,host:'www.optimism.fit'}); await no('another origin',proof,{...at,origin:'http://optimism.fit'});
 await no('the instant it expires',proof,{...at,now:now+30*DAY}); assert.ok(await verifySeatProof(proof,{...at,now:now+30*DAY-1}),'its last millisecond');
 await no('issued more than ten minutes ahead of the Worker',await seat(keys,buyer,{issued:now+11*60000}));
 assert.ok(await verifySeatProof(await seat(keys,buyer,{issued:now+9*60000}),at),'a device clock nine minutes ahead');
 await no('valid for more than 30 days',await seat(keys,buyer,{issued:now,days:31})); await no('expiring when issued',await seat(keys,buyer,{issued:now,days:0}));
 await no('signed by another key',await signText(other,text));
 // the text, byte for byte: any change of what was signed, or of how it is written, is no proof
 const signature=proof.split('.')[1], reseal=(t)=>sealSeatProof(t,decode58(signature,64));
 await no('its expiry moved',reseal(text.replace(/Expiration Time: .*/,`Expiration Time: ${new Date(now+300*DAY).toISOString()}`)));
 await no('another statement',reseal(text.replace(SEAT_STATEMENT,'Approve.')));
 await no('another wallet named',reseal(text.replace(buyer,RECIPIENT)));
 await no('a trailing newline',reseal(text+'\n'));
 for(const bad of [null,undefined,'',id,signature,proof+'.x',`${proof.split('.')[0]}.`,`.${signature}`,proof.replace(/^./,'!'),proof.slice(0,-1),'a'.repeat(3000)]) await no(String(bad).slice(0,30),bad);
});
// TWO NODES (Oct 17 2026): a Solana node that does not answer hands the request to the next; with both down the checkout fails closed as before
test('a Solana node that does not answer hands the request to the second; both down fail closed', async () => {
  const s = setup(), first = 'https://api.mainnet-beta.solana.com', second = 'https://solana-rpc.publicnode.com';
  s.state.down.add(first);
  assert.equal((await s.call('availability')).status, 200);
  assert.deepEqual(s.state.tried.slice(0, 2), [first, second]);
  s.state.downThrows = true; s.state.tried.length = 0;
  assert.equal((await s.call('availability')).status, 200);
  assert.deepEqual(s.state.tried.slice(0, 2), [first, second]);
  s.state.down.add(second);
  const both = await s.call('availability');
  assert.equal(both.status, 503); assert.match(both.body.error, /temporarily unavailable/);
  const t = setup(); t.env.SOLANA_RPC = 'https://a.example'; t.env.SOLANA_RPC_2 = 'https://b.example'; t.state.down.add('https://a.example');
  assert.equal((await t.call('availability')).status, 200);
  assert.deepEqual(t.state.tried.slice(0, 2), ['https://a.example', 'https://b.example']);
  const u = setup(); u.env.SOLANA_RPC = 'https://solana-rpc.publicnode.com';
  assert.equal((await u.call('availability')).status, 200);
  assert.deepEqual(u.state.tried.slice(0, 1), ['https://solana-rpc.publicnode.com']);
});
// SWARMY'S TANK (his Oct 17 2026: "30% of every seat goes into Swarmy's tank"; $3 a month): paid seats to the pinned recipient only, at the request
test('the tank is 30% of the seats paid to the recipient, in whole $1 months of Swarmy', async () => {
  const s = setup();
  assert.deepEqual((await s.call('tank')).body, { share: 0.3, rationUsd: 1, seats: { bronze: 0, gold: 0 }, usd: 0, months: 0 });
  const ids = [1, 2, 3, 4, 5].map(n => `deadcafe-0000-4000-8000-00000000001${n}`), tiers = ['bronze', 'bronze', 'gold', 'bronze', 'gold'];
  for (const [i, tier] of tiers.entries()) assert.equal((await s.call('orders', { id: ids[i], tier, buyer, github: '', profile: null })).status, 200);
  const set = (id, sql) => s.db.prepare(`UPDATE premint_orders SET ${sql} WHERE id=?`).run(id);
  for (const id of ids.slice(0, 3)) set(id, "status='paid'");
  set(ids[3], "status='submitted'");
  set(ids[4], "status='paid', recipient='11111111111111111111111111111112'");
  const t = await s.call('tank');
  assert.equal(t.status, 200);
  assert.deepEqual(t.body, { share: 0.3, rationUsd: 1, seats: { bronze: 2, gold: 1 }, usd: 306, months: 306 });
});

// THE TWELVE CHAIRS (app/mint-chairs.mjs): GET /api/premint/chairs ranks the seven days' top donors at the request, by his rule, from the
// seats paid to the pinned recipient (as the tank counts them) and quoted before the close; nothing ranks before he rules, and no wallet
// address leaves.
test('the twelve chairs: unranked until his rule, then the top donors of the paid seats quoted before the close, no wallet named', async () => {
 const launch = '2026-10-20T00:00:00+01:00', start = Date.parse(launch), close = start + 7 * DAY;
 const paid = (s, n, wallet, tier, quotedMs, slot, { status = 'paid', handle = null, recipient = RECIPIENT } = {}) => s.db.prepare("INSERT INTO premint_orders(id,tier,buyer,recipient,lamports,sol_usd,created_at,expires_at,blockhash,last_valid_block_height,terms_version,github,handle,avatar_url,signature,status,paid_slot,paid_at) VALUES(?,?,?,?,'1','100',?,?,?,200,'premint-direct-v1','',?,?,?,?,?,?)")
  .run(`deadcafe-0000-4000-8000-0000000003${String(n).padStart(2, '0')}`, tier, wallet, recipient, Math.floor(quotedMs / 1000), Math.floor(quotedMs / 1000) + 90, blockhash,
   handle, handle ? 'https://pbs.twimg.com/profile_images/123/photo.jpg' : null, encode58(new Uint8Array(64).fill(n)), status, status === 'paid' ? slot : null, status === 'paid' ? Math.floor(quotedMs / 1000) + 20 : null);
 const fill = s => {
  paid(s, 1, 'WalletAaaa', 'bronze', start + DAY, 500); paid(s, 2, 'WalletAaaa', 'bronze', start + 2 * DAY, 600);
  paid(s, 3, 'WalletBbbb', 'gold', start + 3 * DAY, 700, { handle: 'example' }); paid(s, 4, 'WalletCcccc', 'bronze', start + 1000, 400);
  paid(s, 5, 'WalletDddd', 'gold', close + 1000, 900); paid(s, 6, 'WalletEeee', 'gold', start + 4 * DAY, 0, { status: 'submitted' });
  paid(s, 7, 'WalletFfff', 'gold', start + 2 * DAY, 650, { recipient: '11111111111111111111111111111112' });   // paid elsewhere: no seat of the mint
 };
 // unranked: his rule unanswered (the house's constants today), and nothing at all read from the orders
 const unruled = setup(); fill(unruled);
 const none = await unruled.call('chairs');
 assert.equal(none.status, 200); assert.equal(none.body.chairs, 12); assert.equal(none.body.rule, null); assert.equal(none.body.phase, 'unset'); assert.deepEqual(none.body.held, []);
 // "sum", the seven days open: B $1,000, A $20, C $10; the gold quoted after the close, the unpaid order and the gold paid to another
 // address count for nothing
 const open = setup({ chairs: { rule: 'sum', shows: 'gold', launch }, clockMs: () => start + 5 * DAY }); fill(open);
 const during = await open.call('chairs');
 assert.equal(during.body.phase, 'open'); assert.equal(during.body.opensAt, start); assert.equal(during.body.closesAt, close);
 assert.deepEqual(during.body.held, [{ rank: 1, usd: 1000 }, { rank: 2, usd: 20 }, { rank: 3, usd: 10 }]);
 assert.ok(!/Wallet|example|pbs\.twimg/.test(JSON.stringify(during.body)), 'no wallet, name or avatar in a gold-only answer');
 // after the close the chairs stand as they were at it, and a profile shows where he rules "profile" and the buyer gave one
 const after = setup({ chairs: { rule: 'sum', shows: 'profile', launch }, clockMs: () => close + DAY }); fill(after);
 const closed = await after.call('chairs');
 assert.equal(closed.body.phase, 'closed');
 assert.deepEqual(closed.body.held, [{ rank: 1, usd: 1000, handle: 'example', avatarUrl: 'https://pbs.twimg.com/profile_images/123/photo.jpg' }, { rank: 2, usd: 20 }, { rank: 3, usd: 10 }]);
 assert.ok(!JSON.stringify(closed.body).includes('Wallet'), 'no wallet address');
 // "single": each wallet's largest seat; the launch day unset counts every paid seat (the gold after the close too)
 const single = setup({ chairs: { rule: 'single', shows: 'gold', launch: null } }); fill(single);
 assert.deepEqual((await single.call('chairs')).body.held.map(c => c.usd), [1000, 1000, 10, 10]);
});

// THE SOCIETY'S CODES (Oct 16 2026; app/dl-society-codes.mjs, migration 0003_premint_society.sql): a friend's referral code frozen on the order at
// its making, a code for each paid seat, the claim code drawn by the buyer and redeemed once by Harmony for the seat's token, the ticket and
// its referrals as the box's card (room/society-referrals.mjs) reads them. The stand-ins: a second wallet (the friend), a third (her).
const RAW = 'https://optimism.fit';
const raw = (s, path, { method = 'GET', headers = {}, body } = {}) => s.handle(new Request(RAW + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) }), s.env)
  .then(async r => ({ status: r.status, headers: r.headers, body: r.status === 302 ? null : await r.json().catch(() => null) }));
const payDirect = (s, orderId, signature) => s.db.prepare("UPDATE premint_orders SET status='paid', signature=?, paid_slot=160, paid_at=? WHERE id=?").run(signature, s.state.time + 1, orderId);
const another = async () => { const pair = await crypto.subtle.generateKey('Ed25519', true, ['sign','verify']); return { pair, address: encode58(new Uint8Array(await crypto.subtle.exportKey('raw', pair.publicKey))) }; };
const FRIEND_ID = 'deadcafe-0000-4000-8000-00000000f001', HER = 'So11111111111111111111111111111111111111112';
// setup()'s call() drops custom headers on a POST: the claim is drawn through the raw door, origin and proof given
const draw = (s, orderId, proof) => raw(s, `/api/premint/tickets/${orderId}/claim`, { method: 'POST', headers: { origin: RAW, 'content-type': 'application/json', ...(proof ? { 'x-seat': proof } : {}) }, body: {} });

test('a friend\'s referral code is frozen on the order at its making; no code, a word that is no code, a code never issued and the buyer\'s own are refused with the reason', async () => {
  const s = setup(), friend = await another();
  // the seat before it is paid: no ticket, no code
  assert.equal((await s.create()).status, 200);
  assert.equal((await s.call(`seat?buyer=${buyer}`, undefined, undefined, { 'x-seat': await seat() })).body.tickets.length, 0, 'an unpaid order is no seat');
  payDirect(s, id, 'sig-a');
  const mine = await s.call(`seat?buyer=${buyer}`, undefined, undefined, { 'x-seat': await seat() });
  assert.equal(mine.status, 200); assert.equal(mine.body.tickets.length, 1);
  const t = mine.body.tickets[0];
  assert.ok(isReferralCode(t.code), t.code); assert.equal(t.shareURL, shareURL(t.code)); assert.equal(t.schema, 'society.ticket/1');
  assert.deepEqual([t.orderId, t.tier, t.buyer, t.holder, t.claimed, t.claimedAt, t.paymentSignature], [id, 'bronze', buyer, null, false, null, 'sig-a']);
  assert.deepEqual(t.referrals, { schema: 'society.referrals/1', state: 'ready', code: t.code, shareURL: shareURL(t.code), referrer: buyer, receipts: [] });
  assert.equal((await s.call(`seat?buyer=${buyer}`, undefined, undefined, { 'x-seat': await seat() })).body.tickets[0].code, t.code, 'the code is the seat\'s for good');
  assert.equal((await s.call(`seat?buyer=${buyer}`)).status, 401, 'the seat to its own proof alone');
  assert.equal((await s.call(`seat?buyer=${buyer}`, undefined, undefined, { 'x-seat': await seat(friend.pair, friend.address) })).status, 401);
  // the friend's order, made with the code as a hand types it: frozen to this seat before any payment
  const made = await s.call('orders', { id: FRIEND_ID, tier: 'gold', buyer: friend.address, github: '', profile: null, referral: ` ${groupCode(t.code).toLowerCase()} ` });
  assert.equal(made.status, 200, JSON.stringify(made.body));
  assert.equal(made.body.order.referred, true); assert.ok(!JSON.stringify(made.body).includes(id), 'the referrer\'s order id leaves nowhere');
  assert.equal(s.db.prepare('SELECT referred_by FROM premint_orders WHERE id=?').get(FRIEND_ID).referred_by, id);
  const again = await s.call('orders', { id: FRIEND_ID, tier: 'gold', buyer: friend.address, github: '', profile: null, referral: 'ZZZZZZZZ' });
  assert.equal(again.status, 200); assert.equal(s.db.prepare('SELECT referred_by FROM premint_orders WHERE id=?').get(FRIEND_ID).referred_by, id, 'attribution never moves');
  assert.equal((await s.call(`orders/${id}`)).body.order.referred, false);
  // refused with the reason, and no order made
  const refused = async (referral, message, who = friend.address, order = 'deadcafe-0000-4000-8000-00000000f002') => {
    const r = await s.call('orders', { id: order, tier: 'bronze', buyer: who, github: '', profile: null, referral });
    assert.equal(r.status, 400, `${referral}: ${JSON.stringify(r.body)}`); assert.equal(r.body.error, message);
    assert.equal(s.db.prepare('SELECT count(*) n FROM premint_orders WHERE id=?').get(order).n, 0);
  };
  await refused('nope', 'Use the referral code as it was shared, or leave it empty.');
  await refused('7K3M9PQ2X', 'Use the referral code as it was shared, or leave it empty.');
  await refused(42, 'Use the referral code as it was shared, or leave it empty.');
  await refused('7K3M9PQ2', 'That referral code is not one we issued.');
  await refused(t.code, 'Your own code cannot refer you.', buyer);
  // an empty or absent code is no referral
  for (const referral of ['', '   ', null, undefined]) { const r = await s.call('orders', { id: 'deadcafe-0000-4000-8000-00000000f003', tier: 'bronze', buyer: friend.address, github: '', profile: null, referral }); assert.equal(r.status, 200); assert.equal(r.body.order.referred, false); }
  // the friend pays: the seat's referrals carry the paid order, which the card does not count (paid is not an issued seat)
  assert.deepEqual((await s.call(`seat?buyer=${buyer}`, undefined, undefined, { 'x-seat': await seat() })).body.tickets[0].referrals.receipts, [], 'unpaid: not even listed');
  payDirect(s, FRIEND_ID, 'sig-f');
  const after = (await s.call(`seat?buyer=${buyer}`, undefined, undefined, { 'x-seat': await seat() })).body.tickets[0];
  assert.deepEqual(after.referrals.receipts, [{ state: 'paid', originalBuyer: friend.address, tier: 'gold', paidAt: s.state.time + 1 }]);
  assert.deepEqual(referralModel({ projection: after.referrals, wallet: { holder: buyer } }), { state: 'ready', code: t.code, shareURL: shareURL(t.code), confirmedSeats: 0 });
  // the friend's own seat: its own code, no referrals of its own yet
  const theirs = (await s.call(`seat?buyer=${friend.address}`, undefined, undefined, { 'x-seat': await seat(friend.pair, friend.address) })).body.tickets[0];
  assert.ok(isReferralCode(theirs.code)); assert.notEqual(theirs.code, t.code); assert.deepEqual(theirs.referrals.receipts, []);
});

test('the claim code: drawn by the buyer with its proof, a fresh one each time, redeemed once by Harmony with no browser origin for the seat\'s token; then the ticket reads to the token alone', async () => {
  const s = setup(), other = await another();
  await s.create(); payDirect(s, id, 'sig-a');
  const t = (await s.call(`seat?buyer=${buyer}`, undefined, undefined, { 'x-seat': await seat() })).body.tickets[0];
  // drawn with the buyer's proof alone
  assert.equal((await draw(s, id)).status, 401);
  assert.equal((await draw(s, id, await seat(other.pair, other.address))).status, 401);
  assert.equal((await draw(s, 'deadcafe-0000-4000-8000-00000000f009', await seat())).status, 404);
  const first = await draw(s, id, await seat());
  assert.equal(first.status, 200, JSON.stringify(first.body));
  assert.ok(isClaimCode(first.body.claim), first.body.claim); assert.equal(first.body.url, claimURL(first.body.claim)); assert.deepEqual([first.body.orderId, first.body.tier], [id, 'bronze']);
  const rows = () => JSON.stringify(s.db.prepare('SELECT * FROM premint_tickets').all());
  assert.ok(!rows().includes(first.body.claim), 'the code is kept by its hash alone');
  // a second draw kills the first
  const second = await draw(s, id, await seat());
  assert.notEqual(second.body.claim, first.body.claim);
  const redeem = (body, headers = { 'content-type': 'application/json' }) => raw(s, '/api/premint/claims/redeem', { method: 'POST', headers, body });
  assert.equal((await redeem({ claim: first.body.claim, holder: HER })).status, 404, 'the first code died with the second draw');
  // refused: no json, a word that is no code, a holder that is no wallet
  assert.equal((await redeem({ claim: second.body.claim, holder: HER }, {})).status, 403);
  assert.equal((await redeem({ claim: 'short', holder: HER })).body.error, 'Type the code as the page shows it: twelve letters and digits.');
  for (const holder of [RECIPIENT, 'nope', '', null, 42]) { const r = await redeem({ claim: second.body.claim, holder }); assert.equal(r.status, 400, String(holder)); assert.equal(r.body.error, 'Name her wallet: 32 bytes of base58, never the treasury.'); }
  assert.equal(s.db.prepare('SELECT holder FROM premint_tickets WHERE order_id=?').get(id).holder, null, 'nothing bound by a refused ask');
  // Harmony redeems it as a hand typed it, with no origin header at all
  const bound = await redeem({ claim: groupCode(second.body.claim).toLowerCase(), holder: HER });
  assert.equal(bound.status, 200, JSON.stringify(bound.body));
  assert.match(bound.body.token, /^[1-9A-HJ-NP-Za-km-z]{32,50}$/);
  assert.deepEqual([bound.body.ticket.orderId, bound.body.ticket.holder, bound.body.ticket.claimed, bound.body.ticket.code, bound.body.ticket.referrals.referrer], [id, HER, true, t.code, HER]);
  assert.equal(bound.body.ticket.claimedAt, s.state.time);
  assert.ok(!rows().includes(bound.body.token) && !rows().includes(second.body.claim), 'the token is kept by its hash alone, the claim is gone');
  // once: the same code again, a new draw, another redeem
  assert.equal((await redeem({ claim: second.body.claim, holder: other.address })).status, 404);
  assert.equal((await draw(s, id, await seat())).status, 409, 'bound: no new claim code');
  assert.equal(s.db.prepare('SELECT holder FROM premint_tickets WHERE order_id=?').get(id).holder, HER);
  // the ticket to the token alone (x-ticket), as her Mac reads it; the buyer's seat says the same
  const ticket = await raw(s, '/api/premint/ticket', { headers: { 'x-ticket': bound.body.token } });
  assert.equal(ticket.status, 200); assert.deepEqual([ticket.body.ticket.orderId, ticket.body.ticket.holder, ticket.body.ticket.claimed], [id, HER, true]);
  assert.deepEqual(referralModel({ projection: ticket.body.ticket.referrals, wallet: { holder: HER } }), { state: 'ready', code: t.code, shareURL: shareURL(t.code), confirmedSeats: 0 });
  assert.equal(referralModel({ projection: ticket.body.ticket.referrals, wallet: { holder: buyer } }).state, 'error', 'the card is hers now, not the paying wallet\'s');
  for (const headers of [{}, { 'x-ticket': 'nope' }, { 'x-ticket': encode58(new Uint8Array(32).fill(9)) }, { 'x-seat': await seat() }]) assert.equal((await raw(s, '/api/premint/ticket', { headers })).status, 401);
  const mine = (await s.call(`seat?buyer=${buyer}`, undefined, undefined, { 'x-seat': await seat() })).body.tickets[0];
  assert.deepEqual([mine.claimed, mine.holder, mine.referrals.referrer], [true, HER, HER]);
  // a seat never paid cannot be bound even with a code: the claim is drawn for paid seats only
  assert.equal((await s.call('orders', { id: FRIEND_ID, tier: 'bronze', buyer: other.address, github: '', profile: null })).status, 200);
  assert.equal((await draw(s, FRIEND_ID, await seat(other.pair, other.address))).status, 404);
  // the public order and the receipts carry none of it
  for (const r of [await s.call(`orders/${id}`), await s.call(`receipts?buyer=${buyer}`, undefined, undefined, { 'x-seat': await seat() }), await s.call('holders')]) {
    const text = JSON.stringify(r.body); assert.ok(!text.includes(bound.body.token) && !text.includes(second.body.claim) && !text.includes(t.code), 'no code, no token');
  }
});

test('a database behind migration 0003 reports checkout unavailable and takes no order', async () => {
  const s = setup({ through: 2 });
  assert.equal((await s.call('availability')).status, 503);
  assert.equal((await s.create()).status, 503);
  assert.equal(s.db.prepare('SELECT count(*) n FROM premint_orders').get().n, 0);
});

test('the front doors keep a friend\'s code: / with its whole query, /referral?code= as the share link\'s other form, /claim with nothing in the query', async () => {
  const s = setup({ clockMs: () => Date.parse(MINT_CLOSES) - 1, closes: MINT_CLOSES });   // the window's last millisecond: the mint page
  const door = async (path, method = 'GET') => { const r = await raw(s, path, { method }); return [r.status, r.headers.get('location')]; };
  assert.deepEqual(await door('/?ref=7K3M9PQ2&from=harmony'), [302, `${RAW}/app/warm.html?ref=7K3M9PQ2&from=harmony`]);
  assert.deepEqual(await door('/'), [302, `${RAW}/app/warm.html`]); const seen = async (path, cookie) => { const r = await s.handle(new Request(`${RAW}${path}`, { headers: { cookie } }), s.env); return [r.status, r.headers.get('location')]; }; assert.deepEqual([await seen('/', 'a=1; am-intro=1'), await seen('/?ref=7K3M9PQ2', 'am-intro=1'), await seen('/', 'am-intro=10')], [[302, `${RAW}/app/index.html`], [302, `${RAW}/app/warm.html?ref=7K3M9PQ2`], [302, `${RAW}/app/warm.html`]], 'THE SOCIETIES ARE THE HOME: the intro seen, / opens on Societies; a friend\'s link still the mint');
  assert.deepEqual(await door('/referral?code=7k3m-9pq2'), [302, `${RAW}/app/warm.html?ref=7K3M9PQ2`]);
  assert.deepEqual(await door('/referral?code=nope'), [302, `${RAW}/app/warm.html`]);
  assert.deepEqual(await door('/claim'), [302, `${RAW}/app/claim.html`]);
  assert.deepEqual(await door('/claim?x=1'), [302, `${RAW}/app/claim.html?x=1`]);
  assert.deepEqual(await door('/?ref=7K3M9PQ2', 'HEAD'), [302, `${RAW}/app/warm.html?ref=7K3M9PQ2`]);
  const posted = await s.handle(new Request(`${RAW}/`, { method: 'POST' }), s.env);
  assert.equal(await posted.text(), 'asset', 'a POST to the door is the assets\' as before'); assert.equal(SET, null, 'REOPENED (his Nov 19 2026 "Yes, reopen it"): the house sets no close'); for (const day of ['2026-11-19T14:00:00Z', '2027-01-01T00:00:00Z']) assert.equal((await raw(setup({ clockMs: () => Date.parse(day) }), '/')).headers.get('location'), `${RAW}/app/warm.html`, 'so / opens the mint page, whatever the day');
});
test('AFTER THE MINT: from the window\'s close / and /referral open on the page after it, the friend\'s code carried; /claim as before', async () => {
  const s = setup({ clockMs: () => Date.parse(MINT_CLOSES), closes: MINT_CLOSES });
  const door = async (path, method = 'GET') => { const r = await raw(s, path, { method }); return [r.status, r.headers.get('location')]; };
  assert.deepEqual(await door('/'), [302, `${RAW}/app/after-the-mint.html`]);
  assert.deepEqual(await door('/?ref=7K3M9PQ2&from=harmony'), [302, `${RAW}/app/after-the-mint.html?ref=7K3M9PQ2&from=harmony`]);
  assert.deepEqual(await door('/referral?code=7k3m-9pq2'), [302, `${RAW}/app/after-the-mint.html?ref=7K3M9PQ2`]);
  assert.deepEqual(await door('/?ref=7K3M9PQ2', 'HEAD'), [302, `${RAW}/app/after-the-mint.html?ref=7K3M9PQ2`]);
  assert.deepEqual(await door('/claim'), [302, `${RAW}/app/claim.html`]);
  const later = setup({ clockMs: () => Date.parse('2027-01-01T00:00:00Z'), closes: MINT_CLOSES });
  assert.equal((await raw(later, '/')).headers.get('location'), `${RAW}/app/after-the-mint.html`, 'and every day after');
});

// THE INSTALL AND THE GATE (Oct 22 2026, migration 0004): Harmony names the visit whose download brought it, with its install's own secret; the same
// secret marks her saved there; the page reads its visit; armed by a published installer, a seat needs a visit that saw her saved in Harmony.
test('the install door: Harmony names its visit with its own secret, marks her saved once, and no other install may; the page reads its visit', async () => {
  const s = setup();
  const visit = randomCode(VISIT_LENGTH), secret = encode58(crypto.getRandomValues(new Uint8Array(32))), other = encode58(crypto.getRandomValues(new Uint8Array(32)));
  const install = (body, headers = { 'content-type': 'application/json' }) => raw(s, '/api/premint/install', { method: 'POST', headers, body });
  const read = (v = visit) => raw(s, `/api/premint/install?visit=${v}`);
  assert.deepEqual((await read()).body.install, { visit, installed: false, saved: false });
  // refused: no json, no visit, no secret, no way, a state the download never carried, saved before any install named the visit
  assert.equal((await install({ visit, install: secret, event: 'installed', via: 'quarantine' }, {})).status, 403);
  assert.equal((await install({ visit: 'short', install: secret, event: 'installed', via: 'quarantine' })).status, 400);
  assert.equal((await install({ visit, install: 'x', event: 'installed', via: 'quarantine' })).status, 401);
  assert.equal((await install({ visit, install: secret, event: 'installed', via: 'mail' })).status, 400);
  assert.equal((await install({ visit, install: secret, event: 'installed', via: 'quarantine', athena: 'danced' })).status, 400);
  assert.equal((await install({ visit, install: secret, event: 'saved' })).status, 404);
  // Harmony names it with no origin header at all (her Mac's own server)
  const named = await install({ visit, install: secret, event: 'installed', via: 'quarantine', athena: 'skipped' });
  assert.equal(named.status, 200, JSON.stringify(named.body));
  assert.deepEqual(named.body.install, { visit, installed: true, saved: false, athena: 'skipped', via: 'quarantine', installedAt: 1000, savedAt: null });
  assert.ok(!JSON.stringify(s.db.prepare('SELECT * FROM premint_installs').all()).includes(secret), 'the secret is kept by its hash alone');
  // another install can neither take the visit nor mark it
  assert.equal((await install({ visit, install: other, event: 'installed', via: 'handoff', athena: 'none' })).status, 409);
  assert.equal((await install({ visit, install: other, event: 'saved' })).status, 409);
  s.state.time = 5000;
  const saved = await install({ visit, install: secret, event: 'saved' });
  assert.equal(saved.body.install.saved, true); assert.equal(saved.body.install.savedAt, 5000);
  s.state.time = 6000; assert.equal((await install({ visit, install: secret, event: 'saved' })).body.install.savedAt, 5000, 'saved once');
  assert.equal((await read()).body.install.saved, true); assert.equal((await read()).body.armed, false, 'no published installer: the gate is not armed');
  assert.equal((await read('nope')).status, 400);
});

test('the gate, armed by a published installer: a seat needs a visit that saw her saved in Harmony; unpublished or unreadable, nothing asks', async () => {
  const published = JSON.stringify({ schema: 'nestos.release.v1', status: 'published', platforms: { macos: { url: 'https://example.org/DysonLight-Harmony.zip' } } });
  const s = setup(), asked = [];
  s.env.ASSETS = { fetch: (req) => { asked.push(new URL(req.url).pathname); return new Response(published); } };
  const visit = randomCode(VISIT_LENGTH), secret = encode58(crypto.getRandomValues(new Uint8Array(32)));
  const install = (body) => raw(s, '/api/premint/install', { method: 'POST', headers: { 'content-type': 'application/json' }, body });
  const no = await s.create();
  assert.equal(no.status, 403); assert.match(no.body.error, /^Meet the Lyssajudron in DysonLight Harmony first/);
  assert.deepEqual(asked.filter((p) => !p.startsWith('/app/tracenet/')), ['/app/nestos-release.json'], 'the release the doors read (the first tracenet\'s register beside it)');
  assert.equal((await s.create({ visit })).status, 403, 'a visit no install named');
  await install({ visit, install: secret, event: 'installed', via: 'quarantine', athena: 'whole' });
  assert.equal((await s.create({ visit })).status, 403, 'installed, but she is not saved yet');
  await install({ visit, install: secret, event: 'saved' });
  const yes = await s.create({ visit });
  assert.equal(yes.status, 200, JSON.stringify(yes.body));
  // unpublished, or a manifest that cannot be read: the gate stays open (a read's failure never stops a sale)
  for (const answer of [() => new Response(JSON.stringify({ schema: 'nestos.release.v1', status: 'unpublished', platforms: { macos: null } })), () => new Response('nope'), () => { throw new Error('down'); }]) {
    const t = setup(); t.env.ASSETS = { fetch: answer };
    assert.equal((await t.create()).status, 200);
  }
  // the mint's dev server names its local release
  const u = setup(), seen = []; u.env.HARMONY_RELEASE = '/app/nestos-release.local.json';
  u.env.ASSETS = { fetch: (req) => { seen.push(new URL(req.url).pathname); return new Response(published); } };
  assert.equal((await u.create()).status, 403); assert.deepEqual(seen.filter((p) => !p.startsWith('/app/tracenet/')), ['/app/nestos-release.local.json']);   // the first tracenet's register is read beside the release
});

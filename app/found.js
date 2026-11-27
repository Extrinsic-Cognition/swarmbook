// The tree is the instrument; X-ray exposes its draft and chain operations.
import { createFoundingScene } from './found-scene.js?v=wish-arrival-1';
import { CAPACITIES, DESC_BYTES, beginCapacityEdit, cancelCapacityEdit, fitBytes, foundingPlan, readWish } from './found-capacity.js?v=at-the-door-1';
import { rungFor } from './orb.js';
import { GENERATIONS, conn, web3, NET } from './tree.js?v=journey-7';

const MAX_DEPTH = 5, CHAIRS = 12, MIN_FOUNDERS = 7;
const $ = id => document.getElementById(id);
let scene = null, nextId = 1, SEL = 0, activeEdit = null;
let busy = false, partial = false, sentAny = false, shaping = false;
const tree = { wish: '', root: 0, units: { 0: { id: 0, name: '', parent: -1, chair: -1, level: 0, seats: 0, founders: 7, children: {}, born: 0, dying: 0 } } };
const rite = { named: false, chambered: false, proven: false, inscribed: false };
const nameOf = id => tree.units[id]?.name || (id === 0 ? 'the root' : `chamber ${id}`);
const locked = () => busy || partial || rite.inscribed;
function say(msg) { $('status').textContent = msg; }
function voidProof() { rite.proven = false; }
function subtree(id, out = []) { out.push(id); for (const c of Object.values(tree.units[id].children)) subtree(c, out); return out; }

function beginEdit(parentId, chair) {
  if (!shaping || locked() || activeEdit) return null;
  const edit = beginCapacityEdit(tree, parentId, chair, scene.now(), () => nextId++, MAX_DEPTH);
  if (!edit) { say('This chamber has reached its depth or chair limit, or the founding already contains twelve chambers. X-ray shows the details.'); return null; }
  edit.previousSel = SEL; activeEdit = edit; SEL = edit.id;
  $('drag-readout').hidden = false;
  $('drag-count').textContent = `${tree.units[edit.id].seats} hexagons`;
  render(); return edit;
}
function previewEdit(edit, capacity) {
  if (tree.units[edit.id].seats === capacity) return;
  tree.units[edit.id].seats = capacity;
  $('drag-count').textContent = `${capacity} hexagons`;
  render();
}
function endEdit(edit, cancelled) {
  if (cancelled) { cancelCapacityEdit(tree, edit); SEL = edit.previousSel; say('Edit cancelled.'); }
  else {
    if (edit.created || tree.units[edit.id].seats !== edit.seats) voidProof();
    say(`${nameOf(edit.id)} · ${tree.units[edit.id].seats} hexagons. Grab its parent pentagon to reshape it.`);
  }
  activeEdit = null; $('drag-readout').hidden = true; render();
}
function grow(parentId, chair) { const edit = beginEdit(parentId, chair); if (edit) endEdit(edit, false); }
function fall(id) {
  if (locked() || id === tree.root || tree.units[id]?.dying) return;
  const count = subtree(id).length;
  tree.units[id].dying = scene.now(); voidProof();
  say(`Removing ${count === 1 ? nameOf(id) : `${count} chambers`}.`); render();
}
function reap(now, reduced = false) {
  for (const u of Object.values(tree.units)) {
    if (!tree.units[u.id] || !u.dying || (!reduced && now - u.dying < 450)) continue;
    const ids = subtree(u.id); delete tree.units[u.parent].children[u.chair];
    for (const id of ids) delete tree.units[id];
    if (ids.includes(SEL)) SEL = u.parent;
    render();
  }
}

scene = createFoundingScene($('orb'), {
  tree, selected: () => shaping ? SEL : null, canEdit: () => shaping && !locked(), viewScale: () => shaping ? 0.68 : 1,
  onSelect(id) { SEL = id; render(); },
  onBeginCapacity: beginEdit, onCapacity: previewEdit, onEndCapacity: endEdit,
  onHover(hit) { $('hover').textContent = shaping && hit ? `${nameOf(hit.id)} · ${hit.bound ? 'grab to reshape its satellite' : 'pull to grow a satellite'}` : ''; },
  onFrame: reap,
});

function enterShaping() {
  shaping = true;
  $('tree-home').appendChild($('stage'));
  $('arrival').hidden = true; $('workbench').hidden = false;
  $('orb').setAttribute('aria-hidden', 'false'); $('orb').setAttribute('tabindex', '0');
  $('purpose-line').textContent = tree.wish; $('purpose-line').title = tree.wish;
  render();
  if (!tree.units[0].name.trim()) { SEL = 0; render(); $('name').focus(); } else $('orb').focus();
}
$('wish-form').addEventListener('submit', event => {
  event.preventDefault();
  const wish = $('wish').value.trim();
  if (!wish) { $('wish-error').textContent = 'Give your swarm a purpose to begin.'; $('wish').focus(); return; }
  if (locked()) return;
  tree.wish = wish; voidProof(); $('wish-error').textContent = ''; enterShaping();
});
$('edit-wish').onclick = () => {
  if (locked() || activeEdit) return;
  shaping = false; $('seed-home').appendChild($('stage'));
  $('workbench').hidden = true; $('arrival').hidden = false;
  $('orb').setAttribute('aria-hidden', 'true'); $('orb').setAttribute('tabindex', '-1');
  $('wish').value = tree.wish; $('wish').focus(); scene.invalidate();
};

function render() {
  const u = tree.units[SEL], units = Object.values(tree.units).filter(x => !x.dying);
  rite.named = !!tree.units[0].name.trim(); rite.chambered = units.length > 1;
  $('sel-title').textContent = `${nameOf(SEL)} · level ${u.level}`;
  $('name-label').textContent = SEL === 0 ? 'Name your swarm' : 'Selected chamber';
  if (document.activeElement !== $('name')) $('name').value = u.name;
  $('seats').value = u.seats; $('founders').value = u.founders;
  $('founders').max = CHAIRS - Object.keys(u.children).length;
  $('capacity').value = rungFor(u.seats);
  const capacity = CAPACITIES[rungFor(u.seats)];
  $('capacity-count').textContent = `${capacity} places`;
  $('capacity').setAttribute('aria-valuetext', `${capacity} member places`);
  $('select-root').hidden = SEL === 0; $('remove-unit').hidden = SEL === 0;
  for (const id of ['name', 'capacity', 'remove-unit', 'select-root', 'edit-wish']) $(id).disabled = locked() || !!activeEdit || !!u.dying;
  $('expert-controls').disabled = locked() || !!activeEdit;
  $('publish').disabled = !shaping || locked() || !!activeEdit || units.some(x => x.dying) || Object.values(tree.units).some(x => x.dying);
  $('publish').textContent = busy ? 'Founding…' : rite.inscribed ? 'Founded on Solana' : partial ? 'Review the receipts in X-ray' : 'Found on Solana';
  $('inscribe').disabled = !shaping || locked() || !!activeEdit;
  const grid = $('chairs'); grid.replaceChildren();
  for (let k = 0; k < CHAIRS; k++) {
    const c = u.children[k], b = document.createElement('button'); b.className = 'chair' + (c !== undefined ? ' bound' : '');
    const n = document.createElement('span'), who = document.createElement('span');
    n.textContent = k + 1; who.className = 'who'; who.textContent = c !== undefined ? nameOf(c) : 'free'; b.append(n, who);
    b.title = c !== undefined ? 'Select this satellite' : 'Grow a satellite here';
    b.disabled = c === undefined && (u.level >= MAX_DEPTH || Object.keys(u.children).length >= CHAIRS - u.founders || units.length >= 12);
    b.onclick = () => { if (c !== undefined) { SEL = c; render(); } else grow(SEL, k); };
    grid.appendChild(b);
  }
  const steps = [['s1', rite.named, 'Name the root'], ['s2', rite.chambered, 'Shape the tree (satellites optional)'], ['s3', rite.proven, 'Validate the draft'], ['s4', rite.inscribed, 'Confirm on Solana']];
  for (const [id, done, label] of steps) { $(id).className = 'act' + (done ? ' done' : ''); $(id).querySelector('.label').textContent = label; }
  $('summary').textContent = `${units.length} chamber${units.length === 1 ? '' : 's'} · depth ${Math.max(...units.map(x => x.level))} · ${units.reduce((s, x) => s + CAPACITIES[rungFor(x.seats)], 0)} hexagons`;
  $('state').textContent = JSON.stringify({ wish: tree.wish, rite, units: units.map(({ born, dying, ...unit }) => unit) }, null, 1);
  $('workspace-guide').textContent = units.length === 1 ? 'One chamber is enough to begin. Pull a gold face to grow another.' : 'Pull a gold face to add or resize a chamber. Drag the space around them to turn.';
  renderCeremony(); scene?.invalidate();
}
$('name').addEventListener('input', e => { if (locked()) return; tree.units[SEL].name = e.target.value; voidProof(); render(); });
function setCapacity(value) { if (locked()) return; tree.units[SEL].seats = CAPACITIES[rungFor(Math.max(0, Math.min(150, Math.round(Number(value) || 0))))]; voidProof(); render(); }
$('capacity').addEventListener('input', e => setCapacity(CAPACITIES[Number(e.target.value)]));
$('seats').addEventListener('change', e => setCapacity(e.target.value));
$('founders').addEventListener('change', e => { if (locked()) return; tree.units[SEL].founders = Math.max(MIN_FOUNDERS, Math.min(CHAIRS - Object.keys(tree.units[SEL].children).length, Math.round(Number(e.target.value) || MIN_FOUNDERS))); voidProof(); render(); });
$('price').addEventListener('input', () => voidProof());
$('select-root').onclick = () => { SEL = tree.root; render(); };
$('remove-unit').onclick = () => fall(SEL);
$('xray-toggle').onclick = () => { $('xray').showModal(); $('xray-toggle').setAttribute('aria-expanded', 'true'); };
$('xray-close').onclick = () => $('xray').close();
$('xray').addEventListener('close', () => { $('xray-toggle').setAttribute('aria-expanded', 'false'); $('xray-toggle').focus(); });
$('review-close').onclick = () => $('publish-review').close();

function proveDraft() {
  if (!shaping || !tree.wish.trim()) throw new Error('Begin with a wish for your swarm.');
  const plan = foundingPlan(tree), price = Number($('price').value);
  if (!Number.isFinite(price) || Math.round(price * 1e9) < 1 || !Number.isSafeInteger(Math.round(price * 1e9))) throw new Error('Choose an admission price of at least 0.000000001 SOL in X-ray.');
  $('proof').textContent = plan.units.map(u => `${u.name}: ${u.founders} founder keys, ${Object.keys(u.children).length} satellites, ${u.capacity} hexagons${u.chainChair === null ? '' : `; chain chair ${u.chainChair + 1}`}`).join('\n') + '\nDraft validated locally. Chain confirmations follow when you begin founding.';
  rite.proven = true; render(); return plan;
}
$('prove').onclick = () => { try { proveDraft(); say('Draft checked. Ready for the Solana review.'); } catch (e) { say(e.message); } };
$('publish').onclick = () => {
  try {
    const plan = proveDraft();
    $('review-summary').textContent = `${plan.root.name} · ${plan.units.length} chambers · ${plan.units.reduce((n, u) => n + u.capacity, 0)} hexagons of floor capacity.`;
    $('review-wish').textContent = `Purpose: ${tree.wish}`;
    $('review-floor').textContent = tree.units[0].seats === 0 ? 'Solana genesis requires a floor: your root will begin with 20 hexagons. Satellites can remain at zero.' : 'The selected floor sizes will be written to Solana. One root seat is acquired to complete genesis; satellite capacity opens for admission.';
    $('review-network').textContent = `${NET} · uses this browser’s key for transaction fees and the first seat. Genesis includes two settlement windows. Satellite admission is ${$('price').value} SOL per seat.`;
    $('review-key').textContent = `Founding key: ${me.toBase58()}`;
    $('publish-review').showModal();
  } catch (e) { say(e.message); if (!tree.units[0].name.trim()) { SEL = 0; render(); $('name').focus(); } }
};
function renderCeremony() {
  try {
    const plan = foundingPlan(tree);
    $('ceremony').textContent = [`Root: genesis at ${plan.root.capacity} hexagons.`, ...plan.units.filter(u => u.id !== 0).map(u => `${u.name}: visual chair ${u.chair + 1} → chain chair ${u.chainChair + 1}.`), 'Acquire one root seat; settle and ratify genesis.', ...plan.expansions.map(e => `${nameOf(e.id)}: approve expansion to ${e.capacity} hexagons.`)].join('\n');
  } catch (e) { $('ceremony').textContent = e.message; }
}

// ---- the chain leg: this browser's key founds the tree on the chain the wall reads ----
// The key is the same stand-in the polis page uses; the other founders are born here and kept
// here until the chairs have homes. The law ratifies no tree without a floor, so the founder's
// key buys one seat at the genesis sale (two short windows) before the tree is ratified; then,
// if a floor was asked for, the chairs open the door as the tree's first decision.
const P = GENERATIONS[GENERATIONS.length - 1].P;
const nacl = window.nacl;
const SEAT_STORE = `poleis-seat-${P.PROGRAM_ID.toBase58()}`;
const FOUNDERS_STORE = `poleis-founders-${P.PROGRAM_ID.toBase58()}`;
function loadKey(store) {
  try { const s = localStorage.getItem(store); if (s) return nacl.sign.keyPair.fromSecretKey(Uint8Array.from(JSON.parse(s))); } catch { /* no storage: a fresh key each visit */ }
  const kp = nacl.sign.keyPair();
  try { localStorage.setItem(store, JSON.stringify(Array.from(kp.secretKey))); } catch { /* same */ }
  return kp;
}
const seat = loadKey(SEAT_STORE);
const me = new web3.PublicKey(seat.publicKey);
const pk = (k) => new web3.PublicKey(k.publicKey);
const sol = (v) => (Number(v) / 1e9).toFixed(3);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
function founderKeys(n) {
  let list = [];
  try { list = JSON.parse(localStorage.getItem(FOUNDERS_STORE) || '[]'); } catch { /* fresh */ }
  while (list.length < n) list.push(Array.from(nacl.sign.keyPair().secretKey));
  try { localStorage.setItem(FOUNDERS_STORE, JSON.stringify(list)); } catch { /* same */ }
  return list.slice(0, n).map((s) => nacl.sign.keyPair.fromSecretKey(Uint8Array.from(s)));
}
$('founder-key').textContent = `this key founds and pays: ${me.toBase58()} (a stand-in born in this browser)`;
async function ensureLamports(needed) {
  const have = BigInt(await conn.getBalance(me, 'confirmed'));
  if (have >= needed) return;
  if (NET !== 'devnet' && NET !== 'localnet') throw new Error(`fund ${me.toBase58()} with ${sol(needed - have)} SOL first`);
  try {
    const sig = await conn.requestAirdrop(me, Number(needed - have) + 10_000_000);
    await conn.confirmTransaction(sig, 'confirmed');
  } catch (e) {
    // on devnet the public faucet is often dry or rate-limited by source; https://faucet.solana.com pays any address against a GitHub login
    const source = NET === 'devnet' ? 'at https://faucet.solana.com, which pays any address against a GitHub login,' : 'from the local faucet';
    throw new Error(`the ${NET} faucet refused this key (${e.message}). Fund ${me.toBase58()} with ${sol(needed - have + 10_000_000n)} SOL ${source} then inscribe again`);
  }
}
async function sendMine(ixs, extraKeys = []) {
  const tx = new web3.Transaction().add(...ixs);
  tx.feePayer = me;
  tx.recentBlockhash = (await conn.getLatestBlockhash('confirmed')).blockhash;
  tx.sign({ publicKey: me, secretKey: seat.secretKey }, ...extraKeys.filter(k => !pk(k).equals(me)).map(k => ({ publicKey: pk(k), secretKey: k.secretKey })));
  sentAny = true;
  const sig = await conn.sendRawTransaction(tx.serialize(), { preflightCommitment: 'confirmed' });
  $('inscription').textContent += `Sent: ${sig}\n`;
  const confirmation = await conn.confirmTransaction(sig, 'confirmed');
  if (confirmation.value.err) throw new Error(`Transaction ${sig} failed: ${JSON.stringify(confirmation.value.err)}`);
  $('inscription').textContent += `Confirmed: ${sig}\n`;
  return sig;
}
async function waitSlot(target, what) {
  for (;;) {
    const s = BigInt(await conn.getSlot('confirmed'));
    if (s >= target) return;
    say(`${what}: ${target - s} slots to go`);
    await sleep(2000);
  }
}
const log = (line) => { $('inscription').textContent += `${line}\n`; say(line); };
const rand = () => { const b = new Uint8Array(8); crypto.getRandomValues(b); let v = 0n; for (const x of b) v = (v << 8n) | BigInt(x); return v || 1n; };
/** One decision over the whole tree, the leaves sealing first: every chair of every chamber says yes. */
async function decideTree(what, payload, order, rootChain) {
  const impacted = order.map((o) => o.unit);
  const manifest = await P.sha256(new TextEncoder().encode(what));
  const hash = await P.proposalHash(payload.cls, payload.origin, manifest, await P.payloadHash(payload), BigInt(Date.now()));
  const proposer = order.find(o => o.unit === payload.origin).keys[0];
  const rent = await conn.getMinimumBalanceForRentExemption(P.Proposal.SIZE) + order.length * await conn.getMinimumBalanceForRentExemption(P.Session.SIZE);
  const have = await conn.getBalance(pk(proposer), 'confirmed');
  if (!pk(proposer).equals(me) && have < rent) await sendMine([web3.SystemProgram.transfer({ fromPubkey: me, toPubkey: pk(proposer), lamports: rent - have })]);
  await sendMine([P.propose(pk(proposer), hash, manifest, payload, impacted, rootChain)], [proposer]);
  for (const o of [...order].reverse()) {
    const signed = o.keys.map((k) => ({ voter: pk(k), choice: P.VOTE.PRO, signature: P.signVote(k.secretKey, hash, o.unit, P.VOTE.PRO) }));
    for (let i = 0; i < signed.length; i += P.BATCH_LEGACY) await sendMine(P.attestBatch(me, hash, o.unit, signed.slice(i, i + P.BATCH_LEGACY)));
    await sendMine([P.seal(me, hash, o.unit)]);
    if (o.parent !== null && impacted.includes(o.parent)) await sendMine([P.mandate(me, hash, o.parent, o.unit)]);
  }
  await sendMine([P.execute(me, hash, impacted, payload, rootChain)]);
}
async function inscribe() {
  if (!rite.proven) throw new Error('nothing without an act: prove the form first');
  const plan = foundingPlan(tree), units = plan.units, root = plan.root;
  tree.units[0].seats = root.capacity; render();
  const price = BigInt(Math.round(Number($('price').value) * 1e9));
  const ids = new Map(units.map((u) => [u.id, rand()]));
  const rootChain = ids.get(0);
  // Keep the exact plaintext locally; only its digest enters the charter field.
  localStorage.setItem(`poleis-wish-${rootChain}`, tree.wish);
  const poolKeys = founderKeys(units.reduce((a, u) => a + u.founders, 0));
  let cursor = 0;
  const order = units.map((u) => {
    const n = u.id === 0 ? u.founders - 1 : u.founders;
    const ks = poolKeys.slice(cursor, cursor + n); cursor += n;
    return { id: u.id, unit: ids.get(u.id), parent: u.id === 0 ? null : ids.get(u.parent), keys: u.id === 0 ? [seat, ...ks] : ks, u };
  });
  const charter = (s) => P.sha256(new TextEncoder().encode(s));
  const WINDOW = NET === 'localnet' ? BigInt(P.MIN_WINDOW_SLOTS) : 900n;
  const reserve = 1_000_000n, deposit = 5_000_000n;
  $('inscription').textContent = '';
  const [proposalRent, sessionRent] = await Promise.all([conn.getMinimumBalanceForRentExemption(P.Proposal.SIZE), conn.getMinimumBalanceForRentExemption(P.Session.SIZE)]);
  const expansionBudget = plan.expansions.reduce((sum, e) => sum + BigInt(proposalRent + subtree(e.id).length * sessionRent + 2_000_000), 0n);
  await ensureLamports(60_000_000n + 25_000_000n * BigInt(units.length - 1) + expansionBudget);
  const s0 = BigInt(await conn.getSlot('confirmed'));
  // Leave room to create every satellite before the first bid's deadline.
  const commitEnd = s0 + BigInt(P.MIN_WINDOW_SLOTS) + BigInt(50 * units.length + 60);
  const revealEnd = commitEnd + BigInt(P.MIN_WINDOW_SLOTS) + 30n;
  log(`1. the founding: ${root.name}, ${root.founders} founders in chairs, tree ${rootChain}`);
  await sendMine([P.initConfig(me, null, rootChain), P.openGenesis(me, {
    charter: await charter(tree.wish), planCap: 10_000_000_000n, planPeriod: 1_000_000n, window: WINDOW, rung: root.rung, reserve, deposit, commitEnd, revealEnd,
    founders: order[0].keys.map(pk), name: root.name, desc: fitBytes(tree.wish, DESC_BYTES),   // the swarm's page prints the wish's sentence the chain keeps
  }, rootChain)]);
  for (const o of order) {
    if (o.id === 0) continue;
    log(`   ${nameOf(o.id)} founded in chain chair ${o.u.chainChair + 1} of ${nameOf(o.u.parent)}, ${o.keys.length} founders`);
    await sendMine([P.foundChild(me, o.parent, {
      child: o.unit, chair: o.u.chainChair, charter: await charter(nameOf(o.id)), window: WINDOW, planCap: 1_000_000_000n, planPeriod: 1_000_000n,
      founders: o.keys.map(pk), name: nameOf(o.id), desc: '',
    }, rootChain)]);
  }
  log('2. the first seat: no tree ratifies without a floor, so this key buys one at the genesis sale');
  const salt = new Uint8Array(32); crypto.getRandomValues(salt);
  await sendMine([P.commitSeatBid(me, rootChain, 0n, 0n, await P.seatCommitment(reserve, 0n, salt, me))]);
  await waitSlot(commitEnd, '   the commit window');
  await sendMine([P.revealSeatBid(me, rootChain, 0n, 0n, reserve, salt)]);
  await waitSlot(revealEnd, '   the reveal window');
  await sendMine([P.settleSeats(me, rootChain, 0n)]);
  await sendMine([P.claimSeat(me, rootChain, 0n, 0n, rootChain)]);
  await sendMine([P.ratifyGenesis(me, rootChain)]);
  log('3. ratified: the authority is a key nobody holds');
  for (const expansion of plan.expansions) {
    const memberIds = new Set(subtree(expansion.id));
    const branch = order.filter(o => memberIds.has(o.id));
    log(`Expanding ${nameOf(expansion.id)} to ${expansion.capacity} hexagons`);
    await decideTree(`${nameOf(expansion.id)}: floor ${expansion.capacity}`, P.Payload.door(ids.get(expansion.id), price), branch, rootChain);
  }
  const accounts = await conn.getMultipleAccountsInfo(order.map(o => P.registryPda(o.unit)), 'confirmed');
  for (let i = 0; i < order.length; i++) {
    const registry = accounts[i] && P.Registry.parse(accounts[i].data);
    if (!accounts[i]?.owner.equals(P.PROGRAM_ID) || !registry || registry.rung !== order[i].u.rung) throw new Error(`Could not verify the final floor of ${order[i].u.name}. Review the receipts in X-ray.`);
  }
  rite.inscribed = true;
  log(`founded on ${NET}: ${root.name} is on the wall`);
  const a = document.createElement('a');
  a.href = `./polis.html?civ=${rootChain}&program=${P.PROGRAM_ID.toBase58()}`;
  a.textContent = `open ${root.name}`;
  $('inscription').appendChild(a);
  $('founded-link').href = a.href; $('founded-link').textContent = `Open ${root.name}`; $('founded-link').hidden = false;
  render();
}
$('inscribe').onclick = async () => {
  if (locked()) return;
  try { proveDraft(); } catch (e) { say(e.message); return; }
  busy = true; sentAny = false; $('publish-review').close(); render();
  try { await inscribe(); }
  catch (e) {
    partial = sentAny;
    say(partial ? `Founding stopped: ${e.message}. Some transactions may have reached Solana; X-ray keeps the receipts.` : e.message);
  } finally { busy = false; render(); }
};

$('network').textContent = NET === 'devnet' ? 'Solana devnet' : NET === 'localnet' ? 'Local Solana validator' : 'Custom Solana network';
const handed = readWish(location.hash);   // the wall's wish card: its sentence, name and room land on the second step
if (handed) { $('wish').value = tree.wish = handed.wish; Object.assign(tree.units[0], { name: handed.name, seats: handed.room }); enterShaping(); } else render();
say(handed ? 'Your wish is here. Shape the tree, then found it on Solana.' : 'Name your swarm when you’re ready.');

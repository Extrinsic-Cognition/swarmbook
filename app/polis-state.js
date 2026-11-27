import { isVotingSession } from './activity.js?v=speaker-burst-1';

// Read-only projection of decoded proposal/session accounts. This is not a
// transaction validator: payload accounts, membership and signatures are separate.
export const PROPOSAL_PHASES = Object.freeze([
  'voting', 'awaiting-seal', 'passed-awaiting-execution', 'executed',
  'rejected', 'deadlocked', 'expired', 'unavailable',
]);
const DEFAULT_STATES = Object.freeze({ VOTING: 0, PASSED: 1, REJECTED: 2, DEADLOCK: 3, EXPIRED: 4 });
const LABELS = Object.freeze({
  voting: 'Voting now', 'awaiting-seal': 'Window ended · awaiting seal',
  'passed-awaiting-execution': 'Passed · awaiting execution', executed: 'Executed',
  rejected: 'Rejected', deadlocked: 'Deadlocked', expired: 'Expired',
  unavailable: 'Status unavailable',
});
function uint(value) {
  if (typeof value === 'bigint') return value >= 0n ? value : null;
  if (typeof value === 'number') return Number.isSafeInteger(value) && value >= 0 ? BigInt(value) : null;
  if (typeof value === 'string' && /^\d+$/.test(value)) return BigInt(value);
  return null;
}
const idOf = value => uint(value)?.toString() ?? null;
function hashOf(value) {
  if (typeof value === 'string') return value;
  if (ArrayBuffer.isView(value) || Array.isArray(value)) return Array.from(value).join(',');
  return null;
}

/**
 * sessions is the array for this proposal; unrelated units are ignored. Decoded
 * sessions must expose unit/state/deadline, and their hash is checked when present.
 * Consent requires every impacted seal; otherwise the origin's seal decides.
 * `proposal.expires` is not an execution TTL and never invents an expired verdict.
 * phase follows current activity first; outcome and executionReady remain separate
 * because an origin can pass while a child still has a live voting window.
 */
export function classifyProposal({ proposal, sessions = [], slot = null, states = DEFAULT_STATES } = {}) {
  const now = uint(slot), origin = idOf(proposal?.origin);
  const impacted = Array.from(new Set(Array.from(proposal?.impacted || [], idOf)));
  const validScope = origin !== null && impacted.length > 0 && !impacted.includes(null) && impacted.includes(origin);
  const rows = new Map(), conflicts = new Set(), proposalHash = hashOf(proposal?.hash);
  for (const session of sessions || []) {
    const id = idOf(session?.unit);
    if (id === null || !impacted.includes(id)) continue;
    if (proposalHash !== null && session?.hash != null && hashOf(session.hash) !== proposalHash) continue;
    if (rows.has(id)) conflicts.add(id);
    else rows.set(id, session);
  }
  const knownStates = new Set(Object.values(states));
  const missing = impacted.filter(id => !rows.has(id) || conflicts.has(id));
  const invalid = impacted.filter(id => rows.has(id) && !knownStates.has(rows.get(id).state));
  const usable = impacted.filter(id => rows.has(id) && !conflicts.has(id) && knownStates.has(rows.get(id).state));
  const active = usable.filter(id => isVotingSession(rows.get(id), states.VOTING, now));
  const waiting = usable.filter(id => {
    const s = rows.get(id), deadline = uint(s.deadline);
    return s.state === states.VOTING && now !== null && deadline !== null && now > deadline;
  });
  const unknownWindow = usable.some(id => {
    const s = rows.get(id);
    return s.state === states.VOTING && (now === null || uint(s.deadline) === null);
  });
  const required = proposal?.consent === true ? impacted : [origin];
  const complete = validScope && missing.length === 0 && invalid.length === 0;
  const requiredStates = required.map(id => rows.get(id)?.state);
  const executionReady = proposal?.executed !== true && complete && requiredStates.every(state => state === states.PASSED);
  let outcome = null;
  if (validScope && required.every(id => rows.has(id) && !conflicts.has(id))) {
    if (requiredStates.includes(states.REJECTED)) outcome = 'rejected';
    else if (requiredStates.includes(states.DEADLOCK)) outcome = 'deadlocked';
    else if (requiredStates.includes(states.EXPIRED)) outcome = 'expired';
    else if (requiredStates.every(state => state === states.PASSED)) outcome = 'passed';
  }
  let phase, reason;
  if (proposal?.executed === true) { phase = 'executed'; reason = 'execution recorded'; }
  else if (!validScope) { phase = 'unavailable'; reason = 'proposal scope unavailable'; }
  else if (active.length) { phase = 'voting'; reason = 'live impacted session'; }
  else if (waiting.length) { phase = 'awaiting-seal'; reason = 'deadline passed without a terminal seal'; }
  else if (executionReady) { phase = 'passed-awaiting-execution'; reason = 'required seals passed; execution not recorded'; }
  else if (outcome && outcome !== 'passed') { phase = outcome; reason = 'required terminal seal'; }
  else { phase = 'unavailable'; reason = missing.length ? 'sessions unavailable' : invalid.length ? 'unknown session state' : unknownWindow ? 'voting clock or deadline unavailable' : 'required verdict unavailable'; }
  return Object.freeze({
    phase, label: LABELS[phase], reason, outcome,
    executionReady, canExecute: executionReady,
    activeSessions: active.length, awaitingSeal: waiting.length,
    missingSessions: missing.length, invalidSessions: invalid.length,
    impactedSessions: impacted.filter(id => id !== null).length,
  });
}

/** sessionFor(proposal, decimalUnitId) returns a decoded session or null. */
export function summarizeProposals({ proposals = [], sessionFor, slot = null, states = DEFAULT_STATES } = {}) {
  const counts = Object.fromEntries(PROPOSAL_PHASES.map(phase => [phase, 0]));
  const entries = [], seen = new Set();
  let executionReady = 0;
  for (const proposal of proposals) {
    if (!proposal) continue;
    const hash = hashOf(proposal.hash);
    if (hash !== null && seen.has(hash)) continue;
    if (hash !== null) seen.add(hash);
    const units = Array.from(new Set(Array.from(proposal.impacted || [], idOf))).filter(id => id !== null);
    const sessions = units.map(id => sessionFor?.(proposal, id)).filter(Boolean);
    const state = classifyProposal({ proposal, sessions, slot, states });
    counts[state.phase]++;
    if (state.executionReady) executionReady++;
    entries.push(Object.freeze({ proposal, state }));
  }
  return Object.freeze({
    total: entries.length, counts: Object.freeze(counts), entries: Object.freeze(entries),
    voting: counts.voting, awaitingSeal: counts['awaiting-seal'],
    passedAwaitingExecution: counts['passed-awaiting-execution'], executed: counts.executed,
    unavailable: counts.unavailable, executionReady,
    current: counts.voting + counts['awaiting-seal'] + counts['passed-awaiting-execution'],
    // Means a pending state to inspect, not authorization for the viewer to act.
    actionable: counts.voting + counts['awaiting-seal'] + counts['passed-awaiting-execution'],
  });
}
/** THE RITE (his Nov 23 2026 12:24 UTC, the vote's wave as poleis.us played it): the five phases a society's page names, read from the engine's own state (the tree's mode, onAgentProgress's
 *  harmonizing, releasing and outcome) and the decision's executed flag on chain -> { at: 0..4, name }, the verdict named by itself (RATUM, REIECTUM, DISSENSIO). Pure. */
export const RITE = Object.freeze(['OTIUM', 'DISCUSSIO', 'SUFFRAGIUM', 'VERDICTUM', 'EXSECUTUM']);
export const riteOf = ({ mode, harmonizing, releasing, outcome, executed } = {}) => mode === 'discussion' ? { at: 1, name: RITE[1] } : mode !== 'voting' ? { at: 0, name: RITE[0] }
  : releasing && executed === true ? { at: 4, name: RITE[4] } : (harmonizing || releasing) && ['RATUM', 'REIECTUM', 'DISSENSIO'].includes(outcome) ? { at: 3, name: outcome } : { at: 2, name: RITE[2] };
/** levelOf(registries, unitIds, empty): a swarm's progression level beside its floor: the chairs of its root that are held (by a key or by a whole swarm) and the levels of its tree, the root counted. Pure. */
export const levelOf = (registries, ids, empty = 0) => { const rows = ids.map((id) => registries.get(String(id))).filter(Boolean), root = rows[0];
  return { held: root ? root.pentagons.filter((p) => p.kind !== empty).length : 0, levels: rows.length ? 1 + Math.max(...rows.map((r) => r.level)) - root.level : 0 }; };

// THE PANTHEON (Nov 23 2026, his "these please" over the Nov 7 Pantheon, then "why the fuck u dont understand this is great? fucking grab the source of it"): the widget's
// twelve gods; its thrones the Fund's twelve chairs, seated by fees; its season the Fund's cycle; its road the Fund's current option, backed by thrones, priced by stakers.
export const GODS = Object.freeze([['IVPPITER', 'the seal · governance'], ['IVNO', 'the keys · custody'], ['MINERVA', 'the judge · review'], ['APOLLO', 'the light · WebGPU'], ['MARS', 'the red team · security'], ['VENVS', 'the look · the brand'], ['MERCVRIVS', 'the router · Space Router'], ['NEPTVNVS', 'the streams · the wire'], ['VVLCANVS', 'the forge · Rust & WASM'], ['VESTA', 'the hearth · the Nest'], ['CERES', 'the harvest · the traces'], ['DIANA', 'the hunt · search']]), SIGNS = Object.freeze([...'♈♉♊♋♌♍♎♏♐♑♒♓'].map((s) => `${s}\uFE0E`));   // SIGNS: the twelve houses' zodiac signs as his Tracenet draws them (Aries first, clockwise; text, never emoji), the thrones' faces on Swarmbook (his Nov 23 2026 "dont fucking use the latin names or the numbers... use also the oroscope icons there")
export const pantheonOf = (fund, tallies, options, stakes, slot, none, key) => { if (!fund) return null;
  const h = fund.current.some(Boolean) ? key(fund.current) : null, chairs = fund.chairs.map((c) => (c.root === none ? null : { root: String(c.root), fees: Number(c.fees), backs: !!h && key(c.backing) === h })), seat = new Set(chairs.filter(Boolean).map((c) => c.root));
  const left = slot == null ? null : Number(fund.cycleStart + fund.cycleSlots) - slot, open = left === null || left >= 0, empty = chairs.indexOf(null), least = chairs.reduce((m, c, k) => (c && (m < 0 || c.fees < chairs[m].fees) ? k : m), -1);
  const own = h ? [...stakes].filter((s) => key(s.hash) === h) : [], w = own.reduce((n, s) => n + Number(s.weight), 0), ladder = [...tallies].map((t) => ({ root: String(t.root), fees: t.cycle === fund.cycleSeq ? Number(t.fees) : 0, lifetime: Number(t.lifetime), seated: seat.has(String(t.root)) })).sort((a, b) => b.fees - a.fees || b.lifetime - a.lifetime);
  return { season: Number(fund.cycleSeq), slots: Number(fund.cycleSlots), left, seated: seat.size, chairs, ladder, least: least < 0 ? null : chairs[least].fees,   // a season that ran out rolls at the next write: the chairs empty, its tallies go stale, the first fee of the next takes chair 0 (ix/fund.rs race)
    target: !open ? 0 : empty >= 0 ? empty : least, challenger: open ? ladder.find((t) => !t.seated && t.fees > 0) || null : null,
    road: h && options.get(h) ? { hash: h, option: options.get(h), backed: chairs.filter((c) => c?.backs).length, quorum: fund.chairQuorum, marks: own.map((s) => ({ at: s.valueBps, weight: Number(s.weight) })), value: w ? own.reduce((n, s) => n + s.valueBps * Number(s.weight), 0) / w : null, range: [fund.rangeLo, fund.rangeHi] } : null }; };

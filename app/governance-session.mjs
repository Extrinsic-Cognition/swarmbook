/**
 * Deterministic replay of Roma Quantica's seven-chamber governance tree.
 * Bindings, member weights, and the bicameral rule come from arbor-options.html.
 * These fixed electorates and thresholds are illustration fixtures, not protocol configuration.
 * Times are milliseconds. Packets contribute to the tally only upon arrival.
 */
export const WEIGHTS = Object.freeze([
  610, 480, 455, 390, 340, 300, 280, 250, 235, 210,
  190, 175, 160, 150, 140, 120, 110, 95, 80, 60,
  55, 50, 45, 40, 36, 32, 28, 24, 20, 16,
]);
export const TOTAL_WEIGHT = WEIGHTS.reduce((total, weight) => total + weight, 0);
export const DURATION = 25500;

// The ladder's floors by rung index, as the program counts them: G(1,0) at
// rung 0 has twelve chairs and no seats; G(1,1) twenty; G(2,0) thirty; then 80, 110, 150.
export const SEATS_BY_RUNG = Object.freeze([0, 20, 30, 80, 110, 150]);
export const LADDER_NAMES = Object.freeze(['G(1,0)', 'G(1,1)', 'G(2,0)', 'G(3,0)', 'G(2,2)', 'G(4,0)']);

export const NODES = Object.freeze([
  { id: 'G0', name: 'Root', parent: null, depth: 0, rung: 2, bindings: { 2: 'P2', 6: 'P1', 10: 'C1' } },
  { id: 'C1', name: 'Counsel', parent: 'G0', depth: 1, rung: 1, bindings: {} },
  { id: 'P2', name: 'Research', parent: 'G0', depth: 1, rung: 1, bindings: {} },
  { id: 'P1', name: 'Engineering', parent: 'G0', depth: 1, rung: 1, bindings: { 5: 'P12', 7: 'P11' } },
  { id: 'P11', name: 'Systems', parent: 'P1', depth: 2, rung: 1, bindings: { 7: 'P111' } },
  { id: 'P12', name: 'Design', parent: 'P1', depth: 2, rung: 0, bindings: {} },
  { id: 'P111', name: 'Tools', parent: 'P11', depth: 3, rung: 0, bindings: {} },
].map(node => Object.freeze({ ...node, seats: SEATS_BY_RUNG[node.rung], bindings: Object.freeze(node.bindings) })));

const weightsOf = node => WEIGHTS.slice(0, node.seats);
const totalOf = node => weightsOf(node).reduce((total, weight) => total + weight, 0);

const LEAVES_FIRST = [...NODES].sort((a, b) => b.depth - a.depth);
const WINDOWS = {
  3: [900, 2800],
  2: [3800, 5900],
  1: [6900, 9700],
  0: [10900, 13900],
};
const CHILD_VOTE = { approved: 'yes', rejected: 'no', split: 'abstain' };

// "splitWeight" demonstrates the other possible split: the members approve,
// but the head chamber rejects. All three root outcomes remain unambiguous.
// A polis with no floor (rung 0, G(1,0)) can only approve or reject: its chairs' verdict is its verdict.
const SCENARIOS = [
  { G0: 'approved', C1: 'approved', P2: 'split', P1: 'approved', P11: 'approved', P12: 'rejected', P111: 'approved' },
  { G0: 'split', C1: 'approved', P2: 'rejected', P1: 'split', P11: 'approved', P12: 'approved', P111: 'rejected' },
  { G0: 'rejected', C1: 'splitWeight', P2: 'rejected', P1: 'rejected', P11: 'split', P12: 'approved', P111: 'rejected' },
];

function verdictFor(node, seats, members) {
  if (seats.some(vote => vote === null || vote === 'await') || members.includes(null)) return null;
  const headsPass = seats.filter(vote => vote === 'yes').length >= 7;
  if (members.length === 0) return headsPass ? 'approved' : 'rejected';
  const weight = members.reduce((sum, vote, index) => sum + (vote === 'yes' ? WEIGHTS[index] : 0), 0);
  const membersPass = weight / totalOf(node) >= 0.51;
  return headsPass && membersPass ? 'approved' : headsPass !== membersPass ? 'split' : 'rejected';
}

function shuffled(values, seed) {
  const result = [...values];
  let state = seed >>> 0;
  for (let i = result.length - 1; i > 0; i--) {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const j = state % (i + 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function planSession(scenario) {
  const targets = SCENARIOS[scenario];
  const planned = {};
  const events = [];

  for (const node of LEAVES_FIRST) {
    const target = targets[node.id];
    const headsPass = target === 'approved' || target === 'split';
    const membersPass = target === 'approved' || target === 'splitWeight';
    const [opensAt, closesAt] = WINDOWS[node.depth];
    const seats = Array(12).fill(null);
    const members = weightsOf(node).map((_, index) => membersPass
      ? (index % 5 === 3 ? 'no' : 'yes')
      : target === 'split' ? (index >= 14 ? 'yes' : 'no')
        : (index % 6 === 5 ? 'yes' : 'no'));

    for (const [index, childId] of Object.entries(node.bindings)) {
      const child = planned[childId];
      const vote = CHILD_VOTE[child.verdict];
      seats[Number(index)] = vote;
      const start = Math.max(child.sealedAt, opensAt - 600);
      events.push({ from: childId, to: node.id, start, end: start + 660,
        kind: 'child', vote, index: Number(index) });
    }

    let remainingYes = (headsPass ? 9 : 3) - seats.filter(vote => vote === 'yes').length;
    const freeSeats = seats.flatMap((vote, index) => vote === null ? [index] : []);
    for (let k = 0; k < freeSeats.length; k++) {
      seats[freeSeats[k]] = remainingYes-- > 0 ? 'yes' : k === freeSeats.length - 1 ? 'abstain' : 'no';
    }

    const acts = shuffled([
      ...freeSeats.map(index => ({ kind: 'seat', index, vote: seats[index] })),
      ...members.map((vote, index) => ({ kind: 'member', index, vote })),
    ], 1103 + scenario * 101 + NODES.indexOf(node) * 37);
    acts.forEach((act, order) => {
      const end = Math.round(opensAt + 500 + order / (acts.length - 1) * (closesAt - opensAt - 500));
      const flight = 380 + ((order + scenario) % 4) * 40;
      events.push({ from: null, to: node.id, start: end - flight, end, ...act });
    });
    planned[node.id] = { verdict: verdictFor(node, seats, members), sealedAt: closesAt };
  }

  return Object.freeze(events.sort((a, b) => a.end - b.end).map(Object.freeze));
}

const SESSIONS = SCENARIOS.map((_, index) => planSession(index));

/** The planned events of a scenario, frozen: from, to, start, end, kind, vote, index. */
export function sessionEvents(scenario = 0) {
  const numericScenario = Number(scenario);
  return SESSIONS[Number.isFinite(numericScenario) ? ((Math.trunc(numericScenario) % 3) + 3) % 3 : 0];
}

/**
 * Reconstruct a fresh snapshot at any time; no clock, DOM, or prior-call state.
 * A node's members array is as long as its rung's floor (none at rung 0).
 * Scenario numbers wrap modulo three. Only packets currently in flight are
 * returned, with their destination seat/member index. A bound seat stays
 * "await" even after its child seals, until that child's packet arrives.
 * phase is "ready", "voting", or "sealed".
 */
export function snapshot(ms, scenario = 0) {
  const numericTime = Number(ms);
  const time = Math.max(0, Math.min(DURATION, Number.isNaN(numericTime) ? 0 : numericTime));
  const numericScenario = Number(scenario);
  const scenarioIndex = Number.isFinite(numericScenario) ? ((Math.trunc(numericScenario) % 3) + 3) % 3 : 0;
  const events = SESSIONS[scenarioIndex];
  const nodes = Object.fromEntries(NODES.map(node => [node.id, {
    seats: Array.from({ length: 12 }, (_, index) => node.bindings[index] ? 'await' : null),
    members: Array(node.seats).fill(null),
    yes: 0,
    ratio: 0,
    verdict: null,
    sealedAt: null,
  }]));

  for (const event of events) {
    if (event.end > time) break;
    const state = nodes[event.to];
    if (event.kind === 'member') state.members[event.index] = event.vote;
    else {
      // A child's seal is necessary but insufficient: its packet must land.
      if (event.kind === 'child' && nodes[event.from].verdict === null) continue;
      state.seats[event.index] = event.vote;
    }
    if (state.verdict === null) {
      state.verdict = verdictFor(NODES.find(node => node.id === event.to), state.seats, state.members);
      if (state.verdict !== null) state.sealedAt = event.end;
    }
  }

  for (const node of NODES) {
    const state = nodes[node.id];
    state.yes = state.seats.filter(vote => vote === 'yes').length;
    state.ratio = node.seats ? state.members.reduce((sum, vote, index) => sum + (vote === 'yes' ? WEIGHTS[index] : 0), 0) / totalOf(node) : 0;
  }
  return {
    time,
    nodes,
    packets: events.filter(event => event.start <= time && time < event.end).map(event => ({ ...event })),
    phase: nodes.G0.verdict ? 'sealed' : events.some(event => event.start <= time) ? 'voting' : 'ready',
  };
}

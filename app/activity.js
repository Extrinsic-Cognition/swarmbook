// The activity of a polis is a present-tense observation. Historical ballots
// and proposal text are never evidence that agents are voting or discussing.

function slotValue(value) {
  if (typeof value === 'bigint') return value >= 0n ? value : null;
  if (typeof value === 'number') return Number.isSafeInteger(value) && value >= 0 ? BigInt(value) : null;
  if (typeof value === 'string' && /^\d+$/.test(value)) return BigInt(value);
  return null;
}

/** Votes remain legal at the deadline slot; an unavailable clock proves nothing. */
export function isVotingSession(session, votingState, slot) {
  const now = slotValue(slot), deadline = slotValue(session?.deadline);
  return votingState !== undefined && session?.state === votingState && now !== null && deadline !== null && now <= deadline;
}

/**
 * sessionFor(proposal, unitId) reads one session, with unitId a decimal string.
 * expired counts overdue, unsealed session windows in unexecuted proposals.
 * Discussion requires an explicit active flag AND an unexpired millisecond
 * lease; proposal text is not discussion. `now` is injectable for verification.
 *
 * Any relevant impacted chamber can keep a ballot live. A terminal origin/root
 * does not erase another chamber's voting window, including during partially
 * delivered account updates. The renderer must not end such a ballot merely
 * because the origin's historical seal is already present.
 */
export function classifyActivity({ proposals = [], units = [], sessionFor, votingState, slot, discussion = null, now = Date.now() } = {}) {
  const currentSlot = slotValue(slot);
  const relevant = new Set(Array.from(units, String));
  let proposal = null, opened = null, expired = 0;
  for (const candidate of proposals) {
    if (!candidate || candidate.executed) continue;
    const impacted = candidate.impacted == null ? relevant : candidate.impacted;
    const ids = new Set(Array.from(impacted, String).filter((id) => relevant.has(id)));
    let live = false;
    for (const id of ids) {
      const session = sessionFor?.(candidate, id);
      if (isVotingSession(session, votingState, currentSlot)) live = true;
      const deadline = slotValue(session?.deadline);
      if (votingState !== undefined && session?.state === votingState && currentSlot !== null && deadline !== null && currentSlot > deadline) expired++;
    }
    const candidateOpened = slotValue(candidate.opened) ?? 0n;
    if (live && (proposal === null || candidateOpened > opened)) {
      proposal = candidate;
      opened = candidateOpened;
    }
  }
  if (proposal) return { mode: 'voting', proposal, expired, reason: 'live ballot' };
  if (discussion?.active === true && typeof discussion.expiresAt === 'number' && Number.isFinite(discussion.expiresAt) && discussion.expiresAt > now) {
    return { mode: 'discussion', proposal: null, expired, reason: 'explicit discussion' };
  }
  return { mode: 'idle', proposal: null, expired, reason: currentSlot === null ? 'chain clock unavailable' : expired ? 'voting window ended' : 'no current activity' };
}

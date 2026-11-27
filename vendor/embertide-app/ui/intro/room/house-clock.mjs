// house-clock.mjs — THE ONE CLOCK OF EVERY GLASS (Oct 15 2026). His words that day: "how many times i said we needed to have a RTT consensus clock solana style
// proof-of-history"; Oct 14 20:36 "synchronize timing of PIXELS BEING PAINTED ON THE SCREEN LIKE AS IF THEY ARE ANAMORPHIC SHADOWS OF THE ROOM"; canon C-3 (the
// server is the beat) and C-4 (the clock is work: the Nest's hash chain is its clock, tools/embertide-mesh/lib/tick.mjs). Before this file every glass page kept
// its own guess of the house clock (the Board, the well, the mirror face, the record glass, the twin's room clock: five estimators, five rules), so two glasses
// could never agree better than the worse of their two guesses. This is the one rule, pure, with no clock of its own: a page hands it what it heard and when.
//
// WHAT THE HOUSE CLOCK IS. The Nest's wall clock on the serving Mac, the clock every cause is stamped on (wind.body tick, a touch's at, a program's act0) and the
// clock the station beats on. A glass holds OFFSET = the Nest's clock less its own local clock (ms), and houseNow = local + OFFSET.
//
// THE TWO KINDS OF SAMPLE, and the consensus between them:
//   trip(serverMs, t0, t1)   a round trip the page asked (GET /nest/head, /nest/body, /rite/pulse): the Nest stamped serverMs somewhere between t0 and t1, so
//                            OFFSET lies in [serverMs - t1, serverMs - t0]: the MIDDLE is the estimate, half the trip its error (the fog). The tightest trip is
//                            kept for holdMs (a looser one is refused while it stands, up to slack times its width: a page that follows drift may say 1.5), so
//                            a cold first ask (46 ms on the Nest's own Mac, 612 on a building page) yields to the first warm one.
//   beat(b, at)              the stream's `event: beat` {seq, head, ts}, stamped by the Nest before it left: at its arrival the Nest's clock reads AT LEAST ts,
//                            so OFFSET >= ts - at: a LOWER BOUND, late by its delivery alone (room-clock.mjs measured the quickest of the last four by 1.3 to
//                            2.3 ms, 4.2 at the median with the 3D drawing). No request. THE CHAIN: a beat's seq is the Nest's log position and its head the
//                            log's hash chain (nest.mjs: "order is the log's own order, a proof of history, no vote"); a beat whose seq does not grow is a
//                            replay or a second stream's echo and is refused, so the samples a glass keeps are in the Nest's own order.
//   The consensus: the trip's middle stands while the beats' best bound (the quickest of the last keepMs) sits under it; a bound above it raises the clock at
//   once (the Nest's clock stepped forward, or the middle read early), by stepMs at least, so a beat that agrees within the wire's jitter moves nothing at rest
//   (a moved clock is one frame on a glass: a cause); a bound past the trip's whole width retires the trip (a step: the page's next ask measures anew). A
//   backward step is followed by the next trip once the quicker beats have left the window.
//
// WHAT IT IS NOT. Not the beat grid (beat-clock.mjs: the song's tempo and downbeats, a pure function of the house time this file gives) and not the tick chain
// (tick.mjs: the proof the Nest's time passed, dormant today): those read the house time; this file is how a glass knows it. Not a slew (room-clock.mjs maps a
// scene time that never jumps for the twin's own continuity; its samples are these). COST: an array of at most a few beats, a dozen comparisons a sample, no
// timer, no read: nothing at rest.
const num = (v) => typeof v === 'number' && Number.isFinite(v);
export const KEEP_MS = 8500;        // four beats of 2 s and their jitter: the window the quickest bound is taken from
export const STEP_MS = 4;           // the measured one-way error of the quickest of four: a bound this far above the clock moves it, under it nothing moves
export const HOLD_MS = 600000;      // the tightest trip stands this long against a looser one (a device clock that was set is followed by then, or by the beats)
export const MAX_TRIP_MS = 2000;    // a trip wider than this measures nothing
export const DRIFT = 1e-4;          // THE FOG AGES (Oct 23 2026, the room audit's F10): two crystals drift apart up to 100 ppm, so a trip's middle is this much less sure each ms since it was taken

/** createHouseClock({ keepMs, stepMs, holdMs, slack, maxTripMs }) -> { trip, beat, offset, fog, now, state, reset } */
export function createHouseClock({ keepMs = KEEP_MS, stepMs = STEP_MS, holdMs = HOLD_MS, slack = 1, maxTripMs = MAX_TRIP_MS } = {}) {
  const S = { off: null, mid: null, rtt: null, at: null, trips: 0, beats: 0, refused: 0, steps: 0, seq: null, head: null, ts: null };
  let bounds = [];   // { at, lb }: OFFSET as each recent beat bounded it from below
  const floorAt = (at) => { bounds = bounds.filter((b) => at - b.at <= keepMs); let m = null; for (const b of bounds) if (m === null || b.lb > m) m = b.lb; return m; };
  /** trip(serverMs, t0, t1): a round trip the page asked, t0 and t1 on the page's local clock. -> whether the trip was taken as the clock's (a looser one
   *  than the kept, inside holdMs, is refused). The page reads offset() after it: a taken trip may leave the offset where it was. */
  function trip(serverMs, t0, t1) {
    const rtt = t1 - t0; if (!num(serverMs) || !num(t0) || !num(t1) || !(rtt >= 0) || rtt > maxTripMs) return false;
    if (S.rtt != null && rtt > S.rtt * slack && t1 - S.at < holdMs) { S.refused++; return false; }
    S.mid = serverMs - (t0 + t1) / 2; S.rtt = rtt; S.at = t1; S.trips++;
    const lb = floorAt(t1); S.off = lb !== null && lb > S.mid ? lb : S.mid; return true;
  }
  /** beat(b, at): the stream's beat {ts, seq?, head?} as it arrived at local instant at. -> whether the beat was taken as a sample (THE CHAIN: a beat whose
   *  seq is under the last, or whose ts is not past the last, is a replay or an older stream's echo and is refused; at rest the Nest's seq stands and its ts
   *  moves, 2 s a beat). The page reads offset() after it. */
  function beat(b, at) {
    const ts = b && typeof b === 'object' ? b.ts : null; if (!num(ts) || !num(at)) return false;
    if ((S.ts != null && ts <= S.ts) || (num(b.seq) && S.seq != null && b.seq < S.seq)) { S.refused++; return false; }
    S.ts = ts; if (num(b.seq)) S.seq = b.seq; if (typeof b.head === 'string') S.head = b.head;
    bounds.push({ at, lb: ts - at }); const lb = floorAt(at); S.beats++;
    if (S.mid != null && lb > S.mid + S.rtt / 2) { S.mid = null; S.rtt = null; S.at = null; S.steps++; }   // the trip contradicted: the Nest's clock stepped forward past it; retired
    const est = S.mid != null && S.mid >= lb ? S.mid : lb;
    if (S.off == null || est - S.off >= stepMs) S.off = est;
    return true;
  }
  return {
    trip, beat,
    /** the Nest's clock less this page's local clock (ms), or null before any sample */
    offset: () => S.off,
    /** how well this page knows the house clock: half the kept trip's width, plus the drift since the trip was taken when a local instant is handed
     *  (a trip kept ten minutes is not as sure as the day it was taken: DRIFT), or null with no trip standing (the beats bound it from below only) */
    fog: (local = null) => (S.rtt != null ? S.rtt / 2 + (num(local) && S.at != null && local > S.at ? (local - S.at) * DRIFT : 0) : null),
    /** the house instant for a local one, or null before any sample */
    now: (local) => (S.off == null || !num(local) ? null : local + S.off),
    state: () => ({ ...S }),
    reset: () => { S.off = null; S.mid = null; S.rtt = null; S.at = null; S.seq = null; S.head = null; S.ts = null; bounds = []; },
  };
}

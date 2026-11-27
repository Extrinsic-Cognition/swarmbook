import { randomUUID } from 'node:crypto';

export const MUSIC_REF = 'activity/spotify/mac';
const finite = n => typeof n === 'number' && Number.isFinite(n);
const text = (s, max = 200) => typeof s === 'string' ? s.replace(/[\u0000-\u001f]/g, ' ').slice(0, max) : '';
const states = new Set(['playing', 'paused', 'stopped', 'unavailable']);
// the same rule as spotify-observer.mjs ARTWORK_URL, kept here so this module stays free of node:child_process for its readers
const artworkUrl = s => typeof s === 'string' && /^https:\/\/i\.scdn\.co\/image\/[A-Za-z0-9]{8,64}$/.test(s) ? s : null;

/** Only observed playback fields cross into the room record. No audio, tokens or arbitrary app fields. */
export function normalizeSample(raw, clock, id = randomUUID()) {
  if (!raw || raw.provider !== 'spotify' || raw.source !== 'mac-spotify' || raw.seat !== 'mac' || !states.has(raw.playback_state)) throw new Error('Invalid Spotify observation');
  if (!finite(raw.observed_ms) || raw.observed_ms < 0) throw new Error('Missing observation time');
  if (!clock || clock.method !== 'http-midpoint' || ![clock.offset_ms, clock.rtt_ms, clock.sampled_at_ms].every(finite) || clock.rtt_ms < 0 || clock.rtt_ms > 5000) throw new Error('Invalid room clock estimate');
  if (raw.observed_ms < clock.sampled_at_ms - 10000 || raw.observed_ms > clock.sampled_at_ms + 60000) throw new Error('Room clock estimate expired');
  const start = raw.read_started_ms ?? raw.observed_ms;
  const end = raw.read_finished_ms ?? raw.observed_ms;
  if (![start, end].every(finite) || start < 0 || start > raw.observed_ms || end < raw.observed_ms || end - start > 10000) throw new Error('Invalid observation window');
  const track = raw.track && typeof raw.track === 'object' && text(raw.track.id, 300) ? {
    id: text(raw.track.id, 300), title: text(raw.track.title), artist: text(raw.track.artist),
    duration_ms: finite(raw.track.duration_ms) && raw.track.duration_ms >= 0 ? raw.track.duration_ms : null,
    album: text(raw.track.album) || null, artwork_url: artworkUrl(raw.track.artwork_url),
  } : null;
  if (['playing', 'paused'].includes(raw.playback_state) && !track) throw new Error('Playing observation has no track identity');
  return {
    id, provider: 'spotify', source: 'mac-spotify', seat: 'mac', observed_ms: raw.observed_ms,
    room_ms: raw.observed_ms + clock.offset_ms, read_started_ms: start, read_finished_ms: end,
    playback_state: raw.playback_state, track,
    position_ms: track && finite(raw.position_ms) && raw.position_ms >= 0 ? raw.position_ms : null,
    ...(raw.reason ? { reason: text(raw.reason, 160) } : {}),
    ...(raw.playback_state === 'playing' && raw.stalled === true ? { stalled: true } : {}),   // A STALL IS NOT A SEEK (Sept 30): the ear's marker crosses; a glass holds a stalled position
  };
}

export function transitionKind(prev, current) {
  if (!prev) return 'observed';
  if (current.observed_ms <= prev.observed_ms) throw new Error('Observation is not newer than the retained sample');
  if (current.playback_state === 'unavailable') return prev.playback_state === 'unavailable' ? null : 'observation_lost';
  if (prev.playback_state === 'unavailable') return 'observation_resumed';
  if (prev.playback_state === 'playing' && current.playback_state === 'playing' && prev.track?.id === current.track?.id && !!prev.stalled !== !!current.stalled) return current.stalled ? 'stalled' : 'resumed';   // A STALL IS NOT A SEEK: its own kinds
  const elapsed = current.observed_ms - prev.observed_ms;
  if (elapsed > 10000) return 'gap';
  if (prev.track?.id !== current.track?.id) return 'track_changed';
  if (prev.playback_state !== current.playback_state) return 'playback_changed';
  if (finite(prev.position_ms) && finite(current.position_ms)) {
    const expected = prev.position_ms + (prev.playback_state === 'playing' && !prev.stalled ? elapsed : 0);   // a stalled song stands
    // A sampled discontinuity is not proof that a particular human issued a seek.
    if (Math.abs(current.position_ms - expected) > 2500) return 'seek_detected';
  }
  return null;
}

/** What a glass reads to show the song: flat, one level, on the room clock. stamp_ms is the reading (the midpoint of the
 * native read) on the room clock; while state is 'playing' the position now is position_ms + (room now - stamp_ms), capped
 * at duration_ms. The ear writes on a change only, so an old stamp with 'playing' is a song still playing, not a stale one. */
export function nowPlaying(sample) {
  const t = sample.track;
  return { state: sample.playback_state, track_id: t?.id ?? null, title: t?.title ?? null, artist: t?.artist ?? null, album: t?.album ?? null,
    artwork_url: t?.artwork_url ?? null, duration_ms: t?.duration_ms ?? null, position_ms: sample.position_ms ?? null,
    stamp_ms: Math.round(sample.room_ms), observed_ms: sample.observed_ms, ...(sample.stalled === true ? { stalled: true } : {}) };   // A STALL IS NOT A SEEK: 'playing' with stalled true stands
}

export function nextTimeline(previous, sample, clock) {
  if (previous != null && (previous.schema !== 'embertide.music/v0' || !previous.current || !Array.isArray(previous.events))) throw new Error('Existing music record has an incompatible schema');
  if (previous?.current.id === sample.id) return previous;
  const kind = transitionKind(previous?.current, sample);
  const events = [...(previous?.events ?? [])];
  if (kind) events.push({ id: sample.id, kind, room_ms: sample.room_ms, track: sample.track,
    position_ms: sample.position_ms, playback_state: sample.playback_state });
  return { schema: 'embertide.music/v0', now_playing: nowPlaying(sample), current: sample,
    clock: { method: 'http-midpoint', offset_ms: clock.offset_ms, rtt_ms: clock.rtt_ms, sampled_at_ms: clock.sampled_at_ms },
    acoustic_alignment: 'unverified', events: events.slice(-24) };
}

export function localNestOrigin(input) {
  const u = new URL(input);
  if (!['http:', 'https:'].includes(u.protocol) || !['127.0.0.1', 'localhost', '[::1]'].includes(u.hostname) || u.username || u.password || u.search || u.hash || u.pathname !== '/') throw new Error('The Spotify seat writes only to the local Station Nest');
  return u.origin;
}

/** THE DOOR (Sept 30 2026 the ear's; Oct 10 2026 the radio station's cockpit too, his "the Nest is the airplane cockpit"): GET and POST
 * /nest/ref/<name> on this Mac's Nest only (localNestOrigin), 5 s a call, no redirect, JSON in and out; a refusal is thrown with its status
 * (409: the rev moved under the writer). request(pathname, init) is the raw call; read(name) the ref as any reader sees it ({value, rev,
 * seq, seat, ts}, or null when the Nest holds none); write(name, value, {expect, seat, t}) one compare-and-swap as a named seat, the body
 * the ear has always sent. No retry here: each writer decides what a lost answer or a 409 means for it (the ear below, the station). */
export function createRefDoor({ origin = 'http://127.0.0.1:8904', fetchImpl = fetch } = {}) {
  origin = localNestOrigin(origin);
  const request = async (pathname, init = {}) => {
    const res = await fetchImpl(origin + pathname, { ...init, redirect: 'error', signal: AbortSignal.timeout(5000) });
    let data; try { data = await res.json(); } catch { throw new Error(`Nest returned invalid JSON (${res.status})`); }
    if (!res.ok) throw Object.assign(new Error(`Nest refused (${res.status})`), { status: res.status });
    return data;
  };
  const read = async (name) => {
    const data = await request('/nest/ref/' + name);
    if (data.name !== name || !Object.hasOwn(data, 'ref')) throw new Error(`Not the ref ${name}`);
    if (data.ref != null && (!Number.isSafeInteger(data.ref.rev) || data.ref.rev < 1)) throw new Error(`Invalid revision on ref ${name}`);
    return data.ref;
  };
  const write = (name, value, { expect = 0, seat, t = null } = {}) => request('/nest/ref/' + name, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ value, expect, seat, t }) });
  return { origin, request, read, write };
}

/** The existing Nest CAS is the durable, single write; a retry cannot create duplicate transitions. */
export function createMusicPublisher({ origin = 'http://127.0.0.1:8904', fetchImpl = fetch, now = Date.now } = {}) {
  const door = createRefDoor({ origin, fetchImpl }), { request } = door;
  const readRef = async () => {
    const data = await request('/nest/ref/' + MUSIC_REF);
    if (data.name !== MUSIC_REF || !Object.hasOwn(data, 'ref')) throw new Error('Not the Station music ref');
    if (data.ref != null && (!Number.isSafeInteger(data.ref.rev) || data.ref.rev < 1 || !data.ref.value)) throw new Error('Invalid music ref revision');
    return data.ref;
  };
  return {
    async clock() {
      const t0 = now(), head = await request('/nest/head'), t1 = now();
      if (!(head.role === 'primary' || head.role === 'peer') || !finite(head.server_ms) || head.server_ms < 0 || !Number.isSafeInteger(head.seq) || typeof head.place !== 'string') throw new Error('The local Nest is not the room clock (a primary or a peer of the mesh stamps with its own clock)');   // THE NEST IS A MESH (Oct 23 2026)
      if (t1 < t0 || t1 - t0 > 5000) throw new Error('Clock observation exceeded its time budget');
      return { method: 'http-midpoint', offset_ms: head.server_ms - (t0 + t1) / 2, rtt_ms: t1 - t0, sampled_at_ms: t1 };
    },
    /** The ref as any reader sees it now (GET /nest/ref/<name> answers {name, ref: {value, rev, seq, seat, ts}}: rev is under ref). */
    read: readRef,
    async publish(raw, clock, id = randomUUID()) {
      const sample = normalizeSample(raw, clock, id);
      let old = await readRef(), conflict = null;
      for (;;) {
        if (old?.value?.current?.id === id) return { duplicate: true, ref: old };
        let value; try { value = nextTimeline(old?.value ?? null, sample, clock); } catch (e) { throw conflict || e; }   // a newer winner: the conflict stands, surfaced
        try {
          const result = await door.write(MUSIC_REF, value, { expect: old?.rev ?? 0, seat: 'spotify-mac', t: sample.room_ms });
          if (result.ok !== true || result.ref?.value?.current?.id !== id || result.ref.rev !== (old?.rev ?? 0) + 1) throw new Error('Nest acknowledgement does not match the sample');
          return result;
        } catch (error) {
          // The server may have committed before its response was lost. Read once, never blindly repeat a write.
          const retained = await readRef();
          if (retained?.value?.current?.id === id) return { recovered: true, ref: retained };
          // AFTER A NEST REBIRTH (Sept 30, mend 5): the ref moved under the ear (a reborn chain, a lost race): written once more, at once, from what the Nest holds now
          if (error.status === 409 && !conflict) { conflict = error; old = retained; continue; }
          throw error;
        }
      }
    },
  };
}

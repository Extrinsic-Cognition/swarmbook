// drops-live.mjs: THE HOUSE SAYS IT AT ONCE (Nov 20 2026, his "Build it", asked "Build the live ball: the site pushes each mint, the Mac listens to Solana and
// updates your screens?", after "any time, anywhere we got that diving lyssajudron, it gotta be updating asap with solana state... i wanna be able to see this
// in the image getting updated as new ones are minted... with a live rpc or some sort"). THE HOUSE HEARS ONCE keeps the mints' one ordered list (sr_drops,
// space-router-deposit.mjs, the card road's egg too); this says each row the moment the list takes it to every ball that is open. One Durable Object (DropsLive,
// a SQLite class) holds the balls' sockets asleep (the hibernation API: a socket costs nothing between mints, a page's 'ping' is answered 'pong' without waking it).
// GET LIVE_PATH with Upgrade: websocket opens one (app/dl-drops-live.mjs, the page's half); every message is {drops: [{n, signature, tier, at_ms}]}, the list's own rows.
import { LIVE_PATH } from '../app/dl-drops-live.mjs';

export { LIVE_PATH };
const ROW = 'SELECT n, signature, tier, at_ms FROM sr_drops WHERE signature = ?1', hall = (env) => env.DROPS_LIVE.get(env.DROPS_LIVE.idFromName('drops'));
/** liveDoor(request, env): a page's socket, handed to the one hall; with no hall bound (a preview without it) the door is not here */
export const liveDoor = (request, env) => (env.DROPS_LIVE ? hall(env).fetch(request) : new Response('Not here.', { status: 404 }));
/** sayDrop(env, signature): the list's row for this signature, said to every open ball; nothing with no hall or no row. It never throws: a page reads the list when it opens. */
export async function sayDrop(env, signature) { try { const row = env.DROPS_LIVE ? await env.DB.prepare(ROW).bind(signature).first() : null; if (row) await hall(env).fetch('https://hall/say', { method: 'POST', body: JSON.stringify({ drops: [row] }) }); } catch { /* said at the next opening */ } }
export class DropsLive {
  constructor(state) { this.state = state; try { state.setWebSocketAutoResponse(new WebSocketRequestResponsePair('ping', 'pong')); } catch { /* a runtime without it: a ping wakes it */ } }
  async fetch(request) {   // '/say' only from this Worker (liveDoor hands a page's own request, whose path is LIVE_PATH)
    if (request.method === 'POST' && new URL(request.url).pathname === '/say') { const m = await request.text(); for (const ws of this.state.getWebSockets()) { try { ws.send(m); } catch { /* gone */ } } return new Response('said'); }
    if (request.headers.get('upgrade') !== 'websocket') return new Response('A websocket, please.', { status: 426 });
    const [page, held] = Object.values(new WebSocketPair()); this.state.acceptWebSocket(held); return new Response(null, { status: 101, webSocket: page });
  }
  webSocketMessage() {}   // a page says nothing but 'ping', answered asleep
  webSocketClose(ws, code, reason) { try { ws.close(code, reason); } catch { /* closed */ } }
}

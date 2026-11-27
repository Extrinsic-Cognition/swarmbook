// space-router-egg.mjs · ONE NAME FOR HER (Nov 22 2026 UTC, lane/one-name-for-her, claude-31ccd7e4). His words: 15:17 "dude, this is the fucking delicate point... we need
// idempotency... hypertrace we had done the stripe checkout shit as well..."; 15:44, over the five stations under one name (the egg, her colours, the mint, Harmony, her
// hexagon), "fully support this". Before them: Oct 16 08:12 "there is only ever 1 lyssajudron for user"; Nov 19 14:03 the link is X; 18:59 "shouldn't we have people first
// link their twitters and then do the mint". The record: ec-workspace docs/the-account-is-a-solana-mint-and-yarvins-lodge-onboarding-hypertrace-2026-11-11.md.
// A person is a tank: the flask's own, or the one their X account holds (space-router-link.mjs tankOfFlask), so a second browser with the same X is the same person. A
// person has one egg, one row of sr_eggs (migration 0028): every door that takes money, gives a hexagon or sets a face asks it here first. Her name is the one she was born
// under when she was made in Harmony first, else her tank's without its dash ([0-9a-z]: what Harmony takes as a birth, and her wallet's door with it).
import { tankOfAuthority } from './space-router-link.mjs';
import { seatOfUsd } from '../app/dl-kit-deposit.mjs';

export const NAME = /^[0-9a-z]{1,32}$/, nameOf = (tank) => tank.replace('-', '');
const DROP = 'INSERT OR IGNORE INTO sr_drops(signature, tier, usd, at_ms, slot, heard_at) SELECT ?1, ?2, ?3, ?4, ?5, ?6';
const SQL = {
  x: 'SELECT tank, handle FROM sr_x WHERE address = ?1', ready: 'SELECT 1 FROM sr_eggs LIMIT 1',
  egg: `SELECT e.session, e.signature, e.name, d.n, h.colours, h.picture, p.payer, (SELECT c.handle FROM creators AS c WHERE c.wallet = p.payer OR c.wallet IN (SELECT address FROM sr_x WHERE tank = e.tank) LIMIT 1) AS page
    FROM sr_eggs AS e LEFT JOIN sr_drops AS d ON d.signature = e.signature LEFT JOIN sr_deposits AS p ON p.signature = e.signature LEFT JOIN sr_hexagons AS h ON h.signature = e.signature WHERE e.tank = ?1`,
  claim: 'INSERT INTO sr_eggs(tank, signature, at) VALUES (?1, ?2, ?3) ON CONFLICT(tank) DO UPDATE SET signature = excluded.signature, at = excluded.at WHERE sr_eggs.signature IS NULL ON CONFLICT(signature) DO NOTHING',
  follow: 'UPDATE OR REPLACE sr_eggs SET tank = ?1 WHERE signature = ?2 AND tank <> ?1 AND NOT EXISTS (SELECT 1 FROM sr_eggs AS o WHERE o.tank = ?1 AND o.signature IS NOT NULL)',
  stand: 'INSERT INTO sr_eggs(tank, session, at) VALUES (?1, ?2, ?3) ON CONFLICT(tank) DO UPDATE SET session = excluded.session WHERE sr_eggs.session IS ?4 AND sr_eggs.signature IS NULL',
  born: 'UPDATE sr_eggs SET name = ?2 WHERE signature = ?1 AND name IS NULL',
};
const behind = (e) => { if (/no such table/i.test(String(e?.message ?? e))) return null; throw e; };   // a database behind 0028 (or 0025) knows no egg (no X): as before it. Any other failure is the door's to say: no price on a read that failed
/** personOf(env, flask) -> { tank, x }: who a flask's key is: the tank and the handle of the X account that holds it, else its own tank and no X */
export async function personOf(env, flask) { const r = await env.DB.prepare(SQL.x).bind(flask).first().catch(behind); return { tank: r?.tank ?? await tankOfAuthority(flask), x: r ? `@${r.handle}` : null }; }
/** eggOf(env, tank) -> { session, her } or null: the checkout that stands for this person's egg, and her once it is paid: { n, signature, name, colours, picture, page, counted, rider (the flask that paid her: the one key that knocks and sits for her on a swarm, whichever of her browsers is open, as a seat of root 0 is that flask's, space-router-seat.mjs) } */
export async function eggOf(env, tank) {
  const r = await env.DB.prepare(SQL.egg).bind(tank).first().catch(behind); if (!r) return null;
  return { session: r.session, her: r.signature ? { n: r.n, signature: r.signature, name: r.name ?? nameOf(tank), colours: r.colours ? JSON.parse(r.colours) : null, picture: r.picture ?? null, page: r.page ?? null, counted: r.payer !== null, rider: r.payer ?? null } : null };
}
/** hexagon(env, { signature, tank, usd, at, slot, now }) -> the statements that draw a deposit: a person's first takes their egg and is drawn, a later one is fuel and is not; none under the floor.
 *  Asked twice for one deposit (heard at confirmed, counted at finalized): a flask whose X came between the two has another tank at the count, and its egg follows it there (the fault seat
 *  claude-2c86184f read: the count failed on the signature's row for ever, the money in no tank); where that X has her already it stays, the deposit is fuel, and the count stands all the same */
export async function hexagon(env, { signature, tank, usd, at, slot, now }) {
  const tier = seatOfUsd(usd), eggs = tier && await env.DB.prepare(SQL.ready).first().then(() => true, behind), row = [signature, tier, usd, at, slot, now];
  return !tier ? [] : eggs ? [env.DB.prepare(SQL.follow).bind(tank, signature), env.DB.prepare(SQL.claim).bind(tank, signature, now), env.DB.prepare(`${DROP} WHERE EXISTS (SELECT 1 FROM sr_eggs WHERE tank = ?7 AND signature = ?1)`).bind(...row, tank)] : [env.DB.prepare(DROP).bind(...row)];
}
/** stand(env, tank, session, was, now): this checkout stands for the person's egg in place of `was` (one that lapsed, or none): false when another press's stands already, or the egg is paid */
export const stand = async (env, tank, session, was, now) => { const r = await env.DB.prepare(SQL.stand).bind(tank, session, now, was).run().catch(behind); return r === null || Number(r?.meta?.changes ?? r?.changes) === 1; };
/** born(env, signature, name): the name she was born under in Harmony, kept once beside her egg */
export const born = (env, signature, name) => (NAME.test(name ?? '') ? env.DB.prepare(SQL.born).bind(signature, name).run().catch(behind) : null);

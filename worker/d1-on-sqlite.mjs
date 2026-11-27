// d1-on-sqlite.mjs · D1's surface on node:sqlite, the one the door's tests and proofs stand on (the Worker never imports it): a database built by the migrations named (every one, in order, by default), and its prepare, bind, first, all, run (with its changes) and batch as one transaction.
import { DatabaseSync } from 'node:sqlite'; import { readFileSync, readdirSync } from 'node:fs';
export const migrations = readdirSync(new URL('./migrations/', import.meta.url)).filter((n) => n.endsWith('.sql')).sort(), migrated = (names = migrations) => { const db = new DatabaseSync(':memory:'); for (const m of names) db.exec(readFileSync(new URL(`./migrations/${m}`, import.meta.url), 'utf8')); return db; };
export function d1(db) {
  const stmt = (sql, p = []) => ({ sql, p, bind: (...q) => stmt(sql, q), first: async () => db.prepare(sql).get(...p) ?? null, all: async () => ({ results: db.prepare(sql).all(...p) }), run: async () => ({ meta: { changes: Number(db.prepare(sql).run(...p).changes) } }) });
  return { prepare: (sql) => stmt(sql), async batch(list) { db.exec('BEGIN'); try { const out = list.map((s) => ({ results: db.prepare(s.sql).all(...s.p) })); db.exec('COMMIT'); return out; } catch (e) { db.exec('ROLLBACK'); throw e; } } };
}

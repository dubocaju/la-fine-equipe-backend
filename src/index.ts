import { Hono } from 'hono'
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

const sqlite: Database = new Database('database.sqlite');
const db: BetterSQLite3Database = drizzle(sqlite);
await migrate(db, { migrationsFolder: "migrations" });

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

export default app
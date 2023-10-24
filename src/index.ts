import { Hono } from 'hono'
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';

const sqlite: Database = new Database('database.sqlite');
const db: BunSQLiteDatabase = drizzle(sqlite);
migrate(db, { migrationsFolder: "migrations" });

const app = new Hono()

app.get('/', (c) => c.text('Hello Hono!'))

export default app
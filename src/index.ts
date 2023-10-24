import { Hono } from 'hono'
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { drizzle, BunSQLiteDatabase } from 'drizzle-orm/bun-sqlite';
import { Database } from 'bun:sqlite';
import { zValidator } from '@hono/zod-validator';
import { insertUserSchema, users } from './db/schema/users';

const sqlite: Database = new Database('database.sqlite');
const db: BunSQLiteDatabase = drizzle(sqlite);
migrate(db, { migrationsFolder: "migrations" });

const app = new Hono()

app.post("/signUp", zValidator("json", insertUserSchema), async (c) => {
    const user = c.req.valid('json');
    await db.insert(users).values(user);
    c.status(201);
    return c.body(null);
})

app.get('/', (c) => c.text('Hello Hono!'))

export default app
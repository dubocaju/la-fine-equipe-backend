import { zValidator } from '@hono/zod-validator';
import { Database } from 'bun:sqlite';
import { eq } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import * as jose from 'jose';
import { z } from 'zod';
import { signInUserSchema, signUpUserSchema, users } from './db/schema/users';
import { JWT_ISSUER, JWT_SECRET } from './jwtConfig';

const sqlite: Database = new Database('database.sqlite');
const db: BunSQLiteDatabase = drizzle(sqlite);
migrate(db, { migrationsFolder: 'migrations' });

const app = new Hono();

app.use('/api/*', cors());

app.post('/api/sign-up', zValidator('json', signUpUserSchema), async (c) => {
    const user = c.req.valid('json');
    await db.insert(users).values(user);
    return c.body(null, 201);
});

app.post('/api/sign-in', zValidator('json', signInUserSchema), async (c) => {
    const body = c.req.valid('json');
    const result = await db
        .select()
        .from(users)
        .where(eq(users.securityNumber, body.securityNumber));
    const user = result.shift();

    if (!user) {
        return c.text('User not found', 404);
    }
    if (user.password !== body.password) {
        return c.text('Wrong password', 401);
    }

    const jwt = await new jose.SignJWT({ id: user.id })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setIssuer(JWT_ISSUER)
        .sign(JWT_SECRET);

    const userPayload = {
        securityNumber: user.securityNumber,
        firstName: user.firstName,
        lastName: user.lastName,
    };

    return c.json({ user: userPayload, token: jwt }, 200);
});

app.onError((err, c) => {
    console.error(`${err}`);
    if (err instanceof z.ZodError) {
        return c.text('Input validation failed', 400);
    }
    return c.text('Internal Server Error', 500);
});

app.showRoutes();
export default app;

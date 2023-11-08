import { OpenAPIHono } from '@hono/zod-openapi';
import { Database } from 'bun:sqlite';
import { eq } from 'drizzle-orm';
import { migrate } from 'drizzle-orm/better-sqlite3/migrator';
import { BunSQLiteDatabase, drizzle } from 'drizzle-orm/bun-sqlite';
import { cors } from 'hono/cors';
import * as jose from 'jose';
import { z } from 'zod';
import { users } from './db/schemas/users';
import { JWT_ISSUER, JWT_SECRET } from './jwtConfig';
import {
    getAllUsersRoute,
    signInRoute,
    signUpRoute,
} from './openapi/routes/user';

import { medAct } from './openapi/app/medicalActs';

import { swaggerUI } from '@hono/swagger-ui';

const apiPath = process.env.API_PATH ?? '';

const sqlite: Database = new Database('database.sqlite');
const db: BunSQLiteDatabase = drizzle(sqlite);
migrate(db, { migrationsFolder: 'migrations' });

const app = new OpenAPIHono();

app.use('/api/*', cors());

app.openapi(signUpRoute, async (c) => {
    const user = c.req.valid('json');
    await db.insert(users).values(user);
    return c.body(null, 201);
});

app.openapi(signInRoute, async (c) => {
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

app.openapi(getAllUsersRoute, async (c) => {
    const result = await db
        .select({
            securityNumber: users.securityNumber,
            firstName: users.firstName,
            lastName: users.lastName,
        })
        .from(users);

    return c.json({ users: result }, 200);
});

app.route('/medAct', medAct);

app.get('/swagger', swaggerUI({ url: '/doc' }));

app.doc(`/doc`, {
    openapi: '3.1.0',
    info: {
        title: 'DMI',
        version: '0.1.1',
    },
    tags: [
        {
            name: 'Users',
            description: 'All routes user-related',
        },
        {
            name: 'Medical acts',
            description: 'All routes that concern medical acts',
        },
    ],
    servers: [{ url: apiPath, description: 'default' }],
});

app.onError((err, c) => {
    console.error(`${err}`);
    if (err instanceof z.ZodError) {
        return c.text('Input validation failed', 400);
    }
    return c.text('Internal Server Error', 500);
});

export default app;

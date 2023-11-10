import { OpenAPIHono } from '@hono/zod-openapi';
import { eq } from 'drizzle-orm';
import * as jose from 'jose';
import { DatabaseSingleton } from '../db/database';
import { users } from '../db/schemas/users';
import { JWT_ISSUER, JWT_SECRET } from '../jwtConfig';
import { signInRoute, signUpRoute } from '../openapi/routes/auth';

const db = DatabaseSingleton.getInstance().db;
const authApp = new OpenAPIHono();

authApp.openapi(signUpRoute, async (c) => {
    const user = c.req.valid('json');
    await db.insert(users).values(user);
    return c.body(null, 201);
});

authApp.openapi(signInRoute, async (c) => {
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

export default authApp;

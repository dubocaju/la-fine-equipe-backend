import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { z } from 'zod';
import authApp from './routes/auth';
import userApp from './routes/user';

import { medAct } from './openapi/app/medicalActs';
const apiPath = process.env.API_PATH ?? '';
const app = new OpenAPIHono();

app.use('*', cors());

app.route('/auth', authApp);
app.route('/users', userApp);

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

app.route('/medAct', medApp);

app.get('/swagger', swaggerUI({ url: '/doc' }));

app.doc(`/doc`, {
    openapi: '3.1.0',
    info: {
        title: 'DMI',
        version: '0.1.2',
    },
    servers: [{ url: apiPath, description: 'default' }],
});

app.get('/swagger', swaggerUI({ url: `${apiPath}/doc` }));

app.onError((err, c) => {
    console.error(`${err}`);
    if (err instanceof z.ZodError) {
        return c.text('Input validation failed', 400);
    }
    return c.text('Internal Server Error', 500);
});

export default app;

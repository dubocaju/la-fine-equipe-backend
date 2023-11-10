import { swaggerUI } from '@hono/swagger-ui';
import { OpenAPIHono } from '@hono/zod-openapi';
import { cors } from 'hono/cors';
import { z } from 'zod';
import authApp from './routes/auth';
import userApp from './routes/user';

const apiPath = process.env.API_PATH ?? '';
const app = new OpenAPIHono();

app.use('*', cors());

app.route('/auth', authApp);
app.route('/users', userApp);

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

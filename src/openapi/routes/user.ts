import { createRoute, z } from '@hono/zod-openapi';

const userSchema = z
    .object({
        id: z.number().openapi({ example: 123 }),
        securityNumber: z.string().openapi({ example: '123-123-123' }),
        firstName: z.string().openapi({ example: 'Gerard' }),
        lastName: z.string().openapi({ example: 'Boulon' }),
        password: z.string().openapi({ example: 'my-very-secure-password' }),
    })
    .openapi('User');

const signUpUserSchema = userSchema.omit({
    id: true,
});

export const signUpRoute = createRoute({
    method: 'post',
    path: '/api/sign-up',
    description: 'Sign up (create a new user in the database)',
    request: {
        body: {
            content: {
                'application/json': { schema: signUpUserSchema },
            },
        },
    },
    responses: {
        201: { description: 'Sign up success' },
    },
});

const signInUserSchema = userSchema.pick({
    securityNumber: true,
    password: true,
});

export const signInRoute = createRoute({
    method: 'post',
    path: '/api/sign-in',
    description: 'Sign in (authenticate to an existing user)',
    request: {
        body: {
            content: {
                'application/json': { schema: signInUserSchema },
            },
        },
    },
    responses: {
        404: { description: 'User not found' },
        401: { description: 'Wrong password' },
        200: { description: 'Sign in success' },
    },
});

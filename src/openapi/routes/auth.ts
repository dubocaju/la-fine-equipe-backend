import { z } from 'zod';
import { userPayloadSchema, userSchema } from './user';
import { createRoute } from '@hono/zod-openapi';

const signUpBodySchema = userSchema.omit({
    id: true,
});

export const signUpRoute = createRoute({
    tags: ['auth'],
    method: 'post',
    path: '/sign-up',
    description: 'Sign up (create a new user in the database)',
    request: {
        body: {
            content: {
                'application/json': { schema: signUpBodySchema },
            },
        },
    },
    responses: {
        400: {
            description: 'A user with the same security number already exists',
        },
        201: { description: 'Sign up success' },
    },
});

const signInBodySchema = userSchema.pick({
    securityNumber: true,
    password: true,
});

const signInResponseSchema = z.object({
    user: userPayloadSchema,
    token: z.string().openapi({
        example:
            'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6MSwiaWF0IjoxNjk4NDAxNDkwLCJpc3MiOiJETUkifQ.rwKkKeft1-EDYxz9h-K28YVgBmkFCPU07ovsufaniCA',
    }),
});

export const signInRoute = createRoute({
    tags: ['auth'],
    method: 'post',
    path: '/sign-in',
    description: 'Sign in (authenticate to an existing user)',
    request: {
        body: {
            content: {
                'application/json': { schema: signInBodySchema },
            },
        },
    },
    responses: {
        404: { description: 'User not found' },
        401: { description: 'Wrong password' },
        200: {
            description: 'Sign in success',
            content: {
                'application/json': {
                    schema: signInResponseSchema,
                },
            },
        },
    },
});

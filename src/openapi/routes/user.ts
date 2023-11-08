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

const userPayloadSchema = userSchema.pick({
    securityNumber: true,
    firstName: true,
    lastName: true,
});

const signUpBodySchema = userSchema.omit({
    id: true,
});

export const signUpRoute = createRoute({
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

const getAllResponseSchema = z.object({
    users: z.array(userPayloadSchema),
});

export const getAllUsersRoute = createRoute({
    method: 'get',
    path: '/users',
    description: 'Get users list',
    responses: {
        200: {
            description: 'Success',
            content: {
                'application/json': {
                    schema: getAllResponseSchema,
                },
            },
        },
    },
});

import { createRoute, z } from '@hono/zod-openapi';

export const userSchema = z
    .object({
        id: z.number().openapi({ example: 123 }),
        securityNumber: z.string().openapi({ example: '123-123-123' }),
        firstName: z.string().openapi({ example: 'Gerard' }),
        lastName: z.string().openapi({ example: 'Boulon' }),
        password: z.string().openapi({ example: 'my-very-secure-password' }),
    })
    .openapi('User');

export const userPayloadSchema = userSchema.pick({
    securityNumber: true,
    firstName: true,
    lastName: true,
});

const getAllResponseSchema = z.object({
    users: z.array(userPayloadSchema),
});

export const getAllUsersRoute = createRoute({
    tags: ['users'],
    method: 'get',
    path: '',
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

const getUserParamsSchema = z.object({
    securityNumber: z.string().openapi({
        param: {
            name: 'securityNumber',
            in: 'path',
        },
        example: '123-123-123',
    }),
});

const getUserResponseSchema = z.object({
    user: userPayloadSchema,
});

export const getUserRoute = createRoute({
    tags: ['users'],
    method: 'get',
    path: '/{securityNumber}',
    request: {
        params: getUserParamsSchema,
    },
    description: 'Get a specific user by their security number',
    responses: {
        404: { description: 'User not found' },
        200: {
            description: 'Success',
            content: {
                'application/json': {
                    schema: getUserResponseSchema,
                },
            },
        },
    },
});

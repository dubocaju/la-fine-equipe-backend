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

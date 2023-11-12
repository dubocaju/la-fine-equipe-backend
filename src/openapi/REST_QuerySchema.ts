import * as z from 'zod';

export const selectQuerySchema = z.object({
    select: z
        .string() // ou z.array(z.string) ? voir .refine()
        .optional()
        .openapi({
            param: {
                in: 'query',
                name: 'select',
                required: false,
            },
            example: 'select=firstName,lastName,job',
        }),
    filter: z
        .string() // ou z.array(z.string) ? voir .refine()
        .optional()
        .openapi({
            param: {
                in: 'query',
                name: 'filter',
                required: false,
            },
        }),
    sortBy: z
        .string()
        .optional()
        .openapi({
            param: {
                in: 'query',
                name: 'sortBy',
                required: false,
            },
        }),
    orderBy: z
        .string()
        .optional()
        .openapi({
            param: {
                in: 'query',
                name: 'orderBy',
                required: false,
            },
        }),
});

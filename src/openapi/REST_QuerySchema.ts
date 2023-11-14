import * as z from 'zod';

export const selectQuerySchema = z.object({
    select: z
        .string()
        .optional()
        .openapi({
            param: {
                in: 'query',
                name: 'select',
                required: false,
            },
            example: 'firstName,lastName',
        }),
    filter: z
        .string()
        .optional()
        .transform((val) => {
            if (!val) return val;
            return val.split(' ');
        })
        .refine((array) => !array || array.length % 3 === 0, {
            message:
                "Filter option should always be three element, as : 'PropertyName' -eq|gt|lt value",
        })
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
        .enum(['asc', 'desc', 'Ascending', 'Descending'])
        .optional()
        .transform((val) => {
            if (val === 'Ascending') return 'asc';
            if (val === 'Descending') return 'desc';
            return val;
        })
        .default('asc')
        .openapi({
            param: {
                in: 'query',
                name: 'orderBy',
                required: false,
            },
        }),
});

export const parseQuery = (query: any) => {
    // TODO: parse 4 filter
    return {
        select: query.select,
        filter: query.filter,
        sortBy: query.sortBy,
        orderBy: query.orderBy,
    };
};

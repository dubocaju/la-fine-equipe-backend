import { createRoute, z } from '@hono/zod-openapi';

const medActSchema = z.object({
    id: z.number().openapi({ example: 123 }),
    date : z.string().openapi({ example: '2021-01-01' }),
    place : z.string().openapi({ example: 'Paris' }),
    intervention: z.string().openapi({ example: 'Consultation' }),
    comment: z.string().openapi({ example: 'Consultation' }),
    priceIntervention: z.number().openapi({ example: 123 }),
    priceSupported: z.number().openapi({ example: 123 }),
    isConfirmed: z.boolean().openapi({ example: true }),
    isPaid: z.boolean().openapi({ example: true })
}).openapi('medicalAct');



const getAllResponseSchema = z.object({
    medicalActs: z.array(medActSchema),
});

const userIdParamSchema = z.object({
    userId: z.string().openapi({
        param: {
            name: 'userId',
            in: 'path'
        },
        example: '123' }),
});

export const getAllMedActRoute = createRoute({
    method: 'get',
    path: '/medAct',
    description: 'Get the list of all medical acts',
    tags: ['Medical acts'],
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

export const getAllMedActOfGivedPatientRoute = createRoute({
    method: 'get',
    path: '/patient/:patienId/medAct/',
    description: 'Get the list of all medical acts for a specified patient',
    request: {
        params : userIdParamSchema,
    },
    tags: ['Medical acts'],
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

const medicalActIdParamSchema = z.object({
    medActId: z.string().openapi({
        param: {
            name: 'medActId',
            in: 'path'
        },
        example: '123'
    }),
});

export const validateMedActRoute = createRoute({
    method: 'patch',
    path: '/medAct/:medActId/validate',
    description: 'Validate a medical act. This implies that two patient can\'t have the same medical id',
    request: {
        params : medicalActIdParamSchema,
    },
    tags: ['Medical acts'],
    responses: {
        200: {
            description: 'Success',
            content: {
                'application/json': {
                    schema: { comment : z.string().openapi({ example: 'le rdv est validé bg' }) },
                },
            },
        },
    },
});

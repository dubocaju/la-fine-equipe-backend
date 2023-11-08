import { OpenAPIHono } from '@hono/zod-openapi';
import {
    getAllMedActRoute,
    getAllMedActOfGivedPatientRoute,
    validateMedActRoute,
} from '../routes/medicalAct';

const middlewareURL = 'http://middle.mikl.fr/api/module';
const middlewareHeaders = {
    'X-Source-Module': 'dmi',
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

export const medAct = new OpenAPIHono();

medAct.openapi(getAllMedActRoute, async (c) => {
    const response = await fetch(middlewareURL + '/hopital/medAct', {
        method: 'GET',
        headers: middlewareHeaders,
    });
    const result = await response.json();
    return c.json({ medicalActs: result }, 200);
});

medAct.openapi(getAllMedActOfGivedPatientRoute, async (c) => {
    const { userId } = c.req.valid('param');
    const response = await fetch(
        middlewareURL + '/hopital/patient/' + userId + '/medAct',
        {
            method: 'GET',
            headers: middlewareHeaders,
        }
    );
    const result = await response.json();

    return c.json({ medicalActs: result }, 200);
});

medAct.openapi(validateMedActRoute, async (c) => {
    const { medActId } = c.req.valid('param');
    const response = await fetch(
        middlewareURL + '/hopital/' + medActId + '/validate',
        {
            method: 'PATCH',
            headers: middlewareHeaders,
        }
    );
    const result = await response.json();

    return c.json({ comment: result }, 200);
});

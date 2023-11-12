import { OpenAPIHono } from '@hono/zod-openapi';
import { logger } from 'hono/logger';
import {
    getAllMedActRoute,
    getAllMedActOfGivedPatientRoute,
    validateMedActRoute,
} from '../openapi/routes/medicalAct';

const middlewareURL = 'http://middle.mikl.fr/api/module';
const middlewareHeaders = {
    'X-Source-Module': 'dmi',
    'Content-Type': 'application/json',
    Accept: 'application/json',
};

const medApp = new OpenAPIHono();
medApp.use('*', logger());

const dummyMedActs = [
    {
        id: 1,
        date: '2021-01-01',
        place: 'Paris',
        intervention: 'Consultation',
        comment: 'Consultation',
        priceIntervention: 123,
        priceSupported: 123,
        isConfirmed: true,
        isPaid: true,
    },
    {
        id: 2,
        date: '2021-01-02',
        place: 'Paris',
        intervention: 'Consultation',
        comment: 'Consultation',
        priceIntervention: 123,
        priceSupported: 123,
        isConfirmed: true,
        isPaid: true,
    },
    {
        id: 3,
        date: '2021-01-03',
        place: 'Paris',
        intervention: 'Consultation',
        comment: 'Consultation',
        priceIntervention: 123,
        priceSupported: 123,
        isConfirmed: true,
        isPaid: true,
    },
    {
        id: 4,
        date: '2021-01-04',
        place: 'Paris',
        intervention: 'Consultation',
        comment: 'Consultation',
        priceIntervention: 123,
        priceSupported: 123,
        isConfirmed: true,
        isPaid: true,
    },
    {
        id: 5,
        date: '2021-01-05',
        place: 'Paris',
        intervention: 'Consultation',
        comment: 'Consultation',
        priceIntervention: 123,
        priceSupported: 123,
        isConfirmed: true,
        isPaid: true,
    },
];

medApp.openapi(getAllMedActRoute, async (c) => {
    const { select, filter, sortBy, orderBy } = c.req.valid('query');
    console.log(
        'select : ',
        select,
        'filter : ',
        filter,
        'sortBy :',
        sortBy,
        ' orderBy :',
        orderBy
    );
    // const response = await fetch(middlewareURL + '/hopital/medAct', {
    //     method: 'GET',
    //     headers: middlewareHeaders,
    // });
    // const result = await response.json();
    // return c.json({ medicalActs: result }, response.status);
    return c.json({ medicalActs: dummyMedActs }, 200);
});

medApp.openapi(getAllMedActOfGivedPatientRoute, async (c) => {
    const { patienId } = c.req.valid('param');
    console.log('patienId: ', patienId);
    const response = await fetch(
        middlewareURL + '/hopital/patient/' + patienId + '/medAct',
        {
            method: 'GET',
            headers: middlewareHeaders,
        }
    );
    const result = await response.json();

    return c.json({ medicalActs: result }, response.status);
});

medApp.openapi(validateMedActRoute, async (c) => {
    const { medActId } = c.req.valid('param');
    const response = await fetch(
        middlewareURL + '/hopital/' + medActId + '/validate',
        {
            method: 'PATCH',
            headers: middlewareHeaders,
        }
    );
    const result = await response.json();

    return c.json({ comment: result }, response.status);
});

export default medApp;

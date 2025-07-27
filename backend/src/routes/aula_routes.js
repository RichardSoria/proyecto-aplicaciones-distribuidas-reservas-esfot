import {
    createAula,
    updateAula,
    enableAula,
    disableAula,
    getAllAulas,
    getAulaById
} from '../controllers/aula_controller.js';

import {
    createAulaSchema,
    updateAulaSchema,
    enableAulaSchema,
    disableAulaSchema,
    getAllAulasSchema,
    getAulaByIdSchema
} from '../schema/aula_schema.js';

import verifyAuth from '../middlewares/authentication.js';

export default async function aulaRoutes(fastify) {
    fastify.post('/create', { preHandler: verifyAuth, schema: createAulaSchema }, createAula);
    fastify.put('/update/:id', { preHandler: verifyAuth, schema: updateAulaSchema }, updateAula);
    fastify.put('/enable/:id', { preHandler: verifyAuth, schema: enableAulaSchema }, enableAula);
    fastify.put('/disable/:id', { preHandler: verifyAuth, schema: disableAulaSchema }, disableAula);
    fastify.get('/aulas', { preHandler: verifyAuth, schema: getAllAulasSchema }, getAllAulas);
    fastify.get('/aulas/:id', { preHandler: verifyAuth, schema: getAulaByIdSchema }, getAulaById);
}

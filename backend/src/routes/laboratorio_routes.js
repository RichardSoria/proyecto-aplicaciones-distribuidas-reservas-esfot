import {
    createLaboratorio,
    updateLaboratorio,
    enableLaboratorio,
    disableLaboratorio,
    getAllLaboratorios,
    getLaboratorioById
} from '../controllers/laboratorio_controller.js';

import {
    createLaboratorioSchema,
    updateLaboratorioSchema,
    enableLaboratorioSchema,
    disableLaboratorioSchema,
    getAllLaboratoriosSchema,
    getLaboratorioByIdSchema
} from '../schema/laboratorio_Schema.js';

import verifyAuth from '../middlewares/authentication.js';

export default async function laboratorioRoutes(fastify) {
    fastify.post('/create', { preHandler: verifyAuth, schema: createLaboratorioSchema }, createLaboratorio);
    fastify.put('/update/:id', { preHandler: verifyAuth, schema: updateLaboratorioSchema }, updateLaboratorio);
    fastify.put('/enable/:id', { preHandler: verifyAuth, schema: enableLaboratorioSchema }, enableLaboratorio);
    fastify.put('/disable/:id', { preHandler: verifyAuth, schema: disableLaboratorioSchema }, disableLaboratorio);
    fastify.get('/laboratorios', { preHandler: verifyAuth, schema: getAllLaboratoriosSchema }, getAllLaboratorios);
    fastify.get('/laboratorios/:id', { preHandler: verifyAuth, schema: getLaboratorioByIdSchema }, getLaboratorioById);
}

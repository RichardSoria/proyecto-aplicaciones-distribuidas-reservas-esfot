import {
    createReserva,
    assignReserva,
    approveReserva,
    rejectReserva,
    cancelReserva,
    getAllReservas,
    getAllReservasGeneral,
    getReservaById
} from '../controllers/reserva_controller.js';

import {
    createReservaSchema,
    assignReservaSchema,
    approveReservaSchema,
    rejectReservaSchema,
    cancelReservaSchema,
    getAllReservasSchema,
    getAllReservasGeneralSchema,
    getReservaByIdSchema
} from '../schema/reserva_schema.js';

import verifyAuth from '../middlewares/authentication.js';

export default async function reservaRoutes(fastify) {
    fastify.post('/create', { preHandler: verifyAuth, schema: createReservaSchema }, createReserva);
    fastify.post('/assign', { preHandler: verifyAuth, schema: assignReservaSchema }, assignReserva);
    fastify.patch('/approve/:id', { preHandler: verifyAuth, schema: approveReservaSchema }, approveReserva);
    fastify.patch('/reject/:id', { preHandler: verifyAuth, schema: rejectReservaSchema }, rejectReserva);
    fastify.patch('/cancel/:id', { preHandler: verifyAuth, schema: cancelReservaSchema }, cancelReserva);
    fastify.get('/reservas', { preHandler: verifyAuth, schema: getAllReservasSchema }, getAllReservas);
    fastify.get('/reservas/general', { preHandler: verifyAuth, schema: getAllReservasGeneralSchema }, getAllReservasGeneral);
    fastify.get('/reservas/:id', { preHandler: verifyAuth, schema: getReservaByIdSchema }, getReservaById);
}

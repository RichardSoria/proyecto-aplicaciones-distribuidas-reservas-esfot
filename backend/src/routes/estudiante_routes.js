import {
  loginEstudiante,
  registerEstudiante,
  updateEstudiante,
  enableEstudiante,
  disableEstudiante,
  recoverPassword,
  verifyToken,
  sendRecoverPassword,
  updatePassword,
  getAllEstudiantes,
  getEstudianteById,
  getEstudianteProfile
} from '../controllers/estudiante_controller.js';

import {
  loginEstudianteSchema,
  registerEstudianteSchema,
  updateEstudianteSchema,
  enableEstudianteSchema,
  disableEstudianteSchema,
  recoverPasswordEstudianteSchema,
  verifyTokenEstudianteSchema,
  sendRecoverPasswordEstudianteSchema,
  updatePasswordEstudianteSchema,
  getAllEstudiantesSchema,
  getEstudianteByIdSchema,
  getEstudianteProfileSchema
} from '../schema/estudiante_Schema.js';

import verifyAuth from "../middlewares/authentication.js";

export default async function estudianteRoutes(fastify) {
  fastify.post('/login', { schema: loginEstudianteSchema }, loginEstudiante);
  fastify.post('/register', { preHandler: verifyAuth, schema: registerEstudianteSchema }, registerEstudiante);
  fastify.put('/update/:id', { preHandler: verifyAuth, schema: updateEstudianteSchema }, updateEstudiante);
  fastify.put('/enable/:id', { preHandler: verifyAuth, schema: enableEstudianteSchema }, enableEstudiante);
  fastify.put('/disable/:id', { preHandler: verifyAuth, schema: disableEstudianteSchema }, disableEstudiante);
  fastify.post('/recover-password', { schema: recoverPasswordEstudianteSchema }, recoverPassword);
  fastify.get('/verify-token/:token', { schema: verifyTokenEstudianteSchema }, verifyToken);
  fastify.post('/send-recover-password/:token', { schema: sendRecoverPasswordEstudianteSchema }, sendRecoverPassword);
  fastify.put('/update-password', { preHandler: verifyAuth, schema: updatePasswordEstudianteSchema }, updatePassword);
  fastify.get('/estudiantes', { preHandler: verifyAuth, schema: getAllEstudiantesSchema }, getAllEstudiantes);
  fastify.get('/estudiantes/:id', { preHandler: verifyAuth, schema: getEstudianteByIdSchema }, getEstudianteById);
  fastify.get('/profile', { preHandler: verifyAuth, schema: getEstudianteProfileSchema }, getEstudianteProfile);
}

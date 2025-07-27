import {
    loginDocente,
    registerDocente,
    updateDocente,
    enableDocente,
    disableDocente,
    recoverPassword,
    verifyToken,
    sendRecoverPassword,
    updatePassword,
    getAllDocentes,
    getDocenteById,
    getDocenteProfile
} from "../controllers/docente_controller.js";

import {
    loginDocenteSchema,
    registerDocenteSchema,
    updateDocenteSchema,
    enableDocenteSchema,
    disableDocenteSchema,
    recoverPasswordSchemaDocente,
    verifyTokenDocenteSchema,
    sendRecoverPasswordDocenteSchema,
    updateDocentePasswordSchema,
    getAllDocentesSchema,
    getDocenteByIdSchema,
    getDocenteProfileSchema
} from "../schema/docente_schema.js";

import verifyAuth from "../middlewares/authentication.js";

export default async function docenteRoutes(fastify) {
    fastify.post("/login", { schema: loginDocenteSchema }, loginDocente);
    fastify.post("/register", { preHandler: verifyAuth, schema: registerDocenteSchema }, registerDocente);
    fastify.put("/update/:id", { preHandler: verifyAuth, schema: updateDocenteSchema }, updateDocente);
    fastify.put("/enable/:id", { preHandler: verifyAuth, schema: enableDocenteSchema }, enableDocente);
    fastify.put("/disable/:id", { preHandler: verifyAuth, schema: disableDocenteSchema }, disableDocente);
    fastify.post("/recover-password", { schema: recoverPasswordSchemaDocente }, recoverPassword);
    fastify.get("/verify-token/:token", { schema: verifyTokenDocenteSchema }, verifyToken);
    fastify.post("/send-recover-password/:token", { schema: sendRecoverPasswordDocenteSchema }, sendRecoverPassword);
    fastify.put("/update-password", { preHandler: verifyAuth, schema: updateDocentePasswordSchema }, updatePassword);
    fastify.get("/docentes", { preHandler: verifyAuth, schema: getAllDocentesSchema }, getAllDocentes);
    fastify.get("/docentes/:id", { preHandler: verifyAuth, schema: getDocenteByIdSchema }, getDocenteById);
    fastify.get("/profile", { preHandler: verifyAuth, schema: getDocenteProfileSchema }, getDocenteProfile);
}

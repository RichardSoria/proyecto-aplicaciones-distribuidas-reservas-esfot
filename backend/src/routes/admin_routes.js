import {
    loginAdminSchema,
    registerAdminSchema,
    updateAdminSchema,
    enableAdminSchema,
    disableAdminSchema,
    recoverPasswordSchema,
    verifyTokenSchema,
    sendRecoverPasswordSchema,
    updatePasswordSchema,
    getAllAdminsSchema,
    getAdminByIdSchema,
    getAdminProfileSchema
} from "../schema/admin_schema.js";

import {
    loginAdmin,
    registerAdmin,
    updateAdmin,
    enableAdmin,
    disableAdmin,
    recoverPassword,
    verifyToken,
    sendRecoverPassword,
    updatePassword,
    getAllAdmins,
    getAdminById,
    getAdminProfile
} from "../controllers/admin_controller.js";

import verifyAuth from "../middlewares/authentication.js";

export default async function adminRoutes(fastify) {
    fastify.post("/login", { schema: loginAdminSchema }, loginAdmin);
    fastify.post("/register", { preHandler: verifyAuth, schema: registerAdminSchema }, registerAdmin);
    fastify.put("/update/:id", { preHandler: verifyAuth, schema: updateAdminSchema }, updateAdmin);
    fastify.put("/enable/:id", { preHandler: verifyAuth, schema: enableAdminSchema }, enableAdmin);
    fastify.put("/disable/:id", { preHandler: verifyAuth, schema: disableAdminSchema }, disableAdmin);
    fastify.post("/recover-password", { schema: recoverPasswordSchema }, recoverPassword);
    fastify.get("/verify-token/:token", { schema: verifyTokenSchema }, verifyToken);
    fastify.post("/send-recover-password/:token", { schema: sendRecoverPasswordSchema }, sendRecoverPassword);
    fastify.put("/update-password", { preHandler: verifyAuth, schema: updatePasswordSchema }, updatePassword);
    fastify.get("/admins", { preHandler: verifyAuth, schema: getAllAdminsSchema }, getAllAdmins);
    fastify.get("/admins/:id", { preHandler: verifyAuth, schema: getAdminByIdSchema }, getAdminById);
    fastify.get("/profile", { preHandler: verifyAuth, schema: getAdminProfileSchema }, getAdminProfile);
}

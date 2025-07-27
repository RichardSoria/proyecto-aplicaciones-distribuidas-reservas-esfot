import fastify from './server.js';

// Iniciar el servidor
const start = async () => {
    try {
        await fastify.listen({ port: fastify.config.PORT, host: "0.0.0.0" });
        console.log(` Servidor corriendo en http://localhost:${fastify.config.PORT}`);
    } catch (error) {
        console.error("Error al iniciar el servidor:", error);
        process.exit(1);
    }
};

start();
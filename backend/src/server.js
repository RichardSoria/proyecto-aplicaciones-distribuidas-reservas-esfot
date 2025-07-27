import Fastify from 'fastify';
import fastifyEnv from '@fastify/env';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from 'fastify-multipart';
import fastifyJWT from '@fastify/jwt';
import cors from '@fastify/cors';
import swagger from '@fastify/swagger';
import swaggerUI from '@fastify/swagger-ui';
import Ajv from 'ajv';
import addErrors from 'ajv-errors';
import cloudinary from 'cloudinary';

import { envSchema } from './config/envSchema.js';
import connectDB from './database.js';
import verifyAuth from "./middlewares/authentication.js";

// Rutas
import adminRoutes from "./routes/admin_routes.js";
import docenteRoutes from "./routes/docente_routes.js";
import estudianteRoutes from "./routes/estudiante_routes.js";
import laboratorioRoutes from './routes/laboratorio_routes.js';
import aulaRoutes from './routes/aula_routes.js';
import reservaRoutes from './routes/reserva_routes.js';

// AJV config
const ajv = new Ajv({ allErrors: true, strict: false });
addErrors(ajv);

// Crear instancia Fastify
const fastify = Fastify({
  logger: true,
  ajv: {
    customOptions: { allErrors: true, strict: false },
    plugins: [addErrors],
    options: {},
    factory: () => ajv
  }
});

// Variables de entorno
await fastify.register(fastifyEnv, {
  confKey: 'config',
  schema: envSchema,
  dotenv: true
});

// Plugins
await fastify.register(fastifyCookie, { secret: fastify.config.COOKIE_SECRET });

await fastify.register(cors, {
  origin: fastify.config.URL_FRONTEND,
  methods: ['GET', 'POST', 'PUT', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
});

await fastify.register(fastifyJWT, { secret: fastify.config.JWT_SECRET });

// Swagger
await fastify.register(swagger, {
  openapi: {
    info: {
      title: 'API RESTfull Reservas-ESFOT',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'tokenJWT',
          description: 'Autenticación mediante cookie firmada con JWT'
        }
      }
    },
    security: [{ cookieAuth: [] }]
  }
});

await fastify.register(swaggerUI, {
  routePrefix: '/api/docs',
  uiConfig: { docExpansion: 'list', deepLinking: true },
  staticCSP: true,
  transformStaticCSP: (header) => header
});

// Conexión DB
await connectDB(fastify);

// Rutas base
fastify.get('/api/auth/status', {
  schema: {
    tags: ['Autenticación'],
    summary: 'Verificar autenticación del usuario',
    description: 'Devuelve si el usuario está autenticado basándose en la cookie firmada `tokenJWT`'
  }
}, async (req, reply) => {
  if (!req.unsignCookie || !req.cookies.tokenJWT) {
    return reply.send({ authenticated: false });
  }

  const { valid, value } = req.unsignCookie(req.cookies.tokenJWT);

  if (!valid) {
    return reply.send({ authenticated: false });
  }

  try {
    const payload = fastify.jwt.verify(value);
    return reply.send({ authenticated: true, user: payload });
  } catch (error) {
    return reply.send({ authenticated: false });
  }
});

fastify.post('/api/logout', {
  preHandler: verifyAuth,
  schema: {
    tags: ['Autenticación'],
    summary: 'Cerrar sesión del usuario',
    description: 'Elimina la cookie de autenticación JWT y finaliza la sesión del usuario.',
    response: {
      200: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Sesión cerrada exitosamente' }
        }
      }
    }
  }
}, async (req, reply) => {
  reply.clearCookie('tokenJWT', {
    path: '/',
    secure: true,
    sameSite: 'none',
    signed: true,
    httpOnly: true
  }).code(200).send({ message: 'Sesión cerrada exitosamente' });
});


// Rutas del sistema
await fastify.register(adminRoutes, { prefix: "/api/admin" });
await fastify.register(docenteRoutes, { prefix: "/api/docente" });
await fastify.register(estudianteRoutes, { prefix: "/api/estudiante" });
await fastify.register(aulaRoutes, { prefix: "/api/aula" });
await fastify.register(laboratorioRoutes, { prefix: "/api/laboratorio" });
await fastify.register(reservaRoutes, { prefix: "/api/reserva" });

// 404 personalizado
fastify.setNotFoundHandler((req, reply) => {
  reply.status(404).send({ error: 'Ruta no encontrada' });
});

export default fastify;

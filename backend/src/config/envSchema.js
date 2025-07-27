// Variables de entorno cargadas
export const envSchema = {
    type: 'object',
    required: ['PORT', 'MONGODB_URI', 'HOST_MAILTRAP', 'PORT_MAILTRAP', 'USER_MAILTRAP', 'PASS_MAILTRAP', 'JWT_SECRET', 'COOKIE_SECRET','URL_FRONTEND'],
    properties: {
        PORT: { type: 'number', default: 3000 },
        MONGODB_URI: { type: 'string' },
        HOST_MAILTRAP: { type: 'string' },
        PORT_MAILTRAP: { type: 'number' },
        USER_MAILTRAP: { type: 'string' },
        PASS_MAILTRAP: { type: 'string' },
        JWT_SECRET: { type: 'string' },
        COOKIE_SECRET: { type: 'string' },
        URL_FRONTEND: { type: 'string' },
    }
};

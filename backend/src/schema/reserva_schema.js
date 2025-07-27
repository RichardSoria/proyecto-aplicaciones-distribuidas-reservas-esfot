export const createReservaSchema = {
    tags: ['Reservas'],
    summary: 'Crear nueva reserva por usuario autenticado',
    description: 'Permite a un usuario autenticado (administrador, docente o estudiante) crear una nueva reserva si cumple con los requisitos de fecha, hora y disponibilidad.',
    body: {
        type: 'object',
        required: [
            'placeID',
            'placeType',
            'purpose',
            'reservationDate',
            'startTime',
            'endTime',
            'description',
        ],
        properties: {
            placeType: {
                type: 'string',
                enum: ['Aula', 'Laboratorio']
            },
            placeID: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$'
            },
            purpose: {
                type: 'string',
                enum: ['Clase', 'Prueba/Examen', 'Proyecto', 'Evento/Capacitación', 'Otro']
            },
            reservationDate: {
                type: 'string',
                format: 'date'
            },
            startTime: {
                type: 'string',
                pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
            },
            endTime: {
                type: 'string',
                pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
            },
            description: {
                type: 'string',
                minLength: 1,
                maxLength: 200,
                pattern: "^[\\p{L}\\d\\s.,;:()\\-–—_¡!¿?\"'´`]+$"
            }
        },
        additionalProperties: false
    },
    response: {
        201: {
            description: 'Reserva creada exitosamente',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Reserva creada exitosamente' }
            }
        },
        400: {
            description: 'Error en los datos enviados',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Las horas de inicio y fin deben ser válidas y estar entre las 07:00 y las 20:00' }
            }
        },
        409: {
            description: 'Espacio reservado previamente en ese horario',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El espacio ya se encuentra reservado dentro de ese horario' }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error interno del servidor' }
            }
        }
    }
};

export const assignReservaSchema = {
    tags: ['Reservas'],
    summary: 'Asignar reserva como administrador',
    description: 'Permite a un administrador asignar una reserva a un usuario específico, cumpliendo con los requisitos de fecha, hora y disponibilidad.',
    body: {
        type: 'object',
        required: [
            'placeType',
            'placeID',
            'userRol',
            'userID',
            'purpose',
            'reservationDate',
            'startTime',
            'endTime',
            'description',
        ],
        properties: {
            placeType: {
                type: 'string',
                enum: ['Aula', 'Laboratorio']
            },
            placeID: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$'
            },
            userRol: {
                type: 'string',
                enum: ['Administrador', 'Docente', 'Estudiante']
            },
            userID: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$'
            },
            purpose: {
                type: 'string',
                enum: ['Clase', 'Prueba/Examen', 'Proyecto', 'Evento/Capacitación', 'Otro']
            },
            reservationDate: {
                type: 'string',
                format: 'date'
            },
            startTime: {
                type: 'string',
                pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
            },
            endTime: {
                type: 'string',
                pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$'
            },
            description: {
                type: 'string',
                minLength: 1,
                maxLength: 200,
                pattern: "^[\\p{L}\\d\\s.,;:()\\-–—_¡!¿?\"'´`]+$"
            }
        },
        additionalProperties: false
    },
    response: {
        201: {
            description: 'Reserva creada exitosamente',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Reserva creada exitosamente' }
            }
        },
        400: {
            description: 'Error en los datos enviados',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El ID de usuario no es válido' }
            }
        },
        409: {
            description: 'Espacio reservado previamente en ese horario',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El espacio ya se encuentra reservado dentro de ese horario' }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error interno del servidor' }
            }
        }
    }
};

export const approveReservaSchema = {
    tags: ['Reservas'],
    summary: 'Aprobar una reserva por ID',
    description: 'Permite a un administrador aprobar una reserva existente, asignando una razón y registrando la autorización.',

    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$'
            }
        }
    },

    body: {
        type: 'object',
        required: ['reason'],
        properties: {
            reason: {
                type: 'string',
                minLength: 1,
                maxLength: 200,
                pattern: "^[\\p{L}\\d\\s.,;:()\\-–—_¡!¿?\"'´`]+$"
            }
        },
        additionalProperties: false
    },

    response: {
        200: {
            description: 'Reserva aprobada exitosamente',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Reserva aprobada exitosamente' }
            }
        },
        400: {
            description: 'ID no válido o datos incorrectos',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El ID de reserva no es válido' }
            }
        },
        404: {
            description: 'Reserva no encontrada',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'La reserva no existe' }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error interno del servidor' }
            }
        }
    }
};

export const rejectReservaSchema = {
    tags: ['Reservas'],
    summary: 'Rechazar una reserva por ID',
    description: 'Permite a un administrador rechazar una reserva existente indicando la razón correspondiente.',

    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$'
            }
        }
    },

    body: {
        type: 'object',
        required: ['reason'],
        properties: {
            reason: {
                type: 'string',
                minLength: 1,
                maxLength: 200,
                pattern: "^[\\p{L}\\d\\s.,;:()\\-–—_¡!¿?\"'´`]+$"
            }
        },
        additionalProperties: false
    },

    response: {
        200: {
            description: 'Reserva rechazada exitosamente',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Reserva rechazada exitosamente' }
            }
        },
        400: {
            description: 'ID no válido o datos incorrectos',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El ID de reserva no es válido' }
            }
        },
        404: {
            description: 'Reserva no encontrada',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'La reserva no existe' }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error interno del servidor' }
            }
        }
    }
};

export const cancelReservaSchema = {
    tags: ['Reservas'],
    summary: 'Cancelar una reserva por ID',
    description: 'Permite a un usuario autenticado cancelar su propia reserva indicando la razón correspondiente.',

    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$'
            }
        }
    },

    body: {
        type: 'object',
        required: ['reason'],
        properties: {
            reason: {
                type: 'string',
                minLength: 1,
                maxLength: 200,
                pattern: "^[\\p{L}\\d\\s.,;:()\\-–—_¡!¿?\"'´`]+$"
            }
        },
        additionalProperties: false
    },

    response: {
        200: {
            description: 'Reserva cancelada exitosamente',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Reserva cancelada exitosamente' }
            }
        },
        400: {
            description: 'ID no válido o datos incorrectos',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El ID de reserva no es válido' }
            }
        },
        404: {
            description: 'Reserva no encontrada',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'La reserva no existe' }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error interno del servidor' }
            }
        }
    }
};

export const getAllReservasSchema = {
    tags: ['Reservas'],
    summary: 'Visualizar todas las reservas (modo administrador)',
    description: 'Permite a un administrador autenticado visualizar todas las reservas del sistema con detalles de cada evento.',

    response: {
        200: {
            description: 'Listado de reservas con datos completos para el administrador',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    title: { type: 'string' },
                    start: { type: 'string', format: 'date-time' },
                    end: { type: 'string', format: 'date-time' },
                    reserva: { type: 'object' }, // Contiene toda la reserva en bruto
                    status: { type: 'string' }
                }
            }
        },
        403: {
            description: 'Usuario no autorizado (no es administrador)',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No tienes permiso para ver las reservas' }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error interno del servidor' }
            }
        }
    }
};

export const getAllReservasGeneralSchema = {
    tags: ['Reservas'],
    summary: 'Visualizar reservas generales',
    description: 'Permite a cualquier usuario autenticado (administrador, docente o estudiante) visualizar de forma general todas las reservas registradas.',

    response: {
        200: {
            description: 'Listado de eventos de reservas generales',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    id: { type: 'string' },
                    userID: { type: 'string' },
                    title: { type: 'string' },
                    start: { type: 'string', format: 'date-time' },
                    end: { type: 'string', format: 'date-time' },
                    reserva: { type: 'object' }, // Estructura anidada completa de la reserva
                    status: { type: 'string' },
                    lugarNombre: { type: 'string' }
                }
            }
        },
        403: {
            description: 'Usuario no autorizado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No tienes permiso para ver las reservas' }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error interno del servidor' }
            }
        }
    }
};

export const getReservaByIdSchema = {
    tags: ['Reservas'],
    summary: 'Obtener una reserva por ID',
    description: 'Devuelve la información completa y detallada de una reserva específica para usuarios autenticados (admin, docente o estudiante).',

    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$'
            }
        }
    },

    response: {
        200: {
            description: 'Reserva encontrada con detalles',
            type: 'object',
            properties: {
                _id: { type: 'string', example: '64a5f5c8e4a4a1234567890a' },
                userID: { type: 'string', example: '64b1fcdbe4f1a91234567890' },
                userRol: { type: 'string', example: 'Docente' },
                placeID: { type: 'string', example: '64c9af1e0a1b5a1234567890' },
                placeType: { type: 'string', example: 'Aula' },
                reservationDate: { type: 'string', format: 'date', example: '2025-07-15' },
                startTime: { type: 'string', example: '09:00' },
                endTime: { type: 'string', example: '11:00' },
                purpose: { type: 'string', example: 'Clase' },
                description: { type: 'string', example: 'Clase de Física II' },
                status: { type: 'string', example: 'Aprobada' },
                reason: { type: 'string', nullable: true, example: 'Espacio disponible y reservado con antelación' },
                userAuthorizationID: { type: 'string', nullable: true, example: '64e5c72f1e2a941234567890' },
                authorizationDate: { type: 'string', format: 'date-time', nullable: true, example: '2025-07-10T10:30:00Z' },
                cancellationDate: { type: 'string', format: 'date-time', nullable: true, example: null },
                createdDate: { type: 'string', format: 'date-time', example: '2025-07-08T14:00:00Z' },
                lugarNombre: { type: 'string', example: 'Aula B203' },
                solicitante: { type: 'string', example: 'Ana Martínez' },
                autorizadoPor: { type: 'string', nullable: true, example: 'Carlos Romero' }
            }
        },

        400: {
            description: 'ID de reserva inválido',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El ID de reserva no es válido' }
            }
        },

        403: {
            description: 'No autorizado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No tienes permiso para ver reservas' }
            }
        },

        404: {
            description: 'Reserva no encontrada',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'La reserva no existe' }
            }
        },

        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error interno del servidor' }
            }
        }
    }
};

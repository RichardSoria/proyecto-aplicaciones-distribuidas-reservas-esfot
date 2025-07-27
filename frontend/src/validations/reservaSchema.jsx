import { use } from "react";

export const createReservaSchema = {
    type: 'object',
    properties: {
        placeType: {
            type: 'string',
            enum: ['Aula', 'Laboratorio'],
            errorMessage: {
                enum: 'El tipo de lugar debe ser Aula o Laboratorio'
            }
        },
        placeID: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
            errorMessage: {
                pattern: 'El espacio académico es obligatorio'
            }
        },
        purpose: {
            type: 'string',
            enum: ['Clase', 'Prueba/Examen', 'Proyecto', 'Evento/Capacitación', 'Otro'],
            errorMessage: {
                enum: 'Seleccione una de las opciones disponibles'
            }
        },
        reservationDate: {
            type: 'string',
            format: 'date',
            errorMessage: {
                format: 'La fecha de reserva es obligatoria'
            }
        },
        startTime: {
            type: 'string',
            pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
            errorMessage: {
                pattern: 'La hora de inicio es obligatoria'
            }
        },
        endTime: {
            type: 'string',
            pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
            errorMessage: {
                pattern: 'La hora de fin es obligatoria'
            }
        },
        description: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            pattern: "^[\\p{L}\\d\\s.,;:()\\-–—_¡!¿?\"'´`]+$",
            errorMessage: {
                minLength: 'La descripción no puede estar vacía',
                pattern: 'La descripción solo puede contener letras, números y (.,;:-)',
                maxLength: 'Máximo 200 caracteres'
            }
        },
    },
    required: [
        'placeType',
        'placeID',
        'purpose',
        'reservationDate',
        'startTime',
        'endTime',
        'description',
    ],
    errorMessage: {
        required: {
            placeType: 'El tipo de lugar es obligatorio',
            placeID: 'El espacio académico es obligatorio',
            purpose: 'El propósito es obligatorio',
            reservationDate: 'La fecha de reserva es obligatoria',
            description: 'La descripción es obligatoria'
        }
    },
    additionalProperties: false
};

export const assignReservaSchema = {
    type: 'object',
    properties: {
        placeType: {
            type: 'string',
            enum: ['Aula', 'Laboratorio'],
            errorMessage: {
                enum: 'El tipo de lugar debe ser Aula o Laboratorio'
            }
        },
        placeID: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
            errorMessage: {
                pattern: 'El espacio académico es obligatorio'
            }
        },
        userRol: {
            type: 'string',
            enum: ['Administrador', 'Docente', 'Estudiante'],
            errorMessage: {
                enum: 'Seleccione un rol de usuario válido'
            }
        },
        userID: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
            errorMessage: {
                pattern: 'El usuario es obligatorio'
            }
        },
        purpose: {
            type: 'string',
            enum: ['Clase', 'Prueba/Examen', 'Proyecto', 'Evento/Capacitación', 'Otro'],
            errorMessage: {
                enum: 'Seleccione una de las opciones disponibles'
            }
        },
        reservationDate: {
            type: 'string',
            format: 'date',
            errorMessage: {
                format: 'La fecha de reserva es obligatoria'
            }
        },
        startTime: {
            type: 'string',
            pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
            errorMessage: {
                pattern: 'La hora de inicio es obligatoria'
            }
        },
        endTime: {
            type: 'string',
            pattern: '^([01]?[0-9]|2[0-3]):[0-5][0-9]$',
            errorMessage: {
                pattern: 'La hora de fin es obligatoria'
            }
        },
        description: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            pattern: "^[\\p{L}\\d\\s.,;:()\\-–—_¡!¿?\"'´`]+$",
            errorMessage: {
                minLength: 'La descripción no puede estar vacía',
                pattern: 'La descripción solo puede contener letras, números y (.,;:-)',
                maxLength: 'Máximo 200 caracteres'
            }
        },
    },
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
    errorMessage: {
        required: {
            placeType: 'El tipo de lugar es obligatorio',
            placeID: 'El espacio académico es obligatorio',
            userRol: 'El rol de usuario es obligatorio',
            userID: 'El usuario es obligatorio',
            purpose: 'El propósito es obligatorio',
            reservationDate: 'La fecha de reserva es obligatoria',
            description: 'La descripción es obligatoria'
        }
    },
    additionalProperties: false
};

export const reasonReservaSchema = {
    type: 'object',
    properties: {
        reason: {
            type: 'string',
            minLength: 1,
            maxLength: 200,
            pattern: "^(?=.*[\\p{L}\\d])[\\p{L}\\d\\s.,;:()\\-–—_¡!¿?\"'´`]+$",
            errorMessage: {
                minLength: 'El motivo no puede estar vacío',
                pattern: 'El motivo solo puede contener letras, números y (.,;:-), y no puede ser solo espacios',
                maxLength: 'Máximo 200 caracteres'
            }
        }
    },
    required: ['reason'],
    errorMessage: {
        required: {
            reason: 'El motivo es obligatorio'
        }
    },
    additionalProperties: false
};
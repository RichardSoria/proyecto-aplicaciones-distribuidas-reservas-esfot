export const loginDocenteSchema = {
    tags: ['Autenticación'],
    summary: 'Inicio de sesión de docente',
    description: 'Permite que un docente inicie sesión con su correo institucional de la EPN y contraseña segura. Incluye mecanismo de bloqueo temporal por intentos fallidos.',

    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                minLength: 1,
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$",
                errorMessage: {
                    pattern: "El correo debe ser institucional",
                    minLength: "El campo de correo es obligatorio"
                }
            },
            password: {
                type: 'string',
                minLength: 8,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$',
                errorMessage: {
                    pattern: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
                    minLength: "La contraseña debe tener al menos 8 caracteres"
                }
            }
        },
        additionalProperties: false
    },

    response: {
        200: {
            description: 'Inicio de sesión exitoso',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Inicio de sesión exitoso' }
            }
        },
        400: {
            description: 'Credenciales incorrectas o cuenta deshabilitada',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Credenciales Incorrectas' }
            }
        },
        401: {
            description: 'Usuario bloqueado por intentos fallidos',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'El usuario está bloqueado. Intente nuevamente a las 14:30:00'
                }
            }
        },
        404: {
            description: 'Usuario no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Credenciales Incorrectas' }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al iniciar sesión' }
            }
        }
    }
};

export const registerDocenteSchema = {
    tags: ['Docentes'],
    summary: 'Registrar docente',
    description: 'Permite registrar un nuevo docente con validaciones de cédula, correo institucional, teléfono y carrera.',
    body: {
        type: 'object',
        required: ['cedula', 'name', 'lastName', 'email', 'phone', 'career'],
        properties: {
            cedula: {
                type: 'string',
                minLength: 10,
                maxLength: 10,
                pattern: '^[0-9]{10}$',
                errorMessage: {
                    pattern: 'La cédula debe tener exactamente 10 dígitos numéricos',
                    minLength: 'El campo de cédula es obligatorio',
                    maxLength: 'La cédula debe tener exactamente 10 dígitos'
                }
            },
            name: {
                type: 'string',
                minLength: 1,
                maxLength: 20,
                pattern: '^[\\p{L}]{1,20}$',
                errorMessage: {
                    pattern: 'El nombre solo puede contener letras y tener hasta 20 caracteres',
                    minLength: 'El campo de nombre es obligatorio'
                }
            },
            lastName: {
                type: 'string',
                minLength: 1,
                maxLength: 20,
                pattern: '^[\\p{L}]{1,20}$',
                errorMessage: {
                    pattern: 'El apellido solo puede contener letras y tener hasta 20 caracteres',
                    minLength: 'El campo de apellido es obligatorio'
                }
            },
            email: {
                type: 'string',
                minLength: 1,
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$",
                errorMessage: {
                    pattern: "El correo debe ser institucional",
                    minLength: "El campo de correo es obligatorio"
                }
            },
            phone: {
                type: 'string',
                minLength: 10,
                maxLength: 10,
                pattern: '09[2-9][0-9]{7}$',
                errorMessage: {
                    pattern: 'El número debe empezar con 098 o 099 y tener 10 dígitos',
                    minLength: 'El campo de teléfono es obligatorio',
                    maxLength: 'El teléfono debe tener exactamente 10 dígitos'
                }
            },
            career: {
                type: 'string',
                enum: [
                    'Tecnología Superior en Agua y Saneamiento Ambiental',
                    'Tecnología Superior en Desarrollo de Software',
                    'Tecnología Superior en Electromecánica',
                    'Tecnología Superior en Redes y Telecomunicaciones',
                    'Tecnología Superior en Procesamiento de Alimentos',
                    'Tecnología Superior en Procesamiento Industrial de la Madera',
                    'Otras facultades/Externos'
                ],
                errorMessage: {
                    enum: 'La carrera debe ser una de las opciones disponibles'
                }
            },
            otherFaculty: {
                type: 'string',
                minLength: 1,
                maxLength: 50,
                pattern: '^[\\p{L}\\s]+$',
                errorMessage: {
                    pattern: 'El campo de otra facultad solo puede contener letras y espacios',
                    minLength: 'El campo de otra facultad es obligatorio',
                    maxLength: 'El campo de otra facultad no puede tener más de 50 caracteres'
                }
            }
        },
        allOf: [
            {
                if: {
                    properties: {
                        career: { const: 'Otras facultades/Externos' }
                    }
                },
                then: {
                    required: ['otherFaculty']
                }
            }
        ],
        additionalProperties: false
    },
    response: {
        201: {
            description: 'Docente registrado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Docente registrado con éxito' }
            }
        },
        400: {
            description: 'Datos inválidos o ya registrados',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'La cédula ya está registrada' }
            }
        },
        401: {
            description: 'Sin permisos',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No tienes permiso para realizar esta acción' }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al registrar docente' }
            }
        }
    }
};

export const updateDocenteSchema = {
    tags: ['Docentes'],
    summary: 'Actualizar docente',
    description: 'Permite actualizar los datos personales y académicos de un docente existente.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                errorMessage: {
                    pattern: 'El ID debe ser un ObjectId válido'
                }
            }
        }
    },
    body: {
        type: 'object',
        properties: {
            cedula: { type: 'string', pattern: '^[0-9]{10}$' },
            name: { type: 'string', pattern: '^[\\p{L}]{1,20}$' },
            lastName: { type: 'string', pattern: '^[\\p{L}]{1,20}$' },
            email: { type: 'string', pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$" },
            phone: { type: 'string', pattern: '09[2-9][0-9]{7}$' },
            career: { type: 'string' },
            otherFaculty: { type: 'string' }
        },
        additionalProperties: false
    },
    response: {
        200: { description: 'Docente actualizado con éxito', type: 'object', properties: { message: { type: 'string', example: 'Docente actualizado con éxito' } } },
        400: { description: 'Datos inválidos o duplicados', type: 'object', properties: { message: { type: 'string', example: 'La cédula ya está registrada' } } },
        401: { description: 'No autorizado', type: 'object', properties: { message: { type: 'string', example: 'No tienes permiso para realizar esta acción' } } },
        404: { description: 'Docente no encontrado', type: 'object', properties: { message: { type: 'string', example: 'Docente no encontrado' } } },
        500: { description: 'Error interno del servidor', type: 'object', properties: { message: { type: 'string', example: 'Error al actualizar docente' } } }
    }
};

export const enableDocenteSchema = {
    tags: ['Docentes'],
    summary: 'Habilitar docente',
    description: 'Permite habilitar a un docente deshabilitado.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                errorMessage: {
                    pattern: 'El ID debe ser un ObjectId válido'
                }
            }
        }
    },
    response: {
        200: { description: 'Docente habilitado con éxito', type: 'object', properties: { message: { type: 'string', example: 'Docente habilitado con éxito' } } },
        400: { description: 'Ya habilitado o ID inválido', type: 'object', properties: { message: { type: 'string', example: 'El docente ya está habilitado' } } },
        401: { description: 'No autorizado', type: 'object', properties: { message: { type: 'string', example: 'No tienes permiso para realizar esta acción' } } },
        404: { description: 'Docente no encontrado', type: 'object', properties: { message: { type: 'string', example: 'Docente no encontrado' } } },
        500: { description: 'Error interno del servidor', type: 'object', properties: { message: { type: 'string', example: 'Error al habilitar docente' } } }
    }
};

export const disableDocenteSchema = {
    tags: ['Docentes'],
    summary: 'Deshabilitar docente',
    description: 'Permite deshabilitar a un docente activo.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                errorMessage: {
                    pattern: 'El ID debe ser un ObjectId válido'
                }
            }
        }
    },
    response: {
        200: { description: 'Docente deshabilitado con éxito', type: 'object', properties: { message: { type: 'string', example: 'Docente deshabilitado con éxito' } } },
        400: { description: 'Ya deshabilitado o ID inválido', type: 'object', properties: { message: { type: 'string', example: 'El docente ya está deshabilitado' } } },
        401: { description: 'No autorizado', type: 'object', properties: { message: { type: 'string', example: 'No tienes permiso para realizar esta acción' } } },
        404: { description: 'Docente no encontrado', type: 'object', properties: { message: { type: 'string', example: 'Docente no encontrado' } } },
        500: { description: 'Error interno del servidor', type: 'object', properties: { message: { type: 'string', example: 'Error al deshabilitar docente' } } }
    }
};

export const recoverPasswordSchemaDocente = {
    tags: ['Autenticación'],
    summary: 'Solicitar recuperación de contraseña',
    description: 'Envía un enlace de recuperación al correo institucional si el docente existe y está habilitado.',
    body: {
        type: 'object',
        required: ['email'],
        properties: {
            email: {
                type: 'string',
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$",
                errorMessage: { pattern: "El correo debe ser institucional" }
            }
        },
        additionalProperties: false
    },
    response: {
        200: { description: 'Correo enviado (independiente si existe)', type: 'object', properties: { message: { type: 'string', example: 'Si el correo está registrado, se ha enviado un enlace de recuperación.' } } },
        500: { description: 'Error interno del servidor', type: 'object', properties: { message: { type: 'string', example: 'Error al recuperar contraseña' } } }
    }
};

export const verifyTokenDocenteSchema = {
    tags: ['Autenticación'],
    summary: 'Verificar token de recuperación',
    description: 'Verifica que el token de recuperación de contraseña sea válido y no esté expirado.',
    params: {
        type: 'object',
        required: ['token'],
        properties: {
            token: {
                type: 'string',
                description: 'Token de recuperación'
            }
        }
    },
    response: {
        200: { description: 'Token válido', type: 'object', properties: { message: { type: 'string', example: 'Verificación exitosa. Haga clic en "Enviar Contraseña de Recuperación" para continuar' } } },
        400: { description: 'Token inválido o expirado', type: 'object', properties: { message: { type: 'string', example: 'El token ha expirado. Solicite un nuevo correo de recuperación' } } },
        500: { description: 'Error al verificar token', type: 'object', properties: { message: { type: 'string', example: 'Error al verificar el token' } } }
    }
};

export const sendRecoverPasswordDocenteSchema = {
    tags: ['Autenticación'],
    summary: 'Enviar nueva contraseña',
    description: 'Genera y envía una nueva contraseña al correo institucional del docente, si el token es válido.',
    params: {
        type: 'object',
        required: ['token'],
        properties: {
            token: { type: 'string', description: 'Token de recuperación' }
        }
    },
    response: {
        200: { description: 'Contraseña enviada con éxito', type: 'object', properties: { message: { type: 'string', example: 'Contraseña de recuperación enviada.' } } },
        400: { description: 'Token inválido o expirado', type: 'object', properties: { message: { type: 'string', example: 'El token ha expirado. Solicite un nuevo correo de recuperación' } } },
        500: { description: 'Error interno', type: 'object', properties: { message: { type: 'string', example: 'Error al enviar el correo de recuperación' } } }
    }
};

export const updateDocentePasswordSchema = {
    tags: ['Autenticación'],
    summary: 'Actualizar contraseña',
    description: 'Permite a un docente cambiar su contraseña actual por una nueva.',
    body: {
        type: 'object',
        required: ['password', 'confirmPassword'],
        properties: {
            password: {
                type: 'string',
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$'
            },
            confirmPassword: {
                type: 'string',
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$'
            }
        },
        additionalProperties: false
    },
    response: {
        200: { description: 'Contraseña actualizada con éxito', type: 'object', properties: { message: { type: 'string', example: 'Contraseña actualizada con éxito' } } },
        400: { description: 'Contraseñas inválidas o no coinciden', type: 'object', properties: { message: { type: 'string', example: 'Las contraseñas no coinciden' } } },
        500: { description: 'Error al actualizar contraseña', type: 'object', properties: { message: { type: 'string', example: 'Error al actualizar la contraseña' } } }
    }
};

export const getAllDocentesSchema = {
    tags: ['Docentes'],
    summary: 'Obtener lista de docentes',
    description: 'Devuelve un listado completo de docentes registrados en el sistema.',
    response: {
        200: {
            description: 'Lista obtenida',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '64b7f6a123abc4567890abcd' },
                    name: { type: 'string', example: 'María' },
                    lastName: { type: 'string', example: 'Gómez' },
                    email: { type: 'string', example: 'maria.gomez@epn.edu.ec' },
                    phone: { type: 'string', example: '0991234567' },
                    cedula: { type: 'string', example: '1701234567' },
                    status: { type: 'boolean', example: true },
                    career: { type: 'string', example: 'Ingeniería Mecánica' },
                    otherFaculty: { type: 'string', example: 'FIEE' },
                    rol: { type: 'string', example: 'Docente' },
                    numberReservation: { type: 'number', example: 4 },
                    lastLogin: { type: 'string', format: 'date-time', nullable: true, example: '2024-07-01T08:00:00Z' },
                }
            }
        },
        401: {
            description: 'No autorizado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No tienes permiso para realizar esta acción' }
            }
        },
        500: {
            description: 'Error interno',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al obtener docentes' }
            }
        }
    }
};

export const getDocenteByIdSchema = {
    tags: ['Docentes'],
    summary: 'Obtener docente por ID',
    description: 'Devuelve la información completa de un docente específico, incluyendo datos de auditoría.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                description: 'ID del docente',
                pattern: '^[0-9a-fA-F]{24}$',
                errorMessage: {
                    pattern: 'El ID debe ser un ObjectId válido'
                }
            }
        }
    },
    response: {
        200: {
            description: 'Docente encontrado',
            type: 'object',
            properties: {
                _id: { type: 'string', example: '64b7f6a123abc4567890abcd' },
                name: { type: 'string', example: 'María' },
                lastName: { type: 'string', example: 'Gómez' },
                email: { type: 'string', example: 'maria.gomez@epn.edu.ec' },
                phone: { type: 'string', example: '0991234567' },
                cedula: { type: 'string', example: '1701234567' },
                career: { type: 'string', example: 'Ingeniería Mecánica' },
                otherFaculty: { type: 'string', example: 'FIEE' },
                rol: { type: 'string', example: 'Docente' },
                status: { type: 'boolean', example: true },
                numberReservation: { type: 'number', example: 4 },
                createdDate: { type: 'string', format: 'date-time', example: '2024-06-01T12:00:00Z' },
                updatedDate: { type: 'string', format: 'date-time', nullable: true, example: '2024-07-01T08:00:00Z' },
                enableDate: { type: 'string', format: 'date-time', example: '2024-06-02T09:30:00Z' },
                disableDate: { type: 'string', format: 'date-time', nullable: true, example: '2024-07-01T08:00:00Z' },
                lastLogin: { type: 'string', format: 'date-time', nullable: true, example: '2024-07-01T08:00:00Z' },
                lockUntil: { type: 'string', format: 'date-time', nullable: true, example: '2024-07-01T14:20:00Z' },
                loginAttempts: { type: 'integer', example: 0 },
                createFor: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        name: { type: 'string', example: 'Luis' },
                        lastName: { type: 'string', example: 'Torres' }
                    }
                },
                updateFor: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        name: { type: 'string', example: 'Ana' },
                        lastName: { type: 'string', example: 'Martínez' }
                    }
                },
                enableFor: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        name: { type: 'string', example: 'Carlos' },
                        lastName: { type: 'string', example: 'Ramos' }
                    }
                },
                disableFor: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        name: { type: 'string', example: 'Lucía' },
                        lastName: { type: 'string', example: 'Mendoza' }
                    }
                }
            }
        },
        400: {
            description: 'ID inválido',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'ID inválido' }
            }
        },
        404: {
            description: 'Docente no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Docente no encontrado' }
            }
        },
        500: {
            description: 'Error interno',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al obtener docente' }
            }
        }
    }
};

export const getDocenteProfileSchema = {
    tags: ['Docentes'],
    summary: 'Obtener perfil del docente autenticado',
    description: 'Devuelve los datos del docente actualmente autenticado.',
    response: {
        200: {
            description: 'Perfil del docente',
            type: 'object',
            properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                cedula: { type: 'string' },
                career: { type: 'string' },
                otherFaculty: { type: 'string' },
                rol: { type: 'string' },
                status: { type: 'boolean' },
                numberReservation: { type: 'number' }
            }
        },
        401: {
            description: 'No autorizado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No autorizado' }
            }
        },
        500: {
            description: 'Error interno',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al obtener el perfil del docente' }
            }
        }
    }
};


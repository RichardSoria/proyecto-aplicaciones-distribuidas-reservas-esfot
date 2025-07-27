export const loginEstudianteSchema = {
    tags: ['Autenticación'],
    summary: 'Inicio de sesión de estudiante',
    description: 'Permite que un estudiante inicie sesión con su correo institucional y contraseña.',
    body: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
            email: {
                type: 'string',
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$",
                errorMessage: {
                    pattern: 'El correo debe ser institucional'
                }
            },
            password: {
                type: 'string',
                minLength: 8,
                errorMessage: {
                    minLength: 'La contraseña debe tener al menos 8 caracteres'
                }
            }
        }
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

export const registerEstudianteSchema = {
    tags: ['Estudiantes'],
    summary: 'Registrar estudiante',
    description: 'Permite registrar un nuevo estudiante en el sistema.',
    body: {
        type: 'object',
        required: ['cedula', 'name', 'lastName', 'email', 'phone', 'career'],
        properties: {
            cedula: {
                type: 'string',
                pattern: '^[0-9]{10}$',
                errorMessage: { pattern: 'La cédula debe tener 10 dígitos' }
            },
            name: {
                type: 'string',
                pattern: '^[\\p{L}]{1,20}$',
                maxLength: 20
            },
            lastName: {
                type: 'string',
                pattern: '^[\\p{L}]{1,20}$',
                maxLength: 20
            },
            email: {
                type: 'string',
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$"
            },
            phone: {
                type: 'string',
                pattern: '09[2-9][0-9]{7}$'
            },
            career: {
                type: 'string'
            }
        }
    },
    response: {
        201: {
            description: 'Estudiante registrado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Estudiante registrado con éxito' }
            }
        },
        400: {
            description: 'Datos ya registrados o inválidos',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'La cédula ya está registrada' }
            }
        },
        401: {
            description: 'Sin permiso para registrar',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No tienes permiso para realizar esta acción' }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al registrar estudiante' }
            }
        }
    }
};

export const updateEstudianteSchema = {
    tags: ['Estudiantes'],
    summary: 'Actualizar información de estudiante',
    description: 'Permite a un administrador actualizar los datos de un estudiante existente.',
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
        properties: {
            name: {
                type: 'string',
                pattern: '^[\\p{L}]{1,20}$',
                maxLength: 20
            },
            lastName: {
                type: 'string',
                pattern: '^[\\p{L}]{1,20}$',
                maxLength: 20
            },
            email: {
                type: 'string',
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$"
            },
            phone: {
                type: 'string',
                pattern: '09[2-9][0-9]{7}$'
            },
            career: { type: 'string' }
        }
    },
    response: {
        200: {
            description: 'Estudiante actualizado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Estudiante actualizado con éxito' }
            }
        },
        400: {
            description: 'Error de validación o campos inválidos',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El correo ya está registrado' }
            }
        },
        401: {
            description: 'No autorizado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No tienes permiso para realizar esta acción' }
            }
        },
        404: {
            description: 'Estudiante no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El estudiante no existe' }
            }
        },
        500: {
            description: 'Error del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al actualizar estudiante' }
            }
        }
    }
};

export const enableEstudianteSchema = {
    tags: ['Estudiantes'],
    summary: 'Habilitar estudiante',
    description: 'Permite habilitar un estudiante deshabilitado. No permite habilitarse a sí mismo.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                description: 'ID del estudiante a habilitar',
                pattern: '^[0-9a-fA-F]{24}$',
                errorMessage: {
                    pattern: 'El ID debe ser un ObjectId válido'
                }
            }
        }
    },
    response: {
        200: {
            description: 'Estudiante habilitado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Estudiante habilitado con éxito' }
            }
        },
        400: {
            description: 'Error de validación o acción no permitida',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    examples: [
                        'El estudiante ya está habilitado',
                        'El usuario autenticado no puede habilitarse a sí mismo',
                        'El ID no es válido'
                    ]
                }
            }
        },
        401: {
            description: 'Sin permiso para habilitar',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No tienes permiso para realizar esta acción' }
            }
        },
        404: {
            description: 'Estudiante no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El estudiante no existe' }
            }
        },
        500: {
            description: 'Error del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al habilitar estudiante' }
            }
        }
    }
};

export const disableEstudianteSchema = {
    tags: ['Estudiantes'],
    summary: 'Deshabilitar estudiante',
    description: 'Permite deshabilitar un estudiante habilitado. No permite deshabilitarse a sí mismo.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                description: 'ID del estudiante a deshabilitar',
                pattern: '^[0-9a-fA-F]{24}$',
                errorMessage: {
                    pattern: 'El ID debe ser un ObjectId válido'
                }
            }
        }
    },
    response: {
        200: {
            description: 'Estudiante deshabilitado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Estudiante deshabilitado con éxito' }
            }
        },
        400: {
            description: 'Error de validación o acción no permitida',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    examples: [
                        'El estudiante ya está deshabilitado',
                        'El usuario autenticado no puede deshabilitarse a sí mismo',
                        'El ID no es válido'
                    ]
                }
            }
        },
        401: {
            description: 'Sin permiso para deshabilitar',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No tienes permiso para realizar esta acción' }
            }
        },
        404: {
            description: 'Estudiante no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El estudiante no existe' }
            }
        },
        500: {
            description: 'Error del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al deshabilitar estudiante' }
            }
        }
    }
};


export const recoverPasswordEstudianteSchema = {
    tags: ['Autenticación'],
    summary: 'Solicitar recuperación de contraseña',
    description: 'Envía un enlace de recuperación al correo institucional si el estudiante existe y está habilitado.',
    body: {
        type: 'object',
        required: ['email'],
        properties: {
            email: {
                type: 'string',
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$",
                errorMessage: {
                    pattern: "El correo debe ser institucional"
                }
            }
        },
        additionalProperties: false
    },
    response: {
        200: {
            description: 'Correo de recuperación enviado (independientemente de si existe)',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    example: 'Si el correo está registrado, se ha enviado un enlace de recuperación.'
                }
            }
        },
        400: {
            description: 'Correo inválido',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Correo inválido' }
            }
        },
        500: {
            description: 'Error al recuperar contraseña',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al recuperar contraseña' }
            }
        }
    }
};

export const verifyTokenEstudianteSchema = {
    tags: ['Autenticación'],
    summary: 'Verificar token de recuperación de contraseña',
    description: 'Valida que el token enviado para la recuperación de contraseña sea válido y no esté expirado.',
    params: {
        type: 'object',
        required: ['token'],
        properties: {
            token: {
                type: 'string',
                description: 'Token para verificar la recuperación de contraseña'
            }
        }
    },
    response: {
        200: {
            description: 'Token válido',
            type: 'object',
            properties: {
                message: { type: 'string', example: "Token válido. Puede proceder a cambiar la contraseña." }
            }
        },
        400: {
            description: 'Token inválido o expirado',
            type: 'object',
            properties: {
                message: { type: 'string', example: "El token ha expirado. Solicite un nuevo correo de recuperación." }
            }
        },
        404: {
            description: 'Token no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: "Token inválido o ya usado." }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: "Error al verificar token" }
            }
        }
    }
};

export const sendRecoverPasswordEstudianteSchema = {
    tags: ['Autenticación'],
    summary: 'Enviar nueva contraseña mediante token de recuperación',
    description: 'Genera una nueva contraseña segura, la actualiza en la base de datos, limpia el token y la envía al correo institucional.',
    params: {
        type: 'object',
        required: ['token'],
        properties: {
            token: {
                type: 'string',
                description: 'Token para enviar nueva contraseña'
            }
        }
    },
    response: {
        200: {
            description: 'Contraseña enviada con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: "Contraseña enviada al correo institucional." }
            }
        },
        400: {
            description: 'Token inválido o expirado',
            type: 'object',
            properties: {
                message: { type: 'string', example: "El enlace ya ha sido utilizado o ha expirado." }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: "Error al enviar la contraseña" }
            }
        }
    }
};

export const updatePasswordEstudianteSchema = {
    tags: ['Autenticación'],
    summary: 'Actualizar contraseña del estudiante',
    description: 'Permite a un estudiante cambiar su contraseña actual. La nueva contraseña debe cumplir criterios de seguridad.',
    body: {
        type: 'object',
        required: ['password', 'confirmPassword'],
        properties: {
            password: {
                type: 'string',
                minLength: 8,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$',
                errorMessage: {
                    pattern: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
                    minLength: 'La contraseña debe tener al menos 8 caracteres',
                }
            },
            confirmPassword: {
                type: 'string',
                minLength: 8,
                pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$',
                errorMessage: {
                    pattern: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
                    minLength: 'La contraseña debe tener al menos 8 caracteres',
                }
            }
        },
        additionalProperties: false
    },
    response: {
        200: {
            description: 'Contraseña actualizada con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Contraseña actualizada con éxito' }
            }
        },
        400: {
            description: 'Contraseñas inválidas o no coinciden',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Las contraseñas no coinciden' }
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
            description: 'Error al actualizar contraseña',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al actualizar contraseña' }
            }
        }
    }
};

export const getAllEstudiantesSchema = {
    tags: ['Estudiantes'],
    summary: 'Obtener lista de estudiantes',
    description: 'Devuelve un listado con todos los estudiantes registrados.',
    response: {
        200: {
            description: 'Lista de estudiantes',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '64a5f5c8e4a4a1234567890b' },
                    cedula: { type: 'string', example: '1101123456' },
                    name: { type: 'string', example: 'María' },
                    lastName: { type: 'string', example: 'González' },
                    email: { type: 'string', example: 'maria.gonzalez01@epn.edu.ec' },
                    phone: { type: 'string', example: '0998765432' },
                    career: { type: 'string', example: 'Tecnología Superior en Desarrollo de Software' },
                    rol: { type: 'string', example: 'Estudiante' },
                    status: { type: 'boolean', example: true },
                    numberReservation: { type: 'number', example: 3 },
                    lastLogin: { type: 'string', format: 'date-time', nullable: true, example: '2024-07-01T08:00:00Z' },
                }
            }
        },
        401: {
            description: 'Sin autorización',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No autorizado' }
            }
        },
        500: {
            description: 'Error al obtener estudiantes',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error interno del servidor' }
            }
        }
    }
};

export const getEstudianteByIdSchema = {
    tags: ['Estudiantes'],
    summary: 'Obtener estudiante por ID',
    description: 'Devuelve la información detallada de un estudiante mediante su ID.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                description: 'ID del estudiante',
                pattern: '^[0-9a-fA-F]{24}$',
                errorMessage: {
                    pattern: 'El ID debe ser un ObjectId válido'
                }
            }
        }
    },
    response: {
        200: {
            description: 'Estudiante encontrado',
            type: 'object',
            properties: {
                _id: { type: 'string', example: '64a5f5c8e4a4a1234567890b' },
                cedula: { type: 'string', example: '1101123456' },
                name: { type: 'string', example: 'María' },
                lastName: { type: 'string', example: 'González' },
                email: { type: 'string', example: 'maria.gonzalez01@epn.edu.ec' },
                phone: { type: 'string', example: '0998765432' },
                rol: { type: 'string', example: 'Estudiante' },
                career: { type: 'string', example: 'Tecnología Superior en Desarrollo de Software' },
                status: { type: 'boolean', example: true },
                numberReservation: { type: 'number', example: 2 },
                createdDate: { type: 'string', format: 'date-time' },
                updatedDate: { type: 'string', format: 'date-time' },
                enableDate: { type: 'string', format: 'date-time' },
                disableDate: { type: 'string', format: 'date-time' },
                lastLogin: { type: 'string', format: 'date-time' },
                lockUntil: { type: 'string', format: 'date-time', nullable: true, example: '2024-07-01T14:20:00Z' },
                loginAttempts: { type: 'integer', example: 0 },
                createFor: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        lastName: { type: 'string' }
                    }
                },
                updateFor: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        lastName: { type: 'string' }
                    }
                },
                enableFor: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        lastName: { type: 'string' }
                    }
                },
                disableFor: {
                    type: 'object',
                    properties: {
                        name: { type: 'string' },
                        lastName: { type: 'string' }
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
            description: 'Estudiante no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Estudiante no encontrado' }
            }
        },
        401: {
            description: 'Sin autorización',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No autorizado' }
            }
        },
        500: {
            description: 'Error al obtener estudiante',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error interno del servidor' }
            }
        }
    }
};

export const getEstudianteProfileSchema = {
    tags: ['Estudiantes'],
    summary: 'Obtener perfil del estudiante autenticado',
    description: 'Devuelve los datos del perfil del estudiante actualmente autenticado.',
    response: {
        200: {
            description: 'Perfil del estudiante',
            type: 'object',
            properties: {
                _id: { type: 'string', example: '64a5f5c8e4a4a1234567890b' },
                cedula: { type: 'string', example: '1101123456' },
                name: { type: 'string', example: 'María' },
                lastName: { type: 'string', example: 'González' },
                email: { type: 'string', example: 'maria.gonzalez01@epn.edu.ec' },
                phone: { type: 'string', example: '0998765432' },
                rol: { type: 'string', example: 'Estudiante' },
                career: { type: 'string', example: 'Tecnología Superior en Desarrollo de Software' },
                status: { type: 'boolean', example: true },
                numberReservation: { type: 'number', example: 2 }
            }
        },
        401: {
            description: 'Sin autorización',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No autorizado' }
            }
        },
        500: {
            description: 'Error interno',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al obtener perfil' }
            }
        }
    }
};



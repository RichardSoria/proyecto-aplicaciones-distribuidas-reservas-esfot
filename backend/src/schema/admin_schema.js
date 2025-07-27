export const loginAdminSchema = {
    tags: ['Autenticación'],
    summary: 'Inicio de sesión de administrador',
    description: 'Permite que un administrador inicie sesión con su correo institucional y contraseña segura. Incluye bloqueo por intentos fallidos.',

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

export const registerAdminSchema = {
    tags: ['Administradores'],
    summary: 'Registrar administrador',
    description: 'Permite registrar un nuevo administrador con validaciones y envío de credenciales al correo institucional.',
    body: {
        type: 'object',
        required: ['cedula', 'name', 'lastName', 'email', 'phone'],
        properties: {
            cedula: {
                type: 'string',
                minLength: 10,
                maxLength: 10,
                pattern: '^[0-9]{10}$',
                errorMessage: {
                    pattern: 'La cédula debe tener exactamente 10 dígitos numéricos',
                    minLength: 'El campo de cédula es obligatorio',
                    maxLength: 'La cédula debe tener exactamente 10 dígitos numéricos',
                }
            },
            name: {
                type: 'string',
                minLength: 1,
                maxLength: 20,
                pattern: '^[\\p{L}]{1,20}$',
                errorMessage: {
                    pattern: 'El nombre solo puede contener letras',
                    minLength: 'El campo de nombre es obligatorio',
                    maxLength: 'El nombre puede tener máximo 20 caracteres',
                }
            },
            lastName: {
                type: 'string',
                minLength: 1,
                maxLength: 20,
                pattern: '^[\\p{L}]{1,20}$',
                errorMessage: {
                    pattern: 'El apellido solo puede contener letras',
                    minLength: 'El campo de apellido es obligatorio',
                    maxLength: 'El apellido puede tener máximo 20 caracteres',
                }
            },
            email: {
                type: 'string',
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$",
                minLength: 1,
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
            }
        },
        additionalProperties: false
    },
    response: {
        201: {
            description: 'Administrador registrado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Administrador registrado con éxito' }
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
                message: { type: 'string', example: 'Error al registrar administrador' }
            }
        }
    }
};

export const updateAdminSchema = {
    tags: ['Administradores'],
    summary: 'Actualizar administrador',
    description: 'Permite actualizar la información de un administrador existente. Requiere permisos de administrador autenticado.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                description: 'ID del administrador a actualizar',
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
            cedula: {
                type: 'string',
                minLength: 10,
                maxLength: 10,
                pattern: '^[0-9]{10}$',
                errorMessage: {
                    pattern: 'La cédula debe tener exactamente 10 dígitos numéricos'
                }
            },
            name: {
                type: 'string',
                minLength: 1,
                maxLength: 20,
                pattern: '^[\\p{L}]{1,20}$',
                errorMessage: {
                    pattern: 'El nombre solo puede contener letras',
                    minLength: 'El campo de nombre es obligatorio',
                    maxLength: 'El nombre puede tener máximo 20 caracteres',
                }
            },
            lastName: {
                type: 'string',
                minLength: 1,
                maxLength: 20,
                pattern: '^[\\p{L}]{1,20}$',
                errorMessage: {
                    pattern: 'El apellido solo puede contener letras',
                    minLength: 'El campo de apellido es obligatorio',
                    maxLength: 'El apellido puede tener máximo 20 caracteres',
                }
            },
            email: {
                type: 'string',
                pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$",
                minLength: 1,
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
            }
        },
        additionalProperties: false
    },
    response: {
        200: {
            description: 'Administrador actualizado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Administrador actualizado con éxito' }
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
            description: 'Sin permiso para actualizar',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No tienes permiso para realizar esta acción' }
            }
        },
        404: {
            description: 'Administrador no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El administrador no existe' }
            }
        },
        500: {
            description: 'Error del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al actualizar administrador' }
            }
        }
    }
};

export const enableAdminSchema = {
    tags: ['Administradores'],
    summary: 'Habilitar administrador',
    description: 'Permite habilitar un administrador deshabilitado. No permite habilitarse a sí mismo.',
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
        200: {
            description: 'Administrador habilitado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Administrador habilitado con éxito' }
            }
        },
        400: {
            description: 'Error de validación o acción no permitida',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    examples: [
                        'El administrador ya está habilitado',
                        'El administrador que inició sesión no puede habilitarse a sí mismo',
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
            description: 'Administrador no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El administrador no existe' }
            }
        },
        500: {
            description: 'Error del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al habilitar administrador' }
            }
        }
    }
};

export const disableAdminSchema = {
    tags: ['Administradores'],
    summary: 'Deshabilitar administrador',
    description: 'Permite deshabilitar un administrador habilitado. No permite deshabilitarse a sí mismo.',
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
        200: {
            description: 'Administrador deshabilitado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Administrador deshabilitado con éxito' }
            }
        },
        400: {
            description: 'Error de validación o acción no permitida',
            type: 'object',
            properties: {
                message: {
                    type: 'string',
                    examples: [
                        'El administrador ya está deshabilitado',
                        'El administrador que inició sesión no puede deshabilitarse a sí mismo',
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
            description: 'Administrador no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El administrador no existe' }
            }
        },
        500: {
            description: 'Error del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al deshabilitar administrador' }
            }
        }
    }
};

export const recoverPasswordSchema = {
    tags: ['Autenticación'],
    summary: 'Solicitar recuperación de contraseña',
    description: 'Envía un enlace de recuperación al correo institucional si el administrador existe y está habilitado.',
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

export const verifyTokenSchema = {
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

export const sendRecoverPasswordSchema = {
    tags: ['Autenticación'],
    summary: 'Enviar nueva contraseña mediante token de recuperación',
    description: 'Genera una nueva contraseña segura, la actualiza en la base de datos, limpia el token y envía la nueva contraseña al correo institucional.',
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
            description: 'Contraseña de recuperación enviada con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: "Contraseña de recuperación enviada al correo institucional." }
            }
        },
        400: {
            description: 'Token inválido o expirado',
            type: 'object',
            properties: {
                message: { type: 'string', example: "El enlace de recuperación ya ha sido utilizado o ha expirado." }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: "Error al enviar la contraseña de recuperación" }
            }
        }
    }
};

export const updatePasswordSchema = {
    tags: ['Autenticación'],
    summary: 'Actualizar contraseña',
    description: 'Permite a un administrador cambiar su contraseña actual. La nueva contraseña debe cumplir criterios de seguridad.',
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
            description: 'No autorizado para cambiar contraseña',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'No autorizado' }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al actualizar contraseña' }
            }
        }
    }
};

export const getAllAdminsSchema = {
    tags: ['Administradores'],
    summary: 'Obtener lista de administradores',
    description: 'Devuelve un listado con todos los administradores registrados.',
    response: {
        200: {
            description: 'Lista de administradores',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '64a5f5c8e4a4a1234567890a' },
                    cedula: { type: 'string', example: '0102030405' },
                    name: { type: 'string', example: 'Juan' },
                    lastName: { type: 'string', example: 'Pérez' },
                    email: { type: 'string', example: 'juan.perez01@epn.edu.ec' },
                    phone: { type: 'string', example: '0987654321' },
                    rol: { type: 'string', example: 'Administrador' },
                    status: { type: 'boolean', example: true },
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
            description: 'Error interno',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al obtener administradores' }
            }
        }
    }
};

export const getAdminByIdSchema = {
    tags: ['Administradores'],
    summary: 'Obtener administrador por ID',
    description: 'Devuelve la información detallada de un administrador mediante su ID.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                description: 'ID del administrador',
                pattern: '^[0-9a-fA-F]{24}$',
                errorMessage: {
                    pattern: 'El ID debe ser un ObjectId válido'
                }
            }
        }
    },
    response: {
        200: {
            description: 'Administrador encontrado',
            type: 'object',
            properties: {
                _id: { type: 'string', example: '64a5f5c8e4a4a1234567890a' },
                cedula: { type: 'string', example: '0102030405' },
                name: { type: 'string', example: 'Juan' },
                lastName: { type: 'string', example: 'Pérez' },
                email: { type: 'string', example: 'juan.perez01@epn.edu.ec' },
                phone: { type: 'string', example: '0987654321' },
                rol: { type: 'string', example: 'Administrador' },
                status: { type: 'boolean', example: true },
                lastLogin: { type: 'string', format: 'date-time', nullable: true, example: '2024-07-01T14:20:00Z' },
                lockUntil: { type: 'string', format: 'date-time', nullable: true, example: '2024-07-01T14:20:00Z' },
                loginAttempts: { type: 'integer', example: 5 },
                createdDate: { type: 'string', format: 'date-time', example: '2024-06-12T10:00:00Z' },
                updatedDate: { type: 'string', format: 'date-time', nullable: true, example: '2024-07-01T14:20:00Z' },
                enableDate: { type: 'string', format: 'date-time', example: '2024-06-13T09:00:00Z' },
                disableDate: { type: 'string', format: 'date-time', nullable: true, example: '2024-07-01T14:20:00Z' },
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
                        name: { type: 'string', example: 'María' },
                        lastName: { type: 'string', example: 'Lozano' }
                    }
                },
                enableFor: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        name: { type: 'string', example: 'Carlos' },
                        lastName: { type: 'string', example: 'Romero' }
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
            description: 'Administrador no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Administrador no encontrado' }
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
                message: { type: 'string', example: 'Error al obtener administrador' }
            }
        }
    }
};


export const getAdminProfileSchema = {
    tags: ['Administradores'],
    summary: 'Obtener perfil del administrador autenticado',
    description: 'Devuelve los datos del perfil del administrador actualmente autenticado.',
    response: {
        200: {
            description: 'Perfil del administrador',
            type: 'object',
            properties: {
                _id: { type: 'string' },
                cedula: { type: 'string' },
                name: { type: 'string' },
                lastName: { type: 'string' },
                email: { type: 'string' },
                phone: { type: 'string' },
                rol: { type: 'string' },
                status: { type: 'boolean' },
                createdDate: { type: 'string', format: 'date-time' },
                updatedDate: { type: 'string', format: 'date-time', nullable: true },
                enableDate: { type: 'string', format: 'date-time' },
                disableDate: { type: 'string', format: 'date-time', nullable: true },
                createFor: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        name: { type: 'string' },
                        lastName: { type: 'string' }
                    }
                },
                updateFor: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        name: { type: 'string' },
                        lastName: { type: 'string' }
                    }
                },
                enableFor: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        name: { type: 'string' },
                        lastName: { type: 'string' }
                    }
                },
                disableFor: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        name: { type: 'string' },
                        lastName: { type: 'string' }
                    }
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
            description: 'Error interno',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al obtener perfil' }
            }
        }
    }
};


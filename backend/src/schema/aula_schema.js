export const createAulaSchema = {
    tags: ['Aulas'],
    summary: 'Crear nueva aula',
    description: 'Permite a un administrador crear una nueva aula con su respectivo nombre, descripción y capacidad.',
    body: {
        type: 'object',
        required: ['name', 'description', 'capacity'],
        properties: {
            name: {
                type: 'string',
                pattern: '^E\\d{2}/PB\\d/E\\d{3}$',
            },
            description: {
                type: 'string',
                maxLength: 100,
                pattern: '^[\\p{L}\\d\\s.,\'"-]{1,100}$',
            },
            capacity: {
                type: 'number',
                minimum: 1,
            }
        }
    },
    response: {
        201: {
            description: 'Aula creada con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Aula creada con éxito' }
            }
        },
        400: {
            description: 'Datos inválidos o aula existente',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El aula ya existe' }
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
                message: { type: 'string', example: 'Error al crear el aula' }
            }
        }
    }
};

export const updateAulaSchema = {
    tags: ['Aulas'],
    summary: 'Actualizar aula',
    description: 'Permite a un administrador actualizar la información de un aula existente por su ID.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
            }
        }
    },
    body: {
        type: 'object',
        properties: {
            name: {
                type: 'string',
                pattern: '^E\\d{2}/PB\\d/E\\d{3}$',
            },
            description: {
                type: 'string',
                maxLength: 100,
            },
            capacity: {
                type: 'number',
                minimum: 1,
            }
        }
    },
    response: {
        200: {
            description: 'Aula actualizada con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Aula actualizada con éxito' }
            }
        },
        400: {
            description: 'ID inválido o datos incorrectos',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'ID de aula inválido' }
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
            description: 'Aula no encontrada',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El aula no existe' }
            }
        },
        500: {
            description: 'Error interno',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al actualizar el aula' }
            }
        }
    }
};

export const enableAulaSchema = {
    tags: ['Aulas'],
    summary: 'Habilitar aula',
    description: 'Permite a un administrador habilitar un aula previamente deshabilitada.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                example: '64acfd1e1d2e7f0012eaa456'
            }
        }
    },
    response: {
        200: {
            description: 'Aula habilitada con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Aula habilitada con éxito' }
            }
        },
        400: {
            description: 'Aula ya está habilitada o ID inválido',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El aula ya está habilitada' }
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
            description: 'Aula no encontrada',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El aula no existe' }
            }
        },
        500: {
            description: 'Error al habilitar',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al habilitar el aula' }
            }
        }
    }
};

export const disableAulaSchema = {
    tags: ['Aulas'],
    summary: 'Deshabilitar aula',
    description: 'Permite a un administrador deshabilitar un aula existente.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                example: '64acfd1e1d2e7f0012eaa456'
            }
        }
    },
    response: {
        200: {
            description: 'Aula deshabilitada con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Aula deshabilitada con éxito' }
            }
        },
        400: {
            description: 'Aula ya está deshabilitada o ID inválido',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El aula ya está deshabilitada' }
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
            description: 'Aula no encontrada',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El aula no existe' }
            }
        },
        500: {
            description: 'Error al deshabilitar',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al deshabilitar el aula' }
            }
        }
    }
};

export const getAllAulasSchema = {
    tags: ['Aulas'],
    summary: 'Obtener todas las aulas',
    description: 'Devuelve una lista con todas las aulas del sistema.',
    response: {
        200: {
            description: 'Listado de aulas',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '64a7f3dbb1099c3b9fabc123' },
                    name: { type: 'string', example: 'E01/PB1/E101' },
                    description: { type: 'string', example: 'Aula equipada con proyector y aire acondicionado' },
                    capacity: { type: 'number', example: 40 },
                    numberReservations: { type: 'number', example: 12 },
                    status: { type: 'boolean', example: true }
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
            description: 'Error al obtener',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al obtener las aulas' }
            }
        }
    }
};

export const getAulaByIdSchema = {
    tags: ['Aulas'],
    summary: 'Obtener aula por ID',
    description: 'Devuelve los datos completos de un aula específica incluyendo auditoría.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                example: '64acfd1e1d2e7f0012eaa456'
            }
        }
    },
    response: {
        200: {
            description: 'Aula encontrada',
            type: 'object',
            properties: {
                _id: { type: 'string' },
                name: { type: 'string' },
                description: { type: 'string' },
                capacity: { type: 'number' },
                status: { type: 'boolean' },
                numberReservations: { type: 'number' },
                createdDate: { type: 'string' },
                updatedDate: { type: 'string' },
                enableDate: { type: 'string' },
                disableDate: { type: 'string' },
                createBy: { type: 'object', properties: { name: { type: 'string' }, lastName: { type: 'string' } } },
                updateBy: { type: 'object', properties: { name: { type: 'string' }, lastName: { type: 'string' } } },
                enableBy: { type: 'object', properties: { name: { type: 'string' }, lastName: { type: 'string' } } },
                disableBy: { type: 'object', properties: { name: { type: 'string' }, lastName: { type: 'string' } } }
            }
        },
        400: {
            description: 'ID inválido',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'ID de aula inválido' }
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
            description: 'Aula no encontrada',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El aula no existe' }
            }
        },
        500: {
            description: 'Error interno',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al obtener el aula' }
            }
        }
    }
};

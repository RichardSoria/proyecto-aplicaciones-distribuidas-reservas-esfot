export const createLaboratorioSchema = {
    tags: ['Laboratorios'],
    summary: 'Crear un laboratorio',
    description: 'Crea un nuevo laboratorio con sus atributos básicos y tecnológicos.',
    body: {
        type: 'object',
        required: ['codigo', 'name', 'description', 'capacity', 'equipmentPC', 'equipmentProyector', 'equipmentInteractiveScreen'],
        properties: {
            codigo: { type: 'string', pattern: '^E\\d{2}/PB\\d/E\\d{3}$' },
            name: { type: 'string', pattern: "^[\\p{L}\\d\\s.,'-]{1,30}$", },
            description: { type: 'string', pattern: "^[\\p{L}\\d\\s.,'\"-]{1,100}$", },
            capacity: { type: 'number' },
            equipmentPC: { type: 'boolean' },
            equipmentProyector: { type: 'boolean' },
            equipmentInteractiveScreen: { type: 'boolean' }
        }
    },
    response: {
        201: {
            description: 'Laboratorio creado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Laboratorio creado con éxito' }
            }
        },
        400: {
            description: 'Datos inválidos o laboratorio duplicado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El laboratorio ya existe' }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al crear el laboratorio' }
            }
        }
    }
};

export const updateLaboratorioSchema = {
    tags: ['Laboratorios'],
    summary: 'Actualizar laboratorio',
    description: 'Actualiza los datos de un laboratorio existente.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                description: 'ID del laboratorio',
                pattern: '^[0-9a-fA-F]{24}$',
                example: '60f7c10a2c8b1a3f34567890'
            }
        }
    },
    body: {
        type: 'object',
        properties: {
            codigo: { type: 'string', pattern: '^E\\d{2}/PB\\d/E\\d{3}$' },
            name: { type: 'string', pattern: "^[\\p{L}\\d\\s.,'-]{1,30}$", },
            description: { type: 'string', pattern: "^[\\p{L}\\d\\s.,'\"-]{1,100}$", },
            capacity: { type: 'number' },
            equipmentPC: { type: 'boolean' },
            equipmentProyector: { type: 'boolean' },
            equipmentInteractiveScreen: { type: 'boolean' }
        }
    },
    response: {
        200: {
            description: 'Laboratorio actualizado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Laboratorio actualizado con éxito' },
                data: { type: 'object' }
            }
        },
        400: {
            description: 'ID inválido o datos incorrectos',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'ID de laboratorio inválido' }
            }
        },
        404: {
            description: 'Laboratorio no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El laboratorio no existe' }
            }
        },
        500: {
            description: 'Error al actualizar',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al actualizar el laboratorio' }
            }
        }
    }
};

export const enableLaboratorioSchema = {
    tags: ['Laboratorios'],
    summary: 'Habilitar laboratorio',
    description: 'Habilita el acceso al laboratorio por ID.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                description: 'ID del laboratorio',
                example: '60f7c10a2c8b1a3f34567890'
            }
        }
    },
    response: {
        200: {
            description: 'Laboratorio habilitado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Laboratorio habilitado con éxito' }
            }
        },
        400: {
            description: 'El laboratorio ya está habilitado o ID inválido',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El laboratorio ya está habilitado' }
            }
        },
        404: {
            description: 'Laboratorio no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El laboratorio no existe' }
            }
        },
        500: {
            description: 'Error al habilitar el laboratorio',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al habilitar el laboratorio' }
            }
        }
    }
};

export const disableLaboratorioSchema = {
    tags: ['Laboratorios'],
    summary: 'Deshabilitar laboratorio',
    description: 'Deshabilita un laboratorio por ID.',
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                example: '60f7c10a2c8b1a3f34567890'
            }
        }
    },
    response: {
        200: {
            description: 'Laboratorio deshabilitado con éxito',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Laboratorio deshabilitado con éxito' }
            }
        },
        400: {
            description: 'El laboratorio ya está deshabilitado o ID inválido',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El laboratorio ya está deshabilitado' }
            }
        },
        404: {
            description: 'Laboratorio no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El laboratorio no existe' }
            }
        },
        500: {
            description: 'Error al deshabilitar el laboratorio',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al deshabilitar el laboratorio' }
            }
        }
    }
};

export const getAllLaboratoriosSchema = {
    tags: ['Laboratorios'],
    summary: 'Obtener todos los laboratorios',
    description: 'Devuelve una lista de todos los laboratorios registrados.',
    response: {
        200: {
            description: 'Lista de laboratorios',
            type: 'array',
            items: {
                type: 'object',
                properties: {
                    _id: { type: 'string', example: '64b6dcd0f82f1a3e78b1a3e4' },
                    codigo: { type: 'string', example: 'E01/PB1/E101' },
                    name: { type: 'string', example: 'Laboratorio de Redes' },
                    description: { type: 'string', example: 'Laboratorio con equipos de red y conectividad avanzada' },
                    equipmentPC: { type: 'boolean', example: true },
                    equipmentProyector: { type: 'boolean', example: false },
                    equipmentInteractiveScreen: { type: 'boolean', example: true },
                    capacity: { type: 'number', example: 25 },
                    numberReservations: { type: 'number', example: 5 },
                    status: { type: 'boolean', example: true },
                }
            }
        },
        500: {
            description: 'Error interno del servidor',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al obtener los laboratorios' }
            }
        }
    }
};

export const getLaboratorioByIdSchema = {
    tags: ['Laboratorios'],
    summary: 'Obtener laboratorio por ID',
    description: 'Devuelve la información detallada de un laboratorio, incluyendo sus atributos, estado y campos de auditoría.',

    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: {
                type: 'string',
                pattern: '^[0-9a-fA-F]{24}$',
                description: 'ID de MongoDB del laboratorio'
            }
        }
    },

    response: {
        200: {
            description: 'Laboratorio encontrado',
            type: 'object',
            properties: {
                _id: { type: 'string', example: '68734eecd4035606450517be' },
                codigo: { type: 'string', example: 'E21/PB2/E012' },
                name: { type: 'string', example: 'TICs 25A' },
                description: { type: 'string', example: 'Aula equipada con 30 computadoras, aire acondicionado y proyector, además de ventanas.' },
                capacity: { type: 'integer', example: 25 },
                equipmentPC: { type: 'boolean', example: true },
                equipmentProyector: { type: 'boolean', example: true },
                equipmentInteractiveScreen: { type: 'boolean', example: false },
                status: { type: 'boolean', example: false },
                numberReservations: { type: 'integer', example: 1 },
                createdDate: { type: 'string', format: 'date-time', example: '2025-07-13T06:14:25.556Z' },
                updatedDate: { type: 'string', format: 'date-time', nullable: true, example: '2025-07-13T06:18:01.009Z' },
                enableDate: { type: 'string', format: 'date-time', nullable: true, example: '2025-07-13T06:14:25.556Z' },
                disableDate: { type: 'string', format: 'date-time', nullable: true, example: null },

                createBy: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        _id: { type: 'string', example: '687345563078b77a49d85736' },
                        name: { type: 'string', example: 'Richard' },
                        lastName: { type: 'string', example: 'Soria' }
                    }
                },
                updateBy: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        _id: { type: 'string', example: '687345563078b77a49d85736' },
                        name: { type: 'string', example: 'Richard' },
                        lastName: { type: 'string', example: 'Soria' }
                    }
                },
                enableBy: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        _id: { type: 'string', example: '687345563078b77a49d85736' },
                        name: { type: 'string', example: 'Richard' },
                        lastName: { type: 'string', example: 'Soria' }
                    }
                },
                disableBy: {
                    type: 'object',
                    nullable: true,
                    properties: {
                        _id: { type: 'string', example: '687345563078b77a49d85736' },
                        name: { type: 'string', example: 'Richard' },
                        lastName: { type: 'string', example: 'Soria' }
                    }
                }
            }
        },

        400: {
            description: 'ID inválido',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'ID de laboratorio inválido' }
            }
        },

        404: {
            description: 'Laboratorio no encontrado',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'El laboratorio no existe' }
            }
        },

        500: {
            description: 'Error al obtener el laboratorio',
            type: 'object',
            properties: {
                message: { type: 'string', example: 'Error al obtener el laboratorio' }
            }
        }
    }
};

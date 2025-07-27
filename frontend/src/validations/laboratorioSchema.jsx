export const laboratorioSchema = {
    type: 'object',
    required: ['codigo', 'name', 'description', 'capacity', 'equipmentPC', 'equipmentProyector', 'equipmentInteractiveScreen'],
    properties: {
        name: {
            type: 'string',
            minLength: 1,
            maxLength: 20,
            pattern: '^[\\p{L}0-9\\s-]+$',
            errorMessage: {
                pattern: 'El nombre solo puede contener letras, números y espacios',
                minLength: 'El campo de nombre es obligatorio',
                maxLength: 'El nombre no puede tener más de 20 caracteres',
            },
        },
        codigo: {
            type: 'string',
            minLength: 1,
            maxLength: 12,
            pattern: '^E\\d{2}/PB\\d{1}/E\\d{3}$',
            errorMessage: {
                pattern: 'El nombre debe seguir exactamente el formato E00/PB0/E000',
                minLength: 'El campo de código es obligatorio',
                maxLength: 'El campo de códgio debe tener exactamente 12 caracteres',
            },
        },
        description: {
            type: 'string',
            minLength: 1,
            maxLength: 100,
            pattern: '^[\\p{L}\\p{N}\\s.,;:()¿?¡!-]+$',
            errorMessage: {
                pattern: 'La descripción puede contener letras, números, espacios y algunos caracteres especiales (.,;:()¿?¡!-)',
                minLength: 'El campo de descripción es obligatorio',
                maxLength: 'La descripción no puede exceder los 100 caracteres',
            },
        },
        capacity: {
            type: 'string',
            minLength: 1,
            pattern: '^[1-9][0-9]*$',
            errorMessage: {
                pattern: 'La capacidad debe ser un número entero mayor o igual a 1',
                minLength: 'El campo de capacidad es obligatorio',
            },
        },
        equipmentPC: {
            type: 'boolean',
            default: false,
            errorMessage: {
                type: 'El campo de PC debe ser un booleano',
            },
        },
        equipmentProyector: {
            type: 'boolean',
            default: false,
            errorMessage: {
                type: 'El campo de proyector debe ser un booleano',
            },
        },
        equipmentInteractiveScreen: {
            type: 'boolean',
            default: false,
            errorMessage: {
                type: 'El campo de pantalla interactiva debe ser un booleano',
            },
        },
    },
    additionalProperties: false,
    errorMessage: {
        required: {
            codigo: 'El código es obligatorio',
            name: 'El nombre es obligatorio',
            description: 'La descripción es obligatoria',
            capacity: 'La capacidad es obligatoria',
            equipmentPC: 'El campo de PC es obligatorio',
            equipmentProyector: 'El campo de proyector es obligatorio',
            equipmentInteractiveScreen: 'El campo de pantalla interactiva es obligatorio',
        },
    },
};

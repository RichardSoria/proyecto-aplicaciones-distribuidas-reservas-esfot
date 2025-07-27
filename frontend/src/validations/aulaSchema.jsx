export const aulaSchema = {
    type: 'object',
    required: ['name', 'description', 'capacity'],
    properties: {
        name: {
            type: 'string',
            minLength: 12,
            maxLength: 12,
            pattern: '^E\\d{2}/PB\\d{1}/E\\d{3}$',
            errorMessage: {
                pattern: 'El nombre debe seguir exactamente el formato E00/PB0/E000',
                minLength: 'El campo de nombre debe tener exactamente 12 caracteres',
                maxLength: 'El campo de nombre debe tener exactamente 12 caracteres',
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
    },
    additionalProperties: false,
    errorMessage: {
        required: {
            name: 'El nombre es obligatorio',
            description: 'La descripción es obligatoria',
            capacity: 'La capacidad es obligatoria',
        },
    },
};

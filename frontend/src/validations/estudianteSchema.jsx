export const estudianteSchema = {
    type: 'object',
    required: ['cedula', 'name', 'lastName', 'email', 'phone', 'career'],
    properties: {
        name: {
            type: 'string',
            minLength: 1,
            pattern: '^[\\p{L}]{1,20}$',
            errorMessage: {
                pattern: 'El nombre solo puede contener letras y tener hasta 20 caracteres',
                minLength: 'El campo de nombre es obligatorio'
            }
        },
        lastName: {
            type: 'string',
            minLength: 1,
            pattern: '^[\\p{L}]{1,20}$',
            errorMessage: {
                pattern: 'El apellido solo puede contener letras y tener hasta 20 caracteres',
                minLength: 'El campo de apellido es obligatorio'
            }
        },
        cedula: {
            type: 'string',
            minLength: 10,
            maxLength: 10,
            pattern: '^[0-9]{10}$',
            errorMessage: {
                pattern: 'La cédula debe tener exactamente 10 dígitos numéricos',
                minLength: 'La cédula debe tener 10 dígitos',
                maxLength: 'La cédula debe tener 10 dígitos'
            }
        },
        phone: {
            type: 'string',
            minLength: 10,
            maxLength: 10,
            pattern: '^09[2-9][0-9]{7}$',
            errorMessage: {
                pattern: 'El número debe empezar con 098 o 099 y tener 10 dígitos',
                minLength: 'El teléfono debe tener 10 dígitos',
                maxLength: 'El teléfono debe tener 10 dígitos'
            }
        },
        email: {
            type: 'string',
            minLength: 1,
            pattern: '^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$',
            errorMessage: {
                pattern: 'El correo debe ser institucional (nombre.apellido##@epn.edu.ec)',
                minLength: 'El campo de correo es obligatorio'
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
                'Tecnología Superior en Procesamiento Industrial de la Madera'
            ],
            errorMessage: {
                enum: 'La carrera debe ser una de las opciones disponibles'
            }
        }
    },
    additionalProperties: false,
    errorMessage: {
        required: {
            name: 'El nombre es obligatorio',
            lastName: 'El apellido es obligatorio',
            cedula: 'La cédula es obligatoria',
            phone: 'El teléfono es obligatorio',
            email: 'El correo es obligatorio',
            career: 'La carrera es obligatoria',
        }
    }
};
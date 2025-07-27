export const loginSchema = {
    type: 'object',
    required: ['email', 'password', 'role'],
    properties: {
        email: {
            type: 'string',
            minLength: 1,
            pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$"
        },
        password: {
            type: 'string',
            minLength: 8,
            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$'
        },
        role: {
            type: 'string',
            enum: ['admin', 'docente', 'estudiante'],
        }
    },
    additionalProperties: false,
    errorMessage: {
        required: {
            email: 'El campo de correo es obligatorio',
            password: 'El campo de contraseña es obligatorio',
            role: 'El campo de rol es obligatorio',
        },
        properties: {
            email: 'El correo debe ser institucional',
            password: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
            role: 'El campo de rol es obligatorio',
        },
        _: 'Datos inválidos en el formulario',
    }
}

export const recoverPasswordSchema = {
    type: 'object',
    required: ['email'],
    properties: {
        email: {
            type: 'string',
            minLength: 1,
            pattern: "^[a-z]+\\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\\.edu\\.ec$"
        },
        role: {
            type: 'string',
            enum: ['admin', 'docente', 'estudiante'],
        }
    },
    additionalProperties: false,
    errorMessage: {
        required: {
            email: 'El campo de correo es obligatorio',
            role: 'El campo de rol es obligatorio',
        },
        properties: {
            email: 'El correo debe ser institucional',
            role: 'El campo de rol es obligatorio',
        },
        _: 'Datos inválidos en el formulario',
    }
}

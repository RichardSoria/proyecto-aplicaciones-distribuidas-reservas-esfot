export const passwordUpdateSchema = {
    type: 'object',
    required: ['password', 'confirmPassword'],
    properties: {
        password: {
            type: 'string',
            minLength: 8,
            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$',
            errorMessage: {
                pattern: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
                minLength: "La contraseña debe tener al menos 8 caracteres"
            }
        },
        confirmPassword: {
            type: 'string',
            minLength: 8,
            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$',
            errorMessage: {
                pattern: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
                minLength: "La confirmación de contraseña debe tener al menos 8 caracteres"
            }
        }
    },
    additionalProperties: false,
    errorMessage: {
        required: {
            password: 'La contraseña es obligatoria',
            confirmPassword: 'La confirmación de contraseña es obligatoria',
        },
    }
}
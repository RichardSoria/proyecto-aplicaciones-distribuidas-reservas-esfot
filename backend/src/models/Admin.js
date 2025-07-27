import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";
import moment from "moment-timezone";

// Esquema del administrador
const adminSchema = new mongoose.Schema({
    cedula: {
        type: String,
        required: [true, 'La cédula es requerida'],
        unique: true,
        match: [/^\d{10}$/, 'La cédula debe tener 10 dígitos']
    },
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxlength: [20, 'El nombre no puede tener más de 20 caracteres']
    },
    lastName: {
        type: String,
        required: [true, 'El apellido es requerido'],
        trim: true,
        maxlength: [20, 'El apellido no puede tener más de 20 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El correo es requerido'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-z]+\.[a-z]+((0[1-9]|[1-9][0-9])?)@epn\.edu\.ec$/, 'El correo debe ser institucional.']
    },
    password: {
        type: String,
        required: [true, "La contraseña es requerida"],
        minlength: [8, "La contraseña debe tener al menos 8 caracteres"],
        validate: {
            validator: function (value) {
                // Solo validar si la contraseña NO está encriptada
                return value.startsWith("$2b$") || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(value);
            },
            message: "Debe tener al menos una minúscula, una mayúscula, un número y un carácter especial"
        }
    },
    phone: {
        type: String,
        required: [true, 'El teléfono es requerido'],
        match: [/^\d{10}$/, 'El teléfono debe tener 10 dígitos']
    },
    rol: {
        type: String,
        default: "Admin",
        required: [true, 'El rol es requerido']
    },
    status: {
        type: Boolean,
        default: true
    },
    createdDate: {
        type: Date,
        default: Date.now()
    },
    updatedDate: {
        type: Date,
        default: null
    },
    enableDate: {
        type: Date,
        default: Date.now()
    },
    disableDate: {
        type: Date,
        default: null
    },
    createFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    updateFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    enableFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    disableFor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    lastLogin: {
        type: Date,
        default: null
    },
    loginAttempts: {
        type: Number,
        default: 0
    },
    lockUntil: {
        type: Date,
        default: null
    },
    resetToken: {
        type: String,
        default: null
    },
    resetTokenExpire: {
        type: Date,
        default: null
    }
});

// Método para validar si una cédula es ecuadoriana
adminSchema.statics.verifyEcuadorianDNI = async function(cedula) {
    if (!/^\d{10}$/.test(cedula)) return false;

    const provincia = parseInt(cedula.substring(0, 2), 10);
    if (provincia < 1 || provincia > 24) return false;

    const digitoVerificador = parseInt(cedula[9]);
    let suma = 0;

    for (let i = 0; i < 9; i++) {
        let digito = parseInt(cedula[i]);
        if (i % 2 === 0) {
            digito *= 2;
            if (digito > 9) digito -= 9;
        }
        suma += digito;
    }

    const decenaSuperior = Math.ceil(suma / 10) * 10;
    const verificadorCalculado = decenaSuperior - suma === 10 ? 0 : decenaSuperior - suma;

    return verificadorCalculado === digitoVerificador;
};

// Método para encriptar la contraseña antes de guardar
adminSchema.methods.encryptPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

// Método para comparar la contraseña ingresada con la almacenada
adminSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

// Método para actualizar el último inicio de sesión
adminSchema.methods.updateLastLogin = async function () {
    this.lastLogin = Date.now();
    await this.save();
};

// Método para reiniciar los intentos de inicio de sesión
adminSchema.methods.resetLoginAttempts = async function () {
    this.loginAttempts = 0;
    this.lockUntil = null;
    await this.save();
};


// Método para generar un token de recuperación seguro
adminSchema.methods.createResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString('hex');
    this.resetToken = resetToken;
    this.resetTokenExpire = moment().add(10, 'minute').toDate(); // Expira en 10 minutos
    await this.save();
    return resetToken;
};

// Crear el modelo de administrador
export default mongoose.model('Admin', adminSchema);

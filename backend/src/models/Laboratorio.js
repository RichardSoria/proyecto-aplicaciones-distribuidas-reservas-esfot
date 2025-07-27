import mongoose from "mongoose";

// Esquema del modelo de Laboratorio
const laboratorioSchema = new mongoose.Schema({
    codigo: {
        type: String,
        required: [true, 'El código del laboratorio es requerido'],
        unique: true,
        match: [/^E\d{2}\/PB\d{1}\/E\d{3}$/, 'El nombre debe seguir el formato E00/PB0/E000'],
        uppercase: true
    },
    name: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true,
        maxlength: [20, 'El nombre no puede tener más de 20 caracteres']
    },
    description: {
        type: String,
        required: [true, 'La descripción es requerida'],
        trim: true,
        maxlength: [100, 'La descripción no puede tener más de 100 caracteres']
    },
    equipmentPC: {
        type: Boolean,
        required: [true, 'El campo de PC es requerido'],
        default: false
    },
    equipmentProyector: {
        type: Boolean,
        required: [true, 'El campo de proyector es requerido'],
        default: false
    },
    equipmentInteractiveScreen: {
        type: Boolean,
        required: [true, 'El campo de pantalla interactiva es requerido'],
        default: false
    },
    capacity: {
        type: Number,
        required: [true, 'La capacidad es requerida'],
        min: [1, 'La capacidad debe ser al menos 1']
    },
    numberReservations: {
        type: Number,
        default: 0
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
    createBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    updateBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    enableBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
    disableBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        default: null
    },
});


const Laboratorio = mongoose.models.Laboratorio || mongoose.model('Laboratorio', laboratorioSchema);

export default Laboratorio;
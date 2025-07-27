import Aula from '../models/Aula.js';
import mongoose from 'mongoose';


// Método para crear una nueva aula
const createAula = async (req, reply) => {
    try {
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Desestructuración de los datos del cuerpo de la solicitud
        const { name, description, capacity } = req.body;

        // Verificación de la existencia del aula
        const aulaBDD = await Aula.findOne({ name });
        if (aulaBDD) {
            return reply.code(400).send({ message: "El aula ya existe" });
        }

        // Validar cantidad en capacidad
        if (isNaN(capacity)) {
            return reply.code(400).send({ message: "La capacidad debe ser un número" });
        }

        //  Creación de un nuevo aula
        const newAula = new Aula({ name, description, capacity, createBy: adminLogged._id, enableBy: adminLogged._id });
        await newAula.save();
        return reply.code(201).send({ message: "Aula creada con éxito" });

    } catch (error) {
        console.error("Error al crear el aula:", error);
        return reply.code(500).send({ message: "Error al crear el aula" });
    }
}

// Método para actualizar un aula
const updateAula = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        // Desestructuración de los datos del cuerpo de la solicitud
        const { name, description, capacity} = req.body;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Validación del ID del aula
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "ID de aula inválido" });
        }

        // Verificación de la existencia del aula
        const aulaBDD = await Aula.findById(id).select('name description capacity updatedBy updatedDate');
        if (!aulaBDD) {
            return reply.code(404).send({ message: "El aula no existe" });
        }

        // Validar cantidad en capacidad
        if (isNaN(capacity)) {
            return reply.code(400).send({ message: "La capacidad debe ser un número" });
        }

        // Actualización del aula
        aulaBDD.name = name || aulaBDD.name;
        aulaBDD.description = description || aulaBDD.description;
        aulaBDD.capacity = capacity || aulaBDD.capacity;
        aulaBDD.updatedDate = Date.now();
        aulaBDD.updateBy = adminLogged._id;

        await aulaBDD.save();
        return reply.code(200).send({ message: "Aula actualizada con éxito" });

    } catch (error) {
        console.error("Error al actualizar el aula:", error);
        return reply.code(500).send({ message: "Error al actualizar el aula" });
    }
}

// Método para habilitar un aula
const enableAula = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Validación del ID del aula
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "ID de aula inválido" });
        }

        // Verificación de la existencia del aula
        const aulaBDD = await Aula.findById(id);
        if (!aulaBDD) {
            return reply.code(404).send({ message: "El aula no existe" });
        }

        // Verificación del estado del aula
        if (aulaBDD.status) {
            return reply.code(400).send({ message: "El aula ya está habilitada" });
        }

        // Habilitación del aula
        aulaBDD.status = true;
        aulaBDD.enableDate = Date.now();
        aulaBDD.enableBy = adminLogged._id;

        await aulaBDD.save();
        return reply.code(200).send({ message: "Aula habilitada con écito<" });

    } catch (error) {
        console.error("Error al habilitar el aula:", error);
        return reply.code(500).send({ message: "Error al habilitar el aula" });
    }
}


const disableAula = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Validación del ID del aula
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "ID de aula inválido" });
        }

        // Verificación de la existencia del aula
        const aulaBDD = await Aula.findById(id);
        if (!aulaBDD) {
            return reply.code(404).send({ message: "El aula no existe" });
        }

        // Verificación del estado del aula
        if (!aulaBDD.status) {
            return reply.code(400).send({ message: "El aula ya está deshabilitada" });
        }

        // Deshabilitación del aula
        aulaBDD.status = false;
        aulaBDD.disableDate = Date.now();
        aulaBDD.disableBy = adminLogged._id;

        await aulaBDD.save();
        return reply.code(200).send({ message: "Aula deshabilitada con éxito" });

    } catch (error) {
        console.error("Error al deshabilitar el aula:", error);
        return reply.code(500).send({ message: "Error al deshabilitar el aula" });
    }
}

// Método para obtener todas las aulas
const getAllAulas = async (req, reply) => {
    try {

        const userLogged = req.adminBDD || req.docenteBDD || req.estudianteBDD;

        if (!userLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        const aulas = await Aula.find().select('-__v')
        return reply.code(200).send(aulas);

    } catch (error) {
        console.error("Error al obtener las aulas:", error);
        return reply.code(500).send({ message: "Error al obtener las aulas" });

    }
}

// Método para obtener un aula por su ID
const getAulaById = async (req, reply) => {
    try {
        const { id } = req.params;

        const userLogged = req.adminBDD || req.docenteBDD || req.estudianteBDD;

        if (!userLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Validación del ID del aula
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "ID de aula inválido" });
        }

        // Verificación de la existencia del aula
        const aulaBDD = await Aula.findById(id)
            .select('-__v')
            .populate('createBy', 'name lastName')
            .populate('updateBy', 'name lastName')
            .populate('enableBy', 'name lastName')
            .populate('disableBy', 'name lastName');
        if (!aulaBDD) {
            return reply.code(404).send({ message: "El aula no existe" });
        }

        return reply.code(200).send(aulaBDD);

    } catch (error) {
        console.error("Error al obtener el aula:", error);
        return reply.code(500).send({ message: "Error al obtener el aula" });
    }
}

// Exportación de los métodos
export {
    createAula,
    updateAula,
    enableAula,
    disableAula,
    getAllAulas,
    getAulaById
}

import Laboratorio from '../models/Laboratorio.js';
import mongoose from 'mongoose';

// Método para crear un nuevo laboratorio
const createLaboratorio = async (req, reply) => {
    try {
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Desestructuración de los datos del cuerpo de la solicitud
        const {
            codigo,
            name,
            description,
            specialty,
            equipmentPC,
            equipmentProyector,
            equipmentInteractiveScreen,
            equipamentNetwork,
            equipamentElectromechanical,
            equipamentWater,
            equipamentFood,
            equipamentWood,
            capacity,
            size,
            image
        } = req.body;

        // Verificación de la existencia del laboratorio
        const laboratorioBDD = await Laboratorio.findOne({ codigo });
        if (laboratorioBDD) {
            return reply.code(400).send({ message: "El laboratorio ya existe" });
        }

        // Validar cantidad en capacidad
        if (isNaN(capacity)) {
            return reply.code(400).send({ message: "La capacidad debe ser un número" });
        }

        //  Creación de un nuevo laboratorio
        const newLaboratorio = new Laboratorio({
            codigo,
            name,
            description,
            specialty,
            equipmentPC,
            equipmentProyector,
            equipmentInteractiveScreen,
            equipamentNetwork,
            equipamentElectromechanical,
            equipamentWater,
            equipamentFood,
            equipamentWood,
            capacity,
            size,
            image,
            createBy: adminLogged._id,
            enableBy: adminLogged._id
        });
        await newLaboratorio.save();
        return reply.code(201).send({ message: "Laboratorio creado con éxito" });

    } catch (error) {
        console.error("Error al crear el laboratorio:", error);
        return reply.code(500).send({ message: "Error al crear el laboratorio" });
    }
}

// Método para actualizar un laboratorio
const updateLaboratorio = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        // Desestructuración de los datos del cuerpo de la solicitud
        const {
            codigo,
            name,
            description,
            specialty,
            equipmentPC,
            equipmentProyector,
            equipmentInteractiveScreen,
            equipamentNetwork,
            equipamentElectromechanical,
            equipamentWater,
            equipamentFood,
            equipamentWood,
            capacity,
            size,
            image
        } = req.body;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Validación del ID del laboratorio
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "ID de laboratorio inválido" });
        }

        // Verificación de la existencia del laboratorio
        const laboratorioBDD = await Laboratorio.findById(id).select('codigo name description specialty equipmentPC equipmentProyector equipmentInteractiveScreen equipamentNetwork equipamentElectromechanical equipamentWater equipamentFood equipamentWood capacity size image updatedBy updatedDate');
        if (!laboratorioBDD) {
            return reply.code(404).send({ message: "El laboratorio no existe" });
        }

        // Validar cantidad en capacidad
        if (isNaN(capacity)) {
            return reply.code(400).send({ message: "La capacidad debe ser un número" });
        }

        // Actualización de los datos del laboratorio
        const updatedLaboratorio = await Laboratorio.findByIdAndUpdate(id, {
            codigo,
            name,
            description,
            specialty,
            equipmentPC,
            equipmentProyector,
            equipmentInteractiveScreen,
            equipamentNetwork,
            equipamentElectromechanical,
            equipamentWater,
            equipamentFood,
            equipamentWood,
            capacity,
            size,
            image,
            updateBy: adminLogged._id,
            updatedDate: new Date()
        }, { new: true });

        return reply.code(200).send({ message: "Laboratorio actualizado con éxito", data: updatedLaboratorio });

    } catch (error) {
        console.error("Error al actualizar el laboratorio:", error);
        return reply.code(500).send({ message: "Error al actualizar el laboratorio" });
    }
}

const enableLaboratorio = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "ID de laboratorio inválido" });
        }

        const laboratorioBDD = await Laboratorio.findById(id);
        if (!laboratorioBDD) {
            return reply.code(404).send({ message: "El laboratorio no existe" });
        }

        await Laboratorio.findByIdAndUpdate(
            id,
            {
                status: true,
                enableBy: adminLogged._id,
                enableDate: new Date() // ✅ Registrar la fecha de habilitación
            },
            { new: true }
        );

        return reply.code(200).send({ message: "Laboratorio habilitado con éxito" });

    } catch (error) {
        console.error("Error al habilitar el laboratorio:", error);
        return reply.code(500).send({ message: "Error al habilitar el laboratorio" });
    }
};


const disableLaboratorio = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "ID de laboratorio inválido" });
        }

        const laboratorioBDD = await Laboratorio.findById(id);
        if (!laboratorioBDD) {
            return reply.code(404).send({ message: "El laboratorio no existe" });
        }

        await Laboratorio.findByIdAndUpdate(
            id,
            {
                status: false,
                disableBy: adminLogged._id,
                disableDate: new Date()
            },
            { new: true }
        );

        return reply.code(200).send({ message: "Laboratorio deshabilitado con éxito" });

    } catch (error) {
        console.error("Error al deshabilitar el laboratorio:", error);
        return reply.code(500).send({ message: "Error al deshabilitar el laboratorio" });
    }
};

// Método para obtener todos los laboratorios
const getAllLaboratorios = async (req, reply) => {
    try {
        const laboratoriosBDD = await Laboratorio.find().populate('createBy', 'name').populate('updateBy', 'name').populate('enableBy', 'name').populate('disableBy', 'name');
        return reply.code(200).send(laboratoriosBDD);
    } catch (error) {
        console.error("Error al obtener los laboratorios:", error);
        return reply.code(500).send({ message: "Error al obtener los laboratorios" });
    }
}

// Método para obtener un laboratorio por ID
const getLaboratorioById = async (req, reply) => {
    try {
        const { id } = req.params;

        // Validación del ID del laboratorio
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "ID de laboratorio inválido" });
        }

        // Verificación de la existencia del laboratorio
        const laboratorioBDD = await Laboratorio.findById(id)
            .select('-__v')
            .populate('createBy', 'name lastName')
            .populate('updateBy', 'name lastName')
            .populate('enableBy', 'name lastName')
            .populate('disableBy', 'name lastName');
        if (!laboratorioBDD) {
            return reply.code(404).send({ message: "El laboratorio no existe" });
        }

        return reply.code(200).send(laboratorioBDD);

    } catch (error) {
        console.error("Error al obtener el laboratorio:", error);
        return reply.code(500).send({ message: "Error al obtener el laboratorio" });
    }
}

// Exportar los métodos
export {
    createLaboratorio,
    updateLaboratorio,
    enableLaboratorio,
    disableLaboratorio,
    getAllLaboratorios,
    getLaboratorioById
}
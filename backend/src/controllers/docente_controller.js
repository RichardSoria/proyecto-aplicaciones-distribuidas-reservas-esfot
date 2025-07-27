import Docente from "../models/Docente.js";
import generateToken from "../helpers/jwt.js";
import moment from "moment-timezone";
import mongoose from "mongoose";
import { sendMailNewUser, sendMailRecoverPassword, sendMailNewPassword, sendMailUpdateUser, sendMailEnableUser, sendMailDisableUser } from "../config/nodemailer.js";

// Método para el inicio de seisión de un docente
const loginDocente = async (req, reply) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario en la base de datos
        const docenteBDD = await Docente.findOne({ email }).select('-lastLogin -resetToken -resetTokenExpire -__v -updatedAt -createdAt');

        // Validar si el usuario existe
        if (!docenteBDD) {
            return reply.code(404).send({ message: 'Credenciales Incorrectas' });
        }

        // Si el usuario está bloqueado y ya pasó el tiempo, desbloquear
        if (docenteBDD.lockUntil && docenteBDD.lockUntil < new Date()) {
            docenteBDD.loginAttempts = 0;
            docenteBDD.lockUntil = null;
            await docenteBDD.save();
        }

        // Validar la contraseña
        const verifyPassword = await docenteBDD.matchPassword(password);

        // Si la cuenta sigue bloqueada
        if (docenteBDD.lockUntil && docenteBDD.lockUntil > new Date() && verifyPassword) {
            return reply.code(401).send({
                message: `El usuario está bloqueado. Intente nuevamente en ${moment(docenteBDD.lockUntil).tz("America/Guayaquil").format("HH:mm:ss")}`
            });
        }

        // Si la contraseña es incorrecta
        if (!verifyPassword) {
            docenteBDD.loginAttempts += 1;

            // Si llegó al límite, bloquear
            if (docenteBDD.loginAttempts >= 5) {
                docenteBDD.lockUntil = moment().add(30, 'minutes').toDate();
            }

            await docenteBDD.save();
            return reply.code(400).send({ message: 'Credenciales Incorrectas' });
        }

        // Si la contraseña es correcta
        if (verifyPassword && docenteBDD.status) {
            await docenteBDD.resetLoginAttempts();
            await docenteBDD.updateLastLogin();

            const tokenJWT = generateToken(docenteBDD._id, docenteBDD.rol, req.server);

            return reply
                .setCookie('tokenJWT', tokenJWT, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'none',
                    path: '/',
                    maxAge: 60 * 60 * 24,
                    signed: true
                })
                .code(200)
                .send({ message: 'Inicio de sesión exitoso' });
        } else {
            return reply.code(400).send({ message: 'La cuenta está deshabilitada' });
        }


    } catch (error) {
        console.error("Error al iniciar sesión:", error);
        return reply.code(500).send({ message: 'Error al iniciar sesión' });
    }
};

// Método para registrar un nuevo docente
const registerDocente = async (req, reply) => {
    try {

        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        const { cedula, name, lastName, email, phone, career, otherFaculty } = req.body;

        // Verificar si la cédula ya está registrada
        const existingDocente = await Docente.findOne({ cedula });
        if (existingDocente) {
            return reply.code(400).send({ message: 'La cédula ya está registrada' });
        }

        // Validar si la cédula es ecuatoriana
        const isEcuadorianDNI = await Docente.verifyEcuadorianDNI(cedula);
        if (!isEcuadorianDNI) {
            return reply.code(400).send({ message: 'La cédula no es ecuatoriana' });
        }

        // Verificar si el correo ya está registrado
        const existingEmail = await Docente.findOne({ email });
        if (existingEmail) {
            return reply.code(400).send({ message: 'El correo ya está registrado' });
        }
        // Verificar si el teléfono ya está registrado
        const existingPhone = await Docente.findOne({ phone });
        if (existingPhone) {
            return reply.code(400).send({ message: 'El teléfono ya está registrado' });
        }

        // Crear contraseña aleatoria
        const password = Math.random().toString(36).substring(2);

        // Crear el nuevo docente
        const newDocente = new Docente({
            cedula,
            name,
            lastName,
            email,
            phone,
            career,
            otherFaculty,
            createFor: adminLogged._id,
            enableFor: adminLogged._id
        });

        // Encriptar la contraseña
        newDocente.password = await newDocente.encryptPassword("Esfot@" + password + "-1990");

        // Guardar el nuevo docente en la base de datos
        await newDocente.save();

        // Enviar correo de bienvenida
        await sendMailNewUser(email, password, name, lastName);

        return reply.code(201).send({ message: "Docente registrado con éxito" });

    } catch (error) {
        console.error("Error al registrar docente:", error);
        return reply.code(500).send({ message: "Error al registrar docente" });
    }
};

const updateDocente = async (req, reply) => {
    try {

        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Validar el ID si es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: 'ID inválido' });
        };

        // Buscar el docente en la base de datos
        const docenteBDD = await Docente.findById(id).select('cedula name lastName email phone career otherFaculty updatedDate updateFor');

        // Validar si el docente existe
        if (!docenteBDD) {
            return reply.code(404).send({ message: 'Docente no encontrado' });
        };

        // Validar si la cédula ya está registrada
        if (docenteBDD.cedula !== req.body.cedula) {
            const existingCedula = await Docente.findOne({ cedula: req.body.cedula });
            if (existingCedula) {
                return reply.code(400).send({ message: 'La cédula ya está registrada' });
            }
        };

        // Validar si el correo ya está registrado
        if (docenteBDD.email !== req.body.email) {
            const existingEmail = await Docente.findOne({ email: req.body.email });
            if (existingEmail) {
                return reply.code(400).send({ message: 'El correo ya está registrado' });
            }
        };

        // Validar si el teléfono ya está registrado
        if (docenteBDD.phone !== req.body.phone) {
            const existingPhone = await Docente.findOne({ phone: req.body.phone });
            if (existingPhone) {
                return reply.code(400).send({ message: 'El teléfono ya está registrado' });
            }
        };


        // Validar body vacio dado a que el schema detecto campos no válidos
        if (Object.keys(req.body).length === 0) {
            return reply.code(400).send({ message: "No se han proporcionado los campos válidos para actualizar" });
        }

        // Actualizar los datos del docente
        docenteBDD.cedula = req.body.cedula || docenteBDD?.cedula;
        docenteBDD.name = req.body.name || docenteBDD?.name;
        docenteBDD.lastName = req.body.lastName || docenteBDD?.lastName;
        docenteBDD.email = req.body.email || docenteBDD?.email;
        docenteBDD.phone = req.body.phone || docenteBDD?.phone;
        docenteBDD.career = req.body.career || docenteBDD?.career;
        docenteBDD.otherFaculty = req.body.otherFaculty || docenteBDD?.otherFaculty;
        docenteBDD.updateFor = adminLogged._id;
        docenteBDD.updatedDate = Date.now();

        // Enviar correo de actualización
        await sendMailUpdateUser(docenteBDD.email, docenteBDD.name, docenteBDD.lastName);
        // Guardar los cambios en la base de datos
        await docenteBDD.save();
        return reply.code(200).send({ message: 'Docente actualizado con éxito' });

    } catch (error) {
        console.error("Error al actualizar docente:", error);
        return reply.code(500).send({ message: 'Error al actualizar docente' });
    }
};

// Método para habilitar un docente
const enableDocente = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Validar el ID si es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: 'ID inválido' });
        };

        // Buscar el docente en la base de datos
        const docenteBDD = await Docente.findById(id).select('cedula name lastName email phone career otherFaculty updatedDate updateFor status');

        // Validar si el docente existe
        if (!docenteBDD) {
            return reply.code(404).send({ message: 'Docente no encontrado' });
        };

        // Si el docente ya está habilitado
        if (docenteBDD.status) {
            return reply.code(400).send({ message: 'El docente ya está habilitado' });
        }

        // Habilitar al docente
        docenteBDD.status = true;
        docenteBDD.enableFor = adminLogged._id;
        docenteBDD.updatedDate = Date.now();

        // Enviar correo de habilitación
        await sendMailEnableUser(docenteBDD.email, docenteBDD.name, docenteBDD.lastName);

        // Guardar los cambios en la base de datos
        await docenteBDD.save();

        return reply.code(200).send({ message: 'Docente habilitado con éxito' });

    } catch (error) {
        console.error("Error al habilitar docente:", error);
        return reply.code(500).send({ message: 'Error al habilitar docente' });
    }
};

// Método para deshabilitar un docente
const disableDocente = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Validar el ID si es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: 'ID inválido' });
        };

        // Buscar el docente en la base de datos
        const docenteBDD = await Docente.findById(id).select('cedula name lastName email phone career otherFaculty updatedDate updateFor status');

        // Validar si el docente existe
        if (!docenteBDD) {
            return reply.code(404).send({ message: 'Docente no encontrado' });
        };

        // Si el docente ya está deshabilitado
        if (!docenteBDD.status) {
            return reply.code(400).send({ message: 'El docente ya está deshabilitado' });
        }

        // Deshabilitar al docente
        docenteBDD.status = false;
        docenteBDD.disableFor = adminLogged._id;
        docenteBDD.disableDate = Date.now();

        // Enviar correo de deshabilitación
        await sendMailDisableUser(docenteBDD.email, docenteBDD.name, docenteBDD.lastName);

        // Guardar los cambios en la base de datos
        await docenteBDD.save();

        return reply.code(200).send({ message: 'Docente deshabilitado con éxito' });

    } catch (error) {
        console.error("Error al deshabilitar docente:", error);
        return reply.code(500).send({ message: 'Error al deshabilitar docente' });
    }
};

// Método para recuperar la contraseña de un docente
const recoverPassword = async (req, reply) => {
    try {
        const { email } = req.body;
        const docenteBDD = await Docente.findOne({ email });

        if (!docenteBDD || !docenteBDD.status) {
            return reply.code(200).send({
                message: "Si el correo está registrado, se ha enviado un enlace de recuperación."
            });
        }

        if (docenteBDD.resetToken && docenteBDD.resetTokenExpire > new Date()) {
            return reply.code(200).send({
                message: "Si el correo está registrado, se ha enviado un enlace de recuperación."
            });
        }

        const token = await docenteBDD.createResetToken();
        const resetTokenExpire = moment(docenteBDD.resetTokenExpire).tz("America/Guayaquil").format("HH:mm:ss");

        sendMailRecoverPassword(email, token, docenteBDD.name, docenteBDD.lastName, resetTokenExpire);

        return reply.code(200).send({
            message: "Si el correo está registrado, se ha enviado un enlace de recuperación."
        });

    } catch (error) {
        console.error("Error al recuperar contraseña:", error);
        return reply.code(500).send({ message: "Error interno del servidor" });
    }
};

// Método para verificar el token de recuperación de contraseña
const verifyToken = async (req, reply) => {
    try {
        const { token } = req.params;

        if (!token) {
            return reply.code(400).send({ message: 'Token no proporcionado' });
        }
        const docenteBDD = await Docente.findOne({ resetToken: token })
        if (!docenteBDD) {
            return reply.code(400).send({ message: 'El token no es válido' });
        }

        // Verificar si el token ha expirado
        if (docenteBDD.resetTokenExpire < Date.now()) {
            return reply.code(400).send({ message: "El token ha expirado. Solicite un nuevo correo de recuperación" });
        }
        return reply.code(200).send({ message: "Verificación exitosa. Haga clic en 'Enviar Contraseña de Recuperación' para continuar" });
    } catch (error) {
        console.error("Error al verificar el token:", error);
        return reply.code(500).send({ message: 'Error al verificar el token' });
    }
};

// Método para enviar el correo de recuperación de contraseña
const sendRecoverPassword = async (req, reply) => {
    try {
        const { token } = req.params;
        const docenteBDD = await Docente.findOne({ resetToken: token })
        if (!docenteBDD) {
            return reply.code(400).send({ message: "El enlace de recuperación ya ha sido utilizado." });
        }

        // Verificar si el token ha expirado
        if (docenteBDD.resetTokenExpire < Date.now()) {
            return reply.code(400).send({ message: "El token ha expirado. Solicite un nuevo correo de recuperación" });
        }

        // Generar una nueva contraseña aleatoria
        const newPassword = Math.random().toString(36).substring(2);

        // Encriptar la nueva contraseña
        docenteBDD.password = await docenteBDD.encryptPassword("Esfot@" + newPassword + "-1990");
        // Limpiar el token de recuperación
        docenteBDD.resetToken = null;
        docenteBDD.resetTokenExpire = null;

        // Limpiar el último inicio de sesión
        docenteBDD.loginAttempts = 0;
        docenteBDD.lockUntil = null;

        // Guardar los cambios en la base de datos
        await docenteBDD.save();
        sendMailNewPassword(docenteBDD.email, newPassword, docenteBDD.name, docenteBDD.lastName);
        return reply.code(200).send({ message: "Contraseña de recuperación enviada." });
    } catch (error) {
        console.error("Error al enviar el correo de recuperación:", error);
        return reply.code(500).send({ message: 'Error al enviar el correo de recuperación' });
    }
}

// Método para actualizar la contraseña de un docente
const updatePassword = async (req, reply) => {
    try {
        const { id } = req.docenteBDD;
        const { password, confirmPassword } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "El ID no es válido" });
        }

        const docenteBDD = await Docente.findById(id)
        if (!docenteBDD) {
            return reply.code(404).send({ message: "El docente no existe" })
        }
        // Comprobar si los campos están vacíos o contienen solo espacios
        if (!password?.trim() || !confirmPassword?.trim()) {
            return reply.code(400).send({ message: "Todos los campos son obligatorios" });
        }
        // Validar si la contraseña y la confirmación son iguales
        if (password !== confirmPassword) {
            return reply.code(400).send({ message: "Las contraseñas no coinciden" });
        }
        docenteBDD.password = await docenteBDD.encryptPassword(password);
        await docenteBDD.save();

        return reply.code(200).send({ message: "Contraseña actualizada con éxito" });

    } catch (error) {
        console.error("Error al actualizar la contraseña:", error);
        return reply.code(500).send({ message: 'Error al actualizar la contraseña' });
    }
};

// Método para obtener todos los docentes
const getAllDocentes = async (req, reply) => {
    try {
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        const docentes = await Docente.find().select('-__v -updatedAt -createdAt');
        return reply.code(200).send(docentes);
    } catch (error) {
        console.error("Error al obtener docentes:", error);
        return reply.code(500).send({ message: 'Error al obtener docentes' });
    }
};

// Método para obtener un docente por ID
const getDocenteById = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }
        // Validar el ID si es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: 'ID inválido' });
        };

        // Buscar el docente en la base de datos
        const docenteBDD = await Docente.findById(id)
            .select('-__v -updatedAt -password')
            .populate('createFor', 'name lastName')
            .populate('updateFor', 'name lastName')
            .populate('enableFor', 'name lastName')
            .populate('disableFor', 'name lastName');

        // Validar si el docente existe
        if (!docenteBDD) {
            return reply.code(404).send({ message: 'Docente no encontrado' });
        };

        return reply.code(200).send(docenteBDD);
    } catch (error) {
        console.error("Error al obtener docente:", error);
        return reply.code(500).send({ message: 'Error al obtener docente' });
    }
};

// Método para obtener el perfil del docente
const getDocenteProfile = async (req, reply) => {
    try {
        const docenteBDD = req.docenteBDD;

        if (!docenteBDD) {
            return reply.code(404).send({ message: 'El docente no existe' });
        }

        return reply.code(200).send({
            _id: docenteBDD._id,
            name: docenteBDD.name,
            lastName: docenteBDD.lastName,
            email: docenteBDD.email,
            phone: docenteBDD.phone,
            cedula: docenteBDD.cedula,
            rol: docenteBDD.rol,
            status: docenteBDD.status,
            career: docenteBDD.career,
            otherFaculty: docenteBDD.otherFaculty,
        });

    } catch (error) {
        console.error("Error al obtener el perfil del docente:", error);
        return reply.code(500).send({ message: 'Error al obtener el perfil del docente' });
    }
};

// Exportar los métodos
export {
    loginDocente,
    registerDocente,
    updateDocente,
    enableDocente,
    disableDocente,
    recoverPassword,
    verifyToken,
    sendRecoverPassword,
    updatePassword,
    getAllDocentes,
    getDocenteById,
    getDocenteProfile
};
import Admin from "../models/Admin.js";
import generateToken from "../helpers/jwt.js";
import moment from "moment-timezone";
import mongoose from "mongoose";
import { sendMailNewUser, sendMailRecoverPassword, sendMailNewPassword, sendMailUpdateUser, sendMailEnableUser, sendMailDisableUser } from "../config/nodemailer.js";

// Método para el inicio de sesión
const loginAdmin = async (req, reply) => {
    try {
        const { email, password } = req.body;

        // Buscar el usuario en la base de datos
        const adminBDD = await Admin.findOne({ email });

        // Validar si el usuario existe
        if (!adminBDD) {
            return reply.code(404).send({ message: 'Credenciales Incorrectas' });
        }

        // Si el usuario está bloqueado y ya pasó el tiempo, desbloquear
        if (adminBDD.lockUntil && adminBDD.lockUntil < new Date()) {
            adminBDD.loginAttempts = 0;
            adminBDD.lockUntil = null;
            await adminBDD.save();
        }

        // Validar la contraseña
        const verifyPassword = await adminBDD.matchPassword(password);

        // Si la cuenta sigue bloqueada
        if (adminBDD.lockUntil && adminBDD.lockUntil > new Date() && verifyPassword) {
            return reply.code(401).send({
                message: `El usuario está bloqueado. Intente nuevamente en ${moment(adminBDD.lockUntil).tz("America/Guayaquil").format("HH:mm:ss")}`
            });
        }

        // Si la contraseña es incorrecta
        if (!verifyPassword) {
            adminBDD.loginAttempts += 1;

            // Si llegó al límite, bloquear
            if (adminBDD.loginAttempts >= 5) {
                adminBDD.lockUntil = moment().add(30, 'minutes').toDate();
            }

            await adminBDD.save();
            return reply.code(400).send({ message: 'Credenciales Incorrectas' });
        }

        // Si la contraseña es correcta
        if (verifyPassword && adminBDD.status) {
            await adminBDD.resetLoginAttempts();
            await adminBDD.updateLastLogin();


            const tokenJWT = generateToken(adminBDD._id, adminBDD.rol, req.server);

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

const registerAdmin = async (req, reply) => {
    try {
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        const { cedula, name, lastName, email, phone } = req.body;

        // Verificar si la cédula ya está registrada
        const existingCedula = await Admin.findOne({ cedula });
        if (existingCedula) {
            return reply.code(400).send({ message: "La cédula ya está registrada" });
        }

        // Validar si la cédula es ecuatoriana
        const isValidDNI = await Admin.verifyEcuadorianDNI(cedula);

        if (!isValidDNI) {
            return reply.code(400).send({ message: "La cédula no es válida" });
        }

        // Verificar si el correo ya está registrado
        const existingEmail = await Admin.findOne({ email });
        if (existingEmail) {
            return reply.code(400).send({ message: "El correo ya está registrado" });
        }

        // Verificar si el teléfono ya está registrado
        const existingPhone = await Admin.findOne({ phone });
        if (existingPhone) {
            return reply.code(400).send({ message: "El teléfono ya está registrado" });
        }

        // Crear contraseña aleatoria
        const password = Math.random().toString(36).substring(2);

        // Crear un nuevo administrador
        const newAdmin = new Admin({ cedula, name, lastName, email, phone, createFor: adminLogged._id, enableFor: adminLogged._id });

        // Encriptar la contraseña
        newAdmin.password = await newAdmin.encryptPassword("Esfot@" + password + "-1990");

        // Guardar en la base de datos
        await newAdmin.save();

        // Enviar correo al nuevo administrador
        await sendMailNewUser(email, password, name, lastName);
        return reply.code(201).send({ message: "Administrador registrado con éxito" });

    } catch (error) {
        console.error("Error al registrar administrador:", error);
        return reply.code(500).send({ message: "Error al registrar administrador" });
    }
};

// Método para actualizar administrador
const updateAdmin = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        // Validar si el ID es válido
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "El ID no es válido" });
        }

        const adminBDD = await Admin.findById(id).select('cedula name lastName email phone updatedDate updateFor');

        // Validar si el administrador existe
        if (!adminBDD) {
            return reply.code(404).send({ message: "El administrador no existe" });
        }

        // Validar si la cédula ya está registrada
        if (adminBDD.cedula != req.body.cedula) {
            const existingCedula = await Admin.findOne({ cedula: req.body.cedula });
            if (existingCedula) {
                return reply.code(400).send({ message: "La cédula ya está registrada" });
            }
        }

        // Validar si el correo, teléfono o cédula ya están registrados
        if (adminBDD.email != req.body.email) {
            const existingEmail = await Admin.findOne({ email: req.body.email });
            if (existingEmail) {
                return reply.code(400).send({ message: "El correo ya está registrado" });
            }
        }

        // Validar si el teléfono ya está registrado
        if (adminBDD.phone != req.body.phone) {
            const existingPhone = await Admin.findOne({ phone: req.body.phone });
            if (existingPhone) {
                return reply.code(400).send({ message: "El teléfono ya está registrado" });
            }
        }

        // Validar body vacio dado a que el schema detecto campos no válidos
        if (Object.keys(req.body).length === 0) {
            return reply.code(400).send({ message: "No se han proporcionado los campos válidos para actualizar" });
        }

        // Actualizar los campos del administrador
        adminBDD.cedula = req.body.cedula || adminBDD?.cedula;
        adminBDD.name = req.body.name || adminBDD?.name;
        adminBDD.lastName = req.body.lastName || adminBDD?.lastName;
        adminBDD.email = req.body.email || adminBDD?.email;
        adminBDD.phone = req.body.phone || adminBDD?.phone;
        adminBDD.updateFor = adminLogged._id;
        adminBDD.updatedDate = Date.now();
        await adminBDD.save();
        // Enviar correo al administrador
        sendMailUpdateUser(adminBDD.email, adminBDD.name, adminBDD.lastName);
        return reply.code(200).send({ message: "Administrador actualizado con éxito" });
    } catch (error) {
        console.error("Error al actualizar administrador:", error);
        return reply.code(500).send({ message: "Error al actualizar administrador" });
    }
};

// Método para habilitar administrador
const enableAdmin = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;
        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "El ID no es válido" });
        }
        const adminBDD = await Admin.findById(id);
        // Verificar si el administrador existe
        if (!adminBDD) {
            return reply.code(404).send({ message: "El administrador no existe" });
        }
        // Verificar que no sea el mismo administrador
        if (adminLogged._id.toString() === id) {
            return reply.code(400).send({ message: "El administrador que inició sesión no puede habilitarse a sí mismo" });
        }
        // Verificar si el administrador ya está habilitado
        if (adminBDD.status) {
            return reply.code(400).send({ message: "El administrador ya está habilitado" });
        }
        adminBDD.status = true;
        adminBDD.enableDate = Date.now();
        adminBDD.enableFor = adminLogged._id;
        await adminBDD.save();
        // Enviar correo al administrador
        sendMailEnableUser(adminBDD.email, adminBDD.name, adminBDD.lastName);
        return reply.code(200).send({ message: "Administrador habilitado con éxito" });

    } catch (error) {
        console.error("Error al habilitar administrador:", error);
        return reply.code(500).send({ message: "Error al habilitar administrador" });

    }
};

// Método para deshabilitar administrador
const disableAdmin = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "El ID no es válido" });
        }
        const adminBDD = await Admin.findById(id);
        if (!adminBDD) {
            return reply.code(404).send({ message: "El administrador no existe" });
        }
        // Verificar que no sea el mismo administrador
        if (adminLogged._id.toString() === id) {
            return reply.code(400).send({ message: "El administrador que inició sesión no puede deshabilitarse a sí mismo" });
        }
        if (!adminBDD.status) {
            return reply.code(400).send({ message: "El administrador ya está deshabilitado" });
        }
        adminBDD.status = false;
        adminBDD.disableDate = Date.now();
        adminBDD.disableFor = adminLogged._id;
        await adminBDD.save();
        // Enviar correo al administrador
        sendMailDisableUser(adminBDD.email, adminBDD.name, adminBDD.lastName);
        return reply.code(200).send({ message: "Administrador deshabilitado con éxito" });
    } catch (error) {
        console.error("Error al deshabilitar administrador:", error);
        return reply.code(500).send({ message: "Error al deshabilitar administrador" });

    }
};

// Método para recuperar contraseña
const recoverPassword = async (req, reply) => {
    try {
        const { email } = req.body;

        const adminBDD = await Admin.findOne({ email });

        if (!adminBDD || !adminBDD.status) {
            return reply.code(200).send({
                message: "Si el correo está registrado, se ha enviado un enlace de recuperación."
            });
        }

        if (adminBDD.resetToken && adminBDD.resetTokenExpire > new Date()) {
            return reply.code(200).send({
                message: "Si el correo está registrado, se ha enviado un enlace de recuperación."
            });
        }

        const token = await adminBDD.createResetToken();

        const resetTokenExpire = moment(adminBDD.resetTokenExpire).tz("America/Guayaquil").format("HH:mm:ss");

        sendMailRecoverPassword(email, token, adminBDD.name, adminBDD.lastName, resetTokenExpire);

        return reply.code(200).send({
            message: "Si el correo está registrado, se ha enviado un enlace de recuperación."
        });

    } catch (error) {
        console.error("Error al recuperar contraseña:", error);
        return reply.code(500).send({ message: "Error interno del servidor" });
    }
};

// Método para verificar token
const verifyToken = async (req, reply) => {
    try {
        const { token } = req.params;
        if (!token) {
            return reply.code(400).send({ message: "El token es obligatorio" });
        }
        const adminBDD = await Admin.findOne({ resetToken: token });
        if (!adminBDD) {
            return reply.code(404).send({ message: "El token no es válido" });
        }
        // Verificar si el token ha expirado
        if (adminBDD.resetTokenExpire < new Date()) {
            return reply.code(400).send({ message: "El token ha expirado. Solicite un nuevo correo de recuperación." });
        }
        return reply.code(200).send({ message: "Verificación exitosa. Haga clic en 'Enviar Contraseña de Recuperación' para continuar." });
    } catch (error) {
        console.error("Error al verificar token:", error);
        return reply.code(500).send({ message: "Error al verificar token" });
    }
};

// Método para enviar la contraseña de recuperación
const sendRecoverPassword = async (req, reply) => {
    try {
        const { token } = req.params;

        const adminBDD = await Admin.findOne({ resetToken: token });
        if (!adminBDD) {
            return reply.code(400).send({ message: "El enlace de recuperación ya ha sido utilizado." });
        }
        // Verificar si el token ha expirado
        if (adminBDD.resetTokenExpire < new Date()) {
            return reply.code(400).send({ message: "El token ha expirado. Solicite un nuevo correo de recuperación" });
        }
        // Generar nueva contraseña
        const newPassword = Math.random().toString(36).substring(2);
        // Encriptar la nueva contraseña
        adminBDD.password = await adminBDD.encryptPassword("Esfot" + "@" + newPassword + "-" + "1990");
        // Limpiar el token y la fecha de expiración
        adminBDD.resetToken = null;
        adminBDD.resetTokenExpire = null;

        // Limpiar los intentos de inicio de sesión
        adminBDD.loginAttempts = 0;
        adminBDD.lockUntil = null;

        // Guardar en la base de datos
        await adminBDD.save();
        // Enviar correo con la nueva contraseña
        sendMailNewPassword(adminBDD.email, newPassword, adminBDD.name, adminBDD.lastName);
        return reply.code(200).send({ message: "Contraseña de recuperación enviada." });

    } catch (error) {
        console.error("Error al enviar la contraseña de recuperación:", error);
        return reply.code(500).send({ message: "Error al enviar la contraseña de recuperación" });
    }
};

// Método para actualizar contraseña
const updatePassword = async (req, reply) => {
    try {

        const { id } = req.adminBDD
        const { password, confirmPassword } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "El ID no es válido" });
        }
        const adminBDD = await Admin.findById(id);
        if (!adminBDD) {
            return reply.code(404).send({ message: "El administrador no existe" });
        }
        // Comprobar si los campos están vacíos o contienen solo espacios
        if (!password?.trim() || !confirmPassword?.trim()) {
            return reply.code(400).send({ message: "Todos los campos son obligatorios" });
        }
        // Validar si la contraseña y la confirmación son iguales
        if (password !== confirmPassword) {
            return reply.code(400).send({ message: "Las contraseñas no coinciden" });
        }
        // Encriptar la nueva contraseña
        adminBDD.password = await adminBDD.encryptPassword(password);
        // Guardar en la base de datos
        await adminBDD.save();
        return reply.code(200).send({ message: "Contraseña actualizada con éxito" });
    } catch (error) {
        console.error("Error al actualizar contraseña:", error);
        return reply.code(500).send({ message: "Error al actualizar contraseña" });
    }
};

// Método para obtener todos los administradores	
const getAllAdmins = async (req, reply) => {
    try {
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        const admins = await Admin.find().select('-__v');
        return reply.code(200).send(admins);
    } catch (error) {
        console.error("Error al obtener administradores:", error);
        return reply.code(500).send({ message: "Error al obtener administradores" });
    }
};

// Método para obtener un administrador por ID
const getAdminById = async (req, reply) => {
    try {
        const { id } = req.params;
        const adminLogged = req.adminBDD;

        if (!adminLogged) {
            return reply.code(401).send({ message: "No tienes permiso para realizar esta acción" });
        }

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return reply.code(400).send({ message: "El ID no es válido" });
        }
        const adminBDD = await Admin.findById(id)
            .select('-__v -updatedAt -password')
            .populate('createFor', 'name lastName')
            .populate('updateFor', 'name lastName')
            .populate('enableFor', 'name lastName')
            .populate('disableFor', 'name lastName');
        if (!adminBDD) {
            return reply.code(404).send({ message: "El administrador no existe" });
        }
        return reply.code(200).send(adminBDD);
    } catch (error) {
        console.error("Error al obtener administrador:", error);
        return reply.code(500).send({ message: "Error al obtener administrador" });
    }
};

// Método para mostrar el perfil del administrador
const getAdminProfile = async (req, reply) => {
    try {
        const adminBDD = req.adminBDD;

        // Verificar si el administrador existe
        if (!adminBDD) {
            return reply.code(404).send({ message: "El administrador no existe" });
        }

        return reply.code(200).send({
            _id: adminBDD._id,
            name: adminBDD.name,
            lastName: adminBDD.lastName,
            cedula: adminBDD.cedula,
            email: adminBDD.email,
            phone: adminBDD.phone,
            rol: adminBDD.rol,
            status: adminBDD.status,
        });
    } catch (error) {
        console.error("Error al obtener perfil de administrador:", error);
        return reply.code(500).send({ message: "Error al obtener perfil de administrador" });
    }
};

export {
    loginAdmin,
    registerAdmin,
    updateAdmin,
    enableAdmin,
    disableAdmin,
    recoverPassword,
    verifyToken,
    sendRecoverPassword,
    updatePassword,
    getAllAdmins,
    getAdminById,
    getAdminProfile
};
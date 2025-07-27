import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import Docente from '../models/Docente.js';
import Estudiante from '../models/Estudiante.js';

const verifyAuth = async (req, reply) => {
    const { valid, value: token } = req.unsignCookie(req.cookies.tokenJWT || '');

    if (!valid || !token) {
        return reply.code(401).send({ message: 'Token de autenticación inválido o ausente' });
    }

    try {
        const { id, rol } = jwt.verify(token, req.server.config.JWT_SECRET);

        if (rol === 'Admin') {
            req.adminBDD = await Admin.findById(id).select('-password -__v');
        } else if (rol === 'Docente') {
            req.docenteBDD = await Docente.findById(id).select('-password -__v');
        } else if (rol === 'Estudiante') {
            req.estudianteBDD = await Estudiante.findById(id).select('-password -__v');
        } else {
            return reply.code(401).send({ message: 'Rol no autorizado' });
        }
    } catch (error) {
        return reply.code(401).send({ message: 'Token inválido' });
    }
};

export default verifyAuth;

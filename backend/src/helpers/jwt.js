import jwt from 'jsonwebtoken';


const generateToken = (id, rol, fastify) => {
    return jwt.sign({ id, rol }, fastify.config.JWT_SECRET, { expiresIn: '1d' });
}

export default generateToken;
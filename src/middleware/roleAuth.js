const { verifyToken } = require('../helpers/gerate-token')
const userModel = require('../models/user')

const checkRoleAuth = (roles) => async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ').pop()
        if (!token) {
            return res.status(401).send({ error: 'No se proporcionó token de autorización' })
        }

        const tokenData = await verifyToken(token)
        const userData = await userModel.findById(tokenData._id)
        if (!userData) {
            return res.status(404).send({ error: 'Usuario no encontrado' })
        }

        if (Array.isArray(roles) ? roles.includes(userData.role) : roles === userData.role) {
            return next()
        } else {
            return res.status(403).send({ error: 'No tienes permisos para esta acción' })
        }

    } catch (err) {
        console.error('Error en checkRoleAuth:', err)
        if (err.name === 'TokenExpiredError') {
            return res.status(401).send({ error: 'Token expirado' })
        }
        res.status(500).send({ error: 'Error interno del servidor' })
    }
}

module.exports = checkRoleAuth
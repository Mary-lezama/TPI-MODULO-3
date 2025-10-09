const jwt = require('jsonwebtoken')
const SECRET = 'la_clave_secreta'

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'Token requerido' })

    try {
        const decoded = jwt.verify(token, SECRET)
        req.user = decoded
        next()
    } catch (error) {
        res.status(403).json({ error: 'Token invalido o expirado' })
    }
}

module.exports = { verifyToken }
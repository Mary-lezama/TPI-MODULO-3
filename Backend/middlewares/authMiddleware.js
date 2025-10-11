const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware para proteger rutas con autenticación JWT.
 * 
 * Si el token es válido, agrega los datos del usuario (req.user)
 * y deja continuar la ejecución con next().
 * Si no lo es, responde con un error 401.
 */
function verifyToken(req, res, next) {
  // Leer token desde el encabezado Authorization
  const authHeader = req.headers['authorization'];

  // El formato correcto es: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Verifica el token con la clave secreta definida en .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guarda los datos del usuario para las rutas siguientes
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}

module.exports = verifyToken;
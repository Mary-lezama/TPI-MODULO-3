const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware para proteger rutas con autenticacion JWT.
 * 
 * Si el token es valido, agrega los datos del usuario (req.user)
 * y deja continuar la ejecución con next().
 * Si no lo es, responde con un error 401.
 */
function verifyToken(req, res, next) {
  // Leer token desde el encabezado Authorization
  const authHeader = req.headers['authorization'];

  // El formato correcto es: "Bearer <token>"
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Acceso denegado. Token no proporcionado.'
    });
  }

  // Verificar que JWT_SECRET este configurado
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({
      success: false,
      message: 'Error de configuracion del servidor'
    });
  }

  try {
    // Verifica el token con la clave secreta definida en .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Guarda los datos del usuario para las rutas siguientes
    req.user = decoded;

    next();
  } catch (error) {
    // Manejar diferentes tipos de errores JWT
    let errorMessage = 'Token inválido o expirado.';

    if (error.name === 'TokenExpiredError') {
      errorMessage = 'Token expirado. Por favor, inicia sesion nuevamente.';
    } else if (error.name === 'JsonWebTokenError') {
      errorMessage === 'Token invalido. Autenticacion fallida.';
    }

    return res.status(401).json({
      success: false,
      message: errorMessage,
    });
  }
}

module.exports = verifyToken;
/**
 * Middleware global de manejo de errores.
 * Captura todos los errores que no fueron manejados en las rutas.
 */
function errorHandler(err, req, res, next) {
    // Log detallado del error en consola (solo desarrollo)
    if (process.env.NODE_ENV !== 'production') {
    console.error('=== ERROR CAPTURADO ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Method:', req.method);
    console.error('Path:', req.path);
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
    console.error('========================');
  } else {
    // En produccion, solo logueamos el mensaje
    console.error(`[${new Date().toISOString()}] Error: ${err.message}`);
  }

  // Determinar codigo de estado
  const statusCode = err.statusCode || err.status || 500;

  // Determinar mensaje de error
  let errorMessage = 'Ocurrio un error inesperado en el servidor';

  // Errores especificos
  if (err.name === 'ValidationError') {
    errorMessage = 'Error de validacion de datos';
  } else if (err.name === 'UnauthorizedError' || err.name === 'JsonWebTokenError') {
    errorMessage = 'Error de autenticacion';
  } else if (err.name === 'CastError') {
    errorMessage = 'ID inválido';
  } else if (statusCode < 500) {
    // Si es un error del cliente (4xx), usar el mensaje original
    errorMessage = err.message;
  }

  // Respuesta al cliente
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    ...(process.env.NODE_ENV !== 'production' && { 
      error: err.message,
      stack: err.stack 
    }),
  });
}

/**
 * Middleware para manejar rutas no encontradas (404)
 */
function notFoundHandler(req, res, next) {
    res.status(404).json({
        success: false,
        message: `Ruta no encontrada: ${req.method} ${req.path}`,
    });
}

module.exports = { errorHandler, notFoundHandler };
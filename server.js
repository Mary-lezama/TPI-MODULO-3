/**
 * SERVER.JS - Punto de entrada principal de la API
 * 
 * Funcionalidades:
 * - Carga variables de entorno (.env)
 * - Configura middlewares globales (CORS, JSON parsing)
 * - Conecta todas las rutas de la API
 * - Manejo de errores centralizado
 * - Listo para despliegue en Render
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');


// Inicializar configuración .env
dotenv.config();

// Verificar que el  JWT_SECRET este configurado
if (!process.env.JWT_SECRET){
  console.error('❌ ERROR: JWT_SECRET no está definido en .env');
  process.exit(1);
}

const app = express();

// ========== MIDDLEWARES GLOBALES ==========

// CORS - Permite peticiones desde otros dominios
app.use(cors());

// Body parser - Parsea JSON en requests
app.use(express.json());

// ========== IMPORTAR RUTAS ==========
const authRoutes = require('./Backend/routes/authRoutes');
const clientRoutes = require('./Backend/routes/clientRoutes');
const plantRoutes = require('./Backend/routes/plantRoutes');
const saleRoutes = require('./Backend/routes/saleRoutes');
const { errorHandler, notFoundHandler } = require('./Backend/middlewares/errorHandler');

// ========== RUTA RAIZ (Health Check) ==========
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🌱 API VIVERO funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      clients: '/clients',
      plants: '/plants',
      sales: '/sales',
    },
  });
});

// Health check endpoint (util para Render y monitoreo)
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// ========== RUTAS DE LA API ==========
app.use('/auth', authRoutes);
app.use('/clients', clientRoutes);
app.use('/plants', plantRoutes);
app.use('/sales', saleRoutes);

// Menejo de rutas no encontradas (404)
app.use(notFoundHandler);

//  Manejo de errores global
app.use(errorHandler);

// ========== INICIAR SERVIDOR ==========

// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`🚀 Servidor iniciado exitosamente`);
  console.log(`📡 Puerto: ${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configurado' : '❌ No configurado'}`);
  console.log('=================================');
  console.log(`📍 Endpoints disponibles:`);
  console.log(`   - Raiz: http://localhost:${PORT}/`);
  console.log(`   - Auth: http://localhost:${PORT}/auth`);
  console.log(`   - Clientes: http://localhost:${PORT}/clients`);
  console.log(`   - Plantas: http://localhost:${PORT}/plants`);
  console.log(`   - Ventas: http://localhost:${PORT}/sales`);
  console.log('=================================');
});

// ========== MANEJO DE ERRORES NO CAPTURADOS ==========
// Captura errores no manejados
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Captura promesas rechazadas no manejadas
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection:', reason);
  process.exit(1);
});
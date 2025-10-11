/*OBJETIVO
Queremos que server.js:
Cargue las variables de entorno (.env).
Use los middlewares globales (express.json, CORS, etc.).
Conecte todas tus rutas (authRoutes, clientRoutes, plantRoutes, saleRoutes).
Esté listo para Render (usando process.env.PORT).*/

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Inicializar configuración .env
dotenv.config();
const SECRET = process.env.JWT_SECRET;

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Importar rutas
const authRoutes = require('./Backend/routes/authRoutes');
const clientRoutes = require('./Backend/routes/clientRoutes');
const plantRoutes = require('./Backend/routes/plantRoutes');
const saleRoutes = require('./Backend/routes/saleRoutes');
const errorHandler = require('./Backend/middlewares/errorHandler');

// Rutas base
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/plants', plantRoutes);
app.use('/api/sales', saleRoutes);
app.use(errorHandler);

// Ruta raíz 
app.get('/', (req, res) => {
  res.send('🌱 API VIVERO funcionando correctamente');
});

// Puerto dinámico (Render asigna uno automáticamente)
const PORT = process.env.PORT || 3000;

//  Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
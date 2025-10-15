// Vamos a definir las rutas HTTP que permiten interactuar con los clientes del 
// vivero: crear, leer, actualizar y eliminar. 
// Tambien aplicamos validaciones con express-validator para asegurar que los datos esten bien antes de procesarlos.

const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { clientValidator } = require('../middlewares/validators');
const handleValidationErrors = require('../middlewares/handleValidationErrors')
const { 
  createClient, 
  getAllClients, 
  getClientById, 
  updateClient, 
  deleteClient 
} = require('../controllers/clientController');


//  Obtener todos los clientes (protegido)
router.get('/', verifyToken, getAllClients);

//  Obtener un cliente por ID (protegido)
router.get('/:id', verifyToken, getClientById);

// Crear cliente
router.post('/', verifyToken, clientValidator, handleValidationErrors, createClient);

// Actualizar cliente
router.put('/:id', verifyToken, clientValidator, handleValidationErrors, updateClient);


// Eliminar un cliente (protegido)
router.delete('/:id', verifyToken, deleteClient);

module.exports = router;
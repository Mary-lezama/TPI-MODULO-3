// Vamos a definir las rutas HTTP que permiten interactuar con los clientes del 
// vivero: crear, leer, actualizar y eliminar. 
// Tambien aplicamos validaciones con express-validator para asegurar 
// que los datos esten bien antes de procesarlos.

const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { validationResult } = require('express-validator');
const { clientValidator } = require('../middlewares/validators');
const { createClient, getAllClients, getClientById, updateClient, deleteClient } = require('../controllers/clientController');


//  Obtener todos los clientes (protegido)
router.get('/', verifyToken, getAllClients);

//  Obtener un cliente por ID (protegido)
router.get('/:id', verifyToken, getClientById);

// Crear cliente (protegido + validado)
router.post('/', verifyToken, clientValidator, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  createClient(req, res);
});

// Actualizar cliente (protegido + validado)
router.put('/:id', verifyToken, clientValidator, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  updateClient(req, res);
});


// Eliminar un cliente (protegido)
router.delete('/:id', verifyToken, deleteClient);

module.exports = router;
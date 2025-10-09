// Vamos a definir las rutas HTTP que permiten interactuar con los clientes del vivero: crear, leer, actualizar y eliminar. 
// Tambien aplicamos validaciones con express-validator para asegurar que los datos esten bien antes de procesarlos.

const express = require('express');
const { createClient, getAllClients, getClientById, updateClient, deleteCLient } = require('../controllers/clientController');
const router = express.Router();

const { clientValidator } = require('../middlewares/validators');
const { validationResult } = require('express-validator');

// obtener todos los clientes
router.get('/', getAllClients);

// obtener cliente por id
router.get('/:id', getClientById);

// crear cliente con validacion
router.post('/', clientValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    createClient(req, res);
});

// actualizar cliente con validacion
router.put('/:id', clientValidator, (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    updateClient(req, res);
});

// eliminar cliente
router.delete('/:id', deleteCLient);

module.exports = router;
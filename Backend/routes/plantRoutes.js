const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { plantValidator } = require('../middlewares/validators');
const handleValidationErrors = require('../middlewares/handleValidationErrors');
const { 
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant 
} = require('../controllers/plantController');

//  Obtener todas las plantas (publico)
router.get('/', getAllPlants);

//  Obtener una planta por ID (publico)
router.get('/:id', getPlantById);

// crear una nueva planta (protegido + validado)
router.post('/', verifyToken, plantValidator, handleValidationErrors, createPlant);

//  Actualizar una planta (protegido + validado)
router.put('/:id', verifyToken, plantValidator, handleValidationErrors, updatePlant);

//  Eliminar una planta (protegido)
router.delete('/:id', verifyToken, deletePlant);

module.exports = router;


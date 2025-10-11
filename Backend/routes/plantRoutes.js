const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { validationResult } = require('express-validator');
const { plantValidator } = require('../middlewares/validators');
const { getAllPlants,getPlantById,createPlant,updatePlant,deletePlant } = require('../controllers/plantController');

//  Obtener todas las plantas (público o protegido, según prefieras)
router.get('/', getAllPlants);

//  Obtener una planta por ID (público)
router.get('/:id', getPlantById);

// crear una nueva planta con validacion
router.post('/', verifyToken, plantValidator, (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  createPlant(req, res);
});
//  Actualizar una planta existente (solo autenticados)
router.put('/:id', verifyToken, updatePlant);

//  Eliminar una planta (solo autenticados)
router.delete('/:id', verifyToken, deletePlant);

module.exports = router;


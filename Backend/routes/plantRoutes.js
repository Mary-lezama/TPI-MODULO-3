const express = require('express');
const router = express.Router();
const { 
    getAllPlants,
    getPlantById,
    createPlant,
    updatePlant,
    deletePlant
} = require('../controllers/plantController');

const { plantValidator } = require('../middlewares/validators');
const { validationResult } = require('express-validator');

// obtener todas las plantas
router.get('/', getAllPlants)

// obtener una planta por id
router.get('/:id', getPlantById)

// crear una nueva planta con validacion
router.post('/', plantValidator, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    createPlant(req, res);
});

// actualizar una planta existente
router.put('/:id', updatePlant)

// eliminar una planta
router.delete('/:id', deletePlant)

module.exports = router;
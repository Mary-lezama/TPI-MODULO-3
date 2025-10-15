const plantService = require('../services/plantService');

// Obtener todas las plantas
const getAllPlants = async (req, res) => {
  try {
    const plants = await plantService.getAllPlants();
    res.status(200).json({
      success: true,
      message: 'Plantas obtenidas exitosamente',
      data: plants,
      count: plants.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener plantas',
      error: error.message,
    });
  }
};

// Obtener planta  por ID
const getPlantById = async (req, res) => {
  try {
    const plant = await plantService.getPlantById(req.params.id);

    if (!plant) { 
      return res.status(404).json({
        success: false,
        message: 'Planta no encontrada',
      });
  }
  
  res.status(200).json({
    success:true,
    message: 'Planta obtenida exisotamente',
    data: plant,
  });
} catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener planta',
      error: error.message,
    });
  }
};

// Crear planta
const createPlant = async (req, res) => {
  try {
    const newPlant = await plantService.createPlant(req.body);
    res.status(201).json({
      success: true,
      message: 'Planta agregada exitosamente',
      data: newPlant,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear planta',
      error: error.message,
    });
  }
};

// Actualizar planta
const updatePlant = async (req, res) => {
  try {
    const updated = await plantService.updatePlant(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Planta no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Planta actualizada exitosamente',
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Errro al actualizar planta',
      error: error.message,
    });
  }
};

// Eliminar planta 
const deletePlant = async (req, res) => {
  try {
    const deleted = await plantService.deletePlant(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Planta no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Planta eliminada exitosamente',
      data: { id: req.params.id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar planta',
      error: error.message,
    });
  }
};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
};

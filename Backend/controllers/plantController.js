const plantService = require('../services/plantService');

const getAllPlants = async (req, res) => {
  try {
    const plants = await plantService.getAllPlants();
    res.json(plants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPlantById = async (req, res) => {
  try {
    const plant = await plantService.getPlantById(req.params.id);
    if (!plant) return res.status(404).json({ error: 'Planta no encontrada' });
    res.json(plant);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createPlant = async (req, res) => {
  try {
    const newPlant = await plantService.createPlant(req.body);
    res.status(201).json(newPlant);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updatePlant = async (req, res) => {
  try {
    const updated = await plantService.updatePlant(req.params.id, req.body);
    if (!updated) return res.status(404).json({ error: 'Planta no encontrada' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deletePlant = async (req, res) => {
  try {
    const deleted = await plantService.deletePlant(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Planta no encontrada' });
    res.json({ message: 'Planta eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant,
};

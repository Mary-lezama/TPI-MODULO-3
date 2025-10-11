const path = require('path');
const fs = require('fs').promises;
const Plant = require('../models/plant');

const plantsPath = path.join(__dirname, '../data/plants.json');

// Leer todas las plantas
const getAllPlants = async () => {
  const data = await fs.readFile(plantsPath, 'utf-8');
  const plants = JSON.parse(data);
  return plants.map(p => new Plant(p));
};

// Obtener planta por ID
const getPlantById = async (id) => {
  const plants = await getAllPlants();
  const plantData = plants.find(p => p.id === id);
  return plantData || null;
};

// Crear planta
const createPlant = async ({ name, species, price, stock }) => {
  if (!name || !species || !price || !stock) {
    throw new Error('Faltan campos obligatorios');
  }

  const plants = await getAllPlants();
  const newPlant = new Plant({
    id: Date.now().toString(),
    name,
    species,
    price,
    stock
  });

  plants.push(newPlant);
  await fs.writeFile(plantsPath, JSON.stringify(plants, null, 2));
  return newPlant;
};

// Actualizar planta
const updatePlant = async (id, updatedData) => {
  const plants = await getAllPlants();
  const index = plants.findIndex(p => p.id === id);

  if (index === -1) return null;

  plants[index] = { ...plants[index], ...updatedData };
  await fs.writeFile(plantsPath, JSON.stringify(plants, null, 2));
  return plants[index];
};

// Eliminar planta
const deletePlant = async (id) => {
  const plants = await getAllPlants();
  const index = plants.findIndex(p => p.id === id);

  if (index === -1) return null;

  const [deleted] = plants.splice(index, 1);
  await fs.writeFile(plantsPath, JSON.stringify(plants, null, 2));
  return deleted;
};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant
};

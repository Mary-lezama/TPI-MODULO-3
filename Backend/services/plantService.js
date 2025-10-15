const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const Plant = require('../models/plant');

const plantsPath = path.join(__dirname, '../data/plants.json');

// Leer archivo de plantas
const readPlantsFile = async () => {
  try {
    const data = await fs.readFile(plantsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // si el archivo no existe, crear uno vacio
      await fs.writeFile(plantsPath, JSON.stringify([], null, 2));
      return [];
    }
    throw new Error('Error al leer archivo de planta');
  }
};

// Escribir archivo de plantas
const writePlantsFile = async (plants) => {
  try {
    await fs.writeFile(plantsPath, JSON.stringify(plants, null, 2));
  } catch (error) {
    throw new Error('Error al guardar plantas');
  }
};

// Validar que el precio sea un numero positivo
const isValidPrice = (price) => {
  const priceNum = parseFloat(price);
  return !isNaN(priceNum) && priceNum > 0;
};

// Validar que el stock sea un numero entero no negativo
const isValidStock = (stock) => {
  const stockNum = parseInt(stock);
  return !isNaN(stockNum) && stockNum >= 0 && Number.isInteger(stockNum);
};

// Leer todas las plantas
const getAllPlants = async () => {
  const plantsData = await readPlantsFile();
  return plantsData.map(p => new Plant(p));
};

// Obtener planta por ID
const getPlantById = async (id) => {
  const plantsData = await readPlantsFile();
  const plantData = plantsData.find(p => p.id === id);
  return plantData ? new Plant(plantData) : null;
};

// Crear planta
const createPlant = async ({ name, species, price, stock }) => {
  // validar que los campos no esten vacios
  if (!name?.trim() || !species?.trim()) {
    throw new Error('Nombre y Especie son obligatorios');
  }

  // validar precio
  if (price === undefined || price === null || price === '') {
    throw new Error('El precio es obligatorio');
  }

  if (!isValidPrice(price)) {
    throw new Error('El precio debe ser un numero positivo');
  }

  // Validar stock
  if (stock === undefined || stock === null === '') {
    throw new Error('El stock es obligatorio');
  }

  if (!isValidStock(stock)) {
    throw new Error('El stock debe ser un numero entero no negativo');
  }

  const plantsData = await readPlantsFile();

  const newPlant = new Plant({
    id: uuidv4(),
    name: name.trim(),
    species: species.trim(),
    price: parseFloat(price),
    stock: parseInt(stock),
    createdAt: new Date().toISOString()
  });

  plantsData.push(newPlant);
  await writePlantsFile(plantsData);
  return newPlant;
};

// Actualizar planta
const updatePlant = async (id, updatedData) => {
  const plantsData = await readPlantsFile();
  const index = plantsData.findIndex(p => p.id === id);

  if (index === -1) return null;

  // Validar precio si se esta actualizando
  if (updatedData.price !== undefined && updatedData.price !== null && updatedData.price !== '') {
    if (!isValidPrice(updatedData.price)) {
      throw new Error('El precio debe ser un numero positivo');
    }
  }

  // Validar stock si se esta actualizando
  if (updatedData.stock !== undefined && updatedData.stock !== null && updatedData.stock !== '') {
    if (!isValidStock(updatedData.stock)) {
      throw new Error('El stock debe ser un numero entero no negativo');
    }
  }

  // Actualizar solo los campos permitidos
  plantsData[index] = {
    ...plantsData[index],
    name: updatedData.name?.trim() || plantsData[index].name,
    species: updatedData.species?.trim() || plantsData[index].species,
    price: updatedData.price !== undefined ? parseFloat(updatedData.price) : plantsData[index].price,
    stock: updatedData.stock !== undefined ? parseInt(updatedData.stock) : plantsData[index].stock,
    createdAt: new Date().toISOString()
  };

  await writePlantsFile(plantsData);
  return new Plant(plantsData[index]);
};

// Eliminar planta
const deletePlant = async (id) => {
  const plantsData = await readPlantsFile();
  const index = plantsData.findIndex(p => p.id === id);

  if (index === -1) return null;

  const [deleted] = plantsData.splice(index, 1);
  await writePlantsFile(plantsData);
  return new Plant(deleted);
};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant
};
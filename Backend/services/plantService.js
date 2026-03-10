const Plant = require('../models/plant');

// Obtener todas las plantas
const getAllPlants = async () => {
  return await Plant.find();
};

// Obtener planta por ID
const getPlantById = async (id) => {
  return await Plant.findById(id);
};

// Crear planta
const createPlant = async ({ name, species, price, stock }) => {

  if (!name?.trim() || !species?.trim()) {
    throw new Error('Nombre y especie son obligatorios');
  }

  if (price === undefined || price === null || price === '') {
    throw new Error('El precio es obligatorio');
  }

  if (price <= 0) {
    throw new Error('El precio debe ser un numero positivo');
  }

  if (stock === undefined || stock === null || stock === '') {
    throw new Error('El stock es obligatorio');
  }

  if (stock < 0) {
    throw new Error('El stock debe ser un numero entero no negativo');
  }

  const newPlant = new Plant({
    name: name.trim(),
    species: species.trim(),
    price: parseFloat(price),
    stock: parseInt(stock)
  });

  return await newPlant.save();
};

// Actualizar planta
const updatePlant = async (id, updatedData) => {

  if (updatedData.price !== undefined && updatedData.price <= 0) {
    throw new Error('El precio debe ser un numero positivo');
  }

  if (updatedData.stock !== undefined && updatedData.stock < 0) {
    throw new Error('El stock debe ser un numero entero no negativo');
  }

  return await Plant.findByIdAndUpdate(
    id,
    updatedData,
    { new: true }
  );
};

// Eliminar planta
const deletePlant = async (id) => {
  return await Plant.findByIdAndDelete(id);
};

module.exports = {
  getAllPlants,
  getPlantById,
  createPlant,
  updatePlant,
  deletePlant
};
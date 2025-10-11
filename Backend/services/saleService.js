const path = require('path');
const fs = require('fs').promises;
const Sale = require('../models/sale');
const Plant = require('../models/plant');
const Client = require('../models/client');

const salesPath = path.join(__dirname, '../data/sales.json');
const plantsPath = path.join(__dirname, '../data/plants.json');
const clientsPath = path.join(__dirname, '../data/clients.json');

// Leer datos JSON
const readJSON = async (filePath) => {
  const data = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(data);
};

// Escribir datos JSON
const writeJSON = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

// Obtener todas las ventas
const getAllSales = async () => {
  const sales = await readJSON(salesPath);
  return sales.map(s => new Sale(s));
};

// Obtener venta por ID
const getSaleById = async (id) => {
  const sales = await getAllSales();
  return sales.find(s => s.id === id) || null;
};

// Crear venta
const createSale = async ({ clientId, items }) => {
  if (!clientId || !Array.isArray(items) || items.length === 0) {
    throw new Error('Faltan datos de cliente o productos');
  }

  const clients = await readJSON(clientsPath);
  const clientExists = clients.some(c => c.id === clientId);
  if (!clientExists) {
    throw new Error('Cliente no encontrado');
  }

  const plants = await readJSON(plantsPath);
  const updatedPlants = [...plants];
  const saleItems = [];
  let total = 0;

  for (const item of items) {
    const plant = updatedPlants.find(p => p.id === item.plantId);
    if (!plant) {
      throw new Error(`Planta ${item.plantId} no encontrada`);
    }
    if (plant.stock < item.quantity) {
      throw new Error(`Stock insuficiente para ${plant.name}`);
    }

    plant.stock -= item.quantity;
    total += plant.price * item.quantity;
    saleItems.push({ plantId: item.plantId, quantity: item.quantity });
  }

  const sales = await readJSON(salesPath);
  const newSale = new Sale({
    id: Date.now().toString(),
    date: new Date().toISOString(),
    clientId,
    items: saleItems,
    total,
    status: 'pendiente'
  });

  sales.push(newSale);
  await writeJSON(salesPath, sales);
  await writeJSON(plantsPath, updatedPlants);

  return newSale;
};

// Actualizar estado de venta
const updateSaleStatus = async (id, status) => {
  const validStatuses = ['pendiente', 'pagado', 'entregado'];
  if (!validStatuses.includes(status)) {
    throw new Error('Estado inválido');
  }

  const sales = await readJSON(salesPath);
  const index = sales.findIndex(s => s.id === id);
  if (index === -1) return null;

  sales[index].status = status;
  await writeJSON(salesPath, sales);
  return sales[index];
};

// Eliminar venta
const deleteSale = async (id) => {
  const sales = await readJSON(salesPath);
  const filtered = sales.filter(s => s.id !== id);

  if (filtered.length === sales.length) return false;

  await writeJSON(salesPath, filtered);
  return true;
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  updateSaleStatus,
  deleteSale
};

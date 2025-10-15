const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const Sale = require('../models/sale');

const salesPath = path.join(__dirname, '../data/sales.json');
const plantsPath = path.join(__dirname, '../data/plants.json');
const clientsPath = path.join(__dirname, '../data/clients.json');

// Leer archivo JSON con manejo de errores
const readJSON = async (filePath) => {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // si el archivo no existe, crear uno vacio
      await fs.writeFile(filePath, JSON.stringify([], null, 2));
      return[];
    }
    throw new Error(`Error al leer archivo: ${path.basename(filePath)}`);
  }
};

// Escribir archivo JSON
const writeJSON = async (filePath, data) => {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    throw new Error(`Error al guardar archivo: ${path.basename(filePath)}`);
  }
};

// Validar que la cantidad sea numero positivo
const isValidQuantity = (quantity) => {
  const qty = parseInt(quantity);
  return !isNaN(qty) && qty > 0 && Number.isInteger(qty);
};

// Obtener fecha actual en zona horaria Argentina
const getArgentinaDate = () => {
  return new Date().toLocaleString('es-AR', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

// Obtener todas las ventas
const getAllSales = async () => {
  const sales = await readJSON(salesPath);
  return sales.map(s => new Sale(s));
};

// Obtener venta por ID
const getSaleById = async (id) => {
  const sales = await readJSON(salesPath);
  const saleData = sales.find(s => s.id === id);
  return saleData ? new Sale(saleData) : null;
};

// Crear venta
const createSale = async ({ clientId, items }) => {
  // validar cliente
  if (!clientId?.trim()) {
    throw new Error('ID de cliente es obligatorio');
  }

  // Validar items
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Debe incluir al menos un producto en la venta');
  }

  // Verificar que el cliente exista
  const clients = await readJSON(clientsPath);
  const clientExists = clients.some(c => c.id === clientId);
  if (!clientExists) {
    throw new Error('Cliente no encontrado');
  }

  // Procesar items y actualizar stock
  const plants = await readJSON(plantsPath);
  const updatedPlants = [...plants];
  const saleItems = [];
  let total = 0;

  for (const item of items) {
    // validar que el item tenga los campos necesarios
    if (!item.plantId?.trim() || item.quantity === undefined) {
      throw new Error('Cada producto debe tener ID y cantidad');
    }

    // Validar cantidad
    if (!isValidQuantity(item.quantity)) {
      throw new Error(`Cantidad invalida para producto ${item.plantId}`);
    }

    // Buscar la planta
    const plantIndex = updatedPlants.findIndex(p => p.id === item.plantId);
    if (plantIndex === -1) {
      throw new Error(`Planta ${item.plantId} no encontrada`);
    }

    const plant = updatedPlants[plantIndex];

    // Verificar stock
    if (plant.stock < item.quantity) {
      throw new Error(`Stock insuficiente para ${plant.name}. Disponible: ${plant.stock}, Solicitado: ${item.quantity}`);
    }

    // Actualizar stock
    plant.stock -= item.quantity;
    total += plant.price * item.quantity;
    saleItems.push({
      plantId: item.plantId,
      quantity: parseInt(item.quantity),
      price: plant.price
    });
  }

  // Crear nueva venta
  const sales = await readJSON(salesPath);
  const newSale = new Sale({
    id: uuidv4(),
    date: getArgentinaDate(),
    clientId,
    items: saleItems,
    total: parseFloat(total.toFixed(2)),
    status: 'pendiente',
    createdAt: new Date().toISOString()
  });
  
  // Guardar cambios
  sales.push(newSale);
  await writeJSON(salesPath, sales);
  await writeJSON(plantsPath, updatedPlants);

  return newSale;
};

// Actualizar estado de venta
const updateSaleStatus = async (id, status) => {
  // validar estado
  const validStatuses = ['pendiente', 'pagado', 'entregado', 'cancelado'];

  if (!status?.trim()) {
    throw new Error('Estado es obligatorio');
  }

  if (!validStatuses.includes(status.toLowerCase())) {
    throw new Error(`Estado invalido. Estados permitidos: ${validStatuses.join(', ')}`);
  }

  // Buscar y actualizar venta
  const sales = await readJSON(salesPath);
  const index = sales.findIndex(s => s.id === id);

  if (index === -1) return null;

  sales[index].status = status.toLowerCase();
  sales[index].updatedAt = new Date().toISOString();

  await writeJSON(salesPath, sales);
  return new Sale(sales[index]);
};

// Eliminar venta
const deleteSale = async (id) => {
  const sales = await readJSON(salesPath);
  const saleToDelete = sales.find(s => s.id === id);

  if (!saleToDelete) return null;

  // Restaurar stock de los productos
  const plants = await readJSON(plantsPath);
  for (const item of saleToDelete.items) {
    const plantIndex = plants.findIndex(p => p.id === item.plantId);
    if (plantIndex !== -1) {
      plants[plantIndex].stock += item.quantity;
    }
  }

  // Eliminar venta
  const filtered = sales.filter(s => s.id !== id);

  await writeJSON(salesPath, filtered);
  await writeJSON(plantsPath, plants);

  return new Sale(saleToDelete);
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  updateSaleStatus,
  deleteSale
};

const Sale = require('../models/sale');
const Client = require('../models/client');
const Plant = require('../models/plant');

// Validar que la cantidad sea numero positivo entero
const isValidQuantity = (quantity) => {
  const qty = parseInt(quantity);
  return !isNaN(qty) && qty > 0 && Number.isInteger(qty);
};

// Obtener todas las ventas
const getAllSales = async () => {
  return await Sale.find()
    .populate('clientId')   // trae los datos del cliente
    .populate('items.plantId'); // trae los datos de cada planta
};

// Obtener venta por ID
const getSaleById = async (id) => {
  return await Sale.findById(id)
    .populate('clientId')
    .populate('items.plantId');
};

// Crear venta
const createSale = async ({ clientId, items }) => {
  if (!clientId) {
    throw new Error('ID de cliente es obligatorio');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Debe incluir al menos un producto en la venta');
  }

  // Verificar que el cliente exista
  const clientExists = await Client.findById(clientId);
  if (!clientExists) {
    throw new Error('Cliente no encontrado');
  }

  // Procesar items y calcular total
  const saleItems = [];
  let total = 0;

  for (const item of items) {
    if (!item.plantId || item.quantity === undefined) {
      throw new Error('Cada producto debe tener ID y cantidad');
    }

    if (!isValidQuantity(item.quantity)) {
      throw new Error(`Cantidad invalida para producto ${item.plantId}`);
    }

    // Buscar la planta
    const plant = await Plant.findById(item.plantId);
    if (!plant) {
      throw new Error(`Planta ${item.plantId} no encontrada`);
    }

    // Verificar stock
    if (plant.stock < item.quantity) {
      throw new Error(`Stock insuficiente para ${plant.name}. Disponible: ${plant.stock}, Solicitado: ${item.quantity}`);
    }

    // Descontar stock
    await Plant.findByIdAndUpdate(item.plantId, {
      $inc: { stock: -item.quantity }  // $inc resta o suma, con negativo resta
    });

    total += plant.price * item.quantity;
    saleItems.push({
      plantId: item.plantId,
      quantity: parseInt(item.quantity),
    });
  }

  const newSale = new Sale({
    clientId,
    items: saleItems,
    total: parseFloat(total.toFixed(2)),
    status: 'pendiente',
  });

  return await newSale.save();
};

// Actualizar estado de venta
const updateSaleStatus = async (id, status) => {
  const validStatuses = ['pendiente', 'pagado', 'entregado', 'cancelado'];

  if (!status?.trim()) {
    throw new Error('Estado es obligatorio');
  }

  if (!validStatuses.includes(status.toLowerCase())) {
    throw new Error(`Estado invalido. Estados permitidos: ${validStatuses.join(', ')}`);
  }

  return await Sale.findByIdAndUpdate(
    id,
    { status: status.toLowerCase() },
    { new: true }
  );
};

// Eliminar venta y restaurar stock
const deleteSale = async (id) => {
  const sale = await Sale.findById(id);
  if (!sale) return null;

  // Restaurar stock de cada planta
  for (const item of sale.items) {
    await Plant.findByIdAndUpdate(item.plantId, {
      $inc: { stock: item.quantity }  // $inc suma el stock de vuelta
    });
  }

  return await Sale.findByIdAndDelete(id);
};

module.exports = {
  getAllSales,
  getSaleById,
  createSale,
  updateSaleStatus,
  deleteSale,
};
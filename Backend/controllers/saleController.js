const saleService = require('../services/saleService');

// Crear venta
const createSale = async (req, res) => {
  try {
    const newSale = await saleService.createSale(req.body);
    res.status(201).json(newSale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtener todas las ventas
const getAllSales = async (req, res) => {
  try {
    const sales = await saleService.getAllSales();
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Error al leer las ventas' });
  }
};

// Obtener venta por ID
const getSaleById = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);
    if (!sale) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Error al buscar la venta' });
  }
};

// Actualizar estado de venta
const updateSaleStatus = async (req, res) => {
  try {
    const updatedSale = await saleService.updateSaleStatus(req.params.id, req.body.status);
    if (!updatedSale) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json(updatedSale);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Eliminar venta
const deleteSale = async (req, res) => {
  try {
    const deleted = await saleService.deleteSale(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Venta no encontrada' });
    res.json({ message: 'Venta eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la venta' });
  }
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  updateSaleStatus,
  deleteSale
};

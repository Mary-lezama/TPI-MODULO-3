const saleService = require('../services/saleService');

// Crear venta
const createSale = async (req, res) => {
  try {
    const newSale = await saleService.createSale(req.body);
    res.status(201).json({
      success: true,
      message: 'Venta creada exitosamente',
      data: newSale,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear venta',
      error: error.message,
    });
  }
};

// Obtener todas las ventas
const getAllSales = async (req, res) => {
  try {
    const sales = await saleService.getAllSales();
    res.status(200).json({
      success: true,
      message: 'Ventas obtenidas exitosamente',
      data: sales,
      count: sales.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener ventas',
      error: error.message,
    });
  }
};

// Obtener venta por ID
const getSaleById = async (req, res) => {
  try {
    const sale = await saleService.getSaleById(req.params.id);

    if (!sale) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Venta obtenida exitosamente',
      data: sale,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener venta',
      error: error.message,
    });
  }
};

// Actualizar estado de venta
const updateSaleStatus = async (req, res) => {
  try {
    const updatedSale = await saleService.updateSaleStatus(req.params.id, req.body.status);

   if (!updatedSale) {
  return res.status(404).json({
    success: false,
    message: 'Venta no encontrada',
  });
}

res.status(200).json({
  success: true,
  message: 'Estado de venta actualizado exitosamente',
  data: updatedSale,
});
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar estado de venta',
      error: error.message,
    });
  }
};

// Eliminar venta
const deleteSale = async (req, res) => {
  try {
    const deleted = await saleService.deleteSale(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Venta eliminada exitosamente',
      data: { id: req.params.id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar venta',
      error: error.message,
    });
  }
};

module.exports = {
  createSale,
  getAllSales,
  getSaleById,
  updateSaleStatus,
  deleteSale
};

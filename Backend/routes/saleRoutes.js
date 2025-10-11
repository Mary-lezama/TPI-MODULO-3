const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/authMiddleware');
const { createSale, getAllSales, getSaleById, updateSaleStatus, deleteSale } = require('../controllers/saleController');



// Obtener todas las ventas (protegido)
router.get('/', verifyToken, getAllSales);

// Obtener una venta por ID (protegido)
router.get('/:id', verifyToken, getSaleById);

//  Crear una venta (protegido)
router.post('/', verifyToken, createSale);

//  Actualizar estado de una venta (protegido)
router.put('/:id/status', verifyToken, updateSaleStatus);

//  Eliminar una venta (protegido)
router.delete('/:id', verifyToken, deleteSale);

module.exports = router;
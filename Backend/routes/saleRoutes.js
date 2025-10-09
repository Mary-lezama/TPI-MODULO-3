const express = require('express');
const router = express.Router();
const { createSale, getAllSales, getSaleById, updateSaleStatus, deleteSale } = require('../controllers/saleController');

router.get('/', getAllSales);
router.get('/:id', getSaleById);
router.post('/', createSale);
router.put('/:id/status', updateSaleStatus);
router.delete('/:id', deleteSale);

module.exports = router;
const { error } = require('console');
const { readJSON, writeJSON } = require('../services/jsonService');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const Sale = require('../models/sale.js')
const salesPath = path.join(__dirname, '../data/sales.json');
const plantsPath = path.join(__dirname, '../data/plants.json');
const clientsPath = path.join(__dirname, '../data/clients.json');

function createSale(req, res) {
    try {
        const { clientId, items } = req.body;

        if(!clientId || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Faltan datos de cliente o productos' });
        }

        const clients = readJSON(clientsPath);
        const plants = readJSON(plantsPath);
        const sales = readJSON(salesPath);

        const clientsExist = clients.some(c => c.id === clientId);
        if (!clientsExist) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }

        let total = 0;
        const updatedPlants = [...plants];
        const saleItems = [];

        for (const item of items) {
            const plant = updatedPlants.find(p => p.id === item.plantId);
            if (!plant) {
                return res.status(404).json({ error: `Planta ${item.plantId} no encontrada` });
            }
            if (plant.stock < item.quantity) {
                return res.status(400).json({ error: `Stock insufucuiente para ${plant.name} `});
            }

            plant.stock -= item.quantity;
            total += plant.price * item.quantity;
            saleItems.push({ plantId: plantId, quantity: item.quantity });
        }

        const newSale = {
            id: uuidv4(),
            date: new Date().toISOString(),
            clientId,
            items: saleItems,
            total,
            status: 'pendiente'
        };

        sales.push(newSale);
        writeJSON(salesPath, sales);
        writeJSON(plantsPath, updatedPlants);

        res.status(201).json(newSale);
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar la venta' });
    }
}

function getAllSales(req, res) {
    try {
        const sales = readJSON(salesPath);
        res.json(sales);
    } catch (error) {
        res.status(500).json({ errro: 'Error al leer las ventas' });
    }
}

function getSaleById(req, res) {
    try {
        const id = req.params.id;
        const sales = readJSON(salesPath);
        const sale = sales.find(s => s.id === id);

        if (!sale) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        res.json(sale);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar la venta' });
    }
}

function updateSaleStatus(req, res) {
    try {
        const id = req.params.id;
        const { status } = req.body;

        const validStatuses = ['pendiente', 'pagado', 'entregado'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ error: 'Estado invalido' });
        }

        const sales = readJSON(salesPath);
        const index = sales.findIndex(s => s.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        sales[index].status = status;
        writeJSON(salesPath, sales);

        res.json(sales[index]);

        res.json(sales[index]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el estado de la venta' });
    }
}

function deleteSale(req, res) {
    try {
        const id = req.params.id;
        const sales = readJSON(salesPath);
        const filtered = sales.filter(s => s.id !== id);

        if (filtered.length === sales.length) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        writeJSON(salesPath, filtered);
        res.json({ message: 'Venta eliminada conrrectamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar la venta' });
    }
}

function createSale(req, res) {
  try {
    const { clientId, items } = req.body;
    const sales = readJSON(salesPath);

    const total = calcularTotal(items); // suponiendo que tenés esta función
    const newSale = new Sale({
      id: Date.now().toString(),
      date: new Date().toISOString(),
      clientId,
      items,
      total,
      status: 'pendiente'
    });

    sales.push(newSale);
    writeJSON(salesPath, sales);

    res.status(201).json(newSale);
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar la venta' });
  }
}

module.exports = { createSale, getAllSales, getSaleById, updateSaleStatus, deleteSale };
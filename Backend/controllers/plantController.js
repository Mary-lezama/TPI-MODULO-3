const { readJSON, writeJSON } = require('../services/jsonService');
const path = require('path');
const Plant = require('../models/plant');
const fs = require('fs')

const plantsPath = path.join(__dirname, '../data/plants.json');
const { v4: uuidv4 } = require('uuid');
const { error } = require('console');

function createPlant(req, res) {
    try {
        const { name, species, price, stock } = req.body;

        if (!nome || !species || !price || !stock) {
            return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }

        const data = readJSON(plantsPath);

        const newPlant = new Plant({
            id: uuidv4(),
            name,
            species,
            price,
            stock
        });

        data.push(newPlant);
        writeJSON(plantsPath, data);

        res.status(202).json(newPlant);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear la planta' });
    }
}

function getAllPlants(req, res) {
    try {
        const data = readJSON(plantsPath);
        const plants = data.map(p => new Plant(p));
        res.json(plants);
    } catch (error) {
        res.status(500).json({ error: 'Error al leer plantas' });
    }
}

function getPlantById(req, res) {
    try {
        const id = req.params.id;
        const data = readJSON(plantsPath);
        const plantData = data.find(p => p.id === id);

        if(!plantData) {
            return res.status(404).json({ error: 'Planta no encontrada' });
        }

        const plant = new Plant(plantData);
        res.json(plant);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar la planta' });
    }
}

function updatePlant(req, res) {
    try {
        const id = req.params.id;
        const { name, species, price, stock } = req.body;
        const data = readJSON(plantsPath);
        const index = data.findIndex(p => p.id === id);

        if (index === -1) {
            return res.status(404).json({ error: 'Planta no encontrada' });
        }

        data[index] = {
            ...data[index],
            name: name || data[index].name,
            species: species || data[index].species,
            price: price || data[index].price,
            stock: stock || data[index].stock
        };

        writeJSON(plantsPath, data);
        res.json(data[index]);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar la planta' });
    }
}

function deletePlant(req, res) {
    try {
        const id = req.params.id;
        const data = readJSON(plantsPath);
        const filtered = data.filter(p => p.id !== id);

        if (filtered.length === data.length) {
            return res.status(404).json({ error: 'Planta no encontrada' });
        }

        writeJSON(plantsPath, filtered);
        res.json({ message: 'Planta eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar planta' });
    }
}

function createPlant(req, res) {
  try {
    const { name, species, price, stock } = req.body;
    const plants = readJSON(plantsPath);

    const newPlant = new Plant({
      id: Date.now().toString(),
      name,
      species,
      price,
      stock
    });

    plants.push(newPlant);
    writeJSON(plantsPath, plants);

    res.status(201).json(newPlant);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la planta' });
  }
}


module.exports = { getAllPlants, getPlantById, createPlant, updatePlant, deletePlant };
// funcion para listar los clientes
const { readJSON } = require('../services/jsonService');
const path = require('path');
const Client = require('../models/client');
const { uuidv4 } = require('zod');
const { write } = require('fs');
const { de } = require('zod/v4/locales');

const clientsPath = path.join(__dirname, '../data/clients.json');

function createClient(req, res) {
    try {
        const { name, email, phone } = req.body;

        if (!name || !email || !phone) {
            return res.status(400).json({ error: 'Faltan campos obligatorios '});
        }

        const data = readJSON(clientsPath);

        const newClient = new Client({
            id: uuidv4(),
            name,
            email,
            phone
        });

        data.push(newClient);
        writeJSON(clientsPath, data);

        res.status(201).json(newClient);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear cliente' });
    }
}

function getAllClients (req, res) {
    try {
        const data = readJSON(clientsPath)
        const clients = data.map(c => new Client(c));
        res.json(clients)
    } catch(error) {
        res.status(500).json({ error: 'Error al leer los clientes' });
    }
}

function getClientById(req, res) {
    try {
        const id = req.params.id;
        const data = readJSON(clientsPath);
        const clientData = data.find(c => c.id === id);

        if (!clientData) {
            return res.status(404).json({ error: 'Cliente no encontrado '});
        }

        const client = new Client(clientData);
        res.json(client);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el cliente' });
    }
}

function updateClient(req, res) {
    try {
        const id = req.params.id
        const { name, contact } = req.body

        const data = readJSON(clientsPath)
        const index = data.findIndex(c => c.id === id)

        if (index === -1) {
            return res.status(404).json({ error: 'Cliente no encontrado' })
        }

        data[index] = {
            ...data[index],
            name: name || data[index].name,
            contact: contact || data[index].contact
        }

        writeJSON(clientsPath, data)
        res.json(data[index])
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar los clientes' })
    }
}

function deleteCLient(req, res) {
    try {
        const id = req.params.id
        const data = readJSON(clientsPath)
        const filtered = data.filter(c => c.id === !id)

        if (filtered.length === data.length) {
            return res.status(404).json({ error: 'Cliente no encontrado' })
        }

        writeJSON(clientsPath, filtered)
        res.json({ message: 'Cliente eliminado correctamente' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el cliente' })
    }
}

function createClient(req, res) {
  try {
    const { name, contact } = req.body;
    const clients = readJSON(clientsPath);

    const newClient = new Client({
      id: Date.now().toString(),
      name,
      contact
    });

    clients.push(newClient);
    writeJSON(clientsPath, clients);

    res.status(201).json(newClient);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el cliente' });
  }
}


module.exports = { createClient, getAllClients, getClientById, updateClient, deleteCLient };
const path = require('path');
const fs = require('fs').promises;
const Client = require('../models/client');

const clientsPath = path.join(__dirname, '../data/clients.json');

// Leer todos los clientes
const getAllClients = async () => {
  const data = await fs.readFile(clientsPath, 'utf-8');
  const clients = JSON.parse(data);
  return clients.map(c => new Client(c));
};

// Obtener cliente por ID
const getClientById = async (id) => {
  const clients = await getAllClients();
  const clientData = clients.find(c => c.id === id);
  return clientData || null;
};

// Crear cliente
const createClient = async ({ name, email, phone }) => {
  if (!name || !email || !phone) {
    throw new Error('Faltan campos obligatorios');
  }

  const clients = await getAllClients();
  const newClient = new Client({
    id: Date.now().toString(),
    name,
    email,
    phone
  });

  clients.push(newClient);
  await fs.writeFile(clientsPath, JSON.stringify(clients, null, 2));
  return newClient;
};

// Actualizar cliente
const updateClient = async (id, updatedData) => {
  const clients = await getAllClients();
  const index = clients.findIndex(c => c.id === id);

  if (index === -1) return null;

  clients[index] = { ...clients[index], ...updatedData };
  await fs.writeFile(clientsPath, JSON.stringify(clients, null, 2));
  return clients[index];
};

// Eliminar cliente
const deleteClient = async (id) => {
  const clients = await getAllClients();
  const index = clients.findIndex(c => c.id === id);

  if (index === -1) return null;

  const [deleted] = clients.splice(index, 1);
  await fs.writeFile(clientsPath, JSON.stringify(clients, null, 2));
  return deleted;
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};
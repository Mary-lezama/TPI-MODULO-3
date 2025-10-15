const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');
const Client = require('../models/client');
const clientsPath = path.join(__dirname, '../data/clients.json');


// Leer archivo de clientes
readClientsFile = async () => {
  try {
    const data = await fs.readFile(clientsPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {     // ENOENT = "Error NO ENTry" significa: "El archivo no existe"
      // si el archivo no existe, crear uno vacio
      await fs.writeFile(clientsPath, JSON.stringify([], null, 2));
      return [];
    }
    throw new Error('Error al leer archivo de clientes');
  }
};

// Escribir archivo de clientes 
const writeClientsFile = async (clients) => {
  try {
    await fs.writeFile(clientsPath, JSON.stringify(clients, null, 2));
  } catch (error) {
    throw new Error('Error al guardar clientes');
  }
};

// Validar email
// Uso de expresion regular (regex) que permite validar o buscar patrones en strings. En este caso, validamos que un email tenga formato correcto.
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar telefono 
const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  return phoneRegex.test(phone);
};

//Leer todos los clientes
const getAllClients = async () => {
  const clientsData = await readClientsFile();
  return clientsData.map(c => new Client(c));
};

// Obtener cliente por ID
const getClientById = async (id) => {
  const clientsData = await readClientsFile();
  const clientData = clientsData.find(c => c.id === id);
  return clientData ? new Client(clientData) : null;
};

// Crear cliente
const createClient = async ({ name, email, phone }) => {
  // validar que los campos no esten vacios
  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    throw new Error('Todos los campos son obligatorios');
  }

  // Validar formato de email
  if (!isValidEmail(email)) {
    throw new Error('Formato de email invalido');
  }

  // Validar formato de telefono
  if (!isValidPhone(phone)) {
    throw new Error('Formato de telefono invalido (minimo 7 caracteres)');
  }

  const clientsData = await readClientsFile();

  // Verificar que el email no este duplicado
  if(clientsData.some(c => c.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('El email ya esta registrado');
  }

  const newClient = new Client({
    id: uuidv4(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
    createdAt: new Date().toISOString()
  });

  clientsData.push(newClient);
  await writeClientsFile(clientsData);
  return newClient;
};

// Actualizar cliente
const updateClient = async (id, updatedData) => {
  const clientsData = await readClientsFile();
  const index = clientsData.findIndex(c => c.id === id);

  if (index === -1) return null;

  // Validar email si se esta actualizando
  if (updatedData.email) {
    if (!isValidEmail(updatedData.email)) {
      throw new Error('Formato de email invalido');
    }

    // Verificar que no haya otro cliente con ese email
    if (clientsData.some(c => c.id !== id && c.email.toLowerCase() === updatedData.email.toLowerCase())) {
      throw new Error('El email ya esta registrado por otro cliente');
    }
  }

  // Validar telefono si se esta actualizando
  if (updatedData.phone) {
    if (!isValidPhone(updatedData.phone)) {
      throw new Error('Formato de telefono invalido');
    }
  }

  // Actualizar solo los campos permitidos
  clientsData[index] = {
    ...clientsData[index],
    name: updatedData.name?.trim() || clientsData[index].name,
    email: updatedData.email?.trim().toLowerCase() || clientsData[index].email,
    phone: updatedData.phone?.trim() || clientsData[index].phone,
    updatedAt: new Date().toISOString()
  };

  await writeClientsFile(clientsData);
  return new Client(clientsData[index]);
};

// Eliminar cliente
const deleteClient = async (id) => {
  const clientsData = await readClientsFile();
  const index = clientsData.findIndex(c => c.id === id);

  if (index === -1) return null;

  const [deleted] = clientsData.splice(index, 1);
  await writeClientsFile(clientsData);
  return new Client(deleted);
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient
};
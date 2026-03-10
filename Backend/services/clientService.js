const Client = require('../models/client');

// Validar email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validar telefono
const isValidPhone = (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,}$/;
  return phoneRegex.test(phone);
};

// Obtener todos los clientes
const getAllClients = async () => {
  return await Client.find();
};

// Obtener cliente por ID
const getClientById = async (id) => {
  return await Client.findById(id);
};

// Crear cliente
const createClient = async ({ name, email, phone }) => {
  if (!name?.trim() || !email?.trim() || !phone?.trim()) {
    throw new Error('Todos los campos son obligatorios');
  }

  if (!isValidEmail(email)) {
    throw new Error('Formato de email invalido');
  }

  if (!isValidPhone(phone)) {
    throw new Error('Formato de telefono invalido (minimo 7 caracteres)');
  }

  // Verificar email duplicado
  const existing = await Client.findOne({ email: email.trim().toLowerCase() });
  if (existing) {
    throw new Error('El email ya esta registrado');
  }

  const newClient = new Client({
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone.trim(),
  });

  return await newClient.save();
};

// Actualizar cliente
const updateClient = async (id, updatedData) => {
  if (updatedData.email) {
    if (!isValidEmail(updatedData.email)) {
      throw new Error('Formato de email invalido');
    }

    const existing = await Client.findOne({
      email: updatedData.email.toLowerCase(),
      _id: { $ne: id }  // que no sea el mismo cliente
    });
    if (existing) {
      throw new Error('El email ya esta registrado por otro cliente');
    }
  }

  if (updatedData.phone && !isValidPhone(updatedData.phone)) {
    throw new Error('Formato de telefono invalido');
  }

  return await Client.findByIdAndUpdate(
    id,
    {
      name: updatedData.name?.trim(),
      email: updatedData.email?.trim().toLowerCase(),
      phone: updatedData.phone?.trim(),
    },
    { new: true }
  );
};

// Eliminar cliente
const deleteClient = async (id) => {
  return await Client.findByIdAndDelete(id);
};

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
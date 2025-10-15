const clientService = require('../services/clientService');

// Crear cliente
const createClient = async (req, res) => {
  try {
    const newClient = await clientService.createClient(req.body);
    res.status(201).json({
      success: true,
      message: 'Cliente agregado exitosamente',
      data: newClient,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al crear cliente',
      error: error.message,
    });
  }
};

// Obtener todos los clientes
const getAllClients = async (req, res) => {
  try {
    const clients = await clientService.getAllClients();
    res.status(200).json({
      success: true,
      message: 'Clientes obntenidos exitosamente',
      data: clients,
      count: clients.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener clientes',
      error: error.message,
    });
  }
};

// Obtener cliente por ID
const getClientById = async (req, res) => {
  try {
    const client = await clientService.getClientById(req.params.id);

    if (!client) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cliente obtenido exitosamente',
      data: client,
    });
  } catch (error) {
    res. status(500).json({
      success: false,
      message: 'Error al obtener cliente',
      error: error,message,
    });
  }
};

// Actualizar cliente
const updateClient = async (req, res) => {
  try {
    const updated = await clientService.updateClient(req.params.id, req.body);

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cliente actualizado exitosamente',
      data: updated,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al actualizar cliente',
      error: error.message,
    });
  }
};

// Eliminar cliente
const deleteClient = async (req, res) => {
  try {
    const deleted = await clientService.deleteClient(req.params.id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cliente eliminado exitosamente',
      data: { id: req.params.id },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al eliminar cliente',
      error: error.message,
    });
  }
};

module.exports = {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient,
};

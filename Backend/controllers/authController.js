const { registerUser, loginUser, logoutUser } = require('../services/authService');

// Registro de usuario
const register = async (req, res) => {
  try {
    const user = await registerUser(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      dta: user,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al registrar usuario',
      error: error.message,
    });
  }
};

// Login de usuario
const login = async (req, res) => {
  try {
    const token = await loginUser(req.body);
    res.status(200).json({
      success: true,
      message: 'Sesion iniciada exitosamente',
      data: {
        token,
        user,
      },
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Error al iniciar sesion',
      error: error.message,
    });
  }
};

// Logout de usuario
const logout = async (req, res) => {
  try {
    const user = req.user; // obtenido del middleware de verificacion
    await logoutUser(user.id);
    res.status(200).json({
      success: true,
      message: 'Sesion cerrada exitosamente',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al cerrar sesion',
      error: error.message,
    });
  }
};

module.exports = { register, login, logout };
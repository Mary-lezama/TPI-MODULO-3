const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
require('dotenv').config();

// Validar contrasena (minimo 6 caracteres)
const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Validar username (minimo 3 caracteres, solo alfanumericos y guiones)
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_-]{3,}$/;
  return usernameRegex.test(username);
};

// Registro
async function registerUser({ username, password }) {
  if (!username?.trim() || !password?.trim()) {
    throw new Error('Usuario y contraseña son obligatorios');
  }

  if (!isValidUsername(username)) {
    throw new Error('Usuario debe tener minimo 3 caracteres (solo letras, numeros, - y _)');
  }

  if (!isValidPassword(password)) {
    throw new Error('Contrasena debe tener minimo 6 caracteres');
  }

  // Verificar que el usuario no exista
  const exists = await User.findOne({ 
    username: username.trim().toLowerCase() 
  });
  if (exists) {
    throw new Error('Usuario ya esta registrado');
  }

  // Hashear contrasena
  const hashedPassword = bcrypt.hashSync(password, 10);

  const newUser = new User({
    username: username.trim().toLowerCase(),
    password: hashedPassword,
  });

  await newUser.save();

  // Devolver usuario sin password
  return {
    id: newUser._id,
    username: newUser.username,
    message: 'Usuario registrado exitosamente',
  };
}

// Login
async function loginUser({ username, password }) {
  if (!username?.trim() || !password?.trim()) {
    throw new Error('Usuario y contrasena son obligatorios');
  }

  const user = await User.findOne({ 
    username: username.trim().toLowerCase() 
  });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error('Credenciales invalidas');
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no esta configurado');
  }

  // Generar token JWT
  const token = jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  return {
    token,
    user: {
      id: user._id,
      username: user.username,
    },
  };
}

// Logout
async function logoutUser() {
  return {
    message: 'Sesion cerrada exitosamente',
  };
}

module.exports = { registerUser, loginUser, logoutUser };
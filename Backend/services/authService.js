const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const usersPath = path.join(__dirname, '../data/users.json');

// Leer archivo de usuarios
const readUsersFile = async () => {
  try {
    const data = await fs.readFile(usersPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(usersPath, JSON.stringify([], null, 2));
      return [];
    }
    throw new Error('Error al leer archivo de usuarios');
  }
};

// Escribir archivo de usuarios
const writeUsersFile = async (users) => {
  try {
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2));
  } catch (error) {
    throw new Error('Error al guardar usuarios');
  }
};

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
  // validar que los campos no esten vacios
  if (!username?.trim() || !password?.trim()) {
    throw new Error('Usuario y contraseña son obligatorios');
  }

  // Validar formato de username
  if (!isValidUsername(username)) {
    throw new Error('Usuario debe tener minimo 3 caracteres (solo letras, numeros, - y _)');
  }

  // Validar longitud de contrasena
  if (!isValidPassword(password)) {
    throw new Error('Contrasena debe tener minimo 6 caracteres');
  }

  const users = await readUsersFile();

  //Verificar que el usuario no exista
  const exists = users.find(u => u.username.toLowerCase() === username.toLowerCase());
  if (exists) {
    throw new Error('Usuarios ya esta registrado');
  }

  // Hashear contrasena
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = {
    id: uuidv4(),
    username: username.trim().toLowerCase(),
    password: hashedPassword,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  await writeUsersFile(users);

  // Devolver usuario sin password
  return {
    id: newUser.id,
    username: newUser.username,
    message: 'Usuario registrado exitosamente',
  };
}

// Login
async function loginUser({ username, password }) {
  // validar que los campos no esten vacios
  if (!username?.trim() || !password?.trim()) {
    throw new Error('Usuario y contrasena son obligatorios');
  }

  const users = await readUsersFile();
  const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error('Credenciales invalidas');
  }

  // Verificar  que JWT_SECRET esta configurado
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET no esta configurado')
  }

  // Generar token JWT
  const token = jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // Devolver token y datos del usuario (sin password)
  return {
    token,
    user: {
      id: user.id,
      username:user.username,
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



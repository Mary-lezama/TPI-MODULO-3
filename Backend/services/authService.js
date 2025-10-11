const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { readJSON, writeJSON } = require('./jsonService');
const path = require('path');

const usersPath = path.join(__dirname, '../data/users.json');
const SECRET = 'la_clave_secreta'; // podés moverlo a .env más adelante

// Registro
async function registerUser({ username, password }) {
  const users = readJSON(usersPath);

  const exists = users.find(u => u.username === username);
  if (exists) throw new Error('Usuario ya existe');

  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { id: Date.now().toString(), username, password: hashedPassword };

  users.push(newUser);
  writeJSON(usersPath, users);

  return { message: 'Usuario registrado con éxito', username };
}

// Login
async function loginUser({ username, password }) {
  const users = readJSON(usersPath);
  const user = users.find(u => u.username === username);

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new Error('Credenciales inválidas');
  }

  const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' });
  return token;
}

module.exports = { registerUser, loginUser };

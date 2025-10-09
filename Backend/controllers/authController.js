const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { readJSON, writeJSON } = require('../services/jsonService')
const path = require('path')
const { use } = require('react')

const usersPath = path.join(__dirname, '..data/users.json')
const SECRET = 'la_clave_secreta'

function register(req, res) {
    try {
        const { username, password } = req.body
        const users = readJSON(usersPath)

        const exists = users.find(u => u.username === username)
        if (exists) {
            return res.status(400).json({ error: 'Usuario ya existe' })
        }

        const hashedPassword = bcrypt.hashSync(password, 10)
        const newUser = { id: Date.now().toString(), username, password: hashedPassword } 

        users.push(newUser)
        writeJSON(usersPath, users)

        res.status(201).json({ message: 'Usuario registrado' })
    } catch (error) {
        res.status(500).json({ error: ' Error al registrar usuario' })
    }
}

function login(req, res) {
    try {
        const { username, password } = req.body
        const users = readJSON(usersPath)

        const user = users.find(u => u.username === user)
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ error: 'Credenciales invalidas' })
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET, { expiresIn: '1h' })
        res.json({ token })
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesion' })
    }
}

module.exports = { register, login }
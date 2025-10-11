const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

// 🔐 Rutas públicas
router.post('/register', register);
router.post('/login', login);

// 🔒 Ruta protegida: para verificar si el token es válido
router.get('/verify', verifyToken, (req, res) => {
  res.json({ message: 'Token válido', user: req.user });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const { authValidator } = require('../middlewares/validators');
const handleValidationErrors = require('../middlewares/handleValidationErrors');
const verifyToken = require('../middlewares/authMiddleware');
const { register, login } = require('../controllers/authController');

// 🔒 Rutas pulicas

// Registro de nuevo usuario
router.post('/register', authValidator, handleValidationErrors, register);

// Login de usuario
router.post('/login', authValidator, handleValidationErrors, login);

// 🔒 Rutas protegidas

// Verificar si el token es valido
router.get('/verify', verifyToken, (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token valido',
    data: req.user
  });
});

module.exports = router;
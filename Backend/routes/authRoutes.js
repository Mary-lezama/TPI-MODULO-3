const express = require('express')
const router = express.Router()
const { register, login } = require('../controllers/authController')
const { verifyToken } = require('../middlewares/authMiddleware')

router.post('/register', register)
router.post('/login', login)
router.post('/', verifyToken, createPlant)

module. exports = router
const { body } = require('express-validator');

// Validador para plantas 
const plantValidator = [
    body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim()
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  
  body('species')
    .notEmpty().withMessage('La especie es obligatoria')
    .trim()
    .isLength({ min: 2 }).withMessage('La especie debe tener al menos 2 caracteres'),
  
  body('price')
    .notEmpty().withMessage('El precio es obligatorio')
    .isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
  
  body('stock')
    .notEmpty().withMessage('El stock es obligatorio')
    .isInt({ min: 0 }).withMessage('El stock debe ser un numero entero no negativo'),
];

// Validator para clientes
const clientValidator = [
    body('name')
    .notEmpty().withMessage('El nombre es obligatorio')
    .trim()
    .isLength({ min: 2 }).withMessage('El nombre debe tener al menos 2 caracteres'),
  
  body('email')
    .notEmpty().withMessage('El email es obligatorio')
    .trim()
    .isEmail().withMessage('Debe ser un email valido')
    .normalizeEmail(),
  
  body('phone')
    .notEmpty().withMessage('El telefono es obligatorio')
    .trim()
    .isLength({ min: 7 }).withMessage('El telefono debe tener al menos 7 caracteres'),
];

// Validator para ventas 
const saleValidator = [
  body('clientId')
    .notEmpty().withMessage('El ID del cliente es obligatorio')
    .trim(),
  
  body('items')
    .isArray({ min: 1 }).withMessage('Debe incluir al menos un producto')
    .custom((items) => {
      // Validar que cada item tenga plantId y quantity
      for (const item of items) {
        if (!item.plantId || !item.quantity) {
          throw new Error('Cada producto debe tener plantId y quantity');
        }
        if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
          throw new Error('La cantidad debe ser un numero entero positivo');
        }
      }
      return true;
    }),
];

// Validador para autenticacion (registro y login)
const authValidator = [
  body('username')
    .notEmpty().withMessage('El usuario es obligatorio')
    .trim()
    .isLength({ min: 3 }).withMessage('El usuario debe tener al menos 3 caracteres')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('El usuario solo puede contener letras, numeros, - y _'),
  
  body('password')
    .notEmpty().withMessage('La contrasena es obligatoria')
    .isLength({ min: 6 }).withMessage('La contrasena debe tener al menos 6 caracteres'),
];

module.exports = {
    plantValidator, 
    clientValidator,
    saleValidator,
    authValidator
};
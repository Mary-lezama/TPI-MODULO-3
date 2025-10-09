const { body } = require('express-validator')

const plantValidator = [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('species').notEmpty().withMessage('La especie es obligatoria'),
    body('price').isFloat({ gt: 0 }).withMessage('El precio debe ser mayor a 0'),
    body('stock').isInt({ min: 0 }).withMessage('El stock debe ser un numero entero positivo')
];

const clientValidator = [
    body('name').notEmpty().withMessage('El nombre es obligatorio'),
    body('contact').notEmpty().withMessage('El contacto es obligatorio')
];

module.exports = { plantValidator, clientValidator }
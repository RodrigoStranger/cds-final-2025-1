const express = require('express');
const ProductoController = require('../controllers/ProductoController');

const router = express.Router();

// Ruta para crear un nuevo producto
router.post('/', ProductoController.create);

// Ruta para verificar si un producto existe por nombre
router.get('/existe/:nombre', ProductoController.existsByNombre);

module.exports = router;
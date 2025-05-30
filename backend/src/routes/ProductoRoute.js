const express = require('express');
const ProductoController = require('../controllers/ProductoController');

const router = express.Router();

// Ruta para crear un nuevo producto
router.post('/', ProductoController.create);

// Ruta para obtener todos los productos
router.get('/', ProductoController.getAll);

// Ruta para obtener productos no disponibles (agotados)
router.get('/no-disponibles', ProductoController.getNoDisponibles);

// Ruta para verificar si un producto existe por nombre
router.get('/existe-nombre/:nombre', ProductoController.existsByNombre);

// Ruta para verificar si un producto existe por ID
router.get('/existe-id/:id', ProductoController.existsById);

// Ruta para obtener un producto por su ID
router.get('/:id', ProductoController.getById);

module.exports = router;
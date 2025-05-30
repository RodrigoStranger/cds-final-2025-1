const express = require('express');
const ProductoController = require('../controllers/ProductoController');

const router = express.Router();

// Ruta para crear un nuevo producto
router.post('/', ProductoController.AgregarProducto);

// Ruta para obtener todos los productos
router.get('/', ProductoController.ObtenerTodosLosProductos);

// Ruta para obtener productos no disponibles (agotados)
router.get('/no-disponibles', ProductoController.ObtenerTodosLosProductosNoDisponibles);

// Ruta para verificar si un producto existe por nombre
router.get('/existe-nombre/:nombre', ProductoController.verificarNombreProducto);

// Ruta para verificar si un producto existe por ID
router.get('/existe-id/:id', ProductoController.verificarIdProducto);

// Ruta para obtener un producto por su ID
router.get('/:id', ProductoController.ObtenerProductoPorId);

// Ruta para actualizar un producto existente
router.put('/:id', ProductoController.ActualizarProducto);

module.exports = router;
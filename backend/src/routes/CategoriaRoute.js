const express = require('express');
const CategoriaController = require('../controllers/CategoriaController');

const router = express.Router();

// Ruta para crear una nueva categoria
router.post('/', CategoriaController.AgregarCategoria);

// Ruta para obtener todas las categorias
router.get('/', CategoriaController.ObtenerTodasLasCategorias);

// Ruta para obtener una categoria por su ID
router.get('/:id', CategoriaController.ObtenerCategoriaPorId);

// Ruta para actualizar una categoria existente
router.put('/:id', CategoriaController.ActualizarCategoria);

// Ruta para verificar si una categoria existe por nombre
router.get('/existe-nombre/:nombre', CategoriaController.verificarNombreCategoria);

// Ruta para verificar si una categoria existe por ID
router.get('/existe-id/:id', CategoriaController.verificarIdCategoria);

module.exports = router;
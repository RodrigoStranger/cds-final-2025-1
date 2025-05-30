const express = require('express');
const LineaController = require('../controllers/LineaController');

const router = express.Router();

// Ruta para crear una nueva línea
router.post('/', LineaController.AgregarLinea);

// Ruta para obtener todas las líneas
router.get('/', LineaController.ObtenerTodasLasLineas);

// Ruta para obtener una línea por su ID
router.get('/:id', LineaController.ObtenerLineaPorId);

// Ruta para actualizar una línea existente
router.put('/:id', LineaController.ActualizarLinea);

// Ruta para verificar si una línea existe por nombre
router.get('/existe-nombre/:nombre', LineaController.verificarNombreLinea);

// Ruta para verificar si una línea existe por ID
router.get('/existe-id/:id', LineaController.verificarIdLinea);

module.exports = router;
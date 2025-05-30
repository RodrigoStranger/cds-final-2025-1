const express = require('express');
const LineaController = require('../controllers/LineaController');

const router = express.Router();

// Ruta para verificar si ya existe una línea con el nombre especificado
router.get('/existe-nombre/:nombre', LineaController.verificarNombreLinea);

// Ruta para verificar si ya existe una línea con el id especificado
router.get('/existe-id/:id', LineaController.verificarIdLinea);

module.exports = router;
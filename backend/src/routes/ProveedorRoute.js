const express = require('express');
const ProveedorController = require('../controllers/ProveedorController');

const router = express.Router();

// Ruta para obtener todos los proveedores
router.get('/', ProveedorController.ObtenerTodosLosProveedores);

module.exports = router;
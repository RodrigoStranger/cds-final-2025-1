const express = require('express');
const ProveedorController = require('../controllers/ProveedorController');

const router = express.Router();

// Ruta para agregar un nuevo proveedor
router.post('/', ProveedorController.AgregarProveedor);

// Ruta para obtener todos los proveedores
router.get('/', ProveedorController.ObtenerTodosLosProveedores);

// Ruta para verificar si ya existe un proveedor mediante su ruc
router.get('/existe-ruc/:ruc', ProveedorController.verificarRucProveedor);

// Ruta para verificar si ya existe un proveedor mediante su nombre
router.get('/existe-nombre/:nombre', ProveedorController.verificarNombreProveedor);

// Ruta para obtener un proveedor por su ruc
router.get('/:ruc', ProveedorController.ObtenerProveedorPorRUC);

// Ruta para actualizar un proveedor existente
router.put('/:ruc', ProveedorController.ActualizarProveedor);

module.exports = router;
const express = require('express');
const ProductoController = require('../controllers/ProductoController');

const router = express.Router();

// Ruta para crear un nuevo producto
router.post('/productos', ProductoController.create);

module.exports = router;
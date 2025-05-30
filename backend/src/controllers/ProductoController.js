const Product = require('../models/Producto');

const ProductoController = {
  // Crear un nuevo producto
  async create(req, res) {
    try {
      const productData = req.body;
      await Product.create(productData);
      res.status(201).json({
        resultado: true,
        mensaje: 'Producto creado exitosamente'
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        resultado: false,
        mensaje: 'Error al crear el producto'
      });
    }
  }
};

module.exports = ProductoController;
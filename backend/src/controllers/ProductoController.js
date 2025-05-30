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
  },
  
  // Verificar si un producto existe por nombre
  async existsByNombre(req, res) {
    try {
      const { nombre } = req.params;
      
      if (!nombre) {
        return res.status(400).json(false);
      }
      const existe = await Product.existsByNombre(nombre);
      
      if (existe) {
        return res.status(200).json({
          resultado: true,
          mensaje: 'Ya existe el producto'
        });
      }
      // Devolver objeto con resultado false cuando el producto no existe
      res.status(200).json({ resultado: false });
    } catch (error) {
      res.status(500).json(false);
    }
  }
};

module.exports = ProductoController;
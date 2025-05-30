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
      res.status(200).json({ resultado: false });
    } catch (error) {
      res.status(500).json(false);
    }
  },
  
  // Verificar si un producto existe por su ID
  async existsById(req, res) {
    try {
      const { id } = req.params;
      const existe = await Product.existsById(parseInt(id));
      if (existe) {
        return res.status(200).json({
          resultado: true
        });
      }
      res.status(200).json({ 
        resultado: false, 
        mensaje: 'No se encontró el producto' 
      });
      
    } catch (error) {
      res.status(500).json({ 
        resultado: false, 
        mensaje: 'Error al buscar el producto' 
      });
    }
  },
  
  // Obtener todos los productos disponibles
  async getAll(_req, res) {
    try {
      const productos = await Product.getAll();
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json([]);
    }
  },
  
  // Obtener todos los productos no disponibles (agotados)
  async getNoDisponibles(_req, res) {
    try {
      const productos = await Product.getNoDisponibles();
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json([]);
    }
  }
};

module.exports = ProductoController;
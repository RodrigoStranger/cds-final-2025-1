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
      // Validar que el ID sea un número entero válido
      if (!/^\d+$/.test(id)) {
        return res.status(200).json({
          resultado: false,
          mensaje: 'id de producto inválido'
        });
      }
      const idNumero = parseInt(id, 10);
      const existe = await Product.existsById(idNumero);
      return res.status(200).json({
        resultado: !!existe
      });
    } catch (error) {
      console.error('Error en existsById:', error);
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
  },
  
  // Obtener un producto por su ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      // Validar que el ID sea un número entero válido
      if (!/^\d+$/.test(id)) {
        return res.status(200).json({
          resultado: false,
          mensaje: 'id de producto inválido'
        });
      }
      const producto = await Product.getById(parseInt(id));
      res.status(200).json(producto);
    } catch (error) {
      res.status(500).json({
        resultado: false,
      });
    }
  },
  
  // Actualizar un producto existente
  async update(req, res) {
    try {
      const { id } = req.params;
      const productData = req.body;
      // Validar que el ID sea un número entero válido
      if (!/^\d+$/.test(id)) {
        return res.status(400).json({
          resultado: false,
          mensaje: 'ID de producto inválido'
        });
      }
      // Validar campos requeridos
      const requiredFields = ['nombre', 'precio_compra', 'precio_venta', 'stock', 'estado'];
      const missingFields = requiredFields.filter(field => !productData[field]);
      
      if (missingFields.length > 0) {
        return res.status(400).json({
          resultado: false,
          mensaje: `Faltan campos requeridos: ${missingFields.join(', ')}`
        });
      }
      // Validar que el estado sea válido
      if (!['disponible', 'agotado'].includes(productData.estado)) {
        return res.status(400).json({
          resultado: false,
          mensaje: 'El estado debe ser "disponible" o "agotado"'
        });
      }
      // Verificar si el producto existe
      const existe = await Product.existsById(parseInt(id));
      if (!existe) {
        return res.status(404).json({
          resultado: false,
          mensaje: 'Producto no encontrado'
        });
      }
      // Actualizar el producto
      const actualizado = await Product.update(parseInt(id), productData);
      if (actualizado) {
        return res.status(200).json({
          mensaje: `Producto ${productData.nombre} actualizado correctamente`
        });
      }
      res.status(400).json({
        mensaje: 'No se pudo actualizar el producto'
      });
    } catch (error) {
      console.error('Error en update:', error);
      res.status(500).json({
        resultado: false,
        mensaje: 'Error al actualizar el producto'
      });
    }
  }
};

module.exports = ProductoController;
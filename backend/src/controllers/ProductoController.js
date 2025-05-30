const Product = require('../models/Producto');

const ProductoController = {
  // Crear un nuevo producto
  async AgregarProducto(req, res) {
    try {
      const productData = req.body;
      await Product.AgregarProducto(productData);
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
  async verificarNombreProducto(req, res) {
    try {
      const { nombre } = req.params;
      if (!nombre) {
        return res.status(400).json(false);
      }
      const existe = await Product.verificarNombreProducto(nombre);
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
  async verificarIdProducto(req, res) {
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
      const existe = await Product.verificarIdProducto(idNumero);
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
  async ObtenerTodosLosProductos(_req, res) {
    try {
      const productos = await Product.ObtenerTodosLosProductos();
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json([]);
    }
  },
  
  // Obtener todos los productos no disponibles (agotados)
  async ObtenerTodosLosProductosNoDisponibles(_req, res) {
    try {
      const productos = await Product.ObtenerTodosLosProductosNoDisponibles();
      res.status(200).json(productos);
    } catch (error) {
      res.status(500).json([]);
    }
  },
  
  // Obtener un producto por su ID
  async ObtenerProductoPorId(req, res) {
    try {
      const { id } = req.params;
      // Validar que el ID sea un número entero válido
      if (!/^\d+$/.test(id)) {
        return res.status(200).json({
          resultado: false,
          mensaje: 'id de producto inválido'
        });
      }
      const producto = await Product.ObtenerProductoPorId(parseInt(id));
      res.status(200).json(producto);
    } catch (error) {
      res.status(500).json({
        resultado: false,
      });
    }
  },
  
  // Actualizar un producto existente
  async ActualizarProducto(req, res) {
    try {
      const { id } = req.params;
      // Validar que el ID sea un número entero válido
      if (!/^\d+$/.test(id)) {
        return res.status(200).json({
          resultado: false,
          mensaje: 'id de producto inválido'
        });
      }
      const productData = req.body;
      // Actualizar el producto
      const actualizado = await Product.ActualizarProducto(parseInt(id), productData);
      if (actualizado) {
        return res.status(200).json({
          mensaje: `Producto actualizado correctamente`
        });
      }
      res.status(400).json({
        mensaje: 'No se pudo actualizar el producto'
      });
    } catch (error) {
      res.status(500).json({
        mensaje: 'Error al actualizar el producto'
      });
    }
  }
};

module.exports = ProductoController;
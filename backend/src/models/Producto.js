const database = require('../config/Database');

class Product {
  // Método para agregar un nuevo producto usando el procedimiento almacenado
  static async AgregarProducto(productData) {
    try {
      const { 
        nombre, 
        descripcion = null, // El producto puede tener o no descripcion
        precio_compra, 
        precio_venta, 
        stock, 
        cod_categoria = null, // El producto puede tener o no categoria
        cod_linea = null // El producto puede tener o no linea
      } = productData;
      const sql = `CALL AgregarProducto(?, ?, ?, ?, ?, ?, ?)`;
      const params = [
        nombre,
        descripcion,
        precio_compra,
        precio_venta,
        stock,
        cod_categoria,
        cod_linea
      ];
      const [result] = await database.pool.query(sql, params);
      return result[0];
    } catch (error) {
      console.error('Error en Producto.create:', error);
      throw error;
    }
  }
  
  // Verifica si ya existe un producto con el nombre especificado
  static async verificarNombreProducto(nombre) {
    try {
      const sql = `SELECT EXISTS(SELECT 1 FROM Productos WHERE LOWER(nombre) = LOWER(?)) as existe`;
      const [rows] = await database.pool.query(sql, [nombre]);
      return Boolean(rows[0]?.existe);
    } catch (error) {
      console.error('Error en Producto.verificarNombreProducto:', error);
      throw error;
    }
  }

  // Verifica si existe un producto por su ID
  static async verificarIdProducto(cod_producto) {
    try {
      const sql = `SELECT EXISTS(SELECT 1 FROM Productos WHERE cod_producto = ?) as existe`;
      const [rows] = await database.pool.query(sql, [cod_producto]);
      return Boolean(rows[0]?.existe);
    } catch (error) {
      console.error('Error en Producto.verificarIdProducto:', error);
      throw error;
    }
  }

  // Obtiene todos los productos disponibles con información relacionada
  static async ObtenerTodosLosProductos() {
    try {
      const sql = `CALL ObtenerTodosLosProductos()`;
      const [results] = await database.pool.query(sql);
      return results[0]; // Retorna solo el primer conjunto de resultados
    } catch (error) {
      console.error('Error en Producto.ObtenerTodosLosProductos:', error);
      throw error;
    }
  }

  // Obtiene todos los productos no disponibles (agotados) con información relacionada
  static async ObtenerTodosLosProductosNoDisponibles() {
    try {
      const sql = `CALL ObtenerTodosLosProductosNoDisponibles()`;
      const [results] = await database.pool.query(sql);
      return results[0]; // Retorna solo el primer conjunto de resultados
    } catch (error) {
      console.error('Error en Producto.getNoDisponibles:', error);
      throw error;
    }
  }

  // Obtiene un producto por su ID con información relacionada
  static async ObtenerProductoPorId(cod_producto) {
    try {
      const sql = `CALL ObtenerProductoPorId(?)`;
      const [results] = await database.pool.query(sql, [cod_producto]);
      // Devolver el primer resultado o null si no se encuentra
      return results[0] ? results[0][0] : null;
    } catch (error) {
      console.error('Error en Producto.getById:', error);
      throw error;
    }
  }

  // Actualiza un producto existente
  static async ActualizarProducto(cod_producto, productData) {
    try {
      const { 
        nombre, 
        descripcion = null, // El producto puede tener o no descripcion
        precio_compra, 
        precio_venta, 
        stock, 
        estado,
        cod_categoria = null, // El producto puede tener o no categoria
        cod_linea = null // El producto puede tener o no linea
      } = productData;
      
      const sql = `CALL ActualizarProducto(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const params = [
        cod_producto,
        nombre,
        descripcion,
        precio_compra,
        precio_venta,
        stock,
        estado,
        cod_categoria,
        cod_linea
      ];
      
      const [result] = await database.pool.query(sql, params);
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error en Producto.update:', error);
      throw error;
    }
  }
}

module.exports = Product;
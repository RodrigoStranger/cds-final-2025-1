const database = require('../config/Database');

class Product {
  // Método para agregar un nuevo producto usando el procedimiento almacenado
  static async create(productData) {
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
  static async existsByNombre(nombre) {
    try {
      const sql = `SELECT EXISTS(SELECT 1 FROM Productos WHERE nombre = ?) as existe`;
      const [rows] = await database.pool.query(sql, [nombre]);
      
      // La consulta devuelve 1 si existe, 0 si no existe
      // Convertimos a booleano explícitamente
      return Boolean(rows[0]?.existe);
    } catch (error) {
      console.error('Error en Producto.existsByNombre:', error);
      throw error;
    }
  }
}

module.exports = Product;
const database = require('../config/Database');

class Product {
  // Método para agregar un nuevo producto usando el procedimiento almacenado
  static async create(productData) {
    try {
      const { 
        nombre, 
        descripcion = null, 
        precio_compra, 
        precio_venta, 
        stock, 
        cod_categoria = null, 
        cod_linea = null 
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
}

module.exports = Product;
const database = require('../config/Database');

class Proveedor {
    static async ObtenerTodosLosProveedores() {
        try {
            const sql = `CALL ObtenerTodosLosProveedores()`;
            const [results] = await database.pool.query(sql);
            return results[0]; // Retorna solo el primer conjunto de resultados
        } catch (error) {
            console.error('Error en Proveedor.ObtenerTodosLosProveedores:', error);
            throw error;
        }
    }
}

module.exports = Proveedor;
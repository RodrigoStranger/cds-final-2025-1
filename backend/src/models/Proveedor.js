const database = require('../config/Database');

class Proveedor {
    // Obtener todos los proveedores
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

    // Obtener un proveedor por su ruc
    static async ObtenerProveedorPorRUC(ruc) {
        try {
            const sql = `CALL ObtenerProveedorPorRUC(?)`;
            const [results] = await database.pool.query(sql, [ruc]);
            return results[0]; // Retorna solo el primer conjunto de resultados
        } catch (error) {
            console.error('Error en Proveedor.ObtenerProveedorPorRuc:', error);
            throw error;
        }
    }
    
    // Verificar si ya existe un proveedor mediante su ruc
    static async verificarRucProveedor(ruc) {
        try {
            const sql = `SELECT EXISTS(SELECT 1 FROM Proveedores WHERE ruc = ?) as existe`;
            const [rows] = await database.pool.query(sql, [ruc]);
            return Boolean(rows[0]?.existe);
        } catch (error) {
            console.error('Error en Proveedor.verificarRucProveedor:', error);
            throw error;
        }
    }

    // Verificar si ya existe un proveedor mediante su nombre
    static async verificarNombreProveedor(nombre) {
        try {
            const sql = `SELECT EXISTS(SELECT 1 FROM Proveedores WHERE nombre = ?) as existe`;
            const [rows] = await database.pool.query(sql, [nombre]);
            return Boolean(rows[0]?.existe);
        } catch (error) {
            console.error('Error en Proveedor.verificarNombreProveedor:', error);
            throw error;
        }
    }

    // Agregar un nuevo proveedor
    static async AgregarProveedor(ruc, nombre, telefonoProveedor) {
        try {
            const sql = `CALL AgregarProveedor(?, ?, ?)`;
            await database.pool.query(sql, [ruc, nombre, telefonoProveedor]);
            return { success: true, message: 'Proveedor agregado correctamente' };
        } catch (error) {
            console.error('Error en Proveedor.AgregarProveedor:', error);
            throw error;
        }
    }

    // Actualizar un proveedor existente
    static async ActualizarProveedor(ruc, nombre, telefonoProveedor) {
        try {
            const sql = `CALL ActualizarProveedor(?, ?, ?)`;
            await database.pool.query(sql, [ruc, nombre, telefonoProveedor]);
            return { success: true, message: 'Proveedor actualizado correctamente' };
        } catch (error) {
            console.error('Error en Proveedor.ActualizarProveedor:', error);
            throw error;
        }
    }
}

module.exports = Proveedor;
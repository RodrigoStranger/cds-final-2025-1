const database = require('../config/Database');

// Linea model with all required methods
class Linea {
    // Verifica si ya existe una linea con el nombre especificado (case insensitive)
    static async existeLineaPorNombre(nombreLinea) {
        try {
            const [results] = await database.pool.query(
                'SELECT 1 FROM Lineas WHERE LOWER(nombre_linea) = LOWER(?) LIMIT 1',
                [nombreLinea]
            );
            return results.length > 0;
        } catch (error) {
            console.error('Error en Linea.existeLineaPorNombre:', error);
            throw error;
        }
    }

    // Verifica si existe ese id en la tabla Lineas
    static async existeLineaPorId(idLinea) {
        try {
            const [results] = await database.pool.query(
                'SELECT 1 FROM Lineas WHERE cod_linea = ? LIMIT 1',
                [idLinea]
            );
            return results.length > 0;
        } catch (error) {
            console.error('Error en Linea.existeLineaPorId:', error);
            throw error;
        }
    }

    // Agrega una nueva línea a la base de datos
    static async AgregarLinea(lineaData) {
        try {
            const {
                ruc,
                nombre_linea,
                
            } = lineaData;
            const sql = `CALL AgregarLinea(?, ?)`;
            const params = [
                ruc,
                nombre_linea,
            ];
            const [result] = await database.pool.query(sql, params);
            return result[0];
        } catch (error) {
            console.error('Error en Linea.AgregarLinea:', error);
            throw error;
        }
    }

    static async ObtenerTodasLasLineas() {
        try {
            const sql = `CALL ObtenerTodasLasLineas()`;
            const [results] = await database.pool.query(sql);
            return results[0]; // Retorna solo el primer conjunto de resultados
        } catch (error) {
            console.error('Error en Linea.ObtenerTodasLasLineas:', error);
            throw error;
        }
    }

    static async ObtenerLineaPorId(idLinea) {
        try {
            const sql = `CALL ObtenerLineaPorId(?)`;
            const [results] = await database.pool.query(sql, [idLinea]);
            return results[0] ? results[0][0] : null;
        } catch (error) {
            console.error('Error en Linea.ObtenerLineaPorId:', error);
            throw error;
        }
    }

    static async ActualizarLinea(idLinea, lineaData) {
        try {
            const {
                ruc = null,
                nombre_linea,
            } = lineaData;
            const sql = `CALL ActualizarLinea(?, ?, ?)`;
            const params = [
                idLinea,
                ruc,
                nombre_linea,
            ];
            const [result] = await database.pool.query(sql, params);
            return result[0];
        } catch (error) {
            console.error('Error en Linea.ActualizarLinea:', error);
            throw error;
        }
    }
}

module.exports = Linea;
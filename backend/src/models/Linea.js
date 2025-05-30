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
}

module.exports = Linea;
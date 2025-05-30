const database = require('../config/Database');

class Categoria {
    static async existeCategoriaPorNombre(nombreCategoria) {
        try {
            const [results] = await database.pool.query(
                'SELECT 1 FROM Categorias WHERE LOWER(nombre) = LOWER(?) LIMIT 1',
                [nombreCategoria]
            );
            return results.length > 0;
        } catch (error) {
            console.error('Error en Categoria.existeCategoriaPorNombre:', error);
            throw error;
        }
    }

    static async existeCategoriaPorId(idCategoria) {
        try {
            const [results] = await database.pool.query(
                'SELECT 1 FROM Categorias WHERE cod_categoria = ? LIMIT 1',
                [idCategoria]
            );
            return results.length > 0;
        } catch (error) {
            console.error('Error en Categoria.existeCategoriaPorId:', error);
            throw error;
        }
    }

    static async ObtenerTodasLasCategorias() {
        try {
            const sql = `CALL ObtenerTodasLasCategorias()`;
            const [results] = await database.pool.query(sql);
            return results[0]; // Retorna solo el primer conjunto de resultados
        } catch (error) {
            console.error('Error en Categoria.ObtenerTodasLasCategorias:', error);
            throw error;
        }
    }

    static async ObtenerCategoriaPorId(idCategoria) {
        try {
            const sql = `CALL ObtenerCategoriaPorId(?)`;
            const [results] = await database.pool.query(sql, [idCategoria]);
            return results[0] ? results[0][0] : null;
        } catch (error) {
            console.error('Error en Categoria.ObtenerCategoriaPorId:', error);
            throw error;
        }
    }
}

module.exports = Categoria;
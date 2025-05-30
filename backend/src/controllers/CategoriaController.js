const Categoria = require('../models/Categoria');

class CategoriaController {
    // Verifica si ya existe una categoria con el nombre especificado
    static async verificarNombreCategoria(req, res) {
        try {
            const { nombre } = req.params;
            if (!nombre) {
                return res.status(400).json(false);
            }
            const existe = await Categoria.existeCategoriaPorNombre(nombre);
            if (existe) {
                return res.status(200).json({ 
                    resultado: true,
                    mensaje: 'Ya existe una categoria con ese nombre' 
                });
            }
            return res.status(200).json({ resultado: false });
        } catch (error) {
            console.error('Error en verificarCategoria:', error);
            res.status(500).json(false);
        }
    }

    // Verifica si existe ese id en la tabla Categorias
    static async verificarIdCategoria(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ resultado: false });
            }
            const existe = await Categoria.existeCategoriaPorId(id);
            return res.status(200).json({ resultado: existe });
        } catch (error) {
            console.error('Error en verificarId:', error);
            res.status(500).json({ resultado: false });
        }
    }

    // Obtener todas las categorias
    static async ObtenerTodasLasCategorias(req, res) {
        try {
            const categorias = await Categoria.ObtenerTodasLasCategorias();
            res.status(200).json(categorias);
        } catch (error) {
            res.status(500).json([]);
        }
    }

    // Obtener una categoria por su ID
    static async ObtenerCategoriaPorId(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: 'ID de categoría no proporcionado' });
            }
            const categoria = await Categoria.ObtenerCategoriaPorId(id);
            if (!categoria) {
                return res.status(404).json({ error: 'Categoría no encontrada' });
            }
            return res.status(200).json(categoria);
        } catch (error) {
            console.error('Error en ObtenerCategoriaPorId:', error);
            res.status(500).json({ error: 'Error al obtener la categoría' });
        }
    }

    // Agregar una nueva categoria
    static async AgregarCategoria(req, res) {
        try {
            const categoriaData = req.body;
            await Categoria.AgregarCategoria(categoriaData);
            res.status(201).json({
                resultado: true,
                mensaje: 'Categoría agregada exitosamente'
            });
        } catch (error) {
            console.error('Error en AgregarCategoria:', error);
            res.status(500).json({
                resultado: false,
                mensaje: 'Error al agregar la categoría'
            });
        }
    }

    // Actualizar una categoria existente
    static async ActualizarCategoria(req, res) {
        try {
            const { id } = req.params;
            const categoriaData = req.body;
            if (!/^\d+$/.test(id)) {
                return res.status(200).json({
                  resultado: false,
                  mensaje: 'id de producto inválido'
                });
            }
            await Categoria.ActualizarCategoria(id, categoriaData);
            res.status(200).json({
                resultado: true,
                mensaje: 'Categoría actualizada exitosamente'
            });
        } catch (error) {
            console.error('Error en ActualizarCategoria:', error);
            res.status(500).json({
                resultado: false,
                mensaje: 'Error al actualizar la categoría'
            });
        }
    }
}

module.exports = CategoriaController;
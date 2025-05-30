const Linea = require('../models/Linea');

class LineaController {
    // Verifica si ya existe una línea con el nombre especificado
    static async verificarNombreLinea(req, res) {
        try {
            const { nombre } = req.params;
            if (!nombre) {
                return res.status(400).json(false);
            }
            const existe = await Linea.existeLineaPorNombre(nombre);
            if (existe) {
                return res.status(200).json({ 
                    resultado: true,
                    mensaje: 'Ya existe una línea con ese nombre' 
                });
            }
            return res.status(200).json({ resultado: false });
        } catch (error) {
            console.error('Error en verificarLinea:', error);
            res.status(500).json(false);
        }
    }

    // Verifica si existe ese id en la tabla Lineas
    static async verificarIdLinea(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ resultado: false });
            }
            const existe = await Linea.existeLineaPorId(id);
            return res.status(200).json({ resultado: existe });
        } catch (error) {
            console.error('Error en verificarId:', error);
            res.status(500).json({ resultado: false });
        }
    }

    // Agrega una nueva línea a la base de datos
    static async AgregarLinea(req, res) {
        try {
            const lineaData = req.body;
            await Linea.AgregarLinea(lineaData);
            res.status(201).json({
                resultado: true,
                mensaje: 'Línea agregada exitosamente'
            });
        } catch (error) {
            console.error('Error en AgregarLinea:', error);
            res.status(500).json({
                resultado: false,
                mensaje: 'Error al agregar la línea'
            });
        }
    }

    // Obtiene todas las líneas disponibles
    static async ObtenerTodasLasLineas(req, res) {
        try {
            const lineas = await Linea.ObtenerTodasLasLineas();
            res.status(200).json(lineas);
        } catch (error) {
            res.status(500).json([]);
        }
    }

    // Obtiene una línea por su ID
    static async ObtenerLineaPorId(req, res) {
        try {
            const { id } = req.params;
            if (!/^\d+$/.test(id)) {
                return res.status(200).json({
                  resultado: false,
                  mensaje: 'id de producto inválido'
                });
            }
            const linea = await Linea.ObtenerLineaPorId(id);
            return res.status(200).json({ resultado: linea });
        } catch (error) {
            console.error('Error en ObtenerLineaPorId:', error);
            res.status(500).json({ resultado: false });
        }
    }

    // Actualiza una línea existente
    static async ActualizarLinea(req, res) {
        try {
            const { id } = req.params;
            const lineaData = req.body;
            if (!/^\d+$/.test(id)) {
                return res.status(200).json({
                  resultado: false,
                  mensaje: 'id de producto inválido'
                });
            }
            await Linea.ActualizarLinea(id, lineaData);
            res.status(200).json({
                resultado: true,
                mensaje: 'Línea actualizada exitosamente'
            });
        } catch (error) {
            console.error('Error en ActualizarLinea:', error);
            res.status(500).json({
                resultado: false,
                mensaje: 'Error al actualizar la línea'
            });
        }
    }
}

module.exports = LineaController;
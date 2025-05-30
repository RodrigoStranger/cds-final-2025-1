const Linea = require('../models/Linea');

class LineaController {
    // Verifica si ya existe una línea con el nombre especificado
    static async verificarLinea(req, res) {
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
    static async verificarId(req, res) {
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
}
module.exports = LineaController;
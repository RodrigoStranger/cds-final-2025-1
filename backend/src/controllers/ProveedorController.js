const Proveedor = require('../models/Proveedor');

class ProveedorController {
    // Obtener todos los proveedores
    static async ObtenerTodosLosProveedores(req, res) {
        try {
            const proveedores = await Proveedor.ObtenerTodosLosProveedores();
            res.status(200).json(proveedores);
        } catch (error) {
            res.status(500).json([]);
        }
    }
}
module.exports = ProveedorController;
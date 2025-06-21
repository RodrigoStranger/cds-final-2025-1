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

    // Actualizar un proveedor existente
    static async ActualizarProveedor(req, res) {
        try {
            const { ruc } = req.params;
            const { nombre, telefonoProveedor } = req.body;
            await Proveedor.ActualizarProveedor(ruc, nombre, telefonoProveedor);
            res.status(200).json({ 
                success: true, 
                message: 'Proveedor actualizado correctamente' 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al actualizar el proveedor'
            });
        }
    }

    // Obtener un proveedor por su ruc
    static async ObtenerProveedorPorRUC(req, res) {
        try {
            const { ruc } = req.params;
            const proveedor = await Proveedor.ObtenerProveedorPorRUC(ruc);
            res.status(200).json(proveedor);
        } catch (error) {
            res.status(500).json([]);
        }
    }

    // Agregar un nuevo proveedor
    static async AgregarProveedor(req, res) {
        try {
            const { ruc, nombre, telefonoProveedor } = req.body;
            await Proveedor.AgregarProveedor(ruc, nombre, telefonoProveedor);
            res.status(201).json({ 
                success: true, 
                message: 'Proveedor agregado correctamente' 
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                success: false, 
                message: 'Error al agregar el proveedor'
            });
        }
    }

    // Verificar si ya existe un proveedor mediante su ruc
    static async verificarRucProveedor(req, res) {
        try {
            const { ruc } = req.params;
            const existe = await Proveedor.verificarRucProveedor(ruc);
            res.status(200).json({ existe });
        } catch (error) {
            res.status(500).json([]);
        }
    }

    // Verificar si ya existe un proveedor mediante su nombre
    static async verificarNombreProveedor(req, res) {
        try {
            const { nombre } = req.params;
            const existe = await Proveedor.verificarNombreProveedor(nombre);
            res.status(200).json({ existe });
        } catch (error) {
            res.status(500).json([]);
        }
    }
}
module.exports = ProveedorController;
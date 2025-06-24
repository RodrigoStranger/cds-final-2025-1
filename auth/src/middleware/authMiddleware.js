const jwt = require('jsonwebtoken');
const EmpleadoModel = require('../models/Empleado');

// Middleware para verificar autenticación
const verificarAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Verificar que el empleado exista y esté activo
        const empleado = await EmpleadoModel.buscarPorDni(decoded.dni);
        
        if (!empleado || empleado.estado !== 'activo') {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o empleado inactivo'
            });
        }

        req.empleado = {
            cod_empleado: empleado.cod_empleado,
            dni: empleado.dni,
            es_administrador: empleado.es_administrador
        };

        next();

    } catch (error) {
        console.error('Error en middleware de autenticación:', error);
        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }
};

// Middleware para verificar permisos de administrador
const verificarAdmin = (req, res, next) => {
    if (!req.empleado?.es_administrador) {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Se requieren permisos de administrador'
        });
    }
    next();
};

module.exports = {
    verificarAuth,
    verificarAdmin
};

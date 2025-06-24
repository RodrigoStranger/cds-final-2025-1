const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
const verificarToken = (req, res, next) => {
    try {
        // Obtener token del header Authorization
        const authHeader = req.headers.authorization;
        
        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: 'Token de acceso requerido'
            });
        }

        // Extraer token (formato: "Bearer TOKEN")
        const token = authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Formato de token inválido'
            });
        }

        // Verificar token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_jwt');
        
        // Agregar información del usuario a la request
        req.empleado = {
            cod_empleado: decoded.cod_empleado,
            dni: decoded.dni,
            es_administrador: decoded.es_administrador
        };

        console.log('✅ Token válido para empleado:', req.empleado.dni);
        next();
        
    } catch (error) {
        console.log('❌ Token inválido:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Token inválido o expirado'
        });
    }
};

// Middleware para verificar que el usuario sea administrador
const verificarAdmin = (req, res, next) => {
    if (!req.empleado) {
        return res.status(401).json({
            success: false,
            message: 'Token requerido'
        });
    }

    if (!req.empleado.es_administrador) {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Se requieren permisos de administrador'
        });
    }

    console.log('✅ Acceso de administrador verificado para:', req.empleado.dni);
    next();
};

module.exports = {
    verificarToken,
    verificarAdmin
};

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const EmpleadoModel = require('../models/Empleado');

class AuthController {
    // Login de empleado
    static async login(req, res) {
        try {
            const { dni, contraseña } = req.body;

            // Validar que se proporcionen los datos necesarios
            if (!dni || !contraseña) {
                return res.status(400).json({
                    success: false,
                    message: 'DNI y contraseña son requeridos'
                });
            }

            // Buscar empleado por DNI
            const empleado = await EmpleadoModel.buscarPorDni(dni);
            
            if (!empleado) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar si el empleado está activo
            if (empleado.estado !== 'activo') {
                return res.status(401).json({
                    success: false,
                    message: 'Empleado inactivo'
                });
            }

            // Verificar contraseña (comparación directa ya que están en texto plano)
            if (contraseña !== empleado.contraseña) {
                return res.status(401).json({
                    success: false,
                    message: 'Credenciales inválidas'
                });
            }

            // Generar token JWT
            const token = jwt.sign(
                {
                    cod_empleado: empleado.cod_empleado,
                    dni: empleado.dni,
                    es_administrador: empleado.es_administrador
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
            );

            // Respuesta exitosa
            res.json({
                success: true,
                message: 'Login exitoso',
                token,
                empleado: {
                    cod_empleado: empleado.cod_empleado,
                    dni: empleado.dni,
                    es_administrador: empleado.es_administrador,
                    estado: empleado.estado
                }
            });

        } catch (error) {
            console.error('Error en login:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }

    // Verificar token
    static async verificarToken(req, res) {
        try {
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'Token no proporcionado'
                });
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            
            // Verificar que el empleado siga existiendo y esté activo
            const empleado = await EmpleadoModel.buscarPorDni(decoded.dni);
            
            if (!empleado || empleado.estado !== 'activo') {
                return res.status(401).json({
                    success: false,
                    message: 'Token inválido o empleado inactivo'
                });
            }

            res.json({
                success: true,
                empleado: {
                    cod_empleado: empleado.cod_empleado,
                    dni: empleado.dni,
                    es_administrador: empleado.es_administrador,
                    estado: empleado.estado
                }
            });

        } catch (error) {
            console.error('Error al verificar token:', error);
            res.status(401).json({
                success: false,
                message: 'Token inválido'
            });
        }
    }

    // Obtener perfil del empleado autenticado
    static async perfil(req, res) {
        try {
            const empleado = await EmpleadoModel.obtenerInfoBasica(req.empleado.dni);
            
            if (!empleado) {
                return res.status(404).json({
                    success: false,
                    message: 'Empleado no encontrado'
                });
            }

            res.json({
                success: true,
                empleado
            });

        } catch (error) {
            console.error('Error al obtener perfil:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    }
}

module.exports = AuthController;

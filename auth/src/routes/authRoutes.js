const express = require('express');
const AuthController = require('../controllers/authController');
const { verificarAuth, verificarAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Ruta de login
router.post('/login', AuthController.login);

// Ruta para verificar token
router.post('/verify', AuthController.verificarToken);

// Ruta para obtener perfil (requiere autenticación)
router.get('/perfil', verificarAuth, AuthController.perfil);

// Ruta de prueba para administradores
router.get('/admin-test', verificarAuth, verificarAdmin, (req, res) => {
    res.json({
        success: true,
        message: 'Acceso de administrador confirmado',
        empleado: req.empleado
    });
});

module.exports = router;

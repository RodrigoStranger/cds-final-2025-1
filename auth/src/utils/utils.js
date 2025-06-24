const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');

// Script para hashear contraseñas de empleados existentes
async function hashearContrasenas() {
    try {
        // Obtener todos los empleados con contraseñas sin hashear
        const [empleados] = await pool.execute(
            'SELECT cod_empleado, dni, contraseña FROM Empleados WHERE contraseña IS NOT NULL'
        );

        for (const empleado of empleados) {
            // Verificar si la contraseña ya está hasheada (bcrypt hashes empiezan con $2)
            if (!empleado.contraseña.startsWith('$2')) {
                const hashedPassword = await bcrypt.hash(empleado.contraseña, 10);
                
                await pool.execute(
                    'UPDATE Empleados SET contraseña = ? WHERE cod_empleado = ?',
                    [hashedPassword, empleado.cod_empleado]
                );
                
                console.log(`✅ Contraseña hasheada para empleado DNI: ${empleado.dni}`);
            }
        }

        console.log('✅ Proceso completado');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Función para crear un empleado de prueba
async function crearEmpleadoPrueba() {
    try {
        const dni = '12345678';
        const contraseña = 'admin123';
        const hashedPassword = await bcrypt.hash(contraseña, 10);

        await pool.execute(
            'INSERT INTO Empleados (dni, contraseña, es_administrador, estado) VALUES (?, ?, ?, ?)',
            [dni, hashedPassword, true, 'activo']
        );

        console.log('✅ Empleado de prueba creado:');
        console.log(`DNI: ${dni}`);
        console.log(`Contraseña: ${contraseña}`);
        console.log('Es administrador: Sí');

    } catch (error) {
        console.error('❌ Error al crear empleado de prueba:', error);
    }
}

// Ejecutar según el argumento
const comando = process.argv[2];

if (comando === 'hash') {
    hashearContrasenas();
} else if (comando === 'test-user') {
    crearEmpleadoPrueba();
} else {
    console.log('Comandos disponibles:');
    console.log('node utils.js hash - Hashear contraseñas existentes');
    console.log('node utils.js test-user - Crear empleado de prueba');
}
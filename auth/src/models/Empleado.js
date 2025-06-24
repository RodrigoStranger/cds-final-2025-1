const { pool } = require('../config/database');

class EmpleadoModel {
    // Buscar empleado por DNI
    static async buscarPorDni(dni) {
        try {
            const [rows] = await pool.execute(
                'SELECT cod_empleado, dni, estado, contraseña, es_administrador FROM Empleados WHERE dni = ?',
                [dni]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error('Error al buscar empleado por DNI: ' + error.message);
        }
    }

    // Buscar empleado por código
    static async buscarPorCodigo(cod_empleado) {
        try {
            const [rows] = await pool.execute(
                'SELECT cod_empleado, dni, estado, contraseña, es_administrador FROM Empleados WHERE cod_empleado = ?',
                [cod_empleado]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error('Error al buscar empleado por código: ' + error.message);
        }
    }

    // Verificar si un empleado está activo
    static async estaActivo(dni) {
        try {
            const empleado = await this.buscarPorDni(dni);
            return empleado && empleado.estado === 'activo';
        } catch (error) {
            throw new Error('Error al verificar estado del empleado: ' + error.message);
        }
    }

    // Obtener información básica del empleado (sin contraseña)
    static async obtenerInfoBasica(dni) {
        try {
            const [rows] = await pool.execute(
                'SELECT cod_empleado, dni, estado, es_administrador FROM Empleados WHERE dni = ?',
                [dni]
            );
            return rows[0] || null;
        } catch (error) {
            throw new Error('Error al obtener información del empleado: ' + error.message);
        }
    }
}

module.exports = EmpleadoModel;

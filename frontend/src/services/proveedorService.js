import api from './api';

const ProveedorService = {
  // Obtener todos los proveedores
  obtenerTodos: async () => {
    try {
      const response = await api.get('/proveedores');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
      throw error;
    }
  },
  
  // Nota: Según las rutas del backend, solo está implementada la obtención de todos los proveedores
  // Si necesitas más operaciones (crear, actualizar, etc.), deberás implementar las rutas correspondientes en el backend
};

export default ProveedorService;

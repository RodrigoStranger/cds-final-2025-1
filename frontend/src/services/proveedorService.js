import api from './api';

const ProveedorService = {
  // Obtener todos los proveedores
  obtenerTodos: async () => {
    try {
      const response = await api.get('/proveedores');
      return response.data;
    } catch (error) {
      if (error.response) {
        // Error en la respuesta del servidor
      } else if (error.request) {
        // La petición fue hecha pero no se recibió respuesta
      } else {
        // Error al configurar la petición
      }
      throw error;
    }
  },
  
  // Nota: Según las rutas del backend, solo está implementada la obtención de todos los proveedores
  // Si necesitas más operaciones (crear, actualizar, etc.), deberás implementar las rutas correspondientes en el backend
};

export default ProveedorService;

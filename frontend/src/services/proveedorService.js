import api from './api';

const ProveedorService = {
  // Obtener todos los proveedores
  obtenerTodos: async () => {
    try {
      console.log('Fetching proveedores from API...');
      const response = await api.get('/proveedores');
      console.log('Raw proveedores API response:', JSON.stringify(response.data, null, 2));
      
      // Log the first supplier's structure if available
      if (response.data && response.data.length > 0) {
        console.log('First supplier structure:', Object.keys(response.data[0]));
        console.log('First supplier RUC field:', 'ruc' in response.data[0] ? 'exists' : 'missing');
      }
      
      return response.data;
    } catch (error) {
      console.error('Error al obtener los proveedores:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        console.error('Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      throw error;
    }
  },
  
  // Nota: Según las rutas del backend, solo está implementada la obtención de todos los proveedores
  // Si necesitas más operaciones (crear, actualizar, etc.), deberás implementar las rutas correspondientes en el backend
};

export default ProveedorService;

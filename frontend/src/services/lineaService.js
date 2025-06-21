import api from './api';

const LineaService = {
  // Obtener todas las líneas
  obtenerTodas: async () => {
    const response = await api.get('/lineas');
    return response.data;
  },

  // Obtener una línea por ID
  obtenerPorId: async (id) => {
    const response = await api.get(`/lineas/${id}`);
    return response.data;
  },

  // Crear una nueva línea
  crear: async (lineaData) => {

    try {
      const response = await api.post('/lineas', lineaData);

      return response.data;
    } catch (error) {
      // Error en la petición a /lineas
      const errorInfo = {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      };
      console.error('Error al crear línea:', errorInfo);
      throw error;
    }
  },

  // Actualizar una línea existente
  actualizar: async (id, lineaData) => {
    try {

      const response = await api.put(`/lineas/${id}`, lineaData);

      return response.data;
    } catch (error) {
      // Error en la petición de actualización
      const errorInfo = {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      };
      console.error('Error al actualizar línea:', errorInfo);
      throw error;
    }
  },

  // Verificar si un nombre de línea existe
  verificarNombre: async (nombre) => {
    const response = await api.get(`/lineas/existe-nombre/${encodeURIComponent(nombre)}`);
    return response.data;
  },

  // Verificar si un ID de línea existe
  verificarId: async (id) => {
    const response = await api.get(`/lineas/verificar-id/${id}`);
    return response.data;
  }
};

export default LineaService;

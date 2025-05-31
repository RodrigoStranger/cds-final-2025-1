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
    console.log('Enviando a /lineas:', JSON.stringify(lineaData, null, 2));
    try {
      const response = await api.post('/lineas', lineaData);
      console.log('Respuesta de /lineas:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en la petición a /lineas:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  },

  // Actualizar una línea existente
  actualizar: async (id, lineaData) => {
    try {
      console.log(`Actualizando línea ${id} con datos:`, lineaData);
      const response = await api.put(`/lineas/${id}`, lineaData);
      console.log('Respuesta de actualización:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error en la petición de actualización:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          data: error.config?.data
        }
      });
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

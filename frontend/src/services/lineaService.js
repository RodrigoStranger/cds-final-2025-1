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
    const response = await api.put(`/lineas/${id}`, lineaData);
    return response.data;
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

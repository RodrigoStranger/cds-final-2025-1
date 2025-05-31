import api from './api';

const LineaService = {
  // Obtener todas las líneas
  obtenerTodas: async () => {
    try {
      const response = await api.get('/lineas');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las líneas:', error);
      throw error;
    }
  },

  // Obtener una línea por ID
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/lineas/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la línea:', error);
      throw error;
    }
  },

  // Crear una nueva línea
  crear: async (lineaData) => {
    try {
      const response = await api.post('/lineas', lineaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la línea:', error);
      throw error;
    }
  },

  // Actualizar una línea existente
  actualizar: async (id, lineaData) => {
    try {
      const response = await api.put(`/lineas/${id}`, lineaData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la línea:', error);
      throw error;
    }
  },

  // Verificar si un nombre de línea existe
  verificarNombre: async (nombre) => {
    try {
      const response = await api.get(`/lineas/existe-nombre/${encodeURIComponent(nombre)}`);
      return response.data;
    } catch (error) {
      console.error('Error al verificar el nombre de la línea:', error);
      throw error;
    }
  },

  // Verificar si un ID de línea existe
  verificarId: async (id) => {
    try {
      const response = await api.get(`/lineas/existe-id/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al verificar el ID de la línea:', error);
      throw error;
    }
  },
};

export default LineaService;

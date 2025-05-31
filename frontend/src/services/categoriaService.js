import api from './api';

const CategoriaService = {
  // Obtener todas las categorías
  obtenerTodas: async () => {
    try {
      const response = await api.get('/categorias');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las categorías:', error);
      throw error;
    }
  },

  // Obtener una categoría por ID
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/categorias/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener la categoría:', error);
      throw error;
    }
  },

  // Crear una nueva categoría
  crear: async (categoriaData) => {
    try {
      const response = await api.post('/categorias', categoriaData);
      return response.data;
    } catch (error) {
      console.error('Error al crear la categoría:', error);
      throw error;
    }
  },

  // Actualizar una categoría existente
  actualizar: async (id, categoriaData) => {
    try {
      const response = await api.put(`/categorias/${id}`, categoriaData);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar la categoría:', error);
      throw error;
    }
  },

  // Verificar si un nombre de categoría existe
  verificarNombre: async (nombre) => {
    try {
      const response = await api.get(`/categorias/existe-nombre/${encodeURIComponent(nombre)}`);
      // Mapear la respuesta del backend al formato esperado
      return {
        existe: response.data.resultado,
        mensaje: response.data.mensaje
      };
    } catch (error) {
      console.error('Error al verificar el nombre de la categoría:', error);
      return {
        existe: false,
        mensaje: 'Error al verificar el nombre de la categoría'
      };
    }
  },

  // Verificar si un ID de categoría existe
  verificarId: async (id) => {
    try {
      const response = await api.get(`/categorias/existe-id/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al verificar el ID de la categoría:', error);
      throw error;
    }
  },
};

export default CategoriaService;

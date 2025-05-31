import api from './api';

const ProductoService = {
  // Obtener todos los productos
  obtenerTodos: async () => {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener los productos:', error);
      throw error;
    }
  },

  // Obtener productos no disponibles
  obtenerNoDisponibles: async () => {
    try {
      const response = await api.get('/productos/no-disponibles');
      return response.data;
    } catch (error) {
      console.error('Error al obtener productos no disponibles:', error);
      throw error;
    }
  },

  // Verificar si un nombre de producto existe
  verificarNombre: async (nombre) => {
    try {
      const response = await api.get(`/productos/existe-nombre/${encodeURIComponent(nombre)}`);
      return response.data;
    } catch (error) {
      console.error('Error al verificar el nombre del producto:', error);
      throw error;
    }
  },

  // Verificar si un ID de producto existe
  verificarId: async (id) => {
    try {
      const response = await api.get(`/productos/existe-id/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al verificar el ID del producto:', error);
      throw error;
    }
  },

  // Obtener un producto por ID
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener el producto por ID:', error);
      throw error;
    }
  },

  // Crear un nuevo producto
  crear: async (productoData) => {
    try {
      // Asegurarse de que el estado siempre esté definido
      const dataToSend = {
        ...productoData,
        estado: 'disponible' // Estado por defecto
      };
      const response = await api.post('/productos', dataToSend);
      return response.data;
    } catch (error) {
      console.error('Error al crear el producto:', error);
      throw error;
    }
  },

  // Actualizar un producto existente
  actualizar: async (id, productoData) => {
    try {
      // Asegurarse de que el estado siempre esté definido
      const dataToSend = {
        ...productoData,
        estado: 'disponible' // Estado por defecto
      };
      const response = await api.put(`/productos/${id}`, dataToSend);
      return response.data;
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      throw error;
    }
  },
};

export default ProductoService;

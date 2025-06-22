import api from './api';

const ProductoService = {
  // Obtener todos los productos
  obtenerTodos: async () => {
    try {
      const response = await api.get('/productos');
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  // Obtener productos no disponibles
  obtenerNoDisponibles: async () => {
    try {
      const response = await api.get('/productos/no-disponibles');
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  // Verificar si un nombre de producto existe
  verificarNombre: async (nombre) => {
    try {
      const response = await api.get(`/productos/existe-nombre/${encodeURIComponent(nombre)}`);
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  // Verificar si un ID de producto existe
  verificarId: async (id) => {
    try {
      const response = await api.get(`/productos/existe-id/${id}`);
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  // Obtener un producto por ID
  obtenerPorId: async (id) => {
    try {
      const response = await api.get(`/productos/${id}`);
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  // Crear un nuevo producto
  crear: async (productoData) => {
    try {
      // Convertir descripción vacía a null
      const descripcion = productoData.descripcion === '' ? null : productoData.descripcion;
      // Asegurarse de que el estado siempre esté definido
      const dataToSend = {
        ...productoData,
        descripcion,
        estado: 'disponible' // Estado por defecto
      };
      const response = await api.post('/productos', dataToSend);
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  // Actualizar un producto existente
  actualizar: async (id, productoData) => {
    try {
      // Convertir descripción vacía a null
      const descripcion = productoData.descripcion === '' ? null : productoData.descripcion;
      // Asegurarse de que el estado siempre esté definido
      const dataToSend = {
        ...productoData,
        descripcion,
        estado: 'disponible' // Estado por defecto
      };
      const response = await api.put(`/productos/${id}`, dataToSend);
      return response.data;
    } catch (error) {

      throw error;
    }
  },
};

export default ProductoService;

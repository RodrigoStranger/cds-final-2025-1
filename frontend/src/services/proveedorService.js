import api from './api';

const ProveedorService = {
  // Obtener todos los proveedores
  obtenerTodos: async () => {
    try {
      const response = await api.get('/proveedores');
      return response.data;
    } catch (error) {
      console.error('Error al obtener proveedores:', error);
      throw error;
    }
  },
  
  // Obtener un proveedor por RUC
  obtenerPorRUC: async (ruc) => {
    try {
      const response = await api.get(`/proveedores/${ruc}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener proveedor con RUC ${ruc}:`, error);
      throw error;
    }
  },
  
  // Crear un nuevo proveedor
  crear: async (proveedorData) => {
    try {
      const response = await api.post('/proveedores', proveedorData);
      return response.data;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw error;
    }
  },
  
  // Actualizar un proveedor existente
  actualizar: async (ruc, datosActualizados) => {
    try {
      const response = await api.put(`/proveedores/${ruc}`, datosActualizados);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar proveedor con RUC ${ruc}:`, error);
      throw error;
    }
  },
  
  // Verificar si existe un RUC
  verificarRUC: async (ruc) => {
    try {
      const response = await api.get(`/proveedores/verificar-ruc/${ruc}`);
      return response.data.existe;
    } catch (error) {
      console.error('Error al verificar RUC:', error);
      throw error;
    }
  },
  
  // Verificar si existe un nombre de proveedor
  verificarNombre: async (nombre) => {
    try {
      const response = await api.get(`/proveedores/verificar-nombre/${encodeURIComponent(nombre)}`);
      return response.data.existe;
    } catch (error) {
      console.error('Error al verificar nombre de proveedor:', error);
      throw error;
    }
  }
};

export default ProveedorService;

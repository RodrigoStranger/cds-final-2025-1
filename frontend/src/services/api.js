import axios from 'axios';

// Configuración de la API - Detecta entorno automáticamente
const API_BASE_URL =
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:3000/api'
    : '/api'; // Cambia la URL según tu entorno de desarrollo o producción

// Crear una instancia de axios con configuración mejorada
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Expires': '0'
  },
  withCredentials: true,
  validateStatus: function (status) {
    return status >= 200 && status < 500; // Resuelve solo si el código de estado es menor que 500
  }
});

// Interceptor para agregar el token JWT automáticamente
api.interceptors.request.use(
  (config) => {
    // Obtener token del localStorage
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔐 Token agregado a la petición:', config.url);
    } else {
      console.log('⚠️ No hay token disponible para:', config.url);
    }
    
    return config;
  },
  (error) => {
    console.error('Error en interceptor de request:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => {
    // Elimina el log de cada request exitosa
    return response;
  },
  (error) => {
    if (error.response) {
      // El servidor respondió con un estado fuera del rango 2xx
      console.error('Error en la respuesta:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config.url,
        method: error.config.method
      });

      // Si es un error 401 (No autorizado), limpiar sesión
      if (error.response.status === 401) {
        console.log('🚨 Token expirado o inválido, limpiando sesión...');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
        
        // Redirigir al login si no estamos ya ahí
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // La solicitud fue hecha pero no se recibió respuesta
      console.error('No se recibió respuesta del servidor:', {
        url: error.config.url,
        method: error.config.method,
        message: error.message
      });
    } else {
      // Algo sucedió en la configuración de la solicitud
      console.error('Error en la configuración de la solicitud:', error.message);
    }
    return Promise.reject(error);
  }
);

// Función para probar la conexión con el backend
export const testConnection = async () => {
  try {
    console.log('Probando conexión con el backend...');
    const response = await api.get('/health');
    console.log('Respuesta del backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error al conectar con el backend:', error);
    throw error;
  }
};

export default api;

import axios from 'axios';

// URL de la API en producción (AWS)
const API_BASE_URL = 'http://54.233.155.184:3000/api';

console.log(`Conectando a la API en: ${API_BASE_URL}`);

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('Error en la petición:', error);
    return Promise.reject(error);
  }
);

export default api;

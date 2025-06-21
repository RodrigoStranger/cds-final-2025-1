import axios from 'axios';

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Asegúrate de que esta URL coincida con tu backend
  headers: {
    'Content-Type': 'application/json',
  },
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

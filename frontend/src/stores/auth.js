import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // Estado - inicializar siempre como no autenticado
  const token = ref(null)
  const user = ref(null)
  const isLoading = ref(false)
  const justLoggedIn = ref(false) // Flag para indicar login reciente

  // Computed
  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.es_administrador || false)

  // URL base para autenticación
  const getAuthUrl = () => {
    return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3001/api'
      : '/api'
  }

  // Inicializar desde localStorage si existe sesión
  const initializeFromStorage = () => {
    try {
      const storedToken = localStorage.getItem('auth_token')
      const storedUser = localStorage.getItem('user_data')
      
      if (storedToken && storedUser) {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        console.log('✅ Sesión restaurada desde localStorage')
      }
    } catch (error) {
      console.warn('Error al recuperar datos de autenticación:', error)
      // Si hay error, limpiar localStorage corrupto
      forceReset()
    }
  }

  // FORZAR LIMPIEZA COMPLETA - solo usar cuando sea necesario
  const forceReset = () => {
    token.value = null
    user.value = null
    justLoggedIn.value = false
    isLoading.value = false
    
    // Limpiar localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
    localStorage.removeItem('auth_user')
    
    // Limpiar cualquier otra posible clave relacionada
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('auth_') || key.startsWith('user_')) {
        localStorage.removeItem(key)
      }
    })
  }

  // Inicializar desde localStorage al cargar
  initializeFromStorage()

  // Acciones
  const login = async (dni, contraseña) => {
    isLoading.value = true
    try {
      const response = await axios.post(`${getAuthUrl()}/auth/login`, {
        dni,
        contraseña
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (response.data.success) {
        // Guardar datos
        token.value = response.data.token
        user.value = response.data.empleado
        justLoggedIn.value = true // Marcar como recién logueado
        
        // Persistir en localStorage
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user_data', JSON.stringify(response.data.empleado))
        
        // Limpiar flag después de un tiempo
        setTimeout(() => {
          justLoggedIn.value = false
        }, 5000)
        
        return { success: true, data: response.data }
      } else {
        throw new Error(response.data.message || 'Error en el login')
      }
    } catch (error) {
      let message = 'Ha ocurrido un error inesperado'
      
      if (error.response) {
        // Error 502, 503, 504 = servidor caído o proxy error
        if ([502, 503, 504].includes(error.response.status)) {
          message = 'Servidor caído o en mantenimiento'
        } else {
          message = error.response.data?.message || 'Credenciales incorrectas'
        }
      } else if (error.request) {
        message = 'Servidor caído o en mantenimiento'
      }
      
      return { success: false, message }
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    // Limpiar estado
    token.value = null
    user.value = null
    
    // Limpiar localStorage
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  const verifyToken = async () => {
    if (!token.value) return false

    try {
      const response = await axios.get(`${getAuthUrl()}/auth/perfil`, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        },
        timeout: 5000
      })

      if (response.data.success) {
        return true
      } else {
        logout()
        return false
      }
    } catch (error) {
      logout()
      return false
    }
  }

  const refreshUserData = async () => {
    if (!token.value) return false

    try {
      const response = await axios.get(`${getAuthUrl()}/auth/perfil`, {
        headers: {
          'Authorization': `Bearer ${token.value}`
        },
        timeout: 5000
      })

      if (response.data.success) {
        user.value = response.data.empleado
        localStorage.setItem('user_data', JSON.stringify(response.data.empleado))
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  // Forzar limpieza al inicializar la aplicación
  const clearSession = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('auth_token')
    localStorage.removeItem('user_data')
  }

  return {
    // Estado
    token,
    user,
    isLoading,
    justLoggedIn,
    
    // Computed
    isAuthenticated,
    isAdmin,
    
    // Acciones
    login,
    logout,
    verifyToken,
    refreshUserData,
    clearSession,
    forceReset
  }
})

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
      console.error('❌ Error en login:', error)
      
      let message = 'Ha ocurrido un error inesperado'
      
      if (error.response) {
        message = error.response.data?.message || 'Credenciales incorrectas'
      } else if (error.request) {
        message = 'No se pudo conectar con el servidor'
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
      console.error('❌ Error verificando token:', error)
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
      console.error('Error refrescando datos del usuario:', error)
      return false
    }
  }

  // Inicializar desde localStorage (llamar manualmente)
  const initializeFromStorage = async () => {
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user_data')
    
    if (storedToken) {
      token.value = storedToken
      if (storedUser) {
        user.value = JSON.parse(storedUser)
      }
      
      // Verificar que el token siga siendo válido
      const isValid = await verifyToken()
      if (!isValid) {
        // Si el token no es válido, limpiar todo
        logout()
        return false
      }
      return true
    }
    return false
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
    initializeFromStorage
  }
})

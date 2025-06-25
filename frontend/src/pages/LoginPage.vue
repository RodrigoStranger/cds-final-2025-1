<template>
  <div class="login-page">
    <LoginForm 
      @login-success="handleLoginSuccess"
      @login-error="handleLoginError"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginForm from '../components/LoginForm.vue'
import { useToast } from '../composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const { success: showToast, error: showError } = useToast()

// Redirigir si ya está autenticado
if (authStore.isAuthenticated) {
  router.push('/productos')
}

const handleLoginSuccess = async (data) => {
  console.log('✅ Login exitoso desde página:', data)
  
  showToast('¡Bienvenido! Sesión iniciada correctamente')
  
  // Redirigir al dashboard
  await router.push('/productos')
}

const handleLoginError = (message) => {
  console.error('❌ Error de login desde página:', message)
  showError(message || 'Error al iniciar sesión')
}
</script>

<style scoped>
.login-page {
  width: 100%;
  height: 100vh;
}
</style>

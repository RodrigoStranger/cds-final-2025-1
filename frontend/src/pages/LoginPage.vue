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

// Forzar estado limpio
authStore.forceReset()

const handleLoginSuccess = async (data) => {
  showToast('¡Bienvenido! Sesión iniciada correctamente')
  
  // Redirigir al dashboard
  await router.push('/productos')
}

const handleLoginError = (message) => {
  // Solo mostrar el error en el formulario, no en toast
}
</script>

<style scoped>
.login-page {
  width: 100%;
  height: 100vh;
}
</style>

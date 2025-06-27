<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="form-section">
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-header">
            <h1>Iniciar Sesión</h1>
            <p>Ingresa tus credenciales para acceder</p>
          </div>
          
          <div class="form-group">
            <label for="dni">DNI</label>
            <input
              id="dni"
              type="text"
              placeholder="Ingresa tu DNI (8 dígitos)"
              pattern="\d{8}"
              maxlength="8"
              minlength="8"
              inputmode="numeric"
              v-model="formData.dni"
              :disabled="loading"
              required
              class="form-input"
              :class="{ 'input-error': errors.dni }"
            />
            <span v-if="errors.dni" class="error-message">{{ errors.dni }}</span>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input
              id="password"
              type="password"
              placeholder="Ingresa tu contraseña"
              v-model="formData.contraseña"
              :disabled="loading"
              required
              class="form-input"
              :class="{ 'input-error': errors.contraseña }"
            />
            <span v-if="errors.contraseña" class="error-message">{{ errors.contraseña }}</span>
          </div>

          <button 
            type="submit" 
            class="login-button"
            :disabled="loading"
            :class="{ 'button-loading': loading }"
          >
            <span v-if="!loading">Ingresar</span>
            <span v-else class="loading-content">
              <div class="spinner"></div>
              Verificando...
            </span>
          </button>

          <div v-if="errors.general" class="error-message general-error">
            {{ errors.general }}
          </div>
        </form>
      </div>

      <div class="brand-section">
        <div class="brand-content">
          <h1>¡Bienvenido a FabiaNatura!</h1>
          <p>Sistema de gestión de inventario</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue';
import { useAuthStore } from '../stores/auth';

// Store de autenticación
const authStore = useAuthStore();

// Estado reactivo
const formData = reactive({
  dni: '',
  contraseña: ''
});
const errors = reactive({
  dni: '',
  contraseña: '',
  general: ''
});

// Computed para loading desde el store
const loading = computed(() => authStore.isLoading);

// Emits para comunicación con el componente padre
const emit = defineEmits(['login-success', 'login-error']);

// Limpiar errores
const clearErrors = () => {
  errors.dni = '';
  errors.contraseña = '';
  errors.general = '';
};

// Validar formulario
const validateForm = () => {
  clearErrors();
  let isValid = true;

  // Validar DNI
  if (!formData.dni) {
    errors.dni = 'El DNI es requerido';
    isValid = false;
  } else if (!/^\d{8}$/.test(formData.dni)) {
    errors.dni = 'El DNI debe tener exactamente 8 dígitos';
    isValid = false;
  }

  // Validar contraseña
  if (!formData.contraseña) {
    errors.contraseña = 'La contraseña es requerida';
    isValid = false;
  } else if (formData.contraseña.length < 3) {
    errors.contraseña = 'La contraseña debe tener al menos 3 caracteres';
    isValid = false;
  }

  return isValid;
};

// Manejar login
const handleLogin = async () => {
  if (!validateForm()) return;

  clearErrors();
  
  const result = await authStore.login(formData.dni, formData.contraseña);
  
  if (result.success) {
    // Emitir evento de éxito
    emit('login-success', {
      token: result.data.token,
      user: result.data.empleado
    });
  } else {
    // Mostrar error
    if (result.message === 'Servidor caído o en mantenimiento') {
      errors.general = 'Servidor caído o en mantenimiento. Intenta más tarde o contacta al administrador.';
    } else {
      errors.general = result.message;
    }
    emit('login-error', result.message);
  }
};
</script>

<style src="../styles/components/LoginForm.css"></style>
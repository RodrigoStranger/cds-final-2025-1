<template>
  <div class="p-6 max-w-2xl mx-auto">
    <h1 class="text-2xl font-bold mb-6">Prueba de Conexión</h1>
    
    <div class="bg-white p-6 rounded-lg shadow-md">
      <div class="mb-4">
        <h2 class="text-lg font-semibold mb-2">Estado de la conexión:</h2>
        <div v-if="loading" class="text-yellow-600">
          <div class="animate-spin inline-block mr-2">↻</div>
          Probando conexión...
        </div>
        <div v-else-if="connectionStatus" class="text-green-600">
          ✅ {{ connectionStatus }}
        </div>
        <div v-else class="text-red-600">
          ❌ No se pudo conectar al backend
        </div>
      </div>

      <div v-if="error" class="mt-4 p-3 bg-red-100 text-red-700 rounded">
        <p class="font-semibold">Error:</p>
        <pre class="whitespace-pre-wrap text-sm">{{ JSON.stringify(error, null, 2) }}</pre>
      </div>

      <div v-if="responseData" class="mt-4 p-3 bg-gray-100 rounded">
        <p class="font-semibold">Respuesta del backend:</p>
        <pre class="whitespace-pre-wrap text-sm">{{ JSON.stringify(responseData, null, 2) }}</pre>
      </div>

      <button 
        @click="testConnection"
        class="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        :disabled="loading"
      >
        {{ loading ? 'Probando...' : 'Probar Conexión' }}
      </button>
    </div>

    <div class="mt-8 p-4 bg-yellow-50 border-l-4 border-yellow-400">
      <p class="font-semibold">Información de depuración:</p>
      <p class="text-sm mt-1">URL de la API: {{ apiUrl }}</p>
      <p class="text-sm">Modo: {{ isProduction ? 'Producción' : 'Desarrollo' }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { testConnection } from '../services/api';

const loading = ref(false);
const connectionStatus = ref('');
const responseData = ref(null);
const error = ref(null);
const apiUrl = import.meta.env.VITE_API_URL || 'http://54.233.155.184:3000/api';
const isProduction = import.meta.env.PROD;

const testConnection = async () => {
  loading.value = true;
  connectionStatus.value = '';
  responseData.value = null;
  error.value = null;

  try {
    const data = await testConnection();
    connectionStatus.value = 'Conexión exitosa con el backend';
    responseData.value = data;
  } catch (err) {
    console.error('Error detallado:', err);
    error.value = {
      message: err.message,
      code: err.code,
      config: {
        url: err.config?.url,
        method: err.config?.method,
        timeout: err.config?.timeout,
        withCredentials: err.config?.withCredentials
      },
      response: err.response ? {
        status: err.response.status,
        statusText: err.response.statusText,
        data: err.response.data
      } : 'No response',
      request: err.request ? 'Request was made but no response received' : 'No request was made'
    };
    connectionStatus.value = 'Error al conectar con el backend';
  } finally {
    loading.value = false;
  }
};

// Probar la conexión automáticamente al cargar el componente
onMounted(() => {
  testConnection();
});
</script>

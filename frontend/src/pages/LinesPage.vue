<template>
  <div class="page-container">
    <div class="card">
      <div class="card-header">
        <div class="card-header-content">
          <h3>Líneas de Productos</h3>
          <button @click="openLineModal()" class="button primary">
            <Plus class="icon-small" />
            Nueva Línea
          </button>
        </div>
      </div>
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>RUC</th>
              <th>Proveedor</th>
              <th class="actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="linea in lineasPaginadas" :key="linea.id">
              <td>
                <div class="line-cell">
                  <div class="line-avatar">{{ linea.nombre.charAt(0).toUpperCase() }}</div>
                  <div class="line-name">{{ linea.nombre }}</div>
                </div>
              </td>
              <td>{{ linea.ruc || 'Sin RUC' }}</td>
              <td>{{ linea.proveedor || 'Sin proveedor' }}</td>
              <td class="actions">
                <div class="action-buttons">
                  <button @click="openLineModal(linea)" class="icon-button edit">
                    <Edit class="icon-small" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        
        <!-- Mensaje cuando no hay líneas -->
        <div v-if="lineas.length === 0" class="empty-state">
          <div class="empty-icon">
            <Tag class="icon-large" />
          </div>
          <h4>No hay líneas disponibles</h4>
          <p>Agrega líneas para organizar tus productos.</p>
        </div>
      </div>
      
      <!-- Paginación -->
      <div v-if="lineas.length > 0" class="pagination">
        <div class="pagination-info">
          Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ lineas.length }} líneas
        </div>
        <div class="pagination-controls">
          <button 
            v-if="currentPage > 1"
            @click="previousPage" 
            class="pagination-button"
          >
            Anterior
          </button>
          <button class="pagination-button active">{{ currentPage }}</button>
          <button 
            v-if="currentPage < totalPages"
            @click="nextPage" 
            class="pagination-button"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Modal para Líneas -->
    <LineModal
      :show="showLineModal"
      :editing-line="editingLine"
      :line-form="lineForm"
      :line-errors="lineErrors"
      :proveedores="proveedores"
      @close="closeLineModal"
      @save="saveLine"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue';
import { Plus, Edit, Tag } from 'lucide-vue-next';
import LineModal from '../components/LineModal.vue';
import { useLineas } from '../composables/useApi.js';

// Obtener la instancia actual para acceder al plugin de toast
const { proxy } = getCurrentInstance();

// Usar el composable para líneas
const { 
  lineas, 
  proveedores, 
  loading, 
  error, 
  cargarLineas, 
  crearLinea, 
  actualizarLinea,
  verificarNombreLinea 
} = useLineas();

// Estados para modales
const showLineModal = ref(false);
const editingLine = ref(null);

// Estados para paginación
const currentPage = ref(1);
const itemsPerPage = 20;

// Formulario de línea
const lineForm = ref({
  nombre: '',
  proveedorId: null,
  proveedorRuc: null
});

// Errores de validación
const lineErrors = reactive({
  nombre: '',
  proveedorId: ''
});

// Computed para paginación
const totalPages = computed(() => {
  return Math.ceil(lineas.value.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, lineas.value.length);
});

const lineasPaginadas = computed(() => {
  return lineas.value.slice(startIndex.value, endIndex.value);
});

// Funciones de paginación
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

// Funciones para líneas
const openLineModal = (line = null) => {
  if (line) {
    editingLine.value = line;
    lineForm.value = {
      nombre: line.nombre,
      proveedorRuc: line.ruc || null,
      proveedorNombre: line.proveedor || null
    };
  } else {
    editingLine.value = null;
    lineForm.value = { 
      nombre: '', 
      proveedorRuc: null,
      proveedorNombre: null
    };
  }
  showLineModal.value = true;
};

const closeLineModal = () => {
  showLineModal.value = false;
  editingLine.value = null;
  // Resetear los errores
  lineErrors.nombre = '';
  lineErrors.proveedorId = '';
};

const saveLine = async () => {
  try {
    // Reset errors
    lineErrors.nombre = '';
    lineErrors.proveedorId = '';
    
    // Validate required fields
    if (!lineForm.value.nombre?.trim()) {
      lineErrors.nombre = 'El nombre es requerido';
      return;
    }

    // Trim and validate name
    const nombre = lineForm.value.nombre.trim();
    
    // Validate name length
    if (nombre.length < 2) {
      lineErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
      return;
    }

    // Check if line name already exists (only for new lines or when name changes)
    if (!editingLine.value || editingLine.value.nombre !== nombre) {
      const response = await verificarNombreLinea(nombre);
      if (response && response.resultado === true) {
        lineErrors.nombre = response.mensaje || 'Ya existe una línea con este nombre';
        return;
      }
    }

    // Obtener el RUC del formulario
    const ruc = lineForm.value.proveedorRuc;
    
    // Preparar los datos para guardar
    const lineData = {
      nombre_linea: nombre,
      ruc: ruc || null
    };
    
    // Asegurarse de que el RUC sea un string si existe
    if (lineData.ruc !== null) {
      lineData.ruc = String(lineData.ruc);
    }
    
    // Save or update the line
    if (editingLine.value) {
      // Use cod_linea if available, otherwise fall back to id
      const lineId = editingLine.value.cod_linea || editingLine.value.id;
      
      // Ensure we have a valid ID
      if (!lineId) {
        throw new Error('ID de línea no proporcionado');
      }
      
      // Convert ID to number and validate
      const idNum = parseInt(lineId, 10);
      if (isNaN(idNum)) {
        throw new Error('ID de línea inválido');
      }
      
      // For updates, we handle the response here
      const updateResponse = await actualizarLinea(idNum, lineData);
      if (updateResponse && updateResponse.resultado) {
        proxy.$toast.success(updateResponse.mensaje || '¡Línea actualizada exitosamente!', 2000);
        await cargarLineas();
        closeLineModal();
      } else {
        throw new Error(updateResponse?.mensaje || 'Error al actualizar la línea');
      }
    } else {
      // For new lines, the response is handled in crearLinea
      await crearLinea(lineData);
      // No need to show success message here as it's handled in crearLinea
    }
    
    await cargarLineas();
    closeLineModal();
  } catch (err) {
    console.error('Error al guardar la línea:', err);
    const errorMessage = err.response?.data?.mensaje || 'Error al guardar la línea';
    
    if (err.response?.data?.field) {
      lineErrors[err.response.data.field] = errorMessage;
    } else if (proxy && proxy.$toast) {
      proxy.$toast.error(errorMessage, 3000);
    }
  }
};

onMounted(() => {
  cargarLineas();
});
</script>

<style scoped>
@import '../styles/pages/LinesPage.css';
</style>

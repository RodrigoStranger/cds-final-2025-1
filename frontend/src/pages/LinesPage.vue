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
      @close="closeLineModal"
      @save="saveLine"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Plus, Edit, Tag } from 'lucide-vue-next';
import LineModal from '../components/LineModal.vue';
import { useLineas } from '../composables/useApi.js';

// Usar el composable para líneas
const { lineas, loading, error, cargarLineas, crearLinea, actualizarLinea } = useLineas();

// Estados para modales
const showLineModal = ref(false);
const editingLine = ref(null);

// Estados para paginación
const currentPage = ref(1);
const itemsPerPage = 20;

// Formulario de línea
const lineForm = reactive({
  nombre: '',
  ruc: '',
  proveedor: ''
});

// Errores de validación
const lineErrors = reactive({
  nombre: '',
  ruc: ''
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
    lineForm.nombre = line.nombre;
    lineForm.ruc = line.ruc || '';
    lineForm.proveedor = line.proveedor || '';
  } else {
    editingLine.value = null;
    lineForm.nombre = '';
    lineForm.ruc = '';
    lineForm.proveedor = '';
  }
  showLineModal.value = true;
};

const closeLineModal = () => {
  showLineModal.value = false;
  editingLine.value = null;
  Object.keys(lineErrors).forEach(key => lineErrors[key] = '');
};

const saveLine = async () => {
  try {
    if (editingLine.value) {
      await actualizarLinea(editingLine.value.id, lineForm);
    } else {
      await crearLinea(lineForm);
    }
    closeLineModal();
  } catch (err) {
    console.error('Error al guardar línea:', err);
  }
};

onMounted(() => {
  cargarLineas();
});
</script>

<style scoped>
@import '../styles/pages/LinesPage.css';
</style>

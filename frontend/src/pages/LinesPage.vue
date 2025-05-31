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
.page-container {
  margin-top: 4rem;
}

@media (min-width: 768px) {
  .page-container {
    margin-top: 0;
  }
}

/* Card */
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1.5rem;
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.card-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
}

/* Button */
.button {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.2s;
}

.button.primary {
  background-color: #15803d;
  color: white;
}

.button.primary:hover {
  background-color: #166534;
}

.icon-small {
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: flex-end;
}

/* Table */
.table-container {
  overflow-x: auto;
  min-height: 200px;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th {
  padding: 0.75rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: uppercase;
  color: #6b7280;
  background-color: #f9fafb;
}

.table td {
  padding: 1rem 1.5rem;
  font-size: 0.875rem;
  color: #4b5563;
  border-top: 1px solid #e5e7eb;
}

.table th.actions, .table td.actions {
  text-align: right;
  width: 80px;
}

/* Line Cell */
.line-cell {
  display: flex;
  align-items: center;
}

.line-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  background-color: #f0fdf4;
  color: #15803d;
  border: 2px solid #15803d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
  font-size: 1rem;
  flex-shrink: 0;
}

.line-name {
  font-weight: 500;
  color: #111827;
}

/* Icon Buttons */
.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.icon-button.edit {
  color: #15803d;
}

.icon-button.edit:hover {
  color: #166534;
  background-color: #f0fdf4;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem;
  text-align: center;
}

.empty-icon {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #f3f4f6;
  color: #9ca3af;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-large {
  width: 2rem;
  height: 2rem;
}

.empty-state h4 {
  font-size: 1.125rem;
  font-weight: 500;
  color: #111827;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #6b7280;
  max-width: 24rem;
}

/* Pagination */
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  flex-wrap: wrap;
  gap: 1rem;
}

.pagination-info {
  font-size: 0.875rem;
  color: #6b7280;
}

.pagination-controls {
  display: flex;
  gap: 0.5rem;
}

.pagination-button {
  padding: 0.25rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  background-color: white;
  color: #4b5563;
  cursor: pointer;
}

.pagination-button:hover {
  background-color: #f9fafb;
}

.pagination-button.active {
  background-color: #f0fdf4;
  color: #15803d;
  border-color: #15803d;
}
</style>

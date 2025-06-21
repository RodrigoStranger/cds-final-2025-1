<template>
  <div class="page-container">
    <div class="card">
      <div class="card-header">
        <div class="card-header-content">
          <h3>Líneas de Productos</h3>
          <div class="header-actions">
            <!-- Buscador -->
            <div class="search-container">
              <div class="search-input-wrapper">
                <Search class="search-icon" />
                <input 
                  v-model="searchTerm"
                  type="text" 
                  placeholder="Buscar líneas..."
                  class="search-input"
                  @input="handleSearch"
                />
                <button 
                  v-if="searchTerm"
                  @click="clearSearch"
                  class="clear-search-button"
                >
                  <X class="icon-small" />
                </button>
              </div>
            </div>
            <button @click="openLineModal()" class="button primary">
              <Plus class="icon-small" />
              Nueva Línea
            </button>
          </div>
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
                <div class="cell-content">
                  <div class="line-cell">
                    <div class="line-avatar">{{ linea.nombre.charAt(0).toUpperCase() }}</div>
                    <div class="line-name">{{ linea.nombre }}</div>
                  </div>
                  <span class="tooltip">{{ linea.nombre }}</span>
                </div>
              </td>
              <td>
                <div class="cell-content">
                  {{ linea.ruc || 'Sin RUC' }}
                  <span class="tooltip" v-if="linea.ruc">{{ linea.ruc }}</span>
                </div>
              </td>
              <td>
                <div class="cell-content">
                  {{ linea.proveedor || 'Sin proveedor' }}
                  <span class="tooltip" v-if="linea.proveedor">{{ linea.proveedor }}</span>
                </div>
              </td>
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
        
        <!-- Mensaje cuando no hay líneas o no hay resultados de búsqueda -->
        <div v-if="lineasFiltradas.length === 0" class="empty-state">
          <div class="empty-icon">
            <Tag class="icon-large" />
          </div>
          <h4 v-if="searchTerm">No se encontraron líneas</h4>
          <h4 v-else>No hay líneas disponibles</h4>
          <p v-if="searchTerm">No hay líneas que coincidan con "{{ searchTerm }}"</p>
          <p v-else>Agrega líneas para organizar tus productos.</p>
          <button v-if="searchTerm" @click="clearSearch" class="button secondary">
            Limpiar búsqueda
          </button>
        </div>
      </div>
      
      <!-- Paginación -->
      <div v-if="lineasFiltradas.length > 0" class="pagination">
        <div class="pagination-info">
          Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ lineasFiltradas.length }} líneas
          <span v-if="searchTerm" class="filter-indicator">(Búsqueda: "{{ searchTerm }}")</span>
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
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from 'vue';
import { Plus, Edit, Tag, Search, X } from 'lucide-vue-next';
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

// Estados para búsqueda y paginación
const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 20;

// Referencia para el timeout de búsqueda
let searchTimeout = null;

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
  return Math.ceil(lineasFiltradas.value.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, lineas.value.length);
});

// Filtrar líneas según el término de búsqueda
const lineasFiltradas = computed(() => {
  if (!searchTerm.value) return lineas.value;
  
  const search = searchTerm.value.toLowerCase();
  return lineas.value.filter(linea => {
    return (
      (linea.nombre && linea.nombre.toLowerCase().includes(search)) ||
      (linea.ruc && linea.ruc.toString().toLowerCase().includes(search)) ||
      (linea.proveedor && linea.proveedor.toLowerCase().includes(search))
    );
  });
});

const lineasPaginadas = computed(() => {
  return lineasFiltradas.value.slice(startIndex.value, endIndex.value);
});

// Resetear a la primera página cuando cambia el término de búsqueda
watch(searchTerm, () => {
  currentPage.value = 1;
});

// Función para manejar la búsqueda con debounce sin dependencias externas
const handleSearch = () => {
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    // La búsqueda se actualiza automáticamente a través de la propiedad computada
  }, 300);
};

// Limpiar búsqueda
const clearSearch = () => {
  searchTerm.value = '';
  currentPage.value = 1;
};

// Funciones de paginación
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
    // Desplazarse al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
    // Desplazarse al inicio de la página
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Obtener el RUC del formulario y asegurarse de que sea null si no hay valor
    const ruc = (lineForm.value.proveedorRuc === null || 
                lineForm.value.proveedorRuc === undefined || 
                lineForm.value.proveedorRuc === '' || 
                lineForm.value.proveedorRuc === 'null') ? null : lineForm.value.proveedorRuc;
    
    // Preparar los datos para guardar
    const lineData = {
      nombre_linea: nombre,
      ruc: ruc // Esto será null o el valor del RUC
    };
    

    
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
      
      try {
        // For updates, we handle the response here
        const updateResponse = await actualizarLinea(idNum, lineData);
        
        if (updateResponse && updateResponse.resultado) {
          proxy.$toast.success(updateResponse.mensaje || '¡Línea actualizada exitosamente!', 2000);
          await cargarLineas();
          closeLineModal();
        } else {
          throw new Error(updateResponse?.mensaje || 'Error al actualizar la línea');
        }
      } catch (updateError) {
        // Error al actualizar la línea
        const errorMessage = updateError.response?.data?.mensaje || 'Error al actualizar la línea. Por favor, intente nuevamente.';
        
        if (updateError.response?.data?.field) {
          lineErrors[updateError.response.data.field] = errorMessage;
        } else if (proxy && proxy.$toast) {
          proxy.$toast.error(errorMessage, 3000);
        }
        return; // Exit early on error
      }
    } else {
      // For new lines
      try {
        const response = await crearLinea(lineData);
        if (response && response.resultado) {
          proxy.$toast.success(response.mensaje || '¡Línea creada exitosamente!', 2000);
        } else {
          throw new Error(response?.mensaje || 'Error al crear la línea');
        }
        await cargarLineas();
        closeLineModal();
      } catch (createError) {
        // Error al crear la línea
        const errorMessage = createError.response?.data?.mensaje || 'Error al crear la línea. Por favor, intente nuevamente.';
        
        if (createError.response?.data?.field) {
          lineErrors[createError.response.data.field] = errorMessage;
        } else if (proxy && proxy.$toast) {
          proxy.$toast.error(errorMessage, 3000);
        }
      }
    }
  } catch (err) {
    // Error inesperado al guardar la línea
    const errorMessage = err.response?.data?.mensaje || 'Ocurrió un error inesperado. Por favor, intente nuevamente.';
    
    if (proxy && proxy.$toast) {
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

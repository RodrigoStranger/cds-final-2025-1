<template>
  <div class="page-container">
    <div class="card">
      <div class="card-header">
        <div class="card-header-content">
          <h3>Proveedores</h3>
          <div class="header-actions">
            <!-- Buscador -->
            <div class="search-container">
              <div class="search-input-wrapper">
                <Search class="search-icon" />
                <input 
                  v-model="searchTerm"
                  type="text" 
                  placeholder="Buscar proveedores..."
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
            <button @click="openProveedorModal()" class="button primary">
              <Plus class="icon-small" />
              Nuevo Proveedor
            </button>
          </div>
        </div>
      </div>
      <div class="table-container">
        <!-- Vista de tabla para desktop -->
        <table class="table desktop-only">
          <thead>
            <tr>
              <th>RUC</th>
              <th>Nombre</th>
              <th>Teléfono</th>
              <th class="actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="proveedor in proveedoresPaginados" :key="proveedor.ruc">
              <td>
                <div class="cell-content">
                  <div class="proveedor-cell">
                    <div class="proveedor-avatar">{{ proveedor.nombre?.charAt(0).toUpperCase() || 'P' }}</div>
                    <div class="proveedor-ruc">{{ proveedor.ruc || 'N/A' }}</div>
                  </div>
                </div>
              </td>
              <td>
                <div class="cell-content">
                  {{ proveedor.nombre || 'N/A' }}
                </div>
              </td>
              <td>
                <div class="cell-content">
                  {{ proveedor.telefono || 'N/A' }}
                </div>
              </td>
              <td class="actions">
                <div class="action-buttons">
                  <button @click="editarProveedor(proveedor)" class="icon-button edit">
                    <Edit class="icon-small" />
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="proveedoresFiltrados.length === 0">
              <td colspan="4" class="text-center py-4">
                No se encontraron proveedores
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Vista de tarjetas para móviles -->
        <div class="proveedor-cards mobile-only">
          <div v-for="proveedor in proveedoresPaginados" :key="proveedor.ruc" class="proveedor-card">
            <div class="proveedor-card-header">
              <div class="proveedor-avatar">
                {{ proveedor.nombre?.charAt(0).toUpperCase() || 'P' }}
              </div>
              <div class="proveedor-info">
                <h4 class="proveedor-title">{{ proveedor.nombre || 'N/A' }}</h4>
                <p class="proveedor-ruc">RUC: {{ proveedor.ruc || 'N/A' }}</p>
              </div>
              <button @click="editarProveedor(proveedor)" class="card-edit-button">
                <Edit class="icon-small" />
              </button>
            </div>
            
            <div class="proveedor-card-body">
              <div class="proveedor-detail">
                <span class="detail-label">Teléfono</span>
                <span class="detail-value">{{ proveedor.telefono || 'Sin teléfono' }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Mensaje cuando no hay proveedores -->
        <div v-if="proveedoresFiltrados.length === 0" class="empty-state">
          <div class="empty-icon">
            <Users class="icon-large" />
          </div>
          <h4 v-if="searchTerm">No se encontraron proveedores</h4>
          <h4 v-else>No hay proveedores registrados</h4>
          <p v-if="searchTerm">No hay proveedores que coincidan con "{{ searchTerm }}"</p>
          <p v-else>Agrega proveedores para comenzar a gestionar tu inventario.</p>
          <button v-if="searchTerm" @click="clearSearch" class="button secondary">
            Limpiar búsqueda
          </button>
        </div>
      </div>

      <!-- Paginación única para ambas vistas -->
      <div class="pagination" v-if="proveedoresFiltrados.length > 0">
        <div class="pagination-info">
          Mostrando {{ startIndex + 1 }} - {{ Math.min(endIndex, proveedoresFiltrados.length) }} de {{ proveedoresFiltrados.length }} proveedores
        </div>
        
        <div class="pagination-controls">
          <button 
            class="pagination-button" 
            :disabled="currentPage === 1"
            @click="previousPage"
          >
            Anterior
          </button>
          
          <button class="pagination-button active">
            {{ currentPage }}
          </button>
          
          <button 
            class="pagination-button" 
            :disabled="currentPage >= totalPages"
            @click="nextPage"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Proveedor -->
    <ProveedorModal
      :show="showProveedorModal"
      :proveedor="proveedorActual"
      @close="closeProveedorModal"
      @save="saveProveedor"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, getCurrentInstance } from 'vue';
import { Plus, Edit, Search, X, Users } from 'lucide-vue-next';
import ProveedorModal from '../components/ProveedorModal.vue';
import ProveedorService from '../services/proveedorService';

// Obtener la instancia de la aplicación para acceder a las propiedades globales
const { proxy } = getCurrentInstance();
const toast = proxy.$toast || { 
  success: (msg) => console.log('Success:', msg),
  error: (msg) => console.error('Error:', msg) 
};

// Estados
const proveedores = ref([]);
const proveedoresFiltrados = ref([]);
const loading = ref(false);
const searchTerm = ref('');
const currentPage = ref(1);
const itemsPerPage = 10;

// Estados del modal
const showProveedorModal = ref(false);
const proveedorActual = ref({
  ruc: '',
  nombre: '',
  telefono: ''
});

// Computed
const totalPages = computed(() => {
  return Math.max(1, Math.ceil(proveedoresFiltrados.value.length / itemsPerPage));
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, proveedoresFiltrados.value.length);
});

const proveedoresPaginados = computed(() => {
  return proveedoresFiltrados.value.slice(startIndex.value, endIndex.value);
});

// Métodos
const cargarProveedores = async () => {
  try {
    loading.value = true;
    const data = await ProveedorService.obtenerTodos();
    proveedores.value = data;
    filtrarProveedores();
  } catch (error) {
    console.error('Error al cargar proveedores:', error);
    toast.error('Error al cargar la lista de proveedores');
  } finally {
    loading.value = false;
  }
};

const filtrarProveedores = () => {
  if (!searchTerm.value) {
    proveedoresFiltrados.value = [...proveedores.value];
    return;
  }
  
  const term = searchTerm.value.toLowerCase();
  proveedoresFiltrados.value = proveedores.value.filter(proveedor => 
    (proveedor.nombre && proveedor.nombre.toLowerCase().includes(term)) ||
    (proveedor.ruc && proveedor.ruc.toString().includes(term)) ||
    (proveedor.telefono && proveedor.telefono.toString().includes(term))
  );
  
  // Resetear a la primera página al filtrar
  currentPage.value = 1;
};

const handleSearch = () => {
  // Usamos setTimeout para hacer el debounce manualmente
  if (searchTimeout) clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    filtrarProveedores();
  }, 300);
};

const clearSearch = () => {
  searchTerm.value = '';
  filtrarProveedores();
};

// Paginación
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

// Manejo del modal
const openProveedorModal = (proveedor = null) => {
  if (proveedor) {
    // Editar proveedor existente
    proveedorActual.value = { ...proveedor };
  } else {
    // Nuevo proveedor
    proveedorActual.value = {
      ruc: '',
      nombre: '',
      telefono: ''
    };
  }
  showProveedorModal.value = true;
};

const closeProveedorModal = () => {
  showProveedorModal.value = false;
};

const editarProveedor = (proveedor) => {
  openProveedorModal(proveedor);
};

const saveProveedor = async (proveedorData) => {
  try {
    // Aquí iría la lógica para guardar el proveedor
    // Por ahora solo mostramos un mensaje de éxito
    toast.success('Proveedor guardado correctamente');
    
    // Recargar la lista
    await cargarProveedores();
    closeProveedorModal();
  } catch (error) {
    console.error('Error al guardar el proveedor:', error);
    toast.error('Error al guardar el proveedor');
  }
};

// Watchers
watch(searchTerm, () => {
  handleSearch();
});

// Ciclo de vida
onMounted(() => {
  cargarProveedores();
});

let searchTimeout = null;
</script>

<style scoped>
@import '../styles/pages/ProveedoresPage.css';

/* Estilos específicos para la página de proveedores */
.proveedor-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #4b5563;
  margin-right: 12px;
}

.cell-content {
  display: flex;
  align-items: center;
}

.actions {
  width: 100px;
  text-align: right;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  justify-content: flex-end;
}

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
  color: #15803d !important;
}

.icon-button.edit .icon-small {
  color: #15803d !important;
  width: 1.25rem !important;
  height: 1.25rem !important;
  stroke: currentColor !important;
}

.icon-button.edit:hover .icon-small {
  color: #166534 !important;
}

.icon-button.edit:hover {
  color: #166534 !important;
  background-color: #f0fdf4;
}

.icon {
  width: 18px;
  height: 18px;
}

.text-center {
  text-align: center;
}

.py-4 {
  padding-top: 1rem;
  padding-bottom: 1rem;
}
</style>

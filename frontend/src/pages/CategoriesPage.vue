<template>
  <div class="page-container">
    <div class="card">
      <div class="card-header">
        <div class="card-header-content">
          <h3>Categorías</h3>
          <div class="header-actions">
            <!-- Buscador -->
            <div class="search-container">
              <div class="search-input-wrapper">
                <Search class="search-icon" />
                <input 
                  v-model="searchTerm"
                  type="text" 
                  placeholder="Buscar categorías..."
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
            
            <button @click="openCategoryModal()" class="button primary">
              <Plus class="icon-small" />
              Nueva Categoría
            </button>
          </div>
        </div>
      </div>
      <!-- Indicador de carga -->
      <div v-if="isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Cargando categorías...</p>
      </div>

      <!-- Contenido principal -->
      <div v-else class="table-container">
        <!-- Vista de tabla para desktop -->
        <table class="table desktop-only">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Descripción</th>
              <th class="actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="categoria in categoriasPaginadas" :key="categoria.cod_categoria || categoria.id">
              <td>
                <div class="cell-content">
                  <div class="category-cell">
                    <div class="category-avatar">{{ categoria.nombre.charAt(0).toUpperCase() }}</div>
                    <div class="category-name">{{ categoria.nombre }}</div>
                  </div>
                  <span class="tooltip">{{ categoria.nombre }}</span>
                </div>
              </td>
              <td>
                <div class="cell-content">
                  {{ categoria.descripcion || 'Sin descripción' }}
                  <span class="tooltip" v-if="categoria.descripcion">{{ categoria.descripcion }}</span>
                </div>
              </td>
              <td class="actions">
                <div class="action-buttons">
                  <button @click="openCategoryModal(categoria)" class="icon-button edit">
                    <Edit class="icon-small" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Vista de tarjetas para móviles -->
        <div class="category-mobile-cards mobile-only">
          <div v-for="categoria in categoriasPaginadas" :key="categoria.cod_categoria || categoria.id" class="category-mobile-card">
            <div class="category-mobile-card-header">
              <div class="category-avatar">
                {{ categoria.nombre.charAt(0).toUpperCase() }}
              </div>
              <div class="category-info">
                <h4 class="category-title">{{ categoria.nombre }}</h4>
                <p class="category-description">{{ categoria.descripcion || 'Sin descripción' }}</p>
              </div>
              <button @click="openCategoryModal(categoria)" class="card-edit-button">
                <Edit class="icon-small" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mensaje cuando no hay categorías -->
      <div v-if="!isLoading && categoriasVisibles.length === 0" class="empty-state">
        <div class="empty-icon">
          <Grid class="icon-large" />
        </div>
        <h4 v-if="searchTerm">No se encontraron categorías</h4>
        <h4 v-else>No hay categorías disponibles</h4>
        <p v-if="searchTerm">No hay categorías que coincidan con "{{ searchTerm }}"</p>
        <p v-else>Agrega categorías para organizar tus productos.</p>
        <button v-if="searchTerm" @click="clearSearch" class="button secondary">
          Limpiar búsqueda
        </button>
      </div>
      
      <!-- Paginación -->
      <div v-if="categoriasVisibles.length > 0" class="pagination">
        <div class="pagination-info">
          Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ categoriasVisibles.length }} categorías
          <span v-if="searchTerm" class="filter-indicator">(Búsqueda: "{{ searchTerm }}"")</span>
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

    <!-- Modal para Categorías -->
    <CategoryModal
      :show="showCategoryModal"
      :editing-category="editingCategory"
      :category-form="categoryForm"
      :category-errors="categoryErrors"
      @close="closeCategoryModal"
      @save="saveCategory"
      @clear-error="clearError"
    />

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from 'vue';
import { Plus, Edit, Grid, Search, X } from 'lucide-vue-next';
import CategoryModal from '../components/CategoryModal.vue';
import { useCategorias } from '../composables/useApi.js';

// Usar el composable para categorías
const { 
  categorias, 
  loading, 
  error, 
  cargarCategorias,
  crearCategoria, 
  actualizarCategoria, 
  verificarNombreCategoria 
} = useCategorias();

// Estados para modales
const showCategoryModal = ref(false);
const editingCategory = ref(null);

// Estado para búsqueda
const searchTerm = ref('');

// Estados
const isLoading = ref(true);
const currentPage = ref(1);
const itemsPerPage = 20;

// Obtener las categorías al cargar el componente
onMounted(async () => {
  try {
    await cargarCategorias();
  } finally {
    isLoading.value = false;
  }
});

// Formulario de categoría
const categoryForm = reactive({
  nombre: '',
  descripcion: ''
});

// Errores de validación
const categoryErrors = reactive({
  nombre: ''
});

// Función para filtrar categorías por búsqueda
const filtrarCategoriasPorBusqueda = (categorias, termino) => {
  console.log('Categorías recibidas para filtrar:', categorias);
  
  if (!termino.trim()) return categorias;
  
  const terminoLower = termino.toLowerCase().trim();
  return categorias.filter(categoria => {
    return (
      categoria.nombre?.toLowerCase().includes(terminoLower) ||
      (categoria.descripcion && categoria.descripcion.toLowerCase().includes(terminoLower))
    );
  });
};

// Computed para categorías visibles según la búsqueda
const categoriasVisibles = computed(() => {
  return filtrarCategoriasPorBusqueda(categorias.value, searchTerm.value);
});

// Computed para paginación
const totalPages = computed(() => {
  return Math.ceil(categoriasVisibles.value.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, categoriasVisibles.value.length);
});

const categoriasPaginadas = computed(() => {
  return categoriasVisibles.value.slice(startIndex.value, endIndex.value);
});

// Watch para resetear la página cuando cambie la búsqueda
watch(searchTerm, () => {
  currentPage.value = 1;
});

// Funciones de búsqueda
const handleSearch = () => {
  currentPage.value = 1;
};

const clearSearch = () => {
  searchTerm.value = '';
  currentPage.value = 1;
};

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

// Funciones para categorías
const openCategoryModal = (category = null) => {
  if (category) {
    // Make sure we're using the correct ID field (cod_categoria)
    editingCategory.value = {
      id: category.cod_categoria || category.id,
      ...category
    };
    categoryForm.nombre = category.nombre;
    categoryForm.descripcion = category.descripcion || '';
  } else {
    editingCategory.value = null;
    categoryForm.nombre = '';
    categoryForm.descripcion = '';
  }
  showCategoryModal.value = true;
};

const closeCategoryModal = () => {
  showCategoryModal.value = false;
  editingCategory.value = null;
  clearError();
};

const clearError = (field = null) => {
  if (field) {
    categoryErrors[field] = '';
  } else {
    Object.keys(categoryErrors).forEach(key => categoryErrors[key] = '');
  }
};

// Get the current app instance to access the toast plugin
const { proxy } = getCurrentInstance();

const saveCategory = async () => {
  try {
    // Reset errors
    clearError();
    
    // Validate required fields
    if (!categoryForm.nombre?.trim()) {
      categoryErrors.nombre = 'El nombre es requerido';
      return;
    }

    // Validate name length
    const nombre = categoryForm.nombre.trim();
    if (nombre.length < 2) {
      categoryErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
      return;
    }

    if (nombre.length > 30) {
      categoryErrors.nombre = 'El nombre no puede exceder 30 caracteres';
      return;
    }

    // Check if category name already exists (only for new categories or when name changes)
    if (!editingCategory.value || editingCategory.value.nombre !== nombre) {
      const response = await verificarNombreCategoria(nombre);
      if (response.existe) {
        categoryErrors.nombre = response.mensaje || 'Ya existe una categoría con este nombre';
        return;
      }
    }

    // Prepare the payload
    const categoriaData = {
      nombre: nombre,
      descripcion: categoryForm.descripcion?.trim() || null
    };

    let response;
    
    // Save or update the category
    if (editingCategory.value) {
      // Use cod_categoria if available, otherwise fall back to id
      const categoryId = editingCategory.value.cod_categoria || editingCategory.value.id;
      
      // Ensure we have a valid ID
      if (!categoryId) {
        throw new Error('ID de categoría no proporcionado');
      }
      
      // Convert ID to number and validate
      const idNum = parseInt(categoryId, 10);
      if (isNaN(idNum)) {
        throw new Error('ID de categoría inválido');
      }
      
      // Log the data being sent for debugging

      
      response = await actualizarCategoria(idNum, {
        nombre: categoriaData.nombre,
        descripcion: categoriaData.descripcion || null
      });
      
      if (response && response.resultado) {
        proxy.$toast.success(response.mensaje || '¡Categoría actualizada exitosamente!', 2000);
      } else {
        throw new Error(response?.mensaje || 'Error al actualizar la categoría');
      }
    } else {
      // For create
      response = await crearCategoria(categoriaData);
      
      if (response && response.resultado) {
        proxy.$toast.success(response.mensaje || '¡Categoría creada exitosamente!', 2000);
      } else {
        throw new Error(response?.mensaje || 'Error al crear la categoría');
      }
    }
    
    // Actualizar la lista de categorías recargando desde el servidor
    await cargarCategorias();
    
    // Cerrar el modal después de un breve retraso para mostrar el mensaje de éxito
    setTimeout(() => {
      closeCategoryModal();
    }, 500);
  } catch (err) {
    // Error al guardar la categoría
    
    // Check for validation errors from the server
    if (err.response) {
      // Server responded with a status code outside the 2xx range
      // Error en la respuesta del servidor
      // Código de estado del error
      
      // Handle specific error cases
      if (err.response.status === 400) {
        // Bad Request - validation errors
        if (err.response.data.error) {
          // Show the error message from the server
          proxy.$toast.error(err.response.data.error, 3000);
          
          // If there's a field-specific error, show it in the form
          if (err.response.data.field) {
            categoryErrors[err.response.data.field] = err.response.data.error;
          }
        }
      } else if (err.response.status === 404) {
        // Not Found
        proxy.$toast.error('Categoría no encontrada', 3000);
      } else if (err.response.status === 409) {
        // Conflict - duplicate name
        if (err.response.data.error?.toLowerCase().includes('nombre')) {
          categoryErrors.nombre = err.response.data.error;
        }
        proxy.$toast.error(err.response.data.error || 'Error de validación', 3000);
      } else {
        // Other server errors
        proxy.$toast.error('Error en el servidor al procesar la solicitud', 3000);
      }
    } else if (err.request) {
      // The request was made but no response was received
      // No se recibió respuesta del servidor
      proxy.$toast.error('No se pudo conectar con el servidor', 3000);
    } else if (err.message) {
      // Something happened in setting up the request
      // Error al configurar la petición
      
      // Show user-friendly error messages for known errors
      if (err.message.includes('ID de categoría')) {
        proxy.$toast.error(err.message, 3000);
      } else if (err.message.includes('Error al crear la categoría') || err.message.includes('Error al actualizar la categoría')) {
        proxy.$toast.error(err.message, 3000);
      } else {
        proxy.$toast.error('Error inesperado: ' + err.message, 3000);
      }
    } else {
      // Unknown error
      proxy.$toast.error('Ocurrió un error inesperado', 3000);
    }
  }
};

</script>

<style scoped>
@import '../styles/pages/CategoriesPage.css';
</style>

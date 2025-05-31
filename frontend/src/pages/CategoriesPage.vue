<template>
  <div class="page-container">
    <div class="card">
      <div class="card-header">
        <div class="card-header-content">
          <h3>Categorías</h3>
          <button @click="openCategoryModal()" class="button primary">
            <Plus class="icon-small" />
            Nueva Categoría
          </button>
        </div>
      </div>
      <div class="categories-grid">
        <div v-for="categoria in categoriasPaginadas" :key="categoria.id" class="category-card">
          <div class="category-content">
            <div class="category-icon" v-if="categoria?.nombre">
              {{ categoria.nombre.charAt(0).toUpperCase() }}
            </div>
            <div class="category-info">
              <h4>{{ categoria.nombre }}</h4>
              <p class="category-description">{{ categoria.descripcion || 'Sin descripción' }}</p>
            </div>
          </div>
          <div class="category-actions">
            <div class="action-buttons">
              <button @click="openCategoryModal(categoria)" class="icon-button edit">
                <Edit class="icon-small" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Mensaje cuando no hay categorías -->
      <div v-if="categorias.length === 0" class="empty-state">
        <div class="empty-icon">
          <Grid class="icon-large" />
        </div>
        <h4>No hay categorías disponibles</h4>
        <p>Agrega categorías para organizar tus productos.</p>
      </div>
      
      <!-- Paginación -->
      <div v-if="categorias.length > 0" class="pagination">
        <div class="pagination-info">
          Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ categorias.length }} categorías
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
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue';
import { Plus, Edit, Grid } from 'lucide-vue-next';
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

// Cargar categorías al montar el componente
onMounted(() => {
  cargarCategorias();
});

// Estados para paginación
const currentPage = ref(1);
const itemsPerPage = 20;

// Formulario de categoría
const categoryForm = reactive({
  nombre: '',
  descripcion: ''
});

// Errores de validación
const categoryErrors = reactive({
  nombre: ''
});

// Computed para paginación
const totalPages = computed(() => {
  return Math.ceil(categorias.value.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, categorias.value.length);
});

const categoriasPaginadas = computed(() => {
  return categorias.value.slice(startIndex.value, endIndex.value);
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
      console.log('Updating category with ID:', idNum, 'Data:', categoriaData);
      
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
    
    // Force a refresh of the categories list
    await cargarCategorias();
    
    // Close the modal after a short delay to show the success message
    setTimeout(() => {
      closeCategoryModal();
    }, 500);
  } catch (err) {
    console.error('Error al guardar la categoría:', err);
    
    // Check for validation errors from the server
    if (err.response) {
      // Server responded with a status code outside the 2xx range
      console.error('Error response data:', err.response.data);
      console.error('Error status:', err.response.status);
      
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
      console.error('No response received:', err.request);
      proxy.$toast.error('No se pudo conectar con el servidor', 3000);
    } else if (err.message) {
      // Something happened in setting up the request
      console.error('Request setup error:', err.message);
      
      // Show user-friendly error messages for known errors
      if (err.message.includes('ID de categoría')) {
        proxy.$toast.error(err.message, 3000);
      } else {
        proxy.$toast.error('Error al procesar la solicitud', 3000);
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

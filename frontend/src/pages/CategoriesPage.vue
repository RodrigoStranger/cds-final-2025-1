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
            <div class="category-icon">
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
    />

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Plus, Edit, Grid } from 'lucide-vue-next';
import CategoryModal from '../components/CategoryModal.vue';
import { useCategorias } from '../composables/useApi.js';

// Usar el composable para categorías
const { categorias, loading, error, crearCategoria, actualizarCategoria, verificarNombreCategoria } = useCategorias();

// Estados para modales
const showCategoryModal = ref(false);
const editingCategory = ref(null);

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
    editingCategory.value = category;
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
  Object.keys(categoryErrors).forEach(key => categoryErrors[key] = '');
};

const saveCategory = async () => {
  try {
    if (editingCategory.value) {
      await actualizarCategoria(editingCategory.value.id, categoryForm);
    } else {
      await crearCategoria(categoryForm);
    }
    closeCategoryModal();
  } catch (err) {
    console.error('Error al guardar categoría:', err);
    // Si el error es por nombre duplicado, mostrar mensaje
    if (err.response && err.response.data && err.response.data.error === 'El nombre de la categoría ya existe') {
      categoryErrors.nombre = 'Este nombre de categoría ya existe';
    }
  }
};

onMounted(() => {
  // Trigger the composable to fetch categories on component mount
  useCategorias();
});
</script>

<style scoped>
@import '../styles/pages/CategoriesPage.css';
</style>

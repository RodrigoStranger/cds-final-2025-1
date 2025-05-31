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
  const { categorias, loading, error, crearCategoria, actualizarCategoria } = useCategorias();
  
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
    }
  };
  
  onMounted(() => {
    // Trigger the composable to fetch categories on component mount
    useCategorias();
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
  }
  
  /* Categories Grid */
  .categories-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 1rem;
    padding: 1.5rem;
  }
  
  @media (min-width: 640px) {
    .categories-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 1024px) {
    .categories-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  .category-card {
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    transition: box-shadow 0.2s;
  }
  
  .category-card:hover {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  
  .category-content {
    display: flex;
    align-items: flex-start;
    flex: 1;
  }
  
  .category-icon {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    background-color: #f0fdf4;
    color: #15803d;
    border: 2px solid #15803d;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;
    flex-shrink: 0;
    font-weight: 600;
    font-size: 1rem;
  }
  
  .category-info {
    flex: 1;
  }
  
  .category-info h4 {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.25rem;
  }
  
  .category-description {
    font-size: 0.75rem;
    color: #6b7280;
    margin-bottom: 0.25rem;
  }
  
  .category-actions {
    margin-left: 0.5rem;
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
    padding: 0.25rem;
  }
  
  .icon-button.edit {
    color: #15803d;
  }
  
  .icon-button.edit:hover {
    color: #166534;
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
  
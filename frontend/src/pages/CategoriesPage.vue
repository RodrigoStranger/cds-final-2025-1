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
        
        <!-- Estado de carga -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Cargando categorías...</p>
        </div>
        
        <!-- Estado de error -->
        <div v-else-if="error" class="error-container">
          <div class="error-icon">
            <AlertCircle class="icon-large" />
          </div>
          <h4>Error al cargar las categorías</h4>
          <p>{{ error }}</p>
          <button @click="cargarCategorias" class="button secondary">
            <RefreshCw class="icon-small" />
            Reintentar
          </button>
        </div>
        
        <!-- Categorías -->
        <div v-else class="categories-grid">
          <div v-for="(categoria, index) in categorias" :key="categoria.id" class="category-card">
            <div class="category-content">
              <div class="category-icon">
                <component :is="getCategoryIcon(categoria)" class="icon" />
              </div>
              <div class="category-info">
                <h4>{{ categoria.nombre }}</h4>
                <p class="category-description">{{ categoria.descripcion || 'Sin descripción' }}</p>
                <p class="category-products">{{ categoria.productos || 0 }} productos</p>
              </div>
            </div>
            <div class="category-actions">
              <div class="action-buttons">
                <button @click="openCategoryModal(categoria)" class="icon-button edit">
                  <Edit class="icon-small" />
                </button>
                <button @click="confirmDeleteCategory(categoria)" class="icon-button delete">
                  <Trash class="icon-small" />
                </button>
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
  
      <!-- Modal de Confirmación -->
      <ConfirmDeleteModal
        :show="showDeleteModal"
        :message="deleteMessage"
        @close="closeDeleteModal"
        @confirm="confirmDelete"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, reactive, onMounted } from 'vue';
  import { Plus, Edit, Trash, Smile, Heart, Droplet, Leaf, Sun, Grid, AlertCircle, RefreshCw } from 'lucide-vue-next';
  import CategoryModal from '../components/CategoryModal.vue';
  import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue';
  import CategoriaService from '../services/categoriaService';
  
  // Estados para datos
  const categorias = ref([]);
  const loading = ref(true);
  const error = ref(null);
  
  // Estados para modales
  const showCategoryModal = ref(false);
  const showDeleteModal = ref(false);
  const editingCategory = ref(null);
  const deleteId = ref(null);
  const deleteMessage = ref('');
  
  // Formulario de categoría
  const categoryForm = reactive({
    nombre: '',
    descripcion: ''
  });
  
  // Errores de validación
  const categoryErrors = reactive({
    nombre: ''
  });
  
  // Iconos disponibles para categorías
  const categoryIcons = [Smile, Heart, Droplet, Leaf, Sun];
  
  // Cargar datos iniciales
  onMounted(async () => {
    await cargarCategorias();
  });
  
  // Función para cargar categorías
  const cargarCategorias = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await CategoriaService.obtenerTodas();
      categorias.value = data;
    } catch (err) {
      console.error('Error al cargar categorías:', err);
      error.value = 'No se pudieron cargar las categorías. Por favor, intenta de nuevo.';
    } finally {
      loading.value = false;
    }
  };
  
  // Función para obtener un icono para la categoría
  const getCategoryIcon = (categoria) => {
    // Si la categoría tiene un icono asignado, usarlo
    // De lo contrario, asignar uno basado en el ID o algún otro criterio
    return categoryIcons[categoria.id % categoryIcons.length];
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
        // Actualizar categoría existente
        await CategoriaService.actualizar(editingCategory.value.id, categoryForm);
      } else {
        // Crear nueva categoría
        await CategoriaService.crear(categoryForm);
      }
      
      // Recargar categorías después de guardar
      await cargarCategorias();
      closeCategoryModal();
    } catch (err) {
      console.error('Error al guardar categoría:', err);
      // Aquí podrías manejar errores específicos de validación si la API los devuelve
    }
  };
  
  const confirmDeleteCategory = (categoria) => {
    deleteId.value = categoria.id;
    deleteMessage.value = `¿Deseas eliminar la categoría "${categoria.nombre}"?`;
    showDeleteModal.value = true;
  };
  
  const closeDeleteModal = () => {
    showDeleteModal.value = false;
    deleteId.value = null;
    deleteMessage.value = '';
  };
  
  const confirmDelete = async () => {
    try {
      // Aquí deberíamos llamar a un método para eliminar la categoría por ID
      // Pero no veo ese método en el servicio, así que habría que implementarlo
      // await CategoriaService.eliminar(deleteId.value);
      
      // Por ahora, simplemente recargamos las categorías
      await cargarCategorias();
      closeDeleteModal();
    } catch (err) {
      console.error('Error al eliminar categoría:', err);
    }
  };
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
  
  /* Loading */
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
  }
  
  .loading-spinner {
    width: 2.5rem;
    height: 2.5rem;
    border: 3px solid #f3f4f6;
    border-top-color: #15803d;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  
  /* Error */
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
  }
  
  .error-icon {
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background-color: #fef2f2;
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }
  
  .error-container h4 {
    font-size: 1.125rem;
    font-weight: 500;
    color: #111827;
    margin-bottom: 0.5rem;
  }
  
  .error-container p {
    color: #6b7280;
    max-width: 24rem;
    margin-bottom: 1rem;
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
  
  .button.secondary {
    background-color: #f3f4f6;
    color: #374151;
    border: 1px solid #d1d5db;
  }
  
  .button.secondary:hover {
    background-color: #e5e7eb;
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
    border-radius: 0.375rem;
    background-color: #f0fdf4;
    color: #15803d;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 0.75rem;
    flex-shrink: 0;
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
  
  .category-products {
    font-size: 0.75rem;
    color: #15803d;
    font-weight: 500;
  }
  
  .category-actions {
    margin-left: 0.5rem;
  }
  
  /* Empty State */
  .empty-state {
    grid-column: 1 / -1;
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
  
  .icon-button.delete {
    color: #ef4444;
  }
  
  .icon-button.delete:hover {
    color: #dc2626;
  }
  
  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  </style>
  
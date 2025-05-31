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
          <div v-for="(categoria, index) in categorias" :key="index" class="category-card">
            <div class="category-content">
              <div class="category-icon">
                <component :is="categoria.icon" class="icon" />
              </div>
              <div class="category-info">
                <h4>{{ categoria.nombre }}</h4>
                <p class="category-description">{{ categoria.descripcion || 'Sin descripción' }}</p>
                <p class="category-products">{{ categoria.productos }} productos</p>
              </div>
            </div>
            <div class="category-actions">
              <div class="action-buttons">
                <button @click="openCategoryModal(categoria)" class="icon-button edit">
                  <Edit class="icon-small" />
                </button>
                <button @click="confirmDeleteCategory(index)" class="icon-button delete">
                  <Trash class="icon-small" />
                </button>
              </div>
            </div>
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
  import { ref, reactive } from 'vue';
  import { Plus, Edit, Trash, Smile, Heart, Droplet, Leaf, Sun } from 'lucide-vue-next';
  import CategoryModal from '../components/CategoryModal.vue';
  import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue';
  
  // Estados para modales
  const showCategoryModal = ref(false);
  const showDeleteModal = ref(false);
  const editingCategory = ref(null);
  const deleteIndex = ref(-1);
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
  
  // Datos de categorías
  const categorias = ref([
    { 
      nombre: 'Cuidado Facial', 
      descripcion: 'Productos para el cuidado del rostro',
      productos: 18, 
      icon: Smile 
    },
    { 
      nombre: 'Cuidado Corporal', 
      descripcion: 'Productos para el cuidado del cuerpo',
      productos: 24, 
      icon: Heart 
    },
    { 
      nombre: 'Aromaterapia', 
      descripcion: 'Aceites esenciales y productos aromáticos',
      productos: 12, 
      icon: Droplet 
    },
    { 
      nombre: 'Cuidado Capilar', 
      descripcion: '',
      productos: 9, 
      icon: Leaf 
    },
    { 
      nombre: 'Protección Solar', 
      descripcion: 'Productos de protección solar',
      productos: 6, 
      icon: Sun 
    }
  ]);
  
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
  
  const saveCategory = () => {
    if (editingCategory.value) {
      const index = categorias.value.findIndex(c => c === editingCategory.value);
      if (index !== -1) {
        categorias.value[index].nombre = categoryForm.nombre;
        categorias.value[index].descripcion = categoryForm.descripcion || '';
      }
    } else {
      categorias.value.push({
        nombre: categoryForm.nombre,
        descripcion: categoryForm.descripcion || '',
        productos: 0,
        icon: Heart // Icono por defecto
      });
    }
    closeCategoryModal();
  };
  
  const confirmDeleteCategory = (index) => {
    deleteIndex.value = index;
    deleteMessage.value = `¿Deseas eliminar la categoría "${categorias.value[index].nombre}"?`;
    showDeleteModal.value = true;
  };
  
  const closeDeleteModal = () => {
    showDeleteModal.value = false;
    deleteIndex.value = -1;
    deleteMessage.value = '';
  };
  
  const confirmDelete = () => {
    categorias.value.splice(deleteIndex.value, 1);
    closeDeleteModal();
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
  
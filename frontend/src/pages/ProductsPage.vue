<template>
    <div class="page-container">
      <div class="card">
        <div class="card-header">
          <div class="card-header-content">
            <h3>Productos</h3>
            <button @click="openProductModal()" class="button primary">
              <Plus class="icon-small" />
              Nuevo Producto
            </button>
          </div>
        </div>
        <div class="table-container">
          <table class="table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Precio Compra</th>
                <th>Precio Venta</th>
                <th>Stock</th>
                <th>Categoría</th>
                <th>Línea</th>
                <th class="actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(producto, index) in productos" :key="index">
                <td>
                  <div class="product-cell">
                    <div class="product-image"></div>
                    <div class="product-name">{{ producto.nombre }}</div>
                  </div>
                </td>
                <td>{{ producto.descripcion || 'Sin descripción' }}</td>
                <td>${{ producto.precio_compra }}</td>
                <td>${{ producto.precio_venta }}</td>
                <td>{{ producto.stock }}</td>
                <td>{{ producto.categoria || 'Sin categoría' }}</td>
                <td>{{ producto.linea || 'Sin línea' }}</td>
                <td class="actions">
                  <div class="action-buttons">
                    <button @click="openProductModal(producto)" class="icon-button edit">
                      <Edit class="icon-small" />
                    </button>
                    <button @click="confirmDeleteProduct(index)" class="icon-button delete">
                      <Trash class="icon-small" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="pagination">
          <div class="pagination-info">
            Mostrando 1-{{ productos.length }} de {{ productos.length }} productos
          </div>
          <div class="pagination-controls">
            <button class="pagination-button">Anterior</button>
            <button class="pagination-button active">1</button>
            <button class="pagination-button">Siguiente</button>
          </div>
        </div>
      </div>
  
      <!-- Modal para Productos -->
      <ProductModal
        :show="showProductModal"
        :editing-product="editingProduct"
        :product-form="productForm"
        :product-errors="productErrors"
        :categorias="categorias"
        :lineas="lineas"
        @close="closeProductModal"
        @save="saveProduct"
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
  import { Plus, Edit, Trash } from 'lucide-vue-next';
  import ProductModal from '../components/ProductModal.vue';
  import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue';
  
  defineProps({
    categorias: Array,
    lineas: Array
  });
  
  // Estados para modales
  const showProductModal = ref(false);
  const showDeleteModal = ref(false);
  const editingProduct = ref(null);
  const deleteIndex = ref(-1);
  const deleteMessage = ref('');
  
  // Formulario de producto
  const productForm = reactive({
    nombre: '',
    descripcion: '',
    precio_compra: 0,
    precio_venta: 0,
    stock: 0,
    categoria: '',
    linea: ''
  });
  
  // Errores de validación
  const productErrors = reactive({
    nombre: '',
    precio_compra: '',
    precio_venta: '',
    stock: ''
  });
  
  // Datos de productos
  const productos = ref([
    { 
      nombre: 'Crema Hidratante', 
      descripcion: 'Crema hidratante para piel seca',
      precio_compra: 15.00,
      precio_venta: 29.99, 
      stock: 45, 
      categoria: 'Cuidado Facial', 
      linea: 'Hidratación'
    },
    { 
      nombre: 'Aceite Esencial de Lavanda', 
      descripcion: 'Aceite puro de lavanda para aromaterapia',
      precio_compra: 8.00,
      precio_venta: 15.50, 
      stock: 32, 
      categoria: 'Aromaterapia', 
      linea: 'Esenciales'
    },
    { 
      nombre: 'Jabón de Aloe Vera', 
      descripcion: 'Jabón natural con extracto de aloe vera',
      precio_compra: 4.00,
      precio_venta: 8.75, 
      stock: 78, 
      categoria: 'Cuidado Corporal', 
      linea: 'Limpieza'
    },
    { 
      nombre: 'Mascarilla de Arcilla', 
      descripcion: 'Mascarilla purificante de arcilla verde',
      precio_compra: 10.00,
      precio_venta: 18.99, 
      stock: 21, 
      categoria: 'Cuidado Facial', 
      linea: 'Tratamiento'
    }
  ]);
  
  // Funciones para productos
  const openProductModal = (product = null) => {
    if (product) {
      editingProduct.value = product;
      Object.assign(productForm, product);
    } else {
      editingProduct.value = null;
      resetProductForm();
    }
    showProductModal.value = true;
  };
  
  const closeProductModal = () => {
    showProductModal.value = false;
    editingProduct.value = null;
    resetProductForm();
    Object.keys(productErrors).forEach(key => productErrors[key] = '');
  };
  
  const resetProductForm = () => {
    productForm.nombre = '';
    productForm.descripcion = '';
    productForm.precio_compra = 0;
    productForm.precio_venta = 0;
    productForm.stock = 0;
    productForm.categoria = '';
    productForm.linea = '';
  };
  
  const saveProduct = () => {
    if (editingProduct.value) {
      const index = productos.value.findIndex(p => p === editingProduct.value);
      if (index !== -1) {
        productos.value[index] = { ...productForm };
      }
    } else {
      productos.value.push({ ...productForm });
    }
    closeProductModal();
  };
  
  const confirmDeleteProduct = (index) => {
    deleteIndex.value = index;
    deleteMessage.value = `¿Deseas eliminar el producto "${productos.value[index].nombre}"?`;
    showDeleteModal.value = true;
  };
  
  const closeDeleteModal = () => {
    showDeleteModal.value = false;
    deleteIndex.value = -1;
    deleteMessage.value = '';
  };
  
  const confirmDelete = () => {
    productos.value.splice(deleteIndex.value, 1);
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
  
  /* Table */
  .table-container {
    overflow-x: auto;
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
  }
  
  /* Product Cell */
  .product-cell {
    display: flex;
    align-items: center;
  }
  
  .product-image {
    width: 2.5rem;
    height: 2.5rem;
    background-color: #e5e7eb;
    border-radius: 0.375rem;
    margin-right: 1rem;
  }
  
  .product-name {
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
  
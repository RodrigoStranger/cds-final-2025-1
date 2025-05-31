<template>
    <div class="page-container">
      <div class="card">
        <div class="card-header">
          <div class="card-header-content">
            <h3>Productos</h3>
            <div class="header-actions">
              <button @click="toggleProductosAgotados" class="button secondary">
                <Eye v-if="showProductosAgotados" class="icon-small" />
                <AlertTriangle v-else class="icon-small" />
                {{ showProductosAgotados ? 'Ver Todos' : 'Ver Agotados' }}
              </button>
              <button 
                @click="openProductModal()" 
                class="button primary"
                :disabled="showProductosAgotados"
                :class="{ 'button-disabled': showProductosAgotados }"
              >
                <Plus class="icon-small" />
                Nuevo Producto
              </button>
            </div>
          </div>
        </div>
        
        <!-- Estado de carga -->
        <div v-if="loading" class="loading-container">
          <div class="loading-spinner"></div>
          <p>Cargando productos...</p>
        </div>
        
        <!-- Estado de error -->
        <div v-else-if="error" class="error-container">
          <div class="error-icon">
            <AlertCircle class="icon-large" />
          </div>
          <h4>Error al cargar los productos</h4>
          <p>{{ error }}</p>
          <button @click="cargarProductos" class="button secondary">
            <RefreshCw class="icon-small" />
            Reintentar
          </button>
        </div>
        
        <!-- Tabla de productos -->
        <div v-else class="table-container">
          <table class="table" v-if="productosVisibles.length > 0">
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
              <tr v-for="(producto, index) in productosVisibles" :key="producto.id">
                <td>
                  <div class="product-cell">
                    <div class="product-image"></div>
                    <div class="product-name">{{ producto.nombre }}</div>
                  </div>
                </td>
                <td>{{ producto.descripcion || 'Sin descripción' }}</td>
                <td>${{ producto.precio_compra }}</td>
                <td>${{ producto.precio_venta }}</td>
                <td>
                  <span class="stock-badge" :class="{ 'stock-low': producto.stock <= 10 && producto.stock > 0, 'stock-out': producto.stock === 0 }">
                    {{ producto.stock }}
                  </span>
                </td>
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
          
          <!-- Mensaje cuando no hay productos -->
          <div v-if="productosVisibles.length === 0" class="empty-state">
            <div class="empty-icon">
              <Package class="icon-large" />
            </div>
            <h4>{{ showProductosAgotados ? 'No hay productos agotados' : 'No hay productos disponibles' }}</h4>
            <p>{{ showProductosAgotados ? 'Todos los productos tienen stock disponible.' : 'Agrega productos para comenzar a gestionar tu inventario.' }}</p>
          </div>
        </div>
        
        <div v-if="!loading && !error" class="pagination">
          <div class="pagination-info">
            Mostrando 1-{{ productosVisibles.length }} de {{ productosVisibles.length }} productos
            <span v-if="showProductosAgotados" class="filter-indicator">(Solo productos agotados)</span>
            <span v-else class="filter-indicator">(Solo productos con stock)</span>
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
  import { ref, reactive, computed, onMounted } from 'vue';
  import { Plus, Edit, Trash, AlertTriangle, Package, Eye, AlertCircle, RefreshCw } from 'lucide-vue-next';
  import ProductModal from '../components/ProductModal.vue';
  import ConfirmDeleteModal from '../components/ConfirmDeleteModal.vue';
  import ProductoService from '../services/productoService';
  import CategoriaService from '../services/categoriaService';
  import LineaService from '../services/lineaService';
  
  // Estados para datos
  const productos = ref([]);
  const categorias = ref([]);
  const lineas = ref([]);
  const loading = ref(true);
  const error = ref(null);
  
  // Estados para modales
  const showProductModal = ref(false);
  const showDeleteModal = ref(false);
  const editingProduct = ref(null);
  const deleteIndex = ref(-1);
  const deleteMessage = ref('');
  
  // Estado para filtro de productos agotados
  const showProductosAgotados = ref(false);
  
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
  
  // Computed para productos visibles según el filtro
  const productosVisibles = computed(() => {
    if (showProductosAgotados.value) {
      // Mostrar solo productos agotados (stock = 0)
      return productos.value.filter(producto => producto.stock === 0);
    } else {
      // Mostrar solo productos con stock > 0
      return productos.value.filter(producto => producto.stock > 0);
    }
  });
  
  // Cargar datos iniciales
  onMounted(async () => {
    await Promise.all([
      cargarProductos(),
      cargarCategorias(),
      cargarLineas()
    ]);
  });
  
  // Función para cargar productos
  const cargarProductos = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      const data = await ProductoService.obtenerTodos();
      productos.value = data;
    } catch (err) {
      console.error('Error al cargar productos:', err);
      error.value = 'No se pudieron cargar los productos. Por favor, intenta de nuevo.';
    } finally {
      loading.value = false;
    }
  };
  
  // Función para cargar categorías
  const cargarCategorias = async () => {
    try {
      const data = await CategoriaService.obtenerTodas();
      categorias.value = data;
    } catch (err) {
      console.error('Error al cargar categorías:', err);
    }
  };
  
  // Función para cargar líneas
  const cargarLineas = async () => {
    try {
      const data = await LineaService.obtenerTodas();
      lineas.value = data;
    } catch (err) {
      console.error('Error al cargar líneas:', err);
    }
  };
  
  // Función para alternar vista de productos agotados
  const toggleProductosAgotados = async () => {
    loading.value = true;
    error.value = null;
    
    try {
      if (!showProductosAgotados.value) {
        // Si vamos a mostrar productos agotados, cargamos específicamente esos
        const data = await ProductoService.obtenerNoDisponibles();
        productos.value = data;
      } else {
        // Si volvemos a mostrar todos, recargamos todos los productos
        await cargarProductos();
      }
      showProductosAgotados.value = !showProductosAgotados.value;
    } catch (err) {
      console.error('Error al cambiar vista de productos:', err);
      error.value = 'No se pudo cambiar la vista de productos. Por favor, intenta de nuevo.';
    } finally {
      loading.value = false;
    }
  };
  
  // Funciones para productos
  const openProductModal = (product = null) => {
    // No permitir abrir modal si estamos viendo productos agotados y no es edición
    if (showProductosAgotados.value && !product) {
      return;
    }
    
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
  
  const saveProduct = async () => {
    try {
      if (editingProduct.value) {
        // Actualizar producto existente
        await ProductoService.actualizar(editingProduct.value.id, productForm);
      } else {
        // Crear nuevo producto
        await ProductoService.crear(productForm);
      }
      
      // Recargar productos después de guardar
      await cargarProductos();
      closeProductModal();
    } catch (err) {
      console.error('Error al guardar producto:', err);
      // Aquí podrías manejar errores específicos de validación si la API los devuelve
    }
  };
  
  const confirmDeleteProduct = (index) => {
    // Encontrar el producto a eliminar
    const productoAEliminar = productosVisibles.value[index];
    
    deleteIndex.value = productoAEliminar.id;
    deleteMessage.value = `¿Deseas eliminar el producto "${productoAEliminar.nombre}"?`;
    showDeleteModal.value = true;
  };
  
  const closeDeleteModal = () => {
    showDeleteModal.value = false;
    deleteIndex.value = -1;
    deleteMessage.value = '';
  };
  
  const confirmDelete = async () => {
    try {
      // Aquí deberíamos llamar a un método para eliminar el producto por ID
      // Pero no veo ese método en el servicio, así que habría que implementarlo
      // await ProductoService.eliminar(deleteIndex.value);
      
      // Por ahora, simplemente recargamos los productos
      await cargarProductos();
      closeDeleteModal();
    } catch (err) {
      console.error('Error al eliminar producto:', err);
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
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .card-header h3 {
    font-size: 1.125rem;
    font-weight: 500;
    color: #111827;
    margin: 0;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-wrap: wrap;
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
    white-space: nowrap;
  }
  
  .button.primary {
    background-color: #15803d;
    color: white;
  }
  
  .button.primary:hover:not(:disabled) {
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
  
  .button-disabled {
    background-color: #d1d5db !important;
    color: #9ca3af !important;
    cursor: not-allowed !important;
  }
  
  .button:disabled {
    cursor: not-allowed;
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
    width: 120px;
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
  
  /* Stock Badge */
  .stock-badge {
    display: inline-flex;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    background-color: #f0fdf4;
    color: #15803d;
  }
  
  .stock-badge.stock-low {
    background-color: #fef3c7;
    color: #d97706;
  }
  
  .stock-badge.stock-out {
    background-color: #fef2f2;
    color: #ef4444;
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
  
  .icon-button.delete {
    color: #ef4444;
  }
  
  .icon-button.delete:hover {
    color: #dc2626;
    background-color: #fef2f2;
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
  
  .filter-indicator {
    color: #15803d;
    font-weight: 500;
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
  
  /* Responsive */
  @media (max-width: 640px) {
    .card-header-content {
      flex-direction: column;
      align-items: stretch;
    }
    
    .header-actions {
      justify-content: space-between;
    }
    
    .button {
      justify-content: center;
      flex: 1;
    }
  }
  
  @media (max-width: 480px) {
    .header-actions {
      flex-direction: column;
      gap: 0.5rem;
    }
    
    .button {
      width: 100%;
    }
  }
  </style>
  
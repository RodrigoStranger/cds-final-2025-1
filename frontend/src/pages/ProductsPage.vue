<template>
  <div class="page-container">
    <div class="card">
      <div class="card-header">
        <div class="card-header-content">
          <h3>Productos</h3>
          <div class="header-actions">
            <!-- Buscador -->
            <div class="search-container">
              <div class="search-input-wrapper">
                <Search class="search-icon" />
                <input 
                  v-model="searchTerm"
                  type="text" 
                  placeholder="Buscar productos..."
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
            <tr v-for="(producto, index) in productosPaginados" :key="producto.id">
              <td data-label="Nombre">
                <div class="cell-content">
                  <div class="product-cell">
                    <div class="product-image">
                      {{ producto.nombre.charAt(0).toUpperCase() }}
                    </div>
                    <div class="product-name">{{ producto.nombre }}</div>
                  </div>
                  <span class="tooltip">{{ producto.nombre }}</span>
                </div>
              </td>
              <td data-label="Descripción">
                <div class="cell-content">
                  {{ producto.descripcion || 'Sin descripción' }}
                  <span class="tooltip" v-if="producto.descripcion">{{ producto.descripcion }}</span>
                </div>
              </td>
              <td data-label="Precio Compra">S/. {{ producto.precio_compra }}</td>
              <td data-label="Precio Venta">S/. {{ producto.precio_venta }}</td>
              <td data-label="Stock">
                <span class="stock-badge" :class="{ 'stock-low': producto.stock <= 10 && producto.stock > 0, 'stock-out': producto.stock === 0 }">
                  {{ producto.stock }}
                </span>
              </td>
              <td data-label="Categoría">
                <div class="cell-content">
                  {{ producto.categoria || 'Sin categoría' }}
                  <span class="tooltip" v-if="producto.categoria">{{ producto.categoria }}</span>
                </div>
              </td>
              <td data-label="Línea">
                <div class="cell-content">
                  {{ producto.linea || 'Sin línea' }}
                  <span class="tooltip" v-if="producto.linea">{{ producto.linea }}</span>
                </div>
              </td>
              <td class="actions">
                <div class="action-buttons">
                  <button @click="openProductModal(producto)" class="icon-button edit">
                    <Edit class="icon-small" />
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
          <h4 v-if="searchTerm">No se encontraron productos</h4>
          <h4 v-else-if="showProductosAgotados">No hay productos agotados</h4>
          <h4 v-else>No hay productos disponibles</h4>
          <p v-if="searchTerm">No hay productos que coincidan con "{{ searchTerm }}"</p>
          <p v-else-if="showProductosAgotados">Todos los productos tienen stock disponible.</p>
          <p v-else>Agrega productos para comenzar a gestionar tu inventario.</p>
          <button v-if="searchTerm" @click="clearSearch" class="button secondary">
            Limpiar búsqueda
          </button>
        </div>
      </div>
      <div class="pagination" v-if="productosVisibles.length > 0">
        <div class="pagination-info">
          Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ productosVisibles.length }} productos
          <span v-if="searchTerm" class="filter-indicator">(Búsqueda: "{{ searchTerm }}")</span>
          <span v-else-if="showProductosAgotados" class="filter-indicator">(Solo productos agotados)</span>
          <span v-else class="filter-indicator">(Solo productos con stock)</span>
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

    <!-- Modal para Productos -->
    <ProductModal
      :show="showProductModal"
      :editing-product="editingProduct"
      :product-form="productForm"
      :product-errors="productErrors"
      :categorias="categorias"
      :lineas="lineas"
      @update:productForm="updateProductForm"
      @close="closeProductModal"
      @save="saveProduct"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from 'vue';
import { Plus, Edit, AlertTriangle, Package, Eye, Search, X } from 'lucide-vue-next';
import ProductModal from '../components/ProductModal.vue';
import { useProductos, useCategorias, useLineas } from '../composables/useApi.js';

// Get app instance for toast
const { proxy } = getCurrentInstance();

// Use composables
const { productos, loading, error, crearProducto, actualizarProducto, cargarProductos } = useProductos();
const { categorias, cargarCategorias } = useCategorias();
const { lineas, cargarLineas } = useLineas();

// Load data when component mounts
onMounted(async () => {
  await Promise.all([
    cargarCategorias(),
    cargarLineas(),
    cargarProductos()
  ]);
});

// Estados para modales
const showProductModal = ref(false);
const editingProduct = ref(null);

// Estado para filtro de productos agotados
const showProductosAgotados = ref(false);

// Estado para búsqueda
const searchTerm = ref('');

// Estados para paginación
const currentPage = ref(1);
const itemsPerPage = 20;

// Formulario de producto
const productForm = reactive({
  nombre: '',
  descripcion: '',
  precio_compra: 0,
  precio_venta: 0,
  stock: 0,
  cod_categoria: null,
  cod_linea: null
});

// Errores de validación
const productErrors = reactive({
  nombre: '',
  precio_compra: '',
  precio_venta: '',
  stock: ''
});

// Función para filtrar productos por búsqueda
const filtrarProductosPorBusqueda = (productos, termino) => {
  if (!termino.trim()) return productos;
  
  const terminoLower = termino.toLowerCase().trim();
  return productos.filter(producto => {
    return (
      producto.nombre?.toLowerCase().includes(terminoLower) ||
      producto.descripcion?.toLowerCase().includes(terminoLower) ||
      producto.categoria?.toLowerCase().includes(terminoLower) ||
      producto.linea?.toLowerCase().includes(terminoLower)
    );
  });
};

// Computed para productos visibles según el filtro y búsqueda
const productosVisibles = computed(() => {
  let productosBase = productos.value;
  
  // Aplicar filtro de stock
  if (showProductosAgotados.value) {
    productosBase = productosBase.filter(producto => producto.stock === 0);
  } else {
    productosBase = productosBase.filter(producto => producto.stock > 0);
  }
  
  // Aplicar filtro de búsqueda
  return filtrarProductosPorBusqueda(productosBase, searchTerm.value);
});

// Computed para paginación
const totalPages = computed(() => {
  return Math.ceil(productosVisibles.value.length / itemsPerPage);
});

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage;
});

const endIndex = computed(() => {
  return Math.min(startIndex.value + itemsPerPage, productosVisibles.value.length);
});

const productosPaginados = computed(() => {
  return productosVisibles.value.slice(startIndex.value, endIndex.value);
});

// Watch para resetear la página cuando cambie la búsqueda o el filtro
watch([searchTerm, showProductosAgotados], () => {
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

// Función para alternar vista de productos agotados
const toggleProductosAgotados = () => {
  showProductosAgotados.value = !showProductosAgotados.value;
  currentPage.value = 1; // Resetear a la primera página
};

// Funciones para productos
const updateProductForm = (newFormData) => {
  Object.assign(productForm, newFormData);
};

const openProductModal = async (product = null) => {
  if (product) {
    // Asegurarse de que las categorías y líneas estén cargadas
    await Promise.all([
      categorias.value.length === 0 ? cargarCategorias() : Promise.resolve(),
      lineas.value.length === 0 ? cargarLineas() : Promise.resolve()
    ]);
    
    editingProduct.value = product;
    
    // Manejar la categoría
    let categoriaId = null;
    if (product.categoria && product.categoria !== 'Sin categoría') {
      // Buscar por ID primero
      categoriaId = product.cod_categoria || null;
      
      // Si no encontramos por ID, buscar por nombre
      if (!categoriaId) {
        const categoria = categorias.value.find(c => c.nombre === product.categoria);
        categoriaId = categoria?.cod_categoria || null;
      }
    } else {
      // Si es 'Sin categoría' o no hay categoría, establecer como null
      categoriaId = null;
    }
    
    // Manejar la línea
    let lineaId = null;
    if (product.linea && product.linea !== 'Sin línea') {
      // Buscar por ID primero
      lineaId = product.cod_linea || null;
      
      // Si no encontramos por ID, buscar por nombre
      if (!lineaId) {
        const linea = lineas.value.find(l => 
          (l.nombre === product.linea) || 
          (l.nombre_linea === product.linea) ||
          (l.id && l.id.toString() === product.linea) ||
          (l.cod_linea && l.cod_linea.toString() === product.linea)
        );
        lineaId = linea?.cod_linea || linea?.id || null;
      }
    } else {
      // Si es 'Sin línea' o no hay línea, establecer como null
      lineaId = null;
    }
    
    // Inicializar el formulario con los datos del producto
    Object.assign(productForm, {
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio_compra: product.precio_compra,
      precio_venta: product.precio_venta,
      stock: product.stock,
      cod_categoria: categoriaId,
      cod_linea: lineaId,
      activo: product.activo !== undefined ? product.activo : true
    });
    
    console.log('Datos del producto a editar:', {
      ...product,
      cod_categoria: productForm.cod_categoria,
      cod_linea: productForm.cod_linea,
      categoriasDisponibles: categorias.value,
      lineasDisponibles: lineas.value
    });
  } else {
    editingProduct.value = null;
    resetProductForm();
    // Asegurarse de que el producto nuevo esté activo por defecto
    productForm.activo = true;
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
  productForm.descripcion = null; // Establecer como null por defecto
  productForm.precio_compra = 0;
  productForm.precio_venta = 0;
  productForm.stock = 0;
  productForm.cod_categoria = null;
  productForm.cod_linea = null;
  productForm.activo = true; // Por defecto, un nuevo producto está activo
};

const saveProduct = async (productoData) => {
  console.log('Iniciando saveProduct');
  
  // Usar los datos del formulario o los proporcionados en el parámetro
  const datosAEnviar = productoData || {
    ...productForm,
    // Asegurar que la descripción sea null si está vacía
    descripcion: productForm.descripcion?.trim() || null,
    // Establecer estado como activo por defecto (1 = activo, 0 = inactivo)
    estado: 1
  };
  
  
  console.log('Datos a enviar:', JSON.parse(JSON.stringify(datosAEnviar)));
  
  try {
    if (editingProduct.value) {
      // Asegurarse de que el ID sea numérico
      const productId = parseInt(editingProduct.value.id || editingProduct.value.cod_producto);
      console.log('Actualizando producto existente con ID:', productId);
      const resultado = await actualizarProducto(productId, datosAEnviar);
      console.log('Producto actualizado:', resultado);
      
      // Recargar los productos después de actualizar
      await cargarProductos();
      
      // Mostrar notificación de éxito
      proxy.$toast.success('Producto actualizado correctamente', 3000);
    } else {
      console.log('Creando nuevo producto');
      const resultado = await crearProducto(datosAEnviar);
      console.log('Producto creado:', resultado);
      
      // Recargar los productos después de crear uno nuevo
      await cargarProductos();
      
      // Mostrar notificación de éxito
      proxy.$toast.success('Producto creado correctamente', 3000);
    }
    closeProductModal();
  } catch (err) {
    console.error('Error al guardar producto:', err);
    if (err.response) {
      console.error('Detalles del error:', err.response.data);
      console.error('Estado del error:', err.response.status);
      
      // Mostrar mensaje de error al usuario
      const errorMessage = err.response.data?.mensaje || 'Error al guardar el producto';
      proxy.$toast.error(errorMessage, 3000);
    } else {
      proxy.$toast.error('Error de conexión con el servidor', 3000);
    }
  }
};
</script>

<style scoped>
@import '../styles/pages/ProductsPage.css';
</style>

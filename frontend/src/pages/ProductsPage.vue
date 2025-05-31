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
              <td>
                <div class="product-cell">
                  <div class="product-image">
                    {{ producto.nombre.charAt(0).toUpperCase() }}
                  </div>
                  <div class="product-name">{{ producto.nombre }}</div>
                </div>
              </td>
              <td>{{ producto.descripcion || 'Sin descripción' }}</td>
              <td>S/. {{ producto.precio_compra }}</td>
              <td>S/. {{ producto.precio_venta }}</td>
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
      <div class="pagination">
        <div class="pagination-info">
          Mostrando {{ startIndex + 1 }}-{{ endIndex }} de {{ productosVisibles.length }} productos
          <span v-if="showProductosAgotados" class="filter-indicator">(Solo productos agotados)</span>
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
      @close="closeProductModal"
      @save="saveProduct"
    />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { Plus, Edit, AlertTriangle, Package, Eye } from 'lucide-vue-next';
import ProductModal from '../components/ProductModal.vue';
import { useProductos, useCategorias, useLineas } from '../composables/useApi.js';

// Usar los composables
const { productos, loading, error, crearProducto, actualizarProducto } = useProductos();
const { categorias, cargarCategorias } = useCategorias();
const { lineas, cargarLineas } = useLineas();

// Cargar datos al montar el componente
onMounted(async () => {
  await cargarCategorias();
  await cargarLineas();
});

// Estados para modales
const showProductModal = ref(false);
const editingProduct = ref(null);

// Estado para filtro de productos agotados
const showProductosAgotados = ref(false);

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
const openProductModal = (product = null) => {
  // No permitir abrir modal si estamos viendo productos agotados y no es edición
  if (showProductosAgotados.value && !product) {
    return;
  }
  
  if (product) {
    editingProduct.value = product;
    // Copiar todas las propiedades del producto al formulario
    Object.keys(productForm).forEach(key => {
      if (key in product) {
        productForm[key] = product[key];
      }
    });
    // Asegurarse de que los campos de relación se copien correctamente
    if (product.cod_categoria) productForm.cod_categoria = product.cod_categoria;
    if (product.cod_linea) productForm.cod_linea = product.cod_linea;
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
  productForm.descripcion = null; // Establecer como null por defecto
  productForm.precio_compra = 0;
  productForm.precio_venta = 0;
  productForm.stock = 0;
  productForm.cod_categoria = null;
  productForm.cod_linea = null;
};

const saveProduct = async () => {
  console.log('Iniciando saveProduct');
  
  // Crear una copia del formulario para modificar los datos
  const datosAEnviar = {
    ...productForm,
    // Asegurar que la descripción sea null si está vacía
    descripcion: productForm.descripcion?.trim() || null
  };
  
  console.log('Datos a enviar:', JSON.parse(JSON.stringify(datosAEnviar)));
  
  try {
    if (editingProduct.value) {
      console.log('Actualizando producto existente con ID:', editingProduct.value.id);
      const resultado = await actualizarProducto(editingProduct.value.id, datosAEnviar);
      console.log('Producto actualizado:', resultado);
    } else {
      console.log('Creando nuevo producto');
      const resultado = await crearProducto(datosAEnviar);
      console.log('Producto creado:', resultado);
    }
    closeProductModal();
  } catch (err) {
    console.error('Error al guardar producto:', err);
    if (err.response) {
      console.error('Detalles del error:', err.response.data);
      console.error('Estado del error:', err.response.status);
    }
  }
};
</script>

<style scoped>
@import '../styles/pages/ProductsPage.css';
</style>

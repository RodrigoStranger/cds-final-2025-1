<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <div class="sidebar">
      <div class="logo">
        <h1>FabiaNatura</h1>
      </div>
      <nav class="sidebar-nav">
        <div 
          v-for="(tab, index) in tabs" 
          :key="index" 
          @click="activeTab = tab.id"
          class="sidebar-item"
          :class="{ active: activeTab === tab.id }"
        >
          <component :is="tab.icon" class="icon" />
          <span>{{ tab.name }}</span>
        </div>
      </nav>
    </div>

    <!-- Main Content -->
    <div class="main-content">
      <!-- Header -->
      <header class="header">
        <div class="header-container">
          <div class="mobile-menu">
            <button @click="toggleMobileMenu" class="menu-button">
              <Menu class="icon" />
            </button>
            <h1>FabiaNatura</h1>
          </div>
          <div class="header-title">
            <h2>Dashboard</h2>
          </div>
          <div class="header-actions">
            <button class="icon-button">
              <Bell class="icon" />
            </button>
            <div class="avatar">FN</div>
          </div>
        </div>

        <!-- Tab Navigation -->
        <div class="tabs-container">
          <nav class="tabs">
            <div 
              v-for="(tab, index) in tabs" 
              :key="index" 
              @click="activeTab = tab.id"
              class="tab"
              :class="{ active: activeTab === tab.id }"
            >
              {{ tab.name }}
            </div>
          </nav>
        </div>
      </header>

      <!-- Mobile Menu -->
      <div v-if="mobileMenuOpen" class="mobile-sidebar-overlay">
        <div class="mobile-sidebar-backdrop" @click="toggleMobileMenu"></div>
        <div class="mobile-sidebar">
          <div class="mobile-sidebar-header">
            <h1>FabiaNatura</h1>
            <button @click="toggleMobileMenu" class="close-button">
              <X class="icon" />
            </button>
          </div>
          <nav class="mobile-sidebar-nav">
            <div 
              v-for="(tab, index) in tabs" 
              :key="index" 
              @click="selectMobileTab(tab.id)"
              class="mobile-sidebar-item"
              :class="{ active: activeTab === tab.id }"
            >
              <component :is="tab.icon" class="icon" />
              <span>{{ tab.name }}</span>
            </div>
          </nav>
        </div>
      </div>

      <!-- Main Content Area -->
      <main class="content">
        <div class="content-container">
          <!-- Tab Content - PRODUCTOS -->
          <div v-if="activeTab === 'productos'" class="card">
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
                    <th>Estado</th>
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
                    <td>
                      <span class="badge" :class="{ active: producto.estado }">
                        {{ producto.estado ? 'Activo' : 'Inactivo' }}
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

          <!-- Tab Content - LÍNEAS -->
          <div v-if="activeTab === 'lineas'" class="card">
            <div class="card-header">
              <div class="card-header-content">
                <h3>Líneas de Productos</h3>
                <button @click="openLineModal()" class="button primary">
                  <Plus class="icon-small" />
                  Nueva Línea
                </button>
              </div>
            </div>
            <div class="table-container">
              <table class="table">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>RUC</th>
                    <th>Productos</th>
                    <th class="actions">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(linea, index) in lineas" :key="index">
                    <td>
                      <div class="line-cell">
                        <div class="line-avatar">{{ linea.nombre.charAt(0) }}</div>
                        <div class="line-name">{{ linea.nombre }}</div>
                      </div>
                    </td>
                    <td>{{ linea.ruc || 'Sin RUC' }}</td>
                    <td>{{ linea.productos }}</td>
                    <td class="actions">
                      <div class="action-buttons">
                        <button @click="openLineModal(linea)" class="icon-button edit">
                          <Edit class="icon-small" />
                        </button>
                        <button @click="confirmDeleteLine(index)" class="icon-button delete">
                          <Trash class="icon-small" />
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tab Content - CATEGORÍAS -->
          <div v-if="activeTab === 'categorias'" class="card">
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
        </div>
      </main>
    </div>

    <!-- Modal para Productos -->
    <div v-if="showProductModal" class="modal-overlay" @click="closeProductModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
          <button @click="closeProductModal" class="close-button">
            <X class="icon" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProduct">
            <div class="form-grid">
              <div class="form-group">
                <label>Nombre *</label>
                <input 
                  v-model="productForm.nombre" 
                  type="text" 
                  required
                  :class="{ error: productErrors.nombre }"
                  placeholder="Ingrese el nombre del producto"
                >
                <span v-if="productErrors.nombre" class="error-message">{{ productErrors.nombre }}</span>
              </div>
              <div class="form-group">
                <label>Descripción</label>
                <textarea 
                  v-model="productForm.descripcion"
                  placeholder="Descripción del producto (opcional)"
                ></textarea>
              </div>
              <div class="form-group">
                <label>Precio Compra *</label>
                <input 
                  v-model="productForm.precio_compra" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  required
                  :class="{ error: productErrors.precio_compra }"
                  placeholder="0.00"
                >
                <span v-if="productErrors.precio_compra" class="error-message">{{ productErrors.precio_compra }}</span>
              </div>
              <div class="form-group">
                <label>Precio Venta *</label>
                <input 
                  v-model="productForm.precio_venta" 
                  type="number" 
                  step="0.01" 
                  min="0"
                  required
                  :class="{ error: productErrors.precio_venta }"
                  placeholder="0.00"
                >
                <span v-if="productErrors.precio_venta" class="error-message">{{ productErrors.precio_venta }}</span>
              </div>
              <div class="form-group">
                <label>Stock *</label>
                <input 
                  v-model="productForm.stock" 
                  type="number" 
                  min="0"
                  required
                  :class="{ error: productErrors.stock }"
                  placeholder="0"
                >
                <span v-if="productErrors.stock" class="error-message">{{ productErrors.stock }}</span>
              </div>
              <div class="form-group">
                <label>Estado</label>
                <select v-model="productForm.estado">
                  <option :value="true">Activo</option>
                  <option :value="false">Inactivo</option>
                </select>
              </div>
              <div class="form-group">
                <label>Categoría</label>
                <select v-model="productForm.categoria">
                  <option value="">Sin categoría</option>
                  <option v-for="cat in categorias" :key="cat.nombre" :value="cat.nombre">
                    {{ cat.nombre }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Línea</label>
                <select v-model="productForm.linea">
                  <option value="">Sin línea</option>
                  <option v-for="line in lineas" :key="line.nombre" :value="line.nombre">
                    {{ line.nombre }}
                  </option>
                </select>
              </div>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeProductModal" class="button secondary">Cancelar</button>
              <button type="submit" class="button primary">{{ editingProduct ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal para Líneas -->
    <div v-if="showLineModal" class="modal-overlay" @click="closeLineModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingLine ? 'Editar Línea' : 'Nueva Línea' }}</h3>
          <button @click="closeLineModal" class="close-button">
            <X class="icon" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveLine">
            <div class="form-group">
              <label>Nombre *</label>
              <input 
                v-model="lineForm.nombre" 
                type="text" 
                required
                :class="{ error: lineErrors.nombre }"
                placeholder="Ingrese el nombre de la línea"
              >
              <span v-if="lineErrors.nombre" class="error-message">{{ lineErrors.nombre }}</span>
            </div>
            <div class="form-group">
              <label>RUC</label>
              <input 
                v-model="lineForm.ruc" 
                type="text"
                :class="{ error: lineErrors.ruc }"
                placeholder="RUC de la línea (opcional)"
                @input="formatRuc"
              >
              <span v-if="lineErrors.ruc" class="error-message">{{ lineErrors.ruc }}</span>
              <span class="help-text">El RUC debe tener 11 dígitos</span>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeLineModal" class="button secondary">Cancelar</button>
              <button type="submit" class="button primary">{{ editingLine ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal para Categorías -->
    <div v-if="showCategoryModal" class="modal-overlay" @click="closeCategoryModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
          <button @click="closeCategoryModal" class="close-button">
            <X class="icon" />
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCategory">
            <div class="form-group">
              <label>Nombre *</label>
              <input 
                v-model="categoryForm.nombre" 
                type="text" 
                required
                :class="{ error: categoryErrors.nombre }"
                placeholder="Ingrese el nombre de la categoría"
              >
              <span v-if="categoryErrors.nombre" class="error-message">{{ categoryErrors.nombre }}</span>
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea 
                v-model="categoryForm.descripcion"
                placeholder="Descripción de la categoría (opcional)"
              ></textarea>
            </div>
            <div class="modal-actions">
              <button type="button" @click="closeCategoryModal" class="button secondary">Cancelar</button>
              <button type="submit" class="button primary">{{ editingCategory ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación de Eliminación -->
    <div v-if="showDeleteModal" class="modal-overlay" @click="closeDeleteModal">
      <div class="modal delete-modal" @click.stop>
        <div class="modal-header">
          <h3>Confirmar Eliminación</h3>
          <button @click="closeDeleteModal" class="close-button">
            <X class="icon" />
          </button>
        </div>
        <div class="modal-body">
          <div class="delete-content">
            <div class="delete-icon">
              <Trash class="icon-large" />
            </div>
            <div class="delete-text">
              <h4>¿Estás seguro?</h4>
              <p>{{ deleteMessage }}</p>
              <p class="warning-text">Esta acción no se puede deshacer.</p>
            </div>
          </div>
          <div class="modal-actions">
            <button type="button" @click="closeDeleteModal" class="button secondary">Cancelar</button>
            <button @click="confirmDelete" class="button danger">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { 
  Menu, 
  X, 
  Bell, 
  Package, 
  Tag, 
  Grid, 
  Plus, 
  Edit, 
  Trash, 
  Leaf, 
  Droplet, 
  Sun, 
  Heart, 
  Smile 
} from 'lucide-vue-next';

// Estado para el menú móvil
const mobileMenuOpen = ref(false);
const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const selectMobileTab = (tabId) => {
  activeTab.value = tabId;
  mobileMenuOpen.value = false;
};

// Pestañas
const activeTab = ref('productos');
const tabs = [
  { id: 'productos', name: 'Productos', icon: Package },
  { id: 'lineas', name: 'Líneas', icon: Tag },
  { id: 'categorias', name: 'Categorías', icon: Grid }
];

// Estados para modales
const showProductModal = ref(false);
const showLineModal = ref(false);
const showCategoryModal = ref(false);
const showDeleteModal = ref(false);
const editingProduct = ref(null);
const editingLine = ref(null);
const editingCategory = ref(null);

// Estados para confirmación de eliminación
const deleteType = ref('');
const deleteIndex = ref(-1);
const deleteMessage = ref('');

// Formularios
const productForm = reactive({
  nombre: '',
  descripcion: '',
  precio_compra: 0,
  precio_venta: 0,
  stock: 0,
  estado: true,
  categoria: '',
  linea: ''
});

const lineForm = reactive({
  nombre: '',
  ruc: ''
});

const categoryForm = reactive({
  nombre: '',
  descripcion: ''
});

// Estados de validación
const productErrors = reactive({
  nombre: '',
  precio_compra: '',
  precio_venta: '',
  stock: ''
});

const lineErrors = reactive({
  nombre: '',
  ruc: ''
});

const categoryErrors = reactive({
  nombre: ''
});

// Funciones de validación actualizadas
const validateProduct = () => {
  let isValid = true;
  
  // Reset errores
  Object.keys(productErrors).forEach(key => productErrors[key] = '');
  
  // Validar nombre (OBLIGATORIO)
  if (!productForm.nombre.trim()) {
    productErrors.nombre = 'El nombre es requerido';
    isValid = false;
  } else if (productForm.nombre.length < 2) {
    productErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    isValid = false;
  } else if (productForm.nombre.length > 50) {
    productErrors.nombre = 'El nombre no puede exceder 50 caracteres';
    isValid = false;
  }
  
  // Validar precio de compra (OBLIGATORIO)
  if (!productForm.precio_compra && productForm.precio_compra !== 0) {
    productErrors.precio_compra = 'El precio de compra es requerido';
    isValid = false;
  } else if (productForm.precio_compra < 0) {
    productErrors.precio_compra = 'El precio de compra no puede ser negativo';
    isValid = false;
  } else if (productForm.precio_compra > 999999) {
    productErrors.precio_compra = 'El precio de compra es demasiado alto';
    isValid = false;
  }
  
  // Validar precio de venta (OBLIGATORIO)
  if (!productForm.precio_venta && productForm.precio_venta !== 0) {
    productErrors.precio_venta = 'El precio de venta es requerido';
    isValid = false;
  } else if (productForm.precio_venta < 0) {
    productErrors.precio_venta = 'El precio de venta no puede ser negativo';
    isValid = false;
  } else if (productForm.precio_venta > 999999) {
    productErrors.precio_venta = 'El precio de venta es demasiado alto';
    isValid = false;
  }
  
  // Validar stock (OBLIGATORIO)
  if (!productForm.stock && productForm.stock !== 0) {
    productErrors.stock = 'El stock es requerido';
    isValid = false;
  } else if (productForm.stock < 0) {
    productErrors.stock = 'El stock no puede ser negativo';
    isValid = false;
  } else if (productForm.stock > 999999) {
    productErrors.stock = 'El stock es demasiado alto';
    isValid = false;
  }
  
  // Validar nombre único (solo para productos nuevos)
  if (!editingProduct.value) {
    const existingProduct = productos.value.find(p => 
      p.nombre.toLowerCase() === productForm.nombre.toLowerCase().trim()
    );
    if (existingProduct) {
      productErrors.nombre = 'Ya existe un producto con este nombre';
      isValid = false;
    }
  }
  
  return isValid;
};

const validateLine = () => {
  let isValid = true;
  
  // Reset errores
  Object.keys(lineErrors).forEach(key => lineErrors[key] = '');
  
  // Validar nombre (OBLIGATORIO)
  if (!lineForm.nombre.trim()) {
    lineErrors.nombre = 'El nombre es requerido';
    isValid = false;
  } else if (lineForm.nombre.length < 2) {
    lineErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    isValid = false;
  } else if (lineForm.nombre.length > 30) {
    lineErrors.nombre = 'El nombre no puede exceder 30 caracteres';
    isValid = false;
  }
  
  // Validar RUC (OPCIONAL, pero si se ingresa debe ser válido)
  if (lineForm.ruc && lineForm.ruc.trim()) {
    if (!/^\d{11}$/.test(lineForm.ruc)) {
      lineErrors.ruc = 'El RUC debe tener exactamente 11 dígitos';
      isValid = false;
    }
    
    // Validar RUC único (solo si se ingresa)
    if (!editingLine.value) {
      const existingRuc = lineas.value.find(l => l.ruc === lineForm.ruc);
      if (existingRuc) {
        lineErrors.ruc = 'Ya existe una línea con este RUC';
        isValid = false;
      }
    }
  }
  
  // Validar nombre único (solo para líneas nuevas)
  if (!editingLine.value) {
    const existingLine = lineas.value.find(l => 
      l.nombre.toLowerCase() === lineForm.nombre.toLowerCase().trim()
    );
    if (existingLine) {
      lineErrors.nombre = 'Ya existe una línea con este nombre';
      isValid = false;
    }
  }
  
  return isValid;
};

const validateCategory = () => {
  let isValid = true;
  
  // Reset errores
  Object.keys(categoryErrors).forEach(key => categoryErrors[key] = '');
  
  // Validar nombre (OBLIGATORIO)
  if (!categoryForm.nombre.trim()) {
    categoryErrors.nombre = 'El nombre es requerido';
    isValid = false;
  } else if (categoryForm.nombre.length < 2) {
    categoryErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    isValid = false;
  } else if (categoryForm.nombre.length > 30) {
    categoryErrors.nombre = 'El nombre no puede exceder 30 caracteres';
    isValid = false;
  }
  
  // Validar nombre único (solo para categorías nuevas)
  if (!editingCategory.value) {
    const existingCategory = categorias.value.find(c => 
      c.nombre.toLowerCase() === categoryForm.nombre.toLowerCase().trim()
    );
    if (existingCategory) {
      categoryErrors.nombre = 'Ya existe una categoría con este nombre';
      isValid = false;
    }
  }
  
  return isValid;
};

// Función para formatear RUC (solo números)
const formatRuc = (event) => {
  lineForm.ruc = event.target.value.replace(/\D/g, '');
};

// Datos de ejemplo para productos (estructura actualizada)
const productos = ref([
  { 
    nombre: 'Crema Hidratante', 
    descripcion: 'Crema hidratante para piel seca',
    precio_compra: 15.00,
    precio_venta: 29.99, 
    stock: 45, 
    estado: true,
    categoria: 'Cuidado Facial', 
    linea: 'Hidratación'
  },
  { 
    nombre: 'Aceite Esencial de Lavanda', 
    descripcion: 'Aceite puro de lavanda para aromaterapia',
    precio_compra: 8.00,
    precio_venta: 15.50, 
    stock: 32, 
    estado: true,
    categoria: 'Aromaterapia', 
    linea: 'Esenciales'
  },
  { 
    nombre: 'Jabón de Aloe Vera', 
    descripcion: 'Jabón natural con extracto de aloe vera',
    precio_compra: 4.00,
    precio_venta: 8.75, 
    stock: 78, 
    estado: true,
    categoria: 'Cuidado Corporal', 
    linea: 'Limpieza'
  },
  { 
    nombre: 'Mascarilla de Arcilla', 
    descripcion: 'Mascarilla purificante de arcilla verde',
    precio_compra: 10.00,
    precio_venta: 18.99, 
    stock: 21, 
    estado: false,
    categoria: 'Cuidado Facial', 
    linea: 'Tratamiento'
  }
]);

// Datos de ejemplo para líneas (estructura actualizada)
const lineas = ref([
  { nombre: 'Hidratación', ruc: '20123456789', productos: 12 },
  { nombre: 'Esenciales', ruc: '20987654321', productos: 8 },
  { nombre: 'Limpieza', ruc: '20456789123', productos: 15 },
  { nombre: 'Tratamiento', ruc: '', productos: 7 },
  { nombre: 'Protección', ruc: '20321654987', productos: 5 }
]);

// Datos de ejemplo para categorías (estructura actualizada)
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
  // Reset errores
  Object.keys(productErrors).forEach(key => productErrors[key] = '');
};

const resetProductForm = () => {
  productForm.nombre = '';
  productForm.descripcion = '';
  productForm.precio_compra = 0;
  productForm.precio_venta = 0;
  productForm.stock = 0;
  productForm.estado = true;
  productForm.categoria = '';
  productForm.linea = '';
};

const saveProduct = () => {
  if (!validateProduct()) {
    return;
  }
  
  if (editingProduct.value) {
    // Editar producto existente
    const index = productos.value.findIndex(p => p === editingProduct.value);
    if (index !== -1) {
      productos.value[index] = { ...productForm };
    }
  } else {
    // Crear nuevo producto
    productos.value.push({ ...productForm });
  }
  closeProductModal();
};

// Funciones para líneas
const openLineModal = (line = null) => {
  if (line) {
    editingLine.value = line;
    lineForm.nombre = line.nombre;
    lineForm.ruc = line.ruc || '';
  } else {
    editingLine.value = null;
    lineForm.nombre = '';
    lineForm.ruc = '';
  }
  showLineModal.value = true;
};

const closeLineModal = () => {
  showLineModal.value = false;
  editingLine.value = null;
  // Reset errores
  Object.keys(lineErrors).forEach(key => lineErrors[key] = '');
};

const saveLine = () => {
  if (!validateLine()) {
    return;
  }
  
  if (editingLine.value) {
    // Editar línea existente
    const index = lineas.value.findIndex(l => l === editingLine.value);
    if (index !== -1) {
      lineas.value[index].nombre = lineForm.nombre;
      lineas.value[index].ruc = lineForm.ruc || '';
    }
  } else {
    // Crear nueva línea
    lineas.value.push({
      nombre: lineForm.nombre,
      ruc: lineForm.ruc || '',
      productos: 0
    });
  }
  closeLineModal();
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
  // Reset errores
  Object.keys(categoryErrors).forEach(key => categoryErrors[key] = '');
};

const saveCategory = () => {
  if (!validateCategory()) {
    return;
  }
  
  if (editingCategory.value) {
    // Editar categoría existente
    const index = categorias.value.findIndex(c => c === editingCategory.value);
    if (index !== -1) {
      categorias.value[index].nombre = categoryForm.nombre;
      categorias.value[index].descripcion = categoryForm.descripcion || '';
    }
  } else {
    // Crear nueva categoría
    categorias.value.push({
      nombre: categoryForm.nombre,
      descripcion: categoryForm.descripcion || '',
      productos: 0,
      icon: Heart // Icono por defecto
    });
  }
  closeCategoryModal();
};

// Funciones para confirmación de eliminación
const confirmDeleteProduct = (index) => {
  deleteType.value = 'product';
  deleteIndex.value = index;
  deleteMessage.value = `¿Deseas eliminar el producto "${productos.value[index].nombre}"?`;
  showDeleteModal.value = true;
};

const confirmDeleteLine = (index) => {
  deleteType.value = 'line';
  deleteIndex.value = index;
  deleteMessage.value = `¿Deseas eliminar la línea "${lineas.value[index].nombre}"?`;
  showDeleteModal.value = true;
};

const confirmDeleteCategory = (index) => {
  deleteType.value = 'category';
  deleteIndex.value = index;
  deleteMessage.value = `¿Deseas eliminar la categoría "${categorias.value[index].nombre}"?`;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  deleteType.value = '';
  deleteIndex.value = -1;
  deleteMessage.value = '';
};

const confirmDelete = () => {
  if (deleteType.value === 'product') {
    productos.value.splice(deleteIndex.value, 1);
  } else if (deleteType.value === 'line') {
    lineas.value.splice(deleteIndex.value, 1);
  } else if (deleteType.value === 'category') {
    categorias.value.splice(deleteIndex.value, 1);
  }
  closeDeleteModal();
};
</script>

<style>
/* Estilos generales */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #333;
  line-height: 1.5;
}

.dashboard {
  display: flex;
  min-height: 100vh;
  background-color: #f9fafb;
}

/* Sidebar */
.sidebar {
  width: 250px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: none;
}

@media (min-width: 768px) {
  .sidebar {
    display: block;
  }
}

.logo {
  padding: 1.5rem;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #15803d;
}

.sidebar-nav {
  margin-top: 2rem;
}

.sidebar-item {
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #4b5563;
  transition: all 0.2s;
}

.sidebar-item:hover {
  background-color: #f0fdf4;
}

.sidebar-item.active {
  background-color: #f0fdf4;
  border-left: 4px solid #15803d;
  color: #15803d;
}

.sidebar-item .icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Header */
.header {
  background-color: white;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  z-index: 10;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.mobile-menu {
  display: flex;
  align-items: center;
}

@media (min-width: 768px) {
  .mobile-menu {
    display: none;
  }
}

.menu-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
}

.mobile-menu h1 {
  font-size: 1.25rem;
  font-weight: bold;
  color: #15803d;
  margin-left: 0.75rem;
}

.header-title {
  display: none;
}

@media (min-width: 768px) {
  .header-title {
    display: flex;
    align-items: center;
  }
}

.header-title h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1f2937;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

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

.avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #15803d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

/* Tabs */
.tabs-container {
  padding: 0 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.tabs {
  display: flex;
  overflow-x: auto;
}

.tab {
  padding: 0.75rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  border-bottom: 2px solid transparent;
  white-space: nowrap;
}

.tab:hover {
  color: #4b5563;
  border-bottom-color: #d1d5db;
}

.tab.active {
  color: #15803d;
  border-bottom-color: #15803d;
}

/* Mobile Sidebar */
.mobile-sidebar-overlay {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: flex;
}

.mobile-sidebar-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.mobile-sidebar {
  position: relative;
  display: flex;
  flex-direction: column;
  max-width: 20rem;
  width: 100%;
  background-color: white;
}

.mobile-sidebar-header {
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mobile-sidebar-header h1 {
  font-size: 1.25rem;
  font-weight: bold;
  color: #15803d;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #4b5563;
}

.mobile-sidebar-nav {
  margin-top: 1rem;
}

.mobile-sidebar-item {
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #4b5563;
}

.mobile-sidebar-item.active {
  background-color: #f0fdf4;
  border-left: 4px solid #15803d;
  color: #15803d;
}

.mobile-sidebar-item .icon {
  width: 1.25rem;
  height: 1.25rem;
  margin-right: 0.75rem;
}

/* Content */
.content {
  flex: 1;
  overflow: auto;
  background-color: #f9fafb;
  padding: 2rem 1rem;
}

.content-container {
  max-width: 1280px;
  margin: 0 auto;
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

.button.secondary {
  background-color: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.button.secondary:hover {
  background-color: #e5e7eb;
}

.button.danger {
  background-color: #ef4444;
  color: white;
}

.button.danger:hover {
  background-color: #dc2626;
}

.icon-small {
  width: 1rem;
  height: 1rem;
  margin-right: 0.25rem;
}

.icon-large {
  width: 3rem;
  height: 3rem;
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

/* Line Cell */
.line-cell {
  display: flex;
  align-items: center;
}

.line-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background-color: #f0fdf4;
  color: #15803d;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  margin-right: 1rem;
}

.line-name {
  font-weight: 500;
  color: #111827;
}

/* Badge */
.badge {
  display: inline-flex;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #f3f4f6;
  color: #4b5563;
}

.badge.active {
  background-color: #f0fdf4;
  color: #15803d;
}

/* Icon Buttons */
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

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal.delete-modal {
  max-width: 400px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
}

.modal-body {
  padding: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 1rem;
}

@media (min-width: 640px) {
  .form-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  margin-bottom: 0.5rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  transition: border-color 0.2s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #15803d;
  box-shadow: 0 0 0 3px rgba(21, 128, 61, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e5e7eb;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Estilos para validación y errores */
.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

.help-text {
  color: #6b7280;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  display: block;
}

/* Modal de confirmación de eliminación */
.delete-content {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.delete-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  background-color: #fef2f2;
  color: #ef4444;
  flex-shrink: 0;
}

.delete-text {
  flex: 1;
}

.delete-text h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #111827;
  margin-bottom: 0.5rem;
}

.delete-text p {
  color: #6b7280;
  margin-bottom: 0.5rem;
}

.warning-text {
  color: #ef4444;
  font-weight: 500;
}
</style>
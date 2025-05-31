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
          <!-- Tab Content -->
          <div v-if="activeTab === 'productos'" class="card">
            <div class="card-header">
              <div class="card-header-content">
                <h3>Productos</h3>
                <button class="button primary">
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
                    <th>Categoría</th>
                    <th>Línea</th>
                    <th>Stock</th>
                    <th>Precio</th>
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
                    <td>{{ producto.categoria }}</td>
                    <td>{{ producto.linea }}</td>
                    <td>{{ producto.stock }}</td>
                    <td>${{ producto.precio }}</td>
                    <td class="actions">
                      <button class="icon-button edit">
                        <Edit class="icon-small" />
                      </button>
                      <button class="icon-button delete">
                        <Trash class="icon-small" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="pagination">
              <div class="pagination-info">
                Mostrando 1-5 de 25 productos
              </div>
              <div class="pagination-controls">
                <button class="pagination-button">Anterior</button>
                <button class="pagination-button active">1</button>
                <button class="pagination-button">2</button>
                <button class="pagination-button">3</button>
                <button class="pagination-button">Siguiente</button>
              </div>
            </div>
          </div>

          <div v-if="activeTab === 'lineas'" class="card">
            <div class="card-header">
              <div class="card-header-content">
                <h3>Líneas de Productos</h3>
                <button class="button primary">
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
                    <th>Descripción</th>
                    <th>Productos</th>
                    <th>Estado</th>
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
                    <td>{{ linea.descripcion }}</td>
                    <td>{{ linea.productos }}</td>
                    <td>
                      <span class="badge" :class="{ active: linea.activo }">
                        {{ linea.activo ? 'Activo' : 'Inactivo' }}
                      </span>
                    </td>
                    <td class="actions">
                      <button class="icon-button edit">
                        <Edit class="icon-small" />
                      </button>
                      <button class="icon-button delete">
                        <Trash class="icon-small" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div v-if="activeTab === 'categorias'" class="card">
            <div class="card-header">
              <div class="card-header-content">
                <h3>Categorías</h3>
                <button class="button primary">
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
                    <p>{{ categoria.productos }} productos</p>
                  </div>
                </div>
                <div class="category-actions">
                  <button class="icon-button">
                    <Edit class="icon-small" />
                  </button>
                  <button class="icon-button">
                    <Trash class="icon-small" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
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

// Datos de ejemplo para productos
const productos = [
  { nombre: 'Crema Hidratante', categoria: 'Cuidado Facial', linea: 'Hidratación', stock: 45, precio: 29.99 },
  { nombre: 'Aceite Esencial de Lavanda', categoria: 'Aromaterapia', linea: 'Esenciales', stock: 32, precio: 15.50 },
  { nombre: 'Jabón de Aloe Vera', categoria: 'Cuidado Corporal', linea: 'Limpieza', stock: 78, precio: 8.75 },
  { nombre: 'Mascarilla de Arcilla', categoria: 'Cuidado Facial', linea: 'Tratamiento', stock: 21, precio: 18.99 },
  { nombre: 'Champú de Romero', categoria: 'Cuidado Capilar', linea: 'Limpieza', stock: 54, precio: 12.25 }
];

// Datos de ejemplo para líneas
const lineas = [
  { nombre: 'Hidratación', descripcion: 'Productos para hidratar la piel', productos: 12, activo: true },
  { nombre: 'Esenciales', descripcion: 'Aceites esenciales y aromaterapia', productos: 8, activo: true },
  { nombre: 'Limpieza', descripcion: 'Productos de limpieza corporal', productos: 15, activo: true },
  { nombre: 'Tratamiento', descripcion: 'Tratamientos específicos', productos: 7, activo: false },
  { nombre: 'Protección', descripcion: 'Protección solar y ambiental', productos: 5, activo: true }
];

// Datos de ejemplo para categorías
const categorias = [
  { nombre: 'Cuidado Facial', productos: 18, icon: Smile },
  { nombre: 'Cuidado Corporal', productos: 24, icon: Heart },
  { nombre: 'Aromaterapia', productos: 12, icon: Droplet },
  { nombre: 'Cuidado Capilar', productos: 9, icon: Leaf },
  { nombre: 'Protección Solar', productos: 6, icon: Sun },
  { nombre: 'Bienestar', productos: 15, icon: Heart }
];
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
  margin-top: 1.5rem;
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
  padding: 1rem;
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
  align-items: center;
  justify-content: space-between;
  transition: box-shadow 0.2s;
}

.category-card:hover {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.category-content {
  display: flex;
  align-items: center;
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
}

.category-info h4 {
  font-size: 0.875rem;
  font-weight: 500;
  color: #111827;
}

.category-info p {
  font-size: 0.75rem;
  color: #6b7280;
}

.category-actions {
  display: flex;
  gap: 0.5rem;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>
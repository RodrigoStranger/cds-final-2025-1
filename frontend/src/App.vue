<template>
  <div class="dashboard">
    <!-- Sidebar -->
    <Sidebar 
      :active-tab="activeTab" 
      :tabs="tabs"
      @tab-change="activeTab = $event"
    />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Main Content Area -->
      <main class="content">
        <div class="content-container">
          <!-- Dynamic Page Content -->
          <ProductsPage 
            v-if="activeTab === 'productos'" 
            :categorias="categorias"
            :lineas="lineas"
          />
          <LinesPage v-if="activeTab === 'lineas'" />
          <CategoriesPage v-if="activeTab === 'categorias'" />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Package, Tag, Grid } from 'lucide-vue-next';
import Sidebar from './components/Sidebar.vue';
import ProductsPage from './pages/ProductsPage.vue';
import LinesPage from './pages/LinesPage.vue';
import CategoriesPage from './pages/CategoriesPage.vue';

// Pestañas
const activeTab = ref('productos');
const tabs = [
  { id: 'productos', name: 'Productos', icon: Package },
  { id: 'lineas', name: 'Líneas', icon: Tag },
  { id: 'categorias', name: 'Categorías', icon: Grid }
];

// Datos compartidos para productos
const categorias = ref([
  { nombre: 'Cuidado Facial', descripcion: 'Productos para el cuidado del rostro', productos: 18 },
  { nombre: 'Cuidado Corporal', descripcion: 'Productos para el cuidado del cuerpo', productos: 24 },
  { nombre: 'Aromaterapia', descripcion: 'Aceites esenciales y productos aromáticos', productos: 12 },
  { nombre: 'Cuidado Capilar', descripcion: '', productos: 9 },
  { nombre: 'Protección Solar', descripcion: 'Productos de protección solar', productos: 6 }
]);

const lineas = ref([
  { nombre: 'Hidratación', ruc: '20123456789', productos: 12 },
  { nombre: 'Esenciales', ruc: '20987654321', productos: 8 },
  { nombre: 'Limpieza', ruc: '20456789123', productos: 15 },
  { nombre: 'Tratamiento', ruc: '', productos: 7 },
  { nombre: 'Protección', ruc: '20321654987', productos: 5 }
]);
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

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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

/* Estilos globales para formularios */
.form-group label.required::after {
  content: " *";
  color: #ef4444;
}

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
</style>

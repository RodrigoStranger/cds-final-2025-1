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
      <!-- Navbar -->
      <Navbar :user="currentUser" @logout="handleLogout" />
      
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
import { ref, onMounted } from 'vue';
import { Package, Tag, Grid } from 'lucide-vue-next';
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';
import ProductsPage from './pages/ProductsPage.vue';
import LinesPage from './pages/LinesPage.vue';
import CategoriesPage from './pages/CategoriesPage.vue';
import { useCategorias, useLineas } from './composables/useApi.js';

// Pestañas
const activeTab = ref('productos');
const tabs = [
  { id: 'productos', name: 'Productos', icon: Package },
  { id: 'lineas', name: 'Líneas', icon: Tag },
  { id: 'categorias', name: 'Categorías', icon: Grid }
];

// Usuario actual
const currentUser = ref({
  name: 'Juan Pérez',
  email: 'juan.perez@fabianatura.com',
  avatar: null // Si no hay avatar, se usará la inicial
});

// Función para manejar logout
const handleLogout = () => {
  // Aquí puedes agregar la lógica de logout
  console.log('Cerrando sesión...');
  // Por ejemplo: router.push('/login') o limpiar tokens
};

// Usar composables para cargar datos de la API
const categorias = ref([]);
const lineas = ref([]);

onMounted(async () => {
  const categoriasData = await useCategorias();
  categorias.value = categoriasData.categorias.value;

  const lineasData = await useLineas();
  lineas.value = lineasData.lineas.value;
});

</script>

<style>
@import './styles/App.css';
</style>

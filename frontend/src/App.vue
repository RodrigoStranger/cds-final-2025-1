<template>
  <div>
    <!-- Componente de carga global -->
    <GlobalLoading />
    
    <!-- Layout condicional -->
    <div v-if="!hideLayout" class="dashboard">
      <!-- Sidebar -->
      <Sidebar 
        :active-tab="activeTab" 
        :tabs="tabs"
        @logout="handleLogout"
      />

      <!-- Main Content -->
      <div class="main-content">
        <!-- Navbar -->
        <Navbar :user="currentUser" @logout="handleLogout" />
        
        <!-- Main Content Area -->
        <main class="content">
          <div class="content-container">
            <!-- Router View for Dynamic Page Content -->
            <router-view v-slot="{ Component }">
              <transition name="fade" mode="out-in">
                <component :is="Component" />
              </transition>
            </router-view>
          </div>
        </main>
      </div>
    </div>
    
    <!-- Login page sin layout -->
    <div v-else>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Package, Layers, Tag, Truck } from 'lucide-vue-next';
import { useAuthStore } from './stores/auth';
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';
import GlobalLoading from './components/GlobalLoading.vue';
import { provideLoading } from './composables/useLoading';
import { useToast } from './composables/useToast';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const { info: showToast } = useToast();

// Proveer el estado de carga global
const { startLoading, stopLoading } = provideLoading();

// Configurar el manejo de carga en el router
router.beforeEach((to, from, next) => {
  if (!to.meta.hideLayout) {
    startLoading('Cargando...');
  }
  next();
});

router.afterEach(() => {
  // Pequeño retraso para evitar parpadeo
  setTimeout(() => {
    stopLoading();
  }, 100);
});

// Computeds
const hideLayout = computed(() => route.meta.hideLayout || false);
const currentUser = computed(() => {
  if (authStore.user) {
    return {
      name: `${authStore.user.dni}`,
      email: authStore.isAdmin ? 'Administrador' : 'Empleado',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    };
  }
  return {
    name: 'Usuario',
    email: 'Sin autenticar',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  };
});

// Pestañas de navegación
const tabs = [
  { id: 'productos', label: 'Productos', icon: Package, route: '/productos' },
  { id: 'lineas', label: 'Líneas', icon: Layers, route: '/lineas' },
  { id: 'categorias', label: 'Categorías', icon: Tag, route: '/categorias' },
  { id: 'proveedores', label: 'Proveedores', icon: Truck, route: '/proveedores' },
];

// Pestaña activa basada en la ruta actual
const activeTab = computed(() => {
  const path = route.path;
  if (path.startsWith('/productos')) return 'productos';
  if (path.startsWith('/lineas')) return 'lineas';
  if (path.startsWith('/categorias')) return 'categorias';
  if (path.startsWith('/proveedores')) return 'proveedores';
  return 'productos';
});

// Manejar logout
const handleLogout = () => {
  authStore.logout();
  showToast('Sesión cerrada correctamente');
  router.push('/login');
};

// Verificar autenticación al iniciar
onMounted(async () => {
  // FORZAR limpieza completa al iniciar
  authStore.forceReset()
  
  // Si no estamos en login, redirigir allí
  if (route.path !== '/login') {
    router.push('/login')
  }
});
</script>

<style>
@import './styles/App.css';
</style>

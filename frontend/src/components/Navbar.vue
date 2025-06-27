<template>
  <nav class="navbar">
    <div class="navbar-container">
      <!-- Mobile Menu Button (solo visible en móvil) -->
      <div class="mobile-menu-section">
        <button @click="toggleMobileMenu" class="mobile-menu-button">
          <Menu class="icon" />
        </button>
        <span class="mobile-brand">FabiaNatura</span>
      </div>

      <!-- Spacer para empujar el contenido del usuario a la derecha -->
      <div class="navbar-spacer"></div>

      <!-- User Section -->
      <div class="user-section">
        <!-- User Info -->
        <div class="user-info">
          <span class="user-name">{{ user.name }}</span>
          <span class="user-email">{{ user.email }}</span>
        </div>

        <!-- User Avatar -->
        <div class="user-avatar" @click="toggleUserMenu">
          <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="avatar-image">
          <div v-else class="avatar-initial">
            {{ getUserInitial(user.name) }}
          </div>
        </div>

        <!-- User Dropdown Menu -->
        <div v-if="userMenuOpen" class="user-dropdown" @click.stop>
          <div class="dropdown-item" @click="handleLogout">
            <LogOut class="dropdown-icon" />
            <span>Cerrar Sesión</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div v-if="mobileMenuOpen" class="mobile-sidebar-overlay" @click="toggleMobileMenu">
      <div class="mobile-sidebar" @click.stop>
        <div class="mobile-sidebar-header">
          <h1>FabiaNatura</h1>
          <button @click="toggleMobileMenu" class="close-button">
            <Menu class="icon" />
          </button>
        </div>
        <!-- Aquí puedes agregar el contenido del menú móvil si es necesario -->
        <nav class="mobile-nav">
          <router-link 
            v-for="(tab, index) in tabs" 
            :key="index" 
            :to="tab.route"
            class="mobile-nav-item"
            :class="{ active: activeTab === tab.id }"
            @click="toggleMobileMenu"
          >
            <component :is="tab.icon" class="nav-icon" />
            <span>{{ tab.label }}</span>
          </router-link>
          
          <!-- Logout Button para móvil -->
          <div class="mobile-logout-section">
            <button @click="handleLogout" class="mobile-logout-button">
              <LogOut class="nav-icon" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </nav>
      </div>
    </div>

    <!-- Backdrop para cerrar menús -->
    <div v-if="userMenuOpen" class="backdrop" @click="closeAllMenus"></div>
  </nav>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { Menu, LogOut } from 'lucide-vue-next';

const route = useRoute();

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Usuario',
      email: 'usuario@ejemplo.com',
      avatar: null
    })
  },
  tabs: {
    type: Array,
    required: true,
    default: () => []
  }
});

// Emits
const emit = defineEmits(['logout']);

const mobileMenuOpen = ref(false);
const userMenuOpen = ref(false);

// Determinar la pestaña activa basada en la ruta actual
const activeTab = computed(() => {
  const path = route.path;
  if (path.startsWith('/productos')) return 'productos';
  if (path.startsWith('/lineas')) return 'lineas';
  if (path.startsWith('/categorias')) return 'categorias';
  if (path.startsWith('/proveedores')) return 'proveedores';
  return 'productos';
});

const getUserInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : 'U';
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
  userMenuOpen.value = false;
};

const toggleUserMenu = () => {
  userMenuOpen.value = !userMenuOpen.value;
  mobileMenuOpen.value = false;
};

const handleLogout = () => {
  closeAllMenus();
  emit('logout');
};

const closeAllMenus = () => {
  mobileMenuOpen.value = false;
  userMenuOpen.value = false;
};
</script>

<style scoped>
@import '../styles/components/Navbar.css';
</style>

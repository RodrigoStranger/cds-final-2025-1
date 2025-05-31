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
        <div class="user-avatar">
          <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="avatar-image">
          <div v-else class="avatar-initial">
            {{ getUserInitial(user.name) }}
          </div>
        </div>

        <!-- Dropdown Menu -->
        <div class="dropdown">
          <button @click="toggleDropdown" class="dropdown-button">
            <ChevronDown class="icon" :class="{ 'rotate-180': dropdownOpen }" />
          </button>

          <!-- Dropdown Content -->
          <div v-if="dropdownOpen" class="dropdown-content">
            <div class="dropdown-header">
              <div class="dropdown-avatar">
                <img v-if="user.avatar" :src="user.avatar" :alt="user.name" class="avatar-image">
                <div v-else class="avatar-initial">
                  {{ getUserInitial(user.name) }}
                </div>
              </div>
              <div class="dropdown-user-info">
                <div class="dropdown-name">{{ user.name }}</div>
                <div class="dropdown-email">{{ user.email }}</div>
              </div>
            </div>
            
            <div class="dropdown-divider"></div>
            
            <div class="dropdown-items">
              <button @click="handleLogout" class="dropdown-item logout">
                <LogOut class="icon" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mobile Sidebar Overlay -->
    <div v-if="mobileMenuOpen" class="mobile-sidebar-overlay" @click="closeMobileMenu">
      <div class="mobile-sidebar" @click.stop>
        <div class="mobile-sidebar-header">
          <h1>FabiaNatura</h1>
          <button @click="closeMobileMenu" class="close-button">
            <X class="icon" />
          </button>
        </div>
        <!-- Aquí puedes agregar el contenido del menú móvil si es necesario -->
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Menu, ChevronDown, LogOut, X } from 'lucide-vue-next';

defineProps({
  user: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['logout']);

const dropdownOpen = ref(false);
const mobileMenuOpen = ref(false);

const getUserInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : 'U';
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const closeMobileMenu = () => {
  mobileMenuOpen.value = false;
};

const handleLogout = () => {
  dropdownOpen.value = false;
  emit('logout');
};

// Cerrar dropdown al hacer click fuera
const handleClickOutside = (event) => {
  if (!event.target.closest('.dropdown')) {
    dropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
@import '../styles/components/Navbar.css';
</style>

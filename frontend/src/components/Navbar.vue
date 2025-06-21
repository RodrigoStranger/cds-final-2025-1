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
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { Menu } from 'lucide-vue-next';

const props = defineProps({
  user: {
    type: Object,
    required: true,
    default: () => ({
      name: 'Usuario',
      email: 'usuario@ejemplo.com',
      avatar: null
    })
  }
});

const mobileMenuOpen = ref(false);

const getUserInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : 'U';
};

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};
</script>

<style scoped>
@import '../styles/components/Navbar.css';
</style>

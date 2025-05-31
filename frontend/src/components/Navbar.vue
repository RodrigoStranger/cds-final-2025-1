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
                <button @click="handleProfile" class="dropdown-item">
                  <User class="icon" />
                  <span>Mi Perfil</span>
                </button>
                <button @click="handleSettings" class="dropdown-item">
                  <Settings class="icon" />
                  <span>Configuración</span>
                </button>
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
  import { Menu, ChevronDown, User, Settings, LogOut, X } from 'lucide-vue-next';
  
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
  
  const handleProfile = () => {
    console.log('Ir a perfil');
    dropdownOpen.value = false;
  };
  
  const handleSettings = () => {
    console.log('Ir a configuración');
    dropdownOpen.value = false;
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
  .navbar {
    background-color: white;
    border-bottom: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    position: sticky;
    top: 0;
    z-index: 30;
    /* En desktop, el navbar se posiciona a la derecha del sidebar */
    margin-left: 0;
  }
  
  @media (min-width: 768px) {
    .navbar {
      margin-left: 250px; /* Ancho del sidebar */
    }
  }
  
  .navbar-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.75rem 1.5rem;
    max-width: 100%;
  }
  
  /* Mobile Menu Section */
  .mobile-menu-section {
    display: flex;
    align-items: center;
  }
  
  @media (min-width: 768px) {
    .mobile-menu-section {
      display: none;
    }
  }
  
  .mobile-menu-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #4b5563;
    padding: 0.5rem;
    margin-right: 0.75rem;
  }
  
  .mobile-brand {
    font-size: 1.25rem;
    font-weight: bold;
    color: #15803d;
  }
  
  /* User Section */
  .user-section {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
    /* En desktop, asegurar que esté a la derecha */
    margin-left: auto;
  }
  
  @media (min-width: 768px) {
    .user-section {
      margin-left: auto;
    }
  }
  
  .user-info {
    display: none;
    flex-direction: column;
    align-items: flex-end;
  }
  
  @media (min-width: 768px) {
    .user-info {
      display: flex;
    }
  }
  
  .user-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
  }
  
  .user-email {
    font-size: 0.75rem;
    color: #6b7280;
  }
  
  .user-avatar {
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .avatar-initial {
    width: 100%;
    height: 100%;
    background-color: #15803d;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 1rem;
  }
  
  /* Dropdown */
  .dropdown {
    position: relative;
  }
  
  .dropdown-button {
    background: none;
    border: none;
    cursor: pointer;
    color: #6b7280;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s;
  }
  
  .dropdown-button:hover {
    color: #374151;
  }
  
  .dropdown-button .icon {
    width: 1.25rem;
    height: 1.25rem;
    transition: transform 0.2s;
  }
  
  .dropdown-button .icon.rotate-180 {
    transform: rotate(180deg);
  }
  
  .dropdown-content {
    position: absolute;
    right: 0;
    top: 100%;
    margin-top: 0.5rem;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    min-width: 16rem;
    z-index: 50;
  }
  
  .dropdown-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-bottom: 1px solid #f3f4f6;
  }
  
  .dropdown-avatar {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    overflow: hidden;
    flex-shrink: 0;
  }
  
  .dropdown-avatar .avatar-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .dropdown-avatar .avatar-initial {
    width: 100%;
    height: 100%;
    background-color: #15803d;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
  }
  
  .dropdown-user-info {
    flex: 1;
    min-width: 0;
  }
  
  .dropdown-name {
    font-size: 0.875rem;
    font-weight: 500;
    color: #111827;
    truncate: true;
  }
  
  .dropdown-email {
    font-size: 0.75rem;
    color: #6b7280;
    truncate: true;
  }
  
  .dropdown-divider {
    height: 1px;
    background-color: #f3f4f6;
  }
  
  .dropdown-items {
    padding: 0.5rem 0;
  }
  
  .dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
    padding: 0.75rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    color: #374151;
    font-size: 0.875rem;
    transition: background-color 0.2s;
    text-align: left;
  }
  
  .dropdown-item:hover {
    background-color: #f9fafb;
  }
  
  .dropdown-item.logout {
    color: #ef4444;
  }
  
  .dropdown-item.logout:hover {
    background-color: #fef2f2;
  }
  
  .dropdown-item .icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
  }
  
  /* Mobile Sidebar */
  .mobile-sidebar-overlay {
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 40;
    display: flex;
  }
  
  @media (min-width: 768px) {
    .mobile-sidebar-overlay {
      display: none;
    }
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
    border-bottom: 1px solid #e5e7eb;
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
    padding: 0.25rem;
  }
  
  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  </style>
  
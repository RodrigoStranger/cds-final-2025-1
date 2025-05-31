<template>
    <div class="sidebar-container">
      <!-- Desktop Sidebar -->
      <div class="sidebar">
        <div class="logo">
          <h1>FabiaNatura</h1>
        </div>
        <nav class="sidebar-nav">
          <div 
            v-for="(tab, index) in tabs" 
            :key="index" 
            @click="$emit('tab-change', tab.id)"
            class="sidebar-item"
            :class="{ active: activeTab === tab.id }"
          >
            <component :is="tab.icon" class="icon" />
            <span>{{ tab.name }}</span>
          </div>
        </nav>
      </div>
  
      <!-- Mobile Menu Button -->
      <div class="mobile-menu-button" @click="toggleMobileMenu">
        <Menu class="icon" />
        <span>FabiaNatura</span>
      </div>
  
      <!-- Mobile Sidebar -->
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
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import { Menu, X } from 'lucide-vue-next';
  
  defineProps({
    activeTab: String,
    tabs: Array
  });
  
  const emit = defineEmits(['tab-change']);
  
  const mobileMenuOpen = ref(false);
  
  const toggleMobileMenu = () => {
    mobileMenuOpen.value = !mobileMenuOpen.value;
  };
  
  const selectMobileTab = (tabId) => {
    emit('tab-change', tabId);
    mobileMenuOpen.value = false;
  };
  </script>
  
  <style scoped>
  .sidebar-container {
    position: relative;
  }
  
  /* Desktop Sidebar */
  .sidebar {
    width: 250px;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    display: none;
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 30;
  }
  
  @media (min-width: 768px) {
    .sidebar {
      display: block;
      position: relative;
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
  
  /* Mobile Menu Button */
  .mobile-menu-button {
    display: flex;
    align-items: center;
    padding: 1rem;
    background-color: white;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 20;
  }
  
  @media (min-width: 768px) {
    .mobile-menu-button {
      display: none;
    }
  }
  
  .mobile-menu-button .icon {
    width: 1.5rem;
    height: 1.5rem;
    margin-right: 0.75rem;
    color: #4b5563;
  }
  
  .mobile-menu-button span {
    font-size: 1.25rem;
    font-weight: bold;
    color: #15803d;
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
  
  .icon {
    width: 1.25rem;
    height: 1.25rem;
  }
  </style>
  
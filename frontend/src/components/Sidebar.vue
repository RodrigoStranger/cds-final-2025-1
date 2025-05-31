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
  </div>
</template>

<script setup>
import { Menu, X } from 'lucide-vue-next';

defineProps({
  activeTab: String,
  tabs: Array
});

defineEmits(['tab-change']);
</script>

<style scoped>
.sidebar-container {
  height: 100vh;
  flex-shrink: 0;
}

/* Desktop Sidebar */
.sidebar {
  width: 250px;
  background-color: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: none;
  height: 100vh;
  position: relative;
  z-index: 20;
  flex-direction: column;
}

@media (min-width: 768px) {
  .sidebar {
    display: flex;
  }
}

.logo {
  padding: 1.5rem;
  flex-shrink: 0;
  border-bottom: 1px solid #f3f4f6;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: bold;
  color: #15803d;
  margin: 0;
}

.sidebar-nav {
  flex: 1;
  overflow-y: auto;
  padding: 2rem 0;
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

.icon {
  width: 1.25rem;
  height: 1.25rem;
}
</style>

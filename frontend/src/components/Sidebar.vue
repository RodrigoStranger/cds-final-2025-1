<template>
  <div class="sidebar-container">
    <!-- Desktop Sidebar -->
    <div class="sidebar">
      <div class="logo">
        <h1>FabiaNatura</h1>
      </div>
      <nav class="sidebar-nav">
        <router-link 
          v-for="(tab, index) in tabs" 
          :key="index" 
          :to="tab.route"
          class="sidebar-item"
          :class="{ active: activeTab === tab.id }"
        >
          <component :is="tab.icon" class="icon" />
          <span>{{ tab.label }}</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { Menu, X } from 'lucide-vue-next';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const props = defineProps({
  tabs: {
    type: Array,
    required: true
  }
});

// Determinar la pestaña activa basada en la ruta actual
const activeTab = computed(() => {
  const path = route.path;
  if (path.startsWith('/productos')) return 'productos';
  if (path.startsWith('/lineas')) return 'lineas';
  if (path.startsWith('/categorias')) return 'categorias';
  if (path.startsWith('/proveedores')) return 'proveedores';
  return 'productos';
});
</script>

<style scoped>
@import '../styles/components/Sidebar.css';

/* Estilos para los enlaces del router */
.sidebar-item {
  text-decoration: none;
  color: inherit;
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  border-radius: 0.375rem;
  transition: all 0.2s;
  margin-bottom: 0.25rem;
}

.sidebar-item:hover {
  background-color: #f3f4f6;
}

.sidebar-item.active {
  background-color: #e5e7eb;
  font-weight: 500;
  color: #111827;
}

.sidebar-item .icon {
  margin-right: 0.75rem;
  width: 1.25rem;
  height: 1.25rem;
}
</style>

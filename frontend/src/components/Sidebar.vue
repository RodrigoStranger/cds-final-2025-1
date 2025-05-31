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
@import '../styles/components/Sidebar.css';
</style>

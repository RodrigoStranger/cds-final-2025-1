<template>
  <div v-if="isLoading" class="global-loading">
    <div class="loading-spinner"></div>
    <p>{{ loadingText }}</p>
  </div>
</template>

<script setup>
import { useLoading } from '@/composables/useLoading';

const { isLoading, loadingText } = useLoading();
</script>

<style scoped>
.global-loading {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(2px);
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #15803d;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

p {
  color: #374151;
  font-size: 1rem;
  margin-top: 1rem;
}
</style>

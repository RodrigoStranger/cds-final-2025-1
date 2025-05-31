<template>
  <transition name="fade">
    <div v-if="show" :class="['toast', `toast-${type}`]">
      <div class="toast-content">
        <span>{{ message }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'success',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 3000
  }
});

const show = ref(true);
let timer = null;

onMounted(() => {
  if (props.duration > 0) {
    timer = setTimeout(() => {
      show.value = false;
    }, props.duration);
  }
});

onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer);
  }
});
</script>

<style scoped>
.toast {
  padding: 12px 24px;
  border-radius: 4px;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-width: 300px;
  margin-bottom: 10px;
  opacity: 1;
  transition: all 0.3s ease;
  pointer-events: auto;
  display: flex;
  align-items: center;
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
}

.toast-success {
  background-color: #15803d;
}

.toast-error {
  background-color: #ef4444;
}

.toast-warning {
  background-color: #f59e0b;
}

.toast-info {
  background-color: #3b82f6;
}

/* Animation classes */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>

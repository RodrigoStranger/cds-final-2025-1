import { h, ref, createApp } from 'vue';
import Toast from '@/components/ui/Toast.vue';

// State
const toasts = ref([]);
let toastContainer = null;
let toastApp = null;

// Show a toast notification
function showToast(message, { duration = 3000, type = 'success' } = {}) {
  const id = Date.now().toString();
  
  const newToast = {
    id,
    message,
    type,
    duration,
    show: true
  };
  
  toasts.value.push(newToast);
  
  if (duration > 0) {
    setTimeout(() => removeToast(id), duration);
  }
  
  return id;
}

// Remove a toast by ID
function removeToast(id) {
  const index = toasts.value.findIndex(t => t.id === id);
  if (index !== -1) {
    toasts.value.splice(index, 1);
  }
}

// Initialize the toast container
function initToast() {
  if (toastContainer || typeof document === 'undefined') return;
  
  // Create container
  toastContainer = document.createElement('div');
  
  // Style the container
  Object.assign(toastContainer.style, {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    zIndex: '1000',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    pointerEvents: 'none',
    maxWidth: 'calc(100% - 40px)'
  });
  
  document.body.appendChild(toastContainer);
  
  // Create and mount the toast app
  toastApp = createApp({
    setup() {
      return { toasts };
    },
    render() {
      return h('div', { class: 'toast-wrapper' },
        toasts.value.map(toast =>
          h(Toast, {
            key: toast.id,
            message: toast.message,
            type: toast.type,
            duration: toast.duration
          })
        )
      );
    }
  });
  
  toastApp.mount(toastContainer);
}

// Composable function
export function useToast() {
  if (typeof document !== 'undefined' && !toastContainer) {
    initToast();
  }
  
  return {
    toasts,
    show: showToast,
    remove: removeToast,
    success: (msg, duration) => showToast(msg, { type: 'success', duration }),
    error: (msg, duration) => showToast(msg, { type: 'error', duration }),
    warning: (msg, duration) => showToast(msg, { type: 'warning', duration }),
    info: (msg, duration) => showToast(msg, { type: 'info', duration })
  };
}

// Plugin
const ToastPlugin = {
  install(app) {
    initToast();
    
    const toast = {
      success: (msg, duration) => showToast(msg, { type: 'success', duration }),
      error: (msg, duration) => showToast(msg, { type: 'error', duration }),
      warning: (msg, duration) => showToast(msg, { type: 'warning', duration }),
      info: (msg, duration) => showToast(msg, { type: 'info', duration }),
      remove: removeToast
    };
    
    app.config.globalProperties.$toast = toast;
    app.provide('toast', toast);
  }
};

export default ToastPlugin;

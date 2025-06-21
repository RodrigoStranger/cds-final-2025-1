import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ToastPlugin from './composables/useToast'

const app = createApp(App)

// Use plugins
app.use(router)
app.use(ToastPlugin)

// Mount the app
app.mount('#app')

// Make toast available in the console for debugging
if (import.meta.env.DEV) {
  window.$toast = app.config.globalProperties.$toast;
}
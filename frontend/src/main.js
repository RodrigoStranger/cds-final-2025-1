import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import ToastPlugin from './composables/useToast'

const app = createApp(App)
const pinia = createPinia()

// Use plugins
app.use(pinia)
app.use(router)
app.use(ToastPlugin)

// Mount the app
app.mount('#app')

// Make toast available in the console for debugging
if (import.meta.env.DEV) {
  window.$toast = app.config.globalProperties.$toast;
}
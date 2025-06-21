import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [
    vue(),
  ],
  server: {
    port: 5173,
    open: true,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // Configuración básica para desarrollo
  base: '/',
  build: {
    sourcemap: true,
    outDir: 'dist',
    assetsDir: 'assets'
  }
})

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Vite-Konfiguration fuer das Vue-Frontend
export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5174,
    strictPort: true,
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Puerto por defecto de Vite
    strictPort: true, // Forzar el uso de este puerto
    proxy: {
      '/api': {
        target: 'https://senaunitybackend-production.up.railway.app',
        changeOrigin: true,
        secure: false
      }
    }
  }
})

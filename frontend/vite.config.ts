import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Proxy API in dev to avoid CORS fiddling
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://127.0.0.1:8081',
    }
  }
})

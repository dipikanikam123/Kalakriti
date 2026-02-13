import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    host: true, // Expose to network (optional but good for testing)
    strictPort: true,
    watch: {
      usePolling: true, // Fixes hot reload issues on Windows
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // Proxy for uploads if they are served from relative path
      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    },
    hmr: {
      overlay: true, // Show errors on screen
    }
  }
})

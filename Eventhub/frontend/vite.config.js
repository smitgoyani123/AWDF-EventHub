import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // ── Dev-server proxy (local development) ──
    // In local development (npm run dev), any request starting with /api
    // is forwarded to the Express backend at http://localhost:5000.
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  preview: {
    // ── Preview server config (used in Docker) ──
    // In Docker, 'vite preview' serves the production build.
    // 'backend' is the Docker Compose service name resolved via internal DNS.
    host: '0.0.0.0',   // Listen on all interfaces (required inside Docker)
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://backend:5000',
        changeOrigin: true,
      },
    },
  },
})

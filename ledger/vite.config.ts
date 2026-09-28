import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const apiProxyTarget = process.env.API_PROXY_TARGET ?? 'http://localhost:3001'

const apiProxy = {
  '/api': apiProxyTarget,
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: apiProxy,
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    proxy: apiProxy,
  },
})

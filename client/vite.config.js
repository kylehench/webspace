import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/webspace',
  server: {
    proxy: {
      '/auth': {
        target: 'http://localhost:4000/',
        rewrite: (path) => path.replace(/^\/auth/, '')
      },
      '/webspace/api': {
        target: 'http://localhost:5000/',
        rewrite: (path) => path.replace(/^\/webspace/, '')
      }
    }
  }
})

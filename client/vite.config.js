import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// https://vitejs.dev/config/
export default ({mode}) => {
  // Path to the .env file
  const envFilePath = path.resolve(__dirname, '.env')
  
  // Check if the .env file exists
  if (!fs.existsSync(envFilePath)) {
    throw new Error('.env file not found. Please create an .env file. See .env.example for reference.');
  }

  return defineConfig({
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
}

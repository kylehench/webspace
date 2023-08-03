import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config();
const { VITE_URL_BASENAME, VITE_AUTH_URI, VITE_AUTH_URI_LOCAL, VITE_SERVER_URI, VITE_SERVER_URI_LOCAL } = process.env

// https://vitejs.dev/config/
export default ({ mode }) => {
  // Path to the .env file
  const envFilePath = path.resolve(__dirname, '.env')
  
  // Check if the .env file exists
  if (!fs.existsSync(envFilePath)) {
    throw new Error('.env file not found. Please create an .env file. See .env.example for reference.');
  }

  return defineConfig({
    plugins: [react()],
    base: VITE_URL_BASENAME,
    server: {
      proxy: {
        [VITE_AUTH_URI]: {
          target: VITE_AUTH_URI_LOCAL || 'http://localhost:4000/',
          rewrite: (path) => path.replace(RegExp(VITE_AUTH_URI), '')
        },
        [`${VITE_SERVER_URI}/api`]: {
          target: VITE_SERVER_URI_LOCAL || 'http://localhost:5000/',
          rewrite: (path) => path.replace(RegExp(VITE_SERVER_URI), '')
        }
      }
    }
  })
}
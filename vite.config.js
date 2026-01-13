import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/zomato_clone/',
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})


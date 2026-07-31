import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  build: {
    cssCodeSplit: true,
    reportCompressedSize: true,
    target: 'es2022',
  },
  plugins: [react(), tailwindcss()],
  server: {
    strictPort: true,
  },
})

